/**
 * SheetForge - Compact Ribbon Toolbar
 * High-density toolbar with formatting controls, palettes, alignment, and analytical shortcuts
 */

export const THEME_COLOR_PALETTE = [
    '#ffffff', '#000000', '#e2e8f0', '#334155', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4',
    '#f8fafc', '#0f172a', '#cbd5e1', '#1e293b', '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#22d3ee',
    '#f1f5f9', '#1e293b', '#94a3b8', '#0f172a', '#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2',
    '#e2e8f0', '#334155', '#64748b', '#020617', '#1d4ed8', '#047857', '#b45309', '#b91c1c', '#6d28d9', '#0e7490'
];

export class Toolbar {
    constructor(containerElement, eventEmitter) {
        this.container = containerElement;
        this.emitter = eventEmitter;

        this._render();
        this._bindEvents();
    }

    _render() {
        this.container.innerHTML = `
            <div class="sf-toolbar" role="toolbar" aria-label="Spreadsheet Formatting Toolbar">
                <!-- Undo / Redo Group -->
                <div class="sf-tool-group">
                    <button class="sf-tool-btn" id="tbUndo" title="Undo (Ctrl+Z)" aria-label="Undo" disabled>
                        <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>
                    </button>
                    <button class="sf-tool-btn" id="tbRedo" title="Redo (Ctrl+Y)" aria-label="Redo" disabled>
                        <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>
                    </button>
                </div>

                <div class="sf-tool-divider"></div>

                <!-- Font Family & Size -->
                <div class="sf-tool-group">
                    <select class="sf-tool-select sf-font-family-select" id="tbFontFamily" title="Font Family" aria-label="Font Family">
                        <option value="Inter, sans-serif" selected>Inter</option>
                        <option value="Roboto, sans-serif">Roboto</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="'Segoe UI', sans-serif">Segoe UI</option>
                        <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                        <option value="'Courier New', monospace">Courier New</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="'Times New Roman', serif">Times New Roman</option>
                    </select>

                    <select class="sf-tool-select sf-font-size-select" id="tbFontSize" title="Font Size" aria-label="Font Size">
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13" selected>13</option>
                        <option value="14">14</option>
                        <option value="16">16</option>
                        <option value="18">18</option>
                        <option value="20">20</option>
                        <option value="24">24</option>
                        <option value="28">28</option>
                    </select>
                </div>

                <div class="sf-tool-divider"></div>

                <!-- Basic Formatting: Bold, Italic, Underline, Strike -->
                <div class="sf-tool-group">
                    <button class="sf-tool-btn" id="tbBold" title="Bold (Ctrl+B)" aria-label="Bold"><b>B</b></button>
                    <button class="sf-tool-btn" id="tbItalic" title="Italic (Ctrl+I)" aria-label="Italic"><i>I</i></button>
                    <button class="sf-tool-btn" id="tbUnderline" title="Underline (Ctrl+U)" aria-label="Underline"><u>U</u></button>
                    <button class="sf-tool-btn" id="tbStrike" title="Strikethrough" aria-label="Strikethrough"><s>S</s></button>
                </div>

                <div class="sf-tool-divider"></div>

                <!-- Colors: Text & Fill with Palette Dropdowns -->
                <div class="sf-tool-group sf-color-group">
                    <!-- Text Color -->
                    <div class="sf-dropdown-wrapper">
                        <button class="sf-tool-btn sf-color-btn" id="tbTextColorBtn" title="Text Color" aria-label="Text Color">
                            <span class="sf-color-letter" id="tbTextColorIndicator" style="color: #1e293b; font-weight: bold; border-bottom: 3px solid #1e293b;">A</span>
                            <span class="sf-dropdown-caret">▾</span>
                        </button>
                        <div class="sf-dropdown-panel sf-color-palette-panel" id="tbTextColorPanel">
                            <div class="sf-palette-grid" id="tbTextPaletteGrid"></div>
                            <div class="sf-palette-footer">
                                <label class="sf-custom-color-label">
                                    <span>Custom...</span>
                                    <input type="color" id="tbTextColorPicker" value="#1e293b">
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Fill Color -->
                    <div class="sf-dropdown-wrapper">
                        <button class="sf-tool-btn sf-color-btn" id="tbFillColorBtn" title="Fill Color" aria-label="Fill Color">
                            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z"/></svg>
                            <span class="sf-dropdown-caret">▾</span>
                        </button>
                        <div class="sf-dropdown-panel sf-color-palette-panel" id="tbFillColorPanel">
                            <div class="sf-palette-nofill-btn" id="tbFillNoneBtn">✕ No Fill</div>
                            <div class="sf-palette-grid" id="tbFillPaletteGrid"></div>
                            <div class="sf-palette-footer">
                                <label class="sf-custom-color-label">
                                    <span>Custom...</span>
                                    <input type="color" id="tbFillColorPicker" value="#ffffff">
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Borders Dropdown -->
                    <div class="sf-dropdown-wrapper">
                        <button class="sf-tool-btn" id="tbBordersBtn" title="Borders" aria-label="Borders">
                            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 8h-6V5h6v6zm-8-6v6H5V5h6zm-6 8h6v6H5v-6zm8 6v-6h6v6h-6z"/></svg>
                            <span class="sf-dropdown-caret">▾</span>
                        </button>
                        <div class="sf-dropdown-panel sf-borders-panel">
                            <div class="sf-border-grid">
                                <button class="sf-border-item" data-border="all" title="All Borders">田 All</button>
                                <button class="sf-border-item" data-border="outer" title="Outer Box Border">回 Box</button>
                                <button class="sf-border-item" data-border="thick_outer" title="Thick Outer Border">⬛ Thick</button>
                                <button class="sf-border-item" data-border="top" title="Top Border">▔ Top</button>
                                <button class="sf-border-item" data-border="bottom" title="Bottom Border">_ Bottom</button>
                                <button class="sf-border-item" data-border="double_bottom" title="Double Bottom Border">═ Double</button>
                                <button class="sf-border-item" data-border="left" title="Left Border">| Left</button>
                                <button class="sf-border-item" data-border="right" title="Right Border">| Right</button>
                                <button class="sf-border-item" data-border="none" title="No Borders">✕ Clear</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="sf-tool-divider"></div>

                <!-- Alignment & Layout -->
                <div class="sf-tool-group">
                    <button class="sf-tool-btn" id="tbAlignLeft" title="Align Left" aria-label="Align Left">
                        <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg>
                    </button>
                    <button class="sf-tool-btn" id="tbAlignCenter" title="Align Center" aria-label="Align Center">
                        <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/></svg>
                    </button>
                    <button class="sf-tool-btn" id="tbAlignRight" title="Align Right" aria-label="Align Right">
                        <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/></svg>
                    </button>
                    <button class="sf-tool-btn" id="tbWrapText" title="Wrap Text" aria-label="Wrap Text">
                        <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M4 19h6v-2H4v2zM20 5H4v2h16V5zm-3 6H4v2h13.25c1.1 0 2 .9 2 2s-.9 2-2 2H15v-2l-3 3 3 3v-2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4z"/></svg>
                    </button>
                    <button class="sf-tool-btn" id="tbMerge" title="Merge & Center" aria-label="Merge and Center">
                        <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M6 4h12c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm2 7v2h8v-2H8zm-4 0l3-3v2h2v2H7v2l-3-3zm16 0l-3 3v-2h-2v-2h2v-2l3 3z"/></svg>
                    </button>
                </div>

                <div class="sf-tool-divider"></div>

                <!-- Number Formats -->
                <div class="sf-tool-group">
                    <select class="sf-tool-select sf-num-format-select" id="tbNumFormat" title="Number Format" aria-label="Number Format">
                        <option value="general">Automatic / General</option>
                        <option value="number">Number (1,234.56)</option>
                        <option value="currency">Currency ($1,234.56)</option>
                        <option value="currency_eur">Currency EUR (€1.234,56)</option>
                        <option value="currency_gbp">Currency GBP (£1,234.56)</option>
                        <option value="accounting">Accounting ($ 1,234.56)</option>
                        <option value="percent">Percentage (12.3%)</option>
                        <option value="scientific">Scientific (1.23E+03)</option>
                        <option value="date">Date (YYYY-MM-DD)</option>
                        <option value="date_long">Date (MMM D, YYYY)</option>
                        <option value="time">Time (HH:MM:SS)</option>
                        <option value="text">Plain Text</option>
                    </select>

                    <button class="sf-tool-btn" id="tbFormatCurrency" title="Format as Currency ($)" aria-label="Format Currency">$</button>
                    <button class="sf-tool-btn" id="tbFormatPercent" title="Format as Percent (%)" aria-label="Format Percent">%</button>
                    <button class="sf-tool-btn" id="tbDecDec" title="Decrease Decimal Places (.0)" aria-label="Decrease Decimals">.0</button>
                    <button class="sf-tool-btn" id="tbDecInc" title="Increase Decimal Places (.00)" aria-label="Increase Decimals">.00</button>
                </div>

                <div class="sf-tool-divider"></div>

                <!-- Data & Analytical Actions -->
                <div class="sf-tool-group">
                    <!-- AutoSum Dropdown -->
                    <div class="sf-dropdown-wrapper">
                        <button class="sf-tool-btn" id="tbAutoSumBtn" title="AutoSum (∑)" aria-label="AutoSum">
                            <span>∑</span>
                            <span class="sf-dropdown-caret">▾</span>
                        </button>
                        <div class="sf-dropdown-panel sf-functions-panel">
                            <div class="sf-dropdown-item" data-fn="SUM">SUM</div>
                            <div class="sf-dropdown-item" data-fn="AVERAGE">AVERAGE</div>
                            <div class="sf-dropdown-item" data-fn="COUNT">COUNT</div>
                            <div class="sf-dropdown-item" data-fn="MAX">MAX</div>
                            <div class="sf-dropdown-item" data-fn="MIN">MIN</div>
                        </div>
                    </div>

                    <button class="sf-tool-btn" id="tbSortAsc" title="Sort A-Z (Ascending)" aria-label="Sort Ascending">
                        <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 17h3l-4 4-4-4h3V3h2v14zM2 17h10v2H2v-2zm0-7h7v2H2v-2zm0-7h4v2H2V3z"/></svg>
                    </button>
                    <button class="sf-tool-btn" id="tbSortDesc" title="Sort Z-A (Descending)" aria-label="Sort Descending">
                        <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 7h3l-4-4-4 4h3v14h2V7zM2 17h4v2H2v-2zm0-7h7v2H2v-2zm0-7h10v2H2V3z"/></svg>
                    </button>
                    <button class="sf-tool-btn" id="tbFilter" title="Toggle Filters" aria-label="Toggle Filter">
                        <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>
                    </button>
                    <button class="sf-tool-btn" id="tbInsertChart" title="Insert Interactive Chart (Alt+F1)" aria-label="Insert Chart">
                        <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6zM19 21H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2z"/></svg>
                    </button>
                </div>

                <!-- Spacer -->
                <div class="sf-toolbar-spacer"></div>

                <!-- Formatting Panel Toggle -->
                <div class="sf-tool-group">
                    <button class="sf-tool-btn sf-sidebar-toggle-btn" id="tbToggleSidebar" title="Toggle Formatting Sidebar (Ctrl+\\)" aria-label="Toggle Sidebar">
                        <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM16 7h-3v10h3V7z"/></svg>
                        <span>Sidebar</span>
                    </button>
                </div>
            </div>
        `;

        this._renderColorPalettes();
    }

    _renderColorPalettes() {
        const textGrid = this.container.querySelector('#tbTextPaletteGrid');
        const fillGrid = this.container.querySelector('#tbFillPaletteGrid');

        const paletteHTML = THEME_COLOR_PALETTE.map(color => `
            <div class="sf-palette-swatch" data-color="${color}" style="background-color: ${color};" title="${color}"></div>
        `).join('');

        textGrid.innerHTML = paletteHTML;
        fillGrid.innerHTML = paletteHTML;
    }

    _bindEvents() {
        // Undo / Redo
        this.container.querySelector('#tbUndo').addEventListener('click', () => this.emitter.emit('action:undo'));
        this.container.querySelector('#tbRedo').addEventListener('click', () => this.emitter.emit('action:redo'));

        // History state sync
        this.emitter.on('history:changed', ({ canUndo, canRedo }) => {
            this.container.querySelector('#tbUndo').disabled = !canUndo;
            this.container.querySelector('#tbRedo').disabled = !canRedo;
        });

        // Font family & size
        this.container.querySelector('#tbFontFamily').addEventListener('change', (e) => {
            this.emitter.emit('format:fontFamily', e.target.value);
        });
        this.container.querySelector('#tbFontSize').addEventListener('change', (e) => {
            this.emitter.emit('format:fontSize', parseInt(e.target.value, 10));
        });

        // Toggles: Bold, Italic, Underline, Strike
        this.container.querySelector('#tbBold').addEventListener('click', () => this.emitter.emit('format:toggleBold'));
        this.container.querySelector('#tbItalic').addEventListener('click', () => this.emitter.emit('format:toggleItalic'));
        this.container.querySelector('#tbUnderline').addEventListener('click', () => this.emitter.emit('format:toggleUnderline'));
        this.container.querySelector('#tbStrike').addEventListener('click', () => this.emitter.emit('format:toggleStrike'));

        // Text Color Palette Selection
        this.container.querySelector('#tbTextPaletteGrid').addEventListener('click', (e) => {
            const swatch = e.target.closest('.sf-palette-swatch');
            if (swatch) {
                const color = swatch.dataset.color;
                this.emitter.emit('format:color', color);
                this._updateTextColorIndicator(color);
                this._closeDropdownPanels();
            }
        });

        // Custom Text Color input
        this.container.querySelector('#tbTextColorPicker').addEventListener('input', (e) => {
            const color = e.target.value;
            this.emitter.emit('format:color', color);
            this._updateTextColorIndicator(color);
        });

        // Fill Color Palette Selection
        this.container.querySelector('#tbFillPaletteGrid').addEventListener('click', (e) => {
            const swatch = e.target.closest('.sf-palette-swatch');
            if (swatch) {
                const color = swatch.dataset.color;
                this.emitter.emit('format:backgroundColor', color);
                this._closeDropdownPanels();
            }
        });

        this.container.querySelector('#tbFillNoneBtn').addEventListener('click', () => {
            this.emitter.emit('format:backgroundColor', '#ffffff');
            this._closeDropdownPanels();
        });

        // Custom Fill Color input
        this.container.querySelector('#tbFillColorPicker').addEventListener('input', (e) => {
            const color = e.target.value;
            this.emitter.emit('format:backgroundColor', color);
        });

        // Borders
        this.container.querySelectorAll('.sf-border-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const borderType = btn.dataset.border;
                this.emitter.emit('format:border', borderType);
                this._closeDropdownPanels();
            });
        });

        // Alignment & Layout
        this.container.querySelector('#tbAlignLeft').addEventListener('click', () => this.emitter.emit('format:alignH', 'left'));
        this.container.querySelector('#tbAlignCenter').addEventListener('click', () => this.emitter.emit('format:alignH', 'center'));
        this.container.querySelector('#tbAlignRight').addEventListener('click', () => this.emitter.emit('format:alignH', 'right'));
        this.container.querySelector('#tbWrapText').addEventListener('click', () => this.emitter.emit('format:toggleWrap'));
        this.container.querySelector('#tbMerge').addEventListener('click', () => this.emitter.emit('format:toggleMerge'));

        // Number Formats
        this.container.querySelector('#tbNumFormat').addEventListener('change', (e) => {
            this.emitter.emit('format:numFormat', e.target.value);
        });
        this.container.querySelector('#tbFormatCurrency').addEventListener('click', () => this.emitter.emit('format:numFormat', 'currency'));
        this.container.querySelector('#tbFormatPercent').addEventListener('click', () => this.emitter.emit('format:numFormat', 'percent'));
        this.container.querySelector('#tbDecDec').addEventListener('click', () => this.emitter.emit('format:decimalsChange', -1));
        this.container.querySelector('#tbDecInc').addEventListener('click', () => this.emitter.emit('format:decimalsChange', 1));

        // AutoSum Dropdown
        this.container.querySelectorAll('.sf-functions-panel .sf-dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                const fn = item.dataset.fn;
                this.emitter.emit('action:insertAutoSum', fn);
                this._closeDropdownPanels();
            });
        });

        // Sorting & Filters
        this.container.querySelector('#tbSortAsc').addEventListener('click', () => this.emitter.emit('action:sort', 'asc'));
        this.container.querySelector('#tbSortDesc').addEventListener('click', () => this.emitter.emit('action:sort', 'desc'));
        this.container.querySelector('#tbFilter').addEventListener('click', () => this.emitter.emit('action:toggleFilter'));
        this.container.querySelector('#tbInsertChart').addEventListener('click', () => this.emitter.emit('action:insertChart'));
        this.container.querySelector('#tbToggleSidebar').addEventListener('click', () => this.emitter.emit('action:toggleSidebar'));

        // Dropdown open/close handling
        this.container.querySelectorAll('.sf-dropdown-wrapper').forEach(wrapper => {
            const btn = wrapper.querySelector('.sf-tool-btn');
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const panel = wrapper.querySelector('.sf-dropdown-panel');
                const isOpen = panel.classList.contains('sf-panel-open');
                this._closeDropdownPanels();
                if (!isOpen) {
                    panel.classList.add('sf-panel-open');
                }
            });
        });

        window.addEventListener('click', () => {
            this._closeDropdownPanels();
        });

        // Listen for selection changes to sync toolbar button states
        this.emitter.on('selection:changed', ({ cell }) => {
            this.syncState(cell);
        });
    }

    _updateTextColorIndicator(color) {
        const ind = this.container.querySelector('#tbTextColorIndicator');
        if (ind) {
            ind.style.color = color;
            ind.style.borderBottomColor = color;
        }
    }

    _closeDropdownPanels() {
        this.container.querySelectorAll('.sf-dropdown-panel').forEach(p => p.classList.remove('sf-panel-open'));
    }

    syncState(cell) {
        if (!cell) return;
        const s = cell.style || {};

        this.container.querySelector('#tbBold').classList.toggle('sf-tool-active', Boolean(s.bold));
        this.container.querySelector('#tbItalic').classList.toggle('sf-tool-active', Boolean(s.italic));
        this.container.querySelector('#tbUnderline').classList.toggle('sf-tool-active', Boolean(s.underline));
        this.container.querySelector('#tbStrike').classList.toggle('sf-tool-active', Boolean(s.strikethrough));
        this.container.querySelector('#tbWrapText').classList.toggle('sf-tool-active', Boolean(s.wrapText));
        this.container.querySelector('#tbMerge').classList.toggle('sf-tool-active', Boolean(cell.mergeInfo && cell.mergeInfo.isMerged));

        this.container.querySelector('#tbAlignLeft').classList.toggle('sf-tool-active', s.alignH === 'left' || !s.alignH);
        this.container.querySelector('#tbAlignCenter').classList.toggle('sf-tool-active', s.alignH === 'center');
        this.container.querySelector('#tbAlignRight').classList.toggle('sf-tool-active', s.alignH === 'right');

        if (s.fontSize) {
            this.container.querySelector('#tbFontSize').value = String(s.fontSize);
        }
        if (s.fontFamily) {
            this.container.querySelector('#tbFontFamily').value = s.fontFamily;
        }
        if (cell.numFormat) {
            this.container.querySelector('#tbNumFormat').value = cell.numFormat;
        }
        if (s.color) {
            this._updateTextColorIndicator(s.color);
        }
    }
}
