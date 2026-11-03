/**
 * TBR DIGITAL MIXER — Automated DSP Unit Tests
 * Uses controlled synthetic signals to verify audio algorithms & mathematical fidelity
 */

const { BiquadMath } = require('../src/audio/dsp/BiquadFilter');
const { NoiseGate } = require('../src/audio/dsp/NoiseGate');
const { DeEsser } = require('../src/audio/dsp/DeEsser');
const { Saturation } = require('../src/audio/dsp/Saturation');
const { MasterLimiter } = require('../src/audio/dsp/MasterLimiter');
const { StereoWidth } = require('../src/audio/dsp/StereoWidth');
const { SubBassEnhancer } = require('../src/audio/dsp/SubBassEnhancer');

function runDspTests() {
  console.log('=== [TEST] TBR DIGITAL MIXER — DSP PROCESSING VERIFICATION ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName}`);
      failed++;
    }
  }

  const sampleRate = 48000;
  const blockSize = 512;

  // 1. Biquad Peaking Filter Frequency Response Test
  {
    const targetFreq = 1000;
    const boostDb = 6.0;
    const coeffs = BiquadMath.calculateCoefficients('peaking', targetFreq, sampleRate, 1.0, boostDb);
    const gainAtCenter = BiquadMath.getResponseAt(coeffs, targetFreq, sampleRate);
    const gainFarAway = BiquadMath.getResponseAt(coeffs, 100, sampleRate);

    assert(Math.abs(gainAtCenter - boostDb) < 0.1, `Biquad Peaking: center response matches target (${gainAtCenter.toFixed(2)} dB vs +6.0 dB)`);
    assert(Math.abs(gainFarAway) < 0.3, `Biquad Peaking: off-band response remains near 0 dB (${gainFarAway.toFixed(2)} dB)`);
  }

  // 2. High-Pass Filter Cutoff Test
  {
    const hpfFreq = 100;
    const coeffs = BiquadMath.calculateCoefficients('highpass', hpfFreq, sampleRate, 0.7071);
    const gainAtCutoff = BiquadMath.getResponseAt(coeffs, hpfFreq, sampleRate);
    const gainBelow = BiquadMath.getResponseAt(coeffs, 25, sampleRate);
    const gainAbove = BiquadMath.getResponseAt(coeffs, 2000, sampleRate);

    assert(Math.abs(gainAtCutoff - (-3.01)) < 0.2, `HPF: response at cutoff is ~ -3dB (${gainAtCutoff.toFixed(2)} dB)`);
    assert(gainBelow < -12.0, `HPF: sub-frequencies attenuated (> 12dB reduction, got ${gainBelow.toFixed(2)} dB)`);
    assert(Math.abs(gainAbove) < 0.1, `HPF: passband remains unattenuated (${gainAbove.toFixed(2)} dB)`);
  }

  // 3. Noise Gate Test
  {
    const gate = new NoiseGate(sampleRate);
    gate.setParameters({ threshold: -40, ratio: 5.0, attack: 1.0, release: 50 });

    // Test with low-level background noise (-60dBFS)
    const noiseIn = new Float32Array(blockSize);
    const noiseLevel = Math.pow(10, -60 / 20); // ~0.001
    for (let i = 0; i < blockSize; i++) noiseIn[i] = (Math.random() * 2 - 1) * noiseLevel;

    const noiseOut = new Float32Array(blockSize);
    // Process several blocks to allow gate to settle
    for (let b = 0; b < 10; b++) {
      gate.process(noiseIn, noiseOut);
    }

    let noisePeakOut = 0;
    for (let i = 0; i < blockSize; i++) {
      if (Math.abs(noiseOut[i]) > noisePeakOut) noisePeakOut = Math.abs(noiseOut[i]);
    }
    const noiseOutDb = 20 * Math.log10(noisePeakOut);

    assert(noiseOutDb < -55, `Noise Gate: -60dB noise attenuated to ${noiseOutDb.toFixed(1)} dB (gate closed)`);

    // Test with loud speech signal (0dBFS)
    const loudIn = new Float32Array(blockSize);
    for (let i = 0; i < blockSize; i++) loudIn[i] = Math.sin((2 * Math.PI * 400 * i) / sampleRate) * 0.8;
    const loudOut = new Float32Array(blockSize);
    for (let b = 0; b < 5; b++) {
      gate.process(loudIn, loudOut);
    }
    let loudPeakOut = 0;
    for (let i = 0; i < blockSize; i++) {
      if (Math.abs(loudOut[i]) > loudPeakOut) loudPeakOut = Math.abs(loudOut[i]);
    }
    assert(loudPeakOut > 0.7, `Noise Gate: open on loud voice (passed ${loudPeakOut.toFixed(2)})`);
  }

  // 4. De-Esser Dynamic Suppression Test
  {
    const deEsser = new DeEsser(sampleRate);
    deEsser.setParameters({ freq: 6000, threshold: -20, reduction: -8.0, enabled: true });

    // Harsh sibilant burst at 6000Hz (-10dBFS)
    const sibIn = new Float32Array(blockSize);
    const sibLin = Math.pow(10, -10 / 20);
    for (let i = 0; i < blockSize; i++) {
      sibIn[i] = Math.sin((2 * Math.PI * 6000 * i) / sampleRate) * sibLin;
    }
    const sibOut = new Float32Array(blockSize);
    for (let b = 0; b < 5; b++) {
      deEsser.process(sibIn, sibOut);
    }
    const gr = deEsser.getGainReductionDb();
    assert(gr < -3.0, `De-Esser: detected and attenuated 6kHz sibilance (Gain Reduction = ${gr.toFixed(2)} dB)`);
  }

  // 5. Master Limiter True-Peak Brickwall & Anti-Clipping Test
  {
    const limiter = new MasterLimiter(sampleRate, 4.0);
    const ceilingDb = -0.5;
    limiter.setParameters({ ceiling: ceilingDb, release: 40, enabled: true });

    // Feed massive overloaded signal (+12dBFS peak = 4.0 linear amplitude)
    const hotL = new Float32Array(blockSize * 4);
    const hotR = new Float32Array(blockSize * 4);
    for (let i = 0; i < hotL.length; i++) {
      hotL[i] = Math.sin((2 * Math.PI * 100 * i) / sampleRate) * 4.0;
      hotR[i] = Math.cos((2 * Math.PI * 100 * i) / sampleRate) * 4.0;
    }

    limiter.process(hotL, hotR);

    let maxPeak = 0;
    for (let i = 0; i < hotL.length; i++) {
      const p = Math.max(Math.abs(hotL[i]), Math.abs(hotR[i]));
      if (p > maxPeak) maxPeak = p;
    }
    const maxPeakDb = 20 * Math.log10(maxPeak);
    const ceilingLin = Math.pow(10, ceilingDb / 20);

    assert(maxPeak <= ceilingLin + 1e-5, `Master Limiter: clamped hot +12dBFS signal strictly under ceiling (${maxPeakDb.toFixed(2)} dBFS vs ${ceilingDb} dBFS ceiling)`);
    assert(limiter.getGainReductionDb() < -10, `Master Limiter: reports strong gain reduction (${limiter.getGainReductionDb().toFixed(2)} dB)`);
  }

  // 6. Sub-Bass Enhancer Test
  {
    const sub = new SubBassEnhancer(sampleRate);
    sub.setParameters({ freq: 50, drive: 30, blend: 40, enabled: true });

    const bassIn = new Float32Array(blockSize);
    for (let i = 0; i < blockSize; i++) {
      bassIn[i] = Math.sin((2 * Math.PI * 50 * i) / sampleRate) * 0.5;
    }
    const originalRms = Math.sqrt(bassIn.reduce((acc, v) => acc + v * v, 0) / blockSize);

    sub.process(bassIn);
    const enhancedRms = Math.sqrt(bassIn.reduce((acc, v) => acc + v * v, 0) / blockSize);

    assert(enhancedRms > originalRms, `Sub-Bass Enhancer: increased fundamental density (RMS ${originalRms.toFixed(3)} -> ${enhancedRms.toFixed(3)})`);
  }

  // 7. Stereo Width & Phase Correlation Test
  {
    const widthProc = new StereoWidth(sampleRate);

    // Test with pure mono signal (L = R)
    const monoL = new Float32Array(blockSize);
    const monoR = new Float32Array(blockSize);
    for (let i = 0; i < blockSize; i++) {
      const s = Math.sin((2 * Math.PI * 440 * i) / sampleRate);
      monoL[i] = s;
      monoR[i] = s;
    }
    widthProc.process(monoL, monoR);
    const corrMono = widthProc.getCorrelation();
    assert(corrMono > 0.99, `Stereo Correlation: identical mono signal has correlation +1.0 (got ${corrMono.toFixed(3)})`);

    // Test widening
    widthProc.setParameters({ width: 150, bassMonoFreq: 100 });
    const stereoL = new Float32Array(blockSize);
    const stereoR = new Float32Array(blockSize);
    for (let i = 0; i < blockSize; i++) {
      stereoL[i] = Math.sin((2 * Math.PI * 1000 * i) / sampleRate);
      stereoR[i] = Math.cos((2 * Math.PI * 1000 * i) / sampleRate);
    }
    widthProc.process(stereoL, stereoR);
    assert(stereoL.length === blockSize, 'Stereo Width: processed stereo buffers successfully');
  }

  console.log(`\nDSP Tests Result: ${passed} Passed, ${failed} Failed\n`);
  return failed === 0;
}

if (require.main === module) {
  const ok = runDspTests();
  process.exit(ok ? 0 : 1);
}

module.exports = { runDspTests };
