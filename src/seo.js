import { leaders, publications } from "./siteData.js";

export const SITE_ORIGIN = "https://www.sozorockfoundation.org";
export const SITE_NAME = "The SozoRock Foundation";
export const DEFAULT_SOCIAL_IMAGE = `${SITE_ORIGIN}/media/foundation-editorial-social.png`;
export const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;

const routeSeo = {
  "/ai-society": {
    title: "AI & Society | Community Participation & Human Review | SozoRock",
    description: "Explore Who Decides?, a developing SozoRock initiative for community participation, human review, public decision records and institutional response in AI.",
    pageType: "WebPage",
  },
  "/contact": {
    title: "Contact the Foundation | SozoRock",
    description: "Discuss research, health access, public systems, rural and place-based work, community initiatives, AI & Society or applied learning with The SozoRock Foundation.",
    pageType: "ContactPage",
  },
  "/": {
    title: "The SozoRock Foundation | Health Access, Public Systems & AI",
    description: "Research, health access, public systems and practical AI learning, including focused work in rural and underserved places. Explore SozoRock.",
    pageType: "WebPage",
  },
  "/platforms": {
    title: "Platforms | The SozoRock Foundation",
    description: "Explore SozoRock Health, CB-CAP, the Global Institute and AI Lab: research, community evidence, health access, public systems and practical AI learning.",
    pageType: "CollectionPage",
  },
  "/platforms/institute": {
    title: "SozoRock Global Institute | Research & Convening",
    description: "Public-interest research on governance, health access, systems assurance and public decision-making, with focused work on rural institutions and local capacity.",
    pageType: "WebPage",
  },
  "/platforms/health": {
    title: "SozoRock Health | Systems for Health Access",
    description: "Community access, place-based intelligence, digital assurance and workforce capacity. Discover SozoRock Health, an initiative of The SozoRock Foundation.",
    pageType: "WebPage",
  },
  "/platforms/ai-lab": {
    title: "SozoRock AI Lab | Responsible Applied AI Learning",
    description: "Practical AI learning for real work, centered on human judgment, verification, responsible use and reviewed implementation.",
    pageType: "WebPage",
  },
  "/publications": {
    title: "Publications | The SozoRock Foundation",
    description: "Browse permanent public-interest publication records on health systems assurance, governance, health access and rural equity.",
    pageType: "CollectionPage",
  },
  "/insights": {
    title: "Insights | The SozoRock Foundation",
    description: "Read field updates, briefings and systems intelligence from SozoRock work in health access, public systems, community evidence and applied AI.",
    pageType: "CollectionPage",
  },
  "/events": {
    title: "Events | The SozoRock Foundation",
    description: "Explore SozoRock Firesides, Roundtables and briefings on health access, public systems, AI, learning, work and community questions.",
    pageType: "CollectionPage",
  },
  "/about": {
    title: "About | The SozoRock Foundation",
    description: "Learn how The SozoRock Foundation connects research, health access, public systems, rural equity, community evidence and practical AI learning.",
    pageType: "AboutPage",
  },
  "/leadership": {
    title: "Leadership | The SozoRock Foundation",
    description: "Meet the leaders accountable for The SozoRock Foundation's global health partnerships, global affairs, health education and strategic initiatives.",
    pageType: "AboutPage",
  },
  "/partner": {
    title: "Partner | The SozoRock Foundation",
    description: "Discuss health access, community evidence, public-interest research, public systems, rural and place-based work, AI & Society or practical learning with SozoRock.",
    pageType: "WebPage",
  },
  "/support": {
    title: "Support | The SozoRock Foundation",
    description: "Support public-interest research, health access, community evidence, AI & Society participation and practical learning.",
    pageType: "WebPage",
  },
  "/standards": {
    title: "Standards & Policies | The SozoRock Foundation",
    description: "Review SozoRock standards for evidence, independence, corrections, funding, authorship, AI use, privacy, citations and accessibility.",
    pageType: "WebPage",
  },
  "/privacy": {
    title: "Privacy Notice | The SozoRock Foundation",
    description: "Learn how The SozoRock Foundation handles information submitted through inquiries, participation forms, publication access and this website.",
    pageType: "WebPage",
  },
  "/accessibility": {
    title: "Accessibility | The SozoRock Foundation",
    description: "Review The SozoRock Foundation's digital accessibility approach, accommodation pathway, feedback process and ongoing review.",
    pageType: "WebPage",
  },
  "/nondiscrimination": {
    title: "Nondiscrimination | The SozoRock Foundation",
    description: "Review The SozoRock Foundation's commitment to equal access, dignity, accommodation and nondiscrimination.",
    pageType: "WebPage",
  },
  "/terms": {
    title: "Website Terms | The SozoRock Foundation",
    description: "Terms governing lawful use of The SozoRock Foundation website, public forms, public-interest materials, external links and marks.",
    pageType: "WebPage",
  },
};

const routeKeywords = {
  "/ai-society": ["AI and society", "community participation", "human review", "AI governance", "institutional response", "public accountability"],
  "/": ["SozoRock Foundation", "health access", "public systems", "health systems assurance", "community evidence", "rural equity", "responsible AI"],
  "/platforms": ["SozoRock platforms", "Global Institute", "SozoRock Health", "SozoRock AI Lab", "community evidence", "public systems"],
  "/platforms/institute": ["public-interest research", "systems intelligence", "governance research", "health systems assurance", "rural institutions", "SozoRock Global Institute"],
  "/platforms/health": ["health access", "place intelligence", "community health evidence", "rural health", "SozoRock Health"],
  "/platforms/ai-lab": ["responsible artificial intelligence", "applied AI learning", "AI verification", "human judgment", "SozoRock AI Lab"],
  "/publications": ["health systems publications", "governance research", "rural governance research", "health equity research", "public-interest reports"],
  "/insights": ["health access insights", "public systems intelligence", "community evidence", "responsible AI insights"],
  "/events": ["public-interest briefings", "health systems roundtables", "community deliberation", "AI and society events", "SozoRock events"],
  "/about": ["SozoRock Foundation mission", "public-interest foundation", "health access", "public systems", "rural equity", "responsible AI"],
  "/leadership": ["SozoRock Foundation leadership", "global health leadership", "public-interest governance"],
  "/partner": ["partner with SozoRock", "health access partnership", "research partnership", "public systems", "AI and society"],
  "/support": ["support SozoRock Foundation", "support health access", "support public-interest research", "support community participation"],
};

const breadcrumbNames = {
  "ai-society": "AI & Society",
  contact: "Contact",
  platforms: "Work",
  institute: "SozoRock Global Institute",
  health: "SozoRock Health",
  "ai-lab": "SozoRock AI Lab",
  publications: "Publications",
  publication: "Publications",
  insights: "Insights",
  events: "Events",
  about: "About",
  leadership: "Leadership",
  partner: "Partner",
  support: "Support",
  standards: "Standards",
  privacy: "Privacy Notice",
  accessibility: "Accessibility",
  nondiscrimination: "Nondiscrimination",
  terms: "Website Terms",
};

function cleanPath(pathname = "/") {
  const value = pathname.split(/[?#]/u)[0] || "/";
  return value.length > 1 ? value.replace(/\/+$/u, "") : "/";
}

function publicationForPath(pathname) {
  return publications.find((publication) => publication.path === pathname);
}

function accessPublicationForPath(pathname) {
  return publications.find((publication) => publication.accessPath === pathname);
}

function breadcrumbsForPath(pathname, publication) {
  if (pathname === "/") return null;
  const items = [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN }];
  if (publication || pathname.startsWith("/publication/")) {
    items.push({ "@type": "ListItem", position: 2, name: "Publications", item: `${SITE_ORIGIN}/publications` });
    if (publication) items.push({ "@type": "ListItem", position: 3, name: publication.title, item: `${SITE_ORIGIN}${publication.path}` });
  } else {
    const parts = pathname.split("/").filter(Boolean);
    let accumulated = "";
    parts.forEach((part, index) => {
      accumulated += `/${part}`;
      items.push({
        "@type": "ListItem",
        position: index + 2,
        name: breadcrumbNames[part] || part.replace(/-/gu, " "),
        item: `${SITE_ORIGIN}${accumulated}`,
      });
    });
  }
  return { "@type": "BreadcrumbList", "@id": `${SITE_ORIGIN}${pathname}/#breadcrumb`, itemListElement: items };
}

function publicationSchema(publication, canonicalUrl) {
  return {
    "@type": "Report",
    "@id": `${canonicalUrl}/#report`,
    name: `${publication.title}, ${publication.volume}`,
    alternateName: publication.subtitle,
    headline: publication.tagline,
    description: publication.description,
    author: publication.author ? { "@type": "Person", name: publication.author } : undefined,
    publisher: { "@id": ORGANIZATION_ID },
    datePublished: publication.dateMachine || publication.date,
    inLanguage: publication.languageCode || "en-US",
    pagination: publication.pages,
    url: canonicalUrl,
    mainEntityOfPage: { "@id": `${canonicalUrl}/#webpage` },
    image: `${SITE_ORIGIN}${publication.cover}`,
    keywords: [publication.theme, "public-interest research", "systems intelligence"].filter(Boolean),
    identifier: [
      publication.isbn ? { "@type": "PropertyValue", propertyID: "ISBN", value: publication.isbn } : null,
      publication.doi ? { "@type": "PropertyValue", propertyID: "DOI", value: publication.doi } : null,
    ].filter(Boolean),
  };
}

export function getSeoForPath(inputPathname = "/") {
  const pathname = cleanPath(inputPathname);
  const publication = publicationForPath(pathname);
  const accessPublication = accessPublicationForPath(pathname);
  const canonicalPath = accessPublication ? accessPublication.accessPath : pathname;
  const canonicalUrl = `${SITE_ORIGIN}${canonicalPath === "/" ? "" : canonicalPath}`;
  const base = publication
    ? {
        title: `${publication.title}, ${publication.volume} | SozoRock`,
        description: publication.metaDescription || publication.description,
        pageType: "WebPage",
        ogType: "article",
        image: `${SITE_ORIGIN}${publication.socialImage || publication.cover}`,
      }
    : accessPublication
      ? {
          title: `Request ${accessPublication.title} | SozoRock`,
          description: `Request free verified access to ${accessPublication.title}, ${accessPublication.volume}.`,
          pageType: "WebPage",
          robots: "noindex, nofollow, noarchive",
        }
      : routeSeo[pathname] || {
          title: `Page not found | ${SITE_NAME}`,
          description: "The requested page is not available.",
          pageType: "WebPage",
          robots: "noindex, follow",
        };

  const image = base.image || DEFAULT_SOCIAL_IMAGE;
  const keywords = publication
    ? [publication.theme, publication.title, "public-interest research", "systems intelligence"].filter(Boolean)
    : routeKeywords[pathname] || ["SozoRock Foundation", "public-interest research"];
  const breadcrumb = breadcrumbsForPath(pathname, publication);
  const graph = [
    {
      "@type": "NGO",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      legalName: "The SozoRock Foundation, Inc.",
      alternateName: "SozoRock Foundation",
      url: SITE_ORIGIN,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_ORIGIN}/media/sozorock-logo.png`,
        width: 236,
        height: 48,
      },
      slogan: "Access. Assurance. Intelligence.",
      publishingPrinciples: `${SITE_ORIGIN}/standards`,
      ethicsPolicy: `${SITE_ORIGIN}/standards`,
      knowsAbout: [
        "health access",
        "health systems assurance",
        "public systems",
        "governance",
        "systems intelligence",
        "community evidence",
        "rural health",
        "rural equity",
        "community participation",
        "responsible applied artificial intelligence",
      ],
      sameAs: ["https://x.com/srockfoundation", "https://www.instagram.com/srockfoundation/", "https://www.youtube.com/@srockfoundation"],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_ORIGIN,
      name: SITE_NAME,
      description: routeSeo["/"].description,
      publisher: { "@id": ORGANIZATION_ID },
      inLanguage: "en-US",
    },
    {
      "@type": base.pageType,
      "@id": `${canonicalUrl}/#webpage`,
      url: canonicalUrl,
      name: base.title,
      description: base.description,
      keywords: keywords.join(", "),
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORGANIZATION_ID },
      breadcrumb: breadcrumb ? { "@id": breadcrumb["@id"] } : undefined,
      inLanguage: "en-US",
      primaryImageOfPage: { "@type": "ImageObject", url: image, width: publication ? 1200 : 1731, height: publication ? 630 : 909 },
      mainEntity: publication ? { "@id": `${canonicalUrl}/#report` } : undefined,
    },
    breadcrumb,
    publication ? publicationSchema(publication, canonicalUrl) : null,
    pathname === "/leadership"
      ? {
          "@type": "ItemList",
          "@id": `${canonicalUrl}/#leadership`,
          name: "Leadership",
          itemListElement: leaders.map((leader, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: { "@type": "Person", name: leader.name, jobTitle: leader.title, worksFor: { "@id": ORGANIZATION_ID } },
          })),
        }
      : null,
  ].filter(Boolean);

  return {
    pathname,
    isNotFound: !publication && !accessPublication && !routeSeo[pathname],
    title: base.title,
    description: base.description,
    keywords: keywords.join(", "),
    canonicalUrl,
    robots: base.robots || "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    ogType: base.ogType || "website",
    image,
    imageWidth: publication ? 1200 : 1731,
    imageHeight: publication ? 630 : 909,
    imageAlt: publication ? `${publication.title}, ${publication.volume} publication preview` : "The SozoRock Foundation — Access. Assurance. Intelligence.",
    schema: { "@context": "https://schema.org", "@graph": graph },
    publication,
  };
}
