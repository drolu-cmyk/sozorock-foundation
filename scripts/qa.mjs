import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { routes } from '../site/content.mjs';

const root = resolve(new URL('../dist/', import.meta.url).pathname);
const failures = [];
const hrefPattern = /href="([^"]+)"/g;
const idPattern = /\sid="([^"]+)"/g;
const imgPattern = /<img\s+[^>]*src="([^"]+)"[^>]*>/g;
const staticPaths = new Set(['/styles.css','/polish.css','/script.js','/site.webmanifest','/sitemap.xml','/robots.txt']);
const htmlFor = async route => readFile(resolve(root, route === '/' ? 'index.html' : `.${route}/index.html`), 'utf8');

for (const route of routes) {
  const html = await htmlFor(route);
  const h1s = [...html.matchAll(/<h1\b/g)].length;
  if (h1s !== 1) failures.push(`${route}: expected exactly one h1, found ${h1s}`);
  for (const required of ['<meta name="description"','<meta name="robots"','<link rel="canonical"','property="og:title"','name="twitter:card"','application/ld+json','/assets/favicon.svg','/site.webmanifest']) {
    if (!html.includes(required)) failures.push(`${route}: missing metadata contract ${required}`);
  }
  const ids = [...html.matchAll(idPattern)].map(m => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) failures.push(`${route}: duplicate ids ${[...new Set(dupes)].join(', ')}`);
  for (const [, src] of html.matchAll(imgPattern)) {
    if (src.startsWith('/')) {
      try { await access(resolve(root, `.${src}`)); } catch { failures.push(`${route}: missing local image ${src}`); }
    }
  }
  for (const [, href] of html.matchAll(hrefPattern)) {
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const [pathname] = href.split('#');
    if (!pathname) continue;
    if (staticPaths.has(pathname) || pathname.startsWith('/assets/')) continue;
    if (!routes.includes(pathname)) failures.push(`${route}: unresolved internal href ${href}`);
  }
}

const home = await htmlFor('/');
for (const needle of ['Access.</span><span>Assurance.</span><span>Intelligence.', 'Pause features', 'What SozoRock operates.', 'Choose where to begin.', 'Credibility is part of the work.', 'mega-work', 'focus-panel-0']) {
  if (!home.includes(needle)) failures.push(`/: missing approved home anchor ${needle}`);
}
const leadership = await htmlFor('/leadership');
if (leadership.includes('m1.png') || leadership.includes('m2.png') || leadership.includes('m3.png') || leadership.includes('m4.png')) failures.push('/leadership: legacy broken portrait references remain');
for (const name of ['Dr. Oluwabiyi Adeyemo, MBA','Nike Oye, MBA','Anthony Abraham, MSC','Jordan Hare, BSN, RN']) if (!leadership.includes(name)) failures.push(`/leadership: missing ${name}`);

for (const pub of ['/publication/hsa-v1-2026','/publication/rrg-v1-2025','/publication/rebs-v1-2025']) {
  if (!routes.includes(pub)) failures.push(`route manifest missing ${pub}`);
  const html = await htmlFor(pub);
  for (const tag of ['citation_title','citation_author','citation_publication_date','citation_publisher']) if (!html.includes(tag)) failures.push(`${pub}: missing ${tag}`);
}
const hsa = await htmlFor('/publication/hsa-v1-2026');
if (/citation_doi/i.test(hsa)) failures.push('/publication/hsa-v1-2026: DOI must not be emitted until supplied');
const rrg = await htmlFor('/publication/rrg-v1-2025');
if (!rrg.includes('10.65473/rrg-v1-2025') || !rrg.includes('9798993647715')) failures.push('/publication/rrg-v1-2025: incomplete permanent metadata');
const rebs = await htmlFor('/publication/rebs-v1-2025');
if (!rebs.includes('10.65473/rebs-v1-2025') || !rebs.includes('9798993647708')) failures.push('/publication/rebs-v1-2025: incomplete permanent metadata');

const css = await readFile(resolve(root, 'styles.css'), 'utf8');
const polish = await readFile(resolve(root, 'polish.css'), 'utf8');
if (/linear-gradient|radial-gradient/.test(css + polish)) failures.push('CSS: gradients are prohibited by approved QA');
for (const token of ['#f3f1ed','"Instrument Sans"','"Source Sans 3"','height:536px','height:276px']) if (!css.includes(token)) failures.push(`styles.css: missing approved token ${token}`);
for (const token of ['.mega-panel','.publication-grid','.person-portrait','.reveal-section','.focus-slide[hidden]']) if (!polish.includes(token)) failures.push(`polish.css: missing final polish token ${token}`);
const js = await readFile(resolve(root, 'script.js'), 'utf8');
for (const behavior of ['ArrowRight','ArrowLeft','ArrowDown','Escape','Pause features','Play features','IntersectionObserver']) if (!js.includes(behavior)) failures.push(`script.js: missing interaction behavior ${behavior}`);

for (const file of ['sitemap.xml','robots.txt','site.webmanifest','assets/favicon.svg','assets/social-card.svg']) {
  try { await access(resolve(root, file)); } catch { failures.push(`missing generated/static file ${file}`); }
}
const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
for (const route of routes) if (!sitemap.includes(`https://www.sozorockfoundation.org${route === '/' ? '/' : route}`)) failures.push(`sitemap missing ${route}`);
const robots = await readFile(resolve(root, 'robots.txt'), 'utf8');
if (!robots.includes('Sitemap: https://www.sozorockfoundation.org/sitemap.xml')) failures.push('robots.txt missing sitemap declaration');

if (failures.length) {
  console.error(failures.map(x => `FAIL ${x}`).join('\n'));
  process.exit(1);
}
console.log(`PASS ${routes.length} routes; design, metadata, indexing, publication, and interaction contracts satisfied.`);
