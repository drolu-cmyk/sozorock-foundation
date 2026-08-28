import { Buffer } from "node:buffer";
import { containsForbiddenMaterial, isPlainObject, maxRequestBytes } from "./boundary.mjs";
import { executeGraph, graphs } from "./graph.mjs";
import { modelAuthConfigured, modelAuthMode } from "./model-auth.mjs";
import { normalizePublicAnswer } from "./public-knowledge.mjs";

const canonicalOrigin = "https://www.sozorockfoundation.org";
const securityHeaders = {
  "cache-control": "no-store",
  "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
  "content-type": "application/json; charset=utf-8",
  "referrer-policy": "no-referrer",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
};
const publicOrigins = new Set([canonicalOrigin, "https://sozorockfoundation.org"]);
const publicBuckets = new Map();
const publicBucketWindowMs = 60_000;
const publicRequestLimit = 6;
const publicGlobalRequestLimit = 60;

function response(statusCode, body, headers = securityHeaders) {
  return {
    statusCode,
    headers,
    body: JSON.stringify(body),
    isBase64Encoded: false,
  };
}

function eventHeader(event, name) {
  const headers = event?.headers || {};
  const key = Object.keys(headers).find((candidate) => candidate.toLowerCase() === name.toLowerCase());
  return key ? String(headers[key] || "") : "";
}

function publicHeaders(event) {
  const origin = eventHeader(event, "origin");
  return {
    ...securityHeaders,
    ...(publicOrigins.has(origin) ? { "access-control-allow-origin": origin, vary: "Origin" } : {}),
    "access-control-allow-headers": "content-type",
    "access-control-allow-methods": "POST, OPTIONS",
  };
}

function publicClientKey(event) {
  return String(event?.requestContext?.http?.sourceIp || event?.requestContext?.identity?.sourceIp || "unknown").slice(0, 64);
}

function publicRateLimited(event) {
  const now = Date.now();
  if (publicBuckets.size > 2_048) {
    for (const [bucketKey, bucketValue] of publicBuckets) {
      if (now - bucketValue.startedAt >= publicBucketWindowMs) publicBuckets.delete(bucketKey);
    }
  }
  for (const [key, limit] of [["global", publicGlobalRequestLimit], [`client:${publicClientKey(event)}`, publicRequestLimit]]) {
    const bucket = publicBuckets.get(key);
    if (!bucket || now - bucket.startedAt >= publicBucketWindowMs) {
      publicBuckets.set(key, { startedAt: now, count: 1 });
      continue;
    }
    bucket.count += 1;
    if (bucket.count > limit) return true;
  }
  return false;
}

function containsPrivateVisitorMaterial(question) {
  return (
    /\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/u.test(question) ||
    /\b(?:\+?1[ .-]?)?\(?\d{3}\)?[ .-]\d{3}[ .-]\d{4}\b/u.test(question) ||
    /\b(?:my|our|patient(?:'s)?)\s+(?:diagnosis|medical record|test result|symptom|medication)\b/iu.test(question)
  );
}

async function handlePublicNavigator(event) {
  const headers = publicHeaders(event);
  const origin = eventHeader(event, "origin");
  if (origin && !publicOrigins.has(origin)) return response(403, { error: "origin_not_allowed" }, headers);
  if (publicRateLimited(event)) return response(429, { error: "rate_limited" }, { ...headers, "retry-after": "60" });
  if (!modelAuthConfigured()) return response(503, { error: "navigator_temporarily_unavailable" }, headers);

  try {
    const body = requestBody(event);
    const question = typeof body?.question === "string" ? body.question.trim() : "";
    if (!isPlainObject(body) || question.length < 3 || question.length > 600) {
      return response(400, { error: "question_must_be_3_to_600_characters" }, headers);
    }
    if (containsForbiddenMaterial(body) || containsPrivateVisitorMaterial(question)) {
      return response(400, {
        error: "sensitive_material_not_allowed",
        message: "Please remove personal, patient, account, or other sensitive information and ask only for website guidance.",
      }, headers);
    }

    const result = await executeGraph({
      graphId: "publicNavigator",
      input: { question },
      context: { source: "public-website" },
      maxTurns: 3,
      maxRevisionCycles: 0,
    });
    const answer = normalizePublicAnswer(result.final);
    console.log("foundation-public-navigator-complete", JSON.stringify({ runId: result.runId, decision: result.decision }));
    return response(200, { ...answer, runId: result.runId }, headers);
  } catch (error) {
    if (error instanceof SyntaxError) return response(400, { error: "invalid_json" }, headers);
    if (error instanceof Error && error.message === "payload_too_large") return response(413, { error: "payload_too_large" }, headers);
    console.error("foundation-public-navigator-failed", error instanceof Error ? error.message : "unknown_error");
    return response(500, { error: "navigator_failed" }, headers);
  }
}

function redirect(event) {
  const path = requestPath(event);
  const query = typeof event?.rawQueryString === "string" && event.rawQueryString ? `?${event.rawQueryString}` : "";
  return {
    statusCode: 308,
    headers: {
      "cache-control": "public, max-age=300",
      location: `${canonicalOrigin}${path}${query}`,
      "referrer-policy": "no-referrer",
      "x-content-type-options": "nosniff",
    },
    body: "",
    isBase64Encoded: false,
  };
}

function graphIndex() {
  return Object.fromEntries(
    Object.entries(graphs).map(([graphId, graph]) => [
      graphId,
      {
        surface: graph.surface,
        description: graph.description,
        candidateNode: graph.candidateNode,
        nodes: graph.nodes,
      },
    ])
  );
}

function requestPath(event) {
  return event?.rawPath || event?.requestContext?.http?.path || "/";
}

function requestMethod(event) {
  return event?.requestContext?.http?.method || event?.httpMethod || "GET";
}

function requestBody(event) {
  if (!event?.body) return {};
  const text = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : String(event.body);
  if (Buffer.byteLength(text, "utf8") > maxRequestBytes) throw new Error("payload_too_large");
  return JSON.parse(text);
}

export async function handler(event) {
  const method = requestMethod(event);
  const path = requestPath(event);

  if (path === "/public/v1/navigate" && method === "OPTIONS") {
    const headers = publicHeaders(event);
    const origin = eventHeader(event, "origin");
    return response(origin && !publicOrigins.has(origin) ? 403 : 204, {}, headers);
  }
  if (path === "/public/v1/navigate" && method === "POST") return handlePublicNavigator(event);

  if (!path.startsWith("/internal/")) return redirect(event);

  if (method === "GET" && path === "/internal/health") {
    return response(200, {
      ok: true,
      service: "foundation-agents",
      modelConfigured: modelAuthConfigured(),
      modelAuthMode: modelAuthMode(),
      surface: "internal",
    });
  }

  if (method === "GET" && path === "/internal/v1/graphs") {
    return response(200, { graphs: graphIndex() });
  }

  if (method !== "POST" || path !== "/internal/v1/run") return response(404, { error: "not_found" });
  if (!modelAuthConfigured()) return response(503, { error: "model_service_not_configured" });

  try {
    const body = requestBody(event);
    if (!isPlainObject(body)) return response(400, { error: "invalid_body" });

    const graphId = typeof body.graphId === "string" ? body.graphId : "";
    if (!graphs[graphId]) return response(400, { error: "invalid_graph" });
    if (body.input === undefined || body.input === null) return response(400, { error: "input_required" });
    if (body.context !== undefined && !isPlainObject(body.context)) return response(400, { error: "invalid_context" });
    if (containsForbiddenMaterial(body)) return response(400, { error: "sensitive_material_not_allowed" });

    const result = await executeGraph({
      graphId,
      input: body.input,
      context: body.context || {},
      maxRevisionCycles: 1,
    });
    console.log(
      "foundation-agent-run-complete",
      JSON.stringify({
        runId: result.runId,
        graphId: result.graphId,
        surface: result.surface,
        status: result.status,
        decision: result.decision,
        revisionCount: result.revisionCount,
      })
    );
    return response(200, result);
  } catch (error) {
    if (error instanceof SyntaxError) return response(400, { error: "invalid_json" });
    if (error instanceof Error && error.message === "payload_too_large") return response(413, { error: "payload_too_large" });
    console.error("foundation-agent-lambda-run-failed", error instanceof Error ? error.message : "unknown_error");
    return response(500, { error: "agent_run_failed" });
  }
}
