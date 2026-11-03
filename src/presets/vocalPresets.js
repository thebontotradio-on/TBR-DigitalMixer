/**
 * TBR DIGITAL MIXER — Professional Vocal Preset Library
 * 18 High-Fidelity Vocal Presets with actual DSP parameter configurations
 */

const VOCAL_PRESETS = [
  // =========================================================================
  // CATEGORY A: BROADCAST & RADIO
  // =========================================================================
  {
    id: 'broadcast-pro',
    name: 'TBR BROADCAST PRO',
    category: 'Broadcast & Radio',
    description: 'Karakter suara penyiar profesional modern. Suara tebal berwibawa, proximity bass padat namun tidak boomy, kompresi rapat dengan de-esser presisi.',
    hpf: { enabled: true, freq: 65, slope: 18 },
    lpf: { enabled: false, freq: 18000, slope: 12 },
    gate: { enabled: true, threshold: -45, ratio: 4.0, attack: 2.0, release: 80, hold: 40 },
    deEsser: { enabled: true, freq: 6200, threshold: -18, reduction: -6.5, q: 2.2 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 90, gain: 2.5, q: 0.71, enabled: true },      // Chest authority
        { type: 'peaking', freq: 280, gain: -2.8, q: 1.4, enabled: true },      // Remove mud
        { type: 'peaking', freq: 850, gain: -1.2, q: 1.1, enabled: true },      // Boxiness control
        { type: 'peaking', freq: 2800, gain: 3.2, q: 1.2, enabled: true },     // Speech articulation
        { type: 'peaking', freq: 4500, gain: 2.0, q: 1.5, enabled: true },     // Vocal edge
        { type: 'peaking', freq: 7200, gain: -1.5, q: 2.0, enabled: true },    // Sibilance control
        { type: 'highshelf', freq: 10500, gain: 3.5, q: 0.71, enabled: true },  // Broadcast air
        { type: 'peaking', freq: 14000, gain: 1.0, q: 1.0, enabled: false }
      ]
    },
    compressor: { enabled: true, threshold: -18, ratio: 3.8, attack: 8.0, release: 75, knee: 4.0, makeup: 4.5 },
    saturation: { enabled: true, type: 'tube', drive: 12, warmth: 25, mix: 35 },
    presence: { enabled: true, freq: 3500, amount: 2.5 },
    limiter: { enabled: true, ceiling: -0.5, release: 50 },
    inputGain: 0.0,
    outputGain: 1.5
  },
  {
    id: 'radio-voice',
    name: 'TBR RADIO VOICE',
    category: 'Broadcast & Radio',
    description: 'Gaya radio FM legendaris. Vokal sangat padat, punchy di low-mid, midrange terartikulasi tajam sehingga menonjol di atas backsound musik keras.',
    hpf: { enabled: true, freq: 75, slope: 24 },
    lpf: { enabled: true, freq: 15500, slope: 12 },
    gate: { enabled: true, threshold: -42, ratio: 5.0, attack: 1.5, release: 60, hold: 30 },
    deEsser: { enabled: true, freq: 5800, threshold: -16, reduction: -7.0, q: 2.5 },
    eq: {
      enabled: true,
      bands: [
        { type: 'peaking', freq: 120, gain: 3.8, q: 1.2, enabled: true },      // FM punch
        { type: 'peaking', freq: 380, gain: -3.5, q: 1.6, enabled: true },      // Clean clarity
        { type: 'peaking', freq: 1200, gain: 1.0, q: 1.0, enabled: true },     // Radio body
        { type: 'peaking', freq: 3200, gain: 4.5, q: 1.3, enabled: true },     // Strong presence
        { type: 'peaking', freq: 5200, gain: 1.5, q: 1.8, enabled: true },     // Clarity
        { type: 'peaking', freq: 6800, gain: -2.0, q: 2.2, enabled: true },    // Anti-harsh
        { type: 'highshelf', freq: 9500, gain: 2.0, q: 0.71, enabled: true },  // FM top
        { type: 'peaking', freq: 13000, gain: -1.0, q: 1.0, enabled: true }
      ]
    },
    compressor: { enabled: true, threshold: -21, ratio: 4.5, attack: 4.0, release: 60, knee: 3.0, makeup: 6.0 },
    saturation: { enabled: true, type: 'analog', drive: 18, warmth: 30, mix: 40 },
    presence: { enabled: true, freq: 3200, amount: 3.5 },
    limiter: { enabled: true, ceiling: -0.3, release: 40 },
    inputGain: 0.0,
    outputGain: 2.0
  },
  {
    id: 'warm-broadcast',
    name: 'TBR WARM BROADCAST',
    category: 'Broadcast & Radio',
    description: 'Nuansa hangat analog mikrofon tabung vintage. Suara nyaman didengar telinga, tidak menusuk, bass lembut membalut vokal.',
    hpf: { enabled: true, freq: 55, slope: 12 },
    lpf: { enabled: false, freq: 18000, slope: 6 },
    gate: { enabled: true, threshold: -48, ratio: 3.0, attack: 4.0, release: 120, hold: 50 },
    deEsser: { enabled: true, freq: 6500, threshold: -20, reduction: -5.0, q: 1.8 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 130, gain: 3.0, q: 0.71, enabled: true },    // Deep warmth
        { type: 'peaking', freq: 240, gain: 1.5, q: 1.2, enabled: true },      // Tube body
        { type: 'peaking', freq: 500, gain: -1.5, q: 1.0, enabled: true },     // Box cut
        { type: 'peaking', freq: 2200, gain: 1.8, q: 1.0, enabled: true },     // Soft presence
        { type: 'peaking', freq: 4000, gain: 0.5, q: 1.4, enabled: true },     // Mild upper
        { type: 'peaking', freq: 7000, gain: -1.0, q: 1.6, enabled: true },    // Smooth high
        { type: 'highshelf', freq: 11000, gain: 1.8, q: 0.71, enabled: true }, // Silky air
        { type: 'peaking', freq: 15000, gain: 0.0, q: 1.0, enabled: false }
      ]
    },
    compressor: { enabled: true, threshold: -16, ratio: 2.5, attack: 15.0, release: 110, knee: 8.0, makeup: 3.0 },
    saturation: { enabled: true, type: 'tube', drive: 22, warmth: 45, mix: 50 },
    presence: { enabled: true, freq: 2500, amount: 1.5 },
    limiter: { enabled: true, ceiling: -0.8, release: 80 },
    inputGain: 0.0,
    outputGain: 1.0
  },
  {
    id: 'crystal-clear',
    name: 'TBR CRYSTAL CLEAR',
    category: 'Broadcast & Radio',
    description: 'Transparansi vokal tingkat tinggi. Sangat jernih dan higienis, artikulasi desah nafas terkendali rapi tanpa sibilance tajam.',
    hpf: { enabled: true, freq: 85, slope: 18 },
    lpf: { enabled: false, freq: 20000, slope: 12 },
    gate: { enabled: true, threshold: -46, ratio: 3.5, attack: 2.0, release: 90, hold: 40 },
    deEsser: { enabled: true, freq: 5600, threshold: -22, reduction: -8.0, q: 2.8 },
    eq: {
      enabled: true,
      bands: [
        { type: 'peaking', freq: 100, gain: 1.0, q: 1.0, enabled: true },      // Clean bass
        { type: 'peaking', freq: 300, gain: -3.2, q: 1.5, enabled: true },     // Anti-mud
        { type: 'peaking', freq: 1500, gain: -0.8, q: 1.0, enabled: true },
        { type: 'peaking', freq: 3500, gain: 3.8, q: 1.3, enabled: true },     // Crystal bite
        { type: 'peaking', freq: 5800, gain: -2.5, q: 2.4, enabled: true },    // Harshness notch
        { type: 'peaking', freq: 8500, gain: 2.5, q: 1.4, enabled: true },     // Shimmer
        { type: 'highshelf', freq: 12500, gain: 4.2, q: 0.71, enabled: true }, // Open top
        { type: 'peaking', freq: 16000, gain: 1.5, q: 1.0, enabled: true }
      ]
    },
    compressor: { enabled: true, threshold: -17, ratio: 3.0, attack: 10.0, release: 70, knee: 5.0, makeup: 3.5 },
    saturation: { enabled: false, type: 'tape', drive: 5, warmth: 10, mix: 20 },
    presence: { enabled: true, freq: 4000, amount: 3.0 },
    limiter: { enabled: true, ceiling: -0.5, release: 45 },
    inputGain: 0.0,
    outputGain: 1.2
  },
  {
    id: 'deep-radio',
    name: 'TBR DEEP RADIO',
    category: 'Broadcast & Radio',
    description: 'Suara bass vokal dalam dan dominan khas voice-over film & radio komersial. Resonansi dada diperkaya dengan kontrol anti-boomy.',
    hpf: { enabled: true, freq: 50, slope: 18 },
    lpf: { enabled: false, freq: 17000, slope: 12 },
    gate: { enabled: true, threshold: -44, ratio: 4.0, attack: 3.0, release: 80, hold: 40 },
    deEsser: { enabled: true, freq: 6200, threshold: -17, reduction: -6.0, q: 2.0 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 75, gain: 4.5, q: 0.8, enabled: true },      // Sub-chest weight
        { type: 'peaking', freq: 140, gain: 2.8, q: 1.4, enabled: true },      // Deep tone
        { type: 'peaking', freq: 260, gain: -2.5, q: 1.6, enabled: true },     // Clean up boomy mid
        { type: 'peaking', freq: 800, gain: -1.5, q: 1.2, enabled: true },
        { type: 'peaking', freq: 2600, gain: 2.8, q: 1.1, enabled: true },     // Intelligibility
        { type: 'peaking', freq: 4200, gain: 1.8, q: 1.4, enabled: true },
        { type: 'highshelf', freq: 10000, gain: 2.8, q: 0.71, enabled: true },
        { type: 'peaking', freq: 14000, gain: 0.5, q: 1.0, enabled: false }
      ]
    },
    compressor: { enabled: true, threshold: -20, ratio: 4.2, attack: 6.0, release: 80, knee: 4.0, makeup: 5.0 },
    saturation: { enabled: true, type: 'analog', drive: 16, warmth: 40, mix: 45 },
    presence: { enabled: true, freq: 3000, amount: 2.2 },
    limiter: { enabled: true, ceiling: -0.3, release: 50 },
    inputGain: 0.5,
    outputGain: 1.8
  },
  {
    id: 'fm-presence',
    name: 'TBR FM PRESENCE',
    category: 'Broadcast & Radio',
    description: 'High-energy broadcast processing. Respon frekuensi cepat, dynamic punch maksimal untuk siaran live yang dinamis dan bersemangat.',
    hpf: { enabled: true, freq: 70, slope: 18 },
    lpf: { enabled: false, freq: 17500, slope: 12 },
    gate: { enabled: true, threshold: -42, ratio: 4.5, attack: 1.8, release: 70, hold: 35 },
    deEsser: { enabled: true, freq: 6000, threshold: -19, reduction: -7.5, q: 2.4 },
    eq: {
      enabled: true,
      bands: [
        { type: 'peaking', freq: 105, gain: 2.8, q: 1.1, enabled: true },
        { type: 'peaking', freq: 320, gain: -2.8, q: 1.5, enabled: true },
        { type: 'peaking', freq: 1800, gain: 2.0, q: 1.2, enabled: true },
        { type: 'peaking', freq: 3600, gain: 4.2, q: 1.4, enabled: true },     // Dynamic snap
        { type: 'peaking', freq: 5500, gain: 1.5, q: 1.6, enabled: true },
        { type: 'peaking', freq: 7500, gain: -2.0, q: 2.0, enabled: true },
        { type: 'highshelf', freq: 11000, gain: 3.5, q: 0.71, enabled: true },
        { type: 'peaking', freq: 15000, gain: 1.0, q: 1.0, enabled: true }
      ]
    },
    compressor: { enabled: true, threshold: -22, ratio: 4.0, attack: 5.0, release: 65, knee: 3.5, makeup: 5.5 },
    saturation: { enabled: true, type: 'tape', drive: 15, warmth: 25, mix: 35 },
    presence: { enabled: true, freq: 3600, amount: 3.8 },
    limiter: { enabled: true, ceiling: -0.4, release: 45 },
    inputGain: 0.0,
    outputGain: 1.6
  },

  // =========================================================================
  // CATEGORY B: NATURAL & WARM
  // =========================================================================
  {
    id: 'natural-voice',
    name: 'TBR NATURAL VOICE',
    category: 'Natural & Warm',
    description: 'Reproduksi suara asli yang natural tanpa pewarnaan berlebihan. Sangat cocok untuk rapat online, wawancara santai, dan voice chat.',
    hpf: { enabled: true, freq: 45, slope: 12 },
    lpf: { enabled: false, freq: 20000, slope: 6 },
    gate: { enabled: true, threshold: -50, ratio: 2.5, attack: 5.0, release: 140, hold: 60 },
    deEsser: { enabled: true, freq: 6500, threshold: -24, reduction: -4.0, q: 1.5 },
    eq: {
      enabled: true,
      bands: [
        { type: 'peaking', freq: 80, gain: 0.5, q: 1.0, enabled: true },
        { type: 'peaking', freq: 250, gain: -1.0, q: 1.2, enabled: true },
        { type: 'peaking', freq: 1000, gain: 0.0, q: 1.0, enabled: false },
        { type: 'peaking', freq: 2500, gain: 1.2, q: 1.0, enabled: true },
        { type: 'peaking', freq: 4500, gain: 0.8, q: 1.2, enabled: true },
        { type: 'peaking', freq: 7000, gain: -0.5, q: 1.5, enabled: true },
        { type: 'highshelf', freq: 12000, gain: 1.5, q: 0.71, enabled: true },
        { type: 'peaking', freq: 16000, gain: 0.0, q: 1.0, enabled: false }
      ]
    },
    compressor: { enabled: true, threshold: -14, ratio: 2.0, attack: 18.0, release: 120, knee: 8.0, makeup: 2.0 },
    saturation: { enabled: false, type: 'analog', drive: 0, warmth: 0, mix: 0 },
    presence: { enabled: false, freq: 3000, amount: 0 },
    limiter: { enabled: true, ceiling: -1.0, release: 80 },
    inputGain: 0.0,
    outputGain: 0.5
  },
  {
    id: 'warm-smooth',
    name: 'TBR WARM & SMOOTH',
    category: 'Natural & Warm',
    description: 'Tekstur vokal lembut selembut beludru. Mengurangi frekuensi tajam, memberikan bantalan low-mid yang hangat untuk sesi dengar lama.',
    hpf: { enabled: true, freq: 50, slope: 12 },
    lpf: { enabled: true, freq: 16500, slope: 12 },
    gate: { enabled: true, threshold: -48, ratio: 2.8, attack: 4.0, release: 130, hold: 50 },
    deEsser: { enabled: true, freq: 6000, threshold: -21, reduction: -6.0, q: 2.0 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 120, gain: 2.5, q: 0.71, enabled: true },
        { type: 'peaking', freq: 220, gain: 1.8, q: 1.3, enabled: true },
        { type: 'peaking', freq: 450, gain: -1.8, q: 1.2, enabled: true },
        { type: 'peaking', freq: 2000, gain: 1.0, q: 1.0, enabled: true },
        { type: 'peaking', freq: 3800, gain: -1.5, q: 1.5, enabled: true },     // Soften ear fatigue zone
        { type: 'peaking', freq: 6500, gain: -2.0, q: 2.0, enabled: true },
        { type: 'highshelf', freq: 10000, gain: 1.0, q: 0.71, enabled: true },
        { type: 'peaking', freq: 14000, gain: -1.0, q: 1.0, enabled: true }
      ]
    },
    compressor: { enabled: true, threshold: -16, ratio: 2.2, attack: 20.0, release: 140, knee: 10.0, makeup: 2.5 },
    saturation: { enabled: true, type: 'tape', drive: 20, warmth: 50, mix: 40 },
    presence: { enabled: false, freq: 2800, amount: 0 },
    limiter: { enabled: true, ceiling: -0.8, release: 90 },
    inputGain: 0.0,
    outputGain: 0.8
  },
  {
    id: 'rich-vocal',
    name: 'TBR RICH VOCAL',
    category: 'Natural & Warm',
    description: 'Harmoni vokal tebal dan padat. Memperkaya nada dasar vokal pria maupun wanita, menghasilkan suara yang profesional dan mahal.',
    hpf: { enabled: true, freq: 55, slope: 12 },
    lpf: { enabled: false, freq: 19000, slope: 6 },
    gate: { enabled: true, threshold: -47, ratio: 3.2, attack: 3.0, release: 100, hold: 45 },
    deEsser: { enabled: true, freq: 6200, threshold: -20, reduction: -5.5, q: 2.0 },
    eq: {
      enabled: true,
      bands: [
        { type: 'peaking', freq: 110, gain: 2.5, q: 1.2, enabled: true },
        { type: 'peaking', freq: 250, gain: 1.2, q: 1.3, enabled: true },
        { type: 'peaking', freq: 600, gain: -1.8, q: 1.4, enabled: true },
        { type: 'peaking', freq: 2400, gain: 2.2, q: 1.1, enabled: true },
        { type: 'peaking', freq: 4800, gain: 1.5, q: 1.4, enabled: true },
        { type: 'peaking', freq: 7200, gain: -1.2, q: 1.8, enabled: true },
        { type: 'highshelf', freq: 11500, gain: 2.8, q: 0.71, enabled: true },
        { type: 'peaking', freq: 15000, gain: 0.5, q: 1.0, enabled: true }
      ]
    },
    compressor: { enabled: true, threshold: -18, ratio: 2.8, attack: 12.0, release: 90, knee: 6.0, makeup: 3.8 },
    saturation: { enabled: true, type: 'tube', drive: 25, warmth: 35, mix: 45 },
    presence: { enabled: true, freq: 2800, amount: 2.0 },
    limiter: { enabled: true, ceiling: -0.6, release: 60 },
    inputGain: 0.0,
    outputGain: 1.2
  },
  {
    id: 'soft-voice',
    name: 'TBR SOFT VOICE',
    category: 'Natural & Warm',
    description: 'Didesain khusus untuk pembicara bersuara pelan atau lembut. Auto-leveling sensitif mengangkat bisikan menjadi terdengar jelas dan intim.',
    hpf: { enabled: true, freq: 70, slope: 18 },
    lpf: { enabled: false, freq: 18000, slope: 12 },
    gate: { enabled: true, threshold: -52, ratio: 2.5, attack: 3.0, release: 110, hold: 45 },
    deEsser: { enabled: true, freq: 5800, threshold: -23, reduction: -6.5, q: 2.2 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 150, gain: 3.5, q: 0.71, enabled: true },    // Lift gentle chest
        { type: 'peaking', freq: 350, gain: -2.0, q: 1.3, enabled: true },
        { type: 'peaking', freq: 1400, gain: 1.8, q: 1.1, enabled: true },
        { type: 'peaking', freq: 3000, gain: 3.5, q: 1.2, enabled: true },     // Intimate whisper lift
        { type: 'peaking', freq: 5000, gain: 2.0, q: 1.5, enabled: true },
        { type: 'peaking', freq: 7000, gain: -1.5, q: 2.0, enabled: true },
        { type: 'highshelf', freq: 10000, gain: 3.0, q: 0.71, enabled: true },
        { type: 'peaking', freq: 14000, gain: 1.0, q: 1.0, enabled: false }
      ]
    },
    compressor: { enabled: true, threshold: -26, ratio: 3.2, attack: 8.0, release: 100, knee: 6.0, makeup: 7.5 },
    saturation: { enabled: true, type: 'tube', drive: 10, warmth: 20, mix: 30 },
    presence: { enabled: true, freq: 3200, amount: 2.8 },
    limiter: { enabled: true, ceiling: -0.5, release: 60 },
    inputGain: 2.0,
    outputGain: 1.5
  },
  {
    id: 'clear-open',
    name: 'TBR CLEAR & OPEN',
    category: 'Natural & Warm',
    description: 'Karakter vokal bernafas lega, terbuka dan transparan. Memberikan dimensi akustik lapang tanpa resonansi sempit.',
    hpf: { enabled: true, freq: 65, slope: 18 },
    lpf: { enabled: false, freq: 20000, slope: 6 },
    gate: { enabled: true, threshold: -48, ratio: 3.0, attack: 2.5, release: 100, hold: 40 },
    deEsser: { enabled: true, freq: 6400, threshold: -22, reduction: -6.0, q: 2.2 },
    eq: {
      enabled: true,
      bands: [
        { type: 'peaking', freq: 100, gain: 1.2, q: 1.0, enabled: true },
        { type: 'peaking', freq: 280, gain: -2.8, q: 1.4, enabled: true },
        { type: 'peaking', freq: 900, gain: -1.0, q: 1.2, enabled: true },
        { type: 'peaking', freq: 2600, gain: 2.2, q: 1.1, enabled: true },
        { type: 'peaking', freq: 4500, gain: 2.0, q: 1.4, enabled: true },
        { type: 'peaking', freq: 7500, gain: -1.0, q: 1.8, enabled: true },
        { type: 'highshelf', freq: 11000, gain: 3.8, q: 0.71, enabled: true }, // Open sky
        { type: 'peaking', freq: 16000, gain: 2.0, q: 0.9, enabled: true }
      ]
    },
    compressor: { enabled: true, threshold: -16, ratio: 2.4, attack: 14.0, release: 85, knee: 6.0, makeup: 3.0 },
    saturation: { enabled: false, type: 'tape', drive: 8, warmth: 15, mix: 25 },
    presence: { enabled: true, freq: 3500, amount: 2.2 },
    limiter: { enabled: true, ceiling: -0.8, release: 60 },
    inputGain: 0.0,
    outputGain: 1.0
  },
  {
    id: 'vocal-presence',
    name: 'TBR VOCAL PRESENCE',
    category: 'Natural & Warm',
    description: 'Menempatkan vokal persis di depan telinga pendengar. Mengunci fokus suara di tengah aransemen musik tanpa distorsi.',
    hpf: { enabled: true, freq: 70, slope: 18 },
    lpf: { enabled: false, freq: 18500, slope: 12 },
    gate: { enabled: true, threshold: -45, ratio: 3.8, attack: 2.0, release: 80, hold: 40 },
    deEsser: { enabled: true, freq: 6000, threshold: -19, reduction: -7.0, q: 2.4 },
    eq: {
      enabled: true,
      bands: [
        { type: 'peaking', freq: 110, gain: 1.8, q: 1.1, enabled: true },
        { type: 'peaking', freq: 320, gain: -3.0, q: 1.5, enabled: true },
        { type: 'peaking', freq: 1500, gain: 1.5, q: 1.2, enabled: true },
        { type: 'peaking', freq: 3200, gain: 4.0, q: 1.3, enabled: true },     // Forward focus
        { type: 'peaking', freq: 5200, gain: 2.0, q: 1.5, enabled: true },
        { type: 'peaking', freq: 7000, gain: -1.8, q: 2.0, enabled: true },
        { type: 'highshelf', freq: 10500, gain: 2.5, q: 0.71, enabled: true },
        { type: 'peaking', freq: 14500, gain: 0.8, q: 1.0, enabled: true }
      ]
    },
    compressor: { enabled: true, threshold: -19, ratio: 3.5, attack: 7.0, release: 70, knee: 4.0, makeup: 4.5 },
    saturation: { enabled: true, type: 'analog', drive: 15, warmth: 25, mix: 35 },
    presence: { enabled: true, freq: 3200, amount: 3.5 },
    limiter: { enabled: true, ceiling: -0.5, release: 45 },
    inputGain: 0.0,
    outputGain: 1.4
  },

  // =========================================================================
  // CATEGORY C: ADVANCED VOCAL
  // =========================================================================
  {
    id: 'podcast-pro',
    name: 'TBR PODCAST PRO',
    category: 'Advanced Vocal',
    description: 'Standar baku industri podcast. Gate bersih memotong desis ruangan (room reverb), perataan dinamika konsisten pada -16 LUFS podcast target.',
    hpf: { enabled: true, freq: 75, slope: 24 },
    lpf: { enabled: true, freq: 17000, slope: 12 },
    gate: { enabled: true, threshold: -43, ratio: 5.5, attack: 1.5, release: 75, hold: 45 },
    deEsser: { enabled: true, freq: 5900, threshold: -20, reduction: -7.5, q: 2.6 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 85, gain: 2.0, q: 0.71, enabled: true },
        { type: 'peaking', freq: 240, gain: -2.8, q: 1.6, enabled: true },     // Room resonance cut
        { type: 'peaking', freq: 700, gain: -1.5, q: 1.2, enabled: true },
        { type: 'peaking', freq: 2500, gain: 3.0, q: 1.2, enabled: true },     // Spoken intelligibility
        { type: 'peaking', freq: 4200, gain: 2.2, q: 1.5, enabled: true },
        { type: 'peaking', freq: 6500, gain: -2.2, q: 2.2, enabled: true },    // High harsh cut
        { type: 'highshelf', freq: 10000, gain: 2.5, q: 0.71, enabled: true },
        { type: 'peaking', freq: 14000, gain: 0.0, q: 1.0, enabled: false }
      ]
    },
    compressor: { enabled: true, threshold: -22, ratio: 4.2, attack: 6.0, release: 75, knee: 4.0, makeup: 5.5 },
    saturation: { enabled: true, type: 'tape', drive: 10, warmth: 20, mix: 30 },
    presence: { enabled: true, freq: 3000, amount: 2.8 },
    limiter: { enabled: true, ceiling: -0.5, release: 45 },
    inputGain: 0.0,
    outputGain: 1.8
  },
  {
    id: 'streaming-voice',
    name: 'TBR STREAMING VOICE',
    category: 'Advanced Vocal',
    description: 'Ditinjau untuk live streaming TikTok, YouTube, & Twitch. Mengatasi mic USB murah agar tidak cempreng atau distorsi saat berteriak tiba-tiba.',
    hpf: { enabled: true, freq: 85, slope: 24 },
    lpf: { enabled: true, freq: 16000, slope: 18 },
    gate: { enabled: true, threshold: -41, ratio: 6.0, attack: 1.2, release: 60, hold: 30 },
    deEsser: { enabled: true, freq: 5700, threshold: -18, reduction: -8.5, q: 2.8 },
    eq: {
      enabled: true,
      bands: [
        { type: 'peaking', freq: 120, gain: 2.5, q: 1.2, enabled: true },
        { type: 'peaking', freq: 360, gain: -3.5, q: 1.6, enabled: true },     // Boxy mic cut
        { type: 'peaking', freq: 1800, gain: 1.8, q: 1.3, enabled: true },
        { type: 'peaking', freq: 3300, gain: 3.5, q: 1.4, enabled: true },     // Stream punch
        { type: 'peaking', freq: 5800, gain: -3.2, q: 2.5, enabled: true },    // USB mic notch
        { type: 'peaking', freq: 8200, gain: 1.5, q: 1.5, enabled: true },
        { type: 'highshelf', freq: 10500, gain: 2.0, q: 0.71, enabled: true },
        { type: 'peaking', freq: 15000, gain: -1.5, q: 1.0, enabled: true }
      ]
    },
    compressor: { enabled: true, threshold: -24, ratio: 5.0, attack: 3.0, release: 55, knee: 3.0, makeup: 6.5 },
    saturation: { enabled: true, type: 'analog', drive: 14, warmth: 25, mix: 35 },
    presence: { enabled: true, freq: 3300, amount: 3.2 },
    limiter: { enabled: true, ceiling: -0.3, release: 35 },
    inputGain: 0.0,
    outputGain: 1.8
  },
  {
    id: 'deep-powerful',
    name: 'TBR DEEP & POWERFUL',
    category: 'Advanced Vocal',
    description: 'Kekuatan bass vokal ekstrem dan otoritatif. Menghasilkan resonansi tebal yang menggetarkan speaker tanpa menutupi kejernihan kata-kata.',
    hpf: { enabled: true, freq: 45, slope: 18 },
    lpf: { enabled: false, freq: 17500, slope: 12 },
    gate: { enabled: true, threshold: -45, ratio: 4.0, attack: 3.0, release: 80, hold: 40 },
    deEsser: { enabled: true, freq: 6300, threshold: -18, reduction: -6.5, q: 2.2 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 70, gain: 5.5, q: 0.8, enabled: true },      // Massive sub-fundamental
        { type: 'peaking', freq: 130, gain: 3.5, q: 1.3, enabled: true },      // Chest rumble
        { type: 'peaking', freq: 240, gain: -3.2, q: 1.8, enabled: true },     // Tight notch to kill mud
        { type: 'peaking', freq: 650, gain: -1.5, q: 1.2, enabled: true },
        { type: 'peaking', freq: 2500, gain: 2.5, q: 1.1, enabled: true },
        { type: 'peaking', freq: 4500, gain: 2.0, q: 1.4, enabled: true },
        { type: 'highshelf', freq: 9500, gain: 3.0, q: 0.71, enabled: true },
        { type: 'peaking', freq: 14000, gain: 0.5, q: 1.0, enabled: false }
      ]
    },
    compressor: { enabled: true, threshold: -21, ratio: 4.5, attack: 5.0, release: 85, knee: 4.0, makeup: 5.2 },
    saturation: { enabled: true, type: 'tube', drive: 22, warmth: 45, mix: 50 },
    presence: { enabled: true, freq: 2800, amount: 2.5 },
    limiter: { enabled: true, ceiling: -0.3, release: 50 },
    inputGain: 0.5,
    outputGain: 2.0
  },
  {
    id: 'smooth-compression',
    name: 'TBR SMOOTH COMPRESSION',
    category: 'Advanced Vocal',
    description: 'Algoritma kompresi 2-tahap (optical + VCA style). Mengunci volume vokal pada batas stabil tanpa menimbulkan efek suara memompa (pumping).',
    hpf: { enabled: true, freq: 60, slope: 18 },
    lpf: { enabled: false, freq: 19000, slope: 6 },
    gate: { enabled: true, threshold: -47, ratio: 3.0, attack: 3.5, release: 110, hold: 45 },
    deEsser: { enabled: true, freq: 6100, threshold: -20, reduction: -6.0, q: 2.0 },
    eq: {
      enabled: true,
      bands: [
        { type: 'peaking', freq: 100, gain: 1.5, q: 1.0, enabled: true },
        { type: 'peaking', freq: 280, gain: -2.0, q: 1.4, enabled: true },
        { type: 'peaking', freq: 1200, gain: 0.8, q: 1.1, enabled: true },
        { type: 'peaking', freq: 2800, gain: 2.0, q: 1.2, enabled: true },
        { type: 'peaking', freq: 4600, gain: 1.5, q: 1.4, enabled: true },
        { type: 'peaking', freq: 7000, gain: -1.0, q: 1.8, enabled: true },
        { type: 'highshelf', freq: 11000, gain: 2.5, q: 0.71, enabled: true },
        { type: 'peaking', freq: 15000, gain: 0.5, q: 1.0, enabled: true }
      ]
    },
    compressor: { enabled: true, threshold: -20, ratio: 3.2, attack: 14.0, release: 120, knee: 10.0, makeup: 4.8 },
    saturation: { enabled: true, type: 'tape', drive: 12, warmth: 25, mix: 35 },
    presence: { enabled: true, freq: 2900, amount: 2.0 },
    limiter: { enabled: true, ceiling: -0.6, release: 70 },
    inputGain: 0.0,
    outputGain: 1.2
  },
  {
    id: 'anti-harsh',
    name: 'TBR ANTI-HARSH',
    category: 'Advanced Vocal',
    description: 'Penyelamat vokal tajam / menusuk telinga. Melakukan supresi dinamis pada 3.2kHz, 6.2kHz, dan 8.5kHz untuk suara ramah pendengaran.',
    hpf: { enabled: true, freq: 70, slope: 18 },
    lpf: { enabled: true, freq: 15000, slope: 12 },
    gate: { enabled: true, threshold: -45, ratio: 3.5, attack: 2.5, release: 90, hold: 40 },
    deEsser: { enabled: true, freq: 5600, threshold: -16, reduction: -10.0, q: 3.0 },
    eq: {
      enabled: true,
      bands: [
        { type: 'lowshelf', freq: 120, gain: 2.0, q: 0.71, enabled: true },
        { type: 'peaking', freq: 280, gain: -1.5, q: 1.3, enabled: true },
        { type: 'peaking', freq: 1200, gain: 1.2, q: 1.0, enabled: true },
        { type: 'peaking', freq: 3200, gain: -3.5, q: 2.0, enabled: true },    // Deep anti-harsh notch
        { type: 'peaking', freq: 4800, gain: -2.0, q: 2.0, enabled: true },    // Harsh presence cut
        { type: 'peaking', freq: 6200, gain: -4.5, q: 2.5, enabled: true },    // Sibilance killer
        { type: 'highshelf', freq: 9000, gain: -1.5, q: 0.71, enabled: true },  // Tamed top
        { type: 'peaking', freq: 13000, gain: -2.5, q: 1.2, enabled: true }
      ]
    },
    compressor: { enabled: true, threshold: -18, ratio: 2.6, attack: 15.0, release: 100, knee: 8.0, makeup: 3.5 },
    saturation: { enabled: true, type: 'tube', drive: 18, warmth: 40, mix: 40 },
    presence: { enabled: false, freq: 2800, amount: 0 },
    limiter: { enabled: true, ceiling: -0.8, release: 75 },
    inputGain: 0.0,
    outputGain: 1.0
  },
  {
    id: 'vocal-control',
    name: 'TBR VOCAL CONTROL',
    category: 'Advanced Vocal',
    description: 'Kontrol dinamika vokal menyeluruh. Membatasi teriakan mendadak tanpa pecah, memperjelas bisikan, sangat stabil untuk pemula tanpa mik-teknik.',
    hpf: { enabled: true, freq: 80, slope: 24 },
    lpf: { enabled: true, freq: 16500, slope: 12 },
    gate: { enabled: true, threshold: -42, ratio: 5.0, attack: 1.5, release: 70, hold: 35 },
    deEsser: { enabled: true, freq: 5800, threshold: -18, reduction: -8.0, q: 2.6 },
    eq: {
      enabled: true,
      bands: [
        { type: 'peaking', freq: 110, gain: 2.2, q: 1.1, enabled: true },
        { type: 'peaking', freq: 340, gain: -3.0, q: 1.5, enabled: true },
        { type: 'peaking', freq: 1500, gain: 1.2, q: 1.1, enabled: true },
        { type: 'peaking', freq: 3000, gain: 3.0, q: 1.3, enabled: true },
        { type: 'peaking', freq: 5200, gain: 1.0, q: 1.6, enabled: true },
        { type: 'peaking', freq: 7000, gain: -2.0, q: 2.2, enabled: true },
        { type: 'highshelf', freq: 10000, gain: 2.0, q: 0.71, enabled: true },
        { type: 'peaking', freq: 14000, gain: -0.5, q: 1.0, enabled: true }
      ]
    },
    compressor: { enabled: true, threshold: -23, ratio: 4.8, attack: 4.0, release: 65, knee: 4.0, makeup: 6.0 },
    saturation: { enabled: true, type: 'analog', drive: 12, warmth: 25, mix: 30 },
    presence: { enabled: true, freq: 3000, amount: 2.6 },
    limiter: { enabled: true, ceiling: -0.2, release: 40 },
    inputGain: 0.0,
    outputGain: 1.5
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VOCAL_PRESETS };
}
