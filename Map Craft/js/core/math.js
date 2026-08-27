/**
 * GameSmith / MapCraft - Cartographic & Geometry Math Engine
 * Distance calculation, Shoelace polygon area, point-in-polygon, and scale conversions.
 */

export function calculateDistance(p1, p2) {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

export function calculatePolylineLength(points) {
  if (!points || points.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    total += calculateDistance(points[i], points[i + 1]);
  }
  return total;
}

// Shoelace formula for polygon area
export function calculatePolygonArea(points) {
  if (!points || points.length < 3) return 0;
  let area = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area) / 2;
}

// Ray-casting algorithm for Point in Polygon
export function pointInPolygon(point, polygon) {
  if (!polygon || polygon.length < 3) return false;
  let inside = false;
  const x = point.x, y = point.y;
  const n = polygon.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;

    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

// Distance from point P to line segment AB
export function distanceToSegment(p, a, b) {
  const l2 = Math.hypot(b.x - a.x, b.y - a.y) ** 2;
  if (l2 === 0) return calculateDistance(p, a);

  let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
  t = Math.max(0, Math.min(1, t));

  const projX = a.x + t * (b.x - a.x);
  const projY = a.y + t * (b.y - a.y);
  return Math.hypot(p.x - projX, p.y - projY);
}

export function pointNearPolyline(p, points, threshold = 8) {
  if (!points || points.length < 2) return false;
  for (let i = 0; i < points.length - 1; i++) {
    if (distanceToSegment(p, points[i], points[i + 1]) <= threshold) {
      return true;
    }
  }
  return false;
}

/**
 * Scaled Units Formatter
 * scaleRatio: How many real-world units per 100 pixels (e.g. 100px = 10 km)
 */
export function formatScaledDistance(pixels, scaleRatio = 10, unit = 'km') {
  const realUnits = (pixels / 100) * scaleRatio;
  if (unit === 'km') {
    if (realUnits < 1) {
      return `${Math.round(realUnits * 1000)} m`;
    }
    return `${realUnits.toFixed(1)} km`;
  }
  if (unit === 'mi') {
    if (realUnits < 0.1) {
      return `${Math.round(realUnits * 5280)} ft`;
    }
    return `${realUnits.toFixed(1)} mi`;
  }
  return `${Math.round(realUnits)} ${unit}`;
}

export function formatScaledArea(pixelArea, scaleRatio = 10, unit = 'km') {
  // Area scaling is squared: (pixels / 100)^2 * scaleRatio^2
  const realUnitsSq = ((Math.sqrt(pixelArea) / 100) * scaleRatio) ** 2;
  if (unit === 'km') {
    if (realUnitsSq < 0.1) {
      return `${Math.round(realUnitsSq * 1000000)} m²`;
    }
    return `${realUnitsSq.toFixed(1)} km²`;
  }
  if (unit === 'mi') {
    return `${realUnitsSq.toFixed(1)} sq mi`;
  }
  return `${Math.round(realUnitsSq)} sq ${unit}`;
}
