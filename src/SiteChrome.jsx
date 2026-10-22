import { useEffect, useRef, useState } from "react";
import { Link } from "./router";
import { BriefingSection } from "./BriefingForm";

export function Brand() {
  return <Link href="/" className="ns-brand foundation-wordmark" aria-label="The SozoRock Foundation home"><span>The</span><strong>SozoRock.</strong><span>Foundation</span></Link>;
}

const primaryLinks = [["Our Work", "/platforms"], ["Research", "/publications"], ["Events", "/events"], ["About", "/about"]];
const workRoutes = ["/platforms", "/workforce", "/ai-society"];
// Research covers publication records and access pages; About covers leadership and standards.
const isCurrent = (pathname, href) => pathname === href || (href === "/platforms" && (workRoutes.includes(pathname) || pathname.startsWith("/platforms/"))) || (href === "/publications" && pathname.startsWith("/publication")) || (href === "/about" && ["/leadership", "/standards"].includes(pathname));

export function Header({ pathname }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  const navigation = useRef(null);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const linksInMenu = [...(navigation.current?.querySelectorAll("a") || [])];
    requestAnimationFrame(() => linksInMenu[0]?.focus());

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        requestAnimationFrame(() => toggle.current?.focus());
        return;
      }
      if (event.key !== "Tab" || linksInMenu.length === 0) return;
      const first = linksInMenu[0];
      const last = linksInMenu[linksInMenu.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        toggle.current?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        toggle.current?.focus();
      } else if (event.shiftKey && document.activeElement === toggle.current) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === toggle.current) {
        event.preventDefault();
        first.focus();
      }
    };

    const media = window.matchMedia("(min-width: 900px)");
    const onDesktop = (event) => { if (event.matches) setOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    media.addEventListener?.("change", onDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      media.removeEventListener?.("change", onDesktop);
    };
  }, [open]);

  return <header className="ns ns-header">
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <div className="ns-shell ns-header-inner">
      <Brand />
      <button ref={toggle} className="ns-menu-toggle" type="button" aria-expanded={open} aria-controls="foundation-navigation" onClick={() => setOpen((value) => !value)}>{open ? "Close" : "Menu"}</button>
      <nav ref={navigation} id="foundation-navigation" className={`ns-nav ${open ? "is-open" : ""}`} aria-label="Primary navigation" onClick={(event) => { if (event.target.closest("a")) setOpen(false); }}>
        <div className="ns-nav-main">
          {primaryLinks.map(([label, href]) => <Link key={href} href={href} aria-current={isCurrent(pathname, href) ? "page" : undefined}>{label}</Link>)}
        </div>
        <div className="ns-nav-utility">
          <a href="#briefing">Subscribe</a>
          <Link className="ns-btn ns-btn-ice" href="/support" aria-current={pathname === "/support" ? "page" : undefined}>Support</Link>
        </div>
      </nav>
    </div>
  </header>;
}

const footerColumns = [
  ["Our Work", [["Health Access", "/platforms/health"], ["Workforce Capacity", "/workforce"], ["AI & Society", "/ai-society"], ["AI Lab", "/platforms/ai-lab"]]],
  ["Research & Events", [["Research", "/publications"], ["Events", "/events"], ["The Briefing", "#briefing"]]],
  ["About", [["Our story", "/about"], ["Leadership", "/leadership"], ["Partner with us", "/partner"], ["Contact", "/contact"]]],
];

export function Footer() {
  const year = new Date().getFullYear();
  return <footer className="ns ns-site-footer">
    <BriefingSection />
    <div className="ns-footer">
      <div className="ns-shell">
        <div className="ns-footer-top">
          <div>
            <Brand />
            <p className="ns-footer-mission">We build healthier communities and stronger systems through access, capacity and trust.</p>
            <Link className="ns-btn ns-btn-primary" href="/support">Support our work</Link>
          </div>
          {footerColumns.map(([title, links]) => <nav key={title} aria-label={title}>
            <span className="ttl">{title}</span>
            {links.map(([label, href]) => href.startsWith("#") ? <a key={label} href={href}>{label}</a> : <Link key={label} href={href}>{label}</Link>)}
          </nav>)}
        </div>
        <div className="ns-legal">
          <nav aria-label="Legal and policy links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
            <Link href="/accessibility">Accessibility</Link>
            <Link href="/nondiscrimination">Nondiscrimination</Link>
            <Link href="/standards">Standards</Link>
          </nav>
          <p>© {year} The SozoRock Foundation, Inc. · 501(c)(3) public charity · EIN 39-4736725</p>
        </div>
      </div>
    </div>
  </footer>;
}
