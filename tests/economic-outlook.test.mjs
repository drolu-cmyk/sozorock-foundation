import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { economicOutlooks } from "../src/outlooks.js";
import { getSeoForPath } from "../src/seoRuntime.js";
import worker from "../worker/index.js";

const outlook = economicOutlooks[0];
test("outlook article is crawlable, citable, and readable before verified download", () => {
  const html = readFileSync(`dist/client${outlook.path}.html`, "utf8");
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
  assert.ok(html.indexOf(outlook.abstract) < html.indexOf("Download the nine-page report"));
  for (const section of outlook.article.sections) assert.ok(html.includes(section.heading));
  assert.equal((html.match(/<table>/g) || []).length, 3);
  assert.match(html, /citation_author" content="Adeyemo, Oluwabiyi"/);
  assert.match(html, /0009-0008-5215-5609/);
  assert.doesNotMatch(html, /citation_doi|citation_pdf_url|href="[^"<>]*\.pdf(?:["?])/i);
  assert.ok(html.includes(outlook.socialImage));
  assert.ok(existsSync(`public${outlook.socialImage}`));
  assert.ok(readFileSync("public/sitemap.xml", "utf8").includes(outlook.canonicalUrl));
  const seo = getSeoForPath(outlook.path);
  assert.equal(seo.ogType, "article");
  assert.equal(seo.imageAlt, outlook.imageAlt);
  const access = getSeoForPath(outlook.accessPath);
  assert.match(access.robots, /noindex/);
});

test("outlook access validates the request and uses the matching verified delivery record", async () => {
  let forwarded;
  const response = await worker.fetch(new Request(`https://www.sozorockfoundation.org/api/publications/access/${outlook.slug}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({firstName:"Amina",lastName:"Okafor",email:"amina@example.org",organization:"Not provided by reader",sector:"Other",cityOrRegion:"Not provided by reader",state:"Not provided by reader",country:"Not provided by reader",reason:"Publication access requested without optional readership details.",deliveryConsent:true,updatesConsent:false,website:""}),
  }), { UPSTREAM_FETCH: async (url, init) => { forwarded={url, body:JSON.parse(init.body)};return Response.json({accepted:true,verificationSent:true}); } });
  assert.equal(response.status, 200);
  assert.equal(forwarded.url, "https://health.sozorockfoundation.org/api/publications/access/economic-outlook-october-2026");
  assert.equal(forwarded.body.updatesConsent, false);
  assert.equal((await response.json()).verificationSent, true);
});
