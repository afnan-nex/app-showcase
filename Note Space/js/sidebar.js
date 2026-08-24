/**
 * NoteSpace - Sidebar & Tree Navigation (Production Polish)
 * Supports workspace switcher, mobile responsive drawer, drag-and-drop page moving,
 * favorites, recents, page context menus, and resizable width.
 */
class Sidebar {
  constructor() {
    this.container = null;
    this.expandedPageIds = new Set(['page_eng_handbook']);
    this.draggedPageId = null;
    this.pageContextMenu = null;
    this.wsMenuPopover = null;
    this.isResizing = false;
    this.init();
  }

  init() {
    this.createContextMenuElement();
    this.createWorkspacePopoverElement();
    this.attachGlobalEvents();
  }

  mount(container) {
    this.container = container;
    this.render();

    // Listen to state changes
    State.on('pages:updated', () => this.render());
    State.on('page:changed', () => {
      this.render();
      // On mobile viewports, auto-close sidebar on page switch
      if (window.innerWidth <= 768 && !State.sidebarCollapsed) {
        State.toggleSidebar(true);
      }
    });
    State.on('sidebar:toggled', (collapsed) => {
      document.body.classList.toggle('sidebar-collapsed', collapsed);
      const backdrop = document.getElementById('sidebar-mobile-backdrop');
      if (backdrop) {
        backdrop.classList.toggle('is-visible', !collapsed && window.innerWidth <= 768);
      }
    });
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';

    const ws = State.workspace || { name: 'Acme Cloud Infrastructure', icon: '⚡' };
    const pages = State.pages || [];
    const activeId = State.activePageId;

    const sidebarInner = document.createElement('div');
    sidebarInner.className = 'sidebar-inner';
    sidebarInner.setAttribute('role', 'navigation');
    sidebarInner.setAttribute('aria-label', 'Main Sidebar Navigation');

    // 1. Workspace Header (Clickable for Workspace Switcher Popover)
    const wsHeader = document.createElement('div');
    wsHeader.className = 'sidebar-ws-header';
    wsHeader.innerHTML = `
      <div class="ws-info" id="ws-switcher-trigger" title="Switch or create workspace">
        <span class="ws-icon">${ws.icon || '⚡'}</span>
        <span class="ws-name">${ws.name}</span>
        ${Icons.get('chevronDown', 'icon-xs ws-chevron', 12)}
      </div>
      <button class="sidebar-collapse-btn" id="sidebar-collapse-toggle" title="Collapse Sidebar (Ctrl+\\)" aria-label="Collapse sidebar">
        ${Icons.get('sidebar', 'icon-sm', 16)}
      </button>
    `;

    wsHeader.querySelector('#ws-switcher-trigger').addEventListener('click', (e) => {
      e.stopPropagation();
      this.openWorkspacePopover(e);
    });

    wsHeader.querySelector('#sidebar-collapse-toggle').addEventListener('click', () => {
      State.toggleSidebar();
    });

    sidebarInner.appendChild(wsHeader);

    // 2. Quick Action Links
    const quickLinks = document.createElement('div');
    quickLinks.className = 'sidebar-quick-links';
    quickLinks.innerHTML = `
      <button class="quick-link-btn" id="btn-quick-search" aria-label="Search pages">
        ${Icons.get('search', 'icon-sm', 15)}
        <span>Search</span>
        <kbd>Ctrl+K</kbd>
      </button>
      <button class="quick-link-btn" id="btn-quick-new" aria-label="Create new page">
        ${Icons.get('pagePlus', 'icon-sm', 15)}
        <span>New Page</span>
      </button>
      <button class="quick-link-btn" id="btn-quick-settings" aria-label="Open settings">
        ${Icons.get('settings', 'icon-sm', 15)}
        <span>Settings</span>
      </button>
      <button class="quick-link-btn" id="btn-quick-shortcuts" aria-label="Keyboard Shortcuts">
        ${Icons.get('help', 'icon-sm', 15)}
        <span>Shortcuts</span>
        <kbd>?</kbd>
      </button>
    `;

    quickLinks.querySelector('#btn-quick-search').addEventListener('click', () => {
      window.CommandPalette?.open();
    });
    quickLinks.querySelector('#btn-quick-new').addEventListener('click', () => {
      State.createPage(null, 'Untitled');
    });
    quickLinks.querySelector('#btn-quick-settings').addEventListener('click', () => {
      window.App?.openSettingsModal();
    });
    quickLinks.querySelector('#btn-quick-shortcuts').addEventListener('click', () => {
      window.App?.openShortcutsModal();
    });

    sidebarInner.appendChild(quickLinks);

    // 3. Favorites Section
    const favPages = pages.filter(p => p.isFavorite && !p.inTrash);
    if (favPages.length > 0) {
      const favSection = document.createElement('div');
      favSection.className = 'sidebar-section';
      favSection.innerHTML = `<div class="sidebar-section-header">Favorites</div>`;
      
      const favList = document.createElement('div');
      favList.className = 'sidebar-nav-list';
      favPages.forEach(p => {
        favList.appendChild(this.renderPageNavItem(p, activeId, 0, false));
      });
      favSection.appendChild(favList);
      sidebarInner.appendChild(favSection);
    }

    // 4. Main Pages Tree Section
    const pagesSection = document.createElement('div');
    pagesSection.className = 'sidebar-section main-pages-section';
    pagesSection.innerHTML = `
      <div class="sidebar-section-header">
        <span>Workspace</span>
        <button class="section-add-btn" title="Add root page" aria-label="Add root page">${Icons.get('plus', 'icon-xs', 13)}</button>
      </div>
    `;

    pagesSection.querySelector('.section-add-btn').addEventListener('click', () => {
      State.createPage(null, 'Untitled');
    });

    const rootPages = pages.filter(p => !p.parentId && !p.inTrash);
    const treeList = document.createElement('div');
    treeList.className = 'sidebar-nav-list page-tree-root';
    treeList.setAttribute('role', 'tree');

    rootPages.forEach(p => {
      treeList.appendChild(this.renderTreeNode(p, pages, activeId, 0));
    });

    pagesSection.appendChild(treeList);
    sidebarInner.appendChild(pagesSection);

    // 5. Sidebar Bottom Area (Trash & Import/Export)
    const bottomSection = document.createElement('div');
    bottomSection.className = 'sidebar-bottom-section';

    const trashedPages = pages.filter(p => p.inTrash);
    const trashBtn = document.createElement('button');
    trashBtn.className = `sidebar-bottom-btn ${activeId === '__trash__' ? 'is-active' : ''}`;
    trashBtn.innerHTML = `
      ${Icons.get('trash', 'icon-sm', 15)}
      <span>Trash</span>
      ${trashedPages.length > 0 ? `<span class="trash-count-badge">${trashedPages.length}</span>` : ''}
    `;
    trashBtn.addEventListener('click', () => {
      State.setActivePage('__trash__');
    });

    const exportBtn = document.createElement('button');
    exportBtn.className = 'sidebar-bottom-btn';
    exportBtn.innerHTML = `
      ${Icons.get('download', 'icon-sm', 15)}
      <span>Export / Import</span>
    `;
    exportBtn.addEventListener('click', () => {
      window.App?.openExportModal();
    });

    bottomSection.appendChild(trashBtn);
    bottomSection.appendChild(exportBtn);
    sidebarInner.appendChild(bottomSection);

    this.container.appendChild(sidebarInner);

    // 6. Resize Drag Handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'sidebar-resize-handle';
    this.attachResizeEvents(resizeHandle);
    this.container.appendChild(resizeHandle);
  }

  renderTreeNode(page, allPages, activeId, depth) {
    const wrap = document.createElement('div');
    wrap.className = 'tree-node-wrap';

    const childPages = allPages.filter(p => p.parentId === page.id && !p.inTrash);
    const hasChildren = childPages.length > 0;
    const isExpanded = this.expandedPageIds.has(page.id);

    const navItem = this.renderPageNavItem(page, activeId, depth, hasChildren, isExpanded);
    wrap.appendChild(navItem);

    if (hasChildren && isExpanded) {
      const subTree = document.createElement('div');
      subTree.className = 'tree-sub-list';
      subTree.setAttribute('role', 'group');
      childPages.forEach(child => {
        subTree.appendChild(this.renderTreeNode(child, allPages, activeId, depth + 1));
      });
      wrap.appendChild(subTree);
    }

    return wrap;
  }

  renderPageNavItem(page, activeId, depth, hasChildren = false, isExpanded = false) {
    const item = document.createElement('div');
    item.className = `sidebar-nav-item ${page.id === activeId ? 'is-active' : ''}`;
    item.dataset.pageId = page.id;
    item.style.paddingLeft = `${10 + depth * 14}px`;
    item.setAttribute('role', 'treeitem');
    item.setAttribute('aria-expanded', hasChildren ? (isExpanded ? 'true' : 'false') : 'none');

    // Drag and drop page reordering
    item.draggable = true;
    this.attachPageDragEvents(item, page.id);

    // Chevron Arrow
    const arrow = document.createElement('button');
    arrow.className = `tree-arrow-btn ${hasChildren ? '' : 'is-hidden'} ${isExpanded ? 'is-expanded' : ''}`;
    arrow.innerHTML = Icons.get('chevronRight', 'icon-xs', 12);
    arrow.setAttribute('aria-label', isExpanded ? 'Collapse section' : 'Expand section');
    arrow.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.expandedPageIds.has(page.id)) {
        this.expandedPageIds.delete(page.id);
      } else {
        this.expandedPageIds.add(page.id);
      }
      this.render();
    });

    // Page Icon
    const iconSpan = document.createElement('span');
    iconSpan.className = 'nav-page-icon';
    iconSpan.textContent = page.icon || '📄';

    // Page Title
    const titleSpan = document.createElement('span');
    titleSpan.className = 'nav-page-title';
    titleSpan.textContent = page.title || 'Untitled';

    // Hover Controls (+ Subpage & ... Context Menu)
    const hoverControls = document.createElement('div');
    hoverControls.className = 'nav-hover-controls';

    const addSubBtn = document.createElement('button');
    addSubBtn.className = 'nav-ctrl-btn';
    addSubBtn.title = 'Add subpage';
    addSubBtn.setAttribute('aria-label', `Add subpage to ${page.title}`);
    addSubBtn.innerHTML = Icons.get('plus', 'icon-xs', 12);
    addSubBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.expandedPageIds.add(page.id);
      State.createPage(page.id, 'Untitled');
    });

    const moreBtn = document.createElement('button');
    moreBtn.className = 'nav-ctrl-btn';
    moreBtn.title = 'Page options';
    moreBtn.setAttribute('aria-label', `More options for ${page.title}`);
    moreBtn.innerHTML = Icons.get('moreHorizontal', 'icon-xs', 12);
    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openPageContextMenu(e, page);
    });

    hoverControls.appendChild(addSubBtn);
    hoverControls.appendChild(moreBtn);

    item.appendChild(arrow);
    item.appendChild(iconSpan);
    item.appendChild(titleSpan);
    item.appendChild(hoverControls);

    // Click to activate page
    item.addEventListener('click', () => {
      State.setActivePage(page.id);
    });

    // Right-click context menu
    item.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.openPageContextMenu(e, page);
    });

    return item;
  }

  // --- Drag and Drop Pages ---

  attachPageDragEvents(el, pageId) {
    el.addEventListener('dragstart', (e) => {
      this.draggedPageId = pageId;
      el.classList.add('is-dragging');
      e.dataTransfer.setData('text/plain', pageId);
    });

    el.addEventListener('dragend', () => {
      el.classList.remove('is-dragging');
      this.container.querySelectorAll('.nav-drop-above, .nav-drop-below, .nav-drop-inside').forEach(elem => {
        elem.classList.remove('nav-drop-above', 'nav-drop-below', 'nav-drop-inside');
      });
    });

    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (!this.draggedPageId || this.draggedPageId === pageId) return;

      const rect = el.getBoundingClientRect();
      const relY = e.clientY - rect.top;
      const h = rect.height;

      el.classList.remove('nav-drop-above', 'nav-drop-below', 'nav-drop-inside');

      if (relY < h * 0.25) {
        el.classList.add('nav-drop-above');
      } else if (relY > h * 0.75) {
        el.classList.add('nav-drop-below');
      } else {
        el.classList.add('nav-drop-inside');
      }
    });

    el.addEventListener('dragleave', () => {
      el.classList.remove('nav-drop-above', 'nav-drop-below', 'nav-drop-inside');
    });

    el.addEventListener('drop', (e) => {
      e.preventDefault();
      if (!this.draggedPageId || this.draggedPageId === pageId) return;

      const targetPage = State.pages.find(p => p.id === pageId);
      if (!targetPage) return;

      if (el.classList.contains('nav-drop-inside')) {
        State.movePage(this.draggedPageId, targetPage.id);
        this.expandedPageIds.add(targetPage.id);
      } else if (el.classList.contains('nav-drop-above')) {
        State.movePage(this.draggedPageId, targetPage.parentId, targetPage.order);
      } else {
        State.movePage(this.draggedPageId, targetPage.parentId, targetPage.order + 1);
      }

      el.classList.remove('nav-drop-above', 'nav-drop-below', 'nav-drop-inside');
    });
  }

  // --- Workspace Popover ---

  createWorkspacePopoverElement() {
    this.wsMenuPopover = document.createElement('div');
    this.wsMenuPopover.className = 'workspace-switcher-popover';
    document.body.appendChild(this.wsMenuPopover);
  }

  async openWorkspacePopover(e) {
    const workspaces = await NoteSpaceDB.getAll('workspaces');
    const currentWs = State.workspace;

    let html = `
      <div class="ws-popover-header">Workspaces</div>
      <div class="ws-popover-list">
    `;

    workspaces.forEach(w => {
      const isSelected = w.id === currentWs?.id;
      html += `
        <div class="ws-popover-item ${isSelected ? 'is-active' : ''}" data-ws-id="${w.id}">
          <span class="ws-popover-icon">${w.icon || '⚡'}</span>
          <div class="ws-popover-meta">
            <div class="ws-popover-name">${w.name}</div>
            <div class="ws-popover-plan">${w.plan || 'Free Plan'}</div>
          </div>
          ${isSelected ? Icons.get('check', 'icon-xs ws-active-check', 13) : ''}
        </div>
      `;
    });

    html += `
      </div>
      <div class="ws-popover-divider"></div>
      <button class="ws-popover-action" id="btn-create-workspace">
        ${Icons.get('plus', 'icon-xs', 13)} Create New Workspace
      </button>
    `;

    this.wsMenuPopover.innerHTML = html;

    // Switch workspace click
    this.wsMenuPopover.querySelectorAll('.ws-popover-item').forEach(item => {
      item.addEventListener('click', async () => {
        const wsId = item.dataset.wsId;
        const target = workspaces.find(w => w.id === wsId);
        if (target) {
          State.workspace = target;
          await State.refreshPages();
          if (State.pages.length > 0) {
            await State.setActivePage(State.pages[0].id);
          }
          this.closeWorkspacePopover();
          window.App?.showToast(`Switched to "${target.name}"`);
        }
      });
    });

    // Create workspace click
    this.wsMenuPopover.querySelector('#btn-create-workspace').addEventListener('click', async () => {
      const name = prompt('Enter new workspace name:', 'Engineering Hub');
      if (name && name.trim()) {
        const newWs = {
          id: 'ws_' + Date.now(),
          name: name.trim(),
          icon: '🚀',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          plan: 'Team Space'
        };
        await NoteSpaceDB.put('workspaces', newWs);
        State.workspace = newWs;
        
        // Create initial page for new workspace
        await State.createPage(null, 'Welcome to ' + newWs.name);
        this.closeWorkspacePopover();
        window.App?.showToast(`Created workspace "${newWs.name}"`);
      }
    });

    const target = e.currentTarget || e.target;
    if (target && target.getBoundingClientRect) {
      const rect = target.getBoundingClientRect();
      this.wsMenuPopover.style.top = `${rect.bottom + window.scrollY + 6}px`;
      this.wsMenuPopover.style.left = `${Math.max(10, rect.left + window.scrollX)}px`;
    }
    this.wsMenuPopover.classList.add('is-visible');
  }

  closeWorkspacePopover() {
    if (this.wsMenuPopover) {
      this.wsMenuPopover.classList.remove('is-visible');
    }
  }

  // --- Context Menu ---

  createContextMenuElement() {
    this.pageContextMenu = document.createElement('div');
    this.pageContextMenu.className = 'page-context-menu';
    document.body.appendChild(this.pageContextMenu);
  }

  openPageContextMenu(e, page) {
    if (e && e.stopPropagation) e.stopPropagation();

    this.pageContextMenu.innerHTML = `
      <div class="menu-header-title">${page.title}</div>
      <button class="menu-action-btn" data-act="changeIcon">${Icons.get('smile', 'icon-xs', 13)} Change Icon</button>
      <button class="menu-action-btn" data-act="changeCover">${Icons.get('image', 'icon-xs', 13)} ${page.cover ? 'Change Cover' : 'Add Cover'}</button>
      <button class="menu-action-btn" data-act="addSubpage">${Icons.get('plus', 'icon-xs', 13)} Add subpage</button>
      <button class="menu-action-btn" data-act="toggleFav">${Icons.get(page.isFavorite ? 'starFilled' : 'star', 'icon-xs', 13)} ${page.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</button>
      <button class="menu-action-btn" data-act="duplicate">${Icons.get('copy', 'icon-xs', 13)} Duplicate</button>
      <button class="menu-action-btn" data-act="rename">${Icons.get('edit', 'icon-xs', 13)} Rename</button>
      <div class="menu-divider"></div>
      <button class="menu-action-btn" data-act="exportMd">${Icons.get('download', 'icon-xs', 13)} Export as Markdown</button>
      <button class="menu-action-btn" data-act="exportHtml">${Icons.get('download', 'icon-xs', 13)} Export as HTML</button>
      <div class="menu-divider"></div>
      <button class="menu-action-btn" data-act="delete" style="color:var(--color-danger);">${Icons.get('trash', 'icon-xs', 13)} Move to Trash</button>
    `;

    this.pageContextMenu.querySelector('[data-act="changeIcon"]').addEventListener('click', () => {
      this.closePageContextMenu();
      window.App?.openEmojiPickerModal(page.id);
    });

    this.pageContextMenu.querySelector('[data-act="changeCover"]').addEventListener('click', () => {
      this.closePageContextMenu();
      window.App?.openCoverPickerModal(page.id);
    });

    this.pageContextMenu.querySelector('[data-act="addSubpage"]').addEventListener('click', () => {
      this.expandedPageIds.add(page.id);
      State.createPage(page.id, 'Untitled');
      this.closePageContextMenu();
    });

    this.pageContextMenu.querySelector('[data-act="toggleFav"]').addEventListener('click', () => {
      State.toggleFavorite(page.id);
      this.closePageContextMenu();
    });

    this.pageContextMenu.querySelector('[data-act="duplicate"]').addEventListener('click', () => {
      State.duplicatePage(page.id);
      this.closePageContextMenu();
    });

    this.pageContextMenu.querySelector('[data-act="rename"]').addEventListener('click', () => {
      const newTitle = prompt('Rename page:', page.title);
      if (newTitle !== null && newTitle.trim()) {
        State.updatePage(page.id, { title: newTitle.trim() });
      }
      this.closePageContextMenu();
    });

    this.pageContextMenu.querySelector('[data-act="exportMd"]').addEventListener('click', () => {
      window.ExportImport?.exportPageMarkdown(page.id);
      this.closePageContextMenu();
    });

    this.pageContextMenu.querySelector('[data-act="exportHtml"]').addEventListener('click', () => {
      window.ExportImport?.exportPageHTML(page.id);
      this.closePageContextMenu();
    });

    this.pageContextMenu.querySelector('[data-act="delete"]').addEventListener('click', () => {
      State.deletePage(page.id, false);
      this.closePageContextMenu();
    });

    const targetEl = e.currentTarget || e.target;
    if (targetEl && targetEl.getBoundingClientRect) {
      const rect = targetEl.getBoundingClientRect();
      this.pageContextMenu.style.top = `${rect.bottom + window.scrollY + 4}px`;
      this.pageContextMenu.style.left = `${Math.min(window.innerWidth - 240, Math.max(10, rect.left + window.scrollX))}px`;
    } else {
      this.pageContextMenu.style.top = `${(e.clientY || 50) + window.scrollY}px`;
      this.pageContextMenu.style.left = `${Math.min(window.innerWidth - 240, (e.clientX || 100) + window.scrollX)}px`;
    }
    this.pageContextMenu.classList.add('is-visible');
  }

  closePageContextMenu() {
    if (this.pageContextMenu) {
      this.pageContextMenu.classList.remove('is-visible');
    }
  }

  // --- Resizable Sidebar ---

  attachResizeEvents(handle) {
    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.isResizing = true;
      document.body.classList.add('is-resizing-sidebar');

      const onMouseMove = (moveEvt) => {
        if (!this.isResizing) return;
        const newWidth = Math.max(180, Math.min(480, moveEvt.clientX));
        document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
        State.setSidebarWidth(newWidth);
      };

      const onMouseUp = () => {
        this.isResizing = false;
        document.body.classList.remove('is-resizing-sidebar');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  attachGlobalEvents() {
    document.addEventListener('click', (e) => {
      if (this.pageContextMenu && !this.pageContextMenu.contains(e.target)) {
        this.closePageContextMenu();
      }
      if (this.wsMenuPopover && !this.wsMenuPopover.contains(e.target)) {
        this.closeWorkspacePopover();
      }
    });
  }
}

window.Sidebar = Sidebar;
