/**
 * AudioDeck - Clip Models
 * Audio, MIDI (Piano Roll), and Drum Pattern clip data structures.
 */

export class Clip {
    constructor(options = {}) {
        this.id = options.id || 'clip_' + Math.random().toString(36).substr(2, 9);
        this.name = options.name || 'Clip';
        this.trackId = options.trackId || null;
        this.startBeat = options.startBeat !== undefined ? options.startBeat : 0;
        this.durationBeats = options.durationBeats !== undefined ? options.durationBeats : 4; // default 1 bar
        this.color = options.color || '#3b82f6';
        this.selected = false;
    }
}

export class AudioClip extends Clip {
    constructor(options = {}) {
        super(options);
        this.type = 'audio';
        this.sampleKey = options.sampleKey || null;
        this.audioBuffer = options.audioBuffer || null;
        this.offsetSeconds = options.offsetSeconds || 0;
        this.volume = options.volume !== undefined ? options.volume : 1.0;
        this.color = options.color || '#3b82f6'; // Blue
    }

    clone() {
        return new AudioClip({
            id: 'clip_' + Math.random().toString(36).substr(2, 9),
            name: this.name + ' (Copy)',
            trackId: this.trackId,
            startBeat: this.startBeat + this.durationBeats,
            durationBeats: this.durationBeats,
            sampleKey: this.sampleKey,
            audioBuffer: this.audioBuffer,
            offsetSeconds: this.offsetSeconds,
            volume: this.volume,
            color: this.color
        });
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: 'audio',
            trackId: this.trackId,
            startBeat: this.startBeat,
            durationBeats: this.durationBeats,
            sampleKey: this.sampleKey,
            offsetSeconds: this.offsetSeconds,
            volume: this.volume,
            color: this.color
        };
    }
}

export class MidiClip extends Clip {
    constructor(options = {}) {
        super(options);
        this.type = 'synth';
        // notes: array of { id, pitch (0-127), startBeat (relative to clip 0), durationBeats, velocity (0-127) }
        this.notes = options.notes ? JSON.parse(JSON.stringify(options.notes)) : [];
        this.color = options.color || '#10b981'; // Emerald Green
    }

    clone() {
        return new MidiClip({
            id: 'clip_' + Math.random().toString(36).substr(2, 9),
            name: this.name + ' (Copy)',
            trackId: this.trackId,
            startBeat: this.startBeat + this.durationBeats,
            durationBeats: this.durationBeats,
            notes: this.notes.map(n => ({ ...n, id: 'note_' + Math.random().toString(36).substr(2, 9) })),
            color: this.color
        });
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: 'synth',
            trackId: this.trackId,
            startBeat: this.startBeat,
            durationBeats: this.durationBeats,
            notes: this.notes,
            color: this.color
        };
    }
}

export class PatternClip extends Clip {
    constructor(options = {}) {
        super(options);
        this.type = 'drum';
        // pattern: { steps: 16, tracks: [{ voiceIndex: 0, steps: [1,0,0,...] }] }
        this.pattern = options.pattern ? JSON.parse(JSON.stringify(options.pattern)) : this._defaultPattern();
        this.color = options.color || '#f59e0b'; // Amber
    }

    _defaultPattern() {
        return {
            steps: 16,
            tracks: [
                { voiceIndex: 0, steps: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0] }, // Kick (4 on floor)
                { voiceIndex: 1, steps: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0] }, // Snare (2 and 4)
                { voiceIndex: 2, steps: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] }, // Closed Hat 16ths
                { voiceIndex: 3, steps: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0] }, // Open Hat offbeats
                { voiceIndex: 4, steps: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0] }, // Clap
                { voiceIndex: 5, steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }, // Tom
                { voiceIndex: 6, steps: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0] }, // Rimshot
                { voiceIndex: 7, steps: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }  // Crash
            ]
        };
    }

    clone() {
        return new PatternClip({
            id: 'clip_' + Math.random().toString(36).substr(2, 9),
            name: this.name + ' (Copy)',
            trackId: this.trackId,
            startBeat: this.startBeat + this.durationBeats,
            durationBeats: this.durationBeats,
            pattern: this.pattern,
            color: this.color
        });
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: 'drum',
            trackId: this.trackId,
            startBeat: this.startBeat,
            durationBeats: this.durationBeats,
            pattern: this.pattern,
            color: this.color
        };
    }
}
