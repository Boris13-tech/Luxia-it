/**
 * Langues du site. Le français est la langue par défaut, sans préfixe ; les
 * autres langues vivent sous /<code>/. Une langue n'est publiée (hreflang,
 * sélecteur, sitemap) que si elle figure dans PUBLIC_LOCALES, ce qui suppose
 * une traduction professionnelle (voir docs/suivi-contenus.md, section 4).
 */

export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

export const localeMeta: Record<Locale, { lang: string; og: string; name: string }> = {
  fr: { lang: 'fr', og: 'fr_FR', name: 'Français' },
  en: { lang: 'en', og: 'en_GB', name: 'English' },
};

const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

/** Langues publiées, lues dans PUBLIC_LOCALES (ex. « fr,en »). Le français l'est toujours. */
export function publishedLocales(): Locale[] {
  const raw = String(import.meta.env.PUBLIC_LOCALES ?? '');
  const requested = raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(isLocale);
  return [...new Set<Locale>([defaultLocale, ...requested])];
}

/** Langue d'une page d'après son chemin. */
export function localeFromPath(pathname: string): Locale {
  const first = pathname.split('/')[1] ?? '';
  return isLocale(first) && first !== defaultLocale ? first : defaultLocale;
}
