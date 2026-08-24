/**
 * NoteSpace - DOM & Caret Utilities
 */

export function createElement(tag, className = '', innerHTML = '', attrs = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML) el.innerHTML = innerHTML;
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

export function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function sanitizeContent(html) {
  if (!html) return '';
  // Basic safe sanitization allowing standard formatting tags
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Remove script, iframe, object, form tags
  const dangerous = temp.querySelectorAll('script, iframe, object, form, embed, link, meta, style');
  dangerous.forEach(el => el.remove());

  // Remove dangerous attributes
  const allElements = temp.querySelectorAll('*');
  allElements.forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on') || attr.value.trim().toLowerCase().startsWith('javascript:')) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return temp.innerHTML;
}

/**
 * Set caret position inside a contenteditable node
 */
export function setCaretPosition(el, atEnd = true) {
  if (!el) return;
  el.focus();
  const range = document.createRange();
  const sel = window.getSelection();

  if (atEnd) {
    range.selectNodeContents(el);
    range.collapse(false);
  } else {
    range.selectNodeContents(el);
    range.collapse(true);
  }

  sel.removeAllRanges();
  sel.addRange(range);
}

/**
 * Get selection bounding rect for positioning floating menus
 */
export function getSelectionRect() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return null;
  }
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return null;
  return rect;
}

/**
 * Format date nicely (relative or absolute)
 */
export function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Debounce helper
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
