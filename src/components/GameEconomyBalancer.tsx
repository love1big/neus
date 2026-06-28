import React, { useState } from 'react';
import { Coins, TrendingUp, BarChart, ArrowRightLeft, Gift, ShieldAlert, Sparkles, Activity, Layers, Download, RefreshCw, Zap, TrendingDown, Sliders } from 'lucide-react';

export default function GameEconomyBalancer() {
  return (
    <div className="flex flex-col h-full bg-[#111] text-[#e0e0e0] font-sans">
      <div className="h-12 bg-[#1a1a1a] border-b border-[#333] shadow flex items-center justify-between px-4 shrink-0 z-20">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#eab308] to-[#ca8a04] flex items-center justify-center text-white shadow-inner">
               <Coins size={18}/>
            </div>
            <div>
               <h2 className="font-bold text-[12px] uppercase tracking-widest text-[#eab308]">Virtual Economy Balancer</h2>
               <p className="text-[9px] text-[#888] font-mono">MACROECONOMICS • INFLATION PROJECTIONS • SINK/SOURCE MODEL</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 border border-[#333] bg-[#000] px-2 py-1 rounded text-[10px] font-mono">
                <span className="text-[#888]">Sim Days:</span>
                <span className="text-[#eab308] font-bold">365</span>
             </div>
             <button className="bg-[#eab308] hover:bg-[#ca8a04] text-black px-4 py-1.5 rounded text-[10px] font-bold uppercase shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center gap-2"><RefreshCw size={14}/> Run Monte Carlo</button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Main Chart View */}
         <div className="flex-1 bg-[#0a0a0a] relative flex flex-col items-center justify-center border-r border-[#333] overflow-hidden p-6 gap-6">
            
            {/* Top Stats */}
            <div className="w-full flex gap-4 h-24 shrink-0">
               <div className="flex-1 bg-[#1a1a1a] border border-[#333] rounded p-3 flex flex-col justify-between">
                  <div className="text-[10px] uppercase font-bold text-[#888] flex items-center gap-2"><TrendingUp size={12}/> Daily Faucet (Sources)</div>
                  <div className="text-2xl font-mono text-[#4ade80]">+ 1.25B <span className="text-[10px] text-[#888]">Gold/Day</span></div>
               </div>
               <div className="flex-1 bg-[#1a1a1a] border border-[#333] rounded p-3 flex flex-col justify-between">
                  <div className="text-[10px] uppercase font-bold text-[#888] flex items-center gap-2"><TrendingDown size={12}/> Daily Sinks (Drains)</div>
                  <div className="text-2xl font-mono text-[#f87171]">- 0.95B <span className="text-[10px] text-[#888]">Gold/Day</span></div>
               </div>
               <div className="flex-1 bg-[#1a1a1a] border border-[#333] border-t-2 border-t-[#eab308] rounded p-3 flex flex-col justify-between">
                  <div className="text-[10px] uppercase font-bold text-[#888] flex items-center gap-2"><Activity size={12} className="text-[#eab308]"/> Net Inflation Rate</div>
                  <div className="text-2xl font-mono text-[#eab308]">+ 3.2% <span className="text-[10px] text-[#888]">MoM</span></div>
               </div>
            </div>
            
            {/* Main Graph (Fake) */}
            <div className="flex-1 w-full bg-[#111] border border-[#333] rounded flex flex-col">
                <div className="p-3 border-b border-[#222] flex justify-between items-center text-[11px] font-bold uppercase text-[#888]">
                    1 Year Supply Projection
                    <div className="flex gap-4">
                       <span className="flex items-center gap-1 text-[9px]"><div className="w-2 h-2 rounded bg-[#4ade80]"></div> Free Currency</span>
                       <span className="flex items-center gap-1 text-[9px]"><div className="w-2 h-2 rounded bg-[#60a5fa]"></div> Premium Hubs</span>
                    </div>
                </div>
                <div className="flex-1 relative overflow-hidden">
                    {/* Grid */}
                    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)', backgroundSize: '10% 20%' }}></div>
                    {/* Fake Lines */}
                    <svg className="absolute inset-0 w-full h-full opacity-80" preserveAspectRatio="none" viewBox="0 0 100 100">
                        {/* Premium flat line */}
                        <path d="M 0 50 L 100 60" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="2 2"/>
                        {/* Free Currency exploding */}
                        <path d="M 0 80 Q 50 70, 90 20 T 100 5" fill="none" stroke="#4ade80" strokeWidth="2" />
                        
                        {/* Inflation danger zone fill */}
                        <path d="M 0 80 Q 50 70, 90 20 T 100 5 L 100 100 L 0 100 Z" fill="rgba(74,222,128,0.05)" />
                    </svg>
                    
                    {/* Warning overlay */}
                    <div className="absolute top-[30%] right-[15%] bg-[#ef4444]/20 border border-[#ef4444] rounded p-2 text-[10px] font-mono text-[#fca5a5] flex items-center gap-2 backdrop-blur">
                        <ShieldAlert size={12}/> Hyperinflation detected by Month 8
                    </div>
                </div>
            </div>

         </div>

         {/* Right Parameters panel */}
         <div className="w-[340px] bg-[#1a1a1a] flex flex-col shrink-0">
             
             <div className="p-3 border-b border-[#333] bg-[#111]">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#eab308] flex items-center gap-2"><Sliders size={16}/> Tweak Variables</h3>
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar text-[11px]">
                 
                 {/* Faucets */}
                 <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-[#888] uppercase border-b border-[#333] pb-1">Sources (Faucets)</h4>
                    <div>
                       <div className="flex justify-between mb-1"><span>Daily Mission Payout (Avg)</span><span className="font-mono text-[#4ade80]">2,500</span></div>
                       <input type="range" className="w-full accent-[#4ade80]" min="500" max="10000" defaultValue="2500" />
                    </div>
                    <div>
                       <div className="flex justify-between mb-1"><span>Loot Drop Rate (Gold)</span><span className="font-mono text-[#4ade80]">x1.2</span></div>
                       <input type="range" className="w-full accent-[#4ade80]" min="0" max="100" defaultValue="20" />
                    </div>
                    <div>
                       <div className="flex justify-between mb-1"><span>Selling Scrap to NPC</span><span className="font-mono text-[#4ade80]">30% Value</span></div>
                       <input type="range" className="w-full accent-[#4ade80]" min="0" max="100" defaultValue="30" />
                    </div>
                 </div>

                 {/* Sinks */}
                 <div className="space-y-3 pt-4 border-t border-[#333]">
                    <h4 className="text-[10px] font-bold text-[#888] uppercase border-b border-[#333] pb-1">Drains (Sinks)</h4>
                    <div>
                       <div className="flex justify-between mb-1"><span>Repair Costs (Durability)</span><span className="font-mono text-[#f87171]">High</span></div>
                       <input type="range" className="w-full accent-[#f87171]" min="0" max="100" defaultValue="80" />
                    </div>
                    <div>
                       <div className="flex justify-between mb-1"><span>Fast Travel Tax</span><span className="font-mono text-[#f87171]">50 / Trip</span></div>
                       <input type="range" className="w-full accent-[#f87171]" min="0" max="500" defaultValue="50" />
                    </div>
                    <div>
                       <div className="flex justify-between mb-1"><span>Auction House Cut</span><span className="font-mono text-[#f87171]">12.5%</span></div>
                       <input type="range" className="w-full accent-[#f87171]" min="0" max="30" defaultValue="12" />
                    </div>
                 </div>

                 {/* Gacha / Pity */}
                 <div className="space-y-3 pt-4 border-t border-[#333]">
                    <h4 className="text-[10px] font-bold text-[#888] uppercase border-b border-[#333] pb-1">Gacha / Lootbox Math</h4>
                    
                    <div className="bg-[#111] p-2 rounded border border-[#333] space-y-2">
                        <div className="flex items-center justify-between text-[10px]">
                           <span className="text-[#a855f7] font-bold">SSR Pull Rate</span>
                           <input type="number" defaultValue="0.6" step="0.1" className="w-16 bg-[#222] text-[#e0e0e0] border border-[#444] rounded text-right font-mono" />
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                           <span className="text-[#888]">Hard Pity Limit</span>
                           <input type="number" defaultValue="90" className="w-16 bg-[#222] text-[#e0e0e0] border border-[#444] rounded text-right font-mono" />
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                           <span className="text-[#888]">Soft Pity Start</span>
                           <input type="number" defaultValue="75" className="w-16 bg-[#222] text-[#e0e0e0] border border-[#444] rounded text-right font-mono" />
                        </div>
                    </div>
                 </div>

                 <button className="w-full bg-[#222] hover:bg-[#333] border border-[#444] rounded py-2 text-[10px] font-bold uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                    <Download size={14}/> Export Economy Config (JSON)
                 </button>

             </div>

          </div>
      </div>
    </div>
  );
}
