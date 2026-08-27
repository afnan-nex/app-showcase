/**
 * AudioDeck - EffectsChain
 * Web Audio effect nodes manager for individual tracks and master output.
 * Provides HighPass, LowPass, Distortion/Overdrive, Stereo Delay, Algorithmic Reverb, Compressor, Pan, and Analyser.
 */
export class EffectsChain {
    /**
     * @param {AudioContext|BaseAudioContext} ctx 
     * @param {Object} options 
     */
    constructor(ctx, options = {}) {
        this.ctx = ctx;
        this.isMaster = options.isMaster || false;

        // Effect parameters state
        this.params = {
            gain: options.gain !== undefined ? options.gain : 0.8, // 0 to 1.5
            pan: options.pan !== undefined ? options.pan : 0, // -1 to +1
            mute: options.mute || false,
            solo: options.solo || false,

            // Filter (HPF + LPF)
            hpfFreq: options.hpfFreq || 20, // 20Hz - 5000Hz
            hpfQ: options.hpfQ || 0.7,
            hpfBypass: options.hpfBypass !== undefined ? options.hpfBypass : true,

            lpfFreq: options.lpfFreq || 20000, // 100Hz - 20000Hz
            lpfQ: options.lpfQ || 0.7,
            lpfBypass: options.lpfBypass !== undefined ? options.lpfBypass : true,

            // Distortion
            distortionDrive: options.distortionDrive || 0, // 0 to 100
            distortionType: options.distortionType || 'soft', // 'soft', 'hard', 'fuzz'
            distortionBypass: options.distortionBypass !== undefined ? options.distortionBypass : true,

            // Delay
            delayTime: options.delayTime || 0.35, // 0.01 to 1.5s
            delayFeedback: options.delayFeedback || 0.35, // 0 to 0.9
            delayWet: options.delayWet || 0.3, // 0 to 1
            delayDamp: options.delayDamp || 3500, // filter on feedback
            delayBypass: options.delayBypass !== undefined ? options.delayBypass : true,

            // Reverb
            reverbDecay: options.reverbDecay || 2.0, // 0.2 to 6.0s
            reverbWet: options.reverbWet || 0.25, // 0 to 1
            reverbBypass: options.reverbBypass !== undefined ? options.reverbBypass : true,

            // Compressor
            compThreshold: options.compThreshold !== undefined ? options.compThreshold : -18,
            compRatio: options.compRatio || 4,
            compAttack: options.compAttack || 0.01,
            compRelease: options.compRelease || 0.15,
            compBypass: options.compBypass !== undefined ? options.compBypass : true
        };

        this._buildGraph();
    }

    _buildGraph() {
        const ctx = this.ctx;

        // 1. Input node
        this.inputNode = ctx.createGain();

        // 2. High-Pass Filter
        this.hpfNode = ctx.createBiquadFilter();
        this.hpfNode.type = 'highpass';
        this.hpfNode.frequency.value = this.params.hpfBypass ? 20 : this.params.hpfFreq;
        this.hpfNode.Q.value = this.params.hpfQ;

        // 3. Low-Pass Filter
        this.lpfNode = ctx.createBiquadFilter();
        this.lpfNode.type = 'lowpass';
        this.lpfNode.frequency.value = this.params.lpfBypass ? 20000 : this.params.lpfFreq;
        this.lpfNode.Q.value = this.params.lpfQ;

        // 4. Distortion (WaveShaper)
        this.distInputNode = ctx.createGain();
        this.distShaperNode = ctx.createWaveShaper();
        this.distShaperNode.oversample = '4x';
        this.distDryNode = ctx.createGain();
        this.distWetNode = ctx.createGain();
        this.distOutputNode = ctx.createGain();
        this._updateDistortionCurve();

        // 5. Delay Sub-Graph
        this.delayInputNode = ctx.createGain();
        this.delayNode = ctx.createDelay(5.0);
        this.delayNode.delayTime.value = this.params.delayTime;
        this.delayFeedbackGain = ctx.createGain();
        this.delayFeedbackGain.gain.value = this.params.delayFeedback;
        this.delayDampFilter = ctx.createBiquadFilter();
        this.delayDampFilter.type = 'lowpass';
        this.delayDampFilter.frequency.value = this.params.delayDamp;
        this.delayDryNode = ctx.createGain();
        this.delayWetNode = ctx.createGain();
        this.delayOutputNode = ctx.createGain();

        // 6. Reverb Sub-Graph (Convolver)
        this.reverbInputNode = ctx.createGain();
        this.convolverNode = ctx.createConvolver();
        this.convolverNode.buffer = this._generateImpulseResponse(this.params.reverbDecay);
        this.reverbDryNode = ctx.createGain();
        this.reverbWetNode = ctx.createGain();
        this.reverbOutputNode = ctx.createGain();

        // 7. Dynamics Compressor
        this.compressorNode = ctx.createDynamicsCompressor();
        this.compressorNode.threshold.value = this.params.compBypass ? 0 : this.params.compThreshold;
        this.compressorNode.knee.value = 12;
        this.compressorNode.ratio.value = this.params.compRatio;
        this.compressorNode.attack.value = this.params.compAttack;
        this.compressorNode.release.value = this.params.compRelease;

        // 8. Track Gain & Mute
        this.gainNode = ctx.createGain();
        this.gainNode.gain.value = this.params.mute ? 0 : this.params.gain;

        // 9. Stereo Panner
        if (ctx.createStereoPanner) {
            this.pannerNode = ctx.createStereoPanner();
            this.pannerNode.pan.value = this.params.pan;
        } else {
            // Fallback for older browsers
            this.pannerNode = ctx.createGain();
        }

        // 10. Analyser Node for VU meter
        this.analyserNode = ctx.createAnalyser();
        this.analyserNode.fftSize = 256;
        this.analyserNode.smoothingTimeConstant = 0.8;

        // 11. Output Node
        this.outputNode = ctx.createGain();

        // WIRE UP AUDIO GRAPH
        // Input -> HPF -> LPF
        this.inputNode.connect(this.hpfNode);
        this.hpfNode.connect(this.lpfNode);

        // LPF -> Distortion (Dry/Wet)
        this.lpfNode.connect(this.distInputNode);
        this.distInputNode.connect(this.distDryNode);
        this.distInputNode.connect(this.distShaperNode);
        this.distShaperNode.connect(this.distWetNode);
        this.distDryNode.connect(this.distOutputNode);
        this.distWetNode.connect(this.distOutputNode);
        this._updateDistortionMix();

        // Distortion Output -> Delay (Dry/Wet)
        this.distOutputNode.connect(this.delayInputNode);
        this.delayInputNode.connect(this.delayDryNode);
        this.delayDryNode.connect(this.delayOutputNode);

        this.delayInputNode.connect(this.delayNode);
        this.delayNode.connect(this.delayDampFilter);
        this.delayDampFilter.connect(this.delayFeedbackGain);
        this.delayFeedbackGain.connect(this.delayNode); // feedback loop
        this.delayDampFilter.connect(this.delayWetNode);
        this.delayWetNode.connect(this.delayOutputNode);
        this._updateDelayMix();

        // Delay Output -> Reverb (Dry/Wet)
        this.delayOutputNode.connect(this.reverbInputNode);
        this.reverbInputNode.connect(this.reverbDryNode);
        this.reverbDryNode.connect(this.reverbOutputNode);

        this.reverbInputNode.connect(this.convolverNode);
        this.convolverNode.connect(this.reverbWetNode);
        this.reverbWetNode.connect(this.reverbOutputNode);
        this._updateReverbMix();

        // Reverb Output -> Compressor -> Track Gain -> Panner -> Analyser -> Output
        this.reverbOutputNode.connect(this.compressorNode);
        this.compressorNode.connect(this.gainNode);
        this.gainNode.connect(this.pannerNode);
        this.pannerNode.connect(this.analyserNode);
        this.analyserNode.connect(this.outputNode);

        // Time domain data array for metering
        this._meterData = new Uint8Array(this.analyserNode.frequencyBinCount);
    }

    _generateImpulseResponse(decayTime = 2.0) {
        const rate = this.ctx.sampleRate || 44100;
        const length = Math.max(1, Math.floor(rate * decayTime));
        const impulse = this.ctx.createBuffer(2, length, rate);
        const impulseL = impulse.getChannelData(0);
        const impulseR = impulse.getChannelData(1);

        for (let i = 0; i < length; i++) {
            const t = i / length;
            // Exponential decay envelope with slight diffusion
            const env = Math.exp(-t * (4.5 / (decayTime * 0.5 + 0.5)));
            impulseL[i] = (Math.random() * 2 - 1) * env;
            impulseR[i] = (Math.random() * 2 - 1) * env;
        }
        return impulse;
    }

    _updateDistortionCurve() {
        const drive = this.params.distortionDrive;
        const k = drive > 0 ? drive : 0;
        const nSamples = 44100;
        const curve = new Float32Array(nSamples);
        const deg = Math.PI / 180;

        if (this.params.distortionType === 'hard') {
            for (let i = 0; i < nSamples; i++) {
                const x = (i * 2) / nSamples - 1;
                const thresh = 0.4 / (1 + k * 0.05);
                curve[i] = Math.max(-thresh, Math.min(thresh, x)) / thresh;
            }
        } else if (this.params.distortionType === 'fuzz') {
            for (let i = 0; i < nSamples; i++) {
                const x = (i * 2) / nSamples - 1;
                curve[i] = Math.tanh(x * (1 + k * 0.25));
            }
        } else {
            // Soft clipping
            for (let i = 0; i < nSamples; i++) {
                const x = (i * 2) / nSamples - 1;
                if (k === 0) {
                    curve[i] = x;
                } else {
                    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
                }
            }
        }
        this.distShaperNode.curve = curve;
    }

    _updateDistortionMix() {
        if (this.params.distortionBypass || this.params.distortionDrive === 0) {
            this.distDryNode.gain.setValueAtTime(1, this.ctx.currentTime);
            this.distWetNode.gain.setValueAtTime(0, this.ctx.currentTime);
        } else {
            this.distDryNode.gain.setValueAtTime(0, this.ctx.currentTime);
            this.distWetNode.gain.setValueAtTime(1, this.ctx.currentTime);
        }
    }

    _updateDelayMix() {
        if (this.params.delayBypass) {
            this.delayDryNode.gain.setValueAtTime(1, this.ctx.currentTime);
            this.delayWetNode.gain.setValueAtTime(0, this.ctx.currentTime);
        } else {
            this.delayDryNode.gain.setValueAtTime(1 - this.params.delayWet * 0.5, this.ctx.currentTime);
            this.delayWetNode.gain.setValueAtTime(this.params.delayWet, this.ctx.currentTime);
        }
    }

    _updateReverbMix() {
        if (this.params.reverbBypass) {
            this.reverbDryNode.gain.setValueAtTime(1, this.ctx.currentTime);
            this.reverbWetNode.gain.setValueAtTime(0, this.ctx.currentTime);
        } else {
            this.reverbDryNode.gain.setValueAtTime(1 - this.params.reverbWet * 0.5, this.ctx.currentTime);
            this.reverbWetNode.gain.setValueAtTime(this.params.reverbWet, this.ctx.currentTime);
        }
    }

    // Setters with smooth ramps to avoid pops & clicks
    setGain(val, rampSec = 0.015) {
        this.params.gain = Math.max(0, Math.min(2.0, val));
        if (!this.params.mute) {
            const now = this.ctx.currentTime;
            this.gainNode.gain.cancelScheduledValues(now);
            this.gainNode.gain.linearRampToValueAtTime(this.params.gain, now + rampSec);
        }
    }

    setPan(val) {
        this.params.pan = Math.max(-1, Math.min(1, val));
        if (this.pannerNode.pan) {
            this.pannerNode.pan.setValueAtTime(this.params.pan, this.ctx.currentTime);
        }
    }

    setMute(isMuted, rampSec = 0.02) {
        this.params.mute = !!isMuted;
        const now = this.ctx.currentTime;
        this.gainNode.gain.cancelScheduledValues(now);
        const target = this.params.mute ? 0 : this.params.gain;
        this.gainNode.gain.linearRampToValueAtTime(target, now + rampSec);
    }

    setSolo(isSolo) {
        this.params.solo = !!isSolo;
    }

    setHPF(freq, bypass = false, q = 0.7) {
        this.params.hpfFreq = freq;
        this.params.hpfBypass = bypass;
        this.params.hpfQ = q;
        const target = bypass ? 20 : Math.max(20, Math.min(10000, freq));
        this.hpfNode.frequency.setTargetAtTime(target, this.ctx.currentTime, 0.02);
        this.hpfNode.Q.setValueAtTime(q, this.ctx.currentTime);
    }

    setLPF(freq, bypass = false, q = 0.7) {
        this.params.lpfFreq = freq;
        this.params.lpfBypass = bypass;
        this.params.lpfQ = q;
        const target = bypass ? 20000 : Math.max(80, Math.min(20000, freq));
        this.lpfNode.frequency.setTargetAtTime(target, this.ctx.currentTime, 0.02);
        this.lpfNode.Q.setValueAtTime(q, this.ctx.currentTime);
    }

    setDistortion(drive, type = 'soft', bypass = false) {
        this.params.distortionDrive = drive;
        this.params.distortionType = type;
        this.params.distortionBypass = bypass;
        this._updateDistortionCurve();
        this._updateDistortionMix();
    }

    setDelay(time, feedback, wet, bypass = false) {
        this.params.delayTime = Math.max(0.01, Math.min(2.0, time));
        this.params.delayFeedback = Math.max(0, Math.min(0.92, feedback));
        this.params.delayWet = Math.max(0, Math.min(1.0, wet));
        this.params.delayBypass = bypass;

        this.delayNode.delayTime.setTargetAtTime(this.params.delayTime, this.ctx.currentTime, 0.02);
        this.delayFeedbackGain.gain.setValueAtTime(this.params.delayFeedback, this.ctx.currentTime);
        this._updateDelayMix();
    }

    setReverb(decay, wet, bypass = false) {
        const decayChanged = Math.abs(this.params.reverbDecay - decay) > 0.1;
        this.params.reverbDecay = Math.max(0.2, Math.min(6.0, decay));
        this.params.reverbWet = Math.max(0, Math.min(1.0, wet));
        this.params.reverbBypass = bypass;

        if (decayChanged) {
            this.convolverNode.buffer = this._generateImpulseResponse(this.params.reverbDecay);
        }
        this._updateReverbMix();
    }

    setCompressor(threshold, ratio, bypass = false) {
        this.params.compThreshold = threshold;
        this.params.compRatio = ratio;
        this.params.compBypass = bypass;

        const targetThresh = bypass ? 0 : threshold;
        this.compressorNode.threshold.setValueAtTime(targetThresh, this.ctx.currentTime);
        this.compressorNode.ratio.setValueAtTime(ratio, this.ctx.currentTime);
    }

    /**
     * Reads current Peak and RMS volume levels (0.0 to 1.0)
     * @returns {{peak: number, rms: number, clipping: boolean}}
     */
    getLevels() {
        this.analyserNode.getByteTimeDomainData(this._meterData);
        let sumSquares = 0;
        let peak = 0;

        for (let i = 0; i < this._meterData.length; i++) {
            const normalized = (this._meterData[i] - 128) / 128;
            const abs = Math.abs(normalized);
            if (abs > peak) peak = abs;
            sumSquares += normalized * normalized;
        }

        const rms = Math.sqrt(sumSquares / this._meterData.length);
        return {
            peak: Math.min(1.0, peak * 1.15),
            rms: Math.min(1.0, rms * 1.4),
            clipping: peak >= 0.98
        };
    }
}
