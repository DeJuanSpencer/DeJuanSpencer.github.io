// Lint: anchors, placeholders, banned content and style, then the static performance budget,
// all run over the page assembled in memory.
import { assemble } from './build.mjs';
import { runBudget } from './check-budget.mjs';
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

const budget = runBudget(site);
console.log(`\nStatic performance budget (approximates Lighthouse, not a score)\n${budget.table}`);
failed += budget.failed.length;

if (failed) {
  console.error(`lint failed: ${failed} problem${failed === 1 ? '' : 's'}`);
  process.exit(1);
}
