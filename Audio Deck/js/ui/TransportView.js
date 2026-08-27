/**
 * AudioDeck - TransportView
 * Manages top transport bar, playback buttons, tempo, tap tempo, time displays,
 * edit tools, snap options, DSP status, and master volume/meters.
 */
export class TransportView {
    /**
     * @param {HTMLElement} container 
     * @param {AudioEngine} audioEngine 
     * @param {Project} project 
     * @param {Object} actions Callbacks for modals & actions
     */
    constructor(container, audioEngine, project, actions = {}) {
        this.container = container;
        this.engine = audioEngine;
        this.project = project;
        this.actions = actions;

        this.timeDisplayMode = 'bars'; // 'bars' or 'time'
        this.tapTimes = [];

        this._render();
        this._bindEvents();
        this._setupEngineListeners();
    }

    _render() {
        this.container.innerHTML = `
            <div class="transport-bar">
                <!-- Left: Project Name & File Operations -->
                <div class="transport-section transport-project">
                    <div class="app-logo" title="AudioDeck Pro DAW">
                        <span class="logo-icon">🎛️</span>
                        <span class="logo-text">AUDIODECK</span>
                    </div>
                    <div class="project-title-box">
                        <input type="text" class="project-name-input" value="${this.project.name}" title="Click to rename project" />
                    </div>
                    <div class="transport-btn-group">
                        <button class="transport-btn" id="btnNewProject" title="New Session / Template">
                            <span class="btn-icon">📄</span>
                        </button>
                        <button class="transport-btn" id="btnOpenProject" title="Open Session">
                            <span class="btn-icon">📂</span>
                        </button>
                        <button class="transport-btn" id="btnSaveProject" title="Save Session (Ctrl+S)">
                            <span class="btn-icon">💾</span>
                        </button>
                        <button class="transport-btn btn-export-highlight" id="btnExportWav" title="Render Master Audio (Ctrl+E)">
                            <span class="btn-icon">⚡</span> Export WAV
                        </button>
                    </div>
                </div>

                <!-- Center: Transport Playback Controls -->
                <div class="transport-section transport-controls">
                    <!-- Undo / Redo -->
                    <div class="transport-btn-group">
                        <button class="transport-btn" id="btnUndo" title="Undo (Ctrl+Z)">⟲</button>
                        <button class="transport-btn" id="btnRedo" title="Redo (Ctrl+Y)">⟳</button>
                    </div>

                    <!-- Play / Pause / Stop / Rec -->
                    <div class="transport-playback-cluster">
                        <button class="transport-play-btn" id="btnPlay" title="Play / Pause (Space)">
                            <span class="play-icon">▶</span>
                        </button>
                        <button class="transport-btn" id="btnStop" title="Stop & Return to Start (Enter)">
                            <span class="btn-icon">■</span>
                        </button>
                        <button class="transport-btn transport-rec-btn" id="btnRecord" title="Record Microphone to Track">
                            <span class="rec-dot"></span>
                        </button>
                        <button class="transport-btn ${this.project.loop.enabled ? 'active' : ''}" id="btnLoop" title="Toggle Loop Region (L)">
                            <span class="btn-icon">🔁</span>
                        </button>
                        <button class="transport-btn" id="btnMetronome" title="Metronome Click">
                            <span class="btn-icon">⏱️</span>
                        </button>
                    </div>

                    <!-- Time & Position Display -->
                    <div class="transport-time-display" id="timeDisplay" title="Click to toggle Bar:Beat vs Time (MM:SS)">
                        <div class="time-primary" id="timeDisplayPrimary">001.01.01</div>
                        <div class="time-secondary" id="timeDisplaySecondary">00:00.000</div>
                    </div>

                    <!-- Tempo & Meter Controls -->
                    <div class="transport-tempo-box">
                        <div class="tempo-input-wrapper">
                            <label>BPM</label>
                            <input type="number" id="inputBPM" min="30" max="300" value="${this.project.bpm}" title="Project Tempo" />
                        </div>
                        <button class="transport-tap-btn" id="btnTapTempo" title="Tap tempo rhythmically">TAP</button>
                        <div class="signature-box" title="Time Signature">
                            <span class="signature-text">${this.project.timeSignature[0]}/${this.project.timeSignature[1]}</span>
                        </div>
                    </div>
                </div>

                <!-- Right: Tools, Snapping, DSP status & Master Meter -->
                <div class="transport-section transport-tools">
                    <!-- Tool Selectors -->
                    <div class="transport-tools-group">
                        <button class="tool-btn ${this.project.activeTool === 'pointer' ? 'active' : ''}" data-tool="pointer" title="Pointer Tool (1)">↖</button>
                        <button class="tool-btn ${this.project.activeTool === 'pencil' ? 'active' : ''}" data-tool="pencil" title="Pencil / Draw Tool (2)">✏</button>
                        <button class="tool-btn ${this.project.activeTool === 'scissors' ? 'active' : ''}" data-tool="scissors" title="Scissors / Split Tool (3)">✂</button>
                        <button class="tool-btn ${this.project.activeTool === 'eraser' ? 'active' : ''}" data-tool="eraser" title="Eraser Tool (4)">⌫</button>
                    </div>

                    <!-- Snapping Dropdown -->
                    <div class="transport-snap-box">
                        <label>SNAP</label>
                        <select id="selectSnap" class="snap-select" title="Grid Snapping Division">
                            <option value="1/1" ${this.project.snap === '1/1' ? 'selected' : ''}>1 Bar</option>
                            <option value="1/2" ${this.project.snap === '1/2' ? 'selected' : ''}>1/2</option>
                            <option value="1/4" ${this.project.snap === '1/4' ? 'selected' : ''}>1/4</option>
                            <option value="1/8" ${this.project.snap === '1/8' ? 'selected' : ''}>1/8</option>
                            <option value="1/16" ${this.project.snap === '1/16' ? 'selected' : ''}>1/16</option>
                            <option value="1/32" ${this.project.snap === '1/32' ? 'selected' : ''}>1/32</option>
                            <option value="off" ${this.project.snap === 'off' ? 'selected' : ''}>Off</option>
                        </select>
                    </div>

                    <!-- DSP Status Tag -->
                    <div class="dsp-status-badge" title="Web Audio DSP Engine Active">
                        <span class="dsp-dot"></span>
                        <span class="dsp-text">44.1k</span>
                    </div>

                    <!-- Master Volume & Meter -->
                    <div class="transport-master-meter-box" title="Master Output Volume (Double click to reset)">
                        <label>MASTER</label>
                        <input type="range" id="sliderMasterVol" min="0" max="1.5" step="0.01" value="${this.project.masterVolume}" />
                        <div class="master-led-meter">
                            <div class="master-meter-fill" id="masterMeterL"></div>
                            <div class="master-meter-fill" id="masterMeterR"></div>
                        </div>
                    </div>

                    <!-- Help / Shortcuts -->
                    <button class="transport-btn" id="btnShortcuts" title="Keyboard Shortcuts Cheat Sheet (?)">
                        <span class="btn-icon">❓</span>
                    </button>
                </div>
            </div>
        `;

        this.btnPlay = this.container.querySelector('#btnPlay');
        this.btnStop = this.container.querySelector('#btnStop');
        this.btnRecord = this.container.querySelector('#btnRecord');
        this.btnLoop = this.container.querySelector('#btnLoop');
        this.btnMetronome = this.container.querySelector('#btnMetronome');
        this.timePrimary = this.container.querySelector('#timeDisplayPrimary');
        this.timeSecondary = this.container.querySelector('#timeDisplaySecondary');
        this.inputBPM = this.container.querySelector('#inputBPM');
        this.btnTapTempo = this.container.querySelector('#btnTapTempo');
        this.selectSnap = this.container.querySelector('#selectSnap');
        this.sliderMasterVol = this.container.querySelector('#sliderMasterVol');
        this.masterMeterL = this.container.querySelector('#masterMeterL');
        this.masterMeterR = this.container.querySelector('#masterMeterR');
        this.projectNameInput = this.container.querySelector('.project-name-input');
    }

    _bindEvents() {
        // Project Name
        this.projectNameInput.addEventListener('change', (e) => {
            this.project.name = e.target.value || 'Untitled Session';
            this.project.notify('project_renamed');
        });

        // Project File Operations
        this.container.querySelector('#btnNewProject').addEventListener('click', () => {
            if (this.actions.onNewProject) this.actions.onNewProject();
        });
        this.container.querySelector('#btnOpenProject').addEventListener('click', () => {
            if (this.actions.onOpenProject) this.actions.onOpenProject();
        });
        this.container.querySelector('#btnSaveProject').addEventListener('click', () => {
            if (this.actions.onSaveProject) this.actions.onSaveProject();
        });
        this.container.querySelector('#btnExportWav').addEventListener('click', () => {
            if (this.actions.onExportWav) this.actions.onExportWav();
        });
        this.container.querySelector('#btnShortcuts').addEventListener('click', () => {
            if (this.actions.onShortcuts) this.actions.onShortcuts();
        });

        // Undo / Redo
        this.container.querySelector('#btnUndo').addEventListener('click', () => {
            this.project.history.undo();
        });
        this.container.querySelector('#btnRedo').addEventListener('click', () => {
            this.project.history.redo();
        });

        // Playback Buttons
        this.btnPlay.addEventListener('click', async () => {
            if (this.engine.isPlaying) {
                this.engine.pause();
            } else {
                await this.engine.play(this.project);
            }
        });

        this.btnStop.addEventListener('click', () => {
            this.engine.stop();
        });

        this.btnRecord.addEventListener('click', async () => {
            if (this.engine.isRecording) {
                const result = await this.engine.stopRecording();
                if (result && result.audioBuffer) {
                    if (this.actions.onRecordingFinished) {
                        this.actions.onRecordingFinished(result);
                    }
                }
            } else {
                const targetTrack = this.project.getTrack(this.project.activeTrackId) || this.project.tracks.find(t => t.type === 'audio');
                const trackId = targetTrack ? targetTrack.id : null;
                const ok = await this.engine.startRecording(trackId);
                if (ok && !this.engine.isPlaying) {
                    this.engine.play(this.project);
                }
            }
        });

        this.btnLoop.addEventListener('click', () => {
            this.project.loop.enabled = !this.project.loop.enabled;
            this.engine.setLoop(this.project.loop.enabled, this.project.loop.startBeat, this.project.loop.endBeat);
            this.btnLoop.classList.toggle('active', this.project.loop.enabled);
            this.project.notify('loop_changed');
        });

        this.btnMetronome.addEventListener('click', () => {
            this.engine.metronomeEnabled = !this.engine.metronomeEnabled;
            this.btnMetronome.classList.toggle('active', this.engine.metronomeEnabled);
        });

        // Toggle Time Format
        this.container.querySelector('#timeDisplay').addEventListener('click', () => {
            this.timeDisplayMode = this.timeDisplayMode === 'bars' ? 'time' : 'bars';
        });

        // BPM Input
        this.inputBPM.addEventListener('change', (e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val)) {
                this.project.bpm = Math.max(30, Math.min(300, val));
                this.engine.setBPM(this.project.bpm);
                this.project.notify('tempo_changed');
            }
        });

        // Tap Tempo
        this.btnTapTempo.addEventListener('click', () => {
            const now = Date.now();
            if (this.tapTimes.length > 0 && now - this.tapTimes[this.tapTimes.length - 1] > 2500) {
                this.tapTimes = [];
            }
            this.tapTimes.push(now);
            if (this.tapTimes.length > 4) this.tapTimes.shift();

            if (this.tapTimes.length >= 2) {
                let intervalsSum = 0;
                for (let i = 1; i < this.tapTimes.length; i++) {
                    intervalsSum += (this.tapTimes[i] - this.tapTimes[i - 1]);
                }
                const avgIntervalMs = intervalsSum / (this.tapTimes.length - 1);
                const calcBPM = Math.round(60000 / avgIntervalMs);
                if (calcBPM >= 30 && calcBPM <= 300) {
                    this.project.bpm = calcBPM;
                    this.inputBPM.value = calcBPM;
                    this.engine.setBPM(calcBPM);
                    this.project.notify('tempo_changed');
                }
            }
        });

        // Tool Buttons
        this.container.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tool = e.currentTarget.getAttribute('data-tool');
                this.project.activeTool = tool;
                this.container.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.project.notify('tool_changed', { tool });
            });
        });

        // Snap
        this.selectSnap.addEventListener('change', (e) => {
            this.project.snap = e.target.value;
            this.project.notify('snap_changed', { snap: this.project.snap });
        });

        // Master Volume
        this.sliderMasterVol.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            this.project.masterVolume = val;
            if (this.engine.masterEffects) {
                this.engine.masterEffects.setGain(val);
            }
        });

        this.sliderMasterVol.addEventListener('dblclick', () => {
            this.sliderMasterVol.value = 1.0;
            this.project.masterVolume = 1.0;
            if (this.engine.masterEffects) {
                this.engine.masterEffects.setGain(1.0);
            }
        });
    }

    _setupEngineListeners() {
        this.engine.onStateChange = ({ isPlaying, isRecording }) => {
            if (this.btnPlay) {
                const icon = this.btnPlay.querySelector('.play-icon');
                if (icon) icon.textContent = isPlaying ? '⏸' : '▶';
                this.btnPlay.classList.toggle('playing', isPlaying);
            }
            if (this.btnRecord) {
                this.btnRecord.classList.toggle('active', isRecording);
            }
        };

        this.engine.onPlayheadUpdate = (seconds, beats) => {
            this._updateTimeDisplay(seconds, beats);
        };

        this.engine.onMasterLevelUpdate = (levels) => {
            if (this.masterMeterL && this.masterMeterR) {
                const pct = Math.min(100, Math.round(levels.peak * 100));
                this.masterMeterL.style.height = `${pct}%`;
                this.masterMeterR.style.height = `${pct}%`;
                if (levels.clipping) {
                    this.masterMeterL.classList.add('clipping');
                    this.masterMeterR.classList.add('clipping');
                } else {
                    this.masterMeterL.classList.remove('clipping');
                    this.masterMeterR.classList.remove('clipping');
                }
            }
        };
    }

    _updateTimeDisplay(seconds, beats) {
        if (!this.timePrimary || !this.timeSecondary) return;

        const bar = Math.floor(beats / 4) + 1;
        const beatInBar = Math.floor(beats % 4) + 1;
        const sixteenth = Math.floor((beats % 1) * 4) + 1;
        const barStr = `${String(bar).padStart(3, '0')}.${String(beatInBar).padStart(2, '0')}.${String(sixteenth).padStart(2, '0')}`;

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 1000);
        const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;

        if (this.timeDisplayMode === 'bars') {
            this.timePrimary.textContent = barStr;
            this.timeSecondary.textContent = timeStr;
        } else {
            this.timePrimary.textContent = timeStr;
            this.timeSecondary.textContent = barStr;
        }
    }

    updateUI() {
        if (this.projectNameInput) this.projectNameInput.value = this.project.name;
        if (this.inputBPM) this.inputBPM.value = this.project.bpm;
        if (this.btnLoop) this.btnLoop.classList.toggle('active', this.project.loop.enabled);
        if (this.selectSnap) this.selectSnap.value = this.project.snap;
        if (this.sliderMasterVol) this.sliderMasterVol.value = this.project.masterVolume;
    }
}
