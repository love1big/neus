import React, { useState } from 'react';
import { Activity, Crosshair, Settings2, Play, Bone, Target, AlertTriangle, Shield, MousePointer2, Save, Undo } from 'lucide-react';

export default function ActiveRagdollEuphoriaEngine() {
  const [selectedBone, setSelectedBone] = useState('Spine');
  const [simulationState, setSimulationState] = useState('Idle');
  
  const bones = ['Head', 'Neck', 'Spine', 'Pelvis', 'L_Arm', 'R_Arm', 'L_Leg', 'R_Leg'];
  
  const states = ['Idle (Balanced)', 'Stagger_Forward', 'Stagger_Backward', 'Fall_Impact', 'Recovering'];

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#30363d] bg-[#161b22]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#d29922]/20 border border-[#d29922]/50 rounded">
            <Activity className="text-[#d29922]" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide">Euphoria-Style Active Ragdoll Engine</h1>
            <p className="text-[10px] text-[#8b949e]">Procedural Kinematics & PID Balance Controller</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs flex items-center gap-2 hover:bg-[#30363d]">
            <Undo size={14} /> Reset Pose
          </button>
          <button className="px-3 py-1.5 bg-[#238636] border border-[#2ea043] rounded text-xs flex items-center gap-2 hover:bg-[#2c974b]">
            <Save size={14} /> Save Profile
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left: Skeleton Hierarchy */}
        <div className="w-64 border-r border-[#30363d] flex flex-col bg-[#161b22]">
          <div className="p-3 border-b border-[#30363d] text-xs font-bold text-[#8b949e] flex items-center gap-2">
            <Bone size={14} /> KINEMATIC CHAIN
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {bones.map(bone => (
              <button
                key={bone}
                onClick={() => setSelectedBone(bone)}
                className={`w-full text-left px-3 py-2 text-xs rounded mb-1 flex items-center gap-2 ${
                  selectedBone === bone ? 'bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/30' : 'text-[#c9d1d9] hover:bg-[#21262d]'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${selectedBone === bone ? 'bg-[#3fb950]' : 'bg-[#484f58]'}`}></div>
                {bone}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Viewport */}
        <div className="flex-1 flex flex-col relative bg-[#010409]">
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <button className="p-2 bg-[#161b22] border border-[#30363d] rounded text-[#8b949e] hover:text-white">
              <MousePointer2 size={16} />
            </button>
            <button className="p-2 bg-[#161b22] border border-[#30363d] rounded text-[#8b949e] hover:text-white">
              <Crosshair size={16} /> {/* Force application tool */}
            </button>
          </div>
          
          <div className="absolute top-4 right-4 bg-[#161b22]/80 backdrop-blur border border-[#30363d] p-3 rounded text-xs space-y-2 z-10">
            <div className="font-bold text-[#8b949e] mb-1">LIVE TELEMETRY</div>
            <div className="flex justify-between gap-6"><span>COM Offset:</span> <span className="text-[#3fb950]">0.12m</span></div>
            <div className="flex justify-between gap-6"><span>Balance State:</span> <span className="text-[#d29922]">Compensating</span></div>
            <div className="flex justify-between gap-6"><span>Avg Torque:</span> <span className="text-[#58a6ff]">45.2 Nm</span></div>
          </div>

          <div className="flex-1 flex items-center justify-center relative border-b border-[#30363d]">
            {/* Visualizer Placeholder */}
            <div className="w-full h-full absolute inset-0 opacity-20" 
                 style={{ backgroundImage: 'linear-gradient(#30363d 1px, transparent 1px), linear-gradient(90deg, #30363d 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-32 h-64 border-2 border-[#58a6ff] border-dashed rounded-lg flex flex-col items-center justify-center relative">
                 <div className="absolute top-[-20px] text-[#58a6ff] text-xs">Procedural Mesh Render</div>
                 <div className="w-4 h-4 bg-[#f85149] rounded-full absolute top-[30%] shadow-[0_0_15px_#f85149]"></div>
                 <div className="text-[10px] text-[#f85149] absolute top-[30%] left-[120%] whitespace-nowrap">Center of Mass (COM)</div>
                 
                 <div className="w-full h-1 bg-[#3fb950] absolute bottom-0 shadow-[0_0_15px_#3fb950]"></div>
                 <div className="text-[10px] text-[#3fb950] absolute bottom-[-20px] whitespace-nowrap">Support Polygon</div>
              </div>
            </div>
          </div>

          {/* Timeline / States */}
          <div className="h-48 bg-[#161b22] p-4 flex flex-col gap-3">
             <div className="text-xs font-bold text-[#8b949e] flex justify-between items-center">
                <div className="flex items-center gap-2"><Target size={14} /> BEHAVIORAL STATES (REACTION MATRIX)</div>
                <button className="text-[#3fb950] flex items-center gap-1 hover:underline"><Play size={12}/> Simulate Impulse</button>
             </div>
             <div className="flex gap-2">
                {states.map(state => (
                  <button 
                    key={state}
                    onClick={() => setSimulationState(state)}
                    className={`px-3 py-2 text-xs rounded border ${
                      simulationState === state ? 'bg-[#d29922]/20 border-[#d29922] text-[#d29922]' : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:border-[#8b949e]'
                    }`}
                  >
                    {state}
                  </button>
                ))}
             </div>
             
             {/* Timeline track */}
             <div className="mt-2 flex-1 bg-[#0d1117] border border-[#30363d] rounded relative flex items-center">
                <div className="h-full w-[30%] bg-gradient-to-r from-[#d29922]/20 to-transparent absolute left-0"></div>
                <div className="w-0.5 h-full bg-[#f85149] absolute left-[30%]"></div>
                <div className="w-full px-4 text-[10px] font-mono text-[#8b949e] flex justify-between">
                   <span>0.0s (Impact)</span>
                   <span>0.5s (Brace)</span>
                   <span>1.0s (Fall/Recover)</span>
                   <span>2.0s</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Inspector PID & Motors */}
        <div className="w-80 border-l border-[#30363d] flex flex-col bg-[#161b22] overflow-y-auto">
          <div className="p-3 border-b border-[#30363d] text-xs font-bold text-[#8b949e] flex items-center gap-2">
            <Settings2 size={14} /> MOTOR CONTROLLER ({selectedBone})
          </div>
          
          <div className="p-4 space-y-6">
            
            {/* Blend */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[#c9d1d9]">Anim vs Physics Blend</span>
                <span className="text-[#58a6ff] font-mono">65% Kinematic</span>
              </div>
              <input type="range" min="0" max="100" defaultValue="65" className="w-full accent-[#58a6ff]" />
              <div className="flex justify-between text-[10px] text-[#8b949e] mt-1">
                <span>Pure Physics (Ragdoll)</span>
                <span>Pure Animation</span>
              </div>
            </div>

            <hr className="border-[#30363d]" />

            {/* PID Controller */}
            <div>
               <h3 className="text-xs font-bold text-[#c9d1d9] mb-3 flex items-center gap-2">
                 <Shield size={14} className="text-[#3fb950]"/> PID Balance Controller
               </h3>
               
               <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 text-[#8b949e]">
                      <span>Proportional (Stiffness)</span><span>2500 N/m</span>
                    </div>
                    <input type="range" min="0" max="5000" defaultValue="2500" className="w-full accent-[#3fb950]" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 text-[#8b949e]">
                      <span>Derivative (Damping)</span><span>150 Ns/m</span>
                    </div>
                    <input type="range" min="0" max="500" defaultValue="150" className="w-full accent-[#3fb950]" />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1 text-[#8b949e]">
                      <span>Integral (Error Correction)</span><span>20</span>
                    </div>
                    <input type="range" min="0" max="100" defaultValue="20" className="w-full accent-[#3fb950]" />
                  </div>
               </div>
            </div>

            <hr className="border-[#30363d]" />

            {/* Euphoria Specifics */}
            <div>
               <h3 className="text-xs font-bold text-[#c9d1d9] mb-3 flex items-center gap-2">
                 <AlertTriangle size={14} className="text-[#f85149]"/> Self-Preservation Behaviors
               </h3>
               
               <div className="space-y-2">
                 <label className="flex items-center gap-2 text-xs text-[#8b949e]">
                   <input type="checkbox" defaultChecked className="accent-[#d29922] bg-[#0d1117]" />
                   Brace for Impact (Reach hands out)
                 </label>
                 <label className="flex items-center gap-2 text-xs text-[#8b949e]">
                   <input type="checkbox" defaultChecked className="accent-[#d29922] bg-[#0d1117]" />
                   Grab Wounded Area
                 </label>
                 <label className="flex items-center gap-2 text-xs text-[#8b949e]">
                   <input type="checkbox" defaultChecked className="accent-[#d29922] bg-[#0d1117]" />
                   Attempt to Maintain Footing
                 </label>
                 <label className="flex items-center gap-2 text-xs text-[#8b949e]">
                   <input type="checkbox" className="accent-[#d29922] bg-[#0d1117]" />
                   Fetal Position on Fall
                 </label>
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
