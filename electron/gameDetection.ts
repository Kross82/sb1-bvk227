import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Game } from '../src/types';

// Platform-specific paths
const STEAM_PATHS = {
  win32: 'C:\\Program Files (x86)\\Steam\\steamapps\\common',
  linux: '~/.local/share/Steam/steamapps/common',
  darwin: '~/Library/Application Support/Steam/steamapps/common'
};

const EPIC_PATHS = {
  win32: 'C:\\Program Files\\Epic Games',
  darwin: '~/Library/Application Support/Epic/EpicGamesLauncher/Data/Installed Games'
};

const BATTLENET_PATHS = {
  win32: 'C:\\Program Files (x86)\\Battle.net\\Games',
  darwin: '/Applications/Battle.net/Games'
};

export async function detectGames(): Promise<Game[]> {
  const games: Game[] = [];
  const platform = os.platform();

  try {
    // Detect Steam games
    const steamPath = STEAM_PATHS[platform as keyof typeof STEAM_PATHS];
    if (steamPath) {
      const expandedPath = steamPath.replace('~', os.homedir());
      if (fs.existsSync(expandedPath)) {
        const steamGames = await detectSteamGames(expandedPath);
        games.push(...steamGames);
      }
    }

    // Detect Epic games
    const epicPath = EPIC_PATHS[platform as keyof typeof EPIC_PATHS];
    if (epicPath) {
      const expandedPath = epicPath.replace('~', os.homedir());
      if (fs.existsSync(expandedPath)) {
        const epicGames = await detectEpicGames(expandedPath);
        games.push(...epicGames);
      }
    }

    // Detect Battle.net games
    const battlenetPath = BATTLENET_PATHS[platform as keyof typeof BATTLENET_PATHS];
    if (battlenetPath) {
      const expandedPath = battlenetPath.replace('~', os.homedir());
      if (fs.existsSync(expandedPath)) {
        const battlenetGames = await detectBattleNetGames(expandedPath);
        games.push(...battlenetGames);
      }
    }

    return games;
  } catch (error) {
    console.error('Game detection failed:', error);
    return [];
  }
}

async function detectSteamGames(steamPath: string): Promise<Game[]> {
  const games: Game[] = [];
  const commonPath = path.join(steamPath, 'common');

  try {
    const directories = fs.readdirSync(commonPath);
    
    for (const dir of directories) {
      const gamePath = path.join(commonPath, dir);
      const gameExecutables = fs.readdirSync(gamePath)
        .filter(file => file.endsWith('.exe') || file.endsWith('.app'));

      if (gameExecutables.length > 0) {
        games.push({
          id: dir.toLowerCase().replace(/[^a-z0-9]/g, ''),
          name: dir,
          image: getGameImage(dir),
          platform: 'Steam'
        });
      }
    }
  } catch (error) {
    console.error('Steam games detection failed:', error);
  }

  return games;
}

async function detectEpicGames(epicPath: string): Promise<Game[]> {
  const games: Game[] = [];

  try {
    const directories = fs.readdirSync(epicPath);
    
    for (const dir of directories) {
      const gamePath = path.join(epicPath, dir);
      if (fs.statSync(gamePath).isDirectory()) {
        games.push({
          id: dir.toLowerCase().replace(/[^a-z0-9]/g, ''),
          name: dir,
          image: getGameImage(dir),
          platform: 'Epic'
        });
      }
    }
  } catch (error) {
    console.error('Epic games detection failed:', error);
  }

  return games;
}

async function detectBattleNetGames(battlenetPath: string): Promise<Game[]> {
  const games: Game[] = [];

  try {
    const directories = fs.readdirSync(battlenetPath);
    
    for (const dir of directories) {
      const gamePath = path.join(battlenetPath, dir);
      if (fs.statSync(gamePath).isDirectory()) {
        games.push({
          id: dir.toLowerCase().replace(/[^a-z0-9]/g, ''),
          name: dir,
          image: getGameImage(dir),
          platform: 'Battle.net'
        });
      }
    }
  } catch (error) {
    console.error('Battle.net games detection failed:', error);
  }

  return games;
}

function getGameImage(gameName: string): string {
  // Map of game names to placeholder images
  const gameImages: { [key: string]: string } = {
    'Counter-Strike 2': 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&q=80&w=400',
    'Cyberpunk 2077': 'https://images.unsplash.com/photo-1605899435973-ca2d1a8c7e2d?auto=format&fit=crop&q=80&w=400',
    'Diablo IV': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400',
    'Fortnite': 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?auto=format&fit=crop&q=80&w=400'
  };

  return gameImages[gameName] || 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=400';
}