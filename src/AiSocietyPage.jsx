import { useState } from "react";
import { EngagementForm, PageHero } from "./components";
import { Link } from "./router";
import "./ai-society.css";

const questions = [
  ["Is AI appropriate here?", "A tool’s capability is not, by itself, a reason to use it in a consequential decision."],
  ["Whose experience counts?", "People affected should shape the question, the risks and the acceptable trade-offs."],
  ["What rules should apply?", "Define what the system may do, what it must disclose and what information stays protected."],
  ["What evidence is enough?", "Match the evidence to the decision, the likely harm and the cost of error."],
  ["Who can intervene?", "Name the person with authority to review, change or stop the process."],
  ["How can people question or stop it?", "Provide notice, access to reasons and a credible route to a fresh review."],
];

const scenarios = {
  learning: {
    label: "Learning",
    title: "A student’s work is flagged by an AI tool.",
    copy: "An academic decision may follow. What should happen before anyone acts?",
    prompts: [
      "Should the output open an inquiry, determine a penalty or do neither?",
      "How should students and educators shape the process?",
      "What should students know about the tool, data and rules?",
      "What other evidence is needed before alleging misuse?",
      "Who can examine the work and challenge the tool’s assessment?",
      "How can the student obtain a fresh review?",
    ],
  },
  work: {
    label: "Work",
    title: "An applicant is screened out before a conversation.",
    copy: "AI informed the decision. What should the applicant be able to know and question?",
    prompts: [
      "Which hiring decisions should always require human judgment?",
      "How should applicants and workers define fair treatment?",
      "What should be disclosed about screening and data use?",
      "How should an employer examine errors and unequal effects?",
      "Who has authority to reconsider the result?",
      "What route lets the applicant challenge a mistake?",
    ],
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
        <p className="society-scenario-note">These scenarios are prompts for public examination, not accounts of a participant or institution.</p>
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
    <PageHero eyebrow="AI & Society" title="Who should have a say?" copy="When AI affects learning or work, people affected should help set the rules, the evidence and the route to review. Who Decides? sets out a public process for doing that.">
      <div className="button-row"><Link href="/ai-society#approach" className="button button-light">See the process</Link><Link href="/ai-society#participate" className="button button-outline-light">Express interest</Link></div>
    </PageHero>
    <section className="section society-introduction" id="who-decides"><div className="shell society-intro-layout">
      <div><p className="eyebrow">Public participation for consequential AI</p><h2>Who Decides?</h2><p className="society-anchor-thesis">People affected.<br />Rules made visible.<br />Decisions open to review.</p></div>
      <div><p><strong>Who Decides?</strong> is a developing SozoRock process for AI decisions in learning and work. It is designed to turn participation into documented questions, recommendations and institutional responses.</p><p>Students, educators, workers and job seekers would define priorities and examine evidence. Institutions would respond on the record: what they can change, what needs more evidence and what remains unresolved.</p><p>The first convenings require participant support, accessible facilitation and institutional hosts.</p></div>
    </div></section>
    <DecisionQuestions />
    <section className="section society-deliberation"><div className="shell">
      <div className="society-method-heading"><h2>A public record, not a listening exercise.</h2><p>The process is designed to show who raised the question, what evidence was considered, what was recommended and how institutions responded.</p></div>
      <dl className="society-method"><div><dt>Identify</dt><dd>Choose the AI decisions that matter locally.</dd></div><div><dt>Examine</dt><dd>Test the evidence, risks and competing interests.</dd></div><div><dt>Recommend</dt><dd>Set priorities, safeguards and boundaries.</dd></div><div><dt>Respond</dt><dd>Ask institutions to state what they will address—and what they will not.</dd></div></dl>
      <div className="society-output-note" aria-labelledby="society-output-title"><p className="eyebrow">Planned public outputs</p><h3 id="society-output-title">Records people can inspect.</h3><p>Community decision records, institutional responses and clear expectations for disclosure, privacy and human review. A tested process could be adapted by other communities.</p><p className="society-output-boundary">These outputs are planned. They are not completed results, certifications or institutional commitments.</p></div>
      <article className="society-sample-record" aria-labelledby="sample-record-title">
        <div className="society-sample-heading"><p className="eyebrow">Illustrative record · Not a completed decision</p><h3 id="sample-record-title">When an automated tool flags a student’s work.</h3><p>This example shows the information a future public decision record could make visible.</p></div>
        <dl className="society-record-grid">
          <div><dt>Question</dt><dd>Should the output open an inquiry, determine a penalty or do neither?</dd></div>
          <div><dt>Evidence required</dt><dd>The student’s work, assignment context, tool limitations and an educator’s independent review.</dd></div>
          <div><dt>Human authority</dt><dd>A named person acting under a published policy—not the tool alone.</dd></div>
          <div><dt>Route to challenge</dt><dd>Notice of the reasons, access to the evidence and a fresh review by a different qualified person.</dd></div>
          <div><dt>Institutional response</dt><dd>Not applicable. This illustration is not an adopted policy, completed decision or institutional commitment.</dd></div>
        </dl>
      </article>
      <p className="society-event-link">Firesides surface community priorities. Roundtables put those priorities to institutions for response. <Link href="/events#firesides" className="text-link">Explore the formats</Link></p>
    </div></section>
    <section className="section form-section" id="participate"><div className="shell form-layout">
      <div><h2>Bring the question others overlook.</h2><p>No technical background is required. Bring experience from learning, teaching, hiring, working or seeking work.</p><p>An expression of interest does not reserve a place or establish a partnership.</p><p className="society-support-case"><strong>What support makes possible.</strong> Participant compensation, accessible facilitation, independent review, secure administration and public documentation. Hosts and institutional supporters may contribute venues, expertise, evaluation or technology without directing findings.</p><p><Link href="/partner#conversation" className="text-link">Discuss hosting</Link></p><p><Link href="/support" className="text-link">Discuss support</Link></p></div>
      <details className="society-interest"><summary>Express interest in participating</summary><EngagementForm kind="Participation" /></details>
    </div></section>
    <aside className="shell society-health-note"><p>Related conversations may examine barriers to care through <a href="https://health.sozorockfoundation.org/">SozoRock Health</a>. Diagnosis, treatment and prescribing remain with licensed providers.</p></aside>
  </>;
}
