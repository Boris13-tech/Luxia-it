# Audit — expérience cinématique (25 octobre 2026)

Point de départ : `main` à `a0665f9`, déployé sur https://luxia-it.com.
Branche de travail : `feat/experience-cinematique`. Aucune mise en production sans accord explicite : sur ce projet, fusionner dans `main` revient à déployer.

## 1. Pile et architecture

| Élément | Constat |
|---|---|
| Cadre | Astro 7.3.8, sortie statique (`output` par défaut), TypeScript « strictest ». Aucun framework d'interface (ni React, ni Next.js) : la pile React Three Fiber / Motion for React proposée par le brief ne s'applique pas. |
| Routage | Fichiers de `src/pages`, barre oblique finale obligatoire (`trailingSlash: 'always'`, `build.format: 'directory'`). Table des routes partagée : `src/i18n/route-map.mjs`. Une route dynamique : `src/pages/ressources/[slug].astro`. |
| Pages | 24 pages construites : accueil, produit (LUXIA Identity), plateformes (vue d'ensemble, LUXIA Key, ALMA), solutions, centre de confiance, services, architectures (2), labs, entreprise, carrières, ressources (index + 3 guides), contact (+ 2 pages de résultat), mentions légales, confidentialité, divulgation responsable, 404. |
| Composants | 30 composants `.astro` : en-tête, pied de page, onglets accessibles, écrans de la console reconstitués (`ProductScreen`), visite guidée, schémas d'architecture HTML, pictogrammes SVG, illustration du parcours d'identité (SVG animé). |
| JavaScript client | 3 scripts, environ 3 Ko compressés au total : `header.ts` (menu mobile), `tabs.ts` (onglets et parcours en étapes), `contact.ts` (formulaire). |
| Animations | CSS d'abord : `src/styles/motion.css` (entrées, révélations liées au défilement par `animation-timeline: view()`, onglets), transitions de page natives (`@view-transition { navigation: auto }`), SMIL dans un SVG. Tout est neutralisé sous `prefers-reduced-motion: reduce`. |
| Polices | Fraunces (titres) et Roboto (texte), auto-hébergées, préchargées, `font-display: optional` pour Fraunces, police de repli aux métriques ajustées. |
| Marque | Logo vectoriel (`Logo.astro`, `public/brand/`), bleu Luxia `#1f5fbf`. Pas de fichier source vectoriel officiel fourni (suivi dans `docs/suivi-contenus.md`). |

## 2. Fonctions et intégrations réelles

| Fonction | État vérifié |
|---|---|
| Formulaire de contact | `api/contact.ts` (fonction Vercel, région fra1) et `functions/api/contact.ts` (Cloudflare Pages) : validation serveur, champs inconnus refusés, détection de secrets, limite de taille, contrôle d'origine, pot de miel, limiteur de débit, envoi par Resend. **Non branché** : aucun compte Resend ni clé ; le formulaire se masque et affiche les coordonnées tant que `facts.contactForm` n'est pas renseigné. |
| Authentification | **Aucune** sur ce site. La connexion de LUXIA Identity vit dans son propre dépôt (`iam-azure-pme`) ; le site n'y renvoie pas. |
| Services tiers | Aucun appel depuis le navigateur : pas d'analytique, pas de police distante, pas de vidéo externe, aucun cookie. |
| Langues | Français publié. Anglais : architecture prête (`/en/…` dans la table des routes), aucune page anglaise publiée (`PUBLIC_LOCALES`). **Chinois : rien n'existe.** |

## 3. Sécurité

- CSP stricte identique dans `vercel.json`, `public/_headers` et `deploy/security-headers.conf` : `default-src 'none'`, `script-src 'self'`, `style-src 'self'`, aucun code en ligne, `require-trusted-types-for 'script'` et `trusted-types 'none'`.
- HSTS (2 ans), COOP `same-origin`, COEP `require-corp`, CORP `same-origin`, `X-Frame-Options: DENY`, `Permissions-Policy` restrictive, `Referrer-Policy: strict-origin-when-cross-origin`.
- Conséquences pour l'expérience demandée : WebGL est compatible (aucun `eval`, aucune ressource tierce) tant que les shaders sont dans des modules du site. Les bibliothèques qui injectent des styles en ligne ou créent du HTML par `innerHTML` sont exclues sans affaiblir la CSP, ce qui est hors de question.
- Dépendances d'exécution : 4 paquets, `npm audit` sans vulnérabilité au 24 octobre 2026.

## 4. Qualité mesurée (avant ce chantier)

| Mesure | Résultat |
|---|---|
| Lighthouse 13.5 (mobile simulé, Brotli) — accueil, LUXIA Identity, Solutions | 100 / 100 / 100 / 100 ; LCP 1,5 s ; TBT 0 à 10 ms ; CLS 0 |
| axe-core 4.14 (WCAG 2.2 AA + bonnes pratiques) | 0 violation sur 24 pages × 2 largeurs |
| Débordement horizontal | 0 sur 24 pages × 7 largeurs (320 à 1440 px) |
| Tests | 43 tests Node : contenu construit, typographie française, formulaire (unitaires), bout en bout dans Chrome (confidentialité, clavier, mouvement réduit, sans JavaScript, formulaire disponible et indisponible) |

## 5. Intégration et déploiement

- Aucun flux GitHub Actions : Vercel construit chaque branche (prévisualisations protégées par authentification) et déploie `main` en production.
- Vérifications locales : `npm run verify` (lint de contenu, `astro check`, build, contrôle des pages construites, tests).
- Offre Vercel Hobby : non autorisée pour un usage commercial (bloquant B4 de `docs/suivi-contenus.md`). Ce chantier n'ajoute aucune ressource payante.

## 6. Écart entre le brief et ce qui existe

| Demande du brief | Réalité vérifiée | Décision |
|---|---|---|
| LUXIA Trust Graph, Policy, Trust Ledger, AI Security, Sovereign Runtime & Edge, Adapters | **Aucun produit de ce nom** dans les dépôts ni la documentation. Des capacités correspondantes existent dans LUXIA Identity : droits et séparation des tâches (politique), journal en ajout seul (registre), adaptateurs de fournisseurs (Entra ID en production, OIDC générique conçu), identités d'agents IA ; l'exécution souveraine est une architecture **cible**. | Présentées comme **domaines** de l'écosystème, chacun relié à la capacité réelle et à son niveau de preuve. Aucun nom de produit nouveau publié. |
| Trust Ledger : immuabilité, garanties cryptographiques | Ajout seul appliqué par la base ; « journal vérifiable » seulement prévu. | Ni « immuable », ni « blockchain », ni « cryptographique ». |
| ALMA | Prototype de recherche : agents à outils typés, accord obligatoire avant une action irréversible. | Présentée comme recherche, sans offre. |
| Consulting, Academy, Industries, Insights | Services (conseil) et Ressources (guides) existent. Aucune Academy, aucun contenu sectoriel. | Pas de page Academy ni Industries : leur contenu serait inventé. « Insights » correspond aux Ressources. Décision consignée. |
| Chinois | Aucune traduction. | Non publié ; une traduction professionnelle est un prérequis (règle déjà en vigueur). |
| Palette obsidienne, bleu nuit, violet | Le 24 octobre, la direction validée était chaude, « qui ne reflète pas IA ». | Le brief le plus récent l'emporte. Le violet reste confiné à l'univers IA (ALMA), jamais en lueur générale. |
| WebGL, 3D | Interdit par le brief précédent. | Autorisé par celui-ci, avec trois niveaux de rendu et un repli complet sans WebGL. |

## 7. Risques

1. **Performance** : une scène WebGL et des polices supplémentaires peuvent dégrader le LCP et l'INP. Parade : WebGL natif sans bibliothèque, chargé après le premier rendu, jamais élément LCP ; mesures avant/après.
2. **Accessibilité** : menu plein écran (piège de focus, Échap, retour du focus), transitions (mouvement réduit), contrastes sur fond sombre.
3. **Vérité** : un « univers produit » visuel peut suggérer des produits inexistants. Parade : chaque nœud porte son niveau de preuve.
4. **Navigation** : les transitions ne doivent jamais retarder la page suivante. Parade : transitions de document natives, sans interception du clic.

## 8. Plan priorisé

1. Direction créative et système de conception (`docs/CREATIVE_DIRECTION.md`, `docs/DESIGN_SYSTEM.md`).
2. Jetons sombres et refonte globale (plus fort impact visuel, risque faible : variables CSS).
3. Navigateur d'univers : menu plein écran accessible, constellation des domaines avec niveaux de preuve.
4. Transitions de page : balayage de lumière et profondeur, natives, préchargement par règles de spéculation.
5. Scène WebGL de l'accueil, à trois niveaux, avec repli.
6. Univers par produit, passe page par page, mobile.
7. Tests (navigateur d'univers, transitions, repli WebGL), mesures, documentation (`docs/EXPERIENCE_PROTOTYPES.md`), demande de revue avant déploiement.
