import React, { useState, useEffect } from 'react';
import { 
    Play, Pause, SkipForward, SkipBack, Square, Activity, Bone, 
    Box, Flame, Sparkles, Wand2, Plus, Trash2, Cpu, Grid3x3, 
    Layers, Settings2, Target, Move, Maximize, Orbit, CheckCircle, BrainCircuit, Link2,
    ShieldAlert, Swords, Camera, Eye, Scissors, Zap, Shield, Radar, Workflow, Database, Save, RotateCcw
} from 'lucide-react';

export default function VFXHitboxStudio({ setActiveTool }: { setActiveTool?: (tool: string) => void }) {
    const [selectedItem, setSelectedItem] = useState('hitbox_punch');
    const [currentFrame, setCurrentFrame] = useState(12);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTab, setActiveTab] = useState('inspector'); // inspector, AI_analytics, frame_data
    
    // Mock save states
    const [isBaking, setIsBaking] = useState<'idle'|'baking'|'done'>('idle');
    const [isExporting, setIsExporting] = useState<'idle'|'exporting'|'done'>('idle');

    const handleBake = () => {
        setIsBaking('baking');
        setTimeout(() => setIsBaking('done'), 1500);
        setTimeout(() => setIsBaking('idle'), 3500);
    };

    const handleExport = () => {
        setIsExporting('exporting');
        setTimeout(() => setIsExporting('done'), 1000);
        setTimeout(() => setIsExporting('idle'), 3000);
    };

    // Simulate playback
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentFrame(prev => (prev >= 60 ? 0 : prev + 1));
            }, 1000 / 60); // 60fps simulation
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

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
                <div className="flex items-center gap-2 bg-[#161b22] px-3 py-1.5 border border-[#30363d] rounded-md shadow-inner">
                    <button className="p-1 hover:bg-[#30363d] hover:text-white rounded text-[#8b949e] transition-colors" onClick={() => setCurrentFrame(0)}>
                        <SkipBack size={14} />
                    </button>
                    <button className="p-1 hover:bg-[#30363d] hover:text-white rounded text-[#8b949e] transition-colors" onClick={() => setCurrentFrame(p => Math.max(0, p - 1))}>
                        <SkipBack size={14} className="scale-75" />
                    </button>
                    <button className="p-1.5 bg-[#238636]/10 hover:bg-[#238636]/20 border border-[#238636]/30 text-[#3fb950] rounded transition-all" onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <Pause size={16}/> : <Play size={16} className="translate-x-[1px]" />}
                    </button>
                    <button className="p-1 hover:bg-[#30363d] hover:text-[#f85149] rounded text-[#8b949e] transition-colors" onClick={() => {setIsPlaying(false); setCurrentFrame(0);}}>
                        <Square size={12} />
                    </button>
                    <button className="p-1 hover:bg-[#30363d] hover:text-white rounded text-[#8b949e] transition-colors" onClick={() => setCurrentFrame(p => Math.min(60, p + 1))}>
                        <SkipForward size={14} className="scale-75" />
                    </button>
                    <button className="p-1 hover:bg-[#30363d] hover:text-white rounded text-[#8b949e] transition-colors" onClick={() => setCurrentFrame(60)}>
                        <SkipForward size={14} />
                    </button>
                    <div className="w-[1px] h-4 bg-[#30363d] mx-2"></div>
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-[12px] font-mono leading-none text-[#58a6ff] font-bold">FR {currentFrame.toString().padStart(3, '0')}</span>
                        <span className="text-[8px] font-mono leading-none text-[#8b949e] mt-0.5">{(currentFrame * (1000/60)).toFixed(1)}ms</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-[#0a0a0a] px-3 py-1.5 border border-[#3fb950]/30 rounded-md shadow-[0_0_10px_rgba(63,185,80,0.1)]">
                        <Database size={14} className="text-[#3fb950]" />
                        <span className="text-[10px] uppercase font-bold text-[#3fb950] tracking-widest">Rollback Sync: OK</span>
                    </div>
                    <button className="bg-[#bc8cff]/10 border border-[#bc8cff]/30 text-[#bc8cff] px-4 py-1.5 rounded-md text-[11px] font-bold uppercase hover:bg-[#bc8cff] hover:text-[#0a0a0a] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(188,140,255,0.2)]">
                        <BrainCircuit size={14} /> Frame AI Solver
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
                        <div className="flex items-center justify-between px-2 py-1 mt-2 mb-1">
                           <span className="text-[9px] font-bold text-[#8b949e] uppercase tracking-wider">Collision Volumes</span>
                           <div className="h-px bg-[#30363d] flex-1 ml-2"></div>
                        </div>

                        <div 
                            className={`flex justify-between items-center px-2 py-2 ml-2 rounded text-[11px] cursor-pointer border transition-colors ${selectedItem === 'hitbox_punch' ? 'bg-[#ff7b72]/10 border-[#ff7b72]/50 text-[#ff7b72]' : 'bg-[#0a0a0a] border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] border-l-2 border-l-[#ff7b72]/50'}`}
                            onClick={() => setSelectedItem('hitbox_punch')}
                        >
                            <div className="flex items-center gap-2">
                                <Swords size={12} className={selectedItem === 'hitbox_punch' ? 'text-[#ff7b72]' : 'text-[#8b949e]'} /> HF_Punch_Heavy
                            </div>
                            <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-[#ff7b72]/20 text-[#ff7b72]">ATK</span>
                        </div>

                        {/* Hurtbox */}
                        <div 
                            className={`flex justify-between items-center px-2 py-2 ml-2 mt-1 rounded text-[11px] cursor-pointer border transition-colors ${selectedItem === 'hurtbox_torso' ? 'bg-[#3fb950]/10 border-[#3fb950]/50 text-[#3fb950]' : 'bg-[#0a0a0a] border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] border-l-2 border-l-[#3fb950]/50'}`}
                            onClick={() => setSelectedItem('hurtbox_torso')}
                        >
                            <div className="flex items-center gap-2">
                                <Shield size={12} className={selectedItem === 'hurtbox_torso' ? 'text-[#3fb950]' : 'text-[#8b949e]'} /> HB_Core_Torso
                            </div>
                            <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-[#3fb950]/20 text-[#3fb950]">DEF</span>
                        </div>

                        {/* Complex States */}
                        <div className="flex items-center justify-between px-2 py-1 mt-2 mb-1">
                           <span className="text-[9px] font-bold text-[#8b949e] uppercase tracking-wider">State Modifiers</span>
                           <div className="h-px bg-[#30363d] flex-1 ml-2"></div>
                        </div>

                        <div 
                            className={`flex justify-between items-center px-2 py-2 ml-2 rounded text-[11px] cursor-pointer border transition-colors ${selectedItem === 'state_iframe' ? 'bg-[#f0883e]/10 border-[#f0883e]/50 text-[#f0883e]' : 'bg-[#0a0a0a] border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] border-l-2 border-l-[#f0883e]/50'}`}
                            onClick={() => setSelectedItem('state_iframe')}
                        >
                            <div className="flex items-center gap-2">
                                <ShieldAlert size={12} className={selectedItem === 'state_iframe' ? 'text-[#f0883e]' : 'text-[#8b949e]'} /> Upper_Body_Invuln
                            </div>
                            <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-[#f0883e]/20 text-[#f0883e]">IFRAME</span>
                        </div>

                        <div 
                            className={`flex justify-between items-center px-2 py-2 ml-2 mt-1 rounded text-[11px] cursor-pointer border transition-colors ${selectedItem === 'cancel_window' ? 'bg-[#e3b341]/10 border-[#e3b341]/50 text-[#e3b341]' : 'bg-[#0a0a0a] border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] border-l-2 border-l-[#e3b341]/50'}`}
                            onClick={() => setSelectedItem('cancel_window')}
                        >
                            <div className="flex items-center gap-2">
                                <Scissors size={12} className={selectedItem === 'cancel_window' ? 'text-[#e3b341]' : 'text-[#8b949e]'} /> Special_Cancel_Win
                            </div>
                            <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-[#e3b341]/20 text-[#e3b341]">CANCEL</span>
                        </div>

                        {/* VFX */}
                        <div className="flex items-center justify-between px-2 py-1 mt-2 mb-1">
                           <span className="text-[9px] font-bold text-[#8b949e] uppercase tracking-wider">Emitters & Polish</span>
                           <div className="h-px bg-[#30363d] flex-1 ml-2"></div>
                        </div>
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
                    <div className="absolute top-2 left-2 flex gap-2 z-10 w-full pr-4 pb-2 border-b border-[#30363d]/50 bg-gradient-to-b from-[#0a0a0a] to-transparent">
                        <div className="bg-[#161b22]/90 border border-[#30363d] flex gap-0.5 rounded p-0.5 backdrop-blur-md shadow-lg">
                            <button className="p-1.5 hover:bg-[#30363d] hover:text-white rounded text-[#8b949e] group relative"><Move size={14} />
                              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#0d1117] text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap border border-[#30363d]">Translate (W)</span>
                            </button>
                            <button className="p-1.5 hover:bg-[#30363d] hover:text-white rounded text-[#8b949e] group relative"><Orbit size={14} />
                              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#0d1117] text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap border border-[#30363d]">Rotate (E)</span>
                            </button>
                            <button className="p-1.5 hover:bg-[#30363d] hover:text-white rounded text-[#8b949e] group relative"><Maximize size={14} />
                              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#0d1117] text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap border border-[#30363d]">Scale (R)</span>
                            </button>
                            <div className="w-px h-4 bg-[#30363d] self-center mx-1"></div>
                            <button className="p-1.5 hover:bg-[#30363d] hover:text-[#58a6ff] rounded text-[#8b949e] group relative"><Grid3x3 size={14} />
                              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#0d1117] text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap border border-[#30363d]">Toggle Grid</span>
                            </button>
                            <button className="p-1.5 hover:bg-[#30363d] hover:text-white rounded text-[#8b949e]"><Camera size={14} /></button>
                        </div>
                        <div className="bg-[#161b22]/90 border border-[#30363d] flex gap-3 rounded px-3 py-1 items-center backdrop-blur-md text-[10px] text-[#8b949e] font-bold font-mono ml-auto shadow-lg uppercase tracking-wider">
                            <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                                <input type="checkbox" defaultChecked className="accent-[#ff7b72] w-2.5 h-2.5"/> Hitboxes
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                                <input type="checkbox" defaultChecked className="accent-[#3fb950] w-2.5 h-2.5"/> Hurtboxes
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#f0883e] transition-colors">
                                <input type="checkbox" defaultChecked className="accent-[#f0883e] w-2.5 h-2.5"/> I-Frames
                            </label>
                            <div className="w-[1px] h-3 bg-[#30363d]"></div>
                            <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                                <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-2.5 h-2.5"/> Emitters
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                                <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-2.5 h-2.5"/> Trajectories
                            </label>
                        </div>
                    </div>

                    {/* Left Data Overlay (e.g. Frame Trajectory Info) */}
                    <div className="absolute top-16 left-4 z-10 font-mono text-[9px] pointer-events-none drop-shadow-md">
                        <div className="text-[#c9d1d9] bg-[#0d1117]/80 border border-[#30363d] rounded p-2 backdrop-blur-sm">
                            <div className="text-[#58a6ff] mb-1 uppercase font-bold tracking-widest border-b border-[#30363d]/50 pb-1">Solver Metrics</div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                <span className="text-[#8b949e]">Velocity:</span> <span>[12.4, 0.0, 5.2]</span>
                                <span className="text-[#8b949e]">Bone Root:</span> <span>0.045m/f</span>
                                <span className="text-[#8b949e]">Momentum:</span> <span className="text-[#3fb950]">Maintained</span>
                                <span className="text-[#8b949e]">Collision:</span> <span className="text-[#ff7b72]">Anticipated (2f)</span>
                            </div>
                        </div>
                    </div>

                    {/* Stage Rendering Mock */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none perspective-[1200px]">
                        <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(rgba(88,166,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(88,166,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 1, transform: 'rotateX(75deg) scale(2) translateY(-100px)', transformOrigin: 'center 70%'}}>
                           {/* X Z axes */}
                           <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#58a6ff]/30"></div>
                           <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#f85149]/30"></div>
                        </div>
                        
                        {/* 3D Character Mockup Overlay */}
                        <div className="relative w-64 h-96 mt-10 z-10 flex flex-col items-center" style={{ transform: 'rotateX(0deg)'}}>
                            
                            {/* Motion Trail (Onion Skin) behind character */}
                            <div className="absolute top-1/4 -left-12 w-32 h-44 border-2 border-[#8b949e] border-dashed rounded-[30px] opacity-10"></div>
                            <div className="absolute top-1/4 -left-6 w-32 h-44 border-2 border-[#8b949e] border-dashed rounded-[30px] opacity-20"></div>
                            
                            {/* Hurtbox Body - Advanced Capsule */}
                            {['hurtbox_torso', 'state_iframe'].includes(selectedItem) && (
                                <>
                                <div className={`absolute top-1/4 w-32 h-44 border-[3px] rounded-[30px] flex justify-center shadow-[0_0_20px_inset] transition-all mix-blend-screen ${selectedItem === 'state_iframe' ? 'border-[#f0883e] bg-[#f0883e]/10 shadow-[#f0883e]/20' : 'border-[#3fb950] bg-[#3fb950]/10 shadow-[#3fb950]/20'}`}>
                                    {/* Sub-divisions for capsule */}
                                    <div className={`absolute top-10 left-0 right-0 h-px ${selectedItem === 'state_iframe' ? 'bg-[#f0883e]/40' : 'bg-[#3fb950]/40'}`}></div>
                                    <div className={`absolute top-20 left-0 right-0 h-px ${selectedItem === 'state_iframe' ? 'bg-[#f0883e]/40' : 'bg-[#3fb950]/40'}`}></div>
                                    <div className={`absolute bottom-10 left-0 right-0 h-px ${selectedItem === 'state_iframe' ? 'bg-[#f0883e]/40' : 'bg-[#3fb950]/40'}`}></div>
                                    <span className={`absolute -top-6 text-[9px] font-mono font-bold bg-[#0d1117] border px-1 rounded shadow-lg ${selectedItem === 'state_iframe' ? 'text-[#f0883e] border-[#f0883e]/50' : 'text-[#3fb950] border-[#3fb950]/50'}`}>
                                        {selectedItem === 'state_iframe' ? 'INVULN_UPPER' : 'HB_Core_Torso'}
                                    </span>
                                </div>
                                <div className={`absolute top-[40px] w-16 h-20 border-[3px] rounded-full mix-blend-screen ${selectedItem === 'state_iframe' ? 'border-[#f0883e] bg-[#f0883e]/10' : 'border-[#3fb950] bg-[#3fb950]/10'}`}></div>
                                </>
                            )}
                            
                            {/* Punch Hand Hitbox - Sphere/Box hybrid */}
                            {(selectedItem === 'hitbox_punch' || selectedItem === 'cancel_window') && (
                                <div className="absolute top-[30%] -right-20 z-20" style={{ transform: 'rotate(15deg)' }}>
                                    <div className={`relative w-24 h-24 border-[3px] flex items-center justify-center transform transition-colors bg-opacity-20 shadow-[0_0_30px_inset] mix-blend-screen overflow-visible
                                        ${currentFrame >= 12 && currentFrame <= 18 ? 'border-[#ff7b72] bg-[#ff7b72]' : 'border-[#ff7b72]/40 bg-transparent'}
                                        ${selectedItem === 'cancel_window' ? 'border-dashed border-[#e3b341] border-[4px] bg-[#e3b341]/10' : ''}`}>
                                        
                                        {/* Trajectory Vector Arrow */}
                                        <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-16 h-[2px] bg-[#ff7b72]">
                                            <div className="absolute -right-2 -top-[3px] w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[8px] border-l-[#ff7b72]"></div>
                                        </div>

                                        <span className={`absolute -bottom-6 text-[9px] font-mono font-bold bg-[#0d1117] px-1 rounded whitespace-nowrap border z-30 shadow-lg
                                            ${selectedItem === 'cancel_window' ? 'text-[#e3b341] border-[#e3b341]/50' : 'text-[#ff7b72] border-[#ff7b72]/50'}`}>
                                            {selectedItem === 'cancel_window' ? 'CANCEL_WINDOW_ACTIVE' : 'HF_Punch_Heavy'}
                                        </span>
                                        {/* Center root point */}
                                        <div className="w-1 h-1 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            )}

                            {/* Flame VFX Vector Mockup - AI Flow Field Overlay */}
                            {selectedItem === 'vfx_slash' && (
                                <svg className="absolute top-[25%] -right-32 w-56 h-48 overflow-visible pointer-events-none z-10" viewBox="0 0 100 100">
                                    <defs>
                                        <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
                                            <stop offset="0%" stopColor="#f85149" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#f85149" stopOpacity="0" />
                                        </radialGradient>
                                        <filter id="blur">
                                            <feGaussianBlur stdDeviation="2"/>
                                        </filter>
                                    </defs>
                                    
                                    {/* AI Flow Field Vector lines (Grid of tiny arrows) */}
                                    <g stroke="#bc8cff" strokeWidth="0.3" className="opacity-40 font-mono">
                                        <line x1="10" y1="20" x2="15" y2="18"/><line x1="20" y1="30" x2="26" y2="25"/><line x1="30" y1="40" x2="38" y2="35"/>
                                        <line x1="40" y1="50" x2="50" y2="40"/><line x1="50" y1="60" x2="62" y2="48"/><line x1="60" y1="70" x2="75" y2="55"/>
                                        <line x1="70" y1="80" x2="88" y2="62"/><line x1="80" y1="90" x2="100" y2="70"/>
                                    </g>

                                    {/* Core VFX Ribbon */}
                                    <path d="M 0 60 Q 40 20 80 15 T 120 50" fill="none" stroke="#e3b341" strokeWidth="6" strokeLinecap="round" className="drop-shadow-[0_0_10px_#e3b341]" filter="url(#blur)"/>
                                    <path d="M 10 70 Q 50 30 90 25 T 130 60" fill="none" stroke="#f85149" strokeWidth="4" strokeLinecap="round" className="drop-shadow-[0_0_12px_#f85149]" filter="url(#blur)"/>
                                    <path d="M 0 60 Q 40 20 80 15 T 120 50" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
                                    
                                    {/* Particles */}
                                    <circle cx="85" cy="18" r="1.5" fill="#ffffff" className="animate-pulse drop-shadow-[0_0_2px_#ffffff]"/>
                                    <circle cx="100" cy="40" r="2" fill="#e3b341" className="animate-ping"/>
                                    <circle cx="115" cy="55" r="1.5" fill="#f85149" />
                                    <circle cx="95" cy="30" r="2.5" fill="#e3b341" opacity="0.6"/>
                                </svg>
                            )}
                </div>

                {/* Right Properties Panel */}
                <div className="w-[360px] bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                    {/* Panel Tabs */}
                    <div className="flex bg-[#0d1117] border-b border-[#30363d] shrink-0 sticky top-0 z-20">
                        <button 
                            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 flex flex-col items-center gap-1 ${activeTab === 'inspector' ? 'border-[#58a6ff] text-white bg-[#161b22]' : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#161b22]/50'}`}
                            onClick={() => setActiveTab('inspector')}
                        >
                            <Settings2 size={14}/> Inspector
                        </button>
                        <button 
                            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 flex flex-col items-center gap-1 ${activeTab === 'frame_data' ? 'border-[#e3b341] text-white bg-[#161b22]' : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#161b22]/50'}`}
                            onClick={() => setActiveTab('frame_data')}
                        >
                            <Database size={14}/> Frame Data
                        </button>
                        <button 
                            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 flex flex-col items-center gap-1 ${activeTab === 'AI_analytics' ? 'border-[#bc8cff] text-white bg-[#161b22]' : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#161b22]/50'}`}
                            onClick={() => setActiveTab('AI_analytics')}
                        >
                            <Radar size={14}/> Analytics
                        </button>
                    </div>

                    {activeTab === 'inspector' && selectedItem === 'hitbox_punch' && (
                        <div className="p-4 flex flex-col gap-6 animate-in fade-in">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-[#30363d] pb-2">
                                    <h3 className="text-[#ff7b72] text-[12px] uppercase font-bold tracking-widest flex items-center gap-2">
                                        <Target size={14}/> Spatial Data
                                    </h3>
                                    <span className="text-[9px] font-mono bg-[#ff7b72]/20 text-[#ff7b72] px-1 py-0.5 rounded border border-[#ff7b72]/30">ID: ATK_04</span>
                                </div>
                                
                                <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 grid grid-cols-3 gap-2">
                                    <div className="flex flex-col"><span className="text-[9px] text-[#8b949e] font-bold">Shape</span><span className="text-[11px] font-mono text-white">Capsule</span></div>
                                    <div className="flex flex-col"><span className="text-[9px] text-[#8b949e] font-bold">Bone Parent</span><span className="text-[11px] font-mono text-[#58a6ff]">Hand_R</span></div>
                                    <div className="flex flex-col"><span className="text-[9px] text-[#8b949e] font-bold">Interpolation</span><span className="text-[11px] font-mono text-white">Smooth</span></div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-mono">
                                        <span className="text-[#8b949e]">Local Offset:</span>
                                        <span className="text-[#c9d1d9]">[14.2, 5.0, 0.0]</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-mono">
                                        <span className="text-[#8b949e]">Radius:</span>
                                        <span className="text-[#c9d1d9]">12.5 cm</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-mono">
                                        <span className="text-[#8b949e]">Half-Height:</span>
                                        <span className="text-[#c9d1d9]">8.0 cm</span>
                                    </div>
                                </div>

                                <h3 className="text-[#ff7b72] text-[12px] uppercase font-bold tracking-widest border-b border-[#30363d] pb-2 mt-4 flex items-center gap-2">
                                    <Activity size={14}/> Impact Properties
                                </h3>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[9px] text-[#8b949e] font-bold uppercase tracking-wider">Priority Layer</label>
                                        <select className="bg-[#0a0a0a] border border-[#30363d] text-white p-1.5 rounded text-[11px] outline-none hover:border-[#58a6ff] transition-colors focus:border-[#58a6ff]">
                                            <option>1 (Heavy Normal)</option>
                                            <option>0 (Light Normal)</option>
                                            <option>2 (Special Move)</option>
                                            <option>3 (Super Art)</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[9px] text-[#8b949e] font-bold uppercase tracking-wider">Element Type</label>
                                        <select className="bg-[#0a0a0a] border border-[#30363d] text-white p-1.5 rounded text-[11px] outline-none hover:border-[#58a6ff] transition-colors focus:border-[#58a6ff]">
                                            <option>Blunt_Impact</option>
                                            <option>Slash</option>
                                            <option>Fire_Magic</option>
                                            <option>Electric</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="bg-[#0d1117] rounded border border-[#30363d] p-0.5 divide-y divide-[#30363d]">
                                    <div className="flex justify-between items-center text-[10px] p-1.5 hover:bg-[#161b22]">
                                        <span className="text-[#8b949e] font-bold uppercase tracking-wider">Damage (Base)</span>
                                        <input type="number" defaultValue={85} className="w-16 bg-[#0a0a0a] border border-[#30363d] text-white px-2 py-0.5 rounded text-right font-mono focus:border-[#58a6ff] outline-none" />
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] p-1.5 hover:bg-[#161b22]">
                                        <span className="text-[#8b949e] font-bold uppercase tracking-wider">Damage Scaling</span>
                                        <input type="number" defaultValue={80} className="w-16 bg-[#0a0a0a] border border-[#30363d] text-white px-2 py-0.5 rounded text-right font-mono focus:border-[#58a6ff] outline-none" />
                                        <span className="text-[#8b949e] absolute right-6 pointer-events-none">%</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] p-1.5 hover:bg-[#161b22]">
                                        <span className="text-[#e3b341] font-bold uppercase tracking-wider">Hitstun Frames</span>
                                        <input type="number" defaultValue={22} className="w-16 bg-[#e3b341]/10 border border-[#e3b341]/30 text-[#e3b341] px-2 py-0.5 rounded text-right font-mono focus:border-[#e3b341] outline-none" />
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] p-1.5 hover:bg-[#161b22]">
                                        <span className="text-[#58a6ff] font-bold uppercase tracking-wider">Blockstun Frames</span>
                                        <input type="number" defaultValue={14} className="w-16 bg-[#58a6ff]/10 border border-[#58a6ff]/30 text-[#58a6ff] px-2 py-0.5 rounded text-right font-mono focus:border-[#58a6ff] outline-none" />
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] p-1.5 hover:bg-[#161b22] group">
                                        <span className="text-[#8b949e] font-bold uppercase tracking-wider flex items-center gap-1 group-hover:text-white transition-colors">Hit Stop Override <Settings2 size={10}/></span>
                                        <input type="number" defaultValue={10} className="w-16 bg-[#0a0a0a] border border-[#30363d] text-white px-2 py-0.5 rounded text-right font-mono focus:border-[#58a6ff] outline-none" />
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] p-1.5 hover:bg-[#161b22]">
                                        <span className="text-[#8b949e] font-bold uppercase tracking-wider">Hit Pushback (X/Z)</span>
                                        <div className="flex gap-1" >
                                            <input type="number" defaultValue={1.5} className="w-10 bg-[#0a0a0a] border border-[#30363d] text-white px-1 py-0.5 rounded text-center font-mono focus:border-[#58a6ff] outline-none" />
                                            <input type="number" defaultValue={0.0} className="w-10 bg-[#0a0a0a] border border-[#30363d] text-white px-1 py-0.5 rounded text-center font-mono focus:border-[#58a6ff] outline-none" />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] p-1.5 hover:bg-[#161b22]">
                                        <span className="text-[#8b949e] font-bold uppercase tracking-wider">Juggle Value</span>
                                        <input type="number" defaultValue={1} className="w-16 bg-[#0a0a0a] border border-[#30363d] text-white px-2 py-0.5 rounded text-right font-mono focus:border-[#58a6ff] outline-none" />
                                    </div>
                                </div>

                                <div className="space-y-1.5 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer bg-[#0d1117] px-3 py-1.5 rounded border border-[#30363d] hover:border-[#ff7b72] transition-colors group">
                                        <input type="checkbox" className="accent-[#ff7b72] w-3 h-3"/> <span className="text-[10px] tracking-wider text-[#c9d1d9] font-bold group-hover:text-white uppercase transition-colors">Armor Breaker</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer bg-[#0d1117] px-3 py-1.5 rounded border border-[#30363d] hover:border-[#ff7b72] transition-colors group">
                                        <input type="checkbox" className="accent-[#ff7b72] w-3 h-3"/> <span className="text-[10px] tracking-wider text-[#c9d1d9] font-bold group-hover:text-white uppercase transition-colors">Overhead (Unblockable Low)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer bg-[#0d1117] px-3 py-1.5 rounded border border-[#30363d] hover:border-[#ff7b72] transition-colors group">
                                        <input type="checkbox" defaultChecked className="accent-[#ff7b72] w-3 h-3"/> <span className="text-[10px] tracking-wider text-[#c9d1d9] font-bold group-hover:text-white uppercase transition-colors">Forces Minimum Crouch</span>
                                    </label>
                                </div>
                                
                                <div className="flex gap-2">
                                    <button className="flex-1 bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] text-white py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors">Duplicate</button>
                                    <button className="flex-1 bg-[#f85149]/10 border border-[#f85149]/30 hover:bg-[#f85149] hover:text-black text-[#f85149] py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1"><Trash2 size={12}/> Delete</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'frame_data' && (
                        <div className="p-4 flex flex-col gap-6 animate-in fade-in">
                            <h3 className="text-[#e3b341] text-[12px] uppercase font-bold tracking-widest border-b border-[#e3b341]/30 pb-2 flex items-center gap-2">
                                <Database size={14}/> Move Properties Matchup
                            </h3>
                            
                            <div className="flex flex-col gap-1">
                                {/* Frame Data Table */}
                                <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 text-center text-[10px] font-mono leading-relaxed">
                                    <div className="grid grid-cols-4 border-b border-[#30363d] pb-1 mb-1 text-[#8b949e]">
                                        <span>Startup</span><span>Active</span><span>Recover</span><span>Total</span>
                                    </div>
                                    <div className="grid grid-cols-4 font-bold text-white text-[12px]">
                                        <span className="text-[#58a6ff]">12f</span><span className="text-[#ff7b72]">6f</span><span className="text-[#8b949e]">22f</span><span>40f</span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div className="bg-[#0a0a0a] border border-[#30363d] rounded p-2 text-center flex flex-col justify-center">
                                        <span className="text-[9px] uppercase tracking-wider text-[#8b949e] font-bold">On Hit (Adv)</span>
                                        <span className="text-[16px] font-mono font-bold text-[#3fb950]">+8</span>
                                    </div>
                                    <div className="bg-[#0a0a0a] border border-[#30363d] rounded p-2 text-center flex flex-col justify-center">
                                        <span className="text-[9px] uppercase tracking-wider text-[#8b949e] font-bold">On Block (Adv)</span>
                                        <span className="text-[16px] font-mono font-bold text-[#f85149]">-6</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-[#e3b341]/10 border border-[#e3b341]/30 rounded p-3">
                                <h4 className="text-[#e3b341] text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><ShieldAlert size={12}/> Analysis</h4>
                                <ul className="text-[10px] text-[#c9d1d9] space-y-2 list-disc pl-4 marker:text-[#e3b341]">
                                    <li>Move is <span className="text-[#f85149] font-bold">-6 on block</span>, making it punishable by standard throw (5f) or fast light attacks (4f-5f).</li>
                                    <li>On hit, yields <span className="text-[#3fb950] font-bold">+8 advantage</span>, allowing link into Medium Punch (7f startup).</li>
                                    <li>Special Cancel window aligns perfectly within Hit Stop frames.</li>
                                </ul>
                            </div>
                            
                            <button 
                                className={`w-full transition-colors py-2 rounded text-[10px] font-bold uppercase tracking-wide flex items-center justify-center gap-2 ${isExporting === 'exporting' ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/50' : isExporting === 'done' ? 'bg-[#3fb950] text-[#0a0a0a] border border-[#3fb950]' : 'bg-[#21262d] border border-[#30363d] text-white hover:bg-[#30363d]'}`}
                                onClick={handleExport}
                                disabled={isExporting !== 'idle'}
                            >
                                {isExporting === 'exporting' ? <><Database size={12} className="animate-pulse"/> Exporting...</> : isExporting === 'done' ? <><CheckCircle size={12}/> Frame Data Exported</> : <><Save size={12}/> Export Frame Data to CSV</>}
                            </button>
                        </div>
                    )}

                    {activeTab === 'inspector' && selectedItem === 'cancel_window' && (
                        <div className="p-4 flex flex-col gap-6 animate-in fade-in">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-[#30363d] pb-2">
                                    <h3 className="text-[#e3b341] text-[12px] uppercase font-bold tracking-widest flex items-center gap-2">
                                        <Scissors size={14}/> State Cancels
                                    </h3>
                                </div>
                                
                                <div className="bg-[#0a0a0a] p-3 border border-[#e3b341]/30 rounded space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Cancel Type</span>
                                        <select className="bg-[#161b22] border border-[#30363d] text-[#e3b341] font-bold p-1 rounded text-[10px] outline-none">
                                            <option>Special Moves</option>
                                            <option>Super Art / Ultimate</option>
                                            <option>Jump Cancel</option>
                                            <option>Dash Cancel</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" defaultChecked className="accent-[#e3b341] w-3 h-3"/>
                                        <span className="text-[10px] text-[#c9d1d9] uppercase font-bold">Only on hit/block</span>
                                    </div>
                                    <div className="text-[9px] text-[#8b949e]">
                                        If "Only on hit/block" is unchecked, move can be whiff-canceled.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'inspector' && selectedItem === 'state_iframe' && (
                        <div className="p-4 flex flex-col gap-6 animate-in fade-in">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-[#30363d] pb-2">
                                    <h3 className="text-[#f0883e] text-[12px] uppercase font-bold tracking-widest flex items-center gap-2">
                                        <Shield size={14}/> Invincibility State
                                    </h3>
                                </div>
                                
                                <div className="bg-[#0a0a0a] p-3 border border-[#f0883e]/30 rounded space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Invuln Layer</span>
                                        <select className="bg-[#161b22] border border-[#30363d] text-[#f0883e] font-bold p-1 rounded text-[10px] outline-none">
                                            <option>Upper Body Strike</option>
                                            <option>Lower Body Strike</option>
                                            <option>Full Strike Invuln</option>
                                            <option>Throw Invuln</option>
                                            <option>Projectile Invuln</option>
                                            <option>Full Invincibility</option>
                                        </select>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Super Armor Level</span>
                                        <input type="number" defaultValue="0" className="w-12 bg-[#161b22] border border-[#30363d] text-white p-1 rounded text-[10px] text-right focus:border-[#f0883e] outline-none" title="0 = Invuln, 1+ = hits absorbed"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'inspector' && selectedItem === 'vfx_slash' && (
                        <div className="p-4 flex flex-col gap-6 animate-in fade-in">
                            <div className="space-y-4">
                                <h3 className="text-[#58a6ff] text-[12px] uppercase font-bold tracking-widest border-b border-[#58a6ff]/30 pb-2 flex items-center gap-2">
                                    <Flame size={14}/> Niagara Component
                                </h3>
                                
                                <div className="bg-[#0d1117] border border-[#30363d] rounded p-2">
                                    <div className="flex justify-between items-center bg-[#161b22] p-1.5 rounded mb-2 border border-[#30363d]">
                                        <span className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Asset</span>
                                        <span className="text-[10px] text-[#58a6ff] font-mono hover:underline cursor-pointer">NS_Sword_FlameTrail</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center text-[10px] px-1">
                                            <span className="text-[#8b949e] font-bold uppercase tracking-wider">Attach Point</span>
                                            <select className="bg-[#0a0a0a] text-white border border-[#30363d] outline-none p-1 rounded focus:border-[#58a6ff]">
                                                <option>Weapon_Socket</option>
                                                <option>Hand_R</option>
                                                <option>Root</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <h3 className="text-[#58a6ff] text-[11px] uppercase font-bold tracking-widest mt-4">Emitter User Parameters</h3>
                                <div className="space-y-3 bg-[#0a0a0a] p-3 border border-[#30363d] rounded">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[9px] text-[#8b949e] font-bold flex justify-between uppercase tracking-wider"><span>Spawn Rate (Count/s)</span> <span className="text-[#58a6ff] font-mono">1500</span></label>
                                        <input type="range" className="accent-[#58a6ff]" defaultValue="1500" min="0" max="5000" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[9px] text-[#8b949e] font-bold flex justify-between uppercase tracking-wider"><span>Lifetime (Min/Max)</span> <span className="text-[#c9d1d9] font-mono">0.2 - 0.8s</span></label>
                                        <div className="flex gap-2">
                                            <input type="number" defaultValue={0.2} className="w-full bg-[#161b22] border border-[#30363d] text-white px-2 py-1 rounded text-center font-mono text-[10px] focus:border-[#58a6ff] outline-none" />
                                            <input type="number" defaultValue={0.8} className="w-full bg-[#161b22] border border-[#30363d] text-white px-2 py-1 rounded text-center font-mono text-[10px] focus:border-[#58a6ff] outline-none" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[9px] text-[#8b949e] font-bold flex justify-between uppercase tracking-wider"><span>Cone Velocity / Angle</span> <span className="text-[#c9d1d9] font-mono">45°</span></label>
                                        <input type="range" className="accent-[#58a6ff]" defaultValue="45" min="0" max="180" />
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-[#30363d]">
                                    <label className="flex items-center gap-2 cursor-pointer bg-[#0d1117] px-3 py-2 rounded border border-[#30363d] hover:border-[#58a6ff] transition-colors">
                                        <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-3 h-3"/> <span className="text-[10px] text-[#c9d1d9] font-bold uppercase tracking-wider">Curl Noise Force</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer bg-[#0d1117] px-3 py-2 rounded border border-[#30363d] hover:border-[#58a6ff] transition-colors">
                                        <input type="checkbox" className="accent-[#58a6ff] w-3 h-3"/> <span className="text-[10px] text-[#c9d1d9] font-bold uppercase tracking-wider">Collision (GPU)</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {(activeTab === 'AI_analytics' || (activeTab === 'inspector' && selectedItem === 'vfx_slash')) && (
                        <div className="p-4 mt-auto">
                            <div className="bg-gradient-to-br from-[#bc8cff]/10 to-[#bc8cff]/5 border border-[#bc8cff]/30 rounded-lg p-4 relative overflow-hidden shadow-[0_0_20px_rgba(188,140,255,0.05)_inset]">
                                <div className="absolute -right-4 -top-4 text-[#bc8cff] opacity-10"><BrainCircuit size={64}/></div>
                                <h4 className="text-[#bc8cff] text-[10px] uppercase font-bold tracking-widest mb-3 flex items-center gap-2 relative"><Sparkles size={12}/> Offline AI Physics Solver</h4>
                                <div className="text-[10px] text-[#c9d1d9] leading-relaxed mb-3 relative font-mono">
                                    Predictive fluid dynamics mesh. AI interpolates the exact arc of the sword swing over {currentFrame} frames to pre-bake a 3D vector field for zero-latency particle swirling.
                                </div>
                                <button 
                                    className={`w-full transition-colors py-2 rounded text-[10px] font-bold uppercase tracking-wide flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(188,140,255,0.2)] relative z-10 ${isBaking === 'baking' ? 'bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/50' : isBaking === 'done' ? 'bg-[#3fb950] text-[#0a0a0a] border border-[#3fb950]' : 'bg-[#161b22] border border-[#bc8cff] text-[#bc8cff] hover:bg-[#bc8cff] hover:text-[#0a0a0a]'}`}
                                    onClick={handleBake}
                                    disabled={isBaking !== 'idle'}
                                >
                                    {isBaking === 'baking' ? <><Cpu size={14} className="animate-pulse"/> Baking Vector Field...</> : isBaking === 'done' ? <><CheckCircle size={14}/> Vector Field Saved</> : <><Cpu size={14}/> Pre-bake Vector Field</>}
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
                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col pt-1 pb-4 relative">
                    {/* Playhead Guide Line (Full height) */}
                    <div className="absolute top-0 bottom-0 w-[1px] bg-[#58a6ff]/20 z-20 pointer-events-none" style={{left: `${currentFrame * 10 + 256}px`}}></div>
                    
                    {/* Character Animation Track */}
                    <div className="flex items-center h-8 hover:bg-[#161b22] group border-b border-[#30363d]/50">
                        <div className="w-64 border-r border-[#30363d] px-4 flex items-center gap-2 text-[11px] text-[#c9d1d9] font-bold bg-[#0d1117] relative z-30">
                            <Bone size={12} className="text-[#8b949e]"/> AS_Heavy_Punch_Anim
                        </div>
                        <div className="flex-1 relative h-full flex items-center">
                            <div className="absolute left-[0px] w-[600px] h-4 bg-[#8b949e]/20 border border-[#8b949e]/50 rounded-[4px] mx-1"></div>
                            {/* Keyframes */}
                            <div className={`absolute left-[0px] w-2.5 h-2.5 rotate-45 ml-1.5 cursor-pointer flex items-center justify-center ${currentFrame === 0 ? 'bg-[#58a6ff]' : 'bg-[#c9d1d9]'}`}><div className="w-0.5 h-0.5 bg-black rounded-full"></div></div>
                            <div className={`absolute left-[120px] w-2.5 h-2.5 rotate-45 ml-1.5 cursor-pointer flex items-center justify-center ${currentFrame === 12 ? 'bg-[#58a6ff]' : 'bg-[#c9d1d9]'}`}><div className="w-0.5 h-0.5 bg-black rounded-full"></div></div>
                            <div className={`absolute left-[180px] w-2.5 h-2.5 rotate-45 ml-1.5 cursor-pointer flex items-center justify-center ${currentFrame === 18 ? 'bg-[#58a6ff]' : 'bg-[#c9d1d9]'}`}><div className="w-0.5 h-0.5 bg-black rounded-full"></div></div>
                            <div className={`absolute left-[400px] w-2.5 h-2.5 rotate-45 ml-1.5 cursor-pointer flex items-center justify-center ${currentFrame === 40 ? 'bg-[#58a6ff]' : 'bg-[#c9d1d9]'}`}><div className="w-0.5 h-0.5 bg-black rounded-full"></div></div>
                        </div>
                    </div>

                    {/* Camera Track */}
                    <div className="flex items-center h-7 hover:bg-[#161b22] group">
                        <div className="w-64 border-r border-[#30363d] px-4 flex items-center gap-2 text-[10px] text-[#8b949e] uppercase tracking-wider font-bold bg-[#0d1117] relative z-30">
                            <Camera size={11}/> Cam_Shake_Data
                        </div>
                        <div className="flex-1 relative h-full flex items-center">
                            <div className="absolute left-[120px] w-[40px] h-3 bg-white/20 border border-white/50 rounded-[2px] mx-1 flex overflow-hidden">
                                <svg width="100%" height="100%" preserveAspectRatio="none"><path d="M0,5 L5,0 L10,10 L15,0 L20,10 L25,0 L30,10 L35,0 L40,5" stroke="white" fill="none" strokeWidth="1"/></svg>
                            </div>
                            <div className="absolute left-[120px] w-[150px] h-3 ml-1 flex items-center bg-[#f85149]/10 border border-[#f85149]/50 rounded-[2px] px-1 top-full mt-0.5 z-40">
                                <span className="text-[7px] text-[#f85149] font-bold">HIT STOP OVERRIDE (15f / 250ms)</span>
                            </div>
                        </div>
                    </div>

                    {/* Logic / Modifiers Group Header */}
                    <div className="flex items-center h-5 mt-3 border-y border-[#30363d] bg-[#161b22] sticky top-0 z-30 shadow-sm">
                        <div className="w-64 border-r border-[#30363d] px-4 flex items-center gap-2 text-[9px] text-[#8b949e] font-bold uppercase tracking-widest">
                            Combat State Logic
                        </div>
                    </div>

                    {/* I-Frames Track */}
                    <div className={`flex items-center h-8 hover:bg-[#21262d] group cursor-pointer ${selectedItem === 'state_iframe' ? 'bg-[#161b22] border-y border-[#f0883e]/30' : ''}`} onClick={() => setSelectedItem('state_iframe')}>
                        <div className="w-64 border-r border-[#30363d] px-4 flex items-center gap-2 text-[11px] text-[#f0883e] font-bold bg-[#0d1117] relative z-30">
                            <ShieldAlert size={12}/> Upper_Body_Invuln
                        </div>
                        <div className="flex-1 relative h-full flex items-center">
                            <div className="absolute left-[0px] w-[80px] h-4 bg-[#f0883e]/30 border border-[#f0883e] border-x-4 border-y rounded-[2px] mx-1 flex items-center justify-center shadow-[0_0_10px_rgba(240,136,62,0.3)] stripe-pattern">
                                <span className="text-[8px] font-mono text-[#f0883e] font-bold">INVULN (8f)</span>
                            </div>
                        </div>
                    </div>

                    {/* Cancel Windows Track */}
                    <div className={`flex items-center h-8 hover:bg-[#21262d] group cursor-pointer ${selectedItem === 'cancel_window' ? 'bg-[#161b22] border-y border-[#e3b341]/30' : ''}`} onClick={() => setSelectedItem('cancel_window')}>
                        <div className="w-64 border-r border-[#30363d] px-4 flex items-center gap-2 text-[11px] text-[#e3b341] font-bold bg-[#0d1117] relative z-30">
                            <Scissors size={12}/> Special_Cancel_Win
                        </div>
                        <div className="flex-1 relative h-full flex items-center">
                            <div className="absolute left-[130px] w-[80px] h-4 bg-[#e3b341]/30 border border-[#e3b341] border-x-4 border-y rounded-[2px] mx-1 flex items-center justify-center shadow-[0_0_10px_rgba(227,179,65,0.3)]">
                                <span className="text-[8px] font-mono text-[#e3b341] font-bold">ON-HIT/BLK CANCEL</span>
                            </div>
                        </div>
                    </div>

                    {/* Components Group Header */}
                    <div className="flex items-center h-5 mt-2 border-y border-[#30363d] bg-[#161b22] sticky top-0 z-30 shadow-sm">
                        <div className="w-64 border-r border-[#30363d] px-4 flex items-center gap-2 text-[9px] text-[#8b949e] font-bold uppercase tracking-widest">
                            Components & Emitters
                        </div>
                    </div>

                    {/* Hitboxes Track */}
                    <div className={`flex items-center h-8 hover:bg-[#21262d] group cursor-pointer ${selectedItem === 'hitbox_punch' ? 'bg-[#161b22] border-y border-[#ff7b72]/30' : ''}`} onClick={() => setSelectedItem('hitbox_punch')}>
                        <div className="w-64 border-r border-[#30363d] px-4 flex items-center gap-2 text-[11px] text-[#ff7b72] font-bold bg-[#0d1117] relative z-30">
                            <Swords size={12}/> HF_Punch_Heavy {selectedItem === 'hitbox_punch' && <div className="w-1.5 h-1.5 rounded-full bg-[#ff7b72] ml-auto animate-pulse shadow-[0_0_8px_#ff7b72]"></div>}
                        </div>
                        <div className="flex-1 relative h-full flex items-center">
                            {/* Hitbox Active Window */}
                            <div className="absolute left-[120px] w-[60px] h-4 bg-[#ff7b72]/30 border border-[#ff7b72] border-x-4 border-y rounded-[2px] mx-1 flex items-center justify-center shadow-[0_0_10px_rgba(255,123,114,0.3)] bg-opacity-80">
                                <span className="text-[8px] font-mono text-white font-bold drop-shadow-md">ACTIVE (6f)</span>
                            </div>
                        </div>
                    </div>

                    {/* Hurtboxes Track */}
                    <div className={`flex items-center h-8 hover:bg-[#21262d] group cursor-pointer ${selectedItem === 'hurtbox_torso' ? 'bg-[#161b22] border-y border-[#3fb950]/30' : ''}`} onClick={() => setSelectedItem('hurtbox_torso')}>
                        <div className="w-64 border-r border-[#30363d] px-4 flex items-center gap-2 text-[11px] text-[#3fb950] font-bold bg-[#0d1117] relative z-30">
                            <Shield size={12}/> HB_Core_Torso
                        </div>
                        <div className="flex-1 relative h-full flex items-center">
                            <div className="absolute left-[0px] w-[600px] h-4 bg-[#3fb950]/20 border border-[#3fb950]/50 rounded-[4px] mx-1 opacity-60"></div>
                            {/* Shape Change Keyframe indicator on hurtbox */}
                            <div className="absolute left-[120px] w-[2px] h-full bg-[#3fb950] mx-1"></div>
                        </div>
                    </div>

                    {/* VFX Track */}
                    <div className={`flex items-center h-8 hover:bg-[#21262d] group cursor-pointer ${selectedItem === 'vfx_slash' ? 'bg-[#161b22] border-y border-[#58a6ff]/30' : ''}`} onClick={() => setSelectedItem('vfx_slash')}>
                        <div className="w-64 border-r border-[#30363d] px-4 flex items-center gap-2 text-[11px] text-[#58a6ff] font-bold bg-[#0d1117] relative z-30">
                            <Flame size={12}/> NS_Sword_FlameTrail
                        </div>
                        <div className="flex-1 relative h-full flex items-center">
                            <div className="absolute left-[110px] w-[180px] h-4 bg-[#58a6ff]/20 border border-[#58a6ff]/50 rounded-[4px] mx-1 flex items-center overflow-hidden">
                                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#58a6ff] to-transparent block shadow-[0_0_5px_#58a6ff]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Sound FX Track */}
                    <div className="flex items-center h-8 hover:bg-[#161b22] group">
                        <div className="w-64 border-r border-[#30363d] px-4 flex items-center gap-2 text-[11px] text-[#bc8cff] font-bold bg-[#0d1117] relative z-30">
                            <Activity size={12}/> SFX_HeavyWhoosh
                        </div>
                        <div className="flex-1 relative h-full flex items-center">
                            <div className="absolute left-[105px] w-2 h-4 bg-[#bc8cff] rounded-[2px] mx-1 shadow-[0_0_5px_#bc8cff]"></div>
                            <svg className="absolute left-[110px] h-6 w-20 text-[#bc8cff] opacity-60" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <path d="M 0 50 Q 10 20 20 50 T 40 50 T 60 20 T 80 50 T 100 50" fill="none" stroke="currentColor" strokeWidth="6" />
                            </svg>
                        </div>
                    </div>

                </div>
            </div>
            
            {/* Inject a small CSS for striped pattern used in I-Frames */}
            <style dangerouslySetInnerHTML={{__html: `
                .stripe-pattern {
                    background-image: repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(240,136,62,0.2) 4px, rgba(240,136,62,0.2) 8px);
                }
            `}} />
            </div>
            </div>
        </div>
    );
}
