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
  FOUNDATION_MODEL_EXECUTION_ENABLED: process.env.FOUNDATION_MODEL_EXECUTION_ENABLED,
};
for (const key of Object.keys(saved)) delete process.env[key];

const redirect = await handler(event("GET", "/publication/rrg-v1-2025", undefined, "source=apex-cutover"));
assert.equal(redirect.statusCode, 308);
assert.equal(redirect.headers.location, "https://www.sozorockfoundation.org/publication/rrg-v1-2025?source=apex-cutover");
assert.equal(redirect.headers["strict-transport-security"], "max-age=31536000; includeSubDomains; preload");

const health = await handler(event("GET", "/internal/health"));
assert.equal(health.statusCode, 200);
assert.equal(JSON.parse(health.body).modelConfigured, false);
assert.equal(JSON.parse(health.body).modelExecutionEnabled, false);
assert.equal(JSON.parse(health.body).modelApiMode, "responses");
assert.equal(health.headers["cache-control"], "no-store");
assert.equal(health.headers["strict-transport-security"], "max-age=31536000; includeSubDomains; preload");

const probeWithoutModel = await handler({ operation: "deployment:model-probe", model: "openai.gpt-oss-120b" });
assert.equal(probeWithoutModel.statusCode, 503);

const graphSmokeWithoutModel = await handler({ operation: "deployment:graph-smoke" });
assert.equal(graphSmokeWithoutModel.statusCode, 503);

const agentCanaryWithoutModel = await handler({ operation: "deployment:agent-canary" });
assert.equal(agentCanaryWithoutModel.statusCode, 503);

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

const publicGuide = await handler(event("POST", "/public/v1/navigate", { question: "Where are the publications?" }));
assert.equal(publicGuide.statusCode, 200);
assert.equal(JSON.parse(publicGuide.body).links[0].key, "publications");

const healthGuide = await handler(event("POST", "/public/v1/navigate", { question: "Tell me about primary care access" }));
assert.equal(healthGuide.statusCode, 200);
const healthAnswer = JSON.parse(healthGuide.body);
for (const text of ["Primary Care Access Program", "January 2027", "12 months", "up to 25", "one per household", "64 or younger", "62 counties", "Purcell Integrative Osteopathic Care", "Membership is not health insurance"]) {
  assert.ok(healthAnswer.answer.includes(text), text);
}
assert.equal(healthAnswer.links[0].key, "health");
assert.equal(healthAnswer.knowledgeVersion, "2026-10-19-primary-care-access");

const runWithoutModel = await handler(
  event("POST", "/internal/v1/run", { graphId: "foundationSiteAssurance", input: { task: "test" } })
);
assert.equal(runWithoutModel.statusCode, 503);
assert.equal(JSON.parse(runWithoutModel.body).error, "model_execution_paused");

const previousFetch = globalThis.fetch;
let modelRequests = 0;
globalThis.fetch = async () => { modelRequests += 1; throw new Error("Unexpected model request"); };
process.env.OPENAI_API_KEY = "test-only-not-a-credential";
try {
  for (const enabled of [undefined, "false", "TRUE", "1"]) {
    if (enabled === undefined) delete process.env.FOUNDATION_MODEL_EXECUTION_ENABLED;
    else process.env.FOUNDATION_MODEL_EXECUTION_ENABLED = enabled;
    for (const operation of ["deployment:model-probe", "deployment:graph-smoke", "deployment:agent-canary"]) {
      const paused = await handler({ operation, model: "openai.gpt-oss-120b" });
      assert.equal(paused.statusCode, 503);
      assert.equal(JSON.parse(paused.body).error, "model_execution_paused");
    }
    const pausedRun = await handler(event("POST", "/internal/v1/run", { graphId: "foundationSiteAssurance", input: { task: "test" } }));
    assert.equal(JSON.parse(pausedRun.body).error, "model_execution_paused");
  }
  assert.equal(modelRequests, 0);
  process.env.FOUNDATION_MODEL_EXECUTION_ENABLED = "true";
  delete process.env.OPENAI_API_KEY;
  const unconfiguredRun = await handler(event("POST", "/internal/v1/run", {}));
  assert.equal(JSON.parse(unconfiguredRun.body).error, "model_service_not_configured");
} finally {
  globalThis.fetch = previousFetch;
}

const missingInternal = await handler(event("GET", "/internal/missing"));
assert.equal(missingInternal.statusCode, 404);

for (const [key, value] of Object.entries(saved)) {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
}
console.log("Validated combined Foundation redirect and internal agent Lambda boundary.");
