/**
 * AudioDeck - Project Model
 * Central data model for DAW session, tracks, clips, tempo, snapping, and undo history.
 */
import { Track } from './Track.js';
import { HistoryManager } from './HistoryManager.js';
import { AudioClip, MidiClip, PatternClip } from './Clip.js';

export class Project {
    constructor(options = {}) {
        this.id = options.id || 'proj_' + Math.random().toString(36).substr(2, 9);
        this.name = options.name || 'Untitled Project';
        this.bpm = options.bpm || 120;
        this.timeSignature = options.timeSignature || [4, 4];
        this.masterVolume = options.masterVolume !== undefined ? options.masterVolume : 0.85;

        // Loop settings
        this.loop = {
            enabled: options.loop?.enabled !== undefined ? options.loop.enabled : true,
            startBeat: options.loop?.startBeat || 0,
            endBeat: options.loop?.endBeat || 16 // 4 bars default
        };

        // UI & Timeline View state
        this.zoom = {
            pixelsPerBeat: options.zoom?.pixelsPerBeat || 50,
            minZoom: 15,
            maxZoom: 200
        };

        this.snap = options.snap || '1/16'; // 'off', '1/1', '1/2', '1/4', '1/8', '1/16', '1/32'
        this.activeTool = options.activeTool || 'pointer'; // 'pointer', 'pencil', 'scissors', 'eraser'
        this.activeTrackId = null;
        this.activeClipId = null;
        this.activeBottomTab = 'mixer'; // 'mixer', 'pianoroll', 'drumsequencer', 'inspector'

        // Tracks array
        this.tracks = [];
        if (options.tracks && Array.isArray(options.tracks)) {
            this.tracks = options.tracks.map(t => new Track(t));
        }

        if (this.tracks.length > 0) {
            this.activeTrackId = this.tracks[0].id;
        }

        // Selection sets
        this.selectedClipIds = new Set();
        this.selectedNoteIds = new Set();

        // History manager for Undo/Redo
        this.history = new HistoryManager(this);

        // Change listeners
        this.listeners = new Set();
    }

    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    notify(changeType = 'update', detail = {}) {
        this.listeners.forEach(cb => {
            try {
                cb(changeType, detail);
            } catch (e) {
                console.error('Project listener error:', e);
            }
        });
    }

    // -------------------------------------------------------------
    // SNAP FRACTION HELPER
    // -------------------------------------------------------------
    getSnapBeatValue() {
        switch (this.snap) {
            case '1/1': return 4.0;
            case '1/2': return 2.0;
            case '1/4': return 1.0;
            case '1/8': return 0.5;
            case '1/16': return 0.25;
            case '1/32': return 0.125;
            case 'off':
            default: return 0.001;
        }
    }

    snapBeat(beat) {
        const snapVal = this.getSnapBeatValue();
        if (snapVal <= 0.005) return Math.max(0, beat);
        return Math.max(0, Math.round(beat / snapVal) * snapVal);
    }

    // -------------------------------------------------------------
    // TRACK OPERATIONS
    // -------------------------------------------------------------
    addTrack(type = 'audio', name = null) {
        this.history.pushState('Add Track');
        const count = this.tracks.filter(t => t.type === type).length + 1;
        const defaultName = name || `${type.charAt(0).toUpperCase() + type.slice(1)} ${count}`;
        const track = new Track({
            type,
            name: defaultName
        });
        this.tracks.push(track);
        this.activeTrackId = track.id;
        this.notify('track_added', { track });
        return track;
    }

    removeTrack(trackId) {
        const idx = this.tracks.findIndex(t => t.id === trackId);
        if (idx !== -1) {
            this.history.pushState('Delete Track');
            const removed = this.tracks.splice(idx, 1)[0];
            if (this.activeTrackId === trackId) {
                this.activeTrackId = this.tracks.length > 0 ? this.tracks[0].id : null;
            }
            this.notify('track_removed', { trackId, track: removed });
            return removed;
        }
        return null;
    }

    duplicateTrack(trackId) {
        const original = this.getTrack(trackId);
        if (!original) return null;

        this.history.pushState('Duplicate Track');
        const json = original.toJSON();
        json.id = 'track_' + Math.random().toString(36).substr(2, 9);
        json.name = original.name + ' (Copy)';
        
        // Re-id clips
        json.clips = json.clips.map(c => {
            const copy = { ...c };
            copy.id = 'clip_' + Math.random().toString(36).substr(2, 9);
            copy.trackId = json.id;
            return copy;
        });

        const newTrack = new Track(json);
        const idx = this.tracks.findIndex(t => t.id === trackId);
        this.tracks.splice(idx + 1, 0, newTrack);
        this.activeTrackId = newTrack.id;
        this.notify('track_added', { track: newTrack });
        return newTrack;
    }

    reorderTrack(fromIdx, toIdx) {
        if (fromIdx < 0 || fromIdx >= this.tracks.length || toIdx < 0 || toIdx >= this.tracks.length) return;
        this.history.pushState('Reorder Tracks');
        const item = this.tracks.splice(fromIdx, 1)[0];
        this.tracks.splice(toIdx, 0, item);
        this.notify('tracks_reordered', { fromIdx, toIdx });
    }

    getTrack(trackId) {
        return this.tracks.find(t => t.id === trackId);
    }

    // -------------------------------------------------------------
    // CLIP OPERATIONS
    // -------------------------------------------------------------
    findClip(clipId) {
        for (const track of this.tracks) {
            const clip = track.getClip(clipId);
            if (clip) return { clip, track };
        }
        return { clip: null, track: null };
    }

    deleteSelectedClips() {
        if (this.selectedClipIds.size === 0) return;
        this.history.pushState('Delete Clips');
        this.selectedClipIds.forEach(id => {
            for (const track of this.tracks) {
                track.removeClip(id);
            }
        });
        this.selectedClipIds.clear();
        this.activeClipId = null;
        this.notify('clips_deleted');
    }

    duplicateSelectedClips() {
        if (this.selectedClipIds.size === 0) return;
        this.history.pushState('Duplicate Clips');
        const newIds = new Set();
        this.selectedClipIds.forEach(id => {
            const { clip, track } = this.findClip(id);
            if (clip && track) {
                const copy = track.duplicateClip(id);
                if (copy) newIds.add(copy.id);
            }
        });
        this.selectedClipIds = newIds;
        this.notify('clips_duplicated');
    }

    splitClipAtBeat(clipId, splitBeat) {
        const { clip, track } = this.findClip(clipId);
        if (!clip || !track) return;

        const relBeat = splitBeat - clip.startBeat;
        if (relBeat <= 0.1 || relBeat >= clip.durationBeats - 0.1) return;

        this.history.pushState('Split Clip');
        const firstDur = relBeat;
        const secondDur = clip.durationBeats - relBeat;

        clip.durationBeats = firstDur;

        let secondClip = null;
        if (clip.type === 'audio') {
            const beatSec = 60 / this.bpm;
            secondClip = new AudioClip({
                name: clip.name + ' (part 2)',
                trackId: track.id,
                startBeat: splitBeat,
                durationBeats: secondDur,
                sampleKey: clip.sampleKey,
                audioBuffer: clip.audioBuffer,
                offsetSeconds: (clip.offsetSeconds || 0) + (firstDur * beatSec),
                volume: clip.volume,
                color: clip.color
            });
        } else if (clip.type === 'synth') {
            const part1Notes = clip.notes.filter(n => n.startBeat < relBeat);
            const part2Notes = clip.notes.filter(n => n.startBeat >= relBeat).map(n => ({
                ...n,
                startBeat: n.startBeat - relBeat
            }));
            clip.notes = part1Notes;
            secondClip = new MidiClip({
                name: clip.name + ' (part 2)',
                trackId: track.id,
                startBeat: splitBeat,
                durationBeats: secondDur,
                notes: part2Notes,
                color: clip.color
            });
        } else if (clip.type === 'drum') {
            secondClip = clip.clone();
            secondClip.name = clip.name + ' (part 2)';
            secondClip.startBeat = splitBeat;
            secondClip.durationBeats = secondDur;
        }

        if (secondClip) {
            track.addClip(secondClip);
            this.selectedClipIds.clear();
            this.selectedClipIds.add(secondClip.id);
            this.activeClipId = secondClip.id;
            this.notify('clip_split', { track, original: clip, split: secondClip });
        }
    }

    // -------------------------------------------------------------
    // SERIALIZATION & PERSISTENCE
    // -------------------------------------------------------------
    serialize() {
        return JSON.stringify({
            version: 1,
            id: this.id,
            name: this.name,
            bpm: this.bpm,
            timeSignature: this.timeSignature,
            masterVolume: this.masterVolume,
            loop: this.loop,
            zoom: this.zoom,
            snap: this.snap,
            activeBottomTab: this.activeBottomTab,
            tracks: this.tracks.map(t => t.toJSON())
        });
    }

    deserialize(jsonString, sampleLibrary = {}) {
        try {
            const data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
            this.id = data.id || this.id;
            this.name = data.name || this.name;
            this.bpm = data.bpm || 120;
            this.timeSignature = data.timeSignature || [4, 4];
            this.masterVolume = data.masterVolume !== undefined ? data.masterVolume : 0.85;
            this.loop = data.loop || { enabled: true, startBeat: 0, endBeat: 16 };
            this.zoom = data.zoom || { pixelsPerBeat: 50, minZoom: 15, maxZoom: 200 };
            this.snap = data.snap || '1/16';
            this.activeBottomTab = data.activeBottomTab || 'mixer';

            this.tracks = (data.tracks || []).map(t => {
                const track = new Track(t);
                // Relink sample library buffers to audio clips
                track.clips.forEach(c => {
                    if (c.type === 'audio' && c.sampleKey && sampleLibrary[c.sampleKey]) {
                        c.audioBuffer = sampleLibrary[c.sampleKey].buffer;
                    }
                });
                return track;
            });

            this.activeTrackId = this.tracks.length > 0 ? this.tracks[0].id : null;
            this.selectedClipIds.clear();
            this.selectedNoteIds.clear();
            this.notify('project_loaded');
            return true;
        } catch (e) {
            console.error('Project deserialization error:', e);
            return false;
        }
    }
}
