/**
 * Modèles de déploiement de LUXIA Identity, décrits selon les mêmes aspects
 * pour être comparés. Seul le modèle opéré est en service ; les deux autres
 * sont des cibles d'architecture (ADR « Sovereign Identity Control Plane » :
 * un seul code pour le cloud, l'hybride et le souverain). Le modèle
 * Kubernetes n'est pas confirmé : il n'apparaît pas ici (voir la page
 * Plateforme d'exécution, où il est présenté comme architecture cible).
 */
import type { Level } from './evidence';
import type { Diagram } from './platforms';

export const aspects = [
  { key: 'responsibilities', label: 'Responsabilités' },
  { key: 'components', label: 'Composants' },
  { key: 'flows', label: 'Flux' },
  { key: 'backup', label: 'Sauvegarde' },
  { key: 'availability', label: 'Disponibilité' },
  { key: 'operations', label: 'Exploitation' },
] as const;

export type AspectKey = (typeof aspects)[number]['key'];

export interface DeploymentModel {
  id: string;
  name: string;
  level: Level;
  summary: string;
  aspects: Record<AspectKey, string>;
  diagram: Diagram;
}

export const deploymentModels: readonly DeploymentModel[] = [
  {
    id: 'modele-opere',
    name: 'Opéré par Luxia-IT',
    level: 'production',
    summary: 'Le modèle en service aujourd’hui. Luxia-IT exploite la plateforme ; les organisations administrent leurs personnes, leurs droits et leurs revues d’accès.',
    aspects: {
      responsibilities: 'Luxia-IT : infrastructure, mises à jour, sauvegardes. Client : personnes, droits, connexions de fournisseurs, revues d’accès.',
      components: 'Fonctions applicatives managées sans état, PostgreSQL managé avec isolation par ligne forcée, sauvegardes chiffrées hors du fournisseur de base de données.',
      flows: 'Navigateur vers application en TLS ; application vers Microsoft Entra ID en OIDC ; application vers base en TLS ; sauvegarde chiffrée vers l’Union européenne.',
      backup: 'Indépendante, chiffrée avec une clé détenue par Luxia-IT, protégée contre la suppression 30 jours. Restauration démontrée le 13 octobre 2026.',
      availability: 'Celle de la plateforme managée. Aucun engagement de niveau de service n’est publié.',
      operations: 'Changements revus, testés, répétés sur copie et vérifiés en production. Alerte de sauvegarde en place ; supervision applicative en conception.',
    },
    diagram: {
      inputs: { label: 'Navigateurs', items: ['Personnes', 'Administrateurs'] },
      core: { label: 'Plateforme managée', items: ['Fonctions applicatives', 'PostgreSQL managé', 'Isolation par ligne', 'Points de restauration'] },
      outputs: { label: 'Fournisseurs', items: ['Microsoft Entra ID'] },
      base: { label: 'Hors du fournisseur de base de données', items: ['Sauvegardes chiffrées (UE)', 'Alerte de sauvegarde'] },
      links: { in: 'TLS', out: 'OIDC', base: 'Sauvegarde chiffrée' },
    },
  },
  {
    id: 'modele-sur-site',
    name: 'Sur site',
    level: 'target',
    summary: 'Sur l’infrastructure du client. Principe d’architecture retenu : le même code et le même modèle de données. Aucun déploiement de ce type à ce jour.',
    aspects: {
      responsibilities: 'Client : infrastructure, application des versions, sauvegardes, administration. Luxia-IT : versions livrées avec leur procédure de retour arrière.',
      components: 'Le même code en conteneurs ; une base PostgreSQL dédiée, avec la même isolation par ligne.',
      flows: 'Réseau interne vers application ; application vers les annuaires et fournisseurs du client ; aucune dépendance obligatoire vers Luxia-IT.',
      backup: 'Intégrée aux sauvegardes du client ; restauration à démontrer à la mise en service.',
      availability: 'Définie par l’infrastructure du client et le dimensionnement retenu.',
      operations: 'Supervision et journaux intégrés aux outils du client ; mises à jour planifiées avec retour arrière.',
    },
    diagram: {
      inputs: { label: 'Réseau interne', items: ['Personnes', 'Administrateurs'] },
      core: { label: 'Infrastructure du client', items: ['Conteneurs applicatifs', 'PostgreSQL dédié', 'Isolation par ligne', 'Versions livrées'] },
      outputs: { label: 'Fournisseurs du client', items: ['Annuaire d’entreprise', 'Fournisseur OIDC'] },
      base: { label: 'Services existants du client', items: ['Sauvegarde', 'Supervision', 'Journaux'] },
      links: { in: 'TLS', out: 'Fédération', base: 'Intégration' },
      note: 'Architecture visée, sans déploiement à ce jour.',
    },
  },
  {
    id: 'modele-souverain',
    name: 'Souverain ou isolé',
    level: 'target',
    summary: 'Dans un périmètre fermé, sans dépendre d’un service extérieur. Le cœur est conçu pour fonctionner hors ligne. Aucun déploiement de ce type à ce jour.',
    aspects: {
      responsibilities: 'Client : exploitation complète dans son périmètre. Luxia-IT : versions vérifiables, livrées hors ligne.',
      components: 'Instance isolée, registre d’images privé, journal conservé localement.',
      flows: 'Aucun flux vers l’extérieur du périmètre ; mises à jour par artefacts signés, accompagnés de leur nomenclature logicielle (SBOM).',
      backup: 'Dans le périmètre ; restauration démontrée avant la mise en service.',
      availability: 'Selon l’architecture du site ; une répartition sur plusieurs zones est décrite dans l’architecture d’exécution cible.',
      operations: 'Par les équipes du client, avec des procédures écrites.',
    },
    diagram: {
      inputs: { label: 'Périmètre fermé', items: ['Opérateurs', 'Administrateurs'] },
      core: { label: 'Instance isolée', items: ['Authentification locale', 'Habilitations', 'Journal local', 'Vérification des versions'] },
      outputs: { label: 'Systèmes du périmètre', items: ['Applications critiques'] },
      base: { label: 'Livraison hors ligne', items: ['Artefacts signés', 'SBOM', 'Registre privé'] },
      links: { in: 'Connexion', out: 'Décisions tracées', base: 'Mise à jour vérifiée' },
      note: 'Architecture visée, sans déploiement à ce jour.',
    },
  },
];
