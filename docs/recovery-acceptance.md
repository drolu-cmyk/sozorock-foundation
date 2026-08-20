# Approved parent-site recovery acceptance manifest

Source of truth: the approved ChatGPT Sites deployment for The SozoRock Foundation, the final browser captures, and the final design/global-quality QA records completed in August 2026.

## Release boundary

- Parent website only: `www.sozorockfoundation.org`.
- Do not change the apex domain, mail, nameservers, or any unrelated subdomain.
- Do not change code in any SozoRock subdomain repository.
- Publication access/email-verification behavior is outside this recovery.

## Required parent-site identity

- The SozoRock Foundation
- Access. Assurance. Intelligence.
- We build platforms for better health and public systems.

## Primary navigation

- Work
- Ideas
- About
- Partner
- Support

## Required route contract

1. `/`
2. `/work`
3. `/work/global-institute`
4. `/work/health`
5. `/work/ai-lab`
6. `/publications`
7. `/insights`
8. `/events`
9. `/about`
10. `/leadership`
11. `/partner`
12. `/support`
13. `/standards`
14. `/publication/hsa-v1-2026`
15. `/publication/rrg-v1-2025`
16. `/publication/rebs-v1-2025`

## Preserved publication paths

- `/publication/hsa-v1-2026`
- `/publication/rrg-v1-2025`
- `/publication/rebs-v1-2025`

## Visual contract

- Instrument Sans for display/navigation.
- Source Sans 3 for reading text.
- Flat navy/cobalt/royal/ice/white palette with warm paper `#f3f1ed`.
- No gradients.
- Homepage hero height: 536 px at desktop.
- Inner-page title field: 276 px at desktop.
- Editorial rules and horizontal rows rather than repetitive promotional cards.
- HSA, SozoRock Health, and SozoRock AI Lab share the user-controlled In Focus feature.
- AI Lab copy remains on white; navy is confined to the signal panel.

## Interaction contract

- Work/Ideas/About menus open by click and keyboard.
- Escape closes an open menu.
- In Focus supports Pause/Play, direct tab selection, left/right arrow navigation, and reduced-motion behavior.

## Institutional closure

- Footer groups Work, Ideas, Foundation, Engage.
- Footer includes 2026 copyright, Section 501(c)(3), EIN 39-4736725, deductibility language, and SozoRock trademark licensing statement.
- X and YouTube are the social channels.
- Standards, Accessibility, Privacy, and Nondiscrimination are visible legal routes/anchors.

## Static QA gates

- Exactly one `h1` per generated route.
- No duplicate `id` values per route.
- No missing local assets.
- Required publication routes build successfully.
- All internal href destinations in the route manifest resolve.
