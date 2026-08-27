/**
 * GameSmith - Main Workstation Orchestrator
 * Integrates Canvas Editor Viewport, Game Runtime, Scene Tree, Inspector, Event Sheet, and Project Storage.
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

    // Project state
    this.project = TEMPLATES.platformer;
    this.currentScene = this.project.scenes[0];
    this.selectedObjectId = 'player';
    this.selectedObject = this.currentScene.objects.find(o => o.id === 'player') || null;

    // Viewport Editor state
    this.zoom = 1;
    this.panX = 100;
    this.panY = 60;
    this.isPanning = false;
    this.isDraggingObject = false;
    this.dragOffset = { x: 0, y: 0 };
    this.gridSnap = true;
    this.gridSize = 32;
    this.showColliders = true;

    // Modals & Panels
    this.spritePainter = new SpritePainterModal(
      document.getElementById('gamesmith-modal-container'),
      (sprite) => this.handleSaveSprite(sprite)
    );

    this.isPlaying = false;
    this.activeBottomTab = 'events'; // events, console
  }

  async init() {
    await db.init();

    // Resize canvas
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // Load saved project if exists
    const lastProjectId = localStorage.getItem('gamesmith_last_project_id');
    if (lastProjectId) {
      const saved = await db.loadProject(lastProjectId);
      if (saved && saved.scenes && saved.scenes.length > 0) {
        this.project = saved;
        this.currentScene = this.project.scenes[0];
      }
    }

    // Setup runtime callbacks
    this.runtime.onStateChange = (state, originalScene) => {
      if (state === 'stopped' && originalScene) {
        this.currentScene = originalScene;
        this.isPlaying = false;
        this.updatePlayToolbar();
        this.renderAll();
      } else if (state === 'playing') {
        this.isPlaying = true;
        this.updatePlayToolbar();
      }
    };

    this.setupToolbar();
    this.setupCanvasInteractions();
    this.setupShortcuts();
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
    r.drawWorldBounds(this.currentScene.bounds || { width: 1280, height: 720 }, { zoom: this.zoom });

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
    });

    document.getElementById('select-grid-size')?.addEventListener('change', (e) => {
      this.gridSize = parseInt(e.target.value, 10) || 32;
    });

    // Zoom controls
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
      this.zoom = Math.min(3, this.zoom + 0.25);
    });
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
      this.zoom = Math.max(0.25, this.zoom - 0.25);
    });
    document.getElementById('btn-zoom-reset')?.addEventListener('click', () => {
      this.zoom = 1; this.panX = 100; this.panY = 60;
    });

    // Colliders wireframe toggle
    const colToggle = document.getElementById('btn-toggle-colliders');
    colToggle?.addEventListener('click', () => {
      this.showColliders = !this.showColliders;
      colToggle.classList.toggle('active', this.showColliders);
    });

    // Template Switcher
    document.getElementById('select-template')?.addEventListener('change', (e) => {
      const tKey = e.target.value;
      if (TEMPLATES[tKey]) {
        if (confirm(`Load template "${TEMPLATES[tKey].name}"? Unsaved edits in current project will be replaced.`)) {
          this.loadProject(JSON.parse(JSON.stringify(TEMPLATES[tKey])));
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
          if (parsed && parsed.scenes && parsed.scenes.length > 0) {
            this.loadProject(parsed);
          } else {
            alert('Invalid GameSmith project file structure.');
          }
        } catch (err) {
          alert('Failed to parse JSON project file: ' + err.message);
        }
      };
      reader.readAsText(file);
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
          bounds: { width: 1280, height: 720 },
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
              name: 'Ground',
              tag: 'solid',
              x: 0,
              y: 600,
              width: 1280,
              height: 80,
              color: '#21262d',
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
      }
    });
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

    canvas.addEventListener('mousedown', (e) => {
      if (this.isPlaying) return;

      const { wx, wy, sx, sy } = screenToWorld(e.clientX, e.clientY);

      // Middle click or Alt+click -> Pan
      if (e.button === 1 || e.altKey || e.shiftKey) {
        this.isPanning = true;
        this.lastMouseX = sx;
        this.lastMouseY = sy;
        return;
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

      if (this.isPanning) {
        this.panX += sx - this.lastMouseX;
        this.panY += sy - this.lastMouseY;
        this.lastMouseX = sx;
        this.lastMouseY = sy;
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
      if (this.isDraggingObject) {
        this.autoSave();
      }
      this.isPanning = false;
      this.isDraggingObject = false;
    });

    // Zoom wheel
    canvas.addEventListener('wheel', (e) => {
      if (this.isPlaying) return;
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      this.zoom = Math.max(0.25, Math.min(3, this.zoom * zoomFactor));
    });
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      // Space / Enter -> Toggle Play
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        this.togglePlay();
      }

      // Escape -> Stop Play
      if (e.key === 'Escape' && this.isPlaying) {
        this.runtime.stopPlay();
      }

      // Delete / Backspace -> Delete selected object
      if ((e.key === 'Delete' || e.key === 'Backspace') && !this.isPlaying && this.selectedObjectId) {
        this.deleteSelectedObject();
      }
    });
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
      this.runtime.playerObj = this.runtime.runtimeObjects.find(o => o.behavior === 'player') || null;
      this.renderSceneSelector();
    }
  }

  // --- Scene & Object Actions ---
  renderSceneSelector() {
    const selector = document.getElementById('select-active-scene');
    if (selector) {
      selector.innerHTML = this.project.scenes.map(s => `
        <option value="${s.id}" ${s.id === this.currentScene.id ? 'selected' : ''}>${escapeHTML(s.name)}</option>
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
      onAddObject: () => this.addNewObject(),
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
      onOpenSpritePainter: () => {
        this.spritePainter.open();
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

  addNewObject() {
    const count = (this.currentScene.objects || []).length + 1;
    const newObj = {
      id: 'obj_' + Date.now(),
      name: 'Game Object ' + count,
      tag: 'solid',
      layer: 1,
      x: Math.round((this.renderer.canvas.width / 2 - this.panX) / this.zoom),
      y: Math.round((this.renderer.canvas.height / 2 - this.panY) / this.zoom),
      width: 48,
      height: 48,
      color: '#58a6ff',
      shape: 'rect',
      physicsType: 'static',
      hasCollider: true,
      isSolid: true
    };

    if (!this.currentScene.objects) this.currentScene.objects = [];
    this.currentScene.objects.push(newObj);
    this.selectedObjectId = newObj.id;
    this.selectedObject = newObj;
    this.renderAll();
    this.autoSave();
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
  }

  deleteSelectedObject() {
    if (!this.selectedObjectId) return;
    const idx = this.currentScene.objects.findIndex(o => o.id === this.selectedObjectId);
    if (idx !== -1) {
      this.currentScene.objects.splice(idx, 1);
      this.selectedObjectId = null;
      this.selectedObject = null;
      this.renderAll();
      this.autoSave();
    }
  }

  handleSaveSprite(sprite) {
    if (!this.project.sprites) this.project.sprites = {};
    this.project.sprites[sprite.id] = sprite;
    db.saveCustomSprite(sprite);
    this.renderAll();
    this.autoSave();
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
      statsEl.innerHTML = `Objects: <strong>${objCount}</strong> &bull; Rules: <strong>${ruleCount}</strong> &bull; Scenes: <strong>${this.project.scenes.length}</strong>`;
    }
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
