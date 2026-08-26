# The SozoRock Foundation parent site

The canonical repository source for `www.sozorockfoundation.org`. The site is a responsive institutional experience deployed to AWS CloudFront from a private, versioned S3 origin.

## Run locally

```bash
npm install
npm run dev
```

Production build and verification:

```bash
npm run build
npm run test:sites
npm run test:aws
```

## Architecture and production source

The site uses React and Vite with a lightweight History API router. The build emits route-specific HTML so copied links, search crawlers, and browser refreshes retain each permanent path. It includes distinct views for Platforms, Publications, Insights, Events, About, Leadership, Partner, Support, Standards, the three platform detail pages, and the three DOI-facing publication routes.

Production hosting is fully defined in `infra/cloudformation/parent-cloudfront.yml`: private S3, CloudFront Origin Access Control, an ACM certificate for apex and `www`, strict response headers, clean-route/redirect logic, IPv4/IPv6 aliases, and a no-cache `/api/*` origin to the established SozoRock Health service. `.github/workflows/deploy-parent-cloudfront.yml` builds and verifies an isolated target, attaches the aliases, changes only the web DNS records, proves Google Workspace MX/TXT records are unchanged, and rolls web DNS back automatically if live checks fail.

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

The Partner and Support forms submit real consent-based inquiries through the established SozoRock Health intake service. Contact replies use `contact@sozorockfoundation.org`. HSA publication access uses the established verification service and sends from `publications@sozorockfoundation.org`; required delivery consent and optional updates consent remain separate. The parent CloudFront distribution exposes both services at same-origin `/api/*` paths without caching requests or responses.

Google Workspace remains the domain's email authority. The AWS deployment never changes MX or TXT records and compares those record sets before and after every DNS cutover.

No DOI is displayed or embedded until a registered DOI is supplied. Adding a DOI later requires only the publication metadata field; the permanent route does not change.
