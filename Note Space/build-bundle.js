const fs = require('fs');
const path = require('path');

const rootDir = 'C:/Users/Admin/Desktop/webapps/Note Space';

const files = [
  'js/icons/icons.js',
  'js/utils/dom.js',
  'js/utils/toast.js',
  'js/db/idb.js',
  'js/db/defaultData.js',
  'js/state/store.js',
  'js/utils/exportImport.js',
  'js/editor/blocks.js',
  'js/editor/slashMenu.js',
  'js/editor/inlineToolbar.js',
  'js/editor/dragDrop.js',
  'js/database/tableView.js',
  'js/database/boardView.js',
  'js/database/listView.js',
  'js/database/propertyModal.js',
  'js/database/database.js',
  'js/editor/editor.js',
  'js/sidebar/sidebar.js',
  'js/search/commandPalette.js',
  'js/history/historyManager.js',
  'js/modals/trashModal.js',
  'js/modals/settingsModal.js',
  'js/modals/shortcutsModal.js',
  'js/app.js'
];

let bundle = '(function() {\n  "use strict";\n\n';

for (const file of files) {
  let content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  
  // Remove import statements (matches actual JS import lines, not comments)
  content = content.replace(/^\s*import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '');
  content = content.replace(/^\s*import\s+['"][^'"]+['"];?\s*$/gm, '');
  
  // Remove export keywords (including export async function, export default, export const, etc.)
  content = content.replace(/^\s*export\s+(default\s+)?/gm, '');
  content = content.replace(/^\s*export\s*\{[\s\S]*?\};?\s*$/gm, '');

  bundle += `  // ==========================================\n  // FILE: ${file}\n  // ==========================================\n` + content + '\n\n';
}

bundle += '})();\n';

fs.writeFileSync(path.join(rootDir, 'js/notespace.js'), bundle, 'utf8');
console.log('Bundle written successfully! Total size:', bundle.length, 'bytes');
