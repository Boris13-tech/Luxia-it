// Contact form. Client-side validation and submission stub.
// No credentials, tokens or endpoints are hardcoded here. When a backend
// is wired in, replace SUBMIT_ENDPOINT with an environment-configured URL
// injected at deploy time (a static-hosting redirect rule, a form service,
// or a small serverless function). Until then the form validates locally
// and shows a confirmation. It does NOT transmit user data.
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('contact-status');
  const submitBtn = document.getElementById('submit-btn');
  const SUBMIT_ENDPOINT = ''; // For example '/api/contact'. Configure at deploy time.

  if (submitBtn) submitBtn.disabled = false;

  const show = (msg, ok) => {
    if (!status) return;
    status.style.display = 'block';
    status.textContent = msg;
    status.style.borderColor = ok ? 'var(--color-accent)' : '#c94a4a';
    status.style.color = ok ? 'var(--color-accent)' : '#c94a4a';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    // Simple client-side sanity checks; the backend must re-validate.
    if (name.length < 2) return show('Please enter your name.', false);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return show('Please enter a valid email address.', false);

    if (!SUBMIT_ENDPOINT) {
      show('This form is not connected in the current build. Until the submission endpoint is configured at deploy time, please write to contact@legrand-tech.com directly. Your message has not been transmitted.', false);
      return;
    }

    try {
      const res = await fetch(SUBMIT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'omit',
        body: JSON.stringify(Object.fromEntries(data.entries()))
      });
      if (!res.ok) throw new Error('Request failed');
      form.reset();
      show('Thanks. A senior engineer will reply within two working days.', true);
    } catch (err) {
      show('Sorry, the message could not be sent. Please email contact@legrand-tech.com directly.', false);
    }
  });
})();
