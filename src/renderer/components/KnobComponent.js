/**
 * TBR DIGITAL MIXER — Precision Rotary Knob Component
 * Supports vertical dragging, double-click reset, numerical display, and SVG arc rendering
 */

class KnobComponent {
  constructor(container, options = {}) {
    this.container = container;
    this.label = options.label || 'GAIN';
    this.min = options.min !== undefined ? options.min : -24;
    this.max = options.max !== undefined ? options.max : 24;
    this.defaultVal = options.defaultVal !== undefined ? options.defaultVal : 0;
    this.val = options.val !== undefined ? options.val : this.defaultVal;
    this.unit = options.unit || 'dB';
    this.step = options.step || 0.5;
    this.size = options.size || 'small'; // 'small' | 'large'
    this.color = options.color || '#00F0FF';
    this.onChange = options.onChange || null;

    this.init();
  }

  init() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = `rotary-knob-container ${this.size}`;

    const dim = this.size === 'large' ? 44 : 28;
    const radius = this.size === 'large' ? 18 : 11;
    const center = dim / 2;

    this.circumference = 2 * Math.PI * radius * 0.75; // 270 degree arc

    this.wrapper.innerHTML = `
      <svg class="knob-svg" viewBox="0 0 ${dim} ${dim}">
        <circle class="knob-track" cx="${center}" cy="${center}" r="${radius}"
                stroke-dasharray="${this.circumference} ${this.circumference * 2}"
                transform="rotate(135 ${center} ${center})"/>
        <circle class="knob-arc" cx="${center}" cy="${center}" r="${radius}"
                style="stroke: ${this.color};"
                stroke-dasharray="0 ${this.circumference * 2}"
                transform="rotate(135 ${center} ${center})"/>
        <circle class="knob-center" cx="${center}" cy="${center}" r="${radius * 0.7}"/>
        <line class="knob-pointer" x1="${center}" y1="${center}" x2="${center}" y2="${center - radius * 0.6}"
              transform="rotate(0 ${center} ${center})"/>
      </svg>
      <div class="knob-label">${this.label}</div>
      <div class="knob-value">${this.formatValue()}</div>
    `;

    this.arcEl = this.wrapper.querySelector('.knob-arc');
    this.pointerEl = this.wrapper.querySelector('.knob-pointer');
    this.valueEl = this.wrapper.querySelector('.knob-value');

    this.setupEvents(dim);
    this.updateVisuals(dim);
    this.container.appendChild(this.wrapper);
  }

  setupEvents(dim) {
    let startY = 0;
    let startVal = 0;

    const onMouseDown = (e) => {
      startY = e.clientY;
      startVal = this.val;

      const onMouseMove = (ev) => {
        const dy = startY - ev.clientY;
        const range = this.max - this.min;
        const delta = (dy / 100) * range;
        this.setValue(startVal + delta);
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    this.wrapper.addEventListener('mousedown', onMouseDown);

    // Double-click to reset to default
    this.wrapper.addEventListener('dblclick', () => {
      this.setValue(this.defaultVal);
    });
  }

  setValue(newVal) {
    let clamped = Math.max(this.min, Math.min(this.max, newVal));
    if (this.step >= 1) clamped = Math.round(clamped);
    else clamped = Math.round(clamped / this.step) * this.step;

    if (this.val !== clamped) {
      this.val = clamped;
      this.updateVisuals(this.size === 'large' ? 44 : 28);
      if (this.onChange) this.onChange(this.val);
    }
  }

  updateVisuals(dim) {
    const center = dim / 2;
    const norm = (this.val - this.min) / (this.max - this.min);
    const strokeDash = norm * this.circumference;
    this.arcEl.style.strokeDasharray = `${strokeDash} ${this.circumference * 2}`;

    // Pointer rotation from -135deg to +135deg (total 270deg)
    const angle = -135 + norm * 270;
    this.pointerEl.setAttribute('transform', `rotate(${angle} ${center} ${center})`);

    this.valueEl.innerText = this.formatValue();
  }

  formatValue() {
    if (this.unit === 'dB') {
      return `${this.val > 0 ? '+' : ''}${this.val.toFixed(1)}`;
    } else if (this.unit === '%') {
      return `${Math.round(this.val)}%`;
    } else if (this.unit === 'Hz') {
      return this.val >= 1000 ? `${(this.val / 1000).toFixed(1)}k` : `${Math.round(this.val)}`;
    } else if (this.unit === 'ms') {
      return `${Math.round(this.val)}ms`;
    }
    return `${this.val}`;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { KnobComponent };
}
