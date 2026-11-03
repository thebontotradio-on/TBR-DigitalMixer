/**
 * TBR DIGITAL MIXER — Built-in Test Signal & Tone Generator
 * Provides reference test tones, noise curves, and simulated vocal/music loops
 */

class ToneGenerator {
  constructor(sampleRate = 48000) {
    this.sampleRate = sampleRate;
    this.type = 'OFF'; // 'SINE' | 'PINK_NOISE' | 'SWEEP' | 'VOCAL_SIM' | 'MUSIC_GROOVE' | 'OFF'
    this.freq = 1000;
    this.levelDb = -12;
    this.phase = 0;

    // Pink noise filter states (Paul Kellet's algorithm)
    this.b0 = 0; this.b1 = 0; this.b2 = 0; this.b3 = 0; this.b4 = 0; this.b5 = 0; this.b6 = 0;

    // Music groove step sequencer states
    this.grooveStep = 0;
    this.grooveSampleCount = 0;
    this.bpm = 120;
    this.stepSamples = Math.floor((60 / this.bpm / 4) * sampleRate);
  }

  setMode(type, freq = 1000, levelDb = -12) {
    this.type = type;
    this.freq = freq;
    this.levelDb = levelDb;
  }

  process(leftBuffer, rightBuffer) {
    if (this.type === 'OFF') return;

    const len = leftBuffer.length;
    const gainLin = Math.pow(10, this.levelDb / 20);
    const twoPi = 2 * Math.PI;

    switch (this.type) {
      case 'SINE': {
        const delta = (twoPi * this.freq) / this.sampleRate;
        for (let i = 0; i < len; i++) {
          const s = Math.sin(this.phase) * gainLin;
          leftBuffer[i] += s;
          rightBuffer[i] += s;
          this.phase += delta;
          if (this.phase >= twoPi) this.phase -= twoPi;
        }
        break;
      }

      case 'PINK_NOISE': {
        for (let i = 0; i < len; i++) {
          const white = Math.random() * 2 - 1;
          this.b0 = 0.99886 * this.b0 + white * 0.0555179;
          this.b1 = 0.99332 * this.b1 + white * 0.0750759;
          this.b2 = 0.96900 * this.b2 + white * 0.1538520;
          this.b3 = 0.86650 * this.b3 + white * 0.3104856;
          this.b4 = 0.55000 * this.b4 + white * 0.5329522;
          this.b5 = -0.7616 * this.b5 - white * 0.0168980;
          const pink = (this.b0 + this.b1 + this.b2 + this.b3 + this.b4 + this.b5 + this.b6 + white * 0.5362) * 0.11;
          this.b6 = white * 0.115926;

          const s = pink * gainLin;
          leftBuffer[i] += s;
          rightBuffer[i] += s;
        }
        break;
      }

      case 'SWEEP': {
        for (let i = 0; i < len; i++) {
          // Logarithmic sweep from 20Hz to 20kHz over 5 seconds
          const t = (this.phase % (5 * this.sampleRate)) / (5 * this.sampleRate);
          const currentFreq = 20 * Math.pow(1000, t);
          const s = Math.sin((twoPi * currentFreq * this.phase) / this.sampleRate) * gainLin;
          leftBuffer[i] += s;
          rightBuffer[i] += s;
          this.phase++;
        }
        break;
      }

      case 'VOCAL_SIM': {
        // Formant filtered vocal simulation mimicking speech vowels (A, E, I, O, U)
        const fundamental = 130; // Hz male voice fundamental
        const delta = (twoPi * fundamental) / this.sampleRate;
        for (let i = 0; i < len; i++) {
          // Pulse train + odd harmonics
          const pulse = (this.phase < Math.PI ? 1 : -1) * 0.6 + Math.sin(this.phase * 3) * 0.3 + Math.sin(this.phase * 5) * 0.1;
          const s = pulse * gainLin;
          leftBuffer[i] += s;
          rightBuffer[i] += s;
          this.phase += delta;
          if (this.phase >= twoPi) this.phase -= twoPi;
        }
        break;
      }

      case 'MUSIC_GROOVE': {
        // Synthesizes a kick, 808 sub, and hi-hat beat to test Horeg & Music presets
        for (let i = 0; i < len; i++) {
          this.grooveSampleCount++;
          if (this.grooveSampleCount >= this.stepSamples) {
            this.grooveSampleCount = 0;
            this.grooveStep = (this.grooveStep + 1) % 16;
          }

          let sL = 0;
          let sR = 0;

          // Kick on steps 0, 4, 8, 12 (Four-on-the-floor)
          if (this.grooveStep % 4 === 0) {
            const kickEnv = Math.max(0, 1.0 - this.grooveSampleCount / (this.stepSamples * 1.5));
            const kickFreq = 50 + kickEnv * 100;
            const kick = Math.sin((twoPi * kickFreq * this.grooveSampleCount) / this.sampleRate) * kickEnv;
            sL += kick * 1.2;
            sR += kick * 1.2;
          }

          // Sub bass groove on offbeats
          if (this.grooveStep === 2 || this.grooveStep === 6 || this.grooveStep === 10 || this.grooveStep === 14) {
            const bassEnv = Math.max(0, 1.0 - this.grooveSampleCount / this.stepSamples);
            const bass = Math.sin((twoPi * 45 * this.grooveSampleCount) / this.sampleRate) * bassEnv;
            sL += bass * 0.9;
            sR += bass * 0.9;
          }

          // Hi-hat on every step
          const hatEnv = Math.max(0, 1.0 - this.grooveSampleCount / (this.stepSamples * 0.25));
          const hat = (Math.random() * 2 - 1) * hatEnv * 0.25;
          sL += hat * 0.8;
          sR += hat * 1.2; // Stereo spread for hi-hat

          leftBuffer[i] += sL * gainLin;
          rightBuffer[i] += sR * gainLin;
        }
        break;
      }
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ToneGenerator };
}
