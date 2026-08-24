/* ==========================================================================
   CANVASFLOW — Geometry & Math Utilities
   ========================================================================== */

export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;

/**
 * Clamp a number between min and max
 */
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Euclidean distance between two points
 */
export function distance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.hypot(dx, dy);
}

/**
 * Rotate a point around a center point by an angle in radians
 */
export function rotatePoint(point, center, angleRad) {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return {
    x: center.x + (dx * cos - dy * sin),
    y: center.y + (dx * sin + dy * cos)
  };
}

/**
 * Calculate the center point of a bounding box
 */
export function getBoundsCenter(bounds) {
  return {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2
  };
}

/**
 * Normalize rectangle coordinates so width and height are non-negative
 */
export function normalizeRect(x, y, width, height) {
  let nx = x;
  let ny = y;
  let nw = width;
  let nh = height;

  if (nw < 0) {
    nx += nw;
    nw = Math.abs(nw);
  }
  if (nh < 0) {
    ny += nh;
    nh = Math.abs(nh);
  }

  return { x: nx, y: ny, width: nw, height: nh };
}

/**
 * Check if two AABB bounding boxes intersect
 */
export function boundsIntersect(b1, b2) {
  return !(
    b2.x > b1.x + b1.width ||
    b2.x + b2.width < b1.x ||
    b2.y > b1.y + b1.height ||
    b2.y + b2.height < b1.y
  );
}

/**
 * Check if bounding box b1 completely contains b2
 */
export function boundsContain(b1, b2) {
  return (
    b2.x >= b1.x &&
    b2.y >= b1.y &&
    b2.x + b2.width <= b1.x + b1.width &&
    b2.y + b2.height <= b1.y + b1.height
  );
}

/**
 * Combine multiple bounding boxes into an enclosing bounding box
 */
export function unionBounds(boundsList) {
  if (!boundsList || boundsList.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const b of boundsList) {
    if (!b) continue;
    minX = Math.min(minX, b.x);
    minY = Math.min(minY, b.y);
    maxX = Math.max(maxX, b.x + b.width);
    maxY = Math.max(maxY, b.y + b.height);
  }

  if (minX === Infinity) return { x: 0, y: 0, width: 0, height: 0 };

  return {
    x: minX,
    y: minY,
    width: Math.max(1, maxX - minX),
    height: Math.max(1, maxY - minY)
  };
}

/**
 * Calculate the bounding box of an object
 */
export function getObjectBounds(obj) {
  if (!obj) return { x: 0, y: 0, width: 0, height: 0 };

  switch (obj.type) {
    case 'line':
    case 'arrow':
    case 'connector': {
      const minX = Math.min(obj.x, obj.x2 ?? obj.x);
      const minY = Math.min(obj.y, obj.y2 ?? obj.y);
      const maxX = Math.max(obj.x, obj.x2 ?? obj.x);
      const maxY = Math.max(obj.y, obj.y2 ?? obj.y);
      const padding = (obj.strokeWidth || 2) + 4;
      return {
        x: minX - padding,
        y: minY - padding,
        width: Math.max(12, maxX - minX + padding * 2),
        height: Math.max(12, maxY - minY + padding * 2)
      };
    }

    case 'pencil':
    case 'highlighter': {
      if (!obj.points || obj.points.length === 0) {
        return { x: obj.x, y: obj.y, width: obj.width || 10, height: obj.height || 10 };
      }
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const pt of obj.points) {
        minX = Math.min(minX, pt.x);
        minY = Math.min(minY, pt.y);
        maxX = Math.max(maxX, pt.x);
        maxY = Math.max(maxY, pt.y);
      }
      const padding = (obj.strokeWidth || 4) + 4;
      return {
        x: minX - padding,
        y: minY - padding,
        width: Math.max(8, maxX - minX + padding * 2),
        height: Math.max(8, maxY - minY + padding * 2)
      };
    }

    default: {
      return {
        x: obj.x,
        y: obj.y,
        width: Math.max(1, obj.width || 20),
        height: Math.max(1, obj.height || 20)
      };
    }
  }
}

/**
 * Distance from point to line segment
 */
export function distToSegment(p, v, w) {
  const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
  if (l2 === 0) return distance(p, v);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = clamp(t, 0, 1);
  return distance(p, {
    x: v.x + t * (w.x - v.x),
    y: v.y + t * (w.y - v.y)
  });
}

/**
 * Hit test for any object given a point in world coordinates
 */
export function isPointInObject(p, obj, hitThreshold = 8) {
  if (!obj || obj.visible === false) return false;

  const center = {
    x: obj.x + (obj.width || 0) / 2,
    y: obj.y + (obj.height || 0) / 2
  };

  // If object is rotated, untranslate point to local coordinate space
  const localPoint = obj.rotation
    ? rotatePoint(p, center, -obj.rotation * DEG_TO_RAD)
    : p;

  switch (obj.type) {
    case 'rectangle':
    case 'rounded-rectangle':
    case 'sticky':
    case 'text':
    case 'image':
    case 'group': {
      return (
        localPoint.x >= obj.x - hitThreshold &&
        localPoint.x <= obj.x + obj.width + hitThreshold &&
        localPoint.y >= obj.y - hitThreshold &&
        localPoint.y <= obj.y + obj.height + hitThreshold
      );
    }

    case 'ellipse': {
      const rx = obj.width / 2;
      const ry = obj.height / 2;
      if (rx <= 0 || ry <= 0) return false;
      const dx = localPoint.x - center.x;
      const dy = localPoint.y - center.y;
      const val = (dx * dx) / ((rx + hitThreshold) * (rx + hitThreshold)) +
                  (dy * dy) / ((ry + hitThreshold) * (ry + hitThreshold));
      return val <= 1;
    }

    case 'diamond': {
      const rx = obj.width / 2;
      const ry = obj.height / 2;
      if (rx <= 0 || ry <= 0) return false;
      const dx = Math.abs(localPoint.x - center.x);
      const dy = Math.abs(localPoint.y - center.y);
      return (dx / (rx + hitThreshold) + dy / (ry + hitThreshold)) <= 1;
    }

    case 'line':
    case 'arrow':
    case 'connector': {
      const p1 = { x: obj.x, y: obj.y };
      const p2 = { x: obj.x2 ?? obj.x, y: obj.y2 ?? obj.y };
      const dist = distToSegment(p, p1, p2);
      return dist <= (obj.strokeWidth || 2) / 2 + hitThreshold;
    }

    case 'pencil':
    case 'highlighter': {
      if (!obj.points || obj.points.length < 2) {
        return distance(p, { x: obj.x, y: obj.y }) <= (obj.strokeWidth || 4) + hitThreshold;
      }
      const strokeDist = (obj.strokeWidth || 4) / 2 + hitThreshold;
      for (let i = 0; i < obj.points.length - 1; i++) {
        if (distToSegment(p, obj.points[i], obj.points[i + 1]) <= strokeDist) {
          return true;
        }
      }
      return false;
    }

    default: {
      const bounds = getObjectBounds(obj);
      return (
        p.x >= bounds.x - hitThreshold &&
        p.x <= bounds.x + bounds.width + hitThreshold &&
        p.y >= bounds.y - hitThreshold &&
        p.y <= bounds.y + bounds.height + hitThreshold
      );
    }
  }
}

/**
 * Returns connection anchor points on a shape (top, right, bottom, left, center)
 */
export function getShapeAnchors(obj) {
  if (!obj) return [];
  const bounds = getObjectBounds(obj);
  const cx = bounds.x + bounds.width / 2;
  const cy = bounds.y + bounds.height / 2;

  const anchors = [
    { id: 'top', x: cx, y: bounds.y, normal: { x: 0, y: -1 } },
    { id: 'right', x: bounds.x + bounds.width, y: cy, normal: { x: 1, y: 0 } },
    { id: 'bottom', x: cx, y: bounds.y + bounds.height, normal: { x: 0, y: 1 } },
    { id: 'left', x: bounds.x, y: cy, normal: { x: -1, y: 0 } },
    { id: 'center', x: cx, y: cy, normal: { x: 0, y: 0 } }
  ];

  if (obj.rotation) {
    const centerPt = { x: cx, y: cy };
    return anchors.map(a => {
      const rotated = rotatePoint(a, centerPt, obj.rotation * DEG_TO_RAD);
      return { ...a, x: rotated.x, y: rotated.y };
    });
  }

  return anchors;
}

/**
 * Find closest anchor point on an object to a target point
 */
export function getClosestAnchor(obj, targetPoint) {
  const anchors = getShapeAnchors(obj);
  let closest = anchors[0];
  let minD = Infinity;

  for (const anchor of anchors) {
    const d = distance(anchor, targetPoint);
    if (d < minD) {
      minD = d;
      closest = anchor;
    }
  }

  return { anchor: closest, distance: minD };
}

/**
 * Returns the 8 resize handle positions + rotation handle for a bounding box
 */
export function getSelectionHandles(bounds, rotation = 0, handleSize = 8) {
  const { x, y, width, height } = bounds;
  const cx = x + width / 2;
  const cy = y + height / 2;
  const center = { x: cx, y: cy };

  const rawHandles = [
    { id: 'nw', x: x, y: y, cursor: 'nwse-resize' },
    { id: 'n',  x: cx, y: y, cursor: 'ns-resize' },
    { id: 'ne', x: x + width, y: y, cursor: 'nesw-resize' },
    { id: 'e',  x: x + width, y: cy, cursor: 'ew-resize' },
    { id: 'se', x: x + width, y: y + height, cursor: 'nwse-resize' },
    { id: 's',  x: cx, y: y + height, cursor: 'ns-resize' },
    { id: 'sw', x: x, y: y + height, cursor: 'nesw-resize' },
    { id: 'w',  x: x, y: cy, cursor: 'ew-resize' },
    { id: 'rot', x: cx, y: y - 24, cursor: 'grab' } // Rotation handle stalk
  ];

  if (!rotation) return rawHandles;

  return rawHandles.map(h => {
    const rotPt = rotatePoint({ x: h.x, y: h.y }, center, rotation * DEG_TO_RAD);
    return {
      ...h,
      x: rotPt.x,
      y: rotPt.y
    };
  });
}

/**
 * Smooth Catmull-Rom spline calculation for freehand curves
 */
export function catmullRomSpline(ctx, points, tension = 0.5) {
  if (!points || points.length < 2) return;

  if (points.length === 2) {
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    return;
  }

  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension;
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension;
    const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension;
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
}
