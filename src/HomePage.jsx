import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "./router";

const work = [
  { id: "cbcap", name: "CB-CAP", summary: "County evidence for local action.", copy: "Explore public county evidence and its sources. Institutional planning tools are not yet available in the public preview.", href: "https://cbcap.sozorockfoundation.org/", action: "Explore CB-CAP" },
  { id: "health", name: "SozoRock Health", summary: "Building the systems that make health access possible.", copy: "Community access models, local evidence and digital readiness help communities and institutions address barriers to care, with particular attention to rural and underserved places.", href: "https://health.sozorockfoundation.org/", action: "Explore Health" },
  { id: "institute", name: "SozoRock Global Institute", summary: "Research that sharpens public decisions.", copy: "Publications and focused discussions examine health systems assurance, governance, public-sector capacity and rural equity.", href: "/platforms/institute", action: "Explore the Institute" },
  { id: "ai", name: "SozoRock AI Lab", summary: "Practical AI. Accountable human judgment.", copy: "No-cost learning helps people apply AI to real work, verify the results and use them responsibly.", href: "https://ai-lab.sozorockfoundation.org/", action: "Explore the AI Lab" },
];

const roundtableFacts = [
  { value: "12", label: "participants" },
  { value: "2", label: "county public-health jurisdictions" },
  { value: "2", label: "Western New York universities represented" },
];

export function HomePage() {
  const [selected, setSelected] = useState("health");
  return <>
    <section className="foundation-opening" aria-labelledby="foundation-title"><div className="shell opening-layout">
      <div><h1 id="foundation-title">Public ideas.<br />Practical systems.</h1><p className="foundation-thesis">Access. Assurance. Intelligence.</p></div>
      <p className="opening-description">Research, health access, public systems and practical AI learning—bringing evidence into use.</p>
    </div></section>
    <section className="foundation-work" aria-label="Explore our work"><div className="shell work-composition">
      <p className="eyebrow work-label">Explore our work</p>
      <div className="initiative-discovery">{[...work.slice(1), work[0]].map(item => <article className={`initiative-row ${selected === item.id ? "expanded" : ""}`} key={item.id}>
        <h2><button type="button" onClick={() => setSelected(item.id)} aria-expanded={selected === item.id} aria-controls={`work-${item.id}`}><span>{item.name}</span><ArrowRight size={28} aria-hidden="true" /></button></h2>
        <p className="initiative-summary">{item.summary}</p>
        <div id={`work-${item.id}`} hidden={selected !== item.id} className="initiative-detail"><p>{item.copy}</p><Link href={item.href} className="editorial-link">{item.action}<ArrowRight size={24} aria-hidden="true" /></Link></div>
      </article>)}</div>
      <article className="featured-research"><div className="featured-research-copy"><p className="eyebrow">Featured publication</p><h2><Link href="/publication/hsa-v1-2026">What makes a health system trustworthy?</Link></h2><p>Health Systems Assurance.<br />Volume 1.<br />Dr. Oluwabiyi Adeyemo.</p><Link href="/publication/hsa-v1-2026" className="editorial-link">Explore the publication<ArrowRight size={24} aria-hidden="true" /></Link></div><Link href="/publication/hsa-v1-2026" className="featured-cover" aria-label="Explore Health Systems Assurance, Volume 1"><img src="/media/hsa-cover.webp" width="600" height="780" alt="Health Systems Assurance, Volume 1 book cover" fetchPriority="high" /></Link></article>
    </div></section>
    <section className="foundation-evidence" aria-labelledby="roundtable-title"><div className="shell evidence-layout">
      <div className="evidence-intro">
        <p className="eyebrow">SozoRock field engagement · September 2025</p>
        <h2 id="roundtable-title">What a SozoRock rural-health roundtable surfaced.</h2>
        <p>SozoRock convened the Western New York pre-planning roundtable in partnership with a university school of nursing. Participants included two county public-health jurisdictions, representatives from two universities and a regional community-health organization. The discussion informed the Access Day framework.</p>
        <Link href="/publication/rebs-v1-2025" className="evidence-link">Read Rural Equity Blueprint Series, Volume 1</Link>
      </div>
      <div className="evidence-panel">
        <dl className="evidence-facts" aria-label="Documented roundtable participation">
          {roundtableFacts.map(fact => <div key={fact.label}><dt>{fact.value}</dt><dd>{fact.label}</dd></div>)}
        </dl>
        <figure className="evidence-ratio" aria-describedby="roundtable-caveat roundtable-source">
          <figcaption>Reported at the roundtable</figcaption>
          <div className="evidence-ratio-values" aria-label="More than 12,000 residents for each primary-care clinician">
            <div><strong>1</strong><span>primary-care clinician</span></div>
            <span className="evidence-ratio-word" aria-hidden="true">for</span>
            <div><strong>12,000+</strong><span>residents</span></div>
          </div>
          <p id="roundtable-caveat" className="evidence-caveat">A regional public-health director reported serving a population of more than 12,000 residents per primary-care clinician. The figure is presented as a participant-reported access condition documented in the publication—not as an independently re-estimated statistic or a program outcome.</p>
          <p id="roundtable-source" className="evidence-source">Source: Rural Equity Blueprint Series, Volume 1 (2025), pages 2–4 and 13.</p>
        </figure>
      </div>
    </div></section>
    <aside className="shell society-home-context" aria-label="AI and society"><p className="eyebrow">AI &amp; Society</p><div><p>Who decides when AI affects people? AI &amp; Society is developing ways for communities to shape consequential uses of AI, with evidence, human review and a route to challenge decisions.</p><Link href="/ai-society" className="editorial-link">Explore AI &amp; Society<ArrowRight size={24} aria-hidden="true" /></Link></div></aside>
    <section className="foundation-engage"><div className="shell engage-layout"><h2>Bring a question<br />worth working on.</h2><div><Link href="/partner" className="editorial-link">Partner with the Foundation<ArrowRight size={30} aria-hidden="true" /></Link><p>Research. Health access. Public systems. Applied learning.</p></div></div></section>
  </>;
}
