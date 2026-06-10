import React from 'react';
import { Gauge, Settings2, Sliders, Activity, Wrench, ArrowRightLeft, Database, RefreshCw, BarChart2, Play } from 'lucide-react';

export default function VehicleDynamicsTuner() {
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#d4d4d4] font-sans">
      <div className="h-12 bg-[#252526] border-b border-[#333] shadow-md flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-gradient-to-br from-[#0284c7] to-[#eab308] flex items-center justify-center text-white shadow-inner">
                <Gauge size={18}/>
             </div>
             <div>
                <h2 className="font-bold text-[12px] uppercase tracking-widest text-white">Vehicle Dynamics & Tire Tuner</h2>
                <p className="text-[9px] text-[#888] font-mono">PACEJKA MAGIC FORMULA • SUSPENSION KINEMATICS • ENGINE CURVES</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <select className="bg-[#111] border border-[#333] text-[10px] px-2 py-1 rounded outline-none w-48 text-[#eab308] font-bold">
                <option>Preset: GT3_RaceCar_RWD</option>
                <option>Preset: Rally_AWD_Dirt</option>
                <option>Preset: Casual_Arcade_Drift</option>
             </select>
             <button className="bg-[#0284c7] hover:bg-[#0369a1] text-white px-4 py-1.5 rounded text-[10px] font-bold shadow-[0_0_15px_rgba(2,132,199,0.4)] flex items-center gap-2"><Play size={14} fill="currentColor"/> Telemetry Live</button>
          </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Center Data View */}
         <div className="flex-1 bg-[#111] overflow-y-auto p-4 flex flex-col gap-4 relative custom-scrollbar">
            
            {/* Grid of charts */}
            <div className="grid grid-cols-2 gap-4">
               {/* Engine Curve */}
               <div className="bg-[#1e1e1e] border border-[#333] rounded p-3 flex flex-col h-64">
                   <h3 className="text-[11px] font-bold text-[#888] uppercase mb-2 flex justify-between">
                      <span>Engine Torque / Power Curve</span>
                      <span className="text-[#a3e635]">Dyno Sim</span>
                   </h3>
                   <div className="flex-1 relative bg-[#111] border border-[#222] rounded overflow-hidden">
                      {/* Fake Chart Lines */}
                      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-80">
                         {/* Power */}
                         <path d="M 0 100 Q 20 80, 50 30 T 90 10" fill="none" stroke="#eab308" strokeWidth="2" />
                         {/* Torque */}
                         <path d="M 0 80 Q 20 60, 40 40 T 90 60" fill="none" stroke="#0284c7" strokeWidth="2" />
                      </svg>
                      {/* Grid */}
                      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '10% 10%' }}></div>
                      {/* Labels */}
                      <div className="absolute bottom-1 left-2 text-[9px] text-[#666] font-mono">1000 RPM</div>
                      <div className="absolute bottom-1 right-2 text-[9px] text-[#666] font-mono">8000 RPM</div>
                   </div>
               </div>

               {/* Tire Friction Curve */}
               <div className="bg-[#1e1e1e] border border-[#333] rounded p-3 flex flex-col h-64">
                   <h3 className="text-[11px] font-bold text-[#888] uppercase mb-2 flex justify-between">
                      <span>Pacejka Longitudinal Grip (Slip Ratio)</span>
                      <span className="text-[#ef4444]">Tire Model</span>
                   </h3>
                   <div className="flex-1 relative bg-[#111] border border-[#222] rounded overflow-hidden">
                      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-80">
                         <path d="M 10 90 Q 20 85, 30 20 Q 50 30, 90 40" fill="none" stroke="#ef4444" strokeWidth="2" />
                      </svg>
                      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '10% 10%' }}></div>
                      
                      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-red-500/50"></div>
                      <div className="absolute inset-y-0 left-[10%] w-[1px] bg-red-500/50"></div>
                   </div>
               </div>
            </div>

            {/* Aerodynamics & Weight Distribution */}
            <div className="bg-[#1e1e1e] border border-[#333] rounded p-4">
                <div className="flex items-center justify-between">
                   <div className="w-[300px] h-[150px] relative border border-[#333] rounded bg-black/40 flex items-center justify-center">
                       {/* Car Silhouette Wireframe */}
                       <div className="w-[200px] h-[60px] border-2 border-[#0284c7] rounded-[50%_40%_10%_20%] relative shadow-[0_0_15px_rgba(2,132,199,0.3)]">
                           {/* CG Dot */}
                           <div className="absolute top-1/2 left-[45%] w-3 h-3 bg-[#eab308] rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-[0_0_10px_#eab308]"></div>
                           <div className="absolute -bottom-6 left-[15%] w-8 h-8 rounded-full border-2 border-[#ef4444]"></div>
                           <div className="absolute -bottom-6 right-[15%] w-8 h-8 rounded-full border-2 border-[#ef4444]"></div>
                       </div>
                   </div>
                   
                   <div className="flex-1 px-8 space-y-4">
                       <div>
                          <div className="flex justify-between text-[11px] text-[#888] font-bold uppercase mb-1">
                             <span>CG Height (Z-Axis)</span>
                             <span className="font-mono text-white">0.35m</span>
                          </div>
                          <input type="range" className="w-full accent-[#0284c7]" />
                       </div>
                       <div>
                          <div className="flex justify-between text-[11px] text-[#888] font-bold uppercase mb-1">
                             <span>Weight Bias (Front / Rear)</span>
                             <span className="font-mono text-white">45F / 55R</span>
                          </div>
                          <input type="range" className="w-full accent-[#0284c7]" defaultValue="55" />
                       </div>
                       <div>
                          <div className="flex justify-between text-[11px] text-[#888] font-bold uppercase mb-1">
                             <span>Aero Drag Coeff (Cd)</span>
                             <span className="font-mono text-white">0.32</span>
                          </div>
                          <input type="range" className="w-full accent-[#0284c7]" />
                       </div>
                   </div>
                </div>
            </div>
         </div>

         {/* Right Details Panel */}
         <div className="w-[320px] bg-[#252526] border-l border-[#333] flex flex-col shrink-0 shadow-xl z-10">
             
             <div className="border-b border-[#333] flex">
                 <button className="flex-1 py-3 text-[11px] font-bold uppercase tracking-widest text-[#eab308] border-b-2 border-[#eab308] bg-[#1e1e1e]">Suspension</button>
                 <button className="flex-1 py-3 text-[11px] font-bold uppercase tracking-widest text-[#888] hover:text-white bg-[#252526]">Drivetrain</button>
                 <button className="flex-1 py-3 text-[11px] font-bold uppercase tracking-widest text-[#888] hover:text-white bg-[#252526]">Brakes</button>
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar text-[11px]">
                 
                 <div className="space-y-3">
                    <h4 className="text-[10px] font-bold uppercase text-[#888] tracking-widest mb-2 border-b border-[#333] pb-1">Springs & Dampers (Front)</h4>
                    <div className="flex justify-between items-center">
                       <span className="text-[#ccc]">Spring Rate (N/m)</span>
                       <input type="number" defaultValue="85000" className="w-20 bg-[#111] border border-[#444] text-white p-1 rounded font-mono text-right" />
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[#ccc]">Bump Damping</span>
                       <input type="number" defaultValue="4500" className="w-20 bg-[#111] border border-[#444] text-white p-1 rounded font-mono text-right" />
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[#ccc]">Rebound Damping</span>
                       <input type="number" defaultValue="5200" className="w-20 bg-[#111] border border-[#444] text-white p-1 rounded font-mono text-right" />
                    </div>
                 </div>

                 <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-bold uppercase text-[#888] tracking-widest mb-2 border-b border-[#333] pb-1">Springs & Dampers (Rear)</h4>
                    <div className="flex justify-between items-center">
                       <span className="text-[#ccc]">Spring Rate (N/m)</span>
                       <input type="number" defaultValue="92000" className="w-20 bg-[#111] border border-[#444] text-white p-1 rounded font-mono text-right" />
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[#ccc]">Bump Damping</span>
                       <input type="number" defaultValue="4800" className="w-20 bg-[#111] border border-[#444] text-white p-1 rounded font-mono text-right" />
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[#ccc]">Rebound Damping</span>
                       <input type="number" defaultValue="5800" className="w-20 bg-[#111] border border-[#444] text-white p-1 rounded font-mono text-right" />
                    </div>
                 </div>

                 <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-bold uppercase text-[#888] tracking-widest mb-2 border-b border-[#333] pb-1">Anti-Roll Bars (ARB)</h4>
                    <div>
                       <div className="flex justify-between text-[10px] text-[#ccc] mb-1">
                          <span>Front Stiffness</span>
                          <span className="font-mono text-[#0284c7]">15000</span>
                       </div>
                       <input type="range" className="w-full accent-[#0284c7]" />
                    </div>
                    <div>
                       <div className="flex justify-between text-[10px] text-[#ccc] mb-1">
                          <span>Rear Stiffness</span>
                          <span className="font-mono text-[#0284c7]">12000</span>
                       </div>
                       <input type="range" className="w-full accent-[#0284c7]" />
                    </div>
                 </div>
                 
                 <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-bold uppercase text-[#888] tracking-widest mb-2 border-b border-[#333] pb-1">Kinematics Tuning</h4>
                    <div className="flex justify-between items-center">
                       <span className="text-[#ccc]">Camber Front (deg)</span>
                       <input type="number" defaultValue="-2.5" step="0.1" className="w-20 bg-[#111] border border-[#444] text-white p-1 rounded font-mono text-right" />
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[#ccc]">Camber Rear (deg)</span>
                       <input type="number" defaultValue="-1.5" step="0.1" className="w-20 bg-[#111] border border-[#444] text-white p-1 rounded font-mono text-right" />
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[#ccc]">Toe Front (deg)</span>
                       <input type="number" defaultValue="-0.1" step="0.1" className="w-20 bg-[#111] border border-[#444] text-white p-1 rounded font-mono text-right" />
                    </div>
                 </div>

             </div>
         </div>
      </div>
    </div>
  );
}
