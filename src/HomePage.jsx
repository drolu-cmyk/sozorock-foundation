import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "./router";

const work = [
  { id: "cbcap", name: "CB-CAP", summary: "County evidence for local action.", copy: "Explore county-level evidence to frame local questions, understand context and support accountable decisions.", href: "https://cbcap.sozorockfoundation.org/", action: "Explore CB-CAP" },
  { id: "health", name: "SozoRock Health", summary: "A practical path to licensed care.", copy: "We develop non-clinical navigation and place-based evidence to help people and communities understand barriers to care.", href: "https://health.sozorockfoundation.org/", action: "Explore Health" },
  { id: "institute", name: "SozoRock Global Institute", summary: "Research that sharpens public decisions.", copy: "Publications and focused discussions examine health systems assurance, rural governance and equity.", href: "/platforms/institute", action: "Explore the Institute" },
  { id: "ai", name: "SozoRock AI Lab", summary: "Practical AI. Accountable human judgment.", copy: "No-cost learning helps people apply AI to real work, verify the results and use them responsibly.", href: "https://ai-lab.sozorockfoundation.org/", action: "Explore the AI Lab" },
];
export function HomePage() {
  const [selected, setSelected] = useState("health");
  return <>
    <section className="foundation-opening" aria-labelledby="foundation-title"><div className="shell opening-layout">
      <div><h1 id="foundation-title">Public ideas.<br />Practical systems.</h1><p className="foundation-thesis">Access. Assurance. Intelligence.</p></div>
      <p className="opening-description">Research, health access and applied AI—bringing evidence into practical use.</p>
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
    <section className="foundation-engage"><div className="shell engage-layout"><h2>Bring a question<br />worth working on.</h2><div><Link href="/partner" className="editorial-link">Partner with the Foundation<ArrowRight size={30} aria-hidden="true" /></Link><p>Research partnerships. Community initiatives. Applied learning.</p></div></div></section>
  </>;
}
