#!/usr/bin/env node
import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const template = await readFile(new URL("infra/cloudformation/parent-cloudfront.yml", root), "utf8");
const workflow = await readFile(new URL(".github/workflows/deploy-parent-cloudfront.yml", root), "utf8");
const workflowDirectory = new URL(".github/workflows/", root);
const workflowFiles = (await readdir(workflowDirectory)).filter((file) => file.endsWith(".yml")).sort();
const workflowText = (await Promise.all(workflowFiles.map((file) => readFile(new URL(file, workflowDirectory), "utf8")))).join("\n");
const agentDeployScript = await readFile(new URL("services/foundation-agents/scripts/deploy-control-plane.sh", root), "utf8");

assert.deepEqual(workflowFiles, [
  "agentic-foundation-ci.yml",
  "deploy-foundation-agent-control-plane.yml",
  "deploy-parent-cloudfront.yml",
]);
assert.doesNotMatch(workflowText, /^\s*schedule:/mu);
assert.doesNotMatch(workflowText, /GitHubActionsSozorockAiLabDeployRole/u);
assert.doesNotMatch(workflowText, /uses:\s+[^\s]+@v\d+(?:\s|$)/u);

for (const fragment of [
  "AWS::S3::Bucket",
  "AWS::CloudFront::Distribution",
  "AWS::CloudFront::OriginAccessControl",
  "AWS::CertificateManager::Certificate",
  "AWS::ApiGatewayV2::Api",
  "AWS::ApiGatewayV2::Integration",
  "health.sozorockfoundation.org",
  "sozorockfoundation.org",
  "www.sozorockfoundation.org",
]) assert.ok(template.includes(fragment), `template includes ${fragment}`);

assert.match(template, /BlockPublicAcls:\s+true/u);
assert.match(template, /VersioningConfiguration:\s+Status: Enabled/u);
assert.match(template, /CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad/u);
assert.match(template, /response\(308,/u);
assert.match(template, /strict-transport-security/u);
assert.match(template, /health-systems-assurance-volume-1/u);
assert.match(template, /PathPattern: \/api\/publications\/\*/u);
assert.match(template, /HeaderValue: https:\/\/health\.sozorockfoundation\.org\/publications\/health-systems-assurance-volume-1\/access/u);
assert.match(template, /TargetOriginId: health-publications/u);
assert.match(template, /TargetOriginId: health-contact/u);
assert.doesNotMatch(workflow, /SMTP\.GOOGLE\.COM[^\n]*DELETE/iu);
assert.match(workflow, /v=spf1 include:_spf\.google\.com ~all/u);
assert.match(workflow, /v=DMARC1; p=none; pct=100; adkim=r; aspf=r/u);
assert.match(workflow, /mail-records-before/u);
assert.match(workflow, /rollback_dns/u);
assert.match(workflow, /associate-alias/u);
assert.match(workflow, /_\$\{CANONICAL_HOST\}/u);
assert.match(workflow, /Temporarily verify ownership for the Foundation CloudFront alias move/u);
assert.match(workflow, /restore_verification_records/u);
assert.match(workflow, /route53 wait resource-record-sets-changed/u);
assert.match(workflow, /enable_aliases/u);
assert.match(workflow, /bridge_mode/u);
assert.match(workflow, /AWS canonical bridge backed by CloudFront/u);
assert.match(template, /IntegrationType: HTTP_PROXY/u);
assert.match(template, /IntegrationUri: !Sub 'https:\/\/\$\{Distribution\.DomainName\}\/\{proxy\}'/u);
assert.match(template, /CanonicalBridgeApiId/u);
assert.match(workflow, /get-domain-name --domain-name "\$CANONICAL_HOST"/u);
assert.match(workflow, /update-api-mapping/u);
assert.match(await readFile(new URL("scripts/bootstrap-parent-aws.sh", root), "utf8"), /apigateway:TagResource/u);
assert.match(workflow, /<title>Platforms \| The SozoRock Foundation<\/title>/u);
assert.match(agentDeployScript, /ThrottlingBurstLimit/u);
assert.match(agentDeployScript, /ThrottlingRateLimit/u);

const pages = await readFile(new URL("src/Pages.jsx", root), "utf8");
assert.match(pages, /body\.accepted !== true \|\| body\.verificationSent !== true/u);

await access(new URL("dist/client/index.html", root));
await access(new URL("dist/client/404.html", root));
await access(new URL("dist/client/.well-known/security.txt", root));
await access(new URL(".github/CODEOWNERS", root));
await access(new URL("SECURITY.md", root));
console.log("AWS release contract is valid.");
