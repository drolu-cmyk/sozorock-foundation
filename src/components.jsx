import { useState } from "react";
import { Link } from "./router";

export function PageHero({ eyebrow, title, copy, children, compact = false }) {
  return (
    <section className={`page-hero ${compact ? "is-compact" : ""}`}>
      <div className="shell page-hero-inner">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
        </div>
        {(copy || children) && (
          <div className="page-hero-context">
            {copy && <p className="page-hero-copy">{copy}</p>}
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, copy, action }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
      {action}
    </div>
  );
}

export function CbcapEvidence() {
  return (
    <section className="evidence-section" aria-labelledby="evidence-title">
      <div className="shell evidence-inner">
        <div className="evidence-copy">
          <p className="eyebrow">SozoRock Health · CB-CAP</p>
          <h2 id="evidence-title">See the pattern. Test a response. Build a fundable plan.</h2>
          <p>Nationwide county systems intelligence connecting public evidence to local questions, accountable owners, transparent planning scenarios, and stakeholder-ready briefs.</p>
          <a href="https://cbcap.sozorockfoundation.org/" className="button button-light">Open CB-CAP</a>
        </div>
        <div className="evidence-data" aria-label="Verified CB-CAP public data coverage">
          <div><strong>3,144</strong><span>county equivalents</span></div>
          <div><strong>3,143</strong><span>CDC PLACES profiles</span></div>
          <div><strong>51</strong><span>state and D.C. views</span></div>
          <div><strong>99.97%</strong><span>public-profile coverage</span></div>
        </div>
        <p className="evidence-note">Public-data demonstration using Census geography and CDC PLACES. Aggregate estimates guide questions—not diagnoses, rankings, or final local priorities.</p>
      </div>
    </section>
  );
}

export function StandardsStrip() {
  return (
    <section className="standards-strip">
      <div className="shell standards-inner">
        <div><p className="eyebrow">Standards</p><h2>How the work is governed.</h2></div>
        <div><p>Independence. Corrections. Funding. Authorship. AI use. Citations.</p><Link href="/standards" className="text-link">Read the standards</Link></div>
      </div>
    </section>
  );
}

export function PublicationCard({ publication }) {
  return (
    <article className="publication-card">
      <Link href={publication.path} className="publication-cover"><img src={publication.cover} alt={`${publication.title}, ${publication.volume} cover`} /></Link>
      <div>
        <p className="story-meta">{publication.theme}</p>
        <h2><Link href={publication.path}>{publication.title}</Link></h2>
        <p>{publication.tagline}</p>
        <p className="publication-byline">{publication.volume} · {publication.author} · {publication.date}</p>
        <Link href={publication.path} className="text-link">Open publication record</Link>
      </div>
    </article>
  );
}

export function EngagementForm({ kind }) {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const options = kind === "Support"
    ? ["Fund the work", "Support research and publications", "Partner with us"]
    : ["Partner with us", "CB-CAP inquiry", "Health Equity Hub partnership", "Health Access Day partnership", "Support research and publications", "Bring the model to a community", "Institutional or public-sector inquiry"];
  const roles = ["Individual or family", "Community organization", "Licensed provider or health organization", "County, state, or public agency", "University or researcher", "Foundation or funder", "Corporate organization", "Other"];

  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: `${String(data.get("firstName") || "").trim()} ${String(data.get("lastName") || "").trim()}`.trim(),
      email: String(data.get("email") || "").trim(),
      organization: String(data.get("organization") || "").trim(),
      inquiryType: String(data.get("interest") || ""),
      role: String(data.get("role") || ""),
      stateOrCounty: String(data.get("location") || "").trim(),
      message: String(data.get("message") || "").trim(),
      website: String(data.get("website") || ""),
      consent: data.get("consent") === "yes",
    };
    setStatus("sending");
    setMessage("");
    try {
      const servicePayload = {
        ...payload,
        message: `Organization or affiliation: ${payload.organization}\n\n${payload.message}`,
      };
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(servicePayload),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "We could not send this inquiry right now.");
      setStatus("sent");
      setMessage(body.message || "Thank you. Your inquiry has been received.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We could not send this inquiry right now.");
    }
  };

  return (
    <form className="engagement-form" onSubmit={submit} aria-describedby="engagement-note engagement-status">
      {status === "sent" ? (
        <div className="form-confirmation" role="status">
          <h2>Inquiry received.</h2>
          <p>{message}</p>
          <button className="text-button" type="button" onClick={() => { setStatus("idle"); setMessage(""); }}>Send another inquiry</button>
        </div>
      ) : (
        <>
          <div className="field-row">
            <label>First name<input name="firstName" autoComplete="given-name" required /></label>
            <label>Last name<input name="lastName" autoComplete="family-name" required /></label>
          </div>
          <label>Email<input type="email" name="email" autoComplete="email" required /></label>
          <label>Organization or affiliation<input name="organization" autoComplete="organization" required /></label>
          <label>Organization or role<select name="role" required defaultValue=""><option value="" disabled>Select an option</option>{roles.map((role) => <option key={role}>{role}</option>)}</select></label>
          <label>City, state, or region<input name="location" autoComplete="address-level1" required /></label>
          <label>Area of interest<select name="interest" required defaultValue=""><option value="" disabled>Select an option</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label>What outcome are you working toward?<textarea name="message" rows="5" minLength="20" maxLength="1200" required /></label>
          <div className="access-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex="-1" autoComplete="off" /></label></div>
          <label className="check-field"><input name="consent" type="checkbox" value="yes" required /><span>I agree that The SozoRock Foundation, Inc. may use this information to respond to my inquiry. I have read the <Link href="/privacy">Privacy Notice</Link>.</span></label>
          <p className="form-note" id="engagement-note">Do not submit patient, student, employee, financial, legal, account, or other sensitive information.</p>
          <button className="button button-primary" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : `Send ${kind.toLowerCase()} inquiry`}</button>
          <p id="engagement-status" className={`access-status ${status === "error" ? "is-error" : ""}`} role="status" aria-live="polite">{message}</p>
        </>
      )}
    </form>
  );
}
