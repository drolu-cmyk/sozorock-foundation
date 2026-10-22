import { Link } from "./router";

export function NotFoundPage() {
  return <div className="ns ns-notfound"><div className="ns-shell" style={{ paddingBlock: "96px 128px" }}>
    <p className="ns-eyebrow">Page not found</p>
    <h1 className="ns-h1" style={{ marginTop: 14, maxWidth: 760 }}>We could not find that page.</h1>
    <p className="ns-lede" style={{ marginTop: 20 }}>It may have moved. Start from our work, research or events.</p>
    <div className="ns-actions" style={{ marginTop: 36 }}><Link href="/" className="ns-btn ns-btn-primary">Return home</Link><Link href="/platforms" className="ns-more">Explore our work&nbsp;→</Link><Link href="/publications" className="ns-more">Read our research&nbsp;→</Link></div>
  </div></div>;
}
