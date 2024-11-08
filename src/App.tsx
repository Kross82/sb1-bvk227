import React from 'react';
import { SystemSpecsForm } from './components/SystemSpecsForm';
import { GameSelector } from './components/GameSelector';
import { OptimizedSettings } from './components/OptimizedSettings';
import { PerformanceGraphs } from './components/PerformanceGraphs';
import { Navigation } from './components/Navigation';
import { Crosshair, BarChart3, Gamepad2 } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { SystemSpecs, Game, GameSettings } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useLocalStorage<'optimize' | 'stats'>('activeTab', 'optimize');
  const [specs, setSpecs] = useLocalStorage<SystemSpecs>('systemSpecs', {
    cpu: 'i5-13600K',
    gpu: 'rtx4070',
    ram: 16,
    storage: 'ssd',
    monitor: {
      resolution: '1920x1080',
      refreshRate: 144,
      hdr: false
    }
  });

  const [selectedGame, setSelectedGame] = useLocalStorage<Game | null>('selectedGame', null);
  const [settings, setSettings] = useLocalStorage<GameSettings | null>('gameSettings', null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGameSelect = async (game: Game) => {
    setSelectedGame(game);
    setIsLoading(true);
    
    setTimeout(() => {
      setSettings({
        resolution: specs.monitor.resolution,
        quality: 'High',
        shadows: 'Medium',
        textures: 'High',
        antiAliasing: 'TAA',
        fps: specs.monitor.refreshRate,
        dlss: 'Quality',
        fsr: 'Off',
        rayTracing: true
      });
      setIsLoading(false);
    }, 2000);
  };

  const tabs = [
    { id: 'optimize', name: 'Optimize', icon: Crosshair },
    { id: 'stats', name: 'Statistics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-gray-800 border-b border-gray-700 z-10">
        <div className="max-w-7xl mx-auto h-full px-4 flex items-center">
          <div className="flex items-center space-x-3">
            <Gamepad2 className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
              KrossOptimize
            </h1>
          </div>
        </div>
      </header>

      {/* Side Navigation */}
      <Navigation 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={(tab) => setActiveTab(tab as 'optimize' | 'stats')} 
      />

      {/* Main Content */}
      <main className="pt-20 pl-24">
        <div className="max-w-7xl mx-auto p-6">
          {activeTab === 'optimize' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <GameSelector selectedGame={selectedGame} onGameSelect={handleGameSelect} />
              </div>
              <div className="space-y-6">
                <SystemSpecsForm specs={specs} onSpecsChange={setSpecs} />
                <OptimizedSettings settings={settings} isLoading={isLoading} />
              </div>
            </div>
          ) : (
            <PerformanceGraphs />
          )}
        </div>
      </main>
    </div>
  );
}