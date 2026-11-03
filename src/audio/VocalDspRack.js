/**
 * TBR DIGITAL MIXER — Broadcast Vocal DSP Rack
 * Chains: InputGain -> HPF -> NoiseGate -> 8-Band EQ -> DeEsser -> Compressor -> Saturation -> Presence -> Limiter -> OutputGain
 */

const { BiquadMath } = require('./dsp/BiquadFilter');
const { NoiseGate } = require('./dsp/NoiseGate');
const { DeEsser } = require('./dsp/DeEsser');
const { Saturation } = require('./dsp/Saturation');
const { MasterLimiter } = require('./dsp/MasterLimiter');

class VocalDspRack {
  constructor(sampleRate = 48000) {
    this.sampleRate = sampleRate;
    this.bypassed = false;
    this.activePresetId = 'broadcast-pro';

    // Modules
    this.gate = new NoiseGate(sampleRate);
    this.deEsser = new DeEsser(sampleRate);
    this.saturation = new Saturation(sampleRate);
    this.limiter = new MasterLimiter(sampleRate, 2.5);

    // Filter states for HPF and 8-band EQ
    this.hpfCoeffs = null;
    this.hpf_x1 = 0; this.hpf_x2 = 0; this.hpf_y1 = 0; this.hpf_y2 = 0;

    this.eqBands = [];
    this.eqStates = [];

    // Gains
    this.inputGainDb = 0;
    this.outputGainDb = 0;
    this.compGainReductionDb = 0;

    // Compressor settings
    this.comp = {
      enabled: true,
      threshold: -18,
      ratio: 3.5,
      attackMs: 8,
      releaseMs: 75,
      kneeDb: 4,
      makeupDb: 4.5,
      env: 0
    };

    // Presence settings
    this.presence = { enabled: true, freq: 3500, amount: 2.5 };
    this.presenceCoeffs = null;
    this.p_x1 = 0; this.p_x2 = 0; this.p_y1 = 0; this.p_y2 = 0;

    // Load initial default preset
    this.applyPreset(require('../presets/vocalPresets').VOCAL_PRESETS[0]);
  }

  applyPreset(preset, smoothMs = 20) {
    if (!preset) return;
    this.activePresetId = preset.id;

    // Input/Output gain
    this.inputGainDb = preset.inputGain || 0;
    this.outputGainDb = preset.outputGain || 0;

    // HPF
    if (preset.hpf && preset.hpf.enabled) {
      this.hpfCoeffs = BiquadMath.calculateCoefficients('highpass', preset.hpf.freq || 65, this.sampleRate, 0.7071);
    } else {
      this.hpfCoeffs = null;
    }

    // Gate
    if (preset.gate) {
      this.gate.setParameters(preset.gate);
    }

    // EQ Bands
    if (preset.eq && preset.eq.bands) {
      this.eqBands = preset.eq.bands.map(b => ({ ...b }));
      this.eqCoeffs = this.eqBands.map(b =>
        b.enabled ? BiquadMath.calculateCoefficients(b.type, b.freq, this.sampleRate, b.q, b.gain) : null
      );
      this.eqStates = this.eqBands.map(() => ({ x1: 0, x2: 0, y1: 0, y2: 0 }));
    }

    // De-Esser
    if (preset.deEsser) {
      this.deEsser.setParameters(preset.deEsser);
    }

    // Compressor
    if (preset.compressor) {
      this.comp.enabled = preset.compressor.enabled !== false;
      this.comp.threshold = preset.compressor.threshold || -18;
      this.comp.ratio = preset.compressor.ratio || 3.5;
      this.comp.attackMs = preset.compressor.attack || 8;
      this.comp.releaseMs = preset.compressor.release || 75;
      this.comp.kneeDb = preset.compressor.knee || 4;
      this.comp.makeupDb = preset.compressor.makeup || 4.5;
      this.compAttackCoeff = Math.exp(-1 / ((this.comp.attackMs / 1000) * this.sampleRate));
      this.compReleaseCoeff = Math.exp(-1 / ((this.comp.releaseMs / 1000) * this.sampleRate));
    }

    // Saturation
    if (preset.saturation) {
      this.saturation.setParameters(preset.saturation);
    }

    // Presence
    if (preset.presence && preset.presence.enabled && preset.presence.amount !== 0) {
      this.presence = { ...preset.presence };
      this.presenceCoeffs = BiquadMath.calculateCoefficients('peaking', this.presence.freq, this.sampleRate, 1.4, this.presence.amount);
    } else {
      this.presenceCoeffs = null;
    }

    // Limiter
    if (preset.limiter) {
      this.limiter.setParameters(preset.limiter);
    }
  }

  process(buffer) {
    if (this.bypassed) return;

    const len = buffer.length;
    const inGain = Math.pow(10, this.inputGainDb / 20);
    const outGain = Math.pow(10, this.outputGainDb / 20);

    // 1. Input Gain
    for (let i = 0; i < len; i++) {
      buffer[i] *= inGain;
    }

    // 2. High-Pass Filter
    if (this.hpfCoeffs) {
      for (let i = 0; i < len; i++) {
        const x = buffer[i];
        const y = this.hpfCoeffs.b0 * x + this.hpfCoeffs.b1 * this.hpf_x1 + this.hpfCoeffs.b2 * this.hpf_x2
                  - this.hpfCoeffs.a1 * this.hpf_y1 - this.hpfCoeffs.a2 * this.hpf_y2;
        this.hpf_x2 = this.hpf_x1; this.hpf_x1 = x;
        this.hpf_y2 = this.hpf_y1; this.hpf_y1 = y;
        buffer[i] = y;
      }
    }

    // 3. Noise Gate / Expander
    this.gate.process(buffer, buffer);

    // 4. 8-Band Parametric EQ
    if (this.eqCoeffs) {
      for (let b = 0; b < this.eqCoeffs.length; b++) {
        const c = this.eqCoeffs[b];
        if (!c) continue;
        const s = this.eqStates[b];
        for (let i = 0; i < len; i++) {
          const x = buffer[i];
          const y = c.b0 * x + c.b1 * s.x1 + c.b2 * s.x2 - c.a1 * s.y1 - c.a2 * s.y2;
          s.x2 = s.x1; s.x1 = x;
          s.y2 = s.y1; s.y1 = y;
          buffer[i] = y;
        }
      }
    }

    // 5. De-Esser
    this.deEsser.process(buffer, buffer);

    // 6. Broadcast Compressor
    if (this.comp.enabled) {
      const threshLin = Math.pow(10, this.comp.threshold / 20);
      const makeupLin = Math.pow(10, this.comp.makeupDb / 20);
      let maxReduction = 0;

      for (let i = 0; i < len; i++) {
        const x = buffer[i];
        const absX = Math.abs(x);

        if (absX > this.comp.env) {
          this.comp.env = this.compAttackCoeff * this.comp.env + (1 - this.compAttackCoeff) * absX;
        } else {
          this.comp.env = this.compReleaseCoeff * this.comp.env + (1 - this.compReleaseCoeff) * absX;
        }

        let gain = 1.0;
        if (this.comp.env > threshLin) {
          const envDb = 20 * Math.log10(this.comp.env);
          const excessDb = envDb - this.comp.threshold;
          const grDb = -excessDb * (1 - 1 / this.comp.ratio);
          gain = Math.pow(10, grDb / 20);
          if (grDb < maxReduction) maxReduction = grDb;
        }

        buffer[i] = x * gain * makeupLin;
      }
      this.compGainReductionDb = maxReduction;
    } else {
      this.compGainReductionDb = 0;
    }

    // 7. Saturation & Warmth
    this.saturation.process(buffer, buffer);

    // 8. Presence Enhancer
    if (this.presenceCoeffs) {
      for (let i = 0; i < len; i++) {
        const x = buffer[i];
        const y = this.presenceCoeffs.b0 * x + this.presenceCoeffs.b1 * this.p_x1 + this.presenceCoeffs.b2 * this.p_x2
                  - this.presenceCoeffs.a1 * this.p_y1 - this.presenceCoeffs.a2 * this.p_y2;
        this.p_x2 = this.p_x1; this.p_x1 = x;
        this.p_y2 = this.p_y1; this.p_y1 = y;
        buffer[i] = y;
      }
    }

    // 9. Output Gain
    for (let i = 0; i < len; i++) {
      buffer[i] *= outGain;
    }

    // 10. Vocal Limiter (Mono treated as stereo channels)
    this.limiter.process(buffer, buffer);
  }

  getMeters() {
    return {
      gateActive: this.gate.state === 'CLOSED',
      deEsserReduction: this.deEsser.getGainReductionDb(),
      compReduction: this.compGainReductionDb,
      limiterReduction: this.limiter.getGainReductionDb()
    };
  }

  getEqCurve() {
    return BiquadMath.getCombinedResponse(this.eqBands, this.sampleRate);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VocalDspRack };
}
