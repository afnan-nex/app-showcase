/**
 * GameSmith - Pre-Built Game Templates
 * Production-quality starter templates with handcrafted pixel art sprites, balanced levels, physics, and gameplay logic.
 */

// Helper to generate 16x16 pixel matrix from visual ASCII art
function createPixelSprite(asciiArt, colorMap) {
  const lines = asciiArt.trim().split('\n').map(l => l.trim());
  const pixels = [];
  for (let r = 0; r < 16; r++) {
    const rowStr = lines[r] || '................';
    for (let c = 0; c < 16; c++) {
      const char = rowStr[c] || '.';
      pixels.push(colorMap[char] || 'transparent');
    }
  }
  return pixels;
}

// 1. Knight Sprite (CyberRunner)
const KNIGHT_ASCII = `
....bbbbbb......
...b111111b.....
..b12222221b....
..b12333321b....
..b11111111b....
...b444444b.....
..b45555554b....
..b55111155b....
..b55111155b....
..b55555555b....
...b444444b.....
...b66..66b.....
...b66..66b.....
...b77..77b.....
...bb....bb.....
................
`;
const KNIGHT_PIXELS = createPixelSprite(KNIGHT_ASCII, {
  'b': '#161b22',
  '1': '#58a6ff',
  '2': '#79c0ff',
  '3': '#ffffff',
  '4': '#30363d',
  '5': '#21262d',
  '6': '#1f6feb',
  '7': '#0d1117'
});

// 2. Cyber Drone Sprite (Patrol Enemy)
const DRONE_ASCII = `
................
....bbbbbb......
...b111111b.....
..b11222211b....
..b12333321b....
..b12344321b....
..b12333321b....
..b11222211b....
...b111111b.....
....bbbbbb......
...b55..55b.....
..b55....55b....
..bb......bb....
................
................
................
`;
const DRONE_PIXELS = createPixelSprite(DRONE_ASCII, {
  'b': '#161b22',
  '1': '#f85149',
  '2': '#ff7b72',
  '3': '#ffffff',
  '4': '#da3633',
  '5': '#d29922'
});

// 3. Crystal Gem Sprite
const GEM_ASCII = `
......bb........
.....b11b.......
....b1221b......
...b123321b.....
..b12333321b....
.b1233333321b...
.b1122332211b...
..b11122111b....
...b111111b.....
....b1111b......
.....b11b.......
......bb........
................
................
................
................
`;
const GEM_PIXELS = createPixelSprite(GEM_ASCII, {
  'b': '#1f6feb',
  '1': '#58a6ff',
  '2': '#79c0ff',
  '3': '#ffffff'
});

// 4. Star Fighter Ship
const SHIP_ASCII = `
.......bb.......
......b11b......
......b11b......
.....b2112b.....
.....b2332b.....
....b223322b....
....b123321b....
...b11222211b...
...b11111111b...
..b4115555114b..
..b4155555514b..
.b4455bbbb5544b.
.bb.b66..66b.bb.
....b7....7b....
................
................
`;
const SHIP_PIXELS = createPixelSprite(SHIP_ASCII, {
  'b': '#161b22',
  '1': '#3fb950',
  '2': '#56d364',
  '3': '#ffffff',
  '4': '#238636',
  '5': '#30363d',
  '6': '#f0883e',
  '7': '#f85149'
});

// 5. Asteroid Rock
const ASTEROID_ASCII = `
.....bbbbbb.....
...bb111111bb...
..b1112211111b..
.b112222221111b.
.b122333222111b.
b11233333222111b
b11223332222111b
b11122222111111b
b11111111221111b
b11122112222111b
.b112222222111b.
.b111222221111b.
..b1111111111b..
...bb111111bb...
.....bbbbbb.....
................
`;
const ASTEROID_PIXELS = createPixelSprite(ASTEROID_ASCII, {
  'b': '#21262d',
  '1': '#8b949e',
  '2': '#6e7681',
  '3': '#484f58'
});

// 6. Dungeon Hero
const HERO_ASCII = `
......bbbb......
.....b1111b.....
....b122221b....
....b133331b....
....b144441b....
.....b5555b.....
....b666666b....
...b66777766b...
..b8667777668b..
..b8667777668b..
...b66666666b...
....b55..55b....
....b99..99b....
....b99..99b....
....bb....bb....
................
`;
const HERO_PIXELS = createPixelSprite(HERO_ASCII, {
  'b': '#161b22',
  '1': '#d29922',
  '2': '#e3b341',
  '3': '#f0883e',
  '4': '#f6a782',
  '5': '#8b949e',
  '6': '#a371f7',
  '7': '#bc8cff',
  '8': '#58a6ff',
  '9': '#30363d'
});

// 7. Gold Key
const KEY_ASCII = `
.....bbbb.......
....b1111b......
...b122221b.....
...b12..21b.....
...b122221b.....
....b1111b......
.....b11b.......
.....b11b.......
.....b112b......
.....b11b.......
.....b112b......
.....b11b.......
.....bbbb.......
................
................
................
`;
const KEY_PIXELS = createPixelSprite(KEY_ASCII, {
  'b': '#9e6a03',
  '1': '#d29922',
  '2': '#f1e05a'
});

// 8. Treasure Chest
const CHEST_ASCII = `
...bbbbbbbbbb...
..b1111111111b..
.b122222222221b.
.b123333333321b.
.b111144441111b.
.b555544445555b.
.b566666666665b.
.b566677776665b.
.b566677776665b.
.b566666666665b.
.b555555555555b.
..bbbbbbbbbbbb..
................
................
................
................
`;
const CHEST_PIXELS = createPixelSprite(CHEST_ASCII, {
  'b': '#161b22',
  '1': '#8c501e',
  '2': '#a05a2c',
  '3': '#b86b35',
  '4': '#d29922',
  '5': '#30363d',
  '6': '#5c3818',
  '7': '#e3b341'
});

export const TEMPLATES = {
  // 1. Neon Knight (2D Platformer)
  platformer: {
    id: 'proj_neon_knight',
    name: 'CyberRunner: Neon Velocity',
    author: 'Aetheria Studios',
    description: 'High-speed cybernetic platformer featuring precision jumping, wall bouncing, patrolling security drones, and energy crystal extraction.',
    variables: { score: 0, lives: 3, crystals: 0 },
    sprites: {
      sprite_knight: { id: 'sprite_knight', name: 'Neon Knight', size: 16, primaryColor: '#58a6ff', pixels: KNIGHT_PIXELS },
      sprite_drone: { id: 'sprite_drone', name: 'Security Drone', size: 16, primaryColor: '#f85149', pixels: DRONE_PIXELS },
      sprite_gem: { id: 'sprite_gem', name: 'Energy Crystal', size: 16, primaryColor: '#58a6ff', pixels: GEM_PIXELS }
    },
    scenes: [
      {
        id: 'scene_level1',
        name: 'Sector 01: Neon Spire',
        bgColor: '#090d16',
        gravity: 980,
        cameraFollow: true,
        bounds: { width: 1800, height: 800 },
        objects: [
          // Player
          {
            id: 'player',
            name: 'Neon Knight',
            tag: 'player',
            layer: 10,
            x: 100,
            y: 540,
            width: 34,
            height: 48,
            color: '#58a6ff',
            spriteId: 'sprite_knight',
            physicsType: 'dynamic',
            hasCollider: true,
            isSolid: false,
            colliderShape: 'box',
            gravityScale: 1,
            behavior: 'player',
            moveSpeed: 340,
            jumpForce: 520,
            allowDoubleJump: true
          },
          // Main Ground
          {
            id: 'ground_1',
            name: 'Main Platform',
            tag: 'solid',
            layer: 1,
            x: 0,
            y: 680,
            width: 1800,
            height: 120,
            color: '#161b22',
            shape: 'platform',
            physicsType: 'static',
            hasCollider: true,
            isSolid: true
          },
          // Elevated Platforms
          { id: 'p1', name: 'Ascent Ledge 1', tag: 'solid', layer: 1, x: 260, y: 540, width: 160, height: 22, color: '#21262d', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'p2', name: 'Ascent Ledge 2', tag: 'solid', layer: 1, x: 500, y: 420, width: 180, height: 22, color: '#21262d', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'p3', name: 'Overpass Bridge', tag: 'solid', layer: 1, x: 780, y: 310, width: 220, height: 22, color: '#21262d', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'p4', name: 'High Vantage', tag: 'solid', layer: 1, x: 1100, y: 220, width: 180, height: 22, color: '#21262d', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'p5', name: 'Drop Zone', tag: 'solid', layer: 1, x: 1360, y: 480, width: 200, height: 22, color: '#21262d', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },

          // Energy Crystals
          { id: 'gem_1', name: 'Energy Crystal A', tag: 'crystal', layer: 5, x: 320, y: 480, width: 24, height: 24, spriteId: 'sprite_gem', physicsType: 'static', hasCollider: true, isSolid: false, behavior: 'sine_hover' },
          { id: 'gem_2', name: 'Energy Crystal B', tag: 'crystal', layer: 5, x: 580, y: 360, width: 24, height: 24, spriteId: 'sprite_gem', physicsType: 'static', hasCollider: true, isSolid: false, behavior: 'sine_hover' },
          { id: 'gem_3', name: 'Energy Crystal C', tag: 'crystal', layer: 5, x: 880, y: 250, width: 24, height: 24, spriteId: 'sprite_gem', physicsType: 'static', hasCollider: true, isSolid: false, behavior: 'sine_hover' },
          { id: 'gem_4', name: 'Energy Crystal D', tag: 'crystal', layer: 5, x: 1180, y: 160, width: 24, height: 24, spriteId: 'sprite_gem', physicsType: 'static', hasCollider: true, isSolid: false, behavior: 'sine_hover' },

          // Patrol Drone
          {
            id: 'drone_guard',
            name: 'Security Drone Alpha',
            tag: 'enemy',
            layer: 5,
            x: 820,
            y: 265,
            width: 32,
            height: 32,
            spriteId: 'sprite_drone',
            physicsType: 'static',
            hasCollider: true,
            isSolid: false,
            colliderShape: 'circle',
            behavior: 'patrol',
            patrolSpeed: 95,
            maxPatrolDist: 150
          },

          // Spikes Hazard
          { id: 'spikes_1', name: 'Hazard Spikes', tag: 'hazard', layer: 2, x: 440, y: 656, width: 140, height: 24, color: '#f85149', shape: 'spike', physicsType: 'static', hasCollider: true, isSolid: false },

          // Extraction Portal
          {
            id: 'portal_exit',
            name: 'Warp Extraction Gate',
            tag: 'portal',
            layer: 2,
            x: 1600,
            y: 560,
            width: 50,
            height: 120,
            color: '#3fb950',
            shape: 'portal',
            physicsType: 'static',
            hasCollider: true,
            isSolid: false
          }
        ],
        events: [
          // Gem Collection
          {
            id: 'rule_gem',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'player', targetType: 'crystal' },
            actions: [
              { type: 'change_variable', variable: 'score', operation: 'add', value: 250 },
              { type: 'change_variable', variable: 'crystals', operation: 'add', value: 1 },
              { type: 'play_sound', sound: 'coin' },
              { type: 'destroy_object', targetId: 'context.target' }
            ]
          },
          // Enemy Drone Hit
          {
            id: 'rule_drone',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'player', targetType: 'enemy' },
            actions: [
              { type: 'change_variable', variable: 'lives', operation: 'subtract', value: 1 },
              { type: 'camera_shake', intensity: 10, duration: 0.35 },
              { type: 'play_sound', sound: 'hit' },
              { type: 'show_message', message: 'Shield Compromised! -1 Life', duration: 2 },
              { type: 'set_position', targetId: 'player', x: 100, y: 540 }
            ]
          },
          // Spike Hazard Hit
          {
            id: 'rule_spike',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'player', targetType: 'hazard' },
            actions: [
              { type: 'change_variable', variable: 'lives', operation: 'subtract', value: 1 },
              { type: 'camera_shake', intensity: 8, duration: 0.3 },
              { type: 'play_sound', sound: 'hit' },
              { type: 'set_position', targetId: 'player', x: 100, y: 540 }
            ]
          },
          // Extraction Victory
          {
            id: 'rule_win',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'player', targetType: 'portal' },
            actions: [
              { type: 'play_sound', sound: 'win' },
              { type: 'show_message', message: 'Mission Accomplished! Sector Cleared!', duration: 5 }
            ]
          },
          // Out of Bounds Fall Respawn
          {
            id: 'rule_respawn',
            enabled: true,
            trigger: { type: 'on_out_of_bounds', objectId: 'player' },
            actions: [
              { type: 'change_variable', variable: 'lives', operation: 'subtract', value: 1 },
              { type: 'set_position', targetId: 'player', x: 100, y: 540 },
              { type: 'play_sound', sound: 'hit' }
            ]
          }
        ]
      }
    ]
  },

  // 2. Void Striker (Arcade Space Shooter)
  shooter: {
    id: 'proj_space_defender',
    name: 'Void Striker: Nova Defense',
    author: 'Starlight Interactive',
    description: 'Adrenaline-fueled arcade shooter with responsive starfighter combat, blaster mechanics, asteroid fields, and high-score chain multipliers.',
    variables: { score: 0, multiplier: 1, lasers: 200 },
    sprites: {
      sprite_ship: { id: 'sprite_ship', name: 'Star Fighter', size: 16, primaryColor: '#3fb950', pixels: SHIP_PIXELS },
      sprite_asteroid: { id: 'sprite_asteroid', name: 'Asteroid', size: 16, primaryColor: '#8b949e', pixels: ASTEROID_PIXELS }
    },
    scenes: [
      {
        id: 'scene_space_orbit',
        name: 'Deep Space: Nebula Belt',
        bgColor: '#030712',
        gravity: 0,
        cameraFollow: false,
        bounds: { width: 1200, height: 720 },
        objects: [
          // Spaceship
          {
            id: 'player_ship',
            name: 'Void Striker Ship',
            tag: 'player',
            layer: 10,
            x: 575,
            y: 560,
            width: 48,
            height: 48,
            spriteId: 'sprite_ship',
            physicsType: 'dynamic',
            hasCollider: true,
            isSolid: false,
            gravityScale: 0,
            behavior: 'topdown',
            moveSpeed: 320,
            clampBounds: true
          },
          // Asteroids
          { id: 'ast_1', name: 'Asteroid Alpha', tag: 'asteroid', layer: 5, x: 220, y: 140, width: 56, height: 56, spriteId: 'sprite_asteroid', physicsType: 'static', hasCollider: true, isSolid: false, colliderShape: 'circle', behavior: 'patrol', patrolSpeed: 70, maxPatrolDist: 240 },
          { id: 'ast_2', name: 'Asteroid Beta', tag: 'asteroid', layer: 5, x: 620, y: 180, width: 64, height: 64, spriteId: 'sprite_asteroid', physicsType: 'static', hasCollider: true, isSolid: false, colliderShape: 'circle', behavior: 'patrol', patrolSpeed: 85, maxPatrolDist: 280 },
          { id: 'ast_3', name: 'Asteroid Gamma', tag: 'asteroid', layer: 5, x: 920, y: 120, width: 52, height: 52, spriteId: 'sprite_asteroid', physicsType: 'static', hasCollider: true, isSolid: false, colliderShape: 'circle', behavior: 'patrol', patrolSpeed: 60, maxPatrolDist: 200 }
        ],
        events: [
          // Fire Laser (Space or J)
          {
            id: 'rule_shoot_laser',
            enabled: true,
            trigger: { type: 'on_key_press', key: 'Space' },
            actions: [
              { type: 'spawn_object', objectName: 'Laser Beam', tag: 'laser', spawnAt: 'player', width: 6, height: 20, color: '#3fb950', vx: 0, vy: -700, behavior: 'bullet', lifespan: 1.5 },
              { type: 'play_sound', sound: 'laser' }
            ]
          },
          // Laser Hits Asteroid
          {
            id: 'rule_destroy_asteroid',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'ast_1', targetType: 'laser' },
            actions: [
              { type: 'change_variable', variable: 'score', operation: 'add', value: 500 },
              { type: 'camera_shake', intensity: 6, duration: 0.25 },
              { type: 'play_sound', sound: 'explosion' },
              { type: 'destroy_object', targetId: 'context.target' }
            ]
          },
          // Laser Hits Asteroid Beta
          {
            id: 'rule_destroy_asteroid_2',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'ast_2', targetType: 'laser' },
            actions: [
              { type: 'change_variable', variable: 'score', operation: 'add', value: 500 },
              { type: 'camera_shake', intensity: 6, duration: 0.25 },
              { type: 'play_sound', sound: 'explosion' },
              { type: 'destroy_object', targetId: 'context.target' }
            ]
          },
          // Laser Hits Asteroid Gamma
          {
            id: 'rule_destroy_asteroid_3',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'ast_3', targetType: 'laser' },
            actions: [
              { type: 'change_variable', variable: 'score', operation: 'add', value: 500 },
              { type: 'camera_shake', intensity: 6, duration: 0.25 },
              { type: 'play_sound', sound: 'explosion' },
              { type: 'destroy_object', targetId: 'context.target' }
            ]
          }
        ]
      }
    ]
  },

  // 3. Dungeon Relic (Top-Down RPG Adventure)
  adventure: {
    id: 'proj_dungeon_quest',
    name: 'Shadow Crypt: Dungeon Relic',
    author: 'Mythic Forge Games',
    description: 'Atmospheric top-down dungeon crawler with locked stone gates, hidden keys, chaser guardians, and legendary treasure loot.',
    variables: { score: 0, keys: 0, health: 100 },
    sprites: {
      sprite_hero: { id: 'sprite_hero', name: 'Dungeon Hero', size: 16, primaryColor: '#a371f7', pixels: HERO_PIXELS },
      sprite_key: { id: 'sprite_key', name: 'Golden Key', size: 16, primaryColor: '#d29922', pixels: KEY_PIXELS },
      sprite_chest: { id: 'sprite_chest', name: 'Treasure Chest', size: 16, primaryColor: '#b86b35', pixels: CHEST_PIXELS },
      sprite_drone: { id: 'sprite_slime', name: 'Crypt Slime', size: 16, primaryColor: '#f85149', pixels: DRONE_PIXELS }
    },
    scenes: [
      {
        id: 'scene_crypt_entrance',
        name: 'Chamber I: Ancient Hall',
        bgColor: '#111827',
        gravity: 0,
        cameraFollow: true,
        bounds: { width: 1400, height: 900 },
        objects: [
          // Hero
          {
            id: 'hero',
            name: 'Sir Galahad',
            tag: 'player',
            layer: 10,
            x: 180,
            y: 440,
            width: 36,
            height: 40,
            spriteId: 'sprite_hero',
            physicsType: 'dynamic',
            hasCollider: true,
            isSolid: false,
            gravityScale: 0,
            behavior: 'topdown',
            moveSpeed: 250
          },
          // Dungeon Walls
          { id: 'w_north', name: 'North Crypt Wall', tag: 'solid', layer: 1, x: 40, y: 40, width: 1320, height: 32, color: '#374151', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'w_south', name: 'South Crypt Wall', tag: 'solid', layer: 1, x: 40, y: 820, width: 1320, height: 32, color: '#374151', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'w_west', name: 'West Crypt Wall', tag: 'solid', layer: 1, x: 40, y: 40, width: 32, height: 812, color: '#374151', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'w_east', name: 'East Crypt Wall', tag: 'solid', layer: 1, x: 1328, y: 40, width: 32, height: 812, color: '#374151', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },

          // Interior Pillars / Partitions
          { id: 'pillar_1', name: 'Obelisk Left', tag: 'solid', layer: 1, x: 440, y: 160, width: 48, height: 260, color: '#1f2937', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'pillar_2', name: 'Obelisk Right', tag: 'solid', layer: 1, x: 440, y: 520, width: 48, height: 260, color: '#1f2937', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },

          // Key Pickup
          { id: 'key_relic', name: 'Golden Relic Key', tag: 'key', layer: 4, x: 260, y: 180, width: 28, height: 28, spriteId: 'sprite_key', physicsType: 'static', hasCollider: true, isSolid: false, behavior: 'sine_hover' },

          // Crypt Guardian
          { id: 'guardian', name: 'Crypt Guardian', tag: 'enemy', layer: 5, x: 800, y: 440, width: 36, height: 36, spriteId: 'sprite_drone', physicsType: 'dynamic', hasCollider: true, isSolid: false, colliderShape: 'circle', behavior: 'chaser', chaseSpeed: 110, detectRange: 320 },

          // Treasure Chest
          { id: 'chest_gold', name: 'King\'s Treasure Chest', tag: 'chest', layer: 3, x: 1100, y: 430, width: 48, height: 44, spriteId: 'sprite_chest', physicsType: 'static', hasCollider: true, isSolid: true }
        ],
        events: [
          // Key Pickup Rule
          {
            id: 'rule_key',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'hero', targetType: 'key' },
            actions: [
              { type: 'change_variable', variable: 'keys', operation: 'add', value: 1 },
              { type: 'play_sound', sound: 'powerup' },
              { type: 'show_message', message: 'Found the Golden Crypt Key!', duration: 2.5 },
              { type: 'destroy_object', targetId: 'context.target' }
            ]
          },
          // Chest Open Rule
          {
            id: 'rule_chest',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'hero', targetType: 'chest' },
            actions: [
              { type: 'change_variable', variable: 'score', operation: 'add', value: 2000 },
              { type: 'play_sound', sound: 'win' },
              { type: 'show_message', message: 'Treasure Unlocked! Quest Complete!', duration: 5 }
            ]
          },
          // Guardian Hit Rule
          {
            id: 'rule_guardian_hit',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'hero', targetType: 'enemy' },
            actions: [
              { type: 'change_variable', variable: 'health', operation: 'subtract', value: 25 },
              { type: 'camera_shake', intensity: 8, duration: 0.3 },
              { type: 'play_sound', sound: 'hit' },
              { type: 'set_position', targetId: 'hero', x: 180, y: 440 }
            ]
          }
        ]
      }
    ]
  }
};
