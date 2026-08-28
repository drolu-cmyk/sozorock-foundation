#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSeoForPath } from "../src/seo.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const index = path.join(dist, "client", "index.html");
const worker = path.join(root, "worker", "index.js");
const hosting = path.join(root, ".openai", "hosting.json");
const permanentRoutes = [
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
];

for (const file of [index, worker, hosting]) {
  if (!existsSync(file)) throw new Error("Missing production build input: " + file);
}

mkdirSync(path.join(dist, "server"), { recursive: true });
mkdirSync(path.join(dist, ".openai"), { recursive: true });
copyFileSync(worker, path.join(dist, "server", "index.js"));
copyFileSync(hosting, path.join(dist, ".openai", "hosting.json"));

const baseHtml = readFileSync(index, "utf8");

function escapeAttribute(value) {
  return String(value)
    .replace(/&/gu, "&amp;")
    .replace(/"/gu, "&quot;")
    .replace(/</gu, "&lt;")
    .replace(/>/gu, "&gt;");
}

function replaceTitle(html, value) {
  return html.replace(/<title>[\s\S]*?<\/title>/u, `<title>${escapeAttribute(value)}</title>`);
}

function upsertMeta(html, attribute, name, content) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const pattern = new RegExp(`<meta\\s+${attribute}="${escapedName}"[^>]*>`, "u");
  const tag = `<meta ${attribute}="${escapeAttribute(name)}" content="${escapeAttribute(content)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function upsertCanonical(html, href) {
  const tag = `<link rel="canonical" href="${escapeAttribute(href)}" />`;
  return /<link\s+rel="canonical"[^>]*>/u.test(html)
    ? html.replace(/<link\s+rel="canonical"[^>]*>/u, tag)
    : html.replace("</head>", `    ${tag}\n  </head>`);
}

function routeHtml(route) {
  const seo = getSeoForPath(route);
  let html = replaceTitle(baseHtml, seo.title);
  html = upsertCanonical(html, seo.canonicalUrl);
  html = upsertMeta(html, "name", "description", seo.description);
  html = upsertMeta(html, "name", "keywords", seo.keywords);
  html = upsertMeta(html, "name", "robots", seo.robots);
  html = upsertMeta(html, "property", "og:site_name", "The SozoRock Foundation");
  html = upsertMeta(html, "property", "og:locale", "en_US");
  html = upsertMeta(html, "property", "og:title", seo.title);
  html = upsertMeta(html, "property", "og:description", seo.description);
  html = upsertMeta(html, "property", "og:url", seo.canonicalUrl);
  html = upsertMeta(html, "property", "og:type", seo.ogType);
  html = upsertMeta(html, "property", "og:image", seo.image);
  html = upsertMeta(html, "property", "og:image:secure_url", seo.image);
  html = upsertMeta(html, "property", "og:image:type", "image/png");
  html = upsertMeta(html, "property", "og:image:width", "1200");
  html = upsertMeta(html, "property", "og:image:height", "630");
  html = upsertMeta(html, "property", "og:image:alt", seo.imageAlt);
  html = upsertMeta(html, "name", "twitter:card", "summary_large_image");
  html = upsertMeta(html, "name", "twitter:domain", "sozorockfoundation.org");
  html = upsertMeta(html, "name", "twitter:site", "@srockfoundation");
  html = upsertMeta(html, "name", "twitter:creator", "@srockfoundation");
  html = upsertMeta(html, "name", "twitter:title", seo.title);
  html = upsertMeta(html, "name", "twitter:description", seo.description);
  html = upsertMeta(html, "name", "twitter:image", seo.image);
  html = upsertMeta(html, "name", "twitter:image:alt", seo.imageAlt);
  if (seo.publication) {
    html = upsertMeta(html, "property", "article:published_time", seo.publication.dateMachine || seo.publication.date);
    html = upsertMeta(html, "property", "article:section", seo.publication.theme);
    const citation = {
      citation_title: `${seo.publication.title}, ${seo.publication.volume}: ${seo.publication.subtitle || seo.publication.tagline}`,
      citation_author: seo.publication.author,
      citation_publication_date: seo.publication.dateMachine || seo.publication.date,
      citation_publisher: seo.publication.publisher || "The SozoRock Foundation, Inc.",
      citation_isbn: seo.publication.isbn,
      citation_language: seo.publication.languageCode || "en-US",
      citation_abstract: seo.publication.description,
      citation_doi: seo.publication.doi,
    };
    Object.entries(citation).forEach(([name, content]) => {
      if (content) html = upsertMeta(html, "name", name, content);
    });
  }
  const schema = JSON.stringify(seo.schema).replace(/</gu, "\\u003c");
  html = html.replace(/\s*<script id="site-schema"[\s\S]*?<\/script>/u, "");
  return html.replace("</head>", `    <script id="site-schema" type="application/ld+json">${schema}</script>\n  </head>`);
}

writeFileSync(index, routeHtml("/"));

let notFoundHtml = routeHtml("/");
notFoundHtml = upsertMeta(notFoundHtml, "name", "robots", "noindex, nofollow, noarchive");
notFoundHtml = notFoundHtml.replace(/<link\s+rel="canonical"[^>]*>\s*/u, "");
writeFileSync(path.join(dist, "client", "404.html"), notFoundHtml);

// CloudFront rewrites clean routes to these crawler-ready entries. The same
// files preserve the compatibility worker contract for alternate previews.
for (const route of permanentRoutes) {
  const routeFile = path.join(dist, "client", `${route.slice(1)}.html`);
  mkdirSync(path.dirname(routeFile), { recursive: true });
  writeFileSync(routeFile, routeHtml(route));
}

console.log(`Prepared CloudFront build with ${permanentRoutes.length} crawler-ready route entries and the dynamic React runtime.`);
