const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

test('source binding accepts exact CSV bytes and rejects altered, absent and unpinned members', async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'archive-binding-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const archivePath = path.join(dir, 'source.zip');
  const csvBytes = Buffer.from('timestamp,export_kwh\n2026-01-01T00:00:00Z,10\n');
  execFileSync('python3', ['-c', 'import sys,zipfile\nwith zipfile.ZipFile(sys.argv[1],"w",zipfile.ZIP_DEFLATED) as z: z.writestr("source.csv",sys.argv[2])', archivePath, csvBytes.toString()]);
  const expectedArchiveSha256 = createHash('sha256').update(await fs.readFile(archivePath)).digest('hex');
  const { verifyArchiveCsvBinding } = await import('../scripts/lib/archive_csv_binding.mjs');
  const args = { archivePath, csvBytes, memberName: 'source.csv', expectedArchiveSha256 };
  const bound = await verifyArchiveCsvBinding(args);
  assert.equal(bound.csv_bytes, csvBytes.length);
  await assert.rejects(verifyArchiveCsvBinding({ ...args, csvBytes: Buffer.from('altered') }), /CSV does not match/);
  await assert.rejects(verifyArchiveCsvBinding({ ...args, memberName: 'absent.csv' }), /exactly one declared CSV/);
  await assert.rejects(verifyArchiveCsvBinding({ ...args, expectedArchiveSha256: '0'.repeat(64) }), /archive SHA-256 mismatch/);
});
