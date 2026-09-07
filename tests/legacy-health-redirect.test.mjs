import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const ctx=vm.createContext({});
vm.runInContext(readFileSync(new URL('../infra/cloudfront/legacy-health-redirect.js',import.meta.url),'utf8'),ctx);
const req=(uri='/',host='www.sozorockhealth.com',method='GET',querystring={})=>ctx.handler({request:{uri,method,querystring,headers:{host:{value:host}}}});
test('legacy Health hosts redirect permanently to the current Health experience',()=>{
 for(const host of ['www.sozorockhealth.com','sozorockhealth.com']) for(const uri of ['/','/explore','/publications']) {
  const result=req(uri,host);assert.equal(result.statusCode,301);assert.equal(result.headers.location.value,'https://health.sozorockfoundation.org'+uri);
 }
});
test('legacy CB-CAP links preserve their product destination',()=>assert.equal(req('/cb-cap').headers.location.value,'https://cbcap.sozorockfoundation.org/'));
test('private query values and obsolete API operations are not forwarded',()=>{
 assert.equal(req('/','www.sozorockhealth.com','GET',{token:{value:'private'},utm_source:{value:'old site'}}).headers.location.value,'https://health.sozorockfoundation.org/?utm_source=old%20site');
 assert.equal(req('/api/contact').statusCode,410);assert.equal(req('/','www.sozorockhealth.com','POST').statusCode,410);
 assert.equal(req('/','example.cloudfront.net').statusCode,403);
});
