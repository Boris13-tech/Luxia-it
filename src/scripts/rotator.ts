/**
 * Fait tourner les phrases d'un [data-rotator] (une toutes les 3,8 s).
 * Rien ne bouge avec prefers-reduced-motion, ni quand l'onglet est masqué.
 */
const INTERVAL = 3800;

export function initRotators(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  for (const rotator of document.querySelectorAll<HTMLElement>('[data-rotator]')) {
    const items = [...rotator.querySelectorAll<HTMLElement>('.rot__item')];
    if (items.length < 2) continue;

    let index = 0;
    window.setInterval(() => {
      if (document.hidden) return;
      items[index]?.classList.remove('is-active');
      index = (index + 1) % items.length;
      items[index]?.classList.add('is-active');
    }, INTERVAL);
  }
}
