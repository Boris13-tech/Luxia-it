// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
  integrations: [sitemap()],
  devToolbar: { enabled: false },
});
