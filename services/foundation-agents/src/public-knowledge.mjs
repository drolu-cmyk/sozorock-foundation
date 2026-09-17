export const PUBLIC_KNOWLEDGE_VERSION = "2026-09-16-simplified-journey";

export const PUBLIC_ROUTES = Object.freeze({
  platforms: { label: "Explore the work", href: "/platforms" },
  institute: { label: "SozoRock Global Institute", href: "/platforms/institute" },
  health: { label: "SozoRock Health", href: "/platforms/health" },
  aiLab: { label: "SozoRock AI Lab", href: "/platforms/ai-lab" },
  appliedLearning: { label: "Applied Learning & Workforce Capability", href: "/platforms/applied-learning" },
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
    purpose: "The SozoRock Foundation develops practical health-access models, applied learning and public-interest research for better public decisions and implementation.",
    focus: "The Foundation works across health access, research and assurance, applied learning and workforce capability, community participation and responsible AI. Rural and underserved communities are an important focus, not the limit of the mission.",
    platforms: {
      institute: "Public-interest research and convening on governance, health access, systems assurance and public decisions, including the capacity of rural institutions.",
      health: "SozoRock Health develops nonclinical access models and place-based evidence. In 2027, the Foundation plans to test a 25-participant New York health-access pilot with PIOC, a direct primary care practice, for residents in rural and underserved communities who face barriers to ongoing primary care. The purpose is to test a clearer pathway to care and support health equity; clinical care remains with the licensed provider.",
      aiLab: "Task-based AI learning built around real work, verification, privacy and human judgment.",
      appliedLearning: "SozoRock works with universities and workforce organizations to turn academic knowledge into applied technology capability through defined problems, practitioner guidance and evidence-based review. A documented graduate cybersecurity engagement covered two consecutive cohorts and 11 learners across 2025–2026.",
      aiSociety: "Who Decides? is a developing public process for participation, human review, decision records and institutional response when AI affects learning or work.",
    },
    engagement: {
      partner: "Universities, workforce organizations, public institutions, technology companies, funders and communities can use Partner to define the problem, people affected, contribution and output required.",
      support: "Use Support to discuss financial or in-kind support for defined health-access work, applied-learning engagements, public-interest research, technology infrastructure or community participation.",
    },
    evidencePolicy: "Distinguish planned work, proposed models, participant-reported context, observed activity, modeled estimates and measured outcomes. Never turn participation, cataloging, funding or a proposed partnership into an endorsement, implementation claim or achieved result.",
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
  out_of_scope: "I can help with SozoRock Foundation health access, applied learning, research, AI & Society, partnerships, support, standards and general website navigation.",
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
    return normalizePublicAnswer({ answer: "This website guide cannot provide emergency help.", linkKeys: [], boundary: "emergency" });
  }
  if (includesAny(value, ["medical advice", "diagnosis", "symptom", "medication", "treatment"])) {
    return normalizePublicAnswer({
      answer: "I can only help you find the Foundation's public health programs and information.",
      linkKeys: ["health"],
      boundary: "medical",
    });
  }
  if (includesAny(value, ["capella", "capstone", "experiential learning", "applied learning", "work-based learning", "workforce development", "graduate learner", "cybersecurity learner", "academic industry", "university collaboration", "student project"])) {
    return normalizePublicAnswer({
      answer: "SozoRock's applied-learning work turns academic knowledge into applied technology capability through real problems, practitioner guidance and evidence-based review. The documented graduate cybersecurity engagement covered two consecutive cohorts and 11 learners across 2025–2026.",
      linkKeys: ["appliedLearning", "partner", "support"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["cloud credit", "cloud credits", "ai credit", "ai credits", "technology credit", "sponsor", "sponsorship", "funder", "funding", "in-kind", "technology partner"])) {
    return normalizePublicAnswer({
      answer: "Financial and in-kind support can be tied to a defined health-access activity, applied-learning engagement, research output or technology use case. The Foundation separates support from editorial and evidence conclusions.",
      linkKeys: ["support", "partner", "appliedLearning"],
      boundary: "none",
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
  if (includesAny(value, ["partner", "partnership", "pilot", "hub", "briefing", "organization", "public sector", "institutional inquiry", "university", "employer"])) {
    return normalizePublicAnswer({
      answer: "Use Partner to define the institution or community, the decision ahead, the people affected, the contribution and the output required. An inquiry does not establish a partnership or commitment.",
      linkKeys: ["partner", "appliedLearning", "platforms"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["donate", "fund", "support", "contribute"])) {
    return normalizePublicAnswer({
      answer: "Use Support to discuss financial or in-kind support for independent research, public access, health-access work, applied learning, technology infrastructure and community participation.",
      linkKeys: ["support", "standards", "partner"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["artificial intelligence", "ai lab", "ai learning", "applied ai", "automation"])) {
    return normalizePublicAnswer({
      answer: "SozoRock AI Lab uses task-based learning, reviewed work and human judgment. AI & Society examines participation and accountability when AI affects consequential decisions.",
      linkKeys: ["aiLab", "aiSociety", "appliedLearning"],
      boundary: "none",
    });
  }
  if (includesAny(value, ["health", "cb-cap", "cbcap", "health equity", "access day", "public health", "rural health", "place intelligence", "primary care", "chronic condition", "direct primary care", "underserved"])) {
    return normalizePublicAnswer({
      answer: "In 2027, SozoRock plans to test a 25-participant New York health-access pilot with PIOC, a direct primary care practice, for residents in rural and underserved communities who face barriers to ongoing primary care. The pilot is intended to test a clearer nonclinical pathway to care and support health equity; clinical care remains with the licensed provider.",
      linkKeys: ["health", "platforms", "partner"],
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
      answer: "The Foundation's work is organized around health access, applied learning and workforce capability, research and assurance, and AI & Society. Start with Work to choose the route that fits the problem.",
      linkKeys: ["platforms", "about", "partner"],
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
      answer: "About explains the Foundation's purpose, leadership, public-systems mandate and focused work in health access, applied capability, research and responsible AI.",
      linkKeys: ["about", "platforms", "standards"],
      boundary: "none",
    });
  }
  return normalizePublicAnswer({ answer: "", linkKeys: ["platforms", "about"], boundary: "out_of_scope" });
}
