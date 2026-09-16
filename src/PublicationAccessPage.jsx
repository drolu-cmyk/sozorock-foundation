import { useEffect, useRef, useState } from "react";
import { Link } from "./router";

const optionalSectors = [
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

const compatibilityProfile = {
  organization: "Not provided by reader",
  sector: "Other",
  cityOrRegion: "Not provided by reader",
  state: "Not provided by reader",
  country: "Not provided by reader",
  reason: "Publication access requested without optional readership details.",
};

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
  if (text.length < 2 || placeholderValues.has(text.toLocaleLowerCase())) return false;
  if (personName && !/^[\p{L}][\p{L}\p{M} .'-]*$/u.test(text)) return false;
  const characters = normalizedCharacters(text);
  return characters.length >= 2 && new Set(characters).size >= 2 && !/(.)\1{3,}/iu.test(text);
}

function isMeaningfulReason(value) {
  const text = String(value || "").trim();
  if (!text) return true;
  const words = text.split(/\s+/u).filter((word) => normalizedCharacters(word).length >= 2);
  const characters = normalizedCharacters(text);
  return text.length >= 30 && text.length <= 800 && words.length >= 3 && new Set(characters).size >= 6 && !/(.)\1{3,}/iu.test(text);
}

export function PublicationAccessPage({ publication }) {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const confirmationRef = useRef(null);

  useEffect(() => {
    if (status === "sent") confirmationRef.current?.focus();
  }, [status]);

  const errorFor = (name) => errors[name]
    ? <span className="field-error" id={`access-${name}-error`}>{errors[name]}</span>
    : null;

  const submitAccess = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const firstName = String(data.get("firstName") || "").trim();
    const lastName = String(data.get("lastName") || "").trim();
    const email = String(data.get("email") || "").trim();
    const organization = String(data.get("organization") || "").trim();
    const sector = String(data.get("sector") || "").trim();
    const cityOrRegion = String(data.get("cityOrRegion") || "").trim();
    const reason = String(data.get("reason") || "").trim();
    const deliveryConsent = data.get("deliveryConsent") === "yes";

    const nextErrors = {};
    if (!isMeaningfulShortText(firstName, { personName: true })) nextErrors.firstName = "Enter your first name";
    if (!isMeaningfulShortText(lastName, { personName: true })) nextErrors.lastName = "Enter your last name";
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Enter a valid email address";
    if (organization && !isMeaningfulShortText(organization)) nextErrors.organization = "Enter a complete organization or affiliation";
    if (sector && !optionalSectors.includes(sector)) nextErrors.sector = "Select a valid role or sector";
    if (cityOrRegion && !isMeaningfulShortText(cityOrRegion)) nextErrors.cityOrRegion = "Enter a valid city or region";
    if (!isMeaningfulReason(reason)) nextErrors.reason = "Use at least three meaningful words (30–800 characters), or leave this optional field blank";
    if (!deliveryConsent) nextErrors.deliveryConsent = "Consent is required to send the verification link";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setMessage("Review the marked fields.");
      setStatus("error");
      const firstInvalidField = Object.keys(nextErrors)[0];
      requestAnimationFrame(() => form.elements.namedItem(firstInvalidField)?.focus());
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      organization: organization || compatibilityProfile.organization,
      sector: sector || compatibilityProfile.sector,
      cityOrRegion: cityOrRegion || compatibilityProfile.cityOrRegion,
      state: compatibilityProfile.state,
      country: compatibilityProfile.country,
      reason: reason || compatibilityProfile.reason,
      website: String(data.get("website") || ""),
      deliveryConsent,
      updatesConsent: data.get("updatesConsent") === "yes",
    };

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
      if (!response.ok || body.accepted !== true || body.verificationSent !== true) {
        throw new Error(body.error || "We could not send the verification email. Please try again.");
      }
      setMessage(body.message || "Check your email for a verification link.");
      setStatus("sent");
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We could not process this request.");
      setStatus("error");
    }
  };

  if (!publication?.accessPath) return null;

  if (status === "sent") {
    return (
      <section className="access-page access-confirmation">
        <div className="shell access-confirmation-inner">
          <p className="eyebrow">Verification sent</p>
          <h1 ref={confirmationRef} tabIndex="-1">Check your email.</h1>
          <p>{message}</p>
          <p>Your publication access link expires in 30 minutes. If it does not arrive, check your spam folder or submit the form again.</p>
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
          <p>Get the full publication at no cost. Enter your name and email, then verify the email address to open the PDF.</p>
          <dl className="access-summary">
            <div><dt>Access</dt><dd>Free</dd></div>
            <div><dt>Verification</dt><dd>Email link</dd></div>
            <div><dt>Link validity</dt><dd>30 minutes</dd></div>
          </dl>
          <p className="access-boundary">Only your name and email are required for delivery. Do not include health, medical or other sensitive information.</p>
          <Link href={publication.path} className="text-link">About this publication</Link>
        </div>
        <form className="publication-access-form" onSubmit={submitAccess} noValidate aria-describedby="access-privacy access-status">
          <div className="field-row">
            <label htmlFor="access-first-name">First name<input id="access-first-name" name="firstName" required autoComplete="given-name" aria-invalid={Boolean(errors.firstName)} aria-describedby={errors.firstName ? "access-firstName-error" : undefined} />{errorFor("firstName")}</label>
            <label htmlFor="access-last-name">Last name<input id="access-last-name" name="lastName" required autoComplete="family-name" aria-invalid={Boolean(errors.lastName)} aria-describedby={errors.lastName ? "access-lastName-error" : undefined} />{errorFor("lastName")}</label>
          </div>
          <label htmlFor="access-email">Email address<input id="access-email" name="email" required type="email" inputMode="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "access-email-error" : undefined} />{errorFor("email")}</label>

          <details className="access-optional-details">
            <summary>Optional readership details</summary>
            <p>These fields help us understand who is using the research. They are not required for access.</p>
            <label htmlFor="access-organization">Organization or affiliation (optional)<input id="access-organization" name="organization" autoComplete="organization" aria-invalid={Boolean(errors.organization)} aria-describedby={errors.organization ? "access-organization-error" : undefined} />{errorFor("organization")}</label>
            <label htmlFor="access-sector">Role or sector (optional)<select id="access-sector" name="sector" defaultValue="" aria-invalid={Boolean(errors.sector)} aria-describedby={errors.sector ? "access-sector-error" : undefined}><option value="">Select one</option>{optionalSectors.map((sectorOption) => <option key={sectorOption}>{sectorOption}</option>)}</select>{errorFor("sector")}</label>
            <label htmlFor="access-city">City or region (optional)<input id="access-city" name="cityOrRegion" autoComplete="address-level2" aria-invalid={Boolean(errors.cityOrRegion)} aria-describedby={errors.cityOrRegion ? "access-cityOrRegion-error" : undefined} />{errorFor("cityOrRegion")}</label>
            <label htmlFor="access-reason">How does this research relate to your interests? (optional)<textarea id="access-reason" name="reason" rows="4" maxLength="800" aria-invalid={Boolean(errors.reason)} aria-describedby={`access-reason-hint${errors.reason ? " access-reason-error" : ""}`} /><span className="field-hint" id="access-reason-hint">When used, enter 30–800 characters and leave out sensitive information.</span>{errorFor("reason")}</label>
          </details>

          <div className="access-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex="-1" autoComplete="off" /></label></div>
          <label className="check-field" htmlFor="access-delivery-consent"><input id="access-delivery-consent" name="deliveryConsent" type="checkbox" value="yes" required aria-invalid={Boolean(errors.deliveryConsent)} aria-describedby={errors.deliveryConsent ? "access-deliveryConsent-error" : undefined} /><span>I agree that The SozoRock Foundation, Inc. may email me the verification and access link for this publication.{errorFor("deliveryConsent")}</span></label>
          <label className="check-field" htmlFor="access-updates-consent"><input id="access-updates-consent" name="updatesConsent" type="checkbox" value="yes" /><span>Optional: Send me future publication updates. This is not required for access.</span></label>
          <p id="access-privacy" className="access-privacy">We use the required information to deliver and protect publication access. Optional readership details support aggregate understanding of research use. See our <Link href="/privacy">Privacy Notice</Link>.</p>
          <button type="submit" className="button button-primary access-submit" disabled={status === "sending"}>{status === "sending" ? "Sending verification…" : "Send my access link"}</button>
          <p id="access-status" className={`access-status ${status === "error" ? "is-error" : ""}`} role="status" aria-live="polite">{message}</p>
        </form>
      </div>
    </section>
  );
}
