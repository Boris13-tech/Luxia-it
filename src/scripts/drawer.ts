/**
 * Panneau latéral « Demander une démo » : intercepte les clics sur le CTA
 * d'en-tête (hors page /contact/) pour ouvrir un tiroir contextuel sobre
 * sans interrompre l'immersion en cours.
 */
export function initDrawer(): void {
  const backdrop = document.querySelector<HTMLElement>('[data-drawer-backdrop]');
  const drawer = document.querySelector<HTMLElement>('[data-drawer]');
  const closeBtn = document.querySelector<HTMLButtonElement>('[data-drawer-close]');
  const form = document.querySelector<HTMLFormElement>('[data-drawer-form]');
  const okBox = document.querySelector<HTMLElement>('[data-drawer-success]');
  const errBox = document.querySelector<HTMLElement>('[data-drawer-error]');

  if (!backdrop || !drawer || !closeBtn) return;

  let lastTrigger: HTMLElement | null = null;

  const close = () => {
    backdrop.removeAttribute('data-open');
    document.body.style.overflow = '';
    window.setTimeout(() => {
      if (!backdrop.hasAttribute('data-open')) {
        backdrop.hidden = true;
      }
    }, 320);
    lastTrigger?.focus();
  };

  const open = (trigger?: HTMLElement) => {
    lastTrigger = trigger ?? (document.activeElement as HTMLElement | null);
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      backdrop.setAttribute('data-open', 'true');
      drawer.focus();
    });
  };

  const isContactPage = window.location.pathname.startsWith('/contact');
  if (!isContactPage) {
    const triggers = document.querySelectorAll<HTMLElement>('.hdr__cta, [data-open-drawer]');
    for (const trigger of triggers) {
      trigger.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        open(trigger);
      });
    }
  }

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !backdrop.hidden) close();
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (okBox) okBox.hidden = true;
      if (errBox) errBox.hidden = true;
      const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      try {
        const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>);
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
        });
        if (res.ok) {
          form.reset();
          if (okBox) {
            okBox.hidden = false;
            okBox.focus();
          }
        } else if (errBox) {
          errBox.hidden = false;
          errBox.focus();
        }
      } catch {
        if (errBox) {
          errBox.hidden = false;
          errBox.focus();
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
}
