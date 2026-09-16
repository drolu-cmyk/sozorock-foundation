import { CbcapEvidence, EngagementForm, PageHero, PublicationCard, SectionHeading, StandardsStrip } from "./components";
import { insights, partnerRoutes, platforms, publications } from "./siteData";
import { Link } from "./router";

export function PlatformsPage() {
  return <>
    <PageHero eyebrow="Work" title="Platforms" copy="Research, health access, public systems, county evidence and practical AI learning. Explore the work and its current scope." />
    <section className="section platform-detail-list"><div className="shell">
      {platforms.map((platform) => <article className="platform-detail" key={platform.slug}>
        <div><p className="eyebrow">{platform.name}</p><h2>{platform.line}</h2></div>
        <div><p>{platform.detail}</p><Link href={platform.href} className="text-link">{platform.action}</Link></div>
      </article>)}
      <p className="society-work-context">Across the Global Institute and AI Lab, <Link href="/ai-society" className="society-inline-link">AI &amp; Society</Link> is an emerging area of work on participation, evaluation and public accountability.</p>
    </div></section>
  </>;
}

export function InstitutePage() {
  return <>
    <PageHero eyebrow="By The SozoRock Foundation" title="SozoRock Global Institute" copy="Research on governance, health access, systems assurance and public-sector capacity, including the realities facing rural institutions.">
      <div className="button-row"><Link href="/publications" className="button button-light">Read publications</Link><Link href="/events" className="button button-outline-light">Explore convening</Link></div>
    </PageHero>
    <section className="section"><div className="shell"><SectionHeading eyebrow="Research" title="Evidence worth examining." /><div className="publication-cards">{publications.map((publication) => <PublicationCard publication={publication} key={publication.slug} />)}</div></div></section>
    <section className="section soft-section"><div className="shell split-copy">
      <div><p className="eyebrow">Convene</p><h2>Firesides, roundtables, and briefings.</h2></div>
      <div><p>Future convenings will examine research and community questions with people affected by them. Formats and schedules will develop as participation and delivery capacity are secured.</p><Link href="/events" className="text-link">Explore events</Link><p className="society-institute-context"><Link href="/ai-society" className="society-inline-link">AI &amp; Society</Link> focuses on community participation, human judgment and accountability in consequential AI decisions.</p></div>
    </div></section>
  </>;
}

export function HealthPage() {
  const healthPrograms = [
    ["Community access", "Health Equity Hubs, Health Access Day and practical support around reaching available care."],
    ["Evidence and intelligence", "Place Intelligence and CB-CAP connect local evidence with its sources, dates and limits."],
    ["Digital readiness and assurance", "Practical readiness, cybersecurity and evidence-based assurance for digital health systems."],
    ["Workforce capacity", "Education and partnership pathways informed by the capabilities a community needs."],
  ];
  return <>
    <PageHero eyebrow="Initiative" title="SozoRock Health" copy="Community access. Place-based intelligence. Digital assurance. Workforce capacity.">
      <div className="button-row"><a href="https://health.sozorockfoundation.org/" className="button button-light">Open SozoRock Health</a><a href="https://health.sozorockfoundation.org/explore" className="button button-outline-light">Explore a place</a></div>
    </PageHero>
    <section className="section media-story"><div className="shell media-story-grid">
      <div className="media-frame"><img src="/media/health-access.webp" alt="Two people use a tablet together in a community library" /></div>
      <div><p className="eyebrow">Systems for health access</p><h2>Care can exist. Access still takes a system.</h2><p>SozoRock Health develops practical models, evidence and capabilities to help communities and institutions address barriers to care, with rural and underserved places among its priorities.</p><p className="boundary">SozoRock Health does not diagnose, treat or prescribe, and does not replace a licensed practitioner. It is not a clinic, provider or telehealth platform.</p></div>
    </div></section>
    <section className="section soft-section"><div className="shell"><SectionHeading eyebrow="Work" title="One purpose. Connected capabilities." /><div className="work-list">{healthPrograms.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <CbcapEvidence />
  </>;
}

export function PublicationsPage() {
  return <>
    <PageHero eyebrow="Research" title="Publications" copy="Research on health access, governance, public systems and the evidence behind digital health." />
    <section className="section" id="doi"><div className="shell publication-index">
      {publications.map((publication) => <article className="publication-entry" key={publication.slug}>
        <div className="publication-entry-meta"><p className="eyebrow">{publication.theme}</p><p>{publication.date}<br />{publication.volume}</p></div>
        <div><h2><Link href={publication.path}>{publication.title}</Link></h2><p>{publication.description}</p><p className="publication-entry-author">{publication.author}</p><div className="publication-entry-links"><Link href={publication.path} className="text-link">Read the overview</Link>{publication.doi ? <a href={`https://doi.org/${publication.doi}`}>DOI: {publication.doi}</a> : <span>ISBN: {publication.isbn}</span>}</div></div>
      </article>)}
      <p className="publication-index-note">Each record includes the publication’s scope, limitations, citation and full-text access. Email verification is required for the free PDF; publication updates are optional.</p>
    </div></section>
    <section className="section soft-section publication-cataloging" aria-labelledby="cataloging-title"><div className="shell split-copy">
      <div><p className="eyebrow">Library discovery</p><h2 id="cataloging-title">Available through research and academic catalogs.</h2></div>
      <div><p><strong>Rural Equity Blueprint Series, Volume 1</strong> and <strong>Rethinking Rural Governance Series, Volume 1</strong> are cataloged by the Regent Joseph E. Bowman Jr. Research Library at the New York State Library and in the SUNY library system through Begley Library at SUNY Schenectady County Community College.</p><p className="cataloging-boundary">Cataloging records a library holding and supports discovery. It does not indicate endorsement, adoption, implementation or an institutional partnership.</p></div>
    </div></section>
    <StandardsStrip />
  </>;
}

export function InsightsPage() {
  return <>
    <PageHero eyebrow="Ideas" title="Insights" copy="Updates from the Foundation’s work in health access, public systems, county evidence and applied learning." />
    <section className="section" id="notes"><div className="shell"><div className="insight-list">{insights.map((story, index) => {
      const anchor = index === 0 ? "field-updates" : story.type === "Systems intelligence" ? "systems-intelligence" : undefined;
      return <article id={anchor} key={story.title}><p className="story-meta">{story.type}</p><h2><a href={story.href}>{story.title}</a></h2><p>{story.summary}</p><span>{story.source}</span></article>;
    })}</div></div></section>
    <section className="section soft-section" id="briefings"><div className="shell split-copy"><div><p className="eyebrow">Briefings</p><h2>Examine the evidence together.</h2></div><div><p>Request a focused briefing on assurance, health access, systems intelligence, community evidence, governance or applied AI learning.</p><Link href="/partner" className="text-link">Request a briefing</Link></div></div></section>
  </>;
}

export function EventsPage() {
  return <>
    <PageHero eyebrow="Events" title="Conversations that lead somewhere." copy="Firesides and Roundtables are being developed to connect lived experience, public evidence and institutional response. Dates and participation will be published when confirmed." />
    <section className="section" id="firesides"><div className="shell">
      <div className="split-copy"><div><p className="eyebrow">Firesides</p><h2>Start with the people living with the question.</h2></div><div><p>The proposed format combines lived experience, realistic decision scenarios and facilitated deliberation. It is designed to record community priorities, areas of agreement and unresolved differences.</p><p>Two concepts within <Link href="/ai-society">AI &amp; Society</Link> focus on learning and work. Neither is a scheduled event.</p></div></div>
      <div className="fireside-concepts"><article><p className="eyebrow">In development</p><h3>AI, Learning &amp; Fairness</h3><p className="concept-question">Who sets the rules when AI enters the classroom?</p><p>A student’s work is flagged by an automated tool. What evidence should count, who should review it and how can the student challenge the decision?</p><Link href="/ai-society#participate" className="text-link">Register interest</Link></article><article><p className="eyebrow">In development</p><h3>AI, Jobs &amp; Human Review</h3><p className="concept-question">Who gets the final say when algorithms influence opportunity?</p><p>An applicant is screened out before speaking to a person. What should employers disclose, when is human review required and who can intervene?</p><Link href="/ai-society#participate" className="text-link">Register interest</Link></article></div>
    </div></section>
    <section className="section soft-section" id="roundtables"><div className="shell split-copy"><div><p className="eyebrow">Roundtables · Proposed format</p><h2>From public questions to institutional response.</h2></div><div><p>Future Roundtables may invite institutions to respond to community priorities: what can change, what needs evidence and what cannot currently be addressed.</p><p>The proposed process moves from a community question to an institutional response, examination of evidence and feasibility, and community consideration of whether to adopt, revise, test or decline an approach.</p><p>Dates, hosts and participants will be announced only when confirmed.</p><Link href="/partner#conversation" className="text-link">Discuss hosting or supporting future work</Link></div></div></section>
    <section className="section" id="briefings"><div className="shell split-copy"><div><h2>Research, health access and public systems.</h2></div><div><p>We welcome inquiries about publication briefings and future conversations on barriers to care, governance and institutional capacity. Rural communities remain an important part of this work, not its only setting.</p><Link href="/partner#conversation" className="text-link">Start a conversation</Link></div></div></section>
  </>;
}

export function AboutPage() {
  return <>
    <PageHero eyebrow="The Foundation" title="About SozoRock" copy="We develop research, health-access initiatives, public-systems intelligence and practical learning to help people and institutions act." />
    <section className="section" id="mission"><div className="shell split-copy"><div><p className="eyebrow">Mission</p><h2>Turn evidence into practical action.</h2></div><div><p>Our work connects research with the people who can use it: communities, practitioners, educators, public agencies and institutions. We examine barriers to care, develop place-based evidence, strengthen public systems and build practical AI capability.</p><p>Rural health and rural equity are enduring priorities because geography changes access, capacity and institutional choices. They sit within a broader commitment to better health and public systems across different places.</p><p>Our emerging <Link href="/ai-society" className="society-inline-link">AI &amp; Society</Link> work examines how AI is governed, evaluated and used, with human judgment, community participation and public accountability at its center.</p></div></div></section>
    <section className="section soft-section"><div className="shell split-copy"><div><p className="eyebrow">Leadership</p><h2>People responsible for the work.</h2></div><div><p>Meet the directors responsible for partnerships, global affairs, health education and strategic initiatives.</p><Link href="/leadership" className="text-link">Meet the leadership team</Link></div></div></section>
    <section className="section" id="contact"><div className="shell contact-panel"><div><p className="eyebrow">Contact</p><h2>Start with the question.</h2><p>For publications, health-access partnerships, public-systems work, organizational information or other institutional inquiries:</p><p>The SozoRock Foundation, Inc. is responsible for this website. Separately incorporated SozoRock businesses are distinct entities.</p></div><Link href="/partner" className="button button-primary">Send an inquiry</Link></div></section>
  </>;
}

export function ContactPage() {
  return <><PageHero eyebrow="Contact" title="Contact the Foundation" copy="Talk with us about health access, research, public systems, community initiatives or applied learning." /><section className="section form-section"><div className="shell form-layout"><div><h2>What would you like to explore?</h2><p>Tell us the question, the people it concerns and the outcome you have in mind.</p><p>For partnership and support opportunities, visit <Link href="/partner" className="text-link">Partner</Link> or <Link href="/support" className="text-link">Support our work</Link>.</p><p>You can also email <a href="mailto:contact@sozorockfoundation.org">contact@sozorockfoundation.org</a>.</p></div><EngagementForm kind="Contact" /></div></section></>;
}

export function PartnerPage() {
  return <>
    <PageHero eyebrow="Engage" title="Partner" copy="Work with us on health access, place-based evidence, public-interest research, public systems and practical learning." />
    <section className="section"><div className="shell"><div className="partner-route-grid">{partnerRoutes.map((route) => <article key={route.title}><h2>{route.title}</h2><p>{route.copy}</p></article>)}</div></div></section>
    <section className="section form-section" id="conversation"><div className="shell form-layout"><div><p className="eyebrow">Start a conversation</p><h2>Tell us what you are trying to do.</h2><p>Tell us the place, question, decision and contribution you have in mind. We welcome interest in research, health access, public systems and future AI &amp; Society convenings, including hosting, community participation, institutional response and evaluation. An inquiry does not establish a partnership or event commitment.</p></div><EngagementForm kind="Partner" /></div></section>
  </>;
}

export function SupportPage() {
  return <>
    <PageHero eyebrow="Engage" title="Support" copy="Help sustain public-interest research, convening, health access, public-systems work and applied learning." />
    <section className="section"><div className="shell support-options"><article><h2>Public-interest publications</h2><p>Support research, editorial review, publication access and dissemination.</p></article><article><h2>Health access</h2><p>Support community readiness, Hub partnerships, health education and local evidence, including work in rural and underserved places.</p></article><article><h2>Applied learning</h2><p>Sponsor practical AI learning for learners, workforce programs and community organizations.</p></article><article><h2>AI &amp; Society</h2><p>Support participant compensation, facilitation, accessibility, independent review, evaluation and public decision records.</p></article><article><h2>In-kind capability</h2><p>Discuss secure technology, cloud capacity, venue, printing, professional expertise or program-delivery support. Material support is disclosed and does not direct findings.</p></article></div></section>
    <section className="section form-section"><div className="shell form-layout"><div><p className="eyebrow">Support inquiry</p><h2>Choose the work you want to strengthen.</h2><p>Discuss financial or in-kind support, the work it would enable, the safeguards that apply and how its use would be documented.</p></div><EngagementForm kind="Support" /></div></section>
  </>;
}
