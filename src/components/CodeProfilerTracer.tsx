import React, { useState } from 'react';
import { Microchip, Play, Pause, Square, BarChart2, Activity, Clock, Cpu, Server, AlignLeft, Hexagon, Filter, Search, Zap, Crosshair, ChevronRight, Hash, X} from 'lucide-react';

export default function CodeProfilerTracer() {
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState<'flamegraph' | 'calltree' | 'memory'>('flamegraph');

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-[#c9d1d9] font-sans overflow-hidden">
      
      {/* Top Protocol Bar: C++/C# Profiling Engine */}
      <div className="px-4 py-2 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-[#58a6ff] to-[#3fb950] border border-[#58a6ff]/50 rounded flex items-center justify-center shadow-[0_0_15px_rgba(88,166,255,0.2)]">
            <Microchip size={18} className="text-black" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-widest uppercase text-white flex items-center gap-2">
              Deep Code Profiler & Tracer <span className="px-1.5 py-0.5 bg-[#f85149] text-white text-[9px] rounded">C++ / C#</span>
            </h2>
            <p className="text-[#8b949e] text-[9px] font-mono">KERNEL CALLS • MEMORY LEAKS • CACHE MISSES • THREAD CONTENTION</p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-4">
           <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded h-8 overflow-hidden">
             <button 
               onClick={() => setIsRecording(true)}
               className={`px-3 h-full flex items-center gap-2 text-[11px] font-bold border-r border-[#30363d] transition-colors ${isRecording ? 'bg-[#f85149] text-white cursor-not-allowed' : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'}`}>
               <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-white animate-pulse' : 'bg-red-500'}`}></span> REC
             </button>
             <button 
                onClick={() => setIsRecording(false)}
                className="px-3 h-full flex items-center gap-1 text-[#8b949e] hover:text-white hover:bg-[#21262d] text-[11px] font-bold border-r border-[#30363d]"><Square size={12}/> Stop</button>
             <button className="px-3 h-full flex items-center gap-1 text-[#8b949e] hover:text-white hover:bg-[#21262d] text-[11px] font-bold"><Crosshair size={12}/> Attach Process</button>
           </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side Settings */}
        <div className="w-[260px] bg-[#0d1117] border-r border-[#30363d] flex flex-col shrink-0">
           
           <div className="p-3 border-b border-[#30363d] bg-[#161b22]">
              <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest flex items-center gap-1"><Filter size={12}/> Target Filters</span>
           </div>

           <div className="flex-1 p-3 space-y-4 overflow-y-auto">
              <div className="space-y-2">
                 <label className="text-[10px] text-[#8b949e] font-bold uppercase">Thread Masking</label>
                 <div className="bg-[#161b22] border border-[#30363d] rounded p-2 text-[11px] space-y-1 font-mono">
                    <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#58a6ff]"/> [Main] Render Thread 0</label>
                    <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#58a6ff]"/> [Worker] Physics Pool 1-4</label>
                    <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#58a6ff]"/> [Worker] Audio DSP 5</label>
                    <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#58a6ff]"/> [Sys] IO/Asset Streaming 6</label>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] text-[#8b949e] font-bold uppercase">Sampling Rate</label>
                 <select defaultValue="5 ms (Standard)" className="w-full bg-[#161b22] border border-[#30363d] text-[#c9d1d9] rounded px-2 py-1 text-[11px] outline-none font-mono">
                    <option>1 ms (High Overhead)</option>
                    <option>5 ms (Standard)</option>
                    <option>20 ms (Low Overhead)</option>
                    <option>Instruction Pointer Hook (Intrusive)</option>
                 </select>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] text-[#8b949e] font-bold uppercase">Module Symbols (PDBs)</label>
                 <div className="bg-[#161b22] border border-[#30363d] rounded p-2 text-[11px] space-y-1 font-mono">
                    <div className="flex justify-between text-[#3fb950]"><span>GameEngine.dll</span><span>Loaded</span></div>
                    <div className="flex justify-between text-[#3fb950]"><span>VPhysics.dll</span><span>Loaded</span></div>
                    <div className="flex justify-between text-[#8b949e]"><span>kernel32.dll</span><span>Deferred</span></div>
                 </div>
                 <button className="w-full mt-2 bg-[#21262d] border border-[#30363d] text-[#c9d1d9] rounded py-1 text-[10px] hover:bg-[#30363d] transition">Load Missing Symbols</button>
              </div>
           </div>

           {/* Metrics Mini-Dashboard */}
           <div className="p-3 border-t border-[#30363d] bg-[#161b22] space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                 <span className="text-[#8b949e]">Trace Duration</span>
                 <span className="font-mono text-white">00:04:12.450</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                 <span className="text-[#8b949e]">Total Samples</span>
                 <span className="font-mono text-[#58a6ff]">8,491,023</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                 <span className="text-[#8b949e]">Dropped</span>
                 <span className="font-mono text-[#f85149]">0.02%</span>
              </div>
           </div>

        </div>

        {/* Center Panel - The Data */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117] relative">
           
           {/* Tab Bar */}
           <div className="h-10 border-b border-[#30363d] flex bg-[#161b22] shrink-0">
              <button onClick={() => setActiveTab('flamegraph')} className={`px-6 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'flamegraph' ? 'text-[#f85149] border-b-2 border-[#f85149]' : 'text-[#8b949e] hover:text-[#c9d1d9]'} transition`}><Activity size={14}/> Flame Graph (CPU)</button>
              <button onClick={() => setActiveTab('calltree')} className={`px-6 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'calltree' ? 'text-[#58a6ff] border-b-2 border-[#58a6ff]' : 'text-[#8b949e] hover:text-[#c9d1d9]'} transition`}><AlignLeft size={14}/> Call Tree (Bottom-Up)</button>
              <button onClick={() => setActiveTab('memory')} className={`px-6 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'memory' ? 'text-[#e3b341] border-b-2 border-[#e3b341]' : 'text-[#8b949e] hover:text-[#c9d1d9]'} transition`}><Hexagon size={14}/> Heap Memory Allocations</button>
           </div>

           {/* View Area */}
           <div className="flex-1 overflow-hidden flex flex-col p-4">
              
              {activeTab === 'flamegraph' && (
                 <div className="flex-1 flex flex-col bg-[#0a0a0c] border border-[#30363d] rounded-lg relative overflow-hidden">
                    <div className="p-3 border-b border-[#30363d] bg-[#161b22] flex justify-between items-center">
                       <span className="text-[11px] font-mono text-[#8b949e]">Zoom: 14.2ms window (Main Thread 0)</span>
                       <div className="flex gap-2 text-[10px] text-[#8b949e]">
                         <span className="flex items-center gap-1"><div className="w-2 h-2 bg-[#f85149]"></div> Kernel</span>
                         <span className="flex items-center gap-1"><div className="w-2 h-2 bg-[#58a6ff]"></div> Game Logic</span>
                         <span className="flex items-center gap-1"><div className="w-2 h-2 bg-[#e3b341]"></div> Render</span>
                       </div>
                    </div>
                    {/* Simulated Flame Graph */}
                    <div className="flex-1 relative overflow-auto p-4 custom-scrollbar">
                       <div className="w-[1200px] h-[300px] relative font-mono text-[9px] text-white">
                          
                          {/* Row 1 */}
                          <div className="absolute top-0 left-0 w-full h-6 bg-[#21262d] border border-[#30363d] rounded flex items-center px-2 cursor-pointer hover:brightness-125 transition">ntdll.dll!_RtlUserThreadStart</div>
                          {/* Row 2 */}
                          <div className="absolute top-[26px] left-[5%] w-[90%] h-6 bg-[#21262d] border border-[#30363d] rounded flex items-center px-2 cursor-pointer hover:brightness-125 transition">BaseThreadInitThunk</div>
                          {/* Row 3 */}
                          <div className="absolute top-[52px] left-[5%] w-[85%] h-6 bg-blue-900 border border-blue-700 bg-opacity-70 rounded flex items-center px-2 cursor-pointer hover:brightness-125 transition">Engine::MainLoop() [4.2ms]</div>
                          
                          {/* Row 4 Branches */}
                          <div className="absolute top-[78px] left-[5%] w-[20%] h-6 bg-yellow-900 border border-yellow-700 bg-opacity-70 rounded flex items-center px-2 cursor-pointer hover:brightness-125 transition">PumpMessages() [0.8ms]</div>
                          <div className="absolute top-[78px] left-[26%] w-[35%] h-6 bg-blue-800 border border-blue-600 bg-opacity-70 rounded flex items-center px-2 cursor-pointer hover:brightness-125 transition">World::Tick() [1.8ms]</div>
                          <div className="absolute top-[78px] left-[62%] w-[28%] h-6 bg-purple-900 border border-purple-700 bg-opacity-70 rounded flex items-center px-2 cursor-pointer hover:brightness-125 transition">Renderer::Present() [1.6ms]</div>

                          {/* Row 5 Deep Dive into World::Tick */}
                          <div className="absolute top-[104px] left-[26%] w-[20%] h-6 bg-blue-700 border border-blue-500 rounded flex items-center px-2 cursor-pointer hover:brightness-125 transition">Physics::Simulate() [1.1ms]</div>
                          <div className="absolute top-[104px] left-[47%] w-[14%] h-6 bg-green-900 border border-green-700 bg-opacity-70 rounded flex items-center px-2 cursor-pointer hover:brightness-125 transition">AI::UpdateNavMesh() [0.7ms]</div>

                          {/* Row 6 Deep Dive into Physics */}
                          <div className="absolute top-[130px] left-[26%] w-[8%] h-6 bg-red-900 border border-red-700 bg-opacity-70 rounded flex items-center px-2 cursor-pointer hover:brightness-125 transition">Broadphase()</div>
                          <div className="absolute top-[130px] left-[34%] w-[12%] h-6 bg-red-800 border border-red-600 bg-opacity-80 rounded flex items-center px-2 cursor-pointer hover:brightness-125 transition font-bold drop-shadow-[0_0_2px_#ff0000]">Narrowphase_Solve() [0.8ms]</div>

                       </div>
                    </div>
                 </div>
              )}

              {activeTab === 'calltree' && (
                 <div className="flex-1 flex flex-col bg-[#0a0a0c] border border-[#30363d] rounded-lg relative overflow-hidden">
                    <div className="p-3 border-b border-[#30363d] bg-[#161b22] flex justify-between items-center">
                       <span className="text-[11px] font-bold text-[#8b949e]">Top Hotpaths (Inclusive Time)</span>
                       <div className="flex gap-2">
                           <input type="text" placeholder="Search Function..." className="bg-[#0d1117] border border-[#30363d] text-white text-[10px] px-2 py-1 outline-none rounded font-mono w-48"/>
                       </div>
                    </div>
                    <div className="flex-1 overflow-y-auto w-full">
                       <table className="w-full text-left border-collapse text-[11px] font-mono whitespace-nowrap">
                          <thead>
                             <tr className="bg-[#161b22] border-b border-[#30363d] text-[#8b949e]">
                                <th className="p-2 font-normal w-[40px]"></th>
                                <th className="p-2 font-normal w-[400px]">Function Profile</th>
                                <th className="p-2 font-normal text-right">Self Time</th>
                                <th className="p-2 font-normal text-right">Total Time</th>
                                <th className="p-2 font-normal text-right">Calls</th>
                                <th className="p-2 font-normal">Module</th>
                             </tr>
                          </thead>
                          <tbody className="text-[#c9d1d9]">
                             {/* Hot path 1 */}
                             <tr className="bg-[#f85149]/10 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] transition">
                                <td className="p-2 text-center text-red-400"><ChevronRight size={14}/></td>
                                <td className="p-2 font-bold text-red-400">Physics::Narrowphase_Solve(CollisionData*)</td>
                                <td className="p-2 text-right">845.2 ms</td>
                                <td className="p-2 text-right">910.4 ms</td>
                                <td className="p-2 text-right">142,050</td>
                                <td className="p-2 text-[#8b949e]">VPhysics.dll</td>
                             </tr>
                             <tr className="bg-[#0d1117] border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] transition opacity-70">
                                <td className="p-2 text-center"></td>
                                <td className="p-2 pl-8">↳ Math::Vector4_DotProduct_SIMD</td>
                                <td className="p-2 text-right">40.1 ms</td>
                                <td className="p-2 text-right">40.1 ms</td>
                                <td className="p-2 text-right">852,112</td>
                                <td className="p-2 text-[#8b949e]">CoreMath.dll</td>
                             </tr>
                             {/* Hot path 2 */}
                             <tr className="border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] transition">
                                <td className="p-2 text-center"><ChevronRight size={14}/></td>
                                <td className="p-2 text-[#58a6ff]">Renderer::BuildCommandLists(ViewContext*)</td>
                                <td className="p-2 text-right">120.5 ms</td>
                                <td className="p-2 text-right">640.8 ms</td>
                                <td className="p-2 text-right">3,600</td>
                                <td className="p-2 text-[#8b949e]">GameEngine.dll</td>
                             </tr>
                             {/* Hot path 3 */}
                             <tr className="border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] transition">
                                <td className="p-2 text-center"><ChevronRight size={14}/></td>
                                <td className="p-2">std::vector&lt;Entity*&gt;::_Reallocate(...)</td>
                                <td className="p-2 text-right">88.2 ms</td>
                                <td className="p-2 text-right">92.0 ms</td>
                                <td className="p-2 text-right">4,201</td>
                                <td className="p-2 text-[#8b949e]">MSVCP140.dll</td>
                             </tr>
                          </tbody>
                       </table>
                    </div>
                 </div>
              )}

           </div>

        </div>

        {/* Right Inspector Panel */}
        <div className="w-[300px] border-l border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
           <div className="p-3 border-b border-[#30363d]">
              <h3 className="text-[12px] font-black uppercase text-[#e3b341]">Selection Inspector</h3>
              <p className="text-[10px] text-[#8b949e] font-mono mt-1">Select a frame to inspect context.</p>
           </div>
           
           <div className="p-4 space-y-4 font-mono text-[11px] overflow-y-auto flex-1 text-[#c9d1d9] custom-scrollbar">
              <div className="bg-[#0d1117] border border-[#30363d] p-3 rounded">
                  <div className="font-bold text-red-400 mb-2 border-b border-[#30363d] pb-2">Physics::Narrowphase_Solve</div>
                  <div className="flex justify-between mb-1"><span>CPU Usage</span><span className="text-white">12.4%</span></div>
                  <div className="flex justify-between mb-1"><span>L1 Cache Miss</span><span className="text-yellow-400">High (18%)</span></div>
                  <div className="flex justify-between mb-1"><span>Branch Mispred</span><span className="text-white">4.2%</span></div>
                  <div className="flex justify-between mb-1"><span>Instructions</span><span className="text-white">84.2M</span></div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] text-[#8b949e] font-bold uppercase">Source Code Context</label>
                 <div className="bg-[#0d1117] border border-[#30363d] p-2 rounded text-[10px] text-gray-400 overflow-x-auto whitespace-pre">
                   <div className="text-[#888]">// PhysicsSolver.cpp : 421</div>
                   <div>{"void Narrowphase_Solve(CollisionData* data) {"}</div>
                   <div>{"  for(int i=0; i<data->count; ++i) {"}</div>
                   <div className="bg-red-500/20 text-red-200">{"    Vector4 n = CalculateNormal(data[i]);"}</div>
                   <div>{"    // ..."}</div>
                   <div>{"  }"}</div>
                   <div>{"}"}</div>
                 </div>
              </div>

              <button className="w-full bg-[#21262d] border border-[#30363d] text-white py-1.5 rounded font-bold hover:bg-[#30363d] transition uppercase tracking-widest flex items-center justify-center gap-1 text-[10px]">
                 <Zap size={12} className="text-[#e3b341]"/> Suggest Fix (Compiler AI)
              </button>

           </div>
        </div>

      </div>
    </div>
  );
}
