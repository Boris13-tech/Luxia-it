/**
 * Onglets accessibles (motif ARIA « tablist »), en amélioration progressive.
 *
 * Sans JavaScript, la liste d'onglets reste masquée et tous les panneaux
 * s'affichent à la suite, chacun avec son titre (CSS, requête « scripting »).
 * Le script :
 * - attribue les rôles et masque les panneaux inactifs ;
 * - gère le clavier : flèches, Début, Fin (focus mobile, activation directe) ;
 * - en mode « étapes » (data-tabs-stepper), active Précédent / Suivant et
 *   annonce « Étape n sur N » ;
 * - ouvre le panneau visé par l'ancre de l'adresse ;
 * - anime le changement par une View Transition native, sauf si
 *   prefers-reduced-motion est actif ou si le navigateur ne la gère pas.
 * Aucune dépendance, aucun innerHTML.
 */

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type ViewTransitionDoc = Document & { startViewTransition?: (update: () => void) => { finished: Promise<void> } };

function enhance(root: HTMLElement): void {
  const list = root.querySelector<HTMLElement>('[data-tablist]');
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-tab]')];
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls') ?? ''));
  if (!list || tabs.length === 0 || panels.some((p) => p === null)) return;

  const stepper = root.hasAttribute('data-tabs-stepper');
  const prev = root.querySelector<HTMLButtonElement>('[data-step-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-step-next]');
  const status = root.querySelector<HTMLElement>('[data-step-status]');
  let current = 0;

  const render = (index: number, focus: boolean) => {
    current = index;
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const panel = panels[i];
      if (panel) panel.hidden = !selected;
    });
    root.dataset['active'] = tabs[index]?.dataset['tab'] ?? String(index);
    if (stepper) {
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === tabs.length - 1;
      if (status) status.textContent = `Étape ${index + 1} sur ${tabs.length}`;
    }
    if (focus) tabs[index]?.focus();
  };

  const select = (index: number, focus = false) => {
    if (index === current) {
      if (focus) tabs[index]?.focus();
      return;
    }
    const doc = document as ViewTransitionDoc;
    if (!doc.startViewTransition || reduceMotion()) {
      render(index, focus);
      return;
    }
    // Seule la zone des panneaux de ce composant participe à la transition.
    const area = root.querySelector<HTMLElement>('[data-panels]') ?? root;
    area.style.setProperty('view-transition-name', 'tabs-panels');
    doc
      .startViewTransition(() => render(index, focus))
      .finished.finally(() => area.style.removeProperty('view-transition-name'));
  };

  list.setAttribute('role', 'tablist');
  tabs.forEach((tab, i) => {
    tab.setAttribute('role', 'tab');
    const panel = panels[i];
    if (panel) {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.tabIndex = 0;
    }
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', (event) => {
      const last = tabs.length - 1;
      const target =
        event.key === 'ArrowRight' || event.key === 'ArrowDown'
          ? (i + 1) % tabs.length
          : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
            ? (i - 1 + tabs.length) % tabs.length
            : event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? last
                : null;
      if (target === null) return;
      event.preventDefault();
      select(target, true);
    });
  });

  prev?.addEventListener('click', () => select(Math.max(0, current - 1)));
  next?.addEventListener('click', () => select(Math.min(tabs.length - 1, current + 1)));

  const fromHash = panels.findIndex((p) => p && `#${p.id}` === window.location.hash);
  const initial = Math.max(0, fromHash);
  root.setAttribute('data-enhanced', '');
  render(initial, false);
}

export function initTabs(): void {
  for (const root of document.querySelectorAll<HTMLElement>('[data-tabs]')) enhance(root);
}
