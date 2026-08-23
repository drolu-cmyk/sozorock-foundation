# SozoRock Foundation global-quality audit

## Verdict

The redesigned parent site now meets the intended institutional standard for this prototype: concise brand entry, current initiative storytelling, clear multi-page routing, editorial content structure, visible governance, and direct engagement paths. The design is distinct from its references while using their strongest structural principles.

## Benchmark synthesis

| Reference | Useful pattern | SozoRock application |
| --- | --- | --- |
| McKinsey Global Institute | One clear mission followed by one prominent research feature | Parent thesis leads directly into a single rotating initiative spread |
| Brookings | Editorial rules, provenance, topics, experts, events, and legal trust signals | Rule-based page layouts, permanent publication records, Standards, Leadership, Events, and grouped legal navigation |
| P&G | A current story carries the first journey and motion is user-controlled | In Focus rotates HSA, Health, and AI Lab with pause/play, tab controls, and reduced-motion support |

The implementation does not copy the typography, layouts, language, or imagery of the references.

## Journey audit

1. **Institutional entry — Excellent.** The first screen answers who SozoRock is, what it builds, and where to go next. The current initiative begins within the first viewport without a generated hero image or inflated proof claim.
2. **Current initiative — Excellent.** HSA, SozoRock Health, and the AI Lab share one premium editorial feature. Real publication and Health assets are used; AI Lab is type-led. The user can pause motion or select a feature directly.
3. **Primary navigation — Excellent.** The header is limited to Work, Ideas, About, Partner, and Support. Dropdowns expose the next level without overloading the top bar and work by click, Enter, and Escape.
4. **Platform discovery — Excellent.** The Platforms overview and three platform pages use short introductions and horizontal editorial rows. They do not rely on repetitive promotional cards.
5. **Ideas and permanent records — Excellent.** Publications, Insights, and Events are separate destinations. All three DOI-facing publication routes remain intact and each route retains its own scope, access path, and caution language.
6. **Partner and Support — Excellent.** Engagement options are presented as scannable rows rather than a brochure grid. Forms are clearly frontend prototypes and do not imply network submission.
7. **Leadership — Excellent.** Leadership has its own page with four approved portraits, titles, and profiles. Dr. Oluwabiyi Adeyemo's title remains Director of Strategic Initiatives.
8. **Standards and legal closure — Excellent.** Standards are a dedicated page. The footer separates Work, Ideas, Foundation, Engage, legal policies, nonprofit status, EIN, and social channels with readable legal text.

## Polish implemented

- Replaced the single-font treatment with Instrument Sans for display/navigation and Source Sans 3 for reading text.
- Reduced homepage hero height from 620 px to 536 px and inner-page heroes from 330 px to 276 px at desktop.
- Introduced a restrained warm editorial paper color for supporting fields while preserving the approved navy and blue identity.
- Rebuilt the initiative area as a white editorial spread with rules, stronger cover presentation, and no gradient.
- Converted Partner and Support option grids into linear editorial lists.
- Corrected dropdown click/keyboard behavior and strengthened its stacking layer.
- Grouped footer links under Work, Ideas, Foundation, and Engage; increased legal text from 11 px to 12 px and raised its contrast.
- Reduced aggressive heading tracking on leadership names and removed obsolete screenshot-related CSS.
- Added an explicit accessible label to the multiline parent thesis.

## Quality evidence

- 16 routes checked in the cloud browser.
- Exactly one `h1` on every route.
- No missing images on any checked route.
- No duplicate IDs on any checked route.
- No horizontal overflow at the audited 1363 × 936 desktop viewport.
- Work menu opens with Enter and closes with Escape.
- Initiative pause control changes to Play; arrow keys move between initiative tabs.
- No site-generated console errors were found. Browser-extension metadata errors were excluded.
- Key contrast ratios: white/navy 16.53:1, ice/navy 12.57:1, ink/white 17.37:1, muted/paper 5.64:1, royal/white 8.09:1, white/cobalt 10.76:1.
- Production build and Sites worker tests pass.

## Preserved constraints

- `/publication/hsa-v1-2026`
- `/publication/rrg-v1-2025`
- `/publication/rebs-v1-2025`
- CB-CAP remains under SozoRock Health.
- HSA is presented as public-interest evidence synthesis and proposed analytical work, not a validated standard or certification.
- No gradient, fake metric, invented partner, fake endorsement, generated hero art, or website screenshot is used as parent-site campaign imagery.

## Remaining validation outside prototype scope

Formal assistive-technology testing, production analytics, live-form delivery, and testing on a representative physical-device matrix should be completed before a production cutover. These are launch-readiness activities, not blockers for the frontend quality pass.
