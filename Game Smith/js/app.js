/**
 * GameSmith - Master Workstation Orchestrator
 * Integrates Canvas Viewport, Game Runtime, Scene Tree, Inspector, Event Sheet, Modals, and Standalone Exporter.
 */

import { getIcon, escapeHTML } from './core/icons.js';
import { db } from './core/db.js';
import { audioSynth } from './core/audio-synth.js';
import { input } from './core/input.js';
import { GameRenderer } from './engine/renderer.js';
import { GameRuntime } from './engine/runtime.js';
import { renderSceneTreePanel } from './editor/scene-tree.js';
import { renderInspector } from './editor/inspector.js';
import { renderEventSheet } from './editor/event-sheet.js';
import { SpritePainterModal } from './editor/sprite-painter.js';
import { TEMPLATES } from './editor/templates.js';

class GameSmithApp {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.renderer = new GameRenderer(this.canvas);
    this.runtime = new GameRuntime(this.renderer);

    // Project state (deep copy of template)
    this.project = JSON.parse(JSON.stringify(TEMPLATES.platformer));
    this.currentScene = this.project.scenes[0];
    this.selectedObjectId = 'player';
    this.selectedObject = this.currentScene.objects.find(o => o.id === 'player') || null;

    // Viewport Editor state
    this.zoom = 1;
    this.panX = 80;
    this.panY = 40;
    this.isPanning = false;
    this.isDraggingObject = false;
    this.isResizingObject = false;
    this.resizeHandle = null; // 'nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'
    this.dragOffset = { x: 0, y: 0 };
    this.initialResizeState = null;
    this.gridSnap = true;
    this.gridSize = 32;
    this.showColliders = true;

    // Modals & Panels
    this.spritePainter = new SpritePainterModal(
      document.getElementById('gamesmith-modal-container'),
      (sprite) => this.handleSaveSprite(sprite)
    );

    this.isPlaying = false;
    this.activeMobileTab = 'canvas'; // 'hierarchy', 'canvas', 'events', 'inspector'
  }

  async init() {
    await db.init();

    // Resize canvas
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // Load saved project if exists
    try {
      const lastProjectId = localStorage.getItem('gamesmith_last_project_id');
      if (lastProjectId) {
        const saved = await db.loadProject(lastProjectId);
        if (saved && saved.scenes && saved.scenes.length > 0) {
          this.project = saved;
          this.currentScene = this.project.scenes[0];
          this.selectedObjectId = this.currentScene.objects[0]?.id || null;
          this.selectedObject = this.currentScene.objects[0] || null;
        }
      }
    } catch (e) {
      console.warn('Could not restore saved project:', e);
    }

    // Setup runtime callbacks
    this.runtime.onStateChange = (state, originalScene) => {
      if (state === 'stopped' && originalScene) {
        this.currentScene = originalScene;
        this.isPlaying = false;
        this.updatePlayToolbar();
        this.hideTouchGamepad();
        this.renderAll();
      } else if (state === 'playing') {
        this.isPlaying = true;
        this.updatePlayToolbar();
        this.showTouchGamepadIfMobile();
      } else if (state === 'paused') {
        this.updatePlayToolbar();
      }
    };

    this.setupToolbar();
    this.setupCanvasInteractions();
    this.setupShortcuts();
    this.setupTouchGamepad();
    this.renderAll();

    // Start editor render loop
    this.editorLoop = this.editorLoop.bind(this);
    requestAnimationFrame(this.editorLoop);
  }

  handleResize() {
    const container = document.getElementById('canvas-viewport-container');
    if (container && this.canvas) {
      this.renderer.resize(container.clientWidth, container.clientHeight);
    }
  }

  editorLoop() {
    if (!this.isPlaying) {
      this.renderEditorCanvas();
    }
    requestAnimationFrame(this.editorLoop);
  }

  renderEditorCanvas() {
    const r = this.renderer;
    r.clear(this.currentScene.bgColor || '#0d1117');

    // Draw editor grid
    r.drawGrid(this.gridSize, this.zoom, this.panX, this.panY);

    const ctx = r.ctx;
    ctx.save();
    ctx.translate(this.panX, this.panY);
    ctx.scale(this.zoom, this.zoom);

    // Draw world bounds
    r.drawWorldBounds(this.currentScene.bounds || { width: 1600, height: 800 }, { zoom: this.zoom });

    // Render scene objects sorted by layer
    const sorted = [...(this.currentScene.objects || [])].sort((a, b) => (a.layer || 0) - (b.layer || 0));
    for (const obj of sorted) {
      const isSel = obj.id === this.selectedObjectId;
      r.renderObject(obj, isSel, this.showColliders, this.project.sprites || {});
    }

    ctx.restore();
  }

  renderAll() {
    this.renderSceneSelector();
    this.renderSceneTree();
    this.renderInspectorPanel();
    this.renderBottomPanel();
    this.updateStats();
  }

  // --- Toolbar Setup ---
  setupToolbar() {
    // Play / Pause / Stop Buttons
    document.getElementById('btn-play-game')?.addEventListener('click', () => this.togglePlay());
    document.getElementById('btn-pause-game')?.addEventListener('click', () => this.runtime.pausePlay());
    document.getElementById('btn-stop-game')?.addEventListener('click', () => this.runtime.stopPlay());

    // Grid snap & size
    const gridToggle = document.getElementById('btn-toggle-grid');
    gridToggle?.addEventListener('click', () => {
      this.gridSnap = !this.gridSnap;
      gridToggle.classList.toggle('active', this.gridSnap);
      this.showToast(this.gridSnap ? 'Grid Snapping Enabled' : 'Grid Snapping Disabled');
    });

    document.getElementById('select-grid-size')?.addEventListener('change', (e) => {
      this.gridSize = parseInt(e.target.value, 10) || 32;
    });

    // Zoom controls
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
      this.zoom = Math.min(3.5, Number((this.zoom + 0.25).toFixed(2)));
      this.updateZoomBadge();
    });
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
      this.zoom = Math.max(0.25, Number((this.zoom - 0.25).toFixed(2)));
      this.updateZoomBadge();
    });
    document.getElementById('btn-zoom-reset')?.addEventListener('click', () => {
      this.zoom = 1; this.panX = 80; this.panY = 40;
      this.updateZoomBadge();
    });

    // Colliders wireframe toggle
    const colToggle = document.getElementById('btn-toggle-colliders');
    colToggle?.addEventListener('click', () => {
      this.showColliders = !this.showColliders;
      colToggle.classList.toggle('active', this.showColliders);
      this.showToast(this.showColliders ? 'Colliders Visible' : 'Colliders Hidden');
    });

    // Template Switcher
    document.getElementById('select-template')?.addEventListener('change', (e) => {
      const tKey = e.target.value;
      if (TEMPLATES[tKey]) {
        if (confirm(`Load template "${TEMPLATES[tKey].name}"? Current unsaved modifications will be replaced.`)) {
          this.loadProject(JSON.parse(JSON.stringify(TEMPLATES[tKey])));
          this.showToast(`Loaded Template: ${TEMPLATES[tKey].name}`);
        }
      }
    });

    // Export Project JSON
    document.getElementById('btn-export-project')?.addEventListener('click', () => {
      const json = JSON.stringify(this.project, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (this.project.name || 'game').toLowerCase().replace(/\s+/g, '_') + '.gamesmith.json';
      a.click();
      this.showToast('Project Exported to JSON');
    });

    // Export Standalone Playable HTML Game
    document.getElementById('btn-export-html')?.addEventListener('click', () => {
      this.exportStandaloneHTML();
    });

    // Import Project JSON
    const importInput = document.getElementById('file-import-project');
    document.getElementById('btn-import-project')?.addEventListener('click', () => importInput?.click());
    importInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (parsed && parsed.scenes && Array.isArray(parsed.scenes) && parsed.scenes.length > 0) {
            this.loadProject(parsed);
            this.showToast('Project Successfully Imported!');
          } else {
            alert('Invalid GameSmith project file structure.');
          }
        } catch (err) {
          alert('Failed to parse JSON project file: ' + err.message);
        }
      };
      reader.readAsText(file);
      importInput.value = '';
    });

    // Project Settings Modal
    document.getElementById('btn-project-settings')?.addEventListener('click', () => {
      this.openProjectSettingsModal();
    });

    // Keyboard Shortcuts Help
    document.getElementById('btn-help-shortcuts')?.addEventListener('click', () => {
      this.openShortcutsModal();
    });

    // New Scene Button
    document.getElementById('btn-new-scene')?.addEventListener('click', () => {
      const name = prompt('Enter scene name:', 'Level ' + (this.project.scenes.length + 1));
      if (name && name.trim()) {
        const newScene = {
          id: 'scene_' + Date.now(),
          name: name.trim(),
          bgColor: '#0d1117',
          gravity: 980,
          bounds: { width: 1600, height: 800 },
          objects: [
            {
              id: 'player',
              name: 'Player',
              tag: 'player',
              x: 100,
              y: 400,
              width: 32,
              height: 48,
              color: '#58a6ff',
              physicsType: 'dynamic',
              hasCollider: true,
              isSolid: false,
              behavior: 'player'
            },
            {
              id: 'floor',
              name: 'Ground Floor',
              tag: 'solid',
              x: 0,
              y: 640,
              width: 1600,
              height: 80,
              color: '#21262d',
              shape: 'platform',
              physicsType: 'static',
              hasCollider: true,
              isSolid: true
            }
          ],
          events: []
        };
        this.project.scenes.push(newScene);
        this.currentScene = newScene;
        this.selectedObjectId = 'player';
        this.selectedObject = newScene.objects[0];
        this.renderAll();
        this.autoSave();
        this.showToast(`Created Scene: ${newScene.name}`);
      }
    });

    // Mobile View Selector Tabs
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        this.setMobileView(view);
      });
    });
  }

  setMobileView(view) {
    this.activeMobileTab = view;
    document.querySelectorAll('.mobile-nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));

    const leftPanel = document.getElementById('scene-tree-container');
    const centerPanel = document.querySelector('.editor-center-workspace');
    const bottomPanel = document.getElementById('bottom-sheet-container');
    const rightPanel = document.getElementById('inspector-panel-container');

    if (window.innerWidth <= 1024) {
      if (leftPanel) leftPanel.style.display = view === 'hierarchy' ? 'flex' : 'none';
      if (centerPanel) centerPanel.style.display = (view === 'canvas' || view === 'events') ? 'flex' : 'none';
      if (bottomPanel) bottomPanel.style.display = view === 'events' ? 'flex' : 'none';
      if (rightPanel) rightPanel.style.display = view === 'inspector' ? 'flex' : 'none';
      this.handleResize();
    }
  }

  updateZoomBadge() {
    const zoomReset = document.getElementById('btn-zoom-reset');
    if (zoomReset) {
      zoomReset.textContent = Math.round(this.zoom * 100) + '%';
    }
  }

  // --- Canvas Interactions ---
  setupCanvasInteractions() {
    const canvas = this.canvas;

    const screenToWorld = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const sx = clientX - rect.left;
      const sy = clientY - rect.top;
      const wx = (sx - this.panX) / this.zoom;
      const wy = (sy - this.panY) / this.zoom;
      return { wx, wy, sx, sy };
    };

    const getResizeHandleUnderMouse = (obj, wx, wy) => {
      if (!obj) return null;
      const handleSize = 12 / this.zoom;
      const left = obj.x;
      const right = obj.x + obj.width;
      const top = obj.y;
      const bottom = obj.y + obj.height;
      const midX = obj.x + obj.width / 2;
      const midY = obj.y + obj.height / 2;

      const near = (px, py, tx, ty) => Math.hypot(px - tx, py - ty) < handleSize;

      if (near(wx, wy, left, top)) return 'nw';
      if (near(wx, wy, midX, top)) return 'n';
      if (near(wx, wy, right, top)) return 'ne';
      if (near(wx, wy, right, midY)) return 'e';
      if (near(wx, wy, right, bottom)) return 'se';
      if (near(wx, wy, midX, bottom)) return 's';
      if (near(wx, wy, left, bottom)) return 'sw';
      if (near(wx, wy, left, midY)) return 'w';

      return null;
    };

    canvas.addEventListener('mousedown', (e) => {
      if (this.isPlaying) return;

      const { wx, wy, sx, sy } = screenToWorld(e.clientX, e.clientY);

      // Middle click or Alt/Shift+click -> Pan
      if (e.button === 1 || e.altKey || (e.shiftKey && !this.selectedObject)) {
        this.isPanning = true;
        this.lastMouseX = sx;
        this.lastMouseY = sy;
        return;
      }

      // Check if clicking resize handles of currently selected object
      if (this.selectedObject && !this.selectedObject.locked) {
        const handle = getResizeHandleUnderMouse(this.selectedObject, wx, wy);
        if (handle) {
          this.isResizingObject = true;
          this.resizeHandle = handle;
          this.initialResizeState = {
            x: this.selectedObject.x,
            y: this.selectedObject.y,
            width: this.selectedObject.width,
            height: this.selectedObject.height,
            startWx: wx,
            startWy: wy
          };
          return;
        }
      }

      // Check object selection (top-most layer first)
      const sorted = [...(this.currentScene.objects || [])].reverse();
      let clickedObj = null;

      for (const obj of sorted) {
        if (obj.visible === false || obj.locked) continue;
        if (wx >= obj.x && wx <= obj.x + obj.width && wy >= obj.y && wy <= obj.y + obj.height) {
          clickedObj = obj;
          break;
        }
      }

      if (clickedObj) {
        this.selectedObjectId = clickedObj.id;
        this.selectedObject = clickedObj;
        this.isDraggingObject = true;
        this.dragOffset.x = wx - clickedObj.x;
        this.dragOffset.y = wy - clickedObj.y;
      } else {
        this.selectedObjectId = null;
        this.selectedObject = null;
      }

      this.renderSceneTree();
      this.renderInspectorPanel();
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isPlaying) {
        const rect = canvas.getBoundingClientRect();
        input.updateMouse(e.clientX - rect.left, e.clientY - rect.top, input.isMouseDown);
        return;
      }

      const { wx, wy, sx, sy } = screenToWorld(e.clientX, e.clientY);

      // Update cursor based on hover
      if (this.selectedObject && !this.isDraggingObject && !this.isPanning) {
        const handle = getResizeHandleUnderMouse(this.selectedObject, wx, wy);
        if (handle === 'nw' || handle === 'se') canvas.style.cursor = 'nwse-resize';
        else if (handle === 'ne' || handle === 'sw') canvas.style.cursor = 'nesw-resize';
        else if (handle === 'n' || handle === 's') canvas.style.cursor = 'ns-resize';
        else if (handle === 'e' || handle === 'w') canvas.style.cursor = 'ew-resize';
        else canvas.style.cursor = 'default';
      }

      if (this.isPanning) {
        this.panX += sx - this.lastMouseX;
        this.panY += sy - this.lastMouseY;
        this.lastMouseX = sx;
        this.lastMouseY = sy;
      } else if (this.isResizingObject && this.selectedObject && this.initialResizeState) {
        const init = this.initialResizeState;
        const dx = wx - init.startWx;
        const dy = wy - init.startWy;
        const minSize = 16;

        let newW = init.width;
        let newH = init.height;
        let newX = init.x;
        let newY = init.y;

        if (this.resizeHandle.includes('e')) newW = Math.max(minSize, init.width + dx);
        if (this.resizeHandle.includes('s')) newH = Math.max(minSize, init.height + dy);
        if (this.resizeHandle.includes('w')) {
          const clampedDx = Math.min(dx, init.width - minSize);
          newX = init.x + clampedDx;
          newW = init.width - clampedDx;
        }
        if (this.resizeHandle.includes('n')) {
          const clampedDy = Math.min(dy, init.height - minSize);
          newY = init.y + clampedDy;
          newH = init.height - clampedDy;
        }

        if (this.gridSnap) {
          newW = Math.round(newW / this.gridSize) * this.gridSize;
          newH = Math.round(newH / this.gridSize) * this.gridSize;
          newX = Math.round(newX / this.gridSize) * this.gridSize;
          newY = Math.round(newY / this.gridSize) * this.gridSize;
        }

        this.selectedObject.width = Math.max(minSize, newW);
        this.selectedObject.height = Math.max(minSize, newH);
        this.selectedObject.x = newX;
        this.selectedObject.y = newY;
        this.renderInspectorPanel();
      } else if (this.isDraggingObject && this.selectedObject) {
        let newX = wx - this.dragOffset.x;
        let newY = wy - this.dragOffset.y;

        if (this.gridSnap) {
          newX = Math.round(newX / this.gridSize) * this.gridSize;
          newY = Math.round(newY / this.gridSize) * this.gridSize;
        }

        this.selectedObject.x = newX;
        this.selectedObject.y = newY;
        this.renderInspectorPanel();
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isDraggingObject || this.isResizingObject) {
        this.autoSave();
      }
      this.isPanning = false;
      this.isDraggingObject = false;
      this.isResizingObject = false;
      this.resizeHandle = null;
      this.initialResizeState = null;
    });

    // Zoom wheel
    canvas.addEventListener('wheel', (e) => {
      if (this.isPlaying) return;
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      this.zoom = Math.max(0.25, Math.min(3.5, Number((this.zoom * zoomFactor).toFixed(2))));
      this.updateZoomBadge();
    }, { passive: false });
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      // Ctrl+P -> Toggle Play
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        this.togglePlay();
      }

      // Ctrl+S -> Save Project
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        this.autoSave();
        this.showToast('Project Saved Locally');
      }

      // Ctrl+D -> Duplicate selected
      if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D') && !this.isPlaying && this.selectedObjectId) {
        e.preventDefault();
        this.duplicateObject(this.selectedObjectId);
      }

      // Escape -> Stop Play
      if (e.key === 'Escape' && this.isPlaying) {
        this.runtime.stopPlay();
      }

      // Delete / Backspace -> Delete selected object
      if ((e.key === 'Delete' || e.key === 'Backspace') && !this.isPlaying && this.selectedObjectId) {
        this.deleteSelectedObject();
      }

      // G -> Toggle Grid
      if ((e.key === 'g' || e.key === 'G') && !this.isPlaying && !e.ctrlKey) {
        this.gridSnap = !this.gridSnap;
        document.getElementById('btn-toggle-grid')?.classList.toggle('active', this.gridSnap);
        this.showToast(this.gridSnap ? 'Grid Snapping Enabled' : 'Grid Snapping Disabled');
      }

      // C -> Toggle Colliders
      if ((e.key === 'c' || e.key === 'C') && !this.isPlaying && !e.ctrlKey) {
        this.showColliders = !this.showColliders;
        document.getElementById('btn-toggle-colliders')?.classList.toggle('active', this.showColliders);
        this.showToast(this.showColliders ? 'Colliders Visible' : 'Colliders Hidden');
      }
    });
  }

  // --- Touch Gamepad for Mobile Play ---
  setupTouchGamepad() {
    const pad = document.getElementById('mobile-touch-gamepad');
    if (!pad) return;

    const btnLeft = document.getElementById('touch-btn-left');
    const btnRight = document.getElementById('touch-btn-right');
    const btnUp = document.getElementById('touch-btn-up');
    const btnDown = document.getElementById('touch-btn-down');
    const btnA = document.getElementById('touch-btn-a');
    const btnB = document.getElementById('touch-btn-b');

    let currentAxisX = 0;
    let currentAxisY = 0;

    const updateVirtualInput = () => {
      input.setVirtualInput({
        axisX: currentAxisX,
        axisY: currentAxisY,
        jump: this.touchJumpPressed,
        action: this.touchActionPressed
      });
    };

    const attachButtonTouch = (el, onDown, onUp) => {
      if (!el) return;
      el.addEventListener('touchstart', (e) => { e.preventDefault(); onDown(); updateVirtualInput(); }, { passive: false });
      el.addEventListener('touchend', (e) => { e.preventDefault(); onUp(); updateVirtualInput(); }, { passive: false });
      el.addEventListener('mousedown', () => { onDown(); updateVirtualInput(); });
      el.addEventListener('mouseup', () => { onUp(); updateVirtualInput(); });
    };

    attachButtonTouch(btnLeft, () => { currentAxisX = -1; }, () => { currentAxisX = 0; });
    attachButtonTouch(btnRight, () => { currentAxisX = 1; }, () => { currentAxisX = 0; });
    attachButtonTouch(btnUp, () => { currentAxisY = -1; }, () => { currentAxisY = 0; });
    attachButtonTouch(btnDown, () => { currentAxisY = 1; }, () => { currentAxisY = 0; });
    attachButtonTouch(btnA, () => { this.touchJumpPressed = true; }, () => { this.touchJumpPressed = false; });
    attachButtonTouch(btnB, () => { this.touchActionPressed = true; }, () => { this.touchActionPressed = false; });
  }

  showTouchGamepadIfMobile() {
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.innerWidth <= 1024;
    const pad = document.getElementById('mobile-touch-gamepad');
    if (pad && isTouch) {
      pad.style.display = 'flex';
    }
  }

  hideTouchGamepad() {
    const pad = document.getElementById('mobile-touch-gamepad');
    if (pad) {
      pad.style.display = 'none';
    }
  }

  // --- Runtime Play Controls ---
  togglePlay() {
    if (this.isPlaying) {
      this.runtime.stopPlay();
    } else {
      this.runtime.startPlay(
        this.currentScene,
        this.project.variables || {},
        this.project.sprites || {}
      );
    }
  }

  updatePlayToolbar() {
    const playBtn = document.getElementById('btn-play-game');
    const pauseBtn = document.getElementById('btn-pause-game');
    const stopBtn = document.getElementById('btn-stop-game');
    const modeBadge = document.getElementById('editor-mode-badge');

    if (this.isPlaying) {
      if (playBtn) playBtn.className = 'btn btn-sm btn-ghost';
      if (pauseBtn) pauseBtn.className = 'btn btn-sm btn-secondary';
      if (stopBtn) stopBtn.className = 'btn btn-sm btn-danger';
      if (modeBadge) {
        modeBadge.className = 'badge badge-success font-mono text-xs';
        modeBadge.textContent = 'PLAY MODE (60 FPS)';
      }
    } else {
      if (playBtn) playBtn.className = 'btn btn-sm btn-primary';
      if (pauseBtn) pauseBtn.className = 'btn btn-sm btn-ghost';
      if (stopBtn) stopBtn.className = 'btn btn-sm btn-ghost';
      if (modeBadge) {
        modeBadge.className = 'badge badge-secondary font-mono text-xs';
        modeBadge.textContent = 'EDITOR MODE';
      }
    }
  }

  switchSceneInRuntime(sceneId) {
    const nextScene = this.project.scenes.find(s => s.id === sceneId);
    if (nextScene) {
      this.currentScene = nextScene;
      this.runtime.currentScene = JSON.parse(JSON.stringify(nextScene));
      this.runtime.runtimeObjects = this.runtime.currentScene.objects || [];
      this.runtime.playerObj = this.runtime.runtimeObjects.find(o => o.behavior === 'player' || o.behavior === 'topdown' || o.tag === 'player') || null;
      this.renderSceneSelector();
    }
  }

  // --- Scene & Object Actions ---
  renderSceneSelector() {
    const selector = document.getElementById('select-active-scene');
    if (selector) {
      selector.innerHTML = this.project.scenes.map(s => `
        <option value="${s.id}" ${s.id === this.currentScene.id ? 'selected' : ''}>Scene: ${escapeHTML(s.name)}</option>
      `).join('');

      selector.onchange = (e) => {
        const sId = e.target.value;
        const found = this.project.scenes.find(s => s.id === sId);
        if (found) {
          this.currentScene = found;
          this.selectedObjectId = this.currentScene.objects[0]?.id || null;
          this.selectedObject = this.currentScene.objects[0] || null;
          this.renderAll();
        }
      };
    }
  }

  renderSceneTree() {
    const container = document.getElementById('scene-tree-container');
    if (!container) return;

    renderSceneTreePanel(container, {
      currentScene: this.currentScene,
      selectedObjectId: this.selectedObjectId,
      projectVariables: this.project.variables || {},
      spriteLibrary: this.project.sprites || {},
      onSelectObject: (id) => {
        this.selectedObjectId = id;
        this.selectedObject = this.currentScene.objects.find(o => o.id === id) || null;
        this.renderSceneTree();
        this.renderInspectorPanel();
      },
      onAddObject: (preset) => this.addNewObject(preset),
      onDeleteObject: (id) => {
        this.selectedObjectId = id;
        this.deleteSelectedObject();
      },
      onDuplicateObject: (id) => this.duplicateObject(id),
      onToggleVisibility: (id) => {
        const obj = this.currentScene.objects.find(o => o.id === id);
        if (obj) {
          obj.visible = obj.visible === false ? true : false;
          this.renderSceneTree();
        }
      },
      onToggleLock: (id) => {
        const obj = this.currentScene.objects.find(o => o.id === id);
        if (obj) {
          obj.locked = !obj.locked;
          this.renderSceneTree();
        }
      },
      onReorderObject: () => {
        this.renderAll();
        this.autoSave();
      },
      onAddVariable: (name, val) => {
        if (!this.project.variables) this.project.variables = {};
        this.project.variables[name] = val;
        this.renderAll();
        this.autoSave();
      },
      onDeleteVariable: (name) => {
        delete this.project.variables[name];
        this.renderAll();
        this.autoSave();
      },
      onOpenSpritePainter: (sprite) => {
        this.spritePainter.open(sprite);
      },
      onDeleteSprite: (sId) => {
        delete this.project.sprites[sId];
        this.renderAll();
        this.autoSave();
      }
    });
  }

  renderInspectorPanel() {
    const container = document.getElementById('inspector-panel-container');
    if (!container) return;

    renderInspector(
      container,
      this.selectedObject,
      this.currentScene,
      this.project.sprites || {},
      () => {
        this.renderSceneTree();
        this.autoSave();
      },
      () => {
        this.deleteSelectedObject();
      }
    );
  }

  renderBottomPanel() {
    const container = document.getElementById('bottom-sheet-container');
    if (!container) return;

    renderEventSheet(
      container,
      this.currentScene,
      this.project.variables || {},
      () => this.autoSave()
    );
  }

  addNewObject(preset = 'platform') {
    const count = (this.currentScene.objects || []).length + 1;
    const centerX = Math.round((this.renderer.viewportWidth / 2 - this.panX) / this.zoom);
    const centerY = Math.round((this.renderer.viewportHeight / 2 - this.panY) / this.zoom);

    let newObj = {
      id: 'obj_' + Date.now(),
      name: 'Game Object ' + count,
      tag: 'solid',
      layer: 1,
      x: centerX - 24,
      y: centerY - 24,
      width: 48,
      height: 48,
      color: '#58a6ff',
      shape: 'rect',
      physicsType: 'static',
      hasCollider: true,
      isSolid: true
    };

    if (preset === 'platform') {
      newObj.name = 'Platform Tile ' + count;
      newObj.width = 160;
      newObj.height = 24;
      newObj.color = '#21262d';
      newObj.shape = 'platform';
    } else if (preset === 'player') {
      newObj.name = 'Player Knight';
      newObj.tag = 'player';
      newObj.width = 34;
      newObj.height = 48;
      newObj.color = '#58a6ff';
      newObj.physicsType = 'dynamic';
      newObj.isSolid = false;
      newObj.behavior = 'player';
    } else if (preset === 'enemy') {
      newObj.name = 'Security Drone';
      newObj.tag = 'enemy';
      newObj.width = 32;
      newObj.height = 32;
      newObj.color = '#f85149';
      newObj.shape = 'circle';
      newObj.colliderShape = 'circle';
      newObj.behavior = 'patrol';
      newObj.isSolid = false;
    } else if (preset === 'coin') {
      newObj.name = 'Energy Crystal ' + count;
      newObj.tag = 'crystal';
      newObj.width = 24;
      newObj.height = 24;
      newObj.color = '#f1e05a';
      newObj.shape = 'coin';
      newObj.colliderShape = 'circle';
      newObj.isSolid = false;
      newObj.behavior = 'sine_hover';
    } else if (preset === 'spike') {
      newObj.name = 'Spike Hazard';
      newObj.tag = 'hazard';
      newObj.width = 96;
      newObj.height = 24;
      newObj.color = '#f85149';
      newObj.shape = 'spike';
      newObj.isSolid = false;
    } else if (preset === 'portal') {
      newObj.name = 'Warp Gate';
      newObj.tag = 'portal';
      newObj.width = 48;
      newObj.height = 100;
      newObj.color = '#3fb950';
      newObj.shape = 'portal';
      newObj.isSolid = false;
    } else if (preset === 'circle') {
      newObj.name = 'Orb Body';
      newObj.shape = 'circle';
      newObj.colliderShape = 'circle';
      newObj.color = '#a371f7';
    } else if (preset === 'text') {
      newObj.name = 'Text Label';
      newObj.shape = 'text';
      newObj.text = 'Welcome to GameSmith';
      newObj.width = 180;
      newObj.height = 30;
      newObj.color = '#f0f6fc';
      newObj.physicsType = 'none';
      newObj.hasCollider = false;
    }

    if (!this.currentScene.objects) this.currentScene.objects = [];
    this.currentScene.objects.push(newObj);
    this.selectedObjectId = newObj.id;
    this.selectedObject = newObj;
    this.renderAll();
    this.autoSave();
    this.showToast(`Added: ${newObj.name}`);
  }

  duplicateObject(id) {
    const target = this.currentScene.objects.find(o => o.id === id);
    if (!target) return;

    const clone = JSON.parse(JSON.stringify(target));
    clone.id = 'obj_' + Date.now();
    clone.name = target.name + ' (Copy)';
    clone.x += 32;
    clone.y += 32;

    this.currentScene.objects.push(clone);
    this.selectedObjectId = clone.id;
    this.selectedObject = clone;
    this.renderAll();
    this.autoSave();
    this.showToast(`Duplicated: ${clone.name}`);
  }

  deleteSelectedObject() {
    if (!this.selectedObjectId) return;
    const idx = this.currentScene.objects.findIndex(o => o.id === this.selectedObjectId);
    if (idx !== -1) {
      const name = this.currentScene.objects[idx].name;
      this.currentScene.objects.splice(idx, 1);
      this.selectedObjectId = null;
      this.selectedObject = null;
      this.renderAll();
      this.autoSave();
      this.showToast(`Deleted: ${name}`);
    }
  }

  handleSaveSprite(sprite) {
    if (!this.project.sprites) this.project.sprites = {};
    this.project.sprites[sprite.id] = sprite;
    db.saveCustomSprite(sprite);
    this.renderAll();
    this.autoSave();
    this.showToast(`Sprite "${sprite.name}" Saved`);
  }

  loadProject(projectData) {
    this.project = projectData;
    this.currentScene = this.project.scenes[0];
    this.selectedObjectId = this.currentScene.objects[0]?.id || null;
    this.selectedObject = this.currentScene.objects[0] || null;
    this.renderAll();
    this.autoSave();
  }

  autoSave() {
    db.saveProject(this.project);
    this.updateStats();
  }

  updateStats() {
    const statsEl = document.getElementById('project-stats-info');
    if (statsEl) {
      const objCount = (this.currentScene.objects || []).length;
      const ruleCount = (this.currentScene.events || []).length;
      statsEl.innerHTML = `Project: <strong>${escapeHTML(this.project.name || 'Untitled')}</strong> &bull; Objects: <strong>${objCount}</strong> &bull; Rules: <strong>${ruleCount}</strong> &bull; Scenes: <strong>${this.project.scenes.length}</strong>`;
    }
  }

  showToast(message, duration = 2500) {
    let toast = document.getElementById('gamesmith-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'gamesmith-toast';
      toast.className = 'gamesmith-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  openProjectSettingsModal() {
    const modalContainer = document.getElementById('gamesmith-modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="proj-settings-title" style="width: 480px;">
        <div class="modal-header">
          <div class="flex items-center gap-2">
            ${getIcon('settings', 'icon-sm text-primary')}
            <span class="font-bold text-sm" id="proj-settings-title">Project Settings</span>
          </div>
          <button class="btn-icon-xs btn-modal-close" aria-label="Close dialog">&times;</button>
        </div>
        <div class="modal-body p-4 flex flex-col gap-3">
          <div class="form-group">
            <label class="form-label" for="proj-name-input">Project Title</label>
            <input type="text" id="proj-name-input" class="form-control" value="${escapeHTML(this.project.name || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label" for="proj-author-input">Creator / Studio Name</label>
            <input type="text" id="proj-author-input" class="form-control" value="${escapeHTML(this.project.author || 'Game Developer')}" />
          </div>
          <div class="form-group">
            <label class="form-label" for="proj-desc-input">Game Description</label>
            <textarea id="proj-desc-input" class="form-control" rows="3">${escapeHTML(this.project.description || '')}</textarea>
          </div>
        </div>
        <div class="modal-footer p-3 border-t flex justify-end gap-2">
          <button class="btn btn-sm btn-secondary btn-modal-close">Cancel</button>
          <button class="btn btn-sm btn-primary" id="btn-save-project-settings">Save Settings</button>
        </div>
      </div>
    `;

    modalContainer.classList.add('active');
    const close = () => modalContainer.classList.remove('active');

    modalContainer.querySelectorAll('.btn-modal-close, .modal-backdrop').forEach(b => b.addEventListener('click', close));

    modalContainer.querySelector('#btn-save-project-settings')?.addEventListener('click', () => {
      this.project.name = modalContainer.querySelector('#proj-name-input').value.trim() || 'Untitled Game';
      this.project.author = modalContainer.querySelector('#proj-author-input').value.trim() || 'Game Developer';
      this.project.description = modalContainer.querySelector('#proj-desc-input').value.trim();
      this.autoSave();
      this.updateStats();
      this.showToast('Project Settings Updated');
      close();
    });
  }

  openShortcutsModal() {
    const modalContainer = document.getElementById('gamesmith-modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="shortcuts-title" style="width: 520px;">
        <div class="modal-header">
          <div class="flex items-center gap-2">
            ${getIcon('keyboard', 'icon-sm text-primary')}
            <span class="font-bold text-sm" id="shortcuts-title">Keyboard Shortcuts & Guide</span>
          </div>
          <button class="btn-icon-xs btn-modal-close" aria-label="Close dialog">&times;</button>
        </div>
        <div class="modal-body p-4 flex flex-col gap-3">
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="card p-2">
              <div class="font-bold text-primary mb-1">Editor Controls</div>
              <div class="flex justify-between py-1 border-b"><span>Play / Stop Game</span><kbd class="badge badge-secondary">Ctrl + P</kbd></div>
              <div class="flex justify-between py-1 border-b"><span>Save Project</span><kbd class="badge badge-secondary">Ctrl + S</kbd></div>
              <div class="flex justify-between py-1 border-b"><span>Duplicate Object</span><kbd class="badge badge-secondary">Ctrl + D</kbd></div>
              <div class="flex justify-between py-1 border-b"><span>Delete Object</span><kbd class="badge badge-secondary">Delete / Backspace</kbd></div>
              <div class="flex justify-between py-1 border-b"><span>Toggle Grid</span><kbd class="badge badge-secondary">G</kbd></div>
              <div class="flex justify-between py-1"><span>Toggle Colliders</span><kbd class="badge badge-secondary">C</kbd></div>
            </div>
            <div class="card p-2">
              <div class="font-bold text-emerald mb-1">Gameplay Controls</div>
              <div class="flex justify-between py-1 border-b"><span>Move Left / Right</span><kbd class="badge badge-secondary">A / D or &larr; / &rarr;</kbd></div>
              <div class="flex justify-between py-1 border-b"><span>Jump / Double Jump</span><kbd class="badge badge-secondary">Space / W / &uarr;</kbd></div>
              <div class="flex justify-between py-1 border-b"><span>Action / Shoot</span><kbd class="badge badge-secondary">Space / J / Z</kbd></div>
              <div class="flex justify-between py-1 border-b"><span>Restart Scene</span><kbd class="badge badge-secondary">R</kbd></div>
              <div class="flex justify-between py-1"><span>Return to Editor</span><kbd class="badge badge-secondary">ESC</kbd></div>
            </div>
          </div>
          <div class="card p-2 text-xs text-muted">
            <strong>Mouse & Viewport:</strong> Middle click or Alt+drag to pan canvas. Mouse wheel to zoom in/out. Click and drag resize handles on selected objects to change width and height.
          </div>
        </div>
        <div class="modal-footer p-3 border-t flex justify-end">
          <button class="btn btn-sm btn-primary btn-modal-close">Got It</button>
        </div>
      </div>
    `;

    modalContainer.classList.add('active');
    const close = () => modalContainer.classList.remove('active');
    modalContainer.querySelectorAll('.btn-modal-close, .modal-backdrop').forEach(b => b.addEventListener('click', close));
  }

  exportStandaloneHTML() {
    const projectJson = JSON.stringify(this.project);
    const title = escapeHTML(this.project.name || 'GameSmith Game');

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body { background: #000; color: #fff; font-family: -apple-system, sans-serif; overflow: hidden; width: 100vw; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    #game-canvas { display: block; width: 100vw; height: 100vh; object-fit: contain; }
    .touch-pad { position: fixed; bottom: 20px; left: 20px; right: 20px; display: none; justify-content: space-between; z-index: 100; pointer-events: none; }
    .touch-btn { width: 56px; height: 56px; border-radius: 50%; background: rgba(255,255,255,0.25); border: 2px solid rgba(255,255,255,0.5); color: #fff; font-size: 20px; display: flex; align-items: center; justify-content: center; pointer-events: auto; }
    .touch-dpad { display: grid; grid-template-columns: repeat(3, 56px); gap: 6px; }
  </style>
</head>
<body>
  <canvas id="game-canvas"></canvas>
  <div class="touch-pad" id="touch-pad">
    <div class="touch-dpad">
      <div></div><button class="touch-btn" id="t-up">&uarr;</button><div></div>
      <button class="touch-btn" id="t-left">&larr;</button><div></div><button class="touch-btn" id="t-right">&rarr;</button>
      <div></div><button class="touch-btn" id="t-down">&darr;</button><div></div>
    </div>
    <div style="display: flex; gap: 14px; align-items: flex-end;">
      <button class="touch-btn" id="t-a" style="width: 64px; height: 64px; background: rgba(88,166,255,0.4);">A</button>
      <button class="touch-btn" id="t-b" style="width: 64px; height: 64px; background: rgba(63,185,80,0.4);">B</button>
    </div>
  </div>
  <script>
    const PROJECT_DATA = ${projectJson};
  </script>
  <script src="bundle.js"></script>
  <script>
    // Auto launch in standalone player
    window.addEventListener('DOMContentLoaded', () => {
      if (window.gameSmithApp) {
        window.gameSmithApp.loadProject(PROJECT_DATA);
        window.gameSmithApp.togglePlay();
      }
    });
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.project.name || 'game').toLowerCase().replace(/\s+/g, '_') + '_standalone.html';
    a.click();
    this.showToast('Exported Standalone Game HTML');
  }
}

// Bootstrap
function startGameSmith() {
  const app = new GameSmithApp();
  window.gameSmithApp = app;
  app.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startGameSmith);
} else {
  startGameSmith();
}
