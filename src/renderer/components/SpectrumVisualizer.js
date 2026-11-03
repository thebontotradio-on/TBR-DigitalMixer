/**
 * TBR DIGITAL MIXER — Real-Time FFT Audio Spectrum Analyzer
 * High-definition visualizer reading live audio data
 */

class SpectrumVisualizer {
  constructor(canvas, analyserNode = null) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.analyser = analyserNode;
    this.fftSize = 256;
    this.frequencyData = new Uint8Array(this.fftSize / 2);
    this.peakData = new Float32Array(this.fftSize / 2);
    this.animId = null;

    if (this.analyser) {
      this.analyser.fftSize = this.fftSize;
      this.analyser.smoothingTimeConstant = 0.82;
    }
  }

  setAnalyser(analyserNode) {
    this.analyser = analyserNode;
    if (this.analyser) {
      this.analyser.fftSize = this.fftSize;
      this.analyser.smoothingTimeConstant = 0.82;
    }
  }

  start() {
    const draw = () => {
      this.render();
      this.animId = requestAnimationFrame(draw);
    };
    draw();
  }

  stop() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  render() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    if (this.analyser) {
      this.analyser.getByteFrequencyData(this.frequencyData);
    } else {
      // Gentle decay if no audio signal
      for (let i = 0; i < this.frequencyData.length; i++) {
        this.frequencyData[i] = Math.max(0, this.frequencyData[i] - 4);
      }
    }

    const bins = this.frequencyData.length;
    const barWidth = (w / bins) * 1.5;

    const gradient = ctx.createLinearGradient(0, h, 0, 0);
    gradient.addColorStop(0, '#10B981');   // Green
    gradient.addColorStop(0.5, '#00F0FF'); // Neon Cyan
    gradient.addColorStop(0.85, '#8A2BE2'); // Electric Purple
    gradient.addColorStop(1.0, '#FF3344');  // Clip Red

    for (let i = 0; i < bins; i++) {
      const val = this.frequencyData[i];
      const barHeight = (val / 255) * h;
      const x = i * (w / bins);

      // Peak hold falloff
      if (barHeight > this.peakData[i]) {
        this.peakData[i] = barHeight;
      } else {
        this.peakData[i] = Math.max(0, this.peakData[i] - 1.2);
      }

      // Bar fill
      ctx.fillStyle = gradient;
      ctx.fillRect(x, h - barHeight, barWidth - 1, barHeight);

      // Peak line
      if (this.peakData[i] > 2) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x, h - this.peakData[i], barWidth - 1, 1.5);
      }
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SpectrumVisualizer };
}
