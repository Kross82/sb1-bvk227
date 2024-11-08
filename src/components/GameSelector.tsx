import React, { useState, useEffect } from 'react';
import { Search, Loader2, FolderOpen } from 'lucide-react';
import { detectInstalledGames } from '../services/gameDetection';
import { FeaturedGames } from './FeaturedGames';
import type { Game } from '../types';

interface Props {
  selectedGame: Game | null;
  onGameSelect: (game: Game) => void;
}

export function GameSelector({ selectedGame, onGameSelect }: Props) {
  const [installedGames, setInstalledGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    detectGames();
  }, []);

  const detectGames = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const games = await detectInstalledGames();
      setInstalledGames(games);
    } catch (err) {
      setError('Failed to detect games');
      console.error('Game detection failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.webkitdirectory = true;
      input.directory = true;

      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files) {
          const newGames = Array.from(files)
            .filter(file => !file.name.startsWith('.'))
            .map(file => ({
              id: `custom-${file.name}-${Date.now()}`,
              name: file.name.replace(/\.[^/.]+$/, ''),
              path: file.path,
              image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=400',
              platform: 'Custom'
            }));
          
          setInstalledGames(prev => [...prev, ...newGames]);
        }
      };

      input.click();
    } catch (err) {
      setError('Failed to open file explorer');
      console.error('File selection failed:', err);
    }
  };

  const filteredGames = installedGames.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-200">Select Game</h2>
        <button
          onClick={handleFileSelect}
          className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <FolderOpen className="w-5 h-5" />
          <span>Browse</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      ) : (
        <FeaturedGames onGameSelect={onGameSelect} selectedGame={selectedGame} />
      )}

      {filteredGames.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Installed Games</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredGames.map((game) => (
              <button
                key={game.id}
                onClick={() => onGameSelect(game)}
                className={`text-left p-3 rounded-lg transition-colors ${
                  selectedGame?.id === game.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                }`}
              >
                {game.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}