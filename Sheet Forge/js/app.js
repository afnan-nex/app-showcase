/**
 * SheetForge - Application Orchestrator & Lifecycle Bootstrap
 * Pairs model, virtual grid, formula engine, and UI components into a high-performance spreadsheet suite
 */
import { EventEmitter } from './core/EventEmitter.js';
import { Storage } from './core/Storage.js';
import { CommandManager, Command, BatchCommand } from './core/CommandManager.js';
import { Workbook } from './model/Workbook.js';
import { Sheet, parseCellAddress, formatCellAddress, colIndexToLetter } from './model/Sheet.js';
import { Cell } from './model/Cell.js';
import { Evaluator } from './engine/Evaluator.js';
import { DependencyGraph } from './engine/DependencyGraph.js';
import { VirtualGrid } from './grid/VirtualGrid.js';
import { SelectionManager } from './grid/SelectionManager.js';
import { DragManager } from './grid/DragManager.js';
import { CellEditor } from './grid/CellEditor.js';
import { MenuBar } from './ui/MenuBar.js';
import { Toolbar } from './ui/Toolbar.js';
import { FormulaBar } from './ui/FormulaBar.js';
import { SheetTabs } from './ui/SheetTabs.js';
import { Sidebar } from './ui/Sidebar.js';
import { StatusBar } from './ui/StatusBar.js';
import { ChartManager } from './ui/ChartManager.js';
import { FilterManager } from './ui/FilterManager.js';
import { Modals } from './ui/Modals.js';
import { IOManager } from './ui/IOManager.js';
import { Toast } from './ui/Toast.js';
import { NoteTooltip } from './ui/NoteTooltip.js';
import { DemoData } from './data/DemoData.js';

// Undo / Redo Specific Commands
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
        this.oldStyles = oldStyles; // Map key -> style
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

export class SheetForgeApp {
    constructor() {
        this.emitter = new EventEmitter();
        this.storage = new Storage();
        this.commandManager = new CommandManager(100, this.emitter);
        this.evaluator = new Evaluator();
        this.dependencyGraph = new DependencyGraph();

        this.workbook = null;
        this.activeSheet = null;
        this.saveTimeout = null;
        this.internalClipboard = null; // { cells: [[cell]], range: {...}, isCut: bool }

        this._setupTheme();
    }

    async init() {
        // 1. Load saved workbook or create realistic demo
        const savedData = await this.storage.loadWorkbook('default_workbook');
        if (savedData && savedData.sheets && savedData.sheets.length > 0) {
            try {
                this.workbook = Workbook.fromJSON(savedData);
            } catch (e) {
                console.warn('Failed to parse saved workbook, loading demo:', e);
                this.workbook = DemoData.createDefaultWorkbook();
            }
        } else {
            this.workbook = DemoData.createDefaultWorkbook();
        }

        this.activeSheet = this.workbook.getActiveSheet();
        this.evaluator.setWorkbook(this.workbook);
        this.dependencyGraph.buildGraph(this.workbook);

        // Perform initial calculations across all sheets
        this.recalculateAllSheets();

        // 2. Initialize UI Components
        this._initUI();

        // 3. Bind Application-level Event Handlers
        this._bindAppEvents();
        this._bindKeyboardShortcuts();

        // 4. Initial render
        this.switchSheet(this.activeSheet.id);
        this._updateDocTitle();

        console.log('⚡ SheetForge Pro Suite initialized');
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
        // Grid Engine
        const gridContainer = document.getElementById('sfGridContainer');
        this.grid = new VirtualGrid(gridContainer, { evaluator: this.evaluator });
        this.selection = new SelectionManager(this.grid, this.emitter);
        this.dragManager = new DragManager(this.grid, this.selection, this.emitter, (updates, targetRange) => {
            this.applyAutoFillUpdates(updates, targetRange);
        });
        this.cellEditor = new CellEditor(this.grid, this.selection, this.emitter, (r, c, val) => {
            this.commitCellValue(r, c, val);
        });

        // Tooltips & Toast
        this.noteTooltip = new NoteTooltip(this.grid);

        // UI Toolbars & Panels
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

        // Document Title Editing
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
                if (e.key === 'Enter') {
                    e.preventDefault();
                    titleEl.blur();
                }
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
        // Menu Actions
        this.emitter.on('action:menu', (action) => this.handleMenuAction(action));

        // History Actions
        this.emitter.on('action:undo', () => this.commandManager.undo());
        this.emitter.on('action:redo', () => this.commandManager.redo());

        // Format actions from toolbar / sidebar
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
        this.emitter.on('format:decimalsChange', (delta) => this.changeDecimals(delta));
        this.emitter.on('format:toggleMerge', () => this.toggleMergeSelection());
        this.emitter.on('format:border', (type) => this.applyBorder(type));
        this.emitter.on('format:customBorder', (opts) => this.applyCustomBorder(opts));

        // Grid Resize
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

        // Grid Zoom
        this.emitter.on('grid:zoom', (scale) => {
            this.grid.canvas.style.transform = `scale(${scale})`;
            this.grid.canvas.style.transformOrigin = 'top left';
        });

        // Formula Bar
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

        this.emitter.on('formulabar:cancel', () => {
            this.cellEditor.cancelEdit();
        });

        // Sheet Operations
        this.emitter.on('action:switchSheet', (sheetId) => this.switchSheet(sheetId));
        this.emitter.on('action:addSheet', () => this.addNewSheet());
        this.emitter.on('action:duplicateSheet', (sheetId) => this.duplicateSheet(sheetId));
        this.emitter.on('action:deleteSheet', (sheetId) => this.deleteSheet(sheetId));
        this.emitter.on('action:renameSheet', ({ sheetId, newName }) => this.renameSheet(sheetId, newName));
        this.emitter.on('action:setTabColor', ({ sheetId, color }) => this.setSheetTabColor(sheetId, color));
        this.emitter.on('action:moveSheet', ({ sheetId, direction }) => this.moveSheet(sheetId, direction));

        // Modals & Panels
        this.emitter.on('action:toggleSidebar', () => this.sidebar.toggle());
        this.emitter.on('action:openConditionalModal', () => {
            const addrObj = this.selection.getSelectedRangeAddress();
            this.modals.openConditional(typeof addrObj === 'string' ? addrObj : addrObj.address);
        });
        this.emitter.on('action:openValidationModal', () => this.modals.openValidation());
        this.emitter.on('action:insertFunctionGuide', () => this.modals.openFormulasGuide());
        this.emitter.on('action:insertChart', () => {
            const addrObj = this.selection.getSelectedRangeAddress();
            const rangeStr = typeof addrObj === 'string' ? addrObj : addrObj.address;
            this.chartManager.openModal(rangeStr);
        });

        this.emitter.on('action:createChartWidget', (config) => {
            this.chartManager.createFloatingChartWidget(config, this.activeSheet, document.getElementById('sfChartLayer'));
            Toast.success('Interactive chart inserted');
        });

        // AutoSum action
        this.emitter.on('action:insertAutoSum', (fn) => this.applyAutoSum(fn));

        // Find and Replace logic
        this.emitter.on('action:findNext', (opts) => this.handleFind(opts));
        this.emitter.on('action:replace', (opts) => this.handleReplace(opts));
        this.emitter.on('action:replaceAll', (opts) => this.handleReplaceAll(opts));

        // Conditional Formatting Rule added
        this.emitter.on('action:addConditionalRule', (rule) => {
            const parts = rule.range.split(':');
            const start = parseCellAddress(parts[0]) || { row: 0, col: 0 };
            const end = parseCellAddress(parts[1]) || start;
            this.activeSheet.conditionalFormats.push({
                range: {
                    startRow: Math.min(start.row, end.row),
                    startCol: Math.min(start.col, end.col),
                    endRow: Math.max(start.row, end.row),
                    endCol: Math.max(start.col, end.col)
                },
                rule
            });
            this.grid.renderVirtual();
            this.scheduleAutoSave();
            Toast.success('Conditional formatting rule applied');
        });

        // Data Validation Saved
        this.emitter.on('action:saveDataValidation', (validation) => {
            const sel = this.selection.selectionRange;
            for (let r = sel.startRow; r <= sel.endRow; r++) {
                for (let c = sel.startCol; c <= sel.endCol; c++) {
                    const cell = this.activeSheet.getCell(r, c, true);
                    cell.validation = validation;
                }
            }
            this.grid.renderVirtual();
            this.scheduleAutoSave();
            Toast.success(validation ? 'Data validation rule active' : 'Data validation cleared');
        });

        // Duplicates Execution
        this.emitter.on('action:executeDuplicateAction', (action) => this.handleDuplicatesAction(action));

        // Filter & Sort
        this.emitter.on('action:sort', (order) => this.sortSelection(order));
        this.emitter.on('action:sortColumn', ({ col, order }) => this.sortColumn(col, order));
        this.emitter.on('action:toggleFilter', () => this.toggleFilter());
        this.emitter.on('action:applyColumnFilter', (opts) => this.applyColumnFilter(opts));
        this.emitter.on('action:clearFilterOnCol', (col) => this.clearFilterOnCol(col));

        // Cell Notes
        this.emitter.on('cell:saveNote', (noteText) => {
            const cell = this.activeSheet.getCell(this.selection.activeCell.row, this.selection.activeCell.col, true);
            cell.comment = noteText;
            this.grid.renderVirtual();
            this.scheduleAutoSave();
            Toast.success(noteText ? 'Note saved' : 'Note deleted');
        });

        // Name Box Jump
        this.emitter.on('grid:selectCell', ({ row, col }) => {
            this.selection.selectCell(row, col);
            this.grid.scrollToCell(row, col);
        });

        this.emitter.on('grid:selectRange', ({ startRow, startCol, endRow, endCol }) => {
            this.selection.selectCell(startRow, startCol);
            this.selection.expandSelectionTo(endRow, endCol);
            this.grid.scrollToCell(startRow, startCol);
        });
    }

    _bindKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            if (e.target.closest('.sf-modal-backdrop') || e.target.closest('.sf-filter-popover') || e.target.closest('#sfDocTitle')) {
                return;
            }

            if (this.cellEditor.isEditing) {
                return;
            }

            const isCtrl = e.ctrlKey || e.metaKey;

            // Undo / Redo
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

            // Copy / Cut / Paste
            if (isCtrl && (e.key === 'c' || e.key === 'C')) {
                e.preventDefault();
                this.copySelection(false);
                return;
            }

            if (isCtrl && (e.key === 'x' || e.key === 'X')) {
                e.preventDefault();
                this.copySelection(true);
                return;
            }

            if (isCtrl && (e.key === 'v' || e.key === 'V')) {
                e.preventDefault();
                this.pasteClipboard(e.shiftKey);
                return;
            }

            // Bold / Italic / Underline
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

            // Find (Ctrl+F)
            if (isCtrl && (e.key === 'f' || e.key === 'F')) {
                e.preventDefault();
                this.modals.openFindReplace();
                return;
            }

            // Toggle Sidebar (Ctrl+\)
            if (isCtrl && e.key === '\\') {
                e.preventDefault();
                this.sidebar.toggle();
                return;
            }

            // Select All (Ctrl+A)
            if (isCtrl && (e.key === 'a' || e.key === 'A')) {
                e.preventDefault();
                this.selection.selectAll();
                return;
            }

            // Navigation Arrow Keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                const dRow = e.key === 'ArrowDown' ? 1 : (e.key === 'ArrowUp' ? -1 : 0);
                const dCol = e.key === 'ArrowRight' ? 1 : (e.key === 'ArrowLeft' ? -1 : 0);
                this.selection.moveActiveCell(dRow, dCol, e.shiftKey);
                return;
            }

            // Enter / Tab
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

            // F2 (Edit cell)
            if (e.key === 'F2') {
                e.preventDefault();
                this.cellEditor.startEditing(this.selection.activeCell.row, this.selection.activeCell.col);
                return;
            }

            // Delete / Backspace
            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                this.clearSelectionContents();
                return;
            }

            // Start typing alphanumeric directly into cell
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

    duplicateSheet(sheetId) {
        const copy = this.workbook.duplicateSheet(sheetId);
        if (copy) {
            this.switchSheet(copy.id);
            this.scheduleAutoSave();
            Toast.success(`Duplicated to "${copy.name}"`);
        }
    }

    deleteSheet(sheetId) {
        try {
            const sheet = this.workbook.getSheetById(sheetId);
            const name = sheet ? sheet.name : 'sheet';
            this.workbook.deleteSheet(sheetId);
            this.switchSheet(this.workbook.activeSheetId);
            this.scheduleAutoSave();
            Toast.info(`Deleted worksheet "${name}"`);
        } catch (e) {
            Toast.error(e.message);
        }
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

    setSheetTabColor(sheetId, color) {
        const sheet = this.workbook.getSheetById(sheetId);
        if (sheet) {
            sheet.tabColor = color;
            this.sheetTabs.renderTabs();
            this.scheduleAutoSave();
        }
    }

    moveSheet(sheetId, direction) {
        const idx = this.workbook.sheets.findIndex(s => s.id === sheetId);
        if (idx === -1) return;
        const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
        if (this.workbook.reorderSheet(sheetId, targetIdx)) {
            this.sheetTabs.renderTabs();
            this.scheduleAutoSave();
        }
    }

    commitCellValue(r, c, val) {
        const cell = this.activeSheet.getCell(r, c);

        // Check data validation constraint if present
        if (cell && cell.validation && !val.startsWith('=')) {
            const isValid = this.validateCellValue(val, cell.validation);
            if (!isValid) {
                Toast.error(cell.validation.errorMsg || 'Invalid value for cell validation constraint');
                return;
            }
        }

        const oldState = cell ? cell.clone() : null;
        const cmd = new SetCellValueCommand(this.activeSheet, r, c, val, oldState, this);
        this.commandManager.execute(cmd);
    }

    validateCellValue(val, vRule) {
        if (!val || val === '') return true;

        if (vRule.type === 'list' && vRule.list && vRule.list.length > 0) {
            return vRule.list.some(opt => opt.toLowerCase() === String(val).trim().toLowerCase());
        }

        if (vRule.type === 'number') {
            const num = Number(val);
            if (isNaN(num)) return false;
            if (!isNaN(vRule.min) && num < vRule.min) return false;
            if (!isNaN(vRule.max) && num > vRule.max) return false;
            return true;
        }

        if (vRule.type === 'text_length') {
            const len = String(val).length;
            if (!isNaN(vRule.min) && len < vRule.min) return false;
            if (!isNaN(vRule.max) && len > vRule.max) return false;
            return true;
        }

        return true;
    }

    onCellModified(sheet, r, c) {
        const cell = sheet.getCell(r, c);
        this.dependencyGraph.updateCell(sheet, r, c, cell ? cell.formula : '');

        // Recalculate this cell and all dependents
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

    changeDecimals(delta) {
        const range = this.selection.selectionRange;
        for (let r = range.startRow; r <= range.endRow; r++) {
            for (let c = range.startCol; c <= range.endCol; c++) {
                const cell = this.activeSheet.getCell(r, c, true);
                const currentDec = cell.decimals !== null ? cell.decimals : 2;
                cell.decimals = Math.max(0, Math.min(10, currentDec + delta));
            }
        }
        this.grid.renderVirtual();
        this.scheduleAutoSave();
    }

    applyBorder(borderType) {
        const range = this.selection.selectionRange;
        const color = '#94a3b8';
        const style = 'solid';

        for (let r = range.startRow; r <= range.endRow; r++) {
            for (let c = range.startCol; c <= range.endCol; c++) {
                const cell = this.activeSheet.getCell(r, c, true);
                const b = { ...(cell.style.borders || {}) };

                if (borderType === 'all') {
                    b.top = { width: 1, color, style };
                    b.bottom = { width: 1, color, style };
                    b.left = { width: 1, color, style };
                    b.right = { width: 1, color, style };
                } else if (borderType === 'outer' || borderType === 'thick_outer') {
                    const w = borderType === 'thick_outer' ? 2 : 1;
                    if (r === range.startRow) b.top = { width: w, color, style };
                    if (r === range.endRow) b.bottom = { width: w, color, style };
                    if (c === range.startCol) b.left = { width: w, color, style };
                    if (c === range.endCol) b.right = { width: w, color, style };
                } else if (borderType === 'top' && r === range.startRow) {
                    b.top = { width: 1, color, style };
                } else if (borderType === 'bottom' && r === range.endRow) {
                    b.bottom = { width: 1, color, style };
                } else if (borderType === 'left' && c === range.startCol) {
                    b.left = { width: 1, color, style };
                } else if (borderType === 'right' && c === range.endCol) {
                    b.right = { width: 1, color, style };
                } else if (borderType === 'none') {
                    b.top = null; b.bottom = null; b.left = null; b.right = null;
                }

                cell.setStyle({ borders: b });
            }
        }

        this.grid.renderVirtual();
        this.scheduleAutoSave();
    }

    applyCustomBorder({ borderType, color, style }) {
        const range = this.selection.selectionRange;
        for (let r = range.startRow; r <= range.endRow; r++) {
            for (let c = range.startCol; c <= range.endCol; c++) {
                const cell = this.activeSheet.getCell(r, c, true);
                const b = { ...(cell.style.borders || {}) };

                if (borderType === 'all') {
                    b.top = { width: 1, color, style };
                    b.bottom = { width: 1, color, style };
                    b.left = { width: 1, color, style };
                    b.right = { width: 1, color, style };
                } else if (borderType === 'top') b.top = { width: 1, color, style };
                else if (borderType === 'bottom') b.bottom = { width: 1, color, style };
                else if (borderType === 'left') b.left = { width: 1, color, style };
                else if (borderType === 'right') b.right = { width: 1, color, style };
                else if (borderType === 'none') {
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

    applyAutoSum(fn = 'SUM') {
        const sel = this.selection.selectionRange;
        const targetRow = sel.endRow + 1;

        for (let c = sel.startCol; c <= sel.endCol; c++) {
            const colLet = colIndexToLetter(c);
            const startAddr = `${colLet}${sel.startRow + 1}`;
            const endAddr = `${colLet}${sel.endRow + 1}`;
            const formula = `=${fn}(${startAddr}:${endAddr})`;
            this.commitCellValue(targetRow, c, formula);
        }

        this.selection.selectCell(targetRow, sel.startCol);
        this.selection.expandSelectionTo(targetRow, sel.endCol);
        Toast.success(`Inserted =${fn}()`);
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

        this.internalClipboard = {
            cells: matrix,
            range: { ...range },
            sheetId: this.activeSheet.id,
            isCut
        };

        this.selection.setClipboard(range, isCut);

        // Also write TSV to system clipboard
        const tsv = matrix.map(row => row.map(c => (c ? (c.rawValue || '') : '')).join('\t')).join('\n');
        if (navigator.clipboard) {
            navigator.clipboard.writeText(tsv).catch(() => {});
        }

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

                let val = '';
                if (srcCell) {
                    val = valuesOnly ? (srcCell.displayValue || srcCell.rawValue) : (srcCell.formula || srcCell.rawValue);
                }

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
        Toast.success(valuesOnly ? 'Pasted values' : 'Pasted');
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

    clearSelectionFormats() {
        const range = this.selection.selectionRange;
        for (let r = range.startRow; r <= range.endRow; r++) {
            for (let c = range.startCol; c <= range.endCol; c++) {
                const cell = this.activeSheet.getCell(r, c);
                if (cell) cell.clear({ contents: false, formats: true, comments: false });
            }
        }
        this.grid.renderVirtual();
        this.scheduleAutoSave();
        Toast.info('Formats cleared');
    }

    clearSelectionAll() {
        this.clearSelectionContents();
        this.clearSelectionFormats();
    }

    sortSelection(order = 'asc') {
        const sel = this.selection.selectionRange;
        this.sortRange(this.activeSheet, sel, sel.startCol, order);
        Toast.success(`Sorted range ${order === 'asc' ? 'A to Z' : 'Z to A'}`);
    }

    sortColumn(col, order = 'asc') {
        const bounds = this.activeSheet.getDataBounds();
        const startRow = this.activeSheet.filterRange ? this.activeSheet.filterRange.startRow + 1 : 0;
        const range = {
            startRow,
            startCol: bounds.startCol,
            endRow: bounds.endRow,
            endCol: bounds.endCol
        };
        this.sortRange(this.activeSheet, range, col, order);
        Toast.success(`Sorted column ${colIndexToLetter(col)} ${order === 'asc' ? 'A to Z' : 'Z to A'}`);
    }

    sortRange(sheet, range, sortColIndex, order = 'asc') {
        const rowsData = [];
        for (let r = range.startRow; r <= range.endRow; r++) {
            const rowCells = [];
            for (let c = range.startCol; c <= range.endCol; c++) {
                rowCells.push(sheet.getCell(r, c));
            }
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
                if (cell) {
                    sheet.setCellValue(targetR, targetC, cell.formula || cell.rawValue);
                } else {
                    sheet.setCellValue(targetR, targetC, '');
                }
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
            this.activeSheet.filterRange = {
                startRow: sel.startRow,
                startCol: sel.startCol,
                endRow: sel.endRow,
                endCol: sel.endCol
            };
            Toast.success('Filter enabled on selection');
        }
        this.grid.renderAll();
        this.scheduleAutoSave();
    }

    applyColumnFilter({ col, condition, allowedValues }) {
        if (!this.activeSheet.filterRange) return;
        const startRow = this.activeSheet.filterRange.startRow + 1;
        const endRow = this.activeSheet.filterRange.endRow;

        let visibleCount = 0;
        for (let r = startRow; r <= endRow; r++) {
            const cell = this.activeSheet.getCell(r, col);
            const val = cell ? (cell.displayValue || '(Blanks)') : '(Blanks)';

            let match = allowedValues.has(val);

            if (match && condition && condition.type !== 'none') {
                match = this.evalFilterCondition(val, condition);
            }

            if (match) {
                this.activeSheet.hiddenRows.delete(r);
                visibleCount++;
            } else {
                this.activeSheet.hiddenRows.add(r);
            }
        }

        this.grid.recalculateDimensions();
        this.grid.renderAll();
        this.selection.updateOverlays();
        Toast.info(`Filter applied: ${visibleCount} rows displayed`);
    }

    evalFilterCondition(val, cond) {
        const numVal = Number(val);
        const targetNum = Number(cond.value);

        switch (cond.type) {
            case 'empty': return val === '' || val === '(Blanks)';
            case 'notEmpty': return val !== '' && val !== '(Blanks)';
            case 'contains': return String(val).toLowerCase().includes(String(cond.value).toLowerCase());
            case 'greaterThan': return !isNaN(numVal) && numVal > targetNum;
            case 'lessThan': return !isNaN(numVal) && numVal < targetNum;
            case 'equals': return String(val).toLowerCase() === String(cond.value).toLowerCase();
            default: return true;
        }
    }

    clearFilterOnCol(col) {
        this.activeSheet.hiddenRows.clear();
        this.grid.recalculateDimensions();
        this.grid.renderAll();
        Toast.info('Column filter cleared');
    }

    handleDuplicatesAction(action) {
        const sel = this.selection.selectionRange;
        const seenRows = new Set();
        const duplicateRows = [];

        for (let r = sel.startRow; r <= sel.endRow; r++) {
            const rowSignature = [];
            for (let c = sel.startCol; c <= sel.endCol; c++) {
                const cell = this.activeSheet.getCell(r, c);
                rowSignature.push(cell ? cell.displayValue : '');
            }
            const key = rowSignature.join('|||');
            if (seenRows.has(key)) {
                duplicateRows.push(r);
            } else {
                seenRows.add(key);
            }
        }

        if (duplicateRows.length === 0) {
            Toast.info('No duplicate rows detected in selection');
            return;
        }

        if (action === 'highlight') {
            for (const r of duplicateRows) {
                for (let c = sel.startCol; c <= sel.endCol; c++) {
                    const cell = this.activeSheet.getCell(r, c, true);
                    cell.setStyle({ backgroundColor: '#fef08a' }); // soft yellow highlight
                }
            }
            this.grid.renderVirtual();
            this.scheduleAutoSave();
            Toast.success(`Highlighted ${duplicateRows.length} duplicate rows`);
        } else if (action === 'remove') {
            // Delete duplicate rows from bottom up to preserve indices
            for (let i = duplicateRows.length - 1; i >= 0; i--) {
                this.activeSheet.deleteRows(duplicateRows[i], 1);
            }
            this.grid.recalculateDimensions();
            this.grid.renderAll();
            this.scheduleAutoSave();
            Toast.success(`Removed ${duplicateRows.length} duplicate rows`);
        }
    }

    handleFind({ query, direction, matchCase, matchEntire, workbookScope, statusCallback }) {
        if (!query) return;

        const q = matchCase ? query : query.toLowerCase();
        const matches = [];

        const sheetsToSearch = workbookScope ? this.workbook.sheets : [this.activeSheet];

        sheetsToSearch.forEach(sh => {
            for (const cell of sh.cells.values()) {
                const cellStr = matchCase ? (cell.displayValue || '') : (cell.displayValue || '').toLowerCase();
                let isMatch = matchEntire ? (cellStr === q) : cellStr.includes(q);
                if (isMatch) {
                    matches.push({ sheetId: sh.id, row: cell.row, col: cell.col, addr: formatCellAddress(cell.row, cell.col) });
                }
            }
        });

        if (matches.length === 0) {
            if (statusCallback) statusCallback(`No matches found for "${query}"`);
            Toast.warning(`No matches found for "${query}"`);
            return;
        }

        if (statusCallback) statusCallback(`Found ${matches.length} matches. Active: ${matches[0].addr}`);

        // Jump to first match
        const first = matches[0];
        if (first.sheetId !== this.activeSheet.id) {
            this.switchSheet(first.sheetId);
        }
        this.selection.selectCell(first.row, first.col);
        this.grid.scrollToCell(first.row, first.col);
    }

    handleReplace({ query, replacement, matchCase, matchEntire, statusCallback }) {
        const activeCell = this.activeSheet.getCell(this.selection.activeCell.row, this.selection.activeCell.col);
        if (!activeCell) return;

        const cellStr = matchCase ? (activeCell.displayValue || '') : (activeCell.displayValue || '').toLowerCase();
        const q = matchCase ? query : query.toLowerCase();

        if (matchEntire ? (cellStr === q) : cellStr.includes(q)) {
            const newVal = activeCell.displayValue.replace(new RegExp(query, matchCase ? 'g' : 'gi'), replacement);
            this.commitCellValue(this.selection.activeCell.row, this.selection.activeCell.col, newVal);
            if (statusCallback) statusCallback('Replaced 1 occurrence.');
            Toast.success('Replaced 1 match');
        }
    }

    handleReplaceAll({ query, replacement, matchCase, matchEntire, workbookScope, statusCallback }) {
        if (!query) return;
        const q = matchCase ? query : query.toLowerCase();
        let replaceCount = 0;

        const sheetsToSearch = workbookScope ? this.workbook.sheets : [this.activeSheet];

        sheetsToSearch.forEach(sh => {
            for (const cell of sh.cells.values()) {
                const cellStr = matchCase ? (cell.displayValue || '') : (cell.displayValue || '').toLowerCase();
                let isMatch = matchEntire ? (cellStr === q) : cellStr.includes(q);
                if (isMatch) {
                    const newVal = (cell.displayValue || '').replace(new RegExp(query, matchCase ? 'g' : 'gi'), replacement);
                    cell.setValue(newVal);
                    replaceCount++;
                }
            }
        });

        if (statusCallback) statusCallback(`Successfully replaced ${replaceCount} occurrences.`);
        this.recalculateAllSheets();
        this.grid.renderVirtual();
        this.scheduleAutoSave();
        Toast.success(`Replaced ${replaceCount} occurrences`);
    }

    handleMenuAction(action) {
        switch (action) {
            case 'file:new':
                if (confirm('Create a new blank spreadsheet? Any unsaved changes will be cleared.')) {
                    this.workbook = new Workbook('default_workbook', 'Untitled Spreadsheet');
                    this.workbook.addSheet('Sheet1');
                    this.switchSheet(this.workbook.activeSheetId);
                    this.scheduleAutoSave();
                    Toast.success('New spreadsheet created');
                }
                break;

            case 'file:importCsv':
                IOManager.openFileDialog('.csv,text/csv').then(res => {
                    if (res) {
                        const rows = IOManager.parseCSV(res.content);
                        const newSheet = this.workbook.addSheet(res.name.replace(/\.[^/.]+$/, ''));
                        rows.forEach((rowVals, r) => {
                            rowVals.forEach((val, c) => {
                                newSheet.setCellValue(r, c, val);
                            });
                        });
                        this.switchSheet(newSheet.id);
                        this.scheduleAutoSave();
                        Toast.success(`Imported CSV into "${newSheet.name}"`);
                    }
                });
                break;

            case 'file:importJson':
                IOManager.openFileDialog('.json,application/json').then(res => {
                    if (res) {
                        try {
                            const parsed = JSON.parse(res.content);
                            this.workbook = Workbook.fromJSON(parsed);
                            this.switchSheet(this.workbook.activeSheetId);
                            this.scheduleAutoSave();
                            Toast.success('Workbook restored from JSON');
                        } catch (e) {
                            Toast.error('Failed to parse SheetForge JSON file: ' + e.message);
                        }
                    }
                });
                break;

            case 'file:save':
                this.saveImmediately();
                Toast.success('Workbook saved to local storage');
                break;

            case 'file:exportCsv':
                const csvContent = IOManager.exportSheetToCSV(this.activeSheet);
                IOManager.downloadFile(csvContent, `${this.activeSheet.name}.csv`, 'text/csv;charset=utf-8;');
                Toast.success(`Exported ${this.activeSheet.name}.csv`);
                break;

            case 'file:exportJson':
                const jsonContent = JSON.stringify(this.workbook.toJSON(), null, 2);
                IOManager.downloadFile(jsonContent, `${this.workbook.title || 'sheetforge'}.json`, 'application/json');
                Toast.success('Exported complete workbook JSON');
                break;

            case 'file:print':
                IOManager.printSpreadsheet(this.activeSheet);
                break;

            case 'edit:undo': this.commandManager.undo(); break;
            case 'edit:redo': this.commandManager.redo(); break;
            case 'edit:cut': this.copySelection(true); break;
            case 'edit:copy': this.copySelection(false); break;
            case 'edit:paste': this.pasteClipboard(false); break;
            case 'edit:pasteValues': this.pasteClipboard(true); break;
            case 'edit:find': this.modals.openFindReplace(); break;
            case 'edit:clearContents': this.clearSelectionContents(); break;
            case 'edit:clearFormats': this.clearSelectionFormats(); break;
            case 'edit:clearAll': this.clearSelectionAll(); break;

            case 'view:toggleSidebar': this.sidebar.toggle(); break;
            case 'view:freezeRow':
                this.activeSheet.frozenRows = this.selection.activeCell.row + 1;
                this.grid.updateFreezeDividers();
                this.scheduleAutoSave();
                Toast.info(`Frozen top ${this.activeSheet.frozenRows} rows`);
                break;
            case 'view:freezeCol':
                this.activeSheet.frozenCols = this.selection.activeCell.col + 1;
                this.grid.updateFreezeDividers();
                this.scheduleAutoSave();
                Toast.info(`Frozen first ${this.activeSheet.frozenCols} columns`);
                break;
            case 'view:unfreeze':
                this.activeSheet.frozenRows = 0;
                this.activeSheet.frozenCols = 0;
                this.grid.updateFreezeDividers();
                this.scheduleAutoSave();
                Toast.info('Panes unfrozen');
                break;
            case 'view:zoom100': this.statusBar.setZoom(100); break;
            case 'view:fullscreen':
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                } else {
                    document.exitFullscreen().catch(() => {});
                }
                break;

            case 'insert:rowAbove':
                this.activeSheet.insertRows(this.selection.activeCell.row, 1);
                this.grid.recalculateDimensions();
                this.grid.renderAll();
                this.scheduleAutoSave();
                Toast.success('Row inserted above');
                break;
            case 'insert:rowBelow':
                this.activeSheet.insertRows(this.selection.activeCell.row + 1, 1);
                this.grid.recalculateDimensions();
                this.grid.renderAll();
                this.scheduleAutoSave();
                Toast.success('Row inserted below');
                break;
            case 'insert:colLeft':
                this.activeSheet.insertCols(this.selection.activeCell.col, 1);
                this.grid.recalculateDimensions();
                this.grid.renderAll();
                this.scheduleAutoSave();
                Toast.success('Column inserted left');
                break;
            case 'insert:colRight':
                this.activeSheet.insertCols(this.selection.activeCell.col + 1, 1);
                this.grid.recalculateDimensions();
                this.grid.renderAll();
                this.scheduleAutoSave();
                Toast.success('Column inserted right');
                break;
            case 'insert:chart':
                const addrObj = this.selection.getSelectedRangeAddress();
                this.chartManager.openModal(typeof addrObj === 'string' ? addrObj : addrObj.address);
                break;
            case 'insert:comment':
                this.sidebar.open();
                document.querySelector('.sf-sb-tab[data-tab="notes"]').click();
                break;
            case 'insert:sheet': this.addNewSheet(); break;

            case 'format:bold': this.toggleFormat('bold'); break;
            case 'format:italic': this.toggleFormat('italic'); break;
            case 'format:underline': this.toggleFormat('underline'); break;
            case 'format:strikethrough': this.toggleFormat('strikethrough'); break;
            case 'format:merge': this.toggleMergeSelection(); break;
            case 'format:wrapText': this.toggleFormat('wrapText'); break;
            case 'format:conditional': this.modals.openConditional(this.selection.getSelectedRangeAddress().address || 'A1:C10'); break;
            case 'format:clear': this.clearSelectionFormats(); break;

            case 'data:sortAsc': this.sortSelection('asc'); break;
            case 'data:sortDesc': this.sortSelection('desc'); break;
            case 'data:toggleFilter': this.toggleFilter(); break;
            case 'data:clearFilter': this.clearFilterOnCol(0); break;
            case 'data:validation': this.modals.openValidation(); break;
            case 'data:duplicates': this.modals.openDuplicates(); break;

            case 'help:shortcuts': this.modals.openShortcuts(); break;
            case 'help:formulas': this.modals.openFormulasGuide(); break;
            case 'help:demoData':
                if (confirm('Load executive demo financial models?')) {
                    this.workbook = DemoData.createDefaultWorkbook();
                    this.switchSheet(this.workbook.activeSheetId);
                    this.scheduleAutoSave();
                    Toast.success('Executive models loaded');
                }
                break;
            case 'help:about': this.modals.openAbout(); break;
        }
    }

    scheduleAutoSave() {
        this._setSaveBadge('Saving...');
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            this.saveImmediately();
        }, 400);
    }

    async saveImmediately() {
        if (!this.workbook) return;
        const serialized = this.workbook.toJSON();
        await this.storage.saveWorkbook(serialized);
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

// Bootstrap application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    window.sheetForge = new SheetForgeApp();
    window.sheetForge.init();
});
