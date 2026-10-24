/**
 * Onglets accessibles (motif ARIA « tablist »), en amélioration progressive.
 *
 * Sans JavaScript, la liste d'onglets reste masquée et tous les panneaux
 * s'affichent à la suite, chacun avec son titre (CSS, requête « scripting »).
 * Le script :
 * - attribue les rôles et masque les panneaux inactifs ;
 * - gère le clavier : flèches, Début, Fin (focus mobile, activation directe) ;
 * - place l'indicateur de l'onglet actif (variables CSS --ind-x et --ind-w) ;
 * - marque le panneau qui arrive (data-entering) : src/styles/motion.css
 *   l'anime, ainsi que les liaisons de ses schémas, sauf mouvement réduit ;
 * - en mode « étapes » (data-tabs-stepper) : Précédent / Suivant, annonce
 *   « Étape n sur N », rail de progression (--progress) et lecture du
 *   parcours étape par étape, que l'on peut mettre en pause ;
 * - ouvre le panneau visé par l'ancre de l'adresse.
 * Aucune dépendance, aucun innerHTML.
 */

const STEP_DELAY_MS = 3800;

function enhance(root: HTMLElement): void {
  const list = root.querySelector<HTMLElement>('[data-tablist]');
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-tab]')];
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls') ?? ''));
  if (!list || tabs.length === 0 || panels.some((p) => p === null)) return;

  const stepper = root.hasAttribute('data-tabs-stepper');
  const prev = root.querySelector<HTMLButtonElement>('[data-step-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-step-next]');
  const play = root.querySelector<HTMLButtonElement>('[data-step-play]');
  const status = root.querySelector<HTMLElement>('[data-step-status]');
  let current = -1;
  let timer: number | undefined;

  const placeIndicator = () => {
    const tab = tabs[current];
    if (!tab) return;
    list.style.setProperty('--ind-x', `${tab.offsetLeft}px`);
    list.style.setProperty('--ind-w', String(tab.offsetWidth));
  };

  const mark = (el: Element | null | undefined) => {
    if (!el) return;
    el.removeAttribute('data-entering');
    // Relance l'animation à l'image suivante, sans lecture de dimensions.
    requestAnimationFrame(() => el.setAttribute('data-entering', ''));
    el.addEventListener('animationend', (e) => e.target === el && el.removeAttribute('data-entering'));
  };

  const render = (index: number, focus: boolean, animate: boolean) => {
    current = index;
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const panel = panels[i];
      if (panel) panel.hidden = !selected;
    });
    root.dataset['active'] = tabs[index]?.dataset['tab'] ?? String(index);
    // Au premier rendu, aucune lecture de dimensions (pas de mise en page
    // forcée) : le ResizeObserver place l'indicateur une fois la page calculée.
    if (animate) placeIndicator();
    if (animate) {
      mark(panels[index]);
      if (stepper) mark(tabs[index]);
    }
    if (stepper) {
      root.style.setProperty('--progress', String((index + 1) / tabs.length));
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === tabs.length - 1;
      if (status) status.textContent = `Étape ${index + 1} sur ${tabs.length}`;
    }
    if (focus) tabs[index]?.focus();
  };

  const stop = () => {
    if (timer === undefined) return;
    window.clearInterval(timer);
    timer = undefined;
    if (play) {
      play.setAttribute('aria-pressed', 'false');
      play.textContent = current === tabs.length - 1 ? 'Relancer le parcours' : 'Reprendre le parcours';
    }
  };

  const select = (index: number, focus = false) => {
    if (index === current) {
      if (focus) tabs[index]?.focus();
      return;
    }
    render(index, focus, true);
  };

  /** Action de la personne : arrête la lecture automatique. */
  const userSelect = (index: number, focus = false) => {
    stop();
    select(index, focus);
  };

  tabs.forEach((tab, i) => {
    tab.setAttribute('role', 'tab');
    const panel = panels[i];
    if (panel) {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.tabIndex = 0;
    }
    tab.addEventListener('click', () => userSelect(i));
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
      userSelect(target, true);
    });
  });

  prev?.addEventListener('click', () => userSelect(Math.max(0, current - 1)));
  next?.addEventListener('click', () => userSelect(Math.min(tabs.length - 1, current + 1)));

  play?.addEventListener('click', () => {
    if (timer !== undefined) {
      stop();
      return;
    }
    if (current === tabs.length - 1) select(0);
    play.setAttribute('aria-pressed', 'true');
    play.textContent = 'Mettre en pause';
    timer = window.setInterval(() => {
      if (current >= tabs.length - 1) {
        stop();
        return;
      }
      select(current + 1);
      if (current === tabs.length - 1) stop();
    }, STEP_DELAY_MS);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
  });

  // Les largeurs changent quand la police arrive ou que l'écran change.
  new ResizeObserver(placeIndicator).observe(list);

  const fromHash = panels.findIndex((p) => p && `#${p.id}` === window.location.hash);
  root.setAttribute('data-enhanced', '');
  render(Math.max(0, fromHash), false, false);
  // Le mouvement n'est activé qu'après le premier rendu : rien ne bouge au chargement.
  requestAnimationFrame(() => root.setAttribute('data-motion', ''));
}

export function initTabs(): void {
  for (const root of document.querySelectorAll<HTMLElement>('[data-tabs]')) enhance(root);
}
