import { useState } from "react";
import { Link } from "../router";
import { PublicationAccessPage } from "../PublicationAccessPage";
import { Btn, More, Sec } from "./ui";
import "../outlook.css";

function CopyText({ text, children }) {
  const [status, setStatus] = useState("");
  return <span className="outlook-copy"><button type="button" onClick={async () => {
    try { await navigator.clipboard.writeText(text); setStatus("Copied."); }
    catch { setStatus("Select and copy the text shown on this page."); }
  }}>{children}</button><span role="status" aria-live="polite">{status}</span></span>;
}

function Sources({ outlook, ids }) {
  return <p className="outlook-source">Sources: {ids.map((id, i) => <span key={id}>{i > 0 ? "; " : ""}<a href={outlook.sources[id].url}>{outlook.sources[id].organization}</a></span>)}.</p>;
}

const columnLabels = {
  label: "Category", detail: "Firm size", worker: "Worker contribution ($)", total: "Total premium ($)",
  growth: "Projected employment change (%)", openings: "Average annual openings", date: "Survey month",
  use: "Uses AI at least occasionally (%)", plan: "Reports a clear organizational AI plan (%)",
};

function Exhibit({ outlook, number }) {
  const exhibit = outlook.exhibits[number];
  const cols = Object.keys(exhibit.data[0]);
  return <figure className="outlook-exhibit" aria-labelledby={`exhibit-${number}-title`}>
    <figcaption><p className="outlook-label">Exhibit {number}</p><h3 id={`exhibit-${number}-title`}>{exhibit.headline}</h3><p>{exhibit.metric}</p></figcaption>
    <div className="outlook-chart" tabIndex={0} role="region" aria-label={`Exhibit ${number} chart; scroll horizontally on a small screen`}>
      <img src={`${outlook.assetBase}/exhibit-${number}.svg`} alt={exhibit.headline} loading="lazy" decoding="async" />
    </div>
    <p className="outlook-source">{exhibit.note}</p>
    <Sources outlook={outlook} ids={exhibit.sources} />
    <details><summary>View exhibit data</summary><div className="outlook-table" role="region" tabIndex={0} aria-label={`Exhibit ${number} data`}><table><caption>{exhibit.metric}</caption><thead><tr>{cols.map(col => <th scope="col" key={col}>{columnLabels[col] || col}</th>)}</tr></thead><tbody>{exhibit.data.map((row, i) => <tr key={i}>{cols.map((col, j) => j === 0 ? <th scope="row" key={col}>{row[col]}</th> : <td key={col}>{typeof row[col] === "number" ? row[col].toLocaleString("en-US") : row[col]}</td>)}</tr>)}</tbody></table></div></details>
  </figure>;
}

export function OutlookFeature({ outlook, compact = false }) {
  return <article className={`outlook-feature ${compact ? "is-compact" : ""}`}>
    <div><p className="ns-eyebrow">Economic outlook · {outlook.date}</p><h2 className="ns-stmt s40"><Link href={outlook.path}>{outlook.title}</Link></h2><p className="ns-body">Higher health costs and changing digital jobs complicate a growing economy. The choices institutions make will shape access, employment, and accountable services.</p><div className="ns-actions"><Btn href={outlook.path}>Read the outlook</Btn><span className="ns-src">By {outlook.author} · 9-page download</span></div></div>
    <Link className="outlook-feature-cover" href={outlook.path}><img src={outlook.cover} alt={`${outlook.title} cover`} width="612" height="792" loading="lazy" decoding="async" /></Link>
  </article>;
}

export function OutlookPage({ outlook }) {
  const article = outlook.article;
  const url = encodeURIComponent(outlook.canonicalUrl);
  return <article className="ns outlook-page">
    <header className="outlook-hero ns-shell">
      <div><Link className="outlook-breadcrumb" href="/publications">Research</Link><p className="outlook-label">Economic outlook · {outlook.date}</p><h1>{outlook.title}</h1><p className="outlook-deck">{outlook.abstract}</p><p className="outlook-byline">By <a href={outlook.orcid}>{outlook.author}</a> · Analysis · 5-minute read</p><div className="ns-actions"><Btn href={outlook.accessPath}>Download the nine-page report</Btn><More href="#outlook-analysis">Read the analysis</More></div><p className="outlook-source">Free PDF with email verification.</p></div>
      <div className="outlook-cover"><img src={outlook.cover} alt={`${outlook.title}, nine-page report cover`} width="612" height="792" fetchPriority="high" decoding="async" /></div>
    </header>
    <div className="outlook-reading" id="outlook-analysis">
      <nav className="outlook-share" aria-label="Share this analysis"><span>Share</span><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`} target="_blank" rel="noopener noreferrer">LinkedIn</a><a href={`https://x.com/intent/post?text=${encodeURIComponent(outlook.title)}&url=${url}`} target="_blank" rel="noopener noreferrer">X</a><CopyText text={outlook.canonicalUrl}>Copy link</CopyText></nav>
      <p>{article.intro}</p><Sources outlook={outlook} ids={article.intro_sources} />
      {article.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(p => <p key={p}>{p}</p>)}<Sources outlook={outlook} ids={section.sources} /><Exhibit outlook={outlook} number={section.exhibit} /></section>)}
      <section><h2>The outlook through October 2027</h2><p>{article.outlook}</p><div className="outlook-download"><div><p className="outlook-label">The full outlook</p><h3>Nine pages. Six exhibits. Three institutional choices.</h3><p>Read the national data, interpretation, and conditions to watch over the next year.</p><Btn href={outlook.accessPath}>Download the free report</Btn></div><img src={outlook.cover} alt="" width="612" height="792" loading="lazy" decoding="async" /></div></section>
      <section className="outlook-about"><h2>About this analysis</h2><p>{article.methods}</p><p><a href={outlook.orcid}>{outlook.author}</a> is {outlook.role} at The SozoRock Foundation.</p><h3>Cite this outlook</h3><p>{outlook.citation}</p><div className="outlook-citation-links"><CopyText text={`${outlook.citation} ${outlook.canonicalUrl}`}>Copy citation</CopyText><a href={`${outlook.assetBase}/citation.ris`} download>RIS</a><a href={`${outlook.assetBase}/citation.bib`} download>BibTeX</a></div></section>
    </div>
  </article>;
}

export function OutlookAccessPage({ outlook }) {
  return <div className="ns outlook-page"><div className="outlook-access-heading ns-shell"><Link href={outlook.path}>Return to the analysis</Link><p className="outlook-label">Free nine-page report</p><h1>{outlook.title}</h1><p className="outlook-deck">Enter your name and email to receive a verification link. Publication updates are optional.</p></div><Sec><div className="outlook-access-form"><PublicationAccessPage publication={outlook} embedded /></div></Sec></div>;
}
