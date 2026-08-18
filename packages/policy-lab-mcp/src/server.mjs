import { readFile } from 'node:fs/promises';
import { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';
import {
  PolicyLabMcpError,
  assessCase,
  assuranceScenarioCatalog,
  buildReceipt,
  catalogSnapshot,
  classifyAssurance,
  comparePolicies,
  verifyCapsule,
  verifyEvidence,
} from './operations.mjs';

const jsonObject = z.record(z.string(), z.unknown());
const evidenceList = z.array(jsonObject).min(1);
const contextList = z.array(jsonObject).default([]);
const declaredProvenanceContext = z.object({
  trusted_operator_context: z.boolean().optional(),
  real_operator_source: z.boolean().optional(),
  external_corroboration: z.boolean().optional(),
  revenue_grade: z.boolean().optional(),
  gateway_custody: z.boolean().optional(),
  signed: z.boolean().optional(),
  live_gateway: z.boolean().optional(),
  operator_signed: z.boolean().optional(),
  cryptographically_verified: z.boolean().optional(),
}).strict();

const SCHEMA_RESOURCES = Object.freeze([
  ['schema-case', 'policylab://schemas/case', 'Case manifest schema', 'case-manifest.v1.schema.json'],
  ['schema-evidence', 'policylab://schemas/evidence', 'Evidence envelope schema', 'evidence-envelope.v1.schema.json'],
  ['schema-context', 'policylab://schemas/context', 'Context manifest schema', 'context-manifest.v1.schema.json'],
  ['schema-decision', 'policylab://schemas/decision', 'Decision result schema', 'decision-result.v1.schema.json'],
  ['schema-receipt', 'policylab://schemas/receipt', 'Decision receipt schema', 'decision-receipt.v1.schema.json'],
  ['schema-assurance-scenario', 'policylab://schemas/assurance-scenario', 'Assurance scenario schema', 'provenance-scenario.v1.schema.json'],
]);

function success(value) {
  return {
    content: [{ type: 'text', text: JSON.stringify(value, null, 2) }],
    structuredContent: value,
  };
}

async function guarded(operation) {
  try {
    return success(await operation());
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const payload = {
      error: {
        code: error instanceof PolicyLabMcpError ? error.code : 'POLICY_LAB_CORE_ERROR',
        message,
        details: error instanceof PolicyLabMcpError ? error.details : {},
      },
    };
    return {
      isError: true,
      content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  }
}

async function readBundledSchema(filename) {
  const url = new URL(`../../../protocol/schema/${filename}`, import.meta.url);
  return JSON.parse(await readFile(url, 'utf8'));
}

function registerResources(server) {
  const catalog = catalogSnapshot();
  const boundaries = {
    mode: 'deterministic_read_only',
    core_surface: '@solarpunk/constraint-core workbench',
    network_required: false,
    bundled_filesystem_reads: true,
    blockchain_writes: false,
    operator_writes: false,
    filesystem_writes: false,
    arbitrary_policy_objects: false,
    caller_assurance_authority: false,
    registered_counterfactuals_only: true,
    ai_logic_inside_server: false,
    legal_authority_claimed: false,
    supported_case_types: catalog.supported_case_types,
    boundary: 'Policy Lab decisions are research outputs under declared evidence, modeled context, derived assurance, and registered policy inputs; they are not legal issuance authority, settlement guarantees, or certification of physical source truth.',
  };

  const errors = {
    INVALID_INPUT: 'Malformed or missing MCP input.',
    INVALID_CASE: 'Case manifest failed canonical validation.',
    UNSUPPORTED_DOMAIN: 'The case type is outside the v0 energy-site decision ontology.',
    MISSING_EVIDENCE: 'A case-referenced evidence envelope was not supplied.',
    EVIDENCE_INTEGRITY_ERROR: 'An evidence envelope failed deterministic hash verification.',
    MISSING_CONTEXT: 'A case-referenced modeled context was not supplied.',
    UNKNOWN_POLICY: 'The requested policy ID is not registered.',
    UNKNOWN_ASSURANCE_SCENARIO: 'The requested controlled assurance scenario ID is not registered.',
    INVALID_REGISTERED_SCENARIO: 'A bundled scenario failed its own registration preflight.',
    AMBIGUOUS_ASSURANCE: 'Decision assurance could not be classified unambiguously.',
    POLICY_LAB_CORE_ERROR: 'The deterministic core rejected an input outside the wrapper preflight contract.',
  };

  const examples = {
    principle: 'Decision tools never accept caller-authored provenance level or arbitrary policy objects.',
    policy_resolution: {
      rule: 'If a task names/describes a policy but does not supply its exact registered ID, read policylab://policies and resolve that requested policy before calling a decision tool.',
      warning: 'case_manifest.default_policy_ref is case metadata; do not silently substitute it for a differently requested policy.',
    },
    assess_evidence_only: {
      tool: 'assess_case',
      arguments: ['case_manifest', 'evidence', 'contexts', 'policy_id'],
      assurance: 'Derived with no trusted-operator assertions; typically L0 for fixture/browser-local evidence.',
    },
    assess_registered_counterfactual: {
      tool: 'assess_case',
      arguments: ['case_manifest', 'evidence', 'contexts', 'policy_id', 'assurance_scenario_id'],
      assurance: 'assurance_scenario_id must be discovered from policylab://assurance-scenarios.',
      boundary: 'Registered scenarios are controlled counterfactuals; they do not convert sample evidence into realized operator evidence.',
    },
    compare_registered_policies: {
      tool: 'compare_policies',
      arguments: ['case_manifest', 'evidence', 'contexts', 'policy_ids'],
      note: 'Use the same evidence and assurance basis across policies to observe policy divergence.',
    },
  };

  const staticJson = (name, uri, title, description, value) => {
    server.registerResource(
      name,
      uri,
      { title, description, mimeType: 'application/json' },
      async (requestedUri) => ({
        contents: [{
          uri: requestedUri.href,
          mimeType: 'application/json',
          text: JSON.stringify(value, null, 2),
        }],
      }),
    );
  };

  const resourceUris = [
    'policylab://about',
    'policylab://policies',
    'policylab://calculators',
    'policylab://provenance-levels',
    'policylab://assurance-scenarios',
    'policylab://schemas/case',
    'policylab://schemas/evidence',
    'policylab://schemas/context',
    'policylab://schemas/decision',
    'policylab://schemas/receipt',
    'policylab://schemas/assurance-scenario',
    'policylab://errors',
    'policylab://examples',
    'policylab://boundaries',
  ];

  staticJson(
    'about',
    'policylab://about',
    'Policy Lab MCP',
    'Canonical machine-interface summary for the deterministic Policy Lab surface.',
    {
      name: 'solarpunk-policy-lab',
      version: '0.0.1',
      transport_default: 'stdio',
      tools: [
        'assess_case',
        'compare_policies',
        'verify_evidence',
        'classify_assurance',
        'build_receipt',
        'verify_capsule',
      ],
      resources: resourceUris,
      boundaries,
    },
  );
  staticJson('policies', 'policylab://policies', 'Built-in policies', 'Versioned registered case policies accepted by the v0 MCP. Read this resource whenever a requested policy is given by name/role instead of an exact policy ID.', catalog.policies);
  staticJson('calculators', 'policylab://calculators', 'Constraint calculators', 'Built-in calculator metadata without executable functions.', catalog.calculators);
  staticJson('provenance-levels', 'policylab://provenance-levels', 'Provenance levels', 'Declared L0-L4 assurance levels.', catalog.provenance_levels);
  staticJson('errors', 'policylab://errors', 'MCP error codes', 'Stable wrapper-level error codes intended for autonomous recovery.', errors);
  staticJson('examples', 'policylab://examples', 'MCP usage recipes', 'Machine-readable operation recipes without repository-specific coaching.', examples);
  staticJson('boundaries', 'policylab://boundaries', 'Policy Lab boundaries', 'Safety, authority, supported-domain, and side-effect boundaries for this MCP.', boundaries);

  server.registerResource(
    'assurance-scenarios',
    'policylab://assurance-scenarios',
    {
      title: 'Registered assurance scenarios',
      description: 'Controlled counterfactual assurance scenarios that decision tools may reference by ID. They do not alter observed evidence identity.',
      mimeType: 'application/json',
    },
    async (requestedUri) => ({
      contents: [{
        uri: requestedUri.href,
        mimeType: 'application/json',
        text: JSON.stringify(await assuranceScenarioCatalog(), null, 2),
      }],
    }),
  );

  for (const [name, uri, title, filename] of SCHEMA_RESOURCES) {
    server.registerResource(
      name,
      uri,
      {
        title,
        description: `Bundled canonical JSON Schema from protocol/schema/${filename}.`,
        mimeType: 'application/schema+json',
      },
      async (requestedUri) => ({
        contents: [{
          uri: requestedUri.href,
          mimeType: 'application/schema+json',
          text: JSON.stringify(await readBundledSchema(filename), null, 2),
        }],
      }),
    );
  }
}

function registerTools(server) {
  const readOnly = {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  };

  server.registerTool(
    'assess_case',
    {
      title: 'Assess case',
      description: 'Evaluate one supported energy case under one registered Policy Lab policy ID. If the task names/describes a policy without its exact ID, resolve it from policylab://policies first; do not silently use case_manifest.default_policy_ref when a different policy was requested. Caller-authored provenance is not accepted. With no assurance_scenario_id, assurance is evidence-only; a scenario ID must name a registered controlled counterfactual.',
      annotations: readOnly,
      inputSchema: z.object({
        case_manifest: jsonObject,
        evidence: evidenceList,
        contexts: contextList,
        assurance_scenario_id: z.string().optional(),
        policy_id: z.string().describe('Exact registered policy ID. Resolve human-readable policy names/roles from policylab://policies; do not substitute case_manifest.default_policy_ref for a differently requested policy.'),
      }),
    },
    async (input) => guarded(() => assessCase({
      caseManifest: input.case_manifest,
      evidence: input.evidence,
      contexts: input.contexts,
      assuranceScenarioId: input.assurance_scenario_id,
      policyId: input.policy_id,
    })),
  );

  server.registerTool(
    'compare_policies',
    {
      title: 'Compare policies',
      description: 'Run the same supported energy case/evidence state through multiple registered policy IDs. Resolve named/described policies from policylab://policies rather than inferring them from case defaults. Caller-authored provenance is not accepted by this decision tool.',
      annotations: readOnly,
      inputSchema: z.object({
        case_manifest: jsonObject,
        evidence: evidenceList,
        contexts: contextList,
        assurance_scenario_id: z.string().optional(),
        policy_ids: z.array(z.string()).min(1).describe('Exact registered policy IDs, resolved from policylab://policies when the task gives human-readable names/roles.'),
      }),
    },
    async (input) => guarded(() => comparePolicies({
      caseManifest: input.case_manifest,
      evidence: input.evidence,
      contexts: input.contexts,
      assuranceScenarioId: input.assurance_scenario_id,
      policyIds: input.policy_ids,
    })),
  );

  server.registerTool(
    'verify_evidence',
    {
      title: 'Verify evidence envelope',
      description: 'Recompute and verify the declared deterministic evidence-envelope SHA-256 identity.',
      annotations: readOnly,
      inputSchema: z.object({ evidence: jsonObject }),
    },
    async (input) => guarded(() => verifyEvidence({ evidence: input.evidence })),
  );

  server.registerTool(
    'classify_assurance',
    {
      title: 'Classify declared assurance',
      description: 'Explain how an explicitly declared assurance context maps to L0-L4. This classifier is informational only; assess_case and compare_policies do not accept its caller-authored result as decision authority.',
      annotations: readOnly,
      inputSchema: z.object({
        evidence: jsonObject,
        provenance_context: declaredProvenanceContext,
      }),
    },
    async (input) => guarded(() => classifyAssurance({
      evidence: input.evidence,
      provenanceContext: input.provenance_context,
    })),
  );

  server.registerTool(
    'build_receipt',
    {
      title: 'Build decision receipt',
      description: 'Build a portable decision receipt. evaluated_at is mandatory so the MCP never injects hidden wall-clock nondeterminism.',
      annotations: readOnly,
      inputSchema: z.object({
        decision: jsonObject,
        evaluated_at: z.string(),
        runtime: z.object({
          package: z.string(),
          package_version: z.string().nullable().optional(),
          source_revision: z.string(),
        }),
        data_boundary: z.string(),
        raw_evidence_included: z.boolean().default(false),
      }),
    },
    async (input) => guarded(() => buildReceipt({
      decision: input.decision,
      evaluatedAt: input.evaluated_at,
      runtime: input.runtime,
      dataBoundary: input.data_boundary,
      rawEvidenceIncluded: input.raw_evidence_included,
    })),
  );

  server.registerTool(
    'verify_capsule',
    {
      title: 'Verify research capsule',
      description: 'Verify a portable research capsule and optionally replay its declared decision against supplied pack objects.',
      annotations: readOnly,
      inputSchema: z.object({
        bundle: jsonObject,
        pack_replay: jsonObject.optional(),
      }),
    },
    async (input) => guarded(() => verifyCapsule({
      bundle: input.bundle,
      packReplay: input.pack_replay,
    })),
  );
}

export function createPolicyLabMcpServer() {
  const server = new McpServer({
    name: 'solarpunk-policy-lab',
    version: '0.0.1',
  });
  registerResources(server);
  registerTools(server);
  return server;
}
