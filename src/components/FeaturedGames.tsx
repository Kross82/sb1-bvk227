import React from 'react';
import type { Game } from '../types';

const featuredGames: Game[] = [
  {
    id: 'cyberpunk2077',
    name: 'Cyberpunk 2077',
    image: 'https://images.unsplash.com/photo-1605899435973-ca2d1a8c7e2d?auto=format&fit=crop&q=80&w=400',
    platform: 'Steam'
  },
  {
    id: 'baldursgate3',
    name: "Baldur's Gate 3",
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=400',
    platform: 'Steam'
  },
  {
    id: 'diablo4',
    name: 'Diablo IV',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400',
    platform: 'Battle.net'
  },
  {
    id: 'starfield',
    name: 'Starfield',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400',
    platform: 'Steam'
  }
];

interface Props {
  onGameSelect: (game: Game) => void;
  selectedGame: Game | null;
}

export function FeaturedGames({ onGameSelect, selectedGame }: Props) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-400">Featured Games</h3>
      <div className="space-y-2">
        {featuredGames.map((game) => (
          <button
            key={game.id}
            onClick={() => onGameSelect(game)}
            className={`w-full text-left p-2 rounded-lg transition-colors ${
              selectedGame?.id === game.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <img
                src={game.image}
                alt={game.name}
                className="w-12 h-12 rounded object-cover"
              />
              <div>
                <div className="font-medium">{game.name}</div>
                <div className="text-sm text-gray-400">{game.platform}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}