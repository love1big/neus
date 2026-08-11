import React, { useState } from 'react';
import { 
  History, Swords, Play, Square, Pause, Flame, Droplets, Zap, Wind, Link2, Settings2, Box, Eye, Network, Gauge, ShieldAlert, FastForward, Activity, Workflow, PlusCircle, Save} from 'lucide-react';

export default function SkillForgeEditor({ setActiveTool }: { setActiveTool?: (tool: string) => void }) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'logic' | 'balancer'>('timeline');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(14);
  const totalFrames = 60;

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#c9d1d9] font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#30363d] bg-[#161b22]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[#ff7b72] to-[#e3b341] rounded-lg shadow-[0_0_15px_rgba(255,123,114,0.3)]">
            <Swords size={20} className="text-[#0a0a0a]" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight uppercase tracking-wide">Ultimate Skill Forge</h1>
            <div className="text-[11px] text-[#8b949e] flex items-center gap-2">
              <span>Skill ID: <span className="font-mono text-[#58a6ff]">SK_DRAGON_STRIKE_01</span></span>
              <span>•</span>
              <span className="text-[#3fb950]">Deterministic Mode (Non-AI Native)</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-bold rounded border border-[#30363d] transition-colors flex items-center gap-2">
            <Play size={14} className="text-[#3fb950]"/> Test in Sandbox
          </button>
          <button className="px-4 py-2 bg-[#3fb950] hover:bg-[#2ea043] text-white text-xs font-bold rounded border border-[#3fb950] transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(63,185,80,0.2)]">
            <Save size={14}/> Compile Skill
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar - Properties */}
        <div className="w-[320px] bg-[#0d1117] border-r border-[#30363d] flex flex-col h-full overflow-y-auto custom-scrollbar">
          <div className="p-4 border-b border-[#30363d]">
            <h2 className="text-white font-bold text-[13px] uppercase tracking-wider mb-4 flex items-center gap-2"><Settings2 size={16} className="text-[#8b949e]"/> General Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[11px] text-[#8b949e] font-bold uppercase block mb-1">Skill Name</label>
                <input type="text" defaultValue="Dragon Strike (Ascending)" className="w-full bg-[#161b22] border border-[#30363d] rounded p-2 text-sm text-white font-bold outline-none focus:border-[#58a6ff]" />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                   <label className="text-[11px] text-[#8b949e] font-bold uppercase block mb-1">Base Cost</label>
                   <div className="flex items-center bg-[#161b22] border border-[#30363d] rounded overflow-hidden">
                     <div className="bg-[#1f242c] p-2 border-r border-[#30363d]"><Droplets size={14} className="text-[#58a6ff]"/></div>
                     <input type="number" defaultValue="45" className="w-full bg-transparent p-2 text-sm text-white outline-none" />
                   </div>
                </div>
                <div className="flex-1">
                   <label className="text-[11px] text-[#8b949e] font-bold uppercase block mb-1">Cooldown</label>
                   <div className="flex items-center bg-[#161b22] border border-[#30363d] rounded overflow-hidden">
                     <div className="bg-[#1f242c] p-2 border-r border-[#30363d]"><History size={14} className="text-[#8b949e]"/></div>
                     <input type="text" defaultValue="8.5s" className="w-full bg-transparent p-2 text-sm text-white outline-none" />
                   </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#8b949e] font-bold uppercase block mb-2">Primary Element</label>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#ff7b72]/20 border border-[#ff7b72] flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(255,123,114,0.4)]">
                    <Flame size={16} className="text-[#ff7b72]"/>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center cursor-pointer hover:border-[#8b949e]">
                    <Droplets size={16} className="text-[#58a6ff]"/>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center cursor-pointer hover:border-[#8b949e]">
                    <Zap size={16} className="text-[#e3b341]"/>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center cursor-pointer hover:border-[#8b949e]">
                    <Wind size={16} className="text-[#3fb950]"/>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 border-t border-[#30363d]">
                 <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-[#161b22] rounded mt-1">
                    <span className="text-[12px] font-bold text-[#c9d1d9]">Interruptible (Hyper Armor)</span>
                    <input type="checkbox" className="accent-[#ff7b72] w-4 h-4" />
                 </label>
                 <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-[#161b22] rounded">
                    <span className="text-[12px] font-bold text-[#c9d1d9]">Ground targeting required</span>
                    <input type="checkbox" className="accent-[#58a6ff] w-4 h-4" />
                 </label>
              </div>

            </div>
          </div>

          {/* Damage Scaling */}
          <div className="p-4">
             <h2 className="text-white font-bold text-[13px] uppercase tracking-wider mb-4 flex items-center gap-2"><Gauge size={16} className="text-[#e3b341]"/> Scaling Formula</h2>
             <div className="bg-[#161b22] border border-[#30363d] rounded p-3 font-mono text-[11px]">
               <div className="text-[#8b949e] mb-1">// Base + (ATK * Multiplier) * ElemBonus</div>
               <div>
                 <span className="text-[#ff7b72]">Damage</span> = 
                 <span className="text-[#79c0ff]"> 150</span> + 
                 (<span className="text-[#d2a8ff]">Actor.ATK</span> * <span className="text-[#a5d6ff]">1.85</span>) * 
                 <span className="text-[#ff7b72]"> 1.2</span>
               </div>
             </div>
             
             <button className="w-full mt-3 py-2 bg-[#21262d] hover:bg-[#30363d] rounded border border-[#30363d] text-[11px] font-bold uppercase tracking-wider text-[#c9d1d9]">
                Edit Math Expression
             </button>
          </div>
        </div>

        {/* Right Area - Editors */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tabs */}
          <div className="flex bg-[#0d1117] border-b border-[#30363d] h-11 shrink-0 overflow-x-auto custom-scrollbar">
            <button onClick={() => setActiveTab('timeline')} className={`px-5 h-full text-[12px] font-bold tracking-widest uppercase flex items-center gap-2 border-r border-[#30363d] hover:bg-[#161b22] ${activeTab === 'timeline' ? 'bg-[#161b22] text-[#ff7b72] border-b-2 border-b-[#ff7b72]' : 'text-[#8b949e]'}`}>
              <Activity size={16}/> Frame & Hitbox Data
            </button>
            <button onClick={() => setActiveTab('logic')} className={`px-5 h-full text-[12px] font-bold tracking-widest uppercase flex items-center gap-2 border-r border-[#30363d] hover:bg-[#161b22] ${activeTab === 'logic' ? 'bg-[#161b22] text-[#58a6ff] border-b-2 border-b-[#58a6ff]' : 'text-[#8b949e]'}`}>
              <Workflow size={16}/> Node Logic Flow
            </button>
            <button onClick={() => setActiveTab('balancer')} className={`px-5 h-full text-[12px] font-bold tracking-widest uppercase flex items-center gap-2 border-r border-[#30363d] hover:bg-[#161b22] ${activeTab === 'balancer' ? 'bg-[#161b22] text-[#e3b341] border-b-2 border-b-[#e3b341]' : 'text-[#8b949e]'}`}>
              <Network size={16}/> Offline AI Balancer
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 bg-[#161b22] relative overflow-hidden">
            {activeTab === 'timeline' && (
              <div className="absolute inset-0 flex flex-col">
                 <div className="flex-1 bg-[#050505] relative" style={{ backgroundImage: 'radial-gradient(#30363d 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                    {/* Mock 3D Viewport for Hitbox */}
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="relative w-[300px] h-[300px] border border-[#30363d]/50 rounded-full flex items-center justify-center">
                          {/* Character Mock */}
                          <div className="w-16 h-32 bg-[#21262d] rounded-sm absolute bottom-10 z-10 border border-[#8b949e]"></div>
                          {/* Hitbox Mock (Active Frame) */}
                          {currentFrame >= 20 && currentFrame <= 35 && (
                             <div className="absolute w-[250px] h-[100px] bg-[#ff7b72]/30 border-2 border-[#ff7b72] right-0 bottom-16 rounded-r-full shadow-[0_0_30px_rgba(255,123,114,0.4)] z-20 flex items-center justify-end pr-4">
                                <span className="text-[#ff7b72] font-bold text-[10px] tracking-widest">DAMAGE HITBOX</span>
                             </div>
                          )}
                          {/* I-Frame Indicator */}
                          {currentFrame >= 5 && currentFrame <= 15 && (
                             <div className="absolute w-24 h-40 bg-[#58a6ff]/20 border-2 border-[#58a6ff] rounded-[40%] bottom-8 shadow-[0_0_20px_rgba(88,166,255,0.4)] z-0 flex shadow-inner">
                               <ShieldAlert size={20} className="text-[#58a6ff] absolute -top-6 left-1/2 -translate-x-1/2"/>
                             </div>
                          )}
                       </div>
                    </div>
                    
                    {/* View Controls */}
                    <div className="absolute top-4 right-4 flex gap-2">
                       <button className="w-8 h-8 bg-[#161b22] border border-[#30363d] rounded flex items-center justify-center text-[#8b949e] hover:text-white"><Eye size={16}/></button>
                       <button className="w-8 h-8 bg-[#161b22] border border-[#30363d] rounded flex items-center justify-center text-[#ff7b72] hover:text-[#ff7b72] border-[#ff7b72]/50 bg-[#ff7b72]/10"><Box size={16}/></button>
                    </div>
                 </div>

                 {/* Timeline Editor */}
                 <div className="h-[280px] bg-[#0d1117] border-t border-[#30363d] flex flex-col shrink-0">
                    <div className="flex items-center p-2 border-b border-[#30363d] bg-[#161b22] gap-4">
                       <div className="flex gap-1 justify-center w-24">
                          <button onClick={() => setIsPlaying(!isPlaying)} className="w-8 h-8 flex items-center justify-center text-white bg-[#30363d] rounded hover:bg-[#8b949e]">
                            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                          </button>
                          <button onClick={() => setCurrentFrame(0)} className="w-8 h-8 flex items-center justify-center text-white bg-[#21262d] rounded hover:bg-[#30363d]">
                            <Square size={14} className="fill-current" />
                          </button>
                       </div>
                       <div className="font-mono text-[#58a6ff] font-bold w-20">FR: {currentFrame.toString().padStart(2, '0')}/60</div>
                       <input 
                         type="range" 
                         min="0" max={totalFrames} 
                         value={currentFrame} 
                         onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
                         className="flex-1 accent-[#58a6ff] bg-[#30363d] h-1 rounded appearance-none"
                       />
                    </div>
                    
                    <div className="flex-1 overflow-auto custom-scrollbar relative">
                       {/* Headers */}
                       <div className="absolute left-[150px] top-0 bottom-0 right-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(90deg, #30363d 1px, transparent 1px)', backgroundSize: '20px 100%' }}>
                          {/* Playhead */}
                          <div className="absolute top-0 bottom-0 w-[1px] bg-[#58a6ff] z-50 pointer-events-auto" style={{ left: `${(currentFrame / totalFrames) * 100}%` }}>
                             <div className="w-3 h-3 bg-[#58a6ff] rounded-sm -ml-[5px] cursor-ew-resize"></div>
                          </div>
                       </div>
                       
                       {/* Tracks */}
                       <div className="flex flex-col gap-0.5 mt-4">
                          {/* Track 1: Status */}
                          <div className="flex items-center h-8 bg-[#161b22] group">
                             <div className="w-[150px] shrink-0 px-3 text-[11px] font-bold text-[#c9d1d9] border-r border-[#30363d] flex items-center gap-2 bg-[#0d1117] relative z-10"><ShieldAlert size={14} className="text-[#a371f7]"/> Actor State</div>
                             <div className="flex-1 relative h-full">
                               <div className="absolute h-5 top-1.5 bg-[#a371f7]/20 border border-[#a371f7] text-[#a371f7] text-[9px] font-bold px-1 py-0.5 rounded flex items-center" style={{ left: '8%', width: '16%' }}>I-Frames (Invincible)</div>
                               <div className="absolute h-5 top-1.5 bg-[#3fb950]/20 border border-[#3fb950] text-[#3fb950] text-[9px] font-bold px-1 py-0.5 rounded flex items-center" style={{ left: '60%', width: '40%' }}>Recovery (Vulnerable)</div>
                             </div>
                          </div>
                          
                          {/* Track 2: Hitbox */}
                          <div className="flex items-center h-8 bg-[#161b22] group hover:bg-[#30363d] cursor-pointer transition-colors" onClick={() => setActiveTool?.('EffectEdit')}>
                             <div className="w-[150px] shrink-0 px-3 text-[11px] font-bold text-[#c9d1d9] border-r border-[#30363d] flex items-center justify-between bg-[#0d1117] relative z-10 group-hover:bg-[#161b22]">
                               <div className="flex items-center gap-2"><Box size={14} className="text-[#ff7b72]"/> Hitboxes</div>
                               <Link2 size={12} className="text-[#8b949e] opacity-0 group-hover:opacity-100" />
                             </div>
                             <div className="flex-1 relative h-full">
                               <div className="absolute h-5 top-1.5 bg-[#ff7b72]/30 border-2 border-[#ff7b72] text-[#ff7b72] text-[9px] font-bold px-1 py-0.5 rounded flex items-center overflow-hidden" style={{ left: '33%', width: '25%' }}>Active Frames (Damage)</div>
                             </div>
                          </div>

                          {/* Track 3: VFX */}
                          <div className="flex items-center h-8 bg-[#161b22] group hover:bg-[#30363d] cursor-pointer transition-colors" onClick={() => setActiveTool?.('Niagara')}>
                             <div className="w-[150px] shrink-0 px-3 text-[11px] font-bold text-[#c9d1d9] border-r border-[#30363d] flex items-center justify-between bg-[#0d1117] relative z-10 group-hover:bg-[#161b22]">
                               <div className="flex items-center gap-2"><Flame size={14} className="text-[#e3b341]"/> Niagara VFX</div>
                               <Link2 size={12} className="text-[#8b949e] opacity-0 group-hover:opacity-100" />
                             </div>
                             <div className="flex-1 relative h-full">
                               <div className="absolute h-3 top-2.5 bg-[#e3b341] rounded-full" style={{ left: '33%', width: '8px' }}></div>
                               <span className="absolute top-2 text-[9px] text-[#8b949e] font-mono group-hover:text-white" style={{ left: '35%' }}>Spawn_FireSlash_01</span>
                             </div>
                          </div>

                          {/* Track 4: Audio/SFX */}
                          <div className="flex items-center h-8 bg-[#161b22] group hover:bg-[#30363d] cursor-pointer transition-colors mt-0.5" onClick={() => setActiveTool?.('AudioEdit')}>
                             <div className="w-[150px] shrink-0 px-3 text-[11px] font-bold text-[#c9d1d9] border-r border-[#30363d] flex items-center justify-between bg-[#0d1117] relative z-10 group-hover:bg-[#161b22]">
                               <div className="flex items-center gap-2"><Activity size={14} className="text-[#3fb950]"/> Sound Effects</div>
                               <Link2 size={12} className="text-[#8b949e] opacity-0 group-hover:opacity-100" />
                             </div>
                             <div className="flex-1 relative h-full">
                               <div className="absolute h-3 top-2.5 bg-[#3fb950] rounded-sm" style={{ left: '32.5%', width: '3px' }}></div>
                               <svg className="absolute top-1.5 h-5 w-16 text-[#3fb950] opacity-60" style={{ left: '33%' }} preserveAspectRatio="none" viewBox="0 0 100 100">
                                   <path d="M 0 50 Q 10 20 20 50 T 40 50 T 60 20 T 80 50 T 100 50" fill="none" stroke="currentColor" strokeWidth="6" />
                               </svg>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'logic' && (
              <div className="absolute inset-0 bg-[#0d1117] relative" style={{ backgroundImage: 'linear-gradient(#161b22 1px, transparent 1px), linear-gradient(90deg, #161b22 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                 <div className="absolute top-4 left-4 flex gap-2">
                    <button className="px-3 py-1.5 bg-[#161b22] border border-[#30363d] rounded text-[11px] font-bold text-white flex items-center gap-2 hover:border-[#8b949e]"><PlusCircle size={14}/> Add Node</button>
                 </div>
                 
                 {/* Visual Nodes Mock */}
                 <div className="absolute top-[10%] left-[10%] w-64 bg-[#161b22] border border-[#3fb950] rounded-lg shadow-lg">
                    <div className="px-3 py-2 border-b border-[#30363d] text-[12px] font-bold text-white flex items-center gap-2 bg-[#3fb950]/10 rounded-t-lg"><Play size={14} className="text-[#3fb950]"/> On Skill Cast</div>
                    <div className="p-3">
                       <div className="flex justify-between items-center text-[10px] text-[#8b949e]">
                          <span>Exec</span>
                          <div className="w-3 h-3 border-2 border-white rounded-full bg-[#161b22]"></div>
                       </div>
                    </div>
                 </div>

                 {/* Connecting Wire */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path d="M 280 120 C 350 120, 350 180, 420 180" fill="none" stroke="#8b949e" strokeWidth="3" />
                    <path d="M 660 210 C 700 210, 720 300, 780 300" fill="none" stroke="#8b949e" strokeWidth="3" />
                 </svg>

                 <div className="absolute top-[20%] left-[45%] w-64 bg-[#161b22] border border-[#30363d] rounded-lg shadow-lg">
                    <div className="px-3 py-2 border-b border-[#30363d] text-[12px] font-bold text-white flex items-center gap-2"><Gauge size={14} className="text-[#a371f7]"/> Check Resource</div>
                    <div className="p-3 flex flex-col gap-2">
                       <div className="flex justify-between items-center text-[10px] text-[#8b949e]">
                          <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-white rounded-full bg-[#161b22]"></div> Exec In</div>
                          <div className="flex items-center gap-2">Success <div className="w-3 h-3 border-2 border-[#3fb950] bg-[#3fb950] rounded-full"></div></div>
                       </div>
                       <div className="flex justify-between items-center text-[10px] text-[#8b949e]">
                          <div className="flex items-center gap-2"><div className="w-3 h-3 border border-[#58a6ff] rounded-full bg-[#161b22]"></div> Mana (45)</div>
                          <div className="flex items-center gap-2">Fail <div className="w-3 h-3 border border-white rounded-full bg-[#161b22]"></div></div>
                       </div>
                    </div>
                 </div>

                 <div className="absolute top-[40%] left-[80%] w-64 bg-[#161b22] border border-[#ff7b72] rounded-lg shadow-lg">
                    <div className="px-3 py-2 border-b border-[#30363d] text-[12px] font-bold text-white flex items-center gap-2 bg-[#ff7b72]/10 rounded-t-lg"><Box size={14} className="text-[#ff7b72]"/> Apply Damage</div>
                    <div className="p-3 flex flex-col gap-2">
                       <div className="flex justify-between items-center text-[10px] text-[#8b949e]">
                          <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-[#3fb950] bg-[#3fb950] rounded-full"></div> Exec</div>
                          <div className="flex items-center gap-2">Out <div className="w-3 h-3 border border-white rounded-full bg-[#161b22]"></div></div>
                       </div>
                       <div className="flex justify-between items-center text-[10px] text-[#e3b341]">
                          <div className="flex items-center gap-2"><div className="w-3 h-3 border border-[#e3b341] rounded-full bg-[#e3b341]"></div> Formula Result</div>
                       </div>
                    </div>
                 </div>

              </div>
            )}

            {activeTab === 'balancer' && (
              <div className="absolute inset-0 p-6 flex gap-6 mt-16 bg-[#0a0a0a]">
                 <div className="absolute top-0 left-0 right-0 bg-[#e3b341]/10 border-b border-[#e3b341]/30 p-3 flex items-center gap-4">
                    <div className="p-2 bg-[#e3b341]/20 text-[#e3b341] rounded"><FastForward size={20}/></div>
                    <div>
                       <div className="text-[#e3b341] font-bold text-[13px] uppercase tracking-wider">Background Simulation Complete</div>
                       <div className="text-[11px] text-[#8b949e]">Ran 100,000 matches against "Level 50 Boss_Golem" via Offline CPU threads.</div>
                    </div>
                 </div>
                 
                 <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                    <h3 className="text-white font-bold text-[14px] border-b border-[#30363d] pb-3 mb-4 flex items-center gap-2"><Activity size={16} className="text-[#58a6ff]"/> DPS Distribution Analysis</h3>
                    <div className="h-48 flex items-end justify-between px-4 pb-4 border-b border-[#30363d] gap-1">
                       {/* Mock Chart */}
                       {[10, 15, 30, 45, 80, 100, 90, 60, 40, 20, 10, 5].map((val, i) => (
                         <div key={i} className={`flex-1 rounded-t-sm ${i === 5 ? 'bg-[#ff7b72] animate-pulse' : 'bg-[#58a6ff]/50'}`} style={{ height: `${val}%` }}></div>
                       ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-[#8b949e] px-4 pt-2 font-mono">
                      <span>Low (Miss)</span>
                      <span className="text-[#ff7b72] font-bold">Max Scaling (Crit)</span>
                      <span>Avg</span>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                       <div className="bg-[#0d1117] p-3 rounded border border-[#30363d]">
                          <div className="text-[#8b949e] text-[10px] uppercase font-bold mb-1">Average Win Rate</div>
                          <div className="text-2xl font-bold text-white font-mono">68.4%</div>
                          <div className="text-[10px] text-[#58a6ff]">Slightly too high</div>
                       </div>
                       <div className="bg-[#0d1117] p-3 rounded border border-[#30363d]">
                          <div className="text-[#8b949e] text-[10px] uppercase font-bold mb-1">Burst Damage Window</div>
                          <div className="text-2xl font-bold text-white font-mono">4.1s</div>
                          <div className="text-[10px] text-[#3fb950]">Balanced</div>
                       </div>
                    </div>
                 </div>

                 <div className="w-[350px] bg-[#161b22] border border-[#30363d] rounded-lg p-5 flex flex-col">
                    <h3 className="text-white font-bold text-[14px] border-b border-[#30363d] pb-3 mb-4 flex items-center gap-2"><Network size={16} className="text-[#a371f7]"/> AI Balancing Suggestions</h3>
                    
                    <div className="flex-1 space-y-4">
                       <div className="bg-[#0a0a0a] border border-[#ff7b72]/30 p-3 rounded-lg relative overflow-hidden group hover:border-[#ff7b72]">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-[#ff7b72]/10 rounded-bl-full"></div>
                          <div className="text-[11px] text-[#ff7b72] font-bold uppercase mb-1">Reduce Base Damage</div>
                          <div className="text-[12px] text-[#c9d1d9] leading-relaxed mb-3">Damage is highly skewed. Reduce base from 150 to <span className="text-white font-bold bg-[#ff7b72]/20 px-1 rounded">125</span> and increase Cooldown by 1s.</div>
                          <button className="bg-[#21262d] border border-[#ff7b72] text-[#ff7b72] hover:bg-[#ff7b72] hover:text-black w-full py-1.5 rounded text-[11px] font-bold uppercase transition-colors">Apply Fix</button>
                       </div>

                       <div className="bg-[#0a0a0a] border border-[#58a6ff]/30 p-3 rounded-lg relative overflow-hidden group hover:border-[#58a6ff]">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-[#58a6ff]/10 rounded-bl-full"></div>
                          <div className="text-[11px] text-[#58a6ff] font-bold uppercase mb-1">Synergy Suggestion</div>
                          <div className="text-[12px] text-[#c9d1d9] leading-relaxed mb-3">Adding a "Stun" node here guarantees a true infinite combo. I suggest adding "Diminishing Returns" to CC duration.</div>
                          <button className="bg-[#21262d] border border-[#58a6ff] text-[#58a6ff] hover:bg-[#58a6ff] hover:text-black w-full py-1.5 rounded text-[11px] font-bold uppercase transition-colors">Add Logic Node</button>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
