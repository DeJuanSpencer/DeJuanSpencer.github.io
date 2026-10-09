// One-time script. Never called by build, test or lint, and the only script allowed network access.
// Downloads the latin woff2 files for Inter Tight 400, 500, 600 and Newsreader italic 400
// from the Google Fonts CSS API, then writes src/assets/fonts/*, LICENSE.txt and src/css/fonts.css.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fontDir = join(root, 'src', 'assets', 'fonts');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

const faces = [
  { family: 'Inter Tight', style: 'normal', weight: 400, query: 'family=Inter+Tight:wght@400', file: 'inter-tight-400.woff2' },
  { family: 'Inter Tight', style: 'normal', weight: 500, query: 'family=Inter+Tight:wght@500', file: 'inter-tight-500.woff2' },
  { family: 'Inter Tight', style: 'normal', weight: 600, query: 'family=Inter+Tight:wght@600', file: 'inter-tight-600.woff2' },
  { family: 'Newsreader', style: 'italic', weight: 400, query: 'family=Newsreader:ital,wght@1,400', file: 'newsreader-italic-400.woff2' },
];

async function get(url, asBuffer) {
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  return asBuffer ? Buffer.from(await res.arrayBuffer()) : res.text();
}

function latinBlock(css) {
  const blocks = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)];
  const latin = blocks.find((b) => b[1] === 'latin');
  if (!latin) throw new Error('no latin block in the returned css');
  return latin[2];
}

mkdirSync(fontDir, { recursive: true });
const rules = [];
for (const face of faces) {
  const css = await get(`https://fonts.googleapis.com/css2?${face.query}&display=swap`, false);
  const block = latinBlock(css);
  const url = block.match(/url\((https:[^)]+\.woff2)\)/)?.[1];
  const range = block.match(/unicode-range:\s*([^;]+);/)?.[1];
  if (!url || !range) throw new Error(`could not read url or unicode-range for ${face.file}`);
  const data = await get(url, true);
  if (data.subarray(0, 4).toString('latin1') !== 'wOF2') throw new Error(`${face.file} is not woff2`);
  writeFileSync(join(fontDir, face.file), data);
  console.log(`${face.file}: ${data.length} bytes`);
  rules.push(`@font-face {
  font-family: "${face.family}";
  font-style: ${face.style};
  font-weight: ${face.weight};
  font-display: swap;
  src: url("/assets/fonts/${face.file}") format("woff2");
  unicode-range: ${range.trim()};
}`);
}

writeFileSync(join(root, 'src', 'css', 'fonts.css'),
  `/* Generated once by scripts/fetch-fonts.mjs. Latin subset, self-hosted. */\n${rules.join('\n')}\n`);

writeFileSync(join(fontDir, 'LICENSE.txt'), `Fonts in this folder: Inter Tight and Newsreader.

Both are licensed under the SIL Open Font License, Version 1.1
(https://openfontlicense.org). Source: Google Fonts
(https://fonts.google.com/specimen/Inter+Tight and https://fonts.google.com/specimen/Newsreader).

Inter Tight: Copyright 2020 The Inter Project Authors (https://github.com/rsms/inter).
Newsreader: Copyright 2020 The Newsreader Project Authors (https://github.com/productiontype/Newsreader).

The SIL Open Font License 1.1 permits free use, study, modification and
redistribution of these fonts, including embedding in web sites, as long as the
fonts are not sold by themselves and this notice stays with them. The full
license text is at https://openfontlicense.org/open-font-license-official-text/.
`);
console.log('wrote src/css/fonts.css and src/assets/fonts/LICENSE.txt');
