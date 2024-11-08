import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Tab {
  id: string;
  name: string;
  icon: LucideIcon;
}

interface Props {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ tabs, activeTab, onTabChange }: Props) {
  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-20 bg-gray-800 border-r border-gray-700">
      <nav className="flex flex-col items-center py-4 space-y-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`p-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
              title={tab.name}
            >
              <Icon className="w-6 h-6" />
              <span className="sr-only">{tab.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}