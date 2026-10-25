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
test('legacy redirect does not reflect unknown or personal paths',()=>{
 for(const path of ['//example.test/','/person@example.test','/%3Femail%3Dperson%40example.test']) {
  assert.equal(req(path).statusCode,404);assert.equal(req(path).headers.location,undefined);
 }
 assert.equal(req('/explore/').headers.location.value,'https://health.sozorockfoundation.org/explore');
});
test('private query values and obsolete API operations are not forwarded',()=>{
 for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) {
  assert.equal(req('/','www.sozorockhealth.com','GET',{[key]:{value:'person@example.test'}}).headers.location.value,'https://health.sozorockfoundation.org/');
 }
 assert.equal(req('/','www.sozorockhealth.com','GET',{token:{value:'private'},utm_source:{value:'old site'}}).headers.location.value,'https://health.sozorockfoundation.org/?utm_source=old%20site');
 assert.equal(req('/api/contact').statusCode,410);assert.equal(req('/','www.sozorockhealth.com','POST').statusCode,410);
 assert.equal(req('/','example.cloudfront.net').statusCode,403);
});

test('legacy about pages reach the existing Health work page',()=>{
 for(const host of ['www.sozorockhealth.com','sozorockhealth.com']) for(const uri of ['/about','/about/']) {
  const result=req(uri,host);assert.equal(result.statusCode,301);assert.equal(result.headers.location.value,'https://health.sozorockfoundation.org/work');
 }
});

const {validateDistribution,sampleEvents,inspectHeaders,validateFunctionTestResult}=await import('../scripts/publish-legacy-health-redirect.mjs');
test('AWS TestFunction response envelopes are validated before publishing',()=>{
 for(const sample of sampleEvents()){
  const response=ctx.handler(sample.event);
  const result={TestResult:{FunctionOutput:JSON.stringify({response})}};
  assert.equal(validateFunctionTestResult(result,sample).statusCode,sample.status);
  assert.throws(()=>validateFunctionTestResult({TestResult:{FunctionErrorMessage:'execution failed',FunctionOutput:JSON.stringify({response})}},sample));
  assert.throws(()=>validateFunctionTestResult({TestResult:{FunctionOutput:JSON.stringify(response)}},sample));
  assert.throws(()=>validateFunctionTestResult({TestResult:{FunctionOutput:JSON.stringify({response:{...response,statusCode:500}})}},sample));
  if(sample.location)assert.throws(()=>validateFunctionTestResult({TestResult:{FunctionOutput:JSON.stringify({response:{...response,headers:{location:{value:'https://example.invalid'}}}})}},sample));
 }
 for(const FunctionOutput of [undefined,'{','null','{}'])assert.throws(()=>validateFunctionTestResult({TestResult:{FunctionOutput}},sampleEvents()[0]));
});
test('every development-stage sample has the expected response',()=>{
 for(const sample of sampleEvents()){
  const result=ctx.handler(sample.event);
  assert.equal(result.statusCode,sample.status);
  if(sample.location)assert.equal(result.headers.location.value,sample.location);
 }
});
test('publishing requires the exact legacy aliases and every viewer-request association',()=>{
 const behavior={FunctionAssociations:{Items:[{EventType:'viewer-request',FunctionARN:'expected-function'}]}};
 const response={ETag:'version-one',Distribution:{Status:'Deployed',DistributionConfig:{Enabled:true,Aliases:{Items:['www.sozorockhealth.com','sozorockhealth.com']},DefaultCacheBehavior:behavior,CacheBehaviors:{Items:[behavior]}}}};
 assert.equal(validateDistribution(response,'expected-function'),'version-one');
 for(const mutate of [
  value=>value.Distribution.DistributionConfig.Aliases.Items.push('www.sozorockfoundation.org'),
  value=>value.Distribution.DistributionConfig.Aliases.Items.pop(),
  value=>value.Distribution.DistributionConfig.DefaultCacheBehavior.FunctionAssociations.Items[0].FunctionARN='other-function',
  value=>value.Distribution.DistributionConfig.CacheBehaviors.Items[0].FunctionAssociations.Items=[],
  value=>value.Distribution.DistributionConfig.Enabled=false,
  value=>value.Distribution.Status='InProgress',
 ]){
  const changed=structuredClone(response);mutate(changed);
  assert.throws(()=>validateDistribution(changed,'expected-function'));
 }
});
test('verification rejects temporary redirects and wrong destinations',()=>{
 const location='https://health.sozorockfoundation.org/work';
 assert.equal(inspectHeaders('HTTP/2 301\r\nLocation: '+location+'\r\n',location).matches,true);
 assert.equal(inspectHeaders('HTTP/1.1 200 Connection established\r\n\r\nHTTP/2 301\r\nlocation: '+location+'\r\n',location).matches,true);
 for(const status of [200,302,307,308,404])assert.equal(inspectHeaders('HTTP/2 '+status+'\r\nLocation: '+location+'\r\n',location).matches,false);
 assert.equal(inspectHeaders('HTTP/2 301\r\nLocation: https://example.org\r\n',location).matches,false);
});
test('publishing is manual, main-only, production-gated and backs up before mutation',()=>{
 const workflow=readFileSync(new URL('../.github/workflows/publish-legacy-health-redirect.yml',import.meta.url),'utf8');
 assert.match(workflow,/on:\s*\n  workflow_dispatch:/);
 assert.doesNotMatch(workflow,/\n  (push|pull_request|schedule):/);
 assert.match(workflow,/github\.ref == 'refs\/heads\/main'/);
 assert.match(workflow,/environment: production/);
 assert.match(workflow,/persist-credentials: false/);
 assert.ok(workflow.indexOf('name: Preserve the complete pre-change backup')<workflow.indexOf('mjs publish'));
 assert.match(workflow,/vars\.LEGACY_HEALTH_FUNCTION_NAME/);
 assert.match(workflow,/vars\.LEGACY_HEALTH_DISTRIBUTION_ID/);
 assert.doesNotMatch(workflow,/\b\d{12}\b/);
});
