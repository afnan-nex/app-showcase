/**
 * TimeGrid - Block Property Inspector & Analytics Panel (Right Panel)
 * Time block metadata editor, color swatch selector, split/duplicate/delete actions,
 * conflict resolution tools, Maker vs Manager ratio, and schedule category analytics.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { minutesToTimeString, formatDuration, timeStringToMinutes } from '../core/time.js';
import { CATEGORIES, COLOR_SWATCHES } from '../engine/templates.js';
import { renderCategoryDonut } from '../engine/charts.js';
import { calculateScheduleMetrics, detectConflicts, getConflictList, autoResolveConflict } from '../engine/conflicts.js';

export function renderBlockInspector(container, {
  selectedBlock = null,
  dayBlocks = [],
  is24Hour = false,
  onUpdateBlock = null,
  onDeleteBlock = null,
  onDuplicateBlock = null,
  onSplitBlock = null,
  onStartFocus = null,
  onCloseInspector = null,
  onBatchUpdateBlocks = null
}) {
  const metrics = calculateScheduleMetrics(dayBlocks);
  const conflictMap = detectConflicts(dayBlocks);
  const selectedConflict = selectedBlock ? conflictMap.get(selectedBlock.id) : null;
  const allConflicts = getConflictList(dayBlocks);

  const durMin = selectedBlock ? Math.max(0, selectedBlock.endMinute - selectedBlock.startMinute) : 0;

  container.innerHTML = `
    <!-- Top Inspector Header -->
    <div class="panel-section-header flex items-center justify-between p-3 border-b bg-panel select-none">
      <div class="flex items-center gap-2">
        ${getIcon(selectedBlock ? 'clock' : 'chart', 'icon-sm text-primary')}
        <span class="text-xs font-bold uppercase text-muted">
          ${selectedBlock ? 'Block Properties' : 'Schedule Insights'}
        </span>
      </div>
      <div class="flex items-center gap-1.5">
        ${selectedBlock ? `
          <button class="btn btn-xs btn-primary" id="btn-inspect-focus" title="Start Focus Timer (F)">
            ${getIcon('play', 'icon-xs')} Focus
          </button>
        ` : ''}
        ${onCloseInspector ? `
          <button class="btn-icon-xs text-muted btn-close-inspector-trigger md:hidden" title="Close Inspector">
            ${getIcon('close', 'icon-xs')}
          </button>
        ` : ''}
      </div>
    </div>

    <!-- Inspector Body Scroll -->
    <div class="inspector-body-scroll p-3 flex flex-col gap-3 flex-1 overflow-y-auto">
      
      <!-- Selected Block Property Editor -->
      ${selectedBlock ? `
        <div class="card p-3 flex flex-col gap-2.5 bg-panel border-subtle">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5 min-w-0 pr-2">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${selectedBlock.color || '#0284c7'};"></span>
              <span class="font-bold text-xs text-primary truncate">${escapeHTML(selectedBlock.title)}</span>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <button class="btn-icon-xs" id="btn-inspect-split" title="Split Block into 2 Half-Hour Segments">${getIcon('split', 'icon-xs')}</button>
              <button class="btn-icon-xs" id="btn-inspect-dupe" title="Duplicate Block">${getIcon('copy', 'icon-xs')}</button>
              <button class="btn-icon-xs text-rose" id="btn-inspect-del" title="Delete Block (Del)">${getIcon('trash', 'icon-xs')}</button>
            </div>
          </div>

          <!-- Conflict Warning Card (if this block conflicts) -->
          ${selectedConflict && selectedConflict.hasConflict ? `
            <div class="card p-2 bg-amber-subtle border-amber flex flex-col gap-1.5">
              <div class="flex items-center gap-1.5 text-xs text-amber font-bold">
                ${getIcon('alert', 'icon-xs text-amber')}
                <span>Schedule Conflict Detected</span>
              </div>
              <p class="text-xs text-secondary" style="font-size: 10.5px;">
                Overlaps by <strong>${selectedConflict.totalOverlapMinutes}m</strong> with:
                ${selectedConflict.conflictingWith.map(c => `<span class="text-amber">${escapeHTML(c.title)}</span>`).join(', ')}
              </p>
              <button class="btn btn-xs btn-secondary text-amber w-full justify-center" id="btn-resolve-this-conflict">
                Auto-Shift to Resolve Overlap
              </button>
            </div>
          ` : ''}

          <!-- Title -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Title</label>
            <input type="text" id="inp-block-title" class="form-control form-control-sm font-semibold" value="${escapeHTML(selectedBlock.title)}" />
          </div>

          <!-- Start & End Time & Duration -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Start</label>
              <input type="text" id="inp-block-start" class="form-control form-control-sm font-mono" value="${minutesToTimeString(selectedBlock.startMinute, is24Hour)}" />
            </div>
            <div class="form-group">
              <div class="flex items-center justify-between">
                <label class="form-label text-xs font-semibold text-muted">End</label>
                <span class="text-xs font-mono text-muted" style="font-size: 9.5px;">${formatDuration(durMin)}</span>
              </div>
              <input type="text" id="inp-block-end" class="form-control form-control-sm font-mono" value="${minutesToTimeString(selectedBlock.endMinute, is24Hour)}" />
            </div>
          </div>

          <!-- Category & Priority -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Category</label>
              <select id="select-block-cat" class="form-control form-control-sm">
                ${Object.keys(CATEGORIES).map(c => `
                  <option value="${c}" ${selectedBlock.category === c ? 'selected' : ''}>${c}</option>
                `).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Priority</label>
              <select id="select-block-priority" class="form-control form-control-sm">
                <option value="High" ${selectedBlock.priority === 'High' ? 'selected' : ''}>High Focus</option>
                <option value="Med" ${selectedBlock.priority === 'Med' ? 'selected' : ''}>Medium</option>
                <option value="Low" ${selectedBlock.priority === 'Low' ? 'selected' : ''}>Low / Buffer</option>
              </select>
            </div>
          </div>

          <!-- Color Swatches -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Accent Color</label>
            <div class="flex items-center gap-1.5 flex-wrap">
              ${COLOR_SWATCHES.map(color => `
                <button type="button" class="btn-color-swatch w-4 h-4 rounded-full border border-subtle transition-transform hover:scale-110 ${selectedBlock.color === color ? 'ring-2 ring-white' : ''}"
                        data-color="${color}"
                        style="background-color: ${color};"
                        title="${color}">
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Recurrence Pattern -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Recurrence Routine</label>
            <select id="select-block-recurrence" class="form-control form-control-sm">
              <option value="none" ${selectedBlock.recurrence === 'none' || !selectedBlock.recurrence ? 'selected' : ''}>Does not repeat</option>
              <option value="daily" ${selectedBlock.recurrence === 'daily' ? 'selected' : ''}>Every day</option>
              <option value="weekdays" ${selectedBlock.recurrence === 'weekdays' ? 'selected' : ''}>Every weekday (Mon-Fri)</option>
              <option value="weekends" ${selectedBlock.recurrence === 'weekends' ? 'selected' : ''}>Every weekend (Sat-Sun)</option>
              <option value="weekly" ${selectedBlock.recurrence === 'weekly' ? 'selected' : ''}>Weekly</option>
            </select>
          </div>

          <!-- Notes -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Notes & Objectives</label>
            <textarea id="inp-block-notes" class="form-control form-control-sm font-sans" rows="2" placeholder="Key outcomes, checklist or links...">${escapeHTML(selectedBlock.notes || '')}</textarea>
          </div>
        </div>
      ` : `
        <div class="card p-3 text-center text-muted bg-panel border-dashed border-subtle text-xs">
          Select any block on the grid to edit properties or start a focus session.
        </div>
      `}

      <!-- Daily Time Distribution Donut Chart -->
      <div class="card p-3 flex flex-col gap-2 bg-panel border-subtle">
        <div class="flex items-center justify-between">
          <span class="font-bold text-xs text-primary uppercase" style="font-size: 10px;">Time Allocation</span>
          <span class="font-mono text-xs text-muted" style="font-size: 10px;">${dayBlocks.length} Blocks &bull; ${formatDuration(metrics.totalScheduled)}</span>
        </div>
        <div class="flex items-center justify-center py-1">
          <canvas id="inspector-category-donut" width="220" height="150"></canvas>
        </div>

        <!-- Maker vs Manager Ratio Bar -->
        <div class="flex flex-col gap-1 border-t pt-2 border-subtle text-xs">
          <div class="flex items-center justify-between font-semibold" style="font-size: 10.5px;">
            <span class="text-primary">Maker / Deep Work Ratio</span>
            <span class="font-mono text-primary font-bold">${metrics.makerRatio}%</span>
          </div>
          <div class="w-full bg-elevated h-1.5 rounded overflow-hidden flex">
            <div class="h-full bg-primary" style="width: ${metrics.makerRatio}%; background-color: var(--accent-primary);"></div>
            <div class="h-full bg-muted" style="width: ${100 - metrics.makerRatio}%; background-color: #8b5cf6;"></div>
          </div>
          <div class="flex items-center justify-between text-muted font-mono" style="font-size: 9.5px;">
            <span>Deep Work: ${formatDuration(metrics.focusTime)}</span>
            <span>Meetings: ${formatDuration(metrics.meetingTime)}</span>
          </div>
        </div>
      </div>

      <!-- Schedule Metrics Summary -->
      <div class="card p-3 flex flex-col gap-2 font-sans text-xs bg-panel border-subtle">
        <div class="flex items-center justify-between">
          <span class="font-bold text-xs text-primary uppercase" style="font-size: 10px;">Daily Productivity</span>
          <span class="badge ${metrics.efficiency >= 70 ? 'badge-primary' : 'badge-secondary'} font-mono">${metrics.efficiency}% Score</span>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="card p-2 text-center bg-elevated">
            <span class="text-xs text-muted block" style="font-size: 10px;">Deep Focus</span>
            <strong class="font-mono text-sm text-primary">${formatDuration(metrics.focusTime)}</strong>
          </div>
          <div class="card p-2 text-center bg-elevated">
            <span class="text-xs text-muted block" style="font-size: 10px;">Meetings</span>
            <strong class="font-mono text-sm text-secondary">${formatDuration(metrics.meetingTime)}</strong>
          </div>
          <div class="card p-2 text-center bg-elevated">
            <span class="text-xs text-muted block" style="font-size: 10px;">Free Buffer</span>
            <strong class="font-mono text-sm text-emerald">${formatDuration(metrics.freeWorkdayTime)}</strong>
          </div>
          <div class="card p-2 text-center bg-elevated">
            <span class="text-xs text-muted block" style="font-size: 10px;">Conflicts</span>
            <strong class="font-mono text-sm ${metrics.totalConflicts > 0 ? 'text-amber font-bold' : 'text-muted'}">${metrics.totalConflicts}</strong>
          </div>
        </div>
      </div>

    </div>
  `;

  // Draw Category Donut Chart
  const donutCanvas = container.querySelector('#inspector-category-donut');
  if (donutCanvas) {
    renderCategoryDonut(donutCanvas, dayBlocks);
  }

  // Attach Selected Block Handlers
  if (selectedBlock) {
    container.querySelector('#inp-block-title')?.addEventListener('input', (e) => {
      selectedBlock.title = e.target.value.trim() || 'Untitled Block';
      if (onUpdateBlock) onUpdateBlock(selectedBlock);
    });

    container.querySelector('#inp-block-start')?.addEventListener('change', (e) => {
      const min = timeStringToMinutes(e.target.value);
      selectedBlock.startMinute = min;
      if (onUpdateBlock) onUpdateBlock(selectedBlock);
    });

    container.querySelector('#inp-block-end')?.addEventListener('change', (e) => {
      const min = timeStringToMinutes(e.target.value);
      selectedBlock.endMinute = Math.max(selectedBlock.startMinute + 15, min);
      if (onUpdateBlock) onUpdateBlock(selectedBlock);
    });

    container.querySelector('#select-block-cat')?.addEventListener('change', (e) => {
      selectedBlock.category = e.target.value;
      const catDef = CATEGORIES[e.target.value];
      if (catDef) selectedBlock.color = catDef.color;
      if (onUpdateBlock) onUpdateBlock(selectedBlock);
    });

    container.querySelector('#select-block-priority')?.addEventListener('change', (e) => {
      selectedBlock.priority = e.target.value;
      if (onUpdateBlock) onUpdateBlock(selectedBlock);
    });

    container.querySelector('#select-block-recurrence')?.addEventListener('change', (e) => {
      selectedBlock.recurrence = e.target.value;
      if (onUpdateBlock) onUpdateBlock(selectedBlock);
    });

    container.querySelector('#inp-block-notes')?.addEventListener('change', (e) => {
      selectedBlock.notes = e.target.value;
      if (onUpdateBlock) onUpdateBlock(selectedBlock);
    });

    // Swatches
    container.querySelectorAll('.btn-color-swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedBlock.color = btn.dataset.color;
        if (onUpdateBlock) onUpdateBlock(selectedBlock);
      });
    });

    container.querySelector('#btn-inspect-focus')?.addEventListener('click', () => {
      if (onStartFocus) onStartFocus(selectedBlock);
    });

    container.querySelector('#btn-inspect-split')?.addEventListener('click', () => {
      if (onSplitBlock) onSplitBlock(selectedBlock.id);
    });

    container.querySelector('#btn-inspect-dupe')?.addEventListener('click', () => {
      if (onDuplicateBlock) onDuplicateBlock(selectedBlock.id);
    });

    container.querySelector('#btn-inspect-del')?.addEventListener('click', () => {
      if (onDeleteBlock) onDeleteBlock(selectedBlock.id);
    });

    // Auto resolve conflict button
    container.querySelector('#btn-resolve-this-conflict')?.addEventListener('click', () => {
      if (selectedConflict && selectedConflict.conflictingWith.length > 0) {
        const otherId = selectedConflict.conflictingWith[0].id;
        const resolved = autoResolveConflict(selectedBlock.id, otherId, dayBlocks);
        if (onBatchUpdateBlocks) {
          onBatchUpdateBlocks(resolved);
        }
      }
    });
  }

  // Close inspector trigger (mobile)
  container.querySelector('.btn-close-inspector-trigger')?.addEventListener('click', () => {
    if (onCloseInspector) onCloseInspector();
  });
}
