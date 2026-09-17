import { ArrowRight } from "@phosphor-icons/react";
import { EngagementForm } from "./components";
import { Link } from "./router";

export function AboutExperiencePage() {
  return (
    <>
      <section className="institutional-hero final-page-hero" aria-labelledby="about-title"><div className="shell institutional-hero-inner">
        <h1 id="about-title">A foundation built to move from evidence to use.</h1>
        <p>SozoRock works where access, capability and accountability break down. We research the problem, test practical responses and publish what the evidence supports.</p>
      </div></section>
      <section className="institutional-story"><div className="shell institutional-story-grid">
        <div><h2>Why this work exists.</h2></div>
        <div><p>Health access can fail even when care exists. Graduate education can end before a learner has done the work. Technology decisions can move faster than the evidence or the people affected by them.</p><p>SozoRock connects research with communities, practitioners, educators and institutions so those gaps can be examined in public and addressed through defined work.</p></div>
      </div></section>
      <section className="institutional-story institutional-story-soft"><div className="shell institutional-story-grid">
        <div><h2>What accountability looks like.</h2></div>
        <div><p>We distinguish planned work, participant reported context, observed activity and measured outcomes. Support does not purchase a conclusion. Clinical care stays with licensed providers. Academic ownership and grading stay with universities.</p><Link href="/standards" className="experience-link">Read the standards<ArrowRight size={22} aria-hidden="true" /></Link></div>
      </div></section>
      <section className="experience-close"><div className="shell experience-close-inner"><h2>Meet the people accountable for the work.</h2><p>Leadership responsibilities cover health partnerships, global affairs, health education and strategic initiatives.</p><Link href="/leadership" className="experience-link">Meet the leadership team<ArrowRight size={22} aria-hidden="true" /></Link></div></section>
    </>
  );
}

export function ContactExperiencePage() {
  return (
    <>
      <section className="institutional-hero final-page-hero" aria-labelledby="contact-title"><div className="shell institutional-hero-inner"><h1 id="contact-title">Start with the problem.</h1><p>Tell us who it affects, what decision is ahead and what a useful result would look like.</p></div></section>
      <section className="section form-section"><div className="shell form-layout"><div><h2>What needs to change?</h2><p>Use this form for research, health access, public systems, AI and Society or applied learning inquiries.</p><p>For a defined collaboration, use <Link href="/partner" className="text-link">Partner</Link>. To discuss financial or in kind support, use <Link href="/support" className="text-link">Support</Link>.</p><p>You can also email <a href="mailto:contact@sozorockfoundation.org">contact@sozorockfoundation.org</a>.</p></div><EngagementForm kind="Contact" /></div></section>
    </>
  );
}

export function EventsExperiencePage() {
  return (
    <>
      <section className="institutional-hero final-page-hero" aria-labelledby="events-title"><div className="shell institutional-hero-inner"><h1 id="events-title">Put the question in the room.</h1><p>Roundtables, firesides and briefings connect lived experience, evidence and institutions that can respond. Dates and participation terms are published only when confirmed.</p></div></section>
      <section className="institutional-story"><div className="shell institutional-story-grid"><div><h2>The 2025 health access roundtable changed the next question.</h2></div><div><p>In Western New York, 12 participants represented two county public health jurisdictions, two universities and a regional community health organization in a preplanning session held with a university school of nursing.</p><p>A regional public health director reported more than 12,000 residents per primary care clinician. That participant reported context helped sharpen the access question that REBS documents and the 2027 pilot will test.</p><Link href="/publication/rebs-v1-2025" className="experience-link">Read REBS<ArrowRight size={22} aria-hidden="true" /></Link></div></div></section>
      <section className="institutional-story institutional-story-soft"><div className="shell institutional-story-grid"><div><h2>Use the format that fits the question.</h2></div><div><p>Firesides begin with the people affected. Roundtables put community priorities to institutions. Research briefings focus on the evidence behind a specific decision.</p><p>AI and Society is developing public processes for questions about learning, work, human review and accountability.</p><Link href="/ai-society" className="experience-link">Explore AI and Society<ArrowRight size={22} aria-hidden="true" /></Link></div></div></section>
      <section className="experience-close"><div className="shell experience-close-inner"><h2>Have a question that needs the right people in the room?</h2><p>Bring the issue, the people affected and the institutions able to respond.</p><Link href="/partner" className="experience-link">Discuss a convening<ArrowRight size={22} aria-hidden="true" /></Link></div></section>
    </>
  );
}

export function InstituteExperiencePage() {
  return (
    <>
      <section className="institutional-hero final-page-hero" aria-labelledby="institute-title"><div className="shell institutional-hero-inner"><h1 id="institute-title">Research for decisions that need scrutiny.</h1><p>SozoRock Global Institute develops public interest research on governance, health access, systems assurance and public decisions, then creates ways for the evidence to be examined.</p><div className="experience-actions"><Link href="/publications" className="button button-light">Read the research</Link><Link href="/events" className="experience-link experience-link-light">Explore convening<ArrowRight size={22} aria-hidden="true" /></Link></div></div></section>
      <section className="institutional-story"><div className="shell institutional-story-grid"><div><h2>Publish the framework. Put the question in the room.</h2></div><div><p>Permanent publication records make the work citable. Roundtables, firesides and briefings make it possible to test the ideas against lived experience, institutional authority and new evidence.</p><Link href="/publications" className="experience-link">Explore publications<ArrowRight size={22} aria-hidden="true" /></Link></div></div></section>
    </>
  );
}

export function AiLabExperiencePage() {
  return (
    <>
      <section className="institutional-hero final-page-hero" aria-labelledby="ai-lab-title"><div className="shell institutional-hero-inner"><h1 id="ai-lab-title">Learn AI by doing work that has to be checked.</h1><p>SozoRock AI Lab uses real tasks, verification, privacy and human judgment to turn tool familiarity into practical capability.</p><div className="experience-actions"><a href="https://ai-lab.sozorockfoundation.org/" className="button button-light">Open the AI Lab</a><a href="https://ai-lab.sozorockfoundation.org/organizations/" className="experience-link experience-link-light">For organizations<ArrowRight size={22} aria-hidden="true" /></a></div></div></section>
      <section className="institutional-story"><div className="shell institutional-story-grid"><div><h2>Learning should produce work someone can review.</h2></div><div><p>One documented participant used the AI Lab to learn, build, review, secure and deploy a live website. The point is not the tool. It is the ability to make something useful, check it and take responsibility for the result.</p><a href="https://www.capitalpropertycare.com/" className="experience-link">View the live participant project<ArrowRight size={22} aria-hidden="true" /></a></div></div></section>
    </>
  );
}
