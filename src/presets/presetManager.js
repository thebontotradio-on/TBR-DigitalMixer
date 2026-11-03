/**
 * TBR DIGITAL MIXER — Preset Manager
 * Handles Vocal & Music Presets, Custom User Presets, A/B Comparison,
 * Search, Category Filtering, Favorites, and Smooth Transitions.
 */

const { VOCAL_PRESETS } = require('./vocalPresets');
const { MUSIC_PRESETS } = require('./musicPresets');

class PresetManager {
  constructor(storageAdapter = null) {
    this.storage = storageAdapter || (typeof localStorage !== 'undefined' ? localStorage : null);
    this.customVocalPresets = this.loadCustomPresets('vocal');
    this.customMusicPresets = this.loadCustomPresets('music');
    this.favorites = this.loadFavorites();
    this.recentlyUsed = [];

    // A/B Comparison State
    this.vocalStateA = null;
    this.vocalStateB = null;
    this.activeVocalSlot = 'A';

    this.musicStateA = null;
    this.musicStateB = null;
    this.activeMusicSlot = 'A';
  }

  // --- Preset Retrieval ---
  getAllVocalPresets() {
    return [...VOCAL_PRESETS, ...this.customVocalPresets];
  }

  getAllMusicPresets() {
    return [...MUSIC_PRESETS, ...this.customMusicPresets];
  }

  findVocalPresetById(id) {
    return this.getAllVocalPresets().find(p => p.id === id) || null;
  }

  findMusicPresetById(id) {
    return this.getAllMusicPresets().find(p => p.id === id) || null;
  }

  // --- Filtering & Search ---
  filterPresets(type, { category = 'All', query = '', onlyFavorites = false } = {}) {
    const list = type === 'vocal' ? this.getAllVocalPresets() : this.getAllMusicPresets();
    return list.filter(p => {
      const matchCat = category === 'All' || p.category === category;
      const q = query.trim().toLowerCase();
      const matchQuery = !q || p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
      const matchFav = !onlyFavorites || this.isFavorite(p.id);
      return matchCat && matchQuery && matchFav;
    });
  }

  getCategories(type) {
    const list = type === 'vocal' ? this.getAllVocalPresets() : this.getAllMusicPresets();
    const cats = new Set(list.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }

  // --- Favorites Management ---
  isFavorite(id) {
    return this.favorites.includes(id);
  }

  toggleFavorite(id) {
    const idx = this.favorites.indexOf(id);
    if (idx >= 0) {
      this.favorites.splice(idx, 1);
    } else {
      this.favorites.push(id);
    }
    this.saveFavorites();
    return this.isFavorite(id);
  }

  // --- Recently Used ---
  recordUsage(preset) {
    if (!preset) return;
    this.recentlyUsed = [preset.id, ...this.recentlyUsed.filter(id => id !== preset.id)].slice(0, 8);
  }

  // --- Custom User Presets (Immutable Defaults Protection) ---
  saveCustomPreset(type, name, parameters, description = 'Custom User Preset') {
    if (!name || !name.trim()) throw new Error('Preset name cannot be empty');
    const trimmed = name.trim();

    // Check if name conflicts with built-in preset
    const builtIn = type === 'vocal' ? VOCAL_PRESETS : MUSIC_PRESETS;
    if (builtIn.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      throw new Error(`Cannot overwrite built-in preset "${trimmed}". Please use a custom name.`);
    }

    const customList = type === 'vocal' ? this.customVocalPresets : this.customMusicPresets;
    const existingIndex = customList.findIndex(p => p.name.toLowerCase() === trimmed.toLowerCase());

    const newPreset = {
      ...JSON.parse(JSON.stringify(parameters)),
      id: `custom-${type}-${Date.now()}`,
      name: trimmed,
      category: 'Custom Presets',
      description,
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      customList[existingIndex] = newPreset;
    } else {
      customList.push(newPreset);
    }

    this.saveCustomPresets(type);
    return newPreset;
  }

  deleteCustomPreset(type, id) {
    const customList = type === 'vocal' ? this.customVocalPresets : this.customMusicPresets;
    const idx = customList.findIndex(p => p.id === id);
    if (idx === -1) {
      throw new Error('Preset not found or cannot delete built-in presets');
    }
    customList.splice(idx, 1);
    this.saveCustomPresets(type);
    return true;
  }

  renameCustomPreset(type, id, newName) {
    if (!newName || !newName.trim()) throw new Error('New name cannot be empty');
    const customList = type === 'vocal' ? this.customVocalPresets : this.customMusicPresets;
    const target = customList.find(p => p.id === id);
    if (!target) throw new Error('Custom preset not found');

    const builtIn = type === 'vocal' ? VOCAL_PRESETS : MUSIC_PRESETS;
    if (builtIn.some(p => p.name.toLowerCase() === newName.trim().toLowerCase())) {
      throw new Error('Name conflicts with a built-in preset');
    }

    target.name = newName.trim();
    this.saveCustomPresets(type);
    return target;
  }

  // --- Import / Export ---
  exportPresets(type) {
    const list = type === 'vocal' ? this.customVocalPresets : this.customMusicPresets;
    return JSON.stringify({
      app: 'TBR DIGITAL MIXER',
      version: '1.0.0',
      type,
      exportedAt: new Date().toISOString(),
      presets: list
    }, null, 2);
  }

  importPresets(jsonString) {
    try {
      const data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
      if (!data.presets || !Array.isArray(data.presets)) {
        throw new Error('Invalid preset file format');
      }
      let count = 0;
      data.presets.forEach(p => {
        if (p.name) {
          const type = data.type || (p.subBass ? 'music' : 'vocal');
          this.saveCustomPreset(type, p.name, p, p.description || 'Imported preset');
          count++;
        }
      });
      return { success: true, count };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // --- A/B Comparison ---
  setSlotA(type, state) {
    if (type === 'vocal') this.vocalStateA = JSON.parse(JSON.stringify(state));
    else this.musicStateA = JSON.parse(JSON.stringify(state));
  }

  setSlotB(type, state) {
    if (type === 'vocal') this.vocalStateB = JSON.parse(JSON.stringify(state));
    else this.musicStateB = JSON.parse(JSON.stringify(state));
  }

  toggleAB(type) {
    if (type === 'vocal') {
      this.activeVocalSlot = this.activeVocalSlot === 'A' ? 'B' : 'A';
      return { slot: this.activeVocalSlot, state: this.activeVocalSlot === 'A' ? this.vocalStateA : this.vocalStateB };
    } else {
      this.activeMusicSlot = this.activeMusicSlot === 'A' ? 'B' : 'A';
      return { slot: this.activeMusicSlot, state: this.activeMusicSlot === 'A' ? this.musicStateA : this.musicStateB };
    }
  }

  // --- Persistence Helpers ---
  loadCustomPresets(type) {
    if (!this.storage) return [];
    try {
      const data = this.storage.getItem(`tbr_${type}_custom_presets`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveCustomPresets(type) {
    if (!this.storage) return;
    try {
      const list = type === 'vocal' ? this.customVocalPresets : this.customMusicPresets;
      this.storage.setItem(`tbr_${type}_custom_presets`, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save presets:', e);
    }
  }

  loadFavorites() {
    if (!this.storage) return [];
    try {
      const data = this.storage.getItem('tbr_favorites');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveFavorites() {
    if (!this.storage) return;
    try {
      this.storage.setItem('tbr_favorites', JSON.stringify(this.favorites));
    } catch (e) {
      console.warn('Failed to save favorites:', e);
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PresetManager };
}
