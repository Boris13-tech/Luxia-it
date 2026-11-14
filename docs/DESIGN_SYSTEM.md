# Système de design — Luxia-IT

## 1. Couleurs et surfaces
- Fond principal (`--paper`) : `#060709` avec trame orthogonale `1 px` espacée de `64 px` (`rgb(255 255 255 / 0.025)`).
- Surface alternée (`--paper-2`) : `#0a0c10`.
- Cellules architecturales (`--surface`, `--surface-2`) : `#0f1218` et `#151a22`.
- Encre optique (`--ink`, `--ink-2`, `--ink-3`) : `#f4f6fa`, `#b8c0cc`, `#838e9e` (contraste minimal ≥ 4,5 : 1 WCAG AA).
- Filets structurels (`--line`, `--line-strong`) : `#1c222d` et `#4e596d`.
- Accent de précision (`--blue`, `--link`) : `#2563eb`, `#7cb3ff`.

## 2. Typographie (auto-hébergée, zéro requête tierce)
- Titres (`--display`) : `Inter Tight`.
- Corps (`--font`) : `Roboto`.
- Télémétrie, niveaux et métadonnées (`--mono`) : `JetBrains Mono`.

## 3. Géométrie et grille
- Conteneur maximal : `--max: 1200px`, gouttière fluide `--gutter`.
- Rayons de bordure web : `--radius: 2px`, `--radius-sm: 2px` (architecture nette, réservant les arrondis physiques aux seuls châssis mobiles de démonstration **LUXIA Key**).
- Séparations franches par filets `1 px` continus plutôt que par cartes isolées flottantes.

## 4. Composants structurants
- `Header.astro` : barre de commande pleine largeur bordée `1 px`, boutons rectangulaires `2 px`.
- `UnifiedStackMatrix.astro` : cartographie en 6 niveaux (`LUXIA AI Security`, `LUXIA Trust Ledger`, `LUXIA Sovereign Runtime & Edge Operations`, `LUXIA Trust Graph`, `LUXIA Policy`, `LUXIA Identity & LUXIA Key`), colonne vertébrale centrale et 3 piliers stratégiques.
- `KeyDeviceShowcase.astro` : vitrine bi-écran de **LUXIA Key** (connexion sans mot de passe & validation géolocalisée des accès sensibles) et passerelle **LUXIA Identity**.

## 5. Mouvement et accessibilité
- Entrées nettes et rapides (`hero__title` par `rise`, sections `.shead` via `animation-timeline: view()`), désactivées intégralement sous `prefers-reduced-motion: reduce`.
- La scène 3D (`ConstellationScene`) est décorative (`aria-hidden`) ; tout le sens technique réside dans le texte et la sémantique HTML.
