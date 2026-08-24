import assert from "node:assert/strict";
import { modelAuthConfigured, modelAuthMode } from "./model-auth.mjs";

const keys = [
  "OPENAI_API_KEY",
  "OPENAI_IDENTITY_PROVIDER_ID",
  "OPENAI_SERVICE_ACCOUNT_ID",
  "OPENAI_WIF_AUDIENCE",
  "AWS_REGION",
];
const saved = Object.fromEntries(keys.map((key) => [key, process.env[key]]));

for (const key of keys) delete process.env[key];
assert.equal(modelAuthConfigured(), false);
assert.equal(modelAuthMode(), null);

process.env.OPENAI_API_KEY = "test-only-not-a-real-key";
assert.equal(modelAuthConfigured(), true);
assert.equal(modelAuthMode(), "api_key");
delete process.env.OPENAI_API_KEY;

process.env.OPENAI_IDENTITY_PROVIDER_ID = "wip_test";
process.env.OPENAI_SERVICE_ACCOUNT_ID = "sa_test";
process.env.OPENAI_WIF_AUDIENCE = "https://api.openai.com/v1";
process.env.AWS_REGION = "us-east-1";
assert.equal(modelAuthConfigured(), true);
assert.equal(modelAuthMode(), "aws_wif");

delete process.env.OPENAI_SERVICE_ACCOUNT_ID;
assert.equal(modelAuthConfigured(), false);

for (const key of keys) {
  if (saved[key] === undefined) delete process.env[key];
  else process.env[key] = saved[key];
}
console.log("Validated Foundation agent model authentication modes.");
