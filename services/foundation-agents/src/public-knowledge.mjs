export const PUBLIC_KNOWLEDGE_VERSION = "2026-09-17-contrast-positioning";

export const PUBLIC_ROUTES = Object.freeze({
  platforms: { label: "What we do", href: "/platforms" },
  institute: { label: "SozoRock Global Institute", href: "/platforms/institute" },
  health: { label: "SozoRock Health", href: "/platforms/health" },
  aiLab: { label: "SozoRock AI Lab", href: "/platforms/ai-lab" },
  appliedLearning: { label: "Cybersecurity experiential learning", href: "/platforms/applied-learning" },
  aiSociety: { label: "AI and Society", href: "/ai-society" },
  publications: { label: "Research and publications", href: "/publications" },
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
    thesis: "Evidence should lead somewhere.",
    purpose: "SozoRock works with communities, universities and institutions to improve health access, build applied technology capability and strengthen public decisions.",
    focus: "The Foundation works across health access, cybersecurity experiential learning, public-interest research and responsible AI. Rural and underserved communities are an important focus, not the limit of the mission.",
    platforms: {
      institute: "Public-interest research and convening on governance, health access, systems assurance and public decisions.",
      health: "A 2025 Western New York preplanning roundtable brought together 12 participants from two county public-health jurisdictions and two universities. A regional public-health director reported more than 12,000 residents per primary-care clinician. REBS connects access planning with health literacy, technology, workforce and community readiness. In 2027, the Foundation plans a 25-participant New York pilot with Dr. Michael Purcell and PIOC, a direct primary care practice. The small first cohort is intended to test and improve the nonclinical pathway before expansion. Clinical care remains with the licensed provider.",
      aiLab: "Task-based AI learning built around real work, verification, privacy and human judgment.",
      appliedLearning: "Through a recurring Capella University collaboration, cybersecurity master's learners spend six months moving from instruction into hands-on work. Across two cohorts, 11 graduate learners have worked in identity and access management, GRC, cloud security, risk and evidence assurance. Capella retains academic oversight and grading; SozoRock designs experiential tasks, mentors learners and evaluates applied work.",
      aiSociety: "Who Decides? is a developing public process for participation, human review, decision records and institutional response when AI affects learning or work.",
    },
    engagement: {
      partner: "Universities, workforce organizations, public institutions, technology companies, funders and communities can use Partner to define the problem, people affected, contribution and output required.",
      support: "Use Support to discuss financial or in-kind support for defined health-access work, applied learning engagements, public-interest research, technology infrastructure or community participation.",
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
  out_of_scope: "I can help with SozoRock Foundation health access, applied learning, research, AI and Society, partnerships, support, standards and general website navigation.",
});

export function normalizePublicAnswer(value) {
  const answer = typeof value?.answer === "string" ? value.answer.trim().slice(0, 1200) : "";
  const keys = Array.isArray(value?.linkKeys) ? value.linkKeys : [];
  const seen = new Set();
  const links = keys.filter((key) => Object.hasOwn(PUBLIC_ROUTES, key) && !seen.has(key) && seen.add(key)).slice(0, 3).map((key) => ({ key, ...PUBLIC_ROUTES[key] }));
  const boundary = Object.hasOwn(boundaryMessages, value?.boundary) ? value.boundary : "out_of_scope";
  return { answer: answer || boundaryMessages.out_of_scope, links, notice: boundaryMessages[boundary], knowledgeVersion: PUBLIC_KNOWLEDGE_VERSION };
}

function includesAny(value, terms) {
  return terms.some((term) => value.includes(term));
}

export function resolvePublicNavigation(question) {
  const value = String(question || "").toLowerCase();
  if (includesAny(value, ["emergency", "911", "urgent danger", "life threatening"])) return normalizePublicAnswer({ answer: "This website guide cannot provide emergency help.", linkKeys: [], boundary: "emergency" });
  if (includesAny(value, ["medical advice", "diagnosis", "symptom", "medication", "treatment"])) return normalizePublicAnswer({ answer: "I can only help you find the Foundation's public health programs and information.", linkKeys: ["health"], boundary: "medical" });
  if (includesAny(value, ["capella", "capstone", "experiential learning", "applied learning", "work-based learning", "workforce development", "graduate learner", "cybersecurity learner", "university nonprofit", "university collaboration", "student project", "iam", "grc"])) {
    return normalizePublicAnswer({ answer: "SozoRock's recurring Capella University collaboration gives cybersecurity master's learners six months of instruction and hands-on work. Across two cohorts, 11 learners have worked in identity and access management, GRC, cloud security, risk and evidence assurance before graduation. Capella retains academic oversight and grading.", linkKeys: ["appliedLearning", "partner", "support"], boundary: "none" });
  }
  if (includesAny(value, ["cloud credit", "cloud credits", "ai credit", "ai credits", "technology credit", "sponsor", "sponsorship", "funder", "funding", "in-kind", "in kind", "technology partner"])) return normalizePublicAnswer({ answer: "Financial and in-kind support can be tied to a defined health-access activity, applied learning engagement, research output or technology use case. The Foundation separates support from editorial and evidence conclusions.", linkKeys: ["support", "partner", "appliedLearning"], boundary: "none" });
  if (includesAny(value, ["who decides", "ai society", "ai governance", "human review", "community participation", "algorithmic decision", "automated decision"])) return normalizePublicAnswer({ answer: "Who Decides? is a developing public process for consequential AI in learning and work. It is designed to document community questions, evidence, recommendations, human authority, routes to challenge and institutional response.", linkKeys: ["aiSociety", "events", "standards"], boundary: "none" });
  if (includesAny(value, ["publication", "paper", "report", "research", "doi", "isbn", "citation"])) return normalizePublicAnswer({ answer: "Research and Publications contains permanent records on health access, rural governance and digital health assurance. Each record states its scope and limits and provides a verified access route.", linkKeys: ["publications", "insights", "institute"], boundary: "none" });
  if (includesAny(value, ["event", "calendar", "attend", "registration", "fireside", "roundtable"])) return normalizePublicAnswer({ answer: "Events includes a documented 2025 health-access roundtable and clearly labeled future formats. Dates, hosts and participation terms appear only when confirmed.", linkKeys: ["events", "aiSociety"], boundary: "none" });
  if (includesAny(value, ["partner", "partnership", "pilot", "hub", "briefing", "organization", "public sector", "institutional inquiry", "university", "employer"])) return normalizePublicAnswer({ answer: "Use Partner to define the institution or community, the decision ahead, the people affected, the contribution and the output required. An inquiry does not establish a partnership or commitment.", linkKeys: ["partner", "appliedLearning", "platforms"], boundary: "none" });
  if (includesAny(value, ["donate", "fund", "support", "contribute"])) return normalizePublicAnswer({ answer: "Use Support to discuss financial or in-kind support for research, public access, health-access work, applied learning, technology infrastructure and community participation.", linkKeys: ["support", "standards", "partner"], boundary: "none" });
  if (includesAny(value, ["artificial intelligence", "ai lab", "ai learning", "applied ai", "automation"])) return normalizePublicAnswer({ answer: "SozoRock AI Lab uses real tasks, reviewed work and human judgment. AI and Society examines participation and accountability when AI affects consequential decisions.", linkKeys: ["aiLab", "aiSociety", "appliedLearning"], boundary: "none" });
  if (includesAny(value, ["health", "cb-cap", "cbcap", "health equity", "access day", "public health", "rural health", "place intelligence", "primary care", "chronic condition", "direct primary care", "underserved"])) return normalizePublicAnswer({ answer: "The 2027 New York health-access pilot grows from documented rural access questions. It plans to test a 25-participant nonclinical pathway with Dr. Michael Purcell and PIOC, a direct primary care practice, before any expansion. Clinical care remains entirely with the licensed provider.", linkKeys: ["health", "platforms", "partner"], boundary: "none" });
  if (includesAny(value, ["institute", "institutional learning", "public systems", "governance", "assurance"])) return normalizePublicAnswer({ answer: "SozoRock Global Institute produces public-interest research and convening on governance, health access, systems assurance and public decisions.", linkKeys: ["institute", "publications", "events"], boundary: "none" });
  if (includesAny(value, ["platform", "program", "what do you do", "foundation work"])) return normalizePublicAnswer({ answer: "SozoRock works across health access, cybersecurity experiential learning, research and AI accountability. Start with What we do to choose the route that fits the problem.", linkKeys: ["platforms", "about", "partner"], boundary: "none" });
  if (includesAny(value, ["standard", "privacy", "accessibility", "responsible", "evidence", "correction", "funding disclosure"])) return normalizePublicAnswer({ answer: "Standards explains how the Foundation separates evidence from assertion, discloses support, corrects errors and assigns responsibility.", linkKeys: ["standards", "about"], boundary: "none" });
  if (includesAny(value, ["about", "leadership", "who is", "mission", "purpose"])) return normalizePublicAnswer({ answer: "About explains why the Foundation connects research with practical work in health access, applied capability and accountable technology decisions.", linkKeys: ["about", "platforms", "standards"], boundary: "none" });
  return normalizePublicAnswer({ answer: "", linkKeys: ["platforms", "about"], boundary: "out_of_scope" });
}