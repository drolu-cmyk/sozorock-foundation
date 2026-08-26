const ACCESS_SERVICE_ORIGIN = "https://health.sozorockfoundation.org";
const APEX_HOSTNAME = "sozorockfoundation.org";
const CANONICAL_HOSTNAME = "www.sozorockfoundation.org";
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
  "/privacy",
  "/accessibility",
  "/nondiscrimination",
  "/terms",
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
const CONTACT_ROLES = new Set([
  "Individual or family",
  "Community organization",
  "Licensed provider or health organization",
  "County, state, or public agency",
  "University or researcher",
  "Foundation or funder",
  "Corporate organization",
  "Other",
]);
const CONTACT_INQUIRY_TYPES = new Set([
  "Partner with us",
  "CB-CAP inquiry",
  "Health Equity Hub partnership",
  "Health Access Day partnership",
  "Fund the work",
  "Support research and publications",
  "Bring the model to a community",
  "Institutional or public-sector inquiry",
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

function isMeaningfulMessage(value) {
  const text = String(value || "").trim();
  const words = text.split(/\s+/u).filter((word) => normalizedCharacters(word).length >= 2);
  const characters = normalizedCharacters(text);
  return text.length >= 20 && text.length <= 1200 && words.length >= 3 && new Set(characters).size >= 6 && !/(.)\1{3,}/iu.test(text);
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
    return json({ accepted: true, verificationSent: true, message: "Check your email for a verification link." });
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
  if (body.verificationSent !== true) {
    return json({ error: "Email verification is temporarily unavailable. Please try again later." }, 503);
  }
  return json({ accepted: true, verificationSent: true, message: "Check your email for a verification link. It expires in 30 minutes." });
}

function validateContactPayload(input) {
  const payload = {
    name: textValue(input.name, 160),
    email: textValue(input.email, 254).toLowerCase(),
    organization: textValue(input.organization, 180),
    inquiryType: textValue(input.inquiryType, 100),
    stateOrCounty: textValue(input.stateOrCounty, 160),
    role: textValue(input.role, 100),
    message: textValue(input.message, 1200),
    website: textValue(input.website, 200),
    consent: input.consent === true,
  };
  const nameParts = payload.name.split(/\s+/u).filter(Boolean);
  if (nameParts.length < 2 || !isMeaningfulShortText(payload.name, { personName: true })) return { error: "Enter your full name." };
  if (!/^\S+@\S+\.\S+$/.test(payload.email)) return { error: "Enter a valid email address." };
  if (!isMeaningfulShortText(payload.organization)) return { error: "Enter a complete organization or affiliation." };
  if (!CONTACT_INQUIRY_TYPES.has(payload.inquiryType)) return { error: "Select a valid area of interest." };
  if (!CONTACT_ROLES.has(payload.role)) return { error: "Select a valid organization or role." };
  if (!isMeaningfulShortText(payload.stateOrCounty)) return { error: "Enter a valid city, state, or region." };
  if (!isMeaningfulMessage(payload.message)) return { error: "Describe the outcome in at least three meaningful words (20–1,200 characters)." };
  if (!payload.consent) return { error: "Confirm that we may use this information to respond." };
  return { payload };
}

async function handleContact(request, env) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) return json({ error: "Request is too large." }, 413);
  let input;
  try {
    input = await request.json();
  } catch {
    return json({ error: "Submit the inquiry as JSON." }, 400);
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) return json({ error: "Invalid inquiry." }, 400);
  if (JSON.stringify(input).length > MAX_REQUEST_BYTES) return json({ error: "Request is too large." }, 413);
  const result = validateContactPayload(input);
  if (result.error) return json({ error: result.error }, 400);
  if (result.payload.website) return json({ message: "Thank you. Your inquiry has been received." });

  const upstreamFetch = typeof env.UPSTREAM_FETCH === "function" ? env.UPSTREAM_FETCH : fetch;
  const { organization, ...upstreamPayload } = result.payload;
  const organizationPrefix = `Organization or affiliation: ${organization}\n\n`;
  if (!upstreamPayload.message.startsWith(organizationPrefix)) {
    upstreamPayload.message = `${organizationPrefix}${upstreamPayload.message}`;
  }
  let upstream;
  try {
    upstream = await upstreamFetch(`${ACCESS_SERVICE_ORIGIN}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": ACCESS_SERVICE_ORIGIN,
        "Referer": `${ACCESS_SERVICE_ORIGIN}/contact`,
        "X-SozoRock-Source": "parent-foundation",
      },
      body: JSON.stringify(upstreamPayload),
    });
  } catch {
    return json({ error: "The inquiry service is temporarily unavailable. Email contact@sozorockfoundation.org if the problem continues." }, 502);
  }
  const body = await upstream.json().catch(() => ({}));
  if (!upstream.ok) return json({ error: typeof body.error === "string" ? body.error : "We could not send this inquiry right now." }, upstream.status >= 400 && upstream.status < 600 ? upstream.status : 502);
  return json({ message: typeof body.message === "string" ? body.message : "Thank you. Your inquiry has been received." });
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

function redirectToCanonicalHost(url) {
  const destination = new URL(url);
  destination.protocol = "https:";
  destination.hostname = CANONICAL_HOSTNAME;
  destination.port = "";
  return new Response(null, {
    status: 308,
    headers: {
      Location: destination.toString(),
      "Cache-Control": "public, max-age=86400",
    },
  });
}

async function serveHtml(request, env, pathname = "/", { status, noindex = false } = {}) {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = pathname === "/" ? "/index.html" : `${pathname}.html`;
  assetUrl.search = "";
  const assetResponse = await env.ASSETS.fetch(new Request(assetUrl, request));
  if (!status && !noindex) return assetResponse;
  const headers = new Headers(assetResponse.headers);
  if (noindex) headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return new Response(assetResponse.body, {
    status: status || assetResponse.status,
    statusText: assetResponse.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === APEX_HOSTNAME) {
      return redirectToCanonicalHost(url);
    }

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
      return serveHtml(request, env, url.pathname, {
        noindex: url.pathname === "/publication/hsa-v1-2026/access",
      });
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

    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
      return handleContact(request, env);
    }

    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
      return response;
    }

    return serveHtml(request, env, "/", { status: 404, noindex: true });
  },
};
