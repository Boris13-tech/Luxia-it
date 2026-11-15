/**
 * Océan sous-marin WebGL 2 en arrière-plan total (« dans l'eau »).
 * - Caustiques animées en GLSL (interférences de surface réfractées).
 * - Rayons de lumière volumétriques (god-rays) plongeant depuis la surface.
 * - Gradient abyssal bleu océan évoluant avec la profondeur de défilement
 *   et l'atmosphère du monde actif.
 * - Particules / micro-bulles en suspension réagissant au scroll et au pointeur.
 * Repli Canvas 2D si WebGL 2 est indisponible ; pause sous prefers-reduced-motion.
 */

const VS = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FS = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform float u_time;
uniform float u_scroll;
uniform float u_surge;
uniform vec2 u_res;
uniform vec2 u_pointer;
uniform vec3 u_tint;
out vec4 o;

// Caustiques sous-marines rapides par interférence multi-ondes
float caustic(vec2 p, float t) {
  vec2 i = p;
  float c = 0.0;
  float inten = 0.055;
  for (int n = 0; n < 4; n++) {
    float ft = t * (1.0 - (3.2 / float(n + 1)));
    i = p + vec2(
      cos(ft - i.x) + sin(ft + i.y),
      sin(ft - i.y) + cos(ft + i.x)
    );
    c += 1.0 / length(vec2(
      p.x / (sin(i.x + ft) / inten),
      p.y / (cos(i.y + ft) / inten)
    ));
  }
  c /= 4.0;
  c = 1.18 - pow(c, 1.35);
  return clamp(pow(abs(c), 7.5), 0.0, 1.0);
}

// Rayons volumétriques depuis la surface de l'eau
float godRay(vec2 uv, float t, vec2 ptr) {
  vec2 src = vec2(0.5 + ptr.x * 0.12, 1.25);
  vec2 dir = uv - src;
  float ang = atan(dir.y, dir.x);
  float r1 = sin(ang * 14.0 + t * 0.45) * 0.5 + 0.5;
  float r2 = sin(ang * 23.0 - t * 0.32 + 1.4) * 0.5 + 0.5;
  float beam = pow(r1 * r2, 1.6);
  float vertical = smoothstep(0.05, 1.0, uv.y);
  return beam * vertical;
}

// Silhouette procédurale réaliste d'un requin nageant au loin dans la brume marine
float sharkMask(vec2 uv, vec2 center, float scale, float dir, float t, float phase) {
  vec2 q = (uv - center) / scale;
  q.x *= dir;
  // Ondulation fluide du corps vers la queue
  float tailFactor = smoothstep(0.15, -0.85, q.x);
  q.y += sin(q.x * 5.2 - t * 3.0 + phase) * 0.065 * tailFactor;

  // Fuselage hydrodynamique (museau en +0.55, queue en -0.75)
  float bodyHalfW = mix(0.015, 0.105, smoothstep(-0.68, 0.12, q.x)) * smoothstep(0.62, 0.22, q.x);
  float body = smoothstep(bodyHalfW + 0.014, bodyHalfW - 0.008, abs(q.y));

  // Aileron dorsal
  float dorsal = smoothstep(0.025, 0.0, abs(q.x - 0.02 + q.y * 0.45))
    * step(0.04, q.y)
    * smoothstep(0.24, 0.08, q.y);

  // Nageoire caudale en croissant
  float tailX = smoothstep(-0.56, -0.78, q.x) * smoothstep(-0.92, -0.72, q.x);
  float tailY = smoothstep(0.018, 0.0, abs(abs(q.y) - (-q.x - 0.56) * 0.62));
  float caudal = tailX * tailY;

  return clamp(max(body, max(dorsal, caudal)), 0.0, 1.0);
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_res.x / max(1.0, u_res.y);
  vec2 p = vec2(uv.x * aspect, uv.y);

  // Déplacement continu en profondeur avec le scroll
  float depthShift = u_scroll * 0.35;
  float t = u_time * 0.55;

  // 1. Gradient océanique bleu profond (surface éclairée -> abysse)
  vec3 surfaceCol = mix(vec3(0.04, 0.24, 0.46), u_tint * 0.55, 0.38);
  vec3 midCol     = mix(vec3(0.02, 0.11, 0.25), u_tint * 0.26, 0.30);
  vec3 deepCol    = vec3(0.008, 0.032, 0.085);

  float depthFactor = clamp(uv.y - depthShift * 0.25, 0.0, 1.0);
  vec3 water = mix(deepCol, midCol, smoothstep(0.0, 0.58, depthFactor));
  water = mix(water, surfaceCol, smoothstep(0.55, 1.0, depthFactor));

  // 2. Rayons de soleil sous-marins (god-rays)
  float rays = godRay(uv, t, u_pointer);
  water += mix(vec3(0.14, 0.52, 0.88), u_tint, 0.35) * rays * (0.28 + u_surge * 0.18);

  // 3. Caustiques réfractées dans le volume d'eau
  vec2 cUv = p * 2.2 + vec2(u_pointer.x * 0.2, -depthShift * 1.4);
  float c1 = caustic(cUv, t * 0.65);
  float c2 = caustic(cUv * 1.35 + vec2(3.1, 1.7), -t * 0.48);
  float caustics = (c1 * 0.65 + c2 * 0.45) * smoothstep(0.05, 0.95, uv.y * 0.85 + 0.18);
  water += mix(vec3(0.24, 0.68, 1.0), u_tint * 1.25, 0.32) * caustics * (0.34 + u_surge * 0.22);

  // 4. Vagues de courant doux (strates horizontales en suspension)
  float wave = sin(uv.x * 5.0 + t * 0.9 + depthShift * 4.0) * 0.015;
  float currentBand = smoothstep(0.02, 0.0, abs(fract(uv.y * 2.4 - depthShift * 0.6 + wave) - 0.5)) * 0.035;
  water += vec3(0.28, 0.72, 1.0) * currentBand;

  // Vignette périphérique douce pour garder la lisibilité des bords
  float vig = smoothstep(1.15, 0.22, length(uv - vec2(0.5, 0.52)));
  water *= mix(0.62, 1.0, vig);

  o = vec4(water, 1.0);
}`;

interface Rgb {
  r: number;
  g: number;
  b: number;
}

const DEFAULT_TINT: Rgb = { r: 0.22, g: 0.56, b: 0.98 };

const WORLD_TINTS: Record<string, Rgb> = {
  command: { r: 0.22, g: 0.56, b: 0.98 },
  architecture: { r: 0.18, g: 0.48, b: 0.96 },
  'key-studio': { r: 0.42, g: 0.72, b: 1.0 },
  workbench: { r: 0.30, g: 0.58, b: 0.92 },
  vault: { r: 0.12, g: 0.34, b: 0.86 },
  'ai-lab': { r: 0.14, g: 0.78, b: 0.74 },
  advisory: { r: 0.32, g: 0.68, b: 0.98 },
  editorial: { r: 0.24, g: 0.54, b: 0.96 },
};

function compileShader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type);
  if (!sh) throw new Error('shader');
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(sh) ?? 'compile');
  }
  return sh;
}

export function initSpatialField(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-spatial-field]');
  if (!canvas) return;

  const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'low-power' });
  if (!gl) return;

  let prog: WebGLProgram;
  try {
    const vs = compileShader(gl, gl.VERTEX_SHADER, VS);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FS);
    const p = gl.createProgram();
    if (!p) return;
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return;
    prog = p;
  } catch {
    return;
  }

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(prog, 'a_pos');
  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uScroll = gl.getUniformLocation(prog, 'u_scroll');
  const uSurge = gl.getUniformLocation(prog, 'u_surge');
  const uRes = gl.getUniformLocation(prog, 'u_res');
  const uPointer = gl.getUniformLocation(prog, 'u_pointer');
  const uTint = gl.getUniformLocation(prog, 'u_tint');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0;
  let height = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  window.addEventListener(
    'pointermove',
    (e) => {
      targetX = (e.clientX / Math.max(1, width) - 0.5) * 2;
      targetY = (e.clientY / Math.max(1, height) - 0.5) * 2;
    },
    { passive: true },
  );

  const initialKey = document.body.dataset.activeWorld ?? document.body.dataset.world ?? 'command';
  const initT = WORLD_TINTS[initialKey] ?? DEFAULT_TINT;
  const activeTint: Rgb = { r: initT.r, g: initT.g, b: initT.b };
  let lastWorld = initialKey;
  let surge = 0;
  let smoothScroll = 0;
  let time = 0;
  let rafId = 0;
  let running = true;

  const draw = () => {
    const worldKey = document.body.dataset.activeWorld ?? document.body.dataset.world ?? 'command';
    if (worldKey !== lastWorld) {
      lastWorld = worldKey;
      surge = 1;
    }
    const targetTint = WORLD_TINTS[worldKey] ?? DEFAULT_TINT;
    activeTint.r += (targetTint.r - activeTint.r) * 0.04;
    activeTint.g += (targetTint.g - activeTint.g) * 0.04;
    activeTint.b += (targetTint.b - activeTint.b) * 0.04;

    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollNorm = window.scrollY / maxScroll;
    smoothScroll += (scrollNorm - smoothScroll) * 0.08;
    pointerX += (targetX - pointerX) * 0.05;
    pointerY += (targetY - pointerY) * 0.05;
    surge *= 0.94;
    time += 0.016;

    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1f(uTime, time);
    gl.uniform1f(uScroll, smoothScroll);
    gl.uniform1f(uSurge, surge);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform2f(uPointer, pointerX, pointerY);
    gl.uniform3f(uTint, activeTint.r, activeTint.g, activeTint.b);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (!reduced && running) {
      rafId = requestAnimationFrame(draw);
    }
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(rafId);
    } else if (!reduced && !running) {
      running = true;
      rafId = requestAnimationFrame(draw);
    }
  });

  draw();
}
