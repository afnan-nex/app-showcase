/**
 * AudioDeck - ModalManager
 * Production dialogs: Template Picker, Save/Open Project, WAV Audio Export with rendering progress,
 * Keyboard Shortcuts, and Toast Notification System.
 */
import { StorageManager } from '../storage/StorageManager.js';
import { WavExporter } from '../engine/WavExporter.js';

export class ModalManager {
    /**
     * @param {HTMLElement} rootContainer 
     * @param {AudioEngine} audioEngine 
     * @param {Project} project 
     * @param {Object} callbacks 
     */
    constructor(rootContainer, audioEngine, project, callbacks = {}) {
        this.root = rootContainer;
        this.engine = audioEngine;
        this.project = project;
        this.callbacks = callbacks;

        this._initToastContainer();
    }

    _initToastContainer() {
        let toastBox = document.getElementById('toastContainer');
        if (!toastBox) {
            toastBox = document.createElement('div');
            toastBox.id = 'toastContainer';
            toastBox.className = 'toast-container';
            document.body.appendChild(toastBox);
        }
        this.toastBox = toastBox;
    }

    /**
     * Displays a sleek DAW toast notification
     * @param {string} message 
     * @param {string} type 'info' | 'success' | 'warning' | 'error'
     * @param {number} durationMs 
     */
    showToast(message, type = 'info', durationMs = 3000) {
        const toast = document.createElement('div');
        toast.className = `daw-toast toast-${type}`;
        
        const icons = {
            info: 'ℹ️',
            success: '✓',
            warning: '⚠️',
            error: '✕'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
            <span class="toast-text">${message}</span>
        `;

        this.toastBox.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('visible'));

        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 250);
        }, durationMs);
    }

    _createModalShell(title, contentHtml) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-header">
                    <span class="modal-title">${title}</span>
                    <button class="modal-close-btn" title="Close (Esc)">✕</button>
                </div>
                <div class="modal-body">${contentHtml}</div>
            </div>
        `;

        const closeModal = () => {
            overlay.classList.remove('active');
            window.removeEventListener('keydown', onKeyDown);
            setTimeout(() => overlay.remove(), 200);
        };

        const onKeyDown = (e) => {
            if (e.key === 'Escape') closeModal();
        };

        window.addEventListener('keydown', onKeyDown);
        overlay.querySelector('.modal-close-btn').addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        this.root.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('active'));
        return { overlay, closeModal };
    }

    showNewProjectModal() {
        const templates = StorageManager.getTemplateList();
        const templatesHtml = templates.map((t, idx) => `
            <label class="template-card ${idx === 0 ? 'selected' : ''}" data-id="${t.id}">
                <input type="radio" name="projTemplate" value="${t.id}" ${idx === 0 ? 'checked' : ''} style="display: none;" />
                <div class="template-card-header">
                    <span class="template-name">${t.name}</span>
                    <span class="template-bpm-badge">${t.bpm} BPM</span>
                </div>
                <div class="template-desc">${t.desc}</div>
            </label>
        `).join('');

        const { overlay, closeModal } = this._createModalShell('New Project / Template', `
            <div class="modal-form-group">
                <label>Project Name</label>
                <input type="text" id="newProjName" class="modal-input" value="My New Session" />
            </div>
            
            <div class="templates-section">
                <label class="section-label">Select Studio Template</label>
                <div class="templates-grid">${templatesHtml}</div>
            </div>

            <div class="modal-actions-row">
                <button class="modal-btn" id="btnCancelNew">Cancel</button>
                <button class="modal-btn btn-primary" id="btnConfirmNew">Create Project</button>
            </div>
        `);

        // Template Selection Highlight
        overlay.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => {
                overlay.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                const radio = card.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
            });
        });

        overlay.querySelector('#btnCancelNew').addEventListener('click', closeModal);
        overlay.querySelector('#btnConfirmNew').addEventListener('click', () => {
            const name = overlay.querySelector('#newProjName').value.trim() || 'Untitled Session';
            const templateId = overlay.querySelector('input[name="projTemplate"]:checked')?.value || 'synthwave';
            
            if (this.callbacks.onTemplateSelected) {
                this.callbacks.onTemplateSelected(templateId, name);
            }
            this.showToast(`Loaded template: ${name}`, 'success');
            closeModal();
        });
    }

    async showOpenProjectModal() {
        const projects = await StorageManager.listProjects();

        let listHtml = '';
        if (projects.length === 0) {
            listHtml = '<div class="no-projects-msg">No saved projects found in local browser storage.</div>';
        } else {
            listHtml = `<div class="project-list-items">` + projects.map(p => {
                const dateStr = new Date(p.updatedAt).toLocaleString();
                return `
                    <div class="project-list-row" data-id="${p.id}">
                        <div class="proj-info">
                            <span class="proj-name">${p.name}</span>
                            <span class="proj-meta">${p.bpm} BPM • ${dateStr}</span>
                        </div>
                        <div class="proj-actions">
                            <button class="modal-btn-sm btn-load" data-id="${p.id}">Open</button>
                            <button class="modal-btn-sm btn-delete" data-id="${p.id}" title="Delete project">🗑️</button>
                        </div>
                    </div>
                `;
            }).join('') + `</div>`;
        }

        const { overlay, closeModal } = this._createModalShell('Open Project', `
            <div class="open-projects-section">
                <div class="section-title">Saved Local Sessions</div>
                ${listHtml}
                <div class="modal-divider"></div>
                <div class="import-file-section">
                    <label class="modal-btn btn-primary btn-block">
                        📥 Import Project File (.audiodeck / .json)
                        <input type="file" id="modalImportInput" accept=".json,.audiodeck" style="display: none;" />
                    </label>
                </div>
            </div>
        `);

        // Load Project
        overlay.querySelectorAll('.btn-load').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.dataset.id;
                const loaded = await StorageManager.loadProject(id, this.engine.sampleLibrary);
                if (loaded && this.callbacks.onProjectLoaded) {
                    this.callbacks.onProjectLoaded(loaded);
                    this.showToast(`Loaded session: ${loaded.name}`, 'success');
                }
                closeModal();
            });
        });

        // Delete Project
        overlay.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.dataset.id;
                if (confirm('Are you sure you want to delete this saved project?')) {
                    await StorageManager.deleteProject(id);
                    this.showToast('Project deleted', 'info');
                    closeModal();
                    this.showOpenProjectModal();
                }
            });
        });

        // Import Project from File
        overlay.querySelector('#modalImportInput').addEventListener('change', async (e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                try {
                    const imported = await StorageManager.importProjectJSON(files[0], this.engine.sampleLibrary);
                    if (imported && this.callbacks.onProjectLoaded) {
                        this.callbacks.onProjectLoaded(imported);
                        this.showToast(`Imported project: ${imported.name}`, 'success');
                    }
                    closeModal();
                } catch (err) {
                    this.showToast('Import failed: ' + err.message, 'error');
                }
            }
        });
    }

    showSaveProjectModal() {
        const { overlay, closeModal } = this._createModalShell('Save Session', `
            <div class="modal-form-group">
                <label>Project Session Name</label>
                <input type="text" id="saveProjName" class="modal-input" value="${this.project.name}" />
            </div>
            <div class="modal-actions-row">
                <button class="modal-btn" id="btnExportJSON">📥 Download File (.audiodeck)</button>
                <button class="modal-btn btn-primary" id="btnSaveLocal">💾 Save to Browser</button>
            </div>
        `);

        overlay.querySelector('#btnExportJSON').addEventListener('click', () => {
            this.project.name = overlay.querySelector('#saveProjName').value.trim() || this.project.name;
            StorageManager.exportProjectJSON(this.project);
            this.showToast('Project file downloaded', 'success');
            closeModal();
        });

        overlay.querySelector('#btnSaveLocal').addEventListener('click', async () => {
            this.project.name = overlay.querySelector('#saveProjName').value.trim() || this.project.name;
            const ok = await StorageManager.saveProject(this.project);
            if (ok) {
                this.showToast(`Session "${this.project.name}" saved to browser storage`, 'success');
            } else {
                this.showToast('Could not save session to storage', 'error');
            }
            closeModal();
        });
    }

    showExportWavModal() {
        const { overlay, closeModal } = this._createModalShell('Render & Export Master Audio (WAV)', `
            <div class="export-modal-body">
                <div class="export-options">
                    <label class="radio-option">
                        <input type="radio" name="exportRange" value="full" checked />
                        <span>Export Full Song Timeline</span>
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="exportRange" value="loop" />
                        <span>Export Loop Region (${this.project.loop.startBeat} to ${this.project.loop.endBeat} Beats)</span>
                    </label>
                </div>

                <div class="export-settings-row">
                    <div class="setting-item">
                        <span class="setting-lbl">Sample Rate</span>
                        <span class="setting-val">44.1 kHz (Studio PCM)</span>
                    </div>
                    <div class="setting-item">
                        <span class="setting-lbl">Channels</span>
                        <span class="setting-val">2 (Stereo Master)</span>
                    </div>
                    <div class="setting-item">
                        <span class="setting-lbl">Bit Depth</span>
                        <span class="setting-val">16-bit Integer</span>
                    </div>
                </div>

                <div class="render-progress-section" id="renderProgressSec" style="display: none;">
                    <span class="render-label" id="renderStatusLabel">Rendering audio graph...</span>
                    <div class="progress-bar-track">
                        <div class="progress-bar-fill" id="renderProgressFill"></div>
                    </div>
                </div>

                <div class="modal-actions-row">
                    <button class="modal-btn" id="btnCancelExport">Cancel</button>
                    <button class="modal-btn btn-primary" id="btnStartRender">⚡ Render & Download WAV</button>
                </div>
            </div>
        `);

        const btnStart = overlay.querySelector('#btnStartRender');
        const progressSec = overlay.querySelector('#renderProgressSec');
        const progressFill = overlay.querySelector('#renderProgressFill');
        const statusLabel = overlay.querySelector('#renderStatusLabel');

        overlay.querySelector('#btnCancelExport').addEventListener('click', closeModal);

        btnStart.addEventListener('click', async () => {
            const isLoopOnly = overlay.querySelector('input[name="exportRange"]:checked').value === 'loop';
            btnStart.disabled = true;
            progressSec.style.display = 'block';

            try {
                const wavBlob = await this.engine.renderProjectToWav(
                    this.project,
                    { loopOnly: isLoopOnly },
                    (pct) => {
                        progressFill.style.width = `${Math.round(pct * 100)}%`;
                        statusLabel.textContent = `Offline Render: ${Math.round(pct * 100)}%`;
                    }
                );

                statusLabel.textContent = 'Render complete! Downloading audio...';
                const filename = (this.project.name.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'master_render') + '.wav';
                WavExporter.downloadBlob(wavBlob, filename);
                this.showToast(`Audio exported: ${filename}`, 'success');

                setTimeout(() => closeModal(), 1000);
            } catch (err) {
                console.error('WAV render failed:', err);
                statusLabel.textContent = 'Render failed: ' + err.message;
                btnStart.disabled = false;
                this.showToast('Render failed: ' + err.message, 'error');
            }
        });
    }

    showShortcutsModal() {
        this._createModalShell('Keyboard Shortcuts & Navigation', `
            <div class="shortcuts-grid">
                <div class="shortcut-row"><kbd>Space</kbd> <span>Play / Pause</span></div>
                <div class="shortcut-row"><kbd>Enter</kbd> <span>Stop & Return to Cue Point</span></div>
                <div class="shortcut-row"><kbd>L</kbd> <span>Toggle Loop Mode</span></div>
                <div class="shortcut-row"><kbd>1</kbd> / <kbd>2</kbd> <span>Pointer / Pen Draw Tool</span></div>
                <div class="shortcut-row"><kbd>3</kbd> / <kbd>4</kbd> <span>Split / Eraser Tool</span></div>
                <div class="shortcut-row"><kbd>Ctrl</kbd> + <kbd>Z</kbd> <span>Undo Project Action</span></div>
                <div class="shortcut-row"><kbd>Ctrl</kbd> + <kbd>Y</kbd> <span>Redo Project Action</span></div>
                <div class="shortcut-row"><kbd>Ctrl</kbd> + <kbd>D</kbd> <span>Duplicate Selected Clips</span></div>
                <div class="shortcut-row"><kbd>Ctrl</kbd> + <kbd>A</kbd> <span>Select All Clips / Notes</span></div>
                <div class="shortcut-row"><kbd>Delete</kbd> / <kbd>Backspace</kbd> <span>Delete Selected</span></div>
                <div class="shortcut-row"><kbd>S</kbd> <span>Split Clip at Playhead</span></div>
                <div class="shortcut-row"><kbd>+</kbd> / <kbd>−</kbd> <span>Arrangement Zoom In / Out</span></div>
                <div class="shortcut-row"><kbd>Shift</kbd> + Drag <span>Fine-tune Parameter Dial</span></div>
                <div class="shortcut-row"><kbd>Double-Click</kbd> <span>Reset Knob to Center / Default</span></div>
            </div>
        `);
    }
}
