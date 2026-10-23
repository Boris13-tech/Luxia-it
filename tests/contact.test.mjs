// Tests du traitement du formulaire de contact (api/contact.ts).
// Lancement : npm test (node --test, types effacés par Node, sans dépendance).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RateLimiter, clean, delivery, handleContact, renderEmail, validate } from '../api/contact.ts';

const ORIGIN = 'https://luxia-it.com';
const valid = {
  nom: 'Camille Martin',
  organisation: 'Exemple SA',
  fonction: 'RSSI',
  email: 'camille@exemple.fr',
  sujet: 'cadrage',
  deploiement: 'opere',
  message: 'Nous voulons centraliser les accès de nos prestataires.',
  site_web: '',
};

const ready = { RESEND_API_KEY: 'test-key', CONTACT_FROM: 'Site <formulaire@luxia-it.com>' };

function deps(fetchImpl) {
  const events = [];
  const calls = [];
  return {
    events,
    calls,
    deps: {
      fetch: async (url, init) => {
        calls.push({ url, init });
        return fetchImpl ? fetchImpl(url, init) : new Response('{}', { status: 200 });
      },
      now: () => 1_000,
      log: (e) => events.push(e),
    },
  };
}

function post(fields = valid, headers = {}) {
  const body = new URLSearchParams(fields).toString();
  return new Request('https://luxia-it.com/api/contact', {
    method: 'POST',
    headers: {
      Origin: ORIGIN,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      'X-Forwarded-For': '203.0.113.7',
      ...headers,
    },
    body,
  });
}

test('un envoi valide est transmis au prestataire, sans donnée personnelle dans les journaux', async () => {
  const d = deps();
  const res = await handleContact(post(), ready, d.deps, new RateLimiter());
  assert.equal(res.status, 200);
  assert.equal((await res.json()).code, 'sent');
  assert.equal(d.calls.length, 1);
  assert.equal(d.calls[0].url, 'https://api.resend.com/emails');
  const payload = JSON.parse(d.calls[0].init.body);
  assert.deepEqual(payload.to, ['Contact@Luxia-it.com']);
  assert.equal(payload.reply_to, 'camille@exemple.fr');
  assert.match(payload.subject, /^\[Site\] Échange de cadrage — Exemple SA$/);
  const logged = JSON.stringify(d.events);
  for (const secret of ['Camille', 'camille@exemple.fr', 'Exemple SA', '203.0.113.7', 'prestataires']) {
    assert.ok(!logged.includes(secret), `journal sans « ${secret} »`);
  }
});

test('le champ piège rempli renvoie un succès apparent sans rien transmettre', async () => {
  const d = deps();
  const res = await handleContact(post({ ...valid, site_web: 'https://spam.example' }), ready, d.deps, new RateLimiter());
  assert.equal(res.status, 200);
  assert.equal(d.calls.length, 0);
  assert.equal(d.events[0].reason, 'honeypot');
});

test('une origine étrangère est refusée', async () => {
  const d = deps();
  const res = await handleContact(post(valid, { Origin: 'https://evil.example' }), ready, d.deps, new RateLimiter());
  assert.equal(res.status, 403);
  assert.equal(d.calls.length, 0);
});

test('sans en-tête Origin, seul un envoi du même site est accepté', async () => {
  const d = deps();
  const noOrigin = post(valid, { Origin: '' });
  noOrigin.headers.delete('origin');
  assert.equal((await handleContact(noOrigin, ready, d.deps, new RateLimiter())).status, 403);
  const sameSite = post(valid, { 'Sec-Fetch-Site': 'same-origin' });
  sameSite.headers.delete('origin');
  assert.equal((await handleContact(sameSite, ready, d.deps, new RateLimiter())).status, 200);
});

test('les aperçus Vercel acceptent leur propre origine', async () => {
  const d = deps();
  const env = { ...ready, VERCEL_ENV: 'preview', VERCEL_URL: 'luxia-it-abc.vercel.app' };
  const res = await handleContact(post(valid, { Origin: 'https://luxia-it-abc.vercel.app' }), env, d.deps, new RateLimiter());
  assert.equal(res.status, 200);
});

test('les champs invalides sont listés', async () => {
  const d = deps();
  const res = await handleContact(
    post({ ...valid, email: 'pas-une-adresse', message: 'court', sujet: 'inconnu' }),
    ready,
    d.deps,
    new RateLimiter(),
  );
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.deepEqual(body.fields.sort(), ['email', 'message', 'sujet']);
  assert.equal(d.calls.length, 0);
});

test('un retour à la ligne ne peut pas s’injecter dans l’objet de l’e-mail', () => {
  const result = validate(new URLSearchParams({ ...valid, organisation: 'Exemple\r\nBcc: victime@exemple.fr' }));
  assert.equal(result.ok, true);
  const { subject } = renderEmail(result.value);
  assert.ok(!/[\r\n]/.test(subject));
  assert.equal(clean('a\u0000b\nc'), 'a b c');
  assert.equal(clean(`a${String.fromCharCode(0x2028)}b${String.fromCharCode(0x2029)}c`), 'a b c');
});

test('un corps trop long est refusé', async () => {
  const d = deps();
  const res = await handleContact(post({ ...valid, message: 'x'.repeat(20_000) }), ready, d.deps, new RateLimiter());
  assert.equal(res.status, 413);
});

test('seul le format application/x-www-form-urlencoded est accepté', async () => {
  const d = deps();
  const req = new Request('https://luxia-it.com/api/contact', {
    method: 'POST',
    headers: { Origin: ORIGIN, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(valid),
  });
  assert.equal((await handleContact(req, ready, d.deps, new RateLimiter())).status, 415);
});

test('la limitation de débit bloque au sixième envoi d’un même client', async () => {
  const d = deps();
  const rate = new RateLimiter();
  const statuses = [];
  for (let i = 0; i < 6; i += 1) statuses.push((await handleContact(post(), ready, d.deps, rate)).status);
  assert.deepEqual(statuses, [200, 200, 200, 200, 200, 429]);
  const other = await handleContact(post(valid, { 'X-Forwarded-For': '198.51.100.9' }), ready, d.deps, rate);
  assert.equal(other.status, 200);
});

test('une empreinte expirée est retirée de la mémoire', () => {
  const rate = new RateLimiter(1000, 5, 100);
  assert.equal(rate.take('a', 0), true);
  assert.equal(rate.size, 1);
  assert.equal(rate.take('b', 2000), true);
  assert.equal(rate.size, 1);
});

test('sans configuration, le formulaire se déclare indisponible', async () => {
  const d = deps();
  const res = await handleContact(post(), {}, d.deps, new RateLimiter());
  assert.equal(res.status, 503);
  const health = await handleContact(new Request('https://luxia-it.com/api/contact'), {}, d.deps);
  assert.equal(health.status, 503);
  assert.deepEqual(await health.json(), { ready: false });
  const ok = await handleContact(new Request('https://luxia-it.com/api/contact'), ready, d.deps);
  assert.deepEqual(await ok.json(), { ready: true });
});

test('le mode « log » est refusé en production', () => {
  assert.equal(delivery({ CONTACT_DELIVERY: 'log' }), 'log');
  assert.equal(delivery({ CONTACT_DELIVERY: 'log', VERCEL_ENV: 'production' }), null);
});

test('un échec du prestataire renvoie une erreur et un repli', async () => {
  const d = deps(() => new Response('{}', { status: 500 }));
  const res = await handleContact(post(), ready, d.deps, new RateLimiter());
  assert.equal(res.status, 502);
  assert.equal(d.events[0].reason, 'provider_500');
  const down = deps(() => {
    throw new Error('réseau');
  });
  assert.equal((await handleContact(post(), ready, down.deps, new RateLimiter())).status, 502);
});

test('sans JavaScript, la réponse redirige vers une page de résultat', async () => {
  const d = deps();
  const ok = await handleContact(post(valid, { Accept: 'text/html' }), ready, d.deps, new RateLimiter());
  assert.equal(ok.status, 303);
  assert.equal(ok.headers.get('location'), '/contact/envoye/');
  const ko = await handleContact(post({ ...valid, email: 'x' }, { Accept: 'text/html' }), ready, d.deps, new RateLimiter());
  assert.equal(ko.headers.get('location'), '/contact/erreur/?code=invalid');
});

test('les autres méthodes sont refusées', async () => {
  const res = await handleContact(new Request('https://luxia-it.com/api/contact', { method: 'PUT' }), ready);
  assert.equal(res.status, 405);
  assert.equal(res.headers.get('allow'), 'GET, HEAD, POST');
});
