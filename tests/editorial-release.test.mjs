import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
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

const page = route => readFileSync(`dist/client/${route || 'index'}.html`,'utf8');
const visible = html => html.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
test('approved pages retain the core programs and claim boundaries',()=>{
  const home=visible(page(''));
  for(const term of ['Healthier communities. Stronger systems.','A say in what’s next.','Demand for care, skills and trusted AI is outpacing supply.','How we work','Health Access','Workforce Capacity','AI &amp; Society','Results people can see.','Up to 25 people gain a year of primary care from January 2027.','Evidence leaders can act on.','Health Systems Assurance Series','Rethinking Rural Governance Series','Rural Equity Blueprint Series','Modernization and Resilience Program','Tuesdays at 6:30 pm, Albany, New York State','Join the conversation.','Date to be announced','Western New York preplanning roundtable','The SozoRock Briefing']) assert.ok(home.includes(term),term);
  assert.doesNotMatch(home,/Proposed|\u2014|\u2013/);
  const workforce=visible(page('workforce'));
  for(const term of ['Stronger systems start with skilled people.','cloud, security, governance and AI','Capella University','Athabasca University','6 learners','5 learners','1 learner','Capella University, which retains academic oversight and grading','Dr. Oluwabiyi Adeyemo','Register for the AI Lab']) assert.ok(workforce.includes(term),term);
  assert.doesNotMatch(workforce,/94|grade of/i);
  const work=visible(page('platforms'));
  for(const term of ['Three gaps we work to close.','Health Equity Hubs','Primary Care Access Program','Nike Oye','Jordan Hare','Anthony Abraham','Dr. Oluwabiyi Adeyemo','Funding never buys a conclusion.']) assert.ok(work.includes(term),term);
  const health=visible(page('platforms/health'));
  for(const term of ['libraries, community centers and homes','Library Health Equity Hub','Community Health Equity Hub','Home Health Equity Hub','Health Access Day','Clinical care remains with the licensed provider.','Membership is not health insurance.','Participant reported context']) assert.ok(health.includes(term),term);
  const support=visible(page('support'));
  for(const term of ['Clinical care remains with the licensed provider.','Membership is not health insurance.']) assert.ok(support.includes(term),term);
  const events=visible(page('events'));
  assert.doesNotMatch(events,/industry, county and academic leaders|providers, public health, educators and communities/i);
  assert.doesNotMatch(home,/12 months|two hours|founder/i);
  for(const term of ['Western New York preplanning roundtable','Dates are announced as they are confirmed.','Date to be announced','Participant reported context']) assert.ok(events.includes(term),term);
});
test('all approved routes have one heading, unique canonical metadata, and working internal destinations',()=>{
 const paths=JSON.parse(readFileSync('src/approved-metadata.json','utf8'));
 const titles=new Set();
 for(const route of Object.keys(paths)){
  const html=page(route==='/'?'':route.slice(1));
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,route);
  const title=html.match(/<title>(.*?)<\/title>/)[1]; assert.ok(!titles.has(title),title);titles.add(title);
  assert.ok(html.includes(`rel="canonical" href="https://www.sozorockfoundation.org${route==='/'?'':route}`),route);
  assert.doesNotMatch(visible(html),/Draft for approval|Effective date to follow|Keep the existing|inspected Albany/i);
  for(const [,href] of html.matchAll(/<a[^>]*href="(\/[^"?#]*)/g)) assert.ok(paths[href]||href==='/'||existsSync('dist/client'+href),'internal link '+href);
 }
});
test('research records and access keep citations, delivery essentials and separate optional consent',()=>{
 for(const [slug] of publicationAccessMappings){
  const html=page('publication/'+slug),access=page('publication/'+slug+'/access');
  assert.match(html,/>Citation</);assert.match(html,/Copy citation/);assert.match(html,/Scope/);
  assert.match(access,/Optional readership details/);assert.match(access,/This is not required for access/);
  for(const field of ['firstName','lastName','email','deliveryConsent']) assert.match(access,new RegExp('<input(?=[^>]*name="'+field+'")(?=[^>]*required)[^>]*>'));
  for(const field of ['organization','sector','reason','updatesConsent']) assert.doesNotMatch(access,new RegExp('<input(?=[^>]*name="'+field+'")(?=[^>]*required)[^>]*>'));
  assert.doesNotMatch(access,/href="[^"<>]*\.pdf(?:["?])/i);
 }
});
test('navigation, footer and forms retain accessible actions and legal identity',()=>{
 const html=page(''), chrome=readFileSync('src/SiteChrome.jsx','utf8');
 for(const label of ['Our Work','Research','Events','About','Subscribe','Support','Support our work','Partner with us','Contact','Leadership','Privacy Policy','Terms of Use','Accessibility','Nondiscrimination','Standards','EIN 39-4736725','501(c)(3)']) assert.ok(html.includes(label),label);
 assert.match(chrome,/event\.key === "Escape"/);assert.match(chrome,/document\.body\.style\.overflow = "hidden"/);
 for(const route of ['support','partner','contact']){const form=page(route);for(const name of ['firstName','lastName','email','organization','jobTitle','subject','message'])assert.ok(form.includes(`name="${name}"`),route+' '+name);}
});
test('proposed convenings do not claim scheduled events and show public participation',()=>{
 const html=page('ai-society');assert.match(html,/Who Decides\?/);assert.match(html,/name="perspective"/);
 for(const route of ['events','ai-society']) assert.doesNotMatch(page(route),/"@type":"Event"/);
 const css=readdirSync('src').filter(f=>f.endsWith('.css')).map(f=>readFileSync('src/'+f,'utf8')).join('');assert.doesNotMatch(css,/gradient\(/i);
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
