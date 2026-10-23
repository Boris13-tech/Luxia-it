// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { parsePublished, routes, sitemapLang } from './src/i18n/route-map.mjs';

// Domaine de production historique de Luxia-IT (URL canonique par défaut).
const PRODUCTION_ORIGIN = 'https://luxia-it.com';

/**
 * URL publique du site, utilisée pour les liens canoniques, Open Graph, le
 * sitemap, robots.txt et security.txt. SITE_URL la remplace (ex. recette) ;
 * vide ou absente, c'est le domaine de production qui s'applique. Une valeur
 * inutilisable arrête le build plutôt que de publier des URL fausses.
 */
function resolveSite() {
  const raw = (process.env.SITE_URL ?? '').trim();
  if (raw === '') return PRODUCTION_ORIGIN;
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(candidate).origin;
  } catch {
    throw new Error(`SITE_URL n'est pas une URL valide : « ${raw} ». Exemple attendu : https://luxia-it.com`);
  }
}

const site = resolveSite();
const published = parsePublished(process.env.PUBLIC_LOCALES);

/**
 * Sitemap multilingue : chaque page annonce ses équivalents publiés, d'après
 * la table des routes (les adresses anglaises sont traduites, la simple
 * correspondance de préfixe ne suffit pas). Une langue n'est publiée que si
 * toutes ses pages existent (vérifié par les tests).
 */
/** @type {Record<string, Record<string, string>>} */
const routeTable = routes;
/** @type {Record<string, string>} */
const hreflang = sitemapLang;

/**
 * @param {{ url: string, links?: { lang: string, url: string }[] }} item
 */
function withAlternates(item) {
  if (published.length < 2) return item;
  const path = new URL(item.url).pathname;
  const entry = Object.values(routeTable).find((paths) => Object.values(paths).includes(path));
  if (!entry) return item;
  const links = published.flatMap((locale) => {
    const target = entry[locale];
    const lang = hreflang[locale];
    return target && lang ? [{ lang, url: new URL(target, site).href }] : [];
  });
  return { ...item, links: [...links, { lang: 'x-default', url: new URL(entry['fr'] ?? '/', site).href }] };
}

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Aucun CSS en ligne : permet une CSP stricte `style-src 'self'`.
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Aucun script ni ressource en ligne (data: URI) : CSP `script-src 'self'`.
      assetsInlineLimit: 0,
    },
  },
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      // Pages de résultat du formulaire : hors index (elles portent aussi noindex).
      filter: (page) => !/\/contact\/(envoye|erreur)\/$/.test(page),
      serialize: withAlternates,
    }),
  ],
  devToolbar: { enabled: false },
});
