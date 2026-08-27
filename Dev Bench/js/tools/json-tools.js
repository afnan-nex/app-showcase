/**
 * DevBench - JSON Tools Engine
 * JSON Formatter, JSON Validator, and Interactive JSON Tree Viewer.
 */

import { getIcon, escapeHTML } from '../icons.js';

// --- 1. JSON Formatter & Minifier ---
export function formatJSON(input, options = {}) {
  const { indent = 2, sortKeys = false, removeNulls = false } = options;
  if (!input || !input.trim()) {
    return { success: true, output: '', size: 0, lines: 0 };
  }

  try {
    let parsed = JSON.parse(input);

    if (removeNulls) {
      parsed = cleanNullValues(parsed);
    }
    if (sortKeys) {
      parsed = sortObjectKeys(parsed);
    }

    const spacer = indent === 'tab' ? '\t' : (indent === 0 ? '' : Number(indent));
    const output = JSON.stringify(parsed, null, spacer);
    const size = new Blob([output]).size;
    const lines = output.split('\n').length;

    return { success: true, output, size, lines, error: null };
  } catch (err) {
    return { success: false, output: '', error: err.message, errorPos: extractErrorPosition(err.message, input) };
  }
}

function cleanNullValues(obj) {
  if (Array.isArray(obj)) {
    return obj.map(cleanNullValues).filter(v => v !== null && v !== undefined);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [k, v]) => {
      if (v !== null && v !== undefined) {
        acc[k] = cleanNullValues(v);
      }
      return acc;
    }, {});
  }
  return obj;
}

function sortObjectKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).sort().reduce((acc, key) => {
      acc[key] = sortObjectKeys(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

// --- 2. JSON Validator ---
export function validateJSON(input) {
  if (!input || !input.trim()) {
    return { isValid: false, message: 'Input is empty' };
  }

  try {
    const parsed = JSON.parse(input);
    const type = Array.isArray(parsed) ? 'Array' : (parsed === null ? 'Null' : typeof parsed);
    const size = new Blob([input]).size;
    const keysCount = typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 1;
    
    return {
      isValid: true,
      type,
      size,
      keysCount,
      message: `Valid JSON (${type} with ${keysCount} top-level ${keysCount === 1 ? 'element' : 'elements'})`
    };
  } catch (err) {
    const pos = extractErrorPosition(err.message, input);
    return {
      isValid: false,
      message: err.message,
      line: pos.line,
      column: pos.column,
      snippet: pos.snippet
    };
  }
}

function extractErrorPosition(errMsg, input) {
  let line = 1;
  let column = 1;
  let snippet = '';

  // Look for "at position X" in Chrome / standard V8
  const posMatch = errMsg.match(/position\s+(\d+)/i);
  if (posMatch) {
    const index = parseInt(posMatch[1], 10);
    const upToIndex = input.slice(0, index);
    const lines = upToIndex.split('\n');
    line = lines.length;
    column = lines[lines.length - 1].length + 1;

    const allLines = input.split('\n');
    const startLine = Math.max(0, line - 2);
    const endLine = Math.min(allLines.length, line + 1);
    snippet = allLines.slice(startLine, endLine).join('\n');
  }

  // Look for "line X column Y" in Firefox
  const lineColMatch = errMsg.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  if (lineColMatch) {
    line = parseInt(lineColMatch[1], 10);
    column = parseInt(lineColMatch[2], 10);
  }

  return { line, column, snippet };
}

// --- 3. Interactive JSON Tree Viewer ---
export function buildJSONTreeHTML(data, searchTerm = '', currentPath = '$') {
  if (data === null) {
    return `<span class="tree-val val-null">null</span>`;
  }
  if (typeof data === 'boolean') {
    return `<span class="tree-val val-bool">${data}</span>`;
  }
  if (typeof data === 'number') {
    return `<span class="tree-val val-number">${data}</span>`;
  }
  if (typeof data === 'string') {
    return `<span class="tree-val val-string">"${escapeHTML(data)}"</span>`;
  }

  const isArray = Array.isArray(data);
  const keys = Object.keys(data);
  const count = keys.length;
  const countBadge = isArray ? `[${count}]` : `{${count}}`;

  let childrenHTML = '';
  keys.forEach(key => {
    const childVal = data[key];
    const childPath = isArray ? `${currentPath}[${key}]` : `${currentPath}.${key}`;
    const childTree = buildJSONTreeHTML(childVal, searchTerm, childPath);
    const isMatched = searchTerm && (key.toLowerCase().includes(searchTerm.toLowerCase()) || JSON.stringify(childVal).toLowerCase().includes(searchTerm.toLowerCase()));

    childrenHTML += `
      <div class="tree-node-row ${isMatched ? 'tree-match' : ''}">
        <span class="tree-key font-mono" data-path="${childPath}">
          <span class="key-name">${escapeHTML(key)}</span>:
        </span>
        <div class="tree-node-content">${childTree}</div>
      </div>
    `;
  });

  return `
    <div class="tree-collapsible open" data-path="${currentPath}">
      <span class="tree-toggle-btn">${getIcon('chevronDown', 'icon-xs')}</span>
      <span class="tree-type-badge font-mono">${countBadge}</span>
      <div class="tree-children">
        ${childrenHTML}
      </div>
    </div>
  `;
}


