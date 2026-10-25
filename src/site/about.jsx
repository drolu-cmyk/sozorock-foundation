import { useState } from "react";
import { EngagementForm } from "../components";
import { Link } from "../router";
import { leaders } from "../siteData";
import { Band, Btn, Fig, FormSection, Go, Head, Hero, More, Sec, Steps, Tile } from "./ui";
import { UpcomingTiles } from "./home";

const ROLES = ["Individual or family", "Community organization", "Licensed provider or health organization", "County, state, or public agency", "University or researcher", "Foundation or funder", "Corporate organization", "Other"];
const TOPICS = ["Rural health transformation, Capital Region", "Rural health workforce and care delivery", "Who Decides? Forum on AI, learning and work", "All of these"];

function InterestForm() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const organization = String(data.get("eventOrganization") || "").trim() || "Individual participant";
    const payload = {
      name: String(data.get("eventName") || "").trim(),
      email: String(data.get("eventEmail") || "").trim(),
      organization,
      inquiryType: "Institutional or public-sector inquiry",
      role: String(data.get("eventRole") || "Other"),
      stateOrCounty: String(data.get("eventLocation") || "").trim(),
      message: `Event interest: ${String(data.get("eventTopic") || "All of these")}\n\nOrganization or affiliation: ${organization}\n\nPlease tell me when a date and place are confirmed.`,
      website: String(data.get("eventWebsite") || ""),
      consent: data.get("eventConsent") === "yes",
    };
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "We could not register your interest right now.");
      form.reset();
      setStatus("sent");
      setMessage("Thank you. We will email you when a date and place are confirmed.");
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "We could not register your interest right now. Email contact@sozorockfoundation.org.");
    }
  };
  return <form className="ns-form" onSubmit={submit} aria-describedby="event-status">
    <label className="ns-field">Full name<input name="eventName" type="text" autoComplete="name" required minLength={3} /></label>
    <label className="ns-field">Email address<input name="eventEmail" type="email" autoComplete="email" required /></label>
    <label className="ns-field">Organization (optional)<input name="eventOrganization" type="text" autoComplete="organization" /></label>
    <label className="ns-field">You are<select name="eventRole" required defaultValue=""><option value="" disabled>Select one</option>{ROLES.map((role) => <option key={role}>{role}</option>)}</select></label>
    <label className="ns-field">Interested in<select name="eventTopic" required defaultValue=""><option value="" disabled>Select one</option>{TOPICS.map((topic) => <option key={topic}>{topic}</option>)}</select></label>
    <label className="ns-field">City, state or region<input name="eventLocation" type="text" autoComplete="address-level2" required minLength={2} /></label>
    <label className="ns-honeypot" aria-hidden="true">Website<input name="eventWebsite" type="text" tabIndex={-1} autoComplete="off" /></label>
    <label className="ns-check"><input name="eventConsent" type="checkbox" value="yes" required /><span>The SozoRock Foundation may use this information to respond. See the <Link href="/privacy">Privacy Policy</Link>.</span></label>
    <div className="ns-form-actions"><button className="ns-btn ns-btn-primary" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending" : "Register interest"}</button></div>
    <p id="event-status" className={`ns-status ${status === "error" ? "error" : ""}`} role="status" aria-live="polite">{message}</p>
  </form>;
}

export function EventsPage() {
  return <div className="ns ns-events">
    <Hero
      id="events-title"
      title="Join the conversation."
      lede="Firesides, roundtables and public forums where the people closest to a problem help shape the response."
      actions={<><Btn href="#register">Register interest</Btn><More href="/partner">Host an event</More></>}
      panelLabel="Three formats: Fireside, Working Roundtable and Who Decides? Forum. Twelve participants at our 2025 Western New York roundtable."
      panel={<div className="ns-panel-figures"><div><b>3</b><span>formats: Fireside, Working Roundtable, Who Decides? Forum</span></div><div><b>12</b><span>participants at our 2025 Western New York roundtable</span></div></div>}
    />
    <Sec labelledBy="upcoming-title">
      <Head id="upcoming-title" eyebrow="Upcoming" title="Dates are announced as they are confirmed." />
      <UpcomingTiles action="#register" />
    </Sec>
    <Sec tone="ice" labelledBy="formats-title">
      <Head id="formats-title" eyebrow="How our events work" title="Every conversation ends in something people can use." />
      <Steps items={[["Fireside", "Frames the choices with leaders and residents."], ["Working Roundtable", "Tests what those choices mean in practice."], ["Who Decides? Forum", "Gives the public a voice on AI."], ["Local Outcomes Brief", "Publishes what we heard and what should change."]]} />
    </Sec>
    <Sec tone="navy" labelledBy="past-title">
      <div className="ns-two">
        <div>
          <p className="ns-eyebrow">Past event</p>
          <h2 className="ns-stmt s44" id="past-title">Western New York preplanning roundtable</h2>
          <p className="ns-body" style={{ marginTop: 14 }}>September 22, 2025 · Western New York, New York State</p>
          <dl style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 170px))", gap: 32, marginTop: 40 }}>
            {[["12", "participants"], ["2", "county public health jurisdictions"], ["2", "universities"]].map(([value, label]) => <div key={label}><dt className="ns-num n72" style={{ color: "#fff" }}>{value}</dt><dd style={{ marginTop: 8, fontSize: 16, color: "var(--ice-2)" }}>{label}</dd></div>)}
          </dl>
          <div className="ns-actions" style={{ marginTop: 40 }}><Btn href="/publication/rebs-v1-2025" tone="light">Read the findings</Btn></div>
        </div>
        <figure style={{ background: "var(--royal)", borderRadius: 4, padding: 56 }}>
          <div className="ns-num n96" style={{ color: "#fff" }}>12,000+</div>
          <p style={{ marginTop: 16, fontSize: 19, lineHeight: 1.45 }}>residents per primary care clinician, reported by a regional public health director.</p>
          <figcaption className="ns-src" style={{ marginTop: 14 }}>Participant reported context, not an independently verified estimate. Documented in REBS, Volume 1. Participation does not imply endorsement.</figcaption>
        </figure>
      </div>
    </Sec>
    <FormSection id="register" eyebrow="Register interest" title="Be first to hear when dates are set." lede="Choose the conversations you care about. We will email you when a date and place are confirmed.">
      <InterestForm />
    </FormSection>
    <Band title="Host a Fireside, Roundtable or Forum." line="Bring a venue, a question or a community. We bring the format and publish what we hear." action={<Btn href="/partner" tone="navy">Host an event</Btn>} />
  </div>;
}

export function AboutPage() {
  return <div className="ns ns-about">
    <Hero
      id="about-title"
      title="We close three gaps: access, capacity and trust."
      lede="The SozoRock Foundation, Inc. is a New York 501(c)(3) public charity. We connect public interest research with practical programs in health access, workforce capacity and trusted AI."
      actions={<><Btn href="/platforms">Explore our work</Btn><More href="/leadership">Meet our leadership</More></>}
      panelTone="royal"
      panelLabel="Three gaps we work to close. Twelve learners across two countries. Three free research series."
      panel={<div className="ns-panel-figures"><div><b>3</b><span>gaps we work to close: access, capacity and trust</span></div><div><b>12</b><span>learners in applied programs across two countries</span></div><div><b>3</b><span>research series, free to read</span></div></div>}
    />
    <Sec labelledBy="story-title">
      <Head id="story-title" eyebrow="Our story" title="One loop: listen, study, build, prove." />
      <div className="ns-grid g3 wide">
        {[["The problem", "Care, skills and trust are not keeping up with what communities and health systems need."], ["Our response", "Programs that open access to care, build the people who run and protect systems, and give the public a say in AI."], ["The proof", "Results published in the open, with sources and limits, so others can test and scale what works."]].map(([label, text]) => <div key={label}><p className="ns-gap-label">{label}</p><p style={{ marginTop: 14, fontSize: 24, lineHeight: 1.3, letterSpacing: "-0.015em" }}>{text}</p></div>)}
      </div>
    </Sec>
    <Sec tone="ice" labelledBy="leaders-title">
      <Head id="leaders-title" eyebrow="Leadership" title="The people responsible for our work." link={["Full profiles", "/leadership"]} />
      <ul className="ns-grid g4" style={{ marginTop: 48 }}>
        {leaders.map((leader) => <li key={leader.name}><Go href="/leadership" className="ns-person"><img src={leader.image} alt={leader.name} width="600" height="600" loading="lazy" decoding="async" /><span className="meta"><b>{leader.name}</b><span>{leader.title}</span></span></Go></li>)}
      </ul>
    </Sec>
    <Sec labelledBy="standards-title">
      <Head id="standards-title" eyebrow="Our standards" title="How we earn trust in our own work." link={["Read our standards", "/standards"]} />
      <Steps items={[["Independence", "Funding never buys a conclusion."], ["Evidence", "Claims link to sources and limits."], ["Corrections", "We fix errors in the open."], ["Clear roles", "Clinical decisions stay with providers; academic ones with universities."]]} />
    </Sec>
    <Sec tone="ice" labelledBy="collab-title" className="ns-collab-sec">
      <p className="ns-collab" id="collab-title">In collaboration with</p>
      <p className="ns-collab-list">Capella University · Athabasca University · Purcell Integrative Osteopathic Care</p>
    </Sec>
    <Band top title="Work with us." line="Partner on a program, support the work or get in touch." action={<Btn href="/partner" tone="navy">Partner with us</Btn>} />
  </div>;
}

export function LeadershipPage() {
  return <div className="ns ns-leadership">
    <div className="ns-shell" style={{ paddingBlock: "72px 56px" }}>
      <Link className="ns-crumb" href="/about" style={{ display: "inline-flex", marginBottom: 20, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>About</Link>
      <h1 className="ns-h1">Leadership</h1>
      <p className="ns-lede" style={{ marginTop: 20, maxWidth: 640 }}>The people responsible for SozoRock’s work in health access, workforce capacity and trusted AI.</p>
    </div>
    <div className="ns-shell" style={{ paddingBottom: 112 }}>
      {leaders.map((leader, index) => <article key={leader.name} className="ns-profile">
        <img src={leader.image} alt={leader.name} width="720" height="840" loading={index > 1 ? "lazy" : "eager"} decoding="async" />
        <div><h2 className="ns-stmt s40">{leader.name}</h2><p className="role">{leader.title}</p><p className="ns-body" style={{ marginTop: 18 }}>{leader.bio}</p></div>
      </article>)}
    </div>
    <Band title="Work with our team." line="Partner on a program or get in touch." action={<Btn href="/partner" tone="navy">Partner with us</Btn>} />
  </div>;
}

export function PartnerPage() {
  return <div className="ns ns-partner">
    <Hero
      id="partner-title"
      title="Build with us."
      lede="Bring local knowledge, clinical expertise, technology or learning to a shared project. We agree roles first and publish what we learn."
      actions={<><Btn href="#inquiry">Start a conversation</Btn><More href="/platforms">See our work</More></>}
      panelTone="royal"
      panelLabel="Two universities in two countries, three institutions named in our current work, twelve participants at our first roundtable."
      panel={<div className="ns-panel-figures"><div><b>2</b><span>universities in two countries</span></div><div><b>3</b><span>institutions named in our current work</span></div><div><b>12</b><span>participants at our first roundtable</span></div></div>}
    />
    <Sec labelledBy="fit-title">
      <Head id="fit-title" eyebrow="Who we partner with" title="Find where you fit." />
      <ul className="ns-grid g3">
        <li><Tile href="/workforce" label="Capacity" title="Universities and employers" sub="Host a cohort or share a cloud, security or AI project." className="tall" /></li>
        <li><Tile href="/platforms/health" label="Access" title="Licensed providers" sub="Reach people who face cost, distance or technology barriers to care." className="tall" /></li>
        <li><Tile href="/platforms/health" label="Access" title="Libraries and community groups" sub="A Library, Community or Home Health Equity Hub, or Health Access Day." className="tall" /></li>
        <li><Tile href="/platforms/health" label="Access" title="Counties and public agencies" sub="Free county data for health assessments, funding and workforce plans." className="tall" /></li>
        <li><Tile href="/ai-society" label="Trust" title="Event and forum hosts" sub="A Fireside, Working Roundtable or Who Decides? Forum." className="tall" /></li>
        <li><Tile href="#inquiry" label="Any program" title="Technology partners" sub="Devices, connectivity, cloud resources or expertise for a shared project." className="tall" /></li>
      </ul>
    </Sec>
    <Sec tone="ice" labelledBy="how-title">
      <Head id="how-title" eyebrow="How it works" title="Clear roles from the first conversation." />
      <div className="ns-grid g4 wide">
        {[["Talk", "Tell us the problem and what you can bring."], ["Agree", "Roles, scope, data and responsibilities in writing."], ["Deliver", "We run the work together."], ["Publish", "Results in the open, with your consent."]].map(([name, line]) => <div key={name}><p style={{ fontSize: 32, letterSpacing: "-0.02em" }}>{name}</p><p className="ns-body" style={{ marginTop: 10 }}>{line}</p></div>)}
      </div>
    </Sec>
    <FormSection id="inquiry" eyebrow="Start a conversation" title="Tell us what you would like to build." lede="We use your details only to respond.">
      <EngagementForm kind="Partner" />
    </FormSection>
  </div>;
}

export function SupportPage() {
  return <div className="ns ns-support">
    <Hero
      id="support-title"
      title="Fund a year of primary care."
      lede="Sponsor care for people with financial need and a chronic condition, or support workforce learning, research and public forums on AI."
      actions={<><Btn href="#inquiry">Discuss support</Btn><More href="/platforms/health#primary-care-access">See the program</More></>}
      panelLabel="$108,000 funds the first cohort: a year of primary care for up to 25 New Yorkers, from January 2027."
      panel={<div className="ns-panel-stat"><b>$108,000</b><p>funds the first cohort: a year of primary care for up to 25 New Yorkers, from January 2027.</p></div>}
    />
    <Sec labelledBy="gift-title">
      <div className="ns-two top">
        <div>
          <p className="ns-eyebrow">What a gift does</p>
          <h2 className="ns-stmt" id="gift-title">About $4,320 funds one person for a full year.</h2>
          <ul className="ns-bullets" style={{ marginTop: 28 }}>
            {["Direct primary care membership with Dr. Michael Purcell and Purcell Integrative Osteopathic Care", "Ongoing telehealth", "Help with transportation", "Health access education", "Coordination and reporting"].map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="ns-src" style={{ marginTop: 24 }}>Clinical care remains with the licensed provider. Membership is not health insurance.</p>
        </div>
        <div>
          <p className="ns-eyebrow">Sponsorship levels</p>
          <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "36px 32px", marginTop: 24 }}>
            {[["$5,000", "Community"], ["$10,000", "Access"], ["$25,000", "Principal"], ["$50,000", "Lead"]].map(([value, level]) => <div key={level}><dt className="ns-num n44 navy">{value}</dt><dd className="ns-src" style={{ marginTop: 6, fontSize: 15 }}>{level}</dd></div>)}
          </dl>
          <p className="ns-body" style={{ marginTop: 28 }}>Other amounts are welcome.</p>
        </div>
      </div>
    </Sec>
    <Sec tone="ice" labelledBy="account-title">
      <Head id="account-title" eyebrow="Accountability" title="You see the results. You never steer the care." />
      <ul className="ns-grid g4">
        {[["Funds first", "Funds are confirmed before anyone enrolls."], ["Reports", "At months 3, 6, 9 and 12."], ["No selection", "Sponsors do not select participants or influence clinical care."], ["Optional renewal", "Renew after the first year if you choose."]].map(([name, line]) => <li key={name} className="ns-tile on-white" style={{ minHeight: 180, justifyContent: "flex-start" }}><span className="ttl" style={{ fontSize: 22 }}>{name}</span><span className="ns-body" style={{ fontSize: 15 }}>{line}</span></li>)}
      </ul>
    </Sec>
    <Sec labelledBy="other-title">
      <Head id="other-title" eyebrow="Other ways to give" title="Support the work behind the work." />
      <ul className="ns-grid g3">
        <li><Tile href="/workforce" label="Capacity" title="Workforce Capacity" sub="Mentored, hands on learning in cloud, security and AI." /></li>
        <li><Tile href="/ai-society" label="Trust" title="AI & Society" sub="Participant compensation, accessible facilitation and publication." /></li>
        <li><Tile href="/publications" label="Research" title="A research volume" sub="Independent research and free county data." /></li>
      </ul>
    </Sec>
    <FormSection id="inquiry" eyebrow="Discuss support" title="Tell us how you would like to give." lede="This is an inquiry, not a payment form. The SozoRock Foundation, Inc. is a 501(c)(3) public charity, EIN 39-4736725. Contributions are tax deductible as allowed by law.">
      <EngagementForm kind="Support" />
    </FormSection>
  </div>;
}

export function ContactPage() {
  return <div className="ns ns-contact">
    <div className="ns-shell">
      <section className="ns-hero" aria-labelledby="contact-title" style={{ alignItems: "start" }}>
        <div>
          <h1 className="ns-h1" id="contact-title">Contact us</h1>
          <p className="ns-lede" style={{ marginTop: 20 }}>Questions about our work, research or events. We read every message.</p>
          <p className="ns-src" style={{ marginTop: 40, fontSize: 14 }}>Email</p>
          <a href="mailto:contact@sozorockfoundation.org" style={{ display: "inline-block", marginTop: 6, fontSize: 22, textDecoration: "none" }}>contact@sozorockfoundation.org</a>
          <ul style={{ display: "grid", gap: 16, marginTop: 48 }}>
            <li><Tile href="/partner" label="Partner" title="Build a project with us" className="short" /></li>
            <li><Tile href="/support" label="Support" title="Fund a year of primary care" className="short" /></li>
          </ul>
        </div>
        <div id="inquiry"><EngagementForm kind="Contact" /></div>
      </section>
    </div>
  </div>;
}

export function LegalPage({ title, lede, effective = "September 22, 2026", sections, links = [] }) {
  return <div className="ns ns-legalpage">
    <div className="ns-legal-head"><div className="ns-shell"><h1 className="ns-h1">{title}</h1><p className="ns-lede" style={{ marginTop: 16 }}>{lede} Effective {effective}.</p></div></div>
    <div className="ns-shell ns-legal-body">
      <nav aria-label="Contents">{sections.map(([heading], index) => <a key={heading} href={`#s${index}`}>{heading}</a>)}</nav>
      <div>
        {sections.map(([heading, text], index) => <article key={heading} id={`s${index}`}><h2 className="ns-stmt s28">{heading}</h2><p className="ns-body">{text}</p></article>)}
        <div className="ns-actions" style={{ marginTop: 48 }}>
          {links.map(([label, href]) => <More key={href} href={href}>{label}</More>)}
          <a className="ns-more" href="mailto:contact@sozorockfoundation.org">contact@sozorockfoundation.org</a>
        </div>
      </div>
    </div>
  </div>;
}

export const legalPages = {
  "/standards": { title: "Standards", lede: "How we publish, disclose support and correct errors.", sections: [
    ["Independence", "The Foundation and named authors are responsible for research conclusions. Funding does not purchase a conclusion."],
    ["Evidence", "We identify models in development, participant reports, observations, estimates and measured outcomes. Claims link to their sources and limitations."],
    ["Corrections", "Report an error to contact@sozorockfoundation.org with the page or publication and supporting source. Material corrections explain what changed and preserve the publication record."],
    ["Funding", "Relevant funding, sponsorship and substantial in kind support are disclosed with the work. Participation and support do not imply endorsement."],
    ["Authorship and AI", "We identify authors and contributors accurately. AI may assist research, design, coding and workflow; human reviewers remain responsible for the published work."],
    ["Rights and access", "Citations do not grant reproduction rights. Check each publication’s notice. Contact us about permissions or accessible formats."],
  ] },
  "/privacy": { title: "Privacy Policy", lede: "How we handle information submitted through this website.", links: [["SozoRock Health privacy notice", "https://health.sozorockfoundation.org/privacy"]], sections: [
    ["Scope", "This notice covers the parent website and its forms. Platform services may have additional notices. Publication and inquiry delivery use SozoRock Health services; read its privacy notice for those services."],
    ["Information collected", "Forms collect the details you submit, including name, email, affiliation, interests and message. Do not send sensitive medical, student, employee, financial, legal or account information."],
    ["Use and service providers", "We use submissions to respond, provide publications, understand participation interest, protect services and keep related records. Hosting, security and email providers may process information for these purposes."],
    ["Retention", "We keep information as reasonably needed for its purpose, security, recordkeeping and applicable obligations. Periods vary by form and service."],
    ["Your choices", "We do not sell personal information or use this website for behavioral advertising. Ask to review, correct or delete your submissions. Some records may need to be retained for security or legal obligations. Publication updates are optional; consent can be withdrawn."],
    ["Security", "We use administrative, technical and operational safeguards. No website, email or storage system is completely secure. Do not use public forms for urgent or sensitive matters."],
    ["Contact and changes", "Email contact@sozorockfoundation.org with privacy questions. We update this notice when services or practices change and publish the effective date."],
  ] },
  "/terms": { title: "Terms of Use", lede: "Conditions for using this website and its materials.", sections: [
    ["Information and advice", "This site provides general information, not medical, legal, tax, investment, cybersecurity, certification or emergency advice. Use does not create a clinical, professional, fiduciary, auditor or client relationship."],
    ["Use and copyright", "Use the site lawfully. You may cite or link to public pages. Publication specific copyright and permissions govern reproduction and reuse."],
    ["Prohibited activity", "Do not disrupt the service, bypass access controls, submit malicious or unlawful content, unlawfully collect data or imply Foundation affiliation without permission."],
    ["Forms", "Provide accurate information. Do not submit sensitive medical, student, employee, financial, legal or account details. Submitting a form does not establish a partnership, funding agreement or participation commitment. Publication access follows its stated verification process."],
    ["External services", "Linked websites and Foundation platforms may have separate terms, privacy notices and service conditions."],
    ["Availability and corrections", "We aim for accurate information and available services, but do not guarantee completeness, currency or uninterrupted access. We may correct, update or remove material while preserving appropriate publication records."],
    ["Contact", "For rights or terms questions, email contact@sozorockfoundation.org. Publication notices identify ownership and third party rights."],
  ] },
  "/accessibility": { title: "Accessibility", lede: "Request help accessing our website, publications or activities.", sections: [
    ["Our goal", "We aim to meet WCAG 2.2 Level AA. This is a continuing design and testing goal, not a certification of every page or document."],
    ["Website access", "Our approach includes keyboard navigation, visible focus, readable contrast, form labels, meaningful headings, alternative text and reduced motion support."],
    ["Documents and other services", "Some historical documents and third party services may have limitations. Contact us for an accessible format or accommodation."],
    ["Report a barrier", "Email contact@sozorockfoundation.org. Include the page or document, the barrier and the format or accommodation you need. Device or assistive technology details can help but are optional. We will review the request and respond with available options."],
    ["Review", "We review accessibility as services change and prioritize barriers affecting core information and access."],
  ] },
  "/nondiscrimination": { title: "Nondiscrimination", lede: "Equal access and respectful participation.", sections: [
    ["Equal access", "The Foundation does not discriminate in programs, services, partnerships or public resources on the basis of race, color, national origin, ancestry, ethnicity, religion, sex, pregnancy, sexual orientation, gender identity or expression, age, disability, veteran status or other status protected by applicable law."],
    ["Accommodations", "We seek to provide reasonable accommodations and language access where practicable. Contact us before an activity to discuss what would help you participate."],
    ["Partners and venues", "Participating organizations and venues are expected to support lawful, respectful access within their roles. Participation does not transfer responsibilities or imply endorsement."],
    ["Concerns", "Email contact@sozorockfoundation.org with enough information for us to review a concern. Retaliation for raising a good faith concern is not acceptable."],
  ] },
};
