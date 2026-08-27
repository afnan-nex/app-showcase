/**
 * AudioDeck - DrumEngine
 * Multi-voice synthesizer and sampler for drum machine tracks and step sequencer.
 */
export class DrumEngine {
    /**
     * @param {AudioContext|BaseAudioContext} ctx 
     * @param {AudioNode} destinationNode 
     * @param {Object} sampleLibrary 
     */
    constructor(ctx, destinationNode, sampleLibrary = {}) {
        this.ctx = ctx;
        this.destinationNode = destinationNode;
        this.sampleLibrary = sampleLibrary;

        // Drum voice definitions (8 drum channels)
        this.voices = [
            { id: 'kick', name: 'Kick Drum', sampleKey: 'kick_808', pitch: 1.0, decay: 1.0, volume: 1.0 },
            { id: 'snare', name: 'Snare Drum', sampleKey: 'snare_808', pitch: 1.0, decay: 1.0, volume: 0.9 },
            { id: 'hat_closed', name: 'Closed Hat', sampleKey: 'hat_closed', pitch: 1.0, decay: 1.0, volume: 0.8 },
            { id: 'hat_open', name: 'Open Hat', sampleKey: 'hat_open', pitch: 1.0, decay: 1.0, volume: 0.85 },
            { id: 'clap', name: 'Clap', sampleKey: 'clap_tight', pitch: 1.0, decay: 1.0, volume: 0.9 },
            { id: 'tom', name: 'Analog Tom', sampleKey: 'tom_low', pitch: 1.0, decay: 1.0, volume: 0.85 },
            { id: 'rim', name: 'Rimshot Perc', sampleKey: 'rim_shot', pitch: 1.0, decay: 1.0, volume: 0.8 },
            { id: 'crash', name: 'Crash Cymbal', sampleKey: 'crash_cymbal', pitch: 1.0, decay: 1.0, volume: 0.75 }
        ];
    }

    /**
     * Updates sample library reference
     * @param {Object} lib 
     */
    setLibrary(lib) {
        this.sampleLibrary = lib;
    }

    /**
     * Triggers a drum voice at exact Web Audio time
     * @param {number|string} voiceIndexOrId 
     * @param {number} velocity (0 - 127)
     * @param {number} startTime (ctx.currentTime seconds)
     */
    triggerDrum(voiceIndexOrId, velocity = 100, startTime = 0) {
        let voice = null;
        if (typeof voiceIndexOrId === 'number') {
            voice = this.voices[voiceIndexOrId];
        } else {
            voice = this.voices.find(v => v.id === voiceIndexOrId);
        }
        if (!voice) return;

        const ctx = this.ctx;
        const now = Math.max(ctx.currentTime, startTime);
        const velNorm = Math.max(0.1, Math.min(1.0, velocity / 127));
        const sample = this.sampleLibrary[voice.sampleKey]?.buffer;

        if (sample) {
            // Play AudioBuffer through gain & pitch
            const source = ctx.createBufferSource();
            source.buffer = sample;
            source.playbackRate.setValueAtTime(voice.pitch, now);

            const gain = ctx.createGain();
            const gainVal = voice.volume * velNorm;
            gain.gain.setValueAtTime(gainVal, now);

            // If decay modifier is active
            if (voice.decay < 0.95) {
                gain.gain.exponentialRampToValueAtTime(0.001, now + sample.duration * voice.decay);
            }

            source.connect(gain);
            gain.connect(this.destinationNode);

            source.start(now);
            source.stop(now + sample.duration * voice.decay + 0.1);
        } else {
            // Fallback synthesis if buffer not ready
            this._synthesizeDrumFallback(voice.id, velNorm, now);
        }
    }

    _synthesizeDrumFallback(id, vel, now) {
        const ctx = this.ctx;
        if (id === 'kick') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);
            gain.gain.setValueAtTime(vel, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.connect(gain);
            gain.connect(this.destinationNode);
            osc.start(now);
            osc.stop(now + 0.45);
        } else if (id.includes('hat')) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(8000, now);
            gain.gain.setValueAtTime(vel * 0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.connect(gain);
            gain.connect(this.destinationNode);
            osc.start(now);
            osc.stop(now + 0.09);
        }
    }
}
