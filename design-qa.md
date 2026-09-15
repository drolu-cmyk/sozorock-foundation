# Foundation editorial release — visual QA

Date: September 15, 2026

Source visual truth: https://www.sozorockfoundation.org/ before deployment, commit d1914c56d4b345b21bc59dbcea1a52a6e83690b9.
Implementation: production build served at http://terminal.local:4173/ using the existing worker and prebuilt route HTML. Preview-only API isolation returned 503 and never forwarded submissions.

## Evidence and comparison

The source homepage and production-build homepage were captured together in one browser comparison output, at 1348 × 926 pixels, same route and initial state. Both captures used the same browser density; no scaling or density normalization was applied. Browser-rendered screenshots are retained in the work-session transcript. No screenshot file paths were exposed by the browser capture tool.

The comparison preserved Instrument Sans, the cobalt hero, white/navy text, logo, navigation, margins, column proportions, health accordion and HSA feature image. The changed introduction and AI & Society reference are intentional content changes. At this viewport all important header and hero details were readable, so a separate crop was unnecessary.

Additional browser-rendered evidence: /publications desktop screenshot and DOM link inspection; /leadership full-page screenshot; /events full-page screenshot; /ai-society hero and selected Work scenario screenshots. A preview-only 390 × 844 CSS-pixel iframe showed the actual responsive AI & Society and Publications pages at 1:1 scale inside the desktop browser. This checks narrow layout, not physical mobile hardware.

## Fidelity surfaces

- Typography: existing family, weights and hero system retained. New publication headings and six-question controls use the same typographic language.
- Spacing/layout: homepage unchanged; publications intentionally use unboxed bibliographic rows. Events retain the existing shell and split-copy layout. AI questions use a two-column scenario/accordion composition that stacks on narrow screens.
- Colors/tokens: existing cobalt, navy, ice and white; no gradients, new brand colors or generic AI imagery.
- Images: original portraits and homepage cover retained. Covers intentionally removed from the publication index as requested; individual publication records retain their source assets.
- Copy: rural-health focus clear; Who Decides?, Firesides and Roundtables marked as developing/proposed. No prospective partners, dates, speakers or outcomes added. Director copy stays within documented roles and published authorship.

## Interactions and release checks

- Learning/Work switch updates the illustrative scenario and all question prompts; selected state exposed with aria-pressed.
- Participation disclosure opens the labeled consent-based form. A filled synthetic submission to the isolated preview reports delivery failure instead of claiming success.
- DOI links visually/DOM verified against their series; both DOI resolver URLs returned HTTP 200 to the correct permanent Foundation record.
- 47 automated tests pass, including participant forwarding to a mocked existing service, exact DOI/route/delivery mappings, no Event schema for proposals, existing publication-verification and SEO checks.
- Production build and AWS release contract pass.
- Browser error logs checked: extension metadata errors were observed; the isolated form's expected 503 is intentional. No application render error was observed.
- No live email was sent. End-to-end inbox receipt is not claimed.

## Findings and comparison history

No actionable P0/P1/P2 visual differences found in the matched homepage comparison. The new page compositions are intentional, scoped editorial changes. Narrow-screen date/volume separation was retained before final publication capture. No global design or navigation changes were made.

Final result: passed
