/**
 * Utility functions for TaskBoard
 */

window.Utils = {
  // Generate a random unique ID with prefix
  uid(prefix = 'id') {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
  },

  // HTML escaping for safety
  escapeHtml(str) {
    if (str === null || str === undefined) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  // Debounce function
  debounce(func, wait = 250) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Date formatting helpers
  formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  formatShortDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  },

  relativeTime(dateStr) {
    if (!dateStr) return '';
    const now = new Date();
    const then = new Date(dateStr);
    const diffSec = Math.floor((now - then) / 1000);

    if (diffSec < 60) return 'just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 30) return `${diffDay}d ago`;
    return this.formatShortDate(dateStr);
  },

  isOverdue(dueDateStr) {
    if (!dueDateStr) return false;
    const due = new Date(dueDateStr);
    due.setHours(23, 59, 59, 999);
    return due.getTime() < Date.now();
  },

  isToday(dateStr) {
    if (!dateStr) return false;
    const target = new Date(dateStr);
    const today = new Date();
    return target.getFullYear() === today.getFullYear() &&
           target.getMonth() === today.getMonth() &&
           target.getDate() === today.getDate();
  },

  isThisWeek(dateStr) {
    if (!dateStr) return false;
    const target = new Date(dateStr);
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    return target >= startOfWeek && target < endOfWeek;
  },

  isNextWeek(dateStr) {
    if (!dateStr) return false;
    const target = new Date(dateStr);
    const now = new Date();
    const startOfNextWeek = new Date(now);
    startOfNextWeek.setDate(now.getDate() - now.getDay() + 7);
    startOfNextWeek.setHours(0, 0, 0, 0);
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 7);
    return target >= startOfNextWeek && target < endOfNextWeek;
  },

  // Color contrast calculator (returns light or dark text color)
  getContrastColor(hexColor) {
    if (!hexColor || hexColor.indexOf('#') !== 0) return '#ffffff';
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 140) ? '#111827' : '#ffffff';
  },

  // Download JSON payload as a file
  downloadJSON(data, filename = 'taskboard-workspace.json') {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Read JSON file from file input
  readJSONFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          resolve(json);
        } catch (err) {
          reject(new Error('Invalid JSON file format.'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file.'));
      reader.readAsText(file);
    });
  },

  // Minimal Markdown-like rendering (bold, italics, links, lists, code)
  renderMarkdown(text) {
    if (!text) return '';
    let html = this.escapeHtml(text);
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    // Line breaks to <br>
    html = html.replace(/\n/g, '<br>');
    return html;
  }
};
