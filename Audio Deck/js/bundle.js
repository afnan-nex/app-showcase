(() => {
  // js/engine/EffectsChain.js
  var EffectsChain = class {
    /**
     * @param {AudioContext|BaseAudioContext} ctx 
     * @param {Object} options 
     */
    constructor(ctx, options = {}) {
      this.ctx = ctx;
      this.isMaster = options.isMaster || false;
      this.params = {
        gain: options.gain !== void 0 ? options.gain : 0.8,
        // 0 to 1.5
        pan: options.pan !== void 0 ? options.pan : 0,
        // -1 to +1
        mute: options.mute || false,
        solo: options.solo || false,
        // Filter (HPF + LPF)
        hpfFreq: options.hpfFreq || 20,
        // 20Hz - 5000Hz
        hpfQ: options.hpfQ || 0.7,
        hpfBypass: options.hpfBypass !== void 0 ? options.hpfBypass : true,
        lpfFreq: options.lpfFreq || 2e4,
        // 100Hz - 20000Hz
        lpfQ: options.lpfQ || 0.7,
        lpfBypass: options.lpfBypass !== void 0 ? options.lpfBypass : true,
        // Distortion
        distortionDrive: options.distortionDrive || 0,
        // 0 to 100
        distortionType: options.distortionType || "soft",
        // 'soft', 'hard', 'fuzz'
        distortionBypass: options.distortionBypass !== void 0 ? options.distortionBypass : true,
        // Delay
        delayTime: options.delayTime || 0.35,
        // 0.01 to 1.5s
        delayFeedback: options.delayFeedback || 0.35,
        // 0 to 0.9
        delayWet: options.delayWet || 0.3,
        // 0 to 1
        delayDamp: options.delayDamp || 3500,
        // filter on feedback
        delayBypass: options.delayBypass !== void 0 ? options.delayBypass : true,
        // Reverb
        reverbDecay: options.reverbDecay || 2,
        // 0.2 to 6.0s
        reverbWet: options.reverbWet || 0.25,
        // 0 to 1
        reverbBypass: options.reverbBypass !== void 0 ? options.reverbBypass : true,
        // Compressor
        compThreshold: options.compThreshold !== void 0 ? options.compThreshold : -18,
        compRatio: options.compRatio || 4,
        compAttack: options.compAttack || 0.01,
        compRelease: options.compRelease || 0.15,
        compBypass: options.compBypass !== void 0 ? options.compBypass : true
      };
      this._buildGraph();
    }
    _buildGraph() {
      const ctx = this.ctx;
      this.inputNode = ctx.createGain();
      this.hpfNode = ctx.createBiquadFilter();
      this.hpfNode.type = "highpass";
      this.hpfNode.frequency.value = this.params.hpfBypass ? 20 : this.params.hpfFreq;
      this.hpfNode.Q.value = this.params.hpfQ;
      this.lpfNode = ctx.createBiquadFilter();
      this.lpfNode.type = "lowpass";
      this.lpfNode.frequency.value = this.params.lpfBypass ? 2e4 : this.params.lpfFreq;
      this.lpfNode.Q.value = this.params.lpfQ;
      this.distInputNode = ctx.createGain();
      this.distShaperNode = ctx.createWaveShaper();
      this.distShaperNode.oversample = "4x";
      this.distDryNode = ctx.createGain();
      this.distWetNode = ctx.createGain();
      this.distOutputNode = ctx.createGain();
      this._updateDistortionCurve();
      this.delayInputNode = ctx.createGain();
      this.delayNode = ctx.createDelay(5);
      this.delayNode.delayTime.value = this.params.delayTime;
      this.delayFeedbackGain = ctx.createGain();
      this.delayFeedbackGain.gain.value = this.params.delayFeedback;
      this.delayDampFilter = ctx.createBiquadFilter();
      this.delayDampFilter.type = "lowpass";
      this.delayDampFilter.frequency.value = this.params.delayDamp;
      this.delayDryNode = ctx.createGain();
      this.delayWetNode = ctx.createGain();
      this.delayOutputNode = ctx.createGain();
      this.reverbInputNode = ctx.createGain();
      this.convolverNode = ctx.createConvolver();
      this.convolverNode.buffer = this._generateImpulseResponse(this.params.reverbDecay);
      this.reverbDryNode = ctx.createGain();
      this.reverbWetNode = ctx.createGain();
      this.reverbOutputNode = ctx.createGain();
      this.compressorNode = ctx.createDynamicsCompressor();
      this.compressorNode.threshold.value = this.params.compBypass ? 0 : this.params.compThreshold;
      this.compressorNode.knee.value = 12;
      this.compressorNode.ratio.value = this.params.compRatio;
      this.compressorNode.attack.value = this.params.compAttack;
      this.compressorNode.release.value = this.params.compRelease;
      this.gainNode = ctx.createGain();
      this.gainNode.gain.value = this.params.mute ? 0 : this.params.gain;
      if (ctx.createStereoPanner) {
        this.pannerNode = ctx.createStereoPanner();
        this.pannerNode.pan.value = this.params.pan;
      } else {
        this.pannerNode = ctx.createGain();
      }
      this.analyserNode = ctx.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.analyserNode.smoothingTimeConstant = 0.8;
      this._meterData = new Uint8Array(this.analyserNode.frequencyBinCount || 128);
      this.outputNode = ctx.createGain();
      this.inputNode.connect(this.hpfNode);
      this.hpfNode.connect(this.lpfNode);
      this.lpfNode.connect(this.distInputNode);
      this.distInputNode.connect(this.distDryNode);
      this.distInputNode.connect(this.distShaperNode);
      this.distShaperNode.connect(this.distWetNode);
      this.distDryNode.connect(this.distOutputNode);
      this.distWetNode.connect(this.distOutputNode);
      this._updateDistortionMix();
      this.distOutputNode.connect(this.delayInputNode);
      this.delayInputNode.connect(this.delayDryNode);
      this.delayDryNode.connect(this.delayOutputNode);
      this.delayInputNode.connect(this.delayNode);
      this.delayNode.connect(this.delayDampFilter);
      this.delayDampFilter.connect(this.delayFeedbackGain);
      this.delayFeedbackGain.connect(this.delayNode);
      this.delayDampFilter.connect(this.delayWetNode);
      this.delayWetNode.connect(this.delayOutputNode);
      this._updateDelayMix();
      this.delayOutputNode.connect(this.reverbInputNode);
      this.reverbInputNode.connect(this.reverbDryNode);
      this.reverbDryNode.connect(this.reverbOutputNode);
      this.reverbInputNode.connect(this.convolverNode);
      this.convolverNode.connect(this.reverbWetNode);
      this.reverbWetNode.connect(this.reverbOutputNode);
      this._updateReverbMix();
      this.reverbOutputNode.connect(this.compressorNode);
      this.compressorNode.connect(this.gainNode);
      this.gainNode.connect(this.pannerNode);
      this.pannerNode.connect(this.analyserNode);
      this.analyserNode.connect(this.outputNode);
      this._meterData = new Uint8Array(this.analyserNode.frequencyBinCount);
    }
    _generateImpulseResponse(decayTime = 2) {
      const rate = this.ctx.sampleRate || 44100;
      const length = Math.max(1, Math.floor(rate * decayTime));
      const impulse = this.ctx.createBuffer(2, length, rate);
      const impulseL = impulse.getChannelData(0);
      const impulseR = impulse.getChannelData(1);
      for (let i = 0; i < length; i++) {
        const t = i / length;
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
      if (this.params.distortionType === "hard") {
        for (let i = 0; i < nSamples; i++) {
          const x = i * 2 / nSamples - 1;
          const thresh = 0.4 / (1 + k * 0.05);
          curve[i] = Math.max(-thresh, Math.min(thresh, x)) / thresh;
        }
      } else if (this.params.distortionType === "fuzz") {
        for (let i = 0; i < nSamples; i++) {
          const x = i * 2 / nSamples - 1;
          curve[i] = Math.tanh(x * (1 + k * 0.25));
        }
      } else {
        for (let i = 0; i < nSamples; i++) {
          const x = i * 2 / nSamples - 1;
          if (k === 0) {
            curve[i] = x;
          } else {
            curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
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
      this.params.gain = Math.max(0, Math.min(2, val));
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
      const target = bypass ? 20 : Math.max(20, Math.min(1e4, freq));
      this.hpfNode.frequency.setTargetAtTime(target, this.ctx.currentTime, 0.02);
      this.hpfNode.Q.setValueAtTime(q, this.ctx.currentTime);
    }
    setLPF(freq, bypass = false, q = 0.7) {
      this.params.lpfFreq = freq;
      this.params.lpfBypass = bypass;
      this.params.lpfQ = q;
      const target = bypass ? 2e4 : Math.max(80, Math.min(2e4, freq));
      this.lpfNode.frequency.setTargetAtTime(target, this.ctx.currentTime, 0.02);
      this.lpfNode.Q.setValueAtTime(q, this.ctx.currentTime);
    }
    setDistortion(drive, type = "soft", bypass = false) {
      this.params.distortionDrive = drive;
      this.params.distortionType = type;
      this.params.distortionBypass = bypass;
      this._updateDistortionCurve();
      this._updateDistortionMix();
    }
    setDelay(time, feedback, wet, bypass = false) {
      this.params.delayTime = Math.max(0.01, Math.min(2, time));
      this.params.delayFeedback = Math.max(0, Math.min(0.92, feedback));
      this.params.delayWet = Math.max(0, Math.min(1, wet));
      this.params.delayBypass = bypass;
      this.delayNode.delayTime.setTargetAtTime(this.params.delayTime, this.ctx.currentTime, 0.02);
      this.delayFeedbackGain.gain.setValueAtTime(this.params.delayFeedback, this.ctx.currentTime);
      this._updateDelayMix();
    }
    setReverb(decay, wet, bypass = false) {
      const decayChanged = Math.abs(this.params.reverbDecay - decay) > 0.1;
      this.params.reverbDecay = Math.max(0.2, Math.min(6, decay));
      this.params.reverbWet = Math.max(0, Math.min(1, wet));
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
      if (!this.analyserNode) return { peak: 0, rms: 0, clipping: false };
      if (!this._meterData) {
        this._meterData = new Uint8Array(this.analyserNode.frequencyBinCount || 128);
      }
      try {
        this.analyserNode.getByteTimeDomainData(this._meterData);
      } catch (e) {
        return { peak: 0, rms: 0, clipping: false };
      }
      let sumSquares = 0;
      let peak = 0;
      for (let i = 0; i < this._meterData.length; i++) {
        const normalized = (this._meterData[i] - 128) / 128;
        const abs = Math.abs(normalized);
        if (abs > peak) peak = abs;
        sumSquares += normalized * normalized;
      }
      const rms = Math.sqrt(sumSquares / (this._meterData.length || 1));
      return {
        peak: Math.min(1, peak * 1.15),
        rms: Math.min(1, rms * 1.4),
        clipping: peak >= 0.98
      };
    }
  };

  // js/engine/SynthEngine.js
  var SynthEngine = class _SynthEngine {
    /**
     * @param {AudioContext|BaseAudioContext} ctx 
     * @param {AudioNode} destinationNode 
     * @param {Object} preset 
     */
    constructor(ctx, destinationNode, preset = {}) {
      this.ctx = ctx;
      this.destinationNode = destinationNode;
      this.params = {
        // Oscillators
        osc1Type: preset.osc1Type || "sawtooth",
        // sine, square, sawtooth, triangle
        osc1Octave: preset.osc1Octave || 0,
        // -2, -1, 0, 1, 2
        osc1Detune: preset.osc1Detune || 0,
        // -50 to +50 cents
        osc2Type: preset.osc2Type || "square",
        osc2Octave: preset.osc2Octave || 0,
        osc2Semi: preset.osc2Semi || 7,
        // semitone offset
        osc2Detune: preset.osc2Detune || 8,
        // cents detune for rich chorus
        oscMix: preset.oscMix !== void 0 ? preset.oscMix : 0.4,
        // 0 = all Osc1, 1 = all Osc2
        subGain: preset.subGain !== void 0 ? preset.subGain : 0.25,
        // sub oscillator
        noiseGain: preset.noiseGain !== void 0 ? preset.noiseGain : 0.05,
        // Filter
        filterType: preset.filterType || "lowpass",
        filterCutoff: preset.filterCutoff || 2200,
        // Hz
        filterResonance: preset.filterResonance || 3.5,
        // Q
        filterEnvAmount: preset.filterEnvAmount !== void 0 ? preset.filterEnvAmount : 0.6,
        // Amp Envelope (seconds, level)
        ampAttack: preset.ampAttack || 0.02,
        ampDecay: preset.ampDecay || 0.25,
        ampSustain: preset.ampSustain !== void 0 ? preset.ampSustain : 0.6,
        ampRelease: preset.ampRelease || 0.35,
        // Filter Envelope
        filterAttack: preset.filterAttack || 0.04,
        filterDecay: preset.filterDecay || 0.3,
        filterSustain: preset.filterSustain !== void 0 ? preset.filterSustain : 0.3,
        filterRelease: preset.filterRelease || 0.3,
        // LFO
        lfoRate: preset.lfoRate || 2.5,
        // Hz
        lfoDepth: preset.lfoDepth || 0.15,
        lfoTarget: preset.lfoTarget || "cutoff",
        // 'cutoff', 'pitch', 'amp', 'none'
        lfoWave: preset.lfoWave || "sine",
        // Portamento / Glide
        glide: preset.glide || 0.02,
        voiceGain: preset.voiceGain || 0.75
      };
      this.activeVoices = /* @__PURE__ */ new Map();
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
      const velNorm = Math.max(0.1, Math.min(1, velocity / 127));
      const baseFreq = _SynthEngine.midiToFreq(midiPitch);
      const ctx = this.ctx;
      const now = Math.max(ctx.currentTime, startTime);
      const endTime = now + Math.max(0.02, duration);
      const voiceGain = ctx.createGain();
      voiceGain.gain.setValueAtTime(0, now);
      const filter = ctx.createBiquadFilter();
      filter.type = this.params.filterType;
      filter.Q.setValueAtTime(this.params.filterResonance, now);
      const aA = Math.max(5e-3, this.params.ampAttack);
      const aD = Math.max(5e-3, this.params.ampDecay);
      const aS = Math.max(0, Math.min(1, this.params.ampSustain));
      const aR = Math.max(0.01, this.params.ampRelease);
      const peakGain = this.params.voiceGain * velNorm;
      voiceGain.gain.setValueAtTime(1e-4, now);
      voiceGain.gain.linearRampToValueAtTime(peakGain, now + aA);
      voiceGain.gain.exponentialRampToValueAtTime(Math.max(1e-4, peakGain * aS), now + aA + aD);
      voiceGain.gain.setValueAtTime(Math.max(1e-4, peakGain * aS), endTime);
      voiceGain.gain.exponentialRampToValueAtTime(1e-4, endTime + aR);
      const fA = Math.max(5e-3, this.params.filterAttack);
      const fD = Math.max(5e-3, this.params.filterDecay);
      const fS = Math.max(0, Math.min(1, this.params.filterSustain));
      const fR = Math.max(0.01, this.params.filterRelease);
      const baseCutoff = Math.max(40, Math.min(18e3, this.params.filterCutoff));
      const envAmount = this.params.filterEnvAmount * 8e3 * velNorm;
      const targetPeakCutoff = Math.max(40, Math.min(2e4, baseCutoff + envAmount));
      const sustainCutoff = Math.max(40, Math.min(2e4, baseCutoff + envAmount * fS));
      filter.frequency.setValueAtTime(baseCutoff, now);
      filter.frequency.linearRampToValueAtTime(targetPeakCutoff, now + fA);
      filter.frequency.exponentialRampToValueAtTime(sustainCutoff, now + fA + fD);
      filter.frequency.setValueAtTime(sustainCutoff, endTime);
      filter.frequency.exponentialRampToValueAtTime(Math.max(40, baseCutoff), endTime + fR);
      filter.connect(voiceGain);
      voiceGain.connect(this.destinationNode);
      const osc1 = ctx.createOscillator();
      osc1.type = this.params.osc1Type;
      const osc1Freq = baseFreq * Math.pow(2, this.params.osc1Octave);
      osc1.frequency.setValueAtTime(osc1Freq, now);
      osc1.detune.setValueAtTime(this.params.osc1Detune, now);
      const osc1Gain = ctx.createGain();
      osc1Gain.gain.setValueAtTime(1 - this.params.oscMix, now);
      osc1.connect(osc1Gain);
      osc1Gain.connect(filter);
      const osc2 = ctx.createOscillator();
      osc2.type = this.params.osc2Type;
      const osc2Freq = baseFreq * Math.pow(2, this.params.osc2Octave + this.params.osc2Semi / 12);
      osc2.frequency.setValueAtTime(osc2Freq, now);
      osc2.detune.setValueAtTime(this.params.osc2Detune, now);
      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(this.params.oscMix, now);
      osc2.connect(osc2Gain);
      osc2Gain.connect(filter);
      let subOsc = null;
      if (this.params.subGain > 0.01) {
        subOsc = ctx.createOscillator();
        subOsc.type = "sine";
        subOsc.frequency.setValueAtTime(baseFreq * 0.5, now);
        const subGainNode = ctx.createGain();
        subGainNode.gain.setValueAtTime(this.params.subGain, now);
        subOsc.connect(subGainNode);
        subGainNode.connect(filter);
        subOsc.start(now);
        subOsc.stop(endTime + aR + 0.05);
      }
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
      let lfoOsc = null;
      if (this.params.lfoTarget !== "none" && this.params.lfoDepth > 0.01) {
        lfoOsc = ctx.createOscillator();
        lfoOsc.type = this.params.lfoWave;
        lfoOsc.frequency.setValueAtTime(this.params.lfoRate, now);
        const lfoGain = ctx.createGain();
        if (this.params.lfoTarget === "cutoff") {
          lfoGain.gain.setValueAtTime(this.params.lfoDepth * 2e3, now);
          lfoOsc.connect(lfoGain);
          lfoGain.connect(filter.frequency);
        } else if (this.params.lfoTarget === "pitch") {
          lfoGain.gain.setValueAtTime(this.params.lfoDepth * 200, now);
          lfoOsc.connect(lfoGain);
          lfoGain.connect(osc1.detune);
          lfoGain.connect(osc2.detune);
        } else if (this.params.lfoTarget === "amp") {
          lfoGain.gain.setValueAtTime(this.params.lfoDepth * 0.5, now);
          lfoOsc.connect(lfoGain);
          lfoGain.connect(voiceGain.gain);
        }
        lfoOsc.start(now);
        lfoOsc.stop(endTime + aR + 0.05);
      }
      osc1.start(now);
      osc2.start(now);
      const stopTime = endTime + aR + 0.05;
      osc1.stop(stopTime);
      osc2.stop(stopTime);
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
        }
      }, Math.max(10, (stopTime - ctx.currentTime) * 1e3 + 100));
    }
    /**
     * Interactive noteOn for keyboard auditioning / live play
     * @param {number} midiPitch 
     * @param {number} velocity 
     */
    noteOn(midiPitch, velocity = 100) {
      this.noteOff(midiPitch);
      const velNorm = Math.max(0.1, Math.min(1, velocity / 127));
      const baseFreq = _SynthEngine.midiToFreq(midiPitch);
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const voiceGain = ctx.createGain();
      const peakGain = this.params.voiceGain * velNorm;
      const aA = Math.max(5e-3, this.params.ampAttack);
      const aD = Math.max(5e-3, this.params.ampDecay);
      const aS = Math.max(0, Math.min(1, this.params.ampSustain));
      voiceGain.gain.setValueAtTime(1e-4, now);
      voiceGain.gain.linearRampToValueAtTime(peakGain, now + aA);
      voiceGain.gain.exponentialRampToValueAtTime(Math.max(1e-4, peakGain * aS), now + aA + aD);
      const filter = ctx.createBiquadFilter();
      filter.type = this.params.filterType;
      filter.Q.setValueAtTime(this.params.filterResonance, now);
      const fA = Math.max(5e-3, this.params.filterAttack);
      const fD = Math.max(5e-3, this.params.filterDecay);
      const fS = Math.max(0, Math.min(1, this.params.filterSustain));
      const baseCutoff = Math.max(40, Math.min(18e3, this.params.filterCutoff));
      const envAmount = this.params.filterEnvAmount * 8e3 * velNorm;
      filter.frequency.setValueAtTime(baseCutoff, now);
      filter.frequency.linearRampToValueAtTime(Math.max(40, Math.min(2e4, baseCutoff + envAmount)), now + fA);
      filter.frequency.exponentialRampToValueAtTime(Math.max(40, Math.min(2e4, baseCutoff + envAmount * fS)), now + fA + fD);
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
      voice.voiceGain.gain.setValueAtTime(Math.max(1e-4, voice.voiceGain.gain.value), now);
      voice.voiceGain.gain.exponentialRampToValueAtTime(1e-4, now + aR);
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
        } catch (e) {
        }
      }, aR * 1e3 + 100);
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
  };

  // js/engine/DrumEngine.js
  var DrumEngine = class {
    /**
     * @param {AudioContext|BaseAudioContext} ctx 
     * @param {AudioNode} destinationNode 
     * @param {Object} sampleLibrary 
     */
    constructor(ctx, destinationNode, sampleLibrary = {}) {
      this.ctx = ctx;
      this.destinationNode = destinationNode;
      this.sampleLibrary = sampleLibrary;
      this.voices = [
        { id: "kick", name: "Kick Drum", sampleKey: "kick_808", pitch: 1, decay: 1, volume: 1 },
        { id: "snare", name: "Snare Drum", sampleKey: "snare_808", pitch: 1, decay: 1, volume: 0.9 },
        { id: "hat_closed", name: "Closed Hat", sampleKey: "hat_closed", pitch: 1, decay: 1, volume: 0.8 },
        { id: "hat_open", name: "Open Hat", sampleKey: "hat_open", pitch: 1, decay: 1, volume: 0.85 },
        { id: "clap", name: "Clap", sampleKey: "clap_tight", pitch: 1, decay: 1, volume: 0.9 },
        { id: "tom", name: "Analog Tom", sampleKey: "tom_low", pitch: 1, decay: 1, volume: 0.85 },
        { id: "rim", name: "Rimshot Perc", sampleKey: "rim_shot", pitch: 1, decay: 1, volume: 0.8 },
        { id: "crash", name: "Crash Cymbal", sampleKey: "crash_cymbal", pitch: 1, decay: 1, volume: 0.75 }
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
      if (typeof voiceIndexOrId === "number") {
        voice = this.voices[voiceIndexOrId];
      } else {
        voice = this.voices.find((v) => v.id === voiceIndexOrId);
      }
      if (!voice) return;
      const ctx = this.ctx;
      const now = Math.max(ctx.currentTime, startTime);
      const velNorm = Math.max(0.1, Math.min(1, velocity / 127));
      const sample = this.sampleLibrary[voice.sampleKey]?.buffer;
      if (sample) {
        const source = ctx.createBufferSource();
        source.buffer = sample;
        source.playbackRate.setValueAtTime(voice.pitch, now);
        const gain = ctx.createGain();
        const gainVal = voice.volume * velNorm;
        gain.gain.setValueAtTime(gainVal, now);
        if (voice.decay < 0.95) {
          gain.gain.exponentialRampToValueAtTime(1e-3, now + sample.duration * voice.decay);
        }
        source.connect(gain);
        gain.connect(this.destinationNode);
        source.start(now);
        source.stop(now + sample.duration * voice.decay + 0.1);
      } else {
        this._synthesizeDrumFallback(voice.id, velNorm, now);
      }
    }
    _synthesizeDrumFallback(id, vel, now) {
      const ctx = this.ctx;
      if (id === "kick") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);
        gain.gain.setValueAtTime(vel, now);
        gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.4);
        osc.connect(gain);
        gain.connect(this.destinationNode);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (id.includes("hat")) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(8e3, now);
        gain.gain.setValueAtTime(vel * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.08);
        osc.connect(gain);
        gain.connect(this.destinationNode);
        osc.start(now);
        osc.stop(now + 0.09);
      }
    }
  };

  // js/engine/SampleGenerator.js
  var SampleGenerator = class {
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
      {
        const dur = 0.65;
        const buf = this.createBuffer(ctx, dur, 2);
        const L = buf.getChannelData(0);
        const R = buf.getChannelData(1);
        for (let i = 0; i < buf.length; i++) {
          const t = i / sr;
          const phase = 2 * Math.PI * (40 * t + 140 / 30 * (1 - Math.exp(-t * 30)));
          const click = t < 6e-3 ? (1 - t / 6e-3) * noise() * 0.35 : 0;
          const amp = Math.exp(-t * 5.2);
          const s = softClip(Math.sin(phase) * amp * 1.15 + click, 1.4);
          L[i] = s * 0.92;
          R[i] = s * 0.92;
        }
        library["kick_808"] = { name: "808 Deep Sub Kick", category: "Drums", buffer: buf };
      }
      {
        const dur = 0.38;
        const buf = this.createBuffer(ctx, dur, 2);
        const L = buf.getChannelData(0);
        const R = buf.getChannelData(1);
        for (let i = 0; i < buf.length; i++) {
          const t = i / sr;
          const phase = 2 * Math.PI * (52 * t + 280 / 48 * (1 - Math.exp(-t * 48)));
          const click = t < 8e-3 ? (1 - t / 8e-3) * Math.sin(2 * Math.PI * 2200 * t) * 0.8 : 0;
          const amp = Math.exp(-t * 10.5);
          const s = softClip(Math.sin(phase) * amp + click, 1.5);
          L[i] = s * 0.95;
          R[i] = s * 0.95;
        }
        library["kick_punch"] = { name: "909 Punchy Club Kick", category: "Drums", buffer: buf };
      }
      {
        const dur = 0.42;
        const buf = this.createBuffer(ctx, dur, 2);
        const L = buf.getChannelData(0);
        const R = buf.getChannelData(1);
        for (let i = 0; i < buf.length; i++) {
          const t = i / sr;
          const phase = 2 * Math.PI * (58 * t + 160 / 38 * (1 - Math.exp(-t * 38)));
          const air = t < 0.02 ? noise() * Math.exp(-t * 80) * 0.4 : 0;
          const amp = Math.exp(-t * 8.5);
          const s = softClip(Math.sin(phase) * amp * 0.9 + air, 1.2);
          L[i] = s * 0.88;
          R[i] = s * 0.88;
        }
        library["kick_acoustic"] = { name: "Studio Thud Kick", category: "Drums", buffer: buf };
      }
      {
        const dur = 0.4;
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
        library["snare_808"] = { name: "808 Analog Snare", category: "Drums", buffer: buf };
      }
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
        library["snare_crisp"] = { name: "Crisp Studio Snare", category: "Drums", buffer: buf };
      }
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
        library["clap_tight"] = { name: "Layered Studio Clap", category: "Drums", buffer: buf };
      }
      {
        const dur = 0.09;
        const buf = this.createBuffer(ctx, dur, 2);
        const L = buf.getChannelData(0);
        const R = buf.getChannelData(1);
        for (let i = 0; i < buf.length; i++) {
          const t = i / sr;
          const metallic = (Math.sin(2 * Math.PI * 3450 * t) > 0 ? 1 : -1) + (Math.sin(2 * Math.PI * 4820 * t) > 0 ? 1 : -1) + (Math.sin(2 * Math.PI * 6340 * t) > 0 ? 1 : -1);
          const env = Math.exp(-t * 58);
          const s = (metallic * 0.25 + noise() * 0.75) * env;
          L[i] = s * 0.65;
          R[i] = s * 0.65;
        }
        library["hat_closed"] = { name: "Closed Hi-Hat 16th", category: "Drums", buffer: buf };
      }
      {
        const dur = 0.48;
        const buf = this.createBuffer(ctx, dur, 2);
        const L = buf.getChannelData(0);
        const R = buf.getChannelData(1);
        for (let i = 0; i < buf.length; i++) {
          const t = i / sr;
          const metallic = (Math.sin(2 * Math.PI * 3420 * t) > 0 ? 1 : -1) + (Math.sin(2 * Math.PI * 4780 * t) > 0 ? 1 : -1) + (Math.sin(2 * Math.PI * 6200 * t) > 0 ? 1 : -1);
          const env = Math.exp(-t * 8.5);
          const sL = (metallic * 0.28 + noise() * 0.72) * env;
          const sR = (metallic * 0.28 + noise() * 0.72) * env;
          L[i] = sL * 0.68;
          R[i] = sR * 0.68;
        }
        library["hat_open"] = { name: "Open Sizzle Hi-Hat", category: "Drums", buffer: buf };
      }
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
        library["tom_low"] = { name: "Analog Low Tom", category: "Drums", buffer: buf };
      }
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
        library["rim_shot"] = { name: "Studio Rimshot Perc", category: "Drums", buffer: buf };
      }
      {
        const dur = 0.12;
        const buf = this.createBuffer(ctx, dur, 2);
        const L = buf.getChannelData(0);
        const R = buf.getChannelData(1);
        for (let i = 0; i < buf.length; i++) {
          const t = i / sr;
          const env = t < 0.02 ? t / 0.02 : Math.exp(-(t - 0.02) * 35);
          const sL = noise() * env * 0.6;
          const sR = noise() * env * 0.6;
          L[i] = sL;
          R[i] = sR;
        }
        library["shaker_hit"] = { name: "Cabasa Shaker Hit", category: "Drums", buffer: buf };
      }
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
        library["crash_cymbal"] = { name: '16" Studio Crash Cymbal', category: "Drums", buffer: buf };
      }
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
        library["ride_cymbal"] = { name: '20" Ride Cymbal Bell', category: "Drums", buffer: buf };
      }
      {
        const dur = 1.4;
        const buf = this.createBuffer(ctx, dur, 2);
        const L = buf.getChannelData(0);
        const R = buf.getChannelData(1);
        for (let i = 0; i < buf.length; i++) {
          const t = i / sr;
          const freq = 65.4;
          const env = Math.exp(-t * 2);
          const s = Math.tanh(Math.sin(2 * Math.PI * freq * t) * 1.5 + Math.sin(2 * Math.PI * freq * 2 * t) * 0.28) * env;
          L[i] = s * 0.88;
          R[i] = s * 0.88;
        }
        library["sub_808"] = { name: "808 Sub Bass Hit (C2)", category: "Bass", key: "C", buffer: buf };
      }
      {
        const dur = 1.2;
        const buf = this.createBuffer(ctx, dur, 2);
        const L = buf.getChannelData(0);
        const R = buf.getChannelData(1);
        for (let i = 0; i < buf.length; i++) {
          const t = i / sr;
          const freq = 43.65;
          const env = Math.exp(-t * 2.8);
          const saw = 2 * (freq * t % 1) - 1;
          const sub = Math.sin(2 * Math.PI * freq * t);
          const s = softClip((saw * 0.65 + sub * 0.65) * env, 1.4);
          L[i] = s * 0.82;
          R[i] = s * 0.82;
        }
        library["bass_moog"] = { name: "Moog Analog Saw Bass (F1)", category: "Bass", key: "F", buffer: buf };
      }
      {
        const dur = 0.9;
        const buf = this.createBuffer(ctx, dur, 2);
        const L = buf.getChannelData(0);
        const R = buf.getChannelData(1);
        for (let i = 0; i < buf.length; i++) {
          const t = i / sr;
          const freq = 220;
          const env = Math.exp(-t * 4.8);
          const saw = 2 * (freq * t % 1) - 1;
          const sub = Math.sin(2 * Math.PI * freq * 0.5 * t);
          const s = (saw * 0.6 + sub * 0.4) * env;
          L[i] = s * 0.72;
          R[i] = s * 0.72;
        }
        library["synth_pluck"] = { name: "Neon Synth Pluck (A3)", category: "Synths", key: "A", buffer: buf };
      }
      {
        const dur = 2.8;
        const buf = this.createBuffer(ctx, dur, 2);
        const L = buf.getChannelData(0);
        const R = buf.getChannelData(1);
        const freqs = [174.61, 207.65, 261.63, 311.13];
        for (let i = 0; i < buf.length; i++) {
          const t = i / sr;
          let env = 1;
          if (t < 0.4) env = t / 0.4;
          else if (t > 2) env = Math.max(0, 1 - (t - 2) / 0.8);
          let sL = 0, sR = 0;
          freqs.forEach((f, idx) => {
            const detune = idx * 35e-4;
            const osc1 = Math.sin(2 * Math.PI * (f * (1 - detune)) * t);
            const osc2 = Math.sin(2 * Math.PI * (f * (1 + detune)) * t);
            const pan = idx % 2 === 0 ? 0.7 : 0.3;
            sL += (osc1 * pan + osc2 * (1 - pan)) * 0.25;
            sR += (osc1 * (1 - pan) + osc2 * pan) * 0.25;
          });
          L[i] = sL * env * 0.78;
          R[i] = sR * env * 0.78;
        }
        library["pad_fm7"] = { name: "Juno-106 Fm7 Lush Pad", category: "Synths", key: "Fm", buffer: buf };
      }
      {
        const dur = 2.2;
        const buf = this.createBuffer(ctx, dur, 2);
        const L = buf.getChannelData(0);
        const R = buf.getChannelData(1);
        const freqs = [220, 261.63, 329.63, 392, 493.88];
        for (let i = 0; i < buf.length; i++) {
          const t = i / sr;
          const env = Math.exp(-t * 1.8);
          const tremolo = 1 + 0.15 * Math.sin(2 * Math.PI * 4.5 * t);
          let s = 0;
          freqs.forEach((f) => {
            const sine = Math.sin(2 * Math.PI * f * t);
            const tine = Math.sin(2 * Math.PI * f * 4 * t) * Math.exp(-t * 12) * 0.3;
            s += (sine + tine) * 0.2;
          });
          const out = softClip(s * env * tremolo, 1.1) * 0.75;
          L[i] = out;
          R[i] = out;
        }
        library["rhodes_am9"] = { name: "Vintage Rhodes Am9 EP", category: "Synths", key: "Am", buffer: buf };
      }
      {
        const dur = 4;
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
        library["fx_riser"] = { name: "4-Bar Cyber Riser", category: "FX", buffer: buf };
      }
      {
        const dur = 2.2;
        const buf = this.createBuffer(ctx, dur, 2);
        const L = buf.getChannelData(0);
        const R = buf.getChannelData(1);
        for (let i = 0; i < buf.length; i++) {
          const t = i / sr;
          const freq = 145 * Math.exp(-t * 4.2) + 28;
          const env = Math.exp(-t * 2);
          const impactNoise = t < 0.06 ? noise() * Math.exp(-t * 40) * 0.85 : 0;
          const s = Math.tanh(Math.sin(2 * Math.PI * freq * t) * 1.35 + impactNoise) * env;
          L[i] = s * 0.88;
          R[i] = s * 0.88;
        }
        library["fx_impact"] = { name: "Deep Sub Drop Impact", category: "FX", buffer: buf };
      }
      {
        const dur = 4;
        const buf = this.createBuffer(ctx, dur, 2);
        const L = buf.getChannelData(0);
        const R = buf.getChannelData(1);
        for (let i = 0; i < buf.length; i++) {
          const t = i / sr;
          const pop = Math.random() < 45e-5 ? noise() * 0.45 : 0;
          const hiss = noise() * 0.038;
          L[i] = hiss + pop;
          R[i] = hiss + pop;
        }
        library["fx_vinyl"] = { name: "Vinyl Atmosphere Texture", category: "FX", buffer: buf };
      }
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
        library["fx_sweep_down"] = { name: "White Noise Sweep Down", category: "FX", buffer: buf };
      }
      const bpm120 = 120;
      const beatSec120 = 60 / bpm120;
      {
        const bars = 2;
        const totalDur = beatSec120 * 4 * bars;
        const buf = this.createBuffer(ctx, totalDur, 2);
        const L = buf.getChannelData(0);
        const R = buf.getChannelData(1);
        const addSample = (sampleKey, offsetSec, volume = 1, pan = 0) => {
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
          addSample("kick_punch", b * beatSec120, 0.92);
        }
        for (let bar = 0; bar < 2; bar++) {
          addSample("clap_tight", (bar * 4 + 1) * beatSec120, 0.88, 0.1);
          addSample("clap_tight", (bar * 4 + 3) * beatSec120, 0.88, -0.1);
        }
        for (let b = 0; b < 8; b++) {
          addSample("hat_open", (b + 0.5) * beatSec120, 0.65, -0.2);
        }
        for (let step = 0; step < 32; step++) {
          if (step % 2 === 0) continue;
          const vel = step % 4 === 1 ? 0.38 : 0.28;
          addSample("hat_closed", step * (beatSec120 / 4), vel, 0.25);
        }
        addSample("rim_shot", 1.75 * beatSec120, 0.55, 0.4);
        addSample("rim_shot", 5.75 * beatSec120, 0.55, -0.4);
        addSample("rim_shot", 7.5 * beatSec120, 0.65, 0.3);
        for (let i = 0; i < buf.length; i++) {
          L[i] = softClip(L[i] * 0.9, 1.1);
          R[i] = softClip(R[i] * 0.9, 1.1);
        }
        library["loop_house_drums"] = { name: "House Drum Groove (120 BPM)", category: "Loops", buffer: buf, bpm: 120, bars: 2 };
      }
      {
        const bars = 2;
        const totalDur = beatSec120 * 4 * bars;
        const buf = this.createBuffer(ctx, totalDur, 2);
        const L = buf.getChannelData(0);
        const R = buf.getChannelData(1);
        const bassNotes = [
          { beat: 0, dur: 0.35, freq: 43.65 },
          { beat: 0.75, dur: 0.2, freq: 43.65 },
          { beat: 1.5, dur: 0.35, freq: 51.91 },
          { beat: 2.25, dur: 0.2, freq: 58.27 },
          { beat: 3, dur: 0.4, freq: 65.41 },
          { beat: 3.75, dur: 0.2, freq: 58.27 },
          { beat: 4, dur: 0.35, freq: 43.65 },
          { beat: 4.75, dur: 0.2, freq: 77.78 },
          { beat: 5.5, dur: 0.35, freq: 65.41 },
          { beat: 6.25, dur: 0.2, freq: 58.27 },
          { beat: 7, dur: 0.7, freq: 43.65 }
        ];
        bassNotes.forEach((note) => {
          const startIdx = Math.floor(note.beat * beatSec120 * sr);
          const noteSamples = Math.floor(note.dur * beatSec120 * sr);
          for (let i = 0; i < noteSamples; i++) {
            const idx = startIdx + i;
            if (idx >= buf.length) break;
            const t = i / sr;
            const env = Math.exp(-t * 6);
            const saw = 2 * (note.freq * t % 1) - 1;
            const sub = Math.sin(2 * Math.PI * note.freq * t);
            const sample = softClip((saw * 0.6 + sub * 0.7) * env, 1.4) * 0.72;
            L[idx] += sample;
            R[idx] += sample;
          }
        });
        library["loop_synth_bass"] = { name: "Acid Bassline Loop (120 BPM)", category: "Loops", key: "F", buffer: buf, bpm: 120, bars: 2 };
      }
      {
        const bars = 2;
        const totalDur = beatSec120 * 4 * bars;
        const buf = this.createBuffer(ctx, totalDur, 2);
        const L = buf.getChannelData(0);
        const R = buf.getChannelData(1);
        const arpNotes = [
          174.61,
          261.63,
          349.23,
          440,
          174.61,
          261.63,
          349.23,
          523.25,
          164.81,
          246.94,
          329.63,
          493.88,
          196,
          293.66,
          392,
          587.33
        ];
        for (let step = 0; step < 32; step++) {
          const freq = arpNotes[step % arpNotes.length];
          const startIdx = Math.floor(step * (beatSec120 / 2) * sr);
          const noteSamples = Math.floor(0.22 * sr);
          const pan = step % 2 === 0 ? -0.3 : 0.3;
          const panL = Math.cos((pan + 1) * Math.PI / 4);
          const panR = Math.sin((pan + 1) * Math.PI / 4);
          for (let i = 0; i < noteSamples; i++) {
            const idx = startIdx + i;
            if (idx >= buf.length) break;
            const t = i / sr;
            const env = Math.exp(-t * 14);
            const osc = Math.sin(2 * Math.PI * freq * t) + 0.5 * Math.sin(2 * Math.PI * freq * 2 * t);
            const s = osc * env * 0.48;
            L[idx] += s * panL;
            R[idx] += s * panR;
          }
        }
        library["loop_synth_lead"] = { name: "Synthwave Arp Melody (120 BPM)", category: "Loops", key: "Fm", buffer: buf, bpm: 120, bars: 2 };
      }
      return library;
    }
  };

  // js/engine/WavExporter.js
  var WavExporter = class {
    /**
     * Converts an AudioBuffer into a WAV Blob
     * @param {AudioBuffer} audioBuffer
     * @param {boolean} as32BitFloat - if true, exports 32-bit IEEE float, default 16-bit PCM
     * @returns {Blob}
     */
    static bufferToWaveBlob(audioBuffer, as32BitFloat = false) {
      const numOfChan = audioBuffer.numberOfChannels;
      const length = audioBuffer.length * numOfChan * (as32BitFloat ? 4 : 2) + 44;
      const outBuffer = new ArrayBuffer(length);
      const view = new DataView(outBuffer);
      const channels = [];
      let sampleRate = audioBuffer.sampleRate;
      let pos = 0;
      for (let i = 0; i < numOfChan; i++) {
        channels.push(audioBuffer.getChannelData(i));
      }
      function setUint16(data) {
        view.setUint16(pos, data, true);
        pos += 2;
      }
      function setUint32(data) {
        view.setUint32(pos, data, true);
        pos += 4;
      }
      setUint32(1179011410);
      setUint32(length - 8);
      setUint32(1163280727);
      setUint32(544501094);
      setUint32(16);
      setUint16(as32BitFloat ? 3 : 1);
      setUint16(numOfChan);
      setUint32(sampleRate);
      setUint32(sampleRate * numOfChan * (as32BitFloat ? 4 : 2));
      setUint16(numOfChan * (as32BitFloat ? 4 : 2));
      setUint16(as32BitFloat ? 32 : 16);
      setUint32(1635017060);
      setUint32(length - pos - 4);
      if (as32BitFloat) {
        for (let i = 0; i < audioBuffer.length; i++) {
          for (let ch = 0; ch < numOfChan; ch++) {
            view.setFloat32(pos, channels[ch][i], true);
            pos += 4;
          }
        }
      } else {
        for (let i = 0; i < audioBuffer.length; i++) {
          for (let ch = 0; ch < numOfChan; ch++) {
            let sample = Math.max(-1, Math.min(1, channels[ch][i]));
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
            view.setInt16(pos, sample, true);
            pos += 2;
          }
        }
      }
      return new Blob([outBuffer], { type: "audio/wav" });
    }
    /**
     * Triggers browser download of a blob
     * @param {Blob} blob 
     * @param {string} filename 
     */
    static downloadBlob(blob, filename = "audiodeck-export.wav") {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.style.display = "none";
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      setTimeout(() => {
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
      }, 1e3);
    }
  };

  // js/engine/AudioEngine.js
  var AudioEngine = class {
    constructor() {
      this.ctx = null;
      this.isInitialized = false;
      this.isPlaying = false;
      this.isRecording = false;
      this.bpm = 120;
      this.timeSignature = [4, 4];
      this.playheadPosition = 0;
      this.playbackStartTime = 0;
      this.playbackStartOffset = 0;
      this.loopEnabled = false;
      this.loopStartBeat = 0;
      this.loopEndBeat = 8;
      this.metronomeEnabled = false;
      this.metronomeVolume = 0.6;
      this.lastScheduledMetronomeBeat = -1;
      this.masterEffects = null;
      this.trackEngines = /* @__PURE__ */ new Map();
      this.schedulerTimer = null;
      this.lookaheadMs = 25;
      this.scheduleAheadSec = 0.12;
      this.lastScheduledTime = 0;
      this.sampleLibrary = {};
      this.mediaStream = null;
      this.mediaRecorder = null;
      this.recordedChunks = [];
      this.isMicRecording = false;
      this.recordTargetTrackId = null;
      this.onPlayheadUpdate = null;
      this.onStateChange = null;
      this.onTrackLevelUpdate = null;
      this.onMasterLevelUpdate = null;
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
          console.warn("Web Audio API not supported in this browser");
          return;
        }
        this.ctx = new AudioCtxClass({
          latencyHint: "interactive"
        });
        this.masterEffects = new EffectsChain(this.ctx, {
          isMaster: true,
          gain: 0.85
        });
        this.masterLimiter = this.ctx.createDynamicsCompressor();
        this.masterLimiter.threshold.setValueAtTime(-0.5, this.ctx.currentTime);
        this.masterLimiter.knee.setValueAtTime(0, this.ctx.currentTime);
        this.masterLimiter.ratio.setValueAtTime(20, this.ctx.currentTime);
        this.masterLimiter.attack.setValueAtTime(2e-3, this.ctx.currentTime);
        this.masterLimiter.release.setValueAtTime(0.05, this.ctx.currentTime);
        this.masterEffects.outputNode.connect(this.masterLimiter);
        this.masterLimiter.connect(this.ctx.destination);
        this.sampleLibrary = SampleGenerator.generateLibrary(this.ctx);
        this.isInitialized = true;
        this._startUIMeterLoop();
      } catch (err) {
        console.warn("AudioEngine deferred full initialization:", err);
      }
    }
    async ensureContext() {
      if (!this.isInitialized || !this.ctx) {
        await this.init();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        try {
          await this.ctx.resume();
        } catch (e) {
          console.warn("AudioContext resume deferred:", e);
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
        hpfBypass: track.effects?.hpfBypass !== void 0 ? track.effects.hpfBypass : true,
        lpfFreq: track.effects?.lpfFreq || 2e4,
        lpfBypass: track.effects?.lpfBypass !== void 0 ? track.effects.lpfBypass : true,
        distortionDrive: track.effects?.distortionDrive || 0,
        distortionBypass: track.effects?.distortionBypass !== void 0 ? track.effects.distortionBypass : true,
        delayTime: track.effects?.delayTime || 0.35,
        delayFeedback: track.effects?.delayFeedback || 0.3,
        delayWet: track.effects?.delayWet || 0.3,
        delayBypass: track.effects?.delayBypass !== void 0 ? track.effects.delayBypass : true,
        reverbDecay: track.effects?.reverbDecay || 2,
        reverbWet: track.effects?.reverbWet || 0.25,
        reverbBypass: track.effects?.reverbBypass !== void 0 ? track.effects.reverbBypass : true
      });
      effects.outputNode.connect(this.masterEffects.inputNode);
      const synth = new SynthEngine(this.ctx, effects.inputNode, track.synthPreset || {});
      const drum = new DrumEngine(this.ctx, effects.inputNode, this.sampleLibrary);
      this.trackEngines.set(track.id, {
        track,
        effects,
        synth,
        drum,
        activeSources: /* @__PURE__ */ new Set(),
        scheduledEvents: /* @__PURE__ */ new Set()
      });
      this.updateSoloMuteStates();
    }
    unregisterTrack(trackId) {
      const engine = this.trackEngines.get(trackId);
      if (!engine) return;
      engine.activeSources.forEach((src) => {
        try {
          src.stop();
          src.disconnect();
        } catch (e) {
        }
      });
      engine.activeSources.clear();
      try {
        engine.effects.outputNode.disconnect();
      } catch (e) {
      }
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
          const shouldSound = eng.track.solo && !eng.track.mute;
          eng.effects.setMute(!shouldSound);
        } else {
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
      if (startBeat !== void 0) this.loopStartBeat = Math.max(0, startBeat);
      if (endBeat !== void 0) this.loopEndBeat = Math.max(this.loopStartBeat + 0.25, endBeat);
    }
    _calculateCurrentTime(elapsedSec) {
      let time = this.playbackStartOffset + elapsedSec;
      if (this.loopEnabled) {
        const loopStartSec = this.beatsToSeconds(this.loopStartBeat);
        const loopEndSec = this.beatsToSeconds(this.loopEndBeat);
        const loopDuration = loopEndSec - loopStartSec;
        if (loopDuration > 0 && time >= loopEndSec) {
          const over = time - loopStartSec;
          time = loopStartSec + over % loopDuration;
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
      project.tracks.forEach((track) => {
        const eng = this.trackEngines.get(track.id);
        if (!eng) return;
        track.clips.forEach((clip) => {
          const clipStartSec = this.beatsToSeconds(clip.startBeat);
          const clipEndSec = clipStartSec + this.beatsToSeconds(clip.durationBeats);
          if (clipEndSec >= windowStart && clipStartSec <= windowEnd) {
            if (track.type === "audio" && clip.audioBuffer) {
              this._scheduleAudioClip(eng, clip, clipStartSec, windowStart, now);
            } else if (track.type === "synth" && clip.notes) {
              this._scheduleMidiNotes(eng, clip, clipStartSec, windowStart, windowEnd, now);
            } else if (track.type === "drum" && clip.pattern) {
              this._scheduleDrumPattern(eng, clip, clipStartSec, windowStart, windowEnd, now);
            }
          }
        });
      });
    }
    _scheduleAudioClip(eng, clip, clipStartSec, windowStart, now) {
      if (clip._scheduledPlayTime && Math.abs(clip._scheduledPlayTime - windowStart) < 0.05) {
        return;
      }
      const buffer = clip.audioBuffer;
      if (!buffer) return;
      let offsetInClip = 0;
      let startDelay = clipStartSec - windowStart;
      if (startDelay < 0) {
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
      clipGain.gain.setValueAtTime(clip.volume !== void 0 ? clip.volume : 1, now);
      source.connect(clipGain);
      clipGain.connect(eng.effects.inputNode);
      const scheduledTime = now + startDelay;
      source.start(scheduledTime, offsetInClip, playDuration);
      clip._scheduledPlayTime = windowStart;
      eng.activeSources.add(source);
      source.onended = () => {
        eng.activeSources.delete(source);
        try {
          source.disconnect();
          clipGain.disconnect();
        } catch (e) {
        }
      };
    }
    _scheduleMidiNotes(eng, clip, clipStartSec, windowStart, windowEnd, now) {
      clip.notes.forEach((note) => {
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
          }, (this.scheduleAheadSec + noteDurSec + 0.2) * 1e3);
        }
      });
    }
    _scheduleDrumPattern(eng, clip, clipStartSec, windowStart, windowEnd, now) {
      if (!clip.pattern || !clip.pattern.tracks) return;
      const steps = clip.pattern.steps || 16;
      const stepBeatDuration = (clip.durationBeats || 4) / steps;
      const stepSec = this.beatsToSeconds(stepBeatDuration);
      clip.pattern.tracks.forEach((trackRow) => {
        const voiceIdx = trackRow.voiceIndex;
        trackRow.steps.forEach((stepVal, stepIdx) => {
          if (stepVal > 0) {
            const stepStartSec = clipStartSec + stepIdx * stepSec;
            if (stepStartSec >= windowStart - 0.01 && stepStartSec < windowEnd) {
              const stepKey = `${clip.id}_${voiceIdx}_${stepIdx}`;
              if (eng.scheduledEvents.has(stepKey)) return;
              const scheduleAudioTime = now + (stepStartSec - windowStart);
              const vel = typeof stepVal === "number" && stepVal > 1 ? stepVal : 100;
              eng.drum.triggerDrum(voiceIdx, vel, scheduleAudioTime);
              eng.scheduledEvents.add(stepKey);
              setTimeout(() => {
                eng.scheduledEvents.delete(stepKey);
              }, (this.scheduleAheadSec + 0.2) * 1e3);
            }
          }
        });
      });
    }
    _triggerMetronomeClick(time, isAccent = false) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(isAccent ? 1200 : 800, time);
      gain.gain.setValueAtTime(this.metronomeVolume * (isAccent ? 1 : 0.6), time);
      gain.gain.exponentialRampToValueAtTime(1e-3, time + 0.04);
      osc.connect(gain);
      gain.connect(this.masterEffects.inputNode);
      osc.start(time);
      osc.stop(time + 0.05);
    }
    _stopAllActiveSources() {
      for (const [_, eng] of this.trackEngines) {
        eng.activeSources.forEach((src) => {
          try {
            src.stop();
            src.disconnect();
          } catch (e) {
          }
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
        console.error("Microphone access error:", err);
        return false;
      }
    }
    async stopRecording() {
      if (!this.isMicRecording || !this.mediaRecorder) return null;
      return new Promise((resolve) => {
        this.mediaRecorder.onstop = async () => {
          const blob = new Blob(this.recordedChunks, { type: "audio/webm" });
          const arrayBuffer = await blob.arrayBuffer();
          try {
            const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
            this.isRecording = false;
            this.isMicRecording = false;
            if (this.mediaStream) {
              this.mediaStream.getTracks().forEach((t) => t.stop());
            }
            if (this.onStateChange) this.onStateChange({ isPlaying: this.isPlaying, isRecording: false });
            resolve({ audioBuffer, trackId: this.recordTargetTrackId });
          } catch (e) {
            console.error("Audio decode failed:", e);
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
        let maxBeat = 16;
        project.tracks.forEach((tr) => {
          tr.clips.forEach((c) => {
            const end = c.startBeat + c.durationBeats;
            if (end > maxBeat) maxBeat = end;
          });
        });
        startSec = 0;
        endSec = maxBeat * beatSec + 1;
      }
      const totalSec = Math.max(1, endSec - startSec);
      const sampleRate = 44100;
      const totalSamples = Math.ceil(totalSec * sampleRate);
      const OfflineCtxClass = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      const offlineCtx = new OfflineCtxClass(2, totalSamples, sampleRate);
      const masterFX = new EffectsChain(offlineCtx, {
        isMaster: true,
        gain: project.masterVolume !== void 0 ? project.masterVolume : 0.85
      });
      const masterLimiter = offlineCtx.createDynamicsCompressor();
      masterLimiter.threshold.setValueAtTime(-0.5, 0);
      masterLimiter.ratio.setValueAtTime(20, 0);
      masterFX.outputNode.connect(masterLimiter);
      masterLimiter.connect(offlineCtx.destination);
      const offlineLibrary = SampleGenerator.generateLibrary(offlineCtx);
      project.tracks.forEach((track) => {
        if (track.mute) return;
        const trFX = new EffectsChain(offlineCtx, {
          gain: track.volume,
          pan: track.pan,
          hpfFreq: track.effects?.hpfFreq || 20,
          hpfBypass: track.effects?.hpfBypass !== void 0 ? track.effects.hpfBypass : true,
          lpfFreq: track.effects?.lpfFreq || 2e4,
          lpfBypass: track.effects?.lpfBypass !== void 0 ? track.effects.lpfBypass : true,
          distortionDrive: track.effects?.distortionDrive || 0,
          distortionBypass: track.effects?.distortionBypass !== void 0 ? track.effects.distortionBypass : true,
          delayTime: track.effects?.delayTime || 0.35,
          delayFeedback: track.effects?.delayFeedback || 0.3,
          delayWet: track.effects?.delayWet || 0.3,
          delayBypass: track.effects?.delayBypass !== void 0 ? track.effects.delayBypass : true,
          reverbDecay: track.effects?.reverbDecay || 2,
          reverbWet: track.effects?.reverbWet || 0.25,
          reverbBypass: track.effects?.reverbBypass !== void 0 ? track.effects.reverbBypass : true
        });
        trFX.outputNode.connect(masterFX.inputNode);
        const synth = new SynthEngine(offlineCtx, trFX.inputNode, track.synthPreset || {});
        const drum = new DrumEngine(offlineCtx, trFX.inputNode, offlineLibrary);
        track.clips.forEach((clip) => {
          const clipStart = clip.startBeat * beatSec - startSec;
          const clipDur = clip.durationBeats * beatSec;
          if (clipStart + clipDur < 0) return;
          if (track.type === "audio" && clip.audioBuffer) {
            const src = offlineCtx.createBufferSource();
            src.buffer = clip.audioBuffer;
            src.connect(trFX.inputNode);
            const offset = clipStart < 0 ? Math.abs(clipStart) : 0;
            const startTime = Math.max(0, clipStart);
            const dur = Math.min(clip.audioBuffer.duration - offset, clipDur);
            if (dur > 0) src.start(startTime, offset, dur);
          } else if (track.type === "synth" && clip.notes) {
            clip.notes.forEach((note) => {
              const noteStart = clipStart + note.startBeat * beatSec;
              const noteDur = note.durationBeats * beatSec;
              if (noteStart >= 0 && noteStart < totalSec) {
                synth.triggerNote(note.pitch, note.velocity || 100, noteStart, noteDur);
              }
            });
          } else if (track.type === "drum" && clip.pattern) {
            const steps = clip.pattern.steps || 16;
            const stepSec = clipDur / steps;
            clip.pattern.tracks.forEach((row) => {
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
      if (onProgress) onProgress(1);
      return wavBlob;
    }
  };

  // js/models/Clip.js
  var Clip = class {
    constructor(options = {}) {
      this.id = options.id || "clip_" + Math.random().toString(36).substr(2, 9);
      this.name = options.name || "Clip";
      this.trackId = options.trackId || null;
      this.startBeat = options.startBeat !== void 0 ? options.startBeat : 0;
      this.durationBeats = options.durationBeats !== void 0 ? options.durationBeats : 4;
      this.color = options.color || "#3b82f6";
      this.selected = false;
    }
  };
  var AudioClip = class _AudioClip extends Clip {
    constructor(options = {}) {
      super(options);
      this.type = "audio";
      this.sampleKey = options.sampleKey || null;
      this.audioBuffer = options.audioBuffer || null;
      this.offsetSeconds = options.offsetSeconds || 0;
      this.volume = options.volume !== void 0 ? options.volume : 1;
      this.color = options.color || "#3b82f6";
    }
    clone() {
      return new _AudioClip({
        id: "clip_" + Math.random().toString(36).substr(2, 9),
        name: this.name + " (Copy)",
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
        type: "audio",
        trackId: this.trackId,
        startBeat: this.startBeat,
        durationBeats: this.durationBeats,
        sampleKey: this.sampleKey,
        offsetSeconds: this.offsetSeconds,
        volume: this.volume,
        color: this.color
      };
    }
  };
  var MidiClip = class _MidiClip extends Clip {
    constructor(options = {}) {
      super(options);
      this.type = "synth";
      this.notes = options.notes ? JSON.parse(JSON.stringify(options.notes)) : [];
      this.color = options.color || "#10b981";
    }
    clone() {
      return new _MidiClip({
        id: "clip_" + Math.random().toString(36).substr(2, 9),
        name: this.name + " (Copy)",
        trackId: this.trackId,
        startBeat: this.startBeat + this.durationBeats,
        durationBeats: this.durationBeats,
        notes: this.notes.map((n) => ({ ...n, id: "note_" + Math.random().toString(36).substr(2, 9) })),
        color: this.color
      });
    }
    toJSON() {
      return {
        id: this.id,
        name: this.name,
        type: "synth",
        trackId: this.trackId,
        startBeat: this.startBeat,
        durationBeats: this.durationBeats,
        notes: this.notes,
        color: this.color
      };
    }
  };
  var PatternClip = class _PatternClip extends Clip {
    constructor(options = {}) {
      super(options);
      this.type = "drum";
      this.pattern = options.pattern ? JSON.parse(JSON.stringify(options.pattern)) : this._defaultPattern();
      this.color = options.color || "#f59e0b";
    }
    _defaultPattern() {
      return {
        steps: 16,
        tracks: [
          { voiceIndex: 0, steps: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0] },
          // Kick (4 on floor)
          { voiceIndex: 1, steps: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0] },
          // Snare (2 and 4)
          { voiceIndex: 2, steps: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
          // Closed Hat 16ths
          { voiceIndex: 3, steps: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0] },
          // Open Hat offbeats
          { voiceIndex: 4, steps: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0] },
          // Clap
          { voiceIndex: 5, steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          // Tom
          { voiceIndex: 6, steps: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0] },
          // Rimshot
          { voiceIndex: 7, steps: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
          // Crash
        ]
      };
    }
    clone() {
      return new _PatternClip({
        id: "clip_" + Math.random().toString(36).substr(2, 9),
        name: this.name + " (Copy)",
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
        type: "drum",
        trackId: this.trackId,
        startBeat: this.startBeat,
        durationBeats: this.durationBeats,
        pattern: this.pattern,
        color: this.color
      };
    }
  };

  // js/models/Track.js
  var Track = class {
    constructor(options = {}) {
      this.id = options.id || "track_" + Math.random().toString(36).substr(2, 9);
      this.name = options.name || "Track";
      this.type = options.type || "audio";
      this.color = options.color || this._getDefaultColor(this.type);
      this.volume = options.volume !== void 0 ? options.volume : 0.8;
      this.pan = options.pan !== void 0 ? options.pan : 0;
      this.mute = options.mute || false;
      this.solo = options.solo || false;
      this.arm = options.arm || false;
      this.height = options.height || 90;
      this.clips = [];
      if (options.clips && Array.isArray(options.clips)) {
        this.clips = options.clips.map((c) => {
          if (c.type === "audio" || this.type === "audio") return new AudioClip(c);
          if (c.type === "synth" || this.type === "synth") return new MidiClip(c);
          if (c.type === "drum" || this.type === "drum") return new PatternClip(c);
          return new AudioClip(c);
        });
      }
      this.effects = Object.assign({
        hpfFreq: 20,
        hpfBypass: true,
        lpfFreq: 2e4,
        lpfBypass: true,
        distortionDrive: 0,
        distortionType: "soft",
        distortionBypass: true,
        delayTime: 0.35,
        delayFeedback: 0.3,
        delayWet: 0.3,
        delayBypass: true,
        reverbDecay: 2,
        reverbWet: 0.25,
        reverbBypass: true,
        compThreshold: -18,
        compRatio: 4,
        compBypass: true
      }, options.effects || {});
      this.synthPreset = Object.assign({
        osc1Type: "sawtooth",
        osc1Octave: 0,
        osc1Detune: 0,
        osc2Type: "square",
        osc2Octave: 0,
        osc2Semi: 7,
        osc2Detune: 8,
        oscMix: 0.4,
        subGain: 0.2,
        noiseGain: 0.05,
        filterType: "lowpass",
        filterCutoff: 2400,
        filterResonance: 3,
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
        lfoTarget: "cutoff",
        lfoWave: "sine",
        glide: 0.02,
        voiceGain: 0.75
      }, options.synthPreset || {});
    }
    _getDefaultColor(type) {
      switch (type) {
        case "synth":
          return "#10b981";
        // emerald
        case "drum":
          return "#f59e0b";
        // amber
        case "automation":
          return "#8b5cf6";
        // purple
        case "audio":
        default:
          return "#3b82f6";
      }
    }
    addClip(clip) {
      clip.trackId = this.id;
      this.clips.push(clip);
      return clip;
    }
    removeClip(clipId) {
      const idx = this.clips.findIndex((c) => c.id === clipId);
      if (idx !== -1) {
        return this.clips.splice(idx, 1)[0];
      }
      return null;
    }
    getClip(clipId) {
      return this.clips.find((c) => c.id === clipId);
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
        clips: this.clips.map((c) => c.toJSON())
      };
    }
  };

  // js/models/HistoryManager.js
  var HistoryManager = class {
    constructor(project, maxStack = 40) {
      this.project = project;
      this.maxStack = maxStack;
      this.undoStack = [];
      this.redoStack = [];
      this._isApplying = false;
    }
    /**
     * Pushes current project state snapshot into undo history
     * @param {string} actionName 
     */
    pushState(actionName = "Edit") {
      if (this._isApplying) return;
      const snapshot = this.project.serialize();
      this.undoStack.push({ actionName, state: snapshot });
      if (this.undoStack.length > this.maxStack) {
        this.undoStack.shift();
      }
      this.redoStack = [];
    }
    canUndo() {
      return this.undoStack.length > 0;
    }
    canRedo() {
      return this.redoStack.length > 0;
    }
    undo() {
      if (!this.canUndo()) return null;
      const currentSnapshot = this.project.serialize();
      const prev = this.undoStack.pop();
      this.redoStack.push({ actionName: prev.actionName, state: currentSnapshot });
      this._isApplying = true;
      this.project.deserialize(prev.state);
      this._isApplying = false;
      return prev.actionName;
    }
    redo() {
      if (!this.canRedo()) return null;
      const currentSnapshot = this.project.serialize();
      const next = this.redoStack.pop();
      this.undoStack.push({ actionName: next.actionName, state: currentSnapshot });
      this._isApplying = true;
      this.project.deserialize(next.state);
      this._isApplying = false;
      return next.actionName;
    }
    clear() {
      this.undoStack = [];
      this.redoStack = [];
    }
  };

  // js/models/Project.js
  var Project = class {
    constructor(options = {}) {
      this.id = options.id || "proj_" + Math.random().toString(36).substr(2, 9);
      this.name = options.name || "Untitled Project";
      this.bpm = options.bpm || 120;
      this.timeSignature = options.timeSignature || [4, 4];
      this.masterVolume = options.masterVolume !== void 0 ? options.masterVolume : 0.85;
      this.loop = {
        enabled: options.loop?.enabled !== void 0 ? options.loop.enabled : true,
        startBeat: options.loop?.startBeat || 0,
        endBeat: options.loop?.endBeat || 16
        // 4 bars default
      };
      this.zoom = {
        pixelsPerBeat: options.zoom?.pixelsPerBeat || 50,
        minZoom: 15,
        maxZoom: 200
      };
      this.snap = options.snap || "1/16";
      this.activeTool = options.activeTool || "pointer";
      this.activeTrackId = null;
      this.activeClipId = null;
      this.activeBottomTab = "mixer";
      this.tracks = [];
      if (options.tracks && Array.isArray(options.tracks)) {
        this.tracks = options.tracks.map((t) => new Track(t));
      }
      if (this.tracks.length > 0) {
        this.activeTrackId = this.tracks[0].id;
      }
      this.selectedClipIds = /* @__PURE__ */ new Set();
      this.selectedNoteIds = /* @__PURE__ */ new Set();
      this.history = new HistoryManager(this);
      this.listeners = /* @__PURE__ */ new Set();
    }
    subscribe(callback) {
      this.listeners.add(callback);
      return () => this.listeners.delete(callback);
    }
    notify(changeType = "update", detail = {}) {
      this.listeners.forEach((cb) => {
        try {
          cb(changeType, detail);
        } catch (e) {
          console.error("Project listener error:", e);
        }
      });
    }
    // -------------------------------------------------------------
    // SNAP FRACTION HELPER
    // -------------------------------------------------------------
    getSnapBeatValue() {
      switch (this.snap) {
        case "1/1":
          return 4;
        case "1/2":
          return 2;
        case "1/4":
          return 1;
        case "1/8":
          return 0.5;
        case "1/16":
          return 0.25;
        case "1/32":
          return 0.125;
        case "off":
        default:
          return 1e-3;
      }
    }
    snapBeat(beat) {
      const snapVal = this.getSnapBeatValue();
      if (snapVal <= 5e-3) return Math.max(0, beat);
      return Math.max(0, Math.round(beat / snapVal) * snapVal);
    }
    // -------------------------------------------------------------
    // TRACK OPERATIONS
    // -------------------------------------------------------------
    addTrack(type = "audio", name = null) {
      this.history.pushState("Add Track");
      const count = this.tracks.filter((t) => t.type === type).length + 1;
      const defaultName = name || `${type.charAt(0).toUpperCase() + type.slice(1)} ${count}`;
      const track = new Track({
        type,
        name: defaultName
      });
      this.tracks.push(track);
      this.activeTrackId = track.id;
      this.notify("track_added", { track });
      return track;
    }
    removeTrack(trackId) {
      const idx = this.tracks.findIndex((t) => t.id === trackId);
      if (idx !== -1) {
        this.history.pushState("Delete Track");
        const removed = this.tracks.splice(idx, 1)[0];
        if (this.activeTrackId === trackId) {
          this.activeTrackId = this.tracks.length > 0 ? this.tracks[0].id : null;
        }
        this.notify("track_removed", { trackId, track: removed });
        return removed;
      }
      return null;
    }
    duplicateTrack(trackId) {
      const original = this.getTrack(trackId);
      if (!original) return null;
      this.history.pushState("Duplicate Track");
      const json = original.toJSON();
      json.id = "track_" + Math.random().toString(36).substr(2, 9);
      json.name = original.name + " (Copy)";
      json.clips = json.clips.map((c) => {
        const copy = { ...c };
        copy.id = "clip_" + Math.random().toString(36).substr(2, 9);
        copy.trackId = json.id;
        return copy;
      });
      const newTrack = new Track(json);
      const idx = this.tracks.findIndex((t) => t.id === trackId);
      this.tracks.splice(idx + 1, 0, newTrack);
      this.activeTrackId = newTrack.id;
      this.notify("track_added", { track: newTrack });
      return newTrack;
    }
    reorderTrack(fromIdx, toIdx) {
      if (fromIdx < 0 || fromIdx >= this.tracks.length || toIdx < 0 || toIdx >= this.tracks.length) return;
      this.history.pushState("Reorder Tracks");
      const item = this.tracks.splice(fromIdx, 1)[0];
      this.tracks.splice(toIdx, 0, item);
      this.notify("tracks_reordered", { fromIdx, toIdx });
    }
    getTrack(trackId) {
      return this.tracks.find((t) => t.id === trackId);
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
      this.history.pushState("Delete Clips");
      this.selectedClipIds.forEach((id) => {
        for (const track of this.tracks) {
          track.removeClip(id);
        }
      });
      this.selectedClipIds.clear();
      this.activeClipId = null;
      this.notify("clips_deleted");
    }
    duplicateSelectedClips() {
      if (this.selectedClipIds.size === 0) return;
      this.history.pushState("Duplicate Clips");
      const newIds = /* @__PURE__ */ new Set();
      this.selectedClipIds.forEach((id) => {
        const { clip, track } = this.findClip(id);
        if (clip && track) {
          const copy = track.duplicateClip(id);
          if (copy) newIds.add(copy.id);
        }
      });
      this.selectedClipIds = newIds;
      this.notify("clips_duplicated");
    }
    splitClipAtBeat(clipId, splitBeat) {
      const { clip, track } = this.findClip(clipId);
      if (!clip || !track) return;
      const relBeat = splitBeat - clip.startBeat;
      if (relBeat <= 0.1 || relBeat >= clip.durationBeats - 0.1) return;
      this.history.pushState("Split Clip");
      const firstDur = relBeat;
      const secondDur = clip.durationBeats - relBeat;
      clip.durationBeats = firstDur;
      let secondClip = null;
      if (clip.type === "audio") {
        const beatSec = 60 / this.bpm;
        secondClip = new AudioClip({
          name: clip.name + " (part 2)",
          trackId: track.id,
          startBeat: splitBeat,
          durationBeats: secondDur,
          sampleKey: clip.sampleKey,
          audioBuffer: clip.audioBuffer,
          offsetSeconds: (clip.offsetSeconds || 0) + firstDur * beatSec,
          volume: clip.volume,
          color: clip.color
        });
      } else if (clip.type === "synth") {
        const part1Notes = clip.notes.filter((n) => n.startBeat < relBeat);
        const part2Notes = clip.notes.filter((n) => n.startBeat >= relBeat).map((n) => ({
          ...n,
          startBeat: n.startBeat - relBeat
        }));
        clip.notes = part1Notes;
        secondClip = new MidiClip({
          name: clip.name + " (part 2)",
          trackId: track.id,
          startBeat: splitBeat,
          durationBeats: secondDur,
          notes: part2Notes,
          color: clip.color
        });
      } else if (clip.type === "drum") {
        secondClip = clip.clone();
        secondClip.name = clip.name + " (part 2)";
        secondClip.startBeat = splitBeat;
        secondClip.durationBeats = secondDur;
      }
      if (secondClip) {
        track.addClip(secondClip);
        this.selectedClipIds.clear();
        this.selectedClipIds.add(secondClip.id);
        this.activeClipId = secondClip.id;
        this.notify("clip_split", { track, original: clip, split: secondClip });
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
        tracks: this.tracks.map((t) => t.toJSON())
      });
    }
    deserialize(jsonString, sampleLibrary = {}) {
      try {
        const data = typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString;
        this.id = data.id || this.id;
        this.name = data.name || this.name;
        this.bpm = data.bpm || 120;
        this.timeSignature = data.timeSignature || [4, 4];
        this.masterVolume = data.masterVolume !== void 0 ? data.masterVolume : 0.85;
        this.loop = data.loop || { enabled: true, startBeat: 0, endBeat: 16 };
        this.zoom = data.zoom || { pixelsPerBeat: 50, minZoom: 15, maxZoom: 200 };
        this.snap = data.snap || "1/16";
        this.activeBottomTab = data.activeBottomTab || "mixer";
        this.tracks = (data.tracks || []).map((t) => {
          const track = new Track(t);
          track.clips.forEach((c) => {
            if (c.type === "audio" && c.sampleKey && sampleLibrary[c.sampleKey]) {
              c.audioBuffer = sampleLibrary[c.sampleKey].buffer;
            }
          });
          return track;
        });
        this.activeTrackId = this.tracks.length > 0 ? this.tracks[0].id : null;
        this.selectedClipIds.clear();
        this.selectedNoteIds.clear();
        this.notify("project_loaded");
        return true;
      } catch (e) {
        console.error("Project deserialization error:", e);
        return false;
      }
    }
  };

  // js/storage/StorageManager.js
  var StorageManager = class _StorageManager {
    static DB_NAME = "AudioDeckDB";
    static DB_VERSION = 1;
    static STORE_PROJECTS = "projects";
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
            reject(new Error("IndexedDB timeout"));
          }
        }, 200);
        try {
          if (typeof window === "undefined" || !window.indexedDB) {
            done = true;
            clearTimeout(timer);
            reject(new Error("IndexedDB not supported"));
            return;
          }
          const request = indexedDB.open(_StorageManager.DB_NAME, _StorageManager.DB_VERSION);
          request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(_StorageManager.STORE_PROJECTS)) {
              const store = db.createObjectStore(_StorageManager.STORE_PROJECTS, { keyPath: "id" });
              store.createIndex("updatedAt", "updatedAt", { unique: false });
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
        if (typeof localStorage === "undefined") return list;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("audiodeck_proj_")) {
            const raw = localStorage.getItem(key);
            if (raw) {
              const parsed = JSON.parse(raw);
              list.push({
                id: parsed.id || key.replace("audiodeck_proj_", ""),
                name: parsed.name || "Untitled Project",
                bpm: parsed.bpm || 120,
                updatedAt: parsed.updatedAt || Date.now()
              });
            }
          }
        }
      } catch (e) {
      }
      return list;
    }
    /**
     * Saves project to IndexedDB
     * @param {Project} project 
     */
    static async saveProject(project) {
      try {
        const db = await _StorageManager.getDB();
        const tx = db.transaction(_StorageManager.STORE_PROJECTS, "readwrite");
        const store = tx.objectStore(_StorageManager.STORE_PROJECTS);
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
        console.warn("IndexedDB save failed, falling back to localStorage:", e);
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
        const db = await _StorageManager.getDB();
        const tx = db.transaction(_StorageManager.STORE_PROJECTS, "readonly");
        const store = tx.objectStore(_StorageManager.STORE_PROJECTS);
        return new Promise((resolve) => {
          const req = store.getAll();
          req.onsuccess = () => {
            const list = (req.result || []).map((r) => ({
              id: r.id,
              name: r.name,
              bpm: r.bpm,
              updatedAt: r.updatedAt
            }));
            if (list.length === 0) {
              const localList = _StorageManager.listLocalStorageProjects();
              resolve(localList);
            } else {
              list.sort((a, b) => b.updatedAt - a.updatedAt);
              resolve(list);
            }
          };
          req.onerror = () => resolve(_StorageManager.listLocalStorageProjects());
        });
      } catch (e) {
        return _StorageManager.listLocalStorageProjects();
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
        const db = await _StorageManager.getDB();
        const tx = db.transaction(_StorageManager.STORE_PROJECTS, "readonly");
        const store = tx.objectStore(_StorageManager.STORE_PROJECTS);
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
        try {
          const raw = localStorage.getItem(`audiodeck_proj_${id}`);
          if (raw) {
            const proj = new Project();
            proj.deserialize(raw, sampleLibrary);
            return proj;
          }
        } catch (err) {
        }
        return null;
      }
    }
    /**
     * Deletes a project from IndexedDB
     * @param {string} id 
     */
    static async deleteProject(id) {
      try {
        const db = await _StorageManager.getDB();
        const tx = db.transaction(_StorageManager.STORE_PROJECTS, "readwrite");
        const store = tx.objectStore(_StorageManager.STORE_PROJECTS);
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
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      const safeName = project.name.toLowerCase().replace(/[^a-z0-9]/g, "_") || "audiodeck_session";
      a.download = `${safeName}.audiodeck`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1e3);
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
              reject(new Error("Invalid or corrupted .audiodeck project file"));
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
        { id: "synthwave", name: "Neon Horizon (Synthwave 120 BPM)", bpm: 120, desc: "Full 5-track arrangement with 808 drums, acid bass, neon chords, arp lead, and cinematic FX." },
        { id: "deephouse", name: "Midnight Groove (Deep House 124 BPM)", bpm: 124, desc: "Punchy four-on-the-floor groove, sub bassline, and warm Rhodes chord progression." },
        { id: "lofi", name: "Dust & Tape (Lo-Fi Hip-Hop 84 BPM)", bpm: 84, desc: "Vinyl dust texture, relaxed 808 groove, and jazz 9th keys." },
        { id: "empty", name: "Studio Empty Session (120 BPM)", bpm: 120, desc: "Clean starter project with Drums, Synth, and Audio tracks ready to record." }
      ];
    }
    /**
     * Creates a project from a selected template
     * @param {string} templateId 
     * @param {Object} sampleLibrary 
     * @returns {Project}
     */
    static createTemplateProject(templateId = "synthwave", sampleLibrary = {}) {
      switch (templateId) {
        case "deephouse":
          return this.createDeepHouseProject(sampleLibrary);
        case "lofi":
          return this.createLoFiProject(sampleLibrary);
        case "empty":
          return this.createEmptySession();
        case "synthwave":
        default:
          return this.createDemoProject(sampleLibrary);
      }
    }
    /**
     * Template 1: Neon Horizon (Synthwave Demo)
     */
    static createDemoProject(sampleLibrary = {}) {
      const proj = new Project({
        name: "Neon Horizon",
        bpm: 120,
        timeSignature: [4, 4],
        masterVolume: 0.88,
        loop: { enabled: true, startBeat: 0, endBeat: 16 },
        zoom: { pixelsPerBeat: 55, minZoom: 15, maxZoom: 200 },
        snap: "1/16"
      });
      const drumTrack = new Track({
        id: "tr_drums",
        name: "808 Drum Machine",
        type: "drum",
        volume: 0.9,
        pan: 0,
        color: "#f59e0b",
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
      drumTrack.addClip(new PatternClip({ name: "Electro Beat A", startBeat: 0, durationBeats: 8, pattern: drumPatternA }));
      drumTrack.addClip(new PatternClip({ name: "Electro Beat B", startBeat: 8, durationBeats: 8, pattern: drumPatternB }));
      proj.tracks.push(drumTrack);
      const bassTrack = new Track({
        id: "tr_bass",
        name: "Acid Saw Bass",
        type: "synth",
        volume: 0.85,
        pan: 0,
        color: "#10b981",
        synthPreset: {
          osc1Type: "sawtooth",
          osc1Octave: -1,
          osc2Type: "square",
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
        { id: "bn1", pitch: 29, startBeat: 0, durationBeats: 0.75, velocity: 110 },
        { id: "bn2", pitch: 29, startBeat: 0.75, durationBeats: 0.5, velocity: 95 },
        { id: "bn3", pitch: 32, startBeat: 1.5, durationBeats: 0.75, velocity: 105 },
        { id: "bn4", pitch: 34, startBeat: 2.25, durationBeats: 0.5, velocity: 100 },
        { id: "bn5", pitch: 36, startBeat: 3, durationBeats: 0.75, velocity: 115 },
        { id: "bn6", pitch: 34, startBeat: 3.75, durationBeats: 0.25, velocity: 90 },
        { id: "bn7", pitch: 29, startBeat: 4, durationBeats: 0.75, velocity: 110 },
        { id: "bn8", pitch: 39, startBeat: 4.75, durationBeats: 0.5, velocity: 100 },
        { id: "bn9", pitch: 36, startBeat: 5.5, durationBeats: 0.75, velocity: 105 },
        { id: "bn10", pitch: 34, startBeat: 6.25, durationBeats: 0.5, velocity: 100 },
        { id: "bn11", pitch: 29, startBeat: 7, durationBeats: 1, velocity: 115 }
      ];
      const bassNotes2 = [
        { id: "bn12", pitch: 29, startBeat: 0, durationBeats: 0.75, velocity: 110 },
        { id: "bn13", pitch: 29, startBeat: 0.75, durationBeats: 0.5, velocity: 95 },
        { id: "bn14", pitch: 32, startBeat: 1.5, durationBeats: 0.75, velocity: 105 },
        { id: "bn15", pitch: 34, startBeat: 2.25, durationBeats: 0.5, velocity: 100 },
        { id: "bn16", pitch: 36, startBeat: 3, durationBeats: 0.75, velocity: 115 },
        { id: "bn17", pitch: 39, startBeat: 3.75, durationBeats: 0.25, velocity: 95 },
        { id: "bn18", pitch: 41, startBeat: 4, durationBeats: 0.75, velocity: 110 },
        { id: "bn19", pitch: 39, startBeat: 4.75, durationBeats: 0.5, velocity: 100 },
        { id: "bn20", pitch: 36, startBeat: 5.5, durationBeats: 0.75, velocity: 105 },
        { id: "bn21", pitch: 34, startBeat: 6.25, durationBeats: 0.75, velocity: 100 },
        { id: "bn22", pitch: 29, startBeat: 7, durationBeats: 1, velocity: 115 }
      ];
      bassTrack.addClip(new MidiClip({ name: "Bass Groove A", startBeat: 0, durationBeats: 8, notes: bassNotes1 }));
      bassTrack.addClip(new MidiClip({ name: "Bass Groove B", startBeat: 8, durationBeats: 8, notes: bassNotes2 }));
      proj.tracks.push(bassTrack);
      const chordTrack = new Track({
        id: "tr_chords",
        name: "Neon Poly Chords",
        type: "synth",
        volume: 0.75,
        pan: -0.15,
        color: "#6366f1",
        synthPreset: {
          osc1Type: "sawtooth",
          osc1Octave: 0,
          osc1Detune: -6,
          osc2Type: "triangle",
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
          lfoTarget: "cutoff"
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
        { id: "ch1", pitch: 53, startBeat: 0, durationBeats: 3.5, velocity: 85 },
        { id: "ch2", pitch: 56, startBeat: 0, durationBeats: 3.5, velocity: 85 },
        { id: "ch3", pitch: 60, startBeat: 0, durationBeats: 3.5, velocity: 85 },
        { id: "ch4", pitch: 63, startBeat: 0, durationBeats: 3.5, velocity: 85 },
        { id: "ch5", pitch: 49, startBeat: 4, durationBeats: 3.5, velocity: 90 },
        { id: "ch6", pitch: 53, startBeat: 4, durationBeats: 3.5, velocity: 90 },
        { id: "ch7", pitch: 56, startBeat: 4, durationBeats: 3.5, velocity: 90 },
        { id: "ch8", pitch: 60, startBeat: 4, durationBeats: 3.5, velocity: 90 },
        { id: "ch9", pitch: 51, startBeat: 8, durationBeats: 3.5, velocity: 90 },
        { id: "ch10", pitch: 55, startBeat: 8, durationBeats: 3.5, velocity: 90 },
        { id: "ch11", pitch: 58, startBeat: 8, durationBeats: 3.5, velocity: 90 },
        { id: "ch12", pitch: 61, startBeat: 8, durationBeats: 3.5, velocity: 90 },
        { id: "ch13", pitch: 48, startBeat: 12, durationBeats: 3.5, velocity: 85 },
        { id: "ch14", pitch: 51, startBeat: 12, durationBeats: 3.5, velocity: 85 },
        { id: "ch15", pitch: 55, startBeat: 12, durationBeats: 3.5, velocity: 85 },
        { id: "ch16", pitch: 58, startBeat: 12, durationBeats: 3.5, velocity: 85 }
      ];
      chordTrack.addClip(new MidiClip({ name: "Lush Fm7 Progression", startBeat: 0, durationBeats: 16, notes: chordNotes }));
      proj.tracks.push(chordTrack);
      const leadTrack = new Track({
        id: "tr_lead",
        name: "Cyberpunk Lead Hook",
        type: "synth",
        volume: 0.8,
        pan: 0.2,
        color: "#ec4899",
        synthPreset: {
          osc1Type: "square",
          osc1Octave: 1,
          osc2Type: "sawtooth",
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
          pitch,
          startBeat: beat,
          durationBeats: 0.4,
          velocity: beat % 2 === 0 ? 110 : 90
        });
      }
      leadTrack.addClip(new MidiClip({ name: "Lead Arp Hook", startBeat: 0, durationBeats: 16, notes: leadNotes }));
      proj.tracks.push(leadTrack);
      const fxTrack = new Track({
        id: "tr_fx",
        name: "FX & Atmospheres",
        type: "audio",
        volume: 0.7,
        pan: 0,
        color: "#06b6d4",
        effects: {
          reverbDecay: 3.5,
          reverbWet: 0.3,
          reverbBypass: false
        }
      });
      if (sampleLibrary["fx_vinyl"]) {
        fxTrack.addClip(new AudioClip({
          name: "Vinyl Atmosphere A",
          startBeat: 0,
          durationBeats: 8,
          sampleKey: "fx_vinyl",
          audioBuffer: sampleLibrary["fx_vinyl"].buffer,
          volume: 0.5
        }));
        fxTrack.addClip(new AudioClip({
          name: "Vinyl Atmosphere B",
          startBeat: 8,
          durationBeats: 8,
          sampleKey: "fx_vinyl",
          audioBuffer: sampleLibrary["fx_vinyl"].buffer,
          volume: 0.5
        }));
      }
      if (sampleLibrary["fx_riser"]) {
        fxTrack.addClip(new AudioClip({
          name: "Cyber Riser 4-Bar",
          startBeat: 8,
          durationBeats: 8,
          sampleKey: "fx_riser",
          audioBuffer: sampleLibrary["fx_riser"].buffer,
          volume: 0.8
        }));
      }
      if (sampleLibrary["fx_impact"]) {
        fxTrack.addClip(new AudioClip({
          name: "Sub Drop Impact",
          startBeat: 0,
          durationBeats: 4,
          sampleKey: "fx_impact",
          audioBuffer: sampleLibrary["fx_impact"].buffer,
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
        name: "Midnight Velvet",
        bpm: 124,
        timeSignature: [4, 4],
        masterVolume: 0.9,
        loop: { enabled: true, startBeat: 0, endBeat: 16 }
      });
      const drumTrack = new Track({
        id: "tr_house_drums",
        name: "Club 909 Groove",
        type: "drum",
        volume: 0.92,
        color: "#f59e0b"
      });
      drumTrack.addClip(new PatternClip({
        name: "House 4/4 Beat",
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
        id: "tr_house_bass",
        name: "Deep Sub Bass",
        type: "synth",
        volume: 0.88,
        color: "#10b981",
        synthPreset: {
          osc1Type: "sine",
          osc1Octave: -1,
          osc2Type: "triangle",
          osc2Octave: -1,
          subGain: 0.5,
          filterCutoff: 1200,
          ampAttack: 0.01,
          ampDecay: 0.3
        }
      });
      const houseBassNotes = [
        { id: "hb1", pitch: 33, startBeat: 0.5, durationBeats: 0.75, velocity: 100 },
        // A1
        { id: "hb2", pitch: 33, startBeat: 1.75, durationBeats: 0.5, velocity: 90 },
        { id: "hb3", pitch: 36, startBeat: 2.5, durationBeats: 0.75, velocity: 105 },
        // C2
        { id: "hb4", pitch: 38, startBeat: 3.5, durationBeats: 0.5, velocity: 95 }
        // D2
      ];
      bassTrack.addClip(new MidiClip({ name: "Deep Bassline", startBeat: 0, durationBeats: 16, notes: houseBassNotes }));
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
        name: "Dust & Tape",
        bpm: 84,
        timeSignature: [4, 4],
        masterVolume: 0.85,
        loop: { enabled: true, startBeat: 0, endBeat: 16 }
      });
      const drums = new Track({
        id: "tr_lofi_drums",
        name: "Boom Bap Drums",
        type: "drum",
        volume: 0.85,
        color: "#f59e0b"
      });
      drums.addClip(new PatternClip({
        name: "Dusty Beat",
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
        name: "Studio Session",
        bpm: 120,
        timeSignature: [4, 4],
        masterVolume: 0.88
      });
      proj.addTrack("drum", "Drums");
      proj.addTrack("synth", "Synth Lead");
      proj.addTrack("audio", "Audio Track");
      if (proj.tracks.length > 0) {
        proj.activeTrackId = proj.tracks[0].id;
        proj.activeClipId = proj.tracks[0].clips[0]?.id || null;
      }
      return proj;
    }
  };

  // js/ui/TransportView.js
  var TransportView = class {
    /**
     * @param {HTMLElement} container 
     * @param {AudioEngine} audioEngine 
     * @param {Project} project 
     * @param {Object} actions Callbacks for modals & actions
     */
    constructor(container, audioEngine, project, actions = {}) {
      this.container = container;
      this.engine = audioEngine;
      this.project = project;
      this.actions = actions;
      this.timeDisplayMode = "bars";
      this.tapTimes = [];
      this._render();
      this._bindEvents();
      this._setupEngineListeners();
    }
    _render() {
      this.container.innerHTML = `
            <div class="transport-bar">
                <!-- Left: Project Name & File Operations -->
                <div class="transport-section transport-project">
                    <div class="app-logo" title="AudioDeck Pro DAW">
                        <span class="logo-icon">\u{1F39B}\uFE0F</span>
                        <span class="logo-text">AUDIODECK</span>
                    </div>
                    <div class="project-title-box">
                        <input type="text" class="project-name-input" value="${this.project.name}" title="Click to rename project" />
                    </div>
                    <div class="transport-btn-group">
                        <button class="transport-btn" id="btnNewProject" title="New Session / Template">
                            <span class="btn-icon">\u{1F4C4}</span>
                        </button>
                        <button class="transport-btn" id="btnOpenProject" title="Open Session">
                            <span class="btn-icon">\u{1F4C2}</span>
                        </button>
                        <button class="transport-btn" id="btnSaveProject" title="Save Session (Ctrl+S)">
                            <span class="btn-icon">\u{1F4BE}</span>
                        </button>
                        <button class="transport-btn btn-export-highlight" id="btnExportWav" title="Render Master Audio (Ctrl+E)">
                            <span class="btn-icon">\u26A1</span> Export WAV
                        </button>
                    </div>
                </div>

                <!-- Center: Transport Playback Controls -->
                <div class="transport-section transport-controls">
                    <!-- Undo / Redo -->
                    <div class="transport-btn-group">
                        <button class="transport-btn" id="btnUndo" title="Undo (Ctrl+Z)">\u27F2</button>
                        <button class="transport-btn" id="btnRedo" title="Redo (Ctrl+Y)">\u27F3</button>
                    </div>

                    <!-- Play / Pause / Stop / Rec -->
                    <div class="transport-playback-cluster">
                        <button class="transport-play-btn" id="btnPlay" title="Play / Pause (Space)">
                            <span class="play-icon">\u25B6</span>
                        </button>
                        <button class="transport-btn" id="btnStop" title="Stop & Return to Start (Enter)">
                            <span class="btn-icon">\u25A0</span>
                        </button>
                        <button class="transport-btn transport-rec-btn" id="btnRecord" title="Record Microphone to Track">
                            <span class="rec-dot"></span>
                        </button>
                        <button class="transport-btn ${this.project.loop.enabled ? "active" : ""}" id="btnLoop" title="Toggle Loop Region (L)">
                            <span class="btn-icon">\u{1F501}</span>
                        </button>
                        <button class="transport-btn" id="btnMetronome" title="Metronome Click">
                            <span class="btn-icon">\u23F1\uFE0F</span>
                        </button>
                    </div>

                    <!-- Time & Position Display -->
                    <div class="transport-time-display" id="timeDisplay" title="Click to toggle Bar:Beat vs Time (MM:SS)">
                        <div class="time-primary" id="timeDisplayPrimary">001.01.01</div>
                        <div class="time-secondary" id="timeDisplaySecondary">00:00.000</div>
                    </div>

                    <!-- Tempo & Meter Controls -->
                    <div class="transport-tempo-box">
                        <div class="tempo-input-wrapper">
                            <label>BPM</label>
                            <input type="number" id="inputBPM" min="30" max="300" value="${this.project.bpm}" title="Project Tempo" />
                        </div>
                        <button class="transport-tap-btn" id="btnTapTempo" title="Tap tempo rhythmically">TAP</button>
                        <div class="signature-box" title="Time Signature">
                            <span class="signature-text">${this.project.timeSignature[0]}/${this.project.timeSignature[1]}</span>
                        </div>
                    </div>
                </div>

                <!-- Right: Tools, Snapping, DSP status & Master Meter -->
                <div class="transport-section transport-tools">
                    <!-- Tool Selectors -->
                    <div class="transport-tools-group">
                        <button class="tool-btn ${this.project.activeTool === "pointer" ? "active" : ""}" data-tool="pointer" title="Pointer Tool (1)">\u2196</button>
                        <button class="tool-btn ${this.project.activeTool === "pencil" ? "active" : ""}" data-tool="pencil" title="Pencil / Draw Tool (2)">\u270F</button>
                        <button class="tool-btn ${this.project.activeTool === "scissors" ? "active" : ""}" data-tool="scissors" title="Scissors / Split Tool (3)">\u2702</button>
                        <button class="tool-btn ${this.project.activeTool === "eraser" ? "active" : ""}" data-tool="eraser" title="Eraser Tool (4)">\u232B</button>
                    </div>

                    <!-- Snapping Dropdown -->
                    <div class="transport-snap-box">
                        <label>SNAP</label>
                        <select id="selectSnap" class="snap-select" title="Grid Snapping Division">
                            <option value="1/1" ${this.project.snap === "1/1" ? "selected" : ""}>1 Bar</option>
                            <option value="1/2" ${this.project.snap === "1/2" ? "selected" : ""}>1/2</option>
                            <option value="1/4" ${this.project.snap === "1/4" ? "selected" : ""}>1/4</option>
                            <option value="1/8" ${this.project.snap === "1/8" ? "selected" : ""}>1/8</option>
                            <option value="1/16" ${this.project.snap === "1/16" ? "selected" : ""}>1/16</option>
                            <option value="1/32" ${this.project.snap === "1/32" ? "selected" : ""}>1/32</option>
                            <option value="off" ${this.project.snap === "off" ? "selected" : ""}>Off</option>
                        </select>
                    </div>

                    <!-- DSP Status Tag -->
                    <div class="dsp-status-badge" title="Web Audio DSP Engine Active">
                        <span class="dsp-dot"></span>
                        <span class="dsp-text">44.1k</span>
                    </div>

                    <!-- Master Volume & Meter -->
                    <div class="transport-master-meter-box" title="Master Output Volume (Double click to reset)">
                        <label>MASTER</label>
                        <input type="range" id="sliderMasterVol" min="0" max="1.5" step="0.01" value="${this.project.masterVolume}" />
                        <div class="master-led-meter">
                            <div class="master-meter-fill" id="masterMeterL"></div>
                            <div class="master-meter-fill" id="masterMeterR"></div>
                        </div>
                    </div>

                    <!-- Help / Shortcuts -->
                    <button class="transport-btn" id="btnShortcuts" title="Keyboard Shortcuts Cheat Sheet (?)">
                        <span class="btn-icon">\u2753</span>
                    </button>
                </div>
            </div>
        `;
      this.btnPlay = this.container.querySelector("#btnPlay");
      this.btnStop = this.container.querySelector("#btnStop");
      this.btnRecord = this.container.querySelector("#btnRecord");
      this.btnLoop = this.container.querySelector("#btnLoop");
      this.btnMetronome = this.container.querySelector("#btnMetronome");
      this.timePrimary = this.container.querySelector("#timeDisplayPrimary");
      this.timeSecondary = this.container.querySelector("#timeDisplaySecondary");
      this.inputBPM = this.container.querySelector("#inputBPM");
      this.btnTapTempo = this.container.querySelector("#btnTapTempo");
      this.selectSnap = this.container.querySelector("#selectSnap");
      this.sliderMasterVol = this.container.querySelector("#sliderMasterVol");
      this.masterMeterL = this.container.querySelector("#masterMeterL");
      this.masterMeterR = this.container.querySelector("#masterMeterR");
      this.projectNameInput = this.container.querySelector(".project-name-input");
    }
    _bindEvents() {
      this.projectNameInput.addEventListener("change", (e) => {
        this.project.name = e.target.value || "Untitled Session";
        this.project.notify("project_renamed");
      });
      this.container.querySelector("#btnNewProject").addEventListener("click", () => {
        if (this.actions.onNewProject) this.actions.onNewProject();
      });
      this.container.querySelector("#btnOpenProject").addEventListener("click", () => {
        if (this.actions.onOpenProject) this.actions.onOpenProject();
      });
      this.container.querySelector("#btnSaveProject").addEventListener("click", () => {
        if (this.actions.onSaveProject) this.actions.onSaveProject();
      });
      this.container.querySelector("#btnExportWav").addEventListener("click", () => {
        if (this.actions.onExportWav) this.actions.onExportWav();
      });
      this.container.querySelector("#btnShortcuts").addEventListener("click", () => {
        if (this.actions.onShortcuts) this.actions.onShortcuts();
      });
      this.container.querySelector("#btnUndo").addEventListener("click", () => {
        this.project.history.undo();
      });
      this.container.querySelector("#btnRedo").addEventListener("click", () => {
        this.project.history.redo();
      });
      this.btnPlay.addEventListener("click", async () => {
        if (this.engine.isPlaying) {
          this.engine.pause();
        } else {
          await this.engine.play(this.project);
        }
      });
      this.btnStop.addEventListener("click", () => {
        this.engine.stop();
      });
      this.btnRecord.addEventListener("click", async () => {
        if (this.engine.isRecording) {
          const result = await this.engine.stopRecording();
          if (result && result.audioBuffer) {
            if (this.actions.onRecordingFinished) {
              this.actions.onRecordingFinished(result);
            }
          }
        } else {
          const targetTrack = this.project.getTrack(this.project.activeTrackId) || this.project.tracks.find((t) => t.type === "audio");
          const trackId = targetTrack ? targetTrack.id : null;
          const ok = await this.engine.startRecording(trackId);
          if (ok && !this.engine.isPlaying) {
            this.engine.play(this.project);
          }
        }
      });
      this.btnLoop.addEventListener("click", () => {
        this.project.loop.enabled = !this.project.loop.enabled;
        this.engine.setLoop(this.project.loop.enabled, this.project.loop.startBeat, this.project.loop.endBeat);
        this.btnLoop.classList.toggle("active", this.project.loop.enabled);
        this.project.notify("loop_changed");
      });
      this.btnMetronome.addEventListener("click", () => {
        this.engine.metronomeEnabled = !this.engine.metronomeEnabled;
        this.btnMetronome.classList.toggle("active", this.engine.metronomeEnabled);
      });
      this.container.querySelector("#timeDisplay").addEventListener("click", () => {
        this.timeDisplayMode = this.timeDisplayMode === "bars" ? "time" : "bars";
      });
      this.inputBPM.addEventListener("change", (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val)) {
          this.project.bpm = Math.max(30, Math.min(300, val));
          this.engine.setBPM(this.project.bpm);
          this.project.notify("tempo_changed");
        }
      });
      this.btnTapTempo.addEventListener("click", () => {
        const now = Date.now();
        if (this.tapTimes.length > 0 && now - this.tapTimes[this.tapTimes.length - 1] > 2500) {
          this.tapTimes = [];
        }
        this.tapTimes.push(now);
        if (this.tapTimes.length > 4) this.tapTimes.shift();
        if (this.tapTimes.length >= 2) {
          let intervalsSum = 0;
          for (let i = 1; i < this.tapTimes.length; i++) {
            intervalsSum += this.tapTimes[i] - this.tapTimes[i - 1];
          }
          const avgIntervalMs = intervalsSum / (this.tapTimes.length - 1);
          const calcBPM = Math.round(6e4 / avgIntervalMs);
          if (calcBPM >= 30 && calcBPM <= 300) {
            this.project.bpm = calcBPM;
            this.inputBPM.value = calcBPM;
            this.engine.setBPM(calcBPM);
            this.project.notify("tempo_changed");
          }
        }
      });
      this.container.querySelectorAll(".tool-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const tool = e.currentTarget.getAttribute("data-tool");
          this.project.activeTool = tool;
          this.container.querySelectorAll(".tool-btn").forEach((b) => b.classList.remove("active"));
          e.currentTarget.classList.add("active");
          this.project.notify("tool_changed", { tool });
        });
      });
      this.selectSnap.addEventListener("change", (e) => {
        this.project.snap = e.target.value;
        this.project.notify("snap_changed", { snap: this.project.snap });
      });
      this.sliderMasterVol.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        this.project.masterVolume = val;
        if (this.engine.masterEffects) {
          this.engine.masterEffects.setGain(val);
        }
      });
      this.sliderMasterVol.addEventListener("dblclick", () => {
        this.sliderMasterVol.value = 1;
        this.project.masterVolume = 1;
        if (this.engine.masterEffects) {
          this.engine.masterEffects.setGain(1);
        }
      });
    }
    _setupEngineListeners() {
      this.engine.onStateChange = ({ isPlaying, isRecording }) => {
        if (this.btnPlay) {
          const icon = this.btnPlay.querySelector(".play-icon");
          if (icon) icon.textContent = isPlaying ? "\u23F8" : "\u25B6";
          this.btnPlay.classList.toggle("playing", isPlaying);
        }
        if (this.btnRecord) {
          this.btnRecord.classList.toggle("active", isRecording);
        }
      };
      this.engine.onPlayheadUpdate = (seconds, beats) => {
        this._updateTimeDisplay(seconds, beats);
      };
      this.engine.onMasterLevelUpdate = (levels) => {
        if (this.masterMeterL && this.masterMeterR) {
          const pct = Math.min(100, Math.round(levels.peak * 100));
          this.masterMeterL.style.height = `${pct}%`;
          this.masterMeterR.style.height = `${pct}%`;
          if (levels.clipping) {
            this.masterMeterL.classList.add("clipping");
            this.masterMeterR.classList.add("clipping");
          } else {
            this.masterMeterL.classList.remove("clipping");
            this.masterMeterR.classList.remove("clipping");
          }
        }
      };
    }
    _updateTimeDisplay(seconds, beats) {
      if (!this.timePrimary || !this.timeSecondary) return;
      const bar = Math.floor(beats / 4) + 1;
      const beatInBar = Math.floor(beats % 4) + 1;
      const sixteenth = Math.floor(beats % 1 * 4) + 1;
      const barStr = `${String(bar).padStart(3, "0")}.${String(beatInBar).padStart(2, "0")}.${String(sixteenth).padStart(2, "0")}`;
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      const ms = Math.floor(seconds % 1 * 1e3);
      const timeStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
      if (this.timeDisplayMode === "bars") {
        this.timePrimary.textContent = barStr;
        this.timeSecondary.textContent = timeStr;
      } else {
        this.timePrimary.textContent = timeStr;
        this.timeSecondary.textContent = barStr;
      }
    }
    updateUI() {
      if (this.projectNameInput) this.projectNameInput.value = this.project.name;
      if (this.inputBPM) this.inputBPM.value = this.project.bpm;
      if (this.btnLoop) this.btnLoop.classList.toggle("active", this.project.loop.enabled);
      if (this.selectSnap) this.selectSnap.value = this.project.snap;
      if (this.sliderMasterVol) this.sliderMasterVol.value = this.project.masterVolume;
    }
  };

  // js/utils/WaveformRenderer.js
  var WaveformRenderer = class {
    static _peaksCache = /* @__PURE__ */ new WeakMap();
    /**
     * Extracts peak min/max data from an AudioBuffer
     * @param {AudioBuffer} buffer 
     * @param {number} numBins 
     * @returns {Float32Array}
     */
    static getPeaks(buffer, numBins = 800) {
      if (this._peaksCache.has(buffer)) {
        const cached = this._peaksCache.get(buffer);
        if (cached.length === numBins * 2) return cached;
      }
      const channelData = buffer.getChannelData(0);
      const totalSamples = channelData.length;
      const step = Math.max(1, Math.floor(totalSamples / numBins));
      const peaks = new Float32Array(numBins * 2);
      for (let i = 0; i < numBins; i++) {
        const start = i * step;
        const end = Math.min(start + step, totalSamples);
        let min = 1;
        let max = -1;
        for (let j = start; j < end; j++) {
          const val = channelData[j];
          if (val < min) min = val;
          if (val > max) max = val;
        }
        peaks[i * 2] = min;
        peaks[i * 2 + 1] = max;
      }
      this._peaksCache.set(buffer, peaks);
      return peaks;
    }
    /**
     * Renders waveform onto a 2D canvas context
     * @param {HTMLCanvasElement} canvas 
     * @param {AudioBuffer} buffer 
     * @param {Object} options { color, offsetSec, durationSec, totalDurationSec }
     */
    static render(canvas, buffer, options = {}) {
      if (!canvas || !buffer) return;
      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth || 300;
      const height = canvas.clientHeight || 80;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);
      const color = options.color || "#3b82f6";
      const numBins = Math.min(Math.floor(width), 1e3);
      const peaks = this.getPeaks(buffer, numBins);
      const centerY = height / 2;
      const halfHeight = height / 2 * 0.88;
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, color);
      grad.addColorStop(0.5, "#ffffff");
      grad.addColorStop(1, color);
      ctx.fillStyle = grad;
      ctx.beginPath();
      for (let x = 0; x < numBins; x++) {
        const max = peaks[x * 2 + 1];
        const y = centerY - max * halfHeight;
        const canvasX = x / numBins * width;
        if (x === 0) ctx.moveTo(canvasX, y);
        else ctx.lineTo(canvasX, y);
      }
      for (let x = numBins - 1; x >= 0; x--) {
        const min = peaks[x * 2];
        const y = centerY - min * halfHeight;
        const canvasX = x / numBins * width;
        ctx.lineTo(canvasX, y);
      }
      ctx.closePath();
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.restore();
    }
  };

  // js/ui/TimelineView.js
  var TimelineView = class {
    /**
     * @param {HTMLElement} container 
     * @param {AudioEngine} audioEngine 
     * @param {Project} project 
     * @param {Object} actions 
     */
    constructor(container, audioEngine, project, actions = {}) {
      this.container = container;
      this.engine = audioEngine;
      this.project = project;
      this.actions = actions;
      this.scrollLeft = 0;
      this.scrollTop = 0;
      this.totalBars = 64;
      this._dragState = null;
      this._selectionBox = null;
      this._contextMenuEl = null;
      this.paletteColors = [
        "#3b82f6",
        "#06b6d4",
        "#10b981",
        "#84cc16",
        "#eab308",
        "#f97316",
        "#ef4444",
        "#ec4899",
        "#a855f7",
        "#6366f1",
        "#64748b",
        "#14b8a6"
      ];
      this._render();
      this._bindEvents();
      this._startPlayheadAnimation();
    }
    _render() {
      this.container.innerHTML = `
            <div class="timeline-container">
                <!-- Top Toolbar: Zoom & View controls -->
                <div class="timeline-topbar">
                    <div class="timeline-tracklist-header">
                        <span class="header-title">TRACKS</span>
                        <div class="tracklist-actions">
                            <button class="btn-add-track" id="btnAddTrack" title="Add Track">+ Track \u25BE</button>
                            <div class="add-track-menu" id="addTrackMenu">
                                <div class="menu-item" data-type="audio">\u{1F3B5} Audio Track</div>
                                <div class="menu-item" data-type="synth">\u{1F3B9} Synth Track</div>
                                <div class="menu-item" data-type="drum">\u{1F941} Drum Machine</div>
                            </div>
                        </div>
                    </div>
                    <div class="timeline-ruler-wrapper" id="rulerWrapper">
                        <canvas class="timeline-ruler-canvas" id="rulerCanvas"></canvas>
                        <div class="loop-region-marker" id="loopRegionMarker">
                            <div class="loop-handle loop-handle-start" title="Drag to resize loop start"></div>
                            <div class="loop-bar-body" title="Drag loop region"></div>
                            <div class="loop-handle loop-handle-end" title="Drag to resize loop end"></div>
                        </div>
                    </div>
                    <div class="timeline-zoom-controls">
                        <button class="zoom-btn" id="btnZoomOut" title="Zoom Out (-)">\u2212</button>
                        <input type="range" id="zoomSlider" min="15" max="150" value="${this.project.zoom.pixelsPerBeat}" />
                        <button class="zoom-btn" id="btnZoomIn" title="Zoom In (+)">+</button>
                    </div>
                </div>

                <!-- Main Body: Split between Left Track Headers and Right Clip Arrangement -->
                <div class="timeline-body" id="timelineBody">
                    <!-- Left: Track Headers Column -->
                    <div class="track-headers-list" id="trackHeadersList"></div>

                    <!-- Right: Arrangement Tracks Grid Scrollable Area -->
                    <div class="tracks-arrangement-viewport" id="arrangementViewport">
                        <div class="tracks-arrangement-content" id="arrangementContent">
                            <!-- Background Grid Lines Canvas -->
                            <canvas class="timeline-grid-canvas" id="gridCanvas"></canvas>
                            
                            <!-- Track Lanes for Clips -->
                            <div class="track-lanes-container" id="trackLanesContainer"></div>

                            <!-- Playhead Vertical Line -->
                            <div class="timeline-playhead" id="timelinePlayhead">
                                <div class="playhead-head"></div>
                                <div class="playhead-line"></div>
                            </div>

                            <!-- Selection Box Rect -->
                            <div class="timeline-marquee-box" id="marqueeBox"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
      this.trackHeadersList = this.container.querySelector("#trackHeadersList");
      this.trackLanesContainer = this.container.querySelector("#trackLanesContainer");
      this.arrangementViewport = this.container.querySelector("#arrangementViewport");
      this.arrangementContent = this.container.querySelector("#arrangementContent");
      this.rulerCanvas = this.container.querySelector("#rulerCanvas");
      this.gridCanvas = this.container.querySelector("#gridCanvas");
      this.playheadEl = this.container.querySelector("#timelinePlayhead");
      this.loopRegionMarker = this.container.querySelector("#loopRegionMarker");
      this.marqueeBox = this.container.querySelector("#marqueeBox");
      this.zoomSlider = this.container.querySelector("#zoomSlider");
      this.addTrackMenu = this.container.querySelector("#addTrackMenu");
      this.renderTracks();
      this.drawRuler();
      this.drawGrid();
      this.updateLoopRegion();
    }
    _bindEvents() {
      this.zoomSlider.addEventListener("input", (e) => {
        this.setZoom(parseFloat(e.target.value));
      });
      this.container.querySelector("#btnZoomIn").addEventListener("click", () => {
        this.setZoom(this.project.zoom.pixelsPerBeat * 1.25);
      });
      this.container.querySelector("#btnZoomOut").addEventListener("click", () => {
        this.setZoom(this.project.zoom.pixelsPerBeat / 1.25);
      });
      this.arrangementViewport.addEventListener("wheel", (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const delta = e.deltaY < 0 ? 1.15 : 0.85;
          this.setZoom(this.project.zoom.pixelsPerBeat * delta);
        } else if (e.shiftKey) {
          this.arrangementViewport.scrollLeft += e.deltaY;
        }
      }, { passive: false });
      this.arrangementViewport.addEventListener("scroll", () => {
        this.scrollLeft = this.arrangementViewport.scrollLeft;
        this.scrollTop = this.arrangementViewport.scrollTop;
        this.trackHeadersList.scrollTop = this.scrollTop;
        this.drawRuler();
        this.updateLoopRegion();
      });
      const btnAddTrack = this.container.querySelector("#btnAddTrack");
      btnAddTrack.addEventListener("click", (e) => {
        e.stopPropagation();
        this.addTrackMenu.classList.toggle("open");
      });
      this.addTrackMenu.querySelectorAll(".menu-item").forEach((item) => {
        item.addEventListener("click", (e) => {
          const type = e.currentTarget.getAttribute("data-type");
          const newTrack = this.project.addTrack(type);
          this.engine.registerTrack(newTrack);
          this.addTrackMenu.classList.remove("open");
        });
      });
      document.addEventListener("click", () => {
        this.addTrackMenu.classList.remove("open");
        this._closeContextMenu();
      });
      this._bindRulerEvents();
      this._bindLoopHandleEvents();
      this._bindArrangementEvents();
      this._bindTimelineDropEvents();
      window.addEventListener("keydown", (e) => {
        if (["input", "textarea"].includes(document.activeElement.tagName.toLowerCase())) return;
        if (e.key === "Delete" || e.key === "Backspace") {
          this.project.deleteSelectedClips();
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
          e.preventDefault();
          this.project.duplicateSelectedClips();
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
          e.preventDefault();
          this.selectAllClips();
        } else if (e.key.toLowerCase() === "s" || (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "e") {
          const playheadBeat = this.engine.secondsToBeats(this.engine.playheadPosition);
          this.project.selectedClipIds.forEach((id) => {
            this.project.splitClipAtBeat(id, playheadBeat);
          });
        }
      });
    }
    setZoom(pixelsPerBeat) {
      const clamped = Math.max(this.project.zoom.minZoom, Math.min(this.project.zoom.maxZoom, pixelsPerBeat));
      this.project.zoom.pixelsPerBeat = clamped;
      this.zoomSlider.value = clamped;
      this._updateArrangementDimensions();
      this.drawRuler();
      this.drawGrid();
      this.renderClips();
      this.updateLoopRegion();
    }
    _updateArrangementDimensions() {
      const totalBeats = this.totalBars * 4;
      const totalWidth = totalBeats * this.project.zoom.pixelsPerBeat + 400;
      this.arrangementContent.style.width = `${totalWidth}px`;
    }
    // -------------------------------------------------------------
    // RULER & LOOP BRACKET
    // -------------------------------------------------------------
    _bindRulerEvents() {
      let isSeeking = false;
      const rulerWrapper = this.container.querySelector("#rulerWrapper");
      const getBeatFromX = (clientX) => {
        const rect = this.rulerCanvas.getBoundingClientRect();
        const x = clientX - rect.left + this.scrollLeft;
        const ppb = this.project.zoom.pixelsPerBeat;
        const rawBeat = x / ppb;
        return this.project.snapBeat(rawBeat);
      };
      rulerWrapper.addEventListener("mousedown", (e) => {
        if (e.target.closest(".loop-handle") || e.target.closest(".loop-bar-body")) return;
        isSeeking = true;
        const beat = getBeatFromX(e.clientX);
        const sec = this.engine.beatsToSeconds(beat);
        this.engine.seek(sec, this.project);
        const onMouseMove = (ev) => {
          if (!isSeeking) return;
          const b = getBeatFromX(ev.clientX);
          this.engine.seek(this.engine.beatsToSeconds(b), this.project);
        };
        const onMouseUp = () => {
          isSeeking = false;
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      });
    }
    _bindLoopHandleEvents() {
      let isDraggingLoop = false;
      let dragMode = null;
      let startX = 0;
      let origStartBeat = 0;
      let origEndBeat = 0;
      const loopStartHandle = this.container.querySelector(".loop-handle-start");
      const loopEndHandle = this.container.querySelector(".loop-handle-end");
      const loopBody = this.container.querySelector(".loop-bar-body");
      const onMouseDown = (e, mode) => {
        e.stopPropagation();
        isDraggingLoop = true;
        dragMode = mode;
        startX = e.clientX;
        origStartBeat = this.project.loop.startBeat;
        origEndBeat = this.project.loop.endBeat;
        const onMouseMove = (ev) => {
          if (!isDraggingLoop) return;
          const deltaX = ev.clientX - startX;
          const deltaBeat = deltaX / this.project.zoom.pixelsPerBeat;
          if (dragMode === "start") {
            const newStart = Math.min(origEndBeat - 0.25, Math.max(0, this.project.snapBeat(origStartBeat + deltaBeat)));
            this.project.loop.startBeat = newStart;
          } else if (dragMode === "end") {
            const newEnd = Math.max(origStartBeat + 0.25, this.project.snapBeat(origEndBeat + deltaBeat));
            this.project.loop.endBeat = newEnd;
          } else if (dragMode === "body") {
            const dur = origEndBeat - origStartBeat;
            const newStart = Math.max(0, this.project.snapBeat(origStartBeat + deltaBeat));
            this.project.loop.startBeat = newStart;
            this.project.loop.endBeat = newStart + dur;
          }
          this.engine.setLoop(this.project.loop.enabled, this.project.loop.startBeat, this.project.loop.endBeat);
          this.updateLoopRegion();
        };
        const onMouseUp = () => {
          if (!isDraggingLoop) return;
          isDraggingLoop = false;
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
          this.project.notify("loop_changed");
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      };
      loopStartHandle.addEventListener("mousedown", (e) => onMouseDown(e, "start"));
      loopEndHandle.addEventListener("mousedown", (e) => onMouseDown(e, "end"));
      loopBody.addEventListener("mousedown", (e) => onMouseDown(e, "body"));
    }
    updateLoopRegion() {
      if (!this.loopRegionMarker) return;
      const ppb = this.project.zoom.pixelsPerBeat;
      const left = this.project.loop.startBeat * ppb - this.scrollLeft;
      const width = (this.project.loop.endBeat - this.project.loop.startBeat) * ppb;
      this.loopRegionMarker.style.left = `${left}px`;
      this.loopRegionMarker.style.width = `${Math.max(4, width)}px`;
      this.loopRegionMarker.style.display = this.project.loop.enabled ? "flex" : "none";
    }
    drawRuler() {
      const canvas = this.rulerCanvas;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const width = (canvas.parentElement ? canvas.parentElement.clientWidth : 0) || canvas.clientWidth || 800;
      const height = 30;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);
      const ppb = this.project.zoom.pixelsPerBeat;
      const beatsPerBar = this.project.timeSignature[0] || 4;
      const startBeat = Math.floor(this.scrollLeft / ppb);
      const visibleBeats = Math.ceil(width / ppb) + 2;
      ctx.fillStyle = "#1e222d";
      ctx.fillRect(0, 0, width, height);
      ctx.font = "10px Inter, -apple-system, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      for (let b = startBeat; b <= startBeat + visibleBeats; b++) {
        const x = b * ppb - this.scrollLeft;
        const isBar = b % beatsPerBar === 0;
        if (isBar) {
          const barNum = Math.floor(b / beatsPerBar) + 1;
          ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, 12);
          ctx.lineTo(x, height);
          ctx.stroke();
          ctx.fillStyle = "#cbd5e1";
          ctx.fillText(`${barNum}`, x + 4, 10);
        } else {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, 20);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
      }
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height - 0.5);
      ctx.lineTo(width, height - 0.5);
      ctx.stroke();
      ctx.restore();
    }
    drawGrid() {
      const canvas = this.gridCanvas;
      if (!canvas) return;
      const totalWidth = (this.arrangementContent ? this.arrangementContent.clientWidth : 0) || 2e3;
      const totalHeight = (this.arrangementContent ? this.arrangementContent.clientHeight : 0) || 600;
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== totalWidth * dpr || canvas.height !== totalHeight * dpr) {
        canvas.width = totalWidth * dpr;
        canvas.height = totalHeight * dpr;
      }
      const ctx = canvas.getContext("2d");
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, totalWidth, totalHeight);
      const ppb = this.project.zoom.pixelsPerBeat;
      const beatsPerBar = this.project.timeSignature[0] || 4;
      const totalBeats = Math.ceil(totalWidth / ppb);
      for (let b = 0; b <= totalBeats; b++) {
        const x = b * ppb;
        const isBar = b % beatsPerBar === 0;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, totalHeight);
        if (isBar) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
          ctx.lineWidth = 1;
        } else {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      }
      ctx.restore();
    }
    // -------------------------------------------------------------
    // TRACK HEADERS & LANES RENDERING
    // -------------------------------------------------------------
    renderTracks() {
      this.trackHeadersList.innerHTML = "";
      this.trackLanesContainer.innerHTML = "";
      this.project.tracks.forEach((track, idx) => {
        const header = document.createElement("div");
        header.className = `track-header ${track.id === this.project.activeTrackId ? "active" : ""}`;
        header.style.height = `${track.height}px`;
        header.dataset.trackId = track.id;
        const typeIcons = {
          audio: "\u{1F3B5}",
          synth: "\u{1F3B9}",
          drum: "\u{1F941}",
          automation: "\u{1F4C8}"
        };
        header.innerHTML = `
                <div class="track-color-strip" style="background-color: ${track.color};" title="Click to change color"></div>
                <div class="track-header-main">
                    <div class="track-title-row">
                        <span class="track-icon">${typeIcons[track.type] || "\u{1F3B5}"}</span>
                        <input type="text" class="track-name-input" value="${track.name}" title="Edit track name" />
                        <div class="track-header-btns">
                            <button class="track-btn-dup" title="Duplicate Track">\u2398</button>
                            <button class="track-btn-del" title="Delete Track">\u2715</button>
                        </div>
                    </div>
                    <div class="track-controls-row">
                        <button class="track-btn-toggle btn-mute ${track.mute ? "active" : ""}" title="Mute (M)">M</button>
                        <button class="track-btn-toggle btn-solo ${track.solo ? "active" : ""}" title="Solo (S)">S</button>
                        <button class="track-btn-toggle btn-arm ${track.arm ? "active" : ""}" title="Record Arm (R)">R</button>
                    </div>
                    <div class="track-faders-row">
                        <div class="small-fader-box">
                            <span class="fader-lbl">VOL</span>
                            <input type="range" class="track-vol-slider" min="0" max="1.5" step="0.02" value="${track.volume}" />
                        </div>
                        <div class="small-fader-box">
                            <span class="fader-lbl">PAN</span>
                            <input type="range" class="track-pan-slider" min="-1" max="1" step="0.05" value="${track.pan}" />
                        </div>
                    </div>
                </div>
            `;
        const colorStrip = header.querySelector(".track-color-strip");
        colorStrip.addEventListener("click", (e) => {
          e.stopPropagation();
          this._showColorPicker(e.clientX, e.clientY, (color) => {
            track.color = color;
            track.clips.forEach((c) => c.color = color);
            this.renderTracks();
            this.project.notify("track_state_changed");
          });
        });
        header.addEventListener("click", () => {
          this.project.activeTrackId = track.id;
          this.container.querySelectorAll(".track-header").forEach((h) => h.classList.remove("active"));
          header.classList.add("active");
          this.project.notify("active_track_changed", { trackId: track.id });
        });
        header.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          this._showTrackContextMenu(e.clientX, e.clientY, track);
        });
        const nameInput = header.querySelector(".track-name-input");
        nameInput.addEventListener("change", (e) => {
          track.name = e.target.value || "Track";
          this.project.notify("track_renamed", { track });
        });
        header.querySelector(".btn-mute").addEventListener("click", (e) => {
          e.stopPropagation();
          track.mute = !track.mute;
          header.querySelector(".btn-mute").classList.toggle("active", track.mute);
          this.engine.updateSoloMuteStates();
          this.project.notify("track_state_changed");
        });
        header.querySelector(".btn-solo").addEventListener("click", (e) => {
          e.stopPropagation();
          track.solo = !track.solo;
          header.querySelector(".btn-solo").classList.toggle("active", track.solo);
          this.engine.updateSoloMuteStates();
          this.project.notify("track_state_changed");
        });
        header.querySelector(".btn-arm").addEventListener("click", (e) => {
          e.stopPropagation();
          track.arm = !track.arm;
          header.querySelector(".btn-arm").classList.toggle("active", track.arm);
        });
        header.querySelector(".track-vol-slider").addEventListener("input", (e) => {
          const val = parseFloat(e.target.value);
          track.volume = val;
          const eng = this.engine.trackEngines.get(track.id);
          if (eng) eng.effects.setGain(val);
        });
        header.querySelector(".track-pan-slider").addEventListener("input", (e) => {
          const val = parseFloat(e.target.value);
          track.pan = val;
          const eng = this.engine.trackEngines.get(track.id);
          if (eng) eng.effects.setPan(val);
        });
        header.querySelector(".track-btn-dup").addEventListener("click", (e) => {
          e.stopPropagation();
          const dup = this.project.duplicateTrack(track.id);
          if (dup) this.engine.registerTrack(dup);
        });
        header.querySelector(".track-btn-del").addEventListener("click", (e) => {
          e.stopPropagation();
          this.project.removeTrack(track.id);
          this.engine.unregisterTrack(track.id);
        });
        this.trackHeadersList.appendChild(header);
        const lane = document.createElement("div");
        lane.className = `track-lane ${track.id === this.project.activeTrackId ? "active" : ""}`;
        lane.style.height = `${track.height}px`;
        lane.dataset.trackId = track.id;
        lane.addEventListener("contextmenu", (e) => {
          if (e.target.closest(".timeline-clip")) return;
          e.preventDefault();
          this._showLaneContextMenu(e.clientX, e.clientY, track, e);
        });
        this.trackLanesContainer.appendChild(lane);
      });
      this._updateArrangementDimensions();
      this.renderClips();
      this.drawGrid();
    }
    // -------------------------------------------------------------
    // CLIP RENDERING & INTERACTION
    // -------------------------------------------------------------
    renderClips() {
      const ppb = this.project.zoom.pixelsPerBeat;
      this.project.tracks.forEach((track) => {
        const lane = this.trackLanesContainer.querySelector(`.track-lane[data-track-id="${track.id}"]`);
        if (!lane) return;
        lane.innerHTML = "";
        track.clips.forEach((clip) => {
          const clipEl = document.createElement("div");
          clipEl.className = `timeline-clip clip-${clip.type} ${this.project.selectedClipIds.has(clip.id) ? "selected" : ""}`;
          clipEl.dataset.clipId = clip.id;
          clipEl.dataset.trackId = track.id;
          const left = clip.startBeat * ppb;
          const width = Math.max(12, clip.durationBeats * ppb);
          clipEl.style.left = `${left}px`;
          clipEl.style.width = `${width}px`;
          clipEl.style.borderTopColor = clip.color;
          clipEl.innerHTML = `
                    <div class="clip-header" style="background-color: ${clip.color};">
                        <span class="clip-title">${clip.name}</span>
                    </div>
                    <div class="clip-content">
                        <canvas class="clip-canvas"></canvas>
                    </div>
                    <div class="clip-resize-handle handle-left" title="Trim start"></div>
                    <div class="clip-resize-handle handle-right" title="Trim end"></div>
                `;
          const canvas = clipEl.querySelector(".clip-canvas");
          setTimeout(() => {
            if (clip.type === "audio" && clip.audioBuffer) {
              WaveformRenderer.render(canvas, clip.audioBuffer, { color: clip.color });
            } else if (clip.type === "synth" && clip.notes) {
              this._renderMidiPreview(canvas, clip.notes, clip.durationBeats, clip.color);
            } else if (clip.type === "drum" && clip.pattern) {
              this._renderDrumPreview(canvas, clip.pattern, clip.color);
            }
          }, 0);
          clipEl.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this._showClipContextMenu(e.clientX, e.clientY, clip, track);
          });
          lane.appendChild(clipEl);
        });
      });
    }
    _renderMidiPreview(canvas, notes, durationBeats, color) {
      if (!canvas || !notes) return;
      const ctx = canvas.getContext("2d");
      const w = canvas.clientWidth || 100;
      const h = canvas.clientHeight || 50;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      if (notes.length === 0) return;
      let minPitch = 127, maxPitch = 0;
      notes.forEach((n) => {
        if (n.pitch < minPitch) minPitch = n.pitch;
        if (n.pitch > maxPitch) maxPitch = n.pitch;
      });
      const pitchRange = Math.max(12, maxPitch - minPitch + 2);
      ctx.fillStyle = color;
      notes.forEach((n) => {
        const x = n.startBeat / durationBeats * w;
        const nw = Math.max(2, n.durationBeats / durationBeats * w);
        const normY = 1 - (n.pitch - minPitch + 1) / pitchRange;
        const y = normY * (h - 6) + 2;
        ctx.fillRect(x, y, nw - 1, 3);
      });
    }
    _renderDrumPreview(canvas, pattern, color) {
      if (!canvas || !pattern || !pattern.tracks) return;
      const ctx = canvas.getContext("2d");
      const w = canvas.clientWidth || 100;
      const h = canvas.clientHeight || 50;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      const steps = pattern.steps || 16;
      const numRows = pattern.tracks.length || 8;
      const rowH = h / numRows;
      ctx.fillStyle = color;
      pattern.tracks.forEach((row, rIdx) => {
        row.steps.forEach((sVal, sIdx) => {
          if (sVal > 0) {
            const x = sIdx / steps * w;
            const sw = Math.max(2, w / steps - 1);
            ctx.fillRect(x, rIdx * rowH + 1, sw, rowH - 2);
          }
        });
      });
    }
    // -------------------------------------------------------------
    // ARRANGEMENT MOUSE INTERACTIONS
    // -------------------------------------------------------------
    _bindArrangementEvents() {
      const viewport = this.arrangementViewport;
      viewport.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        const clipEl = e.target.closest(".timeline-clip");
        const resizeHandle = e.target.closest(".clip-resize-handle");
        if (this.project.activeTool === "scissors" && clipEl) {
          const clipId = clipEl.dataset.clipId;
          const rect = clipEl.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ppb = this.project.zoom.pixelsPerBeat;
          const { clip } = this.project.findClip(clipId);
          if (clip) {
            const splitBeat = this.project.snapBeat(clip.startBeat + clickX / ppb);
            this.project.splitClipAtBeat(clipId, splitBeat);
          }
          return;
        }
        if (this.project.activeTool === "eraser" && clipEl) {
          const clipId = clipEl.dataset.clipId;
          this.project.selectedClipIds.clear();
          this.project.selectedClipIds.add(clipId);
          this.project.deleteSelectedClips();
          return;
        }
        if (resizeHandle && clipEl) {
          e.stopPropagation();
          const clipId = clipEl.dataset.clipId;
          const isLeftHandle = resizeHandle.classList.contains("handle-left");
          this._startClipResize(e, clipId, isLeftHandle);
          return;
        }
        if (clipEl) {
          e.stopPropagation();
          const clipId = clipEl.dataset.clipId;
          if (!e.shiftKey && !this.project.selectedClipIds.has(clipId)) {
            this.project.selectedClipIds.clear();
          }
          this.project.selectedClipIds.add(clipId);
          this.project.activeClipId = clipId;
          this.renderClips();
          if (e.detail === 2) {
            const { clip, track } = this.project.findClip(clipId);
            if (clip && track) {
              if (track.type === "synth") {
                this.project.activeBottomTab = "pianoroll";
              } else if (track.type === "drum") {
                this.project.activeBottomTab = "drumsequencer";
              } else {
                this.project.activeBottomTab = "inspector";
              }
              this.project.notify("bottom_tab_changed", { tab: this.project.activeBottomTab, clipId: clip.id });
            }
            return;
          }
          this._startClipDrag(e, clipId);
          return;
        }
        if (!clipEl) {
          if (!e.shiftKey) {
            this.project.selectedClipIds.clear();
            this.renderClips();
          }
          this._startMarqueeSelection(e);
        }
      });
    }
    _startClipDrag(e, primaryClipId) {
      this.project.history.pushState("Move Clip");
      const startX = e.clientX;
      const ppb = this.project.zoom.pixelsPerBeat;
      const clipsInitial = [];
      this.project.selectedClipIds.forEach((id) => {
        const { clip, track } = this.project.findClip(id);
        if (clip) {
          clipsInitial.push({
            clip,
            trackId: track.id,
            startBeat: clip.startBeat
          });
        }
      });
      const onMouseMove = (ev) => {
        const deltaX = ev.clientX - startX;
        const deltaBeat = deltaX / ppb;
        clipsInitial.forEach(({ clip, startBeat }) => {
          const targetBeat = Math.max(0, this.project.snapBeat(startBeat + deltaBeat));
          clip.startBeat = targetBeat;
        });
        this.renderClips();
      };
      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        this.project.notify("clips_moved");
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    _startClipResize(e, clipId, isLeft) {
      this.project.history.pushState("Resize Clip");
      const { clip } = this.project.findClip(clipId);
      if (!clip) return;
      const startX = e.clientX;
      const origStartBeat = clip.startBeat;
      const origDuration = clip.durationBeats;
      const ppb = this.project.zoom.pixelsPerBeat;
      const onMouseMove = (ev) => {
        const deltaX = ev.clientX - startX;
        const deltaBeat = deltaX / ppb;
        if (isLeft) {
          const newStart = Math.max(0, this.project.snapBeat(origStartBeat + deltaBeat));
          const newDur = origDuration - (newStart - origStartBeat);
          if (newDur >= 0.25) {
            clip.startBeat = newStart;
            clip.durationBeats = newDur;
          }
        } else {
          const newDur = Math.max(0.25, this.project.snapBeat(origDuration + deltaBeat));
          clip.durationBeats = newDur;
        }
        this.renderClips();
      };
      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        this.project.notify("clip_resized");
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    _startMarqueeSelection(e) {
      const rect = this.arrangementViewport.getBoundingClientRect();
      const startX = e.clientX - rect.left + this.scrollLeft;
      const startY = e.clientY - rect.top + this.scrollTop;
      this.marqueeBox.style.display = "block";
      this.marqueeBox.style.left = `${startX}px`;
      this.marqueeBox.style.top = `${startY}px`;
      this.marqueeBox.style.width = "0px";
      this.marqueeBox.style.height = "0px";
      const onMouseMove = (ev) => {
        const currentX = ev.clientX - rect.left + this.scrollLeft;
        const currentY = ev.clientY - rect.top + this.scrollTop;
        const boxLeft = Math.min(startX, currentX);
        const boxTop = Math.min(startY, currentY);
        const boxWidth = Math.abs(currentX - startX);
        const boxHeight = Math.abs(currentY - startY);
        this.marqueeBox.style.left = `${boxLeft}px`;
        this.marqueeBox.style.top = `${boxTop}px`;
        this.marqueeBox.style.width = `${boxWidth}px`;
        this.marqueeBox.style.height = `${boxHeight}px`;
        const ppb = this.project.zoom.pixelsPerBeat;
        const boxStartBeat = boxLeft / ppb;
        const boxEndBeat = (boxLeft + boxWidth) / ppb;
        let currentTrackTop = 0;
        this.project.tracks.forEach((tr) => {
          const trackBottom = currentTrackTop + tr.height;
          if (boxTop + boxHeight >= currentTrackTop && boxTop <= trackBottom) {
            tr.clips.forEach((c) => {
              const clipEnd = c.startBeat + c.durationBeats;
              if (clipEnd >= boxStartBeat && c.startBeat <= boxEndBeat) {
                this.project.selectedClipIds.add(c.id);
              }
            });
          }
          currentTrackTop = trackBottom;
        });
        this.renderClips();
      };
      const onMouseUp = () => {
        this.marqueeBox.style.display = "none";
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    selectAllClips() {
      this.project.selectedClipIds.clear();
      this.project.tracks.forEach((tr) => {
        tr.clips.forEach((c) => this.project.selectedClipIds.add(c.id));
      });
      this.renderClips();
    }
    // -------------------------------------------------------------
    // CONTEXT MENUS & COLOR PICKER
    // -------------------------------------------------------------
    _showClipContextMenu(x, y, clip, track) {
      this._closeContextMenu();
      const menu = document.createElement("div");
      menu.className = "daw-context-menu";
      menu.style.left = `${Math.min(window.innerWidth - 180, x)}px`;
      menu.style.top = `${Math.min(window.innerHeight - 200, y)}px`;
      menu.innerHTML = `
            <div class="ctx-item" data-action="dup">\u2398 Duplicate (Ctrl+D)</div>
            <div class="ctx-item" data-action="split">\u2702 Split at Playhead (S)</div>
            <div class="ctx-item" data-action="loop">\u{1F501} Set Loop to Clip</div>
            <div class="ctx-divider"></div>
            <div class="ctx-item" data-action="rename">\u270F Rename Clip</div>
            <div class="ctx-item" data-action="color">\u{1F3A8} Change Color</div>
            <div class="ctx-divider"></div>
            <div class="ctx-item ctx-danger" data-action="del">\u{1F5D1}\uFE0F Delete Clip (Del)</div>
        `;
      menu.querySelectorAll(".ctx-item").forEach((item) => {
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          const action = item.dataset.action;
          this._closeContextMenu();
          if (action === "dup") {
            track.duplicateClip(clip.id);
            this.renderClips();
          } else if (action === "split") {
            const playheadBeat = this.engine.secondsToBeats(this.engine.playheadPosition);
            this.project.splitClipAtBeat(clip.id, playheadBeat);
          } else if (action === "loop") {
            this.project.loop.startBeat = clip.startBeat;
            this.project.loop.endBeat = clip.startBeat + clip.durationBeats;
            this.engine.setLoop(true, this.project.loop.startBeat, this.project.loop.endBeat);
            this.updateLoopRegion();
          } else if (action === "rename") {
            const newName = prompt("Enter new clip name:", clip.name);
            if (newName) {
              clip.name = newName;
              this.renderClips();
            }
          } else if (action === "color") {
            this._showColorPicker(x, y, (color) => {
              clip.color = color;
              this.renderClips();
            });
          } else if (action === "del") {
            track.removeClip(clip.id);
            this.project.selectedClipIds.delete(clip.id);
            this.renderClips();
          }
        });
      });
      document.body.appendChild(menu);
      this._contextMenuEl = menu;
    }
    _showTrackContextMenu(x, y, track) {
      this._closeContextMenu();
      const menu = document.createElement("div");
      menu.className = "daw-context-menu";
      menu.style.left = `${Math.min(window.innerWidth - 180, x)}px`;
      menu.style.top = `${Math.min(window.innerHeight - 200, y)}px`;
      menu.innerHTML = `
            <div class="ctx-item" data-action="dup">\u2398 Duplicate Track</div>
            <div class="ctx-item" data-action="color">\u{1F3A8} Track Color</div>
            <div class="ctx-divider"></div>
            <div class="ctx-item ctx-danger" data-action="del">\u{1F5D1}\uFE0F Delete Track</div>
        `;
      menu.querySelectorAll(".ctx-item").forEach((item) => {
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          const action = item.dataset.action;
          this._closeContextMenu();
          if (action === "dup") {
            const dup = this.project.duplicateTrack(track.id);
            if (dup) this.engine.registerTrack(dup);
          } else if (action === "color") {
            this._showColorPicker(x, y, (color) => {
              track.color = color;
              track.clips.forEach((c) => c.color = color);
              this.renderTracks();
            });
          } else if (action === "del") {
            this.project.removeTrack(track.id);
            this.engine.unregisterTrack(track.id);
          }
        });
      });
      document.body.appendChild(menu);
      this._contextMenuEl = menu;
    }
    _showLaneContextMenu(x, y, track, origEvent) {
      this._closeContextMenu();
      const rect = this.arrangementViewport.getBoundingClientRect();
      const clickX = origEvent.clientX - rect.left + this.scrollLeft;
      const clickBeat = this.project.snapBeat(clickX / this.project.zoom.pixelsPerBeat);
      const menu = document.createElement("div");
      menu.className = "daw-context-menu";
      menu.style.left = `${Math.min(window.innerWidth - 180, x)}px`;
      menu.style.top = `${Math.min(window.innerHeight - 200, y)}px`;
      let actionHtml = "";
      if (track.type === "synth") {
        actionHtml = `<div class="ctx-item" data-action="add_synth">\u{1F3B9} Insert 4-Bar MIDI Clip</div>`;
      } else if (track.type === "drum") {
        actionHtml = `<div class="ctx-item" data-action="add_drum">\u{1F941} Insert 4-Bar Drum Pattern</div>`;
      } else {
        actionHtml = `<div class="ctx-item" data-action="add_audio">\u{1F3B5} Insert Audio Placeholder</div>`;
      }
      menu.innerHTML = `
            ${actionHtml}
            <div class="ctx-item" data-action="seek">\u25B6 Move Playhead Here</div>
        `;
      menu.querySelectorAll(".ctx-item").forEach((item) => {
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          const action = item.dataset.action;
          this._closeContextMenu();
          if (action === "add_synth") {
            track.addClip(new MidiClip({ name: "MIDI Pattern", startBeat: clickBeat, durationBeats: 8, color: track.color }));
            this.renderClips();
          } else if (action === "add_drum") {
            track.addClip(new PatternClip({ name: "Drum Pattern", startBeat: clickBeat, durationBeats: 8, color: track.color }));
            this.renderClips();
          } else if (action === "add_audio") {
            const synthBuf = this.engine.sampleLibrary["fx_vinyl"]?.buffer;
            track.addClip(new AudioClip({ name: "Audio Clip", startBeat: clickBeat, durationBeats: 8, audioBuffer: synthBuf, color: track.color }));
            this.renderClips();
          } else if (action === "seek") {
            this.engine.seek(this.engine.beatsToSeconds(clickBeat), this.project);
          }
        });
      });
      document.body.appendChild(menu);
      this._contextMenuEl = menu;
    }
    _showColorPicker(x, y, onSelect) {
      this._closeContextMenu();
      const picker = document.createElement("div");
      picker.className = "daw-color-picker";
      picker.style.left = `${Math.min(window.innerWidth - 160, x)}px`;
      picker.style.top = `${Math.min(window.innerHeight - 120, y)}px`;
      picker.innerHTML = this.paletteColors.map((c) => `
            <div class="color-swatch" style="background-color: ${c};" data-color="${c}"></div>
        `).join("");
      picker.querySelectorAll(".color-swatch").forEach((sw) => {
        sw.addEventListener("click", (e) => {
          e.stopPropagation();
          const color = sw.dataset.color;
          this._closeContextMenu();
          onSelect(color);
        });
      });
      document.body.appendChild(picker);
      this._contextMenuEl = picker;
    }
    _closeContextMenu() {
      if (this._contextMenuEl) {
        this._contextMenuEl.remove();
        this._contextMenuEl = null;
      }
    }
    // -------------------------------------------------------------
    // DRAG AND DROP HANDLING
    // -------------------------------------------------------------
    _bindTimelineDropEvents() {
      const viewport = this.arrangementViewport;
      viewport.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      });
      viewport.addEventListener("drop", async (e) => {
        e.preventDefault();
        const rawData = e.dataTransfer.getData("text/plain");
        if (!rawData) return;
        try {
          const data = JSON.parse(rawData);
          if (data.type === "sample" && data.sampleKey) {
            const rect = viewport.getBoundingClientRect();
            const dropX = e.clientX - rect.left + this.scrollLeft;
            const dropY = e.clientY - rect.top + this.scrollTop;
            const ppb = this.project.zoom.pixelsPerBeat;
            const dropBeat = this.project.snapBeat(dropX / ppb);
            let currentY = 0;
            let targetTrack = null;
            for (const tr of this.project.tracks) {
              if (dropY >= currentY && dropY <= currentY + tr.height) {
                targetTrack = tr;
                break;
              }
              currentY += tr.height;
            }
            if (!targetTrack || targetTrack.type !== "audio") {
              targetTrack = this.project.addTrack("audio", data.name);
              this.engine.registerTrack(targetTrack);
            }
            const sample = this.engine.sampleLibrary[data.sampleKey] || window.audiodeck?.browserView?.userSamples[data.sampleKey];
            const buf = sample?.buffer;
            const beatSec = 60 / this.project.bpm;
            const durBeats = buf ? Math.max(1, Math.round(buf.duration / beatSec * 4) / 4) : 4;
            const clip = targetTrack.addClip(new AudioClip({
              name: data.name,
              startBeat: dropBeat,
              durationBeats: durBeats,
              sampleKey: data.sampleKey,
              audioBuffer: buf,
              color: targetTrack.color
            }));
            this.renderClips();
            this.project.notify("clip_added", { track: targetTrack, clip });
          }
        } catch (err) {
        }
      });
    }
    // -------------------------------------------------------------
    // PLAYHEAD TRACKING
    // -------------------------------------------------------------
    _startPlayheadAnimation() {
      const updatePlayhead = () => {
        if (this.playheadEl) {
          const ppb = this.project.zoom.pixelsPerBeat;
          const currentBeats = this.engine.secondsToBeats(this.engine.playheadPosition);
          const x = currentBeats * ppb;
          this.playheadEl.style.transform = `translateX(${x}px)`;
          if (this.engine.isPlaying) {
            const viewportWidth = this.arrangementViewport.clientWidth;
            const viewLeft = this.arrangementViewport.scrollLeft;
            const viewRight = viewLeft + viewportWidth;
            if (x > viewRight - 80) {
              this.arrangementViewport.scrollLeft = x - 100;
            }
          }
        }
        requestAnimationFrame(updatePlayhead);
      };
      requestAnimationFrame(updatePlayhead);
    }
  };

  // js/ui/BrowserView.js
  var BrowserView = class {
    /**
     * @param {HTMLElement} container 
     * @param {AudioEngine} audioEngine 
     * @param {Project} project 
     */
    constructor(container, audioEngine, project) {
      this.container = container;
      this.engine = audioEngine;
      this.project = project;
      this.previewSource = null;
      this.previewingKey = null;
      this.userSamples = {};
      this._render();
      this._bindEvents();
    }
    _render() {
      this.container.innerHTML = `
            <div class="browser-sidebar">
                <!-- Browser Header -->
                <div class="browser-header">
                    <span class="browser-title">SAMPLE LIBRARY</span>
                    <button class="browser-collapse-btn" id="btnCollapseBrowser" title="Toggle Browser">\u25C0</button>
                </div>

                <!-- Import Zone Button -->
                <div class="browser-import-box">
                    <label class="btn-import-file" title="Import WAV/MP3/OGG file">
                        <span>\u{1F4E5} Import Audio</span>
                        <input type="file" id="inputAudioFile" accept="audio/*" style="display: none;" />
                    </label>
                </div>

                <!-- Search Filter -->
                <div class="browser-search-box">
                    <input type="text" class="browser-search-input" id="searchSamples" placeholder="Search sounds..." />
                </div>

                <!-- Tree / Category List -->
                <div class="browser-tree" id="browserTree"></div>

                <!-- Preview Info Bar -->
                <div class="browser-preview-bar" id="browserPreviewBar">
                    <span class="preview-status">Click sound to audition</span>
                </div>
            </div>
        `;
      this.treeEl = this.container.querySelector("#browserTree");
      this.previewStatus = this.container.querySelector(".preview-status");
      this.fileInput = this.container.querySelector("#inputAudioFile");
      this.searchInput = this.container.querySelector("#searchSamples");
      this.renderTree();
    }
    _bindEvents() {
      this.container.querySelector("#btnCollapseBrowser").addEventListener("click", () => {
        this.container.classList.toggle("collapsed");
      });
      this.searchInput.addEventListener("input", () => {
        this.renderTree(this.searchInput.value.trim().toLowerCase());
      });
      this.fileInput.addEventListener("change", async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        await this.engine.ensureContext();
        const file = files[0];
        try {
          this.previewStatus.textContent = `Importing ${file.name}...`;
          const arrayBuffer = await file.arrayBuffer();
          const audioBuffer = await this.engine.ctx.decodeAudioData(arrayBuffer);
          const sampleKey = "user_" + Math.random().toString(36).substr(2, 9);
          this.userSamples[sampleKey] = {
            name: file.name.replace(/\.[^/.]+$/, ""),
            category: "User Imports",
            buffer: audioBuffer
          };
          this.previewStatus.textContent = `Imported: ${file.name}`;
          this.renderTree();
        } catch (err) {
          console.error("Audio import decode failed:", err);
          this.previewStatus.textContent = "Import failed. Please use standard WAV/MP3.";
        }
      });
    }
    renderTree(filterQuery = "") {
      const lib = { ...this.engine.sampleLibrary, ...this.userSamples };
      const categories = {};
      for (const [key, item] of Object.entries(lib)) {
        if (filterQuery && !item.name.toLowerCase().includes(filterQuery) && !item.category.toLowerCase().includes(filterQuery)) {
          continue;
        }
        const cat = item.category || "Other";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push({ key, ...item });
      }
      this.treeEl.innerHTML = "";
      const catIcons = {
        "Drums": "\u{1F941}",
        "Bass": "\u{1F3B8}",
        "Synths": "\u{1F3B9}",
        "FX": "\u{1F30A}",
        "Loops": "\u{1F501}",
        "User Imports": "\u{1F4C2}"
      };
      for (const [catName, items] of Object.entries(categories)) {
        const folderEl = document.createElement("div");
        folderEl.className = "browser-folder open";
        folderEl.innerHTML = `
                <div class="folder-header">
                    <span class="folder-arrow">\u25BC</span>
                    <span class="folder-icon">${catIcons[catName] || "\u{1F4C1}"}</span>
                    <span class="folder-name">${catName}</span>
                    <span class="folder-count">${items.length}</span>
                </div>
                <div class="folder-items"></div>
            `;
        folderEl.querySelector(".folder-header").addEventListener("click", () => {
          folderEl.classList.toggle("open");
          folderEl.querySelector(".folder-arrow").textContent = folderEl.classList.contains("open") ? "\u25BC" : "\u25B6";
        });
        const itemsContainer = folderEl.querySelector(".folder-items");
        items.forEach((item) => {
          const itemEl = document.createElement("div");
          itemEl.className = `browser-item ${this.previewingKey === item.key ? "previewing" : ""}`;
          itemEl.draggable = true;
          itemEl.dataset.sampleKey = item.key;
          const durationStr = item.buffer ? `${item.buffer.duration.toFixed(1)}s` : "";
          itemEl.innerHTML = `
                    <span class="item-play-icon">${this.previewingKey === item.key ? "\u23F9" : "\u25B6"}</span>
                    <span class="item-name" title="${item.name}">${item.name}</span>
                    <span class="item-dur">${durationStr}</span>
                `;
          itemEl.addEventListener("click", (e) => {
            e.stopPropagation();
            this.togglePreview(item.key, item);
          });
          itemEl.addEventListener("dblclick", (e) => {
            e.stopPropagation();
            this.insertSampleToTimeline(item.key, item);
          });
          itemEl.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", JSON.stringify({
              type: "sample",
              sampleKey: item.key,
              name: item.name,
              durationSec: item.buffer?.duration || 2
            }));
          });
          itemsContainer.appendChild(itemEl);
        });
        this.treeEl.appendChild(folderEl);
      }
    }
    async togglePreview(key, item) {
      await this.engine.ensureContext();
      if (this.previewingKey === key && this.previewSource) {
        this.stopPreview();
        return;
      }
      this.stopPreview();
      if (!item.buffer) return;
      this.previewingKey = key;
      this.previewSource = this.engine.ctx.createBufferSource();
      this.previewSource.buffer = item.buffer;
      const gain = this.engine.ctx.createGain();
      gain.gain.setValueAtTime(0.85, this.engine.ctx.currentTime);
      this.previewSource.connect(gain);
      gain.connect(this.engine.masterEffects.inputNode);
      this.previewSource.start(0);
      this.previewStatus.textContent = `\u25B6 Playing: ${item.name}`;
      this.previewSource.onended = () => {
        this.previewSource = null;
        this.previewingKey = null;
        this.previewStatus.textContent = "Audition finished";
        this.renderTree();
      };
      this.renderTree();
    }
    stopPreview() {
      if (this.previewSource) {
        try {
          this.previewSource.stop();
          this.previewSource.disconnect();
        } catch (e) {
        }
        this.previewSource = null;
      }
      this.previewingKey = null;
      this.previewStatus.textContent = "Preview stopped";
      this.renderTree();
    }
    insertSampleToTimeline(sampleKey, sampleItem) {
      let track = this.project.getTrack(this.project.activeTrackId);
      if (!track || track.type !== "audio") {
        track = this.project.tracks.find((t) => t.type === "audio") || this.project.addTrack("audio", "Audio Sample");
        this.engine.registerTrack(track);
      }
      const beatSec = 60 / this.project.bpm;
      const durBeats = Math.max(1, Math.round(sampleItem.buffer.duration / beatSec * 4) / 4);
      const playheadBeat = this.project.snapBeat(this.engine.secondsToBeats(this.engine.playheadPosition));
      const clip = new AudioClip({
        name: sampleItem.name,
        trackId: track.id,
        startBeat: playheadBeat,
        durationBeats: durBeats,
        sampleKey,
        audioBuffer: sampleItem.buffer,
        color: track.color
      });
      this.project.history.pushState("Add Sample Clip");
      track.addClip(clip);
      this.project.selectedClipIds.clear();
      this.project.selectedClipIds.add(clip.id);
      this.project.notify("clip_added", { track, clip });
    }
  };

  // js/utils/KnobControl.js
  var KnobControl = class {
    /**
     * @param {HTMLElement} element 
     * @param {Object} options { min, max, value, defaultValue, step, unit, onChange }
     */
    constructor(element, options = {}) {
      this.element = element;
      this.min = options.min !== void 0 ? options.min : 0;
      this.max = options.max !== void 0 ? options.max : 100;
      this.value = options.value !== void 0 ? options.value : this.min;
      this.defaultValue = options.defaultValue !== void 0 ? options.defaultValue : this.value;
      this.step = options.step || 1;
      this.unit = options.unit || "";
      this.onChange = options.onChange || null;
      this.minAngle = -135;
      this.maxAngle = 135;
      this._initDOM();
      this._bindEvents();
      this.setValue(this.value, false);
    }
    _initDOM() {
      this.element.classList.add("audio-knob-container");
      this.element.innerHTML = `
            <div class="audio-knob">
                <div class="audio-knob-indicator"></div>
            </div>
            <div class="audio-knob-val-tip"></div>
        `;
      this.knobEl = this.element.querySelector(".audio-knob");
      this.indicatorEl = this.element.querySelector(".audio-knob-indicator");
      this.tipEl = this.element.querySelector(".audio-knob-val-tip");
    }
    _bindEvents() {
      let isDragging = false;
      let startY = 0;
      let startVal = 0;
      const onMouseDown = (e) => {
        if (e.button !== 0) return;
        isDragging = true;
        startY = e.clientY;
        startVal = this.value;
        this.element.classList.add("active");
        document.body.style.cursor = "ns-resize";
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        e.preventDefault();
      };
      const onMouseMove = (e) => {
        if (!isDragging) return;
        const deltaY = startY - e.clientY;
        const range = this.max - this.min;
        const sensitivity = e.shiftKey ? 400 : 120;
        const deltaVal = deltaY / sensitivity * range;
        let newVal = startVal + deltaVal;
        if (this.step > 0) {
          newVal = Math.round(newVal / this.step) * this.step;
        }
        this.setValue(newVal, true);
      };
      const onMouseUp = () => {
        if (!isDragging) return;
        isDragging = false;
        this.element.classList.remove("active");
        document.body.style.cursor = "";
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
      this.element.addEventListener("mousedown", onMouseDown);
      this.element.addEventListener("dblclick", () => {
        this.setValue(this.defaultValue, true);
      });
      this.element.addEventListener("wheel", (e) => {
        e.preventDefault();
        const stepVal = (e.shiftKey ? this.step || 0.1 : this.step * 2 || 1) * (e.deltaY < 0 ? 1 : -1);
        this.setValue(this.value + stepVal, true);
      }, { passive: false });
    }
    setValue(val, triggerCallback = true) {
      this.value = Math.max(this.min, Math.min(this.max, val));
      const ratio = (this.value - this.min) / (this.max - this.min || 1);
      const angle = this.minAngle + ratio * (this.maxAngle - this.minAngle);
      if (this.knobEl) {
        this.knobEl.style.transform = `rotate(${angle}deg)`;
      }
      const displayVal = Number.isInteger(this.value) ? this.value : this.value.toFixed(1);
      if (this.tipEl) {
        this.tipEl.textContent = `${displayVal}${this.unit}`;
      }
      if (triggerCallback && this.onChange) {
        this.onChange(this.value);
      }
    }
  };

  // js/ui/MixerView.js
  var MixerView = class {
    /**
     * @param {HTMLElement} container 
     * @param {AudioEngine} audioEngine 
     * @param {Project} project 
     */
    constructor(container, audioEngine, project) {
      this.container = container;
      this.engine = audioEngine;
      this.project = project;
      this.meterFills = /* @__PURE__ */ new Map();
      this.masterMeterL = null;
      this.masterMeterR = null;
      this._render();
      this._setupMeterListener();
    }
    _render() {
      this.container.innerHTML = `
            <div class="mixer-container">
                <div class="mixer-channels-scroll" id="mixerChannelsList"></div>
                <div class="mixer-divider"></div>
                <div class="mixer-master-channel" id="mixerMasterChannel"></div>
            </div>
        `;
      this.channelsList = this.container.querySelector("#mixerChannelsList");
      this.masterContainer = this.container.querySelector("#mixerMasterChannel");
      this.renderChannels();
      this.renderMaster();
    }
    renderChannels() {
      this.channelsList.innerHTML = "";
      this.meterFills.clear();
      this.project.tracks.forEach((track, idx) => {
        const strip = document.createElement("div");
        strip.className = `mixer-strip ${track.id === this.project.activeTrackId ? "active" : ""}`;
        strip.dataset.trackId = track.id;
        strip.innerHTML = `
                <div class="strip-color-bar" style="background-color: ${track.color};"></div>
                <div class="strip-header">
                    <span class="strip-num">${idx + 1}</span>
                    <span class="strip-name" title="${track.name}">${track.name}</span>
                </div>

                <!-- FX Quick Slots -->
                <div class="strip-fx-slots">
                    <span class="fx-badge ${!track.effects.hpfBypass || !track.effects.lpfBypass ? "active" : ""}" title="Filter EQ">EQ</span>
                    <span class="fx-badge ${!track.effects.distortionBypass ? "active" : ""}" title="Distortion">DST</span>
                    <span class="fx-badge ${!track.effects.delayBypass ? "active" : ""}" title="Delay">DLY</span>
                    <span class="fx-badge ${!track.effects.reverbBypass ? "active" : ""}" title="Reverb">REV</span>
                </div>

                <!-- Pan Knob -->
                <div class="strip-pan-section">
                    <span class="strip-label">PAN</span>
                    <div class="pan-knob-placeholder" data-track-id="${track.id}"></div>
                </div>

                <!-- Mute / Solo / Arm -->
                <div class="strip-buttons-section">
                    <button class="strip-btn btn-mute ${track.mute ? "active" : ""}" title="Mute Track (M)">M</button>
                    <button class="strip-btn btn-solo ${track.solo ? "active" : ""}" title="Solo Track (S)">S</button>
                    <button class="strip-btn btn-arm ${track.arm ? "active" : ""}" title="Arm for Recording">R</button>
                </div>

                <!-- Fader & VU Meter Section -->
                <div class="strip-fader-meter-section">
                    <div class="db-scale">
                        <span>+6</span>
                        <span>0</span>
                        <span>-6</span>
                        <span>-12</span>
                        <span>-24</span>
                        <span>-inf</span>
                    </div>

                    <div class="strip-fader-wrapper">
                        <input type="range" class="strip-fader" min="0" max="1.5" step="0.01" value="${track.volume}" orient="vertical" title="Track Gain (Double-click: 0 dB)" />
                    </div>

                    <!-- LED VU Meter -->
                    <div class="strip-meter-wrapper">
                        <div class="meter-clip-led" title="Clip Indicator (Click to reset)"></div>
                        <div class="meter-bar-container">
                            <div class="meter-bar-fill meter-fill-l"></div>
                        </div>
                    </div>
                </div>

                <!-- Numerical Readout -->
                <div class="strip-db-readout" id="dbReadout_${track.id}">
                    ${this._volumeToDbString(track.volume)}
                </div>
            `;
        const knobContainer = strip.querySelector(".pan-knob-placeholder");
        new KnobControl(knobContainer, {
          min: -1,
          max: 1,
          value: track.pan,
          defaultValue: 0,
          step: 0.05,
          unit: "",
          onChange: (val) => {
            track.pan = val;
            const eng = this.engine.trackEngines.get(track.id);
            if (eng) eng.effects.setPan(val);
          }
        });
        strip.addEventListener("click", () => {
          this.project.activeTrackId = track.id;
          this.container.querySelectorAll(".mixer-strip").forEach((s) => s.classList.remove("active"));
          strip.classList.add("active");
          this.project.notify("active_track_changed", { trackId: track.id });
        });
        strip.querySelector(".btn-mute").addEventListener("click", (e) => {
          e.stopPropagation();
          track.mute = !track.mute;
          strip.querySelector(".btn-mute").classList.toggle("active", track.mute);
          this.engine.updateSoloMuteStates();
          this.project.notify("track_state_changed");
        });
        strip.querySelector(".btn-solo").addEventListener("click", (e) => {
          e.stopPropagation();
          track.solo = !track.solo;
          strip.querySelector(".btn-solo").classList.toggle("active", track.solo);
          this.engine.updateSoloMuteStates();
          this.project.notify("track_state_changed");
        });
        strip.querySelector(".btn-arm").addEventListener("click", (e) => {
          e.stopPropagation();
          track.arm = !track.arm;
          strip.querySelector(".btn-arm").classList.toggle("active", track.arm);
        });
        const fader = strip.querySelector(".strip-fader");
        const dbReadout = strip.querySelector(`#dbReadout_${track.id}`);
        fader.addEventListener("input", (e) => {
          const val = parseFloat(e.target.value);
          track.volume = val;
          dbReadout.textContent = this._volumeToDbString(val);
          const eng = this.engine.trackEngines.get(track.id);
          if (eng) eng.effects.setGain(val);
        });
        fader.addEventListener("dblclick", () => {
          fader.value = 1;
          track.volume = 1;
          dbReadout.textContent = "0.0 dB";
          const eng = this.engine.trackEngines.get(track.id);
          if (eng) eng.effects.setGain(1);
        });
        const clipLed = strip.querySelector(".meter-clip-led");
        clipLed.addEventListener("click", () => {
          clipLed.classList.remove("clipping");
        });
        this.meterFills.set(track.id, {
          fill: strip.querySelector(".meter-fill-l"),
          clip: clipLed
        });
        this.channelsList.appendChild(strip);
      });
    }
    renderMaster() {
      this.masterContainer.innerHTML = `
            <div class="mixer-strip strip-master">
                <div class="strip-color-bar" style="background-color: #ef4444;"></div>
                <div class="strip-header">
                    <span class="strip-num">M</span>
                    <span class="strip-name">MASTER</span>
                </div>

                <div class="strip-fx-slots">
                    <span class="fx-badge active" title="Brickwall Limiter Active">LIMITER</span>
                </div>

                <div class="strip-pan-section">
                    <span class="strip-label">PAN</span>
                    <div class="master-pan-knob"></div>
                </div>

                <div class="strip-buttons-section">
                    <span class="master-out-lbl">STEREO BUS</span>
                </div>

                <div class="strip-fader-meter-section">
                    <div class="db-scale">
                        <span>+6</span>
                        <span>0</span>
                        <span>-6</span>
                        <span>-12</span>
                        <span>-24</span>
                        <span>-inf</span>
                    </div>

                    <div class="strip-fader-wrapper">
                        <input type="range" class="strip-fader master-fader" min="0" max="1.5" step="0.01" value="${this.project.masterVolume}" orient="vertical" title="Master Output Gain" />
                    </div>

                    <!-- Dual Stereo VU Meter -->
                    <div class="strip-meter-wrapper dual-meter">
                        <div class="meter-clip-led" id="masterClipLed" title="Master Clip Indicator (Click to reset)"></div>
                        <div class="dual-meter-bars">
                            <div class="meter-bar-container">
                                <div class="meter-bar-fill" id="masterMeterFillL"></div>
                            </div>
                            <div class="meter-bar-container">
                                <div class="meter-bar-fill" id="masterMeterFillR"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="strip-db-readout" id="masterDbReadout">
                    ${this._volumeToDbString(this.project.masterVolume)}
                </div>
            </div>
        `;
      const masterPanKnob = this.masterContainer.querySelector(".master-pan-knob");
      new KnobControl(masterPanKnob, {
        min: -1,
        max: 1,
        value: 0,
        defaultValue: 0,
        step: 0.05,
        onChange: (val) => {
          if (this.engine.masterEffects) this.engine.masterEffects.setPan(val);
        }
      });
      const masterFader = this.masterContainer.querySelector(".master-fader");
      const masterDbReadout = this.masterContainer.querySelector("#masterDbReadout");
      masterFader.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        this.project.masterVolume = val;
        masterDbReadout.textContent = this._volumeToDbString(val);
        if (this.engine.masterEffects) {
          this.engine.masterEffects.setGain(val);
        }
      });
      masterFader.addEventListener("dblclick", () => {
        masterFader.value = 1;
        this.project.masterVolume = 1;
        masterDbReadout.textContent = "0.0 dB";
        if (this.engine.masterEffects) {
          this.engine.masterEffects.setGain(1);
        }
      });
      this.masterMeterL = this.masterContainer.querySelector("#masterMeterFillL");
      this.masterMeterR = this.masterContainer.querySelector("#masterMeterFillR");
      this.masterClipLed = this.masterContainer.querySelector("#masterClipLed");
      if (this.masterClipLed) {
        this.masterClipLed.addEventListener("click", () => {
          this.masterClipLed.classList.remove("clipping");
        });
      }
    }
    _setupMeterListener() {
      this.engine.onTrackLevelUpdate = (trackId, levels) => {
        const meter = this.meterFills.get(trackId);
        if (meter && meter.fill) {
          const pct = Math.min(100, Math.round(levels.peak * 100));
          meter.fill.style.height = `${pct}%`;
          if (levels.clipping) {
            meter.clip.classList.add("clipping");
          }
        }
      };
      this.engine.onMasterLevelUpdate = (levels) => {
        if (this.masterMeterL && this.masterMeterR) {
          const pct = Math.min(100, Math.round(levels.peak * 100));
          this.masterMeterL.style.height = `${pct}%`;
          this.masterMeterR.style.height = `${pct}%`;
          if (this.masterClipLed && levels.clipping) {
            this.masterClipLed.classList.add("clipping");
          }
        }
      };
    }
    _volumeToDbString(vol) {
      if (vol <= 1e-4) return "-inf dB";
      const db = 20 * Math.log10(vol);
      const sign = db > 0 ? "+" : "";
      return `${sign}${db.toFixed(1)} dB`;
    }
  };

  // js/ui/PianoRollView.js
  var PianoRollView = class {
    /**
     * @param {HTMLElement} container 
     * @param {AudioEngine} audioEngine 
     * @param {Project} project 
     */
    constructor(container, audioEngine, project) {
      this.container = container;
      this.engine = audioEngine;
      this.project = project;
      this.minPitch = 24;
      this.maxPitch = 84;
      this.numKeys = this.maxPitch - this.minPitch + 1;
      this.keyHeight = 18;
      this.pixelsPerBeat = 60;
      this.clip = null;
      this.scrollLeft = 0;
      this.scrollTop = (this.maxPitch - 60) * this.keyHeight;
      this.selectedNoteIds = /* @__PURE__ */ new Set();
      this.activeTool = "pen";
      this.lastNoteDuration = 1;
      this._render();
      this._bindEvents();
    }
    setClip(clip) {
      this.clip = clip;
      this.selectedNoteIds.clear();
      this.renderAll();
    }
    _render() {
      this.container.innerHTML = `
            <div class="pianoroll-container">
                <!-- Top Toolbar -->
                <div class="pianoroll-toolbar">
                    <div class="toolbar-left">
                        <span class="pianoroll-title" id="prClipTitle">Piano Roll</span>
                        <div class="pianoroll-tools">
                            <button class="pr-tool-btn ${this.activeTool === "pen" ? "active" : ""}" data-tool="pen" title="Draw Notes (P)">\u270F Pen</button>
                            <button class="pr-tool-btn ${this.activeTool === "pointer" ? "active" : ""}" data-tool="pointer" title="Select / Move Notes (V)">\u2196 Select</button>
                            <button class="pr-tool-btn ${this.activeTool === "eraser" ? "active" : ""}" data-tool="eraser" title="Erase Notes (E)">\u232B Erase</button>
                        </div>
                    </div>

                    <div class="toolbar-right">
                        <button class="pr-action-btn" id="btnQuantize" title="Quantize Notes to Grid (Q)">Quantize</button>
                        <div class="pr-transpose-group">
                            <button class="pr-action-btn" id="btnOctDown" title="Octave Down (-12)">-12</button>
                            <button class="pr-action-btn" id="btnSemiDown" title="Semitone Down (-1)">-1</button>
                            <button class="pr-action-btn" id="btnSemiUp" title="Semitone Up (+1)">+1</button>
                            <button class="pr-action-btn" id="btnOctUp" title="Octave Up (+12)">+12</button>
                        </div>
                        <button class="pr-action-btn btn-clear-notes" id="btnClearNotes" title="Clear all notes in clip">Clear</button>
                    </div>
                </div>

                <!-- Main Work Area (Keys + Grid + Velocity) -->
                <div class="pianoroll-workspace" id="prWorkspace">
                    <!-- Left: Piano Keyboard Keys -->
                    <div class="pianoroll-keyboard-viewport" id="prKeyboardViewport">
                        <div class="pianoroll-keyboard" id="prKeyboard"></div>
                    </div>

                    <!-- Right: Note Grid Canvas & Notes Overlay -->
                    <div class="pianoroll-grid-viewport" id="prGridViewport">
                        <div class="pianoroll-grid-content" id="prGridContent">
                            <canvas class="pianoroll-grid-canvas" id="prGridCanvas"></canvas>
                            <div class="pianoroll-notes-layer" id="prNotesLayer"></div>
                        </div>
                    </div>
                </div>

                <!-- Bottom: Velocity Editor Lane -->
                <div class="pianoroll-velocity-lane" id="prVelocityLane">
                    <div class="velocity-label">VELOCITY</div>
                    <div class="velocity-viewport" id="prVelocityViewport">
                        <div class="velocity-content" id="prVelocityContent">
                            <canvas class="velocity-canvas" id="prVelocityCanvas"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
      this.keyboardEl = this.container.querySelector("#prKeyboard");
      this.keyboardViewport = this.container.querySelector("#prKeyboardViewport");
      this.gridViewport = this.container.querySelector("#prGridViewport");
      this.gridContent = this.container.querySelector("#prGridContent");
      this.gridCanvas = this.container.querySelector("#prGridCanvas");
      this.notesLayer = this.container.querySelector("#prNotesLayer");
      this.velocityViewport = this.container.querySelector("#prVelocityViewport");
      this.velocityContent = this.container.querySelector("#prVelocityContent");
      this.velocityCanvas = this.container.querySelector("#prVelocityCanvas");
      this.clipTitle = this.container.querySelector("#prClipTitle");
      this.renderKeyboard();
    }
    _bindEvents() {
      this.container.querySelectorAll(".pr-tool-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          this.activeTool = e.currentTarget.dataset.tool;
          this.container.querySelectorAll(".pr-tool-btn").forEach((b) => b.classList.remove("active"));
          e.currentTarget.classList.add("active");
        });
      });
      this.container.querySelector("#btnQuantize").addEventListener("click", () => {
        this.quantizeNotes();
      });
      this.container.querySelector("#btnOctDown").addEventListener("click", () => this.transposeNotes(-12));
      this.container.querySelector("#btnOctUp").addEventListener("click", () => this.transposeNotes(12));
      this.container.querySelector("#btnSemiDown").addEventListener("click", () => this.transposeNotes(-1));
      this.container.querySelector("#btnSemiUp").addEventListener("click", () => this.transposeNotes(1));
      this.container.querySelector("#btnClearNotes").addEventListener("click", () => {
        if (this.clip) {
          this.project.history.pushState("Clear Piano Roll");
          this.clip.notes = [];
          this.selectedNoteIds.clear();
          this.renderAll();
          this.project.notify("clip_updated", { clip: this.clip });
        }
      });
      this.gridViewport.addEventListener("scroll", () => {
        this.scrollLeft = this.gridViewport.scrollLeft;
        this.scrollTop = this.gridViewport.scrollTop;
        this.keyboardViewport.scrollTop = this.scrollTop;
        this.velocityViewport.scrollLeft = this.scrollLeft;
      });
      this._bindGridMouseEvents();
      this._bindVelocityEvents();
      window.addEventListener("keydown", (e) => {
        if (["input", "textarea"].includes(document.activeElement.tagName.toLowerCase())) return;
        if (this.project.activeBottomTab !== "pianoroll") return;
        if (this.selectedNoteIds.size > 0) {
          if (e.key === "ArrowUp") {
            e.preventDefault();
            this.transposeNotes(e.shiftKey ? 12 : 1);
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            this.transposeNotes(e.shiftKey ? -12 : -1);
          } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
            e.preventDefault();
            this.selectAllNotes();
          }
        }
      });
    }
    selectAllNotes() {
      if (!this.clip || !this.clip.notes) return;
      this.selectedNoteIds.clear();
      this.clip.notes.forEach((n) => this.selectedNoteIds.add(n.id));
      this.renderNotes();
      this.drawVelocityCanvas();
    }
    renderKeyboard() {
      this.keyboardEl.innerHTML = "";
      const totalHeight = this.numKeys * this.keyHeight;
      this.keyboardEl.style.height = `${totalHeight}px`;
      const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      for (let p = this.maxPitch; p >= this.minPitch; p--) {
        const key = document.createElement("div");
        const noteIdx = p % 12;
        const octave = Math.floor(p / 12) - 1;
        const isBlack = [1, 3, 6, 8, 10].includes(noteIdx);
        key.className = `piano-key ${isBlack ? "black-key" : "white-key"} ${noteIdx === 0 ? "c-key" : ""}`;
        key.style.height = `${this.keyHeight}px`;
        key.dataset.pitch = p;
        key.title = `${noteNames[noteIdx]}${octave} (${p})`;
        if (noteIdx === 0) {
          key.innerHTML = `<span class="key-label">C${octave}</span>`;
        } else if (!isBlack) {
          key.innerHTML = `<span class="key-label-sub">${noteNames[noteIdx]}</span>`;
        }
        key.addEventListener("mousedown", () => {
          key.classList.add("pressed");
          this._auditionPitch(p);
        });
        const releaseKey = () => {
          key.classList.remove("pressed");
          this._releasePitch(p);
        };
        key.addEventListener("mouseup", releaseKey);
        key.addEventListener("mouseleave", releaseKey);
        this.keyboardEl.appendChild(key);
      }
    }
    _auditionPitch(pitch) {
      if (!this.project.activeTrackId) return;
      const eng = this.engine.trackEngines.get(this.project.activeTrackId);
      if (eng && eng.synth) {
        eng.synth.noteOn(pitch, 100);
      }
    }
    _releasePitch(pitch) {
      if (!this.project.activeTrackId) return;
      const eng = this.engine.trackEngines.get(this.project.activeTrackId);
      if (eng && eng.synth) {
        eng.synth.noteOff(pitch);
      }
    }
    renderAll() {
      if (!this.clip) {
        this.clipTitle.textContent = "Piano Roll (Select a MIDI Clip)";
        this.notesLayer.innerHTML = "";
        this.drawGridCanvas();
        this.drawVelocityCanvas();
        return;
      }
      this.clipTitle.textContent = `Piano Roll: ${this.clip.name}`;
      const totalBeats = Math.max(16, this.clip.durationBeats);
      const totalWidth = totalBeats * this.pixelsPerBeat + 300;
      const totalHeight = this.numKeys * this.keyHeight;
      this.gridContent.style.width = `${totalWidth}px`;
      this.gridContent.style.height = `${totalHeight}px`;
      this.velocityContent.style.width = `${totalWidth}px`;
      this.drawGridCanvas();
      this.renderNotes();
      this.drawVelocityCanvas();
    }
    drawGridCanvas() {
      const canvas = this.gridCanvas;
      if (!canvas) return;
      const w = this.gridContent.clientWidth || 1e3;
      const h = this.gridContent.clientHeight || 1e3;
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      const ctx = canvas.getContext("2d");
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < this.numKeys; i++) {
        const pitch = this.maxPitch - i;
        const noteIdx = pitch % 12;
        const isBlack = [1, 3, 6, 8, 10].includes(noteIdx);
        const y = i * this.keyHeight;
        ctx.fillStyle = isBlack ? "#14171f" : "#1a1e27";
        ctx.fillRect(0, y, w, this.keyHeight);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y + this.keyHeight - 0.5);
        ctx.lineTo(w, y + this.keyHeight - 0.5);
        ctx.stroke();
      }
      const totalBeats = Math.ceil(w / this.pixelsPerBeat);
      for (let b = 0; b <= totalBeats; b++) {
        const x = b * this.pixelsPerBeat;
        const isBar = b % 4 === 0;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.strokeStyle = isBar ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        ctx.stroke();
        for (let sub = 1; sub < 4; sub++) {
          const subX = x + sub * (this.pixelsPerBeat / 4);
          ctx.beginPath();
          ctx.moveTo(subX, 0);
          ctx.lineTo(subX, h);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
          ctx.stroke();
        }
      }
      ctx.restore();
    }
    renderNotes() {
      this.notesLayer.innerHTML = "";
      if (!this.clip || !this.clip.notes) return;
      this.clip.notes.forEach((note) => {
        const noteEl = document.createElement("div");
        const isSelected = this.selectedNoteIds.has(note.id);
        noteEl.className = `piano-roll-note ${isSelected ? "selected" : ""}`;
        noteEl.dataset.noteId = note.id;
        const left = note.startBeat * this.pixelsPerBeat;
        const width = Math.max(8, note.durationBeats * this.pixelsPerBeat);
        const pitchIndex = this.maxPitch - note.pitch;
        const top = pitchIndex * this.keyHeight;
        noteEl.style.left = `${left}px`;
        noteEl.style.top = `${top}px`;
        noteEl.style.width = `${width}px`;
        noteEl.style.height = `${this.keyHeight - 1}px`;
        noteEl.style.backgroundColor = this.clip.color || "#10b981";
        const velNorm = (note.velocity || 100) / 127;
        noteEl.style.opacity = `${0.65 + velNorm * 0.35}`;
        noteEl.innerHTML = `
                <span class="note-name">${this._pitchToName(note.pitch)}</span>
                <div class="note-resize-handle"></div>
            `;
        this.notesLayer.appendChild(noteEl);
      });
    }
    drawVelocityCanvas() {
      const canvas = this.velocityCanvas;
      if (!canvas) return;
      const w = this.velocityContent.clientWidth || 1e3;
      const h = 60;
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      const ctx = canvas.getContext("2d");
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#141720";
      ctx.fillRect(0, 0, w, h);
      if (!this.clip || !this.clip.notes) {
        ctx.restore();
        return;
      }
      this.clip.notes.forEach((note) => {
        const x = note.startBeat * this.pixelsPerBeat;
        const vel = note.velocity !== void 0 ? note.velocity : 100;
        const stalkHeight = vel / 127 * (h - 10);
        const y = h - stalkHeight;
        const isSelected = this.selectedNoteIds.has(note.id);
        ctx.fillStyle = isSelected ? "#ffffff" : this.clip.color || "#10b981";
        ctx.fillRect(x + 2, y, 4, stalkHeight);
        ctx.beginPath();
        ctx.arc(x + 4, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }
    _bindGridMouseEvents() {
      const gridContent = this.gridContent;
      gridContent.addEventListener("mousedown", (e) => {
        if (!this.clip) return;
        const noteEl = e.target.closest(".piano-roll-note");
        const resizeHandle = e.target.closest(".note-resize-handle");
        if (this.activeTool === "eraser" || e.button === 2) {
          if (noteEl) {
            const noteId = noteEl.dataset.noteId;
            this._deleteNote(noteId);
          }
          return;
        }
        if (resizeHandle && noteEl) {
          e.stopPropagation();
          const noteId = noteEl.dataset.noteId;
          this._startNoteResize(e, noteId);
          return;
        }
        if (noteEl) {
          e.stopPropagation();
          const noteId = noteEl.dataset.noteId;
          if (!e.shiftKey && !this.selectedNoteIds.has(noteId)) {
            this.selectedNoteIds.clear();
          }
          this.selectedNoteIds.add(noteId);
          this.renderNotes();
          this.drawVelocityCanvas();
          const note = this.clip.notes.find((n) => n.id === noteId);
          if (note) this._auditionPitch(note.pitch);
          this._startNoteMove(e, noteId);
          return;
        }
        if (this.activeTool === "pen" && !noteEl) {
          const rect = gridContent.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const clickY = e.clientY - rect.top;
          const snapVal = this.project.getSnapBeatValue();
          const rawBeat = clickX / this.pixelsPerBeat;
          const startBeat = Math.max(0, Math.floor(rawBeat / snapVal) * snapVal);
          const pitchIdx = Math.floor(clickY / this.keyHeight);
          const pitch = this.maxPitch - pitchIdx;
          if (pitch >= this.minPitch && pitch <= this.maxPitch) {
            this.project.history.pushState("Add MIDI Note");
            const newNote = {
              id: "note_" + Math.random().toString(36).substr(2, 9),
              pitch,
              startBeat,
              durationBeats: Math.max(snapVal, this.lastNoteDuration),
              velocity: 100
            };
            this.clip.notes.push(newNote);
            this.selectedNoteIds.clear();
            this.selectedNoteIds.add(newNote.id);
            this._auditionPitch(pitch);
            this.renderNotes();
            this.drawVelocityCanvas();
            this.project.notify("clip_updated", { clip: this.clip });
            this._startNoteResize(e, newNote.id);
          }
        }
      });
      gridContent.addEventListener("contextmenu", (e) => e.preventDefault());
    }
    _startNoteMove(e, primaryNoteId) {
      this.project.history.pushState("Move MIDI Notes");
      const startX = e.clientX;
      const startY = e.clientY;
      const notesInitial = [];
      this.selectedNoteIds.forEach((id) => {
        const n = this.clip.notes.find((note) => note.id === id);
        if (n) {
          notesInitial.push({ note: n, origStartBeat: n.startBeat, origPitch: n.pitch });
        }
      });
      const snapVal = this.project.getSnapBeatValue();
      const onMouseMove = (ev) => {
        const deltaX = ev.clientX - startX;
        const deltaY = ev.clientY - startY;
        const deltaBeat = deltaX / this.pixelsPerBeat;
        const deltaPitch = -Math.round(deltaY / this.keyHeight);
        notesInitial.forEach(({ note, origStartBeat, origPitch }) => {
          const targetBeat = Math.max(0, Math.round((origStartBeat + deltaBeat) / snapVal) * snapVal);
          const targetPitch = Math.max(this.minPitch, Math.min(this.maxPitch, origPitch + deltaPitch));
          note.startBeat = targetBeat;
          note.pitch = targetPitch;
        });
        this.renderNotes();
        this.drawVelocityCanvas();
      };
      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        this.project.notify("clip_updated", { clip: this.clip });
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    _startNoteResize(e, noteId) {
      const note = this.clip.notes.find((n) => n.id === noteId);
      if (!note) return;
      const startX = e.clientX;
      const origDur = note.durationBeats;
      const snapVal = this.project.getSnapBeatValue();
      const onMouseMove = (ev) => {
        const deltaX = ev.clientX - startX;
        const deltaBeat = deltaX / this.pixelsPerBeat;
        const newDur = Math.max(snapVal, Math.round((origDur + deltaBeat) / snapVal) * snapVal);
        note.durationBeats = newDur;
        this.lastNoteDuration = newDur;
        this.renderNotes();
      };
      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        this.project.notify("clip_updated", { clip: this.clip });
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    _deleteNote(noteId) {
      this.project.history.pushState("Delete MIDI Note");
      const idx = this.clip.notes.findIndex((n) => n.id === noteId);
      if (idx !== -1) {
        this.clip.notes.splice(idx, 1);
        this.selectedNoteIds.delete(noteId);
        this.renderNotes();
        this.drawVelocityCanvas();
        this.project.notify("clip_updated", { clip: this.clip });
      }
    }
    _bindVelocityEvents() {
      const canvas = this.velocityCanvas;
      let isDragging = false;
      const updateVelocityFromMouse = (e) => {
        if (!this.clip || !this.clip.notes) return;
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        const h = rect.height;
        const vel = Math.max(1, Math.min(127, Math.round((1 - clickY / h) * 127)));
        const beatAtX = clickX / this.pixelsPerBeat;
        this.clip.notes.forEach((note) => {
          if (Math.abs(note.startBeat - beatAtX) < 0.35 || this.selectedNoteIds.has(note.id)) {
            note.velocity = vel;
          }
        });
        this.drawVelocityCanvas();
        this.renderNotes();
      };
      canvas.addEventListener("mousedown", (e) => {
        isDragging = true;
        this.project.history.pushState("Edit Note Velocity");
        updateVelocityFromMouse(e);
        const onMouseMove = (ev) => {
          if (isDragging) updateVelocityFromMouse(ev);
        };
        const onMouseUp = () => {
          isDragging = false;
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
          this.project.notify("clip_updated", { clip: this.clip });
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      });
    }
    quantizeNotes() {
      if (!this.clip || !this.clip.notes) return;
      this.project.history.pushState("Quantize Notes");
      const snapVal = this.project.getSnapBeatValue();
      this.clip.notes.forEach((n) => {
        if (this.selectedNoteIds.size === 0 || this.selectedNoteIds.has(n.id)) {
          n.startBeat = Math.round(n.startBeat / snapVal) * snapVal;
          n.durationBeats = Math.max(snapVal, Math.round(n.durationBeats / snapVal) * snapVal);
        }
      });
      this.renderAll();
      this.project.notify("clip_updated", { clip: this.clip });
    }
    transposeNotes(semitones) {
      if (!this.clip || !this.clip.notes) return;
      this.project.history.pushState(`Transpose ${semitones} st`);
      this.clip.notes.forEach((n) => {
        if (this.selectedNoteIds.size === 0 || this.selectedNoteIds.has(n.id)) {
          n.pitch = Math.max(this.minPitch, Math.min(this.maxPitch, n.pitch + semitones));
        }
      });
      this.renderAll();
      this.project.notify("clip_updated", { clip: this.clip });
    }
    _pitchToName(pitch) {
      const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      const note = names[pitch % 12];
      const oct = Math.floor(pitch / 12) - 1;
      return `${note}${oct}`;
    }
  };

  // js/ui/DrumSequencerView.js
  var DrumSequencerView = class {
    /**
     * @param {HTMLElement} container 
     * @param {AudioEngine} audioEngine 
     * @param {Project} project 
     */
    constructor(container, audioEngine, project) {
      this.container = container;
      this.engine = audioEngine;
      this.project = project;
      this.clip = null;
      this.activeStep = -1;
      this.instruments = [
        { id: "kick", name: "Kick 808", voiceIndex: 0, color: "#ef4444", mute: false, solo: false },
        { id: "snare", name: "Snare Drum", voiceIndex: 1, color: "#f97316", mute: false, solo: false },
        { id: "hat_closed", name: "Closed Hat", voiceIndex: 2, color: "#eab308", mute: false, solo: false },
        { id: "hat_open", name: "Open Hat", voiceIndex: 3, color: "#84cc16", mute: false, solo: false },
        { id: "clap", name: "Studio Clap", voiceIndex: 4, color: "#06b6d4", mute: false, solo: false },
        { id: "tom", name: "Analog Tom", voiceIndex: 5, color: "#6366f1", mute: false, solo: false },
        { id: "rim", name: "Rimshot Perc", voiceIndex: 6, color: "#a855f7", mute: false, solo: false },
        { id: "crash", name: "Crash Cymbal", voiceIndex: 7, color: "#ec4899", mute: false, solo: false }
      ];
      this._render();
      this._bindEvents();
    }
    setClip(clip) {
      this.clip = clip;
      this.renderAll();
    }
    _render() {
      this.container.innerHTML = `
            <div class="drum-sequencer-container">
                <!-- Top Toolbar -->
                <div class="drum-toolbar">
                    <div class="drum-title" id="drumClipTitle">Drum Sequencer (16-Step Grid)</div>
                    <div class="drum-actions">
                        <button class="drum-btn" id="btnFillFour" title="Place Kick on every beat">4-on-the-floor</button>
                        <button class="drum-btn" id="btnFillHats" title="Fill 16th closed hats">Fill 16ths</button>
                        <button class="drum-btn" id="btnFillOffbeats" title="Open hats on offbeats">Offbeat Hats</button>
                        <button class="drum-btn" id="btnRandomizeDrums" title="Generate procedural groove">Randomize</button>
                        <button class="drum-btn btn-clear-drums" id="btnClearDrums" title="Clear all steps">Clear Grid</button>
                    </div>
                </div>

                <!-- Grid Rows Viewport -->
                <div class="drum-grid-viewport" id="drumGridViewport">
                    <div class="drum-grid-rows" id="drumGridRows"></div>
                </div>
            </div>
        `;
      this.gridRows = this.container.querySelector("#drumGridRows");
      this.clipTitle = this.container.querySelector("#drumClipTitle");
      this.renderAll();
    }
    _bindEvents() {
      this.container.querySelector("#btnFillFour").addEventListener("click", () => {
        if (!this.clip || !this.clip.pattern) return;
        this.project.history.pushState("4-on-the-floor preset");
        const kickRow = this.clip.pattern.tracks.find((t) => t.voiceIndex === 0);
        if (kickRow) {
          kickRow.steps = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
        }
        const snareRow = this.clip.pattern.tracks.find((t) => t.voiceIndex === 1);
        if (snareRow) {
          snareRow.steps = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
        }
        this.renderAll();
        this.project.notify("clip_updated", { clip: this.clip });
      });
      this.container.querySelector("#btnFillHats").addEventListener("click", () => {
        if (!this.clip || !this.clip.pattern) return;
        this.project.history.pushState("Fill Hats");
        const hatRow = this.clip.pattern.tracks.find((t) => t.voiceIndex === 2);
        if (hatRow) {
          hatRow.steps = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        }
        this.renderAll();
        this.project.notify("clip_updated", { clip: this.clip });
      });
      this.container.querySelector("#btnFillOffbeats").addEventListener("click", () => {
        if (!this.clip || !this.clip.pattern) return;
        this.project.history.pushState("Fill Offbeat Hats");
        const hatOpenRow = this.clip.pattern.tracks.find((t) => t.voiceIndex === 3);
        if (hatOpenRow) {
          hatOpenRow.steps = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0];
        }
        this.renderAll();
        this.project.notify("clip_updated", { clip: this.clip });
      });
      this.container.querySelector("#btnRandomizeDrums").addEventListener("click", () => {
        if (!this.clip || !this.clip.pattern) return;
        this.project.history.pushState("Randomize Drums");
        this.clip.pattern.tracks.forEach((row) => {
          row.steps = row.steps.map(() => Math.random() < 0.28 ? Math.random() < 0.2 ? 120 : 1 : 0);
        });
        this.renderAll();
        this.project.notify("clip_updated", { clip: this.clip });
      });
      this.container.querySelector("#btnClearDrums").addEventListener("click", () => {
        if (!this.clip || !this.clip.pattern) return;
        this.project.history.pushState("Clear Drum Grid");
        this.clip.pattern.tracks.forEach((row) => {
          row.steps = row.steps.map(() => 0);
        });
        this.renderAll();
        this.project.notify("clip_updated", { clip: this.clip });
      });
    }
    renderAll() {
      if (!this.clip || !this.clip.pattern) {
        this.clipTitle.textContent = "Drum Sequencer (Select a Drum Clip)";
        this.gridRows.innerHTML = '<div class="no-clip-msg">Select or create a Drum Pattern Clip on the arrangement timeline to edit beats.</div>';
        return;
      }
      this.clipTitle.textContent = `Drum Sequencer: ${this.clip.name}`;
      this.gridRows.innerHTML = "";
      const stepsCount = this.clip.pattern.steps || 16;
      this.instruments.forEach((inst) => {
        let rowData = this.clip.pattern.tracks.find((t) => t.voiceIndex === inst.voiceIndex);
        if (!rowData) {
          rowData = { voiceIndex: inst.voiceIndex, steps: new Array(stepsCount).fill(0) };
          this.clip.pattern.tracks.push(rowData);
        }
        const rowEl = document.createElement("div");
        rowEl.className = "drum-row";
        rowEl.dataset.voiceIndex = inst.voiceIndex;
        const padEl = document.createElement("button");
        padEl.className = "drum-pad";
        padEl.style.borderLeftColor = inst.color;
        padEl.title = `Audition ${inst.name}`;
        padEl.innerHTML = `
                <span class="pad-dot" style="background-color: ${inst.color};"></span>
                <span class="pad-name">${inst.name}</span>
            `;
        padEl.addEventListener("click", () => {
          this._auditionDrum(inst.voiceIndex);
        });
        const rowControls = document.createElement("div");
        rowControls.className = "drum-row-controls";
        rowControls.innerHTML = `
                <button class="row-btn-clear" title="Clear this row">\u2715</button>
            `;
        rowControls.querySelector(".row-btn-clear").addEventListener("click", (e) => {
          e.stopPropagation();
          rowData.steps = rowData.steps.map(() => 0);
          this.renderAll();
          this.project.notify("clip_updated", { clip: this.clip });
        });
        const stepsContainer = document.createElement("div");
        stepsContainer.className = "drum-steps-container";
        for (let s = 0; s < stepsCount; s++) {
          const stepVal = rowData.steps[s] || 0;
          const isBeatStart = s % 4 === 0;
          const stepBtn = document.createElement("button");
          stepBtn.className = `drum-step-btn ${stepVal > 0 ? "active" : ""} ${stepVal > 1 ? "accent" : ""} ${isBeatStart ? "beat-start" : ""}`;
          stepBtn.dataset.stepIndex = s;
          stepBtn.title = `Step ${s + 1} (Click to toggle, Shift+Click for Accent)`;
          stepBtn.innerHTML = `<span class="step-num">${s + 1}</span>`;
          if (stepVal > 0) {
            stepBtn.style.backgroundColor = inst.color;
            stepBtn.style.boxShadow = `0 0 8px ${inst.color}88`;
          }
          stepBtn.addEventListener("click", (e) => {
            this.project.history.pushState("Toggle Drum Step");
            const currentVal = rowData.steps[s] || 0;
            let newVal = 0;
            if (currentVal === 0) {
              newVal = e.shiftKey ? 120 : 1;
              this._auditionDrum(inst.voiceIndex);
            } else if (currentVal === 1 && !e.shiftKey) {
              newVal = 0;
            } else if (currentVal > 1) {
              newVal = 0;
            } else {
              newVal = 120;
            }
            rowData.steps[s] = newVal;
            stepBtn.classList.toggle("active", newVal > 0);
            stepBtn.classList.toggle("accent", newVal > 1);
            if (newVal > 0) {
              stepBtn.style.backgroundColor = inst.color;
              stepBtn.style.boxShadow = `0 0 8px ${inst.color}88`;
            } else {
              stepBtn.style.backgroundColor = "";
              stepBtn.style.boxShadow = "";
            }
            this.project.notify("clip_updated", { clip: this.clip });
          });
          stepsContainer.appendChild(stepBtn);
        }
        rowEl.appendChild(padEl);
        rowEl.appendChild(rowControls);
        rowEl.appendChild(stepsContainer);
        this.gridRows.appendChild(rowEl);
      });
    }
    _auditionDrum(voiceIndex) {
      if (!this.project.activeTrackId) return;
      const eng = this.engine.trackEngines.get(this.project.activeTrackId);
      if (eng && eng.drum) {
        eng.drum.triggerDrum(voiceIndex, 100);
      }
    }
  };

  // js/ui/InspectorView.js
  var InspectorView = class {
    /**
     * @param {HTMLElement} container 
     * @param {AudioEngine} audioEngine 
     * @param {Project} project 
     */
    constructor(container, audioEngine, project) {
      this.container = container;
      this.engine = audioEngine;
      this.project = project;
      this.currentTab = "effects";
      this._render();
    }
    update() {
      this.renderAll();
    }
    _render() {
      this.container.innerHTML = `
            <div class="inspector-container">
                <!-- Sub-tabs Header -->
                <div class="inspector-tabs-header">
                    <button class="insp-tab-btn ${this.currentTab === "effects" ? "active" : ""}" data-tab="effects">\u{1F39B}\uFE0F Track Effects Rack</button>
                    <button class="insp-tab-btn ${this.currentTab === "synth" ? "active" : ""}" data-tab="synth" id="btnSynthTab">\u{1F3B9} Synth Parameters</button>
                </div>

                <!-- Tab Body Content -->
                <div class="inspector-body" id="inspectorBody"></div>
            </div>
        `;
      this.bodyEl = this.container.querySelector("#inspectorBody");
      this.synthTabBtn = this.container.querySelector("#btnSynthTab");
      this.container.querySelectorAll(".insp-tab-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          this.currentTab = e.currentTarget.dataset.tab;
          this.container.querySelectorAll(".insp-tab-btn").forEach((b) => b.classList.remove("active"));
          e.currentTarget.classList.add("active");
          this.renderAll();
        });
      });
      this.renderAll();
    }
    renderAll() {
      const track = this.project.getTrack(this.project.activeTrackId);
      if (!track) {
        this.bodyEl.innerHTML = '<div class="no-track-msg">Select a track to inspect effects and synth parameters.</div>';
        return;
      }
      if (track.type !== "synth") {
        this.synthTabBtn.style.display = "none";
        if (this.currentTab === "synth") this.currentTab = "effects";
      } else {
        this.synthTabBtn.style.display = "inline-flex";
      }
      this.container.querySelectorAll(".insp-tab-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.tab === this.currentTab);
      });
      if (this.currentTab === "effects") {
        this._renderEffectsRack(track);
      } else {
        this._renderSynthEditor(track);
      }
    }
    // -------------------------------------------------------------
    // TRACK EFFECTS RACK
    // -------------------------------------------------------------
    _renderEffectsRack(track) {
      const fx = track.effects;
      const eng = this.engine.trackEngines.get(track.id);
      this.bodyEl.innerHTML = `
            <div class="effects-rack-scroll">
                <!-- 1. DUAL FILTER & EQ -->
                <div class="fx-module-card ${!fx.hpfBypass || !fx.lpfBypass ? "enabled" : "bypassed"}">
                    <div class="fx-header">
                        <span class="fx-title">FILTER / EQ</span>
                        <button class="fx-power-btn ${!fx.hpfBypass || !fx.lpfBypass ? "active" : ""}" id="btnToggleFilter">PWR</button>
                    </div>
                    <div class="fx-content-grid">
                        <div class="fx-knob-col">
                            <span class="knob-title">HP FREQ</span>
                            <div class="knob-hpf"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">LP FREQ</span>
                            <div class="knob-lpf"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">RES / Q</span>
                            <div class="knob-lpf-q"></div>
                        </div>
                        <div class="fx-canvas-box">
                            <canvas class="filter-curve-canvas" id="filterCurveCanvas" width="120" height="60"></canvas>
                        </div>
                    </div>
                </div>

                <!-- 2. DISTORTION / SATURATION -->
                <div class="fx-module-card ${!fx.distortionBypass ? "enabled" : "bypassed"}">
                    <div class="fx-header">
                        <span class="fx-title">DISTORTION</span>
                        <button class="fx-power-btn ${!fx.distortionBypass ? "active" : ""}" id="btnToggleDist">PWR</button>
                    </div>
                    <div class="fx-content-grid">
                        <div class="fx-knob-col">
                            <span class="knob-title">DRIVE</span>
                            <div class="knob-dist-drive"></div>
                        </div>
                        <div class="fx-select-col">
                            <span class="knob-title">TYPE</span>
                            <select id="selectDistType" class="fx-select">
                                <option value="soft" ${fx.distortionType === "soft" ? "selected" : ""}>Soft Tube</option>
                                <option value="hard" ${fx.distortionType === "hard" ? "selected" : ""}>Hard Clip</option>
                                <option value="fuzz" ${fx.distortionType === "fuzz" ? "selected" : ""}>Fuzz Drive</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- 3. STEREO DELAY -->
                <div class="fx-module-card ${!fx.delayBypass ? "enabled" : "bypassed"}">
                    <div class="fx-header">
                        <span class="fx-title">STEREO DELAY</span>
                        <button class="fx-power-btn ${!fx.delayBypass ? "active" : ""}" id="btnToggleDelay">PWR</button>
                    </div>
                    <div class="fx-content-grid">
                        <div class="fx-knob-col">
                            <span class="knob-title">TIME</span>
                            <div class="knob-delay-time"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">FEEDBACK</span>
                            <div class="knob-delay-fb"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">WET MIX</span>
                            <div class="knob-delay-wet"></div>
                        </div>
                    </div>
                </div>

                <!-- 4. REVERB -->
                <div class="fx-module-card ${!fx.reverbBypass ? "enabled" : "bypassed"}">
                    <div class="fx-header">
                        <span class="fx-title">REVERB</span>
                        <button class="fx-power-btn ${!fx.reverbBypass ? "active" : ""}" id="btnToggleReverb">PWR</button>
                    </div>
                    <div class="fx-content-grid">
                        <div class="fx-knob-col">
                            <span class="knob-title">DECAY</span>
                            <div class="knob-reverb-decay"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">WET MIX</span>
                            <div class="knob-reverb-wet"></div>
                        </div>
                    </div>
                </div>

                <!-- 5. COMPRESSOR -->
                <div class="fx-module-card ${!fx.compBypass ? "enabled" : "bypassed"}">
                    <div class="fx-header">
                        <span class="fx-title">COMPRESSOR</span>
                        <button class="fx-power-btn ${!fx.compBypass ? "active" : ""}" id="btnToggleComp">PWR</button>
                    </div>
                    <div class="fx-content-grid">
                        <div class="fx-knob-col">
                            <span class="knob-title">THRESH</span>
                            <div class="knob-comp-thresh"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">RATIO</span>
                            <div class="knob-comp-ratio"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
      this.bodyEl.querySelector("#btnToggleFilter").addEventListener("click", () => {
        fx.hpfBypass = !fx.hpfBypass;
        fx.lpfBypass = fx.hpfBypass;
        if (eng) {
          eng.effects.setHPF(fx.hpfFreq, fx.hpfBypass);
          eng.effects.setLPF(fx.lpfFreq, fx.lpfBypass, fx.lpfQ);
        }
        this._renderEffectsRack(track);
      });
      new KnobControl(this.bodyEl.querySelector(".knob-hpf"), {
        min: 20,
        max: 2e3,
        value: fx.hpfFreq,
        defaultValue: 20,
        step: 10,
        unit: "Hz",
        onChange: (val) => {
          fx.hpfFreq = val;
          if (eng) eng.effects.setHPF(val, fx.hpfBypass);
          this._drawFilterCurve(track);
        }
      });
      new KnobControl(this.bodyEl.querySelector(".knob-lpf"), {
        min: 100,
        max: 2e4,
        value: fx.lpfFreq,
        defaultValue: 2e4,
        step: 50,
        unit: "Hz",
        onChange: (val) => {
          fx.lpfFreq = val;
          if (eng) eng.effects.setLPF(val, fx.lpfBypass, fx.lpfQ);
          this._drawFilterCurve(track);
        }
      });
      new KnobControl(this.bodyEl.querySelector(".knob-lpf-q"), {
        min: 0.1,
        max: 12,
        value: fx.lpfQ || 0.7,
        defaultValue: 0.7,
        step: 0.1,
        unit: "Q",
        onChange: (val) => {
          fx.lpfQ = val;
          if (eng) eng.effects.setLPF(fx.lpfFreq, fx.lpfBypass, val);
          this._drawFilterCurve(track);
        }
      });
      this._drawFilterCurve(track);
      this.bodyEl.querySelector("#btnToggleDist").addEventListener("click", () => {
        fx.distortionBypass = !fx.distortionBypass;
        if (eng) eng.effects.setDistortion(fx.distortionDrive, fx.distortionType, fx.distortionBypass);
        this._renderEffectsRack(track);
      });
      new KnobControl(this.bodyEl.querySelector(".knob-dist-drive"), {
        min: 0,
        max: 80,
        value: fx.distortionDrive,
        defaultValue: 0,
        step: 1,
        unit: "%",
        onChange: (val) => {
          fx.distortionDrive = val;
          if (eng) eng.effects.setDistortion(val, fx.distortionType, fx.distortionBypass);
        }
      });
      this.bodyEl.querySelector("#selectDistType").addEventListener("change", (e) => {
        fx.distortionType = e.target.value;
        if (eng) eng.effects.setDistortion(fx.distortionDrive, fx.distortionType, fx.distortionBypass);
      });
      this.bodyEl.querySelector("#btnToggleDelay").addEventListener("click", () => {
        fx.delayBypass = !fx.delayBypass;
        if (eng) eng.effects.setDelay(fx.delayTime, fx.delayFeedback, fx.delayWet, fx.delayBypass);
        this._renderEffectsRack(track);
      });
      new KnobControl(this.bodyEl.querySelector(".knob-delay-time"), {
        min: 0.05,
        max: 1,
        value: fx.delayTime,
        defaultValue: 0.35,
        step: 0.02,
        unit: "s",
        onChange: (val) => {
          fx.delayTime = val;
          if (eng) eng.effects.setDelay(val, fx.delayFeedback, fx.delayWet, fx.delayBypass);
        }
      });
      new KnobControl(this.bodyEl.querySelector(".knob-delay-fb"), {
        min: 0,
        max: 0.9,
        value: fx.delayFeedback,
        defaultValue: 0.3,
        step: 0.02,
        unit: "%",
        onChange: (val) => {
          fx.delayFeedback = val;
          if (eng) eng.effects.setDelay(fx.delayTime, val, fx.delayWet, fx.delayBypass);
        }
      });
      new KnobControl(this.bodyEl.querySelector(".knob-delay-wet"), {
        min: 0,
        max: 1,
        value: fx.delayWet,
        defaultValue: 0.3,
        step: 0.02,
        unit: "",
        onChange: (val) => {
          fx.delayWet = val;
          if (eng) eng.effects.setDelay(fx.delayTime, fx.delayFeedback, val, fx.delayBypass);
        }
      });
      this.bodyEl.querySelector("#btnToggleReverb").addEventListener("click", () => {
        fx.reverbBypass = !fx.reverbBypass;
        if (eng) eng.effects.setReverb(fx.reverbDecay, fx.reverbWet, fx.reverbBypass);
        this._renderEffectsRack(track);
      });
      new KnobControl(this.bodyEl.querySelector(".knob-reverb-decay"), {
        min: 0.2,
        max: 5,
        value: fx.reverbDecay,
        defaultValue: 2,
        step: 0.1,
        unit: "s",
        onChange: (val) => {
          fx.reverbDecay = val;
          if (eng) eng.effects.setReverb(val, fx.reverbWet, fx.reverbBypass);
        }
      });
      new KnobControl(this.bodyEl.querySelector(".knob-reverb-wet"), {
        min: 0,
        max: 1,
        value: fx.reverbWet,
        defaultValue: 0.25,
        step: 0.02,
        unit: "",
        onChange: (val) => {
          fx.reverbWet = val;
          if (eng) eng.effects.setReverb(fx.reverbDecay, val, fx.reverbBypass);
        }
      });
      this.bodyEl.querySelector("#btnToggleComp").addEventListener("click", () => {
        fx.compBypass = !fx.compBypass;
        if (eng) eng.effects.setCompressor(fx.compThreshold, fx.compRatio, fx.compBypass);
        this._renderEffectsRack(track);
      });
      new KnobControl(this.bodyEl.querySelector(".knob-comp-thresh"), {
        min: -40,
        max: 0,
        value: fx.compThreshold,
        defaultValue: -18,
        step: 1,
        unit: "dB",
        onChange: (val) => {
          fx.compThreshold = val;
          if (eng) eng.effects.setCompressor(val, fx.compRatio, fx.compBypass);
        }
      });
      new KnobControl(this.bodyEl.querySelector(".knob-comp-ratio"), {
        min: 1,
        max: 20,
        value: fx.compRatio,
        defaultValue: 4,
        step: 0.5,
        unit: ":1",
        onChange: (val) => {
          fx.compRatio = val;
          if (eng) eng.effects.setCompressor(fx.compThreshold, val, fx.compBypass);
        }
      });
    }
    _drawFilterCurve(track) {
      const canvas = this.bodyEl.querySelector("#filterCurveCanvas");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, w, h);
      const fx = track.effects;
      const hpfNorm = Math.log10(Math.max(20, fx.hpfFreq) / 20) / 3;
      const lpfNorm = Math.log10(Math.max(80, fx.lpfFreq) / 20) / 3;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.85);
      for (let x = 0; x <= w; x++) {
        const freqNorm = x / w;
        let resp = 1;
        if (!fx.hpfBypass && freqNorm < hpfNorm) {
          resp *= Math.pow(freqNorm / (hpfNorm || 1e-3), 2);
        }
        if (!fx.lpfBypass && freqNorm > lpfNorm) {
          resp *= Math.pow(1 - (freqNorm - lpfNorm) / (1 - lpfNorm || 1e-3), 2);
        }
        const y = h - resp * (h * 0.75) - 4;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    // -------------------------------------------------------------
    // SYNTHESIZER ENGINE EDITOR
    // -------------------------------------------------------------
    _renderSynthEditor(track) {
      const synth = track.synthPreset;
      const eng = this.engine.trackEngines.get(track.id);
      this.bodyEl.innerHTML = `
            <div class="synth-editor-scroll">
                <!-- OSCILLATOR 1 -->
                <div class="synth-section-card">
                    <div class="card-title">OSCILLATOR 1</div>
                    <div class="synth-params-row">
                        <div class="fx-select-col">
                            <span class="knob-title">WAVE</span>
                            <select id="selOsc1Type" class="fx-select">
                                <option value="sawtooth" ${synth.osc1Type === "sawtooth" ? "selected" : ""}>Sawtooth</option>
                                <option value="square" ${synth.osc1Type === "square" ? "selected" : ""}>Square</option>
                                <option value="triangle" ${synth.osc1Type === "triangle" ? "selected" : ""}>Triangle</option>
                                <option value="sine" ${synth.osc1Type === "sine" ? "selected" : ""}>Sine</option>
                            </select>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">OCTAVE</span>
                            <div class="knob-osc1-oct"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">DETUNE</span>
                            <div class="knob-osc1-detune"></div>
                        </div>
                    </div>
                </div>

                <!-- OSCILLATOR 2 & MIX -->
                <div class="synth-section-card">
                    <div class="card-title">OSCILLATOR 2</div>
                    <div class="synth-params-row">
                        <div class="fx-select-col">
                            <span class="knob-title">WAVE</span>
                            <select id="selOsc2Type" class="fx-select">
                                <option value="square" ${synth.osc2Type === "square" ? "selected" : ""}>Square</option>
                                <option value="sawtooth" ${synth.osc2Type === "sawtooth" ? "selected" : ""}>Sawtooth</option>
                                <option value="triangle" ${synth.osc2Type === "triangle" ? "selected" : ""}>Triangle</option>
                                <option value="sine" ${synth.osc2Type === "sine" ? "selected" : ""}>Sine</option>
                            </select>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">SEMI</span>
                            <div class="knob-osc2-semi"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">DETUNE</span>
                            <div class="knob-osc2-detune"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">OSC MIX</span>
                            <div class="knob-osc-mix"></div>
                        </div>
                    </div>
                </div>

                <!-- FILTER SECTION -->
                <div class="synth-section-card">
                    <div class="card-title">SYNTH FILTER</div>
                    <div class="synth-params-row">
                        <div class="fx-knob-col">
                            <span class="knob-title">CUTOFF</span>
                            <div class="knob-synth-cutoff"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">RESONANCE</span>
                            <div class="knob-synth-res"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">ENV AMT</span>
                            <div class="knob-synth-envamt"></div>
                        </div>
                    </div>
                </div>

                <!-- AMP ADSR ENVELOPE -->
                <div class="synth-section-card">
                    <div class="card-title">AMP ADSR ENVELOPE</div>
                    <div class="synth-params-row">
                        <div class="fx-knob-col">
                            <span class="knob-title">ATTACK</span>
                            <div class="knob-amp-a"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">DECAY</span>
                            <div class="knob-amp-d"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">SUSTAIN</span>
                            <div class="knob-amp-s"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">RELEASE</span>
                            <div class="knob-amp-r"></div>
                        </div>
                        <div class="fx-canvas-box">
                            <canvas class="adsr-curve-canvas" id="adsrCanvas" width="100" height="50"></canvas>
                        </div>
                    </div>
                </div>

                <!-- LFO & GLIDE -->
                <div class="synth-section-card">
                    <div class="card-title">LFO & GLIDE</div>
                    <div class="synth-params-row">
                        <div class="fx-select-col">
                            <span class="knob-title">TARGET</span>
                            <select id="selLfoTarget" class="fx-select">
                                <option value="cutoff" ${synth.lfoTarget === "cutoff" ? "selected" : ""}>Cutoff</option>
                                <option value="pitch" ${synth.lfoTarget === "pitch" ? "selected" : ""}>Pitch</option>
                                <option value="amp" ${synth.lfoTarget === "amp" ? "selected" : ""}>Tremolo</option>
                                <option value="none" ${synth.lfoTarget === "none" ? "selected" : ""}>None</option>
                            </select>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">RATE</span>
                            <div class="knob-lfo-rate"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">DEPTH</span>
                            <div class="knob-lfo-depth"></div>
                        </div>
                        <div class="fx-knob-col">
                            <span class="knob-title">GLIDE</span>
                            <div class="knob-synth-glide"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
      const applySynth = (key, val) => {
        synth[key] = val;
        if (eng && eng.synth) {
          eng.synth.setParam(key, val);
        }
      };
      this.bodyEl.querySelector("#selOsc1Type").addEventListener("change", (e) => applySynth("osc1Type", e.target.value));
      new KnobControl(this.bodyEl.querySelector(".knob-osc1-oct"), {
        min: -2,
        max: 2,
        value: synth.osc1Octave,
        defaultValue: 0,
        step: 1,
        unit: "oct",
        onChange: (v) => applySynth("osc1Octave", v)
      });
      new KnobControl(this.bodyEl.querySelector(".knob-osc1-detune"), {
        min: -50,
        max: 50,
        value: synth.osc1Detune,
        defaultValue: 0,
        step: 1,
        unit: "c",
        onChange: (v) => applySynth("osc1Detune", v)
      });
      this.bodyEl.querySelector("#selOsc2Type").addEventListener("change", (e) => applySynth("osc2Type", e.target.value));
      new KnobControl(this.bodyEl.querySelector(".knob-osc2-semi"), {
        min: -24,
        max: 24,
        value: synth.osc2Semi,
        defaultValue: 0,
        step: 1,
        unit: "st",
        onChange: (v) => applySynth("osc2Semi", v)
      });
      new KnobControl(this.bodyEl.querySelector(".knob-osc2-detune"), {
        min: -50,
        max: 50,
        value: synth.osc2Detune,
        defaultValue: 8,
        step: 1,
        unit: "c",
        onChange: (v) => applySynth("osc2Detune", v)
      });
      new KnobControl(this.bodyEl.querySelector(".knob-osc-mix"), {
        min: 0,
        max: 1,
        value: synth.oscMix,
        defaultValue: 0.4,
        step: 0.05,
        unit: "",
        onChange: (v) => applySynth("oscMix", v)
      });
      new KnobControl(this.bodyEl.querySelector(".knob-synth-cutoff"), {
        min: 60,
        max: 18e3,
        value: synth.filterCutoff,
        defaultValue: 2400,
        step: 50,
        unit: "Hz",
        onChange: (v) => applySynth("filterCutoff", v)
      });
      new KnobControl(this.bodyEl.querySelector(".knob-synth-res"), {
        min: 0.1,
        max: 15,
        value: synth.filterResonance,
        defaultValue: 3,
        step: 0.2,
        unit: "Q",
        onChange: (v) => applySynth("filterResonance", v)
      });
      new KnobControl(this.bodyEl.querySelector(".knob-synth-envamt"), {
        min: -1,
        max: 1,
        value: synth.filterEnvAmount,
        defaultValue: 0.5,
        step: 0.05,
        unit: "",
        onChange: (v) => applySynth("filterEnvAmount", v)
      });
      new KnobControl(this.bodyEl.querySelector(".knob-amp-a"), {
        min: 5e-3,
        max: 2,
        value: synth.ampAttack,
        defaultValue: 0.02,
        step: 0.01,
        unit: "s",
        onChange: (v) => {
          applySynth("ampAttack", v);
          this._drawADSRCurve(track);
        }
      });
      new KnobControl(this.bodyEl.querySelector(".knob-amp-d"), {
        min: 0.01,
        max: 3,
        value: synth.ampDecay,
        defaultValue: 0.25,
        step: 0.02,
        unit: "s",
        onChange: (v) => {
          applySynth("ampDecay", v);
          this._drawADSRCurve(track);
        }
      });
      new KnobControl(this.bodyEl.querySelector(".knob-amp-s"), {
        min: 0,
        max: 1,
        value: synth.ampSustain,
        defaultValue: 0.6,
        step: 0.02,
        unit: "",
        onChange: (v) => {
          applySynth("ampSustain", v);
          this._drawADSRCurve(track);
        }
      });
      new KnobControl(this.bodyEl.querySelector(".knob-amp-r"), {
        min: 0.01,
        max: 4,
        value: synth.ampRelease,
        defaultValue: 0.35,
        step: 0.02,
        unit: "s",
        onChange: (v) => {
          applySynth("ampRelease", v);
          this._drawADSRCurve(track);
        }
      });
      this._drawADSRCurve(track);
      this.bodyEl.querySelector("#selLfoTarget").addEventListener("change", (e) => applySynth("lfoTarget", e.target.value));
      new KnobControl(this.bodyEl.querySelector(".knob-lfo-rate"), {
        min: 0.1,
        max: 20,
        value: synth.lfoRate,
        defaultValue: 2.5,
        step: 0.1,
        unit: "Hz",
        onChange: (v) => applySynth("lfoRate", v)
      });
      new KnobControl(this.bodyEl.querySelector(".knob-lfo-depth"), {
        min: 0,
        max: 1,
        value: synth.lfoDepth,
        defaultValue: 0.15,
        step: 0.02,
        unit: "",
        onChange: (v) => applySynth("lfoDepth", v)
      });
      new KnobControl(this.bodyEl.querySelector(".knob-synth-glide"), {
        min: 0,
        max: 0.5,
        value: synth.glide,
        defaultValue: 0.02,
        step: 0.01,
        unit: "s",
        onChange: (v) => applySynth("glide", v)
      });
    }
    _drawADSRCurve(track) {
      const canvas = this.bodyEl.querySelector("#adsrCanvas");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, w, h);
      const s = track.synthPreset;
      const a = Math.max(0.01, s.ampAttack);
      const d = Math.max(0.01, s.ampDecay);
      const sus = Math.max(0, Math.min(1, s.ampSustain));
      const r = Math.max(0.01, s.ampRelease);
      const total = a + d + 0.3 + r;
      const xA = a / total * w;
      const xD = (a + d) / total * w;
      const xS = (a + d + 0.3) / total * w;
      const xR = w;
      const yTop = 5;
      const ySus = h - sus * (h - 10) - 5;
      const yBot = h - 4;
      ctx.beginPath();
      ctx.moveTo(0, yBot);
      ctx.lineTo(xA, yTop);
      ctx.lineTo(xD, ySus);
      ctx.lineTo(xS, ySus);
      ctx.lineTo(xR, yBot);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
      ctx.lineTo(0, yBot);
      ctx.fill();
    }
  };

  // js/ui/ModalManager.js
  var ModalManager = class {
    /**
     * @param {HTMLElement} rootContainer 
     * @param {AudioEngine} audioEngine 
     * @param {Project} project 
     * @param {Object} callbacks 
     */
    constructor(rootContainer, audioEngine, project, callbacks = {}) {
      this.root = rootContainer;
      this.engine = audioEngine;
      this.project = project;
      this.callbacks = callbacks;
      this._initToastContainer();
    }
    _initToastContainer() {
      let toastBox = document.getElementById("toastContainer");
      if (!toastBox) {
        toastBox = document.createElement("div");
        toastBox.id = "toastContainer";
        toastBox.className = "toast-container";
        document.body.appendChild(toastBox);
      }
      this.toastBox = toastBox;
    }
    /**
     * Displays a sleek DAW toast notification
     * @param {string} message 
     * @param {string} type 'info' | 'success' | 'warning' | 'error'
     * @param {number} durationMs 
     */
    showToast(message, type = "info", durationMs = 3e3) {
      const toast = document.createElement("div");
      toast.className = `daw-toast toast-${type}`;
      const icons = {
        info: "\u2139\uFE0F",
        success: "\u2713",
        warning: "\u26A0\uFE0F",
        error: "\u2715"
      };
      toast.innerHTML = `
            <span class="toast-icon">${icons[type] || "\u2139\uFE0F"}</span>
            <span class="toast-text">${message}</span>
        `;
      this.toastBox.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add("visible"));
      setTimeout(() => {
        toast.classList.remove("visible");
        setTimeout(() => toast.remove(), 250);
      }, durationMs);
    }
    _createModalShell(title, contentHtml) {
      const overlay = document.createElement("div");
      overlay.className = "modal-overlay";
      overlay.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-header">
                    <span class="modal-title">${title}</span>
                    <button class="modal-close-btn" title="Close (Esc)">\u2715</button>
                </div>
                <div class="modal-body">${contentHtml}</div>
            </div>
        `;
      const closeModal = () => {
        overlay.classList.remove("active");
        window.removeEventListener("keydown", onKeyDown);
        setTimeout(() => overlay.remove(), 200);
      };
      const onKeyDown = (e) => {
        if (e.key === "Escape") closeModal();
      };
      window.addEventListener("keydown", onKeyDown);
      overlay.querySelector(".modal-close-btn").addEventListener("click", closeModal);
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
      });
      this.root.appendChild(overlay);
      requestAnimationFrame(() => overlay.classList.add("active"));
      return { overlay, closeModal };
    }
    showNewProjectModal() {
      const templates = StorageManager.getTemplateList();
      const templatesHtml = templates.map((t, idx) => `
            <label class="template-card ${idx === 0 ? "selected" : ""}" data-id="${t.id}">
                <input type="radio" name="projTemplate" value="${t.id}" ${idx === 0 ? "checked" : ""} style="display: none;" />
                <div class="template-card-header">
                    <span class="template-name">${t.name}</span>
                    <span class="template-bpm-badge">${t.bpm} BPM</span>
                </div>
                <div class="template-desc">${t.desc}</div>
            </label>
        `).join("");
      const { overlay, closeModal } = this._createModalShell("New Project / Template", `
            <div class="modal-form-group">
                <label>Project Name</label>
                <input type="text" id="newProjName" class="modal-input" value="My New Session" />
            </div>
            
            <div class="templates-section">
                <label class="section-label">Select Studio Template</label>
                <div class="templates-grid">${templatesHtml}</div>
            </div>

            <div class="modal-actions-row">
                <button class="modal-btn" id="btnCancelNew">Cancel</button>
                <button class="modal-btn btn-primary" id="btnConfirmNew">Create Project</button>
            </div>
        `);
      overlay.querySelectorAll(".template-card").forEach((card) => {
        card.addEventListener("click", () => {
          overlay.querySelectorAll(".template-card").forEach((c) => c.classList.remove("selected"));
          card.classList.add("selected");
          const radio = card.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;
        });
      });
      overlay.querySelector("#btnCancelNew").addEventListener("click", closeModal);
      overlay.querySelector("#btnConfirmNew").addEventListener("click", () => {
        const name = overlay.querySelector("#newProjName").value.trim() || "Untitled Session";
        const templateId = overlay.querySelector('input[name="projTemplate"]:checked')?.value || "synthwave";
        if (this.callbacks.onTemplateSelected) {
          this.callbacks.onTemplateSelected(templateId, name);
        }
        this.showToast(`Loaded template: ${name}`, "success");
        closeModal();
      });
    }
    async showOpenProjectModal() {
      const projects = await StorageManager.listProjects();
      let listHtml = "";
      if (projects.length === 0) {
        listHtml = '<div class="no-projects-msg">No saved projects found in local browser storage.</div>';
      } else {
        listHtml = `<div class="project-list-items">` + projects.map((p) => {
          const dateStr = new Date(p.updatedAt).toLocaleString();
          return `
                    <div class="project-list-row" data-id="${p.id}">
                        <div class="proj-info">
                            <span class="proj-name">${p.name}</span>
                            <span class="proj-meta">${p.bpm} BPM \u2022 ${dateStr}</span>
                        </div>
                        <div class="proj-actions">
                            <button class="modal-btn-sm btn-load" data-id="${p.id}">Open</button>
                            <button class="modal-btn-sm btn-delete" data-id="${p.id}" title="Delete project">\u{1F5D1}\uFE0F</button>
                        </div>
                    </div>
                `;
        }).join("") + `</div>`;
      }
      const { overlay, closeModal } = this._createModalShell("Open Project", `
            <div class="open-projects-section">
                <div class="section-title">Saved Local Sessions</div>
                ${listHtml}
                <div class="modal-divider"></div>
                <div class="import-file-section">
                    <label class="modal-btn btn-primary btn-block">
                        \u{1F4E5} Import Project File (.audiodeck / .json)
                        <input type="file" id="modalImportInput" accept=".json,.audiodeck" style="display: none;" />
                    </label>
                </div>
            </div>
        `);
      overlay.querySelectorAll(".btn-load").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.currentTarget.dataset.id;
          const loaded = await StorageManager.loadProject(id, this.engine.sampleLibrary);
          if (loaded && this.callbacks.onProjectLoaded) {
            this.callbacks.onProjectLoaded(loaded);
            this.showToast(`Loaded session: ${loaded.name}`, "success");
          }
          closeModal();
        });
      });
      overlay.querySelectorAll(".btn-delete").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.currentTarget.dataset.id;
          if (confirm("Are you sure you want to delete this saved project?")) {
            await StorageManager.deleteProject(id);
            this.showToast("Project deleted", "info");
            closeModal();
            this.showOpenProjectModal();
          }
        });
      });
      overlay.querySelector("#modalImportInput").addEventListener("change", async (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          try {
            const imported = await StorageManager.importProjectJSON(files[0], this.engine.sampleLibrary);
            if (imported && this.callbacks.onProjectLoaded) {
              this.callbacks.onProjectLoaded(imported);
              this.showToast(`Imported project: ${imported.name}`, "success");
            }
            closeModal();
          } catch (err) {
            this.showToast("Import failed: " + err.message, "error");
          }
        }
      });
    }
    showSaveProjectModal() {
      const { overlay, closeModal } = this._createModalShell("Save Session", `
            <div class="modal-form-group">
                <label>Project Session Name</label>
                <input type="text" id="saveProjName" class="modal-input" value="${this.project.name}" />
            </div>
            <div class="modal-actions-row">
                <button class="modal-btn" id="btnExportJSON">\u{1F4E5} Download File (.audiodeck)</button>
                <button class="modal-btn btn-primary" id="btnSaveLocal">\u{1F4BE} Save to Browser</button>
            </div>
        `);
      overlay.querySelector("#btnExportJSON").addEventListener("click", () => {
        this.project.name = overlay.querySelector("#saveProjName").value.trim() || this.project.name;
        StorageManager.exportProjectJSON(this.project);
        this.showToast("Project file downloaded", "success");
        closeModal();
      });
      overlay.querySelector("#btnSaveLocal").addEventListener("click", async () => {
        this.project.name = overlay.querySelector("#saveProjName").value.trim() || this.project.name;
        const ok = await StorageManager.saveProject(this.project);
        if (ok) {
          this.showToast(`Session "${this.project.name}" saved to browser storage`, "success");
        } else {
          this.showToast("Could not save session to storage", "error");
        }
        closeModal();
      });
    }
    showExportWavModal() {
      const { overlay, closeModal } = this._createModalShell("Render & Export Master Audio (WAV)", `
            <div class="export-modal-body">
                <div class="export-options">
                    <label class="radio-option">
                        <input type="radio" name="exportRange" value="full" checked />
                        <span>Export Full Song Timeline</span>
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="exportRange" value="loop" />
                        <span>Export Loop Region (${this.project.loop.startBeat} to ${this.project.loop.endBeat} Beats)</span>
                    </label>
                </div>

                <div class="export-settings-row">
                    <div class="setting-item">
                        <span class="setting-lbl">Sample Rate</span>
                        <span class="setting-val">44.1 kHz (Studio PCM)</span>
                    </div>
                    <div class="setting-item">
                        <span class="setting-lbl">Channels</span>
                        <span class="setting-val">2 (Stereo Master)</span>
                    </div>
                    <div class="setting-item">
                        <span class="setting-lbl">Bit Depth</span>
                        <span class="setting-val">16-bit Integer</span>
                    </div>
                </div>

                <div class="render-progress-section" id="renderProgressSec" style="display: none;">
                    <span class="render-label" id="renderStatusLabel">Rendering audio graph...</span>
                    <div class="progress-bar-track">
                        <div class="progress-bar-fill" id="renderProgressFill"></div>
                    </div>
                </div>

                <div class="modal-actions-row">
                    <button class="modal-btn" id="btnCancelExport">Cancel</button>
                    <button class="modal-btn btn-primary" id="btnStartRender">\u26A1 Render & Download WAV</button>
                </div>
            </div>
        `);
      const btnStart = overlay.querySelector("#btnStartRender");
      const progressSec = overlay.querySelector("#renderProgressSec");
      const progressFill = overlay.querySelector("#renderProgressFill");
      const statusLabel = overlay.querySelector("#renderStatusLabel");
      overlay.querySelector("#btnCancelExport").addEventListener("click", closeModal);
      btnStart.addEventListener("click", async () => {
        const isLoopOnly = overlay.querySelector('input[name="exportRange"]:checked').value === "loop";
        btnStart.disabled = true;
        progressSec.style.display = "block";
        try {
          const wavBlob = await this.engine.renderProjectToWav(
            this.project,
            { loopOnly: isLoopOnly },
            (pct) => {
              progressFill.style.width = `${Math.round(pct * 100)}%`;
              statusLabel.textContent = `Offline Render: ${Math.round(pct * 100)}%`;
            }
          );
          statusLabel.textContent = "Render complete! Downloading audio...";
          const filename = (this.project.name.toLowerCase().replace(/[^a-z0-9]/g, "_") || "master_render") + ".wav";
          WavExporter.downloadBlob(wavBlob, filename);
          this.showToast(`Audio exported: ${filename}`, "success");
          setTimeout(() => closeModal(), 1e3);
        } catch (err) {
          console.error("WAV render failed:", err);
          statusLabel.textContent = "Render failed: " + err.message;
          btnStart.disabled = false;
          this.showToast("Render failed: " + err.message, "error");
        }
      });
    }
    showShortcutsModal() {
      this._createModalShell("Keyboard Shortcuts & Navigation", `
            <div class="shortcuts-grid">
                <div class="shortcut-row"><kbd>Space</kbd> <span>Play / Pause</span></div>
                <div class="shortcut-row"><kbd>Enter</kbd> <span>Stop & Return to Cue Point</span></div>
                <div class="shortcut-row"><kbd>L</kbd> <span>Toggle Loop Mode</span></div>
                <div class="shortcut-row"><kbd>1</kbd> / <kbd>2</kbd> <span>Pointer / Pen Draw Tool</span></div>
                <div class="shortcut-row"><kbd>3</kbd> / <kbd>4</kbd> <span>Split / Eraser Tool</span></div>
                <div class="shortcut-row"><kbd>Ctrl</kbd> + <kbd>Z</kbd> <span>Undo Project Action</span></div>
                <div class="shortcut-row"><kbd>Ctrl</kbd> + <kbd>Y</kbd> <span>Redo Project Action</span></div>
                <div class="shortcut-row"><kbd>Ctrl</kbd> + <kbd>D</kbd> <span>Duplicate Selected Clips</span></div>
                <div class="shortcut-row"><kbd>Ctrl</kbd> + <kbd>A</kbd> <span>Select All Clips / Notes</span></div>
                <div class="shortcut-row"><kbd>Delete</kbd> / <kbd>Backspace</kbd> <span>Delete Selected</span></div>
                <div class="shortcut-row"><kbd>S</kbd> <span>Split Clip at Playhead</span></div>
                <div class="shortcut-row"><kbd>+</kbd> / <kbd>\u2212</kbd> <span>Arrangement Zoom In / Out</span></div>
                <div class="shortcut-row"><kbd>Shift</kbd> + Drag <span>Fine-tune Parameter Dial</span></div>
                <div class="shortcut-row"><kbd>Double-Click</kbd> <span>Reset Knob to Center / Default</span></div>
            </div>
        `);
    }
  };

  // js/app.js
  var AudioDeckApp = class {
    constructor() {
      this.engine = new AudioEngine();
      this.project = null;
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
        await this.engine.init();
      } catch (e) {
        console.warn("AudioEngine init deferred:", e);
      }
      try {
        const savedProjects = await StorageManager.listProjects();
        if (savedProjects && savedProjects.length > 0) {
          const lastProj = await StorageManager.loadProject(savedProjects[0].id, this.engine.sampleLibrary);
          this.project = lastProj || StorageManager.createDemoProject(this.engine.sampleLibrary);
        } else {
          this.project = StorageManager.createDemoProject(this.engine.sampleLibrary);
        }
      } catch (e) {
        console.warn("StorageManager project load error, using default demo:", e);
        this.project = StorageManager.createDemoProject(this.engine.sampleLibrary);
      }
      try {
        this.project.tracks.forEach((track) => {
          this.engine.registerTrack(track);
        });
        this.engine.setBPM(this.project.bpm);
        this.engine.setLoop(this.project.loop.enabled, this.project.loop.startBeat, this.project.loop.endBeat);
      } catch (e) {
        console.warn("Track registration warning:", e);
      }
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
      this._initViews();
      this._setupProjectListeners();
      this._setupGlobalEvents();
      console.log("AudioDeck initialized successfully with project:", this.project.name);
    }
    _initViews() {
      const transportContainer = document.getElementById("transportContainer");
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
      const timelineContainer = document.getElementById("timelineContainer");
      this.timelineView = new TimelineView(
        timelineContainer,
        this.engine,
        this.project
      );
      const browserContainer = document.getElementById("browserContainer");
      this.browserView = new BrowserView(
        browserContainer,
        this.engine,
        this.project
      );
      const mixerContainer = document.getElementById("bottomMixerContainer");
      this.mixerView = new MixerView(
        mixerContainer,
        this.engine,
        this.project
      );
      const pianoRollContainer = document.getElementById("bottomPianoRollContainer");
      this.pianoRollView = new PianoRollView(
        pianoRollContainer,
        this.engine,
        this.project
      );
      const drumContainer = document.getElementById("bottomDrumContainer");
      this.drumSequencerView = new DrumSequencerView(
        drumContainer,
        this.engine,
        this.project
      );
      const inspectorContainer = document.getElementById("bottomInspectorContainer");
      this.inspectorView = new InspectorView(
        inspectorContainer,
        this.engine,
        this.project
      );
      this._setupBottomTabs();
      this._syncBottomViews();
    }
    _setupBottomTabs() {
      const tabBtns = document.querySelectorAll(".bottom-tab-btn");
      const containers = {
        mixer: document.getElementById("bottomMixerContainer"),
        pianoroll: document.getElementById("bottomPianoRollContainer"),
        drumsequencer: document.getElementById("bottomDrumContainer"),
        inspector: document.getElementById("bottomInspectorContainer")
      };
      tabBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const tab = e.currentTarget.getAttribute("data-tab");
          this.project.activeBottomTab = tab;
          tabBtns.forEach((b) => b.classList.toggle("active", b.getAttribute("data-tab") === tab));
          for (const [key, el] of Object.entries(containers)) {
            el.style.display = key === tab ? "block" : "none";
          }
          this._syncBottomViews();
        });
      });
      const initialTab = this.project.activeBottomTab || "mixer";
      tabBtns.forEach((b) => b.classList.toggle("active", b.getAttribute("data-tab") === initialTab));
      for (const [key, el] of Object.entries(containers)) {
        el.style.display = key === initialTab ? "block" : "none";
      }
    }
    _syncBottomViews() {
      const track = this.project.getTrack(this.project.activeTrackId) || this.project.tracks[0];
      if (!track) return;
      if (!this.project.activeTrackId) {
        this.project.activeTrackId = track.id;
      }
      if (this.project.activeBottomTab === "pianoroll") {
        let clip = this.project.findClip(this.project.activeClipId)?.clip;
        if (!clip || clip.type !== "synth") {
          clip = track.clips.find((c) => c.type === "synth") || this.project.tracks.flatMap((t) => t.clips).find((c) => c.type === "synth");
        }
        this.pianoRollView.setClip(clip);
      } else if (this.project.activeBottomTab === "drumsequencer") {
        let clip = this.project.findClip(this.project.activeClipId)?.clip;
        if (!clip || clip.type !== "drum") {
          clip = track.clips.find((c) => c.type === "drum") || this.project.tracks.flatMap((t) => t.clips).find((c) => c.type === "drum");
        }
        this.drumSequencerView.setClip(clip);
      } else if (this.project.activeBottomTab === "inspector") {
        this.inspectorView.update();
      }
    }
    _setupProjectListeners() {
      this.project.subscribe((changeType, detail) => {
        if (["track_added", "track_removed", "tracks_reordered"].includes(changeType)) {
          this.timelineView.renderTracks();
          this.mixerView.renderChannels();
        } else if (["clip_added", "clip_updated", "clip_split", "clips_deleted", "clips_duplicated", "clips_moved", "clip_resized"].includes(changeType)) {
          this.timelineView.renderClips();
          this._syncBottomViews();
        } else if (changeType === "active_track_changed") {
          this._syncBottomViews();
        } else if (changeType === "bottom_tab_changed") {
          const tab = detail.tab;
          const tabBtns = document.querySelectorAll(".bottom-tab-btn");
          tabBtns.forEach((b) => b.classList.toggle("active", b.getAttribute("data-tab") === tab));
          const containers = {
            mixer: document.getElementById("bottomMixerContainer"),
            pianoroll: document.getElementById("bottomPianoRollContainer"),
            drumsequencer: document.getElementById("bottomDrumContainer"),
            inspector: document.getElementById("bottomInspectorContainer")
          };
          for (const [key, el] of Object.entries(containers)) {
            el.style.display = key === tab ? "block" : "none";
          }
          this._syncBottomViews();
        } else if (changeType === "tempo_changed") {
          this.transportView.updateUI();
        } else if (changeType === "loop_changed") {
          this.timelineView.updateLoopRegion();
          this.transportView.updateUI();
        }
      });
    }
    _createNewProject(name, bpm) {
      this.engine.stop();
      this.project.tracks.forEach((tr) => this.engine.unregisterTrack(tr.id));
      this.project = new Project({
        name: name || "Untitled Project",
        bpm: bpm || 120
      });
      const drumTr = this.project.addTrack("drum", "Drums");
      const synthTr = this.project.addTrack("synth", "Synth Lead");
      const audioTr = this.project.addTrack("audio", "Audio Track");
      this.engine.registerTrack(drumTr);
      this.engine.registerTrack(synthTr);
      this.engine.registerTrack(audioTr);
      this.engine.setBPM(this.project.bpm);
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
      this.project.tracks.forEach((tr) => this.engine.unregisterTrack(tr.id));
      const tmpl = StorageManager.createTemplateProject(templateId, this.engine.sampleLibrary);
      if (name) tmpl.name = name;
      this.project = tmpl;
      this.project.tracks.forEach((tr) => this.engine.registerTrack(tr));
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
      this.project.tracks.forEach((tr) => this.engine.unregisterTrack(tr.id));
      this.project = loadedProject;
      this.project.tracks.forEach((tr) => this.engine.registerTrack(tr));
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
      if (!track || track.type !== "audio") {
        track = this.project.tracks.find((t) => t.type === "audio") || this.project.addTrack("audio", "Mic Recording");
        this.engine.registerTrack(track);
      }
      const beatSec = 60 / this.project.bpm;
      const durBeats = Math.max(1, result.audioBuffer.duration / beatSec);
      const playheadBeat = this.project.snapBeat(this.engine.secondsToBeats(this.engine.playheadPosition));
      const clip = track.addClip(new AudioClip({
        name: "Voice Recording",
        trackId: track.id,
        startBeat: playheadBeat,
        durationBeats: durBeats,
        audioBuffer: result.audioBuffer,
        color: track.color
      }));
      this.project.notify("clip_added", { track, clip });
    }
    _setupGlobalEvents() {
      const unlockAudio = async () => {
        console.log("Unlocking AudioDeck Engine...");
        try {
          await this.engine.ensureContext();
        } catch (err) {
          console.warn("AudioContext ensureContext failed:", err);
        }
        const banner2 = document.getElementById("welcomeOverlay");
        if (banner2) {
          banner2.classList.add("hidden");
          setTimeout(() => {
            if (banner2 && banner2.parentNode) banner2.remove();
          }, 300);
        }
      };
      const startBtn = document.getElementById("btnStartDeck");
      if (startBtn) {
        startBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          unlockAudio();
        });
      }
      const banner = document.getElementById("welcomeOverlay");
      if (banner) {
        banner.addEventListener("click", (e) => {
          unlockAudio();
        });
      }
      window.addEventListener("click", unlockAudio, { once: true });
      window.addEventListener("keydown", unlockAudio, { once: true });
      window.addEventListener("dragover", (e) => e.preventDefault());
      window.addEventListener("drop", async (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
          await this.engine.ensureContext();
          const file = files[0];
          if (file.type.startsWith("audio/") || file.name.match(/\.(wav|mp3|ogg|flac|aac)$/i)) {
            try {
              const arrayBuffer = await file.arrayBuffer();
              const audioBuffer = await this.engine.ctx.decodeAudioData(arrayBuffer);
              const track = this.project.getTrack(this.project.activeTrackId) || this.project.addTrack("audio", file.name.replace(/\.[^/.]+$/, ""));
              this.engine.registerTrack(track);
              const beatSec = 60 / this.project.bpm;
              const durBeats = Math.max(1, audioBuffer.duration / beatSec);
              const playheadBeat = this.project.snapBeat(this.engine.secondsToBeats(this.engine.playheadPosition));
              const clip = track.addClip(new AudioClip({
                type: "audio",
                name: file.name.replace(/\.[^/.]+$/, ""),
                trackId: track.id,
                startBeat: playheadBeat,
                durationBeats: durBeats,
                audioBuffer,
                color: track.color
              }));
              this.project.notify("clip_added", { track, clip });
            } catch (err) {
              console.error("Drop audio file failed:", err);
            }
          }
        }
      });
    }
  };
  var bootstrapAudioDeck = () => {
    const app = new AudioDeckApp();
    window.audiodeck = app;
    app.init();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrapAudioDeck);
  } else {
    bootstrapAudioDeck();
  }
})();
