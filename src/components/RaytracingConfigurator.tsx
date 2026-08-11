import React, { useState } from 'react';
import { Sun, Settings, Play, Save, RefreshCw, BarChart2, Layers} from 'lucide-react';

export default function RaytracingConfigurator() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] text-gray-200 font-sans">
      <div className="flex items-center justify-between p-4 border-b border-[#2a2b3d] bg-[#1a1b2d]">
        <div className="flex items-center gap-3">
          <Sun className="text-blue-400" size={24} />
          <h1 className="text-xl font-bold tracking-tight">Raytracing Config</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-[#2a2b3d] rounded text-gray-400 hover:text-white transition-colors">
            <RefreshCw size={16} />
          </button>
          <button className="p-2 hover:bg-[#2a2b3d] rounded text-gray-400 hover:text-white transition-colors">
            <Save size={16} />
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium flex items-center gap-2 transition-colors">
            <Play size={16} />
            <span>Simulate</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-[#2a2b3d] bg-[#11111a] flex flex-col">
          <div className="p-4 border-b border-[#2a2b3d]">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Workspace</h2>
            <div className="space-y-1">
              <button onClick={() => setActiveTab('overview')} className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors ${activeTab === 'overview' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#2a2b3d] text-gray-400'}`}>
                <Layers size={14} /> Overview
              </button>
              <button onClick={() => setActiveTab('settings')} className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors ${activeTab === 'settings' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#2a2b3d] text-gray-400'}`}>
                <Settings size={14} /> Configuration
              </button>
              <button onClick={() => setActiveTab('metrics')} className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors ${activeTab === 'metrics' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#2a2b3d] text-gray-400'}`}>
                <BarChart2 size={14} /> Metrics
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
             <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Presets</h2>
             <div className="space-y-2">
                {[1,2,3].map(i => (
                  <div key={i} className="p-2 border border-[#2a2b3d] rounded bg-[#0a0a0f] hover:border-blue-500/50 cursor-pointer transition-colors">
                    <div className="text-sm text-gray-300">Preset 0{i}</div>
                    <div className="text-xs text-gray-600 font-mono mt-1">Hash: {Math.random().toString(36).substring(2,8)}</div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#0a0a0f]">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-[#11111a] border border-[#2a2b3d] rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-200 mb-2">System Diagnostics</h2>
              <p className="text-sm text-gray-400 mb-6">Real-time status and advanced configurations for Raytracing Config. All changes are hot-reloaded into the Omni Engine.</p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#0a0a0f] p-4 rounded border border-[#2a2b3d]">
                  <div className="text-xs text-gray-500 uppercase mb-1">Status</div>
                  <div className="text-xl font-mono text-green-400">ONLINE</div>
                </div>
                <div className="bg-[#0a0a0f] p-4 rounded border border-[#2a2b3d]">
                  <div className="text-xs text-gray-500 uppercase mb-1">Active Nodes</div>
                  <div className="text-xl font-mono text-blue-400">{(Math.random() * 1000).toFixed(0)}</div>
                </div>
                <div className="bg-[#0a0a0f] p-4 rounded border border-[#2a2b3d]">
                  <div className="text-xs text-gray-500 uppercase mb-1">Latency</div>
                  <div className="text-xl font-mono text-yellow-400">{(Math.random() * 5).toFixed(2)}ms</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-300 border-b border-[#2a2b3d] pb-2">Core Parameters</h3>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[#0a0a0f] rounded border border-[#2a2b3d]">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-300 font-medium">Parameter {i}</span>
                      <span className="text-xs text-gray-500">Adjust the sub-routine threshold for optimal performance.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="range" className="w-32 accent-blue-500" />
                      <span className="text-xs font-mono text-gray-400 w-8">{(Math.random() * 100).toFixed(0)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#11111a] border border-[#2a2b3d] rounded-lg p-6">
                 <h2 className="text-sm font-bold text-gray-300 mb-4">Memory Allocation Graph</h2>
                 <div className="h-40 flex items-end gap-1">
                    {Array.from({length: 20}).map((_, i) => (
                      <div key={i} className="flex-1 bg-blue-600/40 rounded-t" style={{height: `${Math.random() * 100}%`}}></div>
                    ))}
                 </div>
              </div>
              <div className="bg-[#11111a] border border-[#2a2b3d] rounded-lg p-6">
                 <h2 className="text-sm font-bold text-gray-300 mb-4">Execution Log</h2>
                 <div className="space-y-2 h-40 overflow-y-auto pr-2">
                    {Array.from({length: 8}).map((_, i) => (
                      <div key={i} className="text-xs font-mono text-gray-500 border-l-2 border-green-500 pl-2">
                        [{(new Date()).toISOString().split('T')[1].substring(0,8)}] Init routine 0x{Math.random().toString(16).substring(2,6)}
                      </div>
                    ))}
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
