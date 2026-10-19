import { Link } from "./router";

const platforms = [
  { name: "SozoRock Health", copy: "Rural health access, local evidence and digital readiness.", href: "https://health.sozorockfoundation.org/" },
  { name: "CB-CAP", copy: "County intelligence with visible sources, dates and limitations.", href: "https://cbcap.sozorockfoundation.org/" },
  { name: "SozoRock AI Lab", copy: "Applied AI systems, cybersecurity and governance learning.", href: "https://ai-lab.sozorockfoundation.org/" },
  { name: "AI and Society", copy: "Human judgment and accountability when AI affects people.", href: "/ai-society" },
];

const publicationLinks = [
  { title: "Rural Equity Blueprint Series", description: "Rural access and local response", href: "/publication/rebs-v1-2025" },
  { title: "Rethinking Rural Governance", description: "Public systems and place", href: "/publication/rrg-v1-2025" },
  { title: "Health Systems Assurance", description: "Trust, evidence and accountability", href: "/publication/hsa-v1-2026" },
];

export function HomePage() {
  return <>
    <section className="approval-hero" aria-labelledby="foundation-title">
      <div className="shell approval-hero-grid">
        <div className="approval-hero-copy">
          <h1 id="foundation-title">A clearer route<br />to primary care.</h1>
          <p>Help fund a year of primary care for up to 25 New Yorkers living with a chronic condition and financial need.</p>
          <Link className="approval-action is-light" href="/support">Support</Link>
          <div className="approval-pilot-note"><span>Launching January 2027 with Dr. Michael Purcell and PIOC.</span><span>Clinical care remains with the licensed provider.</span></div>
        </div>
        <div className="approval-publications" aria-label="Featured SozoRock publications">
          <Link className="approval-book approval-book-rebs" href="/publication/rebs-v1-2025" aria-label="Rural Equity Blueprint Series, Volume 1"><img src="/media/rebs-cover.webp" alt="Rural Equity Blueprint Series, Volume 1 cover" /></Link>
          <Link className="approval-book approval-book-rrg" href="/publication/rrg-v1-2025" aria-label="Rethinking Rural Governance, Volume 1"><img src="/media/rrg-cover.webp" alt="Rethinking Rural Governance, Volume 1 cover" /></Link>
          <Link className="approval-book approval-book-hsa" href="/publication/hsa-v1-2026" aria-label="Health Systems Assurance, Volume 1"><img src="/media/hsa-cover.webp" alt="Health Systems Assurance, Volume 1 cover" /></Link>
        </div>
      </div>
    </section>

    <section className="approval-evidence" aria-labelledby="regional-evidence-title">
      <h2 id="regional-evidence-title">The work begins with what local institutions reported.</h2>
      <div><p className="approval-evidence-number">More than 12,000 residents per primary-care clinician.</p><p>A regional public-health director reported the ratio during a 2025 SozoRock preplanning roundtable in Western New York. The discussion brought together 12 participants from two county public-health jurisdictions and two universities.</p><Link className="approval-action" href="/publication/rebs-v1-2025">Read the rural health framework</Link></div>
    </section>

    <section className="approval-capella" aria-labelledby="capella-title">
      <p className="approval-section-marker">SozoRock × Capella University</p>
      <div className="approval-capella-grid"><h2 id="capella-title">Applied cybersecurity, personally mentored.</h2><div className="approval-capella-copy"><p>SozoRock provides cybersecurity master’s learners with six months of applied experience across identity and access management, GRC, cloud security, risk and evidence assurance.</p><p className="approval-cohort-proof">Six learners completed the initial cohort. Five are participating in the current six-month cohort.</p><p>The experience is designed and evaluated by <strong>Dr. Oluwabiyi Adeyemo, Director of Strategic Initiatives</strong>, who personally mentors every learner.</p><Link className="approval-action" href="/partner">Partner with SozoRock</Link></div></div>
    </section>

    <section className="approval-platforms" aria-labelledby="platforms-title">
      <div className="approval-platform-intro"><h2 id="platforms-title">SozoRock connects health access, county intelligence, applied AI and public accountability.</h2><p>Research, technology and learning designed around public need.</p></div>
      <div className="approval-platform-list">{platforms.map((platform) => <Link className="approval-platform-row" href={platform.href} key={platform.name}><h3>{platform.name}</h3><p>{platform.copy}</p></Link>)}</div>
    </section>

    <section className="approval-research" aria-labelledby="research-title">
      <div className="approval-research-intro"><h2 id="research-title">Research built to be used.</h2><p>Three publication series connect rural access, public governance and health-systems assurance.</p></div>
      <div className="approval-publication-list">{publicationLinks.map((publication) => <Link href={publication.href} key={publication.title}><span>{publication.title}</span><small>{publication.description}</small></Link>)}</div>
      <Link className="approval-action" href="/publications">View publications</Link>
    </section>

    <section className="approval-society" aria-labelledby="society-title"><h2 id="society-title">When AI shapes public decisions, who remains accountable?</h2><div><p>SozoRock examines how institutions can use AI while preserving human judgment, evidence and public responsibility.</p><Link className="approval-action is-light" href="/ai-society">Explore AI and Society</Link></div></section>

    <section className="approval-support" aria-labelledby="support-title"><p>Work with The SozoRock Foundation.</p><h2 id="support-title">Bring SozoRock’s research, training and access models to your institution or community.</h2><div><Link className="approval-action" href="/partner">Partner with SozoRock</Link><Link className="approval-action" href="/support">Support the work</Link></div></section>
  </>;
}
