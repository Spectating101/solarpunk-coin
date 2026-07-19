import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.argv[2] || 'frontend/dist');
const indexPath = path.join(root, 'index.html');
const html = await fs.readFile(indexPath, 'utf8');

const preloadRefs = [...html.matchAll(/<link[^>]+rel=["']modulepreload["'][^>]+href=["']([^"']+)["']/g)]
  .map((match) => match[1]);
const forbiddenPreloads = preloadRefs.filter((ref) => /(?:web3-|SpkV1Console-)/.test(ref));
if (forbiddenPreloads.length) {
  throw new Error(`Default document preloads optional Web3 surface: ${forbiddenPreloads.join(', ')}`);
}

const scriptMatch = html.match(/<script[^>]+type=["']module["'][^>]+src=["']([^"']+)["']/);
if (!scriptMatch) throw new Error(`No module entry script found in ${indexPath}`);

const entryRef = scriptMatch[1].replace(/^\.\//, '');
const entryPath = path.join(root, entryRef);
const entrySource = await fs.readFile(entryPath, 'utf8');

const forbiddenStaticImports = [
  /from["']\.\/web3-[^"']+\.js["']/,
  /from["']\.\/SpkV1Console-[^"']+\.js["']/,
  /from["']\.\/ConstraintProtocolLab-[^"']+\.js["']/,
];
for (const pattern of forbiddenStaticImports) {
  if (pattern.test(entrySource)) {
    throw new Error(`Default entry ${entryRef} statically imports an optional research/Web3 chunk (${pattern}).`);
  }
}

const assetsPath = path.join(root, 'assets');
const assets = await fs.readdir(assetsPath);
const web3Asset = assets.find((name) => /^web3-.*\.js$/.test(name));
const protocolAsset = assets.find((name) => /^ConstraintProtocolLab-.*\.js$/.test(name));

console.log(JSON.stringify({
  ok: true,
  root,
  entry: entryRef,
  module_preloads: preloadRefs,
  optional_chunks: {
    web3: web3Asset || null,
    protocol_lab: protocolAsset || null,
  },
}, null, 2));
