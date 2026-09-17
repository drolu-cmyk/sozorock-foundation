import { EngagementForm, PageHero } from "./components";
import { Link } from "./router";

const partnerPaths = [
  ["Universities & workforce systems", "Put real technology work inside the learning: a defined problem, controlled environment, practitioner review and an assessed output.", "/platforms/applied-learning", "See the applied-learning model"],
  ["Technology partners", "Put cloud, AI, security or data infrastructure behind a documented public-interest use case, with the technical contribution tied to a clear scope.", "/platforms", "See where technology is used"],
  ["Funders", "Back a defined cohort, access pathway, research question or public-participation process with agreed reporting and evidence boundaries.", "/support", "See what support can enable"],
  ["Public institutions & communities", "Bring a health-access, governance or evidence question that needs a bounded piece of work and a usable next step.", "/platforms/health", "Explore health access"],
];

const supportPaths = [
  ["Applied cohorts", "Project environments, practitioner guidance, implementation support and evaluated outputs for defined university or workforce cohorts."],
  ["Health access", "Nonclinical coordination, health education, transportation where evidence supports it and deidentified program evaluation."],
  ["Technology infrastructure", "Cloud, AI, security and data credits or technical resources tied to a documented nonprofit use case."],
  ["Research & public access", "Independent research, publication access, community participation and dissemination without directing conclusions."],
];

export function PartnerOpportunityPage() {
  return (
    <>
      <PageHero
        eyebrow="Partnerships"
        title="Bring a problem with a clear outcome."
        copy="SozoRock works with institutions that can define the problem, the contribution each party makes and the result the work should produce."
      />
      <section className="engage-opportunity" aria-labelledby="partner-paths-title">
        <div className="shell engage-opportunity-layout">
          <div><h2 id="partner-paths-title">Different partners. One standard: a defined result.</h2></div>
          <div className="engage-opportunity-list">
            {partnerPaths.map(([title, copy, href, action]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
                <Link href={href} className="text-link">{action}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section form-section" id="conversation"><div className="shell form-layout">
        <div><h2>What needs to move?</h2><p>Tell us the problem, who it affects, the decision or outcome ahead and the role your organization can play. An inquiry does not establish a partnership, funding agreement or event commitment.</p></div>
        <EngagementForm kind="Partner" />
      </div></section>
    </>
  );
}

export function SupportOpportunityPage() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Fund what can be defined and examined."
        copy="Support is tied to a specific cohort, access pathway, research question, participation process or technology need."
      />
      <section className="engage-opportunity" aria-labelledby="support-paths-title">
        <div className="shell engage-opportunity-layout">
          <div><h2 id="support-paths-title">What support can make possible.</h2></div>
          <div className="engage-opportunity-list">
            {supportPaths.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </div>
      </section>
      <section className="support-boundary"><div className="shell support-boundary-inner"><p>Funding, credits and in-kind support do not purchase a conclusion, establish endorsement or remove the limits of the evidence.</p><Link href="/standards" className="text-link">Read the standards</Link></div></section>
      <section className="section form-section"><div className="shell form-layout">
        <div><h2>What should the support make possible?</h2><p>Describe the contribution, the work it could enable and any documentation or independence requirements that matter.</p></div>
        <EngagementForm kind="Support" />
      </div></section>
    </>
  );
}
