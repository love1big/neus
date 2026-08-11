import React from 'react';
import { Activity, Plus, Play, Anchor, Move, Minimize, GitCommit} from 'lucide-react';

export default function AdvancedAnimationBlender() {
  return (
    <div className="flex w-full h-full bg-[#0a0a0f] text-gray-200 font-sans">
      <div className="flex-1 flex flex-col relative">
        <div className="h-12 border-b border-[#2a2b3d] bg-[#141525] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
             <Activity size={16} className="text-orange-400"/>
             <span className="font-bold text-sm">AnimGraph: Player_Locomotion</span>
          </div>
          <div className="flex gap-2">
             <button className="px-3 py-1.5 bg-[#2a2b3d] hover:bg-[#30363d] text-xs font-medium rounded flex items-center gap-2 border border-[#30363d]"><Play size={12}/> Simulate</button>
          </div>
        </div>

        {/* Node Graph Area */}
        <div className="flex-1 bg-[#0d1117] relative overflow-hidden" style={{
            backgroundImage: 'radial-gradient(#2a2b3d 1px, transparent 1px)',
            backgroundSize: '24px 24px'
        }}>
           {/* SVG Connections */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M 250 200 C 350 200, 350 300, 450 300" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M 650 300 C 700 300, 700 300, 750 300" fill="none" stroke="white" strokeWidth="3" />
           </svg>

           {/* Input Variables Node */}
           <div className="absolute top-[100px] left-[50px] w-48 bg-[#141525] border border-[#2a2b3d] rounded-lg shadow-xl">
              <div className="bg-[#1a1b26] border-b border-[#2a2b3d] px-3 py-2 text-xs font-bold flex items-center justify-between rounded-t-lg">
                 Parameters
                 <Plus size={14} className="text-gray-400"/>
              </div>
              <div className="p-2 flex flex-col gap-2">
                 <div className="flex items-center justify-between text-xs bg-[#0a0a0f] p-1.5 rounded border border-[#2a2b3d]">
                    <span className="text-gray-400">Speed (Float)</span>
                    <div className="w-2 h-2 rounded-full bg-green-400 relative">
                       <div className="absolute top-1/2 left-full w-4 h-px bg-green-400"></div>
                    </div>
                 </div>
                 <div className="flex items-center justify-between text-xs bg-[#0a0a0f] p-1.5 rounded border border-[#2a2b3d]">
                    <span className="text-gray-400">isGrounded (Bool)</span>
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                 </div>
              </div>
           </div>

           {/* Blend Space Node */}
           <div className="absolute top-[250px] left-[450px] w-56 bg-[#141525] border border-orange-500/50 rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              <div className="bg-gradient-to-r from-orange-900/40 to-transparent border-b border-[#2a2b3d] px-3 py-2 text-xs font-bold flex items-center gap-2 rounded-t-lg">
                 <Minimize size={14} className="text-orange-400"/> 1D Blend Space
              </div>
              <div className="p-3">
                 <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400"></div> Value</div>
                 </div>
                 {/* Mini Blend visualization */}
                 <div className="h-8 bg-[#0a0a0f] border border-[#2a2b3d] rounded relative mt-2 flex items-center px-2">
                    <div className="w-full h-px bg-gray-600 relative">
                       <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-gray-400 -translate-y-1/2 -ml-1"></div>
                       <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-gray-400 -translate-y-1/2 -ml-1"></div>
                       <div className="absolute top-1/2 left-full w-2 h-2 rounded-full bg-gray-400 -translate-y-1/2 -ml-1"></div>
                       {/* Current value indicator */}
                       <div className="absolute top-1/2 left-1/4 w-3 h-3 rounded-full border-2 border-orange-500 bg-[#141525] -translate-y-1/2 -ml-1.5 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                    </div>
                 </div>
                 <div className="flex justify-between text-[9px] text-gray-500 mt-1 uppercase">
                    <span>Idle</span>
                    <span>Walk</span>
                    <span>Run</span>
                 </div>
                 
                 <div className="flex items-center justify-end mt-4">
                    <div className="flex items-center gap-2 text-xs text-white">Pose <div className="w-3 h-3 rounded-full border-2 border-white flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div></div>
                 </div>
              </div>
           </div>

           {/* Output Node */}
           <div className="absolute top-[260px] left-[750px] w-40 bg-[#141525] border border-white/20 rounded-lg shadow-xl ring-1 ring-white/10">
              <div className="bg-white/10 border-b border-[#2a2b3d] px-3 py-2 text-xs font-bold flex items-center gap-2 rounded-t-lg text-white">
                 <Anchor size={14} /> Final Pose
              </div>
              <div className="p-3 flex flex-col gap-2">
                 <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-3 h-3 rounded-full border-2 border-gray-500 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div></div> Input Pose
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="w-80 border-l border-[#2a2b3d] bg-[#141525] flex flex-col shrink-0">
         <div className="h-48 border-b border-[#2a2b3d] bg-black relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#141525] to-transparent z-10 pointer-events-none"></div>
            {/* Mock 3D Character Preview */}
            <div className="w-20 h-40 border-2 border-gray-600 rounded-full opacity-30"></div>
            <div className="absolute bottom-2 left-2 z-20 text-[10px] font-mono text-gray-400 bg-black/50 p-1 rounded backdrop-blur border border-[#2a2b3d]">
               Playing: Idle_to_Walk_Blend<br/>Speed: 2.4m/s
            </div>
         </div>
         <div className="p-3 border-b border-[#2a2b3d] bg-[#1a1b26] font-semibold text-sm text-gray-200">
            Node Settings
         </div>
         <div className="p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
               <label className="text-xs font-bold text-gray-400 uppercase">Interpolation Time</label>
               <input type="number" className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 text-xs text-white" defaultValue="0.2" />
            </div>
            <div className="flex flex-col gap-2">
               <label className="text-xs font-bold text-gray-400 uppercase">Axis Scale</label>
               <select className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 text-xs text-white">
                  <option>Linear</option>
                  <option>Cubic</option>
               </select>
            </div>
         </div>
      </div>
    </div>
  );
}
