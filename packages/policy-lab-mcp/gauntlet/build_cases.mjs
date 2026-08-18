import { readFile } from 'node:fs/promises';

const HERE = new URL('./', import.meta.url);
const PACK_ROOT = new URL('../../../protocol/cases/energy-v1/', import.meta.url);

async function readJson(url) {
  return JSON.parse(await readFile(url, 'utf8'));
}

async function loadPack() {
  const pack = await readJson(new URL('case-pack.json', PACK_ROOT));
  const cases = await Promise.all(pack.case_files.map((path) => readJson(new URL(path, PACK_ROOT))));
  const evidence = await Promise.all(pack.evidence_files.map((path) => readJson(new URL(path, PACK_ROOT))));
  const contexts = await Promise.all(pack.context_files.map((path) => readJson(new URL(path, PACK_ROOT))));
  return {
    casesById: Object.fromEntries(cases.map((item) => [item.case_id, item])),
    evidenceByHash: Object.fromEntries(evidence.map((item) => [item.evidence_hash, item])),
    contexts,
  };
}

function deepClone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function fixtureInput(loaded, fixture) {
  if (!fixture) return null;
  const caseManifest = deepClone(loaded.casesById[fixture.case_id]);
  if (!caseManifest) throw new Error(`unknown gauntlet fixture case_id: ${fixture.case_id}`);

  if (fixture.override_case_type) caseManifest.case_type = fixture.override_case_type;

  const evidence = caseManifest.evidence_refs.map((hash) => deepClone(loaded.evidenceByHash[hash]));
  if (fixture.tamper_evidence_summary_plus_kwh != null) {
    if (evidence.length !== 1) throw new Error('tamper fixture requires exactly one evidence envelope');
    evidence[0].summary.total_eligible_surplus_kwh = Number(evidence[0].summary.total_eligible_surplus_kwh)
      + Number(fixture.tamper_evidence_summary_plus_kwh);
  }

  return {
    case_manifest: caseManifest,
    evidence,
    contexts: fixture.omit_contexts ? [] : deepClone(loaded.contexts),
  };
}

const spec = await readJson(new URL('spec.v1.json', HERE));
const loaded = await loadPack();

const bundle = {
  schema: 'solarpunk.policy_lab.agent_gauntlet_bundle.v1',
  spec_version: spec.version,
  protocol: {
    fresh_context_per_case: spec.fresh_context_per_case,
    repository_access_allowed: spec.repository_access_allowed,
    readme_access_allowed: spec.readme_access_allowed,
    mcp_is_only_system_interface: spec.mcp_is_only_system_interface,
  },
  cases: spec.cases.map((item) => ({
    id: item.id,
    category: item.category,
    task: item.task,
    input: fixtureInput(loaded, item.fixture),
  })),
};

process.stdout.write(`${JSON.stringify(bundle, null, 2)}\n`);
