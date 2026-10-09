import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = ['inter-tight-400.woff2', 'inter-tight-500.woff2', 'inter-tight-600.woff2', 'newsreader-italic-400.woff2'];
const fontsCss = readFileSync(join(root, 'src', 'css', 'fonts.css'), 'utf8');
const html = readFileSync(join(root, 'dist', 'index.html'), 'utf8');
const siteCss = readFileSync(join(root, 'dist', 'assets', 'site.css'), 'utf8');

test('four woff2 files exist, start with wOF2 and are under 60KB', () => {
  for (const f of files) {
    const path = join(root, 'src', 'assets', 'fonts', f);
    assert.ok(existsSync(path), `${f} missing`);
    assert.equal(readFileSync(path).subarray(0, 4).toString('latin1'), 'wOF2', `${f} magic bytes`);
    assert.ok(statSync(path).size < 60 * 1024, `${f} is 60KB or more`);
  }
});

test('fonts.css has exactly four @font-face rules, all font-display swap', () => {
  const blocks = fontsCss.match(/@font-face\s*\{[^}]*\}/g) || [];
  assert.equal(blocks.length, 4);
  for (const b of blocks) {
    assert.match(b, /font-display:\s*swap\s*;/);
    assert.match(b, /unicode-range:/);
  }
});

test('every font url resolves to a file in dist/assets/fonts', () => {
  const urls = [...fontsCss.matchAll(/url\("?(\/assets\/fonts\/[^")]+)"?\)/g)].map((m) => m[1]);
  assert.equal(urls.length, 4);
  for (const u of urls) assert.ok(existsSync(join(root, 'dist', u)), `${u} not in dist`);
});

test('site.css starts with the font rules and has no @font-face elsewhere', () => {
  assert.equal((siteCss.match(/@font-face/g) || []).length, 4);
  assert.ok(siteCss.indexOf('@font-face') < siteCss.indexOf(':root'));
});

test('index.html preloads exactly Inter Tight 600 then 400 and has no Google font origins', () => {
  const preloads = [...html.matchAll(/<link rel="preload"[^>]*>/g)].map((m) => m[0]);
  assert.equal(preloads.length, 2);
  assert.match(preloads[0], /href="\/assets\/fonts\/inter-tight-600\.woff2"/);
  assert.match(preloads[1], /href="\/assets\/fonts\/inter-tight-400\.woff2"/);
  for (const p of preloads) assert.match(p, /as="font"[^>]*type="font\/woff2"[^>]*crossorigin/);
  assert.ok(!/googleapis|gstatic/.test(html));
  assert.ok(!/googleapis|gstatic/.test(siteCss));
});
