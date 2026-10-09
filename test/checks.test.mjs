import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { assemble, root } from '../scripts/build.mjs';
import { checkAnchors, checkBanned, checkPlaceholders, checkStyle, runLint } from '../scripts/lib/checks.mjs';
import { GOOD, GOOD_CSS, mutate } from './helpers.mjs';

const fails = (problems, needle) => {
  assert.ok(problems.length > 0, 'expected a problem, found none');
  if (needle) assert.ok(problems.some((p) => p.includes(needle)), `expected "${needle}" in:\n${problems.join('\n')}`);
};

test('the good fixture passes every lint check', () => {
  const results = runLint({ html: GOOD, cssFiles: GOOD_CSS, stubs: new Set() });
  for (const [name, problems] of Object.entries(results)) assert.deepEqual(problems, [], name);
});

test('anchors: a missing target fails', () => {
  fails(checkAnchors(mutate('href="#faq"', 'href="#nowhere"')), '#nowhere');
});
test('anchors: a duplicate id fails', () => {
  fails(checkAnchors(mutate('id="faq"', 'id="work"')), 'used 2 times');
});
test('anchors: href="#" fails', () => {
  fails(checkAnchors(mutate('href="#faq"', 'href="#"')), 'points nowhere');
});
test('anchors: a missing aria-labelledby target fails', () => {
  fails(checkAnchors(mutate('aria-labelledby="hero-title"', 'aria-labelledby="gone"')), 'gone');
});
test('anchors: a missing nav link fails', () => {
  fails(checkAnchors(mutate('    <a href="#about">About</a>\n', '')), 'nav links must be');
});
test('anchors: nav links out of order fail', () => {
  const swapped = mutate('<a href="#work">Work</a>', '<a href="#services">Services</a>').replace('<a href="#services">Services</a>\n    <a href="#process">', '<a href="#work">Work</a>\n    <a href="#process">');
  fails(checkAnchors(swapped), 'nav links must be');
});
test('anchors: a sixth nav link fails', () => {
  fails(checkAnchors(mutate('<a href="#about">About</a>', '<a href="#about">About</a><a href="#contact">More</a>')), 'nav links must be');
});
test('anchors: the nav check is skipped while the nav is a stub', () => {
  assert.deepEqual(checkAnchors(mutate('    <a href="#about">About</a>\n', ''), { stubs: new Set(['nav']) }), []);
});

test('placeholders: lorem, TODO, TBD, FIXME and placeholder all fail', () => {
  for (const word of ['Lorem ipsum', 'TODO', 'tbd', 'FIXME', 'a placeholder here']) {
    fails(checkPlaceholders(mutate('Plain text.', word)), word.split(' ')[0].toLowerCase() === 'a' ? 'placeholder' : undefined);
  }
});
test('placeholders: a placeholder class name fails', () => {
  fails(checkPlaceholders(mutate('class="about"', 'class="about placeholder-box"')));
});
test('placeholders: source css is scanned', () => {
  fails(checkPlaceholders(GOOD, [...GOOD_CSS, { name: 'top.css', text: '.placeholder { color: var(--ink) }' }]), 'top.css');
});
test('placeholders: the allowlist passes, ignoring case', () => {
  const allowed = [
    '[Live site link]',
    '[Shop photo — with Terrence\'s permission]',
    '[One honest outcome — e.g. takes bookings after hours]',
    '[Terrence\'s quote goes here — coming from the Oct 9 visit]',
    'Photo: DeJuan inside a real client shop',
    'Placeholder slot',
    'PLACEHOLDER SLOT',
  ].join(' / ');
  assert.deepEqual(checkPlaceholders(mutate('Plain text.', allowed)), []);
});
test('placeholders: allowlisted text does not hide other offences', () => {
  fails(checkPlaceholders(mutate('Plain text.', 'Placeholder slot and a placeholder')));
});

test('banned: github in text or href fails', () => {
  fails(checkBanned(mutate('Plain text.', 'See GitHub.')), 'github');
  fails(checkBanned(mutate('Plain text.', '<a href="https://github.com/x">x</a>')), 'github');
});
test('banned: stack words in visible text fail', () => {
  for (const word of ['React', 'Next.js', 'Node', 'JavaScript', 'Tailwind', 'Vercel']) {
    fails(checkBanned(mutate('Plain text.', `Built with ${word}.`)), 'stack words');
  }
});
test('banned: stack words are allowed in attributes and not inside other words', () => {
  assert.deepEqual(checkBanned(mutate('Plain text.', 'Reaction and anode.')), []);
});
test('banned: a script tag fails', () => {
  fails(checkBanned(mutate('</body>', '<script>x()</script></body>')), '<script>');
});
test('banned: Google font origins fail in the page and in css', () => {
  fails(checkBanned(mutate('<title>', '<link href="https://fonts.googleapis.com/css2"><title>')), 'Google font');
  fails(checkBanned(GOOD, [{ name: 'fonts.css', text: '@import url(https://fonts.gstatic.com/x);' }]), 'Google font');
});
test('banned: invented stats fail', () => {
  fails(checkBanned(mutate('Plain text.', 'Sites load 40% faster.')), 'invented-stat');
  fails(checkBanned(mutate('Plain text.', 'Trusted by 100+ clients.')), 'invented-stat');
});
test('banned: quote marks outside the testimonials section fail', () => {
  fails(checkBanned(mutate('Plain text.', 'He said "hello".')), 'quote marks');
  fails(checkBanned(mutate('Plain text.', 'He said “hello”.')), 'quote marks');
  fails(checkBanned(mutate('Plain text.', 'He said &quot;hello&quot;.')), 'quote marks');
});
test('banned: quote marks inside the testimonials section and apostrophes elsewhere pass', () => {
  assert.deepEqual(checkBanned(mutate('Plain text.', "It's fine.")), []);
});
test('banned: sms links fail', () => {
  fails(checkBanned(mutate('Plain text.', '<a href="sms:+14807574367">Text</a>')), 'sms:');
});

test('style: raw colours fail outside base.css and fonts.css', () => {
  const css = (text) => [...GOOD_CSS, { name: 'top.css', text }];
  fails(checkStyle(GOOD, css('.a{color:#fff}')), 'raw colours');
  fails(checkStyle(GOOD, css('.a{background:rgba(0,0,0,.5)}')), 'raw colours');
  fails(checkStyle(GOOD, css('.a{border:1px solid black}')), 'raw colours');
  fails(checkStyle(GOOD, [{ name: 'bottom.css', text: '.a{outline:2px solid hsl(10 20% 30%)}' }]), 'raw colours');
});
test('style: tokens, color-mix, transparent, url fragments and base.css hex pass', () => {
  assert.deepEqual(checkStyle(GOOD, [
    ...GOOD_CSS,
    { name: 'fonts.css', text: '@font-face{src:url("/a.woff2")} .x{color:#fff}' },
    { name: 'top.css', text: '.a{color:var(--ink);background:transparent;fill:url(#abc);border:1px solid color-mix(in srgb, var(--ink) 20%, transparent)}' },
  ]), []);
});
test('style: raw colours in inline styles fail', () => {
  fails(checkStyle(mutate('<p>Plain', '<p style="color:#123456">Plain')), 'inline style');
});
test('style: an img without alt, width or height fails', () => {
  for (const attr of [' alt="A"', ' width="10"', ' height="10"']) {
    fails(checkStyle(mutate(attr, ''), GOOD_CSS), '<img>');
  }
});
test('style: exactly one h1', () => {
  fails(checkStyle(mutate('<h2>Work</h2>', '<h1>Again</h1>'), GOOD_CSS), 'exactly one h1');
  fails(checkStyle(mutate('<h1 id="hero-title">I build <em>things</em> well.</h1>', ''), GOOD_CSS), 'exactly one h1');
});
test('style: the h1 count is not enforced while the hero is a stub', () => {
  assert.deepEqual(checkStyle(mutate('<h1 id="hero-title">I build <em>things</em> well.</h1>', ''), GOOD_CSS, { stubs: new Set(['hero']) }), []);
});
test('style: skipped heading levels fail', () => {
  fails(checkStyle(mutate('<h3>One</h3>', '<h4>One</h4>'), GOOD_CSS), 'jumps from h2 to h4');
});
test('style: a missing lang fails', () => {
  fails(checkStyle(mutate('<html lang="en">', '<html>'), GOOD_CSS), 'lang');
});
test('style: a tel link other than +14807574367 fails', () => {
  fails(checkStyle(mutate('<a href="tel:+14807574367">Call</a>', '<a href="tel:4807574367">Call</a>'), GOOD_CSS), 'tel link');
});

test('smoke: the real site passes every lint check', () => {
  const site = assemble();
  for (const [name, problems] of Object.entries(runLint(site))) assert.deepEqual(problems, [], name);
});
test('smoke: npm run lint exits 0 and prints no failures', () => {
  const out = execFileSync(process.execPath, ['scripts/lint.mjs'], { cwd: root, encoding: 'utf8' });
  assert.ok(!out.includes('FAIL'));
});
