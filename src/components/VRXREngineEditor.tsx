import React, { useState } from 'react';
import { Glasses, Box, Eye, Navigation, Hand, Cable, Activity, ScanFace, Globe, Layers } from 'lucide-react';

export default function VRXREngineEditor() {
  const [activeTab, setActiveTab] = useState('tracking');

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#c9d1d9]">
      <div className="h-16 bg-[#0a0a0a] border-b border-[#30363d] flex items-center px-6 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#bc8cff]/10 to-transparent pointer-events-none"></div>
        <Glasses className="text-[#bc8cff] mr-4 shadow-[0_0_15px_rgba(188,140,255,0.4)]" size={32} />
        <div>
          <h2 className="text-white text-[16px] font-bold tracking-tight">OpenXR VR/MR Development Hub</h2>
          <p className="text-[#8b949e] text-[11px]">Deploy to Quest, Vision Pro, and SteamVR seamlessly.</p>
        </div>
      </div>

      <div className="flex bg-[#161b22] border-b border-[#30363d] h-10 px-4">
        <button onClick={() => setActiveTab('tracking')} className={`px-4 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 ${activeTab === 'tracking' ? 'text-[#bc8cff] border-b-2 border-[#bc8cff]' : 'text-[#8b949e] hover:text-white'}`}>
          <ScanFace size={14}/> Tracking & Locomotion
        </button>
        <button onClick={() => setActiveTab('interaction')} className={`px-4 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 ${activeTab === 'interaction' ? 'text-[#58a6ff] border-b-2 border-[#58a6ff]' : 'text-[#8b949e] hover:text-white'}`}>
          <Hand size={14}/> Hand & Controller Input
        </button>
        <button onClick={() => setActiveTab('rendering')} className={`px-4 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 ${activeTab === 'rendering' ? 'text-[#3fb950] border-b-2 border-[#3fb950]' : 'text-[#8b949e] hover:text-white'}`}>
          <Eye size={14}/> Foveated Rendering
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {activeTab === 'tracking' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
               <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Navigation size={16} className="text-[#bc8cff]"/> Locomotion System</h3>
               <div className="space-y-3">
                 <label className="flex items-center justify-between text-[12px] bg-[#0d1117] p-3 rounded border border-[#30363d]">
                    <div>
                      <div className="text-white font-bold">Continuous Movement</div>
                      <div className="text-[#8b949e] text-[10px]">Standard thumbstick sliding.</div>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-4 h-4"/>
                 </label>
                 <label className="flex items-center justify-between text-[12px] bg-[#0d1117] p-3 rounded border border-[#30363d]">
                    <div>
                      <div className="text-white font-bold">Teleportation NavMesh</div>
                      <div className="text-[#8b949e] text-[10px]">Arc-based point and teleport to avoid nausea.</div>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-4 h-4"/>
                 </label>
                 <label className="flex items-center justify-between text-[12px] bg-[#0d1117] p-3 rounded border border-[#30363d]">
                    <div>
                      <div className="text-white font-bold">Vignette Tunneling (Comfort)</div>
                      <div className="text-[#8b949e] text-[10px]">Darken screen edges during high-speed movement.</div>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-4 h-4"/>
                 </label>
               </div>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
               <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Globe size={16} className="text-[#58a6ff]"/> World Scale & Passthrough (MR)</h3>
               <div className="space-y-4 text-[12px]">
                 <div>
                   <span className="text-[#8b949e] block mb-2">Mixed Reality Passthrough Mode</span>
                   <select defaultValue="AR Passthrough (Color Selective)" className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white outline-none">
                     <option>VR Only (Opaque)</option>
                     <option>AR Passthrough (Color Selective)</option>
                     <option>Full MR (Masking Objects)</option>
                   </select>
                 </div>
                 <div>
                   <span className="text-[#8b949e] block mb-2">World Tracking Origin</span>
                   <select defaultValue="Floor-Level (Roomscale)" className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white outline-none">
                     <option>Head-locked</option>
                     <option>Eye-Level (Seated)</option>
                     <option>Floor-Level (Roomscale)</option>
                   </select>
                 </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'rendering' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-[#161b22] border border-[#3fb950]/30 rounded-lg p-5 shadow-[0_0_20px_rgba(63,185,80,0.1)] relative overflow-hidden">
               <div className="absolute right-0 top-0 w-32 h-32 bg-[#3fb950] mix-blend-multiply opacity-10 rounded-full filter blur-2xl"></div>
               <h3 className="text-white font-bold mb-2 flex items-center gap-2 text-lg"><Eye className="text-[#3fb950]"/> Eye-Tracking Foveated Rendering</h3>
               <p className="text-[#8b949e] text-[12px] mb-6 border-b border-[#30363d] pb-4">Dramatically increases GPU performance by rendering at full resolution only where the user is directly looking, while blurring peripheral vision dynamically via eye-tracking cameras.</p>
               
               <div className="grid grid-cols-2 gap-8">
                 <div>
                    <label className="flex items-center justify-between mb-4">
                      <span className="text-white text-[12px] font-bold">Enable Foveated Rendering</span>
                      <input type="checkbox" defaultChecked className="accent-[#3fb950] w-5 h-5"/>
                    </label>
                    <label className="flex items-center justify-between mb-4">
                      <span className="text-white text-[12px] font-bold">Fallback to Fixed Foveation</span>
                      <input type="checkbox" defaultChecked className="accent-[#3fb950] w-5 h-5"/>
                    </label>
                 </div>
                 <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#c9d1d9]">Inner Resolution Bound</span>
                        <span className="text-[#3fb950] font-mono">1.0x</span>
                      </div>
                      <input type="range" className="w-full accent-[#3fb950]" defaultValue="100"/>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#c9d1d9]">Peripheral Resolution Dropoff</span>
                        <span className="text-[#3fb950] font-mono">0.125x</span>
                      </div>
                      <input type="range" className="w-full accent-[#3fb950]" defaultValue="20"/>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
