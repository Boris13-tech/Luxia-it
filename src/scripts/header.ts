/**
 * Navigation mobile : ouverture par le bouton, fermeture par Échap (le focus
 * revient au bouton), par un lien ou au passage en affichage large.
 */

const DESKTOP = '(min-width: 1120px)';

export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const trigger = header?.querySelector<HTMLButtonElement>('[data-menu-trigger]');
  const menu = header?.querySelector<HTMLElement>('[data-menu]');
  const label = header?.querySelector<HTMLElement>('[data-menu-label]');
  if (!header || !trigger || !menu) return;

  let open = false;

  const setMenu = (next: boolean) => {
    open = next;
    trigger.setAttribute('aria-expanded', String(open));
    menu.toggleAttribute('data-open', open);
    document.documentElement.classList.toggle('is-locked', open);
    if (label) label.textContent = (open ? label.dataset['closeLabel'] : label.dataset['openLabel']) ?? '';
  };

  trigger.addEventListener('click', () => setMenu(!open));

  menu.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) {
      setMenu(false);
      trigger.focus();
    }
  });

  window.matchMedia(DESKTOP).addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });

  window.addEventListener('pageshow', () => setMenu(false));
}
