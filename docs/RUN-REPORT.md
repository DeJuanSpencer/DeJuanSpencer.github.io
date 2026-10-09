# Run report: Built by Seven site rebrand (Quiet Operator)

**Needs input (updated 2026-10-09T13:46Z).** Seven created the Vercel project `dejuanspencer-github-io` and the deploy step was rerun. The site is live at https://dejuanspencer-github-n0801pevl-dejuans-projects-61c7a3da.vercel.app (public, HTTP 200, no login wall, served page identical to `dist/index.html`). The pipeline asked for a preview, but Vercel gave this first deployment of the new project the production target (exit 30, reason target-mismatch). That project has no custom domain, so dejuanspencer.com is untouched; "production" here means only the new project's own vercel.app URLs. PR #2 is held open for Seven (label seven-review and his comment), not merged. A copper contrast follow-up is in progress and the deploy step will be rerun once more after it.

Earlier in the run the first deploy attempt was blocked with exit 10 (first-deploy: no project of that name existed); that verdict is kept in the Deploy gate block below as attempt 1.

- Brief: https://app.notion.com/p/3f478f7199f2819eb310d5c124a444e4
- Branch: `forge/built-by-seven-site-rebrand-quiet-operator` on DeJuanSpencer/DeJuanSpencer.github.io
- Started: 2026-10-09T12:23:52Z. Deploy attempt 1: 2026-10-09T12:53:28Z (blocked). Deploy attempt 2: 2026-10-09T13:45:52Z (deployed, target mismatch).
- Hosted URL: https://dejuanspencer-github-n0801pevl-dejuans-projects-61c7a3da.vercel.app
- Cap check: 14 of unlimited projects on the pro plan, scope dejuans-projects-61c7a3da, cap from config:cap-limits.json#pro, project dejuanspencer-github-io, existing, decision proceed
- Usage check: bandwidth 0.0271 of 1000 gigabyte (0 percent), build minutes 4.305 of 20 USD (21.52 percent), serverless execution 0.0009 of 20 USD (0 percent), included usage credit 4.3102 of 20 USD (21.55 percent), block point 80 percent, scope dejuans-projects-61c7a3da, decision proceed

## Three things for Seven to decide

1. **Which Vercel project the preview belongs to.** The folder is `dejuanspencer-github-io`, so the pipeline looks for a Vercel project of that name and finds none. The existing project `dejuan-spencer-github-io` (prj_4xOu3T6QvuYFDBVggxfZG2sBGJfq) is the one that holds dejuanspencer.com, is Git-linked to this repo with `main` as its production branch, and has SSO deployment protection on every preview, so a preview there would sit behind a Vercel login and fail the brief's "public, no login wall" check. The cleanest route to a public preview: create a new Vercel project named `dejuanspencer-github-io` in the dashboard (no Git link, deployment protection off), then rerun `node scripts/forge-deploy.js --hosting "vercel" --dir dejuanspencer-github-io` from the bench root.
2. **Whether to merge.** Because `main` is the production branch of the Git-linked project, merging this PR would deploy the new site to dejuanspencer.com through Vercel's Git integration. The brief says this run does not touch production, so the team did not merge, whatever the review verdict. Before any merge: change that project's production branch or unlink Git, or decide that the merge is the production launch.
3. **Copper contrast exceptions kept on purpose.** Three places use the exact copper #B26E3B for text under 24px and miss WCAG AA: the primary button (paper text on copper, about 3.6:1), the footer kicker (copper on ink, about 4.4:1), and every small copper text on paper, that is the section kickers and the hero availability line (14px, weight 600, about 3.6:1). All match the brief's palette and the mockup. Keep them, or allow a darker copper for small text.

## What shipped against the done contract

| Done contract item | Result |
|---|---|
| Full page per the section spec, faithful to the Figma mockup's layout, palette, type and voice | Built. Twelve sections in the brief's order from the "Homepage v2 — Editorial" frame, static HTML/CSS, no JavaScript, vendored Inter Tight and Newsreader. Layout fidelity reviewed statically by the designer against the frame's node positions (two loops, SHIP IT). Not rendered in a browser on the bench. |
| Copy verbatim where specified; placeholders clearly marked; nothing invented | Done. 41 brief strings and about 150 strings in total asserted by tests; the four bracketed slots, the "Placeholder slot" kickers and the hero photo label are the only placeholders. |
| `npm run build` passes with zero errors; all machine checks pass | Done. build, test and lint exit 0; 114 tests, 0 skipped. |
| A public Vercel preview URL, rendering at 1440px and 390px | Not met. Deploy blocked (exit 10, first-deploy). Responsive behaviour checked by reading the CSS, not in a browser. |
| A PR from the run branch into main with the run summary, check results, preview link and issues | Open. No preview link (not deployed); no issues were filed. |

### Machine checks

| Check | How | Result |
|---|---|---|
| `npm run build` exits 0 | `scripts/build.mjs`, assembles `dist/` from `src/` offline | pass |
| HTML validates, no unclosed tags | `scripts/lib/parse-html.mjs` tag-balance parser, in lint and test | pass |
| Every nav anchor resolves | anchors check in lint; nav has exactly `#work #services #process #faq #about` | pass |
| No placeholder text outside the marked slots | placeholders check in lint with the brief's allowlist | pass |
| Vercel preview returns 200 without a login wall | not run: nothing deployed | not run |
| Lighthouse performance 90+ | approximated by `scripts/check-budget.mjs` (no Chrome on the bench): index.html 3.7 KB gzip, site.css 5.4 KB gzip, four woff2 89.5 KB, total dist 124.9 KB, zero scripts, zero external origins, two font preloads, font-display swap | pass (approximation, not a Lighthouse score) |

### Reviews

- qa: two loops; acceptance test added (`test/acceptance.test.mjs`); two nav fixes (focus ring inside the scrolling link row, one-row nav only from 1024px); VERDICT: SHIP IT.
- pre-commit-reviewer: two loops; five fixes to the scripts and `.gitignore`; VERDICT: COMMIT. Contrast exception deferred to Seven.
- designer: two loops; 12 fixes applied (italic emphasis word in every h2 as the mockup shows, FAQ rows one column, process hairlines full width and 221px pitch, "Me" row ink with a copper rule, kicker-to-heading gaps, skip link off the ink background, hairline rules) plus considers; VERDICT: SHIP IT.

## Repo changes

31 commits on the run branch; 584 files changed, 3,737 insertions, 264,163 deletions. The old Next.js apps (`frontend/`, `site/`), 449 tracked `node_modules` files, `.next/trace`, the root Stripe and Resend dependencies and `.claude/launch.json` are removed. The new site: `src/layout`, `src/sections/01-12`, `src/css/{fonts,base,top,bottom}.css`, `src/assets/fonts` (four latin woff2, SIL OFL), `scripts/` (build, lint, checks, budget, one-time `fetch-fonts.mjs`), `test/` (12 files, node:test, zero dependencies), `package.json` (no dependencies), `vercel.json` (framework null, build to `dist`), `README.md`, `docs/`. GitHub reports 80 dependabot vulnerabilities on `main`; all come from the removed lockfiles, so this branch clears them.

## Decisions

52 lines in `docs/DECISIONS.md`, 3 marked ASSUMED for Seven to confirm:
- The page title "Built by Seven | Websites for local businesses in Tempe, Arizona" and the meta description (the hero sub paragraph); the brief gives neither.
- The existing Vercel project's SSO preview protection is left as it is, because changing it is a production-project setting.
- Lighthouse is approximated by the static budget script (no Chrome on the bench).

Other decisions worth a glance: repo cleanup is in scope; no JavaScript at all; fonts vendored so the build runs offline; verbatim copy keeps its em dashes and the builders added none; kickers are sentence case in source and uppercased by CSS; the "$1,000" figure is ink as in the services mockup; the Includes list uses the mockup's five rows; "Text or call" is a `tel:` link everywhere.

## Gate failures

31 task-gate runs for this project: 30 pass, 1 fail. The one failure (12:48 UTC, builder-tooling's base.css fix task) was caused by qa's first, uncommitted version of `test/acceptance.test.mjs`, which turned every HTML tag into a space and so failed on `<em>` inside headings; qa fixed the extractor and the gate passed on rerun. No gate was overridden.

## Open items

- Deploy blocked (above). Verdict warnings: none.
- Not verified in a browser: 1440px and 390px rendering, the hero arch and sepia label contrast, the solo strip rhythm. A real-device check is Seven's.
- Bracketed placeholder text is visible on the page by the brief's instruction; fill the slots before any production deploy.
- Pre-existing and untouched: `.claude/settings.local.json` with Windows paths, `.claude/skills/agent-team-setup/` and `CLAUDE-AGENT-TEAMS.md` are still tracked in the repo (stale copies; a separate decision).
- The process is lead-run gates: this build has no task-list tools, so the lead ran `task-gate.js` by hand on every completion.

## Previews Vercel built on its own

The pipeline deployed nothing, but the Git integration on the production project `dejuan-spencer-github-io` builds every push to this repo, so each push of the run branch produced a preview deployment there (six in the last minutes of the run, all READY, target preview, none production). The branch preview is https://dejuan-spencer-github-io-git-f-9c8602-dejuans-projects-61c7a3da.vercel.app and answers a cookie-less request with a 302 to Vercel SSO, so it is behind a login wall (Seven can open it signed in; it does not meet the brief's public-preview check). dejuanspencer.com is unchanged. Two consequences for Seven: every future push to any branch of this repo costs a build on that project, and a merge to `main` is a production deploy.

## Deploy gate

- Hosting line, verbatim: `Hosting: vercel`
- Attempt 1 (2026-10-09T12:53Z, blocked):
- Cap check: 13 of unlimited projects on the pro plan, scope dejuans-projects-61c7a3da, cap from config:cap-limits.json#pro, project dejuanspencer-github-io, new, decision proceed
- Usage check: bandwidth 0.0267 of 1000 gigabyte (0 percent), build minutes 2.31 of 20 USD (11.55 percent), serverless execution 0.0009 of 20 USD (0 percent), included usage credit 2.3151 of 20 USD (11.57 percent), block point 80 percent, scope dejuans-projects-61c7a3da, decision proceed
- Deploy: blocked, target preview, URL none. Exit code 10, reason first-deploy, status needs_input.
- Usage-check line from `.claude/forge.log`:
  `2026-10-09T12:53:11.717Z usage-check pass scope=dejuans-projects-61c7a3da plan=pro threshold=80 bandwidth=0.0267/1000/0/gigabyte build-minutes=2.31/20/11.55/USD serverless=0.0009/20/0/USD credit=2.3151/20/11.57/USD mode=live :: ok-under-threshold`
- Cap-check line and deploy line from `.claude/forge.log`:
  `2026-10-09T12:53:24.563Z cap-check pass scope=dejuans-projects-61c7a3da plan=pro count=13 cap=unlimited source=config:cap-limits.json#pro project=dejuanspencer-github-io exists=false target=preview projected=14 mode=live :: ok-unlimited`
  `2026-10-09T12:53:28.249Z deploy block project=dejuanspencer-github-io target=preview hosting="vercel" :: first-deploy`
- Verdict JSON (abridged): `{"schema":"forge.deploy/1","mode":"live","action":"blocked","reason":"first-deploy","status":"needs_input","hosting":"vercel","target":"preview","project":"dejuanspencer-github-io","url":null,"check":{"decision":"proceed","reason":"ok-unlimited","count":13,"cap":"unlimited","projectExists":false,"projectedCount":14},"usage":{"decision":"proceed","reason":"ok-under-threshold"},"rerun":"node scripts/forge-deploy.js --hosting \"vercel\" --dir dejuanspencer-github-io","finishedAt":"2026-10-09T12:53:28.249Z"}`
- Attempt 2 (2026-10-09T13:45Z, after Seven created the project):
  - Cap check: 14 of unlimited projects on the pro plan, scope dejuans-projects-61c7a3da, cap from config:cap-limits.json#pro, project dejuanspencer-github-io, existing (prj_lmTd9xFQahkb1V6ZSNpVqLsFeXxc), decision proceed
  - Usage check: bandwidth 0.0271 of 1000 gigabyte (0 percent), build minutes 4.305 of 20 USD (21.52 percent), serverless execution 0.0009 of 20 USD (0 percent), included usage credit 4.3102 of 20 USD (21.55 percent), block point 80 percent, scope dejuans-projects-61c7a3da, decision proceed
  - Deploy: deployed, target asked preview, observed production, URL https://dejuanspencer-github-n0801pevl-dejuans-projects-61c7a3da.vercel.app. Exit code 30, reason target-mismatch, status needs_input. Warnings: target-mismatch. Public check: HTTP 200, no redirect; `/assets/site.css` 200; `/assets/fonts/inter-tight-600.woff2` 200; served index.html identical to dist.
  - Usage-check line: `2026-10-09T13:45:28.255Z usage-check pass scope=dejuans-projects-61c7a3da plan=pro threshold=80 bandwidth=0.0271/1000/0/gigabyte build-minutes=4.305/20/21.52/USD serverless=0.0009/20/0/USD credit=4.3102/20/21.55/USD mode=live :: ok-under-threshold`
  - Cap-check line: `2026-10-09T13:45:38.280Z cap-check pass scope=dejuans-projects-61c7a3da plan=pro count=14 cap=unlimited source=config:cap-limits.json#pro project=dejuanspencer-github-io exists=true target=preview projected=14 mode=live :: ok-unlimited`
  - Deploy line: `2026-10-09T13:45:52.319Z deploy FAIL project=dejuanspencer-github-io target=preview hosting="vercel" url=https://dejuanspencer-github-n0801pevl-dejuans-projects-61c7a3da.vercel.app ms=10186 :: target-mismatch observed production asked preview`
  - Verdict JSON (abridged): `{"schema":"forge.deploy/1","mode":"live","action":"deployed","reason":"target-mismatch","status":"needs_input","hosting":"vercel","target":"preview","project":"dejuanspencer-github-io","url":"https://dejuanspencer-github-n0801pevl-dejuans-projects-61c7a3da.vercel.app","deploymentId":"dpl_E5VMfgSiZKMhjyiqWZRYgGHXwyQ8","observedTarget":"production","warnings":["target-mismatch"],"check":{"decision":"proceed","count":14,"cap":"unlimited","projectExists":true},"usage":{"decision":"proceed","reason":"ok-under-threshold"},"finishedAt":"2026-10-09T13:45:52.319Z"}`
  - Why the mismatch: Vercel makes the first deployment of any project production, even one created in the dashboard with no deployments; the pipeline's preview argv carries no target flag and relies on the default, which is production until a project has one deployment. The next deploy should be a preview.
- Rerun, once the project exists: `node scripts/forge-deploy.js --hosting "vercel" --dir dejuanspencer-github-io`

## Team

Lead (bench), architect (plan and PR review), builder-tooling, builder-top, builder-bottom, qa, pre-commit-reviewer, designer, devops. Figma frame read from the bench and saved under `docs/reference/`.
