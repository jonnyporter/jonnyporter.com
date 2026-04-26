import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera, MapPin } from "lucide-react";
import "./Photography.css";

/**
 * Placeholder photos sourced from picsum (seeded so they stay stable).
 * Replace `src` and `caption` with your own work — keep the `area` field
 * to preserve the bento layout, or rebalance to taste.
 */
const PHOTOS = [
  { id: 1, area: "a", seed: "boise-portrait", w: 800, h: 1100, category: "Portrait", title: "Golden hour, McCall", loc: "McCall, ID" },
  { id: 2, area: "b", seed: "idaho-mountains", w: 1200, h: 800, category: "Landscape", title: "Sawtooth ridge", loc: "Stanley, ID" },
  { id: 3, area: "c", seed: "couple-walking", w: 800, h: 800, category: "Lifestyle", title: "Long walk home", loc: "Boise, ID" },
  { id: 4, area: "d", seed: "city-evening", w: 800, h: 1100, category: "Street", title: "Evening blue", loc: "Portland, OR" },
  { id: 5, area: "e", seed: "wedding-detail", w: 1200, h: 800, category: "Event", title: "Vows in the pines", loc: "Sun Valley, ID" },
  { id: 6, area: "f", seed: "studio-portrait", w: 800, h: 1000, category: "Portrait", title: "Window light study", loc: "Studio" },
  { id: 7, area: "g", seed: "river-light", w: 800, h: 800, category: "Landscape", title: "Boise river, late summer", loc: "Boise, ID" },
  { id: 8, area: "h", seed: "brand-product", w: 1200, h: 900, category: "Brand", title: "On set with friends", loc: "Meridian, ID" },
  { id: 9, area: "i", seed: "candid-laughter", w: 800, h: 1000, category: "Lifestyle", title: "Catching the in-between", loc: "Eagle, ID" },
];

const CATEGORIES = ["All", "Portrait", "Lifestyle", "Landscape", "Event", "Street", "Brand"];

const photoUrl = (p) => `https://picsum.photos/seed/${p.seed}/${p.w}/${p.h}`;

export default function Photography() {
  const [filter, setFilter] = useState("All");
  const [openIdx, setOpenIdx] = useState(null);

  const filtered = filter === "All" ? PHOTOS : PHOTOS.filter((p) => p.category === filter);

  const open = (idx) => setOpenIdx(idx);
  const close = useCallback(() => setOpenIdx(null), []);
  const next = useCallback(() => setOpenIdx((i) => (i === null ? 0 : (i + 1) % filtered.length)), [filtered.length]);
  const prev = useCallback(() => setOpenIdx((i) => (i === null ? 0 : (i - 1 + filtered.length) % filtered.length)), [filtered.length]);

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openIdx, close, next, prev]);

  return (
    <section id="photography" className="photo">
      <div className="container">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow">02 · The Photographer</span>
          <h2 className="section-title">
            What I'm{" "}
            <span className="serif-italic gradient-text">looking at</span>{" "}
            lately.
          </h2>
          <p className="section-lede">
            A working portfolio. Mostly Idaho, will travel. The frames
            here are placeholders for now — real ones are on the way.
          </p>
        </motion.div>

        <div className="photo-controls">
          <div className="photo-filters">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                data-cursor
                className={filter === c ? "active" : ""}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="photo-count">
            <Camera size={14} />
            <span>{filtered.length} frames</span>
          </div>
        </div>

        <div
          key={filter}
          className={`photo-grid photo-grid-fade ${filter === "All" ? "bento" : ""}`}
        >
          {filtered.map((p) => (
            <button
              key={p.id}
              className="photo-card"
              style={filter === "All" ? { gridArea: p.area } : undefined}
              onClick={() => open(filtered.indexOf(p))}
              data-cursor
              data-cursor-text="View"
            >
              <img src={photoUrl(p)} alt={p.title} loading="lazy" />
              <div className="photo-card-overlay">
                <span className="photo-card-cat">{p.category}</span>
                <span className="photo-card-title">{p.title}</span>
                <span className="photo-card-loc">
                  <MapPin size={12} /> {p.loc}
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="photo-cta">
          Want to see fresh work or talk about a shoot?{" "}
          <a href="#services" className="link">
            Check booking →
          </a>
        </p>
      </div>

      <AnimatePresence>
        {openIdx !== null && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button
              className="lightbox-close"
              onClick={close}
              aria-label="Close"
              data-cursor
            >
              <X size={20} />
            </button>
            <button
              className="lightbox-nav prev"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous"
              data-cursor
            >
              <ChevronLeft size={28} />
            </button>
            <button
              className="lightbox-nav next"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next"
              data-cursor
            >
              <ChevronRight size={28} />
            </button>
            <motion.div
              className="lightbox-stage"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              key={filtered[openIdx].id}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={photoUrl(filtered[openIdx])} alt={filtered[openIdx].title} />
              <div className="lightbox-meta">
                <div>
                  <span className="lightbox-cat">{filtered[openIdx].category}</span>
                  <h4>{filtered[openIdx].title}</h4>
                  <span className="lightbox-loc">
                    <MapPin size={12} /> {filtered[openIdx].loc}
                  </span>
                </div>
                <span className="lightbox-counter">
                  {String(openIdx + 1).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
