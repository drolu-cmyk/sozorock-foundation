import { useState } from "react";
import { Link } from "../router";

const ROLES = { "A university": "University or researcher", "A health system": "Licensed provider or health organization", "An employer": "Corporate organization", "A funder": "Foundation or funder", "Other": "Other" };

export function PartnerForm() {
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
    <label className="ns-check"><input name="consent" type="checkbox" value="yes" required /><span>The SozoRock Foundation may use this information to respond. See the <Link href="/privacy">Privacy Policy</Link>.</span></label>
    <div className="ns-form-actions"><button className="ns-btn ns-btn-primary" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending" : "Send"}</button></div>
    <p id="workforce-status" className={`ns-status ${status === "error" ? "error" : ""}`} role="status" aria-live="polite">{message}</p>
  </form>;
}

