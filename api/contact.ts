/**
 * Formulaire de contact : fonction serveur (Vercel, environnement Node).
 *
 * - Validation serveur de chaque champ, longueur du corps limitée.
 * - Champ piège : un envoi qui le remplit est accepté en apparence et ignoré.
 * - Contrôle d'origine : seuls les envois depuis le site sont acceptés. Il n'y a
 *   ni session ni cookie, donc pas d'autorité à détourner : un jeton CSRF
 *   n'apporterait rien de plus que ce contrôle.
 * - Limitation de débit en mémoire, par empreinte d'adresse IP salée au
 *   démarrage de l'instance. Au mieux par instance : la règle de pare-feu
 *   décrite dans le README la complète.
 * - Aucune conservation : le message est transmis par e-mail, puis oublié.
 * - Journaux sans donnée personnelle : résultat, motif et code d'état seulement.
 * - Réponse JSON pour le script de la page ; redirection 303 vers une page de
 *   résultat pour un envoi sans JavaScript.
 *
 * Le fichier est autonome (aucune importation) : il est aussi exécuté tel quel
 * par les tests (node --test) et par l'adaptateur Cloudflare (functions/api).
 */

export interface ContactEnv {
  RESEND_API_KEY?: string | undefined;
  CONTACT_TO?: string | undefined;
  CONTACT_FROM?: string | undefined;
  /** Origines autorisées, séparées par des virgules. */
  CONTACT_ALLOWED_ORIGINS?: string | undefined;
  /** « resend » (défaut) ou « log » : journalise sans envoyer, refusé en production. */
  CONTACT_DELIVERY?: string | undefined;
  VERCEL_ENV?: string | undefined;
  VERCEL_URL?: string | undefined;
  VERCEL_BRANCH_URL?: string | undefined;
}

export interface ContactDeps {
  fetch: typeof fetch;
  now: () => number;
  log: (event: Record<string, string | number | boolean>) => void;
}

export const SUBJECTS: Record<string, string> = {
  cadrage: 'Échange de cadrage',
  'luxia-identity': 'LUXIA Identity',
  'luxia-key': 'LUXIA Key',
  alma: 'ALMA',
  plateformes: 'Plateformes',
  services: 'Services',
  architecture: 'Architecture',
  labs: 'Labs',
  securite: 'Sécurité',
  autre: 'Autre demande',
};

export const DEPLOYMENTS: Record<string, string> = {
  'a-definir': 'À définir',
  opere: 'Opéré par Luxia-IT',
  'sur-site': 'Sur site',
  souverain: 'Souverain ou isolé',
};

export const LIMITS = {
  body: 16_384,
  nom: [2, 120],
  organisation: [2, 160],
  fonction: [0, 120],
  email: [6, 254],
  message: [20, 4000],
} as const;

const DEFAULT_ORIGINS = ['https://luxia-it.com', 'https://www.luxia-it.com'];
const DEFAULT_TO = 'Contact@Luxia-it.com';
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_PER_CLIENT = 5;
const RATE_MAX_PER_INSTANCE = 100;
const PROVIDER_TIMEOUT_MS = 8000;

export type Field = 'nom' | 'organisation' | 'fonction' | 'email' | 'sujet' | 'deploiement' | 'message';

export interface ContactMessage {
  nom: string;
  organisation: string;
  fonction: string;
  email: string;
  sujet: string;
  deploiement: string;
  message: string;
}

/** Séparateurs de ligne et de paragraphe Unicode (U+2028, U+2029), construits sans littéral. */
const LINE_SEPARATORS = new RegExp(`[${String.fromCharCode(0x2028, 0x2029)}]`, 'g');

/** Supprime les caractères de contrôle (dont CR et LF hors message) et normalise les espaces. */
export function clean(value: unknown, multiline = false): string {
  const text = typeof value === 'string' ? value.normalize('NFC') : '';
  if (multiline) {
    return text
      .replace(/\r\n?/g, '\n')
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
      .replace(/\n{4,}/g, '\n\n\n')
      .trim();
  }
  return text
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(LINE_SEPARATORS, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

/** Valide les champs. Renvoie le message nettoyé, ou la liste des champs en erreur. */
export function validate(form: URLSearchParams): { ok: true; value: ContactMessage } | { ok: false; fields: Field[] } {
  const value: ContactMessage = {
    nom: clean(form.get('nom')),
    organisation: clean(form.get('organisation')),
    fonction: clean(form.get('fonction')),
    email: clean(form.get('email')).toLowerCase(),
    sujet: clean(form.get('sujet')),
    deploiement: clean(form.get('deploiement')) || 'a-definir',
    message: clean(form.get('message'), true),
  };
  const fields: Field[] = [];
  const within = (s: string, [min, max]: readonly [number, number]) => s.length >= min && s.length <= max;
  if (!within(value.nom, LIMITS.nom)) fields.push('nom');
  if (!within(value.organisation, LIMITS.organisation)) fields.push('organisation');
  if (!within(value.fonction, LIMITS.fonction)) fields.push('fonction');
  if (!within(value.email, LIMITS.email) || !EMAIL.test(value.email)) fields.push('email');
  if (!Object.hasOwn(SUBJECTS, value.sujet)) fields.push('sujet');
  if (!Object.hasOwn(DEPLOYMENTS, value.deploiement)) fields.push('deploiement');
  if (!within(value.message, LIMITS.message)) fields.push('message');
  return fields.length === 0 ? { ok: true, value } : { ok: false, fields };
}

/** Origines autorisées : configuration explicite, sinon le domaine de production (et l'aperçu en cours). */
export function allowedOrigins(env: ContactEnv): Set<string> {
  const configured = (env.CONTACT_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim().replace(/\/+$/, ''))
    .filter(Boolean);
  const origins = new Set(configured.length > 0 ? configured : DEFAULT_ORIGINS);
  if (env.VERCEL_ENV === 'preview') {
    for (const host of [env.VERCEL_URL, env.VERCEL_BRANCH_URL]) if (host) origins.add(`https://${host}`);
  }
  return origins;
}

export function sameOrigin(request: Request, env: ContactEnv): boolean {
  const origin = request.headers.get('origin');
  if (origin) return allowedOrigins(env).has(origin);
  // Sans en-tête Origin (rare pour un POST), seule une requête du même site est acceptée.
  return request.headers.get('sec-fetch-site') === 'same-origin';
}

export type Delivery = 'resend' | 'log' | null;

/** Mode d'envoi effectif. null : formulaire non configuré. */
export function delivery(env: ContactEnv): Delivery {
  const mode = (env.CONTACT_DELIVERY ?? 'resend').trim().toLowerCase();
  if (mode === 'log') return env.VERCEL_ENV === 'production' ? null : 'log';
  if (mode === 'resend') return env.RESEND_API_KEY && env.CONTACT_FROM ? 'resend' : null;
  return null;
}

/** Limitation de débit : fenêtre glissante par client et plafond par instance. */
export class RateLimiter {
  private readonly hits = new Map<string, number[]>();
  private total: number[] = [];
  private readonly windowMs: number;
  private readonly perClient: number;
  private readonly perInstance: number;

  constructor(windowMs = RATE_WINDOW_MS, perClient = RATE_MAX_PER_CLIENT, perInstance = RATE_MAX_PER_INSTANCE) {
    this.windowMs = windowMs;
    this.perClient = perClient;
    this.perInstance = perInstance;
  }

  /** Enregistre une tentative ; renvoie false si la limite est atteinte. */
  take(key: string, now: number): boolean {
    const since = now - this.windowMs;
    this.total = this.total.filter((t) => t > since);
    // Purge à chaque appel : une empreinte expirée ne reste pas en mémoire. Le
    // plafond par instance borne la taille de la table.
    for (const [k, times] of this.hits) if (!times.some((t) => t > since)) this.hits.delete(k);
    const recent = (this.hits.get(key) ?? []).filter((t) => t > since);
    if (recent.length >= this.perClient || this.total.length >= this.perInstance) {
      if (recent.length > 0) this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    this.total.push(now);
    return true;
  }

  /** Nombre d'empreintes en mémoire (tests). */
  get size(): number {
    return this.hits.size;
  }
}

const SALT = crypto.getRandomValues(new Uint8Array(16));

/** Empreinte salée de l'adresse du client : l'adresse elle-même n'est jamais conservée. */
export async function clientKey(request: Request): Promise<string> {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const ip = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-real-ip') ?? forwarded ?? 'inconnu';
  const data = new Uint8Array([...SALT, ...new TextEncoder().encode(ip)]);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function renderEmail(m: ContactMessage): { subject: string; text: string } {
  const subject = `[Site] ${SUBJECTS[m.sujet]} — ${m.organisation}`;
  const text = [
    `Sujet : ${SUBJECTS[m.sujet]}`,
    `Nom : ${m.nom}`,
    `Organisation : ${m.organisation}`,
    `Fonction : ${m.fonction || '—'}`,
    `E-mail : ${m.email}`,
    `Déploiement envisagé : ${DEPLOYMENTS[m.deploiement]}`,
    '',
    m.message,
    '',
    '—',
    'Message transmis par le formulaire de luxia-it.com. Il n’est pas conservé par le site.',
  ].join('\n');
  return { subject, text };
}

async function sendWithResend(m: ContactMessage, env: ContactEnv, deps: ContactDeps): Promise<number> {
  const { subject, text } = renderEmail(m);
  const response = await deps.fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO || DEFAULT_TO],
      reply_to: m.email,
      subject,
      text,
    }),
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
  });
  return response.status;
}

type Outcome =
  | { status: 200; code: 'sent' }
  | { status: 400; code: 'invalid'; fields: Field[] }
  | { status: 403; code: 'forbidden_origin' }
  | { status: 413; code: 'too_large' }
  | { status: 415; code: 'unsupported_type' }
  | { status: 429; code: 'rate_limited' }
  | { status: 502; code: 'delivery_failed' }
  | { status: 503; code: 'not_configured' };

const MESSAGES: Record<Outcome['code'], string> = {
  sent: 'Votre message a été transmis. Nous vous répondrons à l’adresse indiquée.',
  invalid: 'Certains champs sont incomplets ou invalides.',
  forbidden_origin: 'Cet envoi ne provient pas du site.',
  too_large: 'Le message est trop long.',
  unsupported_type: 'Format d’envoi non pris en charge.',
  rate_limited: 'Trop d’envois en peu de temps. Réessayez dans quelques minutes, ou écrivez-nous directement.',
  delivery_failed: 'Le message n’a pas pu être transmis. Écrivez-nous directement par e-mail ou par téléphone.',
  not_configured: 'Le formulaire est momentanément indisponible. Écrivez-nous directement par e-mail ou par téléphone.',
};

const BASE_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex',
};

function respond(request: Request, outcome: Outcome): Response {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  const extra: Record<string, string> = outcome.status === 429 ? { 'Retry-After': '600' } : {};
  if (wantsJson) {
    const body = {
      ok: outcome.code === 'sent',
      code: outcome.code,
      message: MESSAGES[outcome.code],
      ...(outcome.code === 'invalid' ? { fields: outcome.fields } : {}),
    };
    return new Response(JSON.stringify(body), {
      status: outcome.status,
      headers: { ...BASE_HEADERS, ...extra, 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
  const target = outcome.code === 'sent' ? '/contact/envoye/' : `/contact/erreur/?code=${outcome.code}`;
  return new Response(null, { status: 303, headers: { ...BASE_HEADERS, ...extra, Location: target } });
}

const limiter = new RateLimiter();

/** Traite une requête. `deps` et `rate` sont injectables pour les tests. */
export async function handleContact(
  request: Request,
  env: ContactEnv,
  deps: ContactDeps = defaultDeps,
  rate: RateLimiter = limiter,
): Promise<Response> {
  if (request.method === 'GET' || request.method === 'HEAD') {
    const ready = delivery(env) !== null;
    return new Response(request.method === 'HEAD' ? null : JSON.stringify({ ready }), {
      status: ready ? 200 : 503,
      headers: { ...BASE_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
  if (request.method !== 'POST') {
    return new Response(null, { status: 405, headers: { ...BASE_HEADERS, Allow: 'GET, HEAD, POST' } });
  }

  const started = deps.now();
  const finish = (outcome: Outcome, reason: string = outcome.code): Response => {
    deps.log({ event: 'contact', outcome: outcome.code === 'sent' ? 'sent' : 'rejected', reason, status: outcome.status, ms: deps.now() - started });
    return respond(request, outcome);
  };

  if (!sameOrigin(request, env)) return finish({ status: 403, code: 'forbidden_origin' });

  const type = (request.headers.get('content-type') ?? '').split(';')[0]?.trim().toLowerCase();
  if (type !== 'application/x-www-form-urlencoded') return finish({ status: 415, code: 'unsupported_type' });

  const declared = Number(request.headers.get('content-length') ?? '0');
  if (declared > LIMITS.body) return finish({ status: 413, code: 'too_large' });

  if (!rate.take(await clientKey(request), deps.now())) return finish({ status: 429, code: 'rate_limited' });

  const raw = await request.text();
  if (raw.length > LIMITS.body) return finish({ status: 413, code: 'too_large' });
  const form = new URLSearchParams(raw);

  // Champ piège rempli : réponse identique à un succès, rien n'est transmis.
  if (clean(form.get('site_web')) !== '') return finish({ status: 200, code: 'sent' }, 'honeypot');

  const result = validate(form);
  if (!result.ok) return finish({ status: 400, code: 'invalid', fields: result.fields });

  const mode = delivery(env);
  if (mode === null) return finish({ status: 503, code: 'not_configured' });

  if (mode === 'log') {
    deps.log({ event: 'contact_dry_run', subject: result.value.sujet, length: result.value.message.length });
    return finish({ status: 200, code: 'sent' }, 'dry_run');
  }

  try {
    const status = await sendWithResend(result.value, env, deps);
    if (status >= 200 && status < 300) return finish({ status: 200, code: 'sent' });
    return finish({ status: 502, code: 'delivery_failed' }, `provider_${status}`);
  } catch {
    return finish({ status: 502, code: 'delivery_failed' }, 'provider_unreachable');
  }
}

const defaultDeps: ContactDeps = {
  fetch: (...args) => fetch(...args),
  now: () => Date.now(),
  log: (event) => console.log(JSON.stringify(event)),
};

function runtimeEnv(): ContactEnv {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  return proc?.env ?? {};
}

// Points d'entrée Vercel (signature Web standard).
export function GET(request: Request): Promise<Response> {
  return handleContact(request, runtimeEnv());
}

export function HEAD(request: Request): Promise<Response> {
  return handleContact(request, runtimeEnv());
}

export function POST(request: Request): Promise<Response> {
  return handleContact(request, runtimeEnv());
}
