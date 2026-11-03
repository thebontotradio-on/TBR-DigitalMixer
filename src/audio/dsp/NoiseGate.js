/**
 * TBR DIGITAL MIXER — Precision Noise Gate & Expander
 * Real-time downward expansion with hysteresis and smooth envelope following
 */

class NoiseGate {
  constructor(sampleRate = 48000) {
    this.sampleRate = sampleRate;
    this.threshold = -45; // dB
    this.hysteresis = 3;  // dB
    this.ratio = 4.0;
    this.attack = 2.0;    // ms
    this.release = 80;    // ms
    this.hold = 40;       // ms
    this.enabled = true;

    // Internal state
    this.envelope = 0;
    this.gain = 1.0;
    this.holdTimer = 0;
    this.state = 'CLOSED'; // 'OPEN' | 'HOLD' | 'CLOSED'

    this.updateTimeConstants();
  }

  updateTimeConstants() {
    this.attackCoeff = Math.exp(-1 / ((this.attack / 1000) * this.sampleRate));
    this.releaseCoeff = Math.exp(-1 / ((this.release / 1000) * this.sampleRate));
    this.holdSamples = Math.floor((this.hold / 1000) * this.sampleRate);
  }

  setParameters({ threshold, ratio, attack, release, hold, enabled }) {
    if (threshold !== undefined) this.threshold = threshold;
    if (ratio !== undefined) this.ratio = ratio;
    if (attack !== undefined) this.attack = Math.max(0.1, attack);
    if (release !== undefined) this.release = Math.max(1, release);
    if (hold !== undefined) this.hold = Math.max(0, hold);
    if (enabled !== undefined) this.enabled = enabled;
    this.updateTimeConstants();
  }

  process(inputBuffer, outputBuffer) {
    if (!this.enabled) {
      if (inputBuffer !== outputBuffer) {
        outputBuffer.set(inputBuffer);
      }
      return;
    }

    const openThresholdLin = Math.pow(10, this.threshold / 20);
    const closeThresholdLin = Math.pow(10, (this.threshold - this.hysteresis) / 20);
    const len = inputBuffer.length;

    for (let i = 0; i < len; i++) {
      const input = inputBuffer[i];
      const absInput = Math.abs(input);

      // Peak detector
      if (absInput > this.envelope) {
        this.envelope = absInput;
      } else {
        this.envelope = this.envelope * 0.999 + absInput * 0.001;
      }

      // State machine
      if (this.envelope >= openThresholdLin) {
        this.state = 'OPEN';
        this.holdTimer = this.holdSamples;
      } else if (this.state === 'OPEN') {
        this.state = 'HOLD';
      }

      if (this.state === 'HOLD') {
        if (--this.holdTimer <= 0) {
          this.state = 'CLOSED';
        }
      }

      // Target gain calculation
      let targetGain = 1.0;
      if (this.state === 'CLOSED') {
        if (this.envelope < closeThresholdLin) {
          const envDb = 20 * Math.log10(Math.max(1e-6, this.envelope));
          const diffDb = this.threshold - envDb;
          const reductionDb = -diffDb * (this.ratio - 1);
          targetGain = Math.max(0, Math.pow(10, reductionDb / 20));
        }
      }

      // Smooth gain transitions
      if (targetGain > this.gain) {
        this.gain = this.attackCoeff * this.gain + (1 - this.attackCoeff) * targetGain;
      } else {
        this.gain = this.releaseCoeff * this.gain + (1 - this.releaseCoeff) * targetGain;
      }

      outputBuffer[i] = input * this.gain;
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NoiseGate };
}
