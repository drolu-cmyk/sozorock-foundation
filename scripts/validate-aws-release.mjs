#!/usr/bin/env node
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const template = await readFile(new URL("infra/cloudformation/parent-cloudfront.yml", root), "utf8");
const workflow = await readFile(new URL(".github/workflows/deploy-parent-cloudfront.yml", root), "utf8");
const recoveryWorkflow = await readFile(new URL(".github/workflows/complete-production-recovery.yml", root), "utf8");
const recoveryFinalizer = await readFile(new URL(".github/workflows/finalize-production-recovery.yml", root), "utf8");

for (const fragment of [
  "AWS::S3::Bucket",
  "AWS::CloudFront::Distribution",
  "AWS::CloudFront::OriginAccessControl",
  "AWS::CertificateManager::Certificate",
  "health.sozorockfoundation.org",
  "sozorockfoundation.org",
  "www.sozorockfoundation.org",
]) assert.ok(template.includes(fragment), `template includes ${fragment}`);

assert.match(template, /BlockPublicAcls:\s+true/u);
assert.match(template, /VersioningConfiguration:\s+Status: Enabled/u);
assert.match(template, /CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad/u);
assert.match(template, /response\(308,/u);
assert.match(template, /health-systems-assurance-volume-1/u);
assert.match(template, /PathPattern: \/api\/publications\/\*/u);
assert.match(template, /HeaderValue: https:\/\/health\.sozorockfoundation\.org\/publications\/health-systems-assurance-volume-1\/access/u);
assert.match(template, /TargetOriginId: health-publications/u);
assert.match(template, /TargetOriginId: health-contact/u);
assert.doesNotMatch(workflow, /SMTP\.GOOGLE\.COM[^\n]*DELETE/iu);
assert.match(workflow, /mail-records-before/u);
assert.match(workflow, /rollback_dns/u);
assert.match(workflow, /associate-alias/u);
assert.match(workflow, /_\$\{CANONICAL_HOST\}/u);
assert.match(workflow, /Temporarily verify ownership for the Foundation CloudFront alias move/u);
assert.match(workflow, /restore_verification_records/u);
assert.match(workflow, /route53 wait resource-record-sets-changed/u);
assert.match(workflow, /enable_aliases/u);
assert.match(workflow, /<title>Platforms \| The SozoRock Foundation<\/title>/u);
assert.match(recoveryWorkflow, /ProveOnlyFoundationAgentInternalApi/u);
assert.match(recoveryWorkflow, /PARENT_API_ID: 2b6srfl202/u);
assert.match(recoveryWorkflow, /\$\{PARENT_API_ID\}\/\*\/POST\/internal\/v1\/run/u);
assert.match(recoveryWorkflow, /NotFoundException/u);
assert.doesNotMatch(recoveryFinalizer, /https:\/\/sozorockhealth\.com/u);

const pages = await readFile(new URL("src/Pages.jsx", root), "utf8");
assert.match(pages, /body\.accepted !== true \|\| body\.verificationSent !== true/u);

await access(new URL("dist/client/index.html", root));
await access(new URL("dist/client/404.html", root));
console.log("AWS release contract is valid.");
