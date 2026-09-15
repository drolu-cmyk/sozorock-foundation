import { useState } from "react";
import { EngagementForm, PageHero } from "./components";
import { Link } from "./router";
import "./ai-society.css";

const questions = [
  ["Is AI appropriate here?", "Technical capability alone does not establish that AI belongs in a decision."],
  ["Whose experience counts?", "People affected should help define the questions, risks and priorities."],
  ["What rules should apply?", "Set boundaries for acceptable use, disclosure and protected information."],
  ["What evidence is enough?", "Require evidence suited to the decision and the consequences of error."],
  ["Who can intervene?", "Name the people with authority to review, change or stop a decision."],
  ["How can people question or stop it?", "Provide a meaningful route to challenge outcomes and seek review."],
];
const scenarios = {
  learning: {
    label: "Learning",
    title: "A student’s work is flagged by an AI tool.",
    copy: "An academic decision may follow. What should happen before anyone acts?",
    prompts: ["Should a tool’s output trigger an inquiry, determine a penalty, or neither?", "How would students and educators shape the process?", "What should students know about the tool and the rules?", "What other evidence would be needed before alleging misuse?", "Who can examine the work and challenge the tool’s assessment?", "How would a student obtain a fresh review?"],
  },
  work: {
    label: "Work",
    title: "An applicant is screened out before a conversation.",
    copy: "AI informed the decision. What should the applicant be able to know and question?",
    prompts: ["Which hiring decisions should require human judgment?", "How would applicants and workers help define fair treatment?", "What should be disclosed about screening and data use?", "How would an employer examine errors and unequal effects?", "Who has authority to reconsider the screening result?", "What route would let the applicant challenge a mistake?"],
  },
};

function DecisionQuestions() {
  const [selected, setSelected] = useState("learning");
  const scenario = scenarios[selected];
  return <section className="section society-decisions" id="approach" aria-labelledby="approach-title">
    <div className="shell society-decision-layout">
      <div className="society-anchor">
        <h2 id="approach-title">Six questions.<br />One real decision.</h2>
        <div className="society-scenario-switch" role="group" aria-label="Illustrative scenario">
          {Object.entries(scenarios).map(([key, item]) => <button key={key} type="button" aria-pressed={selected === key} onClick={() => setSelected(key)}>{item.label}</button>)}
        </div>
        <div className="society-scenario" aria-live="polite" aria-atomic="true">
          <p className="eyebrow">Illustrative scenario</p><h3>{scenario.title}</h3><p>{scenario.copy}</p>
        </div>
        <p className="society-scenario-note">These scenarios invite discussion. They are not accounts of a participant or institution.</p>
      </div>
      <div className="society-questions" key={selected}>
        {questions.map(([question, copy], index) => <details key={question} open={index === 0}>
          <summary>{question}</summary><p>{copy}</p><p className="society-scenario-prompt">{scenario.prompts[index]}</p>
        </details>)}
      </div>
    </div>
  </section>;
}

export function AiSocietyPage() {
  return <>
    <PageHero eyebrow="AI & Society" title="Who should have a say?" copy="When AI affects learning, work or access to opportunity, people affected should help shape the rules. We are developing a community-governance approach grounded in evidence, human judgment and the right to question a decision.">
      <div className="button-row"><Link href="/ai-society#approach" className="button button-outline-light">Explore the approach</Link><Link href="/ai-society#participate" className="text-link">Participate</Link></div>
    </PageHero>
    <section className="section society-introduction" id="who-decides"><div className="shell society-intro-layout">
      <div><p className="eyebrow">Community governance · In development</p><h2>Who Decides?</h2><p className="society-anchor-thesis">People affected.<br />From the beginning.<br />Throughout use.</p></div>
      <div><p><strong>Who Decides?</strong> is a developing initiative within AI &amp; Society, focused on consequential AI in learning and work.</p><p>Students, educators, workers and job seekers would help identify priorities, examine evidence and develop recommendations. Future institutional responses could make commitments, limits and disagreements visible.</p><p>Convenings will develop as participation, funding and appropriate partnerships are secured.</p></div>
    </div></section>
    <DecisionQuestions />
    <section className="section society-deliberation"><div className="shell">
      <div className="society-method-heading"><h2>Participation with a path to response.</h2><p>The proposed process begins with community questions and keeps decisions open to scrutiny.</p></div>
      <dl className="society-method"><div><dt>Identify</dt><dd>Choose the uses of AI that matter locally.</dd></div><div><dt>Deliberate</dt><dd>Examine evidence, risks and competing interests.</dd></div><div><dt>Recommend</dt><dd>Set community priorities and boundaries.</dd></div><div><dt>Respond</dt><dd>Invite institutions to explain what they can act on—and what they cannot.</dd></div></dl>
      <details className="society-output-note"><summary>What could this work produce?</summary><p>Community decision records, institutional responses and shared expectations for disclosure, privacy and human review. Future testing could inform methods other communities can use. These outputs are proposed; they are not completed results.</p></details>
      <p className="society-event-link">Firesides would surface community priorities. Roundtables would connect those priorities with institutional response. <Link href="/events#firesides" className="text-link">Explore the proposed formats</Link></p>
    </div></section>
    <section className="section form-section" id="participate"><div className="shell form-layout">
      <div><h2>Help shape the questions.</h2><p>Technical expertise is not required. Bring a perspective from learning, teaching, working or applying for work.</p><p>Expressions of interest help inform future convenings. They do not reserve an event place or establish a partnership.</p><p><Link href="/partner#conversation" className="text-link">Host or contribute to future work</Link></p><p><Link href="/support" className="text-link">Discuss support</Link></p></div>
      <details className="society-interest"><summary>Express interest in participating</summary><EngagementForm kind="Participation" /></details>
    </div></section>
    <aside className="shell society-health-note"><p>Related community conversations may examine barriers to care through <a href="https://health.sozorockfoundation.org/">SozoRock Health</a>. Health access remains a distinct area of work; diagnosis, treatment and prescribing stay with licensed providers.</p></aside>
  </>;
}
