import { Link } from "./router";
import { PageHero } from "./components";

const phases = ["Instruction", "Implementation", "Evidence", "Evaluation"];

export function AppliedLearningPage() {
  return (
    <>
      <PageHero
        eyebrow="Talent & capability"
        title="From academic knowledge to applied capability."
        copy="SozoRock designs experiential technology engagements that move graduate learners from structured instruction into hands-on implementation, evidence and professional judgment."
      />

      <section className="applied-learning-summary" aria-labelledby="applied-model-title">
        <div className="shell applied-learning-summary-inner">
          <div className="applied-learning-model-copy">
            <p className="eyebrow">The model</p>
            <h2 id="applied-model-title">Learn the problem. Work the problem.</h2>
            <p>Academic learning becomes the starting point for scoped technical work, review and accountable decisions.</p>
          </div>
          <div className="applied-learning-model">
            <div className="applied-flow" aria-label="Instruction, implementation, evidence, evaluation">
              {phases.map((phase, index) => (
                <div className="applied-flow-step" key={phase}>
                  <span>{phase}</span>
                  {index < phases.length - 1 ? <span className="applied-flow-arrow" aria-hidden="true">→</span> : null}
                </div>
              ))}
            </div>
            <dl className="applied-metrics" aria-label="Documented graduate engagement">
              <div><dt>2</dt><dd>consecutive cohorts</dd></div>
              <div><dt>11</dt><dd>graduate learners</dd></div>
              <div><dt>2025–26</dt><dd>engagement period</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="applied-learning-case" aria-labelledby="capella-case-title">
        <div className="shell applied-learning-case-layout">
          <div>
            <p className="eyebrow">In practice</p>
            <h2 id="capella-case-title">Graduate applied cybersecurity.</h2>
            <p>Since October 2025, graduate learners in Capella University’s Applied IT Capstone program have worked with The SozoRock Foundation through consecutive experiential cybersecurity engagements.</p>
          </div>
          <div className="applied-learning-case-evidence">
            <p className="eyebrow">Applied work</p>
            <p className="applied-practice-line">Identity &amp; access · Cloud security · Evidence assurance · Governance · Risk</p>
            <p>The engagement moves from structured instruction into implementation and validation within a controlled technical environment. Learners are expected to distinguish what the evidence proves, what it suggests and what remains unknown.</p>
          </div>
        </div>
      </section>

      <section className="applied-learning-role" aria-labelledby="practitioner-role-title">
        <div className="shell applied-learning-role-layout">
          <div>
            <p className="eyebrow">Practitioner role</p>
            <h2 id="practitioner-role-title">Project design stays close to the work.</h2>
          </div>
          <div>
            <p><strong>Dr. Oluwabiyi Adeyemo</strong> designs the experiential project tasks, mentors learners and evaluates their applied work.</p>
            <p>Capella University faculty retain course ownership, academic oversight and grading. SozoRock provides the applied problem environment, practitioner direction and evidence-based review.</p>
          </div>
        </div>
      </section>

      <section className="applied-learning-voice" aria-labelledby="faculty-perspective-title">
        <div className="shell applied-learning-voice-layout">
          <p className="eyebrow">Faculty perspective</p>
          <div>
            <h2 id="faculty-perspective-title">Workplace capability, not task completion.</h2>
            <p>A September 2026 faculty assessment highlighted the engagement’s emphasis on evidence-based cybersecurity judgment, technical execution, professional communication and translating academic knowledge into workplace capability.</p>
            <p className="applied-learning-note">This is a concise summary of faculty feedback, not a university endorsement of the Foundation.</p>
          </div>
        </div>
      </section>

      <section className="applied-learning-engage">
        <div className="shell applied-learning-engage-layout">
          <h2>Build an applied engagement.</h2>
          <div>
            <p>Universities, workforce organizations, public institutions, funders and technology partners can bring a defined learning or capability problem.</p>
            <Link href="/partner" className="editorial-link">Discuss a collaboration</Link>
          </div>
        </div>
      </section>
    </>
  );
}
