import { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';
import {
  assessCase,
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
    return {
      isError: true,
      content: [{ type: 'text', text: message }],
    };
  }
}

function registerResources(server) {
  const catalog = catalogSnapshot();
  const boundaries = {
    mode: 'deterministic_read_only',
    core_surface: '@solarpunk/constraint-core workbench',
    network_required: false,
    blockchain_writes: false,
    operator_writes: false,
    filesystem_writes: false,
    arbitrary_policy_objects: false,
    ai_logic_inside_server: false,
    legal_authority_claimed: false,
    boundary: 'Policy Lab decisions are research outputs under declared evidence, context, provenance, and registered policy inputs; they are not legal issuance authority, settlement guarantees, or certification of physical source truth.',
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
      resources: [
        'policylab://about',
        'policylab://policies',
        'policylab://calculators',
        'policylab://provenance-levels',
        'policylab://boundaries',
      ],
      boundaries,
    },
  );
  staticJson('policies', 'policylab://policies', 'Built-in policies', 'Versioned registered case policies accepted by the v0 MCP.', catalog.policies);
  staticJson('calculators', 'policylab://calculators', 'Constraint calculators', 'Built-in calculator metadata without executable functions.', catalog.calculators);
  staticJson('provenance-levels', 'policylab://provenance-levels', 'Provenance levels', 'Declared L0-L4 assurance levels.', catalog.provenance_levels);
  staticJson('boundaries', 'policylab://boundaries', 'Policy Lab boundaries', 'Safety, authority, and side-effect boundaries for this MCP.', boundaries);
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
      description: 'Evaluate one case under one registered Policy Lab policy ID. Evidence hashes and required contexts are verified by constraint-core before a decision is returned.',
      annotations: readOnly,
      inputSchema: z.object({
        case_manifest: jsonObject,
        evidence: evidenceList,
        contexts: contextList,
        provenance: jsonObject.optional(),
        provenance_context: jsonObject.optional(),
        policy_id: z.string(),
      }),
    },
    async (input) => guarded(() => assessCase({
      caseManifest: input.case_manifest,
      evidence: input.evidence,
      contexts: input.contexts,
      provenance: input.provenance,
      provenanceContext: input.provenance_context,
      policyId: input.policy_id,
    })),
  );

  server.registerTool(
    'compare_policies',
    {
      title: 'Compare policies',
      description: 'Run the same case/evidence/provenance state through multiple registered policy IDs in declared order.',
      annotations: readOnly,
      inputSchema: z.object({
        case_manifest: jsonObject,
        evidence: evidenceList,
        contexts: contextList,
        provenance: jsonObject.optional(),
        provenance_context: jsonObject.optional(),
        policy_ids: z.array(z.string()).min(1),
      }),
    },
    async (input) => guarded(() => comparePolicies({
      caseManifest: input.case_manifest,
      evidence: input.evidence,
      contexts: input.contexts,
      provenance: input.provenance,
      provenanceContext: input.provenance_context,
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
      title: 'Classify assurance',
      description: 'Classify an evidence envelope into Policy Lab provenance level L0-L4 using explicitly declared provenance context.',
      annotations: readOnly,
      inputSchema: z.object({
        evidence: jsonObject,
        provenance_context: jsonObject,
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
