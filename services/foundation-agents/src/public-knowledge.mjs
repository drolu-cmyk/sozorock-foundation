export const PUBLIC_KNOWLEDGE_VERSION = "2026-08-28";

export const PUBLIC_ROUTES = Object.freeze({
  platforms: { label: "Explore the work", href: "/platforms" },
  institute: { label: "SozoRock Institute", href: "/platforms/institute" },
  health: { label: "SozoRock Health", href: "/platforms/health" },
  aiLab: { label: "SozoRock AI Lab", href: "/platforms/ai-lab" },
  publications: { label: "Publications", href: "/publications" },
  insights: { label: "Insights", href: "/insights" },
  events: { label: "Events", href: "/events" },
  partner: { label: "Partner with us", href: "/partner" },
  support: { label: "Support the work", href: "/support" },
  standards: { label: "Standards", href: "/standards" },
  about: { label: "About the Foundation", href: "/about" },
});

export function publicKnowledgeSnapshot() {
  return {
    version: PUBLIC_KNOWLEDGE_VERSION,
    thesis: "Access. Assurance. Intelligence.",
    purpose: "The SozoRock Foundation builds platforms for better health and public systems.",
    platforms: {
      institute: "Public-interest research, publications, and institutional learning.",
      health: "Applied public-health systems work, including CB-CAP, Health Equity Hubs, and Health Access Day.",
      aiLab: "Practical AI learning built around real work, verification, privacy, and human judgment.",
    },
    engagement: {
      partner: "Use the Partner route for hubs, pilots, briefings, and institutional or public-sector inquiries.",
      support: "Use the Support route to fund the work, support research and publications, or explore partnership.",
    },
    publicationPolicy: "Use only the Foundation's permanent publication records and access routes. Never invent a DOI, release, award, partner, metric, or publication status.",
    safety: "This navigator provides website orientation only. It does not provide medical, legal, financial, emergency, eligibility, or individualized advice and must not collect sensitive information.",
    routes: PUBLIC_ROUTES,
  };
}

const boundaryMessages = Object.freeze({
  none: null,
  privacy: "Please do not share personal, patient, student, employee, financial, legal, account, or other sensitive information.",
  medical: "For medical questions, contact a qualified health professional. This website navigator can only help you find Foundation programs and public information.",
  emergency: "If this may be an emergency, contact local emergency services now. This website navigator cannot provide emergency help.",
  out_of_scope: "I can help with SozoRock Foundation platforms, publications, events, partnerships, support, standards, and general website navigation.",
});

export function normalizePublicAnswer(value) {
  const answer = typeof value?.answer === "string" ? value.answer.trim().slice(0, 1200) : "";
  const keys = Array.isArray(value?.linkKeys) ? value.linkKeys : [];
  const seen = new Set();
  const links = keys
    .filter((key) => Object.hasOwn(PUBLIC_ROUTES, key) && !seen.has(key) && seen.add(key))
    .slice(0, 3)
    .map((key) => ({ key, ...PUBLIC_ROUTES[key] }));
  const boundary = Object.hasOwn(boundaryMessages, value?.boundary) ? value.boundary : "out_of_scope";
  return {
    answer: answer || boundaryMessages.out_of_scope,
    links,
    notice: boundaryMessages[boundary],
    knowledgeVersion: PUBLIC_KNOWLEDGE_VERSION,
  };
}

function includesAny(value, terms) {
  return terms.some((term) => value.includes(term));
}

export function resolvePublicNavigation(question) {
  const value = String(question || "").toLowerCase();
  if (includesAny(value, ["emergency", "911", "urgent danger", "life threatening"])) {
    return normalizePublicAnswer({
      answer: "This website guide cannot provide emergency help.",
      linkKeys: [],
      boundary: "emergency",
    });
  }
  if (includesAny(value, ["medical advice", "diagnosis", "symptom", "medication", "treatment"])) {
    return normalizePublicAnswer({
      answer: "I can only help you find the Foundation's public health programs and information.",
      linkKeys: ["health"],
      boundary: "medical",
    });
  }
  if (includesAny(value, ["publication", "paper", "report", "research", "doi", "citation"])) {
    return normalizePublicAnswer({
      answer: "Start with Publications for permanent Foundation publication records. Insights provides related institutional analysis.",
      linkKeys: ["publications", "insights", "institute"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["event", "calendar", "attend", "registration"])) {
    return normalizePublicAnswer({
      answer: "Use Events for current Foundation convenings and public sessions.",
      linkKeys: ["events"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["partner", "partnership", "pilot", "hub", "briefing", "organization", "public sector"])) {
    return normalizePublicAnswer({
      answer: "Use Partner with us for institutional, public-sector, hub, pilot, and briefing inquiries.",
      linkKeys: ["partner", "platforms"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["donate", "fund", "support", "sponsor", "contribute"])) {
    return normalizePublicAnswer({
      answer: "Use Support the work to fund Foundation research, publications, and implementation work.",
      linkKeys: ["support", "partner"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["artificial intelligence", "ai lab", "ai learning", "automation"])) {
    return normalizePublicAnswer({
      answer: "SozoRock AI Lab is the Foundation's practical AI learning platform, built around real work, verification, privacy, and human judgment.",
      linkKeys: ["aiLab", "standards"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["health", "cb-cap", "cbcap", "health equity", "access day", "public health"])) {
    return normalizePublicAnswer({
      answer: "SozoRock Health brings together the Foundation's applied public-health systems work.",
      linkKeys: ["health", "platforms"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["institute", "institutional learning", "public systems"])) {
    return normalizePublicAnswer({
      answer: "SozoRock Institute connects public-interest research, publications, and institutional learning.",
      linkKeys: ["institute", "publications"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["platform", "program", "what do you do", "foundation work"])) {
    return normalizePublicAnswer({
      answer: "Explore the Foundation's three platforms: SozoRock Institute, SozoRock Health, and SozoRock AI Lab.",
      linkKeys: ["platforms", "health", "aiLab"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["standard", "privacy", "accessibility", "responsible", "governance"])) {
    return normalizePublicAnswer({
      answer: "Use Standards for the Foundation's public commitments to evidence, privacy, accessibility, and responsible implementation.",
      linkKeys: ["standards", "about"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["about", "leadership", "who is", "mission", "purpose"])) {
    return normalizePublicAnswer({
      answer: "About the Foundation explains its purpose, platforms, and institutional direction.",
      linkKeys: ["about", "platforms"],
      boundary: "none",
    });
  }
  return normalizePublicAnswer({ answer: "", linkKeys: ["platforms", "about"], boundary: "out_of_scope" });
}
