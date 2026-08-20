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

## AWS authorization

The workflow uses the dedicated `GitHubActionsSozorockFoundationDnsRole`. Its least-privilege CloudFormation definition is stored at `infra/cloudformation/github-actions-dns-role.yml`.

The role trusts only the `main` branch of this repository and may change only the three parent-domain records listed above. Creating or repairing the role is the one-time AWS bootstrap required before the workflow can complete.

An AWS administrator in account `791860731989` can run the checked-in idempotent bootstrap from a repository checkout:

```bash
bash scripts/bootstrap-parent-dns-role.sh --apply
```

The script verifies the AWS account and existing GitHub OIDC provider, discovers exactly one public `sozorockfoundation.org.` hosted zone, creates or reconciles only `GitHubActionsSozorockFoundationDnsRole`, installs its record-scoped inline policy, and makes no DNS record changes. After the bootstrap succeeds, rerun the failed parent-domain workflow; no long-lived AWS credentials need to be stored in GitHub.
