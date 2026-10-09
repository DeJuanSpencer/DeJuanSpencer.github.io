// Static performance budget check.
// This approximates what Lighthouse rewards (small, fast, non-blocking pages). It is not a Lighthouse
// score and does not replace one: nothing here renders the page or measures timing.
// It reads the page assembled in memory plus src/assets, prints a metric-versus-limit table,
// and exits non-zero on any breach. No network access.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { assemble, root } from './build.mjs';
import { parse } from './lib/parse-html.mjs';

const KB = 1024;

export function loadAssets(dir = join(root, 'src', 'assets')) {
  const out = [];
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else out.push({ rel: relative(dir, p).split('\\').join('/'), bytes: readFileSync(p) });
    }
  };
  if (statSync(dir, { throwIfNoEntry: false })) walk(dir);
  return out;
}

const gz = (text) => gzipSync(Buffer.from(text), { level: 9 }).length;
const kb = (n) => `${(n / KB).toFixed(1)} KB`;
const isExternal = (v) => /^(?:https?:)?\/\//i.test(v.trim());

// input: { html, css, assets: [{ rel, bytes }] }. Returns rows { metric, value, limit, ok }.
export function evaluate({ html, css, assets }) {
  const rows = [];
  const add = (metric, value, limit, ok) => rows.push({ metric, value, limit, ok });
  const { tokens } = parse(html);
  const opens = tokens.filter((t) => t.type === 'open');
  const inHead = (t) => { for (let n = t.node; n; n = n.parent) if (n.name === 'head') return true; return false; };

  const htmlGz = gz(html);
  add('index.html gzip', kb(htmlGz), '<= 30 KB', htmlGz <= 30 * KB);
  const cssGz = gz(css);
  add('site.css gzip', kb(cssGz), '<= 25 KB', cssGz <= 25 * KB);

  const fonts = assets.filter((a) => a.rel.endsWith('.woff2'));
  const biggest = Math.max(0, ...fonts.map((f) => f.bytes.length));
  const fontTotal = fonts.reduce((s, f) => s + f.bytes.length, 0);
  add('largest woff2', kb(biggest), '< 60 KB', biggest < 60 * KB);
  add('woff2 total', `${fonts.length} files, ${kb(fontTotal)}`, '<= 200 KB', fontTotal <= 200 * KB);

  const total = Buffer.byteLength(html) + Buffer.byteLength(css) + assets.reduce((s, a) => s + a.bytes.length, 0);
  add('total dist weight', kb(total), '<= 350 KB', total <= 350 * KB);

  const scripts = opens.filter((t) => t.name === 'script').length;
  add('script tags', String(scripts), '0', scripts === 0);

  const external = [];
  for (const t of opens) {
    for (const attr of ['src', 'href', 'srcset', 'poster', 'action']) {
      const v = t.attrs[attr];
      if (typeof v !== 'string' || /^(?:tel:|#|data:)/i.test(v.trim())) continue;
      if (isExternal(v)) external.push(`${attr}=${v}`);
    }
  }
  for (const m of css.matchAll(/url\(\s*(["']?)([^)"']*)\1\s*\)/gi)) {
    if (!/^data:/i.test(m[2].trim()) && isExternal(m[2])) external.push(`url(${m[2]})`);
  }
  add('external origins', external.length ? external.join(', ') : '0', '0', external.length === 0);

  const sheets = opens.filter((t) => t.name === 'link' && /\bstylesheet\b/i.test(t.attrs.rel || ''));
  const blockingScripts = opens.filter((t) => t.name === 'script' && !('async' in t.attrs) && !('defer' in t.attrs) && t.attrs.type !== 'module').length;
  const blocking = sheets.length + blockingScripts;
  add('render-blocking resources', `${blocking} (${sheets.filter(inHead).length} stylesheet in head)`, '1 stylesheet, in head',
    blocking === 1 && sheets.length === 1 && inHead(sheets[0]));

  const faces = css.match(/@font-face\s*\{[^}]*\}/g) || [];
  const badDisplay = faces.filter((f) => !/font-display\s*:\s*(?:swap|optional)\s*[;}]/.test(f)).length;
  add('@font-face without swap/optional', `${badDisplay} of ${faces.length}`, '0', badDisplay === 0);

  const preloads = opens.filter((t) => t.name === 'link' && /\bpreload\b/i.test(t.attrs.rel || ''));
  const assetPaths = new Set(assets.map((a) => `/assets/${a.rel}`));
  const preloadOk = preloads.length === 2 && preloads.every((p) => p.attrs.as === 'font' && 'crossorigin' in p.attrs && assetPaths.has(p.attrs.href));
  add('font preloads', `${preloads.length}${preloadOk ? ', valid' : ', invalid'}`, 'exactly 2, as=font, crossorigin, target exists', preloadOk);

  const imports = (css.match(/@import\b/g) || []).length;
  add('@import rules', String(imports), '0', imports === 0);

  const viewport = opens.some((t) => t.name === 'meta' && t.attrs.name === 'viewport');
  add('viewport meta', viewport ? 'present' : 'missing', 'present', viewport);

  const imgProblems = [];
  for (const t of opens.filter((x) => x.name === 'img')) {
    for (const a of ['width', 'height']) if (t.attrs[a] === undefined) imgProblems.push(`line ${t.line} no ${a}`);
    if (t.attrs.loading !== 'lazy') imgProblems.push(`line ${t.line} not loading=lazy`);
    const file = assets.find((a) => `/assets/${a.rel}` === t.attrs.src);
    if (file && file.bytes.length > 100 * KB) imgProblems.push(`line ${t.line} ${kb(file.bytes.length)}`);
  }
  add('img attributes and size', imgProblems.length ? imgProblems.join('; ') : `${opens.filter((x) => x.name === 'img').length} images ok`,
    'width, height, loading=lazy, <= 100 KB', imgProblems.length === 0);

  const longest = Math.max(0, ...opens.map((t) => (typeof t.attrs.style === 'string' ? t.attrs.style.length : 0)));
  add('longest inline style', `${longest} chars`, '<= 200 chars', longest <= 200);

  return rows;
}

export function formatTable(rows) {
  const cols = ['metric', 'value', 'limit', 'status'];
  const body = rows.map((r) => [r.metric, r.value, r.limit, r.ok ? 'ok' : 'FAIL']);
  const widths = cols.map((c, i) => Math.max(c.length, ...body.map((r) => r[i].length)));
  const line = (r) => r.map((c, i) => c.padEnd(widths[i])).join('  ').trimEnd();
  return [line(cols), line(widths.map((w) => '-'.repeat(w))), ...body.map(line)].join('\n');
}

export function runBudget(site = assemble(), assets = loadAssets()) {
  const rows = evaluate({ html: site.html, css: site.css, assets });
  return { rows, table: formatTable(rows), failed: rows.filter((r) => !r.ok) };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { table, failed } = runBudget();
  console.log(table);
  if (failed.length) {
    console.error(`budget failed: ${failed.map((f) => f.metric).join(', ')}`);
    process.exit(1);
  }
}
