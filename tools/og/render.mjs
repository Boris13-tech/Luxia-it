// Régénère l'image de partage et l'emblème carré à partir des gabarits HTML,
// avec Chrome installé localement (aucune dépendance) :
//   node tools/og/render.mjs [chemin/vers/chrome]
// Sorties : public/og/luxia-it.png (1200 × 630), public/brand/luxia-it-logo-512.png.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const candidates = [
  process.argv[2],
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);
const chrome = candidates.find((c) => existsSync(c));
if (!chrome) {
  console.error('Chrome introuvable : passez son chemin en argument ou dans CHROME_PATH.');
  process.exit(1);
}

const jobs = [
  { page: 'tools/og/og.html', out: 'public/og/luxia-it.png', size: '1200,630' },
  { page: 'tools/og/logo.html', out: 'public/brand/luxia-it-logo-512.png', size: '512,512' },
];

// Profil Chrome jetable : le rendu ne touche jamais au profil de l'utilisateur.
const profile = mkdtempSync(join(tmpdir(), 'luxia-og-'));

for (const job of jobs) {
  mkdirSync(resolve(job.out, '..'), { recursive: true });
  execFileSync(chrome, [
    '--headless=new',
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--window-size=${job.size}`,
    `--screenshot=${resolve(job.out)}`,
    pathToFileURL(resolve(job.page)).href,
  ]);
  console.log(`${job.out} (${job.size.replace(',', ' × ')})`);
}

rmSync(profile, { recursive: true, force: true });
