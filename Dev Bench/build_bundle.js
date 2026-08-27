/**
 * DevBench - Standalone Bundle Builder
 * Compiles all modular JavaScript files into a single bundle.js
 * allowing DevBench to run seamlessly offline and via direct file:/// double-click.
 */

import fs from 'fs';
import path from 'path';

const baseDir = process.cwd();

const filesToBundle = [
  'js/icons.js',
  'js/storage.js',
  'js/tools/encoding-tools.js',
  'js/tools/json-tools.js',
  'js/tools/security-tools.js',
  'js/tools/text-tools.js',
  'js/tools/network-tools.js',
  'js/tools/conversion-tools.js',
  'js/tool-registry.js',
  'js/command-palette.js',
  'js/app.js'
];

let bundleContent = `/**
 * DevBench - Standalone Application Bundle
 * 20 Professional Developer Utilities in One Unified Browser Workstation.
 * 100% Client-Side, Zero Backend, Works on HTTP & file:///
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
