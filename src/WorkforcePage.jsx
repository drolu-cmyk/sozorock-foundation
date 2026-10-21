import { useState } from "react";
import { Link } from "./router";

const AI_LAB = "https://ai-lab.sozorockfoundation.org/";

const skills = [
  ["AI", 41, true],
  ["Cloud security", 36, true],
  ["Risk assessment", 29, true],
  ["Application security", 28, false],
  ["Governance, risk and compliance", 27, true],
];

const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const lanes = [
  { name: "Capella University", sub: "Cohort 1 · graduate · United States", span: "1 / 7", color: "#071D3B", label: "6 learners" },
  { name: "Capella University", sub: "Cohort 2 · graduate · United States", span: "7 / 13", color: "#0644AD", label: "5 learners" },
  { name: "Athabasca University", sub: "Work integrated learning · undergraduate · Canada", span: "5 / 11", color: "#3F72C4", label: "1 learner" },
];

const practice = [
  ["Cloud computing", "Build and run services on AWS.", "M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z"],
  ["Cloud security", "Find risks, rate them, fix what matters first.", "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4"],
  ["Identity and access", "Who can reach what, and why.", "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3 2.5-5 5-5s5 2 5 5M14 10h7v6h-7zM15.5 10V8.5a2 2 0 0 1 4 0V10"],
  ["Governance, risk and compliance", "Controls mapped and shown to work.", "M6 3h9l4 4v14H6zM14 3v5h5M9 13l2 2 4-4"],
];

const ROLES = { "A university": "University or researcher", "A health system": "Licensed provider or health organization", "An employer": "Corporate organization", "A funder": "Foundation or funder", "Other": "Other" };

function PartnerForm() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const organization = String(data.get("organization") || "").trim();
    const youAre = String(data.get("youAre") || "Other");
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      organization,
      inquiryType: "Partner with us",
      role: ROLES[youAre] || "Other",
      stateOrCounty: String(data.get("location") || "").trim(),
      message: `Organization or affiliation: ${organization}\n\nWorkforce Capacity partnership (${youAre})\n\n${String(data.get("message") || "").trim()}`,
      website: String(data.get("website") || ""),
      consent: data.get("consent") === "yes",
    };
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "We could not send this right now.");
      form.reset();
      setStatus("sent");
      setMessage("Thank you. We have your note and will be in touch.");
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "We could not send this right now. Email contact@sozorockfoundation.org.");
    }
  };
  return <form className="ns-form" onSubmit={submit} aria-describedby="workforce-status">
    <label className="ns-field">Full name<input name="name" type="text" autoComplete="name" required minLength={3} /></label>
    <label className="ns-field">Work email<input name="email" type="email" autoComplete="email" required /></label>
    <label className="ns-field">Organization<input name="organization" type="text" autoComplete="organization" required minLength={2} /></label>
    <label className="ns-field">You are<select name="youAre" required defaultValue="A university">{Object.keys(ROLES).map((role) => <option key={role}>{role}</option>)}</select></label>
    <label className="ns-field full">City, state or region<input name="location" type="text" autoComplete="address-level2" required minLength={2} /></label>
    <label className="ns-field full">What would you like to build?<textarea name="message" required minLength={20} maxLength={1100} /></label>
    <label className="ns-honeypot" aria-hidden="true">Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
    <label className="ns-check"><input name="consent" type="checkbox" value="yes" required /><span>The SozoRock Foundation may use this information to respond. See the <a href="/privacy">Privacy Policy</a>.</span></label>
    <div className="ns-form-actions"><button className="ns-btn ns-btn-primary" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending" : "Send"}</button></div>
    <p id="workforce-status" className={`ns-status ${status === "error" ? "error" : ""}`} role="status" aria-live="polite">{message}</p>
  </form>;
}

export function WorkforcePage() {
  return <div className="ns ns-workforce">
    <section className="ns-page-hero ns-dark" aria-labelledby="workforce-title">
      <div className="ns-shell">
        <p className="crumb"><Link href="/platforms">Our Work</Link></p>
        <h1 className="ns-h1" id="workforce-title">Stronger systems start with skilled people.</h1>
        <p className="lede">Hands on learning in cloud, security, governance and AI, built with universities, employers and communities.</p>
        <div className="ns-actions">
          <a className="ns-btn ns-btn-light" href="#partner">Partner with us</a>
          <a className="ns-more on-dark" href="#model">Explore our model →</a>
        </div>
      </div>
    </section>

    <section className="ns-section" aria-labelledby="demand-title">
      <div className="ns-shell ns-two" style={{ alignItems: "start" }}>
        <div>
          <h2 className="ns-h2" id="demand-title">Health systems are asking more of fewer people.</h2>
          <ul className="ns-facts">
            <li><b>$50B</b><p>in federal rural health transformation awards reaching all 50 states. New York State’s first year plan, $212M, names workforce and cybersecurity among its four aims.</p><p className="ns-source">CMS, December 2025; New York State Department of Health, December 2025</p></li>
            <li><b>Every hospital</b><p>in New York State must now name a chief information security officer. Rules are tightening.</p><p className="ns-source">10 NYCRR 405.46, in force October 2025</p></li>
            <li><b>Every setting</b><p>in New York State reports nurse shortages. Clinics still lack primary care physicians.</p><p className="ns-source">Center for Health Workforce Studies, June 2026</p></li>
          </ul>
        </div>
        <figure role="img" aria-label="Skills security teams need most: AI 41 percent, cloud security 36, risk assessment 29, application security 28, governance, risk and compliance 27. SozoRock programs cover AI, cloud security, risk assessment and governance, risk and compliance.">
          <p style={{ fontSize: 20, fontWeight: 600 }}>The skills security teams need most</p>
          <p className="ns-source" style={{ margin: "4px 0 24px" }}>Share of security professionals naming each need</p>
          <div className="ns-hbars" aria-hidden="true">
            {skills.map(([name, value, ours]) => <div key={name}>
              <div className="row"><span style={{ fontWeight: ours ? 600 : 400 }}>{name}</span><b>{value}%</b></div>
              <div className="track"><div className="fill" style={{ width: `${(value / 45) * 100}%`, background: ours ? "#0644AD" : "#A9C6F0" }} /></div>
            </div>)}
          </div>
          <div className="ns-legend" aria-hidden="true"><span><i style={{ background: "#0644AD" }} />In our programs</span><span><i style={{ background: "#A9C6F0" }} />Not yet</span></div>
          <figcaption className="ns-source" style={{ marginTop: 12 }}>ISC2 Cybersecurity Workforce Study, December 2025</figcaption>
        </figure>
      </div>
    </section>

    <section className="ns-section tight ns-panel" id="model" aria-labelledby="model-title">
      <div className="ns-shell">
        <h2 className="ns-h2" id="model-title">Our model</h2>
        <p className="ns-lede">Learners work on real problems. Partners get the work and the talent.</p>
        <ul className="ns-cards">
          <li><article className="ns-card"><h3>Universities</h3><p>Experiential learning for graduate and undergraduate students on real projects.</p><a className="ns-more" href="#partner">Host a cohort →</a></article></li>
          <li><article className="ns-card"><h3>Health systems and employers</h3><p>Real cloud, security and AI projects delivered, and a pipeline of job ready talent.</p><a className="ns-more" href="#partner">Share a project →</a></article></li>
          <li><article className="ns-card"><h3>Communities</h3><p>Free, practical AI skills for any background through the SozoRock AI Lab.</p><a className="ns-more" href={AI_LAB}>Register for the AI Lab ↗</a></article></li>
        </ul>
      </div>
    </section>

    <section className="ns-section" aria-labelledby="results-title">
      <div className="ns-shell">
        <h2 className="ns-h2" id="results-title">Results with two universities in two countries</h2>
        <figure className="ns-gantt" role="img" aria-label="Timeline from October 2025 to September 2026. Capella University cohort one, six graduate learners, October 2025 to March 2026. Capella University cohort two, five graduate learners, April to September 2026. Athabasca University work integrated learning, one undergraduate, February to July 2026.">
          <div />
          <div className="months" aria-hidden="true">{months.map((month) => <span key={month}>{month}</span>)}</div>
          {lanes.map((lane) => [
            <div className="who" key={`${lane.sub}-who`} aria-hidden="true"><b>{lane.name}</b><small>{lane.sub}</small></div>,
            <div className="lane" key={`${lane.sub}-lane`} aria-hidden="true"><div className="bar" style={{ gridColumn: lane.span, background: lane.color }}>{lane.label}</div></div>,
          ])}
        </figure>
        <div className="ns-kpis">
          <div><b>11</b><p>graduate learners at Capella University, which retains academic oversight and grading.</p></div>
          <div><b>1</b><p>undergraduate in work integrated learning with Athabasca University, Alberta, Canada, building a security framework for community health sites.</p></div>
          <div><b>2 countries</b><p>One model that works across institutions, systems and borders.</p></div>
        </div>
      </div>
    </section>

    <section className="ns-section tight ns-panel" aria-labelledby="skills-title">
      <div className="ns-shell">
        <h2 className="ns-h2" id="skills-title">Skills in practice</h2>
        <ul className="ns-skills">
          {practice.map(([name, line, icon]) => <li key={name}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0644AD" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={icon} /></svg>
            <h3>{name}</h3><p>{line}</p>
          </li>)}
        </ul>
        <div className="ns-mentor">
          <img src="/leadership/dr-oluwabiyi-adeyemo-headshot.jpg" alt="Dr. Oluwabiyi Adeyemo" width="480" height="480" loading="lazy" decoding="async" />
          <p>Designed, mentored and evaluated by <strong>Dr. Oluwabiyi Adeyemo</strong>, Director of Strategic Initiatives.</p>
        </div>
      </div>
    </section>

    <div className="ns-shell" style={{ paddingTop: 96 }}>
      <section className="ns-band" aria-labelledby="workforce-lab-title">
        <div>
          <h2 className="ns-h2" id="workforce-lab-title">SozoRock AI Lab: practical AI skills for everyone</h2>
          <p>Free. Tuesdays at 6:30 pm, Albany, New York State.</p>
        </div>
        <a className="ns-btn ns-btn-light" href={AI_LAB}>Register for the AI Lab ↗</a>
      </section>
    </div>

    <section className="ns-section" id="partner" aria-labelledby="partner-title">
      <div className="ns-shell ns-two" style={{ alignItems: "start" }}>
        <div>
          <h2 className="ns-h2" id="partner-title">Partner with us</h2>
          <p className="ns-lede">Host a cohort, share a project or build capacity in your team.</p>
        </div>
        <PartnerForm />
      </div>
    </section>
  </div>;
}
