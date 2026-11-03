/**
 * TBR DIGITAL MIXER — Master Audio Engine
 * Coordinates hardware I/O, Channel Strips, Racks, Buses, and Routing Graph
 */

const { ChannelDsp } = require('./ChannelDsp');
const { VocalDspRack } = require('./VocalDspRack');
const { MusicDspRack } = require('./MusicDspRack');
const { ToneGenerator } = require('./ToneGenerator');

class AudioEngine {
  constructor(sampleRate = 48000, bufferSize = 512) {
    this.sampleRate = sampleRate;
    this.bufferSize = bufferSize;
    this.running = false;
    this.masterBypassed = false;

    // Dedicated Processing Racks
    this.vocalRack = new VocalDspRack(sampleRate);
    this.musicRack = new MusicDspRack(sampleRate);
    this.toneGen = new ToneGenerator(sampleRate);

    // Initialize Mixer Channel Strips matching GP Mix Lite
    this.channels = {
      vocal: new ChannelDsp('vocal', 'Vocal', 'AUDIO_IN', sampleRate),
      music: new ChannelDsp('music', 'Music', 'AUDIO_IN', sampleRate),
      guest: new ChannelDsp('guest', 'Guest', 'AUDIO_IN', sampleRate),
      tts: new ChannelDsp('tts', 'TTS', 'AUDIO_IN', sampleRate),
      chat: new ChannelDsp('chat', 'Chat', 'AUDIO_IN', sampleRate),
      groupMaster: new ChannelDsp('group-master', 'Group Master', 'GROUP', sampleRate),
      chorus: new ChannelDsp('chorus', 'Chorus', 'AUX', sampleRate),
      delay: new ChannelDsp('delay', 'Delay', 'AUX', sampleRate),
      reverb: new ChannelDsp('reverb', 'Reverb', 'AUX', sampleRate),
      harmonizer: new ChannelDsp('harmonizer', 'Harmonizer', 'AUX', sampleRate),
      master: new ChannelDsp('master', 'Master', 'MASTER', sampleRate)
    };

    // Color theme accents per strip (matching GP Mix Lite default template)
    this.channelColors = {
      vocal: '#00F0FF',       // Neon Cyan
      music: '#8A2BE2',       // Electric Purple
      guest: '#9333EA',       // Purple
      tts: '#3B82F6',         // Blue
      chat: '#EC4899',        // Pink
      groupMaster: '#F59E0B',  // Amber
      chorus: '#10B981',      // Emerald Green
      delay: '#10B981',       // Emerald Green
      reverb: '#10B981',      // Emerald Green
      harmonizer: '#10B981',  // Emerald Green
      master: '#00F0FF'       // Neon Cyan
    };

    // Audio Devices State
    this.audioInputDevice = 'Default';
    this.audioOutputDevice = 'Default';
    this.inputDevices = [];
    this.outputDevices = [];

    // Master bus buffers
    this.masterLeft = new Float32Array(bufferSize);
    this.masterRight = new Float32Array(bufferSize);

    // Group bus buffers
    this.groupLeft = new Float32Array(bufferSize);
    this.groupRight = new Float32Array(bufferSize);

    // Aux send buses
    this.auxBuses = {
      chorus: { left: new Float32Array(bufferSize), right: new Float32Array(bufferSize) },
      delay: { left: new Float32Array(bufferSize), right: new Float32Array(bufferSize) },
      reverb: { left: new Float32Array(bufferSize), right: new Float32Array(bufferSize) },
      harmonizer: { left: new Float32Array(bufferSize), right: new Float32Array(bufferSize) }
    };
  }

  // --- Hardware Device Enumeration (in Browser/Renderer environment) ---
  async enumerateDevices() {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        this.inputDevices = devices.filter(d => d.kind === 'audioinput').map(d => ({
          deviceId: d.deviceId,
          label: d.label || `Microphone ${d.deviceId.slice(0, 5)}`
        }));
        this.outputDevices = devices.filter(d => d.kind === 'audiooutput').map(d => ({
          deviceId: d.deviceId,
          label: d.label || `Speaker ${d.deviceId.slice(0, 5)}`
        }));
      } catch (err) {
        console.warn('Could not enumerate audio devices:', err);
      }
    }
  }

  // --- Audio Graph Processing Block ---
  processBlock(inputL, inputR, outputL, outputR) {
    const len = inputL.length;

    // Reset master and group buffers
    this.masterLeft.fill(0);
    this.masterRight.fill(0);
    this.groupLeft.fill(0);
    this.groupRight.fill(0);

    // Reset aux buses
    for (const key in this.auxBuses) {
      this.auxBuses[key].left.fill(0);
      this.auxBuses[key].right.fill(0);
    }

    if (this.masterBypassed) {
      outputL.set(inputL);
      outputR.set(inputR);
      return;
    }

    // Temporary channel working buffers
    const chanL = new Float32Array(len);
    const chanR = new Float32Array(len);

    // 1. Process Tone Generator (if active, feeds music or vocal channel)
    chanL.fill(0);
    chanR.fill(0);
    this.toneGen.process(chanL, chanR);

    // Feed tone generator or external inputs to Vocal channel
    const vocalL = new Float32Array(len);
    const vocalR = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      vocalL[i] = inputL[i] + (this.toneGen.type === 'VOCAL_SIM' ? chanL[i] : 0);
      vocalR[i] = inputR[i] + (this.toneGen.type === 'VOCAL_SIM' ? chanR[i] : 0);
    }

    // Pass Vocal channel through Vocal DSP Rack
    this.vocalRack.process(vocalL);
    vocalR.set(vocalL); // Vocal is typically mono broadcast centered
    this.channels.vocal.process(vocalL, vocalR, this.auxBuses);

    // Route Vocal output to Master or Group
    this.routeToDestination(this.channels.vocal.outputDestination, vocalL, vocalR);

    // 2. Process Music Channel
    const musicL = new Float32Array(len);
    const musicR = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      const tone = this.toneGen.type !== 'VOCAL_SIM' && this.toneGen.type !== 'OFF';
      musicL[i] = tone ? chanL[i] : inputL[i];
      musicR[i] = tone ? chanR[i] : inputR[i];
    }

    // Pass Music channel through Music DSP Rack
    this.musicRack.process(musicL, musicR);
    this.channels.music.process(musicL, musicR, this.auxBuses);
    this.routeToDestination(this.channels.music.outputDestination, musicL, musicR);

    // 3. Process Other Channels (Guest, TTS, Chat)
    ['guest', 'tts', 'chat'].forEach(id => {
      const ch = this.channels[id];
      const bL = new Float32Array(len);
      const bR = new Float32Array(len);
      ch.process(bL, bR, this.auxBuses);
      this.routeToDestination(ch.outputDestination, bL, bR);
    });

    // 4. Process Group Master (combines channels routed to Group Master)
    this.channels.groupMaster.process(this.groupLeft, this.groupRight, this.auxBuses);
    for (let i = 0; i < len; i++) {
      this.masterLeft[i] += this.groupLeft[i];
      this.masterRight[i] += this.groupRight[i];
    }

    // 5. Process Aux Return Channels (Chorus, Delay, Reverb, Harmonizer)
    ['chorus', 'delay', 'reverb', 'harmonizer'].forEach(auxId => {
      const ch = this.channels[auxId];
      const bus = this.auxBuses[auxId];
      ch.process(bus.left, bus.right, null);
      for (let i = 0; i < len; i++) {
        this.masterLeft[i] += bus.left[i];
        this.masterRight[i] += bus.right[i];
      }
    });

    // 6. Master Channel Strip Processing & Limiting
    this.channels.master.process(this.masterLeft, this.masterRight, null);

    // Copy to final hardware output buffers
    outputL.set(this.masterLeft);
    outputR.set(this.masterRight);
  }

  routeToDestination(dest, bL, bR) {
    const len = bL.length;
    if (dest === 'Group Master') {
      for (let i = 0; i < len; i++) {
        this.groupLeft[i] += bL[i];
        this.groupRight[i] += bR[i];
      }
    } else {
      // Default: Master
      for (let i = 0; i < len; i++) {
        this.masterLeft[i] += bL[i];
        this.masterRight[i] += bR[i];
      }
    }
  }

  // --- Real-time Meter Data for UI Animation ---
  getMeterSnapshot() {
    const channelMeters = {};
    for (const id in this.channels) {
      const ch = this.channels[id];
      channelMeters[id] = {
        peakL: ch.meterPeakL,
        peakR: ch.meterPeakR,
        rmsL: ch.meterRmsL,
        rmsR: ch.meterRmsR,
        clipL: ch.clipL,
        clipR: ch.clipR
      };
    }

    return {
      channels: channelMeters,
      vocalRack: this.vocalRack.getMeters(),
      musicRack: this.musicRack.getMeters(),
      activeVocalPreset: this.vocalRack.activePresetId,
      activeMusicPreset: this.musicRack.activePresetId
    };
  }

  setMasterBypass(val) {
    this.masterBypassed = val;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AudioEngine };
}
