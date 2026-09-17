import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "./router";

const work = [
  {
    id: "health",
    name: "Health access",
    summary: "Make the path to care easier to see.",
    copy: "SozoRock Health connects local evidence, nonclinical coordination and community-facing access models. CB-CAP makes county evidence visible with sources, dates and limits.",
    href: "https://health.sozorockfoundation.org/",
    action: "Explore health access",
  },
  {
    id: "talent",
    name: "Talent & capability",
    summary: "Turn learning into work that can be examined.",
    copy: "Graduate experiential engagements and the AI Lab move from instruction into implementation, review and evidence-backed judgment.",
    href: "/platforms/applied-learning",
    action: "See the applied-learning model",
  },
  {
    id: "society",
    name: "AI & Society",
    summary: "Keep human judgment in the decision.",
    copy: "Research and convening examine how AI is governed, challenged and used across learning, work and public systems.",
    href: "/ai-society",
    action: "Explore AI & Society",
  },
  {
    id: "research",
    name: "Research & assurance",
    summary: "Make evidence usable when decisions matter.",
    copy: "The Global Institute publishes work on health systems assurance, governance, health access and institutional capacity.",
    href: "/publications",
    action: "Read the research",
  },
];

export function HomePage() {
  const [selected, setSelected] = useState("health");

  return <>
    <section className="foundation-opening" aria-labelledby="foundation-title"><div className="shell opening-layout">
      <div><h1 id="foundation-title">Public ideas.<br />Practical systems.</h1><p className="foundation-thesis">Access. Assurance. Intelligence.</p></div>
      <p className="opening-description">Health access, applied learning, research and AI governance for decisions that have to hold up.</p>
    </div></section>

    <section className="pilot-feature" aria-labelledby="pilot-feature-title"><div className="shell pilot-feature-grid">
      <div className="pilot-number" aria-label="25 people planned for the New York primary-care access pilot"><strong>25</strong><span>people planned</span><small>New York</small></div>
      <div className="pilot-story">
        <h2 id="pilot-feature-title">Starting with 25 people.</h2>
        <p>A planned primary-care access pilot will test a clearer path from an initial in-person visit to ongoing care.</p>
        <div className="pilot-pathway" aria-label="Planned pathway: initial visit, quarterly check-ins, telehealth after the first visit">
          <span>Initial visit</span><i aria-hidden="true" /><span>Quarterly check-ins</span><i aria-hidden="true" /><span>Telehealth after first visit</span>
        </div>
        <p className="pilot-boundary">SozoRock coordinates the nonclinical pathway. Clinical care remains with the licensed provider.</p>
        <Link href="/platforms/health" className="editorial-link">See the health-access model<ArrowRight size={22} aria-hidden="true" /></Link>
      </div>
    </div></section>

    <section className="foundation-work" aria-label="Areas of work"><div className="shell work-composition">
      <div className="initiative-discovery">{work.map(item => <article className={`initiative-row ${selected === item.id ? "expanded" : ""}`} key={item.id}>
        <h2><button type="button" onClick={() => setSelected(item.id)} aria-expanded={selected === item.id} aria-controls={`work-${item.id}`}><span>{item.name}</span><ArrowRight size={28} aria-hidden="true" /></button></h2>
        <p className="initiative-summary">{item.summary}</p>
        <div id={`work-${item.id}`} hidden={selected !== item.id} className="initiative-detail"><p>{item.copy}</p><Link href={item.href} className="editorial-link">{item.action}<ArrowRight size={24} aria-hidden="true" /></Link></div>
      </article>)}</div>

      <article className="featured-research"><div className="featured-research-copy"><p className="eyebrow">Health Systems Assurance · Volume 1</p><h2><Link href="/publication/hsa-v1-2026">What makes a health system trustworthy?</Link></h2><p>Dr. Oluwabiyi Adeyemo</p><Link href="/publication/hsa-v1-2026" className="editorial-link">Read the publication<ArrowRight size={24} aria-hidden="true" /></Link></div><Link href="/publication/hsa-v1-2026" className="featured-cover" aria-label="Read Health Systems Assurance, Volume 1"><img src="/media/hsa-cover.webp" width="600" height="780" alt="Health Systems Assurance, Volume 1 book cover" fetchPriority="high" /></Link></article>
    </div></section>

    <section className="capability-proof" aria-labelledby="capability-proof-title"><div className="shell capability-proof-grid">
      <div className="capability-count"><strong>11</strong><span>graduate learners</span><small>2 cohorts · 2025–26</small></div>
      <div className="capability-story">
        <h2 id="capability-proof-title">Learning, put to work.</h2>
        <p>Since October 2025, Capella University graduate learners have moved from structured instruction into hands-on cybersecurity implementation and evidence review with SozoRock.</p>
        <div className="capability-rail" aria-label="Instruction, implementation, evidence, evaluation"><span>Instruction</span><i aria-hidden="true" /><span>Implementation</span><i aria-hidden="true" /><span>Evidence</span><i aria-hidden="true" /><span>Evaluation</span></div>
        <p className="capability-role"><strong>Dr. Oluwabiyi Adeyemo</strong> designs the experiential project tasks, mentors the learners and evaluates their applied work.</p>
        <Link href="/platforms/applied-learning" className="editorial-link">See how the model works<ArrowRight size={22} aria-hidden="true" /></Link>
      </div>
    </div></section>

    <section className="society-feature" aria-labelledby="society-feature-title"><div className="shell society-feature-grid">
      <div><h2 id="society-feature-title">AI changes decisions.<br />People still need a way to question them.</h2><Link href="/ai-society" className="editorial-link">Explore AI &amp; Society<ArrowRight size={24} aria-hidden="true" /></Link></div>
      <div className="society-principles" aria-label="AI and Society principles"><span>Participation</span><span>Human review</span><span>Accountability</span></div>
    </div></section>

    <section className="foundation-engage"><div className="shell engage-layout"><h2>Work with us on a defined problem.</h2><div><Link href="/partner" className="editorial-link">Start a conversation<ArrowRight size={30} aria-hidden="true" /></Link><p>Universities · public institutions · technology partners · funders</p></div></div></section>
  </>;
}
