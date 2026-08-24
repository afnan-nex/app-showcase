/**
 * SheetForge - Drag Manager
 * Handles column resizing, row resizing, and autofill drag & drop interactions
 */
import { AutoFill } from '../engine/AutoFill.js';

export class DragManager {
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
        // --- Column Resizing ---
        this.grid.colHeadersTrack.addEventListener('mousedown', (e) => {
            const resizer = e.target.closest('.sf-col-resizer');
            if (!resizer) return;
            e.preventDefault();
            e.stopPropagation();

            this.isDraggingCol = true;
            this.dragColIndex = parseInt(resizer.dataset.col, 10);
            this.startX = e.clientX;
            this.startDimension = this.grid.sheet.getColWidth(this.dragColIndex);

            this.grid.resizeGuideline.style.display = 'block';
            this.grid.resizeGuideline.className = 'sf-resize-guideline sf-resize-col';
            this._updateColGuideline(e.clientX);
        });

        // --- Row Resizing ---
        this.grid.rowHeadersTrack.addEventListener('mousedown', (e) => {
            const resizer = e.target.closest('.sf-row-resizer');
            if (!resizer) return;
            e.preventDefault();
            e.stopPropagation();

            this.isDraggingRow = true;
            this.dragRowIndex = parseInt(resizer.dataset.row, 10);
            this.startY = e.clientY;
            this.startDimension = this.grid.sheet.getRowHeight(this.dragRowIndex);

            this.grid.resizeGuideline.style.display = 'block';
            this.grid.resizeGuideline.className = 'sf-resize-guideline sf-resize-row';
            this._updateRowGuideline(e.clientY);
        });

        // --- Fill Handle Dragging ---
        this.grid.fillHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();

            this.isDraggingFill = true;
            this.fillTargetRange = { ...this.selection.selectionRange };
            this.grid.autofillPreview.style.display = 'block';
            this._updateFillPreview(this.fillTargetRange);
        });

        // --- Global Mouse Move & Mouse Up ---
        window.addEventListener('mousemove', (e) => {
            if (this.isDraggingCol) {
                const deltaX = e.clientX - this.startX;
                const newWidth = Math.max(30, this.startDimension + deltaX);
                this._updateColGuideline(e.clientX);
            } else if (this.isDraggingRow) {
                const deltaY = e.clientY - this.startY;
                const newHeight = Math.max(18, this.startDimension + deltaY);
                this._updateRowGuideline(e.clientY);
            } else if (this.isDraggingFill) {
                this._handleFillDrag(e.clientX, e.clientY);
            }
        });

        window.addEventListener('mouseup', (e) => {
            if (this.isDraggingCol) {
                this.isDraggingCol = false;
                this.grid.resizeGuideline.style.display = 'none';
                const deltaX = e.clientX - this.startX;
                const newWidth = Math.max(30, this.startDimension + deltaX);
                
                if (this.emitter) {
                    this.emitter.emit('grid:resizeCol', {
                        col: this.dragColIndex,
                        width: newWidth,
                        oldWidth: this.startDimension
                    });
                }
            } else if (this.isDraggingRow) {
                this.isDraggingRow = false;
                this.grid.resizeGuideline.style.display = 'none';
                const deltaY = e.clientY - this.startY;
                const newHeight = Math.max(18, this.startDimension + deltaY);

                if (this.emitter) {
                    this.emitter.emit('grid:resizeRow', {
                        row: this.dragRowIndex,
                        height: newHeight,
                        oldHeight: this.startDimension
                    });
                }
            } else if (this.isDraggingFill) {
                this.isDraggingFill = false;
                this.grid.autofillPreview.style.display = 'none';
                this._applyAutoFill();
            }
        });
    }

    _updateColGuideline(clientX) {
        const wrapperRect = this.grid.wrapper.getBoundingClientRect();
        const left = clientX - wrapperRect.left;
        this.grid.resizeGuideline.style.left = `${left}px`;
        this.grid.resizeGuideline.style.top = '0px';
        this.grid.resizeGuideline.style.height = `${wrapperRect.height}px`;
        this.grid.resizeGuideline.style.width = '2px';
    }

    _updateRowGuideline(clientY) {
        const wrapperRect = this.grid.wrapper.getBoundingClientRect();
        const top = clientY - wrapperRect.top;
        this.grid.resizeGuideline.style.top = `${top}px`;
        this.grid.resizeGuideline.style.left = '0px';
        this.grid.resizeGuideline.style.width = `${wrapperRect.width}px`;
        this.grid.resizeGuideline.style.height = '2px';
    }

    _handleFillDrag(clientX, clientY) {
        const targetCoord = this.grid.getCellFromCoords(clientX, clientY);
        const sel = this.selection.selectionRange;

        // Determine drag orientation: down or right
        const dRow = targetCoord.row - sel.endRow;
        const dCol = targetCoord.col - sel.endCol;

        if (Math.abs(dRow) >= Math.abs(dCol)) {
            // Vertical autofill
            if (dRow >= 0) {
                this.fillTargetRange = {
                    startRow: sel.startRow,
                    startCol: sel.startCol,
                    endRow: targetCoord.row,
                    endCol: sel.endCol
                };
            } else {
                this.fillTargetRange = { ...sel };
            }
        } else {
            // Horizontal autofill
            if (dCol >= 0) {
                this.fillTargetRange = {
                    startRow: sel.startRow,
                    startCol: sel.startCol,
                    endRow: sel.endRow,
                    endCol: targetCoord.col
                };
            } else {
                this.fillTargetRange = { ...sel };
            }
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
            // For each column in source range, extrapolate downwards
            for (let c = sourceRange.startCol; c <= sourceRange.endCol; c++) {
                const sourceCells = [];
                for (let r = sourceRange.startRow; r <= sourceRange.endRow; r++) {
                    sourceCells.push(this.grid.sheet.getCell(r, c));
                }

                const targetCoords = [];
                for (let r = sourceRange.endRow + 1; r <= targetRange.endRow; r++) {
                    targetCoords.push({ row: r, col: c });
                }

                const extrapolated = AutoFill.extrapolate(sourceCells, targetCoords, true);
                updates.push(...extrapolated);
            }
        } else if (isHorizontal) {
            // For each row in source range, extrapolate rightwards
            for (let r = sourceRange.startRow; r <= sourceRange.endRow; r++) {
                const sourceCells = [];
                for (let c = sourceRange.startCol; c <= sourceRange.endCol; c++) {
                    sourceCells.push(this.grid.sheet.getCell(r, c));
                }

                const targetCoords = [];
                for (let c = sourceRange.endCol + 1; c <= targetRange.endCol; c++) {
                    targetCoords.push({ row: r, col: c });
                }

                const extrapolated = AutoFill.extrapolate(sourceCells, targetCoords, false);
                updates.push(...extrapolated);
            }
        }

        if (this.onAutoFillApply) {
            this.onAutoFillApply(updates, targetRange);
        }
    }
}
