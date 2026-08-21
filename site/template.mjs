import { leadership, publications } from './content.mjs';

const esc = (value) => String(value).replace(/[&<>\"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[ch]));

const logo = `<a class="brand" href="/" aria-label="The SozoRock Foundation home"><span class="brand-word">sozorock.</span><span class="brand-reg">®</span><span class="brand-unit">FOUNDATION</span></a>`;

const menu = (label, items) => `<div class="nav-menu" data-menu><button class="nav-trigger" type="button" aria-expanded="false">${label}<span aria-hidden="true">⌄</span></button><div class="nav-popover" hidden>${items.map(([text, href]) => `<a href="${href}">${text}</a>`).join('')}</div></div>`;

export function header() {
  return `<header class="site-header" data-header><div class="shell header-inner">${logo}<button class="mobile-toggle" type="button" data-mobile-toggle aria-expanded="false" aria-label="Open navigation"><span></span><span></span></button><nav class="primary-nav" data-primary-nav aria-label="Primary">${menu('Work', [['Platforms','/work'],['Global Institute','/work/global-institute'],['SozoRock Health','/work/health'],['SozoRock AI Lab','/work/ai-lab']])}${menu('Ideas', [['Publications','/publications'],['Insights','/insights'],['Events','/events']])}${menu('About', [['About','/about'],['Leadership','/leadership'],['Standards','/standards']])}<a href="/partner">Partner</a><a href="/support">Support</a></nav></div></header>`;
}

export function footer() {
  return `<footer class="site-footer"><div class="shell footer-main"><div class="footer-brand">${logo}</div><div><h2>Work</h2><a href="/work">Platforms</a><a href="/publications">Publications</a></div><div><h2>Ideas</h2><a href="/insights">Insights</a><a href="/events">Events</a></div><div><h2>Foundation</h2><a href="/about">About</a><a href="/leadership">Leadership</a></div><div><h2>Engage</h2><a href="/partner">Partner</a><a href="/support">Support</a><a href="mailto:contact@sozorockfoundation.org">Contact</a></div></div><div class="shell footer-bottom"><div class="legal-copy"><p>© 2026 The SozoRock Foundation, Inc. All rights reserved.</p><p>The SozoRock Foundation, Inc. is a U.S. nonprofit, tax-exempt charitable organization under Section 501(c)(3) of the Internal Revenue Code. EIN: 39-4736725. Contributions are tax-deductible to the extent permitted by law.</p><p>SozoRock® is a registered trademark of SozoRock Tech Inc., used under license by The SozoRock Foundation.</p></div><div class="footer-meta"><div><a href="/standards">Standards</a><a href="/standards#accessibility">Accessibility</a><a href="/standards#privacy">Privacy</a><a href="/standards#nondiscrimination">Nondiscrimination</a></div><div><a href="https://x.com/srockfoundation">X</a><a href="https://www.youtube.com/results?search_query=SozoRock+Foundation">YouTube</a></div></div></div></footer>`;
}

export function page({title, description, body, path = '/'}) {
  const canonical = `https://www.sozorockfoundation.org${path === '/' ? '/' : path}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | The SozoRock Foundation</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}"><link rel="icon" type="image/svg+xml" href="/assets/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wdth,wght@75..100,400..800&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/polish.css"></head><body data-path="${path}"><a class="skip-link" href="#main">Skip to content</a>${header()}<main id="main">${body}</main>${footer()}<script src="/script.js" defer></script></body></html>`;
}

export const innerHero = (kicker, title, intro='') => `<section class="inner-hero"><div class="shell"><p class="kicker">${kicker}</p><h1>${title}</h1>${intro ? `<p class="inner-lede">${intro}</p>` : ''}</div></section>`;

export const row = (title, text, href, cta='Explore') => `<a class="editorial-row" href="${href}"><strong>${title}</strong><span>${text}</span><b>${cta}</b></a>`;

export const publicationRows = () => publications.map(p => row(p.title, p.subtitle, p.href, 'Read')).join('');

export const leadershipCards = () => leadership.map(person => `<article class="person"><img src="${person.image}" alt="Portrait of ${person.name}" loading="lazy"><div><h2>${person.name}</h2><p class="person-title">${person.title}</p><p>${person.bio}</p></div></article>`).join('');
