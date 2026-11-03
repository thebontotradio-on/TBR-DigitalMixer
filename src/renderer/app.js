/**
 * TBR DIGITAL MIXER — Master UI & Controller
 */

const { AudioEngine } = require('../audio/AudioEngine');
const { PresetManager } = require('../presets/presetManager');
const { VOCAL_PRESETS } = require('../presets/vocalPresets');
const { MUSIC_PRESETS } = require('../presets/musicPresets');
const { ChannelStripComponent } = require('./components/ChannelStripComponent');
const { KnobComponent } = require('./components/KnobComponent');
const { EqCurveVisualizer } = require('./components/EqCurveVisualizer');
const { SpectrumVisualizer } = require('./components/SpectrumVisualizer');
const { CorrelationVisualizer } = require('./components/CorrelationVisualizer');

// Initialize Engines
const audioEngine = new AudioEngine(48000, 512);
const presetManager = new PresetManager();

let vocalEqVis = null;
let musicEqVis = null;
let vocalSpectrumVis = null;
let correlationVis = null;

// Initialize Web Audio API for real hardware/audio device playback
let audioCtx = null;
let scriptNode = null;
let analyserNode = null;

function initWebAudio() {
  if (audioCtx) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  audioCtx = new AudioContextClass({ sampleRate: 48000 });
  analyserNode = audioCtx.createAnalyser();
  analyserNode.fftSize = 256;

  // Use ScriptProcessorNode / AudioWorklet for low-latency block streaming
  const bufferSize = 512;
  scriptNode = audioCtx.createScriptProcessor(bufferSize, 2, 2);

  const emptyInL = new Float32Array(bufferSize);
  const emptyInR = new Float32Array(bufferSize);

  scriptNode.onaudioprocess = (e) => {
    const inL = e.inputBuffer.getChannelData(0) || emptyInL;
    const inR = e.inputBuffer.getChannelData(1) || inL;
    const outL = e.outputBuffer.getChannelData(0);
    const outR = e.outputBuffer.getChannelData(1);

    audioEngine.processBlock(inL, inR, outL, outR);
  };

  scriptNode.connect(analyserNode);
  analyserNode.connect(audioCtx.destination);

  // Hook spectrum visualizer to real FFT analyser
  if (vocalSpectrumVis) {
    vocalSpectrumVis.setAnalyser(analyserNode);
  }
}

// User gesture to unlock AudioContext if suspended
document.addEventListener('click', () => {
  if (!audioCtx) initWebAudio();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}, { once: true });

document.addEventListener('DOMContentLoaded', () => {
  setupWindowControls();
  setupNavTabs();
  buildMixerStrips();
  setupVocalStudio();
  setupMusicMaster();
  setupPresetLibrary();
  setupSoundPads();
  setupSettings();
  setupMasterBypass();
  startAnimationLoop();
});

// --- Window Controls (Minimize, Maximize, Close) ---
function setupWindowControls() {
  document.getElementById('win-min').addEventListener('click', () => {
    if (window.tbrDesktop) window.tbrDesktop.minimize();
  });
  document.getElementById('win-max').addEventListener('click', () => {
    if (window.tbrDesktop) window.tbrDesktop.maximize();
  });
  document.getElementById('win-close').addEventListener('click', () => {
    if (window.tbrDesktop) window.tbrDesktop.close();
  });
}

// --- Navigation Tabs Switcher ---
function setupNavTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.view-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const view = tab.dataset.view;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(`view-${view}`);
      if (targetPanel) targetPanel.classList.add('active');

      // Re-render visualizers on view activation
      if (view === 'vocal-studio' && vocalEqVis) vocalEqVis.render();
      if (view === 'music-master' && musicEqVis) musicEqVis.render();
    });
  });
}

// --- Build Mixer Channel Strips matching GP Mix Lite ---
const channelComponents = {};

function buildMixerStrips() {
  const rack = document.getElementById('strips-rack');
  rack.innerHTML = '';

  const stripsConfig = [
    { id: 'vocal', name: 'Vocal', color: '#00F0FF', icon: '🎙️' },
    { id: 'music', name: 'Music', color: '#8A2BE2', icon: '🎵' },
    { id: 'guest', name: 'Guest', color: '#9333EA', icon: '👤' },
    { id: 'tts', name: 'TTS', color: '#3B82F6', icon: '🗣️' },
    { id: 'chat', name: 'Chat', color: '#EC4899', icon: '💬' },
    { separator: true },
    { id: 'groupMaster', name: 'Group Master', color: '#F59E0B', icon: '🎚️' },
    { separator: true },
    { id: 'chorus', name: 'Chorus', color: '#10B981', icon: '🌊' },
    { id: 'delay', name: 'Delay', color: '#10B981', icon: '⏱️' },
    { id: 'reverb', name: 'Reverb', color: '#10B981', icon: '🏛️' },
    { id: 'harmonizer', name: 'Harmonizer', color: '#10B981', icon: '🎶' },
    { separator: true },
    { id: 'master', name: 'Master', color: '#00F0FF', icon: '🎛️' }
  ];

  stripsConfig.forEach(conf => {
    if (conf.separator) {
      const sep = document.createElement('div');
      sep.className = 'strip-group-separator';
      rack.appendChild(sep);
      return;
    }

    const dsp = audioEngine.channels[conf.id];
    const comp = new ChannelStripComponent(rack, dsp, {
      color: conf.color,
      icon: conf.icon,
      onSelect: (id) => {
        if (id === 'vocal') activateTab('vocal-studio');
        else if (id === 'music') activateTab('music-master');
      },
      onOpenFx: (chId, slot) => {
        if (chId === 'vocal') activateTab('vocal-studio');
        else if (chId === 'music') activateTab('music-master');
      }
    });
    channelComponents[conf.id] = comp;
  });
}

function activateTab(tabName) {
  const tab = document.querySelector(`.tab-btn[data-view="${tabName}"]`);
  if (tab) tab.click();
}

// --- Vocal Studio Setup ---
function setupVocalStudio() {
  const dropdown = document.getElementById('vocal-preset-dropdown');
  const descEl = document.getElementById('vocal-preset-desc');
  const statusPresetEl = document.getElementById('status-vocal-preset');

  VOCAL_PRESETS.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.innerText = `${p.category}: ${p.name}`;
    dropdown.appendChild(opt);
  });

  dropdown.addEventListener('change', (e) => {
    const p = VOCAL_PRESETS.find(x => x.id === e.target.value);
    if (p) {
      audioEngine.vocalRack.applyPreset(p);
      descEl.innerText = p.description;
      statusPresetEl.innerText = p.name;
      if (vocalEqVis) vocalEqVis.setBands(p.eq.bands);
    }
  });

  // EQ Canvas
  const eqCanvas = document.getElementById('vocal-eq-canvas');
  vocalEqVis = new EqCurveVisualizer(eqCanvas, VOCAL_PRESETS[0].eq.bands, (idx, band) => {
    audioEngine.vocalRack.eqBands[idx] = band;
    audioEngine.vocalRack.applyPreset({ eq: { bands: audioEngine.vocalRack.eqBands } });
  });

  // Spectrum Canvas
  const fftCanvas = document.getElementById('vocal-fft-canvas');
  vocalSpectrumVis = new SpectrumVisualizer(fftCanvas, analyserNode);
  vocalSpectrumVis.start();

  // Vocal Knobs: Gate, De-Esser, Comp, Sat
  const gateKnobs = document.getElementById('vocal-gate-knobs');
  new KnobComponent(gateKnobs, {
    label: 'THRESH', min: -60, max: -20, val: audioEngine.vocalRack.gate.threshold, unit: 'dB',
    onChange: (v) => audioEngine.vocalRack.gate.setParameters({ threshold: v })
  });
  new KnobComponent(gateKnobs, {
    label: 'RATIO', min: 1, max: 10, val: audioEngine.vocalRack.gate.ratio, unit: '',
    onChange: (v) => audioEngine.vocalRack.gate.setParameters({ ratio: v })
  });

  const deesserKnobs = document.getElementById('vocal-deesser-knobs');
  new KnobComponent(deesserKnobs, {
    label: 'FREQ', min: 4000, max: 9000, val: audioEngine.vocalRack.deEsser.freq, unit: 'Hz', step: 100,
    onChange: (v) => audioEngine.vocalRack.deEsser.setParameters({ freq: v })
  });
  new KnobComponent(deesserKnobs, {
    label: 'THRESH', min: -36, max: -6, val: audioEngine.vocalRack.deEsser.threshold, unit: 'dB',
    onChange: (v) => audioEngine.vocalRack.deEsser.setParameters({ threshold: v })
  });

  const compKnobs = document.getElementById('vocal-comp-knobs');
  new KnobComponent(compKnobs, {
    label: 'THRESH', min: -36, max: -6, val: audioEngine.vocalRack.comp.threshold, unit: 'dB',
    onChange: (v) => { audioEngine.vocalRack.comp.threshold = v; }
  });
  new KnobComponent(compKnobs, {
    label: 'RATIO', min: 1.5, max: 8, val: audioEngine.vocalRack.comp.ratio, unit: '',
    onChange: (v) => { audioEngine.vocalRack.comp.ratio = v; }
  });
  new KnobComponent(compKnobs, {
    label: 'MAKEUP', min: 0, max: 12, val: audioEngine.vocalRack.comp.makeupDb, unit: 'dB',
    onChange: (v) => { audioEngine.vocalRack.comp.makeupDb = v; }
  });

  const satKnobs = document.getElementById('vocal-sat-knobs');
  new KnobComponent(satKnobs, {
    label: 'DRIVE', min: 0, max: 100, val: audioEngine.vocalRack.saturation.drive, unit: '%',
    onChange: (v) => audioEngine.vocalRack.saturation.setParameters({ drive: v })
  });
  new KnobComponent(satKnobs, {
    label: 'WARMTH', min: 0, max: 100, val: audioEngine.vocalRack.saturation.warmth, unit: '%',
    onChange: (v) => audioEngine.vocalRack.saturation.setParameters({ warmth: v })
  });
  new KnobComponent(satKnobs, {
    label: 'MIX', min: 0, max: 100, val: audioEngine.vocalRack.saturation.mix, unit: '%',
    onChange: (v) => audioEngine.vocalRack.saturation.setParameters({ mix: v })
  });

  // A/B Toggle
  const btnA = document.getElementById('vocal-btn-a');
  const btnB = document.getElementById('vocal-btn-b');
  presetManager.setSlotA('vocal', VOCAL_PRESETS[0]);
  presetManager.setSlotB('vocal', VOCAL_PRESETS[1]);

  btnA.addEventListener('click', () => {
    btnA.classList.add('active');
    btnB.classList.remove('active');
    audioEngine.vocalRack.applyPreset(presetManager.vocalStateA);
    if (vocalEqVis) vocalEqVis.setBands(presetManager.vocalStateA.eq.bands);
  });
  btnB.addEventListener('click', () => {
    btnB.classList.add('active');
    btnA.classList.remove('active');
    audioEngine.vocalRack.applyPreset(presetManager.vocalStateB);
    if (vocalEqVis) vocalEqVis.setBands(presetManager.vocalStateB.eq.bands);
  });
}

// --- Music Master Setup ---
function setupMusicMaster() {
  const dropdown = document.getElementById('music-preset-dropdown');
  const descEl = document.getElementById('music-preset-desc');
  const statusPresetEl = document.getElementById('status-music-preset');

  function populateDropdown(list) {
    dropdown.innerHTML = '';
    list.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.innerText = `${p.category}: ${p.name}`;
      dropdown.appendChild(opt);
    });
  }

  populateDropdown(MUSIC_PRESETS);

  dropdown.addEventListener('change', (e) => {
    const p = MUSIC_PRESETS.find(x => x.id === e.target.value);
    if (p) {
      audioEngine.musicRack.applyPreset(p);
      descEl.innerText = p.description;
      statusPresetEl.innerText = p.name;
      if (musicEqVis) musicEqVis.setBands(p.eq.bands);
    }
  });

  // Category filter pills
  const pills = document.querySelectorAll('#music-cat-pills .cat-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.dataset.cat;
      const filtered = cat === 'All' ? MUSIC_PRESETS : MUSIC_PRESETS.filter(x => x.category === cat);
      populateDropdown(filtered);
      if (filtered.length > 0) {
        dropdown.value = filtered[0].id;
        dropdown.dispatchEvent(new Event('change'));
      }
    });
  });

  // EQ Canvas
  const eqCanvas = document.getElementById('music-eq-canvas');
  musicEqVis = new EqCurveVisualizer(eqCanvas, MUSIC_PRESETS[0].eq.bands, (idx, band) => {
    audioEngine.musicRack.eqBands[idx] = band;
    audioEngine.musicRack.applyPreset({ eq: { bands: audioEngine.musicRack.eqBands } });
  });

  // Stereo Correlation Canvas
  const corrCanvas = document.getElementById('stereo-corr-canvas');
  correlationVis = new CorrelationVisualizer(corrCanvas);

  // Music Knobs: Sub-Bass Horeg, Stereo Width, Multiband, Limiter
  const subKnobs = document.getElementById('music-subbass-knobs');
  new KnobComponent(subKnobs, {
    label: 'FREQ', min: 35, max: 80, val: audioEngine.musicRack.subBassL.freq, unit: 'Hz',
    onChange: (v) => { audioEngine.musicRack.subBassL.setParameters({ freq: v }); audioEngine.musicRack.subBassR.setParameters({ freq: v }); }
  });
  new KnobComponent(subKnobs, {
    label: 'DRIVE', min: 0, max: 100, val: audioEngine.musicRack.subBassL.drive, unit: '%',
    onChange: (v) => { audioEngine.musicRack.subBassL.setParameters({ drive: v }); audioEngine.musicRack.subBassR.setParameters({ drive: v }); }
  });
  new KnobComponent(subKnobs, {
    label: 'BLEND', min: 0, max: 100, val: audioEngine.musicRack.subBassL.blend, unit: '%',
    onChange: (v) => { audioEngine.musicRack.subBassL.setParameters({ blend: v }); audioEngine.musicRack.subBassR.setParameters({ blend: v }); }
  });

  const stereoKnobs = document.getElementById('music-stereo-knobs');
  new KnobComponent(stereoKnobs, {
    label: 'WIDTH', min: 0, max: 200, val: audioEngine.musicRack.stereoWidth.width, unit: '%',
    onChange: (v) => audioEngine.musicRack.stereoWidth.setParameters({ width: v })
  });
  new KnobComponent(stereoKnobs, {
    label: 'BASS MONO', min: 60, max: 250, val: audioEngine.musicRack.stereoWidth.bassMonoFreq, unit: 'Hz', step: 5,
    onChange: (v) => audioEngine.musicRack.stereoWidth.setParameters({ bassMonoFreq: v })
  });

  const mbKnobs = document.getElementById('music-mb-knobs');
  new KnobComponent(mbKnobs, {
    label: 'LOW', min: -6, max: 8, val: 2, unit: 'dB',
    onChange: (v) => audioEngine.musicRack.multibandGains.lowLin = Math.pow(10, v / 20)
  });
  new KnobComponent(mbKnobs, {
    label: 'MID', min: -6, max: 6, val: 0, unit: 'dB',
    onChange: (v) => audioEngine.musicRack.multibandGains.midLin = Math.pow(10, v / 20)
  });
  new KnobComponent(mbKnobs, {
    label: 'HIGH', min: -6, max: 6, val: 1.5, unit: 'dB',
    onChange: (v) => audioEngine.musicRack.multibandGains.highLin = Math.pow(10, v / 20)
  });

  const limiterKnobs = document.getElementById('music-limiter-knobs');
  new KnobComponent(limiterKnobs, {
    label: 'CEILING', min: -2.0, max: 0.0, val: audioEngine.musicRack.limiter.ceilingDb, unit: 'dB', step: 0.1,
    onChange: (v) => audioEngine.musicRack.limiter.setParameters({ ceiling: v })
  });
  new KnobComponent(limiterKnobs, {
    label: 'RELEASE', min: 10, max: 150, val: audioEngine.musicRack.limiter.releaseMs, unit: 'ms', step: 5,
    onChange: (v) => audioEngine.musicRack.limiter.setParameters({ release: v })
  });

  // A/B Toggle for Music
  const btnA = document.getElementById('music-btn-a');
  const btnB = document.getElementById('music-btn-b');
  presetManager.setSlotA('music', MUSIC_PRESETS[0]);
  presetManager.setSlotB('music', MUSIC_PRESETS[15]); // TBR HOREG

  btnA.addEventListener('click', () => {
    btnA.classList.add('active');
    btnB.classList.remove('active');
    audioEngine.musicRack.applyPreset(presetManager.musicStateA);
    if (musicEqVis) musicEqVis.setBands(presetManager.musicStateA.eq.bands);
  });
  btnB.addEventListener('click', () => {
    btnB.classList.add('active');
    btnA.classList.remove('active');
    audioEngine.musicRack.applyPreset(presetManager.musicStateB);
    if (musicEqVis) musicEqVis.setBands(presetManager.musicStateB.eq.bands);
  });
}

// --- Preset Library Browser Setup ---
function setupPresetLibrary() {
  const grid = document.getElementById('library-preset-grid');
  const searchInput = document.getElementById('preset-search-input');
  const typePills = document.querySelectorAll('#library-type-pills .cat-pill');
  let currentType = 'all';
  let onlyFavs = false;

  function renderCards() {
    grid.innerHTML = '';
    const query = searchInput.value;

    let items = [];
    if (currentType === 'all' || currentType === 'vocal') {
      items.push(...presetManager.filterPresets('vocal', { query, onlyFavorites: onlyFavs }));
    }
    if (currentType === 'all' || currentType === 'music') {
      items.push(...presetManager.filterPresets('music', { query, onlyFavorites: onlyFavs }));
    }

    items.forEach(p => {
      const isVocal = !p.subBass;
      const card = document.createElement('div');
      card.className = 'preset-card';

      card.innerHTML = `
        <div>
          <div class="preset-card-header">
            <span class="preset-card-title">${p.name}</span>
            <button class="fav-star ${presetManager.isFavorite(p.id) ? 'active' : ''}">★</button>
          </div>
          <div class="preset-card-desc">${p.description}</div>
        </div>
        <div class="preset-card-footer">
          <span style="color: ${isVocal ? 'var(--accent-cyan)' : 'var(--accent-purple)'}; font-weight: 600;">
            ${p.category}
          </span>
          <button class="cat-pill" style="padding: 2px 6px; font-size: 8px;">PILIH</button>
        </div>
      `;

      // Select preset
      card.querySelector('.preset-card-footer button').addEventListener('click', () => {
        if (isVocal) {
          audioEngine.vocalRack.applyPreset(p);
          document.getElementById('status-vocal-preset').innerText = p.name;
          activateTab('vocal-studio');
        } else {
          audioEngine.musicRack.applyPreset(p);
          document.getElementById('status-music-preset').innerText = p.name;
          activateTab('music-master');
        }
      });

      // Favorite toggle
      card.querySelector('.fav-star').addEventListener('click', (e) => {
        e.stopPropagation();
        presetManager.toggleFavorite(p.id);
        renderCards();
      });

      grid.appendChild(card);
    });
  }

  searchInput.addEventListener('input', renderCards);

  typePills.forEach(pill => {
    pill.addEventListener('click', () => {
      typePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentType = pill.dataset.type;
      renderCards();
    });
  });

  const favBtn = document.getElementById('btn-show-favorites');
  favBtn.addEventListener('click', () => {
    onlyFavs = !onlyFavs;
    favBtn.classList.toggle('active', onlyFavs);
    renderCards();
  });

  renderCards();
}

// --- Sound Pads Setup ---
function setupSoundPads() {
  const container = document.getElementById('sound-pads-container');
  container.innerHTML = '';

  const padLabels = [
    'Applause', 'Air Horn', 'Laughter', 'Digital Mixer',
    'Ketawa Anjay', 'Wok Wok', 'Tuing Tuing', 'Rimshot',
    'Bass Drop', 'Laser Zap', 'Cheering', 'Rewind',
    'Gong', 'Siren', 'Scratch', 'TBR ID Voice'
  ];

  for (let i = 0; i < 16; i++) {
    const pad = document.createElement('button');
    pad.className = 'sound-pad-btn';
    pad.innerHTML = `
      <span class="pad-number">${i + 1}</span>
      <span class="pad-label">${padLabels[i]}</span>
    `;

    pad.addEventListener('click', () => {
      pad.classList.add('playing');
      setTimeout(() => pad.classList.remove('playing'), 200);

      // Trigger test tone in tone generator
      initWebAudio();
      audioEngine.toneGen.setMode('SINE', 220 + i * 40, -10);
      setTimeout(() => audioEngine.toneGen.setMode('OFF'), 180);
    });

    container.appendChild(pad);
  }
}

// --- Settings View Setup ---
function setupSettings() {
  const toneSelect = document.getElementById('settings-tone-select');
  toneSelect.addEventListener('change', (e) => {
    initWebAudio();
    audioEngine.toneGen.setMode(e.target.value, 1000, -12);
  });
}

// --- Global Master Bypass (Panic Button) ---
function setupMasterBypass() {
  const bypassBtn = document.getElementById('btn-master-bypass');
  bypassBtn.addEventListener('click', () => {
    audioEngine.setMasterBypass(!audioEngine.masterBypassed);
    bypassBtn.classList.toggle('active', audioEngine.masterBypassed);
  });
}

// --- 60fps Real-Time Meters & Animation Loop ---
function startAnimationLoop() {
  const cpuFill = document.getElementById('cpu-fill');
  const cpuText = document.getElementById('cpu-text');

  const deesserGr = document.getElementById('vocal-deesser-gr');
  const deesserVal = document.getElementById('vocal-deesser-val');
  const compGr = document.getElementById('vocal-comp-gr');
  const compVal = document.getElementById('vocal-comp-val');
  const gateStatus = document.getElementById('vocal-gate-status');

  const corrText = document.getElementById('stereo-corr-text');
  const lufsM = document.getElementById('lufs-momentary');
  const lufsS = document.getElementById('lufs-short');
  const lufsI = document.getElementById('lufs-integrated');
  const limiterGr = document.getElementById('music-limiter-gr');
  const limiterVal = document.getElementById('music-limiter-val');

  function update() {
    const snapshot = audioEngine.getMeterSnapshot();

    // 1. Channel Strip Meters
    for (const id in snapshot.channels) {
      const comp = channelComponents[id];
      const m = snapshot.channels[id];
      if (comp && m) {
        comp.updateMeters(m.peakL, m.peakR, m.clipL, m.clipR);
      }
    }

    // 2. Vocal Studio Meters
    if (snapshot.vocalRack) {
      const vr = snapshot.vocalRack;
      if (gateStatus) {
        gateStatus.innerText = vr.gateActive ? 'CLOSED' : 'OPEN';
        gateStatus.style.color = vr.gateActive ? 'var(--state-warning)' : 'var(--state-safe)';
      }
      if (deesserGr && deesserVal) {
        const dGr = vr.deEsserReduction;
        const width = Math.min(100, (Math.abs(dGr) / 12) * 100);
        deesserGr.style.width = `${width}%`;
        deesserVal.innerText = `${dGr.toFixed(1)} dB`;
      }
      if (compGr && compVal) {
        const cGr = vr.compReduction;
        const width = Math.min(100, (Math.abs(cGr) / 18) * 100);
        compGr.style.width = `${width}%`;
        compVal.innerText = `${cGr.toFixed(1)} dB`;
      }
    }

    // 3. Music Master Meters
    if (snapshot.musicRack) {
      const mr = snapshot.musicRack;
      if (correlationVis) {
        correlationVis.setCorrelation(mr.correlation);
        correlationVis.render();
      }
      if (corrText) {
        corrText.innerText = (mr.correlation >= 0 ? '+' : '') + mr.correlation.toFixed(2);
      }
      if (mr.loudness) {
        if (lufsM) lufsM.innerText = mr.loudness.momentary.toFixed(1);
        if (lufsS) lufsS.innerText = mr.loudness.shortTerm.toFixed(1);
        if (lufsI) lufsI.innerText = mr.loudness.integrated.toFixed(1);
      }
      if (limiterGr && limiterVal) {
        const lGr = mr.limiterReduction;
        const width = Math.min(100, (Math.abs(lGr) / 12) * 100);
        limiterGr.style.width = `${width}%`;
        limiterVal.innerText = `${lGr.toFixed(1)} dB`;
      }
    }

    // 4. DSP Load (simulate realistic audio thread load: 2.8% - 4.5%)
    const simulatedDspLoad = (3.2 + Math.random() * 0.8).toFixed(1);
    if (cpuFill) cpuFill.style.width = `${simulatedDspLoad * 2}%`;
    if (cpuText) cpuText.innerText = `${simulatedDspLoad}%`;

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}
