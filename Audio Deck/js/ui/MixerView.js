/**
 * AudioDeck - MixerView
 * Professional compact vertical channel strips with volume faders, dB scale,
 * pan knobs, M/S/R buttons, and real-time animated LED VU meters.
 */
import { KnobControl } from '../utils/KnobControl.js';

export class MixerView {
    /**
     * @param {HTMLElement} container 
     * @param {AudioEngine} audioEngine 
     * @param {Project} project 
     */
    constructor(container, audioEngine, project) {
        this.container = container;
        this.engine = audioEngine;
        this.project = project;

        this.meterFills = new Map(); // trackId -> { fill, clip }
        this.masterMeterL = null;
        this.masterMeterR = null;

        this._render();
        this._setupMeterListener();
    }

    _render() {
        this.container.innerHTML = `
            <div class="mixer-container">
                <div class="mixer-channels-scroll" id="mixerChannelsList"></div>
                <div class="mixer-divider"></div>
                <div class="mixer-master-channel" id="mixerMasterChannel"></div>
            </div>
        `;

        this.channelsList = this.container.querySelector('#mixerChannelsList');
        this.masterContainer = this.container.querySelector('#mixerMasterChannel');

        this.renderChannels();
        this.renderMaster();
    }

    renderChannels() {
        this.channelsList.innerHTML = '';
        this.meterFills.clear();

        this.project.tracks.forEach((track, idx) => {
            const strip = document.createElement('div');
            strip.className = `mixer-strip ${track.id === this.project.activeTrackId ? 'active' : ''}`;
            strip.dataset.trackId = track.id;

            strip.innerHTML = `
                <div class="strip-color-bar" style="background-color: ${track.color};"></div>
                <div class="strip-header">
                    <span class="strip-num">${idx + 1}</span>
                    <span class="strip-name" title="${track.name}">${track.name}</span>
                </div>

                <!-- FX Quick Slots -->
                <div class="strip-fx-slots">
                    <span class="fx-badge ${!track.effects.hpfBypass || !track.effects.lpfBypass ? 'active' : ''}" title="Filter EQ">EQ</span>
                    <span class="fx-badge ${!track.effects.distortionBypass ? 'active' : ''}" title="Distortion">DST</span>
                    <span class="fx-badge ${!track.effects.delayBypass ? 'active' : ''}" title="Delay">DLY</span>
                    <span class="fx-badge ${!track.effects.reverbBypass ? 'active' : ''}" title="Reverb">REV</span>
                </div>

                <!-- Pan Knob -->
                <div class="strip-pan-section">
                    <span class="strip-label">PAN</span>
                    <div class="pan-knob-placeholder" data-track-id="${track.id}"></div>
                </div>

                <!-- Mute / Solo / Arm -->
                <div class="strip-buttons-section">
                    <button class="strip-btn btn-mute ${track.mute ? 'active' : ''}" title="Mute Track (M)">M</button>
                    <button class="strip-btn btn-solo ${track.solo ? 'active' : ''}" title="Solo Track (S)">S</button>
                    <button class="strip-btn btn-arm ${track.arm ? 'active' : ''}" title="Arm for Recording">R</button>
                </div>

                <!-- Fader & VU Meter Section -->
                <div class="strip-fader-meter-section">
                    <div class="db-scale">
                        <span>+6</span>
                        <span>0</span>
                        <span>-6</span>
                        <span>-12</span>
                        <span>-24</span>
                        <span>-inf</span>
                    </div>

                    <div class="strip-fader-wrapper">
                        <input type="range" class="strip-fader" min="0" max="1.5" step="0.01" value="${track.volume}" orient="vertical" title="Track Gain (Double-click: 0 dB)" />
                    </div>

                    <!-- LED VU Meter -->
                    <div class="strip-meter-wrapper">
                        <div class="meter-clip-led" title="Clip Indicator (Click to reset)"></div>
                        <div class="meter-bar-container">
                            <div class="meter-bar-fill meter-fill-l"></div>
                        </div>
                    </div>
                </div>

                <!-- Numerical Readout -->
                <div class="strip-db-readout" id="dbReadout_${track.id}">
                    ${this._volumeToDbString(track.volume)}
                </div>
            `;

            // Initialize Pan Knob
            const knobContainer = strip.querySelector('.pan-knob-placeholder');
            new KnobControl(knobContainer, {
                min: -1,
                max: 1,
                value: track.pan,
                defaultValue: 0,
                step: 0.05,
                unit: '',
                onChange: (val) => {
                    track.pan = val;
                    const eng = this.engine.trackEngines.get(track.id);
                    if (eng) eng.effects.setPan(val);
                }
            });

            // Strip Events
            strip.addEventListener('click', () => {
                this.project.activeTrackId = track.id;
                this.container.querySelectorAll('.mixer-strip').forEach(s => s.classList.remove('active'));
                strip.classList.add('active');
                this.project.notify('active_track_changed', { trackId: track.id });
            });

            strip.querySelector('.btn-mute').addEventListener('click', (e) => {
                e.stopPropagation();
                track.mute = !track.mute;
                strip.querySelector('.btn-mute').classList.toggle('active', track.mute);
                this.engine.updateSoloMuteStates();
                this.project.notify('track_state_changed');
            });

            strip.querySelector('.btn-solo').addEventListener('click', (e) => {
                e.stopPropagation();
                track.solo = !track.solo;
                strip.querySelector('.btn-solo').classList.toggle('active', track.solo);
                this.engine.updateSoloMuteStates();
                this.project.notify('track_state_changed');
            });

            strip.querySelector('.btn-arm').addEventListener('click', (e) => {
                e.stopPropagation();
                track.arm = !track.arm;
                strip.querySelector('.btn-arm').classList.toggle('active', track.arm);
            });

            const fader = strip.querySelector('.strip-fader');
            const dbReadout = strip.querySelector(`#dbReadout_${track.id}`);
            
            fader.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                track.volume = val;
                dbReadout.textContent = this._volumeToDbString(val);
                const eng = this.engine.trackEngines.get(track.id);
                if (eng) eng.effects.setGain(val);
            });

            fader.addEventListener('dblclick', () => {
                fader.value = 1.0;
                track.volume = 1.0;
                dbReadout.textContent = '0.0 dB';
                const eng = this.engine.trackEngines.get(track.id);
                if (eng) eng.effects.setGain(1.0);
            });

            const clipLed = strip.querySelector('.meter-clip-led');
            clipLed.addEventListener('click', () => {
                clipLed.classList.remove('clipping');
            });

            // Cache meter elements
            this.meterFills.set(track.id, {
                fill: strip.querySelector('.meter-fill-l'),
                clip: clipLed
            });

            this.channelsList.appendChild(strip);
        });
    }

    renderMaster() {
        this.masterContainer.innerHTML = `
            <div class="mixer-strip strip-master">
                <div class="strip-color-bar" style="background-color: #ef4444;"></div>
                <div class="strip-header">
                    <span class="strip-num">M</span>
                    <span class="strip-name">MASTER</span>
                </div>

                <div class="strip-fx-slots">
                    <span class="fx-badge active" title="Brickwall Limiter Active">LIMITER</span>
                </div>

                <div class="strip-pan-section">
                    <span class="strip-label">PAN</span>
                    <div class="master-pan-knob"></div>
                </div>

                <div class="strip-buttons-section">
                    <span class="master-out-lbl">STEREO BUS</span>
                </div>

                <div class="strip-fader-meter-section">
                    <div class="db-scale">
                        <span>+6</span>
                        <span>0</span>
                        <span>-6</span>
                        <span>-12</span>
                        <span>-24</span>
                        <span>-inf</span>
                    </div>

                    <div class="strip-fader-wrapper">
                        <input type="range" class="strip-fader master-fader" min="0" max="1.5" step="0.01" value="${this.project.masterVolume}" orient="vertical" title="Master Output Gain" />
                    </div>

                    <!-- Dual Stereo VU Meter -->
                    <div class="strip-meter-wrapper dual-meter">
                        <div class="meter-clip-led" id="masterClipLed" title="Master Clip Indicator (Click to reset)"></div>
                        <div class="dual-meter-bars">
                            <div class="meter-bar-container">
                                <div class="meter-bar-fill" id="masterMeterFillL"></div>
                            </div>
                            <div class="meter-bar-container">
                                <div class="meter-bar-fill" id="masterMeterFillR"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="strip-db-readout" id="masterDbReadout">
                    ${this._volumeToDbString(this.project.masterVolume)}
                </div>
            </div>
        `;

        // Master Pan
        const masterPanKnob = this.masterContainer.querySelector('.master-pan-knob');
        new KnobControl(masterPanKnob, {
            min: -1,
            max: 1,
            value: 0,
            defaultValue: 0,
            step: 0.05,
            onChange: (val) => {
                if (this.engine.masterEffects) this.engine.masterEffects.setPan(val);
            }
        });

        const masterFader = this.masterContainer.querySelector('.master-fader');
        const masterDbReadout = this.masterContainer.querySelector('#masterDbReadout');
        
        masterFader.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            this.project.masterVolume = val;
            masterDbReadout.textContent = this._volumeToDbString(val);
            if (this.engine.masterEffects) {
                this.engine.masterEffects.setGain(val);
            }
        });

        masterFader.addEventListener('dblclick', () => {
            masterFader.value = 1.0;
            this.project.masterVolume = 1.0;
            masterDbReadout.textContent = '0.0 dB';
            if (this.engine.masterEffects) {
                this.engine.masterEffects.setGain(1.0);
            }
        });

        this.masterMeterL = this.masterContainer.querySelector('#masterMeterFillL');
        this.masterMeterR = this.masterContainer.querySelector('#masterMeterFillR');
        this.masterClipLed = this.masterContainer.querySelector('#masterClipLed');

        if (this.masterClipLed) {
            this.masterClipLed.addEventListener('click', () => {
                this.masterClipLed.classList.remove('clipping');
            });
        }
    }

    _setupMeterListener() {
        this.engine.onTrackLevelUpdate = (trackId, levels) => {
            const meter = this.meterFills.get(trackId);
            if (meter && meter.fill) {
                const pct = Math.min(100, Math.round(levels.peak * 100));
                meter.fill.style.height = `${pct}%`;
                if (levels.clipping) {
                    meter.clip.classList.add('clipping');
                }
            }
        };

        this.engine.onMasterLevelUpdate = (levels) => {
            if (this.masterMeterL && this.masterMeterR) {
                const pct = Math.min(100, Math.round(levels.peak * 100));
                this.masterMeterL.style.height = `${pct}%`;
                this.masterMeterR.style.height = `${pct}%`;
                if (this.masterClipLed && levels.clipping) {
                    this.masterClipLed.classList.add('clipping');
                }
            }
        };
    }

    _volumeToDbString(vol) {
        if (vol <= 0.0001) return '-inf dB';
        const db = 20 * Math.log10(vol);
        const sign = db > 0 ? '+' : '';
        return `${sign}${db.toFixed(1)} dB`;
    }
}
