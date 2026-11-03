/**
 * TBR DIGITAL MIXER — Preset Verification Test Suite
 * Tests completeness, structure, and validity of all 18 vocal and 40 music presets
 */

const { VOCAL_PRESETS } = require('../src/presets/vocalPresets');
const { MUSIC_PRESETS } = require('../src/presets/musicPresets');
const { PresetManager } = require('../src/presets/presetManager');

function runPresetTests() {
  console.log('=== [TEST] TBR DIGITAL MIXER — PRESET INTEGRITY TEST ===\n');

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

  // 1. Vocal Presets Count
  assert(VOCAL_PRESETS.length === 18, `Expected exactly 18 vocal presets, got ${VOCAL_PRESETS.length}`);

  // 2. Music Presets Count
  assert(MUSIC_PRESETS.length === 40, `Expected exactly 40 music presets, got ${MUSIC_PRESETS.length}`);

  // 3. Unique IDs
  const vocalIds = new Set(VOCAL_PRESETS.map(p => p.id));
  assert(vocalIds.size === 18, `All vocal preset IDs must be unique (found ${vocalIds.size})`);

  const musicIds = new Set(MUSIC_PRESETS.map(p => p.id));
  assert(musicIds.size === 40, `All music preset IDs must be unique (found ${musicIds.size})`);

  // 4. Required Categories in Vocal Presets
  const vocalCategories = new Set(VOCAL_PRESETS.map(p => p.category));
  assert(vocalCategories.has('Broadcast & Radio'), 'Vocal has category "Broadcast & Radio"');
  assert(vocalCategories.has('Natural & Warm'), 'Vocal has category "Natural & Warm"');
  assert(vocalCategories.has('Advanced Vocal'), 'Vocal has category "Advanced Vocal"');

  // 5. Required Categories in Music Presets
  const musicCategories = new Set(MUSIC_PRESETS.map(p => p.category));
  assert(musicCategories.has('General Music'), 'Music has category "General Music"');
  assert(musicCategories.has('Bass & Wide Sound'), 'Music has category "Bass & Wide Sound"');
  assert(musicCategories.has('Horeg & Party Sound'), 'Music has category "Horeg & Party Sound"');
  assert(musicCategories.has('Music Genre'), 'Music has category "Music Genre"');
  assert(musicCategories.has('Listener Comfort'), 'Music has category "Listener Comfort"');

  // 6. Check Specific Key Presets
  const horeg = MUSIC_PRESETS.find(p => p.id === 'horeg');
  assert(horeg && horeg.name === 'TBR HOREG', 'TBR HOREG preset exists');
  assert(horeg && horeg.subBass && horeg.subBass.enabled === true, 'TBR HOREG has subBass enabled');

  const broadcastPro = VOCAL_PRESETS.find(p => p.id === 'broadcast-pro');
  assert(broadcastPro && broadcastPro.name === 'TBR BROADCAST PRO', 'TBR BROADCAST PRO preset exists');
  assert(broadcastPro && broadcastPro.deEsser && broadcastPro.deEsser.enabled === true, 'TBR BROADCAST PRO has de-esser enabled');

  // 7. Verify PresetManager Custom Save and Immutability Protection
  const pm = new PresetManager();
  let threw = false;
  try {
    pm.saveCustomPreset('vocal', 'TBR BROADCAST PRO', {});
  } catch (e) {
    threw = true;
  }
  assert(threw, 'PresetManager rejects overwriting built-in preset with custom preset');

  const custom = pm.saveCustomPreset('vocal', 'My Custom Vocal', { hpf: { enabled: true, freq: 80 } });
  assert(custom && custom.name === 'My Custom Vocal', 'Custom preset can be saved');
  assert(pm.getAllVocalPresets().length === 19, 'Custom preset appears in list');

  pm.deleteCustomPreset('vocal', custom.id);
  assert(pm.getAllVocalPresets().length === 18, 'Custom preset can be deleted');

  console.log(`\nPreset Tests Result: ${passed} Passed, ${failed} Failed\n`);
  return failed === 0;
}

if (require.main === module) {
  const ok = runPresetTests();
  process.exit(ok ? 0 : 1);
}

module.exports = { runPresetTests };
