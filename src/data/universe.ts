/**
 * Navigateur d'univers : destinations du site et domaines de l'écosystème.
 * Un domaine n'est pas un produit : c'est une capacité réelle (ou une cible
 * annoncée comme telle), reliée à la page qui la décrit et à son niveau de
 * preuve (src/data/evidence.ts). Sources : src/data/platforms.ts et le dépôt
 * iam-azure-pme (types d'identité, adaptateurs de fournisseurs), lus le
 * 25 octobre 2026. Aucun nom de produit nouveau n'est publié ici.
 */
import type { Level } from './evidence';
import type { RouteId } from '../i18n/routes';

export type DomainId = 'identity' | 'policy' | 'ledger' | 'adapters' | 'agents' | 'key' | 'alma' | 'runtime';

export interface Destination {
  route: RouteId;
  label: string;
  hint: string;
  /** Domaine mis en lumière dans la constellation au survol. */
  domain: DomainId;
}

export interface Domain {
  id: DomainId;
  name: string;
  text: string;
  level: Level;
  /** Précision sur le niveau, quand il ne couvre pas tout le domaine. */
  note?: string | undefined;
  href: string;
  /** Teinte de l'univers (voir docs/CREATIVE_DIRECTION.md, section 4). */
  tone: 'electric' | 'glacier' | 'warm' | 'cyan' | 'violet' | 'sky' | 'steel';
}

export const destinations: readonly Destination[] = [
  { route: 'identity', label: 'Produit', hint: 'LUXIA Identity, la console', domain: 'identity' },
  { route: 'solutions', label: 'Solutions', hint: 'Arrivées, revues, séparation des tâches', domain: 'policy' },
  { route: 'trust', label: 'Sécurité', hint: 'Le centre de confiance', domain: 'ledger' },
  { route: 'services', label: 'Services', hint: 'Cadrage, intégration, exploitation', domain: 'adapters' },
  { route: 'platforms', label: 'Plateformes', hint: 'Identity, Key et ALMA', domain: 'key' },
  { route: 'resources', label: 'Ressources', hint: 'Guides pratiques', domain: 'policy' },
  { route: 'company', label: 'Entreprise', hint: 'Conviction, méthode, jalons', domain: 'identity' },
  { route: 'contact', label: 'Contact', hint: 'Démonstration, questions', domain: 'identity' },
];

export const domains: readonly Domain[] = [
  {
    id: 'identity',
    name: 'LUXIA Identity',
    text: 'Le registre des identités et des accès. Les fournisseurs s’y branchent ; l’identité, les droits et l’historique y restent.',
    level: 'production',
    note: 'Capacités vérifiées en production ; bêta privée en préparation.',
    href: '/plateformes/luxia-identity/',
    tone: 'electric',
  },
  {
    id: 'policy',
    name: 'Politique d’accès',
    text: 'Droits explicites, séparation des tâches appliquée à l’attribution, revues d’accès justifiées.',
    level: 'production',
    href: '/solutions/#separation-taches',
    tone: 'glacier',
  },
  {
    id: 'ledger',
    name: 'Journal en ajout seul',
    text: 'Connexions et actions d’administration, que l’application ne peut ni modifier ni supprimer.',
    level: 'production',
    note: 'Un journal vérifiable par un tiers est prévu, pas encore disponible.',
    href: '/solutions/#preuve-audit',
    tone: 'warm',
  },
  {
    id: 'adapters',
    name: 'Adaptateurs de fournisseurs',
    text: 'Chaque fournisseur d’identité est un adaptateur remplaçable, avec sa coupure d’urgence.',
    level: 'production',
    note: 'Microsoft Entra ID en production ; OIDC générique conçu ; Google, LDAP, SAML et SCIM prévus.',
    href: '/plateformes/luxia-identity/#integrations',
    tone: 'cyan',
  },
  {
    id: 'agents',
    name: 'Identités d’agents IA',
    text: 'Un agent IA est une identité du registre, avec ses propres droits, jamais toute l’autorité de la personne qui l’a lancé.',
    level: 'implemented',
    href: '/plateformes/alma/',
    tone: 'violet',
  },
  {
    id: 'key',
    name: 'LUXIA Key',
    text: 'Un authentificateur : passkeys et approbation des actions sensibles. LUXIA Key prouve ; LUXIA Identity gouverne.',
    level: 'ci',
    note: 'Prototype : serveur WebAuthn vérifié en intégration continue, non déployé.',
    href: '/plateformes/luxia-key/',
    tone: 'sky',
  },
  {
    id: 'alma',
    name: 'ALMA',
    text: 'Recherche des Labs : des agents IA qui agissent par des outils déclarés, avec un accord humain avant toute action irréversible.',
    level: 'implemented',
    note: 'Prototype de recherche, sans offre.',
    href: '/plateformes/alma/',
    tone: 'violet',
  },
  {
    id: 'runtime',
    name: 'Exécution souveraine',
    text: 'Un seul code pour le cloud, l’hybride et le souverain, éventuellement isolé.',
    level: 'target',
    note: 'Architecture cible : aucun déploiement de ce type à ce jour.',
    href: '/architectures/plateforme-execution/',
    tone: 'steel',
  },
];
