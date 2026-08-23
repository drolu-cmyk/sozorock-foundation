import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import worker, { APP_ROUTES, LEGACY_ROUTES } from "../worker/index.js";

test("redirects the apex domain to the canonical www host", async () => {
  const response = await worker.fetch(new Request("https://sozorockfoundation.org/publications?source=apex", {
    headers: { accept: "text/html" },
  }), { ASSETS: { fetch: async () => { throw new Error("assets should not be called"); } } });

  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "https://www.sozorockfoundation.org/publications?source=apex");
});

test("serves every permanent route from its prebuilt route-specific HTML", async () => {
  for (const pathname of APP_ROUTES) {
    const calls = [];
    const response = await worker.fetch(new Request(`https://example.test${pathname}`, {
      headers: { accept: "text/html" },
    }), {
      ASSETS: {
        fetch: async (request) => {
          const assetPath = new URL(request.url).pathname;
          calls.push(assetPath);
          const expected = pathname === "/" ? "/index.html" : `${pathname}.html`;
          return new Response(assetPath === expected ? "app" : "unexpected route", {
            status: assetPath === expected ? 200 : 404,
          });
        },
      },
    });

    assert.equal(response.status, 200, pathname);
    assert.deepEqual(calls, [pathname === "/" ? "/index.html" : `${pathname}.html`], pathname);
  }
});

test("marks the publication access page noindex at the HTTP layer", async () => {
  const response = await worker.fetch(new Request("https://example.test/publication/hsa-v1-2026/access", {
    headers: { accept: "text/html" },
  }), {
    ASSETS: { fetch: async () => new Response("access", { status: 200, headers: { "Content-Type": "text/html" } }) },
  });

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");
});

test("redirects legacy AWS clone routes to their canonical Sites routes", async () => {
  for (const [pathname, destination] of LEGACY_ROUTES) {
    const response = await worker.fetch(new Request(`https://example.test${pathname}?source=legacy`, {
      headers: { accept: "text/html" },
    }), { ASSETS: { fetch: async () => { throw new Error("assets should not be called"); } } });

    assert.equal(response.status, 301, pathname);
    assert.equal(response.headers.get("location"), `${destination}?source=legacy`, pathname);
  }
});

test("removes trailing slashes without losing query parameters", async () => {
  const response = await worker.fetch(new Request("https://example.test/publications/?ref=library", {
    headers: { accept: "text/html" },
  }), { ASSETS: { fetch: async () => { throw new Error("assets should not be called"); } } });

  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "/publications?ref=library");
});

test("serves existing static assets without a fallback", async () => {
  const calls = [];
  const response = await worker.fetch(new Request("https://example.test/assets/app.js"), {
    ASSETS: {
      fetch: async (request) => {
        calls.push(new URL(request.url).pathname);
        return new Response("asset", { status: 200 });
      },
    },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/assets/app.js"]);
});

test("renders the app shell with a true 404 for an unknown route", async () => {
  const calls = [];
  const response = await worker.fetch(
    new Request("https://example.test/flow/step-two?source=share", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async (request) => {
          const url = new URL(request.url);
          calls.push(url.pathname + url.search);
          return new Response(url.pathname === "/index.html" ? "app" : "missing", {
            status: url.pathname === "/index.html" ? 200 : 404,
          });
        },
      },
    },
  );

  assert.equal(response.status, 404);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");
  assert.deepEqual(calls, ["/flow/step-two?source=share", "/index.html"]);
});

test("does not turn missing API or write requests into the app shell", async () => {
  for (const request of [
    new Request("https://example.test/api/missing", { headers: { accept: "application/json" } }),
    new Request("https://example.test/flow", { method: "POST", headers: { accept: "text/html" } }),
  ]) {
    let calls = 0;
    const response = await worker.fetch(request, {
      ASSETS: {
        fetch: async () => {
          calls += 1;
          return new Response("missing", { status: 404 });
        },
      },
    });

    assert.equal(response.status, 404);
    assert.equal(calls, 1);
  }
});

test("redirects every publication file to verified access", async () => {
  for (const pathname of [
    "/publications/hsa-volume-1-2026.pdf",
    "/publications/hsa-volume-1-2026.bib",
    "/publications/hsa-volume-1-2026.ris",
  ]) {
    let assetCalls = 0;
    const response = await worker.fetch(new Request(`https://example.test${pathname}`), {
      ASSETS: { fetch: async () => { assetCalls += 1; return new Response("asset"); } },
    });
    assert.equal(response.status, 302);
    assert.equal(response.headers.get("location"), "/publication/hsa-v1-2026/access");
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(assetCalls, 0);
  }
});

const validAccessPayload = {
  firstName: "Amina",
  lastName: "Okafor",
  email: "amina@example.org",
  organization: "Example University",
  sector: "University or research",
  cityOrRegion: "Albany",
  state: "New York",
  country: "United States",
  reason: "Reviewing evidence methods for an academic health systems project.",
  website: "",
  deliveryConsent: true,
  updatesConsent: false,
};

test("forwards a valid access request to the established Health verification service", async () => {
  const upstreamCalls = [];
  const response = await worker.fetch(new Request("https://example.test/api/publications/access/hsa-v1-2026", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validAccessPayload),
  }), {
    UPSTREAM_FETCH: async (url, options) => {
      upstreamCalls.push({ url, options, body: JSON.parse(options.body) });
      return Response.json({ accepted: true, verificationSent: true, message: "Your publication is ready to download." }, { status: 202 });
    },
  });

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(upstreamCalls.length, 1);
  assert.equal(upstreamCalls[0].url, "https://health.sozorockfoundation.org/api/publications/access/health-systems-assurance-volume-1");
  assert.equal(upstreamCalls[0].options.headers.Origin, "https://health.sozorockfoundation.org");
  assert.equal(upstreamCalls[0].options.headers.Referer, "https://health.sozorockfoundation.org/publications/health-systems-assurance-volume-1/access");
  assert.equal(upstreamCalls[0].body.email, "amina@example.org");
  assert.equal(upstreamCalls[0].body.updatesConsent, false);
  assert.deepEqual(await response.json(), { message: "Check your email for a verification link. It expires in 30 minutes." });
});

test("does not claim verification was sent when the delivery service reports otherwise", async () => {
  const response = await worker.fetch(new Request("https://example.test/api/publications/access/hsa-v1-2026", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validAccessPayload),
  }), {
    UPSTREAM_FETCH: async () => Response.json({ accepted: true, verificationSent: false }, { status: 202 }),
  });
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: "Email verification is temporarily unavailable. Please try again later." });
});

test("rejects invalid access requests before contacting the verification service", async () => {
  let upstreamCalls = 0;
  const response = await worker.fetch(new Request("https://example.test/api/publications/access/hsa-v1-2026", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...validAccessPayload, email: "not-an-email", deliveryConsent: false }),
  }), {
    UPSTREAM_FETCH: async () => { upstreamCalls += 1; return Response.json({}); },
  });

  assert.equal(response.status, 400);
  assert.equal(upstreamCalls, 0);
});

test("quietly accepts honeypot submissions without sending email", async () => {
  let upstreamCalls = 0;
  const response = await worker.fetch(new Request("https://example.test/api/publications/access/hsa-v1-2026", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...validAccessPayload, website: "https://spam.example" }),
  }), {
    UPSTREAM_FETCH: async () => { upstreamCalls += 1; return Response.json({}); },
  });

  assert.equal(response.status, 200);
  assert.equal(upstreamCalls, 0);
});

test("rejects repeated-character and placeholder form entries", async () => {
  let upstreamCalls = 0;
  const response = await worker.fetch(new Request("https://example.test/api/publications/access/hsa-v1-2026", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...validAccessPayload,
      firstName: "The",
      lastName: "Foundation",
      organization: "bbb",
      cityOrRegion: "hhh",
      state: "nnn",
      reason: "hbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    }),
  }), {
    UPSTREAM_FETCH: async () => { upstreamCalls += 1; return Response.json({}); },
  });

  assert.equal(response.status, 400);
  assert.equal(upstreamCalls, 0);
});

const validContactPayload = {
  name: "Amina Okafor",
  email: "amina@example.org",
  organization: "Example University",
  inquiryType: "Partner with us",
  role: "University or researcher",
  stateOrCounty: "Albany, New York",
  message: "We would like to discuss a public-interest research briefing.",
  website: "",
  consent: true,
};

test("forwards valid Partner and Support inquiries to the established Health contact service", async () => {
  const upstreamCalls = [];
  const response = await worker.fetch(new Request("https://example.test/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validContactPayload),
  }), {
    UPSTREAM_FETCH: async (url, options) => {
      upstreamCalls.push({ url, options, body: JSON.parse(options.body) });
      return Response.json({ message: "Thank you. Your inquiry has been received." });
    },
  });

  assert.equal(response.status, 200);
  assert.equal(upstreamCalls.length, 1);
  assert.equal(upstreamCalls[0].url, "https://health.sozorockfoundation.org/api/contact");
  assert.equal(upstreamCalls[0].options.headers.Origin, "https://health.sozorockfoundation.org");
  assert.equal(upstreamCalls[0].options.headers.Referer, "https://health.sozorockfoundation.org/contact");
  assert.equal(upstreamCalls[0].body.role, "University or researcher");
  assert.match(upstreamCalls[0].body.message, /Organization or affiliation: Example University/u);
});

test("rejects invalid contact submissions and quietly accepts the honeypot", async () => {
  let upstreamCalls = 0;
  const invalid = await worker.fetch(new Request("https://example.test/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...validContactPayload, name: "Test", consent: false }),
  }), { UPSTREAM_FETCH: async () => { upstreamCalls += 1; return Response.json({}); } });
  const honeypot = await worker.fetch(new Request("https://example.test/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...validContactPayload, website: "https://spam.example" }),
  }), { UPSTREAM_FETCH: async () => { upstreamCalls += 1; return Response.json({}); } });

  assert.equal(invalid.status, 400);
  assert.equal(honeypot.status, 200);
  assert.equal(upstreamCalls, 0);
});

test("emits the files required by Sites packaging", async () => {
  await access(new URL("../dist/client/index.html", import.meta.url));
  await access(new URL("../dist/server/index.js", import.meta.url));
  await access(new URL("../dist/.openai/hosting.json", import.meta.url));
  for (const pathname of APP_ROUTES) {
    if (pathname === "/") continue;
    await access(new URL(`../dist/client${pathname}.html`, import.meta.url));
  }
});

test("emits unique canonical SEO metadata and valid schema for every indexable route", async () => {
  const titles = new Set();
  for (const pathname of APP_ROUTES) {
    const file = pathname === "/" ? "../dist/client/index.html" : `../dist/client${pathname}.html`;
    const html = await readFile(new URL(file, import.meta.url), "utf8");
    const title = html.match(/<title>([^<]+)<\/title>/u)?.[1];
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/u)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/u)?.[1];
    const schemaText = html.match(/<script id="site-schema" type="application\/ld\+json">([^<]+)<\/script>/u)?.[1];
    assert.ok(title, `${pathname} title`);
    assert.ok(description && description.length <= 160, `${pathname} concise description`);
    assert.equal(canonical, `https://www.sozorockfoundation.org${pathname === "/" ? "" : pathname}`, `${pathname} canonical`);
    assert.match(html, /<meta property="og:title"/u, `${pathname} Open Graph title`);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image"/u, `${pathname} X card`);
    assert.match(html, /<meta name="sozorock-release" content="sites-seo-2026-08-23"/u, `${pathname} release marker`);
    assert.ok(schemaText, `${pathname} schema`);
    assert.doesNotThrow(() => JSON.parse(schemaText), `${pathname} valid JSON-LD`);
    if (pathname !== "/publication/hsa-v1-2026/access") {
      assert.ok(!titles.has(title), `${pathname} unique title`);
      titles.add(title);
    }
  }
});

test("ships crawl controls, sitemap, favicon, and social images", async () => {
  const robots = await readFile(new URL("../dist/client/robots.txt", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../dist/client/sitemap.xml", import.meta.url), "utf8");
  assert.match(robots, /User-agent: OAI-SearchBot[\s\S]*Allow: \//u);
  assert.match(robots, /Sitemap: https:\/\/www\.sozorockfoundation\.org\/sitemap\.xml/u);
  assert.doesNotMatch(sitemap, /publication\/hsa-v1-2026\/access/u);
  for (const pathname of APP_ROUTES) {
    if (pathname === "/publication/hsa-v1-2026/access") continue;
    assert.match(sitemap, new RegExp(`<loc>https://www\\.sozorockfoundation\\.org${pathname === "/" ? "/" : pathname}</loc>`, "u"), pathname);
  }
  for (const file of [
    "../dist/client/favicon.ico",
    "../dist/client/favicon.svg",
    "../dist/client/apple-touch-icon.png",
    "../dist/client/media/sozorock-social-card.png",
    "../dist/client/media/hsa-social-card.png",
    "../dist/client/media/rrg-social-card.png",
    "../dist/client/media/rebs-social-card.png",
  ]) await access(new URL(file, import.meta.url));
});

test("keeps Partner and Support as real, consent-based service submissions", async () => {
  const source = await readFile(new URL("../src/components.jsx", import.meta.url), "utf8");
  assert.match(source, /fetch\("\/api\/contact"/u);
  assert.match(source, /name="firstName"[\s\S]*required/u);
  assert.match(source, /name="email"[\s\S]*required/u);
  assert.match(source, /name="role"[\s\S]*required/u);
  assert.match(source, /name="location"[\s\S]*required/u);
  assert.match(source, /name="interest"[\s\S]*required/u);
  assert.match(source, /name="message"[\s\S]*required/u);
  assert.match(source, /name="consent"[\s\S]*required/u);
  assert.doesNotMatch(source, /open publications/iu);
});
