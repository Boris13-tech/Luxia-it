# Luxia-IT

French corporate site with 21 content routes, a procedural Three.js identity, accessible interaction primitives and a contact message preparation flow.

## Development

`npm install` then `npm run dev`. `npm run build` produces the Sites-compatible Worker and browser assets. The supplied Sites scaffold uses Vinext, the Vite-based Next.js App Router implementation. React, TypeScript, Tailwind and React Three Fiber are used throughout.

## Vercel compatibility

The project also includes Next.js 16.3.4 and a Vercel configuration. `npm run build:vercel` uses native Next.js with the same application source. Sites continues to use its original Vinext build. Before changing the public domain, update canonical metadata and the sitemap origin.

## Content and localization

Company contact data, expertise, sectors, articles and concepts live in `lib/content.ts`. French is the only published locale. The `site.locales` configuration and shared content layer provide the starting point for reviewed English content; no untranslated English route is advertised.

## Contact

The form validates the project and organization, shows a complete review, and creates a properly encoded `mailto:` link addressed to Contact@legrand-tech.com. It does not claim to send or store a lead. Users explicitly send from their email application. A copy option is available if no mail application is configured. WhatsApp links to +40 766 438 679.

For direct server delivery, connect a transactional email provider, keep credentials server-side, and add rate limiting, anti-abuse controls and server validation before replacing the current explicit email handoff.

## Publication checklist

Confirm legal entity, registered address, registration and tax numbers, publication director, final hosting details, and privacy terms before public publication. These fields are identified as pending on the legal pages. No clients, certifications, commercial partnerships, offices or measurable project outcomes have been invented.

The initial Sites deployment is private. Canonical metadata and sitemap use its supplied origin. Update `site.origin` and root metadata together when the final domain is selected.

## Visual system

Tokens and responsive rules live in `app/globals.css`. The three logo-inspired forms are real extruded geometry in `components/nucleus-scene.tsx`, wrapped by a lazy, visibility-aware client boundary. Scroll chapters change network, protection and distribution states. Reduced-motion users receive a still scene. A supplied-logo fallback preserves identity without WebGL. Render resolution is capped at 1.5 device pixel ratio.

## Verification

See `VALIDATION.md` for completed checks and limitations. Contact-tool support is feature-detected; unsupported browsers simply retain the normal form.
