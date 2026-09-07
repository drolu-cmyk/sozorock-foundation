# Legacy Health hostname redirect

Verified live on 2026-09-07 in AWS account 791860731989.

- Existing distribution: `E80V8CANL8U7R` (both sozorockhealth.com hostnames).
- Existing viewer-request function: `sozoro-production-SozoRockSiteCloudfrontFunctionRequest-vcnaadaf`.
- Maintained function source: `cloudfront/legacy-health-redirect.js`.
- The default and legacy admin/static/image behaviors all use this function.
- Root returns 301 to `https://health.sozorockfoundation.org/`.
- Legacy CB-CAP paths return 301 to `https://cbcap.sozorockfoundation.org/`.
- Obsolete API/write requests return 410; private query values are not forwarded.

No distribution, certificate, bucket, hosted zone or alarm was added. CloudFront reports `Deployed`. The previous SST-managed function could overwrite this redirect if that legacy application is redeployed; reconcile that separate delivery source before any legacy release.

For changes, retrieve the current function ETag, update the existing function using the source above, test the DEVELOPMENT stage, then publish using the new ETag. Fetch a fresh distribution ETag after function publishing before modifying associations. Never reuse a stale ETag. Keep a complete pre-change function/configuration backup for rollback. Tests: `node --test tests/legacy-health-redirect.test.mjs`.
