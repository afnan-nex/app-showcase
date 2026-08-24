/**
 * MediaStudio — Main Application Coordinator
 */

import { CANVAS_PRESETS, AVAILABLE_FONTS, FILTER_PRESETS, SAMPLE_STOCK_MEDIA, DESIGN_TEMPLATES, createProceduralGradientDataUrl } from './presets-data.js';
import { CanvasEngine } from './canvas-engine.js';
import { ToolEngine } from './tool-engine.js';
import { TransformEngine } from './transform-engine.js';
import { HistoryEngine } from './history-engine.js';
import { storageEngine } from './storage-engine.js';
import { ExportEngine } from './export-engine.js';
import { ImageLayer, TextLayer, ShapeLayer, DrawingLayer } from './layer-engine.js';

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
