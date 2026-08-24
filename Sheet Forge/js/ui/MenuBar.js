/**
 * SheetForge - Menu Bar
 * Desktop-grade menu bar with keyboard shortcuts, nested actions, and icon indicators
 */
export class MenuBar {
    constructor(containerElement, eventEmitter) {
        this.container = containerElement;
        this.emitter = eventEmitter;
        this.activeMenu = null;

        this._render();
        this._bindEvents();
    }

    _render() {
        this.container.innerHTML = `
            <div class="sf-menubar">
                <!-- File Menu -->
                <div class="sf-menu-item" data-menu="file">
                    <span class="sf-menu-label">File</span>
                    <div class="sf-dropdown-menu">
                        <div class="sf-dropdown-item" data-action="file:new">
                            <span>New Spreadsheet</span>
                            <span class="sf-shortcut">Alt+N</span>
                        </div>
                        <div class="sf-dropdown-divider"></div>
                        <div class="sf-dropdown-item" data-action="file:importCsv">
                            <span>Import CSV...</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="file:importJson">
                            <span>Open SheetForge JSON...</span>
                        </div>
                        <div class="sf-dropdown-divider"></div>
                        <div class="sf-dropdown-item" data-action="file:save">
                            <span>Save to Browser</span>
                            <span class="sf-shortcut">Ctrl+S</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="file:exportCsv">
                            <span>Export Active Sheet as CSV</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="file:exportJson">
                            <span>Export Entire Workbook (JSON)</span>
                        </div>
                        <div class="sf-dropdown-divider"></div>
                        <div class="sf-dropdown-item" data-action="file:print">
                            <span>Print Spreadsheet...</span>
                            <span class="sf-shortcut">Ctrl+P</span>
                        </div>
                    </div>
                </div>

                <!-- Edit Menu -->
                <div class="sf-menu-item" data-menu="edit">
                    <span class="sf-menu-label">Edit</span>
                    <div class="sf-dropdown-menu">
                        <div class="sf-dropdown-item" data-action="edit:undo">
                            <span>Undo</span>
                            <span class="sf-shortcut">Ctrl+Z</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="edit:redo">
                            <span>Redo</span>
                            <span class="sf-shortcut">Ctrl+Y</span>
                        </div>
                        <div class="sf-dropdown-divider"></div>
                        <div class="sf-dropdown-item" data-action="edit:cut">
                            <span>Cut</span>
                            <span class="sf-shortcut">Ctrl+X</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="edit:copy">
                            <span>Copy</span>
                            <span class="sf-shortcut">Ctrl+C</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="edit:paste">
                            <span>Paste</span>
                            <span class="sf-shortcut">Ctrl+V</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="edit:pasteValues">
                            <span>Paste Values Only</span>
                            <span class="sf-shortcut">Ctrl+Shift+V</span>
                        </div>
                        <div class="sf-dropdown-divider"></div>
                        <div class="sf-dropdown-item" data-action="edit:find">
                            <span>Find and Replace...</span>
                            <span class="sf-shortcut">Ctrl+F</span>
                        </div>
                        <div class="sf-dropdown-divider"></div>
                        <div class="sf-dropdown-item" data-action="edit:clearContents">
                            <span>Clear Contents</span>
                            <span class="sf-shortcut">Del</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="edit:clearFormats">
                            <span>Clear Formats</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="edit:clearAll">
                            <span>Clear All</span>
                        </div>
                    </div>
                </div>

                <!-- View Menu -->
                <div class="sf-menu-item" data-menu="view">
                    <span class="sf-menu-label">View</span>
                    <div class="sf-dropdown-menu">
                        <div class="sf-dropdown-item" data-action="view:toggleSidebar">
                            <span>Formatting Sidebar</span>
                            <span class="sf-shortcut">Ctrl+\\</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="view:toggleFormulaBar">
                            <span>Formula Bar</span>
                        </div>
                        <div class="sf-dropdown-divider"></div>
                        <div class="sf-dropdown-item" data-action="view:freezeRow">
                            <span>Freeze Top Row</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="view:freezeCol">
                            <span>Freeze First Column</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="view:unfreeze">
                            <span>Unfreeze Panes</span>
                        </div>
                        <div class="sf-dropdown-divider"></div>
                        <div class="sf-dropdown-item" data-action="view:zoom100">
                            <span>Zoom to 100%</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="view:fullscreen">
                            <span>Toggle Fullscreen</span>
                            <span class="sf-shortcut">F11</span>
                        </div>
                    </div>
                </div>

                <!-- Insert Menu -->
                <div class="sf-menu-item" data-menu="insert">
                    <span class="sf-menu-label">Insert</span>
                    <div class="sf-dropdown-menu">
                        <div class="sf-dropdown-item" data-action="insert:rowAbove">
                            <span>Row Above</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="insert:rowBelow">
                            <span>Row Below</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="insert:colLeft">
                            <span>Column Left</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="insert:colRight">
                            <span>Column Right</span>
                        </div>
                        <div class="sf-dropdown-divider"></div>
                        <div class="sf-dropdown-item" data-action="insert:chart">
                            <span>Insert Chart...</span>
                            <span class="sf-shortcut">Alt+F1</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="insert:comment">
                            <span>Insert Note / Comment...</span>
                            <span class="sf-shortcut">Shift+F2</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="insert:sheet">
                            <span>New Worksheet</span>
                            <span class="sf-shortcut">Shift+F11</span>
                        </div>
                    </div>
                </div>

                <!-- Format Menu -->
                <div class="sf-menu-item" data-menu="format">
                    <span class="sf-menu-label">Format</span>
                    <div class="sf-dropdown-menu">
                        <div class="sf-dropdown-item" data-action="format:bold">
                            <span>Bold</span>
                            <span class="sf-shortcut">Ctrl+B</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="format:italic">
                            <span>Italic</span>
                            <span class="sf-shortcut">Ctrl+I</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="format:underline">
                            <span>Underline</span>
                            <span class="sf-shortcut">Ctrl+U</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="format:strikethrough">
                            <span>Strikethrough</span>
                            <span class="sf-shortcut">Alt+Shift+5</span>
                        </div>
                        <div class="sf-dropdown-divider"></div>
                        <div class="sf-dropdown-item" data-action="format:merge">
                            <span>Merge & Center</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="format:unmerge">
                            <span>Unmerge Cells</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="format:wrapText">
                            <span>Toggle Wrap Text</span>
                        </div>
                        <div class="sf-dropdown-divider"></div>
                        <div class="sf-dropdown-item" data-action="format:conditional">
                            <span>Conditional Formatting...</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="format:clear">
                            <span>Clear Formatting</span>
                            <span class="sf-shortcut">Ctrl+\\</span>
                        </div>
                    </div>
                </div>

                <!-- Data Menu -->
                <div class="sf-menu-item" data-menu="data">
                    <span class="sf-menu-label">Data</span>
                    <div class="sf-dropdown-menu">
                        <div class="sf-dropdown-item" data-action="data:sortAsc">
                            <span>Sort Range A to Z (Ascending)</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="data:sortDesc">
                            <span>Sort Range Z to A (Descending)</span>
                        </div>
                        <div class="sf-dropdown-divider"></div>
                        <div class="sf-dropdown-item" data-action="data:toggleFilter">
                            <span>Create Filter / Toggle Filter</span>
                            <span class="sf-shortcut">Ctrl+Shift+L</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="data:clearFilter">
                            <span>Clear Filters</span>
                        </div>
                        <div class="sf-dropdown-divider"></div>
                        <div class="sf-dropdown-item" data-action="data:validation">
                            <span>Data Validation...</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="data:duplicates">
                            <span>Highlight / Remove Duplicates...</span>
                        </div>
                    </div>
                </div>

                <!-- Help Menu -->
                <div class="sf-menu-item" data-menu="help">
                    <span class="sf-menu-label">Help</span>
                    <div class="sf-dropdown-menu">
                        <div class="sf-dropdown-item" data-action="help:shortcuts">
                            <span>Keyboard Shortcuts Cheat Sheet</span>
                            <span class="sf-shortcut">Ctrl+/</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="help:formulas">
                            <span>Formulas Reference Guide</span>
                        </div>
                        <div class="sf-dropdown-divider"></div>
                        <div class="sf-dropdown-item" data-action="help:demoData">
                            <span>Load Realistic Demo Models</span>
                        </div>
                        <div class="sf-dropdown-item" data-action="help:about">
                            <span>About SheetForge</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    _bindEvents() {
        // Toggle menu on click
        const menuItems = this.container.querySelectorAll('.sf-menu-item');
        menuItems.forEach(item => {
            const label = item.querySelector('.sf-menu-label');
            label.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.activeMenu === item) {
                    this.closeAll();
                } else {
                    this.openMenu(item);
                }
            });

            // Hover over other menus when one is already active
            item.addEventListener('mouseenter', () => {
                if (this.activeMenu && this.activeMenu !== item) {
                    this.openMenu(item);
                }
            });
        });

        // Click outside closes menus
        window.addEventListener('click', () => {
            this.closeAll();
        });

        // Action dispatcher
        this.container.addEventListener('click', (e) => {
            const actionEl = e.target.closest('.sf-dropdown-item');
            if (actionEl) {
                const action = actionEl.dataset.action;
                this.closeAll();
                if (action && this.emitter) {
                    this.emitter.emit('action:menu', action);
                }
            }
        });
    }

    openMenu(menuItem) {
        this.closeAll();
        this.activeMenu = menuItem;
        menuItem.classList.add('sf-menu-open');
    }

    closeAll() {
        if (this.activeMenu) {
            this.activeMenu.classList.remove('sf-menu-open');
            this.activeMenu = null;
        }
    }
}
