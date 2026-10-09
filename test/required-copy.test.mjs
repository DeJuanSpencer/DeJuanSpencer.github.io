import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { assemble, root, sections } from '../scripts/build.mjs';
import { checkRequiredCopy } from '../scripts/lib/checks.mjs';
import { GOOD } from './helpers.mjs';

const required = JSON.parse(readFileSync(join(root, 'scripts', 'required-copy.json'), 'utf8'));
const site = assemble();
const names = sections.map((s) => s[2]);

test('required-copy.json covers every section with non-empty strings', () => {
  assert.deepEqual(Object.keys(required).sort(), [...names].sort());
  for (const [section, strings] of Object.entries(required)) {
    assert.ok(strings.length > 0, section);
    for (const s of strings) assert.ok(typeof s === 'string' && s.trim() === s && s.length > 0, `${section}: "${s}"`);
  }
});

test('fixture: a missing string is reported, a present one is not', () => {
  const copy = { hero: ['I build things well.', 'Never written anywhere'] };
  const { problems, skipped } = checkRequiredCopy(GOOD, copy, new Set());
  assert.deepEqual(problems, ['hero: missing "Never written anywhere"']);
  assert.deepEqual(skipped, []);
});

test('fixture: whitespace, entities and curly apostrophes are normalised', () => {
  const html = '<body><p>It&rsquo;s   a\n  fine &amp; plain day.</p><p>Tom&#39;s shop</p></body>';
  const { problems } = checkRequiredCopy(html, { hero: ["It's a fine & plain day.", "Tom's shop"] });
  assert.deepEqual(problems, []);
});

test('fixture: a section that still carries data-stub is skipped', () => {
  const { problems, skipped } = checkRequiredCopy(GOOD, { work: ['Not there yet'], hero: ['I build things well.'] }, new Set(['work']));
  assert.deepEqual(problems, []);
  assert.deepEqual(skipped, ['work']);
});

// One test per section. A section still carrying data-stub is reported as skipped by the runner.
for (const name of names) {
  test(`required copy: ${name}`, (t) => {
    if (site.stubs.has(name)) {
      t.skip(`${name} still has data-stub`);
      return;
    }
    const { problems } = checkRequiredCopy(site.html, { [name]: required[name] }, new Set());
    assert.deepEqual(problems, []);
  });
}
