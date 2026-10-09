import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { root } from '../scripts/build.mjs';
import { runLint } from '../scripts/lib/checks.mjs';
import { GOOD, GOOD_CSS, mutate } from './helpers.mjs';

// A copy of the project in a folder whose name contains a space, so path handling is exercised.
let base;
let copy;
before(() => {
  base = mkdtempSync(join(tmpdir(), 'forge guards '));
  copy = join(base, 'my site');
  mkdirSync(copy);
  for (const p of ['package.json', 'scripts', 'src']) cpSync(join(root, p), join(copy, p), { recursive: true });
});
after(() => rmSync(base, { recursive: true, force: true }));

const run = (script) => spawnSync(process.execPath, [join(copy, 'scripts', script)], { cwd: copy, encoding: 'utf8' });
const section = (file) => join(copy, 'src', 'sections', file);

test('check-budget run directly from a path with a space prints the table and exits 0', () => {
  const r = run('check-budget.mjs');
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /index\.html gzip/);
  assert.match(r.stdout, /script tags/);
});

test('build run directly from a path with a space writes dist', () => {
  const r = run('build.mjs');
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /built dist\/index\.html/);
});

test('build fails with a clear message when fonts.css is missing', () => {
  const path = join(copy, 'src', 'css', 'fonts.css');
  const saved = readFileSync(path);
  unlinkSync(path);
  try {
    const r = run('build.mjs');
    assert.equal(r.status, 1);
    assert.match(r.stderr, /src\/css\/fonts\.css is missing/);
  } finally {
    writeFileSync(path, saved);
  }
});

test('build reads root attributes properly: data-class and data-id do not count, single quotes do', () => {
  const path = section('03-solo.html');
  const saved = readFileSync(path, 'utf8');
  try {
    writeFileSync(path, '<section data-class="solo"><p>x</p></section>\n');
    const bad = run('build.mjs');
    assert.equal(bad.status, 1);
    assert.match(bad.stderr, /03-solo\.html root must have class "solo"/);

    writeFileSync(path, '<section class="solo" data-id="x"><p>x</p></section>\n');
    assert.equal(run('build.mjs').status, 0, 'data-id is not an id');

    writeFileSync(path, "<section class='solo'><p>x</p></section>\n");
    assert.equal(run('build.mjs').status, 0, 'single-quoted class is a class');

    writeFileSync(path, '<section class="solo" id="solo"><p>x</p></section>\n');
    const wrongId = run('build.mjs');
    assert.equal(wrongId.status, 1);
    assert.match(wrongId.stderr, /root id must be absent/);
  } finally {
    writeFileSync(path, saved);
  }
});

test('build recognises data-stub with any quoting', () => {
  const path = section('03-solo.html');
  const saved = readFileSync(path, 'utf8');
  try {
    writeFileSync(path, '<section class="solo" data-stub><p>x</p></section>\n');
    assert.equal(run('lint.mjs').status, 0);
  } finally {
    writeFileSync(path, saved);
  }
});

test('lint includes the tag-balance check', () => {
  assert.deepEqual(runLint({ html: GOOD, cssFiles: GOOD_CSS, stubs: new Set() }).balance, []);
  const broken = mutate('<h3>One</h3>', '<h3>One');
  assert.ok(runLint({ html: broken, cssFiles: GOOD_CSS, stubs: new Set() }).balance.length > 0);
});

test('npm run lint fails on broken markup in a section', () => {
  const path = section('04-proof.html');
  const saved = readFileSync(path, 'utf8');
  try {
    writeFileSync(path, saved.replace(/<\/p>/, ''));
    const r = run('lint.mjs');
    assert.equal(r.status, 1);
    assert.match(r.stdout, /FAIL\s+balance/);
  } finally {
    writeFileSync(path, saved);
  }
});
