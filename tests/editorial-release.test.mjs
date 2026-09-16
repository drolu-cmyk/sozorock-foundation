import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {publications} from '../src/siteData.js';
import worker from '../worker/index.js';

test('rural series retain their correct DOI, permanent route and delivery mapping', () => {
  for (const [slug,title,service] of [
    ['rebs-v1-2025','Rural Equity Blueprint Series (REBS)','rural-equity-blueprint-volume-1'],
    ['rrg-v1-2025','Rethinking Rural Governance Series (RRG)','rethinking-rural-governance-volume-1'],
  ]) {
    const p=publications.find(p=>p.slug===slug);
    assert.equal(p.title,title);
    assert.equal(p.doi,`10.65473/${slug}`);
    assert.equal(p.path,`/publication/${slug}`);
    assert.equal(p.accessServiceSlug,service);
    const html=readFileSync(`dist/client/publication/${slug}.html`,'utf8');
    assert.ok(html.includes(`https://doi.org/${p.doi}`));
    assert.ok(html.includes(title));
  }
});

test('homepage roundtable evidence remains accurate, attributed and bounded',()=>{
  const html=readFileSync('dist/client/index.html','utf8');
  assert.match(html,/What a SozoRock rural-health roundtable surfaced\./);
  assert.match(html,/12[^<]*participants/i);
  assert.match(html,/2[^<]*county public-health jurisdictions/i);
  assert.match(html,/2[^<]*Western New York universities represented/i);
  assert.match(html,/university school of nursing/i);
  assert.match(html,/12,000\+/);
  assert.match(html,/primary-care clinician/);
  assert.match(html,/participant-reported access condition/i);
  assert.match(html,/not as an independently re-estimated statistic or a program outcome/i);
  assert.match(html,/href="\/publication\/rebs-v1-2025"/);
  assert.ok(!html.includes('SUNY'));
  assert.ok(!html.includes('Brockport'));
  assert.ok(!html.includes('post-program results'));
});

test('parent positioning includes rural work without narrowing the mission to rural only',()=>{
  const home=readFileSync('dist/client/index.html','utf8');
  const platforms=readFileSync('dist/client/platforms.html','utf8');
  const about=readFileSync('dist/client/about.html','utf8');
  assert.match(home,/Research, health access, public systems and practical AI learning/i);
  assert.match(platforms,/including focused work in rural and underserved places/i);
  assert.match(about,/Rural health and rural equity are important areas of focus/i);
  assert.match(about,/wider work also addresses health systems assurance, governance, public-sector decision-making, community participation and responsible AI/i);
});

test('AI Society uses aligned CTAs and visible support and output cases',()=>{
  const html=readFileSync('dist/client/ai-society.html','utf8');
  assert.match(html,/class="button button-light"[^>]*>Explore the approach</);
  assert.match(html,/class="button button-outline-light"[^>]*>Participate</);
  assert.match(html,/Proposed public record/);
  assert.match(html,/What the work is designed to produce/);
  assert.match(html,/What support enables/);
  assert.match(html,/without directing findings/i);
});

test('proposed convenings emit no scheduled Event schema',()=>{
  for(const route of ['events','ai-society']){
    const html=readFileSync(`dist/client/${route}.html`,'utf8');
    const schemas=[...html.matchAll(/<script[^>]*type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1]));
    assert.ok(schemas.length);
    assert.ok(!JSON.stringify(schemas).includes('"@type":"Event"'));
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
