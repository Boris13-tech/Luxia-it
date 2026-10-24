// Tests de bout en bout dans Chrome sans interface (protocole DevTools) :
// confidentialité (aucun cookie, aucun stockage, aucune requête tierce),
// absence d'erreur console, clavier, rendu sans JavaScript, mouvement réduit,
// formulaire disponible et indisponible.
// Prérequis : npm run build. Ignoré si Chrome est introuvable (CHROME_PATH).
import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromePath, freePort, launch } from './helpers/browser.mjs';
import { routes } from '../src/i18n/route-map.mjs';
import { guideHref, guides } from '../src/data/guides.ts';

const PAGES = [...Object.values(routes).map((r) => r.fr), ...guides.map((g) => guideHref(g.slug)), '/contact/envoye/', '/contact/erreur/'];
const skip = !chromePath ? 'Chrome introuvable (définir CHROME_PATH)' : !existsSync('dist') ? 'dist/ absent : lancer npm run build' : false;

/** Démarre l'aperçu sécurisé (en-têtes de production + fonction du formulaire). */
async function startServer(delivery) {
  const port = await freePort();
  const proc = spawn(process.execPath, ['tools/preview-secure.mjs'], {
    env: { ...process.env, PORT: String(port), CONTACT_DELIVERY: delivery, RESEND_API_KEY: '', CONTACT_FROM: '' },
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  await new Promise((resolve, reject) => {
    proc.stdout.on('data', (d) => String(d).includes('Aperçu sécurisé') && resolve());
    proc.on('exit', (code) => reject(new Error(`aperçu arrêté (${code})`)));
  });
  return { origin: `http://localhost:${port}`, stop: () => proc.kill() };
}

describe('site construit, dans Chrome', { skip }, () => {
  let browser;
  let ready;
  let down;

  before(async () => {
    ready = await startServer('log');
    down = await startServer('resend');
    browser = await launch();
  });

  after(async () => {
    await browser?.close();
    ready?.stop();
    down?.stop();
  });

  /** Collecte requêtes et erreurs pendant `fn`. */
  async function observe(fn) {
    const requests = [];
    const errors = [];
    const off = browser.on((m) => {
      if (m.method === 'Network.requestWillBeSent') requests.push(m.params.request.url);
      if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') errors.push(m.params.entry.text);
      if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map((a) => a.value ?? a.description).join(' '));
      if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text);
    });
    try {
      await fn();
      await browser.sleep(400);
    } finally {
      off();
    }
    return { requests, errors };
  }

  test('aucun cookie, aucun stockage, aucune requête tierce, aucune erreur console', async () => {
    for (const path of PAGES) {
      const { requests, errors } = await observe(() => browser.goto(ready.origin + path));
      const foreign = requests.filter((u) => !u.startsWith(ready.origin) && !/^(data|blob|about):/.test(u));
      assert.deepEqual(foreign, [], `${path} : requêtes vers un autre domaine`);
      assert.deepEqual(errors, [], `${path} : erreurs console`);
      const { cookies } = await browser.send('Network.getAllCookies');
      assert.equal(cookies.length, 0, `${path} : cookie déposé`);
      const storage = await browser.evaluate(
        'Promise.resolve(indexedDB.databases ? indexedDB.databases() : []).then((dbs) => ({ local: localStorage.length, session: sessionStorage.length, idb: dbs.length }))',
      );
      assert.deepEqual(storage, { local: 0, session: 0, idb: 0 }, `${path} : stockage navigateur utilisé`);
    }
  });

  test('onglets au clavier : flèches, Fin, Début, puis Tab vers le panneau', async () => {
    await browser.goto(`${ready.origin}/`);
    await browser.evaluate("document.querySelector('.ptour [role=tab]').focus()");
    const state = () =>
      browser.evaluate(`(() => {
        const tabs = [...document.querySelectorAll('.ptour [role=tab]')];
        return { selected: tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true'), focused: tabs.indexOf(document.activeElement),
          visible: [...document.querySelectorAll('.ptour [role=tabpanel]')].map((p) => !p.hidden) };
      })()`);
    await browser.press('ArrowRight', 'ArrowRight', 39);
    await browser.sleep(350);
    assert.deepEqual(await state(), { selected: 1, focused: 1, visible: [false, true, false, false, false] });
    await browser.press('End', 'End', 35);
    await browser.sleep(350);
    assert.equal((await state()).selected, 4);
    await browser.press('Home', 'Home', 36);
    await browser.sleep(350);
    assert.equal((await state()).selected, 0);
    await browser.press('Tab', 'Tab', 9);
    assert.equal(await browser.evaluate("document.activeElement.getAttribute('role')"), 'tabpanel');
  });

  test('parcours en étapes : Suivant met à jour l’étape et l’annonce', async () => {
    await browser.goto(`${ready.origin}/architectures/plateforme-execution/`);
    await browser.evaluate("document.querySelector('[data-step-next]').click()");
    await browser.sleep(350);
    const s = await browser.evaluate(`({ status: document.querySelector('[data-step-status]').textContent,
      prevDisabled: document.querySelector('[data-step-prev]').disabled,
      selected: document.querySelector('.tabs--steps [aria-selected=true]').textContent.trim() })`);
    assert.deepEqual(s, { status: 'Étape 2 sur 8', prevDisabled: false, selected: 'Identité' });
  });

  test('mouvement réduit : aucune animation ; sinon, le panneau qui arrive est animé', async () => {
    const motion = async () => {
      await browser.goto(`${ready.origin}/`);
      await browser.sleep(150);
      return browser.evaluate(`(async () => {
        document.querySelectorAll('.ptour [role=tab]')[1].click();
        // L'animation démarre à l'image suivante.
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        const panel = document.querySelectorAll('.ptour [role=tabpanel]')[1];
        const cs = getComputedStyle(panel);
        const title = getComputedStyle(document.querySelector('.hero__title'));
        return { name: cs.animationName, duration: parseFloat(cs.animationDuration), titleAnimation: title.animationName,
          tabTransition: parseFloat(getComputedStyle(document.querySelector('.tabs__tab')).transitionDuration) };
      })()`);
    };
    await browser.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    const reduced = await motion();
    assert.ok(reduced.name === 'none' || reduced.duration <= 0.0001, `panneau non animé (${reduced.name}, ${reduced.duration})`);
    assert.equal(reduced.titleAnimation, 'none', 'titre non animé');
    assert.ok(reduced.tabTransition <= 0.0001, 'transitions neutralisées');
    await browser.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    const normal = await motion();
    assert.equal(normal.name, 'panel-in', 'le panneau qui arrive est animé');
    assert.equal(normal.titleAnimation, 'rise');
  });

  test('défilement : les sections sont liées à une timeline de défilement', async () => {
    await browser.goto(`${ready.origin}/services/`);
    const r = await browser.evaluate(`({ supported: CSS.supports('animation-timeline: view()'),
      name: getComputedStyle(document.querySelector('.shead')).animationName,
      timeline: getComputedStyle(document.querySelector('.shead')).animationTimeline,
      header: getComputedStyle(document.querySelector('.hdr'), '::after').animationName })`);
    if (!r.supported) return;
    assert.equal(r.name, 'reveal', 'révélation appliquée (règle conservée par la minification)');
    assert.equal(r.timeline, 'view()');
    assert.equal(r.header, 'fade');
  });

  test('parcours : la lecture avance seule puis se met en pause à la demande', async () => {
    await browser.goto(`${ready.origin}/architectures/plateforme-execution/`);
    const state = () => browser.evaluate(`({ status: document.querySelector('[data-step-status]').textContent,
      pressed: document.querySelector('[data-step-play]').getAttribute('aria-pressed'),
      label: document.querySelector('[data-step-play]').textContent.trim(),
      progress: getComputedStyle(document.querySelector('.tabs--steps')).getPropertyValue('--progress') })`);
    await browser.evaluate("document.querySelector('[data-step-play]').click()");
    assert.equal((await state()).pressed, 'true');
    await browser.sleep(4100);
    const running = await state();
    assert.equal(running.status, 'Étape 2 sur 8');
    assert.equal(running.progress.trim(), '0.25');
    await browser.evaluate("document.querySelector('[data-step-play]').click()");
    await browser.sleep(4100);
    const paused = await state();
    assert.deepEqual([paused.status, paused.pressed, paused.label], ['Étape 2 sur 8', 'false', 'Reprendre le parcours']);
  });

  test('sans JavaScript, tout le contenu reste lisible', async () => {
    await browser.send('Emulation.setScriptExecutionDisabled', { value: true });
    try {
      for (const [path, panels] of [
        ['/', '.ptour .tabs__panel'],
        ['/architectures/', '.cmp__panel'],
        ['/architectures/plateforme-execution/', '.flow__panel'],
      ]) {
        await browser.goto(ready.origin + path);
        const r = await browser.evaluate(`({ visible: [...document.querySelectorAll('${panels}')].every((p) => p.offsetHeight > 0),
          count: document.querySelectorAll('${panels}').length,
          tablist: getComputedStyle(document.querySelector('[data-tablist]')).display })`);
        assert.ok(r.count > 1 && r.visible, `${path} : tous les panneaux visibles`);
        assert.equal(r.tablist, 'none', `${path} : onglets masqués sans JavaScript`);
      }
      await browser.goto(`${ready.origin}/contact/`);
      assert.equal(await browser.evaluate("document.querySelector('[data-contact-form]').getAttribute('action')"), '/api/contact');
    } finally {
      await browser.send('Emulation.setScriptExecutionDisabled', { value: false });
    }
  });

  test('formulaire disponible : validation puis envoi réussi', async () => {
    const { errors } = await observe(async () => {
      await browser.goto(`${ready.origin}/contact/?sujet=luxia-identity`);
      await browser.sleep(300);
      await browser.evaluate("document.querySelector('[data-submit]').click()");
      await browser.sleep(200);
      const invalid = await browser.evaluate(`({ summary: !document.querySelector('[data-summary]').hidden,
        invalid: [...document.querySelectorAll('[aria-invalid=true]')].map((e) => e.id) })`);
      assert.deepEqual(invalid, { summary: true, invalid: ['nom', 'organisation', 'email', 'message'] });
      await browser.evaluate(`(() => {
        const set = (id, v) => { document.getElementById(id).value = v; };
        set('nom', 'Camille Test'); set('organisation', 'Organisation de test');
        set('email', 'camille@example.org'); set('message', 'Test de bout en bout du formulaire de contact.');
        document.querySelector('[data-submit]').click();
      })()`);
      await browser.sleep(800);
      const done = await browser.evaluate(`({ success: !document.querySelector('[data-success]').hidden,
        focused: document.activeElement.hasAttribute('data-success'), sujet: document.getElementById('sujet').value })`);
      assert.deepEqual(done, { success: true, focused: true, sujet: 'demo' });
    });
    assert.deepEqual(errors, []);
  });

  test('formulaire indisponible : repli calme, sans erreur console', async () => {
    const { errors } = await observe(async () => {
      await browser.goto(`${down.origin}/contact/`);
      await browser.sleep(500);
    });
    const r = await browser.evaluate(`({ formHidden: document.querySelector('[data-contact-form]').hidden,
      fallback: !document.querySelector('[data-fallback]').hidden })`);
    assert.deepEqual(r, { formHidden: true, fallback: true });
    assert.deepEqual(errors, []);
  });

  test('navigateur d’univers : ouverture au clavier, focus retenu, Échap, retour du focus', async () => {
    await browser.goto(`${ready.origin}/solutions/`);
    await browser.evaluate("document.querySelector('[data-universe-open]').focus()");
    await browser.press('Enter', 'Enter', 13);
    await browser.sleep(450);
    const opened = await browser.evaluate(`({
      open: document.querySelector('[data-universe]').open,
      expanded: document.querySelector('[data-universe-open]').getAttribute('aria-expanded'),
      inside: document.querySelector('[data-universe]').contains(document.activeElement),
      links: document.querySelectorAll('.univ__link').length,
      nodes: document.querySelectorAll('.univ__node a').length,
      levels: document.querySelectorAll('.univ__preview .lvl').length,
      current: document.querySelector('.univ__link[aria-current=page] .univ__label')?.textContent,
      scrollLocked: getComputedStyle(document.documentElement).overflow })`);
    assert.deepEqual(opened, { open: true, expanded: 'true', inside: true, links: 9, nodes: 8, levels: 8, current: 'Solutions', scrollLocked: 'hidden' });
    // Survol d'un domaine : son aperçu et son niveau s'affichent
    const preview = await browser.evaluate(`(() => {
      document.querySelector('.univ__node a[data-domain=alma]').dispatchEvent(new PointerEvent('pointerenter'));
      const shown = [...document.querySelectorAll('[data-preview]')].filter((p) => !p.hidden);
      return shown.map((p) => [p.dataset.preview, p.querySelector('.lvl').textContent.includes('Implémenté')]);
    })()`);
    assert.deepEqual(preview, [['alma', true]]);
    await browser.press('Escape', 'Escape', 27);
    await browser.sleep(450);
    const closed = await browser.evaluate(`({
      open: document.querySelector('[data-universe]').open,
      expanded: document.querySelector('[data-universe-open]').getAttribute('aria-expanded'),
      focus: document.activeElement.hasAttribute('data-universe-open') })`);
    assert.deepEqual(closed, { open: false, expanded: 'false', focus: true });
  });

  test('constellation : image fixe en mouvement réduit ; scène WebGL ou repli sinon', async () => {
    const state = () =>
      browser.evaluate(`({
        tier: document.querySelector('[data-scene]').dataset.tier,
        ready: document.querySelector('.scene__canvas').classList.contains('is-ready'),
        poster: document.querySelector('.scene__poster circle') !== null })`);
    await browser.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await browser.goto(`${ready.origin}/`);
    await browser.sleep(2500);
    assert.deepEqual(await state(), { tier: 'essential', ready: false, poster: true });
    await browser.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    await browser.goto(`${ready.origin}/?rendu=haut`);
    const webgl = await browser.evaluate("!!document.createElement('canvas').getContext('webgl2', { failIfMajorPerformanceCaveat: true })");
    // Le décor démarre au repos, après le chargement : on lui laisse jusqu'à 5 s
    let s = await state();
    for (let i = 0; i < 20 && (webgl ? !s.ready : s.tier !== 'essential'); i += 1) {
      await browser.sleep(250);
      s = await state();
    }
    // Avec WebGL 2 accéléré : la scène s'affiche ; sinon (rendu logiciel, pas de WebGL) : l'image fixe reste, sans erreur
    assert.deepEqual(s, webgl ? { tier: 'high', ready: true, poster: true } : { tier: 'essential', ready: false, poster: true });
  });

  test('transitions de page : le sens suit la navigation (profondeur, puis retour)', async () => {
    const { identifier } = await browser.send('Page.addScriptToEvaluateOnNewDocument', {
      source: "addEventListener('pagereveal', (e) => setTimeout(() => { window.__vt = e.viewTransition ? [...e.viewTransition.types] : null; }, 0));",
    });
    try {
      await browser.goto(`${ready.origin}/`);
      await browser.evaluate("location.href = '/plateformes/luxia-identity/'");
      await browser.sleep(1500);
      const deeper = await browser.evaluate('({ path: location.pathname, vt: window.__vt })');
      assert.deepEqual(deeper, { path: '/plateformes/luxia-identity/', vt: ['deeper'] });
      await browser.evaluate('history.back()');
      await browser.sleep(1500);
      const back = await browser.evaluate('({ path: location.pathname, vt: window.__vt })');
      assert.deepEqual(back, { path: '/', vt: ['back'] });
    } finally {
      await browser.send('Page.removeScriptToEvaluateOnNewDocument', { identifier });
    }
  });
});
