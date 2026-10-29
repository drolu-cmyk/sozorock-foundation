import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const origin = "https://www.sozorockfoundation.org";
const records = [
  {
    slug: "hsa-v1-2026", date: "2026", datePublished: "2026-08",
    title: "Health Systems Assurance, Volume 1: From compliance to evidence-based digital assurance",
    report: "HSA Volume 1", isbn: "979-8-9936477-3-9",
  },
  {
    slug: "rrg-v1-2025", date: "2025", datePublished: "2025-11",
    title: "Rethinking Rural Governance: Volume 1 – Delaware County, New York — From Compliance to Systems Intelligence",
    report: "RRG Volume 1", doi: "10.65473/rrg-v1-2025",
  },
  {
    slug: "rebs-v1-2025", date: "2025", datePublished: "2025-10",
    title: "Access Day: Building a Framework for Rural Health Equity in New York State",
    report: "REBS Volume 1", isbn: "979-8-9936477-0-8", doi: "10.65473/rebs-v1-2025",
  },
  {
    slug: "economic-outlook-october-2026", date: "2026/10/27", datePublished: "2026-10-27",
    title: "SozoRock Outlook: Access, Capacity and Trust, October 2026", minimal: true,
  },
];

const decode = (value) => value?.replace(/&quot;/gu, '"').replace(/&lt;/gu, "<").replace(/&gt;/gu, ">").replace(/&amp;/gu, "&");
const meta = (html, name) => {
  const matches = [...html.matchAll(new RegExp(`<meta name="${name}" content="([^"]*)"`, "gu"))];
  assert.ok(matches.length <= 1, `${name} must not be duplicated`);
  return decode(matches[0]?.[1]);
};

test("prerendered publication citations match the publication records", () => {
  for (const record of records) {
    const html = readFileSync(`dist/client/publication/${record.slug}.html`, "utf8");
    const url = `${origin}/publication/${record.slug}`;
    for (const [name, expected] of Object.entries({
      citation_title: record.title,
      citation_author: "Adeyemo, Oluwabiyi",
      citation_publication_date: record.date,
      citation_technical_report_institution: "The SozoRock Foundation, Inc.",
      citation_technical_report_number: record.report,
      citation_publisher: "The SozoRock Foundation, Inc.",
      citation_abstract_html_url: url,
      citation_isbn: record.isbn,
      citation_doi: record.doi,
      citation_language: "en-US",
      citation_pdf_url: undefined,
    })) assert.equal(meta(html, name), expected, `${record.slug}: ${name}`);
    assert.equal(Boolean(meta(html, "citation_abstract")), !record.minimal, record.slug);
    assert.ok(html.includes(`<link rel="canonical" href="${url}"`), record.slug);

    const json = html.match(/<script id="site-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/u)?.[1];
    const report = JSON.parse(json)["@graph"].find((item) => item["@type"] === "Report");
    assert.equal(report.name, record.title);
    assert.equal(report.datePublished, record.datePublished);
    assert.equal(report.url, url);
    assert.equal(report.author.name, "Dr. Oluwabiyi Adeyemo");
    assert.ok(report.author.sameAs.includes("https://orcid.org/0009-0008-5215-5609"));
    const identifiers = Object.fromEntries(report.identifier.map((item) => [item.propertyID, item.value]));
    assert.equal(identifiers.ISBN, record.isbn);
    assert.equal(identifiers.DOI, record.doi);
  }
});

test("ordinary and access pages do not expose publication citation tags", () => {
  for (const path of ["index", "publications", ...records.map((record) => `publication/${record.slug}/access`)]) {
    const html = readFileSync(`dist/client/${path}.html`, "utf8");
    assert.doesNotMatch(html, /<meta name="citation_/u, path);
  }
});
