"use client";

// Cursor smoke for the homepage hero: a small WebGL fluid simulation (stable-fluids method: advection, curl and
// vorticity, pressure solve) drawn on a canvas behind the hero content. Moving the pointer over the hero leaves soft
// violet / lavender / lime trails that swirl and fade; a faint swirl also drifts on its own.
// Desktop only (>= 1024px), off for prefers-reduced-motion, skipped without WebGL2 float render targets or on
// software renderers, and paused while the hero is off screen or the tab is hidden.
import { useEffect, useRef } from "react";

const SIM_RES = 128; // velocity grid
const DYE_RES = 512; // colour grid
const DYE_FADE = 0.6; // how fast colour fades (higher = faster)
const VEL_FADE = 3; // how fast motion fades
const PRESSURE_KEEP = 0.1;
const PRESSURE_STEPS = 20;
const CURL = 3; // swirl strength
const RADIUS = 0.2 / 100; // splat size
const FORCE = 6000; // pointer push
const INTENSITY = 0.13; // colour strength per splat
const COLOR_CHANGES_PER_SEC = 6;

// Effix colours (RGB 0..1): violet, lavender, deep violet, soft lime
const PALETTE: [number, number, number][] = [
  [0.486, 0.361, 0.941], // #7c5cf0
  [0.655, 0.545, 0.98], // #a78bfa
  [0.337, 0.22, 0.839], // #5638d6
  [0.773, 0.71, 0.992], // #c5b5fd
  [0.639, 0.902, 0.208], // #a3e635 (less often)
];

function pickColor(scale = INTENSITY) {
  const i = Math.random() < 0.14 ? 4 : Math.floor(Math.random() * 4);
  const [r, g, b] = PALETTE[i];
  return { r: r * scale, g: g * scale, b: b * scale };
}

const VERT = `#version 300 es
precision highp float;
in vec2 aPosition;
out vec2 vUv; out vec2 vL; out vec2 vR; out vec2 vT; out vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0); vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y); vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;
const HEAD = `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
out vec4 fragColor;
`;
const FRAG = {
  clear: `${HEAD}uniform sampler2D uTexture; uniform float value;
void main () { fragColor = value * texture(uTexture, vUv); }`,
  splat: `${HEAD}uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;
void main () {
  vec2 p = vUv - point; p.x *= aspectRatio;
  fragColor = vec4(texture(uTarget, vUv).xyz + exp(-dot(p, p) / radius) * color, 1.0);
}`,
  advection: `${HEAD}uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation;
void main () {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  fragColor = texture(uSource, coord) / (1.0 + dissipation * dt);
}`,
  divergence: `${HEAD}uniform sampler2D uVelocity;
void main () {
  float L = texture(uVelocity, vL).x, R = texture(uVelocity, vR).x, T = texture(uVelocity, vT).y, B = texture(uVelocity, vB).y;
  vec2 c = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -c.x; if (vR.x > 1.0) R = -c.x; if (vT.y > 1.0) T = -c.y; if (vB.y < 0.0) B = -c.y;
  fragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,
  curl: `${HEAD}uniform sampler2D uVelocity;
void main () {
  float L = texture(uVelocity, vL).y, R = texture(uVelocity, vR).y, T = texture(uVelocity, vT).x, B = texture(uVelocity, vB).x;
  fragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,
  vorticity: `${HEAD}uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curlStrength; uniform float dt;
void main () {
  float L = texture(uCurl, vL).x, R = texture(uCurl, vR).x, T = texture(uCurl, vT).x, B = texture(uCurl, vB).x, C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001; force *= curlStrength * C; force.y *= -1.0;
  vec2 vel = texture(uVelocity, vUv).xy + force * dt;
  fragColor = vec4(clamp(vel, -1000.0, 1000.0), 0.0, 1.0);
}`,
  pressure: `${HEAD}uniform sampler2D uPressure; uniform sampler2D uDivergence;
void main () {
  float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x, T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
  fragColor = vec4((L + R + B + T - texture(uDivergence, vUv).x) * 0.25, 0.0, 0.0, 1.0);
}`,
  gradient: `${HEAD}uniform sampler2D uPressure; uniform sampler2D uVelocity;
void main () {
  float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x, T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
  fragColor = vec4(texture(uVelocity, vUv).xy - vec2(R - L, T - B), 0.0, 1.0);
}`,
  display: `${HEAD}uniform sampler2D uTexture; uniform vec2 texelSize;
void main () {
  vec3 c = texture(uTexture, vUv).rgb;
  float dx = length(texture(uTexture, vR).rgb) - length(texture(uTexture, vL).rgb);
  float dy = length(texture(uTexture, vT).rgb) - length(texture(uTexture, vB).rgb);
  vec3 n = normalize(vec3(dx, dy, length(texelSize)));
  c *= clamp(dot(n, vec3(0.0, 0.0, 1.0)) + 0.7, 0.7, 1.0);
  fragColor = vec4(c, max(c.r, max(c.g, c.b)));
}`,
};

type Prog = { program: WebGLProgram; u: (name: string) => WebGLUniformLocation | null };
type Target = { texture: WebGLTexture; fbo: WebGLFramebuffer; width: number; height: number; tx: number; ty: number };
type Double = { read: Target; write: Target; swap: () => void };

export default function HeroFluid() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl2", { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: true });
    if (!gl) return;
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(gl.getParameter(dbg ? dbg.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "");
    if (/swiftshader|llvmpipe|software/i.test(renderer)) return;
    if (!gl.getExtension("EXT_color_buffer_float")) return;
    const linear = gl.getExtension("OES_texture_float_linear") ? gl.LINEAR : gl.NEAREST;
    const dyeRes = linear === gl.LINEAR ? DYE_RES : 256;

    // geometry: one full-screen quad
    const vbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    const draw = () => { gl.bindVertexArray(vao); gl.drawArrays(gl.TRIANGLES, 0, 6); };

    const shaders: WebGLShader[] = [];
    const compile = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); shaders.push(s); return s; };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const makeProg = (frag: string): Prog => {
      const p = gl.createProgram()!;
      gl.attachShader(p, vs); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, frag));
      gl.bindAttribLocation(p, 0, "aPosition");
      gl.linkProgram(p);
      const cache = new Map<string, WebGLUniformLocation | null>();
      return { program: p, u: (n) => { if (!cache.has(n)) cache.set(n, gl.getUniformLocation(p, n)); return cache.get(n)!; } };
    };
    const P = Object.fromEntries(Object.entries(FRAG).map(([k, f]) => [k, makeProg(f)])) as Record<keyof typeof FRAG, Prog>;
    if (!gl.getProgramParameter(P.display.program, gl.LINK_STATUS)) return;

    const targets: Target[] = [];
    const freeTargets = () => { for (const t of targets) { gl.deleteFramebuffer(t.fbo); gl.deleteTexture(t.texture); } targets.length = 0; };
    const makeTarget = (w: number, h: number, filter: number): Target => {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const t = { texture, fbo, width: w, height: h, tx: 1 / w, ty: 1 / h };
      targets.push(t);
      return t;
    };
    const makeDouble = (w: number, h: number, filter: number): Double => {
      let a = makeTarget(w, h, filter), b = makeTarget(w, h, filter);
      return { get read() { return a; }, get write() { return b; }, swap() { [a, b] = [b, a]; } };
    };
    const gridSize = (res: number) => {
      let ratio = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (ratio < 1) ratio = 1 / ratio;
      const lo = Math.round(res), hi = Math.round(res * ratio);
      return gl.drawingBufferWidth > gl.drawingBufferHeight ? { w: hi, h: lo } : { w: lo, h: hi };
    };

    let velocity!: Double, dye!: Double, pressure!: Double, divergence!: Target, curl!: Target;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cw = 0, ch = 0;
    const resize = () => {
      const r = host.getBoundingClientRect();
      const w = Math.max(1, Math.floor(r.width * dpr)), h = Math.max(1, Math.floor(r.height * dpr));
      if (w === cw && h === ch) return;
      cw = w; ch = h;
      canvas.width = w; canvas.height = h;
      freeTargets();
      const s = gridSize(SIM_RES), d = gridSize(dyeRes);
      velocity = makeDouble(s.w, s.h, linear);
      dye = makeDouble(d.w, d.h, linear);
      divergence = makeTarget(s.w, s.h, gl.NEAREST);
      curl = makeTarget(s.w, s.h, gl.NEAREST);
      pressure = makeDouble(s.w, s.h, gl.NEAREST);
    };
    resize();

    const bindTex = (unit: number, t: Target) => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t.texture); return unit; };
    const into = (t: Target) => { gl.viewport(0, 0, t.width, t.height); gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo); };

    const splat = (x: number, y: number, dx: number, dy: number, color: { r: number; g: number; b: number }) => {
      gl.useProgram(P.splat.program);
      gl.uniform1f(P.splat.u("aspectRatio"), cw / ch);
      gl.uniform2f(P.splat.u("point"), x, y);
      gl.uniform1f(P.splat.u("radius"), RADIUS);
      into(velocity.write);
      gl.uniform1i(P.splat.u("uTarget"), bindTex(0, velocity.read));
      gl.uniform3f(P.splat.u("color"), dx, dy, 0);
      draw(); velocity.swap();
      into(dye.write);
      gl.uniform1i(P.splat.u("uTarget"), bindTex(0, dye.read));
      gl.uniform3f(P.splat.u("color"), color.r, color.g, color.b);
      draw(); dye.swap();
    };

    const step = (dt: number) => {
      gl.disable(gl.BLEND);
      const tex = velocity.read;
      gl.useProgram(P.curl.program); into(curl);
      gl.uniform2f(P.curl.u("texelSize"), tex.tx, tex.ty);
      gl.uniform1i(P.curl.u("uVelocity"), bindTex(0, velocity.read));
      draw();

      gl.useProgram(P.vorticity.program); into(velocity.write);
      gl.uniform2f(P.vorticity.u("texelSize"), tex.tx, tex.ty);
      gl.uniform1i(P.vorticity.u("uVelocity"), bindTex(0, velocity.read));
      gl.uniform1i(P.vorticity.u("uCurl"), bindTex(1, curl));
      gl.uniform1f(P.vorticity.u("curlStrength"), CURL);
      gl.uniform1f(P.vorticity.u("dt"), dt);
      draw(); velocity.swap();

      gl.useProgram(P.divergence.program); into(divergence);
      gl.uniform2f(P.divergence.u("texelSize"), tex.tx, tex.ty);
      gl.uniform1i(P.divergence.u("uVelocity"), bindTex(0, velocity.read));
      draw();

      gl.useProgram(P.clear.program); into(pressure.write);
      gl.uniform1i(P.clear.u("uTexture"), bindTex(0, pressure.read));
      gl.uniform1f(P.clear.u("value"), PRESSURE_KEEP);
      draw(); pressure.swap();

      gl.useProgram(P.pressure.program);
      gl.uniform2f(P.pressure.u("texelSize"), tex.tx, tex.ty);
      gl.uniform1i(P.pressure.u("uDivergence"), bindTex(0, divergence));
      for (let i = 0; i < PRESSURE_STEPS; i++) {
        into(pressure.write);
        gl.uniform1i(P.pressure.u("uPressure"), bindTex(1, pressure.read));
        draw(); pressure.swap();
      }

      gl.useProgram(P.gradient.program); into(velocity.write);
      gl.uniform2f(P.gradient.u("texelSize"), tex.tx, tex.ty);
      gl.uniform1i(P.gradient.u("uPressure"), bindTex(0, pressure.read));
      gl.uniform1i(P.gradient.u("uVelocity"), bindTex(1, velocity.read));
      draw(); velocity.swap();

      gl.useProgram(P.advection.program);
      gl.uniform2f(P.advection.u("texelSize"), tex.tx, tex.ty);
      gl.uniform1f(P.advection.u("dt"), dt);
      into(velocity.write);
      gl.uniform1i(P.advection.u("uVelocity"), bindTex(0, velocity.read));
      gl.uniform1i(P.advection.u("uSource"), 0);
      gl.uniform1f(P.advection.u("dissipation"), VEL_FADE);
      draw(); velocity.swap();

      into(dye.write);
      gl.uniform1i(P.advection.u("uVelocity"), bindTex(0, velocity.read));
      gl.uniform1i(P.advection.u("uSource"), bindTex(1, dye.read));
      gl.uniform1f(P.advection.u("dissipation"), DYE_FADE);
      draw(); dye.swap();
    };

    const render = () => {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(P.display.program);
      gl.uniform2f(P.display.u("texelSize"), 1 / gl.drawingBufferWidth, 1 / gl.drawingBufferHeight);
      gl.uniform1i(P.display.u("uTexture"), bindTex(0, dye.read));
      draw();
    };

    // pointer (only while over the hero)
    const ptr = { x: 0, y: 0, dx: 0, dy: 0, moved: false, seen: false, color: pickColor() };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = 1 - (e.clientY - r.top) / r.height;
      if (!ptr.seen) { ptr.seen = true; ptr.x = x; ptr.y = y; }
      ptr.dx = x - ptr.x; ptr.dy = y - ptr.y; ptr.x = x; ptr.y = y;
      ptr.moved = ptr.dx !== 0 || ptr.dy !== 0;
    };
    const onLeave = () => { ptr.seen = false; };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    // a faint swirl that wanders on its own
    const drift = { x: 0.5, y: 0.5, color: pickColor() };
    let last = performance.now(), colorClock = 0, raf = 0, visible = true;
    const frame = () => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 1 / 60);
      last = now;
      colorClock += dt * COLOR_CHANGES_PER_SEC;
      if (colorClock >= 1) { colorClock %= 1; ptr.color = pickColor(); drift.color = pickColor(); }

      const s = now / 1000;
      const nx = 0.5 + 0.42 * Math.sin(s * 0.9) * Math.cos(s * 0.31);
      const ny = 0.5 + 0.36 * Math.cos(s * 0.7 + 1.3) * Math.sin(s * 0.23 + 0.4);
      const ddx = nx - drift.x, ddy = ny - drift.y;
      drift.x = nx; drift.y = ny;
      const dist = Math.hypot(ddx, ddy);
      if (dist > 8e-4 && dist < 0.05) {
        const k = Math.min(1, dist * 120) * 0.4;
        splat(nx, ny, ddx * FORCE * 0.35, ddy * FORCE * 0.35, { r: drift.color.r * k, g: drift.color.g * k, b: drift.color.b * k });
      }
      if (ptr.moved) { ptr.moved = false; splat(ptr.x, ptr.y, ptr.dx * FORCE, ptr.dy * FORCE, ptr.color); }

      step(dt);
      render();
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); });
    io.observe(host);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    start();

    return () => {
      stop();
      io.disconnect(); ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      freeTargets();
      for (const p of Object.values(P)) gl.deleteProgram(p.program);
      for (const s of shaders) gl.deleteShader(s);
      gl.deleteBuffer(vbo); gl.deleteVertexArray(vao);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className="hero-fluid" aria-hidden="true" />;
}
