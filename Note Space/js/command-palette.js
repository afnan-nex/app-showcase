/**
 * NoteSpace - Command Palette & Global Search Engine (Ctrl+K / Cmd+K)
 * Fuzzy full-text indexing, match highlighting, and instant keyboard actions.
 */
class CommandPalette {
  constructor() {
    this.modal = null;
    this.input = null;
    this.resultsContainer = null;
    this.selectedIndex = 0;
    this.results = [];
    this.isOpen = false;
    this.init();
  }

  init() {
    if (document.body) {
      this.createModalElement();
    } else {
      document.addEventListener('DOMContentLoaded', () => this.createModalElement());
    }
    this.attachHotkeys();
  }

  createModalElement() {
    this.modal = document.createElement('div');
    this.modal.className = 'command-palette-backdrop';
    this.modal.innerHTML = `
      <div class="command-palette-box">
        <div class="palette-input-wrap">
          ${Icons.get('search', 'palette-search-icon', 18)}
          <input type="text" class="palette-input" placeholder="Search pages, blocks, or run a command..." spellcheck="false" />
          <kbd class="palette-esc-badge">ESC</kbd>
        </div>
        <div class="palette-results-list"></div>
        <div class="palette-footer">
          <div class="palette-tip"><span>↑↓</span> to navigate</div>
          <div class="palette-tip"><span>↵</span> to select</div>
          <div class="palette-tip"><span>ESC</span> to dismiss</div>
        </div>
      </div>
    `;

    this.input = this.modal.querySelector('.palette-input');
    this.resultsContainer = this.modal.querySelector('.palette-results-list');

    this.input?.addEventListener('input', () => this.handleSearch());
    this.input?.addEventListener('keydown', (e) => this.handleKeydown(e));

    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    document.body.appendChild(this.modal);
  }

  attachHotkeys() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'k' || e.key.toLowerCase() === 'p')) {
        e.preventDefault();
        this.open();
      }
    });
  }

  open() {
    this.isOpen = true;
    this.modal.classList.add('is-open');
    this.input.value = '';
    this.selectedIndex = 0;
    this.input.focus();
    this.handleSearch();
  }

  close() {
    this.isOpen = false;
    this.modal.classList.remove('is-open');
  }

  async handleSearch() {
    const query = this.input.value.trim();
    this.results = [];

    if (!query) {
      // Default actions and recent pages
      this.results.push({
        type: 'action',
        title: 'Create New Page',
        subtitle: 'Add a blank document in root',
        icon: 'pagePlus',
        action: () => State.createPage(null, 'Untitled')
      });

      this.results.push({
        type: 'action',
        title: 'Create New Database',
        subtitle: 'Add a multi-view table/board database',
        icon: 'database',
        action: () => State.createPage(null, 'New Database', true)
      });

      this.results.push({
        type: 'action',
        title: 'Toggle Dark / Light Theme',
        subtitle: 'Switch application color palette',
        icon: 'moon',
        action: () => {
          const next = State.theme === 'dark' ? 'light' : 'dark';
          State.applyTheme(next);
        }
      });

      this.results.push({
        type: 'action',
        title: 'Export Workspace Data (JSON)',
        subtitle: 'Download complete workspace snapshot',
        icon: 'download',
        action: () => window.ExportImport?.exportFullWorkspace()
      });

      this.results.push({
        type: 'action',
        title: 'View Page Revision History',
        subtitle: 'Restore earlier document snapshots',
        icon: 'history',
        action: () => window.HistoryManager?.open(State.activePageId)
      });

      this.results.push({
        type: 'action',
        title: 'Open Trash Bin',
        subtitle: 'Manage deleted pages and restore',
        icon: 'trash',
        action: () => State.setActivePage('__trash__')
      });

      // Add recent pages
      const recentPages = State.pages.filter(p => State.recentPageIds.includes(p.id) && !p.inTrash);
      if (recentPages.length > 0) {
        recentPages.forEach(p => {
          this.results.push({
            type: 'page',
            title: p.title || 'Untitled',
            subtitle: 'Recent page',
            icon: p.icon || '📄',
            isEmoji: true,
            action: () => State.setActivePage(p.id)
          });
        });
      }
    } else {
      // Perform full-text search
      const searchMatches = await State.search(query);
      searchMatches.forEach(m => {
        this.results.push({
          type: m.type,
          title: m.title,
          subtitle: m.snippet,
          isHtmlSubtitle: true,
          icon: m.icon || '📄',
          isEmoji: true,
          action: () => State.setActivePage(m.pageId)
        });
      });

      if (this.results.length === 0) {
        this.results.push({
          type: 'none',
          title: `No results for "${query}"`,
          subtitle: 'Try searching with different keywords',
          icon: 'help',
          disabled: true
        });
      }
    }

    this.selectedIndex = 0;
    this.renderResults();
  }

  renderResults() {
    this.resultsContainer.innerHTML = '';

    this.results.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = `palette-item ${idx === this.selectedIndex ? 'is-selected' : ''} ${item.disabled ? 'is-disabled' : ''}`;

      const iconContent = item.isEmoji
        ? `<span class="palette-item-emoji">${item.icon}</span>`
        : Icons.get(item.icon, 'palette-item-icon', 16);

      row.innerHTML = `
        <div class="palette-item-icon-box">${iconContent}</div>
        <div class="palette-item-info">
          <div class="palette-item-title">${item.title}</div>
          <div class="palette-item-subtitle">${item.isHtmlSubtitle ? item.subtitle : item.subtitle || ''}</div>
        </div>
      `;

      if (!item.disabled) {
        row.addEventListener('click', () => {
          this.close();
          item.action?.();
        });
        row.addEventListener('mouseenter', () => {
          this.selectedIndex = idx;
          this.updateSelectionVisuals();
        });
      }

      this.resultsContainer.appendChild(row);
    });

    this.updateSelectionVisuals();
  }

  updateSelectionVisuals() {
    const items = this.resultsContainer.querySelectorAll('.palette-item');
    items.forEach((it, idx) => {
      it.classList.toggle('is-selected', idx === this.selectedIndex);
      if (idx === this.selectedIndex) {
        it.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  handleKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.results.length > 0) {
        this.selectedIndex = (this.selectedIndex + 1) % this.results.length;
        this.updateSelectionVisuals();
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.results.length > 0) {
        this.selectedIndex = (this.selectedIndex - 1 + this.results.length) % this.results.length;
        this.updateSelectionVisuals();
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const sel = this.results[this.selectedIndex];
      if (sel && !sel.disabled && sel.action) {
        this.close();
        sel.action();
      }
    }
  }
}

window.CommandPalette = new CommandPalette();
