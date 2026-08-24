import { GetWebIdentityTokenCommand, STSClient } from "@aws-sdk/client-sts";
import { setDefaultOpenAIClient, setTracingDisabled } from "@openai/agents";
import OpenAI from "openai";

let configuredMode = null;

function wifConfig() {
  const identityProviderId = process.env.OPENAI_IDENTITY_PROVIDER_ID?.trim();
  const serviceAccountId = process.env.OPENAI_SERVICE_ACCOUNT_ID?.trim();
  const audience = process.env.OPENAI_WIF_AUDIENCE?.trim();
  const awsRegion = process.env.AWS_REGION?.trim();
  if (!identityProviderId || !serviceAccountId || !audience || !awsRegion) return null;
  return { identityProviderId, serviceAccountId, audience, awsRegion };
}

export function modelAuthMode() {
  if (process.env.OPENAI_API_KEY?.trim()) return "api_key";
  return wifConfig() ? "aws_wif" : null;
}

export function modelAuthConfigured() {
  return modelAuthMode() !== null;
}

export async function ensureModelAuthConfigured() {
  const mode = modelAuthMode();
  if (!mode) {
    throw new Error("OpenAI model authentication is not configured.");
  }
  if (configuredMode === mode) return mode;

  if (mode === "api_key") {
    configuredMode = mode;
    return mode;
  }

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
