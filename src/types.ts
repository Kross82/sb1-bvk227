export interface SystemSpecs {
  cpu: string;
  gpu: string;
  ram: number;
  storage: string;
  monitor: {
    resolution: string;
    refreshRate: number;
    hdr: boolean;
  };
}

export interface Game {
  id: string;
  name: string;
  image: string;
}

export interface GameSettings {
  resolution: string;
  quality: string;
  shadows: string;
  textures: string;
  antiAliasing: string;
  fps: number;
}