import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { promisify } from 'node:util';

const run = promisify(execFile);
// Python's standard library handles ZIP headers, decompression and CRC validation;
// no archive members are extracted to disk. The same file handle is hashed and read.
const VERIFY_MEMBER = `
import hashlib, json, sys, zipfile
archive_path, member_name, expected_archive, expected_csv = sys.argv[1:]
with open(archive_path, 'rb') as archive:
    actual_archive = hashlib.file_digest(archive, 'sha256').hexdigest() if hasattr(hashlib, 'file_digest') else None
    if actual_archive is None:
        h = hashlib.sha256()
        for chunk in iter(lambda: archive.read(1024 * 1024), b''): h.update(chunk)
        actual_archive = h.hexdigest()
    if actual_archive != expected_archive: raise ValueError('archive SHA-256 mismatch')
    archive.seek(0)
    with zipfile.ZipFile(archive) as source:
        matches = [i for i in source.infolist() if i.filename == member_name]
        if len(matches) != 1: raise ValueError('expected exactly one declared CSV archive member')
        info = matches[0]
        if info.file_size > 80 * 1024 * 1024: raise ValueError('CSV archive member exceeds size limit')
        h = hashlib.sha256()
        size = 0
        with source.open(info) as csv:
            for chunk in iter(lambda: csv.read(1024 * 1024), b''):
                h.update(chunk)
                size += len(chunk)
        if h.hexdigest() != expected_csv: raise ValueError('CSV does not match the verified archive member')
        print(json.dumps({'archive_member': member_name, 'csv_sha256': h.hexdigest(), 'csv_bytes': size}))
`;

export async function verifyArchiveCsvBinding({ archivePath, csvBytes, memberName, expectedArchiveSha256 }) {
  const csvHash = createHash('sha256').update(csvBytes).digest('hex');
  try {
    const { stdout } = await run(process.platform === 'win32' ? 'python' : 'python3',
      ['-c', VERIFY_MEMBER, archivePath, memberName, expectedArchiveSha256, csvHash],
      { timeout: 60_000, maxBuffer: 1024 * 1024 });
    return JSON.parse(stdout);
  } catch (error) {
    throw new Error(`Source archive/CSV binding failed: ${error.stderr || error.message}`);
  }
}
