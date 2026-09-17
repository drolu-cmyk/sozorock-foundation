import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "./router";

export function AppliedLearningPage() {
  return (
    <>
      <section className="experience-page-hero learning-experience-hero" aria-labelledby="learning-page-title">
        <div className="shell experience-page-hero-inner">
          <h1 id="learning-page-title">Real work changes what a learner can do.</h1>
          <p>SozoRock works with universities and workforce organizations to turn academic knowledge into applied technology capability through defined problems, practitioner guidance and evidence-based review.</p>
          <Link href="/partner" className="experience-link experience-link-light">Discuss an applied engagement<ArrowRight size={22} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="learning-case" aria-labelledby="learning-case-title">
        <div className="shell learning-case-inner">
          <p className="experience-context">Graduate cybersecurity · 2025–26</p>
          <h2 id="learning-case-title">A university course became a working cybersecurity environment.</h2>
          <p className="experience-lead">Across two consecutive cohorts, eleven Capella University graduate learners moved beyond coursework into hands-on cybersecurity work with The SozoRock Foundation.</p>
          <p>The engagements covered identity and access management, cloud security, governance, risk and evidence assurance. Learners were expected to implement decisions, examine the resulting evidence and explain what that evidence could support.</p>
        </div>
      </section>

      <section className="learning-role" aria-labelledby="learning-role-title">
        <div className="shell learning-role-inner">
          <div>
            <p className="experience-context">Practitioner-led project design</p>
            <h2 id="learning-role-title">The work is designed around professional judgment, not assignment completion.</h2>
          </div>
          <div>
            <p><strong>Dr. Oluwabiyi Adeyemo</strong> designs the experiential project tasks, mentors learners and evaluates their applied work.</p>
            <p>Capella University faculty retain academic oversight and grading. SozoRock provides the applied problem environment, practitioner direction and evidence review.</p>
          </div>
        </div>
      </section>

      <section className="learning-evidence-story" aria-labelledby="learning-evidence-title">
        <div className="shell learning-evidence-story-inner">
          <h2 id="learning-evidence-title">The result is visible in the quality of the decision.</h2>
          <p>A September 2026 faculty assessment highlighted progression in evidence-based cybersecurity judgment, technical execution, collaboration and professional decision-making. The assessment is evidence about the engagement, not a university endorsement of the Foundation.</p>
        </div>
      </section>

      <section className="learning-offer" aria-labelledby="learning-offer-title">
        <div className="shell learning-offer-inner">
          <h2 id="learning-offer-title">Bring the problem. Build capability through the work.</h2>
          <p>Universities and workforce organizations can define a technical problem and learner outcome. Technology partners and funders can support the environment, tools and access needed to make the work possible.</p>
          <Link href="/partner" className="experience-link">Start a conversation<ArrowRight size={24} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}
