// Machine checks over the assembled page and the source css. Each check returns an array of problem strings.
// Inputs are plain values (html text, css file list, stub set) so fixtures can feed them bad markup.
import { hasAncestor, hasClass, normalizeText, parse, visibleText } from './parse-html.mjs';

const NAV_LINKS = ['#work', '#services', '#process', '#faq', '#about'];
const PHONE = 'tel:+14807574367';

// The marked slot strings and labels that are allowed to look like placeholders.
export const PLACEHOLDER_ALLOWLIST = [
  '[Live site link]',
  '[Shop photo — with Terrence\'s permission]',
  '[One honest outcome — e.g. takes bookings after hours]',
  '[Terrence\'s quote goes here — coming from the Oct 9 visit]',
  'Photo: DeJuan inside a real client shop',
  'Placeholder slot',
];

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');
const elements = (tokens) => tokens.filter((t) => t.type === 'open');

// (b) Anchors: ids unique, every href="#x" and aria-labelledby resolves, nav links are the five in order.
export function checkAnchors(html, { stubs = new Set() } = {}) {
  const problems = [];
  const { tokens } = parse(html);
  const opens = elements(tokens);
  const ids = new Map();
  for (const t of opens) {
    if (t.attrs.id === undefined) continue;
    if (t.attrs.id === '') problems.push(`line ${t.line}: empty id on <${t.name}>`);
    ids.set(t.attrs.id, (ids.get(t.attrs.id) || 0) + 1);
  }
  for (const [id, count] of ids) if (count > 1) problems.push(`id "${id}" is used ${count} times`);
  for (const t of opens) {
    const href = t.attrs.href;
    if (typeof href === 'string' && href.startsWith('#')) {
      const target = href.slice(1);
      if (!target) problems.push(`line ${t.line}: href="#" points nowhere`);
      else if (ids.get(target) !== 1) problems.push(`line ${t.line}: href="${href}" does not resolve to exactly one id`);
    }
    for (const attr of ['aria-labelledby', 'aria-describedby', 'aria-controls']) {
      if (t.attrs[attr] === undefined) continue;
      for (const ref of t.attrs[attr].split(/\s+/).filter(Boolean)) {
        if (ids.get(ref) !== 1) problems.push(`line ${t.line}: ${attr}="${ref}" does not resolve to exactly one id`);
      }
    }
  }
  if (!stubs.has('nav')) {
    const header = opens.find((t) => t.name === 'header' && (t.attrs.class || '').split(/\s+/).includes('nav'));
    if (!header) {
      problems.push('no <header class="nav"> found');
    } else {
      const links = opens
        .filter((t) => t.name === 'a' && inside(t, header))
        .map((t) => t.attrs.href)
        .filter((h) => typeof h === 'string' && h.startsWith('#') && h !== '#top');
      if (links.join(',') !== NAV_LINKS.join(',')) {
        problems.push(`nav links must be ${NAV_LINKS.join(', ')} in order, found ${links.join(', ') || 'none'}`);
      }
    }
  }
  return problems;
}

// True when token t sits inside the element opened by token `open`.
function inside(t, open) {
  return hasAncestor(t.node, (n) => n === open.element);
}

// (c) Placeholders: after removing the allowlisted strings, no lorem, TODO, TBD, FIXME or placeholder
// in the page or in the source css.
export function checkPlaceholders(html, cssFiles = []) {
  const problems = [];
  const banned = /lorem|\bTODO\b|\bTBD\b|\bFIXME\b|placeholder/gi;
  const strip = (text) => {
    let out = text;
    for (const s of PLACEHOLDER_ALLOWLIST) {
      const re = new RegExp(escapeRegExp(s).replace(/\\?'/g, "(?:'|&#39;|&#x27;|&apos;|’)").replace(/—/g, '(?:—|&mdash;|&#8212;)'), 'gi');
      out = out.replace(re, ' ');
    }
    return out;
  };
  const scan = (label, text) => {
    const cleaned = strip(text);
    let m;
    banned.lastIndex = 0;
    while ((m = banned.exec(cleaned))) {
      const line = cleaned.slice(0, m.index).split('\n').length;
      problems.push(`${label} line ${line}: "${m[0]}"`);
    }
  };
  scan('index.html', html);
  for (const f of cssFiles) scan(`css/${f.name}`, f.text);
  return problems;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// (d) Required copy: every verbatim string appears in visible text. `required` maps a section name to strings.
// A section that still carries data-stub is skipped. Returns { problems, skipped: [section names] }.
export function checkRequiredCopy(html, required, stubs = new Set()) {
  const text = visibleText(html);
  const problems = [];
  const skipped = [];
  for (const [section, strings] of Object.entries(required)) {
    if (stubs.has(section)) {
      skipped.push(section);
      continue;
    }
    for (const s of strings) {
      if (!text.includes(normalizeText(s))) problems.push(`${section}: missing "${s}"`);
    }
  }
  return { problems, skipped };
}

// (e) Banned content.
export function checkBanned(html, cssFiles = []) {
  const problems = [];
  const { tokens } = parse(html);
  const text = visibleText(html);
  if (/github/i.test(html)) problems.push('"github" appears in the page (text or href)');
  const stack = text.match(/\b(react|next\.js|node|javascript|tailwind|vercel)\b/gi);
  if (stack) problems.push(`stack words in visible text: ${[...new Set(stack.map((s) => s.toLowerCase()))].join(', ')}`);
  for (const t of tokens) {
    if (t.type === 'open' && t.name === 'script') problems.push(`line ${t.line}: <script> tag`);
    if (t.type === 'open' && typeof t.attrs.href === 'string' && /^sms:/i.test(t.attrs.href)) problems.push(`line ${t.line}: sms: link`);
  }
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/i.test(html)) problems.push('Google font origin in the page');
  for (const f of cssFiles) if (/fonts\.googleapis\.com|fonts\.gstatic\.com/i.test(f.text)) problems.push(`Google font origin in css/${f.name}`);
  const stats = text.match(/\d[\d,.]*\s*%|\d+\s*\+\s*(?:clients|customers)/gi);
  if (stats) problems.push(`invented-stat pattern in visible text: ${stats.join(', ')}`);
  for (const t of tokens) {
    if (t.type !== 'text') continue;
    if (hasAncestor(t.node, (n) => n.name === 'head' || hasClass(n, 'testimonials'))) continue;
    const decoded = normalizeText(t.text);
    if (/["“”]/.test(decoded)) problems.push(`line ${t.line}: quote marks outside .testimonials`);
  }
  return problems;
}

const COLOR_WORDS = 'white|black|red|green|blue|gray|grey|orange|yellow|silver|brown|tan|beige|ivory|gold|navy|teal|maroon|purple|pink';
const COLOR_PROPS = /(?:^|[\s;{])(?:color|background(?:-color)?|border(?:-[a-z]+)*|outline(?:-color)?|fill|stroke|box-shadow|text-shadow|text-decoration(?:-color)?|caret-color|accent-color)\s*:\s*([^;}]+)/gi;

function rawColours(css) {
  const found = [];
  const clean = stripComments(css).replace(/url\([^)]*\)/gi, 'url()');
  for (const m of clean.matchAll(/#[0-9a-f]{3,8}\b/gi)) found.push(m[0]);
  for (const m of clean.matchAll(/\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/gi)) found.push(m[0]);
  for (const m of clean.matchAll(COLOR_PROPS)) {
    const named = m[1].match(new RegExp(`\\b(?:${COLOR_WORDS})\\b`, 'gi'));
    if (named) found.push(...named);
  }
  return found;
}

// (f) Style lint.
export function checkStyle(html, cssFiles = [], { stubs = new Set() } = {}) {
  const problems = [];
  const { tokens } = parse(html);
  const opens = elements(tokens);
  for (const f of cssFiles) {
    if (f.name === 'base.css' || f.name === 'fonts.css') continue;
    const found = rawColours(f.text);
    if (found.length) problems.push(`css/${f.name}: raw colours (use var(--*)): ${[...new Set(found)].join(', ')}`);
  }
  for (const t of opens) {
    if (typeof t.attrs.style === 'string' && rawColours(`x{${t.attrs.style}}`).length) problems.push(`line ${t.line}: raw colour in an inline style`);
  }
  for (const t of tokens) {
    if (t.type === 'rawtext' && t.name === 'style' && rawColours(t.text).length) problems.push(`line ${t.line}: raw colour in a <style> block`);
  }
  for (const t of opens) {
    if (t.name !== 'img') continue;
    for (const a of ['alt', 'width', 'height']) if (t.attrs[a] === undefined) problems.push(`line ${t.line}: <img> without ${a}`);
  }
  if (!stubs.has('hero')) {
    const h1 = opens.filter((t) => t.name === 'h1').length;
    if (h1 !== 1) problems.push(`expected exactly one h1, found ${h1}`);
  }
  let last = 0;
  for (const t of opens) {
    const m = t.name.match(/^h([1-6])$/);
    if (!m) continue;
    const level = Number(m[1]);
    if (last === 0 && level !== 1 && !stubs.has('hero')) problems.push(`line ${t.line}: first heading is h${level}, not h1`);
    if (last && level > last + 1) problems.push(`line ${t.line}: heading jumps from h${last} to h${level}`);
    last = level;
  }
  const htmlTag = opens.find((t) => t.name === 'html');
  if (!htmlTag || !htmlTag.attrs.lang) problems.push('<html> has no lang attribute');
  for (const t of opens) {
    const href = t.attrs.href;
    if (typeof href === 'string' && /^tel:/i.test(href) && href !== PHONE) problems.push(`line ${t.line}: tel link is "${href}", expected ${PHONE}`);
  }
  return problems;
}

// Runs the lint set (b, c, e, f) and returns { name: problems }.
export function runLint({ html, cssFiles, stubs }) {
  return {
    anchors: checkAnchors(html, { stubs }),
    placeholders: checkPlaceholders(html, cssFiles),
    banned: checkBanned(html, cssFiles),
    style: checkStyle(html, cssFiles, { stubs }),
  };
}
