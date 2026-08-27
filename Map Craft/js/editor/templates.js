/**
 * MapCraft - Pre-Built Cartographic Templates
 * 4 rich, portfolio-grade maps for Fantasy RPGs, Urban Travel, Sci-Fi Habitats, and Nautical Exploration.
 */

export const MAP_TEMPLATES = {
  // 1. Realm of Eldoria (High Fantasy World Map)
  fantasy: {
    id: 'proj_eldoria',
    name: 'Realm of Eldoria',
    description: 'Campaign continent featuring ancient kingdoms, elfwood sanctuaries, and dragon-guarded mountain passes.',
    themeId: 'parchment',
    scaleRatio: 25, // 100px = 25 km
    scaleUnit: 'km',
    gridType: 'hex',
    gridSize: 60,
    layers: [
      { id: 'layer_territories', name: 'Kingdoms & Biomes', visible: true, locked: false },
      { id: 'layer_routes', name: 'Trade Routes & Passes', visible: true, locked: false },
      { id: 'layer_landmarks', name: 'Castles, Ruins & POIs', visible: true, locked: false },
      { id: 'layer_labels', name: 'Geographic Labels', visible: true, locked: false }
    ],
    objects: [
      // Regions
      {
        id: 'reg_whisperwood',
        name: 'Whisperwood Sylvan Forest',
        type: 'region',
        layerId: 'layer_territories',
        category: 'Wilderness',
        fillColor: '#8a9a5b',
        strokeColor: '#556b2f',
        strokeWidth: 2,
        opacity: 0.35,
        points: [
          { x: 180, y: 140 }, { x: 380, y: 120 }, { x: 440, y: 260 },
          { x: 320, y: 350 }, { x: 150, y: 290 }
        ],
        notes: 'Ancient enchanted primeval forest guarded by the Silverleaf Wood Elves. Magic leylines intersect near the Moonstone Sanctuary.'
      },
      {
        id: 'reg_sunfire_kingdom',
        name: 'Sunfire Crown Kingdom',
        type: 'region',
        layerId: 'layer_territories',
        category: 'Kingdom',
        fillColor: '#d4a373',
        strokeColor: '#bc6c25',
        strokeWidth: 2,
        opacity: 0.32,
        points: [
          { x: 500, y: 180 }, { x: 840, y: 150 }, { x: 920, y: 390 },
          { x: 640, y: 460 }, { x: 480, y: 320 }
        ],
        notes: 'The golden fertile realm ruled by the Solaris Dynasty. Famous for grain exports, warhorse breeding, and radiant paladin orders.'
      },
      {
        id: 'reg_sea_storms',
        name: 'Sea of Maelstroms',
        type: 'region',
        layerId: 'layer_territories',
        category: 'Ocean',
        fillColor: '#457b9d',
        strokeColor: '#1d3557',
        strokeWidth: 2,
        opacity: 0.28,
        points: [
          { x: 700, y: 470 }, { x: 1140, y: 430 }, { x: 1180, y: 740 },
          { x: 640, y: 760 }
        ],
        notes: 'Treacherous southern waters known for tidal whirlpools and kraken leviathans. Requires experienced navigators.'
      },
      {
        id: 'reg_ashen_wastes',
        name: 'Ashen Wastes',
        type: 'region',
        layerId: 'layer_territories',
        category: 'Hazard',
        fillColor: '#78716c',
        strokeColor: '#44403c',
        strokeWidth: 2,
        opacity: 0.3,
        points: [
          { x: 260, y: 400 }, { x: 450, y: 380 }, { x: 430, y: 560 },
          { x: 220, y: 540 }
        ],
        notes: 'Barren volcanic scrubland following the Cataclysm of Fire. Inhabited by fire elementals and rogue ash goblins.'
      },

      // Routes
      {
        id: 'route_kings_highway',
        name: "The King's Imperial Highway",
        type: 'route',
        layerId: 'layer_routes',
        category: 'Main Road',
        color: '#8b4513',
        width: 4,
        style: 'solid',
        points: [
          { x: 260, y: 220 }, { x: 420, y: 240 }, { x: 580, y: 290 },
          { x: 760, y: 320 }
        ],
        notes: 'Double-wide cobbled roadway regularly patrolled by royal guard garrisons. Connects western sanctuaries to Eldor Citadel.'
      },
      {
        id: 'route_silk_trade',
        name: 'Caravan Trail of Spices',
        type: 'route',
        layerId: 'layer_routes',
        category: 'Trade Route',
        color: '#d97706',
        width: 3,
        style: 'dashed',
        points: [
          { x: 760, y: 320 }, { x: 820, y: 430 }, { x: 910, y: 550 }
        ],
        notes: 'Arduous coastal path where merchants transport silk, magical gems, and exotic spices from Port Kraken.'
      },
      {
        id: 'route_dragon_pass',
        name: "Wyvern's Tooth Pass",
        type: 'route',
        layerId: 'layer_routes',
        category: 'Mountain Pass',
        color: '#b91c1c',
        width: 2.5,
        style: 'dotted',
        points: [
          { x: 380, y: 130 }, { x: 460, y: 100 }, { x: 580, y: 120 }
        ],
        notes: 'Hazardous high-altitude mountain ledge exposed to sub-zero blizzards and wyvern nesting cliffs.'
      },

      // Markers
      {
        id: 'm_eldor_citadel',
        name: 'High Citadel of Eldor',
        type: 'marker',
        layerId: 'layer_landmarks',
        category: 'Capital Citadel',
        icon: 'castle',
        color: '#991b1b',
        size: 32,
        x: 760,
        y: 320,
        notes: 'Seat of King Cedric III. Triple-walled fortress carved from white limestone atop the Falconbluff Ridge.'
      },
      {
        id: 'm_dragon_peak',
        name: 'Mount Wyvern Peak',
        type: 'marker',
        layerId: 'layer_landmarks',
        category: 'Volcano',
        icon: 'mountain',
        color: '#475569',
        size: 30,
        x: 380,
        y: 130,
        notes: 'Elevation: 4,820m. Rumored lair of the ancient red dragon Ignisrex the Undying.'
      },
      {
        id: 'm_port_kraken',
        name: 'Port Kraken Haven',
        type: 'marker',
        layerId: 'layer_landmarks',
        category: 'Harbor City',
        icon: 'anchor',
        color: '#0284c7',
        size: 28,
        x: 910,
        y: 550,
        notes: 'Bustling maritime trade haven with privateer docks, dry docks, and arcane navigational guilds.'
      },
      {
        id: 'm_druid_shrine',
        name: 'Moonstone Sanctuary',
        type: 'marker',
        layerId: 'layer_landmarks',
        category: 'Holy Grove',
        icon: 'tree',
        color: '#16a34a',
        size: 26,
        x: 260,
        y: 220,
        notes: 'Sacred grove of monolithic standing stones aligned with celestial lunar eclipses.'
      },
      {
        id: 'm_sunken_crypt',
        name: 'Crypt of Forgotten Kings',
        type: 'marker',
        layerId: 'layer_landmarks',
        category: 'Dungeon',
        icon: 'skull',
        color: '#7e22ce',
        size: 26,
        x: 340,
        y: 470,
        notes: 'Subterranean mausoleum filled with undead spectral guardians and sealed arcane relics.'
      },
      {
        id: 'm_crossroad_inn',
        name: 'The Prancing Manticore Inn',
        type: 'marker',
        layerId: 'layer_landmarks',
        category: 'Tavern',
        icon: 'food',
        color: '#b45309',
        size: 24,
        x: 580,
        y: 290,
        notes: 'Popular wayside tavern known for spiced elderberry ale, bardic gossip, and mercenary hiring boards.'
      },

      // Labels
      {
        id: 'lbl_continent',
        name: 'Region Label',
        type: 'label',
        layerId: 'layer_labels',
        text: 'KINGDOM OF ELDORIA',
        fontSize: 22,
        fontFamily: "'Cinzel', serif",
        color: '#451a03',
        x: 560,
        y: 70,
        isBold: true
      },
      {
        id: 'lbl_ocean',
        name: 'Ocean Label',
        type: 'label',
        layerId: 'layer_labels',
        text: 'SEA OF MAELSTROMS',
        fontSize: 16,
        fontFamily: "'Cinzel', serif",
        color: '#1e3a8a',
        x: 940,
        y: 660,
        isBold: true
      }
    ]
  },

  // 2. Tokyo Explorer & Transit (Urban Travel Guide)
  travel: {
    id: 'proj_tokyo',
    name: 'Tokyo Explorer & Transit Map',
    description: 'Metropolitan guide featuring the Yamanote Line loop, iconic cultural districts, gastronomy hubs, and tourist landmarks.',
    themeId: 'clean',
    scaleRatio: 2, // 100px = 2 km
    scaleUnit: 'km',
    gridType: 'square',
    gridSize: 50,
    layers: [
      { id: 'layer_districts', name: 'Special Wards & Districts', visible: true, locked: false },
      { id: 'layer_transit', name: 'Transit Lines & Walkways', visible: true, locked: false },
      { id: 'layer_spots', name: 'Attractions & Gastronomy', visible: true, locked: false },
      { id: 'layer_labels', name: 'District Labels', visible: true, locked: false }
    ],
    objects: [
      // Districts
      {
        id: 'reg_shinjuku',
        name: 'Shinjuku Ward',
        type: 'region',
        layerId: 'layer_districts',
        category: 'Entertainment',
        fillColor: '#bfdbfe',
        strokeColor: '#3b82f6',
        strokeWidth: 2,
        opacity: 0.35,
        points: [
          { x: 220, y: 260 }, { x: 430, y: 220 }, { x: 470, y: 430 }, { x: 250, y: 470 }
        ],
        notes: 'Home to the world busiest train station, Tokyo Metropolitan Government Building, and Kabukicho nightlife.'
      },
      {
        id: 'reg_shibuya',
        name: 'Shibuya & Harajuku',
        type: 'region',
        layerId: 'layer_districts',
        category: 'Fashion & Culture',
        fillColor: '#fecdd3',
        strokeColor: '#f43f5e',
        strokeWidth: 2,
        opacity: 0.35,
        points: [
          { x: 250, y: 510 }, { x: 480, y: 460 }, { x: 520, y: 670 }, { x: 290, y: 690 }
        ],
        notes: 'Center of Japanese youth fashion, iconic scramble crossing, Meiji Jingu Shrine forest, and boutique cafes.'
      },
      {
        id: 'reg_chiyoda',
        name: 'Chiyoda & Ginza',
        type: 'region',
        layerId: 'layer_districts',
        category: 'Historic & Luxury',
        fillColor: '#bbf7d0',
        strokeColor: '#22c55e',
        strokeWidth: 2,
        opacity: 0.35,
        points: [
          { x: 580, y: 260 }, { x: 800, y: 270 }, { x: 790, y: 510 }, { x: 570, y: 490 }
        ],
        notes: 'Imperial Palace grounds, Tokyo Central Station brick facade, and upscale Ginza shopping boulevard.'
      },

      // Transit Routes
      {
        id: 'route_yamanote',
        name: 'JR Yamanote Line Loop',
        type: 'route',
        layerId: 'layer_transit',
        category: 'Train Loop',
        color: '#16a34a',
        width: 4.5,
        style: 'solid',
        points: [
          { x: 330, y: 340 }, { x: 370, y: 550 }, { x: 630, y: 620 },
          { x: 730, y: 410 }, { x: 670, y: 230 }, { x: 490, y: 200 }, { x: 330, y: 340 }
        ],
        notes: 'Circular line operated by JR East. Total journey time for 1 loop is approx. 59 minutes across 30 major stations.'
      },
      {
        id: 'route_chuo',
        name: 'JR Chuo Rapid Line',
        type: 'route',
        layerId: 'layer_transit',
        category: 'Express Line',
        color: '#ea580c',
        width: 3.5,
        style: 'dashed',
        points: [
          { x: 180, y: 340 }, { x: 330, y: 340 }, { x: 500, y: 350 }, { x: 730, y: 410 }
        ],
        notes: 'Direct east-west rapid connector connecting Shinjuku Station to Tokyo Station in 14 minutes.'
      },

      // Markers
      {
        id: 'm_shibuya_cross',
        name: 'Shibuya Scramble Crossing',
        type: 'marker',
        layerId: 'layer_spots',
        category: 'Landmark',
        icon: 'star',
        color: '#e11d48',
        size: 30,
        x: 370,
        y: 550,
        notes: 'Up to 3,000 pedestrians cross simultaneously during peak rush hour. Hachiko statue is located at Exit 8.'
      },
      {
        id: 'm_shinjuku_station',
        name: 'Shinjuku Main Terminal',
        type: 'marker',
        layerId: 'layer_spots',
        category: 'Transit Hub',
        icon: 'landmark',
        color: '#2563eb',
        size: 30,
        x: 330,
        y: 340,
        notes: 'Guinness World Record for busiest transit hub with over 3.5 million daily passengers and 200+ exits.'
      },
      {
        id: 'm_tokyo_station',
        name: 'Tokyo Central Station',
        type: 'marker',
        layerId: 'layer_spots',
        category: 'Shinkansen Hub',
        icon: 'landmark',
        color: '#b91c1c',
        size: 28,
        x: 730,
        y: 410,
        notes: 'Red-brick historic 1914 facade. Main gateway for Tokaido & Tohoku Shinkansen bullet trains.'
      },
      {
        id: 'm_skytree',
        name: 'Tokyo Skytree (634m)',
        type: 'marker',
        layerId: 'layer_spots',
        category: 'Observation Tower',
        icon: 'tower',
        color: '#0284c7',
        size: 32,
        x: 820,
        y: 190,
        notes: 'Tallest structure in Japan. Features 360-degree glass observation decks overlooking Mount Fuji on clear days.'
      },
      {
        id: 'm_sensoji',
        name: 'Senso-ji Buddhist Temple',
        type: 'marker',
        layerId: 'layer_spots',
        category: 'Historical Shrine',
        icon: 'castle',
        color: '#d97706',
        size: 26,
        x: 760,
        y: 180,
        notes: 'Tokyo oldest temple founded in 645 AD. Famous Kaminarimon Thunder Gate with giant red lantern.'
      },
      {
        id: 'm_ramen_st',
        name: 'Tokyo Ramen Street',
        type: 'marker',
        layerId: 'layer_spots',
        category: 'Dining',
        icon: 'food',
        color: '#ca8a04',
        size: 24,
        x: 720,
        y: 430,
        notes: 'Underground avenue in Tokyo Station hosting 8 world-renowned ramen shops including Rokurinsha tsukemen.'
      },

      // Labels
      {
        id: 'lbl_tokyo_title',
        name: 'Map Header',
        type: 'label',
        layerId: 'layer_labels',
        text: 'GREATER TOKYO TRANSIT GUIDE',
        fontSize: 20,
        fontFamily: "'Inter', sans-serif",
        color: '#0f172a',
        x: 540,
        y: 70,
        isBold: true
      }
    ]
  },

  // 3. Artemis IV Lunar Research Base (Hard Sci-Fi Colony Blueprint)
  blueprint: {
    id: 'proj_lunar_base',
    name: 'Artemis IV Lunar Outpost',
    description: 'Engineering layout blueprint for permanent lunar south pole habitat near Shackleton Crater.',
    themeId: 'blueprint',
    scaleRatio: 100, // 100px = 100 meters
    scaleUnit: 'm',
    gridType: 'square',
    gridSize: 50,
    layers: [
      { id: 'layer_sectors', name: 'Habitats & Pressurized Domes', visible: true, locked: false },
      { id: 'layer_pipelines', name: 'Cryogenic & Power Conduits', visible: true, locked: false },
      { id: 'layer_installations', name: 'Surface Facilities & Landing', visible: true, locked: false },
      { id: 'layer_tech_labels', name: 'Blueprint Callouts', visible: true, locked: false }
    ],
    objects: [
      {
        id: 'circ_dome_alpha',
        name: 'Habitat Bio-Dome Alpha',
        type: 'circle',
        layerId: 'layer_sectors',
        category: 'Living Quarters',
        fillColor: '#0077b6',
        strokeColor: '#64dfdf',
        strokeWidth: 2.5,
        radius: 85,
        x: 380,
        y: 340,
        opacity: 0.38,
        notes: 'Triple-redundant Kevlar-regolith dome supporting 48 permanent scientists and hydroponic aeroponics bay.'
      },
      {
        id: 'circ_dome_beta',
        name: 'Science & Geology Lab Beta',
        type: 'circle',
        layerId: 'layer_sectors',
        category: 'Laboratory',
        fillColor: '#023e8a',
        strokeColor: '#48cae4',
        strokeWidth: 2,
        radius: 65,
        x: 580,
        y: 340,
        opacity: 0.35,
        notes: 'Cleanroom facility dedicated to deep-core regolith isotope analysis and lunar seismology.'
      },
      {
        id: 'route_conduit_alpha',
        name: 'Primary Oxygen & Power Bus',
        type: 'route',
        layerId: 'layer_pipelines',
        category: 'Utility Grid',
        color: '#64dfdf',
        width: 4,
        style: 'dashed',
        points: [
          { x: 380, y: 340 }, { x: 580, y: 340 }, { x: 740, y: 220 }, { x: 860, y: 220 }
        ],
        notes: 'Vacuum-insulated cryogenic liquid oxygen line and 10kV superconducting power feed from the fission reactor.'
      },
      {
        id: 'm_landing_pad',
        name: 'Heavy Cargo Landing Pad 1',
        type: 'marker',
        layerId: 'layer_installations',
        category: 'Spaceport',
        icon: 'anchor',
        color: '#48cae4',
        size: 32,
        x: 860,
        y: 220,
        notes: 'Reinforced sintered-basalt launch pad with blast deflection berms for Starship HLS cargo landers.'
      },
      {
        id: 'm_solar_farm',
        name: 'Solar Array Alpha (Peak of Eternal Light)',
        type: 'marker',
        layerId: 'layer_installations',
        category: 'Power Plant',
        icon: 'star',
        color: '#90e0ef',
        size: 28,
        x: 240,
        y: 180,
        notes: 'Continuous 86% solar illumination along the crater rim generating 4.2 MW continuous electricity.'
      },
      {
        id: 'm_ice_drill',
        name: 'Shackleton Ice Extraction Drill',
        type: 'marker',
        layerId: 'layer_installations',
        category: 'Mining',
        icon: 'cave',
        color: '#caf0f8',
        size: 26,
        x: 480,
        y: 520,
        notes: 'Automated thermal sublimation mining rig recovering 500 liters/day water ice from permanently shadowed crater floor.'
      },
      {
        id: 'lbl_blueprint_hdr',
        name: 'Title Callout',
        type: 'label',
        layerId: 'layer_tech_labels',
        text: 'ARTEMIS IV LUNAR BASE // SECTOR 7-A',
        fontSize: 18,
        fontFamily: "'JetBrains Mono', monospace",
        color: '#64dfdf',
        x: 520,
        y: 80,
        isBold: true
      }
    ]
  },

  // 4. Archipelago of Sunken Galleons (Nautical Pirate Chart)
  nautical: {
    id: 'proj_archipelago',
    name: 'Archipelago of Sunken Galleons',
    description: '17th-century nautical chart featuring hidden coves, coral reefs, sunken armadas, and trade wind currents.',
    themeId: 'nautical',
    scaleRatio: 15, // 100px = 15 Nautical Miles
    scaleUnit: 'nm',
    gridType: 'square',
    gridSize: 70,
    layers: [
      { id: 'layer_islands', name: 'Islands & Coral Reefs', visible: true, locked: false },
      { id: 'layer_currents', name: 'Trade Currents & Shipping', visible: true, locked: false },
      { id: 'layer_wrecks', name: 'Ports, Reefs & Shipwrecks', visible: true, locked: false },
      { id: 'layer_chart_labels', name: 'Cartographic Labels', visible: true, locked: false }
    ],
    objects: [
      {
        id: 'reg_tortuga_isle',
        name: "Isla de la Muerte",
        type: 'region',
        layerId: 'layer_islands',
        category: 'Island',
        fillColor: '#94d2bd',
        strokeColor: '#0a9396',
        strokeWidth: 2,
        opacity: 0.4,
        points: [
          { x: 200, y: 220 }, { x: 380, y: 170 }, { x: 420, y: 350 }, { x: 260, y: 390 }
        ],
        notes: 'Dense volcanic island surrounded by knife-sharp coral barrier reefs. Safe harbor for privateer flotillas.'
      },
      {
        id: 'reg_siren_atoll',
        name: "Siren's Ring Atoll",
        type: 'region',
        layerId: 'layer_islands',
        category: 'Atoll',
        fillColor: '#83c5be',
        strokeColor: '#005f73',
        strokeWidth: 2,
        opacity: 0.35,
        points: [
          { x: 620, y: 320 }, { x: 840, y: 280 }, { x: 880, y: 460 }, { x: 660, y: 490 }
        ],
        notes: 'Circular shallow lagoon with turquoise waters and treacherous submerged sandbars.'
      },
      {
        id: 'route_trade_current',
        name: 'The Gulf Trade Winds Current',
        type: 'route',
        layerId: 'layer_currents',
        category: 'Shipping Lane',
        color: '#005f73',
        width: 3.5,
        style: 'dashed',
        points: [
          { x: 140, y: 480 }, { x: 360, y: 440 }, { x: 560, y: 410 }, { x: 780, y: 340 }, { x: 960, y: 220 }
        ],
        notes: 'Steady 4-knot easterly maritime current used by galleons transporting silver bullion back to Seville.'
      },
      {
        id: 'm_port_royale',
        name: 'Port Royale Free Haven',
        type: 'marker',
        layerId: 'layer_wrecks',
        category: 'Harbor Fortress',
        icon: 'anchor',
        color: '#005f73',
        size: 30,
        x: 320,
        y: 280,
        notes: 'Governor mansion, rum distilleries, shipyard drydock, and heavily fortified coastal cannon battery.'
      },
      {
        id: 'm_sunken_galleon',
        name: 'Wreck of the Santa Esperanza (1642)',
        type: 'marker',
        layerId: 'layer_wrecks',
        category: 'Sunken Treasure',
        icon: 'treasure',
        color: '#ca8a04',
        size: 28,
        x: 560,
        y: 410,
        notes: 'Depth: 28 fathoms. Spanish treasure frigate sunk during hurricane carrying 40 chests of Aztec gold coin.'
      },
      {
        id: 'm_dead_mans_reef',
        name: "Dead Man's Shallow Reef",
        type: 'marker',
        layerId: 'layer_wrecks',
        category: 'Maritime Hazard',
        icon: 'skull',
        color: '#ae2012',
        size: 26,
        x: 740,
        y: 380,
        notes: 'Uncharted submerged coral heads responsible for over a dozen recorded merchant shipwrecks.'
      },
      {
        id: 'lbl_sea_chart',
        name: 'Sea Chart Title',
        type: 'label',
        layerId: 'layer_chart_labels',
        text: 'CARIBBEAN ARCHIPELAGO NAVIGATIONAL CHART',
        fontSize: 18,
        fontFamily: "'Cinzel', serif",
        color: '#0c2340',
        x: 540,
        y: 80,
        isBold: true
      }
    ]
  }
};
