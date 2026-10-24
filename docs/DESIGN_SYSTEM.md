# Système de conception LUXIA

Source unique : les variables de `src/styles/global.css` (`:root`). Les composants n'utilisent pas de couleur codée en dur, sauf les écrans de la console reconstitués (`ProductScreen.astro`), qui reproduisent l'interface réelle, claire.

## 1. Couleurs

| Jeton | Valeur | Usage |
|---|---|---|
| `--paper` | `#07090d` | Fond, obsidienne |
| `--paper-2` | `#0b1019` | Sections alternées |
| `--surface` | `#111827` | Cartes, champs, menus |
| `--surface-2` | `#172033` | Surfaces au survol |
| `--dark` | `#0a1122` | Bandeaux bleu nuit |
| `--ink` | `#eef2f8` | Titres, texte fort |
| `--ink-2` | `#b9c3d4` | Texte courant |
| `--ink-3` | `#8d99ae` | Texte secondaire |
| `--line` | `#1d2638` | Filets |
| `--line-strong` | `#5d6b86` | Contours de champs, soulignés |
| `--blue` | `#2f6fe0` | Boutons principaux (texte blanc, 4,7:1) |
| `--electric` | `#5b9bff` | Lumière active, faisceaux, nœuds |
| `--link` | `#8cb8ff` | Liens dans le texte |
| `--violet` | `#a78bfa` | IA uniquement (ALMA, agents) |
| `--ochre` | `#e8b04f` | Signal : « en préparation », « à traiter » |
| `--sage` | `#5fbf8f` | Vérifié, réussi |
| `--terra` | `#ff8a73` | Refus, erreur (texte) |

Contrastes vérifiés (WCAG 2.2 AA) : `--ink-3` sur `--paper` 6,9:1 et sur `--surface` 6,2:1 ; `--ink-2` sur `--surface` 10,0:1 ; `--link` sur `--paper` 9,9:1 ; texte blanc sur `--blue` 4,7:1 ; `--line-strong` (contour des champs) 3,3:1 au moins.

## 2. Typographie

| Rôle | Police | Remarque |
|---|---|---|
| Titres | Inter Tight (variable, auto-hébergée, préchargée) | Graisse 560 à 620, interlettrage serré (-0,03 em à -0,015 em) |
| Texte | Roboto (variable, auto-hébergée, préchargée) | 17 px, interligne 1,6 |
| Libellés techniques | JetBrains Mono (variable, auto-hébergée, `font-display: optional`) | États, libellés de section, données |

Échelle : `--fs-display` 40 à 84 px, `--fs-h1` 36 à 64 px, `--fs-h2` 30 à 48 px, `--fs-h3` 21 à 26 px, `--fs-h4` 19 px, `--fs-lead` 18 à 22 px, `--fs-body` 17 px, `--fs-small` 15 px, `--fs-meta` 14 px.

## 3. Espacement, grille, rayons

- Largeur utile 1200 px ; gouttière `clamp(16px, 4vw, 40px)` ; écart de grille `clamp(20px, 2.6vw, 40px)`.
- Sections : `clamp(64px, 9vw, 128px)` de marge verticale.
- Rayons : 14 px (cartes), 10 px (petits éléments), 999 px (boutons, pastilles).
- Grille en 12 colonnes logiques, appliquée par des ratios 5/7 et 4/8.

## 4. Élévation et lumière

- Les cartes ne portent pas d'ombre noire : un filet `--line` et, au survol, un liseré de lumière `--electric` à 35 % d'opacité.
- La lumière principale est un dégradé radial bleu électrique très bas en opacité, placé au-dessus du contenu important.
- Un seul halo par écran.

## 5. Mouvement

| Jeton | Valeur | Usage |
|---|---|---|
| `--ease` | `cubic-bezier(0.25, 1, 0.5, 1)` | Sortie douce, par défaut |
| `--ease-precise` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Menus, transitions de page |
| `--t-fast` | 160 ms | Survol, focus |
| `--t-mid` | 320 ms | Onglets, apparition de menus |
| `--t-slow` | 640 ms | Entrées de section |
| Transition de page | 480 à 720 ms au total | Départ 280 ms, arrivée 440 ms décalée de 120 ms |

Règles :

- Aucun mouvement n'attend une animation pour naviguer : les transitions sont celles du navigateur (View Transitions entre documents).
- Les paragraphes ne s'animent pas ; seuls les titres, les écrans et les éléments de grille entrent.
- `prefers-reduced-motion: reduce` neutralise transitions, entrées, scène 3D et points en mouvement.

## 6. Composants

| Composant | Fichier | Variantes |
|---|---|---|
| En-tête flottant | `Header.astro` | Bureau (liens, explorer, démo), mobile (explorer) |
| Navigateur d'univers | `UniverseNavigator.astro`, `scripts/universe.ts` | Plein écran ; constellation en SVG, sans WebGL |
| Scène de constellation | `ConstellationScene.astro`, `scripts/constellation.ts` | Niveaux haut, équilibré, essentiel ; univers identity, key, alma |
| Boutons | `.btn` | `--primary`, `--secondary`, `--light`, `--sm` |
| Écrans du produit | `ProductScreen.astro` | 6 écrans, toujours clairs (fidèles à la console) |
| Niveaux de preuve | `LevelTag.astro` | production, ci, implemented, designed, target |

## 7. Rendu 3D

- WebGL 2 natif, sans bibliothèque. Les shaders vivent dans le module (aucun code en ligne : compatible avec la CSP et Trusted Types).
- Le module est chargé **après** le premier rendu, jamais pendant le préchargement d'une page (`document.prerendering`).
- La scène n'est jamais l'élément LCP. Elle s'affiche en fondu au-dessus d'une image fixe.
- Elle se met en pause hors de l'écran et quand l'onglet est masqué.

| Niveau | Condition | Rendu |
|---|---|---|
| Haut | WebGL 2 accéléré, pointeur fin, au moins 8 Go annoncés et 8 cœurs, écran d’au moins 1 024 px | 1 400 nœuds, densité de pixels jusqu’à 2 |
| Équilibré | WebGL 2 accéléré, écran d’au moins 768 px | 600 nœuds, densité de pixels 1, 30 images/s |
| Essentiel | Téléphone (moins de 768 px), mouvement réduit, économie de données, pas de WebGL 2 accéléré (rendu logiciel), au plus 2 Go ou 2 cœurs, échec de compilation | Image fixe, aucun WebGL |

Pour tester un niveau : `?rendu=haut`, `?rendu=equilibre` ou `?rendu=essentiel` dans l'adresse.

## 8. Accessibilité

- Focus visible partout : anneau `--electric` de 2 px, décalé de 3 px.
- Cibles tactiles d'au moins 44 px.
- Le menu plein écran est un `<dialog>` modal : il retient le focus, se ferme avec Échap et rend le focus au bouton qui l'a ouvert.
- La scène 3D est décorative (`aria-hidden`) ; tout son sens est dans le texte.
