/**
 * RoomPlanr - Spatial Collision & Distance Measurement Engine
 * Rotated OBB (Oriented Bounding Box) collision detection and dynamic distance-to-walls calculations.
 */

/**
 * Get the 4 corner points of a rotated rectangle in world coordinates
 */
export function getRotatedCorners(x, y, width, depth, rotationDegrees = 0) {
  const rad = (rotationDegrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const hw = width / 2;
  const hd = depth / 2;

  // Local corners relative to center
  const localCorners = [
    { x: -hw, y: -hd },
    { x: hw, y: -hd },
    { x: hw, y: hd },
    { x: -hw, y: hd }
  ];

  return localCorners.map(pt => ({
    x: x + (pt.x * cos - pt.y * sin),
    y: y + (pt.x * sin + pt.y * cos)
  }));
}

/**
 * Test if a world point (wx, wy) is inside a rotated rectangle item
 */
export function isPointInsideRotatedItem(wx, wy, item) {
  const dx = wx - item.x;
  const dy = wy - item.y;
  const rad = -((item.rotation || 0) * Math.PI) / 180;

  // Transform point into item's local coordinate space
  const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
  const localY = dx * Math.sin(rad) + dy * Math.cos(rad);

  const hw = (item.width || 1) / 2;
  const hd = (item.depth || 1) / 2;

  return Math.abs(localX) <= hw && Math.abs(localY) <= hd;
}

/**
 * Separating Axis Theorem (SAT) collision test between two convex polygons
 */
export function checkPolygonsIntersect(polyA, polyB) {
  const polygons = [polyA, polyB];

  for (let i = 0; i < polygons.length; i++) {
    const polygon = polygons[i];

    for (let i1 = 0; i1 < polygon.length; i1++) {
      const i2 = (i1 + 1) % polygon.length;
      const p1 = polygon[i1];
      const p2 = polygon[i2];

      // Perpendicular axis vector
      const normal = { x: -(p2.y - p1.y), y: p2.x - p1.x };

      // Project polyA onto normal
      let minA = Infinity, maxA = -Infinity;
      for (const p of polyA) {
        const projected = normal.x * p.x + normal.y * p.y;
        minA = Math.min(minA, projected);
        maxA = Math.max(maxA, projected);
      }

      // Project polyB onto normal
      let minB = Infinity, maxB = -Infinity;
      for (const p of polyB) {
        const projected = normal.x * p.x + normal.y * p.y;
        minB = Math.min(minB, projected);
        maxB = Math.max(maxB, projected);
      }

      // Separating axis found -> no collision
      if (maxA < minB || maxB < minA) {
        return false;
      }
    }
  }

  return true; // Overlap on all axes
}

/**
 * Check if furniture item intersects another furniture item
 */
export function checkFurnitureOverlap(itemA, itemB) {
  // Area rugs should not trigger collisions with other furniture placed on top
  if (itemA.type === 'rug_large' || itemB.type === 'rug_large') {
    return false;
  }

  const cornersA = getRotatedCorners(itemA.x, itemA.y, itemA.width, itemA.depth, itemA.rotation || 0);
  const cornersB = getRotatedCorners(itemB.x, itemB.y, itemB.width, itemB.depth, itemB.rotation || 0);
  return checkPolygonsIntersect(cornersA, cornersB);
}

/**
 * Check if furniture item is outside room perimeter
 */
export function checkOutsideRoom(item, roomWidth, roomDepth) {
  const corners = getRotatedCorners(item.x, item.y, item.width, item.depth, item.rotation || 0);
  for (const pt of corners) {
    if (pt.x < -0.05 || pt.x > roomWidth + 0.05 || pt.y < -0.05 || pt.y > roomDepth + 0.05) {
      return true;
    }
  }
  return false;
}

/**
 * Calculate perpendicular distances from item center to nearest 4 walls
 */
export function getDistancesToWalls(item, roomWidth, roomDepth) {
  const hw = (item.width || 1) / 2;
  const hd = (item.depth || 1) / 2;

  const left = Math.max(0, item.x - hw);
  const right = Math.max(0, roomWidth - (item.x + hw));
  const top = Math.max(0, item.y - hd);
  const bottom = Math.max(0, roomDepth - (item.y + hd));

  return {
    left: parseFloat(left.toFixed(2)),
    right: parseFloat(right.toFixed(2)),
    top: parseFloat(top.toFixed(2)),
    bottom: parseFloat(bottom.toFixed(2))
  };
}
