/**
 * NoteSpace - Export & Import System with Schema Validator
 */
class ExportImport {
  constructor() {
    this.modal = null;
    this.init();
  }

  init() {
    if (document.body) {
      this.createModalElement();
    } else {
      document.addEventListener('DOMContentLoaded', () => this.createModalElement());
    }
  }

  createModalElement() {
    this.modal = document.createElement('div');
    this.modal.className = 'export-modal-backdrop';
    this.modal.innerHTML = `
      <div class="export-dialog-box">
        <div class="export-dialog-header">
          <div class="dialog-title-wrap">
            ${Icons.get('download', 'icon-sm', 16)}
            <h3>Workspace Export & Import</h3>
          </div>
          <button class="dialog-close-btn">${Icons.get('x', 'icon-sm', 16)}</button>
        </div>
        <div class="export-dialog-body">
          <div class="export-section">
            <h4>Export Data</h4>
            <p class="export-hint">Download an offline backup of your entire NoteSpace workspace or current document.</p>
            <div class="export-btn-group">
              <button class="btn-primary" id="btn-export-json">${Icons.get('download', 'icon-xs', 14)} Export Full Workspace (JSON)</button>
              <button class="btn-outline" id="btn-export-page-md">${Icons.get('page', 'icon-xs', 14)} Export Current Page (Markdown)</button>
              <button class="btn-outline" id="btn-export-page-html">${Icons.get('code', 'icon-xs', 14)} Export Current Page (HTML)</button>
            </div>
          </div>

          <div class="export-divider"></div>

          <div class="import-section">
            <h4>Import Workspace</h4>
            <p class="export-hint">Upload a NoteSpace JSON backup file. All data is validated before importing.</p>
            <div class="import-drop-area" id="import-drop-area">
              ${Icons.get('upload', 'icon-lg', 32)}
              <div class="import-drop-text">Drag & drop NoteSpace JSON file here, or click to browse</div>
              <input type="file" accept=".json" id="import-file-input" style="display:none;" />
            </div>
            <div class="import-status-msg" id="import-status-msg"></div>
          </div>
        </div>
      </div>
    `;

    this.modal?.querySelector('.dialog-close-btn')?.addEventListener('click', () => this.close());
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    // Wire Export buttons
    this.modal?.querySelector('#btn-export-json')?.addEventListener('click', () => this.exportFullWorkspace());
    this.modal?.querySelector('#btn-export-page-md')?.addEventListener('click', () => {
      if (State.activePageId) this.exportPageMarkdown(State.activePageId);
    });
    this.modal?.querySelector('#btn-export-page-html')?.addEventListener('click', () => {
      if (State.activePageId) this.exportPageHTML(State.activePageId);
    });

    // Wire Import file input
    const dropArea = this.modal?.querySelector('#import-drop-area');
    const fileInput = this.modal?.querySelector('#import-file-input');

    dropArea?.addEventListener('click', () => fileInput?.click());
    fileInput?.addEventListener('change', (e) => {
      if (e.target.files[0]) this.processImportFile(e.target.files[0]);
    });

    dropArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropArea.classList.add('is-dragover');
    });

    dropArea.addEventListener('dragleave', () => {
      dropArea.classList.remove('is-dragover');
    });

    dropArea.addEventListener('drop', (e) => {
      e.preventDefault();
      dropArea.classList.remove('is-dragover');
      if (e.dataTransfer.files[0]) this.processImportFile(e.dataTransfer.files[0]);
    });

    document.body.appendChild(this.modal);
  }

  open() {
    this.modal.classList.add('is-open');
    const msg = this.modal.querySelector('#import-status-msg');
    msg.textContent = '';
    msg.className = 'import-status-msg';
  }

  close() {
    this.modal.classList.remove('is-open');
  }

  // --- Export Operations ---

  async exportFullWorkspace() {
    try {
      const data = await NoteSpaceDB.exportFullData();
      const jsonStr = JSON.stringify(data, null, 2);
      const filename = `notespace-backup-${new Date().toISOString().slice(0, 10)}.json`;
      this.downloadFile(filename, jsonStr, 'application/json');
      window.App?.showToast('Workspace backup exported successfully!');
    } catch (err) {
      console.error('[NoteSpace Export] Error exporting workspace:', err);
      alert('Failed to export workspace: ' + err.message);
    }
  }

  async exportPageMarkdown(pageId) {
    const page = State.pages.find(p => p.id === pageId);
    if (!page) return;

    let md = `# ${page.icon ? page.icon + ' ' : ''}${page.title || 'Untitled'}\n\n`;

    if (page.isDatabase) {
      const db = await NoteSpaceDB.getDatabase(pageId);
      if (db) {
        const props = db.properties || [];
        const rows = db.rows || [];
        if (props.length) {
          md += `| ${props.map(p => p.name).join(' | ')} |\n`;
          md += `| ${props.map(() => '---').join(' | ')} |\n`;
          rows.forEach(r => {
            const rowCells = props.map(p => {
              const val = r.values?.[p.id];
              if (val === undefined || val === null) return '';
              if (p.type === 'status' || p.type === 'select') {
                const opt = p.options?.find(o => o.id === val);
                return opt?.label || val;
              }
              if (p.type === 'multi-select' && Array.isArray(val)) {
                return val.map(id => p.options?.find(o => o.id === id)?.label || id).join(', ');
              }
              return String(val);
            });
            md += `| ${rowCells.join(' | ')} |\n`;
          });
          md += '\n';
        }
      }
    } else {
      const blocks = await NoteSpaceDB.getBlocks(pageId);
      blocks.forEach(b => {
        const text = (b.content || '').replace(/<[^>]*>?/gm, ''); // strip HTML tags
        switch (b.type) {
          case 'h1': md += `# ${text}\n\n`; break;
          case 'h2': md += `## ${text}\n\n`; break;
          case 'h3': md += `### ${text}\n\n`; break;
          case 'quote': md += `> ${text}\n\n`; break;
          case 'bulletList': md += `- ${text}\n`; break;
          case 'numberedList': md += `1. ${text}\n`; break;
          case 'checkList': md += `- [${b.metadata?.checked ? 'x' : ' '}] ${text}\n`; break;
          case 'divider': md += `---\n\n`; break;
          case 'code': md += `\`\`\`${b.metadata?.language || ''}\n${b.content || ''}\n\`\`\`\n\n`; break;
          case 'callout': md += `> **${b.metadata?.icon || '💡'} Note:** ${text}\n\n`; break;
          case 'table': {
            const headers = b.metadata?.headers || [];
            const rows = b.metadata?.rows || [];
            if (headers.length) {
              md += `| ${headers.join(' | ')} |\n`;
              md += `| ${headers.map(() => '---').join(' | ')} |\n`;
              rows.forEach(r => {
                md += `| ${r.join(' | ')} |\n`;
              });
              md += '\n';
            }
            break;
          }
          case 'bookmark': md += `[${b.content || 'Bookmark'}](${b.metadata?.url || '#'})\n\n`; break;
          default: md += `${text}\n\n`; break;
        }
      });
    }

    const slug = (page.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    this.downloadFile(`${slug}.md`, md, 'text/markdown');
    window.App?.showToast(`Exported "${page.title}" as Markdown`);
  }

  async exportPageHTML(pageId) {
    const page = State.pages.find(p => p.id === pageId);
    if (!page) return;

    let bodyHtml = `<h1>${page.icon ? page.icon + ' ' : ''}${page.title || 'Untitled'}</h1>\n`;

    if (page.isDatabase) {
      const db = await NoteSpaceDB.getDatabase(pageId);
      if (db) {
        const props = db.properties || [];
        const rows = db.rows || [];
        bodyHtml += `<table border="1" style="border-collapse:collapse; width:100%;">\n<thead>\n<tr>`;
        props.forEach(p => { bodyHtml += `<th style="padding:8px;">${p.name}</th>`; });
        bodyHtml += `</tr>\n</thead>\n<tbody>\n`;
        rows.forEach(r => {
          bodyHtml += `<tr>`;
          props.forEach(p => {
            const val = r.values?.[p.id];
            let displayVal = val ?? '';
            if (p.type === 'status' || p.type === 'select') {
              const opt = p.options?.find(o => o.id === val);
              displayVal = opt?.label || val || '';
            } else if (p.type === 'multi-select' && Array.isArray(val)) {
              displayVal = val.map(id => p.options?.find(o => o.id === id)?.label || id).join(', ');
            }
            bodyHtml += `<td style="padding:8px;">${displayVal}</td>`;
          });
          bodyHtml += `</tr>\n`;
        });
        bodyHtml += `</tbody>\n</table>\n`;
      }
    } else {
      const blocks = await NoteSpaceDB.getBlocks(pageId);
      blocks.forEach(b => {
        switch (b.type) {
          case 'h1': bodyHtml += `<h1>${b.content || ''}</h1>\n`; break;
          case 'h2': bodyHtml += `<h2>${b.content || ''}</h2>\n`; break;
          case 'h3': bodyHtml += `<h3>${b.content || ''}</h3>\n`; break;
          case 'quote': bodyHtml += `<blockquote>${b.content || ''}</blockquote>\n`; break;
          case 'bulletList': bodyHtml += `<li>${b.content || ''}</li>\n`; break;
          case 'checkList': bodyHtml += `<div><input type="checkbox" ${b.metadata?.checked ? 'checked' : ''} disabled> ${b.content || ''}</div>\n`; break;
          case 'code': bodyHtml += `<pre><code>${b.content || ''}</code></pre>\n`; break;
          case 'divider': bodyHtml += `<hr/>\n`; break;
          default: bodyHtml += `<p>${b.content || ''}</p>\n`; break;
        }
      });
    }

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${page.title || 'NoteSpace Document'}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 40px auto; line-height: 1.6; padding: 0 20px; color: #1e293b; }
    h1, h2, h3 { color: #0f172a; margin-top: 1.5em; }
    blockquote { border-left: 3px solid #cbd5e1; margin-left: 0; padding-left: 1rem; color: #64748b; font-style: italic; }
    pre { background: #f1f5f9; padding: 1rem; border-radius: 6px; overflow-x: auto; }
    code { font-family: monospace; font-size: 0.9em; }
    table { width: 100%; border-collapse: collapse; margin-top: 1.5em; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f8fafc; }
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;

    const slug = (page.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    this.downloadFile(`${slug}.html`, fullHtml, 'text/html');
    window.App?.showToast(`Exported "${page.title}" as HTML`);
  }

  // --- Import Validator & Importer ---

  async processImportFile(file) {
    const statusMsg = this.modal.querySelector('#import-status-msg');
    statusMsg.textContent = 'Validating backup file...';
    statusMsg.className = 'import-status-msg is-loading';

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      // Validate schema
      this.validateBackupSchema(json);

      // Clear existing and proceed with import
      await NoteSpaceDB.clearAll();
      await NoteSpaceDB.importFullData(json);

      statusMsg.textContent = 'Import successful! Reloading workspace...';
      statusMsg.className = 'import-status-msg is-success';

      setTimeout(async () => {
        await State.refreshPages();
        if (State.pages.length > 0) {
          await State.setActivePage(State.pages[0].id);
        }
        this.close();
        window.App?.showToast('Workspace imported and restored successfully!');
      }, 1000);
    } catch (err) {
      console.error('[NoteSpace Import] Error:', err);
      statusMsg.textContent = 'Import failed: ' + err.message;
      statusMsg.className = 'import-status-msg is-error';
    }
  }

  validateBackupSchema(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON structure');
    }

    if (!data.data || typeof data.data !== 'object') {
      throw new Error('Missing "data" root property in backup file');
    }

    const { pages, blocks } = data.data;

    if (!Array.isArray(pages)) {
      throw new Error('Invalid format: "pages" must be an array');
    }

    if (!Array.isArray(blocks)) {
      throw new Error('Invalid format: "blocks" must be an array');
    }

    // Validate page objects
    for (const p of pages) {
      if (!p.id || typeof p.id !== 'string') {
        throw new Error('Malformed page detected: missing or invalid "id"');
      }
    }

    // Validate block objects
    for (const b of blocks) {
      if (!b.id || !b.type) {
        throw new Error('Malformed block detected: missing "id" or "type"');
      }
    }

    return true;
  }

  downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
}

window.ExportImport = new ExportImport();
