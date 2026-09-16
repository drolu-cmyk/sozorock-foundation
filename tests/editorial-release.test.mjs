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

test('homepage rural-health evidence remains source-qualified',()=>{
  const html=readFileSync('dist/client/index.html','utf8');
  assert.match(html,/What a rural-health dialogue surfaced\./);
  assert.match(html,/12,000\+/);
  assert.match(html,/primary-care clinician/);
  assert.match(html,/not measured post-program outcomes/i);
  assert.match(html,/href="\/publication\/rebs-v1-2025"/);
  assert.ok(!html.includes('SUNY'));
  assert.ok(!html.includes('post-program results'));
});

test('proposed convenings emit no scheduled Event schema',()=>{
  for(const route of ['events','ai-society']){
    const html=readFileSync(`dist/client/${route}.html`,'utf8');
    const schemas=[...html.matchAll(/<script[^>]*type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1]));
    assert.ok(schemas.length);
    assert.ok(!JSON.stringify(schemas).includes('"@type":"Event"'));
  }
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
