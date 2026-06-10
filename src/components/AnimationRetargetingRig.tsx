import React from 'react';
import { Network, GitMerge, Activity, Move, Search, Play, ArrowRight, UserPlus, Eye, Link as LinkIcon, Download, Zap } from 'lucide-react';

export default function AnimationRetargetingRig() {
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#cccccc] font-sans">
      
      {/* Top Header */}
      <div className="h-12 bg-[#252526] border-b border-[#3e3e42] shadow-sm flex justify-between items-center px-4 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-br from-[#c678dd] to-[#98c379] rounded flex items-center justify-center text-white">
                <GitMerge size={18}/>
             </div>
             <div>
                <h2 className="font-bold text-[12px] uppercase tracking-widest text-[#d4d4d4]">IK Skeleton Retargeter</h2>
                <p className="text-[9px] text-[#808080] font-mono">BONE MAPPING RIG • ROOT MOTION EXTRACTION</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <button className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
                <Download size={14}/> Process Anim Batch
             </button>
          </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Skeleton Viewers */}
         <div className="flex-1 bg-[#1e1e1e] flex flex-col relative overflow-hidden text-[11px]">
            
            {/* Split View */}
            <div className="flex-1 flex">
               {/* Source */}
               <div className="flex-1 border-r border-[#3e3e42] flex flex-col relative">
                  <div className="absolute top-0 left-0 bg-[#333333] px-3 py-1 rounded-br text-[10px] font-bold uppercase text-[#c678dd] z-10 flex items-center gap-2">
                     <UserPlus size={12}/> SOURCE (Mixamo Rig)
                  </div>
                  
                  {/* Fake Viewport Source */}
                  <div className="flex-1 relative flex items-center justify-center bg-[#252526]" style={{ backgroundImage: 'radial-gradient(#3e3e42 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                     {/* Stick figure skeleton */}
                     <svg viewBox="0 0 100 200" className="w-48 h-96 opacity-60">
                        <g stroke="#c678dd" strokeWidth="2" fill="none">
                           <line x1="50" y1="40" x2="50" y2="100"/>
                           <line x1="50" y1="60" x2="30" y2="90"/>
                           <line x1="30" y1="90" x2="20" y2="130"/>
                           <line x1="50" y1="60" x2="70" y2="90"/>
                           <line x1="70" y1="90" x2="80" y2="130"/>
                           <line x1="50" y1="100" x2="40" y2="150"/>
                           <line x1="40" y1="150" x2="35" y2="190"/>
                           <line x1="50" y1="100" x2="60" y2="150"/>
                           <line x1="60" y1="150" x2="65" y2="190"/>
                           <circle cx="50" cy="30" r="10" fill="#252526"/>
                        </g>
                     </svg>
                  </div>
               </div>

               {/* Target */}
               <div className="flex-1 flex flex-col relative">
                  <div className="absolute top-0 left-0 bg-[#333333] px-3 py-1 rounded-br text-[10px] font-bold uppercase text-[#98c379] z-10 flex items-center gap-2">
                     <UserPlus size={12}/> TARGET (UE5 Manny)
                  </div>
                  
                  {/* Fake Viewport Target */}
                  <div className="flex-1 relative flex items-center justify-center bg-[#252526]" style={{ backgroundImage: 'radial-gradient(#3e3e42 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                     {/* Stick figure skeleton - slightly proportioned differently */}
                     <svg viewBox="0 0 100 200" className="w-48 h-96 opacity-80">
                        <g stroke="#98c379" strokeWidth="2" fill="none">
                           <line x1="50" y1="35" x2="50" y2="95"/>
                           <line x1="50" y1="55" x2="25" y2="85"/>
                           <line x1="25" y1="85" x2="15" y2="125"/>
                           <line x1="50" y1="55" x2="75" y2="85"/>
                           <line x1="75" y1="85" x2="85" y2="125"/>
                           <line x1="50" y1="95" x2="35" y2="145"/>
                           <line x1="35" y1="145" x2="30" y2="190"/>
                           <line x1="50" y1="95" x2="65" y2="145"/>
                           <line x1="65" y1="145" x2="70" y2="190"/>
                           <circle cx="50" cy="25" r="10" fill="#252526"/>
                        </g>
                     </svg>
                  </div>
               </div>
            </div>

            {/* Bottom Playback */}
            <div className="h-12 bg-[#2d2d30] border-t border-[#3e3e42] flex items-center px-4 shrink-0 shadow-inner z-20">
               <button className="w-8 h-8 bg-[#3e3e42] hover:bg-[#555] rounded text-white flex items-center justify-center mr-4"><Play size={14}/></button>
               <div className="flex-1 h-3 bg-[#1e1e1e] rounded border border-[#3e3e42] flex items-center relative">
                  <div className="w-1 h-full bg-[#0e639c] absolute left-[30%] shadow-[0_0_5px_#0e639c]"></div>
               </div>
            </div>
         </div>

         {/* Right Mapping Inspector */}
         <div className="w-[360px] bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0 shadow-[-5px_0_15px_rgba(0,0,0,0.3)] z-10">
            
            <div className="p-3 bg-[#2d2d30] border-b border-[#3e3e42] text-[11px] uppercase font-bold text-[#d4d4d4] flex items-center gap-2">
               <LinkIcon size={14} className="text-[#0e639c]"/> IK Bone Mapping Profile
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
               <div className="bg-[#1e1e1e] rounded border border-[#3e3e42] overflow-hidden">
                  
                  {/* Header row */}
                  <div className="flex border-b border-[#3e3e42] bg-[#333333] p-2 text-[10px] font-bold text-[#808080] uppercase tracking-widest">
                     <div className="flex-1 text-[#c678dd]">Source</div>
                     <div className="w-8 flex justify-center"><ArrowRight size={12}/></div>
                     <div className="flex-1 text-[#98c379]">Target</div>
                  </div>

                  {/* Mapping rows */}
                  <div className="flex flex-col text-[11px] font-mono">
                     <div className="flex items-center p-2 border-b border-[#3e3e42] hover:bg-[#2d2d30] cursor-pointer">
                        <div className="flex-1 truncate text-[#d4d4d4]">Hips</div>
                        <div className="w-8 flex justify-center text-[#808080]"><LinkIcon size={10}/></div>
                        <div className="flex-1 truncate text-[#d4d4d4]">pelvis</div>
                     </div>
                     <div className="flex items-center p-2 border-b border-[#3e3e42] hover:bg-[#2d2d30] cursor-pointer bg-[#2d2d30]/50">
                        <div className="flex-1 truncate text-[#d4d4d4]">Spine</div>
                        <div className="w-8 flex justify-center text-[#808080]"><LinkIcon size={10}/></div>
                        <div className="flex-1 truncate text-[#d4d4d4]">spine_01</div>
                     </div>
                     <div className="flex items-center p-2 border-b border-[#3e3e42] hover:bg-[#2d2d30] cursor-pointer">
                        <div className="flex-1 truncate text-[#d4d4d4]">Spine1</div>
                        <div className="w-8 flex justify-center text-[#808080]"><LinkIcon size={10}/></div>
                        <div className="flex-1 truncate text-[#d4d4d4]">spine_02</div>
                     </div>
                     <div className="flex items-center p-2 border-b border-[#3e3e42] hover:bg-[#2d2d30] cursor-pointer">
                        <div className="flex-1 truncate text-[#d4d4d4]">Spine2</div>
                        <div className="w-8 flex justify-center text-[#808080]"><LinkIcon size={10}/></div>
                        <div className="flex-1 truncate text-[#d4d4d4]">spine_03</div>
                     </div>
                     
                     {/* Left Arm block */}
                     <div className="flex items-center p-2 border-b border-[#3e3e42] hover:bg-[#2d2d30] cursor-pointer">
                        <div className="flex-1 truncate ml-2 text-[#a0a0a0]">LeftShoulder</div>
                        <div className="w-8 flex justify-center text-[#808080]"><LinkIcon size={10}/></div>
                        <div className="flex-1 truncate text-[#d4d4d4]">clavicle_l</div>
                     </div>
                     <div className="flex items-center p-2 border-b border-[#3e3e42] hover:bg-[#2d2d30] cursor-pointer">
                        <div className="flex-1 truncate ml-2 text-[#a0a0a0]">LeftArm</div>
                        <div className="w-8 flex justify-center text-[#808080]"><LinkIcon size={10}/></div>
                        <div className="flex-1 truncate text-[#d4d4d4]">upperarm_l</div>
                     </div>
                     <div className="flex items-center p-2 hover:bg-[#2d2d30] cursor-pointer">
                        <div className="flex-1 truncate ml-2 text-[#a0a0a0]">LeftForeArm</div>
                        <div className="w-8 flex justify-center text-[#808080]"><LinkIcon size={10}/></div>
                        <div className="flex-1 truncate text-[#d4d4d4]">lowerarm_l</div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Retarget Settings */}
            <div className="p-4 border-t border-[#3e3e42] bg-[#252526] space-y-4">
               <div>
                  <div className="text-[10px] uppercase font-bold text-[#808080] mb-2 tracking-widest">Translation Retargeting</div>
                  <select className="w-full bg-[#1e1e1e] border border-[#3e3e42] text-[11px] p-1.5 rounded outline-none text-[#d4d4d4]">
                     <option>Skeleton Compute</option>
                     <option selected>Animation Scaled</option>
                     <option>Animation Relative</option>
                  </select>
               </div>
               
               <div>
                  <div className="text-[10px] uppercase font-bold text-[#808080] mb-2 tracking-widest">Root Motion extraction</div>
                  <div className="bg-[#1e1e1e] border border-[#3e3e42] rounded p-2 text-[11px] space-y-2">
                     <label className="flex items-center gap-2 text-[#d4d4d4]"><input type="checkbox" defaultChecked className="accent-[#0e639c]"/> Enable Root Motion</label>
                     <label className="flex items-center gap-2 text-[#d4d4d4]"><input type="checkbox" defaultChecked className="accent-[#0e639c]"/> Force Root Lock (Zero)</label>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
