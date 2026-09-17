import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "./router";

const capabilities = ["Identity and access management", "GRC", "Cloud security", "Risk and exceptions", "Evidence assurance"];

export function AppliedLearningPage() {
  return (
    <>
      <section className="experience-page-hero learning-experience-hero final-page-hero" aria-labelledby="learning-page-title">
        <div className="shell experience-page-hero-inner">
          <h1 id="learning-page-title">From coursework to cybersecurity work.</h1>
          <p>A six month experiential capstone collaboration with Capella University gives cybersecurity master&apos;s learners the environment, tools and practitioner review to do the work before graduation.</p>
          <Link href="/partner" className="experience-link experience-link-light">Bring an applied learning engagement<ArrowRight size={22} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="learning-practice" aria-labelledby="learning-practice-title">
        <div className="shell learning-practice-inner">
          <h2 id="learning-practice-title">The gap is practice.</h2>
          <p>Many learners begin with academic knowledge and limited hands on cloud exposure. The first part of each engagement builds the context. The next puts learners inside a working environment where decisions have to be implemented, evidenced and defended.</p>
          <div className="learning-capability-line" aria-label="Applied cybersecurity capabilities">
            {capabilities.map((capability) => <span key={capability}>{capability}</span>)}
          </div>
        </div>
      </section>

      <section className="learning-proof" aria-labelledby="learning-proof-title">
        <div className="shell learning-proof-grid">
          <div>
            <h2 id="learning-proof-title">Two cohorts. Eleven graduate learners. Six months per cohort.</h2>
          </div>
          <div>
            <p>Learners configure identity and access controls, examine cloud security evidence, document risk and exceptions, test least privilege and explain the basis for a recommendation.</p>
            <p>By September 2026, faculty feedback highlighted growth in technical execution, evidence based cybersecurity judgment, collaboration and professional decision making.</p>
          </div>
        </div>
      </section>

      <section className="learning-governance" aria-labelledby="learning-governance-title">
        <div className="shell learning-governance-inner">
          <h2 id="learning-governance-title">Academic ownership stays with the university.</h2>
          <p>Capella University faculty retain course ownership, academic oversight and grading. Dr. Oluwabiyi Adeyemo designs the experiential project tasks, mentors learners and evaluates their applied work for SozoRock. The faculty assessment is evidence about the engagement, not a university endorsement of the Foundation.</p>
        </div>
      </section>

      <section className="learning-offer final-learning-offer" aria-labelledby="learning-offer-title">
        <div className="shell learning-offer-inner">
          <h2 id="learning-offer-title">Bring a graduate cohort and a real technology problem.</h2>
          <p>Universities and workforce organizations can define the learner outcome. SozoRock can provide the applied problem, practitioner guidance and evidence review. Technology partners and funders can support the environment and access required to run the work.</p>
          <Link href="/partner" className="experience-link">Discuss an engagement<ArrowRight size={24} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}
