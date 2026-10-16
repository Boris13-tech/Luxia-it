import type { APIRoute } from 'astro';

/**
 * security.txt (RFC 9116), régénéré à chaque build : la date d'expiration
 * reste toujours à un an. Remplacer Contact par l'adresse sécurité dédiée
 * (mailto:) dès qu'elle existe.
 */
export const GET: APIRoute = ({ site }) => {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  const body = [
    `Contact: ${new URL('securite/', site).href}`,
    `Expires: ${expires.toISOString()}`,
    'Preferred-Languages: fr, en',
    `Canonical: ${new URL('.well-known/security.txt', site).href}`,
    `Policy: ${new URL('securite/', site).href}`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
