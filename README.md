# SozoRock Foundation Parent Website

This private repository is dedicated to the SozoRock Foundation parent website.

- Current hosted site: https://sozorock-foundation.the-sozorock-4854.chatgpt.site/
- Canonical production domain: https://www.sozorockfoundation.org
- Scope: parent website source, documentation, and infrastructure automation only
- Excluded: SozoRock AI Lab and every other SozoRock project or subdomain

## Domain cutover

The production DNS workflow is intentionally limited to these records:

| Type | Name | Value |
| --- | --- | --- |
| CNAME | `www` | `custom-domains.chatgpt.site` |
| TXT | `_openai-site-verification.www` | `openai-site-verification=uRWqqC2NjJmoTR2EyEqF9JyNpVBzzmx61U0re5JhBjk` |
| TXT | `_cf-custom-hostname.www` | `a3a592c6-be9a-4592-90d6-dd20c2e1af6d` |

The workflow does not change the apex domain, MX records, nameservers, email records, or other subdomains.
