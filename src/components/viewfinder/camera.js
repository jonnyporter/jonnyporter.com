/**
 * Camera math for the viewfinder: the stops on each dial, how the light
 * changes through the evening, and how settings turn into what the shader
 * draws. Exposure follows the real formula:
 *
 *   EV = log2(N² / t) − log2(ISO / 100)
 *
 * so the numbers that balance the meter here are the ones that would work
 * on location (sunny-16 at midday, f/2.8 · 15s · ISO 3200 for the stars).
 */

export const APERTURES = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];
export const SHUTTERS = [
  1 / 4000, 1 / 2000, 1 / 1000, 1 / 500, 1 / 250, 1 / 125, 1 / 60, 1 / 30,
  1 / 15, 1 / 8, 1 / 4, 1 / 2, 1, 2, 4, 8, 15, 30,
];
export const ISOS = [100, 200, 400, 800, 1600, 3200, 6400];

const hex = (h) => [
  parseInt(h.slice(1, 3), 16) / 255,
  parseInt(h.slice(3, 5), 16) / 255,
  parseInt(h.slice(5, 7), 16) / 255,
];

// `ev` is the scene's brightness: the EV (at ISO 100) that exposes it properly.
const LIGHT = [
  { t: 0.0, name: "Midday", ev: 15, skyTop: "#2c6fc7", skyHor: "#a9d2f0", sun: "#fff4d6", haze: "#b8d6ec", far: "#7f9cb8", near: "#1f3a2c", water: "#3a6d95", snow: "#f2f6fb", sunX: 0.3, sunY: 1.25, sunVis: 1, glow: 0.55, stars: 0, lights: 0, alpen: 0, cloud: 0.45, amb: 1 },
  { t: 0.3, name: "Afternoon", ev: 14.3, skyTop: "#3474c6", skyHor: "#c2daeb", sun: "#ffefc4", haze: "#c3d7e4", far: "#8399b0", near: "#21392b", water: "#43739a", snow: "#f6f2ea", sunX: 0.44, sunY: 0.9, sunVis: 1, glow: 0.7, stars: 0, lights: 0, alpen: 0.05, cloud: 0.5, amb: 0.95 },
  { t: 0.5, name: "Golden hour", ev: 12, skyTop: "#3a5a9a", skyHor: "#f5b469", sun: "#ffc267", haze: "#eeb482", far: "#b5855f", near: "#2a221a", water: "#75676e", snow: "#ffe2b8", sunX: 0.55, sunY: 0.76, sunVis: 1, glow: 1, stars: 0, lights: 0, alpen: 0.45, cloud: 0.7, amb: 0.85 },
  { t: 0.62, name: "Sunset", ev: 10, skyTop: "#2b3369", skyHor: "#f07a50", sun: "#ff8647", haze: "#d67c66", far: "#86525e", near: "#1b131a", water: "#57435e", snow: "#ffb294", sunX: 0.61, sunY: 0.6, sunVis: 1, glow: 1, stars: 0.03, lights: 0.35, alpen: 1, cloud: 0.8, amb: 0.6 },
  { t: 0.74, name: "Blue hour", ev: 5.5, skyTop: "#111b47", skyHor: "#4b4f8d", sun: "#c26b7c", haze: "#38447a", far: "#27335f", near: "#090d1c", water: "#1c264f", snow: "#7582bd", sunX: 0.66, sunY: 0.42, sunVis: 0, glow: 0.6, stars: 0.3, lights: 1, alpen: 0.25, cloud: 0.45, amb: 0.32 },
  { t: 0.88, name: "Nightfall", ev: -1, skyTop: "#070b21", skyHor: "#151d43", sun: "#3b4b82", haze: "#121a3b", far: "#0e1531", near: "#04060e", water: "#0a1029", snow: "#2a3566", sunX: 0.7, sunY: 0.2, sunVis: 0, glow: 0.25, stars: 0.85, lights: 1, alpen: 0, cloud: 0.15, amb: 0.16 },
  { t: 1.0, name: "Night", ev: -6, skyTop: "#070b20", skyHor: "#172050", sun: "#4a4f8f", haze: "#111a42", far: "#0d1433", near: "#020308", water: "#090e25", snow: "#2b3870", sunX: 0.72, sunY: 0.3, sunVis: 0, glow: 0.22, stars: 1, lights: 0.85, alpen: 0, cloud: 0.1, amb: 0.1 },
].map((k) => ({
  ...k,
  skyTop: hex(k.skyTop),
  skyHor: hex(k.skyHor),
  sun: hex(k.sun),
  haze: hex(k.haze),
  far: hex(k.far),
  near: hex(k.near),
  water: hex(k.water),
  snow: hex(k.snow),
}));

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/** Light at time-of-day `tod` (0 = midday … 1 = deep night). */
export function lightAt(tod) {
  const t = clamp(tod, 0, 1);
  let i = 0;
  while (i < LIGHT.length - 2 && t > LIGHT[i + 1].t) i++;
  const a = LIGHT[i];
  const b = LIGHT[i + 1];
  const f = (t - a.t) / (b.t - a.t);
  const out = { name: f < 0.5 ? a.name : b.name };
  for (const key of Object.keys(a)) {
    if (key === "t" || key === "name") continue;
    out[key] = Array.isArray(a[key])
      ? a[key].map((v, n) => lerp(v, b[key][n], f))
      : lerp(a[key], b[key], f);
  }
  return out;
}

export const cameraEV = ({ ap, sh, iso }) =>
  Math.log2((APERTURES[ap] * APERTURES[ap]) / SHUTTERS[sh]) -
  Math.log2(ISOS[iso] / 100);

/** Stops over (+) or under (−) a balanced exposure. */
export const exposureDelta = (settings) =>
  lightAt(settings.tod).ev - cameraEV(settings);

/** Everything the shader needs for one frame, as plain numbers / arrays. */
export function lookFor(settings) {
  const light = lightAt(settings.tod);
  const fnum = APERTURES[settings.ap];
  const t = SHUTTERS[settings.sh];
  const iso = ISOS[settings.iso];
  return {
    ...light,
    focus: settings.focus,
    coc: 0.085 / fnum,
    sunstar: clamp((fnum - 5.6) / (16 - 5.6), 0, 1),
    stops: clamp(light.ev - cameraEV(settings), -9, 9),
    smooth: clamp(Math.log2(t * 30) / 7, 0, 1),
    trail: clamp(Math.log2(t / 4) / 3, 0, 1),
    grain: 0.012 * Math.sqrt(iso / 100),
    vignette: 0.18 + 0.4 * (1 - clamp((fnum - 1.4) / (5.6 - 1.4), 0, 1)),
  };
}

/** Ease `current` toward `target` in place. Returns true once they match. */
export function easeLook(current, target, amount) {
  let settled = true;
  for (const key of Object.keys(target)) {
    const to = target[key];
    if (typeof to === "string") {
      current[key] = to;
    } else if (Array.isArray(to)) {
      const from = current[key];
      for (let i = 0; i < to.length; i++) {
        from[i] += (to[i] - from[i]) * amount;
        if (Math.abs(to[i] - from[i]) > 0.002) settled = false;
      }
    } else {
      current[key] += (to - current[key]) * amount;
      if (Math.abs(to - current[key]) > 0.002) settled = false;
      else current[key] = to;
    }
  }
  return settled;
}

export const cloneLook = (look) =>
  Object.fromEntries(
    Object.entries(look).map(([k, v]) => [k, Array.isArray(v) ? [...v] : v])
  );

/** Aperture-priority: pick the shutter (then ISO) that balances the meter. */
export function autoExpose(settings) {
  const scene = lightAt(settings.tod).ev;
  let best = { ...settings, iso: 0 };
  let bestErr = Infinity;
  for (let iso = 0; iso < ISOS.length; iso++) {
    for (let sh = 0; sh < SHUTTERS.length; sh++) {
      const candidate = { ...settings, sh, iso };
      const err = Math.abs(scene - cameraEV(candidate));
      // Prefer the lowest ISO that gets within a third of a stop.
      if (err < bestErr - 0.01) {
        bestErr = err;
        best = candidate;
      }
    }
    if (bestErr <= 0.34) break;
  }
  return best;
}

export const fmtAperture = (i) => `f/${APERTURES[i]}`;

export const fmtShutter = (i) => {
  const t = SHUTTERS[i];
  return t < 1 ? `1/${Math.round(1 / t)}s` : `${t}s`;
};

export const fmtISO = (i) => `ISO ${ISOS[i]}`;

export const fmtStops = (d) => {
  const v = Math.round(d * 10) / 10;
  if (v === 0) return "±0.0";
  return `${v > 0 ? "+" : "−"}${Math.abs(v).toFixed(1)}`;
};

export const fmtFocus = (f) => {
  if (f < 0.18) return "Reeds · 1 m";
  if (f < 0.42) return "Near shore";
  if (f < 0.62) return "Far shore";
  if (f < 0.86) return "Treeline";
  return "Peaks · ∞";
};

export const PRESETS = [
  {
    id: "golden",
    label: "Golden hour",
    note: "f/8, everything sharp, sun still above the ridge.",
    settings: { tod: 0.5, ap: 5, sh: 6, iso: 0, focus: 0.9 },
  },
  {
    id: "shallow",
    label: "Shallow focus",
    note: "Wide open on the lilies. The Sawtooths melt.",
    settings: { tod: 0.5, ap: 0, sh: 1, iso: 0, focus: 0.04 },
  },
  {
    id: "silky",
    label: "Silky water",
    note: "Blue hour, four seconds on a tripod.",
    settings: { tod: 0.755, ap: 6, sh: 14, iso: 0, focus: 0.85 },
  },
  {
    id: "astro",
    label: "Astro",
    note: "f/2.8 · 15s · ISO 3200. Hello, Milky Way.",
    settings: { tod: 1, ap: 2, sh: 16, iso: 5, focus: 1 },
  },
];

export const INITIAL = { tod: 0.57, ap: 4, sh: 6, iso: 0, focus: 0.9 };
