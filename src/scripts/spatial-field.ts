/**
 * Champ spatial 3D continu (« océan de profondeur » vers un point de fuite lointain).
 * Rendu plein écran en arrière-plan sur tout le site :
 * - Gradient abyssal bleu profond centré sur un point de fuite lointain.
 * - Ondes horizontales fluides et lignes de perspective convergentes.
 * - Particules et anneaux de profondeur accélérant au défilement et lors du
 *   passage d'un monde à l'autre (portalSurge).
 * Désactivé sous prefers-reduced-motion: reduce ; zéro dépendance externe.
 */

interface Rgb {
  r: number;
  g: number;
  b: number;
}

const DEFAULT_RGB: Rgb = { r: 59, g: 130, b: 246 };

const WORLD_PALETTE: Record<string, Rgb> = {
  command: DEFAULT_RGB,
  architecture: { r: 37, g: 99, b: 235 },
  'key-studio': { r: 125, g: 185, b: 255 },
  workbench: { r: 96, g: 165, b: 250 },
  vault: { r: 29, g: 78, b: 216 },
  'ai-lab': { r: 45, g: 212, b: 191 },
  advisory: { r: 103, g: 195, b: 255 },
  editorial: { r: 72, g: 138, b: 255 },
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
  const count = window.innerWidth < 768 ? 90 : 160;
  const particles: Particle[] = [];

  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: (Math.random() - 0.5) * 2.8,
      y: (Math.random() - 0.5) * 2.0,
      z: Math.random() * 2.2 + 0.12,
      size: 0.75 + Math.random() * 1.8,
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
      scrollBoost = Math.max(-0.055, Math.min(0.085, scrollBoost + delta * 0.00022));
    },
    { passive: true },
  );

  window.addEventListener(
    'pointermove',
    (e) => {
      targetPointerX = (e.clientX / Math.max(1, width) - 0.5) * 0.16;
      targetPointerY = (e.clientY / Math.max(1, height) - 0.5) * 0.11;
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

    pointerX += (targetPointerX - pointerX) * 0.05;
    pointerY += (targetPointerY - pointerY) * 0.05;

    ctx.clearRect(0, 0, width, height);

    const vx = width * 0.5 - pointerX * width * 0.14;
    const vy = height * 0.42 - pointerY * height * 0.12;
    const fov = Math.min(width, height) * 0.78;
    const cr = Math.round(activeColor.r);
    const cg = Math.round(activeColor.g);
    const cb = Math.round(activeColor.b);

    // 1. Halo du point de fuite lointain (pic lumineux au fond de l'océan bleu)
    const peakRadius = Math.max(width, height) * (0.48 + portalSurge * 0.12);
    const peakGlow = ctx.createRadialGradient(vx, vy, 2, vx, vy, peakRadius);
    peakGlow.addColorStop(0, `rgba(${Math.min(255, cr + 70)}, ${Math.min(255, cg + 65)}, 255, ${(0.22 + portalSurge * 0.12).toFixed(3)})`);
    peakGlow.addColorStop(0.28, `rgba(${cr}, ${cg}, ${cb}, ${(0.12 + portalSurge * 0.06).toFixed(3)})`);
    peakGlow.addColorStop(1, 'rgba(3, 7, 16, 0)');
    ctx.fillStyle = peakGlow;
    ctx.fillRect(0, 0, width, height);

    // 2. Rayons de perspective convergeant vers le point de fuite
    const rayCount = 12;
    for (let i = 0; i < rayCount; i += 1) {
      const angle = (i / rayCount) * Math.PI * 2 + time * 0.025;
      const outerR = Math.max(width, height) * 1.15;
      const ex = vx + Math.cos(angle) * outerR;
      const ey = vy + Math.sin(angle) * outerR * 0.72;
      const rayGrad = ctx.createLinearGradient(vx, vy, ex, ey);
      rayGrad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${(0.14 + portalSurge * 0.08).toFixed(3)})`);
      rayGrad.addColorStop(0.45, `rgba(${cr}, ${cg}, ${cb}, 0.04)`);
      rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.beginPath();
      ctx.moveTo(vx, vy);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = rayGrad;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 3. Ondes concentriques de profondeur (effet de plongée continue)
    const ringCount = 7;
    for (let ring = 0; ring < ringCount; ring += 1) {
      const rz = ((ring * 0.31 - time * 0.16 - scrollBoost * 3.8) % 2.17 + 2.17) % 2.17 + 0.14;
      const radius = (0.78 / rz) * fov;
      const alpha = Math.max(0, Math.min(0.26, (1 - rz / 2.25) * (0.18 + portalSurge * 0.14)));
      if (alpha > 0.008 && radius < Math.max(width, height) * 1.7) {
        const waveShift = Math.sin(time * 1.1 + ring) * (6 / rz);
        ctx.beginPath();
        ctx.ellipse(
          vx,
          vy + waveShift,
          radius * 1.32,
          radius * 0.64,
          0,
          0,
          Math.PI * 2,
        );
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha.toFixed(3)})`;
        ctx.lineWidth = rz < 0.55 ? 1.5 : 1;
        ctx.stroke();
      }
    }

    // 4. Flux de particules 3D convergentes depuis le point de fuite
    const zStep = reduced ? 0 : 0.0022 + scrollBoost + portalSurge * 0.016;
    scrollBoost *= 0.91;
    portalSurge *= 0.94;
    time += 0.014;

    for (const p of particles) {
      p.z -= zStep;
      if (p.z <= 0.1) {
        p.z = 2.24;
        p.x = (Math.random() - 0.5) * 2.8;
        p.y = (Math.random() - 0.5) * 2.0;
      } else if (p.z > 2.26) {
        p.z = 0.12;
      }

      const waveY = Math.sin(time * 1.2 + p.phase) * 0.032;
      const px = vx + ((p.x - pointerX * 0.6) / p.z) * fov;
      const py = vy + ((p.y + waveY - pointerY * 0.6) / p.z) * fov;
      if (px < -40 || px > width + 40 || py < -40 || py > height + 40) continue;

      const depthAlpha = Math.max(0, Math.min(0.92, (1 - p.z / 2.3) * (0.82 + portalSurge * 0.18)));
      const r = Math.max(0.75, (p.size / p.z) * 1.35);

      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.min(255, cr + 35)}, ${Math.min(255, cg + 35)}, 255, ${depthAlpha.toFixed(3)})`;
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
