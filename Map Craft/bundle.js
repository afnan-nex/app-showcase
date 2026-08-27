/**
 * MapCraft - Standalone Cartography & Map Workstation Bundle
 * Multi-layer interactive map creation with routes, regions, markers, scale measurement, and themes.
 * 100% Client-Side, Zero Backend, Works on HTTP & file:///
 */

(function() {
'use strict';


/* --- MODULE: js/core/icons.js --- */
/**
 * MapCraft - Local SVG Icons Registry
 * Crisp cartographic, drawing tool, and UI icons.
 */

const ICONS = {
  // Tools
  select: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l7 18 3-7 7-3L3 3z"></path></svg>`,
  hand: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0v5"></path><path d="M14 10V4a2 2 0 0 0-4 0v7"></path><path d="M10 10.5V6a2 2 0 0 0-4 0v8"></path><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.83L7 15"></path></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  route: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"></circle><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"></path><circle cx="18" cy="5" r="3"></circle></svg>`,
  polygon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 5-3 12H7L4 7z"></path></svg>`,
  circle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>`,
  label: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>`,
  ruler: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 8.7L8.7 21.3a2.12 2.12 0 0 1-3 0L2.7 18.3a2.12 2.12 0 0 1 0-3L15.3 2.7a2.12 2.12 0 0 1 3 0l3 3a2.12 2.12 0 0 1 0 3z"></path><line x1="7.5" y1="13.5" x2="9.5" y2="15.5"></line><line x1="10.5" y1="10.5" x2="12.5" y2="12.5"></line><line x1="13.5" y1="7.5" x2="15.5" y2="9.5"></line><line x1="16.5" y1="4.5" x2="18.5" y2="6.5"></line></svg>`,

  // UI & History
  undo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>`,
  redo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`,
  zoomIn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
  zoomOut: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
  fit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  legend: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="8" x2="16" y2="8"></line><line x1="8" y1="12" x2="16" y2="12"></line><line x1="8" y1="16" x2="12" y2="16"></line></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
  unlock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
  compass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`,
  print: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>`,

  // Cartographic Marker Category Icons
  castle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V9l2-2 2 2V4h3v3l2-2 2 2V4h3v5l2-2 2 2v12H4z"></path><path d="M9 21v-4a3 3 0 0 1 6 0v4"></path></svg>`,
  mountain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"></path></svg>`,
  anchor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"></circle><line x1="12" y1="22" x2="12" y2="8"></line><path d="M5 12H2a10 10 0 0 0 20 0h-3"></path></svg>`,
  camp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21 12 5 5 21h14Z"></path><path d="m12 5 4 16"></path></svg>`,
  skull: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><path d="M8 20v2h8v-2"></path><path d="m12.5 17-.5-1-.5 1h1z"></path><path d="M16 20a3 3 0 0 0 1.56-4.56A8 8 0 1 0 6.44 15.44 3 3 0 0 0 8 20z"></path></svg>`,
  treasure: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="14" rx="2"></rect><path d="M2 10h20"></path><path d="M12 10v4"></path></svg>`,
  food: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
  hotel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
};

function getIcon(name, extraClass = '') {
  const svg = ICONS[name] || ICONS.pin;
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


/* --- MODULE: js/core/math.js --- */
/**
 * GameSmith / MapCraft - Cartographic & Geometry Math Engine
 * Distance calculation, Shoelace polygon area, point-in-polygon, and scale conversions.
 */

function calculateDistance(p1, p2) {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

function calculatePolylineLength(points) {
  if (!points || points.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    total += calculateDistance(points[i], points[i + 1]);
  }
  return total;
}

// Shoelace formula for polygon area
function calculatePolygonArea(points) {
  if (!points || points.length < 3) return 0;
  let area = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area) / 2;
}

// Ray-casting algorithm for Point in Polygon
function pointInPolygon(point, polygon) {
  if (!polygon || polygon.length < 3) return false;
  let inside = false;
  const x = point.x, y = point.y;
  const n = polygon.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;

    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

// Distance from point P to line segment AB
function distanceToSegment(p, a, b) {
  const l2 = Math.hypot(b.x - a.x, b.y - a.y) ** 2;
  if (l2 === 0) return calculateDistance(p, a);

  let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
  t = Math.max(0, Math.min(1, t));

  const projX = a.x + t * (b.x - a.x);
  const projY = a.y + t * (b.y - a.y);
  return Math.hypot(p.x - projX, p.y - projY);
}

function pointNearPolyline(p, points, threshold = 8) {
  if (!points || points.length < 2) return false;
  for (let i = 0; i < points.length - 1; i++) {
    if (distanceToSegment(p, points[i], points[i + 1]) <= threshold) {
      return true;
    }
  }
  return false;
}

/**
 * Scaled Units Formatter
 * scaleRatio: How many real-world units per 100 pixels (e.g. 100px = 10 km)
 */
function formatScaledDistance(pixels, scaleRatio = 10, unit = 'km') {
  const realUnits = (pixels / 100) * scaleRatio;
  if (unit === 'km') {
    if (realUnits < 1) {
      return `${Math.round(realUnits * 1000)} m`;
    }
    return `${realUnits.toFixed(1)} km`;
  }
  if (unit === 'mi') {
    if (realUnits < 0.1) {
      return `${Math.round(realUnits * 5280)} ft`;
    }
    return `${realUnits.toFixed(1)} mi`;
  }
  return `${Math.round(realUnits)} ${unit}`;
}

function formatScaledArea(pixelArea, scaleRatio = 10, unit = 'km') {
  // Area scaling is squared: (pixels / 100)^2 * scaleRatio^2
  const realUnitsSq = ((Math.sqrt(pixelArea) / 100) * scaleRatio) ** 2;
  if (unit === 'km') {
    if (realUnitsSq < 0.1) {
      return `${Math.round(realUnitsSq * 1000000)} m²`;
    }
    return `${realUnitsSq.toFixed(1)} km²`;
  }
  if (unit === 'mi') {
    return `${realUnitsSq.toFixed(1)} sq mi`;
  }
  return `${Math.round(realUnitsSq)} sq ${unit}`;
}


/* --- MODULE: js/core/db.js --- */
/**
 * MapCraft - IndexedDB Persistence Engine
 * Saves cartography projects, custom themes, and user settings locally.
 */

const DB_NAME = 'MapCraft_DB';
const DB_VERSION = 1;
const STORES = {
  PROJECTS: 'map_projects',
  SETTINGS: 'settings'
};

class MapDatabase {
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
      localStorage.setItem('mapcraft_project_' + project.id, JSON.stringify(project));
      localStorage.setItem('mapcraft_last_project_id', project.id);
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
      const raw = localStorage.getItem('mapcraft_project_' + id);
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
        if (key.startsWith('mapcraft_project_')) {
          list.push(JSON.parse(localStorage.getItem(key)));
        }
      }
    } catch (e) {}
    return list;
  }
}

const db = new MapDatabase();
db;


/* --- MODULE: js/engine/themes.js --- */
/**
 * MapCraft - Cartographic Themes & Styling Engine
 * Provides distinct cartographic styles (Parchment, Dark Slate, Blueprint, Clean, Terrain).
 */

const MAP_THEMES = {
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

function getTheme(themeId = 'parchment') {
  return MAP_THEMES[themeId] || MAP_THEMES.parchment;
}


/* --- MODULE: js/engine/renderer.js --- */
/**
 * MapCraft - Canvas 2D Cartography Renderer
 * Renders multi-layer maps: regions, routes, markers with icons, haloed labels, measurement tools, and scale bars.
 */




class MapRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0, zoom: 1 };
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  render({
    project,
    activeLayerId,
    selectedObjectId,
    hoveredObjectId,
    activeDrawing,
    scaleRatio = 10,
    scaleUnit = 'km',
    themeId = 'parchment',
    showGrid = true,
    showCompass = true,
    showScaleRuler = true
  }) {
    const ctx = this.ctx;
    const theme = getTheme(themeId || project.themeId);

    // 1. Clear & Paint Theme Background
    ctx.fillStyle = theme.bgColor;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 2. Cartographic Grid Overlay
    if (showGrid) {
      this.drawCartographicGrid(theme);
    }

    ctx.save();
    // 3. Apply Camera Transform (Pan & Zoom)
    ctx.translate(this.camera.x, this.camera.y);
    ctx.scale(this.camera.zoom, this.camera.zoom);

    // 4. Render Layers in Order
    const layers = project.layers || [];
    for (const layer of layers) {
      if (layer.visible === false) continue;

      const layerObjects = (project.objects || []).filter(o => o.layerId === layer.id);

      for (const obj of layerObjects) {
        if (obj.visible === false) continue;
        const isSelected = obj.id === selectedObjectId;
        const isHovered = obj.id === hoveredObjectId;
        this.renderMapObject(obj, theme, isSelected, isHovered, scaleRatio, scaleUnit);
      }
    }

    // 5. Render Active Drawing Preview
    if (activeDrawing) {
      this.renderActiveDrawing(activeDrawing, theme, scaleRatio, scaleUnit);
    }

    ctx.restore();

    // 6. Viewport Overlays (Compass Rose & Scale Ruler)
    if (showCompass) {
      this.drawCompassRose(theme);
    }
    if (showScaleRuler) {
      this.drawScaleRuler(scaleRatio, scaleUnit, theme);
    }
  }

  // --- Grid & Coordinates ---
  drawCartographicGrid(theme) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const gridSize = 100 * this.camera.zoom;

    const startX = (this.camera.x % gridSize);
    const startY = (this.camera.y % gridSize);

    ctx.save();
    ctx.strokeStyle = theme.gridColor;
    ctx.lineWidth = 1;

    ctx.beginPath();
    for (let x = startX; x < w; x += gridSize) {
      ctx.moveTo(x, 0); ctx.lineTo(x, h);
    }
    for (let y = startY; y < h; y += gridSize) {
      ctx.moveTo(0, y); ctx.lineTo(w, y);
    }
    ctx.stroke();

    ctx.restore();
  }

  // --- Map Object Dispatcher ---
  renderMapObject(obj, theme, isSelected, isHovered, scaleRatio, scaleUnit) {
    switch (obj.type) {
      case 'region':
        this.drawRegion(obj, theme, isSelected, isHovered);
        break;
      case 'circle':
        this.drawCircle(obj, theme, isSelected, isHovered);
        break;
      case 'route':
        this.drawRoute(obj, theme, isSelected, isHovered);
        break;
      case 'marker':
        this.drawMarker(obj, theme, isSelected, isHovered);
        break;
      case 'label':
        this.drawLabel(obj, theme, isSelected, isHovered);
        break;
    }

    // Selection highlight handles
    if (isSelected) {
      this.drawSelectionHandles(obj);
    }
  }

  // --- 1. Region (Polygon) ---
  drawRegion(obj, theme, isSelected, isHovered) {
    const pts = obj.points || [];
    if (pts.length < 3) return;

    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.closePath();

    // Fill with opacity
    ctx.globalAlpha = obj.opacity !== undefined ? obj.opacity : 0.35;
    ctx.fillStyle = obj.fillColor || theme.defaultRegionColor;
    ctx.fill();

    // Stroke outline
    ctx.globalAlpha = isHovered ? 1.0 : (obj.opacity !== undefined ? Math.min(1.0, obj.opacity + 0.3) : 0.8);
    ctx.strokeStyle = obj.strokeColor || obj.fillColor || theme.accentColor;
    ctx.lineWidth = (obj.strokeWidth || 2) / (isSelected ? 1 : 1);
    if (obj.strokeDash === 'dashed') ctx.setLineDash([6, 6]);
    ctx.stroke();

    // Draw region label in center if provided
    if (obj.name) {
      const center = this.getPolygonCenter(pts);
      this.drawHaloText(obj.name, center.x, center.y, {
        fontSize: obj.fontSize || 14,
        fontFamily: "'Inter', sans-serif",
        color: obj.labelColor || theme.textColor,
        haloColor: theme.textHaloColor,
        isBold: true
      });
    }

    ctx.restore();
  }

  // --- 2. Circle Zone ---
  drawCircle(obj, theme, isSelected, isHovered) {
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.radius || 50, 0, Math.PI * 2);

    ctx.globalAlpha = obj.opacity !== undefined ? obj.opacity : 0.3;
    ctx.fillStyle = obj.fillColor || theme.defaultRegionColor;
    ctx.fill();

    ctx.globalAlpha = isHovered ? 1.0 : 0.8;
    ctx.strokeStyle = obj.strokeColor || obj.fillColor || theme.accentColor;
    ctx.lineWidth = obj.strokeWidth || 2;
    if (obj.strokeDash === 'dashed') ctx.setLineDash([4, 4]);
    ctx.stroke();

    if (obj.name) {
      this.drawHaloText(obj.name, obj.x, obj.y, {
        fontSize: 13,
        color: theme.textColor,
        haloColor: theme.textHaloColor,
        isBold: true
      });
    }

    ctx.restore();
  }

  // --- 3. Route (Polyline) ---
  drawRoute(obj, theme, isSelected, isHovered) {
    const pts = obj.points || [];
    if (pts.length < 2) return;

    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }

    ctx.strokeStyle = obj.color || theme.defaultRouteColor;
    ctx.lineWidth = (obj.width || 3) * (isHovered ? 1.4 : 1);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (obj.style === 'dashed') ctx.setLineDash([8, 6]);
    if (obj.style === 'dotted') ctx.setLineDash([2, 5]);

    ctx.stroke();

    // Draw vertex waypoint nodes
    for (let i = 0; i < pts.length; i++) {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = obj.color || theme.defaultRouteColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pts[i].x, pts[i].y, i === 0 || i === pts.length - 1 ? 4.5 : 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Label along midpoint
    if (obj.name) {
      const mid = pts[Math.floor(pts.length / 2)];
      this.drawHaloText(obj.name, mid.x, mid.y - 10, {
        fontSize: 11.5,
        color: theme.textColor,
        haloColor: theme.textHaloColor,
        isBold: true
      });
    }

    ctx.restore();
  }

  // --- 4. Marker Pin & Icon ---
  drawMarker(obj, theme, isSelected, isHovered) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(obj.x, obj.y);

    const size = (obj.size || 28) * (isHovered ? 1.15 : 1);
    const color = obj.color || theme.accentColor;

    // Pin Body
    ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;

    ctx.beginPath();
    ctx.arc(0, -size / 2, size / 2, Math.PI, 0, false);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Inner White Icon Dot or Emblem
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -size / 2, size / 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Marker Label below pin
    if (obj.name) {
      this.drawHaloText(obj.name, 0, 14, {
        fontSize: 12,
        fontFamily: "'Inter', sans-serif",
        color: theme.textColor,
        haloColor: theme.textHaloColor,
        isBold: true
      });
    }

    ctx.restore();
  }

  // --- 5. Rich Halo Label ---
  drawLabel(obj, theme, isSelected, isHovered) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(obj.x, obj.y);
    if (obj.rotation) ctx.rotate((obj.rotation * Math.PI) / 180);

    this.drawHaloText(obj.text || 'Label', 0, 0, {
      fontSize: obj.fontSize || 16,
      fontFamily: obj.fontFamily || "'Inter', sans-serif",
      color: obj.color || theme.textColor,
      haloColor: theme.textHaloColor,
      isBold: obj.isBold !== false
    });

    ctx.restore();
  }

  // --- Helper: Halo Text (Stroke outline behind text for contrast) ---
  drawHaloText(text, x, y, { fontSize = 13, fontFamily = "'Inter', sans-serif", color = '#000000', haloColor = '#ffffff', isBold = false }) {
    const ctx = this.ctx;
    ctx.font = `${isBold ? 'bold ' : ''}${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Halo stroke
    ctx.strokeStyle = haloColor;
    ctx.lineWidth = Math.max(3, fontSize / 3.5);
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;
    ctx.strokeText(text, x, y);

    // Foreground text
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }

  // --- Active Drawing Preview ---
  renderActiveDrawing(drawing, theme, scaleRatio, scaleUnit) {
    const ctx = this.ctx;
    const pts = drawing.points || [];

    if (drawing.type === 'measure') {
      if (pts.length < 2) return;
      ctx.save();
      ctx.strokeStyle = '#f85149';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 5]);

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();

      for (const p of pts) {
        ctx.fillStyle = '#f85149';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Live measurement badge at end
      const last = pts[pts.length - 1];
      const dist = formatScaledDistance(drawing.totalDist || 0, scaleRatio, scaleUnit);
      let badgeText = `Dist: ${dist}`;
      if (drawing.totalArea) {
        badgeText += ` | Area: ${formatScaledArea(drawing.totalArea, scaleRatio, scaleUnit)}`;
      }
      this.drawHaloText(badgeText, last.x, last.y - 16, { fontSize: 12, color: '#f85149', haloColor: '#ffffff', isBold: true });
      ctx.restore();
    }

    else if (drawing.type === 'route' && pts.length > 0) {
      ctx.save();
      ctx.strokeStyle = theme.defaultRouteColor;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
      ctx.restore();
    }

    else if (drawing.type === 'region' && pts.length > 0) {
      ctx.save();
      ctx.strokeStyle = theme.accentColor;
      ctx.fillStyle = 'rgba(88, 166, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  // --- Selection Handles ---
  drawSelectionHandles(obj) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 2 / this.camera.zoom;
    ctx.fillStyle = '#ffffff';

    if (obj.points) {
      for (const p of obj.points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.5 / this.camera.zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    } else if (obj.x !== undefined && obj.y !== undefined) {
      ctx.strokeRect(obj.x - 16, obj.y - 32, 32, 40);
    }
    ctx.restore();
  }

  // --- Overlays (Compass & Scale Ruler) ---
  drawCompassRose(theme) {
    const ctx = this.ctx;
    const cx = this.canvas.width - 45;
    const cy = 45;
    const r = 24;

    ctx.save();
    ctx.translate(cx, cy);

    // North Star
    ctx.fillStyle = theme.accentColor;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r / 3.5, 0);
    ctx.lineTo(0, r);
    ctx.lineTo(-r / 3.5, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = theme.textColor;
    ctx.font = "bold 11px 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('N', 0, -r - 2);

    ctx.restore();
  }

  drawScaleRuler(scaleRatio, unit, theme) {
    const ctx = this.ctx;
    const barPx = 100 * this.camera.zoom; // 100px width on screen
    const x = 20;
    const y = this.canvas.height - 24;

    ctx.save();
    ctx.strokeStyle = theme.textColor;
    ctx.lineWidth = 2;

    // Ruler Line & Ticks
    ctx.beginPath();
    ctx.moveTo(x, y - 6); ctx.lineTo(x, y);
    ctx.lineTo(x + barPx, y);
    ctx.lineTo(x + barPx, y - 6);
    ctx.stroke();

    ctx.fillStyle = theme.textColor;
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(`0`, x, y - 8);
    ctx.fillText(`${scaleRatio} ${unit}`, x + barPx, y - 8);

    ctx.restore();
  }

  getPolygonCenter(pts) {
    let x = 0, y = 0;
    pts.forEach(p => { x += p.x; y += p.y; });
    return { x: x / pts.length, y: y / pts.length };
  }
}


/* --- MODULE: js/engine/interaction.js --- */
/**
 * MapCraft - Interaction & Drawing Controller
 * Handles pointer events, multi-point route/polygon plotting, object dragging, and measurement.
 */



class MapInteraction {
  constructor(canvas, app) {
    this.canvas = canvas;
    this.app = app;

    this.activeTool = 'select'; // select, hand, marker, route, region, circle, label, measure
    this.isPanning = false;
    this.isDraggingObject = false;
    this.dragStart = { x: 0, y: 0 };
    this.dragOffset = { x: 0, y: 0 };

    // Multi-point drawing state (route, polygon, measure)
    this.drawingPoints = [];
    this.activeCircle = null;

    this.initListeners();
  }

  screenToWorld(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;
    const wx = (sx - this.app.renderer.camera.x) / this.app.renderer.camera.zoom;
    const wy = (sy - this.app.renderer.camera.y) / this.app.renderer.camera.zoom;
    return { wx, wy, sx, sy };
  }

  initListeners() {
    const canvas = this.canvas;

    canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));

    // Smooth mouse wheel zoom
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const { sx, sy } = this.screenToWorld(e.clientX, e.clientY);
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      const oldZoom = this.app.renderer.camera.zoom;
      const newZoom = Math.max(0.1, Math.min(10, oldZoom * zoomFactor));

      // Zoom towards mouse pointer position
      this.app.renderer.camera.x = sx - (sx - this.app.renderer.camera.x) * (newZoom / oldZoom);
      this.app.renderer.camera.y = sy - (sy - this.app.renderer.camera.y) * (newZoom / oldZoom);
      this.app.renderer.camera.zoom = newZoom;

      this.app.requestRender();
      this.app.updateZoomLabel();
    });
  }

  handleMouseDown(e) {
    const { wx, wy, sx, sy } = this.screenToWorld(e.clientX, e.clientY);

    // Pan with middle click or Hand tool or Shift/Alt key
    if (e.button === 1 || this.activeTool === 'hand' || e.altKey || e.shiftKey) {
      this.isPanning = true;
      this.dragStart = { x: sx, y: sy };
      return;
    }

    if (e.button !== 0) return; // Left click only

    // 1. SELECT TOOL
    if (this.activeTool === 'select') {
      const hit = this.hitTestObject(wx, wy);
      if (hit) {
        this.app.selectObject(hit.id);
        this.isDraggingObject = true;
        this.dragStart = { x: wx, y: wy };
        this.dragOffset = {
          x: wx - (hit.x || (hit.points ? hit.points[0].x : 0)),
          y: wy - (hit.y || (hit.points ? hit.points[0].y : 0))
        };
      } else {
        this.app.selectObject(null);
      }
      return;
    }

    // 2. MARKER TOOL
    if (this.activeTool === 'marker') {
      this.app.createMarkerAt(wx, wy);
      this.app.setTool('select');
      return;
    }

    // 3. LABEL TOOL
    if (this.activeTool === 'label') {
      this.app.createLabelAt(wx, wy);
      this.app.setTool('select');
      return;
    }

    // 4. CIRCLE TOOL
    if (this.activeTool === 'circle') {
      this.activeCircle = { x: wx, y: wy, radius: 10 };
      this.isDrawingCircle = true;
      return;
    }

    // 5. ROUTE / REGION / MEASURE TOOL (Multi-point click)
    if (['route', 'region', 'measure'].includes(this.activeTool)) {
      this.drawingPoints.push({ x: wx, y: wy });
      this.updateActiveDrawing(wx, wy);
      this.app.requestRender();
    }
  }

  handleMouseMove(e) {
    const { wx, wy, sx, sy } = this.screenToWorld(e.clientX, e.clientY);

    // Update bottom coordinates readout
    this.app.updateCoordinates(Math.round(wx), Math.round(wy));

    if (this.isPanning) {
      this.app.renderer.camera.x += sx - this.dragStart.x;
      this.app.renderer.camera.y += sy - this.dragStart.y;
      this.dragStart = { x: sx, y: sy };
      this.app.requestRender();
      return;
    }

    if (this.isDraggingObject && this.app.selectedObject) {
      const obj = this.app.selectedObject;
      const dx = wx - this.dragStart.x;
      const dy = wy - this.dragStart.y;

      if (obj.points) {
        obj.points.forEach(p => { p.x += dx; p.y += dy; });
      } else {
        obj.x += dx;
        obj.y += dy;
      }

      this.dragStart = { x: wx, y: wy };
      this.app.requestRender();
      this.app.renderInspector();
      return;
    }

    // Circle expansion
    if (this.isDrawingCircle && this.activeCircle) {
      this.activeCircle.radius = Math.max(10, calculateDistance(this.activeCircle, { x: wx, y: wy }));
      this.app.activeDrawing = {
        type: 'circle',
        x: this.activeCircle.x,
        y: this.activeCircle.y,
        radius: this.activeCircle.radius
      };
      this.app.requestRender();
      return;
    }

    // Multi-point active line preview
    if (this.drawingPoints.length > 0) {
      this.updateActiveDrawing(wx, wy);
      this.app.requestRender();
    }
  }

  handleMouseUp(e) {
    if (this.isDraggingObject) {
      this.app.recordHistory('Move Object');
      this.app.autoSave();
    }

    if (this.isDrawingCircle && this.activeCircle) {
      this.app.createCircle(this.activeCircle.x, this.activeCircle.y, this.activeCircle.radius);
      this.isDrawingCircle = false;
      this.activeCircle = null;
      this.app.activeDrawing = null;
      this.app.setTool('select');
    }

    this.isPanning = false;
    this.isDraggingObject = false;
  }

  handleDoubleClick(e) {
    const { wx, wy } = this.screenToWorld(e.clientX, e.clientY);

    if (this.activeTool === 'route' && this.drawingPoints.length >= 2) {
      this.app.createRoute(this.drawingPoints);
      this.finishDrawing();
    } else if (this.activeTool === 'region' && this.drawingPoints.length >= 3) {
      this.app.createRegion(this.drawingPoints);
      this.finishDrawing();
    } else if (this.activeTool === 'measure') {
      this.finishDrawing();
    }
  }

  updateActiveDrawing(currentWx, currentWy) {
    const tempPoints = [...this.drawingPoints, { x: currentWx, y: currentWy }];
    const totalDist = calculatePolylineLength(tempPoints);
    const totalArea = this.activeTool === 'region' || this.activeTool === 'measure' ? calculatePolygonArea(tempPoints) : 0;

    this.app.activeDrawing = {
      type: this.activeTool,
      points: tempPoints,
      totalDist,
      totalArea
    };
  }

  finishDrawing() {
    this.drawingPoints = [];
    this.app.activeDrawing = null;
    this.app.setTool('select');
    this.app.requestRender();
  }

  hitTestObject(wx, wy) {
    const objects = [...(this.app.project.objects || [])].reverse();

    for (const obj of objects) {
      if (obj.visible === false || obj.locked) continue;

      if (obj.type === 'marker') {
        const size = obj.size || 28;
        if (Math.abs(wx - obj.x) < size / 2 && wy >= obj.y - size && wy <= obj.y + 10) {
          return obj;
        }
      } else if (obj.type === 'circle') {
        if (calculateDistance({ x: wx, y: wy }, { x: obj.x, y: obj.y }) <= (obj.radius || 50)) {
          return obj;
        }
      } else if (obj.type === 'region' && obj.points) {
        if (pointInPolygon({ x: wx, y: wy }, obj.points)) {
          return obj;
        }
      } else if (obj.type === 'route' && obj.points) {
        if (pointNearPolyline({ x: wx, y: wy }, obj.points, (obj.width || 4) + 6)) {
          return obj;
        }
      } else if (obj.type === 'label') {
        if (Math.abs(wx - obj.x) < 50 && Math.abs(wy - obj.y) < 20) {
          return obj;
        }
      }
    }
    return null;
  }
}


/* --- MODULE: js/editor/layer-panel.js --- */
/**
 * MapCraft - Layer Management Panel
 * Layer hierarchy with visibility, lock, reorder, and layer assignments.
 */



function renderLayerPanel(container, {
  layers = [],
  activeLayerId,
  objects = [],
  onSelectLayer = null,
  onAddLayer = null,
  onDeleteLayer = null,
  onToggleVisibility = null,
  onToggleLock = null,
  onMoveLayer = null
}) {
  container.innerHTML = `
    <div class="panel-section-header flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-2">
        ${getIcon('layers', 'icon-sm')}
        <span class="text-xs font-bold uppercase text-muted">Map Layers (${layers.length})</span>
      </div>
      <button class="btn btn-xs btn-primary" id="btn-add-map-layer">
        ${getIcon('plus', 'icon-xs')} Add Layer
      </button>
    </div>

    <div class="layers-list-scroll p-2 flex flex-col gap-1">
      ${layers.map((layer, idx) => {
        const isActive = layer.id === activeLayerId;
        const count = objects.filter(o => o.layerId === layer.id).length;

        return `
          <div class="layer-item-row card p-2 flex items-center justify-between ${isActive ? 'active' : ''}" data-id="${layer.id}">
            <div class="flex items-center gap-2 flex-1 cursor-pointer layer-select-target">
              <span class="layer-drag-handle text-muted font-mono text-xs">#${idx + 1}</span>
              <span class="layer-name font-semibold text-xs truncate">${escapeHTML(layer.name)}</span>
              <span class="badge badge-secondary text-xs font-mono">${count}</span>
            </div>

            <div class="layer-actions flex items-center gap-1">
              <button class="btn-icon-xs btn-move-layer-up" data-idx="${idx}" title="Move Up" ${idx === 0 ? 'disabled' : ''}>&uarr;</button>
              <button class="btn-icon-xs btn-move-layer-down" data-idx="${idx}" title="Move Down" ${idx === layers.length - 1 ? 'disabled' : ''}>&darr;</button>
              <button class="btn-icon-xs btn-layer-vis" data-id="${layer.id}" title="Toggle Visibility">
                ${getIcon(layer.visible !== false ? 'eye' : 'eyeOff', 'icon-xs')}
              </button>
              <button class="btn-icon-xs btn-layer-lock" data-id="${layer.id}" title="Toggle Lock">
                ${getIcon(layer.locked ? 'lock' : 'unlock', 'icon-xs')}
              </button>
              ${layers.length > 1 ? `
                <button class="btn-icon-xs text-rose btn-layer-del" data-id="${layer.id}" title="Delete Layer">
                  ${getIcon('trash', 'icon-xs')}
                </button>
              ` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // --- Attach Handlers ---
  container.querySelector('#btn-add-map-layer')?.addEventListener('click', () => {
    const name = prompt('Enter new layer name (e.g. Landmarks, Trade Routes, Hazards):', 'New Layer');
    if (name && name.trim()) {
      if (onAddLayer) onAddLayer(name.trim());
    }
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

  container.querySelectorAll('.btn-move-layer-up').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      if (onMoveLayer) onMoveLayer(idx, -1);
    });
  });

  container.querySelectorAll('.btn-move-layer-down').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      if (onMoveLayer) onMoveLayer(idx, 1);
    });
  });

  container.querySelectorAll('.btn-layer-del').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Delete this layer? Objects on this layer will also be removed.')) {
        if (onDeleteLayer) onDeleteLayer(btn.dataset.id);
      }
    });
  });
}


/* --- MODULE: js/editor/inspector.js --- */
/**
 * MapCraft - Object & Map Properties Inspector
 * Contextual properties editor for markers, routes, regions, labels, and project map settings.
 */





function renderInspector(container, {
  selectedObject,
  project,
  onObjectChange = null,
  onProjectChange = null,
  onDeleteObject = null,
  onDuplicateObject = null,
  onCenterObject = null
}) {
  if (!selectedObject) {
    renderMapSettingsInspector(container, project, onProjectChange);
    return;
  }

  const obj = selectedObject;
  const layers = project.layers || [];

  let geometryStatsHTML = '';
  if (obj.type === 'route' && obj.points) {
    const pxLen = calculatePolylineLength(obj.points);
    const distStr = formatScaledDistance(pxLen, project.scaleRatio || 10, project.scaleUnit || 'km');
    geometryStatsHTML = `
      <div class="stat-badge-row card p-2 mb-2 flex items-center justify-between text-xs">
        <span class="text-muted">Total Distance:</span>
        <span class="font-mono font-bold text-primary">${distStr} (${obj.points.length} waypoints)</span>
      </div>
    `;
  } else if (obj.type === 'region' && obj.points) {
    const pxArea = calculatePolygonArea(obj.points);
    const areaStr = formatScaledArea(pxArea, project.scaleRatio || 10, project.scaleUnit || 'km');
    geometryStatsHTML = `
      <div class="stat-badge-row card p-2 mb-2 flex items-center justify-between text-xs">
        <span class="text-muted">Calculated Area:</span>
        <span class="font-mono font-bold text-emerald">${areaStr} (${obj.points.length} vertices)</span>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="inspector-header p-3 border-b flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="badge badge-primary font-mono text-xs uppercase">${obj.type}</span>
        <input type="text" id="insp-name" class="form-control form-control-sm font-bold text-primary flex-1" value="${escapeHTML(obj.name || '')}" placeholder="Element Name" />
      </div>
    </div>

    <div class="inspector-scroll-body p-3 overflow-y-auto flex-1">
      ${geometryStatsHTML}

      <!-- General & Layer -->
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Layer & Category</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Assigned Layer</label>
          <select id="insp-layer" class="form-control form-control-sm">
            ${layers.map(l => `<option value="${l.id}" ${obj.layerId === l.id ? 'selected' : ''}>${escapeHTML(l.name)}</option>`).join('')}
          </select>
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Category / Tag</label>
          <input type="text" id="insp-category" class="form-control form-control-sm font-mono" value="${escapeHTML(obj.category || '')}" placeholder="city, landmark, quest, nature" />
        </div>
      </div>

      <!-- Specific Type Styling -->
      ${renderTypeSpecificOptions(obj)}

      <!-- Notes & Description -->
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Notes & Lore</div>
        <textarea id="insp-notes" class="form-control form-control-sm font-sans" rows="3" placeholder="Add historical context, travel notes, or location guide details...">${escapeHTML(obj.notes || '')}</textarea>
      </div>

      <!-- Actions -->
      <div class="inspector-actions flex gap-2 border-t pt-3">
        <button class="btn btn-sm btn-secondary flex-1" id="btn-center-obj">
          ${getIcon('compass', 'icon-xs')} Center Map
        </button>
        <button class="btn btn-sm btn-secondary" id="btn-dupe-obj" title="Duplicate">
          ${getIcon('copy', 'icon-xs')}
        </button>
        <button class="btn btn-sm btn-danger" id="btn-del-obj" title="Delete">
          ${getIcon('trash', 'icon-xs')}
        </button>
      </div>
    </div>
  `;

  // --- Attach Handlers ---
  const bind = (id, prop, parser = (v) => v) => {
    container.querySelector('#' + id)?.addEventListener('input', (e) => {
      obj[prop] = parser(e.target.value);
      if (onObjectChange) onObjectChange(obj);
    });
  };

  bind('insp-name', 'name');
  bind('insp-layer', 'layerId');
  bind('insp-category', 'category');
  bind('insp-notes', 'notes');

  // Marker options
  bind('insp-marker-size', 'size', Number);
  bind('insp-marker-color', 'color');
  bind('insp-marker-icon', 'icon');

  // Route options
  bind('insp-route-width', 'width', Number);
  bind('insp-route-color', 'color');
  bind('insp-route-style', 'style');

  // Region options
  bind('insp-fill-color', 'fillColor');
  bind('insp-stroke-color', 'strokeColor');
  bind('insp-region-opacity', 'opacity', Number);

  // Label options
  bind('insp-label-text', 'text');
  bind('insp-font-size', 'fontSize', Number);
  bind('insp-label-color', 'color');
  bind('insp-label-rot', 'rotation', Number);

  container.querySelector('#insp-label-bold')?.addEventListener('change', (e) => {
    obj.isBold = e.target.checked;
    if (onObjectChange) onObjectChange(obj);
  });

  // Action buttons
  container.querySelector('#btn-center-obj')?.addEventListener('click', () => {
    if (onCenterObject) onCenterObject(obj);
  });
  container.querySelector('#btn-dupe-obj')?.addEventListener('click', () => {
    if (onDuplicateObject) onDuplicateObject(obj.id);
  });
  container.querySelector('#btn-del-obj')?.addEventListener('click', () => {
    if (onDeleteObject) onDeleteObject(obj.id);
  });
}

function renderTypeSpecificOptions(obj) {
  if (obj.type === 'marker') {
    return `
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Marker Appearance</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Pin Color</label>
          <input type="color" id="insp-marker-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.color || '#58a6ff'}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Pin Size</label>
          <input type="range" min="16" max="48" id="insp-marker-size" class="form-control form-control-sm" value="${obj.size || 28}" />
        </div>
      </div>
    `;
  }

  if (obj.type === 'route') {
    return `
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Route Styling</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Line Color</label>
          <input type="color" id="insp-route-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.color || '#e63946'}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Line Width</label>
          <input type="range" min="1" max="10" id="insp-route-width" class="form-control form-control-sm" value="${obj.width || 3}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Style</label>
          <select id="insp-route-style" class="form-control form-control-sm">
            <option value="solid" ${obj.style === 'solid' ? 'selected' : ''}>Solid Path</option>
            <option value="dashed" ${obj.style === 'dashed' ? 'selected' : ''}>Dashed Route</option>
            <option value="dotted" ${obj.style === 'dotted' ? 'selected' : ''}>Dotted Trail</option>
          </select>
        </div>
      </div>
    `;
  }

  if (obj.type === 'region' || obj.type === 'circle') {
    return `
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Region Appearance</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Fill Color</label>
          <input type="color" id="insp-fill-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.fillColor || '#58a6ff'}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Stroke Color</label>
          <input type="color" id="insp-stroke-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.strokeColor || obj.fillColor || '#58a6ff'}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Opacity (${Math.round((obj.opacity !== undefined ? obj.opacity : 0.35) * 100)}%)</label>
          <input type="range" min="0.05" max="1" step="0.05" id="insp-region-opacity" class="form-control form-control-sm" value="${obj.opacity !== undefined ? obj.opacity : 0.35}" />
        </div>
      </div>
    `;
  }

  if (obj.type === 'label') {
    return `
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Typography</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Label Text</label>
          <input type="text" id="insp-label-text" class="form-control form-control-sm font-bold" value="${escapeHTML(obj.text || '')}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Font Size</label>
          <input type="number" min="8" max="72" id="insp-font-size" class="form-control form-control-sm" value="${obj.fontSize || 16}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Font Color</label>
          <input type="color" id="insp-label-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.color || '#3b2f2f'}" />
        </div>
        <div class="form-group mb-2">
          <label class="checkbox-label text-xs">
            <input type="checkbox" id="insp-label-bold" ${obj.isBold !== false ? 'checked' : ''} /> Bold Font
          </label>
        </div>
      </div>
    `;
  }

  return '';
}

function renderMapSettingsInspector(container, project, onProjectChange) {
  container.innerHTML = `
    <div class="inspector-header p-3 border-b">
      <span class="badge badge-secondary font-mono text-xs">MAP SETTINGS</span>
    </div>

    <div class="inspector-scroll-body p-3 overflow-y-auto flex-1">
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Map Information</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Project Title</label>
          <input type="text" id="insp-map-title" class="form-control form-control-sm font-bold text-primary" value="${escapeHTML(project.name || 'Untitled Map')}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Cartographic Theme</label>
          <select id="insp-map-theme" class="form-control form-control-sm font-semibold">
            ${Object.values(MAP_THEMES).map(t => `<option value="${t.id}" ${project.themeId === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Scale & Measurement</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Scale Ratio (Real Units per 100px)</label>
          <input type="number" id="insp-scale-ratio" class="form-control form-control-sm" value="${project.scaleRatio || 10}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Scale Unit</label>
          <select id="insp-scale-unit" class="form-control form-control-sm">
            <option value="km" ${project.scaleUnit === 'km' ? 'selected' : ''}>Kilometers (km / km²)</option>
            <option value="mi" ${project.scaleUnit === 'mi' ? 'selected' : ''}>Miles (mi / sq mi)</option>
            <option value="m" ${project.scaleUnit === 'm' ? 'selected' : ''}>Meters (m / m²)</option>
          </select>
        </div>
      </div>

      <div class="p-3 text-xs text-muted">
        Select any marker, route, or region on the map to edit properties.
      </div>
    </div>
  `;

  container.querySelector('#insp-map-title')?.addEventListener('input', (e) => {
    project.name = e.target.value;
    if (onProjectChange) onProjectChange();
  });

  container.querySelector('#insp-map-theme')?.addEventListener('change', (e) => {
    project.themeId = e.target.value;
    if (onProjectChange) onProjectChange();
  });

  container.querySelector('#insp-scale-ratio')?.addEventListener('input', (e) => {
    project.scaleRatio = Number(e.target.value) || 10;
    if (onProjectChange) onProjectChange();
  });

  container.querySelector('#insp-scale-unit')?.addEventListener('change', (e) => {
    project.scaleUnit = e.target.value;
    if (onProjectChange) onProjectChange();
  });
}


/* --- MODULE: js/editor/legend.js --- */
/**
 * MapCraft - Map Legend & Object Search View
 * Dynamic legend generator and real-time element search index.
 */



function renderLegendPanel(container, {
  project,
  onSelectObject = null,
  onCenterObject = null
}) {
  const objects = project.objects || [];

  // Group objects by category
  const categories = {};
  for (const obj of objects) {
    const cat = obj.category || obj.type || 'General';
    if (!categories[cat]) {
      categories[cat] = {
        name: cat,
        items: [],
        color: obj.color || obj.fillColor || '#58a6ff'
      };
    }
    categories[cat].items.push(obj);
  }

  container.innerHTML = `
    <div class="p-3 border-b">
      <!-- Search Input -->
      <div class="search-input-wrapper flex items-center gap-2 card p-1 px-2 mb-3">
        ${getIcon('search', 'icon-xs text-muted')}
        <input type="text" id="map-search-input" class="search-input font-sans text-xs flex-1 bg-transparent border-none outline-none" placeholder="Search markers, routes, regions..." />
        <button class="btn-icon-xs text-muted" id="btn-clear-search" style="display: none;">&times;</button>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase text-muted">Map Legend & Catalog</span>
        <span class="badge badge-secondary text-xs">${objects.length} Total</span>
      </div>
    </div>

    <!-- Scrollable Categories & Items List -->
    <div class="legend-scroll-body p-3 overflow-y-auto flex-1 flex flex-col gap-3" id="legend-items-container">
      ${renderLegendCategories(categories)}
    </div>
  `;

  // Search input handler
  const searchInput = container.querySelector('#map-search-input');
  const clearBtn = container.querySelector('#btn-clear-search');
  const itemsContainer = container.querySelector('#legend-items-container');

  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    clearBtn.style.display = query ? 'inline-flex' : 'none';

    if (!query) {
      itemsContainer.innerHTML = renderLegendCategories(categories);
      attachItemClickHandlers(container, project, onSelectObject, onCenterObject);
      return;
    }

    const filtered = objects.filter(o =>
      (o.name && o.name.toLowerCase().includes(query)) ||
      (o.category && o.category.toLowerCase().includes(query)) ||
      (o.notes && o.notes.toLowerCase().includes(query)) ||
      (o.text && o.text.toLowerCase().includes(query))
    );

    if (filtered.length === 0) {
      itemsContainer.innerHTML = `<div class="text-xs text-muted text-center p-4">No matching map elements found.</div>`;
    } else {
      itemsContainer.innerHTML = `
        <div class="text-xs text-muted mb-1">Found ${filtered.length} results:</div>
        <div class="flex flex-col gap-1">
          ${filtered.map(obj => `
            <div class="card p-2 flex items-center justify-between cursor-pointer search-result-item" data-id="${obj.id}">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full" style="background: ${obj.color || obj.fillColor || '#58a6ff'};"></span>
                <span class="font-semibold text-xs">${escapeHTML(obj.name || obj.text || obj.type)}</span>
              </div>
              <span class="badge badge-secondary text-xs uppercase">${obj.type}</span>
            </div>
          `).join('')}
        </div>
      `;
      attachItemClickHandlers(container, project, onSelectObject, onCenterObject);
    }
  });

  clearBtn?.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    itemsContainer.innerHTML = renderLegendCategories(categories);
    attachItemClickHandlers(container, project, onSelectObject, onCenterObject);
  });

  attachItemClickHandlers(container, project, onSelectObject, onCenterObject);
}

function renderLegendCategories(categories) {
  const keys = Object.keys(categories);
  if (keys.length === 0) {
    return `<div class="text-xs text-muted text-center p-4">Map has no elements yet.</div>`;
  }

  return keys.map(catKey => {
    const cat = categories[catKey];
    return `
      <div class="legend-category-group card p-2">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="legend-color-dot" style="background-color: ${cat.color};"></span>
            <span class="font-bold text-xs uppercase text-primary">${escapeHTML(cat.name)}</span>
          </div>
          <span class="badge badge-secondary text-xs font-mono">${cat.items.length}</span>
        </div>

        <div class="legend-cat-items flex flex-col gap-1">
          ${cat.items.map(obj => `
            <div class="legend-item-row flex items-center justify-between p-1 rounded hover:bg-hover cursor-pointer" data-id="${obj.id}">
              <span class="text-xs text-secondary truncate flex-1">${escapeHTML(obj.name || obj.text || 'Unnamed')}</span>
              <span class="text-muted text-xs font-mono ml-2">${obj.type}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function attachItemClickHandlers(container, project, onSelectObject, onCenterObject) {
  container.querySelectorAll('.search-result-item, .legend-item-row').forEach(row => {
    row.addEventListener('click', () => {
      const objId = row.dataset.id;
      const obj = (project.objects || []).find(o => o.id === objId);
      if (obj) {
        if (onSelectObject) onSelectObject(objId);
        if (onCenterObject) onCenterObject(obj);
      }
    });
  });
}


/* --- MODULE: js/editor/templates.js --- */
/**
 * MapCraft - Pre-Built Cartographic Templates
 * 3 rich demonstration maps for Fantasy RPGs, Travel Planning, and Blueprint Worlds.
 */

const MAP_TEMPLATES = {
  // 1. Realm of Eldoria (Fantasy World Map)
  fantasy: {
    id: 'proj_eldoria',
    name: 'Realm of Eldoria',
    themeId: 'parchment',
    scaleRatio: 25, // 100px = 25 km
    scaleUnit: 'km',
    layers: [
      { id: 'layer_territories', name: 'Kingdoms & Seas', visible: true, locked: false },
      { id: 'layer_routes', name: 'Trade Routes & Trails', visible: true, locked: false },
      { id: 'layer_landmarks', name: 'Castles & Sanctuaries', visible: true, locked: false },
      { id: 'layer_labels', name: 'Geographic Labels', visible: true, locked: false }
    ],
    objects: [
      // Regions
      {
        id: 'reg_whispering_woods',
        name: 'Whispering Woods',
        type: 'region',
        layerId: 'layer_territories',
        category: 'Nature',
        fillColor: '#8a9a5b',
        strokeColor: '#556b2f',
        opacity: 0.35,
        points: [
          { x: 180, y: 140 }, { x: 380, y: 120 }, { x: 440, y: 260 },
          { x: 320, y: 340 }, { x: 160, y: 280 }
        ],
        notes: 'Ancient enchanted forest inhabited by wood elves and dryads.'
      },
      {
        id: 'reg_sunfire_kingdom',
        name: 'Sunfire Kingdom',
        type: 'region',
        layerId: 'layer_territories',
        category: 'Kingdom',
        fillColor: '#d4a373',
        strokeColor: '#bc6c25',
        opacity: 0.3,
        points: [
          { x: 500, y: 180 }, { x: 820, y: 150 }, { x: 880, y: 380 },
          { x: 620, y: 440 }, { x: 480, y: 320 }
        ],
        notes: 'The golden realm ruled by King Cedric III.'
      },
      {
        id: 'reg_sea_storms',
        name: 'Sea of Storms',
        type: 'region',
        layerId: 'layer_territories',
        category: 'Ocean',
        fillColor: '#457b9d',
        strokeColor: '#1d3557',
        opacity: 0.25,
        points: [
          { x: 700, y: 450 }, { x: 1100, y: 420 }, { x: 1150, y: 700 },
          { x: 650, y: 720 }
        ],
        notes: 'Treacherous waters with frequent maelstroms and sea serpent sightings.'
      },

      // Routes
      {
        id: 'route_kings_highway',
        name: "The King's Highway",
        type: 'route',
        layerId: 'layer_routes',
        category: 'Road',
        color: '#8b4513',
        width: 3.5,
        style: 'solid',
        points: [
          { x: 260, y: 220 }, { x: 420, y: 240 }, { x: 580, y: 290 },
          { x: 740, y: 310 }
        ],
        notes: 'Paved imperial road guarded by knightly patrols.'
      },
      {
        id: 'route_silk_trade',
        name: 'Silk Caravan Trail',
        type: 'route',
        layerId: 'layer_routes',
        category: 'Caravan',
        color: '#d97706',
        width: 2.5,
        style: 'dashed',
        points: [
          { x: 740, y: 310 }, { x: 800, y: 420 }, { x: 880, y: 530 }
        ],
        notes: 'Desert trade trail for spices, silk, and magical gems.'
      },

      // Markers
      {
        id: 'm_eldor_castle',
        name: 'High Castle of Eldor',
        type: 'marker',
        layerId: 'layer_landmarks',
        category: 'Castle',
        icon: 'castle',
        color: '#7f1d1d',
        size: 32,
        x: 740,
        y: 310,
        notes: 'Capital citadel of the realm perched upon white limestone cliffs.'
      },
      {
        id: 'm_dragon_peak',
        name: 'Mount Wyvern',
        type: 'marker',
        layerId: 'layer_landmarks',
        category: 'Mountain',
        icon: 'mountain',
        color: '#475569',
        size: 30,
        x: 380,
        y: 120,
        notes: 'Snow-capped volcano rumored to house the slumbering fire drake.'
      },
      {
        id: 'm_port_kraken',
        name: 'Port Kraken',
        type: 'marker',
        layerId: 'layer_landmarks',
        category: 'Harbor',
        icon: 'anchor',
        color: '#0284c7',
        size: 28,
        x: 880,
        y: 530,
        notes: 'Bustling maritime trade haven with pirate taverns and shipyard docks.'
      },
      {
        id: 'm_druid_shrine',
        name: 'Moonstone Sanctuary',
        type: 'marker',
        layerId: 'layer_landmarks',
        category: 'Sanctuary',
        icon: 'camp',
        color: '#16a34a',
        size: 26,
        x: 260,
        y: 220,
        notes: 'Sacred grove where druids gather beneath the full moon.'
      },

      // Labels
      {
        id: 'lbl_continent',
        name: 'Continent Label',
        type: 'label',
        layerId: 'layer_labels',
        text: 'NORTHERN ELDORIA',
        fontSize: 22,
        color: '#5c4033',
        x: 540,
        y: 80,
        isBold: true
      }
    ]
  },

  // 2. Tokyo Travel Planner (Modern Travel Guide Map)
  travel: {
    id: 'proj_tokyo',
    name: 'Tokyo Travel Planner',
    themeId: 'clean',
    scaleRatio: 2, // 100px = 2 km
    scaleUnit: 'km',
    layers: [
      { id: 'layer_districts', name: 'City Districts', visible: true, locked: false },
      { id: 'layer_transit', name: 'Subway & Walkways', visible: true, locked: false },
      { id: 'layer_spots', name: 'Food & Attractions', visible: true, locked: false }
    ],
    objects: [
      {
        id: 'reg_shinjuku',
        name: 'Shinjuku District',
        type: 'region',
        layerId: 'layer_districts',
        category: 'District',
        fillColor: '#bfdbfe',
        strokeColor: '#3b82f6',
        opacity: 0.35,
        points: [
          { x: 220, y: 260 }, { x: 420, y: 220 }, { x: 460, y: 440 }, { x: 250, y: 480 }
        ],
        notes: 'Skyscrapers, shopping malls, and vibrant nightlife.'
      },
      {
        id: 'reg_shibuya',
        name: 'Shibuya & Harajuku',
        type: 'region',
        layerId: 'layer_districts',
        category: 'District',
        fillColor: '#fecdd3',
        strokeColor: '#f43f5e',
        opacity: 0.35,
        points: [
          { x: 260, y: 520 }, { x: 480, y: 470 }, { x: 510, y: 680 }, { x: 290, y: 700 }
        ],
        notes: 'Youth fashion culture and famous scramble crossing.'
      },
      // Transit Route
      {
        id: 'route_yamanote',
        name: 'JR Yamanote Line Loop',
        type: 'route',
        layerId: 'layer_transit',
        category: 'Transit',
        color: '#16a34a',
        width: 4,
        style: 'solid',
        points: [
          { x: 330, y: 340 }, { x: 370, y: 560 }, { x: 620, y: 640 }, { x: 740, y: 420 }, { x: 680, y: 220 }, { x: 330, y: 340 }
        ],
        notes: 'Famous circular railway line serving major Tokyo hubs.'
      },
      // Markers
      {
        id: 'm_shibuya_cross',
        name: 'Shibuya Scramble Crossing',
        type: 'marker',
        layerId: 'layer_spots',
        category: 'Attraction',
        icon: 'landmark',
        color: '#e11d48',
        size: 30,
        x: 370,
        y: 560,
        notes: 'World busiest pedestrian crossing in front of Shibuya Station.'
      },
      {
        id: 'm_ramen_street',
        name: 'Ichiran Ramen Shinjuku',
        type: 'marker',
        layerId: 'layer_spots',
        category: 'Dining',
        icon: 'food',
        color: '#d97706',
        size: 26,
        x: 330,
        y: 340,
        notes: 'Must-visit tonkotsu ramen with private dining booths.'
      },
      {
        id: 'm_skytree',
        name: 'Tokyo Skytree Tower',
        type: 'marker',
        layerId: 'layer_spots',
        category: 'Attraction',
        icon: 'landmark',
        color: '#0284c7',
        size: 32,
        x: 740,
        y: 300,
        notes: '634-meter observation tower with panoramic city skyline views.'
      }
    ]
  },

  // 3. Sci-Fi Lunar Colony Beta (Blueprint Map)
  blueprint: {
    id: 'proj_lunar_base',
    name: 'Lunar Colony Beta',
    themeId: 'blueprint',
    scaleRatio: 100, // 100px = 100 meters
    scaleUnit: 'm',
    layers: [
      { id: 'layer_sectors', name: 'Base Sectors', visible: true, locked: false },
      { id: 'layer_pipelines', name: 'Oxygen & Power Grid', visible: true, locked: false },
      { id: 'layer_installations', name: 'Facilities & Domes', visible: true, locked: false }
    ],
    objects: [
      {
        id: 'circ_dome_alpha',
        name: 'Habitat Dome Alpha',
        type: 'circle',
        layerId: 'layer_sectors',
        category: 'Habitat',
        fillColor: '#0077b6',
        strokeColor: '#64dfdf',
        radius: 90,
        x: 400,
        y: 350,
        opacity: 0.4,
        notes: 'Pressurized bio-dome supporting 250 permanent lunar colonists.'
      },
      {
        id: 'route_oxygen_grid',
        name: 'Main Oxygen Supply Line',
        type: 'route',
        layerId: 'layer_pipelines',
        category: 'Infrastructure',
        color: '#64dfdf',
        width: 3.5,
        style: 'dashed',
        points: [
          { x: 400, y: 350 }, { x: 620, y: 350 }, { x: 780, y: 220 }
        ],
        notes: 'Cryogenic liquid oxygen pipeline from subterranean ice extraction.'
      },
      {
        id: 'm_landing_pad',
        name: 'Heavy Shuttle Landing Pad 1',
        type: 'marker',
        layerId: 'layer_installations',
        category: 'Transport',
        icon: 'anchor',
        color: '#48cae4',
        size: 30,
        x: 780,
        y: 220,
        notes: 'Reinforced launch/landing pad for Earth-Moon cargo shuttles.'
      }
    ]
  }
};


/* --- MODULE: js/app.js --- */
/**
 * MapCraft - Master Cartography Workstation Orchestrator
 * Integrates Canvas 2D Renderer, Tools, Layer System, Inspector, Legend, and Persistence.
 */










class MapCraftApp {
  constructor() {
    this.canvas = document.getElementById('map-canvas');
    this.renderer = new MapRenderer(this.canvas);
    this.interaction = new MapInteraction(this.canvas, this);

    // Active project state
    this.project = JSON.parse(JSON.stringify(MAP_TEMPLATES.fantasy));
    this.activeLayerId = this.project.layers[0]?.id || 'layer_default';
    this.selectedObjectId = null;
    this.selectedObject = null;
    this.hoveredObjectId = null;
    this.activeDrawing = null;

    // UI state
    this.activeSidebarTab = 'layers'; // layers, legend
    this.showGrid = true;
    this.showCompass = true;
    this.showScaleRuler = true;

    // History stack (Undo / Redo)
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 30;
  }

  async init() {
    await db.init();

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // Load saved project if exists
    const lastId = localStorage.getItem('mapcraft_last_project_id');
    if (lastId) {
      const saved = await db.loadProject(lastId);
      if (saved && saved.layers && saved.layers.length > 0) {
        this.project = saved;
        this.activeLayerId = this.project.layers[0]?.id || 'layer_default';
      }
    }

    this.setupToolbar();
    this.setupShortcuts();
    this.renderAll();
    this.centerContent();
  }

  handleResize() {
    const container = document.getElementById('map-viewport-container');
    if (container && this.canvas) {
      this.renderer.resize(container.clientWidth, container.clientHeight);
      this.requestRender();
    }
  }

  requestRender() {
    this.renderer.render({
      project: this.project,
      activeLayerId: this.activeLayerId,
      selectedObjectId: this.selectedObjectId,
      hoveredObjectId: this.hoveredObjectId,
      activeDrawing: this.activeDrawing,
      scaleRatio: this.project.scaleRatio || 10,
      scaleUnit: this.project.scaleUnit || 'km',
      themeId: this.project.themeId || 'parchment',
      showGrid: this.showGrid,
      showCompass: this.showCompass,
      showScaleRuler: this.showScaleRuler
    });
  }

  renderAll() {
    this.renderSidebar();
    this.renderInspector();
    this.updateZoomLabel();
    this.updateStats();
    this.requestRender();
  }

  // --- Toolbar Setup ---
  setupToolbar() {
    // Tool buttons
    const toolBtns = document.querySelectorAll('.btn-map-tool');
    toolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;
        this.setTool(tool);
      });
    });

    // Theme selector
    const themeSelect = document.getElementById('select-map-theme');
    if (themeSelect) {
      themeSelect.value = this.project.themeId || 'parchment';
      themeSelect.addEventListener('change', (e) => {
        this.project.themeId = e.target.value;
        this.renderAll();
        this.autoSave();
      });
    }

    // Template selector
    document.getElementById('select-map-template')?.addEventListener('change', (e) => {
      const key = e.target.value;
      if (MAP_TEMPLATES[key]) {
        if (confirm(`Load template "${MAP_TEMPLATES[key].name}"? Unsaved changes in current map will be replaced.`)) {
          this.loadProject(JSON.parse(JSON.stringify(MAP_TEMPLATES[key])));
        }
      }
    });

    // Undo / Redo
    document.getElementById('btn-undo')?.addEventListener('click', () => this.undo());
    document.getElementById('btn-redo')?.addEventListener('click', () => this.redo());

    // Zoom buttons
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
      this.renderer.camera.zoom = Math.min(10, this.renderer.camera.zoom * 1.25);
      this.requestRender();
      this.updateZoomLabel();
    });
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
      this.renderer.camera.zoom = Math.max(0.1, this.renderer.camera.zoom * 0.8);
      this.requestRender();
      this.updateZoomLabel();
    });
    document.getElementById('btn-zoom-reset')?.addEventListener('click', () => {
      this.renderer.camera.zoom = 1;
      this.requestRender();
      this.updateZoomLabel();
    });
    document.getElementById('btn-fit-content')?.addEventListener('click', () => this.centerContent());

    // Grid toggle
    const gridBtn = document.getElementById('btn-toggle-grid');
    gridBtn?.addEventListener('click', () => {
      this.showGrid = !this.showGrid;
      gridBtn.classList.toggle('active', this.showGrid);
      this.requestRender();
    });

    // Export PNG Image
    document.getElementById('btn-export-png')?.addEventListener('click', () => this.exportPNG());

    // Export JSON
    document.getElementById('btn-export-json')?.addEventListener('click', () => {
      const json = JSON.stringify(this.project, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (this.project.name || 'map').toLowerCase().replace(/\s+/g, '_') + '.mapcraft.json';
      a.click();
    });

    // Import JSON
    const importInput = document.getElementById('file-import-map');
    document.getElementById('btn-import-json')?.addEventListener('click', () => importInput?.click());
    importInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (parsed && parsed.layers && Array.isArray(parsed.objects)) {
            this.loadProject(parsed);
          } else {
            alert('Invalid MapCraft project structure.');
          }
        } catch (err) {
          alert('Failed to parse map JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    });

    // Print Map
    document.getElementById('btn-print-map')?.addEventListener('click', () => {
      window.print();
    });
  }

  setTool(toolName) {
    this.interaction.activeTool = toolName;
    document.querySelectorAll('.btn-map-tool').forEach(b => {
      b.classList.toggle('active', b.dataset.tool === toolName);
    });
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      // Escape -> Cancel selection / drawing
      if (e.key === 'Escape') {
        this.selectObject(null);
        this.interaction.finishDrawing();
      }

      // Delete -> Delete selected object
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (this.selectedObjectId) {
          this.deleteObject(this.selectedObjectId);
        }
      }

      // Ctrl+Z / Ctrl+Y -> Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        this.redo();
      }

      // Tool shortcuts: V = Select, H = Hand, M = Marker, R = Route, P = Polygon, C = Circle, T = Label
      if (e.key === 'v' || e.key === 'V') this.setTool('select');
      if (e.key === 'h' || e.key === 'H') this.setTool('hand');
      if (e.key === 'm' || e.key === 'M') this.setTool('marker');
      if (e.key === 'r' || e.key === 'R') this.setTool('route');
      if (e.key === 'p' || e.key === 'P') this.setTool('region');
      if (e.key === 'c' || e.key === 'C') this.setTool('circle');
      if (e.key === 't' || e.key === 'T') this.setTool('label');
    });
  }

  // --- Object Creation Actions ---
  createMarkerAt(wx, wy) {
    this.recordHistory('Add Marker');
    const marker = {
      id: 'm_' + Date.now(),
      name: 'New Marker ' + (this.project.objects.length + 1),
      type: 'marker',
      layerId: this.activeLayerId,
      category: 'Landmark',
      icon: 'pin',
      color: '#58a6ff',
      size: 28,
      x: wx,
      y: wy,
      notes: ''
    };
    this.project.objects.push(marker);
    this.selectObject(marker.id);
    this.renderAll();
    this.autoSave();
  }

  createRoute(points) {
    this.recordHistory('Add Route');
    const route = {
      id: 'route_' + Date.now(),
      name: 'New Route ' + (this.project.objects.length + 1),
      type: 'route',
      layerId: this.activeLayerId,
      category: 'Trail',
      color: '#e63946',
      width: 3,
      style: 'solid',
      points: JSON.parse(JSON.stringify(points)),
      notes: ''
    };
    this.project.objects.push(route);
    this.selectObject(route.id);
    this.renderAll();
    this.autoSave();
  }

  createRegion(points) {
    this.recordHistory('Add Region');
    const region = {
      id: 'reg_' + Date.now(),
      name: 'New Region ' + (this.project.objects.length + 1),
      type: 'region',
      layerId: this.activeLayerId,
      category: 'Territory',
      fillColor: '#58a6ff',
      strokeColor: '#388bfd',
      opacity: 0.35,
      points: JSON.parse(JSON.stringify(points)),
      notes: ''
    };
    this.project.objects.push(region);
    this.selectObject(region.id);
    this.renderAll();
    this.autoSave();
  }

  createCircle(x, y, radius) {
    this.recordHistory('Add Circle');
    const circle = {
      id: 'circ_' + Date.now(),
      name: 'Zone ' + (this.project.objects.length + 1),
      type: 'circle',
      layerId: this.activeLayerId,
      category: 'Zone',
      fillColor: '#58a6ff',
      strokeColor: '#388bfd',
      radius,
      x,
      y,
      opacity: 0.35,
      notes: ''
    };
    this.project.objects.push(circle);
    this.selectObject(circle.id);
    this.renderAll();
    this.autoSave();
  }

  createLabelAt(wx, wy) {
    this.recordHistory('Add Label');
    const label = {
      id: 'lbl_' + Date.now(),
      name: 'Text Label',
      type: 'label',
      layerId: this.activeLayerId,
      text: 'Label',
      fontSize: 16,
      color: '#3b2f2f',
      x: wx,
      y: wy,
      isBold: true
    };
    this.project.objects.push(label);
    this.selectObject(label.id);
    this.renderAll();
    this.autoSave();
  }

  selectObject(id) {
    this.selectedObjectId = id;
    this.selectedObject = id ? this.project.objects.find(o => o.id === id) || null : null;
    this.renderInspector();
    this.requestRender();
  }

  deleteObject(id) {
    this.recordHistory('Delete Object');
    const idx = this.project.objects.findIndex(o => o.id === id);
    if (idx !== -1) {
      this.project.objects.splice(idx, 1);
      this.selectObject(null);
      this.renderAll();
      this.autoSave();
    }
  }

  duplicateObject(id) {
    const obj = this.project.objects.find(o => o.id === id);
    if (!obj) return;

    this.recordHistory('Duplicate Object');
    const clone = JSON.parse(JSON.stringify(obj));
    clone.id = obj.type.slice(0, 3) + '_' + Date.now();
    clone.name = (obj.name || 'Object') + ' (Copy)';

    if (clone.points) {
      clone.points.forEach(p => { p.x += 30; p.y += 30; });
    } else {
      clone.x = (clone.x || 0) + 30;
      clone.y = (clone.y || 0) + 30;
    }

    this.project.objects.push(clone);
    this.selectObject(clone.id);
    this.renderAll();
    this.autoSave();
  }

  centerOnObject(obj) {
    let targetX = obj.x || 0;
    let targetY = obj.y || 0;

    if (obj.points && obj.points.length > 0) {
      let sx = 0, sy = 0;
      obj.points.forEach(p => { sx += p.x; sy += p.y; });
      targetX = sx / obj.points.length;
      targetY = sy / obj.points.length;
    }

    const cw = this.canvas.width;
    const ch = this.canvas.height;
    this.renderer.camera.x = cw / 2 - targetX * this.renderer.camera.zoom;
    this.renderer.camera.y = ch / 2 - targetY * this.renderer.camera.zoom;
    this.requestRender();
  }

  centerContent() {
    const objects = this.project.objects || [];
    if (objects.length === 0) {
      this.renderer.camera.x = 100;
      this.renderer.camera.y = 100;
      this.renderer.camera.zoom = 1;
      this.requestRender();
      this.updateZoomLabel();
      return;
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const obj of objects) {
      if (obj.points) {
        obj.points.forEach(p => {
          minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
          minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
        });
      } else if (obj.x !== undefined && obj.y !== undefined) {
        const r = obj.radius || obj.size || 20;
        minX = Math.min(minX, obj.x - r); maxX = Math.max(maxX, obj.x + r);
        minY = Math.min(minY, obj.y - r); maxY = Math.max(maxY, obj.y + r);
      }
    }

    const pad = 80;
    const contentW = (maxX - minX) + pad * 2;
    const contentH = (maxY - minY) + pad * 2;
    const cw = this.canvas.width;
    const ch = this.canvas.height;

    const zoom = Math.min(2.5, Math.max(0.2, Math.min(cw / contentW, ch / contentH)));
    this.renderer.camera.zoom = zoom;
    this.renderer.camera.x = cw / 2 - ((minX + maxX) / 2) * zoom;
    this.renderer.camera.y = ch / 2 - ((minY + maxY) / 2) * zoom;

    this.requestRender();
    this.updateZoomLabel();
  }

  // --- Sidebar & Panels ---
  renderSidebar() {
    const container = document.getElementById('sidebar-panel-container');
    if (!container) return;

    if (this.activeSidebarTab === 'layers') {
      renderLayerPanel(container, {
        layers: this.project.layers || [],
        activeLayerId: this.activeLayerId,
        objects: this.project.objects || [],
        onSelectLayer: (id) => {
          this.activeLayerId = id;
          this.renderSidebar();
        },
        onAddLayer: (name) => {
          this.recordHistory('Add Layer');
          const newLayer = { id: 'layer_' + Date.now(), name, visible: true, locked: false };
          this.project.layers.push(newLayer);
          this.activeLayerId = newLayer.id;
          this.renderSidebar();
          this.autoSave();
        },
        onDeleteLayer: (id) => {
          this.recordHistory('Delete Layer');
          this.project.layers = this.project.layers.filter(l => l.id !== id);
          this.project.objects = this.project.objects.filter(o => o.layerId !== id);
          this.activeLayerId = this.project.layers[0]?.id || 'default';
          this.renderAll();
          this.autoSave();
        },
        onToggleVisibility: (id) => {
          const l = this.project.layers.find(x => x.id === id);
          if (l) { l.visible = l.visible === false ? true : false; this.renderAll(); }
        },
        onToggleLock: (id) => {
          const l = this.project.layers.find(x => x.id === id);
          if (l) { l.locked = !l.locked; this.renderSidebar(); }
        },
        onMoveLayer: (idx, dir) => {
          const target = idx + dir;
          if (target >= 0 && target < this.project.layers.length) {
            const temp = this.project.layers[idx];
            this.project.layers[idx] = this.project.layers[target];
            this.project.layers[target] = temp;
            this.renderAll();
            this.autoSave();
          }
        }
      });
    } else {
      renderLegendPanel(container, {
        project: this.project,
        onSelectObject: (id) => this.selectObject(id),
        onCenterObject: (obj) => this.centerOnObject(obj)
      });
    }
  }

  renderInspector() {
    const container = document.getElementById('inspector-panel-container');
    if (!container) return;

    renderInspector(container, {
      selectedObject: this.selectedObject,
      project: this.project,
      onObjectChange: () => {
        this.requestRender();
        this.autoSave();
      },
      onProjectChange: () => {
        this.renderAll();
        this.autoSave();
      },
      onDeleteObject: (id) => this.deleteObject(id),
      onDuplicateObject: (id) => this.duplicateObject(id),
      onCenterObject: (obj) => this.centerOnObject(obj)
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
    const previous = JSON.parse(this.undoStack.pop());
    this.project = previous;
    this.selectObject(null);
    this.renderAll();
    this.updateUndoRedoUI();
    this.autoSave();
  }

  redo() {
    if (this.redoStack.length === 0) return;
    this.undoStack.push(JSON.stringify(this.project));
    const next = JSON.parse(this.redoStack.pop());
    this.project = next;
    this.selectObject(null);
    this.renderAll();
    this.updateUndoRedoUI();
    this.autoSave();
  }

  updateUndoRedoUI() {
    const uBtn = document.getElementById('btn-undo');
    const rBtn = document.getElementById('btn-redo');
    if (uBtn) uBtn.disabled = this.undoStack.length === 0;
    if (rBtn) rBtn.disabled = this.redoStack.length === 0;
  }

  // --- Export PNG ---
  exportPNG() {
    const url = this.canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.project.name || 'map').toLowerCase().replace(/\s+/g, '_') + '.png';
    a.click();
  }

  loadProject(projectData) {
    this.project = projectData;
    this.activeLayerId = this.project.layers[0]?.id || 'layer_default';
    this.selectObject(null);
    this.undoStack = [];
    this.redoStack = [];
    this.renderAll();
    this.centerContent();
    this.autoSave();
  }

  autoSave() {
    db.saveProject(this.project);
    this.updateStats();
  }

  updateZoomLabel() {
    const zLabel = document.getElementById('zoom-percentage-label');
    if (zLabel) {
      zLabel.textContent = Math.round(this.renderer.camera.zoom * 100) + '%';
    }
  }

  updateCoordinates(wx, wy) {
    const coordEl = document.getElementById('map-coordinates-readout');
    if (coordEl) {
      coordEl.textContent = `X: ${wx}, Y: ${wy}`;
    }
  }

  updateStats() {
    const statsEl = document.getElementById('map-stats-readout');
    if (statsEl) {
      const objCount = (this.project.objects || []).length;
      const layerCount = (this.project.layers || []).length;
      statsEl.innerHTML = `Elements: <strong>${objCount}</strong> &bull; Layers: <strong>${layerCount}</strong>`;
    }
  }
}

// Bootstrap
function startMapCraft() {
  const app = new MapCraftApp();
  window.mapCraftApp = app;
  app.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startMapCraft);
} else {
  startMapCraft();
}


})();
