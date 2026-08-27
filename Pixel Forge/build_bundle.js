/**
 * PixelForge - Standalone Bundle Builder
 * Compiles all modular JavaScript files into a single standalone bundle.js
 * allowing PixelForge to run seamlessly offline, on GitHub Pages, and via direct file:/// double-click.
 */

import fs from 'fs';
import path from 'path';

const baseDir = process.cwd();

const filesToBundle = [
  'js/core/icons.js',
  'js/core/math-draw.js',
  'js/core/palettes.js',
  'js/core/db.js',
  'js/engine/canvas-renderer.js',
  'js/engine/animation.js',
  'js/engine/tilemap.js',
  'js/editor/modals.js',
  'js/editor/layer-manager.js',
  'js/editor/color-picker.js',
  'js/editor/timeline.js',
  'js/editor/templates.js',
  'js/app.js'
];

let bundleContent = `/**
 * PixelForge - Standalone Pixel Art Creation & Animation Workstation Bundle
 * Multi-layer pixel art editor, sprite animator, and tilemap editor.
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
