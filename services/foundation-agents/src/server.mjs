import { timingSafeEqual } from "node:crypto";
import http from "node:http";
import { executeGraph, graphs } from "./graph.mjs";

const port = Number(process.env.PORT || 8788);
const maxBytes = 65_536;
const maxRequestsPerMinute = 30;
const forbiddenKeys = new Set([
  "password",
  "passcode",
  "secret",
  "token",
  "apiKey",
  "api_key",
  "authorization",
  "cookie",
  "ssn",
  "socialSecurityNumber",
  "dateOfBirth",
  "dob",
  "medicalRecord",
  "medicalRecordNumber",
  "diagnosis",
]);
const forbiddenValuePatterns = [
  /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/u,
  /\bAKIA[0-9A-Z]{16}\b/u,
  /\b(?:ghp_|github_pat_)[A-Za-z0-9_]{20,}\b/u,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/u,
  /\b\d{3}-\d{2}-\d{4}\b/u,
];
const requestBuckets = new Map();

function json(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  });
  response.end(JSON.stringify(body));
}

function constantTimeEqual(actual, expected) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(actualBuffer, expectedBuffer);
}

function authorized(request) {
  const expected = process.env.FOUNDATION_AGENT_SERVICE_TOKEN;
  if (!expected || expected.length < 24) return false;
  const actual = typeof request.headers.authorization === "string" ? request.headers.authorization : "";
  return constantTimeEqual(actual, `Bearer ${expected}`);
}

function clientKey(request) {
  const forwarded = typeof request.headers["x-forwarded-for"] === "string" ? request.headers["x-forwarded-for"].split(",")[0].trim() : "";
  return forwarded || request.socket.remoteAddress || "unknown";
}

function rateLimited(request) {
  const key = clientKey(request);
  const now = Date.now();
  const minute = 60_000;
  const current = requestBuckets.get(key);
  if (!current || now - current.startedAt >= minute) {
    requestBuckets.set(key, { startedAt: now, count: 1 });
    return false;
  }
  current.count += 1;
  return current.count > maxRequestsPerMinute;
}

function containsForbiddenMaterial(value) {
  if (typeof value === "string") return forbiddenValuePatterns.some((pattern) => pattern.test(value));
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(containsForbiddenMaterial);
  return Object.entries(value).some(([key, child]) => forbiddenKeys.has(key) || containsForbiddenMaterial(child));
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBytes) throw new Error("payload_too_large");
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
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

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  if (request.method === "GET" && url.pathname === "/health") {
    return json(response, 200, { ok: true, service: "foundation-agents" });
  }

  if (request.method === "GET" && url.pathname === "/v1/graphs") {
    if (!authorized(request)) return json(response, 401, { error: "unauthorized" });
    return json(response, 200, { graphs: graphIndex() });
  }

  if (request.method !== "POST" || url.pathname !== "/v1/run") {
    return json(response, 404, { error: "not_found" });
  }

  if (!authorized(request)) return json(response, 401, { error: "unauthorized" });
  if (rateLimited(request)) return json(response, 429, { error: "rate_limited" });
  if (!process.env.OPENAI_API_KEY) return json(response, 503, { error: "model_service_not_configured" });

  try {
    const body = await readJson(request);
    if (!body || typeof body !== "object" || Array.isArray(body)) return json(response, 400, { error: "invalid_body" });

    const graphId = typeof body.graphId === "string" ? body.graphId : "";
    if (!graphs[graphId]) return json(response, 400, { error: "invalid_graph" });
    if (body.input === undefined || body.input === null) return json(response, 400, { error: "input_required" });
    if (body.context !== undefined && (!body.context || typeof body.context !== "object" || Array.isArray(body.context))) {
      return json(response, 400, { error: "invalid_context" });
    }
    if (containsForbiddenMaterial(body)) return json(response, 400, { error: "sensitive_material_not_allowed" });

    const result = await executeGraph({
      graphId,
      input: body.input,
      context: body.context || {},
      maxRevisionCycles: 1,
    });
    return json(response, 200, result);
  } catch (error) {
    if (error instanceof SyntaxError) return json(response, 400, { error: "invalid_json" });
    if (error instanceof Error && error.message === "payload_too_large") return json(response, 413, { error: "payload_too_large" });
    console.error("foundation-agent-run-failed", error instanceof Error ? error.message : "unknown_error");
    return json(response, 500, { error: "agent_run_failed" });
  }
});

server.listen(port, () => {
  console.log(`foundation-agents listening on ${port}`);
});
