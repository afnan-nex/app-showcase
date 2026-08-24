/**
 * MediaStudio — Presets, Templates, Sample Media & Default Configurations
 * Production-ready configurations with realistic design assets and templates.
 */

// Canvas Size Presets
export const CANVAS_PRESETS = [
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
export const AVAILABLE_FONTS = [
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
export const FILTER_PRESETS = [
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
export const SAMPLE_STOCK_MEDIA = [
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
export const DESIGN_TEMPLATES = [
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
export function createProceduralGradientDataUrl(width = 1280, height = 720, colors = ['#3b82f6', '#8b5cf6', '#ec4899']) {
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
