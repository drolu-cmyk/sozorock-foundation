import { Link } from "../router";

export const HEALTH = "https://health.sozorockfoundation.org/";
export const AI_LAB = "https://ai-lab.sozorockfoundation.org/";
export const EVIDENCE = "https://health.sozorockfoundation.org/evidence";

export const isExternal = (href) => /^https?:/u.test(href || "");

export function Go({ href, className = "", children, ...props }) {
  if (!href) return <span className={className} {...props}>{children}</span>;
  if (isExternal(href)) return <a href={href} className={className} rel="noopener" {...props}>{children}</a>;
  if (href.startsWith("#")) return <a href={href} className={className} {...props}>{children}</a>;
  return <Link href={href} className={className} {...props}>{children}</Link>;
}

export function Btn({ href, tone = "primary", children }) {
  return <Go href={href} className={`ns-btn ns-btn-${tone}`}>{children}{isExternal(href) ? <span aria-hidden="true">↗</span> : null}</Go>;
}

export function More({ href, children }) {
  return <Go href={href} className="ns-more">{children}<span aria-hidden="true">&nbsp;{isExternal(href) ? "↗" : "→"}</span></Go>;
}

export function Hero({ id, crumb, title, lede, actions, panel, panelTone = "navy", panelLabel, decorative = true }) {
  return <div className="ns-shell">
    <section className="ns-hero" aria-labelledby={id}>
      <div>
        {crumb && <Go className="ns-crumb" href={crumb[1]}>{crumb[0]}</Go>}
        <h1 className="ns-h1" id={id}>{title}</h1>
        {lede && <p className="ns-lede">{lede}</p>}
        {actions && <div className="ns-actions">{actions}</div>}
      </div>
      <div className={`ns-panel p-${panelTone} ${panelTone === "navy" || panelTone === "cobalt" || panelTone === "royal" ? "is-dark" : ""}`} role={panelLabel ? "img" : undefined} aria-label={panelLabel} aria-hidden={panelLabel || !decorative ? undefined : true}>{panel}</div>
    </section>
  </div>;
}

export function Sec({ tone = "white", id, labelledBy, className = "", children }) {
  const dark = ["navy", "royal", "cobalt"].includes(tone);
  return <section id={id} className={`ns-sec t-${tone} ${dark ? "is-dark" : ""} ${className}`} aria-labelledby={labelledBy}>
    <div className="ns-shell">{children}</div>
  </section>;
}

export function Head({ id, eyebrow, title, link, size = "", as = "h2" }) {
  const Tag = as;
  return <div className="ns-head">
    <div>{eyebrow && <p className="ns-eyebrow">{eyebrow}</p>}<Tag className={`ns-stmt ${size}`} id={id}>{title}</Tag></div>
    {link && <More href={link[1]}>{link[0]}</More>}
  </div>;
}

export function Tile({ href, label, title, sub, tone = "", className = "", children }) {
  const arrow = href ? (isExternal(href) ? "↗" : href.startsWith("#") ? "↓" : "→") : null;
  return <Go href={href} className={`ns-tile ${tone ? `on-${tone}` : ""} ${className}`}>
    {label && <span className="lab">{label}</span>}
    {children}
    <span className="foot"><span><span className="ttl">{title}</span>{sub && <span className="sub">{sub}</span>}</span>{arrow && <span className="ns-go" aria-hidden="true">{arrow}</span>}</span>
  </Go>;
}

export function Fig({ value, size = "n96", line, source, viz, label, tone = "" }) {
  return <figure className="ns-fig" role={label ? "img" : undefined} aria-label={label}>
    <div className={`ns-num ${size} ${tone}`} aria-hidden={label ? true : undefined}>{value}</div>
    {viz && <div className="viz" aria-hidden="true">{viz}</div>}
    {line && <p className="line">{line}</p>}
    {source && <figcaption className="ns-src">{source}</figcaption>}
  </figure>;
}

export const Meter = ({ pct, soft = false, clear = false }) => <div className={`ns-meter ${soft ? "soft" : ""} ${clear ? "clear" : ""}`}><i style={{ width: `${pct}%` }} /></div>;
export const Segs = ({ on, of }) => <div className="ns-segs">{Array.from({ length: of }, (_, index) => <i key={index} className={index < on ? "on" : ""} />)}</div>;

export function Band({ title, line, action, tone = "", top = false }) {
  return <div className={`ns-shell ns-band-wrap ${top ? "pt" : ""}`}>
    <section className={`ns-band ${tone ? `b-${tone}` : ""} ${tone === "navy" ? "is-dark" : ""}`}>
      <div><h2 className="ns-stmt s36">{title}</h2>{line && <p>{line}</p>}</div>
      {action}
    </section>
  </div>;
}

export function Bullets({ items }) {
  return <ul className="ns-bullets">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export function Steps({ items, two = false }) {
  return <ol className={`ns-steps ${two ? "g2" : ""}`}>{items.map(([name, line]) => <li key={name} className="ns-step"><b>{name}</b><span>{line}</span></li>)}</ol>;
}

export function FormSection({ id, eyebrow, title, lede, tone = "white", children }) {
  return <Sec tone={tone} id={id} labelledBy={`${id}-title`} className="ns-form-section">
    <div className="ns-two top">
      <div>{eyebrow && <p className="ns-eyebrow">{eyebrow}</p>}<h2 className="ns-stmt s44" id={`${id}-title`}>{title}</h2>{lede && <p className="ns-body" style={{ marginTop: 18 }}>{lede}</p>}</div>
      <div>{children}</div>
    </div>
  </Sec>;
}

export function Gantt({ lanes, compact = false, label }) {
  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  return <figure className={`ns-gantt ${compact ? "compact" : ""}`} role="img" aria-label={label}>
    <div className="spacer" aria-hidden="true" />
    <div className="months" aria-hidden="true">{months.map((month) => <span key={month}>{compact ? month[0] : month}</span>)}</div>
    {lanes.map((lane) => [
      <div className="who" key={`${lane.key}-who`} aria-hidden="true"><b>{lane.name}</b>{lane.sub && <small>{lane.sub}</small>}</div>,
      <div className="lane" key={`${lane.key}-lane`} aria-hidden="true"><div className="bar" style={{ gridColumn: lane.span, background: lane.color }}>{lane.label}</div></div>,
    ])}
  </figure>;
}
