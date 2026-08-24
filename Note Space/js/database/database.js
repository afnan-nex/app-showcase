/**
 * NoteSpace - Database Engine & View Controller
 * Coordinates Table, Board, and List views with real-time sorting, filtering, and row mutations.
 */

import { store } from '../state/store.js';
import { Icons, getIcon } from '../icons/icons.js';
import { renderTableView } from './tableView.js';
import { renderBoardView } from './boardView.js';
import { renderListView } from './listView.js';
import { openItemDetailModal, openAddPropertyModal } from './propertyModal.js';
import { createElement, escapeHTML } from '../utils/dom.js';

export class DatabaseView {
  constructor(containerEl, databaseId) {
    this.container = containerEl;
    this.databaseId = databaseId;
    this.searchQuery = '';
    this.sortPropId = null;
    this.sortDirection = 'asc'; // 'asc' | 'desc'
    this.filterPropId = 'all';
    this.filterValue = '';

    this.init();
  }

  init() {
    this.render();
  }

  getDatabase() {
    return store.getDatabase(this.databaseId);
  }

  render() {
    const db = this.getDatabase();
    if (!db) {
      this.container.innerHTML = `<div class="ns-db-not-found">Database not found (${this.databaseId})</div>`;
      return;
    }

    this.container.innerHTML = '';
    const dbRoot = createElement('div', 'ns-database-view-root');

    // 1. Database Toolbar (Views switcher, search, sort, filter, add)
    const toolbar = createElement('div', 'ns-db-toolbar');

    // View Switcher Tabs
    const viewTabs = createElement('div', 'ns-db-view-tabs');
    const currentView = db.currentView || 'table';

    const tabs = [
      { type: 'table', label: 'Table', icon: 'viewTable' },
      { type: 'board', label: 'Board', icon: 'viewBoard' },
      { type: 'list', label: 'List', icon: 'viewList' }
    ];

    tabs.forEach(tab => {
      const btn = createElement('button', `ns-db-tab ${currentView === tab.type ? 'is-active' : ''}`);
      btn.innerHTML = `${getIcon(tab.icon)} <span>${tab.label}</span>`;
      btn.addEventListener('click', () => {
        store.updateDatabase(db.id, { currentView: tab.type });
        this.render();
      });
      viewTabs.appendChild(btn);
    });

    toolbar.appendChild(viewTabs);

    // Right Controls (Search, Sort, Filter, New Button)
    const rightControls = createElement('div', 'ns-db-right-controls');
    rightControls.innerHTML = `
      <div class="ns-db-search-wrap">
        ${Icons.search}
        <input type="text" class="ns-db-search-input" placeholder="Filter items..." value="${escapeHTML(this.searchQuery)}" />
      </div>
      <button class="ns-db-tool-btn ns-btn-sort" title="Sort">${Icons.sort} <span>Sort</span></button>
      <button class="ns-db-tool-btn ns-btn-new-prop" title="Add property">${Icons.plus} <span>Property</span></button>
      <button class="ns-btn ns-btn-primary ns-btn-add-db-row">${Icons.plus} <span>New</span></button>
    `;

    // Search input event
    const searchInp = rightControls.querySelector('.ns-db-search-input');
    searchInp.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      this.renderBodyOnly(dbRoot);
    });

    // Sort button event
    rightControls.querySelector('.ns-btn-sort').addEventListener('click', (e) => {
      this.showSortPopover(e.target, db);
    });

    // Add property button event
    rightControls.querySelector('.ns-btn-new-prop').addEventListener('click', () => {
      openAddPropertyModal((propDef) => {
        store.addDatabaseProperty(db.id, propDef).then(() => this.render());
      });
    });

    // Add Row button event
    rightControls.querySelector('.ns-btn-add-db-row').addEventListener('click', () => {
      store.addDatabaseRow(db.id, {}).then(() => this.render());
    });

    toolbar.appendChild(rightControls);
    dbRoot.appendChild(toolbar);

    // 2. View Content Area
    const viewContent = createElement('div', 'ns-db-view-content');
    dbRoot.appendChild(viewContent);

    this.container.appendChild(dbRoot);
    this.renderActiveView(viewContent, db);
  }

  renderBodyOnly(dbRoot) {
    const db = this.getDatabase();
    if (!db) return;
    const viewContent = dbRoot.querySelector('.ns-db-view-content');
    if (viewContent) {
      viewContent.innerHTML = '';
      this.renderActiveView(viewContent, db);
    }
  }

  getFilteredAndSortedRows(db) {
    let rows = [...(db.rows || [])];

    // Filter by search query
    if (this.searchQuery) {
      rows = rows.filter(r => {
        return Object.values(r.properties).some(val => {
          if (!val) return false;
          if (Array.isArray(val)) {
            return val.some(v => String(v).toLowerCase().includes(this.searchQuery));
          }
          return String(val).toLowerCase().includes(this.searchQuery);
        });
      });
    }

    // Sort rows
    if (this.sortPropId) {
      const propId = this.sortPropId;
      const dir = this.sortDirection === 'asc' ? 1 : -1;
      rows.sort((a, b) => {
        const valA = a.properties[propId];
        const valB = b.properties[propId];
        if (valA === valB) return 0;
        if (valA === undefined || valA === null || valA === '') return 1;
        if (valB === undefined || valB === null || valB === '') return -1;
        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * dir;
        }
        return String(valA).localeCompare(String(valB)) * dir;
      });
    }

    return rows;
  }

  renderActiveView(viewContent, db) {
    const rows = this.getFilteredAndSortedRows(db);
    const viewType = db.currentView || 'table';

    const onUpdateRow = (rowId, props, contentBlocks) => {
      store.updateDatabaseRow(db.id, rowId, props, contentBlocks).then(() => this.render());
    };

    const onDeleteRow = (rowId) => {
      store.deleteDatabaseRow(db.id, rowId).then(() => this.render());
    };

    const onAddProperty = () => {
      openAddPropertyModal((propDef) => {
        store.addDatabaseProperty(db.id, propDef).then(() => this.render());
      });
    };

    const onOpenDetail = (row) => {
      openItemDetailModal(db, row, (rId, p, c) => onUpdateRow(rId, p, c));
    };

    if (viewType === 'table') {
      const tableDOM = renderTableView(db, rows, onUpdateRow, onDeleteRow, onAddProperty, onOpenDetail);
      viewContent.appendChild(tableDOM);
    } else if (viewType === 'board') {
      const boardDOM = renderBoardView(db, rows, onUpdateRow, (initialProps) => {
        store.addDatabaseRow(db.id, initialProps).then(() => this.render());
      }, onOpenDetail);
      viewContent.appendChild(boardDOM);
    } else if (viewType === 'list') {
      const listDOM = renderListView(db, rows, onUpdateRow, () => {
        store.addDatabaseRow(db.id, {}).then(() => this.render());
      }, onOpenDetail);
      viewContent.appendChild(listDOM);
    }
  }

  showSortPopover(targetBtn, db) {
    document.querySelectorAll('.ns-sort-popover').forEach(p => p.remove());

    const popover = createElement('div', 'ns-cell-popover ns-sort-popover');
    popover.innerHTML = `
      <div class="ns-popover-title">Sort By Property</div>
      <div class="ns-sort-selects">
        <select class="ns-input ns-sort-prop-select">
          <option value="">None</option>
          ${db.properties.map(p => `<option value="${p.id}" ${this.sortPropId === p.id ? 'selected' : ''}>${escapeHTML(p.name)}</option>`).join('')}
        </select>
        <select class="ns-input ns-sort-dir-select">
          <option value="asc" ${this.sortDirection === 'asc' ? 'selected' : ''}>Ascending</option>
          <option value="desc" ${this.sortDirection === 'desc' ? 'selected' : ''}>Descending</option>
        </select>
      </div>
      <div class="ns-popover-actions">
        <button class="ns-btn-sm ns-btn-clear-sort">Clear</button>
        <button class="ns-btn-sm ns-btn-primary ns-btn-apply-sort">Apply</button>
      </div>
    `;

    document.body.appendChild(popover);
    const rect = targetBtn.getBoundingClientRect();
    popover.style.top = `${rect.bottom + window.scrollY + 4}px`;
    popover.style.left = `${rect.left + window.scrollX}px`;

    const propSelect = popover.querySelector('.ns-sort-prop-select');
    const dirSelect = popover.querySelector('.ns-sort-dir-select');

    popover.querySelector('.ns-btn-apply-sort').addEventListener('click', () => {
      this.sortPropId = propSelect.value || null;
      this.sortDirection = dirSelect.value;
      popover.remove();
      this.render();
    });

    popover.querySelector('.ns-btn-clear-sort').addEventListener('click', () => {
      this.sortPropId = null;
      popover.remove();
      this.render();
    });

    const closeHandler = (e) => {
      if (!popover.contains(e.target) && !targetBtn.contains(e.target)) {
        popover.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }
}
