import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const router = readFileSync(new URL("../src/router.jsx", import.meta.url), "utf8");
const components = readFileSync(new URL("../src/components.jsx", import.meta.url), "utf8");

test("parent platform pages stay internal while CB-CAP uses its canonical subdomain", () => {
  assert.ok(!router.includes('["/platforms/health", "https://health.sozorockfoundation.org/"]'));
  assert.ok(!router.includes('["/platforms/ai-lab", "https://ai-lab.sozorockfoundation.org/"]'));

  const expectedExternal = [
    ["/platforms/cbcap", "https://cbcap.sozorockfoundation.org/"],
    ["/platforms/cb-cap", "https://cbcap.sozorockfoundation.org/"],
  ];

  for (const [route, destination] of expectedExternal) {
    assert.ok(router.includes(`["${route}", "${destination}"]`), `${route} must resolve to ${destination}`);
  }
  assert.ok(components.includes('href="https://cbcap.sozorockfoundation.org/"'));
});
