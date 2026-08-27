/**
 * AudioDeck - BrowserView
 * Left sidebar sample browser with category folders, sample preview audition,
 * drag-and-drop onto arrangement timeline, and external audio file importer.
 */
import { AudioClip } from '../models/Clip.js';

export class BrowserView {
    /**
     * @param {HTMLElement} container 
     * @param {AudioEngine} audioEngine 
     * @param {Project} project 
     */
    constructor(container, audioEngine, project) {
        this.container = container;
        this.engine = audioEngine;
        this.project = project;

        this.previewSource = null;
        this.previewingKey = null;
        this.userSamples = {}; // key -> { name, buffer }

        this._render();
        this._bindEvents();
    }

    _render() {
        this.container.innerHTML = `
            <div class="browser-sidebar">
                <!-- Browser Header -->
                <div class="browser-header">
                    <span class="browser-title">SAMPLE LIBRARY</span>
                    <button class="browser-collapse-btn" id="btnCollapseBrowser" title="Toggle Browser">◀</button>
                </div>

                <!-- Import Zone Button -->
                <div class="browser-import-box">
                    <label class="btn-import-file" title="Import WAV/MP3/OGG file">
                        <span>📥 Import Audio</span>
                        <input type="file" id="inputAudioFile" accept="audio/*" style="display: none;" />
                    </label>
                </div>

                <!-- Search Filter -->
                <div class="browser-search-box">
                    <input type="text" class="browser-search-input" id="searchSamples" placeholder="Search sounds..." />
                </div>

                <!-- Tree / Category List -->
                <div class="browser-tree" id="browserTree"></div>

                <!-- Preview Info Bar -->
                <div class="browser-preview-bar" id="browserPreviewBar">
                    <span class="preview-status">Click sound to audition</span>
                </div>
            </div>
        `;

        this.treeEl = this.container.querySelector('#browserTree');
        this.previewStatus = this.container.querySelector('.preview-status');
        this.fileInput = this.container.querySelector('#inputAudioFile');
        this.searchInput = this.container.querySelector('#searchSamples');

        this.renderTree();
    }

    _bindEvents() {
        // Toggle Collapse
        this.container.querySelector('#btnCollapseBrowser').addEventListener('click', () => {
            this.container.classList.toggle('collapsed');
        });

        // Search Filter
        this.searchInput.addEventListener('input', () => {
            this.renderTree(this.searchInput.value.trim().toLowerCase());
        });

        // Audio File Import
        this.fileInput.addEventListener('change', async (e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            await this.engine.ensureContext();
            const file = files[0];
            try {
                this.previewStatus.textContent = `Importing ${file.name}...`;
                const arrayBuffer = await file.arrayBuffer();
                const audioBuffer = await this.engine.ctx.decodeAudioData(arrayBuffer);

                const sampleKey = 'user_' + Math.random().toString(36).substr(2, 9);
                this.userSamples[sampleKey] = {
                    name: file.name.replace(/\.[^/.]+$/, ''),
                    category: 'User Imports',
                    buffer: audioBuffer
                };

                this.previewStatus.textContent = `Imported: ${file.name}`;
                this.renderTree();
            } catch (err) {
                console.error('Audio import decode failed:', err);
                this.previewStatus.textContent = 'Import failed. Please use standard WAV/MP3.';
            }
        });
    }

    renderTree(filterQuery = '') {
        const lib = { ...this.engine.sampleLibrary, ...this.userSamples };
        const categories = {};

        // Group by category
        for (const [key, item] of Object.entries(lib)) {
            if (filterQuery && !item.name.toLowerCase().includes(filterQuery) && !item.category.toLowerCase().includes(filterQuery)) {
                continue;
            }
            const cat = item.category || 'Other';
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push({ key, ...item });
        }

        this.treeEl.innerHTML = '';

        const catIcons = {
            'Drums': '🥁',
            'Bass': '🎸',
            'Synths': '🎹',
            'FX': '🌊',
            'Loops': '🔁',
            'User Imports': '📂'
        };

        for (const [catName, items] of Object.entries(categories)) {
            const folderEl = document.createElement('div');
            folderEl.className = 'browser-folder open';

            folderEl.innerHTML = `
                <div class="folder-header">
                    <span class="folder-arrow">▼</span>
                    <span class="folder-icon">${catIcons[catName] || '📁'}</span>
                    <span class="folder-name">${catName}</span>
                    <span class="folder-count">${items.length}</span>
                </div>
                <div class="folder-items"></div>
            `;

            folderEl.querySelector('.folder-header').addEventListener('click', () => {
                folderEl.classList.toggle('open');
                folderEl.querySelector('.folder-arrow').textContent = folderEl.classList.contains('open') ? '▼' : '▶';
            });

            const itemsContainer = folderEl.querySelector('.folder-items');
            items.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = `browser-item ${this.previewingKey === item.key ? 'previewing' : ''}`;
                itemEl.draggable = true;
                itemEl.dataset.sampleKey = item.key;

                const durationStr = item.buffer ? `${item.buffer.duration.toFixed(1)}s` : '';

                itemEl.innerHTML = `
                    <span class="item-play-icon">${this.previewingKey === item.key ? '⏹' : '▶'}</span>
                    <span class="item-name" title="${item.name}">${item.name}</span>
                    <span class="item-dur">${durationStr}</span>
                `;

                // Audition Preview on Click
                itemEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.togglePreview(item.key, item);
                });

                // Double Click to insert clip on active track at playhead
                itemEl.addEventListener('dblclick', (e) => {
                    e.stopPropagation();
                    this.insertSampleToTimeline(item.key, item);
                });

                // Drag and Drop Data
                itemEl.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', JSON.stringify({
                        type: 'sample',
                        sampleKey: item.key,
                        name: item.name,
                        durationSec: item.buffer?.duration || 2.0
                    }));
                });

                itemsContainer.appendChild(itemEl);
            });

            this.treeEl.appendChild(folderEl);
        }
    }

    async togglePreview(key, item) {
        await this.engine.ensureContext();

        if (this.previewingKey === key && this.previewSource) {
            this.stopPreview();
            return;
        }

        this.stopPreview();
        if (!item.buffer) return;

        this.previewingKey = key;
        this.previewSource = this.engine.ctx.createBufferSource();
        this.previewSource.buffer = item.buffer;

        const gain = this.engine.ctx.createGain();
        gain.gain.setValueAtTime(0.85, this.engine.ctx.currentTime);

        this.previewSource.connect(gain);
        gain.connect(this.engine.masterEffects.inputNode);

        this.previewSource.start(0);
        this.previewStatus.textContent = `▶ Playing: ${item.name}`;

        this.previewSource.onended = () => {
            this.previewSource = null;
            this.previewingKey = null;
            this.previewStatus.textContent = 'Audition finished';
            this.renderTree();
        };

        this.renderTree();
    }

    stopPreview() {
        if (this.previewSource) {
            try { this.previewSource.stop(); this.previewSource.disconnect(); } catch (e) {}
            this.previewSource = null;
        }
        this.previewingKey = null;
        this.previewStatus.textContent = 'Preview stopped';
        this.renderTree();
    }

    insertSampleToTimeline(sampleKey, sampleItem) {
        let track = this.project.getTrack(this.project.activeTrackId);
        if (!track || track.type !== 'audio') {
            // Find first audio track or create one
            track = this.project.tracks.find(t => t.type === 'audio') || this.project.addTrack('audio', 'Audio Sample');
            this.engine.registerTrack(track);
        }

        const beatSec = 60 / this.project.bpm;
        const durBeats = Math.max(1, Math.round((sampleItem.buffer.duration / beatSec) * 4) / 4);
        const playheadBeat = this.project.snapBeat(this.engine.secondsToBeats(this.engine.playheadPosition));

        const clip = new AudioClip({
            name: sampleItem.name,
            trackId: track.id,
            startBeat: playheadBeat,
            durationBeats: durBeats,
            sampleKey: sampleKey,
            audioBuffer: sampleItem.buffer,
            color: track.color
        });

        this.project.history.pushState('Add Sample Clip');
        track.addClip(clip);
        this.project.selectedClipIds.clear();
        this.project.selectedClipIds.add(clip.id);
        this.project.notify('clip_added', { track, clip });
    }
}
