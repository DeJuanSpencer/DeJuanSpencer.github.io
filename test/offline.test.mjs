import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
}

// Patterns are built from pieces so this file does not match itself.
const banned = ['http', 'https', 'net', 'dns'].map((m) => ({
  label: `node:${m}`,
  re: new RegExp(`(?:from\\s*|import\\s*\\(\\s*|require\\s*\\(\\s*)['"](?:node:)?${m}['"]`),
}));
banned.push({ label: 'fetch call', re: new RegExp('\\bfet' + 'ch\\s*\\(') });

test('scripts (except the font fetcher) and tests make no network calls', () => {
  const files = [...walk(join(root, 'scripts')), ...walk(join(root, 'test'))]
    .filter((f) => /\.(mjs|js|cjs)$/.test(f))
    .filter((f) => relative(root, f) !== join('scripts', 'fetch-fonts.mjs'));
  assert.ok(files.length > 0);
  for (const f of files) {
    const text = readFileSync(f, 'utf8');
    for (const b of banned) assert.ok(!b.re.test(text), `${relative(root, f)} uses ${b.label}`);
  }
});
