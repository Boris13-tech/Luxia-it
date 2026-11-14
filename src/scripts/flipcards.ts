/**
 * Cartes interactives 3D (recto / verso) : cliquer sur une carte la retourne
 * sur l'axe Y pour révéler l'explication détaillée, sans alourdir la lecture
 * initiale. Sans JavaScript, les deux faces restent lisibles l'une sous l'autre.
 */
export function initFlipCards(): void {
  const cards = [...document.querySelectorAll<HTMLElement>('[data-flip-card]')];
  if (cards.length === 0) return;

  document.documentElement.dataset.flipReady = 'true';

  for (const card of cards) {
    const trigger = card.querySelector<HTMLButtonElement>('[data-flip-trigger]');
    const setFlipped = (next: boolean) => {
      card.dataset.flipped = next ? 'true' : 'false';
      if (trigger) trigger.setAttribute('aria-expanded', next ? 'true' : 'false');
    };

    card.addEventListener('click', (event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('a')) return;
      setFlipped(card.dataset.flipped !== 'true');
    });

    card.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && card.dataset.flipped === 'true') {
        setFlipped(false);
        trigger?.focus();
      }
    });
  }
}
