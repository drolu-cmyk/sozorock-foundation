import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "./router";

export function HealthInitiativePage() {
  return (
    <>
      <section className="experience-page-hero health-experience-hero" aria-labelledby="health-page-title">
        <div className="shell experience-page-hero-inner">
          <h1 id="health-page-title">Primary care should be easier to reach.</h1>
          <p>SozoRock Health develops nonclinical access models and place-based evidence for communities where distance, availability, cost or system complexity can stand between residents and ongoing care.</p>
          <div className="experience-actions">
            <a href="https://health.sozorockfoundation.org/" className="button button-light">Visit SozoRock Health</a>
            <a href="https://health.sozorockfoundation.org/explore" className="experience-link experience-link-light">Explore place evidence<ArrowRight size={22} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className="experience-health-media" aria-hidden="true">
        <img src="/media/health-access.webp" alt="" width="1600" height="900" fetchPriority="high" />
      </section>

      <section className="health-2027" id="pilot" aria-labelledby="health-pilot-title">
        <div className="shell health-2027-inner">
          <p className="experience-context">2027 · New York State</p>
          <h2 id="health-pilot-title">Testing a clearer route to ongoing primary care.</h2>
          <p className="experience-lead">The SozoRock Foundation is preparing a 25-participant health-access pilot for New York residents in rural and underserved communities who experience barriers to ongoing primary care.</p>
          <p>In partnership with Dr. Michael Purcell and PIOC, a direct primary care practice, the pilot will test whether nonclinical coordination, health education and a clearer route into ongoing care can reduce access barriers and support health equity across New York State.</p>
          <p className="experience-boundary">Clinical assessment, diagnosis, treatment and prescribing remain entirely with the licensed provider. SozoRock coordinates the nonclinical participant experience and evaluates deidentified program evidence.</p>
        </div>
      </section>

      <section className="health-question" aria-labelledby="health-question-title">
        <div className="shell health-question-inner">
          <h2 id="health-question-title">What the pilot needs to learn.</h2>
          <p>Can residents who face access barriers enter an ongoing primary-care relationship more easily, remain connected after the first visit, and help us identify where the path to care still breaks down?</p>
        </div>
      </section>

      <section className="health-evidence-story" aria-labelledby="health-evidence-title">
        <div className="shell health-evidence-story-inner">
          <div>
            <p className="experience-context">Evidence before expansion</p>
            <h2 id="health-evidence-title">Start with place. Test the pathway. Publish what the evidence shows.</h2>
          </div>
          <div>
            <p>Place Intelligence brings together public data about communities and access conditions. The 2027 pilot adds real-world program evidence without turning the Foundation into a clinical provider.</p>
            <a href="https://health.sozorockfoundation.org/explore" className="experience-link">Explore Place Intelligence<ArrowRight size={22} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className="experience-close health-close">
        <div className="shell experience-close-inner">
          <h2>Help make the pathway possible.</h2>
          <p>We are building the pilot with clear roles for providers, community organizations, sponsors and public institutions.</p>
          <Link href="/partner" className="experience-link">Discuss a health-access partnership<ArrowRight size={24} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}
