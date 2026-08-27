/**
 * RoomPlanr - Architectural Furniture & Fixtures Catalog
 * 30+ architectural items with real-world dimensions, CAD 2D rendering hints, and 3D profiles.
 */

export const FURNITURE_CATALOG = [
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

export const FLOOR_MATERIALS = {
  oak: { id: 'oak', name: 'Hardwood Oak', color: '#c4975e', stroke: '#a37843', tile: false },
  walnut: { id: 'walnut', name: 'Dark Walnut', color: '#593822', stroke: '#402615', tile: false },
  marble: { id: 'marble', name: 'Light Marble Tile', color: '#e2e8f0', stroke: '#cbd5e1', tile: true },
  concrete: { id: 'concrete', name: 'Polished Concrete', color: '#64748b', stroke: '#475569', tile: false },
  carpet: { id: 'carpet', name: 'Charcoal Carpet', color: '#334155', stroke: '#1e293b', tile: false }
};
