/**
 * SheetForge - Sheet Model
 * Represents a single worksheet with grid data, formatting, dimensions, merges, filters, frozen panes
 */
import { Cell } from './Cell.js';

export const DEFAULT_ROW_COUNT = 100;
export const DEFAULT_COL_COUNT = 26; // A - Z
export const DEFAULT_ROW_HEIGHT = 26; // px
export const DEFAULT_COL_WIDTH = 100; // px
export const MIN_ROW_HEIGHT = 18;
export const MIN_COL_WIDTH = 30;

export function colIndexToLetter(colIndex) {
    let letter = '';
    let temp = colIndex + 1;
    while (temp > 0) {
        let remainder = (temp - 1) % 26;
        letter = String.fromCharCode(65 + remainder) + letter;
        temp = Math.floor((temp - 1) / 26);
    }
    return letter;
}

export function letterToColIndex(letter) {
    let col = 0;
    const clean = letter.toUpperCase().trim();
    for (let i = 0; i < clean.length; i++) {
        col = col * 26 + (clean.charCodeAt(i) - 64);
    }
    return col - 1;
}

export function parseCellAddress(addr) {
    if (!addr || typeof addr !== 'string') return null;
    const match = addr.trim().match(/^(\$)?([A-Za-z]+)(\$)?([0-9]+)$/);
    if (!match) return null;
    const colStr = match[2];
    const rowStr = match[4];
    return {
        col: letterToColIndex(colStr),
        row: parseInt(rowStr, 10) - 1,
        absCol: Boolean(match[1]),
        absRow: Boolean(match[3]),
        text: addr
    };
}

export function formatCellAddress(row, col, absRow = false, absCol = false) {
    const colStr = colIndexToLetter(col);
    const rowStr = String(row + 1);
    return `${absCol ? '$' : ''}${colStr}${absRow ? '$' : ''}${rowStr}`;
}

export class Sheet {
    constructor(id, name, options = {}) {
        this.id = id || `sheet_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        this.name = name || 'Sheet1';
        this.rowCount = options.rowCount || DEFAULT_ROW_COUNT;
        this.colCount = options.colCount || DEFAULT_COL_COUNT;
        this.tabColor = options.tabColor || null;
        
        // Sparse matrix of cells keyed by "row,col"
        this.cells = new Map();
        
        // Dimensions
        this.rowHeights = new Map(options.rowHeights ? Object.entries(options.rowHeights).map(([k, v]) => [Number(k), Number(v)]) : []);
        this.colWidths = new Map(options.colWidths ? Object.entries(options.colWidths).map(([k, v]) => [Number(k), Number(v)]) : []);
        
        // Merged regions: array of { startRow, startCol, endRow, endCol }
        this.merges = options.merges || [];
        
        // Hidden rows and cols sets
        this.hiddenRows = new Set(options.hiddenRows || []);
        this.hiddenCols = new Set(options.hiddenCols || []);
        
        // Frozen panes
        this.frozenRows = options.frozenRows || 0;
        this.frozenCols = options.frozenCols || 0;
        
        // Filters & Sorting state
        this.filterRange = options.filterRange || null; // { startRow, startCol, endRow, endCol, criteria: { [colIndex]: { values: Set, condition: {} } } }
        this.conditionalFormats = options.conditionalFormats || []; // [ { range: {...}, rule: {...} } ]
        this.charts = options.charts || []; // Embedded chart metadata

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
                const item = cellsData[key];
                const cell = Cell.fromJSON(item);
                this.cells.set(`${cell.row},${cell.col}`, cell);
            }
        }
    }

    cellKey(r, c) {
        return `${r},${c}`;
    }

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
        const key = this.cellKey(r, c);
        cell.row = r;
        cell.col = c;
        this.cells.set(key, cell);
        if (r >= this.rowCount) this.rowCount = r + 1;
        if (c >= this.colCount) this.colCount = c + 1;
    }

    setCellValue(r, c, value) {
        const cell = this.getCell(r, c, true);
        cell.setValue(value);
        return cell;
    }

    deleteCell(r, c) {
        const key = this.cellKey(r, c);
        this.cells.delete(key);
    }

    getRowHeight(r) {
        if (this.hiddenRows.has(r)) return 0;
        return this.rowHeights.get(r) || DEFAULT_ROW_HEIGHT;
    }

    setRowHeight(r, height) {
        const h = Math.max(MIN_ROW_HEIGHT, Math.round(height));
        this.rowHeights.set(r, h);
    }

    getColWidth(c) {
        if (this.hiddenCols.has(c)) return 0;
        return this.colWidths.get(c) || DEFAULT_COL_WIDTH;
    }

    setColWidth(c, width) {
        const w = Math.max(MIN_COL_WIDTH, Math.round(width));
        this.colWidths.set(c, w);
    }

    // Merged Cells Management
    mergeRange(startRow, startCol, endRow, endCol) {
        const r1 = Math.min(startRow, endRow);
        const r2 = Math.max(startRow, endRow);
        const c1 = Math.min(startCol, endCol);
        const c2 = Math.max(startCol, endCol);

        if (r1 === r2 && c1 === c2) return;

        // Remove any overlapping merges
        this.unmergeRange(r1, c1, r2, c2);

        const mergeObj = {
            startRow: r1,
            startCol: c1,
            endRow: r2,
            endCol: c2,
            rowSpan: r2 - r1 + 1,
            colSpan: c2 - c1 + 1
        };
        this.merges.push(mergeObj);

        for (let r = r1; r <= r2; r++) {
            for (let c = c1; c <= c2; c++) {
                const cell = this.getCell(r, c, true);
                const isMaster = (r === r1 && c === c1);
                cell.mergeInfo = {
                    isMerged: true,
                    isMaster,
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

    getMergeForCell(r, c) {
        const cell = this.getCell(r, c);
        if (cell && cell.mergeInfo && cell.mergeInfo.isMerged) {
            return cell.mergeInfo;
        }
        return null;
    }

    // Row / Column Structure Modifications
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

        // Shift row heights
        const newHeights = new Map();
        for (const [r, h] of this.rowHeights.entries()) {
            if (r >= atRow) {
                newHeights.set(r + count, h);
            } else {
                newHeights.set(r, h);
            }
        }
        this.rowHeights = newHeights;

        // Update merges
        for (const m of this.merges) {
            if (m.startRow >= atRow) {
                m.startRow += count;
                m.endRow += count;
            } else if (m.endRow >= atRow) {
                m.endRow += count;
                m.rowSpan += count;
            }
        }
    }

    deleteRows(atRow, count = 1) {
        const endRow = atRow + count - 1;
        const newCells = new Map();
        for (const [key, cell] of this.cells.entries()) {
            if (cell.row >= atRow && cell.row <= endRow) {
                // deleted
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

        const newHeights = new Map();
        for (const [r, h] of this.rowHeights.entries()) {
            if (r < atRow) {
                newHeights.set(r, h);
            } else if (r > endRow) {
                newHeights.set(r - count, h);
            }
        }
        this.rowHeights = newHeights;

        // Adjust merges
        this.merges = this.merges.filter(m => !(m.startRow >= atRow && m.endRow <= endRow)).map(m => {
            if (m.startRow > endRow) {
                m.startRow -= count;
                m.endRow -= count;
            }
            return m;
        });
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

        const newWidths = new Map();
        for (const [c, w] of this.colWidths.entries()) {
            if (c >= atCol) {
                newWidths.set(c + count, w);
            } else {
                newWidths.set(c, w);
            }
        }
        this.colWidths = newWidths;

        for (const m of this.merges) {
            if (m.startCol >= atCol) {
                m.startCol += count;
                m.endCol += count;
            } else if (m.endCol >= atCol) {
                m.endCol += count;
                m.colSpan += count;
            }
        }
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

        const newWidths = new Map();
        for (const [c, w] of this.colWidths.entries()) {
            if (c < atCol) {
                newWidths.set(c, w);
            } else if (c > endCol) {
                newWidths.set(c - count, w);
            }
        }
        this.colWidths = newWidths;

        this.merges = this.merges.filter(m => !(m.startCol >= atCol && m.endCol <= endCol)).map(m => {
            if (m.startCol > endCol) {
                m.startCol -= count;
                m.endCol -= count;
            }
            return m;
        });
    }

    // Get active data bounds (used for charts, exports, etc.)
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
        if (maxR === -1) {
            return { startRow: 0, startCol: 0, endRow: 9, endCol: 4 };
        }
        return { startRow: minR, startCol: minC, endRow: maxR, endCol: maxC };
    }

    clone() {
        const serialized = this.toJSON();
        return Sheet.fromJSON(serialized);
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
        for (const [k, v] of this.rowHeights.entries()) {
            rowHeightsObj[k] = v;
        }

        const colWidthsObj = {};
        for (const [k, v] of this.colWidths.entries()) {
            colWidthsObj[k] = v;
        }

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
            charts: this.charts,
            cells: cellsArr
        };
    }

    static fromJSON(json) {
        return new Sheet(json.id, json.name, json);
    }
}
