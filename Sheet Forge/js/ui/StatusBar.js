/**
 * SheetForge - Status Bar
 * Mode indicator, dynamic range calculation aggregates (Sum, Avg, Count, Min, Max), and zoom slider
 */
export class StatusBar {
    constructor(containerElement, eventEmitter) {
        this.container = containerElement;
        this.emitter = eventEmitter;
        this.currentZoom = 100;

        this._render();
        this._bindEvents();
    }

    _render() {
        this.container.innerHTML = `
            <div class="sf-statusbar">
                <!-- Left: Mode & Selection Info -->
                <div class="sf-status-left">
                    <span class="sf-status-mode" id="sbMode">READY</span>
                    <span class="sf-status-selection" id="sbSelection">A1</span>
                </div>

                <!-- Center: Aggregate Statistics -->
                <div class="sf-status-center" id="sbAggregates">
                    <div class="sf-stat-item" id="statSum" title="Sum of numerical cells" style="display:none;">
                        <span class="sf-stat-label">SUM:</span>
                        <span class="sf-stat-val">0</span>
                    </div>
                    <div class="sf-stat-item" id="statAvg" title="Average of numerical cells" style="display:none;">
                        <span class="sf-stat-label">AVERAGE:</span>
                        <span class="sf-stat-val">0</span>
                    </div>
                    <div class="sf-stat-item" id="statCount" title="Count of non-empty cells" style="display:none;">
                        <span class="sf-stat-label">COUNT:</span>
                        <span class="sf-stat-val">0</span>
                    </div>
                    <div class="sf-stat-item" id="statMin" title="Minimum value" style="display:none;">
                        <span class="sf-stat-label">MIN:</span>
                        <span class="sf-stat-val">0</span>
                    </div>
                    <div class="sf-stat-item" id="statMax" title="Maximum value" style="display:none;">
                        <span class="sf-stat-label">MAX:</span>
                        <span class="sf-stat-val">0</span>
                    </div>
                </div>

                <!-- Right: Zoom Controls -->
                <div class="sf-status-right">
                    <button class="sf-zoom-btn" id="sbZoomOut" title="Zoom Out">-</button>
                    <span class="sf-zoom-level" id="sbZoomLevel">100%</span>
                    <button class="sf-zoom-btn" id="sbZoomIn" title="Zoom In">+</button>
                    <button class="sf-zoom-btn" id="sbZoomReset" title="Reset Zoom">⟲</button>
                </div>
            </div>
        `;

        this.modeEl = this.container.querySelector('#sbMode');
        this.selectionEl = this.container.querySelector('#sbSelection');
        this.aggregatesEl = this.container.querySelector('#sbAggregates');
        this.statSum = this.container.querySelector('#statSum');
        this.statAvg = this.container.querySelector('#statAvg');
        this.statCount = this.container.querySelector('#statCount');
        this.statMin = this.container.querySelector('#statMin');
        this.statMax = this.container.querySelector('#statMax');
        this.zoomLevelEl = this.container.querySelector('#sbZoomLevel');
    }

    _bindEvents() {
        // Mode listeners
        this.emitter.on('editor:start', () => this.setMode('EDIT'));
        this.emitter.on('editor:commit', () => this.setMode('READY'));
        this.emitter.on('editor:cancel', () => this.setMode('READY'));

        // Selection stats calculator
        this.emitter.on('selection:changed', ({ selectedCells, address, dimensions }) => {
            this.selectionEl.innerText = `${address} ${dimensions ? `(${dimensions})` : ''}`;
            this.calculateAggregates(selectedCells);
        });

        // Zoom buttons
        this.container.querySelector('#sbZoomIn').addEventListener('click', () => this.changeZoom(10));
        this.container.querySelector('#sbZoomOut').addEventListener('click', () => this.changeZoom(-10));
        this.container.querySelector('#sbZoomReset').addEventListener('click', () => this.setZoom(100));
    }

    setMode(mode) {
        this.modeEl.innerText = mode;
        this.modeEl.className = `sf-status-mode sf-mode-${mode.toLowerCase()}`;
    }

    calculateAggregates(selectedItems) {
        if (!selectedItems || selectedItems.length <= 1) {
            this.hideAllAggregates();
            return;
        }

        let sum = 0;
        let count = 0;
        let numCount = 0;
        let min = Infinity;
        let max = -Infinity;

        for (const item of selectedItems) {
            const cell = item.cell;
            if (!cell) continue;

            const raw = cell.rawValue;
            if (raw !== '' && raw !== null && raw !== undefined) {
                count++;
            }

            const num = cell.numericValue;
            if (num !== null && !isNaN(num)) {
                sum += num;
                numCount++;
                if (num < min) min = num;
                if (num > max) max = num;
            }
        }

        if (numCount > 0) {
            const avg = sum / numCount;
            this.showStat(this.statSum, this.formatNum(sum));
            this.showStat(this.statAvg, this.formatNum(avg));
            this.showStat(this.statCount, String(count));
            this.showStat(this.statMin, this.formatNum(min));
            this.showStat(this.statMax, this.formatNum(max));
        } else if (count > 0) {
            this.hideAllAggregates();
            this.showStat(this.statCount, String(count));
        } else {
            this.hideAllAggregates();
        }
    }

    showStat(el, val) {
        el.querySelector('.sf-stat-val').innerText = val;
        el.style.display = 'inline-flex';
    }

    hideAllAggregates() {
        this.statSum.style.display = 'none';
        this.statAvg.style.display = 'none';
        this.statCount.style.display = 'none';
        this.statMin.style.display = 'none';
        this.statMax.style.display = 'none';
    }

    formatNum(num) {
        if (Number.isInteger(num)) return num.toLocaleString();
        return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    changeZoom(delta) {
        const newZoom = Math.min(200, Math.max(50, this.currentZoom + delta));
        this.setZoom(newZoom);
    }

    setZoom(zoom) {
        this.currentZoom = zoom;
        this.zoomLevelEl.innerText = `${this.currentZoom}%`;
        if (this.emitter) {
            this.emitter.emit('grid:zoom', this.currentZoom / 100);
        }
    }
}
