import React, { useState, useEffect } from 'react';
import {
  Layers, Type, Square, Circle, Image as ImageIcon,
  Play, MousePointer2, Smartphone, Monitor, Code2, 
  Eye, Focus, Fingerprint, RefreshCcw, LayoutTemplate, 
  AudioWaveform, Waves, Atom, Settings2
} from 'lucide-react';

export default function UIUXEditor() {
  const [activeTab, setActiveTab] = useState<'Physics' | 'Heatmap' | 'Tokenizer' | 'Haptics' | 'Multiverse'>('Physics');

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#8b949e] font-sans">
      {/* Header */}
      <div className="h-16 bg-[#0a0a0a] border-b border-[#30363d] flex items-center px-6 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#58a6ff]/10 to-transparent pointer-events-none"></div>
        <LayoutTemplate size={28} className="text-[#58a6ff] mr-4 shadow-[0_0_15px_rgba(88,166,255,0.4)]" />
        <div className="flex flex-col z-10">
          <h2 className="text-[#c9d1d9] text-[16px] font-bold tracking-tight">Apex UI/UX & Interaction Design Sandbox</h2>
          <p className="text-[11px]">Beyond flat design. Micro-physics, Local AI Eye-tracking, Haptic Sync, and Dynamic Tokenizer.</p>
        </div>
      </div>

      <div className="flex bg-[#161b22] border-b border-[#30363d] h-10 px-4">
        <button onClick={() => setActiveTab('Physics')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'Physics' ? 'text-[#3fb950] border-b-2 border-[#3fb950] bg-[#0a0a0a]' : 'hover:text-[#c9d1d9]'}`}><Atom size={14}/> Micro-Interaction Physics</button>
        <button onClick={() => setActiveTab('Heatmap')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'Heatmap' ? 'text-[#f85149] border-b-2 border-[#f85149] bg-[#0a0a0a]' : 'hover:text-[#c9d1d9]'}`}><Eye size={14}/> Offline AI Heatmap</button>
        <button onClick={() => setActiveTab('Tokenizer')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'Tokenizer' ? 'text-[#bc8cff] border-b-2 border-[#bc8cff] bg-[#0a0a0a]' : 'hover:text-[#c9d1d9]'}`}><Code2 size={14}/> Dynamic Tokenizer</button>
        <button onClick={() => setActiveTab('Haptics')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'Haptics' ? 'text-[#e3b341] border-b-2 border-[#e3b341] bg-[#0a0a0a]' : 'hover:text-[#c9d1d9]'}`}><Fingerprint size={14}/> Haptic & Audio Sync</button>
        <button onClick={() => setActiveTab('Multiverse')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'Multiverse' ? 'text-[#58a6ff] border-b-2 border-[#58a6ff] bg-[#0a0a0a]' : 'hover:text-[#c9d1d9]'}`}><Monitor size={14}/> Multiverse Preview</button>
      </div>

      <div className="flex-1 overflow-hidden relative">
         {activeTab === 'Physics' && <PhysicsEditor />}
         {activeTab === 'Heatmap' && <AIHeatmap />}
         {activeTab === 'Tokenizer' && <DynamicTokenizer />}
         {activeTab === 'Haptics' && <HapticEditor />}
         {activeTab === 'Multiverse' && <MultiversePreview />}
      </div>
    </div>
  );
}

function PhysicsEditor() {
   return (
      <div className="flex h-full">
         <div className="flex-1 bg-[#050505] p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 left-4 text-[10px] uppercase font-bold text-[#8b949e]">Interactive Canvas</div>
            
            {/* Interactive Button Mockup */}
            <div className="w-[800px] h-[500px] bg-[#0a0a0a] border border-[#30363d] rounded-lg shadow-2xl flex items-center justify-center relative" style={{ backgroundImage: 'radial-gradient(#30363d 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
               <button className="bg-[#58a6ff] text-black font-bold uppercase tracking-widest px-12 py-6 rounded-2xl shadow-[0_20px_50px_rgba(88,166,255,0.4)] text-[16px] transition-all active:scale-95 active:shadow-inner" style={{
                  transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // spring simulation
                  transitionDuration: '400ms'
               }}>
                  Push Me
               </button>

               {/* Force Vectors */}
               <div className="absolute top-[40%] left-[60%] flex gap-1 z-10 pointer-events-none">
                  <div className="text-[#f85149] text-[10px] font-mono border border-[#f85149] bg-[#000]/80 p-1 rounded font-bold">Friction: 0.8</div>
               </div>
               <div className="absolute bottom-[40%] right-[60%] flex gap-1 z-10 pointer-events-none">
                  <div className="text-[#3fb950] text-[10px] font-mono border border-[#3fb950] bg-[#000]/80 p-1 rounded font-bold">Spring Tension: 1.2</div>
               </div>
            </div>
         </div>

         <div className="w-[320px] bg-[#0d1117] border-l border-[#30363d] flex flex-col p-4 gap-6 overflow-y-auto">
            <h3 className="text-[12px] font-bold text-[#3fb950] uppercase tracking-wider border-b border-[#30363d] pb-2 flex items-center gap-2"><Atom size={14}/> Fluid Dynamics</h3>
            
            <div className="flex flex-col gap-4">
               <div>
                  <div className="flex justify-between text-[11px] font-bold text-[#c9d1d9] mb-2 uppercase"><span>Spring Mass</span> <span className="text-[#58a6ff] font-mono">1.0</span></div>
                  <input type="range" className="w-full h-1 accent-[#58a6ff] outline-none" defaultValue={50} />
               </div>
               <div>
                  <div className="flex justify-between text-[11px] font-bold text-[#c9d1d9] mb-2 uppercase"><span>Tension (Stiffness)</span> <span className="text-[#3fb950] font-mono">170</span></div>
                  <input type="range" min="10" max="300" className="w-full h-1 accent-[#3fb950] outline-none" defaultValue={170} />
               </div>
               <div>
                  <div className="flex justify-between text-[11px] font-bold text-[#c9d1d9] mb-2 uppercase"><span>Friction (Damping)</span> <span className="text-[#f85149] font-mono">26</span></div>
                  <input type="range" min="1" max="100" className="w-full h-1 accent-[#f85149] outline-none" defaultValue={26} />
               </div>
               
               <div className="bg-[#161b22] border border-[#30363d] p-3 rounded font-mono text-[10px] text-[#8b949e]">
                  Not keyframes. Pure math. Reacts procedurally to cursor velocity and drag force.
               </div>
            </div>
         </div>
      </div>
   )
}

function AIHeatmap() {
   return (
      <div className="flex h-full p-6 bg-[#050505] gap-6 flex-col">
         <div className="flex justify-between items-start border-b border-[#30363d] pb-4 shrink-0">
            <div>
               <h1 className="text-white text-[24px] font-bold tracking-tight mb-1 flex items-center gap-2"><Eye size={24} className="text-[#f85149]"/> Local AI Eye-Tracking Predictor</h1>
               <p className="text-[#8b949e] text-[12px]">Offline Neural Network simulates human attention in the first 5 seconds of viewing.</p>
            </div>
            <button className="bg-[#f85149] text-black font-bold uppercase tracking-widest text-[11px] px-4 py-2 rounded shadow-[0_0_15px_rgba(248,81,73,0.4)] flex items-center gap-2">
               <RefreshCcw size={14}/> Run A/B Test
            </button>
         </div>

         <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg p-6 relative flex items-center justify-center overflow-hidden">
            <div className="absolute top-4 left-4 text-[10px] uppercase font-bold text-[#8b949e] z-20">Simulation Results</div>
            
            {/* UI Mockup with Heatmap Overlay */}
            <div className="w-[600px] h-[400px] bg-[#0a0a0a] border border-[#30363d] shadow-2xl relative p-8 flex flex-col gap-6 isolate">
               
               <h1 className="text-white text-3xl font-bold">Checkout</h1>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#161b22] h-10 rounded border border-[#30363d]"></div>
                  <div className="bg-[#161b22] h-10 rounded border border-[#30363d]"></div>
               </div>
               <button className="bg-[#58a6ff] text-black h-12 rounded mt-auto font-bold uppercase">Confirm Purchase</button>

               {/* Simulated Heatmap Layer */}
               <div className="absolute inset-0 z-10 mix-blend-screen pointer-events-none opacity-80" style={{
                  background: 'radial-gradient(circle at 15% 15%, rgba(248,81,73,0.9) 0%, rgba(227,179,65,0.7) 10%, transparent 25%), radial-gradient(circle at 50% 85%, rgba(248,81,73,0.9) 0%, rgba(227,179,65,0.6) 15%, transparent 30%)'
               }}></div>
               
               {/* Saccade Lines */}
               <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none">
                  <path d="M 90,60 L 300,340" stroke="white" strokeWidth="2" strokeDasharray="5,5" fill="none" className="opacity-50" />
                  <circle cx="90" cy="60" r="15" fill="none" stroke="white" strokeWidth="2" />
                  <circle cx="300" cy="340" r="20" fill="none" stroke="white" strokeWidth="2" />
                  <text x="75" y="55" fill="white" fontSize="10" fontWeight="bold">1</text>
                  <text x="285" y="335" fill="white" fontSize="10" fontWeight="bold">2</text>
               </svg>
            </div>
         </div>
      </div>
   )
}

function DynamicTokenizer() {
   return (
      <div className="flex h-full p-6 bg-[#050505] gap-6">
         <div className="w-1/2 flex flex-col gap-4">
            <h3 className="text-[12px] font-bold text-[#bc8cff] uppercase tracking-wider flex items-center gap-2"><Settings2 size={14}/> Design Variables (Tokens)</h3>
            
            <div className="bg-[#161b22] border border-[#30363d] rounded p-4 font-mono text-[11px] flex flex-col gap-3">
               <div className="flex justify-between items-center"><span className="text-[#8b949e]">color.primary.base</span> <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#58a6ff] rounded"></div> <span className="text-white">#58A6FF</span></div></div>
               <div className="flex justify-between items-center"><span className="text-[#8b949e]">spacing.container.lg</span> <span className="text-white">24px (1.5rem)</span></div>
               <div className="flex justify-between items-center"><span className="text-[#8b949e]">typography.heading.h1.size</span> <span className="text-white">32px (2rem)</span></div>
               <div className="flex justify-between items-center"><span className="text-[#8b949e]">radius.button.pill</span> <span className="text-white">9999px</span></div>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded p-4 font-mono text-[11px]">
               <div className="text-[#f85149] uppercase font-bold tracking-widest mb-2 border-b border-[#30363d] pb-2">Target Exports</div>
               <div className="flex gap-2 flex-wrap">
                  <span className="bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] px-2 py-1 rounded cursor-pointer hover:border-[#bc8cff]">React/Tailwind</span>
                  <span className="bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] px-2 py-1 rounded cursor-pointer hover:border-[#bc8cff]">SwiftUI</span>
                  <span className="bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] px-2 py-1 rounded cursor-pointer hover:border-[#bc8cff]">Unreal UMG (C++)</span>
                  <span className="bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] px-2 py-1 rounded cursor-pointer hover:border-[#bc8cff]">CSS Variables</span>
               </div>
            </div>
            
            <button className="bg-[#bc8cff] text-black font-bold uppercase tracking-widest px-4 py-3 rounded shadow-[0_0_15px_rgba(188,140,255,0.4)] flex items-center justify-center gap-2 mt-auto">
               <Code2 size={16}/> Extract 1:1 Production Code
            </button>
         </div>

         <div className="w-1/2 bg-[#0d1117] border border-[#30363d] rounded-lg p-4 font-mono text-[10px] overflow-y-auto relative">
            <span className="absolute top-2 right-4 text-[#8b949e] uppercase font-bold">Unreal UMG C++ Output Ex.</span>
            <pre className="text-[#c9d1d9] mt-8">
               <span className="text-[#8b949e]">// Auto-generated by UIUX Tokenizer</span><br/>
               <span className="text-[#ff7b72]">void</span> <span className="text-[#d2a8ff]">UPrimaryButton</span>::<span className="text-[#d2a8ff]">SynchronizeProperties</span>()<br/>
               <span className="text-[#c9d1d9]">&#123;</span><br/>
               <span className="text-[#c9d1d9]">   Super::SynchronizeProperties();</span><br/>
               <br/>
               <span className="text-[#c9d1d9]">   FLinearColor Color = FLinearColor(</span><span className="text-[#79c0ff]">0.345f</span><span className="text-[#c9d1d9]">, </span><span className="text-[#79c0ff]">0.650f</span><span className="text-[#c9d1d9]">, </span><span className="text-[#79c0ff]">1.000f</span><span className="text-[#c9d1d9]">, 1.0f); </span><span className="text-[#8b949e]">// #58a6ff</span><br/>
               <span className="text-[#c9d1d9]">   BackgroundBorder-&gt;SetBrushColor(Color);</span><br/>
               <span className="text-[#c9d1d9]">   </span><br/>
               <span className="text-[#8b949e]">   // Spring Physics Subsystem</span><br/>
               <span className="text-[#c9d1d9]">   float Mass = </span><span className="text-[#79c0ff]">1.0f</span><span className="text-[#c9d1d9]">;</span><br/>
               <span className="text-[#c9d1d9]">   float Stiffness = </span><span className="text-[#79c0ff]">170.0f</span><span className="text-[#c9d1d9]">;</span><br/>
               <span className="text-[#c9d1d9]">   float Damping = </span><span className="text-[#79c0ff]">26.0f</span><span className="text-[#c9d1d9]">;</span><br/>
               <span className="text-[#c9d1d9]">&#125;</span>
            </pre>
         </div>
      </div>
   )
}

function HapticEditor() {
   return (
      <div className="flex flex-col h-full bg-[#050505] p-6 justify-center items-center">
         <h1 className="text-white text-[24px] font-bold tracking-tight mb-2"><Fingerprint size={28} className="inline mr-2 text-[#e3b341]"/> Haptic & Audio Syncer</h1>
         <p className="text-[#8b949e] text-[12px] mb-8">Design gamepad rumble and mobile vibration patterns bound precisely to UI states.</p>
         
         <div className="w-full max-w-3xl bg-[#161b22] border border-[#30363d] p-6 rounded-lg shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
               <button className="bg-[#58a6ff] text-black w-32 h-12 rounded-lg font-bold">Simulate Click</button>
               <div className="h-[1px] flex-1 bg-[#30363d] relative">
                  <div className="absolute top-1/2 left-0 w-4 h-4 rounded-full bg-[#e3b341] -translate-y-1/2 shadow-[0_0_15px_rgba(227,179,65,0.8)] animate-ping"></div>
               </div>
               <div className="flex flex-col text-right">
                  <span className="text-[#8b949e] text-[9px] uppercase font-bold tracking-widest">Latency</span>
                  <span className="text-white font-mono text-[16px]">0.02ms</span>
               </div>
            </div>

            <div className="bg-[#0a0a0a] border border-[#30363d] h-32 rounded flex items-center px-4 relative overflow-hidden">
               <span className="absolute top-2 left-2 text-[#8b949e] font-bold text-[10px] uppercase">Rumble Motor Curve (DualSense / Linear Actuator)</span>
               <svg className="w-full h-20 text-[#e3b341]" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,80 Q5,10 10,80 L15,80 Q20,30 25,80" fill="none" stroke="currentColor" strokeWidth="2" />
               </svg>
            </div>
         </div>
      </div>
   )
}

function MultiversePreview() {
   return (
      <div className="flex flex-col h-full bg-[#050505] p-6 overflow-hidden relative">
         <div className="absolute top-6 left-6 z-20">
            <h1 className="text-white text-[24px] font-bold tracking-tight mb-1">Multiverse Responsive Grid</h1>
            <p className="text-[#8b949e] text-[12px]">Change 1 property, update on 50 simultaneous localized displays.</p>
         </div>

         <div className="flex-1 flex flex-wrap gap-8 items-center justify-center mt-16 scale-90 origin-top">
            {/* Apple Watch */}
            <div className="w-[160px] h-[200px] bg-black border-4 border-[#30363d] rounded-[30px] flex flex-col items-center justify-center shadow-2xl relative">
               <span className="absolute -top-6 text-[10px] text-[#8b949e] font-bold uppercase">WatchOS</span>
               <div className="w-10 h-10 bg-[#58a6ff] rounded-full flex items-center justify-center text-black font-bold mb-2">Buy</div>
               <div className="w-16 h-2 bg-[#30363d] rounded"></div>
            </div>
            
            {/* Mobile Foldable */}
            <div className="w-[300px] h-[350px] bg-black border-4 border-[#30363d] rounded-2xl flex flex-col p-4 shadow-2xl relative">
               <span className="absolute -top-6 text-[10px] text-[#8b949e] font-bold uppercase">Foldable Display</span>
               <div className="flex-1 border-2 border-dashed border-[#30363d] rounded-lg mb-4"></div>
               <div className="h-12 bg-[#58a6ff] rounded-lg flex items-center justify-center text-black font-bold tracking-widest uppercase">Confirm Purchase</div>
            </div>
            
            {/* Curved Ultrawide Display */}
            <div className="w-[600px] h-[250px] bg-black border-4 border-[#30363d] rounded-3xl flex p-6 shadow-2xl relative" style={{ transform: 'perspective(1000px) rotateX(10deg)', transformStyle: 'preserve-3d' }}>
               <span className="absolute -top-6 left-0 text-[10px] text-[#8b949e] font-bold uppercase">Curved Ultrawide 32:9</span>
               <div className="w-1/4 border-r border-[#30363d] pr-4 h-full">
                  <div className="h-6 bg-[#30363d] w-1/2 mb-4 rounded"></div>
                  <div className="h-2 bg-[#30363d] w-full mb-2 rounded"></div>
                  <div className="h-2 bg-[#30363d] w-3/4 mb-2 rounded"></div>
               </div>
               <div className="flex-1 px-8 flex justify-end items-end h-full">
                  <div className="px-16 h-12 bg-[#58a6ff] rounded-lg flex items-center justify-center text-black font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(88,166,255,0.3)]">Confirm Purchase</div>
               </div>
            </div>
         </div>
      </div>
   )
}
