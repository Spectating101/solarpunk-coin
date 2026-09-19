import { verifyResearchCapsuleBundle } from '../../packages/constraint-core/src/workbench.js';

// This adapter only converts stdin JSON to the existing verifier's JSON result.
let raw = '';
for await (const chunk of process.stdin) {
  raw += chunk;
  if (Buffer.byteLength(raw) > 1048576) throw new Error('Input exceeds limit');
}
const { capsule } = JSON.parse(raw);
const result = await verifyResearchCapsuleBundle(capsule);
process.stdout.write(`${JSON.stringify(result)}\n`);
