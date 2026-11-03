/**
 * TBR DIGITAL MIXER — Interactive 8-Band Parametric EQ Visualizer
 * Renders real logarithmic frequency curves with interactive control points
 */

const { BiquadMath } = require('../../audio/dsp/BiquadFilter');

class EqCurveVisualizer {
  constructor(canvas, bands, onBandChange = null) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.bands = bands || [];
    this.onBandChange = onBandChange;

    this.minFreq = 20;
    this.maxFreq = 20000;
    this.minDb = -18;
    this.maxDb = 18;

    this.draggingBandIndex = -1;
    this.setupMouseEvents();
    this.render();
  }

  setBands(bands) {
    this.bands = bands;
    this.render();
  }

  freqToX(freq, width) {
    const logMin = Math.log10(this.minFreq);
    const logMax = Math.log10(this.maxFreq);
    const logF = Math.log10(Math.max(this.minFreq, Math.min(this.maxFreq, freq)));
    return ((logF - logMin) / (logMax - logMin)) * width;
  }

  xToFreq(x, width) {
    const logMin = Math.log10(this.minFreq);
    const logMax = Math.log10(this.maxFreq);
    const norm = Math.max(0, Math.min(1, x / width));
    return Math.pow(10, logMin + norm * (logMax - logMin));
  }

  dbToY(db, height) {
    const norm = (db - this.minDb) / (this.maxDb - this.minDb);
    return (1 - norm) * height;
  }

  yToDb(y, height) {
    const norm = 1 - (y / height);
    return this.minDb + norm * (this.maxDb - this.minDb);
  }

  setupMouseEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);

      for (let i = 0; i < this.bands.length; i++) {
        const b = this.bands[i];
        if (!b.enabled) continue;
        const bx = this.freqToX(b.freq, this.canvas.width);
        const by = this.dbToY(b.gain || 0, this.canvas.height);
        const dist = Math.hypot(x - bx, y - by);
        if (dist < 10) {
          this.draggingBandIndex = i;
          break;
        }
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.draggingBandIndex === -1) return;
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);

      const band = this.bands[this.draggingBandIndex];
      band.freq = Math.round(this.xToFreq(x, this.canvas.width));
      band.gain = Math.round(this.yToDb(y, this.canvas.height) * 10) / 10;
      band.gain = Math.max(-18, Math.min(18, band.gain));

      this.render();
      if (this.onBandChange) this.onBandChange(this.draggingBandIndex, band);
    });

    window.addEventListener('mouseup', () => {
      this.draggingBandIndex = -1;
    });
  }

  render() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    // 1. Grid Background
    ctx.strokeStyle = '#1E232D';
    ctx.lineWidth = 1;

    // Horizontal dB lines (-12, -6, 0, +6, +12)
    const dbLines = [-12, -6, 0, 6, 12];
    ctx.font = '8px sans-serif';
    ctx.fillStyle = '#475569';

    dbLines.forEach(db => {
      const y = this.dbToY(db, h);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
      ctx.fillText(`${db > 0 ? '+' : ''}${db}dB`, 4, y - 2);
    });

    // Vertical Frequency lines (50Hz, 100Hz, 250Hz, 1kHz, 5kHz, 10kHz)
    const fLines = [50, 100, 250, 500, 1000, 2500, 5000, 10000, 20000];
    fLines.forEach(f => {
      const x = this.freqToX(f, w);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
      const label = f >= 1000 ? `${f / 1000}k` : `${f}`;
      ctx.fillText(label, x + 2, h - 4);
    });

    // 0dB Center Reference Line
    ctx.strokeStyle = '#2B3342';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, this.dbToY(0, h));
    ctx.lineTo(w, this.dbToY(0, h));
    ctx.stroke();

    // 2. Compute and Draw Composite Frequency Response Curve
    const numPoints = 200;
    const { freqs, response } = BiquadMath.getCombinedResponse(this.bands, 48000, numPoints);

    // Gradient fill under curve
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
    gradient.addColorStop(1, 'rgba(0, 240, 255, 0.0)');

    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
      const x = this.freqToX(freqs[i], w);
      const y = this.dbToY(response[i], h);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(w, this.dbToY(0, h));
    ctx.lineTo(0, this.dbToY(0, h));
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Curve Line
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
      const x = this.freqToX(freqs[i], w);
      const y = this.dbToY(response[i], h);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 3. Draw Interactive Band Handles
    this.bands.forEach((b, idx) => {
      if (!b.enabled) return;
      const x = this.freqToX(b.freq, w);
      const y = this.dbToY(b.gain || 0, h);

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = idx === this.draggingBandIndex ? '#FFFFFF' : '#00F0FF';
      ctx.fill();
      ctx.strokeStyle = '#121417';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Band number badge
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '8px sans-serif';
      ctx.fillText(`${idx + 1}`, x - 2, y - 8);
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EqCurveVisualizer };
}
