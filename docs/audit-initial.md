# Audit initial et plan d'exécution — refonte éditoriale de luxia-it.com

| Élément | Valeur |
|---|---|
| Date | 23 octobre 2026 |
| Branche | `feat/refonte-editoriale-preuves`, créée depuis `main` (`11155e9`) |
| Périmètre | Dépôt `Boris13-tech/Luxia-it` et site de production https://luxia-it.com/ |
| Règle | Aucune affirmation publique sans preuve. Une information manquante est consignée dans [`suivi-contenus.md`](suivi-contenus.md) et son bloc est masqué. |

Ce dépôt est public. Les preuves privées de l'opérateur ont été lues pour établir les statuts, mais leur détail n'est pas reproduit ici.

## 1. Sources inspectées

| Source | Ce qu'elle établit |
|---|---|
| Ce dépôt : `main`, branches distantes, historique | Une seule branche de travail. `feat/visual-redesign-swiss-engineering` est déjà intégrée à l'historique de `main` : il n'y a aucun travail non fusionné à préserver. |
| Ancien site (historique, commit `b7d0941`) | ALMA y était présenté comme « un projet de plateforme intelligente en développement au sein de Luxia Labs », sans périmètre ni disponibilité annoncés. LUXIA Identity et LUXIA Key n'y figuraient pas. |
| Dépôt public `Boris13-tech/iam-azure-pme` (LUXIA Identity) | Code, décisions d'architecture et documents d'exploitation. Les états de maturité y sont tracés capacité par capacité (`docs/product/ENTERPRISE-READINESS.md`, `docs/legal/SECURITY-OVERVIEW.md`, `docs/legal/DATA-RESIDENCY.md`). |
| Dépôt public `Boris13-tech/Luxia-key` et décision d'intégration (`iam-azure-pme/docs/architecture/LUXIA-KEY-INTEGRATION-DECISION.md`) | LUXIA Key est un authentificateur. Son serveur WebAuthn est vérifié en intégration continue mais n'est pas déployé, et son interface est un prototype. |
| Dépôt public `Boris13-tech/alma` | Assistant à base d'agents, avec un backend opérationnel et des intégrations réelles. Ces intégrations ne sont pas encore validées avec de vrais comptes. |
| Dossier de preuves privé de l'opérateur | Il confirme les statuts ci-dessus et l'absence de lancement commercial. Son contenu n'est pas reproduit. |
| DNS de `luxia-it.com` | Il n'existe aucun enregistrement MX ni SPF. |
| Projet Vercel `luxia-it-cswq` | Offre Hobby. La protection des déploiements de prévisualisation est active. La région des fonctions est `iad1`. |

## 2. Architecture actuelle

- **Stack.** Astro 7.3.8 en sortie statique, en TypeScript « strictest », avec la police Roboto auto-hébergée et les icônes Lucide. Quatre dépendances d'exécution. Très peu de JavaScript : en-tête, apparition au défilement, rotation de phrases, formulaire et média.
- **Sécurité.** CSP stricte sans aucun code en ligne (`inlineStylesheets: 'never'`, `assetsInlineLimit: 0`), Trusted Types, HSTS, COOP, COEP et CORP. Les en-têtes sont dupliqués à l'identique dans `vercel.json`, `public/_headers` et `deploy/security-headers.conf`.
- **Hébergement.** Vercel, avec `www` redirigé vers l'apex. Le DNS est chez Cloudflare. Des redirections permanentes reprennent les URL de l'ancien site. Une variante Docker/nginx est documentée.
- **Contenus.** Les textes vivent dans les pages `.astro`, plus `src/data/site.ts`. Les marqueurs « à fournir » passent par le composant `Tbd`.

## 3. Composants

| À conserver ou adapter | À retirer |
|---|---|
| `Logo` (emblème vectoriel), `Icon` (wrapper Lucide), `ArchDiagram` (schéma HTML lisible et responsive, à rendre monochrome), `Button`, `BaseLayout`, `LegalLayout`, `header.ts`, `tools/preview-secure.mjs` | `HeroArt` (réseau de nœuds décoratif, grandes bandes bleues), `Vision` (marqueur « à confirmer »), `LogoStrip` (emplacements de logos clients), `Tbd`, `Status` (statut « En production » non prouvé), `CaseCard`, `rotator.ts`, `reveal.ts` (animations systématiques) |

## 4. Constats

### 4.1 Vérité des contenus (critique)

| Constat | Pourquoi c'est un problème |
|---|---|
| LUXIA Identity est affichée « En production » | La plateforme n'est pas ouverte commercialement : l'environnement actuel sert au développement et à quelques organisations connues. |
| LUXIA Key est décrite comme « gestion des clés et des secrets » | Les preuves décrivent un authentificateur (passkeys, approbation des connexions). Il n'est pas déployé. |
| Le site laisse entendre que les modèles de déploiement « on-premise » et « souverain » sont disponibles | Ce sont des principes d'architecture acceptés. Aucun déploiement de ce type n'existe. |
| Capacités non prouvées : SAML, authentification multifacteur exigée par application, « console » complète | SAML n'est pas implémenté. Le multifacteur d'une connexion Microsoft n'est pas prouvé par la plateforme. |
| Tournures « nos équipes », « une même équipe », « une équipe identifiée » | Elles suggèrent un effectif qui n'est pas établi. |
| 209 marqueurs `[À FOURNIR]`, `[À CONFIRMER]`, `[HYPOTHÈSE]` sur 14 pages, et des emplacements de logos clients et de photos de dirigeants | Ces marqueurs ne doivent jamais apparaître en production. |

### 4.2 Bloquants de publication (hors code)

1. **Réception des e-mails.** `luxia-it.com` n'a pas d'enregistrement MX. Contact@Luxia-it.com ne peut donc pas recevoir de courrier. L'adresse est validée, mais elle doit fonctionner avant d'être publiée.
2. **Éditeur du site.** Raison sociale, forme juridique, immatriculation, siège et directeur de la publication : non fournis.
3. **Conditions d'hébergement.** L'offre Vercel Hobby est réservée à un usage personnel et non commercial, et ne comprend pas d'accord de traitement des données. Le site d'une entreprise doit passer sur une offre adaptée. Option à 0 € : Cloudflare Pages, déjà prévu dans `public/_headers` et `public/_redirects`.
4. **Formulaire.** Aucun service d'envoi n'est configuré. L'ancienne variable `CONTACT_ENDPOINT` vient du site précédent.
5. **Revue du propriétaire.** Elle doit couvrir les statuts des plateformes, les services et les pages légales, qui sont rédigés mais non validés.

### 4.3 Technique, SEO, accessibilité

- **SEO.** Ni `hreflang`, ni données structurées, ni image Open Graph. `twitter:card` vaut `summary`. `/fr/` et `/en/` redirigent vers l'accueil français.
- **Accessibilité.**
  - Le nom accessible du logo (« Luxia-IT — accueil ») ne reprend pas le texte visible « LUXIA-IT Identité & confiance » (critère 2.5.3).
  - Les contrastes du pied de page sont insuffisants.
  - Les menus déroulants apparaissent au survol et ne peuvent pas être fermés au clavier (critère 1.4.13).
- **Qualité.** Il n'existe ni test automatisé, ni contrôle des liens, ni garde-fou contre les marqueurs en production.
- **Formulaire.** Le traitement repose entièrement sur un service tiers non choisi. Il n'y a pas de validation serveur.

## 5. État réel des plateformes (au 23 octobre 2026)

| Plateforme | Étape | Ce qui est prouvé |
|---|---|---|
| LUXIA Identity | En développement, bêta privée en préparation | Dix groupes de capacités sont vérifiés en production : isolation des organisations (sécurité au niveau des lignes forcée), comptes et cycle de vie, passkeys et codes de récupération, Microsoft Entra ID, cycle de vie des connexions avec coupure d'urgence, inscription des organisations, garde du dernier administrateur et accès d'urgence journalisé, ressources et habilitations avec séparation des tâches et revues d'accès, journal en ajout seul, sauvegarde chiffrée indépendante et restauration vérifiée. L'hébergement actuel est aux États-Unis, avec une cible dans l'Union européenne (Francfort) avant la bêta commerciale. |
| LUXIA Key | Prototype | Le serveur WebAuthn est vérifié en intégration continue. L'interface est une maquette. Actions signées, appairage et notifications : conçus, non implémentés. |
| ALMA | Recherche (Labs) | Le prototype d'assistant à base d'agents fonctionne : outils typés avec niveau de risque, accord obligatoire avant toute action irréversible, journal. Il ne fait l'objet d'aucune offre. |

## 6. Plan d'exécution

| Étape | Contenu | Décision |
|---|---|---|
| 1 | Registre des faits (`src/data/facts.ts`), suivi interne, suppression de `Tbd` | Un bloc dont le fait est absent ne s'affiche pas. Un test post-build échoue si un marqueur atteint `dist/`. |
| 2 | Système visuel éditorial | Fond blanc cassé, encre presque noire, bleu Luxia réservé aux liens, au focus et aux statuts. Filets au lieu de cartes ombrées, grille stricte, aucune animation au défilement. |
| 3 | Échelle de preuve | Chaque capacité porte un niveau : vérifié en production, vérifié en intégration, implémenté, conçu, cible. Chaque plateforme porte une étape : recherche, prototype, en développement, pilote, disponible. Les deux échelles sont expliquées sur le site. |
| 4 | Accueil, plateformes, services | Contenus réécrits à partir des preuves. Les compétences (cloud Azure et Entra, DevSecOps, IA) sont reliées à l'identité, qui reste le point d'entrée. |
| 5 | Architectures et plateforme d'exécution | L'architecture réelle (plateforme managée) est distinguée de l'architecture de référence Kubernetes, présentée comme cible. Sont aussi documentés : les cas où une plateforme managée suffit, la haute disponibilité, la sauvegarde, l'observabilité, la reprise et la responsabilité partagée. |
| 6 | Entreprise, Labs, Carrières | Chronologie vérifiée, méthode de preuve, Labs limités aux axes réellement poursuivis. Rien sur l'effectif ni les dirigeants tant qu'ils ne sont pas fournis. |
| 7 | Formulaire | Fonction serveur sans dépendance : validation, champ piège, contrôle d'origine, limitation de débit, aucune conservation, journaux sans données personnelles, repli accessible, fonctionnement sans JavaScript. |
| 8 | Légal | Pages cohérentes avec le formulaire réel. Elles restent bloquées pour publication tant que l'éditeur et la revue ne sont pas renseignés. |
| 9 | SEO et i18n | Open Graph avec image, Twitter Card, Organization et BreadcrumbList en JSON-LD, `hreflang`, sitemap multilingue, sélecteur de langue. Aucune page anglaise publiée sans traduction professionnelle. |
| 10 | Vérification | Types, contrôles de contenu, tests du formulaire, build, audit des dépendances, liens, Lighthouse, axe, en-têtes, captures de 360 à 1440 px. |
| 11 | Garde de publication | `npm run release:check` refuse la mise en production tant qu'un bloquant de la section 4.2 subsiste. |

Ce qui ne change pas :
- Astro statique et la CSP stricte ;
- les URL existantes et les redirections ;
- aucune dépendance nouvelle ;
- aucun traceur.
