# SozoRock Parent Site Design Decisions

This repository is the production parent website for The SozoRock Foundation. The October 21, 2026 Access, Capacity and Trust direction and the October 22, 2026 page designs, approved by the user, are the current direction and supersede every earlier homepage, navigation, campaign, page and footer rule in this file or elsewhere in the repository.

## October 22, 2026 design system (current)

- No rules, dividers or hairlines. Sections separate by color fields (white, light blue #EFF5FF, navy, royal, cobalt) and space. The only lines are form field underlines.
- Every page opens with the same hero composition as the homepage: bold headline left, one panel right (a photo, covers, portraits, one large number or the Access, Capacity, Trust panel).
- Section statements use regular weight at 40 to 48 px with a short section label above them. Data is shown as one large number, one thin rounded bar and a visible source.
- Tiles are solid light blue, white or brand blue with a round arrow button. Buttons are pills.
- The Briefing sits on a light blue band, followed by a clean white footer. No cream or warm neutrals anywhere.
- Health Access covers the Health Equity Initiative (Library, Community and Home Health Equity Hubs, Health Access Day) and the Primary Care Access Program, framed as removing barriers: cost, distance, technology, health information and trust.
- Our Work shows who leads each program: Nike Oye (health partnerships), Jordan Hare (health education), Dr. Oluwabiyi Adeyemo (Workforce Capacity and AI & Society), Anthony Abraham (global affairs).
- Retired routes redirect permanently: /platforms/applied-learning to /workforce, /platforms/institute and /insights to /publications.
- Page components live in src/site/. Styles live in src/site-2026.css.

## Durable requirements

- Primary navigation: Our Work (`/platforms`), Research (`/publications`), Events (`/events`) and About (`/about`), with Subscribe and a quiet Support action at the right. Partner, Contact, Standards and legal pages live in the footer. Keep the canonical `/platforms` route.
- The homepage opening is “Healthier communities. Stronger systems. A say in what’s next.” with the line “We open doors to primary care, build the people who run and protect health systems, and give communities a voice on AI.” Primary action: Explore our work. Secondary action: Partner with us. Do not replace it without an explicit new user instruction.
- The Foundation story is one loop, Listen, Study, Build, Prove, closing three gaps: Access (Health Access, SozoRock Health), Capacity (Workforce Capacity, which leads cybersecurity, cloud, governance and AI learning) and Trust (AI & Society, research and assurance). Every page shows where it sits in that story.
- Write broadly so the work can grow beyond one state. Name New York State only for facts, places and data, and always write “New York State” after Albany, the Capital Region or a county name.
- Follow McKinsey and Brookings for hierarchy and restraint: a finding stated as a headline, one chart per point, few words, one main action per section, secondary actions as text links.
- Short section labels above statements are part of the approved design. Avoid repetitive headline, paragraph and CTA templates. Let hierarchy come from typography, whitespace, contrast, evidence and composition.
- Never write the word “Proposed” in public copy. Do not use dashes as punctuation in public copy.
- Buttons are rounded pills, never square boxes. Form fields use a label above a single underline, never boxed fields.
- Keep public copy concise, specific and natural. Avoid generic consulting language, AI sounding prose, internal planning terms and mechanical process writing. Prefer problem, evidence, response and action.
- Use only the approved cobalt, deep navy, royal blue, icy blue, white and supporting gray palette. No orange, no green, no gradients and no AI looking glows or patterns.
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
- Name: Primary Care Access Program, part of the SozoRock Health Equity Initiative.
- Starts January 2027. Each participant gets 12 months of support.
- Up to 25 New Yorkers, one per household. Always write "up to 25" when describing cohort size.
- Eligibility: aged 64 or younger, financial need, and a chronic condition such as diabetes or high blood pressure. Open to residents of any of New York's 62 counties.
- Services: sponsored direct primary care membership with Dr. Michael Purcell and Purcell Integrative Osteopathic Care, ongoing telehealth, help with transportation, and health access education. Written consent covers naming Dr. Purcell and Purcell Integrative Osteopathic Care.
- Always write Purcell Integrative Osteopathic Care in full; do not abbreviate the practice name.
- Clinical care remains with the licensed provider. Membership is not health insurance.
- Why the first cohort is small: to show where the pathway works, where it fails and what should change before expansion.
- First-cohort budget: $108,000, about $4,320 per participant for a full year. This covers the membership, telehealth, transportation help, health access education, coordination and reporting.
- Sponsorship levels: Community $5,000, Access $10,000, Principal $25,000, Lead $50,000. Other amounts are welcome.
- Funds are confirmed before anyone enrolls. Sponsors receive reports at months 3, 6, 9 and 12. Renewal is optional for sponsors. Sponsors do not select participants or influence clinical care.
- The Fireside and the Working Roundtable are a planned series. Upcoming events may show a working title, format and region with “Date to be announced” and a Register interest action. Do not publish dates, participants or partner organizations until confirmed, and do not name prospective partners such as companies being pitched.
- The health access story may use the verified 2025 Western New York preplanning roundtable and REBS evidence. The reported figure of more than 12,000 residents per primary care clinician must remain visibly attributed as participant reported context. Do not publish wait time, travel duration or similar figures until their exact source is verified.
- Show CB CAP as a peer product alongside Health, Global Institute and AI Lab only where that architecture remains accurate. Its redesign is a separate assignment.
- Do not describe Health Systems Assurance as validated, certified, proven, adopted or a standard. Present its constructs as proposed analytical tools and a research agenda.
- Include the existing leadership team with approved portraits, titles and profiles. Do not refer to Dr. Oluwabiyi Adeyemo as founder. Keep the Foundation specific title currently approved in the repository unless the user explicitly changes it.
- Build real pages for Home, What we do, Research, Insights, Events, About, Partner, Support, Standards, platform overviews and publication landing pages.
- Keep the parent homepage broader than publications. Use a natural story from premise to evidence to current work to proof to engagement. Avoid brochure and textbook layouts.
- Prefer editorial fields, asymmetric hierarchy, strong whitespace and real evidence over boxed card grids. Keep the legal footer compact and keep Partner and Support separate from legal policy links.
- The footer must identify The SozoRock Foundation, Inc. as a 501(c)(3) public charity and include the verified EIN. Keep legal links concise: Privacy, Terms, Accessibility, Nondiscrimination and Standards.
- The footer follows Brookings and McKinsey on a clean white field: wordmark, one mission line and Support our work on the left; three link columns (Our Work, Research & Events, About); a slim legal line with Privacy Policy, Terms of Use, Accessibility, Nondiscrimination, Standards, copyright and EIN 39-4736725.
- Show the three authentic publication covers at legible size in Research and insights, using the full resolution cover files. Label each as series name, then “Volume 1 · year”. Rethinking Rural Governance belongs to the Modernization and Resilience Program.
- Present Workforce Capacity broadly: hands on learning in cloud computing (AWS), cloud security, identity and access management, governance, risk and compliance, and AI. Capella University: recurring six month graduate model, six learners October 2025 to March 2026 and five learners April to September 2026. Athabasca University, Alberta, Canada: one undergraduate in work integrated learning, February to July 2026, building a security framework for community health sites; keep this informational and do not publish grades or name the learner without consent. Dr. Oluwabiyi Adeyemo, Director of Strategic Initiatives, designs, mentors and evaluates the work. Use partner names as text; show logos only with written permission.
- SozoRock AI Lab is free community AI learning for any background, Tuesdays at 6:30 pm in the community room of Beacon Bank, Albany, New York State. Registration happens on ai-lab.sozorockfoundation.org, so AI Lab actions link there.
- AI & Society is framed as building public trust in AI, with Who Decides? forums on AI in learning, work and health.
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
