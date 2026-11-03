/**
 * TBR DIGITAL MIXER — Mid-Side Stereo Spatial Processor
 * Controls stereo field expansion and anchors sub-bass frequencies to mono
 */

const { BiquadMath } = require('./BiquadFilter');

class StereoWidth {
  constructor(sampleRate = 48000) {
    this.sampleRate = sampleRate;
    this.width = 100;          // 0% (Mono) to 200% (Ultra Wide)
    this.bassMonoFreq = 120;   // Hz
    this.enabled = true;

    this.correlation = 1.0;
    this.updateBassFilter();
  }

  updateBassFilter() {
    // High-pass filter for the side channel (removes sub-bass from side channel)
    this.sideHpf = BiquadMath.calculateCoefficients('highpass', this.bassMonoFreq, this.sampleRate, 0.7071);
    this.s_x1 = 0; this.s_x2 = 0; this.s_y1 = 0; this.s_y2 = 0;
  }

  setParameters({ width, bassMonoFreq, enabled }) {
    if (width !== undefined) this.width = Math.max(0, Math.min(200, width));
    if (bassMonoFreq !== undefined) {
      this.bassMonoFreq = Math.max(20, Math.min(500, bassMonoFreq));
      this.updateBassFilter();
    }
    if (enabled !== undefined) this.enabled = enabled;
  }

  process(leftBuffer, rightBuffer) {
    if (!this.enabled) {
      this.computeCorrelation(leftBuffer, rightBuffer);
      return;
    }

    const widthGain = this.width / 100;
    const len = leftBuffer.length;

    let dotProduct = 0;
    let sumL2 = 0;
    let sumR2 = 0;

    for (let i = 0; i < len; i++) {
      const l = leftBuffer[i];
      const r = rightBuffer[i];

      // M/S Encoding
      const mid = (l + r) * 0.5;
      let side = (l - r) * 0.5;

      // Filter side channel (mono bass anchor)
      const filteredSide = this.sideHpf.b0 * side + this.sideHpf.b1 * this.s_x1 + this.sideHpf.b2 * this.s_x2
                          - this.sideHpf.a1 * this.s_y1 - this.sideHpf.a2 * this.s_y2;
      this.s_x2 = this.s_x1; this.s_x1 = side;
      this.s_y2 = this.s_y1; this.s_y1 = filteredSide;

      // Apply width multiplier to side channel
      const processedSide = filteredSide * widthGain;

      // M/S Decoding
      const outL = mid + processedSide;
      const outR = mid - processedSide;

      leftBuffer[i] = outL;
      rightBuffer[i] = outR;

      dotProduct += outL * outR;
      sumL2 += outL * outL;
      sumR2 += outR * outR;
    }

    // Phase Correlation: cos(theta) = (L . R) / (||L|| * ||R||)
    const norm = Math.sqrt(sumL2 * sumR2);
    if (norm > 1e-6) {
      this.correlation = dotProduct / norm;
    } else {
      this.correlation = 1.0;
    }
  }

  computeCorrelation(leftBuffer, rightBuffer) {
    let dot = 0, sumL = 0, sumR = 0;
    const len = leftBuffer.length;
    for (let i = 0; i < len; i++) {
      const l = leftBuffer[i], r = rightBuffer[i];
      dot += l * r;
      sumL += l * l;
      sumR += r * r;
    }
    const norm = Math.sqrt(sumL * sumR);
    this.correlation = norm > 1e-6 ? dot / norm : 1.0;
  }

  getCorrelation() {
    return Math.max(-1.0, Math.min(1.0, this.correlation));
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StereoWidth };
}
