/**
 * PixelForge - Master Pixel Art Workstation Orchestrator
 * Integrates Canvas Renderer, Drawing Algorithms, Animation Engine, Layer Manager,
 * Color Picker, Tilemap Studio, Modals, History, and Touch / Pointer interactions.
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
  flipPixelsHorizontal,
  flipPixelsVertical,
  rotatePixels90CW,
  resizePixelBuffer,
  scalePixelBuffer,
  replaceColorInPixels,
  adjustPixelsBrightnessContrast,
  invertPixels,
  grayscalePixels,
  hexToRgb,
  rgbToHex
} from './core/math-draw.js';
import { CanvasRenderer } from './engine/canvas-renderer.js';
import { AnimationEngine } from './engine/animation.js';
import { TilemapEngine } from './engine/tilemap.js';
import { renderLayerPanel } from './editor/layer-manager.js';
import { renderColorPanel } from './editor/color-picker.js';
import { renderTimeline } from './editor/timeline.js';
import { TEMPLATES } from './editor/templates.js';
import {
  showToast,
  showConfirmModal,
  showNewProjectModal,
  showExportModal,
  showResizeModal,
  showFiltersModal,
  showTilemapModal,
  showShortcutsModal,
  showPaletteManagerModal
} from './editor/modals.js';
import { getPalette } from './core/palettes.js';

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
    this.activeTool = 'pencil'; // pencil, eraser, line, rect, rectFill, circle, circleFill, bucket, picker, dither, select, move, colorReplace
    this.primaryColor = '#58a6ff';
    this.secondaryColor = '#000000';
    this.brushSize = 1;
    this.pixelPerfect = true;
    this.symmetryMode = 'none'; // none, horizontal, vertical, both
    this.showGrid = true;
    this.showOnionSkin = false;
    this.currentPaletteId = 'pico8';
    this.customPalette = [];
    this.ditherThreshold = 8;

    // Pointer Interaction State
    this.isDrawing = false;
    this.isPanning = false;
    this.isMovingSelection = false;
    this.panStart = { x: 0, y: 0 };
    this.drawStart = { x: 0, y: 0 };
    this.strokePoints = [];
    this.activePreviewPixels = [];
    this.selection = null;
    this.floatingSelection = null; // { x, y, width, height, pixels }
    this.clipboardData = null; // Copied pixel matrix
    this.cursorPos = { x: 0, y: 0 };

    // Multi-touch tracking
    this.activePointers = new Map();
    this.initialPinchDist = 0;
    this.initialPinchZoom = 16;

    // Recent colors history
    this.recentColors = ['#58a6ff', '#000000', '#ffffff', '#e11d48', '#00e5ff', '#334155', '#3fb950', '#d29922'];

    // History stack
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 35;
  }

  async init() {
    await db.init();

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // Load saved project if exists in database
    try {
      const lastId = localStorage.getItem('pixelforge_last_project_id');
      if (lastId) {
        const saved = await db.loadProject(lastId);
        if (saved && saved.frames && saved.frames.length > 0) {
          this.project = saved;
          this.activeFrameIndex = 0;
          this.activeLayerId = this.project.frames[0].layers[0]?.id || 'default';
        }
      }
    } catch (e) {}

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
      onionSkinOpacity: 0.3,
      symmetryMode: this.symmetryMode,
      activePreviewPixels: this.activePreviewPixels,
      selection: this.selection,
      floatingSelection: this.floatingSelection,
      cursorPos: this.cursorPos,
      brushSize: this.brushSize,
      backgroundColor: this.project.background || 'transparent'
    });
  }

  renderAll() {
    this.renderColorPickerPanel();
    this.renderLayerStack();
    this.renderAnimationTimeline();
    this.updateStats();
    this.updateProjectTitleUI();
    this.requestRender();
  }

  // --- Toolbar Setup ---
  setupToolbar() {
    // Tool buttons in left palette
    document.querySelectorAll('.btn-pixel-tool').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setTool(btn.dataset.tool);
      });
    });

    // Brush Size
    const brushSelect = document.getElementById('select-brush-size');
    brushSelect?.addEventListener('change', (e) => {
      this.brushSize = parseInt(e.target.value, 10) || 1;
      this.requestRender();
    });

    // Pixel-Perfect Toggle
    const ppBtn = document.getElementById('btn-toggle-pixel-perfect');
    ppBtn?.addEventListener('click', () => {
      this.pixelPerfect = !this.pixelPerfect;
      ppBtn.classList.toggle('active', this.pixelPerfect);
      showToast(this.pixelPerfect ? 'Pixel-Perfect Enabled' : 'Pixel-Perfect Disabled', 'info');
    });

    // Symmetry Mode Selector
    const symSelect = document.getElementById('select-symmetry-mode');
    symSelect?.addEventListener('change', (e) => {
      this.symmetryMode = e.target.value;
      this.requestRender();
    });

    // Project Template Switcher
    const templateSelect = document.getElementById('select-project-template');
    templateSelect?.addEventListener('change', (e) => {
      const tKey = e.target.value;
      if (TEMPLATES[tKey]) {
        showConfirmModal({
          title: 'Load Project Template',
          message: `Load template "${TEMPLATES[tKey].name}"? Unsaved changes in your current project will be replaced.`,
          confirmText: 'Load Template',
          onConfirm: () => {
            this.loadProject(JSON.parse(JSON.stringify(TEMPLATES[tKey])));
            showToast(`Loaded ${TEMPLATES[tKey].name}`, 'success');
          }
        });
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
      this.renderer.camera.zoom = Math.min(64, Math.round(this.renderer.camera.zoom * 1.25));
      this.requestRender();
      this.updateZoomLabel();
    });
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
      this.renderer.camera.zoom = Math.max(1, Math.round(this.renderer.camera.zoom * 0.8));
      this.requestRender();
      this.updateZoomLabel();
    });

    const zoomLabel = document.getElementById('zoom-percentage-label');
    zoomLabel?.addEventListener('click', () => {
      this.renderer.camera.zoom = 16;
      this.centerCanvas();
    });

    document.getElementById('btn-fit-canvas')?.addEventListener('click', () => this.centerCanvas());

    // Modals Triggers
    document.getElementById('btn-new-project')?.addEventListener('click', () => {
      showNewProjectModal((opts) => this.createNewProject(opts));
    });

    document.getElementById('btn-open-export-modal')?.addEventListener('click', () => {
      showExportModal(this);
    });

    document.getElementById('btn-open-resize-modal')?.addEventListener('click', () => {
      showResizeModal(this, (res) => this.applyCanvasResize(res));
    });

    document.getElementById('btn-open-filters-modal')?.addEventListener('click', () => {
      showFiltersModal(this, (f) => this.applyColorAdjustments(f));
    });

    document.getElementById('btn-open-tilemap')?.addEventListener('click', () => {
      showTilemapModal(this);
    });

    document.getElementById('btn-open-shortcuts')?.addEventListener('click', () => {
      showShortcutsModal();
    });

    // Quick Transformations
    document.getElementById('btn-flip-h')?.addEventListener('click', () => this.flipHorizontal());
    document.getElementById('btn-flip-v')?.addEventListener('click', () => this.flipVertical());
    document.getElementById('btn-rotate-90')?.addEventListener('click', () => this.rotate90());

    // Direct Export PNG button
    document.getElementById('btn-export-png')?.addEventListener('click', () => {
      showExportModal(this);
    });

    // Direct Export Sheet button
    document.getElementById('btn-export-sheet')?.addEventListener('click', () => {
      showExportModal(this);
    });

    // Direct Export SVG button
    document.getElementById('btn-export-svg')?.addEventListener('click', () => {
      this.exportAnimatedSVG(10);
    });

    // Direct Export Video button
    document.getElementById('btn-export-video')?.addEventListener('click', () => {
      this.exportVideo(8, 3);
    });

    // Save JSON
    document.getElementById('btn-export-json')?.addEventListener('click', () => {
      this.exportProjectJSON();
    });

    // Import JSON File
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
            showToast('Project imported successfully!', 'success');
          } else {
            showToast('Invalid project JSON structure.', 'warning');
          }
        } catch (err) {
          showToast('Failed to parse JSON file: ' + err.message, 'error');
        }
      };
      reader.readAsText(file);
      importInput.value = '';
    });

    // Inline Project Name Editing
    const titleInput = document.getElementById('project-name-input');
    titleInput?.addEventListener('change', (e) => {
      const val = e.target.value.trim();
      if (val) {
        this.project.name = val;
        this.autoSave();
      }
    });
  }

  setTool(toolName) {
    // Commit floating selection if moving tools
    if (this.floatingSelection) {
      this.stampFloatingSelection();
    }

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

    // Pointer Down (Mouse, Stylus, Touch)
    canvas.addEventListener('pointerdown', (e) => {
      canvas.setPointerCapture(e.pointerId);
      this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      // Multi-touch pinch zoom detection
      if (this.activePointers.size === 2) {
        const pts = Array.from(this.activePointers.values());
        this.initialPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        this.initialPinchZoom = this.renderer.camera.zoom;
        return;
      }

      const { px, py, sx, sy } = screenToPixel(e.clientX, e.clientY);

      // Pan with Middle Click, Hand Tool, or Space / Alt modifier
      if (e.button === 1 || this.activeTool === 'move' || e.altKey || e.shiftKey) {
        this.isPanning = true;
        this.panStart = { x: sx, y: sy };
        return;
      }

      if (e.button !== 0 && e.button !== 2 && e.pointerType === 'mouse') return;
      const isRightClick = e.button === 2;
      const drawColor = isRightClick ? this.secondaryColor : this.primaryColor;

      // Handle Floating Selection Interaction
      if (this.floatingSelection) {
        const { x, y, width, height } = this.floatingSelection;
        if (px >= x && px < x + width && py >= y && py < y + height) {
          // Drag floating selection
          this.isMovingSelection = true;
          this.drawStart = { x: px, y: py };
          return;
        } else {
          // Click outside stamps selection
          this.stampFloatingSelection();
        }
      }

      // Eyedropper / Color Picker (or Alt+Click)
      if (this.activeTool === 'picker') {
        const pickedColor = this.getPixelColorAt(px, py);
        if (pickedColor && pickedColor !== 'transparent') {
          if (isRightClick) this.secondaryColor = pickedColor;
          else this.primaryColor = pickedColor;
          this.renderColorPickerPanel();
          showToast(`Picked ${pickedColor}`, 'info', 1200);
        }
        return;
      }

      // Color Replace Tool
      if (this.activeTool === 'colorReplace') {
        const activeLayer = this.getActiveLayer();
        if (activeLayer && !activeLayer.locked) {
          const targetColor = activeLayer.pixels[py * this.project.width + px];
          if (targetColor && targetColor.toLowerCase() !== drawColor.toLowerCase()) {
            this.recordHistory('Replace Color');
            activeLayer.pixels = replaceColorInPixels(activeLayer.pixels, targetColor, drawColor, this.selection, this.project.width, this.project.height);
            this.renderAll();
            this.autoSave();
            showToast(`Replaced ${targetColor} with ${drawColor}`, 'success');
          }
        }
        return;
      }

      // Flood Fill / Paint Bucket
      if (this.activeTool === 'bucket') {
        const activeLayer = this.getActiveLayer();
        if (activeLayer && !activeLayer.locked) {
          this.recordHistory('Bucket Fill');
          const filled = floodFill(activeLayer.pixels, this.project.width, this.project.height, px, py, drawColor);
          filled.forEach(p => {
            activeLayer.pixels[p.y * this.project.width + p.x] = p.color;
          });
          this.renderAll();
          this.autoSave();
        }
        return;
      }

      // Drawing Tools Start
      this.isDrawing = true;
      this.drawStart = { x: px, y: py };
      this.strokePoints = [{ x: px, y: py }];

      if (['pencil', 'eraser', 'dither'].includes(this.activeTool)) {
        this.recordHistory('Draw Stroke');
        this.applyPixelStroke([{ x: px, y: py }], drawColor);
        this.requestRender();
      }
    });

    // Pointer Move
    window.addEventListener('pointermove', (e) => {
      if (this.activePointers.has(e.pointerId)) {
        this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }

      // Handle 2-Finger Pinch Zoom & Pan
      if (this.activePointers.size === 2) {
        const pts = Array.from(this.activePointers.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (this.initialPinchDist > 0) {
          const factor = dist / this.initialPinchDist;
          this.renderer.camera.zoom = Math.max(1, Math.min(64, Math.round(this.initialPinchZoom * factor)));
          this.requestRender();
          this.updateZoomLabel();
        }
        return;
      }

      const { px, py, sx, sy } = screenToPixel(e.clientX, e.clientY);
      this.cursorPos = { x: px, y: py };
      this.updateCoordinatesReadout(px, py);

      // Panning
      if (this.isPanning) {
        this.renderer.camera.x += sx - this.panStart.x;
        this.renderer.camera.y += sy - this.panStart.y;
        this.panStart = { x: sx, y: sy };
        this.requestRender();
        return;
      }

      // Moving Floating Selection
      if (this.isMovingSelection && this.floatingSelection) {
        const dx = px - this.drawStart.x;
        const dy = py - this.drawStart.y;
        this.floatingSelection.x += dx;
        this.floatingSelection.y += dy;
        this.drawStart = { x: px, y: py };
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
          const linePts = getLinePixels(last.x, last.y, px, py);
          this.strokePoints.push(...linePts);
          this.applyPixelStroke(linePts, drawColor);
          this.requestRender();
        }
        return;
      }

      // Shape Previews
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

    // Pointer Up
    const onPointerUp = (e) => {
      if (this.activePointers.has(e.pointerId)) {
        this.activePointers.delete(e.pointerId);
      }

      if (this.isDrawing) {
        // Commit shape preview pixels to layer
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
      this.isMovingSelection = false;
    };

    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Mouse wheel zoom
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const { sx, sy } = screenToPixel(e.clientX, e.clientY);
      const zoomFactor = e.deltaY < 0 ? 1.25 : 0.8;
      const oldZoom = this.renderer.camera.zoom;
      const newZoom = Math.max(1, Math.min(64, Math.round(oldZoom * zoomFactor)));

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
      const offset = Math.floor(this.brushSize / 2);
      for (let by = 0; by < this.brushSize; by++) {
        for (let bx = 0; bx < this.brushSize; bx++) {
          const px = pt.x - offset + bx;
          const py = pt.y - offset + by;

          const symmetricalPoints = this.getSymmetricalPoints(px, py);
          symmetricalPoints.forEach(sp => {
            if (sp.x >= 0 && sp.x < pw && sp.y >= 0 && sp.y < ph) {
              // Respect active selection boundary
              if (this.selection && !this.isPointInsideSelection(sp.x, sp.y)) {
                return;
              }

              let finalColor = color;
              if (this.activeTool === 'eraser') {
                finalColor = 'transparent';
              } else if (this.activeTool === 'dither') {
                finalColor = getDitherColor(sp.x, sp.y, this.primaryColor, this.secondaryColor, this.ditherThreshold);
              }
              activeLayer.pixels[sp.y * pw + sp.x] = finalColor;
            }
          });
        }
      }
    });

    this.addRecentColor(color);
  }

  isPointInsideSelection(x, y) {
    if (!this.selection) return true;
    const minX = Math.min(this.selection.x0, this.selection.x1);
    const maxX = Math.max(this.selection.x0, this.selection.x1);
    const minY = Math.min(this.selection.y0, this.selection.y1);
    const maxY = Math.max(this.selection.y0, this.selection.y1);
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
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
    const layers = [...currentFrame.layers].reverse();
    for (const l of layers) {
      if (l.visible === false || !l.pixels) continue;
      const c = l.pixels[y * pw + x];
      if (c && c !== 'transparent') return c;
    }
    return null;
  }

  // --- Keyboard Shortcuts ---
  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      // Tools
      if (e.key === 'b' || e.key === 'B') this.setTool('pencil');
      if (e.key === 'e' || e.key === 'E') this.setTool('eraser');
      if (e.key === 'l' || e.key === 'L') this.setTool('line');
      if (e.key === 'u' || e.key === 'U') this.setTool('rect');
      if (e.key === 'c' && !e.ctrlKey && !e.metaKey) this.setTool('circle');
      if (e.key === 'g' || e.key === 'G') this.setTool('bucket');
      if (e.key === 'i' || e.key === 'I') this.setTool('picker');
      if (e.key === 'd' && !e.ctrlKey && !e.metaKey) this.setTool('dither');
      if (e.key === 's' && !e.ctrlKey && !e.metaKey) this.setTool('select');
      if (e.key === 'm' || e.key === 'M') this.setTool('move');
      if (e.key === 'r' && !e.ctrlKey && !e.metaKey) this.setTool('colorReplace');
      if (e.key === 'x' || e.key === 'X') this.swapColors();

      // Brush Size
      if (e.key === '[') {
        this.brushSize = Math.max(1, this.brushSize - 1);
        const sel = document.getElementById('select-brush-size');
        if (sel) sel.value = this.brushSize;
        this.requestRender();
      }
      if (e.key === ']') {
        this.brushSize = Math.min(4, this.brushSize + 1);
        const sel = document.getElementById('select-brush-size');
        if (sel) sel.value = this.brushSize;
        this.requestRender();
      }

      // Space -> Toggle Play Animation
      if (e.code === 'Space') {
        e.preventDefault();
        this.animation.togglePlay();
        this.renderAnimationTimeline();
      }

      // Navigation Arrows
      if (e.key === 'ArrowLeft') {
        this.animation.stepPrev();
      }
      if (e.key === 'ArrowRight') {
        this.animation.stepNext();
      }

      // Selection shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        this.selectAll();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D') || e.key === 'Escape') {
        e.preventDefault();
        this.deselect();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        this.copySelection();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'x' || e.key === 'X')) {
        e.preventDefault();
        this.cutSelection();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        this.pasteSelection();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (this.selection) {
          e.preventDefault();
          this.deleteSelection();
        }
      }

      // Help
      if (e.key === '?' || e.key === 'F1') {
        e.preventDefault();
        showShortcutsModal();
      }

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        this.redo();
      }
    });
  }

  // --- Selection Engine ---
  selectAll() {
    this.selection = {
      x0: 0,
      y0: 0,
      x1: this.project.width - 1,
      y1: this.project.height - 1
    };
    this.requestRender();
  }

  deselect() {
    if (this.floatingSelection) {
      this.stampFloatingSelection();
    }
    this.selection = null;
    this.requestRender();
  }

  deleteSelection() {
    if (!this.selection) return;
    const activeLayer = this.getActiveLayer();
    if (!activeLayer || activeLayer.locked) return;

    this.recordHistory('Clear Selection');
    const minX = Math.max(0, Math.min(this.selection.x0, this.selection.x1));
    const maxX = Math.min(this.project.width - 1, Math.max(this.selection.x0, this.selection.x1));
    const minY = Math.max(0, Math.min(this.selection.y0, this.selection.y1));
    const maxY = Math.min(this.project.height - 1, Math.max(this.selection.y0, this.selection.y1));

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        activeLayer.pixels[y * this.project.width + x] = 'transparent';
      }
    }

    this.renderAll();
    this.autoSave();
    showToast('Selection cleared', 'info');
  }

  copySelection() {
    if (!this.selection) return;
    const activeLayer = this.getActiveLayer();
    if (!activeLayer) return;

    const minX = Math.max(0, Math.min(this.selection.x0, this.selection.x1));
    const maxX = Math.min(this.project.width - 1, Math.max(this.selection.x0, this.selection.x1));
    const minY = Math.max(0, Math.min(this.selection.y0, this.selection.y1));
    const maxY = Math.min(this.project.height - 1, Math.max(this.selection.y0, this.selection.y1));

    const w = maxX - minX + 1;
    const h = maxY - minY + 1;
    const pixels = new Array(w * h).fill('transparent');

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        pixels[y * w + x] = activeLayer.pixels[(minY + y) * this.project.width + (minX + x)];
      }
    }

    this.clipboardData = { width: w, height: h, pixels };
    showToast(`Copied ${w}×${h} px selection`, 'success');
  }

  cutSelection() {
    if (!this.selection) return;
    this.copySelection();
    this.deleteSelection();
  }

  pasteSelection() {
    if (!this.clipboardData) {
      showToast('Clipboard is empty. Copy a selection first (Ctrl+C).', 'warning');
      return;
    }

    this.floatingSelection = {
      x: 0,
      y: 0,
      width: this.clipboardData.width,
      height: this.clipboardData.height,
      pixels: [...this.clipboardData.pixels]
    };

    this.requestRender();
    showToast('Pasted floating selection. Drag to move or click to stamp.', 'info');
  }

  stampFloatingSelection() {
    if (!this.floatingSelection) return;
    const activeLayer = this.getActiveLayer();
    if (activeLayer && !activeLayer.locked) {
      this.recordHistory('Stamp Selection');
      const { x, y, width, height, pixels } = this.floatingSelection;
      const pw = this.project.width;
      const ph = this.project.height;

      for (let py = 0; py < height; py++) {
        for (let px = 0; px < width; px++) {
          const targetX = x + px;
          const targetY = y + py;
          if (targetX >= 0 && targetX < pw && targetY >= 0 && targetY < ph) {
            const col = pixels[py * width + px];
            if (col && col !== 'transparent') {
              activeLayer.pixels[targetY * pw + targetX] = col;
            }
          }
        }
      }
    }

    this.floatingSelection = null;
    this.renderAll();
    this.autoSave();
  }

  // --- Transformations ---
  flipHorizontal() {
    const activeLayer = this.getActiveLayer();
    if (!activeLayer || activeLayer.locked) return;
    this.recordHistory('Flip Horizontal');
    activeLayer.pixels = flipPixelsHorizontal(activeLayer.pixels, this.project.width, this.project.height, this.selection);
    this.renderAll();
    this.autoSave();
    showToast('Flipped Horizontally', 'info');
  }

  flipVertical() {
    const activeLayer = this.getActiveLayer();
    if (!activeLayer || activeLayer.locked) return;
    this.recordHistory('Flip Vertical');
    activeLayer.pixels = flipPixelsVertical(activeLayer.pixels, this.project.width, this.project.height, this.selection);
    this.renderAll();
    this.autoSave();
    showToast('Flipped Vertically', 'info');
  }

  rotate90() {
    const activeLayer = this.getActiveLayer();
    if (!activeLayer || activeLayer.locked) return;
    this.recordHistory('Rotate 90° CW');
    activeLayer.pixels = rotatePixels90CW(activeLayer.pixels, this.project.width, this.project.height);
    this.renderAll();
    this.autoSave();
    showToast('Rotated 90° Clockwise', 'info');
  }

  applyCanvasResize({ mode, width, height, anchor, pixelScale }) {
    this.recordHistory('Resize Canvas');

    if (mode === 'canvas') {
      const oldW = this.project.width;
      const oldH = this.project.height;
      this.project.width = width;
      this.project.height = height;

      this.project.frames.forEach(frame => {
        frame.layers.forEach(layer => {
          layer.pixels = resizePixelBuffer(layer.pixels, oldW, oldH, width, height, anchor);
        });
      });
      showToast(`Canvas resized to ${width}×${height} px`, 'success');
    } else {
      const oldW = this.project.width;
      const oldH = this.project.height;
      const newW = Math.round(oldW * pixelScale);
      const newH = Math.round(oldH * pixelScale);
      this.project.width = newW;
      this.project.height = newH;

      this.project.frames.forEach(frame => {
        frame.layers.forEach(layer => {
          const scaled = scalePixelBuffer(layer.pixels, oldW, oldH, pixelScale);
          layer.pixels = scaled.pixels;
        });
      });
      showToast(`Resampled canvas ${pixelScale}× to ${newW}×${newH} px`, 'success');
    }

    this.centerCanvas();
    this.renderAll();
    this.autoSave();
  }

  applyColorAdjustments({ brightness = 0, contrast = 0, effect = null, scope = 'active-layer' }) {
    this.recordHistory('Adjust Colors');

    const modifyPixels = (pixels) => {
      let res = pixels;
      if (effect === 'invert') res = invertPixels(res);
      else if (effect === 'grayscale') res = grayscalePixels(res);
      else if (brightness !== 0 || contrast !== 0) res = adjustPixelsBrightnessContrast(res, brightness, contrast);
      return res;
    };

    if (scope === 'active-layer') {
      const l = this.getActiveLayer();
      if (l && !l.locked) l.pixels = modifyPixels(l.pixels);
    } else if (scope === 'all-layers') {
      const curFrame = this.project.frames[this.activeFrameIndex];
      if (curFrame) {
        curFrame.layers.forEach(l => {
          if (!l.locked) l.pixels = modifyPixels(l.pixels);
        });
      }
    } else if (scope === 'all-frames') {
      this.project.frames.forEach(frame => {
        frame.layers.forEach(l => {
          if (!l.locked) l.pixels = modifyPixels(l.pixels);
        });
      });
    }

    this.renderAll();
    this.autoSave();
    showToast('Applied color adjustments', 'success');
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

  getCurrentPaletteColors() {
    const pal = getPalette(this.currentPaletteId);
    return pal ? pal.colors : this.customPalette;
  }

  setCustomPalette(colors) {
    this.customPalette = colors;
    this.currentPaletteId = 'custom';
    this.renderColorPickerPanel();
  }

  // --- Frame & Layer Manipulation ---
  setFrame(index) {
    this.activeFrameIndex = Math.max(0, Math.min((this.project.frames.length - 1), index));
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
          blendMode: 'normal',
          pixels: new Array(pw * ph).fill('transparent')
        }
      ]
    };
    this.project.frames.push(newFrame);
    this.setFrame(this.project.frames.length - 1);
    this.autoSave();
    showToast(`Added Frame #${this.project.frames.length}`, 'success');
  }

  duplicateFrame(index) {
    this.recordHistory('Duplicate Frame');
    const source = this.project.frames[index];
    const clone = JSON.parse(JSON.stringify(source));
    clone.id = 'frame_' + Date.now();
    this.project.frames.splice(index + 1, 0, clone);
    this.setFrame(index + 1);
    this.autoSave();
    showToast(`Duplicated Frame #${index + 1}`, 'success');
  }

  deleteFrame(index) {
    if (this.project.frames.length <= 1) return;
    this.recordHistory('Delete Frame');
    this.project.frames.splice(index, 1);
    this.setFrame(Math.max(0, index - 1));
    this.autoSave();
    showToast(`Deleted Frame #${index + 1}`, 'info');
  }

  moveFrame(index, dir) {
    const target = index + dir;
    if (target >= 0 && target < this.project.frames.length) {
      this.recordHistory('Reorder Frames');
      const temp = this.project.frames[index];
      this.project.frames[index] = this.project.frames[target];
      this.project.frames[target] = temp;
      this.setFrame(target);
      this.autoSave();
    }
  }

  reverseFrames() {
    if (this.project.frames.length <= 1) return;
    this.recordHistory('Reverse Frames');
    this.project.frames.reverse();
    this.renderAll();
    this.autoSave();
    showToast('Reversed animation frames order', 'success');
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
      blendMode: 'normal',
      pixels: new Array(pw * ph).fill('transparent')
    };
    currentFrame.layers.push(newLayer);
    this.activeLayerId = newLayer.id;
    this.renderAll();
    this.autoSave();
    showToast('Created new layer', 'success');
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
    showToast(`Duplicated layer "${target.name}"`, 'success');
  }

  deleteLayer(id) {
    const currentFrame = this.project.frames[this.activeFrameIndex];
    if (currentFrame.layers.length <= 1) return;

    this.recordHistory('Delete Layer');
    currentFrame.layers = currentFrame.layers.filter(l => l.id !== id);
    this.activeLayerId = currentFrame.layers[0].id;
    this.renderAll();
    this.autoSave();
    showToast('Deleted layer', 'info');
  }

  renameLayer(id, newName) {
    const currentFrame = this.project.frames[this.activeFrameIndex];
    const target = currentFrame.layers.find(l => l.id === id);
    if (target) {
      target.name = newName;
      this.renderLayerStack();
      this.autoSave();
    }
  }

  mergeDownLayer(idx) {
    const currentFrame = this.project.frames[this.activeFrameIndex];
    if (idx <= 0 || !currentFrame || !currentFrame.layers[idx]) return;

    this.recordHistory('Merge Down Layer');
    const topLayer = currentFrame.layers[idx];
    const bottomLayer = currentFrame.layers[idx - 1];
    const pw = this.project.width;
    const ph = this.project.height;

    for (let y = 0; y < ph; y++) {
      for (let x = 0; x < pw; x++) {
        const topCol = topLayer.pixels[y * pw + x];
        if (topCol && topCol !== 'transparent') {
          bottomLayer.pixels[y * pw + x] = topCol;
        }
      }
    }

    currentFrame.layers.splice(idx, 1);
    this.activeLayerId = bottomLayer.id;
    this.renderAll();
    this.autoSave();
    showToast(`Merged "${topLayer.name}" down into "${bottomLayer.name}"`, 'success');
  }

  flattenLayers() {
    const currentFrame = this.project.frames[this.activeFrameIndex];
    if (!currentFrame || currentFrame.layers.length <= 1) return;

    this.recordHistory('Flatten Layers');
    const pw = this.project.width;
    const ph = this.project.height;
    const flatPixels = new Array(pw * ph).fill('transparent');

    for (const layer of currentFrame.layers) {
      if (layer.visible === false || !layer.pixels) continue;
      for (let y = 0; y < ph; y++) {
        for (let x = 0; x < pw; x++) {
          const col = layer.pixels[y * pw + x];
          if (col && col !== 'transparent') {
            flatPixels[y * pw + x] = col;
          }
        }
      }
    }

    currentFrame.layers = [
      {
        id: 'layer_flattened_' + Date.now(),
        name: 'Flattened Image',
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: 'normal',
        pixels: flatPixels
      }
    ];

    this.activeLayerId = currentFrame.layers[0].id;
    this.renderAll();
    this.autoSave();
    showToast('Flattened all visible layers', 'success');
  }

  // --- Panels ---
  renderColorPickerPanel() {
    const container = document.getElementById('color-picker-container');
    if (!container) return;

    renderColorPanel(container, {
      primaryColor: this.primaryColor,
      secondaryColor: this.secondaryColor,
      currentPaletteId: this.currentPaletteId,
      customPalette: this.customPalette,
      recentColors: this.recentColors,
      ditherThreshold: this.ditherThreshold,
      onColorChange: (col, isSecondary) => {
        if (isSecondary) this.secondaryColor = col;
        else this.primaryColor = col;
        this.renderColorPickerPanel();
      },
      onPaletteChange: (pId) => {
        this.currentPaletteId = pId;
        this.renderColorPickerPanel();
      },
      onAddColorToPalette: (col) => {
        if (!this.customPalette.includes(col)) {
          this.customPalette.push(col);
          this.currentPaletteId = 'custom';
          this.renderColorPickerPanel();
          showToast(`Added ${col} to palette`, 'success');
        }
      },
      onOpenPaletteManager: () => {
        showPaletteManagerModal(this);
      },
      onDitherThresholdChange: (val) => {
        this.ditherThreshold = val;
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
      onRenameLayer: (id, name) => this.renameLayer(id, name),
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
      onBlendModeChange: (id, mode) => {
        const l = currentFrame.layers.find(x => x.id === id);
        if (l) { l.blendMode = mode; this.requestRender(); this.autoSave(); }
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
      },
      onMergeDown: (idx) => this.mergeDownLayer(idx),
      onFlatten: () => this.flattenLayers()
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
      playMode: this.animation.playMode,
      showOnionSkin: this.showOnionSkin,
      projectWidth: this.project.width,
      projectHeight: this.project.height,
      onSelectFrame: (idx) => this.setFrame(idx),
      onAddFrame: () => this.addFrame(),
      onDuplicateFrame: (idx) => this.duplicateFrame(idx),
      onDeleteFrame: (idx) => this.deleteFrame(idx),
      onMoveFrame: (idx, dir) => this.moveFrame(idx, dir),
      onReverseFrames: () => this.reverseFrames(),
      onTogglePlay: () => {
        this.animation.togglePlay();
        this.renderAnimationTimeline();
      },
      onStepNext: () => this.animation.stepNext(),
      onStepPrev: () => this.animation.stepPrev(),
      onFPSChange: (fps) => {
        this.animation.fps = fps;
      },
      onPlayModeChange: (mode) => {
        this.animation.playMode = mode;
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
    showToast('Undo', 'info', 1000);
  }

  redo() {
    if (this.redoStack.length === 0) return;
    this.undoStack.push(JSON.stringify(this.project));
    this.project = JSON.parse(this.redoStack.pop());
    this.renderAll();
    this.updateUndoRedoUI();
    this.autoSave();
    showToast('Redo', 'info', 1000);
  }

  updateUndoRedoUI() {
    const u = document.getElementById('btn-undo');
    const r = document.getElementById('btn-redo');
    if (u) u.disabled = this.undoStack.length === 0;
    if (r) r.disabled = this.redoStack.length === 0;
  }

  // --- Export Actions ---
  exportPNG(scale = 8) {
    const currentFrame = this.project.frames[this.activeFrameIndex];
    if (!currentFrame) return;

    const frameCanvas = this.animation.renderFrameToCanvas(currentFrame, this.project.width, this.project.height, scale, this.project.background);
    const url = frameCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.project.name || 'pixel_art').toLowerCase().replace(/\s+/g, '_') + `_${scale}x.png`;
    a.click();
    showToast(`Exported ${scale}× PNG (${this.project.width * scale}×${this.project.height * scale} px)`, 'success');
  }

  exportAllFramesPNG(scale = 8) {
    this.project.frames.forEach((frame, idx) => {
      const frameCanvas = this.animation.renderFrameToCanvas(frame, this.project.width, this.project.height, scale, this.project.background);
      const a = document.createElement('a');
      a.href = frameCanvas.toDataURL('image/png');
      a.download = (this.project.name || 'pixel_art').toLowerCase().replace(/\s+/g, '_') + `_frame_${idx + 1}.png`;
      a.click();
    });
    showToast(`Exported all ${this.project.frames.length} frames as PNGs`, 'success');
  }

  exportSpriteSheetWithAtlas(columns = null, scale = 1, includeAtlas = true) {
    const { canvas, atlasJSON } = this.animation.generateSpriteSheet(columns, scale, 0, this.project.background);
    const baseName = (this.project.name || 'spritesheet').toLowerCase().replace(/\s+/g, '_');

    // Download PNG
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${baseName}_sheet.png`;
    a.click();

    // Download JSON Atlas
    if (includeAtlas) {
      setTimeout(() => {
        const jsonBlob = new Blob([JSON.stringify(atlasJSON, null, 2)], { type: 'application/json' });
        const ja = document.createElement('a');
        ja.href = URL.createObjectURL(jsonBlob);
        ja.download = `${baseName}_atlas.json`;
        ja.click();
      }, 200);
    }

    showToast('Exported sprite sheet and atlas metadata', 'success');
  }

  exportAnimatedSVG(scale = 10) {
    const svgStr = this.animation.generateAnimatedSVG(scale);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (this.project.name || 'animation').toLowerCase().replace(/\s+/g, '_') + '.svg';
    a.click();
    showToast('Exported vector Animated SVG', 'success');
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
      showToast('Video recording saved!', 'success');
    } catch (err) {
      showToast('Video export failed: ' + err.message, 'error');
    }
  }

  exportProjectJSON() {
    const json = JSON.stringify(this.project, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (this.project.name || 'project').toLowerCase().replace(/\s+/g, '_') + '.pixelforge.json';
    a.click();
    showToast('Project file saved (.pixelforge.json)', 'success');
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

  createNewProject({ name = 'Pixel Artwork', width = 32, height = 32, background = 'transparent', paletteId = 'pico8' }) {
    this.recordHistory('New Project');
    this.currentPaletteId = paletteId;
    this.project = {
      id: 'proj_' + Date.now(),
      name,
      width,
      height,
      background,
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
              blendMode: 'normal',
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
    showToast(`Created new project "${name}" (${width}×${height})`, 'success');
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
      zLabel.textContent = `${Math.round(this.renderer.camera.zoom * 100)}%`;
    }
  }

  updateCoordinatesReadout(px, py) {
    const coordEl = document.getElementById('pixel-coordinates-readout');
    if (coordEl) {
      const inBounds = px >= 0 && px < this.project.width && py >= 0 && py < this.project.height;
      if (inBounds) {
        const color = this.getPixelColorAt(px, py) || 'Empty';
        coordEl.innerHTML = `X: <strong>${px}</strong>, Y: <strong>${py}</strong> &bull; <span class="font-mono text-xs">${color}</span>`;
      } else {
        coordEl.textContent = `X: -, Y: -`;
      }
    }
  }

  updateStats() {
    const statsEl = document.getElementById('project-stats-readout');
    if (statsEl) {
      const numFrames = (this.project.frames || []).length;
      statsEl.innerHTML = `Canvas: <strong>${this.project.width}×${this.project.height}</strong> &bull; Frames: <strong>${numFrames}</strong> &bull; Layers: <strong>${(this.project.frames[this.activeFrameIndex]?.layers || []).length}</strong>`;
    }
  }

  updateProjectTitleUI() {
    const titleInput = document.getElementById('project-name-input');
    if (titleInput) {
      titleInput.value = this.project.name || 'Pixel Artwork';
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
