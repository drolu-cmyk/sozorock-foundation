import { getSeoForPath as getBaseSeo } from "./seo.js";

const GLOBAL_SITE_DESCRIPTION = "Health access, cybersecurity experiential learning, public-interest research and responsible AI for decisions and implementation.";
const SOCIAL_IMAGE_ALT = "The SozoRock Foundation. Evidence should lead somewhere.";

const overrides = {
  "/": {
    title: "The SozoRock Foundation | Health Access, Applied Learning & Research",
    description: "SozoRock turns evidence into practical work in health access, graduate cybersecurity learning, public-interest research and responsible AI.",
    keywords: [
      "SozoRock Foundation",
      "health access",
      "New York health equity",
      "rural health access",
      "primary care access",
      "cybersecurity experiential learning",
      "graduate cybersecurity capstone",
      "workforce capability",
      "public-interest research",
      "AI governance",
      "health systems assurance",
    ],
  },
  "/platforms": {
    title: "Work | The SozoRock Foundation",
    description: "Explore SozoRock work in health access, cybersecurity experiential learning, public-interest research and AI accountability.",
    keywords: [
      "SozoRock Foundation work",
      "health access",
      "cybersecurity experiential learning",
      "workforce capability",
      "public-interest research",
      "AI and society",
      "health equity",
      "public systems",
    ],
  },
  "/platforms/applied-learning": {
    title: "Cybersecurity Experiential Learning | SozoRock Foundation",
    description: "A six-month Capella University capstone collaboration moving cybersecurity master's learners into hands-on IAM, GRC, cloud security and evidence assurance.",
    keywords: [
      "cybersecurity experiential learning",
      "applied learning",
      "work-based learning",
      "cybersecurity workforce development",
      "graduate cybersecurity capstone",
      "Capella University cybersecurity",
      "university nonprofit collaboration",
      "identity and access management",
      "IAM",
      "GRC",
      "cloud security",
      "security assurance",
      "AWS security",
      "least privilege",
    ],
  },
  "/platforms/health": {
    title: "2027 New York Health Access Pilot | SozoRock Health",
    description: "A planned 2027 New York pilot testing a clearer nonclinical path into ongoing primary care with direct primary care partner PIOC.",
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
  "/publications": {
    title: "Research & Publications | The SozoRock Foundation",
    description: "Citable public-interest research on health access, rural governance and digital health assurance, with free verified publication access.",
    keywords: [
      "SozoRock research",
      "health systems assurance",
      "rural health equity",
      "rural governance",
      "health access planning",
      "digital health assurance",
      "public-interest research",
      "Rural Equity Blueprint Series",
    ],
  },
  "/partner": {
    title: "Partner with SozoRock | The SozoRock Foundation",
    description: "Define a health access, applied learning, research or public systems engagement with a clear problem, role and outcome.",
    keywords: [
      "university nonprofit collaboration",
      "technology partnership",
      "workforce development partnership",
      "applied learning partner",
      "health access partnership",
      "public-interest technology",
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
      "public-interest research",
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
    if (node?.["@type"] === "NGO") return { ...node, taxID: "39-4736725" };
    return node;
  });
  return graph ? { ...schema, "@graph": graph } : schema;
}

function withSchema(base, config) {
  const keywords = config.keywords.join(", ");
  const normalized = normalizeGlobalSchema(base.schema);
  const graph = normalized?.["@graph"]?.map((node) => {
    if (node?.["@type"] === "WebPage" || node?.["@type"] === "CollectionPage" || node?.["@type"] === "AboutPage") {
      return { ...node, name: config.title, description: config.description, keywords };
    }
    if (node?.["@type"] === "NGO") {
      return { ...node, knowsAbout: Array.from(new Set([...(node.knowsAbout || []), ...config.keywords])) };
    }
    return node;
  });
  return graph ? { ...normalized, "@graph": graph } : normalized;
}

export function getSeoForPath(inputPathname = "/") {
  const pathname = cleanPath(inputPathname);
  const base = getBaseSeo(pathname);
  const config = overrides[pathname];
  if (!config) return { ...base, imageAlt: SOCIAL_IMAGE_ALT, schema: normalizeGlobalSchema(base.schema) };

  return {
    ...base,
    pathname,
    isNotFound: false,
    title: config.title,
    description: config.description,
    keywords: config.keywords.join(", "),
    imageAlt: SOCIAL_IMAGE_ALT,
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    schema: withSchema({ ...base, pathname }, config),
  };
}