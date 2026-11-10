import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { ArrowDownRight, Camera, Code2 } from "lucide-react";
import { Bug } from "../BugHunt.jsx";
import { useInView, usePrefersReducedMotion } from "../../lib/hooks.js";
import "./Hero.css";

// three.js is by far the heaviest thing on the page, so it loads on its own,
// after the text has painted.
const HeroScene = lazy(() => import("../three/HeroScene.jsx"));

const ROLES = [
  "QA Engineer at Bonterra",
  "Photographer",
  "Founder of Oovra",
  "Playwright nerd",
  "AI integration guy",
  "Idaho-based",
];

function canRunWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [mountScene, setMountScene] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { amount: 0.05 });
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setRoleIdx((i) => (i + 1) % ROLES.length);
    }, 2400);
    return () => clearInterval(id);
  }, [reducedMotion]);

  useEffect(() => {
    if (navigator.connection?.saveData || !canRunWebGL()) return;
    const idle =
      window.requestIdleCallback || ((cb) => window.setTimeout(cb, 250));
    const cancel = window.cancelIdleCallback || window.clearTimeout;
    const id = idle(() => setMountScene(true), { timeout: 1200 });
    return () => cancel(id);
  }, []);

  return (
    <section id="top" className="hero" ref={sectionRef}>
      <div className="hero-backdrop" aria-hidden="true" />
      <div
        className={`hero-canvas ${sceneReady ? "ready" : ""}`}
        aria-hidden="true"
      >
        {mountScene && (
          <Suspense fallback={null}>
            <HeroScene
              active={inView}
              reducedMotion={reducedMotion}
              onReady={() => setSceneReady(true)}
            />
          </Suspense>
        )}
      </div>
      <div className="hero-vignette" aria-hidden="true" />

      <div className="hero-content container">
        <div className="hero-eyebrow hero-rise" style={{ "--i": 0 }}>
          <span className="dot" />
          <span>Booking photo shoots · Taking Oovra projects · Idaho</span>
        </div>

        <h1 className="hero-title">
          <span className="hero-line hero-rise" style={{ "--i": 1 }}>
            <span className="hero-word">Hi,</span>
            <span className="hero-word">I'm</span>
            <span className="hero-word gradient-text">Jonny.</span>
          </span>
          <span className="hero-line hero-rise" style={{ "--i": 2 }}>
            <span className="hero-word">Tests</span>
            <span className="hero-word serif-italic">by day,</span>
          </span>
          <span className="hero-line hero-rise" style={{ "--i": 3 }}>
            <span className="hero-word gradient-text-cool">photos</span>
            <span className="hero-word serif-italic">by light,</span>
          </span>
          <span className="hero-line hero-rise" style={{ "--i": 4 }}>
            <span className="hero-word">apps</span>
            <span className="hero-word serif-italic">on the side.</span>
          </span>
        </h1>

        <div className="hero-meta hero-rise" style={{ "--i": 5 }}>
          <div className="hero-role">
            <span className="hero-role-label">Currently:</span>
            <div className="hero-role-rotator" aria-hidden="true">
              {ROLES.map((r, i) => (
                <span
                  key={r}
                  className={`hero-role-item ${i === roleIdx ? "active" : ""}`}
                >
                  {r}
                </span>
              ))}
            </div>
            <span className="sr-only">{ROLES.join(", ")}</span>
          </div>
        </div>

        <div className="hero-actions hero-rise" style={{ "--i": 6 }}>
          <a
            href="#engineer"
            className="hero-btn primary"
            data-cursor
            data-cursor-text="See"
          >
            <Code2 size={18} />
            See the engineering
            <ArrowDownRight size={18} />
          </a>
          <a
            href="#photography"
            className="hero-btn ghost"
            data-cursor
            data-cursor-text="Shoot"
          >
            <Camera size={18} />
            Try the camera
          </a>
        </div>

        <div className="hero-stats hero-rise" style={{ "--i": 7 }}>
          <Stat value="5+" label="Years in QA" />
          <Stat value="∞" label="Bugs prevented" />
          <Stat value="∞" label="Frames captured" />
          <Bug id="kpi" className="hero-bug" />
        </div>
      </div>

      <a href="#about" className="hero-scroll" aria-label="Scroll to About">
        <span>Scroll</span>
        <span className="hero-scroll-bar">
          <span className="hero-scroll-bead" />
        </span>
      </a>
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
