import type { APIRoute } from 'astro';
import { facts } from '../../data/facts';

/**
 * security.txt (RFC 9116), régénéré à chaque build : l'expiration reste à un
 * an. Contact : l'adresse sécurité dédiée si elle existe, sinon l'adresse de
 * contact validée.
 */
export const GET: APIRoute = ({ site }) => {
  const expires = new Date();
  expires.setUTCFullYear(expires.getUTCFullYear() + 1);

  const body = [
    `Contact: mailto:${facts.contact.securityEmail ?? facts.contact.email}`,
    `Expires: ${expires.toISOString()}`,
    'Preferred-Languages: fr, en',
    `Canonical: ${new URL('.well-known/security.txt', site).href}`,
    `Policy: ${new URL('securite/', site).href}`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
