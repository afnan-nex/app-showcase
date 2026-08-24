/**
 * SheetForge - Cell Model
 * Represents a single cell with value, formula, styles, formatting, comments, validation
 */

export const DEFAULT_CELL_STYLE = Object.freeze({
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 13,
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    color: '#1e293b',
    backgroundColor: '#ffffff',
    alignH: 'left', // left, center, right
    alignV: 'middle', // top, middle, bottom
    wrapText: false,
    borders: {
        top: null,
        right: null,
        bottom: null,
        left: null
    }
});

export class Cell {
    constructor(row, col, options = {}) {
        this.row = row;
        this.col = col;
        this.rawValue = options.rawValue !== undefined ? options.rawValue : '';
        this.formula = options.formula || (typeof this.rawValue === 'string' && this.rawValue.startsWith('=') ? this.rawValue : '');
        this.computedValue = options.computedValue !== undefined ? options.computedValue : (this.formula ? null : this.rawValue);
        this.formattedValue = options.formattedValue || '';
        this.error = options.error || null;
        this.numFormat = options.numFormat || 'general'; // general, number, currency, percent, date, time, text, accounting, custom
        this.formatPattern = options.formatPattern || ''; // e.g. "$#,##0.00", "0.0%"
        this.decimals = options.decimals !== undefined ? options.decimals : null;
        this.style = { ...DEFAULT_CELL_STYLE, ...(options.style || {}) };
        this.comment = options.comment || null;
        this.validation = options.validation || null; // { type: 'list'|'number'|'text', criteria: 'between'|'eq', min, max, list: [] }
        this.mergeInfo = options.mergeInfo || null; // { isMerged: bool, isMaster: bool, masterRow: r, masterCol: c, rowSpan: 1, colSpan: 1 }
    }

    get isFormula() {
        return Boolean(this.formula && this.formula.startsWith('='));
    }

    get displayValue() {
        if (this.error) return this.error;
        if (this.formattedValue) return this.formattedValue;
        if (this.computedValue !== null && this.computedValue !== undefined) {
            return String(this.computedValue);
        }
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

    setValue(val, isFormulaInput = false) {
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
            borders: {
                ...(this.style.borders || {}),
                ...(styleObj.borders || {})
            }
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
        const obj = {
            r: this.row,
            c: this.col
        };
        if (this.rawValue !== '' && this.rawValue !== undefined) obj.v = this.rawValue;
        if (this.formula) obj.f = this.formula;
        if (this.numFormat && this.numFormat !== 'general') obj.nf = this.numFormat;
        if (this.formatPattern) obj.fp = this.formatPattern;
        if (this.decimals !== null) obj.d = this.decimals;
        if (this.comment) obj.cm = this.comment;
        if (this.validation) obj.vl = this.validation;
        if (this.mergeInfo) obj.m = this.mergeInfo;

        // Save style differences from default to keep storage minimal
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
