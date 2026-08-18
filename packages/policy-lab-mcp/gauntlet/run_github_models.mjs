import { readFile, writeFile } from 'node:fs/promises';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

const API_URL = 'https://models.github.ai/inference/chat/completions';
const API_VERSION = '2026-03-10';
const DEFAULT_MODEL = 'openai/gpt-4.1';
const DEFAULT_MAX_TURNS = 10;

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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function unique(values) {
  return [...new Set(values)];
}

function safeJson(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return JSON.stringify({ error: { code: 'CLIENT_SERIALIZATION_ERROR' } });
  }
}

async function githubModelCompletion({ token, model, messages, tools }) {
  let lastError = null;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': API_VERSION,
      },
      body: JSON.stringify({
        model,
        messages,
        tools,
        tool_choice: 'auto',
        temperature: 0,
        max_tokens: 2048,
      }),
    });

    const text = await response.text();
    if (response.ok) {
      const payload = JSON.parse(text);
      const choice = payload?.choices?.[0];
      if (!choice?.message) throw new Error('GitHub Models response did not include choices[0].message');
      return {
        message: choice.message,
        finishReason: choice.finish_reason ?? null,
        responseModel: payload.model ?? model,
        usage: payload.usage ?? null,
      };
    }

    lastError = new Error(`GitHub Models ${response.status}: ${text.slice(0, 1000)}`);
    if (![429, 500, 502, 503, 504].includes(response.status) || attempt === 3) break;
    await sleep(2000 * (2 ** attempt));
  }
  throw lastError;
}

function resourceBridgeTools() {
  return [
    {
      type: 'function',
      function: {
        name: 'mcp_list_resources',
        description: 'List resources exposed by the connected MCP server. This is generic MCP client functionality and does not access the repository, filesystem, or web.',
        parameters: { type: 'object', properties: {}, additionalProperties: false },
      },
    },
    {
      type: 'function',
      function: {
        name: 'mcp_read_resource',
        description: 'Read one resource exposed by the connected MCP server by exact URI. This cannot read repository or filesystem paths.',
        parameters: {
          type: 'object',
          properties: { uri: { type: 'string' } },
          required: ['uri'],
          additionalProperties: false,
        },
      },
    },
  ];
}

function discoveredToolDefinitions(mcpTools) {
  return mcpTools.map((tool) => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description ?? tool.title ?? `MCP tool ${tool.name}`,
      parameters: tool.inputSchema ?? { type: 'object', properties: {} },
    },
  }));
}

async function connectFreshMcp(caseId) {
  const client = new Client({ name: `policy-lab-cold-agent-${caseId}`, version: '1.0.0' });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ['src/stdio.mjs'],
  });
  await client.connect(transport);
  return { client, transport };
}

function initialMessages(testCase) {
  return [
    {
      role: 'system',
      content: [
        'You are a fresh autonomous agent evaluating an unknown MCP-backed system.',
        'You have no repository, README, web, filesystem, shell, or prior-case access.',
        'The non-mcp_* function tools available to you were discovered directly from the connected MCP server.',
        'mcp_list_resources and mcp_read_resource are generic client bridges that expose only MCP resources from that same server.',
        'Use the MCP rather than inventing missing facts. Treat tool results as authoritative for this task.',
        'Do not assume policy IDs, assurance levels, supported domains, or authority boundaries unless they are supplied in the task/input or discovered through MCP.',
      ].join(' '),
    },
    {
      role: 'user',
      content: testCase.input == null
        ? testCase.task
        : `${testCase.task}\n\nSupplied case input JSON:\n${JSON.stringify(testCase.input, null, 2)}`,
    },
  ];
}

async function runCase({ token, model, testCase, maxTurns }) {
  const run = {
    case_id: testCase.id,
    tools_discovered: [],
    resources_read: [],
    tool_calls: [],
    final_answer: null,
    model_turns: 0,
  };

  const { client } = await connectFreshMcp(testCase.id);
  try {
    const listedTools = await client.listTools();
    const mcpTools = listedTools.tools ?? [];
    run.tools_discovered = mcpTools.map((tool) => tool.name);

    const tools = [...discoveredToolDefinitions(mcpTools), ...resourceBridgeTools()];
    const messages = initialMessages(testCase);

    for (let turn = 0; turn < maxTurns; turn += 1) {
      run.model_turns = turn + 1;
      const completion = await githubModelCompletion({ token, model, messages, tools });
      if (!run.response_model) run.response_model = completion.responseModel;
      if (completion.usage) run.usage = completion.usage;

      const assistantMessage = completion.message;
      messages.push(assistantMessage);
      const toolCalls = Array.isArray(assistantMessage.tool_calls) ? assistantMessage.tool_calls : [];

      if (!toolCalls.length) {
        run.final_answer = assistantMessage.content ?? '';
        run.finish_reason = completion.finishReason;
        return run;
      }

      for (const toolCall of toolCalls) {
        const name = toolCall?.function?.name;
        let args;
        try {
          args = JSON.parse(toolCall?.function?.arguments || '{}');
        } catch (error) {
          args = null;
          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: safeJson({
              error: {
                code: 'CLIENT_INVALID_TOOL_ARGUMENTS',
                message: error instanceof Error ? error.message : String(error),
              },
            }),
          });
          continue;
        }

        if (name === 'mcp_list_resources') {
          const listed = await client.listResources();
          const resources = listed.resources ?? [];
          messages.push({ role: 'tool', tool_call_id: toolCall.id, content: safeJson(resources) });
          continue;
        }

        if (name === 'mcp_read_resource') {
          const uri = String(args?.uri ?? '');
          try {
            const result = await client.readResource({ uri });
            run.resources_read = unique([...run.resources_read, uri]);
            messages.push({ role: 'tool', tool_call_id: toolCall.id, content: safeJson(result) });
          } catch (error) {
            messages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: safeJson({ error: { code: 'MCP_RESOURCE_READ_ERROR', message: error instanceof Error ? error.message : String(error) } }),
            });
          }
          continue;
        }

        const callRecord = { name, arguments: args, result: null };
        try {
          const result = await client.callTool({ name, arguments: args ?? {} });
          callRecord.result = result;
          run.tool_calls.push(callRecord);
          messages.push({ role: 'tool', tool_call_id: toolCall.id, content: safeJson(result) });
        } catch (error) {
          callRecord.result = {
            isError: true,
            structuredContent: {
              ok: false,
              error: {
                code: 'MCP_CLIENT_CALL_ERROR',
                message: error instanceof Error ? error.message : String(error),
              },
            },
          };
          run.tool_calls.push(callRecord);
          messages.push({ role: 'tool', tool_call_id: toolCall.id, content: safeJson(callRecord.result) });
        }
      }
    }

    run.runner_error = {
      code: 'MAX_TURNS_EXCEEDED',
      message: `agent exceeded ${maxTurns} model turns without a final answer`,
    };
    return run;
  } finally {
    await client.close().catch(() => {});
  }
}

const args = parseArgs(process.argv.slice(2));
const bundlePath = args.bundle;
const outPath = args.out;
const model = args.model || DEFAULT_MODEL;
const maxTurns = Number(args['max-turns'] || DEFAULT_MAX_TURNS);
const token = process.env.GITHUB_TOKEN;

if (!bundlePath || !outPath) {
  throw new Error('usage: node gauntlet/run_github_models.mjs --bundle=<bundle.json> --out=<trace.json> [--model=openai/gpt-4.1] [--cases=A,B] [--max-turns=10]');
}
if (!token) throw new Error('GITHUB_TOKEN is required');
if (!Number.isInteger(maxTurns) || maxTurns < 1 || maxTurns > 30) throw new Error('--max-turns must be an integer from 1 to 30');

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
    name: 'github-models-cold-agent',
    model,
    external_agent_evidence: true,
    validation_only: false,
    fresh_model_context_per_case: true,
    fresh_mcp_process_per_case: true,
  },
  environment: {
    provider: 'GitHub Models',
    api: 'models.github.ai/inference/chat/completions',
    repository_access_exposed_to_model: false,
    web_access_exposed_to_model: false,
    filesystem_access_exposed_to_model: false,
    shell_access_exposed_to_model: false,
  },
  selected_case_ids: selectedCases.map((item) => item.id),
  runs: [],
};

for (const testCase of selectedCases) {
  process.stderr.write(`[cold-agent] ${model} -> ${testCase.id}\n`);
  try {
    trace.runs.push(await runCase({ token, model, testCase, maxTurns }));
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
process.stdout.write(`${JSON.stringify({ model, cases: trace.selected_case_ids, out: outPath }, null, 2)}\n`);
