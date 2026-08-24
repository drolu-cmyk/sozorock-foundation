import http from "node:http";
import { executeGraph, graphs } from "./graph.mjs";

const port = Number(process.env.PORT || 8788);
const maxBytes = 65_536;
const forbiddenKeys = new Set([
  "password",
  "passcode",
  "secret",
  "token",
  "apiKey",
  "ssn",
  "socialSecurityNumber",
  "dateOfBirth",
  "dob",
  "medicalRecord",
  "diagnosis",
]);

function json(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(JSON.stringify(body));
}

function authorized(request) {
  const expected = process.env.FOUNDATION_AGENT_SERVICE_TOKEN;
  if (!expected) return false;
  return request.headers.authorization === `Bearer ${expected}`;
}

function containsForbiddenKey(value) {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(containsForbiddenKey);
  return Object.entries(value).some(([key, child]) => forbiddenKeys.has(key) || containsForbiddenKey(child));
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

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  if (request.method === "GET" && url.pathname === "/health") {
    return json(response, 200, { ok: true, service: "foundation-agents" });
  }

  if (request.method !== "POST" || url.pathname !== "/v1/run") {
    return json(response, 404, { error: "not_found" });
  }

  if (!authorized(request)) return json(response, 401, { error: "unauthorized" });
  if (!process.env.OPENAI_API_KEY) return json(response, 503, { error: "model_service_not_configured" });

  try {
    const body = await readJson(request);
    const graphId = typeof body.graphId === "string" ? body.graphId : "";
    if (!graphs[graphId]) return json(response, 400, { error: "invalid_graph" });
    if (body.input === undefined || body.input === null) return json(response, 400, { error: "input_required" });
    if (containsForbiddenKey(body)) return json(response, 400, { error: "sensitive_fields_not_allowed" });

    const result = await executeGraph({
      graphId,
      input: body.input,
      context: body.context || {},
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
