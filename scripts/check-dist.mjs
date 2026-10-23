// Garde-fou exécuté à la fin de chaque build (npm run build) : le site
// construit ne doit contenir ni marqueur de contenu manquant, ni code en ligne
// que la politique de sécurité du contenu (CSP) bloquerait. Le build échoue
// sinon : rien de tel ne peut être déployé.
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST = 'dist';

const MARKERS = [/À FOURNIR/i, /À CONFIRMER/i, /HYPOTH[ÈE]SE/i, /\[TBD/i, /\bTODO\b/, /\bLorem ipsum\b/i, /\bplaceholder\b/i];

async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else yield path;
  }
}

const problems = [];
let pages = 0;

for await (const file of files(DIST)) {
  if (!/\.(html|xml|txt)$/.test(file)) continue;
  const text = await readFile(file, 'utf8');
  const name = relative(DIST, file);
  if (file.endsWith('.html')) pages += 1;

  for (const marker of MARKERS) {
    const match = text.match(marker);
    if (match) problems.push(`${name} : marqueur « ${match[0]} »`);
  }

  if (!file.endsWith('.html')) continue;
  // Attributs style="" : bloqués par style-src 'self'.
  if (/<[a-z][^>]*\sstyle=/i.test(text)) problems.push(`${name} : attribut style en ligne`);
  // Gestionnaires d'événements en ligne : bloqués par script-src 'self'.
  if (/<[a-z][^>]*\son[a-z]+=/i.test(text)) problems.push(`${name} : gestionnaire d'événement en ligne`);
  // Scripts en ligne exécutables (seuls les blocs JSON-LD sont admis).
  for (const tag of text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = tag[1] ?? '';
    const body = (tag[2] ?? '').trim();
    if (/\bsrc=/.test(attrs)) continue;
    if (/type="application\/ld\+json"/.test(attrs)) continue;
    if (body !== '') problems.push(`${name} : script en ligne`);
  }
  // Feuilles de style en ligne.
  if (/<style\b/i.test(text)) problems.push(`${name} : balise <style> en ligne`);
}

if (pages === 0) problems.push('aucune page HTML trouvée dans dist/');

if (problems.length > 0) {
  console.error(`check-dist : ${problems.length} problème(s)\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`check-dist : ${pages} pages, aucun marqueur ni code en ligne.`);
