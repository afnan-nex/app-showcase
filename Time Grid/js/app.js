/**
 * TimeGrid - Master Application Orchestrator
 * Integrates 24h Time Grid Canvas, Task Backlog Drawer, Block Inspector, Focus Mode,
 * Scenario Simulation, Multi-Level Undo / Toast System, Keyboard Shortcuts, and Persistent Storage.
 */

import { getIcon, escapeHTML } from './core/icons.js';
import { db } from './core/db.js';
import { formatDateKey, formatDateDisplay, formatFullDateDisplay, minutesToTimeString, formatDuration, getWeekDates } from './core/time.js';
import { GRID_VIEWS, TimeGridView } from './editor/time-grid.js';
import { renderTaskDrawer } from './editor/task-drawer.js';
import { renderBlockInspector } from './editor/block-inspector.js';
import { FocusModeManager } from './editor/focus-mode.js';
import { ScenarioComparisonModal } from './editor/scenario-comparison.js';
import { detectConflicts } from './engine/conflicts.js';

class TimeGridApp {
  constructor() {
    this.blocks = [];
    this.backlogTasks = [];
    this.selectedBlockId = null;

    // View State
    this.currentDate = new Date();
    this.viewMode = GRID_VIEWS.DAY; // 'day', 'workweek', 'week'
    this.is24Hour = false;
    this.gridSnap = 15; // 15 min default

    // UI Drawer state for mobile
    this.isDrawerOpen = false;
    this.isInspectorOpen = false;

    // Toast & Undo State
    this.toastTimer = null;
  }

  async init() {
    await db.init();
    this.blocks = await db.getAllBlocks();
    this.backlogTasks = await db.getAllBacklogTasks();

    if (this.blocks.length > 0) {
      const todayKey = formatDateKey(this.currentDate);
      const todayBlock = this.blocks.find(b => b.date === todayKey);
      this.selectedBlockId = todayBlock ? todayBlock.id : this.blocks[0].id;
    }

    // Initialize Sub-components
    const gridContainer = document.getElementById('time-grid-canvas-container');
    this.timeGrid = new TimeGridView(gridContainer, {
      onSelectBlock: (id) => this.selectBlock(id),
      onMoveBlock: (id, updates) => this.updateBlock(id, updates),
      onResizeBlock: (id, updates) => this.updateBlock(id, updates),
      onCreateBlockAt: (slot) => this.createNewBlockAt(slot),
      onDropTask: (taskId, date, startMinute) => this.scheduleBacklogTask(taskId, date, startMinute)
    });

    const focusContainer = document.getElementById('focus-mode-overlay-container');
    this.focusManager = new FocusModeManager(focusContainer, (blockId) => {
      this.deleteBlock(blockId, true);
    });

    const scenarioContainer = document.getElementById('scenario-modal-container');
    this.scenarioModal = new ScenarioComparisonModal(scenarioContainer, (appliedScenario) => {
      db.pushUndoSnapshot(this.blocks, this.backlogTasks);
      this.blocks = JSON.parse(JSON.stringify(appliedScenario.blocks));
      this.saveAllBlocks();
      this.renderAll();
      this.showToast(`Applied schedule plan "${appliedScenario.name}"`, { canUndo: true });
    });

    this.setupToolbar();
    this.setupDateControls();
    this.setupShortcuts();
    this.setupMobileDrawers();
    this.renderAll();
  }

  renderAll() {
    this.renderGrid();
    this.renderDrawer();
    this.renderInspector();
    this.updateHeaderDateDisplay();
    this.updateConflictIndicator();
  }

  renderGrid() {
    this.timeGrid.render({
      blocks: this.blocks,
      selectedBlockId: this.selectedBlockId,
      viewMode: this.viewMode,
      currentDate: this.currentDate,
      is24Hour: this.is24Hour,
      gridSnap: this.gridSnap
    });
  }

  renderDrawer() {
    const container = document.getElementById('task-drawer-container');
    if (!container) return;

    renderTaskDrawer(container, {
      backlogTasks: this.backlogTasks,
      onAddTask: async (task) => {
        await db.saveBacklogTask(task);
        this.backlogTasks = await db.getAllBacklogTasks();
        this.renderDrawer();
        this.showToast(`Task "${task.title}" added to inbox.`);
      },
      onDeleteTask: async (id) => {
        db.pushUndoSnapshot(this.blocks, this.backlogTasks);
        const task = this.backlogTasks.find(t => t.id === id);
        await db.deleteBacklogTask(id);
        this.backlogTasks = await db.getAllBacklogTasks();
        this.renderDrawer();
        this.showToast(`Deleted task "${task?.title || ''}"`, { canUndo: true });
      },
      onApplyTemplate: (tpl) => {
        const dateKey = formatDateKey(this.currentDate);
        db.pushUndoSnapshot(this.blocks, this.backlogTasks);

        // Remove existing blocks on this date
        this.blocks = this.blocks.filter(b => b.date !== dateKey);

        for (const b of tpl.blocks) {
          this.blocks.push({
            ...b,
            id: 'b_' + Math.random().toString(36).substr(2, 7),
            date: dateKey
          });
        }
        this.saveAllBlocks();
        this.renderAll();
        this.showToast(`Applied "${tpl.name}" routine template.`, { canUndo: true });
      },
      onCloseDrawer: () => this.toggleLeftDrawer(false)
    });
  }

  renderInspector() {
    const container = document.getElementById('block-inspector-container');
    if (!container) return;

    const dateKey = formatDateKey(this.currentDate);
    const dayBlocks = this.blocks.filter(b => b.date === dateKey);
    const activeBlock = this.blocks.find(b => b.id === this.selectedBlockId);

    renderBlockInspector(container, {
      selectedBlock: activeBlock,
      dayBlocks,
      is24Hour: this.is24Hour,
      onUpdateBlock: (updated) => this.updateBlock(updated.id, updated),
      onDeleteBlock: (id) => this.deleteBlock(id),
      onDuplicateBlock: (id) => this.duplicateBlock(id),
      onSplitBlock: (id) => this.splitBlock(id),
      onStartFocus: (block) => this.focusManager.startFocus(block),
      onCloseInspector: () => this.toggleRightInspector(false),
      onBatchUpdateBlocks: async (updatedList) => {
        db.pushUndoSnapshot(this.blocks, this.backlogTasks);
        for (const b of updatedList) {
          const idx = this.blocks.findIndex(x => x.id === b.id);
          if (idx >= 0) this.blocks[idx] = b;
          await db.saveBlock(b);
        }
        this.renderAll();
        this.showToast('Resolved schedule overlap.', { canUndo: true });
      }
    });
  }

  updateConflictIndicator() {
    const dateKey = formatDateKey(this.currentDate);
    const dayBlocks = this.blocks.filter(b => b.date === dateKey);
    const conflictMap = detectConflicts(dayBlocks);
    let conflictCount = 0;
    for (const [, info] of conflictMap) {
      if (info.hasConflict) conflictCount++;
    }
    const uniquePairs = Math.round(conflictCount / 2);

    const badge = document.getElementById('topbar-conflict-badge');
    if (badge) {
      if (uniquePairs > 0) {
        badge.innerHTML = `${getIcon('alert', 'icon-xs')} ${uniquePairs} ${uniquePairs === 1 ? 'Overlap' : 'Overlaps'}`;
        badge.className = 'badge badge-conflict text-amber font-mono font-bold cursor-pointer';
        badge.title = `${uniquePairs} overlapping time blocks detected today`;
      } else {
        badge.innerHTML = `${getIcon('check', 'icon-xs')} 0 Conflicts`;
        badge.className = 'badge badge-secondary text-emerald font-mono font-bold';
        badge.title = 'No schedule overlaps detected today';
      }
    }
  }

  // --- Toolbar & Navigation Handlers ---
  setupToolbar() {
    // View Mode Toggle (Day / Workweek / Full Week)
    document.querySelectorAll('.btn-view-mode').forEach(btn => {
      btn.addEventListener('click', () => {
        this.viewMode = btn.dataset.view;
        document.querySelectorAll('.btn-view-mode').forEach(b => b.classList.toggle('active', b === btn));
        this.renderAll();
      });
    });

    // Snap Interval
    document.getElementById('select-grid-snap')?.addEventListener('change', (e) => {
      this.gridSnap = parseInt(e.target.value, 10) || 15;
      this.renderGrid();
    });

    // 12h / 24h Toggle
    document.getElementById('btn-toggle-24h')?.addEventListener('click', () => {
      this.is24Hour = !this.is24Hour;
      const btn = document.getElementById('btn-toggle-24h');
      if (btn) btn.textContent = this.is24Hour ? '24h' : '12h';
      this.renderAll();
    });

    // Quick New Block (+ Block)
    document.getElementById('btn-quick-new-block')?.addEventListener('click', () => {
      this.createNewBlockAt({
        date: formatDateKey(this.currentDate),
        startMinute: 540, // 9:00 AM
        endMinute: 600 // 10:00 AM
      });
    });

    // Simulate & Compare Scenarios Modal
    document.getElementById('btn-open-scenarios')?.addEventListener('click', () => {
      const dateKey = formatDateKey(this.currentDate);

      const scenarios = [
        { id: 'sc_current', name: 'Current Active Plan', blocks: this.blocks },
        {
          id: 'sc_deep_work',
          name: 'Scenario A: Deep Focus Maker Sprint',
          blocks: [
            ...this.blocks.filter(b => b.date !== dateKey),
            { id: 'sc_1', date: dateKey, title: 'Morning Deep Work Block', startMinute: 540, endMinute: 720, category: 'Deep Work', priority: 'High', color: '#0284c7' },
            { id: 'sc_2', date: dateKey, title: 'Consolidated Syncs & Catchup', startMinute: 840, endMinute: 960, category: 'Meetings', priority: 'Med', color: '#8b5cf6' },
            { id: 'sc_3', date: dateKey, title: 'Afternoon Flow State Sprint', startMinute: 960, endMinute: 1080, category: 'Deep Work', priority: 'High', color: '#0284c7' }
          ]
        },
        {
          id: 'sc_balanced',
          name: 'Scenario B: Balanced Flow & Admin Buffer',
          blocks: [
            ...this.blocks.filter(b => b.date !== dateKey),
            { id: 'sc_b1', date: dateKey, title: 'Planning & Inbox Zero', startMinute: 540, endMinute: 600, category: 'Admin', priority: 'Med', color: '#f59e0b' },
            { id: 'sc_b2', date: dateKey, title: 'Deep Work Sprint', startMinute: 600, endMinute: 750, category: 'Deep Work', priority: 'High', color: '#0284c7' },
            { id: 'sc_b3', date: dateKey, title: 'Collaborative Sync', startMinute: 810, endMinute: 900, category: 'Meetings', priority: 'Med', color: '#8b5cf6' },
            { id: 'sc_b4', date: dateKey, title: 'Architecture Review', startMinute: 930, endMinute: 1020, category: 'Deep Work', priority: 'Med', color: '#0284c7' }
          ]
        },
        {
          id: 'sc_async_research',
          name: 'Scenario C: Async Engineering & Research',
          blocks: [
            ...this.blocks.filter(b => b.date !== dateKey),
            { id: 'sc_c1', date: dateKey, title: 'Technical Spike & RFC Writeup', startMinute: 540, endMinute: 720, category: 'Deep Work', priority: 'High', color: '#0284c7' },
            { id: 'sc_c2', date: dateKey, title: 'Algorithmic Profiling', startMinute: 780, endMinute: 960, category: 'Deep Work', priority: 'High', color: '#0284c7' },
            { id: 'sc_c3', date: dateKey, title: 'Code Reviews & PR Triage', startMinute: 990, endMinute: 1050, category: 'Admin', priority: 'Med', color: '#f59e0b' }
          ]
        }
      ];

      this.scenarioModal.open(scenarios, dateKey);
    });

    // Shortcuts Modal
    document.getElementById('btn-open-shortcuts')?.addEventListener('click', () => {
      this.toggleShortcutsModal(true);
    });

    // Reset Schedule
    document.getElementById('btn-reset-schedule')?.addEventListener('click', async () => {
      if (confirm('Reset TimeGrid to demonstration schedule and backlog tasks?')) {
        db.pushUndoSnapshot(this.blocks, this.backlogTasks);
        await db.resetToSampleData();
        this.blocks = await db.getAllBlocks();
        this.backlogTasks = await db.getAllBacklogTasks();
        this.selectedBlockId = this.blocks[0]?.id || null;
        this.renderAll();
        this.showToast('Schedule reset to demo workspace.', { canUndo: true });
      }
    });

    // Export iCalendar (.ICS)
    document.getElementById('btn-export-ics')?.addEventListener('click', () => this.exportICS());

    // Export Backup JSON
    document.getElementById('btn-export-json')?.addEventListener('click', () => {
      const json = JSON.stringify({ blocks: this.blocks, backlogTasks: this.backlogTasks }, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `timegrid_backup_${formatDateKey(new Date())}.json`;
      a.click();
      this.showToast('Exported backup JSON.');
    });

    // Import Backup JSON
    const importInput = document.getElementById('file-import-timegrid');
    document.getElementById('btn-import-json')?.addEventListener('click', () => importInput?.click());
    importInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (parsed && Array.isArray(parsed.blocks)) {
            db.pushUndoSnapshot(this.blocks, this.backlogTasks);
            await db.replaceAllBlocks(parsed.blocks);
            if (Array.isArray(parsed.backlogTasks)) {
              await db.replaceAllBacklogTasks(parsed.backlogTasks);
            }
            this.blocks = await db.getAllBlocks();
            this.backlogTasks = await db.getAllBacklogTasks();
            this.renderAll();
            this.showToast(`Restored backup with ${parsed.blocks.length} blocks.`, { canUndo: true });
          } else {
            alert('Invalid TimeGrid backup JSON structure.');
          }
        } catch (err) {
          alert('Failed to parse backup JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    });
  }

  setupDateControls() {
    document.getElementById('btn-prev-date')?.addEventListener('click', () => {
      const step = this.viewMode === GRID_VIEWS.DAY ? 1 : 7;
      this.currentDate.setDate(this.currentDate.getDate() - step);
      this.renderAll();
    });

    document.getElementById('btn-next-date')?.addEventListener('click', () => {
      const step = this.viewMode === GRID_VIEWS.DAY ? 1 : 7;
      this.currentDate.setDate(this.currentDate.getDate() + step);
      this.renderAll();
    });

    document.getElementById('btn-today-date')?.addEventListener('click', () => {
      this.currentDate = new Date();
      this.renderAll();
    });

    // Native Date Picker Input
    const picker = document.getElementById('inp-date-picker');
    picker?.addEventListener('change', (e) => {
      if (e.target.value) {
        const parts = e.target.value.split('-');
        this.currentDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        this.renderAll();
      }
    });
  }

  setupMobileDrawers() {
    const btnToggleLeft = document.getElementById('btn-toggle-left-drawer');
    const btnToggleRight = document.getElementById('btn-toggle-right-inspector');
    const backdrop = document.getElementById('drawer-backdrop-mobile');

    btnToggleLeft?.addEventListener('click', () => this.toggleLeftDrawer());
    btnToggleRight?.addEventListener('click', () => this.toggleRightInspector());
    backdrop?.addEventListener('click', () => {
      this.toggleLeftDrawer(false);
      this.toggleRightInspector(false);
    });
  }

  toggleLeftDrawer(forceState = null) {
    const drawer = document.getElementById('task-drawer-container');
    const backdrop = document.getElementById('drawer-backdrop-mobile');
    this.isDrawerOpen = forceState !== null ? forceState : !this.isDrawerOpen;
    drawer?.classList.toggle('drawer-open-mobile', this.isDrawerOpen);
    backdrop?.classList.toggle('active', this.isDrawerOpen || this.isInspectorOpen);
  }

  toggleRightInspector(forceState = null) {
    const inspector = document.getElementById('block-inspector-container');
    const backdrop = document.getElementById('drawer-backdrop-mobile');
    this.isInspectorOpen = forceState !== null ? forceState : !this.isInspectorOpen;
    inspector?.classList.toggle('inspector-open-mobile', this.isInspectorOpen);
    backdrop?.classList.toggle('active', this.isDrawerOpen || this.isInspectorOpen);
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        this.performUndo();
        e.preventDefault();
        return;
      }

      // '?' -> Toggle Shortcuts modal
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        this.toggleShortcutsModal();
        e.preventDefault();
        return;
      }

      // 'D' -> Day view
      if (e.key === 'd' || e.key === 'D') {
        this.viewMode = GRID_VIEWS.DAY;
        document.querySelectorAll('.btn-view-mode').forEach(b => b.classList.toggle('active', b.dataset.view === 'day'));
        this.renderAll();
        return;
      }

      // 'W' -> Week view
      if (e.key === 'w' || e.key === 'W') {
        this.viewMode = GRID_VIEWS.WEEK;
        document.querySelectorAll('.btn-view-mode').forEach(b => b.classList.toggle('active', b.dataset.view === 'week'));
        this.renderAll();
        return;
      }

      // 'T' -> Jump to Today
      if (e.key === 't' || e.key === 'T') {
        this.currentDate = new Date();
        this.renderAll();
        return;
      }

      // Left/Right arrow navigation
      if (e.key === 'ArrowLeft') {
        const step = this.viewMode === GRID_VIEWS.DAY ? 1 : 7;
        this.currentDate.setDate(this.currentDate.getDate() - step);
        this.renderAll();
        return;
      }
      if (e.key === 'ArrowRight') {
        const step = this.viewMode === GRID_VIEWS.DAY ? 1 : 7;
        this.currentDate.setDate(this.currentDate.getDate() + step);
        this.renderAll();
        return;
      }

      // Delete active block
      if ((e.key === 'Delete' || e.key === 'Backspace') && this.selectedBlockId) {
        this.deleteBlock(this.selectedBlockId);
        e.preventDefault();
      }

      // 'F' key -> Start Focus Mode
      if ((e.key === 'f' || e.key === 'F') && this.selectedBlockId) {
        const b = this.blocks.find(x => x.id === this.selectedBlockId);
        if (b) this.focusManager.startFocus(b);
      }

      // 'N' key -> New Block
      if (e.key === 'n' || e.key === 'N') {
        this.createNewBlockAt({
          date: formatDateKey(this.currentDate),
          startMinute: 540,
          endMinute: 600
        });
      }
    });
  }

  toggleShortcutsModal(forceState = null) {
    const modal = document.getElementById('shortcuts-modal-container');
    if (!modal) return;
    const isShown = forceState !== null ? forceState : !modal.classList.contains('active');
    modal.classList.toggle('active', isShown);

    if (isShown) {
      modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-dialog max-w-md">
          <div class="modal-header flex items-center justify-between p-3 border-b bg-panel">
            <div class="flex items-center gap-2 font-bold text-sm">
              ${getIcon('help', 'icon-sm text-primary')}
              <span>Keyboard Shortcuts & Quick Guide</span>
            </div>
            <button class="btn-icon-xs text-muted btn-close-shortcuts">&times;</button>
          </div>
          <div class="modal-body p-4 flex flex-col gap-3 font-sans text-xs bg-panel">
            <div class="grid grid-cols-2 gap-2">
              <div class="card p-2 bg-elevated flex items-center justify-between">
                <span class="text-secondary">New Block</span>
                <kbd class="badge badge-primary font-mono font-bold">N</kbd>
              </div>
              <div class="card p-2 bg-elevated flex items-center justify-between">
                <span class="text-secondary">Start Focus Mode</span>
                <kbd class="badge badge-primary font-mono font-bold">F</kbd>
              </div>
              <div class="card p-2 bg-elevated flex items-center justify-between">
                <span class="text-secondary">Day View</span>
                <kbd class="badge badge-secondary font-mono font-bold">D</kbd>
              </div>
              <div class="card p-2 bg-elevated flex items-center justify-between">
                <span class="text-secondary">Week View</span>
                <kbd class="badge badge-secondary font-mono font-bold">W</kbd>
              </div>
              <div class="card p-2 bg-elevated flex items-center justify-between">
                <span class="text-secondary">Jump to Today</span>
                <kbd class="badge badge-secondary font-mono font-bold">T</kbd>
              </div>
              <div class="card p-2 bg-elevated flex items-center justify-between">
                <span class="text-secondary">Undo Action</span>
                <kbd class="badge badge-secondary font-mono font-bold">Ctrl+Z</kbd>
              </div>
              <div class="card p-2 bg-elevated flex items-center justify-between">
                <span class="text-secondary">Delete Block</span>
                <kbd class="badge badge-secondary font-mono font-bold">Del</kbd>
              </div>
              <div class="card p-2 bg-elevated flex items-center justify-between">
                <span class="text-secondary">Previous / Next Day</span>
                <kbd class="badge badge-secondary font-mono font-bold">&larr; / &rarr;</kbd>
              </div>
            </div>

            <div class="p-2 border-t border-subtle flex flex-col gap-1 text-muted">
              <strong>Interactive Gestures:</strong>
              <span>&bull; Double-click grid to add a 1-hour block</span>
              <span>&bull; Drag top or bottom handles to resize time</span>
              <span>&bull; Drag tasks from Backlog onto any time column</span>
            </div>
          </div>
          <div class="modal-footer p-3 border-t bg-panel flex justify-end">
            <button class="btn btn-sm btn-secondary btn-close-shortcuts">Got It</button>
          </div>
        </div>
      `;

      modal.querySelectorAll('.btn-close-shortcuts, .modal-backdrop').forEach(b => {
        b.addEventListener('click', () => modal.classList.remove('active'));
      });
    }
  }

  updateHeaderDateDisplay() {
    const lbl = document.getElementById('lbl-current-date-display');
    const picker = document.getElementById('inp-date-picker');
    const fullKey = formatDateKey(this.currentDate);

    if (lbl) {
      lbl.textContent = formatDateDisplay(this.currentDate);
      lbl.title = formatFullDateDisplay(this.currentDate);
    }
    if (picker) {
      picker.value = fullKey;
    }
  }

  // --- Undo & Toast Notifications ---
  showToast(message, { canUndo = false } = {}) {
    clearTimeout(this.toastTimer);
    let container = document.getElementById('global-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'global-toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <div class="toast-card flex items-center gap-3">
        <span class="text-xs text-primary font-sans">${escapeHTML(message)}</span>
        ${canUndo ? `
          <button class="btn btn-xs btn-primary font-mono font-bold" id="btn-toast-undo">
            ${getIcon('undo', 'icon-xs')} Undo
          </button>
        ` : ''}
        <button class="btn-icon-xs text-muted" id="btn-toast-dismiss">&times;</button>
      </div>
    `;
    container.classList.add('active');

    container.querySelector('#btn-toast-undo')?.addEventListener('click', () => {
      this.performUndo();
      container.classList.remove('active');
    });

    container.querySelector('#btn-toast-dismiss')?.addEventListener('click', () => {
      container.classList.remove('active');
    });

    this.toastTimer = setTimeout(() => {
      container.classList.remove('active');
    }, 4500);
  }

  async performUndo() {
    const snapshot = db.popUndoSnapshot();
    if (!snapshot) {
      this.showToast('Nothing to undo.');
      return;
    }

    this.blocks = snapshot.blocks;
    this.backlogTasks = snapshot.backlogTasks;
    await db.replaceAllBlocks(this.blocks);
    await db.replaceAllBacklogTasks(this.backlogTasks);
    this.renderAll();
    this.showToast('Action undone.');
  }

  // --- CRUD Block Actions ---
  selectBlock(id) {
    this.selectedBlockId = id;
    this.renderGrid();
    this.renderInspector();
  }

  async updateBlock(id, updates) {
    const block = this.blocks.find(b => b.id === id);
    if (!block) return;

    Object.assign(block, updates);
    await db.saveBlock(block);
    this.renderAll();
  }

  async deleteBlock(id, quiet = false) {
    const block = this.blocks.find(b => b.id === id);
    if (!block) return;

    db.pushUndoSnapshot(this.blocks, this.backlogTasks);
    await db.deleteBlock(id);
    this.blocks = this.blocks.filter(b => b.id !== id);

    if (this.selectedBlockId === id) {
      this.selectedBlockId = this.blocks[0]?.id || null;
    }
    this.renderAll();

    if (!quiet) {
      this.showToast(`Deleted block "${block.title}"`, { canUndo: true });
    }
  }

  async duplicateBlock(id) {
    const orig = this.blocks.find(b => b.id === id);
    if (!orig) return;

    db.pushUndoSnapshot(this.blocks, this.backlogTasks);
    const dur = orig.endMinute - orig.startMinute;
    const clone = {
      ...orig,
      id: 'b_' + Math.random().toString(36).substr(2, 7),
      title: orig.title + ' (Copy)',
      startMinute: Math.min(1440 - dur, orig.endMinute),
      endMinute: Math.min(1440, orig.endMinute + dur)
    };

    this.blocks.push(clone);
    await db.saveBlock(clone);
    this.selectedBlockId = clone.id;
    this.renderAll();
    this.showToast(`Duplicated "${orig.title}"`, { canUndo: true });
  }

  async splitBlock(id) {
    const orig = this.blocks.find(b => b.id === id);
    if (!orig) return;

    const dur = orig.endMinute - orig.startMinute;
    if (dur < 30) return alert('Block duration is too short to split (minimum 30 minutes).');

    db.pushUndoSnapshot(this.blocks, this.backlogTasks);
    const halfDur = Math.round(dur / 2);
    const midMin = orig.startMinute + halfDur;

    orig.endMinute = midMin;
    orig.title = orig.title + ' (Part 1)';
    await db.saveBlock(orig);

    const part2 = {
      ...orig,
      id: 'b_' + Math.random().toString(36).substr(2, 7),
      title: orig.title.replace(' (Part 1)', '') + ' (Part 2)',
      startMinute: midMin,
      endMinute: orig.startMinute + dur
    };

    this.blocks.push(part2);
    await db.saveBlock(part2);
    this.renderAll();
    this.showToast(`Split into two ${halfDur}m blocks.`, { canUndo: true });
  }

  async createNewBlockAt({ date, startMinute, endMinute }) {
    db.pushUndoSnapshot(this.blocks, this.backlogTasks);
    const newBlock = {
      id: 'b_' + Date.now(),
      date,
      title: 'New Focus Block',
      startMinute,
      endMinute,
      category: 'Deep Work',
      priority: 'High',
      color: '#0284c7',
      notes: ''
    };

    this.blocks.push(newBlock);
    await db.saveBlock(newBlock);
    this.selectedBlockId = newBlock.id;
    this.renderAll();
    this.showToast('Created new focus block.', { canUndo: true });
  }

  async scheduleBacklogTask(taskId, date, startMinute) {
    const task = this.backlogTasks.find(t => t.id === taskId);
    if (!task) return;

    db.pushUndoSnapshot(this.blocks, this.backlogTasks);
    const dur = task.estimatedMinutes || 60;
    const newBlock = {
      id: 'b_' + Date.now(),
      date,
      title: task.title,
      startMinute,
      endMinute: Math.min(1440, startMinute + dur),
      category: task.category || 'Deep Work',
      priority: task.priority || 'Med',
      color: '#0284c7',
      notes: ''
    };

    this.blocks.push(newBlock);
    await db.saveBlock(newBlock);
    await db.deleteBacklogTask(taskId);
    this.backlogTasks = await db.getAllBacklogTasks();
    this.selectedBlockId = newBlock.id;
    this.renderAll();
    this.showToast(`Scheduled task "${task.title}".`, { canUndo: true });
  }

  async saveAllBlocks() {
    for (const b of this.blocks) {
      await db.saveBlock(b);
    }
  }

  exportICS() {
    let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//TimeGrid//Visual Time Blocking//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n';

    for (const b of this.blocks) {
      const dateNoDash = b.date.replace(/-/g, '');
      const sH = Math.floor(b.startMinute / 60).toString().padStart(2, '0');
      const sM = (b.startMinute % 60).toString().padStart(2, '0');
      const eH = Math.floor(b.endMinute / 60).toString().padStart(2, '0');
      const eM = (b.endMinute % 60).toString().padStart(2, '0');

      ics += 'BEGIN:VEVENT\n';
      ics += `UID:${b.id}@timegrid.local\n`;
      ics += `SUMMARY:${b.title}\n`;
      ics += `DTSTART:${dateNoDash}T${sH}${sM}00\n`;
      ics += `DTEND:${dateNoDash}T${eH}${eM}00\n`;
      ics += `DESCRIPTION:${(b.notes || '').replace(/\n/g, '\\n')}\n`;
      ics += `CATEGORIES:${b.category || 'General'}\n`;
      ics += 'STATUS:CONFIRMED\n';
      ics += 'END:VEVENT\n';
    }

    ics += 'END:VCALENDAR\n';

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timegrid_schedule_${formatDateKey(new Date())}.ics`;
    a.click();
    this.showToast('Exported iCalendar (.ics) file.');
  }
}

// Bootstrap
function startTimeGrid() {
  const app = new TimeGridApp();
  window.timeGridApp = app;
  app.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startTimeGrid);
} else {
  startTimeGrid();
}
