"use strict";
const electron = require("electron");
const path = require("path");
const si = require("systeminformation");
const fs = require("fs");
const os = require("os");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
const si__namespace = /* @__PURE__ */ _interopNamespaceDefault(si);
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs);
const os__namespace = /* @__PURE__ */ _interopNamespaceDefault(os);
const STEAM_PATHS = {
  win32: "C:\\Program Files (x86)\\Steam\\steamapps\\common",
  linux: "~/.local/share/Steam/steamapps/common",
  darwin: "~/Library/Application Support/Steam/steamapps/common"
};
const EPIC_PATHS = {
  win32: "C:\\Program Files\\Epic Games",
  darwin: "~/Library/Application Support/Epic/EpicGamesLauncher/Data/Installed Games"
};
const BATTLENET_PATHS = {
  win32: "C:\\Program Files (x86)\\Battle.net\\Games",
  darwin: "/Applications/Battle.net/Games"
};
async function detectGames() {
  const games = [];
  const platform = os__namespace.platform();
  try {
    const steamPath = STEAM_PATHS[platform];
    if (steamPath) {
      const expandedPath = steamPath.replace("~", os__namespace.homedir());
      if (fs__namespace.existsSync(expandedPath)) {
        const steamGames = await detectSteamGames(expandedPath);
        games.push(...steamGames);
      }
    }
    const epicPath = EPIC_PATHS[platform];
    if (epicPath) {
      const expandedPath = epicPath.replace("~", os__namespace.homedir());
      if (fs__namespace.existsSync(expandedPath)) {
        const epicGames = await detectEpicGames(expandedPath);
        games.push(...epicGames);
      }
    }
    const battlenetPath = BATTLENET_PATHS[platform];
    if (battlenetPath) {
      const expandedPath = battlenetPath.replace("~", os__namespace.homedir());
      if (fs__namespace.existsSync(expandedPath)) {
        const battlenetGames = await detectBattleNetGames(expandedPath);
        games.push(...battlenetGames);
      }
    }
    return games;
  } catch (error) {
    console.error("Game detection failed:", error);
    return [];
  }
}
async function detectSteamGames(steamPath) {
  const games = [];
  const commonPath = path__namespace.join(steamPath, "common");
  try {
    const directories = fs__namespace.readdirSync(commonPath);
    for (const dir of directories) {
      const gamePath = path__namespace.join(commonPath, dir);
      const gameExecutables = fs__namespace.readdirSync(gamePath).filter((file) => file.endsWith(".exe") || file.endsWith(".app"));
      if (gameExecutables.length > 0) {
        games.push({
          id: dir.toLowerCase().replace(/[^a-z0-9]/g, ""),
          name: dir,
          image: getGameImage(dir),
          platform: "Steam"
        });
      }
    }
  } catch (error) {
    console.error("Steam games detection failed:", error);
  }
  return games;
}
async function detectEpicGames(epicPath) {
  const games = [];
  try {
    const directories = fs__namespace.readdirSync(epicPath);
    for (const dir of directories) {
      const gamePath = path__namespace.join(epicPath, dir);
      if (fs__namespace.statSync(gamePath).isDirectory()) {
        games.push({
          id: dir.toLowerCase().replace(/[^a-z0-9]/g, ""),
          name: dir,
          image: getGameImage(dir),
          platform: "Epic"
        });
      }
    }
  } catch (error) {
    console.error("Epic games detection failed:", error);
  }
  return games;
}
async function detectBattleNetGames(battlenetPath) {
  const games = [];
  try {
    const directories = fs__namespace.readdirSync(battlenetPath);
    for (const dir of directories) {
      const gamePath = path__namespace.join(battlenetPath, dir);
      if (fs__namespace.statSync(gamePath).isDirectory()) {
        games.push({
          id: dir.toLowerCase().replace(/[^a-z0-9]/g, ""),
          name: dir,
          image: getGameImage(dir),
          platform: "Battle.net"
        });
      }
    }
  } catch (error) {
    console.error("Battle.net games detection failed:", error);
  }
  return games;
}
function getGameImage(gameName) {
  const gameImages = {
    "Counter-Strike 2": "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&q=80&w=400",
    "Cyberpunk 2077": "https://images.unsplash.com/photo-1605899435973-ca2d1a8c7e2d?auto=format&fit=crop&q=80&w=400",
    "Diablo IV": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400",
    "Fortnite": "https://images.unsplash.com/photo-1589241062272-c0a000072dfa?auto=format&fit=crop&q=80&w=400"
  };
  return gameImages[gameName] || "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=400";
}
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path__namespace.join(__dirname, "preload.js")
    },
    titleBarStyle: "hidden",
    frame: false
  });
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path__namespace.join(__dirname, "../dist/index.html"));
  }
}
electron.app.whenReady().then(createWindow);
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
electron.ipcMain.handle("detect-cpu", async () => {
  const cpu = await si__namespace.cpu();
  return {
    manufacturer: cpu.manufacturer,
    brand: cpu.brand,
    cores: cpu.cores,
    speed: cpu.speed
  };
});
electron.ipcMain.handle("detect-gpu", async () => {
  const graphics = await si__namespace.graphics();
  return graphics.controllers[0];
});
electron.ipcMain.handle("detect-ram", async () => {
  const mem = await si__namespace.mem();
  return Math.round(mem.total / (1024 * 1024 * 1024));
});
electron.ipcMain.handle("detect-monitor", async () => {
  const displays = await si__namespace.graphics();
  const primaryDisplay = displays.displays[0];
  return {
    resolution: `${primaryDisplay.resolutionX}x${primaryDisplay.resolutionY}`,
    refreshRate: primaryDisplay.refreshRate,
    hdr: primaryDisplay.pixelDepth > 24
  };
});
electron.ipcMain.handle("detect-games", async () => {
  return await detectGames();
});
