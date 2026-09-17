import { getSeoForPath as getBaseSeo } from "./seo.js";

const GLOBAL_SITE_DESCRIPTION = "Health access, applied learning, public-interest research and responsible AI for better decisions and implementation.";

const overrides = {
  "/": {
    title: "The SozoRock Foundation | Health Access, Applied Learning & Research",
    description: "The SozoRock Foundation develops health-access models, applied learning and public-interest research, including a planned 2027 New York primary-care pilot.",
    keywords: [
      "SozoRock Foundation",
      "health access",
      "New York health equity",
      "rural health access",
      "underserved communities",
      "primary care access",
      "applied learning",
      "experiential learning",
      "workforce capability",
      "public interest research",
      "AI governance",
      "health systems assurance",
    ],
  },
  "/platforms": {
    title: "Work | The SozoRock Foundation",
    description: "Choose a route into SozoRock's work: health access, applied learning, public-interest research, or AI & Society.",
    keywords: [
      "SozoRock Foundation work",
      "health access",
      "applied learning",
      "workforce capability",
      "public interest research",
      "AI and society",
      "health equity",
      "public systems",
    ],
  },
  "/platforms/applied-learning": {
    title: "Applied Learning & Workforce Capability | SozoRock Foundation",
    description: "Applied technology engagements that move graduate learners from academic knowledge into hands-on cybersecurity work, evidence review and professional judgment.",
    keywords: [
      "applied learning",
      "experiential learning",
      "workforce capability",
      "work-based learning",
      "cybersecurity workforce development",
      "graduate cybersecurity capstone",
      "academic industry collaboration",
      "industry aligned learning",
      "professional judgment",
      "identity and access management",
      "cloud security",
    ],
  },
  "/platforms/health": {
    title: "2027 New York Health Access Pilot | SozoRock Health",
    description: "A planned 2027 New York health-access pilot with direct primary care partner PIOC for residents facing barriers in rural and underserved communities.",
    keywords: [
      "2027 New York health access pilot",
      "health equity New York",
      "primary care access",
      "direct primary care",
      "rural health",
      "underserved communities",
      "health literacy",
      "place intelligence",
      "community health evidence",
      "SozoRock Health",
    ],
  },
  "/partner": {
    title: "Partner with SozoRock | The SozoRock Foundation",
    description: "Define a health-access, applied-learning, research or public-systems engagement with a clear problem, role and outcome.",
    keywords: [
      "university industry collaboration",
      "technology partnership",
      "workforce development partnership",
      "applied learning partner",
      "health access partnership",
      "public interest technology",
      "SozoRock Foundation",
    ],
  },
  "/support": {
    title: "Support the Work | The SozoRock Foundation",
    description: "Support health access, applied learning, public-interest research, community participation and the technology infrastructure behind the work.",
    keywords: [
      "nonprofit technology funding",
      "workforce development funding",
      "applied learning sponsorship",
      "health access funding",
      "technology credits nonprofit",
      "public interest research",
      "SozoRock Foundation",
    ],
  },
};

function cleanPath(pathname = "/") {
  const value = pathname.split(/[?#]/u)[0] || "/";
  return value.length > 1 ? value.replace(/\/+$/u, "") : "/";
}

function normalizeGlobalSchema(schema) {
  const graph = schema?.["@graph"]?.map((node) => {
    if (node?.["@type"] === "WebSite") return { ...node, description: GLOBAL_SITE_DESCRIPTION };
    return node;
  });
  return graph ? { ...schema, "@graph": graph } : schema;
}

function withSchema(base, config) {
  const keywords = config.keywords.join(", ");
  const normalized = normalizeGlobalSchema(base.schema);
  const graph = normalized?.["@graph"]?.map((node) => {
    if (node?.["@type"] === "WebPage" || node?.["@type"] === "CollectionPage" || node?.["@type"] === "AboutPage") {
      return {
        ...node,
        name: config.title,
        description: config.description,
        keywords,
      };
    }
    if (node?.["@type"] === "NGO") {
      return {
        ...node,
        knowsAbout: Array.from(new Set([...(node.knowsAbout || []), ...config.keywords])),
      };
    }
    return node;
  });
  return graph ? { ...normalized, "@graph": graph } : normalized;
}

export function getSeoForPath(inputPathname = "/") {
  const pathname = cleanPath(inputPathname);
  const base = getBaseSeo(pathname);
  const config = overrides[pathname];
  if (!config) return { ...base, schema: normalizeGlobalSchema(base.schema) };

  return {
    ...base,
    pathname,
    isNotFound: false,
    title: config.title,
    description: config.description,
    keywords: config.keywords.join(", "),
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    schema: withSchema({ ...base, pathname }, config),
  };
}
