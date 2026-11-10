import React, { useEffect, useRef, useState } from "react";
import {
  GitBranch,
  CheckCircle2,
  Loader2,
  Activity,
  Zap,
  Layers,
  Bot,
  Workflow,
  Globe,
  Accessibility,
  ServerCog,
} from "lucide-react";
import Reveal from "../Reveal.jsx";
import Terminal from "./Terminal.jsx";
import { spotlight, useInView, usePrefersReducedMotion } from "../../lib/hooks.js";
import "./Engineer.css";

/* ---------- CI Pipeline ---------- */
const STAGES = [
  { name: "PR check", icon: <CheckCircle2 size={14} />, dur: 1500 },
  { name: "Pre-deploy", icon: <Layers size={14} />, dur: 1800 },
  { name: "Post-deploy", icon: <Activity size={14} />, dur: 2200 },
  { name: "Nightly", icon: <Bot size={14} />, dur: 2400 },
  { name: "Release", icon: <Zap size={14} />, dur: 1800 },
];

function Pipeline() {
  const [active, setActive] = useState(-1);
  const [done, setDone] = useState([]);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) {
      setActive(-1);
      setDone(STAGES.map((_, i) => i));
      return;
    }
    const timers = [];
    const start = () => {
      setActive(-1);
      setDone([]);
      let acc = 400;
      STAGES.forEach((s, i) => {
        timers.push(setTimeout(() => setActive(i), acc));
        acc += s.dur;
        timers.push(
          setTimeout(() => {
            setDone((d) => [...d, i]);
            if (i === STAGES.length - 1) {
              timers.push(setTimeout(start, 2500));
            }
          }, acc)
        );
      });
    };
    start();
    return () => timers.forEach(clearTimeout);
  }, [inView, reducedMotion]);

  const allDone = done.length === STAGES.length;

  return (
    <div className="pipeline" ref={ref}>
      <div className="pipeline-header">
        <GitBranch size={14} />
        <span>main · e2e</span>
        <span className={`pipeline-status ${allDone ? "passed" : ""}`}>
          {allDone ? "passed" : "running"}
        </span>
        <span className="pipeline-tag">.github/workflows/e2e.yml</span>
      </div>
      <div className="pipeline-track">
        {STAGES.map((s, i) => {
          const isDone = done.includes(i);
          const isActive = active === i && !isDone;
          return (
            <React.Fragment key={s.name}>
              <div
                className={`stage ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}
              >
                <div className="stage-icon">
                  {isActive ? <Loader2 size={14} className="spin" /> : s.icon}
                </div>
                <span className="stage-name">{s.name}</span>
                {isActive && (
                  <div
                    className="stage-bar"
                    style={{ animationDuration: `${s.dur}ms` }}
                  />
                )}
              </div>
              {i < STAGES.length - 1 && (
                <div className={`stage-link ${isDone ? "done" : ""}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Skills ---------- */
const SKILL_GROUPS = [
  {
    name: "Automation",
    icon: <Bot size={16} />,
    items: ["Playwright", "Cypress", "Selenium WebDriver", "Espresso"],
  },
  {
    name: "Languages",
    icon: <Workflow size={16} />,
    items: ["TypeScript", "JavaScript", "Kotlin", "C#"],
  },
  {
    name: "CI / DevOps",
    icon: <ServerCog size={16} />,
    items: ["GitHub Actions", "Azure DevOps YAML", "Docker", "Microservice fixtures"],
  },
  {
    name: "Reporting & Perf",
    icon: <Zap size={16} />,
    items: ["TestRail", "K6 load testing", "API mocks", "Test data pipelines"],
  },
  {
    name: "Quality",
    icon: <Accessibility size={16} />,
    items: ["WCAG / a11y", "Manual + exploratory", "Test planning"],
  },
  {
    name: "Web & Mobile",
    icon: <Globe size={16} />,
    items: ["React", "Android (Espresso)", "iOS basics", "REST / GraphQL"],
  },
];

/* ---------- Timeline ---------- */
const TIMELINE = [
  {
    company: "Bonterra",
    role: "QA Engineer",
    range: "Jun 2025 – Now",
    location: "Remote",
    note: "Playwright + TypeScript on a modern web stack, with GitHub Actions doing the heavy lifting around CI. The work itself stays inside the building.",
    tag: "current",
  },
  {
    company: "QualityLogic",
    role: "Software QA Automation Engineer",
    range: "Jan 2022 – Jun 2025",
    location: "Boise, ID · Remote",
    note: "Rewrote a Cypress suite to Playwright. Built Azure DevOps YAML pipelines. Led K6 load testing on a microservice workflow with two teammates. Android automation in Kotlin + Espresso. Worked with overseas teams to ship.",
  },
  {
    company: "QualityLogic",
    role: "Accessibility Software Tester",
    range: "Nov 2021 – Jan 2022",
    location: "Boise, ID",
    note: "WCAG audits and screen reader QA across desktop and mobile for client products.",
  },
  {
    company: "Arrow Electronics",
    role: "QA Inspector",
    range: "Nov 2020 – Jan 2021",
    location: "Phoenix, AZ",
    note: "Hardware QA on tech shipments before software took over.",
  },
  {
    company: "Plexus Corp.",
    role: "QA Inspector (Cleanroom)",
    range: "Oct 2019 – Feb 2020",
    location: "Nampa, ID",
    note: "Cleanroom QA on silicon chips and tiny satellite boards. Wires thinner than a human hair, only visible under a microscope. Excellent training for caring about details that nobody else can see.",
  },
];

export default function Engineer() {
  return (
    <section id="engineer" className="engineer">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">01 · The Engineer</span>
          <h2 className="section-title">
            Five years writing the tests
            <br />
            <span className="serif-italic gradient-text-cool">
              other people forgot to.
            </span>
          </h2>
          <p className="section-lede">
            Most of my day job is figuring out how to run more tests, more
            often, in less time — without losing the signal in the noise.
          </p>
        </Reveal>

        <div className="engineer-grid">
          <Reveal className="engineer-terminal-wrap">
            <Terminal />
          </Reveal>

          <Reveal className="engineer-pipeline-wrap" delay={100}>
            <Pipeline />
            <p className="engineer-pipeline-note">
              PR checks before merge, smoke tests after deploy,
              nightlies for the long tail, full regressions on
              release. Roughly the shape of a healthy QA pipeline.
            </p>
            <div className="engineer-callout">
              <span className="callout-num">Playwright + TS</span>
              <span className="callout-label">stack of choice</span>
            </div>
          </Reveal>
        </div>

        <div className="skills-block">
          <Reveal as="h3" className="block-title">
            The toolbelt
          </Reveal>
          <div className="skills-grid">
            {SKILL_GROUPS.map((g, gi) => (
              <Reveal
                className="skill-card spot"
                key={g.name}
                delay={gi * 60}
                onPointerMove={spotlight}
              >
                <div className="skill-card-head">
                  <span className="skill-icon">{g.icon}</span>
                  <span className="skill-cat">{g.name}</span>
                </div>
                <ul>
                  {g.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="timeline-block">
          <Reveal as="h3" className="block-title">
            The road so far
          </Reveal>
          <ol className="timeline">
            {TIMELINE.map((t, i) => (
              <Reveal
                as="li"
                key={i}
                className={`timeline-item ${t.tag === "current" ? "current" : ""}`}
                delay={i * 50}
              >
                <div className="timeline-marker">
                  <span />
                </div>
                <div className="timeline-meta">
                  <span className="timeline-range">
                    {t.range}
                    {t.tag === "current" && (
                      <span className="timeline-pill">Now</span>
                    )}
                  </span>
                  <span className="timeline-loc">{t.location}</span>
                </div>
                <div className="timeline-content">
                  <h4 className="timeline-role">
                    {t.role} <span className="timeline-co">@ {t.company}</span>
                  </h4>
                  <p className="timeline-note">{t.note}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
