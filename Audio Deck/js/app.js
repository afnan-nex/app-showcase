/**
 * AudioDeck - Application Bootstrap
 * Initializes Web Audio Engine, Project State, UI Components, and Event Wiring.
 */
import { AudioEngine } from './engine/AudioEngine.js';
import { Project } from './models/Project.js';
import { AudioClip, MidiClip, PatternClip } from './models/Clip.js';
import { StorageManager } from './storage/StorageManager.js';
import { TransportView } from './ui/TransportView.js';
import { TimelineView } from './ui/TimelineView.js';
import { BrowserView } from './ui/BrowserView.js';
import { MixerView } from './ui/MixerView.js';
import { PianoRollView } from './ui/PianoRollView.js';
import { DrumSequencerView } from './ui/DrumSequencerView.js';
import { InspectorView } from './ui/InspectorView.js';
import { ModalManager } from './ui/ModalManager.js';

class AudioDeckApp {
    constructor() {
        this.engine = new AudioEngine();
        this.project = null;

        // UI View instances
        this.transportView = null;
        this.timelineView = null;
        this.browserView = null;
        this.mixerView = null;
        this.pianoRollView = null;
        this.drumSequencerView = null;
        this.inspectorView = null;
        this.modalManager = null;
    }

    async init() {
        try {
            // 1. Initialize Audio Engine context & procedural sample library
            await this.engine.init();
        } catch (e) {
            console.warn('AudioEngine init deferred:', e);
        }

        try {
            // 2. Load last project or create Starter Demo Project
            const savedProjects = await StorageManager.listProjects();
            if (savedProjects && savedProjects.length > 0) {
                const lastProj = await StorageManager.loadProject(savedProjects[0].id, this.engine.sampleLibrary);
                this.project = lastProj || StorageManager.createDemoProject(this.engine.sampleLibrary);
            } else {
                this.project = StorageManager.createDemoProject(this.engine.sampleLibrary);
            }
        } catch (e) {
            console.warn('StorageManager project load error, using default demo:', e);
            this.project = StorageManager.createDemoProject(this.engine.sampleLibrary);
        }

        try {
            // Register project tracks with AudioEngine
            this.project.tracks.forEach(track => {
                this.engine.registerTrack(track);
            });

            // Set engine clock parameters
            this.engine.setBPM(this.project.bpm);
            this.engine.setLoop(this.project.loop.enabled, this.project.loop.startBeat, this.project.loop.endBeat);
        } catch (e) {
            console.warn('Track registration warning:', e);
        }

        // 3. Initialize Modal Manager
        this.modalManager = new ModalManager(
            document.body,
            this.engine,
            this.project,
            {
                onNewProjectConfirmed: (name, bpm) => this._createNewProject(name, bpm),
                onTemplateSelected: (templateId, name) => this._loadTemplate(templateId, name),
                onProjectLoaded: (loadedProject) => this._loadProject(loadedProject)
            }
        );

        // 4. Initialize UI Components
        this._initViews();

        // 5. Setup Project State Listeners
        this._setupProjectListeners();

        // 6. Setup Global Drop and Autoplay handlers
        this._setupGlobalEvents();

        console.log('AudioDeck initialized successfully with project:', this.project.name);
    }

    _initViews() {
        // Transport Bar
        const transportContainer = document.getElementById('transportContainer');
        this.transportView = new TransportView(
            transportContainer,
            this.engine,
            this.project,
            {
                onNewProject: () => this.modalManager.showNewProjectModal(),
                onOpenProject: () => this.modalManager.showOpenProjectModal(),
                onSaveProject: () => this.modalManager.showSaveProjectModal(),
                onExportWav: () => this.modalManager.showExportWavModal(),
                onShortcuts: () => this.modalManager.showShortcutsModal(),
                onRecordingFinished: (result) => this._handleMicRecordingFinished(result)
            }
        );

        // Arrangement Timeline
        const timelineContainer = document.getElementById('timelineContainer');
        this.timelineView = new TimelineView(
            timelineContainer,
            this.engine,
            this.project
        );

        // Sample Browser Sidebar
        const browserContainer = document.getElementById('browserContainer');
        this.browserView = new BrowserView(
            browserContainer,
            this.engine,
            this.project
        );

        // Bottom Views: Mixer, Piano Roll, Drum Sequencer, Inspector
        const mixerContainer = document.getElementById('bottomMixerContainer');
        this.mixerView = new MixerView(
            mixerContainer,
            this.engine,
            this.project
        );

        const pianoRollContainer = document.getElementById('bottomPianoRollContainer');
        this.pianoRollView = new PianoRollView(
            pianoRollContainer,
            this.engine,
            this.project
        );

        const drumContainer = document.getElementById('bottomDrumContainer');
        this.drumSequencerView = new DrumSequencerView(
            drumContainer,
            this.engine,
            this.project
        );

        const inspectorContainer = document.getElementById('bottomInspectorContainer');
        this.inspectorView = new InspectorView(
            inspectorContainer,
            this.engine,
            this.project
        );

        // Bottom Panel Tab Switcher
        this._setupBottomTabs();

        // Select initial clip for piano roll & drum sequencer
        this._syncBottomViews();
    }

    _setupBottomTabs() {
        const tabBtns = document.querySelectorAll('.bottom-tab-btn');
        const containers = {
            mixer: document.getElementById('bottomMixerContainer'),
            pianoroll: document.getElementById('bottomPianoRollContainer'),
            drumsequencer: document.getElementById('bottomDrumContainer'),
            inspector: document.getElementById('bottomInspectorContainer')
        };

        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.getAttribute('data-tab');
                this.project.activeBottomTab = tab;

                tabBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === tab));
                for (const [key, el] of Object.entries(containers)) {
                    el.style.display = key === tab ? 'block' : 'none';
                }

                this._syncBottomViews();
            });
        });

        // Set initial tab visibility
        const initialTab = this.project.activeBottomTab || 'mixer';
        tabBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === initialTab));
        for (const [key, el] of Object.entries(containers)) {
            el.style.display = key === initialTab ? 'block' : 'none';
        }
    }

    _syncBottomViews() {
        const track = this.project.getTrack(this.project.activeTrackId) || this.project.tracks[0];
        if (!track) return;
        if (!this.project.activeTrackId) {
            this.project.activeTrackId = track.id;
        }

        if (this.project.activeBottomTab === 'pianoroll') {
            // Find active or first synth clip
            let clip = this.project.findClip(this.project.activeClipId)?.clip;
            if (!clip || clip.type !== 'synth') {
                clip = track.clips.find(c => c.type === 'synth') || this.project.tracks.flatMap(t => t.clips).find(c => c.type === 'synth');
            }
            this.pianoRollView.setClip(clip);
        } else if (this.project.activeBottomTab === 'drumsequencer') {
            let clip = this.project.findClip(this.project.activeClipId)?.clip;
            if (!clip || clip.type !== 'drum') {
                clip = track.clips.find(c => c.type === 'drum') || this.project.tracks.flatMap(t => t.clips).find(c => c.type === 'drum');
            }
            this.drumSequencerView.setClip(clip);
        } else if (this.project.activeBottomTab === 'inspector') {
            this.inspectorView.update();
        }
    }

    _setupProjectListeners() {
        this.project.subscribe((changeType, detail) => {
            if (['track_added', 'track_removed', 'tracks_reordered'].includes(changeType)) {
                this.timelineView.renderTracks();
                this.mixerView.renderChannels();
            } else if (['clip_added', 'clip_updated', 'clip_split', 'clips_deleted', 'clips_duplicated', 'clips_moved', 'clip_resized'].includes(changeType)) {
                this.timelineView.renderClips();
                this._syncBottomViews();
            } else if (changeType === 'active_track_changed') {
                this._syncBottomViews();
            } else if (changeType === 'bottom_tab_changed') {
                const tab = detail.tab;
                const tabBtns = document.querySelectorAll('.bottom-tab-btn');
                tabBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === tab));
                const containers = {
                    mixer: document.getElementById('bottomMixerContainer'),
                    pianoroll: document.getElementById('bottomPianoRollContainer'),
                    drumsequencer: document.getElementById('bottomDrumContainer'),
                    inspector: document.getElementById('bottomInspectorContainer')
                };
                for (const [key, el] of Object.entries(containers)) {
                    el.style.display = key === tab ? 'block' : 'none';
                }
                this._syncBottomViews();
            } else if (changeType === 'tempo_changed') {
                this.transportView.updateUI();
            } else if (changeType === 'loop_changed') {
                this.timelineView.updateLoopRegion();
                this.transportView.updateUI();
            }
        });
    }

    _createNewProject(name, bpm) {
        // Stop playback
        this.engine.stop();

        // Clear existing tracks from audio engine
        this.project.tracks.forEach(tr => this.engine.unregisterTrack(tr.id));

        // Create new project
        this.project = new Project({
            name: name || 'Untitled Project',
            bpm: bpm || 120
        });

        // Add 3 default empty tracks
        const drumTr = this.project.addTrack('drum', 'Drums');
        const synthTr = this.project.addTrack('synth', 'Synth Lead');
        const audioTr = this.project.addTrack('audio', 'Audio Track');

        this.engine.registerTrack(drumTr);
        this.engine.registerTrack(synthTr);
        this.engine.registerTrack(audioTr);

        this.engine.setBPM(this.project.bpm);

        // Re-bind views with new project
        this.transportView.project = this.project;
        this.timelineView.project = this.project;
        this.browserView.project = this.project;
        this.mixerView.project = this.project;
        this.pianoRollView.project = this.project;
        this.drumSequencerView.project = this.project;
        this.inspectorView.project = this.project;
        this.modalManager.project = this.project;

        this.transportView.updateUI();
        this.timelineView.renderTracks();
        this.mixerView.renderChannels();
        this.mixerView.renderMaster();
        this._syncBottomViews();
    }

    _loadTemplate(templateId, name) {
        this.engine.stop();
        this.project.tracks.forEach(tr => this.engine.unregisterTrack(tr.id));

        const tmpl = StorageManager.createTemplateProject(templateId, this.engine.sampleLibrary);
        if (name) tmpl.name = name;

        this.project = tmpl;
        this.project.tracks.forEach(tr => this.engine.registerTrack(tr));
        this.engine.setBPM(this.project.bpm);
        this.engine.setLoop(this.project.loop.enabled, this.project.loop.startBeat, this.project.loop.endBeat);

        this.transportView.project = this.project;
        this.timelineView.project = this.project;
        this.browserView.project = this.project;
        this.mixerView.project = this.project;
        this.pianoRollView.project = this.project;
        this.drumSequencerView.project = this.project;
        this.inspectorView.project = this.project;
        this.modalManager.project = this.project;

        this.transportView.updateUI();
        this.timelineView.renderTracks();
        this.mixerView.renderChannels();
        this.mixerView.renderMaster();
        this._syncBottomViews();
    }

    _loadProject(loadedProject) {
        this.engine.stop();
        this.project.tracks.forEach(tr => this.engine.unregisterTrack(tr.id));

        this.project = loadedProject;
        this.project.tracks.forEach(tr => this.engine.registerTrack(tr));
        this.engine.setBPM(this.project.bpm);
        this.engine.setLoop(this.project.loop.enabled, this.project.loop.startBeat, this.project.loop.endBeat);

        this.transportView.project = this.project;
        this.timelineView.project = this.project;
        this.browserView.project = this.project;
        this.mixerView.project = this.project;
        this.pianoRollView.project = this.project;
        this.drumSequencerView.project = this.project;
        this.inspectorView.project = this.project;
        this.modalManager.project = this.project;

        this.transportView.updateUI();
        this.timelineView.renderTracks();
        this.mixerView.renderChannels();
        this.mixerView.renderMaster();
        this._syncBottomViews();
    }

    _handleMicRecordingFinished(result) {
        const targetTrackId = result.trackId || this.project.activeTrackId;
        let track = this.project.getTrack(targetTrackId);
        if (!track || track.type !== 'audio') {
            track = this.project.tracks.find(t => t.type === 'audio') || this.project.addTrack('audio', 'Mic Recording');
            this.engine.registerTrack(track);
        }

        const beatSec = 60 / this.project.bpm;
        const durBeats = Math.max(1, (result.audioBuffer.duration / beatSec));
        const playheadBeat = this.project.snapBeat(this.engine.secondsToBeats(this.engine.playheadPosition));

        const clip = track.addClip(new AudioClip({
            name: 'Voice Recording',
            trackId: track.id,
            startBeat: playheadBeat,
            durationBeats: durBeats,
            audioBuffer: result.audioBuffer,
            color: track.color
        }));

        this.project.notify('clip_added', { track, clip });
    }

    _setupGlobalEvents() {
        // Unlock Web Audio context on start button click or any interaction
        const unlockAudio = async () => {
            console.log('Unlocking AudioDeck Engine...');
            try {
                await this.engine.ensureContext();
            } catch (err) {
                console.warn('AudioContext ensureContext failed:', err);
            }
            const banner = document.getElementById('welcomeOverlay');
            if (banner) {
                banner.classList.add('hidden');
                setTimeout(() => {
                    if (banner && banner.parentNode) banner.remove();
                }, 300);
            }
        };

        const startBtn = document.getElementById('btnStartDeck');
        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                unlockAudio();
            });
        }

        const banner = document.getElementById('welcomeOverlay');
        if (banner) {
            banner.addEventListener('click', (e) => {
                unlockAudio();
            });
        }

        window.addEventListener('click', unlockAudio, { once: true });
        window.addEventListener('keydown', unlockAudio, { once: true });

        // Global Drag and Drop for Audio Files onto Timeline
        window.addEventListener('dragover', (e) => e.preventDefault());
        window.addEventListener('drop', async (e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
                await this.engine.ensureContext();
                const file = files[0];
                if (file.type.startsWith('audio/') || file.name.match(/\.(wav|mp3|ogg|flac|aac)$/i)) {
                    try {
                        const arrayBuffer = await file.arrayBuffer();
                        const audioBuffer = await this.engine.ctx.decodeAudioData(arrayBuffer);
                        const track = this.project.getTrack(this.project.activeTrackId) || this.project.addTrack('audio', file.name.replace(/\.[^/.]+$/, ''));
                        this.engine.registerTrack(track);

                        const beatSec = 60 / this.project.bpm;
                        const durBeats = Math.max(1, (audioBuffer.duration / beatSec));
                        const playheadBeat = this.project.snapBeat(this.engine.secondsToBeats(this.engine.playheadPosition));

                        const clip = track.addClip(new AudioClip({
                            type: 'audio',
                            name: file.name.replace(/\.[^/.]+$/, ''),
                            trackId: track.id,
                            startBeat: playheadBeat,
                            durationBeats: durBeats,
                            audioBuffer: audioBuffer,
                            color: track.color
                        }));

                        this.project.notify('clip_added', { track, clip });
                    } catch (err) {
                        console.error('Drop audio file failed:', err);
                    }
                }
            }
        });
    }
}

// Bootstrap on DOM Ready or immediately
const bootstrapAudioDeck = () => {
    const app = new AudioDeckApp();
    window.audiodeck = app;
    app.init();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapAudioDeck);
} else {
    bootstrapAudioDeck();
}
