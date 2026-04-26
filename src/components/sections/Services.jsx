import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Heart,
  CalendarDays,
  Sparkles,
  ArrowUpRight,
  Check,
} from "lucide-react";
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
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
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
        </motion.div>

        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              className={`service-card ${s.accent} ${s.featured ? "featured" : ""}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
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
                  data-cursor
                  data-cursor-text="Book"
                >
                  Inquire <ArrowUpRight size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
