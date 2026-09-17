import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "./router";

export function HealthInitiativePage() {
  return (
    <>
      <section className="experience-page-hero health-experience-hero final-page-hero" aria-labelledby="health-page-title">
        <div className="shell experience-page-hero-inner">
          <h1 id="health-page-title">Primary care can exist and still be hard to reach.</h1>
          <p>SozoRock Health studies where the path breaks, then tests nonclinical ways to make ongoing care easier to reach.</p>
          <div className="experience-actions">
            <a href="https://health.sozorockfoundation.org/" className="button button-light">Visit SozoRock Health</a>
            <a href="https://health.sozorockfoundation.org/explore" className="experience-link experience-link-light">Explore place evidence<ArrowRight size={22} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className="health-origin-story" aria-labelledby="health-origin-title">
        <div className="shell health-origin-grid">
          <div className="health-origin-image"><img src="/media/health-access.webp" alt="Two people use a tablet together in a community setting" width="1600" height="900" fetchPriority="high" /></div>
          <div>
            <h2 id="health-origin-title">The problem became concrete in Western New York.</h2>
            <p>A 2025 SozoRock preplanning roundtable with a university school of nursing brought together 12 participants from two county public health jurisdictions, two universities and a regional community health organization.</p>
            <p>A regional public health director reported more than 12,000 residents per primary care clinician. The figure is participant reported context, not a measured outcome or an independently recalculated ratio.</p>
            <p>REBS connects that access question with health literacy, technology, workforce and community readiness.</p>
            <Link href="/publication/rebs-v1-2025" className="experience-link">Read REBS<ArrowRight size={22} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="health-2027 final-health-pilot" id="pilot" aria-labelledby="health-pilot-title">
        <div className="shell health-2027-inner">
          <h2 id="health-pilot-title">In 2027, the next step is a 25 person test.</h2>
          <p className="experience-lead">The Foundation is preparing a New York pilot with Dr. Michael Purcell and PIOC, a direct primary care practice, for residents in rural and underserved communities who face barriers to ongoing primary care.</p>
          <p>Starting with 25 keeps the first test small enough to see where the pathway works, where it fails and what should change before any expansion. The pilot will examine nonclinical coordination, health education and entry into an ongoing primary care relationship.</p>
          <p className="experience-boundary">Clinical assessment, diagnosis, treatment and prescribing remain entirely with the licensed provider. SozoRock coordinates the nonclinical participant experience and evaluates deidentified program evidence.</p>
        </div>
      </section>

      <section className="health-question final-health-question" aria-labelledby="health-question-title">
        <div className="shell health-question-inner">
          <h2 id="health-question-title">What do we need to learn?</h2>
          <p>Can residents enter ongoing primary care more easily? Can they remain connected after the first visit? Which nonclinical barriers still interrupt the path to care?</p>
        </div>
      </section>

      <section className="health-evidence-story final-health-evidence" aria-labelledby="health-evidence-title">
        <div className="shell health-evidence-story-inner">
          <div><h2 id="health-evidence-title">Start with place. Test the pathway. Publish what the evidence supports.</h2></div>
          <div>
            <p>Place Intelligence brings together public data about communities and access conditions. The 2027 pilot adds deidentified program evidence from a real access pathway without turning the Foundation into a clinical provider.</p>
            <a href="https://health.sozorockfoundation.org/explore" className="experience-link">Explore Place Intelligence<ArrowRight size={22} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className="experience-close health-close">
        <div className="shell experience-close-inner">
          <h2>Help test a better path to care.</h2>
          <p>Providers, community organizations, sponsors and public institutions can contribute to a defined pilot with clear roles and evidence boundaries.</p>
          <Link href="/partner" className="experience-link">Discuss the 2027 pilot<ArrowRight size={24} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}
