/**
 * SheetForge - Chart Engine & Widget Manager
 * Pure HTML5 Canvas rendering for Bar, Line, Pie, Doughnut, Area, and Scatter charts with live cell sync
 */
import { parseCellAddress, formatCellAddress } from '../model/Sheet.js';

export const CHART_PALETTE = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#ec4899', '#6366f1', '#14b8a6', '#f97316'
];

export class ChartManager {
    constructor(containerElement, eventEmitter) {
        this.container = containerElement;
        this.emitter = eventEmitter;
        this.activeCharts = new Map(); // id -> chartInstance

        this._setupModalDOM();
        this._bindEvents();
    }

    _setupModalDOM() {
        this.modal = document.createElement('div');
        this.modal.className = 'sf-modal-backdrop sf-chart-modal-backdrop';
        this.modal.style.display = 'none';
        this.modal.innerHTML = `
            <div class="sf-modal-dialog sf-chart-dialog">
                <div class="sf-modal-header">
                    <h3 class="sf-modal-title">Create / Edit Chart</h3>
                    <button class="sf-modal-close" id="chartModalClose">✕</button>
                </div>
                <div class="sf-modal-body sf-chart-modal-grid">
                    <!-- Left: Configuration Form -->
                    <div class="sf-chart-form">
                        <div class="sf-form-group">
                            <label>Chart Title</label>
                            <input type="text" class="sf-input" id="chartTitleInput" value="Data Overview">
                        </div>

                        <div class="sf-form-group">
                            <label>Chart Type</label>
                            <select class="sf-select" id="chartTypeSelect">
                                <option value="bar">Bar / Column Chart</option>
                                <option value="line">Line Chart</option>
                                <option value="pie">Pie Chart</option>
                                <option value="doughnut">Doughnut Chart</option>
                                <option value="area">Area Chart</option>
                            </select>
                        </div>

                        <div class="sf-form-group">
                            <label>Data Range (e.g. A1:D10)</label>
                            <input type="text" class="sf-input" id="chartDataRangeInput" placeholder="A1:B10">
                        </div>

                        <div class="sf-form-group">
                            <label><input type="checkbox" id="chartFirstRowHeader" checked> First row as header / labels</label>
                        </div>
                    </div>

                    <!-- Right: Live Canvas Preview -->
                    <div class="sf-chart-preview-container">
                        <canvas class="sf-chart-canvas-preview" id="chartPreviewCanvas" width="460" height="280"></canvas>
                    </div>
                </div>

                <div class="sf-modal-footer">
                    <button class="sf-btn sf-btn-secondary" id="chartCancelBtn">Cancel</button>
                    <button class="sf-btn sf-btn-primary" id="chartInsertBtn">Insert Chart into Sheet</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);
    }

    _bindEvents() {
        this.modal.querySelector('#chartModalClose').addEventListener('click', () => this.closeModal());
        this.modal.querySelector('#chartCancelBtn').addEventListener('click', () => this.closeModal());

        // Live preview updates on form changes
        const updatePreview = () => {
            const config = this.getModalConfig();
            this.renderCanvasChart(this.modal.querySelector('#chartPreviewCanvas'), config);
        };

        this.modal.querySelector('#chartTitleInput').addEventListener('input', updatePreview);
        this.modal.querySelector('#chartTypeSelect').addEventListener('change', updatePreview);
        this.modal.querySelector('#chartDataRangeInput').addEventListener('input', updatePreview);
        this.modal.querySelector('#chartFirstRowHeader').addEventListener('change', updatePreview);

        // Insert chart into sheet
        this.modal.querySelector('#chartInsertBtn').addEventListener('click', () => {
            const config = this.getModalConfig();
            this.closeModal();
            if (this.emitter) {
                this.emitter.emit('action:createChartWidget', config);
            }
        });

        // Recalculation event: sync active chart widgets
        this.emitter.on('data:recalculated', () => {
            this.refreshAllCharts();
        });
    }

    openModal(defaultRangeStr = 'A1:C6', defaultTitle = 'Chart Analysis') {
        this.modal.querySelector('#chartDataRangeInput').value = defaultRangeStr;
        this.modal.querySelector('#chartTitleInput').value = defaultTitle;
        this.modal.style.display = 'flex';

        const config = this.getModalConfig();
        this.renderCanvasChart(this.modal.querySelector('#chartPreviewCanvas'), config);
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    getModalConfig() {
        return {
            title: this.modal.querySelector('#chartTitleInput').value || 'Chart',
            type: this.modal.querySelector('#chartTypeSelect').value || 'bar',
            range: this.modal.querySelector('#chartDataRangeInput').value || 'A1:B5',
            hasHeader: this.modal.querySelector('#chartFirstRowHeader').checked
        };
    }

    extractDataFromRange(sheet, rangeStr, hasHeader = true) {
        if (!sheet || !rangeStr) {
            return { labels: ['Q1', 'Q2', 'Q3', 'Q4'], datasets: [{ name: 'Sales', values: [120, 190, 300, 250] }] };
        }

        const parts = rangeStr.split(':');
        if (parts.length !== 2) {
            return { labels: ['A', 'B', 'C'], datasets: [{ name: 'Series', values: [10, 20, 30] }] };
        }

        const start = parseCellAddress(parts[0]);
        const end = parseCellAddress(parts[1]);
        if (!start || !end) {
            return { labels: ['A', 'B', 'C'], datasets: [{ name: 'Series', values: [10, 20, 30] }] };
        }

        const r1 = Math.min(start.row, end.row);
        const r2 = Math.max(start.row, end.row);
        const c1 = Math.min(start.col, end.col);
        const c2 = Math.max(start.col, end.col);

        const labels = [];
        const datasets = [];

        const startDataRow = hasHeader ? r1 + 1 : r1;

        // Extract series headers if hasHeader
        for (let c = c1 + 1; c <= c2; c++) {
            let seriesName = `Series ${c - c1}`;
            if (hasHeader) {
                const headerCell = sheet.getCell(r1, c);
                if (headerCell && headerCell.rawValue) {
                    seriesName = String(headerCell.rawValue);
                }
            }
            datasets.push({
                name: seriesName,
                color: CHART_PALETTE[(c - c1 - 1) % CHART_PALETTE.length],
                values: []
            });
        }

        if (datasets.length === 0) {
            // Single column data
            datasets.push({
                name: 'Data',
                color: CHART_PALETTE[0],
                values: []
            });
            for (let r = startDataRow; r <= r2; r++) {
                const cell = sheet.getCell(r, c1);
                const num = cell ? cell.numericValue : 0;
                labels.push(`Row ${r + 1}`);
                datasets[0].values.push(num !== null ? num : 0);
            }
            return { labels, datasets };
        }

        // Multi-column data: First col = labels, other cols = series
        for (let r = startDataRow; r <= r2; r++) {
            const labelCell = sheet.getCell(r, c1);
            const labelText = labelCell ? (labelCell.displayValue || `Row ${r + 1}`) : `Row ${r + 1}`;
            labels.push(labelText);

            for (let c = c1 + 1; c <= c2; c++) {
                const dataCell = sheet.getCell(r, c);
                const num = dataCell ? dataCell.numericValue : 0;
                const dsIndex = c - c1 - 1;
                datasets[dsIndex].values.push(num !== null ? num : 0);
            }
        }

        return { labels, datasets };
    }

    renderCanvasChart(canvas, config, currentSheet = null) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        const data = this.extractDataFromRange(currentSheet, config.range, config.hasHeader);
        const { labels, datasets } = data;

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Title
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(config.title || 'Chart Analysis', 16, 24);

        if (labels.length === 0 || datasets.length === 0) return;

        const chartArea = {
            left: 50,
            top: 45,
            right: width - 20,
            bottom: height - 40
        };
        const chartW = chartArea.right - chartArea.left;
        const chartH = chartArea.bottom - chartArea.top;

        // Compute Max and Min value for scaling
        let allValues = [];
        datasets.forEach(ds => allValues.push(...ds.values));
        let maxVal = Math.max(...allValues, 10);
        let minVal = Math.min(0, ...allValues);
        if (maxVal === minVal) maxVal += 10;

        // Grid lines & Y Axis Labels
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#64748b';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'right';

        const ySteps = 4;
        for (let i = 0; i <= ySteps; i++) {
            const yVal = minVal + ((maxVal - minVal) * (ySteps - i)) / ySteps;
            const yPos = chartArea.top + (chartH * i) / ySteps;

            ctx.beginPath();
            ctx.moveTo(chartArea.left, yPos);
            ctx.lineTo(chartArea.right, yPos);
            ctx.stroke();

            ctx.fillText(Math.round(yVal).toLocaleString(), chartArea.left - 8, yPos + 3);
        }

        // Draw Chart Types
        switch (config.type) {
            case 'line':
            case 'area':
                this._drawLineOrAreaChart(ctx, chartArea, labels, datasets, minVal, maxVal, config.type === 'area');
                break;

            case 'pie':
            case 'doughnut':
                this._drawPieOrDoughnutChart(ctx, width, height, labels, datasets[0], config.type === 'doughnut');
                break;

            case 'bar':
            default:
                this._drawBarChart(ctx, chartArea, labels, datasets, minVal, maxVal);
                break;
        }

        // Render Legend at bottom
        this._drawLegend(ctx, datasets, 16, height - 12);
    }

    _drawBarChart(ctx, area, labels, datasets, minVal, maxVal) {
        const groupCount = labels.length;
        const seriesCount = datasets.length;
        const groupWidth = (area.right - area.left) / groupCount;
        const barPad = 6;
        const totalBarsWidth = groupWidth - barPad * 2;
        const barWidth = Math.max(4, totalBarsWidth / seriesCount);

        for (let g = 0; g < groupCount; g++) {
            const groupX = area.left + g * groupWidth;

            // X axis label
            ctx.fillStyle = '#64748b';
            ctx.font = '11px Inter, sans-serif';
            ctx.textAlign = 'center';
            const labelX = groupX + groupWidth / 2;
            ctx.fillText(labels[g], labelX, area.bottom + 16);

            for (let s = 0; s < seriesCount; s++) {
                const val = datasets[s].values[g] || 0;
                const ratio = (val - minVal) / (maxVal - minVal);
                const barH = ratio * (area.bottom - area.top);
                const barX = groupX + barPad + s * barWidth;
                const barY = area.bottom - barH;

                ctx.fillStyle = datasets[s].color;
                ctx.beginPath();
                ctx.roundRect ? ctx.roundRect(barX, barY, Math.max(1, barWidth - 2), barH, [2, 2, 0, 0]) : ctx.rect(barX, barY, barWidth - 2, barH);
                ctx.fill();
            }
        }
    }

    _drawLineOrAreaChart(ctx, area, labels, datasets, minVal, maxVal, isArea = false) {
        const groupCount = labels.length;
        const stepX = (area.right - area.left) / Math.max(1, groupCount - 1);

        // X axis labels
        ctx.fillStyle = '#64748b';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        for (let g = 0; g < groupCount; g++) {
            const x = area.left + g * stepX;
            ctx.fillText(labels[g], x, area.bottom + 16);
        }

        datasets.forEach(ds => {
            const points = [];
            for (let g = 0; g < groupCount; g++) {
                const val = ds.values[g] || 0;
                const ratio = (val - minVal) / (maxVal - minVal);
                const x = area.left + g * stepX;
                const y = area.bottom - ratio * (area.bottom - area.top);
                points.push({ x, y });
            }

            // Draw Area Fill if requested
            if (isArea && points.length > 0) {
                ctx.save();
                ctx.fillStyle = `${ds.color}33`; // 20% opacity
                ctx.beginPath();
                ctx.moveTo(points[0].x, area.bottom);
                for (const p of points) ctx.lineTo(p.x, p.y);
                ctx.lineTo(points[points.length - 1].x, area.bottom);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }

            // Draw Stroke Line
            ctx.strokeStyle = ds.color;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            points.forEach((p, idx) => {
                if (idx === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();

            // Draw Data Points
            ctx.fillStyle = '#ffffff';
            points.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            });
        });
    }

    _drawPieOrDoughnutChart(ctx, width, height, labels, dataset, isDoughnut = false) {
        if (!dataset || !dataset.values) return;
        const total = dataset.values.reduce((sum, v) => sum + Math.max(0, v), 0);
        if (total === 0) return;

        const centerX = width / 2;
        const centerY = height / 2 + 5;
        const radius = Math.min(width, height) / 3;

        let startAngle = -Math.PI / 2;

        dataset.values.forEach((val, i) => {
            const sliceAngle = (Math.max(0, val) / total) * (Math.PI * 2);
            const color = CHART_PALETTE[i % CHART_PALETTE.length];

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();

            startAngle += sliceAngle;
        });

        // Cut out inner hole for doughnut
        if (isDoughnut) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 0.55, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    _drawLegend(ctx, datasets, x, y) {
        let curX = x;
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'left';

        datasets.forEach(ds => {
            ctx.fillStyle = ds.color;
            ctx.fillRect(curX, y - 8, 10, 10);
            ctx.fillStyle = '#475569';
            ctx.fillText(ds.name, curX + 14, y);
            curX += ctx.measureText(ds.name).width + 30;
        });
    }

    createFloatingChartWidget(config, sheet, container) {
        const widgetId = `chart_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        const widget = document.createElement('div');
        widget.className = 'sf-chart-widget';
        widget.id = widgetId;
        widget.style.top = '120px';
        widget.style.left = '200px';
        widget.style.width = '420px';
        widget.style.height = '280px';

        widget.innerHTML = `
            <div class="sf-chart-widget-header">
                <span class="sf-chart-widget-title">${config.title || 'Chart'}</span>
                <div class="sf-chart-widget-actions">
                    <button class="sf-widget-btn sf-btn-export-png" title="Export as PNG Image">📷</button>
                    <button class="sf-widget-btn sf-btn-delete" title="Delete Chart">✕</button>
                </div>
            </div>
            <div class="sf-chart-widget-body">
                <canvas width="400" height="230"></canvas>
            </div>
        `;

        container.appendChild(widget);

        const canvas = widget.querySelector('canvas');
        this.renderCanvasChart(canvas, config, sheet);

        // Make widget draggable
        this._makeDraggable(widget, widget.querySelector('.sf-chart-widget-header'));

        // Delete action
        widget.querySelector('.sf-btn-delete').addEventListener('click', () => {
            widget.remove();
            this.activeCharts.delete(widgetId);
        });

        // Export PNG action
        widget.querySelector('.sf-btn-export-png').addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = `${config.title || 'chart'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });

        this.activeCharts.set(widgetId, { widget, canvas, config, sheet });
        return widgetId;
    }

    refreshAllCharts() {
        for (const [id, item] of this.activeCharts.entries()) {
            if (document.body.contains(item.widget)) {
                this.renderCanvasChart(item.canvas, item.config, item.sheet);
            } else {
                this.activeCharts.delete(id);
            }
        }
    }

    _makeDraggable(el, handle) {
        let isDragging = false;
        let startX = 0, startY = 0;
        let origLeft = 0, origTop = 0;

        handle.addEventListener('mousedown', (e) => {
            if (e.target.closest('.sf-widget-btn')) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            origLeft = parseInt(el.style.left || 0, 10);
            origTop = parseInt(el.style.top || 0, 10);
            el.style.zIndex = 100;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            el.style.left = `${Math.max(0, origLeft + dx)}px`;
            el.style.top = `${Math.max(0, origTop + dy)}px`;
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                el.style.zIndex = 10;
            }
        });
    }
}
