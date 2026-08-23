import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import worker, { APP_ROUTES, LEGACY_ROUTES } from "../worker/index.js";

test("serves every permanent route directly from the app shell", async () => {
  for (const pathname of APP_ROUTES) {
    const calls = [];
    const response = await worker.fetch(new Request(`https://example.test${pathname}`, {
      headers: { accept: "text/html" },
    }), {
      ASSETS: {
        fetch: async (request) => {
          const assetPath = new URL(request.url).pathname;
          calls.push(assetPath);
          return new Response(assetPath === "/index.html" ? "app" : "unexpected redirect", {
            status: assetPath === "/index.html" ? 200 : 301,
          });
        },
      },
    });

    assert.equal(response.status, 200, pathname);
    assert.deepEqual(calls, ["/index.html"], pathname);
  }
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

test("falls back to index.html for an unknown app route", async () => {
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

  assert.equal(response.status, 200);
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
      return Response.json({ message: "Check your email for a verification link." });
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
  assert.deepEqual(await response.json(), { message: "Check your email for a verification link." });
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

test("emits the files required by Sites packaging", async () => {
  await access(new URL("../dist/client/index.html", import.meta.url));
  await access(new URL("../dist/server/index.js", import.meta.url));
  await access(new URL("../dist/.openai/hosting.json", import.meta.url));
});
