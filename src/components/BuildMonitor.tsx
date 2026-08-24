import React, { useState } from 'react';
import {
  Activity,
  Settings2,
  Play,
  Server,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Terminal,
  Cpu,
  Layers,
  Clock,
  Zap,
  ArrowUpRight
} from 'lucide-react';

export default function BuildMonitor() {
  const [activePipeline, setActivePipeline] = useState<'all' | 'shipping' | 'debug'>('all');
  const [pipelineState, setPipelineState] = useState<'idle' | 'running' | 'passed'>('running');

  const builds = [
    {
      id: 'BLD-9042',
      target: 'Windows (DX12 / x86_64)',
      status: 'passed',
      duration: '4m 12s',
      cached: '84%',
      commit: '7a9c2f1 (feat: physics deterministic tick)',
      artifacts: '1.42 GB'
    },
    {
      id: 'BLD-9043',
      target: 'Web (WASM / WebGPU)',
      status: 'warning',
      duration: '6m 48s',
      cached: '62%',
      commit: '4e1b8c0 (refactor: ui ux audio bindings)',
      artifacts: '142 MB'
    },
    {
      id: 'BLD-9044',
      target: 'Linux SteamOS (Vulkan)',
      status: 'running',
      duration: '1m 20s (in progress)',
      cached: '91%',
      commit: '8c22fa9 (fix: shader alu clamp)',
      artifacts: 'Pending'
    }
  ];

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans p-6 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 border-b border-[#30363d] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-[#e6edf3] flex items-center gap-3">
              <Activity className="text-[#58a6ff]" size={28} /> Jenkins / CI Build Monitor
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#238636]/20 text-[#7ee787] border border-[#238636]/40 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#7ee787] animate-pulse"></span> 4 Runners Active
            </span>
          </div>
          <p className="text-[#8b949e] text-sm mt-1.5">
            Continuous Integration cluster telemetry, artifact caching, and distributed cooking nodes.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('switch-tool', { detail: 'BuildPublishAudit' }))}
            className="px-3.5 py-1.5 bg-[#1f6feb]/20 text-[#58a6ff] hover:bg-[#1f6feb]/30 rounded flex items-center gap-2 border border-[#58a6ff]/40 text-xs font-bold transition-all shadow-sm"
          >
            <ShieldCheck size={14} /> Open Pre-Flight Audit
          </button>
          <button className="px-3 py-1.5 bg-[#21262d] rounded flex items-center gap-2 hover:bg-[#30363d] border border-[#30363d] text-xs font-bold text-white">
            <Settings2 size={14} /> Cluster Config
          </button>
          <button className="px-3.5 py-1.5 bg-[#3fb950] text-[#0d1117] rounded flex items-center gap-2 hover:bg-[#2ea043] font-bold text-xs shadow-md">
            <Play size={14} /> Trigger Pipeline
          </button>
        </div>
      </div>

      {/* CI Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d]">
          <div className="text-[11px] font-mono uppercase text-[#8b949e] tracking-wider">Cluster CPU Load</div>
          <div className="text-xl font-extrabold text-white mt-1">34.2% / 64 Cores</div>
          <div className="text-[11px] text-[#7ee787] mt-0.5">Distributed Incredibuild Node</div>
        </div>

        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d]">
          <div className="text-[11px] font-mono uppercase text-[#8b949e] tracking-wider">Artifact Cache Hit Rate</div>
          <div className="text-xl font-extrabold text-[#58a6ff] mt-1">87.4%</div>
          <div className="text-[11px] text-[#8b949e] mt-0.5">Saves ~18 mins per run</div>
        </div>

        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d]">
          <div className="text-[11px] font-mono uppercase text-[#8b949e] tracking-wider">Pre-Flight Audit Sync</div>
          <div className="text-xl font-extrabold text-[#7ee787] mt-1">Passing</div>
          <div className="text-[11px] text-[#8b949e] mt-0.5">0 Fatal dependency cycles</div>
        </div>

        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d]">
          <div className="text-[11px] font-mono uppercase text-[#8b949e] tracking-wider">Build Queue Latency</div>
          <div className="text-xl font-extrabold text-white mt-1">0.4s</div>
          <div className="text-[11px] text-[#7ee787] mt-0.5">All runners ready</div>
        </div>
      </div>

      {/* Live Builds Table */}
      <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden flex flex-col">
        <div className="p-3 bg-[#0d1117] border-b border-[#30363d] flex justify-between items-center text-xs">
          <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Server size={14} className="text-[#58a6ff]" /> Active & Recent Pipelines
          </span>
          <span className="text-[#8b949e] font-mono text-[11px]">Auto-refreshing every 2s</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {builds.map(b => (
            <div
              key={b.id}
              className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff]/50 transition-all flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                {b.status === 'passed' ? (
                  <CheckCircle2 size={20} className="text-[#3fb950]" />
                ) : b.status === 'warning' ? (
                  <AlertTriangle size={20} className="text-[#e3b341]" />
                ) : (
                  <Activity size={20} className="text-[#58a6ff] animate-spin" />
                )}

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-white text-xs">{b.id}</span>
                    <span className="text-xs font-semibold text-[#c9d1d9]">• {b.target}</span>
                  </div>
                  <div className="text-[11px] text-[#8b949e] font-mono mt-0.5">
                    Commit: {b.commit} • Artifacts: {b.artifacts} • Cache: {b.cached}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-xs font-mono text-[#8b949e]">{b.duration}</span>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('switch-tool', { detail: 'BuildPublishAudit' }))}
                  className="px-3 py-1 bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-semibold rounded border border-[#30363d] flex items-center gap-1"
                >
                  <span>Audit Logs</span>
                  <ArrowUpRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
