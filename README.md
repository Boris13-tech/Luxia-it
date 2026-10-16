# Site Luxia-IT

Site institutionnel de Luxia-IT : plateformes (LUXIA Identity, LUXIA Key, ALMA),
services, architectures de référence, Labs, entreprise, carrières et contact.

Les contenus manquants sont listés dans [CONTENUS.md](CONTENUS.md).

## Technologies

| Choix | Pourquoi |
|---|---|
| **Astro 7**, génération statique | Pages HTML pré-générées : aucun serveur applicatif à attaquer ni à maintenir, temps de chargement minimal, référencement natif. |
| **TypeScript 6**, mode `strictest` | Données (plateformes, navigation) et composants typés ; `astro check` bloque le build en cas d'erreur. |
| **CSS natif** à jetons (`src/styles/global.css`) + styles par composant | Aucun framework CSS. Palette, typographie et mouvement définis à un seul endroit. |
| **Polices auto-hébergées** (Roboto via Fontsource) et **icônes Lucide** rendues en SVG au build | Aucune requête vers Google ni un autre tiers : cohérent avec la souveraineté et le RGPD. |
| **JavaScript minimal**, sans bibliothèque | Uniquement pour le menu, les animations au défilement, les onglets, la galerie, les vidéos et le formulaire. Le site reste lisible sans JS. |
| **Transitions natives** (`@view-transition`) | Fondus entre les pages sans bibliothèque. Tout mouvement est désactivé avec `prefers-reduced-motion`. |

## Commandes

```bash
npm install            # installer les dépendances
npm run dev            # développement : http://localhost:4321
npm run build          # vérification TypeScript puis génération dans dist/
npm run preview:secure # sert dist/ avec les en-têtes de sécurité de production : http://localhost:4400
```

Node.js 22.12 ou plus récent est requis.

## Structure

```
src/
  data/site.ts          plateformes, statuts, navigation, pied de page
  styles/global.css     système de design (couleurs, typographie, grille, mouvement)
  layouts/              gabarit de base (SEO, en-tête, pied de page) et pages légales
  components/           Header, Footer, Media, ArchDiagram, composants interactifs (voir plus bas)
  pages/                une page par fichier ; plateformes/ pour les pages produit
  scripts/              JavaScript côté navigateur (scènes, récit, onglets, galerie, menu, formulaire)
public/
  media/                captures et vidéos du logiciel (à fournir)
  _headers              en-têtes de sécurité (Cloudflare Pages, Netlify)
deploy/                 configuration nginx pour un hébergement auto-géré
Dockerfile              image de production (nginx non privilégié)
```

## Design et interactions

Inspiré de la mise en page de synapsys-solutions.com (structure, rythme des
sections, boutons « pilule », titres en deux tons), avec les contenus, la marque
et les visuels propres à Luxia-IT : aucun texte, logo ni image de ce site n'est
repris.

- **Couleurs du logo** : bleu Luxia `#1f5fbf` et bleu clair `#8db3e8`, marine
  `#0f2547` pour les fonds sombres, gris bleutés. Tout se règle dans
  `src/styles/global.css` (jetons `--brand`, `--brand-light`, `--navy`…).
- **Logo** : redessiné en vecteur à partir du fichier fourni
  (`public/brand/luxia-it-logo-original.png`) dans `src/components/Logo.astro`,
  avec une version inversée (blanc et bleu clair) pour les fonds sombres. L'emblème
  « A » sert aussi de filigrane dans les bandeaux et d'illustration à la section
  « Notre vision ».
- **En-tête** transparent sur le bandeau d'ouverture, blanc dès que l'on fait
  défiler ; menus déroulants au survol et au clavier ; menu plein écran sur mobile.
- **Accueil** : phrase d'ouverture dont la partie orange change toutes les
  3,8 s (fixe avec `prefers-reduced-motion`), indicateur de défilement.
- **Apparition des sections** au défilement, cartes qui s'élèvent au survol,
  bouton « haut de page ».

| Composant | Rôle |
|---|---|
| `HeroHome`, `PageBanner`, `HeroArt` | Bandeaux d'ouverture (photo optionnelle sous voile ardoise, bande orange, réseau de points) |
| `SectionTitle` | Titre en deux tons |
| `IconFeature` | Icône, titre et texte, avec lien rond optionnel |
| `FeatureCard`, `CaseCard` | Cartes blanches et cas d'usage |
| `Steps` | Étapes numérotées |
| `LogoStrip` | Logos clients (emplacements tant qu'ils ne sont pas fournis) |
| `CtaBand` | Bandeau d'appel à l'action |
| `PlatformPage` | Gabarit complet d'une page plateforme |

Pour mettre une photo dans un bandeau : déposez-la dans `public/media/` et passez
`image="/media/ma-photo.webp"` à `HeroHome` ou `PageBanner`.

Ajouter une plateforme : l'ajouter dans `src/data/site.ts` (elle apparaît alors
dans la navigation, le pied de page et les listes), puis créer sa page dans
`src/pages/plateformes/`.

## Sécurité

- **CSP stricte** sans `unsafe-inline` : tout le CSS et le JS sont servis en
  fichiers externes (`inlineStylesheets: 'never'`, `assetsInlineLimit: 0`).
  Trusted Types est imposé (`require-trusted-types-for 'script'`).
- **Isolation** : `frame-ancestors 'none'`, COOP, CORP et COEP, `X-Frame-Options: DENY`.
- **HSTS** sur deux ans. La directive `preload` n'est pas activée : ne l'ajouter
  qu'une fois tous les sous-domaines servis en HTTPS, car elle est difficile à retirer.
- **Permissions-Policy** fermée (caméra, micro, géolocalisation, paiement…).
- **security.txt** (RFC 9116) régénéré à chaque build, avec une expiration à un an.
- **Formulaire** : validation, champ piège anti-robots, envoi sans cookies
  (`credentials: 'omit'`).
- Les en-têtes sont définis à deux endroits qui doivent rester identiques :
  `public/_headers` et `deploy/security-headers.conf`.

Après un déploiement, vérifier les en-têtes avec un outil comme
securityheaders.com ou Mozilla Observatory.

## Formulaire de contact

Le site étant statique, le formulaire envoie ses données (POST, `multipart/form-data`)
vers un service de traitement à définir :

1. Renseigner `PUBLIC_FORM_ENDPOINT` (voir `.env.example`) avant le build.
2. Ajouter l'origine de ce service à `connect-src` et `form-action` dans les deux
   fichiers d'en-têtes.

Tant que la variable est vide, l'envoi est désactivé et un message l'indique.
Pour rester cohérent avec la souveraineté, privilégier un service hébergé dans
l'Union européenne, ou une petite fonction serveur exploitée par Luxia-IT.

## Déploiement

L'URL publique se définit au build : `SITE_URL=https://www.exemple.fr npm run build`
(utilisée pour les URL canoniques, le sitemap et security.txt).

**Hébergement statique** (Cloudflare Pages, Netlify ou tout CDN) : publier
`dist/`. Le fichier `_headers` est pris en compte automatiquement.

**Vercel** : `vercel.json` fixe le préréglage Astro, la commande de build, le
dossier `dist` et les en-têtes de sécurité (Vercel ne lit pas `_headers`). Ces
deux fichiers doivent rester alignés avec `deploy/security-headers.conf`.

**Hébergement auto-géré ou souverain** (conteneur) :

```bash
docker build --build-arg SITE_URL=https://www.exemple.fr -t luxia-site .
docker run -p 8080:8080 luxia-site
```

L'image sert le site par nginx sans privilèges root, sur le port 8080 ; le TLS
est terminé en amont. Le site étant statique, la montée en charge se fait en
ajoutant des réplicas ou un CDN devant. Cette image n'a pas encore été construite
ni testée.

## Accessibilité

Les couleurs de la marque respectent le contraste AA : texte blanc sur bleu Luxia
(6:1), bleu Luxia sur blanc (6:1), bleu clair sur marine (7:1). Les marqueurs
`[À FOURNIR]` sont en ambre pour rester repérables.
