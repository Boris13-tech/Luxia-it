/**
 * Modèle de la constellation, partagé par la scène WebGL (constellation.ts)
 * et par son image fixe, calculée au build (ConstellationScene.astro) : les
 * deux montrent exactement les mêmes nœuds.
 *
 * Ce que représente la scène : des identités (personnes, services, agents)
 * reliées entre elles et au registre central. Quelques liaisons mènent au
 * registre : les impulsions qui les parcourent sont des demandes de connexion.
 */

export type Variant = 'identity' | 'key' | 'alma';

/** Familles de nœuds : 0 identité, 1 ressource, 2 agent IA, 3 en attente, 4 décision au journal. */
export type Kind = 0 | 1 | 2 | 3 | 4;

export interface Model {
  /** x, y, z par nœud, dans une sphère de rayon 1 ; le nœud 0 est le registre. */
  positions: Float32Array;
  sizes: Float32Array;
  kinds: Uint8Array;
  /** Paires d'indices de nœuds. */
  edges: Uint32Array;
  /** 1 si la liaison mène au registre (elle porte des impulsions). */
  spokes: Uint8Array;
}

/** Générateur pseudo-aléatoire déterministe (mulberry32). */
export function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MIX: Record<Variant, readonly number[]> = {
  // Probabilités cumulées des familles 0 à 4
  identity: [0.8, 0.88, 0.93, 0.96, 1],
  key: [0.7, 0.9, 0.92, 0.95, 1],
  alma: [0.38, 0.46, 0.9, 0.95, 1],
};

export function buildModel(count: number, variant: Variant, seed = 7): Model {
  const rnd = random(seed);
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const kinds = new Uint8Array(count);
  const mix = MIX[variant];

  // Le registre, au centre
  sizes[0] = 1;
  kinds[0] = 0;

  for (let i = 1; i < count; i += 1) {
    // Répartition en coquille épaisse, aplatie : une galaxie plutôt qu'une boule
    const u = rnd() * 2 - 1;
    const theta = rnd() * Math.PI * 2;
    const r = 0.32 + Math.pow(rnd(), 0.7) * 0.68;
    const s = Math.sqrt(1 - u * u);
    positions[i * 3] = r * s * Math.cos(theta);
    positions[i * 3 + 1] = r * u * 0.62;
    positions[i * 3 + 2] = r * s * Math.sin(theta);
    const k = rnd();
    kinds[i] = Math.max(0, mix.findIndex((p) => k < p)) as Kind;
    sizes[i] = 0.18 + Math.pow(rnd(), 3) * 0.55;
  }

  // Deux voisins les plus proches par nœud, sous un seuil de distance. Grille
  // spatiale de la taille du seuil : chaque nœud ne compare que les 27 cases
  // voisines (calcul quasi linéaire, aucune tâche longue au démarrage).
  const pairs = new Set<string>();
  const edges: number[] = [];
  const spokes: number[] = [];
  const cell = 0.22;
  const limit = cell * cell;
  const cellOf = (v: number) => Math.floor((v + 1) / cell);
  const buckets = new Map<string, number[]>();
  for (let i = 1; i < count; i += 1) {
    const key = `${cellOf(positions[i * 3] ?? 0)},${cellOf(positions[i * 3 + 1] ?? 0)},${cellOf(positions[i * 3 + 2] ?? 0)}`;
    const list = buckets.get(key);
    if (list) list.push(i);
    else buckets.set(key, [i]);
  }
  for (let i = 1; i < count; i += 1) {
    let b1 = -1;
    let b2 = -1;
    let d1 = Infinity;
    let d2 = Infinity;
    const xi = positions[i * 3] ?? 0;
    const yi = positions[i * 3 + 1] ?? 0;
    const zi = positions[i * 3 + 2] ?? 0;
    const cx = cellOf(xi);
    const cy = cellOf(yi);
    const cz = cellOf(zi);
    for (let gx = cx - 1; gx <= cx + 1; gx += 1)
      for (let gy = cy - 1; gy <= cy + 1; gy += 1)
        for (let gz = cz - 1; gz <= cz + 1; gz += 1) {
          for (const j of buckets.get(`${gx},${gy},${gz}`) ?? []) {
            if (j === i) continue;
            const dx = (positions[j * 3] ?? 0) - xi;
            const dy = (positions[j * 3 + 1] ?? 0) - yi;
            const dz = (positions[j * 3 + 2] ?? 0) - zi;
            const d = dx * dx + dy * dy + dz * dz;
            if (d < d1) {
              d2 = d1;
              b2 = b1;
              d1 = d;
              b1 = j;
            } else if (d < d2) {
              d2 = d;
              b2 = j;
            }
          }
        }
    for (const [b, d] of [
      [b1, d1],
      [b2, d2],
    ] as const) {
      if (b < 0 || d > limit) continue;
      const key = i < b ? `${i}-${b}` : `${b}-${i}`;
      if (pairs.has(key)) continue;
      pairs.add(key);
      edges.push(i, b);
      spokes.push(0);
    }
  }

  // Liaisons vers le registre : une petite part des nœuds, les plus proches
  for (let i = 1; i < count; i += 1) {
    const x = positions[i * 3] ?? 0;
    const y = positions[i * 3 + 1] ?? 0;
    const z = positions[i * 3 + 2] ?? 0;
    const near = Math.sqrt(x * x + y * y + z * z) < 0.55;
    if (near && rnd() < 0.16) {
      edges.push(i, 0);
      spokes.push(1);
    }
  }

  return { positions, sizes, kinds, edges: new Uint32Array(edges), spokes: new Uint8Array(spokes) };
}

/** Couleurs des familles par univers (RVB linéaire, 0 à 1). */
export function palette(variant: Variant): readonly [number, number, number][] {
  const blue: [number, number, number] = [0.36, 0.61, 1];
  const glacier: [number, number, number] = [0.61, 0.78, 1];
  const violet: [number, number, number] = [0.66, 0.55, 0.98];
  const amber: [number, number, number] = [0.91, 0.69, 0.31];
  const warm: [number, number, number] = [0.95, 0.89, 0.76];
  if (variant === 'key') return [[0.55, 0.7, 0.91], glacier, violet, amber, warm];
  if (variant === 'alma') return [blue, glacier, violet, amber, warm];
  return [blue, glacier, violet, amber, warm];
}
