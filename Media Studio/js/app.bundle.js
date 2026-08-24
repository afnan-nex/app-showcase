/**
 * MediaStudio — Production Standalone Bundle
 * Works seamlessly on file:/// (double click) and web servers (HTTP/HTTPS/GitHub Pages)
 */
(function () {
  'use strict';


/* --- MODULE: presets-data.js --- */
/**
 * MediaStudio — Presets, Templates, Sample Media & Default Configurations
 * Production-ready configurations with realistic design assets and templates.
 */

// Canvas Size Presets
const CANVAS_PRESETS = [
  { id: '1920x1080', name: 'Full HD Landscape (16:9)', width: 1920, height: 1080, category: 'Web & Video' },
  { id: '1280x720', name: 'HD / YouTube Thumbnail (16:9)', width: 1280, height: 720, category: 'Web & Video' },
  { id: '1080x1080', name: 'Instagram Square Post (1:1)', width: 1080, height: 1080, category: 'Social Media' },
  { id: '1080x1350', name: 'Instagram Portrait Post (4:5)', width: 1080, height: 1350, category: 'Social Media' },
  { id: '1080x1920', name: 'Instagram Story / TikTok / Reel (9:16)', width: 1080, height: 1920, category: 'Social Media' },
  { id: '1200x630', name: 'Facebook / OpenGraph Banner', width: 1200, height: 630, category: 'Social Media' },
  { id: '1500x500', name: 'Twitter / X Header', width: 1500, height: 500, category: 'Social Media' },
  { id: '800x800', name: 'Profile Avatar (1:1)', width: 800, height: 800, category: 'Social Media' },
  { id: '2560x1440', name: '2K QHD Display (16:9)', width: 2560, height: 1440, category: 'Display' },
  { id: '3840x2160', name: '4K UHD Display (16:9)', width: 3840, height: 2160, category: 'Display' },
  { id: '1200x1200', name: 'E-commerce Product Showcase (1:1)', width: 1200, height: 1200, category: 'Commercial' },
  { id: '800x600', name: 'Standard Web Asset (4:3)', width: 800, height: 600, category: 'Web' }
];

// Available Google & System Fonts
const AVAILABLE_FONTS = [
  { name: 'Inter', family: 'Inter', category: 'Sans-Serif' },
  { name: 'Montserrat', family: 'Montserrat', category: 'Sans-Serif' },
  { name: 'Oswald', family: 'Oswald', category: 'Condensed' },
  { name: 'Bebas Neue', family: 'Bebas Neue', category: 'Display' },
  { name: 'Playfair Display', family: 'Playfair Display', category: 'Serif' },
  { name: 'Cinzel', family: 'Cinzel', category: 'Serif' },
  { name: 'Pacifico', family: 'Pacifico', category: 'Handwriting' },
  { name: 'Satisfy', family: 'Satisfy', category: 'Handwriting' },
  { name: 'Caveat', family: 'Caveat', category: 'Handwriting' },
  { name: 'Permanent Marker', family: 'Permanent Marker', category: 'Display' },
  { name: 'Righteous', family: 'Righteous', category: 'Display' },
  { name: 'Fira Code', family: 'Fira Code', category: 'Monospace' },
  { name: 'Arial', family: 'Arial, sans-serif', category: 'System' },
  { name: 'Georgia', family: 'Georgia, serif', category: 'System' },
  { name: 'Impact', family: 'Impact, sans-serif', category: 'System' },
  { name: 'Courier New', family: '"Courier New", monospace', category: 'System' }
];

// Aesthetic 1-Click Filter Presets
const FILTER_PRESETS = [
  {
    id: 'original',
    name: 'Original',
    adjustments: { brightness: 0, contrast: 0, saturation: 0, exposure: 0, warmth: 0, blur: 0, sharpen: 0, vignette: 0, grayscale: 0, sepia: 0, invert: 0 },
    cssFilter: 'none'
  },
  {
    id: 'vivid',
    name: 'Vivid & Pop',
    adjustments: { brightness: 5, contrast: 25, saturation: 40, exposure: 5, warmth: 10, blur: 0, sharpen: 15, vignette: 10, grayscale: 0, sepia: 0, invert: 0 },
    cssFilter: 'saturate(1.4) contrast(1.25) brightness(1.05)'
  },
  {
    id: 'cinematic',
    name: 'Cinematic Teal',
    adjustments: { brightness: -5, contrast: 30, saturation: 15, exposure: 0, warmth: -20, blur: 0, sharpen: 20, vignette: 35, grayscale: 0, sepia: 0, invert: 0 },
    cssFilter: 'contrast(1.3) saturate(1.15) brightness(0.95) hue-rotate(-10deg)'
  },
  {
    id: 'retro_70s',
    name: 'Retro 70s Film',
    adjustments: { brightness: 8, contrast: -10, saturation: -15, exposure: 5, warmth: 35, blur: 0, sharpen: 0, vignette: 25, grayscale: 0, sepia: 25, invert: 0 },
    cssFilter: 'sepia(0.25) saturate(0.85) contrast(0.9) brightness(1.08)'
  },
  {
    id: 'noir_bw',
    name: 'Noir High Contrast',
    adjustments: { brightness: 0, contrast: 45, saturation: -100, exposure: 5, warmth: 0, blur: 0, sharpen: 25, vignette: 40, grayscale: 100, sepia: 0, invert: 0 },
    cssFilter: 'grayscale(1) contrast(1.45) brightness(1.05)'
  },
  {
    id: 'golden_hour',
    name: 'Golden Hour Sunlight',
    adjustments: { brightness: 10, contrast: 15, saturation: 25, exposure: 10, warmth: 50, blur: 0, sharpen: 10, vignette: 20, grayscale: 0, sepia: 10, invert: 0 },
    cssFilter: 'sepia(0.15) saturate(1.25) brightness(1.1) contrast(1.15)'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    adjustments: { brightness: 10, contrast: 40, saturation: 60, exposure: 10, warmth: -40, blur: 0, sharpen: 30, vignette: 30, grayscale: 0, sepia: 0, invert: 0 },
    cssFilter: 'contrast(1.4) saturate(1.6) hue-rotate(25deg) brightness(1.1)'
  },
  {
    id: 'matte_film',
    name: 'Matte Analog Film',
    adjustments: { brightness: 12, contrast: -15, saturation: -10, exposure: 0, warmth: 5, blur: 0, sharpen: 0, vignette: 15, grayscale: 0, sepia: 5, invert: 0 },
    cssFilter: 'contrast(0.85) brightness(1.12) saturate(0.9)'
  },
  {
    id: 'soft_pastel',
    name: 'Soft Editorial Pastel',
    adjustments: { brightness: 18, contrast: -20, saturation: 10, exposure: 15, warmth: 15, blur: 1, sharpen: 0, vignette: 0, grayscale: 0, sepia: 0, invert: 0 },
    cssFilter: 'brightness(1.18) contrast(0.8) saturate(1.1)'
  },
  {
    id: 'dramatic_hdr',
    name: 'Dramatic HDR Tone',
    adjustments: { brightness: 0, contrast: 50, saturation: 30, exposure: -5, warmth: 0, blur: 0, sharpen: 45, vignette: 30, grayscale: 0, sepia: 0, invert: 0 },
    cssFilter: 'contrast(1.5) saturate(1.3) brightness(0.98)'
  },
  {
    id: 'emerald_tint',
    name: 'Nordic Emerald',
    adjustments: { brightness: -5, contrast: 20, saturation: 25, exposure: 0, warmth: -15, blur: 0, sharpen: 15, vignette: 25, grayscale: 0, sepia: 0, invert: 0 },
    cssFilter: 'hue-rotate(50deg) contrast(1.2) saturate(1.25)'
  },
  {
    id: 'amber_glow',
    name: 'Warm Amber Glow',
    adjustments: { brightness: 10, contrast: 20, saturation: 35, exposure: 5, warmth: 45, blur: 0, sharpen: 10, vignette: 20, grayscale: 0, sepia: 20, invert: 0 },
    cssFilter: 'sepia(0.2) saturate(1.35) brightness(1.1) contrast(1.2)'
  }
];

// Sample Stock Images with metadata & reliable fallback generators
const SAMPLE_STOCK_MEDIA = [
  {
    id: 'sample-landscape',
    title: 'Alpine Lake Sunrise',
    category: 'Landscape',
    credit: 'Photo by Luca Bravo',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=60',
    fallbackGrad: ['#0f2027', '#203a43', '#2c5364']
  },
  {
    id: 'sample-cyber',
    title: 'Tokyo Neon Nightlife',
    category: 'Urban',
    credit: 'Photo by Aleksandr Popov',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=300&q=60',
    fallbackGrad: ['#8a2387', '#e94057', '#f27121']
  },
  {
    id: 'sample-portrait',
    title: 'Studio Editorial Portrait',
    category: 'Portrait',
    credit: 'Photo by Aiony Haust',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=60',
    fallbackGrad: ['#141e30', '#243b55', '#4b6cb7']
  },
  {
    id: 'sample-abstract',
    title: 'Vibrant Acrylic Fluidity',
    category: 'Abstract',
    credit: 'Photo by Pawel Czerwinski',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=300&q=60',
    fallbackGrad: ['#654ea3', '#eaafc8', '#8a2387']
  },
  {
    id: 'sample-architecture',
    title: 'Brutalist Concrete Pavilion',
    category: 'Architecture',
    credit: 'Photo by Simone Hutsch',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=60',
    fallbackGrad: ['#232526', '#414345', '#525252']
  },
  {
    id: 'sample-nature',
    title: 'Misty Redwood Forest',
    category: 'Nature',
    credit: 'Photo by Casey Horner',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=60',
    fallbackGrad: ['#134e5e', '#71b280', '#2d6a4f']
  },
  {
    id: 'sample-minimal',
    title: 'Monochrome Still Life',
    category: 'Minimal',
    credit: 'Photo by Joanna Kosinska',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=60',
    fallbackGrad: ['#0f0c29', '#302b63', '#24243e']
  },
  {
    id: 'sample-desert',
    title: 'Sahara Sand Dunes at Twilight',
    category: 'Landscape',
    credit: 'Photo by Jeremy Bishop',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80',
    thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=300&q=60',
    fallbackGrad: ['#f12711', '#f5af19']
  }
];

// Production Design Project Templates
const DESIGN_TEMPLATES = [
  {
    id: 'template-editorial',
    name: 'Editorial Magazine Cover',
    category: 'Print & Publication',
    width: 1080,
    height: 1350,
    backgroundColor: '#0c0d12',
    isTransparent: false,
    layers: [
      {
        type: 'shape',
        name: 'Background Card',
        shapeType: 'rectangle',
        x: 0,
        y: 0,
        width: 1080,
        height: 1350,
        fillType: 'linear-gradient',
        gradientConfig: { c1: '#181926', c2: '#0b0c10', angle: 180 },
        strokeWidth: 0,
        opacity: 1
      },
      {
        type: 'shape',
        name: 'Geometric Sun',
        shapeType: 'ellipse',
        x: 290,
        y: 280,
        width: 500,
        height: 500,
        fillType: 'linear-gradient',
        gradientConfig: { c1: '#f97316', c2: '#ec4899', angle: 45 },
        strokeWidth: 0,
        opacity: 0.85
      },
      {
        type: 'text',
        name: 'Magazine Masthead',
        text: 'HORIZON',
        fontFamily: 'Cinzel',
        fontSize: 96,
        fontWeight: '700',
        fillColor: '#ffffff',
        letterSpacing: 12,
        textAlign: 'center',
        x: 230,
        y: 80,
        shadow: { enabled: true, color: 'rgba(0,0,0,0.6)', blur: 20, offsetX: 0, offsetY: 8 }
      },
      {
        type: 'text',
        name: 'Issue Date Tag',
        text: 'VOL. 24 — ISSUE 08 — AUTUMN CURATION',
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: '600',
        fillColor: '#f97316',
        letterSpacing: 4,
        textAlign: 'center',
        x: 320,
        y: 200
      },
      {
        type: 'text',
        name: 'Feature Headline',
        text: 'THE ARCHITECTURE\nOF TOMORROW',
        fontFamily: 'Montserrat',
        fontSize: 54,
        fontWeight: '800',
        fillColor: '#ffffff',
        lineHeight: 1.15,
        letterSpacing: 2,
        textAlign: 'center',
        x: 230,
        y: 850
      },
      {
        type: 'text',
        name: 'Sub-article Callout',
        text: 'A visual exploration into sustainable urban aesthetics, computational design, and next-generation materials.',
        fontFamily: 'Inter',
        fontSize: 20,
        fontWeight: '300',
        fillColor: '#94a3b8',
        lineHeight: 1.4,
        textAlign: 'center',
        x: 200,
        y: 1040
      }
    ]
  },
  {
    id: 'template-youtube',
    name: 'Tech Video Thumbnail',
    category: 'YouTube & Social',
    width: 1280,
    height: 720,
    backgroundColor: '#090a0f',
    isTransparent: false,
    layers: [
      {
        type: 'shape',
        name: 'Dark Background',
        shapeType: 'rectangle',
        x: 0,
        y: 0,
        width: 1280,
        height: 720,
        fillType: 'linear-gradient',
        gradientConfig: { c1: '#090a0f', c2: '#1a1c2e', angle: 135 },
        strokeWidth: 0
      },
      {
        type: 'shape',
        name: 'Accent Pill Card',
        shapeType: 'rounded-rect',
        x: 60,
        y: 80,
        width: 680,
        height: 560,
        cornerRadius: 24,
        fillType: 'linear-gradient',
        gradientConfig: { c1: '#3b82f6', c2: '#8b5cf6', angle: 45 },
        opacity: 0.15,
        strokeColor: '#3b82f6',
        strokeWidth: 2
      },
      {
        type: 'text',
        name: 'Badge Text',
        text: 'DEEP DIVE 2026',
        fontFamily: 'Fira Code',
        fontSize: 22,
        fontWeight: '600',
        fillColor: '#38bdf8',
        letterSpacing: 3,
        x: 100,
        y: 130
      },
      {
        type: 'text',
        name: 'Main Title',
        text: 'BUILDING A\nBROWSER OS',
        fontFamily: 'Bebas Neue',
        fontSize: 108,
        fontWeight: '700',
        fillColor: '#ffffff',
        lineHeight: 0.95,
        letterSpacing: 2,
        x: 95,
        y: 190,
        shadow: { enabled: true, color: '#3b82f6', blur: 24, offsetX: 0, offsetY: 4 }
      },
      {
        type: 'shape',
        name: 'Tag Container',
        shapeType: 'rounded-rect',
        x: 100,
        y: 470,
        width: 320,
        height: 60,
        cornerRadius: 12,
        fillType: 'solid',
        fillColor: '#ef4444',
        strokeWidth: 0
      },
      {
        type: 'text',
        name: 'Tag Label',
        text: '100% VANILLA JS',
        fontFamily: 'Montserrat',
        fontSize: 24,
        fontWeight: '800',
        fillColor: '#ffffff',
        letterSpacing: 2,
        x: 140,
        y: 485
      },
      {
        type: 'shape',
        name: 'Right Decorative Orb',
        shapeType: 'ellipse',
        x: 820,
        y: 160,
        width: 400,
        height: 400,
        fillType: 'radial-gradient',
        gradientConfig: { c1: '#38bdf8', c2: '#6366f1', angle: 0 },
        opacity: 0.8
      }
    ]
  },
  {
    id: 'template-podcast',
    name: 'Podcast Cover Artwork',
    category: 'Audio & Music',
    width: 1200,
    height: 1200,
    backgroundColor: '#0f172a',
    isTransparent: false,
    layers: [
      {
        type: 'shape',
        name: 'Dark Texture Base',
        shapeType: 'rectangle',
        x: 0,
        y: 0,
        width: 1200,
        height: 1200,
        fillType: 'linear-gradient',
        gradientConfig: { c1: '#0f172a', c2: '#020617', angle: 180 },
        strokeWidth: 0
      },
      {
        type: 'shape',
        name: 'Abstract Wave Ring',
        shapeType: 'ellipse',
        x: 200,
        y: 200,
        width: 800,
        height: 800,
        fillType: 'none',
        strokeColor: '#38bdf8',
        strokeWidth: 16,
        strokeStyle: 'dashed',
        opacity: 0.5
      },
      {
        type: 'shape',
        name: 'Center Core',
        shapeType: 'ellipse',
        x: 400,
        y: 400,
        width: 400,
        height: 400,
        fillType: 'linear-gradient',
        gradientConfig: { c1: '#6366f1', c2: '#a855f7', angle: 45 },
        strokeWidth: 0
      },
      {
        type: 'text',
        name: 'Show Title',
        text: 'FUTURE\nSPECTRUM',
        fontFamily: 'Montserrat',
        fontSize: 88,
        fontWeight: '800',
        fillColor: '#ffffff',
        lineHeight: 1.05,
        letterSpacing: 4,
        textAlign: 'center',
        x: 350,
        y: 480,
        shadow: { enabled: true, color: 'rgba(0,0,0,0.8)', blur: 24, offsetX: 0, offsetY: 6 }
      },
      {
        type: 'text',
        name: 'Host Tag',
        text: 'HOSTED BY ALEXA CHEN & MARCUS VANCE',
        fontFamily: 'Inter',
        fontSize: 20,
        fontWeight: '600',
        fillColor: '#94a3b8',
        letterSpacing: 4,
        textAlign: 'center',
        x: 280,
        y: 1060
      }
    ]
  }
];

/**
 * Generate a high-resolution procedural gradient canvas fallback if offline
 */
function createProceduralGradientDataUrl(width = 1280, height = 720, colors = ['#3b82f6', '#8b5cf6', '#ec4899']) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  const grad = ctx.createLinearGradient(0, 0, width, height);
  colors.forEach((col, idx) => {
    grad.addColorStop(idx / (colors.length - 1), col);
  });
  
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Add subtle geometric artwork
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.arc(width * 0.75, height * 0.3, width * 0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(width * 0.2, height * 0.8, width * 0.35, 0, Math.PI * 2);
  ctx.fill();

  return canvas.toDataURL('image/jpeg', 0.9);
}


/* --- MODULE: filter-engine.js --- */
/**
 * MediaStudio — Filter & Pixel Processing Engine
 * High-performance canvas pixel operations, convolution filters, and LUT adjustments.
 */
class FilterEngine {
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


/* --- MODULE: layer-engine.js --- */
/**
 * MediaStudio — Layer Engine
 * Core object model for Image, Text, Shape, and Freehand Drawing layers.
 */


/**
 * Base Layer class
 */
class Layer {
  constructor(options = {}) {
    this.id = options.id || 'layer_' + Math.random().toString(36).substr(2, 9);
    this.name = options.name || 'Layer';
    this.type = options.type || 'base';

    // Position & Transform
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.width = options.width || 100;
    this.height = options.height || 100;
    this.rotation = options.rotation || 0; // in degrees
    this.flipH = options.flipH || false;
    this.flipV = options.flipV || false;

    // Blending & State
    this.opacity = options.opacity !== undefined ? options.opacity : 1.0;
    this.blendMode = options.blendMode || 'normal';
    this.visible = options.visible !== undefined ? options.visible : true;
    this.locked = options.locked !== undefined ? options.locked : false;

    this.isDirty = true;
  }

  /**
   * Get 4 corners in canvas coordinate space taking rotation & position into account
   */
  getCorners() {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    const rad = (this.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const hw = this.width / 2;
    const hh = this.height / 2;

    const localCorners = [
      { x: -hw, y: -hh }, // Top-Left
      { x: hw, y: -hh },  // Top-Right
      { x: hw, y: hh },   // Bottom-Right
      { x: -hw, y: hh }   // Bottom-Left
    ];

    return localCorners.map(pt => ({
      x: cx + (pt.x * cos - pt.y * sin),
      y: cy + (pt.x * sin + pt.y * cos)
    }));
  }

  /**
   * Get axis-aligned bounding box encompassing rotated layer
   */
  getAxisAlignedBounds() {
    const corners = this.getCorners();
    const xs = corners.map(c => c.x);
    const ys = corners.map(c => c.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /**
   * Transform a point from world (canvas) space to layer local space
   */
  worldToLocal(px, py) {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    const rad = (-this.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const dx = px - cx;
    const dy = py - cy;

    return {
      x: dx * cos - dy * sin + this.width / 2,
      y: dx * sin + dy * cos + this.height / 2
    };
  }

  /**
   * Point-in-polygon hit test
   */
  containsPoint(px, py) {
    if (!this.visible) return false;
    const local = this.worldToLocal(px, py);
    return local.x >= 0 && local.x <= this.width && local.y >= 0 && local.y <= this.height;
  }

  /**
   * Pre-render transform setup
   */
  applyTransform(ctx) {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    ctx.save();
    ctx.translate(cx, cy);

    if (this.rotation !== 0) {
      ctx.rotate((this.rotation * Math.PI) / 180);
    }

    const scaleX = this.flipH ? -1 : 1;
    const scaleY = this.flipV ? -1 : 1;
    if (scaleX !== 1 || scaleY !== 1) {
      ctx.scale(scaleX, scaleY);
    }

    ctx.globalAlpha = this.opacity;
    ctx.globalCompositeOperation = this.blendMode;
  }

  restoreTransform(ctx) {
    ctx.restore();
  }

  render(ctx) {
    // Override in subclass
  }

  async getThumbnail(targetWidth = 64, targetHeight = 48) {
    const thumbCanvas = document.createElement('canvas');
    thumbCanvas.width = targetWidth;
    thumbCanvas.height = targetHeight;
    const tCtx = thumbCanvas.getContext('2d');

    // Scale layer content to fit thumbnail
    const scale = Math.min(targetWidth / Math.max(1, this.width), targetHeight / Math.max(1, this.height));
    const tx = (targetWidth - this.width * scale) / 2;
    const ty = (targetHeight - this.height * scale) / 2;

    tCtx.save();
    tCtx.translate(tx, ty);
    tCtx.scale(scale, scale);
    this.drawContent(tCtx);
    tCtx.restore();

    return thumbCanvas.toDataURL('image/png');
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      rotation: this.rotation,
      flipH: this.flipH,
      flipV: this.flipV,
      opacity: this.opacity,
      blendMode: this.blendMode,
      visible: this.visible,
      locked: this.locked
    };
  }
}

/**
 * Image Layer
 */
class ImageLayer extends Layer {
  constructor(options = {}) {
    super({ ...options, type: 'image' });
    this.image = options.image || null;
    this.src = options.src || '';
    this.naturalWidth = options.naturalWidth || (this.image ? this.image.naturalWidth || this.image.width : this.width);
    this.naturalHeight = options.naturalHeight || (this.image ? this.image.naturalHeight || this.image.height : this.height);

    // Adjustments
    this.adjustments = {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      exposure: 0,
      warmth: 0,
      blur: 0,
      sharpen: 0,
      vignette: 0,
      grayscale: 0,
      sepia: 0,
      invert: 0,
      hueRotate: 0,
      ...(options.adjustments || {})
    };

    this.activeFilterPreset = options.activeFilterPreset || 'original';
    this.cachedProcessedCanvas = null;

    if (this.image) {
      this.updateCache();
    }
  }

  updateCache() {
    if (!this.image) return;

    // Create raw offscreen canvas for image source
    const rawCanvas = document.createElement('canvas');
    rawCanvas.width = this.naturalWidth || this.image.width || 100;
    rawCanvas.height = this.naturalHeight || this.image.height || 100;
    const rawCtx = rawCanvas.getContext('2d');
    rawCtx.drawImage(this.image, 0, 0, rawCanvas.width, rawCanvas.height);

    // Apply adjustments through filter engine
    this.cachedProcessedCanvas = FilterEngine.applyAdjustments(rawCanvas, this.adjustments);
    this.isDirty = false;
  }

  drawContent(ctx) {
    if (!this.cachedProcessedCanvas && this.image) {
      this.updateCache();
    }

    if (this.cachedProcessedCanvas) {
      ctx.drawImage(
        this.cachedProcessedCanvas,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    }
  }

  render(ctx) {
    if (!this.visible) return;
    this.applyTransform(ctx);
    this.drawContent(ctx);
    this.restoreTransform(ctx);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      src: this.src || (this.cachedProcessedCanvas ? this.cachedProcessedCanvas.toDataURL('image/png') : ''),
      naturalWidth: this.naturalWidth,
      naturalHeight: this.naturalHeight,
      adjustments: { ...this.adjustments },
      activeFilterPreset: this.activeFilterPreset
    };
  }

  static async fromJSON(data) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = data.src;
    });

    return new ImageLayer({
      ...data,
      image: img
    });
  }
}

/**
 * Text Layer
 */
class TextLayer extends Layer {
  constructor(options = {}) {
    super({ ...options, type: 'text' });
    this.text = options.text || 'Double click to edit text';
    this.fontFamily = options.fontFamily || 'Inter';
    this.fontSize = options.fontSize || 48;
    this.fontWeight = options.fontWeight || '400';
    this.fontStyle = options.fontStyle || 'normal';
    this.textAlign = options.textAlign || 'left';
    this.lineHeight = options.lineHeight || 1.2;
    this.letterSpacing = options.letterSpacing || 0;

    // Styling
    this.fillColor = options.fillColor || '#ffffff';
    this.strokeColor = options.strokeColor || '#000000';
    this.strokeWidth = options.strokeWidth || 0;

    // Drop shadow
    this.shadow = {
      enabled: false,
      color: '#000000',
      blur: 8,
      offsetX: 0,
      offsetY: 4,
      ...(options.shadow || {})
    };

    this.recalculateDimensions();
  }

  recalculateDimensions() {
    const helperCanvas = document.createElement('canvas');
    const ctx = helperCanvas.getContext('2d');
    ctx.font = `${this.fontStyle} ${this.fontWeight} ${this.fontSize}px "${this.fontFamily}", sans-serif`;

    const lines = this.text.split('\n');
    let maxLineWidth = 0;

    for (const line of lines) {
      const metrics = ctx.measureText(line);
      const textWidth = metrics.width + (line.length - 1) * this.letterSpacing;
      if (textWidth > maxLineWidth) maxLineWidth = textWidth;
    }

    const lineH = this.fontSize * this.lineHeight;
    const totalHeight = lines.length * lineH;

    this.width = Math.max(30, Math.ceil(maxLineWidth + 20));
    this.height = Math.max(20, Math.ceil(totalHeight + 10));
  }

  drawContent(ctx) {
    ctx.font = `${this.fontStyle} ${this.fontWeight} ${this.fontSize}px "${this.fontFamily}", sans-serif`;
    ctx.textBaseline = 'top';

    const lines = this.text.split('\n');
    const lineH = this.fontSize * this.lineHeight;
    const startY = -this.height / 2 + 5;

    // Setup Shadow
    if (this.shadow.enabled) {
      ctx.shadowColor = this.shadow.color;
      ctx.shadowBlur = this.shadow.blur;
      ctx.shadowOffsetX = this.shadow.offsetX;
      ctx.shadowOffsetY = this.shadow.offsetY;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }

    lines.forEach((line, index) => {
      let startX = -this.width / 2 + 10;
      const lineWidth = ctx.measureText(line).width + (line.length - 1) * this.letterSpacing;

      if (this.textAlign === 'center') {
        startX = -lineWidth / 2;
      } else if (this.textAlign === 'right') {
        startX = this.width / 2 - lineWidth - 10;
      }

      const y = startY + index * lineH;

      // Draw Stroke if configured
      if (this.strokeWidth > 0) {
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.strokeWidth;
        ctx.lineJoin = 'round';
        this._renderTextWithSpacing(ctx, line, startX, y, true);
      }

      // Draw Fill
      ctx.fillStyle = this.fillColor;
      this._renderTextWithSpacing(ctx, line, startX, y, false);
    });
  }

  _renderTextWithSpacing(ctx, line, startX, y, isStroke) {
    if (this.letterSpacing === 0) {
      if (isStroke) ctx.strokeText(line, startX, y);
      else ctx.fillText(line, startX, y);
      return;
    }

    let currentX = startX;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (isStroke) ctx.strokeText(char, currentX, y);
      else ctx.fillText(char, currentX, y);
      currentX += ctx.measureText(char).width + this.letterSpacing;
    }
  }

  render(ctx) {
    if (!this.visible) return;
    this.applyTransform(ctx);
    this.drawContent(ctx);
    this.restoreTransform(ctx);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      text: this.text,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontWeight: this.fontWeight,
      fontStyle: this.fontStyle,
      textAlign: this.textAlign,
      lineHeight: this.lineHeight,
      letterSpacing: this.letterSpacing,
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      shadow: { ...this.shadow }
    };
  }

  static fromJSON(data) {
    return new TextLayer(data);
  }
}

/**
 * Vector Shape Layer
 */
class ShapeLayer extends Layer {
  constructor(options = {}) {
    super({ ...options, type: 'shape' });
    this.shapeType = options.shapeType || 'rectangle'; // rectangle, rounded-rect, ellipse, star, polygon, line, arrow, heart, bubble
    this.fillType = options.fillType || 'solid'; // solid, linear-gradient, radial-gradient, none
    this.fillColor = options.fillColor || '#3b82f6';
    
    // Gradient settings
    this.gradientConfig = {
      c1: '#3b82f6',
      c2: '#8b5cf6',
      angle: 45,
      ...(options.gradientConfig || {})
    };

    // Stroke
    this.strokeColor = options.strokeColor || '#ffffff';
    this.strokeWidth = options.strokeWidth !== undefined ? options.strokeWidth : 0;
    this.strokeStyle = options.strokeStyle || 'solid'; // solid, dashed, dotted

    // Shape attributes
    this.cornerRadius = options.cornerRadius !== undefined ? options.cornerRadius : (this.shapeType === 'rounded-rect' ? 16 : 0);
    this.polygonSides = options.polygonSides || 5;
    this.starPoints = options.starPoints || 5;
  }

  getFillStyle(ctx) {
    if (this.fillType === 'none') return 'transparent';
    if (this.fillType === 'solid') return this.fillColor;

    const hw = this.width / 2;
    const hh = this.height / 2;

    if (this.fillType === 'linear-gradient') {
      const rad = (this.gradientConfig.angle * Math.PI) / 180;
      const x1 = -hw * Math.cos(rad);
      const y1 = -hh * Math.sin(rad);
      const x2 = hw * Math.cos(rad);
      const y2 = hh * Math.sin(rad);

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, this.gradientConfig.c1);
      grad.addColorStop(1, this.gradientConfig.c2);
      return grad;
    }

    if (this.fillType === 'radial-gradient') {
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(hw, hh));
      grad.addColorStop(0, this.gradientConfig.c1);
      grad.addColorStop(1, this.gradientConfig.c2);
      return grad;
    }

    return this.fillColor;
  }

  drawContent(ctx) {
    const hw = this.width / 2;
    const hh = this.height / 2;

    ctx.fillStyle = this.getFillStyle(ctx);
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = this.strokeWidth;

    if (this.strokeStyle === 'dashed') {
      ctx.setLineDash([8, 6]);
    } else if (this.strokeStyle === 'dotted') {
      ctx.setLineDash([2, 4]);
    } else {
      ctx.setLineDash([]);
    }

    ctx.beginPath();

    switch (this.shapeType) {
      case 'rectangle':
      case 'rounded-rect':
        if (this.cornerRadius > 0) {
          const r = Math.min(this.cornerRadius, hw, hh);
          ctx.roundRect(-hw, -hh, this.width, this.height, r);
        } else {
          ctx.rect(-hw, -hh, this.width, this.height);
        }
        break;

      case 'ellipse':
        ctx.ellipse(0, 0, hw, hh, 0, 0, Math.PI * 2);
        break;

      case 'star':
        this._drawStarPath(ctx, hw, hh, this.starPoints);
        break;

      case 'polygon':
        this._drawPolygonPath(ctx, hw, hh, this.polygonSides);
        break;

      case 'line':
        ctx.moveTo(-hw, hh);
        ctx.lineTo(hw, -hh);
        break;

      case 'arrow':
        this._drawArrowPath(ctx, hw, hh);
        break;

      case 'heart':
        this._drawHeartPath(ctx, hw, hh);
        break;

      case 'bubble':
        this._drawBubblePath(ctx, hw, hh);
        break;

      default:
        ctx.rect(-hw, -hh, this.width, this.height);
        break;
    }

    if (this.fillType !== 'none' && this.shapeType !== 'line') {
      ctx.fill();
    }

    if (this.strokeWidth > 0) {
      ctx.stroke();
    }
  }

  _drawStarPath(ctx, hw, hh, points = 5) {
    const innerRadius = Math.min(hw, hh) * 0.45;
    const outerRadius = Math.min(hw, hh);
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / points;

    ctx.moveTo(0, -outerRadius);
    for (let i = 0; i < points; i++) {
      let x = Math.cos(rot) * outerRadius;
      let y = Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = Math.cos(rot) * innerRadius;
      y = Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.closePath();
  }

  _drawPolygonPath(ctx, hw, hh, sides = 5) {
    const radius = Math.min(hw, hh);
    const angleStep = (Math.PI * 2) / sides;
    const startAngle = -Math.PI / 2;

    ctx.moveTo(radius * Math.cos(startAngle), radius * Math.sin(startAngle));
    for (let i = 1; i < sides; i++) {
      const angle = startAngle + i * angleStep;
      ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
    }
    ctx.closePath();
  }

  _drawArrowPath(ctx, hw, hh) {
    const headSize = Math.min(24, hw * 0.5);
    ctx.moveTo(-hw, 0);
    ctx.lineTo(hw, 0);
    ctx.lineTo(hw - headSize, -headSize * 0.6);
    ctx.moveTo(hw, 0);
    ctx.lineTo(hw - headSize, headSize * 0.6);
  }

  _drawHeartPath(ctx, hw, hh) {
    const topCurveHeight = hh * 0.3;
    ctx.moveTo(0, hh * 0.8);
    // Left curve
    ctx.bezierCurveTo(-hw * 1.1, 0, -hw * 0.9, -hh * 0.9, 0, -topCurveHeight);
    // Right curve
    ctx.bezierCurveTo(hw * 0.9, -hh * 0.9, hw * 1.1, 0, 0, hh * 0.8);
    ctx.closePath();
  }

  _drawBubblePath(ctx, hw, hh) {
    const r = Math.min(12, hw * 0.2);
    const bodyH = hh * 0.75;
    ctx.roundRect(-hw, -hh, this.width, bodyH * 2, r);
    // Tail
    ctx.moveTo(-hw * 0.4, bodyH);
    ctx.lineTo(-hw * 0.6, hh);
    ctx.lineTo(-hw * 0.1, bodyH);
  }

  render(ctx) {
    if (!this.visible) return;
    this.applyTransform(ctx);
    this.drawContent(ctx);
    this.restoreTransform(ctx);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      shapeType: this.shapeType,
      fillType: this.fillType,
      fillColor: this.fillColor,
      gradientConfig: { ...this.gradientConfig },
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      strokeStyle: this.strokeStyle,
      cornerRadius: this.cornerRadius,
      polygonSides: this.polygonSides,
      starPoints: this.starPoints
    };
  }

  static fromJSON(data) {
    return new ShapeLayer(data);
  }
}

/**
 * Freehand Drawing Layer
 */
class DrawingLayer extends Layer {
  constructor(options = {}) {
    super({ ...options, type: 'drawing' });
    this.strokes = options.strokes || [];
    this.drawingCanvas = null;
    this.initCanvas();
  }

  initCanvas() {
    this.drawingCanvas = document.createElement('canvas');
    this.drawingCanvas.width = Math.max(10, this.width);
    this.drawingCanvas.height = Math.max(10, this.height);
    this.redrawAllStrokes();
  }

  addStroke(stroke) {
    this.strokes.push(stroke);
    this.drawSingleStroke(this.drawingCanvas.getContext('2d'), stroke);
  }

  clear() {
    this.strokes = [];
    if (this.drawingCanvas) {
      const ctx = this.drawingCanvas.getContext('2d');
      ctx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
    }
  }

  redrawAllStrokes() {
    if (!this.drawingCanvas) return;
    const ctx = this.drawingCanvas.getContext('2d');
    ctx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);

    for (const stroke of this.strokes) {
      this.drawSingleStroke(ctx, stroke);
    }
  }

  drawSingleStroke(ctx, stroke) {
    const pts = stroke.points;
    if (!pts || pts.length < 1) return;

    ctx.save();
    if (stroke.isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = stroke.color;
      ctx.fillStyle = stroke.color;
    }

    ctx.globalAlpha = stroke.opacity !== undefined ? stroke.opacity : 1.0;
    ctx.lineWidth = stroke.size || 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (pts.length === 1) {
      ctx.beginPath();
      ctx.arc(pts[0].x, pts[0].y, (stroke.size || 12) / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);

      for (let i = 1; i < pts.length - 1; i++) {
        const xc = (pts[i].x + pts[i + 1].x) / 2;
        const yc = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
      }

      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawContent(ctx) {
    if (this.drawingCanvas) {
      ctx.drawImage(
        this.drawingCanvas,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    }
  }

  render(ctx) {
    if (!this.visible) return;
    this.applyTransform(ctx);
    this.drawContent(ctx);
    this.restoreTransform(ctx);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      strokes: JSON.parse(JSON.stringify(this.strokes))
    };
  }

  static fromJSON(data) {
    const layer = new DrawingLayer(data);
    return layer;
  }
}


/* --- MODULE: history-engine.js --- */
/**
 * MediaStudio — History & Undo/Redo Engine
 */
class HistoryEngine {
  constructor(maxStates = 40) {
    this.maxStates = maxStates;
    this.stack = [];
    this.currentIndex = -1;
    this.listeners = [];
    this.isApplyingHistory = false;
  }

  /**
   * Register a state change listener
   */
  subscribe(callback) {
    this.listeners.push(callback);
  }

  notify() {
    for (const cb of this.listeners) {
      cb({
        canUndo: this.canUndo(),
        canRedo: this.canRedo(),
        stack: this.stack,
        currentIndex: this.currentIndex
      });
    }
  }

  /**
   * Push a new state onto the history stack
   */
  pushState(stateData, actionName = 'Action') {
    if (this.isApplyingHistory) return;

    // If we were in the middle of the stack, drop subsequent redo states
    if (this.currentIndex < this.stack.length - 1) {
      this.stack = this.stack.slice(0, this.currentIndex + 1);
    }

    // Clone state deeply
    const snapshot = {
      actionName,
      timestamp: Date.now(),
      data: JSON.parse(JSON.stringify(stateData))
    };

    this.stack.push(snapshot);

    // Limit stack size
    if (this.stack.length > this.maxStates) {
      this.stack.shift();
    } else {
      this.currentIndex++;
    }

    this.notify();
  }

  canUndo() {
    return this.currentIndex > 0;
  }

  canRedo() {
    return this.currentIndex < this.stack.length - 1;
  }

  /**
   * Undo to previous state
   */
  undo() {
    if (!this.canUndo()) return null;
    this.currentIndex--;
    this.notify();
    return this.getCurrentState();
  }

  /**
   * Redo to next state
   */
  redo() {
    if (!this.canRedo()) return null;
    this.currentIndex++;
    this.notify();
    return this.getCurrentState();
  }

  /**
   * Jump directly to a step in history
   */
  jumpTo(index) {
    if (index >= 0 && index < this.stack.length && index !== this.currentIndex) {
      this.currentIndex = index;
      this.notify();
      return this.getCurrentState();
    }
    return null;
  }

  getCurrentState() {
    if (this.currentIndex >= 0 && this.currentIndex < this.stack.length) {
      return this.stack[this.currentIndex].data;
    }
    return null;
  }

  clear() {
    this.stack = [];
    this.currentIndex = -1;
    this.notify();
  }
}


/* --- MODULE: storage-engine.js --- */
/**
 * MediaStudio — IndexedDB Storage Engine & Project File Serialization
 */

const DB_NAME = 'MediaStudio_DB';
const DB_VERSION = 1;
const STORE_NAME = 'projects';

class StorageEngine {
  constructor() {
    this.db = null;
    this.initPromise = this._initDb();
    this.currentProjectId = 'proj_' + Date.now();
    this.autoSaveTimer = null;
  }

  async _initDb() {
    if (typeof indexedDB === 'undefined') {
      return null;
    }
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
          store.createIndex('name', 'name', { unique: false });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      request.onerror = (e) => {
        console.warn('IndexedDB failed to open, falling back to in-memory/localStorage:', e);
        resolve(null);
      };
    });
  }

  /**
   * Save or update project in IndexedDB
   */
  async saveProject(projectData) {
    await this.initPromise;
    if (!this.db) {
      // Fallback
      try {
        localStorage.setItem(`mediastudio_${projectData.id}`, JSON.stringify(projectData));
      } catch (err) {
        console.warn('LocalStorage save failed:', err);
      }
      return projectData.id;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const record = {
          ...projectData,
          id: projectData.id || this.currentProjectId,
          updatedAt: Date.now(),
          createdAt: projectData.createdAt || Date.now()
        };
        const req = store.put(record);

        req.onsuccess = () => resolve(record.id);
        req.onerror = (e) => reject(e);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Retrieve project by ID
   */
  async getProject(id) {
    await this.initPromise;
    if (!this.db) {
      const item = localStorage.getItem(`mediastudio_${id}`);
      return item ? JSON.parse(item) : null;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction([STORE_NAME], 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);

        req.onsuccess = () => resolve(req.result || null);
        req.onerror = (e) => reject(e);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * List all saved projects ordered by updated date descending
   */
  async listProjects() {
    await this.initPromise;
    if (!this.db) {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('mediastudio_'));
      return keys.map(k => JSON.parse(localStorage.getItem(k)));
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction([STORE_NAME], 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();

        req.onsuccess = () => {
          const list = req.result || [];
          list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
          resolve(list);
        };
        req.onerror = (e) => reject(e);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Delete a project by ID
   */
  async deleteProject(id) {
    await this.initPromise;
    if (!this.db) {
      localStorage.removeItem(`mediastudio_${id}`);
      return true;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);

        req.onsuccess = () => resolve(true);
        req.onerror = (e) => reject(e);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Export full project data as a downloadable `.mediastudio` JSON file
   */
  exportProjectFile(projectData) {
    const jsonStr = JSON.stringify(projectData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = (projectData.name || 'project').replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
    a.href = url;
    a.download = `${safeName}.mediastudio`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Parse an imported .mediastudio JSON file
   */
  async importProjectFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (!parsed.width || !parsed.height || !Array.isArray(parsed.layers)) {
            throw new Error('Invalid MediaStudio project format.');
          }
          resolve(parsed);
        } catch (err) {
          reject(new Error('Failed to parse project file: ' + err.message));
        }
      };
      reader.onerror = () => reject(new Error('Could not read file.'));
      reader.readAsText(file);
    });
  }

  /**
   * Auto-save debouncer
   */
  queueAutoSave(getProjectDataFn, onStatusChange) {
    if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
    if (onStatusChange) onStatusChange('saving');

    this.autoSaveTimer = setTimeout(async () => {
      try {
        const data = getProjectDataFn();
        if (data) {
          await this.saveProject(data);
          if (onStatusChange) onStatusChange('saved');
        }
      } catch (err) {
        console.warn('Auto-save failed:', err);
        if (onStatusChange) onStatusChange('error');
      }
    }, 1200);
  }
}
const storageEngine = new StorageEngine();


/* --- MODULE: transform-engine.js --- */
/**
 * MediaStudio — Transform Engine
 * 8-handle transformation, rotation with angle snapping, aspect ratio locking, and smart alignment guides.
 */
class TransformEngine {
  constructor(canvasEngine) {
    this.canvasEngine = canvasEngine;
    this.handleSize = 8; // in screen pixels
    this.rotationHandleDistance = 24; // in screen pixels
    this.activeHandle = null;
    this.transformState = null;
    this.snapThreshold = 6; // snap tolerance in canvas px
    this.activeGuides = []; // active guide lines for overlay
  }

  /**
   * Get handle definitions for a selected layer in canvas coordinates
   */
  getHandles(layer) {
    const hw = layer.width / 2;
    const hh = layer.height / 2;
    const cx = layer.x + hw;
    const cy = layer.y + hh;
    const rad = (layer.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const localPoints = {
      nw: { x: -hw, y: -hh, cursorAngle: 315 },
      n:  { x: 0,   y: -hh, cursorAngle: 0 },
      ne: { x: hw,  y: -hh, cursorAngle: 45 },
      e:  { x: hw,  y: 0,   cursorAngle: 90 },
      se: { x: hw,  y: hh,  cursorAngle: 135 },
      s:  { x: 0,   y: hh,  cursorAngle: 180 },
      sw: { x: -hw, y: hh,  cursorAngle: 225 },
      w:  { x: -hw, y: 0,   cursorAngle: 270 },
      rot: { x: 0,  y: -hh - this.rotationHandleDistance / this.canvasEngine.zoom, cursorAngle: 0 }
    };

    const handles = {};
    for (const [key, pt] of Object.entries(localPoints)) {
      handles[key] = {
        x: cx + (pt.x * cos - pt.y * sin),
        y: cy + (pt.x * sin + pt.y * cos),
        cursorAngle: (pt.cursorAngle + layer.rotation) % 360
      };
    }

    return handles;
  }

  /**
   * Hit test against transform handles
   */
  hitTestHandles(layer, worldX, worldY) {
    if (!layer) return null;
    const handles = this.getHandles(layer);
    const hitRadius = (this.handleSize * 1.5) / this.canvasEngine.zoom;

    for (const [name, pos] of Object.entries(handles)) {
      const dx = worldX - pos.x;
      const dy = worldY - pos.y;
      if (Math.sqrt(dx * dx + dy * dy) <= hitRadius) {
        return name;
      }
    }
    return null;
  }

  /**
   * Get appropriate CSS cursor for a given handle based on rotated angle
   */
  getCursorForHandle(handleName, layer) {
    if (!handleName || !layer) return 'default';
    if (handleName === 'rot') return 'crosshair';

    const handles = this.getHandles(layer);
    const angle = handles[handleName].cursorAngle;
    const normalized = (angle + 360) % 180;

    if (normalized >= 22.5 && normalized < 67.5) return 'nesw-resize';
    if (normalized >= 67.5 && normalized < 112.5) return 'ew-resize';
    if (normalized >= 112.5 && normalized < 157.5) return 'nwse-resize';
    return 'ns-resize';
  }

  /**
   * Begin transform drag interaction
   */
  startTransform(handle, layer, startWorldX, startWorldY, options = {}) {
    this.activeHandle = handle;
    this.activeGuides = [];

    const hw = layer.width / 2;
    const hh = layer.height / 2;

    this.transformState = {
      handle,
      layer,
      startX: startWorldX,
      startY: startWorldY,
      initialLayerX: layer.x,
      initialLayerY: layer.y,
      initialWidth: layer.width,
      initialHeight: layer.height,
      initialRotation: layer.rotation,
      centerX: layer.x + hw,
      centerY: layer.y + hh,
      aspectRatio: layer.width / Math.max(1, layer.height),
      lockAspect: options.lockAspect !== undefined ? options.lockAspect : true
    };
  }

  /**
   * Process mouse movement during transform
   */
  updateTransform(currentWorldX, currentWorldY, event) {
    if (!this.transformState || !this.activeHandle) return null;

    const s = this.transformState;
    const layer = s.layer;
    const shiftKey = event.shiftKey;
    const altKey = event.altKey;

    if (this.activeHandle === 'rot') {
      // Rotation interaction
      const dx = currentWorldX - s.centerX;
      const dy = currentWorldY - s.centerY;
      let angleRad = Math.atan2(dy, dx);
      let angleDeg = (angleRad * 180) / Math.PI + 90; // Top is 0 deg

      if (angleDeg < 0) angleDeg += 360;
      angleDeg = angleDeg % 360;

      // 15 degree snapping with Shift key
      if (shiftKey) {
        angleDeg = Math.round(angleDeg / 15) * 15;
      }

      layer.rotation = Math.round(angleDeg);
      return { type: 'rotate', angle: layer.rotation };
    }

    // Scale interaction
    const rad = (-s.initialRotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // Vector from initial center to current mouse in layer-local space
    const curDx = currentWorldX - s.centerX;
    const curDy = currentWorldY - s.centerY;
    const curLocalX = curDx * cos - curDy * sin;
    const curLocalY = curDx * sin + curDy * cos;

    let newW = s.initialWidth;
    let newH = s.initialHeight;
    let newCenterX = s.centerX;
    let newCenterY = s.centerY;

    const lockAspect = s.lockAspect || shiftKey;

    switch (this.activeHandle) {
      case 'e':
        newW = Math.max(10, curLocalX * 2);
        if (lockAspect) newH = newW / s.aspectRatio;
        break;
      case 'w':
        newW = Math.max(10, -curLocalX * 2);
        if (lockAspect) newH = newW / s.aspectRatio;
        break;
      case 's':
        newH = Math.max(10, curLocalY * 2);
        if (lockAspect) newW = newH * s.aspectRatio;
        break;
      case 'n':
        newH = Math.max(10, -curLocalY * 2);
        if (lockAspect) newW = newH * s.aspectRatio;
        break;
      case 'se':
        newW = Math.max(10, curLocalX * 2);
        newH = Math.max(10, curLocalY * 2);
        if (lockAspect) {
          const maxDim = Math.max(newW, newH * s.aspectRatio);
          newW = maxDim;
          newH = maxDim / s.aspectRatio;
        }
        break;
      case 'sw':
        newW = Math.max(10, -curLocalX * 2);
        newH = Math.max(10, curLocalY * 2);
        if (lockAspect) {
          const maxDim = Math.max(newW, newH * s.aspectRatio);
          newW = maxDim;
          newH = maxDim / s.aspectRatio;
        }
        break;
      case 'ne':
        newW = Math.max(10, curLocalX * 2);
        newH = Math.max(10, -curLocalY * 2);
        if (lockAspect) {
          const maxDim = Math.max(newW, newH * s.aspectRatio);
          newW = maxDim;
          newH = maxDim / s.aspectRatio;
        }
        break;
      case 'nw':
        newW = Math.max(10, -curLocalX * 2);
        newH = Math.max(10, -curLocalY * 2);
        if (lockAspect) {
          const maxDim = Math.max(newW, newH * s.aspectRatio);
          newW = maxDim;
          newH = maxDim / s.aspectRatio;
        }
        break;
    }

    layer.width = Math.round(newW);
    layer.height = Math.round(newH);
    layer.x = Math.round(newCenterX - layer.width / 2);
    layer.y = Math.round(newCenterY - layer.height / 2);

    if (layer.type === 'drawing') {
      layer.initCanvas();
    }

    return { type: 'resize', width: layer.width, height: layer.height };
  }

  /**
   * Move layer with magnetic Smart Guide snapping
   */
  moveLayerWithSnapping(layer, deltaX, deltaY, allLayers, canvasWidth, canvasHeight, enableSnap = true) {
    let targetX = layer.x + deltaX;
    let targetY = layer.y + deltaY;

    this.activeGuides = [];

    if (!enableSnap) {
      layer.x = Math.round(targetX);
      layer.y = Math.round(targetY);
      return;
    }

    const layerCenterX = targetX + layer.width / 2;
    const layerCenterY = targetY + layer.height / 2;
    const layerRight = targetX + layer.width;
    const layerBottom = targetY + layer.height;

    const snapThreshold = this.snapThreshold;

    // 1. Canvas Center Snap
    const canvasCenterX = canvasWidth / 2;
    const canvasCenterY = canvasHeight / 2;

    if (Math.abs(layerCenterX - canvasCenterX) <= snapThreshold) {
      targetX = canvasCenterX - layer.width / 2;
      this.activeGuides.push({ type: 'vertical', pos: canvasCenterX, color: '#ec4899' });
    }

    if (Math.abs(layerCenterY - canvasCenterY) <= snapThreshold) {
      targetY = canvasCenterY - layer.height / 2;
      this.activeGuides.push({ type: 'horizontal', pos: canvasCenterY, color: '#ec4899' });
    }

    // 2. Canvas Edge Snap
    if (Math.abs(targetX) <= snapThreshold) {
      targetX = 0;
      this.activeGuides.push({ type: 'vertical', pos: 0, color: '#3b82f6' });
    }
    if (Math.abs(layerRight - canvasWidth) <= snapThreshold) {
      targetX = canvasWidth - layer.width;
      this.activeGuides.push({ type: 'vertical', pos: canvasWidth, color: '#3b82f6' });
    }
    if (Math.abs(targetY) <= snapThreshold) {
      targetY = 0;
      this.activeGuides.push({ type: 'horizontal', pos: 0, color: '#3b82f6' });
    }
    if (Math.abs(layerBottom - canvasHeight) <= snapThreshold) {
      targetY = canvasHeight - layer.height;
      this.activeGuides.push({ type: 'horizontal', pos: canvasHeight, color: '#3b82f6' });
    }

    // 3. Other layers bounds snap
    for (const other of allLayers) {
      if (other.id === layer.id || !other.visible) continue;

      const oCenterX = other.x + other.width / 2;
      const oCenterY = other.y + other.height / 2;
      const oRight = other.x + other.width;
      const oBottom = other.y + other.height;

      // Vertical alignment
      if (Math.abs(layerCenterX - oCenterX) <= snapThreshold) {
        targetX = oCenterX - layer.width / 2;
        this.activeGuides.push({ type: 'vertical', pos: oCenterX, color: '#06b6d4' });
      } else if (Math.abs(targetX - other.x) <= snapThreshold) {
        targetX = other.x;
        this.activeGuides.push({ type: 'vertical', pos: other.x, color: '#06b6d4' });
      } else if (Math.abs(layerRight - oRight) <= snapThreshold) {
        targetX = oRight - layer.width;
        this.activeGuides.push({ type: 'vertical', pos: oRight, color: '#06b6d4' });
      }

      // Horizontal alignment
      if (Math.abs(layerCenterY - oCenterY) <= snapThreshold) {
        targetY = oCenterY - layer.height / 2;
        this.activeGuides.push({ type: 'horizontal', pos: oCenterY, color: '#06b6d4' });
      } else if (Math.abs(targetY - other.y) <= snapThreshold) {
        targetY = other.y;
        this.activeGuides.push({ type: 'horizontal', pos: other.y, color: '#06b6d4' });
      } else if (Math.abs(layerBottom - oBottom) <= snapThreshold) {
        targetY = oBottom - layer.height;
        this.activeGuides.push({ type: 'horizontal', pos: oBottom, color: '#06b6d4' });
      }
    }

    layer.x = Math.round(targetX);
    layer.y = Math.round(targetY);
  }

  endTransform() {
    this.activeHandle = null;
    this.transformState = null;
    this.activeGuides = [];
  }

  /**
   * Render handles, bounding boxes, and smart guides to overlay canvas
   */
  renderOverlay(ctx, selectedLayers, canvasWidth, canvasHeight) {
    if (!selectedLayers || selectedLayers.length === 0) return;

    const zoom = this.canvasEngine.zoom;

    // Render Smart Guides
    for (const guide of this.activeGuides) {
      ctx.save();
      ctx.strokeStyle = guide.color || '#ec4899';
      ctx.lineWidth = 1 / zoom;
      ctx.setLineDash([4 / zoom, 4 / zoom]);

      ctx.beginPath();
      if (guide.type === 'vertical') {
        ctx.moveTo(guide.pos, -5000);
        ctx.lineTo(guide.pos, 5000);
      } else {
        ctx.moveTo(-5000, guide.pos);
        ctx.lineTo(5000, guide.pos);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Render Bounding Box and Handles for each selected layer
    for (const layer of selectedLayers) {
      const handles = this.getHandles(layer);
      const corners = layer.getCorners();
      const hw = layer.width / 2;
      const hh = layer.height / 2;
      const cx = layer.x + hw;
      const cy = layer.y + hh;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((layer.rotation * Math.PI) / 180);

      // Bounding Box outline
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.5 / zoom;
      ctx.setLineDash([]);
      ctx.strokeRect(-hw, -hh, layer.width, layer.height);

      // Stem line for rotation handle
      const rotDist = this.rotationHandleDistance / zoom;
      ctx.beginPath();
      ctx.moveTo(0, -hh);
      ctx.lineTo(0, -hh - rotDist);
      ctx.strokeStyle = '#3b82f6';
      ctx.stroke();

      ctx.restore();

      // Draw 8 Scale Handles & 1 Rotation Handle in world coordinates
      const handleSize = this.handleSize / zoom;

      for (const [name, pos] of Object.entries(handles)) {
        ctx.save();
        ctx.translate(pos.x, pos.y);

        if (name === 'rot') {
          // Circle rotation handle
          ctx.beginPath();
          ctx.arc(0, 0, handleSize * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 1.5 / zoom;
          ctx.stroke();
        } else {
          // Square scaling handles
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-handleSize / 2, -handleSize / 2, handleSize, handleSize);
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 1.5 / zoom;
          ctx.strokeRect(-handleSize / 2, -handleSize / 2, handleSize, handleSize);
        }

        ctx.restore();
      }
    }
  }
}


/* --- MODULE: tool-engine.js --- */
/**
 * MediaStudio — Tool Engine
 * Handles user interactions for Select, Hand, Crop, Brush, Eraser, Text, Shape, and Eyedropper tools.
 */
class ToolEngine {
  constructor(canvasEngine, app) {
    this.canvasEngine = canvasEngine;
    this.app = app;

    this.activeTool = 'select'; // select, hand, crop, brush, eraser, text, shape, eyedropper
    this.activeShapeType = 'rectangle';

    // Brush settings
    this.brush = {
      color: '#3b82f6',
      size: 12,
      opacity: 1.0,
      hardness: 80
    };

    // Crop state
    this.cropState = {
      active: false,
      aspectRatio: 'free', // free, 1:1, 16:9, 9:16, 4:3, 3:2, 2:1
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      activeHandle: null,
      startMouseX: 0,
      startMouseY: 0
    };

    // Tool interaction state
    this.isMouseDown = false;
    this.startWorldPos = { x: 0, y: 0 };
    this.currentDrawingStroke = null;
    this.tempShapeLayer = null;
    this.marqueeSelection = null; // { x, y, width, height }
  }

  setTool(toolName) {
    if (this.activeTool === toolName) return;

    // Clean up previous tool
    if (this.activeTool === 'crop' && toolName !== 'crop') {
      this.cancelCrop();
    }

    this.activeTool = toolName;
    this.canvasEngine.updateCursor();
    this.canvasEngine.requestRender();

    // If switching to crop tool, initialize crop box
    if (toolName === 'crop') {
      this.initCropBox();
    }
  }

  setShapeType(shapeType) {
    this.activeShapeType = shapeType;
    this.setTool('shape');
  }

  /* ==========================================================================
     POINTER / MOUSE EVENT DISPATCHERS
     ========================================================================== */

  onPointerDown(worldX, worldY, event) {
    this.isMouseDown = true;
    this.startWorldPos = { x: worldX, y: worldY };

    // Spacebar held down -> Hand pan mode override
    if (this.canvasEngine.isSpacePressed || event.button === 1 || this.activeTool === 'hand') {
      this.canvasEngine.startPan(event.clientX, event.clientY);
      return;
    }

    switch (this.activeTool) {
      case 'select':
        this._handleSelectPointerDown(worldX, worldY, event);
        break;

      case 'crop':
        this._handleCropPointerDown(worldX, worldY, event);
        break;

      case 'brush':
      case 'eraser':
        this._handleBrushPointerDown(worldX, worldY, event);
        break;

      case 'text':
        this._handleTextPointerDown(worldX, worldY, event);
        break;

      case 'shape':
        this._handleShapePointerDown(worldX, worldY, event);
        break;

      case 'eyedropper':
        this._handleEyedropperPointerDown(worldX, worldY, event);
        break;
    }

    this.canvasEngine.requestRender();
  }

  onPointerMove(worldX, worldY, event) {
    // 1. Pan Drag
    if (this.canvasEngine.isPanning) {
      this.canvasEngine.updatePan(event.clientX, event.clientY);
      return;
    }

    // 2. Eyedropper Hover Loupe
    if (this.activeTool === 'eyedropper') {
      this.updateEyedropperLoupe(event.clientX, event.clientY, worldX, worldY);
    }

    if (!this.isMouseDown) {
      // Hover handle checks for select tool
      if (this.activeTool === 'select') {
        const selected = this.app.selectedLayer;
        if (selected) {
          const handle = this.app.transformEngine.hitTestHandles(selected, worldX, worldY);
          if (handle) {
            this.canvasEngine.setCursor(this.app.transformEngine.getCursorForHandle(handle, selected));
            return;
          }
        }
        // Hover over layer check
        const hovered = this.app.getTopLayerAt(worldX, worldY);
        this.canvasEngine.setCursor(hovered ? 'move' : 'default');
      }
      return;
    }

    // Active drag interactions
    switch (this.activeTool) {
      case 'select':
        this._handleSelectPointerMove(worldX, worldY, event);
        break;

      case 'crop':
        this._handleCropPointerMove(worldX, worldY, event);
        break;

      case 'brush':
      case 'eraser':
        this._handleBrushPointerMove(worldX, worldY, event);
        break;

      case 'shape':
        this._handleShapePointerMove(worldX, worldY, event);
        break;
    }

    this.canvasEngine.requestRender();
  }

  onPointerUp(worldX, worldY, event) {
    if (this.canvasEngine.isPanning) {
      this.canvasEngine.endPan();
    }

    if (this.isMouseDown) {
      switch (this.activeTool) {
        case 'select':
          this._handleSelectPointerUp(worldX, worldY, event);
          break;

        case 'crop':
          this._handleCropPointerUp(worldX, worldY, event);
          break;

        case 'brush':
        case 'eraser':
          this._handleBrushPointerUp(worldX, worldY, event);
          break;

        case 'shape':
          this._handleShapePointerUp(worldX, worldY, event);
          break;
      }
    }

    this.isMouseDown = false;
    this.canvasEngine.requestRender();
  }

  /* ==========================================================================
     TOOL HANDLERS
     ========================================================================== */

  // 1. SELECT TOOL
  _handleSelectPointerDown(worldX, worldY, event) {
    const selected = this.app.selectedLayer;

    // Check if clicking transform handle
    if (selected && !selected.locked) {
      const handle = this.app.transformEngine.hitTestHandles(selected, worldX, worldY);
      if (handle) {
        this.app.transformEngine.startTransform(
          handle,
          selected,
          worldX,
          worldY,
          { lockAspect: this.app.lockAspectRatio }
        );
        return;
      }
    }

    // Hit test layers
    const hitLayer = this.app.getTopLayerAt(worldX, worldY);

    if (hitLayer) {
      this.app.selectLayer(hitLayer);
      if (!hitLayer.locked) {
        this.isMovingLayer = true;
        this.layerDragStartPos = { x: hitLayer.x, y: hitLayer.y };
      }
    } else {
      // Clicked on empty canvas background -> deselect & start marquee selection
      this.app.selectLayer(null);
      this.marqueeSelection = { x: worldX, y: worldY, width: 0, height: 0 };
    }
  }

  _handleSelectPointerMove(worldX, worldY, event) {
    // Transform handle drag
    if (this.app.transformEngine.activeHandle) {
      this.app.transformEngine.updateTransform(worldX, worldY, event);
      this.app.syncPropertiesUI();
      return;
    }

    // Move layer drag
    if (this.isMovingLayer && this.app.selectedLayer && !this.app.selectedLayer.locked) {
      const dx = worldX - this.startWorldPos.x;
      const dy = worldY - this.startWorldPos.y;

      const layer = this.app.selectedLayer;
      this.app.transformEngine.moveLayerWithSnapping(
        layer,
        (this.layerDragStartPos.x + dx) - layer.x,
        (this.layerDragStartPos.y + dy) - layer.y,
        this.app.layers,
        this.canvasEngine.width,
        this.canvasEngine.height,
        this.app.snapToGuides
      );

      this.app.syncPropertiesUI();
      return;
    }

    // Marquee selection drag
    if (this.marqueeSelection) {
      const minX = Math.min(this.startWorldPos.x, worldX);
      const minY = Math.min(this.startWorldPos.y, worldY);
      const w = Math.abs(worldX - this.startWorldPos.x);
      const h = Math.abs(worldY - this.startWorldPos.y);
      this.marqueeSelection = { x: minX, y: minY, width: w, height: h };
    }
  }

  _handleSelectPointerUp(worldX, worldY, event) {
    if (this.app.transformEngine.activeHandle) {
      this.app.transformEngine.endTransform();
      this.app.recordHistory('Transform Layer');
    } else if (this.isMovingLayer) {
      this.isMovingLayer = false;
      this.app.recordHistory('Move Layer');
    }

    if (this.marqueeSelection) {
      // Find layers inside marquee
      const m = this.marqueeSelection;
      if (m.width > 5 && m.height > 5) {
        for (let i = this.app.layers.length - 1; i >= 0; i--) {
          const l = this.app.layers[i];
          if (l.x >= m.x && l.x + l.width <= m.x + m.width &&
              l.y >= m.y && l.y + l.height <= m.y + m.height) {
            this.app.selectLayer(l);
            break;
          }
        }
      }
      this.marqueeSelection = null;
    }
  }

  // 2. BRUSH & ERASER TOOLS
  _handleBrushPointerDown(worldX, worldY, event) {
    // Ensure we have an active drawing layer
    let drawLayer = this.app.selectedLayer;
    if (!drawLayer || drawLayer.type !== 'drawing' || drawLayer.locked) {
      // Create new drawing layer
      drawLayer = new DrawingLayer({
        name: 'Drawing Layer ' + (this.app.layers.length + 1),
        x: 0,
        y: 0,
        width: this.canvasEngine.width,
        height: this.canvasEngine.height
      });
      this.app.addLayer(drawLayer);
    }

    const isEraser = this.activeTool === 'eraser';
    const local = drawLayer.worldToLocal(worldX, worldY);

    this.currentDrawingStroke = {
      points: [{ x: local.x, y: local.y }],
      color: this.app.primaryColor,
      size: this.brush.size,
      opacity: this.brush.opacity,
      hardness: this.brush.hardness,
      isEraser
    };

    drawLayer.addStroke(this.currentDrawingStroke);
  }

  _handleBrushPointerMove(worldX, worldY, event) {
    if (!this.currentDrawingStroke || !this.app.selectedLayer) return;
    const drawLayer = this.app.selectedLayer;
    const local = drawLayer.worldToLocal(worldX, worldY);

    this.currentDrawingStroke.points.push({ x: local.x, y: local.y });
    drawLayer.drawSingleStroke(drawLayer.drawingCanvas.getContext('2d'), this.currentDrawingStroke);
  }

  _handleBrushPointerUp(worldX, worldY, event) {
    if (this.currentDrawingStroke) {
      this.currentDrawingStroke = null;
      this.app.recordHistory(this.activeTool === 'eraser' ? 'Eraser Stroke' : 'Brush Stroke');
    }
  }

  // 3. TEXT TOOL
  _handleTextPointerDown(worldX, worldY, event) {
    const textLayer = new TextLayer({
      name: 'Text Layer ' + (this.app.layers.length + 1),
      text: 'Heading Text',
      x: Math.round(worldX),
      y: Math.round(worldY),
      fontSize: 48,
      fillColor: this.app.primaryColor
    });

    this.app.addLayer(textLayer);
    this.app.selectLayer(textLayer);
    this.setTool('select');
    this.app.recordHistory('Add Text');
  }

  // 4. SHAPE TOOL
  _handleShapePointerDown(worldX, worldY, event) {
    this.tempShapeLayer = new ShapeLayer({
      name: this.activeShapeType.charAt(0).toUpperCase() + this.activeShapeType.slice(1),
      shapeType: this.activeShapeType,
      x: worldX,
      y: worldY,
      width: 10,
      height: 10,
      fillColor: this.app.primaryColor,
      strokeColor: this.app.secondaryColor,
      strokeWidth: 0
    });

    this.app.addLayer(this.tempShapeLayer);
    this.app.selectLayer(this.tempShapeLayer);
  }

  _handleShapePointerMove(worldX, worldY, event) {
    if (!this.tempShapeLayer) return;

    const startX = this.startWorldPos.x;
    const startY = this.startWorldPos.y;

    let w = Math.abs(worldX - startX);
    let h = Math.abs(worldY - startY);

    if (event.shiftKey) {
      const maxDim = Math.max(w, h);
      w = maxDim;
      h = maxDim;
    }

    const minX = Math.min(startX, worldX);
    const minY = Math.min(startY, worldY);

    this.tempShapeLayer.x = minX;
    this.tempShapeLayer.y = minY;
    this.tempShapeLayer.width = Math.max(10, w);
    this.tempShapeLayer.height = Math.max(10, h);
  }

  _handleShapePointerUp(worldX, worldY, event) {
    if (this.tempShapeLayer) {
      if (this.tempShapeLayer.width < 15 && this.tempShapeLayer.height < 15) {
        // Default size on simple click
        this.tempShapeLayer.width = 160;
        this.tempShapeLayer.height = 160;
        this.tempShapeLayer.x = this.startWorldPos.x - 80;
        this.tempShapeLayer.y = this.startWorldPos.y - 80;
      }

      this.tempShapeLayer = null;
      this.setTool('select');
      this.app.recordHistory('Add Shape');
    }
  }

  // 5. EYEDROPPER TOOL
  _handleEyedropperPointerDown(worldX, worldY, event) {
    const color = this.sampleColorAtWorld(worldX, worldY);
    if (color) {
      this.app.setPrimaryColor(color.hex);
      this.app.showToast(`Sampled color: ${color.hex}`);
      this.setTool('select');
    }
  }

  sampleColorAtWorld(worldX, worldY) {
    const mainCanvas = this.canvasEngine.mainCanvas;
    if (worldX < 0 || worldX >= mainCanvas.width || worldY < 0 || worldY >= mainCanvas.height) {
      return null;
    }
    return FilterEngine.getPixelColor(mainCanvas, worldX, worldY);
  }

  updateEyedropperLoupe(clientX, clientY, worldX, worldY) {
    const loupe = document.getElementById('eyedropper-loupe');
    if (!loupe) return;

    loupe.classList.remove('hidden');
    loupe.style.left = `${clientX}px`;
    loupe.style.top = `${clientY}px`;

    const loupeCanvas = document.getElementById('loupe-canvas');
    const colorBadge = document.getElementById('loupe-color-hex');
    const lCtx = loupeCanvas.getContext('2d');

    const mainCanvas = this.canvasEngine.mainCanvas;
    lCtx.clearRect(0, 0, 90, 90);
    lCtx.imageSmoothingEnabled = false;

    // Draw 9x9 zoomed grid centered on pixel
    lCtx.drawImage(
      mainCanvas,
      Math.floor(worldX) - 4,
      Math.floor(worldY) - 4,
      9,
      9,
      0,
      0,
      90,
      90
    );

    const color = this.sampleColorAtWorld(worldX, worldY);
    if (color) {
      colorBadge.textContent = color.hex.toUpperCase();
      colorBadge.style.color = '#ffffff';
    }
  }

  hideEyedropperLoupe() {
    const loupe = document.getElementById('eyedropper-loupe');
    if (loupe) loupe.classList.add('hidden');
  }

  // 6. CROP TOOL
  initCropBox() {
    this.cropState.active = true;
    this.cropState.x = 0;
    this.cropState.y = 0;
    this.cropState.width = this.canvasEngine.width;
    this.cropState.height = this.canvasEngine.height;
    this.cropState.aspectRatio = 'free';

    const hud = document.getElementById('crop-hud-overlay');
    if (hud) hud.classList.remove('hidden');
  }

  setCropAspectRatio(aspectRatio) {
    this.cropState.aspectRatio = aspectRatio;
    if (aspectRatio === 'free') return;

    const parts = aspectRatio.split(':');
    if (parts.length === 2) {
      const ratio = parseFloat(parts[0]) / parseFloat(parts[1]);
      let newW = this.cropState.width;
      let newH = newW / ratio;

      if (newH > this.canvasEngine.height) {
        newH = this.canvasEngine.height;
        newW = newH * ratio;
      }

      this.cropState.width = Math.round(newW);
      this.cropState.height = Math.round(newH);
      this.cropState.x = Math.round((this.canvasEngine.width - newW) / 2);
      this.cropState.y = Math.round((this.canvasEngine.height - newH) / 2);
      this.canvasEngine.requestRender();
    }
  }

  _handleCropPointerDown(worldX, worldY, event) {
    const c = this.cropState;
    const hitHandle = this.hitTestCropHandles(worldX, worldY);

    if (hitHandle) {
      c.activeHandle = hitHandle;
      c.startMouseX = worldX;
      c.startMouseY = worldY;
      c.startX = c.x;
      c.startY = c.y;
      c.startW = c.width;
      c.startH = c.height;
    }
  }

  _handleCropPointerMove(worldX, worldY, event) {
    const c = this.cropState;
    if (!c.activeHandle) return;

    const dx = worldX - c.startMouseX;
    const dy = worldY - c.startMouseY;

    let x = c.startX;
    let y = c.startY;
    let w = c.startW;
    let h = c.startH;

    switch (c.activeHandle) {
      case 'se':
        w = Math.max(50, c.startW + dx);
        h = Math.max(50, c.startH + dy);
        break;
      case 'sw':
        w = Math.max(50, c.startW - dx);
        h = Math.max(50, c.startH + dy);
        x = c.startX + (c.startW - w);
        break;
      case 'ne':
        w = Math.max(50, c.startW + dx);
        h = Math.max(50, c.startH - dy);
        y = c.startY + (c.startH - h);
        break;
      case 'nw':
        w = Math.max(50, c.startW - dx);
        h = Math.max(50, c.startH - dy);
        x = c.startX + (c.startW - w);
        y = c.startY + (c.startH - h);
        break;
      case 'e':
        w = Math.max(50, c.startW + dx);
        break;
      case 'w':
        w = Math.max(50, c.startW - dx);
        x = c.startX + (c.startW - w);
        break;
      case 's':
        h = Math.max(50, c.startH + dy);
        break;
      case 'n':
        h = Math.max(50, c.startH - dy);
        y = c.startY + (c.startH - h);
        break;
      case 'move':
        x = c.startX + dx;
        y = c.startY + dy;
        break;
    }

    c.x = Math.round(x);
    c.y = Math.round(y);
    c.width = Math.round(w);
    c.height = Math.round(h);
  }

  _handleCropPointerUp(worldX, worldY, event) {
    this.cropState.activeHandle = null;
  }

  hitTestCropHandles(worldX, worldY) {
    const c = this.cropState;
    const threshold = 12 / this.canvasEngine.zoom;

    const handles = {
      nw: { x: c.x, y: c.y },
      ne: { x: c.x + c.width, y: c.y },
      se: { x: c.x + c.width, y: c.y + c.height },
      sw: { x: c.x, y: c.y + c.height },
      n:  { x: c.x + c.width / 2, y: c.y },
      s:  { x: c.x + c.width / 2, y: c.y + c.height },
      e:  { x: c.x + c.width, y: c.y + c.height / 2 },
      w:  { x: c.x, y: c.y + c.height / 2 }
    };

    for (const [name, pos] of Object.entries(handles)) {
      if (Math.abs(worldX - pos.x) <= threshold && Math.abs(worldY - pos.y) <= threshold) {
        return name;
      }
    }

    // Inside crop box
    if (worldX >= c.x && worldX <= c.x + c.width && worldY >= c.y && worldY <= c.y + c.height) {
      return 'move';
    }

    return null;
  }

  applyCrop() {
    const c = this.cropState;
    if (!c.active || c.width <= 0 || c.height <= 0) return;

    // Shift all layers relative to new crop origin
    const offsetX = -c.x;
    const offsetY = -c.y;

    for (const layer of this.app.layers) {
      layer.x += offsetX;
      layer.y += offsetY;
    }

    // Update canvas size
    this.canvasEngine.resizeCanvas(c.width, c.height, false);

    this.cancelCrop();
    this.app.recordHistory('Crop Canvas');
    this.app.showToast(`Cropped to ${c.width} × ${c.height} px`);
  }

  cancelCrop() {
    this.cropState.active = false;
    const hud = document.getElementById('crop-hud-overlay');
    if (hud) hud.classList.add('hidden');
    this.setTool('select');
  }

  /**
   * Render Crop overlay (dark shroud and rule-of-thirds grid)
   */
  renderCropOverlay(ctx) {
    if (!this.cropState.active) return;
    const c = this.cropState;
    const cw = this.canvasEngine.width;
    const ch = this.canvasEngine.height;
    const zoom = this.canvasEngine.zoom;

    // 1. Dark Shroud around cropped area
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';

    // Top
    ctx.fillRect(0, 0, cw, c.y);
    // Bottom
    ctx.fillRect(0, c.y + c.height, cw, ch - (c.y + c.height));
    // Left
    ctx.fillRect(0, c.y, c.x, c.height);
    // Right
    ctx.fillRect(c.x + c.width, c.y, cw - (c.x + c.width), c.height);

    // 2. Crop border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5 / zoom;
    ctx.strokeRect(c.x, c.y, c.width, c.height);

    // 3. Rule of Thirds grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1 / zoom;
    ctx.beginPath();
    // Vertical grid lines
    ctx.moveTo(c.x + c.width / 3, c.y);
    ctx.lineTo(c.x + c.width / 3, c.y + c.height);
    ctx.moveTo(c.x + (c.width / 3) * 2, c.y);
    ctx.lineTo(c.x + (c.width / 3) * 2, c.y + c.height);
    // Horizontal grid lines
    ctx.moveTo(c.x, c.y + c.height / 3);
    ctx.lineTo(c.x + c.width, c.y + c.height / 3);
    ctx.moveTo(c.x, c.y + (c.height / 3) * 2);
    ctx.lineTo(c.x + c.width, c.y + (c.height / 3) * 2);
    ctx.stroke();

    // 4. Crop handles (thick white L-corners and edge bars)
    const handleLen = 14 / zoom;
    const handleW = 3 / zoom;
    ctx.fillStyle = '#ffffff';

    // NW
    ctx.fillRect(c.x - handleW, c.y - handleW, handleLen, handleW * 2);
    ctx.fillRect(c.x - handleW, c.y - handleW, handleW * 2, handleLen);

    // NE
    ctx.fillRect(c.x + c.width - handleLen + handleW, c.y - handleW, handleLen, handleW * 2);
    ctx.fillRect(c.x + c.width - handleW, c.y - handleW, handleW * 2, handleLen);

    // SE
    ctx.fillRect(c.x + c.width - handleLen + handleW, c.y + c.height - handleW, handleLen, handleW * 2);
    ctx.fillRect(c.x + c.width - handleW, c.y + c.height - handleLen + handleW, handleW * 2, handleLen);

    // SW
    ctx.fillRect(c.x - handleW, c.y + c.height - handleW, handleLen, handleW * 2);
    ctx.fillRect(c.x - handleW, c.y + c.height - handleLen + handleW, handleW * 2, handleLen);

    ctx.restore();
  }

  /**
   * Render Marquee Selection box
   */
  renderMarquee(ctx) {
    if (!this.marqueeSelection) return;
    const m = this.marqueeSelection;
    const zoom = this.canvasEngine.zoom;

    ctx.save();
    ctx.strokeStyle = '#3b82f6';
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.lineWidth = 1 / zoom;
    ctx.setLineDash([4 / zoom, 3 / zoom]);

    ctx.fillRect(m.x, m.y, m.width, m.height);
    ctx.strokeRect(m.x, m.y, m.width, m.height);
    ctx.restore();
  }
}


/* --- MODULE: export-engine.js --- */
/**
 * MediaStudio — Export Engine
 * Generates high-resolution PNG, JPEG, and WebP artwork, single layer exports, and clipboard copy.
 */
class ExportEngine {
  constructor(app) {
    this.app = app;
  }

  /**
   * Render composition to an offscreen export canvas at custom scale
   */
  renderExportCanvas(options = {}) {
    const {
      scale = 1.0,
      scope = 'canvas', // 'canvas' or 'selection'
      format = 'png',
      quality = 0.92,
      preserveTransparency = true
    } = options;

    const exportCanvas = document.createElement('canvas');
    const ctx = exportCanvas.getContext('2d');

    if (scope === 'selection' && this.app.selectedLayer) {
      // Export single layer
      const layer = this.app.selectedLayer;
      exportCanvas.width = Math.round(layer.width * scale);
      exportCanvas.height = Math.round(layer.height * scale);

      ctx.save();
      ctx.scale(scale, scale);
      ctx.translate(layer.width / 2, layer.height / 2);
      layer.drawContent(ctx);
      ctx.restore();
    } else {
      // Export full canvas
      const width = Math.round(this.app.canvasEngine.width * scale);
      const height = Math.round(this.app.canvasEngine.height * scale);

      exportCanvas.width = width;
      exportCanvas.height = height;

      // Draw background if not transparent or if JPEG
      if (!preserveTransparency || format === 'jpeg' || (!this.app.canvasEngine.isTransparent && this.app.canvasEngine.backgroundColor)) {
        ctx.fillStyle = this.app.canvasEngine.backgroundColor || '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.save();
      ctx.scale(scale, scale);

      // Render layers
      for (const layer of this.app.layers) {
        if (layer.visible) {
          layer.render(ctx);
        }
      }

      ctx.restore();
    }

    return exportCanvas;
  }

  /**
   * Download exported image file
   */
  async downloadExport(options = {}) {
    const {
      filename = 'untitled',
      format = 'png', // 'png', 'jpeg', 'webp'
      quality = 0.92,
      scale = 1.0
    } = options;

    const canvas = this.renderExportCanvas(options);
    const mimeType = format === 'jpeg' ? 'image/jpeg' : (format === 'webp' ? 'image/webp' : 'image/png');

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const ext = format === 'jpeg' ? 'jpg' : format;
      a.href = url;
      a.download = `${filename}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, mimeType, quality);
  }

  /**
   * Copy exported image directly to clipboard
   */
  async copyToClipboard(options = {}) {
    const canvas = this.renderExportCanvas({ ...options, format: 'png', scale: options.scale || 1.0 });

    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          reject(new Error('Failed to generate image blob.'));
          return;
        }

        try {
          if (navigator.clipboard && navigator.clipboard.write) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            resolve(true);
          } else {
            reject(new Error('Clipboard API not supported.'));
          }
        } catch (err) {
          reject(err);
        }
      }, 'image/png');
    });
  }

  /**
   * Update modal preview canvas
   */
  updateModalPreview(previewCanvas, options = {}) {
    if (!previewCanvas) return;
    const canvas = this.renderExportCanvas(options);

    previewCanvas.width = canvas.width;
    previewCanvas.height = canvas.height;
    const ctx = previewCanvas.getContext('2d');
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    ctx.drawImage(canvas, 0, 0);

    // Calculate approx file size
    const estKB = Math.round((canvas.width * canvas.height * 4 * (options.quality || 0.8)) / 1024 / 4);
    return {
      width: canvas.width,
      height: canvas.height,
      estimatedKB: Math.max(10, estKB)
    };
  }
}


/* --- MODULE: canvas-engine.js --- */
/**
 * MediaStudio — Canvas Engine
 * Master viewport renderer, coordinate transformation, pan & zoom, high-DPI scaling, rulers, and composition pipeline.
 */
class CanvasEngine {
  constructor(app) {
    this.app = app;

    // Canvas Artboard Dimensions
    this.width = 1920;
    this.height = 1080;
    this.backgroundColor = '#ffffff';
    this.isTransparent = false;

    // Viewport Pan & Zoom
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.minZoom = 0.05;
    this.maxZoom = 32.0;

    // DOM Elements
    this.viewportContainer = document.getElementById('viewport-container');
    this.viewportSurface = document.getElementById('viewport-surface');
    this.artboardContainer = document.getElementById('artboard-container');
    this.artboardBox = document.getElementById('artboard-box');
    this.artboardCheckerboard = document.getElementById('artboard-checkerboard');
    this.mainCanvas = document.getElementById('main-canvas');
    this.overlayCanvas = document.getElementById('overlay-canvas');
    this.rulerH = document.getElementById('ruler-horizontal');
    this.rulerV = document.getElementById('ruler-vertical');

    // Pan state
    this.isPanning = false;
    this.panStartMouse = { x: 0, y: 0 };
    this.panStartOffset = { x: 0, y: 0 };
    this.isSpacePressed = false;

    // Render scheduling
    this.renderScheduled = false;
    this.dpr = window.devicePixelRatio || 1;

    // Current mouse pos
    this.currentMousePos = { clientX: 0, clientY: 0, worldX: 0, worldY: 0 };

    this._initDom();
    this._attachEventListeners();
  }

  _initDom() {
    this.resizeCanvas(this.width, this.height, false);
    this.fitCanvasToViewport();
  }

  _attachEventListeners() {
    // Window Resize
    window.addEventListener('resize', () => {
      this.dpr = window.devicePixelRatio || 1;
      this.updateRulers();
      this.requestRender();
    });

    // Viewport Mouse & Pointer Events
    this.viewportSurface.addEventListener('pointerdown', (e) => this._onPointerDown(e));
    window.addEventListener('pointermove', (e) => this._onPointerMove(e));
    window.addEventListener('pointerup', (e) => this._onPointerUp(e));

    // Mouse Wheel (Zoom & Pan)
    this.viewportSurface.addEventListener('wheel', (e) => this._onWheel(e), { passive: false });

    // Track cursor on rulers
    this.viewportSurface.addEventListener('mousemove', (e) => {
      const world = this.screenToWorld(e.clientX, e.clientY);
      this.currentMousePos = { clientX: e.clientX, clientY: e.clientY, worldX: world.x, worldY: world.y };
      this.updateRulers();
      this.app.updateStatusCoords(world.x, world.y);
    });

    // Multi-touch gestures (Pinch-to-zoom and two-finger pan)
    let touchStartDist = 0;
    let touchStartZoom = 1;
    let touchStartCenter = { x: 0, y: 0 };
    let touchStartPan = { x: 0, y: 0 };

    this.viewportSurface.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        touchStartDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        touchStartZoom = this.zoom;
        touchStartCenter = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2
        };
        touchStartPan = { x: this.panX, y: this.panY };
      }
    }, { passive: false });

    this.viewportSurface.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && touchStartDist > 0) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const scale = currentDist / touchStartDist;
        const currentCenter = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2
        };
        const dx = currentCenter.x - touchStartCenter.x;
        const dy = currentCenter.y - touchStartCenter.y;

        this.panX = touchStartPan.x + dx;
        this.panY = touchStartPan.y + dy;
        this.setZoom(touchStartZoom * scale, currentCenter.x, currentCenter.y);
      }
    }, { passive: false });

    this.viewportSurface.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) {
        touchStartDist = 0;
      }
    });

    // Spacebar Key Handlers for Hand Tool Pan
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !this.isSpacePressed && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        this.isSpacePressed = true;
        this.updateCursor();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.isSpacePressed = false;
        this.updateCursor();
      }
    });
  }

  /* ==========================================================================
     COORDINATE CONVERSION & MATRICES
     ========================================================================== */

  /**
   * Convert Screen / Client (px) to Artboard World (px)
   */
  screenToWorld(clientX, clientY) {
    const rect = this.viewportSurface.getBoundingClientRect();
    const surfaceX = clientX - rect.left;
    const surfaceY = clientY - rect.top;

    const worldX = (surfaceX - this.panX) / this.zoom;
    const worldY = (surfaceY - this.panY) / this.zoom;

    return { x: worldX, y: worldY };
  }

  /**
   * Convert Artboard World (px) to Screen (px)
   */
  worldToScreen(worldX, worldY) {
    const rect = this.viewportSurface.getBoundingClientRect();
    return {
      clientX: rect.left + this.panX + worldX * this.zoom,
      clientY: rect.top + this.panY + worldY * this.zoom
    };
  }

  /* ==========================================================================
     PAN & ZOOM MANAGEMENT
     ========================================================================== */

  setZoom(newZoom, centerX = null, centerY = null) {
    const clamped = Math.max(this.minZoom, Math.min(this.maxZoom, newZoom));
    if (Math.abs(this.zoom - clamped) < 0.0001) return;

    const rect = this.viewportSurface.getBoundingClientRect();
    const cx = centerX !== null ? centerX - rect.left : rect.width / 2;
    const cy = centerY !== null ? centerY - rect.top : rect.height / 2;

    // Zoom towards point
    const worldX = (cx - this.panX) / this.zoom;
    const worldY = (cy - this.panY) / this.zoom;

    this.zoom = clamped;
    this.panX = cx - worldX * this.zoom;
    this.panY = cy - worldY * this.zoom;

    this.applyTransform();
    this.updateRulers();
    this.app.syncZoomUI(this.zoom);
    this.requestRender();
  }

  zoomIn() {
    this.setZoom(this.zoom * 1.25);
  }

  zoomOut() {
    this.setZoom(this.zoom / 1.25);
  }

  zoomTo(zoomPercent) {
    this.setZoom(zoomPercent / 100);
  }

  fitCanvasToViewport() {
    const rect = this.viewportSurface.getBoundingClientRect();
    const padding = 60;
    const availW = Math.max(100, rect.width - padding * 2);
    const availH = Math.max(100, rect.height - padding * 2);

    const scaleW = availW / this.width;
    const scaleH = availH / this.height;
    const fitZoom = Math.min(scaleW, scaleH, 1.0); // Don't exceed 100% on initial fit unless requested

    this.zoom = Math.max(this.minZoom, fitZoom);
    this.panX = (rect.width - this.width * this.zoom) / 2;
    this.panY = (rect.height - this.height * this.zoom) / 2;

    this.applyTransform();
    this.updateRulers();
    this.app.syncZoomUI(this.zoom);
    this.requestRender();
  }

  centerCanvas() {
    const rect = this.viewportSurface.getBoundingClientRect();
    this.panX = (rect.width - this.width * this.zoom) / 2;
    this.panY = (rect.height - this.height * this.zoom) / 2;

    this.applyTransform();
    this.updateRulers();
    this.requestRender();
  }

  startPan(clientX, clientY) {
    this.isPanning = true;
    this.panStartMouse = { x: clientX, y: clientY };
    this.panStartOffset = { x: this.panX, y: this.panY };
    this.setCursor('grabbing');
  }

  updatePan(clientX, clientY) {
    if (!this.isPanning) return;
    const dx = clientX - this.panStartMouse.x;
    const dy = clientY - this.panStartMouse.y;
    this.panX = this.panStartOffset.x + dx;
    this.panY = this.panStartOffset.y + dy;

    this.applyTransform();
    this.updateRulers();
  }

  endPan() {
    this.isPanning = false;
    this.updateCursor();
  }

  applyTransform() {
    // Transform Artboard Container
    this.artboardContainer.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
  }

  _onWheel(e) {
    e.preventDefault();

    if (e.ctrlKey || e.metaKey) {
      // Zoom with wheel
      const zoomFactor = Math.pow(0.995, e.deltaY);
      this.setZoom(this.zoom * zoomFactor, e.clientX, e.clientY);
    } else {
      // Pan with wheel
      this.panX -= e.deltaX;
      this.panY -= e.deltaY;
      this.applyTransform();
      this.updateRulers();
      this.requestRender();
    }
  }

  _onPointerDown(e) {
    const world = this.screenToWorld(e.clientX, e.clientY);
    this.app.toolEngine.onPointerDown(world.x, world.y, e);
  }

  _onPointerMove(e) {
    const world = this.screenToWorld(e.clientX, e.clientY);
    this.app.toolEngine.onPointerMove(world.x, world.y, e);
  }

  _onPointerUp(e) {
    const world = this.screenToWorld(e.clientX, e.clientY);
    this.app.toolEngine.onPointerUp(world.x, world.y, e);
  }

  /* ==========================================================================
     CANVAS SIZING & RESIZE
     ========================================================================== */

  resizeCanvas(newWidth, newHeight, scaleContent = false) {
    const prevW = this.width;
    const prevH = this.height;

    this.width = Math.max(50, Math.round(newWidth));
    this.height = Math.max(50, Math.round(newHeight));

    // Update DOM containers
    this.artboardBox.style.width = `${this.width}px`;
    this.artboardBox.style.height = `${this.height}px`;

    // Scale canvas elements
    this.mainCanvas.width = this.width;
    this.mainCanvas.height = this.height;

    this.overlayCanvas.width = this.width;
    this.overlayCanvas.height = this.height;

    // Scale content if requested
    if (scaleContent && prevW > 0 && prevH > 0) {
      const scaleX = this.width / prevW;
      const scaleY = this.height / prevH;

      for (const layer of this.app.layers) {
        layer.x = Math.round(layer.x * scaleX);
        layer.y = Math.round(layer.y * scaleY);
        layer.width = Math.round(layer.width * scaleX);
        layer.height = Math.round(layer.height * scaleY);
        if (layer.type === 'drawing') {
          layer.initCanvas();
        }
      }
    }

    this.updateBackgroundStyle();
    this.app.syncCanvasSizeUI(this.width, this.height);
    this.requestRender();
  }

  setBackground(color, isTransparent = false) {
    this.backgroundColor = color;
    this.isTransparent = isTransparent;
    this.updateBackgroundStyle();
    this.requestRender();
  }

  updateBackgroundStyle() {
    if (this.isTransparent) {
      this.artboardCheckerboard.style.backgroundColor = 'transparent';
    } else {
      this.artboardCheckerboard.style.backgroundColor = this.backgroundColor;
    }
  }

  /* ==========================================================================
     COMPOSITION & RENDERING PIPELINE
     ========================================================================== */

  requestRender() {
    if (!this.renderScheduled) {
      this.renderScheduled = true;
      requestAnimationFrame(() => {
        this.renderScheduled = false;
        this.render();
      });
    }
  }

  render() {
    const mainCtx = this.mainCanvas.getContext('2d');
    const overlayCtx = this.overlayCanvas.getContext('2d');

    // 1. Clear canvases
    mainCtx.clearRect(0, 0, this.width, this.height);
    overlayCtx.clearRect(0, 0, this.width, this.height);

    // 2. Draw background on main canvas if not transparent
    if (!this.isTransparent) {
      mainCtx.fillStyle = this.backgroundColor;
      mainCtx.fillRect(0, 0, this.width, this.height);
    }

    // 3. Render all visible layers in stack order (bottom to top)
    for (const layer of this.app.layers) {
      if (layer.visible) {
        layer.render(mainCtx);
      }
    }

    // 4. Render Grid on overlay if enabled
    if (this.app.showGrid) {
      this.renderGrid(overlayCtx);
    }

    // 5. Render Transform handles & guides for selected layer
    if (this.app.selectedLayer && this.app.toolEngine.activeTool === 'select') {
      this.app.transformEngine.renderOverlay(
        overlayCtx,
        [this.app.selectedLayer],
        this.width,
        this.height
      );
    }

    // 6. Render Marquee selection box
    this.app.toolEngine.renderMarquee(overlayCtx);

    // 7. Render Crop overlay
    this.app.toolEngine.renderCropOverlay(overlayCtx);
  }

  renderGrid(ctx) {
    const gridSize = 40;
    const zoom = this.zoom;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1 / zoom;

    ctx.beginPath();
    for (let x = 0; x <= this.width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
    }
    for (let y = 0; y <= this.height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  /* ==========================================================================
     INTERACTIVE RULERS
     ========================================================================== */

  updateRulers() {
    if (!this.rulerH || !this.rulerV || !this.app.showRulers) return;

    const rect = this.viewportSurface.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // Resize ruler canvases to viewport size
    if (this.rulerH.width !== w) this.rulerH.width = w;
    if (this.rulerV.height !== h) this.rulerV.height = h;

    const ctxH = this.rulerH.getContext('2d');
    const ctxV = this.rulerV.getContext('2d');

    ctxH.clearRect(0, 0, w, 20);
    ctxV.clearRect(0, 0, 20, h);

    // Styling
    ctxH.fillStyle = '#18181b';
    ctxH.fillRect(0, 0, w, 20);
    ctxV.fillStyle = '#18181b';
    ctxV.fillRect(0, 0, 20, h);

    ctxH.strokeStyle = '#3f3f46';
    ctxV.strokeStyle = '#3f3f46';
    ctxH.fillStyle = '#71717a';
    ctxV.fillStyle = '#71717a';
    ctxH.font = '9px "Fira Code", monospace';
    ctxV.font = '9px "Fira Code", monospace';

    // Step calculation based on zoom
    let step = 100;
    if (this.zoom > 3.0) step = 10;
    else if (this.zoom > 1.5) step = 25;
    else if (this.zoom > 0.6) step = 50;
    else if (this.zoom > 0.3) step = 100;
    else step = 200;

    // Horizontal Ruler
    const startWorldX = Math.floor((-this.panX / this.zoom) / step) * step;
    const endWorldX = Math.ceil(((w - this.panX) / this.zoom) / step) * step;

    for (let x = startWorldX; x <= endWorldX; x += step) {
      const screenX = this.panX + x * this.zoom;
      if (screenX < 0 || screenX > w) continue;

      ctxH.beginPath();
      ctxH.moveTo(screenX, 12);
      ctxH.lineTo(screenX, 20);
      ctxH.stroke();

      if (x % (step * 2) === 0) {
        ctxH.fillText(`${x}`, screenX + 2, 10);
      }
    }

    // Vertical Ruler
    const startWorldY = Math.floor((-this.panY / this.zoom) / step) * step;
    const endWorldY = Math.ceil(((h - this.panY) / this.zoom) / step) * step;

    for (let y = startWorldY; y <= endWorldY; y += step) {
      const screenY = this.panY + y * this.zoom;
      if (screenY < 0 || screenY > h) continue;

      ctxV.beginPath();
      ctxV.moveTo(12, screenY);
      ctxV.lineTo(20, screenY);
      ctxV.stroke();

      if (y % (step * 2) === 0) {
        ctxV.save();
        ctxV.translate(10, screenY + 2);
        ctxV.rotate(-Math.PI / 2);
        ctxV.fillText(`${y}`, 0, 0);
        ctxV.restore();
      }
    }

    // Cursor Track Ticks on Rulers
    const curScreenX = this.panX + this.currentMousePos.worldX * this.zoom;
    const curScreenY = this.panY + this.currentMousePos.worldY * this.zoom;

    ctxH.strokeStyle = '#3b82f6';
    ctxH.lineWidth = 1;
    ctxH.beginPath();
    ctxH.moveTo(curScreenX, 0);
    ctxH.lineTo(curScreenX, 20);
    ctxH.stroke();

    ctxV.strokeStyle = '#3b82f6';
    ctxV.lineWidth = 1;
    ctxV.beginPath();
    ctxV.moveTo(0, curScreenY);
    ctxV.lineTo(20, curScreenY);
    ctxV.stroke();
  }

  /* ==========================================================================
     CURSORS
     ========================================================================== */

  setCursor(cursorStyle) {
    this.viewportSurface.style.cursor = cursorStyle;
  }

  updateCursor() {
    if (this.isSpacePressed || this.app.toolEngine.activeTool === 'hand') {
      this.setCursor(this.isPanning ? 'grabbing' : 'grab');
      return;
    }

    switch (this.app.toolEngine.activeTool) {
      case 'select':
        this.setCursor('default');
        break;
      case 'crop':
        this.setCursor('crosshair');
        break;
      case 'brush':
      case 'eraser':
        this.setCursor('crosshair');
        break;
      case 'text':
        this.setCursor('text');
        break;
      case 'shape':
        this.setCursor('crosshair');
        break;
      case 'eyedropper':
        this.setCursor('crosshair');
        break;
      default:
        this.setCursor('default');
        break;
    }
  }
}


/* --- MODULE: app.js --- */
/**
 * MediaStudio — Main Application Coordinator
 */









class MediaStudioApp {
  constructor() {
    // Core state
    this.projectName = 'Untitled Project';
    this.layers = [];
    this.selectedLayer = null;
    this.activeTab = 'properties';

    // Settings
    this.showRulers = true;
    this.showGrid = false;
    this.snapToGuides = true;
    this.lockAspectRatio = true;

    // Palette Colors
    this.primaryColor = '#3b82f6';
    this.secondaryColor = '#ffffff';

    // Subsystems
    this.historyEngine = new HistoryEngine();
    this.canvasEngine = new CanvasEngine(this);
    this.toolEngine = new ToolEngine(this.canvasEngine, this);
    this.transformEngine = new TransformEngine(this.canvasEngine);
    this.exportEngine = new ExportEngine(this);

    this.init();
  }

  async init() {
    this._bindDomElements();
    this._bindDropdownMenus();
    this._bindToolbarButtons();
    this._bindInspectorControls();
    this._bindLayersPanelEvents();
    this._bindModals();
    this._bindKeyboardShortcuts();
    this._bindDragAndDropAndPaste();
    this._initFilterPresetsUI();
    this._initSampleMediaUI();
    this._initTemplatesUI();

    // History listener for undo/redo UI updates
    this.historyEngine.subscribe((state) => this._onHistoryChange(state));

    // Load initial template / project
    await this.loadInitialProject();

    this.showToast('Welcome to MediaStudio!');
  }

  /* ==========================================================================
     PROJECT & LAYER STATE
     ========================================================================== */

  async loadInitialProject() {
    // Create initial attractive canvas with sample background and typography
    this.canvasEngine.resizeCanvas(1920, 1080, false);
    this.canvasEngine.setBackground('#0d0f17', false);

    // 1. Add background sample graphic
    const bgShape = new ShapeLayer({
      name: 'Gradient Accent',
      shapeType: 'rounded-rect',
      x: 360,
      y: 180,
      width: 1200,
      height: 720,
      cornerRadius: 32,
      fillType: 'linear-gradient',
      gradientConfig: {
        c1: '#3b82f6',
        c2: '#8b5cf6',
        angle: 45
      },
      opacity: 0.85
    });
    this.addLayer(bgShape, false);

    // 2. Add title text
    const titleText = new TextLayer({
      name: 'Title Text',
      text: 'CREATIVE STUDIO',
      fontFamily: 'Montserrat',
      fontSize: 84,
      fontWeight: '800',
      fillColor: '#ffffff',
      letterSpacing: 6,
      textAlign: 'center',
      x: 460,
      y: 380,
      shadow: { enabled: true, color: 'rgba(0,0,0,0.5)', blur: 16, offsetX: 0, offsetY: 8 }
    });
    this.addLayer(titleText, false);

    // 3. Add subtitle text
    const subText = new TextLayer({
      name: 'Subtitle',
      text: 'Next-Generation Browser Image Editor',
      fontFamily: 'Inter',
      fontSize: 32,
      fontWeight: '400',
      fillColor: '#93c5fd',
      letterSpacing: 2,
      textAlign: 'center',
      x: 580,
      y: 500
    });
    this.addLayer(subText, false);

    // 4. Add small badge shape
    const starShape = new ShapeLayer({
      name: 'Star Badge',
      shapeType: 'star',
      x: 910,
      y: 280,
      width: 100,
      height: 100,
      starPoints: 6,
      fillColor: '#f59e0b'
    });
    this.addLayer(starShape, false);

    this.selectLayer(titleText);
    this.recordHistory('Initial Setup');
    this.canvasEngine.fitCanvasToViewport();
  }

  addLayer(layer, record = true) {
    this.layers.push(layer);
    this.selectLayer(layer);
    this.renderLayersList();
    this.canvasEngine.requestRender();

    if (record) {
      this.recordHistory(`Add ${layer.name}`);
      this.triggerAutoSave();
    }
  }

  selectLayer(layer) {
    this.selectedLayer = layer;
    this.renderLayersList();
    this.syncPropertiesUI();
    this.canvasEngine.requestRender();

    const infoEl = document.getElementById('status-selected-text');
    if (infoEl) {
      if (layer) {
        infoEl.textContent = `${layer.name} (${layer.type}) — ${layer.width} × ${layer.height} px`;
      } else {
        infoEl.textContent = 'No layer selected (Document)';
      }
    }
  }

  deleteSelectedLayer() {
    if (!this.selectedLayer) return;
    const index = this.layers.indexOf(this.selectedLayer);
    if (index !== -1) {
      const name = this.selectedLayer.name;
      this.layers.splice(index, 1);
      this.selectedLayer = this.layers[Math.max(0, index - 1)] || null;
      this.renderLayersList();
      this.syncPropertiesUI();
      this.canvasEngine.requestRender();
      this.recordHistory(`Delete ${name}`);
      this.triggerAutoSave();
      this.showToast(`Deleted ${name}`);
    }
  }

  duplicateSelectedLayer() {
    if (!this.selectedLayer) return;
    const src = this.selectedLayer;
    const json = src.toJSON();
    json.id = 'layer_' + Math.random().toString(36).substr(2, 9);
    json.name = `${src.name} Copy`;
    json.x += 30;
    json.y += 30;

    let dupLayer;
    if (src.type === 'image') {
      dupLayer = new ImageLayer({ ...json, image: src.image });
    } else if (src.type === 'text') {
      dupLayer = TextLayer.fromJSON(json);
    } else if (src.type === 'shape') {
      dupLayer = ShapeLayer.fromJSON(json);
    } else if (src.type === 'drawing') {
      dupLayer = DrawingLayer.fromJSON(json);
    }

    if (dupLayer) {
      this.addLayer(dupLayer);
      this.showToast(`Duplicated ${src.name}`);
    }
  }

  moveLayerOrder(direction) {
    if (!this.selectedLayer) return;
    const index = this.layers.indexOf(this.selectedLayer);
    if (index === -1) return;

    if (direction === 'up' && index < this.layers.length - 1) {
      const temp = this.layers[index];
      this.layers[index] = this.layers[index + 1];
      this.layers[index + 1] = temp;
      this.renderLayersList();
      this.canvasEngine.requestRender();
      this.recordHistory('Move Layer Up');
      this.triggerAutoSave();
    } else if (direction === 'down' && index > 0) {
      const temp = this.layers[index];
      this.layers[index] = this.layers[index - 1];
      this.layers[index - 1] = temp;
      this.renderLayersList();
      this.canvasEngine.requestRender();
      this.recordHistory('Move Layer Down');
      this.triggerAutoSave();
    }
  }

  mergeDownSelectedLayer() {
    if (!this.selectedLayer) return;
    const index = this.layers.indexOf(this.selectedLayer);
    if (index <= 0) return; // Cannot merge bottom-most layer

    const topLayer = this.layers[index];
    const bottomLayer = this.layers[index - 1];

    // Compute bounding box encompassing both
    const b1 = topLayer.getAxisAlignedBounds();
    const b2 = bottomLayer.getAxisAlignedBounds();
    const minX = Math.min(b1.x, b2.x);
    const minY = Math.min(b1.y, b2.y);
    const maxX = Math.max(b1.x + b1.width, b2.x + b2.width);
    const maxY = Math.max(b1.y + b1.height, b2.y + b2.height);
    const mergeW = Math.max(50, Math.ceil(maxX - minX));
    const mergeH = Math.max(50, Math.ceil(maxY - minY));

    // Render both to offscreen canvas
    const mergeCanvas = document.createElement('canvas');
    mergeCanvas.width = mergeW;
    mergeCanvas.height = mergeH;
    const mCtx = mergeCanvas.getContext('2d');

    mCtx.save();
    mCtx.translate(-minX, -minY);
    bottomLayer.render(mCtx);
    topLayer.render(mCtx);
    mCtx.restore();

    const mergedImg = new Image();
    mergedImg.src = mergeCanvas.toDataURL('image/png');

    const newMergedLayer = new ImageLayer({
      name: `Merged (${bottomLayer.name} + ${topLayer.name})`,
      image: mergedImg,
      x: minX,
      y: minY,
      width: mergeW,
      height: mergeH
    });

    this.layers.splice(index - 1, 2, newMergedLayer);
    this.selectLayer(newMergedLayer);
    this.renderLayersList();
    this.canvasEngine.requestRender();
    this.recordHistory('Merge Layers Down');
    this.showToast('Merged layers down');
  }

  getTopLayerAt(worldX, worldY) {
    for (let i = this.layers.length - 1; i >= 0; i--) {
      const layer = this.layers[i];
      if (layer.visible && layer.containsPoint(worldX, worldY)) {
        return layer;
      }
    }
    return null;
  }

  /* ==========================================================================
     HISTORY & PERSISTENCE
     ========================================================================== */

  recordHistory(actionName = 'Edit') {
    const serialized = this.serializeProject();
    this.historyEngine.pushState(serialized, actionName);
    this.triggerAutoSave();
  }

  _onHistoryChange(state) {
    // Update Undo / Redo Buttons
    const undoBtn = document.getElementById('btn-quick-undo');
    const redoBtn = document.getElementById('btn-quick-redo');
    if (undoBtn) undoBtn.disabled = !state.canUndo;
    if (redoBtn) redoBtn.disabled = !state.canRedo;

    // Render History Timeline list
    this.renderHistoryList(state);
  }

  renderHistoryList(state) {
    const listEl = document.getElementById('history-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    state.stack.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = `history-item ${idx === state.currentIndex ? 'active' : (idx > state.currentIndex ? 'undone' : '')}`;
      el.innerHTML = `
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span>${item.actionName}</span>
      `;
      el.addEventListener('click', () => {
        const targetState = this.historyEngine.jumpTo(idx);
        if (targetState) {
          this.deserializeProject(targetState);
        }
      });
      listEl.appendChild(el);
    });

    listEl.scrollTop = listEl.scrollHeight;
  }

  undo() {
    const prevState = this.historyEngine.undo();
    if (prevState) {
      this.deserializeProject(prevState);
      this.showToast('Undo');
    }
  }

  redo() {
    const nextState = this.historyEngine.redo();
    if (nextState) {
      this.deserializeProject(nextState);
      this.showToast('Redo');
    }
  }

  serializeProject() {
    return {
      version: 1,
      name: this.projectName,
      width: this.canvasEngine.width,
      height: this.canvasEngine.height,
      backgroundColor: this.canvasEngine.backgroundColor,
      isTransparent: this.canvasEngine.isTransparent,
      layers: this.layers.map(l => l.toJSON()),
      selectedLayerId: this.selectedLayer ? this.selectedLayer.id : null
    };
  }

  async deserializeProject(data) {
    this.historyEngine.isApplyingHistory = true;

    this.projectName = data.name || 'Untitled Project';
    const nameInput = document.getElementById('project-name-input');
    if (nameInput) nameInput.value = this.projectName;

    this.canvasEngine.resizeCanvas(data.width || 1920, data.height || 1080, false);
    this.canvasEngine.setBackground(data.backgroundColor || '#ffffff', data.isTransparent || false);

    // Rebuild layers
    const reconstructedLayers = [];
    if (Array.isArray(data.layers)) {
      for (const lData of data.layers) {
        if (lData.type === 'image') {
          const imgLayer = await ImageLayer.fromJSON(lData);
          reconstructedLayers.push(imgLayer);
        } else if (lData.type === 'text') {
          reconstructedLayers.push(TextLayer.fromJSON(lData));
        } else if (lData.type === 'shape') {
          reconstructedLayers.push(ShapeLayer.fromJSON(lData));
        } else if (lData.type === 'drawing') {
          reconstructedLayers.push(DrawingLayer.fromJSON(lData));
        }
      }
    }

    this.layers = reconstructedLayers;
    this.selectedLayer = this.layers.find(l => l.id === data.selectedLayerId) || this.layers[this.layers.length - 1] || null;

    this.renderLayersList();
    this.syncPropertiesUI();
    this.canvasEngine.requestRender();

    this.historyEngine.isApplyingHistory = false;
  }

  triggerAutoSave() {
    storageEngine.queueAutoSave(
      () => {
        const thumb = this.exportEngine.renderExportCanvas({ scale: 0.2, format: 'jpeg', quality: 0.6 });
        return {
          ...this.serializeProject(),
          thumbnail: thumb.toDataURL('image/jpeg', 0.6)
        };
      },
      (status) => {
        const indicator = document.getElementById('save-status-indicator');
        if (indicator) {
          indicator.className = `save-status-indicator ${status}`;
          indicator.textContent = status === 'saving' ? 'Saving...' : 'Saved';
        }
      }
    );
  }

  /* ==========================================================================
     IMAGE IMPORT & CLIPBOARD
     ========================================================================== */

  async importImageFromFile(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('Invalid image file.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Fit image to canvas or create nicely sized layer
          let w = img.naturalWidth || img.width;
          let h = img.naturalHeight || img.height;

          const maxW = this.canvasEngine.width * 0.9;
          const maxH = this.canvasEngine.height * 0.9;

          if (w > maxW || h > maxH) {
            const ratio = Math.min(maxW / w, maxH / h);
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);
          }

          const x = Math.round((this.canvasEngine.width - w) / 2);
          const y = Math.round((this.canvasEngine.height - h) / 2);

          const newLayer = new ImageLayer({
            name: file.name.replace(/\.[^/.]+$/, '') || 'Imported Image',
            image: img,
            src: e.target.result,
            x,
            y,
            width: w,
            height: h
          });

          this.addLayer(newLayer);
          this.showToast(`Imported ${newLayer.name}`);
          resolve(newLayer);
        };
        img.onerror = () => reject(new Error('Failed to load image.'));
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async importImageFromUrl(url, title = 'Stock Image') {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    this.showToast('Loading image...');

    await new Promise((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => {
        // Fallback procedural canvas
        img.src = createProceduralGradientDataUrl(1280, 720);
        resolve();
      };
      img.src = url;
    });

    let w = img.naturalWidth || 1280;
    let h = img.naturalHeight || 720;
    const maxW = this.canvasEngine.width * 0.85;
    const maxH = this.canvasEngine.height * 0.85;

    if (w > maxW || h > maxH) {
      const ratio = Math.min(maxW / w, maxH / h);
      w = Math.round(w * ratio);
      h = Math.round(h * ratio);
    }

    const newLayer = new ImageLayer({
      name: title,
      image: img,
      src: img.src,
      x: Math.round((this.canvasEngine.width - w) / 2),
      y: Math.round((this.canvasEngine.height - h) / 2),
      width: w,
      height: h
    });

    this.addLayer(newLayer);
    this.showToast(`Added ${title}`);
  }

  /* ==========================================================================
     COLOR & PALETTE MANAGEMENT
     ========================================================================== */

  setPrimaryColor(colorHex) {
    this.primaryColor = colorHex;
    const preview = document.getElementById('primary-color-preview');
    const input = document.getElementById('primary-color-input');
    if (preview) preview.style.backgroundColor = colorHex;
    if (input) input.value = colorHex;

    // Apply color to selected text or shape layer
    if (this.selectedLayer) {
      if (this.selectedLayer.type === 'text') {
        this.selectedLayer.fillColor = colorHex;
        this.syncPropertiesUI();
        this.canvasEngine.requestRender();
      } else if (this.selectedLayer.type === 'shape') {
        this.selectedLayer.fillColor = colorHex;
        this.syncPropertiesUI();
        this.canvasEngine.requestRender();
      }
    }
  }

  setSecondaryColor(colorHex) {
    this.secondaryColor = colorHex;
    const preview = document.getElementById('secondary-color-preview');
    const input = document.getElementById('secondary-color-input');
    if (preview) preview.style.backgroundColor = colorHex;
    if (input) input.value = colorHex;
  }

  swapColors() {
    const temp = this.primaryColor;
    this.setPrimaryColor(this.secondaryColor);
    this.setSecondaryColor(temp);
  }

  /* ==========================================================================
     DOM UI BINDINGS & EVENT LISTENERS
     ========================================================================== */

  _bindDomElements() {
    // Project Name Input
    const nameInput = document.getElementById('project-name-input');
    if (nameInput) {
      nameInput.addEventListener('change', (e) => {
        this.projectName = e.target.value.trim() || 'Untitled Project';
        this.triggerAutoSave();
      });
    }

    // Sidebar Tabs
    const tabBtns = document.querySelectorAll('.sidebar-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.sidebar-tab-pane').forEach(p => p.classList.remove('active'));
        const pane = document.getElementById(`pane-${tab}`);
        if (pane) pane.classList.add('active');
        this.activeTab = tab;
      });
    });

    // Primary & Secondary Color Pickers
    const pTrigger = document.getElementById('primary-color-picker-trigger');
    const pInput = document.getElementById('primary-color-input');
    if (pTrigger && pInput) {
      pTrigger.addEventListener('click', () => pInput.click());
      pInput.addEventListener('input', (e) => this.setPrimaryColor(e.target.value));
    }

    const sTrigger = document.getElementById('secondary-color-picker-trigger');
    const sInput = document.getElementById('secondary-color-input');
    if (sTrigger && sInput) {
      sTrigger.addEventListener('click', () => sInput.click());
      sInput.addEventListener('input', (e) => this.setSecondaryColor(e.target.value));
    }

    const swapBtn = document.getElementById('btn-swap-colors');
    if (swapBtn) swapBtn.addEventListener('click', () => this.swapColors());
  }

  _bindDropdownMenus() {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const menuId = btn.dataset.dropdown;
        const panel = document.getElementById(menuId);
        if (!panel) return;
        const isShown = panel.classList.contains('show');

        document.querySelectorAll('.dropdown-panel').forEach(p => p.classList.remove('show'));
        if (!isShown) panel.classList.add('show');
      });
    });

    // Close dropdowns when clicking menu item
    document.querySelectorAll('.dropdown-panel .menu-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-panel').forEach(p => p.classList.remove('show'));
      });
    });

    window.addEventListener('click', () => {
      document.querySelectorAll('.dropdown-panel').forEach(p => p.classList.remove('show'));
      document.querySelectorAll('.tool-flyout').forEach(f => f.classList.remove('show'));
    });
  }

  _bindToolbarButtons() {
    // Left Tool Buttons
    const toolBtns = document.querySelectorAll('.tool-btn');
    toolBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tool = btn.dataset.tool;
        if (!tool) return;

        // Shape flyout menu
        if (tool === 'shape') {
          const flyout = document.getElementById('shape-flyout');
          flyout.classList.toggle('show');
          this.toolEngine.setTool('shape');
        } else {
          this.toolEngine.setTool(tool);
        }

        toolBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.updateToolHint(tool);
      });
    });

    // Flyout Shape Options
    const shapeFlyoutBtns = document.querySelectorAll('.flyout-btn');
    shapeFlyoutBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const shape = btn.dataset.shape;
        this.toolEngine.setShapeType(shape);

        shapeFlyoutBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('shape-flyout').classList.remove('show');
        this.updateToolHint('shape', shape);
      });
    });

    // Top Action Buttons
    document.getElementById('btn-quick-undo')?.addEventListener('click', () => this.undo());
    document.getElementById('btn-quick-redo')?.addEventListener('click', () => this.redo());
    document.getElementById('menu-undo')?.addEventListener('click', () => this.undo());
    document.getElementById('menu-redo')?.addEventListener('click', () => this.redo());

    document.getElementById('menu-delete')?.addEventListener('click', () => this.deleteSelectedLayer());
    document.getElementById('menu-duplicate')?.addEventListener('click', () => this.duplicateSelectedLayer());
    document.getElementById('menu-cut')?.addEventListener('click', () => this.cutSelectedLayer());
    document.getElementById('menu-copy')?.addEventListener('click', () => this.copySelectedLayer());
    document.getElementById('menu-paste')?.addEventListener('click', () => this.pasteLayer());
    document.getElementById('menu-copy-canvas-png')?.addEventListener('click', () => this.copyCanvasToClipboard());
    document.getElementById('menu-select-all')?.addEventListener('click', () => {
      if (this.layers.length > 0) {
        this.selectLayer(this.layers[this.layers.length - 1]);
        this.showToast(`Selected ${this.layers.length} layers`);
      }
    });

    // Top Add Quick Layer Buttons & File Actions
    document.getElementById('btn-open-file')?.addEventListener('click', () => {
      document.getElementById('hidden-file-input').click();
    });
    document.getElementById('btn-add-image-top')?.addEventListener('click', () => {
      document.getElementById('hidden-file-input').click();
    });

    document.getElementById('btn-add-text-top')?.addEventListener('click', () => {
      const textLayer = new TextLayer({
        name: 'Text Layer ' + (this.layers.length + 1),
        text: 'New Headline',
        x: Math.round(this.canvasEngine.width / 2 - 150),
        y: Math.round(this.canvasEngine.height / 2 - 30),
        fontSize: 54,
        fillColor: this.primaryColor
      });
      this.addLayer(textLayer);
    });

    // Responsive Sidebar Toggle
    document.getElementById('btn-toggle-sidebar')?.addEventListener('click', () => {
      document.getElementById('right-sidebar')?.classList.toggle('collapsed');
    });

    // Hidden File Import Input
    const fileInput = document.getElementById('hidden-file-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          this.importImageFromFile(e.target.files[0]);
        }
      });
    }

    // Hidden Project Import Input
    const projInput = document.getElementById('hidden-project-input');
    if (projInput) {
      projInput.addEventListener('change', async (e) => {
        if (e.target.files && e.target.files[0]) {
          try {
            const data = await storageEngine.importProjectFile(e.target.files[0]);
            await this.deserializeProject(data);
            this.recordHistory('Import Project');
            this.showToast('Project loaded successfully!');
          } catch (err) {
            alert(err.message);
          }
        }
      });
    }

    // Bottom & Menu Zoom Controls
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => this.canvasEngine.zoomIn());
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => this.canvasEngine.zoomOut());
    document.getElementById('btn-zoom-val')?.addEventListener('click', () => this.canvasEngine.zoomTo(100));
    document.getElementById('btn-zoom-fit-bottom')?.addEventListener('click', () => this.canvasEngine.fitCanvasToViewport());

    document.getElementById('menu-zoom-in')?.addEventListener('click', () => this.canvasEngine.zoomIn());
    document.getElementById('menu-zoom-out')?.addEventListener('click', () => this.canvasEngine.zoomOut());
    document.getElementById('menu-zoom-fit')?.addEventListener('click', () => this.canvasEngine.fitCanvasToViewport());
    document.getElementById('menu-zoom-100')?.addEventListener('click', () => this.canvasEngine.zoomTo(100));

    document.getElementById('btn-float-zoom-in')?.addEventListener('click', () => this.canvasEngine.zoomIn());
    document.getElementById('btn-float-zoom-out')?.addEventListener('click', () => this.canvasEngine.zoomOut());
    document.getElementById('btn-float-zoom-fit')?.addEventListener('click', () => this.canvasEngine.fitCanvasToViewport());
    document.getElementById('btn-canvas-center')?.addEventListener('click', () => this.canvasEngine.centerCanvas());

    const bottomZoomSlider = document.getElementById('bottom-zoom-slider');
    if (bottomZoomSlider) {
      bottomZoomSlider.addEventListener('input', (e) => {
        this.canvasEngine.zoomTo(parseFloat(e.target.value));
      });
    }

    // Crop Toolbar HUD buttons & Menu Crop
    document.getElementById('btn-crop-canvas-menu')?.addEventListener('click', () => this.toolEngine.setTool('crop'));
    document.getElementById('btn-crop-apply')?.addEventListener('click', () => this.toolEngine.applyCrop());
    document.getElementById('btn-crop-cancel')?.addEventListener('click', () => this.toolEngine.cancelCrop());
    document.getElementById('crop-aspect-select')?.addEventListener('change', (e) => {
      this.toolEngine.setCropAspectRatio(e.target.value);
    });

    // View Menu Toggles
    document.getElementById('toggle-rulers-check')?.addEventListener('change', (e) => {
      this.showRulers = e.target.checked;
      this.canvasEngine.viewportContainer.classList.toggle('no-rulers', !this.showRulers);
      this.canvasEngine.updateRulers();
    });

    document.getElementById('toggle-grid-check')?.addEventListener('change', (e) => {
      this.showGrid = e.target.checked;
      this.canvasEngine.requestRender();
    });

    document.getElementById('toggle-snap-check')?.addEventListener('change', (e) => {
      this.snapToGuides = e.target.checked;
    });

    // Canvas Menu Actions (Trim, Rotate, Flip)
    document.getElementById('btn-trim-canvas')?.addEventListener('click', () => this.trimCanvasToFitLayers());
    document.getElementById('btn-rotate-canvas-cw')?.addEventListener('click', () => this.rotateEntireCanvas(90));
    document.getElementById('btn-rotate-canvas-ccw')?.addEventListener('click', () => this.rotateEntireCanvas(-90));
    document.getElementById('btn-flip-canvas-h')?.addEventListener('click', () => this.flipEntireCanvas('h'));
    document.getElementById('btn-flip-canvas-v')?.addEventListener('click', () => this.flipEntireCanvas('v'));
  }

  _bindInspectorControls() {
    // 1. Canvas Dimensions & Background
    const canvasW = document.getElementById('prop-canvas-w');
    const canvasH = document.getElementById('prop-canvas-h');
    const applyCanvasSize = () => {
      const w = parseInt(canvasW.value, 10);
      const h = parseInt(canvasH.value, 10);
      if (w > 0 && h > 0) {
        this.canvasEngine.resizeCanvas(w, h, false);
        this.recordHistory('Resize Canvas');
      }
    };
    canvasW?.addEventListener('change', applyCanvasSize);
    canvasH?.addEventListener('change', applyCanvasSize);

    document.getElementById('canvas-preset-select')?.addEventListener('change', (e) => {
      const val = e.target.value;
      if (!val) return;
      const [w, h] = val.split('x').map(v => parseInt(v, 10));
      this.canvasEngine.resizeCanvas(w, h, false);
      this.recordHistory('Preset Canvas Size');
    });

    const bgCol = document.getElementById('prop-canvas-bg-color');
    const bgHex = document.getElementById('prop-canvas-bg-hex');
    const bgTrans = document.getElementById('prop-canvas-transparent');
    bgCol?.addEventListener('input', (e) => {
      bgHex.textContent = e.target.value;
      this.canvasEngine.setBackground(e.target.value, bgTrans.checked);
    });
    bgTrans?.addEventListener('change', (e) => {
      this.canvasEngine.setBackground(bgCol.value, e.target.checked);
      this.recordHistory('Canvas Background');
    });

    // Quick Add on Canvas Inspector
    document.getElementById('btn-quick-add-img')?.addEventListener('click', () => document.getElementById('hidden-file-input').click());
    document.getElementById('btn-quick-add-sample')?.addEventListener('click', () => this.openModal('modal-sample-media'));
    document.getElementById('btn-quick-add-text')?.addEventListener('click', () => document.getElementById('btn-add-text-top').click());
    document.getElementById('btn-quick-add-shape')?.addEventListener('click', () => this.toolEngine.setTool('shape'));

    // 2. Transform Controls
    const propX = document.getElementById('prop-layer-x');
    const propY = document.getElementById('prop-layer-y');
    const propW = document.getElementById('prop-layer-w');
    const propH = document.getElementById('prop-layer-h');
    const propRot = document.getElementById('prop-layer-rotation');

    const updateTransformProps = () => {
      if (!this.selectedLayer) return;
      this.selectedLayer.x = parseInt(propX.value, 10) || 0;
      this.selectedLayer.y = parseInt(propY.value, 10) || 0;
      this.selectedLayer.width = Math.max(5, parseInt(propW.value, 10) || 5);
      this.selectedLayer.height = Math.max(5, parseInt(propH.value, 10) || 5);
      this.selectedLayer.rotation = parseInt(propRot.value, 10) || 0;
      this.canvasEngine.requestRender();
      this.recordHistory('Edit Transform');
    };

    propX?.addEventListener('change', updateTransformProps);
    propY?.addEventListener('change', updateTransformProps);
    propW?.addEventListener('change', updateTransformProps);
    propH?.addEventListener('change', updateTransformProps);
    propRot?.addEventListener('change', updateTransformProps);

    // Alignment Buttons
    document.getElementById('btn-align-left')?.addEventListener('click', () => this.alignSelectedLayer('left'));
    document.getElementById('btn-align-center-h')?.addEventListener('click', () => this.alignSelectedLayer('center-h'));
    document.getElementById('btn-align-right')?.addEventListener('click', () => this.alignSelectedLayer('right'));
    document.getElementById('btn-align-top')?.addEventListener('click', () => this.alignSelectedLayer('top'));
    document.getElementById('btn-align-center-v')?.addEventListener('click', () => this.alignSelectedLayer('center-v'));
    document.getElementById('btn-align-bottom')?.addEventListener('click', () => this.alignSelectedLayer('bottom'));

    document.getElementById('btn-prop-flip-h')?.addEventListener('click', () => {
      if (!this.selectedLayer) return;
      this.selectedLayer.flipH = !this.selectedLayer.flipH;
      this.canvasEngine.requestRender();
      this.recordHistory('Flip Layer H');
    });

    document.getElementById('btn-prop-flip-v')?.addEventListener('click', () => {
      if (!this.selectedLayer) return;
      this.selectedLayer.flipV = !this.selectedLayer.flipV;
      this.canvasEngine.requestRender();
      this.recordHistory('Flip Layer V');
    });

    // Opacity & Blend Mode
    const propOpacity = document.getElementById('prop-layer-opacity');
    const propOpacityVal = document.getElementById('prop-opacity-val');
    propOpacity?.addEventListener('input', (e) => {
      if (!this.selectedLayer) return;
      this.selectedLayer.opacity = parseFloat(e.target.value) / 100;
      propOpacityVal.textContent = `${e.target.value}%`;
      this.canvasEngine.requestRender();
    });
    propOpacity?.addEventListener('change', () => this.recordHistory('Change Opacity'));

    document.getElementById('prop-layer-blend')?.addEventListener('change', (e) => {
      if (!this.selectedLayer) return;
      this.selectedLayer.blendMode = e.target.value;
      this.canvasEngine.requestRender();
      this.recordHistory('Change Blend Mode');
    });

    // 3. Text Controls
    const textContent = document.getElementById('prop-text-content');
    textContent?.addEventListener('input', (e) => {
      if (!this.selectedLayer || this.selectedLayer.type !== 'text') return;
      this.selectedLayer.text = e.target.value;
      this.selectedLayer.recalculateDimensions();
      this.syncPropertiesUI();
      this.canvasEngine.requestRender();
    });
    textContent?.addEventListener('change', () => this.recordHistory('Edit Text Content'));

    document.getElementById('prop-text-font-family')?.addEventListener('change', (e) => {
      if (!this.selectedLayer || this.selectedLayer.type !== 'text') return;
      this.selectedLayer.fontFamily = e.target.value;
      this.selectedLayer.recalculateDimensions();
      this.canvasEngine.requestRender();
      this.recordHistory('Change Font');
    });

    document.getElementById('prop-text-size')?.addEventListener('input', (e) => {
      if (!this.selectedLayer || this.selectedLayer.type !== 'text') return;
      this.selectedLayer.fontSize = parseInt(e.target.value, 10) || 48;
      this.selectedLayer.recalculateDimensions();
      this.canvasEngine.requestRender();
    });

    document.getElementById('prop-text-weight')?.addEventListener('change', (e) => {
      if (!this.selectedLayer || this.selectedLayer.type !== 'text') return;
      this.selectedLayer.fontWeight = e.target.value;
      this.selectedLayer.recalculateDimensions();
      this.canvasEngine.requestRender();
      this.recordHistory('Change Font Weight');
    });

    // Text Align
    ['l', 'c', 'r'].forEach(align => {
      const btn = document.getElementById(`btn-text-align-${align}`);
      btn?.addEventListener('click', () => {
        if (!this.selectedLayer || this.selectedLayer.type !== 'text') return;
        this.selectedLayer.textAlign = align === 'l' ? 'left' : (align === 'c' ? 'center' : 'right');
        document.querySelectorAll('.segmented-control .seg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.canvasEngine.requestRender();
        this.recordHistory('Change Text Alignment');
      });
    });

    const textColor = document.getElementById('prop-text-color');
    textColor?.addEventListener('input', (e) => {
      if (!this.selectedLayer || this.selectedLayer.type !== 'text') return;
      this.selectedLayer.fillColor = e.target.value;
      document.getElementById('prop-text-color-hex').textContent = e.target.value;
      this.canvasEngine.requestRender();
    });

    // 4. Shape Controls
    document.getElementById('prop-shape-fill-type')?.addEventListener('change', (e) => {
      if (!this.selectedLayer || this.selectedLayer.type !== 'shape') return;
      this.selectedLayer.fillType = e.target.value;
      this.syncPropertiesUI();
      this.canvasEngine.requestRender();
      this.recordHistory('Change Shape Fill');
    });

    document.getElementById('prop-shape-fill-color')?.addEventListener('input', (e) => {
      if (!this.selectedLayer || this.selectedLayer.type !== 'shape') return;
      this.selectedLayer.fillColor = e.target.value;
      document.getElementById('prop-shape-fill-hex').textContent = e.target.value;
      this.canvasEngine.requestRender();
    });

    document.getElementById('prop-shape-grad-c1')?.addEventListener('input', (e) => {
      if (!this.selectedLayer || this.selectedLayer.type !== 'shape') return;
      this.selectedLayer.gradientConfig.c1 = e.target.value;
      this.canvasEngine.requestRender();
    });
    document.getElementById('prop-shape-grad-c2')?.addEventListener('input', (e) => {
      if (!this.selectedLayer || this.selectedLayer.type !== 'shape') return;
      this.selectedLayer.gradientConfig.c2 = e.target.value;
      this.canvasEngine.requestRender();
    });
    document.getElementById('prop-shape-grad-angle')?.addEventListener('input', (e) => {
      if (!this.selectedLayer || this.selectedLayer.type !== 'shape') return;
      this.selectedLayer.gradientConfig.angle = parseInt(e.target.value, 10);
      document.getElementById('prop-shape-grad-angle-val').textContent = `${e.target.value}°`;
      this.canvasEngine.requestRender();
    });

    document.getElementById('prop-shape-stroke-color')?.addEventListener('input', (e) => {
      if (!this.selectedLayer || this.selectedLayer.type !== 'shape') return;
      this.selectedLayer.strokeColor = e.target.value;
      document.getElementById('prop-shape-stroke-hex').textContent = e.target.value;
      this.canvasEngine.requestRender();
    });

    document.getElementById('prop-shape-stroke-w')?.addEventListener('input', (e) => {
      if (!this.selectedLayer || this.selectedLayer.type !== 'shape') return;
      this.selectedLayer.strokeWidth = parseInt(e.target.value, 10);
      document.getElementById('prop-shape-stroke-w-val').textContent = `${e.target.value}px`;
      this.canvasEngine.requestRender();
    });

    document.getElementById('prop-shape-radius')?.addEventListener('input', (e) => {
      if (!this.selectedLayer || this.selectedLayer.type !== 'shape') return;
      this.selectedLayer.cornerRadius = parseInt(e.target.value, 10);
      document.getElementById('prop-shape-radius-val').textContent = `${e.target.value}px`;
      this.canvasEngine.requestRender();
    });

    // 5. Image Adjustments Sliders
    const adjKeys = ['brightness', 'contrast', 'saturation', 'exposure', 'warmth', 'blur', 'sharpen', 'vignette'];
    adjKeys.forEach(k => {
      const slider = document.getElementById(`prop-adj-${k}`);
      const valBadge = document.getElementById(`prop-adj-${k}-val`);
      if (slider && valBadge) {
        slider.addEventListener('input', (e) => {
          if (!this.selectedLayer || this.selectedLayer.type !== 'image') return;
          const num = parseInt(e.target.value, 10);
          this.selectedLayer.adjustments[k] = num;
          valBadge.textContent = k === 'blur' ? `${num}px` : `${num}`;
          this.selectedLayer.updateCache();
          this.canvasEngine.requestRender();
        });
        slider.addEventListener('change', () => this.recordHistory(`Adjust ${k}`));
      }
    });

    document.getElementById('btn-reset-image-adjustments')?.addEventListener('click', () => {
      if (!this.selectedLayer || this.selectedLayer.type !== 'image') return;
      this.selectedLayer.adjustments = {
        brightness: 0, contrast: 0, saturation: 0, exposure: 0, warmth: 0, blur: 0, sharpen: 0, vignette: 0, grayscale: 0, sepia: 0, invert: 0, hueRotate: 0
      };
      this.selectedLayer.updateCache();
      this.syncPropertiesUI();
      this.canvasEngine.requestRender();
      this.recordHistory('Reset Adjustments');
      this.showToast('Reset adjustments');
    });

    // 6. Brush Controls
    document.getElementById('prop-brush-size')?.addEventListener('input', (e) => {
      this.toolEngine.brush.size = parseInt(e.target.value, 10);
      document.getElementById('prop-brush-size-val').textContent = `${e.target.value}px`;
    });
    document.getElementById('prop-brush-opacity')?.addEventListener('input', (e) => {
      this.toolEngine.brush.opacity = parseFloat(e.target.value) / 100;
      document.getElementById('prop-brush-opacity-val').textContent = `${e.target.value}%`;
    });
    document.getElementById('btn-clear-drawing-layer')?.addEventListener('click', () => {
      if (this.selectedLayer && this.selectedLayer.type === 'drawing') {
        this.selectedLayer.clear();
        this.canvasEngine.requestRender();
        this.recordHistory('Clear Drawing');
      }
    });
  }

  _bindLayersPanelEvents() {
    // Quick add layer buttons inside layers panel
    document.getElementById('btn-new-layer-image')?.addEventListener('click', () => document.getElementById('hidden-file-input').click());
    document.getElementById('btn-new-layer-text')?.addEventListener('click', () => document.getElementById('btn-add-text-top').click());
    document.getElementById('btn-new-layer-shape')?.addEventListener('click', () => {
      const rect = new ShapeLayer({
        name: 'Rectangle ' + (this.layers.length + 1),
        shapeType: 'rectangle',
        x: Math.round(this.canvasEngine.width / 2 - 150),
        y: Math.round(this.canvasEngine.height / 2 - 100),
        width: 300,
        height: 200,
        fillColor: this.primaryColor
      });
      this.addLayer(rect);
    });
    document.getElementById('btn-new-layer-drawing')?.addEventListener('click', () => {
      const drawLayer = new DrawingLayer({
        name: 'Drawing Layer ' + (this.layers.length + 1),
        x: 0,
        y: 0,
        width: this.canvasEngine.width,
        height: this.canvasEngine.height
      });
      this.addLayer(drawLayer);
      this.toolEngine.setTool('brush');
    });

    // Layer stack reorder & actions
    document.getElementById('btn-layer-up')?.addEventListener('click', () => this.moveLayerOrder('up'));
    document.getElementById('btn-layer-down')?.addEventListener('click', () => this.moveLayerOrder('down'));
    document.getElementById('btn-layer-duplicate')?.addEventListener('click', () => this.duplicateSelectedLayer());
    document.getElementById('btn-layer-merge-down')?.addEventListener('click', () => this.mergeDownSelectedLayer());
    document.getElementById('btn-layer-delete')?.addEventListener('click', () => this.deleteSelectedLayer());
  }

  _bindModals() {
    // Open Modals
    document.getElementById('btn-primary-export')?.addEventListener('click', () => this.openExportModal());
    document.getElementById('btn-quick-export')?.addEventListener('click', () => this.openExportModal());
    document.getElementById('btn-resize-canvas-modal')?.addEventListener('click', () => {
      document.getElementById('modal-resize-w').value = this.canvasEngine.width;
      document.getElementById('modal-resize-h').value = this.canvasEngine.height;
      this.openModal('modal-resize-canvas');
    });
    document.getElementById('btn-canvas-size-badge')?.addEventListener('click', () => {
      document.getElementById('modal-resize-w').value = this.canvasEngine.width;
      document.getElementById('modal-resize-h').value = this.canvasEngine.height;
      this.openModal('modal-resize-canvas');
    });

    document.getElementById('btn-sample-media')?.addEventListener('click', () => this.openModal('modal-sample-media'));
    document.getElementById('btn-design-templates')?.addEventListener('click', () => this.openTemplatesModal());
    document.getElementById('btn-projects-library')?.addEventListener('click', () => this.openProjectsLibraryModal());
    document.getElementById('btn-shortcuts-modal')?.addEventListener('click', () => this.openModal('modal-shortcuts'));
    document.getElementById('btn-about-modal')?.addEventListener('click', () => this.openModal('modal-about'));

    // Save & Project file buttons
    document.getElementById('btn-save-project')?.addEventListener('click', async () => {
      this.triggerAutoSave();
      this.showToast('Project saved!');
    });
    document.getElementById('btn-export-project-file')?.addEventListener('click', () => {
      const data = this.serializeProject();
      storageEngine.exportProjectFile(data);
      this.showToast('Exported .mediastudio file');
    });
    document.getElementById('btn-import-project-file')?.addEventListener('click', () => {
      document.getElementById('hidden-project-input').click();
    });
    document.getElementById('btn-new-project')?.addEventListener('click', () => {
      if (confirm('Create new blank project? Any unsaved changes will be lost.')) {
        this.layers = [];
        this.selectedLayer = null;
        this.canvasEngine.resizeCanvas(1920, 1080, false);
        this.canvasEngine.setBackground('#ffffff', false);
        this.renderLayersList();
        this.syncPropertiesUI();
        this.recordHistory('New Project');
      }
    });

    // Close buttons and backdrop click on all modals
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.add('hidden'));
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.add('hidden');
        }
      });
    });

    // Resize Canvas Modal Apply
    document.getElementById('btn-apply-resize-canvas')?.addEventListener('click', () => {
      const w = parseInt(document.getElementById('modal-resize-w').value, 10);
      const h = parseInt(document.getElementById('modal-resize-h').value, 10);
      const scaleContent = document.getElementById('modal-resize-scale-content').checked;
      if (w > 0 && h > 0) {
        this.canvasEngine.resizeCanvas(w, h, scaleContent);
        this.recordHistory('Resize Canvas');
        this.closeModals();
        this.showToast(`Canvas resized to ${w} × ${h} px`);
      }
    });

    document.getElementById('modal-resize-preset')?.addEventListener('change', (e) => {
      if (!e.target.value) return;
      const [w, h] = e.target.value.split('x').map(v => parseInt(v, 10));
      document.getElementById('modal-resize-w').value = w;
      document.getElementById('modal-resize-h').value = h;
    });

    // Export Modal Controls
    let exportFormat = 'png';
    let exportScale = 1.0;

    const exportFormatBtns = document.querySelectorAll('#export-format-segmented .seg-btn');
    exportFormatBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        exportFormat = btn.dataset.format;
        exportFormatBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const qualityGrp = document.getElementById('export-quality-group');
        if (exportFormat === 'png') {
          qualityGrp.classList.add('hidden');
        } else {
          qualityGrp.classList.remove('hidden');
        }
        this.updateExportModalPreview(exportFormat, exportScale);
      });
    });

    const exportScaleBtns = document.querySelectorAll('#export-scale-segmented .seg-btn');
    exportScaleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        exportScale = parseFloat(btn.dataset.scale);
        exportScaleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.updateExportModalPreview(exportFormat, exportScale);
      });
    });

    const qualitySlider = document.getElementById('export-quality-slider');
    qualitySlider?.addEventListener('input', (e) => {
      document.getElementById('export-quality-val').textContent = `${e.target.value}%`;
      this.updateExportModalPreview(exportFormat, exportScale);
    });

    document.getElementById('export-scope-select')?.addEventListener('change', () => {
      this.updateExportModalPreview(exportFormat, exportScale);
    });

    document.getElementById('btn-export-download')?.addEventListener('click', () => {
      const qual = parseInt(qualitySlider.value, 10) / 100;
      const scope = document.getElementById('export-scope-select').value;
      const preserveTrans = document.getElementById('export-transparent-check').checked;

      this.exportEngine.downloadExport({
        filename: this.projectName.toLowerCase().replace(/[^a-z0-9_-]/gi, '_'),
        format: exportFormat,
        scale: exportScale,
        quality: qual,
        scope,
        preserveTransparency: preserveTrans
      });
      this.closeModals();
      this.showToast('Downloaded artwork!');
    });

    document.getElementById('btn-export-copy-clipboard')?.addEventListener('click', async () => {
      try {
        await this.exportEngine.copyToClipboard({
          scale: exportScale,
          scope: document.getElementById('export-scope-select').value,
          preserveTransparency: document.getElementById('export-transparent-check').checked
        });
        this.showToast('Copied high-res image to clipboard!');
      } catch (err) {
        alert('Could not copy image: ' + err.message);
      }
    });
  }

  _bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        return;
      }

      const ctrlOrCmd = e.ctrlKey || e.metaKey;

      // Undo / Redo
      if (ctrlOrCmd && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      } else if (ctrlOrCmd && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
        e.preventDefault();
        this.redo();
      }

      // Copy / Cut / Paste / Duplicate
      else if (ctrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        this.copyCanvasToClipboard();
      } else if (ctrlOrCmd && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        this.copySelectedLayer();
      } else if (ctrlOrCmd && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        this.cutSelectedLayer();
      } else if (ctrlOrCmd && e.key.toLowerCase() === 'v') {
        // Normal paste is handled by clipboard paste event
      } else if (ctrlOrCmd && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        this.duplicateSelectedLayer();
      }

      // Delete
      else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        this.deleteSelectedLayer();
      }

      // Select All
      else if (ctrlOrCmd && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (this.layers.length > 0) this.selectLayer(this.layers[this.layers.length - 1]);
      }

      // Zoom Shortcuts
      else if (ctrlOrCmd && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        this.canvasEngine.zoomIn();
      } else if (ctrlOrCmd && (e.key === '-' || e.key === '_')) {
        e.preventDefault();
        this.canvasEngine.zoomOut();
      } else if (ctrlOrCmd && e.key === '0') {
        e.preventDefault();
        this.canvasEngine.fitCanvasToViewport();
      } else if (ctrlOrCmd && e.key === '1') {
        e.preventDefault();
        this.canvasEngine.zoomTo(100);
      }

      // Save & Export
      else if (ctrlOrCmd && e.key.toLowerCase() === 's') {
        e.preventDefault();
        this.triggerAutoSave();
        this.showToast('Saved Project!');
      } else if (ctrlOrCmd && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        this.openExportModal();
      }

      // Layer Stacking (Ctrl+[ / Ctrl+])
      else if (ctrlOrCmd && e.key === '[') {
        e.preventDefault();
        this.moveLayerOrder('down');
      } else if (ctrlOrCmd && e.key === ']') {
        e.preventDefault();
        this.moveLayerOrder('up');
      }

      // Nudge layer with Arrow keys
      else if (this.selectedLayer && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const dist = e.shiftKey ? 10 : 1;
        if (e.key === 'ArrowUp') this.selectedLayer.y -= dist;
        if (e.key === 'ArrowDown') this.selectedLayer.y += dist;
        if (e.key === 'ArrowLeft') this.selectedLayer.x -= dist;
        if (e.key === 'ArrowRight') this.selectedLayer.x += dist;
        this.syncPropertiesUI();
        this.canvasEngine.requestRender();
      }

      // Swap Colors shortcut (X)
      else if (e.key.toLowerCase() === 'x' && !ctrlOrCmd) {
        this.swapColors();
      }

      // Single Key Tool Shortcuts (V, H, C, B, E, T, U, I)
      else if (!ctrlOrCmd) {
        const key = e.key.toLowerCase();
        if (key === 'v') this.toolEngine.setTool('select');
        else if (key === 'h') this.toolEngine.setTool('hand');
        else if (key === 'c') this.toolEngine.setTool('crop');
        else if (key === 'b') this.toolEngine.setTool('brush');
        else if (key === 'e') this.toolEngine.setTool('eraser');
        else if (key === 't') this.toolEngine.setTool('text');
        else if (key === 'u') this.toolEngine.setTool('shape');
        else if (key === 'i') this.toolEngine.setTool('eyedropper');
        else if (key === '?') this.openModal('modal-shortcuts');

        // Update left toolbar active state
        document.querySelectorAll('.tool-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.tool === this.toolEngine.activeTool);
        });
      }
    });
  }

  _bindDragAndDropAndPaste() {
    const dropOverlay = document.getElementById('drop-zone-overlay');

    window.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (dropOverlay) dropOverlay.classList.remove('hidden');
    });

    window.addEventListener('dragleave', (e) => {
      if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        if (dropOverlay) dropOverlay.classList.add('hidden');
      }
    });

    window.addEventListener('drop', async (e) => {
      e.preventDefault();
      if (dropOverlay) dropOverlay.classList.add('hidden');

      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.name.endsWith('.mediastudio') || file.name.endsWith('.json')) {
          const data = await storageEngine.importProjectFile(file);
          await this.deserializeProject(data);
          this.showToast('Imported project!');
        } else if (file.type.startsWith('image/')) {
          await this.importImageFromFile(file);
        }
      }
    });

    // Clipboard Paste Listener
    window.addEventListener('paste', async (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.clipboardData && e.clipboardData.items) {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              await this.importImageFromFile(blob);
              this.showToast('Pasted image from clipboard');
              return;
            }
          }
        }
      }
    });
  }

  /* ==========================================================================
     INSPECTOR & LAYERS LIST RENDERING
     ========================================================================== */

  syncPropertiesUI() {
    const layer = this.selectedLayer;

    // Badges & Titles
    const typeBadge = document.getElementById('selection-type-badge');
    const title = document.getElementById('selection-title');

    // Sections
    const secCanvas = document.getElementById('section-canvas-props');
    const secTransform = document.getElementById('section-transform-props');
    const secText = document.getElementById('section-text-props');
    const secShape = document.getElementById('section-shape-props');
    const secBrush = document.getElementById('section-brush-props');
    const secImage = document.getElementById('section-image-props');

    if (!layer) {
      if (typeBadge) typeBadge.textContent = 'Document';
      if (title) title.textContent = 'Canvas Settings';

      secCanvas?.classList.remove('hidden');
      secTransform?.classList.add('hidden');
      secText?.classList.add('hidden');
      secShape?.classList.add('hidden');
      secBrush?.classList.add('hidden');
      secImage?.classList.add('hidden');

      // Update Canvas Dimension Inputs
      document.getElementById('prop-canvas-w').value = this.canvasEngine.width;
      document.getElementById('prop-canvas-h').value = this.canvasEngine.height;
      return;
    }

    // A layer is selected
    if (typeBadge) typeBadge.textContent = layer.type.toUpperCase();
    if (title) title.textContent = layer.name;

    secCanvas?.classList.add('hidden');
    secTransform?.classList.remove('hidden');

    // Populate Transform Fields
    document.getElementById('prop-layer-x').value = layer.x;
    document.getElementById('prop-layer-y').value = layer.y;
    document.getElementById('prop-layer-w').value = layer.width;
    document.getElementById('prop-layer-h').value = layer.height;
    document.getElementById('prop-layer-rotation').value = layer.rotation || 0;
    document.getElementById('prop-layer-opacity').value = Math.round(layer.opacity * 100);
    document.getElementById('prop-opacity-val').textContent = `${Math.round(layer.opacity * 100)}%`;
    document.getElementById('prop-layer-blend').value = layer.blendMode || 'normal';

    // Toggle Section by Layer Type
    secText?.classList.toggle('hidden', layer.type !== 'text');
    secShape?.classList.toggle('hidden', layer.type !== 'shape');
    secBrush?.classList.toggle('hidden', layer.type !== 'drawing');
    secImage?.classList.toggle('hidden', layer.type !== 'image');

    // Populate Text Fields
    if (layer.type === 'text') {
      document.getElementById('prop-text-content').value = layer.text;
      document.getElementById('prop-text-font-family').value = layer.fontFamily;
      document.getElementById('prop-text-size').value = layer.fontSize;
      document.getElementById('prop-text-weight').value = layer.fontWeight;
      document.getElementById('prop-text-color').value = layer.fillColor;
      document.getElementById('prop-text-color-hex').textContent = layer.fillColor;
    }

    // Populate Shape Fields
    if (layer.type === 'shape') {
      document.getElementById('prop-shape-fill-type').value = layer.fillType;
      document.getElementById('shape-solid-fill-row')?.classList.toggle('hidden', layer.fillType !== 'solid');
      document.getElementById('shape-gradient-controls')?.classList.toggle('hidden', !layer.fillType.includes('gradient'));
      document.getElementById('prop-shape-fill-color').value = layer.fillColor;
      document.getElementById('prop-shape-fill-hex').textContent = layer.fillColor;
      document.getElementById('prop-shape-stroke-color').value = layer.strokeColor;
      document.getElementById('prop-shape-stroke-hex').textContent = layer.strokeColor;
      document.getElementById('prop-shape-stroke-w').value = layer.strokeWidth;
      document.getElementById('prop-shape-stroke-w-val').textContent = `${layer.strokeWidth}px`;
      document.getElementById('prop-shape-radius').value = layer.cornerRadius || 0;
      document.getElementById('prop-shape-radius-val').textContent = `${layer.cornerRadius || 0}px`;
    }

    // Populate Image Fields
    if (layer.type === 'image') {
      const adj = layer.adjustments;
      for (const [k, v] of Object.entries(adj)) {
        const slider = document.getElementById(`prop-adj-${k}`);
        const badge = document.getElementById(`prop-adj-${k}-val`);
        if (slider) slider.value = v;
        if (badge) badge.textContent = k === 'blur' ? `${v}px` : `${v}`;
      }
    }
  }

  renderLayersList() {
    const list = document.getElementById('layer-list');
    const badge = document.getElementById('layers-count-badge');
    const emptyState = document.getElementById('layers-empty-state');
    if (!list) return;

    if (badge) badge.textContent = this.layers.length;
    if (emptyState) emptyState.classList.toggle('hidden', this.layers.length > 0);

    list.innerHTML = '';

    // Render layers in reverse order so top-most visually matches top of list
    for (let i = this.layers.length - 1; i >= 0; i--) {
      const layer = this.layers[i];
      const item = document.createElement('div');
      item.className = `layer-item ${this.selectedLayer === layer ? 'selected' : ''}`;

      let typeIcon = `<svg class="layer-type-icon" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/></svg>`;
      if (layer.type === 'image') typeIcon = `<svg class="layer-type-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
      if (layer.type === 'text') typeIcon = `<svg class="layer-type-icon" viewBox="0 0 24 24"><polyline points="4 7 4 4 20 4 20 7"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`;
      if (layer.type === 'shape') typeIcon = `<svg class="layer-type-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>`;
      if (layer.type === 'drawing') typeIcon = `<svg class="layer-type-icon" viewBox="0 0 24 24"><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.375-9.375z"/></svg>`;

      item.innerHTML = `
        <div class="layer-thumb-box" id="thumb-${layer.id}"></div>
        ${typeIcon}
        <span class="layer-name" title="Double-click to rename">${layer.name}</span>
        <button class="layer-ctrl-btn ${layer.visible ? '' : 'muted'}" data-action="toggle-visible" title="Toggle Visibility">
          <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button class="layer-ctrl-btn ${layer.locked ? 'locked' : 'muted'}" data-action="toggle-lock" title="Lock / Unlock Layer">
          <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </button>
      `;

      // Generate Async Thumbnail
      layer.getThumbnail(32, 24).then(thumbUrl => {
        const thumbContainer = document.getElementById(`thumb-${layer.id}`);
        if (thumbContainer) {
          thumbContainer.innerHTML = `<img src="${thumbUrl}" class="layer-thumb-img" />`;
        }
      });

      // Layer Selection
      item.addEventListener('click', (e) => {
        if (e.target.closest('.layer-ctrl-btn')) return;
        this.selectLayer(layer);
      });

      // Inline Layer Renaming
      item.querySelector('.layer-name')?.addEventListener('dblclick', (e) => {
        const span = e.currentTarget;
        const input = document.createElement('input');
        input.className = 'layer-name-input';
        input.value = layer.name;
        span.replaceWith(input);
        input.focus();
        input.select();

        const saveName = () => {
          layer.name = input.value.trim() || layer.name;
          this.renderLayersList();
          this.syncPropertiesUI();
        };
        input.addEventListener('blur', saveName);
        input.addEventListener('keydown', (ke) => {
          if (ke.key === 'Enter') saveName();
        });
      });

      // Visibility Toggle
      item.querySelector('[data-action="toggle-visible"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        layer.visible = !layer.visible;
        this.renderLayersList();
        this.canvasEngine.requestRender();
        this.recordHistory(`${layer.visible ? 'Show' : 'Hide'} ${layer.name}`);
      });

      // Lock Toggle
      item.querySelector('[data-action="toggle-lock"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        layer.locked = !layer.locked;
        this.renderLayersList();
        this.canvasEngine.requestRender();
      });

      list.appendChild(item);
    }
  }

  alignSelectedLayer(type) {
    if (!this.selectedLayer) return;
    const l = this.selectedLayer;
    const cw = this.canvasEngine.width;
    const ch = this.canvasEngine.height;

    switch (type) {
      case 'left': l.x = 0; break;
      case 'center-h': l.x = Math.round((cw - l.width) / 2); break;
      case 'right': l.x = cw - l.width; break;
      case 'top': l.y = 0; break;
      case 'center-v': l.y = Math.round((ch - l.height) / 2); break;
      case 'bottom': l.y = ch - l.height; break;
    }

    this.syncPropertiesUI();
    this.canvasEngine.requestRender();
    this.recordHistory(`Align ${l.name}`);
  }

  /* ==========================================================================
     FILTER PRESETS & STOCK MEDIA GRIDS
     ========================================================================== */

  _initFilterPresetsUI() {
    const grid = document.getElementById('filter-preset-grid');
    if (!grid) return;
    grid.innerHTML = '';

    FILTER_PRESETS.forEach(preset => {
      const card = document.createElement('div');
      card.className = 'filter-card';
      card.innerHTML = `
        <div class="filter-card-preview" style="filter: ${preset.cssFilter}; background-image: linear-gradient(135deg, #3b82f6, #ec4899);"></div>
        <div class="filter-card-name">${preset.name}</div>
      `;
      card.addEventListener('click', () => {
        if (!this.selectedLayer || this.selectedLayer.type !== 'image') {
          this.showToast('Select an image layer to apply preset');
          return;
        }

        this.selectedLayer.adjustments = { ...preset.adjustments };
        this.selectedLayer.activeFilterPreset = preset.id;
        this.selectedLayer.updateCache();
        this.syncPropertiesUI();
        this.canvasEngine.requestRender();
        this.recordHistory(`Filter Preset: ${preset.name}`);
        this.showToast(`Applied ${preset.name}`);
      });
      grid.appendChild(card);
    });
  }

  _initSampleMediaUI() {
    const grid = document.getElementById('sample-media-grid');
    if (!grid) return;
    grid.innerHTML = '';

    SAMPLE_STOCK_MEDIA.forEach(sample => {
      const card = document.createElement('div');
      card.className = 'sample-photo-card';
      card.innerHTML = `
        <img src="${sample.thumb}" class="sample-photo-img" loading="lazy" alt="${sample.title}" />
        <div class="sample-photo-title">${sample.title}</div>
      `;
      card.addEventListener('click', () => {
        this.importImageFromUrl(sample.url, sample.title);
        this.closeModals();
      });
      grid.appendChild(card);
    });
  }

  _initTemplatesUI() {
    const grid = document.getElementById('templates-grid');
    if (!grid) return;
    grid.innerHTML = '';

    DESIGN_TEMPLATES.forEach(tpl => {
      const card = document.createElement('div');
      card.className = 'template-card';
      card.innerHTML = `
        <div class="template-card-preview" style="background: ${tpl.backgroundColor};">
          <span class="template-preview-badge">${tpl.width} × ${tpl.height}</span>
          <svg viewBox="0 0 24 24" style="width: 36px; height: 36px; opacity: 0.6; stroke: #38bdf8; fill: none; stroke-width: 1.5;">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        </div>
        <div class="template-card-body">
          <div class="template-card-title">${tpl.name}</div>
          <div class="template-card-meta">${tpl.category} &bull; ${tpl.layers.length} Layers</div>
        </div>
      `;
      card.addEventListener('click', () => {
        this.loadTemplate(tpl);
        this.closeModals();
      });
      grid.appendChild(card);
    });
  }

  openTemplatesModal() {
    this.openModal('modal-templates');
  }

  async loadTemplate(template) {
    this.projectName = template.name;
    const nameInput = document.getElementById('project-name-input');
    if (nameInput) nameInput.value = this.projectName;

    this.layers = [];
    this.selectedLayer = null;
    this.canvasEngine.resizeCanvas(template.width, template.height, false);
    this.canvasEngine.setBackground(template.backgroundColor, template.isTransparent);

    for (const lData of template.layers) {
      let layer;
      if (lData.type === 'shape') layer = new ShapeLayer(lData);
      else if (lData.type === 'text') layer = new TextLayer(lData);
      else if (lData.type === 'image') layer = await ImageLayer.fromJSON(lData);
      else if (lData.type === 'drawing') layer = DrawingLayer.fromJSON(lData);

      if (layer) {
        this.layers.push(layer);
      }
    }

    if (this.layers.length > 0) {
      this.selectedLayer = this.layers[this.layers.length - 1];
    }

    this.renderLayersList();
    this.syncPropertiesUI();
    this.canvasEngine.fitCanvasToViewport();
    this.recordHistory(`Load Template: ${template.name}`);
    this.showToast(`Loaded "${template.name}" template`);
  }

  trimCanvasToFitLayers() {
    if (this.layers.length === 0) {
      this.showToast('No layers to trim canvas to');
      return;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const layer of this.layers) {
      if (!layer.visible) continue;
      minX = Math.min(minX, layer.x);
      minY = Math.min(minY, layer.y);
      maxX = Math.max(maxX, layer.x + layer.width);
      maxY = Math.max(maxY, layer.y + layer.height);
    }

    if (minX === Infinity || maxX === -Infinity || maxX <= minX || maxY <= minY) {
      this.showToast('No valid layer bounds found');
      return;
    }

    const newW = Math.max(50, Math.ceil(maxX - minX));
    const newH = Math.max(50, Math.ceil(maxY - minY));

    // Shift layers to (0, 0)
    for (const layer of this.layers) {
      layer.x -= minX;
      layer.y -= minY;
    }

    this.canvasEngine.resizeCanvas(newW, newH, false);
    this.recordHistory('Trim Canvas to Fit Layers');
    this.canvasEngine.fitCanvasToViewport();
    this.showToast(`Canvas trimmed to ${newW} × ${newH} px`);
  }

  async openProjectsLibraryModal() {
    this.openModal('modal-projects-library');
    const grid = document.getElementById('projects-grid');
    const emptyMsg = document.getElementById('projects-empty-msg');
    if (!grid) return;
    grid.innerHTML = '';

    const projects = await storageEngine.listProjects();
    if (projects.length === 0) {
      emptyMsg?.classList.remove('hidden');
      return;
    }
    emptyMsg?.classList.add('hidden');

    projects.forEach(proj => {
      const card = document.createElement('div');
      card.className = 'project-card';
      const dateStr = new Date(proj.updatedAt || Date.now()).toLocaleDateString();

      card.innerHTML = `
        <img src="${proj.thumbnail || createProceduralGradientDataUrl(300, 200)}" class="project-card-thumb" />
        <div class="project-card-info">
          <div class="project-card-name">${proj.name}</div>
          <div class="project-card-date">${proj.width} × ${proj.height} px &bull; ${dateStr}</div>
        </div>
        <button class="project-card-delete" title="Delete Project">&times;</button>
      `;

      card.querySelector('.project-card-info')?.addEventListener('click', async () => {
        await this.deserializeProject(proj);
        this.closeModals();
        this.showToast(`Opened project: ${proj.name}`);
      });

      card.querySelector('.project-card-thumb')?.addEventListener('click', async () => {
        await this.deserializeProject(proj);
        this.closeModals();
        this.showToast(`Opened project: ${proj.name}`);
      });

      card.querySelector('.project-card-delete')?.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm(`Delete project "${proj.name}"?`)) {
          await storageEngine.deleteProject(proj.id);
          card.remove();
          this.showToast('Deleted project');
        }
      });

      grid.appendChild(card);
    });
  }

  openExportModal() {
    this.openModal('modal-export');
    this.updateExportModalPreview('png', 1.0);
  }

  updateExportModalPreview(format, scale) {
    const previewCanvas = document.getElementById('export-preview-canvas');
    const readout = document.getElementById('export-meta-readout');
    const qual = parseInt(document.getElementById('export-quality-slider')?.value || '92', 10) / 100;
    const scope = document.getElementById('export-scope-select')?.value || 'canvas';

    const info = this.exportEngine.updateModalPreview(previewCanvas, {
      format,
      scale,
      quality: qual,
      scope,
      preserveTransparency: document.getElementById('export-transparent-check')?.checked
    });

    if (info && readout) {
      readout.textContent = `${info.width} × ${info.height} px • Estimated ~${info.estimatedKB} KB`;
    }
  }

  /* ==========================================================================
     CANVAS ROTATION & FLIPPING
     ========================================================================== */

  rotateEntireCanvas(angleDeg) {
    const oldW = this.canvasEngine.width;
    const oldH = this.canvasEngine.height;

    // Swap canvas width & height for 90/-90 deg
    this.canvasEngine.resizeCanvas(oldH, oldW, false);

    const rad = (angleDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    for (const layer of this.layers) {
      const cx = layer.x + layer.width / 2 - oldW / 2;
      const cy = layer.y + layer.height / 2 - oldH / 2;

      const newCx = cx * cos - cy * sin + this.canvasEngine.width / 2;
      const newCy = cx * sin + cy * cos + this.canvasEngine.height / 2;

      layer.x = Math.round(newCx - layer.width / 2);
      layer.y = Math.round(newCy - layer.height / 2);
      layer.rotation = (layer.rotation + angleDeg + 360) % 360;
    }

    this.recordHistory(`Rotate Canvas ${angleDeg}°`);
    this.canvasEngine.fitCanvasToViewport();
  }

  flipEntireCanvas(axis) {
    const cw = this.canvasEngine.width;
    const ch = this.canvasEngine.height;

    for (const layer of this.layers) {
      if (axis === 'h') {
        layer.x = cw - (layer.x + layer.width);
        layer.flipH = !layer.flipH;
      } else {
        layer.y = ch - (layer.y + layer.height);
        layer.flipV = !layer.flipV;
      }
    }

    this.recordHistory(`Flip Canvas ${axis.toUpperCase()}`);
    this.canvasEngine.requestRender();
  }

  /* ==========================================================================
     HELPER UTILITIES
     ========================================================================== */

  syncZoomUI(zoom) {
    const pct = Math.round(zoom * 100);
    const badge = document.getElementById('zoom-percentage-badge');
    const valBtn = document.getElementById('btn-zoom-val');
    const slider = document.getElementById('bottom-zoom-slider');

    if (badge) badge.textContent = `${pct}%`;
    if (valBtn) valBtn.textContent = `${pct}%`;
    if (slider) slider.value = Math.min(500, Math.max(10, pct));
  }

  syncCanvasSizeUI(w, h) {
    const bw = document.getElementById('badge-canvas-width');
    const bh = document.getElementById('badge-canvas-height');
    if (bw) bw.textContent = w;
    if (bh) bh.textContent = h;
  }

  updateStatusCoords(x, y) {
    const cx = document.getElementById('cursor-x');
    const cy = document.getElementById('cursor-y');
    if (cx) cx.textContent = Math.round(x);
    if (cy) cy.textContent = Math.round(y);
  }

  updateToolHint(tool, subType = null) {
    const hintEl = document.getElementById('tool-quick-hint');
    if (!hintEl) return;

    const hints = {
      select: { name: 'Select & Move', desc: 'Drag to position or transform layer' },
      hand: { name: 'Hand Tool', desc: 'Click & drag to pan workspace' },
      crop: { name: 'Crop Canvas', desc: 'Drag crop handles to trim artboard' },
      brush: { name: 'Brush Tool', desc: 'Freehand smooth drawing on canvas' },
      eraser: { name: 'Eraser Tool', desc: 'Erase drawing layer strokes' },
      text: { name: 'Text Tool', desc: 'Click canvas to place headline or text' },
      shape: { name: `Shape (${subType || 'Vector'})`, desc: 'Click & drag to draw vector shape' },
      eyedropper: { name: 'Eyedropper', desc: 'Click any pixel to sample color' }
    };

    const h = hints[tool] || { name: 'Tool', desc: '' };
    hintEl.innerHTML = `<span class="tool-hint-name">${h.name}</span>: <span class="tool-hint-desc">${h.desc}</span>`;
  }

  showToast(message) {
    const container = document.getElementById('toast-container');
    const statusToast = document.getElementById('status-bar-toast');
    if (statusToast) statusToast.textContent = message;

    if (container) {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      container.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }
  }

  openModal(modalId) {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.add('hidden'));
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('hidden');
  }

  closeModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.add('hidden'));
  }

  cutSelectedLayer() {
    this.copySelectedLayer();
    this.deleteSelectedLayer();
  }

  copySelectedLayer() {
    if (!this.selectedLayer) return;
    this.clipboardLayerData = this.selectedLayer.toJSON();
    this.showToast(`Copied ${this.selectedLayer.name}`);
  }

  pasteLayer() {
    if (!this.clipboardLayerData) return;
    const json = JSON.parse(JSON.stringify(this.clipboardLayerData));
    json.id = 'layer_' + Math.random().toString(36).substr(2, 9);
    json.name = `${json.name} Paste`;
    json.x += 24;
    json.y += 24;

    let pasteLayer;
    if (json.type === 'image') pasteLayer = ImageLayer.fromJSON(json);
    else if (json.type === 'text') pasteLayer = TextLayer.fromJSON(json);
    else if (json.type === 'shape') pasteLayer = ShapeLayer.fromJSON(json);
    else if (json.type === 'drawing') pasteLayer = DrawingLayer.fromJSON(json);

    if (pasteLayer) {
      this.addLayer(pasteLayer);
      this.showToast('Pasted layer');
    }
  }

  async copyCanvasToClipboard() {
    try {
      await this.exportEngine.copyToClipboard({ scale: 1.0 });
      this.showToast('Copied merged image to clipboard!');
    } catch (err) {
      alert('Failed to copy: ' + err.message);
    }
  }
}

// Bootstrap Application on DOM Ready
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.mediaStudio = new MediaStudioApp();
  });
}


})();
