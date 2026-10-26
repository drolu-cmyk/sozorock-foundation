import { useEffect } from "react";

import { NotFoundPage } from "./Pages";
import { Footer, Header } from "./SiteChrome";
import { publications } from "./siteData";
import { useCurrentPath } from "./router";
import { getSeoForPath } from "./seoRuntime";
import { HomePage } from "./site/home";
import { AiLabPage, AiSocietyPage, HealthPage, OurWorkPage, WorkforcePage } from "./site/work";
import { AccessPage, PublicationPage, ResearchPage } from "./site/research";
import { AboutPage, ContactPage, EventsPage, LeadershipPage, LegalPage, PartnerPage, SupportPage, legalPages } from "./site/about";

// Retired routes answer with a permanent redirect at the edge; the app shows the destination if one is reached in the browser.
export const retiredRoutes = { "/platforms/applied-learning": "/workforce", "/platforms/institute": "/publications", "/insights": "/publications" };

const pages = {
  "/": HomePage,
  "/platforms": OurWorkPage,
  "/platforms/health": HealthPage,
  "/workforce": WorkforcePage,
  "/ai-society": AiSocietyPage,
  "/platforms/ai-lab": AiLabPage,
  "/events": EventsPage,
  "/about": AboutPage,
  "/leadership": LeadershipPage,
  "/partner": PartnerPage,
  "/support": SupportPage,
  "/contact": ContactPage,
};

function RouteView({ pathname }) {
  const target = retiredRoutes[pathname] || pathname;
  const Page = pages[target];
  if (Page) return <Page />;
  if (target === "/publications") return <ResearchPage publications={publications} />;
  if (legalPages[target]) return <LegalPage {...legalPages[target]} />;
  const access = publications.find((item) => item.accessPath === target);
  if (access) return <AccessPage publication={access} />;
  const publication = publications.find((item) => item.path === target);
  if (publication) return <PublicationPage publication={publication} />;
  return <NotFoundPage />;
}

export function App({ initialPath }) {
  const { pathname } = useCurrentPath(initialPath);
  const seo = getSeoForPath(pathname);

  useEffect(() => {
    document.title = seo.title;
    const setMeta = (name, content, attribute = "name") => {
      let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
      if (!content) {
        element?.remove();
        return;
      }
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (seo.isNotFound) {
      canonical?.remove();
    } else if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    if (!seo.isNotFound) canonical.setAttribute("href", seo.canonicalUrl);

    setMeta("description", seo.description);
    setMeta("keywords", seo.keywords);
    setMeta("robots", seo.robots);
    setMeta("og:site_name", "The SozoRock Foundation", "property");
    setMeta("og:locale", "en_US", "property");
    setMeta("og:title", seo.title, "property");
    setMeta("og:description", seo.description, "property");
    setMeta("og:url", seo.canonicalUrl, "property");
    setMeta("og:type", seo.ogType, "property");
    setMeta("og:image", seo.image, "property");
    setMeta("og:image:secure_url", seo.image, "property");
    setMeta("og:image:type", "image/png", "property");
    setMeta("og:image:width", String(seo.imageWidth), "property");
    setMeta("og:image:height", String(seo.imageHeight), "property");
    setMeta("og:image:alt", seo.imageAlt, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:domain", "sozorockfoundation.org");
    setMeta("twitter:site", "@srockfoundation");
    setMeta("twitter:creator", "@srockfoundation");
    setMeta("twitter:title", seo.title);
    setMeta("twitter:description", seo.description);
    setMeta("twitter:image", seo.image);
    setMeta("twitter:image:alt", seo.imageAlt);
    setMeta("article:published_time", seo.publication?.dateMachine || seo.publication?.date, "property");
    setMeta("article:section", seo.publication?.theme, "property");

    const citationMeta = {
      citation_title: seo.publication?.bibliographicTitle,
      citation_author: seo.publication ? (seo.publication.citationAuthor || "Adeyemo, Oluwabiyi") : null,
      citation_publication_date: seo.publication ? String(seo.publication.dateMachine || seo.publication.date).replace(/-/gu, "/") : null,
      citation_technical_report_institution: seo.publication?.publisher || (seo.publication ? "The SozoRock Foundation, Inc." : null),
      citation_technical_report_number: seo.publication?.reportNumber,
      citation_abstract_html_url: seo.publication ? seo.canonicalUrl : null,
      citation_publisher: seo.publication?.publisher || (seo.publication ? "The SozoRock Foundation, Inc." : null),
      citation_isbn: seo.publication?.isbn,
      citation_language: seo.publication ? (seo.publication.languageCode || "en-US") : null,
      citation_abstract: seo.publication?.abstract || seo.publication?.description,
      citation_doi: seo.publication?.doi,
    };
    Object.entries(citationMeta).forEach(([name, content]) => setMeta(name, content));

    const schemaId = "site-schema";
    document.getElementById(schemaId)?.remove();
    const schema = document.createElement("script");
    schema.id = schemaId;
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify(seo.schema);
    document.head.appendChild(schema);
  }, [seo]);

  return (
    <div className="site-frame approved-site ns-site">
      <Header pathname={pathname} />
      <main id="main-content" key={pathname} className="page-view" tabIndex={-1}>
        <RouteView pathname={pathname} />
      </main>
      <Footer />
    </div>
  );
}
