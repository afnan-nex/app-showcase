/**
 * PixelForge - Core Pixel Drawing & Image Math Algorithms
 * High-performance Bresenham lines, midpoint circles, flood fill, Bayer dithering,
 * pixel-perfect strokes, spatial transformations (flip/rotate/crop/scale), and color adjustments.
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

// --- 3. Midpoint Circle Algorithm ---
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

  // Circle outline using midpoint circle algorithm
  let x = r;
  let y = 0;
  let err = 1 - r;

  const added = new Set();
  const plot = (px, py) => {
    const key = `${px},${py}`;
    if (!added.has(key)) {
      added.add(key);
      points.push({ x: px, y: py });
    }
  };

  const plot8 = (px, py) => {
    plot(cx + px, cy + py);
    plot(cx - px, cy + py);
    plot(cx + px, cy - py);
    plot(cx - px, cy - py);
    plot(cx + py, cy + px);
    plot(cx - py, cy + px);
    plot(cx + py, cy - px);
    plot(cx - py, cy - px);
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
  const originalColor = pixels[startIndex] || 'transparent';

  if (originalColor.toLowerCase() === targetColor.toLowerCase()) return [];

  const modified = [];
  const queue = [[startX, startY]];
  const visited = new Uint8Array(width * height);
  visited[startIndex] = 1;

  const matchColor = (col) => {
    const c = col || 'transparent';
    return c.toLowerCase() === originalColor.toLowerCase();
  };

  while (queue.length > 0) {
    const [x, y] = queue.pop();
    const idx = y * width + x;

    modified.push({ x, y, color: targetColor });

    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!visited[nIdx] && matchColor(pixels[nIdx])) {
          visited[nIdx] = 1;
          queue.push([nx, ny]);
        }
      }
    }
  }

  return modified;
}

// --- 5. Bayer 4x4 Dithering ---
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

// --- 6. Pixel-Perfect Stroke Filter (removes redundant double corners) ---
export function filterPixelPerfect(strokePoints) {
  if (strokePoints.length < 3) return strokePoints;

  const result = [strokePoints[0]];

  for (let i = 1; i < strokePoints.length - 1; i++) {
    const prev = strokePoints[i - 1];
    const curr = strokePoints[i];
    const next = strokePoints[i + 1];

    const dx1 = curr.x - prev.x;
    const dy1 = curr.y - prev.y;
    const dx2 = next.x - curr.x;
    const dy2 = next.y - curr.y;

    const isCorner = (dx1 !== 0 && dy2 !== 0 && dx2 === 0 && dy1 === 0) ||
                     (dy1 !== 0 && dx2 !== 0 && dy1 === 0 && dx1 === 0);

    if (isCorner && Math.abs(next.x - prev.x) === 1 && Math.abs(next.y - prev.y) === 1) {
      continue; // Skip redundant corner pixel
    }

    result.push(curr);
  }

  result.push(strokePoints[strokePoints.length - 1]);
  return result;
}

// --- 7. Spatial Transformations (Flip / Rotate / Crop / Scale) ---

export function flipPixelsHorizontal(pixels, width, height, selection = null) {
  const next = [...pixels];
  const minX = selection ? Math.max(0, Math.min(selection.x0, selection.x1)) : 0;
  const maxX = selection ? Math.min(width - 1, Math.max(selection.x0, selection.x1)) : width - 1;
  const minY = selection ? Math.max(0, Math.min(selection.y0, selection.y1)) : 0;
  const maxY = selection ? Math.min(height - 1, Math.max(selection.y0, selection.y1)) : height - 1;

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= Math.floor((minX + maxX) / 2); x++) {
      const oppX = maxX - (x - minX);
      const idx1 = y * width + x;
      const idx2 = y * width + oppX;
      const temp = next[idx1];
      next[idx1] = next[idx2];
      next[idx2] = temp;
    }
  }
  return next;
}

export function flipPixelsVertical(pixels, width, height, selection = null) {
  const next = [...pixels];
  const minX = selection ? Math.max(0, Math.min(selection.x0, selection.x1)) : 0;
  const maxX = selection ? Math.min(width - 1, Math.max(selection.x0, selection.x1)) : width - 1;
  const minY = selection ? Math.max(0, Math.min(selection.y0, selection.y1)) : 0;
  const maxY = selection ? Math.min(height - 1, Math.max(selection.y0, selection.y1)) : height - 1;

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= Math.floor((minY + maxY) / 2); y++) {
      const oppY = maxY - (y - minY);
      const idx1 = y * width + x;
      const idx2 = oppY * width + x;
      const temp = next[idx1];
      next[idx1] = next[idx2];
      next[idx2] = temp;
    }
  }
  return next;
}

export function rotatePixels90CW(pixels, width, height) {
  // If square, rotate in place; if non-square, transpose
  const next = new Array(width * height).fill('transparent');
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const newX = height - 1 - y;
      const newY = x;
      if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
        next[newY * width + newX] = pixels[y * width + x];
      }
    }
  }
  return next;
}

export function resizePixelBuffer(pixels, oldW, oldH, newW, newH, anchor = 'center') {
  const result = new Array(newW * newH).fill('transparent');
  let offsetX = 0;
  let offsetY = 0;

  if (anchor === 'center') {
    offsetX = Math.floor((newW - oldW) / 2);
    offsetY = Math.floor((newH - oldH) / 2);
  } else if (anchor === 'top-left') {
    offsetX = 0;
    offsetY = 0;
  } else if (anchor === 'bottom-right') {
    offsetX = newW - oldW;
    offsetY = newH - oldH;
  }

  for (let y = 0; y < oldH; y++) {
    for (let x = 0; x < oldW; x++) {
      const targetX = x + offsetX;
      const targetY = y + offsetY;
      if (targetX >= 0 && targetX < newW && targetY >= 0 && targetY < newH) {
        result[targetY * newW + targetX] = pixels[y * oldW + x];
      }
    }
  }
  return result;
}

export function scalePixelBuffer(pixels, oldW, oldH, scaleFactor) {
  const newW = Math.round(oldW * scaleFactor);
  const newH = Math.round(oldH * scaleFactor);
  const result = new Array(newW * newH).fill('transparent');

  for (let ny = 0; ny < newH; ny++) {
    for (let nx = 0; nx < newW; nx++) {
      const srcX = Math.min(oldW - 1, Math.floor(nx / scaleFactor));
      const srcY = Math.min(oldH - 1, Math.floor(ny / scaleFactor));
      result[ny * newW + nx] = pixels[srcY * oldW + srcX];
    }
  }
  return { pixels: result, width: newW, height: newH };
}

// --- 8. Color Adjustments & Filters ---

export function replaceColorInPixels(pixels, fromColor, toColor, selection = null, width = 0, height = 0) {
  const next = [...pixels];
  const from = (fromColor || 'transparent').toLowerCase();
  const to = toColor || 'transparent';

  const minX = selection ? Math.max(0, Math.min(selection.x0, selection.x1)) : 0;
  const maxX = selection ? Math.min(width - 1, Math.max(selection.x0, selection.x1)) : width - 1;
  const minY = selection ? Math.max(0, Math.min(selection.y0, selection.y1)) : 0;
  const maxY = selection ? Math.min(height - 1, Math.max(selection.y0, selection.y1)) : height - 1;

  for (let y = minY; y <= (selection ? maxY : height - 1); y++) {
    for (let x = minX; x <= (selection ? maxX : width - 1); x++) {
      const idx = y * width + x;
      const cur = (next[idx] || 'transparent').toLowerCase();
      if (cur === from) {
        next[idx] = to;
      }
    }
  }
  return next;
}

export function adjustPixelsBrightnessContrast(pixels, brightness = 0, contrast = 0) {
  return pixels.map(col => {
    if (!col || col === 'transparent') return 'transparent';
    const rgb = hexToRgb(col);
    // Contrast factor
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    const r = Math.max(0, Math.min(255, factor * (rgb.r - 128) + 128 + brightness));
    const g = Math.max(0, Math.min(255, factor * (rgb.g - 128) + 128 + brightness));
    const b = Math.max(0, Math.min(255, factor * (rgb.b - 128) + 128 + brightness));
    return rgbToHex(r, g, b);
  });
}

export function invertPixels(pixels) {
  return pixels.map(col => {
    if (!col || col === 'transparent') return 'transparent';
    const rgb = hexToRgb(col);
    return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
  });
}

export function grayscalePixels(pixels) {
  return pixels.map(col => {
    if (!col || col === 'transparent') return 'transparent';
    const rgb = hexToRgb(col);
    const lum = Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
    return rgbToHex(lum, lum, lum);
  });
}

// --- 9. Color Helpers ---
export function hexToRgb(hex) {
  if (!hex || hex === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  if (isNaN(num)) return { r: 0, g: 0, b: 0, a: 1 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
    a: 1
  };
}

export function rgbToHex(r, g, b) {
  const clamp = (x) => Math.max(0, Math.min(255, Math.round(x)));
  return '#' + [r, g, b].map(x => {
    const hex = clamp(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

export function hsvToRgb(h, s, v) {
  h /= 360; s /= 100; v /= 100;
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
