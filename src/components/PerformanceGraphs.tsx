import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

interface PerformanceData {
  timestamp: number;
  cpu: number;
  gpu: number;
  latency: number;
  upload: number;
  download: number;
}

export function PerformanceGraphs() {
  const [data, setData] = useState<PerformanceData[]>([]);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData];
        const now = Date.now();
        
        if (newData.length > 20) {
          newData.shift();
        }

        newData.push({
          timestamp: now,
          cpu: Math.random() * 100,
          gpu: Math.random() * 100,
          latency: Math.random() * 50,
          upload: Math.random() * 10,
          download: Math.random() * 20
        });

        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg space-y-6">
      <div className="flex items-center space-x-2">
        <Activity className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-bold text-gray-800">Performance Monitoring</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU & GPU Usage */}
        <div className="h-[300px]">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">CPU & GPU Usage</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                domain={['auto', 'auto']}
                tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                formatter={(value: number) => [`${value.toFixed(1)}%`]}
              />
              <Legend />
              <Line type="monotone" dataKey="cpu" stroke="#3B82F6" name="CPU" />
              <Line type="monotone" dataKey="gpu" stroke="#10B981" name="GPU" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Latency */}
        <div className="h-[300px]">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Latency</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp"
                domain={['auto', 'auto']}
                tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              />
              <YAxis domain={[0, 'auto']} />
              <Tooltip 
                labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                formatter={(value: number) => [`${value.toFixed(1)}ms`]}
              />
              <Legend />
              <Line type="monotone" dataKey="latency" stroke="#8B5CF6" name="Latency" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Network Speed */}
        <div className="h-[300px] lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Network Speed</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp"
                domain={['auto', 'auto']}
                tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              />
              <YAxis domain={[0, 'auto']} />
              <Tooltip 
                labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                formatter={(value: number) => [`${value.toFixed(1)} Mbps`]}
              />
              <Legend />
              <Line type="monotone" dataKey="upload" stroke="#EC4899" name="Upload" />
              <Line type="monotone" dataKey="download" stroke="#F59E0B" name="Download" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}