/**
 * TBR DIGITAL MIXER — Master Test Suite Runner
 */

const { runPresetTests } = require('./test_presets');
const { runDspTests } = require('./test_dsp');
const { runEngineTests } = require('./test_audio_engine');

console.log('================================================================');
console.log('       TBR DIGITAL MIXER — AUTOMATED SYSTEM TEST SUITE         ');
console.log('================================================================\n');

const p1 = runPresetTests();
const p2 = runDspTests();
const p3 = runEngineTests();

console.log('================================================================');
if (p1 && p2 && p3) {
  console.log(' [SUCCESS] ALL TBR DIGITAL MIXER TESTS PASSED 100%!');
  console.log('================================================================\n');
  process.exit(0);
} else {
  console.error(' [FAILURE] SOME TESTS FAILED. PLEASE REVIEW LOG ABOVE.');
  console.log('================================================================\n');
  process.exit(1);
}
