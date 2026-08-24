import assert from "node:assert/strict";
import { handler } from "./handler.mjs";

function event(method, path, body) {
  return {
    rawPath: path,
    requestContext: { http: { method, path } },
    body: body === undefined ? undefined : JSON.stringify(body),
    isBase64Encoded: false,
  };
}

const priorKey = process.env.OPENAI_API_KEY;
delete process.env.OPENAI_API_KEY;

const health = await handler(event("GET", "/health"));
assert.equal(health.statusCode, 200);
assert.equal(JSON.parse(health.body).modelConfigured, false);
assert.equal(health.headers["cache-control"], "no-store");

const index = await handler(event("GET", "/v1/graphs"));
assert.equal(index.statusCode, 200);
assert.equal(Object.keys(JSON.parse(index.body).graphs).length, 5);

const runWithoutModel = await handler(event("POST", "/v1/run", { graphId: "foundationSiteAssurance", input: { task: "test" } }));
assert.equal(runWithoutModel.statusCode, 503);

const missing = await handler(event("GET", "/missing"));
assert.equal(missing.statusCode, 404);

if (priorKey) process.env.OPENAI_API_KEY = priorKey;
console.log("Validated Foundation agent Lambda boundary.");
