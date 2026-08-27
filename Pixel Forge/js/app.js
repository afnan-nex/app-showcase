/**
 * PixelForge - Master Pixel Art Workstation Orchestrator
 * Integrates Canvas Renderer, Drawing Algorithms, Animation Engine, Layer Manager, Color Picker, and File I/O.
 */

import { getIcon, escapeHTML } from './core/icons.js';
import { db } from './core/db.js';
import {
  getLinePixels,
  getRectPixels,
  getCirclePixels,
  floodFill,
  getDitherColor,
  filterPixelPerfect,
  rgbToHex
} from './core/math-draw.js';
import { CanvasRenderer } from './engine/canvas-renderer.js';
import { AnimationEngine } from './engine/animation.js';
import { TilemapEngine } from './engine/tilemap.js';
import { renderLayerPanel } from './editor/layer-manager.js';
import { renderColorPanel } from './editor/color-picker.js';
import { renderTimeline } from './editor/timeline.js';
import { TEMPLATES } from './editor/templates.js';

class PixelForgeApp {
  constructor() {
    this.canvas = document.getElementById('pixel-canvas');
    this.renderer = new CanvasRenderer(this.canvas);
    this.animation = new AnimationEngine(this);
    this.tilemap = new TilemapEngine(this);

    // Active project state
    this.project = JSON.parse(JSON.stringify(TEMPLATES.knight));
    this.activeFrameIndex = 0;
    this.activeLayerId = this.project.frames[0]?.layers[0]?.id || 'layer_default';

    // Tool & Drawing State
    this.activeTool = 'pencil'; // pencil, eraser, line, rect, rectFill, circle, circleFill, bucket, picker, dither, select, move
    this.primaryColor = '#58a6ff';
    this.secondaryColor = '#000000';
    this.brushSize = 1;
    this.pixelPerfect = true;
    this.symmetryMode = 'none'; // none, horizontal, vertical, both
    this.showGrid = true;
    this.showOnionSkin = false;

    // Pointer Interaction State
    this.isDrawing = false;
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };
    this.drawStart = { x: 0, y: 0 };
    this.strokePoints = [];
    this.activePreviewPixels = [];
    this.selection = null;
    this.clipboardPixels = null;
    this.cursorPos = { x: 0, y: 0 };

    // Recent colors
    this.recentColors = ['#58a6ff', '#000000', '#ffffff', '#e11d48', '#00e5ff', '#334155'];

    // History stack
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 30;
  }

  async init() {
    await db.init();

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // Load saved project if exists
    const lastId = localStorage.getItem('pixelforge_last_project_id');
    if (lastId) {
      const saved = await db.loadProject(lastId);
      if (saved && saved.frames && saved.frames.length > 0) {
        this.project = saved;
        this.activeFrameIndex = 0;
        this.activeLayerId = this.project.frames[0].layers[0]?.id || 'default';
      }
    }

    this.setupToolbar();
    this.setupCanvasInteractions();
    this.setupShortcuts();
    this.renderAll();
    this.centerCanvas();
  }

  handleResize() {
    const container = document.getElementById('canvas-workspace-container');
    if (container && this.canvas) {
      this.renderer.resize(container.clientWidth, container.clientHeight);
      this.requestRender();
    }
  }

  requestRender() {
    this.renderer.render({
      project: this.project,
      activeFrameIndex: this.activeFrameIndex,
      activeLayerId: this.activeLayerId,
      showGrid: this.showGrid,
      showOnionSkin: this.showOnionSkin,
      symmetryMode: this.symmetryMode,
      activePreviewPixels: this.activePreviewPixels,
      selection: this.selection,
      cursorPos: this.cursorPos,
      brushSize: this.brushSize
    });
  }

  renderAll() {
    this.renderColorPickerPanel();
    this.renderLayerStack();
    this.renderAnimationTimeline();
    this.updateStats();
    this.requestRender();
  }

  // --- Toolbar Setup ---
  setupToolbar() {
    // Tool buttons
    document.querySelectorAll('.btn-pixel-tool').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setTool(btn.dataset.tool);
      });
    });

    // Brush Size
    const brushSelect = document.getElementById('select-brush-size');
    brushSelect?.addEventListener('change', (e) => {
      this.brushSize = parseInt(e.target.value, 10) || 1;
    });

    // Pixel-Perfect Toggle
    const ppBtn = document.getElementById('btn-toggle-pixel-perfect');
    ppBtn?.addEventListener('click', () => {
      this.pixelPerfect = !this.pixelPerfect;
      ppBtn.classList.toggle('active', this.pixelPerfect);
    });

    // Symmetry Mode Selector
    const symSelect = document.getElementById('select-symmetry-mode');
    symSelect?.addEventListener('change', (e) => {
      this.symmetryMode = e.target.value;
      this.requestRender();
    });

    // Template Switcher
    document.getElementById('select-project-template')?.addEventListener('change', (e) => {
      const tKey = e.target.value;
      if (TEMPLATES[tKey]) {
        if (confirm(`Load template "${TEMPLATES[tKey].name}"? Unsaved edits in current project will be replaced.`)) {
          this.loadProject(JSON.parse(JSON.stringify(TEMPLATES[tKey])));
        }
      }
    });

    // Undo / Redo
    document.getElementById('btn-undo')?.addEventListener('click', () => this.undo());
    document.getElementById('btn-redo')?.addEventListener('click', () => this.redo());

    // Grid Toggle
    const gridBtn = document.getElementById('btn-toggle-grid');
    gridBtn?.addEventListener('click', () => {
      this.showGrid = !this.showGrid;
      gridBtn.classList.toggle('active', this.showGrid);
      this.requestRender();
    });

    // Zoom buttons
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
      this.renderer.camera.zoom = Math.min(64, this.renderer.camera.zoom * 1.3);
      this.requestRender();
      this.updateZoomLabel();
    });
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
      this.renderer.camera.zoom = Math.max(2, this.renderer.camera.zoom * 0.75);
      this.requestRender();
      this.updateZoomLabel();
    });
    document.getElementById('btn-zoom-reset')?.addEventListener('click', () => {
      this.renderer.camera.zoom = 16;
      this.centerCanvas();
    });
    document.getElementById('btn-fit-canvas')?.addEventListener('click', () => this.centerCanvas());

    // New Project Dialog
    document.getElementById('btn-new-project')?.addEventListener('click', () => {
      const sizeStr = prompt('Enter canvas size (e.g. 16, 24, 32, 48, 64):', '32');
      const size = parseInt(sizeStr, 10);
      if (size && size >= 8 && size <= 256) {
        this.createNewProject(size, size);
      }
    });

    // Export PNG
    document.getElementById('btn-export-png')?.addEventListener('click', () => {
      const scaleStr = prompt('Enter PNG upscale factor (1, 2, 4, 8, 16):', '8');
      const scale = parseInt(scaleStr, 10) || 8;
      this.exportPNG(scale);
    });

    // Export Sprite Sheet
    document.getElementById('btn-export-sheet')?.addEventListener('click', () => {
      this.exportSpriteSheet();
    });

    // Export Animated SVG
    document.getElementById('btn-export-svg')?.addEventListener('click', () => {
      const scaleStr = prompt('Enter SVG pixel scale (e.g. 5, 10, 16):', '10');
      const scale = parseInt(scaleStr, 10) || 10;
      this.exportAnimatedSVG(scale);
    });

    // Export Video (WebM / MP4)
    document.getElementById('btn-export-video')?.addEventListener('click', () => {
      this.exportVideo();
    });

    // Export JSON
    document.getElementById('btn-export-json')?.addEventListener('click', () => {
      const json = JSON.stringify(this.project, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (this.project.name || 'sprite').toLowerCase().replace(/\s+/g, '_') + '.pixelforge.json';
      a.click();
    });

    // Import JSON
    const importInput = document.getElementById('file-import-project');
    document.getElementById('btn-import-json')?.addEventListener('click', () => importInput?.click());
    importInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (parsed && parsed.frames && parsed.frames.length > 0) {
            this.loadProject(parsed);
          } else {
            alert('Invalid PixelForge project JSON structure.');
          }
        } catch (err) {
          alert('Failed to parse project JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    });
  }

  setTool(toolName) {
    this.activeTool = toolName;
    document.querySelectorAll('.btn-pixel-tool').forEach(b => {
      b.classList.toggle('active', b.dataset.tool === toolName);
    });
  }

  // --- Canvas Coordinate & Pointer Interactions ---
  setupCanvasInteractions() {
    const canvas = this.canvas;

    const screenToPixel = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const sx = clientX - rect.left;
      const sy = clientY - rect.top;
      const px = Math.floor((sx - this.renderer.camera.x) / this.renderer.camera.zoom);
      const py = Math.floor((sy - this.renderer.camera.y) / this.renderer.camera.zoom);
      return { px, py, sx, sy };
    };

    canvas.addEventListener('mousedown', (e) => {
      const { px, py, sx, sy } = screenToPixel(e.clientX, e.clientY);

      // Pan with Middle Click or Hand Tool or Space+Drag
      if (e.button === 1 || this.activeTool === 'move' || e.shiftKey || e.altKey) {
        this.isPanning = true;
        this.panStart = { x: sx, y: sy };
        return;
      }

      if (e.button !== 0 && e.button !== 2) return; // Left or Right click
      const isRightClick = e.button === 2;

      this.isDrawing = true;
      this.drawStart = { x: px, y: py };
      this.strokePoints = [{ x: px, y: py }];

      const drawColor = isRightClick ? this.secondaryColor : this.primaryColor;

      // Eyedropper / Color Picker
      if (this.activeTool === 'picker') {
        const pickedColor = this.getPixelColorAt(px, py);
        if (pickedColor && pickedColor !== 'transparent') {
          if (isRightClick) this.secondaryColor = pickedColor;
          else this.primaryColor = pickedColor;
          this.renderColorPickerPanel();
        }
        return;
      }

      // Flood Fill / Paint Bucket
      if (this.activeTool === 'bucket') {
        this.recordHistory('Bucket Fill');
        const activeLayer = this.getActiveLayer();
        if (activeLayer && !activeLayer.locked) {
          const filled = floodFill(activeLayer.pixels, this.project.width, this.project.height, px, py, drawColor);
          filled.forEach(p => {
            activeLayer.pixels[p.y * this.project.width + p.x] = p.color;
          });
          this.renderAll();
          this.autoSave();
        }
        return;
      }

      // Pencil / Eraser / Dither single click
      if (['pencil', 'eraser', 'dither'].includes(this.activeTool)) {
        this.recordHistory('Draw Stroke');
        this.applyPixelStroke([{ x: px, y: py }], drawColor);
        this.requestRender();
      }
    });

    window.addEventListener('mousemove', (e) => {
      const { px, py, sx, sy } = screenToPixel(e.clientX, e.clientY);
      this.cursorPos = { x: px, y: py };
      this.updateCoordinatesReadout(px, py);

      if (this.isPanning) {
        this.renderer.camera.x += sx - this.panStart.x;
        this.renderer.camera.y += sy - this.panStart.y;
        this.panStart = { x: sx, y: sy };
        this.requestRender();
        return;
      }

      if (!this.isDrawing) {
        this.requestRender();
        return;
      }

      const isRightClick = e.buttons === 2;
      const drawColor = isRightClick ? this.secondaryColor : this.primaryColor;

      // Continuous Drawing (Pencil, Eraser, Dither)
      if (['pencil', 'eraser', 'dither'].includes(this.activeTool)) {
        const last = this.strokePoints[this.strokePoints.length - 1];
        if (last && (last.x !== px || last.y !== py)) {
          // Connect gaps with Bresenham line
          const linePts = getLinePixels(last.x, last.y, px, py);
          this.strokePoints.push(...linePts);
          this.applyPixelStroke(linePts, drawColor);
          this.requestRender();
        }
        return;
      }

      // Shapes Preview (Line, Rect, Circle, Marquee)
      if (this.activeTool === 'line') {
        const linePts = getLinePixels(this.drawStart.x, this.drawStart.y, px, py);
        this.activePreviewPixels = this.expandSymmetry(linePts, drawColor);
        this.requestRender();
      } else if (this.activeTool === 'rect') {
        const rectPts = getRectPixels(this.drawStart.x, this.drawStart.y, px, py, false);
        this.activePreviewPixels = this.expandSymmetry(rectPts, drawColor);
        this.requestRender();
      } else if (this.activeTool === 'rectFill') {
        const rectPts = getRectPixels(this.drawStart.x, this.drawStart.y, px, py, true);
        this.activePreviewPixels = this.expandSymmetry(rectPts, drawColor);
        this.requestRender();
      } else if (this.activeTool === 'circle') {
        const r = Math.hypot(px - this.drawStart.x, py - this.drawStart.y);
        const circPts = getCirclePixels(this.drawStart.x, this.drawStart.y, r, false);
        this.activePreviewPixels = this.expandSymmetry(circPts, drawColor);
        this.requestRender();
      } else if (this.activeTool === 'circleFill') {
        const r = Math.hypot(px - this.drawStart.x, py - this.drawStart.y);
        const circPts = getCirclePixels(this.drawStart.x, this.drawStart.y, r, true);
        this.activePreviewPixels = this.expandSymmetry(circPts, drawColor);
        this.requestRender();
      } else if (this.activeTool === 'select') {
        this.selection = {
          x0: this.drawStart.x,
          y0: this.drawStart.y,
          x1: px,
          y1: py
        };
        this.requestRender();
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isDrawing) {
        // Commit shape to active layer
        if (this.activePreviewPixels.length > 0) {
          this.recordHistory('Draw Shape');
          const activeLayer = this.getActiveLayer();
          if (activeLayer && !activeLayer.locked) {
            this.activePreviewPixels.forEach(p => {
              if (p.x >= 0 && p.x < this.project.width && p.y >= 0 && p.y < this.project.height) {
                activeLayer.pixels[p.y * this.project.width + p.x] = p.color;
              }
            });
          }
          this.activePreviewPixels = [];
        }

        this.isDrawing = false;
        this.strokePoints = [];
        this.autoSave();
        this.renderAll();
      }
      this.isPanning = false;
    });

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Mouse wheel zoom
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const { sx, sy } = screenToPixel(e.clientX, e.clientY);
      const zoomFactor = e.deltaY < 0 ? 1.2 : 0.8;
      const oldZoom = this.renderer.camera.zoom;
      const newZoom = Math.max(2, Math.min(64, oldZoom * zoomFactor));

      this.renderer.camera.x = sx - (sx - this.renderer.camera.x) * (newZoom / oldZoom);
      this.renderer.camera.y = sy - (sy - this.renderer.camera.y) * (newZoom / oldZoom);
      this.renderer.camera.zoom = newZoom;

      this.requestRender();
      this.updateZoomLabel();
    });
  }

  applyPixelStroke(points, color) {
    const activeLayer = this.getActiveLayer();
    if (!activeLayer || activeLayer.locked) return;

    let pts = points;
    if (this.pixelPerfect && this.activeTool === 'pencil') {
      pts = filterPixelPerfect(points);
    }

    const pw = this.project.width;
    const ph = this.project.height;

    pts.forEach(pt => {
      // Handle brush size offset
      const offset = Math.floor(this.brushSize / 2);
      for (let by = 0; by < this.brushSize; by++) {
        for (let bx = 0; bx < this.brushSize; bx++) {
          const px = pt.x - offset + bx;
          const py = pt.y - offset + by;

          const symmetricalPoints = this.getSymmetricalPoints(px, py);
          symmetricalPoints.forEach(sp => {
            if (sp.x >= 0 && sp.x < pw && sp.y >= 0 && sp.y < ph) {
              let finalColor = color;
              if (this.activeTool === 'eraser') {
                finalColor = 'transparent';
              } else if (this.activeTool === 'dither') {
                finalColor = getDitherColor(sp.x, sp.y, this.primaryColor, this.secondaryColor);
              }
              activeLayer.pixels[sp.y * pw + sp.x] = finalColor;
            }
          });
        }
      }
    });

    this.addRecentColor(color);
  }

  getSymmetricalPoints(x, y) {
    const pw = this.project.width;
    const ph = this.project.height;
    const points = [{ x, y }];

    if (this.symmetryMode === 'vertical' || this.symmetryMode === 'both') {
      points.push({ x: pw - 1 - x, y });
    }
    if (this.symmetryMode === 'horizontal' || this.symmetryMode === 'both') {
      points.push({ x, y: ph - 1 - y });
    }
    if (this.symmetryMode === 'both') {
      points.push({ x: pw - 1 - x, y: ph - 1 - y });
    }
    return points;
  }

  expandSymmetry(points, color) {
    const result = [];
    points.forEach(p => {
      this.getSymmetricalPoints(p.x, p.y).forEach(sp => {
        result.push({ x: sp.x, y: sp.y, color });
      });
    });
    return result;
  }

  getPixelColorAt(x, y) {
    const currentFrame = this.project.frames[this.activeFrameIndex];
    if (!currentFrame) return null;

    const pw = this.project.width;
    // Inspect layers top-to-bottom
    const layers = [...currentFrame.layers].reverse();
    for (const l of layers) {
      if (l.visible === false) continue;
      const c = l.pixels[y * pw + x];
      if (c && c !== 'transparent') return c;
    }
    return null;
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === 'b' || e.key === 'B') this.setTool('pencil');
      if (e.key === 'e' || e.key === 'E') this.setTool('eraser');
      if (e.key === 'l' || e.key === 'L') this.setTool('line');
      if (e.key === 'u' || e.key === 'U') this.setTool('rect');
      if (e.key === 'c' || e.key === 'C') this.setTool('circle');
      if (e.key === 'g' || e.key === 'G') this.setTool('bucket');
      if (e.key === 'i' || e.key === 'I') this.setTool('picker');
      if (e.key === 'd' || e.key === 'D') this.setTool('dither');
      if (e.key === 's' || e.key === 'S') this.setTool('select');
      if (e.key === 'm' || e.key === 'M') this.setTool('move');
      if (e.key === 'x' || e.key === 'X') this.swapColors();

      // Space -> Toggle Play Animation
      if (e.code === 'Space') {
        e.preventDefault();
        this.animation.togglePlay();
        this.renderAnimationTimeline();
      }

      // Delete Selection
      if (e.key === 'Delete' && this.selection) {
        this.deleteSelection();
      }

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        this.redo();
      }
    });
  }

  swapColors() {
    const temp = this.primaryColor;
    this.primaryColor = this.secondaryColor;
    this.secondaryColor = temp;
    this.renderColorPickerPanel();
  }

  addRecentColor(color) {
    if (!color || color === 'transparent') return;
    if (!this.recentColors.includes(color)) {
      this.recentColors.unshift(color);
      if (this.recentColors.length > 16) this.recentColors.pop();
    }
  }

  getActiveLayer() {
    const currentFrame = this.project.frames[this.activeFrameIndex];
    if (!currentFrame) return null;
    return currentFrame.layers.find(l => l.id === this.activeLayerId) || currentFrame.layers[0];
  }

  // --- Frame & Layer Manipulation ---
  setFrame(index) {
    this.activeFrameIndex = index;
    this.renderAll();
  }

  addFrame() {
    this.recordHistory('Add Frame');
    const pw = this.project.width;
    const ph = this.project.height;
    const newFrame = {
      id: 'frame_' + Date.now(),
      layers: [
        {
          id: 'layer_1',
          name: 'Layer 1',
          visible: true,
          locked: false,
          opacity: 1,
          pixels: new Array(pw * ph).fill('transparent')
        }
      ]
    };
    this.project.frames.push(newFrame);
    this.setFrame(this.project.frames.length - 1);
    this.autoSave();
  }

  duplicateFrame(index) {
    this.recordHistory('Duplicate Frame');
    const source = this.project.frames[index];
    const clone = JSON.parse(JSON.stringify(source));
    clone.id = 'frame_' + Date.now();
    this.project.frames.splice(index + 1, 0, clone);
    this.setFrame(index + 1);
    this.autoSave();
  }

  deleteFrame(index) {
    if (this.project.frames.length <= 1) return;
    this.recordHistory('Delete Frame');
    this.project.frames.splice(index, 1);
    this.setFrame(Math.max(0, index - 1));
    this.autoSave();
  }

  addLayer() {
    this.recordHistory('Add Layer');
    const currentFrame = this.project.frames[this.activeFrameIndex];
    const pw = this.project.width;
    const ph = this.project.height;
    const newLayer = {
      id: 'layer_' + Date.now(),
      name: 'Layer ' + (currentFrame.layers.length + 1),
      visible: true,
      locked: false,
      opacity: 1,
      pixels: new Array(pw * ph).fill('transparent')
    };
    currentFrame.layers.push(newLayer);
    this.activeLayerId = newLayer.id;
    this.renderAll();
    this.autoSave();
  }

  duplicateLayer(id) {
    this.recordHistory('Duplicate Layer');
    const currentFrame = this.project.frames[this.activeFrameIndex];
    const target = currentFrame.layers.find(l => l.id === id);
    if (!target) return;

    const clone = JSON.parse(JSON.stringify(target));
    clone.id = 'layer_' + Date.now();
    clone.name = target.name + ' (Copy)';
    currentFrame.layers.push(clone);
    this.activeLayerId = clone.id;
    this.renderAll();
    this.autoSave();
  }

  deleteLayer(id) {
    const currentFrame = this.project.frames[this.activeFrameIndex];
    if (currentFrame.layers.length <= 1) return;

    this.recordHistory('Delete Layer');
    currentFrame.layers = currentFrame.layers.filter(l => l.id !== id);
    this.activeLayerId = currentFrame.layers[0].id;
    this.renderAll();
    this.autoSave();
  }

  // --- Panels ---
  renderColorPickerPanel() {
    const container = document.getElementById('color-picker-container');
    if (!container) return;

    renderColorPanel(container, {
      primaryColor: this.primaryColor,
      secondaryColor: this.secondaryColor,
      recentColors: this.recentColors,
      onColorChange: (col, isSecondary) => {
        if (isSecondary) this.secondaryColor = col;
        else this.primaryColor = col;
        this.renderColorPickerPanel();
      },
      onPaletteChange: (pId) => {
        this.renderColorPickerPanel();
      }
    });
  }

  renderLayerStack() {
    const container = document.getElementById('layer-stack-container');
    if (!container) return;

    const currentFrame = this.project.frames[this.activeFrameIndex];
    renderLayerPanel(container, {
      layers: currentFrame ? currentFrame.layers : [],
      activeLayerId: this.activeLayerId,
      onSelectLayer: (id) => {
        this.activeLayerId = id;
        this.renderLayerStack();
      },
      onAddLayer: () => this.addLayer(),
      onDuplicateLayer: (id) => this.duplicateLayer(id),
      onDeleteLayer: (id) => this.deleteLayer(id),
      onToggleVisibility: (id) => {
        const l = currentFrame.layers.find(x => x.id === id);
        if (l) { l.visible = l.visible === false ? true : false; this.renderAll(); }
      },
      onToggleLock: (id) => {
        const l = currentFrame.layers.find(x => x.id === id);
        if (l) { l.locked = !l.locked; this.renderLayerStack(); }
      },
      onOpacityChange: (id, val) => {
        const l = currentFrame.layers.find(x => x.id === id);
        if (l) { l.opacity = val; this.requestRender(); this.autoSave(); }
      },
      onMoveLayer: (idx, dir) => {
        const target = idx + dir;
        if (target >= 0 && target < currentFrame.layers.length) {
          const temp = currentFrame.layers[idx];
          currentFrame.layers[idx] = currentFrame.layers[target];
          currentFrame.layers[target] = temp;
          this.renderAll();
          this.autoSave();
        }
      }
    });
  }

  renderAnimationTimeline() {
    const container = document.getElementById('timeline-container');
    if (!container) return;

    renderTimeline(container, {
      frames: this.project.frames || [],
      activeFrameIndex: this.activeFrameIndex,
      isPlaying: this.animation.isPlaying,
      fps: this.animation.fps,
      isLooping: this.animation.isLooping,
      showOnionSkin: this.showOnionSkin,
      projectWidth: this.project.width,
      projectHeight: this.project.height,
      onSelectFrame: (idx) => this.setFrame(idx),
      onAddFrame: () => this.addFrame(),
      onDuplicateFrame: (idx) => this.duplicateFrame(idx),
      onDeleteFrame: (idx) => this.deleteFrame(idx),
      onTogglePlay: () => {
        this.animation.togglePlay();
        this.renderAnimationTimeline();
      },
      onFPSChange: (fps) => {
        this.animation.fps = fps;
      },
      onToggleLoop: () => {
        this.animation.isLooping = !this.animation.isLooping;
        this.renderAnimationTimeline();
      },
      onToggleOnion: () => {
        this.showOnionSkin = !this.showOnionSkin;
        this.renderAnimationTimeline();
        this.requestRender();
      }
    });
  }

  // --- History (Undo / Redo) ---
  recordHistory(actionName = 'Edit') {
    this.undoStack.push(JSON.stringify(this.project));
    if (this.undoStack.length > this.maxHistory) this.undoStack.shift();
    this.redoStack = [];
    this.updateUndoRedoUI();
  }

  undo() {
    if (this.undoStack.length === 0) return;
    this.redoStack.push(JSON.stringify(this.project));
    this.project = JSON.parse(this.undoStack.pop());
    this.renderAll();
    this.updateUndoRedoUI();
    this.autoSave();
  }

  redo() {
    if (this.redoStack.length === 0) return;
    this.undoStack.push(JSON.stringify(this.project));
    this.project = JSON.parse(this.redoStack.pop());
    this.renderAll();
    this.updateUndoRedoUI();
    this.autoSave();
  }

  updateUndoRedoUI() {
    const u = document.getElementById('btn-undo');
    const r = document.getElementById('btn-redo');
    if (u) u.disabled = this.undoStack.length === 0;
    if (r) r.disabled = this.redoStack.length === 0;
  }

  // --- Export Functions ---
  exportPNG(scale = 8) {
    const currentFrame = this.project.frames[this.activeFrameIndex];
    if (!currentFrame) return;

    const frameCanvas = this.animation.renderFrameToCanvas(currentFrame, this.project.width, this.project.height, scale);
    const url = frameCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.project.name || 'pixel_art').toLowerCase().replace(/\s+/g, '_') + `_${scale}x.png`;
    a.click();
  }

  exportSpriteSheet(scale = 1) {
    const sheetCanvas = this.animation.generateSpriteSheet(null, scale);
    const url = sheetCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.project.name || 'spritesheet').toLowerCase().replace(/\s+/g, '_') + '_sheet.png';
    a.click();
  }

  exportAnimatedSVG(scale = 10) {
    const svgStr = this.animation.generateAnimatedSVG(scale);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.project.name || 'animation').toLowerCase().replace(/\s+/g, '_') + '.svg';
    a.click();
  }

  async exportVideo(scale = 8, loops = 3) {
    try {
      const blob = await this.animation.recordVideo(scale, loops);
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
      a.download = (this.project.name || 'animation').toLowerCase().replace(/\s+/g, '_') + `.${ext}`;
      a.click();
    } catch (err) {
      alert('Video export failed: ' + err.message);
    }
  }

  centerCanvas() {
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    const pw = this.project.width;
    const ph = this.project.height;
    const zoom = this.renderer.camera.zoom;

    this.renderer.camera.x = Math.round((cw - pw * zoom) / 2);
    this.renderer.camera.y = Math.round((ch - ph * zoom) / 2);
    this.requestRender();
    this.updateZoomLabel();
  }

  createNewProject(width = 32, height = 32) {
    this.recordHistory('New Project');
    this.project = {
      id: 'proj_' + Date.now(),
      name: 'Pixel Project',
      width,
      height,
      fps: 8,
      frames: [
        {
          id: 'frame_1',
          layers: [
            {
              id: 'layer_1',
              name: 'Layer 1',
              visible: true,
              locked: false,
              opacity: 1,
              pixels: new Array(width * height).fill('transparent')
            }
          ]
        }
      ]
    };
    this.activeFrameIndex = 0;
    this.activeLayerId = this.project.frames[0].layers[0].id;
    this.centerCanvas();
    this.renderAll();
    this.autoSave();
  }

  loadProject(projectData) {
    this.project = projectData;
    this.activeFrameIndex = 0;
    this.activeLayerId = this.project.frames[0]?.layers[0]?.id || 'layer_default';
    this.undoStack = [];
    this.redoStack = [];
    this.centerCanvas();
    this.renderAll();
    this.autoSave();
  }

  autoSave() {
    db.saveProject(this.project);
    this.updateStats();
  }

  updateZoomLabel() {
    const zLabel = document.getElementById('zoom-percentage-label');
    if (zLabel) {
      zLabel.textContent = `${Math.round(this.renderer.camera.zoom * 100)}% (${this.renderer.camera.zoom}x)`;
    }
  }

  updateCoordinatesReadout(px, py) {
    const coordEl = document.getElementById('pixel-coordinates-readout');
    if (coordEl) {
      const inBounds = px >= 0 && px < this.project.width && py >= 0 && py < this.project.height;
      coordEl.textContent = inBounds ? `X: ${px}, Y: ${py}` : `X: -, Y: -`;
    }
  }

  updateStats() {
    const statsEl = document.getElementById('project-stats-readout');
    if (statsEl) {
      const numFrames = (this.project.frames || []).length;
      statsEl.innerHTML = `Size: <strong>${this.project.width}x${this.project.height}</strong> &bull; Frames: <strong>${numFrames}</strong>`;
    }
  }
}

// Bootstrap
function startPixelForge() {
  const app = new PixelForgeApp();
  window.pixelForgeApp = app;
  app.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startPixelForge);
} else {
  startPixelForge();
}
