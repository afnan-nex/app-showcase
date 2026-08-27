/**
 * PixelForge - Core Pixel Drawing Algorithms
 * High-performance Bresenham lines, midpoint circles, flood fill, Bayer dithering, and pixel-perfect strokes.
 */

// --- 1. Bresenham's Line Algorithm ---
export function getLinePixels(x0, y0, x1, y1) {
  const points = [];
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  let sx = x0 < x1 ? 1 : -1;
  let sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  let currX = x0;
  let currY = y0;

  while (true) {
    points.push({ x: currX, y: currY });
    if (currX === x1 && currY === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      currX += sx;
    }
    if (e2 < dx) {
      err += dx;
      currY += sy;
    }
  }

  return points;
}

// --- 2. Rectangle Algorithm ---
export function getRectPixels(x0, y0, x1, y1, filled = false) {
  const points = [];
  const minX = Math.min(x0, x1);
  const maxX = Math.max(x0, x1);
  const minY = Math.min(y0, y1);
  const maxY = Math.max(y0, y1);

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (filled || x === minX || x === maxX || y === minY || y === maxY) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

// --- 3. Midpoint Circle / Ellipse Algorithm ---
export function getCirclePixels(cx, cy, radius, filled = false) {
  const points = [];
  const r = Math.round(radius);
  if (r <= 0) return [{ x: cx, y: cy }];

  if (filled) {
    for (let y = -r; y <= r; y++) {
      for (let x = -r; x <= r; x++) {
        if (x * x + y * y <= r * r) {
          points.push({ x: cx + x, y: cy + y });
        }
      }
    }
    return points;
  }

  // Circle outline
  let x = r;
  let y = 0;
  let err = 1 - r;

  const plot8 = (px, py) => {
    points.push(
      { x: cx + px, y: cy + py },
      { x: cx - px, y: cy + py },
      { x: cx + px, y: cy - py },
      { x: cx - px, y: cy - py },
      { x: cx + py, y: cy + px },
      { x: cx - py, y: cy + px },
      { x: cx + py, y: cy - px },
      { x: cx - py, y: cy - px }
    );
  };

  while (x >= y) {
    plot8(x, y);
    y++;
    if (err <= 0) {
      err += 2 * y + 1;
    } else {
      x--;
      err += 2 * (y - x) + 1;
    }
  }

  return points;
}

// --- 4. Queue-Based 4-Way Flood Fill Algorithm ---
export function floodFill(pixels, width, height, startX, startY, targetColor) {
  if (startX < 0 || startX >= width || startY < 0 || startY >= height) return [];

  const startIndex = startY * width + startX;
  const originalColor = pixels[startIndex] || null;

  if (originalColor === targetColor) return [];

  const modified = [];
  const queue = [[startX, startY]];
  const visited = new Uint8Array(width * height);
  visited[startIndex] = 1;

  while (queue.length > 0) {
    const [x, y] = queue.pop();
    const idx = y * width + x;

    modified.push({ x, y, color: targetColor });

    // 4 neighbors (North, South, East, West)
    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!visited[nIdx] && (pixels[nIdx] || null) === originalColor) {
          visited[nIdx] = 1;
          queue.push([nx, ny]);
        }
      }
    }
  }

  return modified;
}

// --- 5. Bayer 2x2 / 4x4 Dithering ---
const BAYER_4X4 = [
  [ 0,  8,  2, 10],
  [12,  4, 14,  6],
  [ 3, 11,  1,  9],
  [15,  7, 13,  5]
];

export function getDitherColor(x, y, color1, color2, threshold = 8) {
  const bx = Math.abs(x) % 4;
  const by = Math.abs(y) % 4;
  return BAYER_4X4[by][bx] >= threshold ? color1 : color2;
}

// --- 6. Pixel-Perfect Stroke Filter (removes L-shaped double corners) ---
export function filterPixelPerfect(strokePoints) {
  if (strokePoints.length < 3) return strokePoints;

  const result = [strokePoints[0]];

  for (let i = 1; i < strokePoints.length - 1; i++) {
    const prev = strokePoints[i - 1];
    const curr = strokePoints[i];
    const next = strokePoints[i + 1];

    // Check if curr is an redundant corner in an L-shape
    const dx1 = curr.x - prev.x;
    const dy1 = curr.y - prev.y;
    const dx2 = next.x - curr.x;
    const dy2 = next.y - curr.y;

    const isCorner = (dx1 !== 0 && dy2 !== 0 && dx2 === 0 && dy1 === 0) ||
                     (dy1 !== 0 && dx2 !== 0 && dy1 === 0 && dx1 === 0);

    if (isCorner && Math.abs(next.x - prev.x) === 1 && Math.abs(next.y - prev.y) === 1) {
      continue; // Skip redundant pixel
    }

    result.push(curr);
  }

  result.push(strokePoints[strokePoints.length - 1]);
  return result;
}

// --- Color Helpers ---
export function hexToRgb(hex) {
  if (!hex) return { r: 0, g: 0, b: 0, a: 1 };
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
    a: 1
  };
}

export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export function hsvToRgb(h, s, v) {
  let r, g, b;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}
