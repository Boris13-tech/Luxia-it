/**
 * Scène WebGL 2 de la constellation, sans bibliothèque (docs/DESIGN_SYSTEM.md,
 * section 7). Chargée à la demande par ConstellationScene.astro, jamais
 * pendant le préchargement d'une page, jamais élément LCP.
 * - Points : disques doux, taille selon la profondeur, fusion additive.
 * - Liaisons : s'estompent avec la profondeur ; celles qui mènent au registre
 *   portent une impulsion (une demande de connexion).
 * - Caméra : rotation lente, parallaxe au pointeur, recul au défilement.
 * - Pause hors de l'écran et onglet masqué ; arrêt propre si le contexte est
 *   perdu (l'image fixe reste en dessous).
 */
import { buildModel, palette, type Variant } from './constellation-model';

export type Tier = 'high' | 'balanced';

interface Options {
  variant: Variant;
  tier: Tier;
}

const POINT_VS = `#version 300 es
in vec3 a_pos;
in float a_size;
in vec3 a_color;
uniform mat4 u_mvp;
uniform float u_scale;
uniform float u_time;
out vec3 v_color;
out float v_fade;
void main() {
  vec4 p = u_mvp * vec4(a_pos, 1.0);
  gl_Position = p;
  float depth = clamp(1.0 - (p.z - 1.25) / 2.4, 0.15, 1.0);
  float twinkle = 0.85 + 0.15 * sin(u_time * 1.3 + a_pos.x * 40.0 + a_pos.z * 23.0);
  gl_PointSize = a_size * u_scale * depth * 3.0;
  v_color = a_color * twinkle;
  v_fade = depth;
}`;

const POINT_FS = `#version 300 es
precision mediump float;
in vec3 v_color;
in float v_fade;
out vec4 o;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float d = dot(c, c);
  if (d > 1.0) discard;
  float core = smoothstep(0.35, 0.0, d);
  float halo = smoothstep(1.0, 0.0, d) * 0.35;
  float a = (core + halo) * v_fade;
  o = vec4(v_color * a, a);
}`;

const LINE_VS = `#version 300 es
in vec3 a_pos;
in float a_t;
in float a_spoke;
in float a_phase;
uniform mat4 u_mvp;
out float v_t;
out float v_spoke;
out float v_phase;
out float v_fade;
void main() {
  vec4 p = u_mvp * vec4(a_pos, 1.0);
  gl_Position = p;
  v_t = a_t;
  v_spoke = a_spoke;
  v_phase = a_phase;
  v_fade = clamp(1.0 - (p.z - 1.25) / 2.4, 0.08, 1.0);
}`;

const LINE_FS = `#version 300 es
precision mediump float;
in float v_t;
in float v_spoke;
in float v_phase;
in float v_fade;
uniform float u_time;
uniform vec3 u_line;
uniform vec3 u_pulse;
out vec4 o;
void main() {
  float base = mix(0.13, 0.2, v_spoke) * v_fade;
  float head = fract(u_time * 0.22 + v_phase);
  float pulse = v_spoke * smoothstep(0.12, 0.0, abs(v_t - head)) * 0.9;
  vec3 col = u_line * base + u_pulse * pulse;
  float a = base + pulse;
  o = vec4(col, a);
}`;

/** Rend la main au navigateur entre deux étapes du démarrage. */
const pause = () => new Promise<void>((resolve) => setTimeout(resolve, 0));
const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

function shader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const sh = gl.createShader(type);
  if (!sh) throw new Error('shader');
  gl.shaderSource(sh, source);
  gl.compileShader(sh);
  return sh;
}

/**
 * Compile et lie un programme sans bloquer : avec KHR_parallel_shader_compile,
 * on attend la fin de la compilation image après image au lieu d'interroger
 * son état tout de suite (ce qui figerait la page le temps de la compilation).
 */
async function program(gl: WebGL2RenderingContext, vs: string, fs: string): Promise<WebGLProgram> {
  const p = gl.createProgram();
  if (!p) throw new Error('program');
  const v = shader(gl, gl.VERTEX_SHADER, vs);
  const f = shader(gl, gl.FRAGMENT_SHADER, fs);
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  const parallel = gl.getExtension('KHR_parallel_shader_compile') as { COMPLETION_STATUS_KHR: number } | null;
  if (parallel) {
    while (!gl.getProgramParameter(p, parallel.COMPLETION_STATUS_KHR)) await nextFrame();
  }
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(p) || gl.getShaderInfoLog(v) || gl.getShaderInfoLog(f) || 'link');
  }
  return p;
}

function buffer(gl: WebGL2RenderingContext, p: WebGLProgram, name: string, data: Float32Array, size: number): void {
  const loc = gl.getAttribLocation(p, name);
  if (loc < 0) return;
  const b = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
}

/** Produit de matrices 4×4 en colonnes : a × b. */
function mul(a: Float32Array, b: Float32Array): Float32Array {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c += 1)
    for (let r = 0; r < 4; r += 1) {
      let s = 0;
      for (let k = 0; k < 4; k += 1) s += (a[k * 4 + r] ?? 0) * (b[c * 4 + k] ?? 0);
      o[c * 4 + r] = s;
    }
  return o;
}

function perspective(fov: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1 / Math.tan(fov / 2);
  const nf = 1 / (near - far);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
}

function rotation(yaw: number, pitch: number): Float32Array {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  // Rotation autour de Y puis de X
  return new Float32Array([cy, sy * sp, -sy * cp, 0, 0, cp, sp, 0, sy, -cy * sp, cy * cp, 0, 0, 0, 0, 1]);
}

function translation(x: number, y: number, z: number): Float32Array {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
}

/**
 * Démarre la scène dans le canevas, en étapes courtes (aucune tâche longue) ;
 * renvoie une fonction d'arrêt.
 */
export async function start(canvas: HTMLCanvasElement, options: Options): Promise<() => void> {
  // Pas de rendu logiciel (SwiftShader, llvmpipe) : il bloquerait le processeur.
  const gl = canvas.getContext('webgl2', {
    antialias: false,
    alpha: true,
    premultipliedAlpha: true,
    powerPreference: 'low-power',
    failIfMajorPerformanceCaveat: true,
  });
  if (!gl) throw new Error('webgl2');

  const count = options.tier === 'high' ? 1400 : 600;
  const maxDpr = options.tier === 'high' ? 2 : 1;
  const frameGap = options.tier === 'high' ? 0 : 1000 / 30;
  const model = buildModel(count, options.variant);
  const colors = palette(options.variant);
  await pause();

  // Les deux programmes se compilent en parallèle
  const [pointProgram, lineProgram] = await Promise.all([program(gl, POINT_VS, POINT_FS), program(gl, LINE_VS, LINE_FS)]);
  await pause();

  // Points
  const pointVao = gl.createVertexArray();
  gl.bindVertexArray(pointVao);
  const pointColors = new Float32Array(count * 3);
  const pointSizes = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    const c = colors[model.kinds[i] ?? 0] ?? [1, 1, 1];
    pointColors.set(c, i * 3);
    pointSizes[i] = (model.sizes[i] ?? 0.3) * (i === 0 ? 3.2 : 1);
  }
  buffer(gl, pointProgram, 'a_pos', model.positions, 3);
  buffer(gl, pointProgram, 'a_size', pointSizes, 1);
  buffer(gl, pointProgram, 'a_color', pointColors, 3);

  // Liaisons
  const lineVao = gl.createVertexArray();
  gl.bindVertexArray(lineVao);
  const edgeCount = model.edges.length / 2;
  const linePos = new Float32Array(edgeCount * 6);
  const lineT = new Float32Array(edgeCount * 2);
  const lineSpoke = new Float32Array(edgeCount * 2);
  const linePhase = new Float32Array(edgeCount * 2);
  for (let e = 0; e < edgeCount; e += 1) {
    const a = model.edges[e * 2] ?? 0;
    const b = model.edges[e * 2 + 1] ?? 0;
    linePos.set(model.positions.subarray(a * 3, a * 3 + 3), e * 6);
    linePos.set(model.positions.subarray(b * 3, b * 3 + 3), e * 6 + 3);
    lineT[e * 2] = 0;
    lineT[e * 2 + 1] = 1;
    const spoke = model.spokes[e] ?? 0;
    lineSpoke[e * 2] = spoke;
    lineSpoke[e * 2 + 1] = spoke;
    const phase = (e * 0.618) % 1;
    linePhase[e * 2] = phase;
    linePhase[e * 2 + 1] = phase;
  }
  buffer(gl, lineProgram, 'a_pos', linePos, 3);
  buffer(gl, lineProgram, 'a_t', lineT, 1);
  buffer(gl, lineProgram, 'a_spoke', lineSpoke, 1);
  buffer(gl, lineProgram, 'a_phase', linePhase, 1);
  gl.bindVertexArray(null);

  const u = {
    pMvp: gl.getUniformLocation(pointProgram, 'u_mvp'),
    pScale: gl.getUniformLocation(pointProgram, 'u_scale'),
    pTime: gl.getUniformLocation(pointProgram, 'u_time'),
    lMvp: gl.getUniformLocation(lineProgram, 'u_mvp'),
    lTime: gl.getUniformLocation(lineProgram, 'u_time'),
    lLine: gl.getUniformLocation(lineProgram, 'u_line'),
    lPulse: gl.getUniformLocation(lineProgram, 'u_pulse'),
  };

  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  let width = 0;
  let height = 0;
  let scale = 1;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width * dpr));
    height = Math.max(1, Math.round(rect.height * dpr));
    canvas.width = width;
    canvas.height = height;
    scale = Math.min(width, height) / 110;
    gl.viewport(0, 0, width, height);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // Parallaxe au pointeur (lissée) et recul au défilement
  let px = 0;
  let py = 0;
  let tx = 0;
  let ty = 0;
  const onPointer = (e: PointerEvent) => {
    tx = (e.clientX / window.innerWidth - 0.5) * 2;
    ty = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  let visible = true;
  const io = new IntersectionObserver((entries) => {
    visible = entries.some((en) => en.isIntersecting);
    schedule();
  });
  io.observe(canvas);

  let raf = 0;
  let last = 0;
  let stopped = false;
  const t0 = performance.now();
  // Liaisons : bleu du registre, violet dans l'univers d'ALMA (agents IA)
  const lineColor = options.variant === 'alma' ? (colors[2] ?? [0.66, 0.55, 0.98]) : (colors[0] ?? [0.36, 0.61, 1]);
  const pulseColor: [number, number, number] = options.variant === 'alma' ? [0.75, 0.66, 1] : [0.86, 0.92, 1];

  const frame = (now: number) => {
    raf = 0;
    if (stopped || !visible || document.hidden) return;
    schedule();
    if (frameGap && now - last < frameGap) return;
    last = now;
    const time = (now - t0) / 1000;
    px += (tx - px) * 0.04;
    py += (ty - py) * 0.04;
    const scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));

    const proj = perspective(0.75, width / height, 0.1, 20);
    const view = translation(width > height ? 0.55 : 0, 0.05, -2.25 - scroll * 0.9);
    const rot = rotation(time * 0.045 + px * 0.25, 0.32 + py * 0.12 + scroll * 0.25);
    const mvp = mul(proj, mul(view, rot));

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(lineProgram);
    gl.uniformMatrix4fv(u.lMvp, false, mvp);
    gl.uniform1f(u.lTime, time);
    gl.uniform3fv(u.lLine, lineColor);
    gl.uniform3fv(u.lPulse, pulseColor);
    gl.bindVertexArray(lineVao);
    gl.drawArrays(gl.LINES, 0, edgeCount * 2);

    gl.useProgram(pointProgram);
    gl.uniformMatrix4fv(u.pMvp, false, mvp);
    gl.uniform1f(u.pScale, scale);
    gl.uniform1f(u.pTime, time);
    gl.bindVertexArray(pointVao);
    gl.drawArrays(gl.POINTS, 0, count);

    if (!canvas.classList.contains('is-ready')) canvas.classList.add('is-ready');
  };

  function schedule() {
    if (!raf && !stopped && visible && !document.hidden) raf = requestAnimationFrame(frame);
  }

  const onVisibility = () => schedule();
  document.addEventListener('visibilitychange', onVisibility);

  const stop = () => {
    stopped = true;
    if (raf) cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener('pointermove', onPointer);
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.classList.remove('is-ready');
  };

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    stop();
  });

  schedule();
  return stop;
}
