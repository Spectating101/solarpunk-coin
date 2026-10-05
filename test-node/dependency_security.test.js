const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

test('all locked vulnerable library copies contain reviewed security backports', () => {
  execFileSync(process.execPath, [path.join(__dirname, '../scripts/apply_dependency_security_patches.cjs'), '--check']);
});
test('braces stops excessive nesting and preserves normal patterns', () => {
  const braces = require('braces');
  const deep = '{'.repeat(3500) + '}'.repeat(3500);
  for (const method of ['compile', 'expand', 'stringify']) assert.throws(() => braces[method](deep), /maximum nesting depth/);
  assert.deepEqual(braces.expand('a{1..3}b{c,d}'), ['a1bc', 'a1bd', 'a2bc', 'a2bd', 'a3bc', 'a3bd']);
});
test('elliptic retains leading zero bytes when deriving a P-521 signing nonce', () => {
  const elliptic = require('elliptic');
  const DRBG = require('hmac-drbg');
  const ec = new elliptic.ec('p521');
  const key = ec.keyFromPrivate('123456789abcdef');
  const nonce = [0, ...Array.from({ length: 65 }, (_, i) => (i % 200) + 20)];
  const expected = key.sign('abcd', { k: () => nonce });
  const original = DRBG.prototype.generate;
  try {
    DRBG.prototype.generate = () => nonce;
    const actual = key.sign('abcd');
    assert.equal(actual.r.toString(16), expected.r.toString(16));
    assert.equal(actual.s.toString(16), expected.s.toString(16));
    assert(ec.verify('abcd', actual, key));
  } finally { DRBG.prototype.generate = original; }
});
