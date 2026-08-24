/**
 * DataLens - Smart Data Type Detector & Formatters
 * Accurately classifies column types and provides parsing and formatting utilities.
 */

const DATA_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  CURRENCY: 'currency',
  PERCENTAGE: 'percentage',
  DATE: 'date',
  BOOLEAN: 'boolean'
};

class TypeDetector {
  /**
   * Analyzes an array of row objects and returns an array of column metadata with detected types.
   * @param {Array<Object>} data 
   * @param {Array<string>} [explicitColumns]
   * @returns {Array<{ name: string, type: string, isNumeric: boolean }>}
   */
  static detectDatasetColumns(data, explicitColumns = null) {
    if (!data || data.length === 0) {
      if (explicitColumns) {
        return explicitColumns.map(col => ({ name: col, type: DATA_TYPES.TEXT, isNumeric: false }));
      }
      return [];
    }

    const columns = explicitColumns || Object.keys(data[0]);
    const sampleLimit = Math.min(data.length, 300);

    return columns.map(col => {
      const sampleValues = [];
      for (let i = 0; i < sampleLimit; i++) {
        const val = data[i][col];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          sampleValues.push(String(val).trim());
        }
      }

      const detectedType = this.detectColumnType(sampleValues);
      const isNumeric = [DATA_TYPES.NUMBER, DATA_TYPES.CURRENCY, DATA_TYPES.PERCENTAGE].includes(detectedType);

      return {
        name: col,
        type: detectedType,
        isNumeric
      };
    });
  }

  /**
   * Detects the type of a column based on an array of sample string values.
   * @param {Array<string>} sampleValues 
   * @returns {string}
   */
  static detectColumnType(sampleValues) {
    if (!sampleValues || sampleValues.length === 0) {
      return DATA_TYPES.TEXT;
    }

    let boolCount = 0;
    let currencyCount = 0;
    let percentCount = 0;
    let dateCount = 0;
    let numberCount = 0;
    const total = sampleValues.length;

    for (const val of sampleValues) {
      const lower = val.toLowerCase();

      // Check Boolean
      if (['true', 'false', 'yes', 'no', 't', 'f', '1', '0'].includes(lower)) {
        boolCount++;
      }

      // Check Percentage
      if (/^-?\$?\s*[\d,]+(\.\d+)?\s*%$/.test(val) || (val.endsWith('%') && !isNaN(parseFloat(val)))) {
        percentCount++;
        continue;
      }

      // Check Currency
      if (/^[\$€£¥₹CAD\s]+-?[\d,]+(\.\d+)?$/.test(val) || /^-?[\$€£¥₹]\s*[\d,]+(\.\d+)?$/.test(val) || /^-?[\d,]+(\.\d+)?\s*[\$€£¥₹]$/.test(val)) {
        currencyCount++;
        continue;
      }

      // Check Number
      const cleanNum = val.replace(/,/g, '');
      if (!isNaN(cleanNum) && cleanNum.trim() !== '') {
        numberCount++;
        continue;
      }

      // Check Date
      if (this.isValidDateString(val)) {
        dateCount++;
        continue;
      }
    }

    const threshold = 0.75; // 75% consistency threshold

    if (boolCount / total >= threshold && (total > 2 || boolCount === total)) {
      // Avoid tagging pure 0/1 numeric lists as bool unless consistent
      if (sampleValues.every(v => ['true', 'false', 'yes', 'no'].includes(v.toLowerCase()))) {
        return DATA_TYPES.BOOLEAN;
      }
    }

    if (currencyCount / total >= threshold) return DATA_TYPES.CURRENCY;
    if (percentCount / total >= threshold) return DATA_TYPES.PERCENTAGE;
    if (numberCount / total >= threshold) return DATA_TYPES.NUMBER;
    if (dateCount / total >= threshold) return DATA_TYPES.DATE;

    return DATA_TYPES.TEXT;
  }

  /**
   * Robust check if a string is a recognizable date.
   */
  static isValidDateString(str) {
    if (!str || str.length < 4 || /^\d{1,3}$/.test(str)) return false;
    
    // ISO format: YYYY-MM-DD or YYYY/MM/DD or YYYY-MM-DDTHH:MM:SS
    if (/^\d{4}[-\/\.]\d{1,2}[-\/\.]\d{1,2}/.test(str)) {
      const d = new Date(str);
      return !isNaN(d.getTime());
    }

    // US/EU format: MM/DD/YYYY or DD.MM.YYYY
    if (/^\d{1,2}[-\/\.]\d{1,2}[-\/\.]\d{2,4}/.test(str)) {
      const d = new Date(str);
      return !isNaN(d.getTime());
    }

    // Month Name formats: "Jan 15, 2024", "15-Oct-2023"
    if (/^[A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4}/.test(str) || /^\d{1,2}-[A-Za-z]{3,9}-\d{2,4}/.test(str)) {
      const d = new Date(str);
      return !isNaN(d.getTime());
    }

    return false;
  }

  /**
   * Parses a value to a raw numeric/comparable value based on its detected or specified type.
   */
  static parseRawValue(val, type) {
    if (val === undefined || val === null || val === '') return null;

    switch (type) {
      case DATA_TYPES.NUMBER: {
        const cleaned = String(val).replace(/,/g, '').trim();
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
      }
      case DATA_TYPES.CURRENCY: {
        const cleaned = String(val).replace(/[\$,€£¥₹\sCAD]/g, '').replace(/,/g, '').trim();
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
      }
      case DATA_TYPES.PERCENTAGE: {
        const cleaned = String(val).replace(/[%,\s]/g, '').trim();
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
      }
      case DATA_TYPES.DATE: {
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
      }
      case DATA_TYPES.BOOLEAN: {
        const lower = String(val).trim().toLowerCase();
        if (['true', 'yes', '1', 't'].includes(lower)) return true;
        if (['false', 'no', '0', 'f'].includes(lower)) return false;
        return null;
      }
      default:
        return String(val);
    }
  }

  /**
   * Formats a raw or string value for user-friendly display in tables and charts.
   */
  static formatValue(val, type) {
    if (val === undefined || val === null || val === '') {
      return '';
    }

    switch (type) {
      case DATA_TYPES.NUMBER: {
        const num = typeof val === 'number' ? val : this.parseRawValue(val, DATA_TYPES.NUMBER);
        if (num === null) return String(val);
        return Number.isInteger(num)
          ? num.toLocaleString()
          : num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
      case DATA_TYPES.CURRENCY: {
        const num = typeof val === 'number' ? val : this.parseRawValue(val, DATA_TYPES.CURRENCY);
        if (num === null) return String(val);
        return '$' + num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
      case DATA_TYPES.PERCENTAGE: {
        const num = typeof val === 'number' ? val : this.parseRawValue(val, DATA_TYPES.PERCENTAGE);
        if (num === null) return String(val);
        return num.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + '%';
      }
      case DATA_TYPES.DATE: {
        const d = val instanceof Date ? val : this.parseRawValue(val, DATA_TYPES.DATE);
        if (!d) return String(val);
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      }
      case DATA_TYPES.BOOLEAN: {
        const b = typeof val === 'boolean' ? val : this.parseRawValue(val, DATA_TYPES.BOOLEAN);
        if (b === null) return String(val);
        return b ? 'TRUE' : 'FALSE';
      }
      default:
        return String(val);
    }
  }

  /**
   * Compact numeric formatter for charts & KPIs (e.g. 1.2M, 45.3K)
   */
  static formatCompactNumber(num, prefix = '', suffix = '') {
    if (num === null || num === undefined || isNaN(num)) return '0';
    const abs = Math.abs(num);
    let formatted = '';

    if (abs >= 1e9) {
      formatted = (num / 1e9).toFixed(2) + 'B';
    } else if (abs >= 1e6) {
      formatted = (num / 1e6).toFixed(2) + 'M';
    } else if (abs >= 1e3) {
      formatted = (num / 1e3).toFixed(1) + 'K';
    } else if (Number.isInteger(num)) {
      formatted = num.toLocaleString();
    } else {
      formatted = num.toFixed(2);
    }

    return prefix + formatted + suffix;
  }
}

window.DATA_TYPES = DATA_TYPES;
window.TypeDetector = TypeDetector;
