import assert from "node:assert/strict";
import { handler } from "./handler.mjs";

function event(method, path, body, rawQueryString = "") {
  return {
    rawPath: path,
    rawQueryString,
    requestContext: { http: { method, path } },
    body: body === undefined ? undefined : JSON.stringify(body),
    isBase64Encoded: false,
  };
}

const saved = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_IDENTITY_PROVIDER_ID: process.env.OPENAI_IDENTITY_PROVIDER_ID,
  OPENAI_SERVICE_ACCOUNT_ID: process.env.OPENAI_SERVICE_ACCOUNT_ID,
  OPENAI_WIF_AUDIENCE: process.env.OPENAI_WIF_AUDIENCE,
  AWS_REGION: process.env.AWS_REGION,
};
for (const key of Object.keys(saved)) delete process.env[key];

const redirect = await handler(event("GET", "/publication/rrg-v1-2025", undefined, "source=apex-cutover"));
assert.equal(redirect.statusCode, 308);
assert.equal(redirect.headers.location, "https://www.sozorockfoundation.org/publication/rrg-v1-2025?source=apex-cutover");

const health = await handler(event("GET", "/internal/health"));
assert.equal(health.statusCode, 200);
assert.equal(JSON.parse(health.body).modelConfigured, false);
assert.equal(JSON.parse(health.body).modelApiMode, "responses");
assert.equal(health.headers["cache-control"], "no-store");

const probeWithoutModel = await handler({ operation: "deployment:model-probe", model: "openai.gpt-5.4" });
assert.equal(probeWithoutModel.statusCode, 503);

const index = await handler(event("GET", "/internal/v1/graphs"));
assert.equal(index.statusCode, 200);
assert.equal(Object.keys(JSON.parse(index.body).graphs).length, 6);

const publicOptions = await handler({
  ...event("OPTIONS", "/public/v1/navigate"),
  headers: { origin: "https://www.sozorockfoundation.org" },
});
assert.equal(publicOptions.statusCode, 204);
assert.equal(publicOptions.headers["access-control-allow-origin"], "https://www.sozorockfoundation.org");

const rejectedOrigin = await handler({
  ...event("POST", "/public/v1/navigate", { question: "Where are the publications?" }),
  headers: { origin: "https://example.com" },
});
assert.equal(rejectedOrigin.statusCode, 403);

const runWithoutModel = await handler(
  event("POST", "/internal/v1/run", { graphId: "foundationSiteAssurance", input: { task: "test" } })
);
assert.equal(runWithoutModel.statusCode, 503);

const missingInternal = await handler(event("GET", "/internal/missing"));
assert.equal(missingInternal.statusCode, 404);

for (const [key, value] of Object.entries(saved)) {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
}
console.log("Validated combined Foundation redirect and internal agent Lambda boundary.");
