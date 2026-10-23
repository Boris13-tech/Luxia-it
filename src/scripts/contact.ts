/**
 * Formulaire de contact, amélioration progressive :
 * - présélection du sujet (?sujet=… ou ?plateforme=…) ;
 * - vérification que le traitement est disponible, sinon repli e-mail et téléphone ;
 * - validation accessible : message sous chaque champ, résumé d'erreurs focalisé ;
 * - envoi sans rechargement, réponse lue en JSON.
 * Aucun innerHTML : compatible avec la politique Trusted Types du site.
 */

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const ENDPOINT = '/api/contact';

const LABELS: Record<string, string> = {
  nom: 'Nom et prénom',
  organisation: 'Organisation',
  fonction: 'Fonction',
  email: 'E-mail professionnel',
  sujet: 'Sujet',
  deploiement: 'Déploiement envisagé',
  message: 'Votre contexte',
};

function messageFor(control: Control): string {
  const v = control.validity;
  const label = LABELS[control.name] ?? control.name;
  if (v.valueMissing) return `Indiquez ${label.toLowerCase()}.`;
  if (v.typeMismatch) return 'Indiquez une adresse e-mail valide, par exemple nom@organisation.fr.';
  if (v.tooShort && control instanceof HTMLTextAreaElement)
    return `Décrivez votre contexte en au moins ${control.minLength} caractères.`;
  if (v.tooShort && control instanceof HTMLInputElement) return `${label} : au moins ${control.minLength} caractères.`;
  if (v.tooLong) return `${label} : trop long.`;
  return `${label} : valeur invalide.`;
}

export function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;

  const summary = form.querySelector<HTMLElement>('[data-summary]');
  const summaryList = form.querySelector<HTMLUListElement>('[data-summary-list]');
  const status = form.querySelector<HTMLElement>('[data-status]');
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]');
  const fallback = document.querySelector<HTMLElement>('[data-fallback]');
  const success = document.querySelector<HTMLElement>('[data-success]');
  const controls = [...form.querySelectorAll<Control>('input:not([name="site_web"]), select, textarea')];

  // La validation est prise en charge par le script : messages en français, résumé.
  form.noValidate = true;

  const params = new URLSearchParams(window.location.search);
  const requested = params.get('sujet') ?? params.get('plateforme');
  const subject = form.querySelector<HTMLSelectElement>('select[name="sujet"]');
  if (subject && requested && [...subject.options].some((o) => o.value === requested)) subject.value = requested;

  const showFallback = (moveFocus = false) => {
    form.hidden = true;
    if (!fallback) return;
    fallback.hidden = false;
    if (moveFocus) fallback.focus();
  };

  // Le traitement est-il configuré ? Sinon, inutile de laisser saisir un message.
  fetch(ENDPOINT, { method: 'GET', headers: { Accept: 'application/json' }, credentials: 'omit', cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : { ready: false }))
    .then((body: { ready?: boolean }) => {
      if (!body.ready) showFallback();
    })
    .catch(() => showFallback());

  const setError = (control: Control, message: string | null) => {
    const error = form.querySelector<HTMLElement>(`[data-error-for="${control.name}"]`);
    control.setAttribute('aria-invalid', String(message !== null));
    if (!error) return;
    error.textContent = message ?? '';
    error.hidden = message === null;
  };

  const setStatus = (text: string, state: 'info' | 'error') => {
    if (!status) return;
    status.textContent = text;
    status.dataset['state'] = state;
  };

  const showSummary = (invalid: Control[]) => {
    if (!summary || !summaryList) return;
    summaryList.replaceChildren(
      ...invalid.map((control) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${control.id}`;
        link.textContent = messageFor(control);
        link.addEventListener('click', (event) => {
          event.preventDefault();
          control.focus();
        });
        item.append(link);
        return item;
      }),
    );
    summary.hidden = invalid.length === 0;
    if (invalid.length > 0) summary.focus();
  };

  for (const control of controls) {
    control.addEventListener('blur', () => {
      if (control.getAttribute('aria-invalid') === 'true' || control.value !== '') {
        setError(control, control.checkValidity() ? null : messageFor(control));
      }
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const invalid = controls.filter((c) => !c.checkValidity());
    for (const control of controls) setError(control, invalid.includes(control) ? messageFor(control) : null);
    showSummary(invalid);
    if (invalid.length > 0) return;

    if (submit) submit.disabled = true;
    setStatus('Envoi en cours…', 'info');
    try {
      const body = new URLSearchParams();
      for (const [key, value] of new FormData(form)) if (typeof value === 'string') body.append(key, value);
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        credentials: 'omit',
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string; fields?: string[] };
      if (response.ok && result.ok) {
        form.reset();
        form.hidden = true;
        if (success) {
          success.hidden = false;
          success.focus();
        }
        return;
      }
      if (result.fields && result.fields.length > 0) {
        const bad = controls.filter((c) => result.fields?.includes(c.name));
        for (const control of bad) setError(control, messageFor(control));
        showSummary(bad);
      }
      setStatus(result.message ?? 'Le message n’a pas pu être transmis. Écrivez-nous directement par e-mail.', 'error');
      if (response.status === 503 || response.status === 502) showFallback(true);
    } catch {
      setStatus('Le message n’a pas pu être transmis. Écrivez-nous directement par e-mail ou par téléphone.', 'error');
      showFallback(true);
    } finally {
      if (submit) submit.disabled = false;
    }
  });
}
