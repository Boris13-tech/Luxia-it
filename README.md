# Luxia-IT

Official multilingual website for Luxia-IT: intelligent enterprise architecture, artificial intelligence, cybersecurity, cloud and automation.

**Production:** https://luxia-it.com  
**Source of truth:** https://github.com/Boris13-tech/Luxia-it  
**Languages:** FR / EN / 中文

## Stack

Next.js 16 / React 19, TypeScript, Three.js and React Three Fiber, Tailwind CSS and accessible Base UI components. The editable application includes all 63 localized routes, the Luxia Core renderer, fonts, public assets and translation resources. Sites uses the Vinext/Cloudflare Workers build of the same source.

## Development

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by the server. No API keys or application secrets are required for the current website. Contact prepares an email draft addressed to `Contact@legrand-tech.com`; it does not send through a backend.

## Validation and builds

```sh
npm run lint
npm run build
npm run build:vercel
```

`build` creates the Sites Worker bundle in `dist/`. `build:vercel` creates the native Next.js build. Run these sequentially because their generated Next.js type files share the workspace. Build output and credentials are ignored by Git.

## Deployment

Production remains on the existing Sites project identified in `.openai/hosting.json`. Cloudflare DNS connects `luxia-it.com` and `www.luxia-it.com` to that deployment. The apex domain is canonical; `www` permanently redirects while preserving the route and query string. `/` keeps the French default, with `/fr`, `/en` and `/zh` language prefixes.

GitHub `main` contains the complete approved source. CI validates the application on pushes and pull requests. The current Sites integration does not expose a GitHub-triggered deployment connection: production promotion remains an explicit approved step through Sites, using the exact GitHub source commit, its Worker build and the existing project. Never deploy a different checkout or replace this project with a second site.

The original legacy GitHub history is retained as a merge parent; the current tree is the approved production application. Keep secrets only in hosting/account secret stores, never in commits, remote URLs or documentation.

## Structure

- `app/`: localized routes, metadata, sitemap and robots.
- `components/`: interface, contact flow and shared 3D system.
- `lib/messages/`: French, English and Chinese copy.
- `public/`: production assets.
- `next.config.ts`, `vite.config.ts`, `vercel.json`: deployment configuration.
- `VALIDATION.md`: engineering checks and limitations.

Business/legal details still awaiting confirmation remain explicitly marked on the site. No client outcomes or partner certifications are invented.
