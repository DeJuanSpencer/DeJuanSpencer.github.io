import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = (name) => readFileSync(new URL(`../src/css/${name}.css`, import.meta.url), 'utf8');
const base = css('base');

function token(name) {
  const m = base.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})\\s*;`));
  assert.ok(m, `--${name} must be a literal hex token in base.css`);
  return m[1];
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

const paper = token('paper');
const ink = token('ink');
const sand = token('sand');
const copperText = token('copper-text');
const copperOnInk = token('copper-on-ink');

test('copper-text on paper is at least 4.5:1', () => {
  assert.ok(contrast(copperText, paper) >= 4.5);
});
test('copper-text on sand is at least 4.5:1', () => {
  assert.ok(contrast(copperText, sand) >= 4.5);
});
test('paper label on a copper-text button is at least 4.5:1', () => {
  assert.ok(contrast(paper, copperText) >= 4.5);
});
test('copper-on-ink on ink is at least 4.5:1', () => {
  assert.ok(contrast(copperOnInk, ink) >= 4.5);
});

// Selectors that may keep the exact copper as text colour: large elements only.
const ALLOWED_COPPER_TEXT = ['.quote-card__mark'];

test('no kicker, note, label or button rule uses color: var(--copper)', () => {
  for (const name of ['top', 'bottom']) {
    const rules = css(name).replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g);
    for (const [, sel, body] of rules) {
      if (!/(^|[;\s])color:\s*var\(--copper\)\s*(;|$)/.test(body)) continue;
      const selector = sel.trim();
      if (ALLOWED_COPPER_TEXT.includes(selector)) continue;
      assert.ok(!/kicker|note|label|btn|cta/.test(selector), `${name}.css: ${selector} must not use color: var(--copper)`);
    }
  }
});

test('.kicker in base.css uses --copper-text', () => {
  const m = base.match(/^\.kicker\s*\{([^}]*)\}/m);
  assert.ok(m, '.kicker rule exists');
  assert.match(m[1], /color:\s*var\(--copper-text\)/);
});
