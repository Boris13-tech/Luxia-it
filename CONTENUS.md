# Contenus à fournir ou à confirmer

Le site affiche chaque contenu manquant sous la forme `[À FOURNIR : …]` ou
`[À CONFIRMER : …]`, en police monospace soulignée en pointillés. Aucune page
ne doit être publiée tant qu'il en reste. Pour les retrouver :

```bash
grep -rn "À FOURNIR\|À CONFIRMER\|HYPOTHÈSE" src
```

## 1. Captures et vidéos de LUXIA Identity (priorité)

Le visuel principal du site, c'est le vrai logiciel. Formats recommandés :
captures en WebP (2400 px de large), vidéos muettes en MP4 H.264 de 10 à 20 s,
en boucle, accompagnées d'une image `poster`. À déposer dans `public/media/`.

| Emplacement | Page | Format |
|---|---|---|
| Console d'administration (grand format) | LUXIA Identity, « La plateforme en images » | Vidéo 16:9, 10 à 15 s |
| Flux de connexion | LUXIA Identity | Vidéo 16:10 |
| Gestion des fournisseurs d'identité | LUXIA Identity | Capture 16:10 |
| Journaux d'audit | LUXIA Identity | Capture 16:10 |
| Quatre captures par plateforme | LUXIA Key, ALMA | 16:9 puis 16:10 |
| Photographies de la direction | Entreprise | 4:3 |

Pour brancher un fichier sur une page plateforme, ajoutez `src` (et `poster`
pour une vidéo, `alt` pour la description) à l'élément correspondant de
`screens`, dans `src/pages/plateformes/<plateforme>.astro`. Ailleurs, ajoutez
`src` au composant `Media` :

```astro
<Media src="/media/identity-console.webp" alt="Console d'administration de LUXIA Identity" ... />
<Media kind="video" src="/media/identity-login.mp4" poster="/media/identity-login.webp" alt="Flux de connexion" ... />
```

## 1 bis. Photos, logos et liens (nouvelle mise en page)

- **Photos de bandeau** (optionnelles) : une photo pour l'accueil, une par page si
  souhaité. Sans photo, une illustration (ardoise, bande orange, réseau) s'affiche.
  Utiliser des photos dont Luxia-IT détient les droits.
- **Logos clients** (« Ils nous font confiance ») : uniquement avec l'accord écrit
  de chaque organisation.
- **Certifications et adhésions** (pied de page) : badges officiels.
- **Réseaux sociaux** : lien LinkedIn, et éventuellement d'autres.
- **Coordonnées** : téléphone, adresse e-mail, adresse postale (pied de page et
  page Contact).

## 2. Plateformes

- **LUXIA Key** : la description « gestion des clés et des secrets » est une
  **hypothèse** tirée du nom. Elle doit être confirmée, tout comme le schéma
  d'architecture, les capacités et le statut (`src/pages/plateformes/luxia-key.astro`).
- **ALMA** : tout est à fournir (description en une ligne, problème résolu,
  schéma, capacités, statut).
- **LUXIA Identity** : à confirmer, la liste « Également » (MFA, OIDC, SAML 2.0,
  LDAP / Active Directory, API d'administration, administration déléguée), le
  chiffrement (algorithmes, gestion des clés), les référentiels (RGPD, ISO/IEC 27001),
  la version actuelle, le lien vers la documentation et les modalités de support.
- **Déploiement** : à confirmer, l'hébergeur et le pays du mode cloud, le mode de
  livraison hors ligne du mode souverain, et la disponibilité des trois modèles
  pour chaque plateforme.

Les statuts et les descriptions courtes se règlent en un seul endroit :
`src/data/site.ts`.

## 3. Entreprise

- Formulation de la mission (proposition rédigée, à valider).
- Repères : année de création, siège, forme juridique, effectif.
- Direction : noms, fonctions et **photographies réelles** (aucune image de banque d'images).
- Logo : l'emblème fourni est intégré (redessiné en vecteur). Pour une fidélité
  parfaite, fournir le fichier source (SVG ou PDF vectoriel) et, si elle existe,
  la version officielle avec le nom.
- Signature sous le logo (« Identité & confiance ») : proposition, à confirmer.
- Vision : la formulation de la section « Notre vision » et la lecture de l'emblème
  (deux traits : identité et confiance) sont des propositions, à confirmer.

## 4. Services, Labs, Carrières

- Services : confirmer le périmètre réel des quatre services et leurs livrables.
- Labs : confirmer les quatre axes de recherche et fournir les premières publications.
- Carrières : postes ouverts, adresse e-mail de recrutement, étapes réelles du processus.

## 5. Contact et légal

- Adresses e-mail : commercial, sécurité, presse, recrutement. Adresse postale.
- Formulaire : un service de traitement (voir README, « Formulaire de contact »).
- Mentions légales : forme juridique, capital, siège, RCS/SIREN, TVA, directeur
  de la publication, hébergeur.
- Confidentialité : contact données personnelles ou DPO, base légale, durée de
  conservation, sous-traitants, transferts hors UE.
- Divulgation responsable : adresse sécurité, clé OpenPGP, délai d'accusé de
  réception, et engagement de non-poursuite (à faire relire par un juriste).

## 6. Textes rédigés à valider

Les textes ont été écrits à partir du brief, sans affirmation d'échelle, de
clients ou de déploiements. Ils restent à relire par Luxia-IT, en particulier :
la phrase du hero (« Le contrôle des identités ne se délègue pas. »), les quatre
principes de la page Entreprise et les attentes de la page Carrières.
