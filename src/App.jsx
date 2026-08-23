import { useEffect } from "react";
import { HomePage } from "./HomePage";
import {
  AboutPage,
  AiLabPage,
  EventsPage,
  HealthPage,
  InsightsPage,
  InstitutePage,
  LeadershipPage,
  NotFoundPage,
  PartnerPage,
  PlatformsPage,
  PublicationPage,
  PublicationAccessPage,
  PublicationsPage,
  StandardsPage,
  SupportPage,
} from "./Pages";
import { Footer, Header } from "./SiteChrome";
import { publications } from "./siteData";
import { useCurrentPath } from "./router";

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
  return <NotFoundPage />;
}

const titleMap = {
  "/": "The SozoRock Foundation | Access. Assurance. Intelligence.",
  "/platforms": "Platforms | The SozoRock Foundation",
  "/platforms/institute": "SozoRock Global Institute | The SozoRock Foundation",
  "/platforms/health": "SozoRock Health | The SozoRock Foundation",
  "/platforms/ai-lab": "SozoRock AI Lab | The SozoRock Foundation",
  "/publications": "Publications | The SozoRock Foundation",
  "/insights": "Insights | The SozoRock Foundation",
  "/events": "Events | The SozoRock Foundation",
  "/about": "About | The SozoRock Foundation",
  "/leadership": "Leadership | The SozoRock Foundation",
  "/partner": "Partner | The SozoRock Foundation",
  "/support": "Support | The SozoRock Foundation",
  "/standards": "Standards | The SozoRock Foundation",
};

export function App() {
  const { pathname } = useCurrentPath();
  const publication = publications.find((item) => item.path === pathname);
  const accessPublication = publications.find((item) => item.accessPath === pathname);
  const publicationTitle = publication?.title;
  const title = publicationTitle ? `${publicationTitle} | The SozoRock Foundation` : accessPublication ? `Publication access | The SozoRock Foundation` : titleMap[pathname] || "The SozoRock Foundation";

  useEffect(() => {
    document.title = title;
    const origin = "https://www.sozorockfoundation.org";
    const canonicalUrl = `${origin}${pathname}`;
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
    canonical.setAttribute("href", canonicalUrl);

    const description = publication?.description || "The SozoRock Foundation builds platforms for better health and public systems through public-interest research, health access, systems intelligence, convening, and applied learning.";
    setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("og:type", publication ? "article" : "website", "property");
    setMeta("og:image", publication ? `${origin}${publication.cover}` : `${origin}/media/sozorock-logo.png`, "property");
    setMeta("robots", accessPublication ? "noindex, nofollow" : "index, follow");

    const citationMeta = {
      citation_title: publication ? `${publication.title}, ${publication.volume}: ${publication.subtitle || publication.tagline}` : null,
      citation_author: publication?.author,
      citation_publication_date: publication?.dateMachine,
      citation_publisher: publication?.publisher,
      citation_isbn: publication?.isbn,
      citation_language: publication?.languageCode,
      citation_abstract: publication?.description,
      citation_doi: publication?.doi,
    };
    Object.entries(citationMeta).forEach(([name, content]) => setMeta(name, content));

    const schemaId = "publication-schema";
    document.getElementById(schemaId)?.remove();
    if (publication) {
      const schema = document.createElement("script");
      schema.id = schemaId;
      schema.type = "application/ld+json";
      schema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Report",
        name: `${publication.title}, ${publication.volume}`,
        alternateName: publication.subtitle,
        description: publication.description,
        author: { "@type": "Person", name: publication.author },
        publisher: publication.publisher ? { "@type": "Organization", name: publication.publisher } : undefined,
        datePublished: publication.dateMachine,
        inLanguage: publication.languageCode,
        isbn: publication.isbn,
        url: canonicalUrl,
        image: `${origin}${publication.cover}`,
        identifier: [
          publication.isbn ? { "@type": "PropertyValue", propertyID: "ISBN", value: publication.isbn } : null,
          publication.doi ? { "@type": "PropertyValue", propertyID: "DOI", value: publication.doi } : null,
        ].filter(Boolean),
      });
      document.head.appendChild(schema);
    }
  }, [pathname, publication, accessPublication, title]);

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
