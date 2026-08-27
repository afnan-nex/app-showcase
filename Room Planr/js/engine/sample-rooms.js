/**
 * RoomPlanr - Pre-Loaded Architectural Projects & Layout Scenarios
 * Believable architectural client briefs, dimensional floor plans, and multi-scenario layouts.
 */

export const SAMPLE_ROOMS = {
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
