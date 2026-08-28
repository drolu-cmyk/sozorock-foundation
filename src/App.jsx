import { useEffect } from "react";
import { HomePage } from "./HomePage";
import {
  AboutPage,
  AccessibilityPage,
  AiLabPage,
  EventsPage,
  HealthPage,
  InsightsPage,
  InstitutePage,
  LeadershipPage,
  NotFoundPage,
  NondiscriminationPage,
  PartnerPage,
  PlatformsPage,
  PublicationPage,
  PublicationAccessPage,
  PublicationsPage,
  StandardsPage,
  SupportPage,
  PrivacyPage,
  TermsPage,
} from "./Pages";
import { Footer, Header } from "./SiteChrome";
import { publications } from "./siteData";
import { useCurrentPath } from "./router";
import { getSeoForPath } from "./seo";

function RouteView({ pathname }) {
  const publication = pathname.startsWith("/publication/") ? publications.find((item) => item.path === pathname) : null;
  const accessPublication = pathname.startsWith("/publication/") ? publications.find((item) => item.accessPath === pathname) : null;
  if (accessPublication) return <PublicationAccessPage publication={accessPublication} />;
  if (publication) return <PublicationPage publication={publication} />;
  if (pathname === "/") return <HomePage />;
  if (pathname === "/platforms") return <PlatformsPage />;
  if (pathname === "/platforms/institute") return <InstitutePage />;
  if (pathname === "/platforms/health") return <HealthPage />;
  if (pathname === "/platforms/ai-lab") return <AiLabPage />;
  if (pathname === "/publications") return <PublicationsPage />;
  if (pathname === "/insights") return <InsightsPage />;
  if (pathname === "/events") return <EventsPage />;
  if (pathname === "/about") return <AboutPage />;
  if (pathname === "/leadership") return <LeadershipPage />;
  if (pathname === "/partner") return <PartnerPage />;
  if (pathname === "/support") return <SupportPage />;
  if (pathname === "/standards") return <StandardsPage />;
  if (pathname === "/privacy") return <PrivacyPage />;
  if (pathname === "/accessibility") return <AccessibilityPage />;
  if (pathname === "/nondiscrimination") return <NondiscriminationPage />;
  if (pathname === "/terms") return <TermsPage />;
  return <NotFoundPage />;
}

export function App() {
  const { pathname } = useCurrentPath();
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
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", seo.canonicalUrl);

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
    setMeta("og:image:width", "1200", "property");
    setMeta("og:image:height", "630", "property");
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
      citation_title: seo.publication ? `${seo.publication.title}, ${seo.publication.volume}: ${seo.publication.subtitle || seo.publication.tagline}` : null,
      citation_author: seo.publication?.author,
      citation_publication_date: seo.publication?.dateMachine,
      citation_publisher: seo.publication?.publisher || (seo.publication ? "The SozoRock Foundation, Inc." : null),
      citation_isbn: seo.publication?.isbn,
      citation_language: seo.publication?.languageCode,
      citation_abstract: seo.publication?.description,
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
    <div className="site-frame">
      <Header pathname={pathname} />
      <main id="main-content" key={pathname} className="page-view">
        <RouteView pathname={pathname} />
      </main>
      <Footer />
    </div>
  );
}
