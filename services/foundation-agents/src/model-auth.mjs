import { getTokenProvider } from "@aws/bedrock-token-generator";
import { GetWebIdentityTokenCommand, STSClient } from "@aws-sdk/client-sts";
import { setDefaultOpenAIClient, setOpenAIAPI, setTracingDisabled } from "@openai/agents";
import OpenAI from "openai";

const foundationEdgeFunction = "SozoRockFoundationParentOrigin";
let configuredMode = null;
let bedrockTokenProvider = null;
let bedrockClient = null;
let bedrockApiKey = null;

function wifConfig() {
  const identityProviderId = process.env.OPENAI_IDENTITY_PROVIDER_ID?.trim();
  const serviceAccountId = process.env.OPENAI_SERVICE_ACCOUNT_ID?.trim();
  const audience = process.env.OPENAI_WIF_AUDIENCE?.trim();
  const awsRegion = process.env.AWS_REGION?.trim();
  if (!identityProviderId || !serviceAccountId || !audience || !awsRegion) return null;
  return { identityProviderId, serviceAccountId, audience, awsRegion };
}

function bedrockRequested() {
  return (
    process.env.FOUNDATION_MODEL_PROVIDER?.trim() === "bedrock" ||
    process.env.AWS_LAMBDA_FUNCTION_NAME?.trim() === foundationEdgeFunction
  );
}

export function bedrockBaseURLForModel(model, awsRegion) {
  return model.includes("gpt-oss")
    ? `https://bedrock-runtime.${awsRegion}.amazonaws.com/openai/v1`
    : `https://bedrock-mantle.${awsRegion}.api.aws/openai/v1`;
}

export function bedrockRuntimeModelId(model) {
  if (model === "openai.gpt-oss-20b") return "openai.gpt-oss-20b-1:0";
  if (model === "openai.gpt-oss-120b") return "openai.gpt-oss-120b-1:0";
  return model;
}

function bedrockConfig() {
  if (!bedrockRequested()) return null;
  const awsRegion = process.env.AWS_REGION?.trim();
  if (!awsRegion) return null;
  const model = process.env.OPENAI_AGENT_MODEL?.trim() || "";
  return {
    awsRegion,
    baseURL: bedrockBaseURLForModel(model, awsRegion),
  };
}

export function modelAuthMode() {
  if (bedrockConfig()) return "bedrock_short_term";
  if (process.env.OPENAI_API_KEY?.trim()) return "api_key";
  return wifConfig() ? "aws_wif" : null;
}

export function modelAuthConfigured() {
  return modelAuthMode() !== null;
}

export function modelApiMode() {
  return modelAuthMode() === "bedrock_short_term" ? "chat_completions" : "responses";
}

export async function ensureModelAuthConfigured() {
  const mode = modelAuthMode();
  if (!mode) {
    throw new Error("OpenAI-compatible model authentication is not configured.");
  }

  if (mode === "api_key") {
    setOpenAIAPI("responses");
    configuredMode = mode;
    return mode;
  }

  if (mode === "bedrock_short_term") {
    const config = bedrockConfig();
    if (!bedrockTokenProvider) {
      bedrockTokenProvider = getTokenProvider({
        region: config.awsRegion,
        expiresInSeconds: 900,
      });
    }
    const token = await bedrockTokenProvider();
    if (!token) throw new Error("Amazon Bedrock did not return a short-term API key.");
    bedrockApiKey = token;
    bedrockClient = new OpenAI({ apiKey: token, baseURL: config.baseURL });
    setDefaultOpenAIClient(bedrockClient);
    setOpenAIAPI("chat_completions");
    setTracingDisabled(true);
    configuredMode = mode;
    return mode;
  }

  if (configuredMode === mode) return mode;

  const config = wifConfig();
  const sts = new STSClient({ region: config.awsRegion });
  const provider = {
    tokenType: "jwt",
    getToken: async () => {
      const token = await sts.send(
        new GetWebIdentityTokenCommand({
          Audience: [config.audience],
          SigningAlgorithm: "ES384",
          DurationSeconds: 300,
        })
      );
      if (!token.WebIdentityToken) throw new Error("AWS STS did not return a workload identity token.");
      return token.WebIdentityToken;
    },
  };

  const client = new OpenAI({
    workloadIdentity: {
      identityProviderId: config.identityProviderId,
      serviceAccountId: config.serviceAccountId,
      provider,
    },
  });
  setDefaultOpenAIClient(client);
  setOpenAIAPI("responses");
  setTracingDisabled(true);
  configuredMode = mode;
  return mode;
}

export async function probeBedrockModel(model) {
  if (modelAuthMode() !== "bedrock_short_term") {
    throw new Error("Amazon Bedrock model probing requires the Bedrock runtime.");
  }
  await ensureModelAuthConfigured();
  const result = await bedrockClient.chat.completions.create({
    model: bedrockRuntimeModelId(model),
    messages: [{ role: "user", content: "Reply with OK." }],
    max_tokens: 16,
  });
  return Boolean(result.id || result.choices?.length);
}
