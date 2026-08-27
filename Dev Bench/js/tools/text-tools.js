import { escapeHTML } from '../icons.js';

// --- Common Built-in Regex Presets ---
export const REGEX_PRESETS = [
  {
    name: 'Email Address (RFC 5322)',
    pattern: '[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+',
    flags: 'g',
    sample: 'Contact security@enterprise.dev or operations.lead@cloud-infra.io for escalation.'
  },
  {
    name: 'Semantic Versioning (SemVer)',
    pattern: 'v?(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?',
    flags: 'g',
    sample: 'Upgraded dependencies: v1.0.0, 2.14.3-beta.1, and 3.0.0-rc.2+build.892.'
  },
  {
    name: 'IPv4 Address & Port',
    pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?::(\\d{1,5}))?\\b',
    flags: 'g',
    sample: 'Cluster nodes bound to 192.168.1.1:8080 and 10.0.4.12:443.'
  },
  {
    name: 'UUID v4 / v7',
    pattern: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}',
    flags: 'g',
    sample: 'Generated sessions: 7b566580-c081-4ba2-8d77-62f928e40428 and 0191834e-723a-7f61-9c32-b7e1279a110a.'
  },
  {
    name: 'ISO 8601 Datetime',
    pattern: '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:\\d{2})',
    flags: 'g',
    sample: 'Audit log timestamps: 2026-08-28T09:30:00Z and 2026-08-28T14:15:22.450+00:00.'
  },
  {
    name: 'HTTP/HTTPS URL',
    pattern: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)',
    flags: 'g',
    sample: 'Check the documentation at https://api.devbench.io/v1/docs or http://localhost:3000/api.'
  }
];

// --- 1. Regex Tester ---
export function testRegex(patternStr, flagsStr, testString, replaceStr = '') {
  if (!patternStr) {
    return { isValid: true, matchCount: 0, matches: [], highlightedHTML: escapeHTML(testString), replacedText: testString };
  }

  try {
    const regex = new RegExp(patternStr, flagsStr || 'g');
    const matches = [];
    let match;

    if (flagsStr.includes('g')) {
      let loopCount = 0;
      while ((match = regex.exec(testString)) !== null && loopCount < 5000) {
        loopCount++;
        matches.push({
          index: match.index,
          length: match[0].length,
          value: match[0],
          groups: match.slice(1),
          namedGroups: match.groups || {}
        });
        if (match.index === regex.lastIndex) regex.lastIndex++;
      }
    } else {
      match = regex.exec(testString);
      if (match) {
        matches.push({
          index: match.index,
          length: match[0].length,
          value: match[0],
          groups: match.slice(1),
          namedGroups: match.groups || {}
        });
      }
    }

    // Build highlighted HTML
    let highlightedHTML = '';
    let lastIdx = 0;
    matches.forEach((m, idx) => {
      highlightedHTML += escapeHTML(testString.slice(lastIdx, m.index));
      highlightedHTML += `<mark class="regex-match" title="Match ${idx + 1} at pos ${m.index}">${escapeHTML(m.value)}</mark>`;
      lastIdx = m.index + m.length;
    });
    highlightedHTML += escapeHTML(testString.slice(lastIdx));

    // Replacement preview
    let replacedText = '';
    try {
      replacedText = testString.replace(regex, replaceStr);
    } catch (e) {
      replacedText = testString;
    }

    return {
      isValid: true,
      matchCount: matches.length,
      matches,
      highlightedHTML,
      replacedText
    };
  } catch (err) {
    return {
      isValid: false,
      error: err.message,
      matchCount: 0,
      matches: [],
      highlightedHTML: escapeHTML(testString),
      replacedText: testString
    };
  }
}

// --- 2. Text Diff Viewer ---
export function computeTextDiff(originalText, modifiedText, options = {}) {
  const { ignoreWhitespace = false, caseSensitive = true } = options;

  let origLines = (originalText || '').split('\n');
  let modLines = (modifiedText || '').split('\n');

  const normalize = (line) => {
    let l = ignoreWhitespace ? line.trim() : line;
    if (!caseSensitive) l = l.toLowerCase();
    return l;
  };

  // Matrix calculation for LCS
  const matrix = [];
  for (let i = 0; i <= origLines.length; i++) {
    matrix[i] = new Array(modLines.length + 1).fill(0);
  }

  for (let i = 1; i <= origLines.length; i++) {
    for (let j = 1; j <= modLines.length; j++) {
      if (normalize(origLines[i - 1]) === normalize(modLines[j - 1])) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      }
    }
  }

  // Backtrack LCS to build diff rows
  let i = origLines.length;
  let j = modLines.length;
  const diff = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && normalize(origLines[i - 1]) === normalize(modLines[j - 1])) {
      diff.unshift({ type: 'unchanged', lineOrig: i, lineMod: j, text: origLines[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
      diff.unshift({ type: 'added', lineOrig: null, lineMod: j, text: modLines[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
      diff.unshift({ type: 'removed', lineOrig: i, lineMod: null, text: origLines[i - 1] });
      i--;
    }
  }

  const addedCount = diff.filter(d => d.type === 'added').length;
  const removedCount = diff.filter(d => d.type === 'removed').length;
  const unchangedCount = diff.filter(d => d.type === 'unchanged').length;

  return {
    diff,
    stats: {
      added: addedCount,
      removed: removedCount,
      unchanged: unchangedCount,
      total: diff.length
    }
  };
}

// --- 3. Line Sorter ---
export function sortLines(input, mode = 'asc', caseSensitive = false) {
  if (!input) return '';
  let lines = input.split('\n');

  if (mode === 'shuffle') {
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    return lines.join('\n');
  }

  if (mode === 'reverse') {
    return lines.reverse().join('\n');
  }

  if (mode === 'length') {
    lines.sort((a, b) => a.length - b.length);
    return lines.join('\n');
  }

  if (mode === 'length-desc') {
    lines.sort((a, b) => b.length - a.length);
    return lines.join('\n');
  }

  // Alphabetical & Natural
  lines.sort((a, b) => {
    let strA = caseSensitive ? a : a.toLowerCase();
    let strB = caseSensitive ? b : b.toLowerCase();
    const res = strA.localeCompare(strB, undefined, { numeric: true, sensitivity: caseSensitive ? 'variant' : 'base' });
    return mode === 'desc' ? -res : res;
  });

  return lines.join('\n');
}

// --- 4. Duplicate Line Remover ---
export function removeDuplicateLines(input, options = {}) {
  if (!input) return { output: '', originalCount: 0, uniqueCount: 0, removedCount: 0 };
  const { caseSensitive = false, trimLines = false, removeEmpty = false } = options;

  let lines = input.split('\n');
  if (removeEmpty) {
    lines = lines.filter(l => l.trim().length > 0);
  }

  const seen = new Set();
  const result = [];

  lines.forEach(line => {
    let key = trimLines ? line.trim() : line;
    if (!caseSensitive) key = key.toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);
      result.push(trimLines ? line.trim() : line);
    }
  });

  return {
    output: result.join('\n'),
    originalCount: lines.length,
    uniqueCount: result.length,
    removedCount: lines.length - result.length
  };
}

// --- 5. Whitespace Cleaner ---
export function cleanWhitespace(input, options = {}) {
  if (!input) return '';
  const {
    trimLines = true,
    removeEmptyLines = false,
    collapseSpaces = false,
    tabsToSpaces = false,
    tabSize = 2,
    normalizeLineEndings = 'lf'
  } = options;

  let text = input;

  if (tabsToSpaces) {
    text = text.replace(/\t/g, ' '.repeat(tabSize));
  }

  let lines = text.split(/\r?\n/);

  if (trimLines) {
    lines = lines.map(l => l.trim());
  }

  if (collapseSpaces) {
    lines = lines.map(l => l.replace(/[ \t]{2,}/g, ' '));
  }

  if (removeEmptyLines) {
    lines = lines.filter(l => l.length > 0);
  }

  const delimiter = normalizeLineEndings === 'crlf' ? '\r\n' : '\n';
  return lines.join(delimiter);
}

// --- 6. Case Converter ---
export function convertCase(input, targetCase) {
  if (!input) return '';

  const words = extractWords(input);

  switch (targetCase) {
    case 'camelCase':
      return words.map((w, i) => i === 0 ? w.toLowerCase() : capitalize(w)).join('');
    case 'PascalCase':
      return words.map(capitalize).join('');
    case 'snake_case':
      return words.map(w => w.toLowerCase()).join('_');
    case 'kebab-case':
      return words.map(w => w.toLowerCase()).join('-');
    case 'CONSTANT_CASE':
      return words.map(w => w.toUpperCase()).join('_');
    case 'Title Case':
      return words.map(capitalize).join(' ');
    case 'sentence case':
      return words.map((w, i) => i === 0 ? capitalize(w) : w.toLowerCase()).join(' ');
    case 'dot.case':
      return words.map(w => w.toLowerCase()).join('.');
    case 'path/case':
      return words.map(w => w.toLowerCase()).join('/');
    case 'Train-Case':
      return words.map(capitalize).join('-');
    case 'alternating':
      return input.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
    case 'reverse':
      return input.split('').reverse().join('');
    default:
      return input;
  }
}

function extractWords(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // split camelCase
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[-_./\\]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function capitalize(word) {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
