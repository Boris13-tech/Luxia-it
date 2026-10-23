// Pilote minimal de Chrome par le protocole DevTools, sans dépendance :
// WebSocket natif de Node. Utilisé par tests/e2e.test.mjs.
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

export const chromePath = CANDIDATES.find((c) => existsSync(c)) ?? null;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Port TCP libre. */
export function freePort() {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.unref();
    srv.on('error', reject);
    srv.listen(0, () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

export async function launch() {
  const port = await freePort();
  const profile = mkdtempSync(join(tmpdir(), 'luxia-e2e-'));
  const proc = spawn(chromePath, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--disable-gpu', 'about:blank'], {
    stdio: 'ignore',
  });
  let ready = false;
  for (let i = 0; i < 150 && !ready; i += 1) {
    try {
      await fetch(`http://127.0.0.1:${port}/json/version`);
      ready = true;
    } catch {
      await sleep(100);
    }
  }
  if (!ready) throw new Error('Chrome ne répond pas');
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r, j) => {
    ws.addEventListener('open', r, { once: true });
    ws.addEventListener('error', j, { once: true });
  });

  let id = 0;
  const pending = new Map();
  const listeners = new Set();
  ws.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    } else for (const l of listeners) l(msg);
  });

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const n = ++id;
      pending.set(n, (m) => (m.error ? reject(new Error(`${method} : ${m.error.message}`)) : resolve(m.result)));
      ws.send(JSON.stringify({ id: n, method, params }));
    });

  const on = (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  };

  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(`évaluation : ${r.exceptionDetails.exception?.description ?? r.exceptionDetails.text}`);
    return r.result.value;
  };

  /** Navigue et attend la fin du chargement (et des polices). */
  const goto = async (url) => {
    const loaded = new Promise((r) => {
      const off = on((m) => {
        if (m.method === 'Page.loadEventFired') {
          off();
          r();
        }
      });
    });
    await send('Page.navigate', { url });
    await loaded;
    await evaluate('document.fonts.ready.then(() => true)');
  };

  /** Appuie sur une touche dans la page (événement clavier réel). */
  const press = async (key, code = key, keyCode = 0) => {
    for (const type of ['keyDown', 'keyUp']) {
      await send('Input.dispatchKeyEvent', { type, key, code, windowsVirtualKeyCode: keyCode });
    }
  };

  const close = async () => {
    try {
      ws.close();
    } catch {}
    proc.kill();
    await sleep(300);
    try {
      rmSync(profile, { recursive: true, force: true });
    } catch {}
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  await send('Log.enable');
  return { send, on, evaluate, goto, press, close, sleep };
}
