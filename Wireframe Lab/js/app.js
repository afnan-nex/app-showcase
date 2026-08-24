/* ==========================================================================
   WIREFRAMELAB - MAIN APPLICATION BOOTSTRAP & ORCHESTRATION
   ========================================================================== */

import { state } from './state.js';
import { initDB, getAllProjects, saveProject, deleteProject, getActiveProjectId, setActiveProjectId, getProject } from './db.js';
import { createNewProject, generateId, COMPONENT_DEFINITIONS, ARTBOARD_PRESETS } from './models.js';
import { CanvasRenderer } from './renderer.js';
import { CanvasController } from './canvas.js';
import { InteractionController } from './interaction.js';
import { LayersController } from './layers.js';
import { PropertiesController } from './properties.js';
import { PrototypeController } from './prototype.js';
import { ExportController } from './export.js';
import { CommandPaletteController } from './command-palette.js';
import { ShortcutsManager } from './shortcuts.js';
import { STARTER_TEMPLATES } from './templates.js';

class WireframeLabApp {
  constructor() {
    this.init();
  }

  async init() {
    // 1. Initialize IndexedDB & Load Project
    await initDB();
    await this.loadInitialProject();

    // 2. Initialize Controllers
    this.exportCtrl = new ExportController();
    this.shortcutsMgr = new ShortcutsManager();

    // DOM Elements
    const worldEl = document.getElementById('canvas-world');
    const overlayEl = document.getElementById('selection-overlay-container');
    const wiresEl = document.getElementById('prototype-wires-layer');
    const viewportEl = document.getElementById('canvas-viewport');
    const rulerHEl = document.getElementById('canvas-ruler-h');
    const rulerVEl = document.getElementById('canvas-ruler-v');
    const guidesEl = document.getElementById('canvas-guides-container');

    this.renderer = new CanvasRenderer(worldEl, overlayEl, wiresEl);
    this.canvasCtrl = new CanvasController(viewportEl, rulerHEl, rulerVEl);
    window.appCanvasCtrl = this.canvasCtrl;

    this.interactionCtrl = new InteractionController(viewportEl, worldEl, this.canvasCtrl, guidesEl);

    const layersContainerEl = document.getElementById('layers-tree-container');
    this.layersCtrl = new LayersController(layersContainerEl);

    const propsContainerEl = document.getElementById('properties-inspector-container');
    this.propsCtrl = new PropertiesController(propsContainerEl);

    // Prototype Player Elements
    const playerOverlayEl = document.getElementById('prototype-player-overlay');
    const screenCanvasEl = document.getElementById('player-screen-canvas');
    const playerTitleEl = document.getElementById('player-artboard-title');
    const playerDeviceSelectEl = document.getElementById('player-device-select');
    this.prototypeCtrl = new PrototypeController(playerOverlayEl, screenCanvasEl, playerTitleEl, playerDeviceSelectEl);

    // Command Palette
    const paletteOverlayEl = document.getElementById('command-palette-overlay');
    const paletteSearchIn = document.getElementById('palette-search-input');
    const paletteResultsList = document.getElementById('palette-results-list');
    this.paletteCtrl = new CommandPaletteController(paletteOverlayEl, paletteSearchIn, paletteResultsList);

    // 3. Setup UI bindings
    this.setupTopCommandBar();
    this.setupLeftPanel();
    this.setupBottomStatusBar();
    this.setupModals();
    this.setupTheme();

    // 4. Initial Render & Viewport Fit
    this.renderer.render();
    setTimeout(() => this.canvasCtrl.zoomToFitAll(), 100);

    this.showToast('WireframeLab Ready', 'success');
  }

  // --- Initial Project Loading ---
  async loadInitialProject() {
    try {
      const activeId = await getActiveProjectId();
      if (activeId) {
        const saved = await getProject(activeId);
        if (saved) {
          state.setProject(saved);
          return;
        }
      }

      const all = await getAllProjects();
      if (all.length > 0) {
        state.setProject(all[0]);
        await setActiveProjectId(all[0].id);
        return;
      }

      // If brand new, load the SaaS Landing template as starter showcase
      const starter = STARTER_TEMPLATES[0].build();
      await saveProject(starter);
      await setActiveProjectId(starter.id);
      state.setProject(starter);
    } catch (e) {
      console.warn('Using fallback memory project:', e);
      state.setProject(createNewProject('Default Project'));
    }
  }

  // --- Top Command Bar Setup ---
  setupTopCommandBar() {
    // Project Name Input
    const nameIn = document.getElementById('project-name-input');
    if (nameIn) {
      nameIn.value = state.project.name;
      nameIn.addEventListener('change', (e) => state.setProjectName(e.target.value.trim() || 'Untitled Project'));
      state.on('project:nameChanged', (name) => { nameIn.value = name; });
      state.on('project:changed', (p) => { nameIn.value = p.name; });
    }

    // Tool Buttons
    const toolBtns = document.querySelectorAll('.tool-btn[data-tool]');
    toolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        state.setActiveTool(btn.dataset.tool);
      });
    });

    state.on('tool:changed', (tool) => {
      toolBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tool === tool);
      });
    });

    // Mode Switcher (Design vs Prototype)
    const modeTabs = document.querySelectorAll('.mode-tab[data-mode]');
    modeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        state.setMode(tab.dataset.mode);
      });
    });

    state.on('mode:changed', (mode) => {
      modeTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.mode === mode));
      document.body.classList.toggle('mode-prototype', mode === 'prototype');
    });

    // History Undo / Redo buttons
    const undoBtn = document.getElementById('btn-undo');
    const redoBtn = document.getElementById('btn-redo');
    if (undoBtn) undoBtn.addEventListener('click', () => state.undo());
    if (redoBtn) redoBtn.addEventListener('click', () => state.redo());

    state.on('history:changed', ({ canUndo, canRedo }) => {
      if (undoBtn) undoBtn.disabled = !canUndo;
      if (redoBtn) redoBtn.disabled = !canRedo;
    });

    // Present Prototype Button
    const presentBtn = document.getElementById('btn-present-prototype');
    if (presentBtn) {
      presentBtn.addEventListener('click', () => this.prototypeCtrl.openPlayer());
    }

    // Export Modal Open
    const exportBtn = document.getElementById('btn-open-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.openExportModal());
    }

    // Command Palette Trigger
    const palBtn = document.getElementById('btn-open-palette');
    if (palBtn) {
      palBtn.addEventListener('click', () => this.paletteCtrl.open());
    }

    // Theme Switcher Button
    const themeBtn = document.getElementById('btn-toggle-theme');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const nextTheme = state.theme === 'theme-dark' ? 'theme-light' : 'theme-dark';
        state.setTheme(nextTheme);
      });
    }

    // Shortcuts Help Modal Button
    const shortcutsBtn = document.getElementById('btn-open-shortcuts');
    if (shortcutsBtn) {
      shortcutsBtn.addEventListener('click', () => {
        document.getElementById('modal-shortcuts')?.classList.add('active');
      });
    }

    // Main App Menu Dropdown (New, Open, Templates, Save)
    const menuBtn = document.getElementById('app-menu-btn');
    const menuDropdown = document.getElementById('app-menu-dropdown');
    if (menuBtn && menuDropdown) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menuDropdown.classList.toggle('active');
      });

      window.addEventListener('click', () => menuDropdown.classList.remove('active'));

      // Menu Actions
      document.getElementById('menu-item-new')?.addEventListener('click', async () => {
        const newP = createNewProject('Untitled Project');
        await saveProject(newP);
        await setActiveProjectId(newP.id);
        state.setProject(newP);
        this.showToast('New project created', 'info');
      });

      document.getElementById('menu-item-projects')?.addEventListener('click', () => {
        this.openProjectsModal();
      });

      document.getElementById('menu-item-save-json')?.addEventListener('click', () => {
        this.exportCtrl.exportProjectJSON();
      });

      document.getElementById('menu-item-import-json')?.addEventListener('click', () => {
        this.openImportFileDialog();
      });
    }
  }

  // --- Left Panel Setup (Tabs, Component Search, Templates) ---
  setupLeftPanel() {
    // Panel Tabs Switcher
    const tabBtns = document.querySelectorAll('.panel-tab-btn[data-tab]');
    const tabViews = document.querySelectorAll('.panel-tab-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.toggle('active', b === btn));
        tabViews.forEach(v => v.classList.toggle('active', v.id === `tab-view-${targetTab}`));
      });
    });

    // Populate Components Asset Grid
    this.renderComponentsGrid();

    // Populate Templates List
    this.renderTemplatesList();
  }

  renderComponentsGrid() {
    const gridEl = document.getElementById('components-grid');
    if (!gridEl) return;

    const searchIn = document.getElementById('components-search-input');
    const categoryChips = document.querySelectorAll('.category-chip[data-category]');

    let activeCategory = 'all';

    const updateGrid = () => {
      const q = searchIn ? searchIn.value.trim().toLowerCase() : '';
      gridEl.innerHTML = '';

      const filtered = COMPONENT_DEFINITIONS.filter(c => {
        const matchesCategory = activeCategory === 'all' || c.category === activeCategory;
        const matchesQuery = c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
      });

      filtered.forEach(comp => {
        const card = document.createElement('div');
        card.className = 'component-card';
        card.draggable = true;
        card.dataset.type = comp.type;

        card.innerHTML = `
          <div class="component-preview-box">
            ${this.getMiniComponentPreview(comp.type)}
          </div>
          <span class="component-card-name">${escapeHTML(comp.name)}</span>
        `;

        // Click to insert at center
        card.addEventListener('click', () => {
          const newObj = createObjectFromType(comp.type);
          const page = state.getActivePage();
          const firstAb = page.artboards[0];
          if (firstAb) {
            newObj.x = Math.round((firstAb.width - newObj.width) / 2);
            newObj.y = Math.round((firstAb.height - newObj.height) / 2);
            state.addObject(newObj, firstAb.id);
          } else {
            newObj.x = 200;
            newObj.y = 200;
            state.addObject(newObj, null);
          }
        });

        // Drag to drop on canvas
        card.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', comp.type);
          e.dataTransfer.effectAllowed = 'copy';
        });

        gridEl.appendChild(card);
      });
    };

    if (searchIn) searchIn.addEventListener('input', updateGrid);

    categoryChips.forEach(chip => {
      chip.addEventListener('click', () => {
        categoryChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeCategory = chip.dataset.category;
        updateGrid();
      });
    });

    updateGrid();
  }

  getMiniComponentPreview(type) {
    switch (type) {
      case 'button':
        return '<div style="width:50px;height:20px;background:#1f2937;border-radius:3px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:8px;font-weight:bold;">Button</div>';
      case 'input':
        return '<div style="width:65px;height:18px;border:1px solid #9ca3af;border-radius:3px;background:#fff;padding-left:4px;display:flex;align-items:center;font-size:7px;color:#9ca3af;">Input...</div>';
      case 'image':
        return '<div style="width:55px;height:35px;background:#e5e7eb;border:1px solid #d1d5db;border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:8px;color:#6b7280;">IMG</div>';
      case 'card':
        return '<div style="width:60px;height:40px;background:#fff;border:1px solid #e5e7eb;border-radius:3px;padding:3px;display:flex;flex-direction:column;gap:2px;"><div style="height:5px;background:#1f2937;width:60%;"></div><div style="height:3px;background:#e5e7eb;"></div></div>';
      case 'navbar':
        return '<div style="width:70px;height:12px;background:#fff;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;justify-content:space-between;padding:0 4px;"><div style="width:6px;height:6px;background:#1f2937;"></div><div style="width:20px;height:3px;background:#9ca3af;"></div></div>';
      case 'table':
        return '<div style="width:60px;height:35px;border:1px solid #e5e7eb;background:#fff;display:flex;flex-direction:column;"><div style="height:8px;background:#f3f4f6;border-bottom:1px solid #e5e7eb;"></div><div style="height:8px;border-bottom:1px solid #f3f4f6;"></div></div>';
      case 'chart':
        return '<div style="width:50px;height:30px;display:flex;align-items:flex-end;gap:3px;padding:2px;"><div style="width:6px;height:12px;background:#9ca3af;"></div><div style="width:6px;height:24px;background:#6b7280;"></div><div style="width:6px;height:18px;background:#1f2937;"></div></div>';
      default:
        return '<div style="width:40px;height:25px;border:1px dashed #9ca3af;border-radius:2px;"></div>';
    }
  }

  renderTemplatesList() {
    const listEl = document.getElementById('templates-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    STARTER_TEMPLATES.forEach(tpl => {
      const card = document.createElement('div');
      card.className = 'template-card';
      card.innerHTML = `
        <div class="template-thumbnail">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:32px;height:32px;"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
        </div>
        <div class="template-title">${escapeHTML(tpl.name)}</div>
        <div class="template-desc">${escapeHTML(tpl.description)}</div>
      `;

      card.addEventListener('click', async () => {
        if (confirm(`Load the "${tpl.name}" template? Any unsaved changes on current canvas will be overwritten.`)) {
          const built = tpl.build();
          await saveProject(built);
          await setActiveProjectId(built.id);
          state.setProject(built);
          setTimeout(() => this.canvasCtrl.zoomToFitAll(), 50);
          this.showToast(`Loaded ${tpl.name}`, 'success');
        }
      });

      listEl.appendChild(card);
    });
  }

  // --- Bottom Status Bar Setup ---
  setupBottomStatusBar() {
    const zoomValEl = document.getElementById('status-zoom-val');
    const zoomInBtn = document.getElementById('btn-zoom-in');
    const zoomOutBtn = document.getElementById('btn-zoom-out');
    const zoomFitBtn = document.getElementById('btn-zoom-fit');

    if (zoomInBtn) zoomInBtn.addEventListener('click', () => this.canvasCtrl.zoomIn());
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => this.canvasCtrl.zoomOut());
    if (zoomFitBtn) zoomFitBtn.addEventListener('click', () => this.canvasCtrl.zoomToFitAll());
    if (zoomValEl) zoomValEl.addEventListener('click', () => this.canvasCtrl.resetZoom());

    state.on('viewport:changed', (vp) => {
      if (zoomValEl) {
        zoomValEl.textContent = `${Math.round(vp.zoom * 100)}%`;
      }
    });

    // Auto-save Status Indicator
    const saveDot = document.getElementById('status-save-dot');
    const saveText = document.getElementById('status-save-text');
    state.on('save:status', ({ status }) => {
      if (saveDot && saveText) {
        if (status === 'saving') {
          saveDot.className = 'status-dot saving';
          saveText.textContent = 'Saving...';
        } else {
          saveDot.className = 'status-dot';
          saveText.textContent = 'Saved to IndexedDB';
        }
      }
    });
  }

  // --- Modals Setup ---
  setupModals() {
    // Close modal on background click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
      });
    });

    document.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.modal-overlay').classList.remove('active');
      });
    });
  }

  // --- Project Manager Modal ---
  async openProjectsModal() {
    const modal = document.getElementById('modal-projects');
    const grid = document.getElementById('projects-grid-list');
    if (!modal || !grid) return;

    grid.innerHTML = '<div style="padding:20px;text-align:center;">Loading projects...</div>';
    modal.classList.add('active');

    const projects = await getAllProjects();
    grid.innerHTML = '';

    projects.forEach(p => {
      const card = document.createElement('div');
      card.className = 'project-card';
      const dateStr = new Date(p.updatedAt || Date.now()).toLocaleDateString();

      card.innerHTML = `
        <div class="project-card-title">${escapeHTML(p.name)}</div>
        <div class="project-card-date">Modified: ${dateStr}</div>
        <div style="display:flex;gap:6px;margin-top:8px;">
          <button class="btn-primary btn-load-proj" style="font-size:11px;padding:3px 8px;">Open</button>
          <button class="btn-del-proj" style="font-size:11px;padding:3px 8px;background:transparent;border:1px solid #ef4444;color:#ef4444;">Delete</button>
        </div>
      `;

      card.querySelector('.btn-load-proj').addEventListener('click', async (e) => {
        e.stopPropagation();
        await setActiveProjectId(p.id);
        state.setProject(p);
        modal.classList.remove('active');
        this.showToast(`Opened project: ${p.name}`, 'info');
      });

      card.querySelector('.btn-del-proj').addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm(`Delete project "${p.name}"?`)) {
          await deleteProject(p.id);
          this.openProjectsModal();
        }
      });

      grid.appendChild(card);
    });

    // Create New Project Dialog Button
    const newBtn = modal.querySelector('#btn-new-project-dialog');
    if (newBtn) {
      newBtn.onclick = async () => {
        const name = prompt('Enter new project name:', 'Untitled Project');
        if (name !== null) {
          const newP = createNewProject(name.trim() || 'Untitled Project');
          await saveProject(newP);
          await setActiveProjectId(newP.id);
          state.setProject(newP);
          modal.classList.remove('active');
          this.showToast(`Created project: ${newP.name}`, 'success');
        }
      };
    }
  }

  // --- Export Modal ---
  openExportModal() {
    const modal = document.getElementById('modal-export');
    if (!modal) return;
    modal.classList.add('active');

    const page = state.getActivePage();
    const artboards = page.artboards || [];
    const select = document.getElementById('export-artboard-select');
    if (select) {
      select.innerHTML = artboards.map(a => `<option value="${a.id}">${escapeHTML(a.name)}</option>`).join('');
    }

    // Export PNG
    document.getElementById('btn-do-export-png')?.replaceWith(
      document.getElementById('btn-do-export-png').cloneNode(true)
    );
    document.getElementById('btn-do-export-png')?.addEventListener('click', () => {
      const targetAbId = select?.value || artboards[0]?.id;
      this.exportCtrl.exportArtboardAsPNG(targetAbId, 2);
      modal.classList.remove('active');
      this.showToast('PNG Exported @2x', 'success');
    });

    // Export SVG
    document.getElementById('btn-do-export-svg')?.replaceWith(
      document.getElementById('btn-do-export-svg').cloneNode(true)
    );
    document.getElementById('btn-do-export-svg')?.addEventListener('click', () => {
      const targetAbId = select?.value || artboards[0]?.id;
      this.exportCtrl.exportArtboardAsSVG(targetAbId);
      modal.classList.remove('active');
      this.showToast('SVG Vector Exported', 'success');
    });

    // Export JSON Project
    document.getElementById('btn-do-export-json')?.replaceWith(
      document.getElementById('btn-do-export-json').cloneNode(true)
    );
    document.getElementById('btn-do-export-json')?.addEventListener('click', () => {
      this.exportCtrl.exportProjectJSON();
      modal.classList.remove('active');
      this.showToast('Project JSON Downloaded', 'success');
    });

    // Export HTML Wireframe
    document.getElementById('btn-do-export-html')?.replaceWith(
      document.getElementById('btn-do-export-html').cloneNode(true)
    );
    document.getElementById('btn-do-export-html')?.addEventListener('click', () => {
      const targetAbId = select?.value || artboards[0]?.id;
      this.exportCtrl.exportHTMLWireframe(targetAbId);
      modal.classList.remove('active');
      this.showToast('HTML Wireframe Package Exported', 'success');
    });
  }

  // --- Import File Dialog ---
  openImportFileDialog() {
    const fileIn = document.createElement('input');
    fileIn.type = 'file';
    fileIn.accept = '.json';
    fileIn.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (evt) => {
        const result = this.exportCtrl.importProjectJSON(evt.target.result);
        if (result.success) {
          await saveProject(result.project);
          await setActiveProjectId(result.project.id);
          this.showToast('Project imported successfully', 'success');
        } else {
          alert(`Failed to import JSON: ${result.error}`);
        }
      };
      reader.readAsText(file);
    };
    fileIn.click();
  }

  // --- Theme Setup ---
  setupTheme() {
    const savedTheme = localStorage.getItem('wf_theme') || 'theme-dark';
    state.setTheme(savedTheme);

    state.on('theme:changed', (t) => {
      document.body.className = `${t} ${state.mode === 'prototype' ? 'mode-prototype' : ''}`;
      localStorage.setItem('wf_theme', t);
    });
  }

  // --- Toast Notifications ---
  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${escapeHTML(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
}

function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Bootstrap application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new WireframeLabApp();
});
