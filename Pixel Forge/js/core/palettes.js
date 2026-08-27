/**
 * PixelForge - Curated Retro Pixel Art Color Palettes
 * Authentic hardware palettes (PICO-8, Game Boy DMG/Pocket, Commodore 64, NES Classic,
 * Cyberpunk Neon, Endesga 32, Sweetie 16, Solarized Dark, Resurrect 64).
 */

export const PALETTES = {
  pico8: {
    id: 'pico8',
    name: 'PICO-8 (16 Colors)',
    category: 'Retro Console',
    colors: [
      '#000000', '#1D2B53', '#7E2553', '#008751',
      '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8',
      '#FF004D', '#FFA300', '#FFEC27', '#00E436',
      '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA'
    ]
  },
  gameboy: {
    id: 'gameboy',
    name: 'Game Boy DMG (4 Greens)',
    category: 'Handheld',
    colors: [
      '#0f380f', '#306230', '#8bac0f', '#9bbc0f'
    ]
  },
  gb_pocket: {
    id: 'gb_pocket',
    name: 'Game Boy Pocket (4 Monochromes)',
    category: 'Handheld',
    colors: [
      '#181818', '#606060', '#a8a8a8', '#f8f8f8'
    ]
  },
  c64: {
    id: 'c64',
    name: 'Commodore 64 (16 Colors)',
    category: 'Microcomputer',
    colors: [
      '#000000', '#FFFFFF', '#880000', '#AAFFEE',
      '#CC44CC', '#00CC55', '#0000AA', '#EEEE77',
      '#DD8855', '#664400', '#FF7777', '#333333',
      '#777777', '#AAFF66', '#0088FF', '#BBBBBB'
    ]
  },
  nes: {
    id: 'nes',
    name: 'NES Famicom Classic (32 Selected)',
    category: 'Retro Console',
    colors: [
      '#000000', '#7C7C7C', '#0000FC', '#0000BC',
      '#4428BC', '#940084', '#A80020', '#A81000',
      '#881400', '#503000', '#007800', '#006800',
      '#005800', '#004058', '#BCBCBC', '#0078F8',
      '#0058F8', '#6844FC', '#D800CC', '#E40058',
      '#F83800', '#E45C10', '#AC7C00', '#00B800',
      '#00A800', '#00A844', '#008888', '#FFFFFF',
      '#3CBCFC', '#6888FC', '#9878F8', '#F878F8'
    ]
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon (16 Colors)',
    category: 'Thematic',
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
    category: 'Game Design',
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
  },
  sweetie16: {
    id: 'sweetie16',
    name: 'Sweetie 16 (Cozy & Vibrant)',
    category: 'Game Design',
    colors: [
      '#1a1c2c', '#5d275d', '#b13e53', '#ef7d57',
      '#ffcd75', '#a7f070', '#38b764', '#257179',
      '#29366f', '#3b5dc9', '#41a6f6', '#73eff7',
      '#f4f4f4', '#94b0c2', '#566c86', '#333c57'
    ]
  },
  solarized: {
    id: 'solarized',
    name: 'Solarized Dark (16 Colors)',
    category: 'Modern Retro',
    colors: [
      '#002b36', '#073642', '#586e75', '#657b83',
      '#839496', '#93a1a1', '#eee8d5', '#fdf6e3',
      '#b58900', '#cb4b16', '#dc322f', '#d33682',
      '#6c71c4', '#268bd2', '#2aa198', '#859900'
    ]
  },
  resurrect64: {
    id: 'resurrect64',
    name: 'Resurrect 64 (Complete Game Suite)',
    category: 'Game Design',
    colors: [
      '#2e222f', '#3e3546', '#625565', '#966c6c',
      '#ab947a', '#697b54', '#466c64', '#285866',
      '#1e4056', '#142036', '#000000', '#25212c',
      '#37293d', '#53354a', '#814156', '#b05252',
      '#df6d50', '#ff9a60', '#ffc57a', '#f5e49a',
      '#8cc856', '#4e9b46', '#2d6a45', '#1e483b',
      '#2c5d63', '#398b93', '#4fc1be', '#9ce9d2',
      '#ffffff', '#c7cfdd', '#9099aa', '#596070',
      '#3c394a', '#302636', '#59293e', '#893246',
      '#b7454f', '#db6b56', '#f29f6d', '#ffd08a',
      '#f7f0ad', '#bfe27d', '#7bc65b', '#489849',
      '#306a46', '#22463e', '#1c343b', '#264f5b',
      '#357884', '#4cb3b8', '#89ecda', '#e2fcf7',
      '#c0cad8', '#8994a5', '#575f6e', '#393c48',
      '#2a2330', '#442232', '#692a3e', '#9b384c',
      '#cc4d53', '#eb7a59', '#faa772', '#ffcd8f'
    ]
  }
};

export function getPalette(id = 'pico8') {
  return PALETTES[id] || PALETTES.pico8;
}

export function parseHexPalette(text) {
  const lines = text.split('\n');
  const colors = [];
  for (let line of lines) {
    line = line.trim().replace(/^#/, '');
    if (/^[0-9A-Fa-f]{6}$/.test(line)) {
      colors.push('#' + line);
    } else if (/^[0-9A-Fa-f]{3}$/.test(line)) {
      colors.push('#' + line.split('').map(c => c + c).join(''));
    }
  }
  return colors;
}

export function exportHexPalette(colors) {
  return colors.map(c => c.replace('#', '')).join('\n');
}

export default PALETTES;
