import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'dist', 'index.html'), 'utf8');

const roots = [
  ['header', 'nav', null],
  ['section', 'hero', 'top'],
  ['section', 'solo', null],
  ['section', 'proof', null],
  ['section', 'work', 'work'],
  ['section', 'services', 'services'],
  ['section', 'who', 'who'],
  ['section', 'process', 'process'],
  ['section', 'faq', 'faq'],
  ['section', 'testimonials', 'testimonials'],
  ['section', 'about', 'about'],
  ['footer', 'footer', 'contact'],
];

test('dist/index.html has all twelve section roots', () => {
  for (const [tag, cls, id] of roots) {
    const re = new RegExp(`<${tag} class="${cls}"${id ? ` id="${id}"` : ''}[ >]`);
    assert.match(html, re, `missing <${tag} class="${cls}">`);
  }
});

test('document has lang, one main, and the stylesheet link', () => {
  assert.match(html, /<html lang="en">/);
  assert.equal((html.match(/<main id="main">/g) || []).length, 1);
  assert.match(html, /<link rel="stylesheet" href="\/assets\/site\.css">/);
});
