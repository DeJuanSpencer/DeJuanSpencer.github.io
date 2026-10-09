import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assemble } from '../scripts/build.mjs';
import { checkBalance, visibleText } from '../scripts/lib/parse-html.mjs';
import { GOOD } from './helpers.mjs';

test('a well-formed document is balanced', () => {
  assert.deepEqual(checkBalance(GOOD), []);
});

test('void elements, comments, script and quoted ">" do not confuse the tokenizer', () => {
  const html = '<div>\n<br>\n<img src="a.png" alt="x > y">\n<!-- <p> not a tag -->\n<script>if (a < b) { x = "<div>"; }</script>\n<style>a > b { color: red }</style>\n</div>';
  assert.deepEqual(checkBalance(html), []);
});

test('an unclosed tag is reported with its line number', () => {
  const problems = checkBalance('<div>\n<p>text\n</div>');
  assert.ok(problems.some((p) => p.startsWith('line 2:') && p.includes('<p>')), problems.join('\n'));
});

test('a never-closed tag is reported at the end', () => {
  const problems = checkBalance('<section>\n<div>\n</div>');
  assert.deepEqual(problems, ['line 1: <section> opened here is never closed']);
});

test('a mismatched closing tag is reported', () => {
  const problems = checkBalance('<div>\n<span>\n</div>\n</span>');
  assert.ok(problems.length >= 2, problems.join('\n'));
  assert.ok(problems.some((p) => p.includes('<span>')));
});

test('a stray closing tag is reported', () => {
  assert.deepEqual(checkBalance('<p>a</p>\n</div>'), ['line 2: </div> has no matching open tag']);
});

test('closing a void element is reported', () => {
  assert.equal(checkBalance('<br></br>').length, 1);
});

test('an unterminated comment and an unterminated tag are reported', () => {
  assert.equal(checkBalance('<p>a</p><!-- open').length, 1);
  assert.ok(checkBalance('<p>a</p><a href="x"').length >= 1);
});

test('visible text joins inline tags, separates blocks and skips head, comments and scripts', () => {
  const text = visibleText('<html><head><title>No</title></head><body><h1>I build <em>customers</em> well</h1><p>Two</p><!-- no --><script>no()</script><p>Three &amp; four</p></body></html>');
  assert.equal(text, 'I build customers well Two Three & four');
});

test('the assembled page and every section partial are balanced', () => {
  const site = assemble();
  assert.deepEqual(checkBalance(site.html), []);
  for (const [name, html] of Object.entries(site.sections)) {
    assert.deepEqual(checkBalance(html), [], `section ${name}`);
  }
});
