/* ==========================================================================
   CANVASFLOW — Snapping & Smart Guides Engine
   Grid Snapping, Object-to-Object Alignment & Angle Snapping
   ========================================================================== */

import { getObjectBounds, DEG_TO_RAD, RAD_TO_DEG } from './math.js';

export class SnappingEngine {
  constructor(options = {}) {
    this.gridSize = options.gridSize || 20;
    this.snapThreshold = options.snapThreshold || 8; // in screen/world pixels
    this.snapToGridEnabled = true;
    this.snapToObjectsEnabled = true;
  }

  /**
   * Snap a single scalar value to nearest grid multiple
   */
  snapValueToGrid(val, gridSize = this.gridSize) {
    return Math.round(val / gridSize) * gridSize;
  }

  /**
   * Snap a point to grid
   */
  snapPointToGrid(p, gridSize = this.gridSize) {
    return {
      x: this.snapValueToGrid(p.x, gridSize),
      y: this.snapValueToGrid(p.y, gridSize)
    };
  }

  /**
   * Snap angle to increments (e.g. 15, 45, 90 degrees)
   */
  snapAngle(angleDeg, step = 15) {
    return Math.round(angleDeg / step) * step;
  }

  /**
   * Calculate alignment snaps and active guide lines between moving bounds and other objects
   * @param {Object} movingBounds - Current bounds of dragged/resized selection {x, y, width, height}
   * @param {Array} otherObjects - List of stationary objects on the canvas
   * @param {number} zoom - Current canvas zoom factor (to scale threshold)
   * @returns {Object} { snappedX, snappedY, deltaX, deltaY, guides: Array }
   */
  calculateObjectSnaps(movingBounds, otherObjects, zoom = 1) {
    const guides = [];
    const threshold = this.snapThreshold / zoom;

    let deltaX = 0;
    let deltaY = 0;
    let minDiffX = threshold + 1;
    let minDiffY = threshold + 1;

    const movingLeft = movingBounds.x;
    const movingCenterX = movingBounds.x + movingBounds.width / 2;
    const movingRight = movingBounds.x + movingBounds.width;

    const movingTop = movingBounds.y;
    const movingCenterY = movingBounds.y + movingBounds.height / 2;
    const movingBottom = movingBounds.y + movingBounds.height;

    // Collect all candidate alignment lines from stationary objects
    for (const obj of otherObjects) {
      if (!obj || obj.visible === false) continue;
      const b = getObjectBounds(obj);

      const targetLeft = b.x;
      const targetCenterX = b.x + b.width / 2;
      const targetRight = b.x + b.width;

      const targetTop = b.y;
      const targetCenterY = b.y + b.height / 2;
      const targetBottom = b.y + b.height;

      // --- Horizontal X Alignment Checks ---
      const xChecks = [
        { moving: movingLeft, target: targetLeft, offset: targetLeft - movingLeft },
        { moving: movingLeft, target: targetRight, offset: targetRight - movingLeft },
        { moving: movingCenterX, target: targetCenterX, offset: targetCenterX - movingCenterX },
        { moving: movingRight, target: targetLeft, offset: targetLeft - movingRight },
        { moving: movingRight, target: targetRight, offset: targetRight - movingRight }
      ];

      for (const check of xChecks) {
        const diff = Math.abs(check.offset);
        if (diff < threshold && diff < minDiffX) {
          minDiffX = diff;
          deltaX = check.offset;
        }
      }

      // --- Vertical Y Alignment Checks ---
      const yChecks = [
        { moving: movingTop, target: targetTop, offset: targetTop - movingTop },
        { moving: movingTop, target: targetBottom, offset: targetBottom - movingTop },
        { moving: movingCenterY, target: targetCenterY, offset: targetCenterY - movingCenterY },
        { moving: movingBottom, target: targetTop, offset: targetTop - movingBottom },
        { moving: movingBottom, target: targetBottom, offset: targetBottom - movingBottom }
      ];

      for (const check of yChecks) {
        const diff = Math.abs(check.offset);
        if (diff < threshold && diff < minDiffY) {
          minDiffY = diff;
          deltaY = check.offset;
        }
      }
    }

    // Build visual guide line coordinates if snaps were found
    const finalLeft = movingBounds.x + deltaX;
    const finalCenterX = finalLeft + movingBounds.width / 2;
    const finalRight = finalLeft + movingBounds.width;

    const finalTop = movingBounds.y + deltaY;
    const finalCenterY = finalTop + movingBounds.height / 2;
    const finalBottom = finalTop + movingBounds.height;

    if (deltaX !== 0 || minDiffX <= threshold) {
      for (const obj of otherObjects) {
        const b = getObjectBounds(obj);
        const tL = b.x;
        const tC = b.x + b.width / 2;
        const tR = b.x + b.width;

        const alignedX = [tL, tC, tR].find(x => 
          Math.abs(x - finalLeft) < 0.5 ||
          Math.abs(x - finalCenterX) < 0.5 ||
          Math.abs(x - finalRight) < 0.5
        );

        if (alignedX !== undefined) {
          const minY = Math.min(finalTop, b.y) - 20;
          const maxY = Math.max(finalBottom, b.y + b.height) + 20;
          guides.push({
            type: 'vertical',
            x: alignedX,
            y1: minY,
            y2: maxY
          });
        }
      }
    }

    if (deltaY !== 0 || minDiffY <= threshold) {
      for (const obj of otherObjects) {
        const b = getObjectBounds(obj);
        const tT = b.y;
        const tC = b.y + b.height / 2;
        const tB = b.y + b.height;

        const alignedY = [tT, tC, tB].find(y => 
          Math.abs(y - finalTop) < 0.5 ||
          Math.abs(y - finalCenterY) < 0.5 ||
          Math.abs(y - finalBottom) < 0.5
        );

        if (alignedY !== undefined) {
          const minX = Math.min(finalLeft, b.x) - 20;
          const maxX = Math.max(finalRight, b.x + b.width) + 20;
          guides.push({
            type: 'horizontal',
            y: alignedY,
            x1: minX,
            x2: maxX
          });
        }
      }
    }

    return {
      deltaX,
      deltaY,
      snappedX: movingBounds.x + deltaX,
      snappedY: movingBounds.y + deltaY,
      guides
    };
  }
}
