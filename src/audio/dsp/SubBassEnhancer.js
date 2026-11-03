/**
 * TBR DIGITAL MIXER — Sub-Bass Harmonic Synthesizer & Horeg Exciter
 * Generates controlled sub-octave energy and dynamic bass punch without distortion
 */

const { BiquadMath } = require('./BiquadFilter');

class SubBassEnhancer {
  constructor(sampleRate = 48000) {
    this.sampleRate = sampleRate;
    this.freq = 50;       // Center target bass freq (Hz)
    this.drive = 20;      // 0 - 100%
    this.blend = 25;      // 0 - 100%
    this.enabled = true;

    // Filters for isolating bass band and smoothing generated sub
    this.updateFilters();
    this.phase = 0;
  }

  updateFilters() {
    this.bandpass = BiquadMath.calculateCoefficients('peaking', this.freq, this.sampleRate, 1.2, 3.0);
    this.subLpf = BiquadMath.calculateCoefficients('lowpass', Math.min(120, this.freq * 1.8), this.sampleRate, 0.7071);

    this.bp_x1 = 0; this.bp_x2 = 0; this.bp_y1 = 0; this.bp_y2 = 0;
    this.lpf_x1 = 0; this.lpf_x2 = 0; this.lpf_y1 = 0; this.lpf_y2 = 0;
  }

  setParameters({ freq, drive, blend, enabled }) {
    if (freq !== undefined) {
      this.freq = Math.max(30, Math.min(120, freq));
      this.updateFilters();
    }
    if (drive !== undefined) this.drive = Math.max(0, Math.min(100, drive));
    if (blend !== undefined) this.blend = Math.max(0, Math.min(100, blend));
    if (enabled !== undefined) this.enabled = enabled;
  }

  process(buffer) {
    if (!this.enabled || this.blend === 0 || this.drive === 0) return;

    const len = buffer.length;
    const driveGain = 1.0 + (this.drive / 100) * 4.0;
    const blendRatio = (this.blend / 100) * 0.6;

    for (let i = 0; i < len; i++) {
      const x = buffer[i];

      // 1. Isolate bass band
      const bp = this.bandpass.b0 * x + this.bandpass.b1 * this.bp_x1 + this.bandpass.b2 * this.bp_x2
                 - this.bandpass.a1 * this.bp_y1 - this.bandpass.a2 * this.bp_y2;
      this.bp_x2 = this.bp_x1; this.bp_x1 = x;
      this.bp_y2 = this.bp_y1; this.bp_y1 = bp;

      // 2. Synthesize sub-octave fundamental via non-linear full-wave rectification
      const subHarmonic = Math.abs(bp) * driveGain - 0.5 * bp;

      // 3. Smooth with Low-Pass Filter
      const smoothedSub = this.subLpf.b0 * subHarmonic + this.subLpf.b1 * this.lpf_x1 + this.subLpf.b2 * this.lpf_x2
                          - this.subLpf.a1 * this.lpf_y1 - this.subLpf.a2 * this.lpf_y2;
      this.lpf_x2 = this.lpf_x1; this.lpf_x1 = subHarmonic;
      this.lpf_y2 = this.lpf_y1; this.lpf_y1 = smoothedSub;

      // 4. Blend into original signal with soft saturation
      buffer[i] = x + Math.tanh(smoothedSub) * blendRatio;
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SubBassEnhancer };
}
