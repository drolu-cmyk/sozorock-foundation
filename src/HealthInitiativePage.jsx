import { CbcapEvidence, PageHero, SectionHeading } from "./components";

const healthPrograms = [
  ["Community access", "Health Equity Hubs, Health Access Day and practical support around reaching care."],
  ["Evidence and intelligence", "Place Intelligence and CB-CAP connect county evidence with its sources, dates and limits."],
  ["Digital readiness and assurance", "Practical readiness, cybersecurity and evidence-based assurance for digital health systems."],
  ["Workforce capacity", "Education and partnership pathways informed by the capabilities a community needs."],
];

export function HealthInitiativePage() {
  return (
    <>
      <PageHero eyebrow="Initiative" title="SozoRock Health" copy="Community access. Place-based intelligence. Digital assurance. Workforce capacity.">
        <div className="button-row"><a href="https://health.sozorockfoundation.org/" className="button button-light">Open SozoRock Health</a><a href="https://health.sozorockfoundation.org/explore" className="button button-outline-light">Explore a place</a></div>
      </PageHero>
      <section className="section media-story">
        <div className="shell media-story-grid">
          <div className="media-frame"><img src="/media/health-access.webp" alt="Two people use a tablet together in a community library" /></div>
          <div><p className="eyebrow">Systems for health access</p><h2>Care can exist. Access still takes a system.</h2><p>SozoRock Health develops practical models, evidence and capabilities to help communities and institutions address barriers to care.</p><p className="boundary">SozoRock Health does not diagnose, treat or prescribe, and does not replace a licensed practitioner. It is not a clinic, provider or telehealth platform.</p></div>
        </div>
      </section>

      <section className="health-pilot-signal" aria-labelledby="health-pilot-title">
        <div className="shell health-pilot-signal-inner">
          <div>
            <p className="eyebrow">Planned New York pilot</p>
            <h2 id="health-pilot-title">25 participants. One defined primary-care access pathway.</h2>
          </div>
          <div>
            <p>The Foundation is preparing a 25-person access pilot with Dr. Michael Purcell / PIOC for adults living with chronic conditions who need a clearer route to ongoing primary care.</p>
            <p>SozoRock will handle nonclinical coordination, health education and deidentified program evidence. Clinical care remains entirely with the licensed provider.</p>
            <p className="health-pilot-note">Participant enrollment and operating dates will be published when confirmed.</p>
          </div>
        </div>
      </section>

      <section className="section soft-section">
        <div className="shell"><SectionHeading eyebrow="Work" title="One purpose. Connected capabilities." /><div className="work-list">{healthPrograms.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></div>
      </section>
      <CbcapEvidence />
    </>
  );
}
