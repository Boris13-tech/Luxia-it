// Contrôles de la source propres au projet (npm run lint), sans dépendance :
// - aucun marqueur de contenu manquant dans src/ ;
// - aucune construction incompatible avec la CSP (style="", is:inline, on…=) ;
// - aucun lien target="_blank" sans rel="noopener" ;
// - set:html réservé au JSON-LD du gabarit ;
// - aucun superlatif ni promesse d'échelle (règle éditoriale du site).
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOTS = ['src', 'api', 'functions'];
const problems = [];

const MARKERS = /À FOURNIR|À CONFIRMER|HYPOTHÈSE|\[TBD|\bTODO\b|Lorem ipsum/i;
const SUPERLATIVES = /\b(leader|n°\s?1|numéro un|révolutionnaire|inégalé|ultime|best[- ]in[- ]class|world[- ]class|de classe mondiale|sans égal|des milliers de clients|millions d['’]utilisateurs)\b/i;

async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else if (/\.(astro|ts|mjs|css)$/.test(entry.name)) yield path;
  }
}

for (const root of ROOTS) {
  for await (const file of files(root)) {
    const text = await readFile(file, 'utf8');
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      const at = `${file}:${i + 1}`;
      if (MARKERS.test(line)) problems.push(`${at} : marqueur de contenu manquant`);
      if (!file.endsWith('.astro')) return;
      if (/\sstyle=["{]/.test(line)) problems.push(`${at} : attribut style (bloqué par la CSP)`);
      if (/\sis:inline\b/.test(line)) problems.push(`${at} : is:inline (code en ligne bloqué par la CSP)`);
      if (/\son[a-z]+=["{]/.test(line)) problems.push(`${at} : gestionnaire d'événement en ligne`);
      if (/target="_blank"/.test(line) && !/rel="[^"]*noopener/.test(line)) problems.push(`${at} : target="_blank" sans rel="noopener"`);
      if (/set:html/.test(line) && !file.endsWith(join('layouts', 'BaseLayout.astro'))) problems.push(`${at} : set:html hors JSON-LD`);
      if (SUPERLATIVES.test(line)) problems.push(`${at} : superlatif ou promesse d'échelle`);
    });
  }
}

if (problems.length > 0) {
  console.error(`lint-content : ${problems.length} problème(s)\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log('lint-content : aucun problème.');
