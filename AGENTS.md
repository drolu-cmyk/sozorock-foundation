# SozoRock Parent Site Design Decisions

This prototype is the redesigned parent website for The SozoRock Foundation.

## Durable requirements

- Keep desktop navigation compact: Work, Ideas, About. Work contains the three platforms; Ideas contains Publications, Insights, and Events; About contains Mission, Leadership, Standards, and Contact. Place Partner and Support on the right.
- Keep the parent thesis: “Access. Assurance. Intelligence.” and “We build platforms for better health and public systems.”
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
- CB-CAP is part of SozoRock Health, not a peer platform.
- Do not describe Health Systems Assurance as validated, certified, proven, adopted, or a standard. Present its constructs as proposed analytical tools and a research agenda.
- Include the existing leadership team with approved portraits, titles, and profiles. Do not refer to Dr. Oluwabiyi Adeyemo as founder. Keep his existing title, “Director of Strategic Initiatives,” and add only “Dr.” to his name.
- Build real pages for Home, Platforms, Publications, Insights, Events, About, Partner, Support, Standards, platform overviews, and DOI landing pages.
- Keep the parent homepage broader than publications. Use four clear functions: institutional identity, current initiative, operating platforms, and engagement.
- Prefer editorial fields, horizontal rules, and asymmetric hierarchy over boxed card grids. Keep the legal footer compact and align the logo to the same optical center as the navigation.

## Interaction requirements

- Desktop navigation uses accessible dropdowns. Mobile navigation uses accessible accordions.
- Escape closes open menus and dialogs. All core interactions must work by keyboard.
- Publication-access forms are production flows. They must use the established SozoRock Health verification service, keep marketing consent optional, avoid health or medical information, and never expose publication-file URLs before verification.
- Publication-access validation must reject placeholder names, repeated-character entries, and low-information reasons on both the client and server. The parent worker must identify the established Health publication-access page as the trusted service origin when forwarding a verified request.
- The experience must work at desktop, tablet, and mobile widths.

## Prototype runtime

Run the local server and open the preview in the available browser. Build app UI in `src/`. Preserve the Sites runtime contract in `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs`. Before handoff, run `npm run build` and `npm run test:sites`.
