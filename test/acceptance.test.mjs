// Done-contract acceptance checks that no other test covers.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'dist', 'index.html'), 'utf8');
const css = readFileSync(join(root, 'dist', 'assets', 'site.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const required = JSON.parse(readFileSync(join(root, 'scripts', 'required-copy.json'), 'utf8'));

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const body = html.slice(html.indexOf('<body'));
const text = decode(body.replace(/<\/?(em|strong|b|i)\b[^>]*>/g, '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
const count = (hay, needle) => hay.split(needle).length - 1;

// Flat list of { selector, decls } for top-level rules and rules inside @media.
function rules(source) {
  const out = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(source))) {
    const selector = m[1].trim();
    if (selector.startsWith('@')) continue;
    out.push({ selector, decls: m[2] });
  }
  return out;
}
const allRules = rules(css);
const rawBackground = (decls, token) =>
  decls.split(';').some((d) => /^\s*background(-color)?\s*:/.test(d) && d.includes(`var(--${token})`) && !d.includes('color-mix'));

test('the twelve sections appear in the brief order', () => {
  const order = ['<header class="nav"', 'id="top"', 'class="solo"', 'class="proof"', 'id="work"', 'id="services"', 'id="who"', 'id="process"', 'id="faq"', 'id="testimonials"', 'id="about"', 'id="contact"'];
  const at = order.map((s) => body.indexOf(s));
  at.forEach((n, i) => assert.ok(n >= 0, `missing ${order[i]}`));
  assert.deepEqual([...at].sort((a, b) => a - b), at, 'sections are out of order');
  assert.ok(body.indexOf('<main id="main">') < at[1] && body.indexOf('</main>') < at[11] && at[0] < body.indexOf('<main'), 'main must wrap sections 2 to 11 only');
});

test('required copy appears in brief order within the page', () => {
  let from = 0;
  for (const [section, strings] of Object.entries(required)) {
    for (const s of strings) {
      const i = text.indexOf(s.replace(/\s+/g, ' '), from);
      assert.ok(i >= from, `"${s}" (${section}) is missing or out of order`);
      from = i;
    }
  }
});

test('every call to action reads "Text or call (480) 757-4367" and dials the one number', () => {
  const links = [...body.matchAll(/<a\b[^>]*href="tel:([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)];
  assert.ok(links.every((l) => l[1] === '+14807574367'), 'a tel link has the wrong number');
  const labels = links.map((l) => l[2].replace(/<[^>]*>/g, '').trim());
  assert.equal(labels.filter((l) => l === 'Text or call (480) 757-4367').length, 3, 'hero, price card and footer each need the full button');
  assert.equal(labels.filter((l) => l === 'Text or call').length, 1, 'the nav button');
  assert.equal(labels.filter((l) => l === '(480) 757-4367').length, 1, 'the standalone hero number');
  assert.equal(links.length, 5);
  assert.equal(count(body, 'sms:'), 0);
});

test('prices appear as the brief writes them, add-ons once each', () => {
  for (const s of ['+$400', '+$150 each', '+$250']) assert.equal(count(text, s), 1, s);
  assert.equal(count(text, 'Care plan · $75/month'), 1);
  assert.equal(count(text, '$1,000'), 3, 'price card, FAQ answer, comparison row');
  assert.equal(count(text, '$75/month'), 2, 'care plan and FAQ answer');
});

test('slots: exactly the hero photo, three work slots and the quote; the kicker appears twice', () => {
  const slots = [...body.matchAll(/data-slot="([^"]*)"/g)].map((m) => m[1]);
  assert.deepEqual(slots, ['hero-photo', 'live-link', 'shop-photo', 'outcome', 'quote']);
  assert.equal((text.match(/placeholder slot/gi) || []).length, 2);
  assert.equal(count(text, 'Photo: DeJuan inside a real client shop'), 1, 'the aria-label is not visible text');
  assert.equal(count(text, '['), 4, 'only the four bracketed slots');
});

test('exactly one section has an ink background, and it is the footer', () => {
  const ink = allRules.filter((r) => rawBackground(r.decls, 'ink')).map((r) => r.selector);
  assert.deepEqual(ink, ['.footer'], 'only the footer');
  assert.equal(count(body, 'class="footer"'), 1);
});

test('sand is a background only on the price card', () => {
  assert.deepEqual(allRules.filter((r) => rawBackground(r.decls, 'sand')).map((r) => r.selector), ['.price-card']);
});

test('card shapes: radius and full borders only on the price card, testimonial card, buttons, slots, skip link and hero arch', () => {
  const radius = allRules.filter((r) => /border-radius\s*:/.test(r.decls)).map((r) => r.selector).sort();
  assert.deepEqual(radius, ['.btn', '.hero__arch', '.nav__cta', '.price-card', '.quote-card'].sort());
  const boxed = allRules.filter((r) => /(^|;)\s*border\s*:\s*[1-9]/.test(r.decls)).map((r) => r.selector).sort();
  assert.deepEqual(boxed, ['.price-card', '.quote-card', '.skip-link', '.slot'].sort());
  assert.ok(!/box-shadow/.test(css), 'no shadows');
});

test('font stacks fall back to system fonts, and every font-family goes through them', () => {
  assert.match(css, /--font-sans:\s*"Inter Tight",\s*system-ui[^;]*sans-serif;/);
  assert.match(css, /--font-serif:\s*"Newsreader",\s*Georgia[^;]*serif;/);
  const families = allRules.flatMap((r) => r.decls.split(';').filter((d) => /^\s*font-family\s*:/.test(d)));
  assert.ok(families.length > 0);
  for (const f of families) assert.ok(/var\(--font-(sans|serif)\)/.test(f) || /"(Inter Tight|Newsreader)"/.test(f), `bare font-family: ${f.trim()}`);
  assert.ok(!/@font-face[^}]*font-display:\s*block/.test(css));
});

test('keyboard focus is visible on paper and on the ink footer', () => {
  assert.ok(allRules.some((r) => r.selector === ':focus-visible' && /outline:\s*2px solid var\(--copper\)/.test(r.decls)));
  assert.ok(allRules.some((r) => /\.footer a:focus-visible/.test(r.selector) && /outline:\s*\d+px solid var\(--paper\)/.test(r.decls)));
  assert.ok(!/outline\s*:\s*(none|0)\b/.test(css), 'no rule removes the outline');
});

test('the skip link is the first thing in the body and targets #main', () => {
  assert.match(body, /^<body>\s*<a class="skip-link" href="#main">[^<]+<\/a>/);
  assert.equal(count(html, 'id="main"'), 1);
});

test('only Instagram is named as a platform', () => {
  const others = /\b(facebook|twitter|tiktok|yelp|linkedin|youtube|pinterest|snapchat|squarespace|wix|wordpress|shopify|godaddy)\b/i;
  assert.ok(!others.test(text) && !others.test(html));
  assert.equal(count(text, 'Instagram'), 1);
});

test('no stub markers, no inline event handlers, no external urls', () => {
  assert.ok(!/data-stub/.test(html));
  assert.ok(!/\son[a-z]+\s*=/.test(body));
  assert.ok(!/(?:href|src)="(?:https?:)?\/\//.test(html));
});

test('sentence case in source: no shouting text in the section partials', () => {
  const dir = join(root, 'src', 'sections');
  for (const f of readdirSync(dir)) {
    const t = decode(readFileSync(join(dir, f), 'utf8').replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]*>/g, ' '));
    const shout = (t.match(/\b[A-Z]{4,}\b/g) || []);
    assert.deepEqual(shout, [], `${f} has upper-case words in source`);
  }
});

test('head has a non-empty title and description', () => {
  assert.match(html, /<title>[^<]{10,}<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]{40,}">/);
});
