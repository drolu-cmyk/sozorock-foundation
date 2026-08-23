import { useEffect, useState } from "react";

const isExternal = (href = "") => /^(https?:|mailto:)/.test(href);

export function useCurrentPath() {
  const [location, setLocation] = useState(() => ({
    pathname: window.location.pathname || "/",
    hash: window.location.hash || "",
  }));

  useEffect(() => {
    const update = () => setLocation({ pathname: window.location.pathname || "/", hash: window.location.hash || "" });
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  return location;
}

export function Link({ href, children, className = "", onClick, ...props }) {
  if (isExternal(href)) {
    return <a href={href} className={className} onClick={onClick} {...props}>{children}</a>;
  }

  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const target = new URL(href, window.location.origin);
    const next = `${target.pathname}${target.hash}`;
    const current = `${window.location.pathname}${window.location.hash}`;
    if (next !== current) window.history.pushState({}, "", next);
    window.dispatchEvent(new PopStateEvent("popstate"));
    requestAnimationFrame(() => {
      if (target.hash) document.querySelector(target.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "auto" });
    });
  };

  return <a href={href} className={className} onClick={handleClick} {...props}>{children}</a>;
}
