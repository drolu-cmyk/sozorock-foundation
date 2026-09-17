import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "./router";

const workAreas = [
  {
    title: "Health access",
    copy: "Test nonclinical ways to help people reach ongoing primary care.",
    href: "/platforms/health",
  },
  {
    title: "Applied learning",
    copy: "Give graduate learners practical cybersecurity experience before graduation.",
    href: "/platforms/applied-learning",
  },
  {
    title: "Research",
    copy: "Publish evidence and frameworks that institutions can examine and use.",
    href: "/publications",
  },
  {
    title: "AI and Society",
    copy: "Keep human judgment and accountability visible when AI affects people.",
    href: "/ai-society",
  },
];

export function HomePage() {
  return (
    <>
      <section className="experience-hero final-hero" aria-labelledby="foundation-title">
        <div className="shell experience-hero-inner">
          <h1 id="foundation-title">Evidence should lead somewhere.</h1>
          <p>SozoRock works with communities, universities and institutions to improve health access, build applied technology capability and strengthen public decisions.</p>
          <div className="experience-actions">
            <Link href="/platforms" className="button button-light">See what we do</Link>
            <Link href="/partner" className="experience-link experience-link-light">Work with SozoRock<ArrowRight size={22} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="home-origin-story" aria-labelledby="origin-story-title">
        <div className="shell home-origin-grid">
          <div className="home-origin-image">
            <img src="/media/health-access.webp" alt="Two people use a tablet together in a community setting" width="1600" height="900" fetchPriority="high" />
          </div>
          <div className="home-origin-copy">
            <h2 id="origin-story-title">The 2027 health pilot starts with what communities already told us.</h2>
            <p>In a 2025 preplanning roundtable with a university school of nursing, 12 participants represented two county public-health jurisdictions and two universities in Western New York.</p>
            <p>A regional public-health director reported more than 12,000 residents per primary-care clinician. REBS then connected health literacy, technology, workforce and local readiness to the wider access problem.</p>
            <Link href="/publication/rebs-v1-2025" className="experience-link">Read the rural health framework<ArrowRight size={22} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="home-pilot-story" aria-labelledby="pilot-story-title">
        <div className="shell home-pilot-inner">
          <div>
            <h2 id="pilot-story-title">Why start with 25 people?</h2>
            <p className="home-story-lead">Because the first job is to learn what works, what breaks and what should change before expansion.</p>
          </div>
          <div>
            <p>In 2027, SozoRock plans to work with Dr. Michael Purcell and PIOC, a direct primary care practice, on a 25-participant New York pilot for residents in rural and underserved communities who face barriers to ongoing primary care.</p>
            <p>The pilot will test nonclinical coordination, health education and a clearer route into ongoing care. SozoRock will evaluate deidentified program evidence. Clinical care remains entirely with the licensed provider.</p>
            <Link href="/platforms/health" className="experience-link">Explore the 2027 pilot<ArrowRight size={22} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="home-learning-story" aria-labelledby="learning-story-title">
        <div className="shell home-learning-inner">
          <h2 id="learning-story-title">A master&apos;s degree should end with experience, not just coursework.</h2>
          <p>Through a recurring collaboration with Capella University, cybersecurity master&apos;s learners move from instruction into six months of hands-on work. Across two cohorts, 11 learners have worked in identity and access management, GRC, cloud security, risk and evidence assurance before graduation.</p>
          <Link href="/platforms/applied-learning" className="experience-link experience-link-light">See the applied learning model<ArrowRight size={22} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="experience-work home-work" aria-labelledby="work-title">
        <div className="shell experience-work-inner">
          <h2 id="work-title">What we do.</h2>
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

      <section className="experience-research home-research" aria-labelledby="research-feature-title">
        <div className="shell experience-research-inner">
          <div className="experience-research-copy">
            <h2 id="research-feature-title">Publish the thinking. Let others examine it.</h2>
            <p><em>Health Systems Assurance, Volume 1</em> asks what evidence should support trust in digital health systems and how accountable decisions should be made when the evidence is incomplete.</p>
            <Link href="/publications" className="experience-link experience-link-light">Explore the research<ArrowRight size={22} aria-hidden="true" /></Link>
          </div>
          <Link href="/publication/hsa-v1-2026" className="experience-research-cover" aria-label="Read Health Systems Assurance, Volume 1">
            <img src="/media/hsa-cover.webp" alt="Health Systems Assurance, Volume 1 book cover" width="600" height="780" loading="lazy" />
          </Link>
        </div>
      </section>

      <section className="experience-close home-close">
        <div className="shell experience-close-inner">
          <h2>Bring a defined problem.</h2>
          <p>Universities, public institutions, technology partners, funders and community organizations can work with SozoRock on a question with clear roles and an outcome that can be examined.</p>
          <div className="home-close-actions">
            <Link href="/partner" className="experience-link">Discuss a partnership<ArrowRight size={24} aria-hidden="true" /></Link>
            <Link href="/support" className="experience-link">Support a defined program<ArrowRight size={24} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}