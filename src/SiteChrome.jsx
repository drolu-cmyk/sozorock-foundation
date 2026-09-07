import { useEffect, useRef, useState } from "react";
import { Link } from "./router";
export function Brand() {
  return <Link href="/" className="foundation-wordmark" aria-label="The SozoRock Foundation home"><span>The</span><strong>SozoRock.</strong><span>Foundation</span></Link>;
}
const links = [["Work", "/platforms"], ["Research", "/publications"], ["About", "/about"], ["Contact", "/contact"]];
export function Header({ pathname }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const close = event => { if (event.key === "Escape" && open) { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return <header className={`foundation-header ${pathname === "/" ? "on-cobalt" : ""}`}>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <div className="shell foundation-header-inner"><Brand /><button ref={toggle} className="foundation-menu-toggle" type="button" aria-expanded={open} aria-controls="foundation-navigation" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button><nav id="foundation-navigation" className={`foundation-navigation ${open ? "is-open" : ""}`} aria-label="Primary navigation">{links.map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}</nav></div>
  </header>;
}
export function Footer() {
  return <footer className="foundation-footer"><div className="shell"><div className="foundation-footer-top"><Brand /><nav aria-label="Footer navigation">{links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav></div><div className="foundation-footer-bottom"><p>© {new Date().getFullYear()} The SozoRock Foundation, Inc.</p><nav aria-label="Legal and policy links"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/accessibility">Accessibility</Link><Link href="/standards">Standards</Link><Link href="/support">Support our work</Link></nav></div></div></footer>;
}
