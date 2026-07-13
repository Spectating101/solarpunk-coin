#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  applySettlementResult,
  buildEvidenceEnvelope,
  classifyProvenance,
  comparePolicies,
  createClaimManifest,
  evaluatePolicy,
  evaluateSettlement,
  makeIssuedClaim,
  normalizeCumulativePair,
  policyById,
} from '../packages/constraint-core/src/index.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
const writeJson = (relativePath, value) => {
  const target = path.join(ROOT, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

const start = readJson('data/inverter/sample_cumulative_start.json');
const end = readJson('data/inverter/sample_cumulative_end.json');
const normalized = normalizeCumulativePair(start, end);
const evidence = await buildEvidenceEnvelope(normalized, { source_label: 'bundled cumulative meter sample' });
const provenance = classifyProvenance(evidence, { sample_fixture: true });
const policyDecisions = comparePolicies({ evidence, provenance });
const labDecision = evaluatePolicy({ evidence, provenance, policy: policyById('LAB-OPEN-001') });
const admittedClaim = await createClaimManifest({
  evidence,
  provenance,
  policyDecision: labDecision,
  subject: 'constraint-protocol-alpha-demo',
});
const activeClaim = makeIssuedClaim(admittedClaim, Math.min(20, admittedClaim.quantity));
const settlement = evaluateSettlement({ claim: activeClaim, settlement_capacity: 8 });
const finalClaim = applySettlementResult(activeClaim, settlement);

const artifact = {
  generated_at: new Date().toISOString(),
  title: 'SolarPunk Constraint Protocol Public Alpha — deterministic demo',
  purpose:
    'Demonstrate evidence normalization, provenance classification, first-class policy comparison, bounded claim creation, and explicit settlement shortfall without claiming real-value mint authority.',
  normalized,
  evidence,
  provenance,
  policy_decisions: policyDecisions,
  admitted_claim: admittedClaim,
  active_claim: activeClaim,
  settlement,
  final_claim: finalClaim,
  boundaries: [
    'Bundled sample evidence is L0 public-lab evidence.',
    'The admitted LAB-OPEN-001 claim is illustrative and non-live.',
    'Settlement capacity is a modeled input, not proof of reserve custody.',
    'SPK is a reference application; the alpha protocol object is the constrained claim.',
  ],
};

writeJson('state/protocol/constraint_protocol_alpha_demo.json', artifact);

console.log('=== Constraint Protocol Alpha Demo ===');
console.log(`evidence_hash: ${evidence.evidence_hash}`);
console.log(`provenance: ${provenance.level} (${provenance.label})`);
for (const decision of policyDecisions) {
  console.log(`${decision.policy_id}: ${decision.decision} max=${decision.maximum_claim_quantity} ${decision.issuance_unit}`);
}
console.log(`claim_id: ${finalClaim.claim_id}`);
console.log(`claim_state: ${finalClaim.state}`);
console.log(`settlement: covered=${settlement.covered_quantity} shortfall=${settlement.shortfall_quantity}`);
console.log('wrote: state/protocol/constraint_protocol_alpha_demo.json');
