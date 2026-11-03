/**
 * TBR DIGITAL MIXER — Preload Script
 * Provides clean bridge to electron APIs and system paths
 */

const { ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

window.tbrDesktop = {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  exportPresetFile: async (content, defaultName) => {
    const res = await ipcRenderer.invoke('show-save-dialog', defaultName);
    if (!res.canceled && res.filePath) {
      fs.writeFileSync(res.filePath, content, 'utf-8');
      return { success: true, path: res.filePath };
    }
    return { success: false, canceled: true };
  },
  importPresetFile: async () => {
    const res = await ipcRenderer.invoke('show-open-dialog');
    if (!res.canceled && res.filePaths && res.filePaths[0]) {
      const content = fs.readFileSync(res.filePaths[0], 'utf-8');
      return { success: true, content, path: res.filePaths[0] };
    }
    return { success: false, canceled: true };
  }
};
