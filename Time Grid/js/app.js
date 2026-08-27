/**
 * TimeGrid - Master Application Orchestrator
 * Integrates 24h Time Grid Canvas, Task Drawer, Block Inspector, Focus Mode, Scenarios, and Persistence.
 */

import { getIcon, escapeHTML } from './core/icons.js';
import { db } from './core/db.js';
import { formatDateKey, formatDateDisplay, minutesToTimeString, formatDuration } from './core/time.js';
import { GRID_VIEWS, TimeGridView } from './editor/time-grid.js';
import { renderTaskDrawer } from './editor/task-drawer.js';
import { renderBlockInspector } from './editor/block-inspector.js';
import { FocusModeManager } from './editor/focus-mode.js';
import { ScenarioComparisonModal } from './editor/scenario-comparison.js';

class TimeGridApp {
  constructor() {
    this.blocks = [];
    this.backlogTasks = [];
    this.selectedBlockId = null;

    // View State
    this.currentDate = new Date();
    this.viewMode = GRID_VIEWS.DAY; // 'day', 'workweek', 'week'
    this.is24Hour = false;
    this.gridSnap = 15; // 15 min

    // Scenarios State
    this.scenarios = [];
    this.activeScenarioId = 'scenario_main';
  }

  async init() {
    await db.init();
    this.blocks = await db.getAllBlocks();
    this.backlogTasks = await db.getAllBacklogTasks();

    if (this.blocks.length > 0) {
      this.selectedBlockId = this.blocks[0].id;
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
      this.deleteBlock(blockId);
    });

    const scenarioContainer = document.getElementById('scenario-modal-container');
    this.scenarioModal = new ScenarioComparisonModal(scenarioContainer, (appliedScenario) => {
      this.blocks = JSON.parse(JSON.stringify(appliedScenario.blocks));
      this.saveAllBlocks();
      this.renderAll();
    });

    this.setupToolbar();
    this.setupDateControls();
    this.setupShortcuts();
    this.renderAll();
  }

  renderAll() {
    this.renderGrid();
    this.renderDrawer();
    this.renderInspector();
    this.updateHeaderDateDisplay();
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
      },
      onDeleteTask: async (id) => {
        await db.deleteBacklogTask(id);
        this.backlogTasks = await db.getAllBacklogTasks();
        this.renderDrawer();
      },
      onApplyTemplate: (tpl) => {
        if (confirm(`Apply "${tpl.name}" routine template to ${formatDateKey(this.currentDate)}?`)) {
          const dateKey = formatDateKey(this.currentDate);
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
        }
      }
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
      onStartFocus: (block) => this.focusManager.startFocus(block)
    });
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
      document.getElementById('btn-toggle-24h').textContent = this.is24Hour ? '24h' : '12h';
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
      const currentBlocks = this.blocks.filter(b => b.date === dateKey);

      const scenarios = [
        { id: 'sc_current', name: 'Current Active Schedule', blocks: this.blocks },
        {
          id: 'sc_deep_work',
          name: 'Scenario A: Deep Focus Sprint',
          blocks: [
            ...this.blocks.filter(b => b.date !== dateKey),
            { id: 'sc_1', date: dateKey, title: 'Morning Deep Work', startMinute: 540, endMinute: 720, category: 'Deep Work', priority: 'High', color: '#0284c7' },
            { id: 'sc_2', date: dateKey, title: 'Consolidated Syncs', startMinute: 840, endMinute: 960, category: 'Meetings', priority: 'Med', color: '#8b5cf6' },
            { id: 'sc_3', date: dateKey, title: 'Afternoon Flow', startMinute: 960, endMinute: 1080, category: 'Deep Work', priority: 'High', color: '#0284c7' }
          ]
        },
        {
          id: 'sc_balanced',
          name: 'Scenario B: Balanced Flow',
          blocks: [
            ...this.blocks.filter(b => b.date !== dateKey),
            { id: 'sc_b1', date: dateKey, title: 'Planning & Inbox', startMinute: 540, endMinute: 600, category: 'Admin', priority: 'Med', color: '#f59e0b' },
            { id: 'sc_b2', date: dateKey, title: 'Deep Work Sprint', startMinute: 600, endMinute: 750, category: 'Deep Work', priority: 'High', color: '#0284c7' },
            { id: 'sc_b3', date: dateKey, title: 'Collaborative Sync', startMinute: 810, endMinute: 900, category: 'Meetings', priority: 'Med', color: '#8b5cf6' }
          ]
        }
      ];

      this.scenarioModal.open(scenarios, dateKey);
    });

    // Reset Schedule
    document.getElementById('btn-reset-schedule')?.addEventListener('click', async () => {
      if (confirm('Reset TimeGrid to demonstration schedule and backlog tasks?')) {
        await db.resetToSampleData();
        this.blocks = await db.getAllBlocks();
        this.backlogTasks = await db.getAllBacklogTasks();
        this.selectedBlockId = this.blocks[0]?.id || null;
        this.renderAll();
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
            for (const b of parsed.blocks) await db.saveBlock(b);
            if (Array.isArray(parsed.backlogTasks)) {
              for (const t of parsed.backlogTasks) await db.saveBacklogTask(t);
            }
            this.blocks = await db.getAllBlocks();
            this.backlogTasks = await db.getAllBacklogTasks();
            this.renderAll();
            alert(`Successfully restored schedule with ${parsed.blocks.length} blocks.`);
          } else {
            alert('Invalid TimeGrid backup JSON format.');
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
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      // Delete active block
      if ((e.key === 'Delete' || e.key === 'Backspace') && this.selectedBlockId) {
        this.deleteBlock(this.selectedBlockId);
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

  updateHeaderDateDisplay() {
    const lbl = document.getElementById('lbl-current-date-display');
    if (lbl) {
      lbl.textContent = formatDateDisplay(this.currentDate);
    }
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

  async deleteBlock(id) {
    await db.deleteBlock(id);
    this.blocks = this.blocks.filter(b => b.id !== id);
    if (this.selectedBlockId === id) {
      this.selectedBlockId = this.blocks[0]?.id || null;
    }
    this.renderAll();
  }

  async duplicateBlock(id) {
    const orig = this.blocks.find(b => b.id === id);
    if (!orig) return;

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
  }

  async splitBlock(id) {
    const orig = this.blocks.find(b => b.id === id);
    if (!orig) return;

    const dur = orig.endMinute - orig.startMinute;
    if (dur < 30) return alert('Block duration is too short to split.');

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
  }

  async createNewBlockAt({ date, startMinute, endMinute }) {
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
  }

  async scheduleBacklogTask(taskId, date, startMinute) {
    const task = this.backlogTasks.find(t => t.id === taskId);
    if (!task) return;

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
  }

  async saveAllBlocks() {
    for (const b of this.blocks) {
      await db.saveBlock(b);
    }
  }

  exportICS() {
    let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//TimeGrid//Visual Time Blocking//EN\n';

    for (const b of this.blocks) {
      const dateNoDash = b.date.replace(/-/g, '');
      const sH = Math.floor(b.startMinute / 60).toString().padStart(2, '0');
      const sM = (b.startMinute % 60).toString().padStart(2, '0');
      const eH = Math.floor(b.endMinute / 60).toString().padStart(2, '0');
      const eM = (b.endMinute % 60).toString().padStart(2, '0');

      ics += 'BEGIN:VEVENT\n';
      ics += `SUMMARY:${b.title}\n`;
      ics += `DTSTART:${dateNoDash}T${sH}${sM}00\n`;
      ics += `DTEND:${dateNoDash}T${eH}${eM}00\n`;
      ics += `DESCRIPTION:${b.notes || ''}\n`;
      ics += `CATEGORIES:${b.category || 'General'}\n`;
      ics += 'END:VEVENT\n';
    }

    ics += 'END:VCALENDAR\n';

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timegrid_schedule_${formatDateKey(new Date())}.ics`;
    a.click();
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
