/**
 * SheetForge - Complete Standalone Productivity Engine Bundle
 * 100% pure client-side vanilla JavaScript.
 * Runs seamlessly on both file:// (local double-click) and http(s):// (GitHub Pages / Web Server).
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. CORE: EventEmitter
    // =========================================================================
    class EventEmitter {
        constructor() {
            this.events = new Map();
        }

        on(event, listener) {
            if (!this.events.has(event)) {
                this.events.set(event, new Set());
            }
            this.events.get(event).add(listener);
            return () => this.off(event, listener);
        }

        once(event, listener) {
            const wrapper = (...args) => {
                this.off(event, wrapper);
                listener(...args);
            };
            return this.on(event, wrapper);
        }

        off(event, listener) {
            if (this.events.has(event)) {
                this.events.get(event).delete(listener);
                if (this.events.get(event).size === 0) {
                    this.events.delete(event);
                }
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

        clear() {
            this.events.clear();
        }
    }

    // =========================================================================
    // 2. CORE: Storage (IndexedDB + localStorage fallback)
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
            if (!('indexedDB' in window)) {
                return null;
            }

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

                    request.onerror = () => {
                        resolve(null);
                    };
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
    // 3. CORE: Command Pattern (Undo / Redo)
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

        add(command) {
            this.commands.push(command);
        }

        execute() {
            for (let i = 0; i < this.commands.length; i++) {
                this.commands[i].execute();
            }
        }

        undo() {
            for (let i = this.commands.length - 1; i >= 0; i--) {
                this.commands[i].undo();
            }
        }

        redo() {
            for (let i = 0; i < this.commands.length; i++) {
                this.commands[i].redo();
            }
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
                if (this.undoStack.length > this.maxHistory) {
                    this.undoStack.shift();
                }
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
    // 4. UI: Toast Notifications
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

    // =========================================================================
    // 5. MODEL: Cell, Sheet, Workbook
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
    // 6. ENGINE: Tokenizer, Parser, Evaluator, Formatter, AutoFill, DependencyGraph
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

    // Export to global scope for module / bundle use
    window.SheetForge = {
        EventEmitter, Storage, CommandManager, BatchCommand, Command,
        Cell, Sheet, Workbook,
        Tokenizer, Parser, Evaluator, Formatter, AutoFill, DependencyGraph,
        Toast, DEFAULT_CELL_STYLE
    };
})();
