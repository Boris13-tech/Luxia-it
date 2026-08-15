// Luxia-IT. 3D scenes for the hero and the pillars section.
// Corporate WebGL layer. Feature-detected, reduced-motion aware, mobile-tuned.
(function(){
const prm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = () => window.matchMedia('(max-width: 720px)').matches;
const hasWebGL = () => {
  const c = document.createElement('canvas');
  return !!(c.getContext('webgl2') || c.getContext('webgl'));
};

const makeSprite = () => {
  const cvs = document.createElement('canvas');
  cvs.width = cvs.height = 64;
  const g = cvs.getContext('2d');
  const grd = g.createRadialGradient(32,32,0,32,32,32);
  grd.addColorStop(0,'rgba(255,255,255,1)');
  grd.addColorStop(0.4,'rgba(255,255,255,0.6)');
  grd.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0,0,64,64);
  return cvs;
};

// ═══ Hero scene ═══════════════════════════════════════════════
const bootHero = async () => {
  const canvas = document.getElementById('hero-fx');
  if (!canvas || canvas.dataset.booted) return;
  canvas.dataset.booted = '1';
  if (!hasWebGL()) { canvas.style.display = 'none'; return; }
  const THREE = await import('three');
  const parent = canvas.parentElement;
  const isMob = mobile();

  const renderer = new THREE.WebGLRenderer({canvas, antialias:!isMob, alpha:true, powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, isMob?1.25:1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const cameraBaseZ = 18;
  camera.position.set(0, 0, cameraBaseZ);

  // Lattice
  const NODE_COUNT = isMob ? 90 : 200;
  const positions = new Float32Array(NODE_COUNT * 3);
  const pts = [];
  const R_BASE = 6.4;
  for (let i = 0; i < NODE_COUNT; i++) {
    const phi = Math.acos(1 - 2*(i+0.5)/NODE_COUNT);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const r = R_BASE + 0.9*Math.sin(theta*2 + phi*3);
    const x = r*Math.cos(theta)*Math.sin(phi);
    const y = r*Math.sin(theta)*Math.sin(phi);
    const z = r*Math.cos(phi);
    positions[i*3] = x; positions[i*3+1] = y; positions[i*3+2] = z;
    pts.push(new THREE.Vector3(x,y,z));
  }

  const lineArr = [];
  const D_MAX = 2.3;
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i+1; j < Math.min(i+9, NODE_COUNT); j++) {
      const d = pts[i].distanceTo(pts[j]);
      if (d < D_MAX) { lineArr.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z); }
    }
  }
  const lineGeom = new THREE.BufferGeometry();
  lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(lineArr, 3));
  const lineMat = new THREE.LineBasicMaterial({color: 0x9184d9, transparent:true, opacity:0.2});
  const lines = new THREE.LineSegments(lineGeom, lineMat);
  scene.add(lines);

  const dotGeom = new THREE.BufferGeometry();
  dotGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const sprite = new THREE.CanvasTexture(makeSprite());
  sprite.colorSpace = THREE.SRGBColorSpace;
  const dotMat = new THREE.PointsMaterial({size:0.22, map:sprite, transparent:true, opacity:0.85, depthWrite:false, blending:THREE.AdditiveBlending, color:0xcfd3e5});
  const dots = new THREE.Points(dotGeom, dotMat);
  scene.add(dots);

  const focals = [];
  const focalColors = [0x9184d9, 0xa7a1db, 0xd2cefd];
  for (let i = 0; i < 3; i++) {
    const geo = new THREE.SphereGeometry(0.19, 24, 24);
    const mat = new THREE.MeshBasicMaterial({color: focalColors[i]});
    const s = new THREE.Mesh(geo, mat);
    const ringGeo = new THREE.RingGeometry(0.34, 0.4, 48);
    const ringMat = new THREE.MeshBasicMaterial({color: focalColors[i], side: THREE.DoubleSide, transparent:true, opacity:0.4});
    const ring = new THREE.Mesh(ringGeo, ringMat);
    s.add(ring);
    scene.add(s);
    focals.push({mesh:s, ring, ringMat, phase: i * (Math.PI*2/3), radius: 7.4 + i*0.35});
  }

  const resize = () => {
    const r = parent.getBoundingClientRect();
    const w = Math.max(r.width, 1), h = Math.max(r.height, 1);
    renderer.setSize(w, h, false);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  let mx = 0, my = 0, tx = 0, ty = 0, scroll = 0;
  parent.addEventListener('pointermove', (e) => {
    const r = parent.getBoundingClientRect();
    mx = ((e.clientX - r.left)/r.width - 0.5) * 2;
    my = ((e.clientY - r.top)/r.height - 0.5) * 2;
  });
  const onScroll = () => { scroll = window.scrollY; };
  window.addEventListener('scroll', onScroll, {passive:true});

  requestAnimationFrame(() => canvas.classList.add('ready'));

  const start = performance.now();
  const reduced = prm();
  const tick = (now) => {
    const t = (now - start) / 1000;
    tx += (mx - tx) * 0.04;
    ty += (my - ty) * 0.04;

    if (!reduced) {
      lines.rotation.y = t * 0.05 + tx * 0.25;
      lines.rotation.x = Math.sin(t*0.08)*0.12 + ty * 0.18;
      dots.rotation.copy(lines.rotation);
      for (let i = 0; i < focals.length; i++) {
        const f = focals[i];
        const a = t*0.18 + f.phase;
        f.mesh.position.set(Math.cos(a)*f.radius, Math.sin(a*0.7 + f.phase)*2.2, Math.sin(a)*f.radius);
        f.ring.lookAt(camera.position);
        f.ringMat.opacity = 0.35 + 0.15*Math.sin(t*1.2 + i);
      }
    }

    const heroH = parent.offsetHeight || 800;
    const scrollN = Math.min(scroll/heroH, 1);
    // Camera dolly. The camera pushes forward as the user scrolls into the page. Subtle depth.
    camera.position.z = cameraBaseZ - scrollN * 3.2;
    camera.position.y = scrollN * -1.4;
    canvas.style.opacity = 1 - scrollN * 0.85;

    renderer.render(scene, camera);
    if (!document.hidden) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) requestAnimationFrame(tick); });
};

// ═══ Pillars scene. Three interconnected node clusters ═════════
const bootPillars = async () => {
  const canvas = document.getElementById('pillars-fx');
  if (!canvas || canvas.dataset.booted) return;
  canvas.dataset.booted = '1';
  if (!hasWebGL()) { canvas.style.display = 'none'; return; }
  const THREE = await import('three');
  const parent = canvas.parentElement;
  const isMob = mobile();

  const renderer = new THREE.WebGLRenderer({canvas, antialias:!isMob, alpha:true, powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, isMob?1.25:1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  // Three clusters. Products is a cube, Consulting is a mesh network, the Academy is a spiral.
  const groups = [];
  const colors = [0x9184d9, 0xa7a1db, 0xd2cefd];
  const centers = [
    new THREE.Vector3(-4.2, 0, 0),
    new THREE.Vector3( 0.0, 0, 0),
    new THREE.Vector3( 4.2, 0, 0),
  ];

  // 1) Products. A cube of nodes (a built object).
  const g0 = new THREE.Group();
  const cubePts = [];
  for (let x=-1;x<=1;x++) for (let y=-1;y<=1;y++) for (let z=-1;z<=1;z++) cubePts.push(new THREE.Vector3(x,y,z).multiplyScalar(1.1));
  const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.2,2.2,2.2));
  const cube = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color:colors[0], transparent:true, opacity:0.55}));
  g0.add(cube);
  const cubeDotsGeo = new THREE.BufferGeometry().setFromPoints(cubePts);
  const sprite = new THREE.CanvasTexture(makeSprite()); sprite.colorSpace = THREE.SRGBColorSpace;
  g0.add(new THREE.Points(cubeDotsGeo, new THREE.PointsMaterial({size:0.16, map:sprite, transparent:true, color:colors[0], depthWrite:false, blending:THREE.AdditiveBlending})));
  g0.position.copy(centers[0]);
  scene.add(g0);

  // 2) Consulting. A mesh network of nodes and connecting lines.
  const g1 = new THREE.Group();
  const netPts = [];
  const N = isMob ? 14 : 22;
  for (let i=0;i<N;i++){
    const a = (i/N)*Math.PI*2 + Math.random()*0.3;
    const r = 1.0 + Math.random()*0.6;
    netPts.push(new THREE.Vector3(Math.cos(a)*r, Math.sin(a)*r, (Math.random()-0.5)*0.6));
  }
  const netLineArr = [];
  for (let i=0;i<N;i++) for (let j=i+1;j<N;j++) {
    if (netPts[i].distanceTo(netPts[j]) < 1.2) {
      const p=netPts[i], q=netPts[j];
      netLineArr.push(p.x,p.y,p.z,q.x,q.y,q.z);
    }
  }
  const netLineGeo = new THREE.BufferGeometry();
  netLineGeo.setAttribute('position', new THREE.Float32BufferAttribute(netLineArr,3));
  g1.add(new THREE.LineSegments(netLineGeo, new THREE.LineBasicMaterial({color:colors[1], transparent:true, opacity:0.45})));
  const netDotsGeo = new THREE.BufferGeometry().setFromPoints(netPts);
  g1.add(new THREE.Points(netDotsGeo, new THREE.PointsMaterial({size:0.14, map:sprite, transparent:true, color:colors[1], depthWrite:false, blending:THREE.AdditiveBlending})));
  g1.position.copy(centers[1]);
  scene.add(g1);

  // 3) Academy. A helical, rising spiral.
  const g2 = new THREE.Group();
  const spiralPts = [];
  const M = isMob ? 40 : 70;
  for (let i=0;i<M;i++){
    const t = i/M;
    const a = t*Math.PI*4;
    spiralPts.push(new THREE.Vector3(Math.cos(a)*1.0, (t-0.5)*2.4, Math.sin(a)*1.0));
  }
  const spGeo = new THREE.BufferGeometry().setFromPoints(spiralPts);
  g2.add(new THREE.Line(spGeo, new THREE.LineBasicMaterial({color:colors[2], transparent:true, opacity:0.7})));
  g2.add(new THREE.Points(spGeo, new THREE.PointsMaterial({size:0.11, map:sprite, transparent:true, color:colors[2], depthWrite:false, blending:THREE.AdditiveBlending})));
  g2.position.copy(centers[2]);
  scene.add(g2);

  groups.push(g0, g1, g2);

  // Connecting arcs between the three clusters. The flywheel.
  const arcs = [];
  const drawArc = (from, to, color) => {
    const mid = from.clone().add(to).multiplyScalar(0.5);
    mid.y += 1.6;
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    const g = new THREE.BufferGeometry().setFromPoints(curve.getPoints(40));
    const m = new THREE.LineBasicMaterial({color, transparent:true, opacity:0.28});
    const l = new THREE.Line(g, m); scene.add(l); arcs.push(l);
  };
  drawArc(centers[0], centers[1], 0x9184d9);
  drawArc(centers[1], centers[2], 0xa7a1db);
  drawArc(centers[2], centers[0].clone().setY(-0.2), 0xd2cefd);

  const resize = () => {
    const r = parent.getBoundingClientRect();
    const w = Math.max(r.width, 1), h = Math.max(r.height, 1);
    renderer.setSize(w, h, false);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  requestAnimationFrame(() => canvas.classList.add('ready'));

  const reduced = prm();
  const start = performance.now();
  let inView = false;
  const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, {threshold:0.05});
  io.observe(canvas);

  const tick = (now) => {
    const t = (now - start) / 1000;
    if (!reduced) {
      groups[0].rotation.x = t*0.25; groups[0].rotation.y = t*0.3;
      groups[1].rotation.z = t*0.2;  groups[1].rotation.y = -t*0.15;
      groups[2].rotation.y = t*0.4;
    }
    if (inView) renderer.render(scene, camera);
    if (!document.hidden) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const boot = () => { bootHero(); bootPillars(); };
const start = () => {
  boot();
  // Retry after the DC template mount. The elements may not exist on the first tick.
  let tries = 0;
  const iv = setInterval(() => {
    tries++;
    const h = document.getElementById('hero-fx');
    const p = document.getElementById('pillars-fx');
    const heroDone = !h || h.classList.contains('ready') || h.style.display === 'none';
    const pillarsDone = !p || p.classList.contains('ready') || p.style.display === 'none';
    if (!heroDone) bootHero();
    if (!pillarsDone) bootPillars();
    if ((heroDone && pillarsDone) || tries > 40) clearInterval(iv);
  }, 250);
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
})();
