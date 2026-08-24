/**
 * DataLens - Data Cleaning & Transformation Pipeline Engine
 * Executes reproducible sequences of transformation steps with diff tracking.
 */

class PipelineEngine {
  /**
   * Runs an array of pipeline steps against the raw dataset.
   * @param {Array<Object>} rawData 
   * @param {Array<Object>} rawColumns 
   * @param {Array<Object>} steps 
   * @returns {{ data: Array<Object>, columns: Array<Object>, stepLogs: Array<Object> }}
   */
  static executePipeline(rawData, rawColumns, steps = []) {
    if (!rawData || rawData.length === 0) {
      return { data: [], columns: rawColumns || [], stepLogs: [] };
    }

    let currentData = rawData.map(r => ({ ...r }));
    let currentColumns = (rawColumns || TypeDetector.detectDatasetColumns(rawData)).map(c => ({ ...c }));
    const stepLogs = [];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (step.disabled) {
        stepLogs.push({ stepId: step.id, skipped: true, summary: 'Step skipped (disabled)' });
        continue;
      }

      const rowsBefore = currentData.length;
      const colsBefore = currentColumns.length;

      try {
        const result = this.executeStep(currentData, currentColumns, step);
        currentData = result.data;
        currentColumns = result.columns;

        stepLogs.push({
          stepId: step.id,
          success: true,
          summary: result.summary,
          rowsDiff: currentData.length - rowsBefore,
          colsDiff: currentColumns.length - colsBefore
        });
      } catch (err) {
        console.error(`Pipeline step error [${step.type}]:`, err);
        stepLogs.push({
          stepId: step.id,
          success: false,
          summary: `Error: ${err.message}`,
          rowsDiff: 0,
          colsDiff: 0
        });
      }
    }

    return {
      data: currentData,
      columns: currentColumns,
      stepLogs
    };
  }

  /**
   * Executes a single transformation step.
   */
  static executeStep(data, columns, step) {
    let modifiedData = [...data];
    let modifiedColumns = [...columns];
    let summary = '';

    switch (step.type) {
      case 'rename_column': {
        const { oldName, newName } = step.params;
        if (!oldName || !newName || oldName === newName) break;

        modifiedData = modifiedData.map(row => {
          const newRow = { ...row };
          if (oldName in newRow) {
            newRow[newName] = newRow[oldName];
            delete newRow[oldName];
          }
          return newRow;
        });

        modifiedColumns = modifiedColumns.map(col => (col.name === oldName ? { ...col, name: newName } : col));
        summary = `Renamed "${oldName}" to "${newName}"`;
        break;
      }

      case 'remove_columns': {
        const toRemove = new Set(step.params.columns || []);
        if (toRemove.size === 0) break;

        modifiedData = modifiedData.map(row => {
          const newRow = { ...row };
          toRemove.forEach(col => delete newRow[col]);
          return newRow;
        });

        modifiedColumns = modifiedColumns.filter(col => !toRemove.has(col.name));
        summary = `Removed ${toRemove.size} column(s): ${Array.from(toRemove).join(', ')}`;
        break;
      }

      case 'remove_duplicates': {
        const keyCols = step.params.keyColumns && step.params.keyColumns.length > 0
          ? step.params.keyColumns
          : modifiedColumns.map(c => c.name);

        const seen = new Set();
        const initialCount = modifiedData.length;

        modifiedData = modifiedData.filter(row => {
          const key = keyCols.map(c => String(row[c])).join('__##__');
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        const removedCount = initialCount - modifiedData.length;
        summary = `Removed ${removedCount} duplicate row(s)`;
        break;
      }

      case 'trim_whitespace': {
        const colsToTrim = step.params.columns && step.params.columns.length > 0
          ? step.params.columns
          : modifiedColumns.map(c => c.name);

        const mode = step.params.mode || 'both'; // 'both', 'left', 'right'

        modifiedData = modifiedData.map(row => {
          const newRow = { ...row };
          colsToTrim.forEach(col => {
            if (typeof newRow[col] === 'string') {
              if (mode === 'both') newRow[col] = newRow[col].trim();
              else if (mode === 'left') newRow[col] = newRow[col].trimStart();
              else if (mode === 'right') newRow[col] = newRow[col].trimEnd();
            }
          });
          return newRow;
        });

        summary = `Trimmed whitespace in ${colsToTrim.length} column(s)`;
        break;
      }

      case 'find_replace': {
        const { column, find, replace, regex, matchCase } = step.params;
        if (!column || find === undefined) break;

        let matcher;
        if (regex) {
          matcher = new RegExp(find, matchCase ? 'g' : 'gi');
        }

        let replaceCount = 0;
        modifiedData = modifiedData.map(row => {
          const val = row[column];
          if (val === undefined || val === null) return row;

          const strVal = String(val);
          let newVal;

          if (regex) {
            newVal = strVal.replace(matcher, replace || '');
          } else {
            if (matchCase) {
              newVal = strVal.split(find).join(replace || '');
            } else {
              const reg = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
              newVal = strVal.replace(reg, replace || '');
            }
          }

          if (newVal !== strVal) replaceCount++;
          return { ...row, [column]: newVal };
        });

        summary = `Replaced "${find}" with "${replace}" in "${column}" (${replaceCount} rows updated)`;
        break;
      }

      case 'convert_type': {
        const { column, targetType } = step.params;
        if (!column || !targetType) break;

        modifiedData = modifiedData.map(row => {
          const val = row[column];
          if (val === undefined || val === null || val === '') return row;
          const parsed = TypeDetector.parseRawValue(val, targetType);
          return {
            ...row,
            [column]: parsed !== null ? parsed : val
          };
        });

        modifiedColumns = modifiedColumns.map(col => {
          if (col.name === column) {
            return {
              ...col,
              type: targetType,
              isNumeric: [DATA_TYPES.NUMBER, DATA_TYPES.CURRENCY, DATA_TYPES.PERCENTAGE].includes(targetType)
            };
          }
          return col;
        });

        summary = `Converted column "${column}" to ${targetType.toUpperCase()}`;
        break;
      }

      case 'handle_blanks': {
        const { column, action, fillValue } = step.params;
        if (!column || !action) break;

        if (action === 'drop_row') {
          const initialCount = modifiedData.length;
          modifiedData = modifiedData.filter(row => {
            const val = row[column];
            return val !== undefined && val !== null && String(val).trim() !== '';
          });
          summary = `Dropped ${initialCount - modifiedData.length} row(s) with blank "${column}"`;
        } else if (action === 'fill_value') {
          let filled = 0;
          modifiedData = modifiedData.map(row => {
            const val = row[column];
            if (val === undefined || val === null || String(val).trim() === '') {
              filled++;
              return { ...row, [column]: fillValue };
            }
            return row;
          });
          summary = `Filled ${filled} blank(s) in "${column}" with "${fillValue}"`;
        } else if (action === 'fill_mean' || action === 'fill_median') {
          const nums = [];
          const colMeta = modifiedColumns.find(c => c.name === column);
          const colType = colMeta ? colMeta.type : DATA_TYPES.NUMBER;

          for (const r of modifiedData) {
            const val = r[column];
            if (val !== undefined && val !== null && String(val).trim() !== '') {
              const num = TypeDetector.parseRawValue(val, colType);
              if (num !== null) nums.push(num);
            }
          }

          let fillTarget = 0;
          if (nums.length > 0) {
            if (action === 'fill_mean') {
              fillTarget = nums.reduce((a, b) => a + b, 0) / nums.length;
            } else {
              nums.sort((a, b) => a - b);
              const mid = Math.floor(nums.length / 2);
              fillTarget = nums.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
            }
          }

          fillTarget = Number.isInteger(fillTarget) ? fillTarget : Number(fillTarget.toFixed(2));

          let filled = 0;
          modifiedData = modifiedData.map(row => {
            const val = row[column];
            if (val === undefined || val === null || String(val).trim() === '') {
              filled++;
              return { ...row, [column]: fillTarget };
            }
            return row;
          });
          summary = `Imputed ${filled} blank(s) in "${column}" with ${action === 'fill_mean' ? 'Mean' : 'Median'} (${fillTarget})`;
        } else if (action === 'ffill') {
          let lastVal = null;
          let filled = 0;
          modifiedData = modifiedData.map(row => {
            const val = row[column];
            if (val !== undefined && val !== null && String(val).trim() !== '') {
              lastVal = val;
              return row;
            } else if (lastVal !== null) {
              filled++;
              return { ...row, [column]: lastVal };
            }
            return row;
          });
          summary = `Forward-filled ${filled} blank cell(s) in "${column}"`;
        }
        break;
      }

      case 'calculated_column': {
        const { newColName, formula } = step.params;
        if (!newColName || !formula) break;

        modifiedData = DataEngine.calculateColumn(modifiedData, newColName, formula, modifiedColumns);
        const newCols = TypeDetector.detectDatasetColumns(modifiedData);
        modifiedColumns = newCols;
        summary = `Created calculated column "${newColName}" = ${formula}`;
        break;
      }

      case 'filter_rows': {
        const { conditions } = step.params;
        if (conditions && conditions.length > 0) {
          const initialCount = modifiedData.length;
          modifiedData = DataEngine.filterRows(modifiedData, conditions, modifiedColumns);
          summary = `Filtered rows (${initialCount - modifiedData.length} rows excluded)`;
        }
        break;
      }

      default:
        summary = 'Custom step';
    }

    return {
      data: modifiedData,
      columns: modifiedColumns,
      summary
    };
  }
}

window.PipelineEngine = PipelineEngine;
