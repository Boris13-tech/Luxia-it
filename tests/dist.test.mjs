// Tests du site construit (dist/) : référencement, accessibilité structurelle,
// liens internes, sitemap, parité des en-têtes de sécurité. Sans dépendance.
// Lancement : npm run build && npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { parsePublished, routes } from '../src/i18n/route-map.mjs';

const DIST = 'dist';
const NOINDEX = new Set(['/404/', '/contact/envoye/', '/contact/erreur/']);

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return name.endsWith('.html') ? [path] : [];
  });
}

/** Chemin public d'un fichier construit : dist/a/b/index.html → /a/b/ ; dist/404.html → /404/. */
function urlPath(file) {
  const rel = relative(DIST, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel.replace(/\.html$/, '')}/`;
}

assert.ok(existsSync(DIST), 'dist/ absent : lancer npm run build avant npm test');

const pages = htmlFiles(DIST).map((file) => ({ file, path: urlPath(file), html: readFileSync(file, 'utf8') }));
const byPath = new Map(pages.map((p) => [p.path, p]));

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((m) => m[0]);
const ids = (html) => new Set(tags(html, '[a-z0-9]+').map((t) => attr(t, 'id')).filter(Boolean));

test('chaque page a une langue, un titre, une description et un seul h1', () => {
  for (const p of pages) {
    assert.match(p.html, /<html lang="(fr|en)"/, `${p.path} : lang`);
    const title = p.html.match(/<title>([^<]+)<\/title>/)?.[1] ?? '';
    assert.ok(title.length >= 10 && title.length <= 70, `${p.path} : titre de ${title.length} caractères`);
    const description = attr(tags(p.html, 'meta').find((t) => attr(t, 'name') === 'description') ?? '', 'content') ?? '';
    // Longueur utile pour les moteurs : exigée sur les pages indexables seulement.
    const [min, max] = NOINDEX.has(p.path) ? [20, 200] : [50, 200];
    assert.ok(description.length >= min && description.length <= max, `${p.path} : description de ${description.length} caractères`);
    assert.equal(tags(p.html, 'h1').length, 1, `${p.path} : un seul h1`);
  }
});

test('les titres ne sautent pas de niveau', () => {
  for (const p of pages) {
    const levels = [...p.html.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
    levels.forEach((level, i) => {
      if (i > 0) assert.ok(level <= levels[i - 1] + 1, `${p.path} : h${levels[i - 1]} suivi de h${level}`);
    });
  }
});

test('les pages indexables ont canonique, Open Graph, Twitter Card et JSON-LD', () => {
  for (const p of pages.filter((p) => !NOINDEX.has(p.path))) {
    const links = tags(p.html, 'link');
    const canonical = links.find((t) => attr(t, 'rel') === 'canonical');
    assert.ok(canonical, `${p.path} : canonique`);
    assert.equal(new URL(attr(canonical, 'href')).pathname, p.path, `${p.path} : canonique vers elle-même`);
    const meta = tags(p.html, 'meta');
    const prop = (name) => meta.find((t) => attr(t, 'property') === name || attr(t, 'name') === name);
    for (const name of ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt', 'twitter:card', 'twitter:image']) {
      assert.ok(prop(name), `${p.path} : ${name}`);
    }
    assert.equal(attr(prop('twitter:card'), 'content'), 'summary_large_image');
    assert.ok(existsSync(join(DIST, new URL(attr(prop('og:image'), 'content')).pathname)), `${p.path} : image de partage présente`);
    const ld = p.html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    assert.ok(ld, `${p.path} : JSON-LD`);
    const graph = JSON.parse(ld)['@graph'];
    assert.ok(graph.some((n) => n['@type'] === 'Organization'), `${p.path} : Organization`);
    const hreflangs = links.filter((t) => attr(t, 'rel') === 'alternate' && attr(t, 'hreflang'));
    assert.ok(hreflangs.some((t) => attr(t, 'hreflang') === 'x-default'), `${p.path} : hreflang x-default`);
  }
});

test('le fil d’Ariane structuré correspond aux pages intérieures', () => {
  for (const p of pages.filter((p) => !NOINDEX.has(p.path) && p.path !== '/')) {
    const ld = JSON.parse(p.html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const crumbs = ld['@graph'].find((n) => n['@type'] === 'BreadcrumbList');
    assert.ok(crumbs, `${p.path} : BreadcrumbList`);
    const last = crumbs.itemListElement.at(-1);
    assert.equal(new URL(last.item).pathname, p.path, `${p.path} : dernier élément du fil`);
  }
});

test('les pages de résultat et la 404 sont exclues des moteurs', () => {
  for (const path of NOINDEX) {
    const p = byPath.get(path);
    assert.ok(p, `${path} construite`);
    assert.match(p.html, /<meta name="robots" content="noindex"/, `${path} : noindex`);
  }
});

test('chaque lien interne mène à une page et à une ancre existantes', () => {
  for (const p of pages) {
    for (const a of tags(p.html, 'a')) {
      const href = attr(a, 'href');
      if (!href || !href.startsWith('/') || href.startsWith('//')) continue;
      const url = new URL(href, 'https://luxia-it.com');
      if (url.pathname.startsWith('/api/')) continue;
      if (/\.[a-z0-9]+$/i.test(url.pathname)) {
        assert.ok(existsSync(join(DIST, url.pathname)), `${p.path} → ${href} : fichier absent`);
        continue;
      }
      const target = byPath.get(url.pathname);
      assert.ok(target, `${p.path} → ${href} : page absente`);
      if (url.hash) assert.ok(ids(target.html).has(decodeURIComponent(url.hash.slice(1))), `${p.path} → ${href} : ancre absente`);
    }
    for (const a of tags(p.html, 'a').filter((t) => (attr(t, 'href') ?? '').startsWith('#') && attr(t, 'href') !== '#')) {
      assert.ok(ids(p.html).has(attr(a, 'href').slice(1)), `${p.path} : ancre ${attr(a, 'href')} absente`);
    }
  }
});

test('les identifiants sont uniques et les références ARIA résolues', () => {
  for (const p of pages) {
    const all = tags(p.html, '[a-z0-9]+').map((t) => attr(t, 'id')).filter(Boolean);
    const dup = all.filter((id, i) => all.indexOf(id) !== i);
    assert.deepEqual(dup, [], `${p.path} : identifiants en double`);
    const known = new Set(all);
    for (const t of tags(p.html, '[a-z0-9]+')) {
      for (const name of ['aria-labelledby', 'aria-describedby', 'aria-controls', 'for']) {
        for (const ref of (attr(t, name) ?? '').split(/\s+/).filter(Boolean)) {
          assert.ok(known.has(ref), `${p.path} : ${name}="${ref}" sans cible`);
        }
      }
    }
  }
});

test('chaque image a un texte alternatif', () => {
  for (const p of pages) {
    for (const img of tags(p.html, 'img')) assert.notEqual(attr(img, 'alt'), undefined, `${p.path} : image sans alt`);
  }
});

test('le sitemap liste exactement les pages indexables', () => {
  const xml = readdirSync(DIST)
    .filter((f) => /^sitemap-\d+\.xml$/.test(f))
    .map((f) => readFileSync(join(DIST, f), 'utf8'))
    .join('');
  const listed = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname));
  const indexable = pages.map((p) => p.path).filter((path) => !NOINDEX.has(path));
  assert.deepEqual([...listed].sort(), indexable.sort());
});

test('une langue publiée l’est en entier', () => {
  for (const locale of parsePublished(process.env.PUBLIC_LOCALES).filter((l) => l !== 'fr')) {
    for (const paths of Object.values(routes)) {
      assert.ok(byPath.has(paths[locale]), `${locale} publiée mais ${paths[locale]} absente`);
    }
  }
  for (const paths of Object.values(routes)) assert.ok(byPath.has(paths.fr), `${paths.fr} absente`);
});

test('les en-têtes de sécurité sont identiques sur Vercel, Cloudflare/Netlify et nginx', () => {
  const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
  const fromVercel = Object.fromEntries(vercel.headers.find((h) => h.source === '/(.*)').headers.map((h) => [h.key.toLowerCase(), h.value]));
  const fromHeaders = {};
  let inBlock = false;
  for (const line of readFileSync('public/_headers', 'utf8').split(/\r?\n/)) {
    if (!line.startsWith(' ')) {
      inBlock = line.trim() === '/*';
      continue;
    }
    if (inBlock && line.includes(':')) {
      const i = line.indexOf(':');
      fromHeaders[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
    }
  }
  const nginx = Object.fromEntries(
    [...readFileSync('deploy/security-headers.conf', 'utf8').matchAll(/add_header\s+([\w-]+)\s+"([^"]+)"/g)].map((m) => [m[1].toLowerCase(), m[2]]),
  );
  for (const key of ['content-security-policy', 'strict-transport-security', 'x-content-type-options', 'x-frame-options', 'referrer-policy', 'permissions-policy', 'cross-origin-opener-policy']) {
    assert.ok(fromVercel[key], `vercel.json : ${key}`);
    assert.equal(fromHeaders[key], fromVercel[key], `public/_headers : ${key}`);
    assert.equal(nginx[key], fromVercel[key], `deploy/security-headers.conf : ${key}`);
  }
  assert.match(fromVercel['content-security-policy'], /script-src 'self'/);
  assert.match(fromVercel['content-security-policy'], /require-trusted-types-for 'script'/);
});

test('aucun mot n’est collé à un lien', () => {
  for (const p of pages) {
    const glued = p.html.match(/[\p{L}\p{N}:,.’)]<a\s/u);
    assert.equal(glued, null, `${p.path} : texte collé à un lien (« ${glued?.[0]} »)`);
  }
});
