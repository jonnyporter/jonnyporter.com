import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Aperture,
  Crosshair,
  Gauge,
  Lightbulb,
  Sun,
  Timer,
  Trash2,
  Wand2,
} from "lucide-react";
import Reveal from "../Reveal.jsx";
import { Bug } from "../BugHunt.jsx";
import { useInView, usePrefersReducedMotion } from "../../lib/hooks.js";
import { createRenderer } from "../viewfinder/shader.js";
import {
  APERTURES,
  INITIAL,
  ISOS,
  PRESETS,
  SHUTTERS,
  autoExpose,
  cloneLook,
  easeLook,
  exposureDelta,
  fmtAperture,
  fmtFocus,
  fmtISO,
  fmtShutter,
  fmtStops,
  lightAt,
  lookFor,
} from "../viewfinder/camera.js";
import "./Viewfinder.css";

const MAX_FRAMES = 6;
const NAILED = 0.4; // within ±0.4 stops counts as a balanced exposure

const NOTES = [
  {
    icon: <Aperture size={18} />,
    title: "Aperture",
    kicker: "decides depth",
    body: "How much of the scene gets to be sharp. Wide open isolates one thing and melts the rest. Stopped down keeps the whole valley crisp, and gives the sun a starburst.",
  },
  {
    icon: <Timer size={18} />,
    title: "Shutter",
    kicker: "decides time",
    body: "How much time lands in the frame. Fast freezes every ripple. Slow turns a lake to glass, drags the clouds, and eventually pulls stars into streaks.",
  },
  {
    icon: <Gauge size={18} />,
    title: "ISO",
    kicker: "borrowed light",
    body: "It rescues a dark scene when the other two are out of room. It also charges interest, and the interest is grain.",
  },
];

function coach(settings, delta, light) {
  const stops = Math.round(Math.abs(delta) * 10) / 10;
  const n =
    stops >= 9 ? "9+ stops" : `${stops} ${stops === 1 ? "stop" : "stops"}`;
  if (delta > NAILED) {
    return `Overexposed by ${n}. Try a faster shutter, a smaller aperture, or lower ISO.`;
  }
  if (delta < -NAILED) {
    return `Underexposed by ${n}. Slow the shutter, open the aperture, or raise ISO.`;
  }
  const fnum = APERTURES[settings.ap];
  const t = SHUTTERS[settings.sh];
  if (t >= 8 && light.stars > 0.5) {
    return "Balanced. Past about 15 seconds the stars stop being points and start to trail.";
  }
  if (t >= 0.5) {
    return "Balanced. A shutter this slow turns the lake to glass (tripod assumed).";
  }
  if (fnum <= 2 && settings.focus < 0.3) {
    return "Balanced. Wide open and focused close: the lilies are sharp, the peaks are paint.";
  }
  if (fnum >= 11 && light.sunVis > 0.5 && light.sunY < 0.95) {
    return "Balanced. Stopped down this far, the sun grows a starburst.";
  }
  if (ISOS[settings.iso] >= 3200) {
    return "Balanced, but look at the shadows. High ISO pays for its light in grain.";
  }
  return "Balanced. That's the shot. Press the shutter.";
}

export default function Viewfinder() {
  const [settings, setSettings] = useState(INITIAL);
  const [frames, setFrames] = useState([]);
  const [shooting, setShooting] = useState(false);
  const [flash, setFlash] = useState(0);
  const [supported, setSupported] = useState(true);
  const [ready, setReady] = useState(false);

  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const targetRef = useRef(null);
  const currentRef = useRef(null);
  const parallaxRef = useRef({ target: 0, current: 0 });
  const frameCount = useRef(0);
  const startRef = useRef(null);
  const drawNowRef = useRef(() => {});

  const inView = useInView(stageRef, { amount: 0.05 });
  // The shader only compiles once the camera is about to scroll into view.
  const near = useInView(stageRef, { amount: 0, once: true, margin: "700px 0px" });
  const reducedMotion = usePrefersReducedMotion();

  const light = useMemo(() => lightAt(settings.tod), [settings.tod]);
  const delta = exposureDelta(settings);
  const nailed = Math.abs(delta) <= NAILED;
  const tip = coach(settings, delta, light);

  // The render loop reads from refs so slider drags never restart it.
  targetRef.current = lookFor(settings);
  if (!currentRef.current) currentRef.current = cloneLook(targetRef.current);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!near || !canvas || !stage) return;

    const renderer = createRenderer(canvas);
    rendererRef.current = renderer;
    if (!renderer) {
      setSupported(false);
      return;
    }
    setReady(true);

    const fit = () => {
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.min(1500, Math.round(rect.width * dpr));
      const height = Math.round((width * rect.height) / Math.max(1, rect.width));
      renderer.resize(Math.max(2, width), Math.max(2, height), dpr);
      drawNowRef.current();
    };

    const ro = new ResizeObserver(fit);
    ro.observe(stage);
    fit();

    return () => {
      ro.disconnect();
      drawNowRef.current = () => {};
      renderer.destroy();
      rendererRef.current = null;
      setReady(false);
    };
  }, [near]);

  // Animate only while the viewfinder is on screen and the tab is visible.
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    // One clock for the component's lifetime, so the water doesn't jump
    // each time the loop pauses and resumes.
    if (startRef.current === null) startRef.current = performance.now();
    const start = startRef.current;
    const par = parallaxRef.current;

    const drawStill = () => {
      Object.assign(currentRef.current, cloneLook(targetRef.current));
      renderer.draw(currentRef.current, 12, 0);
    };

    if (reducedMotion) {
      drawNowRef.current = drawStill;
      drawStill();
      return;
    }

    let raf = 0;
    const frame = (now) => {
      easeLook(currentRef.current, targetRef.current, 0.14);
      par.current += (par.target - par.current) * 0.06;
      renderer.draw(currentRef.current, (now - start) / 1000, par.current);
      raf = requestAnimationFrame(frame);
    };

    drawNowRef.current = () =>
      renderer.draw(currentRef.current, (performance.now() - start) / 1000, par.current);

    const sync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (inView && !document.hidden) raf = requestAnimationFrame(frame);
    };
    sync();
    document.addEventListener("visibilitychange", sync);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [inView, reducedMotion, ready]);

  // With motion reduced there is no loop, so redraw whenever a dial moves.
  useEffect(() => {
    if (reducedMotion) drawNowRef.current();
  }, [settings, reducedMotion]);

  const set = (key) => (e) =>
    setSettings((s) => ({ ...s, [key]: Number(e.target.value) }));

  const onPointerMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    parallaxRef.current.target = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
  };

  const capture = useCallback(() => {
    const renderer = rendererRef.current;
    const canvas = canvasRef.current;
    if (!renderer || !canvas || shooting) return;

    const shot = settings;
    const shotDelta = exposureDelta(shot);
    // The blackout scales with shutter speed, capped so nobody waits 30s.
    const hold = Math.round(Math.min(1300, 130 + SHUTTERS[shot.sh] * 300));
    setShooting(true);

    window.setTimeout(() => {
      // Snap to the exact settings, draw, and copy the pixels in the same
      // task (the WebGL buffer is cleared once the browser composites).
      Object.assign(currentRef.current, cloneLook(lookFor(shot)));
      drawNowRef.current();
      const thumb = document.createElement("canvas");
      thumb.width = 480;
      thumb.height = Math.round((480 * canvas.height) / canvas.width);
      thumb.getContext("2d").drawImage(canvas, 0, 0, thumb.width, thumb.height);

      frameCount.current += 1;
      setFrames((f) =>
        [
          {
            id: frameCount.current,
            url: thumb.toDataURL("image/jpeg", 0.84),
            settings: shot,
            delta: shotDelta,
            scene: lightAt(shot.tod).name,
          },
          ...f,
        ].slice(0, MAX_FRAMES)
      );
      setShooting(false);
      setFlash((n) => n + 1);
    }, hold);
  }, [settings, shooting]);

  const keepers = frames.filter((f) => Math.abs(f.delta) <= NAILED).length;
  const meterPos = Math.max(-3.25, Math.min(3.25, delta));
  const activePreset = PRESETS.find((p) =>
    Object.keys(p.settings).every((k) => p.settings[k] === settings[k])
  );

  return (
    <section id="photography" className="vf">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">02 · The Photographer</span>
          <h2 className="section-title">
            Don't take my word for it.{" "}
            <span className="serif-italic gradient-text">Take the shot.</span>
          </h2>
          <p className="section-lede">
            No wall of photos here. Instead, a camera. This lake is drawn live
            in your browser and reacts to light the way a real one does. Dial
            in the exposure like I would on location, then press the shutter.
          </p>
        </Reveal>

        <Reveal className="vf-rig">
          <div className="vf-camera">
            <div
              className={`vf-stage ${nailed ? "nailed" : ""} ${shooting ? "shooting" : ""}`}
              ref={stageRef}
              onPointerMove={onPointerMove}
              onPointerLeave={() => (parallaxRef.current.target = 0)}
            >
              <canvas
                ref={canvasRef}
                role="img"
                aria-label={`Simulated camera view of a mountain lake at ${light.name.toLowerCase()}. ${tip}`}
              />

              {!supported && (
                <div className="vf-fallback">
                  <p>
                    The camera needs WebGL, and this browser has it switched
                    off. The booking info below works either way.
                  </p>
                </div>
              )}

              <div className="vf-hud" aria-hidden="true">
                <span className="vf-corner tl" />
                <span className="vf-corner tr" />
                <span className="vf-corner bl" />
                <span className="vf-corner br" />
                <span className="vf-reticle" />

                <div className="vf-hud-top">
                  <span className="vf-live">
                    <i /> Live · {light.name}
                  </span>
                  <span>
                    RAW · {String(frames.length).padStart(2, "0")}/
                    {String(MAX_FRAMES).padStart(2, "0")}
                  </span>
                </div>

                <div className="vf-hud-bottom">
                  <span>{fmtAperture(settings.ap)}</span>
                  <span>{fmtShutter(settings.sh)}</span>
                  <span>{fmtISO(settings.iso)}</span>
                  <span className="vf-meter">
                    <span className="vf-meter-scale">
                      <b style={{ left: `${50 + (meterPos / 3.25) * 50}%` }} />
                    </span>
                    <span className="vf-meter-read">{fmtStops(delta)}</span>
                  </span>
                </div>
              </div>

              <div className="vf-blackout" aria-hidden="true">
                {SHUTTERS[settings.sh] >= 1 && (
                  <span>exposing {fmtShutter(settings.sh)}</span>
                )}
              </div>
              {flash > 0 && <div className="vf-flash" key={flash} aria-hidden="true" />}

              <Bug id="lens" className="vf-bug" />
            </div>

            <p className="vf-caption">
              Somewhere near Stanley, Idaho. 100% generated, 0 pixels
              photographed.
            </p>
          </div>

          <div className="vf-panel">
            <div className="vf-presets" role="group" aria-label="How I'd shoot it">
              <span className="vf-label">How I'd shoot it</span>
              <div className="vf-preset-row">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={activePreset?.id === p.id ? "active" : ""}
                    aria-pressed={activePreset?.id === p.id}
                    onClick={() => setSettings(p.settings)}
                    title={p.note}
                    data-cursor
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <Dial
              icon={<Sun size={15} />}
              label="Light"
              value={light.name}
              min={0}
              max={1}
              step={0.005}
              current={settings.tod}
              onChange={set("tod")}
              ends={["Midday", "Night"]}
            />
            <Dial
              icon={<Aperture size={15} />}
              label="Aperture"
              value={fmtAperture(settings.ap)}
              min={0}
              max={APERTURES.length - 1}
              step={1}
              current={settings.ap}
              onChange={set("ap")}
              ends={["Wide", "Narrow"]}
            />
            <Dial
              icon={<Timer size={15} />}
              label="Shutter"
              value={fmtShutter(settings.sh)}
              min={0}
              max={SHUTTERS.length - 1}
              step={1}
              current={settings.sh}
              onChange={set("sh")}
              ends={["Fast", "Slow"]}
            />
            <Dial
              icon={<Gauge size={15} />}
              label="ISO"
              value={String(ISOS[settings.iso])}
              valueText={fmtISO(settings.iso)}
              min={0}
              max={ISOS.length - 1}
              step={1}
              current={settings.iso}
              onChange={set("iso")}
              ends={["Clean", "Grainy"]}
            />
            <Dial
              icon={<Crosshair size={15} />}
              label="Focus"
              value={fmtFocus(settings.focus)}
              min={0}
              max={1}
              step={0.01}
              current={settings.focus}
              onChange={set("focus")}
              ends={["Near", "Far"]}
            />

            <p className={`vf-coach ${nailed ? "ok" : ""}`} aria-live="polite">
              <Lightbulb size={15} aria-hidden="true" />
              <span>{tip}</span>
            </p>

            <div className="vf-actions">
              <button
                type="button"
                className="vf-auto"
                onClick={() => setSettings((s) => autoExpose(s))}
                disabled={nailed}
                data-cursor
              >
                <Wand2 size={15} /> Meter it for me
              </button>
              <button
                type="button"
                className="vf-shutter"
                onClick={capture}
                disabled={shooting || !ready}
                aria-label="Press the shutter"
                data-cursor
                data-cursor-text="Click"
              >
                <span />
              </button>
            </div>
          </div>

          <div className="vf-strip">
            <div className="vf-strip-head">
              <span className="vf-label">
                <span>Your contact sheet</span>
                {frames.length > 0 && (
                  <span className="vf-strip-count">
                    {frames.length} frame{frames.length === 1 ? "" : "s"} ·{" "}
                    {keepers} keeper{keepers === 1 ? "" : "s"}
                  </span>
                )}
              </span>
              {frames.length > 0 && (
                <button type="button" onClick={() => setFrames([])} data-cursor>
                  <Trash2 size={13} /> Clear the roll
                </button>
              )}
            </div>
            <ol className="vf-film">
              {Array.from({ length: MAX_FRAMES }).map((_, i) => {
                const f = frames[i];
                if (!f) {
                  return (
                    <li key={`empty-${i}`} className="vf-frame empty">
                      <span>{i === frames.length ? "Press the shutter" : "Unexposed"}</span>
                    </li>
                  );
                }
                const ok = Math.abs(f.delta) <= NAILED;
                return (
                  <li key={f.id} className="vf-frame">
                    <button
                      type="button"
                      onClick={() => setSettings(f.settings)}
                      aria-label={`Frame ${f.id}: ${f.scene}, ${fmtAperture(f.settings.ap)}, ${fmtShutter(f.settings.sh)}, ${fmtISO(f.settings.iso)}. Load these settings.`}
                      data-cursor
                      data-cursor-text="Load"
                    >
                      <img src={f.url} alt="" />
                      <span className={`vf-frame-tag ${ok ? "ok" : ""}`}>
                        {ok ? "Keeper" : `${fmtStops(f.delta)} EV`}
                      </span>
                      <span className="vf-frame-num">
                        {String(f.id).padStart(2, "0")}
                      </span>
                      <span className="vf-frame-meta">
                        {fmtAperture(f.settings.ap)} · {fmtShutter(f.settings.sh)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </Reveal>

        <div className="vf-notes">
          {NOTES.map((n, i) => (
            <Reveal key={n.title} className="vf-note" delay={i * 70}>
              <span className="vf-note-icon">{n.icon}</span>
              <h3>
                {n.title} <span className="serif-italic">{n.kicker}</span>
              </h3>
              <p>{n.body}</p>
            </Reveal>
          ))}
        </div>

        <p className="vf-cta">
          Want this eye on a real shoot?{" "}
          <a href="#services" className="link">
            Check booking →
          </a>
        </p>
      </div>
    </section>
  );
}

function Dial({ icon, label, value, valueText, min, max, step, current, onChange, ends }) {
  const id = `vf-${label.toLowerCase()}`;
  const pct = ((current - min) / (max - min)) * 100;
  return (
    <div className="vf-dial">
      <div className="vf-dial-head">
        <label htmlFor={id}>
          {icon} {label}
        </label>
        <output htmlFor={id}>{value}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={onChange}
        aria-valuetext={valueText || value}
        style={{ "--pct": `${pct}%` }}
      />
      <div className="vf-dial-ends" aria-hidden="true">
        <span>{ends[0]}</span>
        <span>{ends[1]}</span>
      </div>
    </div>
  );
}
