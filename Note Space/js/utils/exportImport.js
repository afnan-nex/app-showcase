/**
 * NoteSpace - Export & Import System
 * Handles JSON snapshot download/upload and Markdown document generation.
 */

import { store } from '../state/store.js';

export function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadMarkdown(content, filename) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function pageToMarkdown(page) {
  if (!page) return '';
  let md = `# ${page.title || 'Untitled'}\n\n`;

  if (page.blocks && Array.isArray(page.blocks)) {
    page.blocks.forEach(block => {
      const text = (block.content || '').replace(/<[^>]*>/g, ''); // strip HTML tags
      switch (block.type) {
        case 'heading1':
          md += `# ${text}\n\n`;
          break;
        case 'heading2':
          md += `## ${text}\n\n`;
          break;
        case 'heading3':
          md += `### ${text}\n\n`;
          break;
        case 'bulletList':
          md += `- ${text}\n`;
          break;
        case 'numberedList':
          md += `1. ${text}\n`;
          break;
        case 'checklist':
          const check = block.metadata && block.metadata.checked ? '[x]' : '[ ]';
          md += `- ${check} ${text}\n`;
          break;
        case 'quote':
          md += `> ${text}\n\n`;
          break;
        case 'code':
          const lang = (block.metadata && block.metadata.language) || '';
          md += `\`\`\`${lang}\n${block.content || ''}\n\`\`\`\n\n`;
          break;
        case 'divider':
          md += `---\n\n`;
          break;
        case 'callout':
          md += `> 💡 **Callout:** ${text}\n\n`;
          break;
        case 'toggle':
          md += `<details>\n<summary>${text}</summary>\n\n${(block.metadata && block.metadata.children) || ''}\n</details>\n\n`;
          break;
        case 'table':
          if (block.metadata && block.metadata.rows && block.metadata.rows.length > 0) {
            const rows = block.metadata.rows;
            const header = rows[0];
            md += `| ${header.join(' | ')} |\n`;
            md += `| ${header.map(() => '---').join(' | ')} |\n`;
            for (let i = 1; i < rows.length; i++) {
              md += `| ${rows[i].join(' | ')} |\n`;
            }
            md += '\n';
          }
          break;
        case 'bookmark':
          md += `[${(block.metadata && block.metadata.title) || block.content}](${block.content})\n\n`;
          break;
        case 'image':
          md += `![${(block.metadata && block.metadata.caption) || 'Image'}](${block.content})\n\n`;
          break;
        case 'paragraph':
        default:
          if (text.trim()) {
            md += `${text}\n\n`;
          }
          break;
      }
    });
  }

  return md;
}

export async function exportCurrentPageMarkdown(pageId) {
  const page = store.getPage(pageId);
  if (!page) return;
  const md = pageToMarkdown(page);
  const cleanTitle = (page.title || 'Untitled').replace(/[^a-z0-9]/gi, '_').toLowerCase();
  downloadMarkdown(md, `${cleanTitle}.md`);
}

export async function exportWorkspace() {
  const data = await store.exportWorkspaceJSON();
  const dateStr = new Date().toISOString().split('T')[0];
  downloadJSON(data, `NoteSpace_Backup_${dateStr}.json`);
}

export function readJSONFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        resolve(json);
      } catch (err) {
        reject(new Error('Invalid JSON file format.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
}
