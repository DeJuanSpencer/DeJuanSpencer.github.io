// Lint: anchors, placeholders, banned content and style, run over the page assembled in memory.
import { assemble } from './build.mjs';
import { runLint } from './lib/checks.mjs';

let site;
try {
  site = assemble();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

const results = runLint(site);
let failed = 0;
for (const [name, problems] of Object.entries(results)) {
  if (problems.length === 0) {
    console.log(`ok    ${name}`);
    continue;
  }
  failed += problems.length;
  console.log(`FAIL  ${name}`);
  for (const p of problems) console.log(`      ${p}`);
}
if (failed) {
  console.error(`lint failed: ${failed} problem${failed === 1 ? '' : 's'}`);
  process.exit(1);
}
