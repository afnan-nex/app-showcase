/**
 * MapCraft - Cartographic Themes & Styling Engine
 * Provides distinct cartographic styles (Parchment, Dark Slate, Blueprint, Clean, Terrain).
 */

export const MAP_THEMES = {
  parchment: {
    id: 'parchment',
    name: 'Vintage Parchment',
    bgColor: '#eaddc7',
    gridColor: 'rgba(92, 64, 51, 0.08)',
    textColor: '#3b2f2f',
    textHaloColor: '#f4ede2',
    accentColor: '#8b4513',
    defaultRouteColor: '#7b3f00',
    defaultRegionColor: '#c9b097',
    borderStyle: 'dashed'
  },
  dark: {
    id: 'dark',
    name: 'Dark Slate Cartography',
    bgColor: '#0d1117',
    gridColor: 'rgba(255, 255, 255, 0.06)',
    textColor: '#f0f6fc',
    textHaloColor: '#0d1117',
    accentColor: '#58a6ff',
    defaultRouteColor: '#388bfd',
    defaultRegionColor: '#1f6feb',
    borderStyle: 'solid'
  },
  blueprint: {
    id: 'blueprint',
    name: 'Architectural Blueprint',
    bgColor: '#0a2540',
    gridColor: 'rgba(100, 223, 223, 0.15)',
    textColor: '#ffffff',
    textHaloColor: '#0a2540',
    accentColor: '#64dfdf',
    defaultRouteColor: '#48cae4',
    defaultRegionColor: '#0077b6',
    borderStyle: 'solid'
  },
  clean: {
    id: 'clean',
    name: 'Clean Modern Editorial',
    bgColor: '#f8f9fa',
    gridColor: 'rgba(0, 0, 0, 0.05)',
    textColor: '#212529',
    textHaloColor: '#ffffff',
    accentColor: '#0d6efd',
    defaultRouteColor: '#dc3545',
    defaultRegionColor: '#0dcaf0',
    borderStyle: 'solid'
  },
  terrain: {
    id: 'terrain',
    name: 'Topographic Terrain',
    bgColor: '#e3ece9',
    gridColor: 'rgba(60, 90, 80, 0.08)',
    textColor: '#1b3b2b',
    textHaloColor: '#e3ece9',
    accentColor: '#2d6a4f',
    defaultRouteColor: '#d90429',
    defaultRegionColor: '#52b788',
    borderStyle: 'solid'
  }
};

export function getTheme(themeId = 'parchment') {
  return MAP_THEMES[themeId] || MAP_THEMES.parchment;
}
