/**
 * SheetForge - Formula Bar
 * Name Box address locator, Fx function inserter, and synchronized multi-line formula editor
 */
import { parseCellAddress } from '../model/Sheet.js';

export class FormulaBar {
    constructor(containerElement, eventEmitter) {
        this.container = containerElement;
        this.emitter = eventEmitter;
        this.isEditing = false;

        this._render();
        this._bindEvents();
    }

    _render() {
        this.container.innerHTML = `
            <div class="sf-formulabar">
                <!-- Name Box (Jump to cell address) -->
                <div class="sf-namebox-wrapper">
                    <input type="text" class="sf-namebox" id="sfNameBox" value="A1" spellcheck="false" title="Name Box (Enter cell address like A1 or range like A1:C10)">
                </div>

                <div class="sf-formulabar-divider"></div>

                <!-- Formula Action Buttons -->
                <div class="sf-formula-actions">
                    <button class="sf-formula-btn sf-btn-cancel" id="fbCancel" title="Cancel (Esc)" disabled>✕</button>
                    <button class="sf-formula-btn sf-btn-confirm" id="fbConfirm" title="Enter / Confirm (Enter)" disabled>✓</button>
                    <button class="sf-formula-btn sf-btn-fx" id="fbFx" title="Insert Function (fx)"><i>fx</i></button>
                </div>

                <div class="sf-formulabar-divider"></div>

                <!-- Formula Input Field -->
                <div class="sf-formula-input-wrapper">
                    <input type="text" class="sf-formula-input" id="sfFormulaInput" placeholder="Enter value or formula (e.g. =SUM(A1:A10))" spellcheck="false">
                </div>
            </div>
        `;

        this.nameBox = this.container.querySelector('#sfNameBox');
        this.btnCancel = this.container.querySelector('#fbCancel');
        this.btnConfirm = this.container.querySelector('#fbConfirm');
        this.btnFx = this.container.querySelector('#fbFx');
        this.formulaInput = this.container.querySelector('#sfFormulaInput');
    }

    _bindEvents() {
        // Name Box Jump
        this.nameBox.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const text = this.nameBox.value.trim().toUpperCase();
                this._handleJumpTo(text);
            }
        });

        // Formula Input Focus & Typing
        this.formulaInput.addEventListener('focus', () => {
            this.setEditingMode(true);
            if (this.emitter) {
                this.emitter.emit('formulabar:focus');
            }
        });

        this.formulaInput.addEventListener('input', () => {
            this.setEditingMode(true);
            const val = this.formulaInput.value;
            if (this.emitter) {
                this.emitter.emit('formulabar:input', { value: val });
            }
        });

        this.formulaInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const val = this.formulaInput.value;
                this.setEditingMode(false);
                if (this.emitter) {
                    this.emitter.emit('formulabar:commit', { value: val });
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.setEditingMode(false);
                if (this.emitter) {
                    this.emitter.emit('formulabar:cancel');
                }
            }
        });

        // Buttons
        this.btnCancel.addEventListener('click', () => {
            this.setEditingMode(false);
            if (this.emitter) this.emitter.emit('formulabar:cancel');
        });

        this.btnConfirm.addEventListener('click', () => {
            const val = this.formulaInput.value;
            this.setEditingMode(false);
            if (this.emitter) this.emitter.emit('formulabar:commit', { value: val });
        });

        this.btnFx.addEventListener('click', () => {
            if (this.emitter) this.emitter.emit('action:insertFunctionGuide');
        });

        // Sync with selection changes
        this.emitter.on('selection:changed', ({ cell, address, dimensions }) => {
            if (!this.isEditing) {
                this.nameBox.value = address || 'A1';
                const cellText = cell ? (cell.formula || (cell.rawValue !== null && cell.rawValue !== undefined ? String(cell.rawValue) : '')) : '';
                this.formulaInput.value = cellText;
                this.setEditingMode(false);
            }
        });

        // Sync with in-cell editor
        this.emitter.on('editor:start', ({ value }) => {
            this.formulaInput.value = value;
            this.setEditingMode(true);
        });

        this.emitter.on('editor:input', ({ value }) => {
            this.formulaInput.value = value;
            this.setEditingMode(true);
        });

        this.emitter.on('editor:commit', () => {
            this.setEditingMode(false);
        });

        this.emitter.on('editor:cancel', ({ initialValue }) => {
            this.formulaInput.value = initialValue;
            this.setEditingMode(false);
        });
    }

    setEditingMode(editing) {
        this.isEditing = editing;
        this.btnCancel.disabled = !editing;
        this.btnConfirm.disabled = !editing;
        if (editing) {
            this.btnCancel.classList.add('sf-active-action');
            this.btnConfirm.classList.add('sf-active-action');
        } else {
            this.btnCancel.classList.remove('sf-active-action');
            this.btnConfirm.classList.remove('sf-active-action');
        }
    }

    setValue(val) {
        this.formulaInput.value = val !== null && val !== undefined ? String(val) : '';
    }

    _handleJumpTo(addrStr) {
        if (!addrStr) return;

        if (addrStr.includes(':')) {
            const parts = addrStr.split(':');
            const start = parseCellAddress(parts[0]);
            const end = parseCellAddress(parts[1]);
            if (start && end && this.emitter) {
                this.emitter.emit('grid:selectRange', {
                    startRow: start.row,
                    startCol: start.col,
                    endRow: end.row,
                    endCol: end.col
                });
            }
        } else {
            const addr = parseCellAddress(addrStr);
            if (addr && this.emitter) {
                this.emitter.emit('grid:selectCell', {
                    row: addr.row,
                    col: addr.col
                });
            }
        }
    }
}
