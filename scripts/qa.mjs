import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { routes } from '../site/content.mjs';

const root = resolve(new URL('../dist/', import.meta.url).pathname);
const failures = [];
const hrefPattern = /href="([^"]+)"/g;
const idPattern = /\sid="([^"]+)"/g;
const imgPattern = /<img\s+[^>]*src="([^"]+)"[^>]*>/g;

const htmlFor = async route => readFile(resolve(root, route === '/' ? 'index.html' : `.${route}/index.html`), 'utf8');

for (const route of routes) {
  const html = await htmlFor(route);
  const h1s = [...html.matchAll(/<h1\b/g)].length;
  if (h1s !== 1) failures.push(`${route}: expected exactly one h1, found ${h1s}`);

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
    if (['/styles.css','/script.js'].includes(pathname) || pathname.startsWith('/assets/')) continue;
    if (!routes.includes(pathname)) failures.push(`${route}: unresolved internal href ${href}`);
  }
}

const home = await htmlFor('/');
for (const needle of ['Access.</span><span>Assurance.</span><span>Intelligence.', 'Pause features', 'What SozoRock operates.', 'Choose where to begin.', 'Credibility is part of the work.']) {
  if (!home.includes(needle)) failures.push(`/: missing approved home anchor ${needle}`);
}
for (const pub of ['/publication/hsa-v1-2026','/publication/rrg-v1-2025','/publication/rebs-v1-2025']) {
  if (!routes.includes(pub)) failures.push(`route manifest missing ${pub}`);
}
const css = await readFile(resolve(root, 'styles.css'), 'utf8');
if (/linear-gradient|radial-gradient/.test(css)) failures.push('styles.css: gradients are prohibited by approved QA');
for (const token of ['#f3f1ed','"Instrument Sans"','"Source Sans 3"','height:536px','height:276px']) {
  if (!css.includes(token)) failures.push(`styles.css: missing approved token ${token}`);
}
const js = await readFile(resolve(root, 'script.js'), 'utf8');
for (const behavior of ['ArrowRight','ArrowLeft','Escape','Pause features','Play features']) {
  if (!js.includes(behavior)) failures.push(`script.js: missing interaction behavior ${behavior}`);
}
if (failures.length) {
  console.error(failures.map(x => `FAIL ${x}`).join('\n'));
  process.exit(1);
}
console.log(`PASS ${routes.length} routes; static recovery contract satisfied.`);
