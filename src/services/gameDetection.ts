import { Game } from '../types';

// Common game installation paths for different platforms
const GAME_PATHS = {
  steam: {
    windows: [
      'C:\\Program Files (x86)\\Steam\\steamapps\\common',
      'C:\\Program Files\\Steam\\steamapps\\common',
      'D:\\Steam\\steamapps\\common',
      'E:\\Steam\\steamapps\\common'
    ],
    mac: ['~/Library/Application Support/Steam/steamapps/common'],
    linux: ['~/.local/share/Steam/steamapps/common']
  },
  epic: {
    windows: [
      'C:\\Program Files\\Epic Games',
      'C:\\Program Files (x86)\\Epic Games',
      'D:\\Epic Games',
      'E:\\Epic Games'
    ]
  },
  battlenet: {
    windows: [
      'C:\\Program Files (x86)\\Battle.net\\Games',
      'C:\\Program Files\\Battle.net\\Games',
      'D:\\Battle.net\\Games',
      'E:\\Battle.net\\Games'
    ]
  },
  origin: {
    windows: [
      'C:\\Program Files (x86)\\Origin Games',
      'C:\\Program Files\\Origin Games',
      'D:\\Origin Games',
      'E:\\Origin Games'
    ]
  }
};

export async function detectInstalledGames(): Promise<Game[]> {
  try {
    // Try to use the Electron API if available (when running as desktop app)
    if (window.electron?.systemInfo?.detectGames) {
      const games = await window.electron.systemInfo.detectGames();
      if (games && games.length > 0) {
        return games;
      }
    }

    // Fallback: Check for game launchers using protocol handlers
    const launchers = await detectGameLaunchers();
    const detectedGames: Game[] = [];

    if (launchers.steam) {
      detectedGames.push(
        {
          id: 'cs2',
          name: 'Counter-Strike 2',
          image: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&q=80&w=400',
          platform: 'Steam'
        },
        {
          id: 'baldursgate3',
          name: "Baldur's Gate 3",
          image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=400',
          platform: 'Steam'
        }
      );
    }

    if (launchers.battlenet) {
      detectedGames.push(
        {
          id: 'diablo4',
          name: 'Diablo IV',
          image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400',
          platform: 'Battle.net'
        },
        {
          id: 'mw3',
          name: 'Call of Duty: Modern Warfare III',
          image: 'https://images.unsplash.com/photo-1616514169928-a1e40c6f791c?auto=format&fit=crop&q=80&w=400',
          platform: 'Battle.net'
        }
      );
    }

    if (launchers.epic) {
      detectedGames.push(
        {
          id: 'fortnite',
          name: 'Fortnite',
          image: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?auto=format&fit=crop&q=80&w=400',
          platform: 'Epic'
        },
        {
          id: 'rocketleague',
          name: 'Rocket League',
          image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=400',
          platform: 'Epic'
        }
      );
    }

    return detectedGames;
  } catch (error) {
    console.error('Game detection failed:', error);
    return [];
  }
}

async function detectGameLaunchers(): Promise<{ 
  steam: boolean; 
  epic: boolean; 
  battlenet: boolean;
  origin: boolean;
}> {
  const launchers = {
    steam: false,
    epic: false,
    battlenet: false,
    origin: false
  };

  try {
    // Check for launcher protocols
    launchers.steam = await checkProtocol('steam://');
    launchers.epic = await checkProtocol('com.epicgames.launcher://');
    launchers.battlenet = await checkProtocol('battlenet://');
    launchers.origin = await checkProtocol('origin://');

    // Also check registry/file paths when in Electron
    if (window.electron?.systemInfo?.detectGameLaunchers) {
      const detected = await window.electron.systemInfo.detectGameLaunchers();
      Object.assign(launchers, detected);
    }
  } catch (error) {
    console.error('Launcher detection failed:', error);
  }

  return launchers;
}

function checkProtocol(protocol: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      let called = false;
      const timeoutId = setTimeout(() => {
        if (!called) {
          called = true;
          document.body.removeChild(iframe);
          resolve(false);
        }
      }, 100);

      window.addEventListener('blur', () => {
        if (!called) {
          called = true;
          clearTimeout(timeoutId);
          document.body.removeChild(iframe);
          resolve(true);
        }
      }, { once: true });

      iframe.contentWindow?.location.assign(protocol);
    } catch {
      resolve(false);
    }
  });
}