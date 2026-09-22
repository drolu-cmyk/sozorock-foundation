import { EngagementForm } from "./components";
import { PublicationAccessPage } from "./PublicationAccessPage";
import { publications } from "./siteData";
import { CoverButton, CitationButton, DiscussionScenario } from "./ApprovedInteractions";

// Approved September 22, 2026: preserve program details and evidence limits.
export function ApprovedPage({pathname}) { switch(pathname) {
case "/": return <>
<div className="blue"><section className="hero home"><div className="shell homegrid"><div><h1>{"A clearer route to primary care."}</h1>
<p>{"Help fund SozoRock’s planned New York pilot for 25 people facing barriers to ongoing primary care."}</p>
<a className="action" href="/support">{"Support"}</a>
<p className="fine">{"Planned for 2027 with Dr. Michael Purcell and PIOC."}<br />{"Clinical care remains with the licensed provider."}</p>
</div>
<div className="bookrack"><figure><CoverButton cover="rebs" /></figure>
<figure><CoverButton cover="rrg" /></figure>
<figure><CoverButton cover="hsa" /></figure>
</div>
</div>
</section>
</div>
<section className="section integrated"><div className="shell"><h2>{"Health equity. County intelligence."}<br />{"Applied learning."}</h2>
<p>{"SozoRock connects health-access models with local data, research and practical training. Communities can explore the evidence, develop a partnership or support the work."}</p>
</div>
</section>
<section className="section" id="hubs"><div className="shell"><div className="split"><h2>{"SozoRock Health"}</h2>
<div><p>{"Our Health Equity Initiative connects health literacy, digital readiness and preparation for provider-led care."}</p>
<a className="textlink" href="/platforms/health">{"Explore"}</a>
</div>
</div>
<div className="hubset"><article><h3>{"Library Health Equity Hub"}</h3>
<p>{"Health literacy and digital support through local libraries."}</p>
<details><summary>{"Details"}</summary>
<p>{"A proposed library-based model for health information, digital skills and preparation to use provider-led services. Local partners would agree the space, connectivity, privacy and staff responsibilities."}</p>
</details>
</article>
<article><h3>{"Community Health Equity Hub"}</h3>
<p>{"Health education and digital support through community organizations."}</p>
<details><summary>{"Details"}</summary>
<p>{"A proposed community-based model combining local health information, digital support and preparation for provider-led services. Activities would reflect local needs, partner capacity and available services."}</p>
</details>
</article>
<article><h3>{"Home Health Equity Hub"}</h3>
<p>{"Help preparing to use provider platforms from home."}</p>
<details><summary>{"Details"}</summary>
<p>{"A proposed home-based model for people who need support using devices, connectivity or provider platforms. It does not establish a home-care or home-health clinical service."}</p>
</details>
</article>
</div>
<p className="modelnote">{"Proposed partner models. Local implementation depends on agreed responsibilities, available services and delivery capacity. Clinical care remains with licensed providers."}</p>
<p className="modelnote">{"Also within SozoRock Health: Health Access Day, provider platform readiness, workforce development and the planned primary care pilot."}</p>
</div>
</section>
<section className="section soft"><div className="shell"><div className="split"><h2>{"County data for"}<br />{"health-access planning."}</h2>
<div><p>{"Place Intelligence shows local health and community conditions. CB-CAP connects county evidence with planning questions, funding and workforce needs."}</p>
<p className="fine">{"Public evidence is available. CB-CAP institutional planning workflows are not yet open."}</p>
</div>
</div>
<div style={{"marginTop": "38px"}}><div className="datahead"><h3>{"Albany County, New York"}</h3>
<span>{"County FIPS 36001 · 2022–2023 estimates"}</span>
</div>
<div className="datastrip"><div><strong>{"5.5%"}</strong>
<span>{"Adults without health insurance"}</span>
<small>{"95% interval: 4.2–7.0%"}</small>
</div>
<div><strong>{"7.2%"}</strong>
<span>{"Lack of reliable transportation"}</span>
<small>{"95% interval: 6.1–8.5%"}</small>
</div>
<div><strong>{"12.2%"}</strong>
<span>{"Food insecurity"}</span>
<small>{"95% interval: 9.9–15.0%"}</small>
</div>
</div>
<p className="sources">{"Example captured from SozoRock Health’s Place Intelligence on 22 September 2026. Modeled county estimates describe community conditions, not SozoRock results or an individual’s needs. Review the underlying definitions, eligible populations and sources before use."}</p>
<a className="textlink" href="https://health.sozorockfoundation.org/evidence">{"Explore"}</a>
</div>
</div>
</section>
<section className="section"><div className="shell split"><div><h2>{"SozoRock preplanning roundtable"}</h2>
<p>{"Western New York · 2025"}</p>
<div className="stats"><div><strong>{"12"}</strong>
<span>{"participants"}</span>
</div>
<div><strong>{"2"}</strong>
<span>{"county jurisdictions"}</span>
</div>
<div><strong>{"2"}</strong>
<span>{"universities"}</span>
</div>
</div>
</div>
<div><div className="stat">{"12,000+"}</div>
<p>{"Residents per primary-care clinician, reported by a regional public-health director."}</p>
<p className="fine">{"Participant-reported context from the roundtable, not an independently verified regional estimate. Documented in REBS, Volume 1."}</p>
<a className="textlink" href="/publication/rebs-v1-2025">{"Read"}</a>
</div>
</div>
</section>
<section className="section soft"><div className="shell split"><div><h2>{"Applied cybersecurity."}<br />{"Six-month cohorts."}</h2>
<p>{"SozoRock’s recurring Capella University capstone combines instructional sessions with hands-on cybersecurity projects to develop workforce capabilities in identity and access management, cloud security, and governance, risk and compliance."}</p>
<a className="textlink" href="/platforms/applied-learning">{"Explore"}</a>
</div>
<div><div className="stats"><div><strong>{"6"}</strong>
<span>{"initial cohort"}</span>
</div>
<div><strong>{"5"}</strong>
<span>{"current cohort"}</span>
</div>
<div><strong>{"6"}</strong>
<span>{"months each"}</span>
</div>
</div>
<p>{"Designed and evaluated by "}<strong>{"Dr. Oluwabiyi Adeyemo"}</strong>
{", Director of Strategic Initiatives, who personally mentors every learner."}</p>
</div>
</div>
</section>
<section className="section"><div className="shell worklist"><article><h3>{"SozoRock Global Institute"}</h3>
<p>{"Research on rural health equity, governance and health systems assurance."}</p>
<a className="textlink" href="/platforms/institute">{"Read"}</a>
</article>
<article><h3>{"SozoRock AI Lab"}</h3>
<p>{"Applied AI systems, cybersecurity and AI governance through practical projects."}</p>
<a className="textlink" href="/platforms/ai-lab">{"Explore"}</a>
</article>
<article><h3>{"AI and Society"}</h3>
<p>{"A proposed forum for public participation in AI decisions affecting education and work."}</p>
<a className="textlink" href="/ai-society">{"Explore"}</a>
</article>
</div>
</section>
</>;
case "/platforms": return <>
<section className="hero blue"><div className="shell"><h1>{"What we do"}</h1>
<p>{"Health equity, county intelligence, research and applied AI and cybersecurity learning."}</p>
</div>
</section>
<section className="section"><div className="shell rows"><article><h2>{"SozoRock Health"}</h2>
<div><p>{"Health Equity Hubs, Health Access Day and provider partnerships address the practical conditions around care: health literacy, digital readiness and local support."}</p>
<a className="textlink" href="/platforms/health">{"Explore"}</a>
</div>
</article>
<article><h2>{"CB-CAP"}</h2>
<div><p>{"County evidence for community health-access planning. Explore the public preview and discuss future institutional planning, funding and workforce use."}</p>
<a className="textlink" href="https://cbcap.sozorockfoundation.org/" target="_blank" rel="noopener">{"Explore"}</a>
</div>
</article>
<article><h2>{"Place Intelligence"}</h2>
<div><p>{"County health and community data with geography, source dates and definitions. Search by county, city or ZIP Code; results resolve to county evidence."}</p>
<a className="textlink" href="https://health.sozorockfoundation.org/evidence">{"Explore"}</a>
</div>
</article>
<article><h2>{"SozoRock Global Institute"}</h2>
<div><p>{"Publications on rural health equity, public governance and digital health systems."}</p>
<a className="textlink" href="/platforms/institute">{"Read"}</a>
</div>
</article>
<article><h2>{"SozoRock AI Lab"}</h2>
<div><p>{"Applied AI systems, cybersecurity and AI governance. Practical projects for individuals and organizations."}</p>
<a className="textlink" href="/platforms/ai-lab">{"Explore"}</a>
</div>
</article>
<article><h2>{"SozoRock × Capella University"}</h2>
<div><p>{"Recurring six-month cybersecurity projects, designed, evaluated and personally mentored by Dr. Oluwabiyi Adeyemo."}</p>
<a className="textlink" href="/platforms/applied-learning">{"Explore"}</a>
</div>
</article>
<article><h2>{"AI and Society"}</h2>
<div><p>{"A proposed forum for students, educators, workers and institutions to examine AI decisions and recommend safeguards."}</p>
<a className="textlink" href="/ai-society">{"Explore"}</a>
</div>
</article>
</div>
</section>
</>;
case "/platforms/health": return <>
<section className="hero blue"><div className="shell"><h1>{"SozoRock Health"}</h1>
<p>{"Health equity in libraries, communities and homes."}</p>
<a className="action" href="/partner">{"Partner"}</a>
</div>
</section>
<section className="section" id="hubs"><div className="shell"><div className="hubintro"><h2>{"Health Equity Initiative"}</h2>
<p>{"Health literacy, digital readiness and preparation for provider-led care. Three models, designed for the places people use."}</p>
</div>
<div className="hubset"><article><h3>{"Library Health Equity Hub"}</h3>
<p>{"Health literacy and digital support through local libraries."}</p>
<details><summary>{"Details"}</summary>
<p>{"A proposed library-based model for health information, digital skills and preparation to use provider-led services. Local partners would agree the space, connectivity, privacy and staff responsibilities."}</p>
</details>
</article>
<article><h3>{"Community Health Equity Hub"}</h3>
<p>{"Health education and digital support through community organizations."}</p>
<details><summary>{"Details"}</summary>
<p>{"A proposed community-based model combining local health information, digital support and preparation for provider-led services. Activities would reflect local needs, partner capacity and available services."}</p>
</details>
</article>
<article><h3>{"Home Health Equity Hub"}</h3>
<p>{"Help preparing to use provider platforms from home."}</p>
<details><summary>{"Details"}</summary>
<p>{"A proposed home-based model for people who need support using devices, connectivity or provider platforms. It does not establish a home-care or home-health clinical service."}</p>
</details>
</article>
</div>
<p className="modelnote">{"Proposed partner models. Local implementation depends on agreed responsibilities, available services and delivery capacity. Clinical care remains with licensed providers."}</p>
</div>
</section>
<section className="section soft"><div className="shell focusgrid"><article><h2>{"Health Access Day"}</h2>
<p>{"A proposed community format for health education and health literacy, with locally agreed activities and follow-up."}</p>
</article>
<article><h2>{"Provider partnerships"}</h2>
<p>{"Bring Your Own Platform keeps clinical systems, records, consent and medical decisions with the provider. SozoRock supports nonclinical readiness and coordination."}</p>
</article>
</div>
</section>
<section className="section"><div className="shell"><div className="split"><h2>{"County health data"}</h2>
<div><p>{"Place Intelligence brings county health, community and workforce data into view. CB-CAP connects that evidence with health-access planning questions."}</p>
</div>
</div>
<div style={{"marginTop": "35px"}}><div className="datahead"><h3>{"Albany County, New York"}</h3>
<span>{"County FIPS 36001 · 2022–2023 estimates"}</span>
</div>
<div className="datastrip"><div><strong>{"5.5%"}</strong>
<span>{"Adults without health insurance"}</span>
<small>{"95% interval: 4.2–7.0%"}</small>
</div>
<div><strong>{"7.2%"}</strong>
<span>{"Lack of reliable transportation"}</span>
<small>{"95% interval: 6.1–8.5%"}</small>
</div>
<div><strong>{"12.2%"}</strong>
<span>{"Food insecurity"}</span>
<small>{"95% interval: 9.9–15.0%"}</small>
</div>
</div>
<p className="sources">{"Example captured from SozoRock Health’s Place Intelligence on 22 September 2026. Modeled county estimates describe community conditions, not SozoRock results or an individual’s needs. Review the underlying definitions, eligible populations and sources before use."}</p>
<a className="textlink" href="https://health.sozorockfoundation.org/evidence">{"Explore"}</a>
</div>
</div>
</section>
<section className="section soft"><div className="shell split"><h2>{"The planned"}<br />{"25-person pilot."}</h2>
<div><p>{"Help fund a planned 2027 New York pilot for people facing barriers to ongoing primary care, with Dr. Michael Purcell and PIOC."}</p>
<p className="fine">{"The pilot would combine nonclinical support and health education. Clinical care remains with the licensed provider."}</p>
<a className="textlink" href="/support">{"Support"}</a>
</div>
</div>
</section>
<section className="section"><div className="shell"><h2>{"Digital readiness and workforce development."}</h2>
<div className="rows"><article><h3>{"Devices, connectivity and skills"}</h3>
<div><p>{"Practical preparation to use available services. Voice, text and touch options need consent, accessible alternatives and clear handling of personal information."}</p>
</div>
</article>
<article><h3>{"Local workforce"}</h3>
<div><p>{"Collaborate with educators, employers and community institutions on the skills and capacity a place needs. Training, credentials and licensure stay with the responsible institutions."}</p>
</div>
</article>
<article><h3>{"Research and applied learning"}</h3>
<div><p>{"Connect health-access planning with REBS, RRG and HSA research, the SozoRock AI Lab and recurring graduate cybersecurity projects."}</p>
</div>
</article>
</div>
<a className="textlink" href="/partner">{"Partner"}</a>
</div>
</section>
</>;
case "/platforms/applied-learning": return <>
<section className="hero blue"><div className="shell"><h1>{"Applied cybersecurity. Six-month cohorts."}</h1>
<p>{"A recurring six-month cybersecurity capstone with SozoRock and Capella University: instructional sessions, hands-on experience and workforce capability development."}</p>
<a className="action" href="/partner">{"Partner"}</a>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"Instruction. Practice. Workforce capabilities."}</h2>
<div><p>{"Instructional sessions prepare learners to apply concepts in hands-on projects. Learners configure access controls, review cloud security, assess risk and document their recommendations. Focus areas: identity and access management, governance, risk and compliance (GRC), cloud security and least privilege."}</p>
</div>
</div>
</section>
<section className="section soft"><div className="shell split"><h2>{"Two cohorts, continuing collaboration"}</h2>
<div><p>{"Six learners in the initial cohort. Five in the current cohort. Six months per cohort."}</p>
</div>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"Designed, evaluated and mentored"}</h2>
<div><p>{"Dr. Oluwabiyi Adeyemo, Director of Strategic Initiatives, designs and evaluates the applied experience and personally mentors every learner. Capella University retains academic oversight and grading."}</p>
</div>
</div>
</section>
<section className="section soft"><div className="shell split"><h2>{"For universities and employers"}</h2>
<div><p>{"Discuss an applied cybersecurity project for your learners. Project scope, supervision and assessment would be agreed before work begins."}</p>
</div>
</div>
</section>
</>;
case "/platforms/institute": return <>
<section className="hero blue"><div className="shell"><h1>{"SozoRock Global Institute"}</h1>
<p>{"Rural health equity, public governance and health systems assurance."}</p>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"Research for community and institutional decisions"}</h2>
<div><p>{"REBS examines rural health access and hub models. RRG examines public governance. HSA examines trust and accountability in digital health systems."}</p>
<a className="textlink" href="/publications">{"Read"}</a>
</div>
</div>
</section>
<section className="section soft"><div className="shell split"><h2>{"Research partnerships"}</h2>
<div><p>{"Discuss a research question, roundtable or publication sponsorship. Authors retain responsibility for findings and conclusions."}</p>
<a className="textlink" href="/partner">{"Partner"}</a>
</div>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"SozoRock preplanning roundtable"}</h2>
<div><p>{"Review the 2025 Western New York discussion that informs the Foundation’s rural health-access research."}</p>
<a className="textlink" href="/events">{"Read"}</a>
</div>
</div>
</section>
</>;
case "/platforms/ai-lab": return <>
<section className="hero blue"><div className="shell"><h1>{"SozoRock AI Lab"}</h1>
<p>{"Applied AI systems. Cybersecurity. AI governance."}</p>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"Practical AI learning"}</h2>
<div><p>{"Build and review an applied project, with attention to security and human oversight. One documented participant developed and deployed a business website."}</p>
<a className="textlink" href="https://ai-lab.sozorockfoundation.org/" target="_blank" rel="noopener">{"Explore"}</a>
</div>
</div>
</section>
<section className="section soft"><div className="shell split"><h2>{"A participant project"}</h2>
<div><p>{"One participant developed and deployed a business website through the SozoRock AI Lab. It demonstrates a completed learning project, not a placement or earnings outcome."}</p>
<a className="textlink" href="https://www.capitalpropertycare.com/" target="_blank" rel="noopener">{"View"}</a>
</div>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"Learning for organizations"}</h2>
<div><p>{"Discuss learning needs across applied AI systems, identity and access management, cloud security and governance. Dates, scope and delivery are confirmed by the AI Lab."}</p>
<a className="textlink" href="/partner">{"Partner"}</a>
</div>
</div>
</section>
</>;
case "/ai-society": return <>
<section className="hero blue"><div className="shell"><h1>{"A public voice in AI decisions."}</h1>
<p>{"Who Decides? A proposed SozoRock initiative for AI in education and work."}</p>
<a className="action" href="#interest">{"Participate"}</a>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"When an AI tool flags a student’s work"}</h2>
<div><p>{"What evidence should an educator review? Who can challenge the result? Explore the example below. This is an illustrative scenario, not an actual case."}</p>
</div>
</div>
</section>
<section className="section soft"><div className="shell split"><h2>{"What participants would do"}</h2>
<div><p>{"Students, educators, workers and job seekers would examine an AI decision, identify concerns and recommend safeguards. Institutions would be invited to respond."}</p>
</div>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"What would be published"}</h2>
<div><p>{"The questions raised, evidence considered, recommendations and institutional responses. These outputs are planned; no convening date or institutional commitment is announced."}</p>
</div>
</div>
</section>
<section className="section soft"><div className="shell split"><h2>{"Help make the first discussions possible"}</h2>
<div><p>{"Support could fund participant compensation, accessible facilitation and publication of findings. Hosts could contribute venues and expertise. Support would not direct the findings."}</p>
<a className="textlink" href="/support">{"Discuss support"}</a>
</div>
</div>
</section>
<section className="section formsection" id="interest"><div className="shell formlayout"><div><h2>{"Express interest"}</h2>
<p>{"No technical background is required. This records interest; places and dates are not yet confirmed."}</p>
</div>
<EngagementForm kind="Participation" /></div>
</section>
<section className="section"><DiscussionScenario /></section>
</>;
case "/publications": return <>
<section className="hero blue"><div className="shell"><h1>{"Publications"}</h1>
<p>{"Rural health. Public governance. Health systems assurance."}</p>
</div>
</section>
<section className="section"><div className="shell grid3"><article><img src="/media/hsa-cover.webp" alt="Health Systems Assurance cover" decoding="async" /><h2>{"Health Systems Assurance"}</h2>
<p>{"What evidence supports trust in digital health systems?"}</p>
<a className="textlink" href="/publication/hsa-v1-2026">{"Read more"}</a>
</article>
<article><img src="/media/rrg-cover.webp" alt="Rethinking Rural Governance cover" decoding="async" /><h2>{"Rethinking Rural Governance"}</h2>
<p>{"Coordinating public decisions in rural communities."}</p>
<a className="textlink" href="/publication/rrg-v1-2025">{"Read more"}</a>
</article>
<article><img src="/media/rebs-cover.webp" alt="Rural Equity Blueprint Series cover" decoding="async" /><h2>{"Rural Equity Blueprint Series"}</h2>
<p>{"Planning rural health access."}</p>
<a className="textlink" href="/publication/rebs-v1-2025">{"Read more"}</a>
</article>
</div>
</section>
</>;
case "/publication/hsa-v1-2026": return <>
<section className="hero soft"><div className="shell bookdetail"><img src="/media/hsa-cover.webp" alt="Health Systems Assurance cover" decoding="async" /><div><h1>{"Health Systems Assurance"}</h1>
<p>{"What evidence supports trust in digital health systems?"}</p>
<p className="metadata">{"Volume 1 · Dr. Oluwabiyi Adeyemo · 2026"}</p>
<a className="action" href="/publication/hsa-v1-2026/access">{"Read"}</a>
</div>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"Overview"}</h2>
<div><p>{"A proposed approach to reviewing obligations, controls, risks and exceptions in digital health systems."}</p>
</div>
</div>
</section>
<section className="section soft"><div className="shell split"><h2>{"Scope"}</h2>
<div><p>{"Proposed analytical tools and a research agenda. Not a validated standard, certification, audit or professional advice."}</p>
</div>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"Publication details"}</h2>
<div><p>{"Volume 1 · 2026"}<br />{"Dr. Oluwabiyi Adeyemo"}<br />{"The SozoRock Foundation, Inc."}<br />{"ISBN 979-8-9936477-3-9"}</p>
</div>
</div>
</section>
<section className="section soft"><div className="shell"><h2>{"Citation"}</h2>
<p className="citation">{"Adeyemo, Oluwabiyi. 2026. Health Systems Assurance, Volume 1. The SozoRock Foundation, Inc."}</p>
<CitationButton /></div>
</section>
</>;
case "/publication/hsa-v1-2026/access": return <>
<section className="hero soft"><div className="shell"><h1>{"Read Health Systems Assurance"}</h1>
<p>{"Free PDF. Verify your email to open the publication."}</p>
</div>
</section>
<section className="section"><div className="shell formlayout"><div><h2>{"Your copy, by email."}</h2>
<p>{"Enter your name and email. We’ll send a verification link for access."}</p>
<p className="fine">{"Publication updates are optional. No payment is required."}</p>
</div>
<PublicationAccessPage embedded publication={publications.find(p => p.accessPath === pathname)} /></div>
</section>
</>;
case "/publication/rrg-v1-2025": return <>
<section className="hero soft"><div className="shell bookdetail"><img src="/media/rrg-cover.webp" alt="Rethinking Rural Governance cover" decoding="async" /><div><h1>{"Rethinking Rural Governance"}</h1>
<p>{"Coordinating public decisions in rural communities."}</p>
<p className="metadata">{"Volume 1 · Dr. Oluwabiyi Adeyemo · 2025"}</p>
<a className="action" href="/publication/rrg-v1-2025/access">{"Read"}</a>
</div>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"Overview"}</h2>
<div><p>{"Examines institutional roles, local capacity and coordination across rural public services."}</p>
</div>
</div>
</section>
<section className="section soft"><div className="shell split"><h2>{"Scope"}</h2>
<div><p>{"A proposed governance framework. The Delaware County reference case does not establish adoption, validation or measured outcomes."}</p>
</div>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"Publication details"}</h2>
<div><p>{"Volume 1 · 2025"}<br />{"Dr. Oluwabiyi Adeyemo"}<br />{"The SozoRock Foundation, Inc."}<br />{"DOI 10.65473/rrg-v1-2025"}</p>
</div>
</div>
</section>
<section className="section soft"><div className="shell"><h2>{"Citation"}</h2>
<p className="citation">{"Adeyemo, Oluwabiyi. 2025. Rethinking Rural Governance, Volume 1. The SozoRock Foundation, Inc. https://doi.org/10.65473/rrg-v1-2025"}</p>
<CitationButton /><a className="textlink" href="https://doi.org/10.65473/rrg-v1-2025" target="_blank" rel="noopener">{"Open DOI"}</a>
</div>
</section>
</>;
case "/publication/rrg-v1-2025/access": return <>
<section className="hero soft"><div className="shell"><h1>{"Read Rethinking Rural Governance"}</h1>
<p>{"Free PDF. Verify your email to open the publication."}</p>
</div>
</section>
<section className="section"><div className="shell formlayout"><div><h2>{"Your copy, by email."}</h2>
<p>{"Enter your name and email. We’ll send a verification link for access."}</p>
<p className="fine">{"Publication updates are optional. No payment is required."}</p>
</div>
<PublicationAccessPage embedded publication={publications.find(p => p.accessPath === pathname)} /></div>
</section>
</>;
case "/publication/rebs-v1-2025": return <>
<section className="hero soft"><div className="shell bookdetail"><img src="/media/rebs-cover.webp" alt="Rural Equity Blueprint Series cover" decoding="async" /><div><h1>{"Rural Equity Blueprint Series"}</h1>
<p>{"Planning rural health access."}</p>
<p className="metadata">{"Volume 1 · Dr. Oluwabiyi Adeyemo · 2025"}</p>
<a className="action" href="/publication/rebs-v1-2025/access">{"Read"}</a>
</div>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"Overview"}</h2>
<div><p>{"Connects health literacy, technology, workforce and local capacity in proposed health-access models."}</p>
</div>
</div>
</section>
<section className="section soft"><div className="shell split"><h2>{"Scope"}</h2>
<div><p>{"Proposed models, not evidence of operating services or measured health outcomes. Implementation depends on partners, capacity and licensed providers."}</p>
</div>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"Publication details"}</h2>
<div><p>{"Volume 1 · 2025"}<br />{"Dr. Oluwabiyi Adeyemo"}<br />{"The SozoRock Foundation, Inc."}<br />{"DOI 10.65473/rebs-v1-2025"}</p>
</div>
</div>
</section>
<section className="section soft"><div className="shell"><h2>{"Citation"}</h2>
<p className="citation">{"Adeyemo, Oluwabiyi. 2025. Rural Equity Blueprint Series, Volume 1. The SozoRock Foundation, Inc. https://doi.org/10.65473/rebs-v1-2025"}</p>
<CitationButton /><a className="textlink" href="https://doi.org/10.65473/rebs-v1-2025" target="_blank" rel="noopener">{"Open DOI"}</a>
</div>
</section>
</>;
case "/publication/rebs-v1-2025/access": return <>
<section className="hero soft"><div className="shell"><h1>{"Read Rural Equity Blueprint Series"}</h1>
<p>{"Free PDF. Verify your email to open the publication."}</p>
</div>
</section>
<section className="section"><div className="shell formlayout"><div><h2>{"Your copy, by email."}</h2>
<p>{"Enter your name and email. We’ll send a verification link for access."}</p>
<p className="fine">{"Publication updates are optional. No payment is required."}</p>
</div>
<PublicationAccessPage embedded publication={publications.find(p => p.accessPath === pathname)} /></div>
</section>
</>;
case "/insights": return <>
<section className="hero blue"><div className="shell"><h1>{"Insights"}</h1>
<p>{"Notes from SozoRock’s research and programs."}</p>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"Current work"}</h2>
<div><p>{"Read our publications on rural health access, governance and digital health systems."}</p>
<a className="textlink" href="/publications">{"Publications"}</a>
</div>
</div>
</section>
</>;
case "/events": return <>
<section className="hero blue"><div className="shell"><h1>{"Roundtables and briefings"}</h1>
<p>{"Health access, research and AI in public life."}</p>
<a className="action" href="/partner">{"Partner"}</a>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"SozoRock preplanning roundtable"}</h2>
<div><p>{"Western New York · September 22, 2025"}<br />{"12 participants. Two county public-health jurisdictions. Two universities."}</p>
</div>
</div>
</section>
<section className="section soft"><div className="shell split"><h2>{"What was reported"}</h2>
<div><p>{"A regional public-health director reported more than 12,000 residents per primary-care clinician. REBS documents the discussion. Participation does not imply institutional endorsement."}</p>
<a className="textlink" href="/publication/rebs-v1-2025">{"Read the findings"}</a>
</div>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"Future discussions"}</h2>
<div><p>{"AI and Society is developing discussions on AI in education and work. Dates and participation details will appear when confirmed."}</p>
<a className="textlink" href="/ai-society">{"AI and Society"}</a>
</div>
</div>
</section>
</>;
case "/about": return <>
<section className="hero blue"><div className="shell"><h1>{"Who we are"}</h1>
<p>{"Health equity, county intelligence and applied learning for communities and institutions."}</p>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"What connects our work"}</h2>
<div><p>{"Health Equity Hubs address practical barriers around care. Place Intelligence and CB-CAP bring local evidence into planning. Research and applied learning support the people and institutions doing that work."}</p>
<a className="textlink" href="/platforms">{"Explore"}</a>
</div>
</div>
</section>
<section className="section soft"><div className="shell split"><h2>{"Where we work with partners"}</h2>
<div><p>{"Libraries, community organizations, licensed providers, universities, public agencies, employers and funders. Each collaboration has agreed responsibilities and a clear purpose."}</p>
<a className="textlink" href="/partner">{"Partner"}</a>
</div>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"Our people"}</h2>
<div><p>{"Meet the team responsible for health partnerships, health education, global affairs and strategic initiatives."}</p>
<a className="textlink" href="/leadership">{"Leadership"}</a>
</div>
</div>
</section>
<section className="section soft"><div className="shell split"><h2>{"Our responsibilities"}</h2>
<div><p>{"We distinguish operating services, public previews and proposed models. Clinical decisions stay with licensed providers; academic decisions stay with universities."}</p>
<a className="textlink" href="/standards">{"Standards"}</a>
</div>
</div>
</section>
</>;
case "/leadership": return <>
<section className="hero blue"><div className="shell"><h1>{"Leadership"}</h1>
<p>{"The people responsible for SozoRock’s work."}</p>
</div>
</section>
<section className="section"><div className="shell leadergrid"><article><img src="/leadership/nike-oye.webp" alt="Nike Oye, MBA" decoding="async" /><h2>{"Nike Oye, MBA"}</h2>
<p>{"Director of Global Health Partnerships"}<br />{"Leads institutional relationships for health-access initiatives."}</p>
</article>
<article><img src="/leadership/anthony-abraham.jpg" alt="Anthony Abraham, MSC" decoding="async" /><h2>{"Anthony Abraham, MSC"}</h2>
<p>{"Director of Global Affairs"}<br />{"Leads international relationships across health, academic and development organizations."}</p>
</article>
<article><img src="/leadership/jordan-hare.webp" alt="Jordan Hare, BSN, RN" decoding="async" /><h2>{"Jordan Hare, BSN, RN"}</h2>
<p>{"Director of Health Education"}<br />{"Leads health literacy, community education and workforce mentorship."}</p>
</article>
<article><img src="/leadership/dr-oluwabiyi-adeyemo.webp" alt="Dr. Oluwabiyi Adeyemo" decoding="async" /><h2>{"Dr. Oluwabiyi Adeyemo"}</h2>
<p>{"Director of Strategic Initiatives"}<br />{"Leads research, technology and program development. Designs and evaluates the cybersecurity learning experience and personally mentors every learner."}</p>
</article>
</div>
</section>
</>;
case "/support": return <>
<section className="hero blue"><div className="shell"><h1>{"Help fund the 25-person pilot."}</h1>
<p>{"Support SozoRock’s planned New York primary care pilot—or discuss funding for health equity, county data, research and applied learning."}</p>
<a className="action" href="#inquiry">{"Support"}</a>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"Primary care pilot"}</h2>
<div><p>{"Help fund nonclinical coordination, health education and evaluation for the planned 2027 New York pilot with Dr. Michael Purcell and PIOC."}</p>
</div>
</div>
</section>
<section className="section soft"><div className="shell split"><h2>{"Health Equity Initiative"}</h2>
<div><p>{"Discuss support for Library, Community or Home Health Equity Hub development, Health Access Day, digital readiness or local health education."}</p>
</div>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"Data and research"}</h2>
<div><p>{"Discuss support for public evidence access, CB-CAP development, independent research or a publication series."}</p>
</div>
</div>
</section>
<section className="section soft"><div className="shell split"><h2>{"Learning and public participation"}</h2>
<div><p>{"Support applied AI and cybersecurity learning, recurring graduate projects or planned AI and Society discussions."}</p>
</div>
</div>
</section>
<section className="section formsection" id="inquiry"><div className="shell formlayout"><div><h2>{"Discuss support"}</h2>
<p>{"Tell us how you would like to contribute. This is an inquiry, not a payment form."}</p>
<p className="fine">{"The SozoRock Foundation, Inc. is a 501(c)(3) public charity. EIN 39-4736725. Contributions are tax-deductible as allowed by law."}</p>
</div>
<EngagementForm kind="Support" /></div>
</section>
</>;
case "/partner": return <>
<section className="hero blue"><div className="shell"><h1>{"Partner with SozoRock."}</h1>
<p>{"Bring local knowledge, clinical expertise, technology or applied learning to a shared project."}</p>
<a className="action" href="#inquiry">{"Partner"}</a>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"Libraries and community organizations"}</h2>
<div><p>{"Discuss a Library or Community Health Equity Hub, Home Health Equity Hub support, or Health Access Day."}</p>
</div>
</div>
</section>
<section className="section soft"><div className="shell split"><h2>{"Licensed providers"}</h2>
<div><p>{"Discuss the planned primary care pilot or digital readiness around your existing clinical platform."}</p>
</div>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"Counties and public agencies"}</h2>
<div><p>{"Explore county evidence and discuss future CB-CAP planning needs across community health assessments, improvement plans, funding and workforce."}</p>
</div>
</div>
</section>
<section className="section soft"><div className="shell split"><h2>{"Universities and employers"}</h2>
<div><p>{"Develop an applied cybersecurity cohort, AI learning project, research collaboration or workforce initiative."}</p>
</div>
</div>
</section>
<section className="section"><div className="shell split"><h2>{"Technology partners"}</h2>
<div><p>{"Contribute devices, connectivity, cloud resources or expertise to an agreed health-access or learning project."}</p>
</div>
</div>
</section>
<section className="section formsection" id="inquiry"><div className="shell formlayout"><div><h2>{"Discuss a partnership"}</h2>
<p>{"We’ll use your details to respond to your inquiry."}</p>
</div>
<EngagementForm kind="Partner" /></div>
</section>
</>;
case "/contact": return <>
<section className="hero blue"><div className="shell"><h1>{"Contact SozoRock"}</h1>
<p>{"Questions about our work, publications or website?"}</p>
</div>
</section>
<section className="section formsection" id="inquiry"><div className="shell formlayout"><div><h2>{"Send a message"}</h2>
<p>{"We’ll use your details to respond to your inquiry."}</p>
<a className="textlink" href="mailto:contact@sozorockfoundation.org">{"contact@sozorockfoundation.org"}</a>
</div>
<EngagementForm kind="Contact" /></div>
</section>
</>;
case "/standards": return <>
<section className="hero policyhero"><div className="shell"><h1>{"Standards"}</h1>
<p>{"How we publish, disclose support and correct errors."}</p>
</div>
</section>
<section className="section"><div className="shell policy"><aside aria-label="Contents"><a className="" href="#s0">{"Independence"}</a>
<a className="" href="#s1">{"Evidence"}</a>
<a className="" href="#s2">{"Corrections"}</a>
<a className="" href="#s3">{"Funding"}</a>
<a className="" href="#s4">{"Authorship and AI"}</a>
<a className="" href="#s5">{"Rights and access"}</a>
<p className="fine">{"Effective September 22, 2026"}</p>
</aside>
<div><article id="s0"><h2>{"Independence"}</h2>
<p>{"The Foundation and named authors are responsible for research conclusions. Funding does not purchase a conclusion."}</p>
</article>
<article id="s1"><h2>{"Evidence"}</h2>
<p>{"We identify proposed models, participant reports, observations, estimates and measured outcomes. Claims link to their sources and limitations."}</p>
</article>
<article id="s2"><h2>{"Corrections"}</h2>
<p>{"Report an error to contact@sozorockfoundation.org with the page or publication and supporting source. Material corrections explain what changed and preserve the publication record."}</p>
</article>
<article id="s3"><h2>{"Funding"}</h2>
<p>{"Relevant funding, sponsorship and substantial in-kind support are disclosed with the work. Participation and support do not imply endorsement."}</p>
</article>
<article id="s4"><h2>{"Authorship and AI"}</h2>
<p>{"We identify authors and contributors accurately. AI may assist research, design, coding and workflow; human reviewers remain responsible for the published work."}</p>
</article>
<article id="s5"><h2>{"Rights and access"}</h2>
<p>{"Citations do not grant reproduction rights. Check each publication’s notice. Contact us about permissions or accessible formats."}</p>
</article>
<p><a className="textlink" href="mailto:contact@sozorockfoundation.org">{"contact@sozorockfoundation.org"}</a>
</p>
</div>
</div>
</section>
</>;
case "/privacy": return <>
<section className="hero policyhero"><div className="shell"><h1>{"Privacy"}</h1>
<p>{"How we handle information submitted through this website."}</p>
</div>
</section>
<section className="section"><div className="shell policy"><aside aria-label="Contents"><a className="" href="#s0">{"Scope"}</a>
<a className="" href="#s1">{"Information collected"}</a>
<a className="" href="#s2">{"Use and service providers"}</a>
<a className="" href="#s3">{"Retention"}</a>
<a className="" href="#s4">{"Your choices"}</a>
<a className="" href="#s5">{"Security"}</a>
<a className="" href="#s6">{"Contact and changes"}</a>
<p className="fine">{"Effective September 22, 2026"}</p>
</aside>
<div><article id="s0"><h2>{"Scope"}</h2>
<p>{"This notice covers the parent website and its forms. Platform services may have additional notices. Publication and inquiry delivery use SozoRock Health services; read its privacy notice for those services."}</p>
</article>
<article id="s1"><h2>{"Information collected"}</h2>
<p>{"Forms collect the details you submit, including name, email, affiliation, interests and message. Do not send sensitive medical, student, employee, financial, legal or account information."}</p>
</article>
<article id="s2"><h2>{"Use and service providers"}</h2>
<p>{"We use submissions to respond, provide publications, understand participation interest, protect services and keep related records. Hosting, security and email providers may process information for these purposes."}</p>
</article>
<article id="s3"><h2>{"Retention"}</h2>
<p>{"We keep information as reasonably needed for its purpose, security, recordkeeping and applicable obligations. Periods vary by form and service."}</p>
</article>
<article id="s4"><h2>{"Your choices"}</h2>
<p>{"We do not sell personal information or use this website for behavioral advertising. Ask to review, correct or delete your submissions. Some records may need to be retained for security or legal obligations. Publication updates are optional; consent can be withdrawn."}</p>
</article>
<article id="s5"><h2>{"Security"}</h2>
<p>{"We use administrative, technical and operational safeguards. No website, email or storage system is completely secure. Do not use public forms for urgent or sensitive matters."}</p>
</article>
<article id="s6"><h2>{"Contact and changes"}</h2>
<p>{"Email contact@sozorockfoundation.org with privacy questions. We update this notice when services or practices change and publish the effective date."}</p>
</article>
<a className="textlink" href="https://health.sozorockfoundation.org/privacy" target="_blank" rel="noopener">{"SozoRock Health privacy notice"}</a>
<p><a className="textlink" href="mailto:contact@sozorockfoundation.org">{"contact@sozorockfoundation.org"}</a>
</p>
</div>
</div>
</section>
</>;
case "/terms": return <>
<section className="hero policyhero"><div className="shell"><h1>{"Website terms"}</h1>
<p>{"Conditions for using this website and its materials."}</p>
</div>
</section>
<section className="section"><div className="shell policy"><aside aria-label="Contents"><a className="" href="#s0">{"Information and advice"}</a>
<a className="" href="#s1">{"Use and copyright"}</a>
<a className="" href="#s2">{"Prohibited activity"}</a>
<a className="" href="#s3">{"Forms"}</a>
<a className="" href="#s4">{"External services"}</a>
<a className="" href="#s5">{"Availability and corrections"}</a>
<a className="" href="#s6">{"Contact"}</a>
<p className="fine">{"Effective September 22, 2026"}</p>
</aside>
<div><article id="s0"><h2>{"Information and advice"}</h2>
<p>{"This site provides general information, not medical, legal, tax, investment, cybersecurity, certification or emergency advice. Use does not create a clinical, professional, fiduciary, auditor or client relationship."}</p>
</article>
<article id="s1"><h2>{"Use and copyright"}</h2>
<p>{"Use the site lawfully. You may cite or link to public pages. Publication-specific copyright and permissions govern reproduction and reuse."}</p>
</article>
<article id="s2"><h2>{"Prohibited activity"}</h2>
<p>{"Do not disrupt the service, bypass access controls, submit malicious or unlawful content, unlawfully collect data or imply Foundation affiliation without permission."}</p>
</article>
<article id="s3"><h2>{"Forms"}</h2>
<p>{"Provide accurate information. Do not submit sensitive medical, student, employee, financial, legal or account details. Submitting a form does not establish a partnership, funding agreement or participation commitment. Publication access follows its stated verification process."}</p>
</article>
<article id="s4"><h2>{"External services"}</h2>
<p>{"Linked websites and Foundation platforms may have separate terms, privacy notices and service conditions."}</p>
</article>
<article id="s5"><h2>{"Availability and corrections"}</h2>
<p>{"We aim for accurate information and available services, but do not guarantee completeness, currency or uninterrupted access. We may correct, update or remove material while preserving appropriate publication records."}</p>
</article>
<article id="s6"><h2>{"Contact"}</h2>
<p>{"For rights or terms questions, email contact@sozorockfoundation.org. Publication notices identify ownership and third-party rights."}</p>
</article>
<p><a className="textlink" href="mailto:contact@sozorockfoundation.org">{"contact@sozorockfoundation.org"}</a>
</p>
</div>
</div>
</section>
</>;
case "/accessibility": return <>
<section className="hero policyhero"><div className="shell"><h1>{"Accessibility"}</h1>
<p>{"Request help accessing our website, publications or activities."}</p>
</div>
</section>
<section className="section"><div className="shell policy"><aside aria-label="Contents"><a className="" href="#s0">{"Our goal"}</a>
<a className="" href="#s1">{"Website access"}</a>
<a className="" href="#s2">{"Documents and other services"}</a>
<a className="" href="#s3">{"Report a barrier"}</a>
<a className="" href="#s4">{"Review"}</a>
<p className="fine">{"Effective September 22, 2026"}</p>
</aside>
<div><article id="s0"><h2>{"Our goal"}</h2>
<p>{"We aim to meet WCAG 2.2 Level AA. This is a continuing design and testing goal, not a certification of every page or document."}</p>
</article>
<article id="s1"><h2>{"Website access"}</h2>
<p>{"Our approach includes keyboard navigation, visible focus, readable contrast, form labels, meaningful headings, alternative text and reduced-motion support."}</p>
</article>
<article id="s2"><h2>{"Documents and other services"}</h2>
<p>{"Some historical documents and third-party services may have limitations. Contact us for an accessible format or accommodation."}</p>
</article>
<article id="s3"><h2>{"Report a barrier"}</h2>
<p>{"Email contact@sozorockfoundation.org. Include the page or document, the barrier and the format or accommodation you need. Device or assistive-technology details can help but are optional. We will review the request and respond with available options."}</p>
</article>
<article id="s4"><h2>{"Review"}</h2>
<p>{"We review accessibility as services change and prioritize barriers affecting core information and access."}</p>
</article>
<p><a className="textlink" href="mailto:contact@sozorockfoundation.org">{"contact@sozorockfoundation.org"}</a>
</p>
</div>
</div>
</section>
</>;
case "/nondiscrimination": return <>
<section className="hero policyhero"><div className="shell"><h1>{"Nondiscrimination"}</h1>
<p>{"Equal access and respectful participation."}</p>
</div>
</section>
<section className="section"><div className="shell policy"><aside aria-label="Contents"><a className="" href="#s0">{"Equal access"}</a>
<a className="" href="#s1">{"Accommodations"}</a>
<a className="" href="#s2">{"Partners and venues"}</a>
<a className="" href="#s3">{"Concerns"}</a>
<p className="fine">{"Effective September 22, 2026"}</p>
</aside>
<div><article id="s0"><h2>{"Equal access"}</h2>
<p>{"The Foundation does not discriminate in programs, services, partnerships or public resources on the basis of race, color, national origin, ancestry, ethnicity, religion, sex, pregnancy, sexual orientation, gender identity or expression, age, disability, veteran status or other status protected by applicable law."}</p>
</article>
<article id="s1"><h2>{"Accommodations"}</h2>
<p>{"We seek to provide reasonable accommodations and language access where practicable. Contact us before an activity to discuss what would help you participate."}</p>
</article>
<article id="s2"><h2>{"Partners and venues"}</h2>
<p>{"Participating organizations and venues are expected to support lawful, respectful access within their roles. Participation does not transfer responsibilities or imply endorsement."}</p>
</article>
<article id="s3"><h2>{"Concerns"}</h2>
<p>{"Email contact@sozorockfoundation.org with enough information for us to review a concern. Retaliation for raising a good-faith concern is not acceptable."}</p>
</article>
<p><a className="textlink" href="mailto:contact@sozorockfoundation.org">{"contact@sozorockfoundation.org"}</a>
</p>
</div>
</div>
</section>
</>;
default: return null;
}}
export const approvedRoutes = ["/", "/platforms", "/platforms/health", "/platforms/applied-learning", "/platforms/institute", "/platforms/ai-lab", "/ai-society", "/publications", "/publication/hsa-v1-2026", "/publication/hsa-v1-2026/access", "/publication/rrg-v1-2025", "/publication/rrg-v1-2025/access", "/publication/rebs-v1-2025", "/publication/rebs-v1-2025/access", "/insights", "/events", "/about", "/leadership", "/support", "/partner", "/contact", "/standards", "/privacy", "/terms", "/accessibility", "/nondiscrimination"];
