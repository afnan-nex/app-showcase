/**
 * NoteSpace - Workspace Sidebar Controller
 * Manages realistic nested tree navigation, favorites, recent pages, drag-to-nest, and page action menus.
 */

import { store } from '../state/store.js';
import { Icons, getIcon } from '../icons/icons.js';
import { toast } from '../utils/toast.js';
import { createElement, escapeHTML } from '../utils/dom.js';

export class Sidebar {
  constructor(sidebarEl, onOpenCommandPalette, onOpenSettings, onOpenTrash, onOpenHistory, onOpenShortcuts) {
    this.sidebarEl = sidebarEl;
    this.onOpenCommandPalette = onOpenCommandPalette;
    this.onOpenSettings = onOpenSettings;
    this.onOpenTrash = onOpenTrash;
    this.onOpenHistory = onOpenHistory;
    this.onOpenShortcuts = onOpenShortcuts;
    this.expandedNodes = new Set();
    this.draggedPageId = null;

    this.init();
  }

  init() {
    this.autoExpandActivePageParents();

    store.on('page-list-updated', () => this.render());
    store.on('active-page-changed', () => {
      this.autoExpandActivePageParents();
      this.render();
      // On mobile view, collapse sidebar when page is selected
      if (window.innerWidth <= 768) {
        document.body.classList.add('sidebar-collapsed');
      }
    });
    store.on('recents-updated', () => this.render());
    store.on('settings-updated', () => this.render());

    this.render();
  }

  autoExpandActivePageParents() {
    const activePage = store.getActivePage();
    if (!activePage) return;
    let cur = activePage;
    while (cur && cur.parentId) {
      this.expandedNodes.add(cur.parentId);
      cur = store.getPage(cur.parentId);
    }
  }

  render() {
    this.sidebarEl.innerHTML = '';

    const wsName = store.getSetting('workspaceName', 'My Workspace');
    const wsIcon = store.getSetting('workspaceIcon', '🪐');
    const activePage = store.getActivePage();
    const activePageId = activePage ? activePage.id : null;

    // 1. Workspace Header
    const header = createElement('div', 'ns-sidebar-header');
    header.innerHTML = `
      <div class="ns-ws-info" title="Workspace Settings" role="button" tabindex="0">
        <span class="ns-ws-icon">${wsIcon}</span>
        <span class="ns-ws-name">${escapeHTML(wsName)}</span>
      </div>
      <div class="ns-sidebar-header-actions">
        <button class="ns-icon-btn ns-btn-new-root-page" title="New Page (Root)" aria-label="New Page">
          ${Icons.plus}
        </button>
        <button class="ns-icon-btn ns-btn-toggle-sidebar" title="Collapse Sidebar" aria-label="Collapse Sidebar">
          ${Icons.sidebar}
        </button>
      </div>
    `;

    header.querySelector('.ns-ws-info').addEventListener('click', this.onOpenSettings);
    header.querySelector('.ns-btn-new-root-page').addEventListener('click', () => {
      store.createPage({ title: 'Untitled' });
      toast.success('Created new page');
    });
    header.querySelector('.ns-btn-toggle-sidebar').addEventListener('click', () => {
      document.body.classList.toggle('sidebar-collapsed');
    });

    this.sidebarEl.appendChild(header);

    // 2. Quick Actions
    const quickNav = createElement('div', 'ns-quick-nav');
    const trashCount = store.getAllPages().filter(p => p.isTrash).length;

    quickNav.innerHTML = `
      <button class="ns-nav-btn ns-btn-search" aria-label="Search and command palette">
        ${Icons.search} <span>Search & Commands</span> <kbd>Ctrl+K</kbd>
      </button>
      <button class="ns-nav-btn ns-btn-settings" aria-label="Settings and preferences">
        ${Icons.settings} <span>Settings & Style</span>
      </button>
      <button class="ns-nav-btn ns-btn-history" aria-label="Revision history">
        ${Icons.history} <span>Page History</span>
      </button>
      <button class="ns-nav-btn ns-btn-shortcuts" aria-label="Keyboard shortcuts">
        ${Icons.sparkles} <span>Shortcuts</span> <kbd>?</kbd>
      </button>
      <button class="ns-nav-btn ns-btn-trash" aria-label="Trash bin">
        ${Icons.trash} <span>Trash</span>
        ${trashCount > 0 ? `<span class="ns-trash-badge">${trashCount}</span>` : ''}
      </button>
    `;

    quickNav.querySelector('.ns-btn-search').addEventListener('click', this.onOpenCommandPalette);
    quickNav.querySelector('.ns-btn-settings').addEventListener('click', this.onOpenSettings);
    quickNav.querySelector('.ns-btn-history').addEventListener('click', this.onOpenHistory);
    quickNav.querySelector('.ns-btn-shortcuts').addEventListener('click', this.onOpenShortcuts);
    quickNav.querySelector('.ns-btn-trash').addEventListener('click', this.onOpenTrash);

    this.sidebarEl.appendChild(quickNav);

    // 3. Scrollable Tree Section
    const scrollContainer = createElement('div', 'ns-sidebar-scroll');

    // --- Favorites Section ---
    const favoritePages = store.getAllPages().filter(p => !p.isTrash && p.isFavorite);
    if (favoritePages.length > 0) {
      const favSection = createElement('div', 'ns-sidebar-section');
      favSection.innerHTML = `
        <div class="ns-section-header">
          <span class="ns-section-title">Favorites</span>
        </div>
        <div class="ns-fav-list"></div>
      `;
      const favList = favSection.querySelector('.ns-fav-list');
      favoritePages.forEach(p => {
        const item = this.createPageRowElement(p, activePageId, 0, false);
        favList.appendChild(item);
      });
      scrollContainer.appendChild(favSection);
    }

    // --- Recent Pages Section ---
    const recentIds = store.getSetting('recentPageIds', []) || [];
    const validRecents = recentIds
      .map(id => store.getPage(id))
      .filter(p => p && !p.isTrash && (!favoritePages.some(fp => fp.id === p.id)))
      .slice(0, 4);

    if (validRecents.length > 0) {
      const recSection = createElement('div', 'ns-sidebar-section');
      recSection.innerHTML = `
        <div class="ns-section-header">
          <span class="ns-section-title">Recent</span>
        </div>
        <div class="ns-recent-list"></div>
      `;
      const recList = recSection.querySelector('.ns-recent-list');
      validRecents.forEach(p => {
        const item = this.createPageRowElement(p, activePageId, 0, false);
        recList.appendChild(item);
      });
      scrollContainer.appendChild(recSection);
    }

    // --- Workspace Tree Section ---
    const wsSection = createElement('div', 'ns-sidebar-section');
    wsSection.innerHTML = `
      <div class="ns-section-header">
        <span class="ns-section-title">Workspace</span>
        <button class="ns-btn-section-add" title="Add Page" aria-label="Add Page">${Icons.plus}</button>
      </div>
      <div class="ns-tree-root"></div>
    `;

    wsSection.querySelector('.ns-btn-section-add').addEventListener('click', () => {
      store.createPage({ title: 'Untitled' });
      toast.success('Created new page');
    });

    const treeRoot = wsSection.querySelector('.ns-tree-root');
    this.renderTreeLevel(null, 0, treeRoot, activePageId);

    scrollContainer.appendChild(wsSection);
    this.sidebarEl.appendChild(scrollContainer);

    // 4. Sidebar Footer
    const footer = createElement('div', 'ns-sidebar-footer');
    footer.innerHTML = `
      <button class="ns-btn-quick-new-page" aria-label="New Page">
        ${Icons.plus} <span>New Page</span>
      </button>
      <button class="ns-btn-templates-loader" title="Templates" aria-label="Templates">
        ${Icons.template} <span>Templates</span>
      </button>
    `;

    footer.querySelector('.ns-btn-quick-new-page').addEventListener('click', () => {
      store.createPage({ title: 'Untitled' });
      toast.success('Created new page');
    });
    footer.querySelector('.ns-btn-templates-loader').addEventListener('click', () => {
      this.showTemplatesMenu(footer.querySelector('.ns-btn-templates-loader'));
    });

    this.sidebarEl.appendChild(footer);
  }

  renderTreeLevel(parentId, depth, containerEl, activePageId) {
    const allPages = store.getAllPages();
    const children = allPages
      .filter(p => p.parentId === parentId && !p.isTrash)
      .sort((a, b) => a.order - b.order);

    children.forEach(page => {
      const pageChildren = allPages.filter(p => p.parentId === page.id && !p.isTrash);
      const hasChildren = pageChildren.length > 0;
      const isExpanded = this.expandedNodes.has(page.id);

      const rowEl = this.createPageRowElement(page, activePageId, depth, true, hasChildren, isExpanded);
      containerEl.appendChild(rowEl);

      if (hasChildren && isExpanded) {
        const subContainer = createElement('div', 'ns-tree-sub-container');
        this.renderTreeLevel(page.id, depth + 1, subContainer, activePageId);
        containerEl.appendChild(subContainer);
      }
    });
  }

  createPageRowElement(page, activePageId, depth, isTree = true, hasChildren = false, isExpanded = false) {
    const row = createElement('div', `ns-page-row ${page.id === activePageId ? 'is-active' : ''}`);
    row.dataset.pageId = page.id;
    row.style.paddingLeft = `${12 + depth * 14}px`;

    let expanderIcon = '';
    if (isTree) {
      if (hasChildren) {
        expanderIcon = `<button class="ns-tree-expander ${isExpanded ? 'is-expanded' : ''}" title="Toggle Subpages" aria-label="Toggle Subpages">${Icons.chevronRight}</button>`;
      } else {
        expanderIcon = `<span class="ns-tree-expander-placeholder"></span>`;
      }
    }

    const iconDisplay = page.icon ? page.icon : Icons.fileText;

    row.innerHTML = `
      ${expanderIcon}
      <span class="ns-page-icon-slot">${iconDisplay}</span>
      <span class="ns-page-title-slot">${escapeHTML(page.title || 'Untitled')}</span>
      <div class="ns-page-row-actions">
        <button class="ns-row-act-btn ns-btn-add-subpage" title="Add subpage" aria-label="Add subpage">${Icons.plus}</button>
        <button class="ns-row-act-btn ns-btn-page-more" title="More actions" aria-label="More actions">${Icons.moreHorizontal}</button>
      </div>
    `;

    // Click row to navigate
    row.addEventListener('click', (e) => {
      if (e.target.closest('.ns-tree-expander') || e.target.closest('.ns-page-row-actions')) {
        return;
      }
      store.setActivePage(page.id);
    });

    // Expand / Collapse toggle
    const expander = row.querySelector('.ns-tree-expander');
    if (expander) {
      expander.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.expandedNodes.has(page.id)) {
          this.expandedNodes.delete(page.id);
        } else {
          this.expandedNodes.add(page.id);
        }
        this.render();
      });
    }

    // Add subpage
    const addSubBtn = row.querySelector('.ns-btn-add-subpage');
    if (addSubBtn) {
      addSubBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.expandedNodes.add(page.id);
        store.createPage({ parentId: page.id, title: 'Untitled' });
        toast.success(`Added subpage under "${page.title || 'Untitled'}"`);
      });
    }

    // More actions menu
    const moreBtn = row.querySelector('.ns-btn-page-more');
    if (moreBtn) {
      moreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showPageContextMenu(moreBtn, page);
      });
    }

    // Drag-to-nest and reorder listeners
    if (isTree) {
      this.setupTreeDragAndDrop(row, page);
    }

    return row;
  }

  setupTreeDragAndDrop(rowEl, page) {
    rowEl.setAttribute('draggable', 'true');

    rowEl.addEventListener('dragstart', (e) => {
      this.draggedPageId = page.id;
      rowEl.classList.add('is-dragging-tree-row');
      e.dataTransfer.setData('text/plain', page.id);
    });

    rowEl.addEventListener('dragend', () => {
      rowEl.classList.remove('is-dragging-tree-row');
      document.querySelectorAll('.ns-tree-drop-inside, .ns-tree-drop-above, .ns-tree-drop-below').forEach(el => {
        el.classList.remove('ns-tree-drop-inside', 'ns-tree-drop-above', 'ns-tree-drop-below');
      });
    });

    rowEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (!this.draggedPageId || this.draggedPageId === page.id) return;

      const rect = rowEl.getBoundingClientRect();
      const relY = e.clientY - rect.top;

      rowEl.classList.remove('ns-tree-drop-inside', 'ns-tree-drop-above', 'ns-tree-drop-below');

      if (relY < rect.height * 0.25) {
        rowEl.classList.add('ns-tree-drop-above');
      } else if (relY > rect.height * 0.75) {
        rowEl.classList.add('ns-tree-drop-below');
      } else {
        rowEl.classList.add('ns-tree-drop-inside');
      }
    });

    rowEl.addEventListener('dragleave', () => {
      rowEl.classList.remove('ns-tree-drop-inside', 'ns-tree-drop-above', 'ns-tree-drop-below');
    });

    rowEl.addEventListener('drop', (e) => {
      e.preventDefault();
      const draggedId = this.draggedPageId;
      if (!draggedId || draggedId === page.id) return;

      const rect = rowEl.getBoundingClientRect();
      const relY = e.clientY - rect.top;

      if (relY >= rect.height * 0.25 && relY <= rect.height * 0.75) {
        this.expandedNodes.add(page.id);
        store.reorderPages(draggedId, page.id, 0);
        toast.info('Moved page into sub-folder');
      } else if (relY < rect.height * 0.25) {
        store.reorderPages(draggedId, page.parentId, Math.max(0, page.order));
      } else {
        store.reorderPages(draggedId, page.parentId, page.order + 1);
      }

      this.draggedPageId = null;
    });
  }

  showPageContextMenu(targetBtn, page) {
    document.querySelectorAll('.ns-context-menu').forEach(m => m.remove());

    const menu = createElement('div', 'ns-context-menu');
    menu.innerHTML = `
      <div class="ns-menu-item" data-action="favorite">
        ${page.isFavorite ? Icons.starFilled : Icons.star}
        <span>${page.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
      </div>
      <div class="ns-menu-item" data-action="duplicate">
        ${Icons.copy} <span>Duplicate Page</span>
      </div>
      <div class="ns-menu-item" data-action="new-subpage">
        ${Icons.plus} <span>Add Subpage</span>
      </div>
      <div class="ns-menu-divider"></div>
      <div class="ns-menu-item ns-menu-danger" data-action="trash">
        ${Icons.trash} <span>Move to Trash</span>
      </div>
    `;

    document.body.appendChild(menu);
    const rect = targetBtn.getBoundingClientRect();
    let top = rect.bottom + window.scrollY + 4;
    let left = rect.left + window.scrollX;

    if (top + 200 > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - 200;
    }

    menu.style.top = `${Math.max(10, top)}px`;
    menu.style.left = `${Math.max(10, left)}px`;

    menu.querySelector('[data-action="favorite"]').addEventListener('click', async () => {
      const isFav = await store.toggleFavorite(page.id);
      toast.info(isFav ? 'Added to Favorites' : 'Removed from Favorites');
      menu.remove();
    });

    menu.querySelector('[data-action="duplicate"]').addEventListener('click', async () => {
      await store.duplicatePage(page.id);
      toast.success('Page duplicated');
      menu.remove();
    });

    menu.querySelector('[data-action="new-subpage"]').addEventListener('click', () => {
      this.expandedNodes.add(page.id);
      store.createPage({ parentId: page.id, title: 'Untitled' });
      toast.success('Added subpage');
      menu.remove();
    });

    menu.querySelector('[data-action="trash"]').addEventListener('click', async () => {
      await store.moveToTrash(page.id);
      toast.show(`Moved "${page.title || 'Untitled'}" to trash`, 'trash');
      menu.remove();
    });

    const closeHandler = (e) => {
      if (!menu.contains(e.target) && !targetBtn.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }

  showTemplatesMenu(targetBtn) {
    document.querySelectorAll('.ns-picker-popover').forEach(p => p.remove());

    const popover = createElement('div', 'ns-picker-popover ns-templates-popover');
    popover.innerHTML = `
      <div class="ns-picker-title">Create from Template</div>
      <div class="ns-templates-list">
        <button class="ns-template-opt" data-type="meeting">
          <span class="ns-template-icon">📝</span>
          <div class="ns-template-info">
            <div class="ns-template-name">Meeting Notes</div>
            <div class="ns-template-desc">Agenda, attendees, and action items checklist.</div>
          </div>
        </button>
        <button class="ns-template-opt" data-type="habits">
          <span class="ns-template-icon">🔥</span>
          <div class="ns-template-info">
            <div class="ns-template-name">Sprint Retrospective</div>
            <div class="ns-template-desc">Went well, needs improvement, action items.</div>
          </div>
        </button>
        <button class="ns-template-opt" data-type="wiki">
          <span class="ns-template-icon">📖</span>
          <div class="ns-template-info">
            <div class="ns-template-name">Knowledge Base RFC</div>
            <div class="ns-template-desc">Architecture RFC with design principles and toggles.</div>
          </div>
        </button>
      </div>
    `;

    document.body.appendChild(popover);
    const rect = targetBtn.getBoundingClientRect();
    popover.style.top = `${rect.top + window.scrollY - 220}px`;
    popover.style.left = `${Math.max(10, rect.left + window.scrollX)}px`;

    popover.querySelectorAll('.ns-template-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        this.instantiateTemplate(type);
        popover.remove();
      });
    });

    const closeHandler = (e) => {
      if (!popover.contains(e.target) && !targetBtn.contains(e.target)) {
        popover.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }

  instantiateTemplate(type) {
    if (type === 'meeting') {
      store.createPage({
        title: `Meeting Notes — ${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`,
        icon: '📝',
        cover: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        blocks: [
          { id: 'b-m-1', type: 'callout', content: 'Session agenda, discussion highlights, and assigned deliverables.', metadata: { icon: '💡', color: 'blue' } },
          { id: 'b-m-2', type: 'heading2', content: '👥 Attendees' },
          { id: 'b-m-3', type: 'bulletList', content: 'Marcus Vance' },
          { id: 'b-m-4', type: 'bulletList', content: 'Elena Rostova' },
          { id: 'b-m-5', type: 'heading2', content: '📋 Discussion Topics' },
          { id: 'b-m-6', type: 'numberedList', content: 'Review sprint deliverables and milestones' },
          { id: 'b-m-7', type: 'numberedList', content: 'Address blockers and architecture questions' },
          { id: 'b-m-8', type: 'heading2', content: '✅ Action Items' },
          { id: 'b-m-9', type: 'checklist', content: 'Finalize schema validator documentation', metadata: { checked: false } },
          { id: 'b-m-10', type: 'checklist', content: 'Publish release v2.0 update', metadata: { checked: false } }
        ]
      });
      toast.success('Loaded Meeting Notes template');
    } else if (type === 'habits') {
      store.createPage({
        title: 'Sprint Retrospective',
        icon: '🔥',
        cover: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)',
        blocks: [
          { id: 'b-hb-1', type: 'heading2', content: '🟢 What Went Well' },
          { id: 'b-hb-2', type: 'checklist', content: 'Zero downtime during IndexedDB migration', metadata: { checked: true } },
          { id: 'b-hb-3', type: 'checklist', content: 'Smooth drag-and-drop feedback from beta testers', metadata: { checked: true } },
          { id: 'b-hb-4', type: 'heading2', content: '🔴 Needs Improvement' },
          { id: 'b-hb-5', type: 'checklist', content: 'Speed up cold-start query times on large database tables', metadata: { checked: false } },
          { id: 'b-hb-6', type: 'heading2', content: '🎯 Key Takeaways' },
          { id: 'b-hb-7', type: 'paragraph', content: 'Keep component decoupling strict and avoid global DOM queries.' }
        ]
      });
      toast.success('Loaded Retrospective template');
    } else if (type === 'wiki') {
      store.createPage({
        title: 'Architecture RFC Document',
        icon: '📖',
        cover: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
        blocks: [
          { id: 'b-wk-1', type: 'callout', content: 'Technical RFC for local-first synchronization and conflict resolution.', metadata: { icon: '🏛️', color: 'green' } },
          { id: 'b-wk-2', type: 'heading1', content: 'Problem Statement' },
          { id: 'b-wk-3', type: 'paragraph', content: 'Provide zero-latency writes while supporting immutable history rollback.' },
          { id: 'b-wk-4', type: 'heading2', content: 'Technical Approach' },
          { id: 'b-wk-5', type: 'toggle', content: '▶ View Proposed Invariant Rules', metadata: { isOpen: false, children: '• Rule 1: In-memory store updates before IDB dispatch\n• Rule 2: Automatic snapshot on significant content delta\n• Rule 3: Graceful fallback to LocalStorage if quota exceeded' } }
        ]
      });
      toast.success('Loaded RFC template');
    }
  }
}
