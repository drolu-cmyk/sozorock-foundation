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
            <p>A 2025 SozoRock preplanning roundtable with a university school of nursing brought together 12 participants from two county public-health jurisdictions, two universities and a regional community-health organization.</p>
            <p>A regional public-health director reported more than 12,000 residents per primary-care clinician. The figure is participant-reported context, not a measured outcome or an independently recalculated ratio.</p>
            <p>REBS connects that access question with health literacy, technology, workforce and community readiness.</p>
            <Link href="/publication/rebs-v1-2025" className="experience-link">Read REBS<ArrowRight size={22} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="health-2027 final-health-pilot" id="pilot" aria-labelledby="health-pilot-title">
        <div className="shell health-2027-inner">
          <h2 id="health-pilot-title">Primary Care Access Program.</h2>
          <p className="experience-lead">Beginning January 2027, the Foundation will sponsor 12 months of primary care support for up to 25 New Yorkers, one per household. Participants are 64 or younger, have financial need and live with a chronic condition such as diabetes or high blood pressure, in any of New York's 62 counties.</p>
          <p>Each participant receives a sponsored direct primary care membership with Dr. Michael Purcell and PIOC, ongoing telehealth, help with transportation and health access education.</p>
          <p>Starting with up to 25 keeps the first cohort small enough to show where the pathway works, where it fails and what should change before expansion.</p>
          <p className="experience-boundary">Part of the SozoRock Health Equity Initiative. Clinical care remains with the licensed provider. Membership is not health insurance.</p>
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
            <p>Place Intelligence brings together public data about communities and access conditions. The Primary Care Access Program, launching January 2027, will show where the pathway works, where it fails and what should change before expansion.</p>
            <a href="https://health.sozorockfoundation.org/explore" className="experience-link">Explore Place Intelligence<ArrowRight size={22} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className="experience-close health-close">
        <div className="shell experience-close-inner">
          <h2>Help test a better path to care.</h2>
          <p>The Primary Care Access Program supports up to 25 New Yorkers for 12 months, starting January 2027. Clinical care remains with the licensed provider.</p>
          <Link href="/partner" className="experience-link">Discuss the program<ArrowRight size={24} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}