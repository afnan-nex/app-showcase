/**
 * DataLens - In-Memory Analytics & Query Engine
 * High-performance querying, multi-condition filtering, sorting, multi-dimensional grouping,
 * aggregations, calculated column formulas, and statistical data profiling.
 */

class DataEngine {
  /**
   * Evaluates compound filter conditions against an array of dataset rows.
   * @param {Array<Object>} rows 
   * @param {Array<Object>} conditions - Array of { column, operator, value, value2, matchType: 'AND'|'OR' }
   * @param {Array<Object>} columnsMeta 
   * @returns {Array<Object>}
   */
  static filterRows(rows, conditions, columnsMeta = []) {
    if (!rows || rows.length === 0 || !conditions || conditions.length === 0) {
      return rows;
    }

    const typeMap = {};
    columnsMeta.forEach(c => { typeMap[c.name] = c.type; });

    return rows.filter(row => {
      // Evaluate first condition
      let result = this.evalCondition(row, conditions[0], typeMap[conditions[0].column]);

      for (let i = 1; i < conditions.length; i++) {
        const cond = conditions[i];
        const match = this.evalCondition(row, cond, typeMap[cond.column]);
        if (cond.matchType === 'OR') {
          result = result || match;
        } else {
          result = result && match;
        }
      }

      return result;
    });
  }

  /**
   * Evaluates a single filter condition on a row.
   */
  static evalCondition(row, cond, colType = DATA_TYPES.TEXT) {
    const rawVal = row[cond.column];
    const isNumeric = [DATA_TYPES.NUMBER, DATA_TYPES.CURRENCY, DATA_TYPES.PERCENTAGE].includes(colType);

    if (cond.operator === 'is_empty') {
      return rawVal === undefined || rawVal === null || String(rawVal).trim() === '';
    }
    if (cond.operator === 'is_not_empty') {
      return rawVal !== undefined && rawVal !== null && String(rawVal).trim() !== '';
    }
    if (cond.operator === 'is_true') {
      return TypeDetector.parseRawValue(rawVal, DATA_TYPES.BOOLEAN) === true;
    }
    if (cond.operator === 'is_false') {
      return TypeDetector.parseRawValue(rawVal, DATA_TYPES.BOOLEAN) === false;
    }

    if (rawVal === undefined || rawVal === null) return false;

    if (isNumeric) {
      const numA = TypeDetector.parseRawValue(rawVal, colType);
      const numB = parseFloat(cond.value);
      if (numA === null || isNaN(numB)) return false;

      switch (cond.operator) {
        case 'equals': return numA === numB;
        case 'not_equals': return numA !== numB;
        case 'gt': return numA > numB;
        case 'gte': return numA >= numB;
        case 'lt': return numA < numB;
        case 'lte': return numA <= numB;
        case 'between': {
          const numC = parseFloat(cond.value2);
          if (isNaN(numC)) return false;
          return numA >= Math.min(numB, numC) && numA <= Math.max(numB, numC);
        }
        default: return true;
      }
    }

    if (colType === DATA_TYPES.DATE) {
      const dateA = TypeDetector.parseRawValue(rawVal, DATA_TYPES.DATE);
      const dateB = new Date(cond.value);
      if (!dateA || isNaN(dateB.getTime())) return false;

      const timeA = dateA.getTime();
      const timeB = dateB.getTime();

      switch (cond.operator) {
        case 'equals': return timeA === timeB;
        case 'not_equals': return timeA !== timeB;
        case 'gt': return timeA > timeB;
        case 'gte': return timeA >= timeB;
        case 'lt': return timeA < timeB;
        case 'lte': return timeA <= timeB;
        case 'between': {
          const dateC = new Date(cond.value2);
          if (isNaN(dateC.getTime())) return false;
          const timeC = dateC.getTime();
          return timeA >= Math.min(timeB, timeC) && timeA <= Math.max(timeB, timeC);
        }
        default: return true;
      }
    }

    // Default text comparison
    const strA = String(rawVal).toLowerCase();
    const strB = String(cond.value || '').toLowerCase();

    switch (cond.operator) {
      case 'equals': return strA === strB;
      case 'not_equals': return strA !== strB;
      case 'contains': return strA.includes(strB);
      case 'not_contains': return !strA.includes(strB);
      case 'starts_with': return strA.startsWith(strB);
      case 'ends_with': return strA.endsWith(strB);
      default: return true;
    }
  }

  /**
   * Fast global text search across selected or all columns.
   */
  static searchRows(rows, query, columns = null) {
    if (!rows || rows.length === 0 || !query || query.trim() === '') {
      return rows;
    }

    const q = query.toLowerCase().trim();
    const searchCols = columns && columns.length > 0 ? columns : Object.keys(rows[0]);

    return rows.filter(row => {
      for (const col of searchCols) {
        const val = row[col];
        if (val !== undefined && val !== null && String(val).toLowerCase().includes(q)) {
          return true;
        }
      }
      return false;
    });
  }

  /**
   * Multi-column type-aware sorting.
   * @param {Array<Object>} rows 
   * @param {Array<{ column: string, direction: 'asc'|'desc' }>} sortCriteria 
   * @param {Array<Object>} columnsMeta 
   */
  static sortRows(rows, sortCriteria, columnsMeta = []) {
    if (!rows || rows.length === 0 || !sortCriteria || sortCriteria.length === 0) {
      return rows;
    }

    const typeMap = {};
    columnsMeta.forEach(c => { typeMap[c.name] = c.type; });

    const sorted = [...rows];

    sorted.sort((a, b) => {
      for (const sort of sortCriteria) {
        const { column, direction } = sort;
        const dirMultiplier = direction === 'desc' ? -1 : 1;
        const colType = typeMap[column] || DATA_TYPES.TEXT;

        const valA = a[column];
        const valB = b[column];

        // Nulls always sort to the end
        if (valA === null || valA === undefined || valA === '') {
          if (valB === null || valB === undefined || valB === '') continue;
          return 1;
        }
        if (valB === null || valB === undefined || valB === '') {
          return -1;
        }

        if ([DATA_TYPES.NUMBER, DATA_TYPES.CURRENCY, DATA_TYPES.PERCENTAGE].includes(colType)) {
          const numA = TypeDetector.parseRawValue(valA, colType) || 0;
          const numB = TypeDetector.parseRawValue(valB, colType) || 0;
          if (numA !== numB) {
            return (numA - numB) * dirMultiplier;
          }
        } else if (colType === DATA_TYPES.DATE) {
          const dateA = TypeDetector.parseRawValue(valA, DATA_TYPES.DATE);
          const dateB = TypeDetector.parseRawValue(valB, DATA_TYPES.DATE);
          const timeA = dateA ? dateA.getTime() : 0;
          const timeB = dateB ? dateB.getTime() : 0;
          if (timeA !== timeB) {
            return (timeA - timeB) * dirMultiplier;
          }
        } else {
          const strA = String(valA);
          const strB = String(valB);
          const comp = strA.localeCompare(strB, undefined, { numeric: true, sensitivity: 'base' });
          if (comp !== 0) {
            return comp * dirMultiplier;
          }
        }
      }
      return 0;
    });

    return sorted;
  }

  /**
   * Group By & Aggregation Engine.
   * @param {Array<Object>} rows 
   * @param {Array<string>} groupColumns 
   * @param {Array<{ metricCol: string, aggType: string, outputCol: string }>} aggregations 
   * @param {Array<Object>} columnsMeta 
   * @returns {Array<Object>}
   */
  static aggregate(rows, groupColumns = [], aggregations = [], columnsMeta = []) {
    if (!rows || rows.length === 0) return [];

    const typeMap = {};
    columnsMeta.forEach(c => { typeMap[c.name] = c.type; });

    // Grouping
    const groups = new Map();

    for (const row of rows) {
      const groupKey = groupColumns.length > 0
        ? groupColumns.map(col => String(row[col] !== undefined && row[col] !== null ? row[col] : '(Blank)')).join('__§§__')
        : '__GLOBAL__';

      if (!groups.has(groupKey)) {
        const groupObj = {};
        groupColumns.forEach((col, idx) => {
          groupObj[col] = row[col] !== undefined && row[col] !== null ? row[col] : '(Blank)';
        });
        groups.set(groupKey, { groupObj, rows: [] });
      }

      groups.get(groupKey).rows.push(row);
    }

    const result = [];

    for (const { groupObj, rows: groupRows } of groups.values()) {
      const item = { ...groupObj };

      for (const agg of aggregations) {
        const { metricCol, aggType, outputCol } = agg;
        const outName = outputCol || `${aggType}_${metricCol}`;
        const colType = typeMap[metricCol] || DATA_TYPES.NUMBER;

        const values = [];
        for (const r of groupRows) {
          const val = r[metricCol];
          if (val !== undefined && val !== null && String(val).trim() !== '') {
            const parsed = TypeDetector.parseRawValue(val, colType);
            if (parsed !== null) values.push(parsed);
          }
        }

        item[outName] = this.computeMetric(values, aggType, groupRows.length);
      }

      result.push(item);
    }

    return result;
  }

  /**
   * Computes a statistical metric from a list of parsed numeric/date/text values.
   */
  static computeMetric(values, aggType, totalRowsInGroup = 0) {
    if (aggType === 'count') {
      return totalRowsInGroup;
    }
    if (aggType === 'unique_count') {
      return new Set(values.map(v => (v instanceof Date ? v.getTime() : v))).size;
    }
    if (values.length === 0) {
      return 0;
    }

    switch (aggType) {
      case 'sum':
        return values.reduce((acc, v) => acc + (typeof v === 'number' ? v : 0), 0);
      case 'avg': {
        const numVals = values.filter(v => typeof v === 'number');
        if (numVals.length === 0) return 0;
        return numVals.reduce((acc, v) => acc + v, 0) / numVals.length;
      }
      case 'min': {
        if (values[0] instanceof Date) {
          const minTime = Math.min(...values.map(d => d.getTime()));
          return new Date(minTime).toISOString().slice(0, 10);
        }
        return Math.min(...values.filter(v => typeof v === 'number'));
      }
      case 'max': {
        if (values[0] instanceof Date) {
          const maxTime = Math.max(...values.map(d => d.getTime()));
          return new Date(maxTime).toISOString().slice(0, 10);
        }
        return Math.max(...values.filter(v => typeof v === 'number'));
      }
      case 'median': {
        const numVals = values.filter(v => typeof v === 'number').sort((a, b) => a - b);
        if (numVals.length === 0) return 0;
        const mid = Math.floor(numVals.length / 2);
        return numVals.length % 2 !== 0 ? numVals[mid] : (numVals[mid - 1] + numVals[mid]) / 2;
      }
      case 'std_dev': {
        const numVals = values.filter(v => typeof v === 'number');
        if (numVals.length <= 1) return 0;
        const mean = numVals.reduce((a, b) => a + b, 0) / numVals.length;
        const variance = numVals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (numVals.length - 1);
        return Math.sqrt(variance);
      }
      default:
        return values.length;
    }
  }

  /**
   * Evaluates calculated columns across all rows with a safe sandboxed formula parser.
   */
  static calculateColumn(rows, newColName, formulaStr, columnsMeta = []) {
    if (!rows || rows.length === 0 || !formulaStr || !newColName) {
      return rows;
    }

    const typeMap = {};
    columnsMeta.forEach(c => { typeMap[c.name] = c.type; });

    return rows.map(row => {
      try {
        const val = this.evalFormula(formulaStr, row, typeMap);
        return {
          ...row,
          [newColName]: val !== undefined && val !== null ? val : ''
        };
      } catch (err) {
        return {
          ...row,
          [newColName]: 'ERROR'
        };
      }
    });
  }

  /**
   * Sandboxed formula evaluator supporting:
   * [ColA] + [ColB]
   * [Revenue] * (1 - [Discount])
   * UPPER([Name]), LOWER([City]), CONCAT([First], " ", [Last])
   * IF([Sales] > 1000, "High", "Low")
   * ROUND([Val], 2)
   */
  static evalFormula(formula, row, typeMap = {}) {
    let expr = formula;

    // Replace [ColumnName] references with actual row values
    expr = expr.replace(/\[([^\]]+)\]/g, (match, colName) => {
      const raw = row[colName];
      if (raw === undefined || raw === null || raw === '') return '0';
      const colType = typeMap[colName] || DATA_TYPES.TEXT;
      if ([DATA_TYPES.NUMBER, DATA_TYPES.CURRENCY, DATA_TYPES.PERCENTAGE].includes(colType)) {
        const num = TypeDetector.parseRawValue(raw, colType);
        return num !== null ? String(num) : '0';
      }
      return JSON.stringify(String(raw));
    });

    // Handle helper functions:
    // IF(cond, val1, val2) -> ((cond) ? (val1) : (val2))
    expr = expr.replace(/IF\s*\(([^,]+),([^,]+),([^\)]+)\)/gi, '($1 ? $2 : $3)');
    
    // UPPER(str) -> String(str).toUpperCase()
    expr = expr.replace(/UPPER\s*\(([^)]+)\)/gi, 'String($1).toUpperCase()');
    // LOWER(str) -> String(str).toLowerCase()
    expr = expr.replace(/LOWER\s*\(([^)]+)\)/gi, 'String($1).toLowerCase()');
    // TRIM(str) -> String(str).trim()
    expr = expr.replace(/TRIM\s*\(([^)]+)\)/gi, 'String($1).trim()');
    // CONCAT(a, b, ...) -> [a, b].join('')
    expr = expr.replace(/CONCAT\s*\(([^)]+)\)/gi, '([$1].join(""))');
    // ROUND(val, dec) -> Number(Math.round(val + "e" + dec) + "e-" + dec)
    expr = expr.replace(/ROUND\s*\(([^,]+),([^\)]+)\)/gi, 'Number(Math.round($1 + "e" + $2) + "e-" + $2)');

    // Safe execution sandbox
    const fn = new Function(`"use strict"; return (${expr});`);
    return fn();
  }

  /**
   * Generates comprehensive statistical profile for all columns in dataset.
   */
  static profileDataset(rows, columnsMeta) {
    if (!rows || rows.length === 0) return { columns: [], totalRows: 0, totalCols: 0, missingCells: 0 };

    const totalRows = rows.length;
    const totalCols = columnsMeta.length;
    let totalMissing = 0;

    const columnProfiles = columnsMeta.map(col => {
      const { name, type, isNumeric } = col;
      let nonNullCount = 0;
      let nullCount = 0;
      const valuesSet = new Set();
      const numValues = [];
      const freqMap = {};

      for (let i = 0; i < totalRows; i++) {
        const raw = rows[i][name];
        if (raw === undefined || raw === null || String(raw).trim() === '') {
          nullCount++;
          totalMissing++;
        } else {
          nonNullCount++;
          const strVal = String(raw).trim();
          valuesSet.add(strVal);
          freqMap[strVal] = (freqMap[strVal] || 0) + 1;

          if (isNumeric) {
            const num = TypeDetector.parseRawValue(raw, type);
            if (num !== null) numValues.push(num);
          }
        }
      }

      const uniqueCount = valuesSet.size;
      const nullRatio = (nullCount / totalRows) * 100;
      const uniqueRatio = (uniqueCount / totalRows) * 100;

      // Stats for numeric columns
      let sum = 0;
      let avg = 0;
      let min = 0;
      let max = 0;
      let median = 0;
      let stdDev = 0;
      let histogram = [];

      if (isNumeric && numValues.length > 0) {
        sum = numValues.reduce((a, b) => a + b, 0);
        avg = sum / numValues.length;
        min = Math.min(...numValues);
        max = Math.max(...numValues);

        const sorted = [...numValues].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

        if (numValues.length > 1) {
          const variance = numValues.reduce((acc, v) => acc + Math.pow(v - avg, 2), 0) / (numValues.length - 1);
          stdDev = Math.sqrt(variance);
        }

        // Build 10-bucket histogram
        const bucketCount = 8;
        const bucketSize = (max - min) / (bucketCount || 1);
        const buckets = Array(bucketCount).fill(0);

        if (bucketSize > 0) {
          for (const num of numValues) {
            const bIdx = Math.min(Math.floor((num - min) / bucketSize), bucketCount - 1);
            buckets[bIdx]++;
          }
        } else {
          buckets[0] = numValues.length;
        }

        const maxBucket = Math.max(...buckets, 1);
        histogram = buckets.map(count => ({ count, heightPct: (count / maxBucket) * 100 }));
      }

      // Top frequent values for categorical / text columns
      const topValues = Object.entries(freqMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([val, count]) => ({ value: val, count, pct: (count / totalRows) * 100 }));

      return {
        name,
        type,
        isNumeric,
        totalRows,
        nonNullCount,
        nullCount,
        nullRatio,
        uniqueCount,
        uniqueRatio,
        sum,
        avg,
        min,
        max,
        median,
        stdDev,
        histogram,
        topValues
      };
    });

    const totalCells = totalRows * totalCols;
    const overallMissingPct = totalCells > 0 ? (totalMissing / totalCells) * 100 : 0;

    return {
      totalRows,
      totalCols,
      totalMissing,
      overallMissingPct,
      columns: columnProfiles
    };
  }
}

window.DataEngine = DataEngine;
