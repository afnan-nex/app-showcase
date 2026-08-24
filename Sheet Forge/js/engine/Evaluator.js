/**
 * SheetForge - Formula Evaluator
 * Comprehensive calculation engine with 35+ Excel functions, ranges, and cross-sheet references
 */
import { ASTNodeType, Parser } from './Parser.js';
import { parseCellAddress, formatCellAddress, letterToColIndex, colIndexToLetter } from '../model/Sheet.js';

export const FormulaErrors = Object.freeze({
    DIV_ZERO: '#DIV/0!',
    VALUE: '#VALUE!',
    REF: '#REF!',
    NAME: '#NAME?',
    NUM: '#NUM!',
    NA: '#N/A!',
    ERROR: '#ERROR!',
    CYCLE: '#CYCLE!'
});

export class Evaluator {
    constructor(workbook = null) {
        this.workbook = workbook;
        this.functions = new Map();
        this._registerBuiltInFunctions();
    }

    setWorkbook(wb) {
        this.workbook = wb;
    }

    evaluateFormula(formulaStr, activeSheet, contextCell = null, visited = new Set()) {
        if (!formulaStr || typeof formulaStr !== 'string') return '';
        if (!formulaStr.startsWith('=')) return formulaStr;

        // Circular reference detection
        const cellId = contextCell ? `${activeSheet.id}:${contextCell.row},${contextCell.col}` : null;
        if (cellId) {
            if (visited.has(cellId)) {
                return FormulaErrors.CYCLE;
            }
            visited.add(cellId);
        }

        try {
            const parser = new Parser(formulaStr);
            const ast = parser.parse();
            if (!ast) return '';
            const result = this.evaluateNode(ast, activeSheet, contextCell, visited);
            return result;
        } catch (err) {
            // Check if error is standard formula error or parse issue
            if (Object.values(FormulaErrors).includes(err.message)) {
                return err.message;
            }
            if (err.message && err.message.includes('Unknown function')) {
                return FormulaErrors.NAME;
            }
            return FormulaErrors.ERROR;
        } finally {
            if (cellId) {
                visited.delete(cellId);
            }
        }
    }

    evaluateNode(node, activeSheet, contextCell, visited) {
        if (!node) return null;

        switch (node.type) {
            case ASTNodeType.LITERAL:
                return node.value;

            case ASTNodeType.CELL_REF: {
                return this.resolveCellRefValue(node.ref, activeSheet, visited);
            }

            case ASTNodeType.RANGE_REF: {
                return this.resolveRangeValues(node.ref, activeSheet, visited);
            }

            case ASTNodeType.SHEET_REF: {
                const targetSheet = this.workbook ? this.workbook.getSheetByName(node.sheet) : null;
                if (!targetSheet) {
                    throw new Error(FormulaErrors.REF);
                }
                if (node.isRange) {
                    return this.resolveRangeValues(node.ref, targetSheet, visited);
                } else {
                    return this.resolveCellRefValue(node.ref, targetSheet, visited);
                }
            }

            case ASTNodeType.UNARY_OP: {
                const val = this.evaluateNode(node.expr, activeSheet, contextCell, visited);
                if (typeof val === 'string' && Object.values(FormulaErrors).includes(val)) return val;

                if (node.op === '-') {
                    const num = this.toNumber(val);
                    if (isNaN(num)) throw new Error(FormulaErrors.VALUE);
                    return -num;
                }
                if (node.op === '+') {
                    const num = this.toNumber(val);
                    if (isNaN(num)) throw new Error(FormulaErrors.VALUE);
                    return num;
                }
                if (node.op === '%') {
                    const num = this.toNumber(val);
                    if (isNaN(num)) throw new Error(FormulaErrors.VALUE);
                    return num / 100;
                }
                return val;
            }

            case ASTNodeType.BINARY_OP: {
                const left = this.evaluateNode(node.left, activeSheet, contextCell, visited);
                if (typeof left === 'string' && Object.values(FormulaErrors).includes(left)) return left;

                const right = this.evaluateNode(node.right, activeSheet, contextCell, visited);
                if (typeof right === 'string' && Object.values(FormulaErrors).includes(right)) return right;

                return this.evaluateBinaryOp(node.op, left, right);
            }

            case ASTNodeType.FUNCTION_CALL: {
                return this.evaluateFunction(node.name, node.args, activeSheet, contextCell, visited);
            }

            default:
                throw new Error(FormulaErrors.ERROR);
        }
    }

    resolveCellRefValue(refStr, sheet, visited) {
        const addr = parseCellAddress(refStr);
        if (!addr) throw new Error(FormulaErrors.REF);

        const cell = sheet.getCell(addr.row, addr.col);
        if (!cell) return '';

        if (cell.isFormula) {
            const cellId = `${sheet.id}:${addr.row},${addr.col}`;
            if (visited.has(cellId)) {
                return FormulaErrors.CYCLE;
            }
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
                        if (visited.has(cellId)) {
                            val = FormulaErrors.CYCLE;
                        } else {
                            val = this.evaluateFormula(cell.formula, sheet, cell, visited);
                        }
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
        // String concatenation
        if (op === '&') {
            return `${left !== null && left !== undefined ? left : ''}${right !== null && right !== undefined ? right : ''}`;
        }

        // Comparison operations
        if (['=', '<>', '!=', '<', '<=', '>', '>='].includes(op)) {
            let l = left, r = right;
            const numL = this.toNumber(l);
            const numR = this.toNumber(r);
            if (!isNaN(numL) && !isNaN(numR) && l !== '' && r !== '') {
                l = numL;
                r = numR;
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

        // Arithmetic operations
        const numL = this.toNumber(left);
        const numR = this.toNumber(right);

        if (isNaN(numL) || isNaN(numR)) {
            throw new Error(FormulaErrors.VALUE);
        }

        switch (op) {
            case '+': return numL + numR;
            case '-': return numL - numR;
            case '*': return numL * numR;
            case '/':
                if (numR === 0) throw new Error(FormulaErrors.DIV_ZERO);
                return numL / numR;
            case '^': return Math.pow(numL, numR);
            default:
                throw new Error(FormulaErrors.ERROR);
        }
    }

    evaluateFunction(name, argNodes, activeSheet, contextCell, visited) {
        const fnName = name.toUpperCase();

        // Special lazy evaluation for IF and IFS
        if (fnName === 'IF') {
            if (argNodes.length < 2 || argNodes.length > 3) throw new Error(FormulaErrors.VALUE);
            const cond = this.evaluateNode(argNodes[0], activeSheet, contextCell, visited);
            if (this.isTruthy(cond)) {
                return this.evaluateNode(argNodes[1], activeSheet, contextCell, visited);
            } else {
                return argNodes.length === 3 ? this.evaluateNode(argNodes[2], activeSheet, contextCell, visited) : false;
            }
        }

        if (fnName === 'IFS') {
            if (argNodes.length % 2 !== 0) throw new Error(FormulaErrors.VALUE);
            for (let i = 0; i < argNodes.length; i += 2) {
                const cond = this.evaluateNode(argNodes[i], activeSheet, contextCell, visited);
                if (this.isTruthy(cond)) {
                    return this.evaluateNode(argNodes[i + 1], activeSheet, contextCell, visited);
                }
            }
            throw new Error(FormulaErrors.NA);
        }

        if (fnName === 'IFERROR') {
            if (argNodes.length !== 2) throw new Error(FormulaErrors.VALUE);
            try {
                const val = this.evaluateNode(argNodes[0], activeSheet, contextCell, visited);
                if (typeof val === 'string' && Object.values(FormulaErrors).includes(val)) {
                    return this.evaluateNode(argNodes[1], activeSheet, contextCell, visited);
                }
                return val;
            } catch {
                return this.evaluateNode(argNodes[1], activeSheet, contextCell, visited);
            }
        }

        // Standard evaluation: evaluate all arguments
        const args = argNodes.map(node => this.evaluateNode(node, activeSheet, contextCell, visited));

        const fn = this.functions.get(fnName);
        if (!fn) {
            throw new Error(`Unknown function: ${fnName}`);
        }

        return fn(args, { activeSheet, contextCell, evaluator: this });
    }

    // Flatten multi-dimensional array or matrix of values to 1D
    flattenArgs(args) {
        const result = [];
        const recurse = (item) => {
            if (Array.isArray(item)) {
                for (const sub of item) {
                    recurse(sub);
                }
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
        // --- MATH & STATS ---
        this.functions.set('SUM', (args) => {
            const items = this.flattenArgs(args);
            let sum = 0;
            for (const item of items) {
                const num = this.toNumber(item);
                if (!isNaN(num) && item !== '' && item !== null) {
                    sum += num;
                }
            }
            return sum;
        });

        this.functions.set('AVERAGE', (args) => {
            const items = this.flattenArgs(args);
            let sum = 0, count = 0;
            for (const item of items) {
                if (item !== '' && item !== null && item !== undefined) {
                    const num = this.toNumber(item);
                    if (!isNaN(num)) {
                        sum += num;
                        count++;
                    }
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
                if (item !== '' && item !== null && item !== undefined) {
                    const num = Number(item);
                    if (!isNaN(num)) count++;
                }
            }
            return count;
        });

        this.functions.set('COUNTA', (args) => {
            const items = this.flattenArgs(args);
            let count = 0;
            for (const item of items) {
                if (item !== '' && item !== null && item !== undefined) {
                    count++;
                }
            }
            return count;
        });

        this.functions.set('COUNTIF', (args) => {
            if (args.length !== 2) throw new Error(FormulaErrors.VALUE);
            const range = this.flattenArgs(args[0]);
            const criteria = args[1];
            let count = 0;
            for (const cellVal of range) {
                if (this.matchCriteria(cellVal, criteria)) {
                    count++;
                }
            }
            return count;
        });

        this.functions.set('SUMIF', (args) => {
            if (args.length < 2 || args.length > 3) throw new Error(FormulaErrors.VALUE);
            const range = this.flattenArgs(args[0]);
            const criteria = args[1];
            const sumRange = args.length === 3 ? this.flattenArgs(args[2]) : range;

            let sum = 0;
            for (let i = 0; i < range.length; i++) {
                if (this.matchCriteria(range[i], criteria)) {
                    const num = this.toNumber(sumRange[i]);
                    if (!isNaN(num)) sum += num;
                }
            }
            return sum;
        });

        this.functions.set('ROUND', (args) => {
            if (args.length < 1) throw new Error(FormulaErrors.VALUE);
            const num = this.toNumber(args[0]);
            const decimals = args.length > 1 ? this.toNumber(args[1]) : 0;
            if (isNaN(num) || isNaN(decimals)) throw new Error(FormulaErrors.VALUE);
            const factor = Math.pow(10, decimals);
            return Math.round(num * factor) / factor;
        });

        this.functions.set('ROUNDUP', (args) => {
            if (args.length < 1) throw new Error(FormulaErrors.VALUE);
            const num = this.toNumber(args[0]);
            const decimals = args.length > 1 ? this.toNumber(args[1]) : 0;
            const factor = Math.pow(10, decimals);
            return Math.ceil(num * factor) / factor;
        });

        this.functions.set('ROUNDDOWN', (args) => {
            if (args.length < 1) throw new Error(FormulaErrors.VALUE);
            const num = this.toNumber(args[0]);
            const decimals = args.length > 1 ? this.toNumber(args[1]) : 0;
            const factor = Math.pow(10, decimals);
            return Math.floor(num * factor) / factor;
        });

        this.functions.set('ABS', (args) => {
            const num = this.toNumber(args[0]);
            if (isNaN(num)) throw new Error(FormulaErrors.VALUE);
            return Math.abs(num);
        });

        this.functions.set('SQRT', (args) => {
            const num = this.toNumber(args[0]);
            if (isNaN(num) || num < 0) throw new Error(FormulaErrors.NUM);
            return Math.sqrt(num);
        });

        this.functions.set('POWER', (args) => {
            if (args.length !== 2) throw new Error(FormulaErrors.VALUE);
            const base = this.toNumber(args[0]);
            const exp = this.toNumber(args[1]);
            return Math.pow(base, exp);
        });

        this.functions.set('MOD', (args) => {
            if (args.length !== 2) throw new Error(FormulaErrors.VALUE);
            const n = this.toNumber(args[0]);
            const d = this.toNumber(args[1]);
            if (d === 0) throw new Error(FormulaErrors.DIV_ZERO);
            return ((n % d) + d) % d;
        });

        this.functions.set('PRODUCT', (args) => {
            const items = this.flattenArgs(args);
            let prod = 1, hasItem = false;
            for (const item of items) {
                if (item !== '' && item !== null && item !== undefined) {
                    const num = this.toNumber(item);
                    if (!isNaN(num)) {
                        prod *= num;
                        hasItem = true;
                    }
                }
            }
            return hasItem ? prod : 0;
        });

        this.functions.set('MEDIAN', (args) => {
            const items = this.flattenArgs(args).map(v => this.toNumber(v)).filter(v => !isNaN(v));
            if (items.length === 0) throw new Error(FormulaErrors.NUM);
            items.sort((a, b) => a - b);
            const mid = Math.floor(items.length / 2);
            return items.length % 2 !== 0 ? items[mid] : (items[mid - 1] + items[mid]) / 2;
        });

        this.functions.set('FLOOR', (args) => {
            const num = this.toNumber(args[0]);
            const sig = args.length > 1 ? this.toNumber(args[1]) : 1;
            if (sig === 0) throw new Error(FormulaErrors.DIV_ZERO);
            return Math.floor(num / sig) * sig;
        });

        this.functions.set('CEILING', (args) => {
            const num = this.toNumber(args[0]);
            const sig = args.length > 1 ? this.toNumber(args[1]) : 1;
            if (sig === 0) throw new Error(FormulaErrors.DIV_ZERO);
            return Math.ceil(num / sig) * sig;
        });

        // --- LOGICAL ---
        this.functions.set('AND', (args) => {
            const items = this.flattenArgs(args);
            if (items.length === 0) throw new Error(FormulaErrors.VALUE);
            return items.every(i => this.isTruthy(i));
        });

        this.functions.set('OR', (args) => {
            const items = this.flattenArgs(args);
            if (items.length === 0) throw new Error(FormulaErrors.VALUE);
            return items.some(i => this.isTruthy(i));
        });

        this.functions.set('NOT', (args) => {
            if (args.length !== 1) throw new Error(FormulaErrors.VALUE);
            return !this.isTruthy(args[0]);
        });

        this.functions.set('TRUE', () => true);
        this.functions.set('FALSE', () => false);

        // --- TEXT ---
        this.functions.set('CONCAT', (args) => {
            const items = this.flattenArgs(args);
            return items.map(i => (i !== null && i !== undefined ? String(i) : '')).join('');
        });

        this.functions.set('CONCATENATE', (args) => {
            const items = this.flattenArgs(args);
            return items.map(i => (i !== null && i !== undefined ? String(i) : '')).join('');
        });

        this.functions.set('LEFT', (args) => {
            if (args.length < 1) throw new Error(FormulaErrors.VALUE);
            const str = String(args[0] || '');
            const len = args.length > 1 ? this.toNumber(args[1]) : 1;
            return str.substr(0, Math.max(0, len));
        });

        this.functions.set('RIGHT', (args) => {
            if (args.length < 1) throw new Error(FormulaErrors.VALUE);
            const str = String(args[0] || '');
            const len = args.length > 1 ? this.toNumber(args[1]) : 1;
            return str.substr(Math.max(0, str.length - len));
        });

        this.functions.set('MID', (args) => {
            if (args.length < 3) throw new Error(FormulaErrors.VALUE);
            const str = String(args[0] || '');
            const start = Math.max(1, this.toNumber(args[1])) - 1; // 1-indexed in Excel
            const len = Math.max(0, this.toNumber(args[2]));
            return str.substr(start, len);
        });

        this.functions.set('LEN', (args) => {
            if (args.length !== 1) throw new Error(FormulaErrors.VALUE);
            return String(args[0] !== null && args[0] !== undefined ? args[0] : '').length;
        });

        this.functions.set('UPPER', (args) => {
            return String(args[0] || '').toUpperCase();
        });

        this.functions.set('LOWER', (args) => {
            return String(args[0] || '').toLowerCase();
        });

        this.functions.set('PROPER', (args) => {
            return String(args[0] || '').replace(/\b\w/g, c => c.toUpperCase());
        });

        this.functions.set('TRIM', (args) => {
            return String(args[0] || '').trim().replace(/\s+/g, ' ');
        });

        this.functions.set('REPLACE', (args) => {
            if (args.length !== 4) throw new Error(FormulaErrors.VALUE);
            const oldStr = String(args[0] || '');
            const start = Math.max(1, this.toNumber(args[1])) - 1;
            const numChars = Math.max(0, this.toNumber(args[2]));
            const newStr = String(args[3] || '');
            return oldStr.substring(0, start) + newStr + oldStr.substring(start + numChars);
        });

        this.functions.set('SUBSTITUTE', (args) => {
            if (args.length < 3) throw new Error(FormulaErrors.VALUE);
            const text = String(args[0] || '');
            const oldText = String(args[1] || '');
            const newText = String(args[2] || '');
            return text.split(oldText).join(newText);
        });

        // --- LOOKUP & REFERENCE ---
        this.functions.set('VLOOKUP', (args) => {
            if (args.length < 3 || args.length > 4) throw new Error(FormulaErrors.VALUE);
            const lookupVal = args[0];
            const table = args[1]; // matrix
            const colIndex = this.toNumber(args[2]) - 1; // 1-indexed in Excel
            const exactMatch = args.length === 4 ? !this.isTruthy(args[3]) : true;

            if (!Array.isArray(table) || table.length === 0) throw new Error(FormulaErrors.REF);
            if (colIndex < 0 || colIndex >= (table[0] ? table[0].length : 0)) throw new Error(FormulaErrors.REF);

            for (let r = 0; r < table.length; r++) {
                const candidate = table[r][0];
                if (this.isEqual(candidate, lookupVal, exactMatch)) {
                    return table[r][colIndex];
                }
            }
            throw new Error(FormulaErrors.NA);
        });

        this.functions.set('HLOOKUP', (args) => {
            if (args.length < 3 || args.length > 4) throw new Error(FormulaErrors.VALUE);
            const lookupVal = args[0];
            const table = args[1]; // matrix
            const rowIndex = this.toNumber(args[2]) - 1;
            const exactMatch = args.length === 4 ? !this.isTruthy(args[3]) : true;

            if (!Array.isArray(table) || rowIndex < 0 || rowIndex >= table.length) throw new Error(FormulaErrors.REF);

            const firstRow = table[0];
            for (let c = 0; c < firstRow.length; c++) {
                if (this.isEqual(firstRow[c], lookupVal, exactMatch)) {
                    return table[rowIndex][c];
                }
            }
            throw new Error(FormulaErrors.NA);
        });

        this.functions.set('INDEX', (args) => {
            if (args.length < 2) throw new Error(FormulaErrors.VALUE);
            const matrix = args[0];
            const rowNum = this.toNumber(args[1]) - 1;
            const colNum = args.length > 2 ? this.toNumber(args[2]) - 1 : 0;

            if (!Array.isArray(matrix)) throw new Error(FormulaErrors.REF);
            if (rowNum < 0 || rowNum >= matrix.length) throw new Error(FormulaErrors.REF);
            const row = matrix[rowNum];
            if (Array.isArray(row)) {
                if (colNum < 0 || colNum >= row.length) throw new Error(FormulaErrors.REF);
                return row[colNum];
            }
            return row;
        });

        this.functions.set('MATCH', (args) => {
            if (args.length < 2) throw new Error(FormulaErrors.VALUE);
            const lookupVal = args[0];
            const range = this.flattenArgs(args[1]);
            for (let i = 0; i < range.length; i++) {
                if (this.isEqual(range[i], lookupVal, true)) {
                    return i + 1; // 1-indexed in Excel
                }
            }
            throw new Error(FormulaErrors.NA);
        });

        this.functions.set('ROW', (args, { contextCell }) => {
            return contextCell ? contextCell.row + 1 : 1;
        });

        this.functions.set('COLUMN', (args, { contextCell }) => {
            return contextCell ? contextCell.col + 1 : 1;
        });

        // --- DATE & TIME ---
        this.functions.set('TODAY', () => {
            const d = new Date();
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        });

        this.functions.set('NOW', () => {
            const d = new Date();
            return d.toISOString().replace('T', ' ').substr(0, 19);
        });

        this.functions.set('DATE', (args) => {
            if (args.length !== 3) throw new Error(FormulaErrors.VALUE);
            const y = this.toNumber(args[0]);
            const m = this.toNumber(args[1]);
            const d = this.toNumber(args[2]);
            return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        });

        this.functions.set('YEAR', (args) => {
            const d = new Date(args[0]);
            return isNaN(d.getTime()) ? FormulaErrors.VALUE : d.getFullYear();
        });

        this.functions.set('MONTH', (args) => {
            const d = new Date(args[0]);
            return isNaN(d.getTime()) ? FormulaErrors.VALUE : d.getMonth() + 1;
        });

        this.functions.set('DAY', (args) => {
            const d = new Date(args[0]);
            return isNaN(d.getTime()) ? FormulaErrors.VALUE : d.getDate();
        });

        // --- INFORMATION ---
        this.functions.set('ISNUMBER', (args) => {
            return typeof args[0] === 'number' && !isNaN(args[0]);
        });

        this.functions.set('ISTEXT', (args) => {
            return typeof args[0] === 'string' && !Object.values(FormulaErrors).includes(args[0]);
        });

        this.functions.set('ISBLANK', (args) => {
            return args[0] === '' || args[0] === null || args[0] === undefined;
        });

        this.functions.set('ISERROR', (args) => {
            return typeof args[0] === 'string' && Object.values(FormulaErrors).includes(args[0]);
        });
    }

    matchCriteria(val, criteria) {
        if (criteria === undefined || criteria === null || criteria === '') return true;
        const strVal = String(val || '');
        const strCrit = String(criteria);

        // Check for comparison prefixes like ">10", "<=5", "<>0"
        const compMatch = strCrit.match(/^([><]=?|<>|!=|=)(.+)$/);
        if (compMatch) {
            const op = compMatch[1];
            const targetNum = Number(compMatch[2]);
            const numVal = Number(val);

            if (!isNaN(targetNum) && !isNaN(numVal)) {
                switch (op) {
                    case '>': return numVal > targetNum;
                    case '>=': return numVal >= targetNum;
                    case '<': return numVal < targetNum;
                    case '<=': return numVal <= targetNum;
                    case '<>':
                    case '!=': return numVal !== targetNum;
                    case '=': return numVal === targetNum;
                }
            }
        }

        // Wildcard or case-insensitive string match
        if (strCrit.includes('*') || strCrit.includes('?')) {
            const regexStr = '^' + strCrit.replace(/\./g, '\\.').replace(/\*/g, '.*').replace(/\?/g, '.') + '$';
            const re = new RegExp(regexStr, 'i');
            return re.test(strVal);
        }

        return strVal.toLowerCase() === strCrit.toLowerCase();
    }

    isEqual(a, b, exactMatch = true) {
        if (a === b) return true;
        const numA = Number(a);
        const numB = Number(b);
        if (!isNaN(numA) && !isNaN(numB) && a !== '' && b !== '') {
            return numA === numB;
        }
        return String(a || '').toLowerCase() === String(b || '').toLowerCase();
    }
}
