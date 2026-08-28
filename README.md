# The SozoRock Foundation parent site

The canonical repository source for `www.sozorockfoundation.org` and `sozorockfoundation.org`. The public website runs on AWS CloudFront with a private S3 origin, route-specific crawler HTML, a dynamic React experience, and a same-origin autonomous navigator backed by the Foundation agent control plane. The apex permanently redirects to canonical `www` URLs while preserving paths and queries.

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

CloudFront owns both public hostnames and routes same-origin APIs to bounded origins: contact and verified-publication access go to the established Health service, while `/api/navigator` goes only to the Foundation agent API's public graph. Internal agent routes remain IAM-protected and inaccessible through the distribution. The release workflow verifies the isolated distribution, moves both aliases, updates only web A/AAAA records, preserves Google Workspace MX/TXT records, and rolls back failed cutovers.

The homepage includes a rotating, pausable initiative feature with keyboard-operable tabs and a compact “Ask SozoRock” website guide. The guide uses a routed, read-only agent graph to orient visitors to approved platforms, publications, events, partnership, support, and standards routes. Motion is intentionally restrained and respects `prefers-reduced-motion`.

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

The Partner and Support forms submit real consent-based inquiries through the established SozoRock Health intake service. Contact replies use `contact@sozorockfoundation.org`. HSA publication access uses the established verification service and sends from `publications@sozorockfoundation.org`; required delivery consent and optional updates consent remain separate. CloudFront exposes these services and the website guide at bounded same-origin `/api/*` paths without caching requests or responses.

Google Workspace remains the domain's email authority. The AWS deployment never changes MX or TXT records and compares those record sets before and after every DNS cutover.

No DOI is displayed or embedded until a registered DOI is supplied. Adding a DOI later requires only the publication metadata field; the permanent route does not change.
