const ACCESS_SERVICE_ORIGIN = "https://health.sozorockfoundation.org";
const MAX_REQUEST_BYTES = 16_384;
const ACCESS_ROUTES = new Map([
  ["hsa-v1-2026", "health-systems-assurance-volume-1"],
]);
const PRIVATE_PUBLICATION_FILES = new Map([
  ["/publications/hsa-volume-1-2026.pdf", "/publication/hsa-v1-2026/access"],
  ["/publications/hsa-volume-1-2026.bib", "/publication/hsa-v1-2026/access"],
  ["/publications/hsa-volume-1-2026.ris", "/publication/hsa-v1-2026/access"],
]);
export const APP_ROUTES = new Set([
  "/",
  "/platforms",
  "/platforms/institute",
  "/platforms/health",
  "/platforms/ai-lab",
  "/publications",
  "/insights",
  "/events",
  "/about",
  "/leadership",
  "/partner",
  "/support",
  "/standards",
  "/publication/hsa-v1-2026",
  "/publication/hsa-v1-2026/access",
  "/publication/rrg-v1-2025",
  "/publication/rebs-v1-2025",
]);
export const LEGACY_ROUTES = new Map([
  ["/work", "/platforms"],
  ["/work/global-institute", "/platforms/institute"],
  ["/work/health", "/platforms/health"],
  ["/work/ai-lab", "/platforms/ai-lab"],
]);
const ALLOWED_SECTORS = new Set([
  "Community organization",
  "County or state agency",
  "Healthcare organization",
  "University or research",
  "Foundation or funder",
  "Policymaker",
  "Student",
  "Individual or family",
  "Other",
]);
const PLACEHOLDER_VALUES = new Set([
  "admin",
  "anonymous",
  "company",
  "foundation",
  "name",
  "none",
  "null",
  "organization",
  "test",
  "testing",
  "the",
  "unknown",
  "user",
]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  });
}

function textValue(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function normalizedCharacters(value) {
  return String(value || "").toLocaleLowerCase().match(/[\p{L}\p{N}]/gu) || [];
}

function isMeaningfulShortText(value, { personName = false } = {}) {
  const text = String(value || "").trim();
  if (text.length < 2 || PLACEHOLDER_VALUES.has(text.toLocaleLowerCase())) return false;
  if (personName && !/^[\p{L}][\p{L}\p{M} .'-]*$/u.test(text)) return false;
  const characters = normalizedCharacters(text);
  return characters.length >= 2 && new Set(characters).size >= 2 && !/(.)\1{3,}/iu.test(text);
}

function isMeaningfulReason(value) {
  const text = String(value || "").trim();
  const words = text.split(/\s+/u).filter((word) => normalizedCharacters(word).length >= 2);
  const characters = normalizedCharacters(text);
  return text.length >= 20 && text.length <= 800 && words.length >= 3 && new Set(characters).size >= 6 && !/(.)\1{3,}/iu.test(text);
}

function validateAccessPayload(input) {
  const payload = {
    firstName: textValue(input.firstName, 80),
    lastName: textValue(input.lastName, 80),
    email: textValue(input.email, 254).toLowerCase(),
    organization: textValue(input.organization, 180),
    sector: textValue(input.sector, 80),
    cityOrRegion: textValue(input.cityOrRegion, 120),
    state: textValue(input.state, 120),
    country: textValue(input.country, 120),
    reason: textValue(input.reason, 800),
    website: textValue(input.website, 200),
    deliveryConsent: input.deliveryConsent === true,
    updatesConsent: input.updatesConsent === true,
  };
  if (!isMeaningfulShortText(payload.firstName, { personName: true }) || !isMeaningfulShortText(payload.lastName, { personName: true })) return { error: "Enter a valid first and last name." };
  if (!/^\S+@\S+\.\S+$/.test(payload.email)) return { error: "Enter a valid email address." };
  if (!isMeaningfulShortText(payload.organization)) return { error: "Enter a complete organization or affiliation." };
  if (!ALLOWED_SECTORS.has(payload.sector)) return { error: "Select a valid role or sector." };
  if (!isMeaningfulShortText(payload.cityOrRegion)) return { error: "Enter a valid city or region." };
  if (!isMeaningfulShortText(payload.state)) return { error: "Enter a valid state, province, or territory." };
  if (!isMeaningfulShortText(payload.country)) return { error: "Enter a valid country." };
  if (!isMeaningfulReason(payload.reason)) return { error: "Use at least three meaningful words (20–800 characters) for your reason for interest." };
  if (!payload.deliveryConsent) return { error: "Consent is required to send the verification link." };
  return { payload };
}

async function handlePublicationAccess(request, env, slug) {
  const serviceSlug = ACCESS_ROUTES.get(slug);
  if (!serviceSlug) return json({ error: "Publication access route not found." }, 404);
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) return json({ error: "Request is too large." }, 413);
  let input;
  try {
    input = await request.json();
  } catch {
    return json({ error: "Submit the access form as JSON." }, 400);
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) return json({ error: "Invalid access request." }, 400);
  const serialized = JSON.stringify(input);
  if (serialized.length > MAX_REQUEST_BYTES) return json({ error: "Request is too large." }, 413);
  const result = validateAccessPayload(input);
  if (result.error) return json({ error: result.error }, 400);

  // Quietly accept honeypot submissions so automated form abuse receives no useful signal.
  if (result.payload.website) {
    return json({ message: "Check your email for a verification link." });
  }

  const upstreamFetch = typeof env.UPSTREAM_FETCH === "function" ? env.UPSTREAM_FETCH : fetch;
  let upstream;
  try {
    upstream = await upstreamFetch(`${ACCESS_SERVICE_ORIGIN}/api/publications/access/${encodeURIComponent(serviceSlug)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": ACCESS_SERVICE_ORIGIN,
        "Referer": `${ACCESS_SERVICE_ORIGIN}/publications/${encodeURIComponent(serviceSlug)}/access`,
        "X-SozoRock-Source": "parent-foundation",
      },
      body: JSON.stringify(result.payload),
    });
  } catch {
    return json({ error: "The verification service is temporarily unavailable. Please try again." }, 502);
  }

  const body = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    return json({ error: typeof body.error === "string" ? body.error : "We could not process this request." }, upstream.status >= 400 && upstream.status < 600 ? upstream.status : 502);
  }
  return json({ message: "Check your email for a verification link. It expires in 30 minutes." });
}

function redirect(url, pathname, status = 308) {
  const destination = new URL(url);
  destination.pathname = pathname;
  return new Response(null, {
    status,
    headers: {
      Location: `${destination.pathname}${destination.search}`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function serveAppShell(request, env) {
  const indexUrl = new URL(request.url);
  indexUrl.pathname = "/index.html";
  indexUrl.search = "";
  return env.ASSETS.fetch(new Request(indexUrl, request));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");
    const isDocumentRequest = acceptsHtml && ["GET", "HEAD"].includes(request.method);

    if (isDocumentRequest && url.pathname.length > 1 && url.pathname.endsWith("/")) {
      return redirect(url, url.pathname.replace(/\/+$/u, ""));
    }

    const legacyPath = LEGACY_ROUTES.get(url.pathname);
    if (isDocumentRequest && legacyPath) {
      return redirect(url, legacyPath, 301);
    }

    // Known client-side routes must reach the app shell before the static asset
    // layer can canonicalize an extensionless path back to the site root.
    if (isDocumentRequest && APP_ROUTES.has(url.pathname)) {
      return serveAppShell(request, env);
    }

    const privateAccessPath = PRIVATE_PUBLICATION_FILES.get(url.pathname);
    if (privateAccessPath) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: privateAccessPath,
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex, nofollow",
        },
      });
    }

    const accessMatch = url.pathname.match(/^\/api\/publications\/access\/([^/]+)$/);
    if (accessMatch) {
      if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
      return handlePublicationAccess(request, env, decodeURIComponent(accessMatch[1]));
    }

    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
      return response;
    }

    return serveAppShell(request, env);
  },
};
