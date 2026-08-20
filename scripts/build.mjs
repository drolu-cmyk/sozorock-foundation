import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { routes } from '../site/content.mjs';
import { renderers } from '../site/pages.mjs';

const out = new URL('../dist/', import.meta.url);
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(new URL('../site/styles.css', import.meta.url), new URL('./styles.css', out));
await cp(new URL('../site/script.js', import.meta.url), new URL('./script.js', out));
await cp(new URL('../site/assets/', import.meta.url), new URL('./assets/', out), { recursive: true });

for (const route of routes) {
  const render = renderers.get(route);
  if (!render) throw new Error(`Missing renderer for ${route}`);
  const dir = route === '/' ? out : new URL(`.${route}/`, out);
  await mkdir(dir, { recursive: true });
  await writeFile(new URL('./index.html', dir), render(), 'utf8');
}
console.log(`Built ${routes.length} routes into ${join(out.pathname)}`);
