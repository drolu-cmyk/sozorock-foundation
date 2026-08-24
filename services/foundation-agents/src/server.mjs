import http from "node:http";
import { authorizedHeader, containsForbiddenMaterial, isPlainObject, maxRequestBytes, maxRequestsPerMinute } from "./boundary.mjs";
import { executeGraph, graphs } from "./graph.mjs";

const port = Number(process.env.PORT || 8788);
const trustProxyHeaders = process.env.TRUST_PROXY_HEADERS === "true";
const requestBuckets = new Map();
const bucketWindowMs = 60_000;
const bucketPruneThreshold = 2_048;
const bucketHardLimit = 4_096;

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

function authorized(request) {
  return authorizedHeader(request.headers.authorization, process.env.FOUNDATION_AGENT_SERVICE_TOKEN);
}

function clientKey(request) {
  if (trustProxyHeaders && typeof request.headers["x-forwarded-for"] === "string") {
    const forwarded = request.headers["x-forwarded-for"].split(",")[0].trim().slice(0, 64);
    if (forwarded) return forwarded;
  }
  return String(request.socket.remoteAddress || "unknown").slice(0, 64);
}

function pruneExpiredBuckets(now) {
  for (const [key, bucket] of requestBuckets.entries()) {
    if (now - bucket.startedAt >= bucketWindowMs) requestBuckets.delete(key);
  }
}

function rateLimited(request) {
  const now = Date.now();
  if (requestBuckets.size >= bucketPruneThreshold) pruneExpiredBuckets(now);

  const key = clientKey(request);
  const current = requestBuckets.get(key);
  if (!current) {
    if (requestBuckets.size >= bucketHardLimit) return true;
    requestBuckets.set(key, { startedAt: now, count: 1 });
    return false;
  }

  if (now - current.startedAt >= bucketWindowMs) {
    requestBuckets.set(key, { startedAt: now, count: 1 });
    return false;
  }

  current.count += 1;
  return current.count > maxRequestsPerMinute;
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxRequestBytes) throw new Error("payload_too_large");
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
    if (!isPlainObject(body)) return json(response, 400, { error: "invalid_body" });

    const graphId = typeof body.graphId === "string" ? body.graphId : "";
    if (!graphs[graphId]) return json(response, 400, { error: "invalid_graph" });
    if (body.input === undefined || body.input === null) return json(response, 400, { error: "input_required" });
    if (body.context !== undefined && !isPlainObject(body.context)) return json(response, 400, { error: "invalid_context" });
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
