/**
 * Registre des faits publiables de Luxia-IT.
 *
 * Règle : une valeur `null` (ou une liste vide) signifie « non fourni ». Le
 * bloc qui en dépend ne s'affiche pas sur le site, et `npm run release:check`
 * refuse la mise en production tant qu'un fait requis manque. Le détail de
 * ce qui est attendu est tenu dans docs/suivi-contenus.md.
 *
 * Ce fichier est lu par Astro et par scripts/release-check.ts (Node, sans
 * compilation) : syntaxe TypeScript effaçable uniquement, aucune importation.
 */

export interface Person {
  name: string;
  role: string;
}

export interface Processor {
  name: string;
  purpose: string;
  country: string;
  url: string;
}

export const facts = {
  brand: {
    name: 'Luxia-IT',
    signature: 'Identité & confiance',
    origin: 'https://luxia-it.com',
  },

  /** Coordonnées validées par le propriétaire (brief du 23 octobre 2026). */
  contact: {
    email: 'Contact@Luxia-it.com',
    phone: '+40 766 438 679',
    phoneHref: 'tel:+40766438679',
    /** Adresse dédiée aux signalements de sécurité : n'existe pas à ce jour. */
    securityEmail: null as string | null,
    /** Délai de réponse : à publier seulement après validation. */
    responseTime: null as string | null,
    linkedin: null as string | null,
  },

  /** Éditeur du site (mentions légales). */
  publisher: {
    legalName: null as string | null,
    legalForm: null as string | null,
    registration: null as string | null,
    vatId: null as string | null,
    address: null as string | null,
    publicationDirector: null as string | null,
  },

  company: {
    founded: null as string | null,
    headquarters: null as string | null,
    headcount: null as string | null,
    leaders: [] as readonly Person[],
    /** Certifications réellement obtenues. Aucune à ce jour (voir docs/suivi-contenus.md). */
    certifications: [] as readonly string[],
  },

  /** Hébergeur du site, vérifié sur vercel.com/legal/privacy-policy le 23 octobre 2026. */
  siteHost: {
    name: 'Vercel Inc.',
    address: '440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis',
    url: 'https://vercel.com',
  },

  contactForm: {
    /** Prestataire qui achemine les messages du formulaire : à choisir (RESEND_API_KEY). */
    deliveryProcessor: null as Processor | null,
  },

  /**
   * Validations du propriétaire : date ISO (AAAA-MM-JJ) de la revue, ou null.
   * Tant qu'une revue manque, le contenu correspondant est rédigé mais ne doit
   * pas être mis en production.
   */
  reviews: {
    platformStatus: null as string | null,
    servicesOffer: null as string | null,
    architectureClaims: null as string | null,
    legalPages: null as string | null,
  },

  /** Date à laquelle les preuves sur l'état des plateformes ont été lues. */
  evidenceAsOf: '2026-10-23',
};

/** Faits sans lesquels le site ne doit pas être mis en production. */
export const requiredFacts: readonly { path: string; label: string; value: unknown }[] = [
  { path: 'publisher.legalName', label: 'Raison sociale de l’éditeur', value: facts.publisher.legalName },
  { path: 'publisher.legalForm', label: 'Forme juridique de l’éditeur', value: facts.publisher.legalForm },
  { path: 'publisher.registration', label: 'Numéro d’immatriculation', value: facts.publisher.registration },
  { path: 'publisher.address', label: 'Adresse du siège', value: facts.publisher.address },
  { path: 'publisher.publicationDirector', label: 'Directeur de la publication', value: facts.publisher.publicationDirector },
  { path: 'contactForm.deliveryProcessor', label: 'Prestataire d’acheminement du formulaire', value: facts.contactForm.deliveryProcessor },
  { path: 'reviews.platformStatus', label: 'Revue des statuts des plateformes', value: facts.reviews.platformStatus },
  { path: 'reviews.servicesOffer', label: 'Revue de l’offre de services', value: facts.reviews.servicesOffer },
  { path: 'reviews.architectureClaims', label: 'Revue des pages d’architecture', value: facts.reviews.architectureClaims },
  { path: 'reviews.legalPages', label: 'Revue juridique des pages légales', value: facts.reviews.legalPages },
];

/** Date lisible en français, ex. « 23 octobre 2026 ». */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}
