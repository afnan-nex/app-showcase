/* ==========================================================================
   WIREFRAMELAB - INTERACTIVE PROTOTYPE ENGINE & FULLSCREEN PLAYER
   ========================================================================== */

import { state } from './state.js';

export class PrototypeController {
  constructor(playerOverlayEl, screenCanvasEl, playerTitleEl, playerDeviceSelectEl) {
    this.playerOverlayEl = playerOverlayEl;
    this.screenCanvasEl = screenCanvasEl;
    this.playerTitleEl = playerTitleEl;
    this.playerDeviceSelectEl = playerDeviceSelectEl;

    this.activeArtboardId = null;
    this.startArtboardId = null;
    this.history = []; // Navigation history stack inside player
    this.showHints = true;
    this.currentDevice = 'macbook';

    this.initPlayerEvents();
  }

  initPlayerEvents() {
    if (!this.playerOverlayEl) return;

    // Close Player
    const closeBtn = this.playerOverlayEl.querySelector('#btn-player-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closePlayer());
    }

    // Restart Prototype
    const restartBtn = this.playerOverlayEl.querySelector('#btn-player-restart');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        if (this.startArtboardId) {
          this.navigateToArtboard(this.startArtboardId, 'fade');
          this.history = [this.startArtboardId];
        }
      });
    }

    // Back Button
    const backBtn = this.playerOverlayEl.querySelector('#btn-player-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (this.history.length > 1) {
          this.history.pop(); // pop current
          const prevId = this.history[this.history.length - 1];
          this.navigateToArtboard(prevId, 'slide-right');
        }
      });
    }

    // Device Frame Selector
    if (this.playerDeviceSelectEl) {
      this.playerDeviceSelectEl.addEventListener('change', (e) => {
        this.setDeviceFrame(e.target.value);
      });
    }

    // Fullscreen Toggle
    const fsBtn = this.playerOverlayEl.querySelector('#btn-player-fullscreen');
    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          this.playerOverlayEl.requestFullscreen().catch(err => console.log(err));
        } else {
          document.exitFullscreen();
        }
      });
    }

    // Flash hotspot hints on clicking non-hotspot area
    this.screenCanvasEl.addEventListener('click', (e) => {
      const isHotspot = e.target.closest('[data-proto-target]');
      if (!isHotspot && this.showHints) {
        this.flashHotspotHints();
      }
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (this.playerOverlayEl.classList.contains('active')) {
        if (e.key === 'Escape') {
          this.closePlayer();
        } else if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
          if (this.history.length > 1) {
            this.history.pop();
            const prevId = this.history[this.history.length - 1];
            this.navigateToArtboard(prevId, 'slide-right');
          }
        } else if (e.key === 'r' || e.key === 'R') {
          if (this.startArtboardId) {
            this.navigateToArtboard(this.startArtboardId, 'fade');
            this.history = [this.startArtboardId];
          }
        }
      }
    });
  }

  openPlayer(startArtboardId = null) {
    const page = state.getActivePage();
    const artboards = page.artboards || [];
    if (artboards.length === 0) {
      alert('Create at least one artboard before presenting prototype.');
      return;
    }

    this.startArtboardId = startArtboardId || state.getSelectedArtboards()[0]?.id || artboards[0].id;
    this.activeArtboardId = this.startArtboardId;
    this.history = [this.startArtboardId];

    // Detect device type from artboard width
    const targetAb = artboards.find(a => a.id === this.startArtboardId);
    if (targetAb && targetAb.width <= 500) {
      this.currentDevice = 'iphone';
    } else {
      this.currentDevice = 'macbook';
    }
    if (this.playerDeviceSelectEl) {
      this.playerDeviceSelectEl.value = this.currentDevice;
    }

    this.playerOverlayEl.classList.add('active');
    this.setDeviceFrame(this.currentDevice);
    this.navigateToArtboard(this.startArtboardId, 'instant');
  }

  closePlayer() {
    this.playerOverlayEl.classList.remove('active');
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }

  setDeviceFrame(device) {
    this.currentDevice = device;
    const wrapper = this.playerOverlayEl.querySelector('#device-frame-container');
    if (!wrapper) return;

    wrapper.className = 'device-frame-wrapper';
    if (device === 'macbook') {
      wrapper.classList.add('device-frame-macbook');
    } else if (device === 'iphone') {
      wrapper.classList.add('device-frame-iphone');
    }
  }

  navigateToArtboard(artboardId, transition = 'instant') {
    const page = state.getActivePage();
    const ab = page.artboards.find(a => a.id === artboardId);
    if (!ab) return;

    this.activeArtboardId = artboardId;
    if (this.playerTitleEl) {
      this.playerTitleEl.textContent = ab.name;
    }

    // Set screen canvas dimensions
    this.screenCanvasEl.style.width = `${ab.width}px`;
    this.screenCanvasEl.style.height = `${ab.height}px`;
    this.screenCanvasEl.style.backgroundColor = ab.background || '#ffffff';

    // Build Screen HTML
    this.screenCanvasEl.innerHTML = '';
    const childObjs = page.objects.filter(o => o.artboardId === ab.id && !o.hidden);

    childObjs.forEach(obj => {
      const el = document.createElement('div');
      el.className = 'wf-object';
      el.style.left = `${obj.x}px`;
      el.style.top = `${obj.y}px`;
      el.style.width = `${obj.width}px`;
      el.style.height = `${obj.height}px`;
      if (obj.rotation) el.style.transform = `rotate(${obj.rotation}deg)`;

      // Apply styles
      const s = obj.styles || {};
      if (s.fill && s.fill !== 'transparent') el.style.backgroundColor = s.fill;
      if (s.stroke && s.strokeWidth > 0 && s.stroke !== 'transparent') {
        el.style.border = `${s.strokeWidth}px ${s.strokeStyle || 'solid'} ${s.stroke}`;
      }
      if (s.borderRadius !== undefined) el.style.borderRadius = `${s.borderRadius}px`;
      if (s.opacity !== undefined) el.style.opacity = s.opacity;

      // Copy inner content
      el.innerHTML = this.getComponentInnerHtml(obj);

      // Check if interactive prototype hotspot
      if (obj.prototype && obj.prototype.targetArtboardId) {
        el.dataset.protoTarget = obj.prototype.targetArtboardId;
        el.dataset.protoAnim = obj.prototype.animation || 'slide-left';
        el.style.cursor = 'pointer';

        if (obj.prototype.trigger === 'hover') {
          el.addEventListener('mouseenter', () => {
            this.handleHotspotTrigger(obj.prototype.targetArtboardId, obj.prototype.animation);
          });
        } else {
          el.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleHotspotTrigger(obj.prototype.targetArtboardId, obj.prototype.animation);
          });
        }
      }

      this.screenCanvasEl.appendChild(el);
    });

    // Apply animation class
    this.screenCanvasEl.className = 'player-screen-canvas';
    if (transition === 'fade') {
      this.screenCanvasEl.classList.add('screen-transition-fade-enter');
    } else if (transition === 'slide-left') {
      this.screenCanvasEl.classList.add('screen-transition-slide-left-enter');
    } else if (transition === 'slide-right') {
      this.screenCanvasEl.classList.add('screen-transition-slide-right-enter');
    }
  }

  handleHotspotTrigger(targetArtboardId, animation) {
    if (!targetArtboardId) return;
    this.history.push(targetArtboardId);
    this.navigateToArtboard(targetArtboardId, animation);
  }

  flashHotspotHints() {
    const hotspots = this.screenCanvasEl.querySelectorAll('[data-proto-target]');
    hotspots.forEach(el => {
      const hint = document.createElement('div');
      hint.className = 'hotspot-flash-hint';
      hint.style.left = el.style.left;
      hint.style.top = el.style.top;
      hint.style.width = el.style.width;
      hint.style.height = el.style.height;
      hint.style.borderRadius = el.style.borderRadius || '4px';

      this.screenCanvasEl.appendChild(hint);
      setTimeout(() => hint.remove(), 800);
    });
  }

  getComponentInnerHtml(obj) {
    // Clone HTML representation from renderer
    const tempDiv = document.createElement('div');
    const p = obj.props || {};
    const s = obj.styles || {};

    if (obj.type === 'button') {
      return `<div class="wf-node wf-button variant-${p.variant || 'primary'}" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${s.fill || '#1f2937'};color:${s.textColor || '#fff'};border-radius:${s.borderRadius || 6}px;">${escapeHTML(p.label || 'Button')}</div>`;
    }
    if (obj.type === 'text') {
      return `<div class="wf-node wf-text" style="font-size:${s.fontSize || 20}px;font-weight:${s.fontWeight || '600'};color:${s.textColor || '#1f2937'};">${escapeHTML(p.text || '')}</div>`;
    }
    if (obj.type === 'image') {
      return `<div class="wf-node wf-image" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e5e7eb;color:#6b7280;"><span style="font-size:11px;font-weight:600;">${escapeHTML(p.label || 'Image')}</span></div>`;
    }
    if (obj.type === 'card') {
      return `
        <div class="wf-node wf-card" style="width:100%;height:100%;background:#fff;border-radius:${s.borderRadius || 8}px;display:flex;flex-direction:column;">
          <div style="padding:10px 14px;font-weight:600;font-size:14px;border-bottom:1px solid #f3f4f6;">${escapeHTML(p.title || 'Card')}</div>
          <div style="padding:12px 14px;font-size:12px;color:#4b5563;flex:1;">${escapeHTML(p.body || '')}</div>
        </div>
      `;
    }
    return '';
  }
}

function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
