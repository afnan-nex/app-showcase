/**
 * SheetForge - Dependency Graph & Recalculation Engine
 * Reactive Directed Acyclic Graph (DAG) for cell dependency tracking & topological sorting
 */
import { Tokenizer, TokenType } from './Tokenizer.js';
import { parseCellAddress } from '../model/Sheet.js';

export class DependencyGraph {
    constructor(workbook = null) {
        this.workbook = workbook;
        // Map: nodeKey ("sheetId:r,c") -> Set of nodeKeys that depend on this cell
        this.dependents = new Map();
        // Map: nodeKey -> Set of nodeKeys that this cell depends on
        this.dependencies = new Map();
    }

    setWorkbook(wb) {
        this.workbook = wb;
    }

    makeKey(sheetId, r, c) {
        return `${sheetId}:${r},${c}`;
    }

    parseKey(key) {
        const [sheetId, coord] = key.split(':');
        const [r, c] = coord.split(',').map(Number);
        return { sheetId, r, c };
    }

    // Extract all referenced cell keys from a formula
    extractDependencies(formula, defaultSheet) {
        if (!formula || typeof formula !== 'string' || !formula.startsWith('=')) {
            return [];
        }

        const refs = [];
        try {
            const tokenizer = new Tokenizer(formula);
            const tokens = tokenizer.tokenize();

            for (const token of tokens) {
                if (token.type === TokenType.CELL_REF) {
                    const addr = parseCellAddress(token.value);
                    if (addr) {
                        refs.push(this.makeKey(defaultSheet.id, addr.row, addr.col));
                    }
                } else if (token.type === TokenType.RANGE_REF) {
                    const parts = token.value.split(':');
                    if (parts.length === 2) {
                        const start = parseCellAddress(parts[0]);
                        const end = parseCellAddress(parts[1]);
                        if (start && end) {
                            const r1 = Math.min(start.row, end.row);
                            const r2 = Math.max(start.row, end.row);
                            const c1 = Math.min(start.col, end.col);
                            const c2 = Math.max(start.col, end.col);
                            for (let r = r1; r <= r2; r++) {
                                for (let c = c1; c <= c2; c++) {
                                    refs.push(this.makeKey(defaultSheet.id, r, c));
                                }
                            }
                        }
                    }
                } else if (token.type === TokenType.SHEET_REF) {
                    const targetSheet = this.workbook ? this.workbook.getSheetByName(token.value.sheet) : null;
                    const sheetId = targetSheet ? targetSheet.id : defaultSheet.id;
                    if (token.value.isRange) {
                        const parts = token.value.ref.split(':');
                        if (parts.length === 2) {
                            const start = parseCellAddress(parts[0]);
                            const end = parseCellAddress(parts[1]);
                            if (start && end) {
                                const r1 = Math.min(start.row, end.row);
                                const r2 = Math.max(start.row, end.row);
                                const c1 = Math.min(start.col, end.col);
                                const c2 = Math.max(start.col, end.col);
                                for (let r = r1; r <= r2; r++) {
                                    for (let c = c1; c <= c2; c++) {
                                        refs.push(this.makeKey(sheetId, r, c));
                                    }
                                }
                            }
                        }
                    } else {
                        const addr = parseCellAddress(token.value.ref);
                        if (addr) {
                            refs.push(this.makeKey(sheetId, addr.row, addr.col));
                        }
                    }
                }
            }
        } catch (e) {
            console.warn('Failed to extract formula dependencies:', e);
        }

        return refs;
    }

    // Update dependencies when a cell formula changes
    updateCell(sheet, r, c, formula) {
        const nodeKey = this.makeKey(sheet.id, r, c);

        // Remove old dependencies
        const oldDeps = this.dependencies.get(nodeKey) || new Set();
        for (const dep of oldDeps) {
            const depSet = this.dependents.get(dep);
            if (depSet) {
                depSet.delete(nodeKey);
                if (depSet.size === 0) this.dependents.delete(dep);
            }
        }
        this.dependencies.delete(nodeKey);

        // Register new dependencies
        if (formula && typeof formula === 'string' && formula.startsWith('=')) {
            const newDeps = this.extractDependencies(formula, sheet);
            const depSet = new Set(newDeps);
            this.dependencies.set(nodeKey, depSet);

            for (const dep of depSet) {
                if (!this.dependents.has(dep)) {
                    this.dependents.set(dep, new Set());
                }
                this.dependents.get(dep).add(nodeKey);
            }
        }
    }

    // Full graph rebuild from workbook
    buildGraph(workbook) {
        this.workbook = workbook;
        this.dependents.clear();
        this.dependencies.clear();

        for (const sheet of workbook.sheets) {
            for (const cell of sheet.cells.values()) {
                if (cell.isFormula) {
                    this.updateCell(sheet, cell.row, cell.col, cell.formula);
                }
            }
        }
    }

    // Get all cells that need recalculation in topological order starting from changed cells
    getRecalculationOrder(changedKeys) {
        const visited = new Set();
        const visiting = new Set();
        const order = [];
        const cycles = new Set();

        const visit = (key) => {
            if (visiting.has(key)) {
                cycles.add(key);
                return;
            }
            if (visited.has(key)) return;

            visiting.add(key);

            const directDependents = this.dependents.get(key);
            if (directDependents) {
                for (const dep of directDependents) {
                    visit(dep);
                }
            }

            visiting.delete(key);
            visited.add(key);
            order.unshift(key); // Post-order reversed = topological
        };

        for (const key of changedKeys) {
            visit(key);
        }

        return { order, cycles };
    }

    // Recalculate changed cells and all their dependents
    recalculate(changedKeys, evaluator) {
        const { order, cycles } = this.getRecalculationOrder(changedKeys);

        // Mark cycle cells with error
        for (const cycleKey of cycles) {
            const { sheetId, r, c } = this.parseKey(cycleKey);
            const sheet = this.workbook.getSheetById(sheetId);
            if (sheet) {
                const cell = sheet.getCell(r, c);
                if (cell) cell.error = '#CYCLE!';
            }
        }

        // Recalculate dependents
        const updatedCells = [];
        for (const key of order) {
            const { sheetId, r, c } = this.parseKey(key);
            const sheet = this.workbook.getSheetById(sheetId);
            if (!sheet) continue;

            const cell = sheet.getCell(r, c);
            if (cell && cell.isFormula) {
                const result = evaluator.evaluateFormula(cell.formula, sheet, cell);
                if (typeof result === 'string' && result.startsWith('#')) {
                    cell.error = result;
                    cell.computedValue = null;
                } else {
                    cell.error = null;
                    cell.computedValue = result;
                }
                updatedCells.push({ sheetId, r, c, cell });
            }
        }

        return updatedCells;
    }
}
