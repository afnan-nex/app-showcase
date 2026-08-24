/**
 * DataLens - Theme Manager (Light & Dark Themes)
 */

class ThemeManager {
  constructor() {
    this.currentTheme = 'dark';
  }

  async init() {
    const savedTheme = await window.dataLensStorage.getSetting('app_theme', 'dark');
    this.setTheme(savedTheme);

    const toggleBtn = document.getElementById('btn-theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    window.dataLensStorage.saveSetting('app_theme', theme);
    this.updateToggleIcon();
  }

  toggleTheme() {
    const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  updateToggleIcon() {
    const iconEl = document.getElementById('theme-toggle-icon');
    if (!iconEl) return;

    if (this.currentTheme === 'dark') {
      // Sun icon to switch to light
      iconEl.innerHTML = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>';
    } else {
      // Moon icon to switch to dark
      iconEl.innerHTML = '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
    }
  }
}

window.ThemeManager = new ThemeManager();
