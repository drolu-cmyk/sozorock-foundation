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

test('homepage leads with a clear proposition and the 2027 New York health-access story',()=>{
  const html=readFileSync('dist/client/index.html','utf8');
  assert.match(html,/Research and practical systems for better access, capability and public decisions\./i);
  assert.match(html,/2027 · New York State/);
  assert.match(html,/Testing a clearer route to primary care\./i);
  assert.match(html,/25-participant health-access pilot/i);
  assert.match(html,/rural and underserved communities/i);
  assert.match(html,/PIOC, a direct primary care practice/i);
  assert.match(html,/support health equity across the state/i);
  assert.match(html,/href="\/platforms\/health"/);
  assert.match(html,/href="\/platforms\/applied-learning"/);
  assert.match(html,/href="\/ai-society"/);
  assert.doesNotMatch(html,/decisions that have to hold up/i);
  assert.doesNotMatch(html,/25<\/strong><span>planned participants/i);
  assert.doesNotMatch(html,/From instruction to evidence\./i);
  assert.doesNotMatch(html,/100\+/);
  assert.doesNotMatch(html,/45\+/);
  assert.doesNotMatch(html,/65%/);
  assert.doesNotMatch(html,/Institutions in active coordination/i);
});

test('applied learning is an outcome-led capability case without a numbered process diagram',()=>{
  const html=readFileSync('dist/client/platforms/applied-learning.html','utf8');
  assert.match(html,/Real work changes what a learner can do\./i);
  assert.match(html,/A university course became a working cybersecurity environment\./i);
  assert.match(html,/Across two consecutive cohorts, eleven Capella University graduate learners/i);
  assert.match(html,/identity and access management, cloud security, governance, risk and evidence assurance/i);
  assert.match(html,/Dr\. Oluwabiyi Adeyemo/);
  assert.match(html,/designs the experiential project tasks, mentors learners and evaluates their applied work/i);
  assert.match(html,/Capella University faculty retain academic oversight and grading/i);
  assert.match(html,/September 2026 faculty assessment/i);
  assert.match(html,/not a university endorsement/i);
  assert.doesNotMatch(html,/learning-journey-visual/);
  assert.doesNotMatch(html,/>01<\/strong>/);
  assert.doesNotMatch(html,/>02<\/strong>/);
  assert.doesNotMatch(html,/>03<\/strong>/);
  assert.doesNotMatch(html,/>04<\/strong>/);
});

test('2027 health pilot communicates population, purpose, partner model and clinical boundary',()=>{
  const html=readFileSync('dist/client/platforms/health.html','utf8');
  assert.match(html,/2027 · New York State/);
  assert.match(html,/Testing a clearer route to ongoing primary care\./i);
  assert.match(html,/25-participant health-access pilot/i);
  assert.match(html,/rural and underserved communities/i);
  assert.match(html,/Dr\. Michael Purcell and PIOC, a direct primary care practice/i);
  assert.match(html,/support health equity across New York State/i);
  assert.match(html,/Clinical assessment, diagnosis, treatment and prescribing remain entirely with the licensed provider/i);
  assert.match(html,/deidentified program evidence/i);
  assert.match(html,/Can residents who face access barriers enter an ongoing primary-care relationship more easily/i);
});

test('parent positioning stays broad while the Work page makes the current priority and routes clear',()=>{
  const home=readFileSync('dist/client/index.html','utf8');
  const platforms=readFileSync('dist/client/platforms.html','utf8');
  const about=readFileSync('dist/client/about.html','utf8');
  assert.match(home,/health access, applied learning, research and responsible AI/i);
  assert.match(platforms,/Different problems\. Clear routes into the work\./i);
  assert.match(platforms,/Current focus: 2027 New York health-access pilot/i);
  assert.match(platforms,/Applied learning/i);
  assert.match(platforms,/Research &amp; assurance/i);
  assert.match(platforms,/AI &amp; Society/i);
  assert.match(about,/Rural health and rural equity remain important/i);
  assert.match(about,/wider mandate includes health systems assurance, governance, public decisions, community participation and responsible AI/i);
});

test('internal platform links remain inside the parent SPA instead of forcing subdomain reloads',()=>{
  const source=readFileSync('src/router.jsx','utf8');
  assert.doesNotMatch(source,/\["\/platforms\/health",\s*"https:\/\/health\.sozorockfoundation\.org\//);
  assert.doesNotMatch(source,/\["\/platforms\/ai-lab",\s*"https:\/\/ai-lab\.sozorockfoundation\.org\//);
  assert.match(source,/\["\/platforms\/cbcap",\s*"https:\/\/cbcap\.sozorockfoundation\.org\//);
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
