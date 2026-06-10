import React from 'react';
import { Activity, Video, Users, Link as LinkIcon, Download, RefreshCw, Layers, Database, Lock, Eye } from 'lucide-react';

export default function LiveLinkMoCapStudio() {
  return (
    <div className="flex flex-col h-full bg-[#1e1e2e] text-[#cdd6f4] font-sans">
      <div className="h-12 bg-[#181825] border-b border-[#313244] shadow-md flex items-center justify-between px-4 shrink-0 z-20">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#f38ba8] to-[#cba6f7] rounded flex items-center justify-center text-white shadow-[0_0_10px_rgba(243,139,168,0.5)]">
               <Activity size={18}/>
            </div>
            <div>
               <h2 className="font-black tracking-widest text-[12px] uppercase text-white">LiveLink MoCap Stream</h2>
               <p className="text-[9px] text-[#a6adc8] font-mono">TCP/UDP OPTICAL TRACKING DATA MANAGER</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-[#11111b] px-3 py-1.5 rounded-full border border-[#313244]">
                 <div className="w-2 h-2 rounded-full bg-[#a6e3a1] animate-pulse shadow-[0_0_5px_#a6e3a1]"></div>
                 <span className="text-[10px] font-bold text-[#a6e3a1]">STREAM ACTIVE</span>
             </div>
             <div className="text-[10px] font-mono bg-[#313244] px-2 py-1 rounded text-white">120 FPS</div>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         
         {/* Live Mocap Viewport */}
         <div className="flex-1 bg-[#11111b] relative overflow-hidden flex flex-col">
            <div className="flex-1 relative" style={{ backgroundImage: 'radial-gradient(#313244 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                {/* 3D Skeleton Visualization */}
                <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none">
                    <svg viewBox="0 0 200 400" className="w-[300px] h-auto drop-shadow-[0_0_15px_rgba(203,166,247,0.5)]" preserveAspectRatio="xMidYMid meet">
                        {/* Fake mocap skeleton lines */}
                        <g stroke="#cba6f7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
                           <line x1="100" y1="50" x2="100" y2="150" /> {/* Spine */}
                           <line x1="100" y1="80" x2="60" y2="120" /> {/* Left Arm */}
                           <line x1="60" y1="120" x2="40" y2="180" /> {/* Left Forearm */}
                           <line x1="100" y1="80" x2="140" y2="120" /> {/* Right Arm */}
                           <line x1="140" y1="120" x2="160" y2="160" /> {/* Right Forearm */}
                           <line x1="100" y1="150" x2="70" y2="250" /> {/* Left Upper Leg */}
                           <line x1="70" y1="250" x2="60" y2="350" /> {/* Left Lower Leg */}
                           <line x1="100" y1="150" x2="130" y2="250" /> {/* Right Upper Leg */}
                           <line x1="130" y1="250" x2="140" y2="350" /> {/* Right Lower Leg */}
                        </g>
                        {/* Joints */}
                        <g fill="#f38ba8">
                           <circle cx="100" cy="50" r="10" /> {/* Head */}
                           <circle cx="100" cy="80" r="5" /> {/* Neck / Shoulders */}
                           <circle cx="60" cy="120" r="4" /> {/* Elbow L */}
                           <circle cx="40" cy="180" r="3" /> {/* Hand L */}
                           <circle cx="140" cy="120" r="4" /> {/* Elbow R */}
                           <circle cx="160" cy="160" r="3" /> {/* Hand R */}
                           <circle cx="100" cy="150" r="6" /> {/* Pelvis */}
                           <circle cx="70" cy="250" r="5" /> {/* Knee L */}
                           <circle cx="60" cy="350" r="4" /> {/* Foot L */}
                           <circle cx="130" cy="250" r="5" /> {/* Knee R */}
                           <circle cx="140" cy="350" r="4" /> {/* Foot R */}
                        </g>
                    </svg>
                </div>

                <div className="absolute bottom-4 left-4 flex gap-2">
                   <div className="bg-[#181825] border border-[#313244] rounded p-2 text-[10px] font-mono text-[#a6adc8]">
                      Subject: ACTOR_A_01
                   </div>
                   <div className="bg-[#181825] border border-[#313244] rounded p-2 text-[10px] font-mono text-[#a6adc8]">
                      Solvers: ON
                   </div>
                </div>
            </div>
            
            {/* Realtime Data Graph */}
            <div className="h-48 border-t border-[#313244] bg-[#181825] flex flex-col">
               <div className="p-1 px-3 border-b border-[#313244] flex justify-between items-center text-[10px] text-[#a6adc8] font-bold uppercase tracking-widest bg-[#11111b]">
                  <div className="flex gap-4">
                     <span className="text-[#a6e3a1]">TCP: 192.168.1.100:5000</span>
                     <span className="text-[#89b4fa]">Ping: 2ms</span>
                  </div>
               </div>
               <div className="flex-1 relative overflow-hidden bg-[#11111b] p-2">
                  {/* Fake running graph */}
                  <div className="absolute inset-x-0 bottom-2 top-2 flex items-end gap-[2px] opacity-70">
                     {[...Array(150)].map((_, i) => (
                        <div key={i} className="w-1 bg-[#89b4fa]" style={{ height: `${20 + Math.random() * 60}%` }}></div>
                     ))}
                  </div>
                  {/* Overlay text */}
                  <div className="absolute top-2 left-2 text-[10px] font-mono text-[#f38ba8]">Z-Axis Vel: ~2.4 m/s</div>
               </div>
            </div>
         </div>

         {/* Source Panel */}
         <div className="w-80 border-l border-[#313244] bg-[#1e1e2e] flex flex-col shrink-0">
             <div className="p-3 border-b border-[#313244] bg-[#11111b] uppercase text-[11px] font-bold text-[#cba6f7] flex items-center gap-2 tracking-widest">
                <LinkIcon size={14}/> Active Sources
             </div>
             
             <div className="flex-1 p-3 overflow-y-auto space-y-4">
                
                {/* Source 1 */}
                <div className="bg-[#181825] border-2 border-[#a6e3a1] rounded p-3 shadow-[0_0_15px_rgba(166,227,161,0.1)]">
                   <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2 text-white font-bold text-[12px]">
                         <Users size={16} className="text-[#a6e3a1]"/> OptiTrack Vicon_Main
                      </div>
                      <div className="w-2 h-2 rounded-full bg-[#a6e3a1] animate-pulse shadow-[0_0_5px_#a6e3a1]"></div>
                   </div>
                   
                   <div className="space-y-2 text-[11px] font-mono text-[#a6adc8]">
                      <div className="flex justify-between"><span>Protocol</span> <span className="text-white">LiveLink / TCP</span></div>
                      <div className="flex justify-between"><span>Port</span> <span className="text-white">11111</span></div>
                      <div className="flex justify-between"><span>Skeletons</span> <span className="text-white">3</span></div>
                      <div className="flex justify-between"><span>Rigid Bodies</span> <span className="text-white">12</span></div>
                   </div>

                   <button className="w-full mt-3 bg-[#313244] hover:bg-[#45475a] text-white py-1.5 rounded text-[10px] font-bold border border-[#45475a] flex justify-center items-center gap-2">
                       <RefreshCw size={12}/> Reset Origin
                   </button>
                </div>

                {/* Source 2 (Offline) */}
                <div className="bg-[#181825] border border-[#313244] rounded p-3 opacity-60">
                   <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2 text-white font-bold text-[12px]">
                         <Video size={16} className="text-[#f38ba8]"/> iPhone ARKit Face
                      </div>
                      <div className="w-2 h-2 rounded-full bg-[#f38ba8]"></div>
                   </div>
                   <div className="space-y-2 text-[11px] font-mono text-[#a6adc8]">
                      <div className="flex justify-between"><span>Protocol</span> <span>UDP / ARKit</span></div>
                      <div className="flex justify-between"><span>Status</span> <span className="text-[#f38ba8]">DISCONNECTED</span></div>
                   </div>
                </div>

             </div>

             {/* Bottom Tools */}
             <div className="p-4 border-t border-[#313244] bg-[#11111b] space-y-2">
                 <button className="w-full bg-[#a6e3a1] hover:bg-[#8bd586] text-black py-2 rounded text-[11px] font-bold shadow-[0_0_15px_rgba(166,227,161,0.2)] uppercase tracking-widest flex items-center justify-center gap-2">
                    <Download size={14}/> Record Take
                 </button>
                 <button className="w-full bg-[#313244] hover:bg-[#45475a] text-white py-2 rounded text-[11px] font-bold border border-[#45475a] uppercase tracking-widest flex items-center justify-center gap-2">
                    <Database size={14}/> Retarget Manager
                 </button>
             </div>
         </div>
      </div>
    </div>
  );
}
