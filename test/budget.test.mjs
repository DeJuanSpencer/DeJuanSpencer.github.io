import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { root } from '../scripts/build.mjs';
import { evaluate, formatTable, loadAssets, runBudget } from '../scripts/check-budget.mjs';

const HTML = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>T</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E">
<link rel="preload" href="/assets/fonts/a.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/b.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css">
</head><body><a href="tel:+14807574367">Call</a><a href="#top">Top</a><p id="top">Hi</p></body></html>
`;
const CSS = '@font-face{font-family:A;font-display:swap;src:url("/assets/fonts/a.woff2")}\n@font-face{font-family:B;font-display:optional;src:url("/assets/fonts/b.woff2")}\nbody{margin:0}\n';
const fontFile = (name, size) => ({ rel: `fonts/${name}`, bytes: Buffer.alloc(size, 1) });
const ASSETS = [fontFile('a.woff2', 20 * 1024), fontFile('b.woff2', 20 * 1024)];
const good = (over = {}) => ({ html: HTML, css: CSS, assets: ASSETS, ...over });
const failing = (input) => evaluate(input).filter((r) => !r.ok).map((r) => r.metric);

test('fixture: a lean page passes every limit, and a data: URI is not an external origin', () => {
  assert.deepEqual(failing(good()), []);
});

test('fixture: a page that breaks the budget fails with every breach named', () => {
  const html = HTML
    .replace('<title>T</title>', '<title>T</title><script src="https://cdn.example.com/x.js"></script><link rel="stylesheet" href="https://fonts.example.com/f.css">')
    .replace('<p id="top">Hi</p>', `<p id="top" style="${'color:var(--ink);'.repeat(20)}">Hi</p><img src="/assets/big.jpg" alt="x">`);
  const css = '@import url("/x.css");\n@font-face{font-family:A;src:url("/assets/fonts/a.woff2")}\n.a{background:url(https://example.com/a.png)}';
  const assets = [fontFile('a.woff2', 70 * 1024), fontFile('b.woff2', 70 * 1024), fontFile('c.woff2', 70 * 1024), { rel: 'big.jpg', bytes: Buffer.alloc(150 * 1024, 1) }];
  const bad = failing({ html, css, assets });
  for (const metric of ['largest woff2', 'woff2 total', 'total dist weight', 'script tags', 'external origins', 'render-blocking resources',
    '@font-face without swap/optional', '@import rules', 'img attributes and size', 'longest inline style']) {
    assert.ok(bad.includes(metric), `${metric} should fail; failing: ${bad.join(', ')}`);
  }
});

test('fixture: gzip limits are enforced', () => {
  const noisy = randomBytes(60 * 1024).toString('base64');
  const bad = failing(good({ html: HTML.replace('Hi', noisy), css: CSS + `/*${noisy}*/` }));
  assert.ok(bad.includes('index.html gzip'));
  assert.ok(bad.includes('site.css gzip'));
});

test('fixture: preload rules are enforced', () => {
  assert.ok(failing(good({ html: HTML.replace(/<link rel="preload" href="\/assets\/fonts\/b.woff2"[^>]*>\n/, '') })).includes('font preloads'));
  assert.ok(failing(good({ html: HTML.replace('/assets/fonts/b.woff2" as', '/assets/fonts/missing.woff2" as') })).includes('font preloads'));
  assert.ok(failing(good({ html: HTML.replace(' crossorigin>\n<link rel="preload" href="/assets/fonts/b', '>\n<link rel="preload" href="/assets/fonts/b') })).includes('font preloads'));
});

test('fixture: a missing viewport meta and a stylesheet in the body fail', () => {
  assert.ok(failing(good({ html: HTML.replace(/<meta name="viewport"[^>]*>\n/, '') })).includes('viewport meta'));
  assert.ok(failing(good({ html: HTML.replace('</body>', '<link rel="stylesheet" href="/assets/more.css"></body>') })).includes('render-blocking resources'));
});

test('fixture: a lazy, sized, small image passes', () => {
  const html = HTML.replace('<p id="top">', '<img src="/assets/a.jpg" alt="A" width="10" height="10" loading="lazy"><p id="top">');
  assert.deepEqual(failing({ html, css: CSS, assets: [...ASSETS, { rel: 'a.jpg', bytes: Buffer.alloc(50 * 1024, 1) }] }), []);
});

test('the table lists every metric against its limit', () => {
  const table = formatTable(evaluate(good()));
  assert.match(table, /^metric\s+value\s+limit\s+status/);
  assert.match(table, /script tags\s+0\s+0\s+ok/);
});

test('smoke: the real site is inside the budget', () => {
  const { table, failed } = runBudget();
  assert.deepEqual(failed, [], table);
  assert.equal(loadAssets().filter((a) => a.rel.endsWith('.woff2')).length, 4);
});

test('smoke: node scripts/check-budget.mjs exits 0 and prints the table', () => {
  const out = execFileSync(process.execPath, ['scripts/check-budget.mjs'], { cwd: root, encoding: 'utf8' });
  assert.match(out, /index\.html gzip/);
});
