export const PUBLIC_KNOWLEDGE_VERSION = "2026-09-16";

export const PUBLIC_ROUTES = Object.freeze({
  platforms: { label: "Explore the work", href: "/platforms" },
  institute: { label: "SozoRock Global Institute", href: "/platforms/institute" },
  health: { label: "SozoRock Health", href: "/platforms/health" },
  aiLab: { label: "SozoRock AI Lab", href: "/platforms/ai-lab" },
  aiSociety: { label: "AI & Society", href: "/ai-society" },
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
    focus: "The Foundation works across health access, governance, systems assurance, county evidence, community participation and applied AI. Rural health and rural equity are important areas of focus, not the limit of the mission.",
    platforms: {
      institute: "Public-interest research and convening on governance, health access, systems assurance and public decisions, including the capacity of rural institutions.",
      health: "Health-access work connecting community models, place-based evidence, digital readiness and workforce capacity.",
      aiLab: "Task-based AI learning built around real work, verification, privacy and human judgment.",
      aiSociety: "Who Decides? is a developing public process for participation, human review, decision records and institutional response when AI affects learning or work.",
    },
    engagement: {
      partner: "Use Partner to define the institution or community, the decision ahead, the people affected and the output required.",
      support: "Use Support to discuss financial or in-kind support for independent research, public access, health-access work, community participation and applied learning.",
    },
    evidencePolicy: "Distinguish proposed models, participant-reported context, observed activity, modeled estimates and measured outcomes. Never turn participation, cataloging, funding or a proposed partnership into an endorsement, implementation claim or achieved result.",
    publicationPolicy: "Use only the Foundation's permanent publication records and access routes. Never invent a DOI, ISBN, release, award, catalog record, partner, metric or publication status.",
    safety: "This navigator provides website orientation only. It does not provide medical, legal, financial, emergency, eligibility or individualized advice and must not collect sensitive information.",
    routes: PUBLIC_ROUTES,
  };
}

const boundaryMessages = Object.freeze({
  none: null,
  privacy: "Please do not share personal, patient, student, employee, financial, legal, account or other sensitive information.",
  medical: "For medical questions, contact a qualified health professional. This website navigator can only help you find Foundation programs and public information.",
  emergency: "If this may be an emergency, contact local emergency services now. This website navigator cannot provide emergency help.",
  out_of_scope: "I can help with SozoRock Foundation platforms, publications, events, partnerships, support, standards and general website navigation.",
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
  if (includesAny(value, ["who decides", "ai society", "ai governance", "human review", "community participation", "algorithmic decision", "automated decision"])) {
    return normalizePublicAnswer({
      answer: "Who Decides? is a developing public process for consequential AI in learning and work. It is designed to document community questions, evidence, recommendations, human authority, routes to challenge and institutional response.",
      linkKeys: ["aiSociety", "events", "standards"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["publication", "paper", "report", "research", "doi", "isbn", "citation"])) {
    return normalizePublicAnswer({
      answer: "Start with Publications for permanent records, scope, limits, citation and verified access. Insights provides related analysis and field updates.",
      linkKeys: ["publications", "insights", "institute"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["event", "calendar", "attend", "registration", "fireside", "roundtable"])) {
    return normalizePublicAnswer({
      answer: "Use Events for confirmed engagements and clearly labeled planned formats. Dates and participation terms appear only when confirmed.",
      linkKeys: ["events", "aiSociety"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["partner", "partnership", "pilot", "hub", "briefing", "organization", "public sector", "institutional inquiry"])) {
    return normalizePublicAnswer({
      answer: "Use Partner to define the institution or community, the decision ahead, the people affected and the output required. An inquiry does not establish a partnership or commitment.",
      linkKeys: ["partner", "platforms", "standards"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["donate", "fund", "support", "sponsor", "contribute", "in-kind"])) {
    return normalizePublicAnswer({
      answer: "Use Support to discuss financial or in-kind support for independent research, public access, health-access work, community participation and applied learning.",
      linkKeys: ["support", "standards", "partner"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["artificial intelligence", "ai lab", "ai learning", "applied ai", "automation"])) {
    return normalizePublicAnswer({
      answer: "SozoRock AI Lab uses task-based learning, reviewed work and human judgment. AI & Society examines participation and accountability when AI affects consequential decisions.",
      linkKeys: ["aiLab", "aiSociety", "standards"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["health", "cb-cap", "cbcap", "health equity", "access day", "public health", "rural health", "place intelligence"])) {
    return normalizePublicAnswer({
      answer: "SozoRock Health connects community access models, place-based evidence, digital readiness and workforce capacity, including focused work in rural and underserved places.",
      linkKeys: ["health", "platforms", "publications"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["institute", "institutional learning", "public systems", "governance", "assurance"])) {
    return normalizePublicAnswer({
      answer: "SozoRock Global Institute produces public-interest research and convening on governance, health access, systems assurance and public decisions.",
      linkKeys: ["institute", "publications", "events"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["platform", "program", "what do you do", "foundation work"])) {
    return normalizePublicAnswer({
      answer: "Explore SozoRock Global Institute, SozoRock Health, SozoRock AI Lab and CB-CAP. AI & Society connects research, participation and human review across the work.",
      linkKeys: ["platforms", "about", "aiSociety"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["standard", "privacy", "accessibility", "responsible", "evidence", "correction", "funding disclosure"])) {
    return normalizePublicAnswer({
      answer: "Standards explains how the Foundation separates evidence from assertion, discloses support, corrects errors and assigns responsibility.",
      linkKeys: ["standards", "about"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["about", "leadership", "who is", "mission", "purpose"])) {
    return normalizePublicAnswer({
      answer: "About explains the Foundation's purpose, leadership, public-systems mandate and focused work in rural health and rural equity.",
      linkKeys: ["about", "platforms", "standards"],
      boundary: "none",
    });
  }
  return normalizePublicAnswer({ answer: "", linkKeys: ["platforms", "about"], boundary: "out_of_scope" });
}
