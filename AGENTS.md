# SozoRock Parent Site Design Decisions

This repository is the production parent website for The SozoRock Foundation. The September 17, 2026 editorial and conversion system is the current approved direction and supersedes earlier homepage, navigation and campaign language.

## Durable requirements

- Keep the primary navigation compact and stable: What we do, Research, About, Contact. Keep the canonical `/platforms` route unless a separate migration is approved.
- Lock the parent homepage opening to “Evidence should lead somewhere.” Do not replace, rotate or reinterpret this hero headline without an explicit new user instruction.
- The homepage premise is evidence moving into practical use. Connect that premise naturally to health access, cybersecurity experiential learning, public interest research and responsible AI.
- Do not use visible eyebrow labels. Avoid repetitive label, headline, paragraph and CTA templates. Let hierarchy come from typography, whitespace, contrast, evidence and composition.
- Keep public copy concise, specific and natural. Avoid generic consulting language, AI sounding prose, internal planning terms and mechanical process writing. Prefer problem, evidence, response and action.
- Use the approved cobalt, deep navy, royal blue, icy blue, white and supporting gray palette. Do not use green as the parent site color and do not use gradients.
- Use the existing geometric sans serif voice. Do not make serif typography the primary brand voice.
- Do not use generated hero art, generic nonprofit imagery, decorative CSS art, fake dashboards, invented endorsements, partners, funding, events or impact claims.
- Do not use website screenshots as parent site campaign imagery. Prefer real program photography, publication covers, leadership portraits and verified evidence.
- Use real SozoRock publication covers, leadership portraits, Health photography, AI Lab project evidence and verified CB CAP data.
- Keep the parent hero distinct from the SozoRock Health subdomain hero.
- Use MGI for research hierarchy, Brookings for editorial provenance and standards, Gates Foundation for parent brand storytelling, and P&G for purposeful campaign storytelling. Deloitte, Accenture and McKinsey may be used only as quality references for concise problem led, capability led and outcome led communication. Do not copy any reference layout or language or imply affiliation.
- Avoid numbered section labels unless a number is itself verified evidence. Verified data values may be shown when their source and limits are visible.
- Use user controlled motion where motion is material. Respect prefers reduced motion.
- Preserve `/publication/hsa-v1-2026`, `/publication/rrg-v1-2025` and `/publication/rebs-v1-2025` as individual publication routes.
- Keep research pages oriented around why the research exists, who can use it, what decision it can inform, its evidence limits and a clear access or engagement path. Do not reduce publications to catalog records.
- Present cybersecurity experiential learning as a recurring Capella University collaboration in which graduate cybersecurity learners move from instruction into six months of applied work. Keep verified capability language such as identity and access management, GRC, cloud security, risk, least privilege and evidence assurance. Capella retains academic ownership, oversight and grading. Do not imply endorsement.
- The direct primary care health access pilot is planned for 2027, not 2026. Explain why the first cohort is 25 people: to test the nonclinical pathway, identify failure points and improve the model before expansion.
- The health access story may use the verified 2025 Western New York preplanning roundtable and REBS evidence. The reported figure of more than 12,000 residents per primary care clinician must remain visibly attributed as participant reported context. Do not publish wait time, travel duration or similar figures until their exact source is verified.
- Show CB CAP as a peer product alongside Health, Global Institute and AI Lab only where that architecture remains accurate. Its redesign is a separate assignment.
- Do not describe Health Systems Assurance as validated, certified, proven, adopted or a standard. Present its constructs as proposed analytical tools and a research agenda.
- Include the existing leadership team with approved portraits, titles and profiles. Do not refer to Dr. Oluwabiyi Adeyemo as founder. Keep the Foundation specific title currently approved in the repository unless the user explicitly changes it.
- Build real pages for Home, What we do, Research, Insights, Events, About, Partner, Support, Standards, platform overviews and publication landing pages.
- Keep the parent homepage broader than publications. Use a natural story from premise to evidence to current work to proof to engagement. Avoid brochure and textbook layouts.
- Prefer editorial fields, asymmetric hierarchy, strong whitespace and real evidence over boxed card grids. Keep the legal footer compact and keep Partner and Support separate from legal policy links.
- The footer must identify The SozoRock Foundation, Inc. as a 501(c)(3) public charity and include the verified EIN. Keep legal links concise: Privacy, Terms, Accessibility, Nondiscrimination and Standards.
- Keep rural health and rural equity visible as important areas of focus, but never describe the Foundation's overall mission as rural only. Parent positioning must also cover health access, cybersecurity experiential learning, public interest research, governance, community evidence, participation and responsible AI.
- Describe roundtables, participation, partnerships, funding, cataloging and library holdings precisely. Do not turn participation or cataloging into endorsement, implementation, adoption or a continuing institutional commitment.
- Participant reported figures may be displayed only with visible attribution and limits. Do not restate them as independently estimated statistics or achieved outcomes.
- AI and Society should explain the public output, participation pathway, institutional response pathway and what support enables. Do not name prospective funders, technology providers or partners unless the relationship is verified and approved for publication.
- Legal and policy pages must use direct institutional language, preserve platform boundaries and avoid promises of certification, absolute security, uninterrupted service or support that has not been arranged.
- Do not expose internal release labels, prompts, TODOs, technical debt, maintenance notes, implementation plans or other internal workflow language in public facing content or metadata.

## Interaction requirements

- Primary navigation uses direct links. Mobile navigation must open and close reliably, lock background scroll, close on route change, support Escape, preserve keyboard focus and remain usable across common phone and tablet widths.
- Escape closes open menus and dialogs. All core interactions must work by keyboard.
- Publication access forms are production flows. They must use the established SozoRock Health verification service, require only delivery essentials, keep readership profiling and marketing consent optional, avoid health or medical information, and never expose publication file URLs before verification.
- Publication access validation must reject placeholder or repeated character names. Optional readership fields must remain valid when supplied. The parent worker must identify the established Health publication access page as the trusted service origin when forwarding a verified request.
- The experience must work at desktop, tablet and mobile widths, including 320, 375, 390, 430, 768, 1024, 1280 and 1440 pixel review widths where practical.
- CTA groups within a shared hero must use consistent control treatment and align on the same visual baseline.

## Production runtime

Run the local server and open the preview in the available browser. Build app UI in `src/`. Preserve the Sites runtime contract in `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs` and `tests/sites-worker.test.mjs`. Before handoff, run `npm run build` and `npm run test:sites`.

Deploy through the existing AWS CloudFront workflow after `npm run test:aws` and production build browser QA. Preserve the two Crossref DOI landing URLs and records. Never deploy mail or DNS credentials in client files. Publication delivery must be verified before claiming the release complete. Do not redesign Health, Place Intelligence or other subdomains in this parent site assignment.
