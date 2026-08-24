/**
 * NoteSpace - Inline Formatting Bubble Toolbar
 * Floating bubble toolbar for rich text operations (Bold, Italic, Strikethrough, Code, Link, Highlight).
 */

import { Icons } from '../icons/icons.js';
import { createElement, getSelectionRect } from '../utils/dom.js';

export class InlineToolbar {
  constructor() {
    this.el = null;
    this.isOpen = false;
    this.currentRange = null;

    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    this.el = createElement('div', 'ns-inline-toolbar');
    this.el.style.display = 'none';

    this.el.innerHTML = `
      <button class="ns-tool-btn" data-command="bold" title="Bold (Ctrl+B)">
        ${Icons.bold}
      </button>
      <button class="ns-tool-btn" data-command="italic" title="Italic (Ctrl+I)">
        ${Icons.italic}
      </button>
      <button class="ns-tool-btn" data-command="underline" title="Underline (Ctrl+U)">
        ${Icons.underline}
      </button>
      <button class="ns-tool-btn" data-command="strikeThrough" title="Strikethrough">
        ${Icons.strikethrough}
      </button>
      <button class="ns-tool-btn" data-command="code" title="Inline Code (Ctrl+E)">
        ${Icons.code}
      </button>
      <button class="ns-tool-btn" data-command="link" title="Link (Ctrl+K)">
        ${Icons.link}
      </button>
      <div class="ns-tool-divider"></div>
      <button class="ns-tool-btn ns-btn-highlight" data-command="highlight" title="Highlight">
        ${Icons.highlighter}
      </button>
      
      <div class="ns-link-popover" style="display:none;">
        <input type="text" class="ns-link-input" placeholder="Paste or type link URL..." />
        <button class="ns-btn-apply-link">Apply</button>
      </div>

      <div class="ns-color-popover" style="display:none;">
        <button class="ns-color-chip" data-color="#fef08a" style="background:#fef08a;" title="Yellow"></button>
        <button class="ns-color-chip" data-color="#bbf7d0" style="background:#bbf7d0;" title="Green"></button>
        <button class="ns-color-chip" data-color="#bfdbfe" style="background:#bfdbfe;" title="Blue"></button>
        <button class="ns-color-chip" data-color="#fecaca" style="background:#fecaca;" title="Red"></button>
        <button class="ns-color-chip" data-color="#e9d5ff" style="background:#e9d5ff;" title="Purple"></button>
        <button class="ns-color-chip" data-color="transparent" style="background:none;border:1px dashed currentColor;" title="Clear"></button>
      </div>
    `;

    document.body.appendChild(this.el);
  }

  bindEvents() {
    // Document selection change listener
    document.addEventListener('selectionchange', () => {
      // Small timeout to allow mouseup/keyup to settle
      setTimeout(() => this.checkSelection(), 50);
    });

    // Toolbar button clicks
    this.el.querySelectorAll('.ns-tool-btn').forEach(btn => {
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Prevent losing text selection
        const command = btn.dataset.command;
        this.executeCommand(command);
      });
    });

    // Link apply
    const linkInput = this.el.querySelector('.ns-link-input');
    const applyBtn = this.el.querySelector('.ns-btn-apply-link');

    const applyLink = () => {
      const url = linkInput.value.trim();
      if (url && this.currentRange) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(this.currentRange);
        document.execCommand('createLink', false, url);
      }
      this.hideLinkPopover();
      this.checkSelection();
    };

    applyBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      applyLink();
    });

    linkInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyLink();
      } else if (e.key === 'Escape') {
        this.hideLinkPopover();
      }
    });

    // Highlight color chips
    this.el.querySelectorAll('.ns-color-chip').forEach(chip => {
      chip.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const color = chip.dataset.color;
        if (this.currentRange) {
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(this.currentRange);
          if (color === 'transparent') {
            document.execCommand('removeFormat', false, null);
          } else {
            document.execCommand('hiliteColor', false, color);
          }
        }
        this.hideColorPopover();
        this.checkSelection();
      });
    });

    // Close on mousedown outside
    document.addEventListener('mousedown', (e) => {
      if (this.isOpen && !this.el.contains(e.target)) {
        this.hide();
      }
    });
  }

  checkSelection() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      if (this.isOpen && !this.isPopoverOpen()) {
        this.hide();
      }
      return;
    }

    // Check if selection is within an editor block
    let node = sel.anchorNode;
    let inEditor = false;
    while (node) {
      if (node.classList && (node.classList.contains('ns-block-editor') || node.classList.contains('ns-page-title'))) {
        inEditor = true;
        break;
      }
      node = node.parentNode;
    }

    if (!inEditor) {
      this.hide();
      return;
    }

    this.currentRange = sel.getRangeAt(0).cloneRange();
    const rect = getSelectionRect();
    if (rect) {
      this.show(rect);
    }
  }

  isPopoverOpen() {
    const linkPop = this.el.querySelector('.ns-link-popover');
    const colPop = this.el.querySelector('.ns-color-popover');
    return linkPop.style.display === 'flex' || colPop.style.display === 'flex';
  }

  show(rect) {
    this.isOpen = true;
    this.el.style.display = 'flex';

    // Position above selection
    let top = rect.top + window.scrollY - 46;
    let left = rect.left + window.scrollX + (rect.width / 2) - (this.el.offsetWidth / 2);

    if (top < 10) {
      top = rect.bottom + window.scrollY + 10;
    }
    if (left < 10) left = 10;
    if (left + this.el.offsetWidth > window.innerWidth - 10) {
      left = window.innerWidth - this.el.offsetWidth - 10;
    }

    this.el.style.top = `${top}px`;
    this.el.style.left = `${left}px`;

    this.updateActiveStates();
  }

  hide() {
    this.isOpen = false;
    this.el.style.display = 'none';
    this.hideLinkPopover();
    this.hideColorPopover();
  }

  hideLinkPopover() {
    const pop = this.el.querySelector('.ns-link-popover');
    pop.style.display = 'none';
  }

  hideColorPopover() {
    const pop = this.el.querySelector('.ns-color-popover');
    pop.style.display = 'none';
  }

  updateActiveStates() {
    const btns = this.el.querySelectorAll('.ns-tool-btn');
    btns.forEach(btn => {
      const cmd = btn.dataset.command;
      if (cmd && ['bold', 'italic', 'underline', 'strikeThrough'].includes(cmd)) {
        if (document.queryCommandState(cmd)) {
          btn.classList.add('is-active');
        } else {
          btn.classList.remove('is-active');
        }
      }
    });
  }

  executeCommand(command) {
    if (!this.currentRange) return;

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(this.currentRange);

    if (command === 'code') {
      const selectedText = sel.toString();
      if (selectedText) {
        document.execCommand('insertHTML', false, `<code>${selectedText}</code>`);
      }
      this.checkSelection();
    } else if (command === 'link') {
      const linkPop = this.el.querySelector('.ns-link-popover');
      this.hideColorPopover();
      linkPop.style.display = linkPop.style.display === 'none' ? 'flex' : 'none';
      if (linkPop.style.display === 'flex') {
        const inp = linkPop.querySelector('.ns-link-input');
        inp.value = '';
        setTimeout(() => inp.focus(), 50);
      }
    } else if (command === 'highlight') {
      const colPop = this.el.querySelector('.ns-color-popover');
      this.hideLinkPopover();
      colPop.style.display = colPop.style.display === 'none' ? 'flex' : 'none';
    } else {
      document.execCommand(command, false, null);
      this.updateActiveStates();
    }
  }
}
