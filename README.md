# Luxia-IT

Luxia-IT corporate site with 21 content pages in French, English and Simplified Chinese (63 localized routes), the procedural LUXIA CORE experience, and an accessible contact message preparation flow.

## Development

`npm install` then `npm run dev`. `npm run build` produces the Sites-compatible Worker and browser assets. The supplied Sites scaffold uses Vinext, the Vite-based Next.js App Router implementation. React, TypeScript, Tailwind and React Three Fiber are used throughout.

## Vercel compatibility

The project also includes Next.js 16.3.4 and a Vercel configuration. `npm run build:vercel` uses native Next.js with the same application source. Sites continues to use its original Vinext build. Before changing the public domain, update canonical metadata and the sitemap origin.

## Content and localization

Company contact data and the shared expertise, sector, article and concept structures live in `lib/content.ts`. All customer copy is centralized in `lib/messages/fr.json`, `en.json` and `zh.json`. Stable message keys connect the same components and data structures to each language. `lib/i18n.ts` owns locale validation, URL prefixes and language alternates.

URLs use `/fr`, `/en` and `/zh` with identical page slugs. The root and legacy unprefixed content URLs redirect to French. The dynamic root layout renders the correct HTML language on direct visits. Navigation preserves language, while the global language selector preserves the page. Titles, descriptions, OpenGraph, canonicals, hreflang, structured data and sitemap entries are localized. Chinese uses a system CJK font stack with adjusted spacing and line heights.

## Contact

The form validates the project and organization in the selected language, shows a complete review, and creates an encoded `mailto:` link using the official email centralized in `site.email`: Contact@Luxia-it.com. It does not claim to send or store a lead. Users explicitly send from their email application. A copy option is available if no mail application is configured. WhatsApp links to +40 766 438 679. The WebMCP tool uses the same localized categories and visible form state.

For direct server delivery, connect a transactional email provider, keep credentials server-side, and add rate limiting, anti-abuse controls and server validation before replacing the current explicit email handoff.

## Publication checklist

Confirm legal entity, registered address, registration and tax numbers, publication director, final hosting details, and privacy terms before public publication. These fields are identified as pending on the legal pages. No clients, certifications, commercial partnerships, offices or measurable project outcomes have been invented.

The owner explicitly made the Sites deployment public. All absolute metadata and sitemap URLs derive from `site.origin`; change that value when the final domain is selected.

## Visual system

Tokens and responsive rules live in `app/globals.css`. `components/nucleus-scene.tsx` renders one coupled network: seven computational zones, instanced nodes, local verification gates, adaptive routes, transparent compute surfaces and shader-based packet trails. The same topology drives authentication, computation, expansion and workload distribution. A restrained quarantine event reroutes one flow while the rest of the network continues.

`components/core-journey.tsx` keeps one mounted canvas across the home hero, sticky expertise chapters, automation, agents and Labs. It follows editorial windows without resetting simulation time. Cursor proximity influences nearby nodes. There are no domain labels or literal brain/cloud/shield forms in the scene. Reduced motion uses a composed still state. Rendering pauses outside visible windows and when hidden, with DPR capped at 1 on mobile and 1.5 on desktop. The original supplied logo remains the fallback if WebGL is unavailable.

## Verification

See `VALIDATION.md` for completed checks and limitations. Contact-tool support is feature-detected; unsupported browsers simply retain the normal form.

### Architectural visual system
The third visual direction replaces the earlier point network with folded L infrastructure, a persistent narrative camera, local verification gates and activated compute decks. It adds a translated engineering ecosystem and interactive six-step conceptual cases. Development-only `?core-review=scene` and `?core-review=identity` views support visual reviews; these have no production behavior. See VALIDATION.md for reviewed views and performance limits.
