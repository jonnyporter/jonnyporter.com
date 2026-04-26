import React from "react";
import "./Marquee.css";

export default function Marquee({ items = [], variant = "" }) {
  const repeat = [...items, ...items, ...items, ...items];
  return (
    <div className={`marquee ${variant}`} aria-hidden="true">
      <div className="marquee-track">
        {repeat.map((it, i) => (
          <span className="marquee-item" key={i}>
            <span>{it}</span>
            <Star />
          </span>
        ))}
      </div>
    </div>
  );
}

function Star() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M11 0c.4 5.7 4.9 10.2 10.6 10.6v.8C15.9 11.8 11.4 16.3 11 22h-.8c-.4-5.7-4.9-10.2-10.6-10.6v-.8C5.3 10.2 9.8 5.7 10.2 0H11z"
        fill="currentColor"
      />
    </svg>
  );
}
