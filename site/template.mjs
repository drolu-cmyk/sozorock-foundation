import { leadership, publications } from './content.mjs';

const esc = (value) => String(value ?? '').replace(/[&<>\"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[ch]));
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');

const logo = `<a class="brand" href="/" aria-label="The SozoRock Foundation home"><span class="brand-word">sozorock.</span><span class="brand-reg">®</span><span class="brand-unit">FOUNDATION</span></a>`;

const megaMenu = ({label, key, heading, allLabel, allHref, items}) => `
<div class="nav-menu" data-menu data-section="${key}">
  <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="mega-${key}">${label}<span aria-hidden="true">⌄</span></button>
  <div class="mega-panel" id="mega-${key}" hidden>
    <div class="shell mega-grid">
      <div class="mega-intro"><strong>${heading}</strong><a href="${allHref}">${allLabel}</a></div>
      <div class="mega-items">${items.map(([title, text, href]) => `<a class="mega-item" href="${href}"><strong>${title}</strong><span>${text}</span></a>`).join('')}</div>
    </div>
  </div>
</div>`;

export function header(path = '/') {
  return `<header class="site-header" data-header><div class="shell header-inner">${logo}<button class="mobile-toggle" type="button" data-mobile-toggle aria-expanded="false" aria-label="Open navigation"><span></span><span></span></button><nav class="primary-nav" data-primary-nav aria-label="Primary">
  ${megaMenu({label:'Work',key:'work',heading:'What SozoRock operates',allLabel:'View all work',allHref:'/work',items:[['SozoRock Global Institute','Insight, publications, and convening','/work/global-institute'],['SozoRock Health','Access, navigation, and community evidence','/work/health'],['SozoRock AI Lab','Applied learning for modern work','/work/ai-lab']]})}
  ${megaMenu({label:'Ideas',key:'ideas',heading:'Evidence, analysis, and convening',allLabel:'View all ideas',allHref:'/publications',items:[['Publications','Public-interest volumes and permanent records','/publications'],['Insights','Notes, briefings, and field updates','/insights'],['Events','Firesides, roundtables, and briefings','/events']]})}
  ${megaMenu({label:'About',key:'about',heading:'Why SozoRock exists',allLabel:'View all about',allHref:'/about',items:[['Mission','Institutional purpose','/about'],['Leadership','People accountable for the work','/leadership'],['Standards','Independence and integrity','/standards'],['Contact','Reach the Foundation','mailto:contact@sozorockfoundation.org']]})}
  <a class="nav-direct" href="/partner">Partner</a><a class="nav-direct" href="/support">Support</a></nav></div></header>`;
}

export function footer() {
  return `<footer class="site-footer"><div class="shell footer-main"><div class="footer-brand">${logo}</div><div><h2>Work</h2><a href="/work">Platforms</a><a href="/publications">Publications</a></div><div><h2>Ideas</h2><a href="/insights">Insights</a><a href="/events">Events</a></div><div><h2>Foundation</h2><a href="/about">About</a><a href="/leadership">Leadership</a></div><div><h2>Engage</h2><a href="/partner">Partner</a><a href="/support">Support</a><a href="mailto:contact@sozorockfoundation.org">Contact</a></div></div><div class="shell footer-bottom"><div class="legal-copy"><p>© 2026 The SozoRock Foundation, Inc. All rights reserved.</p><p>The SozoRock Foundation, Inc. is a U.S. nonprofit, tax-exempt charitable organization under Section 501(c)(3) of the Internal Revenue Code. EIN: 39-4736725. Contributions are tax-deductible to the extent permitted by law.</p><p>SozoRock® is a registered trademark of SozoRock Tech Inc., used under license by The SozoRock Foundation.</p></div><div class="footer-meta"><div><a href="/standards">Standards</a><a href="/standards#accessibility">Accessibility</a><a href="/standards#privacy">Privacy</a><a href="/standards#nondiscrimination">Nondiscrimination</a></div><div><a href="https://x.com/srockfoundation" rel="me">X</a><a href="https://www.youtube.com/@srockfoundation">YouTube</a></div></div></div></footer>`;
}

export function page({title, description, body, path = '/', structuredData = null, image = '/assets/social-card.svg', type = 'website', citation = []}) {
  const canonical = `https://www.sozorockfoundation.org${path === '/' ? '/' : path}`;
  const fullTitle = path === '/' ? 'The SozoRock Foundation | Access. Assurance. Intelligence.' : `${title} | The SozoRock Foundation`;
  const imageUrl = `https://www.sozorockfoundation.org${image}`;
  const org = { '@context':'https://schema.org', '@type':'NonprofitOrganization', '@id':'https://www.sozorockfoundation.org/#organization', name:'The SozoRock Foundation, Inc.', alternateName:'The SozoRock Foundation', url:'https://www.sozorockfoundation.org/', email:'contact@sozorockfoundation.org', taxID:'39-4736725', address:{'@type':'PostalAddress',streetAddress:'69 State Street, Suite 1300',addressLocality:'Albany',addressRegion:'NY',postalCode:'12207',addressCountry:'US'}, sameAs:['https://x.com/srockfoundation','https://www.youtube.com/@srockfoundation'] };
  const webpage = { '@context':'https://schema.org', '@type':'WebPage', '@id':`${canonical}#webpage`, url:canonical, name:fullTitle, description, isPartOf:{'@id':'https://www.sozorockfoundation.org/#website'}, about:{'@id':'https://www.sozorockfoundation.org/#organization'} };
  const website = { '@context':'https://schema.org', '@type':'WebSite', '@id':'https://www.sozorockfoundation.org/#website', url:'https://www.sozorockfoundation.org/', name:'The SozoRock Foundation', publisher:{'@id':'https://www.sozorockfoundation.org/#organization'} };
  const schemas = [org, website, webpage, ...(structuredData ? (Array.isArray(structuredData) ? structuredData : [structuredData]) : [])];
  const citationMeta = citation.map(([name,value]) => `<meta name="${esc(name)}" content="${esc(value)}">`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(fullTitle)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><link rel="canonical" href="${canonical}"><link rel="icon" type="image/svg+xml" href="/assets/favicon.svg"><link rel="manifest" href="/site.webmanifest"><meta name="theme-color" content="#061f3d"><meta property="og:type" content="${esc(type)}"><meta property="og:site_name" content="The SozoRock Foundation"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${imageUrl}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:site" content="@srockfoundation"><meta name="twitter:title" content="${esc(fullTitle)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${imageUrl}">${citationMeta}<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wdth,wght@75..100,400..800&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/polish.css">${schemas.map(s => `<script type="application/ld+json">${json(s)}</script>`).join('')}</head><body data-path="${path}"><a class="skip-link" href="#main">Skip to content</a>${header(path)}<main id="main">${body}</main>${footer()}<script src="/script.js" defer></script></body></html>`;
}

export const innerHero = (kicker, title, intro='') => `<section class="inner-hero reveal-section"><div class="shell"><p class="kicker">${kicker}</p><h1>${title}</h1>${intro ? `<p class="inner-lede">${intro}</p>` : ''}</div></section>`;
export const row = (title, text, href, cta='Explore') => `<a class="editorial-row" href="${href}"><strong>${title}</strong><span>${text}</span><b>${cta}</b></a>`;
export const publicationRows = () => publications.map(p => row(p.title, p.subtitle, p.href, 'Read')).join('');

const cover = p => p.cover ? `<img src="${p.cover}" alt="${esc(p.title)} cover" loading="lazy">` : `<div class="cover-repro ${p.coverClass}" aria-hidden="true"><span>${p.label}</span><strong>${p.title}</strong><small>Volume 1</small></div>`;
export const publicationCards = () => publications.map(p => `<article class="publication-card"><a class="publication-cover" href="${p.href}">${cover(p)}</a><p class="kicker">${p.label}</p><h2><a href="${p.href}">${p.title}</a></h2><p class="publication-subtitle">${p.subtitle}</p><p class="publication-meta">${p.meta}</p><a class="line-link" href="${p.href}">Open publication record</a></article>`).join('');

export const leadershipCards = () => leadership.map(person => `<article class="person"><div class="person-portrait" aria-hidden="true"><span>${person.initials}</span></div><div><h2>${person.name}${person.credentials ? `, ${person.credentials}` : ''}</h2><p class="person-title">${person.title}</p><p>${person.bio}</p></div></article>`).join('');
