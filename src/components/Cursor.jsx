import React, { useEffect, useRef, useState } from "react";
import "./Cursor.css";

/**
 * Custom dot + trailing ring. Only switches on for real mouse pointers;
 * the native cursor is hidden via `html.has-cursor`, so touch devices and
 * no-JS visitors always keep theirs.
 */
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState("");
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;

    const tick = () => {
      rx += (x - rx) * 0.24;
      ry += (y - ry) * 0.24;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      raf =
        Math.abs(x - rx) + Math.abs(y - ry) > 0.2
          ? requestAnimationFrame(tick)
          : 0;
    };

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const over = (e) => {
      const el = e.target instanceof Element ? e.target : null;
      // Let form controls keep their native caret / slider cursor.
      const native = !!el?.closest("input, textarea, select");
      const target = el?.closest("[data-cursor]");
      setHidden(native);
      setHover(!!target && !native);
      setLabel((!native && target?.getAttribute("data-cursor-text")) || "");
    };

    const leave = () => setHidden(true);

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over, { passive: true });
    root.addEventListener("mouseleave", leave);

    return () => {
      root.classList.remove("has-cursor");
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      root.removeEventListener("mouseleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className={`cursor ${hidden ? "is-hidden" : ""}`} aria-hidden="true">
      <div ref={ring} className={`cursor-ring ${hover ? "hover" : ""}`}>
        {label && <span>{label}</span>}
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
