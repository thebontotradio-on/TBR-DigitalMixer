/**
 * TBR DIGITAL MIXER — High-Precision Long-Throw Vertical Fader
 */

class FaderComponent {
  constructor(container, options = {}) {
    this.container = container;
    this.minDb = -90;
    this.maxDb = 12;
    this.valDb = options.valDb !== undefined ? options.valDb : 0;
    this.onChange = options.onChange || null;

    this.init();
  }

  init() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'fader-track-container';

    this.wrapper.innerHTML = `
      <div class="fader-scale-ticks">
        <span>+12</span>
        <span>+6</span>
        <span>0</span>
        <span>-6</span>
        <span>-12</span>
        <span>-24</span>
        <span>-48</span>
        <span>-∞</span>
      </div>
      <div class="fader-groove">
        <div class="fader-cap">
          <div class="fader-cap-indicator"></div>
        </div>
      </div>
    `;

    this.capEl = this.wrapper.querySelector('.fader-cap');
    this.grooveEl = this.wrapper.querySelector('.fader-groove');

    this.setupEvents();
    this.updatePosition();
    this.container.appendChild(this.wrapper);
  }

  // Taper conversion: log audio fader feel (0dB at ~75% fader travel)
  dbToNorm(db) {
    if (db <= -90) return 0;
    if (db >= 12) return 1;
    if (db >= 0) {
      return 0.75 + (db / 12) * 0.25;
    } else {
      return 0.75 * Math.pow((db + 90) / 90, 1.8);
    }
  }

  normToDb(norm) {
    if (norm <= 0.01) return -90;
    if (norm >= 1.0) return 12;
    if (norm >= 0.75) {
      return ((norm - 0.75) / 0.25) * 12;
    } else {
      return Math.pow(norm / 0.75, 1 / 1.8) * 90 - 90;
    }
  }

  setupEvents() {
    let isDragging = false;

    const updateFromMouseY = (clientY) => {
      const rect = this.grooveEl.getBoundingClientRect();
      const bottom = rect.bottom;
      const height = rect.height;
      const norm = Math.max(0, Math.min(1, (bottom - clientY) / height));
      const db = this.normToDb(norm);
      this.setDb(db);
    };

    this.capEl.addEventListener('mousedown', (e) => {
      isDragging = true;
      e.preventDefault();

      const onMouseMove = (ev) => {
        if (!isDragging) return;
        updateFromMouseY(ev.clientY);
      };

      const onMouseUp = () => {
        isDragging = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });

    this.grooveEl.addEventListener('click', (e) => {
      updateFromMouseY(e.clientY);
    });

    // Double-click to reset to 0.0 dB unity
    this.capEl.addEventListener('dblclick', () => {
      this.setDb(0.0);
    });
  }

  setDb(db) {
    let clamped = Math.max(this.minDb, Math.min(this.maxDb, db));
    clamped = Math.round(clamped * 10) / 10;
    this.valDb = clamped;
    this.updatePosition();
    if (this.onChange) this.onChange(this.valDb);
  }

  updatePosition() {
    const norm = this.dbToNorm(this.valDb);
    const percent = norm * 100;
    this.capEl.style.bottom = `calc(${percent}% - 9px)`;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FaderComponent };
}
