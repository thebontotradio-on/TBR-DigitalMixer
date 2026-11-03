/**
 * TBR DIGITAL MIXER — Biquad Filter Engine & Frequency Response Calculator
 * High-precision direct-form biquad filter implementations (Audio EQ Cookbook)
 */

class BiquadMath {
  static calculateCoefficients(type, freq, sampleRate, q = 0.7071, gainDb = 0) {
    const omega = (2 * Math.PI * freq) / sampleRate;
    const sinOmega = Math.sin(omega);
    const cosOmega = Math.cos(omega);
    const alpha = sinOmega / (2 * Math.max(0.001, q));
    const A = Math.pow(10, gainDb / 40);

    let b0 = 0, b1 = 0, b2 = 0, a0 = 1, a1 = 0, a2 = 0;

    switch (type) {
      case 'lowpass':
        b0 = (1 - cosOmega) / 2;
        b1 = 1 - cosOmega;
        b2 = (1 - cosOmega) / 2;
        a0 = 1 + alpha;
        a1 = -2 * cosOmega;
        a2 = 1 - alpha;
        break;

      case 'highpass':
        b0 = (1 + cosOmega) / 2;
        b1 = -(1 + cosOmega);
        b2 = (1 + cosOmega) / 2;
        a0 = 1 + alpha;
        a1 = -2 * cosOmega;
        a2 = 1 - alpha;
        break;

      case 'peaking':
        b0 = 1 + alpha * A;
        b1 = -2 * cosOmega;
        b2 = 1 - alpha * A;
        a0 = 1 + alpha / A;
        a1 = -2 * cosOmega;
        a2 = 1 - alpha / A;
        break;

      case 'lowshelf': {
        const sqrtA = Math.sqrt(A);
        const twoSqrtAAlpha = 2 * sqrtA * alpha;
        b0 = A * ((A + 1) - (A - 1) * cosOmega + twoSqrtAAlpha);
        b1 = 2 * A * ((A - 1) - (A + 1) * cosOmega);
        b2 = A * ((A + 1) - (A - 1) * cosOmega - twoSqrtAAlpha);
        a0 = (A + 1) + (A - 1) * cosOmega + twoSqrtAAlpha;
        a1 = -2 * ((A - 1) + (A + 1) * cosOmega);
        a2 = (A + 1) + (A - 1) * cosOmega - twoSqrtAAlpha;
        break;
      }

      case 'highshelf': {
        const sqrtA = Math.sqrt(A);
        const twoSqrtAAlpha = 2 * sqrtA * alpha;
        b0 = A * ((A + 1) + (A - 1) * cosOmega + twoSqrtAAlpha);
        b1 = -2 * A * ((A - 1) + (A + 1) * cosOmega);
        b2 = A * ((A + 1) + (A - 1) * cosOmega - twoSqrtAAlpha);
        a0 = (A + 1) - (A - 1) * cosOmega + twoSqrtAAlpha;
        a1 = 2 * ((A - 1) - (A + 1) * cosOmega);
        a2 = (A + 1) - (A - 1) * cosOmega - twoSqrtAAlpha;
        break;
      }

      case 'notch':
        b0 = 1;
        b1 = -2 * cosOmega;
        b2 = 1;
        a0 = 1 + alpha;
        a1 = -2 * cosOmega;
        a2 = 1 - alpha;
        break;

      default:
        b0 = 1; b1 = 0; b2 = 0; a0 = 1; a1 = 0; a2 = 0;
    }

    // Normalize by a0
    return {
      b0: b0 / a0,
      b1: b1 / a0,
      b2: b2 / a0,
      a1: a1 / a0,
      a2: a2 / a0
    };
  }

  /**
   * Evaluates the complex frequency response magnitude at a target frequency
   * @returns {number} Gain in dB
   */
  static getResponseAt(coeffs, freq, sampleRate) {
    const phi = (Math.PI * freq) / (sampleRate / 2);
    const cosPhi = Math.cos(phi);
    const cos2Phi = Math.cos(2 * phi);

    const num = coeffs.b0 * coeffs.b0 + coeffs.b1 * coeffs.b1 + coeffs.b2 * coeffs.b2 +
                2 * (coeffs.b0 * coeffs.b1 + coeffs.b1 * coeffs.b2) * cosPhi +
                2 * coeffs.b0 * coeffs.b2 * cos2Phi;

    const den = 1 + coeffs.a1 * coeffs.a1 + coeffs.a2 * coeffs.a2 +
                2 * (coeffs.a1 + coeffs.a1 * coeffs.a2) * cosPhi +
                2 * coeffs.a2 * cos2Phi;

    if (den <= 0 || num <= 0) return 0;
    const magSquared = num / den;
    return 10 * Math.log10(Math.max(1e-12, magSquared));
  }

  /**
   * Calculates the combined frequency response curve across log-spaced frequencies
   */
  static getCombinedResponse(bands, sampleRate = 48000, numPoints = 128) {
    const freqs = [];
    const minF = 20;
    const maxF = 20000;
    const step = Math.pow(maxF / minF, 1 / (numPoints - 1));

    for (let i = 0; i < numPoints; i++) {
      freqs.push(minF * Math.pow(step, i));
    }

    const response = new Float32Array(numPoints);

    bands.forEach(band => {
      if (!band.enabled) return;
      const coeffs = BiquadMath.calculateCoefficients(
        band.type,
        band.freq,
        sampleRate,
        band.q || 0.7071,
        band.gain || 0
      );

      for (let i = 0; i < numPoints; i++) {
        response[i] += BiquadMath.getResponseAt(coeffs, freqs[i], sampleRate);
      }
    });

    return { freqs, response };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BiquadMath };
}
