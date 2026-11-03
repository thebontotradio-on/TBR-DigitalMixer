/**
 * TBR DIGITAL MIXER — Channel Strip UI Component
 * Assembles all channel controls into a single high-performance strip
 */

const { KnobComponent } = require('./KnobComponent');
const { FaderComponent } = require('./FaderComponent');

class ChannelStripComponent {
  constructor(container, channelDsp, options = {}) {
    this.container = container;
    this.dsp = channelDsp;
    this.color = options.color || '#00F0FF';
    this.icon = options.icon || '🎙️';
    this.onSelect = options.onSelect || null;
    this.onOpenFx = options.onOpenFx || null;

    this.init();
  }

  init() {
    this.el = document.createElement('div');
    this.el.className = 'channel-strip';
    this.el.dataset.id = this.dsp.id;

    this.el.innerHTML = `
      <div class="strip-color-bar" style="background-color: ${this.color};"></div>
      
      <div class="strip-header">
        <div class="strip-title-area">
          <span class="strip-icon">${this.icon}</span>
          <span class="strip-name" title="${this.dsp.name}">${this.dsp.name}</span>
        </div>
        <button class="strip-menu-btn" title="Channel Menu">⋮</button>
      </div>

      <div class="strip-routing-section">
        <select class="input-select" title="Input Source">
          <option value="Input 1">In 1: Mic / USB</option>
          <option value="Input 2">In 2: VB-CABLE</option>
          <option value="Input 3">In 3: Voicemeeter</option>
          <option value="Stereo Mix">In 4: Stereo Mix</option>
        </select>
        <div class="routing-knobs-row">
          <div class="gain-knob-container"></div>
          <button class="toggle-phase" title="Invert Phase (Ø)">Ø</button>
          <div class="hpf-knob-container"></div>
        </div>
      </div>

      <div class="strip-inserts-section">
        <div class="insert-slot active" data-slot="1">
          <span class="insert-name">1: EQ</span>
          <button class="insert-bypass enabled" title="Bypass Insert 1"></button>
        </div>
        <div class="insert-slot active" data-slot="2">
          <span class="insert-name">2: COMP</span>
          <button class="insert-bypass enabled" title="Bypass Insert 2"></button>
        </div>
        <div class="insert-slot" data-slot="3">
          <span class="insert-name">3: GATE</span>
          <button class="insert-bypass" title="Bypass Insert 3"></button>
        </div>
        <div class="insert-slot active" data-slot="4">
          <span class="insert-name">4: LIMIT</span>
          <button class="insert-bypass enabled" title="Bypass Insert 4"></button>
        </div>
      </div>

      <div class="strip-sends-section">
        <div class="send-knob send-chorus"></div>
        <div class="send-knob send-delay"></div>
        <div class="send-knob send-reverb"></div>
        <div class="send-knob send-harmonizer"></div>
      </div>

      <div class="strip-pan-section">
        <div class="pan-knob-container"></div>
        <div class="width-knob-container"></div>
      </div>

      <div class="strip-fader-area">
        <div class="meter-ladder-container">
          <div class="clip-led"></div>
          <div class="dual-meter-bars">
            <div class="meter-bar left-bar"><div class="meter-fill fill-l"></div></div>
            <div class="meter-bar right-bar"><div class="meter-fill fill-r"></div></div>
          </div>
        </div>
        <div class="fader-track-target"></div>
      </div>

      <div class="fader-value-box">0.0 dB</div>

      <div class="strip-buttons-row">
        <button class="btn-mute" title="Mute Channel (M)">M</button>
        <button class="btn-solo" title="Solo Channel (S)">S</button>
        <button class="btn-safe" title="Solo Safe">SAFE</button>
      </div>

      <div class="strip-footer">
        <select class="output-select" title="Output Bus">
          <option value="Master" ${this.dsp.outputDestination === 'Master' ? 'selected' : ''}>Master</option>
          <option value="Group Master" ${this.dsp.outputDestination === 'Group Master' ? 'selected' : ''}>Group</option>
          <option value="None">None</option>
        </select>
      </div>
    `;

    // Instantiate Sub-Controls
    const gainContainer = this.el.querySelector('.gain-knob-container');
    this.gainKnob = new KnobComponent(gainContainer, {
      label: 'GAIN',
      min: -24,
      max: 24,
      defaultVal: 0,
      val: this.dsp.inputGainDb,
      unit: 'dB',
      size: 'small',
      color: this.color,
      onChange: (v) => { this.dsp.inputGainDb = v; }
    });

    const hpfContainer = this.el.querySelector('.hpf-knob-container');
    this.hpfKnob = new KnobComponent(hpfContainer, {
      label: 'HPF',
      min: 20,
      max: 300,
      defaultVal: 20,
      val: this.dsp.hpfFreq,
      unit: 'Hz',
      step: 5,
      size: 'small',
      color: '#94A3B8',
      onChange: (v) => {
        this.dsp.hpfFreq = v;
        this.dsp.hpfEnabled = v > 20;
        this.dsp.updateFilters();
      }
    });

    // Aux Sends Knobs
    const sendLabels = ['CHO', 'DLY', 'REV', 'HARM'];
    const sendKeys = ['chorus', 'delay', 'reverb', 'harmonizer'];
    this.sendKnobs = [];

    sendKeys.forEach((k, idx) => {
      const sendTarget = this.el.querySelector(`.send-${k}`);
      const kb = new KnobComponent(sendTarget, {
        label: sendLabels[idx],
        min: -60,
        max: 6,
        defaultVal: -60,
        val: this.dsp.sends[idx].levelDb,
        unit: 'dB',
        size: 'small',
        color: '#10B981',
        onChange: (v) => { this.dsp.sends[idx].levelDb = v; }
      });
      this.sendKnobs.push(kb);
    });

    // Pan & Width Knobs
    const panContainer = this.el.querySelector('.pan-knob-container');
    this.panKnob = new KnobComponent(panContainer, {
      label: 'PAN',
      min: -100,
      max: 100,
      defaultVal: 0,
      val: this.dsp.pan,
      unit: '%',
      size: 'small',
      color: '#3B82F6',
      onChange: (v) => { this.dsp.setPan(v); }
    });

    const widthContainer = this.el.querySelector('.width-knob-container');
    this.widthKnob = new KnobComponent(widthContainer, {
      label: 'WID',
      min: 0,
      max: 200,
      defaultVal: 100,
      val: this.dsp.stereoWidth,
      unit: '%',
      size: 'small',
      color: '#8A2BE2',
      onChange: (v) => { this.dsp.stereoWidth = v; }
    });

    // Vertical Fader
    const faderTarget = this.el.querySelector('.fader-track-target');
    this.faderValueBox = this.el.querySelector('.fader-value-box');
    this.fader = new FaderComponent(faderTarget, {
      valDb: this.dsp.faderDb,
      onChange: (db) => {
        this.dsp.setFaderDb(db);
        this.faderValueBox.innerText = db <= -80 ? '-∞ dB' : `${db > 0 ? '+' : ''}${db.toFixed(1)} dB`;
      }
    });

    // Meter Elements
    this.fillL = this.el.querySelector('.fill-l');
    this.fillR = this.el.querySelector('.fill-r');
    this.clipLed = this.el.querySelector('.clip-led');

    this.setupButtonEvents();
    this.container.appendChild(this.el);
  }

  setupButtonEvents() {
    // Phase
    const phaseBtn = this.el.querySelector('.toggle-phase');
    phaseBtn.addEventListener('click', () => {
      this.dsp.phaseInvert = !this.dsp.phaseInvert;
      phaseBtn.classList.toggle('active', this.dsp.phaseInvert);
    });

    // Mute
    const muteBtn = this.el.querySelector('.btn-mute');
    muteBtn.addEventListener('click', () => {
      this.dsp.muted = !this.dsp.muted;
      muteBtn.classList.toggle('active', this.dsp.muted);
    });

    // Solo
    const soloBtn = this.el.querySelector('.btn-solo');
    soloBtn.addEventListener('click', () => {
      this.dsp.soloed = !this.dsp.soloed;
      soloBtn.classList.toggle('active', this.dsp.soloed);
    });

    // Safe
    const safeBtn = this.el.querySelector('.btn-safe');
    safeBtn.addEventListener('click', () => {
      this.dsp.safe = !this.dsp.safe;
      safeBtn.classList.toggle('active', this.dsp.safe);
    });

    // Output Destination Dropdown
    const outSelect = this.el.querySelector('.output-select');
    outSelect.addEventListener('change', (e) => {
      this.dsp.outputDestination = e.target.value;
    });

    // Inserts click
    this.el.querySelectorAll('.insert-slot').forEach(slot => {
      slot.addEventListener('click', () => {
        if (this.onOpenFx) this.onOpenFx(this.dsp.id, slot.dataset.slot);
      });
    });

    // Click strip to select
    this.el.addEventListener('click', (e) => {
      if (!e.target.closest('button') && !e.target.closest('select')) {
        if (this.onSelect) this.onSelect(this.dsp.id);
      }
    });
  }

  updateMeters(peakL, peakR, clipL, clipR) {
    // Convert -60dB to 0dB into 0% - 100% height
    const normL = Math.max(0, Math.min(100, ((peakL + 60) / 60) * 100));
    const normR = Math.max(0, Math.min(100, ((peakR + 60) / 60) * 100));

    this.fillL.style.height = `${normL}%`;
    this.fillR.style.height = `${normR}%`;

    if (clipL || clipR) {
      this.clipLed.classList.add('active');
    } else {
      this.clipLed.classList.remove('active');
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ChannelStripComponent };
}
