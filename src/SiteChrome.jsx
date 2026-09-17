import { useEffect, useRef, useState } from "react";
import { Link } from "./router";

export function Brand() {
  return <Link href="/" className="foundation-wordmark" aria-label="The SozoRock Foundation home"><span>The</span><strong>SozoRock.</strong><span>Foundation</span></Link>;
}

const links = [["What we do", "/platforms"], ["Research", "/publications"], ["About", "/about"], ["Contact", "/contact"]];

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
        {links.map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
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
        <nav aria-label="Footer navigation">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          <Link href="/partner">Partner</Link>
          <Link href="/support">Support</Link>
        </nav>
      </div>
      <div className="foundation-footer-status">
        <p>The SozoRock Foundation, Inc. is a 501(c)(3) public charity. EIN 39-4736725.</p>
      </div>
      <div className="foundation-footer-bottom">
        <p>© {year} The SozoRock Foundation, Inc.</p>
        <nav aria-label="Legal and policy links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/accessibility">Accessibility</Link>
          <Link href="/nondiscrimination">Nondiscrimination</Link>
          <Link href="/standards">Standards</Link>
        </nav>
      </div>
    </div>
  </footer>;
}
