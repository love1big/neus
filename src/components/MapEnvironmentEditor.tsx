import React, { useState } from 'react';
import { Sun, Moon, CloudRain, Wind, CloudLightning, Snowflake, Cloud, Droplets, Thermometer, Flame, Star, Sunset, Sunrise, Settings, Eye, Compass, Mountain, Activity, Hexagon, Maximize, Play, Pause, FastForward } from 'lucide-react';

export default function MapEnvironmentEditor() {
  const [timeOfDay, setTimeOfDay] = useState(14.5); // 14:30
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('sky');
  
  // Format time
  const hours = Math.floor(timeOfDay);
  const minutes = Math.floor((timeOfDay - hours) * 60);
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  const getSunColor = () => {
     if (timeOfDay >= 6 && timeOfDay < 8) return 'text-[#ff944d]'; // Sunrise
     if (timeOfDay >= 8 && timeOfDay < 17) return 'text-[#f2cc60]'; // Day
     if (timeOfDay >= 17 && timeOfDay < 19) return 'text-[#ff7b72]'; // Sunset
     return 'text-[#58a6ff]'; // Night
  };

  return (
    <div className="flex-1 h-full bg-[#11111b] flex flex-col text-white">
      {/* Header */}
      <div className="h-14 border-b border-[#2a2b3d] bg-[#161621] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#f2cc60]/20 flex items-center justify-center text-[#f2cc60] border border-[#f2cc60]/30">
            <Sun size={18} />
          </div>
          <div>
            <h1 className="font-bold text-[14px]">Atmosphere & Weather Engine</h1>
            <div className="text-[10px] text-[#8b949e]">Volumetric Clouds, Global Illumination, Dynamic Climate</div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar Tabs */}
        <div className="w-[60px] border-r border-[#2a2b3d] bg-[#161621] flex flex-col items-center py-2 shrink-0 gap-2 overflow-y-auto">
          <button onClick={() => setActiveTab('sky')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'sky' ? 'bg-[#f2cc60]/20 text-[#f2cc60] border border-[#f2cc60]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Skybox & Sun">
            <Sun size={20} />
          </button>
          <button onClick={() => setActiveTab('lighting')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'lighting' ? 'bg-[#ff944d]/20 text-[#ff944d] border border-[#ff944d]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Global Illumination (GI)">
            <Flame size={20} />
          </button>
          <button onClick={() => setActiveTab('weather')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'weather' ? 'bg-[#a5d6ff]/20 text-[#a5d6ff] border border-[#a5d6ff]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Weather & Precipitation">
            <CloudRain size={20} />
          </button>
          <button onClick={() => setActiveTab('fog')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'fog' ? 'bg-[#d2a8ff]/20 text-[#d2a8ff] border border-[#d2a8ff]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Volumetric Fog">
            <Cloud size={20} />
          </button>
          <button onClick={() => setActiveTab('postprocess')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'postprocess' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Post-Processing & Color Grading">
            <Hexagon size={20} />
          </button>
        </div>

        {/* Configuration Panel */}
        <div className="w-[320px] bg-[#161621] border-r border-[#2a2b3d] flex flex-col shrink-0">
          <div className="p-4 border-b border-[#2a2b3d] bg-[#1e1e2d]">
            <h3 className="text-sm font-bold text-white mb-3">Time of Day Simulator</h3>
            <div className="flex items-center justify-between mb-2">
               <span className={`text-2xl font-bold font-mono ${getSunColor()}`}>{timeString}</span>
               <div className="flex gap-1">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="p-1.5 bg-[#2a2b3d] rounded text-gray-300 hover:text-white hover:bg-[#3b3d54]">
                     {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button className="p-1.5 bg-[#2a2b3d] rounded text-gray-300 hover:text-white hover:bg-[#3b3d54]">
                     <FastForward size={14} />
                  </button>
               </div>
            </div>
            <input 
               type="range" 
               min="0" max="23.99" step="0.01" 
               value={timeOfDay} 
               onChange={e => setTimeOfDay(parseFloat(e.target.value))}
               className={`w-full accent-[${timeOfDay > 6 && timeOfDay < 18 ? '#f2cc60' : '#58a6ff'}]`} 
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
               <span>00:00</span>
               <span>06:00</span>
               <span>12:00</span>
               <span>18:00</span>
               <span>24:00</span>
            </div>
          </div>

          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === 'sky' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-xs font-bold text-[#f2cc60] uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Sun & Skybox</h3>
                     
                     <div className="space-y-4">
                        <div>
                           <label className="flex justify-between text-xs text-gray-400 mb-2">
                              <span>Sun Intensity</span>
                              <span className="text-white font-mono">1.2x</span>
                           </label>
                           <input type="range" className="w-full accent-[#f2cc60]" min="0" max="5" step="0.1" defaultValue="1.2" />
                        </div>
                        
                        <div>
                           <label className="flex justify-between text-xs text-gray-400 mb-2">
                              <span>Sun Color (Override)</span>
                              <div className="w-4 h-4 rounded bg-white border border-gray-500"></div>
                           </label>
                           <p className="text-[10px] text-gray-500 mb-2">Usually driven automatically by Time of Day.</p>
                        </div>

                        <div>
                           <label className="flex justify-between text-xs text-gray-400 mb-1">Skybox Material</label>
                           <select className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded px-3 py-2 text-sm text-white">
                              <option>Procedural Atmosphere</option>
                              <option>HDRI: Clear Day (4K)</option>
                              <option>HDRI: Overcast (4K)</option>
                              <option>HDRI: Milky Way (8K)</option>
                              <option>Stylized Gradient</option>
                           </select>
                        </div>

                        <div>
                           <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-gray-400">Volumetric Clouds</span>
                              <input type="checkbox" defaultChecked className="accent-[#f2cc60]" />
                           </div>
                           <div className="bg-[#0a0a0f] p-3 rounded border border-[#2a2b3d] space-y-3">
                              <div>
                                 <label className="flex justify-between text-[10px] text-gray-400 mb-1">Coverage</label>
                                 <input type="range" className="w-full" defaultValue="40" />
                              </div>
                              <div>
                                 <label className="flex justify-between text-[10px] text-gray-400 mb-1">Density</label>
                                 <input type="range" className="w-full" defaultValue="75" />
                              </div>
                              <div>
                                 <label className="flex justify-between text-[10px] text-gray-400 mb-1">Wind Speed</label>
                                 <input type="range" className="w-full" defaultValue="10" />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'weather' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-xs font-bold text-[#a5d6ff] uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Dynamic Weather System</h3>
                     
                     <div className="grid grid-cols-2 gap-2 mb-4">
                        <button className="bg-[#0a0a0f] border border-[#a5d6ff]/50 rounded p-2 flex flex-col items-center gap-1 hover:bg-[#2a2b3d]">
                           <Sun size={16} className="text-[#f2cc60]" />
                           <span className="text-[10px] font-bold">Clear</span>
                        </button>
                        <button className="bg-[#58a6ff]/20 border border-[#58a6ff] rounded p-2 flex flex-col items-center gap-1 shadow-[0_0_10px_rgba(88,166,255,0.2)]">
                           <CloudRain size={16} className="text-[#58a6ff]" />
                           <span className="text-[10px] font-bold text-[#58a6ff]">Rain</span>
                        </button>
                        <button className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 flex flex-col items-center gap-1 hover:bg-[#2a2b3d]">
                           <CloudLightning size={16} className="text-purple-400" />
                           <span className="text-[10px] font-bold">Storm</span>
                        </button>
                        <button className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 flex flex-col items-center gap-1 hover:bg-[#2a2b3d]">
                           <Snowflake size={16} className="text-white" />
                           <span className="text-[10px] font-bold">Snow</span>
                        </button>
                     </div>

                     <div className="space-y-4">
                        <div>
                           <label className="flex justify-between text-xs text-gray-400 mb-2">
                              <span>Precipitation Intensity</span>
                              <span className="text-[#58a6ff] font-mono">65%</span>
                           </label>
                           <input type="range" className="w-full accent-[#58a6ff]" min="0" max="100" defaultValue="65" />
                        </div>
                        <div>
                           <label className="flex justify-between text-xs text-gray-400 mb-2">
                              <span>Puddle Accumulation Speed</span>
                              <span className="text-[#58a6ff] font-mono">0.8x</span>
                           </label>
                           <input type="range" className="w-full accent-[#58a6ff]" min="0" max="2" step="0.1" defaultValue="0.8" />
                        </div>
                        <div className="flex justify-between items-center bg-[#0a0a0f] border border-[#2a2b3d] p-3 rounded">
                           <span className="text-xs text-gray-300">Enable Lightning Strikes</span>
                           <input type="checkbox" className="accent-[#58a6ff]" />
                        </div>
                     </div>
                  </div>
               </div>
            )}
            
            {activeTab === 'postprocess' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Post-Processing Stack</h3>
                     
                     <div className="space-y-4 text-xs">
                        <div className="bg-[#0a0a0f] p-3 rounded border border-[#2a2b3d]">
                           <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-white">Bloom (Optical Blur)</span>
                              <input type="checkbox" defaultChecked className="accent-pink-500" />
                           </div>
                           <label className="flex justify-between text-[10px] text-gray-400 mb-1">Intensity</label>
                           <input type="range" className="w-full" defaultValue="30" />
                        </div>

                        <div className="bg-[#0a0a0f] p-3 rounded border border-[#2a2b3d]">
                           <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-white">Depth of Field (Bokeh)</span>
                              <input type="checkbox" defaultChecked className="accent-pink-500" />
                           </div>
                           <label className="flex justify-between text-[10px] text-gray-400 mb-1">Focal Distance</label>
                           <input type="range" className="w-full" defaultValue="50" />
                           <label className="flex justify-between text-[10px] text-gray-400 mb-1 mt-2">Aperture (f-stop)</label>
                           <input type="range" className="w-full" min="1" max="22" defaultValue="2.8" />
                        </div>

                        <div className="bg-[#0a0a0f] p-3 rounded border border-[#2a2b3d]">
                           <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-white">Color Grading (LUT)</span>
                              <input type="checkbox" defaultChecked className="accent-pink-500" />
                           </div>
                           <select className="w-full bg-[#161621] border border-[#2a2b3d] rounded px-2 py-1 text-white mb-2 mt-1">
                              <option>Film: Teal & Orange</option>
                              <option>Matrix: Green Tint</option>
                              <option>Desaturated Horror</option>
                              <option>Vibrant Fantasy</option>
                           </select>
                           <label className="flex justify-between text-[10px] text-gray-400 mb-1">LUT Contribution</label>
                           <input type="range" className="w-full" defaultValue="80" />
                        </div>
                        
                        <div className="bg-[#0a0a0f] p-3 rounded border border-[#2a2b3d] flex justify-between items-center">
                           <span className="font-bold text-white">Screen Space Reflections (SSR)</span>
                           <input type="checkbox" defaultChecked className="accent-pink-500" />
                        </div>
                        
                        <div className="bg-[#0a0a0f] p-3 rounded border border-[#2a2b3d] flex justify-between items-center">
                           <span className="font-bold text-white">Ambient Occlusion (SSAO)</span>
                           <input type="checkbox" defaultChecked className="accent-pink-500" />
                        </div>
                     </div>
                  </div>
               </div>
            )}
          </div>
        </div>

        {/* Viewport Preview Placeholder */}
        <div className="flex-1 bg-black relative flex flex-col items-center justify-center overflow-hidden">
           {/* Simulate a 3D scene rendering atmospheric effects based on state */}
           
           {/* Sky gradient based on time */}
           <div 
              className="absolute inset-0 transition-colors duration-1000"
              style={{
                 background: timeOfDay > 5 && timeOfDay < 8 ? 'linear-gradient(to bottom, #1a2a6c, #b21f1f, #fdbb2d)' : // sunrise
                             timeOfDay >= 8 && timeOfDay < 17 ? 'linear-gradient(to bottom, #4CA1AF, #2C3E50)' : // day
                             timeOfDay >= 17 && timeOfDay < 19 ? 'linear-gradient(to bottom, #2c3e50, #fd746c, #ff9068)' : // sunset
                             'linear-gradient(to bottom, #000000, #09090b, #11111b)' // night
              }}
           ></div>

           {/* Sun/Moon */}
           {timeOfDay >= 6 && timeOfDay <= 18 ? (
              <div 
                 className="absolute rounded-full bg-[#f2cc60] blur-[2px] transition-all duration-1000 shadow-[0_0_100px_rgba(242,204,96,0.8)]"
                 style={{
                    width: '100px', height: '100px',
                    left: `${((timeOfDay - 6) / 12) * 100}%`,
                    top: `${Math.sin(((timeOfDay - 6) / 12) * Math.PI) * -40 + 50}%`,
                    transform: 'translate(-50%, -50%)'
                 }}
              ></div>
           ) : (
              <div 
                 className="absolute rounded-full bg-white blur-[1px] transition-all duration-1000 shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                 style={{
                    width: '60px', height: '60px',
                    left: `${timeOfDay < 6 ? (timeOfDay / 6) * 50 : 50 + ((timeOfDay - 18) / 6) * 50}%`,
                    top: '20%',
                    transform: 'translate(-50%, -50%)'
                 }}
              ></div>
           )}

           {/* Terrain Silhouette */}
           <svg className="absolute bottom-0 w-full h-[40%] preserve-3d" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,100 L0,50 Q20,30 40,60 T80,40 L100,20 L100,100 Z" fill={timeOfDay > 6 && timeOfDay < 18 ? "#1e293b" : "#020617"} className="transition-colors duration-1000" />
           </svg>

           {/* Weather effects overlay */}
           {activeTab === 'weather' && (
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animation-rain pointer-events-none"></div>
           )}

           {/* UI Overlay */}
           <div className="absolute top-4 right-4 z-10 flex gap-2">
              <div className="bg-[#0a0a0f]/80 backdrop-blur border border-[#2a2b3d] rounded px-3 py-1.5 text-xs text-white shadow-lg flex items-center gap-2">
                 <Eye size={14} className="text-[#58a6ff]"/> Render Preview (RTX On)
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
