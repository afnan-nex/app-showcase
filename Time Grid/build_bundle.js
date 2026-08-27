/**
 * TimeGrid - Standalone Bundle Builder
 * Compiles all modular JavaScript files into a single standalone bundle.js
 * allowing TimeGrid to run seamlessly offline and via direct file:/// double-click.
 */

import fs from 'fs';
import path from 'path';

const baseDir = process.cwd();

const filesToBundle = [
  'js/core/icons.js',
  'js/core/time.js',
  'js/engine/conflicts.js',
  'js/engine/recurrence.js',
  'js/engine/templates.js',
  'js/engine/sample-data.js',
  'js/engine/charts.js',
  'js/core/db.js',
  'js/editor/time-grid.js',
  'js/editor/task-drawer.js',
  'js/editor/block-inspector.js',
  'js/editor/focus-mode.js',
  'js/editor/scenario-comparison.js',
  'js/app.js'
];

let bundleContent = `/**
 * TimeGrid - Standalone Visual Time-Blocking & Daily Schedule Workstation Bundle
 * 100% Client-Side Time Engine, Zero Server Backend, Works on HTTP & file:///
 */

(function() {
'use strict';

`;

for (const relPath of filesToBundle) {
  const fullPath = path.join(baseDir, relPath);
  let code = fs.readFileSync(fullPath, 'utf8');

  // Strip all import statements (single-line and multi-line)
  code = code.replace(/import\s*[\s\S]*?from\s*['"][^'"]+['"];?/g, '');
  code = code.replace(/import\s+['"][^'"]+['"];?/g, '');

  // Strip all export statements
  code = code.replace(/export\s+default\s+.*?;?/g, '');
  code = code.replace(/export\s+\{[\s\S]*?\};?/g, '');
  code = code.replace(/export\s+(function|const|let|var|class|async\s+function)/g, '$1');

  bundleContent += `\n/* --- MODULE: ${relPath} --- */\n` + code + '\n';
}

bundleContent += `
})();
`;

fs.writeFileSync(path.join(baseDir, 'bundle.js'), bundleContent, 'utf8');
console.log('Successfully compiled bundle.js (Size:', bundleContent.length, 'bytes)');
