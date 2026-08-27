/**
 * PixelForge - Curated Retro Pixel Art Color Palettes
 * Famous retro hardware palettes (PICO-8, Game Boy, C64, NES, Cyberpunk, Endesga 32).
 */

export const PALETTES = {
  pico8: {
    id: 'pico8',
    name: 'PICO-8 (16 Colors)',
    colors: [
      '#000000', '#1D2B53', '#7E2553', '#008751',
      '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8',
      '#FF004D', '#FFA300', '#FFEC27', '#00E436',
      '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA'
    ]
  },
  gameboy: {
    id: 'gameboy',
    name: 'Game Boy DMG (4 Shades)',
    colors: [
      '#0f380f', '#306230', '#8bac0f', '#9bbc0f'
    ]
  },
  c64: {
    id: 'c64',
    name: 'Commodore 64 (16 Colors)',
    colors: [
      '#000000', '#FFFFFF', '#880000', '#AAFFEE',
      '#CC44CC', '#00CC55', '#0000AA', '#EEEE77',
      '#DD8855', '#664400', '#FF7777', '#333333',
      '#777777', '#AAFF66', '#0088FF', '#BBBBBB'
    ]
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon (16 Colors)',
    colors: [
      '#0d0221', '#0f084b', '#26408b', '#0d0887',
      '#6a00a8', '#b12a90', '#e16462', '#fca636',
      '#f0f921', '#05ffa1', '#01cdfe', '#ff71ce',
      '#01ffff', '#ffffff', '#7928ca', '#ff007f'
    ]
  },
  endesga32: {
    id: 'endesga32',
    name: 'EDG 32 (Fantasy & RPG)',
    colors: [
      '#be4a2f', '#d77643', '#ead4aa', '#e4a672',
      '#b86f50', '#733e39', '#3e2731', '#a22633',
      '#e43b44', '#f77622', '#feae34', '#fee761',
      '#63c74d', '#3e8948', '#265c42', '#193c3e',
      '#124e89', '#0099db', '#2ce8f5', '#ffffff',
      '#c0cbdc', '#8b9bb4', '#5a6988', '#3a4466',
      '#262b44', '#181425', '#ff0044', '#68386c',
      '#b55088', '#f6757a', '#e8b796', '#c28569'
    ]
  }
};

export function getPalette(id = 'pico8') {
  return PALETTES[id] || PALETTES.pico8;
}
