/**
 * TBR DIGITAL MIXER — Audio Engine Integration Tests
 * Tests multi-track mixing, bus summing, aux sends, and rack integration
 */

const { AudioEngine } = require('../src/audio/AudioEngine');
const { VOCAL_PRESETS } = require('../src/presets/vocalPresets');
const { MUSIC_PRESETS } = require('../src/presets/musicPresets');

function runEngineTests() {
  console.log('=== [TEST] TBR DIGITAL MIXER — AUDIO ENGINE INTEGRATION TEST ===\n');

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
  const engine = new AudioEngine(sampleRate, blockSize);

  // 1. Channel initialization
  const channelKeys = Object.keys(engine.channels);
  assert(channelKeys.length === 11, `AudioEngine has 11 channel strips (got ${channelKeys.length})`);
  assert(engine.channels.vocal !== undefined, 'Vocal channel exists');
  assert(engine.channels.music !== undefined, 'Music channel exists');
  assert(engine.channels.groupMaster !== undefined, 'Group Master channel exists');
  assert(engine.channels.master !== undefined, 'Master channel exists');

  // 2. Audio Processing Block execution
  const inL = new Float32Array(blockSize);
  const inR = new Float32Array(blockSize);
  const outL = new Float32Array(blockSize);
  const outR = new Float32Array(blockSize);

  // Provide speech sine wave at 400Hz
  for (let i = 0; i < blockSize; i++) {
    inL[i] = Math.sin((2 * Math.PI * 400 * i) / sampleRate) * 0.5;
    inR[i] = inL[i];
  }

  engine.processBlock(inL, inR, outL, outR);

  let outPeak = 0;
  for (let i = 0; i < blockSize; i++) {
    const p = Math.max(Math.abs(outL[i]), Math.abs(outR[i]));
    if (p > outPeak) outPeak = p;
  }
  assert(outPeak > 0, `Audio processing produces audible output (peak: ${outPeak.toFixed(3)})`);

  // 3. Meter Snapshot
  const meters = engine.getMeterSnapshot();
  assert(meters.channels.vocal !== undefined, 'Meter snapshot contains Vocal channel');
  assert(meters.channels.master !== undefined, 'Meter snapshot contains Master channel');
  assert(meters.vocalRack !== undefined, 'Meter snapshot contains Vocal Rack meters');
  assert(meters.musicRack !== undefined, 'Meter snapshot contains Music Rack meters');

  // 4. Test Preset Switching across all 18 Vocal Presets
  let vocalSwitchPass = true;
  VOCAL_PRESETS.forEach(p => {
    try {
      engine.vocalRack.applyPreset(p);
      engine.processBlock(inL, inR, outL, outR);
    } catch (e) {
      console.error(`Failed on vocal preset ${p.name}:`, e);
      vocalSwitchPass = false;
    }
  });
  assert(vocalSwitchPass, 'All 18 Vocal Presets applied and processed cleanly without errors');

  // 5. Test Preset Switching across all 40 Music Presets
  let musicSwitchPass = true;
  MUSIC_PRESETS.forEach(p => {
    try {
      engine.musicRack.applyPreset(p);
      engine.processBlock(inL, inR, outL, outR);
    } catch (e) {
      console.error(`Failed on music preset ${p.name}:`, e);
      musicSwitchPass = false;
    }
  });
  assert(musicSwitchPass, 'All 40 Music Presets applied and processed cleanly without errors');

  // 6. Test Master Bypass
  engine.setMasterBypass(true);
  engine.processBlock(inL, inR, outL, outR);
  let bypassMatch = true;
  for (let i = 0; i < blockSize; i++) {
    if (Math.abs(outL[i] - inL[i]) > 1e-6) {
      bypassMatch = false;
      break;
    }
  }
  assert(bypassMatch, 'Master Bypass mode passes clean untouched audio');

  engine.setMasterBypass(false);

  // 7. Test Tone Generator Integration
  engine.toneGen.setMode('SINE', 1000, -12);
  const silenceL = new Float32Array(blockSize);
  const silenceR = new Float32Array(blockSize);
  engine.processBlock(silenceL, silenceR, outL, outR);
  let tonePeak = 0;
  for (let i = 0; i < blockSize; i++) {
    if (Math.abs(outL[i]) > tonePeak) tonePeak = Math.abs(outL[i]);
  }
  assert(tonePeak > 0.05, `Tone Generator generates 1kHz tone (peak: ${tonePeak.toFixed(3)})`);
  engine.toneGen.setMode('OFF');

  console.log(`\nEngine Tests Result: ${passed} Passed, ${failed} Failed\n`);
  return failed === 0;
}

if (require.main === module) {
  const ok = runEngineTests();
  process.exit(ok ? 0 : 1);
}

module.exports = { runEngineTests };
