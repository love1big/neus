import React, { useState, useEffect, useRef } from "react";
import { Cpu, HardDrive, Activity, Network, Zap} from "lucide-react";
import { useSystemTelemetry } from "../lib/telemetry";
import ResourceUsageChart from "./ResourceUsageChart";
import { useSystemHealth } from "./SystemWatchdog";

export default function SystemHealthDashboard() {
  const { stats } = useSystemTelemetry();
  const { fps, isThrottled, eventLoopLag } = useSystemHealth();
  const [history, setHistory] = useState<
    { time: string; cpu: number; ram: number }[]
  >([]);
  const [showChart, setShowChart] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pseudo-network stat (using random or fixed value for demo, since it's not in telemetry yet)
  const networkPing = Math.floor(Math.random() * 20) + 15; // 15-35ms

  // Keep a running history of stats for the chart (max 60 points)
  useEffect(() => {
    setHistory((prev) => {
      const now = new Date().toLocaleTimeString();
      const newEntry = { time: now, cpu: stats.cpu || 0, ram: stats.ram || 0 };
      const newHistory = [...prev, newEntry];
      if (newHistory.length > 60) newHistory.shift();
      return newHistory;
    });
  }, [stats.cpu, stats.ram]);

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowChart(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  const getStatusColor = (val: number) => {
    if (val > 85) return "text-red-400";
    if (val > 60) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setShowChart(!showChart)}
        className={`flex items-center gap-3 transition border px-3 py-1 rounded text-[10px] font-mono tracking-tight mr-2 hidden lg:flex cursor-pointer ${isThrottled ? 'bg-[#e3b341]/10 border-[#e3b341] text-[#e3b341]' : 'bg-[#161b22] hover:bg-[#21262d] border-[#30363d]'}`}
      >
        {/* CPU */}
        <div className="flex items-center gap-1.5" title="Engine CPU Load">
          <Cpu size={12} className="text-[#8b949e]" />
          <span className={`${getStatusColor(stats.cpu)} min-w-[28px]`}>
            {Math.round(stats.cpu || 0)}%
          </span>
        </div>

        <div className="w-[1px] h-3 bg-[#30363d]"></div>

        {/* FPS & Lag (Real System Watchdog) */}
        <div className="flex items-center gap-1.5" title="Main Thread Framerate & Lag">
          <Zap size={12} className={isThrottled ? 'text-[#e3b341]' : 'text-[#8b949e]'} />
          <span className={`${fps < 30 ? 'text-[#e3b341]' : 'text-green-400'} min-w-[32px]`}>
            {fps}fps
          </span>
        </div>

        <div className="w-[1px] h-3 bg-[#30363d]"></div>

        {/* RAM */}
        <div className="flex items-center gap-1.5" title="Memory Usage">
          <HardDrive size={12} className="text-[#8b949e]" />
          <span className={`${getStatusColor(stats.ram)} min-w-[28px]`}>
            {Math.round(stats.ram || 0)}%
          </span>
        </div>

        <div className="w-[1px] h-3 bg-[#30363d]"></div>

        {/* Network */}
        <div className="flex items-center gap-1.5" title="Network Ping">
          <Network size={12} className="text-[#8b949e]" />
          <span className="text-green-400 min-w-[32px]">{networkPing}ms</span>
        </div>

        <div className="w-[1px] h-3 bg-[#30363d]"></div>

        {/* Engine Status */}
        <div className="flex items-center gap-1.5" title="Engine Status">
          <Activity size={12} className={isThrottled ? 'text-[#e3b341] animate-pulse' : 'text-[#8b949e]'} />
          <span className={`${isThrottled ? 'text-[#e3b341]' : 'text-[#58a6ff]'} uppercase font-bold tracking-wider`}>
            {isThrottled ? 'THROTTLED' : 'ONLINE'}
          </span>
        </div>
      </button>

      {/* Floating Chart Popover */}
      {showChart && (
        <div className="absolute top-full right-2 mt-2 z-50">
          <ResourceUsageChart data={history} />
        </div>
      )}
    </div>
  );
}
