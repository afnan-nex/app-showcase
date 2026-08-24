/**
 * SheetForge - Note / Comment Hover Tooltip Engine
 * Displays floating note cards on cell hover
 */
export class NoteTooltip {
    constructor(grid) {
        this.grid = grid;
        this.tooltip = null;
        this.timeout = null;

        this._setupDOM();
        this._bindEvents();
    }

    _setupDOM() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'sf-note-tooltip';
        this.tooltip.style.display = 'none';
        document.body.appendChild(this.tooltip);
    }

    _bindEvents() {
        this.grid.cellsContainer.addEventListener('mouseover', (e) => {
            const cellEl = e.target.closest('.sf-has-comment');
            if (cellEl) {
                const r = parseInt(cellEl.dataset.row, 10);
                const c = parseInt(cellEl.dataset.col, 10);
                const cell = this.grid.sheet ? this.grid.sheet.getCell(r, c) : null;
                if (cell && cell.comment) {
                    const rect = cellEl.getBoundingClientRect();
                    this.show(cell.comment, rect.right + 4, rect.top);
                }
            }
        });

        this.grid.cellsContainer.addEventListener('mouseout', (e) => {
            const cellEl = e.target.closest('.sf-has-comment');
            if (cellEl) {
                this.hide();
            }
        });
    }

    show(text, x, y) {
        clearTimeout(this.timeout);
        this.tooltip.innerHTML = `
            <div class="sf-note-header">Note</div>
            <div class="sf-note-body">${this._escapeHTML(text)}</div>
        `;
        this.tooltip.style.left = `${Math.min(window.innerWidth - 220, x)}px`;
        this.tooltip.style.top = `${y}px`;
        this.tooltip.style.display = 'block';
    }

    hide() {
        this.timeout = setTimeout(() => {
            this.tooltip.style.display = 'none';
        }, 100);
    }

    _escapeHTML(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}
