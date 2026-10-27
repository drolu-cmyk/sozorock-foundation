import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { mkdtemp, mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  carriesPersonalData, inspectHeaders, parseHeaderBlocks, requestHeaders, checkChain,
  configuredHosts, validateInventory, validateConfiguredHosts, monitor,
} from '../scripts/header-privacy.mjs';

test('detects valid IPv4 and every IPv6 representation, including trailing compression', () => {
  for (const value of [
    '192.0.2.1', 'client=192.0.2.1:443', 'client:192.0.2.1', 'client:2001:db8::1',
    'client:192.0.2.1:443:', '192.0.2.1:', '2001:db8::1', '2001:db8::', '::', '::1',
    '2001:0db8:0000:0000:0000:ff00:0042:8329', '::ffff:192.0.2.1',
    'for="[2001:db8::]:443"', 'fe80::1%eth0', 'https://[::]/',
    'https://example.org/?ip=2001%3Adb8%3A%3A',
    'mailto:person@example.org', 'https://example.org/?email=person%40example.org',
  ]) assert.equal(carriesPersonalData(value), true, value);
});

test('does not misclassify dates, ports, validators, policy text or invalid addresses', () => {
  for (const value of [
    'Fri, 23 Oct 2026 00:22:45 GMT', 'h3=":443"; ma=86400', '1.2.3.999',
    'sha256-abcDEF0123456789=', '"c0ffee-abcdef1234567890"',
    "default-src 'self'; img-src 'self' data:; connect-src https://health.sozorockfoundation.org",
    'max-age=63072000; includeSubDomains; preload',
    'browsing-topics=(), camera=(), geolocation=(), microphone=(self), payment=(), usb=()',
    'same-origin', 'none',
  ]) assert.equal(carriesPersonalData(value), false, value);
});

test('checks duplicate and folded headers, interim responses and names case-insensitively', () => {
  const blocks = parseHeaderBlocks('HTTP/1.1 103 Early Hints\r\nAccept-CH: Sec-CH-UA-Full-Version\r\n\r\nHTTP/2 200\r\nX-Test: safe\r\nx-test:\r\n 2001:db8::\r\n\r\n');
  assert.deepEqual(blocks.map((block) => block.status), [103, 200]);
  assert.deepEqual(inspectHeaders(blocks[0].headers), ['forbidden header accept-ch']);
  assert.deepEqual(inspectHeaders(blocks[1].headers), ['email or IP address in x-test']);
  assert.deepEqual(inspectHeaders([['Server', 'AmazonS3'], ['X-Amz-Request-Id', 'opaque']]), ['forbidden header server', 'forbidden header x-amz-request-id']);
});

const host = 'fixture.sozorockfoundation.org';
const hosts = new Set([host]);
const response = (status = 200, headers = []) => [{ status, headers }];

test('inspects intermediate redirect, final and error headers before reporting success', async () => {
  for (const leakAt of ['intermediate', 'final', 'error']) {
    const request = async (url) => url.pathname === '/'
      ? response(302, [['Location', '/middle']])
      : url.pathname === '/middle'
        ? response(307, [['Location', '/final'], ...(leakAt === 'intermediate' ? [['Critical-CH', 'test']] : [])])
        : response(leakAt === 'error' ? 404 : 200, [['X-Client', '2001:db8::']]);
    await assert.rejects(checkChain(`https://${host}/`, hosts, { request }), /forbidden header|email or IP/u);
  }
  assert.deepEqual(await checkChain(`https://${host}/`, hosts, {
    request: async (url) => url.pathname === '/' ? response(301, [['Location', '/safe']]) : response(),
  }), [301, 200]);
});

test('redirects fail closed for loops, missing Location, unconfigured hosts and HTTPS downgrade', async () => {
  for (const location of [undefined, '/', 'https://new.sozorockfoundation.org/', 'http://' + host + '/', 'file:///tmp/test', 'https://person:secret@' + host + '/']) {
    let calls = 0;
    const request = async () => { calls++; return response(302, location ? [['Location', location]] : []); };
    await assert.rejects(checkChain(`https://${host}/`, hosts, { request }));
    assert.ok(calls <= 6);
  }
});

test('actual transport uses GET and sends browser headers, and also checks plain responses', async (t) => {
  const requests = [];
  const server = createServer((req, res) => {
    requests.push({ method: req.method, headers: req.headers });
    res.setHeader('X-Client', '::');
    res.end('body discarded');
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => server.close(resolve)));
  for (const profile of ['browser', 'plain']) {
    const blocks = await requestHeaders(new URL(`http://127.0.0.1:${server.address().port}/non-root`), profile);
    assert.ok(inspectHeaders(blocks.at(-1).headers).includes('email or IP address in x-client'));
  }
  assert.deepEqual(requests.map((request) => request.method), ['GET', 'GET']);
  assert.match(requests[0].headers['user-agent'], /Mozilla/u);
  assert.match(requests[0].headers['sec-ch-ua'], /Chromium/u);
  assert.equal(requests[1].headers['sec-ch-ua'], undefined);
});

test('monitor exercises nonroot pages, redirects and real error statuses in both profiles', async () => {
  const calls = [];
  const site = { hostname: host, source: 'fixture', pages: ['/', '/work'], redirects: ['/old'], error: { path: '/missing', statuses: [404] } };
  const request = async (url, profile) => {
    calls.push([url.href, profile]);
    if (url.protocol === 'http:') return response(301, [['Location', `https://${host}/`]]);
    if (url.pathname === '/old') return response(308, [['Location', '/work']]);
    return response(url.pathname === '/missing' ? 404 : 200);
  };
  assert.deepEqual(await monitor([site], { request, log() {} }), []);
  for (const profile of ['browser', 'plain']) for (const path of ['/', '/work', '/old', '/missing']) {
    assert.ok(calls.some(([url, p]) => url === `https://${host}${path}` && p === profile));
  }
  const failures = await monitor([site], { request: async () => response(200), log() {} });
  assert.ok(failures.some((failure) => failure.includes('Unexpected status')));
  assert.ok(failures.some((failure) => failure.includes('Expected redirect')));
  const leaking = await monitor([site], { request: async () => response(404, [['X-Test', '192.0.2.1']]), log() {} });
  assert.ok(leaking.length);
  assert.ok(leaking.every((failure) => !failure.includes('192.0.2.1')));
  for (const value of ['client:192.0.2.1', 'client:2001:db8::1']) {
    const failures = await monitor([site], { request: async () => response(200, [['X-Client', value]]), log() {} });
    assert.equal(failures.length, 10);
    assert.ok(failures.every((failure) => failure.includes('email or IP address in x-client') && !failure.includes(value)));
  }
});

test('hostname discovery covers bare apex, nested aliases, mixed case and legacy configuration', () => {
  assert.deepEqual([...configuredHosts('APEX_HOST: sozorockfoundation.org\nhttps://WWW.health.sozorockfoundation.org/\nhttp://new.deep.sozorockfoundation.org\n["sozorockhealth.com", "www.sozorockhealth.com"]\ncontact@sozorockfoundation.org')], [
    'sozorockfoundation.org', 'www.health.sozorockfoundation.org', 'new.deep.sozorockfoundation.org', 'sozorockhealth.com', 'www.sozorockhealth.com',
  ]);
});

test('new unlisted production host in deployment config fails validation', async (t) => {
  const dir = await mkdtemp(join(tmpdir(), 'privacy-inventory-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  for (const path of ['src', 'public', 'worker', 'infra', 'scripts', '.github/workflows']) await mkdir(join(dir, path), { recursive: true });
  await writeFile(join(dir, '.github/workflows/deploy.yml'), 'DOMAIN_NAME: new.deep.sozorockfoundation.org\n');
  await assert.rejects(validateConfiguredHosts(pathToFileURL(dir + '/'), new Set(['sozorockfoundation.org'])), /missing new.deep.sozorockfoundation.org/u);
  await validateConfiguredHosts(pathToFileURL(dir + '/'), new Set(['new.deep.sozorockfoundation.org']));
});

test('current production inventory is valid and covers source configuration', async () => {
  const root = new URL('../', import.meta.url);
  const { sites } = JSON.parse(await readFile(new URL('infra/production-sites.json', root), 'utf8'));
  const inventoryHosts = validateInventory(sites);
  await validateConfiguredHosts(root, inventoryHosts);
  assert.equal(inventoryHosts.size, 9);
  assert.throws(() => validateInventory([]));
  assert.throws(() => validateInventory([...sites, sites[0]]));
  assert.throws(() => validateInventory([{ ...sites[0], hostname: 'example.org' }]));
});
