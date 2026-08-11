import React from 'react';
import { Activity, Cpu, HardDrive, Box} from 'lucide-react';
import { useSystemTelemetry } from '../lib/telemetry';

export default function PerformanceHUD() {
  const { stats, cpuHistory, ramHistory, gpuHistory } = useSystemTelemetry();

  // Helper to render a small sparkline path
  const renderSparkline = (data: number[], color: string) => {
    if (data.length === 0) return null;
    const max = 100; // max percentage
    const width = 60;
    const height = 15;
    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val / max) * height);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="opacity-80">
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  return (
    <div className="hidden sm:block fixed top-12 right-4 bg-[#0a0a0f]/90 backdrop-blur-md border border-[#30363d] rounded p-2 text-white shadow-2xl z-[9999] font-mono select-none pointer-events-none w-[160px]">
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#30363d]/50">
        <div className="flex items-center gap-1.5 text-[10px] text-[#8b949e]">
          <Activity size={10} className="text-[#3fb950]" />
          <span>PERFORMANCE</span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse"></div>
      </div>

      <div className="flex flex-col gap-2">
        {/* CPU */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 text-[#58a6ff]">
            <Cpu size={12} />
            <span className="w-10 text-right">{stats.cpu.toFixed(0)}%</span>
          </span>
          {renderSparkline(cpuHistory, '#58a6ff')}
        </div>

        {/* GPU */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 text-[#bc8cff]">
            <Box size={12} />
            <span className="w-10 text-right">{stats.gpu.toFixed(0)}%</span>
          </span>
          {renderSparkline(gpuHistory, '#bc8cff')}
        </div>

        {/* RAM */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 text-[#3fb950]">
            <HardDrive size={12} />
            <span className="w-10 text-right">{stats.ram.toFixed(0)}%</span>
          </span>
          {renderSparkline(ramHistory, '#3fb950')}
        </div>
      </div>
    </div>
  );
}
