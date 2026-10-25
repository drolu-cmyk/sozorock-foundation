import approvedMetadata from "./approved-metadata.json" with { type: "json" };
import { getSeoForPath as getBaseSeo } from "./seo.js";

const GLOBAL_SITE_DESCRIPTION = "The SozoRock Foundation is a 501(c)(3) public charity building healthier communities and stronger systems through health access, workforce capacity and trusted AI.";
const SOCIAL_IMAGE_ALT = "The SozoRock Foundation. Healthier communities. Stronger systems. A say in what’s next. Access, Capacity, Trust.";

const overrides = {
  "/": {
    title: "The SozoRock Foundation | Health Access, Workforce Capacity & Trusted AI",
    description: "Healthier communities, stronger systems and a say in what’s next. We expand primary care access, build health workforce capacity and shape trusted AI.",
    keywords: [
      "SozoRock Foundation",
      "primary care access",
      "health access",
      "health equity",
      "rural health",
      "health workforce",
      "workforce capacity",
      "cybersecurity workforce development",
      "cloud security training",
      "AI literacy",
      "responsible AI",
      "public trust in AI",
      "AI governance",
      "health systems assurance",
      "public-interest research",
    ],
  },
  "/workforce": {
    title: "Workforce Capacity | Cloud, Security & AI Skills | SozoRock",
    description: "Hands on learning in cloud computing, cloud security, identity and access, governance and AI, built with universities, employers and health systems.",
    keywords: [
      "workforce capacity",
      "health workforce",
      "experiential learning",
      "work integrated learning",
      "cloud computing training",
      "AWS cloud skills",
      "cloud security",
      "identity and access management",
      "governance, risk and compliance",
      "AI skills",
      "cybersecurity workforce development",
      "talent pipeline",
      "Capella University",
      "Athabasca University",
    ],
  },
  "/platforms": {
    title: "Work | The SozoRock Foundation",
    description: "Explore SozoRock work in health access, cybersecurity experiential learning, public-interest research and AI accountability.",
    keywords: [
      "SozoRock Foundation work",
      "health access",
      "workforce capacity",
      "AI and society",
      "public-interest research",
      "AI and society",
      "health equity",
      "public systems",
    ],
  },
  "/platforms/health": {
    title: "Primary Care Access Program, New York 2027 | SozoRock Health",
    description: "SozoRock Health's Primary Care Access Program for up to 25 New Yorkers from January 2027, plus Health Equity Hubs and free county data.",
    keywords: [
      "primary care access program",
      "health equity New York",
      "health systems",
      "health equity hubs",
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
  "/ai-society": {
    title: "AI & Society",
    description: "",
    keywords: ["public trust in AI", "responsible AI", "AI governance", "AI in education", "AI in the workplace", "AI in health care", "Who Decides? forum", "public participation in AI", "AI literacy", "future of work", "SozoRock Foundation"],
  },
  "/platforms/ai-lab": {
    title: "SozoRock AI Lab",
    description: "",
    keywords: ["free AI classes Albany NY", "AI enablement", "AI for nonprofits", "train the trainer", "AI governance", "AI literacy", "AI agents", "SozoRock AI Lab"],
  },
  "/events": {
    title: "Events",
    description: "",
    keywords: ["rural health events", "rural health transformation", "health workforce roundtable", "fireside chat", "AI public forum", "Capital Region New York", "Who Decides? forum", "SozoRock Foundation events"],
  },
  "/about": {
    title: "About",
    description: "",
    keywords: ["SozoRock Foundation", "501(c)(3) public charity", "health access nonprofit", "workforce capacity", "trusted AI", "public interest research", "New York nonprofit"],
  },
  "/leadership": {
    title: "Leadership",
    description: "",
    keywords: ["SozoRock Foundation leadership", "Dr. Oluwabiyi Adeyemo", "Nike Oye", "Jordan Hare", "Anthony Abraham", "health partnerships", "health education"],
  },
  "/contact": {
    title: "Contact",
    description: "",
    keywords: ["contact SozoRock Foundation", "health access partnership", "research inquiry", "SozoRock Foundation"],
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
    if (node?.["@type"] === "NGO") return { ...node, taxID: "39-4736725", knowsAbout: (node.knowsAbout || []).filter(term => term !== "systems intelligence") };
    return node;
  });
  return graph ? { ...schema, "@graph": graph } : schema;
}

function withSchema(base, config) {
  const keywords = config.keywords.join(", ");
  const normalized = normalizeGlobalSchema(base.schema);
  const graph = normalized?.["@graph"]?.map((node) => {
    if (node?.["@type"] === "WebPage" || node?.["@type"] === "CollectionPage" || node?.["@type"] === "AboutPage" || node?.["@type"] === "ContactPage") {
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
  const approved = approvedMetadata[pathname];
  const config = approved && !pathname.startsWith("/publication/") ? { ...(overrides[pathname] || {}), ...approved, keywords: overrides[pathname]?.keywords || ["SozoRock Foundation", approved.title.split(" | ")[0]] } : overrides[pathname];
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
