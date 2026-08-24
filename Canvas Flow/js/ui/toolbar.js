/* ==========================================================================
   CANVASFLOW — Toolbar UI
   Top Header Bar & Left Floating Tool Rail Controller
   ========================================================================== */

import { appState } from '../state/state.js';
import { eventBus } from '../state/event-bus.js';

export class Toolbar {
  constructor(app) {
    this.app = app;
    this._bindElements();
    this._setupListeners();
  }

  _bindElements() {
    // Board title
    this.boardNameInput = document.getElementById('board-name-input');
    this.btnBoardMenu = document.getElementById('btn-board-menu');
    this.boardDropdown = document.getElementById('board-dropdown');

    // Undo / Redo
    this.btnUndo = document.getElementById('btn-undo');
    this.btnRedo = document.getElementById('btn-redo');

    // Zoom
    this.btnZoomOut = document.getElementById('btn-zoom-out');
    this.btnZoomIn = document.getElementById('btn-zoom-in');
    this.btnZoomLevel = document.getElementById('btn-zoom-level');
    this.zoomText = document.getElementById('zoom-text');
    this.btnZoomFit = document.getElementById('btn-zoom-fit');
    this.zoomDropdown = document.getElementById('zoom-dropdown');

    // View Toggles
    this.btnToggleGrid = document.getElementById('btn-toggle-grid');
    this.btnToggleSnap = document.getElementById('btn-toggle-snap');
    this.btnToggleRulers = document.getElementById('btn-toggle-rulers');
    this.btnToggleLayers = document.getElementById('btn-toggle-layers');
    this.btnToggleProps = document.getElementById('btn-toggle-props');
    this.btnThemeToggle = document.getElementById('btn-theme-toggle');
    this.btnShortcutsHelp = document.getElementById('btn-shortcuts-help');
    this.btnCommandPalette = document.getElementById('btn-command-palette');
    this.btnExportMenu = document.getElementById('btn-export-menu');
    this.exportDropdown = document.getElementById('export-dropdown');

    // Tool rail buttons
    this.toolButtons = document.querySelectorAll('.tool-btn[data-tool]');
    this.btnInsertImage = document.getElementById('btn-insert-image');
    this.imageFileInput = document.getElementById('image-file-input');
  }

  _setupListeners() {
    // Board Name Rename
    this.boardNameInput.addEventListener('change', (e) => {
      appState.board.title = e.target.value.trim() || 'Untitled Board';
      appState.board.updatedAt = Date.now();
      eventBus.emit('board:renamed', appState.board);
      eventBus.emit('toast:show', { message: 'Board renamed', type: 'info' });
    });

    // Undo / Redo Buttons
    this.btnUndo.addEventListener('click', () => appState.undo());
    this.btnRedo.addEventListener('click', () => appState.redo());

    eventBus.on('history:changed', ({ canUndo, canRedo }) => {
      this.btnUndo.disabled = !canUndo;
      this.btnRedo.disabled = !canRedo;
    });

    // Zoom Buttons
    this.btnZoomIn.addEventListener('click', () => {
      const { clientWidth, clientHeight } = this.app.canvasContainer;
      appState.zoomAt(clientWidth / 2, clientHeight / 2, 1.25);
    });

    this.btnZoomOut.addEventListener('click', () => {
      const { clientWidth, clientHeight } = this.app.canvasContainer;
      appState.zoomAt(clientWidth / 2, clientHeight / 2, 0.8);
    });

    this.btnZoomFit.addEventListener('click', () => {
      const { clientWidth, clientHeight } = this.app.canvasContainer;
      appState.zoomToFit(clientWidth, clientHeight);
    });

    this.btnZoomLevel.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = this.zoomDropdown.classList.toggle('hidden');
      this.btnZoomLevel.setAttribute('aria-expanded', String(!isHidden));
    });

    eventBus.on('viewport:changed', (viewport) => {
      this.zoomText.textContent = `${Math.round(viewport.zoom * 100)}%`;
    });

    // Zoom Dropdown Items
    this.zoomDropdown.addEventListener('click', (e) => {
      const item = e.target.closest('.dropdown-item');
      if (!item) return;
      const action = item.dataset.action;
      const { clientWidth, clientHeight } = this.app.canvasContainer;

      if (action === 'zoom-reset') appState.setViewport(clientWidth / 2, clientHeight / 2, 1.0);
      else if (action === 'zoom-fit') appState.zoomToFit(clientWidth, clientHeight);
      else if (action === 'zoom-selection') appState.zoomToSelection(clientWidth, clientHeight);
      else if (action === 'zoom-50') appState.zoomAt(clientWidth / 2, clientHeight / 2, 0.5 / appState.viewport.zoom);
      else if (action === 'zoom-100') appState.zoomAt(clientWidth / 2, clientHeight / 2, 1.0 / appState.viewport.zoom);
      else if (action === 'zoom-200') appState.zoomAt(clientWidth / 2, clientHeight / 2, 2.0 / appState.viewport.zoom);
      else if (action === 'zoom-400') appState.zoomAt(clientWidth / 2, clientHeight / 2, 4.0 / appState.viewport.zoom);

      this.zoomDropdown.classList.add('hidden');
      this.btnZoomLevel.setAttribute('aria-expanded', 'false');
    });

    // Tool Rail Switching
    this.toolButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;
        appState.setActiveTool(tool);
      });
    });

    eventBus.on('tool:changed', (toolName) => {
      this.toolButtons.forEach(btn => {
        const isActive = btn.dataset.tool === toolName;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
      });
    });

    // Insert Image Trigger
    this.btnInsertImage.addEventListener('click', () => {
      this.imageFileInput.click();
    });

    this.imageFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.app.insertImageFile(file);
      }
      this.imageFileInput.value = '';
    });

    // View Toggles
    this.btnToggleGrid.addEventListener('click', () => {
      appState.settings.gridVisible = !appState.settings.gridVisible;
      this.btnToggleGrid.classList.toggle('active', appState.settings.gridVisible);
      this.btnToggleGrid.setAttribute('aria-pressed', String(appState.settings.gridVisible));
      appState.applyTheme(appState.settings.theme);
      this.app.renderer.requestRender();
    });

    this.btnToggleSnap.addEventListener('click', () => {
      appState.settings.snapEnabled = !appState.settings.snapEnabled;
      this.btnToggleSnap.classList.toggle('active', appState.settings.snapEnabled);
      this.btnToggleSnap.setAttribute('aria-pressed', String(appState.settings.snapEnabled));
      eventBus.emit('toast:show', {
        message: appState.settings.snapEnabled ? 'Snapping enabled' : 'Snapping disabled',
        type: 'info'
      });
    });

    this.btnToggleRulers.addEventListener('click', () => {
      appState.settings.rulersVisible = !appState.settings.rulersVisible;
      this.btnToggleRulers.classList.toggle('active', appState.settings.rulersVisible);
      this.btnToggleRulers.setAttribute('aria-pressed', String(appState.settings.rulersVisible));
      document.body.classList.toggle('show-rulers', appState.settings.rulersVisible);
      this.app.renderer.resize();
    });

    this.btnToggleLayers.addEventListener('click', () => {
      const layersPanel = document.getElementById('layers-panel');
      const isHidden = layersPanel.classList.toggle('hidden');
      this.btnToggleLayers.classList.toggle('active', !isHidden);
      this.btnToggleLayers.setAttribute('aria-pressed', String(!isHidden));
    });

    // Properties Inspector Topbar Toggle
    this.btnToggleProps?.addEventListener('click', () => {
      const propsPanel = document.getElementById('properties-panel');
      const isCollapsed = propsPanel.classList.toggle('collapsed');
      this.btnToggleProps.classList.toggle('active', !isCollapsed);
      this.btnToggleProps.setAttribute('aria-pressed', String(!isCollapsed));
      const minimap = document.getElementById('minimap-container');
      if (minimap) {
        minimap.classList.toggle('shifted', isCollapsed);
      }
    });

    this.btnThemeToggle.addEventListener('click', () => {
      const newTheme = appState.settings.theme === 'dark' ? 'light' : 'dark';
      appState.applyTheme(newTheme);
      this.app.renderer.requestRender();
    });

    this.btnShortcutsHelp.addEventListener('click', () => {
      document.getElementById('modal-shortcuts').classList.remove('hidden');
    });

    this.btnCommandPalette.addEventListener('click', () => {
      this.app.commandPalette.open();
    });

    // Export Dropdown
    this.btnExportMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = this.exportDropdown.classList.toggle('hidden');
      this.btnExportMenu.setAttribute('aria-expanded', String(!isHidden));
    });

    this.exportDropdown.addEventListener('click', (e) => {
      const item = e.target.closest('.dropdown-item');
      if (!item) return;
      const action = item.dataset.action;

      if (action === 'export-png') {
        this.app.modals.openExportModal();
      } else if (action === 'export-svg') {
        this.app.exportBoardSVG();
      } else if (action === 'export-json') {
        this.app.exportBoardJSON();
      } else if (action === 'import-json') {
        document.getElementById('json-file-input').click();
      } else if (action === 'print-canvas') {
        window.print();
      }
      this.exportDropdown.classList.add('hidden');
      this.btnExportMenu.setAttribute('aria-expanded', 'false');
    });

    // Board Dropdown Trigger
    this.btnBoardMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = this.boardDropdown.classList.toggle('hidden');
      this.btnBoardMenu.setAttribute('aria-expanded', String(!isHidden));
      this.app.updateBoardListMenu();
    });

    // Board Dropdown Static Action Items (Manage Boards, Duplicate Board)
    this.boardDropdown.addEventListener('click', async (e) => {
      const item = e.target.closest('.dropdown-item[data-action]');
      if (!item) return;
      const action = item.dataset.action;

      if (action === 'manage-boards') {
        this.app.modals.openBoardManager();
        this.boardDropdown.classList.add('hidden');
        this.btnBoardMenu.setAttribute('aria-expanded', 'false');
      } else if (action === 'duplicate-board') {
        try {
          const dup = await this.app.duplicateCurrentBoard();
          this.boardDropdown.classList.add('hidden');
          this.btnBoardMenu.setAttribute('aria-expanded', 'false');
        } catch (err) {
          console.error(err);
        }
      }
    });

    // Global Click to close open dropdowns
    window.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown-menu') && !e.target.closest('.btn-pill') && !e.target.closest('#btn-export-menu') && !e.target.closest('#btn-board-menu')) {
        this.zoomDropdown.classList.add('hidden');
        this.exportDropdown.classList.add('hidden');
        this.boardDropdown.classList.add('hidden');
        this.btnZoomLevel?.setAttribute('aria-expanded', 'false');
        this.btnExportMenu?.setAttribute('aria-expanded', 'false');
        this.btnBoardMenu?.setAttribute('aria-expanded', 'false');
      }
    });

    eventBus.on('board:loaded', (board) => {
      this.boardNameInput.value = board.title || 'Untitled Board';
    });
  }
}
