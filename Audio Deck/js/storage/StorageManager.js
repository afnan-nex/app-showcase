/**
 * AudioDeck - StorageManager
 * IndexedDB persistence, project file JSON export/import, and built-in Studio Templates generator.
 */
import { Project } from '../models/Project.js';
import { Track } from '../models/Track.js';
import { AudioClip, MidiClip, PatternClip } from '../models/Clip.js';

export class StorageManager {
    static DB_NAME = 'AudioDeckDB';
    static DB_VERSION = 1;
    static STORE_PROJECTS = 'projects';

    /**
     * Initializes and opens IndexedDB
     * @returns {Promise<IDBDatabase>}
     */
    static async getDB() {
        return new Promise((resolve, reject) => {
            let done = false;
            const timer = setTimeout(() => {
                if (!done) {
                    done = true;
                    reject(new Error('IndexedDB timeout'));
                }
            }, 200);

            try {
                if (typeof window === 'undefined' || !window.indexedDB) {
                    done = true;
                    clearTimeout(timer);
                    reject(new Error('IndexedDB not supported'));
                    return;
                }
                const request = indexedDB.open(StorageManager.DB_NAME, StorageManager.DB_VERSION);
                request.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(StorageManager.STORE_PROJECTS)) {
                        const store = db.createObjectStore(StorageManager.STORE_PROJECTS, { keyPath: 'id' });
                        store.createIndex('updatedAt', 'updatedAt', { unique: false });
                    }
                };
                request.onsuccess = () => {
                    if (!done) {
                        done = true;
                        clearTimeout(timer);
                        resolve(request.result);
                    }
                };
                request.onerror = () => {
                    if (!done) {
                        done = true;
                        clearTimeout(timer);
                        reject(request.error);
                    }
                };
            } catch (err) {
                if (!done) {
                    done = true;
                    clearTimeout(timer);
                    reject(err);
                }
            }
        });
    }

    /**
     * Helper to list projects from localStorage
     * @returns {Array<{id: string, name: string, bpm: number, updatedAt: number}>}
     */
    static listLocalStorageProjects() {
        const list = [];
        try {
            if (typeof localStorage === 'undefined') return list;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('audiodeck_proj_')) {
                    const raw = localStorage.getItem(key);
                    if (raw) {
                        const parsed = JSON.parse(raw);
                        list.push({
                            id: parsed.id || key.replace('audiodeck_proj_', ''),
                            name: parsed.name || 'Untitled Project',
                            bpm: parsed.bpm || 120,
                            updatedAt: parsed.updatedAt || Date.now()
                        });
                    }
                }
            }
        } catch (e) {}
        return list;
    }

    /**
     * Saves project to IndexedDB
     * @param {Project} project 
     */
    static async saveProject(project) {
        try {
            const db = await StorageManager.getDB();
            const tx = db.transaction(StorageManager.STORE_PROJECTS, 'readwrite');
            const store = tx.objectStore(StorageManager.STORE_PROJECTS);
            const data = {
                id: project.id,
                name: project.name,
                bpm: project.bpm,
                updatedAt: Date.now(),
                data: project.serialize()
            };
            await new Promise((resolve, reject) => {
                const req = store.put(data);
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
            });
            return true;
        } catch (e) {
            console.warn('IndexedDB save failed, falling back to localStorage:', e);
            try {
                localStorage.setItem(`audiodeck_proj_${project.id}`, project.serialize());
                return true;
            } catch (err) {
                return false;
            }
        }
    }

    /**
     * Lists all saved projects in IndexedDB or localStorage
     * @returns {Promise<Array<{id: string, name: string, bpm: number, updatedAt: number}>>}
     */
    static async listProjects() {
        try {
            const db = await StorageManager.getDB();
            const tx = db.transaction(StorageManager.STORE_PROJECTS, 'readonly');
            const store = tx.objectStore(StorageManager.STORE_PROJECTS);
            return new Promise((resolve) => {
                const req = store.getAll();
                req.onsuccess = () => {
                    const list = (req.result || []).map(r => ({
                        id: r.id,
                        name: r.name,
                        bpm: r.bpm,
                        updatedAt: r.updatedAt
                    }));
                    if (list.length === 0) {
                        const localList = StorageManager.listLocalStorageProjects();
                        resolve(localList);
                    } else {
                        list.sort((a, b) => b.updatedAt - a.updatedAt);
                        resolve(list);
                    }
                };
                req.onerror = () => resolve(StorageManager.listLocalStorageProjects());
            });
        } catch (e) {
            return StorageManager.listLocalStorageProjects();
        }
    }

    /**
     * Loads a project by ID from IndexedDB
     * @param {string} id 
     * @param {Object} sampleLibrary 
     * @returns {Promise<Project|null>}
     */
    static async loadProject(id, sampleLibrary = {}) {
        try {
            const db = await StorageManager.getDB();
            const tx = db.transaction(StorageManager.STORE_PROJECTS, 'readonly');
            const store = tx.objectStore(StorageManager.STORE_PROJECTS);
            return new Promise((resolve) => {
                const req = store.get(id);
                req.onsuccess = () => {
                    if (req.result && req.result.data) {
                        const proj = new Project();
                        proj.deserialize(req.result.data, sampleLibrary);
                        resolve(proj);
                    } else {
                        resolve(null);
                    }
                };
                req.onerror = () => resolve(null);
            });
        } catch (e) {
            // Check localStorage fallback
            try {
                const raw = localStorage.getItem(`audiodeck_proj_${id}`);
                if (raw) {
                    const proj = new Project();
                    proj.deserialize(raw, sampleLibrary);
                    return proj;
                }
            } catch (err) {}
            return null;
        }
    }

    /**
     * Deletes a project from IndexedDB
     * @param {string} id 
     */
    static async deleteProject(id) {
        try {
            const db = await StorageManager.getDB();
            const tx = db.transaction(StorageManager.STORE_PROJECTS, 'readwrite');
            const store = tx.objectStore(StorageManager.STORE_PROJECTS);
            return new Promise((resolve) => {
                const req = store.delete(id);
                req.onsuccess = () => resolve(true);
                req.onerror = () => resolve(false);
            });
        } catch (e) {
            try {
                localStorage.removeItem(`audiodeck_proj_${id}`);
                return true;
            } catch (err) {
                return false;
            }
        }
    }

    /**
     * Exports project JSON file to client
     * @param {Project} project 
     */
    static exportProjectJSON(project) {
        const json = project.serialize();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const safeName = (project.name.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'audiodeck_session');
        a.download = `${safeName}.audiodeck`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 1000);
    }

    /**
     * Imports project JSON from user-selected file
     * @param {File} file 
     * @param {Object} sampleLibrary 
     * @returns {Promise<Project>}
     */
    static async importProjectJSON(file, sampleLibrary = {}) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target.result;
                    const proj = new Project();
                    const success = proj.deserialize(content, sampleLibrary);
                    if (success) {
                        resolve(proj);
                    } else {
                        reject(new Error('Invalid or corrupted .audiodeck project file'));
                    }
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    // -------------------------------------------------------------
    // STUDIO TEMPLATES & DEMO PROJECTS
    // -------------------------------------------------------------

    static getTemplateList() {
        return [
            { id: 'synthwave', name: 'Neon Horizon (Synthwave 120 BPM)', bpm: 120, desc: 'Full 5-track arrangement with 808 drums, acid bass, neon chords, arp lead, and cinematic FX.' },
            { id: 'deephouse', name: 'Midnight Groove (Deep House 124 BPM)', bpm: 124, desc: 'Punchy four-on-the-floor groove, sub bassline, and warm Rhodes chord progression.' },
            { id: 'lofi', name: 'Dust & Tape (Lo-Fi Hip-Hop 84 BPM)', bpm: 84, desc: 'Vinyl dust texture, relaxed 808 groove, and jazz 9th keys.' },
            { id: 'empty', name: 'Studio Empty Session (120 BPM)', bpm: 120, desc: 'Clean starter project with Drums, Synth, and Audio tracks ready to record.' }
        ];
    }

    /**
     * Creates a project from a selected template
     * @param {string} templateId 
     * @param {Object} sampleLibrary 
     * @returns {Project}
     */
    static createTemplateProject(templateId = 'synthwave', sampleLibrary = {}) {
        switch (templateId) {
            case 'deephouse':
                return this.createDeepHouseProject(sampleLibrary);
            case 'lofi':
                return this.createLoFiProject(sampleLibrary);
            case 'empty':
                return this.createEmptySession();
            case 'synthwave':
            default:
                return this.createDemoProject(sampleLibrary);
        }
    }

    /**
     * Template 1: Neon Horizon (Synthwave Demo)
     */
    static createDemoProject(sampleLibrary = {}) {
        const proj = new Project({
            name: 'Neon Horizon',
            bpm: 120,
            timeSignature: [4, 4],
            masterVolume: 0.88,
            loop: { enabled: true, startBeat: 0, endBeat: 16 },
            zoom: { pixelsPerBeat: 55, minZoom: 15, maxZoom: 200 },
            snap: '1/16'
        });

        // 1. Drum Machine Track
        const drumTrack = new Track({
            id: 'tr_drums',
            name: '808 Drum Machine',
            type: 'drum',
            volume: 0.9,
            pan: 0,
            color: '#f59e0b',
            effects: {
                distortionDrive: 8,
                distortionBypass: false,
                compThreshold: -14,
                compRatio: 4,
                compBypass: false
            }
        });

        const drumPatternA = {
            steps: 16,
            tracks: [
                { voiceIndex: 0, steps: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0] },
                { voiceIndex: 1, steps: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0] },
                { voiceIndex: 2, steps: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
                { voiceIndex: 3, steps: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0] },
                { voiceIndex: 4, steps: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0] },
                { voiceIndex: 5, steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0] },
                { voiceIndex: 6, steps: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1] },
                { voiceIndex: 7, steps: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
            ]
        };

        const drumPatternB = {
            steps: 16,
            tracks: [
                { voiceIndex: 0, steps: [1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0] },
                { voiceIndex: 1, steps: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0] },
                { voiceIndex: 2, steps: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
                { voiceIndex: 3, steps: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0] },
                { voiceIndex: 4, steps: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0] },
                { voiceIndex: 5, steps: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0] },
                { voiceIndex: 6, steps: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0] },
                { voiceIndex: 7, steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
            ]
        };

        drumTrack.addClip(new PatternClip({ name: 'Electro Beat A', startBeat: 0, durationBeats: 8, pattern: drumPatternA }));
        drumTrack.addClip(new PatternClip({ name: 'Electro Beat B', startBeat: 8, durationBeats: 8, pattern: drumPatternB }));
        proj.tracks.push(drumTrack);

        // 2. Bassline Track
        const bassTrack = new Track({
            id: 'tr_bass',
            name: 'Acid Saw Bass',
            type: 'synth',
            volume: 0.85,
            pan: 0,
            color: '#10b981',
            synthPreset: {
                osc1Type: 'sawtooth',
                osc1Octave: -1,
                osc2Type: 'square',
                osc2Octave: -1,
                osc2Semi: 0,
                osc2Detune: 4,
                oscMix: 0.35,
                subGain: 0.45,
                filterCutoff: 1800,
                filterResonance: 4.2,
                filterEnvAmount: 0.7,
                ampAttack: 0.01,
                ampDecay: 0.2,
                ampSustain: 0.4,
                ampRelease: 0.2
            },
            effects: {
                distortionDrive: 18,
                distortionBypass: false,
                hpfFreq: 35,
                hpfBypass: false
            }
        });

        const bassNotes1 = [
            { id: 'bn1', pitch: 29, startBeat: 0.0, durationBeats: 0.75, velocity: 110 },
            { id: 'bn2', pitch: 29, startBeat: 0.75, durationBeats: 0.5, velocity: 95 },
            { id: 'bn3', pitch: 32, startBeat: 1.5, durationBeats: 0.75, velocity: 105 },
            { id: 'bn4', pitch: 34, startBeat: 2.25, durationBeats: 0.5, velocity: 100 },
            { id: 'bn5', pitch: 36, startBeat: 3.0, durationBeats: 0.75, velocity: 115 },
            { id: 'bn6', pitch: 34, startBeat: 3.75, durationBeats: 0.25, velocity: 90 },
            { id: 'bn7', pitch: 29, startBeat: 4.0, durationBeats: 0.75, velocity: 110 },
            { id: 'bn8', pitch: 39, startBeat: 4.75, durationBeats: 0.5, velocity: 100 },
            { id: 'bn9', pitch: 36, startBeat: 5.5, durationBeats: 0.75, velocity: 105 },
            { id: 'bn10', pitch: 34, startBeat: 6.25, durationBeats: 0.5, velocity: 100 },
            { id: 'bn11', pitch: 29, startBeat: 7.0, durationBeats: 1.0, velocity: 115 }
        ];

        const bassNotes2 = [
            { id: 'bn12', pitch: 29, startBeat: 0.0, durationBeats: 0.75, velocity: 110 },
            { id: 'bn13', pitch: 29, startBeat: 0.75, durationBeats: 0.5, velocity: 95 },
            { id: 'bn14', pitch: 32, startBeat: 1.5, durationBeats: 0.75, velocity: 105 },
            { id: 'bn15', pitch: 34, startBeat: 2.25, durationBeats: 0.5, velocity: 100 },
            { id: 'bn16', pitch: 36, startBeat: 3.0, durationBeats: 0.75, velocity: 115 },
            { id: 'bn17', pitch: 39, startBeat: 3.75, durationBeats: 0.25, velocity: 95 },
            { id: 'bn18', pitch: 41, startBeat: 4.0, durationBeats: 0.75, velocity: 110 },
            { id: 'bn19', pitch: 39, startBeat: 4.75, durationBeats: 0.5, velocity: 100 },
            { id: 'bn20', pitch: 36, startBeat: 5.5, durationBeats: 0.75, velocity: 105 },
            { id: 'bn21', pitch: 34, startBeat: 6.25, durationBeats: 0.75, velocity: 100 },
            { id: 'bn22', pitch: 29, startBeat: 7.0, durationBeats: 1.0, velocity: 115 }
        ];

        bassTrack.addClip(new MidiClip({ name: 'Bass Groove A', startBeat: 0, durationBeats: 8, notes: bassNotes1 }));
        bassTrack.addClip(new MidiClip({ name: 'Bass Groove B', startBeat: 8, durationBeats: 8, notes: bassNotes2 }));
        proj.tracks.push(bassTrack);

        // 3. Poly Synth Chords Track
        const chordTrack = new Track({
            id: 'tr_chords',
            name: 'Neon Poly Chords',
            type: 'synth',
            volume: 0.75,
            pan: -0.15,
            color: '#6366f1',
            synthPreset: {
                osc1Type: 'sawtooth',
                osc1Octave: 0,
                osc1Detune: -6,
                osc2Type: 'triangle',
                osc2Octave: 0,
                osc2Semi: 0,
                osc2Detune: 8,
                oscMix: 0.45,
                filterCutoff: 3200,
                filterResonance: 1.8,
                ampAttack: 0.08,
                ampDecay: 0.4,
                ampSustain: 0.65,
                ampRelease: 0.5,
                lfoRate: 1.5,
                lfoDepth: 0.12,
                lfoTarget: 'cutoff'
            },
            effects: {
                reverbDecay: 2.8,
                reverbWet: 0.35,
                reverbBypass: false,
                delayTime: 0.375,
                delayFeedback: 0.3,
                delayWet: 0.25,
                delayBypass: false
            }
        });

        const chordNotes = [
            { id: 'ch1', pitch: 53, startBeat: 0, durationBeats: 3.5, velocity: 85 },
            { id: 'ch2', pitch: 56, startBeat: 0, durationBeats: 3.5, velocity: 85 },
            { id: 'ch3', pitch: 60, startBeat: 0, durationBeats: 3.5, velocity: 85 },
            { id: 'ch4', pitch: 63, startBeat: 0, durationBeats: 3.5, velocity: 85 },

            { id: 'ch5', pitch: 49, startBeat: 4, durationBeats: 3.5, velocity: 90 },
            { id: 'ch6', pitch: 53, startBeat: 4, durationBeats: 3.5, velocity: 90 },
            { id: 'ch7', pitch: 56, startBeat: 4, durationBeats: 3.5, velocity: 90 },
            { id: 'ch8', pitch: 60, startBeat: 4, durationBeats: 3.5, velocity: 90 },

            { id: 'ch9', pitch: 51, startBeat: 8, durationBeats: 3.5, velocity: 90 },
            { id: 'ch10', pitch: 55, startBeat: 8, durationBeats: 3.5, velocity: 90 },
            { id: 'ch11', pitch: 58, startBeat: 8, durationBeats: 3.5, velocity: 90 },
            { id: 'ch12', pitch: 61, startBeat: 8, durationBeats: 3.5, velocity: 90 },

            { id: 'ch13', pitch: 48, startBeat: 12, durationBeats: 3.5, velocity: 85 },
            { id: 'ch14', pitch: 51, startBeat: 12, durationBeats: 3.5, velocity: 85 },
            { id: 'ch15', pitch: 55, startBeat: 12, durationBeats: 3.5, velocity: 85 },
            { id: 'ch16', pitch: 58, startBeat: 12, durationBeats: 3.5, velocity: 85 }
        ];

        chordTrack.addClip(new MidiClip({ name: 'Lush Fm7 Progression', startBeat: 0, durationBeats: 16, notes: chordNotes }));
        proj.tracks.push(chordTrack);

        // 4. Lead Arp Track
        const leadTrack = new Track({
            id: 'tr_lead',
            name: 'Cyberpunk Lead Hook',
            type: 'synth',
            volume: 0.8,
            pan: 0.2,
            color: '#ec4899',
            synthPreset: {
                osc1Type: 'square',
                osc1Octave: 1,
                osc2Type: 'sawtooth',
                osc2Octave: 1,
                osc2Semi: 12,
                osc2Detune: 6,
                oscMix: 0.4,
                filterCutoff: 4500,
                filterResonance: 3.5,
                ampAttack: 0.015,
                ampDecay: 0.18,
                ampSustain: 0.4,
                ampRelease: 0.25
            },
            effects: {
                delayTime: 0.25,
                delayFeedback: 0.45,
                delayWet: 0.35,
                delayBypass: false,
                reverbDecay: 2.2,
                reverbWet: 0.25,
                reverbBypass: false
            }
        });

        const leadNotes = [];
        const scale = [65, 68, 72, 75, 77, 80, 84];
        const arpPattern = [0, 2, 4, 3, 2, 4, 5, 4, 0, 2, 4, 3, 6, 5, 4, 2];

        for (let beat = 0; beat < 16; beat += 0.5) {
            const stepIdx = Math.floor(beat * 2);
            const pitch = scale[arpPattern[stepIdx % arpPattern.length] % scale.length];
            leadNotes.push({
                id: `ld_${beat}`,
                pitch: pitch,
                startBeat: beat,
                durationBeats: 0.4,
                velocity: (beat % 2 === 0) ? 110 : 90
            });
        }

        leadTrack.addClip(new MidiClip({ name: 'Lead Arp Hook', startBeat: 0, durationBeats: 16, notes: leadNotes }));
        proj.tracks.push(leadTrack);

        // 5. FX & Texture Track
        const fxTrack = new Track({
            id: 'tr_fx',
            name: 'FX & Atmospheres',
            type: 'audio',
            volume: 0.7,
            pan: 0,
            color: '#06b6d4',
            effects: {
                reverbDecay: 3.5,
                reverbWet: 0.3,
                reverbBypass: false
            }
        });

        if (sampleLibrary['fx_vinyl']) {
            fxTrack.addClip(new AudioClip({
                name: 'Vinyl Atmosphere A',
                startBeat: 0,
                durationBeats: 8,
                sampleKey: 'fx_vinyl',
                audioBuffer: sampleLibrary['fx_vinyl'].buffer,
                volume: 0.5
            }));
            fxTrack.addClip(new AudioClip({
                name: 'Vinyl Atmosphere B',
                startBeat: 8,
                durationBeats: 8,
                sampleKey: 'fx_vinyl',
                audioBuffer: sampleLibrary['fx_vinyl'].buffer,
                volume: 0.5
            }));
        }

        if (sampleLibrary['fx_riser']) {
            fxTrack.addClip(new AudioClip({
                name: 'Cyber Riser 4-Bar',
                startBeat: 8,
                durationBeats: 8,
                sampleKey: 'fx_riser',
                audioBuffer: sampleLibrary['fx_riser'].buffer,
                volume: 0.8
            }));
        }

        if (sampleLibrary['fx_impact']) {
            fxTrack.addClip(new AudioClip({
                name: 'Sub Drop Impact',
                startBeat: 0,
                durationBeats: 4,
                sampleKey: 'fx_impact',
                audioBuffer: sampleLibrary['fx_impact'].buffer,
                volume: 0.9
            }));
        }

        proj.tracks.push(fxTrack);
        if (proj.tracks.length > 0) {
            proj.activeTrackId = proj.tracks[0].id;
            proj.activeClipId = proj.tracks[0].clips[0]?.id || null;
        }
        return proj;
    }

    /**
     * Template 2: Deep Melodic House (124 BPM)
     */
    static createDeepHouseProject(sampleLibrary = {}) {
        const proj = new Project({
            name: 'Midnight Velvet',
            bpm: 124,
            timeSignature: [4, 4],
            masterVolume: 0.9,
            loop: { enabled: true, startBeat: 0, endBeat: 16 }
        });

        const drumTrack = new Track({
            id: 'tr_house_drums',
            name: 'Club 909 Groove',
            type: 'drum',
            volume: 0.92,
            color: '#f59e0b'
        });

        drumTrack.addClip(new PatternClip({
            name: 'House 4/4 Beat',
            startBeat: 0,
            durationBeats: 16,
            pattern: {
                steps: 16,
                tracks: [
                    { voiceIndex: 0, steps: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0] },
                    { voiceIndex: 4, steps: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0] },
                    { voiceIndex: 3, steps: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0] },
                    { voiceIndex: 2, steps: [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1] }
                ]
            }
        }));
        proj.tracks.push(drumTrack);

        const bassTrack = new Track({
            id: 'tr_house_bass',
            name: 'Deep Sub Bass',
            type: 'synth',
            volume: 0.88,
            color: '#10b981',
            synthPreset: {
                osc1Type: 'sine',
                osc1Octave: -1,
                osc2Type: 'triangle',
                osc2Octave: -1,
                subGain: 0.5,
                filterCutoff: 1200,
                ampAttack: 0.01,
                ampDecay: 0.3
            }
        });

        const houseBassNotes = [
            { id: 'hb1', pitch: 33, startBeat: 0.5, durationBeats: 0.75, velocity: 100 }, // A1
            { id: 'hb2', pitch: 33, startBeat: 1.75, durationBeats: 0.5, velocity: 90 },
            { id: 'hb3', pitch: 36, startBeat: 2.5, durationBeats: 0.75, velocity: 105 }, // C2
            { id: 'hb4', pitch: 38, startBeat: 3.5, durationBeats: 0.5, velocity: 95 }   // D2
        ];
        bassTrack.addClip(new MidiClip({ name: 'Deep Bassline', startBeat: 0, durationBeats: 16, notes: houseBassNotes }));
        proj.tracks.push(bassTrack);
        if (proj.tracks.length > 0) {
            proj.activeTrackId = proj.tracks[0].id;
            proj.activeClipId = proj.tracks[0].clips[0]?.id || null;
        }
        return proj;
    }

    /**
     * Template 3: Lo-Fi Hip-Hop (84 BPM)
     */
    static createLoFiProject(sampleLibrary = {}) {
        const proj = new Project({
            name: 'Dust & Tape',
            bpm: 84,
            timeSignature: [4, 4],
            masterVolume: 0.85,
            loop: { enabled: true, startBeat: 0, endBeat: 16 }
        });

        const drums = new Track({
            id: 'tr_lofi_drums',
            name: 'Boom Bap Drums',
            type: 'drum',
            volume: 0.85,
            color: '#f59e0b'
        });

        drums.addClip(new PatternClip({
            name: 'Dusty Beat',
            startBeat: 0,
            durationBeats: 16,
            pattern: {
                steps: 16,
                tracks: [
                    { voiceIndex: 0, steps: [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0] },
                    { voiceIndex: 1, steps: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0] },
                    { voiceIndex: 2, steps: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0] }
                ]
            }
        }));
        proj.tracks.push(drums);
        if (proj.tracks.length > 0) {
            proj.activeTrackId = proj.tracks[0].id;
            proj.activeClipId = proj.tracks[0].clips[0]?.id || null;
        }

        return proj;
    }

    /**
     * Template 4: Clean Studio Empty Session
     */
    static createEmptySession() {
        const proj = new Project({
            name: 'Studio Session',
            bpm: 120,
            timeSignature: [4, 4],
            masterVolume: 0.88
        });

        proj.addTrack('drum', 'Drums');
        proj.addTrack('synth', 'Synth Lead');
        proj.addTrack('audio', 'Audio Track');
        if (proj.tracks.length > 0) {
            proj.activeTrackId = proj.tracks[0].id;
            proj.activeClipId = proj.tracks[0].clips[0]?.id || null;
        }
        return proj;
    }
}
