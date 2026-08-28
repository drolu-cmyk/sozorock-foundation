import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const template = await readFile(new URL("../infra/cloudformation/parent-cloudfront.yml", import.meta.url), "utf8");
const marker = "      FunctionCode: |\n";
const start = template.indexOf(marker);
assert.notEqual(start, -1);
const remaining = template.slice(start + marker.length);
const end = remaining.search(/^\s{2}\S/mu);
const source = (end === -1 ? remaining : remaining.slice(0, end))
  .split("\n")
  .map((line) => line.startsWith("        ") ? line.slice(8) : line)
  .join("\n");
const context = vm.createContext({ encodeURIComponent, Object });
vm.runInContext(source, context);

function request(uri, { host = "www.sozorockfoundation.org", querystring = {} } = {}) {
  return context.handler({ request: { uri, headers: { host: { value: host } }, querystring } });
}

test("CloudFront permanently canonicalizes the apex and preserves path/query", () => {
  const result = request("/platforms", {
    host: "sozorockfoundation.org",
    querystring: { source: { value: "apex" } },
  });
  assert.equal(result.statusCode, 308);
  assert.equal(result.headers.location.value, "https://www.sozorockfoundation.org/platforms?source=apex");
});

test("CloudFront rewrites every clean production route to its prebuilt HTML", () => {
  for (const route of ["/", "/platforms", "/publication/hsa-v1-2026/access", "/terms"]) {
    const result = request(route);
    assert.equal(result.uri, route === "/" ? "/index.html" : `${route}.html`);
  }
});

test("CloudFront preserves unknown paths for a true S3/CloudFront 404", () => {
  assert.equal(request("/not-a-route").uri, "/not-a-route");
});

test("CloudFront protects private publication files and legacy routes", () => {
  const privateFile = request("/publications/hsa-volume-1-2026.pdf");
  assert.equal(privateFile.statusCode, 302);
  assert.equal(privateFile.headers.location.value, "/publication/hsa-v1-2026/access");
  const legacy = request("/work/global-institute");
  assert.equal(legacy.statusCode, 301);
  assert.equal(legacy.headers.location.value, "/platforms/institute");
});

test("CloudFront maps the public publication slug to the established Health API slug", () => {
  assert.equal(
    request("/api/publications/access/hsa-v1-2026").uri,
    "/api/publications/access/health-systems-assurance-volume-1",
  );
  assert.equal(request("/api/contact").uri, "/api/contact");
});

test("CloudFront maps only the public navigator path to the unsigned agent route", () => {
  assert.equal(request("/api/navigator").uri, "/public/v1/navigate");
  assert.equal(request("/api/navigator/private").uri, "/api/navigator/private");
  assert.match(template, /PathPattern: \/api\/navigator[\s\S]*TargetOriginId: foundation-agent-api/u);
  assert.match(template, /Aliases: !If[\s\S]*\[!Ref ApexDomain, !Ref CanonicalDomain\]/u);
});
