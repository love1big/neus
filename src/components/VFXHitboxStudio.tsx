import React, { useState } from 'react';
import { 
    Play, Pause, SkipForward, SkipBack, Square, Activity, Bone, 
    Box, Flame, Sparkles, Wand2, Plus, Trash2, Cpu, Grid3x3, 
    Layers, Settings2, Target, Move, Maximize, Orbit, CheckCircle, BrainCircuit, Link2
} from 'lucide-react';

export default function VFXHitboxStudio({ setActiveTool }: { setActiveTool?: (tool: string) => void }) {
    const [selectedItem, setSelectedItem] = useState('hitbox_punch');
    const [currentFrame, setCurrentFrame] = useState(12);
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="flex flex-col h-full bg-[#050505] text-[#c9d1d9] font-sans selection:bg-[#58a6ff]/30">
            {/* Top Toolbar */}
            <div className="h-14 bg-[#0d1117] border-b border-[#30363d] flex items-center px-4 justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[#3fb950]">
                        <Activity size={18} />
                        <span className="font-bold text-[13px] uppercase tracking-wider">VFX & Frame Data Studio</span>
                    </div>
                </div>

                {/* Transport Controls */}
                <div className="flex items-center gap-2 bg-[#161b22] px-3 py-1.5 border border-[#30363d] rounded-md">
                    <button className="p-1.5 hover:bg-[#30363d] hover:text-white rounded text-[#8b949e]">
                        <SkipBack size={16} />
                    </button>
                    <button className="p-1.5 hover:bg-[#30363d] hover:text-[#58a6ff] rounded text-[#8b949e]" onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <Pause size={18}/> : <Play size={18} className="translate-x-[1px]" />}
                    </button>
                    <button className="p-1.5 hover:bg-[#30363d] hover:text-white rounded text-[#8b949e]">
                        <Square size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-[#30363d] hover:text-white rounded text-[#8b949e]">
                        <SkipForward size={16} />
                    </button>
                    <div className="w-[1px] h-4 bg-[#30363d] mx-2"></div>
                    <span className="text-[12px] font-mono w-16 text-center text-[#58a6ff]">Fr {currentFrame.toString().padStart(3, '0')}</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-[#0a0a0a] px-3 py-1.5 border border-[#3fb950]/30 rounded-md shadow-[0_0_10px_rgba(63,185,80,0.1)]">
                        <CheckCircle size={14} className="text-[#3fb950]" />
                        <span className="text-[10px] uppercase font-bold text-[#3fb950] tracking-widest">Offline Physics Engine: Active</span>
                    </div>
                    <button className="bg-[#bc8cff]/10 border border-[#bc8cff]/30 text-[#bc8cff] px-4 py-1.5 rounded-md text-[11px] font-bold uppercase hover:bg-[#bc8cff] hover:text-[#0a0a0a] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(188,140,255,0.2)]">
                        <BrainCircuit size={14} /> Local AI Analytics
                    </button>
                </div>
            </div>

            <div className="flex flex-1 min-h-0">
                {/* Left Hierarchy Panel */}
                <div className="w-64 bg-[#0d1117] border-r border-[#30363d] flex flex-col shrink-0">
                    <div className="h-10 px-4 border-b border-[#30363d] flex items-center justify-between shadow-sm">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#8b949e]">Timeline Hierarchy</span>
                        <div className="flex gap-1">
                            <button className="p-1 hover:bg-[#30363d] hover:text-white rounded text-[#8b949e]"><Plus size={14} /></button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                        {/* Bones */}
                        <div className="flex items-center justify-between px-2 py-1.5 bg-[#161b22] text-[#8b949e] rounded text-[11px] font-bold cursor-pointer hover:bg-[#21262d] group">
                            <div className="flex items-center gap-2"><Bone size={14} /> Character_Root_IK</div>
                            <button onClick={(e) => { e.stopPropagation(); setActiveTool?.('ControlRig'); }} className="opacity-0 group-hover:opacity-100 p-1 hover:text-[#c9d1d9]"><Link2 size={12}/></button>
                        </div>
                        <div className="flex items-center justify-between px-2 py-1.5 ml-4 bg-[#161b22] text-[#8b949e] rounded text-[11px] font-bold cursor-pointer hover:bg-[#21262d] group">
                            <div className="flex items-center gap-2"><Bone size={14} /> Hand_R</div>
                            <button onClick={(e) => { e.stopPropagation(); setActiveTool?.('ControlRig'); }} className="opacity-0 group-hover:opacity-100 p-1 hover:text-[#c9d1d9]"><Link2 size={12}/></button>
                        </div>
                        
                        {/* Attached Hitbox */}
                        <div 
                            className={`flex justify-between items-center px-2 py-2 ml-8 rounded text-[11px] cursor-pointer border ${selectedItem === 'hitbox_punch' ? 'bg-[#ff7b72]/10 border-[#ff7b72]/50 text-[#ff7b72]' : 'bg-[#0a0a0a] border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d]'}`}
                            onClick={() => setSelectedItem('hitbox_punch')}
                        >
                            <div className="flex items-center gap-2">
                                <Box size={14} /> HF_Punch_Heavy
                            </div>
                            <span className="text-[9px] font-mono bg-[#ff7b72]/20 px-1 py-0.5 rounded text-[#ff7b72]">Hitbox</span>
                        </div>

                        {/* Hurtbox */}
                        <div 
                            className={`flex justify-between items-center px-2 py-2 ml-4 mt-2 rounded text-[11px] cursor-pointer border ${selectedItem === 'hurtbox_torso' ? 'bg-[#3fb950]/10 border-[#3fb950]/50 text-[#3fb950]' : 'bg-[#0a0a0a] border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d]'}`}
                            onClick={() => setSelectedItem('hurtbox_torso')}
                        >
                            <div className="flex items-center gap-2">
                                <Box size={14} /> HB_Core_Torso
                            </div>
                            <span className="text-[9px] font-mono bg-[#3fb950]/20 px-1 py-0.5 rounded text-[#3fb950]">Hurtbox</span>
                        </div>

                        {/* VFX */}
                        <div className="flex items-center justify-between px-2 py-1.5 bg-[#161b22] text-[#8b949e] rounded text-[11px] font-bold cursor-pointer hover:bg-[#21262d] mt-2 group">
                            <div className="flex items-center gap-2"><Bone size={14} /> Weapon_Socket</div>
                            <button onClick={(e) => { e.stopPropagation(); setActiveTool?.('ControlRig'); }} className="opacity-0 group-hover:opacity-100 p-1 hover:text-[#c9d1d9]" title="Edit in ControlRig"><Link2 size={12}/></button>
                        </div>
                        <div 
                            className={`flex justify-between items-center px-2 py-2 ml-4 rounded text-[11px] cursor-pointer border group ${selectedItem === 'vfx_slash' ? 'bg-[#58a6ff]/10 border-[#58a6ff]/50 text-[#58a6ff]' : 'bg-[#0a0a0a] border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d]'}`}
                            onClick={() => setSelectedItem('vfx_slash')}
                        >
                            <div className="flex items-center gap-2">
                                <Flame size={14} /> NS_Sword_FlameTrail
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={(e) => { e.stopPropagation(); setActiveTool?.('Niagara'); }} className="opacity-0 group-hover:opacity-100 p-1 hover:text-white" title="Open in Niagara Editor"><Link2 size={12}/></button>
                                <span className={`text-[9px] font-mono px-1 py-0.5 rounded ${selectedItem === 'vfx_slash' ? 'bg-[#58a6ff]/20 text-[#58a6ff]' : 'bg-[#161b22] text-[#8b949e]'}`}>Niagara</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Central Canvas */}
                <div className="flex flex-col flex-1 border-r border-[#30363d] bg-[#0a0a0a] relative overflow-hidden">
                    {/* Viewport Toolbar */}
                    <div className="absolute top-4 left-4 flex gap-2 z-10 w-full pr-8">
                        <div className="bg-[#161b22]/90 border border-[#30363d] flex gap-1 rounded p-1 backdrop-blur-md">
                            <button className="p-1.5 hover:bg-[#30363d] hover:text-white rounded text-[#8b949e]"><Move size={16} /></button>
                            <button className="p-1.5 hover:bg-[#30363d] hover:text-white rounded text-[#8b949e]"><Orbit size={16} /></button>
                            <button className="p-1.5 hover:bg-[#30363d] hover:text-white rounded text-[#8b949e]"><Maximize size={16} /></button>
                        </div>
                        <div className="bg-[#161b22]/90 border border-[#30363d] flex gap-2 rounded px-3 py-1.5 items-center backdrop-blur-md text-[11px] text-[#c9d1d9] font-bold ml-auto">
                            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                                <input type="checkbox" defaultChecked className="accent-[#ff7b72] w-3 h-3"/> Show Hitboxes (Red)
                            </label>
                            <div className="w-[1px] h-3 bg-[#30363d] mx-1"></div>
                            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                                <input type="checkbox" defaultChecked className="accent-[#3fb950] w-3 h-3"/> Show Hurtboxes (Grn)
                            </label>
                            <div className="w-[1px] h-3 bg-[#30363d] mx-1"></div>
                            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                                <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-3 h-3"/> Show VFX
                            </label>
                        </div>
                    </div>

                    {/* Stage Rendering Mock */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(#161b22 1px, transparent 1px), linear-gradient(90deg, #161b22 1px, transparent 1px)', backgroundSize: '50px 50px', opacity: 0.3, transform: 'perspective(1000px) rotateX(60deg) scale(2)', transformOrigin: 'center 70%'}}></div>
                        
                        {/* 3D Character Mockup Overlay */}
                        <div className="relative w-64 h-96 mt-20 z-10 flex flex-col items-center">
                            {/* Hurtbox Body */}
                            <div className="absolute top-1/4 w-32 h-44 border-4 border-[#3fb950] bg-[#3fb950]/10 rounded-[30px] flex items-center justify-center shadow-[0_0_20px_rgba(63,185,80,0.2)]">
                                <span className="absolute top-[-20px] text-[#3fb950] text-[9px] font-mono font-bold bg-[#0d1117] px-1 rounded">HB_Core_Torso</span>
                            </div>
                            <div className="absolute top-[-10px] w-16 h-20 border-4 border-[#3fb950] bg-[#3fb950]/10 rounded-full"></div>
                            
                            {/* Punch Hand Hitbox */}
                            <div className="absolute top-1/4 -right-16 w-20 h-20 border-4 border-[#ff7b72] bg-[#ff7b72]/30 rounded flex items-center justify-center transform rotate-12 shadow-[0_0_30px_rgba(255,123,114,0.4)] z-20">
                                <span className="absolute bottom-[-20px] text-[#ff7b72] text-[9px] font-mono font-bold bg-[#0d1117] px-1 rounded whitespace-nowrap">HF_Punch_Heavy</span>
                            </div>

                            {/* Flame VFX Vector Mockup */}
                            <svg className="absolute top-1/4 -right-24 w-40 h-40 overflow-visible pointer-events-none -z-10" viewBox="0 0 100 100">
                                <path d="M 10 50 Q 50 10 90 20 T 120 70" fill="none" stroke="#e3b341" strokeWidth="4" className="opacity-80 drop-shadow-[0_0_8px_#e3b341]"/>
                                <path d="M 20 60 Q 60 20 80 40 T 110 80" fill="none" stroke="#f85149" strokeWidth="3" className="opacity-60 drop-shadow-[0_0_8px_#f85149]"/>
                                <circle cx="90" cy="20" r="3" fill="#e3b341" className="animate-ping"/>
                                <circle cx="110" cy="80" r="2" fill="#f85149" />
                                <circle cx="120" cy="70" r="4" fill="#e3b341" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Right Properties Panel */}
                <div className="w-[320px] bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                    <div className="h-10 px-4 border-b border-[#30363d] bg-[#0d1117] flex items-center shadow-sm sticky top-0 z-20">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-white flex items-center gap-2">
                            <Settings2 size={14} className="text-[#8b949e]" /> Properties Inspector
                        </span>
                    </div>

                    {selectedItem === 'hitbox_punch' && (
                        <div className="p-5 flex flex-col gap-6">
                            <div className="space-y-4">
                                <h3 className="text-[#ff7b72] text-[12px] uppercase font-bold tracking-widest border-b border-[#ff7b72]/30 pb-2 flex items-center gap-2">
                                    <Target size={14}/> Deterministic Hitbox
                                </h3>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] text-[#8b949e] font-bold">Priority Layer</label>
                                        <select className="bg-[#0a0a0a] border border-[#30363d] text-white p-2 rounded text-[11px] outline-none">
                                            <option>1 (Heavy Normal)</option>
                                            <option>0 (Light Normal)</option>
                                            <option>2 (Special Move)</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] text-[#8b949e] font-bold">Element Type</label>
                                        <select className="bg-[#0a0a0a] border border-[#30363d] text-white p-2 rounded text-[11px] outline-none">
                                            <option>Blunt_Impact</option>
                                            <option>Slash</option>
                                            <option>Fire_Magic</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-[#30363d]">
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="text-[#8b949e] font-bold">Damage (Base)</span>
                                        <input type="number" defaultValue={85} className="w-16 bg-[#0a0a0a] border border-[#30363d] text-white px-2 py-1 rounded text-right font-mono" />
                                    </div>
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="text-[#8b949e] font-bold">Hitstun Frames</span>
                                        <input type="number" defaultValue={22} className="w-16 bg-[#0a0a0a] border border-[#30363d] text-white px-2 py-1 rounded text-right font-mono" />
                                    </div>
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="text-[#8b949e] font-bold">Blockstun Frames</span>
                                        <input type="number" defaultValue={14} className="w-16 bg-[#0a0a0a] border border-[#30363d] text-[#ff7b72] px-2 py-1 rounded text-right font-mono" />
                                    </div>
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="text-[#8b949e] font-bold">Pushback on Hit (Units)</span>
                                        <input type="number" defaultValue={1.5} className="w-16 bg-[#0a0a0a] border border-[#30363d] text-white px-2 py-1 rounded text-right font-mono" />
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-[#30363d]">
                                    <label className="flex items-center gap-2 cursor-pointer bg-[#0a0a0a] px-3 py-2 rounded border border-[#30363d]">
                                        <input type="checkbox" className="accent-[#ff7b72]"/> <span className="text-[11px] text-[#c9d1d9] font-bold">Armor Breaker</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer bg-[#0a0a0a] px-3 py-2 rounded border border-[#30363d]">
                                        <input type="checkbox" className="accent-[#ff7b72]"/> <span className="text-[11px] text-[#c9d1d9] font-bold">Unblockable</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer bg-[#0a0a0a] px-3 py-2 rounded border border-[#30363d]">
                                        <input type="checkbox" defaultChecked className="accent-[#ff7b72]"/> <span className="text-[11px] text-[#c9d1d9] font-bold">VFX on Block (Sparks)</span>
                                    </label>
                                </div>
                            </div>

                            <div className="bg-[#bc8cff]/5 border border-[#bc8cff]/20 rounded-lg p-4 mt-auto">
                                <h4 className="text-[#bc8cff] text-[10px] uppercase font-bold tracking-widest mb-3 flex items-center gap-2"><BrainCircuit size={12}/> Offline AI Analytics</h4>
                                <div className="text-[11px] text-[#c9d1d9] leading-relaxed mb-3">
                                    Simulating match-up frames against standard roster characters. Attack is <span className="text-[#ff7b72] font-bold font-mono">-6 on Block</span> (punishable by light attacks).
                                </div>
                                <button className="w-full bg-[#bc8cff] text-[#0a0a0a] hover:bg-[#d2a8ff] transition-colors py-2 rounded text-[11px] font-bold uppercase tracking-wide flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(188,140,255,0.3)]">
                                    <Wand2 size={14}/> Auto-Balance (Make -2 OB)
                                </button>
                            </div>
                        </div>
                    )}

                    {selectedItem === 'vfx_slash' && (
                        <div className="p-5 flex flex-col gap-6">
                            <div className="space-y-4">
                                <h3 className="text-[#58a6ff] text-[12px] uppercase font-bold tracking-widest border-b border-[#58a6ff]/30 pb-2 flex items-center gap-2">
                                    <Flame size={14}/> Niagara Emitter Modifiers
                                </h3>
                                
                                <div className="space-y-3">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] text-[#8b949e] font-bold flex justify-between"><span>Spawn Rate (Count/s)</span> <span className="text-white font-mono">1500</span></label>
                                        <input type="range" className="accent-[#58a6ff]" defaultValue="1500" min="0" max="5000" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] text-[#8b949e] font-bold flex justify-between"><span>Lifetime (Min/Max)</span> <span className="text-white font-mono">0.2 - 0.8s</span></label>
                                        <div className="flex gap-2">
                                            <input type="number" defaultValue={0.2} className="w-full bg-[#0a0a0a] border border-[#30363d] text-white px-2 py-1 rounded text-center font-mono text-[10px]" />
                                            <input type="number" defaultValue={0.8} className="w-full bg-[#0a0a0a] border border-[#30363d] text-white px-2 py-1 rounded text-center font-mono text-[10px]" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] text-[#8b949e] font-bold flex justify-between"><span>Cone Velocity / Angle</span> <span className="text-white font-mono">45°</span></label>
                                        <input type="range" className="accent-[#58a6ff]" defaultValue="45" min="0" max="180" />
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-[#30363d]">
                                    <label className="flex items-center gap-2 cursor-pointer bg-[#0a0a0a] px-3 py-2 rounded border border-[#30363d]">
                                        <input type="checkbox" defaultChecked className="accent-[#58a6ff]"/> <span className="text-[11px] text-[#c9d1d9] font-bold">Curl Noise Force</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer bg-[#0a0a0a] px-3 py-2 rounded border border-[#30363d]">
                                        <input type="checkbox" defaultChecked className="accent-[#58a6ff]"/> <span className="text-[11px] text-[#c9d1d9] font-bold">Scale Color over Life</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer bg-[#0a0a0a] px-3 py-2 rounded border border-[#30363d]">
                                        <input type="checkbox" className="accent-[#58a6ff]"/> <span className="text-[11px] text-[#c9d1d9] font-bold">GPU Hardware Instancing</span>
                                    </label>
                                </div>
                            </div>

                            <div className="bg-[#bc8cff]/5 border border-[#bc8cff]/20 rounded-lg p-4 mt-auto">
                                <h4 className="text-[#bc8cff] text-[10px] uppercase font-bold tracking-widest mb-3 flex items-center gap-2"><Sparkles size={12}/> Offline AI Physics Solver</h4>
                                <div className="text-[11px] text-[#c9d1d9] leading-relaxed mb-3">
                                    Predictive fluid dynamics mesh. AI interpolates the exact arc of the sword swing to pre-bake a 3D vector field for zero-latency particle swirling.
                                </div>
                                <button className="w-full bg-[#161b22] border border-[#bc8cff] text-[#bc8cff] hover:bg-[#bc8cff] hover:text-[#0a0a0a] transition-colors py-2 rounded text-[11px] font-bold uppercase tracking-wide flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(188,140,255,0.2)]">
                                    <Cpu size={14}/> Pre-bake AI Vector Field
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Timeline Dopesheet */}
            <div className="h-64 bg-[#0d1117] border-t border-[#30363d] flex flex-col shrink-0 z-20">
                {/* Timeline Header */}
                <div className="h-8 bg-[#161b22] border-b border-[#30363d] flex text-[10px] font-mono text-[#8b949e]">
                    <div className="w-64 border-r border-[#30363d] flex items-center px-4 font-bold tracking-widest text-[#c9d1d9] bg-[#0d1117]">TRACKS</div>
                    <div className="flex-1 flex overflow-hidden relative" style={{background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M 19 0 L 19 20\' stroke=\'%2330363d\' stroke-width=\'1\' fill=\'none\'/%3E%3C/svg%3E")'}}>
                        {/* Frame Numbers */}
                        <div className="flex items-center absolute inset-0">
                            {[...Array(30)].map((_, i) => (
                                <div key={i} className="min-w-[20px] text-center">{i * 2}</div>
                            ))}
                        </div>
                        {/* Playhead */}
                        <div className="absolute top-0 bottom-0 w-[1px] bg-[#58a6ff] z-30 pointer-events-none" style={{left: `${currentFrame * 10}px`}}>
                            <div className="absolute top-0 -left-1.5 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent border-t-[#58a6ff]"></div>
                        </div>
                    </div>
                </div>

                {/* Timeline Tracks */}
                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col pt-1 pb-4">
                    
                    {/* Character Animation Track */}
                    <div className="flex items-center h-8 hover:bg-[#161b22] group">
                        <div className="w-64 border-r border-[#30363d] px-4 flex items-center gap-2 text-[11px] text-[#c9d1d9] font-bold">
                            <Bone size={12} className="text-[#8b949e]"/> AS_Heavy_Punch_Anim
                        </div>
                        <div className="flex-1 relative h-full flex items-center">
                            <div className="absolute left-[0px] w-[500px] h-4 bg-[#8b949e]/20 border border-[#8b949e]/50 rounded-[4px] mx-1"></div>
                            {/* Keyframes */}
                            <div className="absolute left-[0px] w-2 h-2 bg-[#c9d1d9] rotate-45 ml-1.5 cursor-pointer"></div>
                            <div className="absolute left-[120px] w-2 h-2 bg-[#c9d1d9] rotate-45 ml-1.5 cursor-pointer"></div>
                            <div className="absolute left-[400px] w-2 h-2 bg-[#c9d1d9] rotate-45 ml-1.5 cursor-pointer"></div>
                        </div>
                    </div>

                    {/* Hitboxes Track */}
                    <div className="flex items-center h-8 hover:bg-[#161b22] group mt-1">
                        <div className="w-64 border-r border-[#30363d] px-4 flex items-center gap-2 text-[11px] text-[#ff7b72] font-bold">
                            <Box size={12}/> HF_Punch_Heavy {selectedItem === 'hitbox_punch' && <div className="w-1.5 h-1.5 rounded-full bg-[#ff7b72] ml-auto animate-pulse"></div>}
                        </div>
                        <div className="flex-1 relative h-full flex items-center">
                            {/* Hitbox Active Window */}
                            <div className="absolute left-[120px] w-[60px] h-4 bg-[#ff7b72]/30 border border-[#ff7b72] border-x-4 border-y rounded-[2px] mx-1 cursor-pointer flex items-center justify-center shadow-[0_0_10px_rgba(255,123,114,0.3)]">
                                <span className="text-[8px] font-mono text-[#ff7b72] font-bold">ACTIVE (6f)</span>
                            </div>
                        </div>
                    </div>

                    {/* Hurtboxes Track */}
                    <div className="flex items-center h-8 hover:bg-[#161b22] group">
                        <div className="w-64 border-r border-[#30363d] px-4 flex items-center gap-2 text-[11px] text-[#3fb950] font-bold">
                            <Box size={12}/> HB_Core_Torso
                        </div>
                        <div className="flex-1 relative h-full flex items-center">
                            <div className="absolute left-[0px] w-[500px] h-4 bg-[#3fb950]/20 border border-[#3fb950]/50 rounded-[4px] mx-1 opacity-50"></div>
                        </div>
                    </div>

                    {/* VFX Track */}
                    <div className="flex items-center h-8 hover:bg-[#161b22] group mt-1">
                        <div className="w-64 border-r border-[#30363d] px-4 flex items-center gap-2 text-[11px] text-[#58a6ff] font-bold">
                            <Flame size={12}/> NS_Sword_FlameTrail
                        </div>
                        <div className="flex-1 relative h-full flex items-center">
                            <div className="absolute left-[110px] w-[180px] h-4 bg-[#58a6ff]/20 border border-[#58a6ff]/50 rounded-[4px] mx-1 flex items-center overflow-hidden">
                                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#58a6ff] to-transparent block"></div>
                            </div>
                        </div>
                    </div>

                    {/* Sound FX Track */}
                    <div className="flex items-center h-8 hover:bg-[#161b22] group">
                        <div className="w-64 border-r border-[#30363d] px-4 flex items-center gap-2 text-[11px] text-[#e3b341] font-bold">
                            <Activity size={12}/> SFX_HeavyWhoosh
                        </div>
                        <div className="flex-1 relative h-full flex items-center">
                            <div className="absolute left-[105px] w-2 h-4 bg-[#e3b341] rounded-[2px] mx-1"></div>
                            <svg className="absolute left-[110px] h-6 w-20 text-[#e3b341] opacity-60" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <path d="M 0 50 Q 10 20 20 50 T 40 50 T 60 20 T 80 50 T 100 50" fill="none" stroke="currentColor" strokeWidth="6" />
                            </svg>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
