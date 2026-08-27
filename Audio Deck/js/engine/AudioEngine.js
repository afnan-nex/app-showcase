/**
 * AudioDeck - AudioEngine
 * Core Web Audio Engine managing audio graph, high-precision lookahead scheduler,
 * track nodes, clip playback, metronome, mic recording, and offline WAV rendering.
 */
import { EffectsChain } from './EffectsChain.js';
import { SynthEngine } from './SynthEngine.js';
import { DrumEngine } from './DrumEngine.js';
import { SampleGenerator } from './SampleGenerator.js';
import { WavExporter } from './WavExporter.js';

export class AudioEngine {
    constructor() {
        this.ctx = null;
        this.isInitialized = false;
        this.isPlaying = false;
        this.isRecording = false;

        // Transport & Clock State
        this.bpm = 120;
        this.timeSignature = [4, 4]; // 4/4
        this.playheadPosition = 0; // current time in seconds
        this.playbackStartTime = 0; // ctx.currentTime when playback started
        this.playbackStartOffset = 0; // offset in seconds when play was pressed
        
        // Loop Region (in beats)
        this.loopEnabled = false;
        this.loopStartBeat = 0;
        this.loopEndBeat = 8; // 2 bars

        // Metronome
        this.metronomeEnabled = false;
        this.metronomeVolume = 0.6;
        this.lastScheduledMetronomeBeat = -1;

        // Master Graph
        this.masterEffects = null;
        this.trackEngines = new Map(); // trackId -> { effects, synth, drum, activeSources: [] }

        // Scheduler state
        this.schedulerTimer = null;
        this.lookaheadMs = 25.0; // how frequently to call scheduler (ms)
        this.scheduleAheadSec = 0.12; // how far ahead to schedule audio (sec)
        this.lastScheduledTime = 0;

        // Built-in procedural sample library
        this.sampleLibrary = {};

        // Microphone recording
        this.mediaStream = null;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.isMicRecording = false;
        this.recordTargetTrackId = null;

        // Event callbacks
        this.onPlayheadUpdate = null; // (seconds, beats) => {}
        this.onStateChange = null; // ({ isPlaying, isRecording }) => {}
        this.onTrackLevelUpdate = null; // (trackId, levels) => {}
        this.onMasterLevelUpdate = null; // (levels) => {}
    }

    /**
     * Initializes AudioContext on first user interaction to satisfy browser autoplay policies
     */
    async init() {
        if (this.isInitialized && this.ctx) {
            return;
        }

        try {
            const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtxClass) {
                console.warn('Web Audio API not supported in this browser');
                return;
            }

            this.ctx = new AudioCtxClass({
                latencyHint: 'interactive'
            });

            // Master Output Effects Chain
            this.masterEffects = new EffectsChain(this.ctx, {
                isMaster: true,
                gain: 0.85
            });

            // Master Limiter to prevent clipping
            this.masterLimiter = this.ctx.createDynamicsCompressor();
            this.masterLimiter.threshold.setValueAtTime(-0.5, this.ctx.currentTime);
            this.masterLimiter.knee.setValueAtTime(0, this.ctx.currentTime);
            this.masterLimiter.ratio.setValueAtTime(20, this.ctx.currentTime);
            this.masterLimiter.attack.setValueAtTime(0.002, this.ctx.currentTime);
            this.masterLimiter.release.setValueAtTime(0.05, this.ctx.currentTime);

            this.masterEffects.outputNode.connect(this.masterLimiter);
            this.masterLimiter.connect(this.ctx.destination);

            // Generate procedural sample library
            this.sampleLibrary = SampleGenerator.generateLibrary(this.ctx);

            this.isInitialized = true;
            this._startUIMeterLoop();
        } catch (err) {
            console.warn('AudioEngine deferred full initialization:', err);
        }
    }

    async ensureContext() {
        if (!this.isInitialized || !this.ctx) {
            await this.init();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            try {
                await this.ctx.resume();
            } catch (e) {
                console.warn('AudioContext resume deferred:', e);
            }
        }
    }

    // -------------------------------------------------------------
    // TRACK GRAPH MANAGEMENT
    // -------------------------------------------------------------

    registerTrack(track) {
        if (!this.ctx) return;
        if (this.trackEngines.has(track.id)) return;

        const effects = new EffectsChain(this.ctx, {
            gain: track.volume,
            pan: track.pan,
            mute: track.mute,
            solo: track.solo,
            hpfFreq: track.effects?.hpfFreq || 20,
            hpfBypass: track.effects?.hpfBypass !== undefined ? track.effects.hpfBypass : true,
            lpfFreq: track.effects?.lpfFreq || 20000,
            lpfBypass: track.effects?.lpfBypass !== undefined ? track.effects.lpfBypass : true,
            distortionDrive: track.effects?.distortionDrive || 0,
            distortionBypass: track.effects?.distortionBypass !== undefined ? track.effects.distortionBypass : true,
            delayTime: track.effects?.delayTime || 0.35,
            delayFeedback: track.effects?.delayFeedback || 0.3,
            delayWet: track.effects?.delayWet || 0.3,
            delayBypass: track.effects?.delayBypass !== undefined ? track.effects.delayBypass : true,
            reverbDecay: track.effects?.reverbDecay || 2.0,
            reverbWet: track.effects?.reverbWet || 0.25,
            reverbBypass: track.effects?.reverbBypass !== undefined ? track.effects.reverbBypass : true
        });

        // Connect track effects output to Master Input
        effects.outputNode.connect(this.masterEffects.inputNode);

        const synth = new SynthEngine(this.ctx, effects.inputNode, track.synthPreset || {});
        const drum = new DrumEngine(this.ctx, effects.inputNode, this.sampleLibrary);

        this.trackEngines.set(track.id, {
            track,
            effects,
            synth,
            drum,
            activeSources: new Set(),
            scheduledEvents: new Set()
        });

        this.updateSoloMuteStates();
    }

    unregisterTrack(trackId) {
        const engine = this.trackEngines.get(trackId);
        if (!engine) return;

        // Stop all active sources
        engine.activeSources.forEach(src => {
            try { src.stop(); src.disconnect(); } catch (e) {}
        });
        engine.activeSources.clear();

        try {
            engine.effects.outputNode.disconnect();
        } catch (e) {}

        this.trackEngines.delete(trackId);
        this.updateSoloMuteStates();
    }

    updateSoloMuteStates() {
        let anySolo = false;
        for (const [_, eng] of this.trackEngines) {
            if (eng.track.solo) {
                anySolo = true;
                break;
            }
        }

        for (const [_, eng] of this.trackEngines) {
            if (anySolo) {
                // If any track is soloed, only soloed tracks sound
                const shouldSound = eng.track.solo && !eng.track.mute;
                eng.effects.setMute(!shouldSound);
            } else {
                // Normal mute behavior
                eng.effects.setMute(eng.track.mute);
            }
        }
    }

    // -------------------------------------------------------------
    // TRANSPORT & SCHEDULER
    // -------------------------------------------------------------

    setBPM(bpm) {
        this.bpm = Math.max(20, Math.min(300, bpm));
    }

    secondsToBeats(sec) {
        return sec * (this.bpm / 60);
    }

    beatsToSeconds(beat) {
        return beat * (60 / this.bpm);
    }

    async play(project) {
        await this.ensureContext();
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.playbackStartTime = this.ctx.currentTime;
        this.playbackStartOffset = this.playheadPosition;
        this.lastScheduledTime = this.playbackStartOffset;
        this.lastScheduledMetronomeBeat = Math.floor(this.secondsToBeats(this.playbackStartOffset)) - 1;

        this._startScheduler(project);
        if (this.onStateChange) this.onStateChange({ isPlaying: true, isRecording: this.isRecording });
    }

    pause() {
        if (!this.isPlaying) return;
        this.isPlaying = false;
        this._stopScheduler();
        this._stopAllActiveSources();

        // Update playhead position to current
        if (this.ctx) {
            const elapsed = this.ctx.currentTime - this.playbackStartTime;
            this.playheadPosition = this._calculateCurrentTime(elapsed);
        }

        if (this.onStateChange) this.onStateChange({ isPlaying: false, isRecording: this.isRecording });
    }

    stop() {
        this.isPlaying = false;
        this.isRecording = false;
        this._stopScheduler();
        this._stopAllActiveSources();

        // Return to start or loop start
        this.playheadPosition = this.loopEnabled ? this.beatsToSeconds(this.loopStartBeat) : 0;
        this.playbackStartOffset = this.playheadPosition;

        if (this.onPlayheadUpdate) {
            this.onPlayheadUpdate(this.playheadPosition, this.secondsToBeats(this.playheadPosition));
        }
        if (this.onStateChange) this.onStateChange({ isPlaying: false, isRecording: false });
    }

    seek(seconds, project) {
        const wasPlaying = this.isPlaying;
        if (wasPlaying) {
            this._stopAllActiveSources();
        }

        this.playheadPosition = Math.max(0, seconds);
        this.playbackStartOffset = this.playheadPosition;
        if (this.ctx) {
            this.playbackStartTime = this.ctx.currentTime;
        }
        this.lastScheduledTime = this.playbackStartOffset;
        this.lastScheduledMetronomeBeat = Math.floor(this.secondsToBeats(this.playbackStartOffset)) - 1;

        if (this.onPlayheadUpdate) {
            this.onPlayheadUpdate(this.playheadPosition, this.secondsToBeats(this.playheadPosition));
        }

        if (wasPlaying && project) {
            this._scheduleEvents(project);
        }
    }

    setLoop(enabled, startBeat, endBeat) {
        this.loopEnabled = !!enabled;
        if (startBeat !== undefined) this.loopStartBeat = Math.max(0, startBeat);
        if (endBeat !== undefined) this.loopEndBeat = Math.max(this.loopStartBeat + 0.25, endBeat);
    }

    _calculateCurrentTime(elapsedSec) {
        let time = this.playbackStartOffset + elapsedSec;
        if (this.loopEnabled) {
            const loopStartSec = this.beatsToSeconds(this.loopStartBeat);
            const loopEndSec = this.beatsToSeconds(this.loopEndBeat);
            const loopDuration = loopEndSec - loopStartSec;

            if (loopDuration > 0 && time >= loopEndSec) {
                const over = time - loopStartSec;
                time = loopStartSec + (over % loopDuration);
            }
        }
        return time;
    }

    _startScheduler(project) {
        const scheduleLoop = () => {
            if (!this.isPlaying) return;

            const now = this.ctx.currentTime;
            const elapsed = now - this.playbackStartTime;
            let currentProjTime = this._calculateCurrentTime(elapsed);

            this.playheadPosition = currentProjTime;
            if (this.onPlayheadUpdate) {
                this.onPlayheadUpdate(this.playheadPosition, this.secondsToBeats(this.playheadPosition));
            }

            // Schedule audio events for the next lookahead window
            this._scheduleEvents(project);

            this.schedulerTimer = setTimeout(scheduleLoop, this.lookaheadMs);
        };

        scheduleLoop();
    }

    _stopScheduler() {
        if (this.schedulerTimer) {
            clearTimeout(this.schedulerTimer);
            this.schedulerTimer = null;
        }
    }

    _scheduleEvents(project) {
        if (!project || !this.ctx) return;

        const now = this.ctx.currentTime;
        const windowStart = this.playheadPosition;
        const windowEnd = this.playheadPosition + this.scheduleAheadSec;

        const loopStartSec = this.beatsToSeconds(this.loopStartBeat);
        const loopEndSec = this.beatsToSeconds(this.loopEndBeat);
        const isLooping = this.loopEnabled && loopEndSec > loopStartSec;

        // Schedule metronome
        if (this.metronomeEnabled) {
            const currentBeat = this.secondsToBeats(this.playheadPosition);
            const endBeat = this.secondsToBeats(windowEnd);
            for (let b = Math.floor(currentBeat); b <= Math.floor(endBeat); b++) {
                if (b > this.lastScheduledMetronomeBeat && b >= 0) {
                    const beatTime = this.beatsToSeconds(b);
                    const scheduleAudioTime = now + (beatTime - this.playheadPosition);
                    if (scheduleAudioTime >= now - 0.01) {
                        this._triggerMetronomeClick(scheduleAudioTime, b % this.timeSignature[0] === 0);
                        this.lastScheduledMetronomeBeat = b;
                    }
                }
            }
        }

        // Schedule clips across all tracks
        project.tracks.forEach(track => {
            const eng = this.trackEngines.get(track.id);
            if (!eng) return;

            track.clips.forEach(clip => {
                const clipStartSec = this.beatsToSeconds(clip.startBeat);
                const clipEndSec = clipStartSec + this.beatsToSeconds(clip.durationBeats);

                // Check if clip falls in schedule window
                if (clipEndSec >= windowStart && clipStartSec <= windowEnd) {
                    // Audio Clip
                    if (track.type === 'audio' && clip.audioBuffer) {
                        this._scheduleAudioClip(eng, clip, clipStartSec, windowStart, now);
                    }
                    // Synth Track (Piano roll notes)
                    else if (track.type === 'synth' && clip.notes) {
                        this._scheduleMidiNotes(eng, clip, clipStartSec, windowStart, windowEnd, now);
                    }
                    // Drum Track (Pattern steps)
                    else if (track.type === 'drum' && clip.pattern) {
                        this._scheduleDrumPattern(eng, clip, clipStartSec, windowStart, windowEnd, now);
                    }
                }
            });
        });
    }

    _scheduleAudioClip(eng, clip, clipStartSec, windowStart, now) {
        // Prevent duplicate scheduling within active sources
        if (clip._scheduledPlayTime && Math.abs(clip._scheduledPlayTime - windowStart) < 0.05) {
            return;
        }

        const buffer = clip.audioBuffer;
        if (!buffer) return;

        let offsetInClip = 0;
        let startDelay = clipStartSec - windowStart;

        if (startDelay < 0) {
            // Already past clip start, start mid-buffer
            offsetInClip = Math.abs(startDelay) + (clip.offsetSeconds || 0);
            startDelay = 0;
        } else {
            offsetInClip = clip.offsetSeconds || 0;
        }

        const playDuration = Math.min(buffer.duration - offsetInClip, this.beatsToSeconds(clip.durationBeats));
        if (playDuration <= 0.01) return;

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        
        const clipGain = this.ctx.createGain();
        clipGain.gain.setValueAtTime(clip.volume !== undefined ? clip.volume : 1.0, now);

        source.connect(clipGain);
        clipGain.connect(eng.effects.inputNode);

        const scheduledTime = now + startDelay;
        source.start(scheduledTime, offsetInClip, playDuration);
        clip._scheduledPlayTime = windowStart;

        eng.activeSources.add(source);
        source.onended = () => {
            eng.activeSources.delete(source);
            try { source.disconnect(); clipGain.disconnect(); } catch (e) {}
        };
    }

    _scheduleMidiNotes(eng, clip, clipStartSec, windowStart, windowEnd, now) {
        clip.notes.forEach(note => {
            const noteStartSec = clipStartSec + this.beatsToSeconds(note.startBeat);
            const noteDurSec = this.beatsToSeconds(note.durationBeats);

            if (noteStartSec >= windowStart - 0.01 && noteStartSec < windowEnd) {
                const noteKey = `${clip.id}_${note.id || note.startBeat}_${note.pitch}`;
                if (eng.scheduledEvents.has(noteKey)) return;

                const scheduleAudioTime = now + (noteStartSec - windowStart);
                eng.synth.triggerNote(note.pitch, note.velocity || 100, scheduleAudioTime, noteDurSec);
                eng.scheduledEvents.add(noteKey);

                setTimeout(() => {
                    eng.scheduledEvents.delete(noteKey);
                }, (this.scheduleAheadSec + noteDurSec + 0.2) * 1000);
            }
        });
    }

    _scheduleDrumPattern(eng, clip, clipStartSec, windowStart, windowEnd, now) {
        // Pattern format: { steps: 16, tracks: [{ voiceIndex: 0, steps: [1, 0, 0, ...] }] }
        if (!clip.pattern || !clip.pattern.tracks) return;

        const steps = clip.pattern.steps || 16;
        const stepBeatDuration = (clip.durationBeats || 4) / steps;
        const stepSec = this.beatsToSeconds(stepBeatDuration);

        clip.pattern.tracks.forEach(trackRow => {
            const voiceIdx = trackRow.voiceIndex;
            trackRow.steps.forEach((stepVal, stepIdx) => {
                if (stepVal > 0) {
                    const stepStartSec = clipStartSec + (stepIdx * stepSec);
                    if (stepStartSec >= windowStart - 0.01 && stepStartSec < windowEnd) {
                        const stepKey = `${clip.id}_${voiceIdx}_${stepIdx}`;
                        if (eng.scheduledEvents.has(stepKey)) return;

                        const scheduleAudioTime = now + (stepStartSec - windowStart);
                        const vel = typeof stepVal === 'number' && stepVal > 1 ? stepVal : 100;
                        eng.drum.triggerDrum(voiceIdx, vel, scheduleAudioTime);
                        eng.scheduledEvents.add(stepKey);

                        setTimeout(() => {
                            eng.scheduledEvents.delete(stepKey);
                        }, (this.scheduleAheadSec + 0.2) * 1000);
                    }
                }
            });
        });
    }

    _triggerMetronomeClick(time, isAccent = false) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(isAccent ? 1200 : 800, time);
        gain.gain.setValueAtTime(this.metronomeVolume * (isAccent ? 1.0 : 0.6), time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
        osc.connect(gain);
        gain.connect(this.masterEffects.inputNode);
        osc.start(time);
        osc.stop(time + 0.05);
    }

    _stopAllActiveSources() {
        for (const [_, eng] of this.trackEngines) {
            eng.activeSources.forEach(src => {
                try { src.stop(); src.disconnect(); } catch (e) {}
            });
            eng.activeSources.clear();
            eng.scheduledEvents.clear();
            eng.synth.allNotesOff();
        }
    }

    _startUIMeterLoop() {
        const updateMeters = () => {
            if (this.masterEffects && this.onMasterLevelUpdate) {
                this.onMasterLevelUpdate(this.masterEffects.getLevels());
            }

            if (this.onTrackLevelUpdate) {
                for (const [trackId, eng] of this.trackEngines) {
                    this.onTrackLevelUpdate(trackId, eng.effects.getLevels());
                }
            }

            requestAnimationFrame(updateMeters);
        };
        requestAnimationFrame(updateMeters);
    }

    // -------------------------------------------------------------
    // MICROPHONE LIVE RECORDING
    // -------------------------------------------------------------

    async startRecording(targetTrackId) {
        await this.ensureContext();
        try {
            this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.recordedChunks = [];
            this.mediaRecorder = new MediaRecorder(this.mediaStream);
            this.recordTargetTrackId = targetTrackId;

            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) this.recordedChunks.push(e.data);
            };

            this.mediaRecorder.start(50);
            this.isRecording = true;
            this.isMicRecording = true;
            if (this.onStateChange) this.onStateChange({ isPlaying: this.isPlaying, isRecording: true });
            return true;
        } catch (err) {
            console.error('Microphone access error:', err);
            return false;
        }
    }

    async stopRecording() {
        if (!this.isMicRecording || !this.mediaRecorder) return null;

        return new Promise((resolve) => {
            this.mediaRecorder.onstop = async () => {
                const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
                const arrayBuffer = await blob.arrayBuffer();
                try {
                    const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
                    this.isRecording = false;
                    this.isMicRecording = false;
                    if (this.mediaStream) {
                        this.mediaStream.getTracks().forEach(t => t.stop());
                    }
                    if (this.onStateChange) this.onStateChange({ isPlaying: this.isPlaying, isRecording: false });
                    resolve({ audioBuffer, trackId: this.recordTargetTrackId });
                } catch (e) {
                    console.error('Audio decode failed:', e);
                    resolve(null);
                }
            };
            this.mediaRecorder.stop();
        });
    }

    // -------------------------------------------------------------
    // OFFLINE AUDIO RENDERING / WAV EXPORT
    // -------------------------------------------------------------

    /**
     * Renders the entire project or loop region to a WAV Blob offline
     * @param {Object} project 
     * @param {Object} options { loopOnly: boolean }
     * @param {Function} onProgress (0.0 to 1.0)
     * @returns {Promise<Blob>}
     */
    async renderProjectToWav(project, options = {}, onProgress = null) {
        const bpm = project.bpm || 120;
        const beatSec = 60 / bpm;
        let startSec = 0;
        let endSec = 0;

        if (options.loopOnly && project.loop) {
            startSec = project.loop.startBeat * beatSec;
            endSec = project.loop.endBeat * beatSec;
        } else {
            // Find total duration of all clips
            let maxBeat = 16;
            project.tracks.forEach(tr => {
                tr.clips.forEach(c => {
                    const end = c.startBeat + c.durationBeats;
                    if (end > maxBeat) maxBeat = end;
                });
            });
            startSec = 0;
            endSec = maxBeat * beatSec + 1.0; // tail for reverb/delay
        }

        const totalSec = Math.max(1.0, endSec - startSec);
        const sampleRate = 44100;
        const totalSamples = Math.ceil(totalSec * sampleRate);

        const OfflineCtxClass = window.OfflineAudioContext || window.webkitOfflineAudioContext;
        const offlineCtx = new OfflineCtxClass(2, totalSamples, sampleRate);

        // Build offline Master Effects Chain
        const masterFX = new EffectsChain(offlineCtx, {
            isMaster: true,
            gain: project.masterVolume !== undefined ? project.masterVolume : 0.85
        });

        const masterLimiter = offlineCtx.createDynamicsCompressor();
        masterLimiter.threshold.setValueAtTime(-0.5, 0);
        masterLimiter.ratio.setValueAtTime(20, 0);
        masterFX.outputNode.connect(masterLimiter);
        masterLimiter.connect(offlineCtx.destination);

        // Generate offline sample library
        const offlineLibrary = SampleGenerator.generateLibrary(offlineCtx);

        // Rebuild tracks in offline context
        project.tracks.forEach(track => {
            if (track.mute) return;

            const trFX = new EffectsChain(offlineCtx, {
                gain: track.volume,
                pan: track.pan,
                hpfFreq: track.effects?.hpfFreq || 20,
                hpfBypass: track.effects?.hpfBypass !== undefined ? track.effects.hpfBypass : true,
                lpfFreq: track.effects?.lpfFreq || 20000,
                lpfBypass: track.effects?.lpfBypass !== undefined ? track.effects.lpfBypass : true,
                distortionDrive: track.effects?.distortionDrive || 0,
                distortionBypass: track.effects?.distortionBypass !== undefined ? track.effects.distortionBypass : true,
                delayTime: track.effects?.delayTime || 0.35,
                delayFeedback: track.effects?.delayFeedback || 0.3,
                delayWet: track.effects?.delayWet || 0.3,
                delayBypass: track.effects?.delayBypass !== undefined ? track.effects.delayBypass : true,
                reverbDecay: track.effects?.reverbDecay || 2.0,
                reverbWet: track.effects?.reverbWet || 0.25,
                reverbBypass: track.effects?.reverbBypass !== undefined ? track.effects.reverbBypass : true
            });

            trFX.outputNode.connect(masterFX.inputNode);

            const synth = new SynthEngine(offlineCtx, trFX.inputNode, track.synthPreset || {});
            const drum = new DrumEngine(offlineCtx, trFX.inputNode, offlineLibrary);

            // Schedule all clips on this track
            track.clips.forEach(clip => {
                const clipStart = clip.startBeat * beatSec - startSec;
                const clipDur = clip.durationBeats * beatSec;

                if (clipStart + clipDur < 0) return;

                if (track.type === 'audio' && clip.audioBuffer) {
                    const src = offlineCtx.createBufferSource();
                    src.buffer = clip.audioBuffer;
                    src.connect(trFX.inputNode);
                    const offset = clipStart < 0 ? Math.abs(clipStart) : 0;
                    const startTime = Math.max(0, clipStart);
                    const dur = Math.min(clip.audioBuffer.duration - offset, clipDur);
                    if (dur > 0) src.start(startTime, offset, dur);
                } else if (track.type === 'synth' && clip.notes) {
                    clip.notes.forEach(note => {
                        const noteStart = clipStart + note.startBeat * beatSec;
                        const noteDur = note.durationBeats * beatSec;
                        if (noteStart >= 0 && noteStart < totalSec) {
                            synth.triggerNote(note.pitch, note.velocity || 100, noteStart, noteDur);
                        }
                    });
                } else if (track.type === 'drum' && clip.pattern) {
                    const steps = clip.pattern.steps || 16;
                    const stepSec = clipDur / steps;
                    clip.pattern.tracks.forEach(row => {
                        row.steps.forEach((sVal, sIdx) => {
                            if (sVal > 0) {
                                const sTime = clipStart + sIdx * stepSec;
                                if (sTime >= 0 && sTime < totalSec) {
                                    drum.triggerDrum(row.voiceIndex, sVal > 1 ? sVal : 100, sTime);
                                }
                            }
                        });
                    });
                }
            });
        });

        if (onProgress) onProgress(0.3);
        const renderedBuffer = await offlineCtx.startRendering();
        if (onProgress) onProgress(0.9);

        const wavBlob = WavExporter.bufferToWaveBlob(renderedBuffer);
        if (onProgress) onProgress(1.0);

        return wavBlob;
    }
}
