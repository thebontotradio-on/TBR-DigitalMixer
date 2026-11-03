/**
 * TBR DIGITAL MIXER — Precision Broadcast De-Esser
 * Dynamic high-frequency sibilance suppression
 */

const { BiquadMath } = require('./BiquadFilter');

class DeEsser {
  constructor(sampleRate = 48000) {
    this.sampleRate = sampleRate;
    this.freq = 6000;         // Hz
    this.threshold = -20;     // dB
    this.reduction = -6.0;    // dB
    this.q = 2.0;
    this.enabled = true;

    this.attackMs = 1.0;
    this.releaseMs = 40.0;
    this.detectorEnv = 0;
    this.currentReduction = 0; // dB

    this.updateDetectorFilter();
    this.updateTimeConstants();
  }

  updateTimeConstants() {
    this.attackCoeff = Math.exp(-1 / ((this.attackMs / 1000) * this.sampleRate));
    this.releaseCoeff = Math.exp(-1 / ((this.releaseMs / 1000) * this.sampleRate));
  }

  updateDetectorFilter() {
    this.coeffs = BiquadMath.calculateCoefficients('peaking', this.freq, this.sampleRate, this.q, 6.0);
    this.x1 = 0; this.x2 = 0; this.y1 = 0; this.y2 = 0;
  }

  setParameters({ freq, threshold, reduction, q, enabled }) {
    if (freq !== undefined) this.freq = freq;
    if (threshold !== undefined) this.threshold = threshold;
    if (reduction !== undefined) this.reduction = reduction;
    if (q !== undefined) this.q = q;
    if (enabled !== undefined) this.enabled = enabled;
    this.updateDetectorFilter();
  }

  process(inputBuffer, outputBuffer) {
    if (!this.enabled) {
      if (inputBuffer !== outputBuffer) outputBuffer.set(inputBuffer);
      this.currentReduction = 0;
      return;
    }

    const len = inputBuffer.length;
    const threshLin = Math.pow(10, this.threshold / 20);

    for (let i = 0; i < len; i++) {
      const x = inputBuffer[i];

      // Sidechain bandpass filter
      const sc = this.coeffs.b0 * x + this.coeffs.b1 * this.x1 + this.coeffs.b2 * this.x2
                 - this.coeffs.a1 * this.y1 - this.coeffs.a2 * this.y2;
      this.x2 = this.x1; this.x1 = x;
      this.y2 = this.y1; this.y1 = sc;

      const scAbs = Math.abs(sc);

      // Fast envelope detector
      if (scAbs > this.detectorEnv) {
        this.detectorEnv = this.attackCoeff * this.detectorEnv + (1 - this.attackCoeff) * scAbs;
      } else {
        this.detectorEnv = this.releaseCoeff * this.detectorEnv + (1 - this.releaseCoeff) * scAbs;
      }

      // Compute dynamic reduction
      let gainMod = 1.0;
      if (this.detectorEnv > threshLin) {
        const excessDb = 20 * Math.log10(this.detectorEnv / threshLin);
        const redDb = Math.max(this.reduction, -excessDb * 1.5);
        this.currentReduction = redDb;
        gainMod = Math.pow(10, redDb / 20);
      } else {
        this.currentReduction = 0;
      }

      outputBuffer[i] = x * gainMod;
    }
  }

  getGainReductionDb() {
    return this.currentReduction;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DeEsser };
}
