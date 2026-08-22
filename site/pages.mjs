import { page, innerHero, row, publicationRows, publicationCards, leadershipCards } from './template.mjs';
import { externalDestinations } from './content.mjs';

const home = () => page({
  path:'/',
  title:'Access. Assurance. Intelligence.',
  description:'The SozoRock Foundation builds platforms for better health and public systems.',
  body:`
<section class="home-hero"><div class="shell hero-grid"><div><p class="kicker kicker-light">THE SOZOROCK FOUNDATION</p><h1 aria-label="Access. Assurance. Intelligence."><span>Access.</span><span>Assurance.</span><span>Intelligence.</span></h1></div><div class="hero-side"><p>We build platforms for better health and public systems.</p><div class="text-actions"><a href="/work">Explore the work</a><a href="/partner">Partner with us</a></div></div></div></section>
<section class="focus-section reveal-section"><div class="shell"><div class="focus-heading"><p class="kicker">IN FOCUS</p><button type="button" class="focus-toggle" data-focus-toggle>Pause features</button></div><div class="focus-frame" data-focus-frame>
<article class="focus-slide is-active" id="focus-panel-0" role="tabpanel" aria-labelledby="focus-tab-0" data-focus-slide="0"><div class="focus-copy"><p class="kicker">FEATURED PUBLICATION</p><h2>Health Systems Assurance</h2><p class="focus-lede">Evidence for trustworthy health systems.</p><p class="focus-meta">Open access · Volume 1</p><a class="line-link" href="/publication/hsa-v1-2026">Read the publication</a></div><div class="focus-media paper-media"><img src="/assets/hsa-cover.webp" alt="Health Systems Assurance Volume 1 cover"></div></article>
<article class="focus-slide" id="focus-panel-1" role="tabpanel" aria-labelledby="focus-tab-1" data-focus-slide="1" hidden><div class="focus-copy"><p class="kicker">SOZOROCK HEALTH</p><h2>A clearer path to care that already exists.</h2><p class="focus-lede">Health access and community evidence built around the barriers people face where they live.</p><a class="line-link" href="${externalDestinations.health}">Explore SozoRock Health</a></div><div class="focus-media health-media"><img src="/assets/health-community.webp" alt="Two people reviewing information together in a community setting."></div></article>
<article class="focus-slide" id="focus-panel-2" role="tabpanel" aria-labelledby="focus-tab-2" data-focus-slide="2" hidden><div class="focus-copy"><p class="kicker">SOZOROCK AI LAB</p><h2>AI skills for real life.</h2><p class="focus-lede">Practical learning built around real work, reviewed output, responsible use, and human judgment.</p><p class="focus-meta">Learn · Make · Check · Use</p><a class="line-link" href="${externalDestinations.aiLab}">Explore the AI Lab</a></div><div class="focus-media ai-panel"><strong>Learn.<br>Make.<br>Check.<br>Use.</strong></div></article>
</div><div class="focus-tabs" role="tablist" aria-label="In Focus features"><button id="focus-tab-0" role="tab" aria-controls="focus-panel-0" aria-selected="true" data-focus-tab="0"><span>FEATURED PUBLICATION</span><b>Health Systems Assurance</b></button><button id="focus-tab-1" role="tab" aria-controls="focus-panel-1" aria-selected="false" data-focus-tab="1"><span>SOZOROCK HEALTH</span><b>A clearer path to care that already exists.</b></button><button id="focus-tab-2" role="tab" aria-controls="focus-panel-2" aria-selected="false" data-focus-tab="2"><span>SOZOROCK AI LAB</span><b>AI skills for real life.</b></button></div></div></section>
<section class="section-white reveal-section"><div class="shell"><div class="section-heading"><div><p class="kicker">PLATFORMS</p><h2>What SozoRock operates.</h2></div><a class="line-link" href="/work">View the work</a></div><div class="row-list">${row('SozoRock Global Institute','Insight, publications, and convening.','/work/global-institute')}${row('SozoRock Health','Health access and community evidence.',externalDestinations.health)}${row('SozoRock AI Lab','Applied learning for modern work.',externalDestinations.aiLab)}</div></div></section>
<section class="standards-band reveal-section"><div class="shell standards-grid"><div><p class="kicker kicker-light">STANDARDS</p><h2>Credibility is part of the work.</h2></div><div><p>Independence. Corrections. Funding. Authorship. AI use. Citations.</p><a class="line-link light" href="/standards">Read our standards</a></div></div></section>
<section class="engage-section reveal-section"><div class="shell"><p class="kicker">ENGAGE</p><h2>Choose where to begin.</h2><div class="engage-grid"><a href="/publications"><strong>Read</strong><span>Publications and insights</span></a><a href="/events"><strong>Attend</strong><span>Firesides and roundtables</span></a><a href="/partner"><strong>Partner</strong><span>Hubs, pilots, and briefings</span></a><a href="/support"><strong>Support</strong><span>Open work and applied learning</span></a></div></div></section>`
});

const work = () => page({
  path:'/work', title:'Work', description:'SozoRock Global Institute, SozoRock Health, and SozoRock AI Lab connect insight, access, and applied learning.',
  body:`${innerHero('WORK','Three platforms. One purpose.','Research informs action. Health strengthens access. AI Lab builds practical capability.')}<section class="content-section reveal-section"><div class="shell row-list">${row('SozoRock Global Institute','Insight, publications, and convening.','/work/global-institute')}${row('SozoRock Health','Health access and community evidence.',externalDestinations.health)}${row('SozoRock AI Lab','Applied learning for modern work.',externalDestinations.aiLab)}</div></section>`
});

const globalInstitute = () => page({
  path:'/work/global-institute', title:'SozoRock Global Institute', description:'Research, publications, and convening from The SozoRock Foundation.',
  body:`${innerHero('SOZOROCK GLOBAL INSTITUTE','Insight, publications, and convening.','Research, open-access publications, briefings, firesides, and roundtables.')}<section class="content-section reveal-section"><div class="shell"><div class="section-heading"><div><p class="kicker">PUBLICATIONS</p><h2>Current work.</h2></div><a class="line-link" href="/publications">View publications</a></div><div class="publication-grid">${publicationCards()}</div></div></section><section class="engage-section reveal-section"><div class="shell split-feature"><div><p class="kicker">CONVENE</p><h2>Firesides, roundtables, and briefings.</h2></div><div><p>Focused conversations connect research and field questions with people working across communities, institutions, and public systems.</p><a class="line-link" href="/events">Explore events</a></div></div></section>`
});

// These pages remain in the static build so old bookmarks retain a meaningful
// fallback. Production returns permanent redirects before the HTML is served.
const health = () => page({
  path:'/work/health', title:'SozoRock Health', description:'Continue to SozoRock Health for health access and community evidence.',
  body:`${innerHero('SOZOROCK HEALTH','A clearer path to care that already exists.','Health access and community evidence built around place.')}<section class="content-section"><div class="shell"><a class="line-link" href="${externalDestinations.health}">Continue to SozoRock Health</a></div></section>`
});
const aiLab = () => page({
  path:'/work/ai-lab', title:'SozoRock AI Lab', description:'Continue to SozoRock AI Lab for applied AI learning.',
  body:`${innerHero('SOZOROCK AI LAB','AI skills for real life.','Practical learning for modern work.')}<section class="content-section"><div class="shell"><a class="line-link" href="${externalDestinations.aiLab}">Continue to SozoRock AI Lab</a></div></section>`
});

const publicationsPage = () => page({
  path:'/publications', title:'Publications', description:'Open-access SozoRock Foundation publications on health systems, governance, access, and equity.',
  body:`${innerHero('IDEAS','Publications','Open-access research and permanent publication records.')}<section class="content-section reveal-section"><div class="shell publication-grid">${publicationCards()}</div></section>`
});

const insights = () => page({
  path:'/insights', title:'Insights', description:'Notes, briefings, and field updates from The SozoRock Foundation.',
  body:`${innerHero('IDEAS','Insights','Notes, briefings, and field updates.')}<section class="content-section reveal-section"><div class="shell"><article class="note"><p class="kicker">FROM THE WORK</p><h2>Ideas worth carrying forward.</h2><p>Short analysis connects research, field experience, and emerging questions across the Foundation’s work.</p></article></div></section>`
});

const events = () => page({
  path:'/events', title:'Events', description:'Firesides, roundtables, briefings, and convenings from The SozoRock Foundation.',
  body:`${innerHero('IDEAS','Events','Firesides, roundtables, briefings, and convenings.')}<section class="content-section reveal-section"><div class="shell row-list">${row('Firesides','Focused conversations around evidence, implementation, and systems questions.','/partner','Join')}${row('Roundtables','Small discussions around a defined question.','/partner','Partner')}${row('Briefings','Focused sessions for agencies, systems, funders, and partners.','/partner','Request')}</div></section>`
});

const about = () => page({
  path:'/about', title:'About', description:'The SozoRock Foundation builds platforms for better health and public systems.',
  body:`${innerHero('ABOUT','The Foundation behind the work.','We build platforms for better health and public systems.')}<section class="content-section reveal-section"><div class="shell two-col"><div><h2>Access. Assurance. Intelligence.</h2><p>Research, health access, and applied learning come together around one aim: stronger systems that work better for people and communities.</p></div><div class="row-list">${row('Leadership','Meet the people leading the work.','/leadership','Meet the team')}${row('Standards','See how we protect independence and credibility.','/standards','Read')}</div></div></section>`
});

const leadership = () => page({
  path:'/leadership', title:'Leadership', description:'Meet the leadership of The SozoRock Foundation.',
  body:`${innerHero('ABOUT','Leadership','People leading the Foundation’s work.')}<section class="content-section reveal-section"><div class="shell leadership-grid">${leadershipCards()}</div></section>`
});

const partner = () => page({
  path:'/partner', title:'Partner', description:'Partner with The SozoRock Foundation across research, health access, convening, and applied learning.',
  body:`${innerHero('ENGAGE','Partner with us.','Start with the work you want to advance.')}<section class="content-section reveal-section"><div class="shell row-list">${row('Request a briefing','Bring a research, place, or systems question.','mailto:contact@sozorockfoundation.org?subject=Request%20a%20briefing','Contact')}${row('Host a Health Access Day','Bring partners together around practical health access.','mailto:contact@sozorockfoundation.org?subject=Health%20Access%20Day','Start')}${row('Partner on a Hub','Explore a community access point in a trusted local space.','mailto:contact@sozorockfoundation.org?subject=Health%20Equity%20Hub','Start')}${row('Join a fireside','Take part in a focused conversation around evidence and action.','mailto:contact@sozorockfoundation.org?subject=Fireside','Join')}${row('Support a publication','Help keep public-interest research open and accessible.','mailto:contact@sozorockfoundation.org?subject=Publication%20support','Discuss')}${row('Sponsor applied learning','Expand access to practical learning through SozoRock AI Lab.','mailto:contact@sozorockfoundation.org?subject=Applied%20learning%20support','Discuss')}</div></section>`
});

const support = () => page({
  path:'/support', title:'Support', description:'Support open research, applied learning, and community access through The SozoRock Foundation.',
  body:`${innerHero('ENGAGE','Support the work.','Help expand open research, applied learning, and community access.')}<section class="content-section reveal-section"><div class="shell row-list">${row('Open-access publications','Support research that remains open to the public.','mailto:contact@sozorockfoundation.org?subject=Support%20publications','Contact')}${row('Applied learning','Expand access to practical learning through SozoRock AI Lab.','mailto:contact@sozorockfoundation.org?subject=Support%20applied%20learning','Contact')}${row('Community access','Support Health Access Day, local hubs, and stronger access pathways.','mailto:contact@sozorockfoundation.org?subject=Support%20community%20access','Contact')}</div></section>`
});

const standards = () => page({
  path:'/standards', title:'Standards', description:'The SozoRock Foundation standards for independence, corrections, funding, authorship, AI use, citations, accessibility, privacy, and nondiscrimination.',
  body:`${innerHero('STANDARDS','Credibility is part of the work.','Independence. Corrections. Funding. Authorship. AI use. Citations.')}<section class="content-section reveal-section"><div class="shell standards-list"><article><h2>Independence</h2><p>Our conclusions follow the evidence. Funding does not purchase findings or endorsements.</p></article><article><h2>Corrections</h2><p>We correct material errors transparently and preserve a clear record of what changed.</p></article><article><h2>Funding</h2><p>We disclose material support when it helps readers understand the work.</p></article><article><h2>Authorship</h2><p>Named authors are accountable for substantive claims, sources, scope, and limitations.</p></article><article><h2>AI use</h2><p>People remain responsible for work produced with AI. AI output is reviewed before publication or consequential use.</p></article><article><h2>Citations</h2><p>Sources are traceable, relevant to the claims they support, and current enough for the question at hand.</p></article><article id="accessibility"><h2>Accessibility</h2><p>We design public digital experiences for keyboard access, readable contrast, reduced motion, meaningful labels, and broadly accessible use.</p></article><article id="privacy"><h2>Privacy</h2><p>We collect information for a defined purpose and limit access to what is needed to deliver the work.</p></article><article id="nondiscrimination"><h2>Nondiscrimination</h2><p>We provide public programs and engagement opportunities without unlawful discrimination and work to make participation accessible.</p></article></div></section>`
});

const publicationSchema = ({title, description, path, authors, datePublished, isbn, doi}) => ({
  '@context':'https://schema.org','@type':'Report',headline:title,name:title,description,
  url:`https://www.sozorockfoundation.org${path}`,datePublished,
  author:authors.map(name=>({'@type':'Person',name})),
  publisher:{'@id':'https://www.sozorockfoundation.org/#organization'},isbn,
  identifier:[...(isbn?[{'@type':'PropertyValue',propertyID:'ISBN',value:isbn}]:[]),...(doi?[{'@type':'PropertyValue',propertyID:'DOI',value:doi}]:[])]
});
const citation = ({title,authors,date,isbn,doi}) => [
  ['citation_title',title],...authors.map(a=>['citation_author',a]),
  ['citation_publication_date',date],['citation_publisher','The SozoRock Foundation, Inc.'],
  ...(isbn?[['citation_isbn',isbn]]:[]),...(doi?[['citation_doi',doi]]:[])
];
const facts = items => `<dl class="pub-facts">${items.map(([term,value])=>`<div><dt>${term}</dt><dd>${value}</dd></div>`).join('')}</dl>`;
const related = `<section class="related-publications reveal-section"><div class="shell"><div class="section-heading"><div><p class="kicker">MORE PUBLICATIONS</p><h2>Continue reading.</h2></div><a class="line-link" href="/publications">All publications</a></div><div class="row-list">${publicationRows()}</div></div></section>`;

const hsaTitle = 'Health Systems Assurance, Volume 1: From compliance to evidence-based digital assurance';
const hsa = () => page({
  path:'/publication/hsa-v1-2026', title:'Health Systems Assurance, Volume 1',
  description:'Health Systems Assurance, Volume 1 presents public-interest research on evidence-based digital assurance in health systems.',
  type:'article', image:'/assets/hsa-cover.webp',
  citation:citation({title:hsaTitle,authors:['Oluwabiyi Adeyemo'],date:'2026-08',isbn:'979-8-9936477-3-9'}),
  structuredData:publicationSchema({title:hsaTitle,description:'Public-interest research and policy analysis on evidence-based digital assurance in health systems.',path:'/publication/hsa-v1-2026',authors:['Oluwabiyi Adeyemo'],datePublished:'2026-08',isbn:'979-8-9936477-3-9'}),
  body:`<section class="pub-hero reveal-section"><div class="shell pub-grid"><div class="pub-copy"><p class="kicker">ASSURANCE</p><h1>Health Systems Assurance</h1><p class="inner-lede">Volume 1 · From compliance to evidence-based digital assurance</p>${facts([['Author','Dr. Oluwabiyi Adeyemo'],['Publisher','The SozoRock Foundation, Inc.'],['Edition','First edition'],['Published','August 2026 · Albany, New York, USA'],['Evidence cutoff','August 12, 2026'],['ISBN','979-8-9936477-3-9']])}</div><div class="pub-cover"><img src="/assets/hsa-cover.webp" alt="Health Systems Assurance Volume 1 cover"></div></div></section><section class="content-section reveal-section"><div class="shell prose"><p class="kicker">ABOUT</p><h2>Evidence for trustworthy health systems.</h2><p>Health Systems Assurance connects obligations and risk objectives to operating evidence, monitoring, exceptions, remediation, and accountable decisions. The report draws on U.S. health-system evidence with international standards and research for comparison.</p><h2>Suggested citation</h2><p>Adeyemo, Oluwabiyi. 2026. <em>Health Systems Assurance, Volume 1: From compliance to evidence-based digital assurance.</em> Albany, New York: The SozoRock Foundation, Inc.</p><div class="publication-actions"><a href="mailto:publications@sozorockfoundation.org?subject=Health%20Systems%20Assurance%20Volume%201">Publication inquiries</a><a href="/standards">Publication standards</a></div></div></section>${related}`
});

const rrgTitle = 'Rethinking Rural Governance: Delaware County, NY — From Compliance to Systems Intelligence';
const rrg = () => page({
  path:'/publication/rrg-v1-2025', title:'Rethinking Rural Governance, Volume 1',
  description:'Rethinking Rural Governance presents a systems-intelligence approach to local government modernization using Delaware County, New York as a reference case.',
  type:'article', image:'/assets/rrg-cover.jpg',
  citation:citation({title:rrgTitle,authors:['Oluwabiyi Adeyemo'],date:'2025-11-20',isbn:'9798993647715',doi:'10.65473/rrg-v1-2025'}),
  structuredData:publicationSchema({title:rrgTitle,description:'A governance modernization framework moving from compliance-oriented administration toward systems intelligence.',path:'/publication/rrg-v1-2025',authors:['Oluwabiyi Adeyemo'],datePublished:'2025-11-20',isbn:'9798993647715',doi:'10.65473/rrg-v1-2025'}),
  body:`<section class="pub-hero reveal-section"><div class="shell pub-grid"><div class="pub-copy"><p class="kicker">GOVERNANCE AND SYSTEMS</p><h1>Rethinking Rural Governance</h1><p class="inner-lede">Volume 1 · From Compliance to Systems Intelligence</p>${facts([['Author','Oluwabiyi Adeyemo'],['Publisher','The SozoRock Foundation, Inc.'],['Published','November 20, 2025'],['Pages','44'],['ISBN','9798993647715'],['DOI','<a href="https://doi.org/10.65473/rrg-v1-2025">10.65473/rrg-v1-2025</a>']])}</div><div class="pub-cover"><img src="/assets/rrg-cover.jpg" alt="Rethinking Rural Governance Volume 1 cover"></div></div></section><section class="content-section reveal-section"><div class="shell prose"><p class="kicker">ABOUT</p><h2>From compliance to systems intelligence.</h2><p>Rethinking Rural Governance examines data integration, fiscal intelligence, workforce analytics, operational foresight, and transparency through the reference case of Delaware County, New York.</p><div class="publication-actions"><a href="https://doi.org/10.65473/rrg-v1-2025">Resolve DOI</a><a href="mailto:publications@sozorockfoundation.org?subject=Rethinking%20Rural%20Governance">Publication inquiries</a></div></div></section>${related}`
});

const rebsTitle = 'Rural Equity Blueprint Series, Volume 1: Access Day — Building a Framework for Rural Health Equity in New York State';
const rebs = () => page({
  path:'/publication/rebs-v1-2025', title:'Rural Equity Blueprint Series, Volume 1',
  description:'Rural Equity Blueprint Series Volume 1 presents the Access Day framework for rural health access, workforce pathways, and governance.',
  type:'article', image:'/assets/rebs-cover.jpg',
  citation:citation({title:rebsTitle,authors:['Oluwabiyi Adeyemo','Jordan Hare'],date:'2025-10',isbn:'9798993647708',doi:'10.65473/rebs-v1-2025'}),
  structuredData:publicationSchema({title:rebsTitle,description:'A policy-and-practice publication on rural health access, workforce pathways, and governance.',path:'/publication/rebs-v1-2025',authors:['Oluwabiyi Adeyemo','Jordan Hare'],datePublished:'2025-10',isbn:'9798993647708',doi:'10.65473/rebs-v1-2025'}),
  body:`<section class="pub-hero reveal-section"><div class="shell pub-grid"><div class="pub-copy"><p class="kicker">ACCESS AND EQUITY</p><h1>Rural Equity Blueprint Series</h1><p class="inner-lede">Volume 1 · Access Day — Building a Framework for Rural Health Equity in New York State</p>${facts([['Principal author','Oluwabiyi Adeyemo'],['Contributor','Jordan Hare, BSN, RN'],['Publisher','The SozoRock Foundation, Inc.'],['Published','October 2025'],['Pages','56'],['ISBN','9798993647708'],['DOI','<a href="https://doi.org/10.65473/rebs-v1-2025">10.65473/rebs-v1-2025</a>']])}</div><div class="pub-cover"><img src="/assets/rebs-cover.jpg" alt="Rural Equity Blueprint Series Volume 1 cover"></div></div></section><section class="content-section reveal-section"><div class="shell prose"><p class="kicker">ABOUT</p><h2>Access, workforce, and governance in one frame.</h2><p>Volume 1 brings health access, workforce pathways, community engagement, and governance together through the Access Day model for rural and underserved communities.</p><div class="publication-actions"><a href="https://doi.org/10.65473/rebs-v1-2025">Resolve DOI</a><a href="mailto:publications@sozorockfoundation.org?subject=Rural%20Equity%20Blueprint%20Series">Publication inquiries</a></div></div></section>${related}`
});

export const renderers = new Map([
  ['/',home],['/work',work],['/work/global-institute',globalInstitute],['/work/health',health],['/work/ai-lab',aiLab],
  ['/publications',publicationsPage],['/insights',insights],['/events',events],['/about',about],['/leadership',leadership],
  ['/partner',partner],['/support',support],['/standards',standards],['/publication/hsa-v1-2026',hsa],
  ['/publication/rrg-v1-2025',rrg],['/publication/rebs-v1-2025',rebs]
]);
