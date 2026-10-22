import { useState } from "react";

const ROLES = ["Individual or family", "Community organization", "Licensed provider or health organization", "County, state, or public agency", "University or researcher", "Foundation or funder", "Corporate organization", "Other"];

export function BriefingForm({ idPrefix = "briefing" }) {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("briefingName") || "").trim();
    const organization = String(data.get("briefingOrganization") || "").trim();
    const payload = {
      name,
      email: String(data.get("briefingEmail") || "").trim(),
      organization,
      inquiryType: "Support research and publications",
      role: String(data.get("briefingRole") || ""),
      stateOrCounty: String(data.get("briefingLocation") || "").trim(),
      message: `Organization or affiliation: ${organization}\n\nPlease add me to The SozoRock Briefing for research, data and event updates.`,
      website: String(data.get("briefingWebsite") || ""),
      consent: data.get("briefingConsent") === "yes",
    };
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "We could not add you right now.");
      form.reset();
      setStatus("sent");
      setMessage("Thank you. You are on the list for The SozoRock Briefing.");
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "We could not add you right now. Email contact@sozorockfoundation.org.");
    }
  };

  return <form className="ns-form" onSubmit={submit} aria-describedby={`${idPrefix}-status`}>
    <label className="ns-field">Full name<input name="briefingName" type="text" autoComplete="name" required minLength={3} /></label>
    <label className="ns-field">Email address<input name="briefingEmail" type="email" autoComplete="email" required /></label>
    <label className="ns-field">Organization<input name="briefingOrganization" type="text" autoComplete="organization" required minLength={2} /></label>
    <label className="ns-field">You are<select name="briefingRole" required defaultValue="">
      <option value="" disabled>Select one</option>
      {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
    </select></label>
    <label className="ns-field full">City, state or region<input name="briefingLocation" type="text" autoComplete="address-level2" required minLength={2} /></label>
    <label className="ns-honeypot" aria-hidden="true">Website<input name="briefingWebsite" type="text" tabIndex={-1} autoComplete="off" /></label>
    <label className="ns-check"><input name="briefingConsent" type="checkbox" value="yes" required /><span>Send me The SozoRock Briefing. Unsubscribe at any time. See the <a href="/privacy">Privacy Policy</a>.</span></label>
    <div className="ns-form-actions">
      <button className="ns-btn ns-btn-primary" type="submit" disabled={status === "sending"}>{status === "sending" ? "Subscribing" : "Subscribe"}</button>
    </div>
    <p id={`${idPrefix}-status`} className={`ns-status ${status === "error" ? "error" : ""}`} role="status" aria-live="polite">{message}</p>
  </form>;
}

export function BriefingSection() {
  return <section className="ns-briefing" id="briefing" aria-labelledby="briefing-title">
    <div className="ns-shell ns-briefing-inner">
      <div>
        <p className="ns-eyebrow">The SozoRock Briefing</p>
        <h2 className="ns-stmt s44" id="briefing-title">Research, data and events, in your inbox.</h2>
      </div>
      <BriefingForm />
    </div>
  </section>;
}
