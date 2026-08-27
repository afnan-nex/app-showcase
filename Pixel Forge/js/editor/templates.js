/**
 * PixelForge - Pre-Built Demonstration Projects
 * 3 rich pixel art projects: "Cyber Knight Run" (Animation), "Retro Dungeon Tileset" (Tilemap), "Pixel City Skyline" (Multi-Layer).
 */

export const TEMPLATES = {
  // 1. Cyber Knight Run (6-Frame Animation, 24x24)
  knight: {
    id: 'proj_cyber_knight',
    name: 'Cyber Knight Run',
    width: 24,
    height: 24,
    fps: 10,
    frames: [
      createFrame([createKnightLayer(0)]),
      createFrame([createKnightLayer(1)]),
      createFrame([createKnightLayer(2)]),
      createFrame([createKnightLayer(3)]),
      createFrame([createKnightLayer(4)]),
      createFrame([createKnightLayer(5)])
    ]
  },

  // 2. Retro Dungeon Tileset (32x32 Sprite for Slicing)
  dungeon: {
    id: 'proj_dungeon_tiles',
    name: 'Dungeon Tileset (16x16 Tiles)',
    width: 32,
    height: 32,
    fps: 8,
    frames: [
      createFrame([
        {
          id: 'layer_bricks',
          name: 'Stone Bricks & Walls',
          visible: true,
          locked: false,
          opacity: 1,
          pixels: createDungeonBricksPixels(32, 32)
        },
        {
          id: 'layer_props',
          name: 'Chest & Torches',
          visible: true,
          locked: false,
          opacity: 1,
          pixels: createDungeonPropsPixels(32, 32)
        }
      ])
    ]
  },

  // 3. Pixel City Skyline (Multi-layer 32x32 Scene)
  city: {
    id: 'proj_pixel_city',
    name: 'Cyberpunk Skyline',
    width: 32,
    height: 32,
    fps: 6,
    frames: [
      createFrame([
        {
          id: 'layer_sky',
          name: 'Night Sky & Moon',
          visible: true,
          locked: false,
          opacity: 1,
          pixels: createCitySkyPixels(32, 32)
        },
        {
          id: 'layer_buildings',
          name: 'Neon Skyscrapers',
          visible: true,
          locked: false,
          opacity: 1,
          pixels: createCityBuildingsPixels(32, 32)
        }
      ])
    ]
  }
};

function createFrame(layers) {
  return {
    id: 'frame_' + Math.random().toString(36).substr(2, 8),
    layers
  };
}

// Procedural Sprite Pixel Generators for Crisp Template Demonstration
function createKnightLayer(frameIdx) {
  const w = 24, h = 24;
  const pixels = new Array(w * h).fill('transparent');

  // Bobbing offset for running animation
  const bob = frameIdx % 2 === 0 ? 0 : 1;
  const legOffset = (frameIdx % 4) - 2;

  // Helmet / Visor
  for (let x = 8; x <= 14; x++) {
    for (let y = 3 + bob; y <= 8 + bob; y++) {
      pixels[y * w + x] = '#1e293b';
    }
  }
  // Cyan glowing visor line
  for (let x = 11; x <= 14; x++) {
    pixels[(6 + bob) * w + x] = '#00e5ff';
  }

  // Chest Armor
  for (let x = 7; x <= 15; x++) {
    for (let y = 9 + bob; y <= 15 + bob; y++) {
      pixels[y * w + x] = '#334155';
    }
  }
  // Cyber Core Glow
  pixels[(11 + bob) * w + 11] = '#00e5ff';
  pixels[(12 + bob) * w + 11] = '#00e5ff';

  // Cape (Flowing back)
  for (let y = 10 + bob; y <= 17 + bob; y++) {
    pixels[y * w + 6] = '#e11d48';
    pixels[y * w + 5] = '#be123c';
  }

  // Running Legs
  for (let y = 16 + bob; y <= 20; y++) {
    pixels[y * w + (9 + legOffset)] = '#475569';
    pixels[y * w + (13 - legOffset)] = '#64748b';
  }
  // Boots
  pixels[21 * w + (9 + legOffset)] = '#0f172a';
  pixels[21 * w + (13 - legOffset)] = '#0f172a';

  // Energy Blade Sword in hand
  for (let i = 0; i <= 6; i++) {
    pixels[(14 + bob - i) * w + (16 + i)] = '#38bdf8';
  }

  return {
    id: 'layer_knight',
    name: 'Cyber Knight',
    visible: true,
    locked: false,
    opacity: 1,
    pixels
  };
}

function createDungeonBricksPixels(w, h) {
  const pixels = new Array(w * h).fill('transparent');

  // Tile 1 (Top Left 16x16): Stone Wall Bricks
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const isMortar = y % 5 === 0 || (y < 5 && x === 8) || (y > 5 && y < 11 && (x === 4 || x === 12)) || (y > 11 && x === 8);
      pixels[y * w + x] = isMortar ? '#1f2937' : ((x + y) % 3 === 0 ? '#374151' : '#4b5563');
    }
  }

  // Tile 2 (Top Right 16x16): Floor Flagstones
  for (let y = 0; y < 16; y++) {
    for (let x = 16; x < 32; x++) {
      const isCrack = (x === 20 && y > 4 && y < 12) || (y === 8 && x > 24);
      pixels[y * w + x] = isCrack ? '#111827' : '#6b7280';
    }
  }

  return pixels;
}

function createDungeonPropsPixels(w, h) {
  const pixels = new Array(w * h).fill('transparent');

  // Treasure Chest (Bottom Left 16x16)
  for (let y = 20; y < 28; y++) {
    for (let x = 3; x < 13; x++) {
      pixels[y * w + x] = (y === 20 || y === 23) ? '#92400e' : '#b45309';
    }
  }
  // Gold Lock
  pixels[24 * w + 8] = '#f59e0b';
  pixels[25 * w + 8] = '#f59e0b';

  return pixels;
}

function createCitySkyPixels(w, h) {
  const pixels = new Array(w * h).fill('#090d16');

  // Stars
  [[4, 3], [12, 5], [22, 2], [28, 7], [8, 10], [18, 12]].forEach(([x, y]) => {
    pixels[y * w + x] = '#ffffff';
  });

  // Glowing Cyber Moon
  for (let y = 3; y <= 7; y++) {
    for (let x = 24; x <= 28; x++) {
      if (Math.hypot(x - 26, y - 5) <= 2.2) {
        pixels[y * w + x] = '#00e5ff';
      }
    }
  }

  return pixels;
}

function createCityBuildingsPixels(w, h) {
  const pixels = new Array(w * h).fill('transparent');

  // Skyscraper 1
  for (let y = 14; y < h; y++) {
    for (let x = 2; x < 10; x++) {
      pixels[y * w + x] = '#1e1b4b';
      if (y % 3 === 0 && x % 2 === 0) pixels[y * w + x] = '#ff007f'; // Neon Windows
    }
  }

  // Skyscraper 2 (Tall Middle)
  for (let y = 9; y < h; y++) {
    for (let x = 12; x < 22; x++) {
      pixels[y * w + x] = '#0f172a';
      if (y % 4 === 0 && x % 3 === 0) pixels[y * w + x] = '#00e5ff';
    }
  }

  return pixels;
}
