/**
 * Table des pages et de leurs équivalents par langue. Une traduction n'est
 * annoncée (hreflang, sélecteur) que si sa langue est publiée ET si la page
 * existe dans src/pages : on ne pointe jamais vers une page absente.
 */
import { defaultLocale, publishedLocales, type Locale } from './config';

export const routes = {
  home: { fr: '/', en: '/en/' },
  platforms: { fr: '/plateformes/', en: '/en/platforms/' },
  identity: { fr: '/plateformes/luxia-identity/', en: '/en/platforms/luxia-identity/' },
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
} as const satisfies Record<string, Partial<Record<Locale, string>>>;

export type RouteId = keyof typeof routes;

/** Chemins réellement construits, déduits des fichiers de src/pages. */
const builtPaths = new Set(
  Object.keys(import.meta.glob('/src/pages/**/*.astro')).map((file) =>
    file
      .replace(/^\/src\/pages/, '')
      .replace(/\.astro$/, '')
      .replace(/\/index$/, '/')
      .replace(/([^/])$/, '$1/'),
  ),
);

export const pageExists = (path: string): boolean => builtPaths.has(path);

/** Chemin d'une page dans une langue, ou null si elle n'y est ni traduite ni publiée. */
export function localizedPath(id: RouteId, locale: Locale): string | null {
  const path = (routes[id] as Partial<Record<Locale, string>>)[locale];
  if (!path) return null;
  if (locale !== defaultLocale && (!publishedLocales().includes(locale) || !pageExists(path))) return null;
  return path;
}

/** Chemin à utiliser dans un lien : la langue demandée si possible, sinon le français. */
export function href(id: RouteId, locale: Locale = defaultLocale): string {
  return localizedPath(id, locale) ?? routes[id].fr;
}

/** Équivalents publiés d'un chemin donné (lui compris), pour hreflang et le sélecteur. */
export function alternatesOf(pathname: string): { locale: Locale; path: string }[] {
  const entry = Object.entries(routes).find(([, paths]) => Object.values(paths).includes(pathname as never));
  if (!entry) return [];
  const id = entry[0] as RouteId;
  return publishedLocales()
    .map((locale) => ({ locale, path: localizedPath(id, locale) }))
    .filter((a): a is { locale: Locale; path: string } => a.path !== null);
}
