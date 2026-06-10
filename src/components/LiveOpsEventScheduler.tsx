import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, Activity, ShieldAlert, Flag, Award, Settings2, Trash2, Edit2, Play, Plus } from 'lucide-react';

export default function LiveOpsEventScheduler() {
  return (
    <div className="flex flex-col h-full bg-[#18181b] text-[#fafafa] font-sans">
      <div className="h-12 bg-[#27272a] border-b border-[#3f3f46] shadow flex items-center justify-between px-4 shrink-0 z-20">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#10b981] to-[#0ea5e9] flex items-center justify-center text-white shadow-inner">
               <Calendar size={18}/>
            </div>
            <div>
               <h2 className="font-bold text-[12px] uppercase tracking-widest text-[#10b981]">LiveOps Event Scheduler</h2>
               <p className="text-[9px] text-[#a1a1aa] font-mono">SEASONAL EVENTS • A/B TESTS • FEATURE FLAGS</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <div className="text-[10px] font-mono text-[#a1a1aa] border border-[#3f3f46] px-2 py-1 rounded bg-[#09090b]">System Time: 2026-06-10 12:00 UTC</div>
            <button className="bg-[#10b981] hover:bg-[#059669] text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase shadow-[0_0_10px_rgba(16,185,129,0.3)] flex items-center gap-2">
                <Plus size={14} strokeWidth={3}/> New Campaign
            </button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Main Timeline View */}
         <div className="flex-1 bg-[#09090b] relative flex flex-col border-r border-[#3f3f46]">
             
             {/* Timeline Header */}
             <div className="h-10 bg-[#18181b] border-b border-[#27272a] flex items-center px-4">
                 <div className="w-32 text-[10px] font-bold text-[#a1a1aa] uppercase tracking-widest">Track</div>
                 <div className="flex-1 flex text-[9px] font-mono text-[#52525b]">
                    <div className="flex-1 border-l border-[#27272a] pl-1">JUN 01</div>
                    <div className="flex-1 border-l border-[#27272a] pl-1">JUN 08</div>
                    <div className="flex-1 border-l border-[#27272a] pl-1 text-[#10b981]">JUN 15 (Now)</div>
                    <div className="flex-1 border-l border-[#27272a] pl-1">JUN 22</div>
                    <div className="flex-1 border-l border-[#27272a] pl-1">JUN 29</div>
                 </div>
             </div>

             <div className="flex-1 overflow-y-auto relative p-2 space-y-2">
                 
                 {/* Seasonal Track */}
                 <div className="flex h-12 bg-[#18181b] border border-[#27272a] rounded overflow-hidden">
                    <div className="w-32 bg-[#27272a] p-2 flex flex-col justify-center border-r border-[#3f3f46]">
                       <span className="text-[10px] font-bold text-white">Seasons</span>
                    </div>
                    <div className="flex-1 relative">
                       {/* Current Time Line */}
                       <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-[#10b981] z-10 shadow-[0_0_5px_#10b981]"></div>
                       
                       {/* Event Block */}
                       <div className="absolute top-1 bottom-1 left-[10%] right-[30%] bg-[#ef4444]/20 border border-[#ef4444] rounded flex items-center px-2 cursor-pointer hover:bg-[#ef4444]/30">
                           <span className="text-[10px] font-bold text-[#fca5a5]">Summer Scorcher Event V2</span>
                       </div>
                    </div>
                 </div>

                 {/* Sales Track */}
                 <div className="flex h-12 bg-[#18181b] border border-[#27272a] rounded overflow-hidden">
                    <div className="w-32 bg-[#27272a] p-2 flex flex-col justify-center border-r border-[#3f3f46]">
                       <span className="text-[10px] font-bold text-white">Monetization</span>
                    </div>
                    <div className="flex-1 relative">
                       <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-[#10b981] z-10"></div>
                       
                       <div className="absolute top-1 bottom-1 left-[45%] right-[45%] bg-[#eab308]/20 border border-[#eab308] rounded flex items-center px-2 cursor-pointer hover:bg-[#eab308]/30">
                           <span className="text-[10px] font-bold text-[#fde047] truncate">Flash Sale (Epic)</span>
                       </div>
                    </div>
                 </div>

                 {/* Experiments Track */}
                 <div className="flex h-12 bg-[#18181b] border border-[#27272a] rounded overflow-hidden">
                    <div className="w-32 bg-[#27272a] p-2 flex flex-col justify-center border-r border-[#3f3f46]">
                       <span className="text-[10px] font-bold text-white">A/B Tests</span>
                    </div>
                    <div className="flex-1 relative">
                       <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-[#10b981] z-10"></div>
                       
                       <div className="absolute top-1 bottom-1 left-[0%] right-[60%] bg-[#8b5cf6]/20 border border-[#8b5cf6] rounded flex items-center px-2 opacity-50 cursor-not-allowed">
                           <span className="text-[10px] font-bold text-[#c4b5fd] truncate">New Tutorial Flow (Ended)</span>
                       </div>
                    </div>
                 </div>

             </div>
         </div>

         {/* Event Detail Panel */}
         <div className="w-[320px] bg-[#18181b] flex flex-col shrink-0">
             <div className="p-3 border-b border-[#27272a] flex justify-between items-center bg-[#09090b]">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-white">Event Configuration</h3>
                <div className="flex gap-1">
                   <button className="text-[#a1a1aa] hover:text-white p-1"><Edit2 size={12}/></button>
                   <button className="text-[#ef4444] hover:text-[#fca5a5] p-1"><Trash2 size={12}/></button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar text-[11px]">
                 
                 <div>
                    <div className="text-[14px] font-bold text-[#ef4444] mb-1">Summer Scorcher Event V2</div>
                    <div className="flex items-center gap-2 text-[10px] text-[#10b981]">
                        <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div> Live (Active)
                    </div>
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between border-b border-[#27272a] pb-1">
                       <span className="text-[#a1a1aa]">Start Date</span><span className="font-mono text-white">2026-06-03 00:00</span>
                    </div>
                    <div className="flex justify-between border-b border-[#27272a] pb-1">
                       <span className="text-[#a1a1aa]">End Date</span><span className="font-mono text-white">2026-06-24 00:00</span>
                    </div>
                 </div>

                 <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-widest">Active Overrides</h4>
                    <div className="bg-[#27272a] rounded p-2 text-[10px] font-mono border border-[#3f3f46]">
                       <div className="text-[#0ea5e9]">"DropRates.Legendary" : 0.05</div>
                       <div className="text-[#eab308]">"Lobby.Theme" : "Summer"</div>
                       <div className="text-[#ef4444]">"EnablePvPMode" : true</div>
                    </div>
                 </div>

                 <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-widest">Player Targeting (Segments)</h4>
                    <select className="bg-[#09090b] border border-[#3f3f46] text-white p-2 rounded w-full outline-none text-[10px]">
                       <option>All Players (Global)</option>
                       <option>VIP Tier Only</option>
                       <option>Lapsed Players (7d+)</option>
                    </select>
                 </div>

                 <button className="w-full bg-[#09090b] border border-[#3f3f46] hover:bg-[#27272a] text-[#a1a1aa] py-2 rounded text-[10px] font-bold uppercase tracking-widest mt-4">
                    Pause Event
                 </button>
             </div>
         </div>
      </div>
    </div>
  );
}
