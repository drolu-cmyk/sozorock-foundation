import { EngagementForm } from "../components";
import { PartnerForm } from "./forms";
import { AI_LAB, EVIDENCE, HEALTH, Band, Btn, Bullets, Fig, FormSection, Gantt, Go, Head, Hero, Meter, More, Sec, Segs, Steps, Tile } from "./ui";
import { upcoming } from "./home";

const people = {
  nike: { name: "Nike Oye", full: "Nike Oye, MBA", area: "Health partnerships and technical cooperation", short: "Health partnerships", img: "/leadership/nike-oye.webp" },
  jordan: { name: "Jordan Hare", full: "Jordan Hare, BSN, RN", area: "Health education and community learning", short: "Health education", img: "/leadership/jordan-hare.webp" },
  anthony: { name: "Anthony Abraham", full: "Anthony Abraham, MSC", area: "Global affairs and institutional relations", short: "Global affairs", img: "/leadership/anthony-abraham-2026.webp" },
  olu: { name: "Dr. Oluwabiyi Adeyemo", full: "Dr. Oluwabiyi Adeyemo", area: "Research, technology and program development", short: "Research, technology and programs", img: "/leadership/dr-oluwabiyi-adeyemo.webp" },
};

function Leads({ keys }) {
  return <div>
    <p className="ns-src" style={{ fontSize: 14, marginBottom: 12 }}>Led by</p>
    <div className="ns-leads">{keys.map((key) => <Go key={key} href="/leadership" className="ns-lead"><img src={people[key].img} alt="" width="48" height="48" loading="lazy" decoding="async" /><span><b>{people[key].name}</b><span className="ns-src">{people[key].short}</span></span></Go>)}</div>
  </div>;
}

const lanesFull = [
  { key: "c1", name: "Capella University", sub: "Cohort 1 · graduate · United States", span: "1 / 7", color: "#071D3B", label: "6 learners" },
  { key: "c2", name: "Capella University", sub: "Cohort 2 · graduate · United States", span: "7 / 13", color: "#0644AD", label: "5 learners" },
  { key: "au", name: "Athabasca University", sub: "Work integrated learning · undergraduate · Canada", span: "5 / 11", color: "#3F72C4", label: "1 learner" },
];
const lanesCompact = [
  { key: "c1", name: "Capella University · cohort 1", span: "1 / 7", color: "#071D3B", label: "6 graduate" },
  { key: "c2", name: "Capella University · cohort 2", span: "7 / 13", color: "#0644AD", label: "5 graduate" },
  { key: "au", name: "Athabasca University", span: "5 / 11", color: "#3F72C4", label: "1 undergraduate" },
];
const ganttLabel = "Timeline from October 2025 to September 2026. Capella University cohort one, six graduate learners, October 2025 to March 2026. Capella University cohort two, five graduate learners, April to September 2026. Athabasca University work integrated learning, one undergraduate, February to July 2026.";

const forum = [["Ask", "a real AI decision in learning, work or health"], ["Hear", "from the people it affects"], ["Recommend", "safeguards people can see and test"], ["Publish", "what we heard and how institutions respond"]];

const barriers = [
  ["Cost", "Primary Care Access Program", "A sponsored year of primary care for up to 25 New Yorkers, from January 2027."],
  ["Technology", "Health Equity Hubs", "Devices, connectivity and digital skills at libraries, community centers and at home."],
  ["Health information", "Health Access Day", "Health education and literacy, brought to the community."],
  ["Distance", "Telehealth and transport help", "Part of the Primary Care Access Program."],
  ["Trust", "Trusted local places and people", "Clinical care stays with licensed providers."],
];

function Barriers() {
  return <figure className="ns-barriers is-dark" aria-label="Barriers to care and what removes them">
    <div className="hdr" aria-hidden="true"><span>The barrier</span><span>What removes it</span></div>
    <ul style={{ display: "grid", gap: 10 }}>
      {barriers.map(([barrier, response, detail]) => <li key={barrier} className="row"><span>{barrier}</span><span><b>{response}</b><small>{detail}</small></span></li>)}
    </ul>
    <figcaption className="ns-src" style={{ marginTop: 10 }}>Library hubs run by appointment and community hubs at scheduled events. The Home hub is in development.</figcaption>
  </figure>;
}

/* Our Work */
export function OurWorkPage() {
  const index = [["access", "Access", "Health Access", "Removing the barriers between people and care", "navy"], ["capacity", "Capacity", "Workforce Capacity", "Skilled people for the systems we rely on", "cobalt"], ["trust", "Trust", "AI & Society", "A public say in how AI is used", ""]];
  return <div className="ns ns-work">
    <Hero
      id="work-title"
      title="Three gaps we work to close."
      lede="Access to care, the capacity of the people who run health systems, and public trust in AI. Each program has a clear job, real proof and a way for you to take part."
      actions={<><Btn href="/partner">Partner with us</Btn><More href="/support">Support our work</More></>}
      panelTone="white auto"
      decorative={false}
      panel={<nav className="ns-panel-index" aria-label="Programs on this page">{index.map(([id, gap, name, line, tone]) => <Tile key={id} href={`#${id}`} label={gap} title={name} sub={line} tone={tone} className="short" />)}</nav>}
    />

    <Sec id="access" labelledBy="access-title">
      <div className="ns-program">
        <div className="ns-stack">
          <p className="ns-eyebrow">Access</p>
          <h2 className="ns-stmt" id="access-title">Health Access</h2>
          <p className="ns-body">We bring a private place, a device and secure Wi‑Fi to libraries, community centers and homes, so cost, distance, technology and unclear information stop keeping people from care.</p>
          <Bullets items={["SozoRock Health: free county data and maps for every state", "Health Equity Initiative: Library, Community and Home Health Equity Hubs, and Health Access Day", "Primary Care Access Program, with Purcell Integrative Osteopathic Care"]} />
          <div className="ns-actions" style={{ marginTop: 8 }}><Btn href="/platforms/health">Explore Health Access</Btn><More href="/partner">Bring a hub to your community</More></div>
          <Leads keys={["nike", "jordan"]} />
        </div>
        <Barriers />
      </div>
    </Sec>

    <Sec id="capacity" labelledBy="capacity-title">
      <div className="ns-program">
        <div className="ns-stack">
          <p className="ns-eyebrow">Capacity</p>
          <h2 className="ns-stmt" id="capacity-title">Workforce Capacity</h2>
          <p className="ns-body">Hands on learning that builds the people who run and protect health systems, with universities, employers and communities.</p>
          <Bullets items={["Graduate and undergraduate learners on real cloud, security and AI projects", "Projects for health systems and employers, and a pipeline of job ready talent", "Free community AI learning through the SozoRock AI Lab"]} />
          <div className="ns-actions" style={{ marginTop: 8 }}><Btn href="/workforce">Explore Workforce Capacity</Btn><More href="/workforce#partner">Host a cohort</More></div>
          <Leads keys={["olu"]} />
        </div>
        <div className="ns-chartbox">
          <p style={{ fontSize: 22, letterSpacing: "-0.01em" }}>12 learners. Two universities. Two countries.</p>
          <p className="ns-src" style={{ marginTop: 6, marginBottom: 28 }}>October 2025 to September 2026</p>
          <Gantt compact lanes={lanesCompact} label={ganttLabel} />
          <p className="ns-src" style={{ marginTop: 20 }}>Cloud computing (AWS), cloud security, identity and access, governance, risk and compliance, and AI.</p>
        </div>
      </div>
    </Sec>

    <Sec tone="ice" id="trust" labelledBy="trust-title">
      <div className="ns-program">
        <div className="ns-stack">
          <p className="ns-eyebrow">Trust</p>
          <h2 className="ns-stmt" id="trust-title">AI &amp; Society</h2>
          <p className="ns-body">Building public trust in AI by giving residents, educators, employers and policymakers a real say in how it is used.</p>
          <Bullets items={["Who Decides? forums on AI in learning, work and health", "Roadshows that take the conversation to colleges, workplaces and public spaces", "Published findings with institutional responses"]} />
          <div className="ns-actions" style={{ marginTop: 8 }}><Btn href="/ai-society">Explore AI &amp; Society</Btn><More href="/partner">Host a forum</More></div>
          <Leads keys={["olu"]} />
        </div>
        <figure>
          <p style={{ fontSize: 22, letterSpacing: "-0.01em", marginBottom: 16 }}>How a Who Decides? forum works</p>
          <Steps two items={forum} />
          <figcaption className="ns-src" style={{ marginTop: 16 }}>Forums, roadshows and fireside chats. Dates are announced as they are confirmed.</figcaption>
        </figure>
      </div>
    </Sec>

    <Sec labelledBy="latest-title">
      <Head id="latest-title" eyebrow="Latest from the work" title="Research, events and learning you can use now." size="s40" />
      <ul className="ns-grid g3">
        <li><Go href="/publication/hsa-v1-2026" className="ns-tile" style={{ flexDirection: "row", gap: 24 }}>
          <img src="/media/hsa-cover.webp" alt="Health Systems Assurance Series, Volume 1 cover" width="120" height="155" loading="lazy" decoding="async" style={{ width: 120, height: "auto", alignSelf: "center", boxShadow: "0 12px 28px rgba(7,29,59,.22)" }} />
          <span style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16 }}><span className="lab">Research</span><span className="ttl" style={{ fontSize: 20 }}>What evidence should support trust in digital health systems?</span><span className="ns-src">Health Systems Assurance Series · Volume 1 · 2026</span></span>
        </Go></li>
        <li><Tile href="/events" label="Event" title={upcoming[0].title} sub={`Fireside · ${upcoming[0].where} · Date to be announced`} /></li>
        <li><Tile href={AI_LAB} label="SozoRock AI Lab" title="Ready for what AI does next" sub="Free Tuesday sessions · AI enablement for organizations" /></li>
      </ul>
    </Sec>

    <Sec tone="ice" labelledBy="leads-title">
      <Head id="leads-title" eyebrow="Who leads the work" title="The people accountable for each program." link={["Leadership", "/leadership"]} size="s40" />
      <ul className="ns-grid g4" style={{ marginTop: 48 }}>
        {Object.values(people).map((person) => <li key={person.name}><Go href="/leadership" className="ns-person"><img src={person.img} alt={person.full} width="600" height="600" loading="lazy" decoding="async" /><span className="meta"><b>{person.full}</b><span>{person.area}</span></span></Go></li>)}
      </ul>
    </Sec>

    <div className="ns-shell ns-band-wrap pt" style={{ paddingBottom: 0 }}>
      <div className="ns-head"><div><p className="ns-eyebrow">Our standards</p><h2 className="ns-stmt s36" style={{ maxWidth: 900 }}>Funding never buys a conclusion. We publish results in the open, with sources and limits.</h2></div><More href="/standards">Read our standards</More></div>
    </div>
    <Band top title="Bring your organization into the work." line="Universities, providers, libraries, employers, counties, funders and community groups." action={<Btn href="/partner" tone="navy">Partner with us</Btn>} />
  </div>;
}

/* Health Access */
export function HealthPage() {
  const facts = [["Up to 25", "New Yorkers, one per household"], ["12 months", "of sponsored primary care"], ["62", "counties eligible across New York State"], ["$4,320", "funds one participant for a year"]];
  const county = [["5.5%", "Adults without health insurance", "95% interval 4.2 to 7.0%", 5.5], ["7.2%", "Lack reliable transportation", "95% interval 6.1 to 8.5%", 7.2], ["12.2%", "Food insecurity", "95% interval 9.9 to 15.0%", 12.2]];
  return <div className="ns ns-health">
    <Hero
      id="health-title"
      crumb={["Our Work", "/platforms"]}
      title="A clearer route to primary care."
      lede="We bring a private place, a device and secure Wi‑Fi to libraries, community centers and homes, so cost, distance, technology and unclear information stop keeping people from care."
      actions={<><Btn href={HEALTH}>Visit SozoRock Health</Btn><More href="/support">Support the program</More></>}
      panel={<img className="fill" src="/media/health-access.webp" alt="" width="1672" height="941" decoding="async" fetchPriority="high" />}
    />

    <Sec labelledBy="hwhy-title">
      <Head id="hwhy-title" eyebrow="Why it matters" title="Too many people cannot get the primary care they need." />
      <div className="ns-grid g2 wide">
        <Fig size="n104" value="1 in 4" viz={<Segs on={1} of={4} />} line="New Yorkers live where primary care is short." source="5.29M of 19.9M residents. HRSA, Sep 2026; Census ACS 2024." />
        <Fig size="n104" tone="navy" value="12,000+" line="residents per primary care clinician, as reported by a regional public health director at our 2025 Western New York roundtable." source="Participant reported context, not an independently verified estimate. Documented in the Rural Equity Blueprint Series, Volume 1." />
      </div>
    </Sec>

    <Sec tone="ice" labelledBy="barriers-title">
      <div className="ns-program">
        <div className="ns-stack">
          <p className="ns-eyebrow">Health Equity Initiative</p>
          <h2 className="ns-stmt" id="barriers-title">Remove the barrier, and care becomes reachable.</h2>
          <p className="ns-body">Libraries, community centers and homes are places people already trust. We use those spaces when they are available and reserved, for health information, help with technology and getting ready for a visit with a licensed provider.</p>
          <Bullets items={["Library Health Equity Hub", "Community Health Equity Hub", "Home Health Equity Hub", "Health Access Day"]} />
          <p className="ns-src">Local delivery depends on agreed responsibilities and available services. Clinical care remains with licensed providers.</p>
          <div className="ns-actions"><Btn href="/partner">Bring a hub to your community</Btn></div>
        </div>
        <Barriers />
      </div>
    </Sec>

    <Sec tone="navy" id="primary-care-access" labelledBy="pcap-title">
      <div className="ns-two top">
        <div>
          <p className="ns-eyebrow">Primary Care Access Program</p>
          <h2 className="ns-stmt" id="pcap-title">A sponsored year of primary care, from January 2027.</h2>
          <p className="ns-body" style={{ marginTop: 20 }}>For people 64 or younger with financial need and a chronic condition such as diabetes or high blood pressure, in any of New York’s 62 counties. Starting small shows where the pathway works, where it fails and what should change before it grows.</p>
          <div style={{ marginTop: 28 }}><Bullets items={["A direct primary care membership with Dr. Michael Purcell and Purcell Integrative Osteopathic Care", "Ongoing telehealth", "Help with transportation", "Health access education"]} /></div>
          <div className="ns-actions" style={{ marginTop: 36 }}><Btn href="/support" tone="light">Support the program</Btn><More href="/partner">Partner as a provider</More></div>
          <p className="ns-src" style={{ marginTop: 24 }}>Clinical care remains with the licensed provider. Membership is not health insurance.</p>
        </div>
        <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px 32px", background: "var(--royal)", borderRadius: 4, padding: 56 }}>
          {facts.map(([value, label]) => <div key={value}><dt className="ns-num n56" style={{ color: "#fff" }}>{value}</dt><dd style={{ marginTop: 10, fontSize: 16, color: "var(--ice-2)" }}>{label}</dd></div>)}
        </dl>
      </div>
    </Sec>

    <Sec labelledBy="county-title">
      <Head id="county-title" eyebrow="County data" title="Albany County, New York State, at a glance." link={["Explore county data", EVIDENCE]} />
      <div className="ns-grid g3 wide">
        {county.map(([value, label, interval, pct]) => <Fig key={label} size="n72" value={value} viz={<Meter pct={(pct / 15) * 100} />} line={label} source={interval} />)}
      </div>
      <p className="ns-src" style={{ marginTop: 32, maxWidth: 900 }}>CDC PLACES, 2025 release, model based estimates for 2023. Insurance covers adults 18 to 64; the other measures cover adults 18 and older. County estimates describe communities, not SozoRock results.</p>
    </Sec>

    <Band title="Sponsor a year of care." line="$108,000 funds the first cohort. Funds are confirmed before anyone enrolls." action={<Btn href="/support" tone="navy">Support the program</Btn>} />
  </div>;
}

/* Workforce Capacity */
export function WorkforcePage() {
  const skills = [["AI", 41, true], ["Cloud security", 36, true], ["Risk assessment", 29, true], ["Application security", 28, false], ["Governance, risk and compliance", 27, true]];
  const practice = [
    ["Cloud computing", "Build and run services on AWS.", "M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z"],
    ["Cloud security", "Find risks, rate them, fix what matters first.", "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4"],
    ["Identity and access", "Who can reach what, and why.", "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3 2.5-5 5-5s5 2 5 5M14 10h7v6h-7zM15.5 10V8.5a2 2 0 0 1 4 0V10"],
    ["Governance, risk and compliance", "Controls mapped and shown to work.", "M6 3h9l4 4v14H6zM14 3v5h5M9 13l2 2 4-4"],
  ];
  return <div className="ns ns-workforce">
    <Hero
      id="workforce-title"
      crumb={["Our Work", "/platforms"]}
      title="Stronger systems start with skilled people."
      lede="Hands on learning in cloud, security, governance and AI, built with universities, employers and communities."
      actions={<><Btn href="#partner">Partner with us</Btn><More href="#model">Explore our model</More></>}
      panelTone="cobalt"
      panelLabel="11 graduate learners at Capella University, 1 undergraduate at Athabasca University in Canada, 2 countries."
      panel={<div className="ns-panel-figures"><div><b>11</b><span>graduate learners, Capella University</span></div><div><b>1</b><span>undergraduate, Athabasca University, Canada</span></div><div><b>2</b><span>countries, one model</span></div></div>}
    />

    <Sec labelledBy="demand-title">
      <Head id="demand-title" eyebrow="Why it matters" title="Health systems are asking more of fewer people." />
      <div className="ns-two top" style={{ marginTop: 64 }}>
        <div className="ns-stack" style={{ gap: 48 }}>
          <Fig size="n72" value="$50B" line="in federal rural health transformation awards reach all 50 states. New York State’s $212M first year plan names workforce and cybersecurity among its aims." source="CMS, Dec 2025; New York State Department of Health, Dec 2025" />
          <Fig size="n56" value="Every hospital" line="in New York State must now name a chief information security officer." source="10 NYCRR 405.46, in force Oct 2025" />
          <Fig size="n56" value="Every setting" line="in New York State reports nurse shortages. Clinics still lack primary care physicians." source="Center for Health Workforce Studies, Jun 2026" />
        </div>
        <figure className="ns-chartbox" role="img" aria-label="Skills security teams need most: AI 41 percent, cloud security 36, risk assessment 29, application security 28, governance, risk and compliance 27. SozoRock programs cover AI, cloud security, risk assessment and governance, risk and compliance.">
          <p style={{ fontSize: 22, letterSpacing: "-0.01em" }}>The skills security teams need most</p>
          <p className="ns-src" style={{ marginTop: 6, marginBottom: 8 }}>Share of security professionals naming each need</p>
          <div aria-hidden="true">{skills.map(([name, value, ours]) => <div className="ns-hbar" key={name} style={{ marginTop: 22 }}><div className="row"><span style={{ fontWeight: ours ? 600 : 400 }}>{name}</span><span>{value}%</span></div><div className={`ns-meter ${ours ? "" : "soft"}`} style={{ background: "#fff" }}><i style={{ width: `${(value / 45) * 100}%`, background: ours ? "var(--cobalt)" : "var(--chart-2)" }} /></div></div>)}</div>
          <div className="ns-legend" aria-hidden="true"><span><i style={{ background: "var(--cobalt)" }} />In our programs</span><span><i style={{ background: "var(--chart-2)" }} />Not yet</span></div>
          <figcaption className="ns-src" style={{ marginTop: 16 }}>ISC2 Cybersecurity Workforce Study, Dec 2025</figcaption>
        </figure>
      </div>
    </Sec>

    <Sec tone="ice" id="model" labelledBy="model-title">
      <Head id="model-title" eyebrow="Our model" title="Learners work on real problems. Partners get the work and the talent." />
      <ul className="ns-grid g3">
        <li><Tile href="#partner" tone="white" label="Universities" title="Host a cohort" sub="Experiential learning for graduate and undergraduate students on real projects." /></li>
        <li><Tile href="#partner" tone="white" label="Health systems and employers" title="Share a project" sub="Cloud, security and AI work delivered, and a pipeline of job ready talent." /></li>
        <li><Tile href={`${AI_LAB}individuals/`} tone="white" label="Communities" title="Learn AI for free" sub="Hands on sessions every Tuesday, open to any background, through the SozoRock AI Lab." /></li>
      </ul>
    </Sec>

    <Sec labelledBy="results-title">
      <Head id="results-title" eyebrow="Results" title="Two universities. Two countries. One model." />
      <div style={{ marginTop: 64 }}><Gantt lanes={lanesFull} label={ganttLabel} /></div>
      <ul className="ns-grid g3 wide">
        <li><Fig size="n72" value="11" line="graduate learners at Capella University, which retains academic oversight and grading." /></li>
        <li><Fig size="n72" value="1" line="undergraduate in work integrated learning with Athabasca University, Alberta, Canada, building a security framework for community health sites." /></li>
        <li><Fig size="n72" value="2 countries" line="One model that works across institutions, systems and borders." /></li>
      </ul>
    </Sec>

    <Sec tone="ice" labelledBy="skills-title">
      <Head id="skills-title" eyebrow="Skills in practice" title="What learners actually do." />
      <ul className="ns-grid g4">
        {practice.map(([name, line, icon]) => <li key={name} className="ns-tile on-white" style={{ minHeight: 220 }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0644AD" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={icon} /></svg>
          <span><span className="ttl" style={{ fontSize: 22 }}>{name}</span><span className="sub">{line}</span></span>
        </li>)}
      </ul>
      <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 56 }}>
        <img src="/leadership/dr-oluwabiyi-adeyemo-headshot.jpg" alt="Dr. Oluwabiyi Adeyemo" width="96" height="96" loading="lazy" decoding="async" style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", flex: "none" }} />
        <p className="ns-body" style={{ fontSize: 18 }}>Designed, mentored and evaluated by <strong style={{ color: "var(--navy)" }}>Dr. Oluwabiyi Adeyemo</strong>, Director of Strategic Initiatives.</p>
      </div>
    </Sec>

    <Band top title="Ready for what AI does next." line="SozoRock AI Lab: free sessions every Tuesday and AI enablement for mission driven organizations." action={<Btn href={AI_LAB} tone="navy">Explore the AI Lab</Btn>} />

    <FormSection id="partner" eyebrow="Partner with us" title="Host a cohort, share a project or build your team." lede="Tell us what you would like to build. We will come back with a scope and timeline.">
      <PartnerForm />
    </FormSection>
  </div>;
}

/* AI & Society */
export function AiSocietyPage() {
  return <div className="ns ns-society">
    <Hero
      id="society-title"
      crumb={["Our Work", "/platforms"]}
      title="Building public trust in AI."
      lede="Who Decides? forums and roadshows bring residents, educators, employers and policymakers together on AI in learning, work and health."
      actions={<><Btn href="#interest">Register interest</Btn><More href="/partner">Host a forum</More></>}
      panelTone="cobalt"
      panelLabel="52 percent of Americans are more concerned than excited about AI in daily life. Pew Research Center, June 2026."
      panel={<div className="ns-panel-stat"><b>52%</b><p>of Americans are more concerned than excited about AI in daily life.</p><div className="ns-split" style={{ marginTop: 28 }}><i style={{ width: "52%", background: "#fff" }} /><i style={{ width: "37%", background: "var(--chart)" }} /><i style={{ width: "11%", background: "var(--navy)" }} /></div><p className="ns-src">U.S. adults. Pew Research Center, Jun 2026.</p></div>}
    />

    <Sec labelledBy="gap-title">
      <Head id="gap-title" eyebrow="The trust gap" title="AI is arriving faster than the rules and the trust behind it." />
      <div className="ns-grid g3 wide">
        <Fig value={<>53<small>%</small> <span className="ns-soft">26<small>%</small></span></>} label="53 percent of U.S. employees use AI at work; 26 percent say their employer has a clear plan." viz={<div style={{ display: "grid", gap: 6 }}><Meter pct={53} clear /><Meter pct={26} clear soft /></div>} line="use AI at work. Only 26% say their employer has a clear plan for it." source="U.S. employees. Gallup, Aug 2026." />
        <Fig value="71%" viz={<Meter pct={71} />} line="of Americans expect AI to mean fewer jobs." source="Pew Research Center, Jun 2026." />
        <Fig size="n56" value="37% → 52%" label="Concern about AI in daily life rose from 37 percent in 2021 to 52 percent in 2026." viz={<Meter pct={52} />} line="Concern about AI in daily life since 2021." source="Pew Research Center, 2021 and Jun 2026." />
      </div>
    </Sec>

    <Sec tone="ice" labelledBy="forum-title">
      <Head id="forum-title" eyebrow="How a Who Decides? forum works" title="From a question to a public answer." />
      <Steps items={[["Ask", "Start from a real AI decision in learning, work or health."], ["Hear", "From the people it affects, with no technical background needed."], ["Recommend", "Safeguards people can see and test."], ["Publish", "The questions, evidence, recommendations and institutional responses."]]} />
    </Sec>

    <Sec labelledBy="formats-title">
      <Head id="formats-title" eyebrow="Formats" title="Come to one, or bring one to your community." link={["All events", "/events"]} />
      <ul className="ns-grid g3">
        <li><Tile href="#interest" label="Who Decides? Forum" title="AI, learning and work" sub="Albany, New York State · Date to be announced" /></li>
        <li><Tile href="/partner" label="Roadshow" title="Who Decides? on the road" sub="Colleges, workplaces and public spaces · Dates to be announced" /></li>
        <li><Tile href="#interest" label="Fireside chat" title="AI in health and public services" sub="Date to be announced" /></li>
      </ul>
    </Sec>

    <Band tone="navy" title="Fund public participation in AI." line="Support covers participant compensation, accessible facilitation and publication. Support does not direct the findings." action={<Btn href="/support" tone="light">Discuss support</Btn>} />

    <FormSection id="interest" eyebrow="Register interest" title="Have a say in what’s next." lede="No technical background needed. We will share dates and places as they are confirmed.">
      <EngagementForm kind="Participation" />
    </FormSection>
  </div>;
}

/* AI Lab */
export function AiLabPage() {
  return <div className="ns ns-lab">
    <Hero
      id="lab-title"
      crumb={["Our Work", "/platforms"]}
      title="Ready for what AI does next."
      lede="Free weekly AI sessions for individuals. AI enablement for mission driven organizations. One platform neutral standard."
      actions={<><Btn href={`${AI_LAB}individuals/`}>For individuals</Btn><More href={`${AI_LAB}organizations/`}>For organizations</More></>}
      panelLabel="Free sessions every Tuesday at 6:30 pm in the Beacon Bank community room, Albany, New York State, since May 2026."
      panel={<div className="ns-panel-stat"><b>Tuesdays</b><b style={{ color: "var(--chart-2)" }}>6:30 pm</b><p style={{ color: "var(--ice-2)" }}>Beacon Bank community room, Albany, New York State</p></div>}
    />
    <Sec labelledBy="do-title">
      <Head id="do-title" eyebrow="Two programs" title="One standard for people and the organizations that serve them." />
      <ul className="ns-grid g3">
        <li className="ns-tile"><span className="lab">Individuals</span><span><span className="ttl">Free AI sessions, every Tuesday</span><span className="sub">Agents, voice, AI video and app building, for any background.</span></span></li>
        <li className="ns-tile"><span className="lab">Organizations</span><span><span className="ttl">AI enablement for mission driven teams</span><span className="sub">Activation, train the trainer certification and AI governance.</span></span></li>
        <li className="ns-tile"><span className="lab">Standard</span><span><span className="ttl">Platform neutral, human judgment first</span><span className="sub">ChatGPT, Claude, Copilot, Gemini, Grok and open models, with results published.</span></span></li>
      </ul>
    </Sec>
    <Band tone="ice" title="Bring the AI Lab to your organization." line="A ninety day activation path, certified trainers and AI governance, as a sponsored cohort or a direct engagement." action={<Btn href={`${AI_LAB}organizations/#inquiry`}>Book a readiness call</Btn>} />
  </div>;
}
