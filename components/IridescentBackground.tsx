'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from './motion/useReducedMotion';
import styles from './IridescentBackground.module.css';

// Full-screen triangle-strip quad: [-1,-1] .. [1,1] in clip space.
const QUAD_VERTICES = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

const VERTEX_SRC = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// Domain-warped fbm oil-slick with an iridescent (thin-film) color ramp and a
// fine halftone dot overlay. Based on Inigo Quilez's "Warping" technique:
// https://iquilezles.org/articles/warp/
const FRAGMENT_SRC = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

varying vec2 v_uv;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

mat2 rot2(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, s, -s, c);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  mat2 m = rot2(0.5);
  for (int i = 0; i < 6; i++) {
    sum += amp * noise(p);
    p = m * p * 2.03;
    amp *= 0.5;
  }
  return sum;
}

// Iridescent thin-film palette: cycles explicitly through deep blue -> violet
// -> magenta -> teal (and back), rather than a cosine-phase guess that can
// wander into unrelated hues (yellow/green) at some phases.
vec3 palette(float t) {
  vec3 cBlue = vec3(0.16, 0.32, 0.95);
  vec3 cViolet = vec3(0.46, 0.14, 0.88);
  vec3 cMagenta = vec3(0.95, 0.16, 0.62);
  vec3 cTeal = vec3(0.08, 0.68, 0.62);

  float h = fract(t);
  float seg = h * 4.0;
  float localF = fract(seg);
  localF = localF * localF * (3.0 - 2.0 * localF);

  vec3 c0;
  vec3 c1;
  if (seg < 1.0) {
    c0 = cBlue;
    c1 = cViolet;
  } else if (seg < 2.0) {
    c0 = cViolet;
    c1 = cMagenta;
  } else if (seg < 3.0) {
    c0 = cMagenta;
    c1 = cTeal;
  } else {
    c0 = cTeal;
    c1 = cBlue;
  }
  return mix(c0, c1, localF);
}

void main() {
  vec2 uv = v_uv;
  vec2 p = uv;
  p.x *= u_resolution.x / u_resolution.y;
  p *= 2.6;

  // Mouse warps the whole flow field so cursor movement is unmistakable,
  // beyond just the specular highlight below.
  vec2 mouseOffset = (u_mouse - 0.5) * 1.4;

  float t = u_time * 0.06;

  vec2 q = vec2(
    fbm(p + vec2(0.0, 0.0) + t),
    fbm(p + vec2(5.2, 1.3) - t * 0.8)
  );

  vec2 r = vec2(
    fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 1.6 + mouseOffset),
    fbm(p + 4.0 * q + vec2(8.3, 2.8) + t * 1.3 - mouseOffset * 0.6)
  );

  float f = fbm(p + 4.0 * r);

  // Near-black glossy base.
  vec3 base = vec3(0.021, 0.025, 0.048);

  // Iridescent color riding the warp field, slowly cycling over time. The
  // mix of f, q and r keeps the hue varying spatially (not a uniform tint)
  // while still sweeping the full blue/violet/magenta/teal cycle.
  vec3 sheenColor = palette(f * 1.9 + length(q) * 0.4 + (r.x - r.y) * 0.35 + u_time * 0.015);

  // Streak-like mask so most of the surface stays dark and moody, with
  // colored sheen only along the ridges of the flow (not a full wash).
  float sheenMask = smoothstep(0.2, 0.85, (r.x - r.y) * 0.5 + f * 0.6);
  sheenMask = pow(sheenMask, 1.4);

  vec3 col = base + sheenColor * sheenMask * 1.05;

  // Sharper glossy glints on top of the color streaks, like light catching
  // ridges in a liquid-metal surface.
  float shine = smoothstep(0.72, 0.97, sheenMask);
  col += shine * 0.22 * vec3(1.0, 0.98, 1.0);

  // Specular highlight that glides toward the cursor.
  float distToMouse = length(uv - u_mouse);
  float glow = exp(-distToMouse * distToMouse * 11.0) * 0.16;
  col += glow * vec3(0.6, 0.78, 1.0);

  // Fine halftone dot overlay (retro print texture), low opacity, larger
  // dots in darker areas like a classic print halftone.
  vec2 dotUv = mod(gl_FragCoord.xy, 5.0) - 2.5;
  float dist = length(dotUv);
  float luminance = dot(col, vec3(0.299, 0.587, 0.114));
  float dotRadius = mix(2.1, 0.35, clamp(luminance * 1.8, 0.0, 1.0));
  float dotMask = 1.0 - smoothstep(dotRadius - 0.6, dotRadius, dist);
  col += dotMask * 0.028;

  col = clamp(col, 0.0, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
`;

// Time value (seconds) used for the single static frame rendered when
// prefers-reduced-motion is set — chosen for a good-looking still moment.
const FROZEN_TIME = 8.4;

// Mouse lerp factor per frame (glide, not jitter).
const MOUSE_EASE = 0.06;

interface IridescentBackgroundProps {
  className?: string;
  /** Footer use may pass false for a calmer, non-mouse-reactive version. */
  interactive?: boolean;
}

interface ReducedMotionController {
  setReduced: (reduced: boolean) => void;
}

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('[IridescentBackground] shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  // Shaders are flagged for deletion once detached; the program keeps them
  // alive until it is itself deleted.
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('[IridescentBackground] program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  const err = gl.getError();
  if (err !== gl.NO_ERROR) {
    console.error('[IridescentBackground] GL error after program link:', err);
  }

  return program;
}

export function IridescentBackground({ className, interactive = true }: IridescentBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  const controllerRef = useRef<ReducedMotionController | null>(null);

  // Keep the render loop's notion of "reduced" current, and notify the
  // running loop (if already set up) so it can freeze/resume immediately.
  useEffect(() => {
    reducedRef.current = reduced;
    controllerRef.current?.setReduced(reduced);
  }, [reduced]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.className = styles.canvas;
    canvas.setAttribute('aria-hidden', 'true');

    const glOptions: WebGLContextAttributes = {
      antialias: true,
      alpha: false,
      premultipliedAlpha: false,
      powerPreference: 'low-power',
      // Without this, the drawing buffer can be cleared by the browser
      // right after compositing, which is fine for normal display (we
      // redraw every frame) but makes external readback (dev tools,
      // screenshot tooling) intermittently see a blank buffer.
      preserveDrawingBuffer: true,
    };
    const gl = (canvas.getContext('webgl', glOptions) ||
      canvas.getContext('experimental-webgl', glOptions)) as WebGLRenderingContext | null;

    // No WebGL: leave only the CSS fallback layer already in the DOM. Never
    // insert a canvas that can't render.
    if (!gl) return;

    const program = createProgram(gl);
    if (!program) return;

    container.appendChild(canvas);

    const positionLoc = gl.getAttribLocation(program, 'a_position');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD_VERTICES, gl.STATIC_DRAW);

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    let width = 0;
    let height = 0;

    function resize() {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const nextWidth = Math.max(1, Math.round(rect.width * dpr));
      const nextHeight = Math.max(1, Math.round(rect.height * dpr));
      if (nextWidth !== width || nextHeight !== height) {
        width = nextWidth;
        height = nextHeight;
        canvas.width = width;
        canvas.height = height;
        gl!.viewport(0, 0, width, height);
      }
    }
    resize();

    const mouseTarget = [0.5, 0.5];
    const mouseCurrent = [0.5, 0.5];

    function handlePointerMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      mouseTarget[0] = (e.clientX - rect.left) / rect.width;
      mouseTarget[1] = 1.0 - (e.clientY - rect.top) / rect.height;
    }
    if (interactive) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }

    let rafId = 0;
    let isVisible = true;
    const startTime = performance.now();

    function drawFrame(timeVal: number) {
      gl!.uniform1f(timeLoc, timeVal);
      gl!.uniform2f(resolutionLoc, width, height);
      gl!.uniform2f(mouseLoc, mouseCurrent[0], mouseCurrent[1]);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    }

    function loop(now: number) {
      rafId = 0;
      if (!isVisible) return;
      if (reducedRef.current) {
        mouseCurrent[0] = 0.5;
        mouseCurrent[1] = 0.5;
        drawFrame(FROZEN_TIME);
        return; // Static: don't reschedule.
      }
      const t = ((now - startTime) / 1000) % 1000;
      mouseCurrent[0] += (mouseTarget[0] - mouseCurrent[0]) * MOUSE_EASE;
      mouseCurrent[1] += (mouseTarget[1] - mouseCurrent[1]) * MOUSE_EASE;
      drawFrame(t);
      rafId = requestAnimationFrame(loop);
    }

    function ensureRunning() {
      if (rafId === 0 && isVisible) {
        rafId = requestAnimationFrame(loop);
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (rafId === 0) {
        drawFrame(reducedRef.current ? FROZEN_TIME : (performance.now() - startTime) / 1000);
      }
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry?.isIntersecting ?? true;
        if (isVisible) {
          ensureRunning();
        } else if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(canvas);

    controllerRef.current = {
      setReduced(nextReduced: boolean) {
        if (nextReduced) {
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
          mouseCurrent[0] = 0.5;
          mouseCurrent[1] = 0.5;
          drawFrame(FROZEN_TIME);
        } else {
          ensureRunning();
        }
      },
    };

    ensureRunning();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      if (interactive) window.removeEventListener('pointermove', handlePointerMove);
      controllerRef.current = null;
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, [interactive]);

  const rootClassName = className ? `${styles.root} ${className}` : styles.root;

  return (
    <div ref={containerRef} className={rootClassName} aria-hidden="true">
      <div className={styles.fallback} />
    </div>
  );
}
