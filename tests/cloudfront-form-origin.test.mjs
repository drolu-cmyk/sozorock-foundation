import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const template=(await readFile(new URL('../infra/cloudformation/parent-cloudfront.yml',import.meta.url),'utf8')).replace(/\r\n/g,'\n');
const marker='      FunctionCode: |\n';
assert(template.includes(marker));
const remaining=template.slice(template.indexOf(marker)+marker.length);
const end=remaining.search(/^\s{2}\S/m);
const source=(end<0?remaining:remaining.slice(0,end)).split('\n').map(line=>line.startsWith('        ')?line.slice(8):line).join('\n');
const context=vm.createContext({encodeURIComponent,Object,JSON});
vm.runInContext(source,context);
const request=(uri,method,origin)=>context.handler({request:{uri,method,querystring:{},headers:{host:{value:'www.sozorockfoundation.org'},...(origin?{origin:{value:origin}}:{})}}});

test('rejects hostile and missing visitor origins before proxy rewrites',()=>{
  for(const path of ['/api/contact','/api/publications/access/hsa-v1-2026','/api/publications/verify','/api/navigator']) {
    for(const origin of [undefined,'null','https://attacker.invalid','https://www.sozorockfoundation.org.attacker.invalid']) {
      const response=request(path,'POST',origin);
      assert.equal(response.statusCode,403);
      assert.match(response.headers['cache-control'].value,/no-store/);
    }
  }
});
test('preserves the approved same-origin form route and slug mapping',()=>{
  const response=request('/api/publications/access/hsa-v1-2026','POST','https://www.sozorockfoundation.org');
  assert.equal(response.uri,'/api/publications/access/health-systems-assurance-volume-1');
  assert.equal(response.method,'POST');
});
test('keeps read-only evidence routes and verification links reachable',()=>{
  assert.equal(request('/api/publications/verify','GET').uri,'/api/publications/verify');
  assert.equal(request('/api/evidence/v1/counties','GET').uri,'/api/evidence/v1/counties');
});
