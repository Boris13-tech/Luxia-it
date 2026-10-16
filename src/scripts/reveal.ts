/**
 * Révélation discrète au scroll. Seuls les éléments situés sous le premier
 * écran sont masqués puis révélés : sans JS, ou avec prefers-reduced-motion,
 * tout reste visible.
 */
export function initReveal(): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
  );

  const fold = window.innerHeight;
  for (const el of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
    if (el.getBoundingClientRect().top < fold) continue;
    el.classList.add('reveal');
    observer.observe(el);
  }
}
