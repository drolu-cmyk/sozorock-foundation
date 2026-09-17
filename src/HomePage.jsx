import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "./router";

const work = [
  { id: "cbcap", name: "CB-CAP", summary: "County evidence, with sources and limits.", copy: "Explore public county evidence, source dates and definitions. Institutional planning tools are not part of the public preview.", href: "https://cbcap.sozorockfoundation.org/", action: "Explore CB-CAP" },
  { id: "health", name: "SozoRock Health", summary: "Health access takes a system.", copy: "Community access models, local evidence, digital readiness and workforce capacity help institutions address barriers to care, including in rural and underserved places.", href: "https://health.sozorockfoundation.org/", action: "Explore Health" },
  { id: "institute", name: "SozoRock Global Institute", summary: "Research for public decisions.", copy: "Publications and briefings examine health systems assurance, governance, health access and institutional capacity.", href: "/platforms/institute", action: "Explore the Institute" },
  { id: "ai", name: "SozoRock AI Lab", summary: "Applied AI for real work.", copy: "No-cost learning helps people build useful work, verify it and use it responsibly.", href: "https://ai-lab.sozorockfoundation.org/", action: "Explore the AI Lab" },
];

const practice = [
  {
    label: "Talent & capability",
    title: "Graduate applied cybersecurity.",
    signal: "2 cohorts · 11 graduate learners · 2025–26",
    copy: "A recurring Capella University experiential engagement moves learners from instruction into implementation, evidence and professional judgment.",
    href: "/platforms/applied-learning",
    action: "See the applied-learning model",
  },
  {
    label: "Health access",
    title: "A regional question, examined together.",
    signal: "12 participants · 2 county public-health jurisdictions · 2 universities",
    copy: "The Western New York pre-planning roundtable documented access barriers and informed the Health Access Day framework.",
    href: "/publication/rebs-v1-2025",
    action: "Read the published framework",
  },
  {
    label: "Applied AI",
    title: "Learning that produced reviewed work.",
    signal: "Live participant project",
    copy: "The AI Lab method moves from learning to a built, reviewed and deployed work product while keeping human judgment in the loop.",
    href: "https://ai-lab.sozorockfoundation.org/organizations/",
    action: "Explore applied learning",
  },
];

export function HomePage() {
  const [selected, setSelected] = useState("health");
  return <>
    <section className="foundation-opening" aria-labelledby="foundation-title"><div className="shell opening-layout">
      <div><h1 id="foundation-title">Public ideas.<br />Practical systems.</h1><p className="foundation-thesis">Access. Assurance. Intelligence.</p></div>
      <p className="opening-description">Research, health access, talent and applied technology—built for decisions, delivery and public scrutiny.</p>
    </div></section>

    <aside className="current-work-strip" aria-label="Current work"><div className="shell current-work-inner">
      <p className="eyebrow">Current work</p>
      <div className="current-work-copy"><strong>Primary-care access pilot</strong><span>25 participants planned · New York</span></div>
      <Link href="/platforms/health" className="current-work-link">Explore the health-access work<ArrowRight size={20} aria-hidden="true" /></Link>
    </div></aside>

    <section className="foundation-work" aria-label="Explore our work"><div className="shell work-composition">
      <p className="eyebrow work-label">Explore our work</p>
      <div className="initiative-discovery">{[...work.slice(1), work[0]].map(item => <article className={`initiative-row ${selected === item.id ? "expanded" : ""}`} key={item.id}>
        <h2><button type="button" onClick={() => setSelected(item.id)} aria-expanded={selected === item.id} aria-controls={`work-${item.id}`}><span>{item.name}</span><ArrowRight size={28} aria-hidden="true" /></button></h2>
        <p className="initiative-summary">{item.summary}</p>
        <div id={`work-${item.id}`} hidden={selected !== item.id} className="initiative-detail"><p>{item.copy}</p><Link href={item.href} className="editorial-link">{item.action}<ArrowRight size={24} aria-hidden="true" /></Link></div>
      </article>)}</div>
      <article className="featured-research"><div className="featured-research-copy"><p className="eyebrow">Featured publication</p><h2><Link href="/publication/hsa-v1-2026">What makes a health system trustworthy?</Link></h2><p>Health Systems Assurance.<br />Volume 1.<br />Dr. Oluwabiyi Adeyemo.</p><Link href="/publication/hsa-v1-2026" className="editorial-link">Explore the publication<ArrowRight size={24} aria-hidden="true" /></Link></div><Link href="/publication/hsa-v1-2026" className="featured-cover" aria-label="Explore Health Systems Assurance, Volume 1"><img src="/media/hsa-cover.webp" width="600" height="780" alt="Health Systems Assurance, Volume 1 book cover" fetchPriority="high" /></Link></article>
    </div></section>

    <section className="foundation-practice" aria-labelledby="practice-title"><div className="shell practice-layout">
      <div className="practice-intro"><p className="eyebrow">In practice</p><h2 id="practice-title">Work, documented.</h2><p>Selected evidence of what the Foundation is doing, with planned work labeled separately from completed activity.</p></div>
      <div className="practice-list">{practice.map(item => <article className="practice-row" key={item.title}>
        <div><p className="eyebrow">{item.label}</p><p className="practice-signal">{item.signal}</p></div>
        <div><h3>{item.title}</h3><p>{item.copy}</p><Link href={item.href} className="editorial-link">{item.action}<ArrowRight size={20} aria-hidden="true" /></Link></div>
      </article>)}</div>
    </div></section>

    <aside className="shell society-home-context" aria-label="AI and society"><p className="eyebrow">AI &amp; Society</p><div><p>When AI affects learning or work, people affected should help shape the rules, evidence and route to review.</p><Link href="/ai-society" className="editorial-link">Explore AI &amp; Society<ArrowRight size={24} aria-hidden="true" /></Link></div></aside>
    <section className="foundation-engage"><div className="shell engage-layout"><h2>Bring a question<br />worth working on.</h2><div><Link href="/partner" className="editorial-link">Discuss a collaboration<ArrowRight size={30} aria-hidden="true" /></Link><p>Universities. Public institutions. Technology partners. Funders. Communities.</p></div></div></section>
  </>;
}
