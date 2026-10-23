// Tests de la typographie française appliquée au HTML construit.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { frenchSpacing, transformHtml } from '../integrations/french-spacing.mjs';

const N = ' ';

test('espace fine insécable avant ; : ! ? et dans les guillemets', () => {
  assert.equal(frenchSpacing('Composant : base ; fin ! Quoi ? « mot »'), `Composant${N}: base${N}; fin${N}! Quoi${N}? «${N}mot${N}»`);
});

test('balises, attributs, scripts et styles restent intacts', () => {
  const html = '<a title="a : b" href="x">c : d</a><script type="application/ld+json">{"a" : 1}</script><style>a { b : c }</style>';
  const out = transformHtml(html);
  assert.ok(out.includes('title="a : b"'));
  assert.ok(out.includes('{"a" : 1}'));
  assert.ok(out.includes('a { b : c }'));
  assert.ok(out.includes(`c${N}: d`));
});

test('les heures et adresses sans espace ne changent pas', () => {
  assert.equal(frenchSpacing('https://luxia-it.com à 10:30'), 'https://luxia-it.com à 10:30');
});
