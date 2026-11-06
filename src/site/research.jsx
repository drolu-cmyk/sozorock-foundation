import { useState } from "react";
import { economicOutlooks } from "../outlooks";
import { OutlookFeature } from "./outlook";
import { PublicationAccessPage } from "../PublicationAccessPage";
import { Link } from "../router";
import { Band, Btn, FormSection, Go, Head, Hero, More, Sec } from "./ui";

export const seriesInfo = {
  "hsa-v1-2026": {
    series: "Health Systems Assurance Series", year: "2026", program: null, tone: "",
    question: "What evidence should support trust in digital health systems?",
    who: "Health system leaders, security and compliance teams, regulators.",
    informs: "How to review obligations, controls, risks and exceptions.",
    why: "Health systems run on digital tools that people must be able to trust.",
    scope: "Analytical tools offered for testing and a research agenda. Not a validated standard, certification, audit or professional advice.",
  },
  "rrg-v1-2025": {
    series: "Rethinking Rural Governance Series", year: "2025", program: "Modernization and Resilience Program", tone: "alt",
    question: "How can rural institutions move from fragmented response to coordinated public action?",
    who: "County leaders, public agencies, regional planners.",
    informs: "Institutional roles, local capacity and coordination across public services.",
    why: "Rural institutions carry more responsibility with fewer people and tools.",
    scope: "A governance framework for testing. The Delaware County, New York State reference case does not establish adoption, validation or measured outcomes.",
  },
  "rebs-v1-2025": {
    series: "Rural Equity Blueprint Series", year: "2025", program: null, tone: "",
    question: "What makes health access work when care is nearby but still out of reach?",
    who: "Providers, libraries, community groups, funders.",
    informs: "Where health literacy, technology, workforce and local capacity meet access.",
    why: "Care can exist nearby and still be out of reach.",
    scope: "Models in development, not evidence of operating services or measured health outcomes. Implementation depends on partners, capacity and licensed providers.",
  },
};

export function ResearchPage({ publications }) {
  return <div className="ns ns-research">
    <Hero
      id="research-title"
      title="Findings institutions can use."
      lede="The SozoRock Outlook and three research series on health access, workforce capacity, governance and accountable services. Free to read."
      actions={<><Btn href={economicOutlooks[0].path}>Read the latest outlook</Btn><More href="#briefing">Get the Briefing</More></>}
      panelTone="ice"
      panel={<div className="ns-panel-covers"><Link href={economicOutlooks[0].path} aria-label={`${economicOutlooks[0].title}, report cover`} style={{ width: "46%", display: "block" }}><img src={economicOutlooks[0].coverVector || economicOutlooks[0].cover} alt="" width="612" height="792" decoding="async" fetchPriority="high" style={{ width: "100%", height: "auto", boxShadow: "0 18px 40px rgba(7,29,59,.2)" }} /></Link></div>}
    />
    <Sec labelledBy="latest-outlook"><div id="latest-outlook"><OutlookFeature outlook={economicOutlooks[0]} cover={false} primary={false} /></div></Sec>
    <Sec labelledBy="series-title">
      <Head id="series-title" eyebrow="The series" title="Three questions. Each series answers one, volume by volume." />
      <div style={{ marginTop: 72 }}>
        {publications.map((publication, index) => {
          const info = seriesInfo[publication.slug];
          const cover = <Link href={publication.path} className="cover" style={{ background: info.tone ? "var(--ice-2)" : "var(--ice)" }}><img src={publication.cover} alt={`${info.series}, ${publication.volume} cover`} width="600" height="776" loading={index ? "lazy" : "eager"} decoding="async" /></Link>;
          const text = <div className="ns-stack">
            <p><span className="ns-gap-label">{info.series}</span><br /><span className="ns-src">{publication.volume} · {info.year}{info.program ? ` · ${info.program}` : ` · ${publication.author}`}</span></p>
            <h2 className="ns-stmt s40"><Link href={publication.path} style={{ color: "inherit", textDecoration: "none" }}>{info.question}</Link></h2>
            <div className="facts"><div><b>Who it is for</b><p>{info.who}</p></div><div><b>What it informs</b><p>{info.informs}</p></div></div>
            <div className="ns-actions"><More href={publication.path}>Read {publication.volume}</More>{publication.doi ? <span className="ns-src">DOI {publication.doi}</span> : <span className="ns-src">ISBN {publication.isbn}</span>}</div>
          </div>;
          return <article key={publication.slug} className="ns-series">{index % 2 ? <>{text}{cover}</> : <>{cover}{text}</>}</article>;
        })}
      </div>
    </Sec>
    <Band tone="navy" title="Sponsor a volume or a roundtable." line="Partners fund the work; authors keep responsibility for findings." action={<Btn href="/partner" tone="light">Partner on research</Btn>} />
  </div>;
}

function CopyCitation({ text }) {
  const [status, setStatus] = useState("");
  return <><button className="ns-btn ns-btn-primary" type="button" onClick={async () => {
    try { await navigator.clipboard.writeText(text); setStatus("Citation copied."); } catch { setStatus("Select the citation text above to copy it."); }
  }}>Copy citation</button><span role="status" className="ns-src" aria-live="polite">{status}</span></>;
}

export function PublicationPage({ publication }) {
  const info = seriesInfo[publication.slug];
  const details = [["Title", publication.bibliographicTitle || publication.title], ["Series", info.series], ["Volume", `${publication.volume} · ${info.year}`], ["Author", publication.author]];
  if (publication.contributor) details.push(["Contributor", publication.contributor]);
  details.push(["Publisher", publication.publisher || "The SozoRock Foundation, Inc."]);
  if (info.program) details.push(["Program", info.program]);
  if (publication.isbn) details.push(["ISBN", publication.isbn]);
  if (publication.doi) details.push(["DOI", <a key="doi" href={`https://doi.org/${publication.doi}`} rel="noopener">https://doi.org/{publication.doi}</a>]);
  return <div className="ns ns-publication">
    <div className="ns-shell">
      <section className="ns-hero ns-hero-pub" aria-labelledby="pub-title">
        <div>
          <Link className="ns-crumb" href="/publications" style={{ display: "inline-flex", marginBottom: 20, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>Research</Link>
          <p className="ns-gap-label">{info.series} · {publication.volume}</p>
          <h1 className="ns-h1 ns-pub-title" id="pub-title" style={{ marginTop: 14 }}>{publication.bibliographicTitle || publication.title}</h1>
          <p className="ns-src" style={{ marginTop: 16, fontSize: 15 }}>{info.year} · {publication.author}{publication.contributor ? ` · Contributor: ${publication.contributor}` : ""}</p>
          <div className="ns-abstract">
            <h2 className="ns-eyebrow">Abstract</h2>
            <p className="ns-body">{publication.abstract || publication.description}</p>
          </div>
          <div className="ns-actions" style={{ marginTop: 32 }}><Btn href={publication.accessPath}>Continue to free PDF</Btn><More href="#citation">Copy citation</More></div>
          <p className="ns-src" style={{ marginTop: 16 }}>Email verification is required to open the PDF.</p>
        </div>
        <div className="ns-panel p-ice ns-publication-cover" style={{ aspectRatio: "4 / 5", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={publication.cover} alt={`${info.series}, ${publication.volume} cover`} width="600" height="776" decoding="async" fetchPriority="high" style={{ width: "62%", height: "auto", boxShadow: "0 24px 52px rgba(7,29,59,.28)" }} />
        </div>
      </section>
    </div>
    <Sec tone="ice" labelledBy="about-pub-title">
      <h2 className="ns-stmt s36" id="about-pub-title">Why it exists, who it serves and its limits</h2>
      <ul className="ns-grid g4" style={{ marginTop: 40 }}>
        {[["Why it exists", info.why], ["Who can use it", info.who], ["What it informs", info.informs], ["Scope", info.scope]].map(([label, text]) => <li key={label} className="ns-tile on-white" style={{ justifyContent: "flex-start", minHeight: 220 }}><span className="lab">{label}</span><span className="ns-body" style={{ fontSize: 16 }}>{text}</span></li>)}
      </ul>
    </Sec>
    <Sec labelledBy="details-title">
      <div className="ns-two top">
        <div>
          <h2 className="ns-eyebrow" id="details-title">Publication details</h2>
          <dl className="ns-dl">{details.map(([term, value]) => [<dt key={`${term}-t`}>{term}</dt>, <dd key={`${term}-d`} style={{ margin: 0 }}>{value}</dd>])}</dl>
        </div>
        <div className="ns-cite" id="citation">
          <h2 className="ns-eyebrow">Citation</h2>
          <p className="citation">{publication.citation}</p>
          <div className="ns-actions"><CopyCitation text={publication.citation} />{publication.doi && <More href={`https://doi.org/${publication.doi}`}>Open DOI</More>}</div>
        </div>
      </div>
    </Sec>
    <Band tone="ice" title="Read the full volume, free." line="Verify your email and we will send your access link." action={<Btn href={publication.accessPath}>Continue to free PDF</Btn>} />
  </div>;
}

export function AccessPage({ publication }) {
  const info = seriesInfo[publication.slug];
  return <div className="ns ns-access">
    <div className="ns-shell">
      <section className="ns-hero" aria-labelledby="access-title" style={{ paddingBottom: 48 }}>
        <div>
          <Link className="ns-crumb" href={publication.path} style={{ display: "inline-flex", marginBottom: 20, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>{info.series}</Link>
          <h1 className="ns-h1" id="access-title">Read {publication.bibliographicTitle || publication.title}</h1>
          <p className="ns-lede" style={{ marginTop: 24 }}>Free PDF. Verify your email to open the publication.</p>
        </div>
        <div className="ns-panel p-ice" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><img src={publication.cover} alt="" width="600" height="776" decoding="async" style={{ width: "34%", height: "auto", boxShadow: "0 16px 36px rgba(7,29,59,.24)" }} /></div>
      </section>
    </div>
    <FormSection id="access-form" eyebrow="Your copy, by email" title="We send a verification link to open the PDF." lede="Enter your name and email. Publication updates are optional. No payment is required.">
      <PublicationAccessPage embedded publication={publication} />
    </FormSection>
  </div>;
}
