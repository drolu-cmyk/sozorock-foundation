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
    focus: "The Foundation works across health access, governance, systems assurance, community evidence and practical AI learning. Rural health and rural equity are important areas of focus, not the limit of the mission.",
    platforms: {
      institute: "Public-interest research, publications and institutional learning across governance, health access, systems assurance and rural equity.",
      health: "Applied health-access and public-health systems work, including Place Intelligence, CB-CAP, Health Equity Hubs and Health Access Day.",
      aiLab: "Practical AI learning built around real work, verification, privacy and human judgment.",
      aiSociety: "A developing participation and accountability initiative for consequential AI in learning and work, including community questions, decision records and institutional response.",
    },
    engagement: {
      partner: "Use the Partner route for research, health access, community evidence, public systems, briefings, convenings and institutional inquiries.",
      support: "Use the Support route to discuss financial or in-kind support for public-interest research, health access, community participation and practical learning.",
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
      answer: "AI & Society is developing a participation and accountability approach for consequential AI in learning and work, with community questions, human review, decision records and institutional response.",
      linkKeys: ["aiSociety", "events", "standards"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["publication", "paper", "report", "research", "doi", "isbn", "citation"])) {
    return normalizePublicAnswer({
      answer: "Start with Publications for permanent Foundation publication records. Insights provides related institutional analysis.",
      linkKeys: ["publications", "insights", "institute"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["event", "calendar", "attend", "registration", "fireside", "roundtable"])) {
    return normalizePublicAnswer({
      answer: "Use Events for confirmed Foundation engagements and clearly labeled formats still in development.",
      linkKeys: ["events", "aiSociety"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["partner", "partnership", "pilot", "hub", "briefing", "organization", "public sector", "institutional inquiry"])) {
    return normalizePublicAnswer({
      answer: "Use Partner with us for research, health access, community evidence, public-systems, convening and institutional inquiries. An inquiry does not establish a partnership or commitment.",
      linkKeys: ["partner", "platforms", "standards"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["donate", "fund", "support", "sponsor", "contribute", "in-kind"])) {
    return normalizePublicAnswer({
      answer: "Use Support the work to discuss financial or in-kind support for public-interest research, health access, community participation and practical learning.",
      linkKeys: ["support", "standards", "partner"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["artificial intelligence", "ai lab", "ai learning", "applied ai", "automation"])) {
    return normalizePublicAnswer({
      answer: "SozoRock AI Lab is the Foundation's practical AI learning platform, built around real work, verification, privacy and human judgment. AI & Society addresses participation and accountability in consequential AI decisions.",
      linkKeys: ["aiLab", "aiSociety", "standards"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["health", "cb-cap", "cbcap", "health equity", "access day", "public health", "rural health", "place intelligence"])) {
    return normalizePublicAnswer({
      answer: "SozoRock Health brings together the Foundation's health-access, community-evidence and applied public-health systems work, with particular attention to rural and underserved places.",
      linkKeys: ["health", "platforms", "publications"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["institute", "institutional learning", "public systems", "governance", "assurance"])) {
    return normalizePublicAnswer({
      answer: "SozoRock Global Institute connects public-interest research, publications and institutional learning across governance, health access, systems assurance and rural equity.",
      linkKeys: ["institute", "publications", "events"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["platform", "program", "what do you do", "foundation work"])) {
    return normalizePublicAnswer({
      answer: "Explore the Foundation's work across SozoRock Global Institute, SozoRock Health, SozoRock AI Lab and CB-CAP, with AI & Society as a developing cross-platform initiative.",
      linkKeys: ["platforms", "about", "aiSociety"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["standard", "privacy", "accessibility", "responsible", "evidence", "correction", "funding disclosure"])) {
    return normalizePublicAnswer({
      answer: "Use Standards for the Foundation's public commitments to evidence, independence, funding disclosure, privacy, accessibility and responsible implementation.",
      linkKeys: ["standards", "about"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["about", "leadership", "who is", "mission", "purpose"])) {
    return normalizePublicAnswer({
      answer: "About the Foundation explains its purpose, platforms, wider public-systems focus and specific work in rural health and rural equity.",
      linkKeys: ["about", "platforms", "standards"],
      boundary: "none",
    });
  }
  return normalizePublicAnswer({ answer: "", linkKeys: ["platforms", "about"], boundary: "out_of_scope" });
}
