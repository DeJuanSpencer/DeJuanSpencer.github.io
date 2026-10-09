import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const MOBILE_MAX = 358;

// Walks bottom.css and returns every declaration with the list of at-rule
// preludes it sits inside.
function declarations(css) {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = [];
  const stack = [];
  let buf = '';
  for (const ch of text) {
    if (ch === '{') {
      stack.push(buf.trim());
      buf = '';
    } else if (ch === '}') {
      if (buf.trim()) out.push({ at: stack.filter((s) => s.startsWith('@')), selector: stack[stack.length - 1], decl: buf.trim() });
      stack.pop();
      buf = '';
    } else if (ch === ';') {
      if (buf.trim()) out.push({ at: stack.filter((s) => s.startsWith('@')), selector: stack[stack.length - 1], decl: buf.trim() });
      buf = '';
    } else {
      buf += ch;
    }
  }
  return out;
}

const decls = declarations(readFileSync(join(root, 'src', 'css', 'bottom.css'), 'utf8'));

test('bottom.css parses into declarations', () => {
  assert.ok(decls.length > 50);
});

test('bottom.css sets no width or min-width over 358px outside a min-width media query', () => {
  const bad = [];
  for (const d of decls) {
    const m = d.decl.match(/^(width|min-width)\s*:\s*(.+)$/);
    if (!m) continue;
    const inMin = d.at.some((a) => /^@media[^{]*\(\s*min-width/.test(a));
    if (inMin) continue;
    for (const px of m[2].matchAll(/(-?[\d.]+)px/g)) {
      if (Number(px[1]) > MOBILE_MAX) bad.push(`${d.selector} { ${d.decl} }`);
    }
  }
  assert.deepEqual(bad, []);
});

test('bottom.css hides no horizontal overflow', () => {
  const bad = decls.filter((d) => /^overflow(-x)?\s*:\s*(hidden|clip)/.test(d.decl)).map((d) => d.selector);
  assert.deepEqual(bad, []);
});

test('bottom.css uses only the three allowed breakpoints', () => {
  const allowed = new Set(['720px', '1024px', '1280px']);
  for (const d of decls) {
    for (const a of d.at) {
      const m = a.match(/^@media\s*\(\s*min-width:\s*(\d+px)\s*\)$/);
      assert.ok(m && allowed.has(m[1]), `unexpected at-rule: ${a}`);
    }
  }
});
