# SozoRock Parent Site Design Decisions

This repository is the production parent website for The SozoRock Foundation. The approved September 7, 2026 system supersedes earlier visual and navigation decisions.

## Durable requirements

- Keep navigation compact: Work, Research, About, Contact. Use direct links and an accessible mobile menu.
- Keep the approved homepage opening: “Public ideas. Practical systems.” and thesis “Access. Assurance. Intelligence.”
- Use the approved cobalt, deep navy, royal blue, icy blue, white, and supporting gray palette. Do not use green as the parent-site color and do not use gradients.
- Use a rounded geometric sans-serif voice. Do not make serif typography the primary brand voice.
- Do not use generated hero art, generic nonprofit imagery, decorative CSS art, fake dashboards, invented endorsements, partners, funding, events, or impact claims.
- Do not use website screenshots as parent-site campaign imagery. Prefer real program photography, publication covers, or restrained type-led initiative fields.
- Use real SozoRock publication covers, leadership portraits, Health photography, AI Lab project evidence, and verified CB-CAP data.
- Keep the parent hero distinct from the SozoRock Health subdomain hero.
- Use MGI for research hierarchy, Brookings for editorial provenance and standards, Gates Foundation for parent-brand storytelling, and P&G for purposeful campaign motion. Do not copy any reference layout or language.
- Avoid numbered section labels. Verified data values may be shown when their source and limits are visible.
- Use user-controlled motion with a visible pause control. Respect prefers-reduced-motion.
- Preserve `/publication/hsa-v1-2026`, `/publication/rrg-v1-2025`, and `/publication/rebs-v1-2025` as individual publication routes.
- Show CB-CAP as a peer product alongside Health, Global Institute, and AI Lab. Its redesign is a separate assignment.
- Do not describe Health Systems Assurance as validated, certified, proven, adopted, or a standard. Present its constructs as proposed analytical tools and a research agenda.
- Include the existing leadership team with approved portraits, titles, and profiles. Do not refer to Dr. Oluwabiyi Adeyemo as founder. Keep his existing title, “Director of Strategic Initiatives,” and add only “Dr.” to his name.
- Build real pages for Home, Platforms, Publications, Insights, Events, About, Partner, Support, Standards, platform overviews, and DOI landing pages.
- Keep the parent homepage broader than publications. Use four clear functions: institutional identity, current initiative, operating platforms, and engagement.
- Prefer editorial fields, horizontal rules, and asymmetric hierarchy over boxed card grids. Keep the legal footer compact and align the logo to the same optical center as the navigation.
- Keep rural health and rural equity visible as important areas of focus, but never describe the Foundation's overall mission as rural-only. Parent positioning must also cover health access, public systems, governance, systems assurance, community evidence, participation and practical AI learning.
- Describe roundtables, participation, partnerships, funding, cataloging and library holdings precisely. Do not turn participation or cataloging into endorsement, implementation, adoption or a continuing institutional commitment.
- Participant-reported figures may be displayed only with visible attribution and limits. Do not restate them as independently estimated statistics or achieved outcomes.
- AI & Society should explain the public output, participation pathway, institutional-response pathway and what support enables. Do not name prospective funders, technology providers or partners unless the relationship is verified and approved for publication.
- Legal and policy pages must use direct institutional language, preserve platform boundaries and avoid promises of certification, absolute security, uninterrupted service or support that has not been arranged.

## Interaction requirements

- Primary navigation uses direct links. The homepage initiative list supports keyboard-operated disclosure; mobile navigation supports Escape and returns focus to its toggle.
- Escape closes open menus and dialogs. All core interactions must work by keyboard.
- Publication-access forms are production flows. They must use the established SozoRock Health verification service, require only delivery essentials, keep readership profiling and marketing consent optional, avoid health or medical information, and never expose publication-file URLs before verification.
- Publication-access validation must reject placeholder or repeated-character names. Optional readership fields must remain valid when supplied. The parent worker must identify the established Health publication-access page as the trusted service origin when forwarding a verified request.
- The experience must work at desktop, tablet, and mobile widths.
- CTA groups within a shared hero must use the same control treatment and align on the same visual baseline.

## Production runtime

Run the local server and open the preview in the available browser. Build app UI in `src/`. Preserve the Sites runtime contract in `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs`. Before handoff, run `npm run build` and `npm run test:sites`.

Deploy through the existing AWS CloudFront workflow after `npm run test:aws` and production-build browser QA. Preserve the two Crossref DOI landing URLs and records. Never deploy mail or DNS credentials in client files. Publication delivery must be verified before claiming the release complete. Do not redesign Health, Place Intelligence, or other subdomains in this parent-site assignment.
