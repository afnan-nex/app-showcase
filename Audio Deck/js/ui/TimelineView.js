/**
 * AudioDeck - TimelineView
 * Central Arrangement Timeline with track headers, canvas ruler, playhead,
 * loop markers, draggable & resizable clips, waveforms, and tools.
 */
import { WaveformRenderer } from '../utils/WaveformRenderer.js';
import { AudioClip, MidiClip, PatternClip } from '../models/Clip.js';

export class TimelineView {
    /**
     * @param {HTMLElement} container 
     * @param {AudioEngine} audioEngine 
     * @param {Project} project 
     * @param {Object} actions 
     */
    constructor(container, audioEngine, project, actions = {}) {
        this.container = container;
        this.engine = audioEngine;
        this.project = project;
        this.actions = actions;

        this.scrollLeft = 0;
        this.scrollTop = 0;
        this.totalBars = 64; // default arrangement length

        this._dragState = null;
        this._selectionBox = null;
        this._contextMenuEl = null;

        this.paletteColors = [
            '#3b82f6', '#06b6d4', '#10b981', '#84cc16',
            '#eab308', '#f97316', '#ef4444', '#ec4899',
            '#a855f7', '#6366f1', '#64748b', '#14b8a6'
        ];

        this._render();
        this._bindEvents();
        this._startPlayheadAnimation();
    }

    _render() {
        this.container.innerHTML = `
            <div class="timeline-container">
                <!-- Top Toolbar: Zoom & View controls -->
                <div class="timeline-topbar">
                    <div class="timeline-tracklist-header">
                        <span class="header-title">TRACKS</span>
                        <div class="tracklist-actions">
                            <button class="btn-add-track" id="btnAddTrack" title="Add Track">+ Track ▾</button>
                            <div class="add-track-menu" id="addTrackMenu">
                                <div class="menu-item" data-type="audio">🎵 Audio Track</div>
                                <div class="menu-item" data-type="synth">🎹 Synth Track</div>
                                <div class="menu-item" data-type="drum">🥁 Drum Machine</div>
                            </div>
                        </div>
                    </div>
                    <div class="timeline-ruler-wrapper" id="rulerWrapper">
                        <canvas class="timeline-ruler-canvas" id="rulerCanvas"></canvas>
                        <div class="loop-region-marker" id="loopRegionMarker">
                            <div class="loop-handle loop-handle-start" title="Drag to resize loop start"></div>
                            <div class="loop-bar-body" title="Drag loop region"></div>
                            <div class="loop-handle loop-handle-end" title="Drag to resize loop end"></div>
                        </div>
                    </div>
                    <div class="timeline-zoom-controls">
                        <button class="zoom-btn" id="btnZoomOut" title="Zoom Out (-)">−</button>
                        <input type="range" id="zoomSlider" min="15" max="150" value="${this.project.zoom.pixelsPerBeat}" />
                        <button class="zoom-btn" id="btnZoomIn" title="Zoom In (+)">+</button>
                    </div>
                </div>

                <!-- Main Body: Split between Left Track Headers and Right Clip Arrangement -->
                <div class="timeline-body" id="timelineBody">
                    <!-- Left: Track Headers Column -->
                    <div class="track-headers-list" id="trackHeadersList"></div>

                    <!-- Right: Arrangement Tracks Grid Scrollable Area -->
                    <div class="tracks-arrangement-viewport" id="arrangementViewport">
                        <div class="tracks-arrangement-content" id="arrangementContent">
                            <!-- Background Grid Lines Canvas -->
                            <canvas class="timeline-grid-canvas" id="gridCanvas"></canvas>
                            
                            <!-- Track Lanes for Clips -->
                            <div class="track-lanes-container" id="trackLanesContainer"></div>

                            <!-- Playhead Vertical Line -->
                            <div class="timeline-playhead" id="timelinePlayhead">
                                <div class="playhead-head"></div>
                                <div class="playhead-line"></div>
                            </div>

                            <!-- Selection Box Rect -->
                            <div class="timeline-marquee-box" id="marqueeBox"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.trackHeadersList = this.container.querySelector('#trackHeadersList');
        this.trackLanesContainer = this.container.querySelector('#trackLanesContainer');
        this.arrangementViewport = this.container.querySelector('#arrangementViewport');
        this.arrangementContent = this.container.querySelector('#arrangementContent');
        this.rulerCanvas = this.container.querySelector('#rulerCanvas');
        this.gridCanvas = this.container.querySelector('#gridCanvas');
        this.playheadEl = this.container.querySelector('#timelinePlayhead');
        this.loopRegionMarker = this.container.querySelector('#loopRegionMarker');
        this.marqueeBox = this.container.querySelector('#marqueeBox');
        this.zoomSlider = this.container.querySelector('#zoomSlider');
        this.addTrackMenu = this.container.querySelector('#addTrackMenu');

        this.renderTracks();
        this.drawRuler();
        this.drawGrid();
        this.updateLoopRegion();
    }

    _bindEvents() {
        // Zoom Slider
        this.zoomSlider.addEventListener('input', (e) => {
            this.setZoom(parseFloat(e.target.value));
        });
        this.container.querySelector('#btnZoomIn').addEventListener('click', () => {
            this.setZoom(this.project.zoom.pixelsPerBeat * 1.25);
        });
        this.container.querySelector('#btnZoomOut').addEventListener('click', () => {
            this.setZoom(this.project.zoom.pixelsPerBeat / 1.25);
        });

        // Mousewheel zoom (Ctrl + wheel) or horizontal scroll
        this.arrangementViewport.addEventListener('wheel', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = e.deltaY < 0 ? 1.15 : 0.85;
                this.setZoom(this.project.zoom.pixelsPerBeat * delta);
            } else if (e.shiftKey) {
                this.arrangementViewport.scrollLeft += e.deltaY;
            }
        }, { passive: false });

        // Synchronize Horizontal Scrolling between ruler and arrangement viewport
        this.arrangementViewport.addEventListener('scroll', () => {
            this.scrollLeft = this.arrangementViewport.scrollLeft;
            this.scrollTop = this.arrangementViewport.scrollTop;
            this.trackHeadersList.scrollTop = this.scrollTop;
            this.drawRuler();
            this.updateLoopRegion();
        });

        // Add Track Dropdown Menu
        const btnAddTrack = this.container.querySelector('#btnAddTrack');
        btnAddTrack.addEventListener('click', (e) => {
            e.stopPropagation();
            this.addTrackMenu.classList.toggle('open');
        });

        this.addTrackMenu.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const type = e.currentTarget.getAttribute('data-type');
                const newTrack = this.project.addTrack(type);
                this.engine.registerTrack(newTrack);
                this.addTrackMenu.classList.remove('open');
            });
        });

        document.addEventListener('click', () => {
            this.addTrackMenu.classList.remove('open');
            this._closeContextMenu();
        });

        // Ruler Mouse Interaction (Seek Playhead / Drag Loop)
        this._bindRulerEvents();

        // Loop Handle Dragging
        this._bindLoopHandleEvents();

        // Arrangement Click & Drag (Clips movement, resizing, marquee selection)
        this._bindArrangementEvents();

        // Drag & Drop from Sample Browser or Desktop onto Timeline Lanes
        this._bindTimelineDropEvents();

        // Keyboard shortcuts inside timeline
        window.addEventListener('keydown', (e) => {
            if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) return;

            if (e.key === 'Delete' || e.key === 'Backspace') {
                this.project.deleteSelectedClips();
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
                e.preventDefault();
                this.project.duplicateSelectedClips();
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
                e.preventDefault();
                this.selectAllClips();
            } else if (e.key.toLowerCase() === 's' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e')) {
                // Split selected clip at playhead
                const playheadBeat = this.engine.secondsToBeats(this.engine.playheadPosition);
                this.project.selectedClipIds.forEach(id => {
                    this.project.splitClipAtBeat(id, playheadBeat);
                });
            }
        });
    }

    setZoom(pixelsPerBeat) {
        const clamped = Math.max(this.project.zoom.minZoom, Math.min(this.project.zoom.maxZoom, pixelsPerBeat));
        this.project.zoom.pixelsPerBeat = clamped;
        this.zoomSlider.value = clamped;
        this._updateArrangementDimensions();
        this.drawRuler();
        this.drawGrid();
        this.renderClips();
        this.updateLoopRegion();
    }

    _updateArrangementDimensions() {
        const totalBeats = this.totalBars * 4;
        const totalWidth = totalBeats * this.project.zoom.pixelsPerBeat + 400;
        this.arrangementContent.style.width = `${totalWidth}px`;
    }

    // -------------------------------------------------------------
    // RULER & LOOP BRACKET
    // -------------------------------------------------------------
    _bindRulerEvents() {
        let isSeeking = false;
        const rulerWrapper = this.container.querySelector('#rulerWrapper');

        const getBeatFromX = (clientX) => {
            const rect = this.rulerCanvas.getBoundingClientRect();
            const x = clientX - rect.left + this.scrollLeft;
            const ppb = this.project.zoom.pixelsPerBeat;
            const rawBeat = x / ppb;
            return this.project.snapBeat(rawBeat);
        };

        rulerWrapper.addEventListener('mousedown', (e) => {
            if (e.target.closest('.loop-handle') || e.target.closest('.loop-bar-body')) return;
            isSeeking = true;
            const beat = getBeatFromX(e.clientX);
            const sec = this.engine.beatsToSeconds(beat);
            this.engine.seek(sec, this.project);

            const onMouseMove = (ev) => {
                if (!isSeeking) return;
                const b = getBeatFromX(ev.clientX);
                this.engine.seek(this.engine.beatsToSeconds(b), this.project);
            };

            const onMouseUp = () => {
                isSeeking = false;
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        });
    }

    _bindLoopHandleEvents() {
        let isDraggingLoop = false;
        let dragMode = null; // 'start', 'end', 'body'
        let startX = 0;
        let origStartBeat = 0;
        let origEndBeat = 0;

        const loopStartHandle = this.container.querySelector('.loop-handle-start');
        const loopEndHandle = this.container.querySelector('.loop-handle-end');
        const loopBody = this.container.querySelector('.loop-bar-body');

        const onMouseDown = (e, mode) => {
            e.stopPropagation();
            isDraggingLoop = true;
            dragMode = mode;
            startX = e.clientX;
            origStartBeat = this.project.loop.startBeat;
            origEndBeat = this.project.loop.endBeat;

            const onMouseMove = (ev) => {
                if (!isDraggingLoop) return;
                const deltaX = ev.clientX - startX;
                const deltaBeat = deltaX / this.project.zoom.pixelsPerBeat;

                if (dragMode === 'start') {
                    const newStart = Math.min(origEndBeat - 0.25, Math.max(0, this.project.snapBeat(origStartBeat + deltaBeat)));
                    this.project.loop.startBeat = newStart;
                } else if (dragMode === 'end') {
                    const newEnd = Math.max(origStartBeat + 0.25, this.project.snapBeat(origEndBeat + deltaBeat));
                    this.project.loop.endBeat = newEnd;
                } else if (dragMode === 'body') {
                    const dur = origEndBeat - origStartBeat;
                    const newStart = Math.max(0, this.project.snapBeat(origStartBeat + deltaBeat));
                    this.project.loop.startBeat = newStart;
                    this.project.loop.endBeat = newStart + dur;
                }

                this.engine.setLoop(this.project.loop.enabled, this.project.loop.startBeat, this.project.loop.endBeat);
                this.updateLoopRegion();
            };

            const onMouseUp = () => {
                if (!isDraggingLoop) return;
                isDraggingLoop = false;
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
                this.project.notify('loop_changed');
            };

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        };

        loopStartHandle.addEventListener('mousedown', (e) => onMouseDown(e, 'start'));
        loopEndHandle.addEventListener('mousedown', (e) => onMouseDown(e, 'end'));
        loopBody.addEventListener('mousedown', (e) => onMouseDown(e, 'body'));
    }

    updateLoopRegion() {
        if (!this.loopRegionMarker) return;
        const ppb = this.project.zoom.pixelsPerBeat;
        const left = this.project.loop.startBeat * ppb - this.scrollLeft;
        const width = (this.project.loop.endBeat - this.project.loop.startBeat) * ppb;

        this.loopRegionMarker.style.left = `${left}px`;
        this.loopRegionMarker.style.width = `${Math.max(4, width)}px`;
        this.loopRegionMarker.style.display = this.project.loop.enabled ? 'flex' : 'none';
    }

    drawRuler() {
        const canvas = this.rulerCanvas;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const dpr = window.devicePixelRatio || 1;
        const width = (canvas.parentElement ? canvas.parentElement.clientWidth : 0) || canvas.clientWidth || 800;
        const height = 30;

        if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
        }

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        const ppb = this.project.zoom.pixelsPerBeat;
        const beatsPerBar = this.project.timeSignature[0] || 4;
        const startBeat = Math.floor(this.scrollLeft / ppb);
        const visibleBeats = Math.ceil(width / ppb) + 2;

        ctx.fillStyle = '#1e222d';
        ctx.fillRect(0, 0, width, height);

        ctx.font = '10px Inter, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        for (let b = startBeat; b <= startBeat + visibleBeats; b++) {
            const x = b * ppb - this.scrollLeft;
            const isBar = b % beatsPerBar === 0;

            if (isBar) {
                const barNum = Math.floor(b / beatsPerBar) + 1;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x, 12);
                ctx.lineTo(x, height);
                ctx.stroke();

                ctx.fillStyle = '#cbd5e1';
                ctx.fillText(`${barNum}`, x + 4, 10);
            } else {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x, 20);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
        }

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height - 0.5);
        ctx.lineTo(width, height - 0.5);
        ctx.stroke();

        ctx.restore();
    }

    drawGrid() {
        const canvas = this.gridCanvas;
        if (!canvas) return;

        const totalWidth = (this.arrangementContent ? this.arrangementContent.clientWidth : 0) || 2000;
        const totalHeight = (this.arrangementContent ? this.arrangementContent.clientHeight : 0) || 600;
        const dpr = window.devicePixelRatio || 1;

        if (canvas.width !== totalWidth * dpr || canvas.height !== totalHeight * dpr) {
            canvas.width = totalWidth * dpr;
            canvas.height = totalHeight * dpr;
        }

        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, totalWidth, totalHeight);

        const ppb = this.project.zoom.pixelsPerBeat;
        const beatsPerBar = this.project.timeSignature[0] || 4;
        const totalBeats = Math.ceil(totalWidth / ppb);

        for (let b = 0; b <= totalBeats; b++) {
            const x = b * ppb;
            const isBar = b % beatsPerBar === 0;

            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, totalHeight);

            if (isBar) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
                ctx.lineWidth = 1;
            } else {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
                ctx.lineWidth = 1;
            }
            ctx.stroke();
        }

        ctx.restore();
    }

    // -------------------------------------------------------------
    // TRACK HEADERS & LANES RENDERING
    // -------------------------------------------------------------
    renderTracks() {
        this.trackHeadersList.innerHTML = '';
        this.trackLanesContainer.innerHTML = '';

        this.project.tracks.forEach((track, idx) => {
            const header = document.createElement('div');
            header.className = `track-header ${track.id === this.project.activeTrackId ? 'active' : ''}`;
            header.style.height = `${track.height}px`;
            header.dataset.trackId = track.id;

            const typeIcons = {
                audio: '🎵',
                synth: '🎹',
                drum: '🥁',
                automation: '📈'
            };

            header.innerHTML = `
                <div class="track-color-strip" style="background-color: ${track.color};" title="Click to change color"></div>
                <div class="track-header-main">
                    <div class="track-title-row">
                        <span class="track-icon">${typeIcons[track.type] || '🎵'}</span>
                        <input type="text" class="track-name-input" value="${track.name}" title="Edit track name" />
                        <div class="track-header-btns">
                            <button class="track-btn-dup" title="Duplicate Track">⎘</button>
                            <button class="track-btn-del" title="Delete Track">✕</button>
                        </div>
                    </div>
                    <div class="track-controls-row">
                        <button class="track-btn-toggle btn-mute ${track.mute ? 'active' : ''}" title="Mute (M)">M</button>
                        <button class="track-btn-toggle btn-solo ${track.solo ? 'active' : ''}" title="Solo (S)">S</button>
                        <button class="track-btn-toggle btn-arm ${track.arm ? 'active' : ''}" title="Record Arm (R)">R</button>
                    </div>
                    <div class="track-faders-row">
                        <div class="small-fader-box">
                            <span class="fader-lbl">VOL</span>
                            <input type="range" class="track-vol-slider" min="0" max="1.5" step="0.02" value="${track.volume}" />
                        </div>
                        <div class="small-fader-box">
                            <span class="fader-lbl">PAN</span>
                            <input type="range" class="track-pan-slider" min="-1" max="1" step="0.05" value="${track.pan}" />
                        </div>
                    </div>
                </div>
            `;

            // Click Track Color Strip to change color
            const colorStrip = header.querySelector('.track-color-strip');
            colorStrip.addEventListener('click', (e) => {
                e.stopPropagation();
                this._showColorPicker(e.clientX, e.clientY, (color) => {
                    track.color = color;
                    track.clips.forEach(c => c.color = color);
                    this.renderTracks();
                    this.project.notify('track_state_changed');
                });
            });

            // Track Header Events
            header.addEventListener('click', () => {
                this.project.activeTrackId = track.id;
                this.container.querySelectorAll('.track-header').forEach(h => h.classList.remove('active'));
                header.classList.add('active');
                this.project.notify('active_track_changed', { trackId: track.id });
            });

            // Track Context Menu (Right Click)
            header.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this._showTrackContextMenu(e.clientX, e.clientY, track);
            });

            const nameInput = header.querySelector('.track-name-input');
            nameInput.addEventListener('change', (e) => {
                track.name = e.target.value || 'Track';
                this.project.notify('track_renamed', { track });
            });

            header.querySelector('.btn-mute').addEventListener('click', (e) => {
                e.stopPropagation();
                track.mute = !track.mute;
                header.querySelector('.btn-mute').classList.toggle('active', track.mute);
                this.engine.updateSoloMuteStates();
                this.project.notify('track_state_changed');
            });

            header.querySelector('.btn-solo').addEventListener('click', (e) => {
                e.stopPropagation();
                track.solo = !track.solo;
                header.querySelector('.btn-solo').classList.toggle('active', track.solo);
                this.engine.updateSoloMuteStates();
                this.project.notify('track_state_changed');
            });

            header.querySelector('.btn-arm').addEventListener('click', (e) => {
                e.stopPropagation();
                track.arm = !track.arm;
                header.querySelector('.btn-arm').classList.toggle('active', track.arm);
            });

            header.querySelector('.track-vol-slider').addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                track.volume = val;
                const eng = this.engine.trackEngines.get(track.id);
                if (eng) eng.effects.setGain(val);
            });

            header.querySelector('.track-pan-slider').addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                track.pan = val;
                const eng = this.engine.trackEngines.get(track.id);
                if (eng) eng.effects.setPan(val);
            });

            header.querySelector('.track-btn-dup').addEventListener('click', (e) => {
                e.stopPropagation();
                const dup = this.project.duplicateTrack(track.id);
                if (dup) this.engine.registerTrack(dup);
            });

            header.querySelector('.track-btn-del').addEventListener('click', (e) => {
                e.stopPropagation();
                this.project.removeTrack(track.id);
                this.engine.unregisterTrack(track.id);
            });

            this.trackHeadersList.appendChild(header);

            // Right Lane in Arrangement
            const lane = document.createElement('div');
            lane.className = `track-lane ${track.id === this.project.activeTrackId ? 'active' : ''}`;
            lane.style.height = `${track.height}px`;
            lane.dataset.trackId = track.id;

            // Lane Right Click Context Menu
            lane.addEventListener('contextmenu', (e) => {
                if (e.target.closest('.timeline-clip')) return;
                e.preventDefault();
                this._showLaneContextMenu(e.clientX, e.clientY, track, e);
            });

            this.trackLanesContainer.appendChild(lane);
        });

        this._updateArrangementDimensions();
        this.renderClips();
        this.drawGrid();
    }

    // -------------------------------------------------------------
    // CLIP RENDERING & INTERACTION
    // -------------------------------------------------------------
    renderClips() {
        const ppb = this.project.zoom.pixelsPerBeat;

        this.project.tracks.forEach(track => {
            const lane = this.trackLanesContainer.querySelector(`.track-lane[data-track-id="${track.id}"]`);
            if (!lane) return;
            lane.innerHTML = '';

            track.clips.forEach(clip => {
                const clipEl = document.createElement('div');
                clipEl.className = `timeline-clip clip-${clip.type} ${this.project.selectedClipIds.has(clip.id) ? 'selected' : ''}`;
                clipEl.dataset.clipId = clip.id;
                clipEl.dataset.trackId = track.id;

                const left = clip.startBeat * ppb;
                const width = Math.max(12, clip.durationBeats * ppb);
                clipEl.style.left = `${left}px`;
                clipEl.style.width = `${width}px`;
                clipEl.style.borderTopColor = clip.color;

                clipEl.innerHTML = `
                    <div class="clip-header" style="background-color: ${clip.color};">
                        <span class="clip-title">${clip.name}</span>
                    </div>
                    <div class="clip-content">
                        <canvas class="clip-canvas"></canvas>
                    </div>
                    <div class="clip-resize-handle handle-left" title="Trim start"></div>
                    <div class="clip-resize-handle handle-right" title="Trim end"></div>
                `;

                // Render Canvas inside Clip
                const canvas = clipEl.querySelector('.clip-canvas');
                setTimeout(() => {
                    if (clip.type === 'audio' && clip.audioBuffer) {
                        WaveformRenderer.render(canvas, clip.audioBuffer, { color: clip.color });
                    } else if (clip.type === 'synth' && clip.notes) {
                        this._renderMidiPreview(canvas, clip.notes, clip.durationBeats, clip.color);
                    } else if (clip.type === 'drum' && clip.pattern) {
                        this._renderDrumPreview(canvas, clip.pattern, clip.color);
                    }
                }, 0);

                // Clip Context Menu (Right Click)
                clipEl.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this._showClipContextMenu(e.clientX, e.clientY, clip, track);
                });

                lane.appendChild(clipEl);
            });
        });
    }

    _renderMidiPreview(canvas, notes, durationBeats, color) {
        if (!canvas || !notes) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.clientWidth || 100;
        const h = canvas.clientHeight || 50;
        const dpr = window.devicePixelRatio || 1;

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);

        if (notes.length === 0) return;

        let minPitch = 127, maxPitch = 0;
        notes.forEach(n => {
            if (n.pitch < minPitch) minPitch = n.pitch;
            if (n.pitch > maxPitch) maxPitch = n.pitch;
        });
        const pitchRange = Math.max(12, maxPitch - minPitch + 2);

        ctx.fillStyle = color;
        notes.forEach(n => {
            const x = (n.startBeat / durationBeats) * w;
            const nw = Math.max(2, (n.durationBeats / durationBeats) * w);
            const normY = 1 - (n.pitch - minPitch + 1) / pitchRange;
            const y = normY * (h - 6) + 2;
            ctx.fillRect(x, y, nw - 1, 3);
        });
    }

    _renderDrumPreview(canvas, pattern, color) {
        if (!canvas || !pattern || !pattern.tracks) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.clientWidth || 100;
        const h = canvas.clientHeight || 50;
        const dpr = window.devicePixelRatio || 1;

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);

        const steps = pattern.steps || 16;
        const numRows = pattern.tracks.length || 8;
        const rowH = h / numRows;

        ctx.fillStyle = color;
        pattern.tracks.forEach((row, rIdx) => {
            row.steps.forEach((sVal, sIdx) => {
                if (sVal > 0) {
                    const x = (sIdx / steps) * w;
                    const sw = Math.max(2, w / steps - 1);
                    ctx.fillRect(x, rIdx * rowH + 1, sw, rowH - 2);
                }
            });
        });
    }

    // -------------------------------------------------------------
    // ARRANGEMENT MOUSE INTERACTIONS
    // -------------------------------------------------------------
    _bindArrangementEvents() {
        const viewport = this.arrangementViewport;

        viewport.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // only left click

            const clipEl = e.target.closest('.timeline-clip');
            const resizeHandle = e.target.closest('.clip-resize-handle');

            // 1. Tool check: Scissors (split clip)
            if (this.project.activeTool === 'scissors' && clipEl) {
                const clipId = clipEl.dataset.clipId;
                const rect = clipEl.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ppb = this.project.zoom.pixelsPerBeat;
                const { clip } = this.project.findClip(clipId);
                if (clip) {
                    const splitBeat = this.project.snapBeat(clip.startBeat + clickX / ppb);
                    this.project.splitClipAtBeat(clipId, splitBeat);
                }
                return;
            }

            // 2. Tool check: Eraser (delete clip)
            if (this.project.activeTool === 'eraser' && clipEl) {
                const clipId = clipEl.dataset.clipId;
                this.project.selectedClipIds.clear();
                this.project.selectedClipIds.add(clipId);
                this.project.deleteSelectedClips();
                return;
            }

            // 3. Clip Resize Drag
            if (resizeHandle && clipEl) {
                e.stopPropagation();
                const clipId = clipEl.dataset.clipId;
                const isLeftHandle = resizeHandle.classList.contains('handle-left');
                this._startClipResize(e, clipId, isLeftHandle);
                return;
            }

            // 4. Clip Move Drag
            if (clipEl) {
                e.stopPropagation();
                const clipId = clipEl.dataset.clipId;
                if (!e.shiftKey && !this.project.selectedClipIds.has(clipId)) {
                    this.project.selectedClipIds.clear();
                }
                this.project.selectedClipIds.add(clipId);
                this.project.activeClipId = clipId;
                this.renderClips();

                // Double click check to open bottom view
                if (e.detail === 2) {
                    const { clip, track } = this.project.findClip(clipId);
                    if (clip && track) {
                        if (track.type === 'synth') {
                            this.project.activeBottomTab = 'pianoroll';
                        } else if (track.type === 'drum') {
                            this.project.activeBottomTab = 'drumsequencer';
                        } else {
                            this.project.activeBottomTab = 'inspector';
                        }
                        this.project.notify('bottom_tab_changed', { tab: this.project.activeBottomTab, clipId: clip.id });
                    }
                    return;
                }

                this._startClipDrag(e, clipId);
                return;
            }

            // 5. Click on Empty Timeline Area -> Marquee Selection Box
            if (!clipEl) {
                if (!e.shiftKey) {
                    this.project.selectedClipIds.clear();
                    this.renderClips();
                }
                this._startMarqueeSelection(e);
            }
        });
    }

    _startClipDrag(e, primaryClipId) {
        this.project.history.pushState('Move Clip');
        const startX = e.clientX;
        const ppb = this.project.zoom.pixelsPerBeat;

        const clipsInitial = [];
        this.project.selectedClipIds.forEach(id => {
            const { clip, track } = this.project.findClip(id);
            if (clip) {
                clipsInitial.push({
                    clip,
                    trackId: track.id,
                    startBeat: clip.startBeat
                });
            }
        });

        const onMouseMove = (ev) => {
            const deltaX = ev.clientX - startX;
            const deltaBeat = deltaX / ppb;

            clipsInitial.forEach(({ clip, startBeat }) => {
                const targetBeat = Math.max(0, this.project.snapBeat(startBeat + deltaBeat));
                clip.startBeat = targetBeat;
            });

            this.renderClips();
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            this.project.notify('clips_moved');
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    _startClipResize(e, clipId, isLeft) {
        this.project.history.pushState('Resize Clip');
        const { clip } = this.project.findClip(clipId);
        if (!clip) return;

        const startX = e.clientX;
        const origStartBeat = clip.startBeat;
        const origDuration = clip.durationBeats;
        const ppb = this.project.zoom.pixelsPerBeat;

        const onMouseMove = (ev) => {
            const deltaX = ev.clientX - startX;
            const deltaBeat = deltaX / ppb;

            if (isLeft) {
                const newStart = Math.max(0, this.project.snapBeat(origStartBeat + deltaBeat));
                const newDur = origDuration - (newStart - origStartBeat);
                if (newDur >= 0.25) {
                    clip.startBeat = newStart;
                    clip.durationBeats = newDur;
                }
            } else {
                const newDur = Math.max(0.25, this.project.snapBeat(origDuration + deltaBeat));
                clip.durationBeats = newDur;
            }

            this.renderClips();
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            this.project.notify('clip_resized');
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    _startMarqueeSelection(e) {
        const rect = this.arrangementViewport.getBoundingClientRect();
        const startX = e.clientX - rect.left + this.scrollLeft;
        const startY = e.clientY - rect.top + this.scrollTop;

        this.marqueeBox.style.display = 'block';
        this.marqueeBox.style.left = `${startX}px`;
        this.marqueeBox.style.top = `${startY}px`;
        this.marqueeBox.style.width = '0px';
        this.marqueeBox.style.height = '0px';

        const onMouseMove = (ev) => {
            const currentX = ev.clientX - rect.left + this.scrollLeft;
            const currentY = ev.clientY - rect.top + this.scrollTop;

            const boxLeft = Math.min(startX, currentX);
            const boxTop = Math.min(startY, currentY);
            const boxWidth = Math.abs(currentX - startX);
            const boxHeight = Math.abs(currentY - startY);

            this.marqueeBox.style.left = `${boxLeft}px`;
            this.marqueeBox.style.top = `${boxTop}px`;
            this.marqueeBox.style.width = `${boxWidth}px`;
            this.marqueeBox.style.height = `${boxHeight}px`;

            const ppb = this.project.zoom.pixelsPerBeat;
            const boxStartBeat = boxLeft / ppb;
            const boxEndBeat = (boxLeft + boxWidth) / ppb;

            let currentTrackTop = 0;
            this.project.tracks.forEach(tr => {
                const trackBottom = currentTrackTop + tr.height;
                if (boxTop + boxHeight >= currentTrackTop && boxTop <= trackBottom) {
                    tr.clips.forEach(c => {
                        const clipEnd = c.startBeat + c.durationBeats;
                        if (clipEnd >= boxStartBeat && c.startBeat <= boxEndBeat) {
                            this.project.selectedClipIds.add(c.id);
                        }
                    });
                }
                currentTrackTop = trackBottom;
            });

            this.renderClips();
        };

        const onMouseUp = () => {
            this.marqueeBox.style.display = 'none';
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    selectAllClips() {
        this.project.selectedClipIds.clear();
        this.project.tracks.forEach(tr => {
            tr.clips.forEach(c => this.project.selectedClipIds.add(c.id));
        });
        this.renderClips();
    }

    // -------------------------------------------------------------
    // CONTEXT MENUS & COLOR PICKER
    // -------------------------------------------------------------
    _showClipContextMenu(x, y, clip, track) {
        this._closeContextMenu();

        const menu = document.createElement('div');
        menu.className = 'daw-context-menu';
        menu.style.left = `${Math.min(window.innerWidth - 180, x)}px`;
        menu.style.top = `${Math.min(window.innerHeight - 200, y)}px`;

        menu.innerHTML = `
            <div class="ctx-item" data-action="dup">⎘ Duplicate (Ctrl+D)</div>
            <div class="ctx-item" data-action="split">✂ Split at Playhead (S)</div>
            <div class="ctx-item" data-action="loop">🔁 Set Loop to Clip</div>
            <div class="ctx-divider"></div>
            <div class="ctx-item" data-action="rename">✏ Rename Clip</div>
            <div class="ctx-item" data-action="color">🎨 Change Color</div>
            <div class="ctx-divider"></div>
            <div class="ctx-item ctx-danger" data-action="del">🗑️ Delete Clip (Del)</div>
        `;

        menu.querySelectorAll('.ctx-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = item.dataset.action;
                this._closeContextMenu();

                if (action === 'dup') {
                    track.duplicateClip(clip.id);
                    this.renderClips();
                } else if (action === 'split') {
                    const playheadBeat = this.engine.secondsToBeats(this.engine.playheadPosition);
                    this.project.splitClipAtBeat(clip.id, playheadBeat);
                } else if (action === 'loop') {
                    this.project.loop.startBeat = clip.startBeat;
                    this.project.loop.endBeat = clip.startBeat + clip.durationBeats;
                    this.engine.setLoop(true, this.project.loop.startBeat, this.project.loop.endBeat);
                    this.updateLoopRegion();
                } else if (action === 'rename') {
                    const newName = prompt('Enter new clip name:', clip.name);
                    if (newName) {
                        clip.name = newName;
                        this.renderClips();
                    }
                } else if (action === 'color') {
                    this._showColorPicker(x, y, (color) => {
                        clip.color = color;
                        this.renderClips();
                    });
                } else if (action === 'del') {
                    track.removeClip(clip.id);
                    this.project.selectedClipIds.delete(clip.id);
                    this.renderClips();
                }
            });
        });

        document.body.appendChild(menu);
        this._contextMenuEl = menu;
    }

    _showTrackContextMenu(x, y, track) {
        this._closeContextMenu();

        const menu = document.createElement('div');
        menu.className = 'daw-context-menu';
        menu.style.left = `${Math.min(window.innerWidth - 180, x)}px`;
        menu.style.top = `${Math.min(window.innerHeight - 200, y)}px`;

        menu.innerHTML = `
            <div class="ctx-item" data-action="dup">⎘ Duplicate Track</div>
            <div class="ctx-item" data-action="color">🎨 Track Color</div>
            <div class="ctx-divider"></div>
            <div class="ctx-item ctx-danger" data-action="del">🗑️ Delete Track</div>
        `;

        menu.querySelectorAll('.ctx-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = item.dataset.action;
                this._closeContextMenu();

                if (action === 'dup') {
                    const dup = this.project.duplicateTrack(track.id);
                    if (dup) this.engine.registerTrack(dup);
                } else if (action === 'color') {
                    this._showColorPicker(x, y, (color) => {
                        track.color = color;
                        track.clips.forEach(c => c.color = color);
                        this.renderTracks();
                    });
                } else if (action === 'del') {
                    this.project.removeTrack(track.id);
                    this.engine.unregisterTrack(track.id);
                }
            });
        });

        document.body.appendChild(menu);
        this._contextMenuEl = menu;
    }

    _showLaneContextMenu(x, y, track, origEvent) {
        this._closeContextMenu();

        const rect = this.arrangementViewport.getBoundingClientRect();
        const clickX = origEvent.clientX - rect.left + this.scrollLeft;
        const clickBeat = this.project.snapBeat(clickX / this.project.zoom.pixelsPerBeat);

        const menu = document.createElement('div');
        menu.className = 'daw-context-menu';
        menu.style.left = `${Math.min(window.innerWidth - 180, x)}px`;
        menu.style.top = `${Math.min(window.innerHeight - 200, y)}px`;

        let actionHtml = '';
        if (track.type === 'synth') {
            actionHtml = `<div class="ctx-item" data-action="add_synth">🎹 Insert 4-Bar MIDI Clip</div>`;
        } else if (track.type === 'drum') {
            actionHtml = `<div class="ctx-item" data-action="add_drum">🥁 Insert 4-Bar Drum Pattern</div>`;
        } else {
            actionHtml = `<div class="ctx-item" data-action="add_audio">🎵 Insert Audio Placeholder</div>`;
        }

        menu.innerHTML = `
            ${actionHtml}
            <div class="ctx-item" data-action="seek">▶ Move Playhead Here</div>
        `;

        menu.querySelectorAll('.ctx-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = item.dataset.action;
                this._closeContextMenu();

                if (action === 'add_synth') {
                    track.addClip(new MidiClip({ name: 'MIDI Pattern', startBeat: clickBeat, durationBeats: 8, color: track.color }));
                    this.renderClips();
                } else if (action === 'add_drum') {
                    track.addClip(new PatternClip({ name: 'Drum Pattern', startBeat: clickBeat, durationBeats: 8, color: track.color }));
                    this.renderClips();
                } else if (action === 'add_audio') {
                    const synthBuf = this.engine.sampleLibrary['fx_vinyl']?.buffer;
                    track.addClip(new AudioClip({ name: 'Audio Clip', startBeat: clickBeat, durationBeats: 8, audioBuffer: synthBuf, color: track.color }));
                    this.renderClips();
                } else if (action === 'seek') {
                    this.engine.seek(this.engine.beatsToSeconds(clickBeat), this.project);
                }
            });
        });

        document.body.appendChild(menu);
        this._contextMenuEl = menu;
    }

    _showColorPicker(x, y, onSelect) {
        this._closeContextMenu();

        const picker = document.createElement('div');
        picker.className = 'daw-color-picker';
        picker.style.left = `${Math.min(window.innerWidth - 160, x)}px`;
        picker.style.top = `${Math.min(window.innerHeight - 120, y)}px`;

        picker.innerHTML = this.paletteColors.map(c => `
            <div class="color-swatch" style="background-color: ${c};" data-color="${c}"></div>
        `).join('');

        picker.querySelectorAll('.color-swatch').forEach(sw => {
            sw.addEventListener('click', (e) => {
                e.stopPropagation();
                const color = sw.dataset.color;
                this._closeContextMenu();
                onSelect(color);
            });
        });

        document.body.appendChild(picker);
        this._contextMenuEl = picker;
    }

    _closeContextMenu() {
        if (this._contextMenuEl) {
            this._contextMenuEl.remove();
            this._contextMenuEl = null;
        }
    }

    // -------------------------------------------------------------
    // DRAG AND DROP HANDLING
    // -------------------------------------------------------------
    _bindTimelineDropEvents() {
        const viewport = this.arrangementViewport;

        viewport.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        viewport.addEventListener('drop', async (e) => {
            e.preventDefault();
            const rawData = e.dataTransfer.getData('text/plain');
            if (!rawData) return;

            try {
                const data = JSON.parse(rawData);
                if (data.type === 'sample' && data.sampleKey) {
                    const rect = viewport.getBoundingClientRect();
                    const dropX = e.clientX - rect.left + this.scrollLeft;
                    const dropY = e.clientY - rect.top + this.scrollTop;

                    const ppb = this.project.zoom.pixelsPerBeat;
                    const dropBeat = this.project.snapBeat(dropX / ppb);

                    // Find track at Y position
                    let currentY = 0;
                    let targetTrack = null;
                    for (const tr of this.project.tracks) {
                        if (dropY >= currentY && dropY <= currentY + tr.height) {
                            targetTrack = tr;
                            break;
                        }
                        currentY += tr.height;
                    }

                    if (!targetTrack || targetTrack.type !== 'audio') {
                        targetTrack = this.project.addTrack('audio', data.name);
                        this.engine.registerTrack(targetTrack);
                    }

                    const sample = this.engine.sampleLibrary[data.sampleKey] || (window.audiodeck?.browserView?.userSamples[data.sampleKey]);
                    const buf = sample?.buffer;
                    const beatSec = 60 / this.project.bpm;
                    const durBeats = buf ? Math.max(1, Math.round((buf.duration / beatSec) * 4) / 4) : 4;

                    const clip = targetTrack.addClip(new AudioClip({
                        name: data.name,
                        startBeat: dropBeat,
                        durationBeats: durBeats,
                        sampleKey: data.sampleKey,
                        audioBuffer: buf,
                        color: targetTrack.color
                    }));

                    this.renderClips();
                    this.project.notify('clip_added', { track: targetTrack, clip });
                }
            } catch (err) {
                // Ignore non-json drag drop
            }
        });
    }

    // -------------------------------------------------------------
    // PLAYHEAD TRACKING
    // -------------------------------------------------------------
    _startPlayheadAnimation() {
        const updatePlayhead = () => {
            if (this.playheadEl) {
                const ppb = this.project.zoom.pixelsPerBeat;
                const currentBeats = this.engine.secondsToBeats(this.engine.playheadPosition);
                const x = currentBeats * ppb;
                this.playheadEl.style.transform = `translateX(${x}px)`;

                if (this.engine.isPlaying) {
                    const viewportWidth = this.arrangementViewport.clientWidth;
                    const viewLeft = this.arrangementViewport.scrollLeft;
                    const viewRight = viewLeft + viewportWidth;

                    if (x > viewRight - 80) {
                        this.arrangementViewport.scrollLeft = x - 100;
                    }
                }
            }
            requestAnimationFrame(updatePlayhead);
        };
        requestAnimationFrame(updatePlayhead);
    }
}
