import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ChevronDown } from "lucide-react";
import "./HeroScenePicker.css";

const OPTIONS = [
  {
    group: "Originals",
    id: "aurora",
    name: "Aurora",
    desc: "Iridescent blob, orbiting rings, sparkles.",
    thumbClass: "thumb-aurora",
  },
  {
    group: "Originals",
    id: "aperture",
    name: "Aperture",
    desc: "Camera iris with focus marks. Photo-y.",
    thumbClass: "thumb-aperture",
  },
  {
    group: "Originals",
    id: "constellation",
    name: "Constellation",
    desc: "Wireframe network of nodes & lines.",
    thumbClass: "thumb-constellation",
  },
  {
    group: "Originals",
    id: "chrome",
    name: "Liquid Chrome",
    desc: "Refractive glass torus knot.",
    thumbClass: "thumb-chrome",
  },
  {
    group: "Originals",
    id: "cosmic",
    name: "Cosmic Dust",
    desc: "Spiral galaxy of warm particles.",
    thumbClass: "thumb-cosmic",
  },
  {
    group: "Hybrids (chrome + cosmic)",
    id: "galactic",
    name: "Galactic Core",
    desc: "Glass knot at the eye of a spiral galaxy.",
    thumbClass: "thumb-galactic",
  },
  {
    group: "Hybrids (chrome + cosmic)",
    id: "refracted",
    name: "Refracted Cosmos",
    desc: "Glass dodecahedron prismed over a particle field.",
    thumbClass: "thumb-refracted",
  },
  {
    group: "Hybrids (chrome + cosmic)",
    id: "crystal",
    name: "Crystal Nebula",
    desc: "Cluster of glass crystals in warm dust.",
    thumbClass: "thumb-crystal",
  },
  {
    group: "Hybrids (chrome + cosmic)",
    id: "orb",
    name: "Orb & Orbit",
    desc: "Pearly chrome sphere with a Saturn-style ring.",
    thumbClass: "thumb-orb",
  },
];

export default function HeroScenePicker({ value, onChange }) {
  const [open, setOpen] = useState(true);
  const current = OPTIONS.find((o) => o.id === value) || OPTIONS[0];

  return (
    <div className="picker">
      <AnimatePresence initial={false} mode="wait">
        {open ? (
          <motion.div
            key="open"
            className="picker-panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="picker-head">
              <span className="picker-eyebrow">
                <Sparkles size={12} /> Pick a vibe
              </span>
              <button
                className="picker-close"
                onClick={() => setOpen(false)}
                aria-label="Collapse picker"
              >
                <X size={14} />
              </button>
            </div>
            <div className="picker-list">
              {OPTIONS.map((o, i) => {
                const prev = OPTIONS[i - 1];
                const showHeader = !prev || prev.group !== o.group;
                return (
                  <React.Fragment key={o.id}>
                    {showHeader && (
                      <span className="picker-group">{o.group}</span>
                    )}
                    <button
                      className={`picker-option ${value === o.id ? "active" : ""}`}
                      onClick={() => onChange(o.id)}
                      data-cursor
                    >
                      <span className={`picker-thumb ${o.thumbClass}`} />
                      <span className="picker-meta">
                        <span className="picker-name">{o.name}</span>
                        <span className="picker-desc">{o.desc}</span>
                      </span>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
            <p className="picker-foot">
              Tell me which one you like and I'll strip the rest.
            </p>
          </motion.div>
        ) : (
          <motion.button
            key="closed"
            className="picker-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(true)}
            data-cursor
          >
            <span className={`picker-thumb sm ${current.thumbClass}`} />
            <span className="picker-tab-label">
              <span>Vibe:</span>
              <strong>{current.name}</strong>
            </span>
            <ChevronDown size={14} style={{ transform: "rotate(180deg)" }} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
