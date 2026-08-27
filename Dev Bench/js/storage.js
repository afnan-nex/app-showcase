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

export function getTheme() {
  const val = safeGetItem(STORAGE_KEYS.THEME);
  return (val === 'light' || val === 'dark') ? val : 'dark';
}

export function setTheme(theme) {
  safeSetItem(STORAGE_KEYS.THEME, theme === 'light' ? 'light' : 'dark');
}

export function getFavorites() {
  const raw = safeGetItem(STORAGE_KEYS.FAVORITES);
  if (!raw) return DEFAULT_FAVORITES;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_FAVORITES;
  } catch (e) {
    return DEFAULT_FAVORITES;
  }
}

export function toggleFavorite(toolId) {
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

export function getRecentTools() {
  const raw = safeGetItem(STORAGE_KEYS.RECENT);
  if (!raw) return DEFAULT_RECENTS;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_RECENTS;
  } catch (e) {
    return DEFAULT_RECENTS;
  }
}

export function recordRecentTool(toolId) {
  if (!toolId) return;
  let recents = getRecentTools().filter(id => id !== toolId);
  recents.unshift(toolId);
  if (recents.length > 8) recents = recents.slice(0, 8);
  safeSetItem(STORAGE_KEYS.RECENT, JSON.stringify(recents));
}

export function getOpenTabs() {
  const raw = safeGetItem(STORAGE_KEYS.OPEN_TABS);
  if (!raw) return ['json-formatter'];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : ['json-formatter'];
  } catch (e) {
    return ['json-formatter'];
  }
}

export function saveOpenTabs(tabs) {
  if (Array.isArray(tabs) && tabs.length > 0) {
    safeSetItem(STORAGE_KEYS.OPEN_TABS, JSON.stringify(tabs));
  }
}

export function getActiveTab() {
  return safeGetItem(STORAGE_KEYS.ACTIVE_TAB) || 'json-formatter';
}

export function saveActiveTab(tabId) {
  if (tabId) {
    safeSetItem(STORAGE_KEYS.ACTIVE_TAB, tabId);
  }
}

/**
 * Tool Input History Stack
 */
export function getToolHistory(toolId) {
  const raw = safeGetItem(STORAGE_KEYS.HISTORY);
  if (!raw) return [];
  try {
    const all = JSON.parse(raw);
    return Array.isArray(all[toolId]) ? all[toolId] : [];
  } catch (e) {
    return [];
  }
}

export function addToolHistory(toolId, inputVal) {
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

export function clearToolHistory(toolId) {
  try {
    const raw = safeGetItem(STORAGE_KEYS.HISTORY);
    const all = raw ? JSON.parse(raw) : {};
    delete all[toolId];
    safeSetItem(STORAGE_KEYS.HISTORY, JSON.stringify(all));
  } catch (e) {}
}

export function clearAllHistory() {
  safeSetItem(STORAGE_KEYS.HISTORY, JSON.stringify({}));
}

/**
 * Saved Snippets
 */
export function getSavedSnippets(toolId = null) {
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

export function saveSnippet(toolId, title, content) {
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

export function deleteSnippet(snippetId) {
  try {
    let list = getSavedSnippets();
    list = list.filter(s => s.id !== snippetId);
    safeSetItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(list));
  } catch (e) {}
}
