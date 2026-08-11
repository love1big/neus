import React from 'react';
import { Bug, Activity, Cpu, Server, AlertTriangle, AlertCircle, Play, Pause, RefreshCw, BarChart2} from 'lucide-react';

export default function AdvancedDebuggingTools() {
  return (
    <div className="flex flex-col w-full h-full bg-[#0a0a0f] text-gray-200 font-sans">
      <div className="h-14 border-b border-[#2a2b3d] bg-[#141525] flex items-center justify-between px-4 shrink-0">
         <div className="flex items-center gap-3">
            <Bug size={18} className="text-red-500" />
            <span className="font-bold text-sm">Advanced Performance Profiler</span>
            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30 uppercase tracking-widest ml-2 animate-pulse">Live Recording</span>
         </div>
         <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-[#2a2b3d] hover:bg-[#30363d] rounded text-xs font-medium border border-[#30363d] flex items-center gap-2"><RefreshCw size={12}/> Clear Data</button>
            <button className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded text-xs font-medium flex items-center gap-2 text-white"><Pause size={12}/> Stop Capture</button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Main Profiler View */}
         <div className="flex-1 flex flex-col bg-[#0d1117] overflow-y-auto">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-4 gap-4 p-4 border-b border-[#2a2b3d]">
               <div className="bg-[#141525] border border-[#2a2b3d] p-3 rounded-lg flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold"><Activity size={14} className="text-green-400"/> Frame Rate</div>
                  <div className="text-2xl font-mono text-white">59.8 <span className="text-sm text-gray-500">FPS</span></div>
                  <div className="text-[10px] text-green-400">16.7ms per frame</div>
               </div>
               <div className="bg-[#141525] border border-[#2a2b3d] p-3 rounded-lg flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold"><Cpu size={14} className="text-blue-400"/> CPU Time</div>
                  <div className="text-2xl font-mono text-white">8.4 <span className="text-sm text-gray-500">ms</span></div>
                  <div className="text-[10px] text-gray-500">Main Thread: 5.2ms</div>
               </div>
               <div className="bg-[#141525] border border-[#2a2b3d] p-3 rounded-lg flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold"><Server size={14} className="text-purple-400"/> Memory Heap</div>
                  <div className="text-2xl font-mono text-white">412 <span className="text-sm text-gray-500">MB</span></div>
                  <div className="w-full h-1 bg-[#0a0a0f] rounded mt-1 overflow-hidden"><div className="w-[40%] h-full bg-purple-500"></div></div>
               </div>
               <div className="bg-[#141525] border border-[#2a2b3d] p-3 rounded-lg flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold"><BarChart2 size={14} className="text-yellow-400"/> Draw Calls</div>
                  <div className="text-2xl font-mono text-white">1,240</div>
                  <div className="text-[10px] text-yellow-400 flex items-center gap-1"><AlertTriangle size={10}/> High vertex count</div>
               </div>
            </div>

            {/* Flame Graph Mock */}
            <div className="p-4 flex flex-col gap-2">
               <h3 className="text-sm font-bold text-gray-300">CPU Frame Breakdown (Flame Graph)</h3>
               <div className="h-48 bg-[#141525] border border-[#2a2b3d] rounded-lg p-2 overflow-hidden flex flex-col gap-1">
                  <div className="h-6 w-full bg-blue-500/80 rounded hover:bg-blue-400 flex items-center px-2 text-[10px] font-mono text-white truncate border border-blue-400/50">EngineLoop::Tick() [16.7ms]</div>
                  <div className="flex gap-1">
                     <div className="h-6 w-[30%] bg-purple-500/80 rounded hover:bg-purple-400 flex items-center px-2 text-[10px] font-mono text-white truncate border border-purple-400/50">Physics::Simulate [4.1ms]</div>
                     <div className="h-6 w-[45%] bg-green-500/80 rounded hover:bg-green-400 flex items-center px-2 text-[10px] font-mono text-white truncate border border-green-400/50">Render::DrawScene [8.2ms]</div>
                     <div className="h-6 w-[25%] bg-orange-500/80 rounded hover:bg-orange-400 flex items-center px-2 text-[10px] font-mono text-white truncate border border-orange-400/50">Scripts::Update [3.0ms]</div>
                  </div>
                  <div className="flex gap-1 ml-[30%]">
                     <div className="h-6 w-[20%] bg-green-600/80 rounded hover:bg-green-500 flex items-center px-2 text-[10px] font-mono text-white truncate border border-green-500/50">Shadows [3.1ms]</div>
                     <div className="h-6 w-[15%] bg-green-600/80 rounded hover:bg-green-500 flex items-center px-2 text-[10px] font-mono text-white truncate border border-green-500/50">Opaque [2.5ms]</div>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Sidebar Logs */}
         <div className="w-80 border-l border-[#2a2b3d] bg-[#141525] flex flex-col shrink-0">
            <div className="h-10 border-b border-[#2a2b3d] bg-[#1a1b26] flex items-center px-4 font-semibold text-sm text-gray-200">
               Live Warnings
            </div>
            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
               <div className="bg-yellow-900/20 border border-yellow-500/30 p-2 rounded flex items-start gap-2 text-xs">
                  <AlertTriangle size={14} className="text-yellow-500 shrink-0 mt-0.5"/>
                  <div className="flex flex-col">
                     <span className="text-yellow-200 font-bold">Texture Memory High</span>
                     <span className="text-gray-400 mt-1">Pool size exceeding 80%. Consider lowering texture resolution for 'Environment_Atlas'.</span>
                  </div>
               </div>
               <div className="bg-red-900/20 border border-red-500/30 p-2 rounded flex items-start gap-2 text-xs">
                  <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5"/>
                  <div className="flex flex-col">
                     <span className="text-red-200 font-bold">Null Reference Exception</span>
                     <span className="text-gray-400 mt-1">PlayerController.ts:142 - Target object destroyed before script execution.</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
