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
  { icon: <Briefcase size={16} />, label: "Currently", value: "QA Engineer @ Bonterra" },
  { icon: <GraduationCap size={16} />, label: "Code roots", value: "BoiseCodeWorks alum" },
  { icon: <Coffee size={16} />, label: "Powered by", value: "Coffee + curiosity" },
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
            Two crafts.
            <br />
            One <span className="serif-italic gradient-text">obsession</span>{" "}
            with detail.
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
                  For <strong>4+ years</strong> I've made software safer to ship.
                  I write end-to-end tests in <strong>Playwright</strong> and{" "}
                  <strong>Cypress</strong>, glue them into{" "}
                  <strong>Azure DevOps YAML pipelines</strong>, and stand up the
                  microservice plumbing that creates and tears down test data on
                  the fly.
                </p>
                <p>
                  I migrated a full Cypress suite to Playwright at{" "}
                  <strong>QualityLogic</strong>, drove load testing in{" "}
                  <strong>K6</strong> on a microservice workflow, built Android
                  automation in <strong>Kotlin + Espresso</strong>, and learned
                  how to read the room when collaborating with overseas teams.
                  Today I do the same kind of work at{" "}
                  <strong>Bonterra</strong>.
                </p>
                <p>
                  I started in <span className="serif-italic">accessibility</span>{" "}
                  testing — WCAG, screen readers, the works. That's where I
                  learned that quality isn't just "does it work?" — it's{" "}
                  <em>does it work for everyone?</em>
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
                  Photography is where the engineering brain gets to{" "}
                  <span className="serif-italic">play</span>. Same obsession with
                  detail, different output: instead of green check-marks, you
                  get a frame that makes someone feel something.
                </p>
                <p>
                  I shoot with a soft eye for portraits, lifestyle, and the
                  quiet moments most people walk past. Idaho light is a gift —
                  golden hour here lasts forever — and I use it to make people
                  feel like the main character of their own story.
                </p>
                <p>
                  <strong>I'm taking on clients.</strong> Portraits, couples,
                  events, brand work. If you're nearby (or flying me out), let's
                  build something honest together.
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
