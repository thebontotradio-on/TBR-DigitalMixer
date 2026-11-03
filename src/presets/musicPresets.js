/**
 * TBR DIGITAL MIXER — Professional Music Preset Library
 * 40 Real Mastered Music Presets with actual DSP parameter configurations
 */

const MUSIC_PRESETS = [
  // =========================================================================
  // CATEGORY A: GENERAL MUSIC (1-8)
  // =========================================================================
  {
    id: 'music-master',
    name: 'TBR MUSIC MASTER',
    category: 'General Music',
    description: 'Mastering komersial seimbang untuk semua jenis rekaman. Low end bertenaga namun rapat, midrange vokal bersih, treble udara berkilau tanpa menusuk.',
    subBass: { enabled: true, freq: 50, drive: 10, blend: 15 },
    stereoWidth: { enabled: true, width: 120, bassMonoFreq: 110 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 65, gain: 2.8, q: 0.71, enabled: true },
        { type: 'peaking', freq: 160, gain: 0.8, q: 1.2, enabled: true },
        { type: 'peaking', freq: 350, gain: -1.5, q: 1.4, enabled: true },     // Clean up boxy mid
        { type: 'peaking', freq: 1000, gain: 0.0, q: 1.0, enabled: false },
        { type: 'peaking', freq: 2800, gain: 1.2, q: 1.1, enabled: true },     // Vocal clarity in mix
        { type: 'peaking', freq: 6200, gain: 1.5, q: 1.3, enabled: true },     // Instrument edge
        { type: 'highshelf', freq: 11000, gain: 2.5, q: 0.71, enabled: true }, // Polished sheen
        { type: 'peaking', freq: 16000, gain: 1.0, q: 0.9, enabled: true }
      ]
    },
    multiband: { lowGain: 1.8, midGain: 0.0, highGain: 1.5, lowCrossover: 140, highCrossover: 4500 },
    saturation: { enabled: true, type: 'tape', drive: 8, warmth: 20, mix: 25 },
    limiter: { enabled: true, ceiling: -0.3, release: 50, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.2
  },
  {
    id: 'premium-stereo',
    name: 'TBR PREMIUM STEREO',
    category: 'General Music',
    description: 'Pelebaran panggung stereo premium (Mid-Side matrix). Bass tetap mono di tengah sehingga punchy, instrumen samping meluas lapang.',
    subBass: { enabled: true, freq: 48, drive: 8, blend: 12 },
    stereoWidth: { enabled: true, width: 140, bassMonoFreq: 125 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 60, gain: 2.2, q: 0.71, enabled: true },
        { type: 'peaking', freq: 220, gain: 0.5, q: 1.2, enabled: true },
        { type: 'peaking', freq: 400, gain: -1.0, q: 1.3, enabled: true },
        { type: 'peaking', freq: 1500, gain: 0.8, q: 1.0, enabled: true },
        { type: 'peaking', freq: 3500, gain: 1.8, q: 1.2, enabled: true },
        { type: 'peaking', freq: 7500, gain: 2.2, q: 1.4, enabled: true },
        { type: 'highshelf', freq: 12000, gain: 3.2, q: 0.71, enabled: true },
        { type: 'peaking', freq: 17000, gain: 1.5, q: 0.8, enabled: true }
      ]
    },
    multiband: { lowGain: 1.2, midGain: 0.5, highGain: 2.2, lowCrossover: 130, highCrossover: 4000 },
    saturation: { enabled: true, type: 'analog', drive: 10, warmth: 18, mix: 25 },
    limiter: { enabled: true, ceiling: -0.3, release: 45, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.0
  },
  {
    id: 'wide-stereo',
    name: 'TBR WIDE STEREO',
    category: 'General Music',
    description: 'Panggung suara ultra-lebar untuk pengalaman mendengarkan headset maupun speaker ruangan luas tanpa kehilangan kestabilan vokal sentral.',
    subBass: { enabled: false, freq: 45, drive: 0, blend: 0 },
    stereoWidth: { enabled: true, width: 165, bassMonoFreq: 140 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 70, gain: 2.0, q: 0.71, enabled: true },
        { type: 'peaking', freq: 280, gain: -1.2, q: 1.3, enabled: true },
        { type: 'peaking', freq: 800, gain: 0.0, q: 1.0, enabled: false },
        { type: 'peaking', freq: 2200, gain: 1.5, q: 1.1, enabled: true },
        { type: 'peaking', freq: 5000, gain: 2.5, q: 1.3, enabled: true },
        { type: 'peaking', freq: 8500, gain: 3.0, q: 1.5, enabled: true },
        { type: 'highshelf', freq: 12500, gain: 3.8, q: 0.71, enabled: true },
        { type: 'peaking', freq: 18000, gain: 2.0, q: 0.8, enabled: true }
      ]
    },
    multiband: { lowGain: 1.0, midGain: 0.8, highGain: 2.8, lowCrossover: 150, highCrossover: 3800 },
    saturation: { enabled: true, type: 'analog', drive: 8, warmth: 15, mix: 20 },
    limiter: { enabled: true, ceiling: -0.4, release: 50, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 0.8
  },
  {
    id: 'warm-music',
    name: 'TBR WARM MUSIC',
    category: 'General Music',
    description: 'Sentuhan analog konsol rekaman klasik. Bass tebal bundar, nada tinggi halus tidak menyengat, sangat nyaman untuk sesi dengar maraton.',
    subBass: { enabled: true, freq: 55, drive: 12, blend: 18 },
    stereoWidth: { enabled: true, width: 110, bassMonoFreq: 100 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 90, gain: 3.5, q: 0.71, enabled: true },
        { type: 'peaking', freq: 200, gain: 2.0, q: 1.2, enabled: true },
        { type: 'peaking', freq: 450, gain: -1.2, q: 1.2, enabled: true },
        { type: 'peaking', freq: 1200, gain: 0.5, q: 1.0, enabled: true },
        { type: 'peaking', freq: 2800, gain: 0.8, q: 1.0, enabled: true },
        { type: 'peaking', freq: 5500, gain: -1.0, q: 1.5, enabled: true },     // Tame harsh edge
        { type: 'highshelf', freq: 10000, gain: 1.2, q: 0.71, enabled: true },
        { type: 'peaking', freq: 15000, gain: -1.5, q: 1.0, enabled: true }
      ]
    },
    multiband: { lowGain: 2.5, midGain: 0.8, highGain: -0.5, lowCrossover: 160, highCrossover: 4200 },
    saturation: { enabled: true, type: 'tube', drive: 18, warmth: 40, mix: 40 },
    limiter: { enabled: true, ceiling: -0.5, release: 60, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.0
  },
  {
    id: 'smooth-music',
    name: 'TBR SMOOTH MUSIC',
    category: 'General Music',
    description: 'Menjinakkan rekaman audio yang tajam atau kasar. Menghaluskan upper-midrange dan transien yang menusuk telinga.',
    subBass: { enabled: false, freq: 50, drive: 0, blend: 0 },
    stereoWidth: { enabled: true, width: 115, bassMonoFreq: 100 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 80, gain: 2.5, q: 0.71, enabled: true },
        { type: 'peaking', freq: 240, gain: 1.0, q: 1.1, enabled: true },
        { type: 'peaking', freq: 500, gain: -1.0, q: 1.2, enabled: true },
        { type: 'peaking', freq: 1500, gain: 0.0, q: 1.0, enabled: false },
        { type: 'peaking', freq: 3300, gain: -2.0, q: 1.6, enabled: true },    // Soften bite
        { type: 'peaking', freq: 6500, gain: -1.5, q: 1.8, enabled: true },
        { type: 'highshelf', freq: 10500, gain: 1.0, q: 0.71, enabled: true },
        { type: 'peaking', freq: 14000, gain: -1.0, q: 1.0, enabled: true }
      ]
    },
    multiband: { lowGain: 1.8, midGain: -0.8, highGain: -0.8, lowCrossover: 150, highCrossover: 3500 },
    saturation: { enabled: true, type: 'tape', drive: 12, warmth: 30, mix: 30 },
    limiter: { enabled: true, ceiling: -0.6, release: 70, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 0.8
  },
  {
    id: 'crystal-music',
    name: 'TBR CRYSTAL MUSIC',
    category: 'General Music',
    description: 'Kejernihan detail definisi tinggi (Hi-Res). Memperjelas petikan dawai, perkusi tajam, dan resonansi akustik ruangan secara presisi.',
    subBass: { enabled: true, freq: 45, drive: 5, blend: 8 },
    stereoWidth: { enabled: true, width: 130, bassMonoFreq: 115 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 60, gain: 2.0, q: 0.71, enabled: true },
        { type: 'peaking', freq: 200, gain: -1.0, q: 1.3, enabled: true },
        { type: 'peaking', freq: 600, gain: -1.5, q: 1.4, enabled: true },
        { type: 'peaking', freq: 2400, gain: 1.8, q: 1.1, enabled: true },
        { type: 'peaking', freq: 4800, gain: 2.5, q: 1.4, enabled: true },
        { type: 'peaking', freq: 8500, gain: 3.2, q: 1.5, enabled: true },
        { type: 'highshelf', freq: 12000, gain: 4.5, q: 0.71, enabled: true }, // Crystal sparkle
        { type: 'peaking', freq: 18000, gain: 2.5, q: 0.8, enabled: true }
      ]
    },
    multiband: { lowGain: 1.2, midGain: 0.5, highGain: 3.0, lowCrossover: 140, highCrossover: 4000 },
    saturation: { enabled: false, type: 'analog', drive: 0, warmth: 0, mix: 0 },
    limiter: { enabled: true, ceiling: -0.3, release: 40, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.0
  },
  {
    id: 'rich-full',
    name: 'TBR RICH & FULL',
    category: 'General Music',
    description: 'Kepadatan harmonik menyeluruh untuk rekaman yang terdengar tipis atau kering. Menjadikan suara musik megah dan berbobot.',
    subBass: { enabled: true, freq: 52, drive: 14, blend: 20 },
    stereoWidth: { enabled: true, width: 125, bassMonoFreq: 110 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 80, gain: 3.5, q: 0.71, enabled: true },
        { type: 'peaking', freq: 180, gain: 2.2, q: 1.2, enabled: true },
        { type: 'peaking', freq: 400, gain: -1.0, q: 1.2, enabled: true },
        { type: 'peaking', freq: 1200, gain: 1.5, q: 1.0, enabled: true },
        { type: 'peaking', freq: 2800, gain: 2.0, q: 1.2, enabled: true },
        { type: 'peaking', freq: 6000, gain: 1.8, q: 1.3, enabled: true },
        { type: 'highshelf', freq: 10500, gain: 2.8, q: 0.71, enabled: true },
        { type: 'peaking', freq: 15000, gain: 1.2, q: 0.9, enabled: true }
      ]
    },
    multiband: { lowGain: 2.8, midGain: 1.5, highGain: 1.8, lowCrossover: 160, highCrossover: 4500 },
    saturation: { enabled: true, type: 'tube', drive: 16, warmth: 35, mix: 35 },
    limiter: { enabled: true, ceiling: -0.4, release: 55, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.4
  },
  {
    id: 'natural-hifi',
    name: 'TBR NATURAL HI-FI',
    category: 'General Music',
    description: 'Karakter audiophile referensi datar (Flat True Response). Minim distorsi fasa, menjaga dinamika asli karya musik master.',
    subBass: { enabled: false, freq: 40, drive: 0, blend: 0 },
    stereoWidth: { enabled: true, width: 100, bassMonoFreq: 90 },
    eq: {
      enabled: true,
      bands: [
        { type: 'peaking', freq: 50, gain: 0.5, q: 1.0, enabled: true },
        { type: 'peaking', freq: 150, gain: 0.0, q: 1.0, enabled: false },
        { type: 'peaking', freq: 400, gain: 0.0, q: 1.0, enabled: false },
        { type: 'peaking', freq: 1000, gain: 0.0, q: 1.0, enabled: false },
        { type: 'peaking', freq: 3000, gain: 0.5, q: 1.0, enabled: true },
        { type: 'peaking', freq: 8000, gain: 0.8, q: 1.0, enabled: true },
        { type: 'highshelf', freq: 12000, gain: 1.0, q: 0.71, enabled: true },
        { type: 'peaking', freq: 18000, gain: 0.0, q: 1.0, enabled: false }
      ]
    },
    multiband: { lowGain: 0.5, midGain: 0.0, highGain: 0.8, lowCrossover: 120, highCrossover: 4000 },
    saturation: { enabled: false, type: 'analog', drive: 0, warmth: 0, mix: 0 },
    limiter: { enabled: true, ceiling: -0.8, release: 80, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 0.5
  },

  // =========================================================================
  // CATEGORY B: BASS & WIDE SOUND (9-15)
  // =========================================================================
  {
    id: 'deep-bass',
    name: 'TBR DEEP BASS',
    category: 'Bass & Wide Sound',
    description: 'Eksplorasi frekuensi sub-bass dalam (35-65Hz). Menghadirkan getaran rendah yang padat tanpa membuat midrange vokal keruh.',
    subBass: { enabled: true, freq: 42, drive: 22, blend: 30 },
    stereoWidth: { enabled: true, width: 120, bassMonoFreq: 110 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 55, gain: 5.5, q: 0.8, enabled: true },
        { type: 'peaking', freq: 110, gain: 2.2, q: 1.4, enabled: true },
        { type: 'peaking', freq: 250, gain: -2.5, q: 1.6, enabled: true },     // Kill mid bass mud
        { type: 'peaking', freq: 800, gain: -1.0, q: 1.2, enabled: true },
        { type: 'peaking', freq: 2500, gain: 1.0, q: 1.0, enabled: true },
        { type: 'peaking', freq: 5500, gain: 1.5, q: 1.3, enabled: true },
        { type: 'highshelf', freq: 10000, gain: 2.0, q: 0.71, enabled: true },
        { type: 'peaking', freq: 15000, gain: 0.5, q: 1.0, enabled: true }
      ]
    },
    multiband: { lowGain: 4.8, midGain: -0.5, highGain: 1.2, lowCrossover: 130, highCrossover: 4200 },
    saturation: { enabled: true, type: 'analog', drive: 15, warmth: 30, mix: 35 },
    limiter: { enabled: true, ceiling: -0.3, release: 45, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.5
  },
  {
    id: 'wide-bass',
    name: 'TBR WIDE BASS',
    category: 'Bass & Wide Sound',
    description: 'Bass solid terfokus di tengah, dipadukan dengan perluasan stereo low-mid dan instrumen pengiring untuk sensasi bass 3D menyelubungi ruangan.',
    subBass: { enabled: true, freq: 48, drive: 18, blend: 25 },
    stereoWidth: { enabled: true, width: 145, bassMonoFreq: 120 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 65, gain: 4.5, q: 0.71, enabled: true },
        { type: 'peaking', freq: 140, gain: 2.0, q: 1.2, enabled: true },
        { type: 'peaking', freq: 300, gain: -1.8, q: 1.4, enabled: true },
        { type: 'peaking', freq: 1200, gain: 0.8, q: 1.1, enabled: true },
        { type: 'peaking', freq: 3200, gain: 2.0, q: 1.2, enabled: true },
        { type: 'peaking', freq: 6500, gain: 2.5, q: 1.4, enabled: true },
        { type: 'highshelf', freq: 11000, gain: 3.0, q: 0.71, enabled: true },
        { type: 'peaking', freq: 16000, gain: 1.5, q: 0.9, enabled: true }
      ]
    },
    multiband: { lowGain: 3.8, midGain: 0.8, highGain: 2.5, lowCrossover: 140, highCrossover: 4000 },
    saturation: { enabled: true, type: 'tape', drive: 12, warmth: 25, mix: 30 },
    limiter: { enabled: true, ceiling: -0.3, release: 50, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.4
  },
  {
    id: 'powerful-bass',
    name: 'TBR POWERFUL BASS',
    category: 'Bass & Wide Sound',
    description: 'Hentakan kick drum dan bassline bertenaga tinggi. Sangat cocok untuk genre beat modern, dance, dan sound tester audio mobil/ruangan.',
    subBass: { enabled: true, freq: 52, drive: 25, blend: 35 },
    stereoWidth: { enabled: true, width: 125, bassMonoFreq: 110 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 58, gain: 5.2, q: 0.8, enabled: true },
        { type: 'peaking', freq: 95, gain: 3.8, q: 1.3, enabled: true },       // Kick thump
        { type: 'peaking', freq: 280, gain: -2.8, q: 1.5, enabled: true },     // Clean pocket
        { type: 'peaking', freq: 900, gain: -1.2, q: 1.2, enabled: true },
        { type: 'peaking', freq: 2600, gain: 1.8, q: 1.1, enabled: true },
        { type: 'peaking', freq: 5000, gain: 2.0, q: 1.3, enabled: true },
        { type: 'highshelf', freq: 10500, gain: 2.5, q: 0.71, enabled: true },
        { type: 'peaking', freq: 15000, gain: 1.0, q: 1.0, enabled: true }
      ]
    },
    multiband: { lowGain: 5.0, midGain: 0.2, highGain: 1.8, lowCrossover: 135, highCrossover: 4500 },
    saturation: { enabled: true, type: 'analog', drive: 16, warmth: 25, mix: 35 },
    limiter: { enabled: true, ceiling: -0.2, release: 40, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.8
  },
  {
    id: 'wide-deep',
    name: 'TBR WIDE & DEEP',
    category: 'Bass & Wide Sound',
    description: 'Sinergi bass sub-rendah berbobot dengan panggung suara stereo ekstra lapang. Suara terdengar sinematik dan mewah.',
    subBass: { enabled: true, freq: 44, drive: 20, blend: 28 },
    stereoWidth: { enabled: true, width: 155, bassMonoFreq: 125 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 50, gain: 5.0, q: 0.75, enabled: true },
        { type: 'peaking', freq: 130, gain: 2.2, q: 1.2, enabled: true },
        { type: 'peaking', freq: 320, gain: -2.0, q: 1.4, enabled: true },
        { type: 'peaking', freq: 1100, gain: 0.5, q: 1.1, enabled: true },
        { type: 'peaking', freq: 3000, gain: 2.2, q: 1.2, enabled: true },
        { type: 'peaking', freq: 6500, gain: 2.8, q: 1.4, enabled: true },
        { type: 'highshelf', freq: 11500, gain: 3.5, q: 0.71, enabled: true },
        { type: 'peaking', freq: 17000, gain: 2.0, q: 0.8, enabled: true }
      ]
    },
    multiband: { lowGain: 4.2, midGain: 0.5, highGain: 2.8, lowCrossover: 140, highCrossover: 4000 },
    saturation: { enabled: true, type: 'tape', drive: 14, warmth: 25, mix: 30 },
    limiter: { enabled: true, ceiling: -0.3, release: 50, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.5
  },
  {
    id: 'bass-impact',
    name: 'TBR BASS IMPACT',
    category: 'Bass & Wide Sound',
    description: 'Mengoptimalkan transien dinamika low-end. Memberikan hantaman drum bass yang tegas, instan, dan bebas distorsi clipping.',
    subBass: { enabled: true, freq: 55, drive: 20, blend: 25 },
    stereoWidth: { enabled: true, width: 115, bassMonoFreq: 105 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 60, gain: 4.5, q: 0.8, enabled: true },
        { type: 'peaking', freq: 85, gain: 4.2, q: 1.4, enabled: true },        // Impact body
        { type: 'peaking', freq: 240, gain: -2.5, q: 1.5, enabled: true },
        { type: 'peaking', freq: 1000, gain: -0.8, q: 1.1, enabled: true },
        { type: 'peaking', freq: 2800, gain: 1.8, q: 1.2, enabled: true },
        { type: 'peaking', freq: 5200, gain: 2.0, q: 1.3, enabled: true },
        { type: 'highshelf', freq: 10000, gain: 2.2, q: 0.71, enabled: true },
        { type: 'peaking', freq: 14000, gain: 0.5, q: 1.0, enabled: true }
      ]
    },
    multiband: { lowGain: 4.5, midGain: 0.0, highGain: 1.5, lowCrossover: 130, highCrossover: 4500 },
    saturation: { enabled: true, type: 'analog', drive: 15, warmth: 20, mix: 30 },
    limiter: { enabled: true, ceiling: -0.2, release: 35, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.6
  },
  {
    id: 'wide-premium',
    name: 'TBR WIDE PREMIUM',
    category: 'Bass & Wide Sound',
    description: 'Tata suara lebar kelas flagship. Separasi kanal kiri-kanan sangat transparan dengan sentuhan kilau frekuensi atas yang elegan.',
    subBass: { enabled: true, freq: 48, drive: 10, blend: 15 },
    stereoWidth: { enabled: true, width: 150, bassMonoFreq: 120 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 70, gain: 3.0, q: 0.71, enabled: true },
        { type: 'peaking', freq: 220, gain: 0.8, q: 1.2, enabled: true },
        { type: 'peaking', freq: 450, gain: -1.2, q: 1.3, enabled: true },
        { type: 'peaking', freq: 1400, gain: 1.0, q: 1.0, enabled: true },
        { type: 'peaking', freq: 3200, gain: 2.2, q: 1.2, enabled: true },
        { type: 'peaking', freq: 7000, gain: 2.8, q: 1.4, enabled: true },
        { type: 'highshelf', freq: 12000, gain: 3.8, q: 0.71, enabled: true },
        { type: 'peaking', freq: 17500, gain: 2.2, q: 0.8, enabled: true }
      ]
    },
    multiband: { lowGain: 2.5, midGain: 0.8, highGain: 2.8, lowCrossover: 140, highCrossover: 4000 },
    saturation: { enabled: true, type: 'tape', drive: 10, warmth: 20, mix: 25 },
    limiter: { enabled: true, ceiling: -0.3, release: 45, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.2
  },
  {
    id: 'sub-bass-control',
    name: 'TBR SUB BASS CONTROL',
    category: 'Bass & Wide Sound',
    description: 'Manajemen frekuensi sub-bass presisi. Memotong subsonic liar di bawah 28Hz dan memfokuskan energi pada 45-70Hz agar woofer bekerja efisien.',
    subBass: { enabled: true, freq: 50, drive: 16, blend: 24 },
    stereoWidth: { enabled: true, width: 110, bassMonoFreq: 110 },
    eq: {
      enabled: true,
      bands: [
        { type: 'highpass', freq: 28, gain: 0, q: 0.71, enabled: true },        // Subsonic cut
        { type: 'peaking', freq: 55, gain: 4.8, q: 1.3, enabled: true },        // Clean sub punch
        { type: 'peaking', freq: 110, gain: 1.5, q: 1.2, enabled: true },
        { type: 'peaking', freq: 260, gain: -2.8, q: 1.6, enabled: true },     // Kill mid mud
        { type: 'peaking', freq: 1200, gain: 0.5, q: 1.0, enabled: true },
        { type: 'peaking', freq: 3000, gain: 1.5, q: 1.2, enabled: true },
        { type: 'highshelf', freq: 10000, gain: 2.0, q: 0.71, enabled: true },
        { type: 'peaking', freq: 15000, gain: 0.5, q: 1.0, enabled: false }
      ]
    },
    multiband: { lowGain: 3.8, midGain: 0.0, highGain: 1.2, lowCrossover: 120, highCrossover: 4500 },
    saturation: { enabled: true, type: 'analog', drive: 12, warmth: 20, mix: 30 },
    limiter: { enabled: true, ceiling: -0.4, release: 50, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.2
  },

  // =========================================================================
  // CATEGORY C: HOREG & PARTY SOUND (16-21)
  // =========================================================================
  {
    id: 'horeg',
    name: 'TBR HOREG',
    category: 'Horeg & Party Sound',
    description: 'Karakter sound system audio hajatan / miniatur Horeg Indonesia. Sub-bass menggetarkan dada (45-60Hz +6dB), kick mantap, vokal tetap bersih, anti-clipping limiter.',
    subBass: { enabled: true, freq: 48, drive: 35, blend: 45 },
    stereoWidth: { enabled: true, width: 125, bassMonoFreq: 115 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 52, gain: 6.8, q: 0.85, enabled: true },      // Thunderous Horeg sub
        { type: 'peaking', freq: 95, gain: 4.5, q: 1.3, enabled: true },        // Kick punch
        { type: 'peaking', freq: 220, gain: -2.2, q: 1.5, enabled: true },      // Mid clean up
        { type: 'peaking', freq: 800, gain: -1.5, q: 1.2, enabled: true },
        { type: 'peaking', freq: 2400, gain: 2.0, q: 1.1, enabled: true },      // Vocal presence
        { type: 'peaking', freq: 4200, gain: -1.0, q: 1.6, enabled: true },     // Anti-harsh protection
        { type: 'highshelf', freq: 9500, gain: 2.8, q: 0.71, enabled: true },  // Controlled treble
        { type: 'peaking', freq: 14000, gain: 1.0, q: 1.0, enabled: true }
      ]
    },
    multiband: { lowGain: 6.5, midGain: 0.5, highGain: 2.0, lowCrossover: 140, highCrossover: 4200 },
    saturation: { enabled: true, type: 'analog', drive: 24, warmth: 40, mix: 45 },
    limiter: { enabled: true, ceiling: -0.2, release: 45, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.5,
    outputGain: 2.2
  },
  {
    id: 'horeg-extreme',
    name: 'TBR HOREG EXTREME',
    category: 'Horeg & Party Sound',
    description: 'Tenaga bass Horeg tingkat maksimal. Sintesis sub-harmonik aktif untuk hentakan ekstrem pada speaker besar tanpa terjadi audio distorting.',
    subBass: { enabled: true, freq: 44, drive: 50, blend: 60 },
    stereoWidth: { enabled: true, width: 130, bassMonoFreq: 120 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 48, gain: 8.5, q: 0.9, enabled: true },       // Ultra deep SPL
        { type: 'peaking', freq: 90, gain: 5.5, q: 1.4, enabled: true },        // Heavy kick
        { type: 'peaking', freq: 240, gain: -3.0, q: 1.6, enabled: true },      // Prevent mud explosion
        { type: 'peaking', freq: 750, gain: -1.8, q: 1.3, enabled: true },
        { type: 'peaking', freq: 2500, gain: 2.2, q: 1.2, enabled: true },
        { type: 'peaking', freq: 4000, gain: -1.5, q: 1.8, enabled: true },     // Safe ear filter
        { type: 'highshelf', freq: 9000, gain: 2.5, q: 0.71, enabled: true },
        { type: 'peaking', freq: 13500, gain: 0.5, q: 1.0, enabled: true }
      ]
    },
    multiband: { lowGain: 8.0, midGain: 0.2, highGain: 1.8, lowCrossover: 145, highCrossover: 4000 },
    saturation: { enabled: true, type: 'tube', drive: 30, warmth: 50, mix: 50 },
    limiter: { enabled: true, ceiling: -0.1, release: 40, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 1.0,
    outputGain: 2.6
  },
  {
    id: 'horeg-wide',
    name: 'TBR HOREG WIDE',
    category: 'Horeg & Party Sound',
    description: 'Sensasi sound system lapangan terbuka. Gelombang bass sub melimpah dengan tata panggung audio lebar layaknya menonton konser outdoor.',
    subBass: { enabled: true, freq: 46, drive: 38, blend: 48 },
    stereoWidth: { enabled: true, width: 155, bassMonoFreq: 125 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 52, gain: 7.0, q: 0.8, enabled: true },
        { type: 'peaking', freq: 100, gain: 4.0, q: 1.3, enabled: true },
        { type: 'peaking', freq: 260, gain: -2.5, q: 1.5, enabled: true },
        { type: 'peaking', freq: 1000, gain: 0.5, q: 1.1, enabled: true },
        { type: 'peaking', freq: 2800, gain: 2.2, q: 1.2, enabled: true },
        { type: 'peaking', freq: 6000, gain: 2.5, q: 1.4, enabled: true },
        { type: 'highshelf', freq: 10500, gain: 3.5, q: 0.71, enabled: true },
        { type: 'peaking', freq: 16000, gain: 2.0, q: 0.8, enabled: true }
      ]
    },
    multiband: { lowGain: 6.8, midGain: 1.0, highGain: 3.0, lowCrossover: 140, highCrossover: 4200 },
    saturation: { enabled: true, type: 'analog', drive: 22, warmth: 35, mix: 40 },
    limiter: { enabled: true, ceiling: -0.2, release: 50, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.5,
    outputGain: 2.2
  },
  {
    id: 'party-bass',
    name: 'TBR PARTY BASS',
    category: 'Horeg & Party Sound',
    description: 'Preset pesta dancefloor berenergi tinggi. Menghidupkan suasana party dengan hentakan 4/4 yang enerjik dan kilau treble perkusi.',
    subBass: { enabled: true, freq: 55, drive: 28, blend: 35 },
    stereoWidth: { enabled: true, width: 135, bassMonoFreq: 110 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 60, gain: 5.5, q: 0.8, enabled: true },
        { type: 'peaking', freq: 110, gain: 3.8, q: 1.3, enabled: true },
        { type: 'peaking', freq: 350, gain: -2.0, q: 1.4, enabled: true },
        { type: 'peaking', freq: 1500, gain: 1.0, q: 1.1, enabled: true },
        { type: 'peaking', freq: 3200, gain: 2.5, q: 1.3, enabled: true },
        { type: 'peaking', freq: 7000, gain: 3.0, q: 1.4, enabled: true },
        { type: 'highshelf', freq: 11000, gain: 3.8, q: 0.71, enabled: true },
        { type: 'peaking', freq: 16000, gain: 1.8, q: 0.9, enabled: true }
      ]
    },
    multiband: { lowGain: 5.2, midGain: 0.8, highGain: 3.2, lowCrossover: 140, highCrossover: 4500 },
    saturation: { enabled: true, type: 'analog', drive: 18, warmth: 25, mix: 35 },
    limiter: { enabled: true, ceiling: -0.2, release: 40, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.8
  },
  {
    id: 'club-power',
    name: 'TBR CLUB POWER',
    category: 'Horeg & Party Sound',
    description: 'Karakter sound system club elit. Kompresi pompa optik kencang, bass padat menggelegar, dan batas limiter kencang target -9 LUFS.',
    subBass: { enabled: true, freq: 50, drive: 30, blend: 38 },
    stereoWidth: { enabled: true, width: 130, bassMonoFreq: 115 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 55, gain: 6.0, q: 0.85, enabled: true },
        { type: 'peaking', freq: 100, gain: 4.2, q: 1.3, enabled: true },
        { type: 'peaking', freq: 280, gain: -2.2, q: 1.5, enabled: true },
        { type: 'peaking', freq: 1200, gain: 0.8, q: 1.1, enabled: true },
        { type: 'peaking', freq: 2800, gain: 2.2, q: 1.2, enabled: true },
        { type: 'peaking', freq: 6500, gain: 2.8, q: 1.4, enabled: true },
        { type: 'highshelf', freq: 11000, gain: 3.2, q: 0.71, enabled: true },
        { type: 'peaking', freq: 15500, gain: 1.5, q: 1.0, enabled: true }
      ]
    },
    multiband: { lowGain: 5.8, midGain: 0.5, highGain: 2.8, lowCrossover: 145, highCrossover: 4200 },
    saturation: { enabled: true, type: 'tube', drive: 20, warmth: 30, mix: 40 },
    limiter: { enabled: true, ceiling: -0.1, release: 35, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.5,
    outputGain: 2.0
  },
  {
    id: 'dj-experience',
    name: 'TBR DJ EXPERIENCE',
    category: 'Horeg & Party Sound',
    description: 'Settingan monitor booth DJ. Kick drum dan snare terpisah jelas, transisi musik halus tanpa tumpang tindih frekuensi yang memekakkan.',
    subBass: { enabled: true, freq: 52, drive: 22, blend: 28 },
    stereoWidth: { enabled: true, width: 120, bassMonoFreq: 110 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 65, gain: 4.8, q: 0.8, enabled: true },
        { type: 'peaking', freq: 120, gain: 3.0, q: 1.2, enabled: true },
        { type: 'peaking', freq: 300, gain: -2.0, q: 1.4, enabled: true },
        { type: 'peaking', freq: 1800, gain: 1.8, q: 1.2, enabled: true },      // Snare snap
        { type: 'peaking', freq: 3500, gain: 2.5, q: 1.3, enabled: true },
        { type: 'peaking', freq: 7200, gain: 2.8, q: 1.4, enabled: true },      // Hi-hat crispness
        { type: 'highshelf', freq: 11500, gain: 3.0, q: 0.71, enabled: true },
        { type: 'peaking', freq: 16000, gain: 1.0, q: 1.0, enabled: true }
      ]
    },
    multiband: { lowGain: 4.5, midGain: 1.2, highGain: 2.5, lowCrossover: 140, highCrossover: 4500 },
    saturation: { enabled: true, type: 'analog', drive: 15, warmth: 20, mix: 30 },
    limiter: { enabled: true, ceiling: -0.2, release: 40, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.6
  },

  // =========================================================================
  // CATEGORY D: MUSIC GENRE (22-35)
  // =========================================================================
  {
    id: 'genre-rock',
    name: 'TBR ROCK',
    category: 'Music Genre',
    description: 'Karakter rock bertenaga. Midrange gitar listrik agresif (2.5kHz), dentuman bass 80Hz rapat, dan pukulan snare snappy.',
    subBass: { enabled: true, freq: 58, drive: 15, blend: 20 },
    stereoWidth: { enabled: true, width: 120, bassMonoFreq: 100 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 80, gain: 3.2, q: 0.8, enabled: true },
        { type: 'peaking', freq: 180, gain: 1.5, q: 1.2, enabled: true },
        { type: 'peaking', freq: 450, gain: -1.8, q: 1.4, enabled: true },
        { type: 'peaking', freq: 1200, gain: 1.2, q: 1.1, enabled: true },
        { type: 'peaking', freq: 2600, gain: 3.2, q: 1.3, enabled: true },      // Rock guitar bite
        { type: 'peaking', freq: 5000, gain: 2.2, q: 1.4, enabled: true },
        { type: 'highshelf', freq: 10000, gain: 2.5, q: 0.71, enabled: true },
        { type: 'peaking', freq: 14000, gain: 1.0, q: 1.0, enabled: true }
      ]
    },
    multiband: { lowGain: 3.0, midGain: 2.2, highGain: 2.0, lowCrossover: 150, highCrossover: 4000 },
    saturation: { enabled: true, type: 'analog', drive: 20, warmth: 25, mix: 35 },
    limiter: { enabled: true, ceiling: -0.3, release: 45, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.4
  },
  {
    id: 'genre-pop',
    name: 'TBR POP',
    category: 'Music Genre',
    description: 'Produksi musik pop modern radio-ready. Vokal dipoles bersinar di atas beat yang presisi, bass bersih dan transien rapi.',
    subBass: { enabled: true, freq: 50, drive: 12, blend: 18 },
    stereoWidth: { enabled: true, width: 125, bassMonoFreq: 110 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 65, gain: 2.8, q: 0.71, enabled: true },
        { type: 'peaking', freq: 150, gain: 1.0, q: 1.1, enabled: true },
        { type: 'peaking', freq: 350, gain: -1.5, q: 1.3, enabled: true },
        { type: 'peaking', freq: 1500, gain: 1.0, q: 1.0, enabled: true },
        { type: 'peaking', freq: 3200, gain: 2.5, q: 1.2, enabled: true },      // Pop vocal sheen
        { type: 'peaking', freq: 6500, gain: 2.2, q: 1.4, enabled: true },
        { type: 'highshelf', freq: 11000, gain: 3.5, q: 0.71, enabled: true },
        { type: 'peaking', freq: 16000, gain: 1.8, q: 0.9, enabled: true }
      ]
    },
    multiband: { lowGain: 2.5, midGain: 1.0, highGain: 2.5, lowCrossover: 140, highCrossover: 4500 },
    saturation: { enabled: true, type: 'tape', drive: 10, warmth: 18, mix: 25 },
    limiter: { enabled: true, ceiling: -0.3, release: 45, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.2
  },
  {
    id: 'genre-heavy-metal',
    name: 'TBR HEAVY METAL',
    category: 'Music Genre',
    description: 'Scooped midrange klasik metal. Distorsi distorsi gahar, bass drum cepat terartikulasi tanpa saling tumpang tindih.',
    subBass: { enabled: true, freq: 55, drive: 20, blend: 25 },
    stereoWidth: { enabled: true, width: 130, bassMonoFreq: 110 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 70, gain: 4.5, q: 0.8, enabled: true },
        { type: 'peaking', freq: 140, gain: 2.5, q: 1.3, enabled: true },
        { type: 'peaking', freq: 550, gain: -3.5, q: 1.8, enabled: true },     // Classic metal scoop
        { type: 'peaking', freq: 1200, gain: -1.0, q: 1.2, enabled: true },
        { type: 'peaking', freq: 3000, gain: 3.5, q: 1.4, enabled: true },     // Razor crunch
        { type: 'peaking', freq: 5500, gain: 2.5, q: 1.5, enabled: true },
        { type: 'highshelf', freq: 10000, gain: 3.0, q: 0.71, enabled: true }, // Cymbal wash
        { type: 'peaking', freq: 15000, gain: 1.0, q: 1.0, enabled: true }
      ]
    },
    multiband: { lowGain: 4.2, midGain: -1.5, highGain: 3.0, lowCrossover: 150, highCrossover: 3800 },
    saturation: { enabled: true, type: 'analog', drive: 25, warmth: 20, mix: 40 },
    limiter: { enabled: true, ceiling: -0.2, release: 35, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.5
  },
  {
    id: 'genre-jazz',
    name: 'TBR JAZZ',
    category: 'Music Genre',
    description: 'Ruang dinamika luas khas musik jazz. Resonansi contrabass kayu hangat, cymbal halus seperti sapuan kuas asli.',
    subBass: { enabled: false, freq: 50, drive: 0, blend: 0 },
    stereoWidth: { enabled: true, width: 110, bassMonoFreq: 95 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 85, gain: 2.0, q: 0.71, enabled: true },
        { type: 'peaking', freq: 180, gain: 2.2, q: 1.2, enabled: true },      // Upright bass body
        { type: 'peaking', freq: 400, gain: -0.8, q: 1.2, enabled: true },
        { type: 'peaking', freq: 1100, gain: 1.0, q: 1.0, enabled: true },
        { type: 'peaking', freq: 2800, gain: 1.2, q: 1.1, enabled: true },
        { type: 'peaking', freq: 6000, gain: 1.5, q: 1.3, enabled: true },
        { type: 'highshelf', freq: 11000, gain: 2.0, q: 0.71, enabled: true }, // Smooth ride cymbal
        { type: 'peaking', freq: 16000, gain: 0.8, q: 0.9, enabled: true }
      ]
    },
    multiband: { lowGain: 1.8, midGain: 0.8, highGain: 1.5, lowCrossover: 160, highCrossover: 4000 },
    saturation: { enabled: true, type: 'tape', drive: 8, warmth: 25, mix: 20 },
    limiter: { enabled: true, ceiling: -0.8, release: 80, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 0.5
  },
  {
    id: 'genre-classical',
    name: 'TBR CLASSICAL',
    category: 'Music Genre',
    description: 'Akustik gedung konser orkestra megah. Kompresi sangat transparan, mempertahankan rentang pianissimo hingga fortissimo murni.',
    subBass: { enabled: false, freq: 40, drive: 0, blend: 0 },
    stereoWidth: { enabled: true, width: 125, bassMonoFreq: 90 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 60, gain: 1.2, q: 0.71, enabled: true },
        { type: 'peaking', freq: 220, gain: 0.5, q: 1.1, enabled: true },
        { type: 'peaking', freq: 600, gain: 0.0, q: 1.0, enabled: false },
        { type: 'peaking', freq: 1500, gain: 0.8, q: 1.0, enabled: true },
        { type: 'peaking', freq: 3500, gain: 1.2, q: 1.2, enabled: true },
        { type: 'peaking', freq: 7000, gain: 1.5, q: 1.4, enabled: true },
        { type: 'highshelf', freq: 12000, gain: 2.2, q: 0.71, enabled: true }, // Hall air
        { type: 'peaking', freq: 18000, gain: 1.0, q: 0.8, enabled: true }
      ]
    },
    multiband: { lowGain: 0.8, midGain: 0.2, highGain: 1.2, lowCrossover: 140, highCrossover: 4200 },
    saturation: { enabled: false, type: 'analog', drive: 0, warmth: 0, mix: 0 },
    limiter: { enabled: true, ceiling: -1.0, release: 100, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 0.2
  },
  {
    id: 'genre-acoustic',
    name: 'TBR ACOUSTIC',
    category: 'Music Genre',
    description: 'Resonansi gitar kayu dan piano intim. Petikan senar terasa dekat di telinga dengan kehangatan ruangan yang alami.',
    subBass: { enabled: false, freq: 50, drive: 0, blend: 0 },
    stereoWidth: { enabled: true, width: 120, bassMonoFreq: 100 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 80, gain: 2.2, q: 0.71, enabled: true },
        { type: 'peaking', freq: 180, gain: 2.0, q: 1.2, enabled: true },      // Guitar body
        { type: 'peaking', freq: 380, gain: -1.8, q: 1.4, enabled: true },     // Remove boxy sound
        { type: 'peaking', freq: 1400, gain: 1.2, q: 1.1, enabled: true },
        { type: 'peaking', freq: 3500, gain: 2.8, q: 1.3, enabled: true },     // Fingerpick detail
        { type: 'peaking', freq: 6500, gain: 2.0, q: 1.4, enabled: true },
        { type: 'highshelf', freq: 11000, gain: 3.0, q: 0.71, enabled: true },
        { type: 'peaking', freq: 16000, gain: 1.2, q: 0.9, enabled: true }
      ]
    },
    multiband: { lowGain: 1.8, midGain: 1.2, highGain: 2.2, lowCrossover: 150, highCrossover: 4000 },
    saturation: { enabled: true, type: 'tape', drive: 10, warmth: 25, mix: 25 },
    limiter: { enabled: true, ceiling: -0.5, release: 60, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 0.8
  },
  {
    id: 'genre-edm',
    name: 'TBR EDM',
    category: 'Music Genre',
    description: 'Kekuatan musik elektronik modern. Sub bass 40Hz menggetarkan, supersaw stereo lebar, dan dynamic drop yang meledak bertenaga.',
    subBass: { enabled: true, freq: 44, drive: 30, blend: 40 },
    stereoWidth: { enabled: true, width: 150, bassMonoFreq: 120 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 50, gain: 6.0, q: 0.8, enabled: true },
        { type: 'peaking', freq: 95, gain: 4.0, q: 1.3, enabled: true },
        { type: 'peaking', freq: 300, gain: -2.5, q: 1.5, enabled: true },
        { type: 'peaking', freq: 1200, gain: 0.5, q: 1.1, enabled: true },
        { type: 'peaking', freq: 3000, gain: 2.5, q: 1.2, enabled: true },
        { type: 'peaking', freq: 7000, gain: 3.5, q: 1.4, enabled: true },      // Synth shimmer
        { type: 'highshelf', freq: 11500, gain: 4.2, q: 0.71, enabled: true },
        { type: 'peaking', freq: 16500, gain: 2.0, q: 0.9, enabled: true }
      ]
    },
    multiband: { lowGain: 5.8, midGain: 0.8, highGain: 3.5, lowCrossover: 140, highCrossover: 4500 },
    saturation: { enabled: true, type: 'analog', drive: 18, warmth: 25, mix: 35 },
    limiter: { enabled: true, ceiling: -0.2, release: 40, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.5,
    outputGain: 1.8
  },
  {
    id: 'genre-hip-hop',
    name: 'TBR HIP HOP',
    category: 'Music Genre',
    description: 'Saturasi sub-bass 808 tebal (35-55Hz), hi-hat trap tajam dan snappy, serta ruang vokal rap yang maju ke depan.',
    subBass: { enabled: true, freq: 42, drive: 32, blend: 42 },
    stereoWidth: { enabled: true, width: 125, bassMonoFreq: 115 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 50, gain: 6.5, q: 0.85, enabled: true },      // 808 sub weight
        { type: 'peaking', freq: 110, gain: 3.0, q: 1.3, enabled: true },
        { type: 'peaking', freq: 320, gain: -3.0, q: 1.6, enabled: true },     // Clean room for 808
        { type: 'peaking', freq: 1500, gain: 1.2, q: 1.1, enabled: true },
        { type: 'peaking', freq: 3200, gain: 3.0, q: 1.3, enabled: true },      // Rap vocal punch
        { type: 'peaking', freq: 8500, gain: 3.8, q: 1.4, enabled: true },      // Trap hats
        { type: 'highshelf', freq: 12000, gain: 3.5, q: 0.71, enabled: true },
        { type: 'peaking', freq: 16000, gain: 1.5, q: 0.9, enabled: true }
      ]
    },
    multiband: { lowGain: 6.2, midGain: 1.0, highGain: 3.0, lowCrossover: 135, highCrossover: 4500 },
    saturation: { enabled: true, type: 'tube', drive: 22, warmth: 35, mix: 40 },
    limiter: { enabled: true, ceiling: -0.2, release: 40, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.5,
    outputGain: 2.0
  },
  {
    id: 'genre-reggae',
    name: 'TBR REGGAE',
    category: 'Music Genre',
    description: 'Dub bass bergulir hangat (50-100Hz), midrange santai untuk organ skank, serta snare rimshot punchy berkarakter analog.',
    subBass: { enabled: true, freq: 50, drive: 18, blend: 25 },
    stereoWidth: { enabled: true, width: 115, bassMonoFreq: 105 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 75, gain: 4.5, q: 0.8, enabled: true },       // Rolling dub low
        { type: 'peaking', freq: 160, gain: 2.5, q: 1.2, enabled: true },
        { type: 'peaking', freq: 450, gain: -1.5, q: 1.2, enabled: true },
        { type: 'peaking', freq: 1200, gain: 1.0, q: 1.0, enabled: true },
        { type: 'peaking', freq: 2800, gain: 1.8, q: 1.2, enabled: true },
        { type: 'peaking', freq: 5500, gain: 1.2, q: 1.4, enabled: true },
        { type: 'highshelf', freq: 9500, gain: 1.5, q: 0.71, enabled: true },
        { type: 'peaking', freq: 14000, gain: -0.5, q: 1.0, enabled: true }
      ]
    },
    multiband: { lowGain: 4.2, midGain: 0.5, highGain: 1.0, lowCrossover: 150, highCrossover: 4000 },
    saturation: { enabled: true, type: 'tape', drive: 18, warmth: 35, mix: 35 },
    limiter: { enabled: true, ceiling: -0.4, release: 55, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.2
  },
  {
    id: 'genre-dangdut',
    name: 'TBR DANGDUT',
    category: 'Music Genre',
    description: 'Pemisahan frekuensi kendang presisi: ketukan Tung bass padat di 70Hz dan tepukan Tak renyah di 4.5kHz. Suling dan vokal jernih menawan.',
    subBass: { enabled: true, freq: 52, drive: 22, blend: 28 },
    stereoWidth: { enabled: true, width: 125, bassMonoFreq: 110 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 65, gain: 4.8, q: 0.8, enabled: true },       // Kendang 'Tung' sub
        { type: 'peaking', freq: 110, gain: 3.2, q: 1.3, enabled: true },
        { type: 'peaking', freq: 280, gain: -2.5, q: 1.5, enabled: true },      // Separasi kendang-bass
        { type: 'peaking', freq: 1400, gain: 1.5, q: 1.1, enabled: true },      // Melodi suling & mandolin
        { type: 'peaking', freq: 3200, gain: 2.8, q: 1.2, enabled: true },      // Vokal dangdut cengkok
        { type: 'peaking', freq: 4800, gain: 4.0, q: 1.5, enabled: true },      // Kendang 'Tak' slap crisp
        { type: 'highshelf', freq: 10500, gain: 3.5, q: 0.71, enabled: true },  // Simbal & tamborin renyah
        { type: 'peaking', freq: 15500, gain: 1.5, q: 0.9, enabled: true }
      ]
    },
    multiband: { lowGain: 4.5, midGain: 1.8, highGain: 3.2, lowCrossover: 140, highCrossover: 4200 },
    saturation: { enabled: true, type: 'analog', drive: 16, warmth: 28, mix: 35 },
    limiter: { enabled: true, ceiling: -0.2, release: 45, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.8
  },
  {
    id: 'genre-live-concert',
    name: 'TBR LIVE CONCERT',
    category: 'Music Genre',
    description: 'Simulasi megah konser stadion langsung. Bobot bass PA lapangan, suasana reverberasi ruangan besar, dan gema panggung mendalam.',
    subBass: { enabled: true, freq: 46, drive: 25, blend: 35 },
    stereoWidth: { enabled: true, width: 150, bassMonoFreq: 120 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 55, gain: 5.5, q: 0.8, enabled: true },       // Arena sub thump
        { type: 'peaking', freq: 130, gain: 2.5, q: 1.2, enabled: true },
        { type: 'peaking', freq: 350, gain: -1.8, q: 1.3, enabled: true },
        { type: 'peaking', freq: 1200, gain: 1.0, q: 1.0, enabled: true },
        { type: 'peaking', freq: 2800, gain: 2.2, q: 1.2, enabled: true },
        { type: 'peaking', freq: 5800, gain: 2.5, q: 1.4, enabled: true },
        { type: 'highshelf', freq: 11000, gain: 3.5, q: 0.71, enabled: true }, // Crowd air
        { type: 'peaking', freq: 16000, gain: 2.0, q: 0.8, enabled: true }
      ]
    },
    multiband: { lowGain: 4.8, midGain: 1.2, highGain: 2.8, lowCrossover: 145, highCrossover: 4200 },
    saturation: { enabled: true, type: 'analog', drive: 18, warmth: 30, mix: 35 },
    limiter: { enabled: true, ceiling: -0.3, release: 50, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.5
  },
  {
    id: 'genre-deep-house',
    name: 'TBR DEEP HOUSE',
    category: 'Music Genre',
    description: 'Irama 4/4 hipnotis yang lembut dan hangat. Sub-bass 50Hz bulat membalut vokal soul dan melodi synth chords yang menenangkan.',
    subBass: { enabled: true, freq: 48, drive: 24, blend: 32 },
    stereoWidth: { enabled: true, width: 135, bassMonoFreq: 115 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 55, gain: 5.2, q: 0.8, enabled: true },
        { type: 'peaking', freq: 110, gain: 3.2, q: 1.2, enabled: true },
        { type: 'peaking', freq: 280, gain: -2.0, q: 1.4, enabled: true },
        { type: 'peaking', freq: 1100, gain: 0.8, q: 1.1, enabled: true },
        { type: 'peaking', freq: 2600, gain: 1.5, q: 1.2, enabled: true },
        { type: 'peaking', freq: 5500, gain: 1.8, q: 1.4, enabled: true },
        { type: 'highshelf', freq: 10500, gain: 2.2, q: 0.71, enabled: true },
        { type: 'peaking', freq: 15000, gain: 0.5, q: 1.0, enabled: true }
      ]
    },
    multiband: { lowGain: 4.8, midGain: 0.8, highGain: 2.0, lowCrossover: 140, highCrossover: 4000 },
    saturation: { enabled: true, type: 'tape', drive: 15, warmth: 35, mix: 35 },
    limiter: { enabled: true, ceiling: -0.3, release: 45, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.4
  },
  {
    id: 'genre-rnb',
    name: 'TBR R&B',
    category: 'Music Genre',
    description: 'Sentuhan vokal halus selemput sutra, bassline tebal hangat, keyboard vintage Rhodes lembut, dan perkusi rapi tanpa rasa lelah telinga.',
    subBass: { enabled: true, freq: 46, drive: 20, blend: 26 },
    stereoWidth: { enabled: true, width: 125, bassMonoFreq: 110 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 65, gain: 4.0, q: 0.8, enabled: true },
        { type: 'peaking', freq: 160, gain: 2.0, q: 1.2, enabled: true },
        { type: 'peaking', freq: 380, gain: -2.0, q: 1.4, enabled: true },
        { type: 'peaking', freq: 1400, gain: 1.2, q: 1.1, enabled: true },
        { type: 'peaking', freq: 3000, gain: 2.2, q: 1.2, enabled: true },
        { type: 'peaking', freq: 6200, gain: 1.8, q: 1.4, enabled: true },
        { type: 'highshelf', freq: 11000, gain: 2.8, q: 0.71, enabled: true },
        { type: 'peaking', freq: 16000, gain: 1.2, q: 0.9, enabled: true }
      ]
    },
    multiband: { lowGain: 3.5, midGain: 1.0, highGain: 2.0, lowCrossover: 140, highCrossover: 4200 },
    saturation: { enabled: true, type: 'tube', drive: 14, warmth: 30, mix: 35 },
    limiter: { enabled: true, ceiling: -0.4, release: 50, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.2
  },
  {
    id: 'genre-ballad',
    name: 'TBR BALLAD',
    category: 'Music Genre',
    description: 'Emosional dan intim. Mengedepankan fokus vokal utama didukung alunan piano akustik dan orkestrasi senar string yang megah lembut.',
    subBass: { enabled: false, freq: 50, drive: 0, blend: 0 },
    stereoWidth: { enabled: true, width: 120, bassMonoFreq: 100 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 75, gain: 2.5, q: 0.71, enabled: true },
        { type: 'peaking', freq: 200, gain: 1.5, q: 1.2, enabled: true },
        { type: 'peaking', freq: 400, gain: -1.2, q: 1.3, enabled: true },
        { type: 'peaking', freq: 1200, gain: 1.0, q: 1.0, enabled: true },
        { type: 'peaking', freq: 2800, gain: 2.5, q: 1.2, enabled: true },      // Emotive presence
        { type: 'peaking', freq: 5500, gain: 1.5, q: 1.4, enabled: true },
        { type: 'highshelf', freq: 11000, gain: 3.0, q: 0.71, enabled: true },
        { type: 'peaking', freq: 16000, gain: 1.0, q: 0.9, enabled: true }
      ]
    },
    multiband: { lowGain: 2.0, midGain: 1.2, highGain: 2.2, lowCrossover: 150, highCrossover: 4000 },
    saturation: { enabled: true, type: 'tape', drive: 10, warmth: 25, mix: 25 },
    limiter: { enabled: true, ceiling: -0.6, release: 65, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 0.8
  },

  // =========================================================================
  // CATEGORY E: LISTENER COMFORT (36-40)
  // =========================================================================
  {
    id: 'long-listening',
    name: 'TBR LONG LISTENING',
    category: 'Listener Comfort',
    description: 'Didesain khusus untuk siaran radio dan mendengarkan seharian (6-12 jam). Zona lelah telinga (3-5kHz) diredam halus, suara tetap renyah dan empuk.',
    subBass: { enabled: true, freq: 50, drive: 8, blend: 12 },
    stereoWidth: { enabled: true, width: 115, bassMonoFreq: 105 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 80, gain: 2.5, q: 0.71, enabled: true },
        { type: 'peaking', freq: 220, gain: 1.2, q: 1.2, enabled: true },
        { type: 'peaking', freq: 450, gain: -1.0, q: 1.2, enabled: true },
        { type: 'peaking', freq: 1500, gain: 0.0, q: 1.0, enabled: false },
        { type: 'peaking', freq: 3500, gain: -2.5, q: 1.8, enabled: true },     // Attenuate ear fatigue peak
        { type: 'peaking', freq: 6500, gain: -1.5, q: 1.8, enabled: true },
        { type: 'highshelf', freq: 10000, gain: 1.2, q: 0.71, enabled: true },
        { type: 'peaking', freq: 14000, gain: -1.0, q: 1.0, enabled: true }
      ]
    },
    multiband: { lowGain: 2.2, midGain: -0.8, highGain: -0.5, lowCrossover: 160, highCrossover: 3500 },
    saturation: { enabled: true, type: 'tape', drive: 12, warmth: 35, mix: 35 },
    limiter: { enabled: true, ceiling: -0.6, release: 75, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 0.8
  },
  {
    id: 'soft-dynamic',
    name: 'TBR SOFT DYNAMIC',
    category: 'Listener Comfort',
    description: 'Mendengarkan santai malam hari. Membatasi ledakan volume mengejutkan, menghasilkan dinamika lembut yang ramah di telinga dan telinga anak.',
    subBass: { enabled: false, freq: 50, drive: 0, blend: 0 },
    stereoWidth: { enabled: true, width: 110, bassMonoFreq: 100 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 90, gain: 2.0, q: 0.71, enabled: true },
        { type: 'peaking', freq: 240, gain: 1.0, q: 1.1, enabled: true },
        { type: 'peaking', freq: 500, gain: -0.8, q: 1.2, enabled: true },
        { type: 'peaking', freq: 1500, gain: 0.0, q: 1.0, enabled: false },
        { type: 'peaking', freq: 3200, gain: -1.8, q: 1.6, enabled: true },
        { type: 'peaking', freq: 6000, gain: -1.2, q: 1.8, enabled: true },
        { type: 'highshelf', freq: 9500, gain: 0.8, q: 0.71, enabled: true },
        { type: 'peaking', freq: 13500, gain: -1.5, q: 1.0, enabled: true }
      ]
    },
    multiband: { lowGain: 1.5, midGain: -0.5, highGain: -1.0, lowCrossover: 160, highCrossover: 3200 },
    saturation: { enabled: true, type: 'analog', drive: 8, warmth: 25, mix: 25 },
    limiter: { enabled: true, ceiling: -1.0, release: 90, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 0.5
  },
  {
    id: 'fatigue-free',
    name: 'TBR FATIGUE FREE',
    category: 'Listener Comfort',
    description: "Filter anti-pusing untuk pendengar sensitif frekuensi tinggi. Menghilangkan bunyi 'chhh' dan 'sss' yang menusuk dari file audio kualitas rendah/kompresi.",
    subBass: { enabled: false, freq: 50, drive: 0, blend: 0 },
    stereoWidth: { enabled: true, width: 105, bassMonoFreq: 100 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 85, gain: 2.2, q: 0.71, enabled: true },
        { type: 'peaking', freq: 250, gain: 1.0, q: 1.2, enabled: true },
        { type: 'peaking', freq: 600, gain: -0.5, q: 1.2, enabled: true },
        { type: 'peaking', freq: 2800, gain: -2.0, q: 2.0, enabled: true },
        { type: 'peaking', freq: 4500, gain: -3.0, q: 2.2, enabled: true },    // Anti fatigue notch
        { type: 'peaking', freq: 7200, gain: -3.5, q: 2.4, enabled: true },    // Anti sibilance cut
        { type: 'highshelf', freq: 9000, gain: -1.5, q: 0.71, enabled: true }, // Relaxed top
        { type: 'peaking', freq: 13000, gain: -2.5, q: 1.2, enabled: true }
      ]
    },
    multiband: { lowGain: 1.8, midGain: -1.0, highGain: -2.2, lowCrossover: 170, highCrossover: 3000 },
    saturation: { enabled: true, type: 'tube', drive: 12, warmth: 40, mix: 35 },
    limiter: { enabled: true, ceiling: -0.8, release: 80, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 0.6
  },
  {
    id: 'smooth-high',
    name: 'TBR SMOOTH HIGH',
    category: 'Listener Comfort',
    description: 'Menjinakkan suara cempreng pada speaker laptop atau headphone kecil. Mengubah treble digital yang kasar menjadi tekstur halus dan hangat.',
    subBass: { enabled: true, freq: 52, drive: 8, blend: 12 },
    stereoWidth: { enabled: true, width: 110, bassMonoFreq: 100 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 95, gain: 3.0, q: 0.71, enabled: true },
        { type: 'peaking', freq: 220, gain: 1.5, q: 1.2, enabled: true },
        { type: 'peaking', freq: 500, gain: -1.0, q: 1.2, enabled: true },
        { type: 'peaking', freq: 1500, gain: 0.5, q: 1.0, enabled: true },
        { type: 'peaking', freq: 3500, gain: -1.5, q: 1.5, enabled: true },
        { type: 'peaking', freq: 6500, gain: -2.8, q: 2.0, enabled: true },    // De-harsh peak
        { type: 'highshelf', freq: 10000, gain: -2.0, q: 0.71, enabled: true }, // Gentle shelf roll
        { type: 'peaking', freq: 14000, gain: -3.0, q: 1.2, enabled: true }
      ]
    },
    multiband: { lowGain: 2.5, midGain: 0.0, highGain: -2.0, lowCrossover: 160, highCrossover: 3500 },
    saturation: { enabled: true, type: 'tape', drive: 15, warmth: 35, mix: 35 },
    limiter: { enabled: true, ceiling: -0.6, release: 70, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 0.8
  },
  {
    id: 'warm-analog',
    name: 'TBR WARM ANALOG',
    category: 'Listener Comfort',
    description: 'Sensasi memutar piringan hitam vinyl & pita kaset analog tahun 1970-an. Saturasi harmonik genap kaya, bass bulat alami, nada atas anggun.',
    subBass: { enabled: true, freq: 50, drive: 15, blend: 22 },
    stereoWidth: { enabled: true, width: 115, bassMonoFreq: 105 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 100, gain: 3.8, q: 0.71, enabled: true },     // Vinyl bloom
        { type: 'peaking', freq: 220, gain: 2.2, q: 1.2, enabled: true },      // Tape warmth
        { type: 'peaking', freq: 480, gain: -1.2, q: 1.2, enabled: true },
        { type: 'peaking', freq: 1200, gain: 0.8, q: 1.0, enabled: true },
        { type: 'peaking', freq: 2800, gain: 0.5, q: 1.0, enabled: true },
        { type: 'peaking', freq: 5500, gain: -1.2, q: 1.5, enabled: true },
        { type: 'highshelf', freq: 9500, gain: 0.5, q: 0.71, enabled: true },  // Vintage gentle top
        { type: 'peaking', freq: 14000, gain: -2.0, q: 1.0, enabled: true }
      ]
    },
    multiband: { lowGain: 3.2, midGain: 0.8, highGain: -0.8, lowCrossover: 160, highCrossover: 3800 },
    saturation: { enabled: true, type: 'tube', drive: 22, warmth: 50, mix: 45 },
    limiter: { enabled: true, ceiling: -0.5, release: 65, lookahead: 5 },
    antiClipping: { enabled: true, truePeakDetection: true },
    inputGain: 0.0,
    outputGain: 1.0
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MUSIC_PRESETS };
}
