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
