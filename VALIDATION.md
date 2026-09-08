# Validation — Luxia-IT

## Completed functional and visual checks

- 21 content pages return HTTP 200, each with one H1, title, description and canonical URL. Internal content links resolve to implemented routes.
- Sitemap, robots and favicon respond successfully. An unknown route returns the custom 404 page with HTTP 404.
- Home page inspected visually at 1440px and 390px. The central geometry was adjusted to separate the three logo-inspired forms. The mobile closing headline overflow was corrected.
- Home page document width checked at 375, 390, 430, 768, 1024, 1440 and 1920px: no horizontal overflow.
- Contact review checked at mobile and desktop sizes; no document overflow. Labs inspected at 1024px.
- Mobile menu opens, closes after navigation and reaches Labs. Dialog uses accessible focus management from the shared primitive.
- Framework switches with pointer and keyboard activation. Agent tab switches to the Operations content.
- Contact rejects missing required fields, retains project data between steps, accepts an effectif selection and generates the complete encoded mailto draft. No email was sent.
- WebMCP `stage_luxia_project`: registered schema and annotations inspected; invalid message rejected; valid input stages the same visible form without sending or storing a message.
- No application console errors observed in the clean final test tab. The Three.js / React Three Fiber combination emits a development deprecation warning about Clock; it does not prevent rendering.

## Performance and accessibility scope

The Three.js scene is a separate lazy-loaded chunk. Rendering is suspended outside the observed region and when the document is hidden. Pixel ratio is capped at 1 on mobile and 1.5 on desktop. The reduced-motion setting selects demand rendering and disables CSS motion. The supplied logo is the fallback for unavailable WebGL.

Keyboard focus states, a skip link, labeled fields, semantic headings and the shared accessible menu/tabs/select/radio primitives are implemented. Runtime inspection found unlabeled radio controls; explicit accessible names were added.

These checks are not a formal WCAG certification or a Core Web Vitals field measurement. No Lighthouse score, traffic statistic or real-device performance guarantee is claimed. Reduced-motion behavior was reviewed in source; OS preference switching was not available in the browser test capability.

## Build and publication

Both the Sites-compatible build and the native Next.js/Vercel build passed during development. Final build results and dependency audit are recorded with the delivered version. Lint covers authored application code; untouched generated UI primitives and the starter mobile hook are excluded because they carry pre-existing lint findings.

Before public release, the company must supply the legal entity, registered address, registration/tax details and final privacy information. The current contact mechanism prepares an email rather than providing server-side email delivery. French content is published; reviewed English content remains a future extension.

Final dependency audit after the security updates: npm reports 0 vulnerabilities across 617 packages. The scaffold dependencies were updated to compatible patched releases without force or legacy peer dependency overrides.
