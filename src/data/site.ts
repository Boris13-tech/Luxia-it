/**
 * Données partagées du site. Les valeurs entre crochets sont des contenus
 * à fournir ou à confirmer par Luxia-IT avant publication (voir CONTENUS.md).
 */

export const company = {
  name: 'Luxia-IT',
  tagline: 'Identité & confiance numérique',
  descriptor: "Logiciels d'identité et de confiance pour les opérations critiques.",
  phone: '[À FOURNIR : téléphone]',
  email: '[À FOURNIR : adresse e-mail]',
} as const;

export type PlatformStatus =
  | { kind: 'live' }
  | { kind: 'tbd'; note: string };

export interface Platform {
  slug: 'luxia-identity' | 'luxia-key' | 'alma';
  name: string;
  /** Description en une ligne. `taglineTbd` signale une hypothèse à valider. */
  tagline: string;
  taglineTbd?: string;
  summary: string;
  summaryTbd?: string;
  icon: 'shield-check' | 'key-round' | 'layers';
  status: PlatformStatus;
}

export const platforms: readonly Platform[] = [
  {
    slug: 'luxia-identity',
    name: 'LUXIA Identity',
    tagline: 'Gestion des identités et des accès',
    summary:
      'Authentifiez vos utilisateurs, fédérez vos fournisseurs d’identité et tracez chaque accès, dans le cloud, sur site ou en environnement souverain.',
    icon: 'shield-check',
    status: { kind: 'live' },
  },
  {
    slug: 'luxia-key',
    name: 'LUXIA Key',
    tagline: 'Gestion des clés et des secrets',
    taglineTbd: 'À CONFIRMER',
    summary: 'Conservez les clés cryptographiques et les secrets de vos applications sous votre autorité.',
    summaryTbd: 'HYPOTHÈSE — À CONFIRMER',
    icon: 'key-round',
    status: { kind: 'tbd', note: 'À CONFIRMER : statut' },
  },
  {
    slug: 'alma',
    name: 'ALMA',
    tagline: '',
    taglineTbd: 'À FOURNIR : description en une ligne',
    summary: '',
    summaryTbd: 'À FOURNIR : description de la plateforme',
    icon: 'layers',
    status: { kind: 'tbd', note: 'À FOURNIR : statut' },
  },
];

export const platformHref = (slug: Platform['slug']) => `/plateformes/${slug}/`;

export interface NavItem {
  label: string;
  href: string;
}

export interface NavGroup extends NavItem {
  children?: readonly NavItem[];
}

export const services: readonly NavItem[] = [
  { label: 'Cadrage et architecture', href: '/services/#cadrage' },
  { label: 'Intégration', href: '/services/#integration' },
  { label: 'Migration', href: '/services/#migration' },
  { label: 'Exploitation et support', href: '/services/#exploitation' },
];

/** Navigation principale, avec menus déroulants. */
export const mainNav: readonly NavGroup[] = [
  {
    label: 'Plateformes',
    href: '/plateformes/',
    children: [
      { label: "Vue d'ensemble", href: '/plateformes/' },
      ...platforms.map((p) => ({ label: p.name, href: platformHref(p.slug) })),
    ],
  },
  { label: 'Services', href: '/services/', children: services },
  {
    label: 'Architectures',
    href: '/architectures/',
    children: [
      { label: 'Fédération multi-fournisseurs', href: '/architectures/#federation' },
      { label: 'Cloud opéré', href: '/architectures/#cloud' },
      { label: 'On-premise', href: '/architectures/#on-premise' },
      { label: 'Environnement souverain', href: '/architectures/#souverain' },
    ],
  },
  {
    label: 'Entreprise',
    href: '/entreprise/',
    children: [
      { label: 'À propos', href: '/entreprise/' },
      { label: 'Labs', href: '/labs/' },
      { label: 'Carrières', href: '/carrieres/' },
    ],
  },
  { label: 'Contact', href: '/contact/' },
];

export const footerColumns: readonly { title: string; links: readonly NavItem[] }[] = [
  {
    title: 'Plateformes',
    links: platforms.map((p) => ({ label: p.name, href: platformHref(p.slug) })),
  },
  {
    title: 'Entreprise',
    links: [
      { label: 'À propos', href: '/entreprise/' },
      { label: 'Services', href: '/services/' },
      { label: 'Architectures', href: '/architectures/' },
      { label: 'Labs', href: '/labs/' },
      { label: 'Carrières', href: '/carrieres/' },
    ],
  },
];

export const legalLinks: readonly NavItem[] = [
  { label: 'Mentions légales', href: '/mentions-legales/' },
  { label: 'Confidentialité', href: '/confidentialite/' },
  { label: 'Sécurité', href: '/securite/' },
  { label: 'Contact', href: '/contact/' },
];
