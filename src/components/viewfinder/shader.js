/**
 * The viewfinder scene: a mountain lake, drawn entirely in one fragment
 * shader. No textures, no photographs. Depth of field, long-exposure
 * smoothing, star trails, sensor grain and exposure are all computed per
 * pixel from the camera settings.
 */

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;
uniform float uPx;
uniform float uTime;
uniform float uPar;

// Light (interpolated from the time-of-day keyframes in camera.js)
uniform vec3 uSkyTop;
uniform vec3 uSkyHor;
uniform vec3 uSunCol;
uniform vec3 uHaze;
uniform vec3 uFar;
uniform vec3 uNear;
uniform vec3 uWater;
uniform vec3 uSnow;
uniform vec2 uSun;
uniform float uSunVis;
uniform float uGlow;
uniform float uStars;
uniform float uLights;
uniform float uAlpen;
uniform float uCloud;
uniform float uAmb;

// Camera
uniform float uFocus;   // 0 = reeds at your feet, 1 = infinity
uniform float uCoc;     // circle of confusion scale, shrinks as you stop down
uniform float uStar;    // sunstar strength
uniform float uGain;    // exposure, in linear light
uniform float uSmooth;  // long-exposure smoothing 0..1
uniform float uTrail;   // star trails 0..1
uniform float uGrain;
uniform float uVig;

const float WATER = 0.23;

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise1(float x) {
  float i = floor(x);
  float f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(hash11(i), hash11(i + 1.0), f);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm1(float x) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise1(x);
    x = x * 2.03 + 17.13;
    a *= 0.5;
  }
  return v;
}

float fbm2(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise2(p);
    p = p * 2.02 + vec2(13.1, 7.7);
    a *= 0.5;
  }
  return v;
}

// Ridged noise: a jagged, Sawtooth-style skyline.
float peaks(float x) {
  float v = 0.0;
  float a = 0.55;
  for (int i = 0; i < 5; i++) {
    v += a * (1.0 - abs(2.0 * noise1(x) - 1.0));
    x = x * 2.1 + 9.7;
    a *= 0.52;
  }
  return v;
}

// 1 inside the edge, 0 outside, with a blur-wide falloff.
float soft(float d, float edge, float b) {
  return 1.0 - smoothstep(edge - b, edge + b, d);
}

vec3 sky(vec2 uv, float asp) {
  vec2 p = vec2(uv.x * asp, uv.y);
  vec2 sp = vec2(uSun.x * asp, uSun.y);
  float blur = (1.0 - uFocus) * uCoc;
  float d = distance(p, sp);

  float t = clamp((uv.y - 0.42) / 0.58, 0.0, 1.0);
  vec3 c = mix(uSkyHor, uSkyTop, pow(t, 0.8));

  // Scattering around the sun, plus the band of afterglow along the horizon.
  c += uSunCol * (0.40 * exp(-d * 2.6) + 0.32 * exp(-d * 7.5)) * uGlow;
  c += uSunCol * 0.20 * exp(-abs(uv.y - 0.52) * 8.0) * exp(-abs(p.x - sp.x) * 1.1) * uGlow;

  // Clouds. A long exposure drags them into streaks.
  vec2 cp = vec2(p.x * mix(1.1, 0.5, uSmooth) + uTime * 0.007, uv.y * 5.5 + 3.0);
  float cl = smoothstep(0.50, 0.82, fbm2(cp)) * smoothstep(0.54, 0.74, uv.y) * uCloud;
  vec3 cc = mix(mix(uSkyTop, uHaze, 0.7), uSunCol, 0.25 + 0.55 * exp(-d * 1.8) * uGlow);
  c = mix(c, cc, cl);

  if (uStars > 0.002) {
    float fade = smoothstep(0.46, 0.80, uv.y) * (1.0 - cl) * uStars;

    vec2 g = p * 64.0;
    vec2 id = floor(g);
    float h = hash21(id);
    vec2 o = (vec2(hash21(id + 3.1), hash21(id + 8.7)) - 0.5) * 0.7;
    vec2 dq = fract(g) - 0.5 - o;
    dq.x /= 1.0 + uTrail * 5.0;
    float rad = min(0.055 + blur * 22.0, 0.5);
    float s = (1.0 - smoothstep(0.0, rad, length(dq))) * step(0.78, h) * (0.055 / rad);
    float tw = 0.78 + 0.22 * sin(uTime * 2.4 + h * 60.0) * (1.0 - uSmooth);
    c += vec3(0.86, 0.92, 1.0) * s * tw * (0.5 + 4.0 * (h - 0.78)) * fade;

    // The Milky Way: only shows up once the exposure is long enough.
    vec2 mp = vec2(p.x * 0.82 + uv.y * 0.57, uv.y * 0.82 - p.x * 0.57);
    float band = exp(-pow((mp.y - 0.30) * 5.0, 2.0));
    float mw = fbm2(mp * vec2(2.6, 8.0) + 4.0) * band;
    c += (vec3(0.50, 0.58, 0.95) * mw * 0.6 + vec3(1.0, 0.82, 0.62) * mw * mw * mw * 0.9) * fade * uStars;
  }

  // Sun disc and, stopped down, its starburst.
  float r = 0.021 + blur * 0.7;
  float disc = (1.0 - smoothstep(r * 0.7, r, d)) * (0.021 / r);
  c += (uSunCol * 1.4 + 0.5) * disc * uSunVis;
  vec2 q = p - sp;
  float ang = atan(q.y, q.x);
  float spikes = pow(abs(cos(ang * 9.0)), 90.0) * exp(-d * 12.0)
               + pow(abs(cos(ang * 9.0 + 1.1)), 320.0) * exp(-d * 7.5) * 0.55;
  c += uSunCol * spikes * uStar * uSunVis * 1.4;

  return c;
}

// Sky plus five ridgelines, far to near. No water, no foreground.
vec3 scene(vec2 uv, float asp) {
  float x = uv.x * asp;
  float sunX = uSun.x * asp;
  vec3 col = sky(uv, asp);

  for (int i = 0; i < 5; i++) {
    float li = float(i);
    float t = li * 0.25;
    float z = mix(0.96, 0.5, t);
    float blur = abs(z - uFocus) * uCoc + 0.0012;
    float px = x + uPar * (1.0 - z) * 0.07 + li * 7.31;
    float h;
    vec3 lc = mix(uFar, uNear, pow(t, 1.25));

    float snow = 0.0;
    if (i < 2) {
      h = mix(0.46, 0.43, li) + mix(0.20, 0.14, li) * peaks(px * mix(1.7, 2.3, li));
      // Rock faces running down from the ridge, then snow on the high ground.
      // (Surface detail fades as the layer drifts out of focus.)
      float detail = 1.0 / (1.0 + blur * 140.0);
      float facet = noise1(px * 13.0 + (h - uv.y) * 20.0);
      lc *= mix(1.0, mix(0.80, 1.16, facet), detail);
      float line = mix(0.565, 0.53, li) + 0.03 * noise1(px * 8.0);
      snow = smoothstep(line - 0.02, line + 0.035, uv.y)
           * mix(0.7, 0.4 + 0.6 * noise2(vec2(px * 46.0, uv.y * 20.0)), detail)
           * mix(0.92, 0.6, li);
    } else {
      float k = (li - 2.0) * 0.5;
      h = mix(0.39, 0.29, k) + mix(0.10, 0.07, k) * fbm1(px * mix(1.6, 2.4, k));
      // Pine tops. They dissolve first when the layer goes out of focus.
      float tx = px * mix(72.0, 36.0, k);
      float tri = 1.0 - abs(fract(tx) - 0.5) * 2.0;
      float th = mix(0.010, 0.030, k) * (0.4 + 0.8 * hash11(floor(tx) + li * 13.0));
      h += tri * th / (1.0 + blur * blur * 60000.0);
    }

    // Aerial perspective: distant layers sink into haze, mist pools at their feet.
    float mist = 1.0 - smoothstep(h - 0.20, h, uv.y);
    lc = mix(lc, uHaze, (1.0 - t) * 0.36 + mist * mix(0.34, 0.14, t));
    lc = mix(lc, mix(uSnow, uHaze, 0.12), snow);
    float rim = smoothstep(h - 0.014 - blur, h, uv.y) * exp(-abs(x - sunX) * 2.4);
    lc += uSunCol * rim * uAlpen * 0.30;

    col = mix(col, lc, soft(uv.y, h, blur));
  }

  // Cabin lights on the far shore. Out of focus they bloom into bokeh discs.
  if (uLights > 0.002) {
    vec2 p = vec2(x, uv.y);
    float lb = abs(0.78 - uFocus) * uCoc * 0.8;
    for (int k = 0; k < 5; k++) {
      float fk = float(k);
      float lx = (k < 4) ? 0.615 + 0.028 * fk + 0.012 * hash11(fk + 2.0) : 0.205;
      vec2 lp = vec2(lx * asp + uPar * 0.035, WATER + 0.014 + 0.008 * hash11(fk + 9.0));
      float r = 0.0026 + lb;
      float dl = distance(p, lp);
      float disc = (1.0 - smoothstep(r * 0.6, r, dl)) * pow(0.0026 / r, 1.2) * 4.0
                 + exp(-dl * 70.0) * 0.18;
      col += vec3(1.0, 0.74, 0.40) * disc * uLights;
    }
  }

  return col;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec3 col;

  if (uv.y < WATER) {
    // The lake mirrors the scene. Ripples break it up; a slow shutter averages
    // them away until the water turns to glass.
    float depth = (WATER - uv.y) / WATER;
    float py = 1.0 / (0.07 + depth);
    vec2 rp = vec2((uv.x - 0.5) * asp * py * 2.6, py * 2.4 + uTime * 0.4);
    float n = noise2(rp) + 0.5 * noise2(rp * 2.3 + 5.0) - 0.75;
    float amp = (0.003 + 0.02 * depth) * mix(1.0, 0.05, uSmooth);
    vec2 ruv = vec2(uv.x + n * amp * 0.5, WATER + (WATER - uv.y) * 2.0 + n * amp * 2.4);
    ruv.y = max(ruv.y, WATER + 0.002);
    col = scene(ruv, asp);
    col = mix(col, uWater, 0.20 + 0.40 * depth) * mix(0.94, 0.74, depth);

    float glint = pow(noise2(rp * vec2(1.7, 3.1) + 11.0), mix(8.0, 1.2, uSmooth));
    float path = exp(-abs(uv.x - uSun.x) * asp * mix(16.0, 7.0, depth));
    col += uSunCol * glint * path * uSunVis * smoothstep(0.52, 0.62, uSun.y) * mix(1.5, 0.45, uSmooth);

    col = mix(col, uHaze, (1.0 - smoothstep(0.0, 0.03, WATER - uv.y)) * 0.45);
  } else {
    col = scene(uv, asp);
  }

  // Foreground: reeds and camas lilies at the water's edge.
  if (uv.y < 0.56) {
    vec2 p = vec2(uv.x * asp, uv.y);
    float blur = abs(0.04 - uFocus) * uCoc * 1.5 + 0.0009;
    float dim = mix(1.0, 0.6, clamp(blur * 30.0, 0.0, 1.0));
    vec3 reedCol = uNear * 0.55 + uSunCol * 0.05 * uAmb;
    for (int k = 0; k < 14; k++) {
      float fk = float(k);
      float r1 = hash11(fk * 1.7 + 0.31);
      float r2 = hash11(fk * 3.1 + 1.93);
      float r3 = hash11(fk * 5.3 + 4.17);
      float x0 = (k < 8) ? mix(-0.03, 0.25, r1) : mix(0.82, 1.03, r1);
      float hgt = mix(0.15, 0.46, r2) * ((k < 8) ? 1.0 : 0.78);
      float lean = (r3 - 0.5) * 0.20 + 0.010 * sin(uTime * 0.9 + fk * 1.3);
      float yy = clamp(uv.y / hgt, 0.0, 1.0);
      float xc = (x0 + lean * yy * yy) * asp - uPar * 0.05;
      float w = mix(0.0050, 0.0008, yy);
      float m = soft(abs(p.x - xc), w, blur) * soft(uv.y, hgt, blur + 0.002) * dim;
      col = mix(col, reedCol, m);

      if (r3 > 0.52) {
        vec2 fp = vec2((x0 + lean) * asp - uPar * 0.05, hgt);
        float fr = 0.010 + blur * 0.9;
        float fm = soft(distance(p, fp), fr, 0.0015 + blur * 0.35) * pow(0.010 / fr, 1.1);
        vec3 fc = mix(vec3(0.40, 0.42, 0.98), vec3(0.74, 0.58, 1.0), r1) * (0.25 + 0.95 * uAmb)
                + uSunCol * 0.12 * uAmb;
        col = mix(col, fc, fm * 0.92);
      }
    }
  }

  // Exposure happens in linear light, with a soft shoulder into clipping.
  vec3 lin = pow(max(col, 0.0), vec3(2.2)) * uGain;
  vec3 over = max(lin - 0.6, 0.0);
  lin = min(lin, 0.6) + 0.4 * (1.0 - exp(-over * 2.5));
  col = pow(lin, vec3(1.0 / 2.2));

  // Lens vignette (heavier wide open) and sensor grain (heavier at high ISO).
  vec2 vq = (uv - 0.5) * vec2(asp / 1.5, 1.0);
  col *= 1.0 - uVig * smoothstep(0.25, 0.95, length(vq) * 1.25);

  vec2 gp = floor(gl_FragCoord.xy / uPx);
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  float gn = hash21(gp + fract(uTime * 7.31) * 173.0) - 0.5;
  float gc = hash21(gp.yx * 1.3 + fract(uTime * 3.17) * 91.0) - 0.5;
  col += (vec3(gn) + vec3(gc, -gc * 0.5, gc * 0.7) * 0.5) * uGrain * mix(1.3, 0.6, lum);

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

const UNIFORMS = [
  "uRes", "uPx", "uTime", "uPar",
  "uSkyTop", "uSkyHor", "uSunCol", "uHaze", "uFar", "uNear", "uWater", "uSnow",
  "uSun", "uSunVis", "uGlow", "uStars", "uLights", "uAlpen", "uCloud", "uAmb",
  "uFocus", "uCoc", "uStar", "uGain", "uSmooth", "uTrail", "uGrain", "uVig",
];

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Viewfinder shader failed to compile: ${log}`);
  }
  return shader;
}

/**
 * Returns { resize, draw, destroy }, or null when WebGL isn't available.
 * `draw(look)` takes the object produced by `lookFor()` in camera.js.
 */
export function createRenderer(canvas) {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "high-performance",
  });
  if (!gl) return null;

  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program));
    }
  } catch (err) {
    console.error(err);
    return null;
  }

  gl.useProgram(program);

  // One oversized triangle covers the whole viewport.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const loc = {};
  for (const name of UNIFORMS) loc[name] = gl.getUniformLocation(program, name);

  let pixelRatio = 1;

  return {
    resize(width, height, dpr) {
      pixelRatio = dpr;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
    },

    draw(look, time, parallax) {
      gl.uniform2f(loc.uRes, canvas.width, canvas.height);
      gl.uniform1f(loc.uPx, Math.max(1, pixelRatio));
      gl.uniform1f(loc.uTime, time % 3600);
      gl.uniform1f(loc.uPar, parallax);

      gl.uniform3fv(loc.uSkyTop, look.skyTop);
      gl.uniform3fv(loc.uSkyHor, look.skyHor);
      gl.uniform3fv(loc.uSunCol, look.sun);
      gl.uniform3fv(loc.uHaze, look.haze);
      gl.uniform3fv(loc.uFar, look.far);
      gl.uniform3fv(loc.uNear, look.near);
      gl.uniform3fv(loc.uWater, look.water);
      gl.uniform3fv(loc.uSnow, look.snow);
      gl.uniform2f(loc.uSun, look.sunX, look.sunY);
      gl.uniform1f(loc.uSunVis, look.sunVis);
      gl.uniform1f(loc.uGlow, look.glow);
      gl.uniform1f(loc.uStars, look.stars);
      gl.uniform1f(loc.uLights, look.lights);
      gl.uniform1f(loc.uAlpen, look.alpen);
      gl.uniform1f(loc.uCloud, look.cloud);
      gl.uniform1f(loc.uAmb, look.amb);

      gl.uniform1f(loc.uFocus, look.focus);
      gl.uniform1f(loc.uCoc, look.coc);
      gl.uniform1f(loc.uStar, look.sunstar);
      gl.uniform1f(loc.uGain, Math.pow(2, look.stops));
      gl.uniform1f(loc.uSmooth, look.smooth);
      gl.uniform1f(loc.uTrail, look.trail);
      gl.uniform1f(loc.uGrain, look.grain);
      gl.uniform1f(loc.uVig, look.vignette);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },

    // Frees the GPU objects but leaves the context alive, so the same canvas
    // can be set up again (React re-runs effects in development).
    destroy() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}
