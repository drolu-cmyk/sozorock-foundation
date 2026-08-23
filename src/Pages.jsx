import { useEffect, useRef, useState } from "react";
import { CbcapEvidence, EngagementForm, PageHero, PublicationCard, SectionHeading, StandardsStrip } from "./components";
import { insights, leaders, partnerRoutes, platforms, publications } from "./siteData";
import { Link } from "./router";

export function PlatformsPage() {
  return (
    <>
      <PageHero eyebrow="Work" title="Platforms" copy="Institute creates insight. Health turns it into access. AI Lab builds capability." />
      <section className="section platform-detail-list">
        <div className="shell">
          {platforms.map((platform) => (
            <article className="platform-detail" key={platform.slug}>
              <div><p className="eyebrow">{platform.name}</p><h2>{platform.line}</h2></div>
              <div><p>{platform.detail}</p><Link href={platform.href} className="text-link">{platform.action}</Link></div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function InstitutePage() {
  return (
    <>
      <PageHero eyebrow="By The SozoRock Foundation" title="SozoRock Global Institute" copy="Insight, publications, and convening across assurance, governance, access, and systems intelligence.">
        <div className="button-row"><Link href="/publications" className="button button-light">Read publications</Link><Link href="/events" className="button button-outline-light">Explore convening</Link></div>
      </PageHero>
      <section className="section">
        <div className="shell">
          <SectionHeading eyebrow="Research architecture" title="Publications establish the lanes. Insight keeps them current." />
          <div className="publication-cards">{publications.map((publication) => <PublicationCard publication={publication} key={publication.slug} />)}</div>
        </div>
      </section>
      <section className="section soft-section">
        <div className="shell split-copy">
          <div><p className="eyebrow">Convene</p><h2>Firesides, roundtables, and briefings.</h2></div>
          <div><p>Small, focused formats connect a publication or field question with researchers, practitioners, agencies, academic partners, and community institutions.</p><Link href="/events" className="text-link">Explore events</Link></div>
        </div>
      </section>
    </>
  );
}

export function HealthPage() {
  const healthPrograms = [
    ["Health Equity Hubs", "Library, community, and home formats that create a trusted non-clinical starting point."],
    ["Health Access Day", "Evidence-shaped local activation with institutions, educators, and licensed professionals working within their roles."],
    ["Place Intelligence", "Public evidence about geography, source, date, comparison, and limits before drawing a conclusion."],
    ["CB-CAP", "De-identified county systems intelligence for local questions, accountable owners, and transparent planning."],
  ];
  return (
    <>
      <PageHero eyebrow="Platform" title="SozoRock Health" copy="Access, navigation, and community evidence—without becoming a clinic, provider, or telehealth platform.">
        <div className="button-row"><a href="https://health.sozorockfoundation.org/" className="button button-light">Open SozoRock Health</a><a href="https://health.sozorockfoundation.org/explore" className="button button-outline-light">Explore a place</a></div>
      </PageHero>
      <section className="section media-story">
        <div className="shell media-story-grid">
          <div className="media-frame"><img src="/media/health-access.webp" alt="Two people use a tablet together in a community library" /></div>
          <div><p className="eyebrow">The access layer</p><h2>A clearer path to care that already exists.</h2><p>SozoRock helps people move from uncertainty to a practical next step while providers retain their clinical platforms, records, consent, medical judgment, treatment, and follow-up.</p><p className="boundary">Not a clinic. Not a provider. Not a telehealth platform.</p></div>
        </div>
      </section>
      <section className="section soft-section">
        <div className="shell"><SectionHeading eyebrow="Work" title="Access where people already are." /><div className="work-list">{healthPrograms.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></div>
      </section>
      <CbcapEvidence />
    </>
  );
}

export function AiLabPage() {
  return (
    <>
      <PageHero eyebrow="Platform" title="SozoRock AI Lab" copy="Applied learning for modern work, grounded in responsible use, verification, and human judgment.">
        <div className="button-row"><a href="https://ai-lab.sozorockfoundation.org/" className="button button-light">Open the AI Lab</a><a href="https://ai-lab.sozorockfoundation.org/organizations/" className="button button-outline-light">For organizations</a></div>
      </PageHero>
      <section className="section participant-story">
        <div className="shell participant-story-inner">
          <div><p className="eyebrow">Participant work</p><h2>Learning that produces reviewed work.</h2></div>
          <div><p>Edward Jones used the AI Lab to learn, build, review, secure, and deploy the Capital Property Care website. Participant information is shared with consent.</p><a href="https://www.capitalpropertycare.com/" className="text-link">Visit the live project</a></div>
        </div>
      </section>
      <section className="method-section">
        <div className="shell"><SectionHeading eyebrow="Practical method" title="Learn. Make. Check. Use." /><div className="method-grid"><div><strong>Learn</strong><span>Understand what the tool can and cannot do.</span></div><div><strong>Make</strong><span>Work on a task that matters.</span></div><div><strong>Check</strong><span>Verify the work and protect information.</span></div><div><strong>Use</strong><span>Put the reviewed result into practice.</span></div></div></div>
      </section>
    </>
  );
}

export function PublicationsPage() {
  return (
    <>
      <PageHero eyebrow="Ideas" title="Publications" copy="Public-interest volumes across assurance, governance, access, and equity." />
      <section className="section" id="doi">
        <div className="shell">
          <div className="publication-cards publication-cards-stack">{publications.map((publication) => <PublicationCard publication={publication} key={publication.slug} />)}</div>
          <div className="doi-note"><strong>Permanent landing pages</strong><p>Each publication keeps its own DOI-facing route, citation information, scope, and access path. These URLs are not redirected to a generic publications page.</p></div>
        </div>
      </section>
      <StandardsStrip />
    </>
  );
}

export function PublicationPage({ publication }) {
  const [citationStatus, setCitationStatus] = useState("");
  if (!publication) return <NotFoundPage />;
  const recordFields = [
    ["Edition", publication.edition],
    ["Publisher", publication.publisher],
    ["Published in", publication.publicationPlace],
    ["Evidence cutoff", publication.evidenceCutoff],
    ["ISBN", publication.isbn],
    ["Language", publication.language],
    ["Extent", publication.pages],
    ["Permanent route", publication.path],
  ].filter(([, value]) => value);
  const relatedPublications = publications.filter((item) => item.slug !== publication.slug);

  const copyCitation = async () => {
    if (!publication.citation) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(publication.citation);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = publication.citation;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        textarea.remove();
        if (!copied) throw new Error("Copy command unavailable");
      }
      setCitationStatus("Citation copied");
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = publication.citation;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        textarea.remove();
        setCitationStatus(copied ? "Citation copied" : "Copy unavailable. Select the citation text to copy it.");
      } catch {
        setCitationStatus("Copy unavailable. Select the citation text to copy it.");
      }
    }
  };

  return (
    <>
      <section className="publication-hero">
        <div className="shell publication-hero-grid">
          <div className="publication-hero-cover"><img src={publication.cover} alt={`${publication.title}, ${publication.volume} cover`} /></div>
          <div>
            <p className="eyebrow">{publication.theme} · Public-interest publication</p>
            <h1>{publication.title}</h1>
            <p className="publication-volume">{publication.volume}</p>
            <p className="publication-tagline">{publication.tagline}</p>
            <dl className="publication-meta">
              <div><dt>Author</dt><dd>{publication.author}</dd></div>
              <div><dt>Published</dt><dd>{publication.date}</dd></div>
              {publication.isbn ? <div><dt>ISBN</dt><dd>{publication.isbn}</dd></div> : <div><dt>Landing page</dt><dd><code>{publication.path}</code></dd></div>}
            </dl>
            <div className="button-row">
              {publication.accessPath ? <Link href={publication.accessPath} className="button button-primary">Request publication</Link> : <a href={publication.external} className="button button-primary">Access the publication</a>}
              {publication.accessPath && <a href={publication.external} className="button button-secondary">Publication overview</a>}
              <Link href="/standards" className="button button-secondary">Publication standards</Link>
            </div>
            {publication.accessPath && <p className="access-note">Public-interest access is free. Email verification protects the publication and helps us understand who the work serves.</p>}
          </div>
        </div>
      </section>
      <section className="section publication-body">
        <div className="shell reading-width">
          <p className="eyebrow">Scope</p><h2>{publication.tagline}</h2><p>{publication.description}</p>
          {publication.limits && <div className="limits"><strong>Important limitation</strong><p>{publication.limits}</p></div>}
        </div>
      </section>
      {recordFields.length > 0 && (
        <section className="publication-record-section" aria-labelledby="publication-record-title">
          <div className="shell publication-record-grid">
            <div>
              <p className="eyebrow">Publication record</p>
              <h2 id="publication-record-title">A permanent, citable record.</h2>
              {publication.subtitle && <p>{publication.subtitle}</p>}
            </div>
            <dl className="publication-record-data">
              {recordFields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{label === "Permanent route" ? <code>{value}</code> : value}</dd></div>)}
              {publication.doi && <div><dt>DOI</dt><dd><a href={`https://doi.org/${publication.doi}`}>{publication.doi}</a></dd></div>}
            </dl>
          </div>
        </section>
      )}
      {publication.citation && (
        <section className="citation-section" aria-labelledby="citation-title">
          <div className="shell citation-layout">
            <div>
              <p className="eyebrow">Citation and access</p>
              <h2 id="citation-title">Use the published record.</h2>
            </div>
            <div className="citation-content">
              <p className="citation-text">{publication.citation}</p>
              <div className="citation-actions">
                <button type="button" className="text-button" onClick={copyCitation}>Copy citation</button>
                {publication.accessPath && <Link href={publication.accessPath} className="text-link">Request publication files</Link>}
              </div>
              <p className="citation-status" role="status" aria-live="polite">{citationStatus}</p>
              <div className="publication-file-line">
                <span>{publication.fileLabel}</span>
                {publication.pages && <span>{publication.pages}</span>}
                {publication.accessPath && <Link href={publication.accessPath}>Verified email access</Link>}
              </div>
              {publication.copyright && <p className="copyright-note">{publication.copyright}</p>}
            </div>
          </div>
        </section>
      )}
      <section className="section related-publications" aria-labelledby="related-publications-title">
        <div className="shell">
          <div id="related-publications-title"><SectionHeading eyebrow="Related publications" title="Three Volume 1 records. One connected agenda." /></div>
          <div className="related-publication-list">
            {relatedPublications.map((item) => (
              <Link href={item.path} className="related-publication-row" key={item.slug}>
                <span>{item.theme}</span><strong>{item.title}</strong><em>{item.tagline}</em>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const accessSectors = [
  "Community organization",
  "County or state agency",
  "Healthcare organization",
  "University or research",
  "Foundation or funder",
  "Policymaker",
  "Student",
  "Individual or family",
  "Other",
];

const placeholderValues = new Set([
  "admin",
  "anonymous",
  "company",
  "foundation",
  "name",
  "none",
  "null",
  "organization",
  "test",
  "testing",
  "the",
  "unknown",
  "user",
]);

function normalizedCharacters(value) {
  return String(value || "").toLocaleLowerCase().match(/[\p{L}\p{N}]/gu) || [];
}

function isMeaningfulShortText(value, { personName = false } = {}) {
  const text = String(value || "").trim();
  if (text.length < 2) return false;
  if (placeholderValues.has(text.toLocaleLowerCase())) return false;
  if (personName && !/^[\p{L}][\p{L}\p{M} .'-]*$/u.test(text)) return false;
  const characters = normalizedCharacters(text);
  if (characters.length < 2 || new Set(characters).size < 2) return false;
  if (/(.)\1{3,}/iu.test(text)) return false;
  return true;
}

function isMeaningfulReason(value) {
  const text = String(value || "").trim();
  const words = text.split(/\s+/u).filter((word) => normalizedCharacters(word).length >= 2);
  const characters = normalizedCharacters(text);
  return text.length >= 20 && text.length <= 800 && words.length >= 3 && new Set(characters).size >= 6 && !/(.)\1{3,}/iu.test(text);
}

export function PublicationAccessPage({ publication }) {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const confirmationRef = useRef(null);

  useEffect(() => {
    if (status === "sent") confirmationRef.current?.focus();
  }, [status]);

  if (!publication?.accessPath) return <NotFoundPage />;

  const errorFor = (name) => errors[name] ? <span className="field-error" id={`access-${name}-error`}>{errors[name]}</span> : null;

  const submitAccess = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      firstName: String(data.get("firstName") || "").trim(),
      lastName: String(data.get("lastName") || "").trim(),
      email: String(data.get("email") || "").trim(),
      organization: String(data.get("organization") || "").trim(),
      sector: String(data.get("sector") || ""),
      cityOrRegion: String(data.get("cityOrRegion") || "").trim(),
      state: String(data.get("state") || "").trim(),
      country: String(data.get("country") || "").trim(),
      reason: String(data.get("reason") || "").trim(),
      website: String(data.get("website") || ""),
      deliveryConsent: data.get("deliveryConsent") === "yes",
      updatesConsent: data.get("updatesConsent") === "yes",
    };
    const nextErrors = {};
    if (!isMeaningfulShortText(payload.firstName, { personName: true })) nextErrors.firstName = "Enter your first name";
    if (!isMeaningfulShortText(payload.lastName, { personName: true })) nextErrors.lastName = "Enter your last name";
    if (!/^\S+@\S+\.\S+$/.test(payload.email)) nextErrors.email = "Enter a valid email address";
    if (!isMeaningfulShortText(payload.organization)) nextErrors.organization = "Enter a complete organization or affiliation";
    if (!accessSectors.includes(payload.sector)) nextErrors.sector = "Select a valid role or sector";
    if (!isMeaningfulShortText(payload.cityOrRegion)) nextErrors.cityOrRegion = "Enter a valid city or region";
    if (!isMeaningfulShortText(payload.state)) nextErrors.state = "Enter a valid state, province, or territory";
    if (!isMeaningfulShortText(payload.country)) nextErrors.country = "Enter a valid country";
    if (!isMeaningfulReason(payload.reason)) nextErrors.reason = "Use at least three meaningful words (20–800 characters)";
    if (!payload.deliveryConsent) nextErrors.deliveryConsent = "Consent is required to send the verification link";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setMessage("Review the marked fields.");
      setStatus("error");
      const firstInvalidField = Object.keys(nextErrors)[0];
      requestAnimationFrame(() => form.elements.namedItem(firstInvalidField)?.focus());
      return;
    }

    setErrors({});
    setMessage("");
    setStatus("sending");
    try {
      const response = await fetch(`/api/publications/access/${publication.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "We could not process this request.");
      setMessage(body.message || "Check your email for a verification link.");
      setStatus("sent");
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We could not process this request.");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <section className="access-page access-confirmation">
        <div className="shell access-confirmation-inner">
          <p className="eyebrow">Verification sent</p>
          <h1 ref={confirmationRef} tabIndex="-1">Check your email.</h1>
          <p>{message}</p>
          <p>The link from <strong>publications@sozorockfoundation.org</strong> expires in 30 minutes. If it does not arrive, check your spam folder or submit the form again.</p>
          <div className="button-row">
            <Link href={publication.path} className="button button-primary">Return to the publication</Link>
            <button type="button" className="button button-secondary" onClick={() => { setStatus("idle"); setMessage(""); }}>Send another link</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="access-page">
      <div className="shell access-layout">
        <div className="access-intro">
          <p className="eyebrow">Publication access</p>
          <h1>Request {publication.title}, {publication.volume}</h1>
          <p>Complete this short form. We will send a one-time verification link to your email address.</p>
          <dl className="access-summary">
            <div><dt>Access</dt><dd>Free</dd></div>
            <div><dt>Verification</dt><dd>Email link</dd></div>
            <div><dt>Link validity</dt><dd>30 minutes</dd></div>
          </dl>
          <p className="access-boundary">Do not include health or medical information.</p>
          <Link href={publication.path} className="text-link">Return to the publication record</Link>
        </div>
        <form className="publication-access-form" onSubmit={submitAccess} noValidate aria-describedby="access-privacy access-status">
          <div className="field-row">
            <label htmlFor="access-first-name">First name<input id="access-first-name" name="firstName" required autoComplete="given-name" aria-invalid={Boolean(errors.firstName)} aria-describedby={errors.firstName ? "access-firstName-error" : undefined} />{errorFor("firstName")}</label>
            <label htmlFor="access-last-name">Last name<input id="access-last-name" name="lastName" required autoComplete="family-name" aria-invalid={Boolean(errors.lastName)} aria-describedby={errors.lastName ? "access-lastName-error" : undefined} />{errorFor("lastName")}</label>
          </div>
          <label htmlFor="access-email">Email address<input id="access-email" name="email" required type="email" inputMode="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "access-email-error" : undefined} />{errorFor("email")}</label>
          <label htmlFor="access-organization">Organization or affiliation<input id="access-organization" name="organization" required autoComplete="organization" aria-invalid={Boolean(errors.organization)} aria-describedby={errors.organization ? "access-organization-error" : undefined} />{errorFor("organization")}</label>
          <label htmlFor="access-sector">Role or sector<select id="access-sector" name="sector" required defaultValue="" aria-invalid={Boolean(errors.sector)} aria-describedby={errors.sector ? "access-sector-error" : undefined}><option value="" disabled>Select one</option>{accessSectors.map((sector) => <option key={sector}>{sector}</option>)}</select>{errorFor("sector")}</label>
          <div className="field-row">
            <label htmlFor="access-city">City or region<input id="access-city" name="cityOrRegion" required autoComplete="address-level2" aria-invalid={Boolean(errors.cityOrRegion)} aria-describedby={errors.cityOrRegion ? "access-cityOrRegion-error" : undefined} />{errorFor("cityOrRegion")}</label>
            <label htmlFor="access-state">State, province, or territory<input id="access-state" name="state" required autoComplete="address-level1" aria-invalid={Boolean(errors.state)} aria-describedby={errors.state ? "access-state-error" : undefined} />{errorFor("state")}</label>
          </div>
          <label htmlFor="access-country">Country<input id="access-country" name="country" required autoComplete="country-name" defaultValue="United States" aria-invalid={Boolean(errors.country)} aria-describedby={errors.country ? "access-country-error" : undefined} />{errorFor("country")}</label>
          <label htmlFor="access-reason">Reason for interest<textarea id="access-reason" name="reason" required rows="4" minLength="20" maxLength="800" aria-invalid={Boolean(errors.reason)} aria-describedby={`access-reason-hint${errors.reason ? " access-reason-error" : ""}`} /><span className="field-hint" id="access-reason-hint">Use at least three meaningful words and 20 characters. Do not include health or medical information.</span>{errorFor("reason")}</label>
          <div className="access-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex="-1" autoComplete="off" /></label></div>
          <label className="check-field" htmlFor="access-delivery-consent"><input id="access-delivery-consent" name="deliveryConsent" type="checkbox" value="yes" required aria-invalid={Boolean(errors.deliveryConsent)} aria-describedby={errors.deliveryConsent ? "access-deliveryConsent-error" : undefined} /><span>I agree that The SozoRock Foundation, Inc. may email me the verification and access link for this publication.{errorFor("deliveryConsent")}</span></label>
          <label className="check-field" htmlFor="access-updates-consent"><input id="access-updates-consent" name="updatesConsent" type="checkbox" value="yes" /><span>Optional: Send me future publication updates. This is not required for access.</span></label>
          <p id="access-privacy" className="access-privacy">We use this information to provide and understand publication access. See our <Link href="/privacy">Privacy Notice</Link>.</p>
          <button type="submit" className="button button-primary access-submit" disabled={status === "sending"}>{status === "sending" ? "Sending verification…" : "Email my verification link"}</button>
          <p id="access-status" className={`access-status ${status === "error" ? "is-error" : ""}`} role="status" aria-live="polite">{message}</p>
        </form>
      </div>
    </section>
  );
}

export function InsightsPage() {
  return (
    <>
      <PageHero eyebrow="Ideas" title="Insights" copy="Notes, briefings, field updates, and systems intelligence from the work." />
      <section className="section" id="notes"><div className="shell"><div className="insight-list">{insights.map((story, index) => {
        const anchor = index === 0 ? "field-updates" : story.type === "Systems intelligence" ? "systems-intelligence" : undefined;
        return <article id={anchor} key={story.title}><p className="story-meta">{story.type}</p><h2><a href={story.href}>{story.title}</a></h2><p>{story.summary}</p><span>{story.source}</span></article>;
      })}</div></div></section>
      <section className="section soft-section" id="briefings"><div className="shell split-copy"><div><p className="eyebrow">Briefings</p><h2>Bring the fact base into the room.</h2></div><div><p>Request a focused briefing on assurance, health access, systems intelligence, community evidence, or applied AI learning.</p><Link href="/partner" className="text-link">Request a briefing</Link></div></div></section>
    </>
  );
}

export function EventsPage() {
  return (
    <>
      <PageHero eyebrow="Ideas" title="Events" copy="Firesides, roundtables, and briefings connect evidence with people who can test and apply it." />
      <section className="section" id="upcoming">
        <div className="shell event-grid">
          <article className="event-status"><p className="eyebrow">Upcoming events</p><h2>No public event date is currently posted.</h2><p>The calendar will show confirmed dates, formats, hosts, locations, and registration details when available.</p><Link href="/partner" className="text-link">Express interest in an event</Link></article>
          <div className="event-formats"><article id="firesides"><h3>Firesides</h3><p>Focused conversations around a publication, emerging question, or implementation challenge.</p></article><article id="roundtables"><h3>Roundtables</h3><p>Working sessions for public agencies, health systems, universities, libraries, and community institutions.</p></article><article><h3>Briefings</h3><p>Decision-ready presentations shaped for a specific audience and question.</p></article></div>
        </div>
      </section>
      <section className="section soft-section" id="past"><div className="shell split-copy"><div><p className="eyebrow">Past events</p><h2>A durable record of convening.</h2></div><div><p>Confirmed past events will retain their topics, speakers, hosts, materials, and available recordings. Records will appear here as they become available.</p><Link href="/partner" className="text-link">Plan a convening</Link></div></div></section>
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <PageHero eyebrow="The Foundation" title="About SozoRock" copy="Research, community implementation, and applied learning across three institutional platforms." />
      <section className="section" id="mission"><div className="shell split-copy"><div><p className="eyebrow">Mission</p><h2>Build platforms that help systems work better.</h2></div><div><p>The Foundation develops public-interest research, practical access models, systems intelligence, convening, and applied learning. Rural communities remain an important application area without defining the full institutional scope.</p><p>Health. Access. Equity. Governance. Assurance. Systems. Intelligence. Applied learning.</p></div></div></section>
      <section className="section soft-section"><div className="shell split-copy"><div><p className="eyebrow">Leadership</p><h2>Institutional responsibility, clearly assigned.</h2></div><div><p>Meet the team responsible for global health partnerships, global affairs, health education, and strategic initiatives.</p><Link href="/leadership" className="text-link">Meet the leadership team</Link></div></div></section>
      <section className="section" id="contact"><div className="shell contact-panel"><div><p className="eyebrow">Contact</p><h2>Start with the question.</h2><p>For publications, events, partnerships, or institutional inquiries:</p></div><a href="mailto:contact@sozorockfoundation.org" className="button button-primary">contact@sozorockfoundation.org</a></div></section>
    </>
  );
}

export function LeadershipPage() {
  return (
    <>
      <PageHero eyebrow="About" title="Leadership" copy="Responsibility for partnerships, global affairs, health education, and strategic initiatives." />
      <section className="section"><div className="shell"><div className="leader-grid">{leaders.map((leader) => <article key={leader.name}><div className="leader-image"><img src={leader.image} alt={leader.name} /></div><div><h2>{leader.name}</h2><p className="leader-title">{leader.title}</p><p>{leader.bio}</p></div></article>)}</div></div></section>
    </>
  );
}

export function PartnerPage() {
  return (
    <>
      <PageHero eyebrow="Engage" title="Partner" copy="Briefings, Hubs, Health Access Day, firesides, publications, and applied learning." />
      <section className="section"><div className="shell"><div className="partner-route-grid">{partnerRoutes.map((route) => <article key={route.title}><h2>{route.title}</h2><p>{route.copy}</p></article>)}</div></div></section>
      <section className="section form-section"><div className="shell form-layout"><div><p className="eyebrow">Start a conversation</p><h2>Tell us what you are trying to do.</h2><p>Identify the opportunity, audience, and platform most relevant to your inquiry.</p></div><EngagementForm kind="Partner" /></div></section>
    </>
  );
}

export function SupportPage() {
  return (
    <>
      <PageHero eyebrow="Engage" title="Support" copy="Help sustain public-interest research, convening, health programs, and applied learning." />
      <section className="section"><div className="shell support-options"><article><h2>Public-interest publications</h2><p>Support research production, editorial review, verified access, and dissemination.</p></article><article><h2>Health access</h2><p>Support community readiness, Hub partnerships, Health Access Day, and place evidence.</p></article><article><h2>Applied learning</h2><p>Sponsor practical AI learning for learners, workforce programs, and community organizations.</p></article><article><h2>In-kind support</h2><p>Discuss technology, venue, printing, professional expertise, or program delivery support.</p></article></div></section>
      <section className="section form-section"><div className="shell form-layout"><div><p className="eyebrow">Support inquiry</p><h2>Choose the work you want to strengthen.</h2><p>Start a conversation about donations, sponsorship, publication support, or in-kind contributions.</p></div><EngagementForm kind="Support" /></div></section>
    </>
  );
}

export function StandardsPage() {
  const standards = [
    ["Independence", "Research conclusions and publication judgments should remain independent of funding or partnership interests."],
    ["Corrections", "Material errors should be corrected transparently while preserving a clear publication and version record."],
    ["Funding", "Relevant funding, sponsorship, and material support should be disclosed with the work they support."],
    ["Authorship", "Authors, contributors, reviewers, and accountable institutional roles should be identified accurately."],
    ["AI use", "AI may support research, design, coding, synthesis, or workflow. Human reviewers remain responsible for evidence, attribution, privacy, limitations, and final publication."],
    ["Citations", "Claims should be linked to source-traceable evidence. Publication records should preserve DOI and citation metadata."],
    ["Copyright", "Copyright, licenses, permitted reuse, and third-party material should be stated clearly."],
    ["Accessibility", "The website and publications should be designed for perceivable, operable, understandable, and robust access."],
  ];
  return (
    <>
      <PageHero eyebrow="About" title="Standards" copy="Independence, corrections, funding, authorship, AI use, citations, copyright, and accessibility." />
      <section className="section"><div className="shell standards-list">{standards.map(([title, copy]) => <article id={title.toLowerCase().replaceAll(" ", "-")} key={title}><h2>{title}</h2><p>{copy}</p></article>)}</div></section>
      <section className="section soft-section"><div className="shell split-copy"><div><p className="eyebrow">Public trust</p><h2>Policies that stand on their own.</h2></div><div><p>Foundation-wide privacy, accessibility, nondiscrimination, and website terms work alongside the safeguards required by each platform.</p><div className="policy-links"><Link href="/privacy" className="text-link">Privacy</Link><Link href="/accessibility" className="text-link">Accessibility</Link><Link href="/nondiscrimination" className="text-link">Nondiscrimination</Link><Link href="/terms" className="text-link">Terms</Link></div></div></div></section>
    </>
  );
}

function PolicyPage({ title, summary, children }) {
  return (
    <>
      <PageHero eyebrow="Legal and policy" title={title} copy={summary} compact />
      <section className="section policy-page"><div className="shell policy-layout"><aside><p className="eyebrow">Last updated</p><p>August 23, 2026</p><p>Questions may be sent to <a href="mailto:contact@sozorockfoundation.org">contact@sozorockfoundation.org</a>.</p></aside><div className="policy-copy">{children}</div></div></section>
    </>
  );
}

export function PrivacyPage() {
  return (
    <PolicyPage title="Privacy Notice" summary="How The SozoRock Foundation, Inc. handles information submitted through this website.">
      <section><h2>Information we receive</h2><p>We receive information you choose to provide through an inquiry or publication-access form, such as your name, email address, organization or affiliation, location, role, interests, and message. Please do not submit medical, emergency, protected health, financial-account, legal, or other sensitive information.</p></section>
      <section><h2>How we use information</h2><p>We use submitted information to respond to inquiries, provide requested publication access, understand institutional interest, protect the service, and maintain appropriate records. Optional publication-update consent is separate from access and may be withdrawn.</p></section>
      <section><h2>Service providers and platforms</h2><p>Hosting, security, email delivery, and related service providers may process limited information on our behalf. Publication-access and inquiry submissions use the Foundation&apos;s established SozoRock Health delivery services. Platform-specific services may publish an additional notice.</p><p><a href="https://health.sozorockfoundation.org/privacy" className="text-link">Read the SozoRock Health Privacy Notice</a></p></section>
      <section><h2>Choices and contact</h2><p>We do not sell personal information or use this website for behavioral advertising. You may ask about, correct, or request deletion of information you submitted by contacting us. We may retain limited records when reasonably necessary for security, legal, or operational obligations.</p></section>
    </PolicyPage>
  );
}

export function AccessibilityPage() {
  return (
    <PolicyPage title="Accessibility" summary="Our commitment to an experience that people can perceive, operate, understand, and use.">
      <section><h2>Our approach</h2><p>We aim to align this website with WCAG 2.2 Level AA practices, including keyboard access, visible focus, meaningful headings, alternative text, readable contrast, responsive layouts, and reduced-motion support.</p></section>
      <section><h2>Documents and services</h2><p>We work to provide accessible publication records and digital materials. Some third-party or historical documents may have limitations. Contact us to request an accessible format or reasonable accommodation.</p></section>
      <section><h2>Feedback</h2><p>If you encounter a barrier, tell us the page, document, assistive technology, and issue. We will review the report and respond with an available path forward.</p></section>
    </PolicyPage>
  );
}

export function NondiscriminationPage() {
  return (
    <PolicyPage title="Nondiscrimination" summary="Equal access, dignity, and respect across Foundation programs and public-facing services.">
      <section><h2>Commitment</h2><p>The SozoRock Foundation does not discriminate in access to its programs, services, partnerships, or public resources on the basis of race, color, national origin, ancestry, ethnicity, religion, sex, pregnancy, sexual orientation, gender identity or expression, age, disability, veteran status, or another status protected by applicable law.</p></section>
      <section><h2>Access and accommodation</h2><p>We seek to provide reasonable accommodations and language-access pathways where practicable. Contact us before an event or activity when an accommodation would support participation.</p></section>
      <section><h2>Questions or concerns</h2><p>Send a concern with enough information for us to understand and review it. Retaliation for raising a good-faith accessibility or nondiscrimination concern is not acceptable.</p></section>
    </PolicyPage>
  );
}

export function TermsPage() {
  return (
    <PolicyPage title="Website Terms" summary="Terms governing use of this website and its public-interest materials.">
      <section><h2>Informational purpose</h2><p>This website and its publications provide general public-interest information. They are not medical, clinical, legal, tax, investment, or emergency advice and do not create a professional, fiduciary, clinical, or provider relationship.</p></section>
      <section><h2>Permitted use</h2><p>You may use the website lawfully and may cite or link to public pages. Publication-specific copyright, permissions, licenses, and citation instructions control reuse of publication files. Do not interfere with the service, bypass access controls, misrepresent Foundation affiliation, or use Foundation marks without permission.</p></section>
      <section><h2>External services</h2><p>Links to external sites and Foundation platforms are provided for context and convenience. Their content, availability, and privacy practices may be governed by separate terms and notices.</p></section>
      <section><h2>Availability and changes</h2><p>We work to keep information accurate and services available but do not promise uninterrupted operation or that every item is complete or current. We may correct, update, suspend, or remove material while preserving appropriate publication and corrections records.</p></section>
      <section><h2>Foundation identity</h2><p>© 2026 The SozoRock Foundation, Inc. SozoRock® is a registered trademark of SozoRock Tech Inc., used under license by The SozoRock Foundation.</p></section>
    </PolicyPage>
  );
}

export function NotFoundPage() {
  return <PageHero eyebrow="Page not found" title="The requested page is not available." copy="Return to the parent site or explore the work."><div className="button-row"><Link href="/" className="button button-light">Return home</Link><Link href="/platforms" className="button button-outline-light">Explore platforms</Link></div></PageHero>;
}
