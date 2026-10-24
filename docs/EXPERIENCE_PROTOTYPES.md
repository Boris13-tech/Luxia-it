# Expériences signatures — réalisation et mesures (25 octobre 2026)

Branche `feat/experience-cinematique`. Rien n'est déployé : la fusion dans `main` vaut mise en production et attend l'accord du propriétaire.

## 1. Ce qui est en place

| Expérience | Fichiers | Ce qu'elle fait |
|---|---|---|
| Thème obsidienne | `src/styles/global.css` | Jetons sombres, Inter Tight pour les titres, JetBrains Mono pour les libellés, boutons lumineux, un halo par écran. Violet réservé à ALMA. |
| En-tête flottant | `Header.astro` | Barre en pastille translucide ; voile qui apparaît au défilement (CSS `animation-timeline: scroll()`). |
| Navigateur d'univers | `UniverseNavigator.astro`, `scripts/universe.ts`, `data/universe.ts` | Menu plein écran (`<dialog>` modal). Destinations en grande typographie ; constellation des 8 domaines, chacun avec son niveau de preuve ; aperçu au survol et au focus. Ouverture sans JavaScript dans les navigateurs qui gèrent `commandfor`. |
| Transitions de page | `styles/transitions.css`, `public/scripts/transitions.js` | Transitions de document natives : profondeur (page plus précise), retour (historique ou page moins profonde), latéral (par défaut). Faisceau de lumière dans le sens du déplacement, en-tête immobile, écran du produit partagé entre l'accueil et LUXIA Identity. Chaque page suivante est préchargée au survol (règles de spéculation, même origine). |
| Constellation d'identité | `ConstellationScene.astro`, `scripts/constellation.ts`, `scripts/constellation-model.ts` | WebGL 2 natif, sans bibliothèque : identités reliées au registre, impulsions (demandes de connexion) vers le registre, parallaxe au pointeur, recul au défilement. Image fixe calculée au build à partir du même modèle. |
| Univers des produits | `BaseLayout.astro` (`data-universe`), `PageHead.astro` (`scene`) | LUXIA Key en bleu ciel, ALMA en violet, chacun avec sa constellation. |
| Titre de l'accueil | `index.astro`, `motion.css` | Chaque mot se précise à son tour (flou vers net), sans changer d'opacité. |

## 2. Choix techniques et compromis

- **Pas de Three.js ni de React Three Fiber** : le site est en Astro, sans React. Une scène de points et de lignes tient en 2,9 Ko compressés en WebGL natif, contre plus de 150 Ko avec une bibliothèque. Les shaders vivent dans le module : aucun code en ligne, CSP inchangée.
- **Pas de GSAP ni de Lenis** : CSS (`animation-timeline`, `@starting-style`, View Transitions) couvre les besoins. Un défilement simulé fausserait le défilement natif, la restauration de position et l'accessibilité.
- **Transitions natives plutôt qu'un routeur côté client** : retour, avance, liens directs, rafraîchissement, échec de navigation et réseau lent sont gérés par le navigateur ; la navigation n'attend jamais une animation. Les navigateurs sans View Transitions entre documents (Firefox à ce jour) changent de page normalement.
- **Un script bloquant de 1 Ko** (`transitions.js`) : le sens de la transition doit être posé avant le premier rendu de la page suivante (`pagereveal`). Il ne fait rien d'autre.
- **Démarrage de la scène différé** : après le chargement, la fin des animations d'ouverture (1,4 s) et un moment de repos. Les programmes se compilent en parallèle (`KHR_parallel_shader_compile`) et le modèle se construit par grille spatiale (8 à 16 ms au lieu de dépasser 50 ms).

## 3. Niveaux de rendu

| Niveau | Quand | Mesuré (Chrome sans interface, GPU Intel Iris Xe, 1350 px) |
|---|---|---|
| Haut | WebGL 2 accéléré, pointeur fin, 8 Go et 8 cœurs, au moins 1 024 px | Scène prête ; au plus une tâche de 130 ms après le démarrage |
| Équilibré | WebGL 2 accéléré, au moins 768 px | 600 nœuds, 30 images/s |
| Essentiel | Téléphone, mouvement réduit, économie de données, rendu logiciel, appareil modeste, échec | Image fixe, aucun WebGL |

Les téléphones reçoivent l'image fixe : la première version animait la scène partout, et Lighthouse mobile mesurait alors 1,8 s de blocage du fil principal sur l'accueil. Le niveau essentiel reste animé par le titre, les révélations au défilement et les transitions.

## 4. Mesures

| Mesure | Avant (main, `a0665f9`) | Après |
|---|---|---|
| Lighthouse mobile, accueil | 100 / 100 / 100 / 100, LCP 1,5 s, TBT 0 ms | 98 / 100 / 100 / 100, LCP 2,1 s, TBT 0 ms, CLS 0 |
| Lighthouse mobile, LUXIA Identity | 100 / 100 / 100 / 100 | 99 / 100 / 100 / 100, LCP 1,8 s, TBT 0 ms |
| Lighthouse bureau, accueil (scène au niveau haut) | non mesuré | 87 puis 100 sur deux passages ; LCP 0,5 s ; TBT 310 puis 0 ms |
| Lighthouse bureau, ALMA | non mesuré | 100 / 100 / 100 / 100 |
| JavaScript (compressé, total du site) | 3 Ko | 7 Ko, dont 2,9 Ko pour la scène, chargée à la demande |
| axe-core 4.14 | 0 violation | 0 violation sur 24 pages × 2 largeurs, et menu ouvert à 390 et 1440 px |
| Débordement horizontal | 0 | 0 sur 24 pages × 7 largeurs |
| Tests | 43 | 46 (navigateur d'univers au clavier, niveaux de la scène, sens des transitions) |

Les mesures Lighthouse sont locales (aperçu sécurisé, Brotli). Elles ne valent pas mesure de terrain : les seuils Core Web Vitals (LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 au 75ᵉ centile) se vérifient sur les données réelles après mise en production.

## 5. Limites connues

- Firefox n'a pas encore les View Transitions entre documents : changement de page sans transition.
- Le LCP mobile passe de 1,5 à 2,1 s (titre plus grand, police de titre supplémentaire), sous la cible de 2,5 s du brief.
- Les captures d'écran pendant une transition ne sont pas possibles avec nos outils ; le sens des transitions est vérifié par test automatisé.
- Le positionnement « LUXIA — Engineering Trust in an Intelligent World » n'est pas publié : il attend une validation.
- Pages Academy et Industries, traduction chinoise : non créées (voir `docs/AUDIT.md`, section 6).
