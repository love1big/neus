import React, { useState, useEffect } from 'react';
import { 
  Play, MousePointer2, Smartphone, Monitor, Code2, Eye, Focus, Fingerprint, RefreshCcw, LayoutTemplate, AudioWaveform, Waves, Atom, Settings2, BoxSelect, Maximize2, Rotate3D, Network, Compass, CheckCircle2, ChevronRight, Minimize2, Plus, GripHorizontal, Triangle, Square as SquareIcon, Type, Layers, Baseline, Hexagon, Component, Link2, SlidersHorizontal, Trash2, Activity, Zap} from 'lucide-react';

export default function UIUXEditor() {
  const [activeTab, setActiveTab] = useState<'Canvas' | 'Physics' | 'Heatmap' | 'Tokenizer' | 'Haptics' | 'Multiverse'>('Canvas');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#8b949e] font-sans">
      {/* Header */}
      <div className="h-16 bg-[#0a0a0a] border-b border-[#30363d] flex items-center px-6 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#58a6ff]/10 to-transparent pointer-events-none"></div>
        <LayoutTemplate size={28} className="text-[#58a6ff] mr-4 shadow-[0_0_15px_rgba(88,166,255,0.4)]" />
        <div className="flex flex-col z-10 w-full">
           <div className="flex justify-between items-center w-full">
              <div>
                <h2 className="text-[#c9d1d9] text-[16px] font-bold tracking-tight">Apex UI/UX & Interaction Design Sandbox</h2>
                <p className="text-[11px] text-[#8b949e]">Beyond flat design. Micro-physics, Local AI Eye-tracking, Haptic Sync, and Dynamic Tokenizer.</p>
              </div>
              <div className="flex gap-2">
                 <button className="px-3 py-1.5 bg-[#161b22] border border-[#30363d] hover:bg-[#21262d] rounded text-[11px] font-bold text-[#c9d1d9] flex items-center gap-1"><Smartphone size={12}/> iOS Target</button>
                 <button className="px-3 py-1.5 bg-[#3fb950]/10 border border-[#3fb950]/30 hover:bg-[#3fb950]/20 rounded text-[11px] font-bold text-[#3fb950] flex items-center gap-1 shadow-[0_0_10px_rgba(63,185,80,0.1)]"><Play size={12}/> Run Prototype</button>
              </div>
           </div>
        </div>
      </div>

      <div className="flex bg-[#161b22] border-b border-[#30363d] h-10 px-4">
        <button onClick={() => setActiveTab('Canvas')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'Canvas' ? 'text-[#58a6ff] border-b-2 border-[#58a6ff] bg-[#0a0a0a]' : 'hover:text-[#c9d1d9]'}`}><LayoutTemplate size={14}/> Node Canvas</button>
        <button onClick={() => setActiveTab('Physics')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'Physics' ? 'text-[#3fb950] border-b-2 border-[#3fb950] bg-[#0a0a0a]' : 'hover:text-[#c9d1d9]'}`}><Atom size={14}/> Micro-Physics</button>
        <button onClick={() => setActiveTab('Heatmap')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'Heatmap' ? 'text-[#f85149] border-b-2 border-[#f85149] bg-[#0a0a0a]' : 'hover:text-[#c9d1d9]'}`}><Eye size={14}/> AI Eye-Tracking</button>
        <button onClick={() => setActiveTab('Tokenizer')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'Tokenizer' ? 'text-[#bc8cff] border-b-2 border-[#bc8cff] bg-[#0a0a0a]' : 'hover:text-[#c9d1d9]'}`}><Code2 size={14}/> Design Tokens</button>
        <button onClick={() => setActiveTab('Haptics')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'Haptics' ? 'text-[#e3b341] border-b-2 border-[#e3b341] bg-[#0a0a0a]' : 'hover:text-[#c9d1d9]'}`}><Fingerprint size={14}/> Haptics Sync</button>
        <button onClick={() => setActiveTab('Multiverse')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'Multiverse' ? 'text-[#58a6ff] border-b-2 border-[#58a6ff] bg-[#0a0a0a]' : 'hover:text-[#c9d1d9]'}`}><Monitor size={14}/> Multiverse Preview</button>
      </div>

      <div className="flex-1 overflow-hidden relative">
         {activeTab === 'Canvas' && <NodeCanvas setSelectedElement={setSelectedElement} selectedElement={selectedElement} />}
         {activeTab === 'Physics' && <PhysicsEditor />}
         {activeTab === 'Heatmap' && <AIHeatmap />}
         {activeTab === 'Tokenizer' && <DynamicTokenizer />}
         {activeTab === 'Haptics' && <HapticEditor />}
         {activeTab === 'Multiverse' && <MultiversePreview />}
      </div>
    </div>
  );
}

function NodeCanvas({ setSelectedElement, selectedElement }: { setSelectedElement: (id: string) => void, selectedElement: string|null }) {
   return (
      <div className="flex h-full">
         <div className="w-[50px] bg-[#161b22] border-r border-[#30363d] flex flex-col items-center py-2 gap-2 text-[#8b949e]">
            <button className="p-2 text-[#58a6ff] bg-[#21262d] rounded shadow-[0_0_10px_rgba(88,166,255,0.2)]"><MousePointer2 size={16}/></button>
            <button className="p-2 hover:bg-[#21262d] hover:text-[#c9d1d9] rounded"><BoxSelect size={16}/></button>
            <div className="w-6 h-px bg-[#30363d] my-1"></div>
            <button className="p-2 hover:bg-[#21262d] hover:text-[#c9d1d9] rounded"><LayoutTemplate size={16}/></button>
            <button className="p-2 hover:bg-[#21262d] hover:text-[#c9d1d9] rounded"><Type size={16}/></button>
            <button className="p-2 hover:bg-[#21262d] hover:text-[#c9d1d9] rounded"><Baseline size={16}/></button>
            <button className="p-2 hover:bg-[#21262d] hover:text-[#c9d1d9] rounded"><SquareIcon size={16}/></button>
            <button className="p-2 hover:bg-[#21262d] hover:text-[#c9d1d9] rounded"><Component size={16}/></button>
         </div>

         {/* Left Hierarchy */}
         <div className="w-60 bg-[#0d1117] border-r border-[#30363d] flex flex-col z-10 shadow-xl">
            <div className="p-2 border-b border-[#30363d] text-[10px] font-bold uppercase tracking-widest text-[#c9d1d9] flex justify-between bg-[#161b22]">
               Layers
               <Plus size={12} className="cursor-pointer hover:text-white"/>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 font-mono text-[11px]">
               <div className="flex items-center gap-1.5 text-[#58a6ff] bg-[#58a6ff]/10 px-1.5 py-1 rounded cursor-pointer" onClick={() => setSelectedElement('btn1')}>
                  <LayoutTemplate size={12}/> Frame: Checkout
               </div>
               <div className="flex items-center gap-1.5 pl-4 text-[#c9d1d9] hover:bg-[#21262d] px-1.5 py-1 rounded cursor-pointer">
                  <Type size={12}/> Text: "Total: $120"
               </div>
               <div className={`flex items-center gap-1.5 pl-4 ${selectedElement === 'btn1' ? 'text-[#3fb950] bg-[#3fb950]/10' : 'text-[#c9d1d9] hover:bg-[#21262d]'} px-1.5 py-1 rounded cursor-pointer`} onClick={() => setSelectedElement('btn1')}>
                  <SquareIcon size={12}/> Button: PayNow
                  {selectedElement === 'btn1' && <Atom size={10} className="ml-auto animate-pulse"/>}
               </div>
               <div className="flex items-center gap-1.5 pl-8 text-[#8b949e] hover:bg-[#21262d] px-1.5 py-1 rounded cursor-pointer">
                  <Type size={12}/> Text: "Checkout"
               </div>
            </div>
         </div>

         <div className="flex-1 bg-[#050505] p-6 relative flex items-center justify-center overflow-auto custom-scrollbar">
            {/* Grid */}
            <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'linear-gradient(#58a6ff 1px, transparent 1px), linear-gradient(90deg, #58a6ff 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: 'center' }}></div>
            
            {/* The Mobile Frame Canvas */}
            <div className="relative w-[375px] h-[812px] bg-white rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.8),_0_0_0_12px_#161b22,_inset_0_0_0_2px_#30363d] overflow-hidden m-16">
               <div className="absolute top-0 w-full h-7 bg-transparent flex justify-center z-50">
                  <div className="w-32 h-6 bg-[#161b22] rounded-b-3xl relative overflow-hidden">
                     <div className="absolute right-4 top-2 w-2 h-2 rounded-full bg-black"></div>
                     <div className="absolute right-2 top-2.5 w-1 h-1 rounded-full bg-green-500/50"></div>
                  </div>
               </div>
               
               <div className="p-6 pt-16 h-full flex flex-col bg-[#f5f5f7]">
                  <h1 className="text-3xl font-bold text-black tracking-tight mb-2">Checkout</h1>
                  <p className="text-gray-500 mb-8">Review your items before payment.</p>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                     <div className="flex justify-between font-bold text-black border-b border-gray-100 pb-2 mb-2"><span>Total</span><span>$120.00</span></div>
                     <div className="text-sm text-gray-500">Includes taxes and fees</div>
                  </div>

                  <div className="flex-1"></div>

                  <button 
                     className={`w-full py-4 text-white font-bold rounded-full text-lg relative overflow-hidden transition-all duration-300 ${selectedElement === 'btn1' ? 'bg-[#3fb950] scale-100 shadow-[0_10px_30px_rgba(63,185,80,0.4)] ring-4 ring-[#3fb950]/30 outline outline-2 outline-offset-4 outline-[#58a6ff]' : 'bg-black shadow-lg hover:-translate-y-1'}`}
                     onClick={(e) => { e.stopPropagation(); setSelectedElement('btn1'); }}
                  >
                     <span className="relative z-10">Pay with Apple Pay</span>
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-4">Secured by Stripe</p>
               </div>
            </div>

            {/* Smart Guides & Anchors Overlay */}
            {selectedElement === 'btn1' && (
               <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-[375px] h-[812px] relative m-16">
                     {/* Horizontal Guide Extending Infinitely */}
                     <div className="absolute bottom-[108px] -left-[1000px] w-[3000px] h-px bg-[#58a6ff] border-t border-dashed border-[#58a6ff]"></div>
                     <div className="absolute bottom-[44px] -left-[1000px] w-[3000px] h-px bg-[#58a6ff] border-t border-dashed border-[#58a6ff]"></div>
                     
                     {/* Bounding Box on actual element */}
                     <div className="absolute bottom-[44px] left-6 right-6 h-[64px] border-2 border-[#58a6ff] z-[100] shadow-[0_0_10px_#58a6ff]">
                        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-[#58a6ff]"></div>
                        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-[#58a6ff]"></div>
                        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-[#58a6ff]"></div>
                        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-[#58a6ff]"></div>
                     </div>

                     {/* Spacing measurement */}
                     <div className="absolute bottom-[44px] left-1/2 -translate-x-1/2 flex flex-col items-center z-[100]">
                        <div className="w-px h-[24px] bg-[#f85149] translate-y-full"></div>
                        <span className="bg-[#f85149] text-white text-[8px] font-bold px-1 rounded-sm mt-1 translate-y-[24px]">24pt margin</span>
                     </div>
                  </div>
               </div>
            )}
         </div>

         {/* Property Inspector */}
         <div className="w-72 bg-[#161b22] border-l border-[#30363d] flex flex-col z-10 shadow-2xl">
            <div className="h-10 border-b border-[#30363d] flex items-center px-3 gap-2 bg-[#0d1117]">
               <Settings2 size={14} className="text-[#8b949e]"/>
               <span className="text-[11px] font-bold text-[#c9d1d9] uppercase tracking-widest">Properties</span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
               {selectedElement === 'btn1' ? (
                  <>
                     <div className="space-y-2">
                        <div className="flex justify-between items-center border-b border-[#30363d] pb-1">
                           <span className="text-[10px] uppercase font-bold text-[#e3b341]">Auto Layout</span>
                           <Plus size={12} className="cursor-pointer text-[#8b949e] hover:text-[#c9d1d9]" />
                        </div>
                        <div className="flex bg-[#0a0a0a] border border-[#30363d] rounded p-1">
                           <button className="flex-1 py-1 rounded bg-[#21262d] text-white flex justify-center"><ChevronRight size={14}/></button>
                           <button className="flex-1 py-1 rounded text-[#8b949e] hover:text-white flex justify-center"><ChevronRight size={14} className="rotate-90"/></button>
                           <button className="flex-1 py-1 rounded text-[#8b949e] hover:text-white flex justify-center"><GripHorizontal size={14}/></button>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <div className="text-[10px] uppercase font-bold text-[#8b949e] border-b border-[#30363d] pb-1">Dimensions</div>
                        <div className="grid grid-cols-2 gap-2">
                           <label className="flex flex-col gap-1 text-[10px] text-[#8b949e]">W <input type="text" defaultValue="Fill" className="bg-[#0a0a0a] border border-[#30363d] rounded px-2 py-1 text-white font-mono"/></label>
                           <label className="flex flex-col gap-1 text-[10px] text-[#8b949e]">H <input type="text" defaultValue="64" className="bg-[#0a0a0a] border border-[#30363d] rounded px-2 py-1 text-white font-mono"/></label>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <div className="text-[10px] uppercase font-bold text-[#3fb950] border-b border-[#30363d] pb-1 flex justify-between items-center">
                           Interaction
                           <Link2 size={12} className="cursor-pointer"/>
                        </div>
                        <div className="bg-[#0a0a0a] border border-[#3fb950]/30 rounded p-2 text-[10px] text-[#8b949e] space-y-2 relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-8 h-8 bg-[#3fb950]/10 rounded-bl-full pointer-events-none"></div>
                           <div className="flex justify-between items-center"><span className="text-white font-bold">On Tap</span><ChevronRight size={10}/></div>
                           <div className="flex justify-between items-center"><span>Navigate To</span><span className="text-[#3fb950] font-mono bg-[#3fb950]/10 px-1 rounded border border-[#3fb950]/20">SuccessScreen</span></div>
                           <div className="flex justify-between items-center"><span>Animation</span><span className="text-white bg-[#21262d] px-1 rounded border border-[#30363d]">Spring (Stiff)</span></div>
                        </div>
                        <button className="w-full py-1.5 border border-[#3fb950] text-[#3fb950] rounded text-[10px] font-bold hover:bg-[#3fb950]/10 transition-colors bg-[#0a0a0a]">Edit Spring Physics</button>
                     </div>
                     <div className="space-y-2">
                        <div className="text-[10px] uppercase font-bold text-[#bc8cff] border-b border-[#30363d] pb-1">Code Export</div>
                        <div className="bg-[#0a0a0a] border border-[#30363d] rounded p-2 font-mono text-[9px] text-[#8b949e] whitespace-pre overflow-x-auto shadow-inner">
{`<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ 
    type: "spring", 
    stiffness: 400, 
    damping: 17 
  }}
  className="w-full py-4 bg-black text-white font-bold rounded-full"
>
  Pay Now
</motion.button>`}
                        </div>
                     </div>
                  </>
               ) : (
                  <div className="text-center text-[10px] text-[#8b949e] pt-10">Select an element on canvas to modify.</div>
               )}
            </div>
         </div>
      </div>
   );
}

function PhysicsEditor() {
   return (
      <div className="flex h-full">
         <div className="w-72 bg-[#161b22] border-r border-[#30363d] p-4 overflow-y-auto custom-scrollbar shadow-[10px_0_30px_rgba(0,0,0,0.8)] z-10 flex flex-col gap-6">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#3fb950] border-b border-[#30363d] pb-2 flex items-center gap-2"><Atom size={14}/> Spring Dynamics Solver</h3>
            
            <div className="space-y-4">
               <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] text-[#8b949e]"><span>Mass</span><span className="text-white font-mono bg-[#0d1117] px-1 rounded border border-[#30363d]">1.0 kg</span></div>
                  <input type="range" defaultValue="20" className="w-full h-1 bg-[#30363d] rounded appearance-none accent-[#58a6ff] hover:h-2 transition-all" />
               </div>
               <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] text-[#8b949e]"><span>Stiffness (Tension)</span><span className="text-white font-mono bg-[#0d1117] px-1 rounded border border-[#30363d]">400.0</span></div>
                  <input type="range" defaultValue="80" className="w-full h-1 bg-[#30363d] rounded appearance-none accent-[#3fb950] hover:h-2 transition-all" />
               </div>
               <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] text-[#8b949e]"><span>Damping (Friction)</span><span className="text-white font-mono bg-[#0d1117] px-1 rounded border border-[#30363d]">17.0</span></div>
                  <input type="range" defaultValue="40" className="w-full h-1 bg-[#30363d] rounded appearance-none accent-[#f85149] hover:h-2 transition-all" />
               </div>
               <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] text-[#8b949e]"><span>Initial Velocity</span><span className="text-white font-mono bg-[#0d1117] px-1 rounded border border-[#30363d]">0.0 m/s</span></div>
                  <input type="range" defaultValue="50" className="w-full h-1 bg-[#30363d] rounded appearance-none accent-[#e3b341] hover:h-2 transition-all" />
               </div>
            </div>

            <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 text-[10px]">
               <div className="text-[10px] text-[#c9d1d9] font-bold mb-2 uppercase border-b border-[#30363d] pb-1">Preset Tunings</div>
               <div className="grid grid-cols-2 gap-2 text-[9px] font-mono mt-2">
                  <button className="bg-[#21262d] py-1 border border-[#3fb950] text-[#3fb950] rounded shadow-[0_0_10px_rgba(63,185,80,0.2)]">Bouncy</button>
                  <button className="bg-[#0a0a0a] py-1 border border-[#30363d] hover:border-[#8b949e] hover:text-white rounded text-[#8b949e] transition-colors">Stiff</button>
                  <button className="bg-[#0a0a0a] py-1 border border-[#30363d] hover:border-[#8b949e] hover:text-white rounded text-[#8b949e] transition-colors">Snappy</button>
                  <button className="bg-[#0a0a0a] py-1 border border-[#30363d] hover:border-[#8b949e] hover:text-white rounded text-[#8b949e] transition-colors">Fluid</button>
               </div>
            </div>
            
            <div className="h-px w-full bg-[#30363d]"></div>

            <div className="space-y-2">
               <div className="flex justify-between text-[10px] text-[#c9d1d9] font-bold mb-1 uppercase">Response Curve Graph <Maximize2 size={10}/></div>
               <div className="aspect-video w-full bg-[#0a0a0a] border border-[#30363d] rounded flex items-end p-2 relative overflow-hidden group cursor-crosshair shadow-inner">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d_1px,transparent_1px),linear-gradient(to_bottom,#30363d_1px,transparent_1px)] bg-[size:10px_10px] opacity-30"></div>
                  {/* Fake Curve */}
                  <svg className="w-full h-full overflow-visible absolute inset-0 drop-shadow-[0_0_8px_rgba(63,185,80,0.8)]">
                     <path d="M 0 100 Q 20 -20 40 40 T 70 80 T 100 100" fill="none" stroke="#3fb950" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                     {/* Scrubber visualization */}
                     <line x1="30%" y1="0" x2="30%" y2="100%" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="2 2" className="animate-[ping_4s_infinite]"/>
                  </svg>
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none"></div>
               </div>
               <div className="flex justify-between text-[8px] font-mono text-[#8b949e] mt-1">
                  <span>0ms</span>
                  <span>Displacement (px)</span>
                  <span>800ms</span>
               </div>
            </div>
         </div>

         <div className="flex-1 bg-[#050505] p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 left-4 text-[10px] uppercase font-bold text-[#8b949e] flex items-center gap-2 bg-[#0d1117] p-2 rounded border border-[#30363d]"><Atom size={12}/> Interactive Testing Ground</div>
            
            {/* Grid Map Background with deep perspective */}
            <div className="absolute inset-0 bg-[#000] z-0">
               <div className="absolute inset-0 bg-[linear-gradient(#f8514930_1px,transparent_1px),linear-gradient(90deg,#f8514930_1px,transparent_1px)] bg-[size:50px_50px] opacity-10" style={{ transform: 'perspective(1000px) rotateX(75deg) scale(3) translateY(-100px)'}}></div>
               <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]"></div>
            </div>

            {/* Interactive Object Group */}
            <div className="relative flex flex-col items-center gap-12 z-10 w-full max-w-3xl mt-12 pb-24">
               {/* Physics Switch */}
               <div className="flex flex-col items-center gap-4 border border-[#30363d] p-8 rounded-3xl bg-[#0d1117]/80 backdrop-blur-2xl w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#58a6ff]/5 rounded-bl-full pointer-events-none blur-xl"></div>
                  <h4 className="text-[12px] font-bold text-[#58a6ff] uppercase tracking-widest border-b border-[#58a6ff]/30 pb-2 w-full text-center mb-2">Mass-Spring Toggle</h4>
                  
                  <div className="w-48 h-24 bg-[#161b22] rounded-full border-[4px] border-[#30363d] shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)] relative cursor-pointer group flex items-center p-2">
                     <div className="w-16 h-16 bg-gradient-to-br from-[#3fb950] to-[#2ea043] rounded-full shadow-[0_10px_20px_rgba(63,185,80,0.5),_inset_0_2px_4px_rgba(255,255,255,0.4)] absolute right-3 transition-all duration-[400ms] group-active:w-20 group-active:right-3 group-active:scale-90 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-white/50 rounded-full"></div>
                     </div>
                  </div>
                  <div className="w-full flex justify-between font-mono text-[10px] text-[#8b949e] px-8 mt-2">
                    <span className="bg-[#21262d] px-2 py-0.5 rounded border border-[#30363d]">State: ON</span>
                    <span className="text-[#e3b341]">v: 0.0 m/s</span>
                  </div>
               </div>

               {/* Interactive Cards */}
               <div className="flex gap-8 w-full mt-4">
                  <div className="flex-1 aspect-[4/3] bg-gradient-to-br from-[#21262d] to-[#161b22] border-[2px] border-[#30363d] rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] cursor-pointer hover:-translate-y-6 hover:rotate-2 hover:border-[#e3b341]/50 hover:shadow-[0_40px_80px_rgba(0,0,0,0.9),_0_0_50px_rgba(227,179,65,0.2)] transition-all duration-[600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group relative overflow-hidden flex items-end p-6">
                     <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                     <div className="relative z-10 w-full flex justify-between items-end">
                        <h3 className="text-white font-bold text-2xl group-hover:text-[#e3b341] transition-colors leading-none">Spring A<br/><span className="text-[12px] text-[#8b949e] font-mono uppercase">Stiff / High Mass</span></h3>
                     </div>
                     <div className="absolute top-6 right-6 w-12 h-12 rounded-full border-2 border-white/20 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-md">
                        <div className="w-1.5 h-1.5 bg-white rounded-full leading-none"></div><div className="w-1.5 h-1.5 bg-white rounded-full leading-none"></div><div className="w-1.5 h-1.5 bg-white rounded-full leading-none"></div>
                     </div>
                  </div>
                  <div className="flex-1 aspect-[4/3] bg-gradient-to-br from-[#21262d] to-[#161b22] border-[2px] border-[#30363d] rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] cursor-pointer hover:-translate-y-2 hover:-rotate-1 border-[#58a6ff]/20 hover:shadow-[0_25px_45px_rgba(0,0,0,0.6)] transition-all duration-[800ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group relative overflow-hidden flex items-end p-6">
                     <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                     <div className="relative z-10 w-full flex justify-between items-end">
                        <h3 className="text-white font-bold text-2xl group-hover:text-[#58a6ff] transition-colors leading-none">Spring B<br/><span className="text-[12px] text-[#8b949e] font-mono uppercase">Float / Low Tension</span></h3>
                     </div>
                  </div>
               </div>
            </div>

            {/* Inspector Overlay Bottom Right */}
            <div className="absolute bottom-6 right-6 w-72 bg-[#0d1117]/90 border border-[#3fb950] rounded-xl p-4 text-[10px] shadow-[0_0_30px_rgba(63,185,80,0.15)] font-mono flex flex-col gap-3 backdrop-blur-xl z-50">
               <div className="flex justify-between items-center border-b border-[#3fb950]/30 pb-2">
                  <span className="text-[#3fb950] font-bold uppercase tracking-widest text-[11px]">Live Telemetry</span>
                  <Activity size={12} className="text-[#3fb950] animate-pulse"/>
               </div>
               <div className="flex justify-between items-center bg-[#0a0a0a] p-1.5 rounded">
                  <span className="text-[#8b949e]">Current Pos (x, y)</span>
                  <span className="text-white relative font-bold">240.0, 10.0</span>
               </div>
               <div className="flex justify-between items-center bg-[#0a0a0a] p-1.5 rounded">
                  <span className="text-[#8b949e]">Velocity (v)</span>
                  <span className="text-[#58a6ff] font-bold">0.00 m/s</span>
               </div>
               <div className="flex justify-between items-center bg-[#0a0a0a] p-1.5 rounded">
                  <span className="text-[#8b949e]">Acceleration (a)</span>
                  <span className="text-[#f85149] font-bold">-0.00</span>
               </div>
               <div className="flex justify-between items-center bg-[#0a0a0a] p-1.5 rounded">
                  <span className="text-[#8b949e]">Jerk (j)</span>
                  <span className="text-[#e3b341] font-bold">0.05</span>
               </div>
               <div className="h-px bg-[#30363d] my-1"></div>
               <div className="flex justify-between items-center">
                  <span className="text-[#8b949e]">Settled State</span>
                  <span className="text-[#3fb950] font-bold px-2 py-0.5 bg-[#3fb950]/10 rounded border border-[#3fb950]/30">TRUE</span>
               </div>
            </div>
         </div>
      </div>
   );
}

function AIHeatmap() {
   return (
      <div className="flex h-full">
         <div className="w-72 bg-[#161b22] border-r border-[#30363d] p-4 overflow-y-auto custom-scrollbar flex flex-col gap-6 shadow-2xl z-20">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#f85149] border-b border-[#30363d] pb-2 flex items-center gap-2"><Eye size={14}/> Vision Inference</h3>
            <p className="text-[10px] text-[#8b949e] leading-relaxed">
               Local ML model predicts human gaze patterns and salient focus points instantly. Identifies UX bottlenecks before user testing or launching experiments.
            </p>
            <button className="w-full py-2.5 bg-gradient-to-r from-[#f85149] to-[#bf392f] text-white font-bold text-[11px] uppercase tracking-wider rounded shadow-[0_0_20px_rgba(248,81,73,0.4)] hover:scale-[1.02] transition-transform flex justify-center items-center gap-2">
               <RefreshCcw size={12}/> Predict Attention Maps
            </button>

            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 text-[10px] flex flex-col gap-3 mt-2 font-mono shadow-inner">
               <div className="text-white font-bold border-b border-[#30363d] pb-2 text-[11px] flex items-center justify-between">Attention Scorecard <Activity size={10} className="text-[#f85149]"/></div>
               <div className="flex justify-between items-center"><span className="text-[#8b949e] flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#f85149] shadow-[0_0_5px_#f85149]"></div> CTA Button</span><span className="text-white font-bold">87%</span></div>
               <div className="flex justify-between items-center"><span className="text-[#8b949e] flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#e3b341] shadow-[0_0_5px_#e3b341]"></div> Hero Image</span><span className="text-white font-bold">62%</span></div>
               <div className="flex justify-between items-center"><span className="text-[#8b949e] flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#3fb950] shadow-[0_0_5px_#3fb950]"></div> Headline</span><span className="text-white font-bold">41%</span></div>
               <div className="flex justify-between items-center pt-2 border-t border-[#30363d]"><span className="text-[#8b949e] flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#58a6ff]"></div> Nav Bar</span><span className="text-[#f85149] font-bold tracking-tighter text-[9px] border border-[#f85149]/50 bg-[#f85149]/10 rounded px-1.5 py-0.5">LOW (12%)</span></div>
            </div>
            
            <div className="space-y-3 mt-4">
               <div className="flex justify-between text-[10px] font-bold text-[#c9d1d9] uppercase border-b border-[#30363d] pb-1">Display Options</div>
               <div className="flex justify-between text-[10px] text-[#8b949e]"><span>Heatmap Opacity</span><span className="text-white font-mono bg-[#21262d] px-1 rounded">75%</span></div>
               <input type="range" defaultValue="75" className="w-full h-1 bg-[#30363d] rounded appearance-none accent-[#f85149]" />
               <div className="flex justify-between text-[10px] text-[#8b949e] pt-2"><span>Saccade Paths</span><span className="text-white font-mono bg-[#21262d] px-1 rounded">Visible</span></div>
            </div>

            <div className="bg-gradient-to-br from-[#f85149]/20 to-[#f85149]/5 border border-[#f85149]/40 rounded-lg p-3 text-[10px] text-[#ff7b72] mt-auto relative overflow-hidden">
               <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#f85149] rounded-full blur-2xl opacity-20"></div>
               <div className="font-bold flex items-center gap-1 mb-2 text-[11px] uppercase tracking-wider"><Zap size={10} className="fill-[#f85149]"/> AI Insight</div>
               Move the "Nav Bar" lower or increase contrast. It is currently falling entirely outside the initial 2-second visual fixation cone. Users are likely missing navigation on first load.
            </div>
         </div>

         <div className="flex-1 bg-[#050505] p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* The Image under test */}
            <div className="relative w-full max-w-4xl aspect-[16/10] bg-[#161b22] border-[8px] border-[#21262d] rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
               {/* Mock Website Layout - Modern minimal SAAS */}
               <div className="absolute inset-0 flex flex-col bg-white">
                  <header className="h-20 border-b border-gray-100 flex items-center justify-between px-10">
                     <div className="font-extrabold text-2xl text-black tracking-tighter">Acme<span className="text-blue-600">Corp</span></div>
                     <div className="flex gap-8 text-sm font-bold text-gray-500">
                        <span className="hover:text-black cursor-pointer transition-colors">Platform</span>
                        <span className="hover:text-black cursor-pointer transition-colors">Pricing</span>
                        <span className="hover:text-black cursor-pointer transition-colors">Company</span>
                     </div>
                     <div className="flex gap-4">
                        <button className="text-black font-bold px-4">Log in</button>
                        <button className="bg-black text-white px-6 py-2.5 rounded-full font-bold">Sign Up</button>
                     </div>
                  </header>
                  <main className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
                     {/* Background deco */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                     
                     <div className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-blue-200">Introducing Version 2.0</div>
                     <h1 className="text-7xl font-extrabold text-black mb-6 tracking-tight leading-tight max-w-4xl z-10">Supercharge Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Workflow</span></h1>
                     <p className="text-2xl text-gray-500 mb-10 max-w-2xl z-10 leading-relaxed font-light">The only tool you need to build faster, test better, and deploy magic.</p>
                     
                     <div className="flex gap-4 z-10">
                        <button className="bg-blue-600 text-white px-10 py-5 rounded-full font-bold text-xl shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:scale-105 transition-transform cursor-pointer">Start Free Trial Now</button>
                        <button className="bg-white text-black border border-gray-200 px-10 py-5 rounded-full font-bold text-xl hover:bg-gray-50 transition-colors shadow-sm">View Demo</button>
                     </div>
                  </main>
               </div>

               {/* Simulated Heatmap Overlay */}
               <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-80" style={{ filter: 'blur(40px)' }}>
                  {/* Top Left (Low attention) */}
                  <div className="absolute top-2 left-6 w-40 h-20 bg-blue-500 rounded-full opacity-60"></div>
                  {/* Nav Bar center (Very Low) */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-64 h-16 bg-blue-400 rounded-full opacity-30"></div>
                  {/* Headline (Medium attention) */}
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-yellow-400 rounded-[200px] opacity-70 rotate-[-2deg]"></div>
                  {/* CTA Button (High attention hotspot) */}
                  <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-96 h-48 bg-red-600 rounded-[200px] opacity-90 shadow-[0_0_150px_red]"></div>
                  {/* Secondary Button */}
                  <div className="absolute bottom-[20%] right-[25%] w-48 h-32 bg-orange-500 rounded-full opacity-60"></div>
                  
                  {/* Gaze path trace lines */}
                  <svg className="absolute inset-0 w-full h-full overflow-visible opacity-60">
                     <path d="M 100 60 Q 400 100 500 250 T 400 500" fill="none" stroke="red" strokeWidth="6" strokeDasharray="15 15" />
                     {/* Fixation 1 */}
                     <circle cx="100" cy="60" r="15" fill="blue" />
                     {/* Fixation 2 */}
                     <circle cx="500" cy="250" r="30" fill="yellow" />
                     {/* Fixation 3 - The CTA */}
                     <circle cx="400" cy="500" r="40" fill="red" className="animate-ping" />
                  </svg>
               </div>
               
               {/* Advanced 3D Gaze Cone Visualization Overlay for tech flair */}
               <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center opacity-40 mix-blend-screen" style={{ transform: 'perspective(800px) rotateX(30deg) rotateY(-10deg) scale(1.5)'}}>
                  <div className="w-[600px] h-[600px] border-[2px] border-[#f85149] border-dashed rounded-full animate-[spin_20s_linear_infinite] blur-[1px]"></div>
                  <div className="absolute w-[600px] h-[600px] border-[4px] border-[#f85149] border-dotted rounded-full animate-[spin_15s_linear_infinite_reverse] blur-[2px]"></div>
                  <div className="absolute w-[1200px] h-[1px] bg-[#f85149] rotate-45 blur-[4px]"></div>
                  <div className="absolute w-[1200px] h-[1px] bg-[#f85149] -rotate-45 blur-[4px]"></div>
               </div>
            </div>
         </div>
      </div>
   );
}

function DynamicTokenizer() {
   return (
      <div className="flex h-full">
         <div className="w-80 bg-[#161b22] border-r border-[#30363d] flex flex-col z-10 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
            <div className="h-14 border-b border-[#30363d] flex items-center px-5 bg-[#0d1117] justify-between shrink-0">
               <span className="text-[12px] font-bold text-[#bc8cff] uppercase tracking-widest flex items-center gap-2"><Code2 size={16}/> Design Tokens Base</span>
               <button className="text-[#8b949e] hover:text-white bg-[#21262d] p-1 rounded border border-[#30363d]"><Plus size={14}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-8 text-[#c9d1d9]">
               {/* Semantic Colors */}
               <div className="space-y-4">
                  <div className="text-[11px] uppercase font-bold text-[#8b949e] border-b border-[#30363d] pb-2 flex justify-between items-center">
                     Semantic Colors <Settings2 size={12} className="cursor-pointer hover:text-white"/>
                  </div>
                  <div className="flex flex-col gap-3 font-mono text-[11px]">
                     <div className="flex items-center justify-between group cursor-text p-1 hover:bg-[#21262d] rounded -mx-1 px-2 transition-colors">
                        <div className="flex items-center gap-3"><div className="w-5 h-5 rounded border border-[#30363d] bg-[#3fb950] shadow-inner"></div> <span className="text-[#58a6ff]">primary.success</span></div>
                        <span className="opacity-0 group-hover:opacity-100 text-[#8b949e] text-[9px] uppercase font-sans font-bold">Edit</span>
                     </div>
                     <div className="flex items-center justify-between group cursor-text bg-[#0d1117] -mx-2 px-3 py-2 rounded-lg border border-[#bc8cff]/40 shadow-[0_0_15px_rgba(188,140,255,0.1)]">
                        <div className="flex items-center gap-3"><div className="w-5 h-5 rounded border border-white bg-[#58a6ff] shadow-[0_0_10px_#58a6ff]"></div> <span className="text-white font-bold">brand.accent</span></div>
                        <span className="text-white font-bold bg-[#161b22] px-2 py-0.5 rounded border border-[#30363d]">#58a6ff</span>
                     </div>
                     <div className="flex items-center justify-between group cursor-text p-1 hover:bg-[#21262d] rounded -mx-1 px-2 transition-colors">
                        <div className="flex items-center gap-3"><div className="w-5 h-5 rounded border border-[#30363d] bg-[#161b22] shadow-inner"></div> <span className="text-[#58a6ff]">surface.raised</span></div>
                        <span className="opacity-0 group-hover:opacity-100 text-[#8b949e] text-[9px] uppercase font-sans font-bold">Edit</span>
                     </div>
                  </div>
               </div>

               {/* Typography Scale */}
               <div className="space-y-4">
                  <div className="text-[11px] uppercase font-bold text-[#8b949e] border-b border-[#30363d] pb-2 text-left">Typography Scale</div>
                  <div className="flex flex-col gap-3 font-mono text-[10px]">
                     <div className="flex items-center justify-between hover:bg-[#21262d] p-1.5 rounded -mx-1.5 transition-colors cursor-pointer">
                        <span className="text-[#58a6ff]">text.heading.lg</span>
                        <span className="text-[#8b949e]">48px / 1.1 / -0.02em</span>
                     </div>
                     <div className="flex flex-col bg-[#0d1117] -mx-2 p-3 rounded-lg border border-[#30363d] shadow-inner gap-2">
                        <div className="flex items-center justify-between">
                           <span className="text-white font-bold text-[11px]">text.body.base</span>
                           <span className="text-[#58a6ff] font-bold bg-[#161b22] px-2 py-0.5 rounded border border-[#30363d]">Edit Details</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[9px]">
                           <div className="flex flex-col"><span className="text-[#8b949e] font-sans">Size</span><span className="text-white border border-[#30363d] bg-[#161b22] px-1 py-1 rounded">16px</span></div>
                           <div className="flex flex-col"><span className="text-[#8b949e] font-sans">Line Height</span><span className="text-white border border-[#30363d] bg-[#161b22] px-1 py-1 rounded">1.5</span></div>
                           <div className="flex flex-col"><span className="text-[#8b949e] font-sans">Weight</span><span className="text-white border border-[#30363d] bg-[#161b22] px-1 py-1 rounded">400 (Req)</span></div>
                           <div className="flex flex-col"><span className="text-[#8b949e] font-sans">Letter Spacing</span><span className="text-white border border-[#30363d] bg-[#161b22] px-1 py-1 rounded">0em</span></div>
                        </div>
                     </div>
                     <div className="flex items-center justify-between hover:bg-[#21262d] p-1.5 rounded -mx-1.5 transition-colors cursor-pointer">
                        <span className="text-[#58a6ff]">text.caption.sm</span>
                        <span className="text-[#8b949e]">12px / 1.4 / +0.05em</span>
                     </div>
                  </div>
               </div>

               {/* Spacing Hierarchy */}
               <div className="space-y-4">
                  <div className="text-[11px] uppercase font-bold text-[#8b949e] border-b border-[#30363d] pb-2 text-left">Spacing Core Hierarchy</div>
                  <div className="flex gap-2 items-end h-16 pt-2">
                     <div className="w-4 bg-[#bc8cff] rounded-t-sm relative group cursor-pointer hover:bg-[#d2a8ff] transition-colors" style={{ height: '10%'}}><div className="hidden group-hover:block absolute bottom-full mb-2 bg-white text-black font-bold font-sans text-[9px] px-1.5 py-0.5 rounded shadow-lg z-50 whitespace-nowrap">space.1 (4px)</div></div>
                     <div className="w-4 bg-[#bc8cff] rounded-t-sm cursor-pointer hover:bg-[#d2a8ff] transition-colors" style={{ height: '20%'}}></div>
                     <div className="w-5 bg-[#bc8cff] rounded-t-sm cursor-pointer hover:bg-[#d2a8ff] transition-colors" style={{ height: '30%'}}></div>
                     <div className="w-6 bg-[#bc8cff] rounded-t-md border-t-2 border-l-2 border-r-2 border-white shadow-[0_0_15px_#bc8cff] cursor-pointer ring-2 ring-[#bc8cff]/50 ring-offset-2 ring-offset-[#161b22] relative group z-10" style={{ height: '40%'}}>
                        <div className="absolute bottom-full mb-3 bg-[#bc8cff] text-black font-bold font-sans text-[10px] px-2 py-0.5 rounded shadow-[0_0_10px_#bc8cff] z-50 whitespace-nowrap left-1/2 -translate-x-1/2 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-[#bc8cff]">
                           space.4 (16px) Active
                        </div>
                     </div>
                     <div className="w-6 bg-[#bc8cff] rounded-t-md opacity-60 cursor-pointer hover:opacity-100 transition-opacity" style={{ height: '60%'}}></div>
                     <div className="w-8 bg-[#bc8cff] rounded-t-md opacity-40 cursor-pointer hover:opacity-100 transition-opacity" style={{ height: '80%'}}></div>
                     <div className="w-10 bg-[#bc8cff] rounded-t-lg opacity-20 cursor-pointer hover:opacity-100 transition-opacity" style={{ height: '100%'}}></div>
                  </div>
               </div>
            </div>

            <div className="p-4 border-t border-[#30363d] bg-[#0a0a0a] space-y-3 z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
               <button className="w-full py-2 bg-gradient-to-r from-[#bc8cff] to-[#8a2be2] text-white font-bold text-[12px] rounded-lg transition-transform hover:scale-[1.02] shadow-[0_0_15px_rgba(188,140,255,0.4)] flex items-center justify-center gap-2 uppercase tracking-wide">
                  <Code2 size={14}/> Force Export All
               </button>
               <div className="flex gap-2">
                  <button className="flex-1 py-1.5 border border-[#30363d] hover:border-[#58a6ff] hover:text-[#58a6ff] text-[#8b949e] font-bold text-[10px] rounded transition-colors uppercase">CSS Vars</button>
                  <button className="flex-1 py-1.5 border border-[#30363d] hover:border-[#58a6ff] hover:text-[#58a6ff] text-[#8b949e] font-bold text-[10px] rounded transition-colors uppercase">Tailwind</button>
               </div>
            </div>
         </div>

         <div className="flex-1 bg-[#050505] p-6 flex flex-col relative overflow-hidden">
             {/* Header File mock */}
             <div className="absolute top-4 left-4 text-[10px] uppercase font-bold text-[#8b949e] flex items-center gap-2 bg-[#0d1117] px-3 py-1.5 rounded-full border border-[#30363d]"><Code2 size={12}/> Live JSON Schema Compilation</div>
             <div className="absolute top-4 right-4 text-[11px] text-[#3fb950] font-mono flex items-center gap-1.5 bg-[#3fb950]/10 border border-[#3fb950]/30 px-3 py-1.5 rounded-full"><CheckCircle2 size={12}/> Strict Schema Valid</div>
             
             <div className="mt-16 bg-[#0d1117] border border-[#30363d] rounded-xl flex-1 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden w-full max-w-5xl mx-auto ring-1 ring-white/5">
                <div className="h-12 bg-[#161b22] border-b border-[#30363d] flex items-center px-2 gap-1 text-[11px] font-mono text-[#8b949e]">
                   <div className="px-4 py-2 bg-[#0d1117] text-white border-t-2 border-[#bc8cff] rounded-t-md mx-1 shadow-sm font-bold flex items-center gap-2">tokens.json <span className="text-[9px] bg-[#30363d] text-[#c9d1d9] px-1 rounded">Primary</span></div>
                   <div className="px-4 py-2 hover:bg-[#21262d] rounded-md cursor-pointer transition-colors mx-1">theme.css</div>
                   <div className="px-4 py-2 hover:bg-[#21262d] rounded-md cursor-pointer transition-colors mx-1">tailwind.config.ts</div>
                   <div className="px-4 py-2 hover:bg-[#21262d] rounded-md cursor-pointer transition-colors mx-1 text-[#e3b341]">UMG_StyleOverrides.cpp</div>
                   <div className="flex-1"></div>
                   <button className="p-2 hover:text-white mr-2"><Settings2 size={14}/></button>
                </div>
                
                {/* Code Window with line numbers */}
                <div className="flex-1 flex overflow-hidden">
                   <div className="w-12 bg-[#0a0a0a] border-r border-[#30363d] py-6 flex flex-col items-end pr-2 font-mono text-[12px] text-[#484f58] select-none opacity-60">
                      {Array.from({length: 30}).map((_, i) => <div key={i} className="leading-relaxed">{i+1}</div>)}
                   </div>
                   <div className="p-6 flex-1 overflow-y-auto custom-scrollbar font-mono text-[13px] leading-relaxed text-[#c9d1d9] whitespace-pre tabular-nums">
{`<span className="text-[#ff7b72]">{</span>
  <span className="text-[#8b949e]">"$schema"</span>: <span className="text-[#a5d6ff]">"https://design-tokens.app/schema.json"</span>,
  <span className="text-[#e3b341]">"version"</span>: <span className="text-[#a5d6ff]">"1.0.0"</span>,
  <span className="text-[#e3b341]">"name"</span>: <span className="text-[#a5d6ff]">"Apex Omni-Theme Base"</span>,
  <span className="text-[#e3b341]">"theme"</span>: <span className="text-[#ff7b72]">{</span>
    <span className="text-[#79c0ff]">"colors"</span>: <span className="text-[#ff7b72]">{</span>
      <span className="text-[#7ee787]">"brand"</span>: <span className="text-[#ff7b72]">{</span>
        <span className="text-[#ff7b72]">"accent"</span>: <span className="text-[#ff7b72]">{</span>
          <span className="text-[#e3b341]">"value"</span>: <span className="text-[#a5d6ff]">"#58a6ff"</span>,
          <span className="text-[#e3b341]">"type"</span>: <span className="text-[#a5d6ff]">"color"</span>,
          <span className="text-[#e3b341]">"description"</span>: <span className="text-[#a5d6ff]">"Primary interaction color globally."</span>
        <span className="text-[#ff7b72]">}</span>,
        <span className="text-[#ff7b72]">"background"</span>: <span className="text-[#ff7b72]">{</span>
          <span className="text-[#e3b341]">"value"</span>: <span className="text-[#a5d6ff]">"#0a0a0a"</span>,
          <span className="text-[#e3b341]">"type"</span>: <span className="text-[#a5d6ff]">"color"</span>
        <span className="text-[#ff7b72]">}</span>
      <span className="text-[#ff7b72]">}</span>,
      <span className="text-[#7ee787]">"surface"</span>: <span className="text-[#ff7b72]">{</span>
        <span className="text-[#ff7b72]">"raised"</span>: <span className="text-[#ff7b72]">{</span>
          <span className="text-[#e3b341]">"value"</span>: <span className="text-[#a5d6ff]">"#161b22"</span>,
          <span className="text-[#e3b341]">"type"</span>: <span className="text-[#a5d6ff]">"color"</span>
        <span className="text-[#ff7b72]">}</span>
      <span className="text-[#ff7b72]">}</span>
    <span className="text-[#ff7b72]">}</span>,
    <span className="text-[#79c0ff]">"typography"</span>: <span className="text-[#ff7b72]">{</span>
      <span className="text-[#7ee787]">"body_base"</span>: <span className="text-[#ff7b72]">{</span>
        <span className="text-[#e3b341]">"fontFamily"</span>: { <span className="text-[#e3b341]">"value"</span>: <span className="text-[#a5d6ff]">"Inter, sans-serif"</span> },
        <span className="text-[#e3b341]">"fontSize"</span>: { <span className="text-[#e3b341]">"value"</span>: <span className="text-[#a5d6ff]">"16px"</span> },
        <span className="text-[#e3b341]">"lineHeight"</span>: { <span className="text-[#e3b341]">"value"</span>: <span className="text-[#a5d6ff]">"1.5"</span> }
      <span className="text-[#ff7b72]">}</span>
    <span className="text-[#ff7b72]">}</span>,
    <span className="text-[#79c0ff]">"spacing"</span>: <span className="text-[#ff7b72]">{</span>
      <span className="text-[#e3b341]">"4"</span>: { <span className="text-[#e3b341]">"value"</span>: <span className="text-[#a5d6ff]">"16px"</span>, <span className="text-[#e3b341]">"type"</span>: <span className="text-[#a5d6ff]">"dimension"</span> }
    <span className="text-[#ff7b72]">}</span>
  <span className="text-[#ff7b72]">}</span>
<span className="text-[#ff7b72]">}</span>`}
                   </div>
                </div>
             </div>
         </div>
      </div>
   );
}

function HapticEditor() {
   return (
      <div className="flex flex-col h-full bg-[#050505] p-6 justify-center items-center relative overflow-hidden">
         {/* Background Grid */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(227,179,65,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(227,179,65,0.05)_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>
         
         <div className="relative z-10 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-[#e3b341]/10 rounded-full border-[2px] border-[#e3b341]/30 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(227,179,65,0.2)]">
               <Fingerprint size={40} className="text-[#e3b341]"/>
            </div>
            <h1 className="text-white text-[32px] font-bold tracking-tight mb-2 uppercase font-sans">Core Haptic Engine</h1>
            <p className="text-[#8b949e] text-[14px] mb-10 max-w-lg">Design and output platform-agnostic vibration patterns bound precisely to UI states and interactions. Syncs perfectly with audio layers.</p>
         </div>
         
         <div className="w-full max-w-4xl bg-[#161b22]/90 backdrop-blur-xl border border-[#30363d] p-8 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-10 relative">
            <div className="absolute top-0 right-10 w-40 h-2 bg-[#e3b341] rounded-b-lg shadow-[0_5px_15px_rgba(227,179,65,0.6)]"></div>
            
            <div className="flex justify-between items-end mb-6 border-b border-[#30363d] pb-4">
               <div className="flex items-center gap-6">
                  <button className="bg-gradient-to-r from-[#e3b341] to-[#d4a020] hover:scale-105 transition-transform text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[13px] shadow-[0_10px_20px_rgba(227,179,65,0.3)] flex items-center gap-2">
                     <Play size={16} className="fill-black"/> Simulate Pattern
                  </button>
                  <div className="flex flex-col">
                     <span className="text-[#8b949e] text-[10px] uppercase font-bold tracking-widest mb-1">Target Action</span>
                     <select className="bg-[#0d1117] border border-[#30363d] text-white px-4 py-2 rounded-lg outline-none font-bold text-[12px] appearance-none cursor-pointer w-48 focus:border-[#e3b341]">
                        <option>Success Confirmation</option>
                        <option>Error Shake</option>
                        <option>Toggle switch</option>
                        <option>Slider notch click</option>
                     </select>
                  </div>
               </div>
               <div className="flex flex-col text-right bg-[#0a0a0a] border border-[#30363d] px-4 py-2 rounded-lg">
                  <span className="text-[#8b949e] text-[9px] uppercase font-bold tracking-widest">Calculated Latency Limit</span>
                  <span className="text-[#3fb950] font-mono text-[20px] font-bold">12.4ms</span>
               </div>
            </div>

            {/* Massive Waveform Editor */}
            <div className="bg-[#0a0a0a] border border-[#30363d] h-48 rounded-xl flex items-center relative overflow-hidden shadow-inner group">
               <span className="absolute top-3 left-4 text-[#8b949e] font-bold text-[11px] uppercase tracking-widest z-20 flex items-center gap-2">
                  <AudioWaveform size={14}/> Linear Resonant Actuator Envelope
               </span>
               
               {/* Grid */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d_1px,transparent_1px)] bg-[size:40px_100%] opacity-40"></div>
               <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#30363d_1px,transparent_1px)] bg-[size:100%_25%] opacity-20"></div>

               {/* Center Zero line */}
               <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#8b949e] opacity-30"></div>
               
               {/* The Waveform Curve */}
               <svg className="w-full h-full text-[#e3b341] absolute inset-0 drop-shadow-[0_0_10px_rgba(227,179,65,0.8)] filter transition-all pt-8" preserveAspectRatio="none" viewBox="0 0 1000 100">
                  <defs>
                     <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(227,179,65,0.4)" />
                        <stop offset="100%" stopColor="rgba(227,179,65,0)" />
                     </linearGradient>
                  </defs>
                  <path d="M0,50 C50,50 60,10 80,10 C100,10 110,80 130,80 C150,80 160,20 180,20 C200,20 250,50 1000,50" fill="url(#waveGrad)" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                  
                  {/* Anchor points */}
                  <circle cx="80" cy="10" r="4" fill="white" className="cursor-pointer hover:r-[6]" />
                  <circle cx="130" cy="80" r="4" fill="white" className="cursor-pointer hover:r-[6]" />
                  <circle cx="180" cy="20" r="4" fill="white" className="cursor-pointer hover:r-[6]" />
               </svg>

               {/* Sweeping playhead */}
               <div className="absolute top-0 bottom-0 left-[18%] w-px bg-white shadow-[0_0_15px_white] z-30">
                  <div className="absolute -top-1 -translate-x-1/2 rounded bg-white text-black font-bold font-mono text-[8px] px-1 py-0.5">180ms</div>
               </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-6">
               <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 text-center cursor-pointer hover:border-[#e3b341]/50 hover:bg-[#e3b341]/5 transition-colors">
                  <div className="text-[12px] text-white font-bold mb-1">Sharp (AHAP)</div>
                  <div className="text-[10px] text-[#8b949e]">High freq, short</div>
               </div>
               <div className="bg-[#161b22] border border-[#e3b341] rounded-lg p-3 text-center shadow-[inset_0_0_15px_rgba(227,179,65,0.1)] relative">
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#e3b341]"></div>
                  <div className="text-[12px] text-[#e3b341] font-bold mb-1">Heavy Pop</div>
                  <div className="text-[10px] text-[#8b949e]">Mid freq, strong</div>
               </div>
               <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 text-center cursor-pointer hover:border-[#e3b341]/50 hover:bg-[#e3b341]/5 transition-colors">
                  <div className="text-[12px] text-white font-bold mb-1">Soft Swell</div>
                  <div className="text-[10px] text-[#8b949e]">Low freq, smooth</div>
               </div>
               <div className="bg-[#21262d] border border-[#30363d] rounded-lg p-3 text-center cursor-pointer hover:bg-[#30363d] transition-colors flex items-center justify-center text-[#c9d1d9] font-bold text-[11px] gap-2">
                  <Code2 size={14}/> View JSON
               </div>
            </div>
         </div>
      </div>
   );
}

function MultiversePreview() {
   return (
      <div className="flex flex-col h-full bg-[#050505] p-6 overflow-hidden relative">
         <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
            <h1 className="text-white text-[28px] font-bold tracking-tight mb-1 flex items-center gap-3"><Monitor size={24} className="text-[#58a6ff]"/> Multiverse Responsive Engine</h1>
            <p className="text-[#8b949e] text-[13px] bg-[#161b22]/80 backdrop-blur px-4 py-2 rounded-lg border border-[#30363d]">Change 1 property here, update instantly on 50 simultaneous localized displays.</p>
         </div>

         {/* Toolbar Control Bottom */}
         <div className="absolute inset-x-0 bottom-8 flex justify-center z-30">
            <div className="bg-[#161b22]/90 border border-[#30363d] rounded-full px-8 py-3 flex items-center gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl text-[12px] font-bold">
               <span className="text-white cursor-pointer flex items-center gap-2 hover:text-[#58a6ff] transition-colors"><Monitor size={16}/> Desktop 1080p</span>
               <span className="text-white cursor-pointer flex items-center gap-2 hover:text-[#58a6ff] transition-colors"><Smartphone size={16}/> iPhone 14 Pro</span>
               <span className="text-white cursor-pointer flex items-center gap-2 hover:text-[#58a6ff] transition-colors"><Smartphone size={16} className="rotate-90"/> Tablet Land</span>
               <div className="w-px h-5 bg-[#30363d]"></div>
               <span className="text-[#3fb950] flex items-center gap-2 bg-[#3fb950]/10 px-3 py-1 rounded-full border border-[#3fb950]/30 shadow-[0_0_10px_rgba(63,185,80,0.2)]"><RefreshCcw size={14} className="animate-spin-slow"/> Live Sync ON</span>
            </div>
         </div>

         {/* Multiple Device Viewports arranged in 3D Space */}
         <div className="flex-1 flex flex-wrap gap-12 items-center justify-center mt-12 scale-[0.85] origin-top w-full max-w-[1800px] mx-auto perspective-[1200px]">
            
            {/* Apple Watch mockup */}
            <div className="flex flex-col items-center gap-4 transition-transform hover:-translate-y-4 duration-500 relative" style={{ transform: 'rotateY(15deg) translateZ(-100px)'}}>
               <div className="w-[180px] h-[220px] bg-black border-[6px] border-[#30363d] rounded-[40px] flex flex-col items-center justify-center shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50 z-20 pointer-events-none"></div>
                  <span className="absolute -top-8 text-[11px] text-[#8b949e] font-bold uppercase tracking-widest w-[200px] text-center">WatchOS (44mm)</span>
                  <div className="w-12 h-12 bg-[#58a6ff] rounded-full flex items-center justify-center text-black font-bold mb-3 shadow-[0_0_15px_#58a6ff]">Buy</div>
                  <div className="w-20 h-2 bg-[#30363d] rounded-full"></div>
                  {/* Cursor sync marker */}
                  <div className="absolute top-[40%] left-[60%] w-4 h-4 bg-red-500 rounded-full opacity-0 group-hover:opacity-60 transition-opacity blur-[3px] z-50"></div>
               </div>
            </div>
            
            {/* Mobile Foldable Display */}
            <div className="flex flex-col items-center gap-4 transition-transform hover:-translate-y-4 duration-500 relative z-10" style={{ transform: 'rotateY(5deg) scale(1.1)'}}>
               <div className="w-[340px] h-[400px] bg-black border-[8px] border-[#21262d] rounded-3xl flex flex-col p-5 shadow-[0_40px_80px_rgba(0,0,0,0.9)] relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-2xl"></div>
                  <span className="absolute -top-8 text-[11px] text-[#8b949e] font-bold uppercase tracking-widest w-[300px] text-center">Foldable (Inner Display)</span>
                  <div className="flex-1 border-2 border-dashed border-[#30363d] rounded-xl mb-5 flex items-center justify-center text-[#8b949e] font-bold">Content Area</div>
                  <div className="h-14 bg-[#58a6ff] rounded-xl flex items-center justify-center text-black font-extrabold tracking-widest uppercase shadow-[0_0_20px_rgba(88,166,255,0.4)] text-[14px]">Confirm Purchase</div>
                  {/* Cursor sync marker */}
                  <div className="absolute top-[85%] left-1/2 w-5 h-5 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-80 transition-opacity blur-[3px] z-50"></div>
               </div>
            </div>
            
            {/* Curved Ultrawide Display Mock */}
            <div className="flex flex-col items-center gap-4 transition-transform hover:-translate-y-4 duration-500 relative" style={{ transform: 'rotateY(-15deg) translateZ(-50px)'}}>
               <div className="w-[700px] h-[350px] bg-[#050505] border-[6px] border-[#21262d] rounded-[30px] flex p-8 shadow-[0_40px_100px_rgba(0,0,0,0.9)] relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
                  <span className="absolute -top-8 left-10 text-[11px] text-[#8b949e] font-bold uppercase tracking-widest">Curved Ultrawide (32:9)</span>
                  {/* Fake UI Sidebar */}
                  <div className="w-1/3 border-r border-[#30363d] pr-6 h-full flex flex-col gap-4 relative z-10">
                     <div className="h-8 bg-[#21262d] w-1/2 rounded-md"></div>
                     <div className="h-3 bg-[#161b22] w-full rounded-full"></div>
                     <div className="h-3 bg-[#161b22] w-3/4 rounded-full"></div>
                     <div className="h-3 bg-[#161b22] w-5/6 rounded-full"></div>
                     <div className="mt-auto h-32 bg-[#161b22] rounded-xl"></div>
                  </div>
                  {/* Fake UI Content */}
                  <div className="flex-1 px-12 flex flex-col justify-end items-end h-full relative z-10 pb-6">
                     <div className="w-full h-full border-2 border-dashed border-[#161b22] rounded-xl mb-6"></div>
                     <div className="px-20 h-14 bg-[#58a6ff] rounded-xl flex items-center justify-center text-black font-extrabold tracking-widest uppercase shadow-[0_0_30px_rgba(88,166,255,0.4)] text-[14px]">Confirm Purchase</div>
                  </div>
                  {/* Cursor sync marker */}
                  <div className="absolute bottom-[44px] right-[140px] w-6 h-6 bg-red-500 rounded-full opacity-0 group-hover:opacity-80 transition-opacity blur-[4px] z-50"></div>
               </div>
            </div>

         </div>
      </div>
   );
}
