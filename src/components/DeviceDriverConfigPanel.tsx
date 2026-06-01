import React, { useState } from 'react';
import { 
  Cpu, HardDrive, Camera, Activity, Monitor, ShieldCheck, Zap, Server, Settings, Wrench, AlertTriangle, CheckCircle, Smartphone, Battery, MemoryStick, Wifi
} from 'lucide-react';

export default function DeviceDriverConfigPanel() {
  const [activeCategory, setActiveCategory] = useState<'cpu' | 'gpu' | 'ram' | 'storage' | 'camera'>('cpu');

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#8b949e]">
      {/* Header */}
      <div className="h-16 bg-[#0a0a0a] border-b border-[#30363d] flex items-center px-6 shrink-0 relative overflow-hidden text-white shadow-md">
        <Server size={28} className="text-[#58a6ff] mr-4 shadow-[0_0_15px_rgba(88,166,255,0.4)]" />
        <div className="flex flex-col z-10">
          <h2 className="text-[#c9d1d9] text-[18px] font-bold tracking-tight">Apex Hardware & Driver Control</h2>
          <p className="text-[#8b949e] text-[11px]">Manage low-level kernel drivers for CPU, GPU, RAM, SSD/HDD, and 3D Scanning Cameras.</p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Categories Sidebar */}
         <div className="w-[200px] bg-[#0d1117] border-r border-[#30363d] flex flex-col pt-4 shrink-0 shadow-[5px_0_15px_rgba(0,0,0,0.5)] z-10">
            <div className="px-3 text-[10px] uppercase font-bold text-[#8b949e] tracking-widest mb-2">Hardware Setup</div>
            
            <CategoryTab id="cpu" icon={<Cpu size={16}/>} label="Processor (CPU)" active={activeCategory === 'cpu'} onClick={() => setActiveCategory('cpu')} />
            <CategoryTab id="gpu" icon={<Monitor size={16}/>} label="Graphics (GPU)" active={activeCategory === 'gpu'} onClick={() => setActiveCategory('gpu')} />
            <CategoryTab id="ram" icon={<MemoryStick size={16}/>} label="Memory (RAM)" active={activeCategory === 'ram'} onClick={() => setActiveCategory('ram')} />
            <CategoryTab id="storage" icon={<HardDrive size={16}/>} label="Storage (HDD/SSD)" active={activeCategory === 'storage'} onClick={() => setActiveCategory('storage')} />
            <CategoryTab id="camera" icon={<Camera size={16}/>} label="Cameras & 3D Scanners" active={activeCategory === 'camera'} onClick={() => setActiveCategory('camera')} />
         </div>

         {/* Content Area */}
         <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050505] p-6">
            <div className="max-w-4xl mx-auto flex flex-col gap-6">
               
               {activeCategory === 'cpu' && (
                  <div className="animate-in fade-in duration-300 flex flex-col gap-4">
                     <HardwareHeader title="Central Processing Unit (CPU)" desc="Configure core affinity, AI neural acceleration, and power limits." icon={<Cpu size={32} className="text-[#e3b341]" />} color="#e3b341" status="Optimized" />
                     <DriverCard name="Intel / AMD Deep Learning Boost Matrix" version="v14.2.0-kernel" publisher="Apex Engine Core" date="Updated today" isUpToDate />
                     <DriverCard name="CPU Multi-Threading AI Scheduler" version="v5.1.0" publisher="Apex Systems" date="Updated 2 days ago" isUpToDate />
                  </div>
               )}

               {activeCategory === 'gpu' && (
                  <div className="animate-in fade-in duration-300 flex flex-col gap-4">
                     <HardwareHeader title="Graphics Processing Unit (GPU)" desc="Vulkan / DirectX12 Ultimate drivers with Ray Tracing Cores enabled." icon={<Monitor size={32} className="text-[#3fb950]" />} color="#3fb950" status="Running" />
                     <DriverCard name="NVIDIA CUDA / OptiX Render Bridge" version="v546.33-studio" publisher="GPU Compute LLC" date="Update available" isUpToDate={false} />
                     <DriverCard name="AMD ROCm Compute Architecture" version="v6.0.1" publisher="AdvMicro" date="Updated 1 week ago" isUpToDate />
                     <DriverCard name="AI Tensor Core Multiplier" version="v2.0-apex" publisher="Apex Internal" date="Updated today" isUpToDate />
                  </div>
               )}

               {activeCategory === 'ram' && (
                  <div className="animate-in fade-in duration-300 flex flex-col gap-4">
                     <HardwareHeader title="Random Access Memory (RAM)" desc="Manage memory paging, cache sizes, and direct storage API integration." icon={<MemoryStick size={32} className="text-[#bc8cff]" />} color="#bc8cff" status="Stable" />
                     <DriverCard name="Advanced Memory Management API" version="v4.2.1" publisher="Apex OS" date="Updated 1 month ago" isUpToDate />
                     <DriverCard name="DirectStorage Bypass V2" version="v1.1.0" publisher="System Core" date="Updated 2 months ago" isUpToDate />
                  </div>
               )}

               {activeCategory === 'storage' && (
                  <div className="animate-in fade-in duration-300 flex flex-col gap-4">
                     <HardwareHeader title="Disk Drives (HDD / NVMe SSD)" desc="Storage controllers for high-speed asset streaming and large databases." icon={<HardDrive size={32} className="text-[#f85149]" />} color="#f85149" status="High I/O" />
                     <DriverCard name="NVMe Gen 5 RAID Controller" version="v1.9.0" publisher="Storage System" date="Updated 3 days ago" isUpToDate />
                     <DriverCard name="HDD Archive Manager (Cold Storage)" version="v2.0.1" publisher="Apex Data" date="Updated 1 year ago" isUpToDate />
                  </div>
               )}

               {activeCategory === 'camera' && (
                  <div className="animate-in fade-in duration-300 flex flex-col gap-4">
                     <HardwareHeader title="Specialized Cameras & 3D Scanners" desc="Drivers for high-end depth sensing, LiDAR, DSLR, and Photogrammetry setups." icon={<Camera size={32} className="text-[#58a6ff]" />} color="#58a6ff" status="Connected" />
                     
                     <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-[#58a6ff]/10 rounded-full flex items-center justify-center border border-[#58a6ff]/30 shadow-inner">
                              <Zap size={20} className="text-[#58a6ff]" />
                           </div>
                           <div>
                              <h4 className="text-white font-bold text-[14px]">Universal 3D Scanner Hub API</h4>
                              <p className="text-[11px] text-[#8b949e]">Connects RealSense, Kinect Azure, and Pro LiDAR devices instantly to the AI Network.</p>
                           </div>
                        </div>
                        <button className="px-4 py-2 bg-gradient-to-t from-[#21262d] to-[#30363d] border border-[#8b949e]/30 rounded-lg text-white font-bold text-[11px] hover:border-white transition-all shadow-md">Configure Network</button>
                     </div>

                     <DriverCard name="LiDAR Point Cloud Interface" version="v3.3.4" publisher="SensorNet" date="Updated today" isUpToDate />
                     <DriverCard name="Deep Depth Camera Driver (NeRF Ready)" version="v2.1.0-AI" publisher="Apex Engine" date="Update available" isUpToDate={false} />
                     <DriverCard name="DSLR RAW Video Ingest Toolkit" version="v10.5.1" publisher="Media Bridge" date="Updated last week" isUpToDate />
                     
                     <div className="p-4 bg-[#2ea043]/10 border border-[#2ea043]/30 rounded-xl mt-4 flex items-start gap-4">
                        <ShieldCheck size={24} className="text-[#3fb950] shrink-0" />
                        <div>
                           <h4 className="text-white font-bold text-[13px] mb-1 leading-none">Photogrammetry Ready</h4>
                           <p className="text-[11px] text-[#c9d1d9] leading-relaxed">Devices are authenticated. 3D Scanning API is fully unlocked. You can now use the 3D Photogrammetry Scanner to instantly generate models from live feeds or video data files.</p>
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

function CategoryTab({ id, icon, label, active, onClick }: { id: string, icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
   return (
      <button 
         onClick={onClick}
         className={`w-full flex items-center gap-3 px-4 py-3 text-[12px] font-bold transition-all border-l-[3px] 
            ${active ? 'bg-[#161b22] text-white border-[#58a6ff] shadow-[inset_10px_0_20px_rgba(88,166,255,0.05)]' : 'bg-transparent text-[#8b949e] border-transparent hover:bg-[#21262d] hover:text-[#c9d1d9]'}
         `}
      >
         {icon} <span>{label}</span>
      </button>
   )
}

function HardwareHeader({ title, desc, icon, color, status }: any) {
   return (
      <div className="bg-gradient-to-r from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-2xl p-6 flex items-center justify-between shadow-md relative overflow-hidden">
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at right, ${color}, transparent 60%)` }}></div>
         <div className="flex gap-4 items-center relative z-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#050505] border border-[#30363d] shadow-inner" style={{boxShadow: `inset 0 0 15px ${color}20`}}>
               {icon}
            </div>
            <div>
               <h3 className="text-white font-bold text-[18px] tracking-tight">{title}</h3>
               <p className="text-[#8b949e] text-[12px] mt-1">{desc}</p>
            </div>
         </div>
         <div className="flex flex-col items-end relative z-10">
            <span className="text-[10px] text-[#8b949e] uppercase font-bold tracking-widest mb-1">Status</span>
            <div className="flex items-center gap-1.5 bg-[#050505] px-3 py-1.5 border border-[#30363d] rounded-lg">
               <div className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: color, color: color, boxShadow: `0 0 10px ${color}` }}></div>
               <span className="text-white text-[12px] font-bold">{status}</span>
            </div>
         </div>
      </div>
   )
}

function DriverCard({ name, version, publisher, date, isUpToDate }: any) {
   return (
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 flex justify-between items-center hover:border-[#58a6ff]/50 transition-colors group">
         <div className="flex flex-col">
            <h4 className="text-[#c9d1d9] font-bold text-[14px] flex items-center gap-2">
               {name} 
               {isUpToDate ? <CheckCircle size={14} className="text-[#3fb950]"/> : <AlertTriangle size={14} className="text-[#e3b341]"/>}
            </h4>
            <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-[#8b949e]">
               <span className="font-mono bg-[#161b22] px-1.5 py-0.5 rounded border border-[#30363d]">{version}</span>
               <span>Publisher: <strong className="text-[#c9d1d9] font-normal">{publisher}</strong></span>
               <span>{date}</span>
            </div>
         </div>
         <div>
            {isUpToDate ? (
               <button className="bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] px-4 py-2 rounded-lg text-white text-[11px] font-bold transition-colors shadow-sm">Manage Settings</button>
            ) : (
               <button className="bg-gradient-to-r from-[#238636] to-[#2ea043] border border-white/10 hover:shadow-[0_0_15px_rgba(46,160,67,0.4)] px-4 py-2 rounded-lg text-white text-[11px] font-bold transition-all flex items-center gap-2">
                  <Zap size={14}/> Install Update
               </button>
            )}
         </div>
      </div>
   )
}
