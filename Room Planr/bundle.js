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
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
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
 * Real-world unit conversion (m, cm, ft/in), grid snapping, and dimensional formatting.
 */

const UNITS = {
  METERS: 'm',
  CENTIMETERS: 'cm',
  FEET_INCHES: 'ft'
};

/**
 * Format real-world meter value into target unit string
 */
function formatDimension(meters, unit = UNITS.METERS) {
  if (meters === null || meters === undefined || isNaN(meters)) return '0.00 m';

  if (unit === UNITS.CENTIMETERS) {
    return `${Math.round(meters * 100)} cm`;
  }

  if (unit === UNITS.FEET_INCHES) {
    const totalInches = meters * 39.3701;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}′ ${inches}″`;
  }

  return `${meters.toFixed(2)} m`;
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

  if (unit === UNITS.FEET_INCHES) {
    // Treat numeric input as feet decimal
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
 * Snap angle to nearest increment (e.g. 45 degrees)
 */
function snapAngle(degrees, step = 45) {
  return Math.round(degrees / step) * step;
}


/* --- MODULE: js/engine/catalog.js --- */
/**
 * RoomPlanr - Architectural Furniture & Fixtures Catalog
 * 30+ architectural items with real-world dimensions, CAD 2D rendering hints, and 3D profiles.
 */

const FURNITURE_CATALOG = [
  // --- Living / Sofas ---
  {
    type: 'sofa_3seat',
    name: '3-Seater Sofa',
    category: 'Living',
    width: 2.20,
    depth: 0.90,
    height: 0.85,
    color: '#475569',
    material: 'Fabric Charcoal',
    icon: 'sofa'
  },
  {
    type: 'sofa_lshape',
    name: 'L-Sectional Sofa',
    category: 'Living',
    width: 2.80,
    depth: 1.80,
    height: 0.85,
    color: '#334155',
    material: 'Fabric Slate',
    icon: 'sofa'
  },
  {
    type: 'armchair',
    name: 'Lounge Armchair',
    category: 'Living',
    width: 0.85,
    depth: 0.85,
    height: 0.80,
    color: '#0284c7',
    material: 'Velvet Ocean',
    icon: 'chair'
  },
  {
    type: 'coffee_table',
    name: 'Coffee Table',
    category: 'Living',
    width: 1.20,
    depth: 0.60,
    height: 0.45,
    color: '#854d0e',
    material: 'Natural Walnut',
    icon: 'table'
  },
  {
    type: 'tv_unit',
    name: 'Media Console & TV',
    category: 'Living',
    width: 1.80,
    depth: 0.45,
    height: 0.55,
    color: '#1e293b',
    material: 'Matte Charcoal',
    icon: 'table'
  },
  {
    type: 'rug_large',
    name: 'Large Area Rug',
    category: 'Living',
    width: 3.00,
    depth: 2.00,
    height: 0.02,
    color: '#cbd5e1',
    material: 'Wool Textured',
    icon: 'room'
  },

  // --- Bedroom / Beds ---
  {
    type: 'bed_king',
    name: 'King Size Bed',
    category: 'Bedroom',
    width: 2.00,
    depth: 2.10,
    height: 1.10,
    color: '#64748b',
    material: 'Upholstered Gray',
    icon: 'bed'
  },
  {
    type: 'bed_queen',
    name: 'Queen Size Bed',
    category: 'Bedroom',
    width: 1.60,
    depth: 2.05,
    height: 1.00,
    color: '#475569',
    material: 'Upholstered Slate',
    icon: 'bed'
  },
  {
    type: 'bed_single',
    name: 'Single Twin Bed',
    category: 'Bedroom',
    width: 1.00,
    depth: 1.95,
    height: 0.90,
    color: '#0284c7',
    material: 'Linen Blue',
    icon: 'bed'
  },
  {
    type: 'nightstand',
    name: 'Bedside Nightstand',
    category: 'Bedroom',
    width: 0.50,
    depth: 0.45,
    height: 0.55,
    color: '#b45309',
    material: 'Oak Wood',
    icon: 'table'
  },
  {
    type: 'wardrobe',
    name: 'Double Wardrobe',
    category: 'Bedroom',
    width: 1.80,
    depth: 0.60,
    height: 2.20,
    color: '#334155',
    material: 'Matte Charcoal',
    icon: 'room'
  },
  {
    type: 'dresser',
    name: '6-Drawer Dresser',
    category: 'Bedroom',
    width: 1.40,
    depth: 0.50,
    height: 0.85,
    color: '#78350f',
    material: 'Dark Walnut',
    icon: 'table'
  },

  // --- Work / Office ---
  {
    type: 'desk_exec',
    name: 'Executive Workstation Desk',
    category: 'Office',
    width: 1.60,
    depth: 0.80,
    height: 0.75,
    color: '#78350f',
    material: 'Solid Walnut',
    icon: 'desk'
  },
  {
    type: 'desk_standing',
    name: 'Standing Motorized Desk',
    category: 'Office',
    width: 1.40,
    depth: 0.70,
    height: 0.75,
    color: '#0f172a',
    material: 'Oak & Steel',
    icon: 'desk'
  },
  {
    type: 'office_chair',
    name: 'Ergonomic Task Chair',
    category: 'Office',
    width: 0.65,
    depth: 0.65,
    height: 1.05,
    color: '#0284c7',
    material: 'Breathable Mesh',
    icon: 'chair'
  },
  {
    type: 'bookshelf',
    name: 'Tall Bookshelf Unit',
    category: 'Office',
    width: 1.20,
    depth: 0.35,
    height: 1.90,
    color: '#475569',
    material: 'Steel & Wood',
    icon: 'room'
  },

  // --- Dining & Kitchen ---
  {
    type: 'dining_table_6',
    name: '6-Person Dining Table',
    category: 'Dining',
    width: 1.80,
    depth: 0.90,
    height: 0.75,
    color: '#b45309',
    material: 'Solid Oak',
    icon: 'table'
  },
  {
    type: 'dining_table_round',
    name: 'Round Dining Table 4P',
    category: 'Dining',
    width: 1.10,
    depth: 1.10,
    height: 0.75,
    color: '#e2e8f0',
    material: 'White Carrara Marble',
    icon: 'table'
  },
  {
    type: 'dining_chair',
    name: 'Dining Chair',
    category: 'Dining',
    width: 0.50,
    depth: 0.50,
    height: 0.85,
    color: '#475569',
    material: 'Molded Oak',
    icon: 'chair'
  },
  {
    type: 'kitchen_island',
    name: 'Kitchen Island Counter',
    category: 'Kitchen',
    width: 2.00,
    depth: 0.90,
    height: 0.90,
    color: '#334155',
    material: 'Quartz Waterfall',
    icon: 'table'
  },
  {
    type: 'fridge',
    name: 'French Door Refrigerator',
    category: 'Kitchen',
    width: 0.90,
    depth: 0.75,
    height: 1.85,
    color: '#94a3b8',
    material: 'Stainless Steel',
    icon: 'room'
  },
  {
    type: 'stove_oven',
    name: 'Induction Range & Oven',
    category: 'Kitchen',
    width: 0.75,
    depth: 0.65,
    height: 0.90,
    color: '#1e293b',
    material: 'Black Glass & Steel',
    icon: 'room'
  },

  // --- Lighting & Plants ---
  {
    type: 'floor_lamp',
    name: 'Arched Floor Lamp',
    category: 'Decor',
    width: 0.45,
    depth: 0.45,
    height: 1.70,
    color: '#f59e0b',
    material: 'Brass & Linen',
    icon: 'lamp'
  },
  {
    type: 'plant_monstera',
    name: 'Potted Monstera Deliciosa',
    category: 'Decor',
    width: 0.50,
    depth: 0.50,
    height: 0.90,
    color: '#15803d',
    material: 'Terracotta & Greenery',
    icon: 'plant'
  },
  {
    type: 'plant_fiddle',
    name: 'Fiddle Leaf Fig Tree',
    category: 'Decor',
    width: 0.60,
    depth: 0.60,
    height: 1.60,
    color: '#166534',
    material: 'Ceramic Planter',
    icon: 'plant'
  },

  // --- Structural Openings ---
  {
    type: 'door_standard',
    name: 'Standard Door (Swing Arc)',
    category: 'Structure',
    width: 0.90,
    depth: 0.15,
    height: 2.10,
    color: '#cbd5e1',
    material: 'Painted Wood',
    icon: 'door',
    isDoor: true
  },
  {
    type: 'window_standard',
    name: 'Casement Window',
    category: 'Structure',
    width: 1.20,
    depth: 0.20,
    height: 1.40,
    color: '#38bdf8',
    material: 'Double Glazed Glass',
    icon: 'window',
    isWindow: true
  }
];

const FLOOR_MATERIALS = {
  oak: { id: 'oak', name: 'Hardwood Oak', color: '#c4975e', stroke: '#a37843', tile: false },
  walnut: { id: 'walnut', name: 'Dark Walnut', color: '#593822', stroke: '#402615', tile: false },
  marble: { id: 'marble', name: 'Light Marble Tile', color: '#e2e8f0', stroke: '#cbd5e1', tile: true },
  concrete: { id: 'concrete', name: 'Polished Concrete', color: '#64748b', stroke: '#475569', tile: false },
  carpet: { id: 'carpet', name: 'Charcoal Carpet', color: '#334155', stroke: '#1e293b', tile: false }
};


/* --- MODULE: js/engine/collision.js --- */
/**
 * RoomPlanr - Spatial Collision & Distance Measurement Engine
 * Rotated OBB (Oriented Bounding Box) collision detection and dynamic distance-to-walls calculations.
 */

/**
 * Get the 4 corner points of a rotated rectangle in world coordinates
 */
function getRotatedCorners(x, y, width, depth, rotationDegrees = 0) {
  const rad = (rotationDegrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const hw = width / 2;
  const hd = depth / 2;

  // Local corners relative to center
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
  const corners = getRotatedCorners(item.x, item.y, item.width, item.depth, item.rotation || 0);
  for (const pt of corners) {
    if (pt.x < -0.05 || pt.x > roomWidth + 0.05 || pt.y < -0.05 || pt.y > roomDepth + 0.05) {
      return true;
    }
  }
  return false;
}

/**
 * Calculate perpendicular distances from item center to nearest 4 walls
 */
function getDistancesToWalls(item, roomWidth, roomDepth) {
  const hw = (item.width || 1) / 2;
  const hd = (item.depth || 1) / 2;

  const left = Math.max(0, item.x - hw);
  const right = Math.max(0, roomWidth - (item.x + hw));
  const top = Math.max(0, item.y - hd);
  const bottom = Math.max(0, roomDepth - (item.y + hd));

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
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
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
    const w = this.canvas.width;
    const h = this.canvas.height;

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

    // 4. Draw Furniture Items (Lowest Z to Highest Z)
    for (const item of items) {
      const isSelected = item.id === selectedItemId;
      const isOverlapping = overlappingItemIds.has(item.id);
      this.drawFurnitureItem(ctx, item, scale, isSelected, isOverlapping);
    }

    // 5. Draw Perimeter Walls & Openings (Doors / Windows)
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
  }

  drawGrid(ctx, w, h, scale) {
    ctx.save();
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.35)';
    ctx.lineWidth = 1;

    // 1-meter major grid lines
    const startX = -10;
    const endX = 20;
    const startY = -10;
    const endY = 20;

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

    if (mat.tile) {
      const tileSize = 0.6 * scale;
      for (let x = 0; x <= rw; x += tileSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, rd); ctx.stroke();
      }
      for (let y = 0; y <= rd; y += tileSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(rw, y); ctx.stroke();
      }
    } else {
      const plankW = 0.25 * scale;
      for (let x = 0; x <= rw; x += plankW) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, rd); ctx.stroke();
      }
    }
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
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    // Item Body Fill
    ctx.fillStyle = item.color || '#475569';
    ctx.fillRect(-iw / 2, -id / 2, iw, id);
    ctx.shadowColor = 'transparent';

    // Outline
    ctx.strokeStyle = isOverlapping ? '#f59e0b' : (isSelected ? '#38bdf8' : '#0f172a');
    ctx.lineWidth = isSelected ? 2.5 : 1.5;
    ctx.strokeRect(-iw / 2, -id / 2, iw, id);

    // CAD Details
    this.drawCADDetails(ctx, item, iw, id);

    // Selection Handles (Corner squares & top rotation knob)
    if (isSelected) {
      this.drawSelectionHandles(ctx, iw, id);
    }

    ctx.restore();
  }

  drawCADDetails(ctx, item, iw, id) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1;

    // Sofa Cushions
    if (item.type && item.type.includes('sofa')) {
      ctx.strokeRect(-iw / 2 + 4, -id / 2 + 4, iw - 8, id - 8);
      ctx.beginPath();
      ctx.moveTo(-iw / 6, -id / 2 + 4); ctx.lineTo(-iw / 6, id / 2 - 4);
      ctx.moveTo(iw / 6, -id / 2 + 4); ctx.lineTo(iw / 6, id / 2 - 4);
      ctx.stroke();
    }
    // Bed Pillows
    else if (item.type && item.type.includes('bed')) {
      const pilW = iw * 0.38;
      const pilH = id * 0.22;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(-iw / 2 + 6, -id / 2 + 6, pilW, pilH);
      ctx.fillRect(iw / 2 - pilW - 6, -id / 2 + 6, pilW, pilH);
    }
    // Door Swing Arc
    else if (item.isDoor) {
      ctx.strokeStyle = '#38bdf8';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(-iw / 2, id / 2, iw, -Math.PI / 2, 0);
      ctx.stroke();
    }
    // Window Glass Pane
    else if (item.isWindow) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-iw / 2, 0); ctx.lineTo(iw / 2, 0);
      ctx.stroke();
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
      ctx.fillText(formatDimension(dist.left, unit), ix / 2, iy - 4);
    }

    // Right line to wall
    if (dist.right > 0.05) {
      ctx.beginPath();
      ctx.moveTo(ix + (item.width * scale) / 2, iy); ctx.lineTo(room.width * scale, iy);
      ctx.stroke();
      ctx.fillText(formatDimension(dist.right, unit), (ix + room.width * scale) / 2, iy - 4);
    }

    // Top line to wall
    if (dist.top > 0.05) {
      ctx.beginPath();
      ctx.moveTo(ix, 0); ctx.lineTo(ix, iy - (item.depth * scale) / 2);
      ctx.stroke();
      ctx.fillText(formatDimension(dist.top, unit), ix + 24, iy / 2);
    }

    // Bottom line to wall
    if (dist.bottom > 0.05) {
      ctx.beginPath();
      ctx.moveTo(ix, iy + (item.depth * scale) / 2); ctx.lineTo(ix, room.depth * scale);
      ctx.stroke();
      ctx.fillText(formatDimension(dist.bottom, unit), ix + 24, (iy + room.depth * scale) / 2);
    }

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
    ctx.fillText(`Width: ${formatDimension(room.width, unit)}`, rw / 2, -offset - 6);

    // Left Dimension Line (Depth)
    ctx.save();
    ctx.translate(-offset, rd / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(-rd / 2, 0); ctx.lineTo(rd / 2, 0);
    ctx.moveTo(-rd / 2, -5); ctx.lineTo(-rd / 2, 5);
    ctx.moveTo(rd / 2, -5); ctx.lineTo(rd / 2, 5);
    ctx.stroke();
    ctx.fillText(`Depth: ${formatDimension(room.depth, unit)}`, 0, -8);
    ctx.restore();

    ctx.restore();
  }
}


/* --- MODULE: js/engine/renderer-3d.js --- */
/**
 * RoomPlanr - 3D Isometric Perspective Preview Renderer
 * Pure Canvas 2D pseudo-3D isometric projection rendering elevated walls, floor textures, and shaded 3D furniture blocks.
 */



class Renderer3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0, zoom: 45 };
    this.isoAngle = Math.PI / 6; // 30 degrees
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
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
    const w = this.canvas.width;
    const h = this.canvas.height;

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
    const sortedItems = [...items].sort((a, b) => (a.x + a.y) - (b.x + b.y));

    for (const item of sortedItems) {
      const isSelected = item.id === selectedItemId;
      this.drawIsometricFurnitureBlock(ctx, item, scale, isSelected);
    }

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
    ctx.restore();
  }

  drawIsometricWalls(ctx, room, scale) {
    const rw = room.width;
    const rd = room.depth;
    const wh = room.height || 2.80; // 2.8m standard ceiling
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
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.stroke();

    // 2. Back-Top Wall (Along X-axis from 0,0 to rw,0)
    const wt0_b = this.toIso(0, 0, 0, scale);
    const wt1_b = this.toIso(rw, 0, 0, scale);
    const wt1_t = this.toIso(rw, 0, wh, scale);
    const wt0_t = this.toIso(0, 0, wh, scale);

    ctx.fillStyle = adjustBrightness(wallColor, 15); // Back-Top wall lit lighter
    ctx.beginPath();
    ctx.moveTo(wt0_b.x, wt0_b.y);
    ctx.lineTo(wt1_b.x, wt1_b.y);
    ctx.lineTo(wt1_t.x, wt1_t.y);
    ctx.lineTo(wt0_t.x, wt0_t.y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
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

    // Draw 4 Side Walls
    for (let i = 0; i < 4; i++) {
      const next = (i + 1) % 4;
      const shade = i % 2 === 0 ? -30 : -15;

      ctx.fillStyle = adjustBrightness(baseColor, shade);
      ctx.beginPath();
      ctx.moveTo(b[i].x, b[i].y);
      ctx.lineTo(b[next].x, b[next].y);
      ctx.lineTo(t[next].x, t[next].y);
      ctx.lineTo(t[i].x, t[i].y);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = isSelected ? '#38bdf8' : 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = isSelected ? 1.5 : 0.8;
      ctx.stroke();
    }

    // Top Face (t0 -> t1 -> t2 -> t3)
    ctx.fillStyle = adjustBrightness(baseColor, 25);
    ctx.beginPath();
    ctx.moveTo(t0.x, t0.y);
    ctx.lineTo(t1.x, t1.y);
    ctx.lineTo(t2.x, t2.y);
    ctx.lineTo(t3.x, t3.y);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = isSelected ? '#38bdf8' : 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = isSelected ? 2 : 1;
    ctx.stroke();

    ctx.restore();
  }
}

/**
 * Adjust hex color brightness with fallback for any format
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
 * RoomPlanr - Pre-Loaded Architectural Sample Rooms & Layout Scenarios
 * Rich demonstration layouts for Studio Apartment, Executive Office, and Master Bedroom.
 */

const SAMPLE_ROOMS = {
  studio: {
    id: 'room_studio_apt',
    name: 'Modern Studio Apartment',
    width: 6.0,
    depth: 4.5,
    height: 2.8,
    floorMaterial: 'oak',
    wallColor: '#1e293b',
    activeScenarioId: 'scenario_a',
    scenarios: {
      scenario_a: {
        id: 'scenario_a',
        name: 'Layout A (Open Concept)',
        items: [
          { id: 'item_bed', type: 'bed_queen', name: 'Queen Size Bed', x: 1.20, y: 1.30, width: 1.60, depth: 2.05, height: 1.00, rotation: 0, color: '#475569', material: 'Upholstered Slate' },
          { id: 'item_nightstand', type: 'nightstand', name: 'Bedside Nightstand', x: 2.30, y: 0.50, width: 0.50, depth: 0.45, height: 0.55, rotation: 0, color: '#b45309', material: 'Oak Wood' },
          { id: 'item_sofa', type: 'sofa_3seat', name: '3-Seater Sofa', x: 4.60, y: 1.80, width: 2.20, depth: 0.90, height: 0.85, rotation: 90, color: '#334155', material: 'Fabric Charcoal' },
          { id: 'item_tv', type: 'tv_unit', name: 'Media Console & TV', x: 3.20, y: 0.50, width: 1.80, depth: 0.45, height: 0.55, rotation: 0, color: '#1e293b', material: 'Matte Charcoal' },
          { id: 'item_coffee_table', type: 'coffee_table', name: 'Coffee Table', x: 4.00, y: 1.80, width: 1.20, depth: 0.60, height: 0.45, rotation: 90, color: '#854d0e', material: 'Natural Walnut' },
          { id: 'item_desk', type: 'desk_standing', name: 'Standing Desk', x: 1.20, y: 3.80, width: 1.40, depth: 0.70, height: 0.75, rotation: 0, color: '#0f172a', material: 'Oak & Steel' },
          { id: 'item_chair', type: 'office_chair', name: 'Ergonomic Task Chair', x: 1.20, y: 3.20, width: 0.65, depth: 0.65, height: 1.05, rotation: 180, color: '#0284c7', material: 'Breathable Mesh' },
          { id: 'item_rug', type: 'rug_large', name: 'Large Area Rug', x: 4.00, y: 2.00, width: 3.00, depth: 2.00, height: 0.02, rotation: 0, color: '#cbd5e1', material: 'Wool Textured' },
          { id: 'item_plant', type: 'plant_monstera', name: 'Potted Monstera', x: 0.50, y: 3.80, width: 0.50, depth: 0.50, height: 0.90, rotation: 0, color: '#15803d', material: 'Terracotta' },
          { id: 'item_door', type: 'door_standard', name: 'Entry Door', x: 5.50, y: 4.40, width: 0.90, depth: 0.15, height: 2.10, rotation: 0, color: '#cbd5e1', isDoor: true }
        ]
      },
      scenario_b: {
        id: 'scenario_b',
        name: 'Layout B (Separated Lounge)',
        items: [
          { id: 'item_bed_b', type: 'bed_queen', name: 'Queen Size Bed', x: 1.20, y: 1.30, width: 1.60, depth: 2.05, height: 1.00, rotation: 0, color: '#475569' },
          { id: 'item_sofa_b', type: 'sofa_3seat', name: '3-Seater Sofa', x: 4.50, y: 3.50, width: 2.20, depth: 0.90, height: 0.85, rotation: 0, color: '#334155' },
          { id: 'item_tv_b', type: 'tv_unit', name: 'Media Console', x: 4.50, y: 1.00, width: 1.80, depth: 0.45, height: 0.55, rotation: 0, color: '#1e293b' },
          { id: 'item_desk_b', type: 'desk_standing', name: 'Standing Desk', x: 1.20, y: 3.80, width: 1.40, depth: 0.70, height: 0.75, rotation: 0, color: '#0f172a' }
        ]
      }
    }
  },

  office: {
    id: 'room_exec_office',
    name: 'Executive Home Office',
    width: 4.5,
    depth: 3.5,
    height: 2.8,
    floorMaterial: 'walnut',
    wallColor: '#0f172a',
    activeScenarioId: 'scenario_a',
    scenarios: {
      scenario_a: {
        id: 'scenario_a',
        name: 'Layout A (Executive Setup)',
        items: [
          { id: 'item_exec_desk', type: 'desk_exec', name: 'Executive Workstation Desk', x: 2.25, y: 1.80, width: 1.60, depth: 0.80, height: 0.75, rotation: 0, color: '#78350f' },
          { id: 'item_exec_chair', type: 'office_chair', name: 'Ergonomic Task Chair', x: 2.25, y: 1.20, width: 0.65, depth: 0.65, height: 1.05, rotation: 0, color: '#0284c7' },
          { id: 'item_bookshelf', type: 'bookshelf', name: 'Tall Bookshelf Unit', x: 0.35, y: 1.75, width: 1.20, depth: 0.35, height: 1.90, rotation: 90, color: '#475569' },
          { id: 'item_armchair_1', type: 'armchair', name: 'Lounge Armchair 1', x: 1.50, y: 2.70, width: 0.85, depth: 0.85, height: 0.80, rotation: 180, color: '#0284c7' },
          { id: 'item_armchair_2', type: 'armchair', name: 'Lounge Armchair 2', x: 3.00, y: 2.70, width: 0.85, depth: 0.85, height: 0.80, rotation: 180, color: '#0284c7' },
          { id: 'item_lamp', type: 'floor_lamp', name: 'Arched Floor Lamp', x: 3.80, y: 0.50, width: 0.45, depth: 0.45, height: 1.70, rotation: 0, color: '#f59e0b' },
          { id: 'item_plant_f', type: 'plant_fiddle', name: 'Fiddle Leaf Fig Tree', x: 0.50, y: 0.50, width: 0.60, depth: 0.60, height: 1.60, rotation: 0, color: '#166534' }
        ]
      }
    }
  },

  bedroom: {
    id: 'room_master_bedroom',
    name: 'Contemporary Master Bedroom',
    width: 5.0,
    depth: 4.0,
    height: 2.8,
    floorMaterial: 'marble',
    wallColor: '#1e293b',
    activeScenarioId: 'scenario_a',
    scenarios: {
      scenario_a: {
        id: 'scenario_a',
        name: 'Layout A (Center Bed)',
        items: [
          { id: 'item_bed_king', type: 'bed_king', name: 'King Size Bed', x: 2.50, y: 1.40, width: 2.00, depth: 2.10, height: 1.10, rotation: 0, color: '#64748b' },
          { id: 'item_stand_l', type: 'nightstand', name: 'Nightstand Left', x: 1.10, y: 0.50, width: 0.50, depth: 0.45, height: 0.55, rotation: 0, color: '#b45309' },
          { id: 'item_stand_r', type: 'nightstand', name: 'Nightstand Right', x: 3.90, y: 0.50, width: 0.50, depth: 0.45, height: 0.55, rotation: 0, color: '#b45309' },
          { id: 'item_dresser', type: 'dresser', name: '6-Drawer Dresser', x: 2.50, y: 3.65, width: 1.40, depth: 0.50, height: 0.85, rotation: 180, color: '#78350f' },
          { id: 'item_wardrobe', type: 'wardrobe', name: 'Double Wardrobe', x: 0.50, y: 2.80, width: 1.80, depth: 0.60, height: 2.20, rotation: 90, color: '#334155' }
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
 * Left sidebar catalog with category filtering, real dimensions, and custom item modal.
 */





function renderFurnitureCatalog(container, {
  unit = UNITS.METERS,
  activeCategory = 'All',
  searchQuery = '',
  onAddItem = null,
  onCategoryChange = null,
  onSearchChange = null,
  onOpenCustomModal = null
}) {
  const categories = ['All', 'Living', 'Bedroom', 'Office', 'Dining', 'Kitchen', 'Decor', 'Structure'];

  const filtered = FURNITURE_CATALOG.filter(item => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  container.innerHTML = `
    <!-- Top Header -->
    <div class="panel-section-header flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-2">
        ${getIcon('sofa', 'icon-sm text-primary')}
        <span class="text-xs font-bold uppercase text-muted">Furniture Catalog</span>
      </div>
      <button class="btn btn-xs btn-primary" id="btn-open-custom-item" title="Create Custom Furniture Dimension">
        ${getIcon('plus', 'icon-xs')} Custom
      </button>
    </div>

    <!-- Search Bar -->
    <div class="p-2 border-b">
      <div class="relative">
        <input type="text" id="catalog-search-input" class="form-control form-control-sm pl-8 font-sans" placeholder="Search furniture, sofas, beds..." value="${escapeHTML(searchQuery)}" />
        <span class="absolute left-2 top-2 text-muted pointer-events-none">${getIcon('search', 'icon-xs')}</span>
      </div>
    </div>

    <!-- Category Pill Filter -->
    <div class="p-2 border-b flex flex-wrap gap-1">
      ${categories.map(c => `
        <button class="badge ${activeCategory === c ? 'badge-primary' : 'badge-secondary'} cursor-pointer cat-pill-btn" data-cat="${c}">
          ${c}
        </button>
      `).join('')}
    </div>

    <!-- Scrollable Items List -->
    <div class="catalog-items-scroll p-2 flex flex-col gap-1.5 flex-1 overflow-y-auto">
      ${filtered.length === 0 ? `
        <div class="text-xs text-muted text-center p-6">No matching furniture items found.</div>
      ` : filtered.map(item => `
        <div class="catalog-item-card card p-2 flex items-center justify-between hover-elevated">
          <div class="flex items-center gap-2.5 truncate">
            <div class="item-icon-box flex items-center justify-center rounded p-1" style="background-color: var(--bg-elevated); color: ${item.color || 'var(--accent-primary)'};">
              ${getIcon(item.icon || 'sofa', 'icon-sm')}
            </div>
            <div class="flex flex-col truncate">
              <span class="font-bold text-xs text-primary truncate">${escapeHTML(item.name)}</span>
              <span class="font-mono text-muted text-xs" style="font-size: 10px;">
                ${formatDimension(item.width, unit)} &times; ${formatDimension(item.depth, unit)}
              </span>
            </div>
          </div>

          <button class="btn btn-xs btn-secondary btn-add-catalog-item" data-type="${item.type}" title="Add to Room">
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

  container.querySelectorAll('.cat-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onCategoryChange) onCategoryChange(btn.dataset.cat);
    });
  });

  container.querySelectorAll('.btn-add-catalog-item').forEach(btn => {
    btn.addEventListener('click', () => {
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
 * RoomPlanr - Property Inspector Panel
 * Right sidebar for room dimensions, floor materials, wall colors, and selected object transform controls.
 */






function renderPropertyInspector(container, {
  room,
  selectedItem = null,
  unit = UNITS.METERS,
  onUpdateRoom = null,
  onUpdateItem = null,
  onDuplicateItem = null,
  onDeleteItem = null
}) {
  const dist = selectedItem ? getDistancesToWalls(selectedItem, room.width, room.depth) : null;

  container.innerHTML = `
    <!-- Top Inspector Header -->
    <div class="panel-section-header flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-2">
        ${getIcon(selectedItem ? 'sofa' : 'room', 'icon-sm text-primary')}
        <span class="text-xs font-bold uppercase text-muted">
          ${selectedItem ? 'Object Properties' : 'Room Specification'}
        </span>
      </div>
    </div>

    <!-- Inspector Body Scroll -->
    <div class="inspector-body-scroll p-3 flex flex-col gap-3 flex-1 overflow-y-auto">
      
      <!-- Selected Furniture Properties -->
      ${selectedItem ? `
        <div class="card p-3 flex flex-col gap-2.5">
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs text-primary truncate">${escapeHTML(selectedItem.name)}</span>
            <div class="flex items-center gap-1">
              <button class="btn-icon-xs" id="btn-inspect-dupe" title="Duplicate (Ctrl+D)">${getIcon('copy', 'icon-xs')}</button>
              <button class="btn-icon-xs text-rose" id="btn-inspect-del" title="Delete (Delete)">${getIcon('trash', 'icon-xs')}</button>
            </div>
          </div>

          <!-- Dimensions (W x D x H) -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Width</label>
              <input type="number" step="0.05" id="inp-item-width" class="form-control form-control-sm font-mono" value="${selectedItem.width}" />
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Depth</label>
              <input type="number" step="0.05" id="inp-item-depth" class="form-control form-control-sm font-mono" value="${selectedItem.depth}" />
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
              <input type="range" min="0" max="360" step="15" id="slider-item-rot" class="form-control form-control-sm p-0 flex-1" value="${selectedItem.rotation || 0}" />
              <button class="btn btn-xs btn-secondary" id="btn-quick-rot" title="Rotate +45°">+45&deg;</button>
            </div>
          </div>

          <!-- Color & Material -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Item Color</label>
            <div class="flex items-center gap-2">
              <input type="color" id="inp-item-color" class="p-0 w-8 h-7 cursor-pointer border-none rounded" value="${selectedItem.color || '#475569'}" />
              <input type="text" id="inp-item-mat" class="form-control form-control-sm flex-1 font-mono text-xs" value="${escapeHTML(selectedItem.material || 'Standard Finish')}" />
            </div>
          </div>

          <!-- Wall Clearances Readout -->
          ${dist ? `
            <div class="border-t pt-2 mt-1">
              <span class="text-xs font-bold uppercase text-muted block mb-1.5">Wall Clearances</span>
              <div class="grid grid-cols-2 gap-1.5 font-mono text-xs text-muted" style="font-size: 10px;">
                <div class="card p-1 text-center">Left: <strong class="text-primary">${formatDimension(dist.left, unit)}</strong></div>
                <div class="card p-1 text-center">Right: <strong class="text-primary">${formatDimension(dist.right, unit)}</strong></div>
                <div class="card p-1 text-center">Top: <strong class="text-primary">${formatDimension(dist.top, unit)}</strong></div>
                <div class="card p-1 text-center">Bottom: <strong class="text-primary">${formatDimension(dist.bottom, unit)}</strong></div>
              </div>
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- Room Dimensions & Materials Card -->
      <div class="card p-3 flex flex-col gap-2.5">
        <span class="font-bold text-xs text-primary uppercase">Room Boundary & Dimensions</span>

        <div class="grid grid-cols-2 gap-2">
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Room Width</label>
            <input type="number" step="0.5" id="inp-room-width" class="form-control form-control-sm font-mono font-bold" value="${room.width}" />
          </div>
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Room Depth</label>
            <input type="number" step="0.5" id="inp-room-depth" class="form-control form-control-sm font-mono font-bold" value="${room.depth}" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label text-xs font-semibold text-muted">Ceiling Wall Height</label>
          <input type="number" step="0.1" id="inp-room-height" class="form-control form-control-sm font-mono" value="${room.height || 2.80}" />
        </div>

        <!-- Floor Material Selection -->
        <div class="form-group">
          <label class="form-label text-xs font-semibold text-muted">Flooring Material</label>
          <select id="select-floor-material" class="form-control form-control-sm font-semibold">
            ${Object.values(FLOOR_MATERIALS).map(mat => `
              <option value="${mat.id}" ${room.floorMaterial === mat.id ? 'selected' : ''}>${mat.name}</option>
            `).join('')}
          </select>
        </div>

        <!-- Wall Color -->
        <div class="form-group">
          <label class="form-label text-xs font-semibold text-muted">Wall Paint Finish</label>
          <div class="flex items-center gap-2">
            <input type="color" id="inp-wall-color" class="p-0 w-8 h-7 cursor-pointer border-none rounded" value="${room.wallColor || '#1e293b'}" />
            <span class="font-mono text-xs text-secondary" id="lbl-wall-color-hex">${room.wallColor || '#1e293b'}</span>
          </div>
        </div>
      </div>

    </div>
  `;

  // Attach Item Property Handlers
  if (selectedItem) {
    container.querySelector('#inp-item-width')?.addEventListener('change', (e) => {
      selectedItem.width = parseFloat(e.target.value) || 1;
      if (onUpdateItem) onUpdateItem(selectedItem);
    });
    container.querySelector('#inp-item-depth')?.addEventListener('change', (e) => {
      selectedItem.depth = parseFloat(e.target.value) || 1;
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

  // Attach Room Property Handlers
  container.querySelector('#inp-room-width')?.addEventListener('change', (e) => {
    room.width = Math.max(2, parseFloat(e.target.value) || 5);
    if (onUpdateRoom) onUpdateRoom(room);
  });
  container.querySelector('#inp-room-depth')?.addEventListener('change', (e) => {
    room.depth = Math.max(2, parseFloat(e.target.value) || 4);
    if (onUpdateRoom) onUpdateRoom(room);
  });
  container.querySelector('#inp-room-height')?.addEventListener('change', (e) => {
    room.height = Math.max(1.8, parseFloat(e.target.value) || 2.8);
    if (onUpdateRoom) onUpdateRoom(room);
  });
  container.querySelector('#select-floor-material')?.addEventListener('change', (e) => {
    room.floorMaterial = e.target.value;
    if (onUpdateRoom) onUpdateRoom(room);
  });
  container.querySelector('#inp-wall-color')?.addEventListener('input', (e) => {
    room.wallColor = e.target.value;
    container.querySelector('#lbl-wall-color-hex').textContent = e.target.value;
    if (onUpdateRoom) onUpdateRoom(room);
  });
}


/* --- MODULE: js/app.js --- */
/**
 * RoomPlanr - Master Application Orchestrator
 * Integrates 2D CAD Floor Plan, 3D Isometric Renderer, Collision Engine, Catalog, and Scenarios.
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
    this.gridSnap = 0.10; // 10cm grid
    this.showGrid = true;
    this.showDimensions = true;

    // Pointer Interaction Modes
    this.interactionMode = 'none'; // 'none', 'move', 'rotate', 'resize', 'pan'
    this.resizeCorner = null; // 'nw', 'ne', 'se', 'sw'
    this.panStart = { x: 0, y: 0 };
    this.dragOffset = { x: 0, y: 0 };
    this.initialTransform = { x: 0, y: 0, width: 1, depth: 1, rotation: 0 };

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
    this.setupShortcuts();
    this.renderAll();
    this.centerCamera();
  }

  getCurrentItems() {
    if (!this.room.scenarios || !this.room.scenarios[this.activeScenarioId]) {
      this.room.scenarios = { scenario_a: { id: 'scenario_a', name: 'Layout A', items: [] } };
      this.activeScenarioId = 'scenario_a';
    }
    return this.room.scenarios[this.activeScenarioId].items || [];
  }

  handleResize() {
    const container = document.getElementById('canvas-workspace-wrap');
    if (container && this.canvas) {
      this.renderer2D.resize(container.clientWidth, container.clientHeight);
      this.renderer3D.resize(container.clientWidth, container.clientHeight);
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
    this.requestRender();
  }

  centerCamera() {
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    const rw = this.room.width;
    const rd = this.room.depth;
    const zoom = this.renderer2D.camera.zoom;

    this.renderer2D.camera.x = Math.round((cw - rw * zoom) / 2);
    this.renderer2D.camera.y = Math.round((ch - rd * zoom) / 2);
    this.renderer3D.camera.x = 0;
    this.renderer3D.camera.y = 0;
    this.requestRender();
  }

  // --- Toolbar Setup ---
  setupToolbar() {
    // 2D / 3D Mode Toggle Buttons
    document.getElementById('btn-mode-2d')?.addEventListener('click', () => {
      this.viewMode = '2D';
      document.getElementById('btn-mode-2d').classList.add('active');
      document.getElementById('btn-mode-3d').classList.remove('active');
      this.requestRender();
    });

    document.getElementById('btn-mode-3d')?.addEventListener('click', () => {
      this.viewMode = '3D';
      document.getElementById('btn-mode-3d').classList.add('active');
      document.getElementById('btn-mode-2d').classList.remove('active');
      this.requestRender();
    });

    // Sample Room Selector
    document.getElementById('select-sample-room')?.addEventListener('change', (e) => {
      const key = e.target.value;
      if (SAMPLE_ROOMS[key]) {
        this.room = JSON.parse(JSON.stringify(SAMPLE_ROOMS[key]));
        this.activeScenarioId = this.room.activeScenarioId || Object.keys(this.room.scenarios)[0];
        this.selectedItemId = this.getCurrentItems()[0]?.id || null;
        this.centerCamera();
        this.renderAll();
        this.autoSave();
      }
    });

    // Unit Selector
    document.getElementById('select-display-unit')?.addEventListener('change', (e) => {
      this.unit = e.target.value;
      this.renderAll();
    });

    // Grid Snapping Selector
    document.getElementById('select-grid-snap')?.addEventListener('change', (e) => {
      this.gridSnap = parseFloat(e.target.value);
    });

    // Undo / Redo
    document.getElementById('btn-undo')?.addEventListener('click', () => this.undo());
    document.getElementById('btn-redo')?.addEventListener('click', () => this.redo());

    // Zoom Controls
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
      this.renderer2D.camera.zoom = Math.min(180, this.renderer2D.camera.zoom * 1.2);
      this.renderer3D.camera.zoom = Math.min(100, this.renderer3D.camera.zoom * 1.2);
      this.requestRender();
    });
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
      this.renderer2D.camera.zoom = Math.max(20, this.renderer2D.camera.zoom * 0.8);
      this.renderer3D.camera.zoom = Math.max(15, this.renderer3D.camera.zoom * 0.8);
      this.requestRender();
    });
    document.getElementById('btn-center-room')?.addEventListener('click', () => this.centerCamera());

    // Export Floor Plan Snapshot
    document.getElementById('btn-export-plan-image')?.addEventListener('click', () => {
      const url = this.canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = (this.room.name || 'room_plan').toLowerCase().replace(/\s+/g, '_') + `_${this.viewMode.toLowerCase()}.png`;
      a.click();
    });

    // Export Project JSON
    document.getElementById('btn-export-plan-json')?.addEventListener('click', () => {
      const json = JSON.stringify(this.room, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (this.room.name || 'room_project').toLowerCase().replace(/\s+/g, '_') + '.roomplanr.json';
      a.click();
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
          if (parsed && parsed.width && parsed.scenarios) {
            this.room = parsed;
            this.activeScenarioId = this.room.activeScenarioId || Object.keys(this.room.scenarios)[0];
            this.selectedItemId = this.getCurrentItems()[0]?.id || null;
            this.centerCamera();
            this.renderAll();
            this.autoSave();
          } else {
            alert('Invalid RoomPlanr project structure.');
          }
        } catch (err) {
          alert('Failed to parse project JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    });
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

      // Pan with Middle Click or Shift/Alt Drag
      if (e.button === 1 || e.shiftKey || e.altKey) {
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
        // Rotation handle world pos
        const hx = activeItem.x + Math.sin(rad) * (activeItem.depth / 2 + rotDist);
        const hy = activeItem.y - Math.cos(rad) * (activeItem.depth / 2 + rotDist);

        const distToRot = Math.hypot(wx - hx, wy - hy);
        if (distToRot <= 12 / scale) {
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

          // Snap to 15 degrees
          degrees = Math.round(degrees / 15) * 15;
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
        const newZoom = Math.max(20, Math.min(180, oldZoom * zoomFactor));

        this.renderer2D.camera.x = sx - (sx - this.renderer2D.camera.x) * (newZoom / oldZoom);
        this.renderer2D.camera.y = sy - (sy - this.renderer2D.camera.y) * (newZoom / oldZoom);
        this.renderer2D.camera.zoom = newZoom;
      } else {
        this.renderer3D.camera.zoom = Math.max(15, Math.min(100, this.renderer3D.camera.zoom * zoomFactor));
      }

      this.requestRender();
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
    });
  }

  // --- Scenario Management ---
  updateScenarioTabs() {
    const container = document.getElementById('scenarios-tab-bar');
    if (!container) return;

    const scenarios = Object.values(this.room.scenarios || {});

    container.innerHTML = `
      <div class="flex items-center gap-1">
        ${scenarios.map(sc => `
          <button class="btn btn-xs ${this.activeScenarioId === sc.id ? 'btn-primary' : 'btn-secondary'} btn-scenario-tab" data-id="${sc.id}">
            ${escapeHTML(sc.name)}
          </button>
        `).join('')}
        <button class="btn btn-xs btn-secondary" id="btn-add-scenario" title="Duplicate Active Scenario">+ Scenario</button>
      </div>
    `;

    container.querySelectorAll('.btn-scenario-tab').forEach(b => {
      b.addEventListener('click', () => {
        this.activeScenarioId = b.dataset.id;
        this.selectedItemId = this.getCurrentItems()[0]?.id || null;
        this.renderAll();
        this.autoSave();
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
  }

  // --- Panels ---
  renderCatalog() {
    const container = document.getElementById('furniture-catalog-container');
    if (!container) return;

    renderFurnitureCatalog(container, {
      unit: this.unit,
      onAddItem: (itemDef) => {
        this.recordHistory('Add Item');
        const newItem = {
          ...itemDef,
          id: 'item_' + Date.now(),
          x: snapToGrid(this.room.width / 2, this.gridSnap),
          y: snapToGrid(this.room.depth / 2, this.gridSnap),
          rotation: 0
        };
        this.getCurrentItems().push(newItem);
        this.selectedItemId = newItem.id;
        this.renderAll();
        this.autoSave();
      },
      onOpenCustomModal: () => {
        const name = prompt('Enter custom furniture name:', 'Custom Work Desk');
        if (!name) return;
        const w = parseFloat(prompt('Enter width in meters:', '1.50')) || 1.5;
        const d = parseFloat(prompt('Enter depth in meters:', '0.80')) || 0.8;

        const customItem = {
          id: 'item_' + Date.now(),
          type: 'custom',
          name,
          category: 'Custom',
          width: w,
          depth: d,
          height: 0.85,
          color: '#38bdf8',
          material: 'Custom Finish',
          x: snapToGrid(this.room.width / 2, this.gridSnap),
          y: snapToGrid(this.room.depth / 2, this.gridSnap),
          rotation: 0
        };

        this.getCurrentItems().push(customItem);
        this.selectedItemId = customItem.id;
        this.renderAll();
        this.autoSave();
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
      unit: this.unit,
      onUpdateRoom: () => {
        this.renderAll();
        this.autoSave();
      },
      onUpdateItem: () => {
        this.requestRender();
        this.autoSave();
      },
      onDuplicateItem: () => this.duplicateSelectedItem(),
      onDeleteItem: () => this.deleteSelectedItem()
    });
  }

  duplicateSelectedItem() {
    const items = this.getCurrentItems();
    const target = items.find(i => i.id === this.selectedItemId);
    if (!target) return;

    this.recordHistory('Duplicate Item');
    const clone = JSON.parse(JSON.stringify(target));
    clone.id = 'item_' + Date.now();
    clone.x = Math.min(this.room.width - clone.width / 2, target.x + 0.3);
    clone.y = Math.min(this.room.depth - clone.depth / 2, target.y + 0.3);

    items.push(clone);
    this.selectedItemId = clone.id;
    this.renderAll();
    this.autoSave();
  }

  deleteSelectedItem() {
    const items = this.getCurrentItems();
    this.recordHistory('Delete Item');
    this.room.scenarios[this.activeScenarioId].items = items.filter(i => i.id !== this.selectedItemId);
    this.selectedItemId = this.getCurrentItems()[0]?.id || null;
    this.renderAll();
    this.autoSave();
  }

  // --- History & Persistence ---
  recordHistory(action = 'Edit') {
    this.undoStack.push(JSON.stringify(this.room));
    if (this.undoStack.length > 25) this.undoStack.shift();
    this.redoStack = [];
  }

  undo() {
    if (this.undoStack.length === 0) return;
    this.redoStack.push(JSON.stringify(this.room));
    this.room = JSON.parse(this.undoStack.pop());
    this.renderAll();
    this.autoSave();
  }

  redo() {
    if (this.redoStack.length === 0) return;
    this.undoStack.push(JSON.stringify(this.room));
    this.room = JSON.parse(this.redoStack.pop());
    this.renderAll();
    this.autoSave();
  }

  autoSave() {
    db.saveRoom(this.room);
  }

  updateStatusBar(overlapCount = 0) {
    const statusEl = document.getElementById('status-bar-readout');
    if (statusEl) {
      const items = this.getCurrentItems();
      statusEl.innerHTML = `Room: <strong>${formatDimension(this.room.width, this.unit)} &times; ${formatDimension(this.room.depth, this.unit)}</strong> (${(this.room.width * this.room.depth).toFixed(1)} m&sup2;) &bull; Furniture: <strong>${items.length} items</strong> ${overlapCount > 0 ? `&bull; <span class="text-amber font-bold">&Delta; ${overlapCount} Collision/Boundary Overlaps</span>` : ''}`;
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
