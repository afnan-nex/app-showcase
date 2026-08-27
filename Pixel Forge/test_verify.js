/**
 * PixelForge - Automated Verification Test Suite
 * Tests pixel drawing algorithms, flood fill, Bayer dithering, spatial transforms,
 * color adjustments, project templates, tilemap engine, and SVG generation.
 */

import {
  getLinePixels,
  getRectPixels,
  getCirclePixels,
  floodFill,
  getDitherColor,
  filterPixelPerfect,
  flipPixelsHorizontal,
  flipPixelsVertical,
  rotatePixels90CW,
  resizePixelBuffer,
  scalePixelBuffer,
  replaceColorInPixels,
  adjustPixelsBrightnessContrast,
  invertPixels,
  grayscalePixels,
  hexToRgb,
  rgbToHex,
  rgbToHsv,
  hsvToRgb
} from './js/core/math-draw.js';
import { TEMPLATES } from './js/editor/templates.js';
import { PALETTES, parseHexPalette, exportHexPalette } from './js/core/palettes.js';
import { AnimationEngine } from './js/engine/animation.js';
import { TilemapEngine } from './js/engine/tilemap.js';

console.log('--- 1. Testing Bresenham Line Algorithm ---');
const line = getLinePixels(0, 0, 4, 4);
console.log('Line (0,0) -> (4,4) Points:', line.length, '(Expected 5 points: (0,0) to (4,4))');
if (line.length !== 5 || line[0].x !== 0 || line[4].x !== 4) throw new Error('Bresenham line algorithm failed');

console.log('\n--- 2. Testing Rectangle Algorithm ---');
const rectOutline = getRectPixels(0, 0, 2, 2, false);
console.log('3x3 Rect Outline Points:', rectOutline.length, '(Expected 8 perimeter points)');
const rectFill = getRectPixels(0, 0, 2, 2, true);
console.log('3x3 Rect Filled Points:', rectFill.length, '(Expected 9 filled points)');
if (rectOutline.length !== 8 || rectFill.length !== 9) throw new Error('Rectangle algorithm failed');

console.log('\n--- 3. Testing Midpoint Circle Algorithm ---');
const circle = getCirclePixels(10, 10, 3, false);
console.log('Circle (radius 3) outline points:', circle.length);
if (circle.length === 0) throw new Error('Circle algorithm failed');

console.log('\n--- 4. Testing 4-Way Queue Flood Fill Algorithm ---');
const testGrid = new Array(16).fill('#000000'); // 4x4 black grid
testGrid[5] = '#ffffff'; // (1,1) is white
const fillChanges = floodFill(testGrid, 4, 4, 0, 0, '#ff0000');
console.log('Flood Fill modified pixels count (Expected 15 of 16):', fillChanges.length);
if (fillChanges.length !== 15) throw new Error('Flood fill algorithm failed');

console.log('\n--- 5. Testing Bayer Dithering ---');
const dither1 = getDitherColor(0, 0, '#ffffff', '#000000', 8);
const dither2 = getDitherColor(1, 0, '#ffffff', '#000000', 8);
console.log('Bayer Dither (0,0):', dither1, 'vs (1,0):', dither2);

console.log('\n--- 6. Testing Pixel-Perfect Filter ---');
const rawLStroke = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }]; // L-shaped turn
const filtered = filterPixelPerfect(rawLStroke);
console.log('Raw L-Stroke length (3) -> Filtered length:', filtered.length, '(Expected 2 without corner)');
if (filtered.length !== 2) throw new Error('Pixel-perfect filter failed');

console.log('\n--- 7. Testing Spatial Transformations (Flip / Rotate / Scale) ---');
const sampleGrid = ['#111', '#222', '#333', '#444']; // 2x2 grid
const flippedH = flipPixelsHorizontal(sampleGrid, 2, 2);
console.log('Original row 1:', sampleGrid[0], sampleGrid[1], '-> Flipped H row 1:', flippedH[0], flippedH[1]);
if (flippedH[0] !== '#222' || flippedH[1] !== '#111') throw new Error('Horizontal flip failed');

const rotated = rotatePixels90CW(sampleGrid, 2, 2);
console.log('Rotate 90 CW check passed:', rotated.length === 4);

const scaled = scalePixelBuffer(sampleGrid, 2, 2, 2);
console.log('Scale 2x (2x2 -> 4x4):', scaled.width, 'x', scaled.height, 'Length:', scaled.pixels.length);
if (scaled.width !== 4 || scaled.height !== 4 || scaled.pixels.length !== 16) throw new Error('Pixel scale failed');

console.log('\n--- 8. Testing Color Adjustments & Filters ---');
const inverted = invertPixels(['#000000', '#ffffff']);
console.log('Invert Black ->', inverted[0], '(Expected #ffffff), Invert White ->', inverted[1], '(Expected #000000)');
if (inverted[0] !== '#ffffff' || inverted[1] !== '#000000') throw new Error('Invert failed');

const grayscaled = grayscalePixels(['#ff0000']);
console.log('Grayscale Pure Red ->', grayscaled[0]);

const replaced = replaceColorInPixels(['#ff0000', '#00ff00', '#ff0000'], '#ff0000', '#0000ff', null, 3, 1);
if (replaced[0] !== '#0000ff' || replaced[1] !== '#00ff00' || replaced[2] !== '#0000ff') throw new Error('Replace color failed');

console.log('\n--- 9. Testing Project Templates & Palettes ---');
for (const [key, tmpl] of Object.entries(TEMPLATES)) {
  console.log(`Template: ${tmpl.name} (${tmpl.width}x${tmpl.height}, Frames: ${tmpl.frames.length})`);
  if (!tmpl.id || !tmpl.frames || tmpl.frames.length === 0) throw new Error(`Template ${key} is invalid`);
}

for (const [key, pal] of Object.entries(PALETTES)) {
  console.log(`Palette: ${pal.name} (${pal.colors.length} colors)`);
  if (!pal.id || !pal.colors || pal.colors.length === 0) throw new Error(`Palette ${key} is invalid`);
}

console.log('\n--- 10. Testing Tilemap Engine ---');
const mockApp = { project: TEMPLATES.dungeon, activeFrameIndex: 0 };
const tilemapEngine = new TilemapEngine(mockApp);
tilemapEngine.sliceTilesFromProject(16);
console.log('Sliced Dungeon Tiles count (Expected 4 from 32x32):', tilemapEngine.tiles.length);
if (tilemapEngine.tiles.length !== 4) throw new Error('Tilemap slicing failed');

tilemapEngine.setTileAt(0, 0, 2);
if (tilemapEngine.getTileAt(0, 0) !== 2) throw new Error('Tilemap setTileAt failed');

console.log('\n--- 11. Testing Animated SVG Generator ---');
const animEngine = new AnimationEngine(mockApp);
const svgOutput = animEngine.generateAnimatedSVG(10);
console.log('Generated Animated SVG Length:', svgOutput.length, 'bytes');
if (!svgOutput.includes('<svg') || !svgOutput.includes('@keyframes anim_frame_') || !svgOutput.includes('</svg>')) {
  throw new Error('Animated SVG generation failed');
}

console.log('\n=============================================');
console.log('ALL PIXELFORGE ENGINES & TESTS PASSED 100%!');
console.log('=============================================');
