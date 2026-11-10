import React, { useEffect, useRef } from "react";

/**
 * Fades + lifts its children in the first time they scroll into view.
 * One shared IntersectionObserver for the whole page; the animation itself
 * is plain CSS (.reveal / .reveal.in in global.css).
 *
 * Keep `className` static: the "in" class is added imperatively.
 */
let observer;

function getObserver() {
  if (observer || typeof IntersectionObserver === "undefined") return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
  );
  return observer;
}

export default function Reveal({
  as: Tag = "div",
  delay = 0,
  className = "",
  style,
  children,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = getObserver();
    if (!io) {
      el.classList.add("in");
      return;
    }
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={delay ? { ...style, "--d": `${delay}ms` } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
