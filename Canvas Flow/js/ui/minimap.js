/* ==========================================================================
   CANVASFLOW — Interactive Minimap
   Mini Overview & Viewport Drag Navigation
   ========================================================================== */

import { appState } from '../state/state.js';
import { eventBus } from '../state/event-bus.js';
import { getObjectBounds, unionBounds, clamp } from '../utils/math.js';

export class Minimap {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('minimap-container');
    this.canvas = document.getElementById('canvas-minimap');
    this.ctx = this.canvas.getContext('2d');
    this.viewportBox = document.getElementById('minimap-viewport-box');
    this.btnToggle = document.getElementById('btn-toggle-minimap');

    this.isDragging = false;
    this.bounds = { x: -1000, y: -1000, width: 2000, height: 2000 };
    this.scale = 1;

    this._setupListeners();
    this.render();
  }

  _setupListeners() {
    this.btnToggle.addEventListener('click', () => {
      this.container.classList.toggle('minimized');
    });

    eventBus.on('state:changed', () => this.render());
    eventBus.on('viewport:changed', () => this.render());

    // Minimap Click & Drag Panning
    this.canvas.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this._panToMinimapCoord(e);
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isDragging) {
        this._panToMinimapCoord(e);
      }
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });
  }

  _panToMinimapCoord(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clickX = clamp(e.clientX - rect.left, 0, rect.width);
    const clickY = clamp(e.clientY - rect.top, 0, rect.height);

    const worldX = this.bounds.x + clickX / this.scale;
    const worldY = this.bounds.y + clickY / this.scale;

    const { clientWidth, clientHeight } = this.app.canvasContainer;
    const zoom = appState.viewport.zoom;

    const newPanX = clientWidth / 2 - worldX * zoom;
    const newPanY = clientHeight / 2 - worldY * zoom;

    appState.setViewport(newPanX, newPanY, zoom);
  }

  render() {
    const { ctx, canvas } = this;
    const objects = appState.getObjects().filter(o => o.visible !== false);
    const isDark = appState.settings.theme === 'dark';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Compute enclosing bounding box of all objects + viewport
    const { clientWidth, clientHeight } = this.app.canvasContainer;
    const { panX, panY, zoom } = appState.viewport;

    const viewWorldX = -panX / zoom;
    const viewWorldY = -panY / zoom;
    const viewWorldW = clientWidth / zoom;
    const viewWorldH = clientHeight / zoom;

    const allBounds = objects.map(o => getObjectBounds(o));
    allBounds.push({ x: viewWorldX, y: viewWorldY, width: viewWorldW, height: viewWorldH });

    const totalBounds = unionBounds(allBounds);
    const padding = 100;
    this.bounds = {
      x: totalBounds.x - padding,
      y: totalBounds.y - padding,
      width: totalBounds.width + padding * 2,
      height: totalBounds.height + padding * 2
    };

    const scaleX = canvas.width / this.bounds.width;
    const scaleY = canvas.height / this.bounds.height;
    this.scale = Math.min(scaleX, scaleY);

    ctx.save();
    ctx.scale(this.scale, this.scale);
    ctx.translate(-this.bounds.x, -this.bounds.y);

    // Draw miniature objects
    for (const obj of objects) {
      const b = getObjectBounds(obj);
      ctx.fillStyle = obj.fill && obj.fill !== 'transparent' ? obj.fill : (obj.stroke || '#3b82f6');
      ctx.globalAlpha = 0.6;
      ctx.fillRect(b.x, b.y, b.width, b.height);
    }

    ctx.restore();

    // Position Viewport Rectangle
    const vpLeft = (viewWorldX - this.bounds.x) * this.scale;
    const vpTop = (viewWorldY - this.bounds.y) * this.scale;
    const vpWidth = viewWorldW * this.scale;
    const vpHeight = viewWorldH * this.scale;

    this.viewportBox.style.left = `${Math.max(0, vpLeft)}px`;
    this.viewportBox.style.top = `${Math.max(0, vpTop)}px`;
    this.viewportBox.style.width = `${Math.min(canvas.width, vpWidth)}px`;
    this.viewportBox.style.height = `${Math.min(canvas.height, vpHeight)}px`;
  }
}
