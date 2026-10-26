import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const template = (await readFile(new URL("../infra/cloudformation/parent-cloudfront.yml", import.meta.url), "utf8")).replaceAll("\r\n", "\n");
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

test("all edge redirects exclude private values including duplicate public parameters", () => {
  for (const [uri, host, expected] of [
    ["/publications", "sozorockfoundation.org", "https://www.sozorockfoundation.org/publications"],
    ["/about-us", "www.sozorockfoundation.org", "/about"],
    ["/publications/", "www.sozorockfoundation.org", "/publications"],
  ]) {
    const querystring = {
      email: { value: "person@example.test" }, token: { value: "secret" },
      ref: { value: "person@example.test" },
      source: { value: "apex", multiValue: [{ value: "apex" }, { value: "secret" }] },
    };
    const response = request(uri, { host, querystring });
    assert.equal(response.headers.location.value, expected + "?source=apex");
  }
});

test("edge redirects never reflect unrecognized paths or redirect to another origin", () => {
  for (const host of ["sozorockfoundation.org", "www.sozorockfoundation.org"]) {
    for (const uri of ["//example.test/", "/person@example.test/", "/%3Femail%3Dperson%40example.test/"]) {
      const response = request(uri, { host });
      assert.equal(response.statusCode, 404);
      assert.equal(response.headers.location, undefined);
    }
  }
  assert.equal(request("/person@example.test", { host: "sozorockfoundation.org" }).statusCode, 404);
});

test("CloudFront permanently canonicalizes the apex and preserves path/query", () => {
  const result = request("/platforms", {
    host: "sozorockfoundation.org",
    querystring: { source: { value: "apex" } },
  });
  assert.equal(result.statusCode, 308);
  assert.equal(result.headers.location.value, "https://www.sozorockfoundation.org/platforms?source=apex");
});

test("CloudFront rewrites every clean production route to its prebuilt HTML", async () => {
  const buildScript = await readFile(new URL("../scripts/prepare-sites-build.mjs", import.meta.url), "utf8");
  const routeList = buildScript.match(/const permanentRoutes = (\[[\s\S]*?\]);/u)?.[1];
  assert.ok(routeList, "production build declares its permanent routes");
  const builtRoutes = JSON.parse(routeList.replace(/,\s*\]/u, "]"));
  for (const route of ["/", ...builtRoutes]) {
    const result = request(route);
    assert.equal(result.uri, route === "/" ? "/index.html" : `${route}.html`);
  }
});

test("CloudFront preserves unknown paths for a true S3/CloudFront 404", () => {
  assert.equal(request("/not-a-route").uri, "/not-a-route");
});

test("CloudFront protects private publication files and consolidates legacy routes", () => {
  const privateFile = request("/publications/hsa-volume-1-2026.pdf");
  assert.equal(privateFile.statusCode, 302);
  assert.equal(privateFile.headers.location.value, "/publication/hsa-v1-2026/access");

  for (const [legacyPath, destination] of [
    ["/about-us", "/about"],
    ["/programs", "/platforms"],
    ["/work/global-institute", "/publications"],
    ["/platforms/institute", "/publications"],
    ["/platforms/applied-learning", "/workforce"],
    ["/insights", "/publications"],
  ]) {
    const legacy = request(legacyPath);
    assert.equal(legacy.statusCode, 301);
    assert.equal(legacy.headers.location.value, destination);
  }
});

test("CloudFront maps the public publication slug to the established Health API slug", () => {
  assert.equal(
    request("/api/publications/access/hsa-v1-2026").uri,
    "/api/publications/access/health-systems-assurance-volume-1",
  );
  assert.equal(request("/api/contact").uri, "/api/contact");
});

test("CloudFront answers the switched off website guide at the edge", () => {
  for (const path of ["/api/navigator", "/api/navigator/private"]) {
    const response = request(path);
    assert.equal(response.statusCode, 410);
  }
  assert.doesNotMatch(template, /PathPattern: \/api\/navigator/u);
  assert.match(template, /Aliases: !If[\s\S]*\[!Ref CanonicalDomain\]/u);
});
