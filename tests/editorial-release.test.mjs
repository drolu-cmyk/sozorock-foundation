import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,readdirSync} from 'node:fs';
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

test('homepage locks a stable proposition and explains why the health pilot exists',()=>{
  const html=readFileSync('dist/client/index.html','utf8');
  assert.match(html,/Evidence should lead somewhere\./i);
  assert.match(html,/2025 preplanning roundtable/i);
  assert.match(html,/12 participants/i);
  assert.match(html,/two county public-health jurisdictions/i);
  assert.match(html,/more than 12,000 residents per primary-care clinician/i);
  assert.match(html,/Why start with 25 people\?/i);
  assert.match(html,/In 2027/i);
  assert.match(html,/Dr\. Michael Purcell and PIOC, a direct primary care practice/i);
  assert.match(html,/what works, what breaks and what should change before expansion/i);
  assert.match(html,/A master&#x27;s degree should end with experience, not just coursework/i);
  assert.match(html,/11 learners/i);
  assert.match(html,/identity and access management, GRC, cloud security, risk and evidence assurance/i);
  assert.match(html,/href="\/partner"/);
  assert.match(html,/href="\/support"/);
  assert.doesNotMatch(html,/Research and practical systems for better access/i);
  assert.doesNotMatch(html,/12 months|two hours/i);
});

test('applied learning sells a six-month cybersecurity capability experience without a numbered process diagram',()=>{
  const html=readFileSync('dist/client/platforms/applied-learning.html','utf8');
  assert.match(html,/From coursework to cybersecurity work\./i);
  assert.match(html,/six-month experiential capstone collaboration with Capella University/i);
  assert.match(html,/cybersecurity master/i);
  assert.match(html,/limited hands-on cloud exposure/i);
  assert.match(html,/Identity and access management/i);
  assert.match(html,/>GRC</);
  assert.match(html,/Cloud security/i);
  assert.match(html,/Two cohorts\. Eleven graduate learners\. Six months per cohort\./i);
  assert.match(html,/least privilege/i);
  assert.match(html,/Capella University faculty retain course ownership, academic oversight and grading/i);
  assert.match(html,/Dr\. Oluwabiyi Adeyemo designs the experiential project tasks/i);
  assert.match(html,/not a university endorsement/i);
  assert.doesNotMatch(html,/>01<\/strong>|>02<\/strong>|>03<\/strong>|>04<\/strong>/);
  assert.doesNotMatch(html,/class="eyebrow"/);
});

test('2027 health page connects field evidence to a deliberately bounded pilot',()=>{
  const html=readFileSync('dist/client/platforms/health.html','utf8');
  assert.match(html,/Primary care can exist and still be hard to reach\./i);
  assert.match(html,/2025 SozoRock preplanning roundtable/i);
  assert.match(html,/more than 12,000 residents per primary-care clinician/i);
  assert.match(html,/REBS connects that access question with health literacy, technology, workforce and community readiness/i);
  assert.match(html,/In 2027, the next step is a 25-person test\./i);
  assert.match(html,/Starting with 25 keeps the first test small enough/i);
  assert.match(html,/Dr\. Michael Purcell and PIOC, a direct primary care practice/i);
  assert.match(html,/Clinical assessment, diagnosis, treatment and prescribing remain entirely with the licensed provider/i);
  assert.match(html,/deidentified program evidence/i);
  assert.doesNotMatch(html,/12 months|two hours/i);
  assert.doesNotMatch(html,/class="eyebrow"/);
});

test('what we do and research pages use proof and conversion rather than program catalog copy',()=>{
  const work=readFileSync('dist/client/platforms.html','utf8');
  const research=readFileSync('dist/client/publications.html','utf8');
  assert.match(work,/Start with the problem\./i);
  assert.match(work,/Two Capella University cohorts, 11 learners, six months per cohort/i);
  assert.match(work,/2025 roundtable evidence informs a planned 2027 New York pilot/i);
  assert.match(research,/Research built to be used\./i);
  assert.match(research,/free to access, citable and explicit about its limits/i);
  for(const [,title] of publicationAccessMappings) assert.match(research,new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(research,/Have a decision the research should inform\?/i);
  assert.match(research,/href="\/partner"/);
  assert.doesNotMatch(work,/class="eyebrow"/);
  assert.doesNotMatch(research,/class="eyebrow"/);
});

test('publication pages lead with why the research exists and preserve citation access',()=>{
  for(const [slug,title] of publicationAccessMappings){
    const html=readFileSync(`dist/client/publication/${slug}.html`,'utf8');
    assert.match(html,/Why this research exists\./i);
    assert.match(html,/Use the published record\./i);
    assert.match(html,/Get the publication/);
    assert.ok(html.includes(title));
    assert.doesNotMatch(html,/A permanent, citable record\./i);
    assert.doesNotMatch(html,/class="eyebrow"/);
  }
});

test('navigation, footer and mobile menu expose clear conversion and legal status',()=>{
  const home=readFileSync('dist/client/index.html','utf8');
  const chrome=readFileSync('src/SiteChrome.jsx','utf8');
  const css=readFileSync('src/final-polish.css','utf8');
  assert.match(home,/>What we do</);
  assert.match(home,/>Research</);
  assert.match(home,/>About</);
  assert.match(home,/>Contact</);
  assert.match(home,/>Partner</);
  assert.match(home,/>Support</);
  assert.match(home,/501\(c\)\(3\) public charity/);
  assert.match(home,/EIN 39-4736725/);
  assert.match(home,/Privacy/);
  assert.match(home,/Terms/);
  assert.match(home,/Accessibility/);
  assert.match(home,/Nondiscrimination/);
  assert.match(home,/Standards/);
  assert.match(chrome,/document\.body\.style\.overflow = "hidden"/);
  assert.match(chrome,/matchMedia\("\(min-width: 900px\)"\)/);
  assert.match(chrome,/event\.key === "Escape"/);
  assert.match(css,/@media \(max-width:899px\)/);
  assert.match(css,/position:fixed; top:96px/);
});

test('the approved visual system remains gradient-free and loads the targeted contrast correction last',()=>{
  const main=readFileSync('src/main.jsx','utf8');
  const cssFiles=readdirSync('src').filter((file)=>file.endsWith('.css'));
  const css=cssFiles.map((file)=>readFileSync(`src/${file}`,'utf8')).join('\n');
  assert.match(main,/import "\.\/accessibility-polish\.css";/);
  assert.doesNotMatch(css,/gradient\(/i);
  assert.match(readFileSync('src/accessibility-polish.css','utf8'),/Existing palette, type, spacing and visual system remain unchanged/);
});

test('about and events use a concise evidence led institutional story',()=>{
  const about=readFileSync('dist/client/about.html','utf8');
  const events=readFileSync('dist/client/events.html','utf8');
  assert.match(about,/A foundation built to move from evidence to use\./i);
  assert.match(about,/Health access can fail even when care exists/i);
  assert.match(events,/Put the question in the room\./i);
  assert.match(events,/more than 12,000 residents per primary-care clinician/i);
  assert.match(events,/2027 pilot will test/i);
  assert.doesNotMatch(about,/class="eyebrow"/);
  assert.doesNotMatch(events,/class="eyebrow"/);
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

test('legal routes remain available and the footer now states verified nonprofit status',()=>{
  const privacy=readFileSync('dist/client/privacy.html','utf8');
  const accessibility=readFileSync('dist/client/accessibility.html','utf8');
  const terms=readFileSync('dist/client/terms.html','utf8');
  const home=readFileSync('dist/client/index.html','utf8');
  assert.match(privacy,/>Retention</);
  assert.match(privacy,/No website, email or storage system can be guaranteed to be completely secure/i);
  assert.match(accessibility,/ongoing design and testing objective, not a claim/i);
  assert.match(terms,/>Public forms</);
  assert.match(home,/href="\/nondiscrimination"/);
  assert.match(home,/501\(c\)\(3\) public charity/);
  assert.match(home,/EIN 39-4736725/);
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