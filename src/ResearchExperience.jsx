import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "./router";
import { publications } from "./siteData";

const researchNotes = {
  "hsa-v1-2026": "For leaders deciding what evidence should support trust in digital health systems.",
  "rebs-v1-2025": "For communities planning health access around literacy, technology, workforce and local capacity.",
  "rrg-v1-2025": "For institutions coordinating public decisions when responsibility and capacity are fragmented.",
};

const researchBriefs = {
  "hsa-v1-2026": {
    why: "Digital health systems can look credible before the operating evidence is strong enough to trust them. This volume brings obligations, risk, evidence, exceptions and accountable decisions into the same frame.",
    use: "Use it when reviewing digital health governance, assurance, controls or the evidence behind a consequential decision.",
  },
  "rebs-v1-2025": {
    why: "Health access is shaped by more than provider supply. This volume connects community readiness, health literacy, technology, workforce and access planning so local leaders can examine the system around care.",
    use: "Use it when planning rural or underserved health access, community readiness or a local access model.",
  },
  "rrg-v1-2025": {
    why: "Rural public problems often cross institutional boundaries. This volume examines how evidence, responsibility and coordination can move from fragmented response toward accountable action.",
    use: "Use it when examining local governance, institutional roles or coordination around a public problem.",
  },
};

export function ResearchPage() {
  return (
    <>
      <section className="research-page-hero final-page-hero" aria-labelledby="research-page-title">
        <div className="shell research-page-hero-inner">
          <h1 id="research-page-title">Research built to be used.</h1>
          <p>Three publications turn field questions into frameworks for health access, governance and digital assurance. Each record is free to access, citable and explicit about its limits.</p>
        </div>
      </section>
      <section className="research-index" aria-label="SozoRock publications">
        <div className="shell research-index-list">
          {publications.map((publication) => (
            <article className="research-index-entry" key={publication.slug}>
              <Link href={publication.path} className="research-index-cover" aria-label={`Read ${publication.title}`}>
                <img src={publication.cover} alt={`${publication.title}, ${publication.volume} cover`} loading="lazy" />
              </Link>
              <div className="research-index-copy">
                <p className="research-index-date">{publication.date}</p>
                <h2><Link href={publication.path}>{publication.title}</Link></h2>
                <p className="research-index-question">{publication.tagline}</p>
                <p>{researchNotes[publication.slug] || publication.description}</p>
                <div className="research-index-actions">
                  <Link href={publication.path} className="experience-link">View the research<ArrowRight size={21} aria-hidden="true" /></Link>
                  {publication.accessPath && <Link href={publication.accessPath} className="research-access-link">Get the publication</Link>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="experience-close research-close">
        <div className="shell experience-close-inner">
          <h2>Have a decision the research should inform?</h2>
          <p>Bring the question, the evidence available and the decision ahead. SozoRock can discuss a research briefing or a defined collaboration.</p>
          <Link href="/partner" className="experience-link">Request a conversation<ArrowRight size={24} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}

export function PublicationDetailPage({ publication }) {
  const [citationStatus, setCitationStatus] = useState("");
  const brief = researchBriefs[publication.slug] || { why: publication.description, use: "Use the published record where its scope and evidence fit the decision in front of you." };
  const related = publications.filter((item) => item.slug !== publication.slug);

  const copyCitation = async () => {
    if (!publication.citation) return;
    try {
      await navigator.clipboard.writeText(publication.citation);
      setCitationStatus("Citation copied");
    } catch {
      setCitationStatus("Copy unavailable. Select the citation text to copy it.");
    }
  };

  return (
    <>
      <section className="research-detail-hero">
        <div className="shell research-detail-grid">
          <div className="research-detail-cover"><img src={publication.cover} alt={`${publication.title}, ${publication.volume} cover`} /></div>
          <div className="research-detail-copy">
            <h1>{publication.title}</h1>
            <p className="research-detail-volume">{publication.volume}</p>
            <p className="research-detail-tagline">{publication.tagline}</p>
            <p>{researchNotes[publication.slug] || publication.description}</p>
            <div className="research-detail-actions">
              {publication.accessPath ? <Link href={publication.accessPath} className="button button-primary">Get the publication</Link> : <a href={publication.external} className="button button-primary">Access the publication</a>}
              {publication.doi && <a href={`https://doi.org/${publication.doi}`} className="experience-link">Open DOI<ArrowRight size={20} aria-hidden="true" /></a>}
            </div>
            <dl className="research-detail-meta">
              <div><dt>Author</dt><dd>{publication.author}</dd></div>
              <div><dt>Published</dt><dd>{publication.date}</dd></div>
              {publication.doi && <div><dt>DOI</dt><dd>{publication.doi}</dd></div>}
              {publication.isbn && <div><dt>ISBN</dt><dd>{publication.isbn}</dd></div>}
            </dl>
          </div>
        </div>
      </section>

      <section className="research-detail-why" aria-labelledby="research-why-title">
        <div className="shell research-detail-reading">
          <h2 id="research-why-title">Why this research exists.</h2>
          <p>{brief.why}</p>
          <p className="research-detail-use">{brief.use}</p>
          {publication.limits && <div className="research-detail-limit"><strong>Scope matters.</strong><p>{publication.limits}</p></div>}
        </div>
      </section>

      {publication.citation && (
        <section className="research-detail-record" aria-labelledby="research-record-title">
          <div className="shell research-detail-record-grid">
            <div><h2 id="research-record-title">Use the published record.</h2><p>The citation, access route and publication details stay with the work so others can examine the same record.</p></div>
            <div>
              <p className="research-detail-citation">{publication.citation}</p>
              <div className="research-detail-citation-actions">
                <button type="button" className="text-button" onClick={copyCitation}>Copy citation</button>
                {publication.accessPath && <Link href={publication.accessPath} className="text-link">Get the PDF</Link>}
              </div>
              <p className="citation-status" role="status" aria-live="polite">{citationStatus}</p>
              {publication.copyright && <p className="copyright-note">{publication.copyright}</p>}
            </div>
          </div>
        </section>
      )}

      <section className="research-related" aria-labelledby="research-related-title">
        <div className="shell research-related-inner">
          <h2 id="research-related-title">Continue the research.</h2>
          <div className="research-related-list">
            {related.map((item) => <Link href={item.path} key={item.slug}><strong>{item.title}</strong><span>{item.tagline}</span><ArrowRight size={22} aria-hidden="true" /></Link>)}
          </div>
        </div>
      </section>
    </>
  );
}
