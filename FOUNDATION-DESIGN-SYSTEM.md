# Foundation design system

VERIFIED: implemented in src/foundation-system.css, extending the existing shared stylesheet. Production-build QA is recorded separately. This file describes the implementation awaiting release.

## Typography

Instrument Sans Variable is the display, body and interface family; fallback Helvetica Neue, Arial, sans-serif. Version 5.3.0 is pinned through @fontsource-variable/instrument-sans. Files: instrument-sans-latin-wght-normal.woff2 (30.09 kB) and latin-ext (11.14 kB), emitted with hashed names. SIL Open Font License is distributed at /licenses/instrument-sans-OFL.txt. Variable range supports weights 400–700. Headlines use 650, subheadings 600, navigation 600; body uses 400. Font-display swap and Unicode subsets avoid remote Google Fonts requests.

| Token | Desktop >=1200 | Tablet 600–1199 | Mobile <=599 |
|---|---:|---:|---:|
| Opening display | clamp(76px,6.55vw,108px) | 76px; 64px below 900 | clamp(42px,10.5vw,60px) |
| H1 | 72px | 58px | 42px |
| H2 | 42px | 36px | 32px |
| H3 | 28px | 26px | 25px |
| H4 | 23px | 22px | 21px |
| H5 | 20px | 20px | 19px |
| H6 | 18px | 18px | 17px |
| Body | 17px | 17px | 16px |
| Navigation | 17px | 17px | 17px; 16px menu toggle |
| Button | 16px | 16px | 16px |
| Caption/small | 14px | 14px | 14px |

Line heights: opening .98; H1 1.04; H2 1.12; H3 1.2; H4 1.25; H5 1.3; H6 1.35; body 1.6. Opening/H1 tracking -.045em, H2 -.035em; eyebrow .065em. Body maximum 66ch, standard H1 maximum 15ch; opening description 25ch desktop and 38ch on tablet and 29ch on mobile. Legal copy 66ch at 17px/1.7. Publication titles use their own compact cover/title composition on mobile (34px); compact legal headings clamp(28px,8vw,38px). These are documented page-role variants, not a second type system.

## Colors

| Token | HEX | Use |
|---|---|---|
| ink/navy | #071D3B | Primary text, institutional dark |
| navy-2 | #102E55 | Supporting dark |
| cobalt/royal | #0644AD | Opening, links, primary actions |
| blue | #0753C7 | Supporting interaction |
| white | #FFFFFF | Page and footer |
| muted | #44546A | Supporting copy |
| pale | #EFF5FF | Engagement and page openings |
| ice | #DCEAFF | Supporting blue surface |
| paper | #F5F7FA | Forms and neutral surfaces |
| paper-deep | #EDF1F6 | Secondary neutral surface |
| line | #CED7E3 | Required dividers |
| focus | #B84500 | Three-pixel visible focus ring, five-pixel offset |
| error | #AD2332 | Field and service errors |
| success | #185C47 | Successful states |

Links darken to navy on hover; white focus rings are used on cobalt. The footer is white with navy text and cobalt links. There is no automatic background video or decorative animation; arrow transitions last 180ms and stop under reduced motion. No new film or Blender asset is part of this release.

## Layout

Desktop content width is min(1440px,100% - 144px), with 72px minimum side margins. Tablet uses 40px margins; mobile uses 20px. Primary breakpoints: 1200, 900 and 600 CSS pixels. Section spacing: 88px desktop, 64px tablet, 48px mobile. Body rhythm is primarily 4/8px increments with specific editorial spacing documented in the stylesheet.

Opening: flexible headline plus 290px description, 44px gap. Work: 125px section label, 1.3fr initiative field, 1fr publication field, 32px gaps. Desktop initiative summaries sit beside names; the expanded description spans the work field. Below 1200 the label moves above; below 900 publication content follows the interactive work list. Mobile publication feature pairs its text with a 125px cover, instead of shrinking the desktop composition.

Actual HSA cover aspect ratio is 600:780. Publication list covers use 220px columns desktop and 100px mobile, preserving image content. Buttons are at least 48px high; navigation and editorial links at least 44px. Forms use square corners and visible errors. Mobile navigation is a controlled disclosure with Escape and focus return.

## Assets and identity

The real publication covers and approved leadership portraits are retained. Parent social artwork: /media/foundation-editorial-social.png, 1731 x 909 pixels. Publication-specific social cards remain 1200 x 630. Existing SR ICO/PNG/Apple-touch assets are retained as the coherent hostname favicon system; manifest colors are updated. No separate Google favicon is claimed for a path.

## Release boundary

The visual implementation has passed local design and route checks. Google SMTP authentication, actual inbox delivery, SPF/DKIM/DMARC message alignment, verified publication download and final production acceptance remain mandatory before marking Prompt 2 complete. Existing Crossref DOI records and landing URLs remain unchanged.
