/**
 * GameSmith - Pre-Built Game Templates
 * Ready-to-play projects demonstrating 2D physics, visual rules, audio, and gameplay logic.
 */

export const TEMPLATES = {
  // 1. Neon Knight (2D Platformer)
  platformer: {
    id: 'proj_neon_knight',
    name: 'Neon Knight (2D Platformer)',
    version: '1.0',
    variables: { score: 0, lives: 3, coins: 0 },
    scenes: [
      {
        id: 'scene_level1',
        name: 'Level 1: Crystal Caverns',
        bgColor: '#090d16',
        gravity: 980,
        cameraFollow: true,
        bounds: { width: 1600, height: 800 },
        objects: [
          // Player
          {
            id: 'player',
            name: 'Neon Knight',
            tag: 'player',
            layer: 10,
            x: 100,
            y: 500,
            width: 32,
            height: 48,
            color: '#58a6ff',
            shape: 'rect',
            physicsType: 'dynamic',
            hasCollider: true,
            isSolid: false,
            colliderShape: 'box',
            gravityScale: 1,
            behavior: 'player',
            moveSpeed: 320,
            jumpForce: 520
          },
          // Floors & Platforms
          {
            id: 'floor_main',
            name: 'Ground Floor',
            tag: 'solid',
            layer: 1,
            x: 0,
            y: 680,
            width: 1600,
            height: 120,
            color: '#21262d',
            shape: 'platform',
            physicsType: 'static',
            hasCollider: true,
            isSolid: true
          },
          {
            id: 'plat_1',
            name: 'Floating Platform 1',
            tag: 'solid',
            layer: 1,
            x: 280,
            y: 520,
            width: 180,
            height: 24,
            color: '#30363d',
            shape: 'platform',
            physicsType: 'static',
            hasCollider: true,
            isSolid: true
          },
          {
            id: 'plat_2',
            name: 'Floating Platform 2',
            tag: 'solid',
            layer: 1,
            x: 560,
            y: 400,
            width: 160,
            height: 24,
            color: '#30363d',
            shape: 'platform',
            physicsType: 'static',
            hasCollider: true,
            isSolid: true
          },
          {
            id: 'plat_3',
            name: 'Floating Platform 3',
            tag: 'solid',
            layer: 1,
            x: 840,
            y: 300,
            width: 200,
            height: 24,
            color: '#30363d',
            shape: 'platform',
            physicsType: 'static',
            hasCollider: true,
            isSolid: true
          },
          // Collectible Coins
          {
            id: 'coin_1',
            name: 'Crystal Coin 1',
            tag: 'coin',
            layer: 5,
            x: 340,
            y: 460,
            width: 20,
            height: 20,
            color: '#f1e05a',
            shape: 'coin',
            physicsType: 'static',
            hasCollider: true,
            isSolid: false,
            colliderShape: 'circle'
          },
          {
            id: 'coin_2',
            name: 'Crystal Coin 2',
            tag: 'coin',
            layer: 5,
            x: 620,
            y: 340,
            width: 20,
            height: 20,
            color: '#f1e05a',
            shape: 'coin',
            physicsType: 'static',
            hasCollider: true,
            isSolid: false,
            colliderShape: 'circle'
          },
          {
            id: 'coin_3',
            name: 'Crystal Coin 3',
            tag: 'coin',
            layer: 5,
            x: 920,
            y: 240,
            width: 20,
            height: 20,
            color: '#f1e05a',
            shape: 'coin',
            physicsType: 'static',
            hasCollider: true,
            isSolid: false,
            colliderShape: 'circle'
          },
          // Enemy Patrol Slime
          {
            id: 'enemy_slime',
            name: 'Shadow Slime',
            tag: 'enemy',
            layer: 5,
            x: 880,
            y: 260,
            width: 28,
            height: 28,
            color: '#f85149',
            shape: 'circle',
            physicsType: 'static',
            hasCollider: true,
            isSolid: false,
            colliderShape: 'circle',
            behavior: 'patrol',
            patrolSpeed: 80,
            maxPatrolDist: 140
          },
          // Goal Flag / Portal
          {
            id: 'goal_portal',
            name: 'Victory Portal',
            tag: 'goal',
            layer: 2,
            x: 1400,
            y: 580,
            width: 40,
            height: 100,
            color: '#3fb950',
            shape: 'rect',
            physicsType: 'static',
            hasCollider: true,
            isSolid: false
          }
        ],
        events: [
          // Coin collection rule
          {
            id: 'rule_coin',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'player', targetType: 'coin' },
            actions: [
              { type: 'change_variable', variable: 'score', operation: 'add', value: 100 },
              { type: 'change_variable', variable: 'coins', operation: 'add', value: 1 },
              { type: 'play_sound', sound: 'coin' },
              { type: 'destroy_object', targetId: 'context.target' }
            ]
          },
          // Enemy collision rule
          {
            id: 'rule_enemy',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'player', targetType: 'enemy' },
            actions: [
              { type: 'change_variable', variable: 'lives', operation: 'subtract', value: 1 },
              { type: 'play_sound', sound: 'hit' },
              { type: 'show_message', message: 'Ouch! Lost 1 Life', duration: 2 },
              { type: 'set_position', targetId: 'player', x: 100, y: 500 }
            ]
          },
          // Goal victory rule
          {
            id: 'rule_goal',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'player', targetType: 'goal' },
            actions: [
              { type: 'play_sound', sound: 'win' },
              { type: 'show_message', message: 'Victory! Level Completed!', duration: 5 }
            ]
          },
          // Fall off screen respawn
          {
            id: 'rule_fall',
            enabled: true,
            trigger: { type: 'on_out_of_bounds', objectId: 'player' },
            actions: [
              { type: 'set_position', targetId: 'player', x: 100, y: 500 },
              { type: 'play_sound', sound: 'hit' }
            ]
          }
        ]
      }
    ],
    sprites: {
      sprite_knight: {
        id: 'sprite_knight',
        name: 'Knight Hero',
        size: 16,
        primaryColor: '#58a6ff',
        pixels: []
      }
    }
  },

  // 2. Space Defender (Arcade Shooter)
  shooter: {
    id: 'proj_space_defender',
    name: 'Space Defender (Arcade)',
    version: '1.0',
    variables: { score: 0, lasers: 100 },
    scenes: [
      {
        id: 'scene_space',
        name: 'Sector 7 Orbit',
        bgColor: '#030712',
        gravity: 0,
        cameraFollow: false,
        bounds: { width: 1024, height: 600 },
        objects: [
          // Spaceship
          {
            id: 'player_ship',
            name: 'Star Fighter',
            tag: 'player',
            layer: 10,
            x: 480,
            y: 480,
            width: 40,
            height: 40,
            color: '#3fb950',
            shape: 'spike',
            physicsType: 'dynamic',
            hasCollider: true,
            isSolid: false,
            gravityScale: 0,
            behavior: 'topdown',
            moveSpeed: 300
          },
          // Asteroids
          {
            id: 'asteroid_1',
            name: 'Meteor Alpha',
            tag: 'enemy',
            layer: 5,
            x: 200,
            y: 120,
            width: 44,
            height: 44,
            color: '#8b949e',
            shape: 'circle',
            physicsType: 'static',
            hasCollider: true,
            isSolid: false,
            colliderShape: 'circle',
            behavior: 'patrol',
            patrolSpeed: 60,
            maxPatrolDist: 200
          },
          {
            id: 'asteroid_2',
            name: 'Meteor Beta',
            tag: 'enemy',
            layer: 5,
            x: 600,
            y: 160,
            width: 52,
            height: 52,
            color: '#8b949e',
            shape: 'circle',
            physicsType: 'static',
            hasCollider: true,
            isSolid: false,
            colliderShape: 'circle',
            behavior: 'patrol',
            patrolSpeed: 75,
            maxPatrolDist: 220
          }
        ],
        events: [
          // Shoot Laser (Key J or Space)
          {
            id: 'rule_shoot',
            enabled: true,
            trigger: { type: 'on_key_press', key: 'Space' },
            actions: [
              { type: 'spawn_object', objectName: 'Laser', tag: 'laser', spawnAt: 'player', width: 6, height: 16, color: '#f85149', vx: 0, vy: -600, behavior: 'bullet' },
              { type: 'play_sound', sound: 'laser' }
            ]
          },
          // Laser hits enemy
          {
            id: 'rule_hit_enemy',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'asteroid_1', targetType: 'laser' },
            actions: [
              { type: 'change_variable', variable: 'score', operation: 'add', value: 250 },
              { type: 'play_sound', sound: 'explosion' },
              { type: 'destroy_object', targetId: 'context.target' }
            ]
          }
        ]
      }
    ]
  },

  // 3. Dungeon Quest (Top-Down Adventure)
  adventure: {
    id: 'proj_dungeon_quest',
    name: 'Dungeon Quest (Top-Down)',
    version: '1.0',
    variables: { score: 0, keys: 0, health: 100 },
    scenes: [
      {
        id: 'scene_dungeon',
        name: 'The Lost Crypt',
        bgColor: '#111827',
        gravity: 0,
        cameraFollow: true,
        bounds: { width: 1200, height: 800 },
        objects: [
          // Player
          {
            id: 'hero',
            name: 'Hero Adventurer',
            tag: 'player',
            layer: 10,
            x: 200,
            y: 400,
            width: 32,
            height: 32,
            color: '#a371f7',
            shape: 'circle',
            physicsType: 'dynamic',
            hasCollider: true,
            isSolid: false,
            gravityScale: 0,
            behavior: 'topdown',
            moveSpeed: 240
          },
          // Walls
          { id: 'w1', name: 'North Wall', tag: 'solid', layer: 1, x: 50, y: 50, width: 1100, height: 24, color: '#374151', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'w2', name: 'South Wall', tag: 'solid', layer: 1, x: 50, y: 720, width: 1100, height: 24, color: '#374151', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'w3', name: 'West Wall', tag: 'solid', layer: 1, x: 50, y: 50, width: 24, height: 694, color: '#374151', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'w4', name: 'East Wall', tag: 'solid', layer: 1, x: 1126, y: 50, width: 24, height: 694, color: '#374151', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          // Key & Chest
          { id: 'key_gold', name: 'Gold Key', tag: 'key', layer: 3, x: 450, y: 200, width: 20, height: 20, color: '#f1e05a', shape: 'coin', physicsType: 'static', hasCollider: true, isSolid: false },
          { id: 'chest_treasure', name: 'Treasure Chest', tag: 'chest', layer: 3, x: 950, y: 400, width: 40, height: 40, color: '#d29922', shape: 'rect', physicsType: 'static', hasCollider: true, isSolid: true }
        ],
        events: [
          {
            id: 'rule_get_key',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'hero', targetType: 'key' },
            actions: [
              { type: 'change_variable', variable: 'keys', operation: 'add', value: 1 },
              { type: 'play_sound', sound: 'powerup' },
              { type: 'show_message', message: 'Found Gold Key!', duration: 2 },
              { type: 'destroy_object', targetId: 'context.target' }
            ]
          },
          {
            id: 'rule_open_chest',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'hero', targetType: 'chest' },
            actions: [
              { type: 'change_variable', variable: 'score', operation: 'add', value: 1000 },
              { type: 'play_sound', sound: 'win' },
              { type: 'show_message', message: 'Opened Treasure! Quest Complete!', duration: 5 }
            ]
          }
        ]
      }
    ]
  }
};
