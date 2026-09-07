import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import worker from '../worker/index.js';

const root = resolve('dist/client');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };
http.createServer(async (incoming, outgoing) => {
  try {
    const url = new URL(incoming.url, 'http://127.0.0.1:4174');
    // This local verifier never submits form data to production services.
    if (url.pathname.startsWith('/api/')) {
      outgoing.writeHead(503, { 'content-type': 'application/json', 'cache-control': 'no-store' });
      outgoing.end(JSON.stringify({ error: 'Email delivery is unavailable. Please try again later.' }));
      return;
    }
    const request = new Request(url, { method: incoming.method, headers: incoming.headers });
    const response = await worker.fetch(request, { ASSETS: { fetch: async (assetRequest) => {
      const pathname = decodeURIComponent(new URL(assetRequest.url).pathname);
      const file = resolve(root, `.${pathname}`);
      if (!file.startsWith(root + sep)) return new Response('', { status: 403 });
      try { return new Response(await readFile(file), { headers: { 'content-type': types[extname(file)] || 'application/octet-stream' } }); }
      catch { return new Response('', { status: 404 }); }
    } } });
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch { outgoing.writeHead(500); outgoing.end('Local preview failed'); }
}).listen(4174, '127.0.0.1', () => console.log('Production build verifier: http://127.0.0.1:4174'));
