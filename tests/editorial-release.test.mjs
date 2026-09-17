import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {publications} from '../src/siteData.js';
import worker from '../worker/index.js';

const publicationAccessMappings = [
  ['hsa-v1-2026','Health Systems Assurance','health-systems-assurance-volume-1'],
  ['rebs-v1-2025','Rural Equity Blueprint Series (REBS)','rural-equity-blueprint-volume-1'],
  ['rrg-v1-2025','Rethinking Rural Governance Series (RRG)','rethinking-rural-governance-volume-1'],
];

test('all three publications retain permanent records and verified delivery mappings', () => {
  for (const [slug,title,service] of publicationAccessMappings) {
    const p=publications.find(p=>p.slug===slug);
    assert.ok(p);
    assert.equal(p.title,title);
    assert.equal(p.path,`/publication/${slug}`);
    assert.equal(p.accessPath,`/publication/${slug}/access`);
    assert.equal(p.accessServiceSlug,service);
    const html=readFileSync(`dist/client/publication/${slug}.html`,'utf8');
    const accessHtml=readFileSync(`dist/client/publication/${slug}/access.html`,'utf8');
    assert.ok(html.includes(title));
    assert.match(html,new RegExp(`href="/publication/${slug}/access"`));
    assert.match(accessHtml,new RegExp(`Get ${title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}`));
    if(p.doi) assert.ok(html.includes(`https://doi.org/${p.doi}`));
  }
});

test('homepage uses evidence-led editorial storytelling without mechanical labels',()=>{
  const html=readFileSync('dist/client/index.html','utf8');
  assert.match(html,/Access should not end at the first visit\./);
  assert.match(html,/From instruction to evidence\./);
  assert.match(html,/25<\/strong><span>planned participants/);
  assert.match(html,/11<\/strong><span>graduate learners/);
  assert.match(html,/2 cohorts · 2025–26/);
  assert.match(html,/AI changes decisions/i);
  assert.match(html,/Participation/);
  assert.match(html,/Human review/);
  assert.match(html,/Accountability/);
  assert.match(html,/href="\/platforms\/applied-learning"/);
  assert.match(html,/href="\/ai-society"/);
  assert.doesNotMatch(html,/Current work/i);
  assert.doesNotMatch(html,/Work, documented/i);
  assert.doesNotMatch(html,/In practice/i);
  assert.doesNotMatch(html,/Faculty perspective/i);
  assert.doesNotMatch(html,/100\+/);
  assert.doesNotMatch(html,/45\+/);
  assert.doesNotMatch(html,/65%/);
  assert.doesNotMatch(html,/Institutions in active coordination/i);
});

test('applied learning records the graduate model and practitioner responsibility without brochure labels',()=>{
  const html=readFileSync('dist/client/platforms/applied-learning.html','utf8');
  assert.match(html,/Coursework is the starting point/i);
  assert.match(html,/From instruction to judgment/i);
  assert.match(html,/The evidence has to support the conclusion/i);
  assert.match(html,/Academic knowledge\. Workplace capability\./i);
  assert.match(html,/2<\/strong><span>cohorts/);
  assert.match(html,/11<\/strong><span>graduate learners/);
  assert.match(html,/Capella University’s Applied IT Capstone program/);
  assert.match(html,/Dr\. Oluwabiyi Adeyemo/);
  assert.match(html,/designs the experiential project tasks, mentors learners and evaluates their applied work/i);
  assert.match(html,/Capella University faculty retain course ownership, academic oversight and grading/i);
  assert.match(html,/Based on a September 2026 faculty assessment/i);
  assert.match(html,/not a university endorsement/i);
  assert.doesNotMatch(html,/Faculty perspective/i);
  assert.doesNotMatch(html,/Practitioner role/i);
  assert.doesNotMatch(html,/In practice/i);
});

test('planned health pilot is visible with clinical and evidence boundaries intact',()=>{
  const html=readFileSync('dist/client/platforms/health.html','utf8');
  assert.match(html,/Planned New York pilot/);
  assert.match(html,/25 participants\. One defined primary-care access pathway\./);
  assert.match(html,/Dr\. Michael Purcell \/ PIOC/);
  assert.match(html,/adults living with chronic conditions/i);
  assert.match(html,/nonclinical coordination, health education and deidentified program evidence/i);
  assert.match(html,/Clinical care remains entirely with the licensed provider/i);
  assert.match(html,/Participant enrollment and operating dates will be published when confirmed/i);
});

test('parent positioning stays broad while making AI and applied learning visible',()=>{
  const home=readFileSync('dist/client/index.html','utf8');
  const platforms=readFileSync('dist/client/platforms.html','utf8');
  const about=readFileSync('dist/client/about.html','utf8');
  assert.match(home,/Health access, applied learning, research and AI governance/i);
  assert.match(home,/Explore AI &amp; Society/i);
  assert.match(platforms,/Rural and underserved places remain a focused part of the work/i);
  assert.match(platforms,/AI &amp; Society/);
  assert.match(about,/Rural health and rural equity remain important/i);
  assert.match(about,/wider mandate includes health systems assurance, governance, public decisions, community participation and responsible AI/i);
});

test('publication access requires only delivery essentials and keeps profiling optional for every title',()=>{
  const source=readFileSync('src/PublicationAccessPage.jsx','utf8');
  assert.match(source,/name="firstName" required/);
  assert.match(source,/name="lastName" required/);
  assert.match(source,/name="email" required/);
  assert.match(source,/name="deliveryConsent" type="checkbox" value="yes" required/);
  assert.doesNotMatch(source,/name="organization" required/);
  assert.doesNotMatch(source,/name="sector" required/);
  assert.doesNotMatch(source,/name="cityOrRegion" required/);
  assert.doesNotMatch(source,/name="reason" required/);
  for(const [slug] of publicationAccessMappings){
    const html=readFileSync(`dist/client/publication/${slug}/access.html`,'utf8');
    assert.match(html,/Only your name and email are required for delivery/i);
    assert.match(html,/Optional readership details/);
    assert.match(html,/This is not required for access/);
  }
});

test('AI Society uses aligned CTAs and inspectable, bounded output cases',()=>{
  const html=readFileSync('dist/client/ai-society.html','utf8');
  assert.match(html,/class="button button-light"[^>]*>See the process</);
  assert.match(html,/class="button button-outline-light"[^>]*>Express interest</);
  assert.match(html,/Planned public outputs/);
  assert.match(html,/Records people can inspect/);
  assert.match(html,/Illustrative record/);
  assert.match(html,/Not a completed decision/);
  assert.match(html,/is not an adopted policy, completed decision or institutional commitment/i);
  assert.match(html,/What support makes possible/);
  assert.match(html,/without directing findings/i);
});

test('proposed convenings emit no scheduled Event schema',()=>{
  for(const route of ['events','ai-society']){
    const html=readFileSync(`dist/client/${route}.html`,'utf8');
    const schemas=[...html.matchAll(/<script[^>]*type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1]));
    assert.ok(schemas.length);
    assert.ok(!JSON.stringify(schemas).includes('\"@type\":\"Event\"'));
  }
});

test('legal routes expose direct institutional notices and footer access',()=>{
  const privacy=readFileSync('dist/client/privacy.html','utf8');
  const accessibility=readFileSync('dist/client/accessibility.html','utf8');
  const terms=readFileSync('dist/client/terms.html','utf8');
  const home=readFileSync('dist/client/index.html','utf8');
  assert.match(privacy,/>Retention</);
  assert.match(privacy,/No website, email or storage system can be guaranteed to be completely secure/i);
  assert.match(accessibility,/ongoing design and testing objective, not a claim/i);
  assert.match(terms,/>Public forms</);
  assert.match(home,/href="\/nondiscrimination"/);
  assert.match(home,/Privacy Notice/);
  assert.match(home,/Website Terms/);
  assert.doesNotMatch(home,/A U\.S\. 501\(c\)\(3\) public charity/);
});

test('participant interests reach the existing service with consent and perspective intact',async()=>{
  let forwarded;
  const response=await worker.fetch(new Request('https://example.test/api/contact',{
    method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      name:'Amina Okafor',email:'amina@example.org',organization:'Individual participant',
      inquiryType:'Institutional or public-sector inquiry',role:'Individual or family',stateOrCounty:'Albany, New York',
      message:'AI & Society participation interest\nPerspective: Educator\nFuture deliberation interest: Yes\n\nHow should students challenge a decision informed by automated assessment?',
      consent:true,website:''
    })
  }),{UPSTREAM_FETCH:async(url,options)=>{forwarded={url,body:JSON.parse(options.body)};return Response.json({accepted:true});}});
  assert.equal(response.status,200);
  assert.equal(forwarded.url,'https://health.sozorockfoundation.org/api/contact');
  assert.equal(forwarded.body.consent,true);
  assert.match(forwarded.body.message,/Perspective: Educator/);
  assert.match(forwarded.body.message,/How should students challenge/);
});

test('each parent publication access route forwards to its matching Health service slug',async()=>{
  for(const [slug,,service] of publicationAccessMappings){
    let forwardedUrl='';
    const response=await worker.fetch(new Request(`https://www.sozorockfoundation.org/api/publications/access/${slug}`,{
      method:'POST',
      headers:{'Content-Type':'application/json','Origin':'https://www.sozorockfoundation.org'},
      body:JSON.stringify({
        firstName:'Amina',lastName:'Okafor',email:'amina@example.org',
        organization:'Not provided by reader',sector:'Other',cityOrRegion:'Not provided by reader',
        state:'Not provided by reader',country:'Not provided by reader',
        reason:'Publication access requested without optional readership details.',
        deliveryConsent:true,updatesConsent:false,website:''
      })
    }),{UPSTREAM_FETCH:async(url)=>{forwardedUrl=String(url);return Response.json({accepted:true,verificationSent:true});}});
    assert.equal(response.status,200);
    assert.equal(forwardedUrl,`https://health.sozorockfoundation.org/api/publications/access/${service}`);
  }
});
