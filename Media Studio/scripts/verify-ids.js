import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Read index.html and app.bundle.js
const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
const bundle = fs.readFileSync(path.join(projectRoot, 'js', 'app.bundle.js'), 'utf8');

console.log('HTML length:', html.length);
console.log('Bundle length:', bundle.length);

// Extract all IDs from index.html
const idMatches = html.match(/id="([^"]+)"/g) || [];
const allIds = idMatches.map(m => m.replace('id="', '').replace('"', ''));
console.log(`Extracted ${allIds.length} element IDs from index.html`);

// Extract all getElementById calls from bundle
const getElMatches = bundle.match(/getElementById\(['"]([^'"]+)['"]\)/g) || [];
const queriedIds = [...new Set(getElMatches.map(m => m.replace(/getElementById\(['"]/, '').replace(/['"]\)/, '')))];

console.log(`Bundle queries ${queriedIds.length} distinct element IDs.`);

const missingIds = [];
for (const id of queriedIds) {
  if (!allIds.includes(id)) {
    // Check if generated dynamically
    if (!id.startsWith('thumb-') && !id.startsWith('pane-') && !id.startsWith('btn-text-align-')) {
      missingIds.push(id);
    }
  }
}

if (missingIds.length > 0) {
  console.warn('Potential missing IDs in HTML:', missingIds);
} else {
  console.log('✓ All queried element IDs exist in index.html!');
}
