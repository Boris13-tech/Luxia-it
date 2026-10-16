// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL publique du site : à définir au déploiement (SITE_URL=https://www.exemple.fr npm run build).
// Sur Vercel, à défaut, on utilise l'adresse de production du projet.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site = process.env.SITE_URL ?? (vercelUrl ? `https://${vercelUrl}` : 'https://luxia-it.example');

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
