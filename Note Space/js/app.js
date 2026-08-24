/**
 * NoteSpace - Main Application Controller (Production Polish)
 * Handles page header, top navigation, breadcrumbs, modals, shortcuts cheatsheet,
 * emoji/icon picker with search & custom input, cover picker, and view switching.
 */
class AppController {
  constructor() {
    this.editor = null;
    this.database = null;
    this.sidebar = null;
    this.toastContainer = null;
    this.settingsModal = null;
    this.shortcutsModal = null;
    this.emojiPickerModal = null;
    this.coverPickerModal = null;
    this.targetPageIdForEmoji = null;
    this.targetPageIdForCover = null;

    this.emojiList = [
      // Work & Planning
      { emoji: '⚡', name: 'lightning bolt fast energy power acme', cat: 'work' },
      { emoji: '🚀', name: 'rocket launch startup deployment ship', cat: 'work' },
      { emoji: '🎯', name: 'target goal sprint roadmap objective', cat: 'work' },
      { emoji: '📐', name: 'architecture ruler drafting design spec', cat: 'work' },
      { emoji: '💼', name: 'briefcase work job business portfolio', cat: 'work' },
      { emoji: '📊', name: 'chart bar graph stats database analytics', cat: 'work' },
      { emoji: '📝', name: 'memo document notes write draft', cat: 'work' },
      { emoji: '📂', name: 'folder directory organization files', cat: 'work' },
      { emoji: '📅', name: 'calendar date schedule meeting sync', cat: 'work' },
      { emoji: '🤝', name: 'handshake partnership meeting agreement sync', cat: 'work' },
      { emoji: '🏆', name: 'trophy milestone achievement winner', cat: 'work' },
      { emoji: '📌', name: 'pushpin pinned priority focus highlight', cat: 'work' },
      { emoji: '📋', name: 'clipboard tasks checklist audit backlog', cat: 'work' },
      { emoji: '⌛', name: 'hourglass time pending in-progress', cat: 'work' },
      { emoji: '📈', name: 'trending upward growth metric improvement', cat: 'work' },

      // Tech & Engineering
      { emoji: '💻', name: 'computer laptop tech code developer', cat: 'tech' },
      { emoji: '🔌', name: 'plug api integration gateway interface', cat: 'tech' },
      { emoji: '☁️', name: 'cloud infrastructure devops aws kubernetes', cat: 'tech' },
      { emoji: '🛡️', name: 'shield security auth privacy firewall', cat: 'tech' },
      { emoji: '🔧', name: 'wrench configuration settings maintenance', cat: 'tech' },
      { emoji: '⚙️', name: 'gear system architecture processing engine', cat: 'tech' },
      { emoji: '📦', name: 'package npm bundle module artifact', cat: 'tech' },
      { emoji: '🌐', name: 'globe network internet web distributed', cat: 'tech' },
      { emoji: '🔒', name: 'lock secure encrypted protected access', cat: 'tech' },
      { emoji: '🔑', name: 'key authentication token secret access', cat: 'tech' },
      { emoji: '🖥️', name: 'desktop server monitor workstation cluster', cat: 'tech' },
      { emoji: '💾', name: 'floppy disk storage indexeddb database backup', cat: 'tech' },
      { emoji: '📡', name: 'satellite antenna streaming pubsub kafka signal', cat: 'tech' },
      { emoji: '🧪', name: 'test tube unit test qa experiment benchmark', cat: 'tech' },
      { emoji: '🚨', name: 'alarm siren incident postmortem alert bug critical', cat: 'tech' },

      // Status & Badges
      { emoji: '✅', name: 'check mark done completed passed success verified', cat: 'status' },
      { emoji: '✨', name: 'sparkles new feature polish ai shine', cat: 'status' },
      { emoji: '🔥', name: 'fire hot urgent p0 high trending', cat: 'status' },
      { emoji: '⭐', name: 'star favorite bookmark highlight priority', cat: 'status' },
      { emoji: '💡', name: 'light bulb idea suggestion tip tip insight', cat: 'status' },
      { emoji: '⚠️', name: 'warning danger caution issue notice', cat: 'status' },
      { emoji: '❓', name: 'question help faq unknown inquiry', cat: 'status' },
      { emoji: '🔴', name: 'red circle blocked stopped critical error', cat: 'status' },
      { emoji: '🟡', name: 'yellow circle in progress review pending', cat: 'status' },
      { emoji: '🟢', name: 'green circle live ready active operational', cat: 'status' },
      { emoji: '💎', name: 'gem diamond premium quality treasure', cat: 'status' },
      { emoji: '🎉', name: 'tada celebration milestone party launch', cat: 'status' },
      { emoji: '💬', name: 'speech bubble discussion feedback comments sync', cat: 'status' },

      // Knowledge & Design
      { emoji: '📚', name: 'books reading library research documentation hub', cat: 'knowledge' },
      { emoji: '📖', name: 'open book handbook manual guide reference', cat: 'knowledge' },
      { emoji: '🧠', name: 'brain second brain knowledge intelligence memory', cat: 'knowledge' },
      { emoji: '🎨', name: 'artist palette design ui ux styling theme', cat: 'knowledge' },
      { emoji: '🧭', name: 'compass exploration direction guide navigation', cat: 'knowledge' },
      { emoji: '🔬', name: 'microscope deep dive research analysis', cat: 'knowledge' },
      { emoji: '🌱', name: 'seedling growth evergreen nascent seedling', cat: 'knowledge' },
      { emoji: '🌳', name: 'tree knowledge graph hierarchy structure', cat: 'knowledge' },
      { emoji: '☕', name: 'coffee break focus 1-on-1 casual sync', cat: 'knowledge' },
      { emoji: '🌌', name: 'galaxy space universe cosmos notespace', cat: 'knowledge' }
    ];
  }

  async init() {
    this.createToastContainer();
    this.createSettingsModal();
    this.createShortcutsModal();
    this.createEmojiPickerModal();
    this.createCoverPickerModal();
    this.createMobileBackdrop();

    // Instantiate sub-engines
    this.editor = new BlockEditor();
    this.database = new DatabaseEngine();
    this.sidebar = new Sidebar();

    // Mount sidebar
    const sidebarEl = document.getElementById('app-sidebar');
    if (sidebarEl) this.sidebar.mount(sidebarEl);

    // Register reactive state event listeners BEFORE initializing state
    State.on('page:changed', (payload) => this.handlePageChanged(payload));
    State.on('page:updated', (page) => this.handlePageUpdated(page));
    State.on('save:status', (status) => this.updateSaveIndicator(status));

    // Attach Topbar & Header events
    this.attachHeaderEvents();
    this.attachGlobalHotkeys();

    // Initialize State & DB with graceful fallback
    try {
      await State.init();
    } catch (e) {
      console.error('[NoteSpace] Error during initialization:', e);
      this.showToast('NoteSpace recovered from storage state.');
    }

    // Initial render of current page
    if (State.activePage) {
      this.handlePageChanged({
        page: State.activePage,
        blocks: State.blocks,
        database: State.database,
        isTrash: State.activePageId === '__trash__'
      });
    }

    // Handle window resize for mobile off-canvas drawer
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        const backdrop = document.getElementById('sidebar-mobile-backdrop');
        if (backdrop) backdrop.classList.remove('is-visible');
      }
    });

    console.log('[NoteSpace] Production workspace initialized successfully.');
  }

  createMobileBackdrop() {
    let backdrop = document.getElementById('sidebar-mobile-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'sidebar-mobile-backdrop';
      backdrop.className = 'sidebar-mobile-backdrop';
      document.body.appendChild(backdrop);
    }
    backdrop.addEventListener('click', () => {
      State.toggleSidebar(true);
    });
  }

  // --- View Switcher / Page Load Handler ---

  handlePageChanged({ page, blocks, database, isTrash }) {
    const mainContainer = document.getElementById('main-editor-container');
    const trashContainer = document.getElementById('trash-view-container');
    const editorBody = document.getElementById('editor-body');
    const dbBody = document.getElementById('database-body');

    if (!mainContainer) return;

    if (isTrash) {
      mainContainer.style.display = 'none';
      if (trashContainer) trashContainer.style.display = 'block';
      this.renderTrashView();
      this.updateBreadcrumbs('Trash Bin');
      return;
    }

    mainContainer.style.display = 'block';
    if (trashContainer) trashContainer.style.display = 'none';

    // Update Full Width setting on main container
    const isFullWidth = !!page?.fullWidth;
    mainContainer.classList.toggle('page-full-width', isFullWidth);

    // Render Breadcrumbs
    if (page) this.renderBreadcrumbs(page);

    // Render Page Cover & Icon
    if (page) {
      this.renderPageCover(page);
      this.renderPageIcon(page);
    }

    // Render Page Title
    const titleInput = document.getElementById('page-title-input');
    if (titleInput) {
      titleInput.value = page?.title || '';
      titleInput.disabled = !!page?.isLocked;
    }

    // Render Lock badge / Favorite star
    if (page) this.updateHeaderActionBadges(page);

    // Render Body (Editor or Database)
    if (page?.isDatabase || database) {
      if (editorBody) editorBody.style.display = 'none';
      if (dbBody) {
        dbBody.style.display = 'block';
        this.database.mount(dbBody, database || { rows: [], properties: [] });
      }
    } else {
      if (editorBody) {
        editorBody.style.display = 'block';
        this.editor.mount(editorBody);
        this.editor.setBlocks(blocks);

        // If page is new and empty, auto-focus writing area
        if (!page?.isLocked && blocks && blocks.length === 1 && (!blocks[0].content || blocks[0].content === '')) {
          setTimeout(() => this.editor.focusBlock(blocks[0].id, 'start'), 50);
        }
      }
      if (dbBody) dbBody.style.display = 'none';
    }
  }

  handlePageUpdated(page) {
    if (State.activePageId === page.id) {
      this.renderBreadcrumbs(page);
      this.renderPageCover(page);
      this.renderPageIcon(page);
      this.updateHeaderActionBadges(page);

      const titleInput = document.getElementById('page-title-input');
      if (titleInput && document.activeElement !== titleInput) {
        titleInput.value = page.title || '';
        titleInput.disabled = !!page.isLocked;
      }

      const mainContainer = document.getElementById('main-editor-container');
      if (mainContainer) {
        mainContainer.classList.toggle('page-full-width', !!page.fullWidth);
      }

      if (page.isDatabase) {
        this.database?.render();
      }
    }
  }

  // --- Breadcrumbs & Topbar ---

  renderBreadcrumbs(page) {
    const breadcrumbEl = document.getElementById('topbar-breadcrumbs');
    if (!breadcrumbEl) return;

    breadcrumbEl.innerHTML = '';

    // Build ancestor chain
    const chain = [];
    let curr = page;
    while (curr) {
      chain.unshift(curr);
      curr = State.pages.find(p => p.id === curr.parentId && !p.inTrash);
    }

    chain.forEach((p, idx) => {
      if (idx > 0) {
        const sep = document.createElement('span');
        sep.className = 'crumb-sep';
        sep.textContent = '/';
        breadcrumbEl.appendChild(sep);
      }

      const crumb = document.createElement('button');
      crumb.className = `crumb-item ${idx === chain.length - 1 ? 'is-current' : ''}`;
      crumb.innerHTML = `<span class="crumb-icon">${p.icon || '📄'}</span> <span>${p.title || 'Untitled'}</span>`;
      crumb.addEventListener('click', () => {
        State.setActivePage(p.id);
      });

      breadcrumbEl.appendChild(crumb);
    });
  }

  updateBreadcrumbs(text) {
    const breadcrumbEl = document.getElementById('topbar-breadcrumbs');
    if (breadcrumbEl) {
      breadcrumbEl.innerHTML = `<span class="crumb-item is-current">${text}</span>`;
    }
  }

  // --- Page Cover & Icon ---

  renderPageCover(page) {
    const coverWrap = document.getElementById('page-cover-wrap');
    const addCoverBtn = document.getElementById('header-add-cover-btn');
    if (!coverWrap) return;

    if (page.cover) {
      coverWrap.style.display = 'block';
      coverWrap.innerHTML = `
        <img src="${page.cover}" class="page-cover-image" alt="Page cover photo" loading="lazy" />
        ${!page.isLocked ? `
          <div class="cover-hover-controls">
            <button class="cover-ctrl-btn" id="btn-change-cover">${Icons.get('image', 'icon-xs', 13)} Change cover</button>
            <button class="cover-ctrl-btn" id="btn-remove-cover">${Icons.get('x', 'icon-xs', 13)} Remove</button>
          </div>
        ` : ''}
      `;

      coverWrap.querySelector('#btn-change-cover')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openCoverPickerModal(page.id);
      });

      coverWrap.querySelector('#btn-remove-cover')?.addEventListener('click', (e) => {
        e.stopPropagation();
        State.updatePage(page.id, { cover: null });
        this.showToast('Cover removed');
      });

      if (addCoverBtn) addCoverBtn.style.display = 'none';
    } else {
      coverWrap.style.display = 'none';
      coverWrap.innerHTML = '';
      if (addCoverBtn) addCoverBtn.style.display = 'inline-flex';
    }
  }

  renderPageIcon(page) {
    const iconBtn = document.getElementById('page-icon-btn');
    const addIconBtn = document.getElementById('header-add-icon-btn');

    if (iconBtn) {
      if (page.icon) {
        iconBtn.style.display = 'inline-flex';
        iconBtn.textContent = page.icon;
        iconBtn.disabled = !!page.isLocked;
      } else {
        iconBtn.style.display = 'none';
      }
    }

    if (addIconBtn) {
      addIconBtn.style.display = page.icon ? 'none' : 'inline-flex';
    }
  }

  updateHeaderActionBadges(page) {
    const favBtn = document.getElementById('topbar-fav-btn');
    if (favBtn) {
      favBtn.innerHTML = Icons.get(page.isFavorite ? 'starFilled' : 'star', 'icon-sm', 16);
      favBtn.classList.toggle('is-favorited', !!page.isFavorite);
    }

    const lockBtn = document.getElementById('topbar-lock-btn');
    if (lockBtn) {
      lockBtn.innerHTML = Icons.get(page.isLocked ? 'lock' : 'unlock', 'icon-sm', 16);
      lockBtn.title = page.isLocked ? 'Document is locked (Read-only)' : 'Document is unlocked (Editable)';
    }

    const widthBtn = document.getElementById('topbar-width-btn');
    if (widthBtn) {
      widthBtn.innerHTML = Icons.get('columns', 'icon-sm', 16);
      widthBtn.title = page.fullWidth ? 'Switch to centered width' : 'Switch to full-width';
    }
  }

  // --- Header Event Listeners ---

  attachHeaderEvents() {
    // Page Title Editing
    const titleInput = document.getElementById('page-title-input');
    if (titleInput) {
      titleInput.addEventListener('input', () => {
        if (State.activePage) {
          State.updatePage(State.activePage.id, { title: titleInput.value });
        }
      });
    }

    // Page Icon button click
    const iconBtn = document.getElementById('page-icon-btn');
    if (iconBtn) {
      iconBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openEmojiPickerModal(State.activePageId);
      });
    }

    // Add Icon header button click
    const addIconBtn = document.getElementById('header-add-icon-btn');
    if (addIconBtn) {
      addIconBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openEmojiPickerModal(State.activePageId);
      });
    }

    // Cover Hover Button in Header
    const addCoverBtn = document.getElementById('header-add-cover-btn');
    if (addCoverBtn) {
      addCoverBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openCoverPickerModal(State.activePageId);
      });
    }

    // Topbar Favorite toggle
    document.getElementById('topbar-fav-btn')?.addEventListener('click', () => {
      if (State.activePage) {
        State.toggleFavorite(State.activePage.id);
      }
    });

    // Topbar Lock toggle
    document.getElementById('topbar-lock-btn')?.addEventListener('click', () => {
      if (State.activePage) {
        const nextLock = !State.activePage.isLocked;
        State.updatePage(State.activePage.id, { isLocked: nextLock });
        this.showToast(nextLock ? 'Document locked (Read-only)' : 'Document unlocked for editing');
      }
    });

    // Topbar Full Width toggle
    document.getElementById('topbar-width-btn')?.addEventListener('click', () => {
      if (State.activePage) {
        const nextWidth = !State.activePage.fullWidth;
        State.updatePage(State.activePage.id, { fullWidth: nextWidth });
      }
    });

    // Topbar Page History / Revisions
    document.getElementById('topbar-history-btn')?.addEventListener('click', () => {
      if (State.activePageId) {
        window.HistoryManager?.open(State.activePageId);
      }
    });

    // Topbar More actions dropdown
    document.getElementById('topbar-more-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (State.activePage) {
        this.sidebar?.openPageContextMenu(e, State.activePage);
      }
    });

    // Sidebar Toggle in Topbar
    document.getElementById('topbar-sidebar-toggle')?.addEventListener('click', () => {
      State.toggleSidebar();
    });

    // New Page in Topbar
    document.getElementById('topbar-new-page-btn')?.addEventListener('click', () => {
      State.createPage(null, 'Untitled');
    });
  }

  // --- Trash View Renderer ---

  renderTrashView() {
    const trashListEl = document.getElementById('trash-items-list');
    const emptyTrashBtn = document.getElementById('empty-trash-btn');
    if (!trashListEl) return;

    const trashed = State.pages.filter(p => p.inTrash);
    trashListEl.innerHTML = '';

    if (trashed.length === 0) {
      trashListEl.innerHTML = `
        <div class="empty-trash-placeholder">
          ${Icons.get('trash', 'icon-lg', 40)}
          <div class="empty-trash-title">Trash is empty</div>
          <div class="empty-trash-desc">Deleted documents and subpages will appear here.</div>
        </div>
      `;
      if (emptyTrashBtn) emptyTrashBtn.style.display = 'none';
      return;
    }

    if (emptyTrashBtn) {
      emptyTrashBtn.style.display = 'inline-flex';
      emptyTrashBtn.onclick = () => {
        if (confirm('Permanently delete all items in Trash? This action cannot be undone.')) {
          State.emptyTrash();
          this.renderTrashView();
          this.showToast('Trash emptied permanently');
        }
      };
    }

    trashed.forEach(p => {
      const item = document.createElement('div');
      item.className = 'trash-row-item';

      const d = p.trashDate ? new Date(p.trashDate) : new Date(p.updatedAt);
      const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

      item.innerHTML = `
        <div class="trash-item-title-wrap">
          <span class="trash-item-icon">${p.icon || '📄'}</span>
          <span class="trash-item-name">${p.title || 'Untitled'}</span>
        </div>
        <div class="trash-item-date">${dateStr}</div>
        <div class="trash-item-actions">
          <button class="btn-sm btn-outline restore-btn" title="Restore">${Icons.get('refresh', 'icon-xs', 12)} Restore</button>
          <button class="btn-sm btn-danger perm-delete-btn" title="Delete Forever">${Icons.get('trash', 'icon-xs', 12)} Delete</button>
        </div>
      `;

      item.querySelector('.restore-btn').addEventListener('click', () => {
        State.restorePage(p.id);
        this.showToast(`Restored "${p.title}"`);
      });

      item.querySelector('.perm-delete-btn').addEventListener('click', () => {
        if (confirm(`Permanently delete "${p.title}"?`)) {
          State.deletePage(p.id, true);
          this.renderTrashView();
        }
      });

      trashListEl.appendChild(item);
    });
  }

  // --- Autosave Indicator ---

  updateSaveIndicator(status) {
    const indicator = document.getElementById('topbar-save-status');
    if (!indicator) return;

    if (status === 'saving') {
      indicator.innerHTML = `<span class="saving-dot"></span> <span>Saving...</span>`;
      indicator.className = 'topbar-save-badge is-saving';
    } else if (status === 'saved') {
      indicator.innerHTML = `${Icons.get('check', 'icon-xs', 12)} <span>Saved</span>`;
      indicator.className = 'topbar-save-badge is-saved';
    } else {
      indicator.innerHTML = `<span>Offline</span>`;
      indicator.className = 'topbar-save-badge is-offline';
    }
  }

  // --- Rich Emoji & Icon Picker Modal ---

  createEmojiPickerModal() {
    this.emojiPickerModal = document.createElement('div');
    this.emojiPickerModal.className = 'picker-modal-backdrop';
    
    this.emojiPickerModal.innerHTML = `
      <div class="emoji-picker-box">
        <div class="picker-box-header">
          <h4>Select Page Icon</h4>
          <button class="picker-close-btn" id="emoji-picker-close">${Icons.get('x', 'icon-sm', 16)}</button>
        </div>

        <!-- Filter Categories & Search -->
        <div class="emoji-search-row">
          ${Icons.get('search', 'icon-xs emoji-search-icon', 13)}
          <input type="text" class="emoji-search-input" id="emoji-search-input" placeholder="Search icon (e.g. rocket, star, code, check)..." />
        </div>

        <div class="emoji-cat-tabs" id="emoji-cat-tabs">
          <button class="emoji-cat-tab is-active" data-cat="all">All</button>
          <button class="emoji-cat-tab" data-cat="work">💼 Work</button>
          <button class="emoji-cat-tab" data-cat="tech">💻 Tech</button>
          <button class="emoji-cat-tab" data-cat="status">🎯 Status</button>
          <button class="emoji-cat-tab" data-cat="knowledge">📚 Knowledge</button>
        </div>

        <div class="modal-emoji-grid" id="modal-emoji-grid"></div>

        <!-- Custom Write-in & Utility Buttons -->
        <div class="emoji-picker-footer">
          <div class="custom-emoji-row">
            <input type="text" class="custom-emoji-input" id="custom-emoji-input" placeholder="Type custom emoji..." maxlength="4" />
            <button class="btn-sm btn-primary" id="btn-apply-custom-emoji">Apply</button>
          </div>
          <div class="emoji-action-btns">
            <button class="btn-sm btn-outline" id="btn-random-emoji" title="Pick a random icon">🎲 Random</button>
            <button class="btn-sm btn-outline" id="btn-remove-emoji" title="Remove page icon">❌ Remove</button>
          </div>
        </div>
      </div>
    `;

    // Close button
    this.emojiPickerModal.querySelector('#emoji-picker-close').addEventListener('click', () => {
      this.emojiPickerModal.classList.remove('is-open');
    });

    // Backdrop click
    this.emojiPickerModal.addEventListener('click', (e) => {
      if (e.target === this.emojiPickerModal) this.emojiPickerModal.classList.remove('is-open');
    });

    // Category Tabs
    const catTabs = this.emojiPickerModal.querySelectorAll('.emoji-cat-tab');
    catTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        catTabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        const searchVal = this.emojiPickerModal.querySelector('#emoji-search-input').value;
        this.renderEmojiGrid(tab.dataset.cat, searchVal);
      });
    });

    // Search Input
    const searchInput = this.emojiPickerModal.querySelector('#emoji-search-input');
    searchInput.addEventListener('input', (e) => {
      const activeTab = this.emojiPickerModal.querySelector('.emoji-cat-tab.is-active');
      const cat = activeTab ? activeTab.dataset.cat : 'all';
      this.renderEmojiGrid(cat, e.target.value);
    });

    // Apply custom emoji
    const customInput = this.emojiPickerModal.querySelector('#custom-emoji-input');
    this.emojiPickerModal.querySelector('#btn-apply-custom-emoji').addEventListener('click', () => {
      const val = customInput.value.trim();
      if (val) {
        this.applySelectedEmoji(val);
      }
    });

    // Random Emoji
    this.emojiPickerModal.querySelector('#btn-random-emoji').addEventListener('click', () => {
      const randomItem = this.emojiList[Math.floor(Math.random() * this.emojiList.length)];
      if (randomItem) {
        this.applySelectedEmoji(randomItem.emoji);
      }
    });

    // Remove Emoji
    this.emojiPickerModal.querySelector('#btn-remove-emoji').addEventListener('click', () => {
      this.applySelectedEmoji('');
    });

    document.body.appendChild(this.emojiPickerModal);
  }

  renderEmojiGrid(cat = 'all', searchQuery = '') {
    const grid = this.emojiPickerModal.querySelector('#modal-emoji-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const q = searchQuery.toLowerCase().trim();

    const filtered = this.emojiList.filter(item => {
      const matchesCat = cat === 'all' || item.cat === cat;
      const matchesQuery = !q || item.emoji.includes(q) || item.name.includes(q) || item.cat.includes(q);
      return matchesCat && matchesQuery;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="empty-emoji-msg">No matching icons found for "${searchQuery}"</div>`;
      return;
    }

    filtered.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'emoji-select-btn';
      btn.textContent = item.emoji;
      btn.title = item.name;
      btn.addEventListener('click', () => {
        this.applySelectedEmoji(item.emoji);
      });
      grid.appendChild(btn);
    });
  }

  openEmojiPickerModal(targetPageId = null) {
    this.targetPageIdForEmoji = targetPageId || State.activePageId;
    const searchInput = this.emojiPickerModal.querySelector('#emoji-search-input');
    const customInput = this.emojiPickerModal.querySelector('#custom-emoji-input');
    if (searchInput) searchInput.value = '';
    if (customInput) customInput.value = '';

    const catTabs = this.emojiPickerModal.querySelectorAll('.emoji-cat-tab');
    catTabs.forEach(t => t.classList.toggle('is-active', t.dataset.cat === 'all'));

    this.renderEmojiGrid('all', '');
    this.emojiPickerModal.classList.add('is-open');

    setTimeout(() => {
      if (searchInput) searchInput.focus();
    }, 50);
  }

  applySelectedEmoji(emoji) {
    const pageId = this.targetPageIdForEmoji || State.activePageId;
    if (pageId && pageId !== '__trash__') {
      State.updatePage(pageId, { icon: emoji || null });
      this.showToast(emoji ? `Page icon updated to ${emoji}` : 'Page icon removed');
    }
    this.emojiPickerModal.classList.remove('is-open');
  }

  // --- Cover Picker Modal ---

  createCoverPickerModal() {
    this.coverPickerModal = document.createElement('div');
    this.coverPickerModal.className = 'picker-modal-backdrop';

    const presetCovers = [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop&q=80'
    ];

    let presetsHtml = '<div class="cover-presets-grid">';
    presetCovers.forEach(url => {
      presetsHtml += `<button class="cover-preset-thumbnail" data-url="${url}" style="background-image:url('${url}')"></button>`;
    });
    presetsHtml += '</div>';

    this.coverPickerModal.innerHTML = `
      <div class="cover-picker-box">
        <div class="picker-box-header">
          <h4>Select Cover Banner</h4>
          <button class="picker-close-btn" id="cover-picker-close">${Icons.get('x', 'icon-sm', 16)}</button>
        </div>
        <div class="cover-input-row">
          <input type="text" class="cover-url-input" placeholder="Paste custom image URL..." />
          <button class="btn-sm btn-primary apply-custom-cover-btn">Apply URL</button>
        </div>
        <div class="preset-section-label">Preset Gallery</div>
        ${presetsHtml}
      </div>
    `;

    this.coverPickerModal.querySelector('#cover-picker-close').addEventListener('click', () => {
      this.coverPickerModal.classList.remove('is-open');
    });

    this.coverPickerModal.addEventListener('click', (e) => {
      if (e.target === this.coverPickerModal) this.coverPickerModal.classList.remove('is-open');
    });

    this.coverPickerModal.querySelector('.apply-custom-cover-btn').addEventListener('click', () => {
      const url = this.coverPickerModal.querySelector('.cover-url-input').value.trim();
      const pageId = this.targetPageIdForCover || State.activePageId;
      if (url && pageId) {
        State.updatePage(pageId, { cover: url });
        this.showToast('Page cover updated');
        this.coverPickerModal.classList.remove('is-open');
      }
    });

    this.coverPickerModal.querySelectorAll('.cover-preset-thumbnail').forEach(btn => {
      btn.addEventListener('click', () => {
        const pageId = this.targetPageIdForCover || State.activePageId;
        if (pageId && btn.dataset.url) {
          State.updatePage(pageId, { cover: btn.dataset.url });
          this.showToast('Page cover updated');
          this.coverPickerModal.classList.remove('is-open');
        }
      });
    });

    document.body.appendChild(this.coverPickerModal);
  }

  openCoverPickerModal(targetPageId = null) {
    this.targetPageIdForCover = targetPageId || State.activePageId;
    const urlInput = this.coverPickerModal.querySelector('.cover-url-input');
    if (urlInput) urlInput.value = '';
    this.coverPickerModal.classList.add('is-open');
  }

  // --- Shortcuts Cheatsheet Modal ---

  createShortcutsModal() {
    this.shortcutsModal = document.createElement('div');
    this.shortcutsModal.className = 'shortcuts-modal-backdrop';
    this.shortcutsModal.innerHTML = `
      <div class="shortcuts-dialog-box">
        <div class="shortcuts-header">
          <div class="dialog-title-wrap">
            ${Icons.get('help', 'icon-sm', 16)}
            <h3>Keyboard Shortcuts</h3>
          </div>
          <button class="shortcuts-close-btn" id="shortcuts-modal-close">${Icons.get('x', 'icon-sm', 16)}</button>
        </div>
        <div class="shortcuts-grid">
          <div class="shortcut-group">
            <h4>Navigation & Global</h4>
            <div class="shortcut-row"><span>Command Palette / Search</span><kbd>Ctrl+K / Cmd+K</kbd></div>
            <div class="shortcut-row"><span>Toggle Sidebar</span><kbd>Ctrl+\\ / Cmd+\\</kbd></div>
            <div class="shortcut-row"><span>Keyboard Help</span><kbd>?</kbd></div>
          </div>
          <div class="shortcut-group">
            <h4>Document Editor</h4>
            <div class="shortcut-row"><span>Slash Command Menu</span><kbd>/</kbd></div>
            <div class="shortcut-row"><span>Duplicate Block</span><kbd>Ctrl+D / Cmd+D</kbd></div>
            <div class="shortcut-row"><span>Bold Selection</span><kbd>Ctrl+B / Cmd+B</kbd></div>
            <div class="shortcut-row"><span>Italic Selection</span><kbd>Ctrl+I / Cmd+I</kbd></div>
            <div class="shortcut-row"><span>Underline Selection</span><kbd>Ctrl+U / Cmd+U</kbd></div>
          </div>
          <div class="shortcut-group">
            <h4>Markdown Shortcuts</h4>
            <div class="shortcut-row"><span>Heading 1</span><kbd># [space]</kbd></div>
            <div class="shortcut-row"><span>Heading 2</span><kbd>## [space]</kbd></div>
            <div class="shortcut-row"><span>Bullet List</span><kbd>- [space]</kbd></div>
            <div class="shortcut-row"><span>To-do List</span><kbd>[] [space]</kbd></div>
            <div class="shortcut-row"><span>Code Block</span><kbd>\`\`\` [enter]</kbd></div>
            <div class="shortcut-row"><span>Divider</span><kbd>--- [enter]</kbd></div>
          </div>
        </div>
      </div>
    `;

    this.shortcutsModal.querySelector('#shortcuts-modal-close').addEventListener('click', () => {
      this.shortcutsModal.classList.remove('is-open');
    });

    this.shortcutsModal.addEventListener('click', (e) => {
      if (e.target === this.shortcutsModal) this.shortcutsModal.classList.remove('is-open');
    });

    document.body.appendChild(this.shortcutsModal);
  }

  openShortcutsModal() {
    this.shortcutsModal.classList.add('is-open');
  }

  // --- Settings Modal ---

  createSettingsModal() {
    this.settingsModal = document.createElement('div');
    this.settingsModal.className = 'settings-modal-backdrop';
    this.settingsModal.innerHTML = `
      <div class="settings-dialog-box">
        <div class="settings-header">
          <div class="dialog-title-wrap">
            ${Icons.get('settings', 'icon-sm', 16)}
            <h3>Workspace Settings</h3>
          </div>
          <button class="settings-close-btn" id="settings-modal-close">${Icons.get('x', 'icon-sm', 16)}</button>
        </div>
        <div class="settings-body">
          <div class="settings-row">
            <div class="setting-info">
              <div class="setting-title">Color Theme</div>
              <div class="setting-desc">Select workspace appearance and contrast.</div>
            </div>
            <div class="theme-options-group">
              <button class="theme-btn" data-theme="dark">Dark</button>
              <button class="theme-btn" data-theme="light">Light</button>
              <button class="theme-btn" data-theme="sepia">Sepia</button>
            </div>
          </div>

          <div class="settings-row">
            <div class="setting-info">
              <div class="setting-title">Typography & Font</div>
              <div class="setting-desc">Choose typography style for reading and writing.</div>
            </div>
            <div class="font-options-group">
              <button class="font-btn" data-font="sans">Sans (Inter)</button>
              <button class="font-btn" data-font="serif">Serif (Merriweather)</button>
              <button class="font-btn" data-font="mono">Mono (Code)</button>
            </div>
          </div>

          <div class="settings-divider"></div>

          <div class="settings-row">
            <div class="setting-info">
              <div class="setting-title">Reset Workspace Data</div>
              <div class="setting-desc">Restore sample templates and reload initial pages.</div>
            </div>
            <button class="btn-sm btn-danger" id="btn-reset-sample-data">Reset to Sample Data</button>
          </div>
        </div>
      </div>
    `;

    this.settingsModal.querySelector('#settings-modal-close').addEventListener('click', () => {
      this.settingsModal.classList.remove('is-open');
    });

    this.settingsModal.addEventListener('click', (e) => {
      if (e.target === this.settingsModal) this.settingsModal.classList.remove('is-open');
    });

    // Theme Switchers
    this.settingsModal.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        State.applyTheme(btn.dataset.theme);
        this.updateSettingsActiveStates();
      });
    });

    // Font Switchers
    this.settingsModal.querySelectorAll('.font-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        State.applyFont(btn.dataset.font);
        this.updateSettingsActiveStates();
      });
    });

    // Reset Data
    this.settingsModal.querySelector('#btn-reset-sample-data').addEventListener('click', async () => {
      if (confirm('Reset workspace to default sample data? This will replace your current pages.')) {
        await NoteSpaceDB.clearAll();
        await State.seedSampleData();
        await State.refreshPages();
        window.location.reload();
      }
    });

    document.body.appendChild(this.settingsModal);
  }

  openSettingsModal() {
    this.updateSettingsActiveStates();
    this.settingsModal.classList.add('is-open');
  }

  updateSettingsActiveStates() {
    this.settingsModal.querySelectorAll('.theme-btn').forEach(b => {
      b.classList.toggle('is-active', b.dataset.theme === State.theme);
    });
    this.settingsModal.querySelectorAll('.font-btn').forEach(b => {
      b.classList.toggle('is-active', b.dataset.font === State.font);
    });
  }

  openExportModal() {
    window.ExportImport?.open();
  }

  // --- Toast Notifications ---

  createToastContainer() {
    this.toastContainer = document.createElement('div');
    this.toastContainer.className = 'app-toast-container';
    document.body.appendChild(this.toastContainer);
  }

  showToast(message, duration = 2500) {
    const toast = document.createElement('div');
    toast.className = 'app-toast';
    toast.innerHTML = `${Icons.get('check', 'icon-xs', 13)} <span>${message}</span>`;
    this.toastContainer.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('is-visible'));

    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // --- Global Shortcuts ---

  attachGlobalHotkeys() {
    document.addEventListener('keydown', (e) => {
      // Toggle sidebar shortcut: Ctrl + \
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        State.toggleSidebar();
        return;
      }

      // Undo / Redo Shortcuts
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        // If not in standard input/textarea, handle custom block history undo
        if (!['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
          if (State.undoStack.length > 0) {
            e.preventDefault();
            State.undo();
            this.showToast('Undo');
          }
        }
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        if (!['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
          if (State.redoStack.length > 0) {
            e.preventDefault();
            State.redo();
            this.showToast('Redo');
          }
        }
      }

      // Help shortcuts: '?' when not typing in an input
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) && !document.activeElement?.isContentEditable) {
        e.preventDefault();
        this.openShortcutsModal();
      }
    });
  }
}

window.App = new AppController();

// Boot application reliably across all document loading states
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.App.init();
  });
} else {
  window.App.init();
}
