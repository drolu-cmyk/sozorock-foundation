import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { routes } from '../site/content.mjs';
import { renderers } from '../site/pages.mjs';

const out = new URL('../dist/', import.meta.url);
const origin = 'https://www.sozorockfoundation.org';
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(new URL('../site/styles.css', import.meta.url), new URL('./styles.css', out));
await cp(new URL('../site/polish.css', import.meta.url), new URL('./polish.css', out));
await cp(new URL('../site/script.js', import.meta.url), new URL('./script.js', out));
await cp(new URL('../site/assets/', import.meta.url), new URL('./assets/', out), { recursive: true });

for (const route of routes) {
  const render = renderers.get(route);
  if (!render) throw new Error(`Missing renderer for ${route}`);
  const dir = route === '/' ? out : new URL(`.${route}/`, out);
  await mkdir(dir, { recursive: true });
  await writeFile(new URL('./index.html', dir), render(), 'utf8');
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => `  <url><loc>${origin}${route === '/' ? '/' : route}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(new URL('./sitemap.xml', out), sitemap, 'utf8');
await writeFile(new URL('./robots.txt', out), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`, 'utf8');
await writeFile(new URL('./site.webmanifest', out), JSON.stringify({name:'The SozoRock Foundation',short_name:'SozoRock Foundation',start_url:'/',display:'standalone',background_color:'#ffffff',theme_color:'#061f3d',icons:[{src:'/assets/favicon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'}]}, null, 2), 'utf8');

console.log(`Built ${routes.length} routes plus sitemap, robots, and manifest into ${join(out.pathname)}`);
