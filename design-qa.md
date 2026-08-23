# SozoRock Foundation design QA

## Comparison target

- McKinsey Global Institute: `https://www.mckinsey.com/mgi/overview`
- Brookings: `https://www.brookings.edu/`
- P&G US: `https://us.pg.com/`
- SozoRock AGENTS.md requirements and the user's supplied defect screenshots

All live reference and implementation captures were reviewed together at the same 1363 × 936 browser viewport. The comparison focused on information hierarchy, editorial rhythm, current-story prominence, motion control, navigation density, typography, neutral background treatment, and footer/legal organization.

## Initial issues

- The 620 px parent hero delayed the current initiative and created unnecessary dead space.
- Inner-page 330 px title fields made the site feel templated and slow.
- Instrument Sans across every text role flattened hierarchy and reduced long-copy readability.
- The cool gray paper color felt closer to a generic product interface than an institutional editorial surface.
- The initiative feature used a solid color block that read more like a card than a premium editorial campaign.
- Partner and Support routes formed brochure-like grids.
- Dropdown behavior could close during pointer activation.
- Legal text was 11 px with low contrast and footer links were not semantically grouped.
- The AI Lab article and its visual panel shared the same class name, turning the full feature navy and suppressing the copy contrast.
- Leadership names inherited display tracking that was too tight for credentials.
- Obsolete screenshot-related selectors remained in the style sheet.

## Final implementation

- Compact top navigation: Work, Ideas, About, Partner, Support.
- Click and keyboard dropdown activation with Escape dismissal.
- Instrument Sans display system paired with Source Sans 3 body text.
- Approved navy/cobalt/royal palette with warm paper `#f3f1ed`; no gradients.
- 536 px homepage hero and 276 px desktop inner-page title field.
- Premium white initiative spread with real HSA cover, real Health photography, and type-led AI Lab treatment.
- AI Lab copy now remains on the same white editorial surface as the other initiatives, with navy confined to the signal panel.
- Rule-based platform, partner, support, standards, insight, and event layouts.
- Grouped institutional footer with U.S. Section 501(c)(3), EIN, deductibility, copyright, and SozoRock® licensing language.
- LinkedIn was replaced by X in the social navigation.
- Separate Leadership page with four profiles and exact approved Dr. Oluwabiyi Adeyemo title.
- Preserved DOI landing routes and cautious HSA framing.
- Completed the HSA permanent record with confirmed ISBN, edition, publisher, publication place, evidence cutoff, 42-page PDF, suggested citation, BibTeX, RIS, copyright, limitations, and related Volume 1 records. No DOI is displayed or emitted until one is supplied.

## Fidelity and interaction checks

- Fonts load in browser and computed styles confirm the two-family hierarchy.
- Key color combinations exceed WCAG AA contrast for their intended text sizes.
- Motion has pause/play, direct tab selection, arrow-key movement, and reduced-motion support.
- Computed browser styles confirm navy text on the AI Lab copy panel and white text on the navy signal panel.
- The HSA record has one `h1`, no duplicate IDs, no broken images, no horizontal overflow, working citation copying, a canonical URL, citation metadata, JSON-LD report metadata, and no `citation_doi` field.
- The packaged PDF matches the supplied publication byte-for-byte; PDF, BibTeX, and RIS files are present in the production build.
- Work menu opens with Enter and closes with Escape.
- 16 routes have one `h1`, no duplicate IDs, no missing images, and no desktop horizontal overflow.
- Build and Sites worker tests pass.
- No site-generated console error was observed.

## Final result

passed
