/**
 * BudgetOS - Formatters & Mathematical Utility Module
 */

let activeCurrency = 'USD';
let activeLocale = 'en-US';

const CURRENCY_MAP = {
  USD: { symbol: '$', code: 'USD', locale: 'en-US' },
  EUR: { symbol: '€', code: 'EUR', locale: 'de-DE' },
  GBP: { symbol: '£', code: 'GBP', locale: 'en-GB' },
  CAD: { symbol: 'CA$', code: 'CAD', locale: 'en-CA' },
  AUD: { symbol: 'A$', code: 'AUD', locale: 'en-AU' },
  JPY: { symbol: '¥', code: 'JPY', locale: 'ja-JP' },
  INR: { symbol: '₹', code: 'INR', locale: 'en-IN' },
  CHF: { symbol: 'CHF', code: 'CHF', locale: 'de-CH' }
};

export function setCurrencyConfig(currencyCode) {
  if (CURRENCY_MAP[currencyCode]) {
    activeCurrency = currencyCode;
    activeLocale = CURRENCY_MAP[currencyCode].locale;
  }
}

export function getCurrencyConfig() {
  return CURRENCY_MAP[activeCurrency] || CURRENCY_MAP.USD;
}

export function getSupportedCurrencies() {
  return Object.keys(CURRENCY_MAP).map(key => ({
    code: key,
    symbol: CURRENCY_MAP[key].symbol,
    label: `${key} (${CURRENCY_MAP[key].symbol})`
  }));
}

/**
 * Format a number as currency
 * @param {number} amount - Monetary amount
 * @param {Object} [options]
 * @param {boolean} [options.hideDecimals=false]
 * @param {boolean} [options.showSign=false] - Explicit + for positive
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, options = {}) {
  const num = Number(amount) || 0;
  const config = getCurrencyConfig();
  const hideDecimals = options.hideDecimals || (config.code === 'JPY');
  
  let formatted = new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: hideDecimals ? 0 : 2,
    maximumFractionDigits: hideDecimals ? 0 : 2
  }).format(num);

  if (options.showSign && num > 0) {
    formatted = '+' + formatted;
  }
  return formatted;
}

/**
 * Format compact currency e.g. $1.2k, $4.5M
 */
export function formatCompactCurrency(amount) {
  const num = Number(amount) || 0;
  const config = getCurrencyConfig();
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(num);
}

/**
 * Format percentage (e.g. 84.2%)
 */
export function formatPercent(value, decimals = 1) {
  const num = Number(value) || 0;
  return `${num.toFixed(decimals)}%`;
}

/**
 * Format ISO Date string to readable format (e.g. "Aug 27, 2026")
 */
export function formatDate(dateString, format = 'medium') {
  if (!dateString) return '—';
  const d = new Date(dateString + 'T00:00:00');
  if (isNaN(d.getTime())) return dateString;

  if (format === 'short') {
    return d.toLocaleDateString(activeLocale, { month: 'short', day: 'numeric' });
  }
  if (format === 'medium') {
    return d.toLocaleDateString(activeLocale, { month: 'short', day: 'numeric', year: 'numeric' });
  }
  if (format === 'monthYear') {
    return d.toLocaleDateString(activeLocale, { month: 'long', year: 'numeric' });
  }
  if (format === 'iso') {
    return d.toISOString().split('T')[0];
  }
  return d.toLocaleDateString();
}

/**
 * Relative date description e.g. "Today", "Tomorrow", "In 3 days", "5 days ago"
 */
export function formatRelativeDate(dateString) {
  if (!dateString) return '—';
  const target = new Date(dateString + 'T00:00:00');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
  return formatDate(dateString, 'medium');
}

/**
 * Get current Month Year key "YYYY-MM"
 */
export function getMonthKey(date = new Date()) {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Format Month Key "YYYY-MM" to "August 2026"
 */
export function formatMonthKey(monthKey) {
  if (!monthKey || !monthKey.includes('-')) return monthKey;
  const [year, month] = monthKey.split('-');
  const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return d.toLocaleDateString(activeLocale, { month: 'long', year: 'numeric' });
}

/**
 * Date arithmetic utilities
 */
export function addDays(dateStrOrObj, days) {
  const d = typeof dateStrOrObj === 'string' ? new Date(dateStrOrObj + 'T00:00:00') : new Date(dateStrOrObj);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function addMonths(dateStrOrObj, months) {
  const d = typeof dateStrOrObj === 'string' ? new Date(dateStrOrObj + 'T00:00:00') : new Date(dateStrOrObj);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}

export function getDaysBetween(date1Str, date2Str) {
  const d1 = new Date(date1Str + 'T00:00:00');
  const d2 = new Date(date2Str + 'T00:00:00');
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

export function getTodayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

/**
 * Escape HTML to prevent injection
 */
export function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Parse CSV string to 2D Array
 */
export function parseCSV(csvText) {
  const lines = [];
  let row = [''];
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push('');
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      lines.push(row);
      row = [''];
    } else {
      row[row.length - 1] += char;
    }
  }
  if (row.length > 1 || (row.length === 1 && row[0].trim() !== '')) {
    lines.push(row);
  }
  return lines;
}

/**
 * Generate CSV string from row objects
 */
export function generateCSV(headers, data) {
  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  };

  const headerRow = headers.map(h => escapeCell(h.label)).join(',');
  const rows = data.map(item => {
    return headers.map(h => escapeCell(item[h.key])).join(',');
  });

  return [headerRow, ...rows].join('\r\n');
}
