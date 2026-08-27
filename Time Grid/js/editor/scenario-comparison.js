/**
 * TimeGrid - Schedule Simulation & Scenario Comparison Component
 * Side-by-side comparison matrix for simulated daily schedules (Focus vs Meetings vs Free Time vs Conflicts)
 * with mini timeline visualizers and 1-click application.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { formatDuration, minutesToTimeString } from '../core/time.js';
import { calculateScheduleMetrics } from '../engine/conflicts.js';

export class ScenarioComparisonModal {
  constructor(container, onApplyScenario) {
    this.container = container;
    this.onApplyScenario = onApplyScenario;
    this.scenarios = [];
    this.currentDateStr = '';
    this.keyListener = null;
  }

  open(scenarios = [], currentDateStr = '') {
    this.scenarios = scenarios;
    this.currentDateStr = currentDateStr;
    this.render();
    this.container.classList.add('active');

    this.keyListener = (e) => {
      if (e.key === 'Escape') this.close();
    };
    window.addEventListener('keydown', this.keyListener);
  }

  close() {
    this.container.classList.remove('active');
    if (this.keyListener) {
      window.removeEventListener('keydown', this.keyListener);
      this.keyListener = null;
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog scenario-modal-dialog">
        <div class="modal-header flex items-center justify-between p-3 border-b bg-panel select-none">
          <div class="flex items-center gap-2">
            ${getIcon('layers', 'icon-sm text-primary')}
            <span class="font-bold text-sm">Schedule Simulation & Scenario Comparison</span>
          </div>
          <button class="btn-icon-xs text-muted btn-modal-close" title="Close (Esc)">&times;</button>
        </div>

        <div class="modal-body p-4 flex flex-col gap-4 overflow-y-auto bg-panel" style="max-height: 75vh;">
          <p class="text-xs text-muted font-sans">
            Simulate and benchmark alternative schedule distributions for <strong>${this.currentDateStr}</strong> to eliminate cognitive fragmentation and optimize Maker vs Manager time.
          </p>

          <!-- Comparison Table Grid -->
          <div class="overflow-x-auto rounded border border-subtle">
            <table class="data-grid-table font-sans text-xs w-full">
              <thead>
                <tr>
                  <th>Scenario & Timeline Preview</th>
                  <th class="text-center">Deep Focus</th>
                  <th class="text-center">Meetings</th>
                  <th class="text-center">Buffer</th>
                  <th class="text-center">Maker %</th>
                  <th class="text-center">Conflicts</th>
                  <th class="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                ${this.scenarios.map(sc => {
                  const dayBlocks = sc.blocks.filter(b => b.date === this.currentDateStr);
                  const m = calculateScheduleMetrics(dayBlocks);

                  return `
                    <tr>
                      <td style="max-width: 260px;">
                        <div class="flex flex-col gap-1.5 py-1">
                          <strong class="text-primary text-xs">${escapeHTML(sc.name)}</strong>
                          <!-- Mini timeline visualizer -->
                          <div class="w-full bg-elevated h-2 rounded overflow-hidden relative flex">
                            ${dayBlocks.map(b => {
                              const leftPct = (b.startMinute / 1440) * 100;
                              const widthPct = Math.max(1, ((b.endMinute - b.startMinute) / 1440) * 100);
                              return `
                                <div class="absolute h-full rounded-xs"
                                     style="left: ${leftPct}%; width: ${widthPct}%; background-color: ${b.color || '#0284c7'};"
                                     title="${escapeHTML(b.title)} (${minutesToTimeString(b.startMinute)} - ${minutesToTimeString(b.endMinute)})">
                                </div>
                              `;
                            }).join('')}
                          </div>
                          <span class="text-xs text-muted font-mono" style="font-size: 9.5px;">${dayBlocks.length} blocks &bull; ${formatDuration(m.totalScheduled)} total</span>
                        </div>
                      </td>
                      <td class="text-center font-mono font-bold text-primary">${formatDuration(m.focusTime)}</td>
                      <td class="text-center font-mono text-secondary">${formatDuration(m.meetingTime)}</td>
                      <td class="text-center font-mono text-emerald">${formatDuration(m.freeWorkdayTime)}</td>
                      <td class="text-center font-mono font-bold text-primary">${m.makerRatio}%</td>
                      <td class="text-center font-mono ${m.totalConflicts > 0 ? 'text-amber font-bold' : 'text-muted'}">${m.totalConflicts}</td>
                      <td class="text-right">
                        <button class="btn btn-xs btn-primary btn-apply-scenario-row" data-id="${sc.id}">
                          Apply Schedule
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

        </div>

        <div class="modal-footer p-3 border-t bg-panel flex justify-between items-center">
          <span class="text-xs text-muted font-mono" style="font-size: 10px;">Applying a scenario automatically saves an undo snapshot</span>
          <button class="btn btn-sm btn-secondary btn-modal-close">Close</button>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    this.container.querySelectorAll('.btn-modal-close, .modal-backdrop').forEach(b => {
      b.addEventListener('click', () => this.close());
    });

    this.container.querySelectorAll('.btn-apply-scenario-row').forEach(b => {
      b.addEventListener('click', () => {
        const scId = b.dataset.id;
        const targetSc = this.scenarios.find(s => s.id === scId);
        if (targetSc && this.onApplyScenario) {
          this.onApplyScenario(targetSc);
        }
        this.close();
      });
    });
  }
}
