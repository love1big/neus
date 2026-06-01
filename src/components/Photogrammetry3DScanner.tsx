import React, { useState } from 'react';
import { 
  Camera, Video, UploadCloud, Box, Layers, Play, Settings2, Download, Zap, Loader2, Sparkles, AlertCircle, Scan,
  Cpu, HardDrive, Share2
} from 'lucide-react';

export default function Photogrammetry3DScanner() {
  const [activeTab, setActiveTab] = useState<'scan' | 'edit' | 'export'>('scan');
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scannedModel, setScannedModel] = useState<string | null>(null);
  const [quality, setQuality] = useState('ultra'); // ultra, high, medium

  const handleStartScan = () => {
    setIsScanning(true);
    setProgress(0);
    setScannedModel(null);
    
    // Simulate scan progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScannedModel('ready');
          setActiveTab('edit');
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#8b949e]">
      {/* Header */}
      <div className="h-14 bg-[#161b22] border-b border-[#30363d] flex items-center px-6 shrink-0 z-10 shadow-md">
        <Scan size={24} className="text-[#3fb950] mr-3" />
        <div className="flex flex-col">
          <h2 className="text-[#c9d1d9] text-[15px] font-bold tracking-wide">3D Photogrammetry Scanner</h2>
          <p className="text-[10px] text-[#8b949e]">สร้างโมเดล 3D จากภาพหรือวิดีโอ (สมจริงสูงสุด)</p>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-2 text-[11px] font-bold">
           <div className="bg-[#21262d] px-3 py-1.5 rounded-lg border border-[#30363d] flex flex-col items-end">
              <span className="text-[9px] text-[#8b949e] uppercase">Active Driver</span>
              <span className="text-[#58a6ff]">GPU Acceleration V2</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Controls */}
        <div className="w-[300px] bg-[#0d1117] border-r border-[#30363d] flex flex-col p-4 z-10 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
           <div className="flex bg-[#161b22] rounded-lg p-1 border border-[#30363d] mb-6 shadow-inner">
             <button onClick={() => setActiveTab('scan')} className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${activeTab === 'scan' ? 'bg-[#21262d] text-white shadow-sm border border-[#30363d]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}>1. Input</button>
             <button onClick={() => setActiveTab('edit')} className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${activeTab === 'edit' ? 'bg-[#21262d] text-white shadow-sm border border-[#30363d]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`} disabled={!scannedModel}>2. Process</button>
             <button onClick={() => setActiveTab('export')} className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${activeTab === 'export' ? 'bg-[#21262d] text-white shadow-sm border border-[#30363d]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`} disabled={!scannedModel}>3. Export</button>
           </div>

           {activeTab === 'scan' && (
             <div className="flex flex-col gap-4 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col gap-2">
                   <h3 className="text-[12px] font-bold text-white uppercase tracking-wider mb-1">Source Media</h3>
                   
                   <div className="border-2 border-dashed border-[#30363d] rounded-xl p-6 flex flex-col items-center justify-center bg-[#0a0a0a] hover:bg-[#161b22] hover:border-[#58a6ff] transition-all cursor-pointer group">
                      <div className="w-12 h-12 bg-[#21262d] rounded-full flex items-center justify-center mb-3 group-hover:bg-[#58a6ff]/20">
                         <Camera size={24} className="text-[#8b949e] group-hover:text-[#58a6ff] transition-colors"/>
                      </div>
                      <span className="text-[13px] text-[#c9d1d9] font-bold mb-1 block">Live 3D Camera Scan</span>
                      <span className="text-[10px] text-[#8b949e] text-center px-4 leading-relaxed">Connect specialized 3D scanning hardware or depth cameras.</span>
                   </div>

                   <div className="border-2 border-dashed border-[#30363d] rounded-xl p-6 flex flex-col items-center justify-center bg-[#0a0a0a] hover:bg-[#161b22] hover:border-[#3fb950] transition-all cursor-pointer group">
                      <div className="w-12 h-12 bg-[#21262d] rounded-full flex items-center justify-center mb-3 group-hover:bg-[#3fb950]/20">
                         <UploadCloud size={24} className="text-[#8b949e] group-hover:text-[#3fb950] transition-colors"/>
                      </div>
                      <span className="text-[13px] text-[#c9d1d9] font-bold mb-1 block">Upload Photos & Video</span>
                      <span className="text-[10px] text-[#8b949e] text-center px-4 leading-relaxed">Drop MP4, MOV, or ZIP of JPGs to reconstruct.</span>
                   </div>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                   <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Processing Quality</h3>
                   <select 
                     value={quality} 
                     onChange={(e) => setQuality(e.target.value)}
                     className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[12px] p-2 rounded-lg outline-none focus:border-[#58a6ff]"
                   >
                     <option value="preview">Draft Preview (Fastest)</option>
                     <option value="high">High Detail (Game Ready)</option>
                     <option value="ultra">Ultra Realistic (Cinematic - AI Enhanced)</option>
                   </select>

                   {quality === 'ultra' && (
                     <div className="flex gap-2 p-2 bg-[#2ea043]/10 border border-[#2ea043]/30 rounded-lg mt-1">
                        <Sparkles size={14} className="text-[#3fb950] shrink-0 mt-0.5" />
                        <span className="text-[10px] text-[#c9d1d9] leading-tight">AI will reconstruct missing occlusions, add micro-details (PBR textures), and relight the model to match reality exactly.</span>
                     </div>
                   )}
                </div>

                <div className="mt-auto pt-6">
                   <button 
                     onClick={handleStartScan}
                     disabled={isScanning}
                     className="w-full relative overflow-hidden group bg-gradient-to-r from-[#238636] to-[#2ea043] rounded-xl p-3 flex items-center justify-center gap-2 border border-white/10 shadow-[0_0_20px_rgba(46,160,67,0.3)] hover:shadow-[0_0_30px_rgba(46,160,67,0.5)] transition-all font-bold text-white uppercase tracking-wider text-[12px]"
                   >
                      {isScanning ? (
                         <><Loader2 size={16} className="animate-spin"/> Initializing Machine Learning...</>
                      ) : (
                         <><Scan size={16} /> Start Reconstruction</>
                      )}
                      {!isScanning && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>}
                   </button>
                </div>
             </div>
           )}

           {activeTab === 'edit' && (
             <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                 <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Post-Processing (AI)</h3>
                 
                 <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-[11px] p-2 bg-[#161b22] rounded border border-[#30363d] hover:bg-[#21262d] cursor-pointer">
                       <input type="checkbox" defaultChecked className="accent-[#58a6ff]" />
                       <span className="flex-1">AI Mesh Retopology (Quad)</span>
                    </label>
                    <label className="flex items-center gap-2 text-[11px] p-2 bg-[#161b22] rounded border border-[#30363d] hover:bg-[#21262d] cursor-pointer">
                       <input type="checkbox" defaultChecked className="accent-[#58a6ff]" />
                       <span className="flex-1">Auto UV Unwrapping</span>
                    </label>
                    <label className="flex items-center gap-2 text-[11px] p-2 bg-[#161b22] rounded border border-[#30363d] hover:bg-[#21262d] cursor-pointer">
                       <input type="checkbox" defaultChecked className="accent-[#58a6ff]" />
                       <span className="flex-1">Bake PBR Textures (Albedo, Normal, Rough)</span>
                    </label>
                    <label className="flex items-center gap-2 text-[11px] p-2 bg-[#161b22] rounded border border-[#30363d] hover:bg-[#21262d] cursor-pointer">
                       <input type="checkbox" defaultChecked className="accent-[#58a6ff]" />
                       <span className="flex-1">Remove Stray Geometry</span>
                    </label>
                 </div>
                 
                 <h3 className="text-[12px] font-bold text-white uppercase tracking-wider mt-2">Target Polygon Count</h3>
                 <input type="range" className="w-full accent-[#3fb950]" min="10" max="100" defaultValue="50"/>
                 <div className="flex justify-between text-[10px] text-[#8b949e]">
                    <span>Low Poly</span>
                    <span>High Poly</span>
                 </div>
             </div>
           )}
           
           {activeTab === 'export' && (
             <div className="flex flex-col gap-3 animate-in fade-in duration-300">
                <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Export Settings</h3>
                <div className="flex flex-col gap-2">
                   <div className="p-3 bg-[#161b22] border border-[#30363d] rounded-lg cursor-pointer hover:border-[#58a6ff] transition-colors border-[#58a6ff] bg-[#58a6ff]/5">
                      <div className="font-bold text-white text-[12px] flex justify-between"><span>.FBX format</span><Zap size={14} className="text-[#58a6ff]"/></div>
                      <div className="text-[10px] text-[#8b949e] mt-1">Ready for Game Engines (Unreal, Unity) with embedded materials.</div>
                   </div>
                   <div className="p-3 bg-[#161b22] border border-[#30363d] rounded-lg cursor-pointer hover:border-[#58a6ff] transition-colors">
                      <div className="font-bold text-white text-[12px]">.OBJ / .MTL</div>
                      <div className="text-[10px] text-[#8b949e] mt-1">Standard format for 3D modeling software (Blender, Maya).</div>
                   </div>
                   <div className="p-3 bg-[#161b22] border border-[#30363d] rounded-lg cursor-pointer hover:border-[#58a6ff] transition-colors">
                      <div className="font-bold text-white text-[12px]">.GLTF / .GLB</div>
                      <div className="text-[10px] text-[#8b949e] mt-1">Optimized for Web 3D and AR deployment.</div>
                   </div>
                </div>

                <button className="mt-auto w-full py-3 bg-[#e3b341] text-black font-bold uppercase tracking-wider text-[12px] rounded-xl shadow-[0_0_20px_rgba(227,179,65,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                   <Download size={16}/> Export Model
                 </button>
             </div>
           )}
        </div>

        {/* Main 3D Canvas Area */}
        <div className="flex-1 bg-black relative flex flex-col">
           {/* Info Bar Overlay */}
           <div className="absolute top-4 left-4 right-4 z-10 flex justify-between pointer-events-none">
              {scannedModel && (
                 <div className="bg-[#0a0a0a]/80 backdrop-blur border border-[#30363d] px-4 py-2 rounded-lg flex gap-6 text-[10px] font-mono pointer-events-auto">
                    <div className="flex flex-col"><span className="text-[#8b949e]">Vertices</span><span className="text-white font-bold">1,240,512</span></div>
                    <div className="flex flex-col"><span className="text-[#8b949e]">Faces</span><span className="text-[#e3b341] font-bold">2,480,020</span></div>
                    <div className="flex flex-col"><span className="text-[#8b949e]">Textures</span><span className="text-[#3fb950] font-bold">4k PBR (x3)</span></div>
                 </div>
              )}
           </div>

           {/* 3D Viewport Mock */}
           <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
              {/* Grid Floor */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(88,166,255,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(88,166,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)] origin-bottom pointer-events-none opacity-40"></div>

              {!isScanning && !scannedModel && (
                <div className="flex flex-col items-center justify-center text-[#8b949e] animate-pulse">
                   <Camera size={64} className="mb-4 opacity-20" />
                   <p className="text-[14px]">Waiting for media input or live camera feed...</p>
                </div>
              )}

              {isScanning && (
                <div className="flex flex-col items-center justify-center z-10 bg-black/50 p-8 rounded-2xl backdrop-blur-md border border-[#30363d] w-[400px]">
                   <div className="w-16 h-16 rounded-full border-4 border-t-[#3fb950] border-r-[#58a6ff] border-b-[#f85149] border-l-[#e3b341] animate-spin mb-6"></div>
                   <h3 className="text-white font-bold text-[16px] mb-2">Generating 3D Point Cloud</h3>
                   <p className="text-[11px] text-[#8b949e] mb-6 text-center">Using Neural Radiance Fields (NeRF) and Photogrammetry depth estimation via AI Cores.</p>
                   
                   <div className="w-full bg-[#161b22] h-2 rounded-full overflow-hidden border border-[#30363d]">
                      <div className="h-full bg-gradient-to-r from-[#58a6ff] to-[#bc8cff] transition-all duration-300" style={{ width: `${progress}%` }}></div>
                   </div>
                   <div className="w-full flex justify-between mt-2 text-[10px] font-mono font-bold">
                      <span className="text-[#58a6ff]">Processing Images...</span>
                      <span className="text-white">{progress}%</span>
                   </div>
                </div>
              )}

              {scannedModel && (
                <div className="w-[80%] h-[80%] relative flex items-center justify-center animate-in zoom-in duration-700">
                   {/* Model Wireframe/Shape Mockup */}
                   <div className="absolute w-[200px] h-[300px] bg-gradient-to-br from-[#3fb950]/20 to-[#58a6ff]/20 rounded-[40%] mix-blend-screen shadow-[0_0_50px_rgba(88,166,255,0.2)] border border-[#58a6ff]/40 animate-pulse [transform:rotateX(10deg)_rotateY(30deg)]"></div>
                   
                   <svg className="absolute w-full h-[120%] text-[#58a6ff]/50 mix-blend-screen overflow-visible drop-shadow-[0_0_15px_rgba(88,166,255,0.6)]" viewBox="0 0 400 400">
                      <path d="M150,100 L250,50 L300,150 L200,250 Z" fill="none" stroke="currentColor" strokeWidth="1" className="animate-pulse origin-center" style={{animationDelay: '0ms'}}/>
                      <path d="M100,150 L200,100 L250,200 L150,300 Z" fill="none" stroke="currentColor" strokeWidth="1" className="animate-pulse origin-center" style={{animationDelay: '100ms'}}/>
                      <path d="M200,150 L300,100 L350,200 L250,300 Z" fill="none" stroke="#3fb950" strokeWidth="1" className="animate-pulse origin-center opacity-60" style={{animationDelay: '200ms'}}/>
                       <circle cx="200" cy="200" r="120" fill="none" stroke="url(#grid-pattern)" strokeWidth="0.5" className="animate-[spin_10s_linear_infinite] origin-center" />
                       <defs>
                          <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                             <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                          </pattern>
                       </defs>
                   </svg>
                   
                   <div className="absolute right-[-20px] top-1/2 flex flex-col gap-2">
                       <button className="w-8 h-8 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center text-white hover:bg-[#58a6ff] hover:border-[#58a6ff] transition-all group shadow-lg"><Box size={14}/></button>
                       <button className="w-8 h-8 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center text-white hover:bg-[#3fb950] hover:border-[#3fb950] transition-all group shadow-lg"><Layers size={14}/></button>
                   </div>
                </div>
              )}
           </div>

        </div>
      </div>
    </div>
  );
}
