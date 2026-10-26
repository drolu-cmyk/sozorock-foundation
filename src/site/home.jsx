import { useEffect, useRef, useState } from "react";
import { Link } from "../router";
import { AI_LAB, HEALTH, Band, Btn, Fig, Go, Head, Hero, Meter, More, Sec, Segs, Tile } from "./ui";

export const papers = [
  { series: "Health Systems Assurance Series", meta: "Volume 1 · 2026", line: "What evidence should support trust in digital health systems?", href: "/publication/hsa-v1-2026", img: "/media/hsa-cover.webp", width: 1600, height: 2071 },
  { series: "Rethinking Rural Governance Series", meta: "Volume 1 · 2025 · Modernization and Resilience Program", line: "From fragmented response to coordinated public action.", href: "/publication/rrg-v1-2025", img: "/media/rrg-cover.webp", width: 1100, height: 1424, alt: true },
  { series: "Rural Equity Blueprint Series", meta: "Volume 1 · 2025", line: "A practical framework for local health access.", href: "/publication/rebs-v1-2025", img: "/media/rebs-cover.webp", width: 1100, height: 1407 },
];

export const upcoming = [
  { format: "Fireside", title: "Rural health transformation in the Capital Region", where: "Albany and surrounding counties, New York State" },
  { format: "Working Roundtable", title: "Rural health workforce and care delivery", where: "Warren and Washington counties, New York State" },
  { format: "Who Decides? Forum", title: "AI, learning and work", where: "Albany, New York State" },
];

export function Papers() {
  return <ul className="ns-grid g3" style={{ gap: 24 }}>
    {papers.map((paper) => <li key={paper.href}><Link className="ns-paper" href={paper.href}>
      <span className={`cover ${paper.alt ? "alt" : ""}`}><img src={paper.img} alt={`${paper.series}, Volume 1 cover`} width={paper.width} height={paper.height} loading="lazy" decoding="async" /></span>
      <span className="series">{paper.series} · {paper.meta}</span>
      <span className="line">{paper.line}</span>
    </Link></li>)}
  </ul>;
}

export function UpcomingTiles({ action = "#register" }) {
  return <ul className="ns-grid g3" style={{ gap: 24 }}>
    {upcoming.map((event) => <li key={event.title}><Go href={action} className="ns-tile tall">
      <span className="lab">{event.format}</span>
      <span><span className="ttl">{event.title}</span><span className="sub">{event.where}</span></span>
      <span className="foot"><span className="ns-src">Date to be announced</span><span className="ns-go" aria-hidden="true">→</span></span>
    </Go></li>)}
  </ul>;
}

function Dots({ count, columns, size, color }) {
  return <div className="ns-dots" style={{ gridTemplateColumns: `repeat(${columns}, ${size}px)` }} aria-hidden="true">
    {Array.from({ length: count }, (_, index) => <i key={index} style={{ width: size, height: size, background: typeof color === "function" ? color(index) : color }} />)}
  </div>;
}

function Table() {
  return <div className="ns-table" aria-hidden="true">
    <span className="top" />
    {Array.from({ length: 12 }, (_, index) => {
      const angle = (index / 12) * 2 * Math.PI;
      return <i key={index} style={{ left: `${70 + Math.cos(angle) * 58}px`, top: `${70 + Math.sin(angle) * 58}px` }} />;
    })}
  </div>;
}

const loop = [
  ["Listen", "Firesides, roundtables and forums with the people closest to the problem."],
  ["Study", "Research series and county data that frame the choices."],
  ["Build", "Programs for access, workforce capacity and trusted AI."],
  ["Prove", "Results published in the open, then scaled."],
];

/* Hero film: plays muted in the panel; "Watch with sound" opens it full screen from the start. */
function HeroFilm() {
  const ref = useRef(null);
  const [still, setStill] = useState(false);
  useEffect(() => {
    const v = ref.current; if (!v) return;
    let reduce = false;
    try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { reduce = false; }
    if (reduce) { setStill(true); v.removeAttribute("autoplay"); v.pause(); return; }
    const p = v.play(); if (p && p.catch) p.catch(() => setStill(true));
  }, []);
  const watch = async () => {
    const v = ref.current; if (!v) return;
    try { v.currentTime = 0; } catch { /* not seekable yet */ }
    v.muted = false; v.loop = false; v.controls = true; setStill(false);
    try { if (v.requestFullscreen) await v.requestFullscreen(); else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen(); } catch { /* stays inline with controls */ }
    try { await v.play(); } catch { /* user can press play */ }
  };
  return <>
    <video ref={ref} className="ns-film-video" muted playsInline autoPlay loop preload="metadata" poster="/media/foundation-film-poster.jpg"
      aria-label="The SozoRock Foundation in 60 seconds: access to care, capacity for health systems and public trust in AI, shown on a model of the United States">
      <source src="/media/foundation-film-720.mp4" type="video/mp4" media="(max-width: 900px)" />
      <source src="/media/foundation-film-1080.mp4" type="video/mp4" />
    </video>
    <button type="button" className="ns-film-play" onClick={watch}><span aria-hidden="true">▶</span>{still ? "Play the film" : "Watch with sound"}<span className="ns-film-len">1 min</span></button>
  </>;
}

export function HomePage() {
  return <div className="ns ns-home">
    <Hero
      id="home-title"
      title={<>Healthier communities. Stronger systems. <span style={{ color: "var(--cobalt)" }}>A say in what’s next.</span></>}
      lede="We open doors to primary care, build the people who run and protect health systems, and give communities a voice on AI."
      actions={<><Btn href="/platforms">Explore our work</Btn><More href="/partner">Partner with us</More></>}
      panel={<HeroFilm />}
      panelClass="ns-film"
      decorative={false}
    />
    <div className="ns-shell">
      <Link className="ns-upcoming" href="/events">
        <span><span className="ns-gap-label">Upcoming</span><span>Rural health conversations in the Capital Region and in Warren and Washington counties, New York State</span></span>
        <span className="ns-more">Register interest&nbsp;→</span>
      </Link>
    </div>

    <Sec labelledBy="why-title">
      <Head id="why-title" eyebrow="Why it matters" title="Demand for care, skills and trusted AI is outpacing supply." />
      <div className="ns-grid g3 wide">
        <Fig value="1 in 4" label="More than 1 in 4 New York State residents live in primary care shortage areas." viz={<Segs on={1} of={4} />} line="New Yorkers live where primary care is short." source="5.29M of 19.9M residents. HRSA, Sep 2026; Census ACS 2024." />
        <Fig value="59%" label="59 percent of security teams report skills gaps." viz={<Meter pct={59} />} line="of security teams lack the skills they need, as rules for hospitals tighten." source="ISC2, Dec 2025. 10 NYCRR 405.46, Oct 2025." />
        <Fig value={<>53<small>%</small> <span className="ns-soft">26<small>%</small></span></>} label="53 percent of U.S. employees use AI at work; 26 percent say their employer has a clear AI plan." viz={<div style={{ display: "grid", gap: 6 }}><Meter pct={53} clear /><Meter pct={26} clear soft /></div>} line="use AI at work. Only 26% have a clear plan behind it." source="U.S. employees. Gallup, Aug 2026." />
      </div>
    </Sec>

    <Sec tone="ice" labelledBy="approach-title">
      <div className="ns-two top">
        <div>
          <p className="ns-eyebrow">How we work</p>
          <h2 className="ns-stmt" id="approach-title">From what people tell us to what we can prove.</h2>
          <div className="ns-actions" style={{ marginTop: 40 }}><Btn href="/platforms">Explore our work</Btn></div>
        </div>
        <ol className="ns-steps g2" aria-label="Listen, Study, Build, Prove">
          {loop.map(([name, line]) => <li key={name} className="ns-step" style={{ minHeight: 180 }}><b style={{ fontSize: 32 }}>{name}</b><span>{line}</span></li>)}
        </ol>
      </div>
      <ul className="ns-grid g3" style={{ marginTop: 16 }}>
        <li><Tile href={HEALTH} label="Access" title="Health Access" sub="Sponsored primary care for up to 25 New Yorkers, from January 2027." tone="white" className="short" /></li>
        <li><Tile href="/workforce" label="Capacity" title="Workforce Capacity" sub="Hands on learning in cloud, security, governance and AI." tone="white" className="short" /></li>
        <li><Tile href="/ai-society" label="Trust" title="AI & Society" sub="Public forums that shape responsible AI where people learn, work and get care." tone="white" className="short" /></li>
      </ul>
    </Sec>

    <Sec tone="navy" labelledBy="impact-title">
      <Head id="impact-title" eyebrow="Our impact" title="Where the work stands." link={["Partner with us", "/partner"]} />
      <ul className="ns-grid g3" style={{ gap: 24, marginTop: 48 }}>
        <li><Link className="ns-story" href="/workforce">
          <span className="viz"><Dots count={11} columns={6} size={16} color={(index) => (index < 6 ? "#ffffff" : "#6E9BDF")} /></span>
          <span className="body"><span className="ns-gap-label">Capacity</span><span className="head">11 graduate learners trained in cloud, security and governance on real projects.</span><span className="cta">Explore Workforce Capacity&nbsp;→</span></span>
        </Link></li>
        <li><a className="ns-story" href={`${HEALTH}primary-care-access`} rel="noopener">
          <span className="viz"><Dots count={25} columns={5} size={14} color="#A9C6F0" /></span>
          <span className="body"><span className="ns-gap-label">Access</span><span className="head">Up to 25 people gain a year of primary care from January 2027.</span><span className="cta">See the program&nbsp;↗</span></span>
        </a></li>
        <li><Link className="ns-story" href="/publication/rebs-v1-2025">
          <span className="viz"><Table /></span>
          <span className="body"><span className="ns-gap-label">Trust</span><span className="head">12 roundtable participants put rural access gaps on the public record.</span><span className="cta">Read the findings&nbsp;→</span></span>
        </Link></li>
      </ul>
      <p className="ns-src" style={{ marginTop: 40, fontSize: 15 }}>In collaboration with Capella University · Athabasca University · Purcell Integrative Osteopathic Care</p>
    </Sec>

    <Sec labelledBy="research-title">
      <Head id="research-title" eyebrow="Research" title="Evidence leaders can act on." link={["See all research", "/publications"]} />
      <Papers />
    </Sec>

    <Sec tone="cobalt" labelledBy="society-title">
      <div className="ns-two">
        <div>
          <p className="ns-eyebrow">AI &amp; Society</p>
          <h2 className="ns-stmt" id="society-title">Building public trust in AI.</h2>
          <p className="ns-body" style={{ marginTop: 20 }}>Who Decides? forums and roadshows bring residents, educators, employers and policymakers to the same table.</p>
          <div className="ns-actions" style={{ marginTop: 36 }}><Btn href="/ai-society" tone="light">Explore AI &amp; Society</Btn><More href="/partner">Host a forum</More></div>
        </div>
        <figure role="img" aria-label="How U.S. adults feel about AI in daily life: 52 percent more concerned than excited, 37 percent equally both, 9 percent more excited.">
          <div className="ns-num n120" aria-hidden="true">52%</div>
          <p style={{ marginTop: 12, fontSize: 19, lineHeight: 1.45 }}>of Americans are more concerned than excited about AI in daily life, up from 37% in 2021.</p>
          <div className="ns-split" style={{ marginTop: 32 }} aria-hidden="true"><i style={{ width: "52%", background: "#fff" }} /><i style={{ width: "37%", background: "var(--chart)" }} /><i style={{ width: "11%", background: "var(--navy)" }} /></div>
          <div className="ns-split-legend" style={{ gridTemplateColumns: "52fr 37fr 11fr", color: "var(--ice-2)" }} aria-hidden="true"><span>More concerned</span><span>Equally both</span><span>Excited</span></div>
          <figcaption className="ns-src" style={{ marginTop: 20 }}>U.S. adults. Pew Research Center, Jun 2026.</figcaption>
        </figure>
      </div>
    </Sec>

    <Band top title="Ready for what AI does next." line="SozoRock AI Lab: free AI sessions every Tuesday in Albany, New York State, and AI enablement for mission driven organizations." action={<Btn href={AI_LAB} tone="navy">Explore the AI Lab</Btn>} />

    <Sec className="pt0" id="events" labelledBy="events-title">
      <Head id="events-title" eyebrow="Events" title="Join the conversation." link={["All events", "/events"]} />
      <UpcomingTiles action="/events#register" />
      <p className="ns-src" style={{ marginTop: 28, fontSize: 15 }}>Past: Western New York preplanning roundtable, September 2025. 12 participants, 2 county public health jurisdictions, 2 universities. <Link href="/publication/rebs-v1-2025">Read the findings</Link></p>
    </Sec>
  </div>;
}
