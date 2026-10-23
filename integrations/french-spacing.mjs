// Typographie française à la construction : espace insécable fine avant
// « ; : ! ? » et à l'intérieur des guillemets « », pour qu'aucune ligne ne
// commence par un signe isolé. Seul le texte est modifié : balises,
// attributs, scripts et styles restent intacts.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const NNBSP = ' ';
const SKIP = /^<(script|style|pre|code|textarea)\b/i;

/** @param {string} text */
export function frenchSpacing(text) {
  return text
    .replace(/[  ]([;:!?»])/g, `${NNBSP}$1`)
    .replace(/«[  ]/g, `«${NNBSP}`);
}

/** @param {string} html */
export function transformHtml(html) {
  const parts = html.split(/(<(script|style|pre|code|textarea)\b[\s\S]*?<\/\2>|<[^>]+>)/i);
  let out = '';
  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i] ?? '';
    // split() insère aussi le nom de balise capturé : on l'ignore.
    if (i % 3 === 2) continue;
    out += i % 3 === 1 || SKIP.test(part) ? part : frenchSpacing(part);
  }
  return out;
}

/** @param {string} dir @returns {AsyncGenerator<string>} */
async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}

/** @returns {import('astro').AstroIntegration} */
export default function frenchTypography() {
  return {
    name: 'french-typography',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        for await (const file of htmlFiles(fileURLToPath(dir))) {
          const html = await readFile(file, 'utf8');
          const next = transformHtml(html);
          if (next !== html) await writeFile(file, next);
        }
      },
    },
  };
}
