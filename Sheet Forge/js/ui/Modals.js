/**
 * SheetForge - Modals Engine
 * Find & Replace, Conditional Formatting Rules, Data Validation, Duplicates, Keyboard Shortcuts, and About dialogs
 */
import { BUILT_IN_FUNCTIONS_INFO } from '../grid/CellEditor.js';

export class Modals {
    constructor(eventEmitter) {
        this.emitter = eventEmitter;
        this.activeModal = null;

        this._setupDOM();
        this._bindEvents();
    }

    _setupDOM() {
        this.container = document.createElement('div');
        this.container.className = 'sf-modals-root';
        this.container.innerHTML = `
            <!-- 1. FIND & REPLACE MODAL -->
            <div class="sf-modal-backdrop" id="modalFindReplace" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="frTitle">
                <div class="sf-modal-dialog">
                    <div class="sf-modal-header">
                        <h3 class="sf-modal-title" id="frTitle">Find and Replace</h3>
                        <button class="sf-modal-close" data-close aria-label="Close">✕</button>
                    </div>
                    <div class="sf-modal-body">
                        <div class="sf-form-group">
                            <label for="frFindInput">Find</label>
                            <input type="text" class="sf-input" id="frFindInput" placeholder="Text or value to find...">
                        </div>
                        <div class="sf-form-group">
                            <label for="frReplaceInput">Replace with</label>
                            <input type="text" class="sf-input" id="frReplaceInput" placeholder="Replacement text...">
                        </div>
                        <div class="sf-form-group sf-checkbox-group">
                            <label><input type="checkbox" id="frMatchCase"> Match case</label>
                            <label><input type="checkbox" id="frMatchEntire"> Match entire cell</label>
                            <label><input type="checkbox" id="frWorkbookScope"> Search entire workbook</label>
                        </div>
                        <div class="sf-fr-status" id="frStatus">Ready to search.</div>
                    </div>
                    <div class="sf-modal-footer">
                        <button class="sf-btn sf-btn-secondary" id="frFindPrevBtn">Previous</button>
                        <button class="sf-btn sf-btn-secondary" id="frFindNextBtn">Find Next</button>
                        <button class="sf-btn sf-btn-secondary" id="frReplaceBtn">Replace</button>
                        <button class="sf-btn sf-btn-primary" id="frReplaceAllBtn">Replace All</button>
                    </div>
                </div>
            </div>

            <!-- 2. CONDITIONAL FORMATTING MODAL -->
            <div class="sf-modal-backdrop" id="modalConditional" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="cfTitle">
                <div class="sf-modal-dialog">
                    <div class="sf-modal-header">
                        <h3 class="sf-modal-title" id="cfTitle">Conditional Formatting Rule</h3>
                        <button class="sf-modal-close" data-close aria-label="Close">✕</button>
                    </div>
                    <div class="sf-modal-body">
                        <div class="sf-form-group">
                            <label for="cfRangeInput">Apply to Range</label>
                            <input type="text" class="sf-input" id="cfRangeInput" value="A1:E20">
                        </div>
                        <div class="sf-form-group">
                            <label for="cfRuleType">Format cells if...</label>
                            <select class="sf-select" id="cfRuleType">
                                <option value="greaterThan">Cell value is greater than</option>
                                <option value="lessThan">Cell value is less than</option>
                                <option value="equal">Cell value is equal to</option>
                                <option value="textContains">Text contains</option>
                                <option value="isDuplicate">Highlight duplicate values</option>
                            </select>
                            <input type="text" class="sf-input" id="cfRuleVal" placeholder="Value..." style="margin-top: 6px;">
                        </div>
                        <div class="sf-form-group">
                            <label>Formatting Highlight Style</label>
                            <div class="sf-sb-color-row">
                                <div class="sf-sb-color-field">
                                    <span>Fill Color:</span>
                                    <input type="color" id="cfFillColor" value="#dcfce7">
                                </div>
                                <div class="sf-sb-color-field">
                                    <span>Text Color:</span>
                                    <input type="color" id="cfTextColor" value="#15803d">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="sf-modal-footer">
                        <button class="sf-btn sf-btn-secondary" data-close>Cancel</button>
                        <button class="sf-btn sf-btn-primary" id="cfSaveRuleBtn">Apply Rule</button>
                    </div>
                </div>
            </div>

            <!-- 3. DATA VALIDATION MODAL -->
            <div class="sf-modal-backdrop" id="modalValidation" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="dvTitle">
                <div class="sf-modal-dialog">
                    <div class="sf-modal-header">
                        <h3 class="sf-modal-title" id="dvTitle">Data Validation Criteria</h3>
                        <button class="sf-modal-close" data-close aria-label="Close">✕</button>
                    </div>
                    <div class="sf-modal-body">
                        <div class="sf-form-group">
                            <label for="dvCriteriaType">Validation Criteria</label>
                            <select class="sf-select" id="dvCriteriaType">
                                <option value="list">List of dropdown options</option>
                                <option value="number">Whole Number / Decimal (Between Min and Max)</option>
                                <option value="text_length">Text length constraint</option>
                            </select>
                        </div>
                        <div class="sf-form-group" id="dvListGroup">
                            <label for="dvListInput">Comma-separated List Items</label>
                            <input type="text" class="sf-input" id="dvListInput" placeholder="Active, Pending, Completed, Cancelled">
                        </div>
                        <div class="sf-form-group" id="dvNumberGroup" style="display:none;">
                            <label>Numerical Bounds</label>
                            <div class="sf-sb-row">
                                <input type="number" class="sf-input" id="dvNumMin" placeholder="Min (e.g. 0)">
                                <input type="number" class="sf-input" id="dvNumMax" placeholder="Max (e.g. 100)">
                            </div>
                        </div>
                        <div class="sf-form-group">
                            <label for="dvErrorMsg">Custom Alert Message</label>
                            <input type="text" class="sf-input" id="dvErrorMsg" value="The value entered is not valid for this cell constraint.">
                        </div>
                    </div>
                    <div class="sf-modal-footer">
                        <button class="sf-btn sf-btn-danger" id="dvRemoveBtn">Clear Validation</button>
                        <button class="sf-btn sf-btn-primary" id="dvSaveBtn">Save Validation Rule</button>
                    </div>
                </div>
            </div>

            <!-- 4. REMOVE DUPLICATES MODAL -->
            <div class="sf-modal-backdrop" id="modalDuplicates" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="dupTitle">
                <div class="sf-modal-dialog">
                    <div class="sf-modal-header">
                        <h3 class="sf-modal-title" id="dupTitle">Duplicate Row Detection</h3>
                        <button class="sf-modal-close" data-close aria-label="Close">✕</button>
                    </div>
                    <div class="sf-modal-body">
                        <p style="font-size: 12px; color: var(--sf-text-secondary); margin-bottom: 12px;">
                            Identify duplicate rows in the current selected data range.
                        </p>
                        <div class="sf-form-group">
                            <label>Action</label>
                            <select class="sf-select" id="dupActionSelect">
                                <option value="remove">Remove duplicate rows from selection</option>
                                <option value="highlight">Highlight duplicate rows with yellow fill</option>
                            </select>
                        </div>
                    </div>
                    <div class="sf-modal-footer">
                        <button class="sf-btn sf-btn-secondary" data-close>Cancel</button>
                        <button class="sf-btn sf-btn-primary" id="dupExecuteBtn">Execute Action</button>
                    </div>
                </div>
            </div>

            <!-- 5. KEYBOARD SHORTCUTS MODAL -->
            <div class="sf-modal-backdrop" id="modalShortcuts" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="ksTitle">
                <div class="sf-modal-dialog sf-modal-lg">
                    <div class="sf-modal-header">
                        <h3 class="sf-modal-title" id="ksTitle">SheetForge Keyboard Shortcuts</h3>
                        <button class="sf-modal-close" data-close aria-label="Close">✕</button>
                    </div>
                    <div class="sf-modal-body sf-shortcuts-grid">
                        <div class="sf-shortcut-section">
                            <h4>Navigation & Selection</h4>
                            <div class="sf-shortcut-item"><span>Move Selection</span> <kbd>↑ ↓ ← →</kbd></div>
                            <div class="sf-shortcut-item"><span>Expand Range</span> <kbd>Shift + Arrows</kbd></div>
                            <div class="sf-shortcut-item"><span>Select All</span> <kbd>Ctrl + A</kbd></div>
                            <div class="sf-shortcut-item"><span>Select Row</span> <kbd>Shift + Space</kbd></div>
                            <div class="sf-shortcut-item"><span>Select Column</span> <kbd>Ctrl + Space</kbd></div>
                            <div class="sf-shortcut-item"><span>Next Row / Cell</span> <kbd>Enter / Tab</kbd></div>
                        </div>
                        <div class="sf-shortcut-section">
                            <h4>Cell Editing & Clipboard</h4>
                            <div class="sf-shortcut-item"><span>Edit Cell (F2)</span> <kbd>F2 / Double Click</kbd></div>
                            <div class="sf-shortcut-item"><span>Cancel Edit</span> <kbd>Escape</kbd></div>
                            <div class="sf-shortcut-item"><span>Copy</span> <kbd>Ctrl + C</kbd></div>
                            <div class="sf-shortcut-item"><span>Cut</span> <kbd>Ctrl + X</kbd></div>
                            <div class="sf-shortcut-item"><span>Paste</span> <kbd>Ctrl + V</kbd></div>
                            <div class="sf-shortcut-item"><span>Paste Values</span> <kbd>Ctrl + Shift + V</kbd></div>
                            <div class="sf-shortcut-item"><span>Undo / Redo</span> <kbd>Ctrl+Z / Ctrl+Y</kbd></div>
                        </div>
                        <div class="sf-shortcut-section">
                            <h4>Formatting & Analytical</h4>
                            <div class="sf-shortcut-item"><span>Bold</span> <kbd>Ctrl + B</kbd></div>
                            <div class="sf-shortcut-item"><span>Italic</span> <kbd>Ctrl + I</kbd></div>
                            <div class="sf-shortcut-item"><span>Underline</span> <kbd>Ctrl + U</kbd></div>
                            <div class="sf-shortcut-item"><span>Find & Replace</span> <kbd>Ctrl + F</kbd></div>
                            <div class="sf-shortcut-item"><span>Toggle Sidebar</span> <kbd>Ctrl + \\</kbd></div>
                            <div class="sf-shortcut-item"><span>Insert Chart</span> <kbd>Alt + F1</kbd></div>
                            <div class="sf-shortcut-item"><span>New Sheet</span> <kbd>Shift + F11</kbd></div>
                        </div>
                    </div>
                    <div class="sf-modal-footer">
                        <button class="sf-btn sf-btn-primary" data-close>Done</button>
                    </div>
                </div>
            </div>

            <!-- 6. FORMULAS GUIDE MODAL -->
            <div class="sf-modal-backdrop" id="modalFormulas" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="fgTitle">
                <div class="sf-modal-dialog sf-modal-lg">
                    <div class="sf-modal-header">
                        <h3 class="sf-modal-title" id="fgTitle">Formulas & Function Library</h3>
                        <button class="sf-modal-close" data-close aria-label="Close">✕</button>
                    </div>
                    <div class="sf-modal-body">
                        <input type="text" class="sf-input" id="fgSearchInput" placeholder="Search 35+ functions (e.g. SUM, VLOOKUP, IF, AVERAGE, INDEX)..." aria-label="Search Functions">
                        <div class="sf-formulas-list" id="fgList" style="margin-top: 12px; max-height: 380px; overflow-y: auto;"></div>
                    </div>
                    <div class="sf-modal-footer">
                        <button class="sf-btn sf-btn-primary" data-close>Close</button>
                    </div>
                </div>
            </div>

            <!-- 7. ABOUT MODAL -->
            <div class="sf-modal-backdrop" id="modalAbout" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="aboutTitle">
                <div class="sf-modal-dialog">
                    <div class="sf-modal-header">
                        <h3 class="sf-modal-title" id="aboutTitle">About SheetForge</h3>
                        <button class="sf-modal-close" data-close aria-label="Close">✕</button>
                    </div>
                    <div class="sf-modal-body sf-about-body">
                        <div class="sf-about-logo">📊 SheetForge</div>
                        <p><strong>Version:</strong> 2.0.0 Enterprise Productivity Edition</p>
                        <p>A complete browser-based spreadsheet application engineered with pure vanilla HTML5, CSS3, and modern JavaScript. Inspired by Microsoft Excel and Google Sheets.</p>
                        <ul class="sf-about-list">
                            <li>⚡ <strong>Zero Backend:</strong> 100% client-side, zero frameworks, static hosting ready.</li>
                            <li>🧮 <strong>Advanced Formula Engine:</strong> Recursive descent AST parser with 35+ functions and DAG dependency tracking.</li>
                            <li>🚀 <strong>Virtualized Grid:</strong> 60fps scrolling performance over massive datasets.</li>
                            <li>📈 <strong>HTML5 Canvas Charts:</strong> Live synchronized interactive data visualization.</li>
                            <li>💾 <strong>IndexedDB Autosave:</strong> Instant session recovery and offline persistence.</li>
                        </ul>
                    </div>
                    <div class="sf-modal-footer">
                        <button class="sf-btn sf-btn-primary" data-close>Close</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(this.container);
    }

    _bindEvents() {
        // Generic close buttons
        this.container.querySelectorAll('[data-close]').forEach(btn => {
            btn.addEventListener('click', () => this.closeAll());
        });

        // Click on backdrop dismisses
        this.container.querySelectorAll('.sf-modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) this.closeAll();
            });
        });

        // Find and Replace actions
        this.container.querySelector('#frFindNextBtn').addEventListener('click', () => this._doFind('next'));
        this.container.querySelector('#frFindPrevBtn').addEventListener('click', () => this._doFind('prev'));
        this.container.querySelector('#frReplaceBtn').addEventListener('click', () => this._doReplace());
        this.container.querySelector('#frReplaceAllBtn').addEventListener('click', () => this._doReplaceAll());

        // Conditional Formatting save
        this.container.querySelector('#cfSaveRuleBtn').addEventListener('click', () => {
            const rule = {
                range: this.container.querySelector('#cfRangeInput').value,
                type: this.container.querySelector('#cfRuleType').value,
                value: this.container.querySelector('#cfRuleVal').value,
                style: {
                    backgroundColor: this.container.querySelector('#cfFillColor').value,
                    color: this.container.querySelector('#cfTextColor').value
                }
            };
            this.emitter.emit('action:addConditionalRule', rule);
            this.closeAll();
        });

        // Validation criteria switcher
        const critSelect = this.container.querySelector('#dvCriteriaType');
        critSelect.addEventListener('change', () => {
            const isList = critSelect.value === 'list';
            this.container.querySelector('#dvListGroup').style.display = isList ? 'block' : 'none';
            this.container.querySelector('#dvNumberGroup').style.display = !isList ? 'block' : 'none';
        });

        // Save validation
        this.container.querySelector('#dvSaveBtn').addEventListener('click', () => {
            const validation = {
                type: critSelect.value,
                list: this.container.querySelector('#dvListInput').value.split(',').map(s => s.trim()).filter(Boolean),
                min: parseFloat(this.container.querySelector('#dvNumMin').value),
                max: parseFloat(this.container.querySelector('#dvNumMax').value),
                errorMsg: this.container.querySelector('#dvErrorMsg').value
            };
            this.emitter.emit('action:saveDataValidation', validation);
            this.closeAll();
        });

        this.container.querySelector('#dvRemoveBtn').addEventListener('click', () => {
            this.emitter.emit('action:saveDataValidation', null);
            this.closeAll();
        });

        // Duplicates Action
        this.container.querySelector('#dupExecuteBtn').addEventListener('click', () => {
            const action = this.container.querySelector('#dupActionSelect').value;
            this.emitter.emit('action:executeDuplicateAction', action);
            this.closeAll();
        });

        // Formula Guide Search
        const fgSearch = this.container.querySelector('#fgSearchInput');
        fgSearch.addEventListener('input', () => {
            this._renderFormulasList(fgSearch.value);
        });
    }

    openFindReplace(defaultFind = '') {
        this.closeAll();
        const modal = this.container.querySelector('#modalFindReplace');
        if (defaultFind) {
            modal.querySelector('#frFindInput').value = defaultFind;
        }
        modal.style.display = 'flex';
        modal.querySelector('#frFindInput').focus();
        this.activeModal = modal;
    }

    openConditional(defaultRange = 'A1:C10') {
        this.closeAll();
        const modal = this.container.querySelector('#modalConditional');
        modal.querySelector('#cfRangeInput').value = defaultRange;
        modal.style.display = 'flex';
        this.activeModal = modal;
    }

    openValidation() {
        this.closeAll();
        const modal = this.container.querySelector('#modalValidation');
        modal.style.display = 'flex';
        this.activeModal = modal;
    }

    openDuplicates() {
        this.closeAll();
        const modal = this.container.querySelector('#modalDuplicates');
        modal.style.display = 'flex';
        this.activeModal = modal;
    }

    openShortcuts() {
        this.closeAll();
        const modal = this.container.querySelector('#modalShortcuts');
        modal.style.display = 'flex';
        this.activeModal = modal;
    }

    openFormulasGuide() {
        this.closeAll();
        const modal = this.container.querySelector('#modalFormulas');
        this._renderFormulasList('');
        modal.style.display = 'flex';
        this.activeModal = modal;
    }

    openAbout() {
        this.closeAll();
        const modal = this.container.querySelector('#modalAbout');
        modal.style.display = 'flex';
        this.activeModal = modal;
    }

    closeAll() {
        this.container.querySelectorAll('.sf-modal-backdrop').forEach(m => m.style.display = 'none');
        this.activeModal = null;
    }

    _renderFormulasList(filterText = '') {
        const listEl = this.container.querySelector('#fgList');
        const query = (filterText || '').toLowerCase().trim();

        const filtered = BUILT_IN_FUNCTIONS_INFO.filter(f =>
            f.name.toLowerCase().includes(query) || f.desc.toLowerCase().includes(query)
        );

        listEl.innerHTML = filtered.map(fn => `
            <div class="sf-fg-item">
                <div class="sf-fg-header">
                    <span class="sf-fg-name">${fn.name}</span>
                    <span class="sf-fg-syntax">${fn.syntax}</span>
                </div>
                <div class="sf-fg-desc">${fn.desc}</div>
            </div>
        `).join('');
    }

    _doFind(direction) {
        const query = this.container.querySelector('#frFindInput').value;
        const matchCase = this.container.querySelector('#frMatchCase').checked;
        const matchEntire = this.container.querySelector('#frMatchEntire').checked;
        const workbookScope = this.container.querySelector('#frWorkbookScope').checked;

        if (this.emitter) {
            this.emitter.emit('action:findNext', {
                query,
                direction,
                matchCase,
                matchEntire,
                workbookScope,
                statusCallback: (msg) => {
                    this.container.querySelector('#frStatus').innerText = msg;
                }
            });
        }
    }

    _doReplace() {
        const query = this.container.querySelector('#frFindInput').value;
        const replacement = this.container.querySelector('#frReplaceInput').value;
        const matchCase = this.container.querySelector('#frMatchCase').checked;
        const matchEntire = this.container.querySelector('#frMatchEntire').checked;

        if (this.emitter) {
            this.emitter.emit('action:replace', {
                query,
                replacement,
                matchCase,
                matchEntire,
                statusCallback: (msg) => {
                    this.container.querySelector('#frStatus').innerText = msg;
                }
            });
        }
    }

    _doReplaceAll() {
        const query = this.container.querySelector('#frFindInput').value;
        const replacement = this.container.querySelector('#frReplaceInput').value;
        const matchCase = this.container.querySelector('#frMatchCase').checked;
        const matchEntire = this.container.querySelector('#frMatchEntire').checked;
        const workbookScope = this.container.querySelector('#frWorkbookScope').checked;

        if (this.emitter) {
            this.emitter.emit('action:replaceAll', {
                query,
                replacement,
                matchCase,
                matchEntire,
                workbookScope,
                statusCallback: (msg) => {
                    this.container.querySelector('#frStatus').innerText = msg;
                }
            });
        }
    }
}
