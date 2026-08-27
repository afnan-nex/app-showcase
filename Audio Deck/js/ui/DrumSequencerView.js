/**
 * AudioDeck - DrumSequencerView
 * 16/32-step drum sequencer grid with audition pads, velocity steps,
 * per-voice mute/solo, swing/groove, pattern presets, and real-time playback synchronization.
 */
export class DrumSequencerView {
    /**
     * @param {HTMLElement} container 
     * @param {AudioEngine} audioEngine 
     * @param {Project} project 
     */
    constructor(container, audioEngine, project) {
        this.container = container;
        this.engine = audioEngine;
        this.project = project;

        this.clip = null; // active PatternClip
        this.activeStep = -1;

        this.instruments = [
            { id: 'kick', name: 'Kick 808', voiceIndex: 0, color: '#ef4444', mute: false, solo: false },
            { id: 'snare', name: 'Snare Drum', voiceIndex: 1, color: '#f97316', mute: false, solo: false },
            { id: 'hat_closed', name: 'Closed Hat', voiceIndex: 2, color: '#eab308', mute: false, solo: false },
            { id: 'hat_open', name: 'Open Hat', voiceIndex: 3, color: '#84cc16', mute: false, solo: false },
            { id: 'clap', name: 'Studio Clap', voiceIndex: 4, color: '#06b6d4', mute: false, solo: false },
            { id: 'tom', name: 'Analog Tom', voiceIndex: 5, color: '#6366f1', mute: false, solo: false },
            { id: 'rim', name: 'Rimshot Perc', voiceIndex: 6, color: '#a855f7', mute: false, solo: false },
            { id: 'crash', name: 'Crash Cymbal', voiceIndex: 7, color: '#ec4899', mute: false, solo: false }
        ];

        this._render();
        this._bindEvents();
    }

    setClip(clip) {
        this.clip = clip;
        this.renderAll();
    }

    _render() {
        this.container.innerHTML = `
            <div class="drum-sequencer-container">
                <!-- Top Toolbar -->
                <div class="drum-toolbar">
                    <div class="drum-title" id="drumClipTitle">Drum Sequencer (16-Step Grid)</div>
                    <div class="drum-actions">
                        <button class="drum-btn" id="btnFillFour" title="Place Kick on every beat">4-on-the-floor</button>
                        <button class="drum-btn" id="btnFillHats" title="Fill 16th closed hats">Fill 16ths</button>
                        <button class="drum-btn" id="btnFillOffbeats" title="Open hats on offbeats">Offbeat Hats</button>
                        <button class="drum-btn" id="btnRandomizeDrums" title="Generate procedural groove">Randomize</button>
                        <button class="drum-btn btn-clear-drums" id="btnClearDrums" title="Clear all steps">Clear Grid</button>
                    </div>
                </div>

                <!-- Grid Rows Viewport -->
                <div class="drum-grid-viewport" id="drumGridViewport">
                    <div class="drum-grid-rows" id="drumGridRows"></div>
                </div>
            </div>
        `;

        this.gridRows = this.container.querySelector('#drumGridRows');
        this.clipTitle = this.container.querySelector('#drumClipTitle');

        this.renderAll();
    }

    _bindEvents() {
        // Presets & Actions
        this.container.querySelector('#btnFillFour').addEventListener('click', () => {
            if (!this.clip || !this.clip.pattern) return;
            this.project.history.pushState('4-on-the-floor preset');
            const kickRow = this.clip.pattern.tracks.find(t => t.voiceIndex === 0);
            if (kickRow) {
                kickRow.steps = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
            }
            const snareRow = this.clip.pattern.tracks.find(t => t.voiceIndex === 1);
            if (snareRow) {
                snareRow.steps = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
            }
            this.renderAll();
            this.project.notify('clip_updated', { clip: this.clip });
        });

        this.container.querySelector('#btnFillHats').addEventListener('click', () => {
            if (!this.clip || !this.clip.pattern) return;
            this.project.history.pushState('Fill Hats');
            const hatRow = this.clip.pattern.tracks.find(t => t.voiceIndex === 2);
            if (hatRow) {
                hatRow.steps = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            }
            this.renderAll();
            this.project.notify('clip_updated', { clip: this.clip });
        });

        this.container.querySelector('#btnFillOffbeats').addEventListener('click', () => {
            if (!this.clip || !this.clip.pattern) return;
            this.project.history.pushState('Fill Offbeat Hats');
            const hatOpenRow = this.clip.pattern.tracks.find(t => t.voiceIndex === 3);
            if (hatOpenRow) {
                hatOpenRow.steps = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0];
            }
            this.renderAll();
            this.project.notify('clip_updated', { clip: this.clip });
        });

        this.container.querySelector('#btnRandomizeDrums').addEventListener('click', () => {
            if (!this.clip || !this.clip.pattern) return;
            this.project.history.pushState('Randomize Drums');
            this.clip.pattern.tracks.forEach(row => {
                row.steps = row.steps.map(() => Math.random() < 0.28 ? (Math.random() < 0.2 ? 120 : 1) : 0);
            });
            this.renderAll();
            this.project.notify('clip_updated', { clip: this.clip });
        });

        this.container.querySelector('#btnClearDrums').addEventListener('click', () => {
            if (!this.clip || !this.clip.pattern) return;
            this.project.history.pushState('Clear Drum Grid');
            this.clip.pattern.tracks.forEach(row => {
                row.steps = row.steps.map(() => 0);
            });
            this.renderAll();
            this.project.notify('clip_updated', { clip: this.clip });
        });
    }

    renderAll() {
        if (!this.clip || !this.clip.pattern) {
            this.clipTitle.textContent = 'Drum Sequencer (Select a Drum Clip)';
            this.gridRows.innerHTML = '<div class="no-clip-msg">Select or create a Drum Pattern Clip on the arrangement timeline to edit beats.</div>';
            return;
        }

        this.clipTitle.textContent = `Drum Sequencer: ${this.clip.name}`;
        this.gridRows.innerHTML = '';

        const stepsCount = this.clip.pattern.steps || 16;

        this.instruments.forEach(inst => {
            let rowData = this.clip.pattern.tracks.find(t => t.voiceIndex === inst.voiceIndex);
            if (!rowData) {
                rowData = { voiceIndex: inst.voiceIndex, steps: new Array(stepsCount).fill(0) };
                this.clip.pattern.tracks.push(rowData);
            }

            const rowEl = document.createElement('div');
            rowEl.className = 'drum-row';
            rowEl.dataset.voiceIndex = inst.voiceIndex;

            // Pad & Label
            const padEl = document.createElement('button');
            padEl.className = 'drum-pad';
            padEl.style.borderLeftColor = inst.color;
            padEl.title = `Audition ${inst.name}`;
            padEl.innerHTML = `
                <span class="pad-dot" style="background-color: ${inst.color};"></span>
                <span class="pad-name">${inst.name}</span>
            `;

            // Audition drum sound on click
            padEl.addEventListener('click', () => {
                this._auditionDrum(inst.voiceIndex);
            });

            // Row Controls (Mute / Clear row)
            const rowControls = document.createElement('div');
            rowControls.className = 'drum-row-controls';
            rowControls.innerHTML = `
                <button class="row-btn-clear" title="Clear this row">✕</button>
            `;
            rowControls.querySelector('.row-btn-clear').addEventListener('click', (e) => {
                e.stopPropagation();
                rowData.steps = rowData.steps.map(() => 0);
                this.renderAll();
                this.project.notify('clip_updated', { clip: this.clip });
            });

            // Steps Container
            const stepsContainer = document.createElement('div');
            stepsContainer.className = 'drum-steps-container';

            for (let s = 0; s < stepsCount; s++) {
                const stepVal = rowData.steps[s] || 0;
                const isBeatStart = s % 4 === 0;

                const stepBtn = document.createElement('button');
                stepBtn.className = `drum-step-btn ${stepVal > 0 ? 'active' : ''} ${stepVal > 1 ? 'accent' : ''} ${isBeatStart ? 'beat-start' : ''}`;
                stepBtn.dataset.stepIndex = s;
                stepBtn.title = `Step ${s + 1} (Click to toggle, Shift+Click for Accent)`;

                stepBtn.innerHTML = `<span class="step-num">${s + 1}</span>`;

                if (stepVal > 0) {
                    stepBtn.style.backgroundColor = inst.color;
                    stepBtn.style.boxShadow = `0 0 8px ${inst.color}88`;
                }

                // Click to toggle step
                stepBtn.addEventListener('click', (e) => {
                    this.project.history.pushState('Toggle Drum Step');
                    const currentVal = rowData.steps[s] || 0;
                    let newVal = 0;

                    if (currentVal === 0) {
                        newVal = e.shiftKey ? 120 : 1;
                        this._auditionDrum(inst.voiceIndex);
                    } else if (currentVal === 1 && !e.shiftKey) {
                        newVal = 0;
                    } else if (currentVal > 1) {
                        newVal = 0;
                    } else {
                        newVal = 120;
                    }

                    rowData.steps[s] = newVal;
                    stepBtn.classList.toggle('active', newVal > 0);
                    stepBtn.classList.toggle('accent', newVal > 1);

                    if (newVal > 0) {
                        stepBtn.style.backgroundColor = inst.color;
                        stepBtn.style.boxShadow = `0 0 8px ${inst.color}88`;
                    } else {
                        stepBtn.style.backgroundColor = '';
                        stepBtn.style.boxShadow = '';
                    }

                    this.project.notify('clip_updated', { clip: this.clip });
                });

                stepsContainer.appendChild(stepBtn);
            }

            rowEl.appendChild(padEl);
            rowEl.appendChild(rowControls);
            rowEl.appendChild(stepsContainer);
            this.gridRows.appendChild(rowEl);
        });
    }

    _auditionDrum(voiceIndex) {
        if (!this.project.activeTrackId) return;
        const eng = this.engine.trackEngines.get(this.project.activeTrackId);
        if (eng && eng.drum) {
            eng.drum.triggerDrum(voiceIndex, 100);
        }
    }
}
