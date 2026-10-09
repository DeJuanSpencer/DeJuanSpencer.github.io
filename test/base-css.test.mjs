import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(join(root, 'dist', 'assets', 'site.css'), 'utf8');
const rules = css.replace(/\/\*[\s\S]*?\*\//g, '');

const classes = [
  'container', 'section', 'section--flush-top', 'stack', 'visually-hidden',
  'h1', 'h2', 'h3', 'lead', 'body', 'small', 'kicker', 'em', 'serif',
  'rule', 'ledger', 'ledger__row', 'ledger__label', 'ledger__text', 'ledger__price', 'leader',
  'btn', 'btn--primary', 'btn--lg', 'check-list', 'numeral', 'tel',
];

test('every shared class from the contract is defined in site.css', () => {
  for (const name of classes) {
    const re = new RegExp(`\\.${name.replace(/[-_]/g, (c) => `\\${c}`)}(?![\\w-])[^{}]*\\{`);
    assert.match(rules, re, `missing .${name}`);
  }
});

test('tokens are defined on :root', () => {
  for (const t of ['--paper', '--ink', '--copper', '--sand', '--hairline', '--font-sans', '--font-serif', '--container', '--gutter']) {
    assert.match(rules, new RegExp(`${t}\\s*:`), `missing ${t}`);
  }
});

test('only the three min-width media queries (plus reduced motion) are used', () => {
  const queries = [...rules.matchAll(/@media\s*([^{]+)\{/g)].map((m) => m[1].trim());
  const allowed = new Set(['(min-width: 720px)', '(min-width: 1024px)', '(min-width: 1280px)', '(prefers-reduced-motion: reduce)']);
  for (const q of queries) assert.ok(allowed.has(q), `unexpected media query: ${q}`);
});

test('font weights are 400, 500 or 600 only', () => {
  for (const m of rules.matchAll(/font-weight\s*:\s*([^;}]+)/g)) {
    assert.ok(['400', '500', '600'].includes(m[1].trim()), `font-weight ${m[1]}`);
  }
});

test('focus outline, reduced motion and smooth scroll are present', () => {
  assert.match(rules, /:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--copper\)[^}]*outline-offset:\s*3px/);
  assert.match(rules, /prefers-reduced-motion:\s*reduce/);
  assert.match(rules, /scroll-behavior:\s*smooth/);
  assert.match(rules, /\[id\]\s*\{[^}]*scroll-margin-top/);
});
