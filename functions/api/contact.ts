/**
 * Adaptateur Cloudflare Pages Functions pour le formulaire de contact.
 * Il n'est utilisé que si le site est déployé sur Cloudflare Pages (option
 * d'hébergement gratuite à usage commercial, voir docs/suivi-contenus.md, B4).
 * Le traitement est celui de api/contact.ts, couvert par les tests ; cet
 * adaptateur n'a pas été exercé sur un déploiement Cloudflare réel.
 */
import { handleContact, type ContactEnv } from '../../api/contact.ts';

export const onRequest = (context: { request: Request; env: ContactEnv }): Promise<Response> =>
  handleContact(context.request, context.env);
