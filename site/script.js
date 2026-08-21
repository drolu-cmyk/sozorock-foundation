(() => {
  const header = document.querySelector('[data-header]');
  const mobileToggle = document.querySelector('[data-mobile-toggle]');
  const primaryNav = document.querySelector('[data-primary-nav]');
  const menus = [...document.querySelectorAll('[data-menu]')];
  const path = document.body.dataset.path || '/';

  const closeMenus = (except = null) => menus.forEach(menu => {
    if (menu === except) return;
    const trigger = menu.querySelector('.nav-trigger');
    const panel = menu.querySelector('.mega-panel');
    trigger?.setAttribute('aria-expanded', 'false');
    if (panel) panel.hidden = true;
  });

  const currentSection = path.startsWith('/work') ? 'work' : (['/publications','/insights','/events'].some(p => path.startsWith(p)) || path.startsWith('/publication/')) ? 'ideas' : (['/about','/leadership','/standards'].some(p => path.startsWith(p))) ? 'about' : null;
  menus.forEach(menu => {
    const trigger = menu.querySelector('.nav-trigger');
    const panel = menu.querySelector('.mega-panel');
    if (menu.dataset.section === currentSection) trigger?.classList.add('is-current');
    if (!trigger || !panel) return;
    const toggle = () => {
      const open = trigger.getAttribute('aria-expanded') === 'true';
      closeMenus(menu);
      trigger.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    };
    trigger.addEventListener('click', toggle);
    trigger.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
      if (event.key === 'ArrowDown' && panel.hidden) { event.preventDefault(); toggle(); panel.querySelector('a')?.focus(); }
    });
  });

  document.querySelectorAll('.nav-direct').forEach(link => {
    if (link.getAttribute('href') === path) link.classList.add('is-current');
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenus();
      primaryNav?.classList.remove('is-open');
      mobileToggle?.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('click', event => { if (header && !header.contains(event.target)) closeMenus(); });
  mobileToggle?.addEventListener('click', () => {
    const next = !primaryNav?.classList.contains('is-open');
    primaryNav?.classList.toggle('is-open', next);
    mobileToggle.setAttribute('aria-expanded', String(next));
  });

  const slides = [...document.querySelectorAll('[data-focus-slide]')];
  const tabs = [...document.querySelectorAll('[data-focus-tab]')];
  const focusToggle = document.querySelector('[data-focus-toggle]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let paused = reduceMotion;
  let timer = null;

  const render = (index, moveFocus = false) => {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.hidden = i !== current;
      slide.classList.toggle('is-active', i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
    });
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === current));
      tab.tabIndex = i === current ? 0 : -1;
    });
    if (moveFocus) tabs[current]?.focus();
  };
  const stop = () => { if (timer) window.clearInterval(timer); timer = null; };
  const start = () => { stop(); if (paused || reduceMotion || !slides.length) return; timer = window.setInterval(() => render(current + 1), 6500); };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => { render(i); start(); });
    tab.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') { event.preventDefault(); render(current + 1, true); start(); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); render(current - 1, true); start(); }
      if (event.key === 'Home') { event.preventDefault(); render(0, true); start(); }
      if (event.key === 'End') { event.preventDefault(); render(slides.length - 1, true); start(); }
    });
  });
  if (focusToggle) {
    focusToggle.textContent = paused ? 'Play features' : 'Pause features';
    focusToggle.addEventListener('click', () => { paused = !paused; focusToggle.textContent = paused ? 'Play features' : 'Pause features'; start(); });
  }
  render(0);
  start();

  const reveals = [...document.querySelectorAll('.reveal-section')];
  if (reduceMotion || !('IntersectionObserver' in window)) reveals.forEach(el => el.classList.add('is-visible'));
  else {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  }
})();
