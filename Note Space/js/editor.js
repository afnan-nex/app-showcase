/**
 * NoteSpace - Block Editor Engine
 * Full-featured modular block editor with slash commands, floating toolbar,
 * drag-and-drop reordering, and markdown auto-formatting.
 */
class BlockEditor {
  constructor() {
    this.container = null;
    this.blocks = [];
    this.activeBlockId = null;
    this.draggedBlockId = null;
    this.dropTargetId = null;
    this.dropPosition = 'below'; // 'above' | 'below'
    this.slashMenu = null;
    this.slashMenuIndex = 0;
    this.currentFilteredSlashCommands = [];
    this.floatingToolbar = null;
    this.isComposing = false;
    this.blockContextMenu = null;

    this.slashCommands = [
      { id: 'paragraph', title: 'Text', desc: 'Just start writing with plain text.', icon: 'paragraph', category: 'Basic' },
      { id: 'h1', title: 'Heading 1', desc: 'Big section heading.', icon: 'h1', category: 'Basic' },
      { id: 'h2', title: 'Heading 2', desc: 'Medium section heading.', icon: 'h2', category: 'Basic' },
      { id: 'h3', title: 'Heading 3', desc: 'Small section heading.', icon: 'h3', category: 'Basic' },
      { id: 'bulletList', title: 'Bulleted List', desc: 'Create a simple bulleted list.', icon: 'bulletList', category: 'Lists' },
      { id: 'numberedList', title: 'Numbered List', desc: 'Create a list with numbering.', icon: 'numberedList', category: 'Lists' },
      { id: 'checkList', title: 'To-do List', desc: 'Track tasks with a to-do list.', icon: 'checkList', category: 'Lists' },
      { id: 'toggle', title: 'Toggle List', desc: 'Toggles hide and show content inside.', icon: 'toggle', category: 'Lists' },
      { id: 'code', title: 'Code Block', desc: 'Capture a code snippet with formatting.', icon: 'code', category: 'Advanced' },
      { id: 'quote', title: 'Quote', desc: 'Capture a quote or highlighted statement.', icon: 'quote', category: 'Basic' },
      { id: 'callout', title: 'Callout', desc: 'Make writing stand out with an icon.', icon: 'callout', category: 'Advanced' },
      { id: 'divider', title: 'Divider', desc: 'Visually divide sections with a line.', icon: 'divider', category: 'Basic' },
      { id: 'table', title: 'Inline Table', desc: 'Add a simple data table.', icon: 'table', category: 'Advanced' },
      { id: 'image', title: 'Image', desc: 'Upload or embed with a link.', icon: 'image', category: 'Media' },
      { id: 'bookmark', title: 'Web Bookmark', desc: 'Save a link as a visual web card.', icon: 'bookmark', category: 'Media' }
    ];

    this.init();
  }

  init() {
    this.createSlashMenuElement();
    this.createFloatingToolbarElement();
    this.createBlockContextMenuElement();
    this.attachGlobalEvents();
    State.on('blocks:restored', (blocks) => this.setBlocks(blocks));
  }

  mount(containerElement) {
    this.container = containerElement;
    if (this.blocks && this.blocks.length > 0) {
      this.render();
    }
  }

  setBlocks(blocks) {
    this.blocks = JSON.parse(JSON.stringify(blocks || []));
    if (this.blocks.length === 0) {
      this.blocks = [this.createNewBlock('paragraph', '')];
    }
    this.render();
  }

  getBlocks() {
    return this.blocks;
  }

  createNewBlock(type = 'paragraph', content = '', metadata = {}) {
    const defaultMeta = {
      checked: false,
      language: 'javascript',
      icon: '💡',
      color: 'blue',
      open: false,
      body: '',
      url: '',
      description: '',
      site: '',
      headers: ['Column 1', 'Column 2'],
      rows: [['', '']],
      src: '',
      caption: '',
      size: 'normal'
    };

    return {
      id: 'b_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      type,
      content,
      metadata: { ...defaultMeta, ...metadata },
      order: this.blocks.length,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  // --- Rendering ---
  render() {
    if (!this.container) return;
    this.container.innerHTML = '';

    const isLocked = State.activePage && State.activePage.isLocked;

    this.blocks.forEach((block, index) => {
      const blockEl = this.renderBlockElement(block, index, isLocked);
      this.container.appendChild(blockEl);
    });

    // Add empty bottom click area to easily add a block at bottom
    if (!isLocked) {
      const bottomArea = document.createElement('div');
      bottomArea.className = 'editor-bottom-area';
      bottomArea.addEventListener('click', (e) => {
        const lastBlock = this.blocks[this.blocks.length - 1];
        if (lastBlock && (!lastBlock.content || lastBlock.content === '') && lastBlock.type === 'paragraph') {
          this.focusBlock(lastBlock.id, 'start');
        } else {
          const newBlock = this.createNewBlock('paragraph', '');
          this.blocks.push(newBlock);
          this.render();
          this.focusBlock(newBlock.id, 'start');
          this.notifyChange();
        }
      });
      this.container.appendChild(bottomArea);
    }
  }

  renderBlockElement(block, index, isLocked) {
    const el = document.createElement('div');
    el.className = `editor-block block-${block.type}`;
    el.dataset.blockId = block.id;
    el.dataset.index = index;

    if (!isLocked) {
      el.setAttribute('draggable', 'true');
      this.attachDragEvents(el, block.id);
    }

    // Left Handle UI (Hover controls: + and 6-dot drag handle)
    if (!isLocked) {
      const handleWrap = document.createElement('div');
      handleWrap.className = 'block-handle-wrap';
      handleWrap.contentEditable = 'false';

      const addBtn = document.createElement('button');
      addBtn.className = 'block-add-btn';
      addBtn.title = 'Add block below';
      addBtn.innerHTML = Icons.get('plus', 'icon-xs', 14);
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.insertBlockAfter(block.id);
      });

      const dragHandle = document.createElement('button');
      dragHandle.className = 'block-drag-btn';
      dragHandle.title = 'Drag to move or click for options';
      dragHandle.innerHTML = Icons.get('dragHandle', 'icon-xs', 14);
      dragHandle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openBlockContextMenu(e, block.id);
      });

      handleWrap.appendChild(addBtn);
      handleWrap.appendChild(dragHandle);
      el.appendChild(handleWrap);
    }

    // Content element based on block type
    const contentWrap = document.createElement('div');
    contentWrap.className = 'block-content-wrap';
    contentWrap.addEventListener('click', (e) => {
      if (e.target === contentWrap) {
        const editable = contentWrap.querySelector('.editable-text, .editable-code');
        if (editable) editable.focus();
      }
    });

    switch (block.type) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'paragraph':
      case 'quote':
        this.renderRichTextBlock(contentWrap, block, isLocked);
        break;

      case 'bulletList':
        this.renderBulletBlock(contentWrap, block, isLocked);
        break;

      case 'numberedList':
        this.renderNumberedBlock(contentWrap, block, index, isLocked);
        break;

      case 'checkList':
        this.renderChecklistBlock(contentWrap, block, isLocked);
        break;

      case 'divider':
        this.renderDividerBlock(contentWrap, block, isLocked);
        break;

      case 'code':
        this.renderCodeBlock(contentWrap, block, isLocked);
        break;

      case 'callout':
        this.renderCalloutBlock(contentWrap, block, isLocked);
        break;

      case 'toggle':
        this.renderToggleBlock(contentWrap, block, isLocked);
        break;

      case 'table':
        this.renderTableBlock(contentWrap, block, isLocked);
        break;

      case 'image':
        this.renderImageBlock(contentWrap, block, isLocked);
        break;

      case 'bookmark':
        this.renderBookmarkBlock(contentWrap, block, isLocked);
        break;

      default:
        this.renderRichTextBlock(contentWrap, block, isLocked);
    }

    el.appendChild(contentWrap);
    return el;
  }

  // --- Specific Block Type Renderers ---

  renderRichTextBlock(container, block, isLocked) {
    const textEl = document.createElement('div');
    textEl.className = `editable-text block-type-${block.type}`;
    textEl.setAttribute('contenteditable', isLocked ? 'false' : 'true');
    textEl.innerHTML = block.content || '';
    textEl.dataset.placeholder = this.getPlaceholderForType(block.type);

    this.attachEditableEvents(textEl, block.id);
    container.appendChild(textEl);
  }

  renderBulletBlock(container, block, isLocked) {
    const bulletWrap = document.createElement('div');
    bulletWrap.className = 'list-item-wrap bullet-wrap';

    const bulletDot = document.createElement('span');
    bulletDot.className = 'bullet-dot';
    bulletDot.innerHTML = '•';

    const textEl = document.createElement('div');
    textEl.className = 'editable-text list-editable';
    textEl.setAttribute('contenteditable', isLocked ? 'false' : 'true');
    textEl.innerHTML = block.content || '';
    textEl.dataset.placeholder = 'List item';

    this.attachEditableEvents(textEl, block.id);

    bulletWrap.appendChild(bulletDot);
    bulletWrap.appendChild(textEl);
    container.appendChild(bulletWrap);
  }

  renderNumberedBlock(container, block, index, isLocked) {
    const numWrap = document.createElement('div');
    numWrap.className = 'list-item-wrap numbered-wrap';

    // Calculate sequential number
    let count = 1;
    for (let i = index - 1; i >= 0; i--) {
      if (this.blocks[i].type === 'numberedList') count++;
      else break;
    }

    const numLabel = document.createElement('span');
    numLabel.className = 'number-label';
    numLabel.textContent = `${count}.`;

    const textEl = document.createElement('div');
    textEl.className = 'editable-text list-editable';
    textEl.setAttribute('contenteditable', isLocked ? 'false' : 'true');
    textEl.innerHTML = block.content || '';
    textEl.dataset.placeholder = 'List item';

    this.attachEditableEvents(textEl, block.id);

    numWrap.appendChild(numLabel);
    numWrap.appendChild(textEl);
    container.appendChild(numWrap);
  }

  renderChecklistBlock(container, block, isLocked) {
    const isChecked = !!block.metadata?.checked;
    const checkWrap = document.createElement('div');
    checkWrap.className = `list-item-wrap checklist-wrap ${isChecked ? 'is-checked' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'block-checkbox';
    checkbox.checked = isChecked;
    checkbox.disabled = isLocked;

    checkbox.addEventListener('change', () => {
      block.metadata = { ...block.metadata, checked: checkbox.checked };
      checkWrap.classList.toggle('is-checked', checkbox.checked);
      this.notifyChange();
    });

    const textEl = document.createElement('div');
    textEl.className = 'editable-text checklist-editable';
    textEl.setAttribute('contenteditable', isLocked ? 'false' : 'true');
    textEl.innerHTML = block.content || '';
    textEl.dataset.placeholder = 'To-do item';

    this.attachEditableEvents(textEl, block.id);

    checkWrap.appendChild(checkbox);
    checkWrap.appendChild(textEl);
    container.appendChild(checkWrap);
  }

  renderDividerBlock(container, block, isLocked) {
    const hr = document.createElement('hr');
    hr.className = 'block-divider-line';
    container.appendChild(hr);
  }

  renderCodeBlock(container, block, isLocked) {
    const codeCard = document.createElement('div');
    codeCard.className = 'block-code-card';

    const header = document.createElement('div');
    header.className = 'code-card-header';

    const langSelect = document.createElement('select');
    langSelect.className = 'code-lang-select';
    langSelect.disabled = isLocked;
    const languages = ['javascript', 'typescript', 'python', 'html', 'css', 'json', 'sql', 'bash', 'markdown', 'go', 'rust'];
    
    languages.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l;
      opt.textContent = l;
      if (l === (block.metadata?.language || 'javascript')) opt.selected = true;
      langSelect.appendChild(opt);
    });

    langSelect.addEventListener('change', () => {
      block.metadata = { ...block.metadata, language: langSelect.value };
      this.notifyChange();
    });

    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-copy-btn';
    copyBtn.innerHTML = `${Icons.get('copy', 'icon-xs', 12)} <span>Copy</span>`;
    copyBtn.addEventListener('click', () => {
      const rawText = codeArea.innerText;
      navigator.clipboard.writeText(rawText);
      copyBtn.innerHTML = `${Icons.get('check', 'icon-xs', 12)} <span>Copied!</span>`;
      setTimeout(() => {
        copyBtn.innerHTML = `${Icons.get('copy', 'icon-xs', 12)} <span>Copy</span>`;
      }, 1500);
    });

    header.appendChild(langSelect);
    header.appendChild(copyBtn);

    const pre = document.createElement('pre');
    pre.className = 'code-pre';

    const codeArea = document.createElement('code');
    codeArea.className = 'editable-code';
    codeArea.setAttribute('contenteditable', isLocked ? 'false' : 'true');
    codeArea.innerText = block.content || '';

    codeArea.addEventListener('input', () => {
      block.content = codeArea.innerText;
      this.notifyChange();
    });

    codeArea.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        document.execCommand('insertText', false, '  ');
      }
    });

    pre.appendChild(codeArea);
    codeCard.appendChild(header);
    codeCard.appendChild(pre);
    container.appendChild(codeCard);
  }

  renderCalloutBlock(container, block, isLocked) {
    const color = block.metadata?.color || 'blue';
    const icon = block.metadata?.icon || '💡';

    const callout = document.createElement('div');
    callout.className = `block-callout-box callout-${color}`;

    const iconBtn = document.createElement('button');
    iconBtn.className = 'callout-icon-btn';
    iconBtn.textContent = icon;
    iconBtn.disabled = isLocked;
    iconBtn.addEventListener('click', (e) => {
      this.openCalloutCustomizer(e, block);
    });

    const textEl = document.createElement('div');
    textEl.className = 'editable-text callout-editable';
    textEl.setAttribute('contenteditable', isLocked ? 'false' : 'true');
    textEl.innerHTML = block.content || '';
    textEl.dataset.placeholder = 'Type callout message...';

    this.attachEditableEvents(textEl, block.id);

    callout.appendChild(iconBtn);
    callout.appendChild(textEl);
    container.appendChild(callout);
  }

  renderToggleBlock(container, block, isLocked) {
    const isOpen = !!block.metadata?.open;
    const toggle = document.createElement('div');
    toggle.className = `block-toggle-box ${isOpen ? 'is-open' : ''}`;

    const header = document.createElement('div');
    header.className = 'toggle-header';

    const arrowBtn = document.createElement('button');
    arrowBtn.className = 'toggle-arrow-btn';
    arrowBtn.innerHTML = Icons.get('chevronRight', 'icon-xs', 14);
    arrowBtn.addEventListener('click', () => {
      const nextOpen = !toggle.classList.contains('is-open');
      toggle.classList.toggle('is-open', nextOpen);
      block.metadata = { ...block.metadata, open: nextOpen };
      this.notifyChange();
    });

    const titleEl = document.createElement('div');
    titleEl.className = 'editable-text toggle-title-editable';
    titleEl.setAttribute('contenteditable', isLocked ? 'false' : 'true');
    titleEl.innerHTML = block.content || '';
    titleEl.dataset.placeholder = 'Toggle title';

    this.attachEditableEvents(titleEl, block.id);

    header.appendChild(arrowBtn);
    header.appendChild(titleEl);
    toggle.appendChild(header);

    const bodyWrap = document.createElement('div');
    bodyWrap.className = 'toggle-body-wrap';

    const bodyEl = document.createElement('div');
    bodyEl.className = 'editable-text toggle-body-editable';
    bodyEl.contentEditable = !isLocked;
    bodyEl.innerHTML = block.metadata?.body || '';
    bodyEl.dataset.placeholder = 'Toggle details...';

    bodyEl.addEventListener('input', () => {
      block.metadata = { ...block.metadata, body: bodyEl.innerHTML };
      this.notifyChange();
    });

    bodyWrap.appendChild(bodyEl);
    toggle.appendChild(bodyWrap);
    container.appendChild(toggle);
  }

  renderTableBlock(container, block, isLocked) {
    const meta = block.metadata || {};
    const headers = meta.headers && meta.headers.length ? meta.headers : ['Column 1', 'Column 2'];
    const rows = meta.rows && meta.rows.length ? meta.rows : [['', '']];

    const tableWrap = document.createElement('div');
    tableWrap.className = 'block-table-container';

    const table = document.createElement('table');
    table.className = 'block-inline-table';

    // Table Header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    headers.forEach((h, colIdx) => {
      const th = document.createElement('th');
      const thInput = document.createElement('div');
      thInput.className = 'table-th-editable';
      thInput.contentEditable = !isLocked;
      thInput.innerText = h;
      thInput.addEventListener('input', () => {
        headers[colIdx] = thInput.innerText;
        block.metadata = { ...meta, headers, rows };
        this.notifyChange();
      });
      th.appendChild(thInput);
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Table Body
    const tbody = document.createElement('tbody');
    rows.forEach((row, rowIdx) => {
      const tr = document.createElement('tr');
      headers.forEach((_, colIdx) => {
        const td = document.createElement('td');
        const tdInput = document.createElement('div');
        tdInput.className = 'table-cell-editable';
        tdInput.contentEditable = !isLocked;
        tdInput.innerText = row[colIdx] || '';
        tdInput.addEventListener('input', () => {
          if (!rows[rowIdx]) rows[rowIdx] = [];
          rows[rowIdx][colIdx] = tdInput.innerText;
          block.metadata = { ...meta, headers, rows };
          this.notifyChange();
        });
        td.appendChild(tdInput);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableWrap.appendChild(table);

    // Tools to Add Column and Row
    if (!isLocked) {
      const tools = document.createElement('div');
      tools.className = 'table-tools-bar';

      const addRowBtn = document.createElement('button');
      addRowBtn.className = 'table-tool-btn';
      addRowBtn.innerHTML = `${Icons.get('plus', 'icon-xs', 12)} Add Row`;
      addRowBtn.addEventListener('click', () => {
        const newRow = new Array(headers.length).fill('');
        rows.push(newRow);
        block.metadata = { ...meta, headers, rows };
        this.render();
        this.notifyChange();
      });

      const addColBtn = document.createElement('button');
      addColBtn.className = 'table-tool-btn';
      addColBtn.innerHTML = `${Icons.get('plus', 'icon-xs', 12)} Add Column`;
      addColBtn.addEventListener('click', () => {
        headers.push(`Column ${headers.length + 1}`);
        rows.forEach(r => r.push(''));
        block.metadata = { ...meta, headers, rows };
        this.render();
        this.notifyChange();
      });

      const delRowBtn = document.createElement('button');
      delRowBtn.className = 'table-tool-btn';
      delRowBtn.innerHTML = `${Icons.get('trash', 'icon-xs', 12)} Remove Row`;
      delRowBtn.addEventListener('click', () => {
        if (rows.length > 1) {
          rows.pop();
          block.metadata = { ...meta, headers, rows };
          this.render();
          this.notifyChange();
        }
      });

      const delColBtn = document.createElement('button');
      delColBtn.className = 'table-tool-btn';
      delColBtn.innerHTML = `${Icons.get('trash', 'icon-xs', 12)} Remove Column`;
      delColBtn.addEventListener('click', () => {
        if (headers.length > 1) {
          headers.pop();
          rows.forEach(r => r.pop());
          block.metadata = { ...meta, headers, rows };
          this.render();
          this.notifyChange();
        }
      });

      tools.appendChild(addRowBtn);
      tools.appendChild(addColBtn);
      if (rows.length > 1) tools.appendChild(delRowBtn);
      if (headers.length > 1) tools.appendChild(delColBtn);
      tableWrap.appendChild(tools);
    }

    container.appendChild(tableWrap);
  }

  renderImageBlock(container, block, isLocked) {
    const src = block.metadata?.src || '';
    const caption = block.metadata?.caption || '';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'block-image-card';

    if (!src) {
      const placeholder = document.createElement('div');
      placeholder.className = 'image-input-box empty-image-placeholder';
      placeholder.innerHTML = `
        <div class="image-box-icon">${Icons.get('image', 'icon-lg', 32)}</div>
        <div class="image-box-title">Add an Image</div>
        <div class="image-input-row">
          <input type="text" class="image-url-input" placeholder="Paste image URL..." />
          <button class="image-embed-btn btn-sm btn-primary">Embed Link</button>
          <label class="image-upload-btn btn-sm btn-outline">
            Upload File
            <input type="file" accept="image/*" class="image-file-hidden" style="display:none;" />
          </label>
        </div>
      `;

      const urlInput = placeholder.querySelector('.image-url-input');
      const embedBtn = placeholder.querySelector('.image-embed-btn');
      const fileInput = placeholder.querySelector('.image-file-hidden');

      embedBtn.addEventListener('click', () => {
        if (urlInput.value.trim()) {
          block.metadata = { ...block.metadata, src: urlInput.value.trim() };
          this.render();
          this.notifyChange();
        }
      });

      urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') embedBtn.click();
      });

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (loadEvt) => {
            block.metadata = { ...block.metadata, src: loadEvt.target.result };
            this.render();
            this.notifyChange();
          };
          reader.readAsDataURL(file);
        }
      });

      imgWrap.appendChild(placeholder);
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.className = 'rendered-block-img';
      img.alt = caption || 'Embedded Image';

      const captionEl = document.createElement('div');
      captionEl.className = 'image-caption-editable';
      captionEl.contentEditable = !isLocked;
      captionEl.innerText = caption;
      captionEl.dataset.placeholder = 'Write a caption...';
      captionEl.addEventListener('input', () => {
        block.metadata = { ...block.metadata, caption: captionEl.innerText };
        this.notifyChange();
      });

      if (!isLocked) {
        const replaceBtn = document.createElement('button');
        replaceBtn.className = 'image-replace-btn';
        replaceBtn.textContent = 'Replace';
        replaceBtn.addEventListener('click', () => {
          block.metadata = { ...block.metadata, src: '' };
          this.render();
          this.notifyChange();
        });
        imgWrap.appendChild(replaceBtn);
      }

      imgWrap.appendChild(img);
      imgWrap.appendChild(captionEl);
    }

    container.appendChild(imgWrap);
  }

  renderBookmarkBlock(container, block, isLocked) {
    const url = block.metadata?.url || '';
    const title = block.content || block.metadata?.title || 'Web Bookmark';
    const desc = block.metadata?.description || url;

    const card = document.createElement('div');
    card.className = 'block-bookmark-card';

    if (!url) {
      card.innerHTML = `
        <div class="image-input-box" style="width:100%;">
          <div class="image-box-icon">${Icons.get('link', 'icon-lg', 30)}</div>
          <div class="image-box-title">Add Web Bookmark</div>
          <div class="image-input-row">
            <input type="text" class="bookmark-url-input image-url-input" placeholder="Paste link (https://...)" />
            <button class="btn-sm btn-primary bookmark-apply-btn">Save Bookmark</button>
          </div>
        </div>
      `;

      const input = card.querySelector('.bookmark-url-input');
      const btn = card.querySelector('.bookmark-apply-btn');

      const apply = () => {
        const val = input.value.trim();
        if (val) {
          block.metadata = { ...block.metadata, url: val, title: val, description: 'External web bookmark' };
          block.content = val;
          this.render();
          this.notifyChange();
        }
      };

      btn.addEventListener('click', apply);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') apply(); });
    } else {
      card.innerHTML = `
        <div class="bookmark-info">
          <div class="bookmark-title">${title}</div>
          <div class="bookmark-desc">${desc}</div>
          <div class="bookmark-url-row">
            ${Icons.get('link', 'icon-xs', 12)}
            <span>${url}</span>
          </div>
        </div>
        <div class="bookmark-preview-box">
          ${Icons.get('globe', 'icon-lg', 24)}
        </div>
      `;

      card.addEventListener('click', () => {
        const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : 'https://' + url;
        window.open(fullUrl, '_blank');
      });
    }

    container.appendChild(card);
  }

  // --- Editable Text Events ---

  attachEditableEvents(element, blockId) {
    element.addEventListener('compositionstart', () => { this.isComposing = true; });
    element.addEventListener('compositionend', () => { this.isComposing = false; });

    element.addEventListener('input', () => {
      if (this.isComposing) return;
      const block = this.blocks.find(b => b.id === blockId);
      if (!block) return;

      const rawHtml = element.innerHTML;
      const text = element.innerText;

      // Check Markdown auto-conversion triggers
      if (this.checkMarkdownShortcuts(element, block, text)) {
        return;
      }

      // Check Slash command trigger
      if (text.startsWith('/')) {
        const query = text.substring(1).trim();
        this.openSlashMenu(element, blockId, query);
      } else {
        this.closeSlashMenu();
      }

      block.content = rawHtml;
      this.notifyChange();
    });

    element.addEventListener('keydown', (e) => {
      const block = this.blocks.find(b => b.id === blockId);
      if (!block) return;

      // Slash Menu Keyboard Navigation
      if (this.slashMenu && this.slashMenu.classList.contains('is-visible')) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.navigateSlashMenu(1);
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.navigateSlashMenu(-1);
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          this.selectSlashMenuItem();
          return;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          this.closeSlashMenu();
          return;
        }
      }

      // Enter Key Behavior
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleEnterKey(element, block);
        return;
      }

      // Backspace Key Behavior
      if (e.key === 'Backspace') {
        const selection = window.getSelection();
        if (selection && selection.anchorOffset === 0 && (element.innerText.trim() === '' || selection.focusOffset === 0)) {
          if (block.type !== 'paragraph') {
            e.preventDefault();
            this.convertBlockType(block.id, 'paragraph');
            return;
          }
          if (this.blocks.length > 1) {
            e.preventDefault();
            this.deleteBlockAndFocusPrev(block.id);
            return;
          }
        }
      }

      // Arrow Up & Down Navigation Across Blocks
      if (e.key === 'ArrowUp') {
        const selection = window.getSelection();
        if (selection && selection.anchorOffset === 0) {
          const idx = this.blocks.findIndex(b => b.id === blockId);
          if (idx > 0) {
            e.preventDefault();
            this.focusBlock(this.blocks[idx - 1].id, 'end');
          }
        }
      }

      if (e.key === 'ArrowDown') {
        const selection = window.getSelection();
        const len = element.innerText.length;
        if (selection && selection.anchorOffset >= len) {
          const idx = this.blocks.findIndex(b => b.id === blockId);
          if (idx < this.blocks.length - 1) {
            e.preventDefault();
            this.focusBlock(this.blocks[idx + 1].id, 'start');
          }
        }
      }

      // Duplicate shortcut Ctrl+D
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        this.duplicateBlock(block.id);
      }
    });

    // Selection formatting popup
    element.addEventListener('mouseup', () => {
      setTimeout(() => this.checkSelectionToolbar(), 50);
    });
    element.addEventListener('keyup', () => {
      setTimeout(() => this.checkSelectionToolbar(), 50);
    });
  }

  checkMarkdownShortcuts(element, block, text) {
    const shortcuts = [
      { pattern: /^#\s(.*)/, type: 'h1' },
      { pattern: /^##\s(.*)/, type: 'h2' },
      { pattern: /^###\s(.*)/, type: 'h3' },
      { pattern: /^>\s(.*)/, type: 'quote' },
      { pattern: /^[-*]\s(.*)/, type: 'bulletList' },
      { pattern: /^1\.\s(.*)/, type: 'numberedList' },
      { pattern: /^\[\]\s(.*)/, type: 'checkList' },
      { pattern: /^\[\s\]\s(.*)/, type: 'checkList' },
      { pattern: /^```(\w*)\s?$/, type: 'code' },
      { pattern: /^---\s?$/, type: 'divider' }
    ];

    for (const sc of shortcuts) {
      const match = text.match(sc.pattern);
      if (match) {
        const extractedContent = match[1] || '';
        block.type = sc.type;
        block.content = extractedContent;
        if (sc.type === 'code' && match[1]) {
          block.metadata = { ...block.metadata, language: match[1] };
          block.content = '';
        }
        this.render();
        this.focusBlock(block.id, 'end');
        this.notifyChange();
        return true;
      }
    }
    return false;
  }

  handleEnterKey(element, block) {
    const idx = this.blocks.findIndex(b => b.id === block.id);
    if (idx === -1) return;

    // If we're inside an empty list item, convert back to paragraph
    if (['bulletList', 'numberedList', 'checkList'].includes(block.type) && element.innerText.trim() === '') {
      this.convertBlockType(block.id, 'paragraph');
      return;
    }

    // Determine type of new block
    let newType = 'paragraph';
    if (['bulletList', 'numberedList', 'checkList'].includes(block.type)) {
      newType = block.type;
    }

    // Extract text before and after cursor if possible
    let afterContent = '';
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      try {
        const range = sel.getRangeAt(0);
        const preRange = range.cloneRange();
        preRange.selectNodeContents(element);
        preRange.setEnd(range.startContainer, range.startOffset);

        const postRange = range.cloneRange();
        postRange.selectNodeContents(element);
        postRange.setStart(range.endContainer, range.endOffset);

        const tempPre = document.createElement('div');
        tempPre.appendChild(preRange.cloneContents());
        block.content = tempPre.innerHTML;

        const tempPost = document.createElement('div');
        tempPost.appendChild(postRange.cloneContents());
        afterContent = tempPost.innerHTML;
      } catch (e) {
        // fallback
      }
    }

    const newBlock = this.createNewBlock(newType, afterContent);
    this.blocks.splice(idx + 1, 0, newBlock);
    this.render();
    this.focusBlock(newBlock.id, 'start');
    this.notifyChange();
  }

  insertBlockAfter(blockId, type = 'paragraph') {
    const idx = this.blocks.findIndex(b => b.id === blockId);
    const newBlock = this.createNewBlock(type, '');
    if (idx >= 0) {
      this.blocks.splice(idx + 1, 0, newBlock);
    } else {
      this.blocks.push(newBlock);
    }
    this.render();
    this.focusBlock(newBlock.id);
    this.notifyChange();
  }

  duplicateBlock(blockId) {
    const idx = this.blocks.findIndex(b => b.id === blockId);
    if (idx === -1) return;
    const orig = this.blocks[idx];
    const cloned = JSON.parse(JSON.stringify(orig));
    cloned.id = 'b_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    this.blocks.splice(idx + 1, 0, cloned);
    this.render();
    this.focusBlock(cloned.id);
    this.notifyChange();
  }

  deleteBlock(blockId) {
    const idx = this.blocks.findIndex(b => b.id === blockId);
    if (idx === -1) return;

    this.blocks.splice(idx, 1);
    if (this.blocks.length === 0) {
      this.blocks = [this.createNewBlock('paragraph', '')];
    }
    this.render();
    const prevIdx = Math.max(0, idx - 1);
    this.focusBlock(this.blocks[prevIdx].id);
    this.notifyChange();
  }

  deleteBlockAndFocusPrev(blockId) {
    const idx = this.blocks.findIndex(b => b.id === blockId);
    if (idx <= 0) return;
    const currentBlock = this.blocks[idx];
    const prevBlock = this.blocks[idx - 1];

    if (currentBlock.content && ['paragraph', 'h1', 'h2', 'h3', 'quote', 'bulletList', 'numberedList', 'checkList'].includes(prevBlock.type)) {
      prevBlock.content = (prevBlock.content || '') + currentBlock.content;
    }

    this.blocks.splice(idx, 1);
    this.render();
    this.focusBlock(prevBlock.id, 'end');
    this.notifyChange();
  }

  convertBlockType(blockId, newType) {
    const idx = this.blocks.findIndex(b => b.id === blockId);
    if (idx === -1) return;
    const block = this.blocks[idx];
    block.type = newType;

    // Ensure metadata defaults exist
    if (!block.metadata) block.metadata = {};
    if (newType === 'table') {
      if (!block.metadata.headers || !block.metadata.headers.length) {
        block.metadata.headers = ['Column 1', 'Column 2'];
      }
      if (!block.metadata.rows || !block.metadata.rows.length) {
        block.metadata.rows = [['', '']];
      }
    } else if (newType === 'callout') {
      if (!block.metadata.icon) block.metadata.icon = '💡';
      if (!block.metadata.color) block.metadata.color = 'blue';
    } else if (newType === 'toggle') {
      if (block.metadata.open === undefined) block.metadata.open = true;
    }

    // If converted to divider, create a paragraph after it if at the end
    if (newType === 'divider' && idx === this.blocks.length - 1) {
      const nextBlock = this.createNewBlock('paragraph', '');
      this.blocks.splice(idx + 1, 0, nextBlock);
      this.render();
      this.focusBlock(nextBlock.id, 'start');
      this.notifyChange();
      return;
    }

    this.render();
    this.focusBlock(block.id, 'end');
    this.notifyChange();
  }

  focusBlock(blockId, position = 'end') {
    requestAnimationFrame(() => {
      if (!this.container) return;
      const blockEl = this.container.querySelector(`[data-block-id="${blockId}"]`);
      if (!blockEl) return;
      const editable = blockEl.querySelector('.editable-text, .editable-code');
      if (editable) {
        editable.focus();
        try {
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(editable);
          range.collapse(position !== 'start');
          sel.removeAllRanges();
          sel.addRange(range);
        } catch (e) {
          // fallback
        }
      }
    });
  }

  // --- Drag and Drop Block Reordering ---

  attachDragEvents(el, blockId) {
    el.addEventListener('dragstart', (e) => {
      this.draggedBlockId = blockId;
      el.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', blockId);
    });

    el.addEventListener('dragend', () => {
      el.classList.remove('is-dragging');
      this.clearDropIndicators();
    });

    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (!this.draggedBlockId || this.draggedBlockId === blockId) return;

      const rect = el.getBoundingClientRect();
      const relY = e.clientY - rect.top;
      const isTop = relY < rect.height / 2;

      this.clearDropIndicators();
      this.dropTargetId = blockId;
      this.dropPosition = isTop ? 'above' : 'below';

      if (isTop) {
        el.classList.add('drop-indicator-top');
      } else {
        el.classList.add('drop-indicator-bottom');
      }
    });

    el.addEventListener('drop', (e) => {
      e.preventDefault();
      this.clearDropIndicators();
      if (!this.draggedBlockId || !this.dropTargetId || this.draggedBlockId === this.dropTargetId) return;

      const fromIdx = this.blocks.findIndex(b => b.id === this.draggedBlockId);
      let toIdx = this.blocks.findIndex(b => b.id === this.dropTargetId);

      if (fromIdx === -1 || toIdx === -1) return;

      const [draggedItem] = this.blocks.splice(fromIdx, 1);
      if (this.dropPosition === 'below' && fromIdx < toIdx) toIdx--;
      if (this.dropPosition === 'below') toIdx++;

      this.blocks.splice(toIdx, 0, draggedItem);
      this.render();
      this.notifyChange();
    });
  }

  clearDropIndicators() {
    if (!this.container) return;
    this.container.querySelectorAll('.drop-indicator-top, .drop-indicator-bottom').forEach(el => {
      el.classList.remove('drop-indicator-top', 'drop-indicator-bottom');
    });
  }

  // --- Slash Command Menu ---

  createSlashMenuElement() {
    this.slashMenu = document.createElement('div');
    this.slashMenu.className = 'slash-command-menu';
    document.body.appendChild(this.slashMenu);
  }

  openSlashMenu(targetElement, blockId, query = '') {
    const rect = targetElement.getBoundingClientRect();
    this.activeBlockId = blockId;

    const filtered = this.slashCommands.filter(c => {
      const q = query.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      this.closeSlashMenu();
      return;
    }

    this.currentFilteredSlashCommands = filtered;
    this.slashMenuIndex = 0;
    this.renderSlashMenuItems(filtered);

    this.slashMenu.style.top = `${rect.bottom + window.scrollY + 4}px`;
    this.slashMenu.style.left = `${Math.min(window.innerWidth - 300, Math.max(10, rect.left + window.scrollX))}px`;
    this.slashMenu.classList.add('is-visible');
  }

  renderSlashMenuItems(items) {
    this.slashMenu.innerHTML = '<div class="slash-menu-header">BASIC BLOCKS</div>';
    
    items.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = `slash-menu-item ${idx === this.slashMenuIndex ? 'is-selected' : ''}`;
      el.innerHTML = `
        <div class="slash-item-icon">${Icons.get(item.icon, 'icon-md', 18)}</div>
        <div class="slash-item-text">
          <div class="slash-item-title">${item.title}</div>
          <div class="slash-item-desc">${item.desc}</div>
        </div>
      `;

      el.addEventListener('click', () => {
        this.slashMenuIndex = idx;
        this.selectSlashMenuItem();
      });

      this.slashMenu.appendChild(el);
    });
  }

  navigateSlashMenu(delta) {
    const items = this.slashMenu.querySelectorAll('.slash-menu-item');
    if (items.length === 0) return;

    items[this.slashMenuIndex]?.classList.remove('is-selected');
    this.slashMenuIndex = (this.slashMenuIndex + delta + items.length) % items.length;
    items[this.slashMenuIndex]?.classList.add('is-selected');
    items[this.slashMenuIndex]?.scrollIntoView({ block: 'nearest' });
  }

  selectSlashMenuItem() {
    const list = this.currentFilteredSlashCommands && this.currentFilteredSlashCommands.length > 0
      ? this.currentFilteredSlashCommands
      : this.slashCommands;

    const selectedCommand = list[this.slashMenuIndex] || list[0];
    if (selectedCommand && this.activeBlockId) {
      const block = this.blocks.find(b => b.id === this.activeBlockId);
      if (block) {
        this.convertBlockType(block.id, selectedCommand.id);
        block.content = ''; // Clear slash query text
        this.render();
        this.focusBlock(block.id, 'start');
        this.notifyChange();
      }
    }
    this.closeSlashMenu();
  }

  closeSlashMenu() {
    if (this.slashMenu) {
      this.slashMenu.classList.remove('is-visible');
    }
  }

  // --- Floating Selection Toolbar ---

  createFloatingToolbarElement() {
    this.floatingToolbar = document.createElement('div');
    this.floatingToolbar.className = 'floating-format-toolbar';
    this.floatingToolbar.innerHTML = `
      <button data-cmd="bold" title="Bold (Ctrl+B)">${Icons.get('bold', 'icon-xs', 14)}</button>
      <button data-cmd="italic" title="Italic (Ctrl+I)">${Icons.get('italic', 'icon-xs', 14)}</button>
      <button data-cmd="underline" title="Underline (Ctrl+U)">${Icons.get('underline', 'icon-xs', 14)}</button>
      <button data-cmd="strikeThrough" title="Strikethrough">${Icons.get('strike', 'icon-xs', 14)}</button>
      <div class="toolbar-sep"></div>
      <button data-cmd="code" title="Inline Code">${Icons.get('code', 'icon-xs', 14)}</button>
      <button data-cmd="createLink" title="Link">${Icons.get('link', 'icon-xs', 14)}</button>
      <div class="toolbar-sep"></div>
      <button data-cmd="highlight" title="Highlight">${Icons.get('sparkles', 'icon-xs', 14)}</button>
    `;

    this.floatingToolbar.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const cmd = btn.dataset.cmd;
        this.executeFormatCommand(cmd);
      });
    });

    document.body.appendChild(this.floatingToolbar);
  }

  checkSelectionToolbar() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.toString().trim() === '') {
      if (this.floatingToolbar) this.floatingToolbar.classList.remove('is-visible');
      return;
    }

    // Ensure selection is within block editor
    const anchorNode = sel.anchorNode;
    if (!anchorNode || !this.container || !this.container.contains(anchorNode)) {
      if (this.floatingToolbar) this.floatingToolbar.classList.remove('is-visible');
      return;
    }

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    this.floatingToolbar.style.top = `${rect.top + window.scrollY - 44}px`;
    this.floatingToolbar.style.left = `${Math.max(10, rect.left + window.scrollX + rect.width / 2 - 120)}px`;
    this.floatingToolbar.classList.add('is-visible');
  }

  executeFormatCommand(cmd) {
    const sel = window.getSelection();
    let targetBlock = null;
    let targetEl = null;

    if (sel && sel.anchorNode) {
      const blockEl = sel.anchorNode.nodeType === 1
        ? sel.anchorNode.closest('.editor-block')
        : sel.anchorNode.parentElement?.closest('.editor-block');
      if (blockEl) {
        const bId = blockEl.dataset.blockId;
        targetBlock = this.blocks.find(b => b.id === bId);
        targetEl = blockEl.querySelector('.editable-text, .editable-code');
      }
    }

    if (cmd === 'createLink') {
      const url = prompt('Enter URL:', 'https://');
      if (url) {
        document.execCommand('createLink', false, url);
      }
    } else if (cmd === 'code') {
      if (sel && sel.rangeCount) {
        const text = sel.toString();
        document.execCommand('insertHTML', false, `<code>${text}</code>`);
      }
    } else if (cmd === 'highlight') {
      document.execCommand('hiliteColor', false, '#fef08a');
    } else {
      document.execCommand(cmd, false, null);
    }

    if (targetBlock && targetEl) {
      targetBlock.content = targetEl.innerHTML;
    }
    this.notifyChange();
  }

  // --- Block Context Menu (6-dot Click) ---

  createBlockContextMenuElement() {
    this.blockContextMenu = document.createElement('div');
    this.blockContextMenu.className = 'block-context-menu';
    document.body.appendChild(this.blockContextMenu);
  }

  openBlockContextMenu(e, blockId) {
    const block = this.blocks.find(b => b.id === blockId);
    if (!block) return;

    this.blockContextMenu.innerHTML = `
      <div class="menu-group">
        <div class="menu-label">Turn into</div>
        <div class="turn-into-grid">
          <button class="turn-item" data-type="paragraph">${Icons.get('paragraph', 'icon-xs', 13)} Text</button>
          <button class="turn-item" data-type="h1">${Icons.get('h1', 'icon-xs', 13)} H1</button>
          <button class="turn-item" data-type="h2">${Icons.get('h2', 'icon-xs', 13)} H2</button>
          <button class="turn-item" data-type="h3">${Icons.get('h3', 'icon-xs', 13)} H3</button>
          <button class="turn-item" data-type="bulletList">${Icons.get('bulletList', 'icon-xs', 13)} Bullet</button>
          <button class="turn-item" data-type="checkList">${Icons.get('checkList', 'icon-xs', 13)} To-do</button>
          <button class="turn-item" data-type="quote">${Icons.get('quote', 'icon-xs', 13)} Quote</button>
          <button class="turn-item" data-type="code">${Icons.get('code', 'icon-xs', 13)} Code</button>
          <button class="turn-item" data-type="callout">${Icons.get('callout', 'icon-xs', 13)} Callout</button>
          <button class="turn-item" data-type="toggle">${Icons.get('toggle', 'icon-xs', 13)} Toggle</button>
        </div>
      </div>
      <div class="menu-divider"></div>
      <button class="menu-action-btn" data-act="duplicate">${Icons.get('copy', 'icon-sm', 14)} Duplicate <span>Ctrl+D</span></button>
      <button class="menu-action-btn" data-act="delete" style="color:var(--color-danger);">${Icons.get('trash', 'icon-sm', 14)} Delete <span>Del</span></button>
    `;

    this.blockContextMenu.querySelectorAll('.turn-item').forEach(btn => {
      btn.addEventListener('click', () => {
        this.convertBlockType(blockId, btn.dataset.type);
        this.closeBlockContextMenu();
      });
    });

    this.blockContextMenu.querySelector('[data-act="duplicate"]')?.addEventListener('click', () => {
      this.duplicateBlock(blockId);
      this.closeBlockContextMenu();
    });

    this.blockContextMenu.querySelector('[data-act="delete"]')?.addEventListener('click', () => {
      this.deleteBlock(blockId);
      this.closeBlockContextMenu();
    });

    const rect = e.target.getBoundingClientRect();
    this.blockContextMenu.style.top = `${rect.bottom + window.scrollY + 4}px`;
    this.blockContextMenu.style.left = `${Math.min(window.innerWidth - 240, rect.left + window.scrollX)}px`;
    this.blockContextMenu.classList.add('is-visible');
  }

  closeBlockContextMenu() {
    if (this.blockContextMenu) {
      this.blockContextMenu.classList.remove('is-visible');
    }
  }

  openCalloutCustomizer(e, block) {
    const emojis = ['💡', '🚀', '⚠️', '✨', '🔥', '📌', '🎯', '📐', '🛡️', '💬', '🎉'];
    const colors = ['blue', 'emerald', 'purple', 'amber', 'rose', 'slate'];

    const popover = document.createElement('div');
    popover.className = 'callout-customizer-popover';
    
    let emojiHtml = '<div class="emoji-grid">';
    emojis.forEach(em => {
      emojiHtml += `<button class="emoji-opt-btn ${block.metadata?.icon === em ? 'is-active' : ''}">${em}</button>`;
    });
    emojiHtml += '</div>';

    let colorHtml = '<div class="color-palette-row">';
    colors.forEach(col => {
      colorHtml += `<button class="color-dot-btn bg-${col} ${block.metadata?.color === col ? 'is-active' : ''}" data-color="${col}"></button>`;
    });
    colorHtml += '</div>';

    popover.innerHTML = `
      <div class="popover-title">Icon & Theme</div>
      ${emojiHtml}
      ${colorHtml}
    `;

    popover.querySelectorAll('.emoji-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        block.metadata = { ...block.metadata, icon: btn.textContent };
        this.render();
        this.notifyChange();
        popover.remove();
      });
    });

    popover.querySelectorAll('.color-dot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        block.metadata = { ...block.metadata, color: btn.dataset.color };
        this.render();
        this.notifyChange();
        popover.remove();
      });
    });

    const rect = e.target.getBoundingClientRect();
    popover.style.top = `${rect.bottom + window.scrollY + 6}px`;
    popover.style.left = `${Math.max(10, rect.left + window.scrollX)}px`;

    document.body.appendChild(popover);

    const closeHandler = (evt) => {
      if (!popover.contains(evt.target)) {
        popover.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }

  attachGlobalEvents() {
    document.addEventListener('click', (e) => {
      if (this.slashMenu && !this.slashMenu.contains(e.target)) {
        this.closeSlashMenu();
      }
      if (this.blockContextMenu && !this.blockContextMenu.contains(e.target)) {
        this.closeBlockContextMenu();
      }
    });

    document.addEventListener('selectionchange', () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        if (this.floatingToolbar) this.floatingToolbar.classList.remove('is-visible');
      }
    });
  }

  getPlaceholderForType(type) {
    switch (type) {
      case 'h1': return 'Heading 1';
      case 'h2': return 'Heading 2';
      case 'h3': return 'Heading 3';
      case 'quote': return 'Empty quote';
      default: return 'Type / for commands...';
    }
  }

  notifyChange() {
    State.updateBlocks(this.blocks);
  }
}

window.BlockEditor = BlockEditor;
