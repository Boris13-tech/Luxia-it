# Direction créative — LUXIA, l'écosystème de confiance

## 1. Idée centrale

Le site est un **ciel de nuit organisé** : des identités, des ressources et des décisions, reliées à un registre qui fait autorité. Chaque point lumineux représente une chose réelle : une personne, un agent, une application, une décision inscrite au journal. Rien n'est décoratif sans sens.

Positionnement de travail : « LUXIA — Engineering Trust in an Intelligent World ». C'est une proposition du brief. **Le message officiel reste celui du site** (« Gouvernez qui accède à quoi. Prouvez chaque décision. ») tant que le propriétaire n'a pas validé autre chose.

## 2. Références étudiées (25 octobre 2026)

| Site | Ce qui a été observé | Ce qu'on en retient |
|---|---|---|
| linear.app | Fond presque noir, titre qui apparaît en se défloutant, interface du produit sous le titre. | Le flou comme entrée, la retenue. |
| raycast.com | Barre de navigation en pastille flottante, titre centré qui apparaît en se défloutant. | L'en-tête flottant et compact. |
| vercel.com | Monochrome, un seul objet 3D éclairé au centre, composition en deux colonnes. | Un seul élément spectaculaire par écran. |
| stripe.com (le 24 octobre) | Courbe d'accélération longue et douce. | `cubic-bezier(0.25, 1, 0.5, 1)`, déjà notre signature. |
| okta.com, sailpoint.com (le 24 octobre) | Navigation par produit, cas d'usage, ressources, appel à la démonstration. | La structure de l'information. |

Les autres références du brief (Active Theory, Lusion, Resn, Immersive Garden, Unseen, Noomo, makemepulse, Utsubo, Dogstudio, Locomotive, Apple, Nothing, Framer, Cursor, Runway, Dia, Spline, Webflow, Clerk, Supabase, Mistral) **n'ont pas été consultées** pendant ce chantier. Rien n'en est tiré.

## 3. Lumière et matière

- **Obsidienne** pour le fond, **bleu nuit** pour les surfaces, **bleu électrique** pour l'information active.
- La lumière vient d'en haut, comme une aurore discrète : elle désigne ce qui compte (le titre, l'action principale, le registre).
- **Violet contrôlé, réservé à l'IA** : ALMA et les identités d'agents. Jamais en lueur générale.
- **Ambre de signal**, rare : ce qui est en préparation ou demande une action.
- Pas de cadenas, pas de pluie binaire, pas de silhouettes, pas de réseau sans signification.

## 4. Univers par domaine

Chaque domaine est relié à une capacité **réelle** et porte son niveau de preuve. Aucun nom de produit nouveau n'est publié.

| Domaine | Ce qui existe réellement | Couleur | Motif |
|---|---|---|---|
| LUXIA Identity, le registre | Plateforme en développement, capacités vérifiées en production | Bleu électrique | Constellation centrée sur le registre |
| Politique d'accès | Droits explicites, séparation des tâches (préventive), revues d'accès | Bleu glacier | Portes, décisions binaires |
| Journal en ajout seul | Journal d'audit que l'application ne peut ni modifier ni supprimer | Blanc chaud | Chronologie, points alignés |
| Adaptateurs de fournisseurs | Entra ID en production, OIDC générique conçu, autres prévus | Cyan | Connecteurs modulaires |
| Identités d'agents IA | Type d'identité « agent IA » dans le registre | Violet | Réseau d'agents délégués |
| LUXIA Key | Authentificateur, prototype | Bleu clair | Anneau, présence |
| ALMA | Recherche : agents à outils typés, accord humain obligatoire | Violet | Réseau d'agents, points de contrôle |
| Exécution souveraine | Architecture cible, aucun déploiement | Gris acier | Nœuds régionaux en pointillés |

## 5. Langage du mouvement

1. **Précision** : chaque mouvement a un point de départ et une destination.
2. **Continuité** : l'en-tête et l'écran du produit passent d'une page à l'autre sans se redessiner.
3. **Profondeur** : la page qui part recule, celle qui arrive avance.
4. **Intelligence** : le sens du mouvement suit le sens de la navigation (aller ou retour).
5. **Retenue** : un seul moment fort par écran ; le reste est calme.

Sous `prefers-reduced-motion: reduce`, tout mouvement non essentiel disparaît, y compris la scène 3D, remplacée par son image fixe.

## 6. Expériences signatures

- **Navigateur d'univers** : un menu plein écran (`<dialog>` natif) qui révèle l'écosystème. À gauche, les destinations en grande typographie ; à droite, la constellation des domaines, chacun avec son état. La navigation classique reste toujours visible.
- **Transitions cinématiques** : transitions de document natives (View Transitions entre pages). Un faisceau de lumière traverse l'en-tête, l'écran du produit se transforme d'une page à l'autre, et le sens suit la navigation.
- **Constellation d'identité** : une scène WebGL native (sans bibliothèque) en tête de l'accueil, rendue sur trois niveaux, avec une image fixe en repli.

## 7. Ce qui reste volontairement absent

Pages Academy et Industries (aucun contenu réel), traduction chinoise (aucune traduction professionnelle), défilement simulé (Lenis : il fausserait le défilement natif et l'accessibilité), bibliothèque 3D (Three.js : plus de 150 Ko pour une scène de points et de lignes).
