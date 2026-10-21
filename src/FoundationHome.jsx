import { Link } from "./router";

const HEALTH = "https://health.sozorockfoundation.org/";
const AI_LAB = "https://ai-lab.sozorockfoundation.org/";

const programs = [
  { gap: "Access", name: "Health Access", line: "Sponsored primary care for up to 25 New Yorkers, from January 2027.", href: HEALTH, external: true },
  { gap: "Capacity", name: "Workforce Capacity", line: "Hands on learning in cloud, security, governance and AI.", href: "/workforce" },
  { gap: "Trust", name: "AI & Society", line: "Public forums that shape responsible AI where people learn, work and get care.", href: "/ai-society" },
];

const papers = [
  { series: "Health Systems Assurance Series", meta: "Volume 1 · 2026", line: "What evidence should support trust in digital health systems?", href: "/publication/hsa-v1-2026", img: "/media/hsa-cover.webp", width: 1600, height: 2071 },
  { series: "Rethinking Rural Governance Series", meta: "Volume 1 · 2025 · Modernization and Resilience Program", line: "From fragmented response to coordinated public action.", href: "/publication/rrg-v1-2025", img: "/media/rrg-cover.webp", width: 1100, height: 1424 },
  { series: "Rural Equity Blueprint Series", meta: "Volume 1 · 2025", line: "A practical framework for local health access.", href: "/publication/rebs-v1-2025", img: "/media/rebs-cover.webp", width: 1100, height: 1407 },
];

const events = [
  { format: "Fireside", title: "Rural health transformation in the Capital Region", where: "Albany and surrounding counties, New York State" },
  { format: "Working Roundtable", title: "Rural health workforce and care delivery", where: "Warren and Washington counties, New York State" },
  { format: "Who Decides? Forum", title: "AI, learning and work", where: "Albany, New York State" },
];

function SmartLink({ href, className, children, ...props }) {
  if (/^https?:/u.test(href)) return <a href={href} className={className} {...props}>{children}</a>;
  return <Link href={href} className={className} {...props}>{children}</Link>;
}

function Person({ filled }) {
  return <svg width="30" height="37" viewBox="0 0 36 44" aria-hidden="true" focusable="false"><circle cx="18" cy="9" r="8" fill={filled ? "#0644AD" : "#DCEAFF"} /><path d="M4 44 V31 C4 23 10 19 18 19 C26 19 32 23 32 31 V44 Z" fill={filled ? "#0644AD" : "#DCEAFF"} /></svg>;
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

export function FoundationHome() {
  return <div className="ns ns-home">
    <div className="ns-shell">
      <section className="ns-hero" aria-labelledby="home-title">
        <div>
          <h1 className="ns-h1" id="home-title">Healthier communities. Stronger systems. <span style={{ color: "#0644AD" }}>A say in what’s next.</span></h1>
          <p className="ns-hero-lede">We open doors to primary care, build the people who run and protect health systems, and give communities a voice on AI.</p>
          <div className="ns-actions">
            <Link className="ns-btn ns-btn-primary" href="/platforms">Explore our work</Link>
            <Link className="ns-more" href="/partner">Partner with us →</Link>
          </div>
        </div>
        <div className="ns-hero-panel" aria-hidden="true"><span>Access.</span><span>Capacity.</span><span>Trust.</span></div>
      </section>

      <a className="ns-upcoming" href="#events">
        <span><span className="ns-tag">Upcoming</span><span>Rural health conversations in the Capital Region and in Warren and Washington counties, New York State</span></span>
        <span className="ns-more">See upcoming events →</span>
      </a>
    </div>

    <section className="ns-section" aria-labelledby="gaps-title">
      <div className="ns-shell">
        <h2 className="ns-h2" id="gaps-title" style={{ maxWidth: 820 }}>Demand for care, skills and trusted AI is outpacing supply.</h2>
        <div className="ns-gaps">
          <figure className="ns-gap">
            <span className="ns-tag">Access</span>
            <h3>In New York State alone, more than 1 in 4 residents live where primary care is short.</h3>
            <div className="ns-chart" role="img" aria-label="Four of fifteen figures shaded: more than 1 in 4 New York State residents live in primary care shortage areas.">
              <div className="ns-people">{Array.from({ length: 15 }, (_, index) => <Person key={index} filled={index < 4} />)}</div>
            </div>
            <figcaption className="ns-source">5.29M of 19.9M residents. HRSA, September 2026; Census ACS 2024.</figcaption>
          </figure>
          <figure className="ns-gap">
            <span className="ns-tag">Capacity</span>
            <h3>Most security teams lack the skills they need, as rules for hospitals tighten.</h3>
            <div className="ns-chart" role="img" aria-label="Gauge at 59 percent: security teams reporting critical or significant skills gaps.">
              <div className="ns-gauge"><svg width="220" height="120" viewBox="0 0 260 140" aria-hidden="true" focusable="false"><path d="M20 130 A110 110 0 0 1 240 130" fill="none" stroke="#DCEAFF" strokeWidth="20" /><path d="M20 130 A110 110 0 0 1 160.8 24.4" fill="none" stroke="#0644AD" strokeWidth="20" /></svg><strong>59%</strong></div>
            </div>
            <figcaption className="ns-source">Security teams reporting critical or significant skills gaps. ISC2, December 2025. 10 NYCRR 405.46, October 2025.</figcaption>
          </figure>
          <figure className="ns-gap">
            <span className="ns-tag">Trust</span>
            <h3>AI use at work is running ahead of the plans behind it.</h3>
            <div className="ns-chart" role="img" aria-label="53 percent of U.S. employees use AI at work; 26 percent say their employer has a clear AI plan.">
              <div className="ns-bars">
                <div><strong>53%</strong><i style={{ height: 92 }} /><small>use AI at work</small></div>
                <div><strong>26%</strong><i className="light" style={{ height: 45 }} /><small>have a clear plan</small></div>
              </div>
            </div>
            <figcaption className="ns-source">U.S. employees. Gallup, August 2026.</figcaption>
          </figure>
        </div>
        <Link className="ns-more" href="/publications" style={{ marginTop: 32 }}>Explore the research →</Link>
      </div>
    </section>

    <section className="ns-section tight ns-panel" aria-labelledby="approach-title">
      <div className="ns-shell ns-approach">
        <div className="ns-loop" role="img" aria-label="Our approach is a loop: listen at events, study through research and data, build programs, prove results in public.">
          <span className="ring" />
          <span className="node n1"><b>Listen</b><small>Events</small></span>
          <span className="node n2"><b>Study</b><small>Research and data</small></span>
          <span className="node n3"><b>Build</b><small>Programs</small></span>
          <span className="node n4"><b>Prove</b><small>Results in public</small></span>
        </div>
        <div>
          <h2 className="ns-h2" id="approach-title">Our approach</h2>
          <p className="ns-lede">We listen to communities, study the evidence, build programs and publish results.</p>
          <ul className="ns-programs">
            {programs.map((program) => <li key={program.name}><SmartLink href={program.href}>
              <span className="ns-tag">{program.gap}</span>
              <span><span className="t">{program.name}</span><span className="d">{program.line}</span></span>
              <span className="arrow" aria-hidden="true">{program.external ? "↗" : "→"}</span>
            </SmartLink></li>)}
          </ul>
        </div>
      </div>
    </section>

    <section className="ns-section tight ns-dark" aria-labelledby="impact-title">
      <div className="ns-shell">
        <div className="ns-head-row">
          <h2 className="ns-h2" id="impact-title">Our impact</h2>
          <Link className="ns-more" href="/partner">Partner with us →</Link>
        </div>
        <ul className="ns-stories">
          <li><Link className="ns-story" href="/workforce">
            <span className="viz"><Dots count={11} columns={6} size={16} color={(index) => (index < 6 ? "#ffffff" : "#6E9BDF")} /></span>
            <span className="body"><span className="ns-tag">Capacity</span><span className="head">11 graduate learners trained in cloud, security and governance on real projects.</span><span className="cta">Explore Workforce Capacity →</span></span>
          </Link></li>
          <li><a className="ns-story" href={`${HEALTH}primary-care-access`}>
            <span className="viz"><Dots count={25} columns={5} size={14} color="#A9C6F0" /></span>
            <span className="body"><span className="ns-tag">Access</span><span className="head">Up to 25 people gain a year of primary care from January 2027.</span><span className="cta">See the program ↗</span></span>
          </a></li>
          <li><Link className="ns-story" href="/publication/rebs-v1-2025">
            <span className="viz"><Table /></span>
            <span className="body"><span className="ns-tag">Trust</span><span className="head">12 roundtable participants put rural access gaps on the public record.</span><span className="cta">Read the findings →</span></span>
          </Link></li>
        </ul>
        <p className="ns-collab">In collaboration with Capella University · Athabasca University · Purcell Integrative Osteopathic Care</p>
      </div>
    </section>

    <section className="ns-section" aria-labelledby="research-title">
      <div className="ns-shell">
        <div className="ns-head-row">
          <h2 className="ns-h2" id="research-title">Research and insights</h2>
          <Link className="ns-more" href="/publications">See all research →</Link>
        </div>
        <ul className="ns-papers">
          {papers.map((paper) => <li key={paper.href}><Link className="ns-paper" href={paper.href}>
            <span className="cover"><img src={paper.img} alt={`${paper.series}, Volume 1 cover`} width={paper.width} height={paper.height} loading="lazy" decoding="async" /></span>
            <span className="series">{paper.series}</span>
            <span className="meta">{paper.meta}</span>
            <span className="line">{paper.line}</span>
            <span className="cta">Read Volume 1 →</span>
          </Link></li>)}
        </ul>
      </div>
    </section>

    <section className="ns-section tight ns-panel" aria-labelledby="society-title">
      <div className="ns-shell ns-two">
        <div>
          <h2 className="ns-h2" id="society-title">AI &amp; Society: building public trust in AI</h2>
          <p className="ns-lede">Who Decides? forums bring residents, educators, employers and policymakers together to shape responsible AI in learning, work and health.</p>
          <div className="ns-actions" style={{ marginTop: 28 }}>
            <Link className="ns-btn ns-btn-primary" href="/ai-society">Explore AI &amp; Society</Link>
            <Link className="ns-more" href="/partner">Partner on a forum →</Link>
          </div>
        </div>
        <figure role="img" aria-label="How U.S. adults feel about AI in daily life: 52 percent more concerned than excited, 37 percent equally both, 9 percent more excited than concerned.">
          <p style={{ fontSize: 18, fontWeight: 600 }}>How Americans feel about AI in daily life</p>
          <div className="ns-stack" aria-hidden="true"><i style={{ width: "52%", background: "#071D3B" }} /><i style={{ width: "37%", background: "#6E9BDF" }} /><i style={{ width: "11%", background: "#DCEAFF" }} /></div>
          <div className="ns-stack-legend" style={{ gridTemplateColumns: "52fr 37fr 11fr" }} aria-hidden="true">
            <span><b>52%</b>more concerned</span><span><b>37%</b>equally both</span><span><b>9%</b>more excited</span>
          </div>
          <figcaption className="ns-source" style={{ marginTop: 14 }}>U.S. adults. Pew Research Center, June 2026. Up from 37% concerned in 2021.</figcaption>
        </figure>
      </div>
    </section>

    <div className="ns-shell" style={{ paddingTop: 96 }}>
      <section className="ns-band" aria-labelledby="lab-title">
        <div>
          <h2 className="ns-h2" id="lab-title">SozoRock AI Lab: practical AI skills for everyone</h2>
          <p>Free, hands on training for any background. Tuesdays at 6:30 pm, Albany, New York State.</p>
        </div>
        <a className="ns-btn ns-btn-light" href={AI_LAB}>Register for the AI Lab ↗</a>
      </section>
    </div>

    <section className="ns-section" id="events" aria-labelledby="events-title">
      <div className="ns-shell">
        <div className="ns-head-row">
          <h2 className="ns-h2" id="events-title">Upcoming events</h2>
          <Link className="ns-more" href="/events">All events →</Link>
        </div>
        <ul className="ns-events">
          {events.map((event) => <li key={event.title} className="ns-event">
            <span className="ns-tag">{event.format}</span>
            <span><span className="t">{event.title}</span><span className="w">{event.where}</span></span>
            <span className="d">Date to be announced</span>
            <a className="ns-more" href="#briefing">Register interest →</a>
          </li>)}
        </ul>
        <p className="ns-past">Past: Western New York preplanning roundtable, September 2025. 12 participants, 2 county public health jurisdictions, 2 universities. <Link href="/publication/rebs-v1-2025">Read the findings</Link></p>
      </div>
    </section>
  </div>;
}
