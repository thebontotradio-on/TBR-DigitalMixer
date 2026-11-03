/**
 * TBR DIGITAL MIXER — ITU-R BS.1770 Loudness Meter (LUFS)
 * Provides Momentary, Short-Term, and Integrated Loudness measurement
 */

const { BiquadMath } = require('./BiquadFilter');

class LufsMeter {
  constructor(sampleRate = 48000) {
    this.sampleRate = sampleRate;

    // Stage 1: High-shelf filter (K-weighting head response)
    this.stage1L = BiquadMath.calculateCoefficients('highshelf', 1680, sampleRate, 0.7071, 4.0);
    this.stage1R = BiquadMath.calculateCoefficients('highshelf', 1680, sampleRate, 0.7071, 4.0);

    // Stage 2: High-pass RLB weighting filter
    this.stage2L = BiquadMath.calculateCoefficients('highpass', 98, sampleRate, 0.5);
    this.stage2R = BiquadMath.calculateCoefficients('highpass', 98, sampleRate, 0.5);

    // Filter states
    this.s1L_x1 = 0; this.s1L_x2 = 0; this.s1L_y1 = 0; this.s1L_y2 = 0;
    this.s1R_x1 = 0; this.s1R_x2 = 0; this.s1R_y1 = 0; this.s1R_y2 = 0;

    this.s2L_x1 = 0; this.s2L_x2 = 0; this.s2L_y1 = 0; this.s2L_y2 = 0;
    this.s2R_x1 = 0; this.s2R_x2 = 0; this.s2R_y1 = 0; this.s2R_y2 = 0;

    // Window integration
    this.momentaryWindowSamples = Math.floor(0.4 * sampleRate); // 400ms
    this.momentarySum = 0;
    this.momentaryCount = 0;
    this.momentaryLufs = -70;

    this.shortTermWindowSamples = Math.floor(3.0 * sampleRate); // 3 seconds
    this.shortTermBuffer = new Float32Array(Math.floor(this.shortTermWindowSamples / 128));
    this.shortTermIndex = 0;
    this.shortTermLufs = -70;

    this.integratedSum = 0;
    this.integratedCount = 0;
    this.integratedLufs = -70;
  }

  process(leftBuffer, rightBuffer) {
    const len = leftBuffer.length;
    let blockSum = 0;

    for (let i = 0; i < len; i++) {
      const l = leftBuffer[i];
      const r = rightBuffer[i];

      // K-weighting Stage 1 (High-shelf)
      const y1L = this.stage1L.b0 * l + this.stage1L.b1 * this.s1L_x1 + this.stage1L.b2 * this.s1L_x2
                  - this.stage1L.a1 * this.s1L_y1 - this.stage1L.a2 * this.s1L_y2;
      this.s1L_x2 = this.s1L_x1; this.s1L_x1 = l;
      this.s1L_y2 = this.s1L_y1; this.s1L_y1 = y1L;

      const y1R = this.stage1R.b0 * r + this.stage1R.b1 * this.s1R_x1 + this.stage1R.b2 * this.s1R_x2
                  - this.stage1R.a1 * this.s1R_y1 - this.stage1R.a2 * this.s1R_y2;
      this.s1R_x2 = this.s1R_x1; this.s1R_x1 = r;
      this.s1R_y2 = this.s1R_y1; this.s1R_y1 = y1R;

      // K-weighting Stage 2 (RLB High-pass)
      const y2L = this.stage2L.b0 * y1L + this.stage2L.b1 * this.s2L_x1 + this.stage2L.b2 * this.s2L_x2
                  - this.stage2L.a1 * this.s2L_y1 - this.stage2L.a2 * this.s2L_y2;
      this.s2L_x2 = this.s2L_x1; this.s2L_x1 = y1L;
      this.s2L_y2 = this.s2L_y1; this.s2L_y1 = y2L;

      const y2R = this.stage2R.b0 * y1R + this.stage2R.b1 * this.s2R_x1 + this.stage2R.b2 * this.s2R_x2
                  - this.stage2R.a1 * this.s2R_y1 - this.stage2R.a2 * this.s2R_y2;
      this.s2R_x2 = this.s2R_x1; this.s2R_x1 = y1R;
      this.s2R_y2 = this.s2R_y1; this.s2R_y1 = y2R;

      // Mean-square power sum
      const power = y2L * y2L + y2R * y2R;
      blockSum += power;
    }

    // Accumulate momentary
    this.momentarySum += blockSum;
    this.momentaryCount += len;

    if (this.momentaryCount >= this.momentaryWindowSamples) {
      const meanSquare = this.momentarySum / this.momentaryCount;
      if (meanSquare > 1e-10) {
        this.momentaryLufs = -0.691 + 10 * Math.log10(meanSquare);
      } else {
        this.momentaryLufs = -70;
      }
      this.momentarySum = 0;
      this.momentaryCount = 0;

      // Update short term ring buffer
      this.shortTermBuffer[this.shortTermIndex] = meanSquare;
      this.shortTermIndex = (this.shortTermIndex + 1) % this.shortTermBuffer.length;

      let stSum = 0;
      for (let k = 0; k < this.shortTermBuffer.length; k++) {
        stSum += this.shortTermBuffer[k];
      }
      const stMean = stSum / this.shortTermBuffer.length;
      this.shortTermLufs = stMean > 1e-10 ? -0.691 + 10 * Math.log10(stMean) : -70;

      // Update integrated (excluding extreme silence)
      if (this.momentaryLufs > -70) {
        this.integratedSum += meanSquare;
        this.integratedCount++;
        const intMean = this.integratedSum / this.integratedCount;
        this.integratedLufs = intMean > 1e-10 ? -0.691 + 10 * Math.log10(intMean) : -70;
      }
    }
  }

  getLoudness() {
    return {
      momentary: Math.max(-70, Math.min(0, this.momentaryLufs)),
      shortTerm: Math.max(-70, Math.min(0, this.shortTermLufs)),
      integrated: Math.max(-70, Math.min(0, this.integratedLufs))
    };
  }

  reset() {
    this.integratedSum = 0;
    this.integratedCount = 0;
    this.integratedLufs = -70;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LufsMeter };
}
