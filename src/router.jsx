import { useEffect, useState } from "react";

const EXTERNAL_PLATFORM_ROUTES = new Map([
  ["/platforms/health", "https://health.sozorockfoundation.org/"],
  ["/platforms/ai-lab", "https://ai-lab.sozorockfoundation.org/"],
  ["/platforms/cbcap", "https://cbcap.sozorockfoundation.org/"],
  ["/platforms/cb-cap", "https://cbcap.sozorockfoundation.org/"],
]);

const isExternal = (href = "") => /^(https?:|mailto:)/.test(href);
const resolvedHref = (href = "") => EXTERNAL_PLATFORM_ROUTES.get(href) || href;

export function useCurrentPath(initialPath = "/") {
  const [location, setLocation] = useState(() => ({
    pathname: typeof window === "undefined" ? initialPath : window.location.pathname || "/",
    hash: typeof window === "undefined" ? "" : window.location.hash || "",
  }));

  useEffect(() => {
    const update = () => setLocation({ pathname: window.location.pathname || "/", hash: window.location.hash || "" });
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  return location;
}

export function Link({ href, children, className = "", onClick, ...props }) {
  const targetHref = resolvedHref(href);

  if (isExternal(targetHref)) {
    return <a href={targetHref} className={className} onClick={onClick} {...props}>{children}</a>;
  }

  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const target = new URL(targetHref, window.location.origin);
    const next = `${target.pathname}${target.search}${target.hash}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (next !== current) window.history.pushState({}, "", next);
    window.dispatchEvent(new PopStateEvent("popstate"));
    requestAnimationFrame(() => {
      if (target.hash) document.getElementById(decodeURIComponent(target.hash.slice(1)))?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      else {
        window.scrollTo({ top: 0, behavior: "auto" });
        document.getElementById("main-content")?.focus({ preventScroll: true });
      }
    });
  };

  return <a href={targetHref} className={className} onClick={handleClick} {...props}>{children}</a>;
}
