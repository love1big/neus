import React from 'react';
import { Film, Video, Scissors, HardDrive, Settings, MonitorPlay, FastForward } from 'lucide-react';

export default function VideoEncoderStudio() {
   return (
      <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans p-8">
         <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-6 flex items-center gap-3">
             <Video size={36} className="text-red-500" /> Advanced Video Encoder & Compressor
         </h1>
         
         <div className="grid grid-cols-2 gap-8 h-full">
            <div className="flex flex-col gap-6">
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
                    <h2 className="text-white font-bold mb-4 flex items-center gap-2"><Film size={18}/> Source Media</h2>
                    <div className="border-2 border-dashed border-[#30363d] rounded-lg p-10 flex flex-col items-center justify-center text-[#8b949e] hover:border-[#58a6ff] hover:bg-[#58a6ff]/5 transition cursor-pointer">
                        <HardDrive size={32} className="mb-3 opacity-50" />
                        <p className="font-bold">Drag and drop raw renders here</p>
                        <p className="text-xs mt-1">Supports MP4, AVI, MKV, ProRes, EXR seq</p>
                    </div>
                </div>
                
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 flex-1">
                    <h2 className="text-white font-bold mb-4 flex items-center gap-2"><Settings size={18}/> Encoding Settings</h2>
                    
                    <div className="space-y-4">
                        <div>
                           <label className="text-xs font-bold text-[#8b949e] uppercase mb-1 block">Codec</label>
                           <select className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-sm text-[#e6edf3]">
                               <option>H.265 / HEVC (NVENC)</option>
                               <option>H.264 / AVC (NVENC)</option>
                               <option>AV1 (Hardware Accelerated)</option>
                               <option>Apple ProRes 422 HQ</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-xs font-bold text-[#8b949e] uppercase mb-1 block">Resolution & Framerate</label>
                           <div className="flex gap-2">
                               <select className="flex-1 bg-[#0d1117] border border-[#30363d] rounded p-2 text-sm text-[#e6edf3]">
                                   <option>4K UHD (3840x2160)</option>
                                   <option>1080p FHD (1920x1080)</option>
                               </select>
                               <select className="w-24 bg-[#0d1117] border border-[#30363d] rounded p-2 text-sm text-[#e6edf3]">
                                   <option>60 FPS</option>
                                   <option>30 FPS</option>
                                   <option>24 FPS</option>
                               </select>
                           </div>
                        </div>
                        <div>
                           <label className="text-xs font-bold text-[#8b949e] uppercase mb-1 block">Bitrate Control</label>
                           <input type="range" className="w-full accent-[#58a6ff]" />
                           <div className="flex justify-between text-[#8b949e] text-xs">
                               <span>VBR</span>
                               <span>Target: 25 Mbps</span>
                               <span>CBR</span>
                           </div>
                        </div>
                    </div>
                    
                    <button className="w-full mt-8 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-3 rounded overflow-hidden shadow-lg hover:shadow-red-500/20 transition flex items-center justify-center gap-2 cursor-pointer">
                        <FastForward size={18}/> Start Encoding Queue
                    </button>
                </div>
            </div>
            
            <div className="bg-black border border-[#30363d] rounded-xl flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <MonitorPlay size={64} className="text-[#30363d]" />
                </div>
                <div className="mt-auto absolute bottom-0 w-full bg-[#161b22]/90 backdrop-blur border-t border-[#30363d] p-4 p-4 text-xs font-mono">
                    <div className="flex justify-between items-center text-[#c9d1d9] mb-2 font-bold">
                        <span>Status: IDLE</span>
                        <span className="text-[#8b949e]">GPU VRAM: 0%</span>
                    </div>
                </div>
            </div>
         </div>
      </div>
   );
}
