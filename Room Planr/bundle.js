/**
 * RoomPlanr - Standalone Architectural Room Planning & 3D Layout Workstation Bundle
 * 100% Client-Side Spatial Engine, Zero Server Backend, Works on HTTP & file:///
 */

(function() {
'use strict';


/* --- MODULE: js/core/icons.js --- */
/**
 * RoomPlanr - Local SVG Icons Registry
 * Crisp architectural planning, furniture, CAD tools, 2D/3D mode, and viewer icons.
 */

const ICONS = {
  room: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>`,
  sofa: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 13v6a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-6"></path><path d="M5 13V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v5"></path><path d="M2 13h20"></path><path d="M6 20v2"></path><path d="M18 20v2"></path></svg>`,
  bed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path><path d="M2 17h20"></path><path d="M6 8v9"></path></svg>`,
  desk: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="4" rx="1"></rect><path d="M5 9v11"></path><path d="M19 9v11"></path><path d="M14 9v7h5"></path></svg>`,
  chair: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11h10a2 2 0 0 1 2 2v2H5v-2a2 2 0 0 1 2-2Z"></path><path d="M19 15v5"></path><path d="M5 15v5"></path><path d="M8 11V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v7"></path></svg>`,
  table: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="3" rx="1"></rect><path d="M6 9v11"></path><path d="M18 9v11"></path></svg>`,
  door: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16"></path><path d="M2 20h20"></path><circle cx="14" cy="12" r="1"></circle></svg>`,
  window: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="12" x2="21" y2="12"></line><line x1="12" y1="3" x2="12" y2="21"></line></svg>`,
  lamp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2h8l3 7H5L8 2Z"></path><path d="M12 9v9"></path><path d="M8 22h8"></path></svg>`,
  plant: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 19h10l-1 3H8l-1-3Z"></path><path d="M12 19V10"></path><path d="M12 10a5 5 0 0 0-5-5c0 4 5 5 5 5Z"></path><path d="M12 10a5 5 0 0 1 5-5c0 4-5 5-5 5Z"></path></svg>`,
  bath: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h6a2 2 0 0 1 2 2v1H7V8a2 2 0 0 1 2-2Z"></path><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1Z"></path><line x1="6" y1="20" x2="6" y2="22"></line><line x1="18" y1="20" x2="18" y2="22"></line></svg>`,
  measure: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="21" x2="21" y2="3"></line><path d="M14 6l3 3"></path><path d="M10 10l3 3"></path><path d="M6 14l3 3"></path></svg>`,
  rotate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`,
  view2D: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`,
  view3D: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
  unlock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
  help: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  print: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  bom: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`,
  center: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line></svg>`,
  undo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>`,
  redo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`,
  palette: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>`
};

function getIcon(name, extraClass = '') {
  const svg = ICONS[name] || ICONS.room;
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


/* --- MODULE: js/core/units.js --- */
/**
 * RoomPlanr - Unit Measurement & Spatial Coordinate Engine
 * Real-world unit conversion (m, cm, mm, ft/in), area calculation, grid snapping, and currency formatting.
 */

const UNITS = {
  METERS: 'm',
  CENTIMETERS: 'cm',
  MILLIMETERS: 'mm',
  FEET_INCHES: 'ft'
};

const CURRENCIES = {
  USD: { symbol: '$', code: 'USD', name: 'US Dollar ($)' },
  EUR: { symbol: '€', code: 'EUR', name: 'Euro (€)' },
  GBP: { symbol: '£', code: 'GBP', name: 'British Pound (£)' },
  JPY: { symbol: '¥', code: 'JPY', name: 'Japanese Yen (¥)' }
};

/**
 * Format real-world meter value into target unit string
 */
function formatDimension(meters, unit = UNITS.METERS) {
  if (meters === null || meters === undefined || isNaN(meters)) return '0.00 m';

  if (unit === UNITS.CENTIMETERS) {
    return `${Math.round(meters * 100)} cm`;
  }

  if (unit === UNITS.MILLIMETERS) {
    return `${Math.round(meters * 1000)} mm`;
  }

  if (unit === UNITS.FEET_INCHES) {
    const totalInches = meters * 39.3700787;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    if (inches === 12) {
      return `${feet + 1}′ 0″`;
    }
    return `${feet}′ ${inches}″`;
  }

  return `${Number(meters).toFixed(2)} m`;
}

/**
 * Format floor area into square meters or square feet
 */
function formatArea(squareMeters, unit = UNITS.METERS) {
  if (squareMeters === null || squareMeters === undefined || isNaN(squareMeters)) return '0.0 m²';

  if (unit === UNITS.FEET_INCHES) {
    const sqFt = squareMeters * 10.7639;
    return `${sqFt.toFixed(1)} sq ft`;
  }

  return `${Number(squareMeters).toFixed(1)} m²`;
}

/**
 * Convert user input string into meters
 */
function parseToMeters(valueStr, unit = UNITS.METERS) {
  if (!valueStr) return 0;
  const num = parseFloat(valueStr);
  if (isNaN(num)) return 0;

  if (unit === UNITS.CENTIMETERS) {
    return num / 100;
  }

  if (unit === UNITS.MILLIMETERS) {
    return num / 1000;
  }

  if (unit === UNITS.FEET_INCHES) {
    // Treat plain numeric input as feet
    return num * 0.3048;
  }

  return num;
}

/**
 * Snap coordinate to grid increment in meters
 */
function snapToGrid(value, gridStepMeters = 0.1) {
  if (!gridStepMeters || gridStepMeters <= 0) return value;
  const snapped = Math.round(value / gridStepMeters) * gridStepMeters;
  return parseFloat(snapped.toFixed(4));
}

/**
 * Snap angle to nearest increment (e.g. 15 or 45 degrees)
 */
function snapAngle(degrees, step = 45) {
  if (!step || step <= 0) return degrees;
  return Math.round(degrees / step) * step;
}

/**
 * Format price for Bill of Materials takeoff
 */
function formatPrice(amount, currencyCode = 'USD') {
  const cur = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const formatted = Number(amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  return `${cur.symbol}${formatted}`;
}


/* --- MODULE: js/engine/catalog.js --- */
/**
 * RoomPlanr - Architectural Furniture & Fixtures Catalog
 * 40+ architectural items with real-world dimensions, CAD 2D rendering hints, materials, and pricing.
 */

const FURNITURE_CATALOG = [
  // --- Living / Sofas & Seating ---
  {
    type: 'sofa_3seat',
    name: '3-Seater Tailored Sofa',
    category: 'Living',
    width: 2.20,
    depth: 0.95,
    height: 0.85,
    color: '#3b4252',
    material: 'Belgian Bouclé Charcoal',
    price: 2450,
    sku: 'SOF-3S-CHR',
    icon: 'sofa'
  },
  {
    type: 'sofa_lshape',
    name: 'L-Sectional Chaise Sofa',
    category: 'Living',
    width: 2.80,
    depth: 1.80,
    height: 0.85,
    color: '#2e3440',
    material: 'Performance Slate Linen',
    price: 3850,
    sku: 'SOF-SEC-SLT',
    icon: 'sofa'
  },
  {
    type: 'armchair',
    name: 'Mid-Century Lounge Armchair',
    category: 'Living',
    width: 0.85,
    depth: 0.85,
    height: 0.80,
    color: '#0284c7',
    material: 'Cognac Saddle Leather',
    price: 1250,
    sku: 'ARM-MC-CGN',
    icon: 'chair'
  },
  {
    type: 'club_chair',
    name: 'Sculptural Club Chair',
    category: 'Living',
    width: 0.90,
    depth: 0.85,
    height: 0.78,
    color: '#0f766e',
    material: 'Forest Green Mohair',
    price: 980,
    sku: 'CHR-CLB-FST',
    icon: 'chair'
  },
  {
    type: 'coffee_table',
    name: 'Solid Walnut Coffee Table',
    category: 'Living',
    width: 1.30,
    depth: 0.65,
    height: 0.42,
    color: '#78350f',
    material: 'Solid American Walnut',
    price: 850,
    sku: 'TBL-COF-WAL',
    icon: 'table'
  },
  {
    type: 'tv_unit',
    name: 'Lowline Media Credenza',
    category: 'Living',
    width: 2.00,
    depth: 0.45,
    height: 0.50,
    color: '#1e293b',
    material: 'Matte Obsidian Ash',
    price: 1400,
    sku: 'CRD-MED-OBS',
    icon: 'table'
  },
  {
    type: 'rug_large',
    name: 'Large Hand-Tufted Area Rug',
    category: 'Living',
    width: 3.00,
    depth: 2.00,
    height: 0.02,
    color: '#cbd5e1',
    material: 'Organic New Zealand Wool',
    price: 1150,
    sku: 'RUG-WOOL-NZ',
    icon: 'room'
  },
  {
    type: 'side_table',
    name: 'Fluted Pedestal Side Table',
    category: 'Living',
    width: 0.50,
    depth: 0.50,
    height: 0.55,
    color: '#d97706',
    material: 'Honed Roman Travertine',
    price: 420,
    sku: 'TBL-SIDE-TRV',
    icon: 'table'
  },

  // --- Bedroom / Beds & Storage ---
  {
    type: 'bed_king',
    name: 'King Size Platform Bed',
    category: 'Bedroom',
    width: 2.05,
    depth: 2.15,
    height: 1.10,
    color: '#475569',
    material: 'Upholstered Warm Sand',
    price: 2800,
    sku: 'BED-KNG-SND',
    icon: 'bed'
  },
  {
    type: 'bed_queen',
    name: 'Queen Size Upholstered Bed',
    category: 'Bedroom',
    width: 1.65,
    depth: 2.10,
    height: 1.05,
    color: '#334155',
    material: 'Heather Gray Wool Blend',
    price: 2200,
    sku: 'BED-QEN-HGR',
    icon: 'bed'
  },
  {
    type: 'bed_single',
    name: 'Single Twin Daybed',
    category: 'Bedroom',
    width: 1.05,
    depth: 2.00,
    height: 0.85,
    color: '#0369a1',
    material: 'Washed Indigo Linen',
    price: 1150,
    sku: 'BED-TWN-IND',
    icon: 'bed'
  },
  {
    type: 'nightstand',
    name: 'Bedside Nightstand',
    category: 'Bedroom',
    width: 0.55,
    depth: 0.45,
    height: 0.55,
    color: '#b45309',
    material: 'Solid French Oak',
    price: 450,
    sku: 'STN-BED-OAK',
    icon: 'table'
  },
  {
    type: 'wardrobe',
    name: 'Double Wardrobe Armoire',
    category: 'Bedroom',
    width: 1.80,
    depth: 0.60,
    height: 2.20,
    color: '#1e293b',
    material: 'Matte Charcoal & Satin Brass',
    price: 2600,
    sku: 'WRD-ARM-MAT',
    icon: 'room'
  },
  {
    type: 'dresser',
    name: '6-Drawer Low Dresser',
    category: 'Bedroom',
    width: 1.60,
    depth: 0.50,
    height: 0.85,
    color: '#78350f',
    material: 'Smoked Walnut Finish',
    price: 1850,
    sku: 'DRS-6DR-WAL',
    icon: 'table'
  },
  {
    type: 'mirror_full',
    name: 'Full-Length Floor Mirror',
    category: 'Bedroom',
    width: 0.70,
    depth: 0.15,
    height: 1.90,
    color: '#64748b',
    material: 'Bronzed Aluminum Frame',
    price: 620,
    sku: 'MIR-FLR-BRZ',
    icon: 'window'
  },

  // --- Work / Office ---
  {
    type: 'desk_exec',
    name: 'Executive Workstation Desk',
    category: 'Office',
    width: 1.80,
    depth: 0.85,
    height: 0.75,
    color: '#78350f',
    material: 'Solid American Walnut',
    price: 2100,
    sku: 'DSK-EXC-WAL',
    icon: 'desk'
  },
  {
    type: 'desk_standing',
    name: 'Motorized Sit-Stand Desk',
    category: 'Office',
    width: 1.50,
    depth: 0.75,
    height: 0.75,
    color: '#0f172a',
    material: 'White Oak & Matte Steel',
    price: 1350,
    sku: 'DSK-STD-MTR',
    icon: 'desk'
  },
  {
    type: 'office_chair',
    name: 'Ergonomic Task Chair',
    category: 'Office',
    width: 0.68,
    depth: 0.68,
    height: 1.10,
    color: '#0284c7',
    material: 'High-Tensile Ergonomic Mesh',
    price: 890,
    sku: 'CHR-TSK-MSH',
    icon: 'chair'
  },
  {
    type: 'bookshelf',
    name: 'Tall Architectural Bookshelf',
    category: 'Office',
    width: 1.20,
    depth: 0.35,
    height: 2.00,
    color: '#334155',
    material: 'Powdercoated Steel & Oak',
    price: 1200,
    sku: 'SHF-BOK-STL',
    icon: 'room'
  },
  {
    type: 'file_cabinet',
    name: '2-Drawer Mobile Pedestal',
    category: 'Office',
    width: 0.42,
    depth: 0.52,
    height: 0.60,
    color: '#475569',
    material: 'Architectural Steel Gray',
    price: 380,
    sku: 'CAB-MOB-GRY',
    icon: 'table'
  },

  // --- Dining & Kitchen ---
  {
    type: 'dining_table_6',
    name: '6-Person Rectangular Dining Table',
    category: 'Dining',
    width: 1.90,
    depth: 0.95,
    height: 0.76,
    color: '#b45309',
    material: 'Solid European White Oak',
    price: 1950,
    sku: 'TBL-DIN-6P',
    icon: 'table'
  },
  {
    type: 'dining_table_round',
    name: 'Round Dining Table (4-Seat)',
    category: 'Dining',
    width: 1.20,
    depth: 1.20,
    height: 0.76,
    color: '#e2e8f0',
    material: 'Italian Carrara Marble',
    price: 2300,
    sku: 'TBL-RND-MAR',
    icon: 'table'
  },
  {
    type: 'dining_chair',
    name: 'Molded Dining Chair',
    category: 'Dining',
    width: 0.52,
    depth: 0.52,
    height: 0.82,
    color: '#475569',
    material: 'Molded Oak & Wool Seat',
    price: 360,
    sku: 'CHR-DIN-MLD',
    icon: 'chair'
  },
  {
    type: 'kitchen_island',
    name: 'Waterfall Quartz Kitchen Island',
    category: 'Kitchen',
    width: 2.20,
    depth: 0.95,
    height: 0.92,
    color: '#1e293b',
    material: 'Calacatta Gold Quartz',
    price: 4500,
    sku: 'ISL-KIT-QRT',
    icon: 'table'
  },
  {
    type: 'fridge',
    name: 'French Door Integrated Refrigerator',
    category: 'Kitchen',
    width: 0.92,
    depth: 0.75,
    height: 1.90,
    color: '#94a3b8',
    material: 'Brushed Stainless Steel',
    price: 3200,
    sku: 'APP-FRG-SS',
    icon: 'room'
  },
  {
    type: 'stove_oven',
    name: 'Induction Range & Convection Oven',
    category: 'Kitchen',
    width: 0.76,
    depth: 0.65,
    height: 0.90,
    color: '#0f172a',
    material: 'Matte Cast Iron & Ceramic Glass',
    price: 2400,
    sku: 'APP-STV-IND',
    icon: 'room'
  },
  {
    type: 'bar_stool',
    name: 'Counter Bar Stool',
    category: 'Dining',
    width: 0.45,
    depth: 0.45,
    height: 0.95,
    color: '#78350f',
    material: 'Walnut & Saddle Leather',
    price: 320,
    sku: 'STL-BAR-WAL',
    icon: 'chair'
  },

  // --- Bathroom Fixtures ---
  {
    type: 'bath_tub',
    name: 'Freestanding Oval Soaking Tub',
    category: 'Bathroom',
    width: 1.70,
    depth: 0.80,
    height: 0.60,
    color: '#f8fafc',
    material: 'Matte Solid Surface Resin',
    price: 2900,
    sku: 'BAT-OVL-RES',
    icon: 'bath'
  },
  {
    type: 'vanity_double',
    name: 'Double Basin Vanity Counter',
    category: 'Bathroom',
    width: 1.50,
    depth: 0.55,
    height: 0.85,
    color: '#b45309',
    material: 'Fluted Oak & Quartz Top',
    price: 2400,
    sku: 'VAN-DBL-OAK',
    icon: 'table'
  },
  {
    type: 'shower_enclosure',
    name: 'Walk-In Frameless Glass Shower',
    category: 'Bathroom',
    width: 1.20,
    depth: 0.90,
    height: 2.10,
    color: '#38bdf8',
    material: 'Tempered Glass & Brass Trim',
    price: 1800,
    sku: 'SHW-WKI-GLS',
    icon: 'bath'
  },
  {
    type: 'toilet',
    name: 'Wall-Hung Ceramic Toilet',
    category: 'Bathroom',
    width: 0.40,
    depth: 0.60,
    height: 0.45,
    color: '#f8fafc',
    material: 'Glazed Alpine White Porcelain',
    price: 750,
    sku: 'SAN-TOI-POR',
    icon: 'bath'
  },

  // --- Lighting & Decor ---
  {
    type: 'floor_lamp',
    name: 'Arched Brass Floor Lamp',
    category: 'Decor',
    width: 0.50,
    depth: 0.50,
    height: 1.85,
    color: '#d97706',
    material: 'Spun Brass & Natural Linen',
    price: 580,
    sku: 'LMP-ARC-BRS',
    icon: 'lamp'
  },
  {
    type: 'plant_monstera',
    name: 'Potted Monstera Deliciosa',
    category: 'Decor',
    width: 0.55,
    depth: 0.55,
    height: 1.00,
    color: '#15803d',
    material: 'Terracotta Vessel & Flora',
    price: 160,
    sku: 'DEC-PLT-MON',
    icon: 'plant'
  },
  {
    type: 'plant_fiddle',
    name: 'Architectural Fiddle Leaf Fig',
    category: 'Decor',
    width: 0.65,
    depth: 0.65,
    height: 1.75,
    color: '#166534',
    material: 'Fluted Ceramic Planter',
    price: 240,
    sku: 'DEC-PLT-FID',
    icon: 'plant'
  },
  {
    type: 'plant_olive',
    name: 'Large Potted Olive Tree',
    category: 'Decor',
    width: 0.75,
    depth: 0.75,
    height: 1.95,
    color: '#14532d',
    material: 'Aged Stone Urn Planter',
    price: 350,
    sku: 'DEC-PLT-OLV',
    icon: 'plant'
  },

  // --- Structural Openings & Columns ---
  {
    type: 'door_standard',
    name: 'Single Interior Swing Door',
    category: 'Structure',
    width: 0.90,
    depth: 0.15,
    height: 2.10,
    color: '#cbd5e1',
    material: 'Solid Core Painted Wood',
    price: 450,
    sku: 'STR-DOR-SGL',
    icon: 'door',
    isDoor: true
  },
  {
    type: 'door_double',
    name: 'Double French Swing Doors',
    category: 'Structure',
    width: 1.60,
    depth: 0.15,
    height: 2.10,
    color: '#94a3b8',
    material: 'Glazed Timber Frame',
    price: 950,
    sku: 'STR-DOR-DBL',
    icon: 'door',
    isDoor: true
  },
  {
    type: 'window_standard',
    name: 'Casement Picture Window',
    category: 'Structure',
    width: 1.40,
    depth: 0.20,
    height: 1.50,
    color: '#38bdf8',
    material: 'Low-E Double Glazed Glass',
    price: 850,
    sku: 'STR-WIN-CSM',
    icon: 'window',
    isWindow: true
  },
  {
    type: 'window_large',
    name: 'Panoramic Floor-to-Ceiling Glazing',
    category: 'Structure',
    width: 2.40,
    depth: 0.20,
    height: 2.40,
    color: '#0284c7',
    material: 'Thermally Broken Aluminum',
    price: 2100,
    sku: 'STR-WIN-PAN',
    icon: 'window',
    isWindow: true
  },
  {
    type: 'column_sq',
    name: 'Square Structural Column',
    category: 'Structure',
    width: 0.40,
    depth: 0.40,
    height: 2.80,
    color: '#475569',
    material: 'Reinforced Architectural Concrete',
    price: 600,
    sku: 'STR-COL-SQ',
    icon: 'room'
  }
];

const FLOOR_MATERIALS = {
  oak: {
    id: 'oak',
    name: 'European White Oak Plank',
    color: '#c4975e',
    stroke: '#a37843',
    tile: false,
    costPerSqM: 110
  },
  walnut: {
    id: 'walnut',
    name: 'Smoked Walnut Chevron',
    color: '#593822',
    stroke: '#402615',
    tile: false,
    costPerSqM: 145
  },
  marble: {
    id: 'marble',
    name: 'Italian Carrara Marble',
    color: '#e2e8f0',
    stroke: '#cbd5e1',
    tile: true,
    costPerSqM: 190
  },
  concrete: {
    id: 'concrete',
    name: 'Polished Architectural Screed',
    color: '#64748b',
    stroke: '#475569',
    tile: false,
    costPerSqM: 85
  },
  terrazzo: {
    id: 'terrazzo',
    name: 'Venetian Terrazzo Grigio',
    color: '#cbd5e1',
    stroke: '#94a3b8',
    tile: true,
    costPerSqM: 160
  },
  carpet: {
    id: 'carpet',
    name: 'Charcoal Berber Plush',
    color: '#334155',
    stroke: '#1e293b',
    tile: false,
    costPerSqM: 70
  }
};


/* --- MODULE: js/engine/collision.js --- */
/**
 * RoomPlanr - Spatial Collision & Distance Measurement Engine
 * Rotated OBB (Oriented Bounding Box) collision detection, room boundary checking, and dynamic wall distance calculations.
 */

/**
 * Get the 4 corner points of a rotated rectangle in world coordinates
 */
function getRotatedCorners(x, y, width, depth, rotationDegrees = 0) {
  const rad = ((rotationDegrees || 0) * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const hw = (width || 1) / 2;
  const hd = (depth || 1) / 2;

  // Local corners relative to center (in clockwise order: NW, NE, SE, SW)
  const localCorners = [
    { x: -hw, y: -hd },
    { x: hw, y: -hd },
    { x: hw, y: hd },
    { x: -hw, y: hd }
  ];

  return localCorners.map(pt => ({
    x: x + (pt.x * cos - pt.y * sin),
    y: y + (pt.x * sin + pt.y * cos)
  }));
}

/**
 * Test if a world point (wx, wy) is inside a rotated rectangle item
 */
function isPointInsideRotatedItem(wx, wy, item) {
  if (!item) return false;
  const dx = wx - item.x;
  const dy = wy - item.y;
  const rad = -((item.rotation || 0) * Math.PI) / 180;

  // Transform point into item's local coordinate space
  const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
  const localY = dx * Math.sin(rad) + dy * Math.cos(rad);

  const hw = (item.width || 1) / 2;
  const hd = (item.depth || 1) / 2;

  return Math.abs(localX) <= hw && Math.abs(localY) <= hd;
}

/**
 * Separating Axis Theorem (SAT) collision test between two convex polygons
 */
function checkPolygonsIntersect(polyA, polyB) {
  const polygons = [polyA, polyB];

  for (let i = 0; i < polygons.length; i++) {
    const polygon = polygons[i];

    for (let i1 = 0; i1 < polygon.length; i1++) {
      const i2 = (i1 + 1) % polygon.length;
      const p1 = polygon[i1];
      const p2 = polygon[i2];

      // Perpendicular axis vector
      const normal = { x: -(p2.y - p1.y), y: p2.x - p1.x };

      // Project polyA onto normal
      let minA = Infinity, maxA = -Infinity;
      for (const p of polyA) {
        const projected = normal.x * p.x + normal.y * p.y;
        minA = Math.min(minA, projected);
        maxA = Math.max(maxA, projected);
      }

      // Project polyB onto normal
      let minB = Infinity, maxB = -Infinity;
      for (const p of polyB) {
        const projected = normal.x * p.x + normal.y * p.y;
        minB = Math.min(minB, projected);
        maxB = Math.max(maxB, projected);
      }

      // Separating axis found -> no collision
      if (maxA < minB || maxB < minA) {
        return false;
      }
    }
  }

  return true; // Overlap on all axes
}

/**
 * Check if furniture item intersects another furniture item
 */
function checkFurnitureOverlap(itemA, itemB) {
  if (!itemA || !itemB || itemA === itemB) return false;
  if (itemA.id && itemB.id && itemA.id === itemB.id) return false;

  // Area rugs should not trigger collisions with other furniture placed on top
  if (itemA.type === 'rug_large' || itemB.type === 'rug_large') {
    return false;
  }

  const cornersA = getRotatedCorners(itemA.x, itemA.y, itemA.width, itemA.depth, itemA.rotation || 0);
  const cornersB = getRotatedCorners(itemB.x, itemB.y, itemB.width, itemB.depth, itemB.rotation || 0);
  return checkPolygonsIntersect(cornersA, cornersB);
}

/**
 * Check if furniture item is outside room perimeter
 */
function checkOutsideRoom(item, roomWidth, roomDepth) {
  if (!item) return false;
  const corners = getRotatedCorners(item.x, item.y, item.width, item.depth, item.rotation || 0);
  for (const pt of corners) {
    if (pt.x < -0.05 || pt.x > roomWidth + 0.05 || pt.y < -0.05 || pt.y > roomDepth + 0.05) {
      return true;
    }
  }
  return false;
}

/**
 * Calculate perpendicular distances from item bounds to nearest 4 walls
 */
function getDistancesToWalls(item, roomWidth, roomDepth) {
  if (!item) return { left: 0, right: 0, top: 0, bottom: 0 };
  const corners = getRotatedCorners(item.x, item.y, item.width, item.depth, item.rotation || 0);

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  for (const pt of corners) {
    minX = Math.min(minX, pt.x);
    maxX = Math.max(maxX, pt.x);
    minY = Math.min(minY, pt.y);
    maxY = Math.max(maxY, pt.y);
  }

  const left = Math.max(0, minX);
  const right = Math.max(0, roomWidth - maxX);
  const top = Math.max(0, minY);
  const bottom = Math.max(0, roomDepth - maxY);

  return {
    left: parseFloat(left.toFixed(2)),
    right: parseFloat(right.toFixed(2)),
    top: parseFloat(top.toFixed(2)),
    bottom: parseFloat(bottom.toFixed(2))
  };
}


/* --- MODULE: js/engine/renderer-2d.js --- */
/**
 * RoomPlanr - 2D Architectural CAD Floor Plan Renderer
 * Precision top-down CAD drafting with floor materials, wall thicknesses, door arcs, and dimension annotations.
 */





class Renderer2D {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0, zoom: 70 }; // pixels per meter
    this.wallThickness = 0.20; // 20cm outer wall thickness
    this.dpr = window.devicePixelRatio || 1;
    this.logicalWidth = 800;
    this.logicalHeight = 600;
  }

  resize(width, height) {
    this.dpr = window.devicePixelRatio || 1;
    this.logicalWidth = width;
    this.logicalHeight = height;
    this.canvas.width = Math.round(width * this.dpr);
    this.canvas.height = Math.round(height * this.dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  render({
    room,
    items = [],
    selectedItemId = null,
    overlappingItemIds = new Set(),
    unit = UNITS.METERS,
    showGrid = true,
    showDimensions = true
  }) {
    const ctx = this.ctx;
    const w = this.logicalWidth;
    const h = this.logicalHeight;

    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    // 1. Clear Viewport Background
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(this.camera.x, this.camera.y);
    const scale = this.camera.zoom;

    // 2. Draw Background Grid
    if (showGrid) {
      this.drawGrid(ctx, w, h, scale);
    }

    // 3. Draw Room Floor Material
    this.drawRoomFloor(ctx, room, scale);

    // 4. Draw Furniture Items (Lowest Z to Highest Z, Rugs first)
    const sorted = [...items].sort((a, b) => {
      const aRug = a.type === 'rug_large' ? -1 : 0;
      const bRug = b.type === 'rug_large' ? -1 : 0;
      return aRug - bRug;
    });

    for (const item of sorted) {
      const isSelected = item.id === selectedItemId;
      const isOverlapping = overlappingItemIds.has(item.id);
      this.drawFurnitureItem(ctx, item, scale, isSelected, isOverlapping);
    }

    // 5. Draw Perimeter Walls & Openings
    this.drawWalls(ctx, room, scale);

    // 6. Draw Selected Item Dimension Clearance Lines
    if (selectedItemId && showDimensions) {
      const activeItem = items.find(i => i.id === selectedItemId);
      if (activeItem) {
        this.drawClearanceDimensions(ctx, activeItem, room, scale, unit);
      }
    }

    // 7. Draw Room Dimension Annotations
    if (showDimensions) {
      this.drawRoomDimensions(ctx, room, scale, unit);
    }

    ctx.restore();
    ctx.restore();
  }

  drawGrid(ctx, w, h, scale) {
    ctx.save();

    // 0.2m minor grid lines
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.15)';
    ctx.lineWidth = 0.5;
    const startX = -10;
    const endX = 25;
    const startY = -10;
    const endY = 25;

    for (let x = startX; x <= endX; x += 0.2) {
      ctx.beginPath();
      ctx.moveTo(x * scale, startY * scale);
      ctx.lineTo(x * scale, endY * scale);
      ctx.stroke();
    }
    for (let y = startY; y <= endY; y += 0.2) {
      ctx.beginPath();
      ctx.moveTo(startX * scale, y * scale);
      ctx.lineTo(endX * scale, y * scale);
      ctx.stroke();
    }

    // 1-meter major grid lines
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1;

    for (let x = startX; x <= endX; x += 1) {
      ctx.beginPath();
      ctx.moveTo(x * scale, startY * scale);
      ctx.lineTo(x * scale, endY * scale);
      ctx.stroke();
    }
    for (let y = startY; y <= endY; y += 1) {
      ctx.beginPath();
      ctx.moveTo(startX * scale, y * scale);
      ctx.lineTo(endX * scale, y * scale);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawRoomFloor(ctx, room, scale) {
    const rw = room.width * scale;
    const rd = room.depth * scale;
    const mat = FLOOR_MATERIALS[room.floorMaterial] || FLOOR_MATERIALS.oak;

    ctx.save();
    // Floor Base Fill
    ctx.fillStyle = mat.color;
    ctx.fillRect(0, 0, rw, rd);

    // Floor Plank / Tile lines
    ctx.strokeStyle = mat.stroke;
    ctx.lineWidth = 1;

    if (mat.id === 'walnut') {
      // Herringbone pattern
      const step = 0.3 * scale;
      for (let x = -rd; x <= rw + rd; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + rd, rd);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + step, 0);
        ctx.lineTo(x - rd + step, rd);
        ctx.stroke();
      }
    } else if (mat.tile) {
      const tileSize = 0.6 * scale;
      for (let x = 0; x <= rw; x += tileSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, rd); ctx.stroke();
      }
      for (let y = 0; y <= rd; y += tileSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(rw, y); ctx.stroke();
      }
    } else {
      const plankW = 0.22 * scale;
      for (let x = 0; x <= rw; x += plankW) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, rd); ctx.stroke();
      }
    }

    // Inner shadow border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, rw, rd);

    ctx.restore();
  }

  drawWalls(ctx, room, scale) {
    const rw = room.width * scale;
    const rd = room.depth * scale;
    const wt = this.wallThickness * scale;
    const wallColor = room.wallColor || '#1e293b';

    ctx.save();
    ctx.fillStyle = wallColor;
    ctx.strokeStyle = '#080c14';
    ctx.lineWidth = 2;

    // Top Wall
    ctx.fillRect(-wt, -wt, rw + wt * 2, wt);
    ctx.strokeRect(-wt, -wt, rw + wt * 2, wt);

    // Bottom Wall
    ctx.fillRect(-wt, rd, rw + wt * 2, wt);
    ctx.strokeRect(-wt, rd, rw + wt * 2, wt);

    // Left Wall
    ctx.fillRect(-wt, 0, wt, rd);
    ctx.strokeRect(-wt, 0, wt, rd);

    // Right Wall
    ctx.fillRect(rw, 0, wt, rd);
    ctx.strokeRect(rw, 0, wt, rd);

    // Inner Corner lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, rw, rd);

    ctx.restore();
  }

  drawFurnitureItem(ctx, item, scale, isSelected, isOverlapping) {
    const ix = item.x * scale;
    const iy = item.y * scale;
    const iw = (item.width || 1) * scale;
    const id = (item.depth || 1) * scale;
    const rot = ((item.rotation || 0) * Math.PI) / 180;

    ctx.save();
    ctx.translate(ix, iy);
    ctx.rotate(rot);

    // Drop Shadow
    if (item.type !== 'rug_large') {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 1.5;
      ctx.shadowOffsetY = 1.5;
    }

    // Item Body Fill
    ctx.fillStyle = item.color || '#475569';
    ctx.fillRect(-iw / 2, -id / 2, iw, id);
    ctx.shadowColor = 'transparent';

    // Outline
    ctx.strokeStyle = isOverlapping ? '#f59e0b' : (isSelected ? '#38bdf8' : 'rgba(15, 23, 42, 0.8)');
    ctx.lineWidth = isSelected ? 2.5 : 1.5;
    ctx.strokeRect(-iw / 2, -id / 2, iw, id);

    // CAD Details & Symbols
    this.drawCADDetails(ctx, item, iw, id);

    // Selection Handles (Corner squares & top rotation knob)
    if (isSelected) {
      this.drawSelectionHandles(ctx, iw, id);
    }

    ctx.restore();
  }

  drawCADDetails(ctx, item, iw, id) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;

    const t = item.type || '';

    // 1. Sofas & Armchairs
    if (t.includes('sofa') || t.includes('armchair') || t.includes('club')) {
      const armW = Math.min(12, iw * 0.12);
      // Armrests
      ctx.strokeRect(-iw / 2, -id / 2, armW, id);
      ctx.strokeRect(iw / 2 - armW, -id / 2, armW, id);
      // Backrest
      const backD = Math.min(14, id * 0.22);
      ctx.strokeRect(-iw / 2 + armW, -id / 2, iw - armW * 2, backD);
      // Cushion split lines
      if (t === 'sofa_3seat' || iw > 80) {
        const segW = (iw - armW * 2) / 3;
        ctx.beginPath();
        ctx.moveTo(-iw / 2 + armW + segW, -id / 2 + backD); ctx.lineTo(-iw / 2 + armW + segW, id / 2);
        ctx.moveTo(-iw / 2 + armW + segW * 2, -id / 2 + backD); ctx.lineTo(-iw / 2 + armW + segW * 2, id / 2);
        ctx.stroke();
      }
    }
    // 2. Beds
    else if (t.includes('bed')) {
      // Headboard
      const hbD = Math.min(10, id * 0.12);
      ctx.fillRect(-iw / 2, -id / 2, iw, hbD);
      // Pillows
      const pilW = iw * 0.38;
      const pilH = id * 0.22;
      ctx.strokeRect(-iw / 2 + 4, -id / 2 + hbD + 4, pilW, pilH);
      ctx.strokeRect(iw / 2 - pilW - 4, -id / 2 + hbD + 4, pilW, pilH);
      // Duvet turn-down line
      ctx.beginPath();
      ctx.setLineDash([4, 2]);
      ctx.moveTo(-iw / 2 + 4, -id / 2 + hbD + pilH + 10);
      ctx.lineTo(iw / 2 - 4, -id / 2 + hbD + pilH + 10);
      ctx.stroke();
    }
    // 3. Desks & Workstations
    else if (t.includes('desk')) {
      // Bevel boundary
      ctx.strokeRect(-iw / 2 + 3, -id / 2 + 3, iw - 6, id - 6);
      // Cable grommet
      ctx.beginPath();
      ctx.arc(iw / 2 - 12, -id / 2 + 12, 3, 0, Math.PI * 2);
      ctx.stroke();
    }
    // 4. Task Chair
    else if (t === 'office_chair') {
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(iw, id) * 0.35, 0, Math.PI * 2);
      ctx.stroke();
      // 5-point star casters
      for (let a = 0; a < 5; a++) {
        const rad = (a * 72 * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(rad) * iw * 0.45, Math.sin(rad) * id * 0.45);
        ctx.stroke();
      }
    }
    // 5. Kitchen Island & Stove
    else if (t.includes('kitchen_island')) {
      // Sink outline
      ctx.strokeRect(-iw / 2 + 10, -id / 2 + 6, iw * 0.35, id - 12);
      ctx.beginPath();
      ctx.arc(-iw / 2 + 10 + (iw * 0.35) / 2, 0, 3, 0, Math.PI * 2);
      ctx.stroke();
    }
    else if (t.includes('stove_oven')) {
      // 4 Cooktop rings
      const r = Math.min(iw, id) * 0.15;
      [
        [-iw / 4, -id / 4], [iw / 4, -id / 4],
        [-iw / 4, id / 4], [iw / 4, id / 4]
      ].forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      });
    }
    // 6. Bathtub & Toilet
    else if (t === 'bath_tub') {
      ctx.beginPath();
      ctx.roundRect(-iw / 2 + 6, -id / 2 + 6, iw - 12, id - 12, 16);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(iw / 2 - 16, 0, 4, 0, Math.PI * 2);
      ctx.stroke();
    }
    else if (t === 'toilet') {
      // Tank
      ctx.strokeRect(-iw / 2, -id / 2, iw, id * 0.35);
      // Bowl oval
      ctx.beginPath();
      ctx.ellipse(0, id * 0.15, iw * 0.4, id * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    // 7. Door Swing Arc
    else if (item.isDoor) {
      ctx.strokeStyle = '#38bdf8';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(-iw / 2, id / 2, iw, -Math.PI / 2, 0);
      ctx.stroke();
      // Door leaf
      ctx.setLineDash([]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-iw / 2, id / 2);
      ctx.lineTo(-iw / 2, -id / 2 - iw + id);
      ctx.stroke();
    }
    // 8. Window Glass Pane
    else if (item.isWindow) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-iw / 2, -id / 4); ctx.lineTo(iw / 2, -id / 4);
      ctx.moveTo(-iw / 2, id / 4); ctx.lineTo(iw / 2, id / 4);
      ctx.stroke();
    }
    // 9. Plants
    else if (t.includes('plant')) {
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(iw, id) * 0.35, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const rad = (i * 60 * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(rad) * iw * 0.45, Math.sin(rad) * id * 0.45);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  drawSelectionHandles(ctx, iw, id) {
    const handleSize = 8;
    ctx.fillStyle = '#38bdf8';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;

    // 4 Corner Resize Handles
    [
      [-iw / 2, -id / 2],
      [iw / 2, -id / 2],
      [iw / 2, id / 2],
      [-iw / 2, id / 2]
    ].forEach(([hx, hy]) => {
      ctx.fillRect(hx - handleSize / 2, hy - handleSize / 2, handleSize, handleSize);
      ctx.strokeRect(hx - handleSize / 2, hy - handleSize / 2, handleSize, handleSize);
    });

    // Top Rotation Knob
    const rotDist = 24;
    ctx.beginPath();
    ctx.moveTo(0, -id / 2);
    ctx.lineTo(0, -id / 2 - rotDist);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -id / 2 - rotDist, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  drawClearanceDimensions(ctx, item, room, scale, unit) {
    const dist = getDistancesToWalls(item, room.width, room.depth);
    const ix = item.x * scale;
    const iy = item.y * scale;

    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.fillStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.font = "bold 10px 'JetBrains Mono', monospace";
    ctx.textAlign = 'center';

    // Left line to wall
    if (dist.left > 0.05) {
      ctx.beginPath();
      ctx.moveTo(0, iy); ctx.lineTo(ix - (item.width * scale) / 2, iy);
      ctx.stroke();
      this.drawDimensionBadge(ctx, formatDimension(dist.left, unit), ix / 2, iy - 4);
    }

    // Right line to wall
    if (dist.right > 0.05) {
      ctx.beginPath();
      ctx.moveTo(ix + (item.width * scale) / 2, iy); ctx.lineTo(room.width * scale, iy);
      ctx.stroke();
      this.drawDimensionBadge(ctx, formatDimension(dist.right, unit), (ix + room.width * scale) / 2, iy - 4);
    }

    // Top line to wall
    if (dist.top > 0.05) {
      ctx.beginPath();
      ctx.moveTo(ix, 0); ctx.lineTo(ix, iy - (item.depth * scale) / 2);
      ctx.stroke();
      this.drawDimensionBadge(ctx, formatDimension(dist.top, unit), ix + 24, iy / 2);
    }

    // Bottom line to wall
    if (dist.bottom > 0.05) {
      ctx.beginPath();
      ctx.moveTo(ix, iy + (item.depth * scale) / 2); ctx.lineTo(ix, room.depth * scale);
      ctx.stroke();
      this.drawDimensionBadge(ctx, formatDimension(dist.bottom, unit), ix + 24, (iy + room.depth * scale) / 2);
    }

    ctx.restore();
  }

  drawDimensionBadge(ctx, text, x, y) {
    ctx.save();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    const textWidth = ctx.measureText(text).width;
    ctx.fillRect(x - textWidth / 2 - 4, y - 10, textWidth + 8, 14);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  drawRoomDimensions(ctx, room, scale, unit) {
    const rw = room.width * scale;
    const rd = room.depth * scale;
    const offset = 26;

    ctx.save();
    ctx.strokeStyle = '#94a3b8';
    ctx.fillStyle = '#f8fafc';
    ctx.lineWidth = 1.5;
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    ctx.textAlign = 'center';

    // Top Dimension Line (Width)
    ctx.beginPath();
    ctx.moveTo(0, -offset); ctx.lineTo(rw, -offset);
    ctx.moveTo(0, -offset - 5); ctx.lineTo(0, -offset + 5);
    ctx.moveTo(rw, -offset - 5); ctx.lineTo(rw, -offset + 5);
    ctx.stroke();

    // Top dimension text badge
    ctx.save();
    const wText = `Width: ${formatDimension(room.width, unit)}`;
    const twW = ctx.measureText(wText).width;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(rw / 2 - twW / 2 - 6, -offset - 16, twW + 12, 16);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(wText, rw / 2, -offset - 4);
    ctx.restore();

    // Left Dimension Line (Depth)
    ctx.save();
    ctx.translate(-offset, rd / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(-rd / 2, 0); ctx.lineTo(rd / 2, 0);
    ctx.moveTo(-rd / 2, -5); ctx.lineTo(-rd / 2, 5);
    ctx.moveTo(rd / 2, -5); ctx.lineTo(rd / 2, 5);
    ctx.stroke();

    const dText = `Depth: ${formatDimension(room.depth, unit)}`;
    const twD = ctx.measureText(dText).width;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-twD / 2 - 6, -18, twD + 12, 16);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(dText, 0, -6);
    ctx.restore();

    ctx.restore();
  }
}


/* --- MODULE: js/engine/renderer-3d.js --- */
/**
 * RoomPlanr - 3D Isometric Perspective Preview Renderer
 * Pure Canvas 2D pseudo-3D isometric projection rendering elevated walls, floor textures, ambient shading, and 3D furniture blocks.
 */



class Renderer3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0, zoom: 45 };
    this.isoAngle = Math.PI / 6; // 30 degrees
    this.dpr = window.devicePixelRatio || 1;
    this.logicalWidth = 800;
    this.logicalHeight = 600;
  }

  resize(width, height) {
    this.dpr = window.devicePixelRatio || 1;
    this.logicalWidth = width;
    this.logicalHeight = height;
    this.canvas.width = Math.round(width * this.dpr);
    this.canvas.height = Math.round(height * this.dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  toIso(x, y, z = 0, scale = 1) {
    const cos = Math.cos(this.isoAngle);
    const sin = Math.sin(this.isoAngle);
    const screenX = (x - y) * cos * scale;
    const screenY = (x + y) * sin * scale - z * scale;
    return { x: screenX, y: screenY };
  }

  render({
    room,
    items = [],
    selectedItemId = null
  }) {
    const ctx = this.ctx;
    const w = this.logicalWidth;
    const h = this.logicalHeight;

    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    // 1. Clear Viewport
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    // Center isometric room origin
    ctx.translate(w / 2 + this.camera.x, h / 2 - 30 + this.camera.y);
    const scale = this.camera.zoom;

    // 2. Draw Isometric Floor Plane
    this.drawIsometricFloor(ctx, room, scale);

    // 3. Draw Isometric Back & Left Walls (Extruded Upwards)
    this.drawIsometricWalls(ctx, room, scale);

    // 4. Draw Furniture Items Sorted by Isometric Depth (Painter's Algorithm)
    const sortedItems = [...items].sort((a, b) => {
      // Rugs always at bottom
      if (a.type === 'rug_large') return -1;
      if (b.type === 'rug_large') return 1;
      return (a.x + a.y) - (b.x + b.y);
    });

    for (const item of sortedItems) {
      const isSelected = item.id === selectedItemId;
      this.drawIsometricFurnitureBlock(ctx, item, scale, isSelected);
    }

    ctx.restore();
    ctx.restore();
  }

  drawIsometricFloor(ctx, room, scale) {
    const rw = room.width;
    const rd = room.depth;
    const mat = FLOOR_MATERIALS[room.floorMaterial] || FLOOR_MATERIALS.oak;

    const p0 = this.toIso(0, 0, 0, scale);
    const p1 = this.toIso(rw, 0, 0, scale);
    const p2 = this.toIso(rw, rd, 0, scale);
    const p3 = this.toIso(0, rd, 0, scale);

    ctx.save();
    ctx.fillStyle = mat.color;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = mat.stroke;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Isometric Floor Planks / Tiles Grid
    const step = mat.tile ? 0.6 : 0.4;
    for (let x = 0; x <= rw; x += step) {
      const start = this.toIso(x, 0, 0, scale);
      const end = this.toIso(x, rd, 0, scale);
      ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(end.x, end.y); ctx.stroke();
    }
    for (let y = 0; y <= rd; y += step) {
      const start = this.toIso(0, y, 0, scale);
      const end = this.toIso(rw, y, 0, scale);
      ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(end.x, end.y); ctx.stroke();
    }

    // Floor Base Edge Shadow
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p3.x, p3.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();

    ctx.restore();
  }

  drawIsometricWalls(ctx, room, scale) {
    const rw = room.width;
    const rd = room.depth;
    const wh = room.height || 2.85; // Standard architectural ceiling
    const wallColor = room.wallColor || '#1e293b';

    ctx.save();

    // 1. Back-Left Wall (Along Y-axis from 0,0 to 0,rd)
    const wl0_b = this.toIso(0, 0, 0, scale);
    const wl1_b = this.toIso(0, rd, 0, scale);
    const wl1_t = this.toIso(0, rd, wh, scale);
    const wl0_t = this.toIso(0, 0, wh, scale);

    ctx.fillStyle = adjustBrightness(wallColor, -25); // Left wall shaded darker
    ctx.beginPath();
    ctx.moveTo(wl0_b.x, wl0_b.y);
    ctx.lineTo(wl1_b.x, wl1_b.y);
    ctx.lineTo(wl1_t.x, wl1_t.y);
    ctx.lineTo(wl0_t.x, wl0_t.y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 2. Back-Top Wall (Along X-axis from 0,0 to rw,0)
    const wt0_b = this.toIso(0, 0, 0, scale);
    const wt1_b = this.toIso(rw, 0, 0, scale);
    const wt1_t = this.toIso(rw, 0, wh, scale);
    const wt0_t = this.toIso(0, 0, wh, scale);

    ctx.fillStyle = adjustBrightness(wallColor, 12); // Back-Top wall lit lighter
    ctx.beginPath();
    ctx.moveTo(wt0_b.x, wt0_b.y);
    ctx.lineTo(wt1_b.x, wt1_b.y);
    ctx.lineTo(wt1_t.x, wt1_t.y);
    ctx.lineTo(wt0_t.x, wt0_t.y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Wall Join Corner Line (Ambient Occlusion effect)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(wl0_b.x, wl0_b.y);
    ctx.lineTo(wl0_t.x, wl0_t.y);
    ctx.stroke();

    ctx.restore();
  }

  drawIsometricFurnitureBlock(ctx, item, scale, isSelected) {
    const hw = (item.width || 1) / 2;
    const hd = (item.depth || 1) / 2;
    const h = item.height || 0.8;
    const baseColor = item.color || '#475569';

    // Calculate rotated 4 base corner vertices
    const rad = ((item.rotation || 0) * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const corners = [
      { x: -hw, y: -hd },
      { x: hw, y: -hd },
      { x: hw, y: hd },
      { x: -hw, y: hd }
    ];

    const worldPts = corners.map(pt => ({
      x: item.x + (pt.x * cos - pt.y * sin),
      y: item.y + (pt.x * sin + pt.y * cos)
    }));

    // Iso bottom vertices (z=0)
    const b0 = this.toIso(worldPts[0].x, worldPts[0].y, 0, scale);
    const b1 = this.toIso(worldPts[1].x, worldPts[1].y, 0, scale);
    const b2 = this.toIso(worldPts[2].x, worldPts[2].y, 0, scale);
    const b3 = this.toIso(worldPts[3].x, worldPts[3].y, 0, scale);

    // Iso top vertices (z=h)
    const t0 = this.toIso(worldPts[0].x, worldPts[0].y, h, scale);
    const t1 = this.toIso(worldPts[1].x, worldPts[1].y, h, scale);
    const t2 = this.toIso(worldPts[2].x, worldPts[2].y, h, scale);
    const t3 = this.toIso(worldPts[3].x, worldPts[3].y, h, scale);

    const b = [b0, b1, b2, b3];
    const t = [t0, t1, t2, t3];

    ctx.save();

    // Rug flat drawing
    if (item.type === 'rug_large') {
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.moveTo(b0.x, b0.y);
      ctx.lineTo(b1.x, b1.y);
      ctx.lineTo(b2.x, b2.y);
      ctx.lineTo(b3.x, b3.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#38bdf8' : 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.stroke();
      ctx.restore();
      return;
    }

    // Drop shadow under 3D block
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.moveTo(b0.x + 2, b0.y + 2);
    ctx.lineTo(b1.x + 2, b1.y + 2);
    ctx.lineTo(b2.x + 2, b2.y + 2);
    ctx.lineTo(b3.x + 2, b3.y + 2);
    ctx.closePath();
    ctx.fill();

    // Draw 4 Side Walls
    for (let i = 0; i < 4; i++) {
      const next = (i + 1) % 4;
      const shade = i % 2 === 0 ? -28 : -14;

      ctx.fillStyle = adjustBrightness(baseColor, shade);
      ctx.beginPath();
      ctx.moveTo(b[i].x, b[i].y);
      ctx.lineTo(b[next].x, b[next].y);
      ctx.lineTo(t[next].x, t[next].y);
      ctx.lineTo(t[i].x, t[i].y);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = isSelected ? '#38bdf8' : 'rgba(0, 0, 0, 0.35)';
      ctx.lineWidth = isSelected ? 1.5 : 0.8;
      ctx.stroke();
    }

    // Top Face (t0 -> t1 -> t2 -> t3)
    ctx.fillStyle = adjustBrightness(baseColor, 22);
    ctx.beginPath();
    ctx.moveTo(t0.x, t0.y);
    ctx.lineTo(t1.x, t1.y);
    ctx.lineTo(t2.x, t2.y);
    ctx.lineTo(t3.x, t3.y);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = isSelected ? '#38bdf8' : 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = isSelected ? 2 : 1;
    ctx.stroke();

    // Selected 3D highlight marker
    if (isSelected) {
      ctx.fillStyle = '#38bdf8';
      const centerT = {
        x: (t0.x + t1.x + t2.x + t3.x) / 4,
        y: (t0.y + t1.y + t2.y + t3.y) / 4
      };
      ctx.beginPath();
      ctx.arc(centerT.x, centerT.y - 12, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

/**
 * Adjust hex color brightness with fallback
 */
function adjustBrightness(colorStr, percent) {
  if (!colorStr) return '#475569';

  let hex = colorStr.trim();
  if (hex.startsWith('#')) hex = hex.slice(1);
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  let num = parseInt(hex, 16);
  if (isNaN(num)) return colorStr;

  let r = (num >> 16) + Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00FF) + Math.round(255 * (percent / 100));
  let b = (num & 0x0000FF) + Math.round(255 * (percent / 100));

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  const pad = (n) => n.toString(16).padStart(2, '0');
  return `#${pad(r)}${pad(g)}${pad(b)}`;
}


/* --- MODULE: js/engine/sample-rooms.js --- */
/**
 * RoomPlanr - Pre-Loaded Architectural Projects & Layout Scenarios
 * Believable architectural client briefs, dimensional floor plans, and multi-scenario layouts.
 */

const SAMPLE_ROOMS = {
  studio: {
    id: 'proj_tribeca_studio',
    name: 'Tribeca Loft Residence — Studio Suite',
    client: 'Julian & Claire Sterling',
    firm: 'Sterling Design Group',
    address: '142 Franklin St, New York, NY 10013',
    notes: 'Open-concept urban studio loft with natural oak flooring and zoned living/sleeping quarters.',
    width: 6.5,
    depth: 4.8,
    height: 2.85,
    floorMaterial: 'oak',
    wallColor: '#1e293b',
    activeScenarioId: 'scenario_a',
    scenarios: {
      scenario_a: {
        id: 'scenario_a',
        name: 'Layout A (Open Urban Concept)',
        items: [
          { id: 'item_bed', type: 'bed_king', name: 'King Size Platform Bed', x: 1.40, y: 1.40, width: 2.05, depth: 2.15, height: 1.10, rotation: 0, color: '#475569', material: 'Upholstered Warm Sand', price: 2800, sku: 'BED-KNG-SND' },
          { id: 'item_stand_1', type: 'nightstand', name: 'Bedside Nightstand Left', x: 0.40, y: 0.50, width: 0.55, depth: 0.45, height: 0.55, rotation: 0, color: '#b45309', material: 'Solid French Oak', price: 450, sku: 'STN-BED-OAK' },
          { id: 'item_sofa', type: 'sofa_3seat', name: '3-Seater Tailored Sofa', x: 5.10, y: 1.90, width: 2.20, depth: 0.95, height: 0.85, rotation: 90, color: '#3b4252', material: 'Belgian Bouclé Charcoal', price: 2450, sku: 'SOF-3S-CHR' },
          { id: 'item_coffee_table', type: 'coffee_table', name: 'Solid Walnut Coffee Table', x: 4.30, y: 1.90, width: 1.30, depth: 0.65, height: 0.42, rotation: 90, color: '#78350f', material: 'Solid American Walnut', price: 850, sku: 'TBL-COF-WAL' },
          { id: 'item_tv', type: 'tv_unit', name: 'Lowline Media Credenza', x: 3.40, y: 0.45, width: 2.00, depth: 0.45, height: 0.50, rotation: 0, color: '#1e293b', material: 'Matte Obsidian Ash', price: 1400, sku: 'CRD-MED-OBS' },
          { id: 'item_rug', type: 'rug_large', name: 'Large Hand-Tufted Area Rug', x: 4.40, y: 2.00, width: 3.00, depth: 2.00, height: 0.02, rotation: 0, color: '#cbd5e1', material: 'Organic New Zealand Wool', price: 1150, sku: 'RUG-WOOL-NZ' },
          { id: 'item_desk', type: 'desk_standing', name: 'Motorized Sit-Stand Desk', x: 1.30, y: 4.10, width: 1.50, depth: 0.75, height: 0.75, rotation: 0, color: '#0f172a', material: 'White Oak & Matte Steel', price: 1350, sku: 'DSK-STD-MTR' },
          { id: 'item_chair', type: 'office_chair', name: 'Ergonomic Task Chair', x: 1.30, y: 3.35, width: 0.68, depth: 0.68, height: 1.10, rotation: 180, color: '#0284c7', material: 'High-Tensile Mesh', price: 890, sku: 'CHR-TSK-MSH' },
          { id: 'item_plant', type: 'plant_monstera', name: 'Potted Monstera Deliciosa', x: 0.50, y: 4.20, width: 0.55, depth: 0.55, height: 1.00, rotation: 0, color: '#15803d', material: 'Terracotta Vessel', price: 160, sku: 'DEC-PLT-MON' },
          { id: 'item_door', type: 'door_standard', name: 'Entry Foyer Door', x: 5.90, y: 4.70, width: 0.90, depth: 0.15, height: 2.10, rotation: 0, color: '#cbd5e1', material: 'Painted Solid Timber', price: 450, sku: 'STR-DOR-SGL', isDoor: true },
          { id: 'item_win', type: 'window_large', name: 'Panoramic Loft Window', x: 3.25, y: 0.10, width: 2.40, depth: 0.20, height: 2.40, rotation: 0, color: '#0284c7', material: 'Thermally Broken Aluminum', price: 2100, sku: 'STR-WIN-PAN', isWindow: true }
        ]
      },
      scenario_b: {
        id: 'scenario_b',
        name: 'Layout B (Zoned Living & Wardrobe)',
        items: [
          { id: 'item_bed_b', type: 'bed_queen', name: 'Queen Size Bed', x: 1.30, y: 1.30, width: 1.65, depth: 2.10, height: 1.05, rotation: 0, color: '#334155', material: 'Heather Gray Wool', price: 2200 },
          { id: 'item_wardrobe_b', type: 'wardrobe', name: 'Double Wardrobe Armoire', x: 1.30, y: 4.30, width: 1.80, depth: 0.60, height: 2.20, rotation: 0, color: '#1e293b', material: 'Matte Charcoal', price: 2600 },
          { id: 'item_sofa_b', type: 'sofa_3seat', name: '3-Seater Sofa', x: 4.80, y: 3.80, width: 2.20, depth: 0.95, height: 0.85, rotation: 0, color: '#3b4252', price: 2450 },
          { id: 'item_tv_b', type: 'tv_unit', name: 'Media Credenza', x: 4.80, y: 0.45, width: 2.00, depth: 0.45, height: 0.50, rotation: 0, color: '#1e293b', price: 1400 },
          { id: 'item_desk_b', type: 'desk_standing', name: 'Standing Desk', x: 4.80, y: 1.80, width: 1.50, depth: 0.75, height: 0.75, rotation: 0, color: '#0f172a', price: 1350 }
        ]
      }
    }
  },

  office: {
    id: 'proj_mayfair_office',
    name: 'Mayfair Executive Workspace & Study',
    client: 'Sir Arthur Pendelton',
    firm: 'Meridian Capital Partners',
    address: '28 Berkeley Square, London W1J 6EN',
    notes: 'Private executive consulting suite with client hospitality seating and smoked walnut finishes.',
    width: 4.8,
    depth: 3.6,
    height: 2.90,
    floorMaterial: 'walnut',
    wallColor: '#0f172a',
    activeScenarioId: 'scenario_a',
    scenarios: {
      scenario_a: {
        id: 'scenario_a',
        name: 'Layout A (Executive Consultation)',
        items: [
          { id: 'item_exec_desk', type: 'desk_exec', name: 'Executive Workstation Desk', x: 2.40, y: 1.70, width: 1.80, depth: 0.85, height: 0.75, rotation: 0, color: '#78350f', material: 'Solid American Walnut', price: 2100, sku: 'DSK-EXC-WAL' },
          { id: 'item_exec_chair', type: 'office_chair', name: 'Ergonomic Task Chair', x: 2.40, y: 1.00, width: 0.68, depth: 0.68, height: 1.10, rotation: 0, color: '#0284c7', material: 'High-Tensile Mesh', price: 890, sku: 'CHR-TSK-MSH' },
          { id: 'item_bookshelf', type: 'bookshelf', name: 'Tall Architectural Bookshelf', x: 0.35, y: 1.80, width: 1.20, depth: 0.35, height: 2.00, rotation: 90, color: '#334155', material: 'Steel & Walnut', price: 1200, sku: 'SHF-BOK-STL' },
          { id: 'item_armchair_1', type: 'armchair', name: 'Client Lounge Chair 1', x: 1.60, y: 2.70, width: 0.85, depth: 0.85, height: 0.80, rotation: 180, color: '#0284c7', material: 'Saddle Leather', price: 1250, sku: 'ARM-MC-CGN' },
          { id: 'item_armchair_2', type: 'armchair', name: 'Client Lounge Chair 2', x: 3.20, y: 2.70, width: 0.85, depth: 0.85, height: 0.80, rotation: 180, color: '#0284c7', material: 'Saddle Leather', price: 1250, sku: 'ARM-MC-CGN' },
          { id: 'item_side_tbl', type: 'side_table', name: 'Travertine Side Table', x: 2.40, y: 2.80, width: 0.50, depth: 0.50, height: 0.55, rotation: 0, color: '#d97706', material: 'Roman Travertine', price: 420, sku: 'TBL-SIDE-TRV' },
          { id: 'item_lamp', type: 'floor_lamp', name: 'Arched Brass Floor Lamp', x: 4.20, y: 0.60, width: 0.50, depth: 0.50, height: 1.85, rotation: 0, color: '#d97706', material: 'Spun Brass', price: 580, sku: 'LMP-ARC-BRS' },
          { id: 'item_plant_f', type: 'plant_fiddle', name: 'Architectural Fiddle Fig', x: 0.60, y: 0.55, width: 0.65, depth: 0.65, height: 1.75, rotation: 0, color: '#166534', material: 'Fluted Ceramic', price: 240, sku: 'DEC-PLT-FID' },
          { id: 'item_door_off', type: 'door_standard', name: 'Corridor Access Door', x: 4.30, y: 3.50, width: 0.90, depth: 0.15, height: 2.10, rotation: 0, color: '#cbd5e1', price: 450, isDoor: true }
        ]
      }
    }
  },

  bedroom: {
    id: 'proj_kyoto_master',
    name: 'Kyoto Minimalist Master Suite',
    client: 'Kenzo & Yuka Takahashi',
    firm: 'Kōva Residential',
    address: '18-4 Higashiyama-ku, Kyoto 605-0862',
    notes: 'Serene master suite retreat emphasizing balanced proportions, marble surfaces, and soft acoustic textures.',
    width: 5.2,
    depth: 4.2,
    height: 2.80,
    floorMaterial: 'marble',
    wallColor: '#1e293b',
    activeScenarioId: 'scenario_a',
    scenarios: {
      scenario_a: {
        id: 'scenario_a',
        name: 'Layout A (Symmetric Sanctuary)',
        items: [
          { id: 'item_bed_king', type: 'bed_king', name: 'King Size Platform Bed', x: 2.60, y: 1.50, width: 2.05, depth: 2.15, height: 1.10, rotation: 0, color: '#475569', material: 'Upholstered Warm Sand', price: 2800, sku: 'BED-KNG-SND' },
          { id: 'item_stand_l', type: 'nightstand', name: 'Nightstand Left', x: 1.15, y: 0.50, width: 0.55, depth: 0.45, height: 0.55, rotation: 0, color: '#b45309', material: 'Solid French Oak', price: 450, sku: 'STN-BED-OAK' },
          { id: 'item_stand_r', type: 'nightstand', name: 'Nightstand Right', x: 4.05, y: 0.50, width: 0.55, depth: 0.45, height: 0.55, rotation: 0, color: '#b45309', material: 'Solid French Oak', price: 450, sku: 'STN-BED-OAK' },
          { id: 'item_dresser', type: 'dresser', name: '6-Drawer Low Dresser', x: 2.60, y: 3.85, width: 1.60, depth: 0.50, height: 0.85, rotation: 180, color: '#78350f', material: 'Smoked Walnut', price: 1850, sku: 'DRS-6DR-WAL' },
          { id: 'item_wardrobe', type: 'wardrobe', name: 'Double Wardrobe Armoire', x: 0.55, y: 2.80, width: 1.80, depth: 0.60, height: 2.20, rotation: 90, color: '#1e293b', material: 'Matte Charcoal', price: 2600, sku: 'WRD-ARM-MAT' },
          { id: 'item_plant_olv', type: 'plant_olive', name: 'Potted Olive Tree', x: 4.60, y: 3.60, width: 0.75, depth: 0.75, height: 1.95, rotation: 0, color: '#14532d', material: 'Aged Stone Urn', price: 350, sku: 'DEC-PLT-OLV' },
          { id: 'item_door_bed', type: 'door_double', name: 'Double Suite Entry Doors', x: 4.70, y: 1.50, width: 1.60, depth: 0.15, height: 2.10, rotation: 90, color: '#94a3b8', price: 950, isDoor: true }
        ]
      }
    }
  },

  dining: {
    id: 'proj_nordic_kitchen',
    name: 'Scandinavian Open Kitchen & Dining',
    client: 'Astrid Lindqvist',
    firm: 'Nordic Living Studio',
    address: 'Strandvägen 44, Stockholm, Sweden',
    notes: 'Bright social kitchen and dining gallery with quartz waterfall island and bespoke oak millwork.',
    width: 5.8,
    depth: 4.4,
    height: 2.90,
    floorMaterial: 'terrazzo',
    wallColor: '#1e293b',
    activeScenarioId: 'scenario_a',
    scenarios: {
      scenario_a: {
        id: 'scenario_a',
        name: 'Layout A (Waterfall Island & 6P Dining)',
        items: [
          { id: 'item_island', type: 'kitchen_island', name: 'Waterfall Quartz Island', x: 1.70, y: 2.20, width: 2.20, depth: 0.95, height: 0.92, rotation: 90, color: '#1e293b', material: 'Calacatta Gold Quartz', price: 4500, sku: 'ISL-KIT-QRT' },
          { id: 'item_range', type: 'stove_oven', name: 'Induction Range & Oven', x: 0.45, y: 1.50, width: 0.76, depth: 0.65, height: 0.90, rotation: 90, color: '#0f172a', material: 'Cast Iron & Glass', price: 2400, sku: 'APP-STV-IND' },
          { id: 'item_fridge', type: 'fridge', name: 'Integrated Refrigerator', x: 0.45, y: 3.20, width: 0.92, depth: 0.75, height: 1.90, rotation: 90, color: '#94a3b8', material: 'Brushed Stainless', price: 3200, sku: 'APP-FRG-SS' },
          { id: 'item_dining_tbl', type: 'dining_table_6', name: '6-Person Oak Dining Table', x: 4.20, y: 2.20, width: 1.90, depth: 0.95, height: 0.76, rotation: 90, color: '#b45309', material: 'Solid White Oak', price: 1950, sku: 'TBL-DIN-6P' },
          { id: 'item_stool_1', type: 'bar_stool', name: 'Counter Stool 1', x: 2.35, y: 1.50, width: 0.45, depth: 0.45, height: 0.95, rotation: 270, color: '#78350f', price: 320 },
          { id: 'item_stool_2', type: 'bar_stool', name: 'Counter Stool 2', x: 2.35, y: 2.20, width: 0.45, depth: 0.45, height: 0.95, rotation: 270, color: '#78350f', price: 320 },
          { id: 'item_stool_3', type: 'bar_stool', name: 'Counter Stool 3', x: 2.35, y: 2.90, width: 0.45, depth: 0.45, height: 0.95, rotation: 270, color: '#78350f', price: 320 },
          { id: 'item_win_din', type: 'window_large', name: 'Dining Panoramic Window', x: 4.20, y: 0.10, width: 2.40, depth: 0.20, height: 2.40, rotation: 0, color: '#0284c7', price: 2100, isWindow: true },
          { id: 'item_patio_door', type: 'door_double', name: 'Patio Terrace French Doors', x: 4.20, y: 4.30, width: 1.60, depth: 0.15, height: 2.10, rotation: 0, color: '#94a3b8', price: 950, isDoor: true }
        ]
      }
    }
  }
};


/* --- MODULE: js/core/db.js --- */
/**
 * RoomPlanr - IndexedDB Storage Engine
 * Persists room projects, layout scenarios, and custom furniture offline.
 */



const DB_NAME = 'RoomPlanr_DB';
const DB_VERSION = 1;

class RoomPlanrDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('rooms')) {
          db.createObjectStore('rooms', { keyPath: 'id' });
        }
      };

      req.onsuccess = async (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      req.onerror = () => {
        console.warn('IndexedDB unavailable, falling back to localStorage');
        resolve(null);
      };
    });
  }

  async saveRoom(room) {
    if (!this.db) {
      localStorage.setItem('roomplanr_room_' + room.id, JSON.stringify(room));
      return;
    }
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('rooms', 'readwrite');
      const store = tx.objectStore('rooms');
      store.put(room);
      tx.oncomplete = () => resolve(room);
      tx.onerror = () => reject(tx.error);
    });
  }

  async loadRoom(id) {
    if (!this.db) {
      const str = localStorage.getItem('roomplanr_room_' + id);
      return str ? JSON.parse(str) : null;
    }
    return new Promise((resolve) => {
      const tx = this.db.transaction('rooms', 'readonly');
      const store = tx.objectStore('rooms');
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  }
}

const db = new RoomPlanrDB();


/* --- MODULE: js/editor/furniture-catalog.js --- */
/**
 * RoomPlanr - Furniture Catalog & Custom Item Creator
 * Left sidebar catalog with category filtering, search, real-world dimensions, pricing, and custom item creation.
 */





function renderFurnitureCatalog(container, {
  unit = UNITS.METERS,
  currency = 'USD',
  activeCategory = 'All',
  searchQuery = '',
  onAddItem = null,
  onCategoryChange = null,
  onSearchChange = null,
  onOpenCustomModal = null
}) {
  const categories = ['All', 'Living', 'Bedroom', 'Office', 'Dining', 'Kitchen', 'Bathroom', 'Decor', 'Structure'];

  const filtered = FURNITURE_CATALOG.filter(item => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.material && item.material.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  container.innerHTML = `
    <!-- Top Header -->
    <div class="panel-section-header flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-2">
        ${getIcon('sofa', 'icon-sm text-primary')}
        <span class="text-xs font-bold uppercase text-muted" style="letter-spacing: 0.5px;">Furniture Catalog</span>
      </div>
      <button class="btn btn-xs btn-primary" id="btn-open-custom-item" title="Create Custom Furniture Dimension">
        ${getIcon('plus', 'icon-xs')} Custom
      </button>
    </div>

    <!-- Search Bar -->
    <div class="p-2 border-b">
      <div class="relative">
        <input type="text" id="catalog-search-input" class="form-control form-control-sm pl-8 font-sans w-full" placeholder="Search items, finishes, SKUs..." value="${escapeHTML(searchQuery)}" aria-label="Search furniture catalog" />
        <span class="absolute left-2.5 top-2 text-muted pointer-events-none">${getIcon('search', 'icon-xs')}</span>
        ${searchQuery ? `<button id="btn-clear-search" class="absolute right-2 top-1.5 btn-icon-xs text-muted" title="Clear search">${getIcon('close', 'icon-xs')}</button>` : ''}
      </div>
    </div>

    <!-- Category Pill Filter -->
    <div class="p-2 border-b flex flex-wrap gap-1" role="tablist" aria-label="Furniture categories">
      ${categories.map(c => `
        <button class="badge ${activeCategory === c ? 'badge-primary' : 'badge-secondary'} cursor-pointer cat-pill-btn" data-cat="${c}" role="tab" aria-selected="${activeCategory === c}">
          ${c}
        </button>
      `).join('')}
    </div>

    <!-- Scrollable Items List -->
    <div class="catalog-items-scroll p-2 flex flex-col gap-1.5 flex-1 overflow-y-auto" role="list">
      ${filtered.length === 0 ? `
        <div class="text-xs text-muted text-center p-6 flex flex-col items-center gap-2">
          ${getIcon('search', 'icon-sm text-muted')}
          <span>No furniture found matching "${escapeHTML(searchQuery)}".</span>
          <button class="btn btn-xs btn-secondary mt-1" id="btn-reset-catalog-filter">Reset Filters</button>
        </div>
      ` : filtered.map(item => `
        <div class="catalog-item-card card p-2 flex items-center justify-between hover-elevated" role="listitem" tabindex="0">
          <div class="flex items-center gap-2.5 truncate">
            <div class="item-icon-box flex items-center justify-center rounded p-1" style="background-color: var(--bg-elevated); color: ${item.color || 'var(--accent-primary)'};">
              ${getIcon(item.icon || 'sofa', 'icon-sm')}
            </div>
            <div class="flex flex-col truncate">
              <span class="font-bold text-xs text-primary truncate">${escapeHTML(item.name)}</span>
              <div class="flex items-center gap-1.5 font-mono text-muted text-xs" style="font-size: 10px;">
                <span>${formatDimension(item.width, unit)} &times; ${formatDimension(item.depth, unit)}</span>
                ${item.price ? `<span class="text-emerald font-semibold">&bull; ${formatPrice(item.price, currency)}</span>` : ''}
              </div>
            </div>
          </div>

          <button class="btn btn-xs btn-secondary btn-add-catalog-item" data-type="${item.type}" title="Add ${escapeHTML(item.name)} to room" aria-label="Add ${escapeHTML(item.name)} to floor plan">
            ${getIcon('plus', 'icon-xs')} Add
          </button>
        </div>
      `).join('')}
    </div>
  `;

  // Attach Handlers
  container.querySelector('#catalog-search-input')?.addEventListener('input', (e) => {
    if (onSearchChange) onSearchChange(e.target.value);
  });

  container.querySelector('#btn-clear-search')?.addEventListener('click', () => {
    if (onSearchChange) onSearchChange('');
  });

  container.querySelector('#btn-reset-catalog-filter')?.addEventListener('click', () => {
    if (onCategoryChange) onCategoryChange('All');
    if (onSearchChange) onSearchChange('');
  });

  container.querySelectorAll('.cat-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onCategoryChange) onCategoryChange(btn.dataset.cat);
    });
  });

  container.querySelectorAll('.btn-add-catalog-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const type = btn.dataset.type;
      const tpl = FURNITURE_CATALOG.find(i => i.type === type);
      if (tpl && onAddItem) {
        onAddItem(JSON.parse(JSON.stringify(tpl)));
      }
    });
  });

  container.querySelector('#btn-open-custom-item')?.addEventListener('click', () => {
    if (onOpenCustomModal) onOpenCustomModal();
  });
}


/* --- MODULE: js/editor/property-inspector.js --- */
/**
 * RoomPlanr - Property Inspector & Takeoff Panel
 * Right sidebar for room dimensions, floor materials, wall colors, selected object transform controls, and live BOM takeoff.
 */






function renderPropertyInspector(container, {
  room,
  selectedItem = null,
  activeTab = 'properties', // 'properties', 'room', 'takeoff'
  unit = UNITS.METERS,
  currency = 'USD',
  onTabChange = null,
  onUpdateRoom = null,
  onUpdateItem = null,
  onDuplicateItem = null,
  onDeleteItem = null,
  onExportBOM = null,
  onCopyBOM = null,
  onOpenProjectModal = null
}) {
  const dist = selectedItem ? getDistancesToWalls(selectedItem, room.width, room.depth) : null;
  const items = (room.scenarios && room.scenarios[room.activeScenarioId || 'scenario_a']?.items) || [];

  // Calculate BOM & Area stats
  const totalFloorArea = room.width * room.depth;
  const floorMat = FLOOR_MATERIALS[room.floorMaterial] || FLOOR_MATERIALS.oak;
  const flooringCost = totalFloorArea * (floorMat.costPerSqM || 100);

  let furnitureTotalCost = 0;
  items.forEach(i => {
    furnitureTotalCost += (i.price || 0);
  });
  const grandTotalCost = flooringCost + furnitureTotalCost;

  container.innerHTML = `
    <!-- Top Inspector Tabs -->
    <div class="panel-section-header flex items-center justify-between border-b p-1" style="background-color: var(--bg-elevated);">
      <div class="flex items-center gap-1 w-full" role="tablist">
        <button class="btn btn-xs ${activeTab === 'properties' ? 'btn-primary' : 'btn-secondary'} flex-1 inspector-tab-btn" data-tab="properties" role="tab" aria-selected="${activeTab === 'properties'}">
          ${getIcon('sofa', 'icon-xs')} Object
        </button>
        <button class="btn btn-xs ${activeTab === 'room' ? 'btn-primary' : 'btn-secondary'} flex-1 inspector-tab-btn" data-tab="room" role="tab" aria-selected="${activeTab === 'room'}">
          ${getIcon('room', 'icon-xs')} Room
        </button>
        <button class="btn btn-xs ${activeTab === 'takeoff' ? 'btn-primary' : 'btn-secondary'} flex-1 inspector-tab-btn" data-tab="takeoff" role="tab" aria-selected="${activeTab === 'takeoff'}">
          ${getIcon('bom', 'icon-xs')} Takeoff
        </button>
      </div>
    </div>

    <!-- Inspector Body Scroll -->
    <div class="inspector-body-scroll p-3 flex flex-col gap-3 flex-1 overflow-y-auto">
      
      <!-- TAB 1: OBJECT PROPERTIES -->
      ${activeTab === 'properties' ? `
        ${selectedItem ? `
          <div class="card p-3 flex flex-col gap-2.5">
            <div class="flex items-center justify-between border-b pb-2">
              <div class="flex items-center gap-1.5 truncate">
                <span class="font-bold text-xs text-primary truncate">${escapeHTML(selectedItem.name)}</span>
              </div>
              <div class="flex items-center gap-1">
                <button class="btn-icon-xs" id="btn-inspect-dupe" title="Duplicate (Ctrl+D)" aria-label="Duplicate item">${getIcon('copy', 'icon-xs')}</button>
                <button class="btn-icon-xs text-rose" id="btn-inspect-del" title="Delete (Delete)" aria-label="Delete item">${getIcon('trash', 'icon-xs')}</button>
              </div>
            </div>

            <!-- Dimensions (W x D x H) -->
            <div class="grid grid-cols-2 gap-2">
              <div class="form-group">
                <label class="form-label text-xs font-semibold text-muted">Width (${unit})</label>
                <input type="number" step="0.05" min="0.1" max="20" id="inp-item-width" class="form-control form-control-sm font-mono" value="${selectedItem.width}" />
              </div>
              <div class="form-group">
                <label class="form-label text-xs font-semibold text-muted">Depth (${unit})</label>
                <input type="number" step="0.05" min="0.1" max="20" id="inp-item-depth" class="form-control form-control-sm font-mono" value="${selectedItem.depth}" />
              </div>
            </div>

            <!-- Position (X, Y) -->
            <div class="grid grid-cols-2 gap-2">
              <div class="form-group">
                <label class="form-label text-xs font-semibold text-muted">Position X</label>
                <input type="number" step="0.05" id="inp-item-x" class="form-control form-control-sm font-mono" value="${selectedItem.x.toFixed(2)}" />
              </div>
              <div class="form-group">
                <label class="form-label text-xs font-semibold text-muted">Position Y</label>
                <input type="number" step="0.05" id="inp-item-y" class="form-control form-control-sm font-mono" value="${selectedItem.y.toFixed(2)}" />
              </div>
            </div>

            <!-- Rotation -->
            <div class="form-group">
              <div class="flex items-center justify-between mb-1">
                <label class="form-label text-xs font-semibold text-muted">Rotation Angle</label>
                <span class="font-mono text-xs font-bold text-primary" id="lbl-item-rot">${selectedItem.rotation || 0}&deg;</span>
              </div>
              <div class="flex items-center gap-2">
                <input type="range" min="0" max="360" step="15" id="slider-item-rot" class="form-control form-control-sm p-0 flex-1" value="${selectedItem.rotation || 0}" aria-label="Item rotation angle" />
                <button class="btn btn-xs btn-secondary" id="btn-quick-rot" title="Rotate +45°">+45&deg;</button>
              </div>
            </div>

            <!-- Color & Material -->
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Color & Material</label>
              <div class="flex items-center gap-2">
                <input type="color" id="inp-item-color" class="p-0 w-8 h-7 cursor-pointer border-none rounded" value="${selectedItem.color || '#475569'}" aria-label="Item color" />
                <input type="text" id="inp-item-mat" class="form-control form-control-sm flex-1 font-mono text-xs" value="${escapeHTML(selectedItem.material || 'Standard Finish')}" />
              </div>
            </div>

            <!-- Estimated Price -->
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Unit Cost (${currency})</label>
              <input type="number" step="50" min="0" id="inp-item-price" class="form-control form-control-sm font-mono" value="${selectedItem.price || 0}" />
            </div>

            <!-- Wall Clearances Readout -->
            ${dist ? `
              <div class="border-t pt-2 mt-1">
                <span class="text-xs font-bold uppercase text-muted block mb-1.5" style="font-size: 10px;">Perpendicular Clearances</span>
                <div class="grid grid-cols-2 gap-1.5 font-mono text-xs text-muted" style="font-size: 10.5px;">
                  <div class="card p-1 text-center">Left: <strong class="text-primary">${formatDimension(dist.left, unit)}</strong></div>
                  <div class="card p-1 text-center">Right: <strong class="text-primary">${formatDimension(dist.right, unit)}</strong></div>
                  <div class="card p-1 text-center">Top: <strong class="text-primary">${formatDimension(dist.top, unit)}</strong></div>
                  <div class="card p-1 text-center">Bottom: <strong class="text-primary">${formatDimension(dist.bottom, unit)}</strong></div>
                </div>
              </div>
            ` : ''}
          </div>
        ` : `
          <div class="card p-4 text-center text-muted text-xs flex flex-col items-center gap-2">
            ${getIcon('sofa', 'icon-sm text-muted')}
            <span>Select any furniture item on the canvas to inspect and edit its spatial properties.</span>
          </div>
        `}
      ` : ''}

      <!-- TAB 2: ROOM DIMENSIONS & SPECIFICATION -->
      ${activeTab === 'room' ? `
        <div class="card p-3 flex flex-col gap-2.5">
          <div class="flex items-center justify-between border-b pb-2">
            <span class="font-bold text-xs text-primary uppercase" style="letter-spacing: 0.5px;">Room Specification</span>
            <button class="btn btn-xs btn-secondary" id="btn-open-proj-settings" title="Edit Client & Project Title Block">
              ${getIcon('settings', 'icon-xs')} Project Info
            </button>
          </div>

          <!-- Dimensions (W x D x H) -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Room Width (${unit})</label>
              <input type="number" step="0.2" min="2" max="40" id="inp-room-width" class="form-control form-control-sm font-mono font-bold" value="${room.width}" />
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Room Depth (${unit})</label>
              <input type="number" step="0.2" min="2" max="40" id="inp-room-depth" class="form-control form-control-sm font-mono font-bold" value="${room.depth}" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Ceiling Clearance Height (${unit})</label>
            <input type="number" step="0.1" min="1.8" max="10" id="inp-room-height" class="form-control form-control-sm font-mono" value="${room.height || 2.85}" />
          </div>

          <!-- Floor Area Stats -->
          <div class="card p-2 flex items-center justify-between bg-elevated text-xs font-mono">
            <span class="text-muted">Floor Area:</span>
            <strong class="text-primary">${formatArea(totalFloorArea, unit)}</strong>
          </div>

          <!-- Flooring Material -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Floor Finish</label>
            <select id="select-floor-material" class="form-control form-control-sm font-semibold">
              ${Object.values(FLOOR_MATERIALS).map(mat => `
                <option value="${mat.id}" ${room.floorMaterial === mat.id ? 'selected' : ''}>${mat.name} (${formatPrice(mat.costPerSqM, currency)}/m²)</option>
              `).join('')}
            </select>
          </div>

          <!-- Wall Paint Color -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Wall Paint Finish</label>
            <div class="flex items-center gap-2">
              <input type="color" id="inp-wall-color" class="p-0 w-8 h-7 cursor-pointer border-none rounded" value="${room.wallColor || '#1e293b'}" aria-label="Wall paint color" />
              <span class="font-mono text-xs text-secondary" id="lbl-wall-color-hex">${room.wallColor || '#1e293b'}</span>
            </div>
          </div>

          <!-- Client & Project Metadata Box -->
          <div class="border-t pt-2 mt-1">
            <span class="text-xs font-bold uppercase text-muted block mb-1" style="font-size: 10px;">Project Metadata</span>
            <div class="text-xs text-muted flex flex-col gap-0.5" style="font-size: 11px;">
              <div><strong>Project:</strong> ${escapeHTML(room.name || 'Custom Room')}</div>
              <div><strong>Client:</strong> ${escapeHTML(room.client || 'Private Client')}</div>
              <div><strong>Firm:</strong> ${escapeHTML(room.firm || 'Studio Kōva Architecture')}</div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- TAB 3: BILL OF MATERIALS & TAKEOFF -->
      ${activeTab === 'takeoff' ? `
        <div class="card p-3 flex flex-col gap-2.5">
          <div class="flex items-center justify-between border-b pb-2">
            <span class="font-bold text-xs text-primary uppercase" style="letter-spacing: 0.5px;">Schedule & Takeoff</span>
            <div class="flex items-center gap-1">
              <button class="btn btn-xs btn-secondary" id="btn-copy-takeoff" title="Copy schedule to clipboard">${getIcon('copy', 'icon-xs')} Copy</button>
              <button class="btn btn-xs btn-primary" id="btn-export-bom-csv" title="Export CSV spreadsheet">${getIcon('download', 'icon-xs')} CSV</button>
            </div>
          </div>

          <!-- Cost Summary Badges -->
          <div class="grid grid-cols-2 gap-1.5 font-mono text-xs">
            <div class="card p-2 flex flex-col">
              <span class="text-muted" style="font-size: 10px;">Flooring Finish</span>
              <strong class="text-primary">${formatPrice(flooringCost, currency)}</strong>
            </div>
            <div class="card p-2 flex flex-col">
              <span class="text-muted" style="font-size: 10px;">Furnishing Total</span>
              <strong class="text-primary">${formatPrice(furnitureTotalCost, currency)}</strong>
            </div>
          </div>

          <div class="card p-2 flex items-center justify-between font-mono bg-elevated">
            <span class="text-xs font-bold text-muted">Grand Total:</span>
            <strong class="text-sm text-emerald font-bold">${formatPrice(grandTotalCost, currency)}</strong>
          </div>

          <!-- Items Table -->
          <div class="border-t pt-2">
            <span class="text-xs font-bold uppercase text-muted block mb-1.5" style="font-size: 10px;">Itemized Schedule (${items.length} fixtures)</span>
            <div class="flex flex-col gap-1 max-h-64 overflow-y-auto">
              ${items.map((it, idx) => `
                <div class="card p-1.5 flex items-center justify-between hover-elevated text-xs font-mono">
                  <div class="flex flex-col truncate">
                    <span class="font-bold text-primary truncate" style="font-size: 11px;">${idx + 1}. ${escapeHTML(it.name)}</span>
                    <span class="text-muted" style="font-size: 9.5px;">${formatDimension(it.width, unit)} &times; ${formatDimension(it.depth, unit)} &bull; ${escapeHTML(it.material || 'Standard')}</span>
                  </div>
                  <strong class="text-secondary ml-2 font-mono">${formatPrice(it.price || 0, currency)}</strong>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      ` : ''}

    </div>
  `;

  // Attach Tab Switcher Handlers
  container.querySelectorAll('.inspector-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onTabChange) onTabChange(btn.dataset.tab);
    });
  });

  // Attach Item Handlers
  if (selectedItem && activeTab === 'properties') {
    container.querySelector('#inp-item-width')?.addEventListener('change', (e) => {
      selectedItem.width = Math.max(0.1, parseFloat(e.target.value) || 1);
      if (onUpdateItem) onUpdateItem(selectedItem);
    });
    container.querySelector('#inp-item-depth')?.addEventListener('change', (e) => {
      selectedItem.depth = Math.max(0.1, parseFloat(e.target.value) || 1);
      if (onUpdateItem) onUpdateItem(selectedItem);
    });
    container.querySelector('#inp-item-x')?.addEventListener('change', (e) => {
      selectedItem.x = parseFloat(e.target.value) || 0;
      if (onUpdateItem) onUpdateItem(selectedItem);
    });
    container.querySelector('#inp-item-y')?.addEventListener('change', (e) => {
      selectedItem.y = parseFloat(e.target.value) || 0;
      if (onUpdateItem) onUpdateItem(selectedItem);
    });
    container.querySelector('#inp-item-price')?.addEventListener('change', (e) => {
      selectedItem.price = Math.max(0, parseFloat(e.target.value) || 0);
      if (onUpdateItem) onUpdateItem(selectedItem);
    });

    const rotSlider = container.querySelector('#slider-item-rot');
    const rotLabel = container.querySelector('#lbl-item-rot');
    rotSlider?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      selectedItem.rotation = val;
      if (rotLabel) rotLabel.innerHTML = `${val}&deg;`;
      if (onUpdateItem) onUpdateItem(selectedItem);
    });

    container.querySelector('#btn-quick-rot')?.addEventListener('click', () => {
      const newRot = ((selectedItem.rotation || 0) + 45) % 360;
      selectedItem.rotation = newRot;
      if (rotSlider) rotSlider.value = newRot;
      if (rotLabel) rotLabel.innerHTML = `${newRot}&deg;`;
      if (onUpdateItem) onUpdateItem(selectedItem);
    });

    container.querySelector('#inp-item-color')?.addEventListener('input', (e) => {
      selectedItem.color = e.target.value;
      if (onUpdateItem) onUpdateItem(selectedItem);
    });
    container.querySelector('#inp-item-mat')?.addEventListener('change', (e) => {
      selectedItem.material = e.target.value;
      if (onUpdateItem) onUpdateItem(selectedItem);
    });

    container.querySelector('#btn-inspect-dupe')?.addEventListener('click', () => {
      if (onDuplicateItem) onDuplicateItem(selectedItem.id);
    });
    container.querySelector('#btn-inspect-del')?.addEventListener('click', () => {
      if (onDeleteItem) onDeleteItem(selectedItem.id);
    });
  }

  // Attach Room Handlers
  if (activeTab === 'room') {
    container.querySelector('#inp-room-width')?.addEventListener('change', (e) => {
      room.width = Math.max(2, parseFloat(e.target.value) || 5);
      if (onUpdateRoom) onUpdateRoom(room);
    });
    container.querySelector('#inp-room-depth')?.addEventListener('change', (e) => {
      room.depth = Math.max(2, parseFloat(e.target.value) || 4);
      if (onUpdateRoom) onUpdateRoom(room);
    });
    container.querySelector('#inp-room-height')?.addEventListener('change', (e) => {
      room.height = Math.max(1.8, parseFloat(e.target.value) || 2.85);
      if (onUpdateRoom) onUpdateRoom(room);
    });
    container.querySelector('#select-floor-material')?.addEventListener('change', (e) => {
      room.floorMaterial = e.target.value;
      if (onUpdateRoom) onUpdateRoom(room);
    });
    container.querySelector('#inp-wall-color')?.addEventListener('input', (e) => {
      room.wallColor = e.target.value;
      const lbl = container.querySelector('#lbl-wall-color-hex');
      if (lbl) lbl.textContent = e.target.value;
      if (onUpdateRoom) onUpdateRoom(room);
    });
    container.querySelector('#btn-open-proj-settings')?.addEventListener('click', () => {
      if (onOpenProjectModal) onOpenProjectModal();
    });
  }

  // Attach Takeoff Handlers
  if (activeTab === 'takeoff') {
    container.querySelector('#btn-export-bom-csv')?.addEventListener('click', () => {
      if (onExportBOM) onExportBOM();
    });
    container.querySelector('#btn-copy-takeoff')?.addEventListener('click', () => {
      if (onCopyBOM) onCopyBOM();
    });
  }
}


/* --- MODULE: js/app.js --- */
/**
 * RoomPlanr - Master Architectural Workstation Orchestrator
 * Integrates 2D CAD Floor Plan, 3D Isometric Renderer, Collision Engine, Catalog, Multi-Scenarios, Modals, and Exports.
 */












class RoomPlanrApp {
  constructor() {
    this.canvas = document.getElementById('planr-canvas');
    this.renderer2D = new Renderer2D(this.canvas);
    this.renderer3D = new Renderer3D(this.canvas);

    // Active project state
    this.room = JSON.parse(JSON.stringify(SAMPLE_ROOMS.studio));
    this.activeScenarioId = this.room.activeScenarioId || 'scenario_a';
    this.selectedItemId = this.getCurrentItems()[0]?.id || null;

    // View & Editor Settings
    this.viewMode = '2D'; // '2D' or '3D'
    this.unit = UNITS.METERS;
    this.currency = 'USD';
    this.gridSnap = 0.10; // 10cm grid
    this.showGrid = true;
    this.showDimensions = true;

    // UI Drawer state (Mobile / Responsive)
    this.catalogCategory = 'All';
    this.catalogSearch = '';
    this.inspectorTab = 'properties';
    this.isCatalogDrawerOpen = false;
    this.isInspectorDrawerOpen = false;

    // Pointer Interaction Modes
    this.interactionMode = 'none'; // 'none', 'move', 'rotate', 'pan'
    this.panStart = { x: 0, y: 0 };
    this.dragOffset = { x: 0, y: 0 };
    this.initialTransform = { x: 0, y: 0, width: 1, depth: 1, rotation: 0 };

    // Touch gesture state
    this.touchPinchDist = 0;
    this.touchStartPoint = { x: 0, y: 0 };

    // History stack
    this.undoStack = [];
    this.redoStack = [];
  }

  async init() {
    await db.init();

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    this.setupToolbar();
    this.setupCanvasInteractions();
    this.setupTouchInteractions();
    this.setupShortcuts();
    this.setupModals();
    this.renderAll();
    this.centerCamera();
    this.updateUndoRedoButtons();
  }

  getCurrentItems() {
    if (!this.room.scenarios || !this.room.scenarios[this.activeScenarioId]) {
      const firstId = Object.keys(this.room.scenarios || {})[0] || 'scenario_a';
      if (!this.room.scenarios || Object.keys(this.room.scenarios).length === 0) {
        this.room.scenarios = { scenario_a: { id: 'scenario_a', name: 'Layout A', items: [] } };
        this.activeScenarioId = 'scenario_a';
      } else {
        this.activeScenarioId = firstId;
      }
    }
    return this.room.scenarios[this.activeScenarioId].items || [];
  }

  handleResize() {
    const container = document.getElementById('canvas-workspace-wrap');
    if (container && this.canvas) {
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 600;
      this.renderer2D.resize(w, h);
      this.renderer3D.resize(w, h);
      this.requestRender();
    }
  }

  requestRender() {
    const items = this.getCurrentItems();
    const overlappingIds = new Set();

    // Check collisions
    for (let i = 0; i < items.length; i++) {
      if (checkOutsideRoom(items[i], this.room.width, this.room.depth)) {
        overlappingIds.add(items[i].id);
      }
      for (let j = i + 1; j < items.length; j++) {
        if (checkFurnitureOverlap(items[i], items[j])) {
          overlappingIds.add(items[i].id);
          overlappingIds.add(items[j].id);
        }
      }
    }

    if (this.viewMode === '2D') {
      this.renderer2D.render({
        room: this.room,
        items,
        selectedItemId: this.selectedItemId,
        overlappingItemIds: overlappingIds,
        unit: this.unit,
        showGrid: this.showGrid,
        showDimensions: this.showDimensions
      });
    } else {
      this.renderer3D.render({
        room: this.room,
        items,
        selectedItemId: this.selectedItemId
      });
    }

    this.updateStatusBar(overlappingIds.size);
  }

  renderAll() {
    this.renderCatalog();
    this.renderInspector();
    this.updateScenarioTabs();
    this.updateUndoRedoButtons();
    this.requestRender();
  }

  centerCamera() {
    const cw = this.renderer2D.logicalWidth || 800;
    const ch = this.renderer2D.logicalHeight || 600;
    const rw = this.room.width;
    const rd = this.room.depth;
    const zoom = this.renderer2D.camera.zoom;

    this.renderer2D.camera.x = Math.round((cw - rw * zoom) / 2);
    this.renderer2D.camera.y = Math.round((ch - rd * zoom) / 2);
    this.renderer3D.camera.x = 0;
    this.renderer3D.camera.y = 0;
    this.requestRender();
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type} animate-fade-in`;
    toast.innerHTML = `
      <span>${escapeHTML(message)}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  // --- Toolbar Setup ---
  setupToolbar() {
    // 2D / 3D Mode Toggle Buttons
    const btn2d = document.getElementById('btn-mode-2d');
    const btn3d = document.getElementById('btn-mode-3d');

    btn2d?.addEventListener('click', () => {
      this.viewMode = '2D';
      btn2d.classList.add('active');
      btn3d?.classList.remove('active');
      this.requestRender();
      this.showToast('Switched to 2D CAD Floor Plan View');
    });

    btn3d?.addEventListener('click', () => {
      this.viewMode = '3D';
      btn3d.classList.add('active');
      btn2d?.classList.remove('active');
      this.requestRender();
      this.showToast('Switched to 3D Isometric Perspective Preview');
    });

    // Sample Room Selector
    document.getElementById('select-sample-room')?.addEventListener('change', (e) => {
      const key = e.target.value;
      if (SAMPLE_ROOMS[key]) {
        this.recordHistory('Load Sample Room');
        this.room = JSON.parse(JSON.stringify(SAMPLE_ROOMS[key]));
        this.activeScenarioId = this.room.activeScenarioId || Object.keys(this.room.scenarios)[0];
        this.selectedItemId = this.getCurrentItems()[0]?.id || null;
        this.centerCamera();
        this.renderAll();
        this.autoSave();
        this.showToast(`Loaded: ${this.room.name}`);
      }
    });

    // Unit Selector
    document.getElementById('select-display-unit')?.addEventListener('change', (e) => {
      this.unit = e.target.value;
      this.renderAll();
      this.showToast(`Unit changed to ${this.unit.toUpperCase()}`);
    });

    // Grid Snapping Selector
    document.getElementById('select-grid-snap')?.addEventListener('change', (e) => {
      this.gridSnap = parseFloat(e.target.value);
      this.showToast(`Grid snap: ${this.gridSnap === 0 ? 'Disabled' : `${this.gridSnap * 100} cm`}`);
    });

    // Toggle Grid
    document.getElementById('btn-toggle-grid')?.addEventListener('click', (e) => {
      this.showGrid = !this.showGrid;
      e.currentTarget.classList.toggle('active', this.showGrid);
      this.requestRender();
    });

    // Toggle Dimensions
    document.getElementById('btn-toggle-dims')?.addEventListener('click', (e) => {
      this.showDimensions = !this.showDimensions;
      e.currentTarget.classList.toggle('active', this.showDimensions);
      this.requestRender();
    });

    // Undo / Redo
    document.getElementById('btn-undo')?.addEventListener('click', () => this.undo());
    document.getElementById('btn-redo')?.addEventListener('click', () => this.redo());

    // Zoom Controls
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
      this.renderer2D.camera.zoom = Math.min(220, this.renderer2D.camera.zoom * 1.2);
      this.renderer3D.camera.zoom = Math.min(120, this.renderer3D.camera.zoom * 1.2);
      this.requestRender();
    });
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
      this.renderer2D.camera.zoom = Math.max(15, this.renderer2D.camera.zoom * 0.8);
      this.renderer3D.camera.zoom = Math.max(12, this.renderer3D.camera.zoom * 0.8);
      this.requestRender();
    });
    document.getElementById('btn-center-room')?.addEventListener('click', () => {
      this.centerCamera();
      this.showToast('Camera centered on room');
    });

    // Mobile Drawer Toggles
    document.getElementById('btn-mobile-catalog')?.addEventListener('click', () => {
      this.toggleCatalogDrawer();
    });
    document.getElementById('btn-mobile-inspector')?.addEventListener('click', () => {
      this.toggleInspectorDrawer();
    });

    // Shortcuts / Help Modal Trigger
    document.getElementById('btn-open-help')?.addEventListener('click', () => {
      this.openModal('modal-shortcuts');
    });

    // Export Blueprint Modal Trigger
    document.getElementById('btn-open-export-modal')?.addEventListener('click', () => {
      this.openModal('modal-export-blueprint');
    });

    // Save JSON Backup
    document.getElementById('btn-export-plan-json')?.addEventListener('click', () => {
      const json = JSON.stringify(this.room, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (this.room.name || 'room_project').toLowerCase().replace(/[^a-z0-9]+/g, '_') + '.roomplanr.json';
      a.click();
      this.showToast('Project JSON downloaded successfully', 'success');
    });

    // Import Project JSON
    const importInput = document.getElementById('file-import-plan');
    document.getElementById('btn-import-plan-json')?.addEventListener('click', () => importInput?.click());
    importInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (parsed && typeof parsed.width === 'number' && parsed.scenarios) {
            this.recordHistory('Import Project');
            this.room = parsed;
            this.activeScenarioId = this.room.activeScenarioId || Object.keys(this.room.scenarios)[0];
            this.selectedItemId = this.getCurrentItems()[0]?.id || null;
            this.centerCamera();
            this.renderAll();
            this.autoSave();
            this.showToast(`Imported project: ${this.room.name || 'Custom Plan'}`, 'success');
          } else {
            this.showToast('Invalid RoomPlanr project file format', 'error');
          }
        } catch (err) {
          this.showToast('Failed to parse JSON file: ' + err.message, 'error');
        }
      };
      reader.readAsText(file);
      importInput.value = '';
    });
  }

  toggleCatalogDrawer() {
    this.isCatalogDrawerOpen = !this.isCatalogDrawerOpen;
    document.getElementById('furniture-catalog-container')?.classList.toggle('drawer-open', this.isCatalogDrawerOpen);
    if (this.isCatalogDrawerOpen && this.isInspectorDrawerOpen) {
      this.toggleInspectorDrawer();
    }
  }

  toggleInspectorDrawer() {
    this.isInspectorDrawerOpen = !this.isInspectorDrawerOpen;
    document.getElementById('property-inspector-container')?.classList.toggle('drawer-open', this.isInspectorDrawerOpen);
    if (this.isInspectorDrawerOpen && this.isCatalogDrawerOpen) {
      this.toggleCatalogDrawer();
    }
  }

  // --- Pointer & Spatial Interactions ---
  setupCanvasInteractions() {
    const canvas = this.canvas;

    const screenToWorld = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const sx = clientX - rect.left;
      const sy = clientY - rect.top;
      const scale = this.renderer2D.camera.zoom;
      const wx = (sx - this.renderer2D.camera.x) / scale;
      const wy = (sy - this.renderer2D.camera.y) / scale;
      return { wx, wy, sx, sy };
    };

    canvas.addEventListener('mousedown', (e) => {
      const { wx, wy, sx, sy } = screenToWorld(e.clientX, e.clientY);

      // Pan with Middle Click or Space/Shift/Alt Drag
      if (e.button === 1 || e.shiftKey || e.altKey || e.spaceKey) {
        this.interactionMode = 'pan';
        this.panStart = { x: sx, y: sy };
        return;
      }

      if (e.button !== 0) return; // Left Click only

      if (this.viewMode === '3D') {
        this.interactionMode = 'pan';
        this.panStart = { x: sx, y: sy };
        return;
      }

      const items = this.getCurrentItems();
      const activeItem = items.find(i => i.id === this.selectedItemId);

      // 1. Check if clicked rotation handle on active item
      if (activeItem) {
        const scale = this.renderer2D.camera.zoom;
        const rad = ((activeItem.rotation || 0) * Math.PI) / 180;
        const rotDist = 24 / scale;
        const hx = activeItem.x + Math.sin(rad) * (activeItem.depth / 2 + rotDist);
        const hy = activeItem.y - Math.cos(rad) * (activeItem.depth / 2 + rotDist);

        const distToRot = Math.hypot(wx - hx, wy - hy);
        if (distToRot <= 14 / scale) {
          this.recordHistory('Rotate Item');
          this.interactionMode = 'rotate';
          this.initialTransform = { ...activeItem };
          return;
        }
      }

      // 2. Check if clicked furniture item (Rotated hit test)
      let clickedItem = null;
      for (let i = items.length - 1; i >= 0; i--) {
        if (isPointInsideRotatedItem(wx, wy, items[i])) {
          clickedItem = items[i];
          break;
        }
      }

      if (clickedItem) {
        this.recordHistory('Move Item');
        this.selectedItemId = clickedItem.id;
        this.interactionMode = 'move';
        this.dragOffset = { x: wx - clickedItem.x, y: wy - clickedItem.y };
        this.inspectorTab = 'properties';
        this.renderAll();
      } else {
        this.selectedItemId = null;
        this.interactionMode = 'none';
        this.renderAll();
      }
    });

    window.addEventListener('mousemove', (e) => {
      const { wx, wy, sx, sy } = screenToWorld(e.clientX, e.clientY);

      if (this.interactionMode === 'pan') {
        if (this.viewMode === '2D') {
          this.renderer2D.camera.x += sx - this.panStart.x;
          this.renderer2D.camera.y += sy - this.panStart.y;
        } else {
          this.renderer3D.camera.x += sx - this.panStart.x;
          this.renderer3D.camera.y += sy - this.panStart.y;
        }
        this.panStart = { x: sx, y: sy };
        this.requestRender();
        return;
      }

      if (this.interactionMode === 'move' && this.selectedItemId) {
        const activeItem = this.getCurrentItems().find(i => i.id === this.selectedItemId);
        if (activeItem) {
          let targetX = wx - this.dragOffset.x;
          let targetY = wy - this.dragOffset.y;

          if (this.gridSnap > 0) {
            targetX = snapToGrid(targetX, this.gridSnap);
            targetY = snapToGrid(targetY, this.gridSnap);
          }

          activeItem.x = targetX;
          activeItem.y = targetY;
          this.requestRender();
          this.renderInspector();
        }
        return;
      }

      if (this.interactionMode === 'rotate' && this.selectedItemId) {
        const activeItem = this.getCurrentItems().find(i => i.id === this.selectedItemId);
        if (activeItem) {
          const angleRad = Math.atan2(wy - activeItem.y, wx - activeItem.x);
          let degrees = Math.round((angleRad * 180) / Math.PI) + 90;
          if (degrees < 0) degrees += 360;

          // Snap to 15 degrees unless holding Shift
          if (!e.shiftKey) {
            degrees = Math.round(degrees / 15) * 15;
          }
          activeItem.rotation = degrees % 360;
          this.requestRender();
          this.renderInspector();
        }
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.interactionMode === 'move' || this.interactionMode === 'rotate') {
        this.autoSave();
        this.renderAll();
      }
      this.interactionMode = 'none';
    });

    // Zoom on mouse wheel
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;

      if (this.viewMode === '2D') {
        const { sx, sy } = screenToWorld(e.clientX, e.clientY);
        const oldZoom = this.renderer2D.camera.zoom;
        const newZoom = Math.max(15, Math.min(220, oldZoom * zoomFactor));

        this.renderer2D.camera.x = sx - (sx - this.renderer2D.camera.x) * (newZoom / oldZoom);
        this.renderer2D.camera.y = sy - (sy - this.renderer2D.camera.y) * (newZoom / oldZoom);
        this.renderer2D.camera.zoom = newZoom;
      } else {
        this.renderer3D.camera.zoom = Math.max(12, Math.min(120, this.renderer3D.camera.zoom * zoomFactor));
      }

      this.requestRender();
    });
  }

  // --- Touch Support for Mobile & Tablets ---
  setupTouchInteractions() {
    const canvas = this.canvas;
    if (!canvas) return;

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const sx = touch.clientX - rect.left;
        const sy = touch.clientY - rect.top;
        const scale = this.renderer2D.camera.zoom;
        const wx = (sx - this.renderer2D.camera.x) / scale;
        const wy = (sy - this.renderer2D.camera.y) / scale;

        const items = this.getCurrentItems();
        let clickedItem = null;
        for (let i = items.length - 1; i >= 0; i--) {
          if (isPointInsideRotatedItem(wx, wy, items[i])) {
            clickedItem = items[i];
            break;
          }
        }

        if (clickedItem) {
          this.recordHistory('Touch Move Item');
          this.selectedItemId = clickedItem.id;
          this.interactionMode = 'move';
          this.dragOffset = { x: wx - clickedItem.x, y: wy - clickedItem.y };
          this.renderAll();
        } else {
          this.interactionMode = 'pan';
          this.panStart = { x: sx, y: sy };
        }
      } else if (e.touches.length === 2) {
        this.interactionMode = 'pinch';
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        this.touchPinchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();

      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const sx = touch.clientX - rect.left;
        const sy = touch.clientY - rect.top;
        const scale = this.renderer2D.camera.zoom;
        const wx = (sx - this.renderer2D.camera.x) / scale;
        const wy = (sy - this.renderer2D.camera.y) / scale;

        if (this.interactionMode === 'move' && this.selectedItemId) {
          const activeItem = this.getCurrentItems().find(i => i.id === this.selectedItemId);
          if (activeItem) {
            let targetX = wx - this.dragOffset.x;
            let targetY = wy - this.dragOffset.y;
            if (this.gridSnap > 0) {
              targetX = snapToGrid(targetX, this.gridSnap);
              targetY = snapToGrid(targetY, this.gridSnap);
            }
            activeItem.x = targetX;
            activeItem.y = targetY;
            this.requestRender();
          }
        } else if (this.interactionMode === 'pan') {
          this.renderer2D.camera.x += sx - this.panStart.x;
          this.renderer2D.camera.y += sy - this.panStart.y;
          this.panStart = { x: sx, y: sy };
          this.requestRender();
        }
      } else if (e.touches.length === 2 && this.interactionMode === 'pinch') {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        const factor = dist / (this.touchPinchDist || dist);
        this.touchPinchDist = dist;

        if (this.viewMode === '2D') {
          this.renderer2D.camera.zoom = Math.max(15, Math.min(220, this.renderer2D.camera.zoom * factor));
        } else {
          this.renderer3D.camera.zoom = Math.max(12, Math.min(120, this.renderer3D.camera.zoom * factor));
        }
        this.requestRender();
      }
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
      if (this.interactionMode === 'move') {
        this.autoSave();
        this.renderAll();
      }
      this.interactionMode = 'none';
    });
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const activeItem = this.getCurrentItems().find(i => i.id === this.selectedItemId);

      // Rotate with 'R'
      if ((e.key === 'r' || e.key === 'R') && activeItem) {
        this.recordHistory('Rotate Item');
        activeItem.rotation = ((activeItem.rotation || 0) + 45) % 360;
        this.renderAll();
        this.autoSave();
        this.showToast(`Rotated to ${activeItem.rotation}°`);
      }

      // Delete with 'Delete' / 'Backspace'
      if ((e.key === 'Delete' || e.key === 'Backspace') && activeItem) {
        this.deleteSelectedItem();
      }

      // Duplicate with 'Ctrl+D'
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (activeItem) this.duplicateSelectedItem();
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

      // Deselect with 'Escape'
      if (e.key === 'Escape') {
        this.closeAllModals();
        if (this.selectedItemId) {
          this.selectedItemId = null;
          this.renderAll();
        }
      }

      // Help with '?'
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        this.openModal('modal-shortcuts');
      }

      // Center with 'C'
      if ((e.key === 'c' || e.key === 'C') && !e.ctrlKey && !e.metaKey) {
        this.centerCamera();
      }

      // Switch 2D/3D with 1 / 2
      if (e.key === '1') {
        document.getElementById('btn-mode-2d')?.click();
      }
      if (e.key === '2') {
        document.getElementById('btn-mode-3d')?.click();
      }
    });
  }

  // --- Scenario Management ---
  updateScenarioTabs() {
    const container = document.getElementById('scenarios-tab-bar');
    if (!container) return;

    const scenarios = Object.values(this.room.scenarios || {});

    container.innerHTML = `
      <div class="flex items-center gap-1" role="tablist" aria-label="Layout scenarios">
        ${scenarios.map(sc => `
          <button class="btn btn-xs ${this.activeScenarioId === sc.id ? 'btn-primary' : 'btn-secondary'} btn-scenario-tab" data-id="${sc.id}" role="tab" aria-selected="${this.activeScenarioId === sc.id}">
            ${escapeHTML(sc.name)}
          </button>
        `).join('')}
        <button class="btn btn-xs btn-secondary" id="btn-add-scenario" title="Duplicate Current Scenario into New Layout">+ Scenario</button>
      </div>
    `;

    container.querySelectorAll('.btn-scenario-tab').forEach(b => {
      b.addEventListener('click', () => {
        this.activeScenarioId = b.dataset.id;
        this.selectedItemId = this.getCurrentItems()[0]?.id || null;
        this.renderAll();
        this.autoSave();
        this.showToast(`Switched to: ${this.room.scenarios[this.activeScenarioId]?.name || 'Layout'}`);
      });
    });

    container.querySelector('#btn-add-scenario')?.addEventListener('click', () => {
      this.duplicateScenario();
    });
  }

  duplicateScenario() {
    this.recordHistory('Duplicate Scenario');
    const current = this.room.scenarios[this.activeScenarioId];
    const newId = 'scenario_' + Math.random().toString(36).substr(2, 6);
    const count = Object.keys(this.room.scenarios).length + 1;

    this.room.scenarios[newId] = {
      id: newId,
      name: `Layout ${String.fromCharCode(64 + count)}`,
      items: JSON.parse(JSON.stringify(current.items || []))
    };

    this.activeScenarioId = newId;
    this.renderAll();
    this.autoSave();
    this.showToast(`Created Layout ${String.fromCharCode(64 + count)}`, 'success');
  }

  // --- Panels ---
  renderCatalog() {
    const container = document.getElementById('furniture-catalog-container');
    if (!container) return;

    renderFurnitureCatalog(container, {
      unit: this.unit,
      currency: this.currency,
      activeCategory: this.catalogCategory,
      searchQuery: this.catalogSearch,
      onCategoryChange: (cat) => {
        this.catalogCategory = cat;
        this.renderCatalog();
      },
      onSearchChange: (q) => {
        this.catalogSearch = q;
        this.renderCatalog();
      },
      onAddItem: (itemDef) => {
        this.recordHistory('Add Furniture Item');
        const newItem = {
          ...itemDef,
          id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          x: snapToGrid(this.room.width / 2, this.gridSnap),
          y: snapToGrid(this.room.depth / 2, this.gridSnap),
          rotation: 0
        };
        this.getCurrentItems().push(newItem);
        this.selectedItemId = newItem.id;
        this.inspectorTab = 'properties';
        this.renderAll();
        this.autoSave();
        this.showToast(`Added ${newItem.name} to plan`, 'success');
      },
      onOpenCustomModal: () => {
        this.openModal('modal-custom-item');
      }
    });
  }

  renderInspector() {
    const container = document.getElementById('property-inspector-container');
    if (!container) return;

    const activeItem = this.getCurrentItems().find(i => i.id === this.selectedItemId);

    renderPropertyInspector(container, {
      room: this.room,
      selectedItem: activeItem,
      activeTab: this.inspectorTab,
      unit: this.unit,
      currency: this.currency,
      onTabChange: (tab) => {
        this.inspectorTab = tab;
        this.renderInspector();
      },
      onUpdateRoom: () => {
        this.renderAll();
        this.autoSave();
      },
      onUpdateItem: () => {
        this.requestRender();
        this.autoSave();
      },
      onDuplicateItem: () => this.duplicateSelectedItem(),
      onDeleteItem: () => this.deleteSelectedItem(),
      onExportBOM: () => this.exportBOMCSV(),
      onCopyBOM: () => this.copyBOMToClipboard(),
      onOpenProjectModal: () => this.openModal('modal-project-info')
    });
  }

  duplicateSelectedItem() {
    const items = this.getCurrentItems();
    const target = items.find(i => i.id === this.selectedItemId);
    if (!target) return;

    this.recordHistory('Duplicate Item');
    const clone = JSON.parse(JSON.stringify(target));
    clone.id = 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    clone.x = Math.min(this.room.width - (clone.width || 1) / 2, target.x + 0.3);
    clone.y = Math.min(this.room.depth - (clone.depth || 1) / 2, target.y + 0.3);

    items.push(clone);
    this.selectedItemId = clone.id;
    this.renderAll();
    this.autoSave();
    this.showToast(`Duplicated: ${clone.name}`, 'success');
  }

  deleteSelectedItem() {
    const items = this.getCurrentItems();
    const target = items.find(i => i.id === this.selectedItemId);
    if (!target) return;

    this.recordHistory('Delete Item');
    this.room.scenarios[this.activeScenarioId].items = items.filter(i => i.id !== this.selectedItemId);
    this.selectedItemId = this.getCurrentItems()[0]?.id || null;
    this.renderAll();
    this.autoSave();
    this.showToast(`Removed: ${target.name}`);
  }

  // --- Bill of Materials Takeoff Exports ---
  exportBOMCSV() {
    const items = this.getCurrentItems();
    const floorMat = FLOOR_MATERIALS[this.room.floorMaterial] || FLOOR_MATERIALS.oak;
    const floorArea = (this.room.width * this.room.depth).toFixed(2);
    const floorCost = (floorArea * (floorMat.costPerSqM || 100)).toFixed(2);

    let csv = `Item No,Item Name,Category,Width (m),Depth (m),Height (m),Finish/Material,Unit Price (${this.currency}),SKU\n`;
    items.forEach((it, idx) => {
      csv += `${idx + 1},"${it.name}","${it.category || 'General'}",${it.width},${it.depth},${it.height || 0.8},"${it.material || 'Standard'}",${it.price || 0},"${it.sku || 'N/A'}"\n`;
    });
    csv += `\nFlooring Finish,"${floorMat.name}",Finishes,${this.room.width},${this.room.depth},0,"${floorMat.name}",${floorCost},"FLR-${floorMat.id.toUpperCase()}"\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(this.room.name || 'room').toLowerCase().replace(/[^a-z0-9]+/g, '_')}_takeoff_schedule.csv`;
    a.click();
    this.showToast('Schedule exported as CSV', 'success');
  }

  copyBOMToClipboard() {
    const items = this.getCurrentItems();
    let text = `ROOMPLANR SCHEDULE: ${this.room.name || 'Room Project'}\n`;
    text += `Client: ${this.room.client || 'Private Client'} | Firm: ${this.room.firm || 'Studio Kōva'}\n`;
    text += `Room: ${this.room.width.toFixed(2)}m × ${this.room.depth.toFixed(2)}m (${(this.room.width * this.room.depth).toFixed(1)} m²)\n\n`;
    text += `ITEMS TAKEOFF:\n`;

    let total = 0;
    items.forEach((it, idx) => {
      text += `${idx + 1}. ${it.name} — ${it.width}m × ${it.depth}m (${it.material || 'Standard'}) - ${formatPrice(it.price || 0, this.currency)}\n`;
      total += (it.price || 0);
    });
    text += `\nTotal Furnishing Cost: ${formatPrice(total, this.currency)}\n`;

    navigator.clipboard.writeText(text).then(() => {
      this.showToast('Takeoff copied to clipboard', 'success');
    }).catch(() => {
      this.showToast('Failed to copy to clipboard', 'error');
    });
  }

  // --- Modal Management ---
  setupModals() {
    // Backdrop click / Close buttons
    document.querySelectorAll('.modal-backdrop, .modal-close-btn').forEach(el => {
      el.addEventListener('click', () => this.closeAllModals());
    });

    document.querySelectorAll('.modal-dialog-content').forEach(el => {
      el.addEventListener('click', (e) => e.stopPropagation());
    });

    // Custom Item Form Submit
    const customForm = document.getElementById('form-create-custom-item');
    customForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('custom-item-name')?.value || 'Custom Fixture';
      const category = document.getElementById('custom-item-cat')?.value || 'Custom';
      const width = parseFloat(document.getElementById('custom-item-width')?.value) || 1.2;
      const depth = parseFloat(document.getElementById('custom-item-depth')?.value) || 0.8;
      const height = parseFloat(document.getElementById('custom-item-height')?.value) || 0.75;
      const material = document.getElementById('custom-item-material')?.value || 'Bespoke Finish';
      const color = document.getElementById('custom-item-color')?.value || '#38bdf8';
      const price = parseFloat(document.getElementById('custom-item-price')?.value) || 500;

      const customItem = {
        id: 'custom_' + Date.now(),
        type: 'custom',
        name,
        category,
        width,
        depth,
        height,
        material,
        color,
        price,
        sku: 'CUS-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
        x: snapToGrid(this.room.width / 2, this.gridSnap),
        y: snapToGrid(this.room.depth / 2, this.gridSnap),
        rotation: 0
      };

      this.recordHistory('Create Custom Item');
      this.getCurrentItems().push(customItem);
      this.selectedItemId = customItem.id;
      this.inspectorTab = 'properties';
      this.renderAll();
      this.autoSave();
      this.closeAllModals();
      this.showToast(`Custom item "${name}" created and placed`, 'success');
    });

    // Project Info Form Submit
    const projectForm = document.getElementById('form-project-settings');
    projectForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.recordHistory('Edit Project Info');
      this.room.name = document.getElementById('proj-input-name')?.value || 'Architectural Project';
      this.room.client = document.getElementById('proj-input-client')?.value || 'Client';
      this.room.firm = document.getElementById('proj-input-firm')?.value || 'Studio Kōva Architecture';
      this.room.address = document.getElementById('proj-input-address')?.value || '';
      this.room.notes = document.getElementById('proj-input-notes')?.value || '';

      this.renderAll();
      this.autoSave();
      this.closeAllModals();
      this.showToast('Project specification updated', 'success');
    });

    // Export High-Res Blueprint
    document.getElementById('btn-export-highres-png')?.addEventListener('click', () => {
      this.exportHighResBlueprint();
      this.closeAllModals();
    });

    // Print Blueprint Sheet
    document.getElementById('btn-print-blueprint')?.addEventListener('click', () => {
      window.print();
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (modalId === 'modal-project-info') {
      const nameInp = document.getElementById('proj-input-name');
      const clientInp = document.getElementById('proj-input-client');
      const firmInp = document.getElementById('proj-input-firm');
      const addrInp = document.getElementById('proj-input-address');
      const notesInp = document.getElementById('proj-input-notes');

      if (nameInp) nameInp.value = this.room.name || '';
      if (clientInp) clientInp.value = this.room.client || '';
      if (firmInp) firmInp.value = this.room.firm || '';
      if (addrInp) addrInp.value = this.room.address || '';
      if (notesInp) notesInp.value = this.room.notes || '';
    }

    modal.classList.add('modal-visible');
  }

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('modal-visible'));
  }

  exportHighResBlueprint() {
    // Generate high-resolution branded architectural const exportCanvas = document.createElement('canvas');
    const widthPx = 2400;
    const heightPx = 1600;
    exportCanvas.width = widthPx;
    exportCanvas.height = heightPx;
    const ctx = exportCanvas.getContext('2d');

    // Background
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, widthPx, heightPx);

    // Architectural Border & Title Block
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, widthPx - 60, heightPx - 60);

    // Title Block Box (Bottom)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(30, heightPx - 160, widthPx - 60, 130);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, heightPx - 160, widthPx - 60, 130);

    // Title Block Content
    ctx.fillStyle = '#f8fafc';
    ctx.font = "bold 26px 'Inter', sans-serif";
    ctx.fillText(this.room.name || 'Architectural Floor Plan', 60, heightPx - 105);

    ctx.fillStyle = '#94a3b8';
    ctx.font = "16px 'Inter', sans-serif";
    ctx.fillText(`Client: ${this.room.client || 'Private Residence'}  |  Firm: ${this.room.firm || 'Studio Kōva Architecture'}`, 60, heightPx - 65);
    ctx.fillText(`Location: ${this.room.address || 'Standard Specification'}  |  Active Layout: ${this.room.scenarios[this.activeScenarioId]?.name || 'Layout A'}`, 60, heightPx - 38);

    ctx.fillStyle = '#38bdf8';
    ctx.font = "bold 18px 'JetBrains Mono', monospace";
    ctx.textAlign = 'right';
    ctx.fillText(`Area: ${formatArea(this.room.width * this.room.depth, this.unit)}  |  Scale 1:50 @ A3`, widthPx - 60, heightPx - 105);
    ctx.fillStyle = '#64748b';
    ctx.font = "14px 'JetBrains Mono', monospace";
    ctx.fillText(`Generated by RoomPlanr Spatial Workstation  |  ${new Date().toLocaleDateString()}`, widthPx - 60, heightPx - 65);
    ctx.textAlign = 'left';

    // Render Room into High-Res Center
    const exportRenderer = new Renderer2D(exportCanvas);
    exportRenderer.camera.zoom = Math.min(
      (widthPx - 300) / this.room.width,
      (heightPx - 350) / this.room.depth
    ) * 0.82;
    exportRenderer.camera.x = Math.round((widthPx - this.room.width * exportRenderer.camera.zoom) / 2);
    exportRenderer.camera.y = Math.round((heightPx - 160 - this.room.depth * exportRenderer.camera.zoom) / 2);

    exportRenderer.render({
      room: this.room,
      items: this.getCurrentItems(),
      unit: this.unit,
      showGrid: true,
      showDimensions: true
    });

    const url = exportCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(this.room.name || 'blueprint').toLowerCase().replace(/[^a-z0-9]+/g, '_')}_blueprint.png`;
    a.click();
    this.showToast('High-resolution architectural blueprint exported', 'success');
  }

  // --- History & Persistence ---
  recordHistory(action = 'Edit') {
    this.undoStack.push(JSON.stringify(this.room));
    if (this.undoStack.length > 30) this.undoStack.shift();
    this.redoStack = [];
    this.updateUndoRedoButtons();
  }

  undo() {
    if (this.undoStack.length === 0) return;
    this.redoStack.push(JSON.stringify(this.room));
    this.room = JSON.parse(this.undoStack.pop());
    this.renderAll();
    this.autoSave();
    this.showToast('Undo performed');
  }

  redo() {
    if (this.redoStack.length === 0) return;
    this.undoStack.push(JSON.stringify(this.room));
    this.room = JSON.parse(this.redoStack.pop());
    this.renderAll();
    this.autoSave();
    this.showToast('Redo performed');
  }

  updateUndoRedoButtons() {
    const btnUndo = document.getElementById('btn-undo');
    const btnRedo = document.getElementById('btn-redo');
    if (btnUndo) btnUndo.disabled = this.undoStack.length === 0;
    if (btnRedo) btnRedo.disabled = this.redoStack.length === 0;
  }

  autoSave() {
    db.saveRoom(this.room);
  }

  updateStatusBar(overlapCount = 0) {
    const statusEl = document.getElementById('status-bar-readout');
    if (statusEl) {
      const items = this.getCurrentItems();
      const area = (this.room.width * this.room.depth).toFixed(1);
      statusEl.innerHTML = `Room: <strong>${formatDimension(this.room.width, this.unit)} &times; ${formatDimension(this.room.depth, this.unit)}</strong> (${area} m&sup2;) &bull; Fixtures: <strong>${items.length} items</strong> ${overlapCount > 0 ? `&bull; <span class="text-amber font-bold">&Delta; ${overlapCount} Collision / Boundary Warnings</span>` : ''}`;
    }
  }
}

// Bootstrap
function startRoomPlanr() {
  const app = new RoomPlanrApp();
  window.roomPlanrApp = app;
  app.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startRoomPlanr);
} else {
  startRoomPlanr();
}


})();
