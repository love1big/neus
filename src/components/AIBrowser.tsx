import React, { useState, useEffect } from 'react';
import { Globe, Lock, ShieldCheck, Activity, Cpu, Network, Zap, EyeOff, Code, FileJson, Server, RefreshCw, ChevronLeft, ChevronRight, X, AlertTriangle, Eye, ShieldAlert, Wifi, HardDrive, Filter, PowerOff, Binary } from 'lucide-react';

export default function AIBrowser() {
  const [url, setUrl] = useState('https://docs.unrealengine.com/5.3/en-US/');
  const [inputUrl, setInputUrl] = useState('https://docs.unrealengine.com/5.3/en-US/');
  const [viewMode, setViewMode] = useState<'visual' | 'semantic' | 'raw'>('semantic');
  const [isLoading, setIsLoading] = useState(false);
  const [ramUsage, setRamUsage] = useState(0.85); // MB
  const [hardLimit, setHardLimit] = useState(true);
  const [domDepth, setDomDepth] = useState(4);
  const [activeTab, setActiveTab] = useState<'network'|'ai'>('ai');

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRamUsage(0.12);
    setTimeout(() => {
      setUrl(inputUrl);
      setIsLoading(false);
      setRamUsage(Math.random() * 0.5 + 0.5); // 0.5-1.0MB
    }, 1500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRamUsage(prev => {
         let next = prev + (Math.random() * 0.04 - 0.02);
         if (hardLimit && next > 1.5) next = 1.5;
         if (next < 0.1) next = 0.1;
         return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [hardLimit]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-[#58a6ff]/30">
      
      {/* Top Browser Chrome */}
      <div className="flex flex-col border-b border-[#30363d] bg-[#161b22] shrink-0">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#21262d]">
          <div className="flex items-center gap-3 text-[#8b949e]">
             <span className="flex items-center gap-2 text-[13px] font-bold text-white"><Globe size={16} className="text-[#58a6ff]"/> Quantum AI Proxy Browser</span>
             <span className="px-2 py-0.5 rounded bg-[#3fb950]/10 border border-[#3fb950]/30 text-[#3fb950] text-[10px] font-mono tracking-wide uppercase flex items-center gap-1"><ShieldCheck size={10}/> Air-Gapped Sandbox Active</span>
             <span className="px-2 py-0.5 rounded bg-[#bc8cff]/10 border border-[#bc8cff]/30 text-[#bc8cff] text-[10px] font-mono tracking-wide uppercase flex items-center gap-1"><Cpu size={10}/> Nano-Ram Cap: 2.0MB</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <span className="text-[#8b949e]">Allocated Pool:</span>
                <span className={ramUsage > 1.5 ? "text-[#f85149] font-bold drop-shadow-[0_0_5px_rgba(248,81,73,0.8)] animate-pulse" : "text-[#58a6ff]"}>{ramUsage.toFixed(2)} MB / 2.00 MB</span>
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-mono ml-4">
                <label className="text-[#8b949e] flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" checked={hardLimit} onChange={e => setHardLimit(e.target.checked)} className="accent-[#f85149]" /> 
                  <span className={hardLimit ? "text-[#f85149] font-bold" : ""}>Enforce Node Pruning</span>
                </label>
             </div>
             <div className="h-4 w-[1px] bg-[#30363d] ml-2"></div>
             <button className="text-[#f85149] hover:bg-[#f85149]/10 p-1 rounded transition-colors ml-1" title="Terminate Sandbox"><PowerOff size={14} /></button>
          </div>
        </div>

        {/* Address Bar */}
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="flex gap-1 shrink-0">
             <button className="p-1.5 text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded transition-colors"><ChevronLeft size={16} /></button>
             <button className="p-1.5 text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded transition-colors"><ChevronRight size={16} /></button>
             <button className={`p-1.5 rounded transition-colors ${isLoading ? 'text-[#58a6ff] animate-spin' : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'}`} onClick={() => setIsLoading(true)}>
               <RefreshCw size={16} />
             </button>
          </div>
          
          <form onSubmit={handleNavigate} className="flex-1 flex gap-2">
             <div className="flex-1 flex items-center bg-[#0d1117] border border-[#30363d] rounded px-3 py-1 gap-2 focus-within:border-[#58a6ff] transition-colors shadow-inner">
               <Lock size={12} className="text-[#3fb950] shrink-0" />
               <input 
                 type="text" 
                 value={inputUrl}
                 onChange={(e) => setInputUrl(e.target.value)}
                 className="bg-transparent border-none outline-none text-[13px] w-full font-mono text-[#c9d1d9]"
                 placeholder="Enter URL to scrape for AI context..."
               />
               <span className="text-[10px] text-[#8b949e] bg-[#21262d] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 border border-[#30363d]">Proxy Tunnel</span>
               <span className="text-[10px] text-[#ff7b72] bg-[#f85149]/10 px-1.5 py-0.5 rounded font-bold flex items-center gap-1 shrink-0 border border-[#f85149]/30 whitespace-nowrap"><ShieldAlert size={10}/> Aegis Active</span>
             </div>
             <div className="w-[120px] flex items-center bg-[#0d1117] border border-[#30363d] rounded px-2 focus-within:border-[#e3b341]">
               <span className="text-[#8b949e] text-[9px] font-mono shrink-0 mr-2">DOM Depth</span>
               <input type="number" value={domDepth} onChange={(e) => setDomDepth(Number(e.target.value))} className="w-full bg-transparent border-none outline-none text-[#e3b341] text-[11px] font-mono text-right" min="1" max="10"/>
             </div>
          </form>
          
          <button className="px-4 py-1 bg-[#238636] hover:bg-[#2ea043] font-mono rounded text-[11px] font-bold text-white transition-colors tracking-wide shadow" onClick={() => (document.querySelector('form') as HTMLFormElement).requestSubmit()}>
            SCRAPE
          </button>
        </div>

        {/* Bookmarks Bar */}
        <div className="flex items-center gap-3 px-3 py-1 bg-[#0d1117] border-t border-[#21262d] text-[11px] text-[#8b949e] font-sans">
           <span className="font-bold flex items-center gap-1 hover:text-[#c9d1d9] cursor-pointer"><span className="text-[#e3b341]">★</span> Bookmarks:</span>
           <button onClick={() => { setInputUrl('https://docs.unrealengine.com/5.3/en-US/'); handleNavigate({preventDefault: () => {}} as any); }} className="hover:text-white transition-colors hover:underline">UE5 Docs</button>
           <div className="w-[1px] h-3 bg-[#30363d]"></div>
           <button onClick={() => { setInputUrl('https://github.com/EpicGames/UnrealEngine'); handleNavigate({preventDefault: () => {}} as any); }} className="hover:text-white transition-colors hover:underline">GitHub: EpicGames</button>
           <div className="w-[1px] h-3 bg-[#30363d]"></div>
           <button onClick={() => { setInputUrl('https://stackoverflow.com/questions/tagged/unreal-engine4'); handleNavigate({preventDefault: () => {}} as any); }} className="hover:text-white transition-colors hover:underline">StackOverflow</button>
           <div className="w-[1px] h-3 bg-[#30363d]"></div>
           <button onClick={() => { setInputUrl('https://dev.epicgames.com/community/'); handleNavigate({preventDefault: () => {}} as any); }} className="hover:text-white transition-colors hover:underline">Epic Dev Community</button>
        </div>
        
        {/* Anti-Bloat Filters View */}
        <div className="flex items-center gap-4 px-4 py-1.5 border-t border-[#21262d] text-[10px] font-mono tracking-wider overflow-x-auto hide-scrollbar bg-[#161b22]">
           <div className="flex items-center gap-1.5 text-[#f85149] font-bold relative group cursor-help">
              <Filter size={12} />
              <span>HARDWARE PRUNING ACTIVE</span>
              <div className="absolute top-full left-0 mt-2 bg-[#161b22] border border-[#30363d] p-3 rounded shadow-xl whitespace-nowrap z-50 hidden group-hover:block">
                 <p className="text-[#c9d1d9] font-bold mb-2 border-b border-[#30363d] pb-1">Resource Culling Rules:</p>
                 <ul className="space-y-1 text-[#8b949e] list-disc pl-4 font-sans text-[11px]">
                   <li className="text-[#ff7b72] font-bold mt-1 max-w-[280px] whitespace-normal">Aegis Neuro-Firewall: 100% Ads, Popups, and Video Tracking forcibly blocked to guarantee uninterrupted AI learning.</li>
                   <li className="text-[#3fb950] font-bold max-w-[280px] whitespace-normal">Zero-Interruption Policy: All modal dialogs and cookie banners automatically suppressed.</li>
                   <li>React / Vue VDOM diffing completely bypassed.</li>
                   <li>WASM binary execution nullified at socket level.</li>
                   <li>All &lt;canvas&gt; elements deleted from tree.</li>
                   <li>Depth restriction &gt; {domDepth} nodes triggers flattening.</li>
                 </ul>
              </div>
           </div>
           <div className="flex gap-2 shrink-0">
              <span className="bg-[#f85149]/10 text-[#f85149] px-1.5 py-0.5 rounded flex items-center gap-1 border border-[#f85149]/30 font-bold"><ShieldAlert size={10} /> Ads & Trackers Blocked</span>
              <span className="bg-[#161b22] text-[#8b949e] px-1.5 py-0.5 rounded flex items-center gap-1 border border-[#30363d]"><CheckIcon color="#3fb950" /> JS Blocked</span>
              <span className="bg-[#161b22] text-[#8b949e] px-1.5 py-0.5 rounded flex items-center gap-1 border border-[#30363d]"><CheckIcon color="#3fb950" /> WebGL Nullified</span>
              <span className="bg-[#161b22] text-[#8b949e] px-1.5 py-0.5 rounded flex items-center gap-1 border border-[#30363d]"><CheckIcon color="#3fb950" /> Media Dropped</span>
              <span className="bg-[#161b22] text-[#8b949e] px-1.5 py-0.5 rounded flex items-center gap-1 border border-[#30363d]"><CheckIcon color="#3fb950" /> CSS Stripped</span>
           </div>
           <div className="ml-auto flex items-center gap-2 text-[#8b949e] shrink-0">
              <Network size={12} className="text-[#a5d6ff]"/> Network Payload: <span className="text-[#c9d1d9] font-bold">14.2 KB</span> <span className="text-[#f85149] line-through text-[9px]">(Prev 3.4 MB)</span>
              <span className="px-1.5 py-0.5 bg-[#bc8cff]/10 text-[#bc8cff] border border-[#bc8cff]/30 rounded ml-2">99.8% RAM SAVED</span>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: The "Browser" Engine View */}
        <div className="flex-1 flex flex-col border-r border-[#30363d] relative bg-white">
           {/* Navigation tabs for AI Data Vision */}
           <div className="absolute top-2 right-2 flex bg-[#161b22]/90 backdrop-blur border border-[#30363d] rounded-lg p-1 z-10 shadow-lg">
              <button 
                 onClick={() => setViewMode('visual')}
                 className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded transition-colors ${viewMode === 'visual' ? 'bg-[#21262d] text-white shadow' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}
              >
                 <Eye size={14}/> Human View (Simulated)
              </button>
              <button 
                 onClick={() => setViewMode('semantic')}
                 className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded transition-colors ${viewMode === 'semantic' ? 'bg-[#58a6ff]/20 text-[#58a6ff] shadow' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}
              >
                 <Binary size={14}/> Node Semantic View
              </button>
              <button 
                 onClick={() => setViewMode('raw')}
                 className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded transition-colors ${viewMode === 'raw' ? 'bg-[#bc8cff]/20 text-[#bc8cff] shadow' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}
              >
                 <Code size={14}/> Sanitized DOM
              </button>
           </div>

           {isLoading ? (
             <div className="flex-1 flex items-center justify-center bg-[#0d1117]">
                <div className="flex flex-col items-center gap-4">
                   <div className="w-16 h-16 border-4 border-[#30363d] border-t-[#58a6ff] rounded-full animate-spin"></div>
                   <div className="text-[#8b949e] font-mono text-[12px] animate-pulse">Establishing Secure Socket... Isolating DOM Nodes...</div>
                </div>
             </div>
           ) : viewMode === 'visual' ? (
             <div className="flex-1 p-6 overflow-y-auto text-black font-sans leading-relaxed pointer-events-none custom-scrollbar">
                <div className="max-w-4xl mx-auto border-b border-gray-200 pb-4 mb-6">
                   <div className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wide">Developer Documentation</div>
                   <h1 className="text-4xl font-bold mb-4 text-slate-800">C++ Programming Guide</h1>
                   <p className="text-lg text-slate-600 mb-4">Learn how to write optimized C++ code for real-time game entity components.</p>
                </div>
                <div className="max-w-4xl mx-auto space-y-6">
                   <h2 className="text-2xl font-semibold text-slate-800">Memory Management</h2>
                   <p className="text-slate-700">When dealing with thousands of actors, garbage collection spikes can cause frame drops. It is highly recommended to use contiguous memory arrays and object pools.</p>
                   <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm border border-slate-200">
                     <span className="text-pink-600">void</span> AMyActor::Tick(<span className="text-pink-600">float</span> DeltaTime) {'{\n'}
                     {'  '}Super::Tick(DeltaTime);{'\n'}
                     {'  '}FVector NewLoc = GetActorLocation() + (Velocity * DeltaTime);{'\n'}
                     {'  '}SetActorLocation(NewLoc);{'\n'}
                     {'}'}
                   </div>
                   <h2 className="text-2xl font-semibold text-slate-800 mt-8">Structs vs Classes</h2>
                   <p className="text-slate-700">Use USTRUCTs for plain data that does not require pointer tracking. They allocate significantly faster than UOBJECT dynamically allocated classes.</p>
                </div>
                {/* Visual watermark */}
                <div className="fixed bottom-4 left-4 flex flex-col gap-2">
                   <div className="bg-red-500 text-white px-2 py-1 text-[10px] font-bold rounded shadow shadow-red-500/50 uppercase flex items-center gap-1 w-max">
                      <ShieldAlert size={12} /> JS Disabled via Policy
                   </div>
                   <div className="bg-[#f85149] text-white px-2 py-1 text-[10px] font-bold rounded shadow shadow-[#f85149]/50 uppercase flex items-center gap-1 w-max">
                      <ShieldAlert size={12} /> Aegis AdBlock: 48 Elements Removed
                   </div>
                </div>
             </div>
           ) : viewMode === 'semantic' ? (
             <div className="flex-1 bg-[#0d1117] p-4 overflow-y-auto custom-scrollbar font-mono text-[11px] leading-tight">
               <div className="text-[#3fb950] mb-4 flex items-center gap-2 border-b border-[#3fb950]/30 pb-2">
                 <Zap size={14}/>
                 <span>SEMANTIC TOKENIZER ACTIVE - 85% CRAM COMPRESSION</span>
               </div>
               <pre className="text-[#a5d6ff]">
{`{
  "@type": "DocumentationPage",
  "title": "C++ Programming Guide",
  "knowledge_density": "HIGH",
  "nodes": [
    {
      "intent": "Concept: Memory Management",
      "critical_facts": [
        "Mass actor iteration causes GC frame spikes.",
        "Solution: Contiguous memory arrays",
        "Solution: Object pooling"
      ],
      "code_snippet": {
        "lang": "cpp",
        "hash": "x8a92f",
        "content": "void AMyActor::Tick(float DeltaTime) {\\n  Super::Tick(DeltaTime);\\n  FVector NewLoc = GetActorLocation() + (Velocity * DeltaTime);\\n  SetActorLocation(NewLoc);\\n}"
      }
    },
    {
      "intent": "Concept: Structs vs Classes",
      "critical_facts": [
        "USTRUCTs = Plain data, no pointer tracking, faster allocation.",
        "UOBJECT = Dynamically allocated, heavier footprint."
      ]
    }
  ]
}`}
               </pre>
             </div>
           ) : (
             <div className="flex-1 bg-[#161b22] p-4 overflow-y-auto custom-scrollbar font-mono text-[10px] text-[#8b949e]">
               <pre>
{`<!DOCTYPE html>
<html lang="en">
<!-- SCRAPED VIA AIRGAP PROXY: REMOVED 14 SCRIPTS, 3 TRACKERS, 6 CSS -->
<!-- AEGIS FIREWALL: BLOCKED 24 AD DOMAINS & TRACKING PIXELS (SAVED 8.4MB) -->
<head>
  <title>C++ Programming Guide</title>
</head>
<body>
  <h1>C++ Programming Guide</h1>
  <!-- [AEGIS]: <div id="taboola-ads"> removed. -->
  <p>Learn how to write optimized C++ code for real-time game entity components.</p>
  <h2>Memory Management</h2>
  <!-- [AEGIS]: <script src="google-analytics"> removed. -->
  <p>When dealing with thousands of actors, garbage collection spikes can cause frame drops. It is highly recommended to use contiguous memory arrays and object pools.</p>
  <code>
    void AMyActor::Tick(float DeltaTime) {
      Super::Tick(DeltaTime);
      FVector NewLoc = GetActorLocation() + (Velocity * DeltaTime);
      SetActorLocation(NewLoc);
    }
  </code>
  <h2>Structs vs Classes</h2>
  <p>Use USTRUCTs for plain data that does not require pointer tracking. They allocate significantly faster than UOBJECT dynamically allocated classes.</p>
</body>
</html>`}
               </pre>
             </div>
           )}
        </div>

        {/* Right Side: AI Reasoning / Engine Logs */}
        <div className="w-[300px] shrink-0 bg-[#0d1117] flex flex-col border-l border-[#30363d]">
           <div className="flex border-b border-[#30363d] bg-[#161b22] shrink-0">
             <button 
                onClick={() => setActiveTab('ai')}
                className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${activeTab === 'ai' ? 'text-[#e3b341] border-b-2 border-[#e3b341] bg-[#0d1117]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}
             >
               <Activity size={14} /> AI Parsers
             </button>
             <button 
                onClick={() => setActiveTab('network')}
                className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${activeTab === 'network' ? 'text-[#58a6ff] border-b-2 border-[#58a6ff] bg-[#0d1117]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}
             >
               <Network size={14} /> DevTools
             </button>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
              {activeTab === 'ai' && (
                <>
                  <div className="bg-[#161b22] border border-[#30363d] rounded p-2 text-[11px]">
                     <div className="text-[#8b949e] font-bold mb-1 flex justify-between"><span>Current Mission:</span> <span className="text-[#a5d6ff]">Debug Render Loop</span></div>
                     <div className="text-[#c9d1d9]">Agent requested web search to verify "FVector allocation cost" in loop scopes.</div>
                  </div>

                  {/* Aegis Firewall Module */}
                  <div className="bg-[#161b22] border border-[#f85149]/30 rounded p-2 text-[11px] relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-[2px] h-full bg-[#f85149]"></div>
                     <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-1.5 text-[#f85149] font-bold">
                           <ShieldAlert size={14} className="animate-pulse" />
                           AEGIS NEURO-FIREWALL
                        </div>
                        <span className="text-[#8b949e] font-mono text-[9px]">v9.4.2</span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-2 mb-2 font-mono text-[9px]">
                        <div className="bg-[#0d1117] p-1.5 rounded border border-[#30363d] flex flex-col justify-center">
                           <span className="text-[#8b949e] uppercase mb-0.5">Ads Purged</span>
                           <span className="text-[#f85149] font-bold text-[12px]">1,284</span>
                        </div>
                        <div className="bg-[#0d1117] p-1.5 rounded border border-[#30363d] flex flex-col justify-center">
                           <span className="text-[#8b949e] uppercase mb-0.5">Trackers Killed</span>
                           <span className="text-[#e3b341] font-bold text-[12px]">3,492</span>
                        </div>
                        <div className="bg-[#0d1117] p-1.5 rounded border border-[#30363d] flex flex-col justify-center">
                           <span className="text-[#8b949e] uppercase mb-0.5">RAM Saved</span>
                           <span className="text-[#58a6ff] font-bold text-[12px]">142.5 MB</span>
                        </div>
                        <div className="bg-[#0d1117] p-1.5 rounded border border-[#30363d] flex flex-col justify-center">
                           <span className="text-[#8b949e] uppercase mb-0.5">CPU Cycles Saved</span>
                           <span className="text-[#3fb950] font-bold text-[12px]">~1.4B</span>
                        </div>
                     </div>

                     <div className="text-[9px] text-[#8b949e] space-y-1 font-mono border-t border-[#30363d] pt-2">
                        <div className="flex justify-between"><span>Google Syndication:</span> <span className="text-[#f85149]">BLOCKED (12 nodes)</span></div>
                        <div className="flex justify-between"><span>Taboola Network:</span> <span className="text-[#f85149]">BLOCKED (8 nodes)</span></div>
                        <div className="flex justify-between"><span>Meta Pixel:</span> <span className="text-[#f85149]">BLOCKED (1 pixel)</span></div>
                        <div className="flex justify-between"><span>Auto-Play Video AD:</span> <span className="text-[#f85149]">NULLIFIED</span></div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <div className="text-[10px] font-bold text-[#8b949e] uppercase flex justify-between">
                        <span>In-Memory Tokens</span>
                        <span className="text-[#3fb950]">142 / 8,192</span>
                     </div>
                     <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#3fb950] w-[5%] h-full"></div>
                     </div>
                  </div>
                </>
              )}

              {activeTab === 'network' && (
                <div className="space-y-2 font-mono text-[10px]">
                   <div className="text-[#fff] font-bold flex items-center justify-between border-b border-[#30363d] pb-1 mb-2">
                      <span>Network Inspector</span>
                      <span className="text-[#8b949e]">Status: Active</span>
                   </div>
                   <div className="flex justify-between text-[#8b949e] mb-1">
                      <span className="w-8">Meth</span>
                      <span className="flex-1 px-2">Path</span>
                      <span className="w-12 text-right">Size</span>
                   </div>
                   <div className="flex justify-between text-[#c9d1d9] hover:bg-[#21262d] p-1 rounded">
                      <span className="text-[#58a6ff] font-bold w-8">GET</span>
                      <span className="flex-1 truncate px-2 text-[#3fb950]">en-US/</span>
                      <span className="w-12 text-right">12.1 KB</span>
                   </div>
                   <div className="flex justify-between text-[#8b949e] line-through hover:bg-[#21262d] p-1 rounded">
                      <span className="text-[#f85149] font-bold w-8">GET</span>
                      <span className="flex-1 truncate px-2 text-[#f85149]">metrics.js</span>
                      <span className="w-12 text-right">Block</span>
                   </div>
                   <div className="flex justify-between text-[#c9d1d9] hover:bg-[#21262d] p-1 rounded">
                      <span className="text-[#bc8cff] font-bold w-8">DOM</span>
                      <span className="flex-1 truncate px-2 text-[#c9d1d9]">Sanitize Elements</span>
                      <span className="w-12 text-right">0.8 KB</span>
                   </div>
                   <div className="flex justify-between text-[#8b949e] line-through hover:bg-[#21262d] p-1 rounded">
                      <span className="text-[#f85149] font-bold w-8">GET</span>
                      <span className="flex-1 truncate px-2 text-[#f85149]">ad-banner.png</span>
                      <span className="w-12 text-right">Block</span>
                   </div>

                   <div className="mt-4 pt-2 border-t border-[#30363d]">
                      <div className="text-[#fff] font-bold mb-2">Proxy Console Logs</div>
                      <div className="space-y-1">
                        <div className="flex gap-2">
                           <span className="text-[#58a6ff] shrink-0">13:14:02</span>
                           <span className="text-[#c9d1d9] break-all">Node connection secured via SSH tunnel.</span>
                        </div>
                        <div className="flex gap-2">
                           <span className="text-[#e3b341] shrink-0">13:14:02</span>
                           <span className="text-[#e3b341] break-all">[Aegis] Purged React Fiber tree. Retaining raw HTML.</span>
                        </div>
                        <div className="flex gap-2">
                           <span className="text-[#3fb950] shrink-0">13:14:03</span>
                           <span className="text-[#3fb950] break-all">Ready for LLM inference.</span>
                        </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="space-y-2 pt-2 border-t border-[#30363d]">
                   <div className="text-[#fff] text-[11px] font-bold mb-2 flex items-center justify-between">
                      <span>Proxy Logs</span>
                      <span className="bg-[#f85149]/20 border border-[#f85149]/50 text-[#f85149] px-1.5 py-0.5 rounded text-[8px] font-mono animate-pulse">48 ADS BLOCKED</span>
                   </div>
                   
                   <div className="flex gap-2 text-[10px] font-mono">
                     <span className="text-[#58a6ff]">13:14:02</span>
                     <span className="text-[#c9d1d9] flex-1">GET /docs/cpp-guide <span className="text-[#3fb950]">200 OK</span></span>
                   </div>
                   <div className="flex gap-2 text-[10px] font-mono">
                     <span className="text-[#f85149]">13:14:02</span>
                     <span className="text-[#f85149] flex-1">Aegis Firewall: Intercepted 14 popup ads. AI learning interruption prevented.</span>
                   </div>
                   <div className="flex gap-2 text-[10px] font-mono">
                     <span className="text-[#f85149]">13:14:02</span>
                     <span className="text-[#f85149] flex-1">Aegis Firewall: Nullified autoplay video ad (Saved 8.4MB RAM).</span>
                   </div>
                   <div className="flex gap-2 text-[10px] font-mono">
                     <span className="text-[#e3b341]">13:14:02</span>
                     <span className="text-[#8b949e] flex-1">Stripped React/NextJS bundles.</span>
                   </div>
                   <div className="flex gap-2 text-[10px] font-mono">
                     <span className="text-[#e3b341]">13:14:02</span>
                     <span className="text-[#8b949e] flex-1">Stripped 4.2MB of WebGL Contexts.</span>
                   </div>
                   <div className="flex gap-2 text-[10px] font-mono">
                     <span className="text-[#58a6ff]">13:14:03</span>
                     <span className="text-[#c9d1d9] flex-1">DOM Tree conversion complete.</span>
                   </div>
                   <div className="flex gap-2 text-[10px] font-mono">
                     <span className="text-[#3fb950]">13:14:03</span>
                     <span className="text-[#3fb950] flex-1">Vector DB Context Injected.</span>
                   </div>
                </div>
              )}
           </div>
           
           <div className="p-3 bg-[#161b22] border-t border-[#30363d]">
              <button className="w-full py-2 bg-[#58a6ff]/10 hover:bg-[#58a6ff]/20 border border-[#58a6ff]/30 text-[#58a6ff] text-[11px] font-bold rounded transition-colors flex items-center justify-center gap-2">
                 <FileJson size={14} /> Send Semantic JSON to Swarm
              </button>
           </div>
        </div>
      </div>

    </div>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
