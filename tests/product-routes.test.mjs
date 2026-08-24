import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const router = readFileSync(new URL("../src/router.jsx", import.meta.url), "utf8");
const components = readFileSync(new URL("../src/components.jsx", import.meta.url), "utf8");

test("Foundation product routes leave the parent site for their canonical subdomains", () => {
  const expected = [
    ["/platforms/health", "https://health.sozorockfoundation.org/"],
    ["/platforms/ai-lab", "https://ai-lab.sozorockfoundation.org/"],
    ["/platforms/cbcap", "https://cbcap.sozorockfoundation.org/"],
    ["/platforms/cb-cap", "https://cbcap.sozorockfoundation.org/"],
  ];

  for (const [route, destination] of expected) {
    assert.ok(router.includes(`["${route}", "${destination}"]`), `${route} must resolve to ${destination}`);
  }
  assert.ok(components.includes('href="https://cbcap.sozorockfoundation.org/"'));
});
