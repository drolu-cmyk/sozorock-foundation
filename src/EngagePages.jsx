import { EngagementForm, PageHero } from "./components";
import { Link } from "./router";

const partnerPaths = [
  ["Universities & workforce organizations", "Build an experiential engagement that moves learners from instruction into implementation, evidence and evaluated work.", "/platforms/applied-learning", "See the applied-learning model"],
  ["Technology companies", "Provide cloud, AI or security infrastructure, technical expertise or credits against a defined public-interest or learning use case.", "/platforms", "Explore the work"],
  ["Funders & sponsors", "Support a defined cohort, health-access activity, research output or public participation process with clear scope and reporting.", "/support", "See funding routes"],
  ["Public institutions & communities", "Bring a health-access, evidence, governance or technology question that needs a bounded piece of work and a usable output.", "/platforms/health", "Explore health access"],
];

const supportPaths = [
  ["Applied cohorts", "Support defined university or workforce cohorts with project environments, practitioner guidance, evaluation and documented outputs."],
  ["Health access", "Support nonclinical coordination, health education, transportation where evidence supports it, and deidentified program evaluation."],
  ["Technology infrastructure", "Provide cloud, AI, security or data credits and technical resources tied to a documented nonprofit use case."],
  ["Research & public access", "Support independent research, publication access, community participation and dissemination without directing conclusions."],
];

export function PartnerOpportunityPage() {
  return (
    <>
      <PageHero
        eyebrow="Engage"
        title="Build something defined."
        copy="Universities, public institutions, technology companies, funders and communities can work with SozoRock on scoped health, talent, research and technology engagements."
      />
      <section className="engage-opportunity" aria-labelledby="partner-paths-title">
        <div className="shell engage-opportunity-layout">
          <div><p className="eyebrow">Ways to work together</p><h2 id="partner-paths-title">Start with the role you can play.</h2></div>
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
        <div><p className="eyebrow">Start a conversation</p><h2>Define the outcome.</h2><p>Tell us the institution or community, the question ahead, who is affected and what contribution or result you have in mind. An inquiry does not establish a partnership, funding agreement or event commitment.</p></div>
        <EngagementForm kind="Partner" />
      </div></section>
    </>
  );
}

export function SupportOpportunityPage() {
  return (
    <>
      <PageHero
        eyebrow="Engage"
        title="Fund a defined outcome."
        copy="Financial and in-kind support can expand health access, applied learning, public-interest research and the technology infrastructure behind the work."
      />
      <section className="engage-opportunity" aria-labelledby="support-paths-title">
        <div className="shell engage-opportunity-layout">
          <div><p className="eyebrow">What support can enable</p><h2 id="support-paths-title">Scope first. Evidence throughout.</h2></div>
          <div className="engage-opportunity-list">
            {supportPaths.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </div>
      </section>
      <section className="support-boundary"><div className="shell support-boundary-inner"><p className="eyebrow">Independence</p><p>Funding, credits and in-kind support do not purchase a conclusion, establish endorsement or remove the limits of the evidence.</p><Link href="/standards" className="text-link">Read the standards</Link></div></section>
      <section className="section form-section"><div className="shell form-layout">
        <div><p className="eyebrow">Support inquiry</p><h2>What should your support make possible?</h2><p>Describe the financial, technology or in-kind contribution, the work it could enable and any documentation or independence requirements that matter.</p></div>
        <EngagementForm kind="Support" />
      </div></section>
    </>
  );
}
