import React from 'react';
import { Settings, Zap } from 'lucide-react';
import type { GameSettings } from '../types';

interface Props {
  settings: GameSettings | null;
  isLoading: boolean;
}

export function OptimizedSettings({ settings, isLoading }: Props) {
  if (!settings && !isLoading) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-bold text-gray-200">Optimized Settings</h2>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-400">AI is analyzing optimal settings...</p>
        </div>
      ) : settings ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(settings).map(([key, value]) => (
            <div key={key} className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-gray-200">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </span>
              </div>
              <p className="text-gray-300">
                {typeof value === 'boolean' ? (value ? 'Enabled' : 'Disabled') : value}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}