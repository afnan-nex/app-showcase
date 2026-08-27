/**
 * BudgetOS - Bundle Builder
 * Compiles all modular JavaScript files into a single standalone bundle.js
 * allowing BudgetOS to run seamlessly both via http:// server and directly via file:/// double-click.
 */

import fs from 'fs';
import path from 'path';

const baseDir = process.cwd();

// Read modules in dependency order
const filesToBundle = [
  'js/icons.js',
  'js/formatters.js',
  'js/calculations/balances.js',
  'js/calculations/budgets.js',
  'js/calculations/forecast.js',
  'js/calculations/scenarios.js',
  'js/calculations/anomalies.js',
  'js/calculations/analytics.js',
  'js/charts/svg-charts.js',
  'js/db.js',
  'js/state.js',
  'js/views/dashboard.js',
  'js/views/transactions.js',
  'js/views/accounts.js',
  'js/views/budgets.js',
  'js/views/goals.js',
  'js/views/recurring.js',
  'js/views/forecast.js',
  'js/views/scenarios.js',
  'js/views/reports.js',
  'js/views/data-hub.js',
  'js/app.js'
];

let bundleContent = `/**
 * BudgetOS - Standalone Application Bundle
 * Complete client-side personal finance & cash-flow simulation engine.
 * Self-contained for both HTTP servers and local file:/// protocol execution.
 */

(function() {
'use strict';

`;

for (const relPath of filesToBundle) {
  const fullPath = path.join(baseDir, relPath);
  let code = fs.readFileSync(fullPath, 'utf8');

  // Strip import statements
  code = code.replace(/^import\s+.*?from\s+['"].*?['"];?\r?\n?/gm, '');
  // Strip export statements (e.g. "export function", "export const", "export default", "export { ... }")
  code = code.replace(/^export\s+default\s+.*?;?\r?\n?/gm, '');
  code = code.replace(/^export\s+\{.*?\};?\r?\n?/gm, '');
  code = code.replace(/^export\s+(function|const|let|var|class|async\s+function)/gm, '$1');

  bundleContent += `\n/* --- MODULE: ${relPath} --- */\n` + code + '\n';
}

bundleContent += `
})();
`;

fs.writeFileSync(path.join(baseDir, 'bundle.js'), bundleContent, 'utf8');
console.log('Successfully compiled bundle.js (Size:', bundleContent.length, 'bytes)');
