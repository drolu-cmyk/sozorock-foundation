import { useEffect, useRef, useState } from "react";
import { PageHero } from "./components";
import { Link } from "./router";
import "./ai-society.css";

const decisions = [
  ["A use is proposed.", "Is AI appropriate here?", "Begin with the purpose, the people it serves and the alternatives. Some decisions may be better made without AI."],
  ["Affected people are identified.", "Whose experience counts?", "Include people who use the system, people subject to its decisions and people who may be excluded. Participation begins before deployment."],
  ["Use and safeguards are defined.", "What rules should apply?", "Affected people help define acceptable uses, boundaries and what must be disclosed. Safeguards should reflect the setting and its risks."],
  ["The system is evaluated.", "What evidence is enough?", "Examine performance, limits and effects on different people. Independent evaluation should test the claims that matter in the intended setting."],
  ["Human oversight is established.", "Who can intervene?", "Make responsibility visible. Identify when human review is required and who has the authority, information and time to act."],
  ["Use remains open to challenge.", "How can people question or stop it?", "People need a clear route to question decisions and seek review. Evidence from use should inform changes, pauses or withdrawal."],
];

function DecisionSequence() {
  const sequence = useRef(null);
  const [active, setActive] = useState(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reduced || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting);
      if (visible.length) setActive(Number(visible[0].target.dataset.stage));
    }, { rootMargin: "-20% 0px -45% 0px", threshold: 0 });
    sequence.current.querySelectorAll("li").forEach(stage => observer.observe(stage));
    return () => observer.disconnect();
  }, [paused, reduced]);

  const emphasized = paused || reduced ? null : active;
  return <section className="society-decisions section" aria-labelledby="who-decides">
    <div className="shell society-decision-layout">
      <div className="society-anchor">
        <p className="eyebrow">A question at every stage</p>
        <h2 id="who-decides">Who decides?</h2>
        <p className="society-anchor-thesis">People affected.<br />From the beginning.<br />Throughout use.</p>
        <p id="decision-summary">A proposed approach: affected people help shape the purpose, safeguards, evaluation and human oversight of AI, with a continuing route to challenge its use.</p>
        {!reduced && <button type="button" className="text-button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? "Resume scroll emphasis" : "Pause scroll emphasis"}</button>}
        <div className="society-progress" aria-hidden="true">{decisions.map((decision, index) => <span key={decision[0]} className={emphasized !== null && index <= emphasized ? "is-reached" : ""} />)}</div>
      </div>
      <ol className="society-sequence" ref={sequence} aria-describedby="decision-summary">
        {decisions.map(([stage, question, copy], index) => <li key={stage} data-stage={index} className={emphasized === index ? "is-active" : ""}>
          <p className="eyebrow">{stage}</p><h3>{question}</h3><p>{copy}</p>
          <p className="society-participation">With the people affected</p>
        </li>)}
      </ol>
    </div>
  </section>;
}

export function AiSocietyPage() {
  return <>
    <PageHero eyebrow="An emerging area of work" title="AI & Society" copy="People affected by consequential uses of AI should have a meaningful say in how those systems are introduced, evaluated and governed." />
    <section className="section"><div className="shell split-copy">
      <div><p className="eyebrow">The public question</p><h2>AI enters decisions.<br />People need a voice.</h2></div>
      <div><p>AI systems increasingly influence work, learning, services and institutional decisions. Their effects depend on where they are used, what evidence supports them and who can question the result.</p><p>Our work asks how communities and institutions can make those decisions together. Human judgment matters both when a system is used and when its rules are set.</p></div>
    </div></section>
    <DecisionSequence />
    <section className="section"><div className="shell split-copy">
      <div><p className="eyebrow">Our approach</p><h2>Develop the evidence.<br />Make room for judgment.</h2></div>
      <div><p>We are examining participatory governance, community-defined safeguards, transparency, independent evaluation and meaningful human oversight.</p><p>This is an emerging area of work. We are developing questions for research, convening and applied learning, including how people can challenge a deployment and how institutions should respond.</p></div>
    </div></section>
    <section className="section soft-section" aria-labelledby="society-connections"><div className="shell">
      <div className="section-heading"><div><p className="eyebrow">Connected work</p><h2 id="society-connections">One Foundation. Related questions.</h2></div></div>
      <div className="society-connections">
        <div><h3>Health &amp; Place</h3><p>Health access, place-based evidence and public-interest infrastructure remain central to the Foundation. This work examines access, equity and the systems people rely on.</p><Link href="/platforms" className="text-link">Explore our work</Link></div>
        <div><h3>AI &amp; Society</h3><p>How should people and institutions make consequential decisions about AI? The <a href="https://ai-lab.sozorockfoundation.org/">SozoRock AI Lab</a> contributes the applied-learning dimension: real work, human judgment, verification, privacy and responsible use.</p></div>
        <div><h3>Research &amp; Public Systems</h3><p>The SozoRock Global Institute connects research, publication and convening around assurance, governance, access and systems. AI and society extends those research questions.</p><Link href="/platforms/institute" className="text-link">Explore the Institute</Link></div>
      </div>
    </div></section>
  </>;
}
