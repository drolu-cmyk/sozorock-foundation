import { getSeoForPath as getBaseSeo } from "./seo.js";

const overrides = {
  "/": {
    title: "The SozoRock Foundation | Health Access, Workforce & Applied Technology",
    description: "Research, health access, workforce capability and applied technology for public decisions, delivery and accountable implementation.",
    keywords: [
      "SozoRock Foundation",
      "health access",
      "workforce development",
      "applied learning",
      "experiential learning",
      "public systems",
      "health systems assurance",
      "cybersecurity workforce development",
      "applied AI",
    ],
  },
  "/platforms/applied-learning": {
    title: "Applied Learning & Workforce Development | SozoRock Foundation",
    description: "A recurring graduate experiential-learning model connecting instruction with cybersecurity implementation, evidence, evaluation and workplace capability.",
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
    title: "Partner | Universities, Technology & Public Institutions | SozoRock",
    description: "Work with SozoRock on applied learning, health access, public evidence, workforce capability, research and public-interest technology.",
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
    description: "Support health access, applied learning, workforce capability, public-interest research, community participation and technology infrastructure.",
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
