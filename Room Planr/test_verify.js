/**
 * RoomPlanr - Automated Verification Test Suite
 * Tests unit conversions, grid snapping, rotated OBB collisions, and sample room data.
 */

import { formatDimension, formatArea, formatPrice, parseToMeters, snapToGrid, snapAngle, UNITS } from './js/core/units.js';
import { checkFurnitureOverlap, checkOutsideRoom, getDistancesToWalls } from './js/engine/collision.js';
import { FURNITURE_CATALOG, FLOOR_MATERIALS } from './js/engine/catalog.js';
import { SAMPLE_ROOMS } from './js/engine/sample-rooms.js';

console.log('--- 1. Testing Real-World Unit Measurement Engine ---');
const metersStr = formatDimension(2.45, UNITS.METERS);
const cmStr = formatDimension(2.45, UNITS.CENTIMETERS);
const mmStr = formatDimension(2.45, UNITS.MILLIMETERS);
const ftStr = formatDimension(2.45, UNITS.FEET_INCHES);

console.log('2.45m in Meters:', metersStr);
console.log('2.45m in Centimeters:', cmStr);
console.log('2.45m in Millimeters:', mmStr);
console.log('2.45m in Feet/Inches:', ftStr);

if (metersStr !== '2.45 m' || cmStr !== '245 cm' || mmStr !== '2450 mm' || !ftStr.includes('8′')) {
  throw new Error('Unit formatting failed');
}

const areaM = formatArea(31.2, UNITS.METERS);
const areaFt = formatArea(31.2, UNITS.FEET_INCHES);
console.log('31.2 m² in Metric:', areaM, '| in Imperial:', areaFt);
if (areaM !== '31.2 m²' || !areaFt.includes('sq ft')) throw new Error('Area formatting failed');

const priceStr = formatPrice(2450, 'USD');
console.log('Price formatting 2450 USD:', priceStr);
if (priceStr !== '$2,450') throw new Error('Price formatting failed');

const parsedMeters = parseToMeters('250', UNITS.CENTIMETERS);
console.log('Parsed "250 cm" -> meters:', parsedMeters);
if (parsedMeters !== 2.5) throw new Error('Unit parsing failed');

console.log('\n--- 2. Testing Grid & Angle Snapping ---');
const snapped1 = snapToGrid(1.234, 0.10);
const snapped2 = snapToGrid(1.234, 0.25);
console.log('1.234m snapped to 10cm:', snapped1, '| snapped to 25cm:', snapped2);
if (snapped1 !== 1.2 || snapped2 !== 1.25) throw new Error('Grid snapping failed');

const snappedAngle = snapAngle(42, 45);
console.log('Angle 42° snapped to 45° step:', snappedAngle);
if (snappedAngle !== 45) throw new Error('Angle snapping failed');

console.log('\n--- 3. Testing Rotated OBB Collision Detection Engine ---');
const itemA = { x: 2.0, y: 2.0, width: 2.0, depth: 1.0, rotation: 0 };
const itemB_overlapping = { x: 2.5, y: 2.2, width: 1.5, depth: 0.8, rotation: 45 };
const itemC_far = { x: 5.0, y: 5.0, width: 1.0, depth: 1.0, rotation: 0 };

const overlapAB = checkFurnitureOverlap(itemA, itemB_overlapping);
const overlapAC = checkFurnitureOverlap(itemA, itemC_far);

console.log('Overlap A (2,2) vs B (2.5, 2.2, rotated 45°):', overlapAB, '(Expected true)');
console.log('Overlap A (2,2) vs C (5,5):', overlapAC, '(Expected false)');

if (!overlapAB || overlapAC) throw new Error('OBB collision detection failed');

console.log('\n--- 4. Testing Room Boundary & Distance Measurements ---');
const outsideItem = { x: 6.5, y: 2.0, width: 1.0, depth: 1.0, rotation: 0 };
const isOutside = checkOutsideRoom(outsideItem, 6.0, 4.5);
console.log('Item at X=6.5 in 6.0m room is outside:', isOutside, '(Expected true)');
if (!isOutside) throw new Error('Outside room detection failed');

const insideItem = { x: 2.0, y: 2.0, width: 1.0, depth: 1.0, rotation: 0 };
const distances = getDistancesToWalls(insideItem, 6.0, 4.0);
console.log('Distances from (2,2, 1x1m) to walls in 6x4m room: Left:', distances.left, 'Right:', distances.right, 'Top:', distances.top, 'Bottom:', distances.bottom);
if (distances.left !== 1.5 || distances.right !== 3.5 || distances.top !== 1.5 || distances.bottom !== 1.5) {
  throw new Error('Wall distance calculation failed');
}

console.log('\n--- 5. Testing Catalog & Sample Rooms ---');
console.log('Furniture Catalog items count:', FURNITURE_CATALOG.length);
if (FURNITURE_CATALOG.length < 35) throw new Error('Catalog is incomplete');

for (const [key, room] of Object.entries(SAMPLE_ROOMS)) {
  console.log(`Sample Room: ${room.name} (${room.width}x${room.depth}m, Client: ${room.client}, Scenarios: ${Object.keys(room.scenarios).length})`);
  if (!room.id || !room.scenarios || !room.client) throw new Error(`Room ${key} is invalid`);
}

console.log('\n=============================================');
console.log('ALL ROOMPLANR ENGINES & TESTS PASSED 100%!');
console.log('=============================================');
