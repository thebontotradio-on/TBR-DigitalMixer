/**
 * TBR DIGITAL MIXER — Electron Main Process
 * Desktop application entry point, native window frame, audio permissions, and IPC
 */

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 860,
    minWidth: 1200,
    minHeight: 720,
    title: 'TBR DIGITAL MIXER',
    icon: path.join(__dirname, '../../assets/icon.ico'),
    frame: false, // Custom sleek dark workstation frame
    backgroundColor: '#121417',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false, // Ensures audio does NOT glitch when window is minimized or behind other apps!
      autoplayPolicy: 'no-user-gesture-required'
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Window control IPC handlers
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

// Preset export / import dialogs
ipcMain.handle('show-save-dialog', async (event, defaultName) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Export TBR Presets',
    defaultPath: defaultName || 'TBR_Presets.json',
    filters: [{ name: 'TBR Preset File (*.json)', extensions: ['json'] }]
  });
  return result;
});

ipcMain.handle('show-open-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Import TBR Presets',
    properties: ['openFile'],
    filters: [{ name: 'TBR Preset File (*.json)', extensions: ['json'] }]
  });
  return result;
});

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
