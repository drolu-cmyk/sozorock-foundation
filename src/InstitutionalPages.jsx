import { EngagementForm, PageHero, PublicationCard, SectionHeading, StandardsStrip } from "./components";
import { partnerRoutes, platforms, publications } from "./siteData";
import { Link } from "./router";

export function ParentPlatformsPage() {
  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Platforms"
        copy="Research, health access, community evidence and practical AI learning for stronger public systems—including focused work in rural and underserved places."
      />
      <section className="section platform-detail-list">
        <div className="shell">
          {platforms.map((platform) => (
            <article className="platform-detail" key={platform.slug}>
              <div><p className="eyebrow">{platform.name}</p><h2>{platform.line}</h2></div>
              <div><p>{platform.detail}</p><Link href={platform.href} className="text-link">{platform.action}</Link></div>
            </article>
          ))}
          <p className="society-work-context">
            Across the Global Institute and AI Lab, <Link href="/ai-society" className="society-inline-link">AI &amp; Society</Link> is an emerging area of work on participation, evaluation, human review and public accountability.
          </p>
        </div>
      </section>
    </>
  );
}

export function GlobalInstitutePage() {
  return (
    <>
      <PageHero
        eyebrow="By The SozoRock Foundation"
        title="SozoRock Global Institute"
        copy="Research on governance, health access, systems assurance and public decision-making, with focused work on rural institutions and local capacity."
      >
        <div className="button-row"><Link href="/publications" className="button button-light">Read publications</Link><Link href="/events" className="button button-outline-light">Explore convening</Link></div>
      </PageHero>
      <section className="section">
        <div className="shell">
          <SectionHeading eyebrow="Research" title="Evidence worth examining." />
          <div className="publication-cards">{publications.map((publication) => <PublicationCard publication={publication} key={publication.slug} />)}</div>
        </div>
      </section>
      <section className="section soft-section">
        <div className="shell split-copy">
          <div><p className="eyebrow">Convene</p><h2>Firesides, roundtables and briefings.</h2></div>
          <div>
            <p>Convenings connect research with the people living with a question and the institutions able to respond. Confirmed dates, hosts and participation terms will be published before registration opens.</p>
            <Link href="/events" className="text-link">Explore events</Link>
            <p className="society-institute-context"><Link href="/ai-society" className="society-inline-link">AI &amp; Society</Link> focuses on community participation, human judgment and accountability in consequential AI decisions.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export function ParentPublicationsPage() {
  return (
    <>
      <PageHero eyebrow="Research" title="Publications" copy="Public-interest research on health systems assurance, governance, health access and rural equity." />
      <section className="section" id="doi">
        <div className="shell publication-index">
          {publications.map((publication) => (
            <article className="publication-entry" key={publication.slug}>
              <div className="publication-entry-meta"><p className="eyebrow">{publication.theme}</p><p>{publication.date}<br />{publication.volume}</p></div>
              <div>
                <h2><Link href={publication.path}>{publication.title}</Link></h2>
                <p>{publication.description}</p>
                <p className="publication-entry-author">{publication.author}</p>
                <div className="publication-entry-links">
                  <Link href={publication.path} className="text-link">Read the overview</Link>
                  {publication.doi ? <a href={`https://doi.org/${publication.doi}`}>DOI: {publication.doi}</a> : <span>ISBN: {publication.isbn}</span>}
                </div>
              </div>
            </article>
          ))}
          <p className="publication-index-note">Each record states the publication’s scope, limitations, citation and full-text access route. Email verification is required for the free PDF; publication updates are optional.</p>
        </div>
      </section>
      <StandardsStrip />
    </>
  );
}

export function ParentEventsPage() {
  return (
    <>
      <PageHero eyebrow="Events" title="Conversations that lead somewhere." copy="Firesides and Roundtables connect lived experience, public evidence and institutional response. Dates and participation terms are published only when confirmed." />
      <section className="section" id="firesides"><div className="shell">
        <div className="split-copy">
          <div><p className="eyebrow">Firesides</p><h2>Start with the people living with the question.</h2></div>
          <div><p>The proposed format combines lived experience, realistic decision scenarios and facilitated deliberation. It is designed to record community priorities, areas of agreement and unresolved differences.</p><p>Two concepts within <Link href="/ai-society">AI &amp; Society</Link> focus on learning and work. Neither is a scheduled event.</p></div>
        </div>
        <div className="fireside-concepts">
          <article><p className="eyebrow">In development</p><h3>AI, Learning &amp; Fairness</h3><p className="concept-question">Who sets the rules when AI enters the classroom?</p><p>A student’s work is flagged by an automated tool. What evidence should count, who should review it and how can the student challenge the decision?</p><Link href="/ai-society#participate" className="text-link">Register interest</Link></article>
          <article><p className="eyebrow">In development</p><h3>AI, Jobs &amp; Human Review</h3><p className="concept-question">Who gets the final say when algorithms influence opportunity?</p><p>An applicant is screened out before speaking to a person. What should employers disclose, when is human review required and who can intervene?</p><Link href="/ai-society#participate" className="text-link">Register interest</Link></article>
        </div>
      </div></section>
      <section className="section soft-section" id="roundtables"><div className="shell split-copy">
        <div><p className="eyebrow">Roundtables · Proposed format</p><h2>From public questions to institutional response.</h2></div>
        <div><p>Future Roundtables may invite institutions to respond to community priorities: what can change, what needs evidence and what cannot currently be addressed.</p><p>The proposed process moves from a community question to an institutional response, examination of evidence and feasibility, and community consideration of whether to adopt, revise, test or decline an approach.</p><p>Dates, hosts and participants will be announced only when confirmed.</p><Link href="/partner#conversation" className="text-link">Discuss hosting or supporting future work</Link></div>
      </div></section>
      <section className="section" id="past"><div className="shell split-copy">
        <div><p className="eyebrow">Past engagement · September 2025</p><h2>A SozoRock roundtable in Western New York.</h2></div>
        <div><p>SozoRock convened a rural-health pre-planning roundtable in partnership with a university school of nursing. Twelve participants represented two county public-health jurisdictions, two universities and a regional community-health organization.</p><p>A regional public-health director reported serving more than 12,000 residents per primary-care clinician. The figure is recorded as participant-reported context, not as an independently re-estimated statistic or an achieved outcome.</p><Link href="/publication/rebs-v1-2025" className="text-link">Read the published framework</Link></div>
      </div></section>
      <section className="section soft-section" id="briefings"><div className="shell split-copy">
        <div><h2>Research, health access and public systems.</h2></div>
        <div><p>We welcome inquiries about publication briefings and future conversations on governance, systems assurance, barriers to care and practical AI. Health-related convenings examine access and community experience; the Foundation does not provide clinical care.</p><Link href="/partner#conversation" className="text-link">Start a conversation</Link></div>
      </div></section>
    </>
  );
}

export function ParentAboutPage() {
  return (
    <>
      <PageHero eyebrow="The Foundation" title="About SozoRock" copy="We build platforms for better health and public systems—connecting research, community evidence and practical learning with institutional action." />
      <section className="section" id="mission"><div className="shell split-copy">
        <div><p className="eyebrow">Mission</p><h2>Turn evidence into practical action.</h2></div>
        <div><p>Our work connects research with the people who can use it: communities, practitioners, educators, public agencies, funders and institutions. We examine barriers to care, strengthen source-traceable evidence and build practical capability around modern systems.</p><p>Rural health and rural equity are important areas of focus because place changes access, capacity and the cost of weak systems. The Foundation’s wider work also addresses health systems assurance, governance, public-sector decision-making, community participation and responsible AI.</p><p>Our developing <Link href="/ai-society" className="society-inline-link">AI &amp; Society</Link> work examines how AI is governed, evaluated and used, with human judgment, community participation and public accountability at its center.</p></div>
      </div></section>
      <section className="section soft-section"><div className="shell split-copy">
        <div><p className="eyebrow">Leadership</p><h2>People responsible for the work.</h2></div>
        <div><p>Meet the directors responsible for partnerships, global affairs, health education and strategic initiatives.</p><Link href="/leadership" className="text-link">Meet the leadership team</Link></div>
      </div></section>
      <section className="section"><div className="shell split-copy">
        <div><p className="eyebrow">Public trust</p><h2>Standards before scale.</h2></div>
        <div><p>Our standards distinguish proposed models, participant-reported context, observed work and measured outcomes. Funding and partnerships do not determine research conclusions or erase the limits of the evidence.</p><Link href="/standards" className="text-link">Read the standards</Link></div>
      </div></section>
      <section className="section soft-section" id="contact"><div className="shell contact-panel">
        <div><p className="eyebrow">Contact</p><h2>Start with the question.</h2><p>For publications, health access, rural and place-based work, public systems, AI &amp; Society or other institutional inquiries:</p><p>The SozoRock Foundation, Inc. is responsible for this website. Separately incorporated SozoRock businesses are distinct entities.</p></div>
        <Link href="/partner" className="button button-primary">Send an inquiry</Link>
      </div></section>
    </>
  );
}

export function ParentContactPage() {
  return <><PageHero eyebrow="Contact" title="Contact the Foundation" copy="Talk with us about research, health access, rural and place-based work, public systems, community initiatives or applied learning." /><section className="section form-section"><div className="shell form-layout"><div><h2>What would you like to explore?</h2><p>Tell us the question, the people it concerns and the outcome you have in mind.</p><p>For partnership and support opportunities, visit <Link href="/partner" className="text-link">Partner</Link> or <Link href="/support" className="text-link">Support our work</Link>.</p><p>You can also email <a href="mailto:contact@sozorockfoundation.org">contact@sozorockfoundation.org</a>.</p></div><EngagementForm kind="Contact" /></div></section></>;
}

export function ParentPartnerPage() {
  return (
    <>
      <PageHero eyebrow="Engage" title="Partner" copy="Work with us on health access, community evidence, public-interest research, public systems and practical learning—including focused rural and place-based work." />
      <section className="section"><div className="shell"><div className="partner-route-grid">{partnerRoutes.map((route) => <article key={route.title}><h2>{route.title}</h2><p>{route.copy}</p></article>)}</div></div></section>
      <section className="section form-section" id="conversation"><div className="shell form-layout"><div><p className="eyebrow">Start a conversation</p><h2>Tell us what you are trying to do.</h2><p>Tell us the community, institution, question and contribution you have in mind. We welcome interest in research, health access, rural and underserved places, systems assurance, public evidence and future AI &amp; Society convenings. An inquiry does not establish a partnership, funding agreement or event commitment.</p></div><EngagementForm kind="Partner" /></div></section>
    </>
  );
}

export function ParentSupportPage() {
  return (
    <>
      <PageHero eyebrow="Engage" title="Support" copy="Help sustain public-interest research, community participation, health access and practical learning." />
      <section className="section"><div className="shell support-options">
        <article><h2>Public-interest publications</h2><p>Support research, editorial review, publication access and dissemination.</p></article>
        <article><h2>Health access and community evidence</h2><p>Support local readiness, rural and underserved communities, health education and source-traceable evidence.</p></article>
        <article><h2>AI &amp; Society participation</h2><p>Support participant compensation, facilitation, accessibility, independent review and public documentation.</p></article>
        <article><h2>Applied learning</h2><p>Support practical AI learning for learners, workforce programs and community organizations.</p></article>
        <article><h2>Institutional and in-kind support</h2><p>Discuss technology, venues, printing, professional expertise, evaluation or program-delivery support without directing findings.</p></article>
      </div></section>
      <section className="section form-section"><div className="shell form-layout"><div><p className="eyebrow">Support inquiry</p><h2>Choose the work you want to strengthen.</h2><p>Describe financial or in-kind support, the work it could enable and any documentation or independence requirements. An inquiry does not establish acceptance or a funding agreement.</p></div><EngagementForm kind="Support" /></div></section>
    </>
  );
}

export function ParentStandardsPage() {
  const standards = [
    ["Independence", "Research conclusions, editorial judgments and public findings remain the responsibility of the Foundation and identified authors. Funding or partnership does not purchase a conclusion."],
    ["Claims and evidence", "We distinguish proposed models, participant-reported context, observed activity, modeled estimates and measured outcomes. Each should be labeled at the point where it is presented."],
    ["Corrections", "Report a suspected error to contact@sozorockfoundation.org with the publication or page, location of the issue and supporting source. Material corrections preserve the publication record and state what changed."],
    ["Funding and support", "Relevant funding, sponsorship and material in-kind support should be disclosed with the work they enable. Support does not establish endorsement, adoption or implementation."],
    ["Authorship and accountability", "Authors, contributors, reviewers and accountable institutional roles should be identified accurately. Participation alone is not described as authorship or partnership."],
    ["AI use", "AI may support research, design, coding, synthesis or workflow. Human reviewers remain responsible for evidence, attribution, privacy, limitations and final publication."],
    ["Privacy and data minimization", "Forms should request only information needed for the stated service. Sensitive medical, student, employee, financial, legal and account information should not be submitted through public forms."],
    ["Citations", "Claims should be linked to source-traceable evidence. Publication records should preserve DOI, ISBN and citation metadata where assigned."],
    ["Copyright", "Check the notice attached to each publication or asset before reuse. A citation does not grant permission to reproduce protected material. Send rights questions to contact@sozorockfoundation.org."],
    ["Accessibility", "The website and publications should be designed for perceivable, operable, understandable and robust access, with a route to request an accessible format or accommodation."],
  ];
  return (
    <>
      <PageHero eyebrow="About" title="Standards" copy="Public commitments for research, evidence, funding, authorship, AI use, privacy, accessibility and corrections." />
      <section className="section"><div className="shell standards-list">{standards.map(([title, copy]) => <article id={title.toLowerCase().replaceAll(" ", "-")} key={title}><h2>{title}</h2><p>{copy}</p></article>)}</div></section>
      <section className="section soft-section"><div className="shell split-copy"><div><p className="eyebrow">Website policies</p><h2>Clear terms for public use.</h2></div><div><p>Foundation-wide privacy, accessibility, nondiscrimination and website terms work alongside the safeguards required by each platform.</p><div className="policy-links"><Link href="/privacy" className="text-link">Privacy Notice</Link><Link href="/accessibility" className="text-link">Accessibility</Link><Link href="/nondiscrimination" className="text-link">Nondiscrimination</Link><Link href="/terms" className="text-link">Website Terms</Link></div></div></div></section>
    </>
  );
}

function PolicyPage({ title, summary, children, updated = "September 16, 2026" }) {
  return (
    <>
      <PageHero eyebrow="Legal and policy" title={title} copy={summary} compact />
      <section className="section policy-page"><div className="shell policy-layout"><aside><p className="eyebrow">Last updated</p><p>{updated}</p><p>Send questions through our <Link href="/contact">contact form</Link> or email <a href="mailto:contact@sozorockfoundation.org">contact@sozorockfoundation.org</a>.</p></aside><div className="policy-copy">{children}</div></div></section>
    </>
  );
}

export function PrivacyNoticePage() {
  return (
    <PolicyPage title="Privacy Notice" summary="How The SozoRock Foundation, Inc. handles information submitted through this website and its public forms.">
      <section><h2>Scope</h2><p>This notice applies to the Foundation parent website and the forms served through it. Foundation platforms may publish additional notices for their own services. When a form uses a platform service for delivery, both notices should be read together.</p></section>
      <section><h2>Information you provide</h2><p>We receive information you choose to submit through an inquiry, participation or publication-access form, such as your name, email address, organization or affiliation, location, role, interests and message. Please do not submit medical, emergency, protected health, student, employee, financial-account, legal, credential or other sensitive information.</p></section>
      <section><h2>How information is used</h2><p>Submitted information is used to respond to an inquiry, provide requested publication access, understand institutional or participant interest, protect the service and maintain records needed for those purposes. Optional publication-update consent is separate from access and may be withdrawn.</p></section>
      <section><h2>Service providers and platform services</h2><p>Hosting, security, email delivery and related providers may process limited information on our behalf under their service arrangements. Publication-access and inquiry submissions use established SozoRock Health delivery services. The Health Privacy Notice explains that service’s technical records, retention and deletion arrangements.</p><p><a href="https://health.sozorockfoundation.org/privacy" className="text-link">Read the SozoRock Health Privacy Notice</a></p></section>
      <section><h2>Retention</h2><p>Information is retained only for as long as reasonably needed for the purpose for which it was submitted, service security, recordkeeping and applicable legal or operational obligations. Retention periods may differ by form and service.</p></section>
      <section><h2>Security</h2><p>We use administrative, technical and operational measures intended to protect submitted information. No website, email or storage system can be guaranteed to be completely secure. Do not use public forms for urgent or sensitive matters.</p></section>
      <section><h2>Choices</h2><p>We do not sell personal information or use this website for behavioral advertising. You may ask about, correct or request deletion of information you submitted. A request may be limited when records are reasonably required for security, legal or operational obligations.</p></section>
      <section><h2>Changes and contact</h2><p>We may update this notice when the website, forms or service arrangements change. The current version and update date will remain available on this page. Send privacy questions or requests to contact@sozorockfoundation.org.</p></section>
    </PolicyPage>
  );
}

export function AccessibilityStatementPage() {
  return (
    <PolicyPage title="Accessibility" summary="Our approach to digital access, accommodation and feedback.">
      <section><h2>Our approach</h2><p>We aim to align this website with WCAG 2.2 Level AA practices. This is an ongoing design and testing objective, not a claim that every page, document or third-party service has been formally certified.</p></section>
      <section><h2>Website features</h2><p>Our approach includes keyboard access, visible focus, meaningful headings, alternative text, readable contrast, responsive layouts, form labels, status messages and reduced-motion support.</p></section>
      <section><h2>Documents and external services</h2><p>We work to provide accessible publication records and digital materials. Some historical documents, third-party content or external services may have limitations. Contact us to request an accessible format or a reasonable accommodation.</p></section>
      <section><h2>Feedback and accommodation</h2><p>If you encounter a barrier, tell us the page or document, the issue, the device or assistive technology used and the format or accommodation that would help. We will review the request and respond with an available path forward.</p></section>
      <section><h2>Ongoing review</h2><p>Accessibility is reviewed as content, components and services change. Identified barriers are prioritized according to their effect on access to core information and services.</p></section>
    </PolicyPage>
  );
}

export function NondiscriminationNoticePage() {
  return (
    <PolicyPage title="Nondiscrimination" summary="Equal access, dignity and respect across Foundation programs and public-facing services.">
      <section><h2>Commitment</h2><p>The SozoRock Foundation does not discriminate in access to its programs, services, partnerships or public resources on the basis of race, color, national origin, ancestry, ethnicity, religion, sex, pregnancy, sexual orientation, gender identity or expression, age, disability, veteran status or another status protected by applicable law.</p></section>
      <section><h2>Access and accommodation</h2><p>We seek to provide reasonable accommodations and language-access pathways where practicable. Contact us before an event or activity when an accommodation would support participation.</p></section>
      <section><h2>Partner and venue responsibilities</h2><p>Organizations and venues participating in Foundation work are expected to support lawful, respectful access within their roles. Participation does not transfer the Foundation’s responsibilities or create an endorsement of another organization.</p></section>
      <section><h2>Questions or concerns</h2><p>Send a concern with enough information for us to understand and review it. Retaliation for raising a good-faith accessibility or nondiscrimination concern is not acceptable.</p></section>
    </PolicyPage>
  );
}

export function WebsiteTermsPage() {
  return (
    <PolicyPage title="Website Terms" summary="Terms governing use of this website, its public forms and its public-interest materials.">
      <section><h2>Informational purpose</h2><p>This website and its publications provide general public-interest information. They are not medical, clinical, legal, tax, investment, cybersecurity, certification or emergency advice and do not create a professional, fiduciary, clinical, provider, auditor or client relationship.</p></section>
      <section><h2>Permitted use</h2><p>You may use the website lawfully and may cite or link to public pages. Publication-specific copyright, permissions, licenses and citation instructions control reuse of publication files and protected assets.</p></section>
      <section><h2>Prohibited use</h2><p>Do not interfere with the service, attempt to bypass access controls, submit malicious or unlawful material, misrepresent Foundation affiliation, collect information from the site in violation of law, or use Foundation names and marks in a way that implies permission, partnership or endorsement.</p></section>
      <section><h2>Public forms</h2><p>Provide accurate information and do not submit sensitive medical, student, employee, financial, legal, credential or account information. Form submission does not establish publication entitlement beyond the stated access process, a partnership, funding, participation or another institutional commitment.</p></section>
      <section><h2>External services</h2><p>Links to external sites and Foundation platforms are provided for context and convenience. Their content, availability, security and privacy practices may be governed by separate terms and notices.</p></section>
      <section><h2>Availability, corrections and changes</h2><p>We work to keep information accurate and services available but do not promise uninterrupted operation or that every item is complete or current. We may correct, update, suspend or remove material while preserving appropriate publication and corrections records.</p></section>
      <section><h2>Foundation identity</h2><p>© {new Date().getFullYear()} The SozoRock Foundation, Inc. Publication-specific notices identify ownership, third-party rights and permitted use. Questions about rights or these terms may be sent to contact@sozorockfoundation.org.</p></section>
    </PolicyPage>
  );
}
