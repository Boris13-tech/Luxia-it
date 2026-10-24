/**
 * LUXIA Identity présenté comme un produit : visite guidée, chiffres et cas
 * d'usage. Chaque phrase s'appuie sur le code et la documentation du dépôt
 * public Boris13-tech/iam-azure-pme (console app/dashboard, règles serveur,
 * docs/product/ENTERPRISE-READINESS.md), lus le 24 octobre 2026, et sur les
 * niveaux de preuve de src/data/platforms.ts. Ce qui n'est pas disponible
 * est dit comme tel (voir `limit`), jamais suggéré.
 */
import type { ScreenName } from '../components/ProductScreen.astro';

export interface TourItem {
  id: string;
  tab: string;
  title: string;
  text: string;
  points: readonly string[];
  /** Ce que la fonction ne fait pas encore, quand c'est utile de le dire. */
  limit?: string | undefined;
  screen: ScreenName;
  caption: string;
}

export const tour: readonly TourItem[] = [
  {
    id: 'visite-identites',
    tab: 'Identités',
    title: 'Chaque arrivée, chaque départ, au même endroit',
    text: 'Une personne est créée « en création », puis activée. Elle peut être suspendue le temps d’une absence ; suspendue ou partie, elle ne peut plus se connecter. Les charges de travail, les services, les appareils et les agents IA sont des identités comme les autres.',
    points: [
      'Cycle de vie explicite : en création, active, suspendue, en récupération, partie.',
      'Les identités inactives qui détiennent encore un accès sont signalées, pour que vous les retiriez.',
      'Aucune organisation ne peut perdre son dernier administrateur : la base de données l’interdit.',
    ],
    screen: 'identities',
    caption: 'La liste des identités : personnes, agent IA et charge de travail, avec leurs actions de cycle de vie.',
  },
  {
    id: 'visite-revues',
    tab: 'Revues d’accès',
    title: 'Des revues d’accès que l’on peut présenter à un auditeur',
    text: 'Une campagne couvre une ressource, un groupe de ressources ou l’environnement entier, avec un réviseur et une échéance. Pour chaque accès, le réviseur conserve ou retire, et justifie sa décision.',
    points: [
      'Un réviseur ne peut pas examiner ses propres accès.',
      'Retirer un accès le supprime sur toutes les ressources qu’il couvre.',
      'Chaque décision et la clôture de la campagne sont inscrites à l’historique.',
    ],
    screen: 'review',
    caption: 'Une décision de revue : l’accès, sa ressource, la justification, puis Conserver ou Retirer.',
  },
  {
    id: 'visite-separation',
    tab: 'Séparation des tâches',
    title: 'Deux droits incompatibles ne se retrouvent pas chez la même personne',
    text: 'Une politique déclare quels droits s’excluent, par exemple créer un fournisseur et valider ses paiements. Une attribution qui créerait le conflit est bloquée avant d’exister, et le blocage est journalisé.',
    points: [
      'Politiques créées désactivées, puis activées quand elles sont prêtes.',
      'Le contrôle s’applique au moment de l’attribution, pas après coup.',
      'Les attributions bloquées sont listées et comptées dans la vue d’ensemble.',
    ],
    limit: 'Pour l’instant, seules les nouvelles attributions sont contrôlées : les conflits déjà présents ne sont pas encore détectés.',
    screen: 'sod',
    caption: 'Une politique de séparation des tâches active, et une attribution bloquée.',
  },
  {
    id: 'visite-journal',
    tab: 'Journal d’audit',
    title: 'Un journal que personne ne peut réécrire',
    text: 'Connexions et actions d’administration sont réunies dans un même journal, de la plus récente à la plus ancienne : qui, quoi, pour qui, avec quel moyen de connexion, et avec quel résultat.',
    points: [
      'Ajout seul : l’application ne peut ni modifier ni supprimer une entrée.',
      'Les consultations du journal sont elles-mêmes journalisées.',
      'Les refus sont enregistrés au même titre que les réussites.',
    ],
    screen: 'audit',
    caption: 'Le journal d’audit : connexions, accès retirés après revue, attribution bloquée, session révoquée.',
  },
  {
    id: 'visite-connexion',
    tab: 'Connexion',
    title: 'Microsoft Entra ID ou une clé d’accès, sans mot de passe',
    text: 'Les personnes d’une organisation qui relie son locataire Microsoft Entra ID se connectent avec leur compte Microsoft. Les comptes locaux utilisent une clé d’accès (passkey), résistante à l’hameçonnage. Aucun mot de passe n’existe.',
    points: [
      'Codes de récupération à usage unique, affichés une seule fois.',
      'Une connexion de récupération ouvre une session de 15 minutes, limitée à l’ajout d’une nouvelle clé.',
      'Chaque connexion de fournisseur a sa coupure d’urgence : la mise en quarantaine révoque les sessions.',
    ],
    screen: 'login',
    caption: 'L’écran de connexion : identifiant de l’organisation, Microsoft Entra ID ou clé d’accès.',
  },
];

/** Faits mesurés ou vérifiés, avec leur source dans platforms.ts. */
export const keyFacts: readonly { value: string; label: string }[] = [
  { value: '81 s', label: 'pour reconstruire la base de production depuis une sauvegarde, vérifié le 13 octobre 2026' },
  { value: '30 jours', label: 'de protection des sauvegardes contre la suppression, chiffrées et hors du fournisseur' },
  { value: '24 h', label: 'au plus pour une session, révocable à tout moment par la personne ou un administrateur' },
  { value: '0', label: 'mot de passe : les comptes locaux se connectent par clé d’accès' },
];

export interface UseCase {
  id: string;
  title: string;
  /** La situation, vue du client. */
  situation: string;
  /** Ce que LUXIA Identity fait, concrètement. */
  answer: readonly string[];
  limit?: string | undefined;
  screen: ScreenName;
  caption: string;
}

export const useCases: readonly UseCase[] = [
  {
    id: 'arrivees-departs',
    title: 'Arrivées, mobilités et départs',
    situation:
      'Une personne arrive lundi, change de service en mars, part en septembre. Entre-temps, ses accès se sont accumulés et personne ne sait lesquels retirer.',
    answer: [
      'Chaque identité suit un cycle de vie explicite : en création, active, suspendue, partie.',
      'Une identité suspendue ou partie ne peut plus se connecter.',
      'La vue d’ensemble signale les identités inactives qui détiennent encore un accès.',
    ],
    screen: 'identities',
    caption: 'Les identités et leurs actions de cycle de vie.',
  },
  {
    id: 'revues-acces',
    title: 'Revues d’accès périodiques',
    situation:
      'Votre auditeur demande la preuve que les accès aux applications sensibles sont revus. Aujourd’hui, c’est un tableur envoyé par courriel et des réponses qui se perdent.',
    answer: [
      'Une campagne par ressource ou par périmètre, avec un réviseur et une échéance.',
      'Chaque accès est conservé ou retiré, avec une justification obligatoire.',
      'L’historique de la campagne et chaque décision sont conservés au journal.',
    ],
    screen: 'review',
    caption: 'Une décision de revue d’accès.',
  },
  {
    id: 'separation-taches',
    title: 'Séparation des tâches',
    situation:
      'La même personne peut créer un fournisseur et valider ses paiements. Vous ne le découvrez qu’au contrôle annuel, quand le risque a déjà existé pendant des mois.',
    answer: [
      'Vous déclarez les droits incompatibles, politique par politique.',
      'Une attribution qui créerait le conflit est refusée avant d’exister.',
      'Chaque blocage est journalisé et compté dans la vue d’ensemble.',
    ],
    limit: 'Les conflits déjà présents parmi les accès existants ne sont pas encore détectés : le contrôle porte sur les nouvelles attributions.',
    screen: 'sod',
    caption: 'Une politique de séparation des tâches et une attribution bloquée.',
  },
  {
    id: 'sans-mot-de-passe',
    title: 'Connexion sans mot de passe',
    situation:
      'Les mots de passe sont réutilisés, hameçonnés, réinitialisés. Vous voulez des connexions résistantes à l’hameçonnage sans perdre la maîtrise de la récupération.',
    answer: [
      'Clés d’accès (passkeys, WebAuthn) pour les comptes locaux, et Microsoft Entra ID pour les organisations qui le relient.',
      'Codes de récupération à usage unique, conservés sous forme d’empreinte.',
      'Une récupération n’ouvre qu’une session de 15 minutes, limitée à l’ajout d’une clé.',
    ],
    screen: 'login',
    caption: 'L’écran de connexion.',
  },
  {
    id: 'preuve-audit',
    title: 'Preuve pour l’audit et la conformité',
    situation:
      'Après un incident ou pendant un audit, il faut dire qui a fait quoi. Les journaux sont dispersés, et leurs auteurs peuvent parfois les modifier.',
    answer: [
      'Connexions et actions d’administration dans un seul journal, consultable par type.',
      'Ajout seul : l’application ne peut ni modifier ni supprimer une entrée.',
      'Une intervention d’urgence de l’opérateur suit une liste fermée d’actions et est signalée à vos administrateurs.',
    ],
    limit: 'L’export du journal pour un auditeur et un journal dont l’intégrité se démontre à un tiers sont prévus, pas encore disponibles.',
    screen: 'audit',
    caption: 'Le journal d’audit.',
  },
];
