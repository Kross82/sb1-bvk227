import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  systemInfo: {
    detectCPU: () => ipcRenderer.invoke('detect-cpu'),
    detectGPU: () => ipcRenderer.invoke('detect-gpu'),
    detectRAM: () => ipcRenderer.invoke('detect-ram'),
    detectMonitor: () => ipcRenderer.invoke('detect-monitor'),
    detectGames: () => ipcRenderer.invoke('detect-games')
  },
  window: {
    minimize: () => ipcRenderer.send('minimize-window'),
    maximize: () => ipcRenderer.send('maximize-window'),
    close: () => ipcRenderer.send('close-window')
  }
});