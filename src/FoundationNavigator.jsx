import { useId, useState } from "react";
import { Link } from "./router";

const prompts = [
  "Which platform fits a public systems project?",
  "Where can I find Foundation publications?",
  "How can my organization partner with SozoRock?",
];

export function FoundationNavigator() {
  const inputId = useId();
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const ask = async (event) => {
    event.preventDefault();
    const value = question.trim();
    if (value.length < 3) {
      setError("Enter a short question about the Foundation or this website.");
      return;
    }
    setStatus("asking");
    setResult(null);
    setError("");
    try {
      const response = await fetch("/api/navigator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: value }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "The website guide is temporarily unavailable.");
      setResult(body);
      setStatus("answered");
    } catch (caught) {
      setStatus("error");
      setError(caught instanceof Error ? caught.message : "The website guide is temporarily unavailable.");
    }
  };

  return (
    <section className="navigator-section" aria-labelledby="navigator-title">
      <div className="shell navigator-layout">
        <div className="navigator-intro">
          <p className="eyebrow">Website guide</p>
          <h2 id="navigator-title">Ask SozoRock.</h2>
          <p>Find the right platform, publication, event, partnership route, or way to support the work.</p>
        </div>
        <div className="navigator-panel">
          <form onSubmit={ask}>
            <label htmlFor={inputId}>What are you looking for?</label>
            <div className="navigator-input-row">
              <input
                id={inputId}
                value={question}
                onChange={(event) => setQuestion(event.target.value.slice(0, 600))}
                placeholder="Ask about the Foundation or this website"
                autoComplete="off"
                minLength="3"
                maxLength="600"
                required
              />
              <button className="button button-primary" type="submit" disabled={status === "asking"}>
                {status === "asking" ? "Finding…" : "Find a route"}
              </button>
            </div>
            <p className="navigator-privacy">Do not include personal, patient, account, or other sensitive information.</p>
          </form>
          {status === "idle" && (
            <div className="navigator-prompts" aria-label="Example questions">
              {prompts.map((prompt) => (
                <button type="button" key={prompt} onClick={() => setQuestion(prompt)}>{prompt}</button>
              ))}
            </div>
          )}
          <div className="navigator-status" role="status" aria-live="polite" aria-busy={status === "asking"}>
            {status === "asking" && <p>Reviewing the Foundation’s public information…</p>}
            {error && <p className="is-error">{error}</p>}
            {result && (
              <div className="navigator-answer">
                <p>{result.answer}</p>
                {result.links?.length > 0 && (
                  <div className="navigator-links">
                    {result.links.map((link) => <Link href={link.href} className="text-link" key={link.href}>{link.label}</Link>)}
                  </div>
                )}
                {result.notice && <p className="navigator-notice">{result.notice}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
