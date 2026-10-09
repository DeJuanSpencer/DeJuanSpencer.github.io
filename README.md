# Built by Seven site

The one-page site for Built by Seven, a one-man web studio in Tempe, Arizona. Static HTML and CSS. No JavaScript, no framework, no dependencies. Node 22.

## Scripts

- `npm run build` assembles `dist/` from `src/`.
- `npm test` builds, then runs the tests in `test/`.
- `npm run lint` runs the machine checks.

## Layout

- `src/layout/` holds `head.html` and `tail.html`.
- `src/sections/` holds one partial per page section, numbered `01` to `12` in page order.
- `src/css/` holds `fonts.css`, `base.css`, `top.css` and `bottom.css`, joined in that order into `dist/assets/site.css`.
- `src/assets/` is copied to `dist/assets/` as is.
- `scripts/` holds the build and check scripts. None of them use the network.
- `docs/` holds the plan, the decisions log and the design reference.

`dist/` is generated and ignored by git. Vercel runs `npm run build` and serves `dist/`.
