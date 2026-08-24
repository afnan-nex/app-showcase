/**
 * SheetForge - Filter & Sort Manager
 * Column header filter popover, distinct value checklist, condition filters, and table sorting
 */
import { colIndexToLetter } from '../model/Sheet.js';

export class FilterManager {
    constructor(grid, eventEmitter) {
        this.grid = grid;
        this.emitter = eventEmitter;
        this.activeFilterCol = null;

        this._setupDOM();
        this._bindEvents();
    }

    _setupDOM() {
        this.popover = document.createElement('div');
        this.popover.className = 'sf-filter-popover';
        this.popover.style.display = 'none';

        this.popover.innerHTML = `
            <div class="sf-filter-popover-inner">
                <!-- Sort Quick Actions -->
                <div class="sf-filter-sort-group">
                    <button class="sf-btn sf-btn-sm" id="fpSortAsc">▲ Sort A to Z</button>
                    <button class="sf-btn sf-btn-sm" id="fpSortDesc">▼ Sort Z to A</button>
                </div>

                <div class="sf-dropdown-divider"></div>

                <!-- Condition Filter -->
                <div class="sf-form-group">
                    <label class="sf-filter-label">Filter by Condition</label>
                    <select class="sf-select sf-select-sm" id="fpConditionType">
                        <option value="none">None</option>
                        <option value="empty">Is Empty</option>
                        <option value="notEmpty">Is Not Empty</option>
                        <option value="contains">Text Contains</option>
                        <option value="greaterThan">Greater Than (&gt;)</option>
                        <option value="lessThan">Less Than (&lt;)</option>
                        <option value="equals">Equals (=)</option>
                    </select>
                    <input type="text" class="sf-input sf-input-sm" id="fpConditionVal" placeholder="Value..." style="display:none; margin-top: 4px;">
                </div>

                <div class="sf-dropdown-divider"></div>

                <!-- Value Checklist -->
                <div class="sf-form-group">
                    <label class="sf-filter-label">Filter by Values</label>
                    <input type="text" class="sf-input sf-input-sm" id="fpSearchValues" placeholder="Search values...">
                    <div class="sf-filter-select-all-row">
                        <a href="#" id="fpSelectAll">Select All</a> • <a href="#" id="fpClearAll">Clear</a>
                    </div>
                    <div class="sf-filter-checklist" id="fpChecklist"></div>
                </div>

                <div class="sf-dropdown-divider"></div>

                <!-- Footer Buttons -->
                <div class="sf-filter-footer">
                    <button class="sf-btn sf-btn-secondary sf-btn-sm" id="fpClearFilterBtn">Clear Filter</button>
                    <button class="sf-btn sf-btn-primary sf-btn-sm" id="fpApplyBtn">Apply</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.popover);
    }

    _bindEvents() {
        // Column header filter button clicks
        this.grid.colHeadersTrack.addEventListener('click', (e) => {
            const filterBtn = e.target.closest('.sf-col-filter-btn');
            if (filterBtn) {
                e.stopPropagation();
                const col = parseInt(filterBtn.dataset.col, 10);
                const rect = filterBtn.getBoundingClientRect();
                this.openFilterPopover(col, rect.left, rect.bottom + 4);
            }
        });

        // Condition dropdown visibility
        const condType = this.popover.querySelector('#fpConditionType');
        const condVal = this.popover.querySelector('#fpConditionVal');
        condType.addEventListener('change', () => {
            if (['contains', 'greaterThan', 'lessThan', 'equals'].includes(condType.value)) {
                condVal.style.display = 'block';
            } else {
                condVal.style.display = 'none';
            }
        });

        // Search values
        this.popover.querySelector('#fpSearchValues').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.popover.querySelectorAll('.sf-filter-check-item').forEach(item => {
                const text = item.querySelector('span').innerText.toLowerCase();
                item.style.display = text.includes(query) ? 'flex' : 'none';
            });
        });

        // Select All / Clear All
        this.popover.querySelector('#fpSelectAll').addEventListener('click', (e) => {
            e.preventDefault();
            this.popover.querySelectorAll('#fpChecklist input[type="checkbox"]').forEach(cb => cb.checked = true);
        });
        this.popover.querySelector('#fpClearAll').addEventListener('click', (e) => {
            e.preventDefault();
            this.popover.querySelectorAll('#fpChecklist input[type="checkbox"]').forEach(cb => cb.checked = false);
        });

        // Sort buttons
        this.popover.querySelector('#fpSortAsc').addEventListener('click', () => {
            if (this.activeFilterCol !== null && this.emitter) {
                this.emitter.emit('action:sortColumn', { col: this.activeFilterCol, order: 'asc' });
                this.close();
            }
        });
        this.popover.querySelector('#fpSortDesc').addEventListener('click', () => {
            if (this.activeFilterCol !== null && this.emitter) {
                this.emitter.emit('action:sortColumn', { col: this.activeFilterCol, order: 'desc' });
                this.close();
            }
        });

        // Apply filter
        this.popover.querySelector('#fpApplyBtn').addEventListener('click', () => {
            this.applyFilter();
            this.close();
        });

        // Clear filter
        this.popover.querySelector('#fpClearFilterBtn').addEventListener('click', () => {
            if (this.emitter) {
                this.emitter.emit('action:clearFilterOnCol', this.activeFilterCol);
            }
            this.close();
        });

        // Dismiss
        window.addEventListener('click', (e) => {
            if (!e.target.closest('.sf-filter-popover') && !e.target.closest('.sf-col-filter-btn')) {
                this.close();
            }
        });
    }

    openFilterPopover(col, x, y) {
        this.activeFilterCol = col;
        const sheet = this.grid.sheet;
        if (!sheet) return;

        // Collect distinct values for column
        const valuesSet = new Set();
        const startRow = sheet.filterRange ? sheet.filterRange.startRow + 1 : 0;
        const endRow = sheet.filterRange ? sheet.filterRange.endRow : sheet.rowCount - 1;

        for (let r = startRow; r <= endRow; r++) {
            const cell = sheet.getCell(r, col);
            const val = cell ? (cell.displayValue || '(Blanks)') : '(Blanks)';
            valuesSet.add(val);
        }

        const sortedVals = Array.from(valuesSet).sort();

        // Render checklist
        const checklistEl = this.popover.querySelector('#fpChecklist');
        checklistEl.innerHTML = sortedVals.map(val => `
            <label class="sf-filter-check-item">
                <input type="checkbox" value="${this.grid.escapeHTML(val)}" checked>
                <span>${this.grid.escapeHTML(val)}</span>
            </label>
        `).join('');

        this.popover.style.left = `${Math.min(window.innerWidth - 280, Math.max(10, x))}px`;
        this.popover.style.top = `${y}px`;
        this.popover.style.display = 'block';
    }

    close() {
        this.popover.style.display = 'none';
        this.activeFilterCol = null;
    }

    applyFilter() {
        if (this.activeFilterCol === null || !this.grid.sheet) return;

        const condType = this.popover.querySelector('#fpConditionType').value;
        const condVal = this.popover.querySelector('#fpConditionVal').value;

        const checkedValues = new Set();
        this.popover.querySelectorAll('#fpChecklist input[type="checkbox"]:checked').forEach(cb => {
            checkedValues.add(cb.value);
        });

        if (this.emitter) {
            this.emitter.emit('action:applyColumnFilter', {
                col: this.activeFilterCol,
                condition: { type: condType, value: condVal },
                allowedValues: checkedValues
            });
        }
    }
}
