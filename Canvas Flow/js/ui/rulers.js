/* ==========================================================================
   CANVASFLOW — Interactive Rulers
   Top & Left Coordinate Rulers with Live Cursor Tracking
   ========================================================================== */

import { appState } from '../state/state.js';
import { eventBus } from '../state/event-bus.js';

export class Rulers {
  constructor(app) {
    this.app = app;
    this.rulerTop = document.getElementById('ruler-top');
    this.rulerLeft = document.getElementById('ruler-left');
    this.ctxTop = this.rulerTop.getContext('2d');
    this.ctxLeft = this.rulerLeft.getContext('2d');

    this.cursorX = 0;
    this.cursorY = 0;

    this._setupListeners();
    this.resize();
  }

  _setupListeners() {
    eventBus.on('viewport:changed', () => this.render());
    eventBus.on('settings:changed', () => this.render());

    window.addEventListener('pointermove', (e) => {
      if (!appState.settings.rulersVisible) return;
      const rect = this.app.canvasContainer.getBoundingClientRect();
      this.cursorX = e.clientX - rect.left;
      this.cursorY = e.clientY - rect.top;
      this.render();
    });
  }

  resize() {
    const parent = this.app.canvasContainer;
    const dpr = window.devicePixelRatio || 1;

    this.rulerTop.width = (parent.clientWidth - 20) * dpr;
    this.rulerTop.height = 20 * dpr;
    this.ctxTop.setTransform(1, 0, 0, 1, 0, 0);
    this.ctxTop.scale(dpr, dpr);

    this.rulerLeft.width = 20 * dpr;
    this.rulerLeft.height = (parent.clientHeight - 20) * dpr;
    this.ctxLeft.setTransform(1, 0, 0, 1, 0, 0);
    this.ctxLeft.scale(dpr, dpr);

    this.render();
  }

  render() {
    if (!appState.settings.rulersVisible) return;

    const { panX, panY, zoom } = appState.viewport;
    const isDark = appState.settings.theme === 'dark';

    const bg = isDark ? '#16171b' : '#fafbfc';
    const textCol = isDark ? '#6b7280' : '#9ca3af';
    const tickCol = isDark ? '#323642' : '#d1d5db';
    const guideCol = isDark ? '#3b82f6' : '#2563eb';

    const w = this.rulerTop.width / (window.devicePixelRatio || 1);
    const h = this.rulerLeft.height / (window.devicePixelRatio || 1);

    // 1. Top Ruler
    this.ctxTop.fillStyle = bg;
    this.ctxTop.fillRect(0, 0, w, 20);

    let step = 100;
    while (step * zoom < 40) step *= 2;
    while (step * zoom > 150) step /= 2;

    const startX = (panX - 20) % (step * zoom);
    const startWorldX = Math.floor((-panX + 20) / (step * zoom)) * step;

    this.ctxTop.font = '9px monospace';
    this.ctxTop.fillStyle = textCol;
    this.ctxTop.strokeStyle = tickCol;
    this.ctxTop.lineWidth = 1;

    let index = 0;
    for (let x = startX; x < w; x += step * zoom) {
      const worldVal = startWorldX + index * step;
      this.ctxTop.beginPath();
      this.ctxTop.moveTo(Math.floor(x) + 0.5, 10);
      this.ctxTop.lineTo(Math.floor(x) + 0.5, 20);
      this.ctxTop.stroke();

      if (worldVal % (step * 2) === 0) {
        this.ctxTop.fillText(`${worldVal}`, x + 3, 9);
      }
      index++;
    }

    // Top Cursor Hairline
    if (this.cursorX >= 20 && this.cursorX <= w + 20) {
      this.ctxTop.strokeStyle = guideCol;
      this.ctxTop.beginPath();
      this.ctxTop.moveTo(this.cursorX - 20, 0);
      this.ctxTop.lineTo(this.cursorX - 20, 20);
      this.ctxTop.stroke();
    }

    // 2. Left Ruler
    this.ctxLeft.fillStyle = bg;
    this.ctxLeft.fillRect(0, 0, 20, h);

    const startY = (panY - 20) % (step * zoom);
    const startWorldY = Math.floor((-panY + 20) / (step * zoom)) * step;

    this.ctxLeft.font = '9px monospace';
    this.ctxLeft.fillStyle = textCol;
    this.ctxLeft.strokeStyle = tickCol;
    this.ctxLeft.lineWidth = 1;

    let yIndex = 0;
    for (let y = startY; y < h; y += step * zoom) {
      const worldVal = startWorldY + yIndex * step;
      this.ctxLeft.beginPath();
      this.ctxLeft.moveTo(10, Math.floor(y) + 0.5);
      this.ctxLeft.lineTo(20, Math.floor(y) + 0.5);
      this.ctxLeft.stroke();

      if (worldVal % (step * 2) === 0) {
        this.ctxLeft.save();
        this.ctxLeft.translate(9, y + 3);
        this.ctxLeft.rotate(Math.PI / 2);
        this.ctxLeft.fillText(`${worldVal}`, 0, 0);
        this.ctxLeft.restore();
      }
      yIndex++;
    }

    // Left Cursor Hairline
    if (this.cursorY >= 20 && this.cursorY <= h + 20) {
      this.ctxLeft.strokeStyle = guideCol;
      this.ctxLeft.beginPath();
      this.ctxLeft.moveTo(0, this.cursorY - 20);
      this.ctxLeft.lineTo(20, this.cursorY - 20);
      this.ctxLeft.stroke();
    }
  }
}
