import { Link } from "./router";
import { PageHero } from "./components";

export function AppliedLearningPage() {
  return (
    <>
      <PageHero
        eyebrow="Applied learning"
        title="Coursework is the starting point."
        copy="Graduate learners work through real technology problems, implement decisions, test evidence and defend what the evidence can support."
      />

      <section className="learning-journey" aria-labelledby="learning-journey-title">
        <div className="shell learning-journey-grid">
          <div className="learning-journey-copy">
            <h2 id="learning-journey-title">From instruction to judgment.</h2>
            <p>Each engagement moves through a deliberate sequence. Learners first understand the problem, then work inside a controlled technical environment, examine what changed and explain what the evidence proves.</p>
            <Link href="/partner" className="editorial-link">Bring an applied project to SozoRock</Link>
          </div>
          <div className="learning-journey-visual" aria-label="Instruction, implementation, evidence, evaluation">
            <div><strong>01</strong><span>Instruction</span></div>
            <div><strong>02</strong><span>Implementation</span></div>
            <div><strong>03</strong><span>Evidence</span></div>
            <div><strong>04</strong><span>Evaluation</span></div>
          </div>
        </div>
      </section>

      <section className="learning-evidence" aria-labelledby="learning-evidence-title">
        <div className="shell learning-evidence-grid">
          <div className="learning-evidence-counts" aria-label="Two cohorts, eleven graduate learners, 2025 to 2026">
            <div><strong>2</strong><span>cohorts</span></div>
            <div><strong>11</strong><span>graduate learners</span></div>
            <div><strong>2025–26</strong><span>engagement period</span></div>
          </div>
          <div className="learning-evidence-copy">
            <h2 id="learning-evidence-title">The evidence has to support the conclusion.</h2>
            <p>Since October 2025, graduate learners in Capella University’s Applied IT Capstone program have worked with The SozoRock Foundation across consecutive cybersecurity engagements.</p>
            <p className="learning-disciplines">Identity &amp; access · Cloud security · Evidence assurance · Governance · Risk</p>
          </div>
        </div>
      </section>

      <section className="learning-practitioner" aria-labelledby="learning-practitioner-title">
        <div className="shell learning-practitioner-grid">
          <div>
            <h2 id="learning-practitioner-title">The project is designed around decisions, not assignments.</h2>
          </div>
          <div>
            <p><strong>Dr. Oluwabiyi Adeyemo</strong> designs the experiential project tasks, mentors learners and evaluates their applied work.</p>
            <p>Capella University faculty retain course ownership, academic oversight and grading. SozoRock provides the applied environment, practitioner direction and evidence-based review.</p>
          </div>
        </div>
      </section>

      <section className="learning-proof" aria-labelledby="learning-proof-title">
        <div className="shell learning-proof-grid">
          <div className="learning-proof-statement"><p id="learning-proof-title">Academic knowledge. Workplace capability.</p></div>
          <div>
            <p>A September 2026 faculty assessment highlighted the learners’ progression toward evidence-based cybersecurity judgment, technical execution, collaboration and professional decision-making.</p>
            <p className="learning-proof-note">Based on a September 2026 faculty assessment; not a university endorsement of the Foundation.</p>
          </div>
        </div>
      </section>

      <section className="learning-engage"><div className="shell learning-engage-grid">
        <h2>Bring the next problem.</h2>
        <div><p>Universities and workforce organizations can define a technical problem, cohort and outcome. Technology partners and funders can support the environment in which the work happens.</p><Link href="/partner" className="editorial-link">Discuss an engagement</Link></div>
      </div></section>
    </>
  );
}
