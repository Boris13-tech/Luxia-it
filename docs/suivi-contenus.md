# Suivi des contenus et des validations

Document interne. Aucun marqueur « à fournir » n'apparaît sur le site : un
bloc dont l'information manque ne s'affiche pas, et le test post-build
(`npm test`) échoue si un marqueur atteint `dist/`. Les faits publiables se
renseignent dans [`src/data/facts.ts`](../src/data/facts.ts) ; les statuts des
plateformes dans [`src/data/platforms.ts`](../src/data/platforms.ts).

`npm run release:check` reprend la section 1 et refuse la mise en production
tant qu'un point bloquant reste ouvert.

## 1. Bloquants de publication

| # | Point | Où le renseigner | Effet tant qu'il manque |
|---|---|---|---|
| B1 | **Réception des e-mails du domaine.** `luxia-it.com` n'a aucun enregistrement MX : Contact@Luxia-it.com ne reçoit rien. Option à 0 € : routage des e-mails de Cloudflare (le DNS y est déjà) vers une boîte existante. Ajouter aussi SPF et DMARC. | DNS Cloudflare | `release:check` échoue |
| B2 | **Éditeur du site et protection des données** : voir la section 1 bis. Aucune information n'est déduite : uniquement les documents officiels d'immatriculation. | `facts.publisher`, `facts.privacy` | Blocs masqués, `release:check` échoue |
| B3 | **Prestataire d'envoi du formulaire.** Étapes dans la section 1 ter. Le code est prêt et testé ; il manque le compte et sa clé, que seul le propriétaire peut créer et saisir. | Vercel, `facts.contactForm` | Le formulaire se masque et affiche les coordonnées ; `release:check` échoue |
| B4 | **Offre d'hébergement.** Le projet Vercel est sur l'offre Hobby, réservée à un usage personnel et non commercial, sans accord de traitement des données. Passer sur Vercel Pro, ou déployer sur Cloudflare Pages (gratuit, usage commercial autorisé ; une fonction équivalente est fournie dans `functions/api/contact.ts`). | Décision de l'opérateur | À vérifier à la main (`release:check` le rappelle) |
| B5 | **Revues du propriétaire** : statuts des plateformes, offre de services, pages d'architecture, pages légales (revue juridique). Renseigner la date de chaque revue. | `facts.reviews` | `release:check` échoue |

## 1 bis. Informations juridiques à fournir

À tirer des documents officiels (extrait d'immatriculation, statuts, avis fiscal). Ne rien déduire du lieu de résidence ni des plans : aucune entité n'est enregistrée à notre connaissance au 24 octobre 2026.

| Information | Champ | Page |
|---|---|---|
| Pays d'immatriculation | `publisher.country` | Mentions légales |
| Dénomination sociale enregistrée | `publisher.legalName` | Mentions légales, Confidentialité, JSON-LD |
| Nom commercial, s'il diffère | `publisher.tradeName` | Mentions légales |
| Forme juridique | `publisher.legalForm` | Mentions légales |
| Registre compétent et numéro d'enregistrement | `publisher.register`, `publisher.registration` | Mentions légales |
| Numéro fiscal ou TVA, s'il existe | `publisher.taxId` | Mentions légales |
| Capital social, si la forme en comporte un | `publisher.shareCapital` | Mentions légales |
| Siège social | `publisher.address` | Mentions légales, Confidentialité |
| Représentant légal | `publisher.legalRepresentative` | Mentions légales |
| Directeur de la publication | `publisher.publicationDirector` | Mentions légales |
| Droit applicable et juridiction (après revue juridique) | `publisher.governingLaw` | Mentions légales |
| Autorité de contrôle des données compétente | `privacy.supervisoryAuthority` | Confidentialité |
| Délégué à la protection des données, s'il existe | `privacy.dpo` | Confidentialité |
| Sous-traitants réels et leurs régions (envoi du formulaire, boîte e-mail) | `contactForm.deliveryProcessor`, `contactForm.mailboxProcessor` | Confidentialité |
| Durée de conservation des messages reçus (proposée : trois ans après le dernier échange) | `contactForm.retention` | Confidentialité |

Divulgation responsable, à valider avant publication : adresse de sécurité dédiée, clé OpenPGP, environnements hors périmètre, délai cible d'accusé de réception et cadence de suivi, règle de crédit, présence ou absence de récompense, clause de recherche de bonne foi.

## 1 ter. Mettre le formulaire en service

1. Recevoir le courrier du domaine (B1) : routage des e-mails Cloudflare vers une boîte existante (`Contact@Luxia-it.com`), puis SPF et DMARC.
2. Créer un compte Resend et vérifier le domaine d'envoi `luxia-it.com` (enregistrements DNS fournis par Resend, à ajouter dans Cloudflare).
3. Dans Vercel, projet `luxia-it-cswq`, ajouter pour la production : `RESEND_API_KEY` (clé créée dans Resend, saisie par le propriétaire), `CONTACT_FROM` (par exemple `Site Luxia-IT <formulaire@luxia-it.com>`) et, si besoin, `CONTACT_TO`.
4. Renseigner `facts.contactForm.deliveryProcessor` et `mailboxProcessor` (nom, finalité, pays, URL), redéployer.
5. Vérifier : `npm run release:check -- --url https://luxia-it.com` (le formulaire doit répondre `{"ready":true}`), puis un envoi réel.

## 1 quater. Démonstrations guidées des plateformes

Elles exigent des captures ou vidéos réelles des logiciels (consoles, parcours de connexion, journaux). Aucune n'est fournie : aucune démonstration n'est publiée, et aucune interface n'est simulée. À déposer dans `public/media/`, puis à intégrer aux pages plateformes avec annotations et étapes.

## 2. Informations non fournies (blocs masqués)

| Information | Où elle apparaîtrait | Champ |
|---|---|---|
| Délai de réponse aux demandes | Contact | `facts.contact.responseTime` |
| Adresse dédiée à la sécurité | Divulgation responsable, `security.txt` (à défaut : Contact@Luxia-it.com) | `facts.contact.securityEmail` |
| Page LinkedIn | Pied de page | `facts.contact.linkedin` |
| Année de création, siège, effectif | Entreprise, « Repères » | `facts.company` |
| Fondateur et dirigeants (nom, fonction) | Entreprise | `facts.company.leaders` |
| Certifications réellement obtenues (aucune à ce jour) | Entreprise, plateformes | `facts.company.certifications` |
| Postes ouverts | Carrières | `src/pages/carrieres.astro` |
| Captures et vidéos réelles des plateformes | Pages plateformes, à intégrer depuis `public/media/` | `src/components/PlatformPage.astro` |
| Références clients (contexte, contrainte, architecture, réalisation, résultat vérifiable), avec accord écrit | Rubrique « Réalisations », non créée | — |
| Publications et notes techniques des Labs | Labs | `src/pages/labs.astro` |
| Lien vers une documentation publique des plateformes | Pages plateformes | `src/data/platforms.ts` |
| Clé OpenPGP pour les signalements | Divulgation responsable | `src/pages/securite.astro` |
| Fichier source vectoriel officiel du logo | Logo | `src/components/Logo.astro` |

## 3. Textes rédigés à valider (revues B5)

Tous les textes ont été réécrits à partir des preuves lues le 23 octobre 2026.
Ils engagent Luxia-IT et doivent être relus avant publication.

| Sujet | Pages | Points d'attention |
|---|---|---|
| Statuts des plateformes | Accueil, Plateformes, LUXIA Identity, LUXIA Key, ALMA | « En développement, bêta privée en préparation » pour LUXIA Identity ; « Prototype » pour LUXIA Key et ALMA. Les statuts évoluent vite : à revoir à chaque publication. |
| Capacités et niveaux de preuve | Pages plateformes | Tirés de `ENTERPRISE-READINESS.md` et `SECURITY-OVERVIEW.md` (dépôt `iam-azure-pme`). |
| Ce qui n'est pas en place | LUXIA Identity, Architectures | Absence de certification, d'audit externe et de test d'intrusion ; hébergement actuel aux États-Unis ; supervision applicative en cours. Choisir le niveau de détail publié. |
| Chronologie | Entreprise | Dates des jalons vérifiés en production. |
| Offre de services | Services | Livrables et répartition des responsabilités : propositions. Aucun engagement de délai ni d'astreinte n'est publié. |
| Architecture d'exécution cible | Plateforme d'exécution | L'architecture Kubernetes est présentée comme cible, non disponible. Confirmer l'intention avant publication, ou retirer la page. |
| Vision et méthode | Accueil, Entreprise | Reprises des décisions d'architecture (fournisseurs remplaçables) et de l'échelle de maturité des dépôts. |
| Pages légales | Mentions légales, Confidentialité, Divulgation responsable | Base légale, durée de conservation (proposée : 3 ans après le dernier échange) et destinataires : à faire relire par un juriste. |

## 4. Internationalisation

- L'infrastructure est prête : routage par langue (`/en/…`), `hreflang`,
  sitemap multilingue, sélecteur de langue affiché dès qu'une traduction existe.
- Aucune page anglaise n'est publiée : la règle est de ne publier qu'une
  traduction professionnelle. Le chinois n'est pas prévu.
- Pour publier l'anglais :
  1. faire traduire les pages ;
  2. les ajouter sous `src/pages/en/` ;
  3. déclarer leurs chemins dans `src/i18n/routes.ts` ;
  4. définir `PUBLIC_LOCALES=fr,en` ;
  5. retirer les redirections `/en` de `vercel.json`, `public/_redirects` et `deploy/nginx.conf`.

## 5. Revue périodique

Les statuts des plateformes reposent sur des dépôts qui changent chaque jour.
`facts.evidenceAsOf` donne la date de lecture des preuves ; `release:check`
avertit au-delà de 30 jours.
