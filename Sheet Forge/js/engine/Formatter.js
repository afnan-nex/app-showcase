/**
 * SheetForge - Number & Date Formatter
 * Excel-grade format renderer supporting currency, percent, accounting, date, scientific, and custom precision
 */

export class Formatter {
    static formatCell(cell) {
        if (!cell) return '';
        if (cell.error) return cell.error;

        const val = cell.computedValue !== null && cell.computedValue !== undefined ? cell.computedValue : cell.rawValue;
        if (val === '' || val === null || val === undefined) return '';

        return this.formatValue(val, cell.numFormat, cell.decimals, cell.formatPattern);
    }

    static formatValue(val, formatType = 'general', decimals = null, pattern = '') {
        if (val === null || val === undefined || val === '') return '';

        const num = typeof val === 'number' ? val : Number(String(val).replace(/[\$,]/g, ''));
        const isNumeric = !isNaN(num) && typeof val !== 'boolean';

        switch (formatType) {
            case 'number': {
                if (!isNumeric) return String(val);
                const d = decimals !== null ? decimals : 2;
                return num.toLocaleString('en-US', {
                    minimumFractionDigits: d,
                    maximumFractionDigits: d
                });
            }

            case 'currency': {
                if (!isNumeric) return String(val);
                const d = decimals !== null ? decimals : 2;
                return num.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: d,
                    maximumFractionDigits: d
                });
            }

            case 'currency_eur': {
                if (!isNumeric) return String(val);
                const d = decimals !== null ? decimals : 2;
                return num.toLocaleString('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: d,
                    maximumFractionDigits: d
                });
            }

            case 'currency_gbp': {
                if (!isNumeric) return String(val);
                const d = decimals !== null ? decimals : 2;
                return num.toLocaleString('en-GB', {
                    style: 'currency',
                    currency: 'GBP',
                    minimumFractionDigits: d,
                    maximumFractionDigits: d
                });
            }

            case 'currency_jpy': {
                if (!isNumeric) return String(val);
                return num.toLocaleString('ja-JP', {
                    style: 'currency',
                    currency: 'JPY',
                    maximumFractionDigits: 0
                });
            }

            case 'accounting': {
                if (!isNumeric) return String(val);
                const d = decimals !== null ? decimals : 2;
                if (num < 0) {
                    return `($${Math.abs(num).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })})`;
                }
                return `$${num.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })}`;
            }

            case 'percent': {
                if (!isNumeric) return String(val);
                const d = decimals !== null ? decimals : (val < 1 && val > -1 ? 1 : 0);
                const pct = num * 100;
                return `${pct.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })}%`;
            }

            case 'scientific': {
                if (!isNumeric) return String(val);
                const d = decimals !== null ? decimals : 2;
                return num.toExponential(d).toUpperCase();
            }

            case 'date_short':
            case 'date': {
                const d = new Date(val);
                if (isNaN(d.getTime())) return String(val);
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            }

            case 'date_long': {
                const d = new Date(val);
                if (isNaN(d.getTime())) return String(val);
                return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            }

            case 'time': {
                const d = new Date(val);
                if (isNaN(d.getTime())) return String(val);
                return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            }

            case 'text':
                return String(val);

            case 'general':
            default: {
                if (typeof val === 'number') {
                    // Check if it looks like a long floating point precision artifact
                    if (Number.isInteger(val)) {
                        return String(val);
                    }
                    const str = val.toString();
                    if (str.length > 12 && /\.\d{6,}/.test(str)) {
                        return parseFloat(val.toFixed(8)).toString();
                    }
                    return str;
                }
                if (typeof val === 'boolean') {
                    return val ? 'TRUE' : 'FALSE';
                }
                return String(val);
            }
        }
    }
}
