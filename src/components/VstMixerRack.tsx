import React, { useState } from 'react';
import { Sliders, Volume2, Mic, Activity, Power, Settings2, Download, Save, RefreshCw, Layers, Database, Lock, Unlock, Zap, MoreHorizontal } from 'lucide-react';

export default function VstMixerRack() {
  const [channels] = useState(Array.from({ length: 8 }, (_, i) => ({ id: i + 1, name: `Channel ${i + 1}`, type: i === 0 ? 'Master' : i < 4 ? 'Audio' : 'MIDI', volume: Math.random() * 80 + 20, pan: 0 })));

  return (
    <div className="flex flex-col h-full bg-[#111111] text-[#c9d1d9] font-sans">
      
      {/* Top Header */}
      <div className="px-4 py-2 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-gradient-to-tr from-[#e3b341] to-[#f85149] text-white shadow-[0_0_15px_rgba(227,179,65,0.2)]">
            <Sliders size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-widest uppercase text-white flex items-center gap-2">
              VST / DSP Mixer Rack & Master Channel
            </h2>
            <p className="text-[#8b949e] text-[9px] font-mono">32-BIT FLOAT • SPATIAL AUDIO • DOLBY ATMOS ENABLED • 128 CHANNELS</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] px-3 py-1 flex items-center gap-2 text-[11px] font-bold rounded text-white transition"><Save size={14}/> Save Mixer State</button>
           <button className="bg-[#e3b341] hover:bg-[#d1a23a] text-black px-4 py-1 flex items-center gap-2 text-[11px] font-bold rounded shadow-lg shadow-[#e3b341]/20 transition"><Zap size={14}/> Render Audio Mixdown</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Main Mixer Area */}
         <div className="flex-1 overflow-x-auto bg-[#0d1117] flex border-r border-[#30363d] p-4 gap-2 custom-scrollbar">
            
            {channels.map((ch, idx) => (
               <div key={ch.id} className={`w-[120px] shrink-0 flex flex-col bg-[#161b22] border rounded overflow-hidden ${ch.type === 'Master' ? 'border-[#f85149]' : 'border-[#30363d]'}`}>
                  {/* Channel Header */}
                  <div className={`p-2 text-center text-[10px] font-bold uppercase truncate border-b border-[#30363d] ${ch.type === 'Master' ? 'bg-[#f85149]/20 text-[#f85149]' : 'bg-[#21262d] text-white'}`}>
                     {ch.name}
                  </div>
                  
                  {/* Routing & Inserts empty slots */}
                  <div className="h-[100px] border-b border-[#30363d] p-1 space-y-1 overflow-y-auto">
                     <div className="bg-[#0d1117] border border-[#30363d] rounded p-1 text-[9px] text-[#8b949e] flex justify-between items-center cursor-pointer hover:border-[#58a6ff]">
                        <span className="truncate">EQ Eight</span> <Power size={10} className="text-[#3fb950]"/>
                     </div>
                     <div className="bg-[#0d1117] border border-[#30363d] rounded p-1 text-[9px] text-[#8b949e] flex justify-between items-center cursor-pointer hover:border-[#58a6ff]">
                        <span className="truncate">Compressor</span> <Power size={10} className="text-[#3fb950]"/>
                     </div>
                     {idx % 3 === 0 && (
                        <div className="bg-[#0d1117] border border-[#30363d] rounded p-1 text-[9px] text-[#e3b341] flex justify-between items-center cursor-pointer hover:border-[#e3b341]">
                           <span className="truncate">FabFilter Pro-L</span> <Power size={10} className="text-[#3fb950]"/>
                        </div>
                     )}
                     <button className="w-full text-left bg-black border border-dashed border-[#444] rounded p-1 text-[9px] text-[#555] hover:text-white mt-1">+ FX Slot</button>
                  </div>

                  {/* Sends */}
                  <div className="h-[60px] border-b border-[#30363d] p-2 space-y-2">
                     <div className="flex items-center gap-2">
                        <span className="text-[9px] text-[#8b949e] w-2">A</span>
                        <div className="flex-1 h-3 bg-black rounded-full overflow-hidden border border-[#30363d] relative">
                           <div className="absolute top-0 bottom-0 left-0 bg-[#58a6ff]" style={{ width: `${Math.random() * 100}%` }}></div>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="text-[9px] text-[#8b949e] w-2">B</span>
                        <div className="flex-1 h-3 bg-black rounded-full overflow-hidden border border-[#30363d] relative">
                           <div className="absolute top-0 bottom-0 left-0 bg-[#bc8cff]" style={{ width: `${Math.random() * 50}%` }}></div>
                        </div>
                     </div>
                  </div>

                  {/* Pan Knob Simulation */}
                  <div className="py-3 flex justify-center border-b border-[#30363d]">
                     <div className="w-8 h-8 rounded-full border-2 border-[#30363d] bg-black relative">
                        <div className="absolute top-1/2 left-1/2 w-0.5 h-3 bg-white -translate-x-1/2 origin-bottom" style={{ transform: `translateX(-50%) rotate(${Math.random() * 120 - 60}deg)` }}></div>
                     </div>
                  </div>

                  {/* Fader & Meter Area */}
                  <div className="flex-1 flex px-2 py-4 gap-2 relative">
                     {/* Fader Rail */}
                     <div className="flex-1 flex justify-center relative group cursor-pointer">
                        <div className="w-1.5 h-full bg-black rounded-full border border-[#30363d] relative">
                           {/* The Fader Cap */}
                           <div className="absolute w-8 h-4 bg-gradient-to-b from-[#444] to-[#222] border border-[#555] rounded shadow text-[7px] text-center leading-[14px] text-white -translate-x-1/2 left-1/2 hover:brightness-125 transition" style={{ top: `${100 - ch.volume}%`, transform: 'translate(-50%, -50%)' }}>
                              <div className="w-4 h-[1px] bg-white absolute top-1/2 left-1/2 -translate-x-1/2"></div>
                           </div>
                        </div>
                     </div>
                     
                     {/* Meter */}
                     <div className="w-3 h-full bg-black border border-[#30363d] rounded-sm overflow-hidden flex items-end">
                        <div className={`w-full bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 opacity-80`} style={{ height: `${ch.volume * (Math.random() * 0.4 + 0.6)}%` }}></div>
                     </div>
                  </div>

                  {/* Channel Strip Controls */}
                  <div className="p-2 grid grid-cols-2 gap-1 pb-4">
                     <button className="bg-black hover:bg-yellow-900 border border-[#30363d] hover:border-yellow-500 text-[#888] hover:text-yellow-500 rounded text-[10px] font-bold py-1">S</button>
                     <button className="bg-black hover:bg-red-900 border border-[#30363d] hover:border-red-500 text-[#888] hover:text-red-500 rounded text-[10px] font-bold py-1">M</button>
                     <button className="col-span-2 bg-black border border-[#30363d] rounded text-[10px] py-1 text-[#8b949e]">Route &gt;</button>
                  </div>

               </div>
            ))}

         </div>

         {/* Audio Output / Routing Settings Sidebar */}
         <div className="w-[300px] bg-[#161b22] flex flex-col shrink-0">
             <div className="p-4 border-b border-[#30363d] bg-[#161b22]">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2"><Settings2 size={16} className="text-[#58a6ff]"/> Audio Hardware Routing</h3>
             </div>
             
             <div className="p-4 space-y-5 flex-1 overflow-y-auto custom-scrollbar">
                
                <div className="space-y-2">
                   <label className="text-[10px] uppercase font-bold text-[#8b949e]">Audio Device / Driver</label>
                   <select className="w-full bg-[#0d1117] border border-[#30363d] rounded text-white p-2 text-[11px] outline-none">
                      <option>ASIO4ALL v2 (Low Latency)</option>
                      <option>Focusrite USB ASIO</option>
                      <option>Windows Audio Session API (WASAPI)</option>
                      <option>DirectSound</option>
                   </select>
                </div>
                
                <div className="space-y-2">
                   <label className="text-[10px] uppercase font-bold text-[#8b949e]">Sample Rate & Buffer</label>
                   <div className="grid grid-cols-2 gap-2">
                      <select className="w-full bg-[#0d1117] border border-[#30363d] rounded text-white p-2 text-[11px] outline-none">
                         <option>44100 Hz</option>
                         <option selected>48000 Hz</option>
                         <option>96000 Hz</option>
                      </select>
                      <select className="w-full bg-[#0d1117] border border-[#30363d] rounded text-white p-2 text-[11px] outline-none">
                         <option>128 Samples</option>
                         <option selected>256 Samples</option>
                         <option>512 Samples</option>
                         <option>1024 Samples</option>
                      </select>
                   </div>
                   <div className="text-[10px] text-[#58a6ff] text-right font-mono">Estimated Latency: 5.3ms</div>
                </div>

                <div className="space-y-2 pt-4 border-t border-[#30363d]">
                   <label className="text-[10px] uppercase font-bold text-[#e3b341]">Spatial & Binaural Rendering</label>
                   <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 text-[11px] space-y-2 font-mono">
                      <label className="flex items-center gap-2 text-white"><input type="checkbox" defaultChecked className="accent-[#e3b341]"/> 3D HRTF Processing</label>
                      <label className="flex items-center gap-2 text-[#8b949e]"><input type="checkbox" className="accent-[#e3b341]"/> Output as Sony 360 Reality</label>
                      <label className="flex items-center gap-2 text-[#8b949e]"><input type="checkbox" className="accent-[#e3b341]"/> Object-Based Audio (Atmos)</label>
                   </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-[#30363d]">
                   <label className="text-[10px] uppercase font-bold text-[#8b949e]">Current Plugin CPU Load</label>
                   <div className="bg-[#0d1117] border border-[#30363d] rounded p-3">
                       <div className="flex justify-between items-center text-[10px] mb-1">
                          <span className="text-white">DSP Processing Load</span>
                          <span className="text-[#f85149] font-bold">14.2%</span>
                       </div>
                       <div className="w-full h-2 bg-black rounded-full overflow-hidden">
                          <div className="w-[14%] h-full bg-gradient-to-r from-green-500 to-red-500"></div>
                       </div>
                   </div>
                </div>

             </div>
         </div>
      </div>
    </div>
  );
}
