// Contrôle avant mise en production (npm run release:check [-- --url https://…]).
// Il reprend les bloquants de docs/suivi-contenus.md, section 1, et échoue tant
// qu'un seul subsiste. Avec --url, il vérifie aussi le déploiement candidat.
import { resolveMx } from 'node:dns/promises';
import { facts, requiredFacts } from '../src/data/facts.ts';

const blockers = [];
const warnings = [];

// B2, B3, B5 : faits et revues du registre.
for (const fact of requiredFacts) {
  if (fact.value === null || fact.value === '') blockers.push(`${fact.label} (${fact.path}) : non renseigné`);
}

// B1 : la boîte de contact doit pouvoir recevoir du courrier.
const domain = facts.contact.email.split('@')[1] ?? '';
try {
  const mx = await resolveMx(domain);
  if (mx.length === 0) blockers.push(`${domain} : aucun enregistrement MX, ${facts.contact.email} ne reçoit rien`);
} catch {
  blockers.push(`${domain} : aucun enregistrement MX, ${facts.contact.email} ne reçoit rien`);
}

// Fraîcheur des preuves sur l'état des plateformes.
const ageDays = (Date.now() - Date.parse(`${facts.evidenceAsOf}T00:00:00Z`)) / 86_400_000;
if (ageDays > 30) warnings.push(`preuves sur les plateformes lues il y a ${Math.floor(ageDays)} jours (facts.evidenceAsOf) : à relire`);

// B4 : vérification manuelle.
warnings.push('offre d’hébergement : confirmer un usage commercial autorisé et un accord de traitement des données (Vercel Pro ou équivalent)');

// Déploiement candidat.
const urlArg = process.argv.indexOf('--url');
const target = urlArg > -1 ? process.argv[urlArg + 1] : undefined;
if (target) {
  const origin = new URL(target).origin;
  try {
    const health = await fetch(`${origin}/api/contact`, { headers: { Accept: 'application/json' } });
    const body = await health.json().catch(() => ({}));
    if (!body.ready) blockers.push(`${origin}/api/contact : formulaire non configuré (statut ${health.status})`);
  } catch (error) {
    blockers.push(`${origin}/api/contact : injoignable (${error.message})`);
  }
  try {
    const home = await fetch(`${origin}/`);
    const required = ['content-security-policy', 'strict-transport-security', 'x-content-type-options', 'x-frame-options', 'referrer-policy', 'permissions-policy'];
    for (const h of required) if (!home.headers.get(h)) blockers.push(`${origin}/ : en-tête ${h} absent`);
    if ((home.headers.get('x-robots-tag') ?? '').includes('noindex')) warnings.push(`${origin}/ : x-robots-tag noindex (normal pour un aperçu, pas pour la production)`);
    const html = await home.text();
    if (/À FOURNIR|À CONFIRMER|HYPOTHÈSE/i.test(html)) blockers.push(`${origin}/ : marqueur de contenu manquant`);
  } catch (error) {
    blockers.push(`${origin}/ : injoignable (${error.message})`);
  }
} else {
  warnings.push('déploiement candidat non vérifié : relancer avec --url https://<aperçu>');
}

for (const w of warnings) console.warn(`attention : ${w}`);
if (blockers.length > 0) {
  console.error(`\nrelease:check : ${blockers.length} bloquant(s), mise en production refusée.\n- ${blockers.join('\n- ')}`);
  process.exit(1);
}
console.log('\nrelease:check : aucun bloquant. La mise en production reste soumise à la revue finale du propriétaire.');
