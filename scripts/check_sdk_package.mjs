import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const cwd = fileURLToPath(new URL('../packages/constraint-core/', import.meta.url));
const [packed] = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json'], { cwd, encoding: 'utf8' }));
assert.equal(packed.name, '@solarpunk/constraint-core', 'SDK pack must target the SDK, not the repository root');
const paths = new Set(packed.files.map((file) => file.path));
assert(paths.has('package.json') && paths.has('src/index.js'), 'SDK must contain its manifest and entry point');
assert(![...paths].some((path) => /^(frontend|contracts|state|thesis_package)\//.test(path)), 'SDK must exclude unrelated repository surfaces');
console.log(`SDK package verified: ${packed.name}@${packed.version}, ${paths.size} files`);
