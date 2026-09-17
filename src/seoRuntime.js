import { getSeoForPath as getBaseSeo } from "./seo.js";

const overrides = {
  "/": {
    title: "The SozoRock Foundation | Health Access, Applied Learning & AI Governance",
    description: "Health access, applied learning, research and AI governance for public decisions, delivery and accountable implementation.",
    keywords: [
      "SozoRock Foundation",
      "health access",
      "applied learning",
      "experiential learning",
      "workforce development",
      "work-based learning",
      "AI governance",
      "AI and society",
      "health systems assurance",
      "cybersecurity workforce development",
      "public systems",
    ],
  },
  "/platforms/applied-learning": {
    title: "Applied Learning | Graduate Cybersecurity | SozoRock Foundation",
    description: "Graduate experiential learning that moves from instruction into cybersecurity implementation, evidence review and professional judgment.",
    keywords: [
      "applied learning",
      "experiential learning",
      "workforce development",
      "work-based learning",
      "cybersecurity workforce development",
      "graduate cybersecurity capstone",
      "academic industry collaboration",
      "industry aligned learning",
      "workplace capability",
      "identity and access management",
      "cloud security",
    ],
  },
  "/platforms/health": {
    title: "SozoRock Health | Primary Care Access & Place-Based Evidence",
    description: "Health-access models, place-based evidence and a planned New York primary-care access pilot, with clinical care remaining with licensed providers.",
    keywords: [
      "health access",
      "primary care access",
      "chronic condition care access",
      "health literacy",
      "place intelligence",
      "community health evidence",
      "rural health",
      "SozoRock Health",
    ],
  },
  "/partner": {
    title: "Partner with SozoRock | The SozoRock Foundation",
    description: "Define an applied-learning, health-access, research, public-systems or technology engagement with a clear problem, role and outcome.",
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
