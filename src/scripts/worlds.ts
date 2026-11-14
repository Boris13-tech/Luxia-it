/**
 * Immersion multi-mondes : suit le monde visible au défilement sans aucune
 * dépendance externe, sans stockage client ni perturbation de l'accessibilité.
 */
const WORLD_THEME: Record<string, string> = {
  command: '#06080d',
  architecture: '#080e1a',
  'key-studio': '#0b111e',
  workbench: '#090d14',
  vault: '#030508',
  'ai-lab': '#050b10',
  advisory: '#0b101a',
  editorial: '#07090e',
};

export function initWorlds(): void {
  document.documentElement.dataset.worldsReady = 'true';
  const initialWorld = document.body.dataset.world ?? 'editorial';
  if (!document.body.dataset.activeWorld) {
    document.body.dataset.activeWorld = initialWorld;
  }

  const sections = [...document.querySelectorAll<HTMLElement>('[data-world-section]')];
  if (sections.length === 0) return;

  const railLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-world-link]')];
  const themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

  const syncSectionStates = () => {
    const vh = window.innerHeight || 900;
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 80) {
        section.dataset.worldState = 'past';
      } else if (rect.top > vh * 0.88) {
        section.dataset.worldState = 'upcoming';
      } else {
        section.dataset.worldState = 'active';
      }
    }
  };

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
  syncSectionStates();

  if (!('IntersectionObserver' in window)) return;

  const ratios = new Map<HTMLElement, number>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        ratios.set(el, entry.isIntersecting ? entry.intersectionRatio : 0);
      }
      syncSectionStates();
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
      threshold: [0, 0.1, 0.25, 0.45, 0.65],
      rootMargin: '-12% 0px -20% 0px',
    },
  );

  for (const section of sections) {
    observer.observe(section);
  }
}
