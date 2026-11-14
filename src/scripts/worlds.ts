/**
 * Immersion multi-mondes : suit le monde visible au défilement sans aucune
 * dépendance externe, sans stockage client ni perturbation de l'accessibilité.
 */
const WORLD_THEME: Record<string, string> = {
  command: '#06080d',
  architecture: '#0b1220',
  'key-studio': '#f3f6fa',
  workbench: '#10151e',
  vault: '#020306',
  'ai-lab': '#040c12',
  advisory: '#131722',
  editorial: '#07090e',
};

export function initWorlds(): void {
  const initialWorld = document.body.dataset.world ?? 'editorial';
  if (!document.body.dataset.activeWorld) {
    document.body.dataset.activeWorld = initialWorld;
  }

  const sections = [...document.querySelectorAll<HTMLElement>('[data-world-section]')];
  if (sections.length === 0) return;

  const railLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-world-link]')];
  const themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

  const setActive = (worldName: string) => {
    if (!worldName || document.body.dataset.activeWorld === worldName) return;
    document.body.dataset.activeWorld = worldName;
    if (themeMeta && WORLD_THEME[worldName]) {
      themeMeta.content = WORLD_THEME[worldName];
    }
    for (const link of railLinks) {
      const matches = link.dataset.worldLink === worldName;
      if (matches) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };

  const firstSection = sections[0];
  setActive(firstSection?.dataset.worldSection ?? initialWorld);

  if (!('IntersectionObserver' in window)) return;

  const ratios = new Map<HTMLElement, number>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        ratios.set(el, entry.isIntersecting ? entry.intersectionRatio : 0);
      }
      let best: HTMLElement | null = null;
      let bestScore = 0;
      for (const section of sections) {
        const score = ratios.get(section) ?? 0;
        if (score > bestScore) {
          bestScore = score;
          best = section;
        }
      }
      if (best?.dataset.worldSection) {
        setActive(best.dataset.worldSection);
      }
    },
    {
      threshold: [0, 0.15, 0.35, 0.55, 0.75],
      rootMargin: '-18% 0px -32% 0px',
    },
  );

  for (const section of sections) {
    observer.observe(section);
  }
}
