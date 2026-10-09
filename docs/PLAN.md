# Plan: Built by Seven site rebrand (Quiet Operator)

Forge run of 2026-10-09. Branch `forge/built-by-seven-site-rebrand-quiet-operator`. Written by the lead from the architect's plan. Every path is relative to the project folder `dejuanspencer-github-io/`. Builders never touch the bench root, `.claude/` at the bench root, or sibling project folders.

Brief: https://app.notion.com/p/3f478f7199f2819eb310d5c124a444e4 (the copy source of truth). Layout source of truth: `docs/reference/figma-v2-structure.xml` and the PNGs beside it.

## Ownership map

| slice | directories / files | teammate |
|---|---|---|
| tooling | `package.json`, `vercel.json`, `.gitignore`, `README.md`, `scripts/**`, `test/**`, `src/layout/**`, `src/css/base.css`, `src/css/fonts.css`, `src/assets/**` (fonts, favicon), and the repo cleanup (`git rm` of `frontend/`, `site/`, `node_modules/`, `.next/`, `.claude/launch.json`, the root lockfile) | builder-tooling |
| top | `src/sections/01-nav.html`, `02-hero.html`, `03-solo.html`, `04-proof.html`, `05-work.html`, and `src/css/top.css` | builder-top |
| bottom | `src/sections/06-services.html`, `07-who.html`, `08-process.html`, `09-faq.html`, `10-testimonials.html`, `11-about.html`, `12-footer.html`, and `src/css/bottom.css` | builder-bottom |
| review and ship | no files; findings go to the owner of the file concerned | qa, designer, pre-commit-reviewer, devops |
| docs | `docs/**` | lead |

No file is in two slices. A section builder who needs a new shared class asks builder-tooling (through the lead), or defines a section-scoped class in their own css file. No JavaScript anywhere: no `src/js`, no script tag.

## Shared contract

### Tokens (CSS custom properties on `:root`, in base.css only)
- Colours: `--paper #F5F0E6`, `--ink #1B1815`, `--copper #B26E3B`, `--sand #E7DCC3`, `--hairline rgba(27,24,21,.18)`. Added 2026-10-09 on Seven's decision: `--copper-text #885630` (small copper text on paper or sand, and the primary button fill under a paper label) and `--copper-on-ink #B3713E` (small copper text and the button fill on the ink footer, with an ink label). Large elements (the 88px numerals, the quote mark, rules, check marks, slot outlines) keep `--copper`.
- `--font-sans` is "Inter Tight" with a system-ui fallback stack. `--font-serif` is "Newsreader" with a Georgia fallback.
- `--container 1200px` and `--gutter`.
- Section css files use `var(--*)` only. No raw hex or rgba colours outside base.css and fonts.css; lint enforces this. Derived tints use `color-mix()` on tokens.

### Container and breakpoints (mobile first)
| viewport | `--gutter` | content width |
|---|---|---|
| below 720px | 16px | viewport minus 32px (358px at 390) |
| 720px and up | 32px | fluid |
| 1024px and up | 64px | fluid |
| 1280px and up | 120px | 1040px at 1280, 1200px at 1440 |

- `.container` is `width:100%; max-width:calc(var(--container) + 2*var(--gutter)); margin-inline:auto; padding-inline:var(--gutter)`. At 1440 that gives 120px margins and a 1200px column.
- Only three media queries: `min-width` 720px, 1024px, 1280px. A section builder who wants another breakpoint tells tooling first.

### Type scale (matches the Figma heights; builders may tune by eye against the PNGs)
| role | desktop | mobile | notes |
|---|---|---|---|
| H1 | 80px / 1.08 | 40px | Inter Tight 600, letter-spacing -0.02em |
| section h2 | 52px / 1.1 | 32px | |
| solo line / proof line | 64px / 46px | 36px / 28px | |
| h3 | 28px | 22px | |
| body | 18px / 1.55 | 17px | |
| small | 15px | | |
| kicker | 14px | | 600, uppercase via CSS, letter-spacing .16em, `--copper-text` (`--copper-on-ink` in the footer) |

- Copper text below 24px is always weight 600.
- Process numerals 88px, mobile 56px. Price "$1,000" about 88px copper, mobile 64px.

### Font contract
- Only these faces exist: Inter Tight 400, 500, 600 (normal) and Newsreader italic 400. Type rules may use only those weights. Nothing asks for bold or for normal-style Newsreader, so no face is synthesised.
- Files: `src/assets/fonts/inter-tight-400.woff2`, `inter-tight-500.woff2`, `inter-tight-600.woff2`, `newsreader-italic-400.woff2`, plus `LICENSE.txt` (SIL OFL 1.1).
- `src/css/fonts.css` is generated once by `scripts/fetch-fonts.mjs` and committed. Four `@font-face` rules, `font-display: swap`, latin `unicode-range`, URLs `/assets/fonts/<name>`. base.css has no `@font-face`.
- `head.html` preloads exactly two files: Inter Tight 600 and 400 (`as=font`, `type=font/woff2`, `crossorigin`). No `fonts.googleapis.com` or `fonts.gstatic.com` anywhere, no preconnect.
- Offline rule: `build.mjs`, the check scripts, lint and tests make no network access. They only read `src/` and write `dist/`.

### Shared classes in base.css (section builders may use these)
- Layout: `.container`, `.section` (padding-block 110px, mobile 64px), `.section--flush-top`, `.stack` (vertical flow, spacing via the `--space` custom property), `.visually-hidden`.
- Type: `.h1`, `.h2`, `.h3`, `.lead` (19px sub copy), `.body`, `.small`, `.kicker`, `.em` (Newsreader italic 400, for emphasis words and pull-quotes, on `<em>` or a span), `.serif`.
- Rules and ledger: `.rule` (1px hairline hr); `.ledger` (list wrapper with a top hairline); `.ledger__row` (bottom hairline, grid with a 300px label column then 1fr at 720px and up, stacked below); `.ledger__label`, `.ledger__text`; `.ledger__price` (right-aligned price cell); `.leader` (flex-grow 1px low-opacity line between a label and a price, hidden on mobile).
- Components: `.btn`, `.btn--primary` (`--copper-text` fill with a paper label; in the footer `--copper-on-ink` fill with an ink label; 4px radius, 18px 600 text, min-height 56px), `.btn--lg` (300px wide at 720px and up, full width on mobile), `.check-list` (checkmark rows at 36px pitch, copper `::before` check), `.numeral` (88px copper, tabular-nums), `.tel` (standalone phone number text).
- Section-only classes are prefixed with the section name (`.hero__arch`, `.price-card__total`, `.footer__cta`), so nothing collides across the three css files.

### Assembly contract
- `npm run build` runs `node scripts/build.mjs`, which deletes `dist/` and writes `dist/index.html` and `dist/assets/site.css`, and copies `src/assets/**` to `dist/assets/**` (fonts land in `dist/assets/fonts/`).
- Document order: `src/layout/head.html`, `01-nav.html`, then `<main id="main">` added by the build script, then `02` to `11` in filename order, then `</main>`, then `12-footer.html`, then `src/layout/tail.html`.
- CSS order: `fonts.css`, `base.css`, `top.css`, `bottom.css`, concatenated into `dist/assets/site.css` and linked as `/assets/site.css`.
- `head.html`: doctype, `lang="en"`, charset, viewport, title, meta description, theme-color `#F5F0E6`, inline SVG data-URI favicon, two font preloads, stylesheet link, `<body>`, skip link to `#main`. `tail.html`: `</body></html>`.
- Partials are one root element each, hand-written, no template syntax, no html/head/body/main tags.
- `vercel.json` is exactly `{"framework": null, "buildCommand": "npm run build", "outputDirectory": "dist"}`. No `name`.

### Section roots and ids
| file | root | id |
|---|---|---|
| 01-nav | `header.nav` | none |
| 02-hero | `section.hero` | `top` |
| 03-solo | `section.solo` | none |
| 04-proof | `section.proof` | none |
| 05-work | `section.work` | `work` |
| 06-services | `section.services` | `services` |
| 07-who | `section.who` | `who` |
| 08-process | `section.process` | `process` |
| 09-faq | `section.faq` | `faq` |
| 10-testimonials | `section.testimonials` | `testimonials` |
| 11-about | `section.about` | `about` |
| 12-footer | `footer.footer` | `contact` |

- Nav links in order: `#work`, `#services`, `#process`, `#faq`, `#about`. The wordmark links to `#top`.
- All phone links are `href="tel:+14807574367"`. No `sms:` links.
- One h1 (hero). Each section h2 is tied to its section by `aria-labelledby`.

### Slot naming
Slots use `class="slot"` and `data-slot="..."`. The word "placeholder" must not appear in any class, id, attribute, comment or css, because the placeholder check scans `dist/index.html` and the src css. The only exception is the mockup's own kicker text "Placeholder slot".

### Copy source rule
Brief strings are verbatim. Where the brief is silent, use the mockup text exactly from `docs/reference/figma-v2-structure.xml` (headings, sub lines, FAQ answers, process descriptions, proof pair, attribution). Builders write no new marketing copy. Designer notes in the mockup (for example "Warm sepia portrait. Swap in the real photo.") are not rendered. Verbatim strings keep their em dashes; builders add no new em dash.

## Tasks

Format: number. subject | owner | depends on. Phase tags: `build:` and `ship:` are gated (build, test, lint); `review:` is not.

1. build: repo cleanup and project scaffold | builder-tooling | none
   - `git rm -r` `frontend/`, `site/`, `node_modules/`, `.next/`, `.claude/launch.json` (and the root lockfile).
   - Replace root `package.json` with `{name:"built-by-seven-site", private:true, type:"module", engines:{node:">=22"}}`, scripts `build` (`node scripts/build.mjs`), `test` (`node scripts/build.mjs && node --test test/`), `lint` (`node scripts/lint.mjs`). No dependencies.
   - Add `vercel.json` per the contract. Write `.gitignore`: `node_modules/`, `dist/`, `.next/`, `.vercel/`, `.env*`, `*.log`.
   - Write `scripts/build.mjs` per the assembly contract. It fails with a clear message if a section file is missing, empty, or its root id does not match the table. It copies `src/assets/**` recursively and tolerates a missing `fonts.css` until task 3 lands.
   - Write `src/layout/head.html` and `tail.html`, and an initial `src/css/base.css` with tokens and a reset.
   - Create stub partials 01 to 12 (right root and id, one line of text, a `data-stub` attribute) and empty `top.css` and `bottom.css`, so the gate passes from this task on. Section builders own their files from the first edit.
   - Add `test/build.test.mjs`: `dist/index.html` exists and has all twelve roots. Add a minimal `scripts/lint.mjs` that exits 0. Add a short `README.md` (what the site is, the npm scripts, src layout, dist is generated).
   - Verify build, test and lint exit 0.

2. build: base.css shared components and type scale | builder-tooling | 1
   - Full `src/css/base.css` per the contract: tokens, reset, `scroll-behavior:smooth`, `scroll-margin-top` on `[id]`, copper `focus-visible` outlines offset 3px, `prefers-reduced-motion` handling, body 18px/1.55 on paper, every class in the shared list, the three media queries.
   - Font-family stacks with system fallbacks only. No `@font-face` here. Weights limited to 400, 500, 600.
   - A header comment lists each class and its purpose, because section builders read it.
   - All copper text is weight 600 and at least 14px.
   - Add `test/base-css.test.mjs` asserting every contract class exists in the built `site.css`. Run the three scripts.

3. build: vendored fonts and fonts.css | builder-tooling | 1
   - Write `scripts/fetch-fonts.mjs`. One-time, never called by build, test or lint. It requests the Google Fonts CSS API with a modern browser user agent for Inter Tight 400, 500, 600 and Newsreader italic 400, picks the latin block of each, downloads the woff2 files to `src/assets/fonts/` under the contract names, writes `LICENSE.txt` (SIL OFL 1.1 and source), and writes `src/css/fonts.css` with four `@font-face` rules (`font-display: swap`, latin `unicode-range`, `/assets/fonts/<name>` URLs).
   - Run it once with network, then commit the woff2 files and `fonts.css`. If there is no network, stop and report to the lead. There is no Google link fallback.
   - Update `build.mjs` to put `fonts.css` first in the concatenation. Update `head.html` with the two preloads (Inter Tight 600 and 400).
   - Add `test/fonts.test.mjs`: four woff2 files exist, each starts with the `wOF2` magic bytes and is under 60KB; `fonts.css` has exactly four `@font-face` rules, all `font-display: swap`; each URL resolves to a file in `dist/assets/fonts/`; `dist/index.html` has no `googleapis` or `gstatic` string.
   - Add `test/offline.test.mjs`: fails if any file in `scripts/` other than `fetch-fonts.mjs`, or in `test/`, imports `node:http`, `node:https`, `node:net` or `node:dns`, or calls `fetch(`.
   - Run the three scripts under `unshare --net`.

4. build: machine checks, tests and lint | builder-tooling | 2
   - (a) `scripts/lib/parse-html.mjs`: tokenizer tracking open tags against the void-element list, handling comments, script, style and quoted attributes; reports unclosed or mismatched tags with line numbers.
   - (b) Anchors: every `href="#x"` resolves to exactly one `id="x"`; ids are unique; nav has exactly the five links in order.
   - (c) Placeholders: strip the allowlist (the four marked slot strings exactly as in the brief, the "Photo: DeJuan inside a real client shop" label, the "Placeholder slot" kicker, case-insensitive), then fail on lorem, TODO, TBD, FIXME or placeholder in `dist/index.html` and src css.
   - (d) Required copy: `scripts/required-copy.json` holds every verbatim brief string (hero kicker, H1 text with the em removed, sub, CTA, solo lines, proof lines, slot strings, $1,000, terms, add-ons, $75/month, risk reversal, ownership line, ledger rows, process steps, comparison rows, quote slot, About details, footer lines). Asserts each appears in visible text, whitespace normalised, tags removed. Skipped while the matching section still has `data-stub`.
   - (e) Banned content: no github (text or href), no stack words in visible text (react, next.js, node, javascript, tailwind, vercel), no script tags, no `fonts.googleapis.com` or `fonts.gstatic.com`, no invented-stat patterns (digits with % or "+ clients"), no quote marks outside `.testimonials`.
   - (f) Style lint: no raw colours outside base.css and fonts.css; every img has alt, width, height; exactly one h1; no skipped heading levels; lang set; every `tel:` link is `+14807574367`. No em-dash rule.
   - Fixture tests with deliberately bad inline HTML prove each check fails when it should. `lint` runs b, c, e, f. `test` runs a, d, fixtures and smoke tests.

5. build: static performance budget check | builder-tooling | 2, 3, 4
   - `scripts/check-budget.mjs`, wired into lint. Its header states it approximates Lighthouse and is not a score.
   - Limits: `index.html` gzip at most 30KB; `site.css` gzip at most 25KB; four woff2 files each under 60KB and 200KB together; total dist weight 350KB at most; zero script tags; zero external origins in src, href (except `tel:` and `#`) or `url()`; the stylesheet link is the only render-blocking resource and sits in head; every `@font-face` has `font-display` swap or optional; exactly two preload links, both `as=font` with `crossorigin`, targets exist in dist; no `@import`; viewport meta present; any img has width, height, `loading=lazy` and is at most 100KB; no inline style over 200 characters.
   - Prints a metric-versus-limit table and exits non-zero on any breach. Fixture test for one pass and one fail.

6. build: nav and hero | builder-top | 1, 2
   - Replace stubs `01-nav.html` and `02-hero.html` and write their parts of `top.css`.
   - Nav: 94px tall at 1440 with a bottom hairline. Wordmark "Built by Seven" 24px 600 at left. Five links at right of centre, 16px, 34px gaps. Copper "Text or call" button (124x42, `tel:` link) far right. Not sticky.
   - Below 720px: first row is wordmark plus button; second row is the links as one line that scrolls horizontally if it overflows. No JS. Link tap targets at least 44px tall.
   - Hero: kicker "A one-man web studio in Tempe, Arizona". H1 full width, two lines at 1440, with `<em class="em">customers</em>`.
   - Hero row at 1024px and up: grid with columns 600px and 460px, column gap 90px. Portrait aligned to the top of the row and taller than the copy (684px vs about 325px), which makes the lower-right offset.
   - Copy column: the sub paragraph at 19px; a `.btn--primary .btn--lg` "Text or call (480) 757-4367"; the standalone `.tel` number at 28px beneath; the small line "One project at a time — now booking November builds." (from the mockup).
   - Portrait: `div.hero__arch role="img" aria-label="Photo: DeJuan inside a real client shop"`, border-radius 230px 230px 0 0, warm sepia gradient built from tokens with `color-mix` (no raw colours), the label text centred inside, `data-slot="hero-photo"`. Below 1024px the columns stack and the arch is at most 340px wide and 480px tall, right-aligned with `margin-left:auto`.
   - Pick the button label colour by checking `docs/reference/figma-v2-hero.png`. Compare the layout to that PNG.

7. build: solo strip and proof | builder-top | 2
   - Write `03-solo.html` and `04-proof.html` and their css in `top.css`.
   - Solo: three `p.solo__line`, no box and no rules, 64px/1.1 weight 600, 20px between lines, about 150px padding above and below at desktop; 36px type and 64px padding on mobile. Lines: "You talk to me." / "I build it." / "I answer when you text."
   - Proof: the 46px line "The Cut Barbershop · `<em class="em">Tempe, AZ</em>`" (28px on mobile); "First client build, live now." at 19px beneath; a hairline; then the mockup's two-column proof pair: "One-man studio" / "You talk to me. I build it." and "Prices on the page" / "No quote-call runaround." (one column on mobile). The pair states the studio model, not a stat.

8. build: selected work | builder-top | 2
   - Write `05-work.html` (id `work`) and its css.
   - Kicker "Selected work"; h2 "Real shops, real outcomes."; sub "Early days, honest labels. One client live, more on the way."
   - Three ledger rows separated by hairlines. Row 1: kicker "Barbershop · Client work", h3 "The Cut · Tempe, AZ", "New site. An online presence that matches the chair experience.", "Full case study after launch", then the three slots exactly as in the brief: "[Live site link]", "[Shop photo — with Terrence's permission]", "[One honest outcome — e.g. takes bookings after hours]". Each slot is a span (not a link) styled as a dashed low-opacity outline box with class `slot` and `data-slot` `live-link`, `shop-photo`, `outcome`.
   - Rows 2 and 3: kicker "Placeholder slot" (the mockup's own text), h3 "Your shop here", then "Reserved for the next local business. Restaurants, retail, and services welcome." and "A second slot, kept open on purpose. No fake clients, ever." respectively, then "This could be your shop."
   - Content max width 677px with the right side left blank, so rows read as ledger entries, not cards.

9. build: responsive pass for top sections | builder-top | 6, 7, 8
   - Review `top.css` and partials 01 to 05 at 390, 430, 720, 1024, 1280 and 1440 by reading css against the contract (no browser on the bench) and by grepping for fixed widths. Verify: nothing wider than 358px on mobile; no horizontal overflow and no `overflow-x` used to hide one; `.btn--lg` full width on mobile; the nav link row scrolls without breaking the page; H1 at 40px wraps without clipping; the arch fits; touch targets at least 44px; body 17px. Fix what is found.
   - Add `test/top-responsive.test.mjs`: parse `site.css` and fail if a top.css declaration has `width` or `min-width` over 358px outside a `min-width` media query.

10. build: services and price card | builder-bottom | 1, 2
    - Write `06-services.html` (id `services`) and its css.
    - Kicker "Services and prices"; h2 "What it costs, before you call."
    - Price card: background `var(--sand)`, border 2px solid `var(--ink)`, radius 2px, padding 66px 74px (mobile 32px 20px), classes `.price-card__*`.
    - Top row: h3 "The Website" at left, "$1,000" (88px copper, mobile 64px) at right; stacks on mobile.
    - Then: "A custom website for your shop. Half up front, half at launch. You own it outright."; a hairline; the `.check-list` with five rows: Custom design, built for your business, no templates / Written to bring customers through the door / Live in weeks, not months / You own it outright, no strings attached / Google Business Profile setup included.
    - Then: "You own the domain, the site, everything — in your name from day one."; the 300x69 primary button "Text or call (480) 757-4367"; a hairline; "If you don't like the first draft, I'll refund your deposit. No hard feelings."
    - Below the card: three add-on `.ledger__row` with `.leader` and `.ledger__price`: "Online ordering or reservations" / "+$400", "Extra pages" / "+$150 each", "Copywriting" / "+$250". Let the long label wrap on mobile; leader hidden there.
    - Care plan strip: "Care plan · $75/month" at 24px 600, and "Updates, small changes, and someone to call when you need it."

11. build: who it's for and process | builder-bottom | 2
    - Write `07-who.html` and `08-process.html`.
    - Who: kicker "Who it's for"; two `.ledger__row` entries with a 300px label column. "Restaurants" / "Menu, hours, online ordering, tap-to-call." and "Barbershops" / "Services and prices, booking link, Instagram feed." Instagram is brief copy, allowed in the banned-content check.
    - Process (id `process`): kicker "How it works"; h2 "Four steps. Plain language."; an `ol.process__steps` whose li rows are hairline-separated, each with the oversized `.numeral` (88px copper, mobile 56px) in a 162px left column, then an h3 and a body line.
    - Steps: 1 "We talk." / "You tell me about your business. I ask how customers find you now."; 2 "I build." / "You see it taking shape as I go. Nothing hidden, no surprises." plus a second line "First draft in about a week."; 3 "You approve." / "We go through it together. Changes are welcome."; 4 "We launch." / "Your site goes live and starts working for you."
    - Numerals must be visible text, so the copy check sees them.

12. build: FAQ and comparison | builder-bottom | 2
    - Write `09-faq.html` (id `faq`).
    - Kicker "Questions"; h2 "Asked and answered."
    - Four Q and A ledger rows (h3 question, body answer), always open, no JS and no details element: "How much does it cost?" / "$1,000 for the website, with the add-ons listed above. The price is the price."; "How long does it take?" / "Weeks, not months. Most sites go live within a few weeks of our first call."; "Do I own my site?" / "Yes, outright. It is yours from the day it launches."; "What if I need changes later?" / "The $75/month care plan covers updates and small changes, or we do one-off work as needed."
    - Then h3 "Why not just do it myself?" and a three-row `.ledger`: Me / "$1,000 once, built for you, you own it."; A DIY builder / "$20–50 a month forever, template look, you're on your own."; An agency / "$5,000 and up, account managers, months of timeline." The Me row may be lightly emphasised (weight 600 label or a copper left rule).

13. build: testimonials and about | builder-bottom | 2
    - Write `10-testimonials.html` and `11-about.html`.
    - Testimonials: kicker "What owners say"; h2 "From the chair."; a pull-quote card with a decorative copper quote mark (100px Newsreader, aria-hidden), then a `blockquote.em` at 36px containing exactly "[Terrence's quote goes here — coming from the Oct 9 visit]" with `data-slot="quote"` (brief text, not the mockup's comma variant); the attribution "Terrence · Owner, The Cut Barbershop, Tempe"; and the small line "Real quotes only. Nothing is written until the owner says it."
    - About (id `about`): h2 "I'm DeJuan." at 52px; two paragraphs, max 920px wide, verbatim from the mockup: "I'm DeJuan Spencer. I live in Tempe, Arizona. I'm an Army veteran, and my roots are in Cleveland, Ohio." and "I build websites for local businesses because I know what a good shop looks like from the inside, and I know what it is like to need every dollar to work. When you hire Built by Seven, you get me. The person you talked to is the person who builds your site." No photo, no credentials list.

14. build: footer | builder-bottom | 2
    - Write `12-footer.html` (footer id `contact`) and its css. The one ink section: background `var(--ink)`, color `var(--paper)`, padding 110px (mobile 64px), centred.
    - Order: kicker "Ready when you are" in copper; h2 "Let's talk about your shop." 64px (mobile 36px); "One project at a time — now booking November builds."; the big primary button "Text or call (480) 757-4367" (`tel:`), at least 300x61, full width on mobile; "No sales pitch, no obligation — just a straightforward conversation."; a small credit line "Built by Seven · Tempe, Arizona" at 14px, reduced opacity via a token-derived `color-mix`.
    - Footer-scoped focus outline in paper so focus is visible on ink.

15. build: responsive pass for bottom sections | builder-bottom | 10, 11, 12, 13, 14
    - Same method as task 9, applied to `bottom.css` and partials 06 to 12. Check: price card padding and "$1,000" scale at 358px (use clamp; top row stacks); add-on rows do not overflow with the long label; process numerals do not squeeze the text column below 200px; comparison rows stack; footer button full width; no horizontal overflow.
    - Add `test/bottom-responsive.test.mjs` with the same fixed-width rule as task 9.

16. review: copy, placeholders and banned content audit | qa | 4, 5, 9, 15
    - Run `npm run build`, `npm test` and `npm run lint`; all must exit 0 with no skipped tests. Then read `dist/index.html` end to end against the brief's section spec (and the mockup xml for unspecified text). Report as a pass or fail table: every verbatim string present and spelt exactly; hairline ledger structure (card shapes only for the price card and the testimonial card); exactly one ink-background section; only the four marked slots, the "Placeholder slot" kicker and the hero photo label are placeholders; no invented testimonials, stats, client names or portfolio pieces; no tech words and no GitHub; sentence case in source; no script tag; Instagram is the only platform name; no Google font origins. Findings go to the owner of each file.

17. review: layout fidelity to Figma and static render sanity | designer | 9, 15
    - No browser, so review statically. At 1440: read each section's css against `docs/reference/figma-v2-structure.xml` and the three PNGs: 120px container margin, row pitches and hairline positions, hero arch size and offset, solo strip scale, 88px numerals, 2px ink card border, `--sand` used in exactly one rule, `--ink` used as a background in exactly one rule. At 390: stacking, tap sizes, no overflow, type sizes as in the contract. Check copper contrast on paper (about 3.6:1, passes AA only for large text): small copper text must be 600, uppercase, at least 14px, and no body text is copper. Report discrepancies with file and line to the owner. Do not edit files.

18. ship: usage check, cap check and deploy | devops | 16, 17
    - Run the pipeline command from the bench root per the forge runbook (`node scripts/forge-deploy.js --hosting vercel --dir dejuanspencer-github-io`), never the Vercel CLI by hand, never production, moving no domain. If it deploys: confirm the URL is public (plain `curl -I` without cookies returns 200, no login redirect); the served `index.html` matches `dist/index.html`; css and the four fonts return 200; the deployment is a preview. Report the URL, and say that 1440px and 390px rendering could not be checked in a browser on the bench. The lead opens the PR.

## Order of work
Task 1 gates everything. Tasks 2 to 5 (tooling) run while the section builders start on 6 to 8 and 10 to 14, which need only the classes of task 2. Then 9 and 15, then 16 and 17 together, then 18.
