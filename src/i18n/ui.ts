/**
 * Textes de l'interface commune (en-tête, pied de page, gabarit). Les textes
 * des pages vivent dans les pages. La version anglaise est une base de
 * travail pour la traduction professionnelle : elle n'est affichée que sur
 * des pages anglaises, elles-mêmes non publiées tant que PUBLIC_LOCALES ne
 * contient pas « en ».
 */
import type { Locale } from './config';
import type { RouteId } from './routes';

interface Ui {
  skip: string;
  home: string;
  homeSuffix: string;
  nav: string;
  menuOpen: string;
  menuClose: string;
  cta: string;
  language: string;
  breadcrumbs: string;
  footerNav: string;
  footerTagline: string;
  footerContact: string;
  footerLegal: string;
  navItems: readonly { id: RouteId; label: string }[];
  footerColumns: readonly { title: string; links: readonly { id: RouteId; label: string }[] }[];
  legalItems: readonly { id: RouteId; label: string }[];
}

export const ui: Record<Locale, Ui> = {
  fr: {
    skip: 'Aller au contenu',
    home: 'Accueil',
    homeSuffix: ', accueil',
    nav: 'Navigation principale',
    menuOpen: 'Ouvrir le menu',
    menuClose: 'Fermer le menu',
    cta: 'Demander une démo',
    language: 'Langue',
    breadcrumbs: 'Fil d’Ariane',
    footerNav: 'Plan du site',
    footerTagline: 'Plateformes d’identité et de confiance pour les opérations critiques.',
    footerContact: 'Contact',
    footerLegal: 'Informations légales',
    navItems: [
      { id: 'identity', label: 'Produit' },
      { id: 'solutions', label: 'Solutions' },
      { id: 'trust', label: 'Sécurité' },
      { id: 'services', label: 'Services' },
      { id: 'resources', label: 'Ressources' },
      { id: 'company', label: 'Entreprise' },
    ],
    footerColumns: [
      {
        title: 'Produit',
        links: [
          { id: 'identity', label: 'LUXIA Identity' },
          { id: 'solutions', label: 'Solutions' },
          { id: 'trust', label: 'Centre de confiance' },
          { id: 'platforms', label: 'Toutes les plateformes' },
          { id: 'key', label: 'LUXIA Key' },
          { id: 'alma', label: 'ALMA' },
        ],
      },
      {
        title: 'Expertise',
        links: [
          { id: 'services', label: 'Services' },
          { id: 'resources', label: 'Ressources' },
          { id: 'architectures', label: 'Architectures' },
          { id: 'runtime', label: 'Plateforme d’exécution' },
          { id: 'labs', label: 'Labs' },
        ],
      },
      {
        title: 'Entreprise',
        links: [
          { id: 'company', label: 'À propos' },
          { id: 'careers', label: 'Carrières' },
          { id: 'security', label: 'Divulgation responsable' },
          { id: 'contact', label: 'Contact' },
        ],
      },
    ],
    legalItems: [
      { id: 'legal', label: 'Mentions légales' },
      { id: 'privacy', label: 'Confidentialité et cookies' },
      { id: 'security', label: 'Divulgation responsable' },
    ],
  },
  en: {
    skip: 'Skip to content',
    home: 'Home',
    homeSuffix: ', home',
    nav: 'Main navigation',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    cta: 'Request a demo',
    language: 'Language',
    breadcrumbs: 'Breadcrumb',
    footerNav: 'Site map',
    footerTagline: 'Identity and trust platforms for critical operations.',
    footerContact: 'Contact',
    footerLegal: 'Legal information',
    navItems: [
      { id: 'platforms', label: 'Platforms' },
      { id: 'services', label: 'Services' },
      { id: 'architectures', label: 'Architectures' },
      { id: 'labs', label: 'Labs' },
      { id: 'company', label: 'Company' },
      { id: 'contact', label: 'Contact' },
    ],
    footerColumns: [
      {
        title: 'Platforms',
        links: [
          { id: 'platforms', label: 'Overview' },
          { id: 'identity', label: 'LUXIA Identity' },
          { id: 'key', label: 'LUXIA Key' },
          { id: 'alma', label: 'ALMA' },
        ],
      },
      {
        title: 'Expertise',
        links: [
          { id: 'services', label: 'Services' },
          { id: 'architectures', label: 'Architectures' },
          { id: 'runtime', label: 'Runtime platform' },
          { id: 'labs', label: 'Labs' },
        ],
      },
      {
        title: 'Company',
        links: [
          { id: 'company', label: 'About' },
          { id: 'careers', label: 'Careers' },
          { id: 'security', label: 'Security' },
          { id: 'contact', label: 'Contact' },
        ],
      },
    ],
    legalItems: [
      { id: 'legal', label: 'Legal notice' },
      { id: 'privacy', label: 'Privacy and cookies' },
      { id: 'security', label: 'Responsible disclosure' },
    ],
  },
};
