import React, { useState, useEffect, useRef } from 'react';
import { 
  Orbit, 
  Wind, 
  Droplets, 
  Thermometer, 
  Activity,
  Moon,
  Sun,
  Eye,
  AlertTriangle,
  Settings2,
  RefreshCw,
  Cpu,
  Layers,
  Database,
  BarChart,
  EyeOff,
  Skull,
  Waves
} from 'lucide-react';

interface CelestialState {
  timeOfDay: number;
  moonPhase: number;
  solarActivity: number;
  temperature: number;
}

interface GranularState {
  oxidationRate: number; // Metal rust
  putrefactionRate: number; // Biological decay
  erosionRate: number; // Soil/Rock erosion
}

interface NeuroState {
  pupilDilation: number;
  auditoryHallucination: number;
  stamina: number;
  toxinLevel: number;
}

export default function UniversalCelestialMechanics() {
  const [activeTab, setActiveTab] = useState<'celestial' | 'granular' | 'neuro'>('celestial');
  const [isPlaying, setIsPlaying] = useState(true);
  
  const [celestial, setCelestial] = useState<CelestialState>({
    timeOfDay: 12.0,
    moonPhase: 0.5,
    solarActivity: 45,
    temperature: 20
  });

  const [granular, setGranular] = useState<GranularState>({
    oxidationRate: 0.1,
    putrefactionRate: 0.05,
    erosionRate: 0.02
  });

  const [neuro, setNeuro] = useState<NeuroState>({
    pupilDilation: 1.0,
    auditoryHallucination: 0.0,
    stamina: 100,
    toxinLevel: 0
  });

  // Simulation Loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCelestial(prev => {
        let newTime = prev.timeOfDay + 0.1;
        if (newTime >= 24) newTime = 0;
        
        let newMoon = prev.moonPhase + 0.001;
        if (newMoon > 1) newMoon = 0;

        // Temperature drops at night
        const targetTemp = newTime > 6 && newTime < 18 ? 25 + (prev.solarActivity * 0.1) : -5;
        const newTemp = prev.temperature + (targetTemp - prev.temperature) * 0.05;

        return {
          ...prev,
          timeOfDay: newTime,
          moonPhase: newMoon,
          temperature: newTemp
        };
      });

      setNeuro(prev => {
        // Snow blindness logic if very bright
        const brightness = celestial.timeOfDay > 8 && celestial.timeOfDay < 16 ? 1.5 : 0.2;
        const targetDilation = 1.0 / Math.max(brightness, 0.1);
        
        // Hallucination if cold and low stamina
        const targetHallucination = (celestial.temperature < 0 && prev.stamina < 20) ? Math.min(1.0, prev.auditoryHallucination + 0.1) : Math.max(0, prev.auditoryHallucination - 0.05);

        return {
          ...prev,
          pupilDilation: prev.pupilDilation + (targetDilation - prev.pupilDilation) * 0.1,
          auditoryHallucination: targetHallucination,
          stamina: Math.max(0, prev.stamina - (celestial.temperature < 0 ? 0.5 : 0.1))
        };
      });
      
    }, 100); // 10 ticks per second

    return () => clearInterval(interval);
  }, [isPlaying, celestial.timeOfDay, celestial.temperature, celestial.solarActivity]);

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-sans">
      {/* Header */}
      <div className="flex-none p-4 border-b border-[#30363d] bg-[#161b22] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
            <Orbit size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Universal Celestial Mechanics & Granular Decay</h1>
            <p className="text-xs text-[#8b949e]">Advanced Astro-Physics & Entropy Engine</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded text-xs font-bold \${isPlaying ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'} border border-transparent hover:border-current transition-colors`}
          >
            {isPlaying ? 'PAUSE SIMULATION' : 'RESUME SIMULATION'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        
        {/* Left Sidebar - Tabs */}
        <div className="w-64 border-r border-[#30363d] bg-[#161b22]/50 p-4 flex flex-col gap-2 overflow-y-auto">
          <div className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider mb-2">Simulation Subsystems</div>
          
          <button 
            onClick={() => setActiveTab('celestial')}
            className={`flex items-center gap-3 w-full text-left p-3 rounded-md transition-all \${activeTab === 'celestial' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-[#8b949e] hover:bg-[#30363d]/50 hover:text-[#c9d1d9]'}`}
          >
            <Sun size={16} />
            <div className="flex-1">
              <div className="text-sm font-medium">Celestial Dynamics</div>
              <div className="text-[10px] opacity-70">Tides, Time, Sun/Moon</div>
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('granular')}
            className={`flex items-center gap-3 w-full text-left p-3 rounded-md transition-all \${activeTab === 'granular' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-[#8b949e] hover:bg-[#30363d]/50 hover:text-[#c9d1d9]'}`}
          >
            <Activity size={16} />
            <div className="flex-1">
              <div className="text-sm font-medium">Entropy & Decay</div>
              <div className="text-[10px] opacity-70">Oxidation, Putrefaction</div>
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('neuro')}
            className={`flex items-center gap-3 w-full text-left p-3 rounded-md transition-all \${activeTab === 'neuro' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-[#8b949e] hover:bg-[#30363d]/50 hover:text-[#c9d1d9]'}`}
          >
            <BrainCircuitIcon />
            <div className="flex-1">
              <div className="text-sm font-medium">Neuro-Sensory</div>
              <div className="text-[10px] opacity-70">Hallucination, HDR Vision</div>
            </div>
          </button>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto bg-[#0d1117] p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {activeTab === 'celestial' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 pb-2 border-b border-[#30363d]">
                  <Orbit className="text-indigo-400" />
                  <h2 className="text-xl font-bold text-white">Orbital & Celestial Mechanics</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Time of Day */}
                  <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-white"><Sun size={16} className="text-yellow-500"/> Local Time (24h)</div>
                      <span className="font-mono text-indigo-400">{celestial.timeOfDay.toFixed(2)}h</span>
                    </div>
                    <input 
                      type="range" min="0" max="24" step="0.1" 
                      value={celestial.timeOfDay} 
                      onChange={(e) => setCelestial({...celestial, timeOfDay: parseFloat(e.target.value)})}
                      className="w-full accent-indigo-500" 
                    />
                    <div className="mt-4 p-3 bg-black/30 rounded border border-[#30363d] text-xs text-[#8b949e]">
                      Controls the position of the directional light, global illumination, and triggers nocturnal NPC behaviors.
                    </div>
                  </div>

                  {/* Moon Phase */}
                  <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-white"><Moon size={16} className="text-blue-300"/> Moon Phase / Tide Force</div>
                      <span className="font-mono text-blue-400">{(celestial.moonPhase * 100).toFixed(1)}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="1" step="0.01" 
                      value={celestial.moonPhase} 
                      onChange={(e) => setCelestial({...celestial, moonPhase: parseFloat(e.target.value)})}
                      className="w-full accent-blue-500" 
                    />
                    <div className="mt-4 p-3 bg-black/30 rounded border border-[#30363d] text-xs text-[#8b949e]">
                      Drives the global tidal simulation (water level offsets up to 2.5m) and increases monster aggressiveness during full moons (100%).
                    </div>
                  </div>
                  
                  {/* Climate Temp */}
                  <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-white"><Thermometer size={16} className={celestial.temperature < 0 ? 'text-blue-400' : 'text-red-500'}/> Ambient Temp</div>
                      <span className="font-mono text-white">{celestial.temperature.toFixed(1)}°C</span>
                    </div>
                    <div className="h-2 w-full bg-[#30363d] rounded-full overflow-hidden">
                       <div 
                         className={`h-full \${celestial.temperature < 0 ? 'bg-blue-500' : 'bg-red-500'} transition-all`}
                         style={{ width: `\${Math.min(100, Math.max(0, (celestial.temperature + 20) * 2))}%` }}
                       ></div>
                    </div>
                    <div className="mt-4 p-3 bg-black/30 rounded border border-[#30363d] text-xs text-[#8b949e]">
                      Drops rapidly at night. Extreme cold (&lt;0°C) accelerates stamina drain and triggers hypothermia mechanics.
                    </div>
                  </div>
                </div>

                {/* Live Data Visualizer */}
                <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg">
                   <h3 className="text-sm font-bold text-white mb-4">Real-time Tidal Output Log</h3>
                   <div className="font-mono text-[11px] text-[#8b949e] bg-black/50 p-4 rounded border border-[#30363d] h-40 overflow-y-auto whitespace-pre-wrap">
                     {`[Engine] Base Water Level: 120.00m\n`}
                     {`[Celestial] Moon Phase: ${celestial.moonPhase.toFixed(3)}\n`}
                     {`[Physics] Tidal Offset: ${(Math.sin(celestial.moonPhase * Math.PI * 2) * 2.5).toFixed(3)}m\n`}
                     {`[Physics] Final Ocean Level: ${(120.0 + Math.sin(celestial.moonPhase * Math.PI * 2) * 2.5).toFixed(3)}m\n`}
                     {`[Event] ${(Math.sin(celestial.moonPhase * Math.PI * 2) * 2.5) > 1.5 ? 'WARNING: High Tide flooding coastal regions!' : 'Tides are stable.'}`}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'granular' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 pb-2 border-b border-[#30363d]">
                  <Activity className="text-orange-400" />
                  <h2 className="text-xl font-bold text-white">Granular Decay & Entropy</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2"><AlertTriangle size={16} className="text-orange-500"/> Accelerated Oxidation</h3>
                    <p className="text-xs text-[#8b949e] mb-4">Iron weapons dynamically rust when exposed to moisture or acids. Weapons shatter upon 100% oxidation.</p>
                    <div className="flex justify-between items-center mb-1 text-[11px] font-mono">
                       <span>Rust Propagation</span>
                       <span className="text-orange-400">{(granular.oxidationRate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#30363d] rounded-full overflow-hidden mb-4">
                       <div className="h-full bg-orange-500" style={{ width: `\${Math.min(100, granular.oxidationRate * 100)}%` }}></div>
                    </div>
                    <button 
                      onClick={() => setGranular(p => ({...p, oxidationRate: Math.min(1.0, p.oxidationRate + 0.1)}))}
                      className="w-full py-2 bg-[#30363d] hover:bg-[#40464d] text-white text-xs rounded transition-colors"
                    >
                      Expose to Acid
                    </button>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2"><Skull size={16} className="text-green-500"/> Organic Putrefaction</h3>
                    <p className="text-xs text-[#8b949e] mb-4">Biological matter decays based on humidity/temp, spawning toxic miasma clouds and drawing insect swarms.</p>
                    <div className="flex justify-between items-center mb-1 text-[11px] font-mono">
                       <span>Decay Level</span>
                       <span className="text-green-400">{(granular.putrefactionRate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#30363d] rounded-full overflow-hidden mb-4">
                       <div className="h-full bg-green-500" style={{ width: `\${Math.min(100, granular.putrefactionRate * 100)}%` }}></div>
                    </div>
                    <button 
                      onClick={() => setGranular(p => ({...p, putrefactionRate: Math.min(1.0, p.putrefactionRate + 0.15)}))}
                      className="w-full py-2 bg-[#30363d] hover:bg-[#40464d] text-white text-xs rounded transition-colors"
                    >
                      Advance Biological Time
                    </button>
                  </div>
                </div>

                {/* Micro-particle visualizer (mock) */}
                <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg h-48 relative overflow-hidden flex items-center justify-center">
                   <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                   <div className="text-center z-10">
                     <Cpu size={32} className="mx-auto text-[#8b949e] mb-2 opacity-50" />
                     <div className="text-sm font-bold text-[#c9d1d9]">Entropy Engine Active</div>
                     <div className="text-xs text-[#8b949e] font-mono mt-1">Processing {Math.floor(granular.oxidationRate * 50000)} active decay nodes in world bounds</div>
                   </div>
                </div>

              </div>
            )}

            {activeTab === 'neuro' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 pb-2 border-b border-[#30363d]">
                  <Eye className="text-rose-400" />
                  <h2 className="text-xl font-bold text-white">Neuro-Sensory Feedback</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4"><EyeOff size={16} className="text-purple-400"/> Pupil Dilation (HDR)</h3>
                      <div className="flex justify-between items-center mb-1 text-[11px] font-mono">
                         <span>Dilation Multiplier</span>
                         <span className="text-purple-400">{neuro.pupilDilation.toFixed(2)}x</span>
                      </div>
                      <div className="w-full h-12 bg-black rounded-lg border border-[#30363d] flex items-center justify-center relative overflow-hidden">
                         <div className="absolute w-full h-full bg-white transition-opacity duration-700" style={{ opacity: Math.max(0, (neuro.pupilDilation - 1.0) / 4.0) }}></div>
                         <div className="text-[10px] font-bold z-10 mix-blend-difference text-white">
                           {neuro.pupilDilation > 2.0 ? 'SNOW BLINDNESS (OVEREXPOSED)' : 'ADAPTED'}
                         </div>
                      </div>
                      <p className="text-[11px] text-[#8b949e] mt-3">Simulates the eye adjusting when exiting a dark cave into bright snow. Over-dilation causes temporary bloom blindness.</p>
                   </div>

                   <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4"><Activity size={16} className="text-rose-500"/> Auditory Paranoia</h3>
                      <div className="flex justify-between items-center mb-1 text-[11px] font-mono">
                         <span>Hallucination Severity</span>
                         <span className="text-rose-400">{(neuro.auditoryHallucination * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#30363d] rounded-full overflow-hidden mb-2">
                         <div className="h-full bg-rose-500" style={{ width: `\${neuro.auditoryHallucination * 100}%` }}></div>
                      </div>
                      <p className="text-[11px] text-[#8b949e] mt-3">Triggers phantom footstep audio and whispers when Stamina is low during freezing temperatures.</p>
                      
                      <div className="mt-4">
                        <button onClick={() => setNeuro(p => ({...p, stamina: 100}))} className="px-3 py-1 bg-[#30363d] hover:bg-[#40464d] rounded text-xs text-white">Restore Stamina</button>
                      </div>
                   </div>
                </div>

                <div className="bg-red-900/20 border border-red-500/30 p-5 rounded-lg relative overflow-hidden">
                   {neuro.auditoryHallucination > 0.5 && (
                     <div className="absolute inset-0 bg-red-500/5 animate-pulse mix-blend-overlay pointer-events-none"></div>
                   )}
                   <h3 className="text-sm font-bold text-red-400 mb-2">Sensory Override State</h3>
                   <div className="font-mono text-xs text-red-300/70">
                     {neuro.auditoryHallucination > 0.5 ? 
                        "[WARNING] Severe Hypothermia & Fatigue detected. Auditory cortex failing. Phantom sounds injected into audio listener buffer." : 
                        "Neural pathways stable. Audio rendering normal."}
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

function BrainCircuitIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
      <path d="M9 13a4.5 4.5 0 0 0 3-4"/>
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
      <path d="M6 18a4 4 0 0 1-1.967-.516"/>
      <path d="M12 13h4"/>
      <path d="M12 18h6a2 2 0 0 1 2 2v1"/>
      <path d="M12 8h8"/>
      <path d="M16 8V5a2 2 0 0 1 2-2"/>
      <circle cx="16" cy="13" r=".5"/>
      <circle cx="18" cy="3" r=".5"/>
      <circle cx="20" cy="21" r=".5"/>
      <circle cx="20" cy="8" r=".5"/>
    </svg>
  );
}
