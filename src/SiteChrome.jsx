import { useEffect, useRef, useState } from "react";
import { Link } from "./router";

export function Brand() {
  return <Link href="/" className="foundation-wordmark" aria-label="The SozoRock Foundation home"><span>The</span><strong>SozoRock.</strong><span>Foundation</span></Link>;
}

const primaryLinks = [["What we do", "/platforms"], ["Who we are", "/about"]];

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

  return <header className={`foundation-header ${pathname === "/" ? "on-cobalt" : ""}`}>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <div className="shell foundation-header-inner">
      <Brand />
      <button ref={toggle} className="foundation-menu-toggle" type="button" aria-expanded={open} aria-controls="foundation-navigation" onClick={() => setOpen((value) => !value)}>{open ? "Close" : "Menu"}</button>
      <nav ref={navigation} id="foundation-navigation" className={`foundation-navigation ${open ? "is-open" : ""}`} aria-label="Primary navigation" onClick={(event) => { if (event.target.closest("a")) setOpen(false); }}>
        {primaryLinks.map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
        <Link className="foundation-support-link" href="/support" aria-current={pathname === "/support" ? "page" : undefined}>Support</Link>
      </nav>
    </div>
  </header>;
}

export function Footer() {
  const year = new Date().getFullYear();
  return <footer className="foundation-footer">
    <div className="shell">
      <div className="foundation-footer-top">
        <Brand />
        <p className="foundation-footer-purpose">We build platforms for better health and public systems.</p>
        <div className="foundation-footer-groups">
          <nav aria-label="Explore">
            <strong>Explore</strong>
            <Link href="/platforms">Platforms</Link>
            <Link href="/publications">Publications</Link>
            <Link href="/insights">Research</Link>
            <Link href="/events">Events</Link>
            <Link href="/ai-society">AI and Society</Link>
          </nav>
          <nav aria-label="Foundation">
            <strong>Foundation</strong>
            <Link href="/about">Who we are</Link>
            <Link href="/leadership">Leadership</Link>
            <Link href="/standards">Standards</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/partner">Partner</Link>
            <Link href="/support">Support</Link>
          </nav>
        </div>
      </div>
      <div className="foundation-footer-bottom">
        <p>The SozoRock Foundation, Inc. is recognized as tax-exempt under Section 501(c)(3) of the Internal Revenue Code. EIN 39-4736725. Contributions are tax-deductible as allowed by law.</p>
        <nav aria-label="Legal and policy links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/accessibility">Accessibility</Link>
          <Link href="/nondiscrimination">Nondiscrimination</Link>
        </nav>
        <p>© {year} The SozoRock Foundation, Inc.</p>
      </div>
    </div>
  </footer>;
}
