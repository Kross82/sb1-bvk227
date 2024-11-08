"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electron", {
  systemInfo: {
    detectCPU: () => electron.ipcRenderer.invoke("detect-cpu"),
    detectGPU: () => electron.ipcRenderer.invoke("detect-gpu"),
    detectRAM: () => electron.ipcRenderer.invoke("detect-ram"),
    detectMonitor: () => electron.ipcRenderer.invoke("detect-monitor"),
    detectGames: () => electron.ipcRenderer.invoke("detect-games")
  },
  window: {
    minimize: () => electron.ipcRenderer.send("minimize-window"),
    maximize: () => electron.ipcRenderer.send("maximize-window"),
    close: () => electron.ipcRenderer.send("close-window")
  }
});
