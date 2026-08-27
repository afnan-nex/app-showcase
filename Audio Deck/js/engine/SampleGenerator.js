/**
 * AudioDeck - SampleGenerator
 * Generates studio-quality procedural audio buffers (drum one-shots, acoustic/electronic hybrid hits,
 * synth keys, chords, bass hits, textures, and tempo-synced loops) completely client-side in Web Audio.
 * 100% offline and zero CORS dependencies.
 */
export class SampleGenerator {
    /**
     * Creates an empty AudioBuffer
     * @param {AudioContext|BaseAudioContext} ctx 
     * @param {number} durationSeconds 
     * @param {number} channels 
     * @returns {AudioBuffer}
     */
    static createBuffer(ctx, durationSeconds, channels = 2) {
        const sampleRate = ctx.sampleRate || 44100;
        const length = Math.max(1, Math.floor(sampleRate * durationSeconds));
        return ctx.createBuffer(channels, length, sampleRate);
    }

    /**
     * Generates an extensive library of high-fidelity drum one-shots, synth keys, FX, and loops
     * @param {AudioContext|BaseAudioContext} ctx 
     * @returns {Object<string, {name: string, category: string, buffer: AudioBuffer, bpm?: number, bars?: number, key?: string}>}
     */
    static generateLibrary(ctx) {
        const sr = ctx.sampleRate || 44100;
        const library = {};

        const softClip = (x, drive = 1.2) => Math.tanh(x * drive);
        const noise = () => Math.random() * 2 - 1;

        // -------------------------------------------------------------
        // 1. DRUMS & PERCUSSION ONE-SHOTS
        // -------------------------------------------------------------

        // 808 Deep Sub Kick
        {
            const dur = 0.65;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                const phase = 2 * Math.PI * (40 * t + (140 / 30) * (1 - Math.exp(-t * 30)));
                const click = (t < 0.006) ? (1 - t / 0.006) * noise() * 0.35 : 0;
                const amp = Math.exp(-t * 5.2);
                const s = softClip(Math.sin(phase) * amp * 1.15 + click, 1.4);
                L[i] = s * 0.92;
                R[i] = s * 0.92;
            }
            library['kick_808'] = { name: '808 Deep Sub Kick', category: 'Drums', buffer: buf };
        }

        // 909 Punchy Club Kick
        {
            const dur = 0.38;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                const phase = 2 * Math.PI * (52 * t + (280 / 48) * (1 - Math.exp(-t * 48)));
                const click = (t < 0.008) ? (1 - t / 0.008) * Math.sin(2 * Math.PI * 2200 * t) * 0.8 : 0;
                const amp = Math.exp(-t * 10.5);
                const s = softClip(Math.sin(phase) * amp + click, 1.5);
                L[i] = s * 0.95;
                R[i] = s * 0.95;
            }
            library['kick_punch'] = { name: '909 Punchy Club Kick', category: 'Drums', buffer: buf };
        }

        // Acoustic Thud Kick
        {
            const dur = 0.42;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                const phase = 2 * Math.PI * (58 * t + (160 / 38) * (1 - Math.exp(-t * 38)));
                const air = (t < 0.02) ? noise() * Math.exp(-t * 80) * 0.4 : 0;
                const amp = Math.exp(-t * 8.5);
                const s = softClip(Math.sin(phase) * amp * 0.9 + air, 1.2);
                L[i] = s * 0.88;
                R[i] = s * 0.88;
            }
            library['kick_acoustic'] = { name: 'Studio Thud Kick', category: 'Drums', buffer: buf };
        }

        // 808 Analog Snare
        {
            const dur = 0.40;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                const toneFreq = 180 * Math.exp(-t * 22) + 115;
                const tone = Math.sin(2 * Math.PI * toneFreq * t) * Math.exp(-t * 16);
                const n = noise() * Math.exp(-t * 11);
                const s = softClip(tone * 0.55 + n * 0.75, 1.25);
                L[i] = s * 0.85;
                R[i] = s * 0.85;
            }
            library['snare_808'] = { name: '808 Analog Snare', category: 'Drums', buffer: buf };
        }

        // Crisp Studio Snare
        {
            const dur = 0.34;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                const body = Math.sin(2 * Math.PI * 210 * t) * Math.exp(-t * 24) * 0.5;
                const snap = Math.sin(2 * Math.PI * 460 * t) * Math.exp(-t * 36) * 0.45;
                const nL = noise() * Math.exp(-t * 13);
                const nR = noise() * Math.exp(-t * 13);
                L[i] = softClip(body + snap + nL * 0.7, 1.3) * 0.82;
                R[i] = softClip(body + snap + nR * 0.7, 1.3) * 0.82;
            }
            library['snare_crisp'] = { name: 'Crisp Studio Snare', category: 'Drums', buffer: buf };
        }

        // Layered Studio Clap
        {
            const dur = 0.45;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                let burst = 0;
                if (t < 0.01) burst = Math.exp(-t * 110);
                else if (t >= 0.011 && t < 0.021) burst = Math.exp(-(t - 0.011) * 110);
                else if (t >= 0.022 && t < 0.033) burst = Math.exp(-(t - 0.022) * 110);
                else if (t >= 0.034) burst = Math.exp(-(t - 0.034) * 16);
                const nL = noise();
                const nR = noise();
                L[i] = softClip(nL * burst * 1.35, 1.2) * 0.82;
                R[i] = softClip(nR * burst * 1.35, 1.2) * 0.82;
            }
            library['clap_tight'] = { name: 'Layered Studio Clap', category: 'Drums', buffer: buf };
        }

        // Closed Hi-Hat
        {
            const dur = 0.09;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                const metallic = (Math.sin(2 * Math.PI * 3450 * t) > 0 ? 1 : -1) +
                                 (Math.sin(2 * Math.PI * 4820 * t) > 0 ? 1 : -1) +
                                 (Math.sin(2 * Math.PI * 6340 * t) > 0 ? 1 : -1);
                const env = Math.exp(-t * 58);
                const s = (metallic * 0.25 + noise() * 0.75) * env;
                L[i] = s * 0.65;
                R[i] = s * 0.65;
            }
            library['hat_closed'] = { name: 'Closed Hi-Hat 16th', category: 'Drums', buffer: buf };
        }

        // Open Sizzle Hi-Hat
        {
            const dur = 0.48;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                const metallic = (Math.sin(2 * Math.PI * 3420 * t) > 0 ? 1 : -1) +
                                 (Math.sin(2 * Math.PI * 4780 * t) > 0 ? 1 : -1) +
                                 (Math.sin(2 * Math.PI * 6200 * t) > 0 ? 1 : -1);
                const env = Math.exp(-t * 8.5);
                const sL = (metallic * 0.28 + noise() * 0.72) * env;
                const sR = (metallic * 0.28 + noise() * 0.72) * env;
                L[i] = sL * 0.68;
                R[i] = sR * 0.68;
            }
            library['hat_open'] = { name: 'Open Sizzle Hi-Hat', category: 'Drums', buffer: buf };
        }

        // Analog Low Tom
        {
            const dur = 0.42;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                const freq = 85 + 150 * Math.exp(-t * 24);
                const env = Math.exp(-t * 8.5);
                const s = Math.sin(2 * Math.PI * freq * t) * env;
                L[i] = s * 0.82;
                R[i] = s * 0.82;
            }
            library['tom_low'] = { name: 'Analog Low Tom', category: 'Drums', buffer: buf };
        }

        // Rimshot Percussion
        {
            const dur = 0.14;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                const env = Math.exp(-t * 38);
                const ring = Math.sin(2 * Math.PI * 1480 * t) * 0.65 + noise() * 0.35;
                const s = ring * env;
                L[i] = s * 0.78;
                R[i] = s * 0.78;
            }
            library['rim_shot'] = { name: 'Studio Rimshot Perc', category: 'Drums', buffer: buf };
        }

        // Shaker Hit
        {
            const dur = 0.12;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                const env = (t < 0.02 ? t / 0.02 : Math.exp(-(t - 0.02) * 35));
                const sL = noise() * env * 0.6;
                const sR = noise() * env * 0.6;
                L[i] = sL;
                R[i] = sR;
            }
            library['shaker_hit'] = { name: 'Cabasa Shaker Hit', category: 'Drums', buffer: buf };
        }

        // Crash Cymbal 16"
        {
            const dur = 1.8;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                const env = Math.exp(-t * 2.5);
                const sL = (noise() * 0.82 + Math.sin(2 * Math.PI * 5400 * t) * 0.18) * env;
                const sR = (noise() * 0.82 + Math.sin(2 * Math.PI * 5520 * t) * 0.18) * env;
                L[i] = sL * 0.6;
                R[i] = sR * 0.6;
            }
            library['crash_cymbal'] = { name: '16" Studio Crash Cymbal', category: 'Drums', buffer: buf };
        }

        // Ride Cymbal Bell
        {
            const dur = 1.4;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                const env = Math.exp(-t * 3.2);
                const bell = Math.sin(2 * Math.PI * 2840 * t) * 0.5 + Math.sin(2 * Math.PI * 4120 * t) * 0.3;
                const s = (bell + noise() * 0.2) * env;
                L[i] = s * 0.55;
                R[i] = s * 0.55;
            }
            library['ride_cymbal'] = { name: '20" Ride Cymbal Bell', category: 'Drums', buffer: buf };
        }

        // -------------------------------------------------------------
        // 2. BASS & SYNTH KEYS ONE-SHOTS
        // -------------------------------------------------------------

        // 808 Sub Bass (C2 ~ 65.4Hz)
        {
            const dur = 1.4;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                const freq = 65.4;
                const env = Math.exp(-t * 2.0);
                const s = Math.tanh(Math.sin(2 * Math.PI * freq * t) * 1.5 + Math.sin(2 * Math.PI * freq * 2 * t) * 0.28) * env;
                L[i] = s * 0.88;
                R[i] = s * 0.88;
            }
            library['sub_808'] = { name: '808 Sub Bass Hit (C2)', category: 'Bass', key: 'C', buffer: buf };
        }

        // Analog Moog Saw Bass (F1 ~ 43.65Hz)
        {
            const dur = 1.2;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                const freq = 43.65;
                const env = Math.exp(-t * 2.8);
                const saw = (2 * ((freq * t) % 1) - 1);
                const sub = Math.sin(2 * Math.PI * freq * t);
                const s = softClip((saw * 0.65 + sub * 0.65) * env, 1.4);
                L[i] = s * 0.82;
                R[i] = s * 0.82;
            }
            library['bass_moog'] = { name: 'Moog Analog Saw Bass (F1)', category: 'Bass', key: 'F', buffer: buf };
        }

        // Neon Pluck Synth (A3 ~ 220Hz)
        {
            const dur = 0.9;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                const freq = 220;
                const env = Math.exp(-t * 4.8);
                const saw = (2 * ((freq * t) % 1) - 1);
                const sub = Math.sin(2 * Math.PI * freq * 0.5 * t);
                const s = (saw * 0.6 + sub * 0.4) * env;
                L[i] = s * 0.72;
                R[i] = s * 0.72;
            }
            library['synth_pluck'] = { name: 'Neon Synth Pluck (A3)', category: 'Synths', key: 'A', buffer: buf };
        }

        // Lush Fm7 Analog Pad Chord
        {
            const dur = 2.8;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            const freqs = [174.61, 207.65, 261.63, 311.13]; // F3, Ab3, C4, Eb4 (Fm7)
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                let env = 1;
                if (t < 0.4) env = t / 0.4;
                else if (t > 2.0) env = Math.max(0, 1 - (t - 2.0) / 0.8);

                let sL = 0, sR = 0;
                freqs.forEach((f, idx) => {
                    const detune = idx * 0.0035;
                    const osc1 = Math.sin(2 * Math.PI * (f * (1 - detune)) * t);
                    const osc2 = Math.sin(2 * Math.PI * (f * (1 + detune)) * t);
                    const pan = (idx % 2 === 0) ? 0.7 : 0.3;
                    sL += (osc1 * pan + osc2 * (1 - pan)) * 0.25;
                    sR += (osc1 * (1 - pan) + osc2 * pan) * 0.25;
                });
                L[i] = sL * env * 0.78;
                R[i] = sR * env * 0.78;
            }
            library['pad_fm7'] = { name: 'Juno-106 Fm7 Lush Pad', category: 'Synths', key: 'Fm', buffer: buf };
        }

        // Lo-Fi Rhodes EP Chord (Am9)
        {
            const dur = 2.2;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            const freqs = [220.00, 261.63, 329.63, 392.00, 493.88]; // A3, C4, E4, G4, B4 (Am9)
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                const env = Math.exp(-t * 1.8);
                const tremolo = 1 + 0.15 * Math.sin(2 * Math.PI * 4.5 * t);
                let s = 0;
                freqs.forEach(f => {
                    const sine = Math.sin(2 * Math.PI * f * t);
                    const tine = Math.sin(2 * Math.PI * f * 4 * t) * Math.exp(-t * 12) * 0.3;
                    s += (sine + tine) * 0.2;
                });
                const out = softClip(s * env * tremolo, 1.1) * 0.75;
                L[i] = out;
                R[i] = out;
            }
            library['rhodes_am9'] = { name: 'Vintage Rhodes Am9 EP', category: 'Synths', key: 'Am', buffer: buf };
        }

        // -------------------------------------------------------------
        // 3. SOUND FX & TEXTURES
        // -------------------------------------------------------------

        // 4-Bar Cyber Riser
        {
            const dur = 4.0;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                const progress = t / dur;
                const pitch = 70 * Math.pow(18, progress);
                const env = Math.pow(progress, 1.8);
                const osc = Math.sin(2 * Math.PI * pitch * t);
                const n = noise() * (0.3 + 0.7 * progress);
                const sL = (osc * 0.5 + n * 0.5) * env * (0.8 + 0.2 * Math.sin(t * 14));
                const sR = (osc * 0.5 + n * 0.5) * env * (0.8 + 0.2 * Math.cos(t * 14));
                L[i] = sL * 0.75;
                R[i] = sR * 0.75;
            }
            library['fx_riser'] = { name: '4-Bar Cyber Riser', category: 'FX', buffer: buf };
        }

        // Sub Drop Impact
        {
            const dur = 2.2;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                const freq = 145 * Math.exp(-t * 4.2) + 28;
                const env = Math.exp(-t * 2.0);
                const impactNoise = (t < 0.06) ? noise() * Math.exp(-t * 40) * 0.85 : 0;
                const s = Math.tanh(Math.sin(2 * Math.PI * freq * t) * 1.35 + impactNoise) * env;
                L[i] = s * 0.88;
                R[i] = s * 0.88;
            }
            library['fx_impact'] = { name: 'Deep Sub Drop Impact', category: 'FX', buffer: buf };
        }

        // Vinyl Dust & Crackle Texture
        {
            const dur = 4.0;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                const pop = (Math.random() < 0.00045) ? (noise() * 0.45) : 0;
                const hiss = noise() * 0.038;
                L[i] = hiss + pop;
                R[i] = hiss + pop;
            }
            library['fx_vinyl'] = { name: 'Vinyl Atmosphere Texture', category: 'FX', buffer: buf };
        }

        // White Noise Sweep Down
        {
            const dur = 2.5;
            const buf = this.createBuffer(ctx, dur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);
            for (let i = 0; i < buf.length; i++) {
                const t = i / sr;
                const env = Math.exp(-t * 2.2);
                const sL = noise() * env * 0.55;
                const sR = noise() * env * 0.55;
                L[i] = sL;
                R[i] = sR;
            }
            library['fx_sweep_down'] = { name: 'White Noise Sweep Down', category: 'FX', buffer: buf };
        }

        // -------------------------------------------------------------
        // 4. TEMPO-SYNCED PROCEDURAL LOOPS (120 & 124 BPM)
        // -------------------------------------------------------------
        const bpm120 = 120;
        const beatSec120 = 60 / bpm120; // 0.5s

        // 2-Bar House Drum Groove (120 BPM)
        {
            const bars = 2;
            const totalDur = beatSec120 * 4 * bars; // 4.0s
            const buf = this.createBuffer(ctx, totalDur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);

            const addSample = (sampleKey, offsetSec, volume = 1.0, pan = 0) => {
                const sBuf = library[sampleKey]?.buffer;
                if (!sBuf) return;
                const startIdx = Math.floor(offsetSec * sr);
                const sL = sBuf.getChannelData(0);
                const sR = sBuf.numberOfChannels > 1 ? sBuf.getChannelData(1) : sL;
                const panL = Math.cos((pan + 1) * Math.PI / 4);
                const panR = Math.sin((pan + 1) * Math.PI / 4);

                for (let i = 0; i < sBuf.length; i++) {
                    const idx = startIdx + i;
                    if (idx < buf.length) {
                        L[idx] += sL[i] * volume * panL;
                        R[idx] += sR[i] * volume * panR;
                    }
                }
            };

            for (let b = 0; b < 8; b++) {
                addSample('kick_punch', b * beatSec120, 0.92);
            }
            for (let bar = 0; bar < 2; bar++) {
                addSample('clap_tight', (bar * 4 + 1) * beatSec120, 0.88, 0.1);
                addSample('clap_tight', (bar * 4 + 3) * beatSec120, 0.88, -0.1);
            }
            for (let b = 0; b < 8; b++) {
                addSample('hat_open', (b + 0.5) * beatSec120, 0.65, -0.2);
            }
            for (let step = 0; step < 32; step++) {
                if (step % 2 === 0) continue;
                const vel = (step % 4 === 1) ? 0.38 : 0.28;
                addSample('hat_closed', step * (beatSec120 / 4), vel, 0.25);
            }
            addSample('rim_shot', 1.75 * beatSec120, 0.55, 0.4);
            addSample('rim_shot', 5.75 * beatSec120, 0.55, -0.4);
            addSample('rim_shot', 7.5 * beatSec120, 0.65, 0.3);

            for (let i = 0; i < buf.length; i++) {
                L[i] = softClip(L[i] * 0.9, 1.1);
                R[i] = softClip(R[i] * 0.9, 1.1);
            }

            library['loop_house_drums'] = { name: 'House Drum Groove (120 BPM)', category: 'Loops', buffer: buf, bpm: 120, bars: 2 };
        }

        // 2-Bar Acid Bassline Loop (120 BPM)
        {
            const bars = 2;
            const totalDur = beatSec120 * 4 * bars;
            const buf = this.createBuffer(ctx, totalDur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);

            const bassNotes = [
                { beat: 0.0, dur: 0.35, freq: 43.65 },
                { beat: 0.75, dur: 0.2, freq: 43.65 },
                { beat: 1.5, dur: 0.35, freq: 51.91 },
                { beat: 2.25, dur: 0.2, freq: 58.27 },
                { beat: 3.0, dur: 0.4, freq: 65.41 },
                { beat: 3.75, dur: 0.2, freq: 58.27 },
                { beat: 4.0, dur: 0.35, freq: 43.65 },
                { beat: 4.75, dur: 0.2, freq: 77.78 },
                { beat: 5.5, dur: 0.35, freq: 65.41 },
                { beat: 6.25, dur: 0.2, freq: 58.27 },
                { beat: 7.0, dur: 0.7, freq: 43.65 }
            ];

            bassNotes.forEach(note => {
                const startIdx = Math.floor(note.beat * beatSec120 * sr);
                const noteSamples = Math.floor(note.dur * beatSec120 * sr);
                for (let i = 0; i < noteSamples; i++) {
                    const idx = startIdx + i;
                    if (idx >= buf.length) break;
                    const t = i / sr;
                    const env = Math.exp(-t * 6.0);
                    const saw = (2 * ((note.freq * t) % 1) - 1);
                    const sub = Math.sin(2 * Math.PI * note.freq * t);
                    const sample = softClip((saw * 0.6 + sub * 0.7) * env, 1.4) * 0.72;
                    L[idx] += sample;
                    R[idx] += sample;
                }
            });

            library['loop_synth_bass'] = { name: 'Acid Bassline Loop (120 BPM)', category: 'Loops', key: 'F', buffer: buf, bpm: 120, bars: 2 };
        }

        // 2-Bar Synthwave Arp Melody (120 BPM)
        {
            const bars = 2;
            const totalDur = beatSec120 * 4 * bars;
            const buf = this.createBuffer(ctx, totalDur, 2);
            const L = buf.getChannelData(0);
            const R = buf.getChannelData(1);

            const arpNotes = [
                174.61, 261.63, 349.23, 440.00,
                174.61, 261.63, 349.23, 523.25,
                164.81, 246.94, 329.63, 493.88,
                196.00, 293.66, 392.00, 587.33
            ];

            for (let step = 0; step < 32; step++) {
                const freq = arpNotes[step % arpNotes.length];
                const startIdx = Math.floor(step * (beatSec120 / 2) * sr);
                const noteSamples = Math.floor(0.22 * sr);
                const pan = (step % 2 === 0) ? -0.3 : 0.3;
                const panL = Math.cos((pan + 1) * Math.PI / 4);
                const panR = Math.sin((pan + 1) * Math.PI / 4);

                for (let i = 0; i < noteSamples; i++) {
                    const idx = startIdx + i;
                    if (idx >= buf.length) break;
                    const t = i / sr;
                    const env = Math.exp(-t * 14);
                    const osc = (Math.sin(2 * Math.PI * freq * t) + 0.5 * Math.sin(2 * Math.PI * freq * 2 * t));
                    const s = osc * env * 0.48;
                    L[idx] += s * panL;
                    R[idx] += s * panR;
                }
            }

            library['loop_synth_lead'] = { name: 'Synthwave Arp Melody (120 BPM)', category: 'Loops', key: 'Fm', buffer: buf, bpm: 120, bars: 2 };
        }

        return library;
    }
}
