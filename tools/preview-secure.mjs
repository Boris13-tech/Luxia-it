// Sert dist/ en local avec les en-têtes de sécurité de production (lus dans
// public/_headers) et la vraie fonction du formulaire (api/contact.ts), pour
// vérifier la CSP et le parcours de contact avant déploiement.
// Usage : npm run build && npm run preview:secure
// Par défaut, le formulaire fonctionne en mode « log » : rien n'est envoyé.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { brotliCompressSync, constants } from 'node:zlib';
import { handleContact } from '../api/contact.ts';

const root = resolve('dist');
const port = Number(process.env.PORT ?? 4400);
const origin = `http://localhost:${port}`;
const contactEnv = {
  CONTACT_DELIVERY: process.env.CONTACT_DELIVERY ?? 'log',
  CONTACT_ALLOWED_ORIGINS: process.env.CONTACT_ALLOWED_ORIGINS ?? `${origin},http://127.0.0.1:${port}`,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_FROM: process.env.CONTACT_FROM,
  CONTACT_TO: process.env.CONTACT_TO,
};

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

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

const securityHeaders = await loadHeaders();

createServer(async (req, res) => {
  for (const [k, v] of Object.entries(securityHeaders)) res.setHeader(k, v);
  const url = new URL(req.url ?? '/', origin);

  if (url.pathname === '/api/contact' || url.pathname === '/api/contact/') {
    const body = req.method === 'POST' ? await readBody(req) : undefined;
    const request = new Request(url, { method: req.method, headers: req.headers, body });
    const response = await handleContact(request, contactEnv);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405).end();
    return;
  }
  const file = await resolveFile(url.pathname);
  const target = file ?? join(root, '404.html');
  const type = types[extname(target)] ?? 'application/octet-stream';
  let body = await readFile(target);
  const headers = { 'Content-Type': type };
  // Compression Brotli des textes, comme en production : les mesures locales
  // (Lighthouse) restent comparables à celles du site déployé.
  if (/^(text\/|application\/(xml|json)|image\/svg)/.test(type) && /\bbr\b/.test(String(req.headers['accept-encoding'] ?? ''))) {
    body = brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 9 } });
    headers['Content-Encoding'] = 'br';
    headers['Vary'] = 'Accept-Encoding';
  }
  res.writeHead(file ? 200 : 404, headers);
  res.end(req.method === 'HEAD' ? undefined : body);
}).listen(port, () => {
  console.log(`Aperçu sécurisé : ${origin}/ (formulaire en mode ${contactEnv.CONTACT_DELIVERY})`);
});
