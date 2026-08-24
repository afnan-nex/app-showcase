/**
 * NoteSpace - Core Document Block Editor
 * Orchestrates block rendering, typography, caret flows, keyboard shortcuts, covers, icons, and menus.
 */

import { store } from '../state/store.js';
import { Icons, getIcon } from '../icons/icons.js';
import { BLOCK_DEFINITIONS, renderBlockElement, getBlockDefinition } from './blocks.js';
import { SlashMenu } from './slashMenu.js';
import { InlineToolbar } from './inlineToolbar.js';
import { BlockDragDrop } from './dragDrop.js';
import { createElement, escapeHTML, setCaretPosition, formatDate } from '../utils/dom.js';

export class Editor {
  constructor(containerEl, onDatabaseMount) {
    this.container = containerEl;
    this.onDatabaseMount = onDatabaseMount;
    this.currentPage = null;
    this.blocksContainer = null;
    this.slashMenu = null;
    this.inlineToolbar = null;
    this.dragDrop = null;
    this.activeBlockId = null;

    this.init();
  }

  init() {
    this.inlineToolbar = new InlineToolbar();
    this.slashMenu = new SlashMenu((selectedDef, targetBlockEl) => {
      this.handleSlashSelect(selectedDef, targetBlockEl);
    });

    // Listen to store updates
    store.on('active-page-changed', (page) => this.loadPage(page));
    store.on('page-restored-revision', (page) => {
      if (this.currentPage && this.currentPage.id === page.id) {
        this.loadPage(page);
      }
    });
  }

  loadPage(page) {
    this.currentPage = page;
    if (!page) {
      this.renderEmptyState();
      return;
    }
    this.render();
  }

  renderEmptyState() {
    this.container.innerHTML = `
      <div class="ns-editor-empty-state">
        <div class="ns-empty-icon">${Icons.logo}</div>
        <h2>No Page Selected</h2>
        <p>Select a page from the sidebar or create a new one to start writing.</p>
        <button class="ns-btn ns-btn-primary" id="btn-create-first-page">
          ${Icons.plus} Create New Page
        </button>
      </div>
    `;
    const btn = this.container.querySelector('#btn-create-first-page');
    if (btn) {
      btn.addEventListener('click', () => store.createPage({ title: 'Untitled' }));
    }
  }

  render() {
    this.container.innerHTML = '';
    const page = this.currentPage;
    if (!page) return;

    const pageWrapper = createElement('div', 'ns-editor-page-wrapper');

    // 1. Cover Image Section
    const coverSection = createElement('div', `ns-page-cover-container ${page.cover ? 'has-cover' : ''}`);
    if (page.cover) {
      if (page.cover.startsWith('linear-gradient') || page.cover.startsWith('#')) {
        coverSection.style.background = page.cover;
      } else {
        coverSection.style.backgroundImage = `url(${page.cover})`;
      }
      coverSection.innerHTML = `
        <div class="ns-cover-actions">
          <button class="ns-cover-btn ns-btn-change-cover">${Icons.image} Change Cover</button>
          <button class="ns-cover-btn ns-btn-remove-cover">${Icons.x} Remove</button>
        </div>
      `;
    }
    pageWrapper.appendChild(coverSection);

    // 2. Main Content Canvas
    const canvas = createElement('div', 'ns-editor-canvas');

    // Hover controls to add cover/icon if missing
    const pageMetaControls = createElement('div', 'ns-page-meta-controls');
    pageMetaControls.innerHTML = `
      ${!page.icon ? `<button class="ns-meta-btn ns-btn-add-icon">${Icons.sparkles} Add icon</button>` : ''}
      ${!page.cover ? `<button class="ns-meta-btn ns-btn-add-cover">${Icons.image} Add cover</button>` : ''}
    `;
    canvas.appendChild(pageMetaControls);

    // 3. Page Icon
    if (page.icon) {
      const iconWrap = createElement('div', 'ns-page-icon-wrapper');
      iconWrap.innerHTML = `
        <button class="ns-page-icon-display" title="Change Icon">${page.icon}</button>
      `;
      canvas.appendChild(iconWrap);
    }

    // 4. Page Title
    const titleInput = createElement('div', 'ns-page-title');
    titleInput.contentEditable = 'true';
    titleInput.setAttribute('data-placeholder', 'Untitled');
    titleInput.innerHTML = page.title ? escapeHTML(page.title) : '';
    canvas.appendChild(titleInput);

    // 5. Page Document Stats & Breadcrumb Subtext
    const statsBar = createElement('div', 'ns-page-stats-bar');
    const wordCount = this.calculateWordCount(page);
    const readTime = Math.ceil(wordCount / 200);
    statsBar.innerHTML = `
      <div class="ns-stat-item">${wordCount} words</div>
      <div class="ns-stat-dot">•</div>
      <div class="ns-stat-item">${readTime} min read</div>
      <div class="ns-stat-dot">•</div>
      <div class="ns-stat-item">Updated ${formatDate(page.updatedAt)}</div>
    `;
    canvas.appendChild(statsBar);

    // 6. Blocks Container
    this.blocksContainer = createElement('div', 'ns-blocks-container');
    canvas.appendChild(this.blocksContainer);

    pageWrapper.appendChild(canvas);
    this.container.appendChild(pageWrapper);

    // Render each block
    if (page.blocks && page.blocks.length > 0) {
      page.blocks.forEach(block => {
        const blockEl = this.createBlockDOM(block);
        this.blocksContainer.appendChild(blockEl);

        // Mount database if inline
        if (block.type === 'database' && this.onDatabaseMount) {
          const dbWrap = blockEl.querySelector('.ns-database-block-wrapper');
          if (dbWrap) {
            const dbId = (block.metadata && block.metadata.databaseId) || page.databaseId;
            this.onDatabaseMount(dbWrap, dbId);
          }
        }
      });
    } else {
      // Create first empty paragraph if none
      const firstBlock = { id: 'b-' + Date.now(), type: 'paragraph', content: '' };
      page.blocks = [firstBlock];
      store.updatePage(page.id, { blocks: page.blocks });
      const blockEl = this.createBlockDOM(firstBlock);
      this.blocksContainer.appendChild(blockEl);
    }

    // Bind Page Level Events
    this.bindPageEvents(titleInput, pageWrapper);

    // Init Drag and Drop
    this.dragDrop = new BlockDragDrop(this.blocksContainer, (fromId, toId, position) => {
      this.handleBlockReorder(fromId, toId, position);
    });
  }

  calculateWordCount(page) {
    let text = (page.title || '') + ' ';
    (page.blocks || []).forEach(b => {
      text += (b.content || '').replace(/<[^>]*>/g, ' ') + ' ';
    });
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  createBlockDOM(block) {
    const blockEl = renderBlockElement(
      block,
      (updatedBlock) => this.handleBlockUpdate(updatedBlock),
      (blockId) => this.handleBlockDelete(blockId),
      (blockId, newType) => this.handleBlockConvert(blockId, newType)
    );

    this.bindBlockEvents(blockEl, block);
    return blockEl;
  }

  bindPageEvents(titleInput, pageWrapper) {
    const page = this.currentPage;

    // Title input listener
    titleInput.addEventListener('input', () => {
      const newTitle = titleInput.innerText.trim();
      store.updatePage(page.id, { title: newTitle || 'Untitled' });
    });

    titleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Focus first block
        const firstBlock = this.blocksContainer.querySelector('.ns-block-editor');
        if (firstBlock) {
          setCaretPosition(firstBlock, true);
        }
      }
    });

    // Add / Change Cover
    const addCoverBtn = pageWrapper.querySelector('.ns-btn-add-cover');
    const changeCoverBtn = pageWrapper.querySelector('.ns-btn-change-cover');
    const removeCoverBtn = pageWrapper.querySelector('.ns-btn-remove-cover');

    if (addCoverBtn) {
      addCoverBtn.addEventListener('click', (e) => this.showCoverPicker(e.target));
    }
    if (changeCoverBtn) {
      changeCoverBtn.addEventListener('click', (e) => this.showCoverPicker(e.target));
    }
    if (removeCoverBtn) {
      removeCoverBtn.addEventListener('click', () => {
        store.updatePage(page.id, { cover: null });
        this.render();
      });
    }

    // Add / Change Icon
    const addIconBtn = pageWrapper.querySelector('.ns-btn-add-icon');
    const iconDisplay = pageWrapper.querySelector('.ns-page-icon-display');

    if (addIconBtn) {
      addIconBtn.addEventListener('click', (e) => this.showEmojiPicker(e.target));
    }
    if (iconDisplay) {
      iconDisplay.addEventListener('click', (e) => this.showEmojiPicker(e.target));
    }
  }

  bindBlockEvents(blockEl, block) {
    const editor = blockEl.querySelector('.ns-block-editor');
    const addBtn = blockEl.querySelector('.ns-add-block-btn');
    const dragHandle = blockEl.querySelector('.ns-drag-handle');

    // Add block button below
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.insertBlockAfter(block.id, 'paragraph');
      });
    }

    // Handle click to open context menu
    if (dragHandle) {
      dragHandle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showBlockContextMenu(dragHandle, block);
      });
    }

    if (!editor) return;

    // Input listener (content changes)
    editor.addEventListener('input', (e) => {
      this.handleBlockInput(blockEl, block, editor);
    });

    // Keydown shortcuts
    editor.addEventListener('keydown', (e) => {
      this.handleBlockKeyDown(e, blockEl, block, editor);
    });

    // Focus listener
    editor.addEventListener('focus', () => {
      this.activeBlockId = block.id;
    });
  }

  handleBlockInput(blockEl, block, editor) {
    const text = editor.innerText;

    // Check for markdown shortcuts at start of block
    if (this.checkMarkdownShortcut(blockEl, block, text)) {
      return;
    }

    // Check for slash menu trigger
    if (text.includes('/')) {
      const slashIndex = text.lastIndexOf('/');
      const query = text.substring(slashIndex + 1);
      const rect = editor.getBoundingClientRect();

      if (!this.slashMenu.isOpen) {
        this.slashMenu.open(blockEl, rect);
      }
      this.slashMenu.setQuery(query);
    } else {
      if (this.slashMenu.isOpen) {
        this.slashMenu.close();
      }
    }

    // Update block content in state
    block.content = editor.innerHTML;
    this.saveBlocksToState();
  }

  checkMarkdownShortcut(blockEl, block, text) {
    const shortcuts = [
      { prefix: '# ', type: 'heading1' },
      { prefix: '## ', type: 'heading2' },
      { prefix: '### ', type: 'heading3' },
      { prefix: '- ', type: 'bulletList' },
      { prefix: '* ', type: 'bulletList' },
      { prefix: '1. ', type: 'numberedList' },
      { prefix: '[] ', type: 'checklist' },
      { prefix: '[ ] ', type: 'checklist' },
      { prefix: '> ', type: 'quote' },
      { prefix: '---', type: 'divider' },
      { prefix: '```', type: 'code' }
    ];

    for (const sc of shortcuts) {
      if (text.startsWith(sc.prefix)) {
        const remaining = text.substring(sc.prefix.length);
        block.type = sc.type;
        block.content = remaining;
        if (sc.type === 'checklist') {
          block.metadata = { checked: false };
        } else if (sc.type === 'code') {
          block.metadata = { language: 'javascript' };
        }

        // Replace DOM node
        const newBlockEl = this.createBlockDOM(block);
        blockEl.replaceWith(newBlockEl);
        const newEditor = newBlockEl.querySelector('.ns-block-editor');
        if (newEditor) {
          setCaretPosition(newEditor, true);
        }

        this.saveBlocksToState();
        return true;
      }
    }
    return false;
  }

  handleBlockKeyDown(e, blockEl, block, editor) {
    // Let Slash Menu capture navigation if open
    if (this.slashMenu.isOpen) {
      if (this.slashMenu.handleKeyDown(e)) {
        return;
      }
    }

    // 1. Enter Key -> Create new block
    if (e.key === 'Enter' && !e.shiftKey) {
      if (block.type === 'code' || block.type === 'table') {
        // Allow normal newline in code block
        return;
      }

      e.preventDefault();

      // If in a list/checklist and it's empty, convert to regular paragraph
      const text = editor.innerText.trim();
      if ((block.type === 'bulletList' || block.type === 'numberedList' || block.type === 'checklist') && text === '') {
        this.handleBlockConvert(block.id, 'paragraph');
        return;
      }

      // Inherit list type or default to paragraph
      let nextType = 'paragraph';
      if (block.type === 'bulletList') nextType = 'bulletList';
      if (block.type === 'numberedList') nextType = 'numberedList';
      if (block.type === 'checklist') nextType = 'checklist';

      this.insertBlockAfter(block.id, nextType);
    }

    // 2. Backspace Key
    if (e.key === 'Backspace') {
      const text = editor.innerText.trim();
      // If block is non-paragraph and empty, convert to paragraph
      if (block.type !== 'paragraph' && text === '') {
        e.preventDefault();
        this.handleBlockConvert(block.id, 'paragraph');
        return;
      }

      // If block is paragraph and completely empty, delete and focus previous
      if (block.type === 'paragraph' && text === '') {
        const blocks = this.currentPage.blocks;
        if (blocks.length > 1) {
          e.preventDefault();
          const prevBlock = blockEl.previousElementSibling;
          this.handleBlockDelete(block.id);
          if (prevBlock) {
            const prevEditor = prevBlock.querySelector('.ns-block-editor');
            if (prevEditor) setCaretPosition(prevEditor, true);
          }
        }
      }
    }

    // 3. Arrow Up / Down navigation between blocks
    if (e.key === 'ArrowUp') {
      const prevBlock = blockEl.previousElementSibling;
      if (prevBlock) {
        const prevEditor = prevBlock.querySelector('.ns-block-editor');
        if (prevEditor) {
          // Check if cursor is at first line
          const sel = window.getSelection();
          if (sel && sel.anchorOffset === 0) {
            e.preventDefault();
            setCaretPosition(prevEditor, true);
          }
        }
      }
    }

    if (e.key === 'ArrowDown') {
      const nextBlock = blockEl.nextElementSibling;
      if (nextBlock) {
        const nextEditor = nextBlock.querySelector('.ns-block-editor');
        if (nextEditor) {
          const sel = window.getSelection();
          if (sel && sel.anchorOffset >= (editor.innerText.length - 1)) {
            e.preventDefault();
            setCaretPosition(nextEditor, false);
          }
        }
      }
    }
  }

  handleSlashSelect(selectedDef, targetBlockEl) {
    if (!targetBlockEl) return;
    const blockId = targetBlockEl.dataset.blockId;
    const block = this.currentPage.blocks.find(b => b.id === blockId);
    if (!block) return;

    // Clean out the slash command text
    let cleanContent = (block.content || '').replace(/\/[a-zA-Z0-9_-]*$/, '').trim();

    if (selectedDef.type === 'database') {
      // Create inline database
      store.createDatabase({ title: 'Inline Database', pageId: this.currentPage.id }).then(newDb => {
        block.type = 'database';
        block.content = '';
        block.metadata = { databaseId: newDb.id };

        const newBlockEl = this.createBlockDOM(block);
        targetBlockEl.replaceWith(newBlockEl);

        const dbWrap = newBlockEl.querySelector('.ns-database-block-wrapper');
        if (dbWrap && this.onDatabaseMount) {
          this.onDatabaseMount(dbWrap, newDb.id);
        }
        this.saveBlocksToState();
      });
      return;
    }

    block.type = selectedDef.type;
    block.content = cleanContent;
    block.metadata = JSON.parse(JSON.stringify(selectedDef.defaultMetadata || {}));

    const newBlockEl = this.createBlockDOM(block);
    targetBlockEl.replaceWith(newBlockEl);

    const newEditor = newBlockEl.querySelector('.ns-block-editor');
    if (newEditor) {
      setCaretPosition(newEditor, true);
    }

    this.saveBlocksToState();
  }

  insertBlockAfter(targetBlockId, blockType = 'paragraph') {
    const blocks = this.currentPage.blocks;
    const index = blocks.findIndex(b => b.id === targetBlockId);
    if (index === -1) return;

    const newBlock = {
      id: 'b-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      type: blockType,
      content: '',
      metadata: {}
    };

    blocks.splice(index + 1, 0, newBlock);
    this.saveBlocksToState();

    const targetEl = this.blocksContainer.querySelector(`[data-block-id="${targetBlockId}"]`);
    const newBlockEl = this.createBlockDOM(newBlock);

    if (targetEl && targetEl.nextSibling) {
      this.blocksContainer.insertBefore(newBlockEl, targetEl.nextSibling);
    } else {
      this.blocksContainer.appendChild(newBlockEl);
    }

    const newEditor = newBlockEl.querySelector('.ns-block-editor');
    if (newEditor) {
      setCaretPosition(newEditor, true);
    }
  }

  handleBlockUpdate(updatedBlock) {
    const blocks = this.currentPage.blocks;
    const index = blocks.findIndex(b => b.id === updatedBlock.id);
    if (index !== -1) {
      blocks[index] = updatedBlock;
      this.saveBlocksToState();
    }
  }

  handleBlockDelete(blockId) {
    const blocks = this.currentPage.blocks;
    if (blocks.length <= 1) {
      // Keep at least one empty block
      blocks[0] = { id: 'b-' + Date.now(), type: 'paragraph', content: '', metadata: {} };
      this.render();
      this.saveBlocksToState();
      return;
    }

    this.currentPage.blocks = blocks.filter(b => b.id !== blockId);
    const blockEl = this.blocksContainer.querySelector(`[data-block-id="${blockId}"]`);
    if (blockEl) blockEl.remove();
    this.saveBlocksToState();
  }

  handleBlockConvert(blockId, newType) {
    const block = this.currentPage.blocks.find(b => b.id === blockId);
    if (!block) return;

    const def = getBlockDefinition(newType);
    block.type = newType;
    block.metadata = JSON.parse(JSON.stringify(def.defaultMetadata || {}));

    const blockEl = this.blocksContainer.querySelector(`[data-block-id="${blockId}"]`);
    if (blockEl) {
      const newBlockEl = this.createBlockDOM(block);
      blockEl.replaceWith(newBlockEl);
      const newEditor = newBlockEl.querySelector('.ns-block-editor');
      if (newEditor) setCaretPosition(newEditor, true);
    }

    this.saveBlocksToState();
  }

  handleBlockReorder(fromId, toId, position) {
    const blocks = this.currentPage.blocks;
    const fromIndex = blocks.findIndex(b => b.id === fromId);
    const toIndex = blocks.findIndex(b => b.id === toId);

    if (fromIndex === -1 || toIndex === -1) return;

    const [movedBlock] = blocks.splice(fromIndex, 1);
    let targetIndex = blocks.findIndex(b => b.id === toId);
    if (position === 'after') targetIndex += 1;

    blocks.splice(targetIndex, 0, movedBlock);
    this.saveBlocksToState();
    this.render();
  }

  saveBlocksToState() {
    if (!this.currentPage) return;
    store.updatePage(this.currentPage.id, { blocks: this.currentPage.blocks });
  }

  // --- Context Menu for Block Handles ---

  showBlockContextMenu(targetHandle, block) {
    document.querySelectorAll('.ns-context-menu').forEach(m => m.remove());

    const menu = createElement('div', 'ns-context-menu');
    menu.innerHTML = `
      <div class="ns-menu-item" data-action="delete">
        ${Icons.trash} <span>Delete Block</span>
      </div>
      <div class="ns-menu-item" data-action="duplicate">
        ${Icons.copy} <span>Duplicate Block</span>
      </div>
      <div class="ns-menu-divider"></div>
      <div class="ns-menu-label">Turn into</div>
      <div class="ns-turn-into-grid">
        <button class="ns-turn-btn" data-type="paragraph">${getIcon('paragraph')} Text</button>
        <button class="ns-turn-btn" data-type="heading1">${getIcon('heading1')} H1</button>
        <button class="ns-turn-btn" data-type="heading2">${getIcon('heading2')} H2</button>
        <button class="ns-turn-btn" data-type="heading3">${getIcon('heading3')} H3</button>
        <button class="ns-turn-btn" data-type="bulletList">${getIcon('bulletList')} Bullet</button>
        <button class="ns-turn-btn" data-type="numberedList">${getIcon('numberedList')} Number</button>
        <button class="ns-turn-btn" data-type="checklist">${getIcon('checklist')} To-do</button>
        <button class="ns-turn-btn" data-type="quote">${getIcon('quote')} Quote</button>
        <button class="ns-turn-btn" data-type="callout">${getIcon('callout')} Callout</button>
        <button class="ns-turn-btn" data-type="code">${getIcon('code')} Code</button>
      </div>
    `;

    document.body.appendChild(menu);

    const rect = targetHandle.getBoundingClientRect();
    let top = rect.bottom + window.scrollY + 4;
    let left = rect.left + window.scrollX;

    if (top + 280 > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - 280;
    }

    menu.style.top = `${Math.max(10, top)}px`;
    menu.style.left = `${Math.max(10, left)}px`;

    menu.querySelector('[data-action="delete"]').addEventListener('click', () => {
      this.handleBlockDelete(block.id);
      menu.remove();
    });

    menu.querySelector('[data-action="duplicate"]').addEventListener('click', () => {
      const clone = JSON.parse(JSON.stringify(block));
      clone.id = 'b-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      const blocks = this.currentPage.blocks;
      const idx = blocks.findIndex(b => b.id === block.id);
      blocks.splice(idx + 1, 0, clone);
      this.saveBlocksToState();
      this.render();
      menu.remove();
    });

    menu.querySelectorAll('.ns-turn-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        this.handleBlockConvert(block.id, type);
        menu.remove();
      });
    });

    const closeHandler = (e) => {
      if (!menu.contains(e.target) && e.target !== targetHandle) {
        menu.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }

  // --- Cover & Emoji Pickers ---

  showCoverPicker(targetBtn) {
    document.querySelectorAll('.ns-picker-popover').forEach(p => p.remove());

    const popover = createElement('div', 'ns-picker-popover ns-cover-picker-popover');
    const gradients = [
      { name: 'Aurora', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      { name: 'Ocean', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
      { name: 'Emerald', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
      { name: 'Sunset', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
      { name: 'Neon Pink', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
      { name: 'Midnight', value: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
      { name: 'Slate Solid', value: '#1e293b' },
      { name: 'Zinc Solid', value: '#27272a' }
    ];

    popover.innerHTML = `
      <div class="ns-picker-title">Select Cover Preset</div>
      <div class="ns-cover-grid">
        ${gradients.map(g => `<button class="ns-cover-opt" data-value="${g.value}" style="background: ${g.value};" title="${g.name}"></button>`).join('')}
      </div>
      <div class="ns-picker-divider"></div>
      <div class="ns-cover-custom-input">
        <input type="text" class="ns-input ns-cover-url-inp" placeholder="Paste custom image URL..." />
        <button class="ns-btn ns-btn-primary ns-btn-apply-cover">Apply</button>
      </div>
    `;

    document.body.appendChild(popover);
    const rect = targetBtn.getBoundingClientRect();
    popover.style.top = `${rect.bottom + window.scrollY + 6}px`;
    popover.style.left = `${Math.max(20, rect.left + window.scrollX - 100)}px`;

    popover.querySelectorAll('.ns-cover-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        store.updatePage(this.currentPage.id, { cover: btn.dataset.value });
        popover.remove();
        this.render();
      });
    });

    const urlInp = popover.querySelector('.ns-cover-url-inp');
    const applyBtn = popover.querySelector('.ns-btn-apply-cover');
    applyBtn.addEventListener('click', () => {
      const url = urlInp.value.trim();
      if (url) {
        store.updatePage(this.currentPage.id, { cover: url });
        popover.remove();
        this.render();
      }
    });

    const closeHandler = (e) => {
      if (!popover.contains(e.target) && e.target !== targetBtn) {
        popover.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }

  showEmojiPicker(targetBtn) {
    document.querySelectorAll('.ns-picker-popover').forEach(p => p.remove());

    const popover = createElement('div', 'ns-picker-popover ns-emoji-picker-popover');
    const emojis = [
      '📄', '✨', '🚀', '💡', '🎯', '📚', '🔥', '💻', '⚡', '🌟',
      '📌', '📖', '🛡️', '⚙️', '📊', '🎨', '💼', '☕', '🧠', '🔬',
      '📝', '🛠️', '🌿', '💬', '🔔', '🏷️', '🔮', '🎉', '🍎', '🏖️'
    ];

    popover.innerHTML = `
      <div class="ns-picker-header">
        <div class="ns-picker-title">Select Page Icon</div>
        <button class="ns-btn-sm ns-btn-remove-icon">Remove</button>
      </div>
      <div class="ns-emoji-grid">
        ${emojis.map(e => `<button class="ns-emoji-opt">${e}</button>`).join('')}
      </div>
    `;

    document.body.appendChild(popover);
    const rect = targetBtn.getBoundingClientRect();
    popover.style.top = `${rect.bottom + window.scrollY + 6}px`;
    popover.style.left = `${Math.max(20, rect.left + window.scrollX)}px`;

    popover.querySelectorAll('.ns-emoji-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        store.updatePage(this.currentPage.id, { icon: btn.innerText.trim() });
        popover.remove();
        this.render();
      });
    });

    popover.querySelector('.ns-btn-remove-icon').addEventListener('click', () => {
      store.updatePage(this.currentPage.id, { icon: null });
      popover.remove();
      this.render();
    });

    const closeHandler = (e) => {
      if (!popover.contains(e.target) && e.target !== targetBtn) {
        popover.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }
}
