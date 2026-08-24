/**
 * NoteSpace - Block Types & Rendering Engine
 * Implements 14+ block types with rich DOM manipulation, metadata storage, and contextual interactions.
 */

import { Icons, getIcon } from '../icons/icons.js';
import { createElement, escapeHTML, sanitizeContent } from '../utils/dom.js';

export const BLOCK_DEFINITIONS = [
  {
    type: 'paragraph',
    label: 'Text',
    description: 'Just start writing with plain text.',
    icon: 'paragraph',
    shortcut: 'Enter',
    defaultContent: '',
    defaultMetadata: {}
  },
  {
    type: 'heading1',
    label: 'Heading 1',
    description: 'Big section heading.',
    icon: 'heading1',
    shortcut: '# + Space',
    defaultContent: '',
    defaultMetadata: {}
  },
  {
    type: 'heading2',
    label: 'Heading 2',
    description: 'Medium section heading.',
    icon: 'heading2',
    shortcut: '## + Space',
    defaultContent: '',
    defaultMetadata: {}
  },
  {
    type: 'heading3',
    label: 'Heading 3',
    description: 'Small section heading.',
    icon: 'heading3',
    shortcut: '### + Space',
    defaultContent: '',
    defaultMetadata: {}
  },
  {
    type: 'bulletList',
    label: 'Bulleted List',
    description: 'Create a simple bulleted list.',
    icon: 'bulletList',
    shortcut: '- + Space',
    defaultContent: '',
    defaultMetadata: {}
  },
  {
    type: 'numberedList',
    label: 'Numbered List',
    description: 'Create a list with numbering.',
    icon: 'numberedList',
    shortcut: '1. + Space',
    defaultContent: '',
    defaultMetadata: {}
  },
  {
    type: 'checklist',
    label: 'To-do List',
    description: 'Track tasks with a to-do list.',
    icon: 'checklist',
    shortcut: '[] + Space',
    defaultContent: '',
    defaultMetadata: { checked: false }
  },
  {
    type: 'toggle',
    label: 'Toggle List',
    description: 'Toggles can hide and show content inside.',
    icon: 'toggle',
    shortcut: '> + Space',
    defaultContent: '',
    defaultMetadata: { isOpen: false, children: '' }
  },
  {
    type: 'quote',
    label: 'Quote',
    description: 'Capture a quote or key takeaway.',
    icon: 'quote',
    shortcut: '" + Space',
    defaultContent: '',
    defaultMetadata: {}
  },
  {
    type: 'callout',
    label: 'Callout',
    description: 'Make writing stand out with an icon & accent.',
    icon: 'callout',
    shortcut: '/callout',
    defaultContent: '',
    defaultMetadata: { icon: '💡', color: 'blue' }
  },
  {
    type: 'divider',
    label: 'Divider',
    description: 'Visually divide blocks with a thin line.',
    icon: 'divider',
    shortcut: '---',
    defaultContent: '',
    defaultMetadata: {}
  },
  {
    type: 'code',
    label: 'Code Block',
    description: 'Capture a code snippet with formatting.',
    icon: 'code',
    shortcut: '```',
    defaultContent: '',
    defaultMetadata: { language: 'javascript' }
  },
  {
    type: 'table',
    label: 'Table',
    description: 'Add a structured inline table.',
    icon: 'table',
    shortcut: '/table',
    defaultContent: '',
    defaultMetadata: {
      rows: [
        ['Column 1', 'Column 2', 'Column 3'],
        ['', '', ''],
        ['', '', '']
      ]
    }
  },
  {
    type: 'image',
    label: 'Image',
    description: 'Upload or embed with a link.',
    icon: 'image',
    shortcut: '/image',
    defaultContent: '',
    defaultMetadata: { caption: '' }
  },
  {
    type: 'bookmark',
    label: 'Web Bookmark',
    description: 'Save a visual web link card preview.',
    icon: 'bookmark',
    shortcut: '/bookmark',
    defaultContent: '',
    defaultMetadata: { title: '', description: '', icon: '🌐' }
  },
  {
    type: 'database',
    label: 'Inline Database',
    description: 'Embed a dynamic database with views.',
    icon: 'database',
    shortcut: '/database',
    defaultContent: '',
    defaultMetadata: { databaseId: null }
  }
];

export function getBlockDefinition(type) {
  return BLOCK_DEFINITIONS.find(b => b.type === type) || BLOCK_DEFINITIONS[0];
}

/**
 * Render Block Element DOM
 */
export function renderBlockElement(block, onUpdate, onDelete, onConvert) {
  const blockEl = createElement('div', `ns-block ns-block-${block.type}`);
  blockEl.dataset.blockId = block.id;
  blockEl.dataset.blockType = block.type;

  // 1. Block Handle / Gutter (Controls appear contextually on hover)
  const gutterEl = createElement('div', 'ns-block-gutter');
  gutterEl.innerHTML = `
    <button class="ns-gutter-btn ns-add-block-btn" title="Add block below" aria-label="Add block below">
      ${Icons.plus}
    </button>
    <div class="ns-gutter-btn ns-drag-handle" title="Drag to move or click for menu" aria-label="Drag or options">
      ${Icons.grip}
    </div>
  `;
  blockEl.appendChild(gutterEl);

  // 2. Block Content Container
  const contentWrapper = createElement('div', 'ns-block-content-wrapper');

  switch (block.type) {
    case 'paragraph': {
      const editor = createElement('div', 'ns-block-editor ns-paragraph-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('data-placeholder', "Type '/' for commands...");
      editor.innerHTML = block.content || '';
      contentWrapper.appendChild(editor);
      break;
    }

    case 'heading1': {
      const editor = createElement('h1', 'ns-block-editor ns-heading1-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('data-placeholder', 'Heading 1');
      editor.innerHTML = block.content || '';
      contentWrapper.appendChild(editor);
      break;
    }

    case 'heading2': {
      const editor = createElement('h2', 'ns-block-editor ns-heading2-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('data-placeholder', 'Heading 2');
      editor.innerHTML = block.content || '';
      contentWrapper.appendChild(editor);
      break;
    }

    case 'heading3': {
      const editor = createElement('h3', 'ns-block-editor ns-heading3-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('data-placeholder', 'Heading 3');
      editor.innerHTML = block.content || '';
      contentWrapper.appendChild(editor);
      break;
    }

    case 'bulletList': {
      const row = createElement('div', 'ns-bullet-row');
      const bullet = createElement('div', 'ns-bullet-marker');
      bullet.innerHTML = '•';
      const editor = createElement('div', 'ns-block-editor ns-bullet-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('data-placeholder', 'List item');
      editor.innerHTML = block.content || '';
      row.appendChild(bullet);
      row.appendChild(editor);
      contentWrapper.appendChild(row);
      break;
    }

    case 'numberedList': {
      const row = createElement('div', 'ns-numbered-row');
      const num = createElement('div', 'ns-numbered-marker');
      num.innerHTML = '1.';
      const editor = createElement('div', 'ns-block-editor ns-numbered-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('data-placeholder', 'List item');
      editor.innerHTML = block.content || '';
      row.appendChild(num);
      row.appendChild(editor);
      contentWrapper.appendChild(row);
      break;
    }

    case 'checklist': {
      const isChecked = block.metadata && block.metadata.checked;
      const row = createElement('div', `ns-checklist-row ${isChecked ? 'is-checked' : ''}`);
      const checkbox = createElement('input', 'ns-checkbox-input', '', {
        type: 'checkbox'
      });
      if (isChecked) checkbox.checked = true;

      const editor = createElement('div', 'ns-block-editor ns-checklist-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('data-placeholder', 'To-do');
      editor.innerHTML = block.content || '';

      checkbox.addEventListener('change', (e) => {
        const checked = e.target.checked;
        if (checked) {
          row.classList.add('is-checked');
        } else {
          row.classList.remove('is-checked');
        }
        onUpdate({
          ...block,
          metadata: { ...(block.metadata || {}), checked }
        });
      });

      row.appendChild(checkbox);
      row.appendChild(editor);
      contentWrapper.appendChild(row);
      break;
    }

    case 'quote': {
      const quoteWrap = createElement('blockquote', 'ns-quote-block');
      const editor = createElement('div', 'ns-block-editor ns-quote-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('data-placeholder', 'Empty quote');
      editor.innerHTML = block.content || '';
      quoteWrap.appendChild(editor);
      contentWrapper.appendChild(quoteWrap);
      break;
    }

    case 'divider': {
      const hr = createElement('div', 'ns-divider-line');
      hr.setAttribute('tabindex', '0');
      contentWrapper.appendChild(hr);
      break;
    }

    case 'code': {
      const codeWrap = createElement('div', 'ns-code-block-container');
      const header = createElement('div', 'ns-code-header');
      const lang = (block.metadata && block.metadata.language) || 'javascript';

      header.innerHTML = `
        <div class="ns-code-lang-select">
          <select class="ns-lang-dropdown">
            <option value="javascript" ${lang === 'javascript' ? 'selected' : ''}>JavaScript</option>
            <option value="typescript" ${lang === 'typescript' ? 'selected' : ''}>TypeScript</option>
            <option value="python" ${lang === 'python' ? 'selected' : ''}>Python</option>
            <option value="html" ${lang === 'html' ? 'selected' : ''}>HTML</option>
            <option value="css" ${lang === 'css' ? 'selected' : ''}>CSS</option>
            <option value="json" ${lang === 'json' ? 'selected' : ''}>JSON</option>
            <option value="sql" ${lang === 'sql' ? 'selected' : ''}>SQL</option>
            <option value="bash" ${lang === 'bash' ? 'selected' : ''}>Bash</option>
          </select>
        </div>
        <button class="ns-btn-copy-code" title="Copy code">
          ${Icons.copy} <span>Copy</span>
        </button>
      `;

      const editor = createElement('div', 'ns-block-editor ns-code-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('spellcheck', 'false');
      editor.setAttribute('data-placeholder', '// Type code here...');
      editor.innerText = block.content || '';

      const copyBtn = header.querySelector('.ns-btn-copy-code');
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(editor.innerText || '');
        copyBtn.querySelector('span').innerText = 'Copied!';
        setTimeout(() => {
          copyBtn.querySelector('span').innerText = 'Copy';
        }, 1500);
      });

      const langSelect = header.querySelector('.ns-lang-dropdown');
      langSelect.addEventListener('change', (e) => {
        onUpdate({
          ...block,
          metadata: { ...(block.metadata || {}), language: e.target.value }
        });
      });

      codeWrap.appendChild(header);
      codeWrap.appendChild(editor);
      contentWrapper.appendChild(codeWrap);
      break;
    }

    case 'callout': {
      const color = (block.metadata && block.metadata.color) || 'blue';
      const icon = (block.metadata && block.metadata.icon) || '💡';
      const calloutWrap = createElement('div', `ns-callout-block ns-callout-${color}`);

      const iconBtn = createElement('button', 'ns-callout-icon-btn', icon, {
        title: 'Change Icon'
      });

      const editor = createElement('div', 'ns-block-editor ns-callout-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('data-placeholder', 'Type a callout note...');
      editor.innerHTML = block.content || '';

      // Icon click menu
      iconBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showCalloutPicker(iconBtn, (newIcon, newColor) => {
          onUpdate({
            ...block,
            metadata: { ...(block.metadata || {}), icon: newIcon, color: newColor }
          });
        });
      });

      calloutWrap.appendChild(iconBtn);
      calloutWrap.appendChild(editor);
      contentWrapper.appendChild(calloutWrap);
      break;
    }

    case 'toggle': {
      const isOpen = block.metadata && block.metadata.isOpen;
      const toggleWrap = createElement('div', `ns-toggle-block ${isOpen ? 'is-open' : ''}`);

      const header = createElement('div', 'ns-toggle-header');
      const arrow = createElement('button', 'ns-toggle-arrow', Icons.chevronRight);
      const editor = createElement('div', 'ns-block-editor ns-toggle-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('data-placeholder', 'Toggle header');
      editor.innerHTML = block.content || '';

      header.appendChild(arrow);
      header.appendChild(editor);

      const body = createElement('div', 'ns-toggle-body');
      const childEditor = createElement('div', 'ns-toggle-child-editor');
      childEditor.contentEditable = 'true';
      childEditor.setAttribute('data-placeholder', 'Empty toggle. Type text inside...');
      childEditor.innerHTML = (block.metadata && block.metadata.children) || '';

      body.appendChild(childEditor);
      toggleWrap.appendChild(header);
      toggleWrap.appendChild(body);

      arrow.addEventListener('click', () => {
        const nextState = !toggleWrap.classList.contains('is-open');
        if (nextState) {
          toggleWrap.classList.add('is-open');
        } else {
          toggleWrap.classList.remove('is-open');
        }
        onUpdate({
          ...block,
          metadata: { ...(block.metadata || {}), isOpen: nextState }
        });
      });

      childEditor.addEventListener('input', () => {
        onUpdate({
          ...block,
          metadata: { ...(block.metadata || {}), children: childEditor.innerHTML }
        });
      });

      contentWrapper.appendChild(toggleWrap);
      break;
    }

    case 'table': {
      const tableContainer = createElement('div', 'ns-table-block-container');
      const rows = (block.metadata && block.metadata.rows) || [
        ['Header 1', 'Header 2', 'Header 3'],
        ['', '', '']
      ];

      const renderTableDOM = () => {
        tableContainer.innerHTML = '';

        const controls = createElement('div', 'ns-table-controls');
        controls.innerHTML = `
          <button class="ns-btn-sm ns-btn-add-row" title="Add Row">${Icons.plus} Add Row</button>
          <button class="ns-btn-sm ns-btn-add-col" title="Add Column">${Icons.plus} Add Column</button>
        `;

        const table = createElement('table', 'ns-table-element');
        const tbody = createElement('tbody');

        rows.forEach((row, rIdx) => {
          const tr = createElement('tr');
          row.forEach((cell, cIdx) => {
            const cellTag = rIdx === 0 ? 'th' : 'td';
            const td = createElement(cellTag, 'ns-table-cell');
            td.contentEditable = 'true';
            td.innerHTML = escapeHTML(cell);

            td.addEventListener('input', () => {
              rows[rIdx][cIdx] = td.innerText;
              onUpdate({
                ...block,
                metadata: { ...(block.metadata || {}), rows }
              });
            });

            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        tableContainer.appendChild(controls);
        tableContainer.appendChild(table);

        controls.querySelector('.ns-btn-add-row').addEventListener('click', () => {
          const newRow = new Array(rows[0].length).fill('');
          rows.push(newRow);
          onUpdate({ ...block, metadata: { ...(block.metadata || {}), rows } });
          renderTableDOM();
        });

        controls.querySelector('.ns-btn-add-col').addEventListener('click', () => {
          rows.forEach((r, idx) => {
            r.push(idx === 0 ? `Column ${r.length + 1}` : '');
          });
          onUpdate({ ...block, metadata: { ...(block.metadata || {}), rows } });
          renderTableDOM();
        });
      };

      renderTableDOM();
      contentWrapper.appendChild(tableContainer);
      break;
    }

    case 'image': {
      const imgContainer = createElement('div', 'ns-image-block-container');
      const url = block.content;
      const caption = (block.metadata && block.metadata.caption) || '';

      if (!url) {
        imgContainer.innerHTML = `
          <div class="ns-image-placeholder">
            <div class="ns-image-icon">${Icons.image}</div>
            <div class="ns-image-inputs">
              <input type="text" class="ns-input ns-img-url-input" placeholder="Paste image URL..." />
              <button class="ns-btn ns-btn-primary ns-btn-embed-img">Embed Image</button>
              <label class="ns-btn ns-btn-secondary ns-btn-upload-img">
                Upload File
                <input type="file" accept="image/*" style="display:none;" />
              </label>
            </div>
          </div>
        `;

        const urlInput = imgContainer.querySelector('.ns-img-url-input');
        const embedBtn = imgContainer.querySelector('.ns-btn-embed-img');
        const fileInput = imgContainer.querySelector('input[type="file"]');

        const applyUrl = (newUrl) => {
          if (!newUrl) return;
          onUpdate({
            ...block,
            content: newUrl
          });
        };

        embedBtn.addEventListener('click', () => applyUrl(urlInput.value.trim()));
        urlInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') applyUrl(urlInput.value.trim());
        });

        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (re) => applyUrl(re.target.result);
            reader.readAsDataURL(file);
          }
        });
      } else {
        imgContainer.innerHTML = `
          <div class="ns-image-view">
            <img src="${url}" alt="${caption}" class="ns-rendered-image" />
            <input type="text" class="ns-image-caption" placeholder="Add a caption..." value="${escapeHTML(caption)}" />
          </div>
        `;

        const captionInput = imgContainer.querySelector('.ns-image-caption');
        captionInput.addEventListener('input', (e) => {
          onUpdate({
            ...block,
            metadata: { ...(block.metadata || {}), caption: e.target.value }
          });
        });
      }

      contentWrapper.appendChild(imgContainer);
      break;
    }

    case 'bookmark': {
      const bookmarkWrap = createElement('div', 'ns-bookmark-container');
      const url = block.content;
      const title = (block.metadata && block.metadata.title) || url;
      const desc = (block.metadata && block.metadata.description) || 'Web link preview';
      const icon = (block.metadata && block.metadata.icon) || '🌐';

      if (!url) {
        bookmarkWrap.innerHTML = `
          <div class="ns-bookmark-input-wrap">
            <input type="text" class="ns-input ns-bookmark-url-input" placeholder="Paste a web bookmark URL..." />
            <button class="ns-btn ns-btn-primary ns-btn-create-bookmark">Add Bookmark</button>
          </div>
        `;

        const urlInp = bookmarkWrap.querySelector('.ns-bookmark-url-input');
        const addBtn = bookmarkWrap.querySelector('.ns-btn-create-bookmark');

        const saveBookmark = () => {
          const u = urlInp.value.trim();
          if (!u) return;
          try {
            const parsed = new URL(u);
            onUpdate({
              ...block,
              content: u,
              metadata: {
                title: parsed.hostname,
                description: `Link to ${parsed.hostname}`,
                icon: '🌐'
              }
            });
          } catch (e) {
            onUpdate({
              ...block,
              content: u,
              metadata: { title: u, description: 'Web Link', icon: '🌐' }
            });
          }
        };

        addBtn.addEventListener('click', saveBookmark);
        urlInp.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') saveBookmark();
        });
      } else {
        bookmarkWrap.innerHTML = `
          <a href="${url}" target="_blank" rel="noopener noreferrer" class="ns-bookmark-card">
            <div class="ns-bookmark-info">
              <div class="ns-bookmark-title">${escapeHTML(title)}</div>
              <div class="ns-bookmark-desc">${escapeHTML(desc)}</div>
              <div class="ns-bookmark-url">${Icons.link} ${escapeHTML(url)}</div>
            </div>
            <div class="ns-bookmark-icon">${icon}</div>
          </a>
        `;
      }

      contentWrapper.appendChild(bookmarkWrap);
      break;
    }

    case 'database': {
      const dbWrap = createElement('div', 'ns-database-block-wrapper');
      dbWrap.dataset.databaseId = (block.metadata && block.metadata.databaseId) || '';
      contentWrapper.appendChild(dbWrap);
      break;
    }

    default: {
      const editor = createElement('div', 'ns-block-editor');
      editor.contentEditable = 'true';
      editor.innerHTML = block.content || '';
      contentWrapper.appendChild(editor);
      break;
    }
  }

  blockEl.appendChild(contentWrapper);
  return blockEl;
}

/**
 * Callout Icon & Color Picker Popover
 */
function showCalloutPicker(targetBtn, onSelect) {
  // Remove existing pickers
  document.querySelectorAll('.ns-callout-picker-popover').forEach(p => p.remove());

  const popover = createElement('div', 'ns-callout-picker-popover');
  const icons = ['💡', '📌', '🚀', '⚡', '🔥', '⚠️', '⭐', '🎉', '📖', '🛡️', '💬', '❤️'];
  const colors = [
    { name: 'blue', label: 'Blue', hex: '#3b82f6' },
    { name: 'green', label: 'Green', hex: '#10b981' },
    { name: 'yellow', label: 'Yellow', hex: '#f59e0b' },
    { name: 'red', label: 'Red', hex: '#ef4444' },
    { name: 'purple', label: 'Purple', hex: '#8b5cf6' },
    { name: 'gray', label: 'Gray', hex: '#6b7280' }
  ];

  let selectedIcon = '💡';
  let selectedColor = 'blue';

  popover.innerHTML = `
    <div class="ns-picker-section">
      <div class="ns-picker-title">Icon</div>
      <div class="ns-icon-grid">
        ${icons.map(ic => `<button class="ns-icon-opt" data-icon="${ic}">${ic}</button>`).join('')}
      </div>
    </div>
    <div class="ns-picker-section">
      <div class="ns-picker-title">Color</div>
      <div class="ns-color-grid">
        ${colors.map(c => `<button class="ns-color-opt" data-color="${c.name}" style="background-color: ${c.hex}" title="${c.label}"></button>`).join('')}
      </div>
    </div>
  `;

  document.body.appendChild(popover);

  const rect = targetBtn.getBoundingClientRect();
  popover.style.top = `${rect.bottom + window.scrollY + 6}px`;
  popover.style.left = `${rect.left + window.scrollX}px`;

  popover.querySelectorAll('.ns-icon-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedIcon = btn.dataset.icon;
      onSelect(selectedIcon, selectedColor);
      popover.remove();
    });
  });

  popover.querySelectorAll('.ns-color-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedColor = btn.dataset.color;
      onSelect(selectedIcon, selectedColor);
      popover.remove();
    });
  });

  const closeHandler = (e) => {
    if (!popover.contains(e.target) && e.target !== targetBtn) {
      popover.remove();
      document.removeEventListener('click', closeHandler);
    }
  };
  setTimeout(() => document.addEventListener('click', closeHandler), 10);
}
