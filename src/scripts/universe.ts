/**
 * Navigateur d'univers (src/components/UniverseNavigator.astro).
 * - Ouverture et fermeture : relais des boutons `commandfor` pour les
 *   navigateurs qui ne connaissent pas encore les commandes d'invocation.
 * - Clic sur le fond : ferme le menu.
 * - Survol ou focus d'une destination ou d'un domaine : met en lumière le
 *   domaine dans la constellation et affiche son aperçu.
 * Le <dialog> modal gère lui-même le piège de focus, Échap et le retour du
 * focus au bouton d'ouverture.
 */

export function initUniverse(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-universe]');
  if (!dialog) return;

  const openers = document.querySelectorAll<HTMLButtonElement>('[data-universe-open]');
  const closers = dialog.querySelectorAll<HTMLButtonElement>('[data-universe-close]');
  const native = 'command' in HTMLButtonElement.prototype;

  const sync = () => openers.forEach((b) => b.setAttribute('aria-expanded', String(dialog.open)));
  dialog.addEventListener('toggle', sync);
  dialog.addEventListener('close', sync);

  if (!native) {
    openers.forEach((b) =>
      b.addEventListener('click', () => {
        if (!dialog.open) dialog.showModal();
        sync();
      }),
    );
    closers.forEach((b) => b.addEventListener('click', () => dialog.close()));
  }

  // Clic hors du contenu (sur le fond du dialogue lui-même) : fermeture
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  // Une page restaurée depuis le cache arrière ne doit pas rouvrir le menu
  window.addEventListener('pageshow', () => {
    if (dialog.open) dialog.close();
  });

  const previews = dialog.querySelectorAll<HTMLElement>('[data-preview]');
  const nodes = dialog.querySelectorAll<HTMLElement>('.univ__node');
  const edges = dialog.querySelectorAll<SVGElement>('[data-edge]');

  const light = (id: string) => {
    previews.forEach((p) => (p.hidden = p.dataset['preview'] !== id));
    nodes.forEach((n) => n.classList.toggle('is-lit', n.querySelector(`[data-domain="${id}"]`) !== null));
    edges.forEach((e) => e.classList.toggle('is-lit', (e.dataset['edge'] ?? '').split(' ').includes(id)));
  };

  dialog.querySelectorAll<HTMLElement>('[data-domain]').forEach((el) => {
    const id = el.dataset['domain'];
    if (!id) return;
    el.addEventListener('pointerenter', () => light(id));
    el.addEventListener('focus', () => light(id));
  });
}
