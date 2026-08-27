/**
 * AudioDeck - SynthEngine
 * Polyphonic subtractive synthesizer engine with dual oscillators, noise,
 * multi-mode filter, dual ADSR envelopes (Amp & Filter), and routable LFO.
 */
export class SynthEngine {
    /**
     * @param {AudioContext|BaseAudioContext} ctx 
     * @param {AudioNode} destinationNode 
     * @param {Object} preset 
     */
    constructor(ctx, destinationNode, preset = {}) {
        this.ctx = ctx;
        this.destinationNode = destinationNode;

        // Default Synth Parameters
        this.params = {
            // Oscillators
            osc1Type: preset.osc1Type || 'sawtooth', // sine, square, sawtooth, triangle
            osc1Octave: preset.osc1Octave || 0, // -2, -1, 0, 1, 2
            osc1Detune: preset.osc1Detune || 0, // -50 to +50 cents

            osc2Type: preset.osc2Type || 'square',
            osc2Octave: preset.osc2Octave || 0,
            osc2Semi: preset.osc2Semi || 7, // semitone offset
            osc2Detune: preset.osc2Detune || 8, // cents detune for rich chorus
            oscMix: preset.oscMix !== undefined ? preset.oscMix : 0.4, // 0 = all Osc1, 1 = all Osc2

            subGain: preset.subGain !== undefined ? preset.subGain : 0.25, // sub oscillator
            noiseGain: preset.noiseGain !== undefined ? preset.noiseGain : 0.05,

            // Filter
            filterType: preset.filterType || 'lowpass',
            filterCutoff: preset.filterCutoff || 2200, // Hz
            filterResonance: preset.filterResonance || 3.5, // Q
            filterEnvAmount: preset.filterEnvAmount !== undefined ? preset.filterEnvAmount : 0.6,

            // Amp Envelope (seconds, level)
            ampAttack: preset.ampAttack || 0.02,
            ampDecay: preset.ampDecay || 0.25,
            ampSustain: preset.ampSustain !== undefined ? preset.ampSustain : 0.6,
            ampRelease: preset.ampRelease || 0.35,

            // Filter Envelope
            filterAttack: preset.filterAttack || 0.04,
            filterDecay: preset.filterDecay || 0.3,
            filterSustain: preset.filterSustain !== undefined ? preset.filterSustain : 0.3,
            filterRelease: preset.filterRelease || 0.3,

            // LFO
            lfoRate: preset.lfoRate || 2.5, // Hz
            lfoDepth: preset.lfoDepth || 0.15,
            lfoTarget: preset.lfoTarget || 'cutoff', // 'cutoff', 'pitch', 'amp', 'none'
            lfoWave: preset.lfoWave || 'sine',

            // Portamento / Glide
            glide: preset.glide || 0.02,
            voiceGain: preset.voiceGain || 0.75
        };

        // Active voice map for interactive playing (key: midiPitch)
        this.activeVoices = new Map();
    }

    /**
     * Converts MIDI note number (0 - 127) to frequency (Hz)
     * @param {number} midi 
     * @returns {number}
     */
    static midiToFreq(midi) {
        return 440 * Math.pow(2, (midi - 69) / 12);
    }

    /**
     * Triggers a scheduled note event with exact Web Audio timing
     * @param {number} midiPitch 
     * @param {number} velocity (0 to 127)
     * @param {number} startTime (ctx.currentTime seconds)
     * @param {number} duration (seconds)
     */
    triggerNote(midiPitch, velocity = 100, startTime = 0, duration = 0.5) {
        const velNorm = Math.max(0.1, Math.min(1.0, velocity / 127));
        const baseFreq = SynthEngine.midiToFreq(midiPitch);
        const ctx = this.ctx;
        const now = Math.max(ctx.currentTime, startTime);
        const endTime = now + Math.max(0.02, duration);

        // Voice Master Gain
        const voiceGain = ctx.createGain();
        voiceGain.gain.setValueAtTime(0, now);

        // Voice Filter Node
        const filter = ctx.createBiquadFilter();
        filter.type = this.params.filterType;
        filter.Q.setValueAtTime(this.params.filterResonance, now);

        // Amp Envelope
        const aA = Math.max(0.005, this.params.ampAttack);
        const aD = Math.max(0.005, this.params.ampDecay);
        const aS = Math.max(0.0, Math.min(1.0, this.params.ampSustain));
        const aR = Math.max(0.01, this.params.ampRelease);
        const peakGain = this.params.voiceGain * velNorm;

        voiceGain.gain.setValueAtTime(0.0001, now);
        voiceGain.gain.linearRampToValueAtTime(peakGain, now + aA);
        voiceGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peakGain * aS), now + aA + aD);
        voiceGain.gain.setValueAtTime(Math.max(0.0001, peakGain * aS), endTime);
        voiceGain.gain.exponentialRampToValueAtTime(0.0001, endTime + aR);

        // Filter Envelope
        const fA = Math.max(0.005, this.params.filterAttack);
        const fD = Math.max(0.005, this.params.filterDecay);
        const fS = Math.max(0.0, Math.min(1.0, this.params.filterSustain));
        const fR = Math.max(0.01, this.params.filterRelease);

        const baseCutoff = Math.max(40, Math.min(18000, this.params.filterCutoff));
        const envAmount = this.params.filterEnvAmount * 8000 * velNorm;
        const targetPeakCutoff = Math.max(40, Math.min(20000, baseCutoff + envAmount));
        const sustainCutoff = Math.max(40, Math.min(20000, baseCutoff + envAmount * fS));

        filter.frequency.setValueAtTime(baseCutoff, now);
        filter.frequency.linearRampToValueAtTime(targetPeakCutoff, now + fA);
        filter.frequency.exponentialRampToValueAtTime(sustainCutoff, now + fA + fD);
        filter.frequency.setValueAtTime(sustainCutoff, endTime);
        filter.frequency.exponentialRampToValueAtTime(Math.max(40, baseCutoff), endTime + fR);

        // Connect Filter -> Voice Gain -> Destination
        filter.connect(voiceGain);
        voiceGain.connect(this.destinationNode);

        // OSCILLATOR 1
        const osc1 = ctx.createOscillator();
        osc1.type = this.params.osc1Type;
        const osc1Freq = baseFreq * Math.pow(2, this.params.osc1Octave);
        osc1.frequency.setValueAtTime(osc1Freq, now);
        osc1.detune.setValueAtTime(this.params.osc1Detune, now);

        const osc1Gain = ctx.createGain();
        osc1Gain.gain.setValueAtTime(1 - this.params.oscMix, now);
        osc1.connect(osc1Gain);
        osc1Gain.connect(filter);

        // OSCILLATOR 2
        const osc2 = ctx.createOscillator();
        osc2.type = this.params.osc2Type;
        const osc2Freq = baseFreq * Math.pow(2, this.params.osc2Octave + this.params.osc2Semi / 12);
        osc2.frequency.setValueAtTime(osc2Freq, now);
        osc2.detune.setValueAtTime(this.params.osc2Detune, now);

        const osc2Gain = ctx.createGain();
        osc2Gain.gain.setValueAtTime(this.params.oscMix, now);
        osc2.connect(osc2Gain);
        osc2Gain.connect(filter);

        // SUB OSCILLATOR (1 octave down sine)
        let subOsc = null;
        if (this.params.subGain > 0.01) {
            subOsc = ctx.createOscillator();
            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(baseFreq * 0.5, now);
            const subGainNode = ctx.createGain();
            subGainNode.gain.setValueAtTime(this.params.subGain, now);
            subOsc.connect(subGainNode);
            subGainNode.connect(filter);
            subOsc.start(now);
            subOsc.stop(endTime + aR + 0.05);
        }

        // NOISE GENERATOR
        let noiseSource = null;
        if (this.params.noiseGain > 0.01) {
            const bufferSize = Math.floor(ctx.sampleRate * Math.max(0.1, duration + aR));
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            noiseSource = ctx.createBufferSource();
            noiseSource.buffer = noiseBuffer;
            const noiseGainNode = ctx.createGain();
            noiseGainNode.gain.setValueAtTime(this.params.noiseGain, now);
            noiseSource.connect(noiseGainNode);
            noiseGainNode.connect(filter);
            noiseSource.start(now);
            noiseSource.stop(endTime + aR + 0.05);
        }

        // LFO MODULATION
        let lfoOsc = null;
        if (this.params.lfoTarget !== 'none' && this.params.lfoDepth > 0.01) {
            lfoOsc = ctx.createOscillator();
            lfoOsc.type = this.params.lfoWave;
            lfoOsc.frequency.setValueAtTime(this.params.lfoRate, now);
            const lfoGain = ctx.createGain();

            if (this.params.lfoTarget === 'cutoff') {
                lfoGain.gain.setValueAtTime(this.params.lfoDepth * 2000, now);
                lfoOsc.connect(lfoGain);
                lfoGain.connect(filter.frequency);
            } else if (this.params.lfoTarget === 'pitch') {
                lfoGain.gain.setValueAtTime(this.params.lfoDepth * 200, now); // detune in cents
                lfoOsc.connect(lfoGain);
                lfoGain.connect(osc1.detune);
                lfoGain.connect(osc2.detune);
            } else if (this.params.lfoTarget === 'amp') {
                lfoGain.gain.setValueAtTime(this.params.lfoDepth * 0.5, now);
                lfoOsc.connect(lfoGain);
                lfoGain.connect(voiceGain.gain);
            }
            lfoOsc.start(now);
            lfoOsc.stop(endTime + aR + 0.05);
        }

        // Start Oscillators
        osc1.start(now);
        osc2.start(now);

        const stopTime = endTime + aR + 0.05;
        osc1.stop(stopTime);
        osc2.stop(stopTime);

        // Cleanup nodes after finish to avoid leaks
        setTimeout(() => {
            try {
                osc1.disconnect();
                osc2.disconnect();
                if (subOsc) subOsc.disconnect();
                if (noiseSource) noiseSource.disconnect();
                if (lfoOsc) lfoOsc.disconnect();
                filter.disconnect();
                voiceGain.disconnect();
            } catch (e) {
                // Ignore disconnected warnings
            }
        }, Math.max(10, (stopTime - ctx.currentTime) * 1000 + 100));
    }

    /**
     * Interactive noteOn for keyboard auditioning / live play
     * @param {number} midiPitch 
     * @param {number} velocity 
     */
    noteOn(midiPitch, velocity = 100) {
        this.noteOff(midiPitch); // clear any existing voice on same note

        const velNorm = Math.max(0.1, Math.min(1.0, velocity / 127));
        const baseFreq = SynthEngine.midiToFreq(midiPitch);
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const voiceGain = ctx.createGain();
        const peakGain = this.params.voiceGain * velNorm;
        const aA = Math.max(0.005, this.params.ampAttack);
        const aD = Math.max(0.005, this.params.ampDecay);
        const aS = Math.max(0.0, Math.min(1.0, this.params.ampSustain));

        voiceGain.gain.setValueAtTime(0.0001, now);
        voiceGain.gain.linearRampToValueAtTime(peakGain, now + aA);
        voiceGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peakGain * aS), now + aA + aD);

        const filter = ctx.createBiquadFilter();
        filter.type = this.params.filterType;
        filter.Q.setValueAtTime(this.params.filterResonance, now);

        const fA = Math.max(0.005, this.params.filterAttack);
        const fD = Math.max(0.005, this.params.filterDecay);
        const fS = Math.max(0.0, Math.min(1.0, this.params.filterSustain));
        const baseCutoff = Math.max(40, Math.min(18000, this.params.filterCutoff));
        const envAmount = this.params.filterEnvAmount * 8000 * velNorm;

        filter.frequency.setValueAtTime(baseCutoff, now);
        filter.frequency.linearRampToValueAtTime(Math.max(40, Math.min(20000, baseCutoff + envAmount)), now + fA);
        filter.frequency.exponentialRampToValueAtTime(Math.max(40, Math.min(20000, baseCutoff + envAmount * fS)), now + fA + fD);

        filter.connect(voiceGain);
        voiceGain.connect(this.destinationNode);

        const osc1 = ctx.createOscillator();
        osc1.type = this.params.osc1Type;
        osc1.frequency.setValueAtTime(baseFreq * Math.pow(2, this.params.osc1Octave), now);
        osc1.detune.setValueAtTime(this.params.osc1Detune, now);
        const osc1Gain = ctx.createGain();
        osc1Gain.gain.setValueAtTime(1 - this.params.oscMix, now);
        osc1.connect(osc1Gain);
        osc1Gain.connect(filter);
        osc1.start(now);

        const osc2 = ctx.createOscillator();
        osc2.type = this.params.osc2Type;
        osc2.frequency.setValueAtTime(baseFreq * Math.pow(2, this.params.osc2Octave + this.params.osc2Semi / 12), now);
        osc2.detune.setValueAtTime(this.params.osc2Detune, now);
        const osc2Gain = ctx.createGain();
        osc2Gain.gain.setValueAtTime(this.params.oscMix, now);
        osc2.connect(osc2Gain);
        osc2Gain.connect(filter);
        osc2.start(now);

        this.activeVoices.set(midiPitch, {
            osc1,
            osc2,
            filter,
            voiceGain
        });
    }

    /**
     * Interactive noteOff for keyboard release
     * @param {number} midiPitch 
     */
    noteOff(midiPitch) {
        const voice = this.activeVoices.get(midiPitch);
        if (!voice) return;
        this.activeVoices.delete(midiPitch);

        const ctx = this.ctx;
        const now = ctx.currentTime;
        const aR = Math.max(0.02, this.params.ampRelease);
        const fR = Math.max(0.02, this.params.filterRelease);

        voice.voiceGain.gain.cancelScheduledValues(now);
        voice.voiceGain.gain.setValueAtTime(Math.max(0.0001, voice.voiceGain.gain.value), now);
        voice.voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + aR);

        voice.filter.frequency.cancelScheduledValues(now);
        voice.filter.frequency.setValueAtTime(Math.max(40, voice.filter.frequency.value), now);
        voice.filter.frequency.exponentialRampToValueAtTime(Math.max(40, this.params.filterCutoff), now + fR);

        const stopTime = now + aR + 0.05;
        voice.osc1.stop(stopTime);
        voice.osc2.stop(stopTime);

        setTimeout(() => {
            try {
                voice.osc1.disconnect();
                voice.osc2.disconnect();
                voice.filter.disconnect();
                voice.voiceGain.disconnect();
            } catch (e) {}
        }, aR * 1000 + 100);
    }

    /**
     * Panic: stops all active voices immediately
     */
    allNotesOff() {
        for (const [midi] of this.activeVoices) {
            this.noteOff(midi);
        }
        this.activeVoices.clear();
    }

    setParam(paramKey, value) {
        if (this.params.hasOwnProperty(paramKey)) {
            this.params[paramKey] = value;
        }
    }
}
