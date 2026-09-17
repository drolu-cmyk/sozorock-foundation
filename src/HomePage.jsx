import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "./router";

const workAreas = [
  {
    title: "Health access",
    copy: "Practical routes to care for communities facing access barriers.",
    href: "/platforms/health",
  },
  {
    title: "Applied learning",
    copy: "Real technology work that develops capability and professional judgment.",
    href: "/platforms/applied-learning",
  },
  {
    title: "Research & assurance",
    copy: "Public-interest research designed to inform decisions and implementation.",
    href: "/publications",
  },
  {
    title: "AI & Society",
    copy: "Participation, human review and accountability when AI affects people.",
    href: "/ai-society",
  },
];

export function HomePage() {
  return (
    <>
      <section className="experience-hero" aria-labelledby="foundation-title">
        <div className="shell experience-hero-inner">
          <h1 id="foundation-title">Research and practical systems for better access, capability and public decisions.</h1>
          <p>The SozoRock Foundation works across health access, applied learning, research and responsible AI to move from evidence to implementation.</p>
          <div className="experience-actions">
            <Link href="/platforms" className="button button-light">Explore our work</Link>
            <Link href="/partner" className="experience-link experience-link-light">Partner with SozoRock<ArrowRight size={22} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="experience-health" aria-labelledby="health-story-title">
        <div className="experience-health-image">
          <img src="/media/health-access.webp" alt="Two people use a tablet together in a community setting" width="1600" height="900" fetchPriority="high" />
        </div>
        <div className="shell experience-health-content">
          <p className="experience-context">2027 · New York State</p>
          <h2 id="health-story-title">Testing a clearer route to primary care.</h2>
          <p className="experience-lead">SozoRock is preparing a 25-participant health-access pilot for New York residents in rural and underserved communities who experience barriers to ongoing primary care.</p>
          <p>In partnership with PIOC, a direct primary care practice, the pilot will test whether nonclinical coordination, health education and a clearer route into ongoing care can reduce access barriers and support health equity across the state.</p>
          <p className="experience-boundary">Clinical care remains with the licensed provider. SozoRock coordinates the nonclinical experience and evaluates deidentified program evidence.</p>
          <Link href="/platforms/health" className="experience-link">Explore the 2027 health-access pilot<ArrowRight size={22} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="experience-work" aria-labelledby="work-title">
        <div className="shell experience-work-inner">
          <h2 id="work-title">Where we work.</h2>
          <div className="experience-work-list">
            {workAreas.map((area) => (
              <Link href={area.href} className="experience-work-item" key={area.title}>
                <strong>{area.title}</strong>
                <span>{area.copy}</span>
                <ArrowRight size={30} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="experience-research" aria-labelledby="research-feature-title">
        <div className="shell experience-research-inner">
          <div className="experience-research-copy">
            <p className="experience-context">Featured research</p>
            <h2 id="research-feature-title">What should evidence prove before we trust a digital health system?</h2>
            <p><em>Health Systems Assurance, Volume 1</em> examines how obligations, risks, operating evidence, exceptions and accountable decisions fit together.</p>
            <Link href="/publication/hsa-v1-2026" className="experience-link experience-link-light">Read the publication<ArrowRight size={22} aria-hidden="true" /></Link>
          </div>
          <Link href="/publication/hsa-v1-2026" className="experience-research-cover" aria-label="Read Health Systems Assurance, Volume 1">
            <img src="/media/hsa-cover.webp" alt="Health Systems Assurance, Volume 1 book cover" width="600" height="780" loading="lazy" />
          </Link>
        </div>
      </section>

      <section className="experience-close">
        <div className="shell experience-close-inner">
          <h2>Bring us a problem worth solving.</h2>
          <p>We work with universities, public institutions, technology partners, funders and community organizations on defined questions with clear roles and accountable outcomes.</p>
          <Link href="/partner" className="experience-link">Start a conversation<ArrowRight size={24} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}
