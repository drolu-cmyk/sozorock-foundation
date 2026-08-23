# The SozoRock Foundation parent site

The canonical Sites source for `www.sozorockfoundation.org`. The site is a responsive institutional experience with a Cloudflare Worker entry point for clean-route delivery and verified publication-access requests.

## Run locally

```bash
npm install
npm run dev
```

Production build and verification:

```bash
npm run build
node scripts/prepare-sites-build.mjs
node --test tests/sites-worker.test.mjs
```

## Architecture and production source

The site uses React and Vite with a lightweight History API router. The Sites worker serves the app shell directly for every permanent route so copied links and browser refreshes retain the requested path. It includes distinct views for Platforms, Publications, Insights, Events, About, Leadership, Partner, Support, Standards, the three platform detail pages, and the three DOI-facing publication routes.

Sites is the only production deployment source for the parent website. This repository does not contain an AWS parent-site deployment workflow or reconstructed AWS clone.

The homepage includes a rotating, pausable initiative feature with keyboard-operable tabs. Motion is intentionally restrained and respects `prefers-reduced-motion`.

## Source-backed content

Content and approved imagery were grounded in the Foundation’s current parent site, supplied files, leadership page, and live platform sites:

- `health.sozorockfoundation.org`
- `health.sozorockfoundation.org/explore`
- `ai-lab.sozorockfoundation.org`
- `cbcap.sozorockfoundation.org`

The visual system uses the parent Foundation’s deep navy and blue palette. It does not use gradients or generated hero artwork.

## Permanent publication routes

These routes remain distinct and unchanged:

- `/publication/hsa-v1-2026`
- `/publication/rrg-v1-2025`
- `/publication/rebs-v1-2025`

These records remain public and indexable. Downloadable HSA files are released through a separate verified-access route:

- `/publication/hsa-v1-2026/access`

Direct legacy file URLs redirect to that access route. The current Health verification service sends the verification link from `publications@sozorockfoundation.org`.

## Form behavior

The Partner and Support forms validate locally and prepare an addressed email inquiry; they do not claim to submit to a CRM. The HSA publication-access form posts to the Sites worker, which validates the request and forwards it to the established SozoRock Health verification service. Required delivery consent and optional updates consent are separate.

No DOI is displayed or embedded until a registered DOI is supplied. Adding a DOI later requires only the publication metadata field; the permanent route does not change.
