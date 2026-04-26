import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Terminal,
  GitBranch,
  CheckCircle2,
  Loader2,
  Activity,
  Zap,
  Layers,
  Bot,
  Workflow,
  Globe,
  Smartphone,
  Accessibility,
  ServerCog,
} from "lucide-react";
import "./Engineer.css";

/* ---------- Terminal ---------- */
const SCRIPT = [
  { cmd: "npx playwright test --project=chromium", delay: 80 },
  { out: "Running across 6 workers…", color: "dim" },
  { out: "  ✓  auth › login + 2FA (3.2s)", color: "green" },
  { out: "  ✓  forms › validation across browsers (5.8s)", color: "green" },
  { out: "  ✓  modals › focus trap + keyboard nav (4.1s)", color: "green" },
  { out: "  ✓  api › retry + idempotency (7.3s)", color: "green" },
  { out: "  ✓  flows › critical path, top to tail (11.0s)", color: "green" },
  { out: "  ↳  all green, no flakes today", color: "accent" },
  { out: "", color: "dim" },
  { cmd: "git push origin release/*", delay: 60 },
  { out: "  → CI handles the rest", color: "dim" },
];

function Terminal3D() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [typing, setTyping] = useState("");
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    if (!inView) return;
    let active = true;
    let i = 0;

    const run = async () => {
      // reset
      setVisibleLines(0);
      setTyping("");
      await new Promise((r) => setTimeout(r, 400));

      while (active && i < SCRIPT.length) {
        const line = SCRIPT[i];
        if (line.cmd) {
          // typewriter effect
          for (let j = 0; j <= line.cmd.length; j++) {
            if (!active) return;
            setTyping(line.cmd.slice(0, j));
            await new Promise((r) => setTimeout(r, line.delay || 60));
          }
          await new Promise((r) => setTimeout(r, 300));
          setVisibleLines(i + 1);
          setTyping("");
        } else {
          await new Promise((r) => setTimeout(r, 200));
          setVisibleLines(i + 1);
        }
        i++;
      }

      // pause then loop
      await new Promise((r) => setTimeout(r, 4000));
      if (!active) return;
      i = 0;
      run();
    };

    run();
    return () => { active = false; };
  }, [inView]);

  return (
    <div className="terminal" ref={ref}>
      <div className="terminal-chrome">
        <span className="dot-x red" />
        <span className="dot-x yellow" />
        <span className="dot-x green" />
        <span className="terminal-title">
          <Terminal size={12} /> ~ /e2e
        </span>
      </div>
      <div className="terminal-body">
        {SCRIPT.map((line, idx) => {
          if (idx >= visibleLines && !(idx === visibleLines && line.cmd && typing)) return null;
          if (line.cmd) {
            const text = idx === visibleLines && typing ? typing : line.cmd;
            return (
              <div className="terminal-line" key={idx}>
                <span className="terminal-prompt">$</span>
                <span className="terminal-cmd">{text}</span>
                {idx === visibleLines && typing && <span className="terminal-caret" />}
              </div>
            );
          }
          return (
            <div className={`terminal-line out ${line.color}`} key={idx}>
              {line.out || " "}
            </div>
          );
        })}
        {visibleLines >= SCRIPT.length && (
          <div className="terminal-line">
            <span className="terminal-prompt">$</span>
            <span className="terminal-caret" />
          </div>
        )}
      </div>
    </div>
  );
}

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

  useEffect(() => {
    if (!inView) return;
    let timers = [];
    const reset = () => { setActive(-1); setDone([]); };
    const start = () => {
      reset();
      let acc = 400;
      STAGES.forEach((s, i) => {
        timers.push(setTimeout(() => setActive(i), acc));
        acc += s.dur;
        timers.push(setTimeout(() => {
          setDone((d) => [...d, i]);
          if (i === STAGES.length - 1) {
            timers.push(setTimeout(start, 2500));
          }
        }, acc));
      });
    };
    start();
    return () => { timers.forEach(clearTimeout); };
  }, [inView]);

  return (
    <div className="pipeline" ref={ref}>
      <div className="pipeline-header">
        <GitBranch size={14} />
        <span>main · e2e</span>
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
                <div className={`stage-link ${done.includes(i) ? "done" : ""}`} />
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
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow">01 · The Engineer</span>
          <h2 className="section-title">
            Four years writing the tests
            <br />
            <span className="serif-italic gradient-text-cool">
              other people forgot to.
            </span>
          </h2>
          <p className="section-lede">
            Most of my day job is figuring out how to run more tests, more
            often, in less time — without losing the signal in the noise.
          </p>
        </motion.div>

        <div className="engineer-grid">
          <motion.div
            className="engineer-terminal-wrap"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <Terminal3D />
            <div className="engineer-callout">
              <span className="callout-num">Playwright + TS</span>
              <span className="callout-label">stack of choice</span>
            </div>
          </motion.div>

          <motion.div
            className="engineer-pipeline-wrap"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <Pipeline />
            <p className="engineer-pipeline-note">
              PR checks before merge, smoke tests after deploy,
              nightlies for the long tail, full regressions on
              release. Roughly the shape of a healthy QA pipeline.
            </p>
          </motion.div>
        </div>

        <div className="skills-block">
          <motion.h3
            className="block-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            The toolbelt
          </motion.h3>
          <div className="skills-grid">
            {SKILL_GROUPS.map((g, gi) => (
              <motion.div
                className="skill-card"
                key={g.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: gi * 0.06 }}
              >
                <div className="skill-card-head">
                  <span className="skill-icon">{g.icon}</span>
                  <span className="skill-cat">{g.name}</span>
                </div>
                <ul>
                  {g.items.map((it) => (
                    <li key={it}>
                      <Smartphone size={0} />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="timeline-block">
          <motion.h3
            className="block-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            The road so far
          </motion.h3>
          <ol className="timeline">
            {TIMELINE.map((t, i) => (
              <motion.li
                key={i}
                className={`timeline-item ${t.tag === "current" ? "current" : ""}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <div className="timeline-marker">
                  <span />
                </div>
                <div className="timeline-content">
                  <div className="timeline-meta">
                    <span className="timeline-range">{t.range}</span>
                    <span className="timeline-loc">· {t.location}</span>
                    {t.tag === "current" && (
                      <span className="timeline-pill">Now</span>
                    )}
                  </div>
                  <h4 className="timeline-role">
                    {t.role} <span className="timeline-co">@ {t.company}</span>
                  </h4>
                  <p className="timeline-note">{t.note}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
