/**
 * DataLens - High Performance CSV & JSON Data Parser
 * RFC-4180 compliant with auto-delimiter detection, streaming chunks, and malformed row recovery.
 */

class DataParser {
  /**
   * Parses text content (CSV, TSV, or JSON) into row objects and column metadata.
   * @param {string} content 
   * @param {string} fileName 
   * @param {Function} [onProgress] 
   * @returns {Promise<{ data: Array<Object>, columns: Array<Object>, totalRows: number, warnings: Array<string> }>}
   */
  static async parseFileContent(content, fileName = '', onProgress = null) {
    const isJson = fileName.toLowerCase().endsWith('.json') || content.trim().startsWith('[') || content.trim().startsWith('{');

    if (isJson) {
      return this.parseJSON(content);
    } else {
      return this.parseCSV(content, onProgress);
    }
  }

  /**
   * Robust JSON parser supporting arrays of objects, nested JSON flattening, and columnar objects.
   */
  static parseJSON(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      let rows = [];

      if (Array.isArray(parsed)) {
        rows = parsed.map(item => (typeof item === 'object' && item !== null ? this.flattenObject(item) : { value: item }));
      } else if (typeof parsed === 'object' && parsed !== null) {
        // Check if object is a collection of arrays (columnar format)
        const keys = Object.keys(parsed);
        const isColumnar = keys.length > 0 && Array.isArray(parsed[keys[0]]);

        if (isColumnar) {
          const rowCount = parsed[keys[0]].length;
          for (let i = 0; i < rowCount; i++) {
            const row = {};
            for (const key of keys) {
              row[key] = parsed[key][i] !== undefined ? parsed[key][i] : null;
            }
            rows.push(row);
          }
        } else if (Array.isArray(parsed.data) || Array.isArray(parsed.items) || Array.isArray(parsed.records) || Array.isArray(parsed.rows)) {
          const arr = parsed.data || parsed.items || parsed.records || parsed.rows;
          rows = arr.map(item => (typeof item === 'object' && item !== null ? this.flattenObject(item) : { value: item }));
        } else {
          rows = [this.flattenObject(parsed)];
        }
      }

      if (rows.length === 0) {
        throw new Error('JSON contains no data rows');
      }

      const columns = TypeDetector.detectDatasetColumns(rows);
      return {
        data: rows,
        columns,
        totalRows: rows.length,
        warnings: []
      };
    } catch (err) {
      throw new Error(`Failed to parse JSON: ${err.message}`);
    }
  }

  /**
   * Flattens nested JSON objects into single level keys with dot notation.
   */
  static flattenObject(obj, prefix = '') {
    const result = {};
    for (const key of Object.keys(obj)) {
      const propName = prefix ? `${prefix}.${key}` : key;
      const val = obj[key];
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        Object.assign(result, this.flattenObject(val, propName));
      } else if (Array.isArray(val)) {
        result[propName] = val.map(v => (typeof v === 'object' ? JSON.stringify(v) : v)).join(', ');
      } else {
        result[propName] = val;
      }
    }
    return result;
  }

  /**
   * Auto-detects delimiter by inspecting the first few lines of CSV content.
   */
  static detectDelimiter(sampleText) {
    const delimiters = [',', '\t', ';', '|'];
    const lines = sampleText.split(/\r\n|\n|\r/).filter(l => l.trim().length > 0).slice(0, 10);
    if (lines.length === 0) return ',';

    let bestDelim = ',';
    let maxConsistency = -1;

    for (const delim of delimiters) {
      const counts = lines.map(line => {
        let count = 0;
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          if (line[i] === '"') inQuotes = !inQuotes;
          else if (line[i] === delim && !inQuotes) count++;
        }
        return count;
      });

      const firstCount = counts[0];
      if (firstCount > 0 && counts.every(c => c === firstCount)) {
        // Perfect consistency across lines
        const score = firstCount * 10;
        if (score > maxConsistency) {
          maxConsistency = score;
          bestDelim = delim;
        }
      } else {
        const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
        if (avg > 0 && avg > maxConsistency) {
          maxConsistency = avg;
          bestDelim = delim;
        }
      }
    }

    return bestDelim;
  }

  /**
   * RFC-4180 CSV parser with streaming chunk yields and error recovery.
   */
  static async parseCSV(text, onProgress = null) {
    const sample = text.slice(0, 4096);
    const delimiter = this.detectDelimiter(sample);
    const warnings = [];

    const rows = [];
    let currentField = '';
    let currentRow = [];
    let inQuotes = false;
    const len = text.length;

    let headers = null;
    let expectedCols = 0;

    const chunkSize = 50000;
    let lastYield = Date.now();

    for (let i = 0; i < len; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      // Quote handling
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentField += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }

      // Delimiter handling
      if (char === delimiter && !inQuotes) {
        currentRow.push(currentField.trim());
        currentField = '';
        continue;
      }

      // Line ending handling (\r\n, \n, \r)
      if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++; // skip \n
        }

        currentRow.push(currentField.trim());
        currentField = '';

        // Ignore empty lines
        if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
          if (!headers) {
            // Process Header Row
            headers = currentRow.map((h, idx) => (h ? h : `Column_${idx + 1}`));
            // De-duplicate duplicate header names
            const headerCounts = {};
            headers = headers.map(h => {
              headerCounts[h] = (headerCounts[h] || 0) + 1;
              return headerCounts[h] > 1 ? `${h}_${headerCounts[h]}` : h;
            });
            expectedCols = headers.length;
          } else {
            // Process Data Row with length matching
            if (currentRow.length !== expectedCols) {
              if (currentRow.length < expectedCols) {
                while (currentRow.length < expectedCols) currentRow.push('');
              } else {
                currentRow = currentRow.slice(0, expectedCols);
              }
              if (warnings.length < 5) {
                warnings.push(`Row ${rows.length + 2} had irregular column count; automatically normalized.`);
              }
            }

            const rowObj = {};
            for (let c = 0; c < expectedCols; c++) {
              rowObj[headers[c]] = currentRow[c];
            }
            rows.push(rowObj);
          }
        }

        currentRow = [];

        // Yield to browser thread if large file
        if (i % chunkSize === 0 && Date.now() - lastYield > 25) {
          if (onProgress) onProgress(Math.round((i / len) * 100));
          await new Promise(r => setTimeout(r, 0));
          lastYield = Date.now();
        }

        continue;
      }

      currentField += char;
    }

    // Flush last row if file does not end in newline
    if (currentField !== '' || currentRow.length > 0) {
      currentRow.push(currentField.trim());
      if (!headers) {
        headers = currentRow.map((h, idx) => (h ? h : `Column_${idx + 1}`));
        expectedCols = headers.length;
      } else {
        while (currentRow.length < expectedCols) currentRow.push('');
        const rowObj = {};
        for (let c = 0; c < expectedCols; c++) {
          rowObj[headers[c]] = currentRow[c];
        }
        rows.push(rowObj);
      }
    }

    if (!headers || rows.length === 0) {
      throw new Error('The file contains no readable data rows.');
    }

    if (onProgress) onProgress(100);

    const columns = TypeDetector.detectDatasetColumns(rows, headers);

    return {
      data: rows,
      columns,
      totalRows: rows.length,
      warnings
    };
  }

  /**
   * Converts dataset rows back to a downloadable CSV string.
   */
  static exportToCSV(data, columns) {
    if (!data || data.length === 0) return '';
    const colNames = columns ? columns.map(c => (typeof c === 'string' ? c : c.name)) : Object.keys(data[0]);

    const escapeField = (val) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headerLine = colNames.map(escapeField).join(',');
    const lines = [headerLine];

    for (const row of data) {
      const line = colNames.map(col => escapeField(row[col])).join(',');
      lines.push(line);
    }

    return lines.join('\r\n');
  }

  /**
   * Converts dataset rows to formatted JSON string.
   */
  static exportToJSON(data) {
    return JSON.stringify(data, null, 2);
  }
}

window.DataParser = DataParser;
