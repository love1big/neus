import React, { useState } from 'react';
import {
  Wrench,
  Activity,
  Settings2,
  Play,
  ShieldCheck,
  Zap,
  Code,
  CheckCircle2,
  Sliders,
  Cpu,
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export default function CompilerTool() {
  const [targetPreset, setTargetPreset] = useState<'shipping' | 'debug' | 'bench'>('shipping');
  const [ltoEnabled, setLtoEnabled] = useState(true);
  const [simdTarget, setSimdTarget] = useState('AVX2');
  const [fastMath, setFastMath] = useState(false);
  const [stripSymbols, setStripSymbols] = useState(true);

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans p-6 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 border-b border-[#30363d] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-[#e6edf3] flex items-center gap-3">
              <Wrench className="text-[#58a6ff]" size={28} /> GCC/LLVM/MSVC Flag Optimizer
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#bc8cff]/20 text-[#d2a8ff] border border-[#bc8cff]/40 flex items-center gap-1">
              LLVM 18.1 / GCC 14.1 Active
            </span>
          </div>
          <p className="text-[#8b949e] text-sm mt-1.5">
            ABI verification, SIMD autovectorization, link-time optimization (LTO), and whole-program code generation rules.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('switch-tool', { detail: 'BuildPublishAudit' }))}
            className="px-3.5 py-1.5 bg-[#1f6feb]/20 text-[#58a6ff] hover:bg-[#1f6feb]/30 rounded flex items-center gap-2 border border-[#58a6ff]/40 text-xs font-bold transition-all shadow-sm"
          >
            <ShieldCheck size={14} /> Pre-Flight Audit Sweep
          </button>
          <button className="px-3 py-1.5 bg-[#21262d] rounded flex items-center gap-2 hover:bg-[#30363d] border border-[#30363d] text-xs font-bold text-white">
            <Settings2 size={14} /> Toolchain Path
          </button>
          <button className="px-3.5 py-1.5 bg-[#3fb950] text-[#0d1117] rounded flex items-center gap-2 hover:bg-[#2ea043] font-bold text-xs shadow-md">
            <Play size={14} /> Test Compile
          </button>
        </div>
      </div>

      {/* Flag Matrix & Optimizer Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Left Column: Preset & Flag Toggles */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4 overflow-y-auto">
          <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-white border-b border-[#30363d] pb-2 flex items-center gap-2">
            <Sliders size={14} className="text-[#58a6ff]" /> Optimization Flags
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-2.5 bg-[#0d1117] rounded-lg border border-[#30363d]">
              <div>
                <div className="font-bold text-white">Link-Time Optimization (-flto=auto)</div>
                <div className="text-[11px] text-[#8b949e]">Cross-module inlining and dead code pruning</div>
              </div>
              <input
                type="checkbox"
                checked={ltoEnabled}
                onChange={e => setLtoEnabled(e.target.checked)}
                className="accent-[#3fb950] w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-[#0d1117] rounded-lg border border-[#30363d]">
              <div>
                <div className="font-bold text-white">Strip Debug Symbols (-Wl,--strip-all)</div>
                <div className="text-[11px] text-[#8b949e]">Reduces binary footprint by ~40%</div>
              </div>
              <input
                type="checkbox"
                checked={stripSymbols}
                onChange={e => setStripSymbols(e.target.checked)}
                className="accent-[#3fb950] w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-[#0d1117] rounded-lg border border-[#30363d]">
              <div>
                <div className="font-bold text-white">Fast-Math Relaxed IEEE (-ffast-math)</div>
                <div className="text-[11px] text-[#8b949e]">Unsafe for deterministic physics tick</div>
              </div>
              <input
                type="checkbox"
                checked={fastMath}
                onChange={e => setFastMath(e.target.checked)}
                className="accent-[#f85149] w-4 h-4"
              />
            </label>

            <div className="p-2.5 bg-[#0d1117] rounded-lg border border-[#30363d] space-y-1.5">
              <div className="font-bold text-white">SIMD Target Vectorization</div>
              <select
                value={simdTarget}
                onChange={e => setSimdTarget(e.target.value)}
                className="w-full bg-[#161b22] border border-[#30363d] text-white p-1.5 rounded outline-none focus:border-[#58a6ff] text-xs font-mono"
              >
                <option value="AVX2">x86_64 AVX2 / FMA3 (High-end Desktop)</option>
                <option value="AVX512">x86_64 AVX-512 (Enthusiast / Server)</option>
                <option value="SSE4.2">x86_64 SSE4.2 (Legacy Baseline)</option>
                <option value="NEON">ARM64 NEON (Mobile / Apple Silicon)</option>
                <option value="WASM_SIMD128">WebAssembly SIMD128 (Web)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Middle & Right: Generated Compiler String & Audit Status */}
        <div className="lg:col-span-2 flex flex-col space-y-4 overflow-hidden">
          <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-mono uppercase text-white flex items-center gap-1.5">
                <Code size={14} className="text-[#7ee787]" /> Active Generated Ninja/Make Flags
              </h3>
              <span className="text-[10px] text-[#7ee787] font-mono bg-[#238636]/20 px-2 py-0.5 rounded border border-[#238636]/40">
                0 Syntax Errors
              </span>
            </div>

            <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] font-mono text-xs text-[#7ee787] overflow-x-auto leading-relaxed">
              CXXFLAGS += -O3 {ltoEnabled ? '-flto=auto ' : ''}-m{simdTarget.toLowerCase()}{' '}
              {fastMath ? '-ffast-math ' : '-fno-fast-math '}{stripSymbols ? '-Wl,--gc-sections -Wl,--strip-all ' : ''}
              -fvisibility=hidden -fno-rtti -fno-exceptions
            </div>
          </div>

          <div className="flex-1 p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col">
            <h3 className="text-xs font-bold font-mono uppercase text-white mb-2 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#58a6ff]" /> Pre-Flight Compiler Audit Integration
            </h3>
            <p className="text-xs text-[#8b949e] mb-3">
              This compiler configuration feed is continuously queried by <span className="text-[#58a6ff] font-semibold">BuildPublishAudit</span> prior to executing live builds.
            </p>

            <div className="flex-1 bg-[#0d1117] rounded-lg border border-[#30363d] p-3 font-mono text-xs space-y-1 text-[#8b949e] overflow-y-auto">
              <div className="text-[#7ee787]">[00:00:01] Target ABI: x86_64-pc-windows-msvc (v19.40) verified.</div>
              <div className="text-[#7ee787]">[00:00:01] Inlining budget: Max inline limit set to 300 instructions.</div>
              <div className="text-[#e3b341]">[00:00:02] Linker note: -flto enabled. Expect ~18s link-time step on full rebuild.</div>
              <div>[00:00:02] Ready for BuildPublishAudit invocation.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
