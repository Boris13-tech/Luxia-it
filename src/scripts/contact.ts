/**
 * Formulaire de contact : validation accessible, préselection du sujet
 * (?plateforme=…), champ piège anti-robots et envoi en POST vers l'adresse
 * configurée dans PUBLIC_FORM_ENDPOINT.
 */

type State = 'ok' | 'warn' | 'error';

export function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;

  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]');
  const fields = [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea')];

  const setStatus = (message: string, state: State) => {
    if (!status) return;
    status.textContent = message;
    status.dataset['state'] = state;
  };

  // Préselection depuis les liens « Demander une démo » des pages plateformes.
  const subject = form.querySelector<HTMLSelectElement>('select[name="plateforme"]');
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('plateforme') ?? params.get('sujet');
  if (subject && requested && [...subject.options].some((o) => o.value === requested)) {
    subject.value = requested;
  }

  for (const field of fields) {
    field.addEventListener('blur', () => {
      if (field.value !== '' || field.getAttribute('aria-invalid')) {
        field.setAttribute('aria-invalid', String(!field.checkValidity()));
      }
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const invalid = fields.filter((f) => !f.checkValidity());
    for (const field of fields) field.setAttribute('aria-invalid', String(invalid.includes(field)));
    if (invalid.length > 0) {
      invalid[0]?.focus();
      setStatus('Certains champs sont incomplets ou invalides.', 'error');
      return;
    }

    const data = new FormData(form);
    if (data.get('site_web')) return; // champ piège rempli : envoi ignoré

    const endpoint = form.dataset['endpoint'];
    if (!endpoint) {
      setStatus("Envoi désactivé : l'adresse de traitement du formulaire n'est pas encore configurée.", 'warn');
      return;
    }

    if (submit) submit.disabled = true;
    setStatus('Envoi en cours…', 'ok');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
        credentials: 'omit',
        referrerPolicy: 'strict-origin-when-cross-origin',
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      for (const field of fields) field.removeAttribute('aria-invalid');
      setStatus('Votre demande a été envoyée. Nous revenons vers vous rapidement.', 'ok');
    } catch {
      setStatus("L'envoi a échoué. Réessayez dans quelques instants.", 'error');
    } finally {
      if (submit) submit.disabled = false;
    }
  });
}
