// Shared by the static renderer and the browser so navigation cannot change
// the bibliographic record presented to readers or crawlers.
export function getCitationMetadata(seo) {
  const publication = seo.publication;
  const date = publication?.dateMachine || "";
  // Scholar asks for a full date when known, or a year when it is not.
  const citationDate = /^\d{4}-\d{2}-\d{2}$/u.test(date)
    ? date.replace(/-/gu, "/")
    : /^\d{4}(?:-\d{2})?$/u.test(date) ? date.slice(0, 4) : null;

  return {
    citation_title: publication ? publication.bibliographicTitle || `${publication.title}, ${publication.volume}: ${publication.subtitle || publication.tagline}` : null,
    citation_author: publication?.citationAuthor,
    citation_publication_date: citationDate,
    citation_technical_report_institution: publication?.publisher,
    citation_technical_report_number: publication?.reportNumber,
    citation_abstract_html_url: publication ? seo.canonicalUrl : null,
    citation_publisher: publication?.publisher,
    citation_isbn: publication?.isbn,
    citation_language: publication ? publication.languageCode || "en-US" : null,
    citation_abstract: publication?.minimalMetadata ? null : publication?.abstract || publication?.description,
    citation_doi: publication?.doi,
  };
}
