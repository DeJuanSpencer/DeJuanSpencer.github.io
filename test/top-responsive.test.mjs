import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const MOBILE_MAX = 358;

const strip = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');
const topCss = strip(readFileSync(join(root, 'src', 'css', 'top.css'), 'utf8'));
const siteCss = strip(readFileSync(join(root, 'dist', 'assets', 'site.css'), 'utf8'));

// Walk the css and return { selector, prop, value, atRules } for every declaration.
function declarations(css) {
  const out = [];
  const stack = [];
  let buf = '';
  for (const ch of css) {
    if (ch === '{') {
      stack.push(buf.trim());
      buf = '';
    } else if (ch === '}') {
      pushDecls(buf, stack, out);
      stack.pop();
      buf = '';
    } else {
      buf += ch;
    }
  }
  return out;
}

function pushDecls(body, stack, out) {
  if (!stack.length) return;
  const selector = stack[stack.length - 1];
  const atRules = stack.slice(0, -1).filter((s) => s.startsWith('@'));
  for (const part of body.split(';')) {
    const i = part.indexOf(':');
    if (i < 0) continue;
    out.push({
      selector,
      prop: part.slice(0, i).trim().toLowerCase(),
      value: part.slice(i + 1).trim().toLowerCase(),
      atRules,
    });
  }
}

const decls = declarations(topCss);
const inMinWidth = (d) => d.atRules.some((a) => /min-width/.test(a));

test('top.css is part of the built site.css', () => {
  assert.ok(decls.length > 0, 'top.css has no declarations');
  assert.ok(siteCss.includes('.nav__links'), 'dist site.css lacks the top.css rules');
});

test('no top.css width or min-width over 358px outside a min-width media query', () => {
  const offenders = decls.filter((d) => {
    if (!['width', 'min-width'].includes(d.prop) || inMinWidth(d)) return false;
    return [...d.value.matchAll(/(-?\d*\.?\d+)px/g)].some((m) => Number(m[1]) > MOBILE_MAX);
  });
  assert.deepEqual(offenders.map((d) => `${d.selector} { ${d.prop}: ${d.value} }`), []);
});

test('top.css never hides horizontal overflow', () => {
  const offenders = decls.filter((d) => /^overflow(-x)?$/.test(d.prop) && /hidden|clip/.test(d.value));
  assert.deepEqual(offenders.map((d) => `${d.selector} { ${d.prop}: ${d.value} }`), []);
});

test('top.css uses only min-width media queries at 720, 1024 and 1280', () => {
  const queries = [...topCss.matchAll(/@media[^{]*/g)].map((m) => m[0].trim());
  for (const q of queries) assert.match(q, /^@media \(min-width: (720|1024|1280)px\)$/, q);
});

test('mobile tap targets in the nav and hero are at least 44px tall', () => {
  for (const selector of ['.nav__brand', '.nav__cta', '.nav__links a', '.hero__tel']) {
    const d = decls.find((x) => x.selector === selector && x.prop === 'min-height' && !inMinWidth(x));
    assert.ok(d, `${selector} has no mobile min-height`);
    assert.ok(parseFloat(d.value) >= 44, `${selector} min-height ${d.value}`);
  }
});
