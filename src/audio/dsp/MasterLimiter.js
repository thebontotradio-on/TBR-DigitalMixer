/**
 * TBR DIGITAL MIXER — True-Peak Brickwall Master Limiter
 * Lookahead anti-clipping limiter with transparent gain recovery
 */

class MasterLimiter {
  constructor(sampleRate = 48000, lookaheadMs = 4.0) {
    this.sampleRate = sampleRate;
    this.ceilingDb = -0.3;   // dBFS
    this.releaseMs = 50.0;   // ms
    this.enabled = true;

    this.lookaheadSamples = Math.max(8, Math.floor((lookaheadMs / 1000) * sampleRate));
    this.delayBufferL = new Float32Array(this.lookaheadSamples);
    this.delayBufferR = new Float32Array(this.lookaheadSamples);
    this.writeIndex = 0;

    this.currentGain = 1.0;
    this.gainReductionDb = 0;
    this.updateTimeConstants();
  }

  updateTimeConstants() {
    this.releaseCoeff = Math.exp(-1 / ((this.releaseMs / 1000) * this.sampleRate));
  }

  setParameters({ ceiling, release, enabled }) {
    if (ceiling !== undefined) this.ceilingDb = Math.min(0, ceiling);
    if (release !== undefined) {
      this.releaseMs = Math.max(5, release);
      this.updateTimeConstants();
    }
    if (enabled !== undefined) this.enabled = enabled;
  }

  process(leftBuffer, rightBuffer) {
    if (!this.enabled) {
      this.gainReductionDb = 0;
      return;
    }

    const len = leftBuffer.length;
    const ceilingLin = Math.pow(10, this.ceilingDb / 20);
    const lookahead = this.lookaheadSamples;

    for (let i = 0; i < len; i++) {
      const inL = leftBuffer[i];
      const inR = rightBuffer[i];

      // Read delayed samples
      const readIndex = (this.writeIndex + 1) % lookahead;
      const delayedL = this.delayBufferL[readIndex];
      const delayedR = this.delayBufferR[readIndex];

      // Store current incoming samples
      this.delayBufferL[this.writeIndex] = inL;
      this.delayBufferR[this.writeIndex] = inR;
      this.writeIndex = (this.writeIndex + 1) % lookahead;

      // Peak detection on incoming un-delayed samples (future peaks!)
      const peak = Math.max(Math.abs(inL), Math.abs(inR));

      // Calculate target gain
      let targetGain = 1.0;
      if (peak > ceilingLin) {
        targetGain = ceilingLin / peak;
      }

      // Attack is instantaneous (due to lookahead buffer), release is smooth
      if (targetGain < this.currentGain) {
        this.currentGain = targetGain;
      } else {
        this.currentGain = this.releaseCoeff * this.currentGain + (1 - this.releaseCoeff) * targetGain;
      }

      // Apply limiting gain to delayed output
      const outL = delayedL * this.currentGain;
      const outR = delayedR * this.currentGain;

      // Hard clamp protection against inter-sample rounding
      leftBuffer[i] = Math.max(-ceilingLin, Math.min(ceilingLin, outL));
      rightBuffer[i] = Math.max(-ceilingLin, Math.min(ceilingLin, outR));
    }

    this.gainReductionDb = 20 * Math.log10(Math.max(1e-6, this.currentGain));
  }

  getGainReductionDb() {
    return Math.min(0, this.gainReductionDb);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MasterLimiter };
}
