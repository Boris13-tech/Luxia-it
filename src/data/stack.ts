import type { RouteId } from '../i18n/routes';
import type { Level, Stage } from './evidence';

export interface StackLayer {
  readonly number: string;
  readonly code: string;
  readonly name: string;
  readonly subtitle: string;
  readonly summary: string;
  readonly stage: Stage;
  readonly level: Level;
  readonly scopes: readonly string[];
  readonly capabilities: readonly string[];
  readonly workflow?: readonly string[];
  readonly route?: RouteId;
  readonly platformSlug?: 'luxia-identity' | 'luxia-key' | 'alma';
  readonly ctaLabel?: string;
}

export interface StrategicPillar {
  readonly id: string;
  readonly leftTitle: string;
  readonly rightTitle: string;
  readonly detail: string;
}

export interface KeyShowcaseContent {
  readonly headline: string;
  readonly subheadline: string;
  readonly enterprise: {
    readonly title: string;
    readonly badge: string;
    readonly summary: string;
    readonly points: readonly string[];
  };
  readonly consumer: {
    readonly title: string;
    readonly badge: string;
    readonly summary: string;
    readonly screenLogin: {
      readonly brand: string;
      readonly prompt: string;
      readonly primaryAction: string;
      readonly secondaryAction: string;
      readonly providersLabel: string;
      readonly providers: readonly string[];
      readonly privacyNote: string;
    };
    readonly screenApproval: {
      readonly service: string;
      readonly alert: string;
      readonly location: string;
      readonly device: string;
      readonly timestamp: string;
      readonly approve: string;
      readonly deny: string;
      readonly inspect: string;
    };
    readonly benefits: readonly { readonly title: string; readonly text: string }[];
  };
}

export const unifiedCore = {
  name: 'Plateforme unifiée LUXIA',
  domains: ['Identités', 'Politiques', 'Confiance', 'Infrastructure', 'Preuves', 'IA'] as const,
  statement: 'Des produits intégrés pour une souveraineté totale : une même colonne vertébrale de l’identité jusqu’aux agents.',
} as const;

export const stackLayers: readonly StackLayer[] = [
  {
    number: '06',
    code: 'AI-SEC',
    name: 'LUXIA AI Security',
    subtitle: 'Agents IA & gouvernance',
    summary:
      'Des agents de confiance au service des équipes : identité dédiée pour chaque agent, outillage gouverné, délégation bornée dans le temps et validation humaine sur les actions critiques.',
    stage: 'prototype',
    level: 'implemented',
    scopes: ['Identité agents IA', 'Outils & APIs', 'Human-in-the-Loop', 'Délégation bornée'],
    capabilities: [
      'Identité des agents IA distincte de l’opérateur humain',
      'Gouvernance des outils exposés aux modèles et serveurs',
      'Contrôles de délégation et plafonds de privilèges stricts',
      'Approbation humaine explicite avant toute action sensible',
      'Traçabilité complète de chaque appel, paramètre et décision IA',
    ],
    workflow: ['Analyser', 'Planifier', 'Exécuter', 'Demander approbation', 'Action validée'],
    platformSlug: 'alma',
    ctaLabel: 'Explorer ALMA & gouvernance IA',
  },
  {
    number: '05',
    code: 'LEDGER',
    name: 'LUXIA Trust Ledger',
    subtitle: 'Traçabilité, preuves & conformité',
    summary:
      'Des preuves exploitables pour la direction, les équipes SOC et les auditeurs : journaux d’audit en ajout seul, corrélation forensique et archivage sous contrôle souverain.',
    stage: 'development',
    level: 'implemented',
    scopes: ['Audit append-only', 'Forensique', 'Archivage souverain', 'RGPD · ISO · NIS2'],
    capabilities: [
      'Journaux d’audit complets sur les connexions, élévations et refus',
      'Journalisation en ajout seul conçue contre l’altération applicative',
      'Traçabilité forensique reliant requête, contexte, règle et approbation',
      'Archivage maîtrisé répondant aux contraintes sectorielles',
      'Préparation des preuves pour les contrôles RGPD, ISO 27001 et NIS2',
    ],
    route: 'trust',
    ctaLabel: 'Voir la doctrine de preuves',
  },
  {
    number: '04',
    code: 'RUNTIME',
    name: 'LUXIA Sovereign Runtime & Edge Operations',
    subtitle: 'Infrastructure souveraine & continuité',
    summary:
      'Votre entreprise maintient ses contrôles d’accès critiques sur l’ensemble de ses implantations : siège social, agences, sites distants et environnements hybrides ou contraints.',
    stage: 'research',
    level: 'target',
    scopes: ['Siège social', 'Agence', 'Site distant (Edge)', 'Datacenter local (on-premise)', 'Cloud (hybride)'],
    capabilities: [
      'Maintien des décisions critiques en connectivité intermittente',
      'Continuité opérationnelle hors ligne sur périmètre validé',
      'Plan de reprise et bascule encadré par politiques locales',
      'Contrôle local des clés et journaux sans dépendance subie',
      'Topologie déployable en hébergement managé, sur site ou souverain',
    ],
    route: 'architectures',
    ctaLabel: 'Étudier les topologies souveraines',
  },
  {
    number: '03',
    code: 'GRAPH',
    name: 'LUXIA Trust Graph',
    subtitle: 'Écosystème de confiance sans frontières',
    summary:
      'Étendez une gouvernance claire au-delà d’un seul annuaire : filiales, partenaires industriels, prestataires et organisations externes vérifiées sans multiplication des comptes dormants.',
    stage: 'research',
    level: 'designed',
    scopes: ['Filiales', 'Partenaires', 'Fournisseurs', 'Organisations externes'],
    capabilities: [
      'Relations inter-organisations vérifiées et révocables à tout instant',
      'Administration déléguée par entité ou périmètre métier',
      'Collaboration sécurisée sans duplication de comptes sensibles',
      'Fédération d’identités et cohérence des habilitations partagées',
      'Cartographie lisible de l’écosystème et de ses flux de confiance',
    ],
    route: 'solutions',
    ctaLabel: 'Voir les cas d’usage fédérés',
  },
  {
    number: '02',
    code: 'POLICY',
    name: 'LUXIA Policy',
    subtitle: 'Le bon accès, au bon moment, pour la bonne raison',
    summary:
      'Un moteur de décision unique évaluant l’utilisateur, le terminal, la sensibilité métier et la séparation des tâches avant d’autoriser l’accès aux applications critiques.',
    stage: 'development',
    level: 'implemented',
    scopes: ['ERP', 'RH', 'Finance', 'CRM', 'Portails', 'APIs'],
    capabilities: [
      'Autorisation contextuelle évaluée sur la session et la ressource',
      'Décisions d’accès en temps réel côté application et API',
      'Application native du moindre privilège et de la séparation des tâches',
      'Architecture Zero Trust : aucune confiance implicite sur le réseau seul',
      'Accès conditionnel couplé aux signaux de risque et à la conformité poste',
    ],
    route: 'runtime',
    ctaLabel: 'Suivre le flux de décision',
  },
  {
    number: '01',
    code: 'IDENTITY',
    name: 'LUXIA Identity & LUXIA Key',
    subtitle: 'Des identités souveraines pour des personnes réelles',
    summary:
      'Le socle opérationnel de la suite, accompagné par LUXIA Key dès la première authentification : identités humaines et non humaines vérifiées, passkeys résistantes au hameçonnage et contrôle local ou fédéré.',
    stage: 'development',
    level: 'implemented',
    scopes: ['Employés', 'Administrateurs', 'Partenaires', 'Prestataires', 'Agents IA', 'Postes', 'Mobiles', 'Objets connectés'],
    capabilities: [
      'Authentification multi-facteurs résistante au phishing (passkeys WebAuthn)',
      'Companion applicatif LUXIA Key pour l’enrôlement et la validation temps réel',
      'Identité locale souveraine avec passerelle Microsoft Entra ID (SCIM / OIDC)',
      'Mécanismes de récupération maîtrisés sans exposition de secrets',
      'Cycle complet : provisionnement, revue d’accès, suspension et révocation',
    ],
    platformSlug: 'luxia-identity',
    ctaLabel: 'Découvrir LUXIA Identity & Key',
  },
] as const;

export const strategicPillars: readonly StrategicPillar[] = [
  {
    id: 'securite-performance',
    leftTitle: 'Sécurité des personnes',
    rightTitle: 'Performance des entreprises',
    detail: 'Supprimer la friction des mots de passe et des validations obscures tout en élevant le niveau de preuve cryptographique.',
  },
  {
    id: 'souverainete-ancrage',
    leftTitle: 'Données souveraines',
    rightTitle: 'Opportunités régionales',
    detail: 'Concevoir des systèmes dont l’hébergement, les clés, les politiques et les journaux restent sous contrôle du client.',
  },
  {
    id: 'confiance-ouverture',
    leftTitle: 'Confiance aujourd’hui',
    rightTitle: 'Un avenir plus ouvert demain',
    detail: 'Fonder des systèmes ouverts sur des standards reconnus (WebAuthn, OIDC, SCIM) sans verrouillage propriétaire sur les formats.',
  },
] as const;

export const keyShowcase: KeyShowcaseContent = {
  headline: 'Une seule identité. Un quotidien plus sûr.',
  subheadline: 'Connectez-vous. Protégez-vous. Gardez le contrôle.',
  enterprise: {
    title: 'LUXIA Key pour l’Entreprise (compagnon de LUXIA Identity)',
    badge: 'Socle d’authentification & d’approbation',
    summary:
      'LUXIA Key accompagne la première brique de LUXIA Identity : chaque collaborateur et administrateur dispose d’un point de contrôle matériel et applicatif pour valider ses accès sensibles, sans dépendre de codes SMS vulnérables.',
    points: [
      'Enrôlement guidé sur poste et mobile par clé d’accès (passkey) liée au matériel',
      'Validation hors bande d’actions critiques (élévation de privilège, agent IA, export)',
      'Synchronisation directe avec les politiques de LUXIA Identity et Microsoft Entra ID',
    ],
  },
  consumer: {
    title: 'LUXIA Key for User',
    badge: 'Application mobile & expérience utilisateur',
    summary:
      'L’expérience de sécurité d’entreprise portée à hauteur d’individu : connexion sans mot de passe par QR code ou passkey et maîtrise explicite de chaque nouvelle session détectée.',
    screenLogin: {
      brand: 'LUXIA Key',
      prompt: 'Votre identité. Vos comptes. Partout, en sécurité.',
      primaryAction: 'Se connecter',
      secondaryAction: 'Scanner un QR code',
      providersLabel: 'Ou continuer avec',
      providers: ['Apple', 'Google', 'Microsoft'],
      privacyNote: 'Confidentialité par défaut',
    },
    screenApproval: {
      service: 'Instagram',
      alert: 'Nouvelle connexion détectée',
      location: 'Bucarest, Roumanie',
      device: 'iPhone 17 Pro',
      timestamp: 'Il y a 2 minutes',
      approve: 'Approuver',
      deny: 'Refuser',
      inspect: 'Voir les détails',
    },
    benefits: [
      {
        title: 'Connexion sans mot de passe',
        text: 'Plus simple, plus rapide et résistante au vol d’identifiants grâce aux clés cryptographiques locales.',
      },
      {
        title: 'Validation des connexions sensibles',
        text: 'Chaque nouvel appareil, pays ou service demande une confirmation explicite : vous approuvez ou refusez en un geste.',
      },
      {
        title: 'Contrôle continu des sessions',
        text: 'Visualisez où vos comptes sont ouverts et révoquez un accès suspect sans réinitialiser toute votre vie numérique.',
      },
    ],
  },
} as const;
