/**
 * Deux échelles, utilisées sur tout le site :
 * - le niveau de preuve d'une capacité (ce qui est démontré, et où) ;
 * - l'étape d'une plateforme (ce que l'on peut en attendre aujourd'hui).
 * Elles reprennent l'échelle de maturité des dépôts de LUXIA Identity :
 * UNKNOWN → DESIGNED → IMPLEMENTED → VERIFIED → PRODUCTION VERIFIED.
 */

export type Level = 'production' | 'ci' | 'implemented' | 'designed' | 'target';

export const levels: Record<Level, { label: string; short: string; text: string }> = {
  production: {
    label: 'Vérifié en production',
    short: 'Production',
    text: 'Démontré dans l’environnement de production, par une vérification en lecture seule consignée dans un rapport.',
  },
  ci: {
    label: 'Vérifié en intégration',
    short: 'Intégration',
    text: 'Démontré par les tests automatisés et une répétition, sans être encore déployé en production.',
  },
  implemented: {
    label: 'Implémenté',
    short: 'Implémenté',
    text: 'Code intégré avec ses tests, pas encore démontré dans un scénario réel.',
  },
  designed: {
    label: 'Conçu',
    short: 'Conçu',
    text: 'Une conception écrite existe. Aucun code n’est en service.',
  },
  target: {
    label: 'Cible',
    short: 'Cible',
    text: 'Orientation d’architecture retenue. Ni conçue en détail, ni disponible.',
  },
};

export const levelOrder: readonly Level[] = ['production', 'ci', 'implemented', 'designed', 'target'];

export type Stage = 'research' | 'prototype' | 'development' | 'pilot' | 'available';

export const stages: Record<Stage, { label: string; text: string }> = {
  research: { label: 'Recherche', text: 'Exploration. Aucun engagement de produit.' },
  prototype: { label: 'Prototype', text: 'Fonctionne en démonstration ou en test. Ni déployé pour des tiers, ni proposé.' },
  development: { label: 'En développement', text: 'Des capacités fonctionnent en production. Pas d’offre commerciale.' },
  pilot: { label: 'Pilote', text: 'Utilisé par des organisations invitées, dans un cadre contractuel limité.' },
  available: { label: 'Disponible', text: 'Proposé commercialement, avec une documentation et un support définis.' },
};

export const stageOrder: readonly Stage[] = ['research', 'prototype', 'development', 'pilot', 'available'];
