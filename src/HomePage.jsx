import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "./router";

const work = [
  { id: "cbcap", name: "CB-CAP", summary: "County evidence for local action.", copy: "Explore public county evidence and its sources. Institutional planning tools are not yet available in the public preview.", href: "https://cbcap.sozorockfoundation.org/", action: "Explore CB-CAP" },
  { id: "health", name: "SozoRock Health", summary: "Building the systems that make health access possible.", copy: "Community access models, local evidence and digital readiness to help rural communities address barriers to care.", href: "https://health.sozorockfoundation.org/", action: "Explore Health" },
  { id: "institute", name: "SozoRock Global Institute", summary: "Research that sharpens public decisions.", copy: "Publications and focused discussions examine health systems assurance, rural governance and equity.", href: "/platforms/institute", action: "Explore the Institute" },
  { id: "ai", name: "SozoRock AI Lab", summary: "Practical AI. Accountable human judgment.", copy: "No-cost learning helps people apply AI to real work, verify the results and use them responsibly.", href: "https://ai-lab.sozorockfoundation.org/", action: "Explore the AI Lab" },
];

const ruralDialogueFacts = [
  { value: "12", label: "participants" },
  { value: "2", label: "county public-health jurisdictions" },
  { value: "5", label: "academic disciplines" },
];

export function HomePage() {
  const [selected, setSelected] = useState("health");
  return <>
    <section className="foundation-opening" aria-labelledby="foundation-title"><div className="shell opening-layout">
      <div><h1 id="foundation-title">Public ideas.<br />Practical systems.</h1><p className="foundation-thesis">Access. Assurance. Intelligence.</p></div>
      <p className="opening-description">Research, rural health access and practical AI learning—bringing evidence into use.</p>
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
    <section className="foundation-evidence" aria-labelledby="rural-dialogue-title"><div className="shell evidence-layout">
      <div className="evidence-intro">
        <h2 id="rural-dialogue-title">What a rural-health dialogue surfaced.</h2>
        <p>A 2025 pre-planning session in Western New York brought county public health, academic partners from two universities and a regional community-health organization into one working conversation. The exchange informed the Access Day framework.</p>
        <Link href="/publication/rebs-v1-2025" className="evidence-link">Read Rural Equity Blueprint Series, Volume 1</Link>
      </div>
      <div className="evidence-panel">
        <dl className="evidence-facts" aria-label="Documented participation">
          {ruralDialogueFacts.map(fact => <div key={fact.label}><dt>{fact.value}</dt><dd>{fact.label}</dd></div>)}
        </dl>
        <figure className="evidence-ratio" aria-describedby="rural-dialogue-caveat rural-dialogue-source">
          <figcaption>Reported provider availability</figcaption>
          <div className="evidence-ratio-values" aria-label="More than 12,000 residents for each primary-care clinician">
            <div><strong>1</strong><span>primary-care clinician</span></div>
            <span className="evidence-ratio-word" aria-hidden="true">for</span>
            <div><strong>12,000+</strong><span>residents</span></div>
          </div>
          <p id="rural-dialogue-caveat" className="evidence-caveat">The ratio was reported by a regional public-health director and documented in the publication. These figures describe participation and a reported access condition. They are not measured post-program outcomes.</p>
          <p id="rural-dialogue-source" className="evidence-source">Source: Rural Equity Blueprint Series, Volume 1 (2025), pages 4, 13, 50, 53 and 55.</p>
        </figure>
      </div>
    </div></section>
    <aside className="shell society-home-context" aria-label="AI and society"><p className="eyebrow">AI &amp; Society</p><div><p>Who decides when AI affects people? AI & Society is developing ways for communities to shape consequential uses of AI, with evidence, human review and a route to challenge decisions.</p><Link href="/ai-society" className="editorial-link">Explore AI &amp; Society<ArrowRight size={24} aria-hidden="true" /></Link></div></aside>
    <section className="foundation-engage"><div className="shell engage-layout"><h2>Bring a question<br />worth working on.</h2><div><Link href="/partner" className="editorial-link">Partner with the Foundation<ArrowRight size={30} aria-hidden="true" /></Link><p>Research partnerships. Community initiatives. Applied learning.</p></div></div></section>
  </>;
}
