/**
 * MapCraft - Cartographic Themes & Styling Engine
 * 7 distinct professional cartographic themes with tuned color palettes, grids, and typography styles.
 */

export const MAP_THEMES = {
  parchment: {
    id: 'parchment',
    name: 'Vintage Parchment',
    description: 'Antique fantasy & historical cartography with sepia warmth.',
    bgColor: '#f2e6cf',
    gridColor: 'rgba(92, 64, 51, 0.08)',
    textColor: '#3b2512',
    textHaloColor: '#f7eedc',
    accentColor: '#8b4513',
    defaultRouteColor: '#7b3f00',
    defaultRegionColor: '#c9a87c',
    selectionColor: '#b45309',
    fontFamily: "'Cinzel', 'Georgia', serif"
  },
  dark: {
    id: 'dark',
    name: 'Dark Slate Tactical',
    description: 'Modern tactical night cartography with high contrast.',
    bgColor: '#0f141c',
    gridColor: 'rgba(255, 255, 255, 0.07)',
    textColor: '#f1f5f9',
    textHaloColor: '#0f141c',
    accentColor: '#38bdf8',
    defaultRouteColor: '#0284c7',
    defaultRegionColor: '#0369a1',
    selectionColor: '#38bdf8',
    fontFamily: "'Inter', sans-serif"
  },
  blueprint: {
    id: 'blueprint',
    name: 'Architectural Blueprint',
    description: 'Precision engineering grid with cyan drafting aesthetics.',
    bgColor: '#0b2038',
    gridColor: 'rgba(100, 223, 223, 0.16)',
    textColor: '#e0fbfc',
    textHaloColor: '#0b2038',
    accentColor: '#64dfdf',
    defaultRouteColor: '#48cae4',
    defaultRegionColor: '#0077b6',
    selectionColor: '#64dfdf',
    fontFamily: "'JetBrains Mono', monospace"
  },
  clean: {
    id: 'clean',
    name: 'Clean Modern Editorial',
    description: 'Minimalist editorial atlas suitable for travel and urban guides.',
    bgColor: '#f8fafc',
    gridColor: 'rgba(15, 23, 42, 0.06)',
    textColor: '#0f172a',
    textHaloColor: '#ffffff',
    accentColor: '#2563eb',
    defaultRouteColor: '#dc2626',
    defaultRegionColor: '#38bdf8',
    selectionColor: '#2563eb',
    fontFamily: "'Inter', sans-serif"
  },
  terrain: {
    id: 'terrain',
    name: 'Topographic Wilderness',
    description: 'Natural forest greens, elevation contours, and earth tones.',
    bgColor: '#e8f0ec',
    gridColor: 'rgba(45, 106, 79, 0.09)',
    textColor: '#1b4332',
    textHaloColor: '#e8f0ec',
    accentColor: '#2d6a4f',
    defaultRouteColor: '#b91c1c',
    defaultRegionColor: '#52b788',
    selectionColor: '#2d6a4f',
    fontFamily: "'Inter', sans-serif"
  },
  nautical: {
    id: 'nautical',
    name: 'Nautical Sea Chart',
    description: 'Maritime navigation chart with oceanic navy and compass lines.',
    bgColor: '#e3ebf0',
    gridColor: 'rgba(30, 70, 100, 0.10)',
    textColor: '#0c2340',
    textHaloColor: '#edf3f7',
    accentColor: '#005f73',
    defaultRouteColor: '#ae2012',
    defaultRegionColor: '#94d2bd',
    selectionColor: '#0a9396',
    fontFamily: "'Cinzel', serif"
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    description: 'High-contrast glowing synthwave palette on obsidian black.',
    bgColor: '#090a0f',
    gridColor: 'rgba(247, 37, 133, 0.12)',
    textColor: '#f72585',
    textHaloColor: '#090a0f',
    accentColor: '#4cc9f0',
    defaultRouteColor: '#7209b7',
    defaultRegionColor: '#3a0ca3',
    selectionColor: '#4cc9f0',
    fontFamily: "'JetBrains Mono', monospace"
  }
};

export function getTheme(themeId = 'parchment') {
  return MAP_THEMES[themeId] || MAP_THEMES.parchment;
}
