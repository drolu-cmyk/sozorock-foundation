import { getSeoForPath as getBaseSeo } from "./seo.js";

const overrides = {
  "/": {
    title: "The SozoRock Foundation | Health Access, Applied Learning & Research",
    description: "The SozoRock Foundation develops practical health-access models, applied learning and public-interest research, including a planned 2027 New York primary-care access pilot.",
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
    description: "A planned 2027 New York health-access pilot with PIOC, a direct primary care practice, for residents in rural and underserved communities who face barriers to ongoing primary care.",
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

function withSchema(base, config) {
  const keywords = config.keywords.join(", ");
  const graph = base.schema?.["@graph"]?.map((node) => {
    if (node?.["@type"] === "WebPage" || node?.["@type"] === "CollectionPage" || node?.["@type"] === "AboutPage") {
      return {
        ...node,
        name: config.title,
        description: config.description,
        keywords,
      };
    }
    if (node?.["@type"] === "WebSite" && base.pathname === "/") {
      return { ...node, description: config.description };
    }
    if (node?.["@type"] === "NGO") {
      return {
        ...node,
        knowsAbout: Array.from(new Set([...(node.knowsAbout || []), ...config.keywords])),
      };
    }
    return node;
  });
  return graph ? { ...base.schema, "@graph": graph } : base.schema;
}

export function getSeoForPath(inputPathname = "/") {
  const pathname = cleanPath(inputPathname);
  const base = getBaseSeo(pathname);
  const config = overrides[pathname];
  if (!config) return base;

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
