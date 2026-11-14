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

  const initialTarget = WORLD_PALETTE[document.body.dataset.activeWorld ?? 'command'] ?? DEFAULT_RGB;
  const activeColor: Rgb = { r: initialTarget.r, g: initialTarget.g, b: initialTarget.b };
  let time = 0;
  let rafId = 0;
  let running = true;

  const renderFrame = () => {
    const worldKey = document.body.dataset.activeWorld ?? document.body.dataset.world ?? 'command';
    const target = WORLD_PALETTE[worldKey] ?? DEFAULT_RGB;
    activeColor.r += (target.r - activeColor.r) * 0.04;
    activeColor.g += (target.g - activeColor.g) * 0.04;
    activeColor.b += (target.b - activeColor.b) * 0.04;

    pointerX += (targetPointerX - pointerX) * 0.06;
    pointerY += (targetPointerY - pointerY) * 0.06;

    ctx.clearRect(0, 0, width, height);

    const cx = width * 0.5;
    const cy = height * 0.48;
    const fov = Math.min(width, height) * 0.72;
    const cr = Math.round(activeColor.r);
    const cg = Math.round(activeColor.g);
    const cb = Math.round(activeColor.b);

    // Anneaux d'onde de profondeur discrets (repères spatiaux dans l'eau/espace)
    for (let ring = 0; ring < 3; ring += 1) {
      const rz = ((ring * 0.62 - time * 0.12 - scrollBoost * 2.5) % 1.86 + 1.86) % 1.86 + 0.18;
      const radius = (0.72 / rz) * fov;
      const alpha = Math.max(0, Math.min(0.11, (1 - rz / 2.0) * 0.12));
      if (alpha > 0.005 && radius < Math.max(width, height) * 1.4) {
        ctx.beginPath();
        ctx.ellipse(
          cx - pointerX * (160 / rz),
          cy - pointerY * (140 / rz),
          radius * 1.25,
          radius * 0.68,
          0,
          0,
          Math.PI * 2,
        );
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    const zStep = reduced ? 0 : 0.0014 + scrollBoost;
    scrollBoost *= 0.91;
    time += 0.012;

    for (const p of particles) {
      p.z -= zStep;
      if (p.z <= 0.1) {
        p.z = 1.92;
        p.x = (Math.random() - 0.5) * 2.4;
        p.y = (Math.random() - 0.5) * 1.8;
      } else if (p.z > 1.94) {
        p.z = 0.12;
      }

      const waveY = Math.sin(time + p.phase) * 0.025;
      const px = cx + ((p.x - pointerX) / p.z) * fov;
      const py = cy + ((p.y + waveY - pointerY) / p.z) * fov;
      if (px < -40 || px > width + 40 || py < -40 || py > height + 40) continue;

      const depthAlpha = Math.max(0, Math.min(0.75, (1 - p.z / 2.0) * 0.72));
      const r = Math.max(0.6, (p.size / p.z) * 1.15);

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
