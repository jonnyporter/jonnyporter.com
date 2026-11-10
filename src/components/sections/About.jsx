import React, { useState } from "react";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Coffee,
  Camera,
  TerminalSquare,
} from "lucide-react";
import Reveal from "../Reveal.jsx";
import "./About.css";

const facts = [
  { icon: <MapPin size={16} />, label: "Based in", value: "Meridian, Idaho" },
  { icon: <Briefcase size={16} />, label: "Day job", value: "QA Engineer @ Bonterra" },
  { icon: <GraduationCap size={16} />, label: "Code roots", value: "BoiseCodeWorks alum" },
  { icon: <Coffee size={16} />, label: "Side studio", value: "Oovra — apps & AI" },
];

const MODES = [
  { id: "engineer", label: "The Engineer", icon: <TerminalSquare size={14} /> },
  { id: "photographer", label: "The Photographer", icon: <Camera size={14} /> },
];

export default function About() {
  const [mode, setMode] = useState("engineer");

  const onTabKey = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = mode === "engineer" ? "photographer" : "engineer";
    setMode(next);
    document.getElementById(`about-tab-${next}`)?.focus();
  };

  return (
    <section id="about" className="about">
      <div className="container about-grid">
        <Reveal className="about-photo">
          <div className={`about-photo-frame mode-${mode}`}>
            <picture>
              <source
                type="image/webp"
                srcSet="/images/profile-480.webp 480w, /images/profile-800.webp 800w, /images/profile-1200.webp 1200w"
                sizes="(max-width: 900px) 360px, (max-width: 1400px) 36vw, 480px"
              />
              <img
                src="/images/profile-800.jpg"
                alt="Jonny Porter on a beach with a sea stack in the background"
                width="800"
                height="800"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <div className="about-photo-tag tl">
              <span className="dot warm" /> SDET
            </div>
            <div className="about-photo-tag br">
              <Camera size={12} /> f/1.4
            </div>
            <span className="about-photo-corner tl" aria-hidden="true" />
            <span className="about-photo-corner tr" aria-hidden="true" />
            <span className="about-photo-corner bl" aria-hidden="true" />
            <span className="about-photo-corner br" aria-hidden="true" />
          </div>
          <div className="about-photo-glow" />
        </Reveal>

        <div className="about-copy">
          <Reveal as="span" className="eyebrow">
            About
          </Reveal>

          <Reveal as="h2" className="about-title" delay={60}>
            Same brain.
            <br />
            Different{" "}
            <span className="serif-italic gradient-text">outputs</span>.
          </Reveal>

          <Reveal delay={120}>
            <div
              className="about-toggle"
              role="tablist"
              aria-label="Which side of Jonny"
            >
              {MODES.map((m) => (
                <button
                  key={m.id}
                  id={`about-tab-${m.id}`}
                  role="tab"
                  type="button"
                  aria-selected={mode === m.id}
                  aria-controls="about-panel"
                  tabIndex={mode === m.id ? 0 : -1}
                  data-cursor
                  className={mode === m.id ? "active" : ""}
                  onClick={() => setMode(m.id)}
                  onKeyDown={onTabKey}
                >
                  {m.icon} {m.label}
                </button>
              ))}
              <span
                className="about-toggle-pill"
                style={{
                  transform: `translateX(${mode === "engineer" ? "0" : "100%"})`,
                }}
              />
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div
              className="about-prose"
              id="about-panel"
              role="tabpanel"
              aria-labelledby={`about-tab-${mode}`}
            >
              {mode === "engineer" ? (
                <div key="eng" className="about-prose-swap">
                  <p>
                    Going on <strong>5+ years</strong> in QA automation.
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
                    I started in{" "}
                    <span className="serif-italic">accessibility</span>{" "}
                    testing (WCAG, screen readers), and before that I was in
                    a cleanroom at Plexus QAing silicon chips and satellite
                    boards with wires thinner than a human hair. So yes, I
                    notice the small stuff.
                  </p>
                </div>
              ) : (
                <div key="pho" className="about-prose-swap">
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
                </div>
              )}
            </div>
          </Reveal>

          <div className="about-facts">
            {facts.map((f, i) => (
              <Reveal key={f.label} className="about-fact" delay={i * 60}>
                <span className="about-fact-icon">{f.icon}</span>
                <div>
                  <span className="about-fact-label">{f.label}</span>
                  <span className="about-fact-value">{f.value}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
