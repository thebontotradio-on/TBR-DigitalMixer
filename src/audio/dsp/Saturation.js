/**
 * TBR DIGITAL MIXER — Analog Saturation Engine
 * Models Tube Triode, Analog Tape, and Console saturation
 */

class Saturation {
  constructor(sampleRate = 48000) {
    this.sampleRate = sampleRate;
    this.drive = 10;      // 0 - 100%
    this.warmth = 20;     // 0 - 100%
    this.type = 'tube';   // 'tube' | 'tape' | 'analog'
    this.mix = 30;        // 0 - 100%
    this.enabled = true;
  }

  setParameters({ drive, warmth, type, mix, enabled }) {
    if (drive !== undefined) this.drive = Math.max(0, Math.min(100, drive));
    if (warmth !== undefined) this.warmth = Math.max(0, Math.min(100, warmth));
    if (type !== undefined) this.type = type;
    if (mix !== undefined) this.mix = Math.max(0, Math.min(100, mix));
    if (enabled !== undefined) this.enabled = enabled;
  }

  process(inputBuffer, outputBuffer) {
    if (!this.enabled || this.mix === 0 || this.drive === 0) {
      if (inputBuffer !== outputBuffer) outputBuffer.set(inputBuffer);
      return;
    }

    const driveGain = 1.0 + (this.drive / 100) * 3.5;
    const warmthNorm = (this.warmth / 100) * 0.4;
    const wetRatio = this.mix / 100;
    const dryRatio = 1.0 - wetRatio;
    const len = inputBuffer.length;

    for (let i = 0; i < len; i++) {
      const dry = inputBuffer[i];
      let x = dry * driveGain;
      let saturated = 0;

      switch (this.type) {
        case 'tube':
          // Triode transfer function with 2nd harmonic asymmetry
          x += warmthNorm * (x * x);
          saturated = Math.tanh(x);
          break;

        case 'tape':
          // Symmetric magnetic tape saturation with 3rd harmonic compression
          saturated = (1.5 * x) / (1 + Math.abs(x * 0.8));
          if (saturated > 1.0) saturated = 1.0;
          if (saturated < -1.0) saturated = -1.0;
          break;

        case 'analog':
        default:
          // Smooth polynomial soft-clipper
          if (x > 1.5) saturated = 1.0;
          else if (x < -1.5) saturated = -1.0;
          else saturated = x - (x * x * x) / 4.5;
          break;
      }

      // Output normalization to prevent unwanted gain surge
      const compensated = saturated / Math.sqrt(driveGain);
      outputBuffer[i] = dry * dryRatio + compensated * wetRatio;
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Saturation };
}
