// Table des pages et de leurs équivalents par langue, partagée par le site
// (src/i18n/routes.ts) et par le sitemap (astro.config.mjs). JavaScript pur :
// le fichier de configuration d'Astro le lit sans compilation.

export const routes = Object.freeze({
  home: { fr: '/', en: '/en/' },
  platforms: { fr: '/plateformes/', en: '/en/platforms/' },
  identity: { fr: '/plateformes/luxia-identity/', en: '/en/platforms/luxia-identity/' },
  solutions: { fr: '/solutions/' },
  trust: { fr: '/confiance/' },
  resources: { fr: '/ressources/' },
  key: { fr: '/plateformes/luxia-key/', en: '/en/platforms/luxia-key/' },
  alma: { fr: '/plateformes/alma/', en: '/en/platforms/alma/' },
  services: { fr: '/services/', en: '/en/services/' },
  architectures: { fr: '/architectures/', en: '/en/architectures/' },
  runtime: { fr: '/architectures/plateforme-execution/', en: '/en/architectures/runtime-platform/' },
  labs: { fr: '/labs/', en: '/en/labs/' },
  company: { fr: '/entreprise/', en: '/en/company/' },
  careers: { fr: '/carrieres/', en: '/en/careers/' },
  contact: { fr: '/contact/', en: '/en/contact/' },
  legal: { fr: '/mentions-legales/', en: '/en/legal-notice/' },
  privacy: { fr: '/confidentialite/', en: '/en/privacy/' },
  security: { fr: '/securite/', en: '/en/security/' },
});

/** Codes hreflang du sitemap. */
export const sitemapLang = Object.freeze({ fr: 'fr-FR', en: 'en-GB' });

/** Langues publiées d'après PUBLIC_LOCALES (le français l'est toujours). */
export function parsePublished(raw) {
  const known = Object.keys(sitemapLang);
  const requested = String(raw ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((s) => known.includes(s));
  return [...new Set(['fr', ...requested])];
}
