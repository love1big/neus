import React, { useState } from 'react';
import { Truck, Activity, Settings2, ShieldCheck, Zap, RotateCw, Car, Wind, Power } from 'lucide-react';

export default function VehicleDynamicsEditor() {
  const [activeTab, setActiveTab] = useState('physics');

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#c9d1d9]">
      {/* Header */}
      <div className="h-16 bg-[#0a0a0a] border-b border-[#30363d] flex items-center px-6 shrink-0">
        <Truck className="text-[#e3b341] mr-4 border border-[#e3b341]/30 p-2 rounded-lg bg-[#e3b341]/10" size={36} />
        <div>
          <h2 className="text-white text-[16px] font-bold tracking-tight">Advanced Vehicle Dynamics Configurator</h2>
          <p className="text-[#8b949e] text-[11px]">Next-gen wheel collision, aerodynamics, and powertrain simulation.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#161b22] border-b border-[#30363d] h-10 px-4">
        <button onClick={() => setActiveTab('physics')} className={`px-4 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 ${activeTab === 'physics' ? 'text-[#e3b341] border-b-2 border-[#e3b341]' : 'text-[#8b949e] hover:text-white'}`}>
          <Settings2 size={14}/> Core Mechanics
        </button>
        <button onClick={() => setActiveTab('engine')} className={`px-4 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 ${activeTab === 'engine' ? 'text-[#f85149] border-b-2 border-[#f85149]' : 'text-[#8b949e] hover:text-white'}`}>
          <Power size={14}/> Powertrain & Engine
        </button>
        <button onClick={() => setActiveTab('aero')} className={`px-4 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 ${activeTab === 'aero' ? 'text-[#58a6ff] border-b-2 border-[#58a6ff]' : 'text-[#8b949e] hover:text-white'}`}>
          <Wind size={14}/> Aerodynamics
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex justify-between items-center bg-[#161b22] p-4 rounded-lg border border-[#30363d]">
          <div className="flex items-center gap-3">
            <Car size={32} className="text-[#8b949e]" />
            <div>
              <div className="font-bold text-white text-[14px]">Active Chassis Profile</div>
              <div className="text-[11px] text-[#8b949e]">Model_SportsCar_GT3.obj</div>
            </div>
          </div>
          <button className="bg-[#e3b341] hover:bg-[#e3b341]/80 text-[#0a0a0a] font-bold px-4 py-2 rounded text-[12px] flex items-center gap-2 shadow-[0_0_15px_rgba(227,179,65,0.2)]">
            <Activity size={16}/> Live Telemetry
          </button>
        </div>

        {activeTab === 'physics' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Settings2 size={16} className="text-[#3fb950]"/> Suspension & Dampening</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-white">Spring Stiffness</span>
                    <span className="text-[#3fb950] font-mono">150,000 N/m</span>
                  </div>
                  <input type="range" className="w-full accent-[#3fb950]" defaultValue="70"/>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-white">Compression Damping</span>
                    <span className="text-[#3fb950] font-mono">4,500 N/m/s</span>
                  </div>
                  <input type="range" className="w-full accent-[#3fb950]" defaultValue="40"/>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-white">Rebound Damping</span>
                    <span className="text-[#3fb950] font-mono">5,200 N/m/s</span>
                  </div>
                  <input type="range" className="w-full accent-[#3fb950]" defaultValue="45"/>
                </div>
              </div>
            </div>

            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2"><RotateCw size={16} className="text-[#bc8cff]"/> Tire Friction Model (Pacejka Magic Formula)</h3>
              <div className="h-32 bg-[#161b22] border border-[#30363d] rounded mb-4 relative overflow-hidden flex items-end">
                {/* Simulated friction curve */}
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-[#bc8cff] fill-none stroke-2" preserveAspectRatio="none">
                  <path d="M0 100 C 20 20, 40 10, 100 80" />
                </svg>
                <div className="absolute top-2 right-2 text-[10px] text-[#8b949e]">Slip Angle vs Lateral Force</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <label className="flex/col text-[#8b949e]">Stiffness Factor (B)<input type="number" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1 text-white mt-1" defaultValue="10.0"/></label>
                <label className="flex/col text-[#8b949e]">Shape Factor (C)<input type="number" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1 text-white mt-1" defaultValue="1.9"/></label>
                <label className="flex/col text-[#8b949e]">Peak Factor (D)<input type="number" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1 text-white mt-1" defaultValue="1.0"/></label>
                <label className="flex/col text-[#8b949e]">Curvature Factor (E)<input type="number" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1 text-white mt-1" defaultValue="0.97"/></label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'engine' && (
          <div className="space-y-6">
             <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg">
                <div className="flex justify-between items-center border-b border-[#30363d] pb-3 mb-4">
                  <h3 className="text-white font-bold flex items-center gap-2"><Power size={18} className="text-[#f85149]"/> Engine Torque Graph</h3>
                  <div className="text-[11px] bg-[#f85149]/20 text-[#f85149] px-2 py-1 rounded font-bold border border-[#f85149]/30">V8 Twin-Turbo</div>
                </div>
                <div className="h-48 bg-[#0d1117] border border-[#30363d] rounded relative w-full mb-4 px-2 py-2 text-[#8b949e] text-[10px] flex items-end justify-between">
                   <div className="absolute bottom-20 left-10 text-[#f85149]/50 text-[50px] font-bold">TORQUE</div>
                   <div className="h-full w-full absolute inset-0 z-10 flex">
                     {/* Fake Graph */}
                     <svg viewBox="0 0 100 100" className="w-full h-full stroke-[#f85149] fill-none stroke-2 opacity-80" preserveAspectRatio="none">
                        <path d="M0 100 Q 20 20 40 15 T 80 10 T 100 60" />
                     </svg>
                   </div>
                   <span>0 RPM</span><span>2000 RPM</span><span>4000 RPM</span><span>6000 RPM</span><span>8000 RPM</span>
                </div>
                <div className="grid grid-cols-4 gap-4 text-[11px]">
                  <div><span className="text-[#8b949e] block mb-1">Max RPM</span><input type="number" defaultValue="8500" className="w-full bg-[#0d1117] border border-[#30363d] text-white p-1.5 rounded"/></div>
                  <div><span className="text-[#8b949e] block mb-1">Idle RPM</span><input type="number" defaultValue="800" className="w-full bg-[#0d1117] border border-[#30363d] text-white p-1.5 rounded"/></div>
                  <div><span className="text-[#8b949e] block mb-1">Max Torque (Nm)</span><input type="number" defaultValue="650" className="w-full bg-[#0d1117] border border-[#30363d] text-white p-1.5 rounded"/></div>
                  <div><span className="text-[#8b949e] block mb-1">Turbo Boost (Bar)</span><input type="number" defaultValue="1.2" className="w-full bg-[#0d1117] border border-[#30363d] text-white p-1.5 rounded"/></div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
