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
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  zap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  keyboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="6" y1="8" x2="6.01" y2="8"></line><line x1="10" y1="8" x2="10.01" y2="8"></line><line x1="14" y1="8" x2="14.01" y2="8"></line><line x1="18" y1="8" x2="18.01" y2="8"></line><line x1="6" y1="12" x2="6.01" y2="12"></line><line x1="10" y1="12" x2="10.01" y2="12"></line><line x1="14" y1="12" x2="14.01" y2="12"></line><line x1="18" y1="12" x2="18.01" y2="12"></line><line x1="8" y1="16" x2="16" y2="16"></line></svg>`,
  fileCode: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><polyline points="10 13 8 15 10 17"></polyline><polyline points="14 13 16 15 14 17"></polyline></svg>`,

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
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

ICONS;


/* --- MODULE: js/storage.js --- */
/**
 * DevBench - Storage & State Management Module
 * Manages favorites, recent tools, theme, input history, and saved snippets using localStorage with safe in-memory fallback.
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
const DEFAULT_RECENTS = ['json-formatter', 'jwt-decoder', 'uuid-gen', 'hash-gen'];

// In-memory fallback if localStorage is disabled or restricted
const inMemoryStore = new Map();

function safeGetItem(key) {
  try {
    if (typeof localStorage !== 'undefined') {
      const val = localStorage.getItem(key);
      if (val !== null) return val;
    }
  } catch (e) {
    // Fallback to memory
  }
  return inMemoryStore.has(key) ? inMemoryStore.get(key) : null;
}

function safeSetItem(key, value) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  } catch (e) {
    // Storage quota exceeded or disabled
  }
  inMemoryStore.set(key, value);
}

function getTheme() {
  const val = safeGetItem(STORAGE_KEYS.THEME);
  return (val === 'light' || val === 'dark') ? val : 'dark';
}

function setTheme(theme) {
  safeSetItem(STORAGE_KEYS.THEME, theme === 'light' ? 'light' : 'dark');
}

function getFavorites() {
  const raw = safeGetItem(STORAGE_KEYS.FAVORITES);
  if (!raw) return DEFAULT_FAVORITES;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_FAVORITES;
  } catch (e) {
    return DEFAULT_FAVORITES;
  }
}

function toggleFavorite(toolId) {
  if (!toolId) return getFavorites();
  const favs = [...getFavorites()];
  const idx = favs.indexOf(toolId);
  if (idx !== -1) {
    favs.splice(idx, 1);
  } else {
    favs.push(toolId);
  }
  safeSetItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
  return favs;
}

function getRecentTools() {
  const raw = safeGetItem(STORAGE_KEYS.RECENT);
  if (!raw) return DEFAULT_RECENTS;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_RECENTS;
  } catch (e) {
    return DEFAULT_RECENTS;
  }
}

function recordRecentTool(toolId) {
  if (!toolId) return;
  let recents = getRecentTools().filter(id => id !== toolId);
  recents.unshift(toolId);
  if (recents.length > 8) recents = recents.slice(0, 8);
  safeSetItem(STORAGE_KEYS.RECENT, JSON.stringify(recents));
}

function getOpenTabs() {
  const raw = safeGetItem(STORAGE_KEYS.OPEN_TABS);
  if (!raw) return ['json-formatter'];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : ['json-formatter'];
  } catch (e) {
    return ['json-formatter'];
  }
}

function saveOpenTabs(tabs) {
  if (Array.isArray(tabs) && tabs.length > 0) {
    safeSetItem(STORAGE_KEYS.OPEN_TABS, JSON.stringify(tabs));
  }
}

function getActiveTab() {
  return safeGetItem(STORAGE_KEYS.ACTIVE_TAB) || 'json-formatter';
}

function saveActiveTab(tabId) {
  if (tabId) {
    safeSetItem(STORAGE_KEYS.ACTIVE_TAB, tabId);
  }
}

/**
 * Tool Input History Stack
 */
function getToolHistory(toolId) {
  const raw = safeGetItem(STORAGE_KEYS.HISTORY);
  if (!raw) return [];
  try {
    const all = JSON.parse(raw);
    return Array.isArray(all[toolId]) ? all[toolId] : [];
  } catch (e) {
    return [];
  }
}

function addToolHistory(toolId, inputVal) {
  if (!toolId || !inputVal || !inputVal.trim()) return;
  // Ignore huge payloads > 500KB in history
  if (inputVal.length > 500000) return;
  try {
    const raw = safeGetItem(STORAGE_KEYS.HISTORY);
    const all = raw ? JSON.parse(raw) : {};
    let list = Array.isArray(all[toolId]) ? all[toolId] : [];
    // Remove duplicate of same value
    list = list.filter(item => item.value !== inputVal);
    list.unshift({
      id: 'h_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      value: inputVal,
      timestamp: Date.now(),
      snippet: inputVal.slice(0, 80).replace(/\n/g, ' ')
    });
    if (list.length > 20) list = list.slice(0, 20);
    all[toolId] = list;
    safeSetItem(STORAGE_KEYS.HISTORY, JSON.stringify(all));
  } catch (e) {}
}

function clearToolHistory(toolId) {
  try {
    const raw = safeGetItem(STORAGE_KEYS.HISTORY);
    const all = raw ? JSON.parse(raw) : {};
    delete all[toolId];
    safeSetItem(STORAGE_KEYS.HISTORY, JSON.stringify(all));
  } catch (e) {}
}

function clearAllHistory() {
  safeSetItem(STORAGE_KEYS.HISTORY, JSON.stringify({}));
}

/**
 * Saved Snippets
 */
function getSavedSnippets(toolId = null) {
  const raw = safeGetItem(STORAGE_KEYS.SNIPPETS);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    if (toolId) return list.filter(s => s.toolId === toolId);
    return list;
  } catch (e) {
    return [];
  }
}

function saveSnippet(toolId, title, content) {
  if (!toolId || !content || !title) return;
  try {
    const list = getSavedSnippets();
    list.unshift({
      id: 'snip_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      toolId,
      title: title.trim(),
      content,
      createdAt: new Date().toISOString()
    });
    safeSetItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(list));
  } catch (e) {}
}

function deleteSnippet(snippetId) {
  try {
    let list = getSavedSnippets();
    list = list.filter(s => s.id !== snippetId);
    safeSetItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(list));
  } catch (e) {}
}


/* --- MODULE: js/tools/encoding-tools.js --- */
/**
 * DevBench - Encoding & Decoding Tools Engine
 * Base64 Encoder/Decoder (UTF-8 safe, URL-safe, Data URIs, Hex), URL Encoder/Decoder, and HTML Entity Encoder/Decoder.
 */

// --- 1. Base64 Encoder / Decoder (UTF-8 Safe & Data URI Aware) ---
function encodeBase64(input, options = {}) {
  if (!input) return '';
  const { urlSafe = false, dataUriMime = '' } = typeof options === 'boolean' ? { urlSafe: options } : options;

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
    if (dataUriMime) {
      return `data:${dataUriMime};base64,${base64}`;
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
    // Strip Data URI header if present
    const dataUriMatch = clean.match(/^data:([a-zA-Z0-9/+-]+)?;base64,(.*)$/s);
    if (dataUriMatch) {
      clean = dataUriMatch[2].trim();
    }

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
    throw new Error('Invalid Base64 payload: ' + err.message);
  }
}

function base64ToHex(input) {
  if (!input) return '';
  let clean = input.trim().replace(/^data:.*?;base64,/, '').replace(/-/g, '+').replace(/_/g, '/');
  while (clean.length % 4 !== 0) clean += '=';
  const binary = atob(clean);
  return Array.from(binary).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
}

function hexToBase64(hexStr) {
  if (!hexStr) return '';
  const clean = hexStr.replace(/[^0-9a-fA-F]/g, '');
  let binary = '';
  for (let i = 0; i < clean.length; i += 2) {
    binary += String.fromCharCode(parseInt(clean.substr(i, 2), 16));
  }
  return btoa(binary);
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
  if (mode === 'rfc3986') {
    return encodeURIComponent(input).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
  }
  return encodeURI(input);
}

function decodeURL(input, mode = 'component') {
  if (!input) return '';
  try {
    let clean = input;
    if (mode === 'form' || clean.includes('+')) {
      clean = clean.replace(/\+/g, ' ');
    }
    return decodeURIComponent(clean);
  } catch (err) {
    throw new Error('Invalid URL-encoded string: ' + err.message);
  }
}

// --- 3. HTML Entity Encoder / Decoder ---
const NAMED_ENTITY_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '©': '&copy;',
  '®': '&reg;',
  '™': '&trade;',
  '€': '&euro;',
  '£': '&pound;',
  '¥': '&yen;',
  '—': '&mdash;',
  '–': '&ndash;',
  '•': '&bull;',
  '…': '&hellip;'
};

const DECODE_ENTITY_MAP = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&#39;': "'",
  '&#x27;': "'",
  '&nbsp;': ' ',
  '&copy;': '©',
  '&reg;': '®',
  '&trade;': '™',
  '&euro;': '€',
  '&pound;': '£',
  '&yen;': '¥',
  '&mdash;': '—',
  '&ndash;': '–',
  '&bull;': '•',
  '&hellip;': '…'
};

function encodeHTMLEntities(input, mode = 'named') {
  if (!input) return '';

  if (mode === 'named') {
    return input.replace(/[&<>"'©®™€£¥—–•…]/g, char => NAMED_ENTITY_MAP[char] || `&#${char.charCodeAt(0)};`);
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

  let decoded = input.replace(/&(?:amp|lt|gt|quot|apos|#39|#x27|nbsp|copy|reg|trade|euro|pound|yen|mdash|ndash|bull|hellip);/gi, match => DECODE_ENTITY_MAP[match.toLowerCase()] || match);

  // Decimal entities (&#123;)
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
    try {
      const code = parseInt(dec, 10);
      return String.fromCodePoint ? String.fromCodePoint(code) : String.fromCharCode(code);
    } catch (e) {
      return match;
    }
  });

  // Hex entities (&#x7B;)
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
    try {
      const code = parseInt(hex, 16);
      return String.fromCodePoint ? String.fromCodePoint(code) : String.fromCharCode(code);
    } catch (e) {
      return match;
    }
  });

  return decoded;
}


/* --- MODULE: js/tools/json-tools.js --- */
/**
 * DevBench - JSON Tools Engine
 * High-performance JSON Formatter, Syntax Validator with precise error pointers, and Interactive AST Tree.
 */



// --- 1. JSON Formatter & Minifier ---
function formatJSON(input, options = {}) {
  const { indent = 2, sortKeys = false, removeNulls = false, escapeUnicode = false } = options;
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

    const spacer = indent === 'tab' ? '\t' : (indent === 0 || indent === '0' ? '' : Number(indent));
    let output = JSON.stringify(parsed, null, spacer);

    if (escapeUnicode) {
      output = output.replace(/[\u007F-\uFFFF]/g, c => '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4));
    }

    const size = new Blob([output]).size;
    const lines = output ? output.split('\n').length : 0;

    return { success: true, output, size, lines, error: null };
  } catch (err) {
    return {
      success: false,
      output: '',
      error: err.message,
      errorPos: extractErrorPosition(err.message, input)
    };
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
    const keysCount = (typeof parsed === 'object' && parsed !== null) ? Object.keys(parsed).length : 1;
    const depth = calculateObjectDepth(parsed);

    return {
      isValid: true,
      type,
      size,
      keysCount,
      depth,
      message: `Valid JSON (${type} &bull; ${keysCount} top-level ${keysCount === 1 ? 'element' : 'elements'} &bull; Depth: ${depth})`
    };
  } catch (err) {
    const pos = extractErrorPosition(err.message, input);
    return {
      isValid: false,
      message: err.message,
      line: pos.line,
      column: pos.column,
      snippet: pos.snippet,
      caretPointer: pos.caretPointer
    };
  }
}

function calculateObjectDepth(obj) {
  if (obj === null || typeof obj !== 'object') return 1;
  const values = Object.values(obj);
  if (values.length === 0) return 1;
  return 1 + Math.max(...values.map(calculateObjectDepth));
}

function extractErrorPosition(errMsg, input) {
  let line = 1;
  let column = 1;
  let snippet = '';
  let caretPointer = '';

  const allLines = input.split('\n');

  // Look for "at position X" in V8
  const posMatch = errMsg.match(/position\s+(\d+)/i);
  if (posMatch) {
    const index = parseInt(posMatch[1], 10);
    const upToIndex = input.slice(0, index);
    const lines = upToIndex.split('\n');
    line = lines.length;
    column = lines[lines.length - 1].length + 1;
  }

  // Look for "line X column Y" in SpiderMonkey / JSC
  const lineColMatch = errMsg.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  if (lineColMatch) {
    line = parseInt(lineColMatch[1], 10);
    column = parseInt(lineColMatch[2], 10);
  }

  if (line <= allLines.length) {
    const startLine = Math.max(0, line - 2);
    const endLine = Math.min(allLines.length, line + 1);
    const snippetLines = [];

    for (let l = startLine; l < endLine; l++) {
      const lineNumStr = String(l + 1).padStart(4, ' ');
      const prefix = l + 1 === line ? '> ' : '  ';
      snippetLines.push(`${prefix}${lineNumStr} | ${allLines[l]}`);
      if (l + 1 === line) {
        const padding = ' '.repeat(7 + Math.max(0, column - 1));
        snippetLines.push(`${padding}^-- Error here`);
      }
    }
    snippet = snippetLines.join('\n');
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
        <span class="tree-key font-mono" data-path="${escapeHTML(childPath)}" title="Click to copy path: ${escapeHTML(childPath)}">
          <span class="key-name">${escapeHTML(key)}</span>:
        </span>
        <div class="tree-node-content">${childTree}</div>
      </div>
    `;
  });

  return `
    <div class="tree-collapsible open" data-path="${escapeHTML(currentPath)}">
      <span class="tree-toggle-btn" title="Toggle collapse">${getIcon('chevronDown', 'icon-xs')}</span>
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
 * JWT Decoder (Claims & Algorithm inspector), Hash Generator (Web Crypto + HMAC + MD5/CRC32), and Multi-Standard ID Generator.
 */



// --- 1. JWT Decoder ---
const JWT_ALG_DESCRIPTIONS = {
  HS256: 'HMAC using SHA-256 hash algorithm (Symmetric)',
  HS384: 'HMAC using SHA-384 hash algorithm (Symmetric)',
  HS512: 'HMAC using SHA-512 hash algorithm (Symmetric)',
  RS256: 'RSASSA-PKCS1-v1_5 using SHA-256 (Asymmetric)',
  RS384: 'RSASSA-PKCS1-v1_5 using SHA-384 (Asymmetric)',
  RS512: 'RSASSA-PKCS1-v1_5 using SHA-512 (Asymmetric)',
  ES256: 'ECDSA using P-256 curve and SHA-256 (Asymmetric)',
  ES384: 'ECDSA using P-384 curve and SHA-384 (Asymmetric)',
  ES512: 'ECDSA using P-521 curve and SHA-512 (Asymmetric)',
  EdDSA: 'Edwards-curve Digital Signature (Ed25519)',
  none: 'Unsecured JWT (No cryptographic signature)'
};

function decodeJWT(token) {
  if (!token || !token.trim()) {
    return { success: false, error: 'Please enter a JWT token string' };
  }

  try {
    const parts = token.trim().split('.');
    if (parts.length < 2 || parts.length > 3) {
      return { success: false, error: 'Invalid JWT structure: Token must contain 2 or 3 dot-separated Base64URL segments' };
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
      const diffSec = Math.abs(Math.round((expDate.getTime() - Date.now()) / 1000));
      let durationStr = '';
      if (diffSec < 3600) durationStr = `${Math.floor(diffSec / 60)}m`;
      else if (diffSec < 86400) durationStr = `${Math.floor(diffSec / 3600)}h ${Math.floor((diffSec % 3600) / 60)}m`;
      else durationStr = `${Math.floor(diffSec / 86400)}d`;

      expirationStatus = {
        date: expDate.toISOString(),
        isExpired,
        human: isExpired ? `Expired (${durationStr} ago)` : `Active (Expires in ${durationStr})`,
        fullDate: expDate.toLocaleString()
      };
    }

    let issuedAtStatus = null;
    if (payload.iat) {
      const iatDate = new Date(payload.iat * 1000);
      issuedAtStatus = iatDate.toLocaleString();
    }

    let notBeforeStatus = null;
    if (payload.nbf) {
      const nbfDate = new Date(payload.nbf * 1000);
      notBeforeStatus = nbfDate.toLocaleString();
    }

    const algDesc = JWT_ALG_DESCRIPTIONS[header.alg] || 'Standard cryptographic algorithm';

    return {
      success: true,
      header,
      payload,
      signature,
      algDesc,
      expirationStatus,
      issuedAtStatus,
      notBeforeStatus,
      issuer: payload.iss || null,
      subject: payload.sub || null,
      audience: payload.aud || null,
      rawHeader: JSON.stringify(header, null, 2),
      rawPayload: JSON.stringify(payload, null, 2)
    };
  } catch (err) {
    return { success: false, error: 'Failed to decode JWT: ' + err.message };
  }
}

// --- 2. Hash & Checksum Generator ---
async function generateHashes(input, hmacKey = '', outputFormat = 'hex') {
  if (!input) {
    return { sha256: '', sha384: '', sha512: '', sha1: '', md5: '', crc32: '', byteLength: 0 };
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const byteLength = data.length;

  let sha256 = '';
  let sha384 = '';
  let sha512 = '';
  let sha1 = '';

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    if (hmacKey) {
      const keyData = encoder.encode(hmacKey);
      const key256 = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
      const sig256 = await crypto.subtle.sign('HMAC', key256, data);
      sha256 = formatBuffer(sig256, outputFormat);

      const key384 = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-384' }, false, ['sign']);
      const sig384 = await crypto.subtle.sign('HMAC', key384, data);
      sha384 = formatBuffer(sig384, outputFormat);

      const key512 = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-512' }, false, ['sign']);
      const sig512 = await crypto.subtle.sign('HMAC', key512, data);
      sha512 = formatBuffer(sig512, outputFormat);

      const key1 = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
      const sig1 = await crypto.subtle.sign('HMAC', key1, data);
      sha1 = formatBuffer(sig1, outputFormat);
    } else {
      const buf256 = await crypto.subtle.digest('SHA-256', data);
      sha256 = formatBuffer(buf256, outputFormat);

      const buf384 = await crypto.subtle.digest('SHA-384', data);
      sha384 = formatBuffer(buf384, outputFormat);

      const buf512 = await crypto.subtle.digest('SHA-512', data);
      sha512 = formatBuffer(buf512, outputFormat);

      const buf1 = await crypto.subtle.digest('SHA-1', data);
      sha1 = formatBuffer(buf1, outputFormat);
    }
  }

  let md5 = computeMD5(input);
  let crc32 = computeCRC32(input);

  if (outputFormat === 'base64') {
    md5 = hexToBase64(md5);
  }

  return { sha256, sha384, sha512, sha1, md5, crc32, byteLength };
}

function formatBuffer(buffer, format = 'hex') {
  const bytes = new Uint8Array(buffer);
  if (format === 'base64') {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToBase64(hexStr) {
  let binary = '';
  for (let i = 0; i < hexStr.length; i += 2) {
    binary += String.fromCharCode(parseInt(hexStr.substr(i, 2), 16));
  }
  return btoa(binary);
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
function generateUUID(version = 'v4', prefix = '') {
  let id = '';

  if (version === 'v4') {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      id = crypto.randomUUID();
    } else {
      id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
  } else if (version === 'ulid') {
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
    id = timeStr + randStr;
  } else if (version === 'v7') {
    const now = Date.now().toString(16).padStart(12, '0');
    const rand = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    id = `${now.slice(0, 8)}-${now.slice(8, 12)}-7${rand.slice(0, 3)}-8${rand.slice(3, 6)}-${rand.slice(6, 18)}`;
  } else if (version === 'nanoid') {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
    id = Array.from({ length: 21 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  } else {
    id = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  }

  return prefix ? `${prefix}${id}` : id;
}

function generateBulkUUIDs(count = 10, options = {}) {
  const { version = 'v4', uppercase = false, hyphens = true, format = 'list', prefix = '' } = options;
  const list = [];
  for (let i = 0; i < count; i++) {
    let id = generateUUID(version, prefix);
    if (!hyphens && version !== 'nanoid' && version !== 'ulid') id = id.replace(/-/g, '');
    if (uppercase) id = id.toUpperCase();
    else if (!prefix && version !== 'ulid') id = id.toLowerCase();
    list.push(id);
  }

  if (format === 'json') {
    return JSON.stringify(list, null, 2);
  }
  if (format === 'csv') {
    return list.join(', ');
  }
  if (format === 'sql') {
    return `IN ('${list.join("', '")}')`;
  }
  return list.join('\n');
}


/* --- MODULE: js/tools/text-tools.js --- */


// --- Common Built-in Regex Presets ---
const REGEX_PRESETS = [
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
function testRegex(patternStr, flagsStr, testString, replaceStr = '') {
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
function computeTextDiff(originalText, modifiedText, options = {}) {
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


/* --- MODULE: js/tools/network-tools.js --- */
/**
 * DevBench - Network & API Tools Engine
 * URL Parser & Live Query Inspector, and HTTP Request Builder / Simulator with code generators.
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
    return { isValid: false, error: 'Invalid URL format: ' + err.message };
  }
}

function rebuildURL(parsedData, queryParams = []) {
  try {
    const portPart = parsedData.port && !['80', '443', ''].includes(String(parsedData.port)) ? ':' + parsedData.port : '';
    let base = `${parsedData.protocol}//${parsedData.hostname}${portPart}${parsedData.pathname || '/'}`;
    if (queryParams.length > 0) {
      const sp = new URLSearchParams();
      queryParams.forEach(p => {
        if (p && p.key && p.key.trim()) sp.append(p.key.trim(), p.value || '');
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
  mockLatency = 120
}) {
  if (!url || !url.trim()) {
    return { success: false, error: 'Request URL cannot be empty' };
  }

  const startTime = performance.now();

  // Simulated Offline Mode
  if (isSimulated) {
    await new Promise(r => setTimeout(r, Math.max(30, mockLatency)));
    const duration = Math.round(performance.now() - startTime);

    const mockResponses = {
      200: {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json; charset=utf-8', 'x-simulated-by': 'DevBench Workstation', 'x-ratelimit-remaining': '4980' },
        body: JSON.stringify({
          status: 'success',
          statusCode: 200,
          method: method.toUpperCase(),
          endpoint: url,
          timestamp: new Date().toISOString(),
          data: {
            serviceId: 'srv_auth_prod_01',
            healthy: true,
            cluster: 'us-west-2a',
            metrics: { activeConnections: 1420, p99LatencyMs: 14.8 }
          }
        }, null, 2)
      },
      201: {
        status: 201,
        statusText: 'Created',
        headers: { 'content-type': 'application/json; charset=utf-8', 'location': `${url}/res_${Date.now()}` },
        body: JSON.stringify({
          status: 'created',
          id: 'res_' + Math.random().toString(36).substr(2, 9),
          acknowledged: true,
          createdAt: new Date().toISOString()
        }, null, 2)
      },
      204: {
        status: 204,
        statusText: 'No Content',
        headers: { 'x-action': 'deleted' },
        body: ''
      },
      400: {
        status: 400,
        statusText: 'Bad Request',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          error: 'BAD_REQUEST',
          message: 'The server could not understand the request due to invalid syntax or missing required fields.',
          timestamp: new Date().toISOString()
        }, null, 2)
      },
      401: {
        status: 401,
        statusText: 'Unauthorized',
        headers: { 'www-authenticate': 'Bearer realm="api.enterprise.dev"' },
        body: JSON.stringify({
          error: 'UNAUTHORIZED',
          message: 'Missing or expired Bearer token authorization header.'
        }, null, 2)
      },
      404: {
        status: 404,
        statusText: 'Not Found',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          error: 'NOT_FOUND',
          message: `Resource endpoint '${url}' was not found on this server.`
        }, null, 2)
      },
      500: {
        status: 500,
        statusText: 'Internal Server Error',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          error: 'INTERNAL_SERVER_FAULT',
          message: 'An unexpected fault occurred during request handling.',
          traceId: 'trc_' + Math.random().toString(36).substr(2, 10)
        }, null, 2)
      }
    };

    const resp = mockResponses[mockStatus] || mockResponses[200];
    return {
      success: true,
      status: resp.status,
      statusText: resp.statusText,
      headers: resp.headers,
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

    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && body) {
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
      error: `Network Error: ${err.message}. If this request is calling an external domain, the remote endpoint must include the header 'Access-Control-Allow-Origin: *'. You can check 'Offline Simulated Mock Mode' above to test simulated responses.`,
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

function generateFetchSnippet({ method = 'GET', url = '', headers = {}, body = '' }) {
  const options = {
    method: method.toUpperCase(),
    headers: headers
  };
  if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && body) {
    try {
      options.body = JSON.parse(body);
    } catch (e) {
      options.body = body;
    }
  }

  return `const response = await fetch("${url}", ${JSON.stringify(options, null, 2)});
const data = await response.json();
console.log(data);`;
}


/* --- MODULE: js/tools/conversion-tools.js --- */
/**
 * DevBench - Conversion & Generation Tools Engine
 * Timestamp Converter, Color Converter & Palette Inspector, and Multi-Industry Mock Data Generator.
 */

// --- 1. Timestamp Converter ---
function convertTimestamp(input) {
  let date;
  if (!input || input.trim() === 'now') {
    date = new Date();
  } else {
    const trimmed = input.trim();
    // Handle hex timestamp (e.g. 0x66CDC800)
    if (/^0x[0-9a-fA-F]+$/i.test(trimmed)) {
      const num = parseInt(trimmed, 16);
      date = num < 10000000000 ? new Date(num * 1000) : new Date(num);
    } else if (/^\d+$/.test(trimmed)) {
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
  const unixHex = '0x' + unixSeconds.toString(16).toUpperCase();
  const iso = date.toISOString();
  const utc = date.toUTCString();
  const local = date.toString();
  const relative = getRelativeTimeString(date);

  // Day of year calculation
  const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000) + 1;
  const isLeapYear = (date.getFullYear() % 4 === 0 && date.getFullYear() % 100 !== 0) || (date.getFullYear() % 400 === 0);

  return {
    isValid: true,
    unixSeconds,
    unixMillis,
    unixHex,
    iso,
    utc,
    local,
    relative,
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    dayOfYear,
    isLeapYear,
    timezoneOffset: date.getTimezoneOffset()
  };
}

function getRelativeTimeString(date) {
  const diffSec = Math.round((date.getTime() - Date.now()) / 1000);
  const isPast = diffSec < 0;
  const abs = Math.abs(diffSec);

  if (abs < 10) return 'just now';
  if (abs < 60) return isPast ? `${abs} seconds ago` : `in ${abs} seconds`;
  if (abs < 3600) {
    const mins = Math.floor(abs / 60);
    return isPast ? `${mins} minute${mins === 1 ? '' : 's'} ago` : `in ${mins} minute${mins === 1 ? '' : 's'}`;
  }
  if (abs < 86400) {
    const hrs = Math.floor(abs / 3600);
    return isPast ? `${hrs} hour${hrs === 1 ? '' : 's'} ago` : `in ${hrs} hour${hrs === 1 ? '' : 's'}`;
  }
  const days = Math.floor(abs / 86400);
  return isPast ? `${days} day${days === 1 ? '' : 's'} ago` : `in ${days} day${days === 1 ? '' : 's'}`;
}

// --- 2. Color Converter & Palette Inspector ---
const CSS_NAMED_COLORS = {
  black: '#000000', white: '#FFFFFF', red: '#FF0000', green: '#008000', blue: '#0000FF',
  yellow: '#FFFF00', cyan: '#00FFFF', magenta: '#FF00FF', gray: '#808080', grey: '#808080',
  indigo: '#4B0082', violet: '#EE82EE', purple: '#800080', orange: '#FFA500', pink: '#FFC0CB',
  crimson: '#DC143C', teal: '#008080', slateblue: '#6A5ACD', royalblue: '#4169E1',
  cornflowerblue: '#6495ED', dodgerblue: '#1E90FF', gold: '#FFD700', tomato: '#FF6347'
};

function parseAndConvertColor(colorStr) {
  let r = 59, g = 130, b = 246, a = 1;
  let cleanInput = (colorStr || '#3B82F6').trim().toLowerCase();

  // Named color lookup
  if (CSS_NAMED_COLORS[cleanInput]) {
    cleanInput = CSS_NAMED_COLORS[cleanInput];
  }

  if (cleanInput.startsWith('#')) {
    let clean = cleanInput.slice(1);
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    } else if (clean.length === 4) {
      clean = clean.slice(0, 3).split('').map(c => c + c).join('');
    } else if (clean.length === 8) {
      a = Math.round((parseInt(clean.slice(6, 8), 16) / 255) * 100) / 100;
      clean = clean.slice(0, 6);
    }
    if (clean.length === 6) {
      r = parseInt(clean.slice(0, 2), 16) || 0;
      g = parseInt(clean.slice(2, 4), 16) || 0;
      b = parseInt(clean.slice(4, 6), 16) || 0;
    }
  } else if (cleanInput.startsWith('rgb')) {
    const match = cleanInput.match(/\d+(\.\d+)?/g);
    if (match && match.length >= 3) {
      r = Math.min(255, Math.max(0, parseInt(match[0], 10)));
      g = Math.min(255, Math.max(0, parseInt(match[1], 10)));
      b = Math.min(255, Math.max(0, parseInt(match[2], 10)));
      if (match[3]) a = Math.min(1, Math.max(0, parseFloat(match[3])));
    }
  } else if (cleanInput.startsWith('hsl')) {
    const match = cleanInput.match(/\d+(\.\d+)?/g);
    if (match && match.length >= 3) {
      const rgb = hslToRgb(parseFloat(match[0]), parseFloat(match[1]), parseFloat(match[2]));
      r = rgb.r; g = rgb.g; b = rgb.b;
      if (match[3]) a = Math.min(1, Math.max(0, parseFloat(match[3])));
    }
  }

  const hex = rgbToHex(r, g, b);
  const hsl = rgbToHsl(r, g, b);
  const hsv = rgbToHsv(r, g, b);
  const cmyk = rgbToCmyk(r, g, b);

  // Relative luminance calculation for WCAG 2.1 contrast formula
  const getLuminance = (cr, cg, cb) => {
    const a = [cr, cg, cb].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const lum = getLuminance(r, g, b);
  const lumWhite = getLuminance(255, 255, 255);
  const lumBlack = getLuminance(0, 0, 0);

  const contrastWhite = Number(((Math.max(lum, lumWhite) + 0.05) / (Math.min(lum, lumWhite) + 0.05)).toFixed(2));
  const contrastBlack = Number(((Math.max(lum, lumBlack) + 0.05) / (Math.min(lum, lumBlack) + 0.05)).toFixed(2));

  // Harmonies / Palettes
  const complementary = hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l);
  const analogous1 = hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l);
  const analogous2 = hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l);
  const triadic1 = hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l);
  const triadic2 = hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l);

  // Monochromatic shades
  const shadeLight = hslToHex(hsl.h, hsl.s, Math.min(95, hsl.l + 25));
  const shadeDark = hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 25));

  return {
    hex: hex.toUpperCase(),
    rgb: `rgb(${r}, ${g}, ${b})`,
    rgba: `rgba(${r}, ${g}, ${b}, ${a})`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
    cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
    cssVar: `--color-brand: ${hex.toUpperCase()};`,
    contrastWhite,
    contrastBlack,
    wcagWhiteAA: contrastWhite >= 4.5,
    wcagWhiteAAA: contrastWhite >= 7,
    wcagWhiteAALarge: contrastWhite >= 3.0,
    wcagBlackAA: contrastBlack >= 4.5,
    wcagBlackAAA: contrastBlack >= 7,
    wcagBlackAALarge: contrastBlack >= 3.0,
    palette: {
      complementary,
      analogous: [analogous1, analogous2],
      triadic: [triadic1, triadic2],
      shades: [shadeLight, hex, shadeDark]
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
  'system', 'latency', 'cluster', 'deployment', 'endpoint', 'payload', 'schema', 'pipeline', 'service',
  'gateway', 'ingress', 'container', 'orchestration', 'telemetry', 'distributed', 'consensus', 'microservice',
  'throughput', 'resilience', 'cache', 'encryption', 'asynchronous', 'stream', 'benchmark', 'workstation',
  'developer', 'runtime', 'interface', 'protocol', 'request', 'response', 'authorization', 'signature',
  'immutable', 'concurrency', 'transaction', 'replication', 'observability', 'metrics', 'validation'
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
      const len = 8 + (i % 6);
      const sWords = [];
      for (let j = 0; j < len; j++) {
        sWords.push(LOREM_WORDS[(i * 7 + j) % LOREM_WORDS.length]);
      }
      const s = sWords.join(' ');
      sentences.push(s.charAt(0).toUpperCase() + s.slice(1) + '.');
    }
    return sentences.join(' ');
  }

  // Paragraphs
  const paragraphs = [];
  for (let p = 0; p < safeCount; p++) {
    const numSentences = 4 + (p % 3);
    const pSentences = [];
    for (let s = 0; s < numSentences; s++) {
      const len = 7 + ((p + s) % 6);
      const words = [];
      for (let w = 0; w < len; w++) {
        words.push(LOREM_WORDS[(p * 11 + s * 5 + w) % LOREM_WORDS.length]);
      }
      const sent = words.join(' ');
      pSentences.push(sent.charAt(0).toUpperCase() + sent.slice(1) + '.');
    }
    paragraphs.push(pSentences.join(' '));
  }

  return paragraphs.join('\n\n');
}

function generateMockUsers(count = 5) {
  const firstNames = ['Marcus', 'Elena', 'Devon', 'Aria', 'Julian', 'Siddharth', 'Chloe', 'Zane', 'Nadia', 'Kiran'];
  const lastNames = ['Sterling', 'Vance', 'Chen', 'Alvarez', 'Novak', 'Patel', 'Lindqvist', 'Nakamura', 'O\'Connor', 'Dubois'];
  const roles = ['Principal Cloud Architect', 'Senior Staff SRE', 'Lead Security Engineer', 'Staff Systems Designer', 'Frontend Platform Lead'];
  const depts = ['Infrastructure & Core', 'Platform Security', 'Data Platform', 'Developer Productivity', 'Product Engineering'];
  const cities = ['San Francisco, CA', 'Stockholm, Sweden', 'Tokyo, Japan', 'Berlin, Germany', 'London, UK', 'Austin, TX'];

  const users = [];
  for (let i = 0; i < count; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    const email = `${fn.toLowerCase()}.${ln.toLowerCase().replace(/[^a-z]/g, '')}@enterprise.dev`;
    users.push({
      id: `usr_${(1000 + i).toString(16)}`,
      name: `${fn} ${ln}`,
      email,
      role: roles[i % roles.length],
      department: depts[i % depts.length],
      location: cities[i % cities.length],
      twoFactorEnabled: i % 3 !== 0,
      activeSessions: (i % 4) + 1,
      createdAt: new Date(Date.now() - (i + 1) * 86400000 * 24).toISOString()
    });
  }
  return JSON.stringify(users, null, 2);
}

function generateMockOrders(count = 5) {
  const products = [
    { sku: 'SRV-COMPUTE-L', name: 'High-Mem Compute Node 64GB', price: 149.00 },
    { sku: 'STOR-NVME-1T', name: 'Ultra-Fast NVMe SSD Block (1TB)', price: 89.00 },
    { sku: 'NET-LB-DEDIC', name: 'Dedicated Edge Load Balancer', price: 45.00 },
    { sku: 'SEC-WAF-PRO', name: 'Managed Web Application Firewall', price: 120.00 },
    { sku: 'DB-REDIS-CLUS', name: 'Managed In-Memory Redis Cluster', price: 95.00 }
  ];
  const statuses = ['fulfilled', 'processing', 'provisioned', 'active'];

  const orders = [];
  for (let i = 0; i < count; i++) {
    const prod = products[i % products.length];
    const qty = (i % 3) + 1;
    const subtotal = Number((prod.price * qty).toFixed(2));
    const tax = Number((subtotal * 0.0825).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    orders.push({
      orderId: `ord_${10920 + i}`,
      customer: `Acme Cloud Tenant #${100 + i}`,
      items: [
        { sku: prod.sku, description: prod.name, unitPrice: prod.price, quantity: qty, itemTotal: subtotal }
      ],
      pricing: { subtotal, tax, total, currency: 'USD' },
      fulfillmentStatus: statuses[i % statuses.length],
      paymentMethod: 'stripe_corporate_card',
      issuedAt: new Date(Date.now() - i * 3600000 * 8).toISOString()
    });
  }
  return JSON.stringify(orders, null, 2);
}

function generateMockLogs(count = 5) {
  const ips = ['192.0.2.45', '198.51.100.12', '203.0.113.88', '192.168.1.104', '10.0.4.19'];
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  const paths = ['/api/v2/auth/token', '/v1/deployments/cluster-prod', '/healthz', '/v1/billing/invoices/latest', '/api/v2/metrics'];
  const statuses = [200, 201, 204, 400, 401, 404, 500];

  const logs = [];
  for (let i = 0; i < count; i++) {
    const ip = ips[i % ips.length];
    const method = methods[i % methods.length];
    const path = paths[i % paths.length];
    const status = statuses[i % statuses.length];
    const bytes = 420 + ((i * 187) % 3400);
    const latency = 12 + ((i * 37) % 240);
    const dateStr = new Date(Date.now() - i * 60000 * 4).toISOString();
    logs.push(`${ip} - - [${dateStr}] "${method} ${path} HTTP/1.1" ${status} ${bytes} "${latency}ms" "DevBench-Workstation/1.0"`);
  }
  return logs.join('\n');
}

function generateMockKubernetes(count = 5) {
  const pods = [];
  const namespaces = ['production', 'staging', 'telemetry', 'ingress-system'];
  const services = ['auth-service', 'billing-processor', 'api-gateway', 'worker-queue', 'redis-sentinel'];

  for (let i = 0; i < count; i++) {
    const svc = services[i % services.length];
    const ns = namespaces[i % namespaces.length];
    pods.push({
      podName: `${svc}-${Math.random().toString(36).substr(2, 6)}-${Math.random().toString(36).substr(2, 4)}`,
      namespace: ns,
      status: i % 5 === 4 ? 'Pending' : 'Running',
      readyContainers: '1/1',
      restarts: i % 4 === 0 ? 1 : 0,
      cpuMillicores: 120 + ((i * 45) % 400),
      memoryMB: 384 + ((i * 96) % 1024),
      node: `k8s-node-worker-0${(i % 3) + 1}`,
      startedAt: new Date(Date.now() - (i + 1) * 3600000 * 18).toISOString()
    });
  }
  return JSON.stringify(pods, null, 2);
}


/* --- MODULE: js/tool-registry.js --- */
/**
 * DevBench - Tool Registry & UI View Renderer
 * Defines metadata, options, realistic presets, and interactive UI for all 20 developer utilities.
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
    presets: [
      {
        name: 'Microservice Config',
        value: JSON.stringify({
          service: 'auth-gateway-v2',
          cluster: 'us-east-prod',
          port: 8443,
          tls: { enabled: true, minVersion: 'TLSv1.3' },
          rateLimiting: { maxRequestsPerMin: 1200, burst: 50 },
          redis: { host: 'redis-sentinel.internal', port: 6379, poolSize: 20 },
          features: { mfaRequired: true, passkeys: true, legacyAuth: false },
          metadata: { version: '2.4.0', deployedAt: '2026-08-28T00:00:00Z', nullFlag: null }
        }, null, 2)
      },
      {
        name: 'Stripe Webhook Event',
        value: JSON.stringify({
          id: 'evt_1O8x722eZvKYlo2CLp99',
          object: 'event',
          api_version: '2024-06-20',
          created: 1724800000,
          type: 'invoice.payment_succeeded',
          data: {
            object: {
              id: 'in_1O8x722eZvKYlo2C8892',
              customer: 'cus_Q89214710',
              amount_paid: 14900,
              currency: 'usd',
              status: 'paid'
            }
          }
        }, null, 2)
      },
      {
        name: 'GeoJSON Feature',
        value: JSON.stringify({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: { type: 'Point', coordinates: [-122.4194, 37.7749] },
              properties: { name: 'San Francisco Datacenter DC-1', region: 'us-west-1', active: true }
            }
          ]
        }, null, 2)
      }
    ],
    sample: JSON.stringify({
      service: 'auth-gateway-v2',
      cluster: 'us-east-prod',
      port: 8443,
      tls: { enabled: true, minVersion: 'TLSv1.3' },
      rateLimiting: { maxRequestsPerMin: 1200, burst: 50 },
      redis: { host: 'redis-sentinel.internal', port: 6379, poolSize: 20 },
      features: { mfaRequired: true, passkeys: true, legacyAuth: false },
      metadata: { version: '2.4.0', deployedAt: '2026-08-28T00:00:00Z', nullFlag: null }
    }, null, 2),
    render: renderJSONFormatter
  },

  // 2. JSON Validator
  {
    id: 'json-validator',
    title: 'JSON Validator',
    category: TOOL_CATEGORIES.JSON_DATA,
    icon: 'json',
    desc: 'Syntax validation with exact line/column indicators and error pointers',
    presets: [
      {
        name: 'Valid Payload',
        value: JSON.stringify({
          event: 'deployment.success',
          commit: '7b566580c0814ba2',
          author: 'Alex Vance <alex.vance@enterprise.dev>',
          environment: 'production',
          containers: ['auth-svc', 'billing-processor', 'worker-queue'],
          replicas: 6
        }, null, 2)
      },
      {
        name: 'Error: Trailing Comma',
        value: '{\n  "service": "auth-api",\n  "port": 8080,\n  "endpoints": [\n    "/login",\n    "/signup",\n  ]\n}'
      },
      {
        name: 'Error: Unquoted Key',
        value: '{\n  name: "DevBench",\n  "version": 1.0\n}'
      },
      {
        name: 'Error: Single Quotes',
        value: "{\n  'auth': 'bearer-token',\n  'active': true\n}"
      }
    ],
    sample: '{\n  "service": "auth-api",\n  "port": 8080,\n  "endpoints": [\n    "/login",\n    "/signup",\n  ]\n}',
    render: renderJSONValidator
  },

  // 3. JSON Tree Viewer
  {
    id: 'json-tree',
    title: 'JSON Tree Viewer',
    category: TOOL_CATEGORIES.JSON_DATA,
    icon: 'tree',
    desc: 'Interactive collapsible AST tree with type chips, node search, and path copy',
    presets: [
      {
        name: 'Kubernetes Pod Spec',
        value: JSON.stringify({
          apiVersion: 'v1',
          kind: 'Pod',
          metadata: {
            name: 'auth-gateway-78f99c-w2x8q',
            namespace: 'production',
            labels: { app: 'auth-gateway', tier: 'api' }
          },
          spec: {
            containers: [
              {
                name: 'gateway',
                image: 'registry.enterprise.dev/auth/gateway:v2.4.0',
                ports: [{ containerPort: 8443, protocol: 'TCP' }],
                resources: { limits: { cpu: '1000m', memory: '512Mi' }, requests: { cpu: '250m', memory: '128Mi' } }
              }
            ],
            restartPolicy: 'Always'
          }
        }, null, 2)
      },
      {
        name: 'User Claims & Roles',
        value: JSON.stringify({
          user: {
            id: 'usr_89214',
            profile: {
              name: 'Elena Rostova',
              title: 'Principal Cloud Architect',
              department: 'Infrastructure & Security',
              roles: ['admin', 'security-auditor', 'billing-manager'],
              mfa: { hardwareToken: true, passkeysCount: 2 }
            },
            teams: ['core-infra', 'incident-response'],
            activeSessions: 3
          }
        }, null, 2)
      }
    ],
    sample: JSON.stringify({
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        name: 'auth-gateway-78f99c-w2x8q',
        namespace: 'production',
        labels: { app: 'auth-gateway', tier: 'api' }
      },
      spec: {
        containers: [
          {
            name: 'gateway',
            image: 'registry.enterprise.dev/auth/gateway:v2.4.0',
            ports: [{ containerPort: 8443, protocol: 'TCP' }],
            resources: { limits: { cpu: '1000m', memory: '512Mi' }, requests: { cpu: '250m', memory: '128Mi' } }
          }
        ],
        restartPolicy: 'Always'
      }
    }, null, 2),
    render: renderJSONTreeViewer
  },

  // 4. Base64 Encoder/Decoder
  {
    id: 'base64',
    title: 'Base64 Encode/Decode',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'base64',
    desc: 'UTF-8 safe Base64 encoder, decoder, URL-safe mode, and file data URLs',
    presets: [
      {
        name: 'Basic Auth Header',
        value: 'api_client_id:sec_k98234jhl23k4jhk234j5h2345'
      },
      {
        name: 'UTF-8 & Symbols',
        value: 'DevBench ⚡ Developer Workstation — High-throughput telemetry & UTF-8 symbols (こんにちは / Привет / 🚀)'
      },
      {
        name: 'JSON Config String',
        value: '{"env":"production","apiRateLimit":5000,"sslVerify":true}'
      }
    ],
    sample: 'DevBench ⚡ Developer Workstation — High-throughput telemetry & UTF-8 symbols (こんにちは / Привет / 🚀)',
    render: renderBase64
  },

  // 5. URL Encoder/Decoder
  {
    id: 'url-encode',
    title: 'URL Encode/Decode',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'url',
    desc: 'Encode and decode query strings, form data, and URI components',
    presets: [
      {
        name: 'OAuth2 Authorize Request',
        value: 'https://auth.acme-cloud.io/oauth/v2/authorize?client_id=devbench_app&response_type=code&scope=openid profile email repo:read&redirect_uri=https://devbench.local/callback&state=sec_98124&code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM'
      },
      {
        name: 'Search Filter Query',
        value: 'query=developer workstation & utilities&tags=json,jwt,diff,regex&sort=created_at desc&limit=50'
      }
    ],
    sample: 'https://auth.acme-cloud.io/oauth/v2/authorize?client_id=devbench_app&response_type=code&scope=openid profile email repo:read&redirect_uri=https://devbench.local/callback&state=sec_98124&code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
    render: renderURLEncode
  },

  // 6. JWT Decoder
  {
    id: 'jwt-decoder',
    title: 'JWT Decoder',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'jwt',
    desc: 'Decode JSON Web Token header, payload claims, and expiration timestamps',
    presets: [
      {
        name: 'Admin Access Token (Valid)',
        value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2F1dGguZXJhc3Rlcmlzay5kZXYiLCJzdWIiOiJ1c3JfODkyMTQiLCJhdWQiOlsiYXBpLmVudGVycHJpc2UuZGV2Il0sIm5hbWUiOiJFbGVuYSBSb3N0b3ZhIiwicm9sZXMiOlsicGxhdGZvcm0tYWRtaW4iLCJiaWxsaW5nLW1hbmFnZXIiXSwiaWF0IjoxNzI0ODAwMDAwLCJleHAiOjE3ODc4NzIwMDB9.d7c1Kpw8s4x-9Yf3QJ8nO2_vK7b38Vz2m9X1'
      },
      {
        name: 'Service Account Token',
        value: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImF1dGgta2V5LTIwMjYifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJzdWIiOiJzZXJ2aWNlLWFjY291bnRAcHJvamVjdC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsImF1ZCI6Imh0dHBzOi8vYXBpLmdvb2dsZWFwaXMuY29tL29hdXRoMi92NC90b2tlbiIsImlhdCI6MTcyNDgwMDAwMCwiZXhwIjoxNzg3ODcyMDAwfQ.dummy'
      },
      {
        name: 'Expired Session Token',
        value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMTAwMSIsIm5hbWUiOiJNYXJjdXMgVmFuY2UiLCJyb2xlIjoiZGV2ZWxvcGVyIiwiaWF0IjoxNTAwMDAwMDAwLCJleHAiOjE1MDAwMDM2MDB9.dummy'
      }
    ],
    sample: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2F1dGguZXJhc3Rlcmlzay5kZXYiLCJzdWIiOiJ1c3JfODkyMTQiLCJhdWQiOlsiYXBpLmVudGVycHJpc2UuZGV2Il0sIm5hbWUiOiJFbGVuYSBSb3N0b3ZhIiwicm9sZXMiOlsicGxhdGZvcm0tYWRtaW4iLCJiaWxsaW5nLW1hbmFnZXIiXSwiaWF0IjoxNzI0ODAwMDAwLCJleHAiOjE3ODc4NzIwMDB9.d7c1Kpw8s4x-9Yf3QJ8nO2_vK7b38Vz2m9X1',
    render: renderJWTDecoder
  },

  // 7. UUID / ID Generator
  {
    id: 'uuid-gen',
    title: 'UUID / ID Generator',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'uuid',
    desc: 'Generate UUID v4, v7 draft, ULID, NanoID, and bulk identifier lists',
    presets: [],
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
    presets: [
      { name: 'Current Time (Now)', value: 'now' },
      { name: 'Start of Today (00:00 UTC)', value: new Date(new Date().setUTCHours(0,0,0,0)).toISOString() },
      { name: 'Year 2038 Bug Boundary', value: '2147483647' },
      { name: 'Unix Epoch 1.8 Billion', value: '1800000000' }
    ],
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
    presets: REGEX_PRESETS,
    sample: 'Contact security@enterprise.dev or operations.lead@cloud-infra.io for escalation.',
    render: renderRegexTester
  },

  // 10. Text Diff Viewer
  {
    id: 'text-diff',
    title: 'Text Diff Viewer',
    category: TOOL_CATEGORIES.TEXT_CODE,
    icon: 'diff',
    desc: 'Line-by-line comparison highlighting additions, deletions, and modifications',
    presets: [
      {
        name: 'TypeScript Service Refactor',
        orig: `class BillingService {
  async processPayment(customerId: string, amount: number) {
    const customer = await db.customers.findById(customerId);
    if (!customer) throw new Error('Customer not found');
    const result = await stripe.charges.create({
      amount,
      currency: 'usd',
      customer: customer.stripeId
    });
    return result;
  }
}`,
        mod: `class BillingService {
  async processPayment(customerId: string, amount: number, idempotencyKey?: string) {
    const customer = await db.customers.findById(customerId);
    if (!customer || !customer.isActive) {
      throw new Error('Customer not eligible for billing');
    }
    const result = await stripe.charges.create({
      amount,
      currency: 'usd',
      customer: customer.stripeId
    }, { idempotencyKey });
    await telemetry.recordTransaction(customerId, amount);
    return result;
  }
}`
      },
      {
        name: 'Docker Multi-Stage Optimization',
        orig: `FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]`,
        mod: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./
USER node
CMD ["node", "server.js"]`
      }
    ],
    sample: `class BillingService {
  async processPayment(customerId: string, amount: number) {
    const customer = await db.customers.findById(customerId);
    if (!customer) throw new Error('Customer not found');
    const result = await stripe.charges.create({
      amount,
      currency: 'usd',
      customer: customer.stripeId
    });
    return result;
  }
}`,
    sampleModified: `class BillingService {
  async processPayment(customerId: string, amount: number, idempotencyKey?: string) {
    const customer = await db.customers.findById(customerId);
    if (!customer || !customer.isActive) {
      throw new Error('Customer not eligible for billing');
    }
    const result = await stripe.charges.create({
      amount,
      currency: 'usd',
      customer: customer.stripeId
    }, { idempotencyKey });
    await telemetry.recordTransaction(customerId, amount);
    return result;
  }
}`,
    render: renderTextDiff
  },

  // 11. Hash Generator
  {
    id: 'hash-gen',
    title: 'Hash Generator',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'hash',
    desc: 'Web Crypto SHA-256, SHA-384, SHA-512, SHA-1, MD5, CRC32, and HMAC checksums',
    presets: [
      { name: 'API Key Payload', value: 'sk_live_51O8x722eZvKYlo2CLp99824_sec_991823' },
      { name: 'Passphrase Verification', value: 'Correct-Horse-Battery-Staple-2026!' },
      { name: 'Git Tree Header', value: 'tree 138\x00100644 blob 7b566580c0814ba2910a README.md' }
    ],
    sample: 'sk_live_51O8x722eZvKYlo2CLp99824_sec_991823',
    render: renderHashGenerator
  },

  // 12. Color Converter & Palette
  {
    id: 'color-converter',
    title: 'Color & Contrast Inspector',
    category: TOOL_CATEGORIES.CONVERTERS,
    icon: 'color',
    desc: 'Convert HEX, RGB, HSL, HSV, CMYK and check WCAG contrast compliance',
    presets: [
      { name: 'Brand Primary Blue', value: '#3B82F6' },
      { name: 'Emerald Success', value: '#10B981' },
      { name: 'Amber Warning', value: '#F59E0B' },
      { name: 'Rose Error', value: '#EF4444' },
      { name: 'Indigo Accent', value: '#6366F1' },
      { name: 'Slate Dark Neutral', value: '#0F172A' }
    ],
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
    presets: [
      { name: 'XSS Attack Mitigation Sample', value: '<script>alert("XSS & CSRF Attack Detected");</script><img src="x" onerror="stealCookies()">' },
      { name: 'HTML5 Template Tags', value: '<article class="post-card" data-author="Alex & Sarah">\n  <h2>Developer Workstation &trade;</h2>\n  <p>Cost: &euro;499 &bull; Rating: 5/5 &copy; 2026</p>\n</article>' }
    ],
    sample: '<script>alert("XSS & CSRF Attack Detected");</script><img src="x" onerror="stealCookies()">',
    render: renderHTMLEntities
  },

  // 14. URL Parser
  {
    id: 'url-parser',
    title: 'URL & Query Parser',
    category: TOOL_CATEGORIES.NETWORK_API,
    icon: 'url',
    desc: 'Inspect protocol, host, port, and live two-way query parameters table',
    presets: [
      { name: 'GitHub REST API Pulls', value: 'https://api.github.com:443/repos/devbench/core/pulls?state=open&sort=created&direction=desc&page=1&per_page=30#review-queue' },
      { name: 'Stripe Checkout Session', value: 'https://checkout.stripe.com/pay/cs_live_a1b2c3d4?locale=en-US&client_reference_id=usr_89124&source=dashboard#step-payment' }
    ],
    sample: 'https://api.github.com:443/repos/devbench/core/pulls?state=open&sort=created&direction=desc&page=1&per_page=30#review-queue',
    render: renderURLParser
  },

  // 15. HTTP Request Builder & Simulator
  {
    id: 'http-builder',
    title: 'HTTP Request Builder',
    category: TOOL_CATEGORIES.NETWORK_API,
    icon: 'http',
    desc: 'Construct API requests with custom headers/body, live fetch, simulated offline mock, and cURL export',
    presets: [
      { name: 'GET User Profile Endpoint', method: 'GET', url: 'https://jsonplaceholder.typicode.com/users/1', body: '' },
      { name: 'POST Create Deployment Record', method: 'POST', url: 'https://jsonplaceholder.typicode.com/posts', body: '{\n  "service": "auth-gateway",\n  "environment": "production",\n  "replicas": 4\n}' }
    ],
    sample: 'https://jsonplaceholder.typicode.com/users/1',
    render: renderHTTPBuilder
  },

  // 16. Lorem / Mock Data Generator
  {
    id: 'mock-generator',
    title: 'Lorem & Mock Generator',
    category: TOOL_CATEGORIES.CONVERTERS,
    icon: 'lorem',
    desc: 'Generate Lorem Ipsum copy and structured mock JSON user, order, and telemetry datasets',
    presets: [],
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
    presets: [
      { name: 'Authentication Token Variable', value: 'user_authentication_session_token_v2' },
      { name: 'Billing Calculation Method', value: 'calculateMonthlySubscriptionCostWithTax' },
      { name: 'Database Connection Constant', value: 'DATABASE_MAX_CONNECTION_POOL_SIZE' }
    ],
    sample: 'user_authentication_session_token_v2',
    render: renderCaseConverter
  },

  // 18. Line Sorter
  {
    id: 'line-sorter',
    title: 'Line Sorter',
    category: TOOL_CATEGORIES.TEXT_CODE,
    icon: 'sort',
    desc: 'Sort text lines alphabetically (A-Z, Z-A), natural numbers, length, or shuffle',
    presets: [
      { name: 'Dependencies List', value: '@aws-sdk/client-s3\n@types/node\naxios\nexpress\nhelmet\nzod\nprisma\nwinston\nredis' },
      { name: 'Unsorted Hostnames & IPs', value: '192.168.1.100\n10.0.4.12\n192.168.1.2\n10.0.1.5\n172.16.0.40\n192.168.1.20' }
    ],
    sample: '@aws-sdk/client-s3\n@types/node\naxios\nexpress\nhelmet\nzod\nprisma\nwinston\nredis',
    render: renderLineSorter
  },

  // 19. Duplicate Line Remover
  {
    id: 'duplicate-remover',
    title: 'Duplicate Line Remover',
    category: TOOL_CATEGORIES.TEXT_CODE,
    icon: 'dedup',
    desc: 'Deduplicate lines with case-sensitive toggle, whitespace trimming, and duplicate counts',
    presets: [
      { name: 'Access Log IP Addresses', value: '192.0.2.45\n198.51.100.12\n192.0.2.45\n203.0.113.88\n198.51.100.12\n10.0.4.19\n192.0.2.45' },
      { name: 'Environment Variables Overrides', value: 'PORT=8080\nNODE_ENV=production\nLOG_LEVEL=info\nPORT=3000\nREDIS_HOST=localhost\nLOG_LEVEL=debug' }
    ],
    sample: '192.0.2.45\n198.51.100.12\n192.0.2.45\n203.0.113.88\n198.51.100.12\n10.0.4.19\n192.0.2.45',
    render: renderDuplicateRemover
  },

  // 20. Whitespace Cleaner
  {
    id: 'whitespace-cleaner',
    title: 'Whitespace Cleaner',
    category: TOOL_CATEGORIES.TEXT_CODE,
    icon: 'clean',
    desc: 'Trim trailing spaces, collapse multiple spaces, tab-to-space, and normalize line endings',
    presets: [
      { name: 'Messy Indented Snippet', value: '   function computeTelemetry(data) {   \n\n\n\tlet sum = 0;   \n\tfor (let i = 0; i < data.length; i++) {   \n\t\tsum += data[i].latency;    \n\t}   \n\n\treturn sum;   \n   }   \n' }
    ],
    sample: '   function computeTelemetry(data) {   \n\n\n\tlet sum = 0;   \n\tfor (let i = 0; i < data.length; i++) {   \n\t\tsum += data[i].latency;    \n\t}   \n\n\treturn sum;   \n   }   \n',
    render: renderWhitespaceCleaner
  }
];

function getToolById(id) {
  return TOOLS.find(t => t.id === id) || TOOLS[0];
}

// --- Common UI Shell Helper ---
function createSplitToolShell({ tool, toolbarHTML = '', showPresets = true }) {
  let presetsHTML = '';
  if (showPresets && tool.presets && tool.presets.length > 0) {
    presetsHTML = `
      <div class="presets-selector-group flex items-center gap-2">
        <label class="opt-label text-xs font-semibold text-muted" for="tool-preset-select">Preset:</label>
        <select id="tool-preset-select" class="form-control form-control-sm" aria-label="Select sample preset">
          ${tool.presets.map((p, idx) => `<option value="${idx}">${escapeHTML(p.name)}</option>`).join('')}
        </select>
      </div>
    `;
  }

  return `
    <div class="tool-workspace" data-tool-id="${tool.id}">
      <!-- Tool Header Bar -->
      <header class="tool-header">
        <div class="tool-title-group">
          <div class="tool-icon-box" aria-hidden="true">${getIcon(tool.icon, 'icon-md')}</div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="tool-title">${tool.title}</h1>
              <span class="badge badge-secondary font-mono text-xs">${tool.category}</span>
            </div>
            <p class="tool-desc">${tool.desc}</p>
          </div>
        </div>
        <div class="tool-header-actions">
          <button class="btn btn-sm btn-ghost btn-fav-toggle" data-id="${tool.id}" title="Toggle Favorite (Pinned in Sidebar)" aria-label="Toggle Favorite">
            ${getIcon('star', 'icon-sm')}
          </button>
          <button class="btn btn-sm btn-ghost btn-open-history" data-id="${tool.id}" title="View Input History" aria-label="View History">
            ${getIcon('history', 'icon-sm')} History
          </button>
          <button class="btn btn-sm btn-ghost btn-save-snippet" data-id="${tool.id}" title="Save as Snippet" aria-label="Save Snippet">
            ${getIcon('bookmark', 'icon-sm')} Snippet
          </button>
        </div>
      </header>

      <!-- Tool Options / Action Bar -->
      <div class="tool-options-bar">
        ${presetsHTML}
        ${toolbarHTML}
      </div>

      <!-- Main Work Area -->
      <div class="tool-main-area" id="tool-main-content"></div>

      <!-- Live Status Bar -->
      <footer class="tool-status-bar">
        <div class="status-item font-mono text-xs" id="status-lines-chars">Lines: 0 &bull; Chars: 0 &bull; Size: 0 B</div>
        <div class="status-item font-mono text-xs flex items-center gap-2">
          <span id="status-timing">Ready</span>
          <span class="badge badge-secondary font-mono text-xs">Offline Safe</span>
        </div>
      </footer>
    </div>
  `;
}

function updateStatusBar(container, text, execTimeMs = null) {
  const str = String(text || '');
  const lines = str ? str.split('\n').length : 0;
  const chars = str ? str.length : 0;
  const bytes = str ? new Blob([str]).size : 0;

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
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function showToast(message, type = 'info') {
  window.dispatchEvent(new CustomEvent('SHOW_TOAST', { detail: { message, type } }));
}

function copyToClipboard(text, btnElement) {
  if (!text) {
    showToast('Nothing to copy', 'warning');
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied ${formatBytes(new Blob([text]).size)} to clipboard`, 'success');
    if (btnElement) {
      const originalHTML = btnElement.innerHTML;
      btnElement.innerHTML = `${getIcon('check', 'icon-xs')} Copied!`;
      btnElement.classList.add('btn-success-flash');
      setTimeout(() => {
        btnElement.innerHTML = originalHTML;
        btnElement.classList.remove('btn-success-flash');
      }, 1600);
    }
  }).catch(() => {
    // Fallback prompt
    showToast('Clipboard access unavailable. Text selected for manual copy.', 'warning');
  });
}

function downloadTextFile(filename, text, mimeType = 'text/plain;charset=utf-8') {
  if (!text) {
    showToast('No content to download', 'warning');
    return;
  }
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Downloaded ${filename}`, 'success');
}

function setupFileDrop(element, onFileContent) {
  if (!element) return;
  element.addEventListener('dragover', (e) => {
    e.preventDefault();
    element.classList.add('drag-over');
  });
  element.addEventListener('dragleave', () => {
    element.classList.remove('drag-over');
  });
  element.addEventListener('drop', (e) => {
    e.preventDefault();
    element.classList.remove('drag-over');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        onFileContent(evt.target.result, file.name);
        showToast(`Loaded ${file.name} (${formatBytes(file.size)})`, 'info');
      };
      reader.readAsText(file);
    }
  });
}

function attachStandardToolbarEvents(container, tool, onPresetChange = null) {
  // Favorite toggle
  container.querySelector('.btn-fav-toggle')?.addEventListener('click', () => {
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

  // Preset selector
  if (onPresetChange) {
    const presetSelect = container.querySelector('#tool-preset-select');
    presetSelect?.addEventListener('change', (e) => {
      const idx = parseInt(e.target.value, 10);
      if (tool.presets && tool.presets[idx]) {
        onPresetChange(tool.presets[idx]);
      }
    });
  }
}

// ==========================================
// 1. JSON FORMATTER
// ==========================================
function renderJSONFormatter(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group flex items-center gap-2">
        <label class="opt-label text-xs font-semibold text-muted" for="json-opt-indent">Indent:</label>
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
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="json-opt-unicode" /> Escape Unicode
        </label>
      </div>
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-primary" id="btn-format-json" title="Format JSON (Ctrl+Enter)">
          ${getIcon('play', 'icon-xs')} Format
        </button>
        <button class="btn btn-sm btn-secondary" id="btn-copy-json" title="Copy Output">
          ${getIcon('copy', 'icon-xs')} Copy
        </button>
        <button class="btn btn-sm btn-secondary" id="btn-download-json" title="Download formatted JSON">
          ${getIcon('download', 'icon-xs')} Download
        </button>
        <button class="btn btn-sm btn-ghost" id="btn-clear-json" title="Clear Editor">
          ${getIcon('trash', 'icon-xs')} Clear
        </button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="split-pane-layout">
      <div class="pane-column">
        <div class="pane-header">
          <span class="pane-title text-xs font-semibold">JSON Input</span>
          <span class="text-xs text-muted font-mono">Drop .json files here</span>
        </div>
        <textarea id="json-input" class="code-editor font-mono" placeholder="Paste unformatted JSON or drop a .json file here..." spellcheck="false"></textarea>
      </div>
      <div class="pane-column">
        <div class="pane-header">
          <span class="pane-title text-xs font-semibold">Formatted Output</span>
          <span id="json-meta-badge" class="badge badge-secondary font-mono text-xs">Ready</span>
        </div>
        <div id="json-error-banner" class="editor-error-banner" style="display: none;"></div>
        <textarea id="json-output" class="code-editor font-mono" readonly placeholder="Formatted output will appear here..." spellcheck="false"></textarea>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#json-input');
  const outputEl = container.querySelector('#json-output');
  const errorEl = container.querySelector('#json-error-banner');
  const badgeEl = container.querySelector('#json-meta-badge');
  const indentEl = container.querySelector('#json-opt-indent');
  const sortEl = container.querySelector('#json-opt-sort');
  const nullsEl = container.querySelector('#json-opt-nulls');
  const unicodeEl = container.querySelector('#json-opt-unicode');

  function runFormat() {
    const start = performance.now();
    const result = formatJSON(inputEl.value, {
      indent: indentEl.value,
      sortKeys: sortEl.checked,
      removeNulls: nullsEl.checked,
      escapeUnicode: unicodeEl.checked
    });
    const duration = Math.round(performance.now() - start);

    if (result.success) {
      errorEl.style.display = 'none';
      outputEl.value = result.output;
      badgeEl.className = 'badge badge-success font-mono text-xs';
      badgeEl.textContent = `${result.lines} lines (${formatBytes(result.size)})`;
      updateStatusBar(container, result.output, duration);
      addToolHistory(tool.id, inputEl.value);
    } else {
      errorEl.style.display = 'block';
      badgeEl.className = 'badge badge-danger font-mono text-xs';
      badgeEl.textContent = 'Syntax Error';
      errorEl.innerHTML = `
        <div class="flex items-center gap-2 font-bold text-rose">
          ${getIcon('alert', 'icon-xs')} JSON Parse Error
        </div>
        <div class="font-mono text-xs mt-1 text-secondary">${escapeHTML(result.error)}</div>
        ${result.errorPos?.line ? `<div class="text-xs text-rose font-mono mt-1">Error at Line ${result.errorPos.line}, Column ${result.errorPos.column}</div>` : ''}
        ${result.errorPos?.snippet ? `<pre class="error-code-snippet font-mono text-xs mt-2">${escapeHTML(result.errorPos.snippet)}</pre>` : ''}
      `;
      outputEl.value = '';
    }
  }

  container.querySelector('#btn-format-json').addEventListener('click', runFormat);
  inputEl.addEventListener('input', () => { updateStatusBar(container, inputEl.value); runFormat(); });
  indentEl.addEventListener('change', runFormat);
  sortEl.addEventListener('change', runFormat);
  nullsEl.addEventListener('change', runFormat);
  unicodeEl.addEventListener('change', runFormat);

  container.querySelector('#btn-copy-json').addEventListener('click', (e) => copyToClipboard(outputEl.value, e.currentTarget));
  container.querySelector('#btn-download-json').addEventListener('click', () => downloadTextFile('formatted.json', outputEl.value, 'application/json'));
  container.querySelector('#btn-clear-json').addEventListener('click', () => {
    inputEl.value = '';
    outputEl.value = '';
    errorEl.style.display = 'none';
    badgeEl.textContent = 'Cleared';
    updateStatusBar(container, '');
    showToast('JSON editor cleared', 'info');
  });

  setupFileDrop(inputEl, (content) => {
    inputEl.value = content;
    runFormat();
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    inputEl.value = preset.value;
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
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-primary" id="btn-validate-json">${getIcon('check', 'icon-xs')} Validate Now</button>
        <button class="btn btn-sm btn-ghost" id="btn-clear-val">${getIcon('trash', 'icon-xs')} Clear</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="validator-layout flex flex-col flex-1">
      <div id="validator-status-card" class="card p-4 mb-4">
        <div class="text-muted text-sm">Enter JSON below to inspect syntax validity and structural metrics.</div>
      </div>
      <div class="form-group flex-1 flex flex-col">
        <label class="form-label font-semibold text-xs" for="val-input">Raw JSON Input</label>
        <textarea id="val-input" class="code-editor font-mono flex-1 min-h-80" placeholder="Paste JSON here to validate syntax, line numbers, and error positions..." spellcheck="false"></textarea>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#val-input');
  const statusEl = container.querySelector('#validator-status-card');

  function runValidation() {
    const val = validateJSON(inputEl.value);
    if (!inputEl.value.trim()) {
      statusEl.className = 'card p-4 mb-4';
      statusEl.innerHTML = `<div class="text-muted text-sm">Enter JSON below to perform syntax inspection.</div>`;
      updateStatusBar(container, '');
      return;
    }

    if (val.isValid) {
      statusEl.className = 'card p-4 mb-4 border-success bg-success-subtle';
      statusEl.innerHTML = `
        <div class="flex items-center gap-2 text-emerald font-semibold text-sm">
          ${getIcon('check', 'icon-sm')} Valid JSON Document
        </div>
        <div class="text-xs text-secondary mt-1">${val.message} &bull; Size: ${formatBytes(val.size)}</div>
      `;
    } else {
      statusEl.className = 'card p-4 mb-4 border-danger bg-danger-subtle';
      statusEl.innerHTML = `
        <div class="flex items-center gap-2 text-rose font-semibold text-sm">
          ${getIcon('alert', 'icon-sm')} Invalid JSON Syntax
        </div>
        <div class="text-xs text-primary font-mono mt-1">${escapeHTML(val.message)}</div>
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

  setupFileDrop(inputEl, (content) => {
    inputEl.value = content;
    runValidation();
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    inputEl.value = preset.value;
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
      <div class="options-group flex-1 flex items-center gap-2">
        <input type="text" id="tree-search" class="form-control form-control-sm" placeholder="Filter keys or values in tree..." aria-label="Search JSON tree" />
      </div>
      <div class="actions-group flex items-center gap-2">
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
        <textarea id="tree-raw-input" class="code-editor font-mono" placeholder="Paste JSON here to explore AST tree..." spellcheck="false"></textarea>
      </div>
      <div class="pane-column">
        <div class="pane-header flex items-center justify-between">
          <span class="pane-title text-xs font-semibold">Interactive AST Tree</span>
          <span class="text-xs text-muted">Click key to copy path</span>
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
      treeEl.innerHTML = '<div class="text-muted p-4 text-xs">Enter valid JSON on the left to render the tree view.</div>';
      updateStatusBar(container, '');
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
          node?.classList.toggle('open');
        });
      });

      // Path copier
      treeEl.querySelectorAll('.tree-key').forEach(keyEl => {
        keyEl.addEventListener('click', () => {
          const path = keyEl.dataset.path;
          copyToClipboard(path, null);
          showToast(`Copied JSONPath: ${path}`, 'success');
        });
      });

      updateStatusBar(container, inputEl.value);
      addToolHistory(tool.id, inputEl.value);
    } catch (err) {
      treeEl.innerHTML = `<div class="p-4 text-rose text-xs">${getIcon('alert', 'icon-xs')} Invalid JSON: ${escapeHTML(err.message)}</div>`;
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

  setupFileDrop(inputEl, (content) => {
    inputEl.value = content;
    renderTree();
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    inputEl.value = preset.value;
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
      <div class="options-group flex items-center gap-3">
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="b64-opt-urlsafe" /> URL-Safe (- and _)
        </label>
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="b64-opt-datauri" /> Data URI Header
        </label>
      </div>
      <div class="actions-group flex items-center gap-2">
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
        <textarea id="b64-text-input" class="code-editor font-mono" placeholder="Type or paste plaintext to encode..." spellcheck="false"></textarea>
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
  const dataUriChk = container.querySelector('#b64-opt-datauri');

  function doEncode() {
    try {
      b64Output.value = encodeBase64(textInput.value, {
        urlSafe: urlSafeChk.checked,
        dataUriMime: dataUriChk.checked ? 'text/plain' : ''
      });
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
  dataUriChk.addEventListener('change', doEncode);

  container.querySelector('#btn-b64-swap').addEventListener('click', () => {
    const tmp = textInput.value;
    textInput.value = b64Output.value;
    b64Output.value = tmp;
  });

  container.querySelector('#btn-b64-copy').addEventListener('click', (e) => copyToClipboard(b64Output.value, e.currentTarget));
  container.querySelector('#btn-b64-clear').addEventListener('click', () => {
    textInput.value = '';
    b64Output.value = '';
    updateStatusBar(container, '');
  });

  setupFileDrop(textInput, (content) => {
    textInput.value = content;
    doEncode();
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    textInput.value = preset.value;
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
      <div class="options-group flex items-center gap-2">
        <label class="opt-label text-xs font-semibold text-muted" for="url-opt-mode">Encoding Mode:</label>
        <select id="url-opt-mode" class="form-control form-control-sm">
          <option value="component">encodeURIComponent (Standard Component)</option>
          <option value="uri">encodeURI (Full URI)</option>
          <option value="form">application/x-www-form-urlencoded (Space to +)</option>
          <option value="rfc3986">RFC 3986 Strict</option>
        </select>
      </div>
      <div class="actions-group flex items-center gap-2">
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

  attachStandardToolbarEvents(container, tool, (preset) => {
    plainEl.value = preset.value;
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
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-primary" id="btn-decode-jwt">${getIcon('play', 'icon-xs')} Decode Token</button>
        <button class="btn btn-sm btn-secondary" id="btn-copy-payload">${getIcon('copy', 'icon-xs')} Copy Payload</button>
        <button class="btn btn-sm btn-ghost" id="btn-clear-jwt">${getIcon('trash', 'icon-xs')} Clear</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="jwt-layout flex flex-col flex-1 overflow-y-auto">
      <div class="form-group mb-3">
        <label class="form-label font-semibold text-xs" for="jwt-input">Encoded JSON Web Token (JWT) *</label>
        <textarea id="jwt-input" class="code-editor font-mono min-h-24" placeholder="Paste eyJhbGci... token string here..."></textarea>
      </div>

      <div class="alert alert-info mb-3">
        <div class="alert-icon">${getIcon('info', 'icon-md')}</div>
        <div class="alert-content">
          <div class="alert-title font-semibold text-xs">Client-Side JWT Inspection</div>
          <p class="alert-desc text-xs text-muted">DevBench decodes token headers and payload claims client-side. Cryptographic signature verification must be executed by your auth server with public/private keys.</p>
        </div>
      </div>

      <div class="split-pane-layout">
        <div class="pane-column">
          <div class="pane-header flex items-center justify-between">
            <span class="pane-title text-xs font-semibold text-rose">Header (Algorithm & Key ID)</span>
            <span id="jwt-alg-badge" class="badge badge-secondary font-mono text-xs"></span>
          </div>
          <pre id="jwt-header-out" class="code-editor font-mono bg-surface-elevated"></pre>
        </div>
        <div class="pane-column">
          <div class="pane-header flex items-center justify-between">
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
  const algBadgeEl = container.querySelector('#jwt-alg-badge');
  const expBadgeEl = container.querySelector('#jwt-exp-badge');

  function doDecode() {
    const res = decodeJWT(inputEl.value);
    if (res.success) {
      headerEl.textContent = res.rawHeader;
      payloadEl.textContent = res.rawPayload;
      algBadgeEl.textContent = res.header.alg || 'none';

      if (res.expirationStatus) {
        expBadgeEl.innerHTML = `
          <span class="badge ${res.expirationStatus.isExpired ? 'badge-danger' : 'badge-success'} text-xs" title="${res.expirationStatus.fullDate}">
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
      algBadgeEl.textContent = '';
      expBadgeEl.innerHTML = '';
    }
  }

  container.querySelector('#btn-decode-jwt').addEventListener('click', doDecode);
  inputEl.addEventListener('input', doDecode);
  container.querySelector('#btn-copy-payload').addEventListener('click', (e) => copyToClipboard(payloadEl.textContent, e.currentTarget));
  container.querySelector('#btn-clear-jwt').addEventListener('click', () => {
    inputEl.value = '';
    headerEl.textContent = '';
    payloadEl.textContent = '';
    algBadgeEl.textContent = '';
    expBadgeEl.innerHTML = '';
    updateStatusBar(container, '');
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    inputEl.value = preset.value;
    doDecode();
  });

  inputEl.value = tool.sample;
  doDecode();
}

// ==========================================
// 7. UUID / ID GENERATOR
// ==========================================
function renderUUIDGenerator(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    showPresets: false,
    toolbarHTML: `
      <div class="options-group flex items-center gap-2 flex-wrap">
        <label class="opt-label text-xs font-semibold text-muted" for="uuid-opt-ver">Format:</label>
        <select id="uuid-opt-ver" class="form-control form-control-sm">
          <option value="v4">UUID v4 (Random Cryptographic)</option>
          <option value="v7">UUID v7 (Time-Ordered RFC 9562)</option>
          <option value="ulid">ULID (Sortable Crockford Base32)</option>
          <option value="nanoid">NanoID (Compact 21-Char)</option>
        </select>
        <label class="opt-label text-xs font-semibold text-muted" for="uuid-opt-count">Count:</label>
        <input type="number" id="uuid-opt-count" class="form-control form-control-sm w-20" min="1" max="500" value="10" />
        <label class="opt-label text-xs font-semibold text-muted" for="uuid-opt-prefix">Prefix:</label>
        <input type="text" id="uuid-opt-prefix" class="form-control form-control-sm w-20 font-mono" placeholder="e.g. usr_" />
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="uuid-opt-upper" /> Uppercase
        </label>
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="uuid-opt-hyphens" checked /> Hyphens
        </label>
        <label class="opt-label text-xs font-semibold text-muted" for="uuid-opt-format">Output:</label>
        <select id="uuid-opt-format" class="form-control form-control-sm">
          <option value="list">Line-by-Line</option>
          <option value="json">JSON Array</option>
          <option value="csv">CSV List</option>
          <option value="sql">SQL IN Clause</option>
        </select>
      </div>
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-primary" id="btn-uuid-generate">${getIcon('refresh', 'icon-xs')} Generate</button>
        <button class="btn btn-sm btn-secondary" id="btn-uuid-copy">${getIcon('copy', 'icon-xs')} Copy All</button>
        <button class="btn btn-sm btn-secondary" id="btn-uuid-download">${getIcon('download', 'icon-xs')} Download</button>
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
  const prefixEl = container.querySelector('#uuid-opt-prefix');
  const upperEl = container.querySelector('#uuid-opt-upper');
  const hyphensEl = container.querySelector('#uuid-opt-hyphens');
  const formatEl = container.querySelector('#uuid-opt-format');

  function doGenerate() {
    const count = parseInt(countEl.value, 10) || 10;
    const text = generateBulkUUIDs(count, {
      version: verEl.value,
      prefix: prefixEl.value.trim(),
      uppercase: upperEl.checked,
      hyphens: hyphensEl.checked,
      format: formatEl.value
    });
    outputEl.value = text;
    updateStatusBar(container, text);
  }

  container.querySelector('#btn-uuid-generate').addEventListener('click', doGenerate);
  verEl.addEventListener('change', doGenerate);
  countEl.addEventListener('change', doGenerate);
  prefixEl.addEventListener('input', doGenerate);
  upperEl.addEventListener('change', doGenerate);
  hyphensEl.addEventListener('change', doGenerate);
  formatEl.addEventListener('change', doGenerate);

  container.querySelector('#btn-uuid-copy').addEventListener('click', (e) => copyToClipboard(outputEl.value, e.currentTarget));
  container.querySelector('#btn-uuid-download').addEventListener('click', () => downloadTextFile('identifiers.txt', outputEl.value));

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
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-secondary" id="btn-ts-now">${getIcon('refresh', 'icon-xs')} Current Time</button>
        <button class="btn btn-sm btn-secondary" id="btn-ts-copy-iso">${getIcon('copy', 'icon-xs')} Copy ISO 8601</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="timestamp-layout flex flex-col flex-1 overflow-y-auto">
      <div class="card p-4 mb-4 flex items-center justify-between">
        <div>
          <span class="text-xs text-muted uppercase font-semibold">Current Unix Epoch Ticker (Seconds)</span>
          <div class="font-mono text-2xl font-bold text-emerald" id="live-epoch-ticker">0</div>
        </div>
        <button class="btn btn-sm btn-secondary" id="btn-copy-live-epoch">${getIcon('copy', 'icon-xs')} Copy Epoch</button>
      </div>

      <div class="form-group mb-4">
        <label class="form-label font-semibold text-xs" for="ts-input">Enter Timestamp (Seconds / Milliseconds / ISO 8601 / Hex / Date String)</label>
        <input type="text" id="ts-input" class="form-control font-mono text-base" placeholder="e.g. 1724800000, 2026-08-28T00:00:00Z, or 0x66CDC800" />
      </div>

      <div class="metrics-grid" id="ts-results-grid"></div>
    </div>
  `;

  const inputEl = container.querySelector('#ts-input');
  const resultsGrid = container.querySelector('#ts-results-grid');
  const tickerEl = container.querySelector('#live-epoch-ticker');

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
        <div class="metric-card">
          <span class="metric-label">Hex Timestamp</span>
          <div class="metric-value font-mono text-primary">${res.unixHex}</div>
          <button class="btn btn-xs btn-ghost btn-copy-field" data-val="${res.unixHex}">Copy</button>
        </div>
        <div class="metric-card">
          <span class="metric-label">Day of Year</span>
          <div class="metric-value font-mono text-primary">Day ${res.dayOfYear} (${res.isLeapYear ? 'Leap Year' : 'Common Year'})</div>
        </div>
        <div class="metric-card col-span-full">
          <span class="metric-label">ISO 8601 (UTC Standard)</span>
          <div class="metric-value font-mono text-emerald text-base">${res.iso}</div>
          <button class="btn btn-xs btn-ghost btn-copy-field" data-val="${res.iso}">Copy</button>
        </div>
        <div class="metric-card col-span-full">
          <span class="metric-label">Local Date & Time</span>
          <div class="metric-value text-base text-primary">${res.local}</div>
          <div class="metric-meta text-xs text-muted mt-1">Relative: <strong class="text-primary">${res.relative}</strong></div>
        </div>
      `;

      resultsGrid.querySelectorAll('.btn-copy-field').forEach(b => {
        b.addEventListener('click', () => copyToClipboard(b.dataset.val, b));
      });
      addToolHistory(tool.id, inputEl.value);
    } else {
      resultsGrid.innerHTML = `<div class="p-4 text-rose text-xs font-mono">${escapeHTML(res.error)}</div>`;
    }
  }

  inputEl.addEventListener('input', doConvert);
  container.querySelector('#btn-ts-now').addEventListener('click', () => { inputEl.value = 'now'; doConvert(); });
  container.querySelector('#btn-copy-live-epoch').addEventListener('click', (e) => copyToClipboard(tickerEl.textContent, e.currentTarget));
  container.querySelector('#btn-ts-copy-iso').addEventListener('click', (e) => {
    const res = convertTimestamp(inputEl.value);
    if (res.isValid) copyToClipboard(res.iso, e.currentTarget);
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    inputEl.value = preset.value;
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
      <div class="options-group flex-1 flex items-center gap-2">
        <span class="font-mono font-bold text-muted">/</span>
        <input type="text" id="regex-pattern" class="form-control form-control-sm font-mono flex-1" placeholder="Regular expression (e.g. [a-zA-Z0-9]+)" value="([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+)" />
        <span class="font-mono font-bold text-muted">/</span>
        <input type="text" id="regex-flags" class="form-control form-control-sm font-mono w-16" placeholder="flags" value="g" />
      </div>
      <div class="actions-group flex items-center gap-2">
        <span class="badge badge-primary font-mono text-xs" id="regex-match-counter">0 matches</span>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="regex-main-layout flex flex-col flex-1 overflow-y-auto">
      <div class="split-pane-layout mb-3">
        <div class="pane-column">
          <div class="pane-header"><span class="pane-title text-xs font-semibold">Test String</span></div>
          <textarea id="regex-test-text" class="code-editor font-mono" placeholder="Enter text to match against regular expression..."></textarea>
        </div>
        <div class="pane-column">
          <div class="pane-header"><span class="pane-title text-xs font-semibold">Match Highlight Preview</span></div>
          <div id="regex-highlight-box" class="code-editor font-mono bg-surface-elevated overflow-y-auto"></div>
        </div>
      </div>

      <div class="card p-4">
        <div class="card-header p-0 pb-2 mb-2 flex items-center justify-between border-b">
          <h3 class="card-title text-xs font-semibold uppercase">Capture Groups & Match Index Table</h3>
        </div>
        <div id="regex-matches-table" class="table-responsive max-h-48 overflow-y-auto"></div>
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
          <table class="table text-xs">
            <thead>
              <tr>
                <th style="width: 40px;">#</th>
                <th>Full Match</th>
                <th style="width: 120px;">Index Range</th>
                <th>Capture Groups</th>
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
        tableEl.innerHTML = `<div class="text-muted text-xs p-2">No matches found in test string.</div>`;
      }
      updateStatusBar(container, testTextEl.value);
      addToolHistory(tool.id, patternEl.value);
    } else {
      counterEl.textContent = 'Regex Error';
      highlightEl.innerHTML = `<div class="text-rose text-xs p-2">Invalid RegExp: ${escapeHTML(res.error)}</div>`;
      tableEl.innerHTML = '';
    }
  }

  patternEl.addEventListener('input', doTest);
  flagsEl.addEventListener('input', doTest);
  testTextEl.addEventListener('input', doTest);

  attachStandardToolbarEvents(container, tool, (preset) => {
    patternEl.value = preset.pattern;
    flagsEl.value = preset.flags || 'g';
    testTextEl.value = preset.sample;
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
      <div class="options-group flex items-center gap-2">
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="diff-opt-whitespace" /> Ignore Whitespace
        </label>
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="diff-opt-case" checked /> Case Sensitive
        </label>
      </div>
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-secondary" id="btn-swap-diff">${getIcon('swap', 'icon-xs')} Swap</button>
        <button class="btn btn-sm btn-primary" id="btn-run-diff">${getIcon('diff', 'icon-xs')} Compare</button>
        <button class="btn btn-sm btn-ghost" id="btn-clear-diff">${getIcon('trash', 'icon-xs')} Clear</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="diff-main-layout flex flex-col flex-1 overflow-y-auto">
      <div class="split-pane-layout mb-3">
        <div class="pane-column">
          <div class="pane-header"><span class="pane-title text-xs font-semibold">Original Text</span></div>
          <textarea id="diff-orig" class="code-editor font-mono" placeholder="Paste original code / text..."></textarea>
        </div>
        <div class="pane-column">
          <div class="pane-header"><span class="pane-title text-xs font-semibold">Modified Text</span></div>
          <textarea id="diff-mod" class="code-editor font-mono" placeholder="Paste modified code / text..."></textarea>
        </div>
      </div>

      <div class="card p-0">
        <div class="pane-header border-b px-4 py-2 flex items-center justify-between">
          <span class="pane-title text-xs font-semibold">Unified Diff Result</span>
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
  const caseChk = container.querySelector('#diff-opt-case');

  function doDiff() {
    const res = computeTextDiff(origEl.value, modEl.value, {
      ignoreWhitespace: wsChk.checked,
      caseSensitive: caseChk.checked
    });

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
  caseChk.addEventListener('change', doDiff);

  container.querySelector('#btn-swap-diff').addEventListener('click', () => {
    const tmp = origEl.value;
    origEl.value = modEl.value;
    modEl.value = tmp;
    doDiff();
  });

  container.querySelector('#btn-clear-diff').addEventListener('click', () => {
    origEl.value = '';
    modEl.value = '';
    doDiff();
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    origEl.value = preset.orig;
    modEl.value = preset.mod;
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
      <div class="options-group flex-1 flex items-center gap-2">
        <label class="opt-label text-xs font-semibold text-muted" for="hash-hmac-key">HMAC Key (Optional):</label>
        <input type="text" id="hash-hmac-key" class="form-control form-control-sm font-mono flex-1" placeholder="Leave blank for standard checksum" />
        <label class="opt-label text-xs font-semibold text-muted" for="hash-format-select">Format:</label>
        <select id="hash-format-select" class="form-control form-control-sm w-28">
          <option value="hex">Hexadecimal</option>
          <option value="base64">Base64</option>
        </select>
      </div>
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-primary" id="btn-compute-hash">${getIcon('refresh', 'icon-xs')} Compute</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="hash-layout flex flex-col flex-1 overflow-y-auto">
      <div class="form-group mb-4">
        <label class="form-label font-semibold text-xs" for="hash-input">Input Payload String *</label>
        <textarea id="hash-input" class="code-editor font-mono min-h-24" placeholder="Enter text or string to generate cryptographic hashes..."></textarea>
      </div>

      <div class="card p-0">
        <div class="table-responsive">
          <table class="table text-xs font-mono">
            <thead>
              <tr>
                <th style="width: 140px;">Algorithm</th>
                <th>Hash / Digest</th>
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
  const formatEl = container.querySelector('#hash-format-select');
  const bodyEl = container.querySelector('#hash-results-body');

  async function doHash() {
    const hashes = await generateHashes(inputEl.value, hmacEl.value.trim(), formatEl.value);
    const algos = [
      { name: 'SHA-256', val: hashes.sha256, bits: '256-bit' },
      { name: 'SHA-512', val: hashes.sha512, bits: '512-bit' },
      { name: 'SHA-384', val: hashes.sha384, bits: '384-bit' },
      { name: 'SHA-1', val: hashes.sha1, bits: '160-bit' },
      { name: 'MD5', val: hashes.md5, bits: '128-bit' },
      { name: 'CRC32', val: hashes.crc32, bits: '32-bit' }
    ];

    bodyEl.innerHTML = algos.map(a => `
      <tr>
        <td class="font-bold text-primary">
          ${a.name}
          <span class="text-muted text-xs block font-normal">${a.bits}</span>
        </td>
        <td class="text-emerald break-all font-mono">${a.val || '—'}</td>
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
  formatEl.addEventListener('change', doHash);

  attachStandardToolbarEvents(container, tool, (preset) => {
    inputEl.value = preset.value;
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
      <div class="options-group flex-1 flex items-center gap-2">
        <label class="opt-label text-xs font-semibold text-muted" for="color-str-input">Color Input (HEX, RGB, HSL, Named):</label>
        <input type="text" id="color-str-input" class="form-control form-control-sm font-mono w-48" value="#3B82F6" />
        <input type="color" id="color-native-picker" class="form-control form-control-sm p-0 w-10 cursor-pointer" value="#3b82f6" aria-label="Color wheel" />
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `<div id="color-details-view" class="color-details-layout flex flex-col flex-1 overflow-y-auto"></div>`;

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

      <div class="metrics-grid mb-4">
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

      <div class="card p-4 mb-4">
        <div class="card-header p-0 pb-2 mb-3 border-b"><h3 class="card-title text-xs font-semibold uppercase">WCAG 2.1 Contrast Compliance</h3></div>
        <div class="contrast-check-row flex gap-4 flex-wrap">
          <div class="contrast-box p-3 rounded border flex-1" style="background: #ffffff; color: ${c.hex};">
            <span class="text-xs font-bold block mb-1">Contrast on White: ${c.contrastWhite}:1</span>
            <div class="flex gap-2">
              <span class="badge ${c.wcagWhiteAA ? 'badge-success' : 'badge-danger'} text-xs">AA Normal (${c.wcagWhiteAA ? 'PASS' : 'FAIL'})</span>
              <span class="badge ${c.wcagWhiteAAA ? 'badge-success' : 'badge-danger'} text-xs">AAA (${c.wcagWhiteAAA ? 'PASS' : 'FAIL'})</span>
            </div>
          </div>
          <div class="contrast-box p-3 rounded border flex-1" style="background: #000000; color: ${c.hex};">
            <span class="text-xs font-bold block mb-1">Contrast on Black: ${c.contrastBlack}:1</span>
            <div class="flex gap-2">
              <span class="badge ${c.wcagBlackAA ? 'badge-success' : 'badge-danger'} text-xs">AA Normal (${c.wcagBlackAA ? 'PASS' : 'FAIL'})</span>
              <span class="badge ${c.wcagBlackAAA ? 'badge-success' : 'badge-danger'} text-xs">AAA (${c.wcagBlackAAA ? 'PASS' : 'FAIL'})</span>
            </div>
          </div>
        </div>
      </div>
    `;

    detailsEl.querySelectorAll('.btn-copy-field').forEach(b => {
      b.addEventListener('click', () => copyToClipboard(b.dataset.val, b));
    });
  }

  strInput.addEventListener('input', () => {
    if (/^#[0-9a-fA-F]{6}$/i.test(strInput.value)) nativePicker.value = strInput.value;
    doColor();
  });
  nativePicker.addEventListener('input', () => {
    strInput.value = nativePicker.value;
    doColor();
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    strInput.value = preset.value;
    if (/^#[0-9a-fA-F]{6}$/i.test(preset.value)) nativePicker.value = preset.value;
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
      <div class="options-group flex items-center gap-2">
        <label class="opt-label text-xs font-semibold text-muted" for="html-opt-mode">Mode:</label>
        <select id="html-opt-mode" class="form-control form-control-sm">
          <option value="named">Named Entities (&amp;amp;, &amp;lt;)</option>
          <option value="decimal">Decimal (&#38;)</option>
          <option value="hex">Hexadecimal (&#x26;)</option>
        </select>
      </div>
      <div class="actions-group flex items-center gap-2">
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
        <textarea id="html-encoded" class="code-editor font-mono" placeholder="Encoded entities output..."></textarea>
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

  attachStandardToolbarEvents(container, tool, (preset) => {
    rawEl.value = preset.value;
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
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-secondary" id="btn-url-add-param">+ Add Query Param</button>
        <button class="btn btn-sm btn-secondary" id="btn-copy-full-url">${getIcon('copy', 'icon-xs')} Copy Rebuilt URL</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="url-parser-layout flex flex-col flex-1 overflow-y-auto">
      <div class="form-group mb-4">
        <label class="form-label font-semibold text-xs" for="url-parse-input">Full URL to Parse *</label>
        <input type="text" id="url-parse-input" class="form-control font-mono text-sm" placeholder="https://example.com/path?key=val" />
      </div>

      <div class="metrics-grid mb-4" id="url-components-grid"></div>

      <div class="card p-0">
        <div class="pane-header border-b px-4 py-2 flex items-center justify-between">
          <span class="pane-title text-xs font-semibold">Query Parameters Table (Live Two-Way Sync)</span>
        </div>
        <div class="table-responsive">
          <table class="table text-xs font-mono">
            <thead>
              <tr>
                <th style="width: 220px;">Parameter Key</th>
                <th>Parameter Value</th>
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
      paramsBody.innerHTML = `<tr><td colspan="3" class="text-muted text-center p-3">No query parameters present in URL.</td></tr>`;
      return;
    }

    paramsBody.innerHTML = currentParams.map((p, idx) => `
      <tr>
        <td><input type="text" class="form-control form-control-sm q-key font-mono" data-idx="${idx}" value="${escapeHTML(p.key)}" /></td>
        <td><input type="text" class="form-control form-control-sm q-val font-mono" data-idx="${idx}" value="${escapeHTML(p.value)}" /></td>
        <td class="text-right"><button class="btn-icon-danger btn-del-param" data-idx="${idx}" title="Delete parameter">${getIcon('close', 'icon-xs')}</button></td>
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
    currentParams.push({ key: 'param_key', value: 'param_value' });
    const res = parseURL(inputEl.value);
    if (res.isValid) {
      inputEl.value = rebuildURL(res, currentParams);
      renderParamsTable(res);
    }
  });

  container.querySelector('#btn-copy-full-url').addEventListener('click', (e) => copyToClipboard(inputEl.value, e.currentTarget));

  attachStandardToolbarEvents(container, tool, (preset) => {
    inputEl.value = preset.value;
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
      <div class="options-group flex-1 flex items-center gap-3">
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="http-opt-simulated" /> Offline Simulated Mock Mode
        </label>
        <select id="http-mock-status" class="form-control form-control-sm w-36" style="display: none;">
          <option value="200">Mock: 200 OK</option>
          <option value="201">Mock: 201 Created</option>
          <option value="204">Mock: 204 No Content</option>
          <option value="400">Mock: 400 Bad Request</option>
          <option value="401">Mock: 401 Unauthorized</option>
          <option value="404">Mock: 404 Not Found</option>
          <option value="500">Mock: 500 Server Error</option>
        </select>
      </div>
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-secondary" id="btn-http-curl">${getIcon('terminal', 'icon-xs')} Copy cURL</button>
        <button class="btn btn-sm btn-secondary" id="btn-http-fetch">${getIcon('code', 'icon-xs')} Copy Fetch</button>
        <button class="btn btn-sm btn-primary" id="btn-http-send">${getIcon('play', 'icon-xs')} Send Request</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="http-builder-layout flex flex-col flex-1 overflow-y-auto">
      <div class="http-request-bar flex gap-2 mb-3">
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
          <textarea id="http-req-body" class="code-editor font-mono" placeholder="Request JSON body..."></textarea>
        </div>
        <div class="pane-column">
          <div class="pane-header flex items-center justify-between">
            <span class="pane-title text-xs font-semibold">Response Output</span>
            <span id="http-res-badge"></span>
          </div>
          <textarea id="http-res-body" class="code-editor font-mono" readonly placeholder="Response status & payload will appear here..."></textarea>
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
  container.querySelector('#btn-http-fetch').addEventListener('click', (e) => {
    const fetchCode = generateFetchSnippet({ method: methodEl.value, url: urlEl.value, body: bodyEl.value });
    copyToClipboard(fetchCode, e.currentTarget);
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    urlEl.value = preset.url;
    methodEl.value = preset.method || 'GET';
    bodyEl.value = preset.body || '';
    doSend();
  });
}

// ==========================================
// 16. LOREM / MOCK DATA GENERATOR
// ==========================================
function renderMockGenerator(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    showPresets: false,
    toolbarHTML: `
      <div class="options-group flex items-center gap-2 flex-wrap">
        <label class="opt-label text-xs font-semibold text-muted" for="mock-type">Dataset Type:</label>
        <select id="mock-type" class="form-control form-control-sm">
          <option value="users">Enterprise SaaS Users (JSON)</option>
          <option value="orders">E-Commerce Orders & Line Items (JSON)</option>
          <option value="logs">Server Access Logs (Nginx / Combined)</option>
          <option value="kubernetes">Kubernetes Pod Telemetry (JSON)</option>
          <option value="paragraphs">Lorem Paragraphs</option>
          <option value="sentences">Lorem Sentences</option>
          <option value="words">Lorem Words</option>
        </select>
        <label class="opt-label text-xs font-semibold text-muted" for="mock-count">Count:</label>
        <input type="number" id="mock-count" class="form-control form-control-sm w-20" min="1" max="100" value="5" />
      </div>
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-primary" id="btn-mock-gen">${getIcon('refresh', 'icon-xs')} Generate</button>
        <button class="btn btn-sm btn-secondary" id="btn-mock-copy">${getIcon('copy', 'icon-xs')} Copy</button>
        <button class="btn btn-sm btn-secondary" id="btn-mock-download">${getIcon('download', 'icon-xs')} Download</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `<textarea id="mock-output" class="code-editor font-mono flex-1 min-h-80" spellcheck="false"></textarea>`;

  const outEl = container.querySelector('#mock-output');
  const typeEl = container.querySelector('#mock-type');
  const countEl = container.querySelector('#mock-count');

  function doGen() {
    const count = parseInt(countEl.value, 10) || 5;
    const type = typeEl.value;

    if (type === 'users') outEl.value = generateMockUsers(count);
    else if (type === 'orders') outEl.value = generateMockOrders(count);
    else if (type === 'logs') outEl.value = generateMockLogs(count);
    else if (type === 'kubernetes') outEl.value = generateMockKubernetes(count);
    else outEl.value = generateLorem(type, count);

    updateStatusBar(container, outEl.value);
  }

  container.querySelector('#btn-mock-gen').addEventListener('click', doGen);
  typeEl.addEventListener('change', doGen);
  countEl.addEventListener('change', doGen);
  container.querySelector('#btn-mock-copy').addEventListener('click', (e) => copyToClipboard(outEl.value, e.currentTarget));
  container.querySelector('#btn-mock-download').addEventListener('click', () => {
    const isJson = ['users', 'orders', 'kubernetes'].includes(typeEl.value);
    downloadTextFile(`mock_dataset.${isJson ? 'json' : 'txt'}`, outEl.value, isJson ? 'application/json' : 'text/plain');
  });

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
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-secondary" id="btn-copy-cases">${getIcon('copy', 'icon-xs')} Copy All Formats</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="case-converter-layout flex flex-col flex-1 overflow-y-auto">
      <div class="form-group mb-4">
        <label class="form-label font-semibold text-xs" for="case-input">Input Text / Identifier *</label>
        <input type="text" id="case-input" class="form-control font-mono text-base" placeholder="Enter variable name, slug, or sentence to convert across 12 code cases..." />
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
    { key: 'Train-Case', label: 'Train-Case' },
    { key: 'alternating', label: 'aLtErNaTiNg' },
    { key: 'reverse', label: 'Reverse String' }
  ];

  function doCases() {
    gridEl.innerHTML = CASES.map(c => {
      const converted = convertCase(inputEl.value, c.key);
      return `
        <div class="metric-card">
          <span class="metric-label">${c.label}</span>
          <div class="metric-value font-mono text-base text-primary break-all">${escapeHTML(converted)}</div>
          <button class="btn btn-xs btn-ghost btn-copy-case" data-val="${escapeHTML(converted)}">Copy</button>
        </div>
      `;
    }).join('');

    gridEl.querySelectorAll('.btn-copy-case').forEach(b => {
      b.addEventListener('click', () => copyToClipboard(b.dataset.val, b));
    });
    addToolHistory(tool.id, inputEl.value);
    updateStatusBar(container, inputEl.value);
  }

  inputEl.addEventListener('input', doCases);
  container.querySelector('#btn-copy-cases').addEventListener('click', (e) => {
    const all = CASES.map(c => `${c.label}: ${convertCase(inputEl.value, c.key)}`).join('\n');
    copyToClipboard(all, e.currentTarget);
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    inputEl.value = preset.value;
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
      <div class="options-group flex items-center gap-2">
        <select id="sort-mode" class="form-control form-control-sm" aria-label="Sort order mode">
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
      <div class="actions-group flex items-center gap-2">
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
        <textarea id="sort-output" class="code-editor font-mono" readonly placeholder="Sorted output will appear here..."></textarea>
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

  setupFileDrop(inEl, (content) => {
    inEl.value = content;
    doSort();
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    inEl.value = preset.value;
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
      <div class="options-group flex items-center gap-2">
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="dedup-case" /> Case Sensitive
        </label>
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="dedup-trim" checked /> Trim Whitespace
        </label>
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="dedup-empty" checked /> Remove Empty
        </label>
      </div>
      <div class="actions-group flex items-center gap-2">
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
  const emptyEl = container.querySelector('#dedup-empty');
  const badgeEl = container.querySelector('#dedup-stats-badge');

  function doDedup() {
    const res = removeDuplicateLines(inEl.value, {
      caseSensitive: caseEl.checked,
      trimLines: trimEl.checked,
      removeEmpty: emptyEl.checked
    });
    outEl.value = res.output;
    badgeEl.textContent = `${res.removedCount} duplicates removed (${res.uniqueCount} unique)`;
    updateStatusBar(container, outEl.value);
    addToolHistory(tool.id, inEl.value);
  }

  inEl.addEventListener('input', doDedup);
  caseEl.addEventListener('change', doDedup);
  trimEl.addEventListener('change', doDedup);
  emptyEl.addEventListener('change', doDedup);
  container.querySelector('#btn-copy-dedup').addEventListener('click', (e) => copyToClipboard(outEl.value, e.currentTarget));

  setupFileDrop(inEl, (content) => {
    inEl.value = content;
    doDedup();
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    inEl.value = preset.value;
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
      <div class="options-group flex items-center gap-2 flex-wrap">
        <label class="checkbox-label text-xs"><input type="checkbox" id="clean-trim" checked /> Trim Lines</label>
        <label class="checkbox-label text-xs"><input type="checkbox" id="clean-empty" checked /> Remove Empty Lines</label>
        <label class="checkbox-label text-xs"><input type="checkbox" id="clean-collapse" checked /> Collapse Spaces</label>
        <label class="checkbox-label text-xs"><input type="checkbox" id="clean-tabs" /> Tabs to Spaces</label>
      </div>
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-secondary" id="btn-copy-clean">${getIcon('copy', 'icon-xs')} Copy</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="split-pane-layout">
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Raw Text</span></div>
        <textarea id="clean-input" class="code-editor font-mono" placeholder="Paste messy text with extra whitespace or mixed tabs..."></textarea>
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

  setupFileDrop(inEl, (content) => {
    inEl.value = content;
    doClean();
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    inEl.value = preset.value;
    doClean();
  });

  inEl.value = tool.sample;
  doClean();
}


/* --- MODULE: js/command-palette.js --- */
/**
 * DevBench - Command Palette Module (Ctrl+K / Cmd+K / Ctrl+P)
 * Fast keyboard-driven command palette for instant tool switching, search, and actions.
 */





class CommandPalette {
  constructor(onSelectTool, onAction) {
    this.onSelectTool = onSelectTool;
    this.onAction = onAction;
    this.dialog = document.getElementById('command-palette-dialog');
    this.input = document.getElementById('palette-search-input');
    this.resultsList = document.getElementById('palette-results-list');
    this.selectedIndex = 0;
    this.currentItems = [];

    this.initListeners();
  }

  initListeners() {
    // Keyboard shortcut Ctrl+K or Cmd+K or Ctrl+P
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K' || e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        this.open();
      }
      if (e.key === 'Escape' && this.isOpen()) {
        e.preventDefault();
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
    if (this.input) {
      this.input.value = '';
      this.filterResults('');
      setTimeout(() => this.input.focus(), 40);
    }
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
      { type: 'action', id: 'theme-dark', title: 'Theme: Switch to Dark Mode', desc: 'High-contrast charcoal IDE palette', icon: 'moon', category: 'Preferences' },
      { type: 'action', id: 'theme-light', title: 'Theme: Switch to Light Mode', desc: 'Crisp developer light palette', icon: 'sun', category: 'Preferences' },
      { type: 'action', id: 'clear-all-history', title: 'History: Clear All Tool Inputs', desc: 'Remove stored input history across all tools', icon: 'trash', category: 'Workspace' },
      { type: 'action', id: 'close-all-tabs', title: 'Tabs: Close Other Tabs', desc: 'Keep only the currently active tool tab open', icon: 'close', category: 'Workspace' }
    ];

    actions.forEach(act => {
      if (!q || act.title.toLowerCase().includes(q) || act.desc.toLowerCase().includes(q)) {
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
        <div class="palette-item ${isSelected ? 'selected' : ''}" data-idx="${idx}" role="option" aria-selected="${isSelected}">
          <div class="palette-item-icon">${getIcon(item.icon, 'icon-sm')}</div>
          <div class="palette-item-text">
            <span class="palette-item-title font-medium">${escapeHTML(item.title)}</span>
            ${item.desc ? `<span class="palette-item-desc text-xs text-muted">${escapeHTML(item.desc)}</span>` : ''}
          </div>
          <span class="palette-category-badge badge badge-secondary font-mono text-xs">${escapeHTML(item.category)}</span>
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
    } else if (item.id === 'clear-all-history') {
      clearAllHistory();
      window.dispatchEvent(new CustomEvent('SHOW_TOAST', { detail: { message: 'Cleared all tool input history', type: 'info' } }));
    } else if (item.id === 'close-all-tabs') {
      if (this.onAction) this.onAction('close-other-tabs');
    }
  }
}


/* --- MODULE: js/app.js --- */
/**
 * DevBench - Main Workstation Orchestrator
 * Tab management, sidebar navigation, history & snippet drawers, shortcuts, toast engine, and theme engine.
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
    this.toastContainer = document.getElementById('devbench-toast-container');

    this.openTabs = getOpenTabs();
    this.activeTabId = getActiveTab();
    if (!this.openTabs.includes(this.activeTabId)) {
      this.openTabs.unshift(this.activeTabId);
    }

    this.commandPalette = new CommandPalette(
      (toolId) => this.openTool(toolId),
      (action) => this.handleGlobalAction(action)
    );
  }

  init() {
    // 1. Apply Theme
    const theme = getTheme();
    document.documentElement.setAttribute('data-theme', theme);
    this.updateThemeButton(theme);

    // 2. Render Sidebar Navigation, Tabs & Active Tool
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
      this.showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });

    window.addEventListener('SET_THEME', (e) => {
      const t = e.detail?.theme || 'dark';
      document.documentElement.setAttribute('data-theme', t);
      setTheme(t);
      this.updateThemeButton(t);
      this.showToast(`Switched to ${t === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });

    // Toast event listener
    window.addEventListener('SHOW_TOAST', (e) => {
      const { message, type } = e.detail || {};
      if (message) this.showToast(message, type);
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
        const favs = toggleFavorite(toolId);
        const isNowFav = favs.includes(toolId);
        this.renderSidebar(this.sidebarFilter?.value.trim().toLowerCase());
        this.renderActiveTool(); // refresh star in tool header
        this.showToast(isNowFav ? 'Pinned to favorites' : 'Unpinned from favorites', 'info');
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

    // Mobile sidebar toggle & backdrop
    const sidebarEl = document.getElementById('app-sidebar');
    document.getElementById('btn-mobile-sidebar-toggle')?.addEventListener('click', () => {
      sidebarEl?.classList.toggle('open');
    });

    // Close mobile sidebar on backdrop click or outside click
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && sidebarEl?.classList.contains('open')) {
        const isToggle = e.target.closest('#btn-mobile-sidebar-toggle');
        const isSidebar = e.target.closest('#app-sidebar');
        if (!isToggle && !isSidebar) {
          sidebarEl.classList.remove('open');
        }
      }
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

      // Ctrl+\ or Ctrl+B: toggle sidebar
      if ((e.ctrlKey || e.metaKey) && (e.key === '\\' || e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        const sidebar = document.getElementById('app-sidebar');
        sidebar?.classList.toggle('collapsed');
      }

      // Escape: Close open modals, drawers, command palette
      if (e.key === 'Escape') {
        if (this.drawer?.classList.contains('active')) {
          this.drawer.classList.remove('active');
        }
        if (this.modal?.classList.contains('active')) {
          this.modal.classList.remove('active');
        }
      }
    });
  }

  handleGlobalAction(action) {
    if (action === 'close-other-tabs') {
      this.openTabs = [this.activeTabId];
      saveOpenTabs(this.openTabs);
      this.renderTabs();
      this.showToast('Closed other tabs', 'info');
    }
  }

  updateThemeButton(theme) {
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? getIcon('sun', 'icon-sm') : getIcon('moon', 'icon-sm');
      btn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
    }
  }

  showToast(message, type = 'info') {
    if (!this.toastContainer) {
      let tc = document.getElementById('devbench-toast-container');
      if (!tc) {
        tc = document.createElement('div');
        tc.id = 'devbench-toast-container';
        tc.className = 'toast-container';
        document.body.appendChild(tc);
      }
      this.toastContainer = tc;
    }

    const toast = document.createElement('div');
    toast.className = `devbench-toast toast-${type}`;
    const iconName = type === 'success' ? 'check' : (type === 'warning' ? 'alert' : 'info');
    toast.innerHTML = `
      <span class="toast-icon">${getIcon(iconName, 'icon-xs')}</span>
      <span class="toast-message">${escapeHTML(message)}</span>
    `;

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 2400);
  }

  // --- Sidebar Rendering ---
  renderSidebar(filterQuery = '') {
    const favorites = getFavorites();
    const recents = getRecentTools();

    // 1. Favorites List
    const favTools = TOOLS.filter(t => favorites.includes(t.id));
    if (this.favoritesList) {
      if (favTools.length === 0) {
        this.favoritesList.innerHTML = `<span class="text-xs text-muted px-3 block py-1">No pinned utilities</span>`;
      } else {
        this.favoritesList.innerHTML = favTools.map(t => this.renderSidebarItem(t)).join('');
      }
    }

    // 2. Recents List
    const recentTools = recents.map(id => getToolById(id)).filter(Boolean);
    if (this.recentsList) {
      if (recentTools.length === 0) {
        this.recentsList.innerHTML = `<span class="text-xs text-muted px-3 block py-1">No recent utilities</span>`;
      } else {
        this.recentsList.innerHTML = recentTools.slice(0, 5).map(t => this.renderSidebarItem(t)).join('');
      }
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
      this.sidebarNav.innerHTML = html || `<div class="p-3 text-xs text-muted text-center">No utilities matched "${escapeHTML(filterQuery)}"</div>`;
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
      <a href="#${tool.id}" class="sidebar-tool-item ${isActive ? 'active' : ''}" data-tool-id="${tool.id}" title="${escapeHTML(tool.desc)}">
        <span class="tool-item-icon">${getIcon(tool.icon, 'icon-sm')}</span>
        <span class="tool-item-label">${escapeHTML(tool.title)}</span>
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
    if (this.openTabs.length <= 1) {
      this.showToast('At least one tab must remain open', 'warning');
      return;
    }
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
        <div class="editor-tab ${isActive ? 'active' : ''}" data-tool-id="${tool.id}" role="tab" aria-selected="${isActive}">
          <span class="tab-icon">${getIcon(tool.icon, 'icon-xs')}</span>
          <span class="tab-title text-xs font-medium">${escapeHTML(tool.title)}</span>
          ${this.openTabs.length > 1 ? `
            <button class="tab-close-btn" data-close-id="${tool.id}" title="Close Tab (Ctrl+W)" aria-label="Close Tab">&times;</button>
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

    // Scroll active tab into view
    const activeTabEl = this.tabBar.querySelector('.editor-tab.active');
    activeTabEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
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
          <span class="font-bold text-sm">${escapeHTML(tool.title)} &mdash; Input History</span>
        </div>
        <button class="btn-icon-xs btn-drawer-close" aria-label="Close Drawer">&times;</button>
      </div>
      <div class="drawer-body p-4 overflow-y-auto flex-1">
        ${history.length === 0 ? `
          <div class="text-muted text-xs text-center p-6">No saved history for this utility yet. Recent inputs will automatically appear here.</div>
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
      <div class="drawer-footer p-3 border-t flex justify-between items-center">
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
        const primaryInput = this.workspace.querySelector('textarea, input[type="text"]');
        if (primaryInput) {
          primaryInput.value = val;
          primaryInput.dispatchEvent(new Event('input'));
          this.showToast('Restored input from history', 'info');
        }
        this.drawer.classList.remove('active');
      });
    });

    this.drawer.querySelector('.btn-clear-history')?.addEventListener('click', () => {
      clearToolHistory(toolId);
      this.openHistoryDrawer(toolId);
      this.showToast(`Cleared history for ${tool.title}`, 'info');
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
            <span class="font-bold text-sm">Save Snippet &mdash; ${escapeHTML(tool.title)}</span>
          </div>
          <button class="btn-icon-xs btn-modal-close" aria-label="Close Modal">&times;</button>
        </div>
        <div class="modal-body p-4">
          <div class="form-group mb-3">
            <label class="form-label text-xs font-semibold" for="snippet-title-input">Snippet Name / Label *</label>
            <input type="text" id="snippet-title-input" class="form-control" placeholder="e.g. Production Config, Test Webhook" required />
          </div>
          <div class="form-group mb-4">
            <label class="form-label text-xs font-semibold" for="snippet-content-input">Content</label>
            <textarea id="snippet-content-input" class="code-editor font-mono text-xs" rows="4">${escapeHTML(content)}</textarea>
          </div>

          ${existingSnippets.length > 0 ? `
            <div class="border-t pt-3 mt-3">
              <span class="text-xs font-semibold text-muted block mb-2">Saved Snippets (${existingSnippets.length})</span>
              <div class="flex flex-col gap-2 max-h-40 overflow-y-auto">
                ${existingSnippets.map(s => `
                  <div class="card p-2 flex justify-between items-center text-xs">
                    <span class="font-medium cursor-pointer text-primary btn-load-snip" data-content="${escapeHTML(s.content)}" title="Load into editor">${escapeHTML(s.title)}</span>
                    <button class="btn-icon-xs text-rose btn-del-snip" data-id="${s.id}" title="Delete snippet">&times;</button>
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
        this.showToast(`Saved snippet "${title.trim()}"`, 'success');
      } else {
        this.showToast('Snippet title and content are required', 'warning');
      }
    });

    this.modal.querySelectorAll('.btn-load-snip').forEach(b => {
      b.addEventListener('click', () => {
        if (primaryInput) {
          primaryInput.value = b.dataset.content;
          primaryInput.dispatchEvent(new Event('input'));
          this.showToast('Snippet loaded into editor', 'info');
        }
        this.modal.classList.remove('active');
      });
    });

    this.modal.querySelectorAll('.btn-del-snip').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteSnippet(b.dataset.id);
        this.openSaveSnippetModal(toolId);
        this.showToast('Snippet deleted', 'info');
      });
    });
  }
}

// Bootstrap Application
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
