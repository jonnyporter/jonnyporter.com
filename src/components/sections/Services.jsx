import React from "react";
import {
  User,
  Heart,
  CalendarDays,
  Sparkles,
  ArrowUpRight,
  Check,
} from "lucide-react";
import Reveal from "../Reveal.jsx";
import { Bug } from "../BugHunt.jsx";
import { spotlight } from "../../lib/hooks.js";
import "./Services.css";

const SERVICES = [
  {
    icon: <User size={20} />,
    title: "Portraits",
    blurb:
      "Headshots, personal brand, or just because. Studio or on location.",
    bullets: ["1-hour session", "30+ retouched frames", "Print-ready files"],
    from: "$250",
    accent: "warm",
  },
  {
    icon: <Heart size={20} />,
    title: "Couples & Families",
    blurb:
      "Casual, candid, low-pressure. I'll keep the directing light.",
    bullets: ["1.5-hour session", "60+ frames", "Online gallery"],
    from: "$350",
    accent: "cool",
    featured: true,
  },
  {
    icon: <CalendarDays size={20} />,
    title: "Events",
    blurb:
      "Engagements, parties, small weddings. Two cameras, quiet feet.",
    bullets: ["Up to 6 hours", "Full edit", "48-hour preview gallery"],
    from: "Quote",
    accent: "purple",
  },
  {
    icon: <Sparkles size={20} />,
    title: "Brand & Editorial",
    blurb:
      "Product, founder portraits, lifestyle for content. Shot for the way you'll actually use it.",
    bullets: ["Half or full day", "Usage rights included", "Quick-turn web set"],
    from: "Quote",
    accent: "warm",
  },
];

export default function Services() {
  return (
    <section id="services" className="services">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Photography booking</span>
          <h2 className="section-title">
            Pick a shoot, or{" "}
            <span className="serif-italic gradient-text">cook one up</span>{" "}
            with me.
          </h2>
          <p className="section-lede">
            Idaho local, will travel. None of these quite fit your idea?
            Send a note — I'll put something custom together.
          </p>
        </Reveal>

        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <Reveal
              key={s.title}
              className={`service-card spot ${s.accent} ${s.featured ? "featured" : ""}`}
              delay={i * 80}
              onPointerMove={spotlight}
            >
              {s.featured && <span className="service-tag">Most booked</span>}
              <div className="service-head">
                <span className="service-icon">{s.icon}</span>
                <h3>{s.title}</h3>
              </div>
              <p className="service-blurb">{s.blurb}</p>
              <ul className="service-bullets">
                {s.bullets.map((b) => (
                  <li key={b}>
                    <Check size={14} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="service-foot">
                <span className="service-from">
                  {s.from === "Quote" ? "By quote" : `From ${s.from}`}
                </span>
                <a
                  href="#contact"
                  className="service-cta"
                  aria-label={`Inquire about ${s.title}`}
                  data-cursor
                  data-cursor-text="Book"
                >
                  Inquire <ArrowUpRight size={14} />
                </a>
              </div>
            </Reveal>
          ))}
          <Bug id="staging" className="services-bug" />
        </div>
      </div>
    </section>
  );
}
