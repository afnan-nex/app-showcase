/**
 * DevBench - Standalone Application Bundle
 * 20 Professional Developer Utilities in One Unified Browser Workstation.
 * 100% Client-Side, Zero Backend, Works on HTTP & file:///
 */

(function() {
'use strict';


/* --- MODULE: js/icons.js --- */
/**
 * DevBench - Local SVG Icons Registry
 * Crisp, developer-focused, high-contrast SVG icons for the workstation.
 */

const ICONS = {
  // Brand & Shell
  terminal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  command: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  starFilled: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  history: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  bookmark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
  swap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`,
  alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
  chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
  sidebar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>`,

  // Tool Specific Icons
  json: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  tree: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>`,
  base64: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"></rect><line x1="7" y1="8" x2="17" y2="8"></line><line x1="7" y1="12" x2="17" y2="12"></line><line x1="7" y1="16" x2="13" y2="16"></line></svg>`,
  url: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
  jwt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
  uuid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
  timestamp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>`,
  regex: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>`,
  diff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle></svg>`,
  hash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>`,
  color: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 1 10 10c0 3-2 5.5-5 5.5h-1.5a1.5 1.5 0 0 0-1.5 1.5c0 .8-.7 1.5-1.5 1.5A10.5 10.5 0 0 1 12 2z"></path></svg>`,
  html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 8 3 12 7 16"></polyline><polyline points="17 8 21 12 17 16"></polyline><line x1="14" y1="4" x2="10" y2="20"></line></svg>`,
  http: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
  lorem: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  case: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>`,
  sort: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="11" y2="6"></line><line x1="4" y1="12" x2="11" y2="12"></line><line x1="4" y1="18" x2="13" y2="18"></line><polyline points="15 9 18 6 21 9"></polyline><line x1="18" y1="6" x2="18" y2="18"></line></svg>`,
  dedup: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path><line x1="12" y1="12" x2="19" y2="19"></line></svg>`,
  clean: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`
};

function getIcon(name, extraClass = '') {
  const svg = ICONS[name] || ICONS.terminal;
  if (!extraClass) return svg;
  return svg.replace('<svg ', `<svg class="${extraClass}" `);
}

function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

ICONS;


/* --- MODULE: js/storage.js --- */
/**
 * DevBench - Storage & State Management Module
 * Manages favorites, recent tools, theme, input history, and saved snippets using localStorage.
 */

const STORAGE_KEYS = {
  THEME: 'devbench_theme',
  FAVORITES: 'devbench_favorites',
  RECENT: 'devbench_recent_tools',
  OPEN_TABS: 'devbench_open_tabs',
  ACTIVE_TAB: 'devbench_active_tab',
  HISTORY: 'devbench_tool_history',
  SNIPPETS: 'devbench_saved_snippets'
};

const DEFAULT_FAVORITES = ['json-formatter', 'jwt-decoder', 'base64', 'regex-tester', 'text-diff'];

function getTheme() {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  } catch (e) {
    return 'dark';
  }
}

function setTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {}
}

function getFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : DEFAULT_FAVORITES;
  } catch (e) {
    return DEFAULT_FAVORITES;
  }
}

function toggleFavorite(toolId) {
  const favs = getFavorites();
  const idx = favs.indexOf(toolId);
  if (idx !== -1) {
    favs.splice(idx, 1);
  } else {
    favs.push(toolId);
  }
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
  } catch (e) {}
  return favs;
}

function getRecentTools() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENT);
    return raw ? JSON.parse(raw) : ['json-formatter', 'jwt-decoder', 'uuid-gen', 'hash-gen'];
  } catch (e) {
    return [];
  }
}

function recordRecentTool(toolId) {
  let recents = getRecentTools().filter(id => id !== toolId);
  recents.unshift(toolId);
  if (recents.length > 8) recents = recents.slice(0, 8);
  try {
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(recents));
  } catch (e) {}
}

function getOpenTabs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OPEN_TABS);
    return raw ? JSON.parse(raw) : ['json-formatter'];
  } catch (e) {
    return ['json-formatter'];
  }
}

function saveOpenTabs(tabs) {
  try {
    localStorage.setItem(STORAGE_KEYS.OPEN_TABS, JSON.stringify(tabs));
  } catch (e) {}
}

function getActiveTab() {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB) || 'json-formatter';
  } catch (e) {
    return 'json-formatter';
  }
}

function saveActiveTab(tabId) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tabId);
  } catch (e) {}
}

/**
 * Tool Input History Stack
 */
function getToolHistory(toolId) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '{}');
    return all[toolId] || [];
  } catch (e) {
    return [];
  }
}

function addToolHistory(toolId, inputVal) {
  if (!inputVal || !inputVal.trim()) return;
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '{}');
    let list = all[toolId] || [];
    // Remove duplicate of same value
    list = list.filter(item => item.value !== inputVal);
    list.unshift({
      id: 'h_' + Date.now(),
      value: inputVal,
      timestamp: Date.now(),
      snippet: inputVal.slice(0, 80).replace(/\n/g, ' ')
    });
    if (list.length > 15) list = list.slice(0, 15);
    all[toolId] = list;
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(all));
  } catch (e) {}
}

function clearToolHistory(toolId) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '{}');
    delete all[toolId];
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(all));
  } catch (e) {}
}

/**
 * Saved Snippets
 */
function getSavedSnippets(toolId = null) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SNIPPETS);
    const list = raw ? JSON.parse(raw) : [];
    if (toolId) return list.filter(s => s.toolId === toolId);
    return list;
  } catch (e) {
    return [];
  }
}

function saveSnippet(toolId, title, content) {
  if (!content || !title) return;
  try {
    const list = getSavedSnippets();
    list.unshift({
      id: 'snip_' + Date.now(),
      toolId,
      title: title.trim(),
      content,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(list));
  } catch (e) {}
}

function deleteSnippet(snippetId) {
  try {
    let list = getSavedSnippets();
    list = list.filter(s => s.id !== snippetId);
    localStorage.setItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(list));
  } catch (e) {}
}


/* --- MODULE: js/tools/encoding-tools.js --- */
/**
 * DevBench - Encoding & Decoding Tools Engine
 * Base64 Encoder/Decoder, URL Encoder/Decoder, and HTML Entity Encoder/Decoder.
 */

// --- 1. Base64 Encoder / Decoder (UTF-8 Safe) ---
function encodeBase64(input, urlSafe = false) {
  if (!input) return '';
  try {
    const bytes = new TextEncoder().encode(input);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    let base64 = btoa(binary);
    if (urlSafe) {
      base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    return base64;
  } catch (err) {
    throw new Error('Base64 encoding failed: ' + err.message);
  }
}

function decodeBase64(input) {
  if (!input) return '';
  try {
    let clean = input.trim();
    // Support URL-safe base64
    clean = clean.replace(/-/g, '+').replace(/_/g, '/');
    while (clean.length % 4 !== 0) {
      clean += '=';
    }
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (err) {
    throw new Error('Invalid Base64 string: ' + err.message);
  }
}

// --- 2. URL Encoder / Decoder ---
function encodeURL(input, mode = 'component') {
  if (!input) return '';
  if (mode === 'component') {
    return encodeURIComponent(input);
  }
  if (mode === 'form') {
    return encodeURIComponent(input).replace(/%20/g, '+');
  }
  return encodeURI(input);
}

function decodeURL(input, mode = 'component') {
  if (!input) return '';
  try {
    let clean = input;
    if (mode === 'form') {
      clean = clean.replace(/\+/g, ' ');
    }
    return decodeURIComponent(clean);
  } catch (err) {
    throw new Error('Invalid URL-encoded string: ' + err.message);
  }
}

// --- 3. HTML Entity Encoder / Decoder ---
function encodeHTMLEntities(input, mode = 'named') {
  if (!input) return '';

  if (mode === 'named') {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  if (mode === 'decimal') {
    return Array.from(input)
      .map(char => `&#${char.charCodeAt(0)};`)
      .join('');
  }

  if (mode === 'hex') {
    return Array.from(input)
      .map(char => `&#x${char.charCodeAt(0).toString(16).toUpperCase()};`)
      .join('');
  }

  return input;
}

function decodeHTMLEntities(input) {
  if (!input) return '';
  const ENTITY_MAP = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&#39;': "'",
    '&nbsp;': ' '
  };

  let decoded = input.replace(/&(?:amp|lt|gt|quot|apos|nbsp|#39);/g, match => ENTITY_MAP[match] || match);

  // Decimal entities (&#123;)
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
    try {
      return String.fromCharCode(parseInt(dec, 10));
    } catch (e) {
      return match;
    }
  });

  // Hex entities (&#x7B;)
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
    try {
      return String.fromCharCode(parseInt(hex, 16));
    } catch (e) {
      return match;
    }
  });

  return decoded;
}


/* --- MODULE: js/tools/json-tools.js --- */
/**
 * DevBench - JSON Tools Engine
 * JSON Formatter, JSON Validator, and Interactive JSON Tree Viewer.
 */



// --- 1. JSON Formatter & Minifier ---
function formatJSON(input, options = {}) {
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
function validateJSON(input) {
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
function buildJSONTreeHTML(data, searchTerm = '', currentPath = '$') {
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




/* --- MODULE: js/tools/security-tools.js --- */
/**
 * DevBench - Security & Cryptographic Tools Engine
 * JWT Decoder, Hash Generator (Web Crypto + MD5/CRC32), and UUID/ID Generator.
 */



// --- 1. JWT Decoder ---
function decodeJWT(token) {
  if (!token || !token.trim()) {
    return { success: false, error: 'Please enter a JWT token' };
  }

  try {
    const parts = token.trim().split('.');
    if (parts.length < 2 || parts.length > 3) {
      return { success: false, error: 'Invalid JWT structure: Token must contain 2 or 3 dot-separated segments' };
    }

    const headerJSON = decodeBase64(parts[0]);
    const payloadJSON = decodeBase64(parts[1]);

    const header = JSON.parse(headerJSON);
    const payload = JSON.parse(payloadJSON);
    const signature = parts[2] || '';

    // Inspect claims
    let expirationStatus = null;
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000);
      const isExpired = expDate.getTime() < Date.now();
      expirationStatus = {
        date: expDate.toISOString(),
        isExpired,
        human: isExpired ? `Expired on ${expDate.toLocaleString()}` : `Valid until ${expDate.toLocaleString()}`
      };
    }

    let issuedAtStatus = null;
    if (payload.iat) {
      const iatDate = new Date(payload.iat * 1000);
      issuedAtStatus = iatDate.toLocaleString();
    }

    return {
      success: true,
      header,
      payload,
      signature,
      expirationStatus,
      issuedAtStatus,
      rawHeader: JSON.stringify(header, null, 2),
      rawPayload: JSON.stringify(payload, null, 2)
    };
  } catch (err) {
    return { success: false, error: 'Failed to decode JWT: ' + err.message };
  }
}

// --- 2. Hash & Checksum Generator ---
async function generateHashes(input, hmacKey = '') {
  if (!input) {
    return { sha256: '', sha384: '', sha512: '', sha1: '', md5: '', crc32: '' };
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  // Web Crypto standard algorithms
  let sha256 = '';
  let sha384 = '';
  let sha512 = '';
  let sha1 = '';

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    if (hmacKey) {
      const keyData = encoder.encode(hmacKey);
      const key256 = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
      const sig256 = await crypto.subtle.sign('HMAC', key256, data);
      sha256 = bufToHex(sig256);

      const key512 = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-512' }, false, ['sign']);
      const sig512 = await crypto.subtle.sign('HMAC', key512, data);
      sha512 = bufToHex(sig512);
    } else {
      const buf256 = await crypto.subtle.digest('SHA-256', data);
      sha256 = bufToHex(buf256);

      const buf384 = await crypto.subtle.digest('SHA-384', data);
      sha384 = bufToHex(buf384);

      const buf512 = await crypto.subtle.digest('SHA-512', data);
      sha512 = bufToHex(buf512);

      const buf1 = await crypto.subtle.digest('SHA-1', data);
      sha1 = bufToHex(buf1);
    }
  }

  const md5 = computeMD5(input);
  const crc32 = computeCRC32(input);

  return { sha256, sha384, sha512, sha1, md5, crc32 };
}

function bufToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Pure JS CRC32
function computeCRC32(str) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < str.length; i++) {
    let byte = str.charCodeAt(i);
    for (let j = 0; j < 8; j++) {
      let bit = (crc ^ byte) & 1;
      crc >>>= 1;
      if (bit) crc ^= 0xEDB88320;
      byte >>>= 1;
    }
  }
  return ((crc ^ (-1)) >>> 0).toString(16).padStart(8, '0');
}

// Pure JS MD5
function computeMD5(string) {
  function md5cycle(x, k) {
    let a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }
  function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
  function add32(a, b) { return (a + b) & 0xFFFFFFFF; }

  let n = string.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
  let tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (i = 64; i <= n; i += 64) {
    let block = [];
    for (let j = 0; j < 16; j++) {
      let idx = i - 64 + j * 4;
      block[j] = string.charCodeAt(idx) | (string.charCodeAt(idx + 1) << 8) | (string.charCodeAt(idx + 2) << 16) | (string.charCodeAt(idx + 3) << 24);
    }
    md5cycle(state, block);
  }
  let s = string.substring(i - 64);
  for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
  tail[i >> 2] |= 0x80 << ((i % 4) << 3);
  if (i > 55) {
    md5cycle(state, tail);
    for (i = 0; i < 16; i++) tail[i] = 0;
  }
  tail[14] = n * 8;
  md5cycle(state, tail);
  let hex = '';
  for (i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let b = (state[i] >>> (j * 8)) & 0xFF;
      hex += b.toString(16).padStart(2, '0');
    }
  }
  return hex;
}

// --- 3. UUID / ID Generator ---
function generateUUID(version = 'v4') {
  if (version === 'v4') {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  if (version === 'ulid') {
    // ULID: 10 chars timestamp + 16 chars random (Crockford Base32)
    const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    const now = Date.now();
    let timeStr = '';
    let t = now;
    for (let i = 9; i >= 0; i--) {
      timeStr = ENCODING[t % 32] + timeStr;
      t = Math.floor(t / 32);
    }
    let randStr = '';
    for (let i = 0; i < 16; i++) {
      randStr += ENCODING[Math.floor(Math.random() * 32)];
    }
    return timeStr + randStr;
  }

  if (version === 'v7') {
    // Unix epoch millis (48 bit) + 12 bit rand + 62 bit rand
    const now = Date.now().toString(16).padStart(12, '0');
    const rand = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return `${now.slice(0, 8)}-${now.slice(8, 12)}-7${rand.slice(0, 3)}-8${rand.slice(3, 6)}-${rand.slice(6, 18)}`;
  }

  return crypto.randomUUID();
}

function generateBulkUUIDs(count = 10, options = {}) {
  const { version = 'v4', uppercase = false, hyphens = true, format = 'list' } = options;
  const list = [];
  for (let i = 0; i < count; i++) {
    let id = generateUUID(version);
    if (!hyphens) id = id.replace(/-/g, '');
    if (uppercase) id = id.toUpperCase();
    else id = id.toLowerCase();
    list.push(id);
  }

  if (format === 'json') {
    return JSON.stringify(list, null, 2);
  }
  if (format === 'csv') {
    return list.join(', ');
  }
  return list.join('\n');
}


/* --- MODULE: js/tools/text-tools.js --- */



// --- 1. Regex Tester ---
function testRegex(patternStr, flagsStr, testString, replaceStr = '') {
  if (!patternStr) {
    return { isValid: true, matches: [], highlightedHTML: escapeHTML(testString), replacedText: testString };
  }

  try {
    const regex = new RegExp(patternStr, flagsStr || 'g');
    const matches = [];
    let match;

    if (flagsStr.includes('g')) {
      while ((match = regex.exec(testString)) !== null) {
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
      highlightedHTML += `<mark class="regex-match" title="Match ${idx + 1}">${escapeHTML(m.value)}</mark>`;
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
      matches: [],
      highlightedHTML: escapeHTML(testString),
      replacedText: testString
    };
  }
}

// --- 2. Text Diff Viewer ---
function computeTextDiff(originalText, modifiedText, options = {}) {
  const { ignoreWhitespace = false } = options;

  let origLines = (originalText || '').split('\n');
  let modLines = (modifiedText || '').split('\n');

  if (ignoreWhitespace) {
    origLines = origLines.map(l => l.trim());
    modLines = modLines.map(l => l.trim());
  }

  // Myers/LCS-like line diff
  const matrix = [];
  for (let i = 0; i <= origLines.length; i++) {
    matrix[i] = new Array(modLines.length + 1).fill(0);
  }

  for (let i = 1; i <= origLines.length; i++) {
    for (let j = 1; j <= modLines.length; j++) {
      if (origLines[i - 1] === modLines[j - 1]) {
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
    if (i > 0 && j > 0 && origLines[i - 1] === modLines[j - 1]) {
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

  let addedCount = diff.filter(d => d.type === 'added').length;
  let removedCount = diff.filter(d => d.type === 'removed').length;
  let unchangedCount = diff.filter(d => d.type === 'unchanged').length;

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
function sortLines(input, mode = 'asc', caseSensitive = false) {
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
function removeDuplicateLines(input, options = {}) {
  if (!input) return { output: '', originalCount: 0, uniqueCount: 0, removedCount: 0 };
  const { caseSensitive = false, trimLines = false } = options;

  const lines = input.split('\n');
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
function cleanWhitespace(input, options = {}) {
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
function convertCase(input, targetCase) {
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




/* --- MODULE: js/tools/network-tools.js --- */
/**
 * DevBench - Network & API Tools Engine
 * URL Parser & Query Inspector, and HTTP Request Builder / Simulator.
 */

// --- 1. URL Parser & Query Inspector ---
function parseURL(urlStr) {
  if (!urlStr || !urlStr.trim()) {
    return { isValid: false, error: 'URL string is empty' };
  }

  let formattedUrl = urlStr.trim();
  if (!/^https?:\/\//i.test(formattedUrl) && !/^wss?:\/\//i.test(formattedUrl) && !/^file:\/\//i.test(formattedUrl)) {
    formattedUrl = 'https://' + formattedUrl;
  }

  try {
    const parsed = new URL(formattedUrl);
    const searchParams = [];
    parsed.searchParams.forEach((val, key) => {
      searchParams.push({ key, value: val });
    });

    return {
      isValid: true,
      href: parsed.href,
      protocol: parsed.protocol,
      host: parsed.host,
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? '443' : (parsed.protocol === 'http:' ? '80' : '')),
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
      origin: parsed.origin,
      username: parsed.username,
      password: parsed.password,
      searchParams
    };
  } catch (err) {
    return { isValid: false, error: 'Invalid URL: ' + err.message };
  }
}

function rebuildURL(parsedData, queryParams = []) {
  try {
    let base = `${parsedData.protocol}//${parsedData.hostname}${parsedData.port && !['80', '443'].includes(parsedData.port) ? ':' + parsedData.port : ''}${parsedData.pathname || '/'}`;
    if (queryParams.length > 0) {
      const sp = new URLSearchParams();
      queryParams.forEach(p => {
        if (p.key.trim()) sp.append(p.key.trim(), p.value);
      });
      const qs = sp.toString();
      if (qs) base += '?' + qs;
    }
    if (parsedData.hash) {
      base += (parsedData.hash.startsWith('#') ? '' : '#') + parsedData.hash;
    }
    return base;
  } catch (e) {
    return parsedData.href || '';
  }
}

// --- 2. HTTP Request Builder & Simulator ---
async function executeHTTPRequest({
  method = 'GET',
  url = '',
  headers = {},
  body = '',
  isSimulated = false,
  mockStatus = 200,
  mockLatency = 150
}) {
  if (!url) {
    return { success: false, error: 'Request URL cannot be empty' };
  }

  const startTime = performance.now();

  // Simulated Offline Mode
  if (isSimulated) {
    await new Promise(r => setTimeout(r, mockLatency));
    const duration = Math.round(performance.now() - startTime);
    const mockResponses = {
      200: { status: 200, statusText: 'OK', body: JSON.stringify({ message: 'Simulated 200 OK Response', method, url, timestamp: new Date().toISOString() }, null, 2) },
      201: { status: 201, statusText: 'Created', body: JSON.stringify({ message: 'Simulated 201 Resource Created', id: 'res_' + Math.random().toString(36).substr(2, 6) }, null, 2) },
      400: { status: 400, statusText: 'Bad Request', body: JSON.stringify({ error: 'Bad Request', detail: 'Invalid parameters in simulated request' }, null, 2) },
      404: { status: 404, statusText: 'Not Found', body: JSON.stringify({ error: 'Not Found', detail: `Endpoint ${url} was not found` }, null, 2) },
      500: { status: 500, statusText: 'Internal Server Error', body: JSON.stringify({ error: 'Internal Server Error', detail: 'Simulated server fault' }, null, 2) }
    };

    const resp = mockResponses[mockStatus] || mockResponses[200];
    return {
      success: true,
      status: resp.status,
      statusText: resp.statusText,
      headers: { 'content-type': 'application/json; charset=utf-8', 'x-simulated-by': 'DevBench' },
      body: resp.body,
      duration,
      isSimulated: true
    };
  }

  // Real HTTP Fetch
  try {
    const fetchOptions = {
      method: method.toUpperCase(),
      headers: new Headers(headers)
    };

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase()) && body) {
      fetchOptions.body = body;
    }

    const response = await fetch(url, fetchOptions);
    const duration = Math.round(performance.now() - startTime);

    const respHeaders = {};
    response.headers.forEach((val, key) => {
      respHeaders[key] = val;
    });

    const textBody = await response.text();
    let formattedBody = textBody;
    try {
      formattedBody = JSON.stringify(JSON.parse(textBody), null, 2);
    } catch (e) {}

    return {
      success: true,
      status: response.status,
      statusText: response.statusText,
      headers: respHeaders,
      body: formattedBody,
      duration,
      isSimulated: false
    };
  } catch (err) {
    const duration = Math.round(performance.now() - startTime);
    return {
      success: false,
      error: `Network Error: ${err.message}. If this is a cross-origin request, the endpoint must support CORS (Access-Control-Allow-Origin). You can switch to "Simulated Mode" to test payloads offline.`,
      duration,
      isCorsError: true
    };
  }
}

function generateCurlCommand({ method = 'GET', url = '', headers = {}, body = '' }) {
  let curl = `curl -X ${method.toUpperCase()} "${url}"`;
  Object.entries(headers).forEach(([k, v]) => {
    if (k && v) curl += ` \\\n  -H "${k}: ${v}"`;
  });
  if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && body) {
    const escaped = body.replace(/"/g, '\\"');
    curl += ` \\\n  -d "${escaped}"`;
  }
  return curl;
}


/* --- MODULE: js/tools/conversion-tools.js --- */
/**
 * DevBench - Conversion & Generation Tools Engine
 * Timestamp Converter, Color Converter & Palette Inspector, and Lorem / Mock Data Generator.
 */

// --- 1. Timestamp Converter ---
function convertTimestamp(input) {
  let date;
  if (!input || input.trim() === 'now') {
    date = new Date();
  } else {
    const trimmed = input.trim();
    if (/^\d+$/.test(trimmed)) {
      // numeric unix timestamp
      const num = parseInt(trimmed, 10);
      // if < 10000000000, treat as seconds, else millis
      date = num < 10000000000 ? new Date(num * 1000) : new Date(num);
    } else {
      date = new Date(trimmed);
    }
  }

  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date or timestamp value' };
  }

  const unixSeconds = Math.floor(date.getTime() / 1000);
  const unixMillis = date.getTime();
  const iso = date.toISOString();
  const utc = date.toUTCString();
  const local = date.toString();
  const relative = getRelativeTimeString(date);

  return {
    isValid: true,
    unixSeconds,
    unixMillis,
    iso,
    utc,
    local,
    relative,
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds()
  };
}

function getRelativeTimeString(date) {
  const diffSec = Math.round((date.getTime() - Date.now()) / 1000);
  const isPast = diffSec < 0;
  const abs = Math.abs(diffSec);

  if (abs < 60) return isPast ? `${abs} seconds ago` : `in ${abs} seconds`;
  if (abs < 3600) return isPast ? `${Math.floor(abs / 60)} minutes ago` : `in ${Math.floor(abs / 60)} minutes`;
  if (abs < 86400) return isPast ? `${Math.floor(abs / 3600)} hours ago` : `in ${Math.floor(abs / 3600)} hours`;
  return isPast ? `${Math.floor(abs / 86400)} days ago` : `in ${Math.floor(abs / 86400)} days`;
}

// --- 2. Color Converter & Palette Inspector ---
function parseAndConvertColor(colorStr) {
  let hex = '#3b82f6';
  let r = 59, g = 130, b = 246, a = 1;

  if (colorStr.startsWith('#')) {
    let clean = colorStr.slice(1);
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    }
    if (clean.length === 6) {
      r = parseInt(clean.slice(0, 2), 16) || 0;
      g = parseInt(clean.slice(2, 4), 16) || 0;
      b = parseInt(clean.slice(4, 6), 16) || 0;
    }
    hex = '#' + clean.slice(0, 6);
  } else if (colorStr.startsWith('rgb')) {
    const match = colorStr.match(/\d+(\.\d+)?/g);
    if (match && match.length >= 3) {
      r = Math.min(255, parseInt(match[0], 10));
      g = Math.min(255, parseInt(match[1], 10));
      b = Math.min(255, parseInt(match[2], 10));
      if (match[3]) a = parseFloat(match[3]);
      hex = rgbToHex(r, g, b);
    }
  } else if (colorStr.startsWith('hsl')) {
    const match = colorStr.match(/\d+(\.\d+)?/g);
    if (match && match.length >= 3) {
      const rgb = hslToRgb(parseFloat(match[0]), parseFloat(match[1]), parseFloat(match[2]));
      r = rgb.r; g = rgb.g; b = rgb.b;
      hex = rgbToHex(r, g, b);
    }
  }

  const hsl = rgbToHsl(r, g, b);
  const hsv = rgbToHsv(r, g, b);
  const cmyk = rgbToCmyk(r, g, b);

  // Contrast calculation (relative luminance)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const contrastWhite = Number(((1 + 0.05) / (lum + 0.05)).toFixed(2));
  const contrastBlack = Number(((lum + 0.05) / (0 + 0.05)).toFixed(2));

  // Harmonies / Palettes
  const complementary = hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l);
  const analogous1 = hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l);
  const analogous2 = hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l);
  const triadic1 = hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l);
  const triadic2 = hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l);

  return {
    hex: hex.toUpperCase(),
    rgb: `rgb(${r}, ${g}, ${b})`,
    rgba: `rgba(${r}, ${g}, ${b}, ${a})`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
    cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
    contrastWhite,
    contrastBlack,
    wcagWhiteAA: contrastWhite >= 4.5,
    wcagWhiteAAA: contrastWhite >= 7,
    wcagBlackAA: contrastBlack >= 4.5,
    wcagBlackAAA: contrastBlack >= 7,
    palette: {
      complementary,
      analogous: [analogous1, analogous2],
      triadic: [triadic1, triadic2]
    }
  };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function hslToHex(h, s, l) {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b).toUpperCase();
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function rgbToCmyk(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
}

// --- 3. Lorem & Mock Data Generator ---
const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'curabitur',
  'vel', 'hendrerit', 'libero', 'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut',
  'orci', 'gravida', 'imperdiet', 'nullam', 'purus', 'lacinia', 'a', 'pretium', 'quis',
  'congue', 'praesent', 'sagittis', 'laoreet', 'auctor', 'mauris', 'non', 'velit', 'eros',
  'dictum', 'proin', 'accumsan', 'sapien', 'nec', 'massa', 'volutpat', 'venenatis', 'sed',
  'egestas', 'dui', 'id', 'ornare', 'arcu', 'faucibus', 'eu', 'turpis', 'porttitor'
];

function generateLorem(type = 'paragraphs', count = 3) {
  const safeCount = Math.max(1, Math.min(100, count));

  if (type === 'words') {
    const words = [];
    for (let i = 0; i < safeCount; i++) {
      words.push(LOREM_WORDS[i % LOREM_WORDS.length]);
    }
    return words.join(' ');
  }

  if (type === 'sentences') {
    const sentences = [];
    for (let i = 0; i < safeCount; i++) {
      const len = 8 + Math.floor(Math.random() * 8);
      const sWords = [];
      for (let j = 0; j < len; j++) {
        sWords.push(LOREM_WORDS[(i * len + j) % LOREM_WORDS.length]);
      }
      const s = sWords.join(' ');
      sentences.push(s.charAt(0).toUpperCase() + s.slice(1) + '.');
    }
    return sentences.join(' ');
  }

  // Paragraphs
  const paragraphs = [];
  for (let p = 0; p < safeCount; p++) {
    const numSentences = 4 + Math.floor(Math.random() * 3);
    const pSentences = [];
    for (let s = 0; s < numSentences; s++) {
      const len = 7 + Math.floor(Math.random() * 7);
      const words = [];
      for (let w = 0; w < len; w++) {
        words.push(LOREM_WORDS[(p * 20 + s * 8 + w) % LOREM_WORDS.length]);
      }
      const sent = words.join(' ');
      pSentences.push(sent.charAt(0).toUpperCase() + sent.slice(1) + '.');
    }
    paragraphs.push(pSentences.join(' '));
  }

  return paragraphs.join('\n\n');
}

function generateMockUsers(count = 5) {
  const firstNames = ['Alex', 'Sarah', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Sam', 'Riley', 'Jamie', 'Logan'];
  const lastNames = ['Vance', 'Chen', 'Miller', 'Novak', 'Dubois', 'Kowalski', 'Tanaka', 'Patel', 'Smith', 'Wright'];
  const roles = ['Frontend Engineer', 'Backend Architect', 'DevOps Specialist', 'Product Manager', 'Security Analyst'];
  const cities = ['San Francisco', 'Berlin', 'Tokyo', 'London', 'Toronto', 'Sydney', 'Stockholm', 'Austin'];

  const users = [];
  for (let i = 0; i < count; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    users.push({
      id: 'usr_' + (1000 + i),
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`,
      role: roles[i % roles.length],
      location: cities[i % cities.length],
      isActive: i % 4 !== 0,
      createdAt: new Date(Date.now() - i * 86400000 * 12).toISOString()
    });
  }
  return JSON.stringify(users, null, 2);
}


/* --- MODULE: js/tool-registry.js --- */
/**
 * DevBench - Tool Registry & UI View Renderer
 * Defines metadata, options, sample payloads, and interactive UI for all 20 developer utilities.
 */




// Import tool algorithms







const TOOL_CATEGORIES = {
  JSON_DATA: 'JSON & Data',
  ENCODING_SEC: 'Encoding & Security',
  TEXT_CODE: 'Text & Code',
  NETWORK_API: 'Network & API',
  CONVERTERS: 'Converters & Generation'
};

const TOOLS = [
  // 1. JSON Formatter
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    category: TOOL_CATEGORIES.JSON_DATA,
    icon: 'json',
    desc: 'Format, indent, sort keys, remove nulls, and minify JSON payloads',
    sample: '{"name":"DevBench","version":1.0,"features":["offline","zero-backend","fast"],"settings":{"theme":"dark","autoSave":true,"nullField":null}}',
    render: renderJSONFormatter
  },
  // 2. JSON Validator
  {
    id: 'json-validator',
    title: 'JSON Validator',
    category: TOOL_CATEGORIES.JSON_DATA,
    icon: 'json',
    desc: 'Syntax validation with exact line/column indicators and error pointers',
    sample: '{\n  "service": "auth-api",\n  "port": 8080,\n  "endpoints": ["/login", "/signup",]\n}',
    render: renderJSONValidator
  },
  // 3. JSON Tree Viewer
  {
    id: 'json-tree',
    title: 'JSON Tree Viewer',
    category: TOOL_CATEGORIES.JSON_DATA,
    icon: 'tree',
    desc: 'Interactive collapsible AST tree with type chips, node search, and path copy',
    sample: '{"user":{"id":101,"profile":{"name":"Alex Vance","roles":["admin","developer"],"details":{"department":"Engineering","active":true,"tags":["core","security"]}},"logins":42}}',
    render: renderJSONTreeViewer
  },
  // 4. Base64 Encoder/Decoder
  {
    id: 'base64',
    title: 'Base64 Encode/Decode',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'base64',
    desc: 'UTF-8 safe Base64 encoder, decoder, URL-safe mode, and file data URLs',
    sample: 'Welcome to DevBench! High-performance browser workstation ⚡',
    render: renderBase64
  },
  // 5. URL Encoder/Decoder
  {
    id: 'url-encode',
    title: 'URL Encode/Decode',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'url',
    desc: 'Encode and decode query strings, form data, and URI components',
    sample: 'https://api.devbench.local/v1/search?query=developer tools&filter=active&sort=desc',
    render: renderURLEncode
  },
  // 6. JWT Decoder
  {
    id: 'jwt-decoder',
    title: 'JWT Decoder',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'jwt',
    desc: 'Decode JSON Web Token header, payload claims, and expiration timestamps',
    sample: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggVmFuY2UiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjQ4MDAwMDAsImV4cCI6MTc4Nzg3MjAwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    render: renderJWTDecoder
  },
  // 7. UUID / ID Generator
  {
    id: 'uuid-gen',
    title: 'UUID / ID Generator',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'uuid',
    desc: 'Generate UUID v4, v7 draft, ULID, and bulk identifier lists',
    sample: '',
    render: renderUUIDGenerator
  },
  // 8. Timestamp Converter
  {
    id: 'timestamp-converter',
    title: 'Timestamp Converter',
    category: TOOL_CATEGORIES.CONVERTERS,
    icon: 'timestamp',
    desc: 'Convert Unix epoch seconds, milliseconds, ISO 8601, and local DateTime',
    sample: 'now',
    render: renderTimestampConverter
  },
  // 9. Regex Tester
  {
    id: 'regex-tester',
    title: 'Regex Tester',
    category: TOOL_CATEGORIES.TEXT_CODE,
    icon: 'regex',
    desc: 'Test regular expressions with real-time match highlights, capture groups, and replace preview',
    sample: 'Contact us at support@devbench.app or sales@company.org. Order #12345 confirmed.',
    render: renderRegexTester
  },
  // 10. Text Diff Viewer
  {
    id: 'text-diff',
    title: 'Text Diff Viewer',
    category: TOOL_CATEGORIES.TEXT_CODE,
    icon: 'diff',
    desc: 'Line-by-line and unified comparison highlighting additions and deletions',
    sample: 'function calculateTotal(items) {\n  let sum = 0;\n  for (let i = 0; i < items.length; i++) {\n    sum += items[i].price;\n  }\n  return sum;\n}',
    sampleModified: 'function calculateTotal(items) {\n  if (!items || items.length === 0) return 0;\n  return items.reduce((sum, item) => sum + item.price, 0);\n}',
    render: renderTextDiff
  },
  // 11. Hash Generator
  {
    id: 'hash-gen',
    title: 'Hash Generator',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'hash',
    desc: 'Web Crypto SHA-256, SHA-384, SHA-512, SHA-1, MD5, CRC32, and HMAC checksums',
    sample: 'DevBench Cryptographic Checksum Payload 2026',
    render: renderHashGenerator
  },
  // 12. Color Converter & Palette
  {
    id: 'color-converter',
    title: 'Color & Contrast Inspector',
    category: TOOL_CATEGORIES.CONVERTERS,
    icon: 'color',
    desc: 'Convert HEX, RGB, HSL, HSV, CMYK and check WCAG contrast compliance',
    sample: '#3B82F6',
    render: renderColorConverter
  },
  // 13. HTML Entity Encoder
  {
    id: 'html-entities',
    title: 'HTML Entity Encoder',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'html',
    desc: 'Encode and decode named (&amp;), decimal, and hex HTML entities',
    sample: '<div class="alert alert-info">Hello "DevBench" & Welcome <script>alert(1)</script>!</div>',
    render: renderHTMLEntities
  },
  // 14. URL Parser
  {
    id: 'url-parser',
    title: 'URL & Query Parser',
    category: TOOL_CATEGORIES.NETWORK_API,
    icon: 'url',
    desc: 'Inspect protocol, host, port, and live two-way query parameters table',
    sample: 'https://api.github.com:443/repos/devbench/core/pulls?state=open&sort=created&direction=desc&page=1',
    render: renderURLParser
  },
  // 15. HTTP Request Builder & Simulator
  {
    id: 'http-builder',
    title: 'HTTP Request Builder',
    category: TOOL_CATEGORIES.NETWORK_API,
    icon: 'http',
    desc: 'Construct API requests with custom headers/body, live fetch, simulated offline mock, and cURL export',
    sample: 'https://jsonplaceholder.typicode.com/posts/1',
    render: renderHTTPBuilder
  },
  // 16. Lorem / Mock Data Generator
  {
    id: 'mock-generator',
    title: 'Lorem & Mock Generator',
    category: TOOL_CATEGORIES.CONVERTERS,
    icon: 'lorem',
    desc: 'Generate Lorem Ipsum copy and structured mock JSON user & product profiles',
    sample: '',
    render: renderMockGenerator
  },
  // 17. Case Converter
  {
    id: 'case-converter',
    title: 'Case Converter',
    category: TOOL_CATEGORIES.TEXT_CODE,
    icon: 'case',
    desc: 'Convert between camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and Title Case',
    sample: 'user_authentication_service_v2',
    render: renderCaseConverter
  },
  // 18. Line Sorter
  {
    id: 'line-sorter',
    title: 'Line Sorter',
    category: TOOL_CATEGORIES.TEXT_CODE,
    icon: 'sort',
    desc: 'Sort text lines alphabetically (A-Z, Z-A), natural numbers, length, or shuffle',
    sample: 'banana\nApple\n100 items\n20 items\nOrange\nCherry\n2 items',
    render: renderLineSorter
  },
  // 19. Duplicate Line Remover
  {
    id: 'duplicate-remover',
    title: 'Duplicate Line Remover',
    category: TOOL_CATEGORIES.TEXT_CODE,
    icon: 'dedup',
    desc: 'Deduplicate lines with case-sensitive toggle, whitespace trimming, and duplicate counts',
    sample: 'alpha\nbeta\ngamma\nalpha\ndelta\nbeta\nepsilon\nalpha',
    render: renderDuplicateRemover
  },
  // 20. Whitespace Cleaner
  {
    id: 'whitespace-cleaner',
    title: 'Whitespace Cleaner',
    category: TOOL_CATEGORIES.TEXT_CODE,
    icon: 'clean',
    desc: 'Trim trailing spaces, collapse multiple spaces, tab-to-space, and normalize line endings',
    sample: '   Line with leading & trailing spaces    \n\n\n   Multiple    spaces    between    words   \n\tTabbed line 1\n\tTabbed line 2\n\n',
    render: renderWhitespaceCleaner
  }
];

function getToolById(id) {
  return TOOLS.find(t => t.id === id) || TOOLS[0];
}

// --- Common UI Shell Helper ---
function createSplitToolShell({ tool, toolbarHTML = '', showSampleBtn = true, sampleAction = null }) {
  return `
    <div class="tool-workspace" data-tool-id="${tool.id}">
      <!-- Tool Header Bar -->
      <div class="tool-header">
        <div class="tool-title-group">
          <div class="tool-icon-box">${getIcon(tool.icon, 'icon-md')}</div>
          <div>
            <h1 class="tool-title">${tool.title}</h1>
            <p class="tool-desc">${tool.desc}</p>
          </div>
        </div>
        <div class="tool-header-actions">
          <button class="btn btn-sm btn-ghost btn-fav-toggle" data-id="${tool.id}" title="Toggle Favorite">
            ${getIcon('star', 'icon-sm')}
          </button>
          <button class="btn btn-sm btn-ghost btn-open-history" data-id="${tool.id}" title="Input History">
            ${getIcon('history', 'icon-sm')} History
          </button>
          <button class="btn btn-sm btn-ghost btn-save-snippet" data-id="${tool.id}" title="Save Snippet">
            ${getIcon('bookmark', 'icon-sm')} Save Snippet
          </button>
          ${showSampleBtn ? `
            <button class="btn btn-sm btn-secondary btn-load-sample" title="Load Sample Payload">
              ${getIcon('sparkles', 'icon-xs')} Sample
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Tool Options / Action Bar -->
      ${toolbarHTML ? `<div class="tool-options-bar">${toolbarHTML}</div>` : ''}

      <!-- Main Split Work Area (Injected by specific tool) -->
      <div class="tool-main-area" id="tool-main-content"></div>

      <!-- Live Status Bar -->
      <div class="tool-status-bar">
        <div class="status-item font-mono text-xs" id="status-lines-chars">Lines: 0 &bull; Chars: 0 &bull; Bytes: 0 B</div>
        <div class="status-item font-mono text-xs" id="status-timing">Ready</div>
      </div>
    </div>
  `;
}

function updateStatusBar(container, text, execTimeMs = null) {
  const lines = text ? text.split('\n').length : 0;
  const chars = text ? text.length : 0;
  const bytes = text ? new Blob([text]).size : 0;

  const lcEl = container.querySelector('#status-lines-chars');
  if (lcEl) {
    lcEl.innerHTML = `Lines: <strong>${lines}</strong> &bull; Chars: <strong>${chars}</strong> &bull; Size: <strong>${formatBytes(bytes)}</strong>`;
  }

  const timingEl = container.querySelector('#status-timing');
  if (timingEl && execTimeMs !== null) {
    timingEl.textContent = `Executed in ${execTimeMs}ms`;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function attachStandardToolbarEvents(container, tool, onSampleLoad = null) {
  // Favorite toggle
  const favBtn = container.querySelector('.btn-fav-toggle');
  favBtn?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('TOGGLE_FAVORITE', { detail: { toolId: tool.id } }));
  });

  // History trigger
  container.querySelector('.btn-open-history')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('OPEN_HISTORY_DRAWER', { detail: { toolId: tool.id } }));
  });

  // Save Snippet trigger
  container.querySelector('.btn-save-snippet')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('OPEN_SAVE_SNIPPET_MODAL', { detail: { toolId: tool.id } }));
  });

  // Sample load
  if (onSampleLoad) {
    container.querySelector('.btn-load-sample')?.addEventListener('click', onSampleLoad);
  }
}

function copyToClipboard(text, btnElement) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    if (btnElement) {
      const originalHTML = btnElement.innerHTML;
      btnElement.innerHTML = `${getIcon('check', 'icon-xs')} Copied!`;
      btnElement.classList.add('btn-success-flash');
      setTimeout(() => {
        btnElement.innerHTML = originalHTML;
        btnElement.classList.remove('btn-success-flash');
      }, 1800);
    }
  });
}

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ==========================================
// 1. JSON FORMATTER
// ==========================================
function renderJSONFormatter(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group">
        <label class="opt-label text-xs">Indentation:</label>
        <select id="json-opt-indent" class="form-control form-control-sm">
          <option value="2">2 Spaces</option>
          <option value="4">4 Spaces</option>
          <option value="tab">Tabs</option>
          <option value="0">Minify (0)</option>
        </select>
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="json-opt-sort" /> Sort Keys
        </label>
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="json-opt-nulls" /> Remove Nulls
        </label>
      </div>
      <div class="actions-group">
        <button class="btn btn-sm btn-primary" id="btn-format-json">${getIcon('play', 'icon-xs')} Format</button>
        <button class="btn btn-sm btn-secondary" id="btn-copy-json">${getIcon('copy', 'icon-xs')} Copy</button>
        <button class="btn btn-sm btn-secondary" id="btn-download-json">${getIcon('download', 'icon-xs')} Download</button>
        <button class="btn btn-sm btn-ghost" id="btn-clear-json">${getIcon('trash', 'icon-xs')} Clear</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="split-pane-layout">
      <div class="pane-column">
        <div class="pane-header">
          <span class="pane-title text-xs font-semibold">JSON Input</span>
          <button class="btn-icon-xs" id="btn-paste-json" title="Paste from clipboard">${getIcon('upload', 'icon-xs')}</button>
        </div>
        <textarea id="json-input" class="code-editor font-mono" placeholder="Paste unformatted JSON here..." spellcheck="false"></textarea>
      </div>
      <div class="pane-column">
        <div class="pane-header">
          <span class="pane-title text-xs font-semibold">Formatted Output</span>
        </div>
        <div id="json-error-banner" class="editor-error-banner" style="display: none;"></div>
        <textarea id="json-output" class="code-editor font-mono" readonly placeholder="Formatted output will appear here..." spellcheck="false"></textarea>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#json-input');
  const outputEl = container.querySelector('#json-output');
  const errorEl = container.querySelector('#json-error-banner');
  const indentEl = container.querySelector('#json-opt-indent');
  const sortEl = container.querySelector('#json-opt-sort');
  const nullsEl = container.querySelector('#json-opt-nulls');

  function runFormat() {
    const start = performance.now();
    const result = formatJSON(inputEl.value, {
      indent: indentEl.value,
      sortKeys: sortEl.checked,
      removeNulls: nullsEl.checked
    });
    const duration = Math.round(performance.now() - start);

    if (result.success) {
      errorEl.style.display = 'none';
      outputEl.value = result.output;
      updateStatusBar(container, result.output, duration);
      addToolHistory(tool.id, inputEl.value);
    } else {
      errorEl.style.display = 'block';
      errorEl.innerHTML = `${getIcon('alert', 'icon-xs')} <strong>Syntax Error:</strong> ${result.error}${result.errorPos?.line ? ` (Line ${result.errorPos.line}, Col ${result.errorPos.column})` : ''}`;
      outputEl.value = '';
    }
  }

  // Event bindings
  container.querySelector('#btn-format-json').addEventListener('click', runFormat);
  inputEl.addEventListener('input', () => { updateStatusBar(container, inputEl.value); runFormat(); });
  indentEl.addEventListener('change', runFormat);
  sortEl.addEventListener('change', runFormat);
  nullsEl.addEventListener('change', runFormat);

  container.querySelector('#btn-copy-json').addEventListener('click', (e) => copyToClipboard(outputEl.value, e.currentTarget));
  container.querySelector('#btn-download-json').addEventListener('click', () => downloadTextFile('formatted.json', outputEl.value));
  container.querySelector('#btn-clear-json').addEventListener('click', () => { inputEl.value = ''; outputEl.value = ''; errorEl.style.display = 'none'; updateStatusBar(container, ''); });
  container.querySelector('#btn-paste-json').addEventListener('click', async () => {
    try { inputEl.value = await navigator.clipboard.readText(); runFormat(); } catch(e){}
  });

  attachStandardToolbarEvents(container, tool, () => {
    inputEl.value = tool.sample;
    runFormat();
  });

  inputEl.value = tool.sample;
  runFormat();
}

// ==========================================
// 2. JSON VALIDATOR
// ==========================================
function renderJSONValidator(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="actions-group">
        <button class="btn btn-sm btn-primary" id="btn-validate-json">${getIcon('check', 'icon-xs')} Validate Now</button>
        <button class="btn btn-sm btn-ghost" id="btn-clear-val">${getIcon('trash', 'icon-xs')} Clear</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="validator-layout">
      <div id="validator-status-card" class="card p-4 mb-4">
        <div class="text-muted text-sm">Enter JSON below to perform syntax inspection.</div>
      </div>
      <div class="form-group mb-0 flex-1 flex flex-col">
        <textarea id="val-input" class="code-editor font-mono flex-1 min-h-80" placeholder="Paste JSON here to validate..." spellcheck="false"></textarea>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#val-input');
  const statusEl = container.querySelector('#validator-status-card');

  function runValidation() {
    const val = validateJSON(inputEl.value);
    if (!inputEl.value.trim()) {
      statusEl.className = 'card p-4 mb-4';
      statusEl.innerHTML = `<div class="text-muted text-sm">Enter JSON above to perform syntax inspection.</div>`;
      return;
    }

    if (val.isValid) {
      statusEl.className = 'card p-4 mb-4 border-success bg-success-subtle';
      statusEl.innerHTML = `
        <div class="flex items-center gap-2 text-emerald font-semibold">
          ${getIcon('check', 'icon-sm')} Valid JSON Document
        </div>
        <div class="text-xs text-secondary mt-1">${val.message} &bull; Size: ${formatBytes(val.size)}</div>
      `;
    } else {
      statusEl.className = 'card p-4 mb-4 border-danger bg-danger-subtle';
      statusEl.innerHTML = `
        <div class="flex items-center gap-2 text-rose font-semibold">
          ${getIcon('alert', 'icon-sm')} Invalid JSON Syntax
        </div>
        <div class="text-xs text-primary font-mono mt-1">${val.message}</div>
        ${val.line ? `<div class="text-xs text-rose font-mono mt-1">Error detected at Line ${val.line}, Column ${val.column}</div>` : ''}
        ${val.snippet ? `<pre class="error-code-snippet font-mono text-xs mt-2">${escapeHTML(val.snippet)}</pre>` : ''}
      `;
    }
    updateStatusBar(container, inputEl.value);
    addToolHistory(tool.id, inputEl.value);
  }

  container.querySelector('#btn-validate-json').addEventListener('click', runValidation);
  inputEl.addEventListener('input', runValidation);
  container.querySelector('#btn-clear-val').addEventListener('click', () => { inputEl.value = ''; runValidation(); });

  attachStandardToolbarEvents(container, tool, () => {
    inputEl.value = tool.sample;
    runValidation();
  });

  inputEl.value = tool.sample;
  runValidation();
}

// ==========================================
// 3. JSON TREE VIEWER
// ==========================================
function renderJSONTreeViewer(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group flex-1">
        <input type="text" id="tree-search" class="form-control form-control-sm" placeholder="Filter keys or values in tree..." />
      </div>
      <div class="actions-group">
        <button class="btn btn-sm btn-secondary" id="btn-expand-all">Expand All</button>
        <button class="btn btn-sm btn-secondary" id="btn-collapse-all">Collapse All</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="split-pane-layout">
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Raw JSON</span></div>
        <textarea id="tree-raw-input" class="code-editor font-mono" placeholder="Paste JSON here..." spellcheck="false"></textarea>
      </div>
      <div class="pane-column">
        <div class="pane-header">
          <span class="pane-title text-xs font-semibold">Interactive AST Tree</span>
          <span class="text-xs text-muted">Click keys to copy path</span>
        </div>
        <div id="tree-view-render" class="tree-container font-mono text-sm"></div>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#tree-raw-input');
  const treeEl = container.querySelector('#tree-view-render');
  const searchEl = container.querySelector('#tree-search');

  function renderTree() {
    if (!inputEl.value.trim()) {
      treeEl.innerHTML = '<div class="text-muted p-4">Enter valid JSON on the left to render tree.</div>';
      return;
    }
    try {
      const parsed = JSON.parse(inputEl.value);
      treeEl.innerHTML = buildJSONTreeHTML(parsed, searchEl.value.trim());

      // Toggle collapsible nodes
      treeEl.querySelectorAll('.tree-toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const node = btn.closest('.tree-collapsible');
          node.classList.toggle('open');
        });
      });

      // Path copier
      treeEl.querySelectorAll('.tree-key').forEach(keyEl => {
        keyEl.addEventListener('click', () => {
          const path = keyEl.dataset.path;
          copyToClipboard(path, null);
          const orig = keyEl.innerHTML;
          keyEl.innerHTML = `<span class="badge badge-success text-xs">Copied Path!</span>`;
          setTimeout(() => keyEl.innerHTML = orig, 1200);
        });
      });

      updateStatusBar(container, inputEl.value);
      addToolHistory(tool.id, inputEl.value);
    } catch (err) {
      treeEl.innerHTML = `<div class="p-4 text-rose">${getIcon('alert', 'icon-xs')} Invalid JSON: ${err.message}</div>`;
    }
  }

  inputEl.addEventListener('input', renderTree);
  searchEl.addEventListener('input', renderTree);

  container.querySelector('#btn-expand-all').addEventListener('click', () => {
    treeEl.querySelectorAll('.tree-collapsible').forEach(n => n.classList.add('open'));
  });
  container.querySelector('#btn-collapse-all').addEventListener('click', () => {
    treeEl.querySelectorAll('.tree-collapsible').forEach(n => n.classList.remove('open'));
  });

  attachStandardToolbarEvents(container, tool, () => {
    inputEl.value = tool.sample;
    renderTree();
  });

  inputEl.value = tool.sample;
  renderTree();
}

// ==========================================
// 4. BASE64 ENCODER / DECODER
// ==========================================
function renderBase64(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group">
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="b64-opt-urlsafe" /> URL-Safe Mode (- and _)
        </label>
      </div>
      <div class="actions-group">
        <button class="btn btn-sm btn-primary" id="btn-b64-encode">${getIcon('play', 'icon-xs')} Encode &rarr;</button>
        <button class="btn btn-sm btn-secondary" id="btn-b64-decode">&larr; Decode</button>
        <button class="btn btn-sm btn-secondary" id="btn-b64-swap">${getIcon('swap', 'icon-xs')} Swap</button>
        <button class="btn btn-sm btn-secondary" id="btn-b64-copy">${getIcon('copy', 'icon-xs')} Copy</button>
        <button class="btn btn-sm btn-ghost" id="btn-b64-clear">${getIcon('trash', 'icon-xs')} Clear</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="split-pane-layout">
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Plaintext / Decoded</span></div>
        <textarea id="b64-text-input" class="code-editor font-mono" placeholder="Type or paste text to encode..." spellcheck="false"></textarea>
      </div>
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Base64 Encoded Output</span></div>
        <textarea id="b64-encoded-output" class="code-editor font-mono" placeholder="Base64 encoded string..." spellcheck="false"></textarea>
      </div>
    </div>
  `;

  const textInput = container.querySelector('#b64-text-input');
  const b64Output = container.querySelector('#b64-encoded-output');
  const urlSafeChk = container.querySelector('#b64-opt-urlsafe');

  function doEncode() {
    try {
      b64Output.value = encodeBase64(textInput.value, urlSafeChk.checked);
      updateStatusBar(container, b64Output.value);
      addToolHistory(tool.id, textInput.value);
    } catch (e) {
      b64Output.value = e.message;
    }
  }

  function doDecode() {
    try {
      textInput.value = decodeBase64(b64Output.value);
      updateStatusBar(container, textInput.value);
      addToolHistory(tool.id, b64Output.value);
    } catch (e) {
      textInput.value = e.message;
    }
  }

  container.querySelector('#btn-b64-encode').addEventListener('click', doEncode);
  container.querySelector('#btn-b64-decode').addEventListener('click', doDecode);
  textInput.addEventListener('input', doEncode);
  urlSafeChk.addEventListener('change', doEncode);

  container.querySelector('#btn-b64-swap').addEventListener('click', () => {
    const tmp = textInput.value;
    textInput.value = b64Output.value;
    b64Output.value = tmp;
  });

  container.querySelector('#btn-b64-copy').addEventListener('click', (e) => copyToClipboard(b64Output.value, e.currentTarget));
  container.querySelector('#btn-b64-clear').addEventListener('click', () => { textInput.value = ''; b64Output.value = ''; updateStatusBar(container, ''); });

  attachStandardToolbarEvents(container, tool, () => {
    textInput.value = tool.sample;
    doEncode();
  });

  textInput.value = tool.sample;
  doEncode();
}

// ==========================================
// 5. URL ENCODER / DECODER
// ==========================================
function renderURLEncode(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group">
        <label class="opt-label text-xs">Encoding Mode:</label>
        <select id="url-opt-mode" class="form-control form-control-sm">
          <option value="component">encodeURIComponent (Standard)</option>
          <option value="uri">encodeURI (Full URL)</option>
          <option value="form">application/x-www-form-urlencoded (Space to +)</option>
        </select>
      </div>
      <div class="actions-group">
        <button class="btn btn-sm btn-primary" id="btn-url-encode">Encode &rarr;</button>
        <button class="btn btn-sm btn-secondary" id="btn-url-decode">&larr; Decode</button>
        <button class="btn btn-sm btn-secondary" id="btn-url-copy">${getIcon('copy', 'icon-xs')} Copy</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="split-pane-layout">
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Decoded / Plain String</span></div>
        <textarea id="url-plain" class="code-editor font-mono" placeholder="Type text or URL to encode..."></textarea>
      </div>
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Encoded Result</span></div>
        <textarea id="url-encoded" class="code-editor font-mono" placeholder="Encoded URL will appear here..."></textarea>
      </div>
    </div>
  `;

  const plainEl = container.querySelector('#url-plain');
  const encodedEl = container.querySelector('#url-encoded');
  const modeEl = container.querySelector('#url-opt-mode');

  function doEncode() {
    encodedEl.value = encodeURL(plainEl.value, modeEl.value);
    updateStatusBar(container, encodedEl.value);
    addToolHistory(tool.id, plainEl.value);
  }

  function doDecode() {
    try {
      plainEl.value = decodeURL(encodedEl.value, modeEl.value);
      updateStatusBar(container, plainEl.value);
      addToolHistory(tool.id, encodedEl.value);
    } catch(e) {
      plainEl.value = e.message;
    }
  }

  container.querySelector('#btn-url-encode').addEventListener('click', doEncode);
  container.querySelector('#btn-url-decode').addEventListener('click', doDecode);
  plainEl.addEventListener('input', doEncode);
  modeEl.addEventListener('change', doEncode);
  container.querySelector('#btn-url-copy').addEventListener('click', (e) => copyToClipboard(encodedEl.value, e.currentTarget));

  attachStandardToolbarEvents(container, tool, () => {
    plainEl.value = tool.sample;
    doEncode();
  });

  plainEl.value = tool.sample;
  doEncode();
}

// ==========================================
// 6. JWT DECODER
// ==========================================
function renderJWTDecoder(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="actions-group">
        <button class="btn btn-sm btn-primary" id="btn-decode-jwt">${getIcon('play', 'icon-xs')} Decode Token</button>
        <button class="btn btn-sm btn-secondary" id="btn-copy-payload">${getIcon('copy', 'icon-xs')} Copy Payload</button>
        <button class="btn btn-sm btn-ghost" id="btn-clear-jwt">${getIcon('trash', 'icon-xs')} Clear</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="jwt-layout">
      <div class="form-group mb-4">
        <label class="form-label font-semibold text-xs">Encoded JWT String *</label>
        <textarea id="jwt-input" class="code-editor font-mono min-h-24" placeholder="Paste eyJhbGci... token here"></textarea>
      </div>

      <!-- Security Warning Banner (Prompt 8C Requirement) -->
      <div class="alert alert-warning mb-4">
        <div class="alert-icon">${getIcon('alert', 'icon-md')}</div>
        <div class="alert-content">
          <div class="alert-title">Client-Side Inspection Notice</div>
          <p class="alert-desc text-xs">This tool decodes token payload headers and claims in-browser. Signatures are not cryptographically verified here; validation must be enforced on your authentication server.</p>
        </div>
      </div>

      <div class="split-pane-layout">
        <div class="pane-column">
          <div class="pane-header">
            <span class="pane-title text-xs font-semibold text-rose">Header (Algorithm & Typ)</span>
          </div>
          <pre id="jwt-header-out" class="code-editor font-mono bg-surface-elevated"></pre>
        </div>
        <div class="pane-column">
          <div class="pane-header">
            <span class="pane-title text-xs font-semibold text-emerald">Payload (Claims & Expiration)</span>
            <span id="jwt-exp-badge"></span>
          </div>
          <pre id="jwt-payload-out" class="code-editor font-mono bg-surface-elevated"></pre>
        </div>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#jwt-input');
  const headerEl = container.querySelector('#jwt-header-out');
  const payloadEl = container.querySelector('#jwt-payload-out');
  const expBadgeEl = container.querySelector('#jwt-exp-badge');

  function doDecode() {
    const res = decodeJWT(inputEl.value);
    if (res.success) {
      headerEl.textContent = res.rawHeader;
      payloadEl.textContent = res.rawPayload;

      if (res.expirationStatus) {
        expBadgeEl.innerHTML = `
          <span class="badge ${res.expirationStatus.isExpired ? 'badge-danger' : 'badge-success'} text-xs">
            ${res.expirationStatus.human}
          </span>
        `;
      } else {
        expBadgeEl.innerHTML = `<span class="badge badge-secondary text-xs">No exp claim</span>`;
      }
      updateStatusBar(container, inputEl.value);
      addToolHistory(tool.id, inputEl.value);
    } else {
      headerEl.textContent = '';
      payloadEl.textContent = res.error;
      expBadgeEl.innerHTML = '';
    }
  }

  container.querySelector('#btn-decode-jwt').addEventListener('click', doDecode);
  inputEl.addEventListener('input', doDecode);
  container.querySelector('#btn-copy-payload').addEventListener('click', (e) => copyToClipboard(payloadEl.textContent, e.currentTarget));
  container.querySelector('#btn-clear-jwt').addEventListener('click', () => { inputEl.value = ''; headerEl.textContent = ''; payloadEl.textContent = ''; expBadgeEl.innerHTML = ''; });

  attachStandardToolbarEvents(container, tool, () => {
    inputEl.value = tool.sample;
    doDecode();
  });

  inputEl.value = tool.sample;
  doDecode();
}

// ==========================================
// 7. UUID GENERATOR
// ==========================================
function renderUUIDGenerator(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    showSampleBtn: false,
    toolbarHTML: `
      <div class="options-group">
        <label class="opt-label text-xs">Format:</label>
        <select id="uuid-opt-ver" class="form-control form-control-sm">
          <option value="v4">UUID v4 (Random / Cryptographic)</option>
          <option value="v7">UUID v7 (Time-Ordered Draft)</option>
          <option value="ulid">ULID (Universally Unique Lexicographically Sortable)</option>
        </select>
        <label class="opt-label text-xs">Count:</label>
        <input type="number" id="uuid-opt-count" class="form-control form-control-sm w-20" min="1" max="1000" value="10" />
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="uuid-opt-upper" /> Uppercase
        </label>
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="uuid-opt-hyphens" checked /> Hyphens
        </label>
      </div>
      <div class="actions-group">
        <button class="btn btn-sm btn-primary" id="btn-uuid-generate">${getIcon('refresh', 'icon-xs')} Generate</button>
        <button class="btn btn-sm btn-secondary" id="btn-uuid-copy">${getIcon('copy', 'icon-xs')} Copy All</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="uuid-layout flex-1 flex flex-col">
      <textarea id="uuid-output" class="code-editor font-mono flex-1 min-h-80" readonly></textarea>
    </div>
  `;

  const outputEl = container.querySelector('#uuid-output');
  const verEl = container.querySelector('#uuid-opt-ver');
  const countEl = container.querySelector('#uuid-opt-count');
  const upperEl = container.querySelector('#uuid-opt-upper');
  const hyphensEl = container.querySelector('#uuid-opt-hyphens');

  function doGenerate() {
    const count = parseInt(countEl.value, 10) || 10;
    const text = generateBulkUUIDs(count, {
      version: verEl.value,
      uppercase: upperEl.checked,
      hyphens: hyphensEl.checked
    });
    outputEl.value = text;
    updateStatusBar(container, text);
  }

  container.querySelector('#btn-uuid-generate').addEventListener('click', doGenerate);
  verEl.addEventListener('change', doGenerate);
  countEl.addEventListener('change', doGenerate);
  upperEl.addEventListener('change', doGenerate);
  hyphensEl.addEventListener('change', doGenerate);
  container.querySelector('#btn-uuid-copy').addEventListener('click', (e) => copyToClipboard(outputEl.value, e.currentTarget));

  attachStandardToolbarEvents(container, tool, null);
  doGenerate();
}

// ==========================================
// 8. TIMESTAMP CONVERTER
// ==========================================
function renderTimestampConverter(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="actions-group">
        <button class="btn btn-sm btn-secondary" id="btn-ts-now">${getIcon('refresh', 'icon-xs')} Current Time</button>
        <button class="btn btn-sm btn-secondary" id="btn-ts-copy-iso">${getIcon('copy', 'icon-xs')} Copy ISO</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="timestamp-layout">
      <!-- Live ticker -->
      <div class="card p-4 mb-4 flex items-center justify-between">
        <div>
          <span class="text-xs text-muted uppercase font-semibold">Current Unix Epoch Timestamp</span>
          <div class="font-mono text-2xl font-bold text-emerald" id="live-epoch-ticker">0</div>
        </div>
        <button class="btn btn-sm btn-outline" id="btn-copy-live-epoch">${getIcon('copy', 'icon-xs')} Copy Epoch</button>
      </div>

      <div class="form-group mb-4">
        <label class="form-label font-semibold text-xs">Enter Epoch (Sec/Ms) or ISO String / Date</label>
        <input type="text" id="ts-input" class="form-control font-mono text-base" placeholder="e.g. 1724800000 or 2026-08-27T12:00:00Z" />
      </div>

      <div class="metrics-grid" id="ts-results-grid"></div>
    </div>
  `;

  const inputEl = container.querySelector('#ts-input');
  const resultsGrid = container.querySelector('#ts-results-grid');
  const tickerEl = container.querySelector('#live-epoch-ticker');

  // Live ticker
  const tickerInterval = setInterval(() => {
    if (document.body.contains(tickerEl)) {
      tickerEl.textContent = Math.floor(Date.now() / 1000);
    } else {
      clearInterval(tickerInterval);
    }
  }, 1000);

  function doConvert() {
    const res = convertTimestamp(inputEl.value);
    if (res.isValid) {
      resultsGrid.innerHTML = `
        <div class="metric-card">
          <span class="metric-label">Unix Seconds</span>
          <div class="metric-value font-mono text-primary">${res.unixSeconds}</div>
          <button class="btn btn-xs btn-ghost btn-copy-field" data-val="${res.unixSeconds}">Copy</button>
        </div>
        <div class="metric-card">
          <span class="metric-label">Unix Milliseconds</span>
          <div class="metric-value font-mono text-primary">${res.unixMillis}</div>
          <button class="btn btn-xs btn-ghost btn-copy-field" data-val="${res.unixMillis}">Copy</button>
        </div>
        <div class="metric-card col-span-full">
          <span class="metric-label">ISO 8601 (UTC)</span>
          <div class="metric-value font-mono text-emerald text-base">${res.iso}</div>
          <button class="btn btn-xs btn-ghost btn-copy-field" data-val="${res.iso}">Copy</button>
        </div>
        <div class="metric-card col-span-full">
          <span class="metric-label">Local Date & Time</span>
          <div class="metric-value text-base text-primary">${res.local}</div>
          <div class="metric-meta"><span>Relative: <strong>${res.relative}</strong></span></div>
        </div>
      `;

      resultsGrid.querySelectorAll('.btn-copy-field').forEach(b => {
        b.addEventListener('click', () => copyToClipboard(b.dataset.val, b));
      });
      addToolHistory(tool.id, inputEl.value);
    } else {
      resultsGrid.innerHTML = `<div class="p-4 text-rose">${res.error}</div>`;
    }
  }

  inputEl.addEventListener('input', doConvert);
  container.querySelector('#btn-ts-now').addEventListener('click', () => { inputEl.value = 'now'; doConvert(); });
  container.querySelector('#btn-copy-live-epoch').addEventListener('click', (e) => copyToClipboard(tickerEl.textContent, e.currentTarget));
  container.querySelector('#btn-ts-copy-iso').addEventListener('click', (e) => {
    const res = convertTimestamp(inputEl.value);
    if (res.isValid) copyToClipboard(res.iso, e.currentTarget);
  });

  attachStandardToolbarEvents(container, tool, () => {
    inputEl.value = 'now';
    doConvert();
  });

  inputEl.value = 'now';
  doConvert();
}

// ==========================================
// 9. REGEX TESTER
// ==========================================
function renderRegexTester(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group flex-1">
        <span class="font-mono font-bold text-muted">/</span>
        <input type="text" id="regex-pattern" class="form-control form-control-sm font-mono flex-1" placeholder="Regular expression pattern (e.g. [a-zA-Z0-9]+)" value="([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+)" />
        <span class="font-mono font-bold text-muted">/</span>
        <input type="text" id="regex-flags" class="form-control form-control-sm font-mono w-16" placeholder="flags" value="g" />
      </div>
      <div class="actions-group">
        <span class="badge badge-primary font-mono text-xs" id="regex-match-counter">0 matches</span>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="regex-main-layout">
      <div class="split-pane-layout mb-4">
        <div class="pane-column">
          <div class="pane-header"><span class="pane-title text-xs font-semibold">Test String</span></div>
          <textarea id="regex-test-text" class="code-editor font-mono" placeholder="Enter text to match against..."></textarea>
        </div>
        <div class="pane-column">
          <div class="pane-header"><span class="pane-title text-xs font-semibold">Match Highlight Preview</span></div>
          <div id="regex-highlight-box" class="code-editor font-mono bg-surface-elevated overflow-y-auto"></div>
        </div>
      </div>

      <div class="card p-4">
        <div class="card-header p-0 pb-3 mb-3">
          <h3 class="card-title text-xs">Capture Groups & Match Index Table</h3>
        </div>
        <div id="regex-matches-table" class="table-responsive max-h-48"></div>
      </div>
    </div>
  `;

  const patternEl = container.querySelector('#regex-pattern');
  const flagsEl = container.querySelector('#regex-flags');
  const testTextEl = container.querySelector('#regex-test-text');
  const highlightEl = container.querySelector('#regex-highlight-box');
  const counterEl = container.querySelector('#regex-match-counter');
  const tableEl = container.querySelector('#regex-matches-table');

  function doTest() {
    const res = testRegex(patternEl.value, flagsEl.value, testTextEl.value);
    if (res.isValid) {
      counterEl.textContent = `${res.matchCount} ${res.matchCount === 1 ? 'match' : 'matches'}`;
      highlightEl.innerHTML = res.highlightedHTML;

      if (res.matches.length > 0) {
        tableEl.innerHTML = `
          <table class="table finance-table text-xs">
            <thead>
              <tr>
                <th>#</th>
                <th>Match</th>
                <th>Index</th>
                <th>Groups</th>
              </tr>
            </thead>
            <tbody>
              ${res.matches.map((m, idx) => `
                <tr>
                  <td class="font-mono text-muted">${idx + 1}</td>
                  <td class="font-mono font-bold text-primary">${escapeHTML(m.value)}</td>
                  <td class="font-mono text-muted">${m.index}&ndash;${m.index + m.length}</td>
                  <td class="font-mono">${m.groups.length > 0 ? m.groups.map(g => `<span class="badge badge-secondary">${escapeHTML(g)}</span>`).join(' ') : '<span class="text-muted">none</span>'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      } else {
        tableEl.innerHTML = `<div class="text-muted text-xs p-2">No matches found.</div>`;
      }
      updateStatusBar(container, testTextEl.value);
      addToolHistory(tool.id, patternEl.value);
    } else {
      counterEl.textContent = 'Error';
      highlightEl.innerHTML = `<div class="text-rose text-xs p-2">Invalid RegExp: ${escapeHTML(res.error)}</div>`;
      tableEl.innerHTML = '';
    }
  }

  patternEl.addEventListener('input', doTest);
  flagsEl.addEventListener('input', doTest);
  testTextEl.addEventListener('input', doTest);

  attachStandardToolbarEvents(container, tool, () => {
    testTextEl.value = tool.sample;
    patternEl.value = '([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+)';
    flagsEl.value = 'g';
    doTest();
  });

  testTextEl.value = tool.sample;
  doTest();
}

// ==========================================
// 10. TEXT DIFF VIEWER
// ==========================================
function renderTextDiff(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group">
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="diff-opt-whitespace" /> Ignore Whitespace
        </label>
      </div>
      <div class="actions-group">
        <button class="btn btn-sm btn-primary" id="btn-run-diff">${getIcon('diff', 'icon-xs')} Compare</button>
        <button class="btn btn-sm btn-ghost" id="btn-clear-diff">${getIcon('trash', 'icon-xs')} Clear</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="diff-main-layout">
      <div class="split-pane-layout mb-4">
        <div class="pane-column">
          <div class="pane-header"><span class="pane-title text-xs font-semibold">Original Text</span></div>
          <textarea id="diff-orig" class="code-editor font-mono" placeholder="Original code / text..."></textarea>
        </div>
        <div class="pane-column">
          <div class="pane-header"><span class="pane-title text-xs font-semibold">Modified Text</span></div>
          <textarea id="diff-mod" class="code-editor font-mono" placeholder="Modified code / text..."></textarea>
        </div>
      </div>

      <div class="card p-0">
        <div class="pane-header border-b px-4 py-2 flex items-center justify-between">
          <span class="pane-title text-xs font-semibold">Diff Result</span>
          <div id="diff-stats-badges" class="flex gap-2"></div>
        </div>
        <div id="diff-render-output" class="diff-view-container font-mono text-xs max-h-80 overflow-y-auto"></div>
      </div>
    </div>
  `;

  const origEl = container.querySelector('#diff-orig');
  const modEl = container.querySelector('#diff-mod');
  const renderEl = container.querySelector('#diff-render-output');
  const statsEl = container.querySelector('#diff-stats-badges');
  const wsChk = container.querySelector('#diff-opt-whitespace');

  function doDiff() {
    const res = computeTextDiff(origEl.value, modEl.value, { ignoreWhitespace: wsChk.checked });
    statsEl.innerHTML = `
      <span class="badge badge-success">+${res.stats.added} added</span>
      <span class="badge badge-danger">-${res.stats.removed} removed</span>
      <span class="badge badge-secondary">${res.stats.unchanged} unchanged</span>
    `;

    renderEl.innerHTML = res.diff.map(d => {
      let cls = 'diff-row-unchanged';
      let symbol = '&nbsp;';
      if (d.type === 'added') { cls = 'diff-row-added'; symbol = '+'; }
      if (d.type === 'removed') { cls = 'diff-row-removed'; symbol = '-'; }

      return `
        <div class="diff-line ${cls}">
          <span class="diff-ln">${d.lineOrig || ''}</span>
          <span class="diff-ln">${d.lineMod || ''}</span>
          <span class="diff-sign">${symbol}</span>
          <span class="diff-content">${escapeHTML(d.text)}</span>
        </div>
      `;
    }).join('');
    updateStatusBar(container, `${origEl.value}\n${modEl.value}`);
  }

  container.querySelector('#btn-run-diff').addEventListener('click', doDiff);
  origEl.addEventListener('input', doDiff);
  modEl.addEventListener('input', doDiff);
  wsChk.addEventListener('change', doDiff);
  container.querySelector('#btn-clear-diff').addEventListener('click', () => { origEl.value = ''; modEl.value = ''; doDiff(); });

  attachStandardToolbarEvents(container, tool, () => {
    origEl.value = tool.sample;
    modEl.value = tool.sampleModified || '';
    doDiff();
  });

  origEl.value = tool.sample;
  modEl.value = tool.sampleModified || '';
  doDiff();
}

// ==========================================
// 11. HASH GENERATOR
// ==========================================
function renderHashGenerator(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group flex-1">
        <label class="opt-label text-xs">HMAC Key (Optional):</label>
        <input type="text" id="hash-hmac-key" class="form-control form-control-sm font-mono flex-1" placeholder="Leave empty for standard hash" />
      </div>
      <div class="actions-group">
        <button class="btn btn-sm btn-primary" id="btn-compute-hash">${getIcon('refresh', 'icon-xs')} Compute</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="hash-layout">
      <div class="form-group mb-4">
        <label class="form-label font-semibold text-xs">Input Text / Payload *</label>
        <textarea id="hash-input" class="code-editor font-mono min-h-24" placeholder="Enter text to generate cryptographic hashes..."></textarea>
      </div>

      <div class="card p-0">
        <div class="table-responsive">
          <table class="table finance-table text-xs font-mono">
            <thead>
              <tr>
                <th style="width: 120px;">Algorithm</th>
                <th>Hash / Checksum</th>
                <th style="width: 80px;" class="text-right">Action</th>
              </tr>
            </thead>
            <tbody id="hash-results-body"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#hash-input');
  const hmacEl = container.querySelector('#hash-hmac-key');
  const bodyEl = container.querySelector('#hash-results-body');

  async function doHash() {
    const hashes = await generateHashes(inputEl.value, hmacEl.value.trim());
    const algos = [
      { name: 'SHA-256', val: hashes.sha256 },
      { name: 'SHA-512', val: hashes.sha512 },
      { name: 'SHA-384', val: hashes.sha384 },
      { name: 'SHA-1', val: hashes.sha1 },
      { name: 'MD5', val: hashes.md5 },
      { name: 'CRC32', val: hashes.crc32 }
    ];

    bodyEl.innerHTML = algos.map(a => `
      <tr>
        <td class="font-bold text-primary">${a.name}</td>
        <td class="text-emerald break-all">${a.val || '—'}</td>
        <td class="text-right">
          <button class="btn btn-xs btn-secondary btn-copy-hash" data-val="${a.val}">Copy</button>
        </td>
      </tr>
    `).join('');

    bodyEl.querySelectorAll('.btn-copy-hash').forEach(b => {
      b.addEventListener('click', () => copyToClipboard(b.dataset.val, b));
    });

    updateStatusBar(container, inputEl.value);
    addToolHistory(tool.id, inputEl.value);
  }

  container.querySelector('#btn-compute-hash').addEventListener('click', doHash);
  inputEl.addEventListener('input', doHash);
  hmacEl.addEventListener('input', doHash);

  attachStandardToolbarEvents(container, tool, () => {
    inputEl.value = tool.sample;
    doHash();
  });

  inputEl.value = tool.sample;
  doHash();
}

// ==========================================
// 12. COLOR CONVERTER
// ==========================================
function renderColorConverter(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group flex-1">
        <label class="opt-label text-xs">Color Input (HEX, RGB, HSL):</label>
        <input type="text" id="color-str-input" class="form-control form-control-sm font-mono" value="#3B82F6" />
        <input type="color" id="color-native-picker" class="form-control form-control-sm p-0 w-10 cursor-pointer" value="#3b82f6" />
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `<div id="color-details-view" class="color-details-layout"></div>`;

  const strInput = container.querySelector('#color-str-input');
  const nativePicker = container.querySelector('#color-native-picker');
  const detailsEl = container.querySelector('#color-details-view');

  function doColor() {
    const c = parseAndConvertColor(strInput.value);
    detailsEl.innerHTML = `
      <div class="color-preview-card card p-4 mb-4 flex items-center gap-4">
        <div class="color-swatch-large" style="background-color: ${c.hex}; width: 80px; height: 80px; border-radius: 8px; border: 1px solid var(--border-subtle);"></div>
        <div class="flex-1">
          <div class="font-mono text-2xl font-bold">${c.hex}</div>
          <div class="text-xs text-muted mt-1 font-mono">${c.rgb} &bull; ${c.hsl}</div>
        </div>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <span class="metric-label">HEX</span>
          <div class="metric-value font-mono text-base">${c.hex}</div>
          <button class="btn btn-xs btn-ghost btn-copy-field" data-val="${c.hex}">Copy</button>
        </div>
        <div class="metric-card">
          <span class="metric-label">RGB</span>
          <div class="metric-value font-mono text-base">${c.rgb}</div>
          <button class="btn btn-xs btn-ghost btn-copy-field" data-val="${c.rgb}">Copy</button>
        </div>
        <div class="metric-card">
          <span class="metric-label">HSL</span>
          <div class="metric-value font-mono text-base">${c.hsl}</div>
          <button class="btn btn-xs btn-ghost btn-copy-field" data-val="${c.hsl}">Copy</button>
        </div>
        <div class="metric-card">
          <span class="metric-label">CMYK</span>
          <div class="metric-value font-mono text-base">${c.cmyk}</div>
          <button class="btn btn-xs btn-ghost btn-copy-field" data-val="${c.cmyk}">Copy</button>
        </div>
      </div>

      <div class="card p-4 mt-4">
        <div class="card-header p-0 pb-3 mb-3"><h3 class="card-title text-xs">WCAG Contrast Compliance</h3></div>
        <div class="contrast-check-row flex gap-4">
          <div class="contrast-box p-3 rounded border flex-1" style="background: #ffffff; color: ${c.hex};">
            <span class="text-xs font-bold">Contrast on White: ${c.contrastWhite}:1</span>
            <div><span class="badge ${c.wcagWhiteAA ? 'badge-success' : 'badge-danger'} text-xs">AA ${c.wcagWhiteAA ? 'PASS' : 'FAIL'}</span></div>
          </div>
          <div class="contrast-box p-3 rounded border flex-1" style="background: #000000; color: ${c.hex};">
            <span class="text-xs font-bold">Contrast on Black: ${c.contrastBlack}:1</span>
            <div><span class="badge ${c.wcagBlackAA ? 'badge-success' : 'badge-danger'} text-xs">AA ${c.wcagBlackAA ? 'PASS' : 'FAIL'}</span></div>
          </div>
        </div>
      </div>
    `;

    detailsEl.querySelectorAll('.btn-copy-field').forEach(b => {
      b.addEventListener('click', () => copyToClipboard(b.dataset.val, b));
    });
  }

  strInput.addEventListener('input', () => { nativePicker.value = strInput.value; doColor(); });
  nativePicker.addEventListener('input', () => { strInput.value = nativePicker.value; doColor(); });

  attachStandardToolbarEvents(container, tool, () => {
    strInput.value = tool.sample;
    nativePicker.value = tool.sample;
    doColor();
  });

  doColor();
}

// ==========================================
// 13. HTML ENTITY ENCODER
// ==========================================
function renderHTMLEntities(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group">
        <label class="opt-label text-xs">Mode:</label>
        <select id="html-opt-mode" class="form-control form-control-sm">
          <option value="named">Named Entities (&amp;amp;, &amp;lt;)</option>
          <option value="decimal">Decimal (&#38;)</option>
          <option value="hex">Hexadecimal (&#x26;)</option>
        </select>
      </div>
      <div class="actions-group">
        <button class="btn btn-sm btn-primary" id="btn-html-encode">Encode &rarr;</button>
        <button class="btn btn-sm btn-secondary" id="btn-html-decode">&larr; Decode</button>
        <button class="btn btn-sm btn-secondary" id="btn-html-copy">${getIcon('copy', 'icon-xs')} Copy</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="split-pane-layout">
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Raw Text / HTML</span></div>
        <textarea id="html-raw" class="code-editor font-mono" placeholder="Enter HTML here..."></textarea>
      </div>
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Entities Output</span></div>
        <textarea id="html-encoded" class="code-editor font-mono" placeholder="Encoded entities..."></textarea>
      </div>
    </div>
  `;

  const rawEl = container.querySelector('#html-raw');
  const encodedEl = container.querySelector('#html-encoded');
  const modeEl = container.querySelector('#html-opt-mode');

  function doEncode() {
    encodedEl.value = encodeHTMLEntities(rawEl.value, modeEl.value);
    updateStatusBar(container, encodedEl.value);
    addToolHistory(tool.id, rawEl.value);
  }

  function doDecode() {
    rawEl.value = decodeHTMLEntities(encodedEl.value);
    updateStatusBar(container, rawEl.value);
  }

  container.querySelector('#btn-html-encode').addEventListener('click', doEncode);
  container.querySelector('#btn-html-decode').addEventListener('click', doDecode);
  rawEl.addEventListener('input', doEncode);
  modeEl.addEventListener('change', doEncode);
  container.querySelector('#btn-html-copy').addEventListener('click', (e) => copyToClipboard(encodedEl.value, e.currentTarget));

  attachStandardToolbarEvents(container, tool, () => {
    rawEl.value = tool.sample;
    doEncode();
  });

  rawEl.value = tool.sample;
  doEncode();
}

// ==========================================
// 14. URL PARSER
// ==========================================
function renderURLParser(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="actions-group">
        <button class="btn btn-sm btn-secondary" id="btn-url-add-param">+ Add Query Param</button>
        <button class="btn btn-sm btn-secondary" id="btn-copy-full-url">${getIcon('copy', 'icon-xs')} Copy Rebuilt URL</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="url-parser-layout">
      <div class="form-group mb-4">
        <label class="form-label font-semibold text-xs">Full URL to Parse *</label>
        <input type="text" id="url-parse-input" class="form-control font-mono text-sm" placeholder="https://example.com/path?key=val" />
      </div>

      <div class="metrics-grid mb-4" id="url-components-grid"></div>

      <div class="card p-0">
        <div class="pane-header border-b px-4 py-2">
          <span class="pane-title text-xs font-semibold">Query Parameters Table (Live Synchronized)</span>
        </div>
        <div class="table-responsive">
          <table class="table finance-table text-xs font-mono">
            <thead>
              <tr>
                <th style="width: 200px;">Key</th>
                <th>Value</th>
                <th style="width: 60px;" class="text-right">Action</th>
              </tr>
            </thead>
            <tbody id="url-params-body"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#url-parse-input');
  const compGrid = container.querySelector('#url-components-grid');
  const paramsBody = container.querySelector('#url-params-body');

  let currentParams = [];

  function doParse() {
    const res = parseURL(inputEl.value);
    if (res.isValid) {
      currentParams = res.searchParams;
      compGrid.innerHTML = `
        <div class="metric-card"><span class="metric-label">Protocol</span><div class="metric-value font-mono text-base text-primary">${res.protocol}</div></div>
        <div class="metric-card"><span class="metric-label">Hostname</span><div class="metric-value font-mono text-base text-primary">${res.hostname}</div></div>
        <div class="metric-card"><span class="metric-label">Port</span><div class="metric-value font-mono text-base text-primary">${res.port || '80/443'}</div></div>
        <div class="metric-card"><span class="metric-label">Path</span><div class="metric-value font-mono text-base text-primary">${res.pathname || '/'}</div></div>
      `;

      renderParamsTable(res);
      addToolHistory(tool.id, inputEl.value);
    }
  }

  function renderParamsTable(res) {
    if (currentParams.length === 0) {
      paramsBody.innerHTML = `<tr><td colspan="3" class="text-muted text-center p-3">No query parameters found.</td></tr>`;
      return;
    }

    paramsBody.innerHTML = currentParams.map((p, idx) => `
      <tr>
        <td><input type="text" class="form-control form-control-sm q-key font-mono" data-idx="${idx}" value="${escapeHTML(p.key)}" /></td>
        <td><input type="text" class="form-control form-control-sm q-val font-mono" data-idx="${idx}" value="${escapeHTML(p.value)}" /></td>
        <td class="text-right"><button class="btn-icon-danger btn-del-param" data-idx="${idx}">${getIcon('close', 'icon-xs')}</button></td>
      </tr>
    `).join('');

    paramsBody.querySelectorAll('.q-key, .q-val').forEach(inp => {
      inp.addEventListener('input', () => {
        const idx = parseInt(inp.dataset.idx, 10);
        if (inp.classList.contains('q-key')) currentParams[idx].key = inp.value;
        if (inp.classList.contains('q-val')) currentParams[idx].value = inp.value;
        inputEl.value = rebuildURL(res, currentParams);
      });
    });

    paramsBody.querySelectorAll('.btn-del-param').forEach(b => {
      b.addEventListener('click', () => {
        const idx = parseInt(b.dataset.idx, 10);
        currentParams.splice(idx, 1);
        inputEl.value = rebuildURL(res, currentParams);
        renderParamsTable(res);
      });
    });
  }

  inputEl.addEventListener('input', doParse);
  container.querySelector('#btn-url-add-param').addEventListener('click', () => {
    currentParams.push({ key: 'new_param', value: 'value' });
    const res = parseURL(inputEl.value);
    if (res.isValid) {
      inputEl.value = rebuildURL(res, currentParams);
      renderParamsTable(res);
    }
  });

  container.querySelector('#btn-copy-full-url').addEventListener('click', (e) => copyToClipboard(inputEl.value, e.currentTarget));

  attachStandardToolbarEvents(container, tool, () => {
    inputEl.value = tool.sample;
    doParse();
  });

  inputEl.value = tool.sample;
  doParse();
}

// ==========================================
// 15. HTTP REQUEST BUILDER & SIMULATOR
// ==========================================
function renderHTTPBuilder(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group flex-1">
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="http-opt-simulated" /> Offline Simulated Mock Mode
        </label>
        <select id="http-mock-status" class="form-control form-control-sm w-32" style="display: none;">
          <option value="200">Mock: 200 OK</option>
          <option value="201">Mock: 201 Created</option>
          <option value="400">Mock: 400 Bad Req</option>
          <option value="404">Mock: 404 Not Found</option>
          <option value="500">Mock: 500 Error</option>
        </select>
      </div>
      <div class="actions-group">
        <button class="btn btn-sm btn-secondary" id="btn-http-curl">${getIcon('terminal', 'icon-xs')} Copy cURL</button>
        <button class="btn btn-sm btn-primary" id="btn-http-send">${getIcon('play', 'icon-xs')} Send Request</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="http-builder-layout">
      <!-- Request Bar -->
      <div class="http-request-bar flex gap-2 mb-4">
        <select id="http-method" class="form-control w-28 font-bold">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
        <input type="text" id="http-url-input" class="form-control font-mono flex-1" placeholder="https://api.example.com/v1/endpoint" value="${tool.sample}" />
      </div>

      <div class="split-pane-layout">
        <div class="pane-column">
          <div class="pane-header"><span class="pane-title text-xs font-semibold">Request Body / Headers</span></div>
          <textarea id="http-req-body" class="code-editor font-mono" placeholder="Request body (JSON or text)..."></textarea>
        </div>
        <div class="pane-column">
          <div class="pane-header flex items-center justify-between">
            <span class="pane-title text-xs font-semibold">Response Viewer</span>
            <span id="http-res-badge"></span>
          </div>
          <textarea id="http-res-body" class="code-editor font-mono" readonly placeholder="Response will appear here..."></textarea>
        </div>
      </div>
    </div>
  `;

  const methodEl = container.querySelector('#http-method');
  const urlEl = container.querySelector('#http-url-input');
  const bodyEl = container.querySelector('#http-req-body');
  const resBodyEl = container.querySelector('#http-res-body');
  const resBadgeEl = container.querySelector('#http-res-badge');
  const simChk = container.querySelector('#http-opt-simulated');
  const mockStatusEl = container.querySelector('#http-mock-status');

  simChk.addEventListener('change', () => {
    mockStatusEl.style.display = simChk.checked ? 'block' : 'none';
  });

  async function doSend() {
    resBadgeEl.innerHTML = `<span class="badge badge-secondary text-xs">Sending...</span>`;
    const res = await executeHTTPRequest({
      method: methodEl.value,
      url: urlEl.value,
      body: bodyEl.value,
      isSimulated: simChk.checked,
      mockStatus: parseInt(mockStatusEl.value, 10)
    });

    if (res.success) {
      resBadgeEl.innerHTML = `<span class="badge ${res.status < 300 ? 'badge-success' : 'badge-danger'} font-mono">${res.status} ${res.statusText} (${res.duration}ms)</span>`;
      resBodyEl.value = res.body;
      addToolHistory(tool.id, `${methodEl.value} ${urlEl.value}`);
    } else {
      resBadgeEl.innerHTML = `<span class="badge badge-danger">Failed</span>`;
      resBodyEl.value = res.error;
    }
  }

  container.querySelector('#btn-http-send').addEventListener('click', doSend);
  container.querySelector('#btn-http-curl').addEventListener('click', (e) => {
    const curl = generateCurlCommand({ method: methodEl.value, url: urlEl.value, body: bodyEl.value });
    copyToClipboard(curl, e.currentTarget);
  });

  attachStandardToolbarEvents(container, tool, () => {
    urlEl.value = tool.sample;
    methodEl.value = 'GET';
    doSend();
  });
}

// ==========================================
// 16. LOREM / MOCK GENERATOR
// ==========================================
function renderMockGenerator(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group">
        <label class="opt-label text-xs">Generate Type:</label>
        <select id="mock-type" class="form-control form-control-sm">
          <option value="paragraphs">Lorem Paragraphs</option>
          <option value="sentences">Lorem Sentences</option>
          <option value="words">Lorem Words</option>
          <option value="users">Mock Users JSON</option>
        </select>
        <label class="opt-label text-xs">Count:</label>
        <input type="number" id="mock-count" class="form-control form-control-sm w-20" min="1" max="100" value="3" />
      </div>
      <div class="actions-group">
        <button class="btn btn-sm btn-primary" id="btn-mock-gen">${getIcon('refresh', 'icon-xs')} Generate</button>
        <button class="btn btn-sm btn-secondary" id="btn-mock-copy">${getIcon('copy', 'icon-xs')} Copy</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `<textarea id="mock-output" class="code-editor font-mono flex-1 min-h-80"></textarea>`;

  const outEl = container.querySelector('#mock-output');
  const typeEl = container.querySelector('#mock-type');
  const countEl = container.querySelector('#mock-count');

  function doGen() {
    const count = parseInt(countEl.value, 10) || 3;
    if (typeEl.value === 'users') {
      outEl.value = generateMockUsers(count);
    } else {
      outEl.value = generateLorem(typeEl.value, count);
    }
    updateStatusBar(container, outEl.value);
  }

  container.querySelector('#btn-mock-gen').addEventListener('click', doGen);
  typeEl.addEventListener('change', doGen);
  countEl.addEventListener('change', doGen);
  container.querySelector('#btn-mock-copy').addEventListener('click', (e) => copyToClipboard(outEl.value, e.currentTarget));

  attachStandardToolbarEvents(container, tool, null);
  doGen();
}

// ==========================================
// 17. CASE CONVERTER
// ==========================================
function renderCaseConverter(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="actions-group">
        <button class="btn btn-sm btn-secondary" id="btn-copy-cases">${getIcon('copy', 'icon-xs')} Copy All</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="case-converter-layout">
      <div class="form-group mb-4">
        <label class="form-label font-semibold text-xs">Input Text / Identifier *</label>
        <input type="text" id="case-input" class="form-control font-mono text-base" placeholder="Enter text to convert across all programming cases..." />
      </div>
      <div class="metrics-grid" id="case-results-grid"></div>
    </div>
  `;

  const inputEl = container.querySelector('#case-input');
  const gridEl = container.querySelector('#case-results-grid');

  const CASES = [
    { key: 'camelCase', label: 'camelCase' },
    { key: 'PascalCase', label: 'PascalCase' },
    { key: 'snake_case', label: 'snake_case' },
    { key: 'kebab-case', label: 'kebab-case' },
    { key: 'CONSTANT_CASE', label: 'CONSTANT_CASE' },
    { key: 'Title Case', label: 'Title Case' },
    { key: 'sentence case', label: 'Sentence case' },
    { key: 'dot.case', label: 'dot.case' },
    { key: 'path/case', label: 'path/case' },
    { key: 'alternating', label: 'aLtErNaTiNg' },
    { key: 'reverse', label: 'Reverse String' }
  ];

  function doCases() {
    gridEl.innerHTML = CASES.map(c => {
      const converted = convertCase(inputEl.value, c.key);
      return `
        <div class="metric-card">
          <span class="metric-label">${c.label}</span>
          <div class="metric-value font-mono text-base text-primary">${escapeHTML(converted)}</div>
          <button class="btn btn-xs btn-ghost btn-copy-case" data-val="${escapeHTML(converted)}">Copy</button>
        </div>
      `;
    }).join('');

    gridEl.querySelectorAll('.btn-copy-case').forEach(b => {
      b.addEventListener('click', () => copyToClipboard(b.dataset.val, b));
    });
    addToolHistory(tool.id, inputEl.value);
  }

  inputEl.addEventListener('input', doCases);
  attachStandardToolbarEvents(container, tool, () => {
    inputEl.value = tool.sample;
    doCases();
  });

  inputEl.value = tool.sample;
  doCases();
}

// ==========================================
// 18. LINE SORTER
// ==========================================
function renderLineSorter(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group">
        <select id="sort-mode" class="form-control form-control-sm">
          <option value="asc">Alphabetical (A &rarr; Z)</option>
          <option value="desc">Alphabetical (Z &rarr; A)</option>
          <option value="length">Line Length (Short &rarr; Long)</option>
          <option value="length-desc">Line Length (Long &rarr; Short)</option>
          <option value="reverse">Reverse Line Order</option>
          <option value="shuffle">Random Shuffle</option>
        </select>
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="sort-case" /> Case Sensitive
        </label>
      </div>
      <div class="actions-group">
        <button class="btn btn-sm btn-primary" id="btn-do-sort">${getIcon('sort', 'icon-xs')} Sort Lines</button>
        <button class="btn btn-sm btn-secondary" id="btn-copy-sort">${getIcon('copy', 'icon-xs')} Copy</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="split-pane-layout">
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Unsorted Input</span></div>
        <textarea id="sort-input" class="code-editor font-mono" placeholder="Paste lines to sort..."></textarea>
      </div>
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Sorted Output</span></div>
        <textarea id="sort-output" class="code-editor font-mono" readonly placeholder="Sorted lines..."></textarea>
      </div>
    </div>
  `;

  const inEl = container.querySelector('#sort-input');
  const outEl = container.querySelector('#sort-output');
  const modeEl = container.querySelector('#sort-mode');
  const caseEl = container.querySelector('#sort-case');

  function doSort() {
    outEl.value = sortLines(inEl.value, modeEl.value, caseEl.checked);
    updateStatusBar(container, outEl.value);
    addToolHistory(tool.id, inEl.value);
  }

  container.querySelector('#btn-do-sort').addEventListener('click', doSort);
  inEl.addEventListener('input', doSort);
  modeEl.addEventListener('change', doSort);
  caseEl.addEventListener('change', doSort);
  container.querySelector('#btn-copy-sort').addEventListener('click', (e) => copyToClipboard(outEl.value, e.currentTarget));

  attachStandardToolbarEvents(container, tool, () => {
    inEl.value = tool.sample;
    doSort();
  });

  inEl.value = tool.sample;
  doSort();
}

// ==========================================
// 19. DUPLICATE LINE REMOVER
// ==========================================
function renderDuplicateRemover(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group">
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="dedup-case" /> Case Sensitive
        </label>
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="dedup-trim" checked /> Trim Whitespace
        </label>
      </div>
      <div class="actions-group">
        <span class="badge badge-primary font-mono text-xs" id="dedup-stats-badge">0 duplicates removed</span>
        <button class="btn btn-sm btn-secondary" id="btn-copy-dedup">${getIcon('copy', 'icon-xs')} Copy</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="split-pane-layout">
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Raw Input Lines</span></div>
        <textarea id="dedup-input" class="code-editor font-mono" placeholder="Paste lines with duplicates..."></textarea>
      </div>
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Deduplicated Output</span></div>
        <textarea id="dedup-output" class="code-editor font-mono" readonly placeholder="Unique lines..."></textarea>
      </div>
    </div>
  `;

  const inEl = container.querySelector('#dedup-input');
  const outEl = container.querySelector('#dedup-output');
  const caseEl = container.querySelector('#dedup-case');
  const trimEl = container.querySelector('#dedup-trim');
  const badgeEl = container.querySelector('#dedup-stats-badge');

  function doDedup() {
    const res = removeDuplicateLines(inEl.value, { caseSensitive: caseEl.checked, trimLines: trimEl.checked });
    outEl.value = res.output;
    badgeEl.textContent = `${res.removedCount} duplicates removed (${res.uniqueCount} unique)`;
    updateStatusBar(container, outEl.value);
    addToolHistory(tool.id, inEl.value);
  }

  inEl.addEventListener('input', doDedup);
  caseEl.addEventListener('change', doDedup);
  trimEl.addEventListener('change', doDedup);
  container.querySelector('#btn-copy-dedup').addEventListener('click', (e) => copyToClipboard(outEl.value, e.currentTarget));

  attachStandardToolbarEvents(container, tool, () => {
    inEl.value = tool.sample;
    doDedup();
  });

  inEl.value = tool.sample;
  doDedup();
}

// ==========================================
// 20. WHITESPACE CLEANER
// ==========================================
function renderWhitespaceCleaner(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group">
        <label class="checkbox-label text-xs"><input type="checkbox" id="clean-trim" checked /> Trim Lines</label>
        <label class="checkbox-label text-xs"><input type="checkbox" id="clean-empty" checked /> Remove Empty Lines</label>
        <label class="checkbox-label text-xs"><input type="checkbox" id="clean-collapse" checked /> Collapse Spaces</label>
        <label class="checkbox-label text-xs"><input type="checkbox" id="clean-tabs" /> Tabs to Spaces</label>
      </div>
      <div class="actions-group">
        <button class="btn btn-sm btn-secondary" id="btn-copy-clean">${getIcon('copy', 'icon-xs')} Copy</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="split-pane-layout">
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Raw Text</span></div>
        <textarea id="clean-input" class="code-editor font-mono" placeholder="Paste messy text..."></textarea>
      </div>
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Cleaned Result</span></div>
        <textarea id="clean-output" class="code-editor font-mono" readonly placeholder="Cleaned text..."></textarea>
      </div>
    </div>
  `;

  const inEl = container.querySelector('#clean-input');
  const outEl = container.querySelector('#clean-output');
  const trimEl = container.querySelector('#clean-trim');
  const emptyEl = container.querySelector('#clean-empty');
  const collapseEl = container.querySelector('#clean-collapse');
  const tabsEl = container.querySelector('#clean-tabs');

  function doClean() {
    outEl.value = cleanWhitespace(inEl.value, {
      trimLines: trimEl.checked,
      removeEmptyLines: emptyEl.checked,
      collapseSpaces: collapseEl.checked,
      tabsToSpaces: tabsEl.checked
    });
    updateStatusBar(container, outEl.value);
    addToolHistory(tool.id, inEl.value);
  }

  inEl.addEventListener('input', doClean);
  trimEl.addEventListener('change', doClean);
  emptyEl.addEventListener('change', doClean);
  collapseEl.addEventListener('change', doClean);
  tabsEl.addEventListener('change', doClean);
  container.querySelector('#btn-copy-clean').addEventListener('click', (e) => copyToClipboard(outEl.value, e.currentTarget));

  attachStandardToolbarEvents(container, tool, () => {
    inEl.value = tool.sample;
    doClean();
  });

  inEl.value = tool.sample;
  doClean();
}


/* --- MODULE: js/command-palette.js --- */
/**
 * DevBench - Command Palette Module (Ctrl+K / Cmd+K)
 * Fast keyboard-driven command palette for instant tool switching, search, and actions.
 */





class CommandPalette {
  constructor(onSelectTool) {
    this.onSelectTool = onSelectTool;
    this.dialog = document.getElementById('command-palette-dialog');
    this.input = document.getElementById('palette-search-input');
    this.resultsList = document.getElementById('palette-results-list');
    this.selectedIndex = 0;
    this.currentItems = [];

    this.initListeners();
  }

  initListeners() {
    // Keyboard shortcut Ctrl+K or Cmd+K
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K' || e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        this.open();
      }
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    // Input filter
    this.input?.addEventListener('input', () => {
      this.filterResults(this.input.value.trim());
    });

    // Keyboard navigation inside palette
    this.input?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.moveSelection(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.moveSelection(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.executeSelected();
      }
    });

    // Backdrop click
    this.dialog?.addEventListener('click', (e) => {
      if (e.target === this.dialog) this.close();
    });
  }

  open() {
    if (!this.dialog) return;
    this.dialog.classList.add('active');
    this.input.value = '';
    this.filterResults('');
    setTimeout(() => this.input.focus(), 50);
  }

  close() {
    if (!this.dialog) return;
    this.dialog.classList.remove('active');
  }

  isOpen() {
    return this.dialog?.classList.contains('active');
  }

  filterResults(query) {
    const q = query.toLowerCase();
    const favorites = getFavorites();
    const recents = getRecentTools();

    let items = [];

    // Filter tools
    TOOLS.forEach(tool => {
      let score = 0;
      const titleLower = tool.title.toLowerCase();
      const descLower = tool.desc.toLowerCase();
      const catLower = tool.category.toLowerCase();

      if (!q) {
        // Default ranking: Favorites first, then recents, then standard
        if (favorites.includes(tool.id)) score = 100;
        else if (recents.includes(tool.id)) score = 50;
        else score = 10;
      } else {
        if (titleLower === q) score = 1000;
        else if (titleLower.startsWith(q)) score = 500;
        else if (titleLower.includes(q)) score = 200;
        else if (descLower.includes(q)) score = 50;
        else if (catLower.includes(q)) score = 30;
      }

      if (score > 0) {
        items.push({
          type: 'tool',
          id: tool.id,
          title: tool.title,
          desc: tool.desc,
          category: tool.category,
          icon: tool.icon,
          isFav: favorites.includes(tool.id),
          score
        });
      }
    });

    // Actions
    const actions = [
      { type: 'action', id: 'theme-dark', title: 'Theme: Switch to Dark Mode', icon: 'moon', category: 'Preferences' },
      { type: 'action', id: 'theme-light', title: 'Theme: Switch to Light Mode', icon: 'sun', category: 'Preferences' }
    ];

    actions.forEach(act => {
      if (!q || act.title.toLowerCase().includes(q)) {
        items.push({ ...act, score: q ? 150 : 5 });
      }
    });

    // Sort by score
    items.sort((a, b) => b.score - a.score);
    this.currentItems = items.slice(0, 12);
    this.selectedIndex = 0;
    this.renderResults();
  }

  renderResults() {
    if (this.currentItems.length === 0) {
      this.resultsList.innerHTML = `<div class="palette-empty p-4 text-center text-muted text-xs">No matching utilities or commands found.</div>`;
      return;
    }

    this.resultsList.innerHTML = this.currentItems.map((item, idx) => {
      const isSelected = idx === this.selectedIndex;
      return `
        <div class="palette-item ${isSelected ? 'selected' : ''}" data-idx="${idx}">
          <div class="palette-item-icon">${getIcon(item.icon, 'icon-sm')}</div>
          <div class="palette-item-text">
            <span class="palette-item-title font-medium">${item.title}</span>
            ${item.desc ? `<span class="palette-item-desc text-xs text-muted">${item.desc}</span>` : ''}
          </div>
          <span class="palette-category-badge badge badge-secondary font-mono text-xs">${item.category}</span>
        </div>
      `;
    }).join('');

    this.resultsList.querySelectorAll('.palette-item').forEach(el => {
      el.addEventListener('click', () => {
        this.selectedIndex = parseInt(el.dataset.idx, 10);
        this.executeSelected();
      });
    });
  }

  moveSelection(dir) {
    if (this.currentItems.length === 0) return;
    this.selectedIndex = (this.selectedIndex + dir + this.currentItems.length) % this.currentItems.length;
    this.renderResults();
    // Scroll item into view
    const selectedEl = this.resultsList.querySelector(`.palette-item[data-idx="${this.selectedIndex}"]`);
    selectedEl?.scrollIntoView({ block: 'nearest' });
  }

  executeSelected() {
    const item = this.currentItems[this.selectedIndex];
    if (!item) return;

    this.close();

    if (item.type === 'tool') {
      this.onSelectTool(item.id);
    } else if (item.id === 'theme-dark') {
      window.dispatchEvent(new CustomEvent('SET_THEME', { detail: { theme: 'dark' } }));
    } else if (item.id === 'theme-light') {
      window.dispatchEvent(new CustomEvent('SET_THEME', { detail: { theme: 'light' } }));
    }
  }
}


/* --- MODULE: js/app.js --- */
/**
 * DevBench - Main Workstation Orchestrator
 * Tab management, sidebar navigation, history & snippet drawers, shortcuts, theme engine.
 */






class DevBenchApp {
  constructor() {
    this.sidebarNav = document.getElementById('sidebar-tools-list');
    this.favoritesList = document.getElementById('sidebar-favorites-list');
    this.recentsList = document.getElementById('sidebar-recents-list');
    this.tabBar = document.getElementById('editor-tab-bar');
    this.workspace = document.getElementById('active-tool-workspace');
    this.sidebarFilter = document.getElementById('sidebar-search-input');
    this.drawer = document.getElementById('side-drawer');
    this.modal = document.getElementById('devbench-modal-container');

    this.openTabs = getOpenTabs();
    this.activeTabId = getActiveTab();
    if (!this.openTabs.includes(this.activeTabId)) {
      this.openTabs.unshift(this.activeTabId);
    }

    this.commandPalette = new CommandPalette((toolId) => this.openTool(toolId));
  }

  init() {
    // 1. Apply Theme
    const theme = getTheme();
    document.documentElement.setAttribute('data-theme', theme);
    this.updateThemeButton(theme);

    // 2. Render Sidebar Navigation & Tabs
    this.renderSidebar();
    this.renderTabs();
    this.renderActiveTool();

    // 3. Setup Global Listeners
    this.setupListeners();
    this.setupShortcuts();
  }

  setupListeners() {
    // Theme toggle
    document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      setTheme(next);
      this.updateThemeButton(next);
    });

    window.addEventListener('SET_THEME', (e) => {
      const t = e.detail?.theme || 'dark';
      document.documentElement.setAttribute('data-theme', t);
      setTheme(t);
      this.updateThemeButton(t);
    });

    // Sidebar search input
    this.sidebarFilter?.addEventListener('input', (e) => {
      this.renderSidebar(e.target.value.trim().toLowerCase());
    });

    // Top search bar trigger command palette
    document.getElementById('topbar-search-trigger')?.addEventListener('click', () => {
      this.commandPalette.open();
    });

    // Favorites event
    window.addEventListener('TOGGLE_FAVORITE', (e) => {
      const toolId = e.detail?.toolId;
      if (toolId) {
        toggleFavorite(toolId);
        this.renderSidebar(this.sidebarFilter?.value.trim().toLowerCase());
        this.renderActiveTool(); // refresh star
      }
    });

    // History drawer event
    window.addEventListener('OPEN_HISTORY_DRAWER', (e) => {
      const toolId = e.detail?.toolId || this.activeTabId;
      this.openHistoryDrawer(toolId);
    });

    // Save snippet modal event
    window.addEventListener('OPEN_SAVE_SNIPPET_MODAL', (e) => {
      const toolId = e.detail?.toolId || this.activeTabId;
      this.openSaveSnippetModal(toolId);
    });

    // Mobile sidebar toggle
    document.getElementById('btn-mobile-sidebar-toggle')?.addEventListener('click', () => {
      document.getElementById('app-sidebar')?.classList.toggle('open');
    });
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ctrl+W: close active tab
      if ((e.ctrlKey || e.metaKey) && (e.key === 'w' || e.key === 'W') && !e.shiftKey) {
        if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
          e.preventDefault();
          this.closeTab(this.activeTabId);
        }
      }
    });
  }

  updateThemeButton(theme) {
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? getIcon('sun', 'icon-sm') : getIcon('moon', 'icon-sm');
      btn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
    }
  }

  // --- Sidebar Rendering ---
  renderSidebar(filterQuery = '') {
    const favorites = getFavorites();
    const recents = getRecentTools();

    // 1. Favorites List
    const favTools = TOOLS.filter(t => favorites.includes(t.id));
    if (this.favoritesList) {
      if (favTools.length === 0) {
        this.favoritesList.innerHTML = `<span class="text-xs text-muted px-3">No pinned tools</span>`;
      } else {
        this.favoritesList.innerHTML = favTools.map(t => this.renderSidebarItem(t)).join('');
      }
    }

    // 2. Recents List
    const recentTools = recents.map(id => getToolById(id)).filter(Boolean);
    if (this.recentsList) {
      this.recentsList.innerHTML = recentTools.slice(0, 5).map(t => this.renderSidebarItem(t)).join('');
    }

    // 3. Category Groups
    let html = '';
    Object.values(TOOL_CATEGORIES).forEach(categoryName => {
      const catTools = TOOLS.filter(t => {
        if (t.category !== categoryName) return false;
        if (!filterQuery) return true;
        return t.title.toLowerCase().includes(filterQuery) || t.desc.toLowerCase().includes(filterQuery);
      });

      if (catTools.length > 0) {
        html += `
          <div class="sidebar-category-group">
            <div class="sidebar-cat-title font-mono text-xs uppercase text-muted">${categoryName} (${catTools.length})</div>
            <div class="sidebar-cat-items">
              ${catTools.map(t => this.renderSidebarItem(t)).join('')}
            </div>
          </div>
        `;
      }
    });

    if (this.sidebarNav) {
      this.sidebarNav.innerHTML = html || `<div class="p-3 text-xs text-muted text-center">No tools matched "${escapeHTML(filterQuery)}"</div>`;
    }

    // Bind sidebar clicks
    document.querySelectorAll('.sidebar-tool-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const toolId = item.dataset.toolId;
        this.openTool(toolId);
        document.getElementById('app-sidebar')?.classList.remove('open');
      });
    });
  }

  renderSidebarItem(tool) {
    const isActive = tool.id === this.activeTabId;
    return `
      <a href="#${tool.id}" class="sidebar-tool-item ${isActive ? 'active' : ''}" data-tool-id="${tool.id}">
        <span class="tool-item-icon">${getIcon(tool.icon, 'icon-sm')}</span>
        <span class="tool-item-label">${tool.title}</span>
      </a>
    `;
  }

  // --- Tab Management ---
  openTool(toolId) {
    if (!this.openTabs.includes(toolId)) {
      this.openTabs.push(toolId);
      saveOpenTabs(this.openTabs);
    }
    this.activeTabId = toolId;
    saveActiveTab(this.activeTabId);
    recordRecentTool(toolId);

    this.renderSidebar(this.sidebarFilter?.value.trim().toLowerCase());
    this.renderTabs();
    this.renderActiveTool();
  }

  closeTab(toolId) {
    if (this.openTabs.length <= 1) return; // Keep at least one tab open
    const idx = this.openTabs.indexOf(toolId);
    if (idx !== -1) {
      this.openTabs.splice(idx, 1);
      saveOpenTabs(this.openTabs);
      if (this.activeTabId === toolId) {
        const nextIdx = Math.max(0, idx - 1);
        this.activeTabId = this.openTabs[nextIdx];
        saveActiveTab(this.activeTabId);
      }
      this.renderTabs();
      this.renderActiveTool();
      this.renderSidebar(this.sidebarFilter?.value.trim().toLowerCase());
    }
  }

  renderTabs() {
    if (!this.tabBar) return;
    this.tabBar.innerHTML = this.openTabs.map(toolId => {
      const tool = getToolById(toolId);
      const isActive = toolId === this.activeTabId;
      return `
        <div class="editor-tab ${isActive ? 'active' : ''}" data-tool-id="${tool.id}">
          <span class="tab-icon">${getIcon(tool.icon, 'icon-xs')}</span>
          <span class="tab-title text-xs font-medium">${tool.title}</span>
          ${this.openTabs.length > 1 ? `
            <button class="tab-close-btn" data-close-id="${tool.id}" title="Close Tab (Ctrl+W)">&times;</button>
          ` : ''}
        </div>
      `;
    }).join('');

    // Tab clicks
    this.tabBar.querySelectorAll('.editor-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-close-btn')) {
          e.stopPropagation();
          const closeId = e.target.dataset.closeId;
          this.closeTab(closeId);
          return;
        }
        const toolId = tab.dataset.toolId;
        this.openTool(toolId);
      });
    });
  }

  renderActiveTool() {
    if (!this.workspace) return;
    const tool = getToolById(this.activeTabId);
    this.workspace.innerHTML = '';
    tool.render(this.workspace, tool);

    // Update star state in tool header
    const favorites = getFavorites();
    const favBtn = this.workspace.querySelector('.btn-fav-toggle');
    if (favBtn) {
      const isFav = favorites.includes(tool.id);
      favBtn.innerHTML = isFav ? getIcon('starFilled', 'icon-sm') : getIcon('star', 'icon-sm');
      favBtn.classList.toggle('text-warning', isFav);
    }
  }

  // --- History Drawer ---
  openHistoryDrawer(toolId) {
    const tool = getToolById(toolId);
    const history = getToolHistory(toolId);

    this.drawer.innerHTML = `
      <div class="drawer-header">
        <div class="flex items-center gap-2">
          ${getIcon('history', 'icon-sm')}
          <span class="font-bold text-sm">${tool.title} &mdash; Input History</span>
        </div>
        <button class="btn-icon-xs btn-drawer-close">&times;</button>
      </div>
      <div class="drawer-body p-4 overflow-y-auto flex-1">
        ${history.length === 0 ? `
          <div class="text-muted text-xs text-center p-6">No saved history for this tool yet. Recent inputs will automatically appear here.</div>
        ` : `
          <div class="history-list flex flex-col gap-3">
            ${history.map(item => `
              <div class="card p-3 history-card cursor-pointer hover:border-primary" data-val="${escapeHTML(item.value)}">
                <div class="flex justify-between text-xs text-muted mb-1 font-mono">
                  <span>${new Date(item.timestamp).toLocaleTimeString()}</span>
                  <span class="text-primary font-bold">Restore &rarr;</span>
                </div>
                <div class="font-mono text-xs text-secondary truncate">${escapeHTML(item.snippet)}</div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
      <div class="drawer-footer p-3 border-t flex justify-between">
        <button class="btn btn-sm btn-ghost text-rose btn-clear-history">${getIcon('trash', 'icon-xs')} Clear History</button>
        <button class="btn btn-sm btn-secondary btn-drawer-close">Close</button>
      </div>
    `;

    this.drawer.classList.add('active');

    this.drawer.querySelectorAll('.btn-drawer-close').forEach(b => {
      b.addEventListener('click', () => this.drawer.classList.remove('active'));
    });

    this.drawer.querySelectorAll('.history-card').forEach(card => {
      card.addEventListener('click', () => {
        const val = card.dataset.val;
        // Inject into current active tool editor
        const primaryInput = this.workspace.querySelector('textarea, input[type="text"]');
        if (primaryInput) {
          primaryInput.value = val;
          primaryInput.dispatchEvent(new Event('input'));
        }
        this.drawer.classList.remove('active');
      });
    });

    this.drawer.querySelector('.btn-clear-history')?.addEventListener('click', () => {
      clearToolHistory(toolId);
      this.openHistoryDrawer(toolId);
    });
  }

  // --- Saved Snippets Modal ---
  openSaveSnippetModal(toolId) {
    const tool = getToolById(toolId);
    const primaryInput = this.workspace.querySelector('textarea, input[type="text"]');
    const content = primaryInput ? primaryInput.value : '';
    const existingSnippets = getSavedSnippets(toolId);

    this.modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="flex items-center gap-2">
            ${getIcon('bookmark', 'icon-sm')}
            <span class="font-bold text-sm">Save Snippet for ${tool.title}</span>
          </div>
          <button class="btn-icon-xs btn-modal-close">&times;</button>
        </div>
        <div class="modal-body p-4">
          <div class="form-group mb-3">
            <label class="form-label text-xs font-semibold">Snippet Title / Label *</label>
            <input type="text" id="snippet-title-input" class="form-control" placeholder="e.g. Standard Auth Payload, Sample JWT" required />
          </div>
          <div class="form-group mb-4">
            <label class="form-label text-xs font-semibold">Content</label>
            <textarea id="snippet-content-input" class="code-editor font-mono text-xs" rows="4">${escapeHTML(content)}</textarea>
          </div>

          ${existingSnippets.length > 0 ? `
            <div class="border-t pt-3 mt-3">
              <span class="text-xs font-semibold text-muted block mb-2">Saved Snippets (${existingSnippets.length})</span>
              <div class="flex flex-col gap-2 max-h-40 overflow-y-auto">
                ${existingSnippets.map(s => `
                  <div class="card p-2 flex justify-between items-center text-xs">
                    <span class="font-medium cursor-pointer text-primary btn-load-snip" data-content="${escapeHTML(s.content)}">${escapeHTML(s.title)}</span>
                    <button class="btn-icon-xs text-rose btn-del-snip" data-id="${s.id}">&times;</button>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
        <div class="modal-footer p-3 border-t flex justify-end gap-2">
          <button class="btn btn-sm btn-secondary btn-modal-close">Cancel</button>
          <button class="btn btn-sm btn-primary" id="btn-confirm-save-snippet">Save Snippet</button>
        </div>
      </div>
    `;

    this.modal.classList.add('active');

    this.modal.querySelectorAll('.btn-modal-close, .modal-backdrop').forEach(b => {
      b.addEventListener('click', () => this.modal.classList.remove('active'));
    });

    this.modal.querySelector('#btn-confirm-save-snippet')?.addEventListener('click', () => {
      const title = this.modal.querySelector('#snippet-title-input').value;
      const text = this.modal.querySelector('#snippet-content-input').value;
      if (title.trim() && text) {
        saveSnippet(toolId, title, text);
        this.modal.classList.remove('active');
      }
    });

    this.modal.querySelectorAll('.btn-load-snip').forEach(b => {
      b.addEventListener('click', () => {
        if (primaryInput) {
          primaryInput.value = b.dataset.content;
          primaryInput.dispatchEvent(new Event('input'));
        }
        this.modal.classList.remove('active');
      });
    });

    this.modal.querySelectorAll('.btn-del-snip').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteSnippet(b.dataset.id);
        this.openSaveSnippetModal(toolId);
      });
    });
  }
}



// Bootstrap
function startDevBench() {
  const app = new DevBenchApp();
  app.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startDevBench);
} else {
  startDevBench();
}


})();
