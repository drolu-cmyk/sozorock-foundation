# SozoRock Foundation SEO and discovery launch audit

Date: August 23, 2026  
Canonical production host: `https://www.sozorockfoundation.org`

## Implemented technical foundation

- Permanent `308` redirect from the apex host to the canonical `www` host, preserving every path and query string.
- Route-specific prebuilt HTML for every permanent route, instead of serving homepage metadata to every crawler.
- Unique page titles, concise descriptions, canonical URLs, robots directives, Open Graph tags, and X card tags.
- Branded 1200 × 630 social cards for the Foundation and all three publication records.
- SVG, ICO, Apple touch, 192-pixel, and 512-pixel favicon/app icons.
- Schema.org JSON-LD graph for the NGO, WebSite, WebPage, breadcrumbs, leadership, and publication Reports.
- The Foundation's U.S. Section 501(c)(3) nonprofit status and EIN represented in visible legal copy and organization schema.
- Scholarly citation meta tags for publication records; HSA is DOI-ready but contains no DOI until the registered identifier is supplied.
- XML sitemap containing all public canonical records and excluding the gated publication-access form.
- `robots.txt` allowing Google, Bing, and other standard crawlers, explicitly allowing `OAI-SearchBot`, and separating ChatGPT search discovery from GPT training access.
- A true HTTP `404` and `noindex` response for unknown URLs, preventing soft-404 indexing.
- HTML and HTTP `noindex` controls for the verified-access form.
- Permanent redirects for the retired AWS clone paths and trailing-slash normalization.
- Dedicated Privacy, Accessibility, Nondiscrimination, and Terms pages linked from the legal footer.
- Consistent verified social identity across footer, X card metadata, and Organization schema.

## Search intent map

Search intent is expressed through visible headings, titles, descriptions, internal links, and structured data. A `meta keywords` tag is intentionally not used because Google ignores it.

| Canonical route | Primary search intent |
|---|---|
| `/` | The SozoRock Foundation; health access; public systems; responsible applied AI |
| `/platforms` | SozoRock platforms; health access; research; applied learning |
| `/platforms/institute` | public-interest research; systems intelligence; institutional convening |
| `/platforms/health` | health access; place intelligence; community evidence; rural health access |
| `/platforms/ai-lab` | responsible applied AI; practical AI learning; human judgment |
| `/publications` | SozoRock publications; health systems assurance; rural governance; rural equity |
| `/publication/hsa-v1-2026` | health systems assurance; evidence-based digital assurance; trustworthy health systems |
| `/publication/rrg-v1-2025` | rural governance framework; coordinated local systems |
| `/publication/rebs-v1-2025` | rural health equity; community health access models |
| `/insights` | health access insights; systems intelligence; applied AI field updates |
| `/events` | policy firesides; institutional roundtables; evidence briefings |
| `/about` | SozoRock Foundation mission and institutional model |
| `/leadership` | SozoRock Foundation leadership |
| `/standards` | publication independence; corrections; funding and AI-use standards |
| `/privacy` | SozoRock Foundation privacy notice and data choices |
| `/accessibility` | digital accessibility and accommodation |
| `/nondiscrimination` | equal access and nondiscrimination policy |
| `/terms` | website and publication-use terms |

## Indexing and ranking operations

The site is technically eligible for discovery, but search engines control indexing and ranking. After both domains resolve correctly:

- Verify a domain property for `sozorockfoundation.org` in Google Search Console.
- Submit `https://www.sozorockfoundation.org/sitemap.xml` and request indexing for the homepage, platform pages, and three publication records.
- Add the same sitemap to Bing Webmaster Tools for Bing and Copilot discovery.
- Monitor coverage, crawl errors, Core Web Vitals, branded queries, non-branded impressions, links, and publication-query performance.
- Earn authoritative citations and links from partner institutions, libraries, universities, public agencies, publication catalogs, and event hosts.
- Publish substantive, dated, source-traceable insight and event records; technical tags cannot substitute for useful current content.
- Add each confirmed Crossref DOI to the visible record, citation tags, Report schema, sitemap, and DOI destination without changing the permanent route.

## Validation gate

The release's automated checks cover canonical-host redirect behavior, permanent route delivery, route-specific metadata, valid JSON-LD, sitemap completeness, crawler controls, social assets, true 404s, legacy redirects, publication file gates, form validation, and the publication-access and contact-service contracts.
