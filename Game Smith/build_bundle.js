/**
 * GameSmith - Standalone Bundle Builder
 * Compiles all modular JavaScript files into a single standalone bundle.js
 * allowing GameSmith to run seamlessly offline and via direct file:/// double-click.
 */

import fs from 'fs';
import path from 'path';

const baseDir = process.cwd();

const filesToBundle = [
  'js/core/icons.js',
  'js/core/audio-synth.js',
  'js/core/input.js',
  'js/core/db.js',
  'js/engine/physics.js',
  'js/engine/events.js',
  'js/engine/renderer.js',
  'js/engine/runtime.js',
  'js/editor/templates.js',
  'js/editor/scene-tree.js',
  'js/editor/inspector.js',
  'js/editor/event-sheet.js',
  'js/editor/sprite-painter.js',
  'js/app.js'
];

let bundleContent = `/**
 * GameSmith - Standalone Game Creator & Runtime Bundle
 * Visual 2D Game Creator with 2D Physics, Visual Events, Pixel Art Editor & Audio Synth.
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
