import { useEffect, useRef, useState } from "react";
import { Link } from "../router";
import { PublicationAccessPage } from "../PublicationAccessPage";
import { Btn, Sec } from "./ui";
import "../outlook.css";

function CopyText({ text, children }) {
  const [status, setStatus] = useState("");
  return <span className="outlook-copy"><button type="button" onClick={async () => {
    try { await navigator.clipboard.writeText(text); setStatus("Copied."); }
    catch { setStatus("Select and copy the text shown on this page."); }
  }}>{children}</button><span role="status" aria-live="polite">{status}</span></span>;
}

function Sources({ outlook, ids }) {
  const groups = [];
  for (const id of ids) {
    const source = outlook.sources[id];
    const group = groups.find(g => g.organization === source.organization);
    if (group) group.items.push(source); else groups.push({ organization: source.organization, items: [source] });
  }
  return <p className="outlook-source">{ids.length > 1 ? "Sources" : "Source"}: {groups.map((g, i) => <span key={g.organization}>{i > 0 ? "; " : ""}{g.items.length === 1
    ? <a href={g.items[0].url}>{g.organization}</a>
    : <>{g.organization} ({g.items.map((item, j) => <span key={item.url + j}>{j > 0 ? ", " : ""}<a href={item.url}>{item.title.split(/[:,]/)[0]}</a></span>)})</>}</span>)}.</p>;
}

const columnLabels = {
  label: "Category", detail: "Firm size", worker: "Worker contribution ($)", total: "Total premium ($)",
  growth: "Projected employment change (%)", openings: "Average annual openings", date: "Survey month",
  use: "Uses AI at least occasionally (%)", plan: "Reports a clear organizational AI plan (%)",
};

function Exhibit({ outlook, number, label }) {
  const exhibit = outlook.exhibits[number];
  const cols = Object.keys(exhibit.data[0]);
  return <figure className="outlook-exhibit" aria-labelledby={`exhibit-${number}-title`}>
    <figcaption><p className="outlook-label">Exhibit {label}</p><h3 id={`exhibit-${number}-title`}>{exhibit.headline}</h3><p>{exhibit.metric}</p></figcaption>
    <div className="outlook-chart" tabIndex={0} role="region" aria-label={`Exhibit ${label} chart; scroll horizontally on a small screen`}>
      <img src={`${outlook.assetBase}/exhibit-${number}.svg`} alt={exhibit.headline} loading="lazy" decoding="async" />
    </div>
    <p className="outlook-source">{exhibit.note}</p>
    <Sources outlook={outlook} ids={exhibit.sources} />
    <p className="outlook-exhibit-mark"><span>The SozoRock Foundation</span><span>Exhibit {exhibit.reportNumber || number} in the full report</span></p>
    <details><summary>View exhibit data</summary><div className="outlook-table" role="region" tabIndex={0} aria-label={`Exhibit ${label} data`}><table><caption>{exhibit.metric}</caption><thead><tr>{cols.map(col => <th scope="col" key={col}>{columnLabels[col] || col}</th>)}</tr></thead><tbody>{exhibit.data.map((row, i) => <tr key={i}>{cols.map((col, j) => j === 0 ? <th scope="row" key={col}>{row[col]}</th> : <td key={col}>{typeof row[col] === "number" ? row[col].toLocaleString("en-US") : row[col]}</td>)}</tr>)}</tbody></table></div></details>
  </figure>;
}

const icons = {
  share: <path d="M15 8a3 3 0 1 0-2.83-4H12a3 3 0 0 0 .1.77L7.9 7.1a3 3 0 1 0 0 3.8l4.2 2.33A3 3 0 1 0 13 11.6L8.9 9.3a3 3 0 0 0 0-.6l4.2-2.33A3 3 0 0 0 15 8Z" />,
  print: <path d="M6 2h8v4H6V2Zm-2 5h12a2 2 0 0 1 2 2v5h-3v4H5v-4H2V9a2 2 0 0 1 2-2Zm3 6v3h6v-3H7Z" />,
  linkedin: <path d="M4.5 7H2v9h2.5V7ZM3.25 2.5a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9ZM9.1 7H6.7v9h2.5v-4.6c0-1.3.5-2.2 1.7-2.2s1.6.9 1.6 2.2V16H15v-5.3c0-2.6-1.4-3.9-3.3-3.9-1.3 0-2.2.7-2.6 1.3V7Z" />,
  x: <path d="M11.9 8.5 17.3 2h-1.3l-4.7 5.6L7.6 2H3.3l5.7 8.3L3.3 17h1.3l5-5.9 4 5.9h4.3l-6-8.5Zm-1.8 2.1-.6-.8L5 3h2l3.7 5.3.6.8 4.8 6.9h-2l-4-5.4Z" />,
  facebook: <path d="M11.2 18v-7h2.3l.4-2.8h-2.7V6.5c0-.8.2-1.3 1.4-1.3h1.4V2.7c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5v2.1H6.3V11h2.3v7h2.6Z" />,
  email: <path d="M2 4h16v12H2V4Zm2 2v.3l6 4 6-4V6H4Zm12 2.7-6 4-6-4V14h12V8.7Z" />,
  link: <path d="M8.5 11.5a3 3 0 0 0 4.2 0l3-3a3 3 0 0 0-4.2-4.2l-1 1 1.4 1.4 1-1a1 1 0 0 1 1.4 1.4l-3 3a1 1 0 0 1-1.4 0l-1.4 1.4Zm3-3a3 3 0 0 0-4.2 0l-3 3a3 3 0 0 0 4.2 4.2l1-1-1.4-1.4-1 1a1 1 0 0 1-1.4-1.4l3-3a1 1 0 0 1 1.4 0l1.4-1.4Z" />,
};
const Icon = ({ name }) => <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false">{icons[name]}</svg>;

// Share and print controls in the publication's tool row; the share menu follows the menu-button pattern.
function ShareTools({ outlook, variant = "row" }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const wrap = useRef(null), button = useRef(null), menu = useRef(null);
  const url = outlook.canonicalUrl, enc = encodeURIComponent(url), title = encodeURIComponent(outlook.title);
  const targets = [
    ["linkedin", "LinkedIn", `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`],
    ["x", "X", `https://x.com/intent/post?text=${title}&url=${enc}`],
    ["facebook", "Facebook", `https://www.facebook.com/sharer/sharer.php?u=${enc}`],
    ["email", "Email", `mailto:?subject=${title}&body=${enc}`],
  ];
  useEffect(() => {
    if (!open) return undefined;
    menu.current?.querySelector("a,button")?.focus();
    const away = event => { if (!wrap.current?.contains(event.target)) setOpen(false); };
    const key = event => { if (event.key === "Escape") { setOpen(false); button.current?.focus(); } };
    document.addEventListener("pointerdown", away); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", key); };
  }, [open]);
  const menuKeys = event => {
    if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    const items = [...menu.current.querySelectorAll("a,button")]; const i = items.indexOf(document.activeElement);
    items[(i + (event.key === "ArrowDown" ? 1 : items.length - 1)) % items.length].focus();
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setStatus("Link copied"); } catch { setStatus("Copy the address from your browser"); }
    setTimeout(() => setStatus(""), 2400);
  };
  return <div className={`outlook-tools is-${variant}`} ref={wrap}>
    <div className="outlook-tool-wrap">
      <button type="button" className="outlook-tool" ref={button} aria-haspopup="true" aria-expanded={open} aria-controls={`share-menu-${variant}`} onClick={() => setOpen(v => !v)}><Icon name="share" /><span className="outlook-tool-label">Share</span></button>
      {open && <div className="outlook-share-menu" id={`share-menu-${variant}`} ref={menu} role="menu" aria-label="Share this outlook" onKeyDown={menuKeys}>
        {targets.map(([key, label, href]) => <a key={key} role="menuitem" href={href} target={key === "email" ? undefined : "_blank"} rel="noopener noreferrer" onClick={() => setOpen(false)}><Icon name={key} />{label}</a>)}
        <button type="button" role="menuitem" onClick={copy}><Icon name="link" />Copy link</button>
      </div>}
    </div>
    <button type="button" className="outlook-tool" onClick={() => window.print()}><Icon name="print" /><span className="outlook-tool-label">Print</span></button>
    <span className="outlook-tool-status" role="status" aria-live="polite">{status}</span>
  </div>;
}

// The rail appears once the tool row under the byline has scrolled out of view.
function ShareRail({ outlook }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const row = document.querySelector(".outlook-tools.is-row");
    if (!row || !("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    observer.observe(row);
    return () => observer.disconnect();
  }, []);
  return <aside className={`outlook-rail${show ? " is-visible" : ""}`} aria-label="Share and print" aria-hidden={!show} inert={!show}><ShareTools outlook={outlook} variant="rail" /></aside>;
}

export function OutlookFeature({ outlook, compact = false, cover = true, primary = true }) {
  return <article className={`outlook-feature ${compact ? "is-compact" : ""}`}>
    <div><p className="ns-eyebrow">{outlook.series} · {outlook.date}</p><h2 className="ns-stmt s40"><Link href={outlook.path}>{outlook.displayTitle}</Link></h2><p className="ns-body">Higher health costs and changing digital jobs complicate a growing economy. The choices institutions make will shape access, employment, and accountable services.</p><div className="ns-actions">{primary ? <Btn href={outlook.path}>Read the outlook</Btn> : <a className="outlook-textlink" href={outlook.accessPath}>Download the free report</a>}<span className="ns-src">By {outlook.author} · 9-page report</span></div></div>
    {cover ? <Link className="outlook-feature-cover" href={outlook.path}><img src={outlook.cover} alt={`${outlook.title} cover`} width="612" height="792" loading="lazy" decoding="async" /></Link>
      : outlook.keyFinding && <div className="outlook-feature-stat"><p className="outlook-stat-value">{outlook.keyFinding.value}</p><p className="outlook-stat-text">{outlook.keyFinding.text}</p><p className="ns-src">Source: {outlook.keyFinding.source}</p></div>}
  </article>;
}

export function OutlookPage({ outlook }) {
  const article = outlook.article;
  return <article className="ns outlook-page">
    <header className="outlook-hero ns-shell">
      <div><Link className="outlook-breadcrumb" href="/publications">Research</Link><p className="outlook-label">{outlook.series} · {outlook.date}</p><h1>{outlook.displayTitle}</h1><p className="outlook-deck">{outlook.abstract}</p><p className="outlook-byline">By <Link href="/leadership">{outlook.author}</Link> · Analysis · 5-minute read</p><div className="ns-actions"><Btn href={outlook.accessPath}>Download the nine-page report</Btn><a className="outlook-textlink" href="#outlook-analysis">Read the analysis</a></div><p className="outlook-source">Free PDF with email verification.</p><ShareTools outlook={outlook} /></div>
      <div className="outlook-cover"><img src={outlook.cover} alt={`${outlook.title}, nine-page report cover`} width="612" height="792" fetchPriority="high" decoding="async" /></div>
    </header>
    <div className="outlook-reading" id="outlook-analysis">
      <ShareRail outlook={outlook} />
      <p>{article.intro}</p><Sources outlook={outlook} ids={article.intro_sources} />
      {article.sections.map((section, i) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(p => <p key={p}>{p}</p>)}<Sources outlook={outlook} ids={section.sources} /><Exhibit outlook={outlook} number={section.exhibit} label={i + 1} /></section>)}
      <section><h2>The outlook through October 2027</h2><p>{article.outlook}</p>{article.watch && <div className="outlook-watch"><p className="outlook-label">{article.watch_intro}</p><ul>{article.watch.map(w => <li key={w.what}><span>{w.what}</span><span>{w.when} · <a href={outlook.sources[w.source].url}>{outlook.sources[w.source].organization}</a></span></li>)}</ul></div>}<div className="outlook-download"><div><p className="outlook-label">The full outlook</p><h3>Nine pages. Six exhibits. Three institutional choices.</h3><p>Read the national data, interpretation, and conditions to watch over the next year.</p><Btn href={outlook.accessPath}>Download the free report</Btn></div><img src={outlook.cover} alt="" width="612" height="792" loading="lazy" decoding="async" /></div></section>
      <section className="outlook-about"><h2>About this analysis</h2><p>{article.methods}</p><h3>About the author</h3><p><Link href="/leadership">{outlook.author}</Link> is {outlook.role} at The SozoRock Foundation, where he leads the Foundation's research and its Workforce Capacity and AI & Society programs.</p><h3>Cite this outlook</h3><p>{outlook.citation}</p><div className="outlook-citation-links"><CopyText text={`${outlook.citation} ${outlook.canonicalUrl}`}>Copy citation</CopyText><a href={`${outlook.assetBase}/citation.ris`} download>RIS</a><a href={`${outlook.assetBase}/citation.bib`} download>BibTeX</a></div></section>
    </div>
  </article>;
}

export function OutlookAccessPage({ outlook }) {
  return <div className="ns outlook-page"><div className="outlook-access-heading ns-shell"><Link href={outlook.path}>Return to the analysis</Link><p className="outlook-label">Free nine-page report</p><h1>{outlook.title}</h1><p className="outlook-deck">Enter your name and email to receive a verification link. Publication updates are optional.</p></div><Sec><div className="outlook-access-form"><PublicationAccessPage publication={outlook} embedded /></div></Sec></div>;
}
