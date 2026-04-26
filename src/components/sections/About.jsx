import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Coffee,
  Camera,
  TerminalSquare,
} from "lucide-react";
import "./About.css";

const facts = [
  { icon: <MapPin size={16} />, label: "Based in", value: "Meridian, Idaho" },
  { icon: <Briefcase size={16} />, label: "Day job", value: "QA Engineer @ Bonterra" },
  { icon: <GraduationCap size={16} />, label: "Code roots", value: "BoiseCodeWorks alum" },
  { icon: <Coffee size={16} />, label: "Side studio", value: "Oovra — apps & AI" },
];

export default function About() {
  const [mode, setMode] = useState("engineer");

  return (
    <section id="about" className="about">
      <div className="container about-grid">
        <motion.div
          className="about-photo"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="about-photo-frame">
            <img src="/images/profile-pic.jpeg" alt="Jonny Porter" />
            <div className="about-photo-tag tl">
              <span className="dot warm" /> SDET
            </div>
            <div className="about-photo-tag br">
              <Camera size={12} /> f/1.4
            </div>
          </div>
          <div className="about-photo-glow" />
        </motion.div>

        <div className="about-copy">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            About
          </motion.span>

          <motion.h2
            className="about-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            Same brain.
            <br />
            Different{" "}
            <span className="serif-italic gradient-text">outputs</span>.
          </motion.h2>

          <div className="about-toggle">
            <button
              data-cursor
              className={mode === "engineer" ? "active" : ""}
              onClick={() => setMode("engineer")}
            >
              <TerminalSquare size={14} /> The Engineer
            </button>
            <button
              data-cursor
              className={mode === "photographer" ? "active" : ""}
              onClick={() => setMode("photographer")}
            >
              <Camera size={14} /> The Photographer
            </button>
            <span
              className="about-toggle-pill"
              style={{ transform: `translateX(${mode === "engineer" ? "0" : "100%"})` }}
            />
          </div>

          <div className="about-prose">
            {mode === "engineer" ? (
              <motion.div
                key="eng"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <p>
                  Going on <strong>4+ years</strong> in QA automation.
                  Day-to-day stack: <strong>Playwright</strong> in{" "}
                  <strong>TypeScript</strong>,{" "}
                  <strong>GitHub Actions</strong> for CI, and{" "}
                  <strong>TestRail</strong> on the reporting side. (The
                  specifics of what I'm testing stay at the office.)
                </p>
                <p>
                  Before that, three-and-change years at{" "}
                  <strong>QualityLogic</strong> — rewrote a Cypress suite
                  into Playwright, built K6 load tests for a microservice
                  workflow, and shipped Android automation in Kotlin +
                  Espresso.
                </p>
                <p>
                  I started in <span className="serif-italic">accessibility</span>{" "}
                  testing (WCAG, screen readers), and before that I was in
                  a cleanroom at Plexus QAing silicon chips and satellite
                  boards with wires thinner than a human hair. So yes, I
                  notice the small stuff.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="pho"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <p>
                  Photography is where I get out of my head. Same eye for
                  detail, but the answer at the end is a frame instead of a
                  passing test.
                </p>
                <p>
                  I shoot portraits, lifestyle, and the small stuff in
                  between. Mostly around Idaho, and I'll travel for the right
                  project.
                </p>
                <p>
                  <strong>I'm taking clients.</strong> Portraits, couples,
                  events, brand work — if you've got an idea (or just a
                  vibe), send it over.
                </p>
              </motion.div>
            )}
          </div>

          <div className="about-facts">
            {facts.map((f, i) => (
              <motion.div
                key={f.label}
                className="about-fact"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <span className="about-fact-icon">{f.icon}</span>
                <div>
                  <span className="about-fact-label">{f.label}</span>
                  <span className="about-fact-value">{f.value}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
