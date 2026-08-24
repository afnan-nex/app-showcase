/* ==========================================================================
   CANVASFLOW — Document Model & Object Schema
   Factory Functions, Types & Serialization
   ========================================================================== */

/**
 * Generate a unique ID (RFC4122 v4 compatible)
 */
export function generateId(prefix = 'obj') {
  const rand = Math.random().toString(36).substring(2, 9);
  const time = Date.now().toString(36).slice(-4);
  return `${prefix}_${time}_${rand}`;
}

/**
 * Default common attributes for any canvas object
 */
export const DEFAULT_OBJECT_PROPS = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  rotation: 0,
  opacity: 1,
  stroke: '#3b82f6',
  strokeWidth: 2,
  strokeStyle: 'solid', // 'solid' | 'dashed' | 'dotted'
  fill: 'transparent',
  locked: false,
  visible: true,
  zIndex: 0,
  groupId: null,
  metadata: {}
};

/**
 * Factory function to create a new canvas object with type-specific defaults
 */
export function createCanvasObject(type, props = {}) {
  const base = {
    id: generateId(type.substring(0, 4)),
    type,
    ...DEFAULT_OBJECT_PROPS,
    ...props
  };

  switch (type) {
    case 'rectangle':
      return {
        ...base,
        fill: props.fill || 'transparent',
        stroke: props.stroke || '#3b82f6',
        strokeWidth: props.strokeWidth ?? 2,
        cornerRadius: 0
      };

    case 'rounded-rectangle':
      return {
        ...base,
        fill: props.fill || 'transparent',
        stroke: props.stroke || '#3b82f6',
        strokeWidth: props.strokeWidth ?? 2,
        cornerRadius: 12
      };

    case 'ellipse':
      return {
        ...base,
        fill: props.fill || 'transparent',
        stroke: props.stroke || '#3b82f6',
        strokeWidth: props.strokeWidth ?? 2
      };

    case 'diamond':
      return {
        ...base,
        fill: props.fill || 'transparent',
        stroke: props.stroke || '#3b82f6',
        strokeWidth: props.strokeWidth ?? 2
      };

    case 'line':
      return {
        ...base,
        x2: props.x2 ?? base.x + 120,
        y2: props.y2 ?? base.y,
        stroke: props.stroke || '#3b82f6',
        strokeWidth: props.strokeWidth ?? 2,
        arrowHeadStart: 'none',
        arrowHeadEnd: 'none'
      };

    case 'arrow':
      return {
        ...base,
        x2: props.x2 ?? base.x + 120,
        y2: props.y2 ?? base.y,
        stroke: props.stroke || '#3b82f6',
        strokeWidth: props.strokeWidth ?? 2,
        arrowHeadStart: 'none',
        arrowHeadEnd: 'triangle' // 'triangle' | 'dot' | 'none'
      };

    case 'connector':
      return {
        ...base,
        x2: props.x2 ?? base.x + 100,
        y2: props.y2 ?? base.y + 100,
        stroke: props.stroke || '#6b7280',
        strokeWidth: props.strokeWidth ?? 2,
        strokeStyle: 'solid',
        arrowHeadStart: 'none',
        arrowHeadEnd: 'triangle',
        routing: 'curved', // 'curved' | 'straight' | 'stepped'
        startBinding: props.startBinding || null, // { elementId, anchor: 'top'|'right'|'bottom'|'left'|'center' }
        endBinding: props.endBinding || null
      };

    case 'pencil':
      return {
        ...base,
        stroke: props.stroke || '#3b82f6',
        strokeWidth: props.strokeWidth ?? 3,
        points: props.points || [{ x: base.x, y: base.y }],
        fill: 'transparent'
      };

    case 'highlighter':
      return {
        ...base,
        stroke: props.stroke || '#fef08a',
        strokeWidth: props.strokeWidth ?? 16,
        opacity: props.opacity ?? 0.45,
        points: props.points || [{ x: base.x, y: base.y }],
        fill: 'transparent'
      };

    case 'text':
      return {
        ...base,
        text: props.text ?? 'Double-click to edit',
        fontFamily: props.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: props.fontSize || 18,
        fontWeight: props.fontWeight || 'normal', // 'normal' | 'bold'
        fontStyle: props.fontStyle || 'normal',   // 'normal' | 'italic'
        textAlign: props.textAlign || 'left',     // 'left' | 'center' | 'right'
        lineHeight: props.lineHeight || 1.35,
        color: props.color || '#f3f4f6',
        stroke: 'transparent',
        fill: 'transparent',
        width: props.width || 180,
        height: props.height || 36
      };

    case 'sticky':
      return {
        ...base,
        text: props.text ?? 'Note...',
        color: props.color || '#713f12',
        fill: props.fill || '#fef08a',
        stroke: 'rgba(0,0,0,0.1)',
        strokeWidth: 1,
        fontFamily: props.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: props.fontSize || 15,
        textAlign: props.textAlign || 'left',
        width: props.width || 160,
        height: props.height || 160
      };

    case 'image':
      return {
        ...base,
        src: props.src || '',
        aspectRatio: props.aspectRatio || 1,
        stroke: 'transparent',
        fill: 'transparent'
      };

    case 'group':
      return {
        ...base,
        childIds: props.childIds || [],
        stroke: 'transparent',
        fill: 'transparent'
      };

    default:
      return base;
  }
}

/**
 * Deep clone a canvas object
 */
export function cloneObject(obj) {
  if (!obj) return null;
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Validate and sanitize an imported board document
 */
export function validateBoardDocument(doc) {
  if (!doc || typeof doc !== 'object') {
    throw new Error('Invalid board format: document is not an object.');
  }

  const sanitized = {
    version: 1,
    app: 'CanvasFlow',
    id: doc.id || generateId('board'),
    title: doc.title || 'Untitled Board',
    createdAt: doc.createdAt || Date.now(),
    updatedAt: Date.now(),
    viewport: {
      panX: Number(doc.viewport?.panX) || 0,
      panY: Number(doc.viewport?.panY) || 0,
      zoom: Number(doc.viewport?.zoom) || 1
    },
    settings: {
      gridVisible: doc.settings?.gridVisible ?? true,
      gridType: doc.settings?.gridType || 'dots',
      snapEnabled: doc.settings?.snapEnabled ?? true,
      rulersVisible: doc.settings?.rulersVisible ?? false,
      theme: doc.settings?.theme || 'dark'
    },
    objects: Array.isArray(doc.objects) ? doc.objects.filter(o => o && o.id && o.type) : []
  };

  return sanitized;
}
