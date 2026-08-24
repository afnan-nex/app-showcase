import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const files = [
  'presets-data.js',
  'filter-engine.js',
  'layer-engine.js',
  'history-engine.js',
  'storage-engine.js',
  'transform-engine.js',
  'tool-engine.js',
  'export-engine.js',
  'canvas-engine.js',
  'app.js'
];

let bundleCode = `/**
 * MediaStudio — Production Standalone Bundle
 * Works seamlessly on file:/// (double click) and web servers (HTTP/HTTPS/GitHub Pages)
 */
(function () {
  'use strict';

`;

for (const file of files) {
  const filePath = path.join(projectRoot, 'js', file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Strip all import statements
  content = content.replace(/^\s*import\s+[\s\S]*?from\s+['"][^'"]+['"];?/gm, '');
  content = content.replace(/^\s*import\s+['"][^'"]+['"];?/gm, '');

  // Strip export keywords
  content = content.replace(/^\s*export\s+default\s+/gm, '');
  content = content.replace(/^\s*export\s+(const|let|var|function|class|async function)\s+/gm, '$1 ');
  content = content.replace(/^\s*export\s*\{[\s\S]*?\};?/gm, '');

  bundleCode += `\n/* --- MODULE: ${file} --- */\n` + content + '\n';
}

bundleCode += `\n})();\n`;

const outputPath = path.join(projectRoot, 'js', 'app.bundle.js');
fs.writeFileSync(outputPath, bundleCode, 'utf8');
console.log(`✓ Bundle generated successfully at: ${outputPath} (${bundleCode.length} bytes)`);
