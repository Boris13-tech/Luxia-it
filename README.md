# Luxia-IT, corporate site

Luxia-IT is the corporate technology brand of the Legrand-Tech ecosystem. It is organised around three practices that reinforce each other. These are Products and Solutions, Technology Consulting, and the Luxia Academy. This repository is the source of the marketing site.

The site is built as a set of self-contained HTML pages, styled by a bound design system called Nocturne. There is no build step and no traditional runtime framework. Each page is a Design Component, saved as `Name.dc.html`, that renders directly in the browser. That decision is deliberate. It keeps the surface small, the security review tractable, and the site fast on any static host.

---

## Project overview

| Aspect | Choice |
| -------------------- | ---------------------------------------------------------------------- |
| Language | Static HTML + inline CSS/JS, ES modules for the 3D layer |
| Runtime | Design Component runtime bundled in `support.js` (React under the hood) |
| Design system | Nocturne (`_ds/nocturne-…/`) |
| 3D | three.js loaded from `esm.sh` via importmap |
| Build | None. Deploy the folder as-is. |
| Backend | None by default. The contact form can be wired to any endpoint. |

## Repository layout

```
.
├── Home.dc.html Landing page (hero 3D lattice + pillars flywheel)
├── WhatWeDo.dc.html Overview of the three practices
├── Products.dc.html Products & Solutions
├── Consulting.dc.html Technology Consulting
├── Academy.dc.html Luxia Academy
├── Industries.dc.html Industries served
├── Insights.dc.html Perspectives, research, engineering notes
├── About.dc.html Story, mission, leadership, ecosystem
├── Careers.dc.html Tracks and open positions
├── Contact.dc.html Contact form + direct channels
│
├── Luxia-IT Strategy.dc.html Phase 1 to 4 strategy document (kept for provenance)
│
├── page-shell.css Shared shell (nav, footer, hero, section base)
├── hero-fx.js three.js scenes for the hero and the pillars flywheel
├── contact.js Contact form client-side handler
├── image-slot.js <image-slot> web component for real photography
├── support.js Design Component runtime (bundled)
│
├── _ds/nocturne-…/ Bound design system (do not edit in place)
│
├── _headers Netlify / Cloudflare Pages header rules
├── nginx.sample.conf Reference nginx configuration
├── robots.txt Search engine directive
├── .env.example Sample environment configuration
├── .gitignore
└── github.md Repository association + sync log
```

---

## Local development

The pages are static. Any HTTP server will serve them. Opening the files directly via `file://` will not work, because ES modules and stylesheet imports need a real origin.

```bash
# Python
python -m http.server 8080

# Node
npx serve .

# PHP
php -S localhost:8080
```

Then open `http://localhost:8080/Home.dc.html`.

There is no watcher and no build. Reload the browser after saving.

## Production build

There is no build step. Copy the whole folder to your static host. All paths are relative.

The following files are required in production:

- Every `*.dc.html`
- `support.js`, `page-shell.css`, `hero-fx.js`, `contact.js`, `image-slot.js`
- The entire `_ds/nocturne-…/` folder
- `robots.txt`
- `_headers` (Netlify / Cloudflare) or the equivalent from `nginx.sample.conf`

Do **not** ship the following: `.env`, `Luxia-IT Strategy.dc.html` (internal), and `github.md` (internal).

## Deployment

**Netlify / Cloudflare Pages.** Push the repo, set build command to empty, publish directory to `.`. The `_headers` file is read automatically.

**Static bucket + nginx / CDN.** Upload the folder, apply the directives from `nginx.sample.conf`, terminate TLS at the edge. Enable HTTP/2 or HTTP/3.

**Custom domain.** Set `SITE_URL` in `.env` (used for canonical tags and sitemap generation once added), point the domain at your host, force HTTPS.

---

## Environment variables

`.env.example` lists every variable the site can consume. Copy it to `.env` and fill in the values you need for your deployment. Never commit `.env` itself.

| Variable | Purpose |
| ------------------- | --------------------------------------------------------------------------- |
| `CONTACT_ENDPOINT` | Where the contact form posts. Leave blank to keep the form in preview mode. |
| `ANALYTICS_DOMAIN` | Optional. Privacy-respecting analytics domain (Plausible, Fathom, Umami). |
| `SITE_URL` | Public URL of the site. Used for canonical tags and sitemap. |

The site does not consume environment variables at build time, because there is no build step. Values are used by the deployment platform for redirects, header substitution, and form services. Never inline secrets into HTML files.

---

## Content management

**Text.** Edit the `.dc.html` files directly. Text lives in the markup, not in a CMS. Direct edits made in the preview persist without a rebuild.

**Photography.** Every `<image-slot>` on Home and the other pages is a real-photo slot. Drop a JPEG or PNG onto it in the preview and the file persists as a sibling `image-slots.state.json`. Prefer photographs shot on your own floor over stock imagery.

**Case studies.** Case-study cards on the homepage are labelled *Format* until a client has agreed to publication. Replace the placeholder narrative when a story is ready. Do not invent numbers.

**Insights.** New posts are individual sections on `Insights.dc.html` for now; when the volume justifies it, split into per-post files with the same shell.

---

## Architecture

**One file per page.** Each `.dc.html` file contains a whole page: the head, styles, markup, and references to shared assets. This trades some duplication for a simpler mental model and easier review.

**Shared shell.** Everything visually shared between pages, meaning the top nav, footer, and section base, lives in `page-shell.css`. The homepage keeps additional page-specific styles inline because its hero is a bespoke composition.

**Design system.** `_ds/nocturne-…/styles.css` carries the tokens and component classes. Every colour, font, spacing value, and shadow comes from CSS variables (`--color-*`, `--font-*`, `--space-*`, `--radius-*`, `--shadow-*`). Do not hard-code values the tokens already carry. Retune the token instead.

**Streaming rendering.** Pages paint top-down; markup uses inline styles so nothing waits for a stylesheet round trip.

## 3D architecture

Two scenes, both in `hero-fx.js`:

- **Hero lattice** (`#hero-fx`). A fibonacci-sphere point cloud with faint accent-tinted lines connecting nearby nodes. Three orbiting focal nodes represent the three practices. As the visitor scrolls into the page, the camera dollies forward and the scene fades. Mouse position is smoothed and applied as a small rotation offset.
- **Pillars flywheel** (`#pillars-fx`). Three linked node clusters, one per practice. A cube stands for Products, a mesh network for Consulting, and a spiral for the Academy. They are joined by Bézier arcs and rotate in place while in view.

Both scenes:

- **Feature-detect WebGL.** If neither `webgl2` nor `webgl` is available, the canvas is hidden and the design falls back to the static gradients.
- **Respect `prefers-reduced-motion: reduce`.** Animation is skipped; the composition stays visible as a still.
- **Adapt to viewport.** Under 720 px node counts are roughly halved and antialiasing is disabled.
- **Pause when hidden.** `visibilitychange` prevents wasted frames when the tab is backgrounded.
- **Pause when off-screen.** The pillars scene renders only when the IntersectionObserver reports it in view.

The `three.js` module is loaded through a strict importmap. Only the version pinned in the helmet of the pages that use it is allowed. No dynamic module resolution is permitted.

## Accessibility

- Semantic landmarks, `<header>`, `<nav>`, `<main>` sections, `<footer>`, `<article>` where appropriate.
- Focus rings, the design system's `:focus-visible` accent ring is respected everywhere; no `outline:none` overrides.
- Text contrast, verified against Nocturne's ramps; body copy sits at ≥ 4.5:1 on the ground.
- Reduced motion, 3D animation is disabled; scroll-linked effects still apply but as instant states.
- Form labels, every input has an associated `<label for>` and `name` attribute.
- Live status, the contact form's status region uses `aria-live="polite"`.
- Keyboard, every interactive element is a real `<a>`, `<button>` or `<input>`. No divs pretending to be controls.
- Language, `<html lang="en">`; `lang="fr"` variants will land in a `/fr/` sibling folder when the French translation ships.

## SEO

- `<title>` and `<meta name="description">` on every page.
- Open Graph meta on every page.
- `robots.txt`, allows all crawlers.
- Sitemap, to be generated at deploy time from the `.dc.html` file list. A one-line script will be added when the domain is fixed.
- Canonical tags, add `<link rel="canonical" href="{{SITE_URL}}/{{page}}">` once `SITE_URL` is set.

## Security practices

The site is static, so the attack surface is small. What we do:

- **No secrets in the repository.** `.env` is git-ignored. `.env.example` documents the schema.
- **No third-party analytics or trackers by default.** The site loads two external origins: `esm.sh` for three.js, and `unpkg.com` for the React build used by the Design Component runtime. Both are pinned to specific versions in the importmap and in the script tags.
- **Content Security Policy.** The `_headers` file and the `nginx.sample.conf` sample ship a CSP that allow-lists only those origins. `frame-ancestors 'none'` prevents the site from being embedded. `object-src 'none'` blocks Flash and legacy plugins. `upgrade-insecure-requests` forces HTTPS.
- **Security headers.** `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security` with a two-year max-age and preload, `Permissions-Policy` disabling camera / microphone / geolocation / payment / usb.
- **Contact form.** No endpoint is hardcoded. In preview mode, the form validates locally and shows a confirmation without transmitting any data. In production, wire `CONTACT_ENDPOINT` to a service that re-validates server-side. Do not rely on the client checks alone.
- **No `dangerouslySetInnerHTML` or `innerHTML=` on user data.** Everything renders through the escaped text bindings of the Design Component runtime.
- **External links.** The site does not currently carry any external outbound links. Any link added later must carry `rel="noopener noreferrer"`, and `target="_blank"` where opening in a new tab is desired.
- **Dependency hygiene.** Two third-party modules load at runtime: three.js and React. Both are pinned to a specific version. Bump them by editing the URLs in `hero-fx.js` for three.js, and in `support.js` for React if you replace the runtime.

## Troubleshooting

**The 3D hero does not appear.**
- Open the console. If you see a WebGL error, the browser has disabled hardware acceleration. The site degrades to the static gradient, no page break.
- If the canvas is present but empty, the DC runtime may not have mounted yet. `hero-fx.js` retries every 250 ms for ten seconds; a hard reload usually resolves it.

**Fonts show a flash of unstyled text.**
- The Inter family is loaded from Google Fonts. On very slow connections a FOUT is possible. The system font fallback (`system-ui, sans-serif`) is applied first.

**The contact form does not send anything.**
- Expected in preview mode. Set `CONTACT_ENDPOINT` at deploy time, the form then POSTs JSON to that endpoint.

**A page shows a blank body.**
- The DC runtime relies on `support.js`. If a proxy strips the file, replace with the version in this repo. `support.js` is not user-editable.

## Contribution guidelines

1. Branch from `main`. Name the branch after the section you're editing (`copy/consulting`, `3d/hero-perf`, `content/insights-post-1`).
2. Keep pull requests small. One page or one concern per PR.
3. Do not commit `.env`, screenshots, or generated PDFs.
4. Test on desktop and on a phone before requesting review, the 3D scenes have to be sanity-checked on both.
5. Every claim must be verifiable. No invented clients, statistics, revenue figures, partnerships, or certifications. Where a number is not yet published, use a `Format` or `Placeholder` marker.
6. Prefer clarity over cleverness. If the reader has to guess what a sentence means, rewrite it.

---

## Known limitations and what to configure before deploying

The site is complete as a static frontend. The following items are deliberately not wired here and must be configured before public launch. Nothing on the site pretends they are already in place.

1. `SITE_URL`. Substitute your public URL into the empty `href=""` of each page's `<link rel="canonical">` at deploy time, and into the Organization JSON-LD on Home. A one-line sed pass during deploy handles this.
2. `SUBMIT_ENDPOINT` in `contact.js`. Until this is filled with the URL of a form service or a small serverless function, the contact form displays a notice and does not transmit. Server-side validation and abuse protection must live at that endpoint.
3. Real photography. Every `<image-slot>` is a labelled placeholder waiting for a real image. The drop persists as a sibling `image-slots.state.json`.
4. Case studies. The Home page shows format cards, not real client work. Replace them once a client has reviewed the story and any figures.
5. Insights. Six format cards are shown. Replace individually as articles are written.
6. Certifications and partner statuses. Nothing is claimed. The heritage strip on Home makes it explicit that these appear as they become official.
7. Self-hosting of `three.js`. Currently loaded from `esm.sh`, pinned to `0.160.0`. If you prefer to self-host, place `three.module.js` in the repository and update the importmap in each page's helmet.
8. Sitemap. Add a `sitemap.xml` at deploy time from the list of `.dc.html` files.
9. Contact channels during transition. The site currently shows `contact@legrand-tech.com` and the Legrand-Tech Calendly link. When Luxia-IT has its own channels, update the footer, the Contact page, and the JSON-LD.
10. French translation. The current build is English. The architecture is language-neutral; the French version can sit under `/fr/` alongside the English pages.



Luxia-IT is the corporate technology brand of the Legrand-Tech ecosystem. Some contact channels currently point to `contact@legrand-tech.com` during brand transition.

The `Luxia-IT Strategy.dc.html` document in this repository is a snapshot of the phase 1-4 strategy work that shaped the site. It is included for maintainers; do not ship it to production.
