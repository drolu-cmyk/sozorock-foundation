import { useState } from "react";
import { Link } from "./router";
import { partnerRoutes } from "./siteData";

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
  const [sent, setSent] = useState(false);
  const options = kind === "Support"
    ? ["Support public-interest publications", "Sponsor applied learning", "Support Health programs", "Provide in-kind support", "Discuss another form of support"]
    : partnerRoutes.map((route) => route.title);

  return (
    <form className="engagement-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
      {sent ? (
        <div className="form-confirmation" role="status">
          <h2>Next step ready.</h2>
          <p>Email <a href="mailto:contact@sozorockfoundation.org">contact@sozorockfoundation.org</a> to continue the conversation. Do not include sensitive information.</p>
          <button className="text-button" type="button" onClick={() => setSent(false)}>Return to the form</button>
        </div>
      ) : (
        <>
          <div className="field-row">
            <label>First name<input name="firstName" autoComplete="given-name" required /></label>
            <label>Last name<input name="lastName" autoComplete="family-name" required /></label>
          </div>
          <label>Email<input type="email" name="email" autoComplete="email" required /></label>
          <label>Organization<input name="organization" autoComplete="organization" /></label>
          <label>Area of interest<select name="interest" required defaultValue=""><option value="" disabled>Select an option</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label>What would you like to discuss?<textarea name="message" rows="5" required /></label>
          <p className="form-note">Do not submit patient, student, employee, financial, legal, account, or other sensitive information.</p>
          <button className="button button-primary" type="submit">Prepare {kind.toLowerCase()} inquiry</button>
        </>
      )}
    </form>
  );
}
