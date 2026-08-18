import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CopilotClient, defineTool } from '@github/copilot-sdk';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

function parseArgs(argv) {
  const out = {};
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const index = arg.indexOf('=');
    if (index === -1) out[arg.slice(2)] = true;
    else out[arg.slice(2, index)] = arg.slice(index + 1);
  }
  return out;
}

function unique(values) {
  return [...new Set(values)];
}

async function connectFreshMcp(caseId) {
  const client = new Client({ name: `policy-lab-copilot-sdk-${caseId}`, version: '1.0.0' });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ['src/stdio.mjs'],
  });
  await client.connect(transport);
  return client;
}

function promptFor(testCase) {
  const rules = [
    'You are a fresh autonomous agent evaluating an unknown system through a constrained machine interface.',
    'The only system capabilities available to you are the custom tools in this session; they are direct proxies for one connected Policy Lab MCP server.',
    'You have no repository, README, filesystem, shell, web, GitHub, memory, or prior-case access.',
    'Use the tools rather than inventing missing facts.',
    'Do not assume policy IDs, assurance levels, supported domains, or authority boundaries unless they are supplied below or discovered through the connected interface.',
    'Treat tool outputs as authoritative for this task, while preserving any authority limitations they state.',
  ].join(' ');
  return testCase.input == null
    ? `${rules}\n\nTASK:\n${testCase.task}`
    : `${rules}\n\nTASK:\n${testCase.task}\n\nSUPPLIED CASE INPUT JSON:\n${JSON.stringify(testCase.input, null, 2)}`;
}

function normalizedToolResult(result) {
  return result?.structuredContent ?? result;
}

async function runCase({ token, testCase }) {
  const caseRoot = await mkdtemp(join(tmpdir(), `policy-lab-copilot-sdk-${testCase.id}-`));
  const copilotHome = join(caseRoot, 'copilot-home');
  const workspace = join(caseRoot, 'workspace');
  const run = {
    case_id: testCase.id,
    tools_discovered: [],
    resources_read: [],
    tool_calls: [],
    final_answer: null,
  };

  const mcp = await connectFreshMcp(testCase.id);
  let copilot = null;
  try {
    const listed = await mcp.listTools();
    const mcpTools = listed.tools ?? [];
    run.tools_discovered = mcpTools.map((tool) => tool.name);

    const customTools = mcpTools.map((tool) => defineTool(tool.name, {
      description: tool.description ?? tool.title ?? `Policy Lab MCP tool ${tool.name}`,
      parameters: tool.inputSchema ?? { type: 'object', properties: {} },
      handler: async (args) => {
        let result;
        try {
          result = await mcp.callTool({ name: tool.name, arguments: args ?? {} });
        } catch (error) {
          result = {
            isError: true,
            structuredContent: {
              ok: false,
              error: {
                code: 'MCP_CLIENT_CALL_ERROR',
                message: error instanceof Error ? error.message : String(error),
              },
            },
          };
        }
        run.tool_calls.push({ name: tool.name, arguments: args ?? {}, result });
        return normalizedToolResult(result);
      },
    }));

    customTools.push(defineTool('mcp_list_resources', {
      description: 'List resources exposed by the connected Policy Lab MCP server. This accesses only MCP resources, not files, repository content, or the web.',
      parameters: { type: 'object', properties: {}, additionalProperties: false },
      handler: async () => {
        const result = await mcp.listResources();
        return result.resources ?? [];
      },
    }));

    customTools.push(defineTool('mcp_read_resource', {
      description: 'Read one resource exposed by the connected Policy Lab MCP server by exact URI. This accesses only MCP resources.',
      parameters: {
        type: 'object',
        properties: { uri: { type: 'string' } },
        required: ['uri'],
        additionalProperties: false,
      },
      handler: async ({ uri }) => {
        const exactUri = String(uri ?? '');
        const result = await mcp.readResource({ uri: exactUri });
        run.resources_read = unique([...run.resources_read, exactUri]);
        return result;
      },
    }));

    copilot = new CopilotClient({
      mode: 'empty',
      workingDirectory: workspace,
      baseDirectory: copilotHome,
      gitHubToken: token,
      useLoggedInUser: false,
      logLevel: 'error',
    });

    const session = await copilot.createSession({
      model: 'auto',
      tools: customTools,
      availableTools: ['custom:*'],
    });

    const response = await session.sendAndWait({ prompt: promptFor(testCase) });
    run.final_answer = response?.data?.content ?? null;
    run.response_event_type = response?.type ?? null;
    await session.disconnect().catch(() => {});
    return run;
  } finally {
    if (copilot) await copilot.stop().catch(() => {});
    await mcp.close().catch(() => {});
    await rm(caseRoot, { recursive: true, force: true }).catch(() => {});
  }
}

const args = parseArgs(process.argv.slice(2));
const bundlePath = args.bundle;
const outPath = args.out;
const token = process.env.GITHUB_TOKEN;

if (!bundlePath || !outPath) {
  throw new Error('usage: node gauntlet/run_copilot_sdk.mjs --bundle=<bundle.json> --out=<trace.json> [--cases=A,B]');
}
if (!token) throw new Error('GITHUB_TOKEN is required');

const bundle = JSON.parse(await readFile(bundlePath, 'utf8'));
if (bundle.schema !== 'solarpunk.policy_lab.agent_gauntlet_bundle.v1') {
  throw new Error('bundle schema must be solarpunk.policy_lab.agent_gauntlet_bundle.v1');
}

const selectedIds = args.cases
  ? new Set(args.cases.split(',').map((item) => item.trim()).filter(Boolean))
  : null;
const selectedCases = selectedIds ? bundle.cases.filter((item) => selectedIds.has(item.id)) : bundle.cases;
if (selectedIds && selectedCases.length !== selectedIds.size) {
  const known = new Set(bundle.cases.map((item) => item.id));
  const unknown = [...selectedIds].filter((item) => !known.has(item));
  throw new Error(`unknown bundle case id(s): ${unknown.join(', ')}`);
}

const trace = {
  schema: 'solarpunk.policy_lab.agent_gauntlet_trace.v1',
  spec_version: bundle.spec_version,
  protocol: bundle.protocol,
  agent: {
    name: 'github-copilot-sdk-cold-agent',
    model: 'auto',
    provider: 'GitHub Copilot',
    external_agent_evidence: true,
    validation_only: false,
    fresh_model_context_per_case: true,
    fresh_copilot_runtime_per_case: true,
    fresh_mcp_process_per_case: true,
  },
  environment: {
    driver: '@github/copilot-sdk',
    client_mode: 'empty',
    exposed_tools: 'custom Policy Lab MCP proxies only',
    repository_access_exposed_to_model: false,
    web_access_exposed_to_model: false,
    filesystem_access_exposed_to_model: false,
    shell_access_exposed_to_model: false,
    github_access_exposed_to_model: false,
    memory_access_exposed_to_model: false,
  },
  selected_case_ids: selectedCases.map((item) => item.id),
  runs: [],
};

for (const testCase of selectedCases) {
  process.stderr.write(`[copilot-sdk-cold-agent] ${testCase.id}\n`);
  try {
    trace.runs.push(await runCase({ token, testCase }));
  } catch (error) {
    trace.runs.push({
      case_id: testCase.id,
      tools_discovered: [],
      resources_read: [],
      tool_calls: [],
      final_answer: null,
      runner_error: {
        code: 'RUNNER_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

await writeFile(outPath, `${JSON.stringify(trace, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({
  driver: 'GitHub Copilot SDK',
  cases: trace.selected_case_ids,
  out: outPath,
}, null, 2)}\n`);
