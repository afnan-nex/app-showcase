/**
 * MapCraft - Pre-Built Cartographic Templates
 * 3 rich demonstration maps for Fantasy RPGs, Travel Planning, and Blueprint Worlds.
 */

export const MAP_TEMPLATES = {
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
