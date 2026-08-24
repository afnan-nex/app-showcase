/**
 * SheetForge - Cell Editor & Formula Autocomplete
 * Synchronized inline cell editing, formula bar binding, function hints, and formula reference highlights
 */
import { formatCellAddress, parseCellAddress } from '../model/Sheet.js';

export const BUILT_IN_FUNCTIONS_INFO = [
    { name: 'SUM', desc: 'Adds all numbers in a range', syntax: 'SUM(value1, [value2, ...])' },
    { name: 'AVERAGE', desc: 'Calculates the arithmetic mean', syntax: 'AVERAGE(value1, [value2, ...])' },
    { name: 'COUNT', desc: 'Counts the number of cells containing numbers', syntax: 'COUNT(value1, [value2, ...])' },
    { name: 'COUNTA', desc: 'Counts the number of non-empty cells', syntax: 'COUNTA(value1, [value2, ...])' },
    { name: 'COUNTIF', desc: 'Counts cells meeting a condition', syntax: 'COUNTIF(range, criteria)' },
    { name: 'SUMIF', desc: 'Adds cells specified by a given condition', syntax: 'SUMIF(range, criteria, [sum_range])' },
    { name: 'MIN', desc: 'Returns the minimum value in a range', syntax: 'MIN(value1, [value2, ...])' },
    { name: 'MAX', desc: 'Returns the maximum value in a range', syntax: 'MAX(value1, [value2, ...])' },
    { name: 'IF', desc: 'Returns one value if condition is TRUE and another if FALSE', syntax: 'IF(logical_test, value_if_true, [value_if_false])' },
    { name: 'IFS', desc: 'Checks multiple conditions and returns first true value', syntax: 'IFS(condition1, value1, [condition2, value2, ...])' },
    { name: 'AND', desc: 'Returns TRUE if all arguments evaluate to TRUE', syntax: 'AND(logical1, [logical2, ...])' },
    { name: 'OR', desc: 'Returns TRUE if any argument evaluates to TRUE', syntax: 'OR(logical1, [logical2, ...])' },
    { name: 'NOT', desc: 'Reverses the logical value of its argument', syntax: 'NOT(logical)' },
    { name: 'IFERROR', desc: 'Returns a custom value if a formula errors', syntax: 'IFERROR(value, value_if_error)' },
    { name: 'VLOOKUP', desc: 'Looks for a value in the leftmost column and returns a value in the same row', syntax: 'VLOOKUP(lookup_value, table_array, col_index, [range_lookup])' },
    { name: 'HLOOKUP', desc: 'Looks for a value in the top row and returns a value in the same column', syntax: 'HLOOKUP(lookup_value, table_array, row_index, [range_lookup])' },
    { name: 'INDEX', desc: 'Returns a value or reference of the cell at a given intersection', syntax: 'INDEX(array, row_num, [col_num])' },
    { name: 'MATCH', desc: 'Returns relative position of an item in a range matching specified value', syntax: 'MATCH(lookup_value, lookup_array, [match_type])' },
    { name: 'CONCAT', desc: 'Combines the text from multiple ranges or strings', syntax: 'CONCAT(text1, [text2, ...])' },
    { name: 'LEFT', desc: 'Returns specified number of characters from start of text', syntax: 'LEFT(text, [num_chars])' },
    { name: 'RIGHT', desc: 'Returns specified number of characters from end of text', syntax: 'RIGHT(text, [num_chars])' },
    { name: 'MID', desc: 'Returns characters from middle of text string given start position and length', syntax: 'MID(text, start_num, num_chars)' },
    { name: 'LEN', desc: 'Returns the number of characters in a text string', syntax: 'LEN(text)' },
    { name: 'UPPER', desc: 'Converts text to all uppercase letters', syntax: 'UPPER(text)' },
    { name: 'LOWER', desc: 'Converts text to all lowercase letters', syntax: 'LOWER(text)' },
    { name: 'PROPER', desc: 'Capitalizes the first letter in each word of a text value', syntax: 'PROPER(text)' },
    { name: 'TRIM', desc: 'Removes all spaces from text except single spaces between words', syntax: 'TRIM(text)' },
    { name: 'ROUND', desc: 'Rounds a number to a specified number of digits', syntax: 'ROUND(number, num_digits)' },
    { name: 'ROUNDUP', desc: 'Rounds a number up away from zero', syntax: 'ROUNDUP(number, num_digits)' },
    { name: 'ROUNDDOWN', desc: 'Rounds a number down toward zero', syntax: 'ROUNDDOWN(number, num_digits)' },
    { name: 'ABS', desc: 'Returns the absolute value of a number', syntax: 'ABS(number)' },
    { name: 'SQRT', desc: 'Returns the positive square root of a number', syntax: 'SQRT(number)' },
    { name: 'POWER', desc: 'Returns the result of a number raised to a power', syntax: 'POWER(number, power)' },
    { name: 'MOD', desc: 'Returns the remainder after number is divided by divisor', syntax: 'MOD(number, divisor)' },
    { name: 'TODAY', desc: 'Returns the current date', syntax: 'TODAY()' },
    { name: 'NOW', desc: 'Returns the current date and time', syntax: 'NOW()' },
    { name: 'DATE', desc: 'Returns sequential serial number for a given date', syntax: 'DATE(year, month, day)' },
    { name: 'ISNUMBER', desc: 'Returns TRUE if the value is a number', syntax: 'ISNUMBER(value)' },
    { name: 'ISTEXT', desc: 'Returns TRUE if the value is text', syntax: 'ISTEXT(value)' },
    { name: 'ISBLANK', desc: 'Returns TRUE if the cell is empty', syntax: 'ISBLANK(value)' }
];

export class CellEditor {
    constructor(virtualGrid, selectionManager, eventEmitter, onCommit = null) {
        this.grid = virtualGrid;
        this.selection = selectionManager;
        this.emitter = eventEmitter;
        this.onCommit = onCommit;

        this.isEditing = false;
        this.editingCell = null;
        this.initialValue = '';

        this._setupAutocompleteDOM();
        this._bindEvents();
    }

    _setupAutocompleteDOM() {
        this.autocompletePopup = document.createElement('div');
        this.autocompletePopup.className = 'sf-autocomplete-popup';
        this.autocompletePopup.style.display = 'none';
        document.body.appendChild(this.autocompletePopup);
    }

    _bindEvents() {
        // Double-click cell to start edit
        this.grid.canvas.addEventListener('dblclick', (e) => {
            const coords = this.grid.getCellFromCoords(e.clientX, e.clientY);
            this.startEditing(coords.row, coords.col);
        });

        // Keydown in editor
        this.grid.editor.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (e.altKey) {
                    // Alt+Enter = insert newline
                    return;
                }
                e.preventDefault();
                this.commitEdit(e.shiftKey ? 'up' : 'down');
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this.commitEdit(e.shiftKey ? 'left' : 'right');
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.cancelEdit();
            }
        });

        // Input sync with formula bar & autocomplete
        this.grid.editor.addEventListener('input', () => {
            const val = this.grid.editor.innerText;
            if (this.emitter) {
                this.emitter.emit('editor:input', { value: val });
            }
            this._handleAutocomplete(val);
        });
    }

    startEditing(row, col, initialChar = null) {
        if (!this.grid.sheet) return;
        this.isEditing = true;
        this.editingCell = { row, col };

        const cell = this.grid.sheet.getCell(row, col);
        this.initialValue = cell ? (cell.formula || (cell.rawValue !== null && cell.rawValue !== undefined ? String(cell.rawValue) : '')) : '';

        const textToEdit = (initialChar !== null) ? initialChar : this.initialValue;

        const rect = this.grid.getCellRect(row, col);
        this.grid.editorContainer.style.top = `${rect.top}px`;
        this.grid.editorContainer.style.left = `${rect.left}px`;
        this.grid.editorContainer.style.minWidth = `${rect.width}px`;
        this.grid.editorContainer.style.minHeight = `${rect.height}px`;
        this.grid.editorContainer.style.display = 'block';

        this.grid.editor.innerText = textToEdit;
        this.grid.editor.focus();

        // Move cursor to end of text
        this._moveCursorToEnd(this.grid.editor);

        if (this.emitter) {
            this.emitter.emit('editor:start', {
                row,
                col,
                value: textToEdit
            });
        }

        this._handleAutocomplete(textToEdit);
    }

    commitEdit(navDirection = null) {
        if (!this.isEditing) return;
        const val = this.grid.editor.innerText;
        const { row, col } = this.editingCell;

        this.isEditing = false;
        this.grid.editorContainer.style.display = 'none';
        this.autocompletePopup.style.display = 'none';

        if (this.onCommit) {
            this.onCommit(row, col, val);
        }

        if (this.emitter) {
            this.emitter.emit('editor:commit', { row, col, value: val });
        }

        // Navigate to next cell if specified
        if (navDirection) {
            switch (navDirection) {
                case 'down': this.selection.moveActiveCell(1, 0); break;
                case 'up': this.selection.moveActiveCell(-1, 0); break;
                case 'right': this.selection.moveActiveCell(0, 1); break;
                case 'left': this.selection.moveActiveCell(0, -1); break;
            }
        }
    }

    cancelEdit() {
        if (!this.isEditing) return;
        this.isEditing = false;
        this.grid.editorContainer.style.display = 'none';
        this.autocompletePopup.style.display = 'none';

        if (this.emitter) {
            this.emitter.emit('editor:cancel', {
                row: this.editingCell.row,
                col: this.editingCell.col,
                initialValue: this.initialValue
            });
        }
    }

    setEditorValue(val) {
        if (this.isEditing) {
            this.grid.editor.innerText = val;
            this._moveCursorToEnd(this.grid.editor);
            this._handleAutocomplete(val);
        }
    }

    _handleAutocomplete(val) {
        if (!val || !val.startsWith('=')) {
            this.autocompletePopup.style.display = 'none';
            return;
        }

        // Match current token being typed
        const match = val.match(/=([A-Za-z0-9_]*)$/);
        if (!match || match[1].length === 0) {
            this.autocompletePopup.style.display = 'none';
            return;
        }

        const query = match[1].toUpperCase();
        const matches = BUILT_IN_FUNCTIONS_INFO.filter(f => f.name.startsWith(query)).slice(0, 6);

        if (matches.length === 0) {
            this.autocompletePopup.style.display = 'none';
            return;
        }

        const edRect = this.grid.editor.getBoundingClientRect();
        this.autocompletePopup.style.top = `${edRect.bottom + 4}px`;
        this.autocompletePopup.style.left = `${edRect.left}px`;
        this.autocompletePopup.style.display = 'block';

        let html = '';
        matches.forEach((fn, i) => {
            html += `
                <div class="sf-ac-item ${i === 0 ? 'sf-ac-active' : ''}" data-fn="${fn.name}">
                    <div class="sf-ac-name">${fn.name}</div>
                    <div class="sf-ac-desc">${fn.desc}</div>
                    <div class="sf-ac-syntax">${fn.syntax}</div>
                </div>
            `;
        });
        this.autocompletePopup.innerHTML = html;

        // Click to insert function
        const items = this.autocompletePopup.querySelectorAll('.sf-ac-item');
        items.forEach(el => {
            el.addEventListener('mousedown', (e) => {
                e.preventDefault();
                const fnName = el.dataset.fn;
                this.insertFunction(fnName);
            });
        });
    }

    insertFunction(fnName) {
        const current = this.grid.editor.innerText;
        const replaced = current.replace(/=([A-Za-z0-9_]*)$/, `=${fnName}(`);
        this.grid.editor.innerText = replaced;
        this._moveCursorToEnd(this.grid.editor);
        this.autocompletePopup.style.display = 'none';

        if (this.emitter) {
            this.emitter.emit('editor:input', { value: replaced });
        }
    }

    _moveCursorToEnd(el) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}
