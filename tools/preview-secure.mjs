// Sert dist/ en local avec les en-têtes de sécurité de production
// (lus dans public/_headers), pour vérifier la CSP avant déploiement.
// Usage : npm run build && npm run preview:secure

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

const root = resolve('dist');
const port = Number(process.env.PORT ?? 4400);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.mp4': 'video/mp4',
};

/** Lit le bloc « /* » de public/_headers. */
async function loadHeaders() {
  const lines = (await readFile('public/_headers', 'utf8')).split(/\r?\n/);
  const headers = {};
  let inBlock = false;
  for (const line of lines) {
    if (line.startsWith('#') || line.trim() === '') continue;
    if (!line.startsWith(' ')) {
      inBlock = line.trim() === '/*';
      continue;
    }
    if (!inBlock) continue;
    const i = line.indexOf(':');
    headers[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  // Pas de HSTS ni d'upgrade-insecure-requests en HTTP local.
  delete headers['Strict-Transport-Security'];
  if (headers['Content-Security-Policy']) {
    headers['Content-Security-Policy'] = headers['Content-Security-Policy'].replace(/;\s*upgrade-insecure-requests/, '');
  }
  return headers;
}

async function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^([/\\])+/, '');
  const candidate = join(root, clean);
  if (candidate !== root && !candidate.startsWith(root + sep)) return null;
  for (const path of [candidate, join(candidate, 'index.html')]) {
    try {
      if ((await stat(path)).isFile()) return path;
    } catch {}
  }
  return null;
}

const securityHeaders = await loadHeaders();

createServer(async (req, res) => {
  for (const [k, v] of Object.entries(securityHeaders)) res.setHeader(k, v);
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405).end();
    return;
  }
  const file = await resolveFile(req.url ?? '/');
  const target = file ?? join(root, '404.html');
  res.writeHead(file ? 200 : 404, { 'Content-Type': types[extname(target)] ?? 'application/octet-stream' });
  res.end(req.method === 'HEAD' ? undefined : await readFile(target));
}).listen(port, () => {
  console.log(`Aperçu sécurisé : http://localhost:${port}/`);
});
