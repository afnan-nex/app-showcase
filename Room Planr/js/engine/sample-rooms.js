/**
 * RoomPlanr - Pre-Loaded Architectural Sample Rooms & Layout Scenarios
 * Rich demonstration layouts for Studio Apartment, Executive Office, and Master Bedroom.
 */

export const SAMPLE_ROOMS = {
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
