// Reviewed, pinned backports for advisories without a published compatible fix.
// Refuse unknown source bytes; do not modify dependency versions or audit output.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const patches = require('../security/dependency-patches.json');
const lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');
const checkOnly = process.argv.includes('--check');
for (const patch of patches) {
  const copies = Object.entries(lock.packages).filter(([dir, meta]) => dir.endsWith(`/node_modules/${patch.package}`) || dir === `node_modules/${patch.package}`);
  if (!copies.length) throw new Error(`Review obsolete patch for absent ${patch.package}`);
  for (const [dir, meta] of copies) {
    if (meta.version !== patch.version) throw new Error(`Review patch for changed ${patch.package}@${meta.version}`);
    const file = path.join(root, dir, patch.file);
    const before = fs.readFileSync(file, 'utf8');
    if (hash(before) === patch.patched_sha256) continue;
    if (checkOnly || hash(before) !== patch.original_sha256) throw new Error(`Security backport missing or source changed: ${file}`);
    let after = before;
    for (const replacement of patch.replacements) {
      if (after.split(replacement.before).length !== 2) throw new Error(`Non-unique security patch: ${file}`);
      after = after.replace(replacement.before, replacement.after);
    }
    if (hash(after) !== patch.patched_sha256) throw new Error(`Security patch output mismatch: ${file}`);
    fs.writeFileSync(file, after);
  }
}
console.log(`Verified ${patches.length} pinned dependency security backports (${checkOnly ? 'check' : 'apply'})`);
