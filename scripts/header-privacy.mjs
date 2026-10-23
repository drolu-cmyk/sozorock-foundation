import { isIP } from 'node:net';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readdir, readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const exec = promisify(execFile);
export const forbiddenHeaders = new Set([
  'accept-ch', 'critical-ch', 'server-timing', 'nel', 'report-to',
  'reporting-endpoints', 'x-powered-by', 'x-amz-server-side-encryption',
  'x-amz-version-id', 'x-amz-request-id', 'x-amz-id-2',
]);
export const browserHeaders = [
  'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language: en-US,en;q=0.9',
  'Sec-CH-UA: "Chromium";v="130", "Not_A Brand";v="24"',
  'Sec-CH-UA-Mobile: ?0', 'Sec-CH-UA-Platform: "Linux"',
  'Sec-Fetch-Dest: document', 'Sec-Fetch-Mode: navigate', 'Sec-Fetch-Site: none',
];

export function carriesPersonalData(value) {
  // Inspect the wire representation and URL-encoded values (especially Location).
  const forms = [value];
  try { forms.push(decodeURIComponent(value)); } catch { /* Keep checking the wire value. */ }
  return forms.some((text) => {
    if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/iu.test(text)) return true;
    for (const match of text.matchAll(/[0-9a-f:.]+(?:%[a-z0-9_.~-]+)?/giu)) {
      const token = match[0].replace(/\.$/u, '');
      // A colon can also delimit an address in free-form header text. Check
      // the whole literal first, preserving leading/trailing IPv6 compression.
      for (const candidate of [token, token.replace(/^:/u, ''), token.replace(/:$/u, ''), token.replace(/^:|:$/gu, '')]) {
        if (isIP(candidate)) return true;
        // IPv4 with a port; IPv6 URL literals are separated by brackets.
        if (/^\d+\.\d+\.\d+\.\d+:\d+$/u.test(candidate) && isIP(candidate.split(':')[0])) return true;
      }
    }
    return false;
  });
}

export function inspectHeaders(headers) {
  const failures = [];
  for (const [rawName, value] of headers) {
    const name = rawName.toLowerCase();
    if (forbiddenHeaders.has(name) || (name === 'server' && /amazons3/iu.test(value))) failures.push(`forbidden header ${name}`);
    if (carriesPersonalData(value)) failures.push(`email or IP address in ${name}`);
  }
  // Return header names only: never copy a leaked address or token into CI logs.
  return failures;
}

export function parseHeaderBlocks(raw) {
  return raw.trim().split(/\r?\n\r?\n/u).filter((block) => /^HTTP\//u.test(block)).map((block) => {
    const [line, ...lines] = block.split(/\r?\n/u);
    const status = Number(line.match(/^HTTP\/\S+\s+(\d{3})/u)?.[1]);
    if (!status) throw new Error('Invalid HTTP status');
    const headers = [];
    for (const line of lines) {
      if (/^[ \t]/u.test(line) && headers.length) headers.at(-1)[1] += ` ${line.trim()}`;
      else {
        const index = line.indexOf(':');
        if (index < 1) throw new Error('Invalid HTTP header');
        headers.push([line.slice(0, index), line.slice(index + 1).trim()]);
      }
    }
    return { status, headers };
  });
}

export async function requestHeaders(url, profile = 'browser') {
  const args = ['-q', '--silent', '--show-error', '--suppress-connect-headers',
    '--proto', '=http,https', '--tlsv1.2', '--max-time', '20', '-D', '-', '-o', '/dev/null'];
  if (profile === 'browser') for (const header of browserHeaders) args.push('-H', header);
  args.push(url.href);
  try {
    const { stdout } = await exec('curl', args, { maxBuffer: 1024 * 1024 });
    const blocks = parseHeaderBlocks(stdout);
    if (!blocks.length) throw new Error('Missing HTTP response');
    return blocks;
  } catch { throw new Error('Request failed or no valid HTTP response'); }
}

export async function checkChain(start, hosts, { request = requestHeaders, profile = 'browser', maxRedirects = 5 } = {}) {
  let url = new URL(start);
  const statuses = [];
  for (let hop = 0; hop <= maxRedirects; hop++) {
    if (!hosts.has(url.hostname) || !['http:', 'https:'].includes(url.protocol) || url.port || url.username || url.password) throw new Error('Redirect target outside production inventory');
    const blocks = await request(url, profile);
    for (const block of blocks) {
      const failures = inspectHeaders(block.headers);
      if (failures.length) throw new Error(`hop ${hop}: ${failures.join('; ')}`);
    }
    const response = blocks.at(-1);
    statuses.push(response.status);
    if (![301, 302, 303, 307, 308].includes(response.status)) return statuses;
    const locations = response.headers.filter(([name]) => name.toLowerCase() === 'location');
    if (locations.length !== 1) throw new Error('Redirect must have one Location');
    let next;
    try { next = new URL(locations[0][1], url); } catch { throw new Error('Invalid redirect URL'); }
    if (url.protocol === 'https:' && next.protocol !== 'https:') throw new Error('HTTPS redirect downgrade');
    url = next;
  }
  throw new Error('Redirect limit exceeded');
}

export function validateInventory(sites) {
  const hosts = new Set();
  if (!Array.isArray(sites) || !sites.length) throw new Error('Empty production inventory');
  for (const site of sites) {
    if (!/^(?:[a-z0-9-]+\.)*(?:sozorockfoundation\.org|sozorockhealth\.com)$/u.test(site.hostname) || hosts.has(site.hostname)) throw new Error('Invalid or duplicate production hostname');
    hosts.add(site.hostname);
    if (!site.source || !site.error || !(site.pages?.length || site.redirects?.length || site.api)) throw new Error(`Incomplete coverage for ${site.hostname}`);
    for (const path of [...(site.pages ?? []), ...(site.redirects ?? []), site.error.path, ...(site.extraErrors ?? []).map((x) => x.path), ...(site.api ? [site.api.path] : [])]) {
      if (!path?.startsWith('/') || path.startsWith('//') || /[?#\\]/u.test(path)) throw new Error('Invalid monitor path');
    }
    for (const sample of [site.error, ...(site.extraErrors ?? []), ...(site.api ? [site.api] : [])]) {
      if (!sample.statuses?.length || sample.statuses.some((status) => !Number.isInteger(status) || status < 200 || status >= 500)) throw new Error('Invalid expected status');
    }
  }
  return hosts;
}

// Cover bare deployment hostnames, apex, nested aliases and HTTP/HTTPS links.
export function configuredHosts(text) {
  return new Set([...text.matchAll(/(?<![a-z0-9_@.-])(?:[a-z0-9-]+\.)*(?:sozorockfoundation\.org|sozorockhealth\.com)(?![a-z0-9.-])/giu)].map((match) => match[0].toLowerCase()));
}

export async function validateConfiguredHosts(root, hosts) {
  async function scan(dir) {
    for (const entry of await readdir(new URL(dir, root), { withFileTypes: true })) {
      const relative = `${dir}${entry.name}${entry.isDirectory() ? '/' : ''}`;
      if (entry.isDirectory()) await scan(relative);
      else if (/\.(?:[cm]?jsx?|tsx?|json|ya?ml|html|txt|xml|sh)$/u.test(entry.name)) {
        for (const host of configuredHosts(await readFile(new URL(relative, root), 'utf8'))) {
          if (!hosts.has(host)) throw new Error(`Production inventory missing ${host} from ${relative}`);
        }
      }
    }
  }
  for (const dir of ['src/', 'public/', 'worker/', 'infra/', 'scripts/', '.github/workflows/']) await scan(dir);
}

export function samplesFor(site) {
  return [
    ...(site.pages ?? []).map((path) => ({ path, statuses: [200] })),
    ...(site.redirects ?? []).map((path) => ({ path, statuses: [200], redirect: true })),
    site.error, ...(site.extraErrors ?? []), ...(site.api ? [site.api] : []),
    { path: '/', statuses: site.api ? site.api.statuses : [200], redirect: true, http: true },
  ];
}

export async function monitor(sites, { request = requestHeaders, log = console.log } = {}) {
  const hosts = validateInventory(sites);
  const failures = [];
  const tasks = sites.flatMap((site) => samplesFor(site).flatMap((sample) => ['browser', 'plain'].map((profile) => ({ site, sample, profile }))));
  async function check({ site, sample, profile }) {
    const start = `${sample.http ? 'http' : 'https'}://${site.hostname}${sample.path}`;
    try {
      const statuses = await checkChain(start, hosts, { request, profile });
      if (sample.redirect && ![301, 302, 303, 307, 308].includes(statuses[0])) throw new Error('Expected redirect');
      if (!sample.statuses.includes(statuses.at(-1))) throw new Error(`Unexpected status sequence ${statuses.join(' -> ')}`);
      log(`${start} (${profile}) ${statuses.join(' -> ')} private`);
    } catch (error) {
      failures.push(`${start} (${profile}): ${error.message}`);
    }
  }
  // Bound traffic and avoid one slow hostname blocking coverage of the others.
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (tasks.length) await check(tasks.shift());
  }));
  return failures;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = new URL('../', import.meta.url);
  const { sites } = JSON.parse(await readFile(new URL('infra/production-sites.json', root), 'utf8'));
  await validateConfiguredHosts(root, validateInventory(sites));
  const failures = await monitor(sites);
  for (const failure of failures) console.error(failure);
  if (failures.length) process.exitCode = 1;
}
