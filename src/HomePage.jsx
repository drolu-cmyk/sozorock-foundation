import { useEffect, useState } from "react";
import { campaigns, platforms } from "./siteData";
import { Link } from "./router";
import { SectionHeading } from "./components";

function CampaignSpotlight() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduceMotion) return undefined;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % campaigns.length), 8000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const campaign = campaigns[active];
  const moveTab = (event, index) => {
    const keys = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: campaigns.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = (keys[event.key] + campaigns.length) % campaigns.length;
    setActive(next);
    document.getElementById(`campaign-tab-${campaigns[next].key}`)?.focus();
  };

  return (
    <section className="campaign-section" aria-labelledby="campaign-title">
      <div className="shell campaign-shell">
        <div className="campaign-topline">
          <p className="eyebrow">In focus</p>
          <button type="button" className="pause-button" onClick={() => setPaused((value) => !value)}>{paused ? "Play features" : "Pause features"}</button>
        </div>
        <article
          className={`campaign campaign-${campaign.kind}`}
          id="campaign-panel"
          role="tabpanel"
          aria-labelledby={`campaign-tab-${campaign.key}`}
          key={campaign.key}
        >
          <div className="campaign-copy">
            <p className="campaign-label">{campaign.label}</p>
            <h2 id="campaign-title">{campaign.title}</h2>
            <p className="campaign-lede">{campaign.copy}</p>
            <p className="campaign-detail">{campaign.detail}</p>
            <Link href={campaign.href} className="button button-light">{campaign.action}</Link>
          </div>
          {campaign.image ? (
            <div className="campaign-media">
              <img src={campaign.image} alt={campaign.alt} />
            </div>
          ) : (
            <div className="campaign-signal" aria-hidden="true">
              {campaign.signal.split(" ").map((word) => <span key={word}>{word}</span>)}
            </div>
          )}
        </article>
        <div className="campaign-tabs" role="tablist" aria-label="Featured initiatives">
          {campaigns.map((item, index) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              id={`campaign-tab-${item.key}`}
              aria-controls="campaign-panel"
              aria-selected={active === index}
              tabIndex={active === index ? 0 : -1}
              className={active === index ? "is-active" : ""}
              onClick={() => setActive(index)}
              onKeyDown={(event) => moveTab(event, index)}
            >
              <span>{item.label}</span>
              <strong>{item.title}</strong>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlatformOverview() {
  return (
    <section className="platform-index-section" aria-labelledby="platforms-title">
      <div className="shell">
        <SectionHeading
          eyebrow="Platforms"
          title="What SozoRock operates."
          action={<Link href="/platforms" className="text-link">View the work</Link>}
        />
        <div className="platform-index">
          {platforms.map((platform) => (
            <Link href={platform.href} className="platform-index-row" key={platform.slug}>
              <strong>{platform.name}</strong>
              <span>{platform.line}</span>
              <em>Explore</em>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ActionRoutes() {
  const routes = [
    { title: "Read", copy: "Publications and insights", href: "/publications" },
    { title: "Attend", copy: "Firesides and roundtables", href: "/events" },
    { title: "Partner", copy: "Hubs, pilots, and briefings", href: "/partner" },
    { title: "Support", copy: "Open work and applied learning", href: "/support" },
  ];
  return (
    <section className="action-section" aria-labelledby="actions-title">
      <div className="shell">
        <SectionHeading eyebrow="Engage" title="Choose where to begin." />
        <div className="action-grid">
          {routes.map((route) => (
            <Link href={route.href} key={route.title} className="action-link">
              <strong>{route.title}</strong>
              <span>{route.copy}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="shell home-hero-inner">
          <div>
            <p className="eyebrow">The SozoRock Foundation</p>
            <h1 aria-label="Access. Assurance. Intelligence.">Access.<br />Assurance.<br />Intelligence.</h1>
          </div>
          <div className="home-hero-aside">
            <p className="home-hero-lede">We build platforms for better health and public systems.</p>
            <div className="button-row">
              <Link href="/platforms" className="button button-light">Explore the work</Link>
              <Link href="/partner" className="button button-outline-light">Partner with us</Link>
            </div>
          </div>
        </div>
      </section>
      <CampaignSpotlight />
      <PlatformOverview />
      <ActionRoutes />
    </>
  );
}
