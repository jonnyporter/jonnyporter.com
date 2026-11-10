import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ArrowUpRight, Check, X } from "lucide-react";
import "./BugHunt.css";

/**
 * A QA engineer's easter egg: five beetles are hiding around the site.
 * Click one to "file" it. Progress lives in localStorage and shows up in a
 * small tracker (and in the terminal via the `bugs` command).
 */
export const BUGS = [
  { id: "kpi", code: "BUG-001", title: "Infinity is not a measurable KPI", hint: "near the hero stats" },
  { id: "machine", code: "BUG-002", title: "Works on my machine", hint: "on the terminal window" },
  { id: "lens", code: "BUG-003", title: "Literal bug on the lens", hint: "inside the viewfinder" },
  { id: "staging", code: "BUG-004", title: "Escaped from the staging environment", hint: "around the booking cards" },
  { id: "backlog", code: "BUG-005", title: "Buried at the bottom of the backlog", hint: "down in the footer" },
];

const STORAGE_KEY = "jp-bug-hunt";
const BugHuntContext = createContext(null);

export function useBugHunt() {
  return (
    useContext(BugHuntContext) || {
      found: [],
      squash: () => {},
      reset: () => {},
      lastFound: null,
    }
  );
}

export function BugHuntProvider({ children }) {
  const [found, setFound] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [lastFound, setLastFound] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) {
        setFound(saved.filter((id) => BUGS.some((b) => b.id === id)));
      }
    } catch {
      /* private mode or bad JSON: start fresh */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    } catch {
      /* storage unavailable: progress just won't persist */
    }
  }, [found, loaded]);

  const squash = useCallback((id) => {
    setFound((f) => (f.includes(id) ? f : [...f, id]));
    setLastFound({ id, at: Date.now() });
  }, []);

  const reset = useCallback(() => {
    setFound([]);
    setLastFound(null);
  }, []);

  const value = useMemo(
    () => ({ found, squash, reset, lastFound }),
    [found, squash, reset, lastFound]
  );

  return (
    <BugHuntContext.Provider value={value}>{children}</BugHuntContext.Provider>
  );
}

/** One hidden beetle. Position it with `className` / `style` from the host section. */
export function Bug({ id, className = "", style }) {
  const { found, squash } = useBugHunt();
  const [squashing, setSquashing] = useState(false);

  if (found.includes(id) && !squashing) return null;

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (squashing) return;
    setSquashing(true);
    squash(id);
    window.setTimeout(() => setSquashing(false), 650);
  };

  return (
    <button
      type="button"
      className={`bug ${squashing ? "squashed" : ""} ${className}`.trim()}
      style={style}
      onClick={onClick}
      aria-label="A hidden bug. Squash it."
      data-cursor
      data-cursor-text="Squash"
    >
      <BugIcon />
    </button>
  );
}

export function BugTracker() {
  const { found, reset, lastFound } = useBugHunt();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const total = BUGS.length;
  const done = found.length === total;

  useEffect(() => {
    if (!lastFound) return;
    const bug = BUGS.find((b) => b.id === lastFound.id);
    if (!bug) return;
    setToast(bug);
    const t = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(t);
  }, [lastFound]);

  // Finding the last one pops the full report open.
  useEffect(() => {
    if (lastFound && done) setOpen(true);
  }, [lastFound, done]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (found.length === 0) return null;

  return (
    <div className="bug-tracker">
      <div className="bug-toast-slot" aria-live="polite">
        {toast && !open && (
          <div className="bug-toast" key={toast.id}>
            <span className="bug-toast-code">{toast.code} filed</span>
            <span className="bug-toast-title">{toast.title}</span>
          </div>
        )}
      </div>

      {open && (
        <div className="bug-panel" role="dialog" aria-label="Bug hunt progress">
          <div className="bug-panel-head">
            <span>
              {done ? "Zero open defects" : "Bug hunt"}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close bug hunt panel"
              data-cursor
            >
              <X size={14} />
            </button>
          </div>
          <ul className="bug-list">
            {BUGS.map((b) => {
              const got = found.includes(b.id);
              return (
                <li key={b.id} className={got ? "got" : ""}>
                  <span className="bug-list-mark">
                    {got ? <Check size={12} /> : "?"}
                  </span>
                  <span className="bug-list-body">
                    <strong>{b.code}</strong>
                    <span>{got ? b.title : `Still loose ${b.hint}`}</span>
                  </span>
                </li>
              );
            })}
          </ul>
          {done ? (
            <div className="bug-panel-foot done">
              <p>
                All {total} filed. You notice the small stuff. So do I.
              </p>
              <a href="#contact" onClick={() => setOpen(false)} data-cursor>
                Let's talk <ArrowUpRight size={14} />
              </a>
            </div>
          ) : (
            <div className="bug-panel-foot">
              <p>{total - found.length} still crawling around this page.</p>
            </div>
          )}
          <button type="button" className="bug-reset" onClick={reset} data-cursor>
            Release them and start over
          </button>
        </div>
      )}

      <button
        type="button"
        className={`bug-pill ${done ? "done" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Bug hunt: ${found.length} of ${total} found`}
        data-cursor
      >
        <BugIcon />
        <span>
          {found.length}/{total}
        </span>
      </button>
    </div>
  );
}

export function BugIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <g className="bug-legs">
        <path d="M7.5 10.5 3.5 8.5" />
        <path d="M7 14H3" />
        <path d="M7.5 17.5 4 20" />
        <path d="M16.5 10.5 20.5 8.5" />
        <path d="M17 14h4" />
        <path d="M16.5 17.5 20 20" />
      </g>
      <path d="M9.5 6 8 3.5M14.5 6 16 3.5" />
      <path
        d="M12 6.5c2.8 0 5 2.6 5 7s-2.2 7-5 7-5-2.6-5-7 2.2-7 5-7Z"
        fill="currentColor"
        fillOpacity="0.22"
      />
      <path d="M12 9v11.5M8 9.5h8" />
    </svg>
  );
}
