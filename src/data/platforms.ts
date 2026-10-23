/**
 * Plateformes Luxia-IT. Chaque affirmation porte un niveau de preuve
 * (src/data/evidence.ts). Sources, lues le 23 octobre 2026 :
 * - LUXIA Identity : dépôt public Boris13-tech/iam-azure-pme
 *   (docs/product/ENTERPRISE-READINESS.md, docs/legal/SECURITY-OVERVIEW.md,
 *   docs/legal/DATA-RESIDENCY.md, docs/architecture/ADR-SOVEREIGN-IDENTITY-CONTROL-PLANE.md) ;
 * - LUXIA Key : dépôt Boris13-tech/Luxia-key et
 *   iam-azure-pme/docs/architecture/LUXIA-KEY-INTEGRATION-DECISION.md ;
 * - ALMA : dépôt Boris13-tech/alma (README, docs/ARCHITECTURE.md).
 * Toute modification de statut doit s'appuyer sur une preuve équivalente.
 */
import type { Level, Stage } from './evidence';

export interface Claim {
  title: string;
  text: string;
  level: Level;
}

export interface Diagram {
  inputs: { label: string; items: readonly string[] };
  core: { label: string; items: readonly string[] };
  outputs: { label: string; items: readonly string[] };
  base?: { label: string; items: readonly string[] } | undefined;
  links?: { in?: string; out?: string; base?: string } | undefined;
  note?: string | undefined;
}

export interface Platform {
  slug: 'luxia-identity' | 'luxia-key' | 'alma';
  name: string;
  /** Rôle en quelques mots. */
  role: string;
  /** Une phrase, reprise sur l'accueil et la vue d'ensemble. */
  summary: string;
  stage: Stage;
  stageNote: string;
  description: string;
  lead: string;
  problem: { intro: string; points: readonly { title: string; text: string }[] };
  principle?: { title: string; text: string; level: Level } | undefined;
  capabilities: readonly Claim[];
  /** Ce qui n'est pas disponible aujourd'hui, avec son niveau réel. */
  next: readonly Claim[];
  integrations: readonly { name: string; level: Level; note: string }[];
  security: readonly Claim[];
  operations: readonly Claim[];
  deployment: readonly Claim[];
  diagram: Diagram;
  /** Ce que la plateforme ne fait pas ou n'a pas, dit sans détour. */
  limits: readonly string[];
}

const identity: Platform = {
  slug: 'luxia-identity',
  name: 'LUXIA Identity',
  role: 'Identités et accès',
  summary:
    'Le registre des identités et des accès d’une organisation : qui existe, comment chacun se connecte, à quoi chacun a droit, et la trace de chaque décision.',
  stage: 'development',
  stageNote: 'Bêta privée en préparation, sur invitation. Aucune offre commerciale à ce jour.',
  description:
    'LUXIA Identity, identités et accès : organisations isolées, passkeys, Microsoft Entra ID, habilitations et journal en ajout seul. Le niveau de preuve de chaque capacité.',
  lead: 'La plateforme d’identités et d’accès de Luxia-IT. Les fournisseurs d’identité s’y branchent ; l’identité, les droits et l’historique restent dans son cœur.',
  problem: {
    intro:
      'Dans la plupart des organisations, l’identité est dispersée : un annuaire, un ou plusieurs fournisseurs externes, des comptes locaux dans chaque application. À un instant donné, personne ne peut dire qui a accès à quoi, ni prouver qui a fait quoi.',
    points: [
      {
        title: 'L’identité appartient au fournisseur',
        text: 'Quand l’annuaire d’un fournisseur fait autorité, en changer ou en ajouter un remet en cause les comptes, les droits et l’historique.',
      },
      {
        title: 'Des droits sans propriétaire',
        text: 'Les habilitations s’accumulent au fil des arrivées et des mobilités. Les départs ne sont pas toujours suivis d’effet.',
      },
      {
        title: 'Une trace reconstituée après coup',
        text: 'Répondre à un auditeur oblige à croiser plusieurs journaux, que leurs auteurs peuvent souvent modifier.',
      },
    ],
  },
  principle: {
    title: 'Les fournisseurs se branchent sur LUXIA, jamais l’inverse',
    text: 'L’identité canonique, l’état des droits et l’historique restent dans le cœur de la plateforme. Chaque fournisseur d’identité est un adaptateur remplaçable : il prouve une identité, il ne la possède pas.',
    level: 'production',
  },
  capabilities: [
    {
      title: 'Organisations isolées',
      text: 'Les données de chaque organisation sont séparées par la sécurité au niveau des lignes de PostgreSQL, en mode forcé. Le rôle applicatif ne peut pas la contourner.',
      level: 'production',
    },
    {
      title: 'Connexion sans mot de passe',
      text: 'Passkeys (WebAuthn) résistantes à l’hameçonnage pour les comptes locaux. Aucun mot de passe n’existe.',
      level: 'production',
    },
    {
      title: 'Récupération encadrée',
      text: 'Codes de récupération à usage unique, affichés une seule fois et conservés sous forme d’empreinte. Une connexion de récupération ouvre une session de 15 minutes limitée à l’ajout d’une passkey.',
      level: 'production',
    },
    {
      title: 'Microsoft Entra ID',
      text: 'Connexion des personnes d’une organisation qui relie son locataire Entra. La plateforme enregistre ce que Microsoft atteste, sans revendiquer de second facteur qu’elle ne peut pas prouver.',
      level: 'production',
    },
    {
      title: 'Connexions de fournisseurs pilotées',
      text: 'Chaque connexion de fournisseur a son cycle de vie et sa coupure d’urgence. Les connexions sont isolées entre organisations.',
      level: 'production',
    },
    {
      title: 'Personnes et comptes',
      text: 'Personnes, comptes et leur cycle de vie : arrivée, mobilité, départ.',
      level: 'production',
    },
    {
      title: 'Inscription des organisations',
      text: 'Une organisation s’inscrit et son fondateur se connecte d’emblée avec une passkey. Plusieurs organisations coexistent sur la plateforme.',
      level: 'production',
    },
    {
      title: 'Ressources et habilitations',
      text: 'Ressources, droits explicites, règles de séparation des tâches et revues d’accès.',
      level: 'production',
    },
    {
      title: 'Administration protégée',
      text: 'Aucune organisation ne peut perdre son dernier administrateur. La règle est appliquée par la base de données, y compris en cas de modifications simultanées.',
      level: 'production',
    },
    {
      title: 'Journal de sécurité en ajout seul',
      text: 'Le journal d’administration et les preuves de connexion ne peuvent être ni modifiés ni supprimés par l’application. Un tableau de bord présente la posture de l’organisation.',
      level: 'production',
    },
  ],
  next: [
    {
      title: 'Connexions OIDC génériques',
      text: 'Un moteur commun pour tout fournisseur OIDC, Microsoft devenant un profil parmi d’autres.',
      level: 'designed',
    },
    {
      title: 'Coffre de secrets par connexion',
      text: 'Les secrets de chaque connexion de fournisseur conservés dans un coffre, référencés par connexion.',
      level: 'designed',
    },
    {
      title: 'Conservation et suppression appliquées',
      text: 'Durées de conservation appliquées automatiquement aux sessions, aux journaux et aux organisations fermées.',
      level: 'designed',
    },
    {
      title: 'Notifications',
      text: 'Un canal de notification indépendant du prestataire, pour les invitations et les événements sensibles.',
      level: 'designed',
    },
    {
      title: 'Export pour audit et portabilité',
      text: 'Export des identités, des accès et du journal d’une organisation.',
      level: 'target',
    },
    {
      title: 'Google, LDAP et Active Directory, SAML, SCIM',
      text: 'D’autres fournisseurs et protocoles, branchés sur le même cœur.',
      level: 'target',
    },
    {
      title: 'Journal vérifiable',
      text: 'Des enregistrements dont l’intégrité peut être démontrée à un tiers, au-delà de l’ajout seul.',
      level: 'target',
    },
  ],
  integrations: [
    { name: 'Passkeys (WebAuthn)', level: 'production', note: 'Comptes locaux LUXIA.' },
    { name: 'Microsoft Entra ID', level: 'production', note: 'Par locataire, après consentement de son administrateur.' },
    { name: 'Fournisseurs OIDC', level: 'designed', note: 'Moteur générique en cours de revue.' },
    { name: 'Google', level: 'target', note: 'Par le même moteur.' },
    { name: 'LDAP, Active Directory', level: 'target', note: 'Annuaires d’entreprise.' },
    { name: 'SAML, SCIM', level: 'target', note: 'Après les connexions OIDC.' },
  ],
  security: [
    {
      title: 'Isolation par la base de données',
      text: 'Sécurité au niveau des lignes forcée. Le rôle de l’application n’est ni superutilisateur ni autorisé à contourner cette sécurité.',
      level: 'production',
    },
    {
      title: 'Sessions',
      text: 'Jetons conservés sous forme d’empreinte uniquement, expiration après 24 heures, révocation par la personne ou par un administrateur. Une organisation suspendue ne peut pas se connecter.',
      level: 'production',
    },
    {
      title: 'Opérateur sans droit',
      text: 'L’opérateur Luxia-IT ne détient aucun droit dans une organisation cliente. Une intervention d’urgence suit une liste fermée d’actions, avec simulation, empreinte du plan et confirmation saisie. Elle est inscrite au journal et signalée aux administrateurs de l’organisation.',
      level: 'production',
    },
    {
      title: 'Chiffrement en transit',
      text: 'TLS entre les navigateurs et l’application, et entre l’application et la base de données.',
      level: 'production',
    },
    {
      title: 'Secrets',
      text: 'Jamais écrits dans les journaux ni dans le dépôt de code.',
      level: 'production',
    },
  ],
  operations: [
    {
      title: 'Changements vérifiés',
      text: 'Chaque changement passe par une revue de code et des tests automatisés, y compris sur les règles d’isolation de la base. Une migration est répétée sur une copie avec un retour arrière écrit. Chaque mise en production est vérifiée en lecture seule et consignée.',
      level: 'production',
    },
    {
      title: 'Sauvegardes indépendantes',
      text: 'Sauvegardes chiffrées hors du fournisseur de base de données, dans l’Union européenne, avec une clé que seul Luxia-IT détient, protégées contre la suppression pendant 30 jours.',
      level: 'production',
    },
    {
      title: 'Restauration démontrée',
      text: 'Le 13 octobre 2026, la base de production a été reconstruite à partir d’une sauvegarde dans un environnement vide : tables et objets identiques, base restaurée et vérifiée en 81 secondes.',
      level: 'production',
    },
    {
      title: 'Bascule répétée dans la région cible',
      text: 'Le 18 octobre 2026, des données réelles ont été restaurées à Francfort et l’application a été basculée vers une base restaurée.',
      level: 'ci',
    },
    {
      title: 'Alerte de sauvegarde',
      text: 'Une alerte, émise hors de la chaîne de sauvegarde, prévient l’opérateur si une sauvegarde manque.',
      level: 'production',
    },
    {
      title: 'Supervision applicative',
      text: 'Disponibilité, erreurs serveur, latence et disponibilité de la base, avec alertes.',
      level: 'designed',
    },
  ],
  deployment: [
    {
      title: 'Opéré par Luxia-IT',
      text: 'Plateforme managée : fonctions serverless et PostgreSQL managé. Hébergement actuel aux États-Unis (côte est), sauvegardes dans l’Union européenne (Paris). Cible avant toute bêta commerciale : Union européenne (Francfort).',
      level: 'production',
    },
    {
      title: 'Hybride et sur site',
      text: 'Principe d’architecture retenu : un seul code et un seul modèle de données pour le cloud, l’hybride et le souverain. Aucun déploiement de ce type à ce jour.',
      level: 'target',
    },
    {
      title: 'Souverain, éventuellement isolé',
      text: 'Le cœur est conçu pour identifier une personne et évaluer un accès sans dépendre d’un fournisseur externe ni d’une connexion Internet permanente. Aucun déploiement de ce type à ce jour.',
      level: 'target',
    },
  ],
  diagram: {
    inputs: { label: 'Fournisseurs d’identité', items: ['Passkeys LUXIA', 'Microsoft Entra ID'] },
    core: {
      label: 'LUXIA Identity',
      items: ['Organisations isolées', 'Identités canoniques', 'Sessions', 'Habilitations et revues', 'Journal en ajout seul', 'Interventions encadrées'],
    },
    outputs: { label: 'Gouvernance', items: ['Administrateurs', 'Revues d’accès', 'Auditeurs'] },
    base: { label: 'Données', items: ['PostgreSQL, isolation par ligne forcée', 'Sauvegardes chiffrées indépendantes'] },
    links: { in: 'Preuve d’identité', out: 'Décisions tracées', base: 'Accès isolé' },
    note: 'Fournisseurs disponibles : passkeys et Microsoft Entra ID. Connexions OIDC génériques en conception ; Google, annuaires LDAP et Active Directory, SAML et SCIM prévus.',
  },
  limits: [
    'Pas d’authentification unique (SSO) vers des applications tierces à ce jour : la plateforme gouverne les identités, les accès et leur trace.',
    'Aucune certification de sécurité, aucun audit externe ni test d’intrusion à ce jour.',
    'Hébergement actuel aux États-Unis ; le passage dans l’Union européenne est répété, pas encore effectué.',
    'Supervision applicative en cours de mise en place.',
  ],
};

const key: Platform = {
  slug: 'luxia-key',
  name: 'LUXIA Key',
  role: 'Authentificateur',
  summary:
    'Un authentificateur : passkeys, approbation des connexions et des actions sensibles, protection sur plusieurs appareils. LUXIA Key prouve ; LUXIA Identity gouverne.',
  stage: 'prototype',
  stageNote: 'Serveur WebAuthn vérifié en intégration continue, non déployé. Interface mobile à l’état de maquette.',
  description:
    'LUXIA Key : authentificateur à base de passkeys pour LUXIA Identity. État réel : serveur WebAuthn vérifié en intégration continue, interface au stade de prototype.',
  lead: 'Un authentificateur prouve la possession, la présence et l’intention d’une personne. Il ne crée ni ne rattache jamais de compte : c’est le rôle de LUXIA Identity.',
  problem: {
    intro:
      'Une connexion réussie ne dit pas tout. Pour une action sensible, il faut savoir que la bonne personne est présente et qu’elle approuve cette opération précise, pas seulement qu’une session est ouverte.',
    points: [
      {
        title: 'Une session ne vaut pas accord',
        text: 'Qui dispose d’une session administrateur volée peut agir comme son titulaire.',
      },
      {
        title: 'Un second facteur sans contexte',
        text: 'Un code à usage unique ne dit pas à la personne ce qu’elle approuve.',
      },
      {
        title: 'Un serveur de confiance de trop',
        text: 'Si le serveur de l’authentificateur peut fabriquer une preuve, sa compromission suffit à usurper une identité.',
      },
    ],
  },
  principle: {
    title: 'Aucune racine de confiance dans LUXIA Key',
    text: 'LUXIA Identity vérifiera elle-même chaque preuve, contre une clé publique qu’elle a enrôlée par une cérémonie vérifiée, sur un défi qu’elle a émis pour l’opération. Un serveur LUXIA Key compromis pourrait refuser le service ; il ne pourrait pas forger une preuve.',
    level: 'designed',
  },
  capabilities: [
    {
      title: 'Serveur WebAuthn',
      text: 'Enregistrement et authentification par passkey. Algorithmes ES256 et RS256 sur liste blanche, vérification de l’utilisateur exigée, identifiants découvrables.',
      level: 'ci',
    },
    {
      title: 'Défis à usage unique',
      text: 'Valables cinq minutes, consommés avant toute vérification cryptographique et liés à l’origine et au domaine.',
      level: 'ci',
    },
    {
      title: 'Sessions et état de sécurité',
      text: 'Jetons opaques conservés sous forme d’empreinte, renouvelés à la connexion. Un compte verrouillé ou désactivé ne peut pas se connecter.',
      level: 'ci',
    },
    {
      title: 'Journal en ajout seul',
      text: 'Événements limités à une liste de champs autorisés, protégés contre la modification par la base.',
      level: 'ci',
    },
  ],
  next: [
    {
      title: 'Approbation des actions sensibles',
      text: 'Actions signées sur un défi émis par LUXIA Identity et lié à l’opération approuvée.',
      level: 'designed',
    },
    {
      title: 'Appairage, notifications, récupération',
      text: 'Appairage d’appareils par code QR, alertes d’authentification en temps réel et parcours de récupération.',
      level: 'designed',
    },
    {
      title: 'Intégration à LUXIA Identity',
      text: 'LUXIA Key devient un authentificateur parmi d’autres de LUXIA Identity, qui doit continuer à fonctionner sans lui.',
      level: 'designed',
    },
    {
      title: 'Vérification renforcée',
      text: 'Exiger une preuve supplémentaire pour les opérations qui augmentent la confiance : activation, sortie de quarantaine, promotion d’un secret.',
      level: 'target',
    },
  ],
  integrations: [
    { name: 'Navigateurs compatibles WebAuthn', level: 'ci', note: 'Même origine uniquement, sans partage de ressources entre origines.' },
    { name: 'LUXIA Identity', level: 'designed', note: 'Par un protocole versionné et des vecteurs de test partagés.' },
  ],
  security: [
    {
      title: 'Configuration contrôlée au démarrage',
      text: 'Origines HTTPS obligatoires et rattachées au domaine. Cookies restreints au domaine exact en recette et en production. Migrations explicites, vérifiées au lancement.',
      level: 'ci',
    },
    {
      title: 'Pas de confiance implicite',
      text: 'Le serveur WebAuthn n’accepte que les algorithmes qu’il a choisis, jamais ceux proposés par défaut par la bibliothèque.',
      level: 'ci',
    },
  ],
  operations: [
    {
      title: 'Déploiement et exploitation',
      text: 'Aucun environnement déployé, aucune procédure d’exploitation à ce jour.',
      level: 'target',
    },
  ],
  deployment: [],
  diagram: {
    inputs: { label: 'Personne', items: ['Appareil de confiance', 'Passkey'] },
    core: { label: 'LUXIA Key', items: ['Serveur WebAuthn', 'Défis à usage unique', 'Sessions', 'Journal en ajout seul'] },
    outputs: { label: 'LUXIA Identity', items: ['Vérification de chaque preuve', 'Décision d’accès'] },
    links: { in: 'Cérémonie WebAuthn', out: 'Preuve signée' },
    note: 'La liaison avec LUXIA Identity est au stade de la conception.',
  },
  limits: [
    'Aucun déploiement ni version distribuée.',
    'Un seul identifiant par personne dans la version actuelle.',
    'L’interface mobile est une maquette de démonstration.',
  ],
};

const alma: Platform = {
  slug: 'alma',
  name: 'ALMA',
  role: 'Agents IA gouvernés',
  summary:
    'Un projet des Labs : un assistant à base d’agents IA qui agit par des outils déclarés, sous des règles d’autorisation explicites. Périmètre et disponibilité non annoncés.',
  stage: 'prototype',
  stageNote: 'Projet de recherche des Labs. Prototype fonctionnel ; aucune offre, ni périmètre ni disponibilité annoncés.',
  description:
    'ALMA : projet des Labs de Luxia-IT sur les agents IA gouvernés. Outils déclarés, accord explicite avant toute action irréversible, journal des actions. Prototype.',
  lead: 'Un agent IA qui agit est une identité qui agit. ALMA étudie ce qu’un agent peut faire, avec quels droits, et comment le prouver.',
  problem: {
    intro:
      'Les agents IA ne se contentent plus de répondre : ils envoient, suppriment, réservent. Chaque action engage quelqu’un. Sans règles explicites, un agent agit avec toute l’autorité de la personne qui l’a lancé.',
    points: [
      {
        title: 'Une intention devinée',
        text: 'Un agent qui interprète des mots-clés peut se tromper d’action sans que personne ne le voie.',
      },
      {
        title: 'Une action annoncée, pas prouvée',
        text: 'Un agent peut affirmer avoir agi alors que l’opération a échoué.',
      },
      {
        title: 'Une autorité trop large',
        text: 'Un agent qui hérite de tous les droits de son utilisateur peut faire plus que ce qui lui a été demandé.',
      },
    ],
  },
  principle: {
    title: 'Un agent agit avec des droits explicites, limités et datés',
    text: 'Dans les plateformes Luxia-IT, un agent agira comme une identité de service : des droits explicites, limités dans leur portée et dans le temps, jamais l’autorité de la personne qui l’a lancé.',
    level: 'target',
  },
  capabilities: [
    {
      title: 'Outils déclarés',
      text: 'Chaque capacité est un outil déclaré avec son schéma et son niveau de risque. Le modèle choisit l’outil ; l’intention n’est pas devinée par des mots-clés.',
      level: 'implemented',
    },
    {
      title: 'Accord avant l’irréversible',
      text: 'Envoyer un message, envoyer un e-mail ou supprimer une donnée exige une confirmation explicite, quel que soit le niveau d’autonomie choisi.',
      level: 'implemented',
    },
    {
      title: 'Aucune action annoncée sans preuve',
      text: 'Une action n’est annoncée que si l’outil a répondu avec succès. Un échec est dit en clair, avec sa raison.',
      level: 'implemented',
    },
    {
      title: 'Journal et file d’attente',
      text: 'Les actions en attente d’accord et les actions exécutées sont journalisées.',
      level: 'implemented',
    },
  ],
  next: [
    {
      title: 'Intégrations validées avec de vrais comptes',
      text: 'Agenda, messagerie et e-mail : le parcours de connexion réel reste à valider.',
      level: 'implemented',
    },
    {
      title: 'Agents gouvernés par LUXIA Identity',
      text: 'Un agent rattaché à une organisation, avec ses habilitations et sa trace dans le journal.',
      level: 'target',
    },
  ],
  integrations: [],
  security: [
    {
      title: 'Données personnelles chiffrées',
      text: 'Jetons des comptes connectés et coordonnées chiffrés en base.',
      level: 'implemented',
    },
  ],
  operations: [],
  deployment: [],
  diagram: {
    inputs: { label: 'Personne', items: ['Demande en langage naturel', 'Accord explicite'] },
    core: { label: 'ALMA', items: ['Orchestrateur', 'Outils déclarés', 'Règles d’autorisation', 'Actions en attente'] },
    outputs: { label: 'Services connectés', items: ['Agenda', 'Messages', 'Tâches et rappels'] },
    base: { label: 'Traçabilité', items: ['Journal des actions', 'Données sensibles chiffrées'] },
    links: { in: 'Intention', out: 'Action autorisée', base: 'Journal' },
    note: 'Le prototype actuel est un assistant personnel vocal en français.',
  },
  limits: ['Ni produit, ni offre : un terrain d’étude des Labs.', 'Les intégrations externes ne sont pas encore validées avec de vrais comptes.'],
};

export const platforms: readonly Platform[] = [identity, key, alma];

export const platformHref = (slug: Platform['slug']) => `/plateformes/${slug}/`;

export const getPlatform = (slug: Platform['slug']): Platform => {
  const found = platforms.find((p) => p.slug === slug);
  if (!found) throw new Error(`Plateforme inconnue : ${slug}`);
  return found;
};
