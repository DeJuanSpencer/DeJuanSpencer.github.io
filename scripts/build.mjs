// Assembles dist/ from src/. Reads src/, writes dist/, makes no network access.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src');
const dist = join(root, 'dist');

// Section files in document order. 01 sits before <main>, 12 after it.
const sections = [
  ['01-nav.html', 'header', 'nav', null],
  ['02-hero.html', 'section', 'hero', 'top'],
  ['03-solo.html', 'section', 'solo', null],
  ['04-proof.html', 'section', 'proof', null],
  ['05-work.html', 'section', 'work', 'work'],
  ['06-services.html', 'section', 'services', 'services'],
  ['07-who.html', 'section', 'who', 'who'],
  ['08-process.html', 'section', 'process', 'process'],
  ['09-faq.html', 'section', 'faq', 'faq'],
  ['10-testimonials.html', 'section', 'testimonials', 'testimonials'],
  ['11-about.html', 'section', 'about', 'about'],
  ['12-footer.html', 'footer', 'footer', 'contact'],
];

function fail(message) {
  console.error(`build failed: ${message}`);
  process.exit(1);
}

function readRequired(path, label) {
  if (!existsSync(path)) fail(`${label} is missing (${path})`);
  const text = readFileSync(path, 'utf8');
  if (!text.trim()) fail(`${label} is empty (${path})`);
  return text;
}

function readSection([file, tag, cls, id]) {
  const html = readRequired(join(src, 'sections', file), `section file ${file}`);
  const open = html.trimStart().match(/^<([a-z][a-z0-9]*)\b([^>]*)>/i);
  if (!open) fail(`${file} does not start with an element`);
  const [, foundTag, attrs] = open;
  if (foundTag.toLowerCase() !== tag) fail(`${file} root must be <${tag}>, found <${foundTag}>`);
  const classes = (attrs.match(/\bclass="([^"]*)"/) || [, ''])[1].split(/\s+/);
  if (!classes.includes(cls)) fail(`${file} root must have class "${cls}"`);
  const foundId = (attrs.match(/\bid="([^"]*)"/) || [, null])[1];
  if (foundId !== id) fail(`${file} root id must be ${id === null ? 'absent' : `"${id}"`}, found ${foundId === null ? 'none' : `"${foundId}"`}`);
  return html.trim() + '\n';
}

function readCss(name, optional) {
  const path = join(src, 'css', name);
  if (!existsSync(path)) {
    if (optional) return '';
    fail(`css file ${name} is missing`);
  }
  return readFileSync(path, 'utf8');
}

const parts = sections.map(readSection);
const head = readRequired(join(src, 'layout', 'head.html'), 'src/layout/head.html');
const tail = readRequired(join(src, 'layout', 'tail.html'), 'src/layout/tail.html');

const html = [
  head.trimEnd(),
  parts[0].trimEnd(),
  '<main id="main">',
  ...parts.slice(1, 11).map((p) => p.trimEnd()),
  '</main>',
  parts[11].trimEnd(),
  tail.trimEnd(),
  '',
].join('\n');

const css = [readCss('fonts.css', true), readCss('base.css'), readCss('top.css'), readCss('bottom.css')]
  .map((c) => c.trim())
  .filter(Boolean)
  .join('\n\n') + '\n';

rmSync(dist, { recursive: true, force: true });
mkdirSync(join(dist, 'assets'), { recursive: true });
writeFileSync(join(dist, 'index.html'), html);
writeFileSync(join(dist, 'assets', 'site.css'), css);
if (existsSync(join(src, 'assets'))) cpSync(join(src, 'assets'), join(dist, 'assets'), { recursive: true });

console.log(`built dist/index.html (${html.length} bytes) and dist/assets/site.css (${css.length} bytes)`);
