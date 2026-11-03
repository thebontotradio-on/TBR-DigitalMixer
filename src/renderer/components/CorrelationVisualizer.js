/**
 * TBR DIGITAL MIXER — Stereo Correlation & Goniometer Visualizer
 */

class CorrelationVisualizer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.correlation = 1.0;
    this.animId = null;
  }

  setCorrelation(val) {
    this.correlation = Math.max(-1.0, Math.min(1.0, val));
  }

  render() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    // Goniometer / Phase Meter Bar
    const barY = h / 2 - 6;
    const barHeight = 12;

    // Background track
    ctx.fillStyle = '#161922';
    ctx.fillRect(10, barY, w - 20, barHeight);
    ctx.strokeStyle = '#2B3342';
    ctx.strokeRect(10, barY, w - 20, barHeight);

    // Center 0 line
    const centerX = w / 2;
    ctx.strokeStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(centerX, barY - 4);
    ctx.lineTo(centerX, barY + barHeight + 4);
    ctx.stroke();

    // Text labels: -1, 0, +1
    ctx.font = '8px monospace';
    ctx.fillStyle = '#64748B';
    ctx.fillText('-1', 10, barY + barHeight + 12);
    ctx.fillText('0', centerX - 3, barY + barHeight + 12);
    ctx.fillText('+1', w - 22, barY + barHeight + 12);

    // Pointer indicator
    // correlation -1 -> x = 10, 0 -> x = centerX, +1 -> x = w - 10
    const pointerX = centerX + this.correlation * (centerX - 10);

    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#EF4444');   // Out of phase Red
    grad.addColorStop(0.45, '#F59E0B'); // Warning Amber
    grad.addColorStop(0.55, '#00F0FF'); // Good In-phase Cyan
    grad.addColorStop(1, '#10B981');   // Mono Green

    ctx.fillStyle = grad;
    if (this.correlation >= 0) {
      ctx.fillRect(centerX, barY + 1, pointerX - centerX, barHeight - 2);
    } else {
      ctx.fillRect(pointerX, barY + 1, centerX - pointerX, barHeight - 2);
    }

    // Pointer line
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(pointerX - 1.5, barY - 2, 3, barHeight + 4);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CorrelationVisualizer };
}
