/**
 * Champ spatial 3D continu (fond fixe sur tout le site).
 * Donne la sensation physique d'avancer sur l'axe Z entre chaque monde :
 * les particules et ondes de profondeur accélèrent au défilement et adoptent
 * progressivement l'atmosphère chromatique du monde actif.
 * Désactivé sous prefers-reduced-motion: reduce ; zéro dépendance externe.
 */

interface Rgb {
  r: number;
  g: number;
  b: number;
}

const DEFAULT_RGB: Rgb = { r: 72, g: 138, b: 255 };

const WORLD_PALETTE: Record<string, Rgb> = {
  command: DEFAULT_RGB,
  architecture: { r: 59, g: 130, b: 246 },
  'key-studio': { r: 147, g: 197, b: 253 },
  workbench: { r: 148, g: 163, b: 184 },
  vault: { r: 37, g: 99, b: 235 },
  'ai-lab': { r: 45, g: 212, b: 191 },
  advisory: { r: 125, g: 211, b: 252 },
  editorial: { r: 91, g: 155, b: 255 },
};

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  phase: number;
}

export function initSpatialField(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-spatial-field]');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = window.innerWidth < 768 ? 70 : 120;
  const particles: Particle[] = [];

  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: (Math.random() - 0.5) * 2.4,
      y: (Math.random() - 0.5) * 1.8,
      z: Math.random() * 1.8 + 0.12,
      size: 0.7 + Math.random() * 1.6,
      phase: Math.random() * Math.PI * 2,
    });
  }

  let width = 0;
  let height = 0;
  let dpr = 1;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  let lastScrollY = window.scrollY;
  let scrollBoost = 0;
  let pointerX = 0;
  let pointerY = 0;
  let targetPointerX = 0;
  let targetPointerY = 0;

  window.addEventListener(
    'scroll',
    () => {
      const nextY = window.scrollY;
      const delta = nextY - lastScrollY;
      lastScrollY = nextY;
      scrollBoost = Math.max(-0.045, Math.min(0.065, scrollBoost + delta * 0.00018));
    },
    { passive: true },
  );

  window.addEventListener(
    'pointermove',
    (e) => {
      targetPointerX = (e.clientX / Math.max(1, width) - 0.5) * 0.14;
      targetPointerY = (e.clientY / Math.max(1, height) - 0.5) * 0.1;
    },
    { passive: true },
  );

  const initialKey = document.body.dataset.activeWorld ?? document.body.dataset.world ?? 'command';
  const initialTarget = WORLD_PALETTE[initialKey] ?? DEFAULT_RGB;
  const activeColor: Rgb = { r: initialTarget.r, g: initialTarget.g, b: initialTarget.b };
  let lastWorldKey = initialKey;
  let portalSurge = 0;
  let time = 0;
  let rafId = 0;
  let running = true;

  const renderFrame = () => {
    const worldKey = document.body.dataset.activeWorld ?? document.body.dataset.world ?? 'command';
    if (worldKey !== lastWorldKey) {
      lastWorldKey = worldKey;
      portalSurge = 1;
    }
    const target = WORLD_PALETTE[worldKey] ?? DEFAULT_RGB;
    activeColor.r += (target.r - activeColor.r) * 0.045;
    activeColor.g += (target.g - activeColor.g) * 0.045;
    activeColor.b += (target.b - activeColor.b) * 0.045;

    pointerX += (targetPointerX - pointerX) * 0.06;
    pointerY += (targetPointerY - pointerY) * 0.06;

    ctx.clearRect(0, 0, width, height);

    const cx = width * 0.5;
    const cy = height * 0.48;
    const fov = Math.min(width, height) * 0.76;
    const cr = Math.round(activeColor.r);
    const cg = Math.round(activeColor.g);
    const cb = Math.round(activeColor.b);

    // Ondes de profondeur concentriques : traversée continue d'un monde à l'autre
    const ringCount = 5;
    for (let ring = 0; ring < ringCount; ring += 1) {
      const rz = ((ring * 0.38 - time * 0.14 - scrollBoost * 3.2) % 1.9 + 1.9) % 1.9 + 0.14;
      const radius = (0.76 / rz) * fov;
      const alpha = Math.max(0, Math.min(0.22, (1 - rz / 2.0) * (0.16 + portalSurge * 0.12)));
      if (alpha > 0.008 && radius < Math.max(width, height) * 1.6) {
        ctx.beginPath();
        ctx.ellipse(
          cx - pointerX * (180 / rz),
          cy - pointerY * (150 / rz),
          radius * 1.28,
          radius * 0.66,
          0,
          0,
          Math.PI * 2,
        );
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha.toFixed(3)})`;
        ctx.lineWidth = rz < 0.6 ? 1.35 : 1;
        ctx.stroke();
      }
    }

    const zStep = reduced ? 0 : 0.0018 + scrollBoost + portalSurge * 0.014;
    scrollBoost *= 0.91;
    portalSurge *= 0.94;
    time += 0.013;

    for (const p of particles) {
      p.z -= zStep;
      if (p.z <= 0.1) {
        p.z = 1.92;
        p.x = (Math.random() - 0.5) * 2.4;
        p.y = (Math.random() - 0.5) * 1.8;
      } else if (p.z > 1.94) {
        p.z = 0.12;
      }

      const waveY = Math.sin(time + p.phase) * 0.028;
      const px = cx + ((p.x - pointerX) / p.z) * fov;
      const py = cy + ((p.y + waveY - pointerY) / p.z) * fov;
      if (px < -40 || px > width + 40 || py < -40 || py > height + 40) continue;

      const depthAlpha = Math.max(0, Math.min(0.88, (1 - p.z / 2.0) * (0.78 + portalSurge * 0.2)));
      const r = Math.max(0.75, (p.size / p.z) * 1.3);

      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${depthAlpha.toFixed(3)})`;
      ctx.fill();
    }

    if (!reduced && running) {
      rafId = requestAnimationFrame(renderFrame);
    }
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(rafId);
    } else if (!reduced && !running) {
      running = true;
      rafId = requestAnimationFrame(renderFrame);
    }
  });

  renderFrame();
}
