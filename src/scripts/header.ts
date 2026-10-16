/**
 * En-tête : fond blanc après défilement, menu mobile plein écran, bouton
 * « haut de page ». Échap ferme le menu et rend le focus au bouton.
 */

const DESKTOP = '(min-width: 1100px)';

export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  const trigger = header.querySelector<HTMLButtonElement>('[data-menu-trigger]');
  const menu = header.querySelector<HTMLElement>('[data-menu]');
  const label = header.querySelector<HTMLElement>('[data-menu-label]');
  const toTop = document.querySelector<HTMLElement>('[data-to-top]');
  let menuOpen = false;

  const sync = () => {
    header.classList.toggle('is-solid', menuOpen || window.scrollY > 24);
    toTop?.classList.toggle('is-visible', window.scrollY > 600);
  };

  const setMenu = (open: boolean) => {
    if (!trigger || !menu) return;
    menuOpen = open;
    trigger.setAttribute('aria-expanded', String(open));
    menu.toggleAttribute('data-open', open);
    document.documentElement.classList.toggle('is-locked', open);
    if (label) label.textContent = open ? 'Fermer le menu' : 'Ouvrir le menu';
    sync();
  };

  trigger?.addEventListener('click', () => setMenu(!menuOpen));
  menu?.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuOpen) {
      setMenu(false);
      trigger?.focus();
    }
  });

  window.matchMedia(DESKTOP).addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });

  window.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('pageshow', () => setMenu(false));
  sync();
}
