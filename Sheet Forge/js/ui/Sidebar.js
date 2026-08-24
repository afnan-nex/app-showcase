/**
 * SheetForge - Collapsible Formatting & Properties Sidebar
 * Detailed styling inspector, custom borders builder, number format controls, rules, and notes
 */
export class Sidebar {
    constructor(containerElement, eventEmitter) {
        this.container = containerElement;
        this.emitter = eventEmitter;
        this.isOpen = false;
        this.currentCell = null;

        this._render();
        this._bindEvents();
    }

    _render() {
        this.container.innerHTML = `
            <div class="sf-sidebar-panel" id="sfSidebarPanel">
                <!-- Sidebar Header -->
                <div class="sf-sidebar-header">
                    <span class="sf-sidebar-title">Cell Format & Inspector</span>
                    <button class="sf-sidebar-close" id="sfSidebarClose" title="Close Panel (Ctrl+\\)">✕</button>
                </div>

                <!-- Sidebar Navigation Tabs -->
                <div class="sf-sidebar-tabs">
                    <button class="sf-sb-tab sf-sb-tab-active" data-tab="style">Style</button>
                    <button class="sf-sb-tab" data-tab="number">Number</button>
                    <button class="sf-sb-tab" data-tab="rules">Rules</button>
                    <button class="sf-sb-tab" data-tab="notes">Notes</button>
                </div>

                <!-- Sidebar Body -->
                <div class="sf-sidebar-body">
                    <!-- TAB 1: STYLE -->
                    <div class="sf-tab-content sf-tab-style sf-content-active" id="tabContentStyle">
                        <!-- Typography Section -->
                        <div class="sf-sb-section">
                            <label class="sf-sb-label">Typography</label>
                            <div class="sf-sb-row">
                                <select class="sf-sb-select" id="sbFontFamily">
                                    <option value="Inter, sans-serif">Inter</option>
                                    <option value="Roboto, sans-serif">Roboto</option>
                                    <option value="Arial, sans-serif">Arial</option>
                                    <option value="'Segoe UI', sans-serif">Segoe UI</option>
                                    <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                                    <option value="'Courier New', monospace">Courier New</option>
                                    <option value="Georgia, serif">Georgia</option>
                                    <option value="'Times New Roman', serif">Times New Roman</option>
                                </select>
                                <select class="sf-sb-select sf-sb-short" id="sbFontSize">
                                    <option value="9">9px</option>
                                    <option value="10">10px</option>
                                    <option value="11">11px</option>
                                    <option value="12">12px</option>
                                    <option value="13">13px</option>
                                    <option value="14">14px</option>
                                    <option value="16">16px</option>
                                    <option value="18">18px</option>
                                    <option value="20">20px</option>
                                    <option value="24">24px</option>
                                    <option value="28">28px</option>
                                </select>
                            </div>

                            <div class="sf-sb-btn-row">
                                <button class="sf-sb-btn" id="sbBtnBold" title="Bold"><b>B</b></button>
                                <button class="sf-sb-btn" id="sbBtnItalic" title="Italic"><i>I</i></button>
                                <button class="sf-sb-btn" id="sbBtnUnderline" title="Underline"><u>U</u></button>
                                <button class="sf-sb-btn" id="sbBtnStrike" title="Strike"><s>S</s></button>
                            </div>
                        </div>

                        <!-- Alignment Section -->
                        <div class="sf-sb-section">
                            <label class="sf-sb-label">Alignment & Layout</label>
                            <div class="sf-sb-btn-row">
                                <button class="sf-sb-btn" id="sbBtnAlignLeft" title="Align Left">Left</button>
                                <button class="sf-sb-btn" id="sbBtnAlignCenter" title="Align Center">Center</button>
                                <button class="sf-sb-btn" id="sbBtnAlignRight" title="Align Right">Right</button>
                            </div>
                            <div class="sf-sb-checkbox-row">
                                <label><input type="checkbox" id="sbCheckWrap"> Wrap Text</label>
                            </div>
                        </div>

                        <!-- Colors Section -->
                        <div class="sf-sb-section">
                            <label class="sf-sb-label">Colors</label>
                            <div class="sf-sb-color-row">
                                <div class="sf-sb-color-field">
                                    <span>Text:</span>
                                    <input type="color" id="sbTextColor" value="#1e293b">
                                </div>
                                <div class="sf-sb-color-field">
                                    <span>Fill:</span>
                                    <input type="color" id="sbFillColor" value="#ffffff">
                                </div>
                            </div>
                        </div>

                        <!-- Custom Borders Section -->
                        <div class="sf-sb-section">
                            <label class="sf-sb-label">Custom Borders</label>
                            <div class="sf-sb-border-controls">
                                <div class="sf-sb-border-buttons">
                                    <button class="sf-sb-btn" data-border="all">All</button>
                                    <button class="sf-sb-btn" data-border="outer">Outer</button>
                                    <button class="sf-sb-btn" data-border="top">Top</button>
                                    <button class="sf-sb-btn" data-border="bottom">Bottom</button>
                                    <button class="sf-sb-btn" data-border="left">Left</button>
                                    <button class="sf-sb-btn" data-border="right">Right</button>
                                    <button class="sf-sb-btn" data-border="none">Clear</button>
                                </div>
                                <div class="sf-sb-row" style="margin-top: 8px;">
                                    <div class="sf-sb-color-field">
                                        <span>Color:</span>
                                        <input type="color" id="sbBorderColor" value="#cbd5e1">
                                    </div>
                                    <select class="sf-sb-select" id="sbBorderStyle">
                                        <option value="solid">Solid</option>
                                        <option value="dashed">Dashed</option>
                                        <option value="dotted">Dotted</option>
                                        <option value="double">Double</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- TAB 2: NUMBER FORMATTING -->
                    <div class="sf-tab-content sf-tab-number" id="tabContentNumber">
                        <div class="sf-sb-section">
                            <label class="sf-sb-label">Number Category</label>
                            <select class="sf-sb-select" id="sbCategory">
                                <option value="general">Automatic / General</option>
                                <option value="number">Plain Number</option>
                                <option value="currency">Currency ($ USD)</option>
                                <option value="currency_eur">Currency (€ EUR)</option>
                                <option value="currency_gbp">Currency (£ GBP)</option>
                                <option value="currency_jpy">Currency (¥ JPY)</option>
                                <option value="accounting">Accounting ($)</option>
                                <option value="percent">Percentage (%)</option>
                                <option value="scientific">Scientific (E+)</option>
                                <option value="date">Date (YYYY-MM-DD)</option>
                                <option value="date_long">Date (MMM D, YYYY)</option>
                                <option value="time">Time (HH:MM:SS)</option>
                                <option value="text">Plain Text</option>
                            </select>
                        </div>

                        <div class="sf-sb-section">
                            <label class="sf-sb-label">Decimal Places</label>
                            <div class="sf-sb-row">
                                <button class="sf-sb-btn" id="sbDecMinus">-</button>
                                <input type="number" class="sf-sb-input" id="sbDecCount" value="2" min="0" max="10">
                                <button class="sf-sb-btn" id="sbDecPlus">+</button>
                            </div>
                        </div>
                    </div>

                    <!-- TAB 3: RULES (CONDITIONAL FORMATTING & VALIDATION) -->
                    <div class="sf-tab-content sf-tab-rules" id="tabContentRules">
                        <div class="sf-sb-section">
                            <label class="sf-sb-label">Conditional Formatting</label>
                            <button class="sf-btn sf-btn-primary sf-sb-fullwidth" id="sbAddRuleBtn">+ Add Format Rule</button>
                            <div class="sf-rules-list" id="sbRulesList">
                                <div class="sf-empty-rules">No conditional rules for current sheet.</div>
                            </div>
                        </div>

                        <div class="sf-sb-section">
                            <label class="sf-sb-label">Data Validation</label>
                            <button class="sf-btn sf-btn-secondary sf-sb-fullwidth" id="sbDataValidationBtn">Configure Validation</button>
                        </div>
                    </div>

                    <!-- TAB 4: NOTES & COMMENTS -->
                    <div class="sf-tab-content sf-tab-notes" id="tabContentNotes">
                        <div class="sf-sb-section">
                            <label class="sf-sb-label">Cell Note / Comment</label>
                            <textarea class="sf-sb-textarea" id="sbNoteText" placeholder="Add an analytical note or annotation to this cell..."></textarea>
                            <div class="sf-sb-row" style="margin-top: 8px;">
                                <button class="sf-btn sf-btn-primary" id="sbSaveNoteBtn">Save Note</button>
                                <button class="sf-btn sf-btn-danger" id="sbDeleteNoteBtn">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    _bindEvents() {
        // Close button
        this.container.querySelector('#sfSidebarClose').addEventListener('click', () => {
            this.close();
        });

        // Tab switching
        const tabs = this.container.querySelectorAll('.sf-sb-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('sf-sb-tab-active'));
                tab.classList.add('sf-sb-tab-active');

                const target = tab.dataset.tab;
                this.container.querySelectorAll('.sf-tab-content').forEach(c => c.classList.remove('sf-content-active'));

                const activeContent = this.container.querySelector(`#tabContent${target.charAt(0).toUpperCase() + target.slice(1)}`);
                if (activeContent) activeContent.classList.add('sf-content-active');
            });
        });

        // Formatting event bridges
        this.container.querySelector('#sbFontFamily').addEventListener('change', (e) => this.emitter.emit('format:fontFamily', e.target.value));
        this.container.querySelector('#sbFontSize').addEventListener('change', (e) => this.emitter.emit('format:fontSize', parseInt(e.target.value, 10)));
        this.container.querySelector('#sbBtnBold').addEventListener('click', () => this.emitter.emit('format:toggleBold'));
        this.container.querySelector('#sbBtnItalic').addEventListener('click', () => this.emitter.emit('format:toggleItalic'));
        this.container.querySelector('#sbBtnUnderline').addEventListener('click', () => this.emitter.emit('format:toggleUnderline'));
        this.container.querySelector('#sbBtnStrike').addEventListener('click', () => this.emitter.emit('format:toggleStrike'));

        this.container.querySelector('#sbBtnAlignLeft').addEventListener('click', () => this.emitter.emit('format:alignH', 'left'));
        this.container.querySelector('#sbBtnAlignCenter').addEventListener('click', () => this.emitter.emit('format:alignH', 'center'));
        this.container.querySelector('#sbBtnAlignRight').addEventListener('click', () => this.emitter.emit('format:alignH', 'right'));
        this.container.querySelector('#sbCheckWrap').addEventListener('change', (e) => this.emitter.emit('format:wrapText', e.target.checked));

        this.container.querySelector('#sbTextColor').addEventListener('input', (e) => this.emitter.emit('format:color', e.target.value));
        this.container.querySelector('#sbFillColor').addEventListener('input', (e) => this.emitter.emit('format:backgroundColor', e.target.value));

        // Borders
        this.container.querySelectorAll('.sf-sb-border-buttons .sf-sb-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const borderType = btn.dataset.border;
                const color = this.container.querySelector('#sbBorderColor').value;
                const style = this.container.querySelector('#sbBorderStyle').value;
                this.emitter.emit('format:customBorder', { borderType, color, style });
            });
        });

        // Number formats
        this.container.querySelector('#sbCategory').addEventListener('change', (e) => this.emitter.emit('format:numFormat', e.target.value));
        this.container.querySelector('#sbDecMinus').addEventListener('click', () => this.emitter.emit('format:decimalsChange', -1));
        this.container.querySelector('#sbDecPlus').addEventListener('click', () => this.emitter.emit('format:decimalsChange', 1));

        // Rules buttons
        this.container.querySelector('#sbAddRuleBtn').addEventListener('click', () => this.emitter.emit('action:openConditionalModal'));
        this.container.querySelector('#sbDataValidationBtn').addEventListener('click', () => this.emitter.emit('action:openValidationModal'));

        // Notes
        this.container.querySelector('#sbSaveNoteBtn').addEventListener('click', () => {
            const text = this.container.querySelector('#sbNoteText').value.trim();
            this.emitter.emit('cell:saveNote', text);
        });

        this.container.querySelector('#sbDeleteNoteBtn').addEventListener('click', () => {
            this.container.querySelector('#sbNoteText').value = '';
            this.emitter.emit('cell:saveNote', null);
        });

        // Selection changed listener
        this.emitter.on('selection:changed', ({ cell }) => {
            this.syncState(cell);
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.container.classList.add('sf-sidebar-open');
    }

    close() {
        this.isOpen = false;
        this.container.classList.remove('sf-sidebar-open');
    }

    syncState(cell) {
        this.currentCell = cell;
        if (!cell) return;

        const s = cell.style || {};
        if (s.fontFamily) this.container.querySelector('#sbFontFamily').value = s.fontFamily;
        if (s.fontSize) this.container.querySelector('#sbFontSize').value = String(s.fontSize);

        this.container.querySelector('#sbBtnBold').classList.toggle('sf-sb-active', Boolean(s.bold));
        this.container.querySelector('#sbBtnItalic').classList.toggle('sf-sb-active', Boolean(s.italic));
        this.container.querySelector('#sbBtnUnderline').classList.toggle('sf-sb-active', Boolean(s.underline));
        this.container.querySelector('#sbBtnStrike').classList.toggle('sf-sb-active', Boolean(s.strikethrough));

        this.container.querySelector('#sbBtnAlignLeft').classList.toggle('sf-sb-active', s.alignH === 'left' || !s.alignH);
        this.container.querySelector('#sbBtnAlignCenter').classList.toggle('sf-sb-active', s.alignH === 'center');
        this.container.querySelector('#sbBtnAlignRight').classList.toggle('sf-sb-active', s.alignH === 'right');
        this.container.querySelector('#sbCheckWrap').checked = Boolean(s.wrapText);

        if (s.color) this.container.querySelector('#sbTextColor').value = s.color;
        if (s.backgroundColor) this.container.querySelector('#sbFillColor').value = s.backgroundColor;

        if (cell.numFormat) this.container.querySelector('#sbCategory').value = cell.numFormat;
        if (cell.decimals !== null && cell.decimals !== undefined) {
            this.container.querySelector('#sbDecCount').value = cell.decimals;
        }

        this.container.querySelector('#sbNoteText').value = cell.comment || '';
    }
}
