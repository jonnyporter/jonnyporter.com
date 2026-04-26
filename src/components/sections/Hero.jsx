import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, Camera, Code2 } from "lucide-react";
import HeroScene from "../three/HeroScene.jsx";
import "./Hero.css";

const ROLES = [
  "QA Engineer at Bonterra",
  "Photographer",
  "Founder of Oovra",
  "Playwright nerd",
  "AI integration guy",
  "Idaho-based",
];

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setRoleIdx((i) => (i + 1) % ROLES.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="top" className="hero">
      <div className="hero-canvas">
        <HeroScene />
      </div>
      <div className="hero-vignette" />

      <div className="hero-content container">
        <motion.div
          className="hero-eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="dot-live" />
          <span>Booking photo shoots · Taking Oovra projects · Idaho</span>
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <span className="hero-line">
            <span className="hero-word">Hi,</span>
            <span className="hero-word">I'm</span>
            <span className="hero-word gradient-text">Jonny.</span>
          </span>
          <span className="hero-line">
            <span className="hero-word">Tests</span>
            <span className="hero-word serif-italic">by day,</span>
          </span>
          <span className="hero-line">
            <span className="hero-word gradient-text-cool">photos</span>
            <span className="hero-word serif-italic">by light,</span>
          </span>
          <span className="hero-line">
            <span className="hero-word">apps</span>
            <span className="hero-word serif-italic">on the side.</span>
          </span>
        </motion.h1>

        <motion.div
          className="hero-meta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="hero-role">
            <span className="hero-role-label">Currently:</span>
            <div className="hero-role-rotator">
              {ROLES.map((r, i) => (
                <span
                  key={r}
                  className={`hero-role-item ${i === roleIdx ? "active" : ""}`}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <a href="#engineer" className="hero-btn primary" data-cursor data-cursor-text="See">
            <Code2 size={18} />
            See the engineering
            <ArrowDownRight size={18} />
          </a>
          <a href="#photography" className="hero-btn ghost" data-cursor data-cursor-text="View">
            <Camera size={18} />
            View the photography
          </a>
        </motion.div>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Stat value="4+" label="Years in QA" />
          <Stat value="∞" label="Bugs prevented" />
          <Stat value="∞" label="Frames captured" />
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="hero-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span>Scroll</span>
        <span className="hero-scroll-bar">
          <span className="hero-scroll-bead" />
        </span>
      </motion.a>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div className="hero-stat">
      <span className="hero-stat-val">{value}</span>
      <span className="hero-stat-label">{label}</span>
    </div>
  );
}
