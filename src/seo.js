import { leaders, publications } from "./siteData.js";

export const SITE_ORIGIN = "https://www.sozorockfoundation.org";
export const SITE_NAME = "The SozoRock Foundation";
export const DEFAULT_SOCIAL_IMAGE = `${SITE_ORIGIN}/media/sozorock-social-card.png`;
export const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;

const routeSeo = {
  "/": {
    title: "The SozoRock Foundation | Health Access, Systems & AI",
    description: "The SozoRock Foundation advances health access, public systems, evidence-based assurance, and responsible applied AI through research and implementation.",
    pageType: "WebPage",
  },
  "/platforms": {
    title: "Platforms | The SozoRock Foundation",
    description: "Explore SozoRock Global Institute, SozoRock Health, and SozoRock AI Lab—three platforms connecting evidence, access, and applied learning.",
    pageType: "CollectionPage",
  },
  "/platforms/institute": {
    title: "SozoRock Global Institute | Research & Convening",
    description: "Public-interest research, publications, briefings, firesides, and roundtables across assurance, governance, access, and systems intelligence.",
    pageType: "WebPage",
  },
  "/platforms/health": {
    title: "SozoRock Health | Health Access & Place Intelligence",
    description: "SozoRock Health develops non-clinical access, navigation, place intelligence, and community evidence while licensed care remains with providers.",
    pageType: "WebPage",
  },
  "/platforms/ai-lab": {
    title: "SozoRock AI Lab | Responsible Applied AI Learning",
    description: "Practical AI learning for real work, centered on human judgment, verification, responsible use, and reviewed implementation.",
    pageType: "WebPage",
  },
  "/publications": {
    title: "Publications | The SozoRock Foundation",
    description: "Browse permanent public-interest publication records on health systems assurance, rural governance, health access, and equity.",
    pageType: "CollectionPage",
  },
  "/insights": {
    title: "Insights | The SozoRock Foundation",
    description: "Read field updates, briefings, and systems intelligence from SozoRock work in health access, public systems, and applied AI.",
    pageType: "CollectionPage",
  },
  "/events": {
    title: "Events | The SozoRock Foundation",
    description: "Explore SozoRock firesides, roundtables, and briefings connecting public-interest evidence with practitioners and institutions.",
    pageType: "CollectionPage",
  },
  "/about": {
    title: "About | The SozoRock Foundation",
    description: "Learn how The SozoRock Foundation connects public-interest research, community implementation, systems intelligence, and applied learning.",
    pageType: "AboutPage",
  },
  "/leadership": {
    title: "Leadership | The SozoRock Foundation",
    description: "Meet the leaders accountable for The SozoRock Foundation's global health partnerships, global affairs, health education, and strategic initiatives.",
    pageType: "ProfilePage",
  },
  "/partner": {
    title: "Partner | The SozoRock Foundation",
    description: "Partner with SozoRock on briefings, health access, community Hubs, convening, public-interest publications, or applied AI learning.",
    pageType: "WebPage",
  },
  "/support": {
    title: "Support | The SozoRock Foundation",
    description: "Support public-interest research, health access, community evidence, convening, and responsible applied AI learning.",
    pageType: "WebPage",
  },
  "/standards": {
    title: "Standards & Policies | The SozoRock Foundation",
    description: "Review SozoRock standards for independence, corrections, funding, authorship, AI use, citations, accessibility, privacy, and nondiscrimination.",
    pageType: "WebPage",
  },
  "/privacy": {
    title: "Privacy Notice | The SozoRock Foundation",
    description: "Learn how The SozoRock Foundation handles information submitted through inquiries, publication access, and this website.",
    pageType: "WebPage",
  },
  "/accessibility": {
    title: "Accessibility | The SozoRock Foundation",
    description: "Review The SozoRock Foundation's digital accessibility approach, accommodation pathway, and feedback process.",
    pageType: "WebPage",
  },
  "/nondiscrimination": {
    title: "Nondiscrimination | The SozoRock Foundation",
    description: "Review The SozoRock Foundation's commitment to equal access, dignity, accommodation, and nondiscrimination.",
    pageType: "WebPage",
  },
  "/terms": {
    title: "Website Terms | The SozoRock Foundation",
    description: "Terms governing lawful use of The SozoRock Foundation website, public-interest materials, external links, and trademarks.",
    pageType: "WebPage",
  },
};

const breadcrumbNames = {
  platforms: "Platforms",
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
  privacy: "Privacy",
  accessibility: "Accessibility",
  nondiscrimination: "Nondiscrimination",
  terms: "Terms",
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
    isbn: publication.isbn,
    pagination: publication.pages,
    edition: publication.edition,
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
      email: "contact@sozorockfoundation.org",
      nonprofitStatus: "https://schema.org/Nonprofit501c3",
      taxID: "39-4736725",
      slogan: "Access. Assurance. Intelligence.",
      publishingPrinciples: `${SITE_ORIGIN}/standards`,
      ethicsPolicy: `${SITE_ORIGIN}/standards`,
      knowsAbout: [
        "health access",
        "health systems assurance",
        "public systems",
        "systems intelligence",
        "rural equity",
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
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORGANIZATION_ID },
      breadcrumb: breadcrumb ? { "@id": breadcrumb["@id"] } : undefined,
      inLanguage: "en-US",
      primaryImageOfPage: { "@type": "ImageObject", url: image, width: 1200, height: 630 },
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
    title: base.title,
    description: base.description,
    canonicalUrl,
    robots: base.robots || "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    ogType: base.ogType || "website",
    image,
    imageAlt: publication ? `${publication.title}, ${publication.volume} publication preview` : "The SozoRock Foundation — Access. Assurance. Intelligence.",
    schema: { "@context": "https://schema.org", "@graph": graph },
    publication,
  };
}
