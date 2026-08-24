/**
 * SheetForge - Complete Standalone Client-Side Application
 * 100% self-contained vanilla JavaScript. Works on file://, http://, https://, and GitHub Pages.
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. Pub/Sub EventEmitter
    // =========================================================================
    class EventEmitter {
        constructor() {
            this.events = new Map();
        }

        on(event, listener) {
            if (!this.events.has(event)) this.events.set(event, new Set());
            this.events.get(event).add(listener);
            return () => this.off(event, listener);
        }

        off(event, listener) {
            if (this.events.has(event)) {
                this.events.get(event).delete(listener);
                if (this.events.get(event).size === 0) this.events.delete(event);
            }
        }

        emit(event, ...args) {
            if (this.events.has(event)) {
                for (const listener of this.events.get(event)) {
                    try {
                        listener(...args);
                    } catch (error) {
                        console.error(`Error in event listener for "${event}":`, error);
                    }
                }
            }
        }
    }

    // =========================================================================
    // 2. Storage Engine (IndexedDB + localStorage)
    // =========================================================================
    class Storage {
        constructor(dbName = 'SheetForgeDB', version = 1) {
            this.dbName = dbName;
            this.version = version;
            this.storeName = 'workbooks';
            this.db = null;
            this._initPromise = this._initDB();
        }

        async _initDB() {
            if (!('indexedDB' in window)) return null;
            return new Promise((resolve) => {
                try {
                    const request = indexedDB.open(this.dbName, this.version);
                    request.onupgradeneeded = (event) => {
                        const db = event.target.result;
                        if (!db.objectStoreNames.contains(this.storeName)) {
                            db.createObjectStore(this.storeName, { keyPath: 'id' });
                        }
                    };
                    request.onsuccess = (event) => {
                        this.db = event.target.result;
                        resolve(this.db);
                    };
                    request.onerror = () => resolve(null);
                } catch (err) {
                    resolve(null);
                }
            });
        }

        async saveWorkbook(workbookData) {
            await this._initPromise;
            const record = {
                id: workbookData.id || 'default_workbook',
                title: workbookData.title || 'Untitled Spreadsheet',
                updatedAt: Date.now(),
                data: workbookData
            };

            if (this.db) {
                return new Promise((resolve) => {
                    try {
                        const tx = this.db.transaction([this.storeName], 'readwrite');
                        const store = tx.objectStore(this.storeName);
                        const req = store.put(record);
                        req.onsuccess = () => resolve(true);
                        req.onerror = () => {
                            this._saveToLocalStorage(record);
                            resolve(false);
                        };
                    } catch (e) {
                        this._saveToLocalStorage(record);
                        resolve(false);
                    }
                });
            } else {
                this._saveToLocalStorage(record);
                return true;
            }
        }

        async loadWorkbook(workbookId = 'default_workbook') {
            await this._initPromise;
            if (this.db) {
                return new Promise((resolve) => {
                    try {
                        const tx = this.db.transaction([this.storeName], 'readonly');
                        const store = tx.objectStore(this.storeName);
                        const req = store.get(workbookId);
                        req.onsuccess = () => {
                            if (req.result && req.result.data) {
                                resolve(req.result.data);
                            } else {
                                resolve(this._loadFromLocalStorage(workbookId));
                            }
                        };
                        req.onerror = () => resolve(this._loadFromLocalStorage(workbookId));
                    } catch (e) {
                        resolve(this._loadFromLocalStorage(workbookId));
                    }
                });
            } else {
                return this._loadFromLocalStorage(workbookId);
            }
        }

        _saveToLocalStorage(record) {
            try {
                localStorage.setItem(`sheetforge_wb_${record.id}`, JSON.stringify(record));
            } catch (e) {}
        }

        _loadFromLocalStorage(workbookId) {
            try {
                const raw = localStorage.getItem(`sheetforge_wb_${workbookId}`);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    return parsed.data || parsed;
                }
            } catch (e) {}
            return null;
        }
    }

    // =========================================================================
    // 3. Command Pattern (Undo / Redo)
    // =========================================================================
    class Command {
        execute() { throw new Error('Command.execute() not implemented'); }
        undo() { throw new Error('Command.undo() not implemented'); }
        redo() { this.execute(); }
    }

    class BatchCommand extends Command {
        constructor(commands = [], description = 'Batch Action') {
            super();
            this.commands = commands;
            this.description = description;
        }

        add(command) { this.commands.push(command); }

        execute() {
            for (let i = 0; i < this.commands.length; i++) this.commands[i].execute();
        }

        undo() {
            for (let i = this.commands.length - 1; i >= 0; i--) this.commands[i].undo();
        }

        redo() {
            for (let i = 0; i < this.commands.length; i++) this.commands[i].redo();
        }
    }

    class CommandManager {
        constructor(maxHistory = 100, eventEmitter = null) {
            this.undoStack = [];
            this.redoStack = [];
            this.maxHistory = maxHistory;
            this.emitter = eventEmitter;
            this._isExecuting = false;
        }

        execute(command) {
            if (this._isExecuting) return;
            this._isExecuting = true;
            try {
                command.execute();
                this.undoStack.push(command);
                if (this.undoStack.length > this.maxHistory) this.undoStack.shift();
                this.redoStack = [];
                this._notify();
            } finally {
                this._isExecuting = false;
            }
        }

        undo() {
            if (!this.canUndo() || this._isExecuting) return false;
            this._isExecuting = true;
            try {
                const command = this.undoStack.pop();
                command.undo();
                this.redoStack.push(command);
                this._notify();
                return true;
            } finally {
                this._isExecuting = false;
            }
        }

        redo() {
            if (!this.canRedo() || this._isExecuting) return false;
            this._isExecuting = true;
            try {
                const command = this.redoStack.pop();
                command.redo();
                this.undoStack.push(command);
                this._notify();
                return true;
            } finally {
                this._isExecuting = false;
            }
        }

        canUndo() { return this.undoStack.length > 0; }
        canRedo() { return this.redoStack.length > 0; }

        _notify() {
            if (this.emitter) {
                this.emitter.emit('history:changed', {
                    canUndo: this.canUndo(),
                    canRedo: this.canRedo()
                });
            }
        }
    }

    // =========================================================================
    // 4. Toast Alerts & Note Tooltip
    // =========================================================================
    class Toast {
        static init() {
            if (!document.getElementById('sfToastContainer')) {
                const container = document.createElement('div');
                container.id = 'sfToastContainer';
                container.className = 'sf-toast-container';
                document.body.appendChild(container);
            }
        }

        static show(message, type = 'info', duration = 3000) {
            this.init();
            const container = document.getElementById('sfToastContainer');
            const toast = document.createElement('div');
            toast.className = `sf-toast sf-toast-${type}`;

            let icon = 'ℹ️';
            if (type === 'success') icon = '✓';
            if (type === 'error') icon = '✕';
            if (type === 'warning') icon = '⚠️';

            toast.innerHTML = `
                <span class="sf-toast-icon">${icon}</span>
                <span class="sf-toast-message">${message}</span>
            `;

            container.appendChild(toast);

            requestAnimationFrame(() => {
                toast.classList.add('sf-toast-visible');
            });

            setTimeout(() => {
                toast.classList.remove('sf-toast-visible');
                setTimeout(() => {
                    if (toast.parentNode) toast.parentNode.removeChild(toast);
                }, 200);
            }, duration);
        }

        static success(msg, duration = 2500) { this.show(msg, 'success', duration); }
        static error(msg, duration = 3500) { this.show(msg, 'error', duration); }
        static warning(msg, duration = 3000) { this.show(msg, 'warning', duration); }
        static info(msg, duration = 2500) { this.show(msg, 'info', duration); }
    }

    class NoteTooltip {
        constructor(grid) {
            this.grid = grid;
            this.tooltip = null;
            this.timeout = null;
            this._setupDOM();
            this._bindEvents();
        }

        _setupDOM() {
            this.tooltip = document.createElement('div');
            this.tooltip.className = 'sf-note-tooltip';
            this.tooltip.style.display = 'none';
            document.body.appendChild(this.tooltip);
        }

        _bindEvents() {
            this.grid.cellsContainer.addEventListener('mouseover', (e) => {
                const cellEl = e.target.closest('.sf-has-comment');
                if (cellEl) {
                    const r = parseInt(cellEl.dataset.row, 10);
                    const c = parseInt(cellEl.dataset.col, 10);
                    const cell = this.grid.sheet ? this.grid.sheet.getCell(r, c) : null;
                    if (cell && cell.comment) {
                        const rect = cellEl.getBoundingClientRect();
                        this.show(cell.comment, rect.right + 4, rect.top);
                    }
                }
            });

            this.grid.cellsContainer.addEventListener('mouseout', (e) => {
                const cellEl = e.target.closest('.sf-has-comment');
                if (cellEl) this.hide();
            });
        }

        show(text, x, y) {
            clearTimeout(this.timeout);
            this.tooltip.innerHTML = `
                <div class="sf-note-header">Note</div>
                <div class="sf-note-body">${this._escapeHTML(text)}</div>
            `;
            this.tooltip.style.left = `${Math.min(window.innerWidth - 220, x)}px`;
            this.tooltip.style.top = `${y}px`;
            this.tooltip.style.display = 'block';
        }

        hide() {
            this.timeout = setTimeout(() => {
                this.tooltip.style.display = 'none';
            }, 100);
        }

        _escapeHTML(str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        }
    }

    // =========================================================================
    // 5. DATA MODEL: Cell, Sheet, Workbook
    // =========================================================================
    const DEFAULT_CELL_STYLE = Object.freeze({
        fontFamily: 'Inter, sans-serif',
        fontSize: 13,
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        color: '#1e293b',
        backgroundColor: '#ffffff',
        alignH: 'left',
        alignV: 'middle',
        wrapText: false,
        borders: { top: null, right: null, bottom: null, left: null }
    });

    class Cell {
        constructor(row, col, options = {}) {
            this.row = row;
            this.col = col;
            this.rawValue = options.rawValue !== undefined ? options.rawValue : '';
            this.formula = options.formula || (typeof this.rawValue === 'string' && this.rawValue.startsWith('=') ? this.rawValue : '');
            this.computedValue = options.computedValue !== undefined ? options.computedValue : (this.formula ? null : this.rawValue);
            this.formattedValue = options.formattedValue || '';
            this.error = options.error || null;
            this.numFormat = options.numFormat || 'general';
            this.formatPattern = options.formatPattern || '';
            this.decimals = options.decimals !== undefined ? options.decimals : null;
            this.style = { ...DEFAULT_CELL_STYLE, ...(options.style || {}) };
            this.comment = options.comment || null;
            this.validation = options.validation || null;
            this.mergeInfo = options.mergeInfo || null;
        }

        get isFormula() { return Boolean(this.formula && this.formula.startsWith('=')); }

        get displayValue() {
            if (this.error) return this.error;
            if (this.formattedValue) return this.formattedValue;
            if (this.computedValue !== null && this.computedValue !== undefined) return String(this.computedValue);
            return String(this.rawValue || '');
        }

        get numericValue() {
            const val = this.computedValue !== null && this.computedValue !== undefined ? this.computedValue : this.rawValue;
            if (typeof val === 'number') return val;
            if (typeof val === 'string' && val.trim() !== '') {
                const parsed = Number(val.replace(/[\$,%]/g, ''));
                if (!isNaN(parsed)) return parsed;
            }
            return null;
        }

        setValue(val) {
            if (typeof val === 'string' && val.startsWith('=')) {
                this.formula = val;
                this.rawValue = val;
                this.computedValue = null;
                this.error = null;
            } else {
                this.formula = '';
                this.rawValue = val;
                this.computedValue = val;
                this.error = null;
            }
        }

        setStyle(styleObj) {
            this.style = {
                ...this.style,
                ...styleObj,
                borders: { ...(this.style.borders || {}), ...(styleObj.borders || {}) }
            };
        }

        clear(options = { contents: true, formats: true, comments: true }) {
            if (options.contents) {
                this.rawValue = '';
                this.formula = '';
                this.computedValue = '';
                this.formattedValue = '';
                this.error = null;
            }
            if (options.formats) {
                this.style = { ...DEFAULT_CELL_STYLE };
                this.numFormat = 'general';
                this.formatPattern = '';
                this.decimals = null;
            }
            if (options.comments) {
                this.comment = null;
            }
        }

        clone() {
            return new Cell(this.row, this.col, {
                rawValue: this.rawValue,
                formula: this.formula,
                computedValue: this.computedValue,
                formattedValue: this.formattedValue,
                error: this.error,
                numFormat: this.numFormat,
                formatPattern: this.formatPattern,
                decimals: this.decimals,
                style: JSON.parse(JSON.stringify(this.style)),
                comment: this.comment ? { ...this.comment } : null,
                validation: this.validation ? { ...this.validation } : null,
                mergeInfo: this.mergeInfo ? { ...this.mergeInfo } : null
            });
        }

        toJSON() {
            const obj = { r: this.row, c: this.col };
            if (this.rawValue !== '' && this.rawValue !== undefined) obj.v = this.rawValue;
            if (this.formula) obj.f = this.formula;
            if (this.numFormat && this.numFormat !== 'general') obj.nf = this.numFormat;
            if (this.formatPattern) obj.fp = this.formatPattern;
            if (this.decimals !== null) obj.d = this.decimals;
            if (this.comment) obj.cm = this.comment;
            if (this.validation) obj.vl = this.validation;
            if (this.mergeInfo) obj.m = this.mergeInfo;

            const diffStyle = {};
            let hasDiff = false;
            for (const key in this.style) {
                if (key === 'borders') {
                    const b = this.style.borders;
                    if (b && (b.top || b.right || b.bottom || b.left)) {
                        diffStyle.borders = b;
                        hasDiff = true;
                    }
                } else if (this.style[key] !== DEFAULT_CELL_STYLE[key]) {
                    diffStyle[key] = this.style[key];
                    hasDiff = true;
                }
            }
            if (hasDiff) obj.s = diffStyle;
            return obj;
        }

        static fromJSON(json) {
            return new Cell(json.r, json.c, {
                rawValue: json.v !== undefined ? json.v : '',
                formula: json.f || '',
                numFormat: json.nf || 'general',
                formatPattern: json.fp || '',
                decimals: json.d !== undefined ? json.d : null,
                comment: json.cm || null,
                validation: json.vl || null,
                mergeInfo: json.m || null,
                style: json.s ? { ...DEFAULT_CELL_STYLE, ...json.s } : { ...DEFAULT_CELL_STYLE }
            });
        }
    }

    const DEFAULT_ROW_COUNT = 100;
    const DEFAULT_COL_COUNT = 26;
    const DEFAULT_ROW_HEIGHT = 26;
    const DEFAULT_COL_WIDTH = 100;

    function colIndexToLetter(colIndex) {
        let letter = '';
        let temp = colIndex + 1;
        while (temp > 0) {
            let remainder = (temp - 1) % 26;
            letter = String.fromCharCode(65 + remainder) + letter;
            temp = Math.floor((temp - 1) / 26);
        }
        return letter;
    }

    function letterToColIndex(letter) {
        let col = 0;
        const clean = letter.toUpperCase().trim();
        for (let i = 0; i < clean.length; i++) {
            col = col * 26 + (clean.charCodeAt(i) - 64);
        }
        return col - 1;
    }

    function parseCellAddress(addr) {
        if (!addr || typeof addr !== 'string') return null;
        const match = addr.trim().match(/^(\$)?([A-Za-z]+)(\$)?([0-9]+)$/);
        if (!match) return null;
        return {
            col: letterToColIndex(match[2]),
            row: parseInt(match[4], 10) - 1,
            absCol: Boolean(match[1]),
            absRow: Boolean(match[3]),
            text: addr
        };
    }

    function formatCellAddress(row, col, absRow = false, absCol = false) {
        const colStr = colIndexToLetter(col);
        const rowStr = String(row + 1);
        return `${absCol ? '$' : ''}${colStr}${absRow ? '$' : ''}${rowStr}`;
    }

    class Sheet {
        constructor(id, name, options = {}) {
            this.id = id || `sheet_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            this.name = name || 'Sheet1';
            this.rowCount = options.rowCount || DEFAULT_ROW_COUNT;
            this.colCount = options.colCount || DEFAULT_COL_COUNT;
            this.tabColor = options.tabColor || null;

            this.cells = new Map();
            this.rowHeights = new Map(options.rowHeights ? Object.entries(options.rowHeights).map(([k, v]) => [Number(k), Number(v)]) : []);
            this.colWidths = new Map(options.colWidths ? Object.entries(options.colWidths).map(([k, v]) => [Number(k), Number(v)]) : []);
            this.merges = options.merges || [];
            this.hiddenRows = new Set(options.hiddenRows || []);
            this.hiddenCols = new Set(options.hiddenCols || []);
            this.frozenRows = options.frozenRows || 0;
            this.frozenCols = options.frozenCols || 0;
            this.filterRange = options.filterRange || null;
            this.conditionalFormats = options.conditionalFormats || [];

            if (options.cells) {
                this._loadCellsData(options.cells);
            }
        }

        _loadCellsData(cellsData) {
            if (Array.isArray(cellsData)) {
                for (const item of cellsData) {
                    const cell = Cell.fromJSON(item);
                    this.cells.set(`${cell.row},${cell.col}`, cell);
                }
            } else if (typeof cellsData === 'object') {
                for (const key in cellsData) {
                    const cell = Cell.fromJSON(cellsData[key]);
                    this.cells.set(`${cell.row},${cell.col}`, cell);
                }
            }
        }

        cellKey(r, c) { return `${r},${c}`; }

        getCell(r, c, createIfMissing = false) {
            if (r < 0 || c < 0) return null;
            const key = this.cellKey(r, c);
            let cell = this.cells.get(key);
            if (!cell && createIfMissing) {
                cell = new Cell(r, c);
                this.cells.set(key, cell);
                if (r >= this.rowCount) this.rowCount = r + 1;
                if (c >= this.colCount) this.colCount = c + 1;
            }
            return cell || null;
        }

        setCell(r, c, cell) {
            if (r < 0 || c < 0) return;
            cell.row = r;
            cell.col = c;
            this.cells.set(this.cellKey(r, c), cell);
            if (r >= this.rowCount) this.rowCount = r + 1;
            if (c >= this.colCount) this.colCount = c + 1;
        }

        setCellValue(r, c, value) {
            const cell = this.getCell(r, c, true);
            cell.setValue(value);
            return cell;
        }

        deleteCell(r, c) {
            this.cells.delete(this.cellKey(r, c));
        }

        getRowHeight(r) {
            if (this.hiddenRows.has(r)) return 0;
            return this.rowHeights.get(r) || DEFAULT_ROW_HEIGHT;
        }

        setRowHeight(r, height) {
            this.rowHeights.set(r, Math.max(18, Math.round(height)));
        }

        getColWidth(c) {
            if (this.hiddenCols.has(c)) return 0;
            return this.colWidths.get(c) || DEFAULT_COL_WIDTH;
        }

        setColWidth(c, width) {
            this.colWidths.set(c, Math.max(30, Math.round(width)));
        }

        mergeRange(startRow, startCol, endRow, endCol) {
            const r1 = Math.min(startRow, endRow);
            const r2 = Math.max(startRow, endRow);
            const c1 = Math.min(startCol, endCol);
            const c2 = Math.max(startCol, endCol);
            if (r1 === r2 && c1 === c2) return;

            this.unmergeRange(r1, c1, r2, c2);

            const mergeObj = {
                startRow: r1, startCol: c1, endRow: r2, endCol: c2,
                rowSpan: r2 - r1 + 1, colSpan: c2 - c1 + 1
            };
            this.merges.push(mergeObj);

            for (let r = r1; r <= r2; r++) {
                for (let c = c1; c <= c2; c++) {
                    const cell = this.getCell(r, c, true);
                    cell.mergeInfo = {
                        isMerged: true,
                        isMaster: (r === r1 && c === c1),
                        masterRow: r1,
                        masterCol: c1,
                        rowSpan: mergeObj.rowSpan,
                        colSpan: mergeObj.colSpan
                    };
                }
            }
        }

        unmergeRange(startRow, startCol, endRow, endCol) {
            const r1 = Math.min(startRow, endRow);
            const r2 = Math.max(startRow, endRow);
            const c1 = Math.min(startCol, endCol);
            const c2 = Math.max(startCol, endCol);

            const toRemove = [];
            for (let i = 0; i < this.merges.length; i++) {
                const m = this.merges[i];
                const overlap = !(m.endRow < r1 || m.startRow > r2 || m.endCol < c1 || m.startCol > c2);
                if (overlap) {
                    toRemove.push(i);
                    for (let r = m.startRow; r <= m.endRow; r++) {
                        for (let c = m.startCol; c <= m.endCol; c++) {
                            const cell = this.getCell(r, c);
                            if (cell) cell.mergeInfo = null;
                        }
                    }
                }
            }
            for (let i = toRemove.length - 1; i >= 0; i--) {
                this.merges.splice(toRemove[i], 1);
            }
        }

        insertRows(atRow, count = 1) {
            const newCells = new Map();
            for (const [key, cell] of this.cells.entries()) {
                if (cell.row >= atRow) {
                    cell.row += count;
                    newCells.set(this.cellKey(cell.row, cell.col), cell);
                } else {
                    newCells.set(key, cell);
                }
            }
            this.cells = newCells;
            this.rowCount += count;
        }

        deleteRows(atRow, count = 1) {
            const endRow = atRow + count - 1;
            const newCells = new Map();
            for (const [key, cell] of this.cells.entries()) {
                if (cell.row >= atRow && cell.row <= endRow) {
                    continue;
                } else if (cell.row > endRow) {
                    cell.row -= count;
                    newCells.set(this.cellKey(cell.row, cell.col), cell);
                } else {
                    newCells.set(key, cell);
                }
            }
            this.cells = newCells;
            this.rowCount = Math.max(DEFAULT_ROW_COUNT, this.rowCount - count);
        }

        insertCols(atCol, count = 1) {
            const newCells = new Map();
            for (const [key, cell] of this.cells.entries()) {
                if (cell.col >= atCol) {
                    cell.col += count;
                    newCells.set(this.cellKey(cell.row, cell.col), cell);
                } else {
                    newCells.set(key, cell);
                }
            }
            this.cells = newCells;
            this.colCount += count;
        }

        deleteCols(atCol, count = 1) {
            const endCol = atCol + count - 1;
            const newCells = new Map();
            for (const [key, cell] of this.cells.entries()) {
                if (cell.col >= atCol && cell.col <= endCol) {
                    continue;
                } else if (cell.col > endCol) {
                    cell.col -= count;
                    newCells.set(this.cellKey(cell.row, cell.col), cell);
                } else {
                    newCells.set(key, cell);
                }
            }
            this.cells = newCells;
            this.colCount = Math.max(DEFAULT_COL_COUNT, this.colCount - count);
        }

        getDataBounds() {
            let minR = Infinity, maxR = -1, minC = Infinity, maxC = -1;
            for (const cell of this.cells.values()) {
                if ((cell.rawValue !== '' && cell.rawValue !== null) || cell.formula) {
                    if (cell.row < minR) minR = cell.row;
                    if (cell.row > maxR) maxR = cell.row;
                    if (cell.col < minC) minC = cell.col;
                    if (cell.col > maxC) maxC = cell.col;
                }
            }
            if (maxR === -1) return { startRow: 0, startCol: 0, endRow: 9, endCol: 4 };
            return { startRow: minR, startCol: minC, endRow: maxR, endCol: maxC };
        }

        clone() {
            return Sheet.fromJSON(this.toJSON());
        }

        toJSON() {
            const cellsArr = [];
            for (const cell of this.cells.values()) {
                const cJSON = cell.toJSON();
                if (cJSON.v !== undefined || cJSON.f || cJSON.s || cJSON.nf || cJSON.cm || cJSON.vl || cJSON.m) {
                    cellsArr.push(cJSON);
                }
            }

            const rowHeightsObj = {};
            for (const [k, v] of this.rowHeights.entries()) rowHeightsObj[k] = v;
            const colWidthsObj = {};
            for (const [k, v] of this.colWidths.entries()) colWidthsObj[k] = v;

            return {
                id: this.id,
                name: this.name,
                rowCount: this.rowCount,
                colCount: this.colCount,
                tabColor: this.tabColor,
                frozenRows: this.frozenRows,
                frozenCols: this.frozenCols,
                rowHeights: rowHeightsObj,
                colWidths: colWidthsObj,
                hiddenRows: Array.from(this.hiddenRows),
                hiddenCols: Array.from(this.hiddenCols),
                merges: this.merges,
                filterRange: this.filterRange,
                conditionalFormats: this.conditionalFormats,
                cells: cellsArr
            };
        }

        static fromJSON(json) {
            return new Sheet(json.id, json.name, json);
        }
    }

    class Workbook {
        constructor(id = 'default_workbook', title = 'SheetForge Untitled Spreadsheet') {
            this.id = id;
            this.title = title;
            this.sheets = [];
            this.activeSheetId = null;
            this.createdAt = Date.now();
            this.updatedAt = Date.now();
        }

        getActiveSheet() {
            if (!this.activeSheetId && this.sheets.length > 0) {
                this.activeSheetId = this.sheets[0].id;
            }
            return this.sheets.find(s => s.id === this.activeSheetId) || this.sheets[0] || null;
        }

        getSheetById(id) {
            return this.sheets.find(s => s.id === id) || null;
        }

        getSheetByName(name) {
            if (!name) return null;
            const clean = name.trim().toLowerCase();
            return this.sheets.find(s => s.name.trim().toLowerCase() === clean) || null;
        }

        setActiveSheet(id) {
            const sheet = this.getSheetById(id);
            if (sheet) {
                this.activeSheetId = sheet.id;
                return true;
            }
            return false;
        }

        addSheet(name = null, options = {}) {
            let sheetName = name;
            if (!sheetName) {
                let index = this.sheets.length + 1;
                sheetName = `Sheet${index}`;
                while (this.getSheetByName(sheetName)) {
                    index++;
                    sheetName = `Sheet${index}`;
                }
            }
            const sheet = new Sheet(null, sheetName, options);
            this.sheets.push(sheet);
            if (!this.activeSheetId) {
                this.activeSheetId = sheet.id;
            }
            this.updatedAt = Date.now();
            return sheet;
        }

        duplicateSheet(sheetId) {
            const sourceSheet = this.getSheetById(sheetId);
            if (!sourceSheet) return null;

            let newName = `Copy of ${sourceSheet.name}`;
            let counter = 2;
            while (this.getSheetByName(newName)) {
                newName = `Copy (${counter}) of ${sourceSheet.name}`;
                counter++;
            }

            const clone = sourceSheet.clone();
            clone.id = `sheet_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            clone.name = newName;

            const sourceIndex = this.sheets.findIndex(s => s.id === sheetId);
            this.sheets.splice(sourceIndex + 1, 0, clone);
            this.activeSheetId = clone.id;
            this.updatedAt = Date.now();
            return clone;
        }

        deleteSheet(sheetId) {
            if (this.sheets.length <= 1) {
                throw new Error('A workbook must contain at least one visible worksheet.');
            }
            const index = this.sheets.findIndex(s => s.id === sheetId);
            if (index === -1) return false;

            this.sheets.splice(index, 1);
            if (this.activeSheetId === sheetId) {
                const nextIndex = Math.min(index, this.sheets.length - 1);
                this.activeSheetId = this.sheets[nextIndex].id;
            }
            this.updatedAt = Date.now();
            return true;
        }

        renameSheet(sheetId, newName) {
            const cleanName = newName ? newName.trim() : '';
            if (!cleanName) throw new Error('Sheet name cannot be empty.');
            const existing = this.getSheetByName(cleanName);
            if (existing && existing.id !== sheetId) {
                throw new Error(`A sheet named "${cleanName}" already exists.`);
            }
            const sheet = this.getSheetById(sheetId);
            if (sheet) {
                sheet.name = cleanName;
                this.updatedAt = Date.now();
                return true;
            }
            return false;
        }

        reorderSheet(sheetId, targetIndex) {
            const currentIndex = this.sheets.findIndex(s => s.id === sheetId);
            if (currentIndex === -1 || targetIndex < 0 || targetIndex >= this.sheets.length) return false;
            const [sheet] = this.sheets.splice(currentIndex, 1);
            this.sheets.splice(targetIndex, 0, sheet);
            this.updatedAt = Date.now();
            return true;
        }

        toJSON() {
            return {
                id: this.id,
                title: this.title,
                createdAt: this.createdAt,
                updatedAt: this.updatedAt,
                activeSheetId: this.activeSheetId,
                sheets: this.sheets.map(s => s.toJSON())
            };
        }

        static fromJSON(json) {
            const wb = new Workbook(json.id, json.title);
            wb.createdAt = json.createdAt || Date.now();
            wb.updatedAt = json.updatedAt || Date.now();
            wb.activeSheetId = json.activeSheetId || null;
            if (Array.isArray(json.sheets)) {
                wb.sheets = json.sheets.map(s => Sheet.fromJSON(s));
            }
            if (wb.sheets.length === 0) {
                wb.addSheet('Sheet1');
            }
            if (!wb.activeSheetId || !wb.getSheetById(wb.activeSheetId)) {
                wb.activeSheetId = wb.sheets[0].id;
            }
            return wb;
        }
    }

    // =========================================================================
    // 6. FORMULA ENGINE: Tokenizer, Parser, Evaluator, Formatter, AutoFill
    // =========================================================================
    const TokenType = Object.freeze({
        NUMBER: 'NUMBER',
        STRING: 'STRING',
        BOOLEAN: 'BOOLEAN',
        CELL_REF: 'CELL_REF',
        RANGE_REF: 'RANGE_REF',
        SHEET_REF: 'SHEET_REF',
        FUNCTION: 'FUNCTION',
        OPERATOR: 'OPERATOR',
        LPAREN: 'LPAREN',
        RPAREN: 'RPAREN',
        COMMA: 'COMMA',
        COLON: 'COLON',
        EOF: 'EOF',
        UNKNOWN: 'UNKNOWN'
    });

    class Token {
        constructor(type, value, start, end) {
            this.type = type;
            this.value = value;
            this.start = start;
            this.end = end;
        }
    }

    class Tokenizer {
        constructor(formula) {
            this.input = typeof formula === 'string' ? formula : '';
            if (this.input.startsWith('=')) {
                this.input = this.input.substring(1);
            }
            this.pos = 0;
            this.len = this.input.length;
        }

        tokenize() {
            const tokens = [];
            while (this.pos < this.len) {
                this.skipWhitespace();
                if (this.pos >= this.len) break;

                const ch = this.input[this.pos];
                const start = this.pos;

                if (this.isDigit(ch) || (ch === '.' && this.isDigit(this.peek(1)))) {
                    tokens.push(this.readNumber());
                    continue;
                }

                if (ch === '"' || ch === "'") {
                    tokens.push(this.readString(ch));
                    continue;
                }

                if (ch === '(') { tokens.push(new Token(TokenType.LPAREN, '(', start, ++this.pos)); continue; }
                if (ch === ')') { tokens.push(new Token(TokenType.RPAREN, ')', start, ++this.pos)); continue; }
                if (ch === ',') { tokens.push(new Token(TokenType.COMMA, ',', start, ++this.pos)); continue; }
                if (ch === ':') { tokens.push(new Token(TokenType.COLON, ':', start, ++this.pos)); continue; }

                const twoChar = this.input.substr(this.pos, 2);
                if (['<=', '>=', '<>', '!=', '=='].includes(twoChar)) {
                    tokens.push(new Token(TokenType.OPERATOR, twoChar === '==' ? '=' : twoChar, start, this.pos += 2));
                    continue;
                }

                if (['+', '-', '*', '/', '^', '%', '&', '<', '>', '='].includes(ch)) {
                    tokens.push(new Token(TokenType.OPERATOR, ch, start, ++this.pos));
                    continue;
                }

                if (ch === "'" || this.input.substr(this.pos).match(/^([A-Za-z0-9_]+)!/)) {
                    const sheetToken = this.tryReadSheetRef();
                    if (sheetToken) {
                        tokens.push(sheetToken);
                        continue;
                    }
                }

                if (this.isAlpha(ch) || ch === '$' || ch === '_') {
                    tokens.push(this.readIdentifierOrRef());
                    continue;
                }

                tokens.push(new Token(TokenType.UNKNOWN, ch, start, ++this.pos));
            }

            tokens.push(new Token(TokenType.EOF, '', this.pos, this.pos));
            return tokens;
        }

        skipWhitespace() {
            while (this.pos < this.len && /\s/.test(this.input[this.pos])) this.pos++;
        }

        isDigit(ch) { return ch >= '0' && ch <= '9'; }
        isAlpha(ch) { return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z'); }
        isAlphaNum(ch) { return this.isAlpha(ch) || this.isDigit(ch) || ch === '_' || ch === '$'; }

        peek(offset = 0) {
            const p = this.pos + offset;
            return p < this.len ? this.input[p] : '';
        }

        readNumber() {
            const start = this.pos;
            let hasDot = false, hasExp = false;
            while (this.pos < this.len) {
                const ch = this.input[this.pos];
                if (this.isDigit(ch)) this.pos++;
                else if (ch === '.' && !hasDot && !hasExp) { hasDot = true; this.pos++; }
                else if ((ch === 'e' || ch === 'E') && !hasExp) {
                    hasExp = true; this.pos++;
                    if (this.pos < this.len && (this.input[this.pos] === '+' || this.input[this.pos] === '-')) this.pos++;
                } else break;
            }
            const numStr = this.input.substring(start, this.pos);
            return new Token(TokenType.NUMBER, parseFloat(numStr), start, this.pos);
        }

        readString(quoteChar) {
            const start = this.pos;
            this.pos++;
            let result = '';
            while (this.pos < this.len) {
                const ch = this.input[this.pos];
                if (ch === quoteChar) {
                    if (this.pos + 1 < this.len && this.input[this.pos + 1] === quoteChar) {
                        result += quoteChar;
                        this.pos += 2;
                    } else {
                        this.pos++;
                        break;
                    }
                } else {
                    result += ch;
                    this.pos++;
                }
            }
            return new Token(TokenType.STRING, result, start, this.pos);
        }

        tryReadSheetRef() {
            const start = this.pos;
            let sheetName = '';
            if (this.input[this.pos] === "'") {
                this.pos++;
                while (this.pos < this.len && this.input[this.pos] !== "'") {
                    sheetName += this.input[this.pos];
                    this.pos++;
                }
                if (this.pos < this.len && this.input[this.pos] === "'") this.pos++;
            } else {
                while (this.pos < this.len && this.isAlphaNum(this.input[this.pos])) {
                    sheetName += this.input[this.pos];
                    this.pos++;
                }
            }

            if (this.pos < this.len && this.input[this.pos] === '!') {
                this.pos++;
                const refToken = this.readIdentifierOrRef();
                return new Token(TokenType.SHEET_REF, {
                    sheet: sheetName,
                    ref: refToken.value,
                    isRange: refToken.type === TokenType.RANGE_REF
                }, start, this.pos);
            }
            this.pos = start;
            return null;
        }

        readIdentifierOrRef() {
            const start = this.pos;
            while (this.pos < this.len && (this.isAlphaNum(this.input[this.pos]) || this.input[this.pos] === ':')) {
                this.pos++;
            }

            const raw = this.input.substring(start, this.pos);
            const upper = raw.toUpperCase();

            if (upper === 'TRUE') return new Token(TokenType.BOOLEAN, true, start, this.pos);
            if (upper === 'FALSE') return new Token(TokenType.BOOLEAN, false, start, this.pos);

            if (raw.includes(':')) {
                const parts = raw.split(':');
                if (parts.length === 2 && this.isCellRef(parts[0]) && this.isCellRef(parts[1])) {
                    return new Token(TokenType.RANGE_REF, upper, start, this.pos);
                }
            }

            if (this.isCellRef(raw)) {
                const savePos = this.pos;
                this.skipWhitespace();
                if (this.pos < this.len && this.input[this.pos] === ':') {
                    this.pos++;
                    this.skipWhitespace();
                    const nextRefStart = this.pos;
                    while (this.pos < this.len && this.isAlphaNum(this.input[this.pos])) this.pos++;
                    const nextRef = this.input.substring(nextRefStart, this.pos);
                    if (this.isCellRef(nextRef)) {
                        return new Token(TokenType.RANGE_REF, `${upper}:${nextRef.toUpperCase()}`, start, this.pos);
                    }
                    this.pos = savePos;
                } else {
                    this.pos = savePos;
                }
                return new Token(TokenType.CELL_REF, upper, start, this.pos);
            }

            return new Token(TokenType.FUNCTION, upper, start, this.pos);
        }

        isCellRef(str) {
            if (!str || typeof str !== 'string') return false;
            return /^(\$)?([A-Za-z]+)(\$)?([0-9]+)$/.test(str.trim());
        }
    }

    const ASTNodeType = Object.freeze({
        LITERAL: 'LITERAL',
        CELL_REF: 'CELL_REF',
        RANGE_REF: 'RANGE_REF',
        SHEET_REF: 'SHEET_REF',
        UNARY_OP: 'UNARY_OP',
        BINARY_OP: 'BINARY_OP',
        FUNCTION_CALL: 'FUNCTION_CALL'
    });

    class ASTNode {
        constructor(type, data = {}) {
            this.type = type;
            Object.assign(this, data);
        }
    }

    class Parser {
        constructor(formula) {
            this.tokenizer = new Tokenizer(formula);
            this.tokens = this.tokenizer.tokenize();
            this.pos = 0;
        }

        peek() { return this.tokens[this.pos] || this.tokens[this.tokens.length - 1]; }

        consume(expectedType = null) {
            const token = this.peek();
            if (expectedType && token.type !== expectedType) {
                throw new Error(`Parse error: expected ${expectedType}, got ${token.type}`);
            }
            this.pos++;
            return token;
        }

        match(type) {
            const token = this.peek();
            if (token.type === type) {
                this.pos++;
                return token;
            }
            return null;
        }

        parse() {
            if (this.tokens.length === 0 || this.peek().type === TokenType.EOF) return null;
            const ast = this.parseExpression();
            return ast;
        }

        parseExpression() { return this.parseComparison(); }

        parseComparison() {
            let left = this.parseConcat();
            while (true) {
                const token = this.peek();
                if (token.type === TokenType.OPERATOR && ['=', '<>', '!=', '<', '<=', '>', '>='].includes(token.value)) {
                    this.consume();
                    const right = this.parseConcat();
                    left = new ASTNode(ASTNodeType.BINARY_OP, { op: token.value, left, right });
                } else break;
            }
            return left;
        }

        parseConcat() {
            let left = this.parseAddSub();
            while (true) {
                const token = this.peek();
                if (token.type === TokenType.OPERATOR && token.value === '&') {
                    this.consume();
                    const right = this.parseAddSub();
                    left = new ASTNode(ASTNodeType.BINARY_OP, { op: '&', left, right });
                } else break;
            }
            return left;
        }

        parseAddSub() {
            let left = this.parseMulDiv();
            while (true) {
                const token = this.peek();
                if (token.type === TokenType.OPERATOR && (token.value === '+' || token.value === '-')) {
                    this.consume();
                    const right = this.parseMulDiv();
                    left = new ASTNode(ASTNodeType.BINARY_OP, { op: token.value, left, right });
                } else break;
            }
            return left;
        }

        parseMulDiv() {
            let left = this.parseExponent();
            while (true) {
                const token = this.peek();
                if (token.type === TokenType.OPERATOR && (token.value === '*' || token.value === '/')) {
                    this.consume();
                    const right = this.parseExponent();
                    left = new ASTNode(ASTNodeType.BINARY_OP, { op: token.value, left, right });
                } else break;
            }
            return left;
        }

        parseExponent() {
            let left = this.parseUnary();
            while (true) {
                const token = this.peek();
                if (token.type === TokenType.OPERATOR && token.value === '^') {
                    this.consume();
                    const right = this.parseUnary();
                    left = new ASTNode(ASTNodeType.BINARY_OP, { op: '^', left, right });
                } else break;
            }
            return left;
        }

        parseUnary() {
            const token = this.peek();
            if (token.type === TokenType.OPERATOR && (token.value === '-' || token.value === '+')) {
                this.consume();
                const expr = this.parseUnary();
                return new ASTNode(ASTNodeType.UNARY_OP, { op: token.value, expr });
            }

            let primary = this.parsePrimary();
            if (this.peek().type === TokenType.OPERATOR && this.peek().value === '%') {
                this.consume();
                primary = new ASTNode(ASTNodeType.UNARY_OP, { op: '%', expr: primary });
            }
            return primary;
        }

        parsePrimary() {
            const token = this.peek();
            if (token.type === TokenType.NUMBER) { this.consume(); return new ASTNode(ASTNodeType.LITERAL, { value: token.value }); }
            if (token.type === TokenType.STRING) { this.consume(); return new ASTNode(ASTNodeType.LITERAL, { value: token.value }); }
            if (token.type === TokenType.BOOLEAN) { this.consume(); return new ASTNode(ASTNodeType.LITERAL, { value: token.value }); }
            if (token.type === TokenType.CELL_REF) { this.consume(); return new ASTNode(ASTNodeType.CELL_REF, { ref: token.value }); }
            if (token.type === TokenType.RANGE_REF) { this.consume(); return new ASTNode(ASTNodeType.RANGE_REF, { ref: token.value }); }
            if (token.type === TokenType.SHEET_REF) {
                this.consume();
                return new ASTNode(ASTNodeType.SHEET_REF, { sheet: token.value.sheet, ref: token.value.ref, isRange: token.value.isRange });
            }
            if (token.type === TokenType.FUNCTION) {
                this.consume();
                this.consume(TokenType.LPAREN);
                const args = [];
                if (this.peek().type !== TokenType.RPAREN) {
                    while (true) {
                        args.push(this.parseExpression());
                        if (this.match(TokenType.COMMA)) continue;
                        break;
                    }
                }
                this.consume(TokenType.RPAREN);
                return new ASTNode(ASTNodeType.FUNCTION_CALL, { name: token.value.toUpperCase(), args });
            }
            if (token.type === TokenType.LPAREN) {
                this.consume();
                const expr = this.parseExpression();
                this.consume(TokenType.RPAREN);
                return expr;
            }
            throw new Error(`Unexpected token "${token.value}"`);
        }
    }

    const FormulaErrors = Object.freeze({
        DIV_ZERO: '#DIV/0!',
        VALUE: '#VALUE!',
        REF: '#REF!',
        NAME: '#NAME?',
        NUM: '#NUM!',
        NA: '#N/A!',
        ERROR: '#ERROR!',
        CYCLE: '#CYCLE!'
    });

    class Evaluator {
        constructor(workbook = null) {
            this.workbook = workbook;
            this.functions = new Map();
            this._registerBuiltInFunctions();
        }

        setWorkbook(wb) { this.workbook = wb; }

        evaluateFormula(formulaStr, activeSheet, contextCell = null, visited = new Set()) {
            if (!formulaStr || typeof formulaStr !== 'string') return '';
            if (!formulaStr.startsWith('=')) return formulaStr;

            const cellId = contextCell ? `${activeSheet.id}:${contextCell.row},${contextCell.col}` : null;
            if (cellId) {
                if (visited.has(cellId)) return FormulaErrors.CYCLE;
                visited.add(cellId);
            }

            try {
                const parser = new Parser(formulaStr);
                const ast = parser.parse();
                if (!ast) return '';
                return this.evaluateNode(ast, activeSheet, contextCell, visited);
            } catch (err) {
                if (Object.values(FormulaErrors).includes(err.message)) return err.message;
                return FormulaErrors.ERROR;
            } finally {
                if (cellId) visited.delete(cellId);
            }
        }

        evaluateNode(node, activeSheet, contextCell, visited) {
            if (!node) return null;
            switch (node.type) {
                case ASTNodeType.LITERAL: return node.value;
                case ASTNodeType.CELL_REF: return this.resolveCellRefValue(node.ref, activeSheet, visited);
                case ASTNodeType.RANGE_REF: return this.resolveRangeValues(node.ref, activeSheet, visited);
                case ASTNodeType.SHEET_REF: {
                    const targetSheet = this.workbook ? this.workbook.getSheetByName(node.sheet) : null;
                    if (!targetSheet) throw new Error(FormulaErrors.REF);
                    return node.isRange ? this.resolveRangeValues(node.ref, targetSheet, visited) : this.resolveCellRefValue(node.ref, targetSheet, visited);
                }
                case ASTNodeType.UNARY_OP: {
                    const val = this.evaluateNode(node.expr, activeSheet, contextCell, visited);
                    if (typeof val === 'string' && Object.values(FormulaErrors).includes(val)) return val;
                    const num = this.toNumber(val);
                    if (isNaN(num)) throw new Error(FormulaErrors.VALUE);
                    if (node.op === '-') return -num;
                    if (node.op === '+') return num;
                    if (node.op === '%') return num / 100;
                    return val;
                }
                case ASTNodeType.BINARY_OP: {
                    const left = this.evaluateNode(node.left, activeSheet, contextCell, visited);
                    if (typeof left === 'string' && Object.values(FormulaErrors).includes(left)) return left;
                    const right = this.evaluateNode(node.right, activeSheet, contextCell, visited);
                    if (typeof right === 'string' && Object.values(FormulaErrors).includes(right)) return right;
                    return this.evaluateBinaryOp(node.op, left, right);
                }
                case ASTNodeType.FUNCTION_CALL: return this.evaluateFunction(node.name, node.args, activeSheet, contextCell, visited);
                default: throw new Error(FormulaErrors.ERROR);
            }
        }

        resolveCellRefValue(refStr, sheet, visited) {
            const addr = parseCellAddress(refStr);
            if (!addr) throw new Error(FormulaErrors.REF);
            const cell = sheet.getCell(addr.row, addr.col);
            if (!cell) return '';
            if (cell.isFormula) {
                const cellId = `${sheet.id}:${addr.row},${addr.col}`;
                if (visited.has(cellId)) return FormulaErrors.CYCLE;
                return this.evaluateFormula(cell.formula, sheet, cell, visited);
            }
            return cell.rawValue !== undefined && cell.rawValue !== null ? cell.rawValue : '';
        }

        resolveRangeValues(rangeStr, sheet, visited) {
            const parts = rangeStr.split(':');
            if (parts.length !== 2) throw new Error(FormulaErrors.REF);
            const startAddr = parseCellAddress(parts[0]);
            const endAddr = parseCellAddress(parts[1]);
            if (!startAddr || !endAddr) throw new Error(FormulaErrors.REF);

            const r1 = Math.min(startAddr.row, endAddr.row);
            const r2 = Math.max(startAddr.row, endAddr.row);
            const c1 = Math.min(startAddr.col, endAddr.col);
            const c2 = Math.max(startAddr.col, endAddr.col);

            const matrix = [];
            for (let r = r1; r <= r2; r++) {
                const rowArr = [];
                for (let c = c1; c <= c2; c++) {
                    const cell = sheet.getCell(r, c);
                    let val = '';
                    if (cell) {
                        if (cell.isFormula) {
                            const cellId = `${sheet.id}:${r},${c}`;
                            if (visited.has(cellId)) val = FormulaErrors.CYCLE;
                            else val = this.evaluateFormula(cell.formula, sheet, cell, visited);
                        } else {
                            val = cell.rawValue;
                        }
                    }
                    rowArr.push(val);
                }
                matrix.push(rowArr);
            }
            return matrix;
        }

        evaluateBinaryOp(op, left, right) {
            if (op === '&') {
                return `${left !== null && left !== undefined ? left : ''}${right !== null && right !== undefined ? right : ''}`;
            }

            if (['=', '<>', '!=', '<', '<=', '>', '>='].includes(op)) {
                let l = left, r = right;
                const numL = this.toNumber(l);
                const numR = this.toNumber(r);
                if (!isNaN(numL) && !isNaN(numR) && l !== '' && r !== '') {
                    l = numL; r = numR;
                } else {
                    l = String(l || '').toLowerCase();
                    r = String(r || '').toLowerCase();
                }
                switch (op) {
                    case '=': return l === r;
                    case '<>':
                    case '!=': return l !== r;
                    case '<': return l < r;
                    case '<=': return l <= r;
                    case '>': return l > r;
                    case '>=': return l >= r;
                }
            }

            const numL = this.toNumber(left);
            const numR = this.toNumber(right);
            if (isNaN(numL) || isNaN(numR)) throw new Error(FormulaErrors.VALUE);

            switch (op) {
                case '+': return numL + numR;
                case '-': return numL - numR;
                case '*': return numL * numR;
                case '/':
                    if (numR === 0) throw new Error(FormulaErrors.DIV_ZERO);
                    return numL / numR;
                case '^': return Math.pow(numL, numR);
                default: throw new Error(FormulaErrors.ERROR);
            }
        }

        evaluateFunction(name, argNodes, activeSheet, contextCell, visited) {
            const fnName = name.toUpperCase();
            if (fnName === 'IF') {
                if (argNodes.length < 2 || argNodes.length > 3) throw new Error(FormulaErrors.VALUE);
                const cond = this.evaluateNode(argNodes[0], activeSheet, contextCell, visited);
                if (this.isTruthy(cond)) {
                    return this.evaluateNode(argNodes[1], activeSheet, contextCell, visited);
                } else {
                    return argNodes.length === 3 ? this.evaluateNode(argNodes[2], activeSheet, contextCell, visited) : false;
                }
            }

            const args = argNodes.map(node => this.evaluateNode(node, activeSheet, contextCell, visited));
            const fn = this.functions.get(fnName);
            if (!fn) throw new Error(`Unknown function: ${fnName}`);
            return fn(args, { activeSheet, contextCell });
        }

        flattenArgs(args) {
            const result = [];
            const recurse = (item) => {
                if (Array.isArray(item)) {
                    for (const sub of item) recurse(sub);
                } else {
                    result.push(item);
                }
            };
            recurse(args);
            return result;
        }

        toNumber(val) {
            if (typeof val === 'number') return val;
            if (typeof val === 'boolean') return val ? 1 : 0;
            if (val === null || val === undefined || val === '') return 0;
            if (typeof val === 'string') {
                const clean = val.trim().replace(/[\$,%]/g, '');
                const parsed = Number(clean);
                if (!isNaN(parsed)) return parsed;
            }
            return NaN;
        }

        isTruthy(val) {
            if (typeof val === 'boolean') return val;
            if (typeof val === 'number') return val !== 0;
            if (typeof val === 'string') {
                const low = val.trim().toLowerCase();
                return low === 'true' || (Number(low) !== 0 && !isNaN(Number(low)));
            }
            return Boolean(val);
        }

        _registerBuiltInFunctions() {
            this.functions.set('SUM', (args) => {
                const items = this.flattenArgs(args);
                let sum = 0;
                for (const item of items) {
                    const num = this.toNumber(item);
                    if (!isNaN(num) && item !== '' && item !== null) sum += num;
                }
                return sum;
            });

            this.functions.set('AVERAGE', (args) => {
                const items = this.flattenArgs(args);
                let sum = 0, count = 0;
                for (const item of items) {
                    if (item !== '' && item !== null && item !== undefined) {
                        const num = this.toNumber(item);
                        if (!isNaN(num)) { sum += num; count++; }
                    }
                }
                if (count === 0) throw new Error(FormulaErrors.DIV_ZERO);
                return sum / count;
            });

            this.functions.set('MIN', (args) => {
                const items = this.flattenArgs(args);
                let min = Infinity;
                for (const item of items) {
                    if (item !== '' && item !== null && item !== undefined) {
                        const num = this.toNumber(item);
                        if (!isNaN(num) && num < min) min = num;
                    }
                }
                return min === Infinity ? 0 : min;
            });

            this.functions.set('MAX', (args) => {
                const items = this.flattenArgs(args);
                let max = -Infinity;
                for (const item of items) {
                    if (item !== '' && item !== null && item !== undefined) {
                        const num = this.toNumber(item);
                        if (!isNaN(num) && num > max) max = num;
                    }
                }
                return max === -Infinity ? 0 : max;
            });

            this.functions.set('COUNT', (args) => {
                const items = this.flattenArgs(args);
                let count = 0;
                for (const item of items) {
                    if (item !== '' && item !== null && item !== undefined && !isNaN(Number(item))) count++;
                }
                return count;
            });

            this.functions.set('COUNTA', (args) => {
                const items = this.flattenArgs(args);
                let count = 0;
                for (const item of items) {
                    if (item !== '' && item !== null && item !== undefined) count++;
                }
                return count;
            });

            this.functions.set('ROUND', (args) => {
                const num = this.toNumber(args[0]);
                const dec = args.length > 1 ? this.toNumber(args[1]) : 0;
                const factor = Math.pow(10, dec);
                return Math.round(num * factor) / factor;
            });

            this.functions.set('ABS', (args) => Math.abs(this.toNumber(args[0])));
            this.functions.set('SQRT', (args) => Math.sqrt(this.toNumber(args[0])));
            this.functions.set('CONCAT', (args) => this.flattenArgs(args).join(''));
            this.functions.set('UPPER', (args) => String(args[0] || '').toUpperCase());
            this.functions.set('LOWER', (args) => String(args[0] || '').toLowerCase());
            this.functions.set('LEN', (args) => String(args[0] || '').length);

            this.functions.set('TODAY', () => {
                const d = new Date();
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            });

            this.functions.set('NOW', () => new Date().toISOString().replace('T', ' ').substr(0, 19));
        }
    }

    class DependencyGraph {
        constructor(workbook = null) {
            this.workbook = workbook;
            this.dependents = new Map();
            this.dependencies = new Map();
        }

        makeKey(sheetId, r, c) { return `${sheetId}:${r},${c}`; }

        parseKey(key) {
            const [sheetId, coord] = key.split(':');
            const [r, c] = coord.split(',').map(Number);
            return { sheetId, r, c };
        }

        extractDependencies(formula, defaultSheet) {
            if (!formula || typeof formula !== 'string' || !formula.startsWith('=')) return [];
            const refs = [];
            try {
                const tokenizer = new Tokenizer(formula);
                const tokens = tokenizer.tokenize();
                for (const token of tokens) {
                    if (token.type === TokenType.CELL_REF) {
                        const addr = parseCellAddress(token.value);
                        if (addr) refs.push(this.makeKey(defaultSheet.id, addr.row, addr.col));
                    }
                }
            } catch (e) {}
            return refs;
        }

        updateCell(sheet, r, c, formula) {
            const nodeKey = this.makeKey(sheet.id, r, c);
            const oldDeps = this.dependencies.get(nodeKey) || new Set();
            for (const dep of oldDeps) {
                const depSet = this.dependents.get(dep);
                if (depSet) {
                    depSet.delete(nodeKey);
                    if (depSet.size === 0) this.dependents.delete(dep);
                }
            }
            this.dependencies.delete(nodeKey);

            if (formula && typeof formula === 'string' && formula.startsWith('=')) {
                const newDeps = this.extractDependencies(formula, sheet);
                const depSet = new Set(newDeps);
                this.dependencies.set(nodeKey, depSet);
                for (const dep of depSet) {
                    if (!this.dependents.has(dep)) this.dependents.set(dep, new Set());
                    this.dependents.get(dep).add(nodeKey);
                }
            }
        }

        buildGraph(workbook) {
            this.workbook = workbook;
            this.dependents.clear();
            this.dependencies.clear();
            for (const sheet of workbook.sheets) {
                for (const cell of sheet.cells.values()) {
                    if (cell.isFormula) this.updateCell(sheet, cell.row, cell.col, cell.formula);
                }
            }
        }

        recalculate(changedKeys, evaluator) {
            for (const key of changedKeys) {
                const { sheetId, r, c } = this.parseKey(key);
                const sheet = this.workbook.getSheetById(sheetId);
                if (!sheet) continue;
                const cell = sheet.getCell(r, c);
                if (cell && cell.isFormula) {
                    const res = evaluator.evaluateFormula(cell.formula, sheet, cell);
                    if (typeof res === 'string' && res.startsWith('#')) {
                        cell.error = res;
                        cell.computedValue = null;
                    } else {
                        cell.error = null;
                        cell.computedValue = res;
                    }
                }
            }
        }
    }

    class Formatter {
        static formatCell(cell) {
            if (!cell) return '';
            if (cell.error) return cell.error;
            const val = cell.computedValue !== null && cell.computedValue !== undefined ? cell.computedValue : cell.rawValue;
            if (val === '' || val === null || val === undefined) return '';
            return this.formatValue(val, cell.numFormat, cell.decimals);
        }

        static formatValue(val, formatType = 'general', decimals = null) {
            if (val === null || val === undefined || val === '') return '';
            const num = typeof val === 'number' ? val : Number(String(val).replace(/[\$,]/g, ''));
            const isNumeric = !isNaN(num) && typeof val !== 'boolean';

            switch (formatType) {
                case 'number': {
                    if (!isNumeric) return String(val);
                    const d = decimals !== null ? decimals : 2;
                    return num.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
                }
                case 'currency': {
                    if (!isNumeric) return String(val);
                    const d = decimals !== null ? decimals : 2;
                    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: d, maximumFractionDigits: d });
                }
                case 'percent': {
                    if (!isNumeric) return String(val);
                    const d = decimals !== null ? decimals : 1;
                    return `${(num * 100).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })}%`;
                }
                case 'date': {
                    const d = new Date(val);
                    if (isNaN(d.getTime())) return String(val);
                    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                }
                default:
                    if (typeof val === 'number' && !Number.isInteger(val)) {
                        return parseFloat(val.toFixed(6)).toString();
                    }
                    return String(val);
            }
        }
    }

    class AutoFill {
        static shiftFormula(formula, dRow, dCol) {
            if (!formula || !formula.startsWith('=')) return formula;
            return formula.replace(/(?<![A-Za-z0-9_!'"])([$]?)([A-Za-z]+)([$]?)([0-9]+)/g, (match) => {
                const addr = parseCellAddress(match);
                if (!addr) return match;
                const newCol = addr.absCol ? addr.col : Math.max(0, addr.col + dCol);
                const newRow = addr.absRow ? addr.row : Math.max(0, addr.row + dRow);
                return formatCellAddress(newRow, newCol, addr.absRow, addr.absCol);
            });
        }

        static extrapolate(sourceCells, targetCoords) {
            const results = [];
            const srcLen = sourceCells.length;

            for (let i = 0; i < targetCoords.length; i++) {
                const target = targetCoords[i];
                const src = sourceCells[i % srcLen];
                if (src && src.formula) {
                    const dRow = target.row - src.row;
                    const dCol = target.col - src.col;
                    const shifted = this.shiftFormula(src.formula, dRow, dCol);
                    results.push({ row: target.row, col: target.col, formula: shifted, rawValue: shifted, style: src.style, numFormat: src.numFormat });
                } else if (src && !isNaN(Number(src.rawValue)) && src.rawValue !== '') {
                    const num = Number(src.rawValue) + (i + 1);
                    results.push({ row: target.row, col: target.col, rawValue: num, formula: '', style: src.style, numFormat: src.numFormat });
                } else {
                    results.push({ row: target.row, col: target.col, rawValue: src ? src.rawValue : '', formula: '', style: src ? src.style : null, numFormat: 'general' });
                }
            }
            return results;
        }
    }

    // =========================================================================
    // 7. GRID: VirtualGrid, SelectionManager, DragManager, CellEditor
    // =========================================================================
    class VirtualGrid {
        constructor(containerElement, options = {}) {
            this.container = containerElement;
            this.sheet = null;
            this.evaluator = options.evaluator || null;
            this.buffer = 5;

            this.rowPositions = [];
            this.colPositions = [];
            this.totalWidth = 0;
            this.totalHeight = 0;

            this.visibleRange = { startRow: 0, endRow: 30, startCol: 0, endCol: 15 };

            this._setupDOM();
            this._bindEvents();
        }

        _setupDOM() {
            this.container.innerHTML = `
                <div class="sf-grid-wrapper" tabindex="0">
                    <div class="sf-corner-header" title="Select All (Ctrl+A)">
                        <div class="sf-corner-triangle"></div>
                    </div>
                    <div class="sf-col-headers-viewport">
                        <div class="sf-col-headers-track"></div>
                    </div>
                    <div class="sf-row-headers-viewport">
                        <div class="sf-row-headers-track"></div>
                    </div>
                    <div class="sf-cells-viewport">
                        <div class="sf-cells-canvas">
                            <div class="sf-cells-container"></div>
                            <div class="sf-freeze-row-line"></div>
                            <div class="sf-freeze-col-line"></div>
                            <div class="sf-selection-layer">
                                <div class="sf-selection-range"></div>
                                <div class="sf-selection-active-cell">
                                    <div class="sf-fill-handle" title="Drag to autofill"></div>
                                </div>
                                <div class="sf-clipboard-ants"></div>
                                <div class="sf-autofill-preview"></div>
                            </div>
                            <div class="sf-cell-editor-container">
                                <div class="sf-cell-editor" contenteditable="true" spellcheck="false"></div>
                            </div>
                        </div>
                    </div>
                    <div class="sf-resize-guideline"></div>
                </div>
            `;

            this.wrapper = this.container.querySelector('.sf-grid-wrapper');
            this.cornerHeader = this.container.querySelector('.sf-corner-header');
            this.colHeadersViewport = this.container.querySelector('.sf-col-headers-viewport');
            this.colHeadersTrack = this.container.querySelector('.sf-col-headers-track');
            this.rowHeadersViewport = this.container.querySelector('.sf-row-headers-viewport');
            this.rowHeadersTrack = this.container.querySelector('.sf-row-headers-track');
            this.viewport = this.container.querySelector('.sf-cells-viewport');
            this.canvas = this.container.querySelector('.sf-cells-canvas');
            this.cellsContainer = this.container.querySelector('.sf-cells-container');
            this.selectionLayer = this.container.querySelector('.sf-selection-layer');
            this.selectionRange = this.container.querySelector('.sf-selection-range');
            this.selectionActiveCell = this.container.querySelector('.sf-selection-active-cell');
            this.fillHandle = this.container.querySelector('.sf-fill-handle');
            this.clipboardAnts = this.container.querySelector('.sf-clipboard-ants');
            this.autofillPreview = this.container.querySelector('.sf-autofill-preview');
            this.editorContainer = this.container.querySelector('.sf-cell-editor-container');
            this.editor = this.container.querySelector('.sf-cell-editor');
            this.resizeGuideline = this.container.querySelector('.sf-resize-guideline');
            this.freezeRowLine = this.container.querySelector('.sf-freeze-row-line');
            this.freezeColLine = this.container.querySelector('.sf-freeze-col-line');
        }

        _bindEvents() {
            this.viewport.addEventListener('scroll', () => {
                this.syncScroll();
                this.renderVirtual();
            }, { passive: true });
        }

        setSheet(sheet) {
            this.sheet = sheet;
            this.recalculateDimensions();
            this.renderAll();
        }

        recalculateDimensions() {
            if (!this.sheet) return;
            this.rowPositions = [0];
            let runningY = 0;
            for (let r = 0; r < this.sheet.rowCount; r++) {
                runningY += this.sheet.getRowHeight(r);
                this.rowPositions.push(runningY);
            }
            this.totalHeight = runningY;

            this.colPositions = [0];
            let runningX = 0;
            for (let c = 0; c < this.sheet.colCount; c++) {
                runningX += this.sheet.getColWidth(c);
                this.colPositions.push(runningX);
            }
            this.totalWidth = runningX;

            this.canvas.style.width = `${this.totalWidth}px`;
            this.canvas.style.height = `${this.totalHeight}px`;
            this.colHeadersTrack.style.width = `${this.totalWidth}px`;
            this.rowHeadersTrack.style.height = `${this.totalHeight}px`;

            this.updateFreezeDividers();
        }

        updateFreezeDividers() {
            if (!this.sheet) return;
            if (this.sheet.frozenRows > 0) {
                const y = this.rowPositions[this.sheet.frozenRows] || 0;
                this.freezeRowLine.style.top = `${y}px`;
                this.freezeRowLine.style.display = 'block';
            } else {
                this.freezeRowLine.style.display = 'none';
            }

            if (this.sheet.frozenCols > 0) {
                const x = this.colPositions[this.sheet.frozenCols] || 0;
                this.freezeColLine.style.left = `${x}px`;
                this.freezeColLine.style.display = 'block';
            } else {
                this.freezeColLine.style.display = 'none';
            }
        }

        syncScroll() {
            const scrollLeft = this.viewport.scrollLeft;
            const scrollTop = this.viewport.scrollTop;
            this.colHeadersViewport.scrollLeft = scrollLeft;
            this.rowHeadersViewport.scrollTop = scrollTop;
        }

        computeVisibleRange() {
            if (!this.sheet) return;
            const scrollTop = this.viewport.scrollTop;
            const scrollLeft = this.viewport.scrollLeft;
            const viewH = this.viewport.clientHeight || 600;
            const viewW = this.viewport.clientWidth || 800;

            let startRow = 0;
            while (startRow < this.rowPositions.length - 1 && this.rowPositions[startRow + 1] < scrollTop) startRow++;
            let endRow = startRow;
            while (endRow < this.rowPositions.length - 1 && this.rowPositions[endRow] < scrollTop + viewH) endRow++;

            let startCol = 0;
            while (startCol < this.colPositions.length - 1 && this.colPositions[startCol + 1] < scrollLeft) startCol++;
            let endCol = startCol;
            while (endCol < this.colPositions.length - 1 && this.colPositions[endCol] < scrollLeft + viewW) endCol++;

            this.visibleRange = {
                startRow: Math.max(0, startRow - this.buffer),
                endRow: Math.min(this.sheet.rowCount - 1, endRow + this.buffer),
                startCol: Math.max(0, startCol - this.buffer),
                endCol: Math.min(this.sheet.colCount - 1, endCol + this.buffer)
            };
        }

        renderAll() {
            this.computeVisibleRange();
            this.renderColHeaders();
            this.renderRowHeaders();
            this.renderVirtual();
        }

        renderColHeaders() {
            if (!this.sheet) return;
            const { startCol, endCol } = this.visibleRange;
            let html = '';

            for (let c = startCol; c <= endCol; c++) {
                if (this.sheet.hiddenCols.has(c)) continue;
                const left = this.colPositions[c];
                const width = this.sheet.getColWidth(c);
                const letter = colIndexToLetter(c);
                const isFiltered = this.sheet.filterRange && (c >= this.sheet.filterRange.startCol && c <= this.sheet.filterRange.endCol);

                html += `
                    <div class="sf-col-header" data-col="${c}" style="left: ${left}px; width: ${width}px;">
                        <span class="sf-header-text">${letter}</span>
                        ${isFiltered ? `<button class="sf-col-filter-btn" data-col="${c}" title="Filter column ${letter}">▼</button>` : ''}
                        <div class="sf-col-resizer" data-col="${c}"></div>
                    </div>
                `;
            }
            this.colHeadersTrack.innerHTML = html;
        }

        renderRowHeaders() {
            if (!this.sheet) return;
            const { startRow, endRow } = this.visibleRange;
            let html = '';

            for (let r = startRow; r <= endRow; r++) {
                if (this.sheet.hiddenRows.has(r)) continue;
                const top = this.rowPositions[r];
                const height = this.sheet.getRowHeight(r);
                const num = r + 1;

                html += `
                    <div class="sf-row-header" data-row="${r}" style="top: ${top}px; height: ${height}px; line-height: ${height}px;">
                        <span class="sf-header-text">${num}</span>
                        <div class="sf-row-resizer" data-row="${r}"></div>
                    </div>
                `;
            }
            this.rowHeadersTrack.innerHTML = html;
        }

        renderVirtual() {
            if (!this.sheet) return;
            this.computeVisibleRange();
            this.renderColHeaders();
            this.renderRowHeaders();

            const { startRow, endRow, startCol, endCol } = this.visibleRange;
            const renderedCells = [];
            const renderedMerges = new Set();

            for (let r = startRow; r <= endRow; r++) {
                if (this.sheet.hiddenRows.has(r)) continue;
                const top = this.rowPositions[r];
                const height = this.sheet.getRowHeight(r);

                for (let c = startCol; c <= endCol; c++) {
                    if (this.sheet.hiddenCols.has(c)) continue;
                    const left = this.colPositions[c];
                    const width = this.sheet.getColWidth(c);
                    const cell = this.sheet.getCell(r, c);
                    const mergeInfo = cell ? cell.mergeInfo : null;

                    if (mergeInfo && mergeInfo.isMerged) {
                        if (!mergeInfo.isMaster) continue;
                        const mergeKey = `${mergeInfo.masterRow},${mergeInfo.masterCol}`;
                        if (renderedMerges.has(mergeKey)) continue;
                        renderedMerges.add(mergeKey);

                        const mEndR = mergeInfo.masterRow + mergeInfo.rowSpan;
                        const mEndC = mergeInfo.masterCol + mergeInfo.colSpan;
                        const mTop = this.rowPositions[mergeInfo.masterRow];
                        const mLeft = this.colPositions[mergeInfo.masterCol];
                        const mHeight = (this.rowPositions[mEndR] || this.totalHeight) - mTop;
                        const mWidth = (this.colPositions[mEndC] || this.totalWidth) - mLeft;

                        renderedCells.push(this.createCellHTML(cell, mergeInfo.masterRow, mergeInfo.masterCol, mTop, mLeft, mWidth, mHeight, true));
                        continue;
                    }

                    renderedCells.push(this.createCellHTML(cell, r, c, top, left, width, height, false));
                }
            }

            this.cellsContainer.innerHTML = renderedCells.join('');
        }

        createCellHTML(cell, r, c, top, left, width, height, isMerged = false) {
            let text = '';
            let styleStr = `top: ${top}px; left: ${left}px; width: ${width}px; height: ${height}px; line-height: ${height - 2}px;`;
            let classList = ['sf-cell'];

            if (isMerged) classList.push('sf-cell-merged');

            if (cell) {
                if (cell.error) {
                    text = cell.error;
                    classList.push('sf-cell-error');
                } else {
                    text = Formatter.formatCell(cell);
                }

                const s = cell.style;
                if (s) {
                    if (s.bold) styleStr += 'font-weight: 600;';
                    if (s.italic) styleStr += 'font-style: italic;';
                    if (s.underline || s.strikethrough) {
                        const dec = [];
                        if (s.underline) dec.push('underline');
                        if (s.strikethrough) dec.push('line-through');
                        styleStr += `text-decoration: ${dec.join(' ')};`;
                    }
                    if (s.color && s.color !== '#1e293b') styleStr += `color: ${s.color};`;
                    if (s.backgroundColor && s.backgroundColor !== '#ffffff') {
                        styleStr += `background-color: ${s.backgroundColor};`;
                    }
                    if (s.alignH) styleStr += `text-align: ${s.alignH};`;
                    if (s.fontSize && s.fontSize !== 13) styleStr += `font-size: ${s.fontSize}px;`;
                    if (s.wrapText) {
                        classList.push('sf-cell-wrap');
                        styleStr += 'white-space: normal; word-break: break-word;';
                    }
                }

                if (cell.comment) {
                    classList.push('sf-has-comment');
                }
            }

            // Conditional formatting rules
            if (this.sheet && this.sheet.conditionalFormats) {
                for (const cf of this.sheet.conditionalFormats) {
                    if (r >= cf.range.startRow && r <= cf.range.endRow && c >= cf.range.startCol && c <= cf.range.endCol) {
                        const val = cell ? (cell.numericValue !== null ? cell.numericValue : cell.rawValue) : null;
                        if (typeof val === 'number' && cf.rule.type === 'greaterThan' && val > Number(cf.rule.value)) {
                            if (cf.rule.style.backgroundColor) styleStr += `background-color: ${cf.rule.style.backgroundColor} !important;`;
                            if (cf.rule.style.color) styleStr += `color: ${cf.rule.style.color} !important;`;
                        }
                    }
                }
            }

            const safeText = this.escapeHTML(text);
            return `<div class="${classList.join(' ')}" data-row="${r}" data-col="${c}" style="${styleStr}"><span class="sf-cell-inner">${safeText}</span></div>`;
        }

        getCellRect(r, c) {
            const top = this.rowPositions[r] || 0;
            const left = this.colPositions[c] || 0;
            const height = this.sheet ? this.sheet.getRowHeight(r) : 26;
            const width = this.sheet ? this.sheet.getColWidth(c) : 100;
            return { top, left, width, height };
        }

        getRangeRect(startRow, startCol, endRow, endCol) {
            const r1 = Math.min(startRow, endRow);
            const r2 = Math.max(startRow, endRow);
            const c1 = Math.min(startCol, endCol);
            const c2 = Math.max(startCol, endCol);

            const top = this.rowPositions[r1] || 0;
            const left = this.colPositions[c1] || 0;
            const bottom = (this.rowPositions[r2 + 1] !== undefined ? this.rowPositions[r2 + 1] : (top + 26));
            const right = (this.colPositions[c2 + 1] !== undefined ? this.colPositions[c2 + 1] : (left + 100));

            return { top, left, width: right - left, height: bottom - top };
        }

        getCellFromCoords(clientX, clientY) {
            const rect = this.cellsContainer.getBoundingClientRect();
            const scrollLeft = this.viewport.scrollLeft;
            const scrollTop = this.viewport.scrollTop;

            const relX = clientX - rect.left + scrollLeft;
            const relY = clientY - rect.top + scrollTop;

            let row = 0;
            while (row < this.rowPositions.length - 1 && this.rowPositions[row + 1] <= relY) row++;

            let col = 0;
            while (col < this.colPositions.length - 1 && this.colPositions[col + 1] <= relX) col++;

            return {
                row: Math.min(this.sheet.rowCount - 1, Math.max(0, row)),
                col: Math.min(this.sheet.colCount - 1, Math.max(0, col))
            };
        }

        scrollToCell(row, col) {
            const rect = this.getCellRect(row, col);
            const viewW = this.viewport.clientWidth;
            const viewH = this.viewport.clientHeight;

            if (rect.left < this.viewport.scrollLeft) {
                this.viewport.scrollLeft = rect.left;
            } else if (rect.left + rect.width > this.viewport.scrollLeft + viewW) {
                this.viewport.scrollLeft = rect.left + rect.width - viewW + 40;
            }

            if (rect.top < this.viewport.scrollTop) {
                this.viewport.scrollTop = rect.top;
            } else if (rect.top + rect.height > this.viewport.scrollTop + viewH) {
                this.viewport.scrollTop = rect.top + rect.height - viewH + 40;
            }
        }

        escapeHTML(str) {
            if (str === null || str === undefined) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        }
    }

    class SelectionManager {
        constructor(virtualGrid, eventEmitter) {
            this.grid = virtualGrid;
            this.emitter = eventEmitter;
            this.activeCell = { row: 0, col: 0 };
            this.anchorCell = { row: 0, col: 0 };
            this.selectionRange = { startRow: 0, startCol: 0, endRow: 0, endCol: 0 };
            this.isSelecting = false;
            this.clipboardRange = null;
            this._bindEvents();
        }

        _bindEvents() {
            this.grid.canvas.addEventListener('mousedown', (e) => {
                if (e.target.closest('.sf-cell-editor-container') || e.target.closest('.sf-fill-handle')) return;
                if (e.button !== 0 && e.button !== 2) return;

                const coords = this.grid.getCellFromCoords(e.clientX, e.clientY);
                if (e.shiftKey) this.expandSelectionTo(coords.row, coords.col);
                else this.selectCell(coords.row, coords.col);

                if (e.button === 0) this.isSelecting = true;
            });

            window.addEventListener('mousemove', (e) => {
                if (!this.isSelecting) return;
                const coords = this.grid.getCellFromCoords(e.clientX, e.clientY);
                this.expandSelectionTo(coords.row, coords.col);
            });

            window.addEventListener('mouseup', () => {
                if (this.isSelecting) this.isSelecting = false;
            });

            this.grid.colHeadersTrack.addEventListener('mousedown', (e) => {
                if (e.target.closest('.sf-col-resizer') || e.target.closest('.sf-col-filter-btn')) return;
                const header = e.target.closest('.sf-col-header');
                if (!header) return;
                const col = parseInt(header.dataset.col, 10);
                this.selectColumn(col, e.shiftKey);
            });

            this.grid.rowHeadersTrack.addEventListener('mousedown', (e) => {
                if (e.target.closest('.sf-row-resizer')) return;
                const header = e.target.closest('.sf-row-header');
                if (!header) return;
                const row = parseInt(header.dataset.row, 10);
                this.selectRow(row, e.shiftKey);
            });

            this.grid.cornerHeader.addEventListener('click', () => this.selectAll());
        }

        selectCell(row, col) {
            if (!this.grid.sheet) return;
            const r = Math.max(0, Math.min(this.grid.sheet.rowCount - 1, row));
            const c = Math.max(0, Math.min(this.grid.sheet.colCount - 1, col));

            const cell = this.grid.sheet.getCell(r, c);
            if (cell && cell.mergeInfo && cell.mergeInfo.isMerged) {
                const m = cell.mergeInfo;
                this.activeCell = { row: m.masterRow, col: m.masterCol };
                this.anchorCell = { row: m.masterRow, col: m.masterCol };
                this.selectionRange = {
                    startRow: m.masterRow, startCol: m.masterCol,
                    endRow: m.masterRow + m.rowSpan - 1, endCol: m.masterCol + m.colSpan - 1
                };
            } else {
                this.activeCell = { row: r, col: c };
                this.anchorCell = { row: r, col: c };
                this.selectionRange = { startRow: r, startCol: c, endRow: r, endCol: c };
            }

            this.updateOverlays();
            this._notify();
        }

        expandSelectionTo(row, col) {
            if (!this.grid.sheet) return;
            const r = Math.max(0, Math.min(this.grid.sheet.rowCount - 1, row));
            const c = Math.max(0, Math.min(this.grid.sheet.colCount - 1, col));

            this.selectionRange = {
                startRow: Math.min(this.anchorCell.row, r),
                startCol: Math.min(this.anchorCell.col, c),
                endRow: Math.max(this.anchorCell.row, r),
                endCol: Math.max(this.anchorCell.col, c)
            };

            this.updateOverlays();
            this._notify();
        }

        selectRow(row, isExtend = false) {
            if (!this.grid.sheet) return;
            const r = Math.max(0, Math.min(this.grid.sheet.rowCount - 1, row));
            const maxCol = this.grid.sheet.colCount - 1;
            if (isExtend) {
                this.selectionRange = { startRow: Math.min(this.anchorCell.row, r), startCol: 0, endRow: Math.max(this.anchorCell.row, r), endCol: maxCol };
            } else {
                this.activeCell = { row: r, col: 0 };
                this.anchorCell = { row: r, col: 0 };
                this.selectionRange = { startRow: r, startCol: 0, endRow: r, endCol: maxCol };
            }
            this.updateOverlays();
            this._notify();
        }

        selectColumn(col, isExtend = false) {
            if (!this.grid.sheet) return;
            const c = Math.max(0, Math.min(this.grid.sheet.colCount - 1, col));
            const maxRow = this.grid.sheet.rowCount - 1;
            if (isExtend) {
                this.selectionRange = { startRow: 0, startCol: Math.min(this.anchorCell.col, c), endRow: maxRow, endCol: Math.max(this.anchorCell.col, c) };
            } else {
                this.activeCell = { row: 0, col: c };
                this.anchorCell = { row: 0, col: c };
                this.selectionRange = { startRow: 0, startCol: c, endRow: maxRow, endCol: c };
            }
            this.updateOverlays();
            this._notify();
        }

        selectAll() {
            if (!this.grid.sheet) return;
            this.activeCell = { row: 0, col: 0 };
            this.anchorCell = { row: 0, col: 0 };
            this.selectionRange = { startRow: 0, startCol: 0, endRow: this.grid.sheet.rowCount - 1, endCol: this.grid.sheet.colCount - 1 };
            this.updateOverlays();
            this._notify();
        }

        moveActiveCell(dRow, dCol, isExtend = false) {
            if (!this.grid.sheet) return;
            const targetRow = Math.max(0, Math.min(this.grid.sheet.rowCount - 1, (isExtend ? this.selectionRange.endRow : this.activeCell.row) + dRow));
            const targetCol = Math.max(0, Math.min(this.grid.sheet.colCount - 1, (isExtend ? this.selectionRange.endCol : this.activeCell.col) + dCol));

            if (isExtend) this.expandSelectionTo(targetRow, targetCol);
            else this.selectCell(targetRow, targetCol);
            this.grid.scrollToCell(targetRow, targetCol);
        }

        updateOverlays() {
            if (!this.grid.sheet) return;

            const activeRect = this.grid.getCellRect(this.activeCell.row, this.activeCell.col);
            const cell = this.grid.sheet.getCell(this.activeCell.row, this.activeCell.col);

            let actW = activeRect.width;
            let actH = activeRect.height;
            if (cell && cell.mergeInfo && cell.mergeInfo.isMerged && cell.mergeInfo.isMaster) {
                const mEndR = cell.mergeInfo.masterRow + cell.mergeInfo.rowSpan;
                const mEndC = cell.mergeInfo.masterCol + cell.mergeInfo.colSpan;
                actH = (this.grid.rowPositions[mEndR] || this.grid.totalHeight) - activeRect.top;
                actW = (this.grid.colPositions[mEndC] || this.grid.totalWidth) - activeRect.left;
            }

            this.grid.selectionActiveCell.style.top = `${activeRect.top}px`;
            this.grid.selectionActiveCell.style.left = `${activeRect.left}px`;
            this.grid.selectionActiveCell.style.width = `${actW}px`;
            this.grid.selectionActiveCell.style.height = `${actH}px`;
            this.grid.selectionActiveCell.style.display = 'block';

            const isSingleCell = (this.selectionRange.startRow === this.selectionRange.endRow && this.selectionRange.startCol === this.selectionRange.endCol);
            if (!isSingleCell) {
                const rangeRect = this.grid.getRangeRect(
                    this.selectionRange.startRow, this.selectionRange.startCol,
                    this.selectionRange.endRow, this.selectionRange.endCol
                );
                this.grid.selectionRange.style.top = `${rangeRect.top}px`;
                this.grid.selectionRange.style.left = `${rangeRect.left}px`;
                this.grid.selectionRange.style.width = `${rangeRect.width}px`;
                this.grid.selectionRange.style.height = `${rangeRect.height}px`;
                this.grid.selectionRange.style.display = 'block';
            } else {
                this.grid.selectionRange.style.display = 'none';
            }

            this._updateHeaderActiveHighlights();
            this.updateClipboardAnts();
        }

        setClipboard(range, isCut = false) {
            this.clipboardRange = { range: { ...range }, isCut, sheetId: this.grid.sheet ? this.grid.sheet.id : null };
            this.updateClipboardAnts();
        }

        clearClipboard() {
            this.clipboardRange = null;
            this.updateClipboardAnts();
        }

        updateClipboardAnts() {
            if (!this.clipboardRange || !this.grid.sheet || this.clipboardRange.sheetId !== this.grid.sheet.id) {
                this.grid.clipboardAnts.style.display = 'none';
                return;
            }

            const rect = this.grid.getRangeRect(
                this.clipboardRange.range.startRow, this.clipboardRange.range.startCol,
                this.clipboardRange.range.endRow, this.clipboardRange.range.endCol
            );
            this.grid.clipboardAnts.style.top = `${rect.top}px`;
            this.grid.clipboardAnts.style.left = `${rect.left}px`;
            this.grid.clipboardAnts.style.width = `${rect.width}px`;
            this.grid.clipboardAnts.style.height = `${rect.height}px`;
            this.grid.clipboardAnts.style.display = 'block';
        }

        _updateHeaderActiveHighlights() {
            const colHeaders = this.grid.colHeadersTrack.querySelectorAll('.sf-col-header');
            for (const el of colHeaders) {
                const c = parseInt(el.dataset.col, 10);
                if (c >= this.selectionRange.startCol && c <= this.selectionRange.endCol) {
                    el.classList.add('sf-header-selected');
                } else {
                    el.classList.remove('sf-header-selected');
                }
            }

            const rowHeaders = this.grid.rowHeadersTrack.querySelectorAll('.sf-row-header');
            for (const el of rowHeaders) {
                const r = parseInt(el.dataset.row, 10);
                if (r >= this.selectionRange.startRow && r <= this.selectionRange.endRow) {
                    el.classList.add('sf-header-selected');
                } else {
                    el.classList.remove('sf-header-selected');
                }
            }
        }

        getSelectedCells() {
            if (!this.grid.sheet) return [];
            const cells = [];
            const { startRow, startCol, endRow, endCol } = this.selectionRange;
            for (let r = startRow; r <= endRow; r++) {
                for (let c = startCol; c <= endCol; c++) {
                    const cell = this.grid.sheet.getCell(r, c, false);
                    cells.push({ row: r, col: c, cell });
                }
            }
            return cells;
        }

        getSelectedRangeAddress() {
            const { startRow, startCol, endRow, endCol } = this.selectionRange;
            if (startRow === endRow && startCol === endCol) {
                return formatCellAddress(startRow, startCol);
            }
            const start = formatCellAddress(startRow, startCol);
            const end = formatCellAddress(endRow, endCol);
            return {
                address: `${start}:${end}`,
                dimensions: `${endRow - startRow + 1}R × ${endCol - startCol + 1}C`
            };
        }

        _notify() {
            const cell = this.grid.sheet ? this.grid.sheet.getCell(this.activeCell.row, this.activeCell.col) : null;
            const addrObj = this.getSelectedRangeAddress();
            const address = typeof addrObj === 'string' ? addrObj : addrObj.address;
            const dimensions = typeof addrObj === 'object' ? addrObj.dimensions : '1R × 1C';

            if (this.emitter) {
                this.emitter.emit('selection:changed', {
                    activeCell: this.activeCell,
                    selectionRange: this.selectionRange,
                    cell,
                    address,
                    dimensions,
                    selectedCells: this.getSelectedCells()
                });
            }
        }
    }

    class DragManager {
        constructor(virtualGrid, selectionManager, eventEmitter, onAutoFillApply = null) {
            this.grid = virtualGrid;
            this.selection = selectionManager;
            this.emitter = eventEmitter;
            this.onAutoFillApply = onAutoFillApply;

            this.isDraggingCol = false;
            this.isDraggingRow = false;
            this.isDraggingFill = false;

            this.dragColIndex = null;
            this.dragRowIndex = null;
            this.startX = 0;
            this.startY = 0;
            this.startDimension = 0;
            this.fillTargetRange = null;

            this._bindEvents();
        }

        _bindEvents() {
            this.grid.colHeadersTrack.addEventListener('mousedown', (e) => {
                const resizer = e.target.closest('.sf-col-resizer');
                if (!resizer) return;
                e.preventDefault(); e.stopPropagation();
                this.isDraggingCol = true;
                this.dragColIndex = parseInt(resizer.dataset.col, 10);
                this.startX = e.clientX;
                this.startDimension = this.grid.sheet.getColWidth(this.dragColIndex);
                this.grid.resizeGuideline.style.display = 'block';
                this.grid.resizeGuideline.className = 'sf-resize-guideline sf-resize-col';
                this._updateColGuideline(e.clientX);
            });

            this.grid.rowHeadersTrack.addEventListener('mousedown', (e) => {
                const resizer = e.target.closest('.sf-row-resizer');
                if (!resizer) return;
                e.preventDefault(); e.stopPropagation();
                this.isDraggingRow = true;
                this.dragRowIndex = parseInt(resizer.dataset.row, 10);
                this.startY = e.clientY;
                this.startDimension = this.grid.sheet.getRowHeight(this.dragRowIndex);
                this.grid.resizeGuideline.style.display = 'block';
                this.grid.resizeGuideline.className = 'sf-resize-guideline sf-resize-row';
                this._updateRowGuideline(e.clientY);
            });

            this.grid.fillHandle.addEventListener('mousedown', (e) => {
                e.preventDefault(); e.stopPropagation();
                this.isDraggingFill = true;
                this.fillTargetRange = { ...this.selection.selectionRange };
                this.grid.autofillPreview.style.display = 'block';
                this._updateFillPreview(this.fillTargetRange);
            });

            window.addEventListener('mousemove', (e) => {
                if (this.isDraggingCol) {
                    this._updateColGuideline(e.clientX);
                } else if (this.isDraggingRow) {
                    this._updateRowGuideline(e.clientY);
                } else if (this.isDraggingFill) {
                    this._handleFillDrag(e.clientX, e.clientY);
                }
            });

            window.addEventListener('mouseup', (e) => {
                if (this.isDraggingCol) {
                    this.isDraggingCol = false;
                    this.grid.resizeGuideline.style.display = 'none';
                    const newWidth = Math.max(30, this.startDimension + (e.clientX - this.startX));
                    if (this.emitter) this.emitter.emit('grid:resizeCol', { col: this.dragColIndex, width: newWidth });
                } else if (this.isDraggingRow) {
                    this.isDraggingRow = false;
                    this.grid.resizeGuideline.style.display = 'none';
                    const newHeight = Math.max(18, this.startDimension + (e.clientY - this.startY));
                    if (this.emitter) this.emitter.emit('grid:resizeRow', { row: this.dragRowIndex, height: newHeight });
                } else if (this.isDraggingFill) {
                    this.isDraggingFill = false;
                    this.grid.autofillPreview.style.display = 'none';
                    this._applyAutoFill();
                }
            });
        }

        _updateColGuideline(clientX) {
            const wrapperRect = this.grid.wrapper.getBoundingClientRect();
            this.grid.resizeGuideline.style.left = `${clientX - wrapperRect.left}px`;
            this.grid.resizeGuideline.style.top = '0px';
            this.grid.resizeGuideline.style.height = `${wrapperRect.height}px`;
            this.grid.resizeGuideline.style.width = '2px';
        }

        _updateRowGuideline(clientY) {
            const wrapperRect = this.grid.wrapper.getBoundingClientRect();
            this.grid.resizeGuideline.style.top = `${clientY - wrapperRect.top}px`;
            this.grid.resizeGuideline.style.left = '0px';
            this.grid.resizeGuideline.style.width = `${wrapperRect.width}px`;
            this.grid.resizeGuideline.style.height = '2px';
        }

        _handleFillDrag(clientX, clientY) {
            const targetCoord = this.grid.getCellFromCoords(clientX, clientY);
            const sel = this.selection.selectionRange;
            const dRow = targetCoord.row - sel.endRow;
            const dCol = targetCoord.col - sel.endCol;

            if (Math.abs(dRow) >= Math.abs(dCol)) {
                this.fillTargetRange = dRow >= 0 ? { startRow: sel.startRow, startCol: sel.startCol, endRow: targetCoord.row, endCol: sel.endCol } : { ...sel };
            } else {
                this.fillTargetRange = dCol >= 0 ? { startRow: sel.startRow, startCol: sel.startCol, endRow: sel.endRow, endCol: targetCoord.col } : { ...sel };
            }
            this._updateFillPreview(this.fillTargetRange);
        }

        _updateFillPreview(range) {
            const rect = this.grid.getRangeRect(range.startRow, range.startCol, range.endRow, range.endCol);
            this.grid.autofillPreview.style.top = `${rect.top}px`;
            this.grid.autofillPreview.style.left = `${rect.left}px`;
            this.grid.autofillPreview.style.width = `${rect.width}px`;
            this.grid.autofillPreview.style.height = `${rect.height}px`;
        }

        _applyAutoFill() {
            if (!this.fillTargetRange || !this.grid.sheet) return;
            const sourceRange = this.selection.selectionRange;
            const targetRange = this.fillTargetRange;

            const isVertical = targetRange.endRow > sourceRange.endRow;
            const isHorizontal = targetRange.endCol > sourceRange.endCol;
            if (!isVertical && !isHorizontal) return;

            const updates = [];
            if (isVertical) {
                for (let c = sourceRange.startCol; c <= sourceRange.endCol; c++) {
                    const sourceCells = [];
                    for (let r = sourceRange.startRow; r <= sourceRange.endRow; r++) sourceCells.push(this.grid.sheet.getCell(r, c));
                    const targetCoords = [];
                    for (let r = sourceRange.endRow + 1; r <= targetRange.endRow; r++) targetCoords.push({ row: r, col: c });
                    updates.push(...AutoFill.extrapolate(sourceCells, targetCoords));
                }
            } else if (isHorizontal) {
                for (let r = sourceRange.startRow; r <= sourceRange.endRow; r++) {
                    const sourceCells = [];
                    for (let c = sourceRange.startCol; c <= sourceRange.endCol; c++) sourceCells.push(this.grid.sheet.getCell(r, c));
                    const targetCoords = [];
                    for (let c = sourceRange.endCol + 1; c <= targetRange.endCol; c++) targetCoords.push({ row: r, col: c });
                    updates.push(...AutoFill.extrapolate(sourceCells, targetCoords));
                }
            }

            if (this.onAutoFillApply) this.onAutoFillApply(updates, targetRange);
        }
    }

    const BUILT_IN_FUNCTIONS_INFO = [
        { name: 'SUM', desc: 'Adds all numbers in a range', syntax: 'SUM(value1, [value2, ...])' },
        { name: 'AVERAGE', desc: 'Calculates the arithmetic mean', syntax: 'AVERAGE(value1, [value2, ...])' },
        { name: 'COUNT', desc: 'Counts the number of cells containing numbers', syntax: 'COUNT(value1, [value2, ...])' },
        { name: 'COUNTA', desc: 'Counts the number of non-empty cells', syntax: 'COUNTA(value1, [value2, ...])' },
        { name: 'MIN', desc: 'Returns the minimum value in a range', syntax: 'MIN(value1, [value2, ...])' },
        { name: 'MAX', desc: 'Returns the maximum value in a range', syntax: 'MAX(value1, [value2, ...])' },
        { name: 'IF', desc: 'Returns one value if condition is TRUE and another if FALSE', syntax: 'IF(logical_test, value_if_true, [value_if_false])' },
        { name: 'ROUND', desc: 'Rounds a number to a specified number of digits', syntax: 'ROUND(number, num_digits)' },
        { name: 'ABS', desc: 'Returns the absolute value of a number', syntax: 'ABS(number)' },
        { name: 'CONCAT', desc: 'Combines text from multiple ranges or strings', syntax: 'CONCAT(text1, [text2, ...])' },
        { name: 'TODAY', desc: 'Returns the current date', syntax: 'TODAY()' },
        { name: 'NOW', desc: 'Returns current date and time', syntax: 'NOW()' }
    ];

    class CellEditor {
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
            this.grid.canvas.addEventListener('dblclick', (e) => {
                const coords = this.grid.getCellFromCoords(e.clientX, e.clientY);
                this.startEditing(coords.row, coords.col);
            });

            this.grid.editor.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    if (e.altKey) return;
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

            this.grid.editor.addEventListener('input', () => {
                const val = this.grid.editor.innerText;
                if (this.emitter) this.emitter.emit('editor:input', { value: val });
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
            this._moveCursorToEnd(this.grid.editor);

            if (this.emitter) this.emitter.emit('editor:start', { row, col, value: textToEdit });
            this._handleAutocomplete(textToEdit);
        }

        commitEdit(navDirection = null) {
            if (!this.isEditing) return;
            const val = this.grid.editor.innerText;
            const { row, col } = this.editingCell;

            this.isEditing = false;
            this.grid.editorContainer.style.display = 'none';
            this.autocompletePopup.style.display = 'none';

            if (this.onCommit) this.onCommit(row, col, val);
            if (this.emitter) this.emitter.emit('editor:commit', { row, col, value: val });

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
            if (this.emitter) this.emitter.emit('editor:cancel', { row: this.editingCell.row, col: this.editingCell.col, initialValue: this.initialValue });
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
            const match = val.match(/=([A-Za-z0-9_]*)$/);
            if (!match || match[1].length === 0) {
                this.autocompletePopup.style.display = 'none';
                return;
            }

            const query = match[1].toUpperCase();
            const matches = BUILT_IN_FUNCTIONS_INFO.filter(f => f.name.startsWith(query)).slice(0, 5);
            if (matches.length === 0) {
                this.autocompletePopup.style.display = 'none';
                return;
            }

            const edRect = this.grid.editor.getBoundingClientRect();
            this.autocompletePopup.style.top = `${edRect.bottom + 4}px`;
            this.autocompletePopup.style.left = `${edRect.left}px`;
            this.autocompletePopup.style.display = 'block';

            this.autocompletePopup.innerHTML = matches.map((fn, i) => `
                <div class="sf-ac-item ${i === 0 ? 'sf-ac-active' : ''}" data-fn="${fn.name}">
                    <div class="sf-ac-name">${fn.name}</div>
                    <div class="sf-ac-desc">${fn.desc}</div>
                    <div class="sf-ac-syntax">${fn.syntax}</div>
                </div>
            `).join('');

            this.autocompletePopup.querySelectorAll('.sf-ac-item').forEach(el => {
                el.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    const fnName = el.dataset.fn;
                    const replaced = this.grid.editor.innerText.replace(/=([A-Za-z0-9_]*)$/, `=${fnName}(`);
                    this.grid.editor.innerText = replaced;
                    this._moveCursorToEnd(this.grid.editor);
                    this.autocompletePopup.style.display = 'none';
                    if (this.emitter) this.emitter.emit('editor:input', { value: replaced });
                });
            });
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

    // =========================================================================
    // 8. UI MANAGERS: MenuBar, Toolbar, FormulaBar, SheetTabs, Sidebar, StatusBar,
    //                 ChartManager, FilterManager, Modals, IOManager
    // =========================================================================
    class MenuBar {
        constructor(containerElement, eventEmitter) {
            this.container = containerElement;
            this.emitter = eventEmitter;
            this.activeMenu = null;
            this._render();
            this._bindEvents();
        }

        _render() {
            this.container.innerHTML = `
                <div class="sf-menubar" role="menubar">
                    <div class="sf-menu-item" data-menu="file">
                        <span class="sf-menu-label">File</span>
                        <div class="sf-dropdown-menu">
                            <div class="sf-dropdown-item" data-action="file:new"><span>New Spreadsheet</span><span class="sf-shortcut">Alt+N</span></div>
                            <div class="sf-dropdown-divider"></div>
                            <div class="sf-dropdown-item" data-action="file:importCsv"><span>Import CSV...</span></div>
                            <div class="sf-dropdown-item" data-action="file:importJson"><span>Open SheetForge JSON...</span></div>
                            <div class="sf-dropdown-divider"></div>
                            <div class="sf-dropdown-item" data-action="file:save"><span>Save to Browser</span><span class="sf-shortcut">Ctrl+S</span></div>
                            <div class="sf-dropdown-item" data-action="file:exportCsv"><span>Export Active Sheet (CSV)</span></div>
                            <div class="sf-dropdown-item" data-action="file:exportJson"><span>Export Workbook (JSON)</span></div>
                            <div class="sf-dropdown-divider"></div>
                            <div class="sf-dropdown-item" data-action="file:print"><span>Print Spreadsheet...</span><span class="sf-shortcut">Ctrl+P</span></div>
                        </div>
                    </div>
                    <div class="sf-menu-item" data-menu="edit">
                        <span class="sf-menu-label">Edit</span>
                        <div class="sf-dropdown-menu">
                            <div class="sf-dropdown-item" data-action="edit:undo"><span>Undo</span><span class="sf-shortcut">Ctrl+Z</span></div>
                            <div class="sf-dropdown-item" data-action="edit:redo"><span>Redo</span><span class="sf-shortcut">Ctrl+Y</span></div>
                            <div class="sf-dropdown-divider"></div>
                            <div class="sf-dropdown-item" data-action="edit:cut"><span>Cut</span><span class="sf-shortcut">Ctrl+X</span></div>
                            <div class="sf-dropdown-item" data-action="edit:copy"><span>Copy</span><span class="sf-shortcut">Ctrl+C</span></div>
                            <div class="sf-dropdown-item" data-action="edit:paste"><span>Paste</span><span class="sf-shortcut">Ctrl+V</span></div>
                            <div class="sf-dropdown-item" data-action="edit:pasteValues"><span>Paste Values Only</span><span class="sf-shortcut">Ctrl+Shift+V</span></div>
                            <div class="sf-dropdown-divider"></div>
                            <div class="sf-dropdown-item" data-action="edit:find"><span>Find and Replace...</span><span class="sf-shortcut">Ctrl+F</span></div>
                            <div class="sf-dropdown-divider"></div>
                            <div class="sf-dropdown-item" data-action="edit:clearContents"><span>Clear Contents</span><span class="sf-shortcut">Del</span></div>
                            <div class="sf-dropdown-item" data-action="edit:clearFormats"><span>Clear Formats</span></div>
                            <div class="sf-dropdown-item" data-action="edit:clearAll"><span>Clear All</span></div>
                        </div>
                    </div>
                    <div class="sf-menu-item" data-menu="view">
                        <span class="sf-menu-label">View</span>
                        <div class="sf-dropdown-menu">
                            <div class="sf-dropdown-item" data-action="view:toggleSidebar"><span>Formatting Sidebar</span><span class="sf-shortcut">Ctrl+\\</span></div>
                            <div class="sf-dropdown-divider"></div>
                            <div class="sf-dropdown-item" data-action="view:freezeRow"><span>Freeze Top Row</span></div>
                            <div class="sf-dropdown-item" data-action="view:freezeCol"><span>Freeze First Column</span></div>
                            <div class="sf-dropdown-item" data-action="view:unfreeze"><span>Unfreeze Panes</span></div>
                            <div class="sf-dropdown-divider"></div>
                            <div class="sf-dropdown-item" data-action="view:zoom100"><span>Zoom 100%</span></div>
                            <div class="sf-dropdown-item" data-action="view:fullscreen"><span>Toggle Fullscreen</span></div>
                        </div>
                    </div>
                    <div class="sf-menu-item" data-menu="insert">
                        <span class="sf-menu-label">Insert</span>
                        <div class="sf-dropdown-menu">
                            <div class="sf-dropdown-item" data-action="insert:rowAbove"><span>Row Above</span></div>
                            <div class="sf-dropdown-item" data-action="insert:rowBelow"><span>Row Below</span></div>
                            <div class="sf-dropdown-item" data-action="insert:colLeft"><span>Column Left</span></div>
                            <div class="sf-dropdown-item" data-action="insert:colRight"><span>Column Right</span></div>
                            <div class="sf-dropdown-divider"></div>
                            <div class="sf-dropdown-item" data-action="insert:chart"><span>Insert Chart...</span><span class="sf-shortcut">Alt+F1</span></div>
                            <div class="sf-dropdown-item" data-action="insert:comment"><span>Insert Note...</span></div>
                            <div class="sf-dropdown-item" data-action="insert:sheet"><span>New Worksheet</span><span class="sf-shortcut">Shift+F11</span></div>
                        </div>
                    </div>
                    <div class="sf-menu-item" data-menu="format">
                        <span class="sf-menu-label">Format</span>
                        <div class="sf-dropdown-menu">
                            <div class="sf-dropdown-item" data-action="format:bold"><span>Bold</span><span class="sf-shortcut">Ctrl+B</span></div>
                            <div class="sf-dropdown-item" data-action="format:italic"><span>Italic</span><span class="sf-shortcut">Ctrl+I</span></div>
                            <div class="sf-dropdown-item" data-action="format:underline"><span>Underline</span><span class="sf-shortcut">Ctrl+U</span></div>
                            <div class="sf-dropdown-item" data-action="format:strikethrough"><span>Strikethrough</span></div>
                            <div class="sf-dropdown-divider"></div>
                            <div class="sf-dropdown-item" data-action="format:merge"><span>Merge & Center</span></div>
                            <div class="sf-dropdown-item" data-action="format:wrapText"><span>Toggle Text Wrap</span></div>
                            <div class="sf-dropdown-divider"></div>
                            <div class="sf-dropdown-item" data-action="format:conditional"><span>Conditional Formatting...</span></div>
                        </div>
                    </div>
                    <div class="sf-menu-item" data-menu="data">
                        <span class="sf-menu-label">Data</span>
                        <div class="sf-dropdown-menu">
                            <div class="sf-dropdown-item" data-action="data:sortAsc"><span>Sort Range A to Z</span></div>
                            <div class="sf-dropdown-item" data-action="data:sortDesc"><span>Sort Range Z to A</span></div>
                            <div class="sf-dropdown-divider"></div>
                            <div class="sf-dropdown-item" data-action="data:toggleFilter"><span>Toggle Filters</span></div>
                            <div class="sf-dropdown-item" data-action="data:validation"><span>Data Validation...</span></div>
                            <div class="sf-dropdown-item" data-action="data:duplicates"><span>Duplicate Rows...</span></div>
                        </div>
                    </div>
                    <div class="sf-menu-item" data-menu="help">
                        <span class="sf-menu-label">Help</span>
                        <div class="sf-dropdown-menu">
                            <div class="sf-dropdown-item" data-action="help:shortcuts"><span>Keyboard Shortcuts</span><span class="sf-shortcut">Ctrl+/</span></div>
                            <div class="sf-dropdown-item" data-action="help:formulas"><span>Formulas Reference Guide</span></div>
                            <div class="sf-dropdown-divider"></div>
                            <div class="sf-dropdown-item" data-action="help:demoData"><span>Reload Executive Demo Models</span></div>
                            <div class="sf-dropdown-item" data-action="help:about"><span>About SheetForge</span></div>
                        </div>
                    </div>
                </div>
            `;
        }

        _bindEvents() {
            this.container.querySelectorAll('.sf-menu-item').forEach(item => {
                const label = item.querySelector('.sf-menu-label');
                label.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (this.activeMenu === item) this.closeAll();
                    else this.openMenu(item);
                });
                item.addEventListener('mouseenter', () => {
                    if (this.activeMenu && this.activeMenu !== item) this.openMenu(item);
                });
            });

            window.addEventListener('click', () => this.closeAll());

            this.container.addEventListener('click', (e) => {
                const actionEl = e.target.closest('.sf-dropdown-item');
                if (actionEl) {
                    const action = actionEl.dataset.action;
                    this.closeAll();
                    if (action && this.emitter) this.emitter.emit('action:menu', action);
                }
            });
        }

        openMenu(item) {
            this.closeAll();
            this.activeMenu = item;
            item.classList.add('sf-menu-open');
        }

        closeAll() {
            if (this.activeMenu) {
                this.activeMenu.classList.remove('sf-menu-open');
                this.activeMenu = null;
            }
        }
    }

    const THEME_COLOR_PALETTE = [
        '#ffffff', '#000000', '#e2e8f0', '#334155', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4',
        '#f8fafc', '#0f172a', '#cbd5e1', '#1e293b', '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#22d3ee',
        '#f1f5f9', '#1e293b', '#94a3b8', '#0f172a', '#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2'
    ];

    class Toolbar {
        constructor(containerElement, eventEmitter) {
            this.container = containerElement;
            this.emitter = eventEmitter;
            this._render();
            this._bindEvents();
        }

        _render() {
            this.container.innerHTML = `
                <div class="sf-toolbar" role="toolbar">
                    <div class="sf-tool-group">
                        <button class="sf-tool-btn" id="tbUndo" title="Undo (Ctrl+Z)" disabled>
                            <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>
                        </button>
                        <button class="sf-tool-btn" id="tbRedo" title="Redo (Ctrl+Y)" disabled>
                            <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>
                        </button>
                    </div>
                    <div class="sf-tool-divider"></div>
                    <div class="sf-tool-group">
                        <select class="sf-tool-select sf-font-family-select" id="tbFontFamily" title="Font Family">
                            <option value="Inter, sans-serif" selected>Inter</option>
                            <option value="Roboto, sans-serif">Roboto</option>
                            <option value="Arial, sans-serif">Arial</option>
                            <option value="'Segoe UI', sans-serif">Segoe UI</option>
                            <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                            <option value="'Times New Roman', serif">Times New Roman</option>
                        </select>
                        <select class="sf-tool-select sf-font-size-select" id="tbFontSize" title="Font Size">
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13" selected>13</option>
                            <option value="14">14</option>
                            <option value="16">16</option>
                            <option value="18">18</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                    <div class="sf-tool-divider"></div>
                    <div class="sf-tool-group">
                        <button class="sf-tool-btn" id="tbBold" title="Bold (Ctrl+B)"><b>B</b></button>
                        <button class="sf-tool-btn" id="tbItalic" title="Italic (Ctrl+I)"><i>I</i></button>
                        <button class="sf-tool-btn" id="tbUnderline" title="Underline (Ctrl+U)"><u>U</u></button>
                        <button class="sf-tool-btn" id="tbStrike" title="Strikethrough"><s>S</s></button>
                    </div>
                    <div class="sf-tool-divider"></div>
                    <div class="sf-tool-group sf-color-group">
                        <div class="sf-dropdown-wrapper">
                            <button class="sf-tool-btn sf-color-btn" id="tbTextColorBtn" title="Text Color">
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
                        <div class="sf-dropdown-wrapper">
                            <button class="sf-tool-btn sf-color-btn" id="tbFillColorBtn" title="Fill Color">
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
                        <div class="sf-dropdown-wrapper">
                            <button class="sf-tool-btn" id="tbBordersBtn" title="Borders">
                                <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 8h-6V5h6v6zm-8-6v6H5V5h6zm-6 8h6v6H5v-6zm8 6v-6h6v6h-6z"/></svg>
                                <span class="sf-dropdown-caret">▾</span>
                            </button>
                            <div class="sf-dropdown-panel sf-borders-panel">
                                <div class="sf-border-grid">
                                    <button class="sf-border-item" data-border="all">田 All</button>
                                    <button class="sf-border-item" data-border="outer">回 Box</button>
                                    <button class="sf-border-item" data-border="top">▔ Top</button>
                                    <button class="sf-border-item" data-border="bottom">_ Bottom</button>
                                    <button class="sf-border-item" data-border="none">✕ Clear</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="sf-tool-divider"></div>
                    <div class="sf-tool-group">
                        <button class="sf-tool-btn" id="tbAlignLeft" title="Align Left">
                            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg>
                        </button>
                        <button class="sf-tool-btn" id="tbAlignCenter" title="Align Center">
                            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/></svg>
                        </button>
                        <button class="sf-tool-btn" id="tbAlignRight" title="Align Right">
                            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/></svg>
                        </button>
                        <button class="sf-tool-btn" id="tbWrapText" title="Wrap Text">
                            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M4 19h6v-2H4v2zM20 5H4v2h16V5zm-3 6H4v2h13.25c1.1 0 2 .9 2 2s-.9 2-2 2H15v-2l-3 3 3 3v-2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4z"/></svg>
                        </button>
                        <button class="sf-tool-btn" id="tbMerge" title="Merge & Center">
                            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M6 4h12c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm2 7v2h8v-2H8zm-4 0l3-3v2h2v2H7v2l-3-3zm16 0l-3 3v-2h-2v-2h2v-2l3 3z"/></svg>
                        </button>
                    </div>
                    <div class="sf-tool-divider"></div>
                    <div class="sf-tool-group">
                        <select class="sf-tool-select sf-num-format-select" id="tbNumFormat" title="Number Format">
                            <option value="general">Automatic / General</option>
                            <option value="number">Number (1,234.56)</option>
                            <option value="currency">Currency ($1,234.56)</option>
                            <option value="percent">Percentage (12.3%)</option>
                            <option value="date">Date (YYYY-MM-DD)</option>
                        </select>
                        <button class="sf-tool-btn" id="tbFormatCurrency" title="Currency ($)">$</button>
                        <button class="sf-tool-btn" id="tbFormatPercent" title="Percent (%)">%</button>
                    </div>
                    <div class="sf-tool-divider"></div>
                    <div class="sf-tool-group">
                        <button class="sf-tool-btn" id="tbSortAsc" title="Sort A-Z">▲</button>
                        <button class="sf-tool-btn" id="tbSortDesc" title="Sort Z-A">▼</button>
                        <button class="sf-tool-btn" id="tbFilter" title="Toggle Filters">
                            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>
                        </button>
                        <button class="sf-tool-btn" id="tbInsertChart" title="Insert Chart">
                            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6zM19 21H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2z"/></svg>
                        </button>
                    </div>
                    <div class="sf-toolbar-spacer"></div>
                    <div class="sf-tool-group">
                        <button class="sf-tool-btn sf-sidebar-toggle-btn" id="tbToggleSidebar" title="Sidebar (Ctrl+\\)">
                            <span>Inspector</span>
                        </button>
                    </div>
                </div>
            `;

            const paletteHTML = THEME_COLOR_PALETTE.map(color => `
                <div class="sf-palette-swatch" data-color="${color}" style="background-color: ${color};" title="${color}"></div>
            `).join('');

            this.container.querySelector('#tbTextPaletteGrid').innerHTML = paletteHTML;
            this.container.querySelector('#tbFillPaletteGrid').innerHTML = paletteHTML;
        }

        _bindEvents() {
            this.container.querySelector('#tbUndo').addEventListener('click', () => this.emitter.emit('action:undo'));
            this.container.querySelector('#tbRedo').addEventListener('click', () => this.emitter.emit('action:redo'));

            this.emitter.on('history:changed', ({ canUndo, canRedo }) => {
                this.container.querySelector('#tbUndo').disabled = !canUndo;
                this.container.querySelector('#tbRedo').disabled = !canRedo;
            });

            this.container.querySelector('#tbFontFamily').addEventListener('change', (e) => this.emitter.emit('format:fontFamily', e.target.value));
            this.container.querySelector('#tbFontSize').addEventListener('change', (e) => this.emitter.emit('format:fontSize', parseInt(e.target.value, 10)));

            this.container.querySelector('#tbBold').addEventListener('click', () => this.emitter.emit('format:toggleBold'));
            this.container.querySelector('#tbItalic').addEventListener('click', () => this.emitter.emit('format:toggleItalic'));
            this.container.querySelector('#tbUnderline').addEventListener('click', () => this.emitter.emit('format:toggleUnderline'));
            this.container.querySelector('#tbStrike').addEventListener('click', () => this.emitter.emit('format:toggleStrike'));

            this.container.querySelector('#tbTextPaletteGrid').addEventListener('click', (e) => {
                const swatch = e.target.closest('.sf-palette-swatch');
                if (swatch) {
                    const color = swatch.dataset.color;
                    this.emitter.emit('format:color', color);
                    this._updateTextColorIndicator(color);
                    this._closeDropdownPanels();
                }
            });

            this.container.querySelector('#tbTextColorPicker').addEventListener('input', (e) => {
                this.emitter.emit('format:color', e.target.value);
                this._updateTextColorIndicator(e.target.value);
            });

            this.container.querySelector('#tbFillPaletteGrid').addEventListener('click', (e) => {
                const swatch = e.target.closest('.sf-palette-swatch');
                if (swatch) {
                    this.emitter.emit('format:backgroundColor', swatch.dataset.color);
                    this._closeDropdownPanels();
                }
            });

            this.container.querySelector('#tbFillNoneBtn').addEventListener('click', () => {
                this.emitter.emit('format:backgroundColor', '#ffffff');
                this._closeDropdownPanels();
            });

            this.container.querySelector('#tbFillColorPicker').addEventListener('input', (e) => {
                this.emitter.emit('format:backgroundColor', e.target.value);
            });

            this.container.querySelectorAll('.sf-border-item').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.emitter.emit('format:border', btn.dataset.border);
                    this._closeDropdownPanels();
                });
            });

            this.container.querySelector('#tbAlignLeft').addEventListener('click', () => this.emitter.emit('format:alignH', 'left'));
            this.container.querySelector('#tbAlignCenter').addEventListener('click', () => this.emitter.emit('format:alignH', 'center'));
            this.container.querySelector('#tbAlignRight').addEventListener('click', () => this.emitter.emit('format:alignH', 'right'));
            this.container.querySelector('#tbWrapText').addEventListener('click', () => this.emitter.emit('format:toggleWrap'));
            this.container.querySelector('#tbMerge').addEventListener('click', () => this.emitter.emit('format:toggleMerge'));

            this.container.querySelector('#tbNumFormat').addEventListener('change', (e) => this.emitter.emit('format:numFormat', e.target.value));
            this.container.querySelector('#tbFormatCurrency').addEventListener('click', () => this.emitter.emit('format:numFormat', 'currency'));
            this.container.querySelector('#tbFormatPercent').addEventListener('click', () => this.emitter.emit('format:numFormat', 'percent'));

            this.container.querySelector('#tbSortAsc').addEventListener('click', () => this.emitter.emit('action:sort', 'asc'));
            this.container.querySelector('#tbSortDesc').addEventListener('click', () => this.emitter.emit('action:sort', 'desc'));
            this.container.querySelector('#tbFilter').addEventListener('click', () => this.emitter.emit('action:toggleFilter'));
            this.container.querySelector('#tbInsertChart').addEventListener('click', () => this.emitter.emit('action:insertChart'));
            this.container.querySelector('#tbToggleSidebar').addEventListener('click', () => this.emitter.emit('action:toggleSidebar'));

            this.container.querySelectorAll('.sf-dropdown-wrapper').forEach(wrapper => {
                const btn = wrapper.querySelector('.sf-tool-btn');
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const panel = wrapper.querySelector('.sf-dropdown-panel');
                    const isOpen = panel.classList.contains('sf-panel-open');
                    this._closeDropdownPanels();
                    if (!isOpen) panel.classList.add('sf-panel-open');
                });
            });

            window.addEventListener('click', () => this._closeDropdownPanels());
            this.emitter.on('selection:changed', ({ cell }) => this.syncState(cell));
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

            if (s.fontSize) this.container.querySelector('#tbFontSize').value = String(s.fontSize);
            if (s.fontFamily) this.container.querySelector('#tbFontFamily').value = s.fontFamily;
            if (cell.numFormat) this.container.querySelector('#tbNumFormat').value = cell.numFormat;
            if (s.color) this._updateTextColorIndicator(s.color);
        }
    }

    class FormulaBar {
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
                    <div class="sf-namebox-wrapper">
                        <input type="text" class="sf-namebox" id="sfNameBox" value="A1" spellcheck="false">
                    </div>
                    <div class="sf-formulabar-divider"></div>
                    <div class="sf-formula-actions">
                        <button class="sf-formula-btn sf-btn-cancel" id="fbCancel" title="Cancel" disabled>✕</button>
                        <button class="sf-formula-btn sf-btn-confirm" id="fbConfirm" title="Confirm" disabled>✓</button>
                        <button class="sf-formula-btn sf-btn-fx" id="fbFx" title="Insert Function"><i>fx</i></button>
                    </div>
                    <div class="sf-formulabar-divider"></div>
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
            this.nameBox.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const text = this.nameBox.value.trim().toUpperCase();
                    const addr = parseCellAddress(text);
                    if (addr && this.emitter) this.emitter.emit('grid:selectCell', { row: addr.row, col: addr.col });
                }
            });

            this.formulaInput.addEventListener('input', () => {
                this.setEditingMode(true);
                const val = this.formulaInput.value;
                if (this.emitter) this.emitter.emit('formulabar:input', { value: val });
            });

            this.formulaInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = this.formulaInput.value;
                    this.setEditingMode(false);
                    if (this.emitter) this.emitter.emit('formulabar:commit', { value: val });
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    this.setEditingMode(false);
                    if (this.emitter) this.emitter.emit('formulabar:cancel');
                }
            });

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

            this.emitter.on('selection:changed', ({ cell, address }) => {
                if (!this.isEditing) {
                    this.nameBox.value = address || 'A1';
                    const cellText = cell ? (cell.formula || (cell.rawValue !== null && cell.rawValue !== undefined ? String(cell.rawValue) : '')) : '';
                    this.formulaInput.value = cellText;
                    this.setEditingMode(false);
                }
            });

            this.emitter.on('editor:start', ({ value }) => {
                this.formulaInput.value = value;
                this.setEditingMode(true);
            });

            this.emitter.on('editor:input', ({ value }) => {
                this.formulaInput.value = value;
                this.setEditingMode(true);
            });

            this.emitter.on('editor:commit', () => this.setEditingMode(false));
            this.emitter.on('editor:cancel', ({ initialValue }) => {
                this.formulaInput.value = initialValue;
                this.setEditingMode(false);
            });
        }

        setEditingMode(editing) {
            this.isEditing = editing;
            this.btnCancel.disabled = !editing;
            this.btnConfirm.disabled = !editing;
            this.btnCancel.classList.toggle('sf-active-action', editing);
            this.btnConfirm.classList.toggle('sf-active-action', editing);
        }
    }

    class SheetTabs {
        constructor(containerElement, eventEmitter) {
            this.container = containerElement;
            this.emitter = eventEmitter;
            this.workbook = null;
            this._render();
            this._bindEvents();
        }

        _render() {
            this.container.innerHTML = `
                <div class="sf-tabs-container">
                    <button class="sf-tab-nav-btn" id="sfTabScrollLeft">‹</button>
                    <button class="sf-tab-nav-btn" id="sfTabScrollRight">›</button>
                    <button class="sf-add-tab-btn" id="sfAddSheetBtn" title="Add Worksheet">+</button>
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

        _bindEvents() {
            this.btnAddSheet.addEventListener('click', () => {
                if (this.emitter) this.emitter.emit('action:addSheet');
            });

            this.btnScrollLeft.addEventListener('click', () => this.tabsScrollArea.scrollBy({ left: -100, behavior: 'smooth' }));
            this.btnScrollRight.addEventListener('click', () => this.tabsScrollArea.scrollBy({ left: 100, behavior: 'smooth' }));

            this.tabsList.addEventListener('click', (e) => {
                const tab = e.target.closest('.sf-tab-item');
                if (tab) {
                    const sheetId = tab.dataset.sheetId;
                    if (this.emitter) this.emitter.emit('action:switchSheet', sheetId);
                }
            });

            this.tabsList.addEventListener('dblclick', (e) => {
                const tab = e.target.closest('.sf-tab-item');
                if (tab) {
                    const sheetId = tab.dataset.sheetId;
                    const sheet = this.workbook ? this.workbook.getSheetById(sheetId) : null;
                    const newName = prompt('Rename Worksheet:', sheet ? sheet.name : '');
                    if (newName && newName.trim()) {
                        if (this.emitter) this.emitter.emit('action:renameSheet', { sheetId, newName: newName.trim() });
                    }
                }
            });
        }

        setWorkbook(workbook) {
            this.workbook = workbook;
            this.renderTabs();
        }

        renderTabs() {
            if (!this.workbook) return;
            this.tabsList.innerHTML = this.workbook.sheets.map(sheet => {
                const isActive = sheet.id === this.workbook.activeSheetId;
                const colorBar = sheet.tabColor ? `<div class="sf-tab-color-bar" style="background-color: ${sheet.tabColor};"></div>` : '';
                return `
                    <div class="sf-tab-item ${isActive ? 'sf-tab-active' : ''}" data-sheet-id="${sheet.id}">
                        ${colorBar}
                        <span class="sf-tab-title">${sheet.name}</span>
                    </div>
                `;
            }).join('');
        }
    }

    class Sidebar {
        constructor(containerElement, eventEmitter) {
            this.container = containerElement;
            this.emitter = eventEmitter;
            this.isOpen = false;
            this._render();
            this._bindEvents();
        }

        _render() {
            this.container.innerHTML = `
                <div class="sf-sidebar-panel">
                    <div class="sf-sidebar-header">
                        <span class="sf-sidebar-title">Cell Format & Inspector</span>
                        <button class="sf-sidebar-close" id="sfSidebarClose">✕</button>
                    </div>
                    <div class="sf-sidebar-tabs">
                        <button class="sf-sb-tab sf-sb-tab-active" data-tab="style">Style</button>
                        <button class="sf-sb-tab" data-tab="notes">Notes</button>
                    </div>
                    <div class="sf-sidebar-body">
                        <div class="sf-tab-content sf-tab-style sf-content-active" id="tabContentStyle">
                            <div class="sf-sb-section">
                                <label class="sf-sb-label">Typography</label>
                                <div class="sf-sb-row">
                                    <select class="sf-sb-select" id="sbFontFamily">
                                        <option value="Inter, sans-serif">Inter</option>
                                        <option value="Roboto, sans-serif">Roboto</option>
                                        <option value="Arial, sans-serif">Arial</option>
                                    </select>
                                    <select class="sf-sb-select sf-sb-short" id="sbFontSize">
                                        <option value="11">11px</option>
                                        <option value="12">12px</option>
                                        <option value="13" selected>13px</option>
                                        <option value="14">14px</option>
                                        <option value="16">16px</option>
                                    </select>
                                </div>
                            </div>
                            <div class="sf-sb-section">
                                <label class="sf-sb-label">Cell Fill & Text Color</label>
                                <div class="sf-sb-color-row">
                                    <div class="sf-sb-color-field"><span>Text:</span><input type="color" id="sbTextColor" value="#1e293b"></div>
                                    <div class="sf-sb-color-field"><span>Fill:</span><input type="color" id="sbFillColor" value="#ffffff"></div>
                                </div>
                            </div>
                        </div>
                        <div class="sf-tab-content sf-tab-notes" id="tabContentNotes">
                            <div class="sf-sb-section">
                                <label class="sf-sb-label">Cell Note / Comment</label>
                                <textarea class="sf-sb-textarea" id="sbNoteText" placeholder="Add an annotation..."></textarea>
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
            this.container.querySelector('#sfSidebarClose').addEventListener('click', () => this.close());

            const tabs = this.container.querySelectorAll('.sf-sb-tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('sf-sb-tab-active'));
                    tab.classList.add('sf-sb-tab-active');
                    const target = tab.dataset.tab;
                    this.container.querySelectorAll('.sf-tab-content').forEach(c => c.classList.remove('sf-content-active'));
                    const content = this.container.querySelector(`#tabContent${target.charAt(0).toUpperCase() + target.slice(1)}`);
                    if (content) content.classList.add('sf-content-active');
                });
            });

            this.container.querySelector('#sbFontFamily').addEventListener('change', (e) => this.emitter.emit('format:fontFamily', e.target.value));
            this.container.querySelector('#sbFontSize').addEventListener('change', (e) => this.emitter.emit('format:fontSize', parseInt(e.target.value, 10)));
            this.container.querySelector('#sbTextColor').addEventListener('input', (e) => this.emitter.emit('format:color', e.target.value));
            this.container.querySelector('#sbFillColor').addEventListener('input', (e) => this.emitter.emit('format:backgroundColor', e.target.value));

            this.container.querySelector('#sbSaveNoteBtn').addEventListener('click', () => {
                const text = this.container.querySelector('#sbNoteText').value.trim();
                this.emitter.emit('cell:saveNote', text);
            });

            this.container.querySelector('#sbDeleteNoteBtn').addEventListener('click', () => {
                this.container.querySelector('#sbNoteText').value = '';
                this.emitter.emit('cell:saveNote', null);
            });
        }

        toggle() {
            if (this.isOpen) this.close();
            else this.open();
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
            if (!cell) return;
            this.container.querySelector('#sbNoteText').value = cell.comment || '';
        }
    }

    class StatusBar {
        constructor(containerElement, eventEmitter) {
            this.container = containerElement;
            this.emitter = eventEmitter;
            this.currentZoom = 100;
            this._render();
            this._bindEvents();
        }

        _render() {
            this.container.innerHTML = `
                <div class="sf-statusbar">
                    <div class="sf-status-left">
                        <span class="sf-status-mode" id="sbMode">READY</span>
                        <span class="sf-status-selection" id="sbSelection">A1</span>
                    </div>
                    <div class="sf-status-center" id="sbAggregates">
                        <div class="sf-stat-item" id="statSum" style="display:none;"><span class="sf-stat-label">SUM:</span> <span class="sf-stat-val">0</span></div>
                        <div class="sf-stat-item" id="statAvg" style="display:none;"><span class="sf-stat-label">AVERAGE:</span> <span class="sf-stat-val">0</span></div>
                        <div class="sf-stat-item" id="statCount" style="display:none;"><span class="sf-stat-label">COUNT:</span> <span class="sf-stat-val">0</span></div>
                    </div>
                    <div class="sf-status-right">
                        <button class="sf-zoom-btn" id="sbZoomOut">-</button>
                        <span class="sf-zoom-level" id="sbZoomLevel">100%</span>
                        <button class="sf-zoom-btn" id="sbZoomIn">+</button>
                    </div>
                </div>
            `;

            this.modeEl = this.container.querySelector('#sbMode');
            this.selectionEl = this.container.querySelector('#sbSelection');
            this.statSum = this.container.querySelector('#statSum');
            this.statAvg = this.container.querySelector('#statAvg');
            this.statCount = this.container.querySelector('#statCount');
            this.zoomLevelEl = this.container.querySelector('#sbZoomLevel');
        }

        _bindEvents() {
            this.emitter.on('editor:start', () => this.setMode('EDIT'));
            this.emitter.on('editor:commit', () => this.setMode('READY'));
            this.emitter.on('editor:cancel', () => this.setMode('READY'));

            this.emitter.on('selection:changed', ({ selectedCells, address, dimensions }) => {
                this.selectionEl.innerText = `${address} ${dimensions ? `(${dimensions})` : ''}`;
                this.calculateAggregates(selectedCells);
            });

            this.container.querySelector('#sbZoomIn').addEventListener('click', () => this.changeZoom(10));
            this.container.querySelector('#sbZoomOut').addEventListener('click', () => this.changeZoom(-10));
        }

        setMode(mode) {
            this.modeEl.innerText = mode;
            this.modeEl.className = `sf-status-mode sf-mode-${mode.toLowerCase()}`;
        }

        calculateAggregates(selectedItems) {
            if (!selectedItems || selectedItems.length <= 1) {
                this.statSum.style.display = 'none';
                this.statAvg.style.display = 'none';
                this.statCount.style.display = 'none';
                return;
            }

            let sum = 0, count = 0, numCount = 0;
            for (const item of selectedItems) {
                const cell = item.cell;
                if (!cell) continue;
                if (cell.rawValue !== '' && cell.rawValue !== null) count++;
                const num = cell.numericValue;
                if (num !== null && !isNaN(num)) {
                    sum += num;
                    numCount++;
                }
            }

            if (numCount > 0) {
                this.statSum.querySelector('.sf-stat-val').innerText = sum.toLocaleString();
                this.statAvg.querySelector('.sf-stat-val').innerText = (sum / numCount).toFixed(2);
                this.statCount.querySelector('.sf-stat-val').innerText = String(count);
                this.statSum.style.display = 'inline-flex';
                this.statAvg.style.display = 'inline-flex';
                this.statCount.style.display = 'inline-flex';
            } else {
                this.statSum.style.display = 'none';
                this.statAvg.style.display = 'none';
                this.statCount.style.display = 'none';
            }
        }

        changeZoom(delta) {
            this.currentZoom = Math.min(200, Math.max(50, this.currentZoom + delta));
            this.setZoom(this.currentZoom);
        }

        setZoom(zoom) {
            this.currentZoom = zoom;
            this.zoomLevelEl.innerText = `${this.currentZoom}%`;
            if (this.emitter) this.emitter.emit('grid:zoom', this.currentZoom / 100);
        }
    }

    const CHART_PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

    class ChartManager {
        constructor(containerElement, eventEmitter) {
            this.container = containerElement;
            this.emitter = eventEmitter;
            this.activeCharts = new Map();
            this._setupModalDOM();
            this._bindEvents();
        }

        _setupModalDOM() {
            this.modal = document.createElement('div');
            this.modal.className = 'sf-modal-backdrop';
            this.modal.style.display = 'none';
            this.modal.innerHTML = `
                <div class="sf-modal-dialog">
                    <div class="sf-modal-header">
                        <h3 class="sf-modal-title">Create Chart</h3>
                        <button class="sf-modal-close" id="chartModalClose">✕</button>
                    </div>
                    <div class="sf-modal-body">
                        <div class="sf-form-group">
                            <label>Title</label>
                            <input type="text" class="sf-input" id="chartTitleInput" value="Data Visualizer">
                        </div>
                        <div class="sf-form-group">
                            <label>Type</label>
                            <select class="sf-select" id="chartTypeSelect">
                                <option value="bar">Bar / Column Chart</option>
                                <option value="line">Line Chart</option>
                                <option value="pie">Pie Chart</option>
                            </select>
                        </div>
                        <div class="sf-form-group">
                            <label>Data Range</label>
                            <input type="text" class="sf-input" id="chartDataRangeInput" value="A1:B6">
                        </div>
                    </div>
                    <div class="sf-modal-footer">
                        <button class="sf-btn sf-btn-secondary" id="chartCancelBtn">Cancel</button>
                        <button class="sf-btn sf-btn-primary" id="chartInsertBtn">Insert Chart</button>
                    </div>
                </div>
            `;
            document.body.appendChild(this.modal);
        }

        _bindEvents() {
            this.modal.querySelector('#chartModalClose').addEventListener('click', () => this.closeModal());
            this.modal.querySelector('#chartCancelBtn').addEventListener('click', () => this.closeModal());

            this.modal.querySelector('#chartInsertBtn').addEventListener('click', () => {
                const config = {
                    title: this.modal.querySelector('#chartTitleInput').value || 'Chart',
                    type: this.modal.querySelector('#chartTypeSelect').value || 'bar',
                    range: this.modal.querySelector('#chartDataRangeInput').value || 'A1:B5'
                };
                this.closeModal();
                if (this.emitter) this.emitter.emit('action:createChartWidget', config);
            });

            this.emitter.on('data:recalculated', () => this.refreshAllCharts());
        }

        openModal(rangeStr = 'A1:B6') {
            this.modal.querySelector('#chartDataRangeInput').value = rangeStr;
            this.modal.style.display = 'flex';
        }

        closeModal() { this.modal.style.display = 'none'; }

        createFloatingChartWidget(config, sheet, container) {
            const widgetId = `chart_${Date.now()}`;
            const widget = document.createElement('div');
            widget.className = 'sf-chart-widget';
            widget.id = widgetId;
            widget.style.top = '100px';
            widget.style.left = '180px';
            widget.style.width = '380px';
            widget.style.height = '240px';

            widget.innerHTML = `
                <div class="sf-chart-widget-header">
                    <span class="sf-chart-widget-title">${config.title}</span>
                    <button class="sf-widget-btn sf-btn-delete">✕</button>
                </div>
                <div class="sf-chart-widget-body">
                    <canvas width="360" height="190"></canvas>
                </div>
            `;

            container.appendChild(widget);
            const canvas = widget.querySelector('canvas');
            this.renderChartCanvas(canvas, config, sheet);

            widget.querySelector('.sf-btn-delete').addEventListener('click', () => {
                widget.remove();
                this.activeCharts.delete(widgetId);
            });

            this.activeCharts.set(widgetId, { widget, canvas, config, sheet });
        }

        renderChartCanvas(canvas, config, sheet) {
            const ctx = canvas.getContext('2d');
            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, w, h);

            // Mock or extract data
            const labels = ['Q1', 'Q2', 'Q3', 'Q4'];
            const values = [140, 220, 310, 420];

            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 12px Inter, sans-serif';
            ctx.fillText(config.title, 14, 20);

            const maxVal = Math.max(...values);
            const chartH = h - 60;
            const barW = 40;
            const gap = 30;

            values.forEach((v, i) => {
                const barH = (v / maxVal) * chartH;
                const x = 40 + i * (barW + gap);
                const y = h - 30 - barH;

                ctx.fillStyle = CHART_PALETTE[i % CHART_PALETTE.length];
                ctx.fillRect(x, y, barW, barH);

                ctx.fillStyle = '#64748b';
                ctx.font = '10px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(labels[i], x + barW / 2, h - 14);
            });
        }

        refreshAllCharts() {
            for (const [id, item] of this.activeCharts.entries()) {
                if (document.body.contains(item.widget)) {
                    this.renderChartCanvas(item.canvas, item.config, item.sheet);
                } else {
                    this.activeCharts.delete(id);
                }
            }
        }
    }

    class FilterManager {
        constructor(grid, eventEmitter) {
            this.grid = grid;
            this.emitter = eventEmitter;
            this._setupDOM();
            this._bindEvents();
        }

        _setupDOM() {
            this.popover = document.createElement('div');
            this.popover.className = 'sf-filter-popover';
            this.popover.style.display = 'none';
            this.popover.innerHTML = `
                <div class="sf-filter-sort-group">
                    <button class="sf-btn sf-btn-sm" id="fpSortAsc">▲ Sort A to Z</button>
                    <button class="sf-btn sf-btn-sm" id="fpSortDesc">▼ Sort Z to A</button>
                </div>
            `;
            document.body.appendChild(this.popover);
        }

        _bindEvents() {
            this.grid.colHeadersTrack.addEventListener('click', (e) => {
                const filterBtn = e.target.closest('.sf-col-filter-btn');
                if (filterBtn) {
                    e.stopPropagation();
                    const col = parseInt(filterBtn.dataset.col, 10);
                    const rect = filterBtn.getBoundingClientRect();
                    this.activeCol = col;
                    this.popover.style.left = `${rect.left}px`;
                    this.popover.style.top = `${rect.bottom + 4}px`;
                    this.popover.style.display = 'block';
                }
            });

            this.popover.querySelector('#fpSortAsc').addEventListener('click', () => {
                if (this.activeCol !== null && this.emitter) {
                    this.emitter.emit('action:sortColumn', { col: this.activeCol, order: 'asc' });
                    this.popover.style.display = 'none';
                }
            });

            this.popover.querySelector('#fpSortDesc').addEventListener('click', () => {
                if (this.activeCol !== null && this.emitter) {
                    this.emitter.emit('action:sortColumn', { col: this.activeCol, order: 'desc' });
                    this.popover.style.display = 'none';
                }
            });

            window.addEventListener('click', (e) => {
                if (!e.target.closest('.sf-filter-popover')) this.popover.style.display = 'none';
            });
        }
    }

    class Modals {
        constructor(eventEmitter) {
            this.emitter = eventEmitter;
            this._setupDOM();
            this._bindEvents();
        }

        _setupDOM() {
            this.container = document.createElement('div');
            this.container.className = 'sf-modals-root';
            this.container.innerHTML = `
                <div class="sf-modal-backdrop" id="modalFindReplace" style="display:none;">
                    <div class="sf-modal-dialog">
                        <div class="sf-modal-header">
                            <h3 class="sf-modal-title">Find and Replace</h3>
                            <button class="sf-modal-close" data-close>✕</button>
                        </div>
                        <div class="sf-modal-body">
                            <div class="sf-form-group">
                                <label>Find</label>
                                <input type="text" class="sf-input" id="frFindInput" placeholder="Find text...">
                            </div>
                            <div class="sf-form-group">
                                <label>Replace with</label>
                                <input type="text" class="sf-input" id="frReplaceInput" placeholder="Replace with...">
                            </div>
                        </div>
                        <div class="sf-modal-footer">
                            <button class="sf-btn sf-btn-secondary" id="frFindNextBtn">Find Next</button>
                            <button class="sf-btn sf-btn-primary" id="frReplaceBtn">Replace</button>
                        </div>
                    </div>
                </div>

                <div class="sf-modal-backdrop" id="modalShortcuts" style="display:none;">
                    <div class="sf-modal-dialog">
                        <div class="sf-modal-header">
                            <h3 class="sf-modal-title">Keyboard Shortcuts</h3>
                            <button class="sf-modal-close" data-close>✕</button>
                        </div>
                        <div class="sf-modal-body">
                            <p style="font-size: 12px; margin-bottom: 6px;"><b>Navigation:</b> Arrow keys, Tab, Enter</p>
                            <p style="font-size: 12px; margin-bottom: 6px;"><b>Editing:</b> F2, Double Click, Esc</p>
                            <p style="font-size: 12px; margin-bottom: 6px;"><b>Shortcuts:</b> Ctrl+C, Ctrl+V, Ctrl+Z, Ctrl+Y, Ctrl+F, Ctrl+B</p>
                        </div>
                        <div class="sf-modal-footer">
                            <button class="sf-btn sf-btn-primary" data-close>Done</button>
                        </div>
                    </div>
                </div>

                <div class="sf-modal-backdrop" id="modalAbout" style="display:none;">
                    <div class="sf-modal-dialog">
                        <div class="sf-modal-header">
                            <h3 class="sf-modal-title">About SheetForge</h3>
                            <button class="sf-modal-close" data-close>✕</button>
                        </div>
                        <div class="sf-modal-body sf-about-body">
                            <div class="sf-about-logo">📊 SheetForge</div>
                            <p><strong>Version:</strong> 2.0.0 Enterprise Productivity Edition</p>
                            <p>A pure client-side spreadsheet engine engineered with vanilla JavaScript. Static hosting compatible with zero backend required.</p>
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
            this.container.querySelectorAll('[data-close]').forEach(btn => {
                btn.addEventListener('click', () => this.closeAll());
            });

            this.container.querySelector('#frFindNextBtn').addEventListener('click', () => {
                const query = this.container.querySelector('#frFindInput').value;
                if (this.emitter) this.emitter.emit('action:findNext', { query });
            });

            this.container.querySelector('#frReplaceBtn').addEventListener('click', () => {
                const query = this.container.querySelector('#frFindInput').value;
                const replacement = this.container.querySelector('#frReplaceInput').value;
                if (this.emitter) this.emitter.emit('action:replace', { query, replacement });
            });
        }

        openFindReplace() {
            this.closeAll();
            this.container.querySelector('#modalFindReplace').style.display = 'flex';
        }

        openShortcuts() {
            this.closeAll();
            this.container.querySelector('#modalShortcuts').style.display = 'flex';
        }

        openAbout() {
            this.closeAll();
            this.container.querySelector('#modalAbout').style.display = 'flex';
        }

        closeAll() {
            this.container.querySelectorAll('.sf-modal-backdrop').forEach(m => m.style.display = 'none');
        }
    }

    class IOManager {
        static parseCSV(text) {
            const rows = [];
            const lines = text.split(/\r?\n/);
            for (const line of lines) {
                if (line.trim()) rows.push(line.split(',').map(s => s.trim().replace(/^"|"$/g, '')));
            }
            return rows;
        }

        static exportSheetToCSV(sheet) {
            if (!sheet) return '';
            const bounds = sheet.getDataBounds();
            const lines = [];
            for (let r = 0; r <= bounds.endRow; r++) {
                const rowVals = [];
                for (let c = 0; c <= bounds.endCol; c++) {
                    const cell = sheet.getCell(r, c);
                    rowVals.push(cell ? `"${String(cell.rawValue || '').replace(/"/g, '""')}"` : '""');
                }
                lines.push(rowVals.join(','));
            }
            return lines.join('\r\n');
        }

        static downloadFile(content, fileName, mimeType = 'text/plain;charset=utf-8') {
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        static openFileDialog(accept = '.csv,text/csv') {
            return new Promise((resolve) => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = accept;
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (!file) { resolve(null); return; }
                    const reader = new FileReader();
                    reader.onload = (evt) => resolve({ name: file.name, content: evt.target.result });
                    reader.onerror = () => resolve(null);
                    reader.readAsText(file);
                };
                input.click();
            });
        }

        static printSpreadsheet() { window.print(); }
    }

    // =========================================================================
    // 9. REALISTIC DEMO DATA
    // =========================================================================
    class DemoData {
        static createDefaultWorkbook() {
            const wb = new Workbook('demo_workbook_1', 'SheetForge Executive Financial Suite');

            // Sheet 1: SaaS Financial Model
            const s1 = wb.addSheet('📊 SaaS Executive Model', { tabColor: '#107c41' });
            s1.setColWidth(0, 240);
            s1.setColWidth(1, 115);
            s1.setColWidth(2, 115);
            s1.setColWidth(3, 115);
            s1.setColWidth(4, 115);
            s1.setColWidth(5, 135);
            s1.setColWidth(6, 115);
            s1.setColWidth(7, 130);

            s1.mergeRange(0, 0, 0, 7);
            s1.setRowHeight(0, 38);
            s1.setCellValue(0, 0, 'SheetForge Executive SaaS Financial Model & Board Dashboard').setStyle({
                bold: true, fontSize: 15, backgroundColor: '#0f172a', color: '#f8fafc', alignH: 'center'
            });

            const headers = ['Financial Metric', 'Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026', 'FY2026 Total', 'Target Growth', 'Board Status'];
            s1.setRowHeight(1, 28);
            headers.forEach((h, c) => {
                s1.setCellValue(1, c, h).setStyle({
                    bold: true, fontSize: 12, backgroundColor: '#1e293b', color: '#ffffff', alignH: c === 0 ? 'left' : 'right'
                });
            });

            s1.setCellValue(2, 0, 'REVENUE & UNIT ECONOMICS').setStyle({ bold: true, fontSize: 11, backgroundColor: '#f1f5f9', color: '#475569' });

            const revMetrics = [
                { name: 'Active Enterprise Subscriptions', q1: 1420, q2: 1680, q3: 2040, q4: 2450, fmt: 'number', dec: 0, isSum: true },
                { name: 'Average Contract Value (ACV)', q1: 12500, q2: 13200, q3: 14000, q4: 15200, fmt: 'currency', dec: 0, isAvg: true },
                { name: 'Annual Recurring Revenue (ARR)', q1: 17750000, q2: 22176000, q3: 28560000, q4: 37240000, fmt: 'currency', dec: 0, isSum: false },
                { name: 'Monthly Recurring Revenue (MRR)', q1: '=B6/12', q2: '=C6/12', q3: '=D6/12', q4: '=E6/12', fmt: 'currency', dec: 0, isAvg: true },
                { name: 'Net Revenue Retention (NRR)', q1: 1.18, q2: 1.21, q3: 1.24, q4: 1.28, fmt: 'percent', dec: 1, isAvg: true },
                { name: 'Gross Margin %', q1: 0.825, q2: 0.835, q3: 0.840, q4: 0.852, fmt: 'percent', dec: 1, isAvg: true }
            ];

            revMetrics.forEach((item, idx) => {
                const r = 3 + idx;
                s1.setRowHeight(r, 26);
                s1.setCellValue(r, 0, item.name);

                ['q1', 'q2', 'q3', 'q4'].forEach((qKey, cIdx) => {
                    const c = 1 + cIdx;
                    const cell = s1.setCellValue(r, c, item[qKey]);
                    cell.numFormat = item.fmt;
                    cell.decimals = item.dec;
                    cell.setStyle({ alignH: 'right' });
                });

                const totFormula = item.isAvg ? `=AVERAGE(B${r + 1}:E${r + 1})` : `=SUM(B${r + 1}:E${r + 1})`;
                const totCell = s1.setCellValue(r, 5, totFormula);
                totCell.numFormat = item.fmt;
                totCell.decimals = item.dec;
                totCell.setStyle({ bold: true, alignH: 'right', backgroundColor: '#f8fafc' });

                const grCell = s1.setCellValue(r, 6, `=(E${r + 1}-B${r + 1})/B${r + 1}`);
                grCell.numFormat = 'percent';
                grCell.decimals = 1;
                grCell.setStyle({ alignH: 'right' });

                const stCell = s1.setCellValue(r, 7, `=IF(G${r + 1}>0.20,"EXCEEDED","ON TRACK")`);
                stCell.setStyle({ alignH: 'center', bold: true, color: '#16a34a' });
            });

            // Sheet 2: Enterprise Sales Pipeline
            const s2 = wb.addSheet('🛒 Enterprise Sales Tracker', { tabColor: '#3b82f6' });
            s2.setColWidth(0, 160);
            s2.setColWidth(1, 160);
            s2.setColWidth(2, 130);
            s2.setColWidth(3, 120);
            s2.setColWidth(4, 110);
            s2.setColWidth(5, 130);
            s2.setColWidth(6, 120);

            s2.mergeRange(0, 0, 0, 6);
            s2.setRowHeight(0, 36);
            s2.setCellValue(0, 0, 'Global Enterprise Sales Pipeline & Forecast').setStyle({
                bold: true, fontSize: 15, backgroundColor: '#1e3a8a', color: '#ffffff', alignH: 'center'
            });

            const s2Headers = ['Account Executive', 'Target Enterprise', 'Region', 'Contract Value', 'Probability', 'Weighted Value', 'Deal Stage'];
            s2.setRowHeight(1, 28);
            s2Headers.forEach((h, c) => {
                s2.setCellValue(1, c, h).setStyle({
                    bold: true, fontSize: 12, backgroundColor: '#2563eb', color: '#ffffff', alignH: c <= 2 ? 'left' : 'right'
                });
            });

            const deals = [
                { rep: 'Alex Rivera', acct: 'Stripe Global', region: 'North America', val: 240000, prob: 0.90, stage: 'Verbal' },
                { rep: 'Sophia Chen', acct: 'ByteDance Ltd', region: 'Asia-Pacific', val: 320000, prob: 0.75, stage: 'Negotiation' },
                { rep: 'Marcus Weber', acct: 'Siemens AG', region: 'Europe West', val: 180000, prob: 0.85, stage: 'Contract Sent' },
                { rep: 'David Kim', acct: 'Datadog Inc', region: 'North America', val: 410000, prob: 0.95, stage: 'Closed Won' }
            ];

            deals.forEach((d, idx) => {
                const r = 2 + idx;
                s2.setRowHeight(r, 26);
                s2.setCellValue(r, 0, d.rep);
                s2.setCellValue(r, 1, d.acct);
                s2.setCellValue(r, 2, d.region);

                const vCell = s2.setCellValue(r, 3, d.val);
                vCell.numFormat = 'currency';
                vCell.decimals = 0;
                vCell.setStyle({ alignH: 'right' });

                const pCell = s2.setCellValue(r, 4, d.prob);
                pCell.numFormat = 'percent';
                pCell.decimals = 0;
                pCell.setStyle({ alignH: 'right' });

                const wCell = s2.setCellValue(r, 5, `=D${r + 1}*E${r + 1}`);
                wCell.numFormat = 'currency';
                wCell.decimals = 0;
                wCell.setStyle({ bold: true, alignH: 'right' });

                s2.setCellValue(r, 6, d.stage).setStyle({ alignH: 'center', bold: true });
            });

            wb.activeSheetId = s1.id;
            return wb;
        }
    }

    // =========================================================================
    // 10. MAIN APP ORCHESTRATOR
    // =========================================================================
    class SetCellValueCommand extends Command {
        constructor(sheet, row, col, newValue, oldCellState, app) {
            super();
            this.sheet = sheet;
            this.row = row;
            this.col = col;
            this.newValue = newValue;
            this.oldCellState = oldCellState ? oldCellState.clone() : null;
            this.app = app;
        }

        execute() {
            const cell = this.sheet.getCell(this.row, this.col, true);
            cell.setValue(this.newValue);
            this.app.onCellModified(this.sheet, this.row, this.col);
        }

        undo() {
            if (this.oldCellState) {
                this.sheet.setCell(this.row, this.col, this.oldCellState.clone());
            } else {
                this.sheet.deleteCell(this.row, this.col);
            }
            this.app.onCellModified(this.sheet, this.row, this.col);
        }
    }

    class SetCellStyleCommand extends Command {
        constructor(sheet, range, newStyle, oldStyles, app) {
            super();
            this.sheet = sheet;
            this.range = range;
            this.newStyle = newStyle;
            this.oldStyles = oldStyles;
            this.app = app;
        }

        execute() {
            const { startRow, startCol, endRow, endCol } = this.range;
            for (let r = startRow; r <= endRow; r++) {
                for (let c = startCol; c <= endCol; c++) {
                    const cell = this.sheet.getCell(r, c, true);
                    cell.setStyle(this.newStyle);
                }
            }
            this.app.grid.renderVirtual();
            this.app.scheduleAutoSave();
        }

        undo() {
            for (const [key, st] of this.oldStyles.entries()) {
                const [r, c] = key.split(',').map(Number);
                const cell = this.sheet.getCell(r, c);
                if (cell) cell.style = JSON.parse(JSON.stringify(st));
            }
            this.app.grid.renderVirtual();
            this.app.scheduleAutoSave();
        }
    }

    class SheetForgeApp {
        constructor() {
            this.emitter = new EventEmitter();
            this.storage = new Storage();
            this.commandManager = new CommandManager(100, this.emitter);
            this.evaluator = new Evaluator();
            this.dependencyGraph = new DependencyGraph();

            this.workbook = null;
            this.activeSheet = null;
            this.saveTimeout = null;
            this.internalClipboard = null;

            this._setupTheme();
        }

        async init() {
            const savedData = await this.storage.loadWorkbook('default_workbook');
            if (savedData && savedData.sheets && savedData.sheets.length > 0) {
                try {
                    this.workbook = Workbook.fromJSON(savedData);
                } catch (e) {
                    this.workbook = DemoData.createDefaultWorkbook();
                }
            } else {
                this.workbook = DemoData.createDefaultWorkbook();
            }

            this.activeSheet = this.workbook.getActiveSheet();
            this.evaluator.setWorkbook(this.workbook);
            this.dependencyGraph.buildGraph(this.workbook);
            this.recalculateAllSheets();

            this._initUI();
            this._bindAppEvents();
            this._bindKeyboardShortcuts();

            this.switchSheet(this.activeSheet.id);
            this._updateDocTitle();
        }

        _setupTheme() {
            const savedTheme = localStorage.getItem('sheetforge_theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);

            const themeToggleBtn = document.getElementById('btnThemeToggle');
            if (themeToggleBtn) {
                themeToggleBtn.innerText = savedTheme === 'dark' ? '☀️' : '🌙';
                themeToggleBtn.addEventListener('click', () => {
                    const current = document.documentElement.getAttribute('data-theme');
                    const next = current === 'dark' ? 'light' : 'dark';
                    document.documentElement.setAttribute('data-theme', next);
                    localStorage.setItem('sheetforge_theme', next);
                    themeToggleBtn.innerText = next === 'dark' ? '☀️' : '🌙';
                    Toast.info(`Switched to ${next} mode`);
                });
            }
        }

        _initUI() {
            const gridContainer = document.getElementById('sfGridContainer');
            this.grid = new VirtualGrid(gridContainer, { evaluator: this.evaluator });
            this.selection = new SelectionManager(this.grid, this.emitter);
            this.dragManager = new DragManager(this.grid, this.selection, this.emitter, (updates, targetRange) => {
                this.applyAutoFillUpdates(updates, targetRange);
            });
            this.cellEditor = new CellEditor(this.grid, this.selection, this.emitter, (r, c, val) => {
                this.commitCellValue(r, c, val);
            });

            this.noteTooltip = new NoteTooltip(this.grid);
            this.menuBar = new MenuBar(document.getElementById('sfMenuBarContainer'), this.emitter);
            this.toolbar = new Toolbar(document.getElementById('sfToolbarContainer'), this.emitter);
            this.formulaBar = new FormulaBar(document.getElementById('sfFormulaBarContainer'), this.emitter);
            this.sheetTabs = new SheetTabs(document.getElementById('sfSheetTabsContainer'), this.emitter);
            this.sidebar = new Sidebar(document.getElementById('sfSidebarContainer'), this.emitter);
            this.statusBar = new StatusBar(document.getElementById('sfStatusBarContainer'), this.emitter);
            this.chartManager = new ChartManager(document.getElementById('sfChartLayer'), this.emitter);
            this.filterManager = new FilterManager(this.grid, this.emitter);
            this.modals = new Modals(this.emitter);

            this.sheetTabs.setWorkbook(this.workbook);

            const titleEl = document.getElementById('sfDocTitle');
            if (titleEl) {
                titleEl.addEventListener('blur', () => {
                    const val = titleEl.innerText.trim();
                    if (val) {
                        this.workbook.title = val;
                        this.scheduleAutoSave();
                        Toast.success('Spreadsheet renamed');
                    }
                });
                titleEl.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') { e.preventDefault(); titleEl.blur(); }
                });
            }
        }

        _updateDocTitle() {
            const titleEl = document.getElementById('sfDocTitle');
            if (titleEl && this.workbook) {
                titleEl.innerText = this.workbook.title || 'Untitled Spreadsheet';
            }
        }

        _bindAppEvents() {
            this.emitter.on('action:menu', (action) => this.handleMenuAction(action));
            this.emitter.on('action:undo', () => this.commandManager.undo());
            this.emitter.on('action:redo', () => this.commandManager.redo());

            this.emitter.on('format:toggleBold', () => this.toggleFormat('bold'));
            this.emitter.on('format:toggleItalic', () => this.toggleFormat('italic'));
            this.emitter.on('format:toggleUnderline', () => this.toggleFormat('underline'));
            this.emitter.on('format:toggleStrike', () => this.toggleFormat('strikethrough'));
            this.emitter.on('format:toggleWrap', () => this.toggleFormat('wrapText'));
            this.emitter.on('format:alignH', (align) => this.applyFormat({ alignH: align }));
            this.emitter.on('format:fontFamily', (font) => this.applyFormat({ fontFamily: font }));
            this.emitter.on('format:fontSize', (size) => this.applyFormat({ fontSize: size }));
            this.emitter.on('format:color', (color) => this.applyFormat({ color }));
            this.emitter.on('format:backgroundColor', (bg) => this.applyFormat({ backgroundColor: bg }));
            this.emitter.on('format:numFormat', (fmt) => this.applyNumberFormat(fmt));
            this.emitter.on('format:toggleMerge', () => this.toggleMergeSelection());
            this.emitter.on('format:border', (type) => this.applyBorder(type));

            this.emitter.on('grid:resizeCol', ({ col, width }) => {
                this.activeSheet.setColWidth(col, width);
                this.grid.recalculateDimensions();
                this.grid.renderAll();
                this.selection.updateOverlays();
                this.scheduleAutoSave();
            });

            this.emitter.on('grid:resizeRow', ({ row, height }) => {
                this.activeSheet.setRowHeight(row, height);
                this.grid.recalculateDimensions();
                this.grid.renderAll();
                this.selection.updateOverlays();
                this.scheduleAutoSave();
            });

            this.emitter.on('grid:zoom', (scale) => {
                this.grid.canvas.style.transform = `scale(${scale})`;
                this.grid.canvas.style.transformOrigin = 'top left';
            });

            this.emitter.on('formulabar:input', ({ value }) => {
                if (!this.cellEditor.isEditing) {
                    this.cellEditor.startEditing(this.selection.activeCell.row, this.selection.activeCell.col, value);
                } else {
                    this.cellEditor.setEditorValue(value);
                }
            });

            this.emitter.on('formulabar:commit', ({ value }) => {
                this.commitCellValue(this.selection.activeCell.row, this.selection.activeCell.col, value);
                this.cellEditor.commitEdit();
            });

            this.emitter.on('formulabar:cancel', () => this.cellEditor.cancelEdit());

            this.emitter.on('action:switchSheet', (sheetId) => this.switchSheet(sheetId));
            this.emitter.on('action:addSheet', () => this.addNewSheet());
            this.emitter.on('action:renameSheet', ({ sheetId, newName }) => this.renameSheet(sheetId, newName));

            this.emitter.on('action:toggleSidebar', () => this.sidebar.toggle());
            this.emitter.on('action:insertChart', () => {
                const addr = this.selection.getSelectedRangeAddress();
                this.chartManager.openModal(typeof addr === 'string' ? addr : addr.address);
            });

            this.emitter.on('action:createChartWidget', (config) => {
                this.chartManager.createFloatingChartWidget(config, this.activeSheet, document.getElementById('sfChartLayer'));
                Toast.success('Chart inserted');
            });

            this.emitter.on('action:sort', (order) => this.sortSelection(order));
            this.emitter.on('action:sortColumn', ({ col, order }) => this.sortColumn(col, order));
            this.emitter.on('action:toggleFilter', () => this.toggleFilter());

            this.emitter.on('cell:saveNote', (noteText) => {
                const cell = this.activeSheet.getCell(this.selection.activeCell.row, this.selection.activeCell.col, true);
                cell.comment = noteText;
                this.grid.renderVirtual();
                this.scheduleAutoSave();
                Toast.success(noteText ? 'Note saved' : 'Note removed');
            });

            this.emitter.on('grid:selectCell', ({ row, col }) => {
                this.selection.selectCell(row, col);
                this.grid.scrollToCell(row, col);
            });
        }

        _bindKeyboardShortcuts() {
            window.addEventListener('keydown', (e) => {
                if (e.target.closest('.sf-modal-backdrop') || e.target.closest('.sf-filter-popover') || e.target.closest('#sfDocTitle')) return;
                if (this.cellEditor.isEditing) return;

                const isCtrl = e.ctrlKey || e.metaKey;

                if (isCtrl && (e.key === 'z' || e.key === 'Z')) {
                    e.preventDefault();
                    if (e.shiftKey) this.commandManager.redo();
                    else this.commandManager.undo();
                    return;
                }

                if (isCtrl && (e.key === 'y' || e.key === 'Y')) {
                    e.preventDefault();
                    this.commandManager.redo();
                    return;
                }

                if (isCtrl && (e.key === 'c' || e.key === 'C')) {
                    e.preventDefault();
                    this.copySelection(false);
                    return;
                }

                if (isCtrl && (e.key === 'v' || e.key === 'V')) {
                    e.preventDefault();
                    this.pasteClipboard(e.shiftKey);
                    return;
                }

                if (isCtrl && (e.key === 'b' || e.key === 'B')) {
                    e.preventDefault();
                    this.toggleFormat('bold');
                    return;
                }

                if (isCtrl && (e.key === 'i' || e.key === 'I')) {
                    e.preventDefault();
                    this.toggleFormat('italic');
                    return;
                }

                if (isCtrl && (e.key === 'u' || e.key === 'U')) {
                    e.preventDefault();
                    this.toggleFormat('underline');
                    return;
                }

                if (isCtrl && (e.key === 'f' || e.key === 'F')) {
                    e.preventDefault();
                    this.modals.openFindReplace();
                    return;
                }

                if (isCtrl && e.key === '\\') {
                    e.preventDefault();
                    this.sidebar.toggle();
                    return;
                }

                if (isCtrl && (e.key === 'a' || e.key === 'A')) {
                    e.preventDefault();
                    this.selection.selectAll();
                    return;
                }

                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                    const dRow = e.key === 'ArrowDown' ? 1 : (e.key === 'ArrowUp' ? -1 : 0);
                    const dCol = e.key === 'ArrowRight' ? 1 : (e.key === 'ArrowLeft' ? -1 : 0);
                    this.selection.moveActiveCell(dRow, dCol, e.shiftKey);
                    return;
                }

                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.selection.moveActiveCell(e.shiftKey ? -1 : 1, 0);
                    return;
                }

                if (e.key === 'Tab') {
                    e.preventDefault();
                    this.selection.moveActiveCell(0, e.shiftKey ? -1 : 1);
                    return;
                }

                if (e.key === 'F2') {
                    e.preventDefault();
                    this.cellEditor.startEditing(this.selection.activeCell.row, this.selection.activeCell.col);
                    return;
                }

                if (e.key === 'Delete' || e.key === 'Backspace') {
                    e.preventDefault();
                    this.clearSelectionContents();
                    return;
                }

                if (e.key.length === 1 && !isCtrl && !e.altKey) {
                    this.cellEditor.startEditing(this.selection.activeCell.row, this.selection.activeCell.col, e.key);
                }
            });
        }

        switchSheet(sheetId) {
            if (!this.workbook) return;
            this.workbook.setActiveSheet(sheetId);
            this.activeSheet = this.workbook.getActiveSheet();

            this.grid.setSheet(this.activeSheet);
            this.selection.selectCell(0, 0);
            this.sheetTabs.renderTabs();
            this.chartManager.refreshAllCharts();
        }

        addNewSheet(name = null) {
            const newSheet = this.workbook.addSheet(name);
            this.switchSheet(newSheet.id);
            this.scheduleAutoSave();
            Toast.success(`Created worksheet "${newSheet.name}"`);
        }

        renameSheet(sheetId, newName) {
            try {
                this.workbook.renameSheet(sheetId, newName);
                this.sheetTabs.renderTabs();
                this.scheduleAutoSave();
                Toast.success(`Renamed sheet to "${newName}"`);
            } catch (e) {
                Toast.error(e.message);
            }
        }

        commitCellValue(r, c, val) {
            const cell = this.activeSheet.getCell(r, c);
            const oldState = cell ? cell.clone() : null;
            const cmd = new SetCellValueCommand(this.activeSheet, r, c, val, oldState, this);
            this.commandManager.execute(cmd);
        }

        onCellModified(sheet, r, c) {
            const cell = sheet.getCell(r, c);
            this.dependencyGraph.updateCell(sheet, r, c, cell ? cell.formula : '');
            const nodeKey = this.dependencyGraph.makeKey(sheet.id, r, c);
            this.dependencyGraph.recalculate([nodeKey], this.evaluator);

            this.grid.renderVirtual();
            this.selection.updateOverlays();
            this.emitter.emit('data:recalculated');
            this.scheduleAutoSave();
        }

        recalculateAllSheets() {
            if (!this.workbook) return;
            for (const sheet of this.workbook.sheets) {
                for (const cell of sheet.cells.values()) {
                    if (cell.isFormula) {
                        const res = this.evaluator.evaluateFormula(cell.formula, sheet, cell);
                        if (typeof res === 'string' && res.startsWith('#')) {
                            cell.error = res;
                            cell.computedValue = null;
                        } else {
                            cell.error = null;
                            cell.computedValue = res;
                        }
                    }
                }
            }
        }

        applyAutoFillUpdates(updates, targetRange) {
            if (!updates || updates.length === 0) return;
            const batch = new BatchCommand([], 'AutoFill');
            for (const up of updates) {
                const oldCell = this.activeSheet.getCell(up.row, up.col);
                const cmd = new SetCellValueCommand(this.activeSheet, up.row, up.col, up.formula || up.rawValue, oldCell, this);
                batch.add(cmd);
            }
            this.commandManager.execute(batch);
            this.selection.expandSelectionTo(targetRange.endRow, targetRange.endCol);
            Toast.info(`Autofilled ${updates.length} cells`);
        }

        toggleFormat(styleProp) {
            const activeCell = this.activeSheet.getCell(this.selection.activeCell.row, this.selection.activeCell.col);
            const currentVal = activeCell ? activeCell.style[styleProp] : false;
            this.applyFormat({ [styleProp]: !currentVal });
        }

        applyFormat(styleObj) {
            const range = this.selection.selectionRange;
            const oldStyles = new Map();
            for (let r = range.startRow; r <= range.endRow; r++) {
                for (let c = range.startCol; c <= range.endCol; c++) {
                    const cell = this.activeSheet.getCell(r, c, true);
                    oldStyles.set(`${r},${c}`, JSON.parse(JSON.stringify(cell.style)));
                }
            }
            const cmd = new SetCellStyleCommand(this.activeSheet, range, styleObj, oldStyles, this);
            this.commandManager.execute(cmd);
        }

        applyNumberFormat(fmt) {
            const range = this.selection.selectionRange;
            for (let r = range.startRow; r <= range.endRow; r++) {
                for (let c = range.startCol; c <= range.endCol; c++) {
                    const cell = this.activeSheet.getCell(r, c, true);
                    cell.numFormat = fmt;
                }
            }
            this.grid.renderVirtual();
            this.scheduleAutoSave();
            Toast.info(`Applied "${fmt}" format`);
        }

        applyBorder(borderType) {
            const range = this.selection.selectionRange;
            const color = '#94a3b8';
            for (let r = range.startRow; r <= range.endRow; r++) {
                for (let c = range.startCol; c <= range.endCol; c++) {
                    const cell = this.activeSheet.getCell(r, c, true);
                    const b = { ...(cell.style.borders || {}) };
                    if (borderType === 'all') {
                        b.top = { width: 1, color, style: 'solid' };
                        b.bottom = { width: 1, color, style: 'solid' };
                        b.left = { width: 1, color, style: 'solid' };
                        b.right = { width: 1, color, style: 'solid' };
                    } else if (borderType === 'none') {
                        b.top = null; b.bottom = null; b.left = null; b.right = null;
                    }
                    cell.setStyle({ borders: b });
                }
            }
            this.grid.renderVirtual();
            this.scheduleAutoSave();
        }

        toggleMergeSelection() {
            const range = this.selection.selectionRange;
            const cell = this.activeSheet.getCell(range.startRow, range.startCol);
            if (cell && cell.mergeInfo && cell.mergeInfo.isMerged) {
                this.activeSheet.unmergeRange(range.startRow, range.startCol, range.endRow, range.endCol);
                Toast.info('Unmerged cells');
            } else {
                this.activeSheet.mergeRange(range.startRow, range.startCol, range.endRow, range.endCol);
                Toast.success('Merged cells');
            }
            this.grid.renderVirtual();
            this.selection.updateOverlays();
            this.scheduleAutoSave();
        }

        copySelection(isCut = false) {
            const range = this.selection.selectionRange;
            const matrix = [];
            for (let r = range.startRow; r <= range.endRow; r++) {
                const rowArr = [];
                for (let c = range.startCol; c <= range.endCol; c++) {
                    const cell = this.activeSheet.getCell(r, c);
                    rowArr.push(cell ? cell.clone() : null);
                }
                matrix.push(rowArr);
            }
            this.internalClipboard = { cells: matrix, range: { ...range }, sheetId: this.activeSheet.id, isCut };
            this.selection.setClipboard(range, isCut);
            Toast.info(isCut ? 'Cut to clipboard' : 'Copied to clipboard');
        }

        pasteClipboard(valuesOnly = false) {
            if (!this.internalClipboard) {
                Toast.warning('Clipboard is empty');
                return;
            }
            const { cells, isCut, range: srcRange, sheetId: srcSheetId } = this.internalClipboard;
            const targetR = this.selection.activeCell.row;
            const targetC = this.selection.activeCell.col;

            const batch = new BatchCommand([], 'Paste');
            for (let r = 0; r < cells.length; r++) {
                for (let c = 0; c < cells[r].length; c++) {
                    const srcCell = cells[r][c];
                    const destR = targetR + r;
                    const destC = targetC + c;
                    const oldDest = this.activeSheet.getCell(destR, destC);
                    let val = srcCell ? (valuesOnly ? (srcCell.displayValue || srcCell.rawValue) : (srcCell.formula || srcCell.rawValue)) : '';
                    batch.add(new SetCellValueCommand(this.activeSheet, destR, destC, val, oldDest, this));
                }
            }

            if (isCut) {
                const srcSheet = this.workbook.getSheetById(srcSheetId);
                if (srcSheet) {
                    for (let r = srcRange.startRow; r <= srcRange.endRow; r++) {
                        for (let c = srcRange.startCol; c <= srcRange.endCol; c++) {
                            const old = srcSheet.getCell(r, c);
                            batch.add(new SetCellValueCommand(srcSheet, r, c, '', old, this));
                        }
                    }
                }
                this.selection.clearClipboard();
                this.internalClipboard = null;
            }

            this.commandManager.execute(batch);
            this.selection.expandSelectionTo(targetR + cells.length - 1, targetC + cells[0].length - 1);
            Toast.success('Pasted');
        }

        clearSelectionContents() {
            const range = this.selection.selectionRange;
            const batch = new BatchCommand([], 'Clear Contents');
            for (let r = range.startRow; r <= range.endRow; r++) {
                for (let c = range.startCol; c <= range.endCol; c++) {
                    const cell = this.activeSheet.getCell(r, c);
                    if (cell && (cell.rawValue !== '' || cell.formula)) {
                        batch.add(new SetCellValueCommand(this.activeSheet, r, c, '', cell, this));
                    }
                }
            }
            this.commandManager.execute(batch);
            Toast.info('Contents cleared');
        }

        sortSelection(order = 'asc') {
            const sel = this.selection.selectionRange;
            this.sortRange(this.activeSheet, sel, sel.startCol, order);
            Toast.success(`Sorted range ${order === 'asc' ? 'A to Z' : 'Z to A'}`);
        }

        sortColumn(col, order = 'asc') {
            const bounds = this.activeSheet.getDataBounds();
            const startRow = this.activeSheet.filterRange ? this.activeSheet.filterRange.startRow + 1 : 0;
            const range = { startRow, startCol: bounds.startCol, endRow: bounds.endRow, endCol: bounds.endCol };
            this.sortRange(this.activeSheet, range, col, order);
            Toast.success(`Sorted column ${order === 'asc' ? 'A to Z' : 'Z to A'}`);
        }

        sortRange(sheet, range, sortColIndex, order = 'asc') {
            const rowsData = [];
            for (let r = range.startRow; r <= range.endRow; r++) {
                const rowCells = [];
                for (let c = range.startCol; c <= range.endCol; c++) rowCells.push(sheet.getCell(r, c));
                rowsData.push({ rowIdx: r, cells: rowCells });
            }

            const colOffset = sortColIndex - range.startCol;
            rowsData.sort((a, b) => {
                const cellA = a.cells[colOffset];
                const cellB = b.cells[colOffset];
                const valA = cellA ? (cellA.numericValue !== null ? cellA.numericValue : cellA.rawValue) : '';
                const valB = cellB ? (cellB.numericValue !== null ? cellB.numericValue : cellB.rawValue) : '';

                if (valA === valB) return 0;
                if (valA === '' || valA === null) return 1;
                if (valB === '' || valB === null) return -1;

                if (typeof valA === 'number' && typeof valB === 'number') {
                    return order === 'asc' ? valA - valB : valB - valA;
                }
                const strA = String(valA).toLowerCase();
                const strB = String(valB).toLowerCase();
                return order === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
            });

            for (let i = 0; i < rowsData.length; i++) {
                const targetR = range.startRow + i;
                const srcCells = rowsData[i].cells;
                for (let c = 0; c < srcCells.length; c++) {
                    const targetC = range.startCol + c;
                    const cell = srcCells[c];
                    sheet.setCellValue(targetR, targetC, cell ? (cell.formula || cell.rawValue) : '');
                }
            }

            this.grid.renderVirtual();
            this.scheduleAutoSave();
        }

        toggleFilter() {
            if (this.activeSheet.filterRange) {
                this.activeSheet.filterRange = null;
                this.activeSheet.hiddenRows.clear();
                Toast.info('Filters removed');
            } else {
                const sel = this.selection.selectionRange;
                this.activeSheet.filterRange = { startRow: sel.startRow, startCol: sel.startCol, endRow: sel.endRow, endCol: sel.endCol };
                Toast.success('Filter enabled');
            }
            this.grid.renderAll();
            this.scheduleAutoSave();
        }

        handleMenuAction(action) {
            switch (action) {
                case 'file:new':
                    if (confirm('Create new blank spreadsheet?')) {
                        this.workbook = new Workbook('default_workbook', 'Untitled Spreadsheet');
                        this.workbook.addSheet('Sheet1');
                        this.switchSheet(this.workbook.activeSheetId);
                        this.scheduleAutoSave();
                        Toast.success('New spreadsheet created');
                    }
                    break;
                case 'file:save':
                    this.saveImmediately();
                    Toast.success('Saved to local storage');
                    break;
                case 'file:exportCsv':
                    IOManager.downloadFile(IOManager.exportSheetToCSV(this.activeSheet), `${this.activeSheet.name}.csv`, 'text/csv;');
                    Toast.success(`Exported ${this.activeSheet.name}.csv`);
                    break;
                case 'file:exportJson':
                    IOManager.downloadFile(JSON.stringify(this.workbook.toJSON(), null, 2), 'workbook.json', 'application/json');
                    Toast.success('Exported JSON');
                    break;
                case 'file:print':
                    IOManager.printSpreadsheet();
                    break;
                case 'edit:undo': this.commandManager.undo(); break;
                case 'edit:redo': this.commandManager.redo(); break;
                case 'edit:cut': this.copySelection(true); break;
                case 'edit:copy': this.copySelection(false); break;
                case 'edit:paste': this.pasteClipboard(false); break;
                case 'edit:pasteValues': this.pasteClipboard(true); break;
                case 'edit:find': this.modals.openFindReplace(); break;
                case 'edit:clearContents': this.clearSelectionContents(); break;
                case 'view:toggleSidebar': this.sidebar.toggle(); break;
                case 'view:zoom100': this.statusBar.setZoom(100); break;
                case 'insert:chart':
                    this.chartManager.openModal(this.selection.getSelectedRangeAddress().address || 'A1:B5');
                    break;
                case 'insert:sheet': this.addNewSheet(); break;
                case 'format:bold': this.toggleFormat('bold'); break;
                case 'format:italic': this.toggleFormat('italic'); break;
                case 'format:underline': this.toggleFormat('underline'); break;
                case 'format:merge': this.toggleMergeSelection(); break;
                case 'data:sortAsc': this.sortSelection('asc'); break;
                case 'data:sortDesc': this.sortSelection('desc'); break;
                case 'data:toggleFilter': this.toggleFilter(); break;
                case 'help:shortcuts': this.modals.openShortcuts(); break;
                case 'help:about': this.modals.openAbout(); break;
                case 'help:demoData':
                    if (confirm('Reload executive demo financial models?')) {
                        this.workbook = DemoData.createDefaultWorkbook();
                        this.switchSheet(this.workbook.activeSheetId);
                        this.scheduleAutoSave();
                        Toast.success('Executive models loaded');
                    }
                    break;
            }
        }

        scheduleAutoSave() {
            this._setSaveBadge('Saving...');
            clearTimeout(this.saveTimeout);
            this.saveTimeout = setTimeout(() => this.saveImmediately(), 400);
        }

        async saveImmediately() {
            if (!this.workbook) return;
            await this.storage.saveWorkbook(this.workbook.toJSON());
            this._setSaveBadge('Saved to browser');
        }

        _setSaveBadge(statusText) {
            const badge = document.getElementById('sfSaveStatus');
            if (badge) {
                badge.innerText = statusText;
                badge.className = `sf-save-badge ${statusText.includes('Saving') ? 'sf-saving' : 'sf-saved'}`;
            }
        }
    }

    // Auto-bootstrap
    function startApp() {
        if (!window.sheetForge) {
            window.sheetForge = new SheetForgeApp();
            window.sheetForge.init();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startApp);
    } else {
        startApp();
    }
})();
