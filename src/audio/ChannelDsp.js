/**
 * TBR DIGITAL MIXER — Channel Strip DSP Model
 * Matches GP Mix Lite channel strip specifications
 */

const { BiquadMath } = require('./dsp/BiquadFilter');

class ChannelDsp {
  constructor(id, name, type = 'AUDIO_IN', sampleRate = 48000) {
    this.id = id;
    this.name = name;
    this.type = type; // 'AUDIO_IN' | 'GROUP' | 'AUX' | 'MASTER'
    this.sampleRate = sampleRate;

    // Routing & Gains
    this.inputGainDb = 0;       // -24 to +24 dB
    this.phaseInvert = false;   // Ø
    this.hpfFreq = 20;          // 20 - 500 Hz
    this.hpfEnabled = false;
    this.lpfFreq = 20000;       // 5000 - 20000 Hz
    this.lpfEnabled = false;

    // Fader & Controls
    this.faderDb = 0;           // -inf to +12 dB
    this.pan = 0;               // -100 (L) to +100 (R)
    this.stereoWidth = 100;     // 0% to 200%
    this.muted = false;
    this.soloed = false;
    this.safe = false;

    // Inserts (4 slots)
    this.inserts = [
      { id: 1, type: 'EQ', enabled: true, instance: null },
      { id: 2, type: 'Comp', enabled: true, instance: null },
      { id: 3, type: 'None', enabled: false, instance: null },
      { id: 4, type: 'Limiter', enabled: true, instance: null }
    ];

    // Aux Sends (4 sends: Chorus, Delay, Reverb, Harmonizer)
    this.sends = [
      { id: 'chorus', name: 'Chorus', levelDb: -60, preFader: false, muted: false },
      { id: 'delay', name: 'Delay', levelDb: -60, preFader: false, muted: false },
      { id: 'reverb', name: 'Reverb', levelDb: -60, preFader: false, muted: false },
      { id: 'harmonizer', name: 'Harmonizer', levelDb: -60, preFader: false, muted: false }
    ];

    // Output Destination
    this.outputDestination = 'Master'; // 'Master' | 'Group Master' | 'None'

    // Meters & Diagnostics
    this.meterPeakL = -100;
    this.meterPeakR = -100;
    this.meterRmsL = -100;
    this.meterRmsR = -100;
    this.clipL = false;
    this.clipR = false;
    this.meterSource = 'POST'; // 'PRE' | 'POST'

    this.updateFilters();
  }

  updateFilters() {
    if (this.hpfEnabled && this.hpfFreq > 20) {
      this.hpfCoeffs = BiquadMath.calculateCoefficients('highpass', this.hpfFreq, this.sampleRate, 0.7071);
    } else {
      this.hpfCoeffs = null;
    }

    if (this.lpfEnabled && this.lpfFreq < 20000) {
      this.lpfCoeffs = BiquadMath.calculateCoefficients('lowpass', this.lpfFreq, this.sampleRate, 0.7071);
    } else {
      this.lpfCoeffs = null;
    }

    this.hpf_x1L = 0; this.hpf_x2L = 0; this.hpf_y1L = 0; this.hpf_y2L = 0;
    this.hpf_x1R = 0; this.hpf_x2R = 0; this.hpf_y1R = 0; this.hpf_y2R = 0;

    this.lpf_x1L = 0; this.lpf_x2L = 0; this.lpf_y1L = 0; this.lpf_y2L = 0;
    this.lpf_x1R = 0; this.lpf_x2R = 0; this.lpf_y1R = 0; this.lpf_y2R = 0;
  }

  setFaderDb(val) {
    this.faderDb = Math.max(-100, Math.min(12, val));
  }

  setPan(val) {
    this.pan = Math.max(-100, Math.min(100, val));
  }

  process(leftBuffer, rightBuffer, sendOutputs = null) {
    const len = leftBuffer.length;
    const inGain = Math.pow(10, this.inputGainDb / 20) * (this.phaseInvert ? -1 : 1);

    // 1. Input Gain & Phase Invert
    for (let i = 0; i < len; i++) {
      leftBuffer[i] *= inGain;
      rightBuffer[i] *= inGain;
    }

    // 2. High-Pass Filter
    if (this.hpfCoeffs) {
      for (let i = 0; i < len; i++) {
        const xL = leftBuffer[i];
        const yL = this.hpfCoeffs.b0 * xL + this.hpfCoeffs.b1 * this.hpf_x1L + this.hpfCoeffs.b2 * this.hpf_x2L
                   - this.hpfCoeffs.a1 * this.hpf_y1L - this.hpfCoeffs.a2 * this.hpf_y2L;
        this.hpf_x2L = this.hpf_x1L; this.hpf_x1L = xL;
        this.hpf_y2L = this.hpf_y1L; this.hpf_y1L = yL;
        leftBuffer[i] = yL;

        const xR = rightBuffer[i];
        const yR = this.hpfCoeffs.b0 * xR + this.hpfCoeffs.b1 * this.hpf_x1R + this.hpfCoeffs.b2 * this.hpf_x2R
                   - this.hpfCoeffs.a1 * this.hpf_y1R - this.hpfCoeffs.a2 * this.hpf_y2R;
        this.hpf_x2R = this.hpf_x1R; this.hpf_x1R = xR;
        this.hpf_y2R = this.hpf_y1R; this.hpf_y1R = yR;
        rightBuffer[i] = yR;
      }
    }

    // 3. Low-Pass Filter
    if (this.lpfCoeffs) {
      for (let i = 0; i < len; i++) {
        const xL = leftBuffer[i];
        const yL = this.lpfCoeffs.b0 * xL + this.lpfCoeffs.b1 * this.lpf_x1L + this.lpfCoeffs.b2 * this.lpf_x2L
                   - this.lpfCoeffs.a1 * this.lpf_y1L - this.lpfCoeffs.a2 * this.lpf_y2L;
        this.lpf_x2L = this.lpf_x1L; this.lpf_x1L = xL;
        this.lpf_y2L = this.lpf_y1L; this.lpf_y1L = yL;
        leftBuffer[i] = yL;

        const xR = rightBuffer[i];
        const yR = this.lpfCoeffs.b0 * xR + this.lpfCoeffs.b1 * this.lpf_x1R + this.lpfCoeffs.b2 * this.lpf_x2R
                   - this.lpfCoeffs.a1 * this.lpf_y1R - this.lpfCoeffs.a2 * this.lpf_y2R;
        this.lpf_x2R = this.lpf_x1R; this.lpf_x1R = xR;
        this.lpf_y2R = this.lpf_y1R; this.lpf_y1R = yR;
        rightBuffer[i] = yR;
      }
    }

    // Pre-fader meter capture
    if (this.meterSource === 'PRE') {
      this.calculateMeter(leftBuffer, rightBuffer);
    }

    // 4. Pre-Fader Aux Sends
    if (sendOutputs) {
      this.processSends(leftBuffer, rightBuffer, sendOutputs, true);
    }

    // 5. Mute & Fader Level
    const faderGain = (this.muted || this.faderDb <= -90) ? 0 : Math.pow(10, this.faderDb / 20);

    // Pan Law (-3dB center pan law)
    const panNorm = this.pan / 100; // -1 to +1
    const angle = (panNorm + 1) * (Math.PI / 4);
    const panGainL = Math.cos(angle) * Math.SQRT2;
    const panGainR = Math.sin(angle) * Math.SQRT2;

    for (let i = 0; i < len; i++) {
      leftBuffer[i] *= faderGain * panGainL;
      rightBuffer[i] *= faderGain * panGainR;
    }

    // 6. Post-Fader Aux Sends
    if (sendOutputs) {
      this.processSends(leftBuffer, rightBuffer, sendOutputs, false);
    }

    // Post-fader meter capture
    if (this.meterSource === 'POST') {
      this.calculateMeter(leftBuffer, rightBuffer);
    }
  }

  processSends(leftBuffer, rightBuffer, sendOutputs, isPreFader) {
    const len = leftBuffer.length;
    for (let s = 0; s < this.sends.length; s++) {
      const send = this.sends[s];
      if (send.muted || send.preFader !== isPreFader || send.levelDb <= -59) continue;
      const targetBus = sendOutputs[send.id];
      if (!targetBus) continue;

      const sendGain = Math.pow(10, send.levelDb / 20);
      for (let i = 0; i < len; i++) {
        targetBus.left[i] += leftBuffer[i] * sendGain;
        targetBus.right[i] += rightBuffer[i] * sendGain;
      }
    }
  }

  calculateMeter(leftBuffer, rightBuffer) {
    let peakL = 0, peakR = 0, sumSqL = 0, sumSqR = 0;
    const len = leftBuffer.length;

    for (let i = 0; i < len; i++) {
      const absL = Math.abs(leftBuffer[i]);
      const absR = Math.abs(rightBuffer[i]);
      if (absL > peakL) peakL = absL;
      if (absR > peakR) peakR = absR;
      sumSqL += absL * absL;
      sumSqR += absR * absR;
    }

    // Clip detection (> 1.0 = 0 dBFS)
    if (peakL >= 0.999) this.clipL = true;
    if (peakR >= 0.999) this.clipR = true;

    const currentPeakDbL = peakL > 1e-5 ? 20 * Math.log10(peakL) : -100;
    const currentPeakDbR = peakR > 1e-5 ? 20 * Math.log10(peakR) : -100;

    const currentRmsDbL = sumSqL > 1e-8 ? 10 * Math.log10(sumSqL / len) : -100;
    const currentRmsDbR = sumSqR > 1e-8 ? 10 * Math.log10(sumSqR / len) : -100;

    // Decay smoothing for meters
    this.meterPeakL = Math.max(currentPeakDbL, this.meterPeakL - 1.5);
    this.meterPeakR = Math.max(currentPeakDbR, this.meterPeakR - 1.5);

    this.meterRmsL = Math.max(currentRmsDbL, this.meterRmsL - 0.8);
    this.meterRmsR = Math.max(currentRmsDbR, this.meterRmsR - 0.8);
  }

  resetClip() {
    this.clipL = false;
    this.clipR = false;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ChannelDsp };
}
