/**
 * TBR DIGITAL MIXER — Professional Music Mastering DSP Rack
 * Chains: InputGain -> SubBass -> 8-Band EQ -> Multiband -> Saturation -> StereoWidth -> Limiter -> LUFS Meter
 */

const { BiquadMath } = require('./dsp/BiquadFilter');
const { SubBassEnhancer } = require('./dsp/SubBassEnhancer');
const { Saturation } = require('./dsp/Saturation');
const { StereoWidth } = require('./dsp/StereoWidth');
const { MasterLimiter } = require('./dsp/MasterLimiter');
const { LufsMeter } = require('./dsp/LufsMeter');

class MusicDspRack {
  constructor(sampleRate = 48000) {
    this.sampleRate = sampleRate;
    this.bypassed = false;
    this.activePresetId = 'music-master';

    // Modules
    this.subBassL = new SubBassEnhancer(sampleRate);
    this.subBassR = new SubBassEnhancer(sampleRate);

    this.saturationL = new Saturation(sampleRate);
    this.saturationR = new Saturation(sampleRate);

    this.stereoWidth = new StereoWidth(sampleRate);
    this.limiter = new MasterLimiter(sampleRate, 4.0);
    this.lufsMeter = new LufsMeter(sampleRate);

    // 8-Band EQ states
    this.eqBands = [];
    this.eqCoeffs = [];
    this.eqStatesL = [];
    this.eqStatesR = [];

    // Multiband Crossover Filters
    this.mbLowL = null; this.mbLowR = null;
    this.mbHighL = null; this.mbHighR = null;
    this.multibandGains = { lowLin: 1.0, midLin: 1.0, highLin: 1.0 };

    this.inputGainDb = 0;
    this.outputGainDb = 0;

    // Load initial default preset
    this.applyPreset(require('../presets/musicPresets').MUSIC_PRESETS[0]);
  }

  applyPreset(preset) {
    if (!preset) return;
    this.activePresetId = preset.id;

    this.inputGainDb = preset.inputGain || 0;
    this.outputGainDb = preset.outputGain || 0;

    // Sub-Bass Enhancer
    if (preset.subBass) {
      this.subBassL.setParameters(preset.subBass);
      this.subBassR.setParameters(preset.subBass);
    }

    // 8-Band Parametric EQ
    if (preset.eq && preset.eq.bands) {
      this.eqBands = preset.eq.bands.map(b => ({ ...b }));
      this.eqCoeffs = this.eqBands.map(b =>
        b.enabled ? BiquadMath.calculateCoefficients(b.type, b.freq, this.sampleRate, b.q, b.gain) : null
      );
      this.eqStatesL = this.eqBands.map(() => ({ x1: 0, x2: 0, y1: 0, y2: 0 }));
      this.eqStatesR = this.eqBands.map(() => ({ x1: 0, x2: 0, y1: 0, y2: 0 }));
    }

    // Multiband Crossover
    if (preset.multiband) {
      const lowX = preset.multiband.lowCrossover || 140;
      const highX = preset.multiband.highCrossover || 4200;
      this.mbLowCoeffs = BiquadMath.calculateCoefficients('lowpass', lowX, this.sampleRate, 0.7071);
      this.mbHighCoeffs = BiquadMath.calculateCoefficients('highpass', highX, this.sampleRate, 0.7071);

      this.mbLow_x1L = 0; this.mbLow_x2L = 0; this.mbLow_y1L = 0; this.mbLow_y2L = 0;
      this.mbLow_x1R = 0; this.mbLow_x2R = 0; this.mbLow_y1R = 0; this.mbLow_y2R = 0;

      this.mbHigh_x1L = 0; this.mbHigh_x2L = 0; this.mbHigh_y1L = 0; this.mbHigh_y2L = 0;
      this.mbHigh_x1R = 0; this.mbHigh_x2R = 0; this.mbHigh_y1R = 0; this.mbHigh_y2R = 0;

      this.multibandGains = {
        lowLin: Math.pow(10, (preset.multiband.lowGain || 0) / 20),
        midLin: Math.pow(10, (preset.multiband.midGain || 0) / 20),
        highLin: Math.pow(10, (preset.multiband.highGain || 0) / 20)
      };
    }

    // Saturation
    if (preset.saturation) {
      this.saturationL.setParameters(preset.saturation);
      this.saturationR.setParameters(preset.saturation);
    }

    // Stereo Width & Sub-Bass Anchor
    if (preset.stereoWidth) {
      this.stereoWidth.setParameters(preset.stereoWidth);
    }

    // Master Limiter & Anti-Clipping
    if (preset.limiter) {
      this.limiter.setParameters(preset.limiter);
    }
  }

  process(leftBuffer, rightBuffer) {
    if (this.bypassed) {
      this.lufsMeter.process(leftBuffer, rightBuffer);
      return;
    }

    const len = leftBuffer.length;
    const inGain = Math.pow(10, this.inputGainDb / 20);
    const outGain = Math.pow(10, this.outputGainDb / 20);

    // 1. Input Gain Staging
    for (let i = 0; i < len; i++) {
      leftBuffer[i] *= inGain;
      rightBuffer[i] *= inGain;
    }

    // 2. Sub-Bass Harmonic Synthesis
    this.subBassL.process(leftBuffer);
    this.subBassR.process(rightBuffer);

    // 3. 8-Band Mastering Parametric EQ
    if (this.eqCoeffs) {
      for (let b = 0; b < this.eqCoeffs.length; b++) {
        const c = this.eqCoeffs[b];
        if (!c) continue;
        const sL = this.eqStatesL[b];
        const sR = this.eqStatesR[b];

        for (let i = 0; i < len; i++) {
          const xL = leftBuffer[i];
          const yL = c.b0 * xL + c.b1 * sL.x1 + c.b2 * sL.x2 - c.a1 * sL.y1 - c.a2 * sL.y2;
          sL.x2 = sL.x1; sL.x1 = xL;
          sL.y2 = sL.y1; sL.y1 = yL;
          leftBuffer[i] = yL;

          const xR = rightBuffer[i];
          const yR = c.b0 * xR + c.b1 * sR.x1 + c.b2 * sR.x2 - c.a1 * sR.y1 - c.a2 * sR.y2;
          sR.x2 = sR.x1; sR.x1 = xR;
          sR.y2 = sR.y1; sR.y1 = yR;
          rightBuffer[i] = yR;
        }
      }
    }

    // 4. Multiband Balance (Low, Mid, High gains)
    if (this.mbLowCoeffs && this.mbHighCoeffs) {
      const g = this.multibandGains;
      for (let i = 0; i < len; i++) {
        const xL = leftBuffer[i];
        const lowL = this.mbLowCoeffs.b0 * xL + this.mbLowCoeffs.b1 * this.mbLow_x1L + this.mbLowCoeffs.b2 * this.mbLow_x2L
                     - this.mbLowCoeffs.a1 * this.mbLow_y1L - this.mbLowCoeffs.a2 * this.mbLow_y2L;
        this.mbLow_x2L = this.mbLow_x1L; this.mbLow_x1L = xL;
        this.mbLow_y2L = this.mbLow_y1L; this.mbLow_y1L = lowL;

        const highL = this.mbHighCoeffs.b0 * xL + this.mbHighCoeffs.b1 * this.mbHigh_x1L + this.mbHighCoeffs.b2 * this.mbHigh_x2L
                      - this.mbHighCoeffs.a1 * this.mbHigh_y1L - this.mbHighCoeffs.a2 * this.mbHigh_y2L;
        this.mbHigh_x2L = this.mbHigh_x1L; this.mbHigh_x1L = xL;
        this.mbHigh_y2L = this.mbHigh_y1L; this.mbHigh_y1L = highL;

        const midL = xL - lowL - highL;
        leftBuffer[i] = lowL * g.lowLin + midL * g.midLin + highL * g.highLin;

        // Right
        const xR = rightBuffer[i];
        const lowR = this.mbLowCoeffs.b0 * xR + this.mbLowCoeffs.b1 * this.mbLow_x1R + this.mbLowCoeffs.b2 * this.mbLow_x2R
                     - this.mbLowCoeffs.a1 * this.mbLow_y1R - this.mbLowCoeffs.a2 * this.mbLow_y2R;
        this.mbLow_x2R = this.mbLow_x1R; this.mbLow_x1R = xR;
        this.mbLow_y2R = this.mbLow_y1R; this.mbLow_y1R = lowR;

        const highR = this.mbHighCoeffs.b0 * xR + this.mbHighCoeffs.b1 * this.mbHigh_x1R + this.mbHighCoeffs.b2 * this.mbHigh_x2R
                      - this.mbHighCoeffs.a1 * this.mbHigh_y1R - this.mbHighCoeffs.a2 * this.mbHigh_y2R;
        this.mbHigh_x2R = this.mbHigh_x1R; this.mbHigh_x1R = xR;
        this.mbHigh_y2R = this.mbHigh_y1R; this.mbHigh_y1R = highR;

        const midR = xR - lowR - highR;
        rightBuffer[i] = lowR * g.lowLin + midR * g.midLin + highR * g.highLin;
      }
    }

    // 5. Analog Saturation
    this.saturationL.process(leftBuffer, leftBuffer);
    this.saturationR.process(rightBuffer, rightBuffer);

    // 6. Stereo Width & Bass Mono Centering
    this.stereoWidth.process(leftBuffer, rightBuffer);

    // 7. Output Gain Staging
    for (let i = 0; i < len; i++) {
      leftBuffer[i] *= outGain;
      rightBuffer[i] *= outGain;
    }

    // 8. True-Peak Brickwall Limiter & Anti-Clipping
    this.limiter.process(leftBuffer, rightBuffer);

    // 9. LUFS Measurement
    this.lufsMeter.process(leftBuffer, rightBuffer);
  }

  getMeters() {
    return {
      correlation: this.stereoWidth.getCorrelation(),
      limiterReduction: this.limiter.getGainReductionDb(),
      loudness: this.lufsMeter.getLoudness()
    };
  }

  getEqCurve() {
    return BiquadMath.getCombinedResponse(this.eqBands, this.sampleRate);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MusicDspRack };
}
