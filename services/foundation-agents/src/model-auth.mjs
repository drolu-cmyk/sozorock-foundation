import { getTokenProvider } from "@aws/bedrock-token-generator";
import { GetWebIdentityTokenCommand, STSClient } from "@aws-sdk/client-sts";
import { setDefaultOpenAIClient, setTracingDisabled } from "@openai/agents";
import OpenAI from "openai";

let configuredMode = null;
let bedrockTokenProvider = null;

function wifConfig() {
  const identityProviderId = process.env.OPENAI_IDENTITY_PROVIDER_ID?.trim();
  const serviceAccountId = process.env.OPENAI_SERVICE_ACCOUNT_ID?.trim();
  const audience = process.env.OPENAI_WIF_AUDIENCE?.trim();
  const awsRegion = process.env.AWS_REGION?.trim();
  if (!identityProviderId || !serviceAccountId || !audience || !awsRegion) return null;
  return { identityProviderId, serviceAccountId, audience, awsRegion };
}

function bedrockConfig() {
  if (process.env.FOUNDATION_MODEL_PROVIDER?.trim() !== "bedrock") return null;
  const awsRegion = process.env.AWS_REGION?.trim();
  if (!awsRegion) return null;
  return {
    awsRegion,
    baseURL: `https://bedrock-mantle.${awsRegion}.api.aws/openai/v1`,
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

export async function ensureModelAuthConfigured() {
  const mode = modelAuthMode();
  if (!mode) {
    throw new Error("OpenAI-compatible model authentication is not configured.");
  }

  if (mode === "api_key") {
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

    // Generate a short-lived Bedrock API key from the Lambda's IAM role for
    // each graph run. The generator is inexpensive and the key is never stored
    // or logged. This avoids long-lived model credentials in Lambda or GitHub.
    const token = await bedrockTokenProvider();
    if (!token) throw new Error("Amazon Bedrock did not return a short-term API key.");
    const client = new OpenAI({ apiKey: token, baseURL: config.baseURL });
    setDefaultOpenAIClient(client);
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

  // The default Agents SDK trace exporter expects API-key credentials.
  // With WIF, retain run IDs and CloudWatch operational telemetry but do not
  // attempt a key-based trace export from this Lambda.
  setTracingDisabled(true);
  configuredMode = mode;
  return mode;
}
