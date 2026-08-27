/**
 * MapCraft - Automated Verification Test Suite
 * Tests geometry calculations, scale conversions, point-in-polygon, bearing, snap-to-grid, and map templates.
 */

import {
  calculateDistance,
  calculatePolylineLength,
  calculatePolygonArea,
  pointInPolygon,
  pointNearPolyline,
  calculateBearing,
  snapToGrid,
  formatScaledDistance,
  formatScaledArea
} from './js/core/math.js';
import { MAP_TEMPLATES } from './js/editor/templates.js';
import { MAP_THEMES } from './js/engine/themes.js';
import { MARKER_ICONS_LIST } from './js/core/icons.js';

console.log('--- 1. Testing Geometry & Distance Math ---');
const p1 = { x: 0, y: 0 };
const p2 = { x: 300, y: 400 };
const dist = calculateDistance(p1, p2);
console.log('Euclidean Distance (0,0) to (300,400):', dist, '(Expected 500)');
if (dist !== 500) throw new Error('Distance calculation failed');

const polyline = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 200, y: 100 }];
const polyLen = calculatePolylineLength(polyline);
console.log('Polyline Total Length:', polyLen, '(Expected 300)');
if (polyLen !== 300) throw new Error('Polyline length failed');

console.log('\n--- 2. Testing Shoelace Polygon Area ---');
// 100x100 Square
const square = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }];
const areaSquare = calculatePolygonArea(square);
console.log('100x100 Square Area:', areaSquare, '(Expected 10000)');
if (areaSquare !== 10000) throw new Error('Polygon area failed');

console.log('\n--- 3. Testing Point-in-Polygon Hit Testing ---');
const insidePt = { x: 50, y: 50 };
const outsidePt = { x: 150, y: 50 };
const isInside = pointInPolygon(insidePt, square);
const isOutside = pointInPolygon(outsidePt, square);
console.log('Point (50,50) inside square:', isInside);
console.log('Point (150,50) inside square:', isOutside);
if (!isInside || isOutside) throw new Error('Point in polygon failed');

console.log('\n--- 4. Testing Point Near Polyline ---');
const nearPt = { x: 50, y: 3 };
const farPt = { x: 50, y: 50 };
const isNear = pointNearPolyline(nearPt, polyline, 5);
const isFar = pointNearPolyline(farPt, polyline, 5);
console.log('Point (50,3) near line segment (0,0)-(100,0):', isNear);
console.log('Point (50,50) near line segment:', isFar);
if (!isNear || isFar) throw new Error('Point near polyline failed');

console.log('\n--- 5. Testing Bearing & Snap to Grid ---');
const bearingEast = calculateBearing({ x: 0, y: 0 }, { x: 10, y: 0 });
const bearingSouth = calculateBearing({ x: 0, y: 0 }, { x: 0, y: 10 });
console.log('Bearing East (0,0)->(10,0):', bearingEast, '° (Expected 90)');
console.log('Bearing South (0,0)->(0,10):', bearingSouth, '° (Expected 180)');
if (bearingEast !== 90 || bearingSouth !== 180) throw new Error('Bearing calculation failed');

const snappedSquare = snapToGrid(48, 52, 50, 'square');
console.log('Snap to Square Grid (48, 52 @ 50px):', snappedSquare, '(Expected x:50, y:50)');
if (snappedSquare.x !== 50 || snappedSquare.y !== 50) throw new Error('Square grid snap failed');

console.log('\n--- 6. Testing Scale Formatting ---');
// 100px = 10 km -> 500px = 50 km
const scaledDist = formatScaledDistance(500, 10, 'km');
console.log('Scaled Distance (500px @ 10km/100px):', scaledDist, '(Expected 50.0 km)');
if (scaledDist !== '50.0 km') throw new Error('Scale distance formatting failed');

const scaledArea = formatScaledArea(10000, 10, 'km');
console.log('Scaled Area (10000px² @ 10km/100px):', scaledArea, '(Expected 100.0 km²)');
if (scaledArea !== '100.0 km²') throw new Error('Scale area formatting failed');

console.log('\n--- 7. Testing Marker Symbols Registry ---');
console.log('Total Marker Symbols:', MARKER_ICONS_LIST.length);
if (MARKER_ICONS_LIST.length < 15) throw new Error('Insufficient marker symbols registered');

console.log('\n--- 8. Testing Map Templates & Themes ---');
for (const [key, tmpl] of Object.entries(MAP_TEMPLATES)) {
  console.log(`Template [${key}]: ${tmpl.name} (Layers: ${tmpl.layers.length}, Objects: ${tmpl.objects.length}, Theme: ${tmpl.themeId})`);
  if (!tmpl.id || !tmpl.layers || !tmpl.objects) throw new Error(`Template ${key} is invalid`);
}

for (const [key, thm] of Object.entries(MAP_THEMES)) {
  console.log(`Theme [${key}]: ${thm.name} (BG: ${thm.bgColor}, Accent: ${thm.accentColor})`);
  if (!thm.id || !thm.bgColor) throw new Error(`Theme ${key} is invalid`);
}

console.log('\n=============================================');
console.log('ALL MAPCRAFT TEST SUITES PASSED 100%!');
console.log('=============================================');
