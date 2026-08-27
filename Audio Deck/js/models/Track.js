/**
 * AudioDeck - Track Model
 * Defines multi-track channel configuration, clips collection, synth presets, and effect states.
 */
import { AudioClip, MidiClip, PatternClip } from './Clip.js';

export class Track {
    constructor(options = {}) {
        this.id = options.id || 'track_' + Math.random().toString(36).substr(2, 9);
        this.name = options.name || 'Track';
        this.type = options.type || 'audio'; // 'audio', 'synth', 'drum', 'automation'
        this.color = options.color || this._getDefaultColor(this.type);
        this.volume = options.volume !== undefined ? options.volume : 0.8;
        this.pan = options.pan !== undefined ? options.pan : 0;
        this.mute = options.mute || false;
        this.solo = options.solo || false;
        this.arm = options.arm || false;
        this.height = options.height || 90; // pixels

        // Clips collection
        this.clips = [];
        if (options.clips && Array.isArray(options.clips)) {
            this.clips = options.clips.map(c => {
                if (c.type === 'audio' || this.type === 'audio') return new AudioClip(c);
                if (c.type === 'synth' || this.type === 'synth') return new MidiClip(c);
                if (c.type === 'drum' || this.type === 'drum') return new PatternClip(c);
                return new AudioClip(c);
            });
        }

        // Effects configuration
        this.effects = Object.assign({
            hpfFreq: 20,
            hpfBypass: true,
            lpfFreq: 20000,
            lpfBypass: true,
            distortionDrive: 0,
            distortionType: 'soft',
            distortionBypass: true,
            delayTime: 0.35,
            delayFeedback: 0.3,
            delayWet: 0.3,
            delayBypass: true,
            reverbDecay: 2.0,
            reverbWet: 0.25,
            reverbBypass: true,
            compThreshold: -18,
            compRatio: 4,
            compBypass: true
        }, options.effects || {});

        // Synth instrument parameters (if synth track)
        this.synthPreset = Object.assign({
            osc1Type: 'sawtooth',
            osc1Octave: 0,
            osc1Detune: 0,
            osc2Type: 'square',
            osc2Octave: 0,
            osc2Semi: 7,
            osc2Detune: 8,
            oscMix: 0.4,
            subGain: 0.2,
            noiseGain: 0.05,
            filterType: 'lowpass',
            filterCutoff: 2400,
            filterResonance: 3.0,
            filterEnvAmount: 0.5,
            ampAttack: 0.02,
            ampDecay: 0.25,
            ampSustain: 0.6,
            ampRelease: 0.35,
            filterAttack: 0.04,
            filterDecay: 0.3,
            filterSustain: 0.3,
            filterRelease: 0.3,
            lfoRate: 2.5,
            lfoDepth: 0.15,
            lfoTarget: 'cutoff',
            lfoWave: 'sine',
            glide: 0.02,
            voiceGain: 0.75
        }, options.synthPreset || {});
    }

    _getDefaultColor(type) {
        switch (type) {
            case 'synth': return '#10b981'; // emerald
            case 'drum': return '#f59e0b'; // amber
            case 'automation': return '#8b5cf6'; // purple
            case 'audio':
            default: return '#3b82f6'; // blue
        }
    }

    addClip(clip) {
        clip.trackId = this.id;
        this.clips.push(clip);
        return clip;
    }

    removeClip(clipId) {
        const idx = this.clips.findIndex(c => c.id === clipId);
        if (idx !== -1) {
            return this.clips.splice(idx, 1)[0];
        }
        return null;
    }

    getClip(clipId) {
        return this.clips.find(c => c.id === clipId);
    }

    duplicateClip(clipId) {
        const clip = this.getClip(clipId);
        if (!clip) return null;
        const copy = clip.clone();
        copy.trackId = this.id;
        this.clips.push(copy);
        return copy;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            color: this.color,
            volume: this.volume,
            pan: this.pan,
            mute: this.mute,
            solo: this.solo,
            arm: this.arm,
            height: this.height,
            effects: this.effects,
            synthPreset: this.synthPreset,
            clips: this.clips.map(c => c.toJSON())
        };
    }
}
