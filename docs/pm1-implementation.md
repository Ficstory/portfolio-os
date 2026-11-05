# PM1 portfolio

## Scope and repository

Additive Next.js App Router page at `/PM1/`. The existing `/`, `/pm/`, `/resume/` and other routes keep their layouts. No global CSS, routing base, hosting rewrite, dependency or model configuration changes are required.

- Repository: `https://github.com/Ficstory/portfolio-os.git`
- Site origin: `src/lib/seo.ts`, `https://ficstory.dev`
- Runtime: Next.js 16 / React 19 / TypeScript / Motion / npm lockfile
- Existing routing: `next.config.ts` has `trailingSlash: true`; `/PM1` redirects to `/PM1/` while preserving query parameters. Browser fragment handling is checked separately.
- Hosting evidence: the production `/pm/` response reports `Server: Vercel`, `X-Vercel-Id`, `X-Matched-Path: /pm`. The historical OCI export instructions in the root README do not match the active Next.js configuration, which does not enable `output: "export"`.

## Content and design

The user-supplied implementation brief is the factual source. [MotionSites 3D Portfolio](https://motionsites.ai/?prompt=3d-jack-portfolio-hero) supplies the visual direction. This new page uses a black/chrome composition, one white capabilities section, purple pill buttons and a scroll stack. Design variance/motion/density: 8/7/3. Radius rules: pill controls, rounded summary tiles, larger section and project corners.

- `src/components/pm1/content.ts`: project descriptions, capabilities, About copy and public contact links.
- `src/components/pm1/JhMonogram.tsx`: replaceable decorative JH object. It does not represent a real portrait.
- `src/components/pm1/Pm1Portfolio.tsx`: six sections, interactions and accessible details.
- `src/components/pm1/Pm1Portfolio.module.css`: scoped styling and responsive/reduced-motion rules.
- `src/app/PM1/`: independent route, fonts, metadata and generated Open Graph image.
- `public/pm1/fonts/`: official Kanit Black and its SIL Open Font License. Korean text reuses the existing local Pretendard variable font.
- `public/pm1/decorations/`: the four images explicitly supplied in the brief, verified as HTTP 200 image/png and stored locally. `decorationAssets` in `content.ts` is the replacement map. They are decorative, have empty alternative text, and load lazily. Source base: `https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/` (moon_icon.11395d36.png, p59_1.4659672e.png, lego_icon-1.703bb594.png, Group_134-1.2e04f3ce.png).

Summary tiles use factual typography rather than fabricated product screenshots. No private source documents or invented impact metrics are included. Email `mailto:dlwo4367@gmail.com` and resume `/resume/` were verified as public links on the existing production `/pm/` page.

## Local verification

```powershell
npm run dev -- --hostname 127.0.0.1 --port 3001
node scripts/check-pm1.mjs http://127.0.0.1:3001 --json
npm run lint
npx tsc --noEmit
node --test (rg --files src -g '*.contract.test.mjs')
npm run build
```

`scripts/check-pm1.mjs` checks HTTP routing, metadata, rendered copy, local asset responses, missing-asset 404 behavior and existing routes. It is a smoke test, not a substitute for browser interaction and visual inspection.

Browser screenshots and the HTTP report are local QA artifacts in `.codex_tmp/pm1/` (gitignored).

### Results, 2026-09-14

- Production build: passed; `/PM1` and `/PM1/opengraph-image` are statically prerendered. Final output is `.next/`.
- TypeScript: `npx tsc --noEmit` passed; the final production build also completed TypeScript validation.
- Scoped ESLint: all changed route/component/checker files passed without warnings.
- Repository lint: zero errors, 92 pre-existing warnings in `electioncommon.js` and `scripts/collect-instagram-public.mjs`.
- Existing contract tests: 74/74 passed.
- HTTP smoke checks against the production build: 35/35 passed, including four decoration images, both fonts, CSS/JS and the PNG Open Graph image. Report: `.codex_tmp/pm1/checks-production.json`.
- Browser: real Chrome inspection at 1440×1000, 768×1024, 390×844, 320×740 and 1024×600. No document horizontal overflow at the tested sizes. The 390px capabilities word wrap and 768px hero overlap were fixed and visually rechecked.
- Navigation: direct `/PM1?source=qa#capabilities`, trailing slash redirect, refresh, all four section links, both project anchor CTAs, back-to-top, and resume navigation were checked. Query and fragment survive normalization.
- Interaction: all three project dialogs opened; explicit Tab/Shift+Tab cycling, native Escape, close control and trigger focus restoration were checked. The two marquee tracks move in opposite directions, repeat without an exposed left gap, and hide repeated content from assistive technology. The monogram reacts to pointer movement and resets outside its region.
- Desktop stack: observed the first card pinned at 28px and scaled to 0.979 while the second arrived; the cards switch to ordinary flow when their measured height cannot fit the viewport. At 1024×600 all three cards disabled sticky/scaling. At 390px all three are in ordinary flow.
- Regression: existing `/` lock screen and `/pm/` layout were visually checked, and navigation from PM1 to `/resume/` removed the PM1 wrapper and restored the existing light styling. Production-preview console error/warning log was empty.
- Reduced motion and no-JavaScript behavior: source-reviewed. Every motion branch uses `useReducedMotion`, text is present in server HTML, no entry animation starts at zero opacity, and CSS provides reduced-motion fallbacks. The available browser interface did not expose reduced-motion emulation or a JavaScript-disable control, so those runtime modes were not exercised. Lighthouse and physical-device testing were not run; no performance score is claimed.

Production preview: `http://127.0.0.1:3002/PM1/` via `npm run start -- --hostname 127.0.0.1 --port 3002`.

Screenshots: `desktop-hero.png`, `desktop-about.png`, `desktop-capabilities.png`, `desktop-stack.png`, `desktop-contact.png`, `mobile-hero.png`, `mobile-320.png`, `mobile-about.png`, `mobile-capabilities.png`, `mobile-dialog.png`, `tablet-hero.png`, plus the existing-page regression captures in `.codex_tmp/pm1/`.

## Deployment handoff

Production publication is not authorized by the target URL alone. This task prepares and validates the code, then requests authorization for the actual publication, as specified in the user's implementation brief section 12.7.

Use the existing Vercel project attached to the domain, its existing production branch and standard Next.js build command `npm run build`. There is no need to upload an `out/` folder, set a `/PM1` base path, or add an HTML fallback for asset requests.

The working tree contains unrelated pre-existing changes. Include only `src/app/PM1/`, `src/components/pm1/`, `public/pm1/`, the `/PM1/` sitemap entry, this document and `scripts/check-pm1.mjs` in the PM1 release. Do not publish the whole working tree without reviewing those other changes.

No Vercel CLI, linked `.vercel` project or deployment workflow was found in this workspace. After publication approval, the remaining action is to apply these files to the existing deployment branch/project, run its Vercel deployment, and verify `https://ficstory.dev/PM1`, `/PM1/`, a query plus section fragment, the OG image, and existing `/` and `/pm/` routes. Do not create a competing project or change domain configuration.
