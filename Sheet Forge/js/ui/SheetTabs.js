/**
 * SheetForge - Sheet Tabs Bar
 * Multi-sheet tab management, reordering, tab coloring, context menus, and inline renaming
 */
export class SheetTabs {
    constructor(containerElement, eventEmitter) {
        this.container = containerElement;
        this.emitter = eventEmitter;
        this.workbook = null;

        this._render();
        this._setupContextMenu();
        this._bindEvents();
    }

    _render() {
        this.container.innerHTML = `
            <div class="sf-tabs-container">
                <!-- Tab Scroll Controls -->
                <button class="sf-tab-nav-btn" id="sfTabScrollLeft" title="Scroll tabs left">‹</button>
                <button class="sf-tab-nav-btn" id="sfTabScrollRight" title="Scroll tabs right">›</button>

                <!-- Add New Sheet Button -->
                <button class="sf-add-tab-btn" id="sfAddSheetBtn" title="Add Worksheet (Shift+F11)">+</button>

                <!-- Scrollable Tabs List -->
                <div class="sf-tabs-scroll-area" id="sfTabsScrollArea">
                    <div class="sf-tabs-list" id="sfTabsList"></div>
                </div>
            </div>
        `;

        this.tabsList = this.container.querySelector('#sfTabsList');
        this.tabsScrollArea = this.container.querySelector('#sfTabsScrollArea');
        this.btnAddSheet = this.container.querySelector('#sfAddSheetBtn');
        this.btnScrollLeft = this.container.querySelector('#sfTabScrollLeft');
        this.btnScrollRight = this.container.querySelector('#sfTabScrollRight');
    }

    _setupContextMenu() {
        this.contextMenu = document.createElement('div');
        this.contextMenu.className = 'sf-context-menu sf-tab-context-menu';
        this.contextMenu.style.display = 'none';
        this.contextMenu.innerHTML = `
            <div class="sf-dropdown-item" data-action="tab:rename">Rename</div>
            <div class="sf-dropdown-item" data-action="tab:duplicate">Duplicate</div>
            <div class="sf-dropdown-item" data-action="tab:delete">Delete</div>
            <div class="sf-dropdown-divider"></div>
            <div class="sf-dropdown-item sf-tab-color-trigger" data-action="tab:color">
                <span>Tab Color</span>
                <span class="sf-dropdown-caret">▸</span>
            </div>
            <div class="sf-dropdown-divider"></div>
            <div class="sf-dropdown-item" data-action="tab:moveLeft">Move Left</div>
            <div class="sf-dropdown-item" data-action="tab:moveRight">Move Right</div>
        `;
        document.body.appendChild(this.contextMenu);

        // Submenu for tab color palette
        this.colorPalette = document.createElement('div');
        this.colorPalette.className = 'sf-tab-color-palette';
        this.colorPalette.style.display = 'none';
        const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#64748b', 'transparent'];
        this.colorPalette.innerHTML = colors.map(c => `
            <div class="sf-color-swatch" data-color="${c}" style="background-color: ${c === 'transparent' ? '#fff' : c}; ${c === 'transparent' ? 'border: 1px dashed #cbd5e1;' : ''}" title="${c}"></div>
        `).join('');
        document.body.appendChild(this.colorPalette);

        this.activeContextSheetId = null;
    }

    _bindEvents() {
        this.btnAddSheet.addEventListener('click', () => {
            if (this.emitter) this.emitter.emit('action:addSheet');
        });

        this.btnScrollLeft.addEventListener('click', () => {
            this.tabsScrollArea.scrollBy({ left: -120, behavior: 'smooth' });
        });

        this.btnScrollRight.addEventListener('click', () => {
            this.tabsScrollArea.scrollBy({ left: 120, behavior: 'smooth' });
        });

        // Tab click, double-click, and contextmenu delegation
        this.tabsList.addEventListener('click', (e) => {
            const tab = e.target.closest('.sf-tab-item');
            if (tab && !e.target.closest('.sf-tab-input')) {
                const sheetId = tab.dataset.sheetId;
                if (this.emitter) this.emitter.emit('action:switchSheet', sheetId);
            }
        });

        this.tabsList.addEventListener('dblclick', (e) => {
            const tab = e.target.closest('.sf-tab-item');
            if (tab) {
                const sheetId = tab.dataset.sheetId;
                this.startInlineRename(tab, sheetId);
            }
        });

        this.tabsList.addEventListener('contextmenu', (e) => {
            const tab = e.target.closest('.sf-tab-item');
            if (tab) {
                e.preventDefault();
                e.stopPropagation();
                this.activeContextSheetId = tab.dataset.sheetId;
                this.showContextMenu(e.clientX, e.clientY);
            }
        });

        // Context menu items click
        this.contextMenu.addEventListener('click', (e) => {
            const item = e.target.closest('.sf-dropdown-item');
            if (!item) return;

            const action = item.dataset.action;
            const sheetId = this.activeContextSheetId;

            if (action === 'tab:rename') {
                const tab = this.tabsList.querySelector(`[data-sheet-id="${sheetId}"]`);
                if (tab) this.startInlineRename(tab, sheetId);
            } else if (action === 'tab:duplicate') {
                if (this.emitter) this.emitter.emit('action:duplicateSheet', sheetId);
            } else if (action === 'tab:delete') {
                if (this.emitter) this.emitter.emit('action:deleteSheet', sheetId);
            } else if (action === 'tab:moveLeft') {
                if (this.emitter) this.emitter.emit('action:moveSheet', { sheetId, direction: 'left' });
            } else if (action === 'tab:moveRight') {
                if (this.emitter) this.emitter.emit('action:moveSheet', { sheetId, direction: 'right' });
            }

            this.hideContextMenu();
        });

        // Tab color swatch click
        this.colorPalette.addEventListener('click', (e) => {
            const swatch = e.target.closest('.sf-color-swatch');
            if (swatch && this.activeContextSheetId) {
                const color = swatch.dataset.color;
                if (this.emitter) {
                    this.emitter.emit('action:setTabColor', {
                        sheetId: this.activeContextSheetId,
                        color: color === 'transparent' ? null : color
                    });
                }
                this.hideContextMenu();
            }
        });

        // Hover tab color trigger in context menu
        const colorTrigger = this.contextMenu.querySelector('.sf-tab-color-trigger');
        colorTrigger.addEventListener('mouseenter', () => {
            const rect = colorTrigger.getBoundingClientRect();
            this.colorPalette.style.top = `${rect.top}px`;
            this.colorPalette.style.left = `${rect.right + 2}px`;
            this.colorPalette.style.display = 'grid';
        });

        // Global dismiss
        window.addEventListener('click', (e) => {
            if (!e.target.closest('.sf-context-menu') && !e.target.closest('.sf-tab-color-palette')) {
                this.hideContextMenu();
            }
        });
    }

    setWorkbook(workbook) {
        this.workbook = workbook;
        this.renderTabs();
    }

    renderTabs() {
        if (!this.workbook) return;

        const html = this.workbook.sheets.map(sheet => {
            const isActive = sheet.id === this.workbook.activeSheetId;
            const colorBar = sheet.tabColor ? `<div class="sf-tab-color-bar" style="background-color: ${sheet.tabColor};"></div>` : '';
            return `
                <div class="sf-tab-item ${isActive ? 'sf-tab-active' : ''}" data-sheet-id="${sheet.id}">
                    ${colorBar}
                    <span class="sf-tab-title">${sheet.name}</span>
                    <button class="sf-tab-menu-btn" title="Sheet options">▾</button>
                </div>
            `;
        }).join('');

        this.tabsList.innerHTML = html;

        // Bind dropdown button on tab
        this.tabsList.querySelectorAll('.sf-tab-menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tab = btn.closest('.sf-tab-item');
                this.activeContextSheetId = tab.dataset.sheetId;
                const rect = btn.getBoundingClientRect();
                this.showContextMenu(rect.left, rect.top - 180);
            });
        });

        // Scroll active tab into view
        const activeTab = this.tabsList.querySelector('.sf-tab-active');
        if (activeTab) {
            activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
    }

    startInlineRename(tabEl, sheetId) {
        const titleEl = tabEl.querySelector('.sf-tab-title');
        if (!titleEl) return;

        const currentName = titleEl.innerText;
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'sf-tab-input';
        input.value = currentName;

        titleEl.replaceWith(input);
        input.focus();
        input.select();

        let committed = false;

        const commit = () => {
            if (committed) return;
            committed = true;
            const newName = input.value.trim();
            if (newName && newName !== currentName) {
                if (this.emitter) {
                    this.emitter.emit('action:renameSheet', { sheetId, newName });
                }
            } else {
                this.renderTabs();
            }
        };

        input.addEventListener('blur', commit);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                commit();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                committed = true;
                this.renderTabs();
            }
        });
    }

    showContextMenu(x, y) {
        this.contextMenu.style.top = `${Math.max(10, y)}px`;
        this.contextMenu.style.left = `${Math.max(10, x)}px`;
        this.contextMenu.style.display = 'block';
    }

    hideContextMenu() {
        this.contextMenu.style.display = 'none';
        this.colorPalette.style.display = 'none';
        this.activeContextSheetId = null;
    }
}
