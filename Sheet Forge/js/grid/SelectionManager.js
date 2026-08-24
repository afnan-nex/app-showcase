/**
 * SheetForge - Selection Manager
 * Manages active cell, range selections, multi-select, marching ants, header highlights, and coordinate calculations
 */
import { formatCellAddress, colIndexToLetter } from '../model/Sheet.js';

export class SelectionManager {
    constructor(virtualGrid, eventEmitter) {
        this.grid = virtualGrid;
        this.emitter = eventEmitter;

        this.activeCell = { row: 0, col: 0 };
        this.anchorCell = { row: 0, col: 0 };
        this.selectionRange = { startRow: 0, startCol: 0, endRow: 0, endCol: 0 };
        this.isSelecting = false;
        this.clipboardRange = null; // { range: {...}, isCut: bool, sheetId: string }

        this._bindEvents();
    }

    _bindEvents() {
        // Grid canvas mousedown
        this.grid.canvas.addEventListener('mousedown', (e) => {
            if (e.target.closest('.sf-cell-editor-container') || e.target.closest('.sf-fill-handle')) {
                return;
            }
            if (e.button !== 0 && e.button !== 2) return; // Left or right click only

            const coords = this.grid.getCellFromCoords(e.clientX, e.clientY);
            if (e.shiftKey) {
                this.expandSelectionTo(coords.row, coords.col);
            } else {
                this.selectCell(coords.row, coords.col);
            }

            if (e.button === 0) {
                this.isSelecting = true;
            }
        });

        // Mousemove for range drag
        window.addEventListener('mousemove', (e) => {
            if (!this.isSelecting) return;
            const coords = this.grid.getCellFromCoords(e.clientX, e.clientY);
            this.expandSelectionTo(coords.row, coords.col);
        });

        // Mouseup to end drag selection
        window.addEventListener('mouseup', () => {
            if (this.isSelecting) {
                this.isSelecting = false;
            }
        });

        // Column header clicks (select entire column)
        this.grid.colHeadersTrack.addEventListener('mousedown', (e) => {
            if (e.target.closest('.sf-col-resizer') || e.target.closest('.sf-col-filter-btn')) return;
            const header = e.target.closest('.sf-col-header');
            if (!header) return;
            const col = parseInt(header.dataset.col, 10);
            this.selectColumn(col, e.shiftKey);
        });

        // Row header clicks (select entire row)
        this.grid.rowHeadersTrack.addEventListener('mousedown', (e) => {
            if (e.target.closest('.sf-row-resizer')) return;
            const header = e.target.closest('.sf-row-header');
            if (!header) return;
            const row = parseInt(header.dataset.row, 10);
            this.selectRow(row, e.shiftKey);
        });

        // Corner header click (select all)
        this.grid.cornerHeader.addEventListener('click', () => {
            this.selectAll();
        });
    }

    selectCell(row, col) {
        if (!this.grid.sheet) return;
        const r = Math.max(0, Math.min(this.grid.sheet.rowCount - 1, row));
        const c = Math.max(0, Math.min(this.grid.sheet.colCount - 1, col));

        // Check if cell is merged
        const cell = this.grid.sheet.getCell(r, c);
        if (cell && cell.mergeInfo && cell.mergeInfo.isMerged) {
            const m = cell.mergeInfo;
            this.activeCell = { row: m.masterRow, col: m.masterCol };
            this.anchorCell = { row: m.masterRow, col: m.masterCol };
            this.selectionRange = {
                startRow: m.masterRow,
                startCol: m.masterCol,
                endRow: m.masterRow + m.rowSpan - 1,
                endCol: m.masterCol + m.colSpan - 1
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
            this.selectionRange = {
                startRow: Math.min(this.anchorCell.row, r),
                startCol: 0,
                endRow: Math.max(this.anchorCell.row, r),
                endCol: maxCol
            };
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
            this.selectionRange = {
                startRow: 0,
                startCol: Math.min(this.anchorCell.col, c),
                endRow: maxRow,
                endCol: Math.max(this.anchorCell.col, c)
            };
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
        this.selectionRange = {
            startRow: 0,
            startCol: 0,
            endRow: this.grid.sheet.rowCount - 1,
            endCol: this.grid.sheet.colCount - 1
        };

        this.updateOverlays();
        this._notify();
    }

    moveActiveCell(dRow, dCol, isExtend = false) {
        if (!this.grid.sheet) return;
        const targetRow = Math.max(0, Math.min(this.grid.sheet.rowCount - 1, (isExtend ? this.selectionRange.endRow : this.activeCell.row) + dRow));
        const targetCol = Math.max(0, Math.min(this.grid.sheet.colCount - 1, (isExtend ? this.selectionRange.endCol : this.activeCell.col) + dCol));

        if (isExtend) {
            this.expandSelectionTo(targetRow, targetCol);
        } else {
            this.selectCell(targetRow, targetCol);
        }

        this.grid.scrollToCell(targetRow, targetCol);
    }

    updateOverlays() {
        if (!this.grid.sheet) return;

        // 1. Active Cell overlay
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

        // 2. Selection Range overlay (if range spans > 1 cell)
        const isSingleCell = (this.selectionRange.startRow === this.selectionRange.endRow && this.selectionRange.startCol === this.selectionRange.endCol);
        if (!isSingleCell) {
            const rangeRect = this.grid.getRangeRect(
                this.selectionRange.startRow,
                this.selectionRange.startCol,
                this.selectionRange.endRow,
                this.selectionRange.endCol
            );
            this.grid.selectionRange.style.top = `${rangeRect.top}px`;
            this.grid.selectionRange.style.left = `${rangeRect.left}px`;
            this.grid.selectionRange.style.width = `${rangeRect.width}px`;
            this.grid.selectionRange.style.height = `${rangeRect.height}px`;
            this.grid.selectionRange.style.display = 'block';

            // Place fill handle on bottom right of the entire range
            this.grid.fillHandle.style.position = 'fixed'; // Let CSS anchor to range end
        } else {
            this.grid.selectionRange.style.display = 'none';
        }

        // 3. Update header active states
        this._updateHeaderActiveHighlights();

        // 4. Update Marching Ants if clipboard range exists
        this.updateClipboardAnts();
    }

    setClipboard(range, isCut = false) {
        this.clipboardRange = {
            range: { ...range },
            isCut,
            sheetId: this.grid.sheet ? this.grid.sheet.id : null
        };
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
            this.clipboardRange.range.startRow,
            this.clipboardRange.range.startCol,
            this.clipboardRange.range.endRow,
            this.clipboardRange.range.endCol
        );

        this.grid.clipboardAnts.style.top = `${rect.top}px`;
        this.grid.clipboardAnts.style.left = `${rect.left}px`;
        this.grid.clipboardAnts.style.width = `${rect.width}px`;
        this.grid.clipboardAnts.style.height = `${rect.height}px`;
        this.grid.clipboardAnts.style.display = 'block';
    }

    _updateHeaderActiveHighlights() {
        // Highlight active col headers
        const colHeaders = this.grid.colHeadersTrack.querySelectorAll('.sf-col-header');
        for (const el of colHeaders) {
            const c = parseInt(el.dataset.col, 10);
            if (c >= this.selectionRange.startCol && c <= this.selectionRange.endCol) {
                el.classList.add('sf-header-selected');
            } else {
                el.classList.remove('sf-header-selected');
            }
        }

        // Highlight active row headers
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
        const rowsCount = endRow - startRow + 1;
        const colsCount = endCol - startCol + 1;
        return {
            address: `${start}:${end}`,
            dimensions: `${rowsCount}R × ${colsCount}C`
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
