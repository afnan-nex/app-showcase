/**
 * AudioDeck - InspectorView
 * Modular Track Effects Rack (EQ/Filter, Distortion, Delay, Reverb, Compressor)
 * and Subtractive Synthesizer parameter editor with interactive ADSR and filter curves.
 */
import { KnobControl } from '../utils/KnobControl.js';

export class InspectorView {
    /**
     * @param {HTMLElement} container 
     * @param {AudioEngine} audioEngine 
     * @param {Project} project 
     */
    constructor(container, audioEngine, project) {
        this.container = container;
        this.engine = audioEngine;
        this.project = project;

        this.currentTab = 'effects'; // 'effects' or 'synth'
        this._render();
    }

    update() {
        this.renderAll();
    }

    _render() {
        this.container.innerHTML = `
            <div class="inspector-container">
                <!-- Sub-tabs Header -->
                <div class="inspector-tabs-header">
                    <button class="insp-tab-btn ${this.currentTab === 'effects' ? 'active' : ''}" data-tab="effects">🎛️ Track Effects Rack</button>
                    <button class="insp-tab-btn ${this.currentTab === 'synth' ? 'active' : ''}" data-tab="synth" id="btnSynthTab">🎹 Synth Parameters</button>
                </div>

                <!-- Tab Body Content -->
                <div class="inspector-body" id="inspectorBody"></div>
            </div>
        `;

        this.bodyEl = this.container.querySelector('#inspectorBody');
        this.synthTabBtn = this.container.querySelector('#btnSynthTab');

        // Tab Switching
        this.container.querySelectorAll('.insp-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentTab = e.currentTarget.dataset.tab;
                this.container.querySelectorAll('.insp-tab-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.renderAll();
            });
        });

        this.renderAll();
    }

    renderAll() {
        const track = this.project.getTrack(this.project.activeTrackId);
        if (!track) {
            this.bodyEl.innerHTML = '<div class="no-track-msg">Select a track to inspect effects and synth parameters.</div>';
            return;
        }

        // Hide or show synth tab based on track type
        if (track.type !== 'synth') {
            this.synthTabBtn.style.display = 'none';
            if (this.currentTab === 'synth') this.currentTab = 'effects';
        } else {
            this.synthTabBtn.style.display = 'inline-flex';
        }

        this.container.querySelectorAll('.insp-tab-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.tab === this.currentTab);
        });

        if (this.currentTab === 'effects') {
            this._renderEffectsRack(track);
        } else {
            this._renderSynthEditor(track);
        }
    }

    // -------------------------------------------------------------
    // TRACK EFFECTS RACK
    // -------------------------------------------------------------
    _renderEffectsRack(track) {
        const fx = track.effects;
        const eng = this.engine.trackEngines.get(track.id);

        this.bodyEl.innerHTML = `
            <div class="effects-rack-scroll">
                <!-- 1. DUAL FILTER & EQ -->
                <div class="fx-module-card ${!fx.hpfBypass || !fx.lpfBypass ? 'enabled' : 'bypassed'}">
                    <div class="fx-header">
                        <span class="fx-title">FILTER / EQ</span>
                        <button class="fx-power-btn ${!fx.hpfBypass || !fx.lpfBypass ? 'active' : ''}" id="btnToggleFilter">PWR</button>
                    </div>
                    <div class="fx-content-grid">
                        <div class="fx-knob-col">
                            <span class="knob-title">HP FREQ</span>
                            <div class="knob-hpf"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">LP FREQ</span>
                            <div class="knob-lpf"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">RES / Q</span>
                            <div class="knob-lpf-q"></div>
                        </div>
                        <div class="fx-canvas-box">
                            <canvas class="filter-curve-canvas" id="filterCurveCanvas" width="120" height="60"></canvas>
                        </div>
                    </div>
                </div>

                <!-- 2. DISTORTION / SATURATION -->
                <div class="fx-module-card ${!fx.distortionBypass ? 'enabled' : 'bypassed'}">
                    <div class="fx-header">
                        <span class="fx-title">DISTORTION</span>
                        <button class="fx-power-btn ${!fx.distortionBypass ? 'active' : ''}" id="btnToggleDist">PWR</button>
                    </div>
                    <div class="fx-content-grid">
                        <div class="fx-knob-col">
                            <span class="knob-title">DRIVE</span>
                            <div class="knob-dist-drive"></div>
                        </div>
                        <div class="fx-select-col">
                            <span class="knob-title">TYPE</span>
                            <select id="selectDistType" class="fx-select">
                                <option value="soft" ${fx.distortionType === 'soft' ? 'selected' : ''}>Soft Tube</option>
                                <option value="hard" ${fx.distortionType === 'hard' ? 'selected' : ''}>Hard Clip</option>
                                <option value="fuzz" ${fx.distortionType === 'fuzz' ? 'selected' : ''}>Fuzz Drive</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- 3. STEREO DELAY -->
                <div class="fx-module-card ${!fx.delayBypass ? 'enabled' : 'bypassed'}">
                    <div class="fx-header">
                        <span class="fx-title">STEREO DELAY</span>
                        <button class="fx-power-btn ${!fx.delayBypass ? 'active' : ''}" id="btnToggleDelay">PWR</button>
                    </div>
                    <div class="fx-content-grid">
                        <div class="fx-knob-col">
                            <span class="knob-title">TIME</span>
                            <div class="knob-delay-time"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">FEEDBACK</span>
                            <div class="knob-delay-fb"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">WET MIX</span>
                            <div class="knob-delay-wet"></div>
                        </div>
                    </div>
                </div>

                <!-- 4. REVERB -->
                <div class="fx-module-card ${!fx.reverbBypass ? 'enabled' : 'bypassed'}">
                    <div class="fx-header">
                        <span class="fx-title">REVERB</span>
                        <button class="fx-power-btn ${!fx.reverbBypass ? 'active' : ''}" id="btnToggleReverb">PWR</button>
                    </div>
                    <div class="fx-content-grid">
                        <div class="fx-knob-col">
                            <span class="knob-title">DECAY</span>
                            <div class="knob-reverb-decay"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">WET MIX</span>
                            <div class="knob-reverb-wet"></div>
                        </div>
                    </div>
                </div>

                <!-- 5. COMPRESSOR -->
                <div class="fx-module-card ${!fx.compBypass ? 'enabled' : 'bypassed'}">
                    <div class="fx-header">
                        <span class="fx-title">COMPRESSOR</span>
                        <button class="fx-power-btn ${!fx.compBypass ? 'active' : ''}" id="btnToggleComp">PWR</button>
                    </div>
                    <div class="fx-content-grid">
                        <div class="fx-knob-col">
                            <span class="knob-title">THRESH</span>
                            <div class="knob-comp-thresh"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">RATIO</span>
                            <div class="knob-comp-ratio"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Bind Knobs & Toggles
        // Filter
        this.bodyEl.querySelector('#btnToggleFilter').addEventListener('click', () => {
            fx.hpfBypass = !fx.hpfBypass;
            fx.lpfBypass = fx.hpfBypass;
            if (eng) {
                eng.effects.setHPF(fx.hpfFreq, fx.hpfBypass);
                eng.effects.setLPF(fx.lpfFreq, fx.lpfBypass, fx.lpfQ);
            }
            this._renderEffectsRack(track);
        });

        new KnobControl(this.bodyEl.querySelector('.knob-hpf'), {
            min: 20, max: 2000, value: fx.hpfFreq, defaultValue: 20, step: 10, unit: 'Hz',
            onChange: (val) => {
                fx.hpfFreq = val;
                if (eng) eng.effects.setHPF(val, fx.hpfBypass);
                this._drawFilterCurve(track);
            }
        });

        new KnobControl(this.bodyEl.querySelector('.knob-lpf'), {
            min: 100, max: 20000, value: fx.lpfFreq, defaultValue: 20000, step: 50, unit: 'Hz',
            onChange: (val) => {
                fx.lpfFreq = val;
                if (eng) eng.effects.setLPF(val, fx.lpfBypass, fx.lpfQ);
                this._drawFilterCurve(track);
            }
        });

        new KnobControl(this.bodyEl.querySelector('.knob-lpf-q'), {
            min: 0.1, max: 12, value: fx.lpfQ || 0.7, defaultValue: 0.7, step: 0.1, unit: 'Q',
            onChange: (val) => {
                fx.lpfQ = val;
                if (eng) eng.effects.setLPF(fx.lpfFreq, fx.lpfBypass, val);
                this._drawFilterCurve(track);
            }
        });

        this._drawFilterCurve(track);

        // Distortion
        this.bodyEl.querySelector('#btnToggleDist').addEventListener('click', () => {
            fx.distortionBypass = !fx.distortionBypass;
            if (eng) eng.effects.setDistortion(fx.distortionDrive, fx.distortionType, fx.distortionBypass);
            this._renderEffectsRack(track);
        });

        new KnobControl(this.bodyEl.querySelector('.knob-dist-drive'), {
            min: 0, max: 80, value: fx.distortionDrive, defaultValue: 0, step: 1, unit: '%',
            onChange: (val) => {
                fx.distortionDrive = val;
                if (eng) eng.effects.setDistortion(val, fx.distortionType, fx.distortionBypass);
            }
        });

        this.bodyEl.querySelector('#selectDistType').addEventListener('change', (e) => {
            fx.distortionType = e.target.value;
            if (eng) eng.effects.setDistortion(fx.distortionDrive, fx.distortionType, fx.distortionBypass);
        });

        // Delay
        this.bodyEl.querySelector('#btnToggleDelay').addEventListener('click', () => {
            fx.delayBypass = !fx.delayBypass;
            if (eng) eng.effects.setDelay(fx.delayTime, fx.delayFeedback, fx.delayWet, fx.delayBypass);
            this._renderEffectsRack(track);
        });

        new KnobControl(this.bodyEl.querySelector('.knob-delay-time'), {
            min: 0.05, max: 1.0, value: fx.delayTime, defaultValue: 0.35, step: 0.02, unit: 's',
            onChange: (val) => {
                fx.delayTime = val;
                if (eng) eng.effects.setDelay(val, fx.delayFeedback, fx.delayWet, fx.delayBypass);
            }
        });

        new KnobControl(this.bodyEl.querySelector('.knob-delay-fb'), {
            min: 0, max: 0.9, value: fx.delayFeedback, defaultValue: 0.3, step: 0.02, unit: '%',
            onChange: (val) => {
                fx.delayFeedback = val;
                if (eng) eng.effects.setDelay(fx.delayTime, val, fx.delayWet, fx.delayBypass);
            }
        });

        new KnobControl(this.bodyEl.querySelector('.knob-delay-wet'), {
            min: 0, max: 1.0, value: fx.delayWet, defaultValue: 0.3, step: 0.02, unit: '',
            onChange: (val) => {
                fx.delayWet = val;
                if (eng) eng.effects.setDelay(fx.delayTime, fx.delayFeedback, val, fx.delayBypass);
            }
        });

        // Reverb
        this.bodyEl.querySelector('#btnToggleReverb').addEventListener('click', () => {
            fx.reverbBypass = !fx.reverbBypass;
            if (eng) eng.effects.setReverb(fx.reverbDecay, fx.reverbWet, fx.reverbBypass);
            this._renderEffectsRack(track);
        });

        new KnobControl(this.bodyEl.querySelector('.knob-reverb-decay'), {
            min: 0.2, max: 5.0, value: fx.reverbDecay, defaultValue: 2.0, step: 0.1, unit: 's',
            onChange: (val) => {
                fx.reverbDecay = val;
                if (eng) eng.effects.setReverb(val, fx.reverbWet, fx.reverbBypass);
            }
        });

        new KnobControl(this.bodyEl.querySelector('.knob-reverb-wet'), {
            min: 0, max: 1.0, value: fx.reverbWet, defaultValue: 0.25, step: 0.02, unit: '',
            onChange: (val) => {
                fx.reverbWet = val;
                if (eng) eng.effects.setReverb(fx.reverbDecay, val, fx.reverbBypass);
            }
        });

        // Compressor
        this.bodyEl.querySelector('#btnToggleComp').addEventListener('click', () => {
            fx.compBypass = !fx.compBypass;
            if (eng) eng.effects.setCompressor(fx.compThreshold, fx.compRatio, fx.compBypass);
            this._renderEffectsRack(track);
        });

        new KnobControl(this.bodyEl.querySelector('.knob-comp-thresh'), {
            min: -40, max: 0, value: fx.compThreshold, defaultValue: -18, step: 1, unit: 'dB',
            onChange: (val) => {
                fx.compThreshold = val;
                if (eng) eng.effects.setCompressor(val, fx.compRatio, fx.compBypass);
            }
        });

        new KnobControl(this.bodyEl.querySelector('.knob-comp-ratio'), {
            min: 1, max: 20, value: fx.compRatio, defaultValue: 4, step: 0.5, unit: ':1',
            onChange: (val) => {
                fx.compRatio = val;
                if (eng) eng.effects.setCompressor(fx.compThreshold, val, fx.compBypass);
            }
        });
    }

    _drawFilterCurve(track) {
        const canvas = this.bodyEl.querySelector('#filterCurveCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, w, h);

        const fx = track.effects;
        const hpfNorm = Math.log10(Math.max(20, fx.hpfFreq) / 20) / 3;
        const lpfNorm = Math.log10(Math.max(80, fx.lpfFreq) / 20) / 3;

        ctx.beginPath();
        ctx.moveTo(0, h * 0.85);

        for (let x = 0; x <= w; x++) {
            const freqNorm = x / w;
            let resp = 1.0;

            if (!fx.hpfBypass && freqNorm < hpfNorm) {
                resp *= Math.pow(freqNorm / (hpfNorm || 0.001), 2);
            }
            if (!fx.lpfBypass && freqNorm > lpfNorm) {
                resp *= Math.pow(1 - (freqNorm - lpfNorm) / (1 - lpfNorm || 0.001), 2);
            }

            const y = h - resp * (h * 0.75) - 4;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // -------------------------------------------------------------
    // SYNTHESIZER ENGINE EDITOR
    // -------------------------------------------------------------
    _renderSynthEditor(track) {
        const synth = track.synthPreset;
        const eng = this.engine.trackEngines.get(track.id);

        this.bodyEl.innerHTML = `
            <div class="synth-editor-scroll">
                <!-- OSCILLATOR 1 -->
                <div class="synth-section-card">
                    <div class="card-title">OSCILLATOR 1</div>
                    <div class="synth-params-row">
                        <div class="fx-select-col">
                            <span class="knob-title">WAVE</span>
                            <select id="selOsc1Type" class="fx-select">
                                <option value="sawtooth" ${synth.osc1Type === 'sawtooth' ? 'selected' : ''}>Sawtooth</option>
                                <option value="square" ${synth.osc1Type === 'square' ? 'selected' : ''}>Square</option>
                                <option value="triangle" ${synth.osc1Type === 'triangle' ? 'selected' : ''}>Triangle</option>
                                <option value="sine" ${synth.osc1Type === 'sine' ? 'selected' : ''}>Sine</option>
                            </select>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">OCTAVE</span>
                            <div class="knob-osc1-oct"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">DETUNE</span>
                            <div class="knob-osc1-detune"></div>
                        </div>
                    </div>
                </div>

                <!-- OSCILLATOR 2 & MIX -->
                <div class="synth-section-card">
                    <div class="card-title">OSCILLATOR 2</div>
                    <div class="synth-params-row">
                        <div class="fx-select-col">
                            <span class="knob-title">WAVE</span>
                            <select id="selOsc2Type" class="fx-select">
                                <option value="square" ${synth.osc2Type === 'square' ? 'selected' : ''}>Square</option>
                                <option value="sawtooth" ${synth.osc2Type === 'sawtooth' ? 'selected' : ''}>Sawtooth</option>
                                <option value="triangle" ${synth.osc2Type === 'triangle' ? 'selected' : ''}>Triangle</option>
                                <option value="sine" ${synth.osc2Type === 'sine' ? 'selected' : ''}>Sine</option>
                            </select>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">SEMI</span>
                            <div class="knob-osc2-semi"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">DETUNE</span>
                            <div class="knob-osc2-detune"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">OSC MIX</span>
                            <div class="knob-osc-mix"></div>
                        </div>
                    </div>
                </div>

                <!-- FILTER SECTION -->
                <div class="synth-section-card">
                    <div class="card-title">SYNTH FILTER</div>
                    <div class="synth-params-row">
                        <div class="fx-knob-col">
                            <span class="knob-title">CUTOFF</span>
                            <div class="knob-synth-cutoff"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">RESONANCE</span>
                            <div class="knob-synth-res"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">ENV AMT</span>
                            <div class="knob-synth-envamt"></div>
                        </div>
                    </div>
                </div>

                <!-- AMP ADSR ENVELOPE -->
                <div class="synth-section-card">
                    <div class="card-title">AMP ADSR ENVELOPE</div>
                    <div class="synth-params-row">
                        <div class="fx-knob-col">
                            <span class="knob-title">ATTACK</span>
                            <div class="knob-amp-a"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">DECAY</span>
                            <div class="knob-amp-d"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">SUSTAIN</span>
                            <div class="knob-amp-s"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">RELEASE</span>
                            <div class="knob-amp-r"></div>
                        </div>
                        <div class="fx-canvas-box">
                            <canvas class="adsr-curve-canvas" id="adsrCanvas" width="100" height="50"></canvas>
                        </div>
                    </div>
                </div>

                <!-- LFO & GLIDE -->
                <div class="synth-section-card">
                    <div class="card-title">LFO & GLIDE</div>
                    <div class="synth-params-row">
                        <div class="fx-select-col">
                            <span class="knob-title">TARGET</span>
                            <select id="selLfoTarget" class="fx-select">
                                <option value="cutoff" ${synth.lfoTarget === 'cutoff' ? 'selected' : ''}>Cutoff</option>
                                <option value="pitch" ${synth.lfoTarget === 'pitch' ? 'selected' : ''}>Pitch</option>
                                <option value="amp" ${synth.lfoTarget === 'amp' ? 'selected' : ''}>Tremolo</option>
                                <option value="none" ${synth.lfoTarget === 'none' ? 'selected' : ''}>None</option>
                            </select>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">RATE</span>
                            <div class="knob-lfo-rate"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">DEPTH</span>
                            <div class="knob-lfo-depth"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">GLIDE</span>
                            <div class="knob-synth-glide"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const applySynth = (key, val) => {
            synth[key] = val;
            if (eng && eng.synth) {
                eng.synth.setParam(key, val);
            }
        };

        // Osc 1
        this.bodyEl.querySelector('#selOsc1Type').addEventListener('change', (e) => applySynth('osc1Type', e.target.value));
        new KnobControl(this.bodyEl.querySelector('.knob-osc1-oct'), {
            min: -2, max: 2, value: synth.osc1Octave, defaultValue: 0, step: 1, unit: 'oct',
            onChange: (v) => applySynth('osc1Octave', v)
        });
        new KnobControl(this.bodyEl.querySelector('.knob-osc1-detune'), {
            min: -50, max: 50, value: synth.osc1Detune, defaultValue: 0, step: 1, unit: 'c',
            onChange: (v) => applySynth('osc1Detune', v)
        });

        // Osc 2
        this.bodyEl.querySelector('#selOsc2Type').addEventListener('change', (e) => applySynth('osc2Type', e.target.value));
        new KnobControl(this.bodyEl.querySelector('.knob-osc2-semi'), {
            min: -24, max: 24, value: synth.osc2Semi, defaultValue: 0, step: 1, unit: 'st',
            onChange: (v) => applySynth('osc2Semi', v)
        });
        new KnobControl(this.bodyEl.querySelector('.knob-osc2-detune'), {
            min: -50, max: 50, value: synth.osc2Detune, defaultValue: 8, step: 1, unit: 'c',
            onChange: (v) => applySynth('osc2Detune', v)
        });
        new KnobControl(this.bodyEl.querySelector('.knob-osc-mix'), {
            min: 0, max: 1.0, value: synth.oscMix, defaultValue: 0.4, step: 0.05, unit: '',
            onChange: (v) => applySynth('oscMix', v)
        });

        // Filter
        new KnobControl(this.bodyEl.querySelector('.knob-synth-cutoff'), {
            min: 60, max: 18000, value: synth.filterCutoff, defaultValue: 2400, step: 50, unit: 'Hz',
            onChange: (v) => applySynth('filterCutoff', v)
        });
        new KnobControl(this.bodyEl.querySelector('.knob-synth-res'), {
            min: 0.1, max: 15, value: synth.filterResonance, defaultValue: 3.0, step: 0.2, unit: 'Q',
            onChange: (v) => applySynth('filterResonance', v)
        });
        new KnobControl(this.bodyEl.querySelector('.knob-synth-envamt'), {
            min: -1.0, max: 1.0, value: synth.filterEnvAmount, defaultValue: 0.5, step: 0.05, unit: '',
            onChange: (v) => applySynth('filterEnvAmount', v)
        });

        // Amp ADSR
        new KnobControl(this.bodyEl.querySelector('.knob-amp-a'), {
            min: 0.005, max: 2.0, value: synth.ampAttack, defaultValue: 0.02, step: 0.01, unit: 's',
            onChange: (v) => { applySynth('ampAttack', v); this._drawADSRCurve(track); }
        });
        new KnobControl(this.bodyEl.querySelector('.knob-amp-d'), {
            min: 0.01, max: 3.0, value: synth.ampDecay, defaultValue: 0.25, step: 0.02, unit: 's',
            onChange: (v) => { applySynth('ampDecay', v); this._drawADSRCurve(track); }
        });
        new KnobControl(this.bodyEl.querySelector('.knob-amp-s'), {
            min: 0, max: 1.0, value: synth.ampSustain, defaultValue: 0.6, step: 0.02, unit: '',
            onChange: (v) => { applySynth('ampSustain', v); this._drawADSRCurve(track); }
        });
        new KnobControl(this.bodyEl.querySelector('.knob-amp-r'), {
            min: 0.01, max: 4.0, value: synth.ampRelease, defaultValue: 0.35, step: 0.02, unit: 's',
            onChange: (v) => { applySynth('ampRelease', v); this._drawADSRCurve(track); }
        });
        this._drawADSRCurve(track);

        // LFO & Glide
        this.bodyEl.querySelector('#selLfoTarget').addEventListener('change', (e) => applySynth('lfoTarget', e.target.value));
        new KnobControl(this.bodyEl.querySelector('.knob-lfo-rate'), {
            min: 0.1, max: 20.0, value: synth.lfoRate, defaultValue: 2.5, step: 0.1, unit: 'Hz',
            onChange: (v) => applySynth('lfoRate', v)
        });
        new KnobControl(this.bodyEl.querySelector('.knob-lfo-depth'), {
            min: 0, max: 1.0, value: synth.lfoDepth, defaultValue: 0.15, step: 0.02, unit: '',
            onChange: (v) => applySynth('lfoDepth', v)
        });
        new KnobControl(this.bodyEl.querySelector('.knob-synth-glide'), {
            min: 0, max: 0.5, value: synth.glide, defaultValue: 0.02, step: 0.01, unit: 's',
            onChange: (v) => applySynth('glide', v)
        });
    }

    _drawADSRCurve(track) {
        const canvas = this.bodyEl.querySelector('#adsrCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, w, h);

        const s = track.synthPreset;
        const a = Math.max(0.01, s.ampAttack);
        const d = Math.max(0.01, s.ampDecay);
        const sus = Math.max(0, Math.min(1.0, s.ampSustain));
        const r = Math.max(0.01, s.ampRelease);
        const total = a + d + 0.3 + r;

        const xA = (a / total) * w;
        const xD = ((a + d) / total) * w;
        const xS = ((a + d + 0.3) / total) * w;
        const xR = w;

        const yTop = 5;
        const ySus = h - sus * (h - 10) - 5;
        const yBot = h - 4;

        ctx.beginPath();
        ctx.moveTo(0, yBot);
        ctx.lineTo(xA, yTop);
        ctx.lineTo(xD, ySus);
        ctx.lineTo(xS, ySus);
        ctx.lineTo(xR, yBot);

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
        ctx.lineTo(0, yBot);
        ctx.fill();
    }
}
