/**
 * SheetForge - Virtual Grid Engine
 * High-performance virtualized DOM grid renderer for smooth 60fps scrolling over thousands of rows and columns
 */
import { colIndexToLetter } from '../model/Sheet.js';
import { Formatter } from '../engine/Formatter.js';

export class VirtualGrid {
    constructor(containerElement, options = {}) {
        this.container = containerElement;
        this.sheet = null;
        this.evaluator = options.evaluator || null;
        this.buffer = 5; // Extra rows/cols rendered outside viewport

        // Grid measurements
        this.headerColWidth = 46; // px for row numbers column
        this.headerRowHeight = 26; // px for column letters row

        this.rowPositions = []; // Cumulative row top offsets
        this.colPositions = []; // Cumulative col left offsets
        this.totalWidth = 0;
        this.totalHeight = 0;

        this.visibleRange = {
            startRow: 0,
            endRow: 30,
            startCol: 0,
            endCol: 15
        };

        this._setupDOM();
        this._bindEvents();
    }

    _setupDOM() {
        this.container.innerHTML = `
            <div class="sf-grid-wrapper" tabindex="0">
                <!-- Top-Left Corner Header -->
                <div class="sf-corner-header" title="Select All (Ctrl+A)">
                    <div class="sf-corner-triangle"></div>
                </div>

                <!-- Column Headers (Sticky Top) -->
                <div class="sf-col-headers-viewport">
                    <div class="sf-col-headers-track"></div>
                </div>

                <!-- Row Headers (Sticky Left) -->
                <div class="sf-row-headers-viewport">
                    <div class="sf-row-headers-track"></div>
                </div>

                <!-- Main Scrollable Grid Area -->
                <div class="sf-cells-viewport">
                    <div class="sf-cells-canvas">
                        <!-- Rendered virtual cells container -->
                        <div class="sf-cells-container"></div>
                        
                        <!-- Freeze Pane Dividers -->
                        <div class="sf-freeze-row-line"></div>
                        <div class="sf-freeze-col-line"></div>

                        <!-- Selection Overlays -->
                        <div class="sf-selection-layer">
                            <div class="sf-selection-range"></div>
                            <div class="sf-selection-active-cell">
                                <div class="sf-fill-handle" title="Drag to autofill"></div>
                            </div>
                            <div class="sf-clipboard-ants"></div>
                            <div class="sf-autofill-preview"></div>
                        </div>

                        <!-- In-Cell Editor Input -->
                        <div class="sf-cell-editor-container">
                            <div class="sf-cell-editor" contenteditable="true" spellcheck="false"></div>
                        </div>
                    </div>
                </div>

                <!-- Resize Guideline Indicator -->
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
            const h = this.sheet.getRowHeight(r);
            runningY += h;
            this.rowPositions.push(runningY);
        }
        this.totalHeight = runningY;

        this.colPositions = [0];
        let runningX = 0;
        for (let c = 0; c < this.sheet.colCount; c++) {
            const w = this.sheet.getColWidth(c);
            runningX += w;
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
        while (startRow < this.rowPositions.length - 1 && this.rowPositions[startRow + 1] < scrollTop) {
            startRow++;
        }

        let endRow = startRow;
        while (endRow < this.rowPositions.length - 1 && this.rowPositions[endRow] < scrollTop + viewH) {
            endRow++;
        }

        let startCol = 0;
        while (startCol < this.colPositions.length - 1 && this.colPositions[startCol + 1] < scrollLeft) {
            startCol++;
        }

        let endCol = startCol;
        while (endCol < this.colPositions.length - 1 && this.colPositions[endCol] < scrollLeft + viewW) {
            endCol++;
        }

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

        // Track merged cells rendered to avoid duplicate overlapping rendering
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
                    if (!mergeInfo.isMaster) {
                        // Skip non-master merged cells
                        continue;
                    }
                    const mergeKey = `${mergeInfo.masterRow},${mergeInfo.masterCol}`;
                    if (renderedMerges.has(mergeKey)) continue;
                    renderedMerges.add(mergeKey);

                    // Compute merged dimensions
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
                if (s.backgroundColor && s.backgroundColor !== '#ffffff' && s.backgroundColor !== '#fff') {
                    styleStr += `background-color: ${s.backgroundColor};`;
                }
                if (s.alignH) styleStr += `text-align: ${s.alignH};`;
                if (s.fontSize && s.fontSize !== 13) styleStr += `font-size: ${s.fontSize}px;`;
                if (s.wrapText) {
                    classList.push('sf-cell-wrap');
                    styleStr += 'white-space: normal; word-break: break-word;';
                }

                if (s.borders) {
                    if (s.borders.top) styleStr += `border-top: ${s.borders.top.width || 1}px ${s.borders.top.style || 'solid'} ${s.borders.top.color || '#000'};`;
                    if (s.borders.bottom) styleStr += `border-bottom: ${s.borders.bottom.width || 1}px ${s.borders.bottom.style || 'solid'} ${s.borders.bottom.color || '#000'};`;
                    if (s.borders.left) styleStr += `border-left: ${s.borders.left.width || 1}px ${s.borders.left.style || 'solid'} ${s.borders.left.color || '#000'};`;
                    if (s.borders.right) styleStr += `border-right: ${s.borders.right.width || 1}px ${s.borders.right.style || 'solid'} ${s.borders.right.color || '#000'};`;
                }
            }

            if (cell.comment) {
                classList.push('sf-has-comment');
            }
        }

        // Apply conditional formatting rules if any
        if (this.sheet && this.sheet.conditionalFormats) {
            for (const cf of this.sheet.conditionalFormats) {
                if (r >= cf.range.startRow && r <= cf.range.endRow && c >= cf.range.startCol && c <= cf.range.endCol) {
                    if (this.evalConditionalRule(cell, cf.rule)) {
                        if (cf.rule.style.backgroundColor) styleStr += `background-color: ${cf.rule.style.backgroundColor} !important;`;
                        if (cf.rule.style.color) styleStr += `color: ${cf.rule.style.color} !important;`;
                    }
                }
            }
        }

        // Escape HTML
        const safeText = this.escapeHTML(text);

        return `<div class="${classList.join(' ')}" data-row="${r}" data-col="${c}" style="${styleStr}"><span class="sf-cell-inner">${safeText}</span></div>`;
    }

    evalConditionalRule(cell, rule) {
        if (!cell || !rule) return false;
        const val = cell.numericValue !== null ? cell.numericValue : cell.rawValue;

        switch (rule.type) {
            case 'greaterThan':
                return typeof val === 'number' && val > Number(rule.value);
            case 'lessThan':
                return typeof val === 'number' && val < Number(rule.value);
            case 'equal':
                return String(val).toLowerCase() === String(rule.value).toLowerCase();
            case 'textContains':
                return String(val).toLowerCase().includes(String(rule.value).toLowerCase());
            case 'isDuplicate':
                return Boolean(rule.duplicatesSet && rule.duplicatesSet.has(String(val)));
            default:
                return false;
        }
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

        return {
            top,
            left,
            width: right - left,
            height: bottom - top
        };
    }

    getCellFromCoords(clientX, clientY) {
        const rect = this.cellsContainer.getBoundingClientRect();
        const scrollLeft = this.viewport.scrollLeft;
        const scrollTop = this.viewport.scrollTop;

        const relX = clientX - rect.left + scrollLeft;
        const relY = clientY - rect.top + scrollTop;

        let row = 0;
        while (row < this.rowPositions.length - 1 && this.rowPositions[row + 1] <= relY) {
            row++;
        }

        let col = 0;
        while (col < this.colPositions.length - 1 && this.colPositions[col + 1] <= relX) {
            col++;
        }

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
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}
