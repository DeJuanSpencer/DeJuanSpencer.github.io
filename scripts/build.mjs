// Assembles dist/ from src/. Reads src/, writes dist/, makes no network access.
// assemble() builds the page in memory so lint and tests can use it without touching dist/.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseAttrs } from './lib/parse-html.mjs';

const here = fileURLToPath(import.meta.url);
export const root = join(dirname(here), '..');
const src = join(root, 'src');
const dist = join(root, 'dist');

// Section files in document order. 01 sits before <main>, 12 after it.
export const sections = [
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
  throw new Error(`build failed: ${message}`);
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
  const [, foundTag, rawAttrs] = open;
  const attrs = parseAttrs(rawAttrs);
  if (foundTag.toLowerCase() !== tag) fail(`${file} root must be <${tag}>, found <${foundTag}>`);
  const classes = (attrs.class || '').split(/\s+/);
  if (!classes.includes(cls)) fail(`${file} root must have class "${cls}"`);
  const foundId = attrs.id ?? null;
  if (foundId !== id) fail(`${file} root id must be ${id === null ? 'absent' : `"${id}"`}, found ${foundId === null ? 'none' : `"${foundId}"`}`);
  return { name: cls, html: html.trim() + '\n', stub: 'data-stub' in attrs };
}

function readCss(name) {
  const path = join(src, 'css', name);
  if (!existsSync(path)) fail(`css file src/css/${name} is missing${name === 'fonts.css' ? ' (run scripts/fetch-fonts.mjs once and commit the result)' : ''}`);
  return { name, text: readFileSync(path, 'utf8') };
}

// Returns { html, css, sections: { name: html }, stubs: Set of section names, cssFiles: [{ name, text }] }.
export function assemble() {
  const parts = sections.map(readSection);
  const head = readRequired(join(src, 'layout', 'head.html'), 'src/layout/head.html');
  const tail = readRequired(join(src, 'layout', 'tail.html'), 'src/layout/tail.html');
  const html = [
    head.trimEnd(),
    parts[0].html.trimEnd(),
    '<main id="main">',
    ...parts.slice(1, 11).map((p) => p.html.trimEnd()),
    '</main>',
    parts[11].html.trimEnd(),
    tail.trimEnd(),
    '',
  ].join('\n');
  const cssFiles = [readCss('fonts.css'), readCss('base.css'), readCss('top.css'), readCss('bottom.css')];
  const css = cssFiles.map((c) => c.text.trim()).filter(Boolean).join('\n\n') + '\n';
  return {
    html,
    css,
    cssFiles,
    sections: Object.fromEntries(parts.map((p) => [p.name, p.html])),
    stubs: new Set(parts.filter((p) => p.stub).map((p) => p.name)),
  };
}

function writeDist({ html, css }) {
  rmSync(dist, { recursive: true, force: true });
  mkdirSync(join(dist, 'assets'), { recursive: true });
  writeFileSync(join(dist, 'index.html'), html);
  writeFileSync(join(dist, 'assets', 'site.css'), css);
  if (existsSync(join(src, 'assets'))) cpSync(join(src, 'assets'), join(dist, 'assets'), { recursive: true });
  console.log(`built dist/index.html (${html.length} bytes) and dist/assets/site.css (${css.length} bytes)`);
}

if (process.argv[1] === here) {
  try {
    writeDist(assemble());
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
