/**
 * AudioDeck - PianoRollView
 * Interactive MIDI Piano Roll note editor with vertical keyboard audition,
 * note grid canvas, velocity lane editor, quantize, and transposition.
 */
import { SynthEngine } from '../engine/SynthEngine.js';

export class PianoRollView {
    /**
     * @param {HTMLElement} container 
     * @param {AudioEngine} audioEngine 
     * @param {Project} project 
     */
    constructor(container, audioEngine, project) {
        this.container = container;
        this.engine = audioEngine;
        this.project = project;

        this.minPitch = 24; // C1
        this.maxPitch = 84; // C6
        this.numKeys = this.maxPitch - this.minPitch + 1; // 61 keys
        this.keyHeight = 18; // pixels per semitone
        this.pixelsPerBeat = 60; // horizontal zoom in piano roll
        this.clip = null; // active MidiClip

        this.scrollLeft = 0;
        this.scrollTop = (this.maxPitch - 60) * this.keyHeight; // scroll to C4 default

        this.selectedNoteIds = new Set();
        this.activeTool = 'pen'; // 'pen', 'pointer', 'eraser'
        this.lastNoteDuration = 1.0; // default duration

        this._render();
        this._bindEvents();
    }

    setClip(clip) {
        this.clip = clip;
        this.selectedNoteIds.clear();
        this.renderAll();
    }

    _render() {
        this.container.innerHTML = `
            <div class="pianoroll-container">
                <!-- Top Toolbar -->
                <div class="pianoroll-toolbar">
                    <div class="toolbar-left">
                        <span class="pianoroll-title" id="prClipTitle">Piano Roll</span>
                        <div class="pianoroll-tools">
                            <button class="pr-tool-btn ${this.activeTool === 'pen' ? 'active' : ''}" data-tool="pen" title="Draw Notes (P)">✏ Pen</button>
                            <button class="pr-tool-btn ${this.activeTool === 'pointer' ? 'active' : ''}" data-tool="pointer" title="Select / Move Notes (V)">↖ Select</button>
                            <button class="pr-tool-btn ${this.activeTool === 'eraser' ? 'active' : ''}" data-tool="eraser" title="Erase Notes (E)">⌫ Erase</button>
                        </div>
                    </div>

                    <div class="toolbar-right">
                        <button class="pr-action-btn" id="btnQuantize" title="Quantize Notes to Grid (Q)">Quantize</button>
                        <div class="pr-transpose-group">
                            <button class="pr-action-btn" id="btnOctDown" title="Octave Down (-12)">-12</button>
                            <button class="pr-action-btn" id="btnSemiDown" title="Semitone Down (-1)">-1</button>
                            <button class="pr-action-btn" id="btnSemiUp" title="Semitone Up (+1)">+1</button>
                            <button class="pr-action-btn" id="btnOctUp" title="Octave Up (+12)">+12</button>
                        </div>
                        <button class="pr-action-btn btn-clear-notes" id="btnClearNotes" title="Clear all notes in clip">Clear</button>
                    </div>
                </div>

                <!-- Main Work Area (Keys + Grid + Velocity) -->
                <div class="pianoroll-workspace" id="prWorkspace">
                    <!-- Left: Piano Keyboard Keys -->
                    <div class="pianoroll-keyboard-viewport" id="prKeyboardViewport">
                        <div class="pianoroll-keyboard" id="prKeyboard"></div>
                    </div>

                    <!-- Right: Note Grid Canvas & Notes Overlay -->
                    <div class="pianoroll-grid-viewport" id="prGridViewport">
                        <div class="pianoroll-grid-content" id="prGridContent">
                            <canvas class="pianoroll-grid-canvas" id="prGridCanvas"></canvas>
                            <div class="pianoroll-notes-layer" id="prNotesLayer"></div>
                        </div>
                    </div>
                </div>

                <!-- Bottom: Velocity Editor Lane -->
                <div class="pianoroll-velocity-lane" id="prVelocityLane">
                    <div class="velocity-label">VELOCITY</div>
                    <div class="velocity-viewport" id="prVelocityViewport">
                        <div class="velocity-content" id="prVelocityContent">
                            <canvas class="velocity-canvas" id="prVelocityCanvas"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.keyboardEl = this.container.querySelector('#prKeyboard');
        this.keyboardViewport = this.container.querySelector('#prKeyboardViewport');
        this.gridViewport = this.container.querySelector('#prGridViewport');
        this.gridContent = this.container.querySelector('#prGridContent');
        this.gridCanvas = this.container.querySelector('#prGridCanvas');
        this.notesLayer = this.container.querySelector('#prNotesLayer');
        this.velocityViewport = this.container.querySelector('#prVelocityViewport');
        this.velocityContent = this.container.querySelector('#prVelocityContent');
        this.velocityCanvas = this.container.querySelector('#prVelocityCanvas');
        this.clipTitle = this.container.querySelector('#prClipTitle');

        this.renderKeyboard();
    }

    _bindEvents() {
        // Tool Buttons
        this.container.querySelectorAll('.pr-tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.activeTool = e.currentTarget.dataset.tool;
                this.container.querySelectorAll('.pr-tool-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // Quantize
        this.container.querySelector('#btnQuantize').addEventListener('click', () => {
            this.quantizeNotes();
        });

        // Transposition
        this.container.querySelector('#btnOctDown').addEventListener('click', () => this.transposeNotes(-12));
        this.container.querySelector('#btnOctUp').addEventListener('click', () => this.transposeNotes(12));
        this.container.querySelector('#btnSemiDown').addEventListener('click', () => this.transposeNotes(-1));
        this.container.querySelector('#btnSemiUp').addEventListener('click', () => this.transposeNotes(1));

        // Clear
        this.container.querySelector('#btnClearNotes').addEventListener('click', () => {
            if (this.clip) {
                this.project.history.pushState('Clear Piano Roll');
                this.clip.notes = [];
                this.selectedNoteIds.clear();
                this.renderAll();
                this.project.notify('clip_updated', { clip: this.clip });
            }
        });

        // Synchronize Scroll between Keyboard, Grid, and Velocity Lane
        this.gridViewport.addEventListener('scroll', () => {
            this.scrollLeft = this.gridViewport.scrollLeft;
            this.scrollTop = this.gridViewport.scrollTop;
            this.keyboardViewport.scrollTop = this.scrollTop;
            this.velocityViewport.scrollLeft = this.scrollLeft;
        });

        // Grid Mouse Events for Note Creation, Moving, Resizing
        this._bindGridMouseEvents();

        // Velocity Lane Interaction
        this._bindVelocityEvents();

        // Keyboard arrow keys transposition
        window.addEventListener('keydown', (e) => {
            if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) return;
            if (this.project.activeBottomTab !== 'pianoroll') return;

            if (this.selectedNoteIds.size > 0) {
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.transposeNotes(e.shiftKey ? 12 : 1);
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.transposeNotes(e.shiftKey ? -12 : -1);
                } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
                    e.preventDefault();
                    this.selectAllNotes();
                }
            }
        });
    }

    selectAllNotes() {
        if (!this.clip || !this.clip.notes) return;
        this.selectedNoteIds.clear();
        this.clip.notes.forEach(n => this.selectedNoteIds.add(n.id));
        this.renderNotes();
        this.drawVelocityCanvas();
    }

    renderKeyboard() {
        this.keyboardEl.innerHTML = '';
        const totalHeight = this.numKeys * this.keyHeight;
        this.keyboardEl.style.height = `${totalHeight}px`;

        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        for (let p = this.maxPitch; p >= this.minPitch; p--) {
            const key = document.createElement('div');
            const noteIdx = p % 12;
            const octave = Math.floor(p / 12) - 1;
            const isBlack = [1, 3, 6, 8, 10].includes(noteIdx);

            key.className = `piano-key ${isBlack ? 'black-key' : 'white-key'} ${noteIdx === 0 ? 'c-key' : ''}`;
            key.style.height = `${this.keyHeight}px`;
            key.dataset.pitch = p;
            key.title = `${noteNames[noteIdx]}${octave} (${p})`;

            if (noteIdx === 0) {
                key.innerHTML = `<span class="key-label">C${octave}</span>`;
            } else if (!isBlack) {
                key.innerHTML = `<span class="key-label-sub">${noteNames[noteIdx]}</span>`;
            }

            key.addEventListener('mousedown', () => {
                key.classList.add('pressed');
                this._auditionPitch(p);
            });

            const releaseKey = () => {
                key.classList.remove('pressed');
                this._releasePitch(p);
            };

            key.addEventListener('mouseup', releaseKey);
            key.addEventListener('mouseleave', releaseKey);

            this.keyboardEl.appendChild(key);
        }
    }

    _auditionPitch(pitch) {
        if (!this.project.activeTrackId) return;
        const eng = this.engine.trackEngines.get(this.project.activeTrackId);
        if (eng && eng.synth) {
            eng.synth.noteOn(pitch, 100);
        }
    }

    _releasePitch(pitch) {
        if (!this.project.activeTrackId) return;
        const eng = this.engine.trackEngines.get(this.project.activeTrackId);
        if (eng && eng.synth) {
            eng.synth.noteOff(pitch);
        }
    }

    renderAll() {
        if (!this.clip) {
            this.clipTitle.textContent = 'Piano Roll (Select a MIDI Clip)';
            this.notesLayer.innerHTML = '';
            this.drawGridCanvas();
            this.drawVelocityCanvas();
            return;
        }

        this.clipTitle.textContent = `Piano Roll: ${this.clip.name}`;

        const totalBeats = Math.max(16, this.clip.durationBeats);
        const totalWidth = totalBeats * this.pixelsPerBeat + 300;
        const totalHeight = this.numKeys * this.keyHeight;

        this.gridContent.style.width = `${totalWidth}px`;
        this.gridContent.style.height = `${totalHeight}px`;
        this.velocityContent.style.width = `${totalWidth}px`;

        this.drawGridCanvas();
        this.renderNotes();
        this.drawVelocityCanvas();
    }

    drawGridCanvas() {
        const canvas = this.gridCanvas;
        if (!canvas) return;

        const w = this.gridContent.clientWidth || 1000;
        const h = this.gridContent.clientHeight || 1000;
        const dpr = window.devicePixelRatio || 1;

        if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
            canvas.width = w * dpr;
            canvas.height = h * dpr;
        }

        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, w, h);

        for (let i = 0; i < this.numKeys; i++) {
            const pitch = this.maxPitch - i;
            const noteIdx = pitch % 12;
            const isBlack = [1, 3, 6, 8, 10].includes(noteIdx);
            const y = i * this.keyHeight;

            ctx.fillStyle = isBlack ? '#14171f' : '#1a1e27';
            ctx.fillRect(0, y, w, this.keyHeight);

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, y + this.keyHeight - 0.5);
            ctx.lineTo(w, y + this.keyHeight - 0.5);
            ctx.stroke();
        }

        const totalBeats = Math.ceil(w / this.pixelsPerBeat);
        for (let b = 0; b <= totalBeats; b++) {
            const x = b * this.pixelsPerBeat;
            const isBar = b % 4 === 0;

            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.strokeStyle = isBar ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.stroke();

            for (let sub = 1; sub < 4; sub++) {
                const subX = x + sub * (this.pixelsPerBeat / 4);
                ctx.beginPath();
                ctx.moveTo(subX, 0);
                ctx.lineTo(subX, h);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
                ctx.stroke();
            }
        }

        ctx.restore();
    }

    renderNotes() {
        this.notesLayer.innerHTML = '';
        if (!this.clip || !this.clip.notes) return;

        this.clip.notes.forEach(note => {
            const noteEl = document.createElement('div');
            const isSelected = this.selectedNoteIds.has(note.id);
            noteEl.className = `piano-roll-note ${isSelected ? 'selected' : ''}`;
            noteEl.dataset.noteId = note.id;

            const left = note.startBeat * this.pixelsPerBeat;
            const width = Math.max(8, note.durationBeats * this.pixelsPerBeat);
            const pitchIndex = this.maxPitch - note.pitch;
            const top = pitchIndex * this.keyHeight;

            noteEl.style.left = `${left}px`;
            noteEl.style.top = `${top}px`;
            noteEl.style.width = `${width}px`;
            noteEl.style.height = `${this.keyHeight - 1}px`;
            noteEl.style.backgroundColor = this.clip.color || '#10b981';

            const velNorm = (note.velocity || 100) / 127;
            noteEl.style.opacity = `${0.65 + velNorm * 0.35}`;

            noteEl.innerHTML = `
                <span class="note-name">${this._pitchToName(note.pitch)}</span>
                <div class="note-resize-handle"></div>
            `;

            this.notesLayer.appendChild(noteEl);
        });
    }

    drawVelocityCanvas() {
        const canvas = this.velocityCanvas;
        if (!canvas) return;

        const w = this.velocityContent.clientWidth || 1000;
        const h = 60;
        const dpr = window.devicePixelRatio || 1;

        if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
            canvas.width = w * dpr;
            canvas.height = h * dpr;
        }

        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, w, h);

        ctx.fillStyle = '#141720';
        ctx.fillRect(0, 0, w, h);

        if (!this.clip || !this.clip.notes) {
            ctx.restore();
            return;
        }

        this.clip.notes.forEach(note => {
            const x = note.startBeat * this.pixelsPerBeat;
            const vel = note.velocity !== undefined ? note.velocity : 100;
            const stalkHeight = (vel / 127) * (h - 10);
            const y = h - stalkHeight;
            const isSelected = this.selectedNoteIds.has(note.id);

            ctx.fillStyle = isSelected ? '#ffffff' : (this.clip.color || '#10b981');
            ctx.fillRect(x + 2, y, 4, stalkHeight);

            ctx.beginPath();
            ctx.arc(x + 4, y, 3, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }

    _bindGridMouseEvents() {
        const gridContent = this.gridContent;

        gridContent.addEventListener('mousedown', (e) => {
            if (!this.clip) return;

            const noteEl = e.target.closest('.piano-roll-note');
            const resizeHandle = e.target.closest('.note-resize-handle');

            if (this.activeTool === 'eraser' || e.button === 2) {
                if (noteEl) {
                    const noteId = noteEl.dataset.noteId;
                    this._deleteNote(noteId);
                }
                return;
            }

            if (resizeHandle && noteEl) {
                e.stopPropagation();
                const noteId = noteEl.dataset.noteId;
                this._startNoteResize(e, noteId);
                return;
            }

            if (noteEl) {
                e.stopPropagation();
                const noteId = noteEl.dataset.noteId;
                if (!e.shiftKey && !this.selectedNoteIds.has(noteId)) {
                    this.selectedNoteIds.clear();
                }
                this.selectedNoteIds.add(noteId);
                this.renderNotes();
                this.drawVelocityCanvas();

                const note = this.clip.notes.find(n => n.id === noteId);
                if (note) this._auditionPitch(note.pitch);

                this._startNoteMove(e, noteId);
                return;
            }

            if (this.activeTool === 'pen' && !noteEl) {
                const rect = gridContent.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;

                const snapVal = this.project.getSnapBeatValue();
                const rawBeat = clickX / this.pixelsPerBeat;
                const startBeat = Math.max(0, Math.floor(rawBeat / snapVal) * snapVal);

                const pitchIdx = Math.floor(clickY / this.keyHeight);
                const pitch = this.maxPitch - pitchIdx;

                if (pitch >= this.minPitch && pitch <= this.maxPitch) {
                    this.project.history.pushState('Add MIDI Note');
                    const newNote = {
                        id: 'note_' + Math.random().toString(36).substr(2, 9),
                        pitch: pitch,
                        startBeat: startBeat,
                        durationBeats: Math.max(snapVal, this.lastNoteDuration),
                        velocity: 100
                    };
                    this.clip.notes.push(newNote);
                    this.selectedNoteIds.clear();
                    this.selectedNoteIds.add(newNote.id);
                    this._auditionPitch(pitch);
                    this.renderNotes();
                    this.drawVelocityCanvas();
                    this.project.notify('clip_updated', { clip: this.clip });

                    this._startNoteResize(e, newNote.id);
                }
            }
        });

        gridContent.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    _startNoteMove(e, primaryNoteId) {
        this.project.history.pushState('Move MIDI Notes');
        const startX = e.clientX;
        const startY = e.clientY;
        const notesInitial = [];

        this.selectedNoteIds.forEach(id => {
            const n = this.clip.notes.find(note => note.id === id);
            if (n) {
                notesInitial.push({ note: n, origStartBeat: n.startBeat, origPitch: n.pitch });
            }
        });

        const snapVal = this.project.getSnapBeatValue();

        const onMouseMove = (ev) => {
            const deltaX = ev.clientX - startX;
            const deltaY = ev.clientY - startY;
            const deltaBeat = deltaX / this.pixelsPerBeat;
            const deltaPitch = -Math.round(deltaY / this.keyHeight);

            notesInitial.forEach(({ note, origStartBeat, origPitch }) => {
                const targetBeat = Math.max(0, Math.round((origStartBeat + deltaBeat) / snapVal) * snapVal);
                const targetPitch = Math.max(this.minPitch, Math.min(this.maxPitch, origPitch + deltaPitch));
                note.startBeat = targetBeat;
                note.pitch = targetPitch;
            });

            this.renderNotes();
            this.drawVelocityCanvas();
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            this.project.notify('clip_updated', { clip: this.clip });
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    _startNoteResize(e, noteId) {
        const note = this.clip.notes.find(n => n.id === noteId);
        if (!note) return;

        const startX = e.clientX;
        const origDur = note.durationBeats;
        const snapVal = this.project.getSnapBeatValue();

        const onMouseMove = (ev) => {
            const deltaX = ev.clientX - startX;
            const deltaBeat = deltaX / this.pixelsPerBeat;
            const newDur = Math.max(snapVal, Math.round((origDur + deltaBeat) / snapVal) * snapVal);
            note.durationBeats = newDur;
            this.lastNoteDuration = newDur;
            this.renderNotes();
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            this.project.notify('clip_updated', { clip: this.clip });
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    _deleteNote(noteId) {
        this.project.history.pushState('Delete MIDI Note');
        const idx = this.clip.notes.findIndex(n => n.id === noteId);
        if (idx !== -1) {
            this.clip.notes.splice(idx, 1);
            this.selectedNoteIds.delete(noteId);
            this.renderNotes();
            this.drawVelocityCanvas();
            this.project.notify('clip_updated', { clip: this.clip });
        }
    }

    _bindVelocityEvents() {
        const canvas = this.velocityCanvas;
        let isDragging = false;

        const updateVelocityFromMouse = (e) => {
            if (!this.clip || !this.clip.notes) return;
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            const h = rect.height;

            const vel = Math.max(1, Math.min(127, Math.round((1 - clickY / h) * 127)));
            const beatAtX = clickX / this.pixelsPerBeat;

            this.clip.notes.forEach(note => {
                if (Math.abs(note.startBeat - beatAtX) < 0.35 || this.selectedNoteIds.has(note.id)) {
                    note.velocity = vel;
                }
            });

            this.drawVelocityCanvas();
            this.renderNotes();
        };

        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            this.project.history.pushState('Edit Note Velocity');
            updateVelocityFromMouse(e);

            const onMouseMove = (ev) => {
                if (isDragging) updateVelocityFromMouse(ev);
            };

            const onMouseUp = () => {
                isDragging = false;
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
                this.project.notify('clip_updated', { clip: this.clip });
            };

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        });
    }

    quantizeNotes() {
        if (!this.clip || !this.clip.notes) return;
        this.project.history.pushState('Quantize Notes');
        const snapVal = this.project.getSnapBeatValue();

        this.clip.notes.forEach(n => {
            if (this.selectedNoteIds.size === 0 || this.selectedNoteIds.has(n.id)) {
                n.startBeat = Math.round(n.startBeat / snapVal) * snapVal;
                n.durationBeats = Math.max(snapVal, Math.round(n.durationBeats / snapVal) * snapVal);
            }
        });

        this.renderAll();
        this.project.notify('clip_updated', { clip: this.clip });
    }

    transposeNotes(semitones) {
        if (!this.clip || !this.clip.notes) return;
        this.project.history.pushState(`Transpose ${semitones} st`);

        this.clip.notes.forEach(n => {
            if (this.selectedNoteIds.size === 0 || this.selectedNoteIds.has(n.id)) {
                n.pitch = Math.max(this.minPitch, Math.min(this.maxPitch, n.pitch + semitones));
            }
        });

        this.renderAll();
        this.project.notify('clip_updated', { clip: this.clip });
    }

    _pitchToName(pitch) {
        const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const note = names[pitch % 12];
        const oct = Math.floor(pitch / 12) - 1;
        return `${note}${oct}`;
    }
}
