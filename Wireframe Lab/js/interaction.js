/* ==========================================================================
   WIREFRAMELAB - CANVAS POINTER INTERACTIONS & SMART SNAPPING
   ========================================================================== */

import { state } from './state.js';
import { createObjectFromType, generateId, ARTBOARD_PRESETS } from './models.js';

export class InteractionController {
  constructor(viewportEl, worldEl, canvasCtrl, guidesContainerEl) {
    this.viewportEl = viewportEl;
    this.worldEl = worldEl;
    this.canvasCtrl = canvasCtrl;
    this.guidesContainerEl = guidesContainerEl;

    // Interaction State
    this.mode = 'idle'; // 'idle' | 'drag' | 'resize' | 'rotate' | 'marquee' | 'draw' | 'wire'
    this.startPos = { x: 0, y: 0 };
    this.dragStartObjects = new Map(); // id -> { x, y, width, height, rotation, artboardId }
    this.activeHandle = null;
    this.drawType = null;
    this.marqueeEl = null;
    this.wireSourceId = null;

    this.initEvents();
  }

  initEvents() {
    this.viewportEl.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.viewportEl.addEventListener('dblclick', (e) => this.onDblClick(e));
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mouseup', (e) => this.onMouseUp(e));

    // Drag and drop from component sidebar
    this.viewportEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });

    this.viewportEl.addEventListener('drop', (e) => this.onDropFromSidebar(e));
  }

  onDblClick(e) {
    // 1. Double click artboard label
    const labelBadge = e.target.closest('.artboard-label-badge');
    if (labelBadge) {
      const abId = labelBadge.dataset.artboardId;
      const ab = state.getActivePage().artboards.find(a => a.id === abId);
      if (!ab) return;

      const nameSpan = labelBadge.querySelector('.artboard-label-name');
      if (!nameSpan) return;

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'layer-name-input';
      input.value = ab.name;
      nameSpan.replaceWith(input);
      input.focus();
      input.select();

      const finishRename = () => {
        const newName = input.value.trim() || ab.name;
        state.updateArtboard(abId, { name: newName });
      };

      input.addEventListener('blur', finishRename);
      input.addEventListener('keydown', (ke) => {
        if (ke.key === 'Enter') finishRename();
        if (ke.key === 'Escape') state.emit('project:changed', state.project);
      });
      return;
    }

    // 2. Double click canvas object
    const objEl = e.target.closest('.wf-object');
    if (objEl) {
      const objId = objEl.dataset.objectId;
      const obj = state.getActivePage().objects.find(o => o.id === objId);
      if (!obj) return;

      if (['text', 'paragraph', 'button', 'chip', 'alert'].includes(obj.type)) {
        const isButton = obj.type === 'button';
        const isChip = obj.type === 'chip';
        const isAlert = obj.type === 'alert';
        const currentText = isButton || isChip ? (obj.props.label || '') : (isAlert ? (obj.props.title || '') : (obj.props.text || ''));

        const input = document.createElement(obj.type === 'paragraph' ? 'textarea' : 'input');
        if (obj.type !== 'paragraph') input.type = 'text';
        input.value = currentText;
        input.style.position = 'absolute';
        input.style.left = '0';
        input.style.top = '0';
        input.style.width = '100%';
        input.style.height = '100%';
        input.style.fontSize = `${obj.styles?.fontSize || 14}px`;
        input.style.fontFamily = 'inherit';
        input.style.fontWeight = `${obj.styles?.fontWeight || 400}`;
        input.style.color = '#1f2937';
        input.style.background = '#ffffff';
        input.style.border = '1.5px solid #0d99ff';
        input.style.borderRadius = '4px';
        input.style.zIndex = '9999';
        input.style.padding = '4px 6px';
        input.style.boxSizing = 'border-box';
        input.style.outline = 'none';

        objEl.appendChild(input);
        input.focus();
        input.select();

        const commitText = () => {
          const val = input.value;
          input.remove();
          if (isButton || isChip) {
            state.updateObject(objId, { props: { label: val } });
          } else if (isAlert) {
            state.updateObject(objId, { props: { title: val } });
          } else {
            state.updateObject(objId, { props: { text: val } });
          }
        };

        input.addEventListener('blur', commitText);
        input.addEventListener('keydown', (ke) => {
          if (ke.key === 'Enter' && obj.type !== 'paragraph') commitText();
          if (ke.key === 'Escape') input.remove();
        });
      }
    }
  }

  onMouseDown(e) {
    if (e.button !== 0) return; // only left click
    if (this.canvasCtrl.spacePressed || state.activeTool === 'hand') return;

    const canvasPoint = this.canvasCtrl.screenToCanvas(e.clientX, e.clientY);
    this.startPos = { ...canvasPoint, clientX: e.clientX, clientY: e.clientY };

    // Check if clicked a prototype connector pin
    const pinEl = e.target.closest('.prototype-connector-pin');
    if (pinEl && state.mode === 'prototype') {
      e.stopPropagation();
      this.mode = 'wire';
      this.wireSourceId = pinEl.dataset.sourceObjectId;
      return;
    }

    // Check if clicked a transform or rotation handle
    const handleEl = e.target.closest('.transform-handle, .handle-rot');
    if (handleEl) {
      e.stopPropagation();
      this.activeHandle = handleEl.dataset.handle;
      if (this.activeHandle === 'rot') {
        this.mode = 'rotate';
      } else {
        this.mode = 'resize';
      }
      this.snapshotSelectedObjects();
      return;
    }

    // Check if drawing new element via tool
    if (state.activeTool !== 'select') {
      this.startDrawing(canvasPoint);
      return;
    }

    // Check if clicked an object
    const objectEl = e.target.closest('.wf-object');
    if (objectEl) {
      const objId = objectEl.dataset.objectId;
      if (e.shiftKey) {
        state.toggleSelection(objId);
      } else if (!state.selection.has(objId)) {
        state.setSelection([objId]);
      }
      this.mode = 'drag';
      this.snapshotSelectedObjects();
      return;
    }

    // Check if clicked an artboard or its label
    const artboardEl = e.target.closest('.artboard-node, .artboard-label-badge');
    if (artboardEl) {
      const abId = artboardEl.dataset.artboardId;
      if (e.shiftKey) {
        state.toggleSelection(abId);
      } else {
        state.setSelection([abId]);
      }
      this.mode = 'drag';
      this.snapshotSelectedObjects();
      return;
    }

    // Clicked empty canvas space
    if (!e.shiftKey) {
      state.clearSelection();
    }
    this.mode = 'marquee';
    this.createMarqueeElement(canvasPoint);
  }

  onMouseMove(e) {
    if (this.mode === 'idle') return;

    const currentPoint = this.canvasCtrl.screenToCanvas(e.clientX, e.clientY);
    const dx = currentPoint.x - this.startPos.x;
    const dy = currentPoint.y - this.startPos.y;

    if (this.mode === 'drag') {
      this.doDrag(dx, dy, e);
    } else if (this.mode === 'resize') {
      this.doResize(dx, dy, e);
    } else if (this.mode === 'rotate') {
      this.doRotate(currentPoint, e);
    } else if (this.mode === 'marquee') {
      this.updateMarquee(currentPoint);
    } else if (this.mode === 'draw') {
      this.updateDrawing(currentPoint);
    }
  }

  onMouseUp(e) {
    if (this.mode === 'idle') return;

    if (this.mode === 'drag') {
      this.finishDrag();
    } else if (this.mode === 'resize') {
      this.finishResize();
    } else if (this.mode === 'rotate') {
      this.finishRotate();
    } else if (this.mode === 'marquee') {
      this.finishMarquee();
    } else if (this.mode === 'draw') {
      this.finishDrawing();
    } else if (this.mode === 'wire') {
      this.finishWire(e);
    }

    this.mode = 'idle';
    this.clearGuides();
  }

  snapshotSelectedObjects() {
    this.dragStartObjects.clear();
    const page = state.getActivePage();

    state.getSelectedObjects().forEach(obj => {
      this.dragStartObjects.set(obj.id, {
        x: obj.x,
        y: obj.y,
        width: obj.width,
        height: obj.height,
        rotation: obj.rotation || 0,
        artboardId: obj.artboardId
      });
    });

    state.getSelectedArtboards().forEach(ab => {
      this.dragStartObjects.set(ab.id, {
        x: ab.x,
        y: ab.y,
        width: ab.width,
        height: ab.height,
        isArtboard: true
      });
    });
  }

  // --- Dragging with Smart Snapping ---
  doDrag(dx, dy, e) {
    this.clearGuides();
    const page = state.getActivePage();
    const updates = {};

    let effectiveDx = dx;
    let effectiveDy = dy;

    // Snapping calculation if enabled and dragging single item
    if (state.snapping.enabled && this.dragStartObjects.size === 1) {
      const [id, start] = Array.from(this.dragStartObjects.entries())[0];
      const testX = start.x + dx;
      const testY = start.y + dy;
      const snapResult = this.computeSnapping(id, testX, testY, start.width, start.height, start.artboardId);

      effectiveDx = snapResult.x - start.x;
      effectiveDy = snapResult.y - start.y;
    }

    for (const [id, start] of this.dragStartObjects.entries()) {
      if (start.isArtboard) {
        state.updateArtboard(id, {
          x: Math.round(start.x + effectiveDx),
          y: Math.round(start.y + effectiveDy)
        }, false);
      } else {
        updates[id] = {
          x: Math.round(start.x + effectiveDx),
          y: Math.round(start.y + effectiveDy)
        };
      }
    }

    if (Object.keys(updates).length > 0) {
      state.updateMultipleObjects(updates, false);
    }
  }

  finishDrag() {
    const page = state.getActivePage();
    const artboards = page.artboards || [];

    // Check if objects need to be reparented to an artboard
    for (const [id, start] of this.dragStartObjects.entries()) {
      if (start.isArtboard) continue;
      const obj = page.objects.find(o => o.id === id);
      if (!obj) continue;

      // Absolute position in canvas space
      let absX = obj.x;
      let absY = obj.y;
      if (start.artboardId) {
        const oldAb = artboards.find(a => a.id === start.artboardId);
        if (oldAb) {
          absX += oldAb.x;
          absY += oldAb.y;
        }
      }

      // Check which artboard contains the object center
      const centerX = absX + obj.width / 2;
      const centerY = absY + obj.height / 2;
      const targetAb = artboards.find(ab => 
        centerX >= ab.x && centerX <= ab.x + ab.width &&
        centerY >= ab.y && centerY <= ab.y + ab.height
      );

      if (targetAb) {
        // Parent to target artboard
        const relX = absX - targetAb.x;
        const relY = absY - targetAb.y;
        state.updateObject(id, {
          artboardId: targetAb.id,
          x: relX,
          y: relY
        }, true);
      } else {
        // Free-floating on canvas world
        state.updateObject(id, {
          artboardId: null,
          x: absX,
          y: absY
        }, true);
      }
    }
  }

  // --- Smart Snapping Engine ---
  computeSnapping(objectId, x, y, width, height, artboardId) {
    const threshold = 6;
    let snappedX = x;
    let snappedY = y;

    const page = state.getActivePage();
    const siblings = page.objects.filter(o => o.id !== objectId && o.artboardId === artboardId);

    const xTargets = [
      { val: x, type: 'left' },
      { val: x + width / 2, type: 'centerX' },
      { val: x + width, type: 'right' }
    ];

    const yTargets = [
      { val: y, type: 'top' },
      { val: y + height / 2, type: 'centerY' },
      { val: y + height, type: 'bottom' }
    ];

    // Check sibling edges & centers
    for (const sib of siblings) {
      const sibX = [sib.x, sib.x + sib.width / 2, sib.x + sib.width];
      const sibY = [sib.y, sib.y + sib.height / 2, sib.y + sib.height];

      for (const t of xTargets) {
        for (const s of sibX) {
          if (Math.abs(t.val - s) <= threshold) {
            snappedX = t.type === 'left' ? s : t.type === 'centerX' ? s - width / 2 : s - width;
            this.showGuideLine('v', s, artboardId);
            break;
          }
        }
      }

      for (const t of yTargets) {
        for (const s of sibY) {
          if (Math.abs(t.val - s) <= threshold) {
            snappedY = t.type === 'top' ? s : t.type === 'centerY' ? s - height / 2 : s - height;
            this.showGuideLine('h', s, artboardId);
            break;
          }
        }
      }
    }

    return { x: snappedX, y: snappedY };
  }

  showGuideLine(orientation, pos, artboardId) {
    if (!this.guidesContainerEl) return;

    let absPos = pos;
    if (artboardId) {
      const ab = state.getActivePage().artboards.find(a => a.id === artboardId);
      if (ab) {
        absPos += (orientation === 'v' ? ab.x : ab.y);
      }
    }

    const line = document.createElement('div');
    line.className = `guide-line-${orientation}`;
    if (orientation === 'v') {
      line.style.left = `${absPos}px`;
    } else {
      line.style.top = `${absPos}px`;
    }
    this.guidesContainerEl.appendChild(line);
  }

  clearGuides() {
    if (this.guidesContainerEl) {
      this.guidesContainerEl.innerHTML = '';
    }
  }

  // --- Resizing ---
  doResize(dx, dy, e) {
    const handle = this.activeHandle;
    const lockAspect = e.shiftKey;

    for (const [id, start] of this.dragStartObjects.entries()) {
      let newW = start.width;
      let newH = start.height;
      let newX = start.x;
      let newY = start.y;

      if (handle.includes('e')) newW = Math.max(10, start.width + dx);
      if (handle.includes('s')) newH = Math.max(10, start.height + dy);
      if (handle.includes('w')) {
        newW = Math.max(10, start.width - dx);
        newX = start.x + (start.width - newW);
      }
      if (handle.includes('n')) {
        newH = Math.max(10, start.height - dy);
        newY = start.y + (start.height - newH);
      }

      if (lockAspect) {
        const ratio = start.width / start.height;
        if (newW / newH > ratio) {
          newW = newH * ratio;
        } else {
          newH = newW / ratio;
        }
      }

      if (start.isArtboard) {
        state.updateArtboard(id, {
          x: Math.round(newX),
          y: Math.round(newY),
          width: Math.round(newW),
          height: Math.round(newH)
        }, false);
      } else {
        state.updateObject(id, {
          x: Math.round(newX),
          y: Math.round(newY),
          width: Math.round(newW),
          height: Math.round(newH)
        }, false);
      }
    }
  }

  finishResize() {
    state.pushHistory('Resize');
  }

  // --- Rotation ---
  doRotate(currentPoint, e) {
    if (this.dragStartObjects.size !== 1) return;
    const [id, start] = Array.from(this.dragStartObjects.entries())[0];

    const cx = start.x + start.width / 2;
    const cy = start.y + start.height / 2;

    const angleRad = Math.atan2(currentPoint.y - cy, currentPoint.x - cx);
    let angleDeg = Math.round((angleRad * 180 / Math.PI) + 90);

    if (e.shiftKey) {
      angleDeg = Math.round(angleDeg / 15) * 15;
    }

    state.updateObject(id, { rotation: angleDeg }, false);
  }

  finishRotate() {
    state.pushHistory('Rotate');
  }

  // --- Marquee Rubber-Band Selection ---
  createMarqueeElement(pt) {
    this.marqueeEl = document.createElement('div');
    this.marqueeEl.className = 'canvas-marquee';
    this.marqueeEl.style.left = `${pt.x}px`;
    this.marqueeEl.style.top = `${pt.y}px`;
    this.marqueeEl.style.width = '0px';
    this.marqueeEl.style.height = '0px';
    this.worldEl.appendChild(this.marqueeEl);
  }

  updateMarquee(currentPt) {
    if (!this.marqueeEl) return;
    const x = Math.min(this.startPos.x, currentPt.x);
    const y = Math.min(this.startPos.y, currentPt.y);
    const w = Math.abs(currentPt.x - this.startPos.x);
    const h = Math.abs(currentPt.y - this.startPos.y);

    this.marqueeEl.style.left = `${x}px`;
    this.marqueeEl.style.top = `${y}px`;
    this.marqueeEl.style.width = `${w}px`;
    this.marqueeEl.style.height = `${h}px`;
  }

  finishMarquee() {
    if (!this.marqueeEl) return;
    const rect = {
      x: parseFloat(this.marqueeEl.style.left),
      y: parseFloat(this.marqueeEl.style.top),
      w: parseFloat(this.marqueeEl.style.width),
      h: parseFloat(this.marqueeEl.style.height)
    };
    this.marqueeEl.remove();
    this.marqueeEl = null;

    if (rect.w < 5 && rect.h < 5) return;

    // Find all objects within rect
    const page = state.getActivePage();
    const matchingIds = [];

    page.objects.forEach(obj => {
      let objX = obj.x;
      let objY = obj.y;
      if (obj.artboardId) {
        const ab = page.artboards.find(a => a.id === obj.artboardId);
        if (ab) { objX += ab.x; objY += ab.y; }
      }

      // Intersect test
      if (objX < rect.x + rect.w && objX + obj.width > rect.x &&
          objY < rect.y + rect.h && objY + obj.height > rect.y) {
        matchingIds.push(obj.id);
      }
    });

    state.setSelection(matchingIds);
  }

  // --- Draw Tool (Rectangle, Text, Artboard) ---
  startDrawing(pt) {
    this.mode = 'draw';
    this.drawType = state.activeTool;
  }

  updateDrawing(currentPt) {
    // Show live preview
    this.updateMarquee(currentPt);
  }

  finishDrawing() {
    const type = this.drawType;
    if (this.marqueeEl) {
      this.marqueeEl.remove();
      this.marqueeEl = null;
    }

    if (type === 'artboard') {
      const newAb = {
        id: generateId('ab'),
        name: 'New Artboard',
        x: Math.round(this.startPos.x),
        y: Math.round(this.startPos.y),
        width: 800,
        height: 600,
        background: '#ffffff',
        locked: false,
        hidden: false
      };
      state.addArtboard(newAb);
    } else {
      const newObj = createObjectFromType(type);
      newObj.x = Math.round(this.startPos.x);
      newObj.y = Math.round(this.startPos.y);

      // Check if dropped inside an artboard
      const page = state.getActivePage();
      const ab = page.artboards.find(a => 
        newObj.x >= a.x && newObj.x <= a.x + a.width &&
        newObj.y >= a.y && newObj.y <= a.y + a.height
      );

      if (ab) {
        newObj.x -= ab.x;
        newObj.y -= ab.y;
        state.addObject(newObj, ab.id);
      } else {
        state.addObject(newObj, null);
      }
    }

    state.setActiveTool('select');
  }

  // --- Drag and Drop from Asset Sidebar ---
  onDropFromSidebar(e) {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain');
    if (!type) return;

    const pt = this.canvasCtrl.screenToCanvas(e.clientX, e.clientY);
    const newObj = createObjectFromType(type);
    newObj.x = Math.round(pt.x - newObj.width / 2);
    newObj.y = Math.round(pt.y - newObj.height / 2);

    const page = state.getActivePage();
    const ab = page.artboards.find(a => 
      newObj.x >= a.x && newObj.x <= a.x + a.width &&
      newObj.y >= a.y && newObj.y <= a.y + a.height
    );

    if (ab) {
      newObj.x -= ab.x;
      newObj.y -= ab.y;
      state.addObject(newObj, ab.id);
    } else {
      state.addObject(newObj, null);
    }
  }

  // --- Finish Prototype Connection Wire ---
  finishWire(e) {
    const targetAbEl = e.target.closest('.artboard-node, .artboard-label-badge');
    if (targetAbEl && this.wireSourceId) {
      const targetAbId = targetAbEl.dataset.artboardId;
      state.updateObject(this.wireSourceId, {
        prototype: { targetArtboardId: targetAbId, trigger: 'click', animation: 'slide-left' }
      });
    }
    this.wireSourceId = null;
  }
}
