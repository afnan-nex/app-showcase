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
  line: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="19" x2="19" y2="5"></line><circle cx="5" cy="19" r="1.5" fill="currentColor"></circle><circle cx="19" cy="5" r="1.5" fill="currentColor"></circle></svg>`,
  rect: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>`,
  rectFill: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>`,
  circle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle></svg>`,
  circleFill: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9"></circle></svg>`,
  bucket: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"></path><path d="m5 2 5 5"></path><path d="M2 13h15"></path><path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z"></path></svg>`,
  picker: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14 2 4 4L6 18l-4 1 1-4L14 2Z"></path><path d="m11 5 4 4"></path></svg>`,
  dither: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="6" height="6" fill="currentColor"></rect><rect x="15" y="3" width="6" height="6"></rect><rect x="3" y="15" width="6" height="6"></rect><rect x="15" y="15" width="6" height="6" fill="currentColor"></rect></svg>`,
  select: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="3 3"><rect x="3" y="3" width="18" height="18" rx="1"></rect></svg>`,
  move: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>`,
  colorReplace: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path><circle cx="12" cy="12" r="3" fill="currentColor"></circle></svg>`,

  // Transformations & Actions
  flipH: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 5 3 12 8 19"></polyline><polyline points="16 5 21 12 16 19"></polyline><line x1="12" y1="2" x2="12" y2="22" stroke-dasharray="2 2"></line></svg>`,
  flipV: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 8 12 3 19 8"></polyline><polyline points="5 16 12 21 19 16"></polyline><line x1="2" y1="12" x2="22" y2="12" stroke-dasharray="2 2"></line></svg>`,
  rotate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19"></path></svg>`,
  crop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2v14a2 2 0 0 0 2 2h14"></path><path d="M18 22V8a2 2 0 0 0-2-2H2"></path></svg>`,

  // UI & Playback Controls
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
  pause: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`,
  stepNext: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2"></line></svg>`,
  stepPrev: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="5" x2="5" y2="19" stroke="currentColor" stroke-width="2"></line></svg>`,
  onion: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" stroke-dasharray="3 3"></circle><circle cx="12" cy="12" r="5"></circle></svg>`,
  loop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>`,
  pingpong: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 8 3 12 7 16"></polyline><polyline points="17 8 21 12 17 16"></polyline><line x1="3" y1="12" x2="21" y2="12"></line></svg>`,
  reverse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>`,

  // Edit / File / History
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
  cut: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>`,
  paste: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`,
  merge: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 18 12 22 16 18"></polyline><polyline points="8 6 12 2 16 6"></polyline><line x1="12" y1="2" x2="12" y2="22"></line></svg>`,
  flatten: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
  swap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="8 21 3 21 3 16"></polyline><line x1="15" y1="9" x2="20" y2="4"></line></svg>`,
  tiles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h7v7H4z"></path><path d="M13 4h7v7h-7z"></path><path d="M4 13h7v7H4z"></path><path d="M13 13h7v7h-7z"></path></svg>`,
  palette: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>`,
  filters: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`,
  help: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  film: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>`,
  image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
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
 * PixelForge - Core Pixel Drawing & Image Math Algorithms
 * High-performance Bresenham lines, midpoint circles, flood fill, Bayer dithering,
 * pixel-perfect strokes, spatial transformations (flip/rotate/crop/scale), and color adjustments.
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

// --- 3. Midpoint Circle Algorithm ---
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

  // Circle outline using midpoint circle algorithm
  let x = r;
  let y = 0;
  let err = 1 - r;

  const added = new Set();
  const plot = (px, py) => {
    const key = `${px},${py}`;
    if (!added.has(key)) {
      added.add(key);
      points.push({ x: px, y: py });
    }
  };

  const plot8 = (px, py) => {
    plot(cx + px, cy + py);
    plot(cx - px, cy + py);
    plot(cx + px, cy - py);
    plot(cx - px, cy - py);
    plot(cx + py, cy + px);
    plot(cx - py, cy + px);
    plot(cx + py, cy - px);
    plot(cx - py, cy - px);
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
  const originalColor = pixels[startIndex] || 'transparent';

  if (originalColor.toLowerCase() === targetColor.toLowerCase()) return [];

  const modified = [];
  const queue = [[startX, startY]];
  const visited = new Uint8Array(width * height);
  visited[startIndex] = 1;

  const matchColor = (col) => {
    const c = col || 'transparent';
    return c.toLowerCase() === originalColor.toLowerCase();
  };

  while (queue.length > 0) {
    const [x, y] = queue.pop();
    const idx = y * width + x;

    modified.push({ x, y, color: targetColor });

    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!visited[nIdx] && matchColor(pixels[nIdx])) {
          visited[nIdx] = 1;
          queue.push([nx, ny]);
        }
      }
    }
  }

  return modified;
}

// --- 5. Bayer 4x4 Dithering ---
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

// --- 6. Pixel-Perfect Stroke Filter (removes redundant double corners) ---
function filterPixelPerfect(strokePoints) {
  if (strokePoints.length < 3) return strokePoints;

  const result = [strokePoints[0]];

  for (let i = 1; i < strokePoints.length - 1; i++) {
    const prev = strokePoints[i - 1];
    const curr = strokePoints[i];
    const next = strokePoints[i + 1];

    const dx1 = curr.x - prev.x;
    const dy1 = curr.y - prev.y;
    const dx2 = next.x - curr.x;
    const dy2 = next.y - curr.y;

    const isCorner = (dx1 !== 0 && dy2 !== 0 && dx2 === 0 && dy1 === 0) ||
                     (dy1 !== 0 && dx2 !== 0 && dy1 === 0 && dx1 === 0);

    if (isCorner && Math.abs(next.x - prev.x) === 1 && Math.abs(next.y - prev.y) === 1) {
      continue; // Skip redundant corner pixel
    }

    result.push(curr);
  }

  result.push(strokePoints[strokePoints.length - 1]);
  return result;
}

// --- 7. Spatial Transformations (Flip / Rotate / Crop / Scale) ---

function flipPixelsHorizontal(pixels, width, height, selection = null) {
  const next = [...pixels];
  const minX = selection ? Math.max(0, Math.min(selection.x0, selection.x1)) : 0;
  const maxX = selection ? Math.min(width - 1, Math.max(selection.x0, selection.x1)) : width - 1;
  const minY = selection ? Math.max(0, Math.min(selection.y0, selection.y1)) : 0;
  const maxY = selection ? Math.min(height - 1, Math.max(selection.y0, selection.y1)) : height - 1;

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= Math.floor((minX + maxX) / 2); x++) {
      const oppX = maxX - (x - minX);
      const idx1 = y * width + x;
      const idx2 = y * width + oppX;
      const temp = next[idx1];
      next[idx1] = next[idx2];
      next[idx2] = temp;
    }
  }
  return next;
}

function flipPixelsVertical(pixels, width, height, selection = null) {
  const next = [...pixels];
  const minX = selection ? Math.max(0, Math.min(selection.x0, selection.x1)) : 0;
  const maxX = selection ? Math.min(width - 1, Math.max(selection.x0, selection.x1)) : width - 1;
  const minY = selection ? Math.max(0, Math.min(selection.y0, selection.y1)) : 0;
  const maxY = selection ? Math.min(height - 1, Math.max(selection.y0, selection.y1)) : height - 1;

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= Math.floor((minY + maxY) / 2); y++) {
      const oppY = maxY - (y - minY);
      const idx1 = y * width + x;
      const idx2 = oppY * width + x;
      const temp = next[idx1];
      next[idx1] = next[idx2];
      next[idx2] = temp;
    }
  }
  return next;
}

function rotatePixels90CW(pixels, width, height) {
  // If square, rotate in place; if non-square, transpose
  const next = new Array(width * height).fill('transparent');
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const newX = height - 1 - y;
      const newY = x;
      if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
        next[newY * width + newX] = pixels[y * width + x];
      }
    }
  }
  return next;
}

function resizePixelBuffer(pixels, oldW, oldH, newW, newH, anchor = 'center') {
  const result = new Array(newW * newH).fill('transparent');
  let offsetX = 0;
  let offsetY = 0;

  if (anchor === 'center') {
    offsetX = Math.floor((newW - oldW) / 2);
    offsetY = Math.floor((newH - oldH) / 2);
  } else if (anchor === 'top-left') {
    offsetX = 0;
    offsetY = 0;
  } else if (anchor === 'bottom-right') {
    offsetX = newW - oldW;
    offsetY = newH - oldH;
  }

  for (let y = 0; y < oldH; y++) {
    for (let x = 0; x < oldW; x++) {
      const targetX = x + offsetX;
      const targetY = y + offsetY;
      if (targetX >= 0 && targetX < newW && targetY >= 0 && targetY < newH) {
        result[targetY * newW + targetX] = pixels[y * oldW + x];
      }
    }
  }
  return result;
}

function scalePixelBuffer(pixels, oldW, oldH, scaleFactor) {
  const newW = Math.round(oldW * scaleFactor);
  const newH = Math.round(oldH * scaleFactor);
  const result = new Array(newW * newH).fill('transparent');

  for (let ny = 0; ny < newH; ny++) {
    for (let nx = 0; nx < newW; nx++) {
      const srcX = Math.min(oldW - 1, Math.floor(nx / scaleFactor));
      const srcY = Math.min(oldH - 1, Math.floor(ny / scaleFactor));
      result[ny * newW + nx] = pixels[srcY * oldW + srcX];
    }
  }
  return { pixels: result, width: newW, height: newH };
}

// --- 8. Color Adjustments & Filters ---

function replaceColorInPixels(pixels, fromColor, toColor, selection = null, width = 0, height = 0) {
  const next = [...pixels];
  const from = (fromColor || 'transparent').toLowerCase();
  const to = toColor || 'transparent';

  const minX = selection ? Math.max(0, Math.min(selection.x0, selection.x1)) : 0;
  const maxX = selection ? Math.min(width - 1, Math.max(selection.x0, selection.x1)) : width - 1;
  const minY = selection ? Math.max(0, Math.min(selection.y0, selection.y1)) : 0;
  const maxY = selection ? Math.min(height - 1, Math.max(selection.y0, selection.y1)) : height - 1;

  for (let y = minY; y <= (selection ? maxY : height - 1); y++) {
    for (let x = minX; x <= (selection ? maxX : width - 1); x++) {
      const idx = y * width + x;
      const cur = (next[idx] || 'transparent').toLowerCase();
      if (cur === from) {
        next[idx] = to;
      }
    }
  }
  return next;
}

function adjustPixelsBrightnessContrast(pixels, brightness = 0, contrast = 0) {
  return pixels.map(col => {
    if (!col || col === 'transparent') return 'transparent';
    const rgb = hexToRgb(col);
    // Contrast factor
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    const r = Math.max(0, Math.min(255, factor * (rgb.r - 128) + 128 + brightness));
    const g = Math.max(0, Math.min(255, factor * (rgb.g - 128) + 128 + brightness));
    const b = Math.max(0, Math.min(255, factor * (rgb.b - 128) + 128 + brightness));
    return rgbToHex(r, g, b);
  });
}

function invertPixels(pixels) {
  return pixels.map(col => {
    if (!col || col === 'transparent') return 'transparent';
    const rgb = hexToRgb(col);
    return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
  });
}

function grayscalePixels(pixels) {
  return pixels.map(col => {
    if (!col || col === 'transparent') return 'transparent';
    const rgb = hexToRgb(col);
    const lum = Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
    return rgbToHex(lum, lum, lum);
  });
}

// --- 9. Color Helpers ---
function hexToRgb(hex) {
  if (!hex || hex === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  if (isNaN(num)) return { r: 0, g: 0, b: 0, a: 1 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
    a: 1
  };
}

function rgbToHex(r, g, b) {
  const clamp = (x) => Math.max(0, Math.min(255, Math.round(x)));
  return '#' + [r, g, b].map(x => {
    const hex = clamp(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function hsvToRgb(h, s, v) {
  h /= 360; s /= 100; v /= 100;
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
 * Authentic hardware palettes (PICO-8, Game Boy DMG/Pocket, Commodore 64, NES Classic,
 * Cyberpunk Neon, Endesga 32, Sweetie 16, Solarized Dark, Resurrect 64).
 */

const PALETTES = {
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

function getPalette(id = 'pico8') {
  return PALETTES[id] || PALETTES.pico8;
}

function parseHexPalette(text) {
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

function exportHexPalette(colors) {
  return colors.map(c => c.replace('#', '')).join('\n');
}

PALETTES;


/* --- MODULE: js/core/db.js --- */
/**
 * PixelForge - IndexedDB & LocalStorage Persistence Engine
 * Saves pixel art projects, multi-frame animations, layers, and custom palettes.
 * Robust fallback for offline and file:/// environments with corrupted data recovery.
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
    this.memoryStore = new Map();
  }

  async init() {
    if (typeof indexedDB === 'undefined') {
      return null;
    }

    return new Promise((resolve) => {
      try {
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
      } catch (err) {
        console.warn('IndexedDB initialization error, using LocalStorage fallback:', err);
        resolve(null);
      }
    });
  }

  async saveProject(project) {
    if (!project || !project.id) return false;
    project.updatedAt = new Date().toISOString();

    if (this.db) {
      return new Promise((resolve) => {
        try {
          const tx = this.db.transaction([STORES.PROJECTS], 'readwrite');
          tx.objectStore(STORES.PROJECTS).put(project);
          tx.oncomplete = () => {
            try { localStorage.setItem('pixelforge_last_project_id', project.id); } catch(e) {}
            resolve(true);
          };
          tx.onerror = () => resolve(false);
        } catch (e) {
          resolve(false);
        }
      });
    }

    try {
      localStorage.setItem('pixelforge_proj_' + project.id, JSON.stringify(project));
      localStorage.setItem('pixelforge_last_project_id', project.id);
      return true;
    } catch (e) {
      this.memoryStore.set('pixelforge_proj_' + project.id, JSON.stringify(project));
      return true;
    }
  }

  async loadProject(id) {
    if (!id) return null;

    if (this.db) {
      return new Promise((resolve) => {
        try {
          const tx = this.db.transaction([STORES.PROJECTS], 'readonly');
          const req = tx.objectStore(STORES.PROJECTS).get(id);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    }

    try {
      const raw = localStorage.getItem('pixelforge_proj_' + id);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      const mem = this.memoryStore.get('pixelforge_proj_' + id);
      return mem ? JSON.parse(mem) : null;
    }
  }

  async deleteProject(id) {
    if (!id) return false;

    if (this.db) {
      return new Promise((resolve) => {
        try {
          const tx = this.db.transaction([STORES.PROJECTS], 'readwrite');
          tx.objectStore(STORES.PROJECTS).delete(id);
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(false);
        } catch (e) {
          resolve(false);
        }
      });
    }

    try {
      localStorage.removeItem('pixelforge_proj_' + id);
      this.memoryStore.delete('pixelforge_proj_' + id);
      return true;
    } catch (e) {
      return false;
    }
  }

  async getAllProjects() {
    if (this.db) {
      return new Promise((resolve) => {
        try {
          const tx = this.db.transaction([STORES.PROJECTS], 'readonly');
          const req = tx.objectStore(STORES.PROJECTS).getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        } catch (e) {
          resolve([]);
        }
      });
    }

    const list = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pixelforge_proj_')) {
          try {
            const item = JSON.parse(localStorage.getItem(key));
            if (item && item.id) list.push(item);
          } catch (err) {}
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
 * PixelForge - High-Performance Canvas 2D Pixel Art Renderer
 * Renders pixel-accurate grid, multi-layer compositing, blend modes, onion skinning,
 * symmetry lines, selection marquees, and floating paste previews.
 */

class CanvasRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0, zoom: 16 }; // Default 16x pixel zoom
    this.ctx.imageSmoothingEnabled = false;
    this.marqueeOffset = 0;
  }

  resize(width, height) {
    if (!this.canvas) return;
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
    onionSkinOpacity = 0.3,
    symmetryMode = 'none', // none, horizontal, vertical, both
    activePreviewPixels = [],
    selection = null,
    floatingSelection = null,
    cursorPos = null,
    brushSize = 1,
    backgroundColor = 'transparent'
  }) {
    if (!this.ctx || !project) return;

    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const pw = project.width || 32;
    const ph = project.height || 32;
    const zoom = Math.max(1, this.camera.zoom);

    // 1. Clear Viewport background
    ctx.fillStyle = '#0a0c10';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    // 2. Camera Transform (Pan & Zoom)
    ctx.translate(Math.round(this.camera.x), Math.round(this.camera.y));
    ctx.scale(zoom, zoom);

    // 3. Canvas Bounds Shadow & Border
    ctx.fillStyle = '#141722';
    ctx.fillRect(0, 0, pw, ph);

    // 4. Background Fill or Checkerboard Transparency Pattern
    if (backgroundColor && backgroundColor !== 'transparent') {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, pw, ph);
    } else {
      this.drawCheckerboard(pw, ph);
    }

    // 5. Onion Skinning (Previous Frame in Cyan / Next in Red)
    if (showOnionSkin && project.frames && project.frames.length > 1) {
      this.drawOnionSkin(project, activeFrameIndex, onionSkinOpacity);
    }

    // 6. Composite Active Frame Layers
    const currentFrame = project.frames ? project.frames[activeFrameIndex] : null;
    if (currentFrame && currentFrame.layers) {
      for (const layer of currentFrame.layers) {
        if (layer.visible === false) continue;
        this.renderLayer(layer, pw, ph);
      }
    }

    // 7. Floating Selection (Paste / Move preview)
    if (floatingSelection && floatingSelection.pixels) {
      this.renderFloatingSelection(floatingSelection, pw, ph);
    }

    // 8. Active Tool Drawing Preview
    if (activePreviewPixels && activePreviewPixels.length > 0) {
      for (const p of activePreviewPixels) {
        if (p.x >= 0 && p.x < pw && p.y >= 0 && p.y < ph) {
          ctx.fillStyle = p.color || '#58a6ff';
          ctx.fillRect(p.x, p.y, 1, 1);
        }
      }
    }

    // 9. Selection Marquee
    if (selection) {
      this.drawSelectionMarquee(selection, zoom);
    }

    // 10. Symmetry Mirror Guidelines
    if (symmetryMode !== 'none') {
      this.drawSymmetryLines(pw, ph, symmetryMode, zoom);
    }

    // 11. Pixel Grid Overlay (when zoom >= 6x)
    if (showGrid && zoom >= 5) {
      this.drawPixelGrid(pw, ph, zoom);
    }

    // 12. Cursor Hover Indicator (Brush Box)
    if (cursorPos && cursorPos.x >= 0 && cursorPos.x < pw && cursorPos.y >= 0 && cursorPos.y < ph) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1 / zoom;
      const offset = Math.floor(brushSize / 2);
      ctx.strokeRect(cursorPos.x - offset, cursorPos.y - offset, brushSize, brushSize);
      ctx.restore();
    }

    // 13. Canvas Outer Border
    ctx.save();
    ctx.strokeStyle = 'rgba(88, 166, 255, 0.5)';
    ctx.lineWidth = 1 / zoom;
    ctx.strokeRect(0, 0, pw, ph);
    ctx.restore();

    ctx.restore();
  }

  // --- Checkerboard Transparency ---
  drawCheckerboard(pw, ph) {
    const ctx = this.ctx;
    for (let y = 0; y < ph; y++) {
      for (let x = 0; x < pw; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? '#181c28' : '#23293a';
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  // --- Single Layer Renderer ---
  renderLayer(layer, pw, ph) {
    if (!layer || !layer.pixels) return;
    const ctx = this.ctx;
    ctx.save();

    if (layer.blendMode && layer.blendMode !== 'normal') {
      ctx.globalCompositeOperation = layer.blendMode;
    }
    if (layer.opacity !== undefined) {
      ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity));
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

  // --- Floating Selection Preview ---
  renderFloatingSelection(sel, pw, ph) {
    const ctx = this.ctx;
    ctx.save();
    const { x, y, width, height, pixels } = sel;
    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const targetX = x + px;
        const targetY = y + py;
        if (targetX >= 0 && targetX < pw && targetY >= 0 && targetY < ph) {
          const col = pixels[py * width + px];
          if (col && col !== 'transparent') {
            ctx.fillStyle = col;
            ctx.fillRect(targetX, targetY, 1, 1);
          }
        }
      }
    }
    ctx.restore();
  }

  // --- Onion Skinning ---
  drawOnionSkin(project, activeIndex, opacity = 0.3) {
    const ctx = this.ctx;
    const pw = project.width;
    const ph = project.height;

    // Previous Frame (Cyan)
    if (activeIndex > 0) {
      const prevFrame = project.frames[activeIndex - 1];
      if (prevFrame && prevFrame.layers) {
        ctx.save();
        ctx.globalAlpha = opacity;
        for (const l of prevFrame.layers) {
          if (l.visible === false || !l.pixels) continue;
          for (let y = 0; y < ph; y++) {
            for (let x = 0; x < pw; x++) {
              const col = l.pixels[y * pw + x];
              if (col && col !== 'transparent') {
                ctx.fillStyle = '#00e5ff';
                ctx.fillRect(x, y, 1, 1);
              }
            }
          }
        }
        ctx.restore();
      }
    }

    // Next Frame (Red)
    if (activeIndex < project.frames.length - 1) {
      const nextFrame = project.frames[activeIndex + 1];
      if (nextFrame && nextFrame.layers) {
        ctx.save();
        ctx.globalAlpha = opacity;
        for (const l of nextFrame.layers) {
          if (l.visible === false || !l.pixels) continue;
          for (let y = 0; y < ph; y++) {
            for (let x = 0; x < pw; x++) {
              const col = l.pixels[y * pw + x];
              if (col && col !== 'transparent') {
                ctx.fillStyle = '#ff1744';
                ctx.fillRect(x, y, 1, 1);
              }
            }
          }
        }
        ctx.restore();
      }
    }
  }

  // --- Pixel Grid ---
  drawPixelGrid(pw, ph, zoom) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
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
    ctx.setLineDash([3 / zoom, 3 / zoom]);

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
  drawSelectionMarquee(sel, zoom) {
    const ctx = this.ctx;
    ctx.save();

    const minX = Math.min(sel.x0, sel.x1);
    const minY = Math.min(sel.y0, sel.y1);
    const w = Math.abs(sel.x1 - sel.x0) + 1;
    const h = Math.abs(sel.y1 - sel.y0) + 1;

    // Fill tinted selection
    ctx.fillStyle = 'rgba(88, 166, 255, 0.18)';
    ctx.fillRect(minX, minY, w, h);

    // Dashed border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1 / zoom;
    ctx.setLineDash([3 / zoom, 3 / zoom]);
    ctx.strokeRect(minX, minY, w, h);

    // Inner contrasting dash
    ctx.strokeStyle = '#000000';
    ctx.lineDashOffset = 3 / zoom;
    ctx.strokeRect(minX, minY, w, h);

    ctx.restore();
  }
}


/* --- MODULE: js/engine/animation.js --- */
/**
 * PixelForge - Animation Playback, Sprite Sheet, Animated SVG & Video Exporter Engine
 * Supports Loop, Ping-Pong, and Once playback modes, custom FPS, Sprite Sheet + JSON Atlas export,
 * infinite animated vector SVG, and MediaRecorder video recording.
 */

class AnimationEngine {
  constructor(app) {
    this.app = app;
    this.isPlaying = false;
    this.fps = 8;
    this.playMode = 'loop'; // 'loop', 'pingpong', 'once'
    this.playDirection = 1; // 1 = forward, -1 = backward (for pingpong)
    this.lastTime = 0;
    this.accumulatedTime = 0;
    this.animId = null;
  }

  play() {
    if (this.isPlaying) return;
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

    const frameDuration = 1 / Math.max(1, this.fps);
    if (this.accumulatedTime >= frameDuration) {
      this.accumulatedTime -= frameDuration;
      this.stepNext();
    }

    this.animId = requestAnimationFrame(this.loop);
  }

  stepNext() {
    const totalFrames = (this.app.project.frames || []).length;
    if (totalFrames <= 1) return;

    if (this.playMode === 'pingpong') {
      let nextIdx = this.app.activeFrameIndex + this.playDirection;
      if (nextIdx >= totalFrames) {
        this.playDirection = -1;
        nextIdx = totalFrames - 2;
      } else if (nextIdx < 0) {
        this.playDirection = 1;
        nextIdx = 1;
      }
      this.app.setFrame(Math.max(0, Math.min(totalFrames - 1, nextIdx)));
    } else if (this.playMode === 'once') {
      if (this.app.activeFrameIndex < totalFrames - 1) {
        this.app.setFrame(this.app.activeFrameIndex + 1);
      } else {
        this.pause();
      }
    } else {
      // Loop mode
      if (this.app.activeFrameIndex < totalFrames - 1) {
        this.app.setFrame(this.app.activeFrameIndex + 1);
      } else {
        this.app.setFrame(0);
      }
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

  // --- Frame Renderer Helper ---
  renderFrameToCanvas(frame, width, height, scale = 1, backgroundColor = null) {
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    if (backgroundColor && backgroundColor !== 'transparent') {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const layers = frame.layers || [];
    for (const layer of layers) {
      if (layer.visible === false || !layer.pixels) continue;
      ctx.save();
      if (layer.blendMode && layer.blendMode !== 'normal') {
        ctx.globalCompositeOperation = layer.blendMode;
      }
      if (layer.opacity !== undefined) {
        ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity));
      }

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

  // --- Sprite Sheet Generator ---
  generateSpriteSheet(columns = null, scale = 1, padding = 0, backgroundColor = null) {
    const project = this.app.project;
    const frames = project.frames || [];
    const numFrames = frames.length;
    const fw = project.width * scale;
    const fh = project.height * scale;

    const cols = columns || numFrames;
    const rows = Math.ceil(numFrames / cols);

    const sheetCanvas = document.createElement('canvas');
    sheetCanvas.width = cols * (fw + padding) - padding;
    sheetCanvas.height = rows * (fh + padding) - padding;
    const ctx = sheetCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    if (backgroundColor && backgroundColor !== 'transparent') {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);
    }

    const framesMeta = [];

    frames.forEach((frame, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const destX = col * (fw + padding);
      const destY = row * (fh + padding);

      const frameCanvas = this.renderFrameToCanvas(frame, project.width, project.height, scale, null);
      ctx.drawImage(frameCanvas, destX, destY);

      framesMeta.push({
        filename: `frame_${idx}`,
        frame: { x: destX, y: destY, w: fw, h: fh },
        duration: Math.round(1000 / this.fps)
      });
    });

    const atlasJSON = {
      meta: {
        app: 'PixelForge',
        version: '1.0',
        image: (project.name || 'spritesheet').toLowerCase().replace(/\s+/g, '_') + '_sheet.png',
        format: 'RGBA8888',
        size: { w: sheetCanvas.width, h: sheetCanvas.height },
        scale: scale,
        fps: this.fps,
        totalFrames: numFrames
      },
      frames: framesMeta
    };

    return { canvas: sheetCanvas, atlasJSON };
  }

  // --- Animated SVG Generator ---
  generateAnimatedSVG(scale = 10) {
    const project = this.app.project;
    const pw = project.width;
    const ph = project.height;
    const frames = project.frames || [];
    const numFrames = frames.length;
    const duration = (numFrames / Math.max(1, this.fps)).toFixed(3);

    const svgWidth = pw * scale;
    const svgHeight = ph * scale;

    let keyframesCSS = '';
    let framesSVG = '';

    frames.forEach((frame, idx) => {
      const startPercent = ((idx / numFrames) * 100).toFixed(2);
      const endPercent = (((idx + 1) / numFrames) * 100).toFixed(2);

      keyframesCSS += `
        @keyframes anim_frame_${idx} {
          0%, ${startPercent}% { opacity: 0; }
          ${(Number(startPercent) + 0.01).toFixed(2)}%, ${endPercent}% { opacity: 1; }
          ${(Number(endPercent) + 0.01).toFixed(2)}%, 100% { opacity: 0; }
        }
        .pf-frame-${idx} {
          animation: anim_frame_${idx} ${duration}s infinite step-end;
        }
      `;

      let frameRects = '';
      const layers = frame.layers || [];
      for (const layer of layers) {
        if (layer.visible === false || !layer.pixels) continue;
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
        <g class="pf-frame pf-frame-${idx}" id="frame_${idx}">
          ${frameRects}
        </g>
      `;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}" shape-rendering="crispEdges">
  <style>
    .pf-frame { opacity: 0; }
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

    if (typeof MediaRecorder === 'undefined' || !recCanvas.captureStream) {
      throw new Error('MediaRecorder video capture is not supported in this browser.');
    }

    const stream = recCanvas.captureStream(Math.max(1, this.fps));
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

    const recordPromise = new Promise((resolve, reject) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType || 'video/webm' });
        resolve(blob);
      };
      recorder.onerror = (err) => reject(err);
    });

    recorder.start();

    const frameDelay = 1000 / Math.max(1, this.fps);

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
    if (!project || !project.frames) return;

    const currentFrame = project.frames[this.app.activeFrameIndex || 0];
    if (!currentFrame) return;

    const pw = project.width;
    const ph = project.height;
    const cols = Math.max(1, Math.floor(pw / tileSize));
    const rows = Math.max(1, Math.floor(ph / tileSize));

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tilePixels = new Array(tileSize * tileSize).fill('transparent');
        for (let ty = 0; ty < tileSize; ty++) {
          for (let tx = 0; tx < tileSize; tx++) {
            const srcX = c * tileSize + tx;
            const srcY = r * tileSize + ty;

            if (srcX < pw && srcY < ph) {
              for (const layer of currentFrame.layers) {
                if (layer.visible === false || !layer.pixels) continue;
                const color = layer.pixels[srcY * pw + srcX];
                if (color && color !== 'transparent') {
                  tilePixels[ty * tileSize + tx] = color;
                }
              }
            }
          }
        }
        this.tiles.push({
          id: this.tiles.length,
          col: c,
          row: r,
          pixels: tilePixels
        });
      }
    }

    if (this.selectedTileIndex >= this.tiles.length) {
      this.selectedTileIndex = 0;
    }
  }

  resizeMap(cols, rows) {
    const oldCols = this.mapCols;
    const oldRows = this.mapRows;
    const oldData = this.tilemapData;

    this.mapCols = cols;
    this.mapRows = rows;
    this.tilemapData = new Array(cols * rows).fill(-1);

    for (let r = 0; r < Math.min(oldRows, rows); r++) {
      for (let c = 0; c < Math.min(oldCols, cols); c++) {
        this.tilemapData[r * cols + c] = oldData[r * oldCols + c];
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

  clearMap() {
    this.tilemapData.fill(-1);
  }

  fillMap(tileIndex) {
    this.tilemapData.fill(tileIndex);
  }

  renderTileToCanvas(tile, scale = 2) {
    const canvas = document.createElement('canvas');
    canvas.width = this.tileSize * scale;
    canvas.height = this.tileSize * scale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Checkerboard
    for (let y = 0; y < this.tileSize; y++) {
      for (let x = 0; x < this.tileSize; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? '#181b24' : '#222634';
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }

    if (tile && tile.pixels) {
      for (let ty = 0; ty < this.tileSize; ty++) {
        for (let tx = 0; tx < this.tileSize; tx++) {
          const color = tile.pixels[ty * this.tileSize + tx];
          if (color && color !== 'transparent') {
            ctx.fillStyle = color;
            ctx.fillRect(tx * scale, ty * scale, scale, scale);
          }
        }
      }
    }

    return canvas;
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
      app: 'PixelForge Tilemap Engine',
      version: '1.0',
      tileSize: this.tileSize,
      cols: this.mapCols,
      rows: this.mapRows,
      totalTiles: this.tiles.length,
      data: [...this.tilemapData]
    }, null, 2);
  }
}


/* --- MODULE: js/editor/modals.js --- */
/**
 * PixelForge - Modal & Dialog Management System
 * Production-quality dialogs, tabbed export center, new canvas creator, filters,
 * tilemap studio, shortcuts cheat sheet, and non-blocking toast notifications.
 */




// --- Toast Notifications ---
function showToast(message, type = 'info', duration = 2800) {
  let container = document.getElementById('pf-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'pf-toast-container';
    container.className = 'pf-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `pf-toast pf-toast-${type}`;

  let iconName = 'info';
  if (type === 'success') iconName = 'check';
  if (type === 'warning' || type === 'error') iconName = 'info';

  toast.innerHTML = `
    <span class="pf-toast-icon">${getIcon(iconName, 'icon-xs')}</span>
    <span class="pf-toast-msg">${escapeHTML(message)}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

// --- Base Modal Helper ---
function createModal({ title, width = '480px', contentHTML, onClose }) {
  // Remove existing modals
  document.querySelectorAll('.pf-modal-backdrop').forEach(el => el.remove());

  const backdrop = document.createElement('div');
  backdrop.className = 'pf-modal-backdrop';

  backdrop.innerHTML = `
    <div class="pf-modal-dialog" style="max-width: ${width};" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="pf-modal-header">
        <h3 class="pf-modal-title" id="modal-title">${escapeHTML(title)}</h3>
        <button class="btn-icon-xs pf-modal-close" aria-label="Close Dialog">
          ${getIcon('close', 'icon-sm')}
        </button>
      </div>
      <div class="pf-modal-body">
        ${contentHTML}
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  const close = () => {
    backdrop.classList.add('closing');
    setTimeout(() => {
      backdrop.remove();
      if (onClose) onClose();
    }, 150);
  };

  backdrop.querySelector('.pf-modal-close').addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  // ESC key to close
  const onKey = (e) => {
    if (e.key === 'Escape') {
      window.removeEventListener('keydown', onKey);
      close();
    }
  };
  window.addEventListener('keydown', onKey);

  requestAnimationFrame(() => {
    backdrop.classList.add('show');
  });

  return { backdrop, close };
}

// --- 1. Confirm Modal ---
function showConfirmModal({ title = 'Confirmation', message, confirmText = 'Confirm', cancelText = 'Cancel', isDanger = false, onConfirm }) {
  const contentHTML = `
    <p class="text-secondary text-sm mb-3">${escapeHTML(message)}</p>
    <div class="flex justify-end gap-2 mt-4">
      <button class="btn btn-secondary" id="btn-modal-cancel">${escapeHTML(cancelText)}</button>
      <button class="btn ${isDanger ? 'btn-danger' : 'btn-primary'}" id="btn-modal-confirm">${escapeHTML(confirmText)}</button>
    </div>
  `;

  const { backdrop, close } = createModal({ title, width: '400px', contentHTML });

  backdrop.querySelector('#btn-modal-cancel').addEventListener('click', close);
  backdrop.querySelector('#btn-modal-confirm').addEventListener('click', () => {
    close();
    if (onConfirm) onConfirm();
  });
}

// --- 2. New Project / Canvas Modal ---
function showNewProjectModal(onCreate) {
  const contentHTML = `
    <div class="flex flex-col gap-3">
      <div>
        <label class="block text-xs font-semibold text-muted uppercase mb-1">Project Name</label>
        <input type="text" id="new-proj-name" class="form-control" value="Pixel Artwork" placeholder="Enter project name..." />
      </div>

      <!-- Quick Resolution Presets -->
      <div>
        <label class="block text-xs font-semibold text-muted uppercase mb-1">Resolution Presets</label>
        <div class="grid grid-cols-3 gap-1 mb-2">
          <button type="button" class="btn btn-xs btn-secondary btn-preset-size" data-w="16" data-h="16">16 × 16 (Icon)</button>
          <button type="button" class="btn btn-xs btn-secondary btn-preset-size" data-w="24" data-h="24">24 × 24 (Sprite)</button>
          <button type="button" class="btn btn-xs btn-secondary active btn-preset-size" data-w="32" data-h="32">32 × 32 (Standard)</button>
          <button type="button" class="btn btn-xs btn-secondary btn-preset-size" data-w="48" data-h="48">48 × 48 (Portrait)</button>
          <button type="button" class="btn btn-xs btn-secondary btn-preset-size" data-w="64" data-h="64">64 × 64 (Tileset)</button>
          <button type="button" class="btn btn-xs btn-secondary btn-preset-size" data-w="128" data-h="128">128 × 128 (Scene)</button>
        </div>
      </div>

      <div class="flex gap-2">
        <div class="flex-1">
          <label class="block text-xs font-semibold text-muted uppercase mb-1">Width (px)</label>
          <input type="number" id="new-proj-w" class="form-control font-mono" min="8" max="256" value="32" />
        </div>
        <div class="flex-1">
          <label class="block text-xs font-semibold text-muted uppercase mb-1">Height (px)</label>
          <input type="number" id="new-proj-h" class="form-control font-mono" min="8" max="256" value="32" />
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-muted uppercase mb-1">Background Fill</label>
        <select id="new-proj-bg" class="form-control">
          <option value="transparent">Transparent (Checkerboard)</option>
          <option value="#000000">Pure Black (#000000)</option>
          <option value="#ffffff">Pure White (#FFFFFF)</option>
          <option value="#090d16">Night Sky (#090D16)</option>
          <option value="#FFF1E8">Retro Cream (#FFF1E8)</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-semibold text-muted uppercase mb-1">Initial Color Palette</label>
        <select id="new-proj-palette" class="form-control">
          ${Object.values(PALETTES).map(p => `<option value="${p.id}">${escapeHTML(p.name)}</option>`).join('')}
        </select>
      </div>

      <div class="flex justify-end gap-2 mt-3 pt-2 border-t">
        <button class="btn btn-secondary" id="btn-cancel-new">Cancel</button>
        <button class="btn btn-primary" id="btn-create-new">Create Canvas</button>
      </div>
    </div>
  `;

  const { backdrop, close } = createModal({ title: 'Create New Canvas', width: '420px', contentHTML });

  const inputW = backdrop.querySelector('#new-proj-w');
  const inputH = backdrop.querySelector('#new-proj-h');

  backdrop.querySelectorAll('.btn-preset-size').forEach(btn => {
    btn.addEventListener('click', () => {
      backdrop.querySelectorAll('.btn-preset-size').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      inputW.value = btn.dataset.w;
      inputH.value = btn.dataset.h;
    });
  });

  backdrop.querySelector('#btn-cancel-new').addEventListener('click', close);
  backdrop.querySelector('#btn-create-new').addEventListener('click', () => {
    const name = backdrop.querySelector('#new-proj-name').value.trim() || 'Pixel Artwork';
    const w = parseInt(inputW.value, 10);
    const h = parseInt(inputH.value, 10);
    const bg = backdrop.querySelector('#new-proj-bg').value;
    const pal = backdrop.querySelector('#new-proj-palette').value;

    if (w < 8 || w > 256 || h < 8 || h > 256) {
      showToast('Canvas dimensions must be between 8x8 and 256x256 px.', 'warning');
      return;
    }

    close();
    if (onCreate) onCreate({ name, width: w, height: h, background: bg, paletteId: pal });
  });
}

// --- 3. Export Center Modal ---
function showExportModal(app) {
  const project = app.project;
  const numFrames = (project.frames || []).length;
  const pw = project.width;
  const ph = project.height;

  const contentHTML = `
    <div class="pf-export-modal-tabs">
      <div class="pf-modal-tab-bar flex border-b mb-3">
        <button class="pf-tab-btn active" data-tab="png">Upscaled PNG</button>
        <button class="pf-tab-btn" data-tab="sheet">Sprite Sheet</button>
        <button class="pf-tab-btn" data-tab="svg">Vector SVG</button>
        <button class="pf-tab-btn" data-tab="video">Video Recording</button>
        <button class="pf-tab-btn" data-tab="json">Project JSON</button>
      </div>

      <!-- Tab 1: PNG -->
      <div class="pf-tab-panel active" id="tab-png">
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted">Canvas Resolution:</span>
            <span class="font-mono text-xs font-bold text-primary">${pw} × ${ph} px</span>
          </div>

          <div>
            <label class="block text-xs font-semibold text-muted uppercase mb-1">Pixel Scale Factor</label>
            <div class="grid grid-cols-6 gap-1 mb-2">
              <button type="button" class="btn btn-xs btn-secondary btn-png-scale" data-scale="1">1×</button>
              <button type="button" class="btn btn-xs btn-secondary btn-png-scale" data-scale="2">2×</button>
              <button type="button" class="btn btn-xs btn-secondary btn-png-scale" data-scale="4">4×</button>
              <button type="button" class="btn btn-xs btn-secondary active btn-png-scale" data-scale="8">8×</button>
              <button type="button" class="btn btn-xs btn-secondary btn-png-scale" data-scale="16">16×</button>
              <button type="button" class="btn btn-xs btn-secondary btn-png-scale" data-scale="32">32×</button>
            </div>
            <div class="text-xs text-muted">Exported Image Dimensions: <strong class="text-primary font-mono" id="png-out-dim">${pw * 8} × ${ph * 8} px</strong></div>
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" id="png-opt-current-only" checked />
            <label for="png-opt-current-only" class="text-xs text-secondary cursor-pointer">Export active frame only (#${app.activeFrameIndex + 1})</label>
          </div>

          <div class="mt-2 pt-2 border-t flex justify-end">
            <button class="btn btn-primary" id="btn-do-export-png">${getIcon('download', 'icon-xs')} Download PNG</button>
          </div>
        </div>
      </div>

      <!-- Tab 2: Sprite Sheet -->
      <div class="pf-tab-panel" id="tab-sheet">
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted">Total Animation Frames:</span>
            <span class="font-mono text-xs font-bold text-primary">${numFrames} frame${numFrames === 1 ? '' : 's'}</span>
          </div>

          <div class="flex gap-2">
            <div class="flex-1">
              <label class="block text-xs font-semibold text-muted uppercase mb-1">Layout Columns</label>
              <input type="number" id="sheet-cols" class="form-control font-mono" min="1" max="${Math.max(1, numFrames)}" value="${numFrames}" />
            </div>
            <div class="flex-1">
              <label class="block text-xs font-semibold text-muted uppercase mb-1">Scale (1× - 8×)</label>
              <select id="sheet-scale" class="form-control font-mono">
                <option value="1" selected>1×</option>
                <option value="2">2×</option>
                <option value="4">4×</option>
                <option value="8">8×</option>
              </select>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" id="sheet-opt-atlas" checked />
            <label for="sheet-opt-atlas" class="text-xs text-secondary cursor-pointer">Include JSON Atlas Metadata (Godot/Phaser/Unity format)</label>
          </div>

          <div class="mt-2 pt-2 border-t flex justify-end gap-2">
            <button class="btn btn-primary" id="btn-do-export-sheet">${getIcon('download', 'icon-xs')} Download Sprite Sheet</button>
          </div>
        </div>
      </div>

      <!-- Tab 3: Animated SVG -->
      <div class="pf-tab-panel" id="tab-svg">
        <div class="flex flex-col gap-3">
          <p class="text-xs text-secondary">
            Exports a standalone, infinite vector SVG with CSS @keyframes animations embedded. Perfect for web graphics, badges, and high-DPI displays.
          </p>

          <div>
            <label class="block text-xs font-semibold text-muted uppercase mb-1">Vector Pixel Scale</label>
            <select id="svg-scale" class="form-control font-mono">
              <option value="5">5 px / pixel</option>
              <option value="10" selected>10 px / pixel (Standard)</option>
              <option value="16">16 px / pixel (HD)</option>
              <option value="24">24 px / pixel (Ultra)</option>
            </select>
          </div>

          <div class="mt-2 pt-2 border-t flex justify-end gap-2">
            <button class="btn btn-secondary" id="btn-copy-svg-code">${getIcon('copy', 'icon-xs')} Copy SVG</button>
            <button class="btn btn-primary" id="btn-do-export-svg">${getIcon('download', 'icon-xs')} Download SVG</button>
          </div>
        </div>
      </div>

      <!-- Tab 4: Video Recording -->
      <div class="pf-tab-panel" id="tab-video">
        <div class="flex flex-col gap-3">
          <p class="text-xs text-secondary">
            Records the active animation sequence into a WebM/MP4 video loop using client-side canvas streams.
          </p>

          <div class="flex gap-2">
            <div class="flex-1">
              <label class="block text-xs font-semibold text-muted uppercase mb-1">Scale</label>
              <select id="video-scale" class="form-control font-mono">
                <option value="4">4×</option>
                <option value="8" selected>8× (${pw * 8}×${ph * 8})</option>
                <option value="16">16× (${pw * 16}×${ph * 16})</option>
              </select>
            </div>
            <div class="flex-1">
              <label class="block text-xs font-semibold text-muted uppercase mb-1">Loop Count</label>
              <input type="number" id="video-loops" class="form-control font-mono" min="1" max="10" value="3" />
            </div>
          </div>

          <div class="mt-2 pt-2 border-t flex justify-end">
            <button class="btn btn-primary" id="btn-do-record-video">${getIcon('film', 'icon-xs')} Record & Download Video</button>
          </div>
        </div>
      </div>

      <!-- Tab 5: JSON Project -->
      <div class="pf-tab-panel" id="tab-json">
        <div class="flex flex-col gap-3">
          <p class="text-xs text-secondary">
            Exports the entire PixelForge project document including all frames, layer hierarchies, opacity, and palettes for backup and sharing.
          </p>

          <div class="mt-2 pt-2 border-t flex justify-end gap-2">
            <button class="btn btn-primary" id="btn-do-export-json">${getIcon('download', 'icon-xs')} Save Project (.pixelforge.json)</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const { backdrop, close } = createModal({ title: 'Export & Share Artwork', width: '520px', contentHTML });

  // Tab switching
  backdrop.querySelectorAll('.pf-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      backdrop.querySelectorAll('.pf-tab-btn').forEach(b => b.classList.remove('active'));
      backdrop.querySelectorAll('.pf-tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      backdrop.querySelector('#tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  // Scale buttons for PNG
  let pngScale = 8;
  const dimLabel = backdrop.querySelector('#png-out-dim');
  backdrop.querySelectorAll('.btn-png-scale').forEach(btn => {
    btn.addEventListener('click', () => {
      backdrop.querySelectorAll('.btn-png-scale').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      pngScale = parseInt(btn.dataset.scale, 10);
      dimLabel.textContent = `${pw * pngScale} × ${ph * pngScale} px`;
    });
  });

  // Action Handlers
  backdrop.querySelector('#btn-do-export-png').addEventListener('click', () => {
    const activeOnly = backdrop.querySelector('#png-opt-current-only').checked;
    close();
    if (activeOnly) {
      app.exportPNG(pngScale);
    } else {
      app.exportAllFramesPNG(pngScale);
    }
  });

  backdrop.querySelector('#btn-do-export-sheet').addEventListener('click', () => {
    const cols = parseInt(backdrop.querySelector('#sheet-cols').value, 10) || numFrames;
    const scale = parseInt(backdrop.querySelector('#sheet-scale').value, 10) || 1;
    const includeAtlas = backdrop.querySelector('#sheet-opt-atlas').checked;
    close();
    app.exportSpriteSheetWithAtlas(cols, scale, includeAtlas);
  });

  backdrop.querySelector('#btn-do-export-svg').addEventListener('click', () => {
    const scale = parseInt(backdrop.querySelector('#svg-scale').value, 10) || 10;
    close();
    app.exportAnimatedSVG(scale);
  });

  backdrop.querySelector('#btn-copy-svg-code').addEventListener('click', () => {
    const scale = parseInt(backdrop.querySelector('#svg-scale').value, 10) || 10;
    const svgStr = app.animation.generateAnimatedSVG(scale);
    navigator.clipboard.writeText(svgStr).then(() => {
      showToast('Animated SVG copied to clipboard!', 'success');
    });
  });

  backdrop.querySelector('#btn-do-record-video').addEventListener('click', () => {
    const scale = parseInt(backdrop.querySelector('#video-scale').value, 10) || 8;
    const loops = parseInt(backdrop.querySelector('#video-loops').value, 10) || 3;
    close();
    showToast('Recording animation video...', 'info', 4000);
    app.exportVideo(scale, loops);
  });

  backdrop.querySelector('#btn-do-export-json').addEventListener('click', () => {
    close();
    app.exportProjectJSON();
  });
}

// --- 4. Canvas Resize & Rescale Modal ---
function showResizeModal(app, onApply) {
  const pw = app.project.width;
  const ph = app.project.height;

  const contentHTML = `
    <div class="flex flex-col gap-3">
      <div class="pf-modal-tab-bar flex border-b mb-2">
        <button class="pf-tab-btn active" data-mode="canvas">Canvas Canvas Size (Crop / Extend)</button>
        <button class="pf-tab-btn" data-mode="pixel">Pixel Scale (Resample)</button>
      </div>

      <!-- Canvas Size Mode -->
      <div class="pf-resize-mode-panel active" id="mode-canvas">
        <div class="flex gap-2 mb-3">
          <div class="flex-1">
            <label class="block text-xs font-semibold text-muted uppercase mb-1">New Width</label>
            <input type="number" id="resize-w" class="form-control font-mono" min="8" max="256" value="${pw}" />
          </div>
          <div class="flex-1">
            <label class="block text-xs font-semibold text-muted uppercase mb-1">New Height</label>
            <input type="number" id="resize-h" class="form-control font-mono" min="8" max="256" value="${ph}" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-muted uppercase mb-1">Anchor Position</label>
          <div class="grid grid-cols-3 gap-1 w-36 mx-auto mb-2">
            <button class="btn btn-xs btn-secondary btn-anchor" data-anchor="top-left">&#8598;</button>
            <button class="btn btn-xs btn-secondary btn-anchor" data-anchor="top-center">&#8593;</button>
            <button class="btn btn-xs btn-secondary btn-anchor" data-anchor="top-right">&#8599;</button>
            <button class="btn btn-xs btn-secondary btn-anchor" data-anchor="mid-left">&#8592;</button>
            <button class="btn btn-xs btn-secondary active btn-anchor" data-anchor="center">&bull;</button>
            <button class="btn btn-xs btn-secondary btn-anchor" data-anchor="mid-right">&#8594;</button>
            <button class="btn btn-xs btn-secondary btn-anchor" data-anchor="bottom-left">&#8601;</button>
            <button class="btn btn-xs btn-secondary btn-anchor" data-anchor="bottom-center">&#8595;</button>
            <button class="btn btn-xs btn-secondary btn-anchor" data-anchor="bottom-right">&#8600;</button>
          </div>
        </div>
      </div>

      <!-- Pixel Scale Mode -->
      <div class="pf-resize-mode-panel" id="mode-pixel">
        <label class="block text-xs font-semibold text-muted uppercase mb-1">Resample Scale</label>
        <div class="grid grid-cols-4 gap-1 mb-2">
          <button class="btn btn-xs btn-secondary btn-resample-scale" data-scale="0.5">0.5×</button>
          <button class="btn btn-xs btn-secondary active btn-resample-scale" data-scale="2">2×</button>
          <button class="btn btn-xs btn-secondary btn-resample-scale" data-scale="3">3×</button>
          <button class="btn btn-xs btn-secondary btn-resample-scale" data-scale="4">4×</button>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-3 pt-2 border-t">
        <button class="btn btn-secondary" id="btn-cancel-resize">Cancel</button>
        <button class="btn btn-primary" id="btn-apply-resize">Apply Resize</button>
      </div>
    </div>
  `;

  const { backdrop, close } = createModal({ title: 'Canvas Size & Rescaling', width: '420px', contentHTML });

  let mode = 'canvas';
  let anchor = 'center';
  let pixelScale = 2;

  backdrop.querySelectorAll('.pf-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      backdrop.querySelectorAll('.pf-tab-btn').forEach(b => b.classList.remove('active'));
      backdrop.querySelectorAll('.pf-resize-mode-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      mode = btn.dataset.mode;
      backdrop.querySelector('#mode-' + mode).classList.add('active');
    });
  });

  backdrop.querySelectorAll('.btn-anchor').forEach(btn => {
    btn.addEventListener('click', () => {
      backdrop.querySelectorAll('.btn-anchor').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      anchor = btn.dataset.anchor;
    });
  });

  backdrop.querySelectorAll('.btn-resample-scale').forEach(btn => {
    btn.addEventListener('click', () => {
      backdrop.querySelectorAll('.btn-resample-scale').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      pixelScale = parseFloat(btn.dataset.scale);
    });
  });

  backdrop.querySelector('#btn-cancel-resize').addEventListener('click', close);
  backdrop.querySelector('#btn-apply-resize').addEventListener('click', () => {
    const w = parseInt(backdrop.querySelector('#resize-w').value, 10);
    const h = parseInt(backdrop.querySelector('#resize-h').value, 10);
    close();
    if (onApply) onApply({ mode, width: w, height: h, anchor, pixelScale });
  });
}

// --- 5. Color Adjustments & Filters Modal ---
function showFiltersModal(app, onApply) {
  const contentHTML = `
    <div class="flex flex-col gap-3">
      <div>
        <label class="block text-xs font-semibold text-muted uppercase mb-1">Target Scope</label>
        <select id="filter-scope" class="form-control">
          <option value="active-layer" selected>Active Layer Only</option>
          <option value="all-layers">All Layers in Active Frame</option>
          <option value="all-frames">All Frames & Layers (Project)</option>
        </select>
      </div>

      <!-- Brightness / Contrast -->
      <div class="border-t pt-2">
        <label class="block text-xs font-semibold text-muted uppercase mb-1">Brightness: <span id="val-bright" class="font-mono text-primary">0</span></label>
        <input type="range" id="filter-bright" min="-100" max="100" value="0" class="form-control form-control-sm p-0 w-full" />
      </div>

      <div>
        <label class="block text-xs font-semibold text-muted uppercase mb-1">Contrast: <span id="val-contrast" class="font-mono text-primary">0</span></label>
        <input type="range" id="filter-contrast" min="-100" max="100" value="0" class="form-control form-control-sm p-0 w-full" />
      </div>

      <!-- Quick Actions -->
      <div class="border-t pt-2">
        <label class="block text-xs font-semibold text-muted uppercase mb-1">Instant Effects</label>
        <div class="grid grid-cols-2 gap-2">
          <button class="btn btn-secondary btn-quick-filter" data-effect="invert">Invert Colors</button>
          <button class="btn btn-secondary btn-quick-filter" data-effect="grayscale">Grayscale</button>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-3 pt-2 border-t">
        <button class="btn btn-secondary" id="btn-cancel-filters">Cancel</button>
        <button class="btn btn-primary" id="btn-apply-filters">Apply Adjustments</button>
      </div>
    </div>
  `;

  const { backdrop, close } = createModal({ title: 'Color Adjustments & Filters', width: '400px', contentHTML });

  const bSlider = backdrop.querySelector('#filter-bright');
  const cSlider = backdrop.querySelector('#filter-contrast');
  const bVal = backdrop.querySelector('#val-bright');
  const cVal = backdrop.querySelector('#val-contrast');

  bSlider.addEventListener('input', (e) => bVal.textContent = e.target.value);
  cSlider.addEventListener('input', (e) => cVal.textContent = e.target.value);

  backdrop.querySelectorAll('.btn-quick-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      const effect = btn.dataset.effect;
      const scope = backdrop.querySelector('#filter-scope').value;
      close();
      if (onApply) onApply({ effect, scope });
    });
  });

  backdrop.querySelector('#btn-cancel-filters').addEventListener('click', close);
  backdrop.querySelector('#btn-apply-filters').addEventListener('click', () => {
    const brightness = parseInt(bSlider.value, 10);
    const contrast = parseInt(cSlider.value, 10);
    const scope = backdrop.querySelector('#filter-scope').value;
    close();
    if (onApply) onApply({ brightness, contrast, scope });
  });
}

// --- 6. Tilemap Studio Modal ---
function showTilemapModal(app) {
  const tilemap = app.tilemap;
  tilemap.sliceTilesFromProject(16);

  const contentHTML = `
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-xs text-muted">Tile Size:</span>
          <select id="tilemap-tile-size" class="form-control form-control-sm w-20">
            <option value="8">8×8</option>
            <option value="16" selected>16×16</option>
            <option value="24">24×24</option>
            <option value="32">32×32</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn btn-xs btn-secondary" id="btn-tilemap-clear">Clear Map</button>
          <button class="btn btn-xs btn-secondary" id="btn-tilemap-fill">Fill Map</button>
          <button class="btn btn-xs btn-primary" id="btn-tilemap-export-png">${getIcon('download', 'icon-xs')} PNG</button>
          <button class="btn btn-xs btn-secondary" id="btn-tilemap-export-json">Save JSON</button>
        </div>
      </div>

      <div class="flex gap-3" style="min-height: 320px;">
        <!-- Left: Sliced Tiles Tray -->
        <div class="w-36 flex flex-col border-r pr-2">
          <span class="text-xs font-semibold text-muted uppercase mb-1">Tiles (${tilemap.tiles.length})</span>
          <div class="flex flex-wrap gap-1 overflow-y-auto flex-1 p-1" id="tilemap-tiles-tray">
            ${tilemap.tiles.map((tile, idx) => `
              <div class="tile-palette-card ${idx === tilemap.selectedTileIndex ? 'selected' : ''}" data-idx="${idx}" title="Tile #${idx + 1}">
                <canvas class="tile-preview-canvas" width="32" height="32" data-idx="${idx}"></canvas>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right: Interactive Tilemap Canvas Grid -->
        <div class="flex-1 flex flex-col items-center justify-center overflow-auto bg-canvas p-2 rounded">
          <canvas id="tilemap-grid-canvas" class="border" style="cursor: crosshair; image-rendering: pixelated;"></canvas>
        </div>
      </div>
    </div>
  `;

  const { backdrop, close } = createModal({ title: 'Tilemap Studio (World Builder)', width: '740px', contentHTML });

  const gridCanvas = backdrop.querySelector('#tilemap-grid-canvas');
  const tray = backdrop.querySelector('#tilemap-tiles-tray');

  // Render tile previews in tray
  backdrop.querySelectorAll('.tile-preview-canvas').forEach(c => {
    const idx = parseInt(c.dataset.idx, 10);
    const tile = tilemap.tiles[idx];
    if (tile) {
      const tc = tilemap.renderTileToCanvas(tile, 32 / tilemap.tileSize);
      c.getContext('2d').drawImage(tc, 0, 0);
    }
  });

  const renderGrid = () => {
    const scale = 2;
    const cw = tilemap.mapCols * tilemap.tileSize * scale;
    const ch = tilemap.mapRows * tilemap.tileSize * scale;
    gridCanvas.width = cw;
    gridCanvas.height = ch;

    const ctx = gridCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Render tilemap
    const mapCanvas = tilemap.renderTilemapToCanvas(scale);
    ctx.drawImage(mapCanvas, 0, 0);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let c = 0; c <= tilemap.mapCols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * tilemap.tileSize * scale, 0);
      ctx.lineTo(c * tilemap.tileSize * scale, ch);
      ctx.stroke();
    }
    for (let r = 0; r <= tilemap.mapRows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * tilemap.tileSize * scale);
      ctx.lineTo(cw, r * tilemap.tileSize * scale);
      ctx.stroke();
    }
  };

  renderGrid();

  // Tray selection
  tray.querySelectorAll('.tile-palette-card').forEach(card => {
    card.addEventListener('click', () => {
      tray.querySelectorAll('.tile-palette-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      tilemap.selectedTileIndex = parseInt(card.dataset.idx, 10);
    });
  });

  // Painting on grid canvas
  let isPainting = false;
  const paintTile = (e) => {
    const rect = gridCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / (tilemap.tileSize * 2));
    const row = Math.floor(y / (tilemap.tileSize * 2));

    if (e.buttons === 2) {
      tilemap.setTileAt(col, row, -1); // Erase
    } else {
      tilemap.setTileAt(col, row, tilemap.selectedTileIndex);
    }
    renderGrid();
  };

  gridCanvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    paintTile(e);
  });
  gridCanvas.addEventListener('mousemove', (e) => {
    if (isPainting) paintTile(e);
  });
  window.addEventListener('mouseup', () => isPainting = false);
  gridCanvas.addEventListener('contextmenu', (e) => e.preventDefault());

  // Size change
  backdrop.querySelector('#tilemap-tile-size').addEventListener('change', (e) => {
    tilemap.sliceTilesFromProject(parseInt(e.target.value, 10));
    showTilemapModal(app);
  });

  backdrop.querySelector('#btn-tilemap-clear').addEventListener('click', () => {
    tilemap.clearMap();
    renderGrid();
  });

  backdrop.querySelector('#btn-tilemap-fill').addEventListener('click', () => {
    tilemap.fillMap(tilemap.selectedTileIndex);
    renderGrid();
  });

  backdrop.querySelector('#btn-tilemap-export-png').addEventListener('click', () => {
    const canvas = tilemap.renderTilemapToCanvas(4);
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'tilemap_world.png';
    a.click();
  });

  backdrop.querySelector('#btn-tilemap-export-json').addEventListener('click', () => {
    const json = tilemap.exportTilemapJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'tilemap_matrix.json';
    a.click();
  });
}

// --- 7. Keyboard Shortcuts Cheat Sheet Modal ---
function showShortcutsModal() {
  const shortcuts = [
    { cat: 'Tools', keys: [
      { key: 'B', desc: 'Pencil Tool (Pixel-Perfect)' },
      { key: 'E', desc: 'Eraser Tool' },
      { key: 'L', desc: 'Line Tool' },
      { key: 'U', desc: 'Rectangle Outline' },
      { key: 'C', desc: 'Circle Outline' },
      { key: 'G', desc: 'Paint Bucket Fill' },
      { key: 'I', desc: 'Eyedropper / Color Picker' },
      { key: 'D', desc: 'Bayer Dithering Brush' },
      { key: 'S', desc: 'Marquee Selection' },
      { key: 'M', desc: 'Pan / Hand Tool' },
      { key: 'R', desc: 'Color Replace Tool' }
    ]},
    { cat: 'Colors & Canvas', keys: [
      { key: 'X', desc: 'Swap Primary & Secondary Color' },
      { key: 'Alt + Click', desc: 'Quick Eyedropper in any tool' },
      { key: 'Space + Drag', desc: 'Smooth Pan Viewport' },
      { key: 'Mouse Wheel', desc: 'Zoom In / Out at Cursor' },
      { key: '[ / ]', desc: 'Decrease / Increase Brush Size' }
    ]},
    { cat: 'Animation & History', keys: [
      { key: 'Space', desc: 'Play / Pause Animation' },
      { key: 'Ctrl + Z', desc: 'Undo' },
      { key: 'Ctrl + Y', desc: 'Redo (or Ctrl+Shift+Z)' },
      { key: 'Ctrl + C', desc: 'Copy Marquee Selection' },
      { key: 'Ctrl + V', desc: 'Paste Selection Stamp' },
      { key: 'Delete / Backspace', desc: 'Clear Selection Pixels' },
      { key: 'Esc', desc: 'Deselect / Clear Marquee' }
    ]}
  ];

  const contentHTML = `
    <div class="flex flex-col gap-4 max-h-96 overflow-y-auto pr-1">
      ${shortcuts.map(s => `
        <div>
          <h4 class="text-xs font-bold uppercase text-primary mb-2">${escapeHTML(s.cat)}</h4>
          <div class="grid grid-cols-2 gap-2">
            ${s.keys.map(k => `
              <div class="flex items-center justify-between p-1 bg-elevated rounded border">
                <span class="text-xs text-secondary">${escapeHTML(k.desc)}</span>
                <kbd class="pf-kbd">${escapeHTML(k.key)}</kbd>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  createModal({ title: 'Keyboard Shortcuts Reference', width: '560px', contentHTML });
}

// --- 8. Palette Manager Modal ---
function showPaletteManagerModal(app) {
  const contentHTML = `
    <div class="flex flex-col gap-3">
      <div class="flex gap-2">
        <textarea id="palette-hex-input" class="form-control font-mono text-xs flex-1" rows="8" placeholder="#000000\n#ffffff\n#58a6ff\n#e11d48..."></textarea>
      </div>

      <div class="flex justify-between items-center border-t pt-2">
        <button class="btn btn-xs btn-secondary" id="btn-load-cur-pal">Load Current Palette</button>
        <div class="flex gap-2">
          <button class="btn btn-secondary" id="btn-export-hex-file">${getIcon('download', 'icon-xs')} Export .hex</button>
          <button class="btn btn-primary" id="btn-import-hex-list">Apply Palette</button>
        </div>
      </div>
    </div>
  `;

  const { backdrop, close } = createModal({ title: 'Palette Manager & HEX Importer', width: '420px', contentHTML });

  const txt = backdrop.querySelector('#palette-hex-input');

  backdrop.querySelector('#btn-load-cur-pal').addEventListener('click', () => {
    const curColors = app.getCurrentPaletteColors();
    txt.value = curColors.join('\n');
  });

  backdrop.querySelector('#btn-export-hex-file').addEventListener('click', () => {
    const colors = parseHexPalette(txt.value);
    if (colors.length === 0) {
      showToast('No valid hex colors found.', 'warning');
      return;
    }
    const blob = new Blob([exportHexPalette(colors)], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'palette.hex';
    a.click();
  });

  backdrop.querySelector('#btn-import-hex-list').addEventListener('click', () => {
    const colors = parseHexPalette(txt.value);
    if (colors.length === 0) {
      showToast('No valid hex colors found.', 'warning');
      return;
    }
    app.setCustomPalette(colors);
    close();
    showToast(`Loaded ${colors.length} palette colors!`, 'success');
  });
}


/* --- MODULE: js/editor/layer-manager.js --- */
/**
 * PixelForge - Layer Manager Component
 * Multi-layer stack controller with opacity sliders, blend modes, lock, visibility,
 * layer renaming, reordering, duplicate, and merge down.
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
  onBlendModeChange = null,
  onRenameLayer = null,
  onMoveLayer = null,
  onMergeDown = null,
  onFlatten = null
}) {
  if (!container) return;

  container.innerHTML = `
    <div class="panel-section-header flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-2">
        ${getIcon('layers', 'icon-sm')}
        <span class="text-xs font-bold uppercase text-muted">Layers (${layers.length})</span>
      </div>
      <div class="flex items-center gap-1">
        ${layers.length > 1 ? `
          <button class="btn btn-xs btn-secondary" id="btn-flatten-layers" title="Flatten All Visible Layers">
            ${getIcon('flatten', 'icon-xs')} Flatten
          </button>
        ` : ''}
        <button class="btn btn-xs btn-primary" id="btn-add-layer" title="Create New Layer">
          ${getIcon('plus', 'icon-xs')} New Layer
        </button>
      </div>
    </div>

    <!-- Scrollable Layers Stack (Top layer first in visual stack) -->
    <div class="layers-list-scroll p-2 flex flex-col gap-1 flex-1 overflow-y-auto">
      ${[...layers].reverse().map((layer, reverseIdx) => {
        const actualIdx = layers.length - 1 - reverseIdx;
        const isActive = layer.id === activeLayerId;

        return `
          <div class="layer-item-row card p-2 flex flex-col gap-2 ${isActive ? 'active' : ''}" data-id="${layer.id}" data-idx="${actualIdx}">
            <div class="flex items-center justify-between">
              <!-- Select / Rename Target -->
              <div class="flex items-center gap-2 flex-1 cursor-pointer layer-select-target truncate" title="Click to select, double-click to rename">
                <span class="layer-name font-semibold text-xs truncate" data-id="${layer.id}">${escapeHTML(layer.name)}</span>
              </div>

              <!-- Quick Action Icons -->
              <div class="layer-actions flex items-center gap-1">
                <button class="btn-icon-xs btn-move-layer-up" data-idx="${actualIdx}" title="Move Up in Stack" ${actualIdx === layers.length - 1 ? 'disabled' : ''}>&uarr;</button>
                <button class="btn-icon-xs btn-move-layer-down" data-idx="${actualIdx}" title="Move Down in Stack" ${actualIdx === 0 ? 'disabled' : ''}>&darr;</button>
                <button class="btn-icon-xs btn-layer-vis" data-id="${layer.id}" title="Toggle Visibility">
                  ${getIcon(layer.visible !== false ? 'eye' : 'eyeOff', 'icon-xs')}
                </button>
                <button class="btn-icon-xs btn-layer-lock" data-id="${layer.id}" title="Toggle Lock (Prevent Edits)">
                  ${getIcon(layer.locked ? 'lock' : 'unlock', 'icon-xs')}
                </button>
                <button class="btn-icon-xs btn-layer-dupe" data-id="${layer.id}" title="Duplicate Layer">
                  ${getIcon('copy', 'icon-xs')}
                </button>
                ${actualIdx > 0 ? `
                  <button class="btn-icon-xs btn-layer-merge" data-id="${layer.id}" data-idx="${actualIdx}" title="Merge Down with Lower Layer">
                    ${getIcon('merge', 'icon-xs')}
                  </button>
                ` : ''}
                ${layers.length > 1 ? `
                  <button class="btn-icon-xs text-rose btn-layer-del" data-id="${layer.id}" title="Delete Layer">
                    ${getIcon('trash', 'icon-xs')}
                  </button>
                ` : ''}
              </div>
            </div>

            <!-- Layer Controls: Blend Mode & Opacity -->
            <div class="flex items-center gap-2">
              <select class="form-control form-control-sm layer-blend-select w-20 text-xs p-0" data-id="${layer.id}" title="Layer Blend Mode">
                <option value="normal" ${(!layer.blendMode || layer.blendMode === 'normal') ? 'selected' : ''}>Normal</option>
                <option value="multiply" ${layer.blendMode === 'multiply' ? 'selected' : ''}>Multiply</option>
                <option value="screen" ${layer.blendMode === 'screen' ? 'selected' : ''}>Screen</option>
                <option value="overlay" ${layer.blendMode === 'overlay' ? 'selected' : ''}>Overlay</option>
                <option value="darken" ${layer.blendMode === 'darken' ? 'selected' : ''}>Darken</option>
                <option value="lighten" ${layer.blendMode === 'lighten' ? 'selected' : ''}>Lighten</option>
              </select>

              <input type="range" min="0" max="1" step="0.05" class="form-control form-control-sm p-0 layer-opacity-slider flex-1" data-id="${layer.id}" value="${layer.opacity !== undefined ? layer.opacity : 1}" title="Layer Opacity" />
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

  container.querySelector('#btn-flatten-layers')?.addEventListener('click', () => {
    if (onFlatten) onFlatten();
  });

  container.querySelectorAll('.layer-select-target').forEach(el => {
    el.addEventListener('click', () => {
      const row = el.closest('.layer-item-row');
      if (onSelectLayer) onSelectLayer(row.dataset.id);
    });

    el.addEventListener('dblclick', () => {
      const nameSpan = el.querySelector('.layer-name');
      const curName = nameSpan.textContent;
      const newName = prompt('Enter new layer name:', curName);
      if (newName && newName.trim() && onRenameLayer) {
        onRenameLayer(nameSpan.dataset.id, newName.trim());
      }
    });
  });

  container.querySelectorAll('.btn-layer-vis').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onToggleVisibility) onToggleVisibility(btn.dataset.id);
    });
  });

  container.querySelectorAll('.btn-layer-lock').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onToggleLock) onToggleLock(btn.dataset.id);
    });
  });

  container.querySelectorAll('.btn-layer-dupe').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onDuplicateLayer) onDuplicateLayer(btn.dataset.id);
    });
  });

  container.querySelectorAll('.btn-layer-merge').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx, 10);
      if (onMergeDown) onMergeDown(idx);
    });
  });

  container.querySelectorAll('.btn-layer-del').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onDeleteLayer) onDeleteLayer(btn.dataset.id);
    });
  });

  container.querySelectorAll('.btn-move-layer-up').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx, 10);
      if (onMoveLayer) onMoveLayer(idx, 1);
    });
  });

  container.querySelectorAll('.btn-move-layer-down').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx, 10);
      if (onMoveLayer) onMoveLayer(idx, -1);
    });
  });

  container.querySelectorAll('.layer-blend-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      if (onBlendModeChange) onBlendModeChange(sel.dataset.id, e.target.value);
    });
  });

  container.querySelectorAll('.layer-opacity-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      const row = slider.closest('.layer-item-row');
      const label = row?.querySelector('.opacity-label');
      if (label) label.textContent = Math.round(val * 100) + '%';
      if (onOpacityChange) onOpacityChange(slider.dataset.id, val);
    });
  });
}


/* --- MODULE: js/editor/color-picker.js --- */
/**
 * PixelForge - Color Picker & Palette Manager Component
 * Primary/Secondary color swatches, Hex/RGB/HSV readouts, curated retro palettes,
 * add color to palette, palette manager trigger, and recent color history.
 */





function renderColorPanel(container, {
  primaryColor = '#58a6ff',
  secondaryColor = '#000000',
  currentPaletteId = 'pico8',
  customPalette = [],
  recentColors = [],
  ditherThreshold = 8,
  onColorChange = null,
  onPaletteChange = null,
  onAddColorToPalette = null,
  onOpenPaletteManager = null,
  onDitherThresholdChange = null
}) {
  if (!container) return;

  const currentPalette = PALETTES[currentPaletteId] || { name: 'Custom Palette', colors: customPalette };
  const primaryRgb = hexToRgb(primaryColor);
  const primaryHsv = rgbToHsv(primaryRgb.r, primaryRgb.g, primaryRgb.b);

  container.innerHTML = `
    <!-- Top Primary & Secondary Swatches -->
    <div class="color-swatches-master flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-3">
        <!-- Dual Color Box -->
        <div class="dual-color-container relative w-12 h-10" title="Primary (Left Click) / Secondary (Right Click)">
          <div class="color-box secondary-swatch absolute" style="background-color: ${secondaryColor};" title="Secondary Color (Right Click)"></div>
          <div class="color-box primary-swatch absolute" style="background-color: ${primaryColor};" title="Primary Color (Left Click)"></div>
        </div>

        <div class="flex flex-col">
          <span class="font-mono text-xs font-bold uppercase text-primary" id="primary-hex-label">${primaryColor}</span>
          <span class="text-xs text-muted font-mono" style="font-size: 10px;">RGB(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})</span>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <button class="btn-icon-xs text-muted" id="btn-swap-colors" title="Swap Colors (X)">
          ${getIcon('swap', 'icon-xs')}
        </button>
        <button class="btn-icon-xs text-muted" id="btn-add-swatch" title="Add Current Color to Palette">
          ${getIcon('plus', 'icon-xs')}
        </button>
      </div>
    </div>

    <!-- Color Inputs & Native Pickers -->
    <div class="p-3 border-b flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <input type="color" id="native-color-picker" class="p-0 w-8 h-7 cursor-pointer border-none rounded" value="${primaryColor}" title="Open Native Color Picker" />
        <input type="text" id="input-hex-val" class="form-control form-control-sm font-mono flex-1 text-center" value="${primaryColor}" placeholder="#RRGGBB" maxlength="7" />
      </div>

      <!-- Dither Threshold Slider -->
      <div class="flex items-center gap-2 pt-1">
        <span class="text-xs text-muted font-mono" style="font-size: 10px;">Dither:</span>
        <select id="select-dither-threshold" class="form-control form-control-sm flex-1 text-xs">
          <option value="4" ${ditherThreshold === 4 ? 'selected' : ''}>25% Density</option>
          <option value="8" ${ditherThreshold === 8 ? 'selected' : ''}>50% Density (Checker)</option>
          <option value="12" ${ditherThreshold === 12 ? 'selected' : ''}>75% Density</option>
        </select>
      </div>
    </div>

    <!-- Palette Selection & Swatches -->
    <div class="p-3 flex-1 overflow-y-auto flex flex-col gap-3">
      <div class="flex items-center justify-between gap-1">
        <select id="select-palette-preset" class="form-control form-control-sm flex-1 font-semibold">
          ${Object.values(PALETTES).map(p => `
            <option value="${p.id}" ${currentPaletteId === p.id ? 'selected' : ''}>${escapeHTML(p.name)}</option>
          `).join('')}
        </select>
        <button class="btn-icon-xs" id="btn-open-palette-mgr" title="Import / Export Palettes">
          ${getIcon('palette', 'icon-xs')}
        </button>
      </div>

      <!-- Swatches Grid -->
      <div class="palette-swatches-grid" id="palette-swatches-grid">
        ${currentPalette.colors.map(col => `
          <div class="swatch-tile ${col.toLowerCase() === primaryColor.toLowerCase() ? 'selected' : ''}" style="background-color: ${col};" data-color="${col}" title="${col} (Left: Primary, Right: Secondary)"></div>
        `).join('')}
      </div>

      <!-- Recent Colors History -->
      ${recentColors.length > 0 ? `
        <div class="border-t pt-2 mt-2">
          <span class="text-xs font-bold uppercase text-muted block mb-1">Recent Colors</span>
          <div class="flex flex-wrap gap-1">
            ${recentColors.slice(0, 16).map(c => `
              <div class="swatch-tile-mini ${c.toLowerCase() === primaryColor.toLowerCase() ? 'selected' : ''}" style="background-color: ${c};" data-color="${c}" title="${c}"></div>
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

  // Add Color to Palette
  container.querySelector('#btn-add-swatch')?.addEventListener('click', () => {
    if (onAddColorToPalette) onAddColorToPalette(primaryColor);
  });

  // Open Palette Manager
  container.querySelector('#btn-open-palette-mgr')?.addEventListener('click', () => {
    if (onOpenPaletteManager) onOpenPaletteManager();
  });

  // Change Palette Preset
  container.querySelector('#select-palette-preset')?.addEventListener('change', (e) => {
    if (onPaletteChange) onPaletteChange(e.target.value);
  });

  // Dither Threshold
  container.querySelector('#select-dither-threshold')?.addEventListener('change', (e) => {
    const val = parseInt(e.target.value, 10);
    if (onDitherThresholdChange) onDitherThresholdChange(val);
  });
}


/* --- MODULE: js/editor/timeline.js --- */
/**
 * PixelForge - Animation Timeline Filmstrip Component
 * Frame thumbnail reel, playhead controls, FPS speed, loop/ping-pong modes,
 * frame reordering, duplicate, delete, and onion-skin toggling.
 */



function renderTimeline(container, {
  frames = [],
  activeFrameIndex = 0,
  isPlaying = false,
  fps = 8,
  playMode = 'loop', // 'loop', 'pingpong', 'once'
  showOnionSkin = false,
  projectWidth = 32,
  projectHeight = 32,
  onSelectFrame = null,
  onAddFrame = null,
  onDuplicateFrame = null,
  onDeleteFrame = null,
  onMoveFrame = null,
  onReverseFrames = null,
  onTogglePlay = null,
  onStepNext = null,
  onStepPrev = null,
  onFPSChange = null,
  onPlayModeChange = null,
  onToggleOnion = null
}) {
  if (!container) return;

  container.innerHTML = `
    <!-- Top Playback Toolbar -->
    <div class="timeline-controls-bar flex items-center justify-between px-3 py-1 border-b">
      <!-- Playhead & Navigation -->
      <div class="flex items-center gap-1">
        <button class="btn btn-xs btn-secondary" id="btn-timeline-prev" title="Previous Frame (Left Arrow)">
          ${getIcon('stepPrev', 'icon-xs')}
        </button>

        <button class="btn btn-xs ${isPlaying ? 'btn-primary' : 'btn-secondary'}" id="btn-timeline-play" title="Play / Pause Animation (Space)">
          ${getIcon(isPlaying ? 'pause' : 'play', 'icon-xs')}
          <span>${isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <button class="btn btn-xs btn-secondary" id="btn-timeline-next" title="Next Frame (Right Arrow)">
          ${getIcon('stepNext', 'icon-xs')}
        </button>

        <div class="toolbar-divider"></div>

        <!-- Playback Mode (Loop, Ping-Pong, Once) -->
        <select id="select-play-mode" class="form-control form-control-sm w-24 text-xs" title="Animation Loop Mode">
          <option value="loop" ${playMode === 'loop' ? 'selected' : ''}>Loop</option>
          <option value="pingpong" ${playMode === 'pingpong' ? 'selected' : ''}>Ping-Pong</option>
          <option value="once" ${playMode === 'once' ? 'selected' : ''}>Play Once</option>
        </select>

        <button class="btn btn-xs ${showOnionSkin ? 'btn-primary' : 'btn-secondary'}" id="btn-timeline-onion" title="Toggle Onion Skinning (Past Cyan / Next Red)">
          ${getIcon('onion', 'icon-xs')}
          <span>Onion</span>
        </button>
      </div>

      <!-- FPS Speed Controller -->
      <div class="flex items-center gap-2">
        <span class="text-xs text-muted font-mono font-semibold">FPS:</span>
        <input type="range" min="1" max="60" id="input-timeline-fps" class="form-control form-control-sm p-0 w-20" value="${fps}" title="Frames Per Second (1 - 60)" />
        <span class="text-xs font-mono font-bold text-primary w-6 text-center" id="fps-label">${fps}</span>

        <div class="flex gap-1 ml-1">
          <button class="btn btn-xs btn-secondary btn-fps-preset ${fps === 4 ? 'active' : ''}" data-fps="4">4</button>
          <button class="btn btn-xs btn-secondary btn-fps-preset ${fps === 8 ? 'active' : ''}" data-fps="8">8</button>
          <button class="btn btn-xs btn-secondary btn-fps-preset ${fps === 12 ? 'active' : ''}" data-fps="12">12</button>
          <button class="btn btn-xs btn-secondary btn-fps-preset ${fps === 24 ? 'active' : ''}" data-fps="24">24</button>
        </div>
      </div>

      <!-- Frame Actions -->
      <div class="flex items-center gap-1">
        ${frames.length > 1 ? `
          <button class="btn btn-xs btn-secondary" id="btn-reverse-frames" title="Reverse Animation Frames Order">
            ${getIcon('reverse', 'icon-xs')} Reverse
          </button>
        ` : ''}
        <button class="btn btn-xs btn-primary" id="btn-add-frame" title="Add New Blank Frame">
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
              <div class="frame-card-actions flex items-center gap-0.5">
                <button class="btn-icon-xs btn-move-frame-left" data-idx="${idx}" title="Move Frame Left" ${idx === 0 ? 'disabled' : ''}>&larr;</button>
                <button class="btn-icon-xs btn-move-frame-right" data-idx="${idx}" title="Move Frame Right" ${idx === frames.length - 1 ? 'disabled' : ''}>&rarr;</button>
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
            <div class="frame-thumbnail-wrapper cursor-pointer frame-select-target" title="Select Frame #${idx + 1}">
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

  container.querySelector('#btn-timeline-prev')?.addEventListener('click', () => {
    if (onStepPrev) onStepPrev();
  });

  container.querySelector('#btn-timeline-next')?.addEventListener('click', () => {
    if (onStepNext) onStepNext();
  });

  container.querySelector('#btn-timeline-onion')?.addEventListener('click', () => {
    if (onToggleOnion) onToggleOnion();
  });

  container.querySelector('#select-play-mode')?.addEventListener('change', (e) => {
    if (onPlayModeChange) onPlayModeChange(e.target.value);
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

  container.querySelector('#btn-reverse-frames')?.addEventListener('click', () => {
    if (onReverseFrames) onReverseFrames();
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

  container.querySelectorAll('.btn-move-frame-left').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx, 10);
      if (onMoveFrame) onMoveFrame(idx, -1);
    });
  });

  container.querySelectorAll('.btn-move-frame-right').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx, 10);
      if (onMoveFrame) onMoveFrame(idx, 1);
    });
  });
}

function drawFrameThumbnail(canvas, frame, pw, ph) {
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const cw = canvas.width;
  const ch = canvas.height;

  // Checkerboard pattern
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
    if (layer.visible === false || !layer.pixels) continue;
    ctx.save();
    if (layer.opacity !== undefined) ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity));

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
 * PixelForge - Curated Demonstration Projects
 * Production-quality pixel art projects with animations, multi-layer scenes, and game tilesets.
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

  // 2. Retro Dungeon Tileset (32x32 Sprite for Slicing into 16x16 tiles)
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
          blendMode: 'normal',
          pixels: createDungeonBricksPixels(32, 32)
        },
        {
          id: 'layer_props',
          name: 'Chest & Torches',
          visible: true,
          locked: false,
          opacity: 1,
          blendMode: 'normal',
          pixels: createDungeonPropsPixels(32, 32)
        }
      ])
    ]
  },

  // 3. Pixel City Skyline (Multi-layer 32x32 Cyberpunk Scene)
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
          blendMode: 'normal',
          pixels: createCitySkyPixels(32, 32)
        },
        {
          id: 'layer_buildings',
          name: 'Neon Skyscrapers',
          visible: true,
          locked: false,
          opacity: 1,
          blendMode: 'normal',
          pixels: createCityBuildingsPixels(32, 32)
        }
      ])
    ]
  },

  // 4. RPG Relics & Potions (24x24 Item Sprite)
  potions: {
    id: 'proj_rpg_potions',
    name: 'RPG Relics & Potions',
    width: 24,
    height: 24,
    fps: 8,
    frames: [
      createFrame([
        {
          id: 'layer_potions',
          name: 'Health & Mana Potions',
          visible: true,
          locked: false,
          opacity: 1,
          blendMode: 'normal',
          pixels: createPotionsPixels(24, 24)
        }
      ])
    ]
  },

  // 5. Retro 8-bit Hero (4-Frame Walk, 16x16)
  hero8bit: {
    id: 'proj_8bit_hero',
    name: '8-Bit Hero Walk',
    width: 16,
    height: 16,
    fps: 8,
    frames: [
      createFrame([create8BitHeroLayer(0)]),
      createFrame([create8BitHeroLayer(1)]),
      createFrame([create8BitHeroLayer(2)]),
      createFrame([create8BitHeroLayer(3)])
    ]
  }
};

function createFrame(layers) {
  return {
    id: 'frame_' + Math.random().toString(36).substr(2, 8),
    layers
  };
}

// 1. Procedural Cyber Knight
function createKnightLayer(frameIdx) {
  const w = 24, h = 24;
  const pixels = new Array(w * h).fill('transparent');

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
    blendMode: 'normal',
    pixels
  };
}

// 2. Dungeon Tiles
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

  // Torch (Bottom Right 16x16)
  for (let y = 22; y <= 28; y++) {
    pixels[y * w + 24] = '#78350f';
  }
  // Flame
  pixels[19 * w + 24] = '#f59e0b';
  pixels[20 * w + 23] = '#ef4444';
  pixels[20 * w + 24] = '#fbbf24';
  pixels[20 * w + 25] = '#ef4444';
  pixels[21 * w + 24] = '#f59e0b';

  return pixels;
}

// 3. Cyber City
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
      if (y % 3 === 0 && x % 2 === 0) pixels[y * w + x] = '#ff007f';
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

// 4. Potions & Relics
function createPotionsPixels(w, h) {
  const pixels = new Array(w * h).fill('transparent');

  // Health Potion (Left)
  for (let y = 8; y <= 18; y++) {
    for (let x = 4; x <= 10; x++) {
      if (y >= 10 && y <= 17) pixels[y * w + x] = '#e11d48'; // Red liquid
      if (x === 4 || x === 10 || y === 18) pixels[y * w + x] = '#cbd5e1'; // Glass
    }
  }
  // Cork
  pixels[6 * w + 6] = '#92400e';
  pixels[6 * w + 7] = '#92400e';
  pixels[7 * w + 7] = '#92400e';

  // Mana Potion (Right)
  for (let y = 8; y <= 18; y++) {
    for (let x = 14; x <= 20; x++) {
      if (y >= 10 && y <= 17) pixels[y * w + x] = '#2563eb'; // Blue liquid
      if (x === 14 || x === 20 || y === 18) pixels[y * w + x] = '#cbd5e1'; // Glass
    }
  }
  // Cork
  pixels[6 * w + 16] = '#92400e';
  pixels[6 * w + 17] = '#92400e';

  return pixels;
}

// 5. 8-Bit Hero
function create8BitHeroLayer(frameIdx) {
  const w = 16, h = 16;
  const pixels = new Array(w * h).fill('transparent');
  const leg = (frameIdx % 2 === 0) ? 1 : -1;

  // Red Cap
  for (let x = 5; x <= 11; x++) pixels[2 * w + x] = '#ef4444';
  for (let x = 5; x <= 13; x++) pixels[3 * w + x] = '#ef4444';

  // Face / Skin
  for (let x = 5; x <= 10; x++) {
    pixels[4 * w + x] = '#fed7aa';
    pixels[5 * w + x] = '#fed7aa';
  }
  pixels[4 * w + 9] = '#1e293b'; // Eye
  pixels[5 * w + 8] = '#92400e'; // Mustache
  pixels[5 * w + 9] = '#92400e';

  // Shirt (Red)
  for (let y = 6; y <= 9; y++) {
    for (let x = 5; x <= 11; x++) {
      pixels[y * w + x] = '#ef4444';
    }
  }

  // Overalls (Blue)
  for (let y = 8; y <= 11; y++) {
    for (let x = 6; x <= 10; x++) {
      pixels[y * w + x] = '#2563eb';
    }
  }

  // Legs & Boots
  pixels[12 * w + (7 + leg)] = '#2563eb';
  pixels[13 * w + (7 + leg)] = '#78350f';
  pixels[12 * w + (9 - leg)] = '#2563eb';
  pixels[13 * w + (9 - leg)] = '#78350f';

  return {
    id: 'layer_hero',
    name: '8-Bit Hero',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'normal',
    pixels
  };
}


/* --- MODULE: js/app.js --- */
/**
 * PixelForge - Master Pixel Art Workstation Orchestrator
 * Integrates Canvas Renderer, Drawing Algorithms, Animation Engine, Layer Manager,
 * Color Picker, Tilemap Studio, Modals, History, and Touch / Pointer interactions.
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
    this.activeTool = 'pencil'; // pencil, eraser, line, rect, rectFill, circle, circleFill, bucket, picker, dither, select, move, colorReplace
    this.primaryColor = '#58a6ff';
    this.secondaryColor = '#000000';
    this.brushSize = 1;
    this.pixelPerfect = true;
    this.symmetryMode = 'none'; // none, horizontal, vertical, both
    this.showGrid = true;
    this.showOnionSkin = false;
    this.currentPaletteId = 'pico8';
    this.customPalette = [];
    this.ditherThreshold = 8;

    // Pointer Interaction State
    this.isDrawing = false;
    this.isPanning = false;
    this.isMovingSelection = false;
    this.panStart = { x: 0, y: 0 };
    this.drawStart = { x: 0, y: 0 };
    this.strokePoints = [];
    this.activePreviewPixels = [];
    this.selection = null;
    this.floatingSelection = null; // { x, y, width, height, pixels }
    this.clipboardData = null; // Copied pixel matrix
    this.cursorPos = { x: 0, y: 0 };

    // Multi-touch tracking
    this.activePointers = new Map();
    this.initialPinchDist = 0;
    this.initialPinchZoom = 16;

    // Recent colors history
    this.recentColors = ['#58a6ff', '#000000', '#ffffff', '#e11d48', '#00e5ff', '#334155', '#3fb950', '#d29922'];

    // History stack
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 35;
  }

  async init() {
    await db.init();

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // Load saved project if exists in database
    try {
      const lastId = localStorage.getItem('pixelforge_last_project_id');
      if (lastId) {
        const saved = await db.loadProject(lastId);
        if (saved && saved.frames && saved.frames.length > 0) {
          this.project = saved;
          this.activeFrameIndex = 0;
          this.activeLayerId = this.project.frames[0].layers[0]?.id || 'default';
        }
      }
    } catch (e) {}

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
      onionSkinOpacity: 0.3,
      symmetryMode: this.symmetryMode,
      activePreviewPixels: this.activePreviewPixels,
      selection: this.selection,
      floatingSelection: this.floatingSelection,
      cursorPos: this.cursorPos,
      brushSize: this.brushSize,
      backgroundColor: this.project.background || 'transparent'
    });
  }

  renderAll() {
    this.renderColorPickerPanel();
    this.renderLayerStack();
    this.renderAnimationTimeline();
    this.updateStats();
    this.updateProjectTitleUI();
    this.requestRender();
  }

  // --- Toolbar Setup ---
  setupToolbar() {
    // Tool buttons in left palette
    document.querySelectorAll('.btn-pixel-tool').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setTool(btn.dataset.tool);
      });
    });

    // Brush Size
    const brushSelect = document.getElementById('select-brush-size');
    brushSelect?.addEventListener('change', (e) => {
      this.brushSize = parseInt(e.target.value, 10) || 1;
      this.requestRender();
    });

    // Pixel-Perfect Toggle
    const ppBtn = document.getElementById('btn-toggle-pixel-perfect');
    ppBtn?.addEventListener('click', () => {
      this.pixelPerfect = !this.pixelPerfect;
      ppBtn.classList.toggle('active', this.pixelPerfect);
      showToast(this.pixelPerfect ? 'Pixel-Perfect Enabled' : 'Pixel-Perfect Disabled', 'info');
    });

    // Symmetry Mode Selector
    const symSelect = document.getElementById('select-symmetry-mode');
    symSelect?.addEventListener('change', (e) => {
      this.symmetryMode = e.target.value;
      this.requestRender();
    });

    // Project Template Switcher
    const templateSelect = document.getElementById('select-project-template');
    templateSelect?.addEventListener('change', (e) => {
      const tKey = e.target.value;
      if (TEMPLATES[tKey]) {
        showConfirmModal({
          title: 'Load Project Template',
          message: `Load template "${TEMPLATES[tKey].name}"? Unsaved changes in your current project will be replaced.`,
          confirmText: 'Load Template',
          onConfirm: () => {
            this.loadProject(JSON.parse(JSON.stringify(TEMPLATES[tKey])));
            showToast(`Loaded ${TEMPLATES[tKey].name}`, 'success');
          }
        });
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
      this.renderer.camera.zoom = Math.min(64, Math.round(this.renderer.camera.zoom * 1.25));
      this.requestRender();
      this.updateZoomLabel();
    });
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
      this.renderer.camera.zoom = Math.max(1, Math.round(this.renderer.camera.zoom * 0.8));
      this.requestRender();
      this.updateZoomLabel();
    });

    const zoomLabel = document.getElementById('zoom-percentage-label');
    zoomLabel?.addEventListener('click', () => {
      this.renderer.camera.zoom = 16;
      this.centerCanvas();
    });

    document.getElementById('btn-fit-canvas')?.addEventListener('click', () => this.centerCanvas());

    // Modals Triggers
    document.getElementById('btn-new-project')?.addEventListener('click', () => {
      showNewProjectModal((opts) => this.createNewProject(opts));
    });

    document.getElementById('btn-open-export-modal')?.addEventListener('click', () => {
      showExportModal(this);
    });

    document.getElementById('btn-open-resize-modal')?.addEventListener('click', () => {
      showResizeModal(this, (res) => this.applyCanvasResize(res));
    });

    document.getElementById('btn-open-filters-modal')?.addEventListener('click', () => {
      showFiltersModal(this, (f) => this.applyColorAdjustments(f));
    });

    document.getElementById('btn-open-tilemap')?.addEventListener('click', () => {
      showTilemapModal(this);
    });

    document.getElementById('btn-open-shortcuts')?.addEventListener('click', () => {
      showShortcutsModal();
    });

    // Quick Transformations
    document.getElementById('btn-flip-h')?.addEventListener('click', () => this.flipHorizontal());
    document.getElementById('btn-flip-v')?.addEventListener('click', () => this.flipVertical());
    document.getElementById('btn-rotate-90')?.addEventListener('click', () => this.rotate90());

    // Direct Export PNG button
    document.getElementById('btn-export-png')?.addEventListener('click', () => {
      showExportModal(this);
    });

    // Direct Export Sheet button
    document.getElementById('btn-export-sheet')?.addEventListener('click', () => {
      showExportModal(this);
    });

    // Direct Export SVG button
    document.getElementById('btn-export-svg')?.addEventListener('click', () => {
      this.exportAnimatedSVG(10);
    });

    // Direct Export Video button
    document.getElementById('btn-export-video')?.addEventListener('click', () => {
      this.exportVideo(8, 3);
    });

    // Save JSON
    document.getElementById('btn-export-json')?.addEventListener('click', () => {
      this.exportProjectJSON();
    });

    // Import JSON File
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
            showToast('Project imported successfully!', 'success');
          } else {
            showToast('Invalid project JSON structure.', 'warning');
          }
        } catch (err) {
          showToast('Failed to parse JSON file: ' + err.message, 'error');
        }
      };
      reader.readAsText(file);
      importInput.value = '';
    });

    // Inline Project Name Editing
    const titleInput = document.getElementById('project-name-input');
    titleInput?.addEventListener('change', (e) => {
      const val = e.target.value.trim();
      if (val) {
        this.project.name = val;
        this.autoSave();
      }
    });
  }

  setTool(toolName) {
    // Commit floating selection if moving tools
    if (this.floatingSelection) {
      this.stampFloatingSelection();
    }

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

    // Pointer Down (Mouse, Stylus, Touch)
    canvas.addEventListener('pointerdown', (e) => {
      canvas.setPointerCapture(e.pointerId);
      this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      // Multi-touch pinch zoom detection
      if (this.activePointers.size === 2) {
        const pts = Array.from(this.activePointers.values());
        this.initialPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        this.initialPinchZoom = this.renderer.camera.zoom;
        return;
      }

      const { px, py, sx, sy } = screenToPixel(e.clientX, e.clientY);

      // Pan with Middle Click, Hand Tool, or Space / Alt modifier
      if (e.button === 1 || this.activeTool === 'move' || e.altKey || e.shiftKey) {
        this.isPanning = true;
        this.panStart = { x: sx, y: sy };
        return;
      }

      if (e.button !== 0 && e.button !== 2 && e.pointerType === 'mouse') return;
      const isRightClick = e.button === 2;
      const drawColor = isRightClick ? this.secondaryColor : this.primaryColor;

      // Handle Floating Selection Interaction
      if (this.floatingSelection) {
        const { x, y, width, height } = this.floatingSelection;
        if (px >= x && px < x + width && py >= y && py < y + height) {
          // Drag floating selection
          this.isMovingSelection = true;
          this.drawStart = { x: px, y: py };
          return;
        } else {
          // Click outside stamps selection
          this.stampFloatingSelection();
        }
      }

      // Eyedropper / Color Picker (or Alt+Click)
      if (this.activeTool === 'picker') {
        const pickedColor = this.getPixelColorAt(px, py);
        if (pickedColor && pickedColor !== 'transparent') {
          if (isRightClick) this.secondaryColor = pickedColor;
          else this.primaryColor = pickedColor;
          this.renderColorPickerPanel();
          showToast(`Picked ${pickedColor}`, 'info', 1200);
        }
        return;
      }

      // Color Replace Tool
      if (this.activeTool === 'colorReplace') {
        const activeLayer = this.getActiveLayer();
        if (activeLayer && !activeLayer.locked) {
          const targetColor = activeLayer.pixels[py * this.project.width + px];
          if (targetColor && targetColor.toLowerCase() !== drawColor.toLowerCase()) {
            this.recordHistory('Replace Color');
            activeLayer.pixels = replaceColorInPixels(activeLayer.pixels, targetColor, drawColor, this.selection, this.project.width, this.project.height);
            this.renderAll();
            this.autoSave();
            showToast(`Replaced ${targetColor} with ${drawColor}`, 'success');
          }
        }
        return;
      }

      // Flood Fill / Paint Bucket
      if (this.activeTool === 'bucket') {
        const activeLayer = this.getActiveLayer();
        if (activeLayer && !activeLayer.locked) {
          this.recordHistory('Bucket Fill');
          const filled = floodFill(activeLayer.pixels, this.project.width, this.project.height, px, py, drawColor);
          filled.forEach(p => {
            activeLayer.pixels[p.y * this.project.width + p.x] = p.color;
          });
          this.renderAll();
          this.autoSave();
        }
        return;
      }

      // Drawing Tools Start
      this.isDrawing = true;
      this.drawStart = { x: px, y: py };
      this.strokePoints = [{ x: px, y: py }];

      if (['pencil', 'eraser', 'dither'].includes(this.activeTool)) {
        this.recordHistory('Draw Stroke');
        this.applyPixelStroke([{ x: px, y: py }], drawColor);
        this.requestRender();
      }
    });

    // Pointer Move
    window.addEventListener('pointermove', (e) => {
      if (this.activePointers.has(e.pointerId)) {
        this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }

      // Handle 2-Finger Pinch Zoom & Pan
      if (this.activePointers.size === 2) {
        const pts = Array.from(this.activePointers.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (this.initialPinchDist > 0) {
          const factor = dist / this.initialPinchDist;
          this.renderer.camera.zoom = Math.max(1, Math.min(64, Math.round(this.initialPinchZoom * factor)));
          this.requestRender();
          this.updateZoomLabel();
        }
        return;
      }

      const { px, py, sx, sy } = screenToPixel(e.clientX, e.clientY);
      this.cursorPos = { x: px, y: py };
      this.updateCoordinatesReadout(px, py);

      // Panning
      if (this.isPanning) {
        this.renderer.camera.x += sx - this.panStart.x;
        this.renderer.camera.y += sy - this.panStart.y;
        this.panStart = { x: sx, y: sy };
        this.requestRender();
        return;
      }

      // Moving Floating Selection
      if (this.isMovingSelection && this.floatingSelection) {
        const dx = px - this.drawStart.x;
        const dy = py - this.drawStart.y;
        this.floatingSelection.x += dx;
        this.floatingSelection.y += dy;
        this.drawStart = { x: px, y: py };
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
          const linePts = getLinePixels(last.x, last.y, px, py);
          this.strokePoints.push(...linePts);
          this.applyPixelStroke(linePts, drawColor);
          this.requestRender();
        }
        return;
      }

      // Shape Previews
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

    // Pointer Up
    const onPointerUp = (e) => {
      if (this.activePointers.has(e.pointerId)) {
        this.activePointers.delete(e.pointerId);
      }

      if (this.isDrawing) {
        // Commit shape preview pixels to layer
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
      this.isMovingSelection = false;
    };

    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Mouse wheel zoom
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const { sx, sy } = screenToPixel(e.clientX, e.clientY);
      const zoomFactor = e.deltaY < 0 ? 1.25 : 0.8;
      const oldZoom = this.renderer.camera.zoom;
      const newZoom = Math.max(1, Math.min(64, Math.round(oldZoom * zoomFactor)));

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
      const offset = Math.floor(this.brushSize / 2);
      for (let by = 0; by < this.brushSize; by++) {
        for (let bx = 0; bx < this.brushSize; bx++) {
          const px = pt.x - offset + bx;
          const py = pt.y - offset + by;

          const symmetricalPoints = this.getSymmetricalPoints(px, py);
          symmetricalPoints.forEach(sp => {
            if (sp.x >= 0 && sp.x < pw && sp.y >= 0 && sp.y < ph) {
              // Respect active selection boundary
              if (this.selection && !this.isPointInsideSelection(sp.x, sp.y)) {
                return;
              }

              let finalColor = color;
              if (this.activeTool === 'eraser') {
                finalColor = 'transparent';
              } else if (this.activeTool === 'dither') {
                finalColor = getDitherColor(sp.x, sp.y, this.primaryColor, this.secondaryColor, this.ditherThreshold);
              }
              activeLayer.pixels[sp.y * pw + sp.x] = finalColor;
            }
          });
        }
      }
    });

    this.addRecentColor(color);
  }

  isPointInsideSelection(x, y) {
    if (!this.selection) return true;
    const minX = Math.min(this.selection.x0, this.selection.x1);
    const maxX = Math.max(this.selection.x0, this.selection.x1);
    const minY = Math.min(this.selection.y0, this.selection.y1);
    const maxY = Math.max(this.selection.y0, this.selection.y1);
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
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
    const layers = [...currentFrame.layers].reverse();
    for (const l of layers) {
      if (l.visible === false || !l.pixels) continue;
      const c = l.pixels[y * pw + x];
      if (c && c !== 'transparent') return c;
    }
    return null;
  }

  // --- Keyboard Shortcuts ---
  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      // Tools
      if (e.key === 'b' || e.key === 'B') this.setTool('pencil');
      if (e.key === 'e' || e.key === 'E') this.setTool('eraser');
      if (e.key === 'l' || e.key === 'L') this.setTool('line');
      if (e.key === 'u' || e.key === 'U') this.setTool('rect');
      if (e.key === 'c' && !e.ctrlKey && !e.metaKey) this.setTool('circle');
      if (e.key === 'g' || e.key === 'G') this.setTool('bucket');
      if (e.key === 'i' || e.key === 'I') this.setTool('picker');
      if (e.key === 'd' && !e.ctrlKey && !e.metaKey) this.setTool('dither');
      if (e.key === 's' && !e.ctrlKey && !e.metaKey) this.setTool('select');
      if (e.key === 'm' || e.key === 'M') this.setTool('move');
      if (e.key === 'r' && !e.ctrlKey && !e.metaKey) this.setTool('colorReplace');
      if (e.key === 'x' || e.key === 'X') this.swapColors();

      // Brush Size
      if (e.key === '[') {
        this.brushSize = Math.max(1, this.brushSize - 1);
        const sel = document.getElementById('select-brush-size');
        if (sel) sel.value = this.brushSize;
        this.requestRender();
      }
      if (e.key === ']') {
        this.brushSize = Math.min(4, this.brushSize + 1);
        const sel = document.getElementById('select-brush-size');
        if (sel) sel.value = this.brushSize;
        this.requestRender();
      }

      // Space -> Toggle Play Animation
      if (e.code === 'Space') {
        e.preventDefault();
        this.animation.togglePlay();
        this.renderAnimationTimeline();
      }

      // Navigation Arrows
      if (e.key === 'ArrowLeft') {
        this.animation.stepPrev();
      }
      if (e.key === 'ArrowRight') {
        this.animation.stepNext();
      }

      // Selection shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        this.selectAll();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D') || e.key === 'Escape') {
        e.preventDefault();
        this.deselect();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        this.copySelection();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'x' || e.key === 'X')) {
        e.preventDefault();
        this.cutSelection();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        this.pasteSelection();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (this.selection) {
          e.preventDefault();
          this.deleteSelection();
        }
      }

      // Help
      if (e.key === '?' || e.key === 'F1') {
        e.preventDefault();
        showShortcutsModal();
      }

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        this.redo();
      }
    });
  }

  // --- Selection Engine ---
  selectAll() {
    this.selection = {
      x0: 0,
      y0: 0,
      x1: this.project.width - 1,
      y1: this.project.height - 1
    };
    this.requestRender();
  }

  deselect() {
    if (this.floatingSelection) {
      this.stampFloatingSelection();
    }
    this.selection = null;
    this.requestRender();
  }

  deleteSelection() {
    if (!this.selection) return;
    const activeLayer = this.getActiveLayer();
    if (!activeLayer || activeLayer.locked) return;

    this.recordHistory('Clear Selection');
    const minX = Math.max(0, Math.min(this.selection.x0, this.selection.x1));
    const maxX = Math.min(this.project.width - 1, Math.max(this.selection.x0, this.selection.x1));
    const minY = Math.max(0, Math.min(this.selection.y0, this.selection.y1));
    const maxY = Math.min(this.project.height - 1, Math.max(this.selection.y0, this.selection.y1));

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        activeLayer.pixels[y * this.project.width + x] = 'transparent';
      }
    }

    this.renderAll();
    this.autoSave();
    showToast('Selection cleared', 'info');
  }

  copySelection() {
    if (!this.selection) return;
    const activeLayer = this.getActiveLayer();
    if (!activeLayer) return;

    const minX = Math.max(0, Math.min(this.selection.x0, this.selection.x1));
    const maxX = Math.min(this.project.width - 1, Math.max(this.selection.x0, this.selection.x1));
    const minY = Math.max(0, Math.min(this.selection.y0, this.selection.y1));
    const maxY = Math.min(this.project.height - 1, Math.max(this.selection.y0, this.selection.y1));

    const w = maxX - minX + 1;
    const h = maxY - minY + 1;
    const pixels = new Array(w * h).fill('transparent');

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        pixels[y * w + x] = activeLayer.pixels[(minY + y) * this.project.width + (minX + x)];
      }
    }

    this.clipboardData = { width: w, height: h, pixels };
    showToast(`Copied ${w}×${h} px selection`, 'success');
  }

  cutSelection() {
    if (!this.selection) return;
    this.copySelection();
    this.deleteSelection();
  }

  pasteSelection() {
    if (!this.clipboardData) {
      showToast('Clipboard is empty. Copy a selection first (Ctrl+C).', 'warning');
      return;
    }

    this.floatingSelection = {
      x: 0,
      y: 0,
      width: this.clipboardData.width,
      height: this.clipboardData.height,
      pixels: [...this.clipboardData.pixels]
    };

    this.requestRender();
    showToast('Pasted floating selection. Drag to move or click to stamp.', 'info');
  }

  stampFloatingSelection() {
    if (!this.floatingSelection) return;
    const activeLayer = this.getActiveLayer();
    if (activeLayer && !activeLayer.locked) {
      this.recordHistory('Stamp Selection');
      const { x, y, width, height, pixels } = this.floatingSelection;
      const pw = this.project.width;
      const ph = this.project.height;

      for (let py = 0; py < height; py++) {
        for (let px = 0; px < width; px++) {
          const targetX = x + px;
          const targetY = y + py;
          if (targetX >= 0 && targetX < pw && targetY >= 0 && targetY < ph) {
            const col = pixels[py * width + px];
            if (col && col !== 'transparent') {
              activeLayer.pixels[targetY * pw + targetX] = col;
            }
          }
        }
      }
    }

    this.floatingSelection = null;
    this.renderAll();
    this.autoSave();
  }

  // --- Transformations ---
  flipHorizontal() {
    const activeLayer = this.getActiveLayer();
    if (!activeLayer || activeLayer.locked) return;
    this.recordHistory('Flip Horizontal');
    activeLayer.pixels = flipPixelsHorizontal(activeLayer.pixels, this.project.width, this.project.height, this.selection);
    this.renderAll();
    this.autoSave();
    showToast('Flipped Horizontally', 'info');
  }

  flipVertical() {
    const activeLayer = this.getActiveLayer();
    if (!activeLayer || activeLayer.locked) return;
    this.recordHistory('Flip Vertical');
    activeLayer.pixels = flipPixelsVertical(activeLayer.pixels, this.project.width, this.project.height, this.selection);
    this.renderAll();
    this.autoSave();
    showToast('Flipped Vertically', 'info');
  }

  rotate90() {
    const activeLayer = this.getActiveLayer();
    if (!activeLayer || activeLayer.locked) return;
    this.recordHistory('Rotate 90° CW');
    activeLayer.pixels = rotatePixels90CW(activeLayer.pixels, this.project.width, this.project.height);
    this.renderAll();
    this.autoSave();
    showToast('Rotated 90° Clockwise', 'info');
  }

  applyCanvasResize({ mode, width, height, anchor, pixelScale }) {
    this.recordHistory('Resize Canvas');

    if (mode === 'canvas') {
      const oldW = this.project.width;
      const oldH = this.project.height;
      this.project.width = width;
      this.project.height = height;

      this.project.frames.forEach(frame => {
        frame.layers.forEach(layer => {
          layer.pixels = resizePixelBuffer(layer.pixels, oldW, oldH, width, height, anchor);
        });
      });
      showToast(`Canvas resized to ${width}×${height} px`, 'success');
    } else {
      const oldW = this.project.width;
      const oldH = this.project.height;
      const newW = Math.round(oldW * pixelScale);
      const newH = Math.round(oldH * pixelScale);
      this.project.width = newW;
      this.project.height = newH;

      this.project.frames.forEach(frame => {
        frame.layers.forEach(layer => {
          const scaled = scalePixelBuffer(layer.pixels, oldW, oldH, pixelScale);
          layer.pixels = scaled.pixels;
        });
      });
      showToast(`Resampled canvas ${pixelScale}× to ${newW}×${newH} px`, 'success');
    }

    this.centerCanvas();
    this.renderAll();
    this.autoSave();
  }

  applyColorAdjustments({ brightness = 0, contrast = 0, effect = null, scope = 'active-layer' }) {
    this.recordHistory('Adjust Colors');

    const modifyPixels = (pixels) => {
      let res = pixels;
      if (effect === 'invert') res = invertPixels(res);
      else if (effect === 'grayscale') res = grayscalePixels(res);
      else if (brightness !== 0 || contrast !== 0) res = adjustPixelsBrightnessContrast(res, brightness, contrast);
      return res;
    };

    if (scope === 'active-layer') {
      const l = this.getActiveLayer();
      if (l && !l.locked) l.pixels = modifyPixels(l.pixels);
    } else if (scope === 'all-layers') {
      const curFrame = this.project.frames[this.activeFrameIndex];
      if (curFrame) {
        curFrame.layers.forEach(l => {
          if (!l.locked) l.pixels = modifyPixels(l.pixels);
        });
      }
    } else if (scope === 'all-frames') {
      this.project.frames.forEach(frame => {
        frame.layers.forEach(l => {
          if (!l.locked) l.pixels = modifyPixels(l.pixels);
        });
      });
    }

    this.renderAll();
    this.autoSave();
    showToast('Applied color adjustments', 'success');
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

  getCurrentPaletteColors() {
    const pal = getPalette(this.currentPaletteId);
    return pal ? pal.colors : this.customPalette;
  }

  setCustomPalette(colors) {
    this.customPalette = colors;
    this.currentPaletteId = 'custom';
    this.renderColorPickerPanel();
  }

  // --- Frame & Layer Manipulation ---
  setFrame(index) {
    this.activeFrameIndex = Math.max(0, Math.min((this.project.frames.length - 1), index));
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
          blendMode: 'normal',
          pixels: new Array(pw * ph).fill('transparent')
        }
      ]
    };
    this.project.frames.push(newFrame);
    this.setFrame(this.project.frames.length - 1);
    this.autoSave();
    showToast(`Added Frame #${this.project.frames.length}`, 'success');
  }

  duplicateFrame(index) {
    this.recordHistory('Duplicate Frame');
    const source = this.project.frames[index];
    const clone = JSON.parse(JSON.stringify(source));
    clone.id = 'frame_' + Date.now();
    this.project.frames.splice(index + 1, 0, clone);
    this.setFrame(index + 1);
    this.autoSave();
    showToast(`Duplicated Frame #${index + 1}`, 'success');
  }

  deleteFrame(index) {
    if (this.project.frames.length <= 1) return;
    this.recordHistory('Delete Frame');
    this.project.frames.splice(index, 1);
    this.setFrame(Math.max(0, index - 1));
    this.autoSave();
    showToast(`Deleted Frame #${index + 1}`, 'info');
  }

  moveFrame(index, dir) {
    const target = index + dir;
    if (target >= 0 && target < this.project.frames.length) {
      this.recordHistory('Reorder Frames');
      const temp = this.project.frames[index];
      this.project.frames[index] = this.project.frames[target];
      this.project.frames[target] = temp;
      this.setFrame(target);
      this.autoSave();
    }
  }

  reverseFrames() {
    if (this.project.frames.length <= 1) return;
    this.recordHistory('Reverse Frames');
    this.project.frames.reverse();
    this.renderAll();
    this.autoSave();
    showToast('Reversed animation frames order', 'success');
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
      blendMode: 'normal',
      pixels: new Array(pw * ph).fill('transparent')
    };
    currentFrame.layers.push(newLayer);
    this.activeLayerId = newLayer.id;
    this.renderAll();
    this.autoSave();
    showToast('Created new layer', 'success');
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
    showToast(`Duplicated layer "${target.name}"`, 'success');
  }

  deleteLayer(id) {
    const currentFrame = this.project.frames[this.activeFrameIndex];
    if (currentFrame.layers.length <= 1) return;

    this.recordHistory('Delete Layer');
    currentFrame.layers = currentFrame.layers.filter(l => l.id !== id);
    this.activeLayerId = currentFrame.layers[0].id;
    this.renderAll();
    this.autoSave();
    showToast('Deleted layer', 'info');
  }

  renameLayer(id, newName) {
    const currentFrame = this.project.frames[this.activeFrameIndex];
    const target = currentFrame.layers.find(l => l.id === id);
    if (target) {
      target.name = newName;
      this.renderLayerStack();
      this.autoSave();
    }
  }

  mergeDownLayer(idx) {
    const currentFrame = this.project.frames[this.activeFrameIndex];
    if (idx <= 0 || !currentFrame || !currentFrame.layers[idx]) return;

    this.recordHistory('Merge Down Layer');
    const topLayer = currentFrame.layers[idx];
    const bottomLayer = currentFrame.layers[idx - 1];
    const pw = this.project.width;
    const ph = this.project.height;

    for (let y = 0; y < ph; y++) {
      for (let x = 0; x < pw; x++) {
        const topCol = topLayer.pixels[y * pw + x];
        if (topCol && topCol !== 'transparent') {
          bottomLayer.pixels[y * pw + x] = topCol;
        }
      }
    }

    currentFrame.layers.splice(idx, 1);
    this.activeLayerId = bottomLayer.id;
    this.renderAll();
    this.autoSave();
    showToast(`Merged "${topLayer.name}" down into "${bottomLayer.name}"`, 'success');
  }

  flattenLayers() {
    const currentFrame = this.project.frames[this.activeFrameIndex];
    if (!currentFrame || currentFrame.layers.length <= 1) return;

    this.recordHistory('Flatten Layers');
    const pw = this.project.width;
    const ph = this.project.height;
    const flatPixels = new Array(pw * ph).fill('transparent');

    for (const layer of currentFrame.layers) {
      if (layer.visible === false || !layer.pixels) continue;
      for (let y = 0; y < ph; y++) {
        for (let x = 0; x < pw; x++) {
          const col = layer.pixels[y * pw + x];
          if (col && col !== 'transparent') {
            flatPixels[y * pw + x] = col;
          }
        }
      }
    }

    currentFrame.layers = [
      {
        id: 'layer_flattened_' + Date.now(),
        name: 'Flattened Image',
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: 'normal',
        pixels: flatPixels
      }
    ];

    this.activeLayerId = currentFrame.layers[0].id;
    this.renderAll();
    this.autoSave();
    showToast('Flattened all visible layers', 'success');
  }

  // --- Panels ---
  renderColorPickerPanel() {
    const container = document.getElementById('color-picker-container');
    if (!container) return;

    renderColorPanel(container, {
      primaryColor: this.primaryColor,
      secondaryColor: this.secondaryColor,
      currentPaletteId: this.currentPaletteId,
      customPalette: this.customPalette,
      recentColors: this.recentColors,
      ditherThreshold: this.ditherThreshold,
      onColorChange: (col, isSecondary) => {
        if (isSecondary) this.secondaryColor = col;
        else this.primaryColor = col;
        this.renderColorPickerPanel();
      },
      onPaletteChange: (pId) => {
        this.currentPaletteId = pId;
        this.renderColorPickerPanel();
      },
      onAddColorToPalette: (col) => {
        if (!this.customPalette.includes(col)) {
          this.customPalette.push(col);
          this.currentPaletteId = 'custom';
          this.renderColorPickerPanel();
          showToast(`Added ${col} to palette`, 'success');
        }
      },
      onOpenPaletteManager: () => {
        showPaletteManagerModal(this);
      },
      onDitherThresholdChange: (val) => {
        this.ditherThreshold = val;
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
      onRenameLayer: (id, name) => this.renameLayer(id, name),
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
      onBlendModeChange: (id, mode) => {
        const l = currentFrame.layers.find(x => x.id === id);
        if (l) { l.blendMode = mode; this.requestRender(); this.autoSave(); }
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
      },
      onMergeDown: (idx) => this.mergeDownLayer(idx),
      onFlatten: () => this.flattenLayers()
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
      playMode: this.animation.playMode,
      showOnionSkin: this.showOnionSkin,
      projectWidth: this.project.width,
      projectHeight: this.project.height,
      onSelectFrame: (idx) => this.setFrame(idx),
      onAddFrame: () => this.addFrame(),
      onDuplicateFrame: (idx) => this.duplicateFrame(idx),
      onDeleteFrame: (idx) => this.deleteFrame(idx),
      onMoveFrame: (idx, dir) => this.moveFrame(idx, dir),
      onReverseFrames: () => this.reverseFrames(),
      onTogglePlay: () => {
        this.animation.togglePlay();
        this.renderAnimationTimeline();
      },
      onStepNext: () => this.animation.stepNext(),
      onStepPrev: () => this.animation.stepPrev(),
      onFPSChange: (fps) => {
        this.animation.fps = fps;
      },
      onPlayModeChange: (mode) => {
        this.animation.playMode = mode;
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
    showToast('Undo', 'info', 1000);
  }

  redo() {
    if (this.redoStack.length === 0) return;
    this.undoStack.push(JSON.stringify(this.project));
    this.project = JSON.parse(this.redoStack.pop());
    this.renderAll();
    this.updateUndoRedoUI();
    this.autoSave();
    showToast('Redo', 'info', 1000);
  }

  updateUndoRedoUI() {
    const u = document.getElementById('btn-undo');
    const r = document.getElementById('btn-redo');
    if (u) u.disabled = this.undoStack.length === 0;
    if (r) r.disabled = this.redoStack.length === 0;
  }

  // --- Export Actions ---
  exportPNG(scale = 8) {
    const currentFrame = this.project.frames[this.activeFrameIndex];
    if (!currentFrame) return;

    const frameCanvas = this.animation.renderFrameToCanvas(currentFrame, this.project.width, this.project.height, scale, this.project.background);
    const url = frameCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.project.name || 'pixel_art').toLowerCase().replace(/\s+/g, '_') + `_${scale}x.png`;
    a.click();
    showToast(`Exported ${scale}× PNG (${this.project.width * scale}×${this.project.height * scale} px)`, 'success');
  }

  exportAllFramesPNG(scale = 8) {
    this.project.frames.forEach((frame, idx) => {
      const frameCanvas = this.animation.renderFrameToCanvas(frame, this.project.width, this.project.height, scale, this.project.background);
      const a = document.createElement('a');
      a.href = frameCanvas.toDataURL('image/png');
      a.download = (this.project.name || 'pixel_art').toLowerCase().replace(/\s+/g, '_') + `_frame_${idx + 1}.png`;
      a.click();
    });
    showToast(`Exported all ${this.project.frames.length} frames as PNGs`, 'success');
  }

  exportSpriteSheetWithAtlas(columns = null, scale = 1, includeAtlas = true) {
    const { canvas, atlasJSON } = this.animation.generateSpriteSheet(columns, scale, 0, this.project.background);
    const baseName = (this.project.name || 'spritesheet').toLowerCase().replace(/\s+/g, '_');

    // Download PNG
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${baseName}_sheet.png`;
    a.click();

    // Download JSON Atlas
    if (includeAtlas) {
      setTimeout(() => {
        const jsonBlob = new Blob([JSON.stringify(atlasJSON, null, 2)], { type: 'application/json' });
        const ja = document.createElement('a');
        ja.href = URL.createObjectURL(jsonBlob);
        ja.download = `${baseName}_atlas.json`;
        ja.click();
      }, 200);
    }

    showToast('Exported sprite sheet and atlas metadata', 'success');
  }

  exportAnimatedSVG(scale = 10) {
    const svgStr = this.animation.generateAnimatedSVG(scale);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (this.project.name || 'animation').toLowerCase().replace(/\s+/g, '_') + '.svg';
    a.click();
    showToast('Exported vector Animated SVG', 'success');
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
      showToast('Video recording saved!', 'success');
    } catch (err) {
      showToast('Video export failed: ' + err.message, 'error');
    }
  }

  exportProjectJSON() {
    const json = JSON.stringify(this.project, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (this.project.name || 'project').toLowerCase().replace(/\s+/g, '_') + '.pixelforge.json';
    a.click();
    showToast('Project file saved (.pixelforge.json)', 'success');
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

  createNewProject({ name = 'Pixel Artwork', width = 32, height = 32, background = 'transparent', paletteId = 'pico8' }) {
    this.recordHistory('New Project');
    this.currentPaletteId = paletteId;
    this.project = {
      id: 'proj_' + Date.now(),
      name,
      width,
      height,
      background,
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
              blendMode: 'normal',
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
    showToast(`Created new project "${name}" (${width}×${height})`, 'success');
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
      zLabel.textContent = `${Math.round(this.renderer.camera.zoom * 100)}%`;
    }
  }

  updateCoordinatesReadout(px, py) {
    const coordEl = document.getElementById('pixel-coordinates-readout');
    if (coordEl) {
      const inBounds = px >= 0 && px < this.project.width && py >= 0 && py < this.project.height;
      if (inBounds) {
        const color = this.getPixelColorAt(px, py) || 'Empty';
        coordEl.innerHTML = `X: <strong>${px}</strong>, Y: <strong>${py}</strong> &bull; <span class="font-mono text-xs">${color}</span>`;
      } else {
        coordEl.textContent = `X: -, Y: -`;
      }
    }
  }

  updateStats() {
    const statsEl = document.getElementById('project-stats-readout');
    if (statsEl) {
      const numFrames = (this.project.frames || []).length;
      statsEl.innerHTML = `Canvas: <strong>${this.project.width}×${this.project.height}</strong> &bull; Frames: <strong>${numFrames}</strong> &bull; Layers: <strong>${(this.project.frames[this.activeFrameIndex]?.layers || []).length}</strong>`;
    }
  }

  updateProjectTitleUI() {
    const titleInput = document.getElementById('project-name-input');
    if (titleInput) {
      titleInput.value = this.project.name || 'Pixel Artwork';
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
