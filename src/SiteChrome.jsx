import { useEffect, useRef, useState } from "react";
import { navigation } from "./siteData";
import { Link } from "./router";

function Brand() {
  return (
    <Link href="/" className="brand" aria-label="The SozoRock Foundation home">
      <img src="/media/sozorock-logo.png" alt="SozoRock" />
      <span>Foundation</span>
    </Link>
  );
}

export function Header({ pathname }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  const currentRoot = pathname.split("/")[1];

  return (
    <header className="site-header" ref={headerRef} onMouseLeave={() => setOpenMenu(null)}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="header-bar shell">
        <Brand />
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="primary-navigation"
          onClick={() => setMobileOpen((value) => !value)}
        >
          <span>{mobileOpen ? "Close" : "Menu"}</span>
        </button>
        <nav id="primary-navigation" className={`primary-nav ${mobileOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          <div className="nav-groups">
            {navigation.map((group) => {
              const active = group.roots?.includes(currentRoot) ?? currentRoot === group.href.split("/")[1];
              const expanded = openMenu === group.label;
              return (
                <div className={`nav-group ${active ? "is-current" : ""}`} key={group.label}>
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={expanded}
                    aria-controls={`menu-${group.label.toLowerCase()}`}
                    onClick={() => setOpenMenu(expanded ? null : group.label)}
                  >
                    {group.label}
                  </button>
                  <div id={`menu-${group.label.toLowerCase()}`} className={`mega-menu ${expanded ? "is-open" : ""}`}>
                    <div className="mega-inner shell">
                      <div className="mega-heading">
                        <p>{group.summary}</p>
                        <Link href={group.href} className="text-link" onClick={() => setOpenMenu(null)}>View all {group.label.toLowerCase()}</Link>
                      </div>
                      <div className="mega-links">
                        {group.items.map((item) => (
                          <Link href={item.href} key={item.label} className="mega-link" onClick={() => setOpenMenu(null)}>
                            <strong>{item.label}</strong>
                            <span>{item.meta}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="header-actions">
            <Link href="/partner" className="partner-link">Partner</Link>
            <Link href="/support" className="support-link">Support</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <Brand />
        <nav className="footer-directory" aria-label="Footer navigation">
          <div><strong>Work</strong><Link href="/platforms">Platforms</Link><Link href="/publications">Publications</Link></div>
          <div><strong>Ideas</strong><Link href="/insights">Insights</Link><Link href="/events">Events</Link></div>
          <div><strong>Foundation</strong><Link href="/about">About</Link><Link href="/leadership">Leadership</Link></div>
        </nav>
        <nav className="footer-engage" aria-label="Engagement links">
          <strong>Engage</strong>
          <Link href="/partner">Partner</Link>
          <Link href="/support">Support</Link>
          <Link href="mailto:contact@sozorockfoundation.org">Contact</Link>
        </nav>
      </div>
      <div className="shell footer-legal">
        <div className="footer-disclosures">
          <p>© 2026 The SozoRock Foundation, Inc. All rights reserved.</p>
          <p>The SozoRock Foundation, Inc. is a U.S. nonprofit, tax-exempt charitable organization under Section 501(c)(3) of the Internal Revenue Code. EIN: 39-4736725. Contributions are tax-deductible to the extent permitted by law.</p>
          <p>SozoRock® is a registered trademark of SozoRock Tech Inc., used under license by The SozoRock Foundation.</p>
        </div>
        <div className="footer-meta">
          <nav aria-label="Legal and policy links">
            <Link href="/standards">Standards</Link>
            <Link href="/standards#accessibility">Accessibility</Link>
            <Link href="/standards#privacy">Privacy</Link>
            <Link href="/standards#nondiscrimination">Nondiscrimination</Link>
          </nav>
          <nav aria-label="Social links">
            <a href="https://x.com/sozorockfoundation">X</a>
            <a href="https://www.youtube.com/@srockfoundation">YouTube</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
