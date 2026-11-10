import React, { useCallback, useEffect, useRef, useState } from "react";
import { Terminal as TerminalIcon } from "lucide-react";
import { BUGS, Bug, useBugHunt } from "../BugHunt.jsx";
import { scrollToId, useInView, usePrefersReducedMotion } from "../../lib/hooks.js";

/**
 * Plays a scripted Playwright run when it scrolls into view, then hands the
 * prompt to the visitor. Type `help`, or tap one of the chips underneath.
 */
const SCRIPT = [
  { cmd: "npx playwright test --project=chromium" },
  { out: "Running across 6 workers…", color: "dim" },
  { out: "  ✓  auth › login + 2FA (3.2s)", color: "green" },
  { out: "  ✓  forms › validation across browsers (5.8s)", color: "green" },
  { out: "  ✓  modals › focus trap + keyboard nav (4.1s)", color: "green" },
  { out: "  ✓  api › retry + idempotency (7.3s)", color: "green" },
  { out: "  ✓  flows › critical path, top to tail (11.0s)", color: "green" },
  { out: "  ↳  all green, no flakes today", color: "accent" },
  { out: "", color: "dim" },
  { out: "  your turn — type `help`", color: "dim" },
];

const CHIPS = ["help", "whoami", "stack", "bugs", "sudo hire jonny"];
const SECTIONS = ["about", "engineer", "oovra", "photography", "services", "contact"];

const out = (text, color = "plain") => ({ type: "out", text, color });

export default function Terminal() {
  const { found, reset } = useBugHunt();
  const [lines, setLines] = useState([]);
  const [typing, setTyping] = useState(null);
  const [busy, setBusy] = useState(true);
  const [value, setValue] = useState("");

  const rootRef = useRef(null);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const runId = useRef(0);
  const history = useRef([]);
  const historyIdx = useRef(-1);

  const inView = useInView(rootRef, { amount: 0.3, once: true });
  const reducedMotion = usePrefersReducedMotion();
  const reducedRef = useRef(false);
  reducedRef.current = reducedMotion;

  const play = useCallback(async () => {
    const id = ++runId.current;
    const alive = () => runId.current === id;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const push = (line) => setLines((l) => [...l, line]);

    setBusy(true);
    setTyping(null);

    if (reducedRef.current) {
      setLines((l) => [
        ...l,
        ...SCRIPT.map((s) =>
          s.cmd ? { type: "cmd", text: s.cmd } : out(s.out, s.color)
        ),
      ]);
      setBusy(false);
      return;
    }

    await wait(350);
    for (const step of SCRIPT) {
      if (!alive()) return;
      if (step.cmd) {
        for (let j = 0; j <= step.cmd.length; j++) {
          if (!alive()) return;
          setTyping(step.cmd.slice(0, j));
          await wait(42);
        }
        await wait(280);
        if (!alive()) return;
        setTyping(null);
        push({ type: "cmd", text: step.cmd });
      } else {
        await wait(190);
        if (!alive()) return;
        push(out(step.out, step.color));
      }
    }
    setBusy(false);
  }, []);

  useEffect(() => {
    if (inView) play();
  }, [inView, play]);

  useEffect(() => () => void runId.current++, []);

  // Keep the newest output in view (scrolls the terminal, never the page).
  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [lines, typing, busy]);

  const exec = (raw) => {
    const input = raw.trim();
    const cmd = input.toLowerCase();
    const echo = { type: "cmd", text: input };
    const reply = (...res) => setLines((l) => [...l, echo, ...res].slice(-160));

    if (!input) return reply();
    history.current.unshift(input);
    historyIdx.current = -1;

    if (cmd === "clear" || cmd === "cls") return setLines([]);

    if (cmd === "help" || cmd === "?" || cmd === "man") {
      return reply(
        out("  whoami     the short version"),
        out("  stack      daily drivers"),
        out("  history    the road so far"),
        out("  test       run the suite again"),
        out("  bugs       bug hunt status"),
        out("  shoot      open the viewfinder"),
        out("  contact    how to reach me"),
        out("  clear      wipe the screen"),
        out("  …and a few that aren't listed.", "dim")
      );
    }

    if (cmd === "whoami") {
      return reply(
        out("Jonny Porter — QA Engineer @ Bonterra, photographer, founder of Oovra."),
        out("Meridian, Idaho. Notices the small stuff.", "dim")
      );
    }

    if (cmd === "stack") {
      return reply(
        out("Playwright · TypeScript · GitHub Actions · TestRail", "accent"),
        out("also fluent in: Cypress, Selenium, Espresso, K6, Azure DevOps", "dim")
      );
    }

    if (cmd === "history" || cmd === "experience" || cmd === "cv") {
      return reply(
        out("  2025 → now   QA Engineer @ Bonterra", "green"),
        out("  2022 → 2025  QA Automation Engineer @ QualityLogic"),
        out("  2021 → 2022  Accessibility Tester @ QualityLogic"),
        out("  2020 → 2021  QA Inspector @ Arrow Electronics"),
        out("  2019 → 2020  Cleanroom QA Inspector @ Plexus"),
        out("  full story is right below ↓", "dim")
      );
    }

    // The scripted run types its own command, so there's nothing to echo.
    if (cmd === "test" || cmd === "run" || /^(npx|npm|pnpm|yarn|playwright)\b/.test(cmd)) {
      play();
      return;
    }

    if (cmd === "bugs" || cmd === "bug") {
      const rows = BUGS.map((b) =>
        found.includes(b.id)
          ? out(`  ✓  ${b.code}  ${b.title}`, "green")
          : out(`  ·  ${b.code}  still loose ${b.hint}`, "dim")
      );
      return reply(
        out(`${found.length}/${BUGS.length} filed. They're hiding on this page; click one to squash it.`),
        ...rows,
        ...(found.length ? [out("  `bugs --reset` releases them again", "dim")] : [])
      );
    }

    if (cmd === "bugs --reset" || cmd === "bugs reset") {
      reset();
      return reply(out("Released. They're back in the wild.", "accent"));
    }

    if (["shoot", "photo", "photos", "camera", "viewfinder"].includes(cmd)) {
      scrollToId("photography");
      return reply(out("opening viewfinder…", "accent"));
    }

    if (["contact", "email", "mail", "hire"].includes(cmd)) {
      return reply(
        out("jonny@oovra.net", "accent"),
        out("or `cd contact` — there's a form down there", "dim")
      );
    }

    if (cmd === "ls" || cmd === "ls -la" || cmd === "dir") {
      return reply(out(SECTIONS.map((s) => `${s}/`).join("  ")));
    }

    if (cmd.startsWith("cd ")) {
      const target = cmd.slice(3).replace(/[#/.~\s]/g, "");
      if (SECTIONS.includes(target)) {
        scrollToId(target);
        return reply(out(`→ ${target}/`, "accent"));
      }
      return reply(out(`cd: no such section: ${input.slice(3)}. try \`ls\``));
    }

    if (cmd.startsWith("sudo")) {
      if (cmd.includes("hire")) {
        scrollToId("contact");
        return reply(
          out("[sudo] permission granted.", "green"),
          out("opening contact…", "accent")
        );
      }
      return reply(out("nice try. this incident will be reported (to no one)."));
    }

    if (cmd.startsWith("rm ")) {
      return reply(
        out("nope. filed as BUG-000: tester attempts destructive action (expected behavior).")
      );
    }

    if (cmd === "exit" || cmd === "quit" || cmd === ":q" || cmd === ":wq") {
      return reply(out("there is no exit. only regression tests."));
    }

    if (["hi", "hello", "hey", "yo"].includes(cmd)) {
      return reply(out("hey. try `help`, or `sudo hire jonny` if you're in a hurry."));
    }

    return reply(out(`command not found: ${input}. try \`help\``));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    exec(value);
    setValue("");
  };

  const onKeyDown = (e) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    const h = history.current;
    if (!h.length) return;
    e.preventDefault();
    const dir = e.key === "ArrowUp" ? 1 : -1;
    historyIdx.current = Math.max(-1, Math.min(h.length - 1, historyIdx.current + dir));
    setValue(historyIdx.current === -1 ? "" : h[historyIdx.current]);
  };

  const focusInput = () => {
    if (window.getSelection()?.toString()) return;
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="terminal-wrap" ref={rootRef}>
      <div className="terminal">
        <div className="terminal-chrome">
          <span className="dot-x red" />
          <span className="dot-x yellow" />
          <span className="dot-x green" />
          <span className="terminal-title">
            <TerminalIcon size={12} /> ~ /e2e
          </span>
        </div>
        <div
          className="terminal-body"
          ref={bodyRef}
          onClick={focusInput}
          role="log"
          aria-live={busy ? "off" : "polite"}
          aria-label="Interactive terminal"
        >
          {lines.map((line, i) =>
            line.type === "cmd" ? (
              <div className="terminal-line" key={i}>
                <span className="terminal-prompt">$</span>
                <span className="terminal-cmd">{line.text}</span>
              </div>
            ) : (
              <div className={`terminal-line out ${line.color}`} key={i}>
                {line.text || " "}
              </div>
            )
          )}

          {typing !== null && (
            <div className="terminal-line" aria-hidden="true">
              <span className="terminal-prompt">$</span>
              <span className="terminal-cmd">{typing}</span>
              <span className="terminal-caret" />
            </div>
          )}

          {!busy && (
            <form className="terminal-line terminal-form" onSubmit={onSubmit}>
              <label className="terminal-prompt" htmlFor="terminal-input">
                $<span className="sr-only"> Type a command</span>
              </label>
              <input
                id="terminal-input"
                ref={inputRef}
                className="terminal-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="type a command"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="go"
              />
            </form>
          )}
        </div>
        <Bug id="machine" className="terminal-bug" />
      </div>

      <div className="terminal-chips" aria-label="Try a command">
        <span className="terminal-chips-label">try</span>
        {CHIPS.map((c) => (
          <button
            key={c}
            type="button"
            disabled={busy}
            onClick={() => exec(c)}
            data-cursor
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
