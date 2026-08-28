import assert from "node:assert/strict";
import { bedrockBaseURLForModel, modelApiMode, modelAuthConfigured, modelAuthMode } from "./model-auth.mjs";

assert.equal(
  bedrockBaseURLForModel("openai.gpt-oss-20b", "us-east-1"),
  "https://bedrock-runtime.us-east-1.amazonaws.com/openai/v1"
);
assert.equal(
  bedrockBaseURLForModel("openai.gpt-5.6-sol", "us-east-1"),
  "https://bedrock-mantle.us-east-1.api.aws/openai/v1"
);

const keys = [
  "FOUNDATION_MODEL_PROVIDER",
  "OPENAI_API_KEY",
  "OPENAI_IDENTITY_PROVIDER_ID",
  "OPENAI_SERVICE_ACCOUNT_ID",
  "OPENAI_WIF_AUDIENCE",
  "AWS_LAMBDA_FUNCTION_NAME",
  "AWS_REGION",
];
const saved = Object.fromEntries(keys.map((key) => [key, process.env[key]]));

for (const key of keys) delete process.env[key];
assert.equal(modelAuthConfigured(), false);
assert.equal(modelAuthMode(), null);
assert.equal(modelApiMode(), "responses");

process.env.OPENAI_API_KEY = "test-only-not-a-real-key";
assert.equal(modelAuthConfigured(), true);
assert.equal(modelAuthMode(), "api_key");
assert.equal(modelApiMode(), "responses");
delete process.env.OPENAI_API_KEY;

process.env.OPENAI_IDENTITY_PROVIDER_ID = "wip_test";
process.env.OPENAI_SERVICE_ACCOUNT_ID = "sa_test";
process.env.OPENAI_WIF_AUDIENCE = "https://api.openai.com/v1";
process.env.AWS_REGION = "us-east-1";
assert.equal(modelAuthConfigured(), true);
assert.equal(modelAuthMode(), "aws_wif");
assert.equal(modelApiMode(), "responses");

delete process.env.OPENAI_SERVICE_ACCOUNT_ID;
assert.equal(modelAuthConfigured(), false);

process.env.FOUNDATION_MODEL_PROVIDER = "bedrock";
assert.equal(modelAuthConfigured(), true);
assert.equal(modelAuthMode(), "bedrock_short_term");
assert.equal(modelApiMode(), "responses");
delete process.env.FOUNDATION_MODEL_PROVIDER;

process.env.AWS_LAMBDA_FUNCTION_NAME = "UnrelatedFunction";
assert.equal(modelAuthConfigured(), false);
assert.equal(modelAuthMode(), null);

process.env.AWS_LAMBDA_FUNCTION_NAME = "SozoRockFoundationParentOrigin";
assert.equal(modelAuthConfigured(), true);
assert.equal(modelAuthMode(), "bedrock_short_term");
assert.equal(modelApiMode(), "responses");

delete process.env.AWS_REGION;
assert.equal(modelAuthConfigured(), false);
assert.equal(modelAuthMode(), null);

for (const key of keys) {
  if (saved[key] === undefined) delete process.env[key];
  else process.env[key] = saved[key];
}
console.log("Validated Foundation agent model authentication modes.");
