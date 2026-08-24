/**
 * MediaStudio — Filter & Pixel Processing Engine
 * High-performance canvas pixel operations, convolution filters, and LUT adjustments.
 */

export class FilterEngine {
  /**
   * Apply non-destructive adjustments to an offscreen layer canvas
   */
  static applyAdjustments(sourceCanvas, adjustments = {}) {
    const {
      brightness = 0,
      contrast = 0,
      saturation = 0,
      exposure = 0,
      warmth = 0,
      blur = 0,
      sharpen = 0,
      vignette = 0,
      grayscale = 0,
      sepia = 0,
      invert = 0,
      hueRotate = 0
    } = adjustments;

    // Fast path: if no adjustments, return source directly or clone
    const isDefault =
      brightness === 0 && contrast === 0 && saturation === 0 && exposure === 0 &&
      warmth === 0 && blur === 0 && sharpen === 0 && vignette === 0 &&
      grayscale === 0 && sepia === 0 && invert === 0 && hueRotate === 0;

    const width = sourceCanvas.width;
    const height = sourceCanvas.height;

    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = width;
    outputCanvas.height = height;
    const ctx = outputCanvas.getContext('2d');

    if (isDefault || width === 0 || height === 0) {
      ctx.drawImage(sourceCanvas, 0, 0);
      return outputCanvas;
    }

    // Step 1: Apply CSS-based hardware filters (fast blur, hue-rotate, grayscale, sepia, invert)
    const cssFilterParts = [];
    if (blur > 0) cssFilterParts.push(`blur(${blur}px)`);
    if (hueRotate !== 0) cssFilterParts.push(`hue-rotate(${hueRotate}deg)`);
    if (grayscale > 0) cssFilterParts.push(`grayscale(${grayscale}%)`);
    if (sepia > 0) cssFilterParts.push(`sepia(${sepia}%)`);
    if (invert > 0) cssFilterParts.push(`invert(${invert}%)`);

    if (cssFilterParts.length > 0) {
      ctx.filter = cssFilterParts.join(' ');
    }
    ctx.drawImage(sourceCanvas, 0, 0);
    ctx.filter = 'none';

    // Step 2: Pixel-level LUT operations for Brightness, Contrast, Saturation, Exposure, Warmth
    const needsPixelProcessing =
      brightness !== 0 || contrast !== 0 || saturation !== 0 ||
      exposure !== 0 || warmth !== 0 || sharpen > 0 || vignette > 0;

    if (needsPixelProcessing) {
      let imageData = ctx.getImageData(0, 0, width, height);
      let data = imageData.data;

      // Precalculate Lookup Table (LUT) for combined Brightness, Contrast, Exposure
      // Brightness: -100 to 100 -> -255 to 255
      const bFactor = (brightness / 100) * 128;
      
      // Contrast: -100 to 100 -> factor
      const cVal = contrast / 100;
      const cFactor = (cVal < 0) ? (1 + cVal) : (1 + cVal * 2.5);

      // Exposure: -100 to 100 -> multiplier
      const expMultiplier = Math.pow(2, (exposure / 100) * 1.5);

      // Warmth (Temperature)
      const warmthVal = warmth / 100;
      const rWarmth = warmthVal > 0 ? (1 + warmthVal * 0.25) : 1;
      const bWarmth = warmthVal < 0 ? (1 - warmthVal * 0.25) : (1 - warmthVal * 0.2);

      // Saturation factor
      const satVal = saturation / 100;
      const satFactor = (satVal < 0) ? (1 + satVal) : (1 + satVal * 2.0);

      // Apply pixel adjustments
      const len = data.length;
      for (let i = 0; i < len; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        const a = data[i + 3];

        if (a === 0) continue;

        // Exposure
        if (exposure !== 0) {
          r *= expMultiplier;
          g *= expMultiplier;
          b *= expMultiplier;
        }

        // Brightness & Contrast: formula: ((color - 128) * cFactor + 128) + bFactor
        if (brightness !== 0 || contrast !== 0) {
          r = (r - 128) * cFactor + 128 + bFactor;
          g = (g - 128) * cFactor + 128 + bFactor;
          b = (b - 128) * cFactor + 128 + bFactor;
        }

        // Warmth / Temperature
        if (warmth !== 0) {
          r *= rWarmth;
          b *= bWarmth;
        }

        // Saturation (Rec.709 Luminance weights)
        if (saturation !== 0) {
          const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          r = lum + (r - lum) * satFactor;
          g = lum + (g - lum) * satFactor;
          b = lum + (b - lum) * satFactor;
        }

        // Clamp
        data[i] = r < 0 ? 0 : (r > 255 ? 255 : r);
        data[i + 1] = g < 0 ? 0 : (g > 255 ? 255 : g);
        data[i + 2] = b < 0 ? 0 : (b > 255 ? 255 : b);
      }

      // Sharpening via 3x3 Convolution Kernel
      if (sharpen > 0) {
        imageData = FilterEngine.applySharpen(imageData, width, height, sharpen / 100);
        data = imageData.data;
      }

      // Vignette effect
      if (vignette > 0) {
        FilterEngine.applyVignette(data, width, height, vignette / 100);
      }

      ctx.putImageData(imageData, 0, 0);
    }

    return outputCanvas;
  }

  /**
   * Apply 3x3 Sharpening convolution
   */
  static applySharpen(imageData, width, height, amount = 0.5) {
    const src = imageData.data;
    const output = new ImageData(width, height);
    const dst = output.data;

    // Kernel:
    //  0  -k   0
    // -k 1+4k -k
    //  0  -k   0
    const k = amount * 1.5;
    const center = 1 + 4 * k;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;

        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          dst[idx] = src[idx];
          dst[idx + 1] = src[idx + 1];
          dst[idx + 2] = src[idx + 2];
          dst[idx + 3] = src[idx + 3];
          continue;
        }

        const up = ((y - 1) * width + x) * 4;
        const down = ((y + 1) * width + x) * 4;
        const left = (y * width + (x - 1)) * 4;
        const right = (y * width + (x + 1)) * 4;

        for (let c = 0; c < 3; c++) {
          const val =
            src[idx + c] * center -
            (src[up + c] + src[down + c] + src[left + c] + src[right + c]) * k;
          dst[idx + c] = val < 0 ? 0 : (val > 255 ? 255 : val);
        }
        dst[idx + 3] = src[idx + 3];
      }
    }

    return output;
  }

  /**
   * Apply Vignette radial falloff
   */
  static applyVignette(data, width, height, strength = 0.5) {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
    const radius = maxDist * 0.75;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > radius) {
          const falloff = 1 - Math.min(1, ((dist - radius) / (maxDist - radius)) * strength);
          data[idx] = Math.round(data[idx] * falloff);
          data[idx + 1] = Math.round(data[idx + 1] * falloff);
          data[idx + 2] = Math.round(data[idx + 2] * falloff);
        }
      }
    }
  }

  /**
   * Sample pixel color at (x, y) on canvas
   */
  static getPixelColor(canvas, x, y) {
    const ctx = canvas.getContext('2d');
    const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    const a = (pixel[3] / 255).toFixed(2);
    const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
    return { r, g, b, a, hex };
  }
}
