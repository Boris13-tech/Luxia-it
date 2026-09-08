export const site = {
  name: 'Luxia-IT',
  origin: 'https://luxia-it.legrandborisohandjae.chatgpt.site',
  email: 'Contact@legrand-tech.com',
  phone: '+40 766 438 679',
  whatsapp: 'https://wa.me/40766438679',
  founder: 'Boris Legrand Ohandja',
  locale: 'fr',
  locales: ['fr'] as const,
};
export const services = [
  {
    slug: 'artificial-intelligence',
    pillar: 'INTELLIGENCE',
    title: 'Intelligence artificielle',
    headline: 'L’intelligence devient opérationnelle.',
    intro:
      'Transformer vos connaissances et vos processus en capacités utiles. Nous concevons une IA intégrée à votre activité, avec des limites explicites et une supervision adaptée.',
    outcome:
      'Rendre l’information accessible et aider vos équipes à se concentrer sur les décisions qui comptent.',
    capabilities: [
      [
        'Agents IA & copilotes',
        'Des assistants spécialisés, intégrés aux tâches et outils des équipes. Leur périmètre d’action et leurs règles d’escalade sont définis avant le déploiement.',
      ],
      [
        'Assistants de connaissance',
        'Une recherche dans vos sources autorisées, des réponses traçables et une gestion des droits alignée sur vos documents.',
      ],
      [
        'Intelligence documentaire',
        'Extraction, classement et préparation de données documentaires, avec une revue humaine lorsque la fiabilité attendue l’exige.',
      ],
      [
        'Évaluation & sécurité de l’IA',
        'Scénarios de test, critères de qualité et gestion des risques pour suivre la pertinence des réponses et les usages réels.',
      ],
    ],
    deliverables: [
      'Cadrage des cas d’usage et des données',
      'Architecture de la solution et des accès',
      'Prototype évalué sur un périmètre convenu',
      'Documentation et plan de mise en service',
    ],
    questions: [
      [
        'Par quoi commencer ?',
        'Par une tâche fréquente, un corpus accessible et un résultat que vos équipes peuvent évaluer. Un périmètre précis rend les décisions plus utiles qu’une expérimentation ouverte.',
      ],
      [
        'Un agent peut-il agir seul ?',
        'Le niveau d’autonomie dépend du contexte. Les opérations sensibles doivent conserver des validations et une traçabilité adaptées.',
      ],
    ],
  },
  {
    slug: 'cybersecurity',
    pillar: 'TRUST',
    title: 'Cybersécurité',
    headline: 'La confiance se conçoit.',
    intro:
      'Protéger les identités, les environnements cloud et les données par une architecture cohérente. La sécurité accompagne les usages, les décisions et le cycle de vie des systèmes.',
    outcome:
      'Mieux comprendre votre exposition et donner une priorité claire aux mesures de protection.',
    capabilities: [
      [
        'Identité & accès',
        'Organisation des identités, des rôles et des accès privilégiés. Les autorisations suivent le besoin métier et le cycle de vie des utilisateurs.',
      ],
      [
        'Architecture Zero Trust',
        'Des contrôles adaptés aux identités, aux appareils et aux ressources. La confiance se vérifie au fil des accès.',
      ],
      [
        'Cloud & Microsoft Security',
        'Revue de configurations, politiques de protection et intégration des capacités de sécurité de l’écosystème Microsoft selon votre environnement.',
      ],
      [
        'Évaluations & gouvernance',
        'Analyse de l’existant, hiérarchisation des écarts et préparation des preuves nécessaires à vos démarches de conformité.',
      ],
    ],
    deliverables: [
      'Évaluation de l’exposition et des pratiques',
      'Architecture et matrice de responsabilités',
      'Plan de remédiation priorisé',
      'Revue des contrôles et documentation',
    ],
    questions: [
      [
        'Proposez-vous une certification de conformité ?',
        'Une préparation et une revue technique peuvent soutenir votre démarche. Elles ne constituent ni une certification ni une garantie juridique de conformité.',
      ],
      [
        'Faut-il tout remplacer ?',
        'L’analyse de l’existant permet de distinguer les configurations à corriger, les capacités à renforcer et les changements structurels nécessaires.',
      ],
    ],
  },
  {
    slug: 'cloud',
    pillar: 'SCALE',
    title: 'Cloud & infrastructure',
    headline: 'Conçu pour aujourd’hui. Prêt à évoluer.',
    intro:
      'Construire une infrastructure adaptée à vos usages. De la migration à l’exploitation, nous relions architecture, résilience, sécurité et maîtrise des coûts.',
    outcome:
      'Disposer d’un socle documenté, observable et dimensionné pour les besoins de votre organisation.',
    capabilities: [
      [
        'Architecture Microsoft Azure',
        'Conception des environnements, réseaux, identités et règles de gouvernance selon les contraintes de vos applications.',
      ],
      [
        'Migration & modernisation',
        'Inventaire des dépendances, stratégie de transition et validation progressive des applications et des données.',
      ],
      [
        'Résilience & sauvegarde',
        'Définition des objectifs de reprise, des mécanismes de sauvegarde et des scénarios de restauration à tester.',
      ],
      [
        'Observabilité & optimisation',
        'Suivi des services, compréhension des coûts et ajustement des ressources à partir de l’usage réel.',
      ],
    ],
    deliverables: [
      'Architecture cible et inventaire des dépendances',
      'Plan de migration et de retour arrière',
      'Configuration du socle et supervision',
      'Documentation d’exploitation et de reprise',
    ],
    questions: [
      [
        'Azure est-il obligatoire ?',
        'Azure est un axe d’expertise. Les choix d’architecture sont cadrés à partir des contraintes de votre environnement et de vos objectifs.',
      ],
      [
        'Comment maîtriser les coûts ?',
        'En définissant des responsabilités, des budgets et des mécanismes de suivi dès la conception, puis en revoyant les usages après le déploiement.',
      ],
    ],
  },
  {
    slug: 'automation',
    pillar: 'INTELLIGENCE',
    title: 'Automatisation',
    headline: 'Moins de friction. Plus de continuité.',
    intro:
      'Relier vos outils et vos processus pour que l’information circule. Nous automatisons les étapes répétitives sans perdre la visibilité sur les exceptions et les responsabilités.',
    outcome:
      'Rendre les processus plus cohérents, plus traçables et plus simples à piloter.',
    capabilities: [
      [
        'Cartographie des processus',
        'Comprendre les entrées, les validations, les outils et les exceptions avant de choisir ce qui doit être automatisé.',
      ],
      [
        'Workflows intelligents',
        'Orchestration de tâches documentaires, administratives ou opérationnelles avec contrôles et validations humaines.',
      ],
      [
        'Intégrations & API',
        'Échanges structurés entre systèmes, gestion des erreurs et limites d’accès adaptées aux données concernées.',
      ],
      [
        'Pilotage des opérations',
        'Journalisation, reprise sur erreur et indicateurs définis avec les équipes responsables du processus.',
      ],
    ],
    deliverables: [
      'Cartographie et priorisation des processus',
      'Spécifications des flux et intégrations',
      'Workflows testés et gestion des exceptions',
      'Documentation et transfert aux équipes',
    ],
    questions: [
      [
        'Tous les processus doivent-ils être automatisés ?',
        'Non. Un processus instable ou mal défini doit souvent être simplifié avant d’être automatisé.',
      ],
      [
        'Que se passe-t-il en cas d’erreur ?',
        'Chaque flux doit prévoir une détection, une alerte, une reprise et un responsable. Ces règles sont définies pendant la conception.',
      ],
    ],
  },
];
export const sectors = [
  [
    'PME & ETI',
    'Structurer la croissance sans multiplier la complexité.',
    'Des outils mieux reliés, des connaissances accessibles et des accès organisés.',
    'Automatisation des opérations · Socle cloud · Protection des identités',
  ],
  [
    'Services financiers',
    'Faire évoluer les usages dans un cadre maîtrisé.',
    'Des architectures documentées, des accès traçables et des processus où la supervision reste explicite.',
    'Gouvernance des accès · Sécurité cloud · Intelligence documentaire',
  ],
  [
    'Services professionnels',
    'Donner plus de portée à votre expertise.',
    'Un accès plus simple aux connaissances internes et une préparation mieux structurée des dossiers.',
    'Assistants de connaissance · Workflows · Collaboration',
  ],
  [
    'Éducation',
    'Rendre les ressources utiles et accessibles.',
    'Des environnements numériques organisés autour des utilisateurs, des contenus et de la continuité de service.',
    'Identités · Recherche documentaire · Infrastructure',
  ],
  [
    'Commerce',
    'Relier les opérations aux attentes des clients.',
    'Une circulation plus cohérente de l’information entre les équipes, les outils et les demandes de support.',
    'Automatisation · Support assisté · Intégration',
  ],
  [
    'Secteur public',
    'Moderniser avec méthode et traçabilité.',
    'Une approche progressive des services numériques, attentive à la gouvernance des données et aux responsabilités.',
    'Architecture · Gouvernance · Modernisation',
  ],
  [
    'Startups',
    'Construire un socle qui accompagne la trajectoire.',
    'Des choix techniques explicites, une sécurité intégrée et une infrastructure adaptée au stade du produit.',
    'Cloud · Architecture produit · IA appliquée',
  ],
];
export const articles = [
  {
    slug: 'agents-processus',
    tag: 'INTELLIGENCE',
    title: 'Agents IA : commencer par le processus, pas par le modèle.',
    intro:
      'Un agent utile répond à un besoin défini. Le choix du modèle arrive après la compréhension du travail à accomplir.',
    sections: [
      [
        'Partir d’une tâche observable',
        'Identifier les informations d’entrée, le résultat attendu et la personne qui peut juger sa qualité. « Aider une équipe » est une ambition ; « préparer une réponse à partir de documents autorisés » est un périmètre de travail.',
      ],
      [
        'Définir les frontières de l’action',
        'Distinguer la consultation, la proposition et l’exécution. Ces trois niveaux n’impliquent pas les mêmes accès ni les mêmes conséquences. Les validations humaines doivent correspondre aux enjeux de chaque action.',
      ],
      [
        'Évaluer avant d’étendre',
        'Constituer des situations représentatives, y compris des cas incomplets ou contradictoires. Examiner la pertinence, la traçabilité et la capacité à reconnaître une limite. Une démonstration convaincante ne remplace pas ce travail.',
      ],
      [
        'Prévoir l’exploitation',
        'Un agent s’inscrit dans un système vivant. Les documents, les permissions et les processus changent. La responsabilité de suivre ces évolutions doit être attribuée dès le départ.',
      ],
    ],
  },
  {
    slug: 'identite-securite',
    tag: 'TRUST',
    title: 'L’identité, premier périmètre de votre sécurité.',
    intro:
      'Les applications se distribuent. Les utilisateurs travaillent dans plusieurs environnements. L’identité relie ces accès et devient un point de décision central.',
    sections: [
      [
        'Savoir qui accède à quoi',
        'Un inventaire des comptes ne suffit pas. Il faut comprendre les droits effectifs, les comptes techniques, les accès temporaires et les privilèges conservés au fil des changements de rôle.',
      ],
      [
        'Appliquer le besoin réel',
        'Des rôles définis par l’activité rendent les autorisations plus lisibles. Les exceptions doivent rester visibles, justifiées et réexaminées.',
      ],
      [
        'Traiter le cycle de vie',
        'L’arrivée, la mobilité et le départ d’une personne sont des événements de sécurité. Les processus RH et informatiques doivent se rejoindre dans des opérations fiables et attribuées.',
      ],
      [
        'Vérifier dans la durée',
        'Les revues d’accès et les journaux apportent une vue concrète de l’usage. Leur valeur dépend des personnes responsables de les examiner et de corriger les écarts.',
      ],
    ],
  },
  {
    slug: 'cloud-pilotage',
    tag: 'SCALE',
    title: 'Le cloud se pilote autant qu’il se construit.',
    intro:
      'Une architecture cloud ne s’arrête pas à sa mise en service. Elle doit rester compréhensible à mesure que les usages et les coûts évoluent.',
    sections: [
      [
        'Nommer les responsabilités',
        'Chaque environnement doit avoir un propriétaire, un usage et un niveau de service attendu. Ces repères simplifient les arbitrages et les décisions de changement.',
      ],
      [
        'Rendre les coûts lisibles',
        'La répartition des ressources et leur identification facilitent l’analyse. Un budget utile se rattache à un service et à un besoin, pas seulement à un montant global.',
      ],
      [
        'Tester la reprise',
        'Une sauvegarde et une restauration réussie sont deux choses différentes. Les scénarios de reprise doivent tenir compte des dépendances et être confrontés aux objectifs de service.',
      ],
      [
        'Organiser l’amélioration',
        'Les métriques ont un intérêt lorsqu’elles déclenchent une décision. Prévoir un rythme de revue aide à ajuster les ressources, documenter les compromis et anticiper les évolutions.',
      ],
    ],
  },
];
export const cases = [
  {
    slug: 'knowledge-assistant',
    title: 'La connaissance d’entreprise, rendue accessible.',
    tag: 'INTELLIGENCE',
    intro:
      'Architecture de référence pour un assistant documentaire respectant les permissions des utilisateurs.',
    challenge:
      'Les documents d’une organisation sont dispersés. Retrouver une réponse exige de connaître les bonnes sources et leur contexte.',
    architecture:
      'Sources autorisées → ingestion et indexation → recherche filtrée par droits → génération avec références → interface utilisateur.',
    solution:
      'Le concept relie un corpus délimité à une recherche documentaire contrôlée. Les réponses doivent s’appuyer sur des sources consultables ; l’absence de source doit pouvoir conduire à une réponse d’incertitude.',
    impact:
      'Bénéfices envisagés : faciliter la recherche et réduire les interruptions entre équipes. Aucun résultat client ni gain mesuré n’est revendiqué.',
    criteria: [
      'Pertinence sur un jeu de questions métier',
      'Respect des permissions documentaires',
      'Traçabilité des références',
      'Traitement des réponses insuffisamment fondées',
    ],
  },
  {
    slug: 'secure-cloud',
    title: 'Un socle cloud. La sécurité dès le départ.',
    tag: 'TRUST × SCALE',
    intro:
      'Architecture de référence Azure associant identités, gouvernance, réseau et observabilité.',
    challenge:
      'La multiplication des ressources et des équipes peut rendre les responsabilités et les configurations difficiles à suivre.',
    architecture:
      'Identités → politiques et rôles → segmentation des environnements → ressources → journaux et supervision.',
    solution:
      'Le concept sépare les environnements, organise les accès et prévoit des règles de configuration. Les sauvegardes, les budgets et les journaux font partie du socle initial.',
    impact:
      'Bénéfices envisagés : rendre l’exploitation plus lisible et les écarts plus visibles. Aucune disponibilité, certification ou économie mesurée n’est revendiquée.',
    criteria: [
      'Revue des rôles et accès privilégiés',
      'Vérification des politiques de configuration',
      'Exercice de restauration',
      'Lisibilité des coûts par environnement',
    ],
  },
];
export const topRoutes = [
  'expertise',
  'solutions',
  'industries',
  'case-studies',
  'labs',
  'insights',
  'company',
  'company/careers',
  'contact',
  'privacy',
  'legal',
];
export const allRoutes = [
  ...topRoutes,
  ...services.map((s) => 'expertise/' + s.slug),
  ...articles.map((a) => 'insights/' + a.slug),
  ...cases.map((c) => 'case-studies/' + c.slug),
];
