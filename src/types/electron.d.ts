export interface ElectronAPI {
  systemInfo: {
    detectCPU: () => Promise<{
      manufacturer: string;
      brand: string;
      cores: number;
      speed: number;
    }>;
    detectGPU: () => Promise<{
      vendor: string;
      model: string;
      vram: number;
    }>;
    detectRAM: () => Promise<number>;
    detectMonitor: () => Promise<{
      resolution: string;
      refreshRate: number;
      hdr: boolean;
    }>;
    detectGames: () => Promise<Game[]>;
  };
  window: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}