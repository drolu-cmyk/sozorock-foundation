import { Buffer } from "node:buffer";
import { containsForbiddenMaterial, isPlainObject, maxRequestBytes } from "./boundary.mjs";
import { executeGraph, graphs } from "./graph.mjs";

const securityHeaders = {
  "cache-control": "no-store",
  "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
  "content-type": "application/json; charset=utf-8",
  "referrer-policy": "no-referrer",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: securityHeaders,
    body: JSON.stringify(body),
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

  if (method === "GET" && path === "/health") {
    return response(200, {
      ok: true,
      service: "foundation-agents",
      modelConfigured: Boolean(process.env.OPENAI_API_KEY),
      surface: "internal",
    });
  }

  if (method === "GET" && path === "/v1/graphs") {
    return response(200, { graphs: graphIndex() });
  }

  if (method !== "POST" || path !== "/v1/run") return response(404, { error: "not_found" });
  if (!process.env.OPENAI_API_KEY) return response(503, { error: "model_service_not_configured" });

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
    return response(200, result);
  } catch (error) {
    if (error instanceof SyntaxError) return response(400, { error: "invalid_json" });
    if (error instanceof Error && error.message === "payload_too_large") return response(413, { error: "payload_too_large" });
    console.error("foundation-agent-lambda-run-failed", error instanceof Error ? error.message : "unknown_error");
    return response(500, { error: "agent_run_failed" });
  }
}
