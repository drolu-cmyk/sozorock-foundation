# Legacy Health hostname redirect

Live checks on October 20, 2026 found 301 responses for both legacy hosts at /, /about and /cb-cap. Responses identify CloudFront and a function-generated response. The /about redirect currently reaches a missing Health page; the maintained source maps it to the existing /work page.

The controlled publisher targets the existing CloudFront viewer-request function. It does not update Amplify, DNS, distribution associations, certificates or other services.

## Repository variables

Set these variables in the Foundation repository before manually running the publisher:

- `LEGACY_HEALTH_DISTRIBUTION_ID`: the existing distribution serving both `sozorockhealth.com` and `www.sozorockhealth.com`.
- `LEGACY_HEALTH_FUNCTION_NAME`: its existing viewer-request function.
- `LEGACY_HEALTH_DEPLOY_ROLE_ARN`: the existing bounded deployment role.
- `AWS_REGION`: optional; defaults to `us-east-1`.

The workflow verifies both aliases and every cache behavior's viewer-request association before changing the configured function. If the serving service or associations differ, stop and investigate instead of changing another application.

## Publish sequence

1. Run `node --test tests/legacy-health-redirect.test.mjs` and `npm run test:sites`.
2. Retrieve the DEVELOPMENT and LIVE function descriptions, ETags and code, plus the current distribution configuration. Keep the complete pre-change backup for rollback.
3. Upload that backup as a workflow artifact before any mutation. If backup or upload fails, stop.
4. Describe both stages again and verify their ETags and the distribution ETag still match the backup.
5. Update the existing function from `infra/cloudfront/legacy-health-redirect.js`, preserving the LIVE configuration.
6. Test the DEVELOPMENT stage using the updated ETag for both hosts, GET and HEAD requests, all three required paths, unknown hosts and retired operations.
7. Retrieve a fresh DEVELOPMENT ETag. Require it to match the tested version, recheck distribution associations, then publish.
8. Use curl to verify that /, /about and /cb-cap on both hosts return 301 with the expected Location and a final 200 page. Retry for at most ten minutes and retain verification results.

The workflow is `publish-legacy-health-redirect.yml`, uses only `workflow_dispatch`, runs from main and uses the production environment. Do not run it as part of PR review.

Publishing the existing function updates its existing associations. This workflow does not modify associations; a separate association change would require a fresh distribution ETag after publication, never a reused ETag.

## Behavior and rollback

- Root and maintained Health paths return 301 to `https://health.sozorockfoundation.org/`, preserving the path.
- /about and /about/ map to `https://health.sozorockfoundation.org/work`.
- Legacy CB-CAP aliases map to `https://cbcap.sozorockfoundation.org/`.
- Obsolete API/write requests return 410. Unexpected hosts return 403.
- Only the existing campaign query allowlist is forwarded; private query values are dropped.

If verification fails, inspect the saved results and pre-change artifacts. There is no automatic rollback. To restore the prior LIVE version, retrieve a fresh DEVELOPMENT ETag, update with the saved LIVE code and configuration, test, retrieve the new ETag and publish. Preserve the prior DEVELOPMENT backup separately.

## Permissions and conflicting release paths

The existing role needs `cloudfront:GetDistribution` scoped to the configured distribution, plus `cloudfront:DescribeFunction`, `cloudfront:GetFunction`, `cloudfront:UpdateFunction`, `cloudfront:TestFunction` and `cloudfront:PublishFunction` scoped to the configured function. The OIDC trust must permit this repository's production environment. No IAM resources are created.

The separate `drolu-cmyk/sozorock-ai-lab` workflow `complete-foundation-production-recovery.yml` manages a legacy Amplify application and still expects 308. Its owner must align those checks to 301 and reconcile domain ownership before running it. The legacy application's release path could overwrite the intended routing. That repository is not changed here.

## Manual fallback

CloudFront: Console → CloudFront → Functions → the legacy Health viewer-request function → back up the current code and configuration → paste the repo source → Save → Test → Publish.

Amplify, only if a future investigation confirms it serves the hosts: Console → the legacy Health app → Hosting → Rewrites and redirects → back up the rules → change 302 to 301, preserving the CB-CAP rule and destinations.
