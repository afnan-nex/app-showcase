/**
 * PixelForge - Standalone Pixel Art Creation & Animation Workstation Bundle
 * Multi-layer pixel art editor, sprite animator, and tilemap editor.
 * 100% Client-Side, Zero Backend, Works on HTTP & file:///
 */

(function() {
'use strict';


/* --- MODULE: js/core/icons.js --- */
/**
 * PixelForge - Local SVG Icons Registry
 * Crisp pixel art tool icons, animation controls, and IDE icons.
 */

const ICONS = {
  // Tools
  pencil: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`,
  eraser: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path><path d="M22 21H7"></path><path d="m5 11 9 9"></path></svg>`,
  line: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="19" x2="19" y2="5"></line><circle cx="5" cy="19" r="2"></circle><circle cx="19" cy="5" r="2"></circle></svg>`,
  rect: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>`,
  rectFill: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>`,
  circle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle></svg>`,
  circleFill: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9"></circle></svg>`,
  bucket: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"></path><path d="m5 2 5 5"></path><path d="M2 13h15"></path><path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z"></path></svg>`,
  picker: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14 2 4 4L6 18l-4 1 1-4L14 2Z"></path><path d="m11 5 4 4"></path></svg>`,
  dither: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="6" height="6" fill="currentColor"></rect><rect x="15" y="3" width="6" height="6"></rect><rect x="3" y="15" width="6" height="6"></rect><rect x="15" y="15" width="6" height="6" fill="currentColor"></rect></svg>`,
  select: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="3 3"><rect x="3" y="3" width="18" height="18" rx="1"></rect></svg>`,
  move: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>`,
  mirror: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22" stroke-dasharray="2 2"></line><path d="M4 18l6-6-6-6v12z"></path><path d="M20 18l-6-6 6-6v12z"></path></svg>`,

  // UI & Playback Controls
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
  pause: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`,
  onion: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" stroke-dasharray="3 3"></circle><circle cx="12" cy="12" r="5"></circle></svg>`,
  loop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>`,
  undo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>`,
  redo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
  unlock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
  swap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="8 21 3 21 3 16"></polyline><line x1="15" y1="9" x2="20" y2="4"></line></svg>`,
  tiles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h7v7H4z"></path><path d="M13 4h7v7h-7z"></path><path d="M4 13h7v7H4z"></path><path d="M13 13h7v7h-7z"></path></svg>`
};

function getIcon(name, extraClass = '') {
  const svg = ICONS[name] || ICONS.pencil;
  if (!extraClass) return svg;
  return svg.replace('<svg ', `<svg class="${extraClass}" `);
}

function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

ICONS;


/* --- MODULE: js/core/math-draw.js --- */
/**
 * PixelForge - Core Pixel Drawing Algorithms
 * High-performance Bresenham lines, midpoint circles, flood fill, Bayer dithering, and pixel-perfect strokes.
 */

// --- 1. Bresenham's Line Algorithm ---
function getLinePixels(x0, y0, x1, y1) {
  const points = [];
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  let sx = x0 < x1 ? 1 : -1;
  let sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  let currX = x0;
  let currY = y0;

  while (true) {
    points.push({ x: currX, y: currY });
    if (currX === x1 && currY === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      currX += sx;
    }
    if (e2 < dx) {
      err += dx;
      currY += sy;
    }
  }

  return points;
}

// --- 2. Rectangle Algorithm ---
function getRectPixels(x0, y0, x1, y1, filled = false) {
  const points = [];
  const minX = Math.min(x0, x1);
  const maxX = Math.max(x0, x1);
  const minY = Math.min(y0, y1);
  const maxY = Math.max(y0, y1);

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (filled || x === minX || x === maxX || y === minY || y === maxY) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

// --- 3. Midpoint Circle / Ellipse Algorithm ---
function getCirclePixels(cx, cy, radius, filled = false) {
  const points = [];
  const r = Math.round(radius);
  if (r <= 0) return [{ x: cx, y: cy }];

  if (filled) {
    for (let y = -r; y <= r; y++) {
      for (let x = -r; x <= r; x++) {
        if (x * x + y * y <= r * r) {
          points.push({ x: cx + x, y: cy + y });
        }
      }
    }
    return points;
  }

  // Circle outline
  let x = r;
  let y = 0;
  let err = 1 - r;

  const plot8 = (px, py) => {
    points.push(
      { x: cx + px, y: cy + py },
      { x: cx - px, y: cy + py },
      { x: cx + px, y: cy - py },
      { x: cx - px, y: cy - py },
      { x: cx + py, y: cy + px },
      { x: cx - py, y: cy + px },
      { x: cx + py, y: cy - px },
      { x: cx - py, y: cy - px }
    );
  };

  while (x >= y) {
    plot8(x, y);
    y++;
    if (err <= 0) {
      err += 2 * y + 1;
    } else {
      x--;
      err += 2 * (y - x) + 1;
    }
  }

  return points;
}

// --- 4. Queue-Based 4-Way Flood Fill Algorithm ---
function floodFill(pixels, width, height, startX, startY, targetColor) {
  if (startX < 0 || startX >= width || startY < 0 || startY >= height) return [];

  const startIndex = startY * width + startX;
  const originalColor = pixels[startIndex] || null;

  if (originalColor === targetColor) return [];

  const modified = [];
  const queue = [[startX, startY]];
  const visited = new Uint8Array(width * height);
  visited[startIndex] = 1;

  while (queue.length > 0) {
    const [x, y] = queue.pop();
    const idx = y * width + x;

    modified.push({ x, y, color: targetColor });

    // 4 neighbors (North, South, East, West)
    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!visited[nIdx] && (pixels[nIdx] || null) === originalColor) {
          visited[nIdx] = 1;
          queue.push([nx, ny]);
        }
      }
    }
  }

  return modified;
}

// --- 5. Bayer 2x2 / 4x4 Dithering ---
const BAYER_4X4 = [
  [ 0,  8,  2, 10],
  [12,  4, 14,  6],
  [ 3, 11,  1,  9],
  [15,  7, 13,  5]
];

function getDitherColor(x, y, color1, color2, threshold = 8) {
  const bx = Math.abs(x) % 4;
  const by = Math.abs(y) % 4;
  return BAYER_4X4[by][bx] >= threshold ? color1 : color2;
}

// --- 6. Pixel-Perfect Stroke Filter (removes L-shaped double corners) ---
function filterPixelPerfect(strokePoints) {
  if (strokePoints.length < 3) return strokePoints;

  const result = [strokePoints[0]];

  for (let i = 1; i < strokePoints.length - 1; i++) {
    const prev = strokePoints[i - 1];
    const curr = strokePoints[i];
    const next = strokePoints[i + 1];

    // Check if curr is an redundant corner in an L-shape
    const dx1 = curr.x - prev.x;
    const dy1 = curr.y - prev.y;
    const dx2 = next.x - curr.x;
    const dy2 = next.y - curr.y;

    const isCorner = (dx1 !== 0 && dy2 !== 0 && dx2 === 0 && dy1 === 0) ||
                     (dy1 !== 0 && dx2 !== 0 && dy1 === 0 && dx1 === 0);

    if (isCorner && Math.abs(next.x - prev.x) === 1 && Math.abs(next.y - prev.y) === 1) {
      continue; // Skip redundant pixel
    }

    result.push(curr);
  }

  result.push(strokePoints[strokePoints.length - 1]);
  return result;
}

// --- Color Helpers ---
function hexToRgb(hex) {
  if (!hex) return { r: 0, g: 0, b: 0, a: 1 };
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
    a: 1
  };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function hsvToRgb(h, s, v) {
  let r, g, b;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}


/* --- MODULE: js/core/palettes.js --- */
/**
 * PixelForge - Curated Retro Pixel Art Color Palettes
 * Famous retro hardware palettes (PICO-8, Game Boy, C64, NES, Cyberpunk, Endesga 32).
 */

const PALETTES = {
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

function getPalette(id = 'pico8') {
  return PALETTES[id] || PALETTES.pico8;
}


/* --- MODULE: js/core/db.js --- */
/**
 * PixelForge - IndexedDB Persistence Engine
 * Saves pixel art projects, multi-frame animations, layers, and custom color palettes.
 */

const DB_NAME = 'PixelForge_DB';
const DB_VERSION = 1;
const STORES = {
  PROJECTS: 'projects',
  SETTINGS: 'settings'
};

class PixelForgeDatabase {
  constructor() {
    this.db = null;
  }

  async init() {
    if (typeof indexedDB === 'undefined') return;

    return new Promise((resolve) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORES.PROJECTS)) {
          db.createObjectStore(STORES.PROJECTS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      request.onerror = () => {
        console.warn('IndexedDB unavailable, using LocalStorage fallback.');
        resolve(null);
      };
    });
  }

  async saveProject(project) {
    if (!project || !project.id) return;
    project.updatedAt = new Date().toISOString();

    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORES.PROJECTS], 'readwrite');
        tx.objectStore(STORES.PROJECTS).put(project);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    }

    try {
      localStorage.setItem('pixelforge_proj_' + project.id, JSON.stringify(project));
      localStorage.setItem('pixelforge_last_project_id', project.id);
    } catch (e) {}
  }

  async loadProject(id) {
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORES.PROJECTS], 'readonly');
        const req = tx.objectStore(STORES.PROJECTS).get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    }

    try {
      const raw = localStorage.getItem('pixelforge_proj_' + id);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  async getAllProjects() {
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORES.PROJECTS], 'readonly');
        const req = tx.objectStore(STORES.PROJECTS).getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    }

    const list = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('pixelforge_proj_')) {
          list.push(JSON.parse(localStorage.getItem(key)));
        }
      }
    } catch (e) {}
    return list;
  }
}

const db = new PixelForgeDatabase();
db;


/* --- MODULE: js/engine/canvas-renderer.js --- */
/**
 * PixelForge - High-Performance Canvas 2D Pixel Renderer
 * Renders pixel-accurate grid, multi-layer compositing, onion skinning, symmetry lines, and selection marquees.
 */

class CanvasRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0, zoom: 16 }; // Default 16x pixel zoom

    // Disable image smoothing for ultra-crisp pixel art
    this.ctx.imageSmoothingEnabled = false;
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.imageSmoothingEnabled = false;
  }

  render({
    project,
    activeFrameIndex = 0,
    activeLayerId = null,
    showGrid = true,
    showOnionSkin = false,
    symmetryMode = 'none', // none, horizontal, vertical, both
    activePreviewPixels = [],
    selection = null,
    cursorPos = null,
    brushSize = 1
  }) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const pw = project.width || 32;
    const ph = project.height || 32;
    const zoom = this.camera.zoom;

    // 1. Clear Viewport
    ctx.fillStyle = '#0f1117';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    // 2. Camera Transform (Pan & Zoom)
    ctx.translate(this.camera.x, this.camera.y);
    ctx.scale(zoom, zoom);

    // 3. Canvas Bounds Shadow & Border
    ctx.fillStyle = '#181b24';
    ctx.fillRect(0, 0, pw, ph);

    // 4. Checkerboard Transparency Pattern
    this.drawCheckerboard(pw, ph);

    // 5. Onion Skinning (Previous Frame in Cyan / Next in Red)
    if (showOnionSkin && project.frames && project.frames.length > 1) {
      this.drawOnionSkin(project, activeFrameIndex);
    }

    // 6. Composite Active Frame Layers
    const currentFrame = project.frames ? project.frames[activeFrameIndex] : null;
    if (currentFrame) {
      const layers = currentFrame.layers || [];
      for (const layer of layers) {
        if (layer.visible === false) continue;
        this.renderLayer(layer, pw, ph);
      }
    }

    // 7. Active Tool Drawing Preview
    if (activePreviewPixels && activePreviewPixels.length > 0) {
      for (const p of activePreviewPixels) {
        if (p.x >= 0 && p.x < pw && p.y >= 0 && p.y < ph) {
          ctx.fillStyle = p.color || '#ffffff';
          ctx.fillRect(p.x, p.y, 1, 1);
        }
      }
    }

    // 8. Selection Marquee
    if (selection) {
      this.drawSelectionMarquee(selection);
    }

    // 9. Symmetry Mirror Guidelines
    if (symmetryMode !== 'none') {
      this.drawSymmetryLines(pw, ph, symmetryMode, zoom);
    }

    // 10. Pixel Grid Overlay (when zoom >= 6x)
    if (showGrid && zoom >= 6) {
      this.drawPixelGrid(pw, ph, zoom);
    }

    // 11. Cursor Hover Indicator
    if (cursorPos && cursorPos.x >= 0 && cursorPos.x < pw && cursorPos.y >= 0 && cursorPos.y < ph) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1 / zoom;
      const offset = Math.floor(brushSize / 2);
      ctx.strokeRect(cursorPos.x - offset, cursorPos.y - offset, brushSize, brushSize);
    }

    ctx.restore();
  }

  // --- Checkerboard Transparency ---
  drawCheckerboard(pw, ph) {
    const ctx = this.ctx;
    for (let y = 0; y < ph; y++) {
      for (let x = 0; x < pw; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? '#1e2330' : '#282e3f';
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  // --- Single Layer Renderer ---
  renderLayer(layer, pw, ph) {
    if (!layer.pixels) return;
    const ctx = this.ctx;
    ctx.save();
    if (layer.opacity !== undefined) {
      ctx.globalAlpha = layer.opacity;
    }

    const pixels = layer.pixels;
    for (let y = 0; y < ph; y++) {
      for (let x = 0; x < pw; x++) {
        const color = pixels[y * pw + x];
        if (color && color !== 'transparent') {
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    ctx.restore();
  }

  // --- Onion Skinning ---
  drawOnionSkin(project, activeIndex) {
    const ctx = this.ctx;
    const pw = project.width;
    const ph = project.height;

    // Previous Frame
    if (activeIndex > 0) {
      const prevFrame = project.frames[activeIndex - 1];
      ctx.save();
      ctx.globalAlpha = 0.25;
      for (const l of prevFrame.layers) {
        if (l.visible === false) continue;
        for (let y = 0; y < ph; y++) {
          for (let x = 0; x < pw; x++) {
            const col = l.pixels[y * pw + x];
            if (col && col !== 'transparent') {
              ctx.fillStyle = '#00e5ff'; // Cyan tint for past frame
              ctx.fillRect(x, y, 1, 1);
            }
          }
        }
      }
      ctx.restore();
    }

    // Next Frame
    if (activeIndex < project.frames.length - 1) {
      const nextFrame = project.frames[activeIndex + 1];
      ctx.save();
      ctx.globalAlpha = 0.25;
      for (const l of nextFrame.layers) {
        if (l.visible === false) continue;
        for (let y = 0; y < ph; y++) {
          for (let x = 0; x < pw; x++) {
            const col = l.pixels[y * pw + x];
            if (col && col !== 'transparent') {
              ctx.fillStyle = '#ff1744'; // Red tint for future frame
              ctx.fillRect(x, y, 1, 1);
            }
          }
        }
      }
      ctx.restore();
    }
  }

  // --- Pixel Grid ---
  drawPixelGrid(pw, ph, zoom) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1 / zoom;

    ctx.beginPath();
    for (let x = 0; x <= pw; x++) {
      ctx.moveTo(x, 0); ctx.lineTo(x, ph);
    }
    for (let y = 0; y <= ph; y++) {
      ctx.moveTo(0, y); ctx.lineTo(pw, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // --- Symmetry Guidelines ---
  drawSymmetryLines(pw, ph, mode, zoom) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 1.5 / zoom;
    ctx.setLineDash([2 / zoom, 2 / zoom]);

    if (mode === 'vertical' || mode === 'both') {
      const midX = pw / 2;
      ctx.beginPath();
      ctx.moveTo(midX, 0); ctx.lineTo(midX, ph);
      ctx.stroke();
    }
    if (mode === 'horizontal' || mode === 'both') {
      const midY = ph / 2;
      ctx.beginPath();
      ctx.moveTo(0, midY); ctx.lineTo(pw, midY);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- Selection Marquee ---
  drawSelectionMarquee(sel) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1 / this.camera.zoom;
    ctx.setLineDash([3 / this.camera.zoom, 3 / this.camera.zoom]);

    const x = Math.min(sel.x0, sel.x1);
    const y = Math.min(sel.y0, sel.y1);
    const w = Math.abs(sel.x1 - sel.x0) + 1;
    const h = Math.abs(sel.y1 - sel.y0) + 1;

    ctx.fillStyle = 'rgba(88, 166, 255, 0.2)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
  }
}


/* --- MODULE: js/engine/animation.js --- */
/**
 * PixelForge - Animation Playback, Sprite Sheet, Animated SVG & Video Exporter
 * Frame playback loop, FPS timing, animated SVG generation, and MediaRecorder video export.
 */

class AnimationEngine {
  constructor(app) {
    this.app = app;
    this.isPlaying = false;
    this.fps = 8;
    this.isLooping = true;
    this.currentFrame = 0;
    this.timer = null;
    this.lastTime = 0;
    this.accumulatedTime = 0;
  }

  play() {
    this.isPlaying = true;
    this.lastTime = performance.now();
    this.accumulatedTime = 0;
    this.loop = this.loop.bind(this);
    this.animId = requestAnimationFrame(this.loop);
  }

  pause() {
    this.isPlaying = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  togglePlay() {
    if (this.isPlaying) this.pause();
    else this.play();
  }

  loop(currentTime) {
    if (!this.isPlaying) return;

    const dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    this.accumulatedTime += dt;

    const frameDuration = 1 / this.fps;
    if (this.accumulatedTime >= frameDuration) {
      this.accumulatedTime -= frameDuration;
      this.stepNext();
    }

    this.animId = requestAnimationFrame(this.loop);
  }

  stepNext() {
    const totalFrames = (this.app.project.frames || []).length;
    if (totalFrames <= 1) return;

    if (this.app.activeFrameIndex < totalFrames - 1) {
      this.app.setFrame(this.app.activeFrameIndex + 1);
    } else if (this.isLooping) {
      this.app.setFrame(0);
    } else {
      this.pause();
    }
  }

  stepPrev() {
    const totalFrames = (this.app.project.frames || []).length;
    if (totalFrames <= 1) return;

    if (this.app.activeFrameIndex > 0) {
      this.app.setFrame(this.app.activeFrameIndex - 1);
    } else {
      this.app.setFrame(totalFrames - 1);
    }
  }

  // --- Sprite Sheet Generator ---
  generateSpriteSheet(columns = null, scale = 1) {
    const project = this.app.project;
    const frames = project.frames || [];
    const numFrames = frames.length;
    const fw = project.width * scale;
    const fh = project.height * scale;

    const cols = columns || numFrames;
    const rows = Math.ceil(numFrames / cols);

    const sheetCanvas = document.createElement('canvas');
    sheetCanvas.width = cols * fw;
    sheetCanvas.height = rows * fh;
    const ctx = sheetCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    frames.forEach((frame, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const frameCanvas = this.renderFrameToCanvas(frame, project.width, project.height, scale);
      ctx.drawImage(frameCanvas, col * fw, row * fh);
    });

    return sheetCanvas;
  }

  renderFrameToCanvas(frame, width, height, scale = 1) {
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const layers = frame.layers || [];
    for (const layer of layers) {
      if (layer.visible === false) continue;
      ctx.save();
      if (layer.opacity !== undefined) ctx.globalAlpha = layer.opacity;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const color = layer.pixels[y * width + x];
          if (color && color !== 'transparent') {
            ctx.fillStyle = color;
            ctx.fillRect(x * scale, y * scale, scale, scale);
          }
        }
      }
      ctx.restore();
    }

    return canvas;
  }

  // --- Animated SVG Generator ---
  generateAnimatedSVG(scale = 10) {
    const project = this.app.project;
    const pw = project.width;
    const ph = project.height;
    const frames = project.frames || [];
    const numFrames = frames.length;
    const duration = (numFrames / this.fps).toFixed(2);

    const svgWidth = pw * scale;
    const svgHeight = ph * scale;

    let keyframesCSS = '';
    let framesSVG = '';

    frames.forEach((frame, idx) => {
      const startPercent = ((idx / numFrames) * 100).toFixed(1);
      const endPercent = (((idx + 1) / numFrames) * 100).toFixed(1);

      keyframesCSS += `
        @keyframes anim_frame_${idx} {
          0%, ${startPercent}% { opacity: 0; }
          ${(Number(startPercent) + 0.01).toFixed(2)}%, ${endPercent}% { opacity: 1; }
          ${(Number(endPercent) + 0.01).toFixed(2)}%, 100% { opacity: 0; }
        }
        .frame-${idx} {
          animation: anim_frame_${idx} ${duration}s infinite step-end;
        }
      `;

      let frameRects = '';
      const layers = frame.layers || [];
      for (const layer of layers) {
        if (layer.visible === false) continue;
        const opacity = layer.opacity !== undefined ? layer.opacity : 1;

        for (let y = 0; y < ph; y++) {
          for (let x = 0; x < pw; x++) {
            const color = layer.pixels[y * pw + x];
            if (color && color !== 'transparent') {
              frameRects += `<rect x="${x * scale}" y="${y * scale}" width="${scale}" height="${scale}" fill="${color}" ${opacity < 1 ? `opacity="${opacity}"` : ''} shape-rendering="crispEdges" />`;
            }
          }
        }
      }

      framesSVG += `
        <g class="frame frame-${idx}" id="frame_${idx}">
          ${frameRects}
        </g>
      `;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
  <style>
    .frame { opacity: 0; }
    ${keyframesCSS}
  </style>
  ${framesSVG}
</svg>`;
  }

  // --- Video Recording via Canvas Stream & MediaRecorder ---
  async recordVideo(scale = 8, loops = 3) {
    const project = this.app.project;
    const frames = project.frames || [];
    if (frames.length === 0) return null;

    const pw = project.width * scale;
    const ph = project.height * scale;

    const recCanvas = document.createElement('canvas');
    recCanvas.width = pw;
    recCanvas.height = ph;
    const ctx = recCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Check MediaRecorder support
    if (typeof MediaRecorder === 'undefined' || !recCanvas.captureStream) {
      throw new Error('MediaRecorder video capture is not supported in this browser.');
    }

    const stream = recCanvas.captureStream(this.fps);
    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/mp4';
      }
    }

    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const chunks = [];

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    const recordPromise = new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType || 'video/webm' });
        resolve(blob);
      };
    });

    recorder.start();

    // Render each frame in sequence for the designated loop count
    const frameDelay = 1000 / this.fps;

    for (let loop = 0; loop < loops; loop++) {
      for (let f = 0; f < frames.length; f++) {
        const fCanvas = this.renderFrameToCanvas(frames[f], project.width, project.height, scale);
        ctx.clearRect(0, 0, pw, ph);
        ctx.drawImage(fCanvas, 0, 0);

        await new Promise(r => setTimeout(r, frameDelay));
      }
    }

    recorder.stop();
    return await recordPromise;
  }
}


/* --- MODULE: js/engine/tilemap.js --- */
/**
 * PixelForge - Tilemap Editor Engine
 * Slices sprite art into tilesets, paints tilemap grids, and exports tile matrices.
 */

class TilemapEngine {
  constructor(app) {
    this.app = app;
    this.tileSize = 16;
    this.mapCols = 20;
    this.mapRows = 15;
    this.selectedTileIndex = 0;
    this.tiles = [];
    this.tilemapData = new Array(this.mapCols * this.mapRows).fill(-1); // -1 = Empty
  }

  sliceTilesFromProject(tileSize = 16) {
    this.tileSize = tileSize;
    this.tiles = [];
    const project = this.app.project;
    const currentFrame = project.frames[this.app.activeFrameIndex || 0];
    if (!currentFrame) return;

    const pw = project.width;
    const ph = project.height;
    const cols = Math.floor(pw / tileSize);
    const rows = Math.floor(ph / tileSize);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tilePixels = new Array(tileSize * tileSize).fill('transparent');
        for (let ty = 0; ty < tileSize; ty++) {
          for (let tx = 0; tx < tileSize; tx++) {
            const srcX = c * tileSize + tx;
            const srcY = r * tileSize + ty;

            // Merge layers for this pixel
            for (const layer of currentFrame.layers) {
              if (layer.visible === false) continue;
              const color = layer.pixels[srcY * pw + srcX];
              if (color && color !== 'transparent') {
                tilePixels[ty * tileSize + tx] = color;
              }
            }
          }
        }
        this.tiles.push({ id: this.tiles.length, pixels: tilePixels });
      }
    }
  }

  setTileAt(col, row, tileIndex) {
    if (col >= 0 && col < this.mapCols && row >= 0 && row < this.mapRows) {
      this.tilemapData[row * this.mapCols + col] = tileIndex;
    }
  }

  getTileAt(col, row) {
    if (col >= 0 && col < this.mapCols && row >= 0 && row < this.mapRows) {
      return this.tilemapData[row * this.mapCols + col];
    }
    return -1;
  }

  renderTilemapToCanvas(scale = 2) {
    const canvas = document.createElement('canvas');
    canvas.width = this.mapCols * this.tileSize * scale;
    canvas.height = this.mapRows * this.tileSize * scale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    for (let r = 0; r < this.mapRows; r++) {
      for (let c = 0; c < this.mapCols; c++) {
        const tileIdx = this.tilemapData[r * this.mapCols + c];
        if (tileIdx >= 0 && this.tiles[tileIdx]) {
          const tile = this.tiles[tileIdx];
          for (let ty = 0; ty < this.tileSize; ty++) {
            for (let tx = 0; tx < this.tileSize; tx++) {
              const color = tile.pixels[ty * this.tileSize + tx];
              if (color && color !== 'transparent') {
                ctx.fillStyle = color;
                ctx.fillRect((c * this.tileSize + tx) * scale, (r * this.tileSize + ty) * scale, scale, scale);
              }
            }
          }
        }
      }
    }

    return canvas;
  }

  exportTilemapJSON() {
    return JSON.stringify({
      tileSize: this.tileSize,
      cols: this.mapCols,
      rows: this.mapRows,
      data: [...this.tilemapData]
    }, null, 2);
  }
}


/* --- MODULE: js/editor/layer-manager.js --- */
/**
 * PixelForge - Layer Manager Component
 * Multi-layer stack controller with opacity sliders, visibility, lock, and reordering.
 */



function renderLayerPanel(container, {
  layers = [],
  activeLayerId,
  onSelectLayer = null,
  onAddLayer = null,
  onDuplicateLayer = null,
  onDeleteLayer = null,
  onToggleVisibility = null,
  onToggleLock = null,
  onOpacityChange = null,
  onMoveLayer = null,
  onMergeDown = null
}) {
  container.innerHTML = `
    <div class="panel-section-header flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-2">
        ${getIcon('layers', 'icon-sm')}
        <span class="text-xs font-bold uppercase text-muted">Layers (${layers.length})</span>
      </div>
      <button class="btn btn-xs btn-primary" id="btn-add-layer">
        ${getIcon('plus', 'icon-xs')} New Layer
      </button>
    </div>

    <!-- Scrollable Layers Stack (Top layer first in Z-Order) -->
    <div class="layers-list-scroll p-2 flex flex-col gap-1 flex-1 overflow-y-auto">
      ${[...layers].reverse().map((layer, reverseIdx) => {
        const actualIdx = layers.length - 1 - reverseIdx;
        const isActive = layer.id === activeLayerId;

        return `
          <div class="layer-item-row card p-2 flex flex-col gap-2 ${isActive ? 'active' : ''}" data-id="${layer.id}">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 flex-1 cursor-pointer layer-select-target">
                <span class="layer-name font-semibold text-xs truncate">${escapeHTML(layer.name)}</span>
              </div>

              <div class="layer-actions flex items-center gap-1">
                <button class="btn-icon-xs btn-move-layer-up" data-idx="${actualIdx}" title="Move Up in Stack" ${actualIdx === layers.length - 1 ? 'disabled' : ''}>&uarr;</button>
                <button class="btn-icon-xs btn-move-layer-down" data-idx="${actualIdx}" title="Move Down in Stack" ${actualIdx === 0 ? 'disabled' : ''}>&darr;</button>
                <button class="btn-icon-xs btn-layer-vis" data-id="${layer.id}" title="Toggle Visibility">
                  ${getIcon(layer.visible !== false ? 'eye' : 'eyeOff', 'icon-xs')}
                </button>
                <button class="btn-icon-xs btn-layer-lock" data-id="${layer.id}" title="Toggle Lock">
                  ${getIcon(layer.locked ? 'lock' : 'unlock', 'icon-xs')}
                </button>
                <button class="btn-icon-xs btn-layer-dupe" data-id="${layer.id}" title="Duplicate Layer">
                  ${getIcon('copy', 'icon-xs')}
                </button>
                ${layers.length > 1 ? `
                  <button class="btn-icon-xs text-rose btn-layer-del" data-id="${layer.id}" title="Delete Layer">
                    ${getIcon('trash', 'icon-xs')}
                  </button>
                ` : ''}
              </div>
            </div>

            <!-- Layer Opacity Slider -->
            <div class="flex items-center gap-2">
              <span class="text-xs text-muted font-mono" style="font-size: 10px;">Opacity</span>
              <input type="range" min="0" max="1" step="0.05" class="form-control form-control-sm p-0 layer-opacity-slider flex-1" data-id="${layer.id}" value="${layer.opacity !== undefined ? layer.opacity : 1}" />
              <span class="text-xs font-mono text-muted w-8 text-right opacity-label" style="font-size: 10px;">${Math.round((layer.opacity !== undefined ? layer.opacity : 1) * 100)}%</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // --- Attach Handlers ---
  container.querySelector('#btn-add-layer')?.addEventListener('click', () => {
    if (onAddLayer) onAddLayer();
  });

  container.querySelectorAll('.layer-select-target').forEach(el => {
    el.addEventListener('click', () => {
      const row = el.closest('.layer-item-row');
      if (onSelectLayer) onSelectLayer(row.dataset.id);
    });
  });

  container.querySelectorAll('.btn-layer-vis').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onToggleVisibility) onToggleVisibility(btn.dataset.id);
    });
  });

  container.querySelectorAll('.btn-layer-lock').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onToggleLock) onToggleLock(btn.dataset.id);
    });
  });

  container.querySelectorAll('.btn-layer-dupe').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onDuplicateLayer) onDuplicateLayer(btn.dataset.id);
    });
  });

  container.querySelectorAll('.btn-layer-del').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onDeleteLayer) onDeleteLayer(btn.dataset.id);
    });
  });

  container.querySelectorAll('.btn-move-layer-up').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      if (onMoveLayer) onMoveLayer(idx, 1);
    });
  });

  container.querySelectorAll('.btn-move-layer-down').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      if (onMoveLayer) onMoveLayer(idx, -1);
    });
  });

  container.querySelectorAll('.layer-opacity-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      const row = slider.closest('.layer-item-row');
      row.querySelector('.opacity-label').textContent = Math.round(val * 100) + '%';
      if (onOpacityChange) onOpacityChange(slider.dataset.id, val);
    });
  });
}


/* --- MODULE: js/editor/color-picker.js --- */
/**
 * PixelForge - Color Picker & Palette Manager Component
 * Primary/Secondary color swatches, HSV color input, curated retro palettes, and recent history.
 */





function renderColorPanel(container, {
  primaryColor = '#58a6ff',
  secondaryColor = '#000000',
  currentPaletteId = 'pico8',
  customPalette = [],
  recentColors = [],
  onColorChange = null,
  onPaletteChange = null
}) {
  const currentPalette = PALETTES[currentPaletteId] || { name: 'Custom', colors: customPalette };

  container.innerHTML = `
    <!-- Top Primary & Secondary Swatches -->
    <div class="color-swatches-master flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-3">
        <!-- Dual Color Box -->
        <div class="dual-color-container relative w-12 h-10">
          <div class="color-box secondary-swatch absolute" style="background-color: ${secondaryColor};" title="Secondary Color (Right Click)"></div>
          <div class="color-box primary-swatch absolute" style="background-color: ${primaryColor};" title="Primary Color (Left Click)"></div>
        </div>

        <div class="flex flex-col">
          <span class="font-mono text-xs font-bold uppercase text-primary" id="primary-hex-label">${primaryColor}</span>
          <span class="text-xs text-muted">Primary / Alt</span>
        </div>
      </div>

      <button class="btn-icon-xs text-muted" id="btn-swap-colors" title="Swap Colors (X)">
        ${getIcon('swap', 'icon-xs')}
      </button>
    </div>

    <!-- Color Inputs & Native Pickers -->
    <div class="p-3 border-b flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <input type="color" id="native-color-picker" class="p-0 w-8 h-7 cursor-pointer border-none rounded" value="${primaryColor}" />
        <input type="text" id="input-hex-val" class="form-control form-control-sm font-mono flex-1 text-center" value="${primaryColor}" />
      </div>
    </div>

    <!-- Palette Selection & Swatches -->
    <div class="p-3 flex-1 overflow-y-auto flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <select id="select-palette-preset" class="form-control form-control-sm flex-1 font-semibold">
          ${Object.values(PALETTES).map(p => `<option value="${p.id}" ${currentPaletteId === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
        </select>
      </div>

      <!-- Swatches Grid -->
      <div class="palette-swatches-grid">
        ${currentPalette.colors.map(col => `
          <div class="swatch-tile ${col.toLowerCase() === primaryColor.toLowerCase() ? 'selected' : ''}" style="background-color: ${col};" data-color="${col}" title="${col}"></div>
        `).join('')}
      </div>

      <!-- Recent Colors -->
      ${recentColors.length > 0 ? `
        <div class="border-t pt-2 mt-2">
          <span class="text-xs font-bold uppercase text-muted block mb-1">Recent Colors</span>
          <div class="flex flex-wrap gap-1">
            ${recentColors.slice(0, 12).map(c => `
              <div class="swatch-tile-mini" style="background-color: ${c};" data-color="${c}" title="${c}"></div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  // --- Attach Handlers ---
  const nativePicker = container.querySelector('#native-color-picker');
  const hexInput = container.querySelector('#input-hex-val');

  nativePicker?.addEventListener('input', (e) => {
    hexInput.value = e.target.value;
    container.querySelector('#primary-hex-label').textContent = e.target.value;
    container.querySelector('.primary-swatch').style.backgroundColor = e.target.value;
    if (onColorChange) onColorChange(e.target.value, false);
  });

  hexInput?.addEventListener('input', (e) => {
    let val = e.target.value;
    if (!val.startsWith('#')) val = '#' + val;
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      nativePicker.value = val;
      container.querySelector('#primary-hex-label').textContent = val;
      container.querySelector('.primary-swatch').style.backgroundColor = val;
      if (onColorChange) onColorChange(val, false);
    }
  });

  // Swatch click (Left click = Primary, Right click = Secondary)
  container.querySelectorAll('.swatch-tile, .swatch-tile-mini').forEach(tile => {
    tile.addEventListener('click', () => {
      const col = tile.dataset.color;
      nativePicker.value = col;
      hexInput.value = col;
      if (onColorChange) onColorChange(col, false);
    });

    tile.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const col = tile.dataset.color;
      if (onColorChange) onColorChange(col, true);
    });
  });

  // Swap Colors
  container.querySelector('#btn-swap-colors')?.addEventListener('click', () => {
    if (window.pixelForgeApp) {
      window.pixelForgeApp.swapColors();
    }
  });

  // Change Palette Preset
  container.querySelector('#select-palette-preset')?.addEventListener('change', (e) => {
    if (onPaletteChange) onPaletteChange(e.target.value);
  });
}


/* --- MODULE: js/editor/timeline.js --- */
/**
 * PixelForge - Animation Timeline Filmstrip Component
 * Frame thumbnail reel, playhead controls, FPS speed, and onion-skin toggling.
 */



function renderTimeline(container, {
  frames = [],
  activeFrameIndex = 0,
  isPlaying = false,
  fps = 8,
  isLooping = true,
  showOnionSkin = false,
  projectWidth = 32,
  projectHeight = 32,
  onSelectFrame = null,
  onAddFrame = null,
  onDuplicateFrame = null,
  onDeleteFrame = null,
  onTogglePlay = null,
  onFPSChange = null,
  onToggleLoop = null,
  onToggleOnion = null
}) {
  container.innerHTML = `
    <!-- Top Playback Toolbar -->
    <div class="timeline-controls-bar flex items-center justify-between px-3 py-1 border-b">
      <!-- Playhead Controls -->
      <div class="flex items-center gap-2">
        <button class="btn btn-xs ${isPlaying ? 'btn-primary' : 'btn-secondary'}" id="btn-timeline-play" title="Play / Pause (Space)">
          ${getIcon(isPlaying ? 'pause' : 'play', 'icon-xs')}
          <span>${isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <button class="btn btn-xs ${showOnionSkin ? 'btn-primary' : 'btn-secondary'}" id="btn-timeline-onion" title="Toggle Onion Skinning">
          ${getIcon('onion', 'icon-xs')}
          <span>Onion</span>
        </button>

        <button class="btn btn-xs ${isLooping ? 'btn-primary' : 'btn-secondary'}" id="btn-timeline-loop" title="Toggle Loop">
          ${getIcon('loop', 'icon-xs')}
          <span>Loop</span>
        </button>
      </div>

      <!-- FPS Speed Controller -->
      <div class="flex items-center gap-2">
        <span class="text-xs text-muted font-mono font-semibold">FPS:</span>
        <input type="range" min="1" max="30" id="input-timeline-fps" class="form-control form-control-sm p-0 w-24" value="${fps}" />
        <span class="text-xs font-mono font-bold text-primary w-6 text-center" id="fps-label">${fps}</span>

        <div class="flex gap-1 ml-1">
          <button class="btn btn-xs btn-secondary btn-fps-preset" data-fps="8">8</button>
          <button class="btn btn-xs btn-secondary btn-fps-preset" data-fps="12">12</button>
          <button class="btn btn-xs btn-secondary btn-fps-preset" data-fps="24">24</button>
        </div>
      </div>

      <!-- Add Frame Button -->
      <div>
        <button class="btn btn-xs btn-primary" id="btn-add-frame">
          ${getIcon('plus', 'icon-xs')} New Frame
        </button>
      </div>
    </div>

    <!-- Frames Filmstrip Scroll Container -->
    <div class="timeline-filmstrip-scroll flex items-center gap-2 p-2 overflow-x-auto flex-1">
      ${frames.map((frame, idx) => {
        const isActive = idx === activeFrameIndex;

        return `
          <div class="timeline-frame-card ${isActive ? 'active' : ''}" data-idx="${idx}">
            <div class="frame-card-header flex items-center justify-between px-1">
              <span class="font-mono text-xs font-bold text-muted">#${idx + 1}</span>
              <div class="frame-card-actions flex items-center">
                <button class="btn-icon-xs btn-dupe-frame" data-idx="${idx}" title="Duplicate Frame">
                  ${getIcon('copy', 'icon-xs')}
                </button>
                ${frames.length > 1 ? `
                  <button class="btn-icon-xs text-rose btn-del-frame" data-idx="${idx}" title="Delete Frame">
                    ${getIcon('trash', 'icon-xs')}
                  </button>
                ` : ''}
              </div>
            </div>

            <!-- Canvas Thumbnail -->
            <div class="frame-thumbnail-wrapper cursor-pointer frame-select-target">
              <canvas class="frame-thumb-canvas" width="48" height="48" data-idx="${idx}"></canvas>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Draw thumbnails for all frames
  container.querySelectorAll('.frame-thumb-canvas').forEach(canvas => {
    const idx = parseInt(canvas.dataset.idx, 10);
    const frame = frames[idx];
    if (frame) {
      drawFrameThumbnail(canvas, frame, projectWidth, projectHeight);
    }
  });

  // --- Attach Handlers ---
  container.querySelector('#btn-timeline-play')?.addEventListener('click', () => {
    if (onTogglePlay) onTogglePlay();
  });

  container.querySelector('#btn-timeline-onion')?.addEventListener('click', () => {
    if (onToggleOnion) onToggleOnion();
  });

  container.querySelector('#btn-timeline-loop')?.addEventListener('click', () => {
    if (onToggleLoop) onToggleLoop();
  });

  const fpsSlider = container.querySelector('#input-timeline-fps');
  const fpsLabel = container.querySelector('#fps-label');
  fpsSlider?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    fpsLabel.textContent = val;
    if (onFPSChange) onFPSChange(val);
  });

  container.querySelectorAll('.btn-fps-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.dataset.fps, 10);
      fpsSlider.value = val;
      fpsLabel.textContent = val;
      if (onFPSChange) onFPSChange(val);
    });
  });

  container.querySelector('#btn-add-frame')?.addEventListener('click', () => {
    if (onAddFrame) onAddFrame();
  });

  container.querySelectorAll('.frame-select-target').forEach(el => {
    el.addEventListener('click', () => {
      const card = el.closest('.timeline-frame-card');
      const idx = parseInt(card.dataset.idx, 10);
      if (onSelectFrame) onSelectFrame(idx);
    });
  });

  container.querySelectorAll('.btn-dupe-frame').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx, 10);
      if (onDuplicateFrame) onDuplicateFrame(idx);
    });
  });

  container.querySelectorAll('.btn-del-frame').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx, 10);
      if (onDeleteFrame) onDeleteFrame(idx);
    });
  });
}

function drawFrameThumbnail(canvas, frame, pw, ph) {
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const cw = canvas.width;
  const ch = canvas.height;

  // Checkerboard
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? '#181b24' : '#222634';
      ctx.fillRect(x * 6, y * 6, 6, 6);
    }
  }

  // Draw layers
  const scaleX = cw / pw;
  const scaleY = ch / ph;

  for (const layer of (frame.layers || [])) {
    if (layer.visible === false) continue;
    ctx.save();
    if (layer.opacity !== undefined) ctx.globalAlpha = layer.opacity;

    for (let y = 0; y < ph; y++) {
      for (let x = 0; x < pw; x++) {
        const col = layer.pixels[y * pw + x];
        if (col && col !== 'transparent') {
          ctx.fillStyle = col;
          ctx.fillRect(x * scaleX, y * scaleY, scaleX + 0.2, scaleY + 0.2);
        }
      }
    }
    ctx.restore();
  }
}


/* --- MODULE: js/editor/templates.js --- */
/**
 * PixelForge - Pre-Built Demonstration Projects
 * 3 rich pixel art projects: "Cyber Knight Run" (Animation), "Retro Dungeon Tileset" (Tilemap), "Pixel City Skyline" (Multi-Layer).
 */

const TEMPLATES = {
  // 1. Cyber Knight Run (6-Frame Animation, 24x24)
  knight: {
    id: 'proj_cyber_knight',
    name: 'Cyber Knight Run',
    width: 24,
    height: 24,
    fps: 10,
    frames: [
      createFrame([createKnightLayer(0)]),
      createFrame([createKnightLayer(1)]),
      createFrame([createKnightLayer(2)]),
      createFrame([createKnightLayer(3)]),
      createFrame([createKnightLayer(4)]),
      createFrame([createKnightLayer(5)])
    ]
  },

  // 2. Retro Dungeon Tileset (32x32 Sprite for Slicing)
  dungeon: {
    id: 'proj_dungeon_tiles',
    name: 'Dungeon Tileset (16x16 Tiles)',
    width: 32,
    height: 32,
    fps: 8,
    frames: [
      createFrame([
        {
          id: 'layer_bricks',
          name: 'Stone Bricks & Walls',
          visible: true,
          locked: false,
          opacity: 1,
          pixels: createDungeonBricksPixels(32, 32)
        },
        {
          id: 'layer_props',
          name: 'Chest & Torches',
          visible: true,
          locked: false,
          opacity: 1,
          pixels: createDungeonPropsPixels(32, 32)
        }
      ])
    ]
  },

  // 3. Pixel City Skyline (Multi-layer 32x32 Scene)
  city: {
    id: 'proj_pixel_city',
    name: 'Cyberpunk Skyline',
    width: 32,
    height: 32,
    fps: 6,
    frames: [
      createFrame([
        {
          id: 'layer_sky',
          name: 'Night Sky & Moon',
          visible: true,
          locked: false,
          opacity: 1,
          pixels: createCitySkyPixels(32, 32)
        },
        {
          id: 'layer_buildings',
          name: 'Neon Skyscrapers',
          visible: true,
          locked: false,
          opacity: 1,
          pixels: createCityBuildingsPixels(32, 32)
        }
      ])
    ]
  }
};

function createFrame(layers) {
  return {
    id: 'frame_' + Math.random().toString(36).substr(2, 8),
    layers
  };
}

// Procedural Sprite Pixel Generators for Crisp Template Demonstration
function createKnightLayer(frameIdx) {
  const w = 24, h = 24;
  const pixels = new Array(w * h).fill('transparent');

  // Bobbing offset for running animation
  const bob = frameIdx % 2 === 0 ? 0 : 1;
  const legOffset = (frameIdx % 4) - 2;

  // Helmet / Visor
  for (let x = 8; x <= 14; x++) {
    for (let y = 3 + bob; y <= 8 + bob; y++) {
      pixels[y * w + x] = '#1e293b';
    }
  }
  // Cyan glowing visor line
  for (let x = 11; x <= 14; x++) {
    pixels[(6 + bob) * w + x] = '#00e5ff';
  }

  // Chest Armor
  for (let x = 7; x <= 15; x++) {
    for (let y = 9 + bob; y <= 15 + bob; y++) {
      pixels[y * w + x] = '#334155';
    }
  }
  // Cyber Core Glow
  pixels[(11 + bob) * w + 11] = '#00e5ff';
  pixels[(12 + bob) * w + 11] = '#00e5ff';

  // Cape (Flowing back)
  for (let y = 10 + bob; y <= 17 + bob; y++) {
    pixels[y * w + 6] = '#e11d48';
    pixels[y * w + 5] = '#be123c';
  }

  // Running Legs
  for (let y = 16 + bob; y <= 20; y++) {
    pixels[y * w + (9 + legOffset)] = '#475569';
    pixels[y * w + (13 - legOffset)] = '#64748b';
  }
  // Boots
  pixels[21 * w + (9 + legOffset)] = '#0f172a';
  pixels[21 * w + (13 - legOffset)] = '#0f172a';

  // Energy Blade Sword in hand
  for (let i = 0; i <= 6; i++) {
    pixels[(14 + bob - i) * w + (16 + i)] = '#38bdf8';
  }

  return {
    id: 'layer_knight',
    name: 'Cyber Knight',
    visible: true,
    locked: false,
    opacity: 1,
    pixels
  };
}

function createDungeonBricksPixels(w, h) {
  const pixels = new Array(w * h).fill('transparent');

  // Tile 1 (Top Left 16x16): Stone Wall Bricks
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const isMortar = y % 5 === 0 || (y < 5 && x === 8) || (y > 5 && y < 11 && (x === 4 || x === 12)) || (y > 11 && x === 8);
      pixels[y * w + x] = isMortar ? '#1f2937' : ((x + y) % 3 === 0 ? '#374151' : '#4b5563');
    }
  }

  // Tile 2 (Top Right 16x16): Floor Flagstones
  for (let y = 0; y < 16; y++) {
    for (let x = 16; x < 32; x++) {
      const isCrack = (x === 20 && y > 4 && y < 12) || (y === 8 && x > 24);
      pixels[y * w + x] = isCrack ? '#111827' : '#6b7280';
    }
  }

  return pixels;
}

function createDungeonPropsPixels(w, h) {
  const pixels = new Array(w * h).fill('transparent');

  // Treasure Chest (Bottom Left 16x16)
  for (let y = 20; y < 28; y++) {
    for (let x = 3; x < 13; x++) {
      pixels[y * w + x] = (y === 20 || y === 23) ? '#92400e' : '#b45309';
    }
  }
  // Gold Lock
  pixels[24 * w + 8] = '#f59e0b';
  pixels[25 * w + 8] = '#f59e0b';

  return pixels;
}

function createCitySkyPixels(w, h) {
  const pixels = new Array(w * h).fill('#090d16');

  // Stars
  [[4, 3], [12, 5], [22, 2], [28, 7], [8, 10], [18, 12]].forEach(([x, y]) => {
    pixels[y * w + x] = '#ffffff';
  });

  // Glowing Cyber Moon
  for (let y = 3; y <= 7; y++) {
    for (let x = 24; x <= 28; x++) {
      if (Math.hypot(x - 26, y - 5) <= 2.2) {
        pixels[y * w + x] = '#00e5ff';
      }
    }
  }

  return pixels;
}

function createCityBuildingsPixels(w, h) {
  const pixels = new Array(w * h).fill('transparent');

  // Skyscraper 1
  for (let y = 14; y < h; y++) {
    for (let x = 2; x < 10; x++) {
      pixels[y * w + x] = '#1e1b4b';
      if (y % 3 === 0 && x % 2 === 0) pixels[y * w + x] = '#ff007f'; // Neon Windows
    }
  }

  // Skyscraper 2 (Tall Middle)
  for (let y = 9; y < h; y++) {
    for (let x = 12; x < 22; x++) {
      pixels[y * w + x] = '#0f172a';
      if (y % 4 === 0 && x % 3 === 0) pixels[y * w + x] = '#00e5ff';
    }
  }

  return pixels;
}


/* --- MODULE: js/app.js --- */
/**
 * PixelForge - Master Pixel Art Workstation Orchestrator
 * Integrates Canvas Renderer, Drawing Algorithms, Animation Engine, Layer Manager, Color Picker, and File I/O.
 */












class PixelForgeApp {
  constructor() {
    this.canvas = document.getElementById('pixel-canvas');
    this.renderer = new CanvasRenderer(this.canvas);
    this.animation = new AnimationEngine(this);
    this.tilemap = new TilemapEngine(this);

    // Active project state
    this.project = JSON.parse(JSON.stringify(TEMPLATES.knight));
    this.activeFrameIndex = 0;
    this.activeLayerId = this.project.frames[0]?.layers[0]?.id || 'layer_default';

    // Tool & Drawing State
    this.activeTool = 'pencil'; // pencil, eraser, line, rect, rectFill, circle, circleFill, bucket, picker, dither, select, move
    this.primaryColor = '#58a6ff';
    this.secondaryColor = '#000000';
    this.brushSize = 1;
    this.pixelPerfect = true;
    this.symmetryMode = 'none'; // none, horizontal, vertical, both
    this.showGrid = true;
    this.showOnionSkin = false;

    // Pointer Interaction State
    this.isDrawing = false;
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };
    this.drawStart = { x: 0, y: 0 };
    this.strokePoints = [];
    this.activePreviewPixels = [];
    this.selection = null;
    this.clipboardPixels = null;
    this.cursorPos = { x: 0, y: 0 };

    // Recent colors
    this.recentColors = ['#58a6ff', '#000000', '#ffffff', '#e11d48', '#00e5ff', '#334155'];

    // History stack
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 30;
  }

  async init() {
    await db.init();

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // Load saved project if exists
    const lastId = localStorage.getItem('pixelforge_last_project_id');
    if (lastId) {
      const saved = await db.loadProject(lastId);
      if (saved && saved.frames && saved.frames.length > 0) {
        this.project = saved;
        this.activeFrameIndex = 0;
        this.activeLayerId = this.project.frames[0].layers[0]?.id || 'default';
      }
    }

    this.setupToolbar();
    this.setupCanvasInteractions();
    this.setupShortcuts();
    this.renderAll();
    this.centerCanvas();
  }

  handleResize() {
    const container = document.getElementById('canvas-workspace-container');
    if (container && this.canvas) {
      this.renderer.resize(container.clientWidth, container.clientHeight);
      this.requestRender();
    }
  }

  requestRender() {
    this.renderer.render({
      project: this.project,
      activeFrameIndex: this.activeFrameIndex,
      activeLayerId: this.activeLayerId,
      showGrid: this.showGrid,
      showOnionSkin: this.showOnionSkin,
      symmetryMode: this.symmetryMode,
      activePreviewPixels: this.activePreviewPixels,
      selection: this.selection,
      cursorPos: this.cursorPos,
      brushSize: this.brushSize
    });
  }

  renderAll() {
    this.renderColorPickerPanel();
    this.renderLayerStack();
    this.renderAnimationTimeline();
    this.updateStats();
    this.requestRender();
  }

  // --- Toolbar Setup ---
  setupToolbar() {
    // Tool buttons
    document.querySelectorAll('.btn-pixel-tool').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setTool(btn.dataset.tool);
      });
    });

    // Brush Size
    const brushSelect = document.getElementById('select-brush-size');
    brushSelect?.addEventListener('change', (e) => {
      this.brushSize = parseInt(e.target.value, 10) || 1;
    });

    // Pixel-Perfect Toggle
    const ppBtn = document.getElementById('btn-toggle-pixel-perfect');
    ppBtn?.addEventListener('click', () => {
      this.pixelPerfect = !this.pixelPerfect;
      ppBtn.classList.toggle('active', this.pixelPerfect);
    });

    // Symmetry Mode Selector
    const symSelect = document.getElementById('select-symmetry-mode');
    symSelect?.addEventListener('change', (e) => {
      this.symmetryMode = e.target.value;
      this.requestRender();
    });

    // Template Switcher
    document.getElementById('select-project-template')?.addEventListener('change', (e) => {
      const tKey = e.target.value;
      if (TEMPLATES[tKey]) {
        if (confirm(`Load template "${TEMPLATES[tKey].name}"? Unsaved edits in current project will be replaced.`)) {
          this.loadProject(JSON.parse(JSON.stringify(TEMPLATES[tKey])));
        }
      }
    });

    // Undo / Redo
    document.getElementById('btn-undo')?.addEventListener('click', () => this.undo());
    document.getElementById('btn-redo')?.addEventListener('click', () => this.redo());

    // Grid Toggle
    const gridBtn = document.getElementById('btn-toggle-grid');
    gridBtn?.addEventListener('click', () => {
      this.showGrid = !this.showGrid;
      gridBtn.classList.toggle('active', this.showGrid);
      this.requestRender();
    });

    // Zoom buttons
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
      this.renderer.camera.zoom = Math.min(64, this.renderer.camera.zoom * 1.3);
      this.requestRender();
      this.updateZoomLabel();
    });
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
      this.renderer.camera.zoom = Math.max(2, this.renderer.camera.zoom * 0.75);
      this.requestRender();
      this.updateZoomLabel();
    });
    document.getElementById('btn-zoom-reset')?.addEventListener('click', () => {
      this.renderer.camera.zoom = 16;
      this.centerCanvas();
    });
    document.getElementById('btn-fit-canvas')?.addEventListener('click', () => this.centerCanvas());

    // New Project Dialog
    document.getElementById('btn-new-project')?.addEventListener('click', () => {
      const sizeStr = prompt('Enter canvas size (e.g. 16, 24, 32, 48, 64):', '32');
      const size = parseInt(sizeStr, 10);
      if (size && size >= 8 && size <= 256) {
        this.createNewProject(size, size);
      }
    });

    // Export PNG
    document.getElementById('btn-export-png')?.addEventListener('click', () => {
      const scaleStr = prompt('Enter PNG upscale factor (1, 2, 4, 8, 16):', '8');
      const scale = parseInt(scaleStr, 10) || 8;
      this.exportPNG(scale);
    });

    // Export Sprite Sheet
    document.getElementById('btn-export-sheet')?.addEventListener('click', () => {
      this.exportSpriteSheet();
    });

    // Export Animated SVG
    document.getElementById('btn-export-svg')?.addEventListener('click', () => {
      const scaleStr = prompt('Enter SVG pixel scale (e.g. 5, 10, 16):', '10');
      const scale = parseInt(scaleStr, 10) || 10;
      this.exportAnimatedSVG(scale);
    });

    // Export Video (WebM / MP4)
    document.getElementById('btn-export-video')?.addEventListener('click', () => {
      this.exportVideo();
    });

    // Export JSON
    document.getElementById('btn-export-json')?.addEventListener('click', () => {
      const json = JSON.stringify(this.project, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (this.project.name || 'sprite').toLowerCase().replace(/\s+/g, '_') + '.pixelforge.json';
      a.click();
    });

    // Import JSON
    const importInput = document.getElementById('file-import-project');
    document.getElementById('btn-import-json')?.addEventListener('click', () => importInput?.click());
    importInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (parsed && parsed.frames && parsed.frames.length > 0) {
            this.loadProject(parsed);
          } else {
            alert('Invalid PixelForge project JSON structure.');
          }
        } catch (err) {
          alert('Failed to parse project JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    });
  }

  setTool(toolName) {
    this.activeTool = toolName;
    document.querySelectorAll('.btn-pixel-tool').forEach(b => {
      b.classList.toggle('active', b.dataset.tool === toolName);
    });
  }

  // --- Canvas Coordinate & Pointer Interactions ---
  setupCanvasInteractions() {
    const canvas = this.canvas;

    const screenToPixel = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const sx = clientX - rect.left;
      const sy = clientY - rect.top;
      const px = Math.floor((sx - this.renderer.camera.x) / this.renderer.camera.zoom);
      const py = Math.floor((sy - this.renderer.camera.y) / this.renderer.camera.zoom);
      return { px, py, sx, sy };
    };

    canvas.addEventListener('mousedown', (e) => {
      const { px, py, sx, sy } = screenToPixel(e.clientX, e.clientY);

      // Pan with Middle Click or Hand Tool or Space+Drag
      if (e.button === 1 || this.activeTool === 'move' || e.shiftKey || e.altKey) {
        this.isPanning = true;
        this.panStart = { x: sx, y: sy };
        return;
      }

      if (e.button !== 0 && e.button !== 2) return; // Left or Right click
      const isRightClick = e.button === 2;

      this.isDrawing = true;
      this.drawStart = { x: px, y: py };
      this.strokePoints = [{ x: px, y: py }];

      const drawColor = isRightClick ? this.secondaryColor : this.primaryColor;

      // Eyedropper / Color Picker
      if (this.activeTool === 'picker') {
        const pickedColor = this.getPixelColorAt(px, py);
        if (pickedColor && pickedColor !== 'transparent') {
          if (isRightClick) this.secondaryColor = pickedColor;
          else this.primaryColor = pickedColor;
          this.renderColorPickerPanel();
        }
        return;
      }

      // Flood Fill / Paint Bucket
      if (this.activeTool === 'bucket') {
        this.recordHistory('Bucket Fill');
        const activeLayer = this.getActiveLayer();
        if (activeLayer && !activeLayer.locked) {
          const filled = floodFill(activeLayer.pixels, this.project.width, this.project.height, px, py, drawColor);
          filled.forEach(p => {
            activeLayer.pixels[p.y * this.project.width + p.x] = p.color;
          });
          this.renderAll();
          this.autoSave();
        }
        return;
      }

      // Pencil / Eraser / Dither single click
      if (['pencil', 'eraser', 'dither'].includes(this.activeTool)) {
        this.recordHistory('Draw Stroke');
        this.applyPixelStroke([{ x: px, y: py }], drawColor);
        this.requestRender();
      }
    });

    window.addEventListener('mousemove', (e) => {
      const { px, py, sx, sy } = screenToPixel(e.clientX, e.clientY);
      this.cursorPos = { x: px, y: py };
      this.updateCoordinatesReadout(px, py);

      if (this.isPanning) {
        this.renderer.camera.x += sx - this.panStart.x;
        this.renderer.camera.y += sy - this.panStart.y;
        this.panStart = { x: sx, y: sy };
        this.requestRender();
        return;
      }

      if (!this.isDrawing) {
        this.requestRender();
        return;
      }

      const isRightClick = e.buttons === 2;
      const drawColor = isRightClick ? this.secondaryColor : this.primaryColor;

      // Continuous Drawing (Pencil, Eraser, Dither)
      if (['pencil', 'eraser', 'dither'].includes(this.activeTool)) {
        const last = this.strokePoints[this.strokePoints.length - 1];
        if (last && (last.x !== px || last.y !== py)) {
          // Connect gaps with Bresenham line
          const linePts = getLinePixels(last.x, last.y, px, py);
          this.strokePoints.push(...linePts);
          this.applyPixelStroke(linePts, drawColor);
          this.requestRender();
        }
        return;
      }

      // Shapes Preview (Line, Rect, Circle, Marquee)
      if (this.activeTool === 'line') {
        const linePts = getLinePixels(this.drawStart.x, this.drawStart.y, px, py);
        this.activePreviewPixels = this.expandSymmetry(linePts, drawColor);
        this.requestRender();
      } else if (this.activeTool === 'rect') {
        const rectPts = getRectPixels(this.drawStart.x, this.drawStart.y, px, py, false);
        this.activePreviewPixels = this.expandSymmetry(rectPts, drawColor);
        this.requestRender();
      } else if (this.activeTool === 'rectFill') {
        const rectPts = getRectPixels(this.drawStart.x, this.drawStart.y, px, py, true);
        this.activePreviewPixels = this.expandSymmetry(rectPts, drawColor);
        this.requestRender();
      } else if (this.activeTool === 'circle') {
        const r = Math.hypot(px - this.drawStart.x, py - this.drawStart.y);
        const circPts = getCirclePixels(this.drawStart.x, this.drawStart.y, r, false);
        this.activePreviewPixels = this.expandSymmetry(circPts, drawColor);
        this.requestRender();
      } else if (this.activeTool === 'circleFill') {
        const r = Math.hypot(px - this.drawStart.x, py - this.drawStart.y);
        const circPts = getCirclePixels(this.drawStart.x, this.drawStart.y, r, true);
        this.activePreviewPixels = this.expandSymmetry(circPts, drawColor);
        this.requestRender();
      } else if (this.activeTool === 'select') {
        this.selection = {
          x0: this.drawStart.x,
          y0: this.drawStart.y,
          x1: px,
          y1: py
        };
        this.requestRender();
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isDrawing) {
        // Commit shape to active layer
        if (this.activePreviewPixels.length > 0) {
          this.recordHistory('Draw Shape');
          const activeLayer = this.getActiveLayer();
          if (activeLayer && !activeLayer.locked) {
            this.activePreviewPixels.forEach(p => {
              if (p.x >= 0 && p.x < this.project.width && p.y >= 0 && p.y < this.project.height) {
                activeLayer.pixels[p.y * this.project.width + p.x] = p.color;
              }
            });
          }
          this.activePreviewPixels = [];
        }

        this.isDrawing = false;
        this.strokePoints = [];
        this.autoSave();
        this.renderAll();
      }
      this.isPanning = false;
    });

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Mouse wheel zoom
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const { sx, sy } = screenToPixel(e.clientX, e.clientY);
      const zoomFactor = e.deltaY < 0 ? 1.2 : 0.8;
      const oldZoom = this.renderer.camera.zoom;
      const newZoom = Math.max(2, Math.min(64, oldZoom * zoomFactor));

      this.renderer.camera.x = sx - (sx - this.renderer.camera.x) * (newZoom / oldZoom);
      this.renderer.camera.y = sy - (sy - this.renderer.camera.y) * (newZoom / oldZoom);
      this.renderer.camera.zoom = newZoom;

      this.requestRender();
      this.updateZoomLabel();
    });
  }

  applyPixelStroke(points, color) {
    const activeLayer = this.getActiveLayer();
    if (!activeLayer || activeLayer.locked) return;

    let pts = points;
    if (this.pixelPerfect && this.activeTool === 'pencil') {
      pts = filterPixelPerfect(points);
    }

    const pw = this.project.width;
    const ph = this.project.height;

    pts.forEach(pt => {
      // Handle brush size offset
      const offset = Math.floor(this.brushSize / 2);
      for (let by = 0; by < this.brushSize; by++) {
        for (let bx = 0; bx < this.brushSize; bx++) {
          const px = pt.x - offset + bx;
          const py = pt.y - offset + by;

          const symmetricalPoints = this.getSymmetricalPoints(px, py);
          symmetricalPoints.forEach(sp => {
            if (sp.x >= 0 && sp.x < pw && sp.y >= 0 && sp.y < ph) {
              let finalColor = color;
              if (this.activeTool === 'eraser') {
                finalColor = 'transparent';
              } else if (this.activeTool === 'dither') {
                finalColor = getDitherColor(sp.x, sp.y, this.primaryColor, this.secondaryColor);
              }
              activeLayer.pixels[sp.y * pw + sp.x] = finalColor;
            }
          });
        }
      }
    });

    this.addRecentColor(color);
  }

  getSymmetricalPoints(x, y) {
    const pw = this.project.width;
    const ph = this.project.height;
    const points = [{ x, y }];

    if (this.symmetryMode === 'vertical' || this.symmetryMode === 'both') {
      points.push({ x: pw - 1 - x, y });
    }
    if (this.symmetryMode === 'horizontal' || this.symmetryMode === 'both') {
      points.push({ x, y: ph - 1 - y });
    }
    if (this.symmetryMode === 'both') {
      points.push({ x: pw - 1 - x, y: ph - 1 - y });
    }
    return points;
  }

  expandSymmetry(points, color) {
    const result = [];
    points.forEach(p => {
      this.getSymmetricalPoints(p.x, p.y).forEach(sp => {
        result.push({ x: sp.x, y: sp.y, color });
      });
    });
    return result;
  }

  getPixelColorAt(x, y) {
    const currentFrame = this.project.frames[this.activeFrameIndex];
    if (!currentFrame) return null;

    const pw = this.project.width;
    // Inspect layers top-to-bottom
    const layers = [...currentFrame.layers].reverse();
    for (const l of layers) {
      if (l.visible === false) continue;
      const c = l.pixels[y * pw + x];
      if (c && c !== 'transparent') return c;
    }
    return null;
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === 'b' || e.key === 'B') this.setTool('pencil');
      if (e.key === 'e' || e.key === 'E') this.setTool('eraser');
      if (e.key === 'l' || e.key === 'L') this.setTool('line');
      if (e.key === 'u' || e.key === 'U') this.setTool('rect');
      if (e.key === 'c' || e.key === 'C') this.setTool('circle');
      if (e.key === 'g' || e.key === 'G') this.setTool('bucket');
      if (e.key === 'i' || e.key === 'I') this.setTool('picker');
      if (e.key === 'd' || e.key === 'D') this.setTool('dither');
      if (e.key === 's' || e.key === 'S') this.setTool('select');
      if (e.key === 'm' || e.key === 'M') this.setTool('move');
      if (e.key === 'x' || e.key === 'X') this.swapColors();

      // Space -> Toggle Play Animation
      if (e.code === 'Space') {
        e.preventDefault();
        this.animation.togglePlay();
        this.renderAnimationTimeline();
      }

      // Delete Selection
      if (e.key === 'Delete' && this.selection) {
        this.deleteSelection();
      }

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        this.redo();
      }
    });
  }

  swapColors() {
    const temp = this.primaryColor;
    this.primaryColor = this.secondaryColor;
    this.secondaryColor = temp;
    this.renderColorPickerPanel();
  }

  addRecentColor(color) {
    if (!color || color === 'transparent') return;
    if (!this.recentColors.includes(color)) {
      this.recentColors.unshift(color);
      if (this.recentColors.length > 16) this.recentColors.pop();
    }
  }

  getActiveLayer() {
    const currentFrame = this.project.frames[this.activeFrameIndex];
    if (!currentFrame) return null;
    return currentFrame.layers.find(l => l.id === this.activeLayerId) || currentFrame.layers[0];
  }

  // --- Frame & Layer Manipulation ---
  setFrame(index) {
    this.activeFrameIndex = index;
    this.renderAll();
  }

  addFrame() {
    this.recordHistory('Add Frame');
    const pw = this.project.width;
    const ph = this.project.height;
    const newFrame = {
      id: 'frame_' + Date.now(),
      layers: [
        {
          id: 'layer_1',
          name: 'Layer 1',
          visible: true,
          locked: false,
          opacity: 1,
          pixels: new Array(pw * ph).fill('transparent')
        }
      ]
    };
    this.project.frames.push(newFrame);
    this.setFrame(this.project.frames.length - 1);
    this.autoSave();
  }

  duplicateFrame(index) {
    this.recordHistory('Duplicate Frame');
    const source = this.project.frames[index];
    const clone = JSON.parse(JSON.stringify(source));
    clone.id = 'frame_' + Date.now();
    this.project.frames.splice(index + 1, 0, clone);
    this.setFrame(index + 1);
    this.autoSave();
  }

  deleteFrame(index) {
    if (this.project.frames.length <= 1) return;
    this.recordHistory('Delete Frame');
    this.project.frames.splice(index, 1);
    this.setFrame(Math.max(0, index - 1));
    this.autoSave();
  }

  addLayer() {
    this.recordHistory('Add Layer');
    const currentFrame = this.project.frames[this.activeFrameIndex];
    const pw = this.project.width;
    const ph = this.project.height;
    const newLayer = {
      id: 'layer_' + Date.now(),
      name: 'Layer ' + (currentFrame.layers.length + 1),
      visible: true,
      locked: false,
      opacity: 1,
      pixels: new Array(pw * ph).fill('transparent')
    };
    currentFrame.layers.push(newLayer);
    this.activeLayerId = newLayer.id;
    this.renderAll();
    this.autoSave();
  }

  duplicateLayer(id) {
    this.recordHistory('Duplicate Layer');
    const currentFrame = this.project.frames[this.activeFrameIndex];
    const target = currentFrame.layers.find(l => l.id === id);
    if (!target) return;

    const clone = JSON.parse(JSON.stringify(target));
    clone.id = 'layer_' + Date.now();
    clone.name = target.name + ' (Copy)';
    currentFrame.layers.push(clone);
    this.activeLayerId = clone.id;
    this.renderAll();
    this.autoSave();
  }

  deleteLayer(id) {
    const currentFrame = this.project.frames[this.activeFrameIndex];
    if (currentFrame.layers.length <= 1) return;

    this.recordHistory('Delete Layer');
    currentFrame.layers = currentFrame.layers.filter(l => l.id !== id);
    this.activeLayerId = currentFrame.layers[0].id;
    this.renderAll();
    this.autoSave();
  }

  // --- Panels ---
  renderColorPickerPanel() {
    const container = document.getElementById('color-picker-container');
    if (!container) return;

    renderColorPanel(container, {
      primaryColor: this.primaryColor,
      secondaryColor: this.secondaryColor,
      recentColors: this.recentColors,
      onColorChange: (col, isSecondary) => {
        if (isSecondary) this.secondaryColor = col;
        else this.primaryColor = col;
        this.renderColorPickerPanel();
      },
      onPaletteChange: (pId) => {
        this.renderColorPickerPanel();
      }
    });
  }

  renderLayerStack() {
    const container = document.getElementById('layer-stack-container');
    if (!container) return;

    const currentFrame = this.project.frames[this.activeFrameIndex];
    renderLayerPanel(container, {
      layers: currentFrame ? currentFrame.layers : [],
      activeLayerId: this.activeLayerId,
      onSelectLayer: (id) => {
        this.activeLayerId = id;
        this.renderLayerStack();
      },
      onAddLayer: () => this.addLayer(),
      onDuplicateLayer: (id) => this.duplicateLayer(id),
      onDeleteLayer: (id) => this.deleteLayer(id),
      onToggleVisibility: (id) => {
        const l = currentFrame.layers.find(x => x.id === id);
        if (l) { l.visible = l.visible === false ? true : false; this.renderAll(); }
      },
      onToggleLock: (id) => {
        const l = currentFrame.layers.find(x => x.id === id);
        if (l) { l.locked = !l.locked; this.renderLayerStack(); }
      },
      onOpacityChange: (id, val) => {
        const l = currentFrame.layers.find(x => x.id === id);
        if (l) { l.opacity = val; this.requestRender(); this.autoSave(); }
      },
      onMoveLayer: (idx, dir) => {
        const target = idx + dir;
        if (target >= 0 && target < currentFrame.layers.length) {
          const temp = currentFrame.layers[idx];
          currentFrame.layers[idx] = currentFrame.layers[target];
          currentFrame.layers[target] = temp;
          this.renderAll();
          this.autoSave();
        }
      }
    });
  }

  renderAnimationTimeline() {
    const container = document.getElementById('timeline-container');
    if (!container) return;

    renderTimeline(container, {
      frames: this.project.frames || [],
      activeFrameIndex: this.activeFrameIndex,
      isPlaying: this.animation.isPlaying,
      fps: this.animation.fps,
      isLooping: this.animation.isLooping,
      showOnionSkin: this.showOnionSkin,
      projectWidth: this.project.width,
      projectHeight: this.project.height,
      onSelectFrame: (idx) => this.setFrame(idx),
      onAddFrame: () => this.addFrame(),
      onDuplicateFrame: (idx) => this.duplicateFrame(idx),
      onDeleteFrame: (idx) => this.deleteFrame(idx),
      onTogglePlay: () => {
        this.animation.togglePlay();
        this.renderAnimationTimeline();
      },
      onFPSChange: (fps) => {
        this.animation.fps = fps;
      },
      onToggleLoop: () => {
        this.animation.isLooping = !this.animation.isLooping;
        this.renderAnimationTimeline();
      },
      onToggleOnion: () => {
        this.showOnionSkin = !this.showOnionSkin;
        this.renderAnimationTimeline();
        this.requestRender();
      }
    });
  }

  // --- History (Undo / Redo) ---
  recordHistory(actionName = 'Edit') {
    this.undoStack.push(JSON.stringify(this.project));
    if (this.undoStack.length > this.maxHistory) this.undoStack.shift();
    this.redoStack = [];
    this.updateUndoRedoUI();
  }

  undo() {
    if (this.undoStack.length === 0) return;
    this.redoStack.push(JSON.stringify(this.project));
    this.project = JSON.parse(this.undoStack.pop());
    this.renderAll();
    this.updateUndoRedoUI();
    this.autoSave();
  }

  redo() {
    if (this.redoStack.length === 0) return;
    this.undoStack.push(JSON.stringify(this.project));
    this.project = JSON.parse(this.redoStack.pop());
    this.renderAll();
    this.updateUndoRedoUI();
    this.autoSave();
  }

  updateUndoRedoUI() {
    const u = document.getElementById('btn-undo');
    const r = document.getElementById('btn-redo');
    if (u) u.disabled = this.undoStack.length === 0;
    if (r) r.disabled = this.redoStack.length === 0;
  }

  // --- Export Functions ---
  exportPNG(scale = 8) {
    const currentFrame = this.project.frames[this.activeFrameIndex];
    if (!currentFrame) return;

    const frameCanvas = this.animation.renderFrameToCanvas(currentFrame, this.project.width, this.project.height, scale);
    const url = frameCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.project.name || 'pixel_art').toLowerCase().replace(/\s+/g, '_') + `_${scale}x.png`;
    a.click();
  }

  exportSpriteSheet(scale = 1) {
    const sheetCanvas = this.animation.generateSpriteSheet(null, scale);
    const url = sheetCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.project.name || 'spritesheet').toLowerCase().replace(/\s+/g, '_') + '_sheet.png';
    a.click();
  }

  exportAnimatedSVG(scale = 10) {
    const svgStr = this.animation.generateAnimatedSVG(scale);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.project.name || 'animation').toLowerCase().replace(/\s+/g, '_') + '.svg';
    a.click();
  }

  async exportVideo(scale = 8, loops = 3) {
    try {
      const blob = await this.animation.recordVideo(scale, loops);
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
      a.download = (this.project.name || 'animation').toLowerCase().replace(/\s+/g, '_') + `.${ext}`;
      a.click();
    } catch (err) {
      alert('Video export failed: ' + err.message);
    }
  }

  centerCanvas() {
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    const pw = this.project.width;
    const ph = this.project.height;
    const zoom = this.renderer.camera.zoom;

    this.renderer.camera.x = Math.round((cw - pw * zoom) / 2);
    this.renderer.camera.y = Math.round((ch - ph * zoom) / 2);
    this.requestRender();
    this.updateZoomLabel();
  }

  createNewProject(width = 32, height = 32) {
    this.recordHistory('New Project');
    this.project = {
      id: 'proj_' + Date.now(),
      name: 'Pixel Project',
      width,
      height,
      fps: 8,
      frames: [
        {
          id: 'frame_1',
          layers: [
            {
              id: 'layer_1',
              name: 'Layer 1',
              visible: true,
              locked: false,
              opacity: 1,
              pixels: new Array(width * height).fill('transparent')
            }
          ]
        }
      ]
    };
    this.activeFrameIndex = 0;
    this.activeLayerId = this.project.frames[0].layers[0].id;
    this.centerCanvas();
    this.renderAll();
    this.autoSave();
  }

  loadProject(projectData) {
    this.project = projectData;
    this.activeFrameIndex = 0;
    this.activeLayerId = this.project.frames[0]?.layers[0]?.id || 'layer_default';
    this.undoStack = [];
    this.redoStack = [];
    this.centerCanvas();
    this.renderAll();
    this.autoSave();
  }

  autoSave() {
    db.saveProject(this.project);
    this.updateStats();
  }

  updateZoomLabel() {
    const zLabel = document.getElementById('zoom-percentage-label');
    if (zLabel) {
      zLabel.textContent = `${Math.round(this.renderer.camera.zoom * 100)}% (${this.renderer.camera.zoom}x)`;
    }
  }

  updateCoordinatesReadout(px, py) {
    const coordEl = document.getElementById('pixel-coordinates-readout');
    if (coordEl) {
      const inBounds = px >= 0 && px < this.project.width && py >= 0 && py < this.project.height;
      coordEl.textContent = inBounds ? `X: ${px}, Y: ${py}` : `X: -, Y: -`;
    }
  }

  updateStats() {
    const statsEl = document.getElementById('project-stats-readout');
    if (statsEl) {
      const numFrames = (this.project.frames || []).length;
      statsEl.innerHTML = `Size: <strong>${this.project.width}x${this.project.height}</strong> &bull; Frames: <strong>${numFrames}</strong>`;
    }
  }
}

// Bootstrap
function startPixelForge() {
  const app = new PixelForgeApp();
  window.pixelForgeApp = app;
  app.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startPixelForge);
} else {
  startPixelForge();
}


})();
