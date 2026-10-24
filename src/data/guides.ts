/**
 * Guides pratiques (rubrique Ressources). Des méthodes générales de gestion
 * des identités et des accès, rédigées par Luxia-IT : elles n'affirment rien
 * sur des clients ni sur des résultats. Le paragraphe « Dans LUXIA Identity »
 * ne décrit que des fonctions présentes dans src/data/product.ts.
 */
export interface GuideSection {
  title: string;
  paragraphs: readonly string[];
  list?: readonly string[] | undefined;
}

export interface Guide {
  slug: string;
  title: string;
  /** Titre court de l'onglet et des moteurs (70 caractères au plus, suffixe compris). */
  shortTitle: string;
  description: string;
  topic: string;
  published: string;
  sections: readonly GuideSection[];
  inProduct: string;
}

export const guides: readonly Guide[] = [
  {
    slug: 'preparer-une-revue-d-acces',
    title: 'Préparer une campagne de revue d’accès qui tienne devant un auditeur',
    shortTitle: 'Préparer une campagne de revue d’accès',
    description:
      'Périmètre, réviseurs, échéance, justification, traitement des retraits : une méthode en six étapes pour des revues d’accès utiles, et les pièges à éviter.',
    topic: 'Gouvernance',
    published: '2026-10-24',
    sections: [
      {
        title: 'Pourquoi les revues d’accès déçoivent',
        paragraphs: [
          'Une revue d’accès doit répondre à une question simple : chaque personne a-t-elle encore besoin de chacun de ses accès ? Dans la pratique, elle prend souvent la forme d’un tableur envoyé à des responsables qui valident tout en bloc, faute de temps et de contexte.',
          'Le résultat ne protège rien et ne convainc pas un auditeur : il voit une validation, pas une décision. Une bonne campagne est courte, ciblée, et laisse une trace de chaque choix.',
        ],
      },
      {
        title: '1. Choisir un périmètre restreint',
        paragraphs: [
          'Commencez par les ressources où une erreur coûte cher : la comptabilité, la paie, les comptes d’administration, les données de clients. Une campagne sur une application ou un petit groupe d’applications est terminée ; une campagne sur « tout le système d’information » ne l’est jamais.',
        ],
      },
      {
        title: '2. Désigner un réviseur qui connaît le métier',
        paragraphs: [
          'Le bon réviseur sait pourquoi un accès existe : c’est souvent le responsable du service ou le propriétaire de l’application, rarement l’équipe informatique seule. Une règle s’impose : personne ne révise ses propres accès.',
        ],
      },
      {
        title: '3. Fixer une échéance et s’y tenir',
        paragraphs: [
          'Deux à trois semaines suffisent pour un périmètre bien choisi. Une échéance trop lointaine dilue l’attention ; une campagne sans échéance n’est jamais clôturée. Pour les accès sensibles, beaucoup d’organisations retiennent un rythme trimestriel, et semestriel ou annuel pour le reste.',
        ],
      },
      {
        title: '4. Exiger une justification',
        paragraphs: [
          'Conserver un accès doit être une décision motivée, en une phrase : « nécessaire pour la clôture mensuelle », « remplacement pendant un congé jusqu’au 30 novembre ». C’est cette phrase qui transforme une case cochée en preuve.',
        ],
        list: [
          'Interdisez les justifications génériques (« OK », « besoin métier »).',
          'Rappelez qu’aucun mot de passe ni secret ne doit figurer dans une justification.',
        ],
      },
      {
        title: '5. Traiter les retraits sans délai',
        paragraphs: [
          'Une décision de retrait qui attend une semaine un ticket manuel laisse l’accès ouvert. Le retrait doit s’appliquer à toutes les ressources que couvre l’accès, et l’écart entre la décision et son application doit être nul ou mesuré.',
        ],
      },
      {
        title: '6. Clôturer et conserver la preuve',
        paragraphs: [
          'Clôturez la campagne quand toutes les décisions sont prises. Conservez ce qu’un auditeur demandera : le périmètre, le réviseur, la date de chaque décision, sa justification et la preuve que les retraits ont été appliqués.',
          'Les référentiels de sécurité, comme ISO/IEC 27001:2022 (mesure 5.18 sur les droits d’accès), attendent que les droits soient revus régulièrement. La forme exacte et la fréquence restent à définir par votre organisation, selon ses risques.',
        ],
      },
    ],
    inProduct:
      'Dans LUXIA Identity, une campagne couvre une ressource, un groupe de ressources ou l’environnement entier, avec un réviseur et une échéance. Chaque décision exige une justification, un réviseur ne peut pas examiner ses propres accès, et retirer un accès le supprime sur toutes ses ressources. L’historique de la campagne est conservé au journal.',
  },
  {
    slug: 'separation-des-taches',
    title: 'Séparation des tâches : par où commencer',
    shortTitle: 'Séparation des tâches : par où commencer',
    description:
      'Identifier les combinaisons de droits à risque, commencer par quelques règles, choisir entre contrôle préventif et détection : une approche progressive.',
    topic: 'Gouvernance',
    published: '2026-10-24',
    sections: [
      {
        title: 'Le principe',
        paragraphs: [
          'La séparation des tâches empêche qu’une seule personne puisse mener seule une opération sensible de bout en bout. L’exemple classique : créer un fournisseur et valider ses paiements. Séparées, ces deux tâches exigent une complicité ; réunies, elles permettent une fraude sans témoin.',
        ],
      },
      {
        title: 'Repérer les combinaisons à risque',
        paragraphs: ['Partez des processus, pas des applications. Quelques combinaisons reviennent dans presque toutes les organisations :'],
        list: [
          'Finance : créer ou modifier un fournisseur, et valider un paiement.',
          'Paie : modifier les données de paie, et valider le virement des salaires.',
          'Informatique : développer une modification, et l’approuver pour la production.',
          'Administration : créer un compte, et lui attribuer des droits d’administration.',
        ],
      },
      {
        title: 'Commencer petit',
        paragraphs: [
          'Une politique de séparation des tâches qui bloque tout le monde dès le premier jour sera désactivée la semaine suivante. Commencez par trois à cinq règles sur les processus les plus exposés, vérifiez qu’elles ne bloquent pas un fonctionnement légitime, puis élargissez.',
          'Les petites équipes ne peuvent pas toujours séparer chaque tâche. Dans ce cas, documentez l’exception et prévoyez un contrôle compensatoire : une validation a posteriori, une revue mensuelle des opérations concernées.',
        ],
      },
      {
        title: 'Prévenir ou détecter',
        paragraphs: [
          'Un contrôle préventif refuse l’attribution qui créerait le conflit : le risque n’existe jamais. Un contrôle de détection trouve les conflits déjà présents parmi les accès existants. Les deux sont utiles : le premier empêche les nouveaux conflits, le second traite l’héritage du passé.',
        ],
      },
      {
        title: 'Garder la trace',
        paragraphs: [
          'Chaque attribution refusée est une information : elle montre qu’une demande a eu lieu, et que la règle a fonctionné. Conservez ces refus au même titre que les accès accordés.',
        ],
      },
    ],
    inProduct:
      'Dans LUXIA Identity, une politique déclare les droits qui s’excluent. Elle est créée désactivée, puis activée quand elle est prête. Une attribution qui créerait le conflit est bloquée et journalisée. Le contrôle est préventif : les conflits déjà présents parmi les accès existants ne sont pas encore détectés.',
  },
  {
    slug: 'passer-aux-cles-d-acces',
    title: 'Passer aux clés d’accès (passkeys) sans perdre la maîtrise de la récupération',
    shortTitle: 'Passer aux clés d’accès (passkeys)',
    description:
      'Ce qu’est une clé d’accès, pourquoi elle résiste à l’hameçonnage, et comment préparer le déploiement et la récupération des comptes.',
    topic: 'Authentification',
    published: '2026-10-24',
    sections: [
      {
        title: 'Ce qu’est une clé d’accès',
        paragraphs: [
          'Une clé d’accès (passkey) remplace le mot de passe par une paire de clés cryptographiques, selon les standards FIDO2 et WebAuthn. La clé privée reste sur l’appareil de la personne ou dans son gestionnaire de clés ; le service ne conserve que la clé publique.',
          'La personne déverrouille sa clé comme elle déverrouille son appareil : empreinte, visage ou code. Il n’y a rien à retenir, et rien à réutiliser d’un site à l’autre.',
        ],
      },
      {
        title: 'Pourquoi elle résiste à l’hameçonnage',
        paragraphs: [
          'Une clé d’accès est liée au domaine du service pour lequel elle a été créée. Sur un faux site, le navigateur ne la propose pas : il n’y a pas de secret à saisir, donc rien à voler. Et comme le service ne détient que des clés publiques, une fuite de sa base ne livre aucun secret utilisable.',
        ],
      },
      {
        title: 'Préparer la récupération avant le déploiement',
        paragraphs: [
          'La vraie question n’est pas la connexion, mais la perte : un téléphone cassé, un ordinateur remplacé. Une récupération mal conçue redevient la porte d’entrée que les clés d’accès avaient fermée.',
        ],
        list: [
          'Encouragez chaque personne à enregistrer au moins deux clés (deux appareils, ou une clé de sécurité physique en secours).',
          'Fournissez des codes de récupération à usage unique, affichés une seule fois, et conservés côté service sous forme d’empreinte.',
          'Limitez ce qu’une connexion de récupération permet : ajouter une nouvelle clé, et rien d’autre.',
          'Journalisez chaque récupération et prévenez la personne concernée.',
        ],
      },
      {
        title: 'Déployer par étapes',
        paragraphs: [
          'Commencez par les comptes d’administration, les plus exposés et les plus faciles à accompagner. Étendez ensuite service par service, avec un support disponible les premiers jours. Mesurez le nombre de récupérations : c’est le meilleur indicateur des difficultés réelles.',
        ],
      },
    ],
    inProduct:
      'Dans LUXIA Identity, les comptes locaux se connectent uniquement par clé d’accès : aucun mot de passe n’existe. Les codes de récupération sont à usage unique, affichés une seule fois et conservés sous forme d’empreinte. Une connexion de récupération ouvre une session de 15 minutes, limitée à l’ajout d’une nouvelle clé, et elle est inscrite au journal.',
  },
];

export const guideHref = (slug: string): string => `/ressources/${slug}/`;

/** Durée de lecture estimée, à 220 mots par minute. */
export function readingMinutes(guide: Guide): number {
  const text = [guide.description, ...guide.sections.flatMap((s) => [s.title, ...s.paragraphs, ...(s.list ?? [])]), guide.inProduct].join(' ');
  return Math.max(1, Math.round(text.split(/\s+/).length / 220));
}
