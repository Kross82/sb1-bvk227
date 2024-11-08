import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, MonitorUp, Loader2 } from 'lucide-react';
import type { SystemSpecs } from '../types';
import { detectSystemSpecs } from '../services/systemDetection';

interface Props {
  specs: SystemSpecs;
  onSpecsChange: (specs: SystemSpecs) => void;
}

export function SystemSpecsForm({ specs, onSpecsChange }: Props) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMonitorChange = (key: keyof SystemSpecs['monitor'], value: any) => {
    onSpecsChange({
      ...specs,
      monitor: {
        ...specs.monitor,
        [key]: value
      }
    });
  };

  const handleAutoDetect = async () => {
    setIsDetecting(true);
    setError(null);
    try {
      const detectedSpecs = await detectSystemSpecs();
      onSpecsChange(detectedSpecs);
    } catch (err) {
      console.error('Failed to detect system specs:', err);
      setError('Failed to detect hardware. Please select manually.');
    } finally {
      setIsDetecting(false);
    }
  };

  // Auto-detect on component mount
  useEffect(() => {
    handleAutoDetect();
  }, []);

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-200">System Specifications</h2>
        <button
          onClick={handleAutoDetect}
          disabled={isDetecting}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          {isDetecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Detecting...</span>
            </>
          ) : (
            <>
              <Cpu className="w-4 h-4" />
              <span>Auto-Detect</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Cpu className="w-5 h-5 text-blue-400" />
          <select
            className="flex-1 rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            value={specs.cpu}
            onChange={(e) => onSpecsChange({ ...specs, cpu: e.target.value })}
          >
            <optgroup label="Intel 14th Gen">
              <option value="i5-14600K">Intel Core i5-14600K</option>
              <option value="i7-14700K">Intel Core i7-14700K</option>
              <option value="i9-14900K">Intel Core i9-14900K</option>
            </optgroup>
            <optgroup label="Intel 13th Gen">
              <option value="i5-13600K">Intel Core i5-13600K</option>
              <option value="i7-13700K">Intel Core i7-13700K</option>
              <option value="i9-13900K">Intel Core i9-13900K</option>
            </optgroup>
            <optgroup label="AMD Ryzen 7000">
              <option value="r5-7600X">AMD Ryzen 5 7600X</option>
              <option value="r7-7700X">AMD Ryzen 7 7700X</option>
              <option value="r9-7950X">AMD Ryzen 9 7950X</option>
            </optgroup>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <Cpu className="w-5 h-5 text-green-400 rotate-180" />
          <select
            className="flex-1 rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            value={specs.gpu}
            onChange={(e) => onSpecsChange({ ...specs, gpu: e.target.value })}
          >
            <optgroup label="NVIDIA RTX 40 Series">
              <option value="rtx4060">NVIDIA RTX 4060</option>
              <option value="rtx4070">NVIDIA RTX 4070</option>
              <option value="rtx4080">NVIDIA RTX 4080</option>
              <option value="rtx4090">NVIDIA RTX 4090</option>
            </optgroup>
            <optgroup label="AMD RX 7000">
              <option value="rx7600">AMD RX 7600</option>
              <option value="rx7700xt">AMD RX 7700 XT</option>
              <option value="rx7800xt">AMD RX 7800 XT</option>
              <option value="rx7900xt">AMD RX 7900 XT</option>
            </optgroup>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <HardDrive className="w-5 h-5 text-purple-400" />
          <select
            className="flex-1 rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            value={specs.ram}
            onChange={(e) => onSpecsChange({ ...specs, ram: Number(e.target.value) })}
          >
            <option value="16">16GB RAM</option>
            <option value="32">32GB RAM</option>
            <option value="64">64GB RAM</option>
            <option value="128">128GB RAM</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <MonitorUp className="w-5 h-5 text-yellow-400" />
          <select
            className="flex-1 rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            value={specs.monitor.resolution}
            onChange={(e) => handleMonitorChange('resolution', e.target.value)}
          >
            <option value="1920x1080">1920x1080 (1080p)</option>
            <option value="2560x1440">2560x1440 (1440p)</option>
            <option value="3440x1440">3440x1440 (UW 1440p)</option>
            <option value="3840x2160">3840x2160 (4K)</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <MonitorUp className="w-5 h-5 text-yellow-400" />
          <select
            className="flex-1 rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            value={specs.monitor.refreshRate}
            onChange={(e) => handleMonitorChange('refreshRate', Number(e.target.value))}
          >
            <option value="60">60 Hz</option>
            <option value="144">144 Hz</option>
            <option value="165">165 Hz</option>
            <option value="240">240 Hz</option>
            <option value="360">360 Hz</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <MonitorUp className="w-5 h-5 text-yellow-400" />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={specs.monitor.hdr}
              onChange={(e) => handleMonitorChange('hdr', e.target.checked)}
              className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-white">HDR Support</span>
          </label>
        </div>
      </div>
    </div>
  );
}