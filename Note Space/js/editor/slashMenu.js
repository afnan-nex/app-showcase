/**
 * NoteSpace - Slash Command Menu Controller
 * Handles '/' trigger detection, fuzzy search filtering, keyboard navigation, and block conversion.
 */

import { BLOCK_DEFINITIONS } from './blocks.js';
import { Icons, getIcon } from '../icons/icons.js';
import { createElement, setCaretPosition } from '../utils/dom.js';

export class SlashMenu {
  constructor(onSelect) {
    this.onSelect = onSelect;
    this.menuEl = null;
    this.isOpen = false;
    this.selectedIndex = 0;
    this.filteredBlocks = [];
    this.triggerBlockEl = null;
    this.query = '';

    this.initDOM();
  }

  initDOM() {
    this.menuEl = createElement('div', 'ns-slash-menu');
    this.menuEl.style.display = 'none';
    document.body.appendChild(this.menuEl);

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.menuEl.contains(e.target)) {
        this.close();
      }
    });
  }

  open(blockEl, rect) {
    this.triggerBlockEl = blockEl;
    this.isOpen = true;
    this.query = '';
    this.selectedIndex = 0;
    this.render();

    this.menuEl.style.display = 'block';

    // Position popover
    if (rect) {
      let top = rect.bottom + window.scrollY + 6;
      let left = rect.left + window.scrollX;

      // Bound checking
      const menuWidth = 320;
      const menuHeight = 360;
      if (left + menuWidth > window.innerWidth - 20) {
        left = window.innerWidth - menuWidth - 20;
      }
      if (top + menuHeight > window.innerHeight + window.scrollY - 20) {
        top = rect.top + window.scrollY - menuHeight - 6;
      }

      this.menuEl.style.top = `${Math.max(10, top)}px`;
      this.menuEl.style.left = `${Math.max(10, left)}px`;
    }
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.menuEl.style.display = 'none';
    this.triggerBlockEl = null;
    this.query = '';
  }

  setQuery(query) {
    this.query = query.toLowerCase().trim();
    this.selectedIndex = 0;
    this.render();
  }

  render() {
    // Filter blocks based on query
    this.filteredBlocks = BLOCK_DEFINITIONS.filter(b => {
      if (!this.query) return true;
      return (
        b.label.toLowerCase().includes(this.query) ||
        b.type.toLowerCase().includes(this.query) ||
        (b.shortcut && b.shortcut.toLowerCase().includes(this.query)) ||
        b.description.toLowerCase().includes(this.query)
      );
    });

    this.menuEl.innerHTML = '';

    const header = createElement('div', 'ns-slash-header', 'Basic Blocks');
    this.menuEl.appendChild(header);

    if (this.filteredBlocks.length === 0) {
      const empty = createElement('div', 'ns-slash-empty', 'No matching blocks found');
      this.menuEl.appendChild(empty);
      return;
    }

    const list = createElement('div', 'ns-slash-list');
    this.filteredBlocks.forEach((blockDef, index) => {
      const item = createElement('div', `ns-slash-item ${index === this.selectedIndex ? 'is-selected' : ''}`);
      item.innerHTML = `
        <div class="ns-slash-item-icon">${getIcon(blockDef.icon)}</div>
        <div class="ns-slash-item-info">
          <div class="ns-slash-item-label">${blockDef.label}</div>
          <div class="ns-slash-item-desc">${blockDef.description}</div>
        </div>
        ${blockDef.shortcut ? `<div class="ns-slash-item-shortcut">${blockDef.shortcut}</div>` : ''}
      `;

      item.addEventListener('mouseenter', () => {
        this.selectedIndex = index;
        this.updateSelection();
      });

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectCurrent();
      });

      list.appendChild(item);
    });

    this.menuEl.appendChild(list);
  }

  updateSelection() {
    const items = this.menuEl.querySelectorAll('.ns-slash-item');
    items.forEach((item, i) => {
      if (i === this.selectedIndex) {
        item.classList.add('is-selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('is-selected');
      }
    });
  }

  handleKeyDown(e) {
    if (!this.isOpen) return false;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.filteredBlocks.length > 0) {
        this.selectedIndex = (this.selectedIndex + 1) % this.filteredBlocks.length;
        this.updateSelection();
      }
      return true;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.filteredBlocks.length > 0) {
        this.selectedIndex = (this.selectedIndex - 1 + this.filteredBlocks.length) % this.filteredBlocks.length;
        this.updateSelection();
      }
      return true;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      this.selectCurrent();
      return true;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
      return true;
    }

    return false;
  }

  selectCurrent() {
    const selectedDef = this.filteredBlocks[this.selectedIndex];
    if (selectedDef && this.onSelect) {
      const targetEl = this.triggerBlockEl;
      this.close();
      this.onSelect(selectedDef, targetEl);
    }
  }
}
