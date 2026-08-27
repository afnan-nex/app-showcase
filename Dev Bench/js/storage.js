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

export function getTheme() {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  } catch (e) {
    return 'dark';
  }
}

export function setTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {}
}

export function getFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : DEFAULT_FAVORITES;
  } catch (e) {
    return DEFAULT_FAVORITES;
  }
}

export function toggleFavorite(toolId) {
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

export function getRecentTools() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENT);
    return raw ? JSON.parse(raw) : ['json-formatter', 'jwt-decoder', 'uuid-gen', 'hash-gen'];
  } catch (e) {
    return [];
  }
}

export function recordRecentTool(toolId) {
  let recents = getRecentTools().filter(id => id !== toolId);
  recents.unshift(toolId);
  if (recents.length > 8) recents = recents.slice(0, 8);
  try {
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(recents));
  } catch (e) {}
}

export function getOpenTabs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OPEN_TABS);
    return raw ? JSON.parse(raw) : ['json-formatter'];
  } catch (e) {
    return ['json-formatter'];
  }
}

export function saveOpenTabs(tabs) {
  try {
    localStorage.setItem(STORAGE_KEYS.OPEN_TABS, JSON.stringify(tabs));
  } catch (e) {}
}

export function getActiveTab() {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB) || 'json-formatter';
  } catch (e) {
    return 'json-formatter';
  }
}

export function saveActiveTab(tabId) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tabId);
  } catch (e) {}
}

/**
 * Tool Input History Stack
 */
export function getToolHistory(toolId) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '{}');
    return all[toolId] || [];
  } catch (e) {
    return [];
  }
}

export function addToolHistory(toolId, inputVal) {
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

export function clearToolHistory(toolId) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '{}');
    delete all[toolId];
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(all));
  } catch (e) {}
}

/**
 * Saved Snippets
 */
export function getSavedSnippets(toolId = null) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SNIPPETS);
    const list = raw ? JSON.parse(raw) : [];
    if (toolId) return list.filter(s => s.toolId === toolId);
    return list;
  } catch (e) {
    return [];
  }
}

export function saveSnippet(toolId, title, content) {
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

export function deleteSnippet(snippetId) {
  try {
    let list = getSavedSnippets();
    list = list.filter(s => s.id !== snippetId);
    localStorage.setItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(list));
  } catch (e) {}
}
