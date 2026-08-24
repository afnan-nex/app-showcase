/**
 * SheetForge - AutoFill Engine
 * Intelligent series extrapolation and formula relative reference shifter for drag-to-fill
 */
import { parseCellAddress, formatCellAddress } from '../model/Sheet.js';

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export class AutoFill {
    /**
     * Shifts cell references in a formula by dRow and dCol while honoring absolute $ symbols
     */
    static shiftFormula(formula, dRow, dCol) {
        if (!formula || !formula.startsWith('=')) return formula;

        // Regex matches cell references: e.g. $A$1, A$1, $A1, A1 (not preceded by alphanumeric/sheet)
        return formula.replace(/(?<![A-Za-z0-9_!'"])([$]?)([A-Za-z]+)([$]?)([0-9]+)/g, (match, colAbs, colStr, rowAbs, rowStr) => {
            const addr = parseCellAddress(match);
            if (!addr) return match;

            const newCol = addr.absCol ? addr.col : Math.max(0, addr.col + dCol);
            const newRow = addr.absRow ? addr.row : Math.max(0, addr.row + dRow);

            return formatCellAddress(newRow, newCol, addr.absRow, addr.absCol);
        });
    }

    /**
     * Predicts values for a target range based on source range sequence
     */
    static extrapolate(sourceCells, targetCoords, isVertical = true) {
        if (!sourceCells || sourceCells.length === 0 || !targetCoords || targetCoords.length === 0) {
            return [];
        }

        const results = [];
        const sourceLen = sourceCells.length;

        // Case 1: All source items are formulas
        const hasFormulas = sourceCells.some(c => c && c.formula);
        if (hasFormulas) {
            for (let i = 0; i < targetCoords.length; i++) {
                const target = targetCoords[i];
                const srcIndex = i % sourceLen;
                const src = sourceCells[srcIndex];

                if (src && src.formula) {
                    const dRow = target.row - src.row;
                    const dCol = target.col - src.col;
                    const shifted = this.shiftFormula(src.formula, dRow, dCol);
                    results.push({
                        row: target.row,
                        col: target.col,
                        formula: shifted,
                        rawValue: shifted,
                        style: src.style,
                        numFormat: src.numFormat
                    });
                } else {
                    results.push({
                        row: target.row,
                        col: target.col,
                        rawValue: src ? src.rawValue : '',
                        formula: '',
                        style: src ? src.style : null,
                        numFormat: src ? src.numFormat : 'general'
                    });
                }
            }
            return results;
        }

        // Case 2: Number sequence extrapolation
        const rawValues = sourceCells.map(c => c ? c.rawValue : '');
        const numbers = rawValues.map(v => (v !== '' && v !== null && !isNaN(Number(v)) ? Number(v) : null));
        const allNumbers = numbers.every(n => n !== null);

        if (allNumbers) {
            let step = 1;
            if (numbers.length >= 2) {
                step = (numbers[numbers.length - 1] - numbers[0]) / (numbers.length - 1);
            }
            const lastVal = numbers[numbers.length - 1];

            for (let i = 0; i < targetCoords.length; i++) {
                const target = targetCoords[i];
                const nextVal = lastVal + step * (i + 1);
                const srcRef = sourceCells[i % sourceLen];
                results.push({
                    row: target.row,
                    col: target.col,
                    rawValue: Number.isInteger(nextVal) ? nextVal : parseFloat(nextVal.toFixed(6)),
                    formula: '',
                    style: srcRef ? srcRef.style : null,
                    numFormat: srcRef ? srcRef.numFormat : 'general'
                });
            }
            return results;
        }

        // Case 3: Day of week sequence
        const daysIndex = rawValues.map(v => {
            const str = String(v).trim();
            const si = DAYS_SHORT.findIndex(d => d.toLowerCase() === str.toLowerCase());
            if (si !== -1) return { type: 'short', idx: si };
            const li = DAYS_LONG.findIndex(d => d.toLowerCase() === str.toLowerCase());
            if (li !== -1) return { type: 'long', idx: li };
            return null;
        });

        if (daysIndex.every(d => d !== null)) {
            let step = 1;
            if (daysIndex.length >= 2) {
                step = (daysIndex[daysIndex.length - 1].idx - daysIndex[0].idx) / (daysIndex.length - 1);
            }
            const last = daysIndex[daysIndex.length - 1];

            for (let i = 0; i < targetCoords.length; i++) {
                const target = targetCoords[i];
                const nextIdx = (((last.idx + step * (i + 1)) % 7) + 7) % 7;
                const nextName = last.type === 'short' ? DAYS_SHORT[Math.round(nextIdx)] : DAYS_LONG[Math.round(nextIdx)];
                const srcRef = sourceCells[i % sourceLen];
                results.push({
                    row: target.row,
                    col: target.col,
                    rawValue: nextName,
                    formula: '',
                    style: srcRef ? srcRef.style : null,
                    numFormat: 'text'
                });
            }
            return results;
        }

        // Case 4: Month sequence
        const monthsIndex = rawValues.map(v => {
            const str = String(v).trim();
            const si = MONTHS_SHORT.findIndex(m => m.toLowerCase() === str.toLowerCase());
            if (si !== -1) return { type: 'short', idx: si };
            const li = MONTHS_LONG.findIndex(m => m.toLowerCase() === str.toLowerCase());
            if (li !== -1) return { type: 'long', idx: li };
            return null;
        });

        if (monthsIndex.every(m => m !== null)) {
            let step = 1;
            if (monthsIndex.length >= 2) {
                step = (monthsIndex[monthsIndex.length - 1].idx - monthsIndex[0].idx) / (monthsIndex.length - 1);
            }
            const last = monthsIndex[monthsIndex.length - 1];

            for (let i = 0; i < targetCoords.length; i++) {
                const target = targetCoords[i];
                const nextIdx = (((last.idx + step * (i + 1)) % 12) + 12) % 12;
                const nextName = last.type === 'short' ? MONTHS_SHORT[Math.round(nextIdx)] : MONTHS_LONG[Math.round(nextIdx)];
                const srcRef = sourceCells[i % sourceLen];
                results.push({
                    row: target.row,
                    col: target.col,
                    rawValue: nextName,
                    formula: '',
                    style: srcRef ? srcRef.style : null,
                    numFormat: 'text'
                });
            }
            return results;
        }

        // Case 5: Pattern with trailing number (e.g. "Q1", "Item 1", "User 001")
        const patternMatch = String(rawValues[rawValues.length - 1]).match(/^(.*?)(\d+)$/);
        if (patternMatch) {
            const prefix = patternMatch[1];
            const numStr = patternMatch[2];
            const startNum = parseInt(numStr, 10);
            const padLen = numStr.length;

            for (let i = 0; i < targetCoords.length; i++) {
                const target = targetCoords[i];
                const nextNum = startNum + (i + 1);
                const formattedNum = String(nextNum).padStart(padLen, '0');
                const srcRef = sourceCells[i % sourceLen];
                results.push({
                    row: target.row,
                    col: target.col,
                    rawValue: `${prefix}${formattedNum}`,
                    formula: '',
                    style: srcRef ? srcRef.style : null,
                    numFormat: 'text'
                });
            }
            return results;
        }

        // Fallback: Repeat source cells in cycle
        for (let i = 0; i < targetCoords.length; i++) {
            const target = targetCoords[i];
            const src = sourceCells[i % sourceLen];
            results.push({
                row: target.row,
                col: target.col,
                rawValue: src ? src.rawValue : '',
                formula: src ? src.formula : '',
                style: src ? src.style : null,
                numFormat: src ? src.numFormat : 'general'
            });
        }

        return results;
    }
}
