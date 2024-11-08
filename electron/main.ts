import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as si from 'systeminformation';
import { detectGames } from './gameDetection';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hidden',
    frame: false,
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// System detection IPC handlers
ipcMain.handle('detect-cpu', async () => {
  const cpu = await si.cpu();
  return {
    manufacturer: cpu.manufacturer,
    brand: cpu.brand,
    cores: cpu.cores,
    speed: cpu.speed
  };
});

ipcMain.handle('detect-gpu', async () => {
  const graphics = await si.graphics();
  return graphics.controllers[0];
});

ipcMain.handle('detect-ram', async () => {
  const mem = await si.mem();
  return Math.round(mem.total / (1024 * 1024 * 1024)); // Convert to GB
});

ipcMain.handle('detect-monitor', async () => {
  const displays = await si.graphics();
  const primaryDisplay = displays.displays[0];
  return {
    resolution: `${primaryDisplay.resolutionX}x${primaryDisplay.resolutionY}`,
    refreshRate: primaryDisplay.refreshRate,
    hdr: primaryDisplay.pixelDepth > 24
  };
});

ipcMain.handle('detect-games', async () => {
  return await detectGames();
});