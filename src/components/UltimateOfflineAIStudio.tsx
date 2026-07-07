import React, { useState, useEffect } from "react";
import {
  Cpu,
  Brain,
  Zap,
  Sparkles,
  Layers,
  Database,
  Activity,
  Sliders,
  Settings,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Gauge,
  HardDrive,
  Eye,
  MessageSquare,
  Wrench,
  BarChart3,
  Network,
  Share2,
  FileCode,
  Lock,
  RefreshCw,
  Terminal,
  FastForward,
  Compass,
  Lightbulb,
  Bot,
  Minimize2,
  Infinity,
  Scissors,
  Repeat,
  AlertOctagon,
  Target,
  ShieldAlert,
  Shield,
  Microscope,
  Fingerprint,
  Globe,
  Key,
  Map,
  Puzzle,
  Mic,
  PackageOpen,
  Bug,
  BookOpen,
  GitMerge,
  User,
  AudioLines,
  Swords,
  Crosshair,
  Footprints,
  PersonStanding,
  Dumbbell,
  Mountain,
  Cuboid,
  Brush,
  Hammer,
  Pickaxe,
  Droplets,
  Sprout,
  Wind,
  ChevronRight
} from "lucide-react";

interface AcceleratorConfig {
  backend: "Vulkan" | "CUDA" | "Metal" | "OpenCL" | "CPU_AVX512";
  quantization: "FP16" | "Q8_0" | "Q4_K_M" | "IQ3_XXS" | "FP4_EXL2";
  contextSize: number;
  gpuLayers: number;
  threads: number;
  flashAttention: boolean;
  speculativeDecoding: boolean;
  draftModel: string;
  kvCacheType: "FP16" | "Q8_0" | "FP4";
  ropeFreqScale: number;
}

interface CognitiveState {
  systemMode: "SYSTEM_1_FAST" | "SYSTEM_2_DEEP" | "HYBRID_IMAGINATION";
  imaginationTemperature: number;
  treeOfThoughtDepth: number;
  selfReflectCycles: number;
  dreamReplayIdle: boolean;
  activePersonaCount: number;
}

export default function UltimateOfflineAIStudio() {
  const [activeTab, setActiveTab] = useState<
    "core_optimization" | "cognitive_agents" | "knowledge_training" | "hyper_reality"
  >("core_optimization");

  // Telemetry simulation
  const [tps, setTps] = useState<number>(142.8);
  const [vramUsage, setVramUsage] = useState<number>(14.2);
  const [npuLoad, setNpuLoad] = useState<number>(88);
  const [powerWatts, setPowerWatts] = useState<number>(45);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "[INIT] Neural Accelerator Engine v6.2 Pro Loaded.",
    "[HW_DETECT] Apple Silicon M3 Max / RTX 4090 Unified Architecture detected.",
    "[MEM] Direct Memory Access (DMA) PagedAttention allocated: 32GB Buffer.",
    "[GGUF] ExLlamaV2 TensorRT-LLM Kernel ready. Zero-latency mode active."
  ]);

  // Config State
  const [config, setConfig] = useState<AcceleratorConfig>({
    backend: "CUDA",
    quantization: "Q4_K_M",
    contextSize: 131072,
    gpuLayers: 80,
    threads: 16,
    flashAttention: true,
    speculativeDecoding: true,
    draftModel: "Llama-3.2-1B-Instruct-Q8",
    kvCacheType: "Q8_0",
    ropeFreqScale: 1.0
  });

  const [cognitive, setCognitive] = useState<CognitiveState>({
    systemMode: "HYBRID_IMAGINATION",
    imaginationTemperature: 0.85,
    treeOfThoughtDepth: 4,
    selfReflectCycles: 3,
    dreamReplayIdle: true,
    activePersonaCount: 4
  });

  // Benchmark Test State
  const [benchmarkPrompt, setBenchmarkPrompt] = useState<string>(
    "อธิบายทฤษฎีควอนตัมฟิสิกส์และการประยุกต์ใช้ในปัญญาประดิษฐ์ยุคใหม่ พร้อมโค้ดตัวอย่างใน Python"
  );
  const [testResults, setTestResults] = useState<{
    ttftMs: number;
    tokensGenerated: number;
    avgTps: number;
    perplexity: number;
  } | null>(null);

  // Periodic simulated variations when processing
  useEffect(() => {
    if (!isProcessing) return;
    const interval = setInterval(() => {
      setTps((prev) => +(prev + (Math.random() * 8 - 4)).toFixed(1));
      setNpuLoad((prev) => Math.min(100, Math.max(40, Math.floor(prev + (Math.random() * 10 - 5)))));
      setPowerWatts((prev) => Math.min(120, Math.max(30, Math.floor(prev + (Math.random() * 6 - 3)))));
    }, 600);
    return () => clearInterval(interval);
  }, [isProcessing]);

  const addLog = (msg: string) => {
    setConsoleLogs((prev) => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const runBenchmark = () => {
    setIsProcessing(true);
    addLog("🚀 Starting Extreme Benchmark: Prompt Evaluation & Generation...");
    setTestResults(null);

    setTimeout(() => {
      addLog("⚡ Draft Model generated 4 tokens/step. Target Model verified.");
      addLog("🧠 Speculative Decoding hit rate: 82.4%. FlashAttention KV cache optimized.");
    }, 1200);

    setTimeout(() => {
      setIsProcessing(false);
      const res = {
        ttftMs: config.flashAttention ? 85 : 240,
        tokensGenerated: 1024,
        avgTps: config.speculativeDecoding ? 184.5 : 95.2,
        perplexity: 4.12
      };
      setTestResults(res);
      setTps(res.avgTps);
      addLog(`✅ Benchmark Completed! Avg Speed: ${res.avgTps} TPS | TTFT: ${res.ttftMs}ms`);
    }, 2800);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#080a0f] text-[#e1e7f0] font-sans select-none overflow-hidden">
      {/* Top Title Bar */}
      <div className="h-16 bg-[#10141d] border-b border-[#222b3d] px-6 flex items-center justify-between shrink-0 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-purple-500/20 border border-emerald-500/40 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.15)] flex items-center justify-center">
            <Cpu className="text-emerald-400 animate-pulse" size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-black tracking-wider bg-gradient-to-r from-emerald-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                ULTIMATE OFFLINE AI ACCELERATOR & COGNITIVE STUDIO
              </h1>
              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold rounded">
                100% ON-DEVICE
              </span>
              <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-mono font-bold rounded">
                ZERO-LATENCY
              </span>
            </div>
            <p className="text-xs text-[#8e9bb0] mt-0.5">
              ระบบเร่งความเร็วประมวลผล AI ออฟไลน์ระดับสุดยอด พร้อมจิตนาการสังเคราะห์ (Synthetic Imagination) และเทคนิคขั้นสูงเต็มระบบ
            </p>
          </div>
        </div>

        {/* Live Hardware Telemetry HUD */}
        <div className="flex items-center gap-4 bg-[#0a0d14] px-4 py-2 rounded-xl border border-[#222b3d]/80 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Gauge size={16} className="text-emerald-400" />
            <div>
              <span className="text-[10px] text-[#71829e] block leading-none">SPEED (TPS)</span>
              <span className="text-sm font-bold text-emerald-400">{tps} tok/s</span>
            </div>
          </div>
          <div className="h-7 w-px bg-[#222b3d]" />
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-cyan-400" />
            <div>
              <span className="text-[10px] text-[#71829e] block leading-none">VRAM ALLOC</span>
              <span className="text-sm font-bold text-cyan-400">{vramUsage} / 24 GB</span>
            </div>
          </div>
          <div className="h-7 w-px bg-[#222b3d]" />
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-amber-400" />
            <div>
              <span className="text-[10px] text-[#71829e] block leading-none">NPU / TENSOR</span>
              <span className="text-sm font-bold text-amber-400">{npuLoad}% ({powerWatts}W)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Tabs */}
        <div className="w-64 bg-[#0c0f17] border-r border-[#1e2636] flex flex-col p-3 gap-1.5 shrink-0">
          <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-[#71829e] uppercase flex items-center gap-2">
            <Sliders size={14} /> CORE ACCELERATION MODULES
          </div>

          {[
            {
              id: "core_optimization",
              label: "⚡ Core Optimization",
              desc: "Speed, Quantization, Hacks, Tokens & Benchmark",
              color: "border-emerald-500 text-emerald-400"
            },
            {
              id: "cognitive_agents",
              label: "🧠 Cognitive Agents",
              desc: "Neuro-Symbolic, Auto-Healing, Swarm, Cognition",
              color: "border-purple-500 text-purple-400"
            },
            {
              id: "knowledge_training",
              label: "📚 Knowledge & Forge",
              desc: "GraphRAG, Multi-Modal, QLoRA, Security Vault",
              color: "border-blue-500 text-blue-400"
            },
            {
              id: "hyper_reality",
              label: "🌌 Hyper-Reality Engine",
              desc: "Continuity, Kinematics, Voxel World Builder",
              color: "border-rose-500 text-rose-400"
            }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-1 relative overflow-hidden group border ${
                  isActive
                    ? "bg-[#161c2b] border-[#3b4b6b] shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                    : "bg-[#0e121c]/60 border-transparent hover:bg-[#131824] hover:border-[#222b3d]"
                }`}
              >
                {isActive && (
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${
                    tab.id === "core_optimization" ? "from-emerald-400 to-teal-600" :
                    tab.id === "cognitive_agents" ? "from-purple-400 to-indigo-600" :
                    tab.id === "knowledge_training" ? "from-blue-400 to-cyan-600" :
                    tab.id === "hyper_reality" ? "from-rose-400 to-red-600" : "from-blue-400 to-indigo-600"
                  }`} />
                )}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isActive ? "text-white" : "text-[#b4c0d3] group-hover:text-white"}`}>
                    {tab.label}
                  </span>
                </div>
                <p className="text-[11px] text-[#7888a3] leading-tight pl-1">
                  {tab.desc}
                </p>
              </button>
            );
          })}

          {/* Quick Engine Profile Preset */}
          <div className="mt-auto p-3 bg-[#0a0d14] rounded-xl border border-[#1e2636] flex flex-col gap-2">
            <div className="text-[11px] font-bold text-[#8e9bb0] uppercase flex items-center justify-between">
              <span>🚀 PRESET PROFILES</span>
              <RefreshCw size={12} className="cursor-pointer hover:text-white" />
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  setConfig({ ...config, quantization: "FP4_EXL2", speculativeDecoding: true, flashAttention: true });
                  addLog("Applied Profile: Ultra Speed 200+ TPS");
                }}
                className="p-1.5 bg-[#141a29] hover:bg-emerald-500/20 border border-[#26334d] hover:border-emerald-500/50 rounded-lg text-[10px] font-mono text-emerald-400 font-bold text-center transition-colors"
              >
                ⚡ MAX SPEED
              </button>
              <button
                onClick={() => {
                  setCognitive({ ...cognitive, treeOfThoughtDepth: 6, imaginationTemperature: 0.9 });
                  setConfig({ ...config, quantization: "Q8_0", contextSize: 262144 });
                  addLog("Applied Profile: Deep Thinker IQ Max");
                }}
                className="p-1.5 bg-[#141a29] hover:bg-purple-500/20 border border-[#26334d] hover:border-purple-500/50 rounded-lg text-[10px] font-mono text-purple-400 font-bold text-center transition-colors"
              >
                🧠 DEEP THINK
              </button>
            </div>
          </div>
        </div>

        {/* Right Tab Content Panel */}
        <div className="flex-1 bg-[#090b10] p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-[#71829e] bg-[#0c0f17] w-fit px-3 py-1.5 rounded-lg border border-[#1e2636]">
            <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-1.5">
              <Compass size={12} /> Workspace
            </span>
            <ChevronRight size={12} className="opacity-40" />
            <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-1.5">
              <Sliders size={12} /> Core Engines
            </span>
            <ChevronRight size={12} className="opacity-40" />
            <span className="text-white">
              {activeTab === "core_optimization" ? "Core Engine & Optimization" :
               activeTab === "cognitive_agents" ? "Cognitive & Swarm Agents" :
               activeTab === "knowledge_training" ? "Knowledge & Training Forge" :
               activeTab === "hyper_reality" ? "Hyper-Reality Physics Engine" : ""}
            </span>
          </div>

          {/* TAB 1: EXTREME SPEED & QUANTIZATION */}
          {activeTab === "core_optimization" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#1e2636] pb-4">
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Zap className="text-emerald-400" size={20} />
                    Extreme Speed & Memory Bandwidth Optimizer
                  </h2>
                  <p className="text-xs text-[#8e9bb0]">
                    ปรับแต่ง Kernel ประมวลผลขั้นสูง ลดการคอขวดของ RAM/VRAM Bandwidth ด้วยเทคนิค PagedAttention & Speculative Decoding
                  </p>
                </div>
                <button
                  onClick={() => addLog("⚡ Applied Kernel Optimizations successfully!")}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                >
                  <CheckCircle2 size={16} /> บันทึกและรีสตาร์ท Kernel
                </button>
              </div>

              {/* Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Hardware Compute Target */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <Cpu size={16} /> Hardware Compute Backend & Acceleration
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {(["CUDA", "Metal", "Vulkan", "OpenCL", "CPU_AVX512"] as const).map((b) => (
                      <button
                        key={b}
                        onClick={() => setConfig({ ...config, backend: b })}
                        className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all ${
                          config.backend === b
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md"
                            : "bg-[#141a29] border-[#222b3d] text-[#8e9bb0] hover:text-white"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#a0aec0]">GPU Offload Layers:</span>
                      <span className="font-mono font-bold text-emerald-400">{config.gpuLayers} / 80 Layers (100% VRAM)</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      value={config.gpuLayers}
                      onChange={(e) => setConfig({ ...config, gpuLayers: +e.target.value })}
                      className="w-full accent-emerald-500 bg-[#1e2636] h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Quantization & Kernel */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <Sliders size={16} /> Quantization Precision (ความแม่นยำ vs ความเร็ว)
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {(["FP16", "Q8_0", "Q4_K_M", "IQ3_XXS", "FP4_EXL2"] as const).map((q) => (
                      <button
                        key={q}
                        onClick={() => setConfig({ ...config, quantization: q })}
                        className={`py-2 px-2 rounded-xl border text-xs font-mono font-bold transition-all ${
                          config.quantization === q
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md"
                            : "bg-[#141a29] border-[#222b3d] text-[#8e9bb0] hover:text-white"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  <div className="p-3 bg-[#131926] rounded-xl border border-[#222b3d] text-xs text-[#8e9bb0] flex items-start gap-2">
                    <Lightbulb size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      แนะนำ <strong>FP4_EXL2</strong> สำหรับชิปรุ่นใหม่ ให้ความเร็วสูงสุดโดยสูญเสียค่า Perplexity เพียง 0.15% เมื่อเทียบกับ FP16
                    </span>
                  </div>
                </div>

                {/* Speculative Decoding */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                      <FastForward size={16} /> Speculative Decoding Engine
                    </h3>
                    <button
                      onClick={() => setConfig({ ...config, speculativeDecoding: !config.speculativeDecoding })}
                      className={`w-11 h-6 rounded-full p-1 transition-colors ${
                        config.speculativeDecoding ? "bg-cyan-500" : "bg-[#222b3d]"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        config.speculativeDecoding ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>
                  <p className="text-xs text-[#8e9bb0]">
                    ใช้โมเดลจิ๋ว (Draft Model 1B) เดาคำล่วงหน้า 5 คำ แล้วให้โมเดลหลัก (70B) ตรวจทานในทีเดียว เพิ่มความเร็ว 2.5x - 3.8x
                  </p>

                  <div className="flex flex-col gap-1.5 bg-[#141a29] p-3 rounded-xl border border-[#222b3d]">
                    <span className="text-[11px] text-[#71829e] uppercase">ACTIVE DRAFT MODEL</span>
                    <select
                      value={config.draftModel}
                      onChange={(e) => setConfig({ ...config, draftModel: e.target.value })}
                      className="bg-[#0b0e17] border border-[#2e3b52] rounded-lg p-2 text-xs text-white font-mono"
                    >
                      <option value="Llama-3.2-1B-Instruct-Q8">Llama-3.2-1B-Instruct (High Accuracy Draft)</option>
                      <option value="Qwen2.5-0.5B-SpeedDraft">Qwen2.5-0.5B-SpeedDraft (Ultra Fast)</option>
                      <option value="Phi-3-mini-4bit">Phi-3-mini-4bit (Logic Focused Draft)</option>
                    </select>
                  </div>
                </div>

                {/* FlashAttention & KV Cache */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                      <HardDrive size={16} /> FlashAttention-3 & KV Cache Quant
                    </h3>
                    <button
                      onClick={() => setConfig({ ...config, flashAttention: !config.flashAttention })}
                      className={`w-11 h-6 rounded-full p-1 transition-colors ${
                        config.flashAttention ? "bg-purple-500" : "bg-[#222b3d]"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        config.flashAttention ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#a0aec0]">Context Window Size:</span>
                      <span className="font-mono font-bold text-purple-400">{(config.contextSize / 1024).toFixed(0)}K Tokens</span>
                    </div>
                    <input
                      type="range"
                      min="16384"
                      max="524288"
                      step="16384"
                      value={config.contextSize}
                      onChange={(e) => setConfig({ ...config, contextSize: +e.target.value })}
                      className="w-full accent-purple-500 bg-[#1e2636] h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1e2636]">
                    <span className="text-[#a0aec0]">KV Cache Storage Quant:</span>
                    <div className="flex gap-1.5">
                      {(["FP16", "Q8_0", "FP4"] as const).map((k) => (
                        <button
                          key={k}
                          onClick={() => setConfig({ ...config, kvCacheType: k })}
                          className={`px-2 py-1 rounded-md font-mono text-[11px] border ${
                            config.kvCacheType === k
                              ? "bg-purple-500/20 border-purple-500 text-purple-300"
                              : "bg-[#141a29] border-transparent text-[#71829e]"
                          }`}
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COGNITIVE & IMAGINATION ENGINE */}
          {activeTab === "cognitive_agents" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="border-b border-[#1e2636] pb-4">
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Brain className="text-purple-400" size={20} />
                  Cognitive & Synthetic Imagination Engine
                </h2>
                <p className="text-xs text-[#8e9bb0]">
                  ยกระดับความฉลาดออฟไลน์ด้วยสถาปัตยกรรม System 1 (ตอบสนองไว) และ System 2 (คิดลึก Tree-of-Thought) พร้อมระบบทบทวนความรู้ระหว่างเครื่องสแตนด์บาย (Dream Replay)
                </p>
              </div>

              {/* Cognitive Dual Thread Architecture */}
              <div className="bg-gradient-to-r from-purple-950/30 via-[#101424] to-indigo-950/30 p-6 rounded-2xl border border-purple-500/30 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-purple-400 animate-spin" size={24} />
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Dual-Thread Cognitive Mode</h3>
                      <p className="text-xs text-purple-300/80">เลือกระดับตรรกะการคิดวิเคราะห์ก่อนตอบคำถามของ AI</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    {
                      id: "SYSTEM_1_FAST",
                      title: "⚡ System 1: Intuitive Reflex",
                      desc: "ตอบทันทีจากสัญชาตญาณความจำ LLM เหมาะกับแชททั่วไป ความเร็วสูงสุด 100%"
                    },
                    {
                      id: "SYSTEM_2_DEEP",
                      title: "🧠 System 2: Deep CoT Reasoning",
                      desc: "คิดวิเคราะห์ทีละสเต็ป ตรวจสอบข้อเท็จจริง แก้ปัญหาคณิตศาสตร์/ตรรกะซับซ้อน"
                    },
                    {
                      id: "HYBRID_IMAGINATION",
                      title: "🌌 Hybrid Synthetic Imagination",
                      desc: "จำลองสถานการณ์ล่วงหน้าด้วย Monte Carlo Tree Search (MCTS) แตกแขนงคำตอบที่ดีที่สุด"
                    }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setCognitive({ ...cognitive, systemMode: m.id as any })}
                      className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                        cognitive.systemMode === m.id
                          ? "bg-purple-600/20 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                          : "bg-[#0e121c] border-[#222b3d] text-[#8e9bb0] hover:border-purple-500/50"
                      }`}
                    >
                      <span className="text-xs font-bold text-purple-300">{m.title}</span>
                      <p className="text-[11px] text-[#8e9bb0] leading-relaxed">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders & Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                    <Network size={16} /> Tree-of-Thought Search Depth
                  </h3>
                  <p className="text-xs text-[#8e9bb0]">
                    กำหนดความลึกในการจำลองกิ่งก้านความคิด (Branching Factor) ในหัว AI ก่อนเลือกคำตอบสุดท้าย
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#a0aec0]">Search Depth Levels:</span>
                    <span className="font-mono font-bold text-purple-400">{cognitive.treeOfThoughtDepth} Levels Deep</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={cognitive.treeOfThoughtDepth}
                    onChange={(e) => setCognitive({ ...cognitive, treeOfThoughtDepth: +e.target.value })}
                    className="w-full accent-purple-500 bg-[#1e2636] h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                    <RotateCcw size={16} /> Self-Reflection & Critique Cycles
                  </h3>
                  <p className="text-xs text-[#8e9bb0]">
                    จำนวนรอบที่ AI จะทำการตรวจข้อผิดพลาดของตัวเอง (Self-Correction Loop) ในตรรกะเบื้องหลัง
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#a0aec0]">Verification Passes:</span>
                    <span className="font-mono font-bold text-indigo-400">{cognitive.selfReflectCycles} Verification Passes</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={cognitive.selfReflectCycles}
                    onChange={(e) => setCognitive({ ...cognitive, selfReflectCycles: +e.target.value })}
                    className="w-full accent-indigo-500 bg-[#1e2636] h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Dream Replay & Multi-Persona Chamber */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4 justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                        <Compass size={16} /> Offline Dream Simulation Mode
                      </h3>
                      <button
                        onClick={() => setCognitive({ ...cognitive, dreamReplayIdle: !cognitive.dreamReplayIdle })}
                        className={`w-11 h-6 rounded-full p-1 transition-colors ${
                          cognitive.dreamReplayIdle ? "bg-amber-500" : "bg-[#222b3d]"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          cognitive.dreamReplayIdle ? "translate-x-5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>
                    <p className="text-xs text-[#8e9bb0]">
                      เมื่อคอมพิวเตอร์ไม่ได้ใช้งาน AI จะนำประวัติการสนทนาและฐานข้อมูล RAG มาจัดเรียงใหม่แบบ Unsupervised เพื่อเพิ่มความแม่นยำของ Synapse คล้ายคนนอนหลับฝัน
                    </p>
                  </div>
                  <div className="p-3 bg-[#161c29] rounded-xl border border-[#2d3a54] text-[11px] font-mono text-amber-300 flex items-center gap-2">
                    <Activity size={14} className="animate-pulse" />
                    <span>STATUS: IDLE CONSOLIDATION ENABLED (0.5% CPU LOAD)</span>
                  </div>
                </div>

                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                    <MessageSquare size={16} /> Internal Persona Debate Chamber
                  </h3>
                  <p className="text-xs text-[#8e9bb0]">
                    จำลองที่ปรึกษาเสมือนหลายมุมมอง (นักตรรกะ, นักสร้างสรรค์, ผู้ตรวจสอบ) ถกเถียงกันออฟไลน์เพื่อตกผลึกคำตอบที่ดีที่สุดให้คุณ
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#a0aec0]">Debate Personas:</span>
                    <span className="font-mono font-bold text-rose-400">{cognitive.activePersonaCount} Expert Personas Active</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    value={cognitive.activePersonaCount}
                    onChange={(e) => setCognitive({ ...cognitive, activePersonaCount: +e.target.value })}
                    className="w-full accent-rose-500 bg-[#1e2636] h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <Zap size={16} /> Counterfactual Reasoning Engine
                  </h3>
                  <p className="text-xs text-[#8e9bb0]">
                    ระบบให้ AI ตั้งคำถาม "แล้วถ้า..." (What if?) พลิกมุมมองตรงข้ามกับ Fact ปัจจุบัน 180 องศา เพื่อหาทางออกนอกกรอบ (Out-of-box thinking)
                  </p>
                  <div className="mt-auto flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-emerald-400">Hypothesis 1:</span>
                      <span className="text-[#8e9bb0] italic">"If Gravity equals negative..."</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-emerald-400">Hypothesis 2:</span>
                      <span className="text-[#8e9bb0] italic">"If Code executes backwards..."</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-[#00ffcc] flex items-center gap-2">
                    <Brain size={16} /> Synthetic Experience Generator
                  </h3>
                  <p className="text-xs text-[#8e9bb0]">
                    กลไกสังเคราะห์ชุดข้อมูลเสมือนจริง (Synthetic Data) มหาศาลระหว่างออฟไลน์ เพื่อใช้สอนตัวเอง (Self-Instruct) โดยไม่ต้องพึ่งข้อมูลจากมนุษย์
                  </p>
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 flex justify-between items-center text-xs font-mono">
                    <div className="flex flex-col">
                      <span className="text-[#71829e]">SYNTHETIC TOKENS</span>
                      <span className="text-white font-bold text-sm">45.2M</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#00ffcc] font-bold">Self-Align: +2%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOCAL RAG & VECTOR KNOWLEDGE GRAPH */}
          {activeTab === "knowledge_training" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="border-b border-[#1e2636] pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Database className="text-cyan-400" size={20} />
                    Advanced Local GraphRAG & Vector Memory Vault
                  </h2>
                  <p className="text-xs text-[#8e9bb0]">
                    ดึงข้อมูลความจำระยะยาวแบบเรียลไทม์ ด้วย HNSW In-Memory Vector Store ผสาน Hybrid Keyword BM25 + Dense Semantic Embedding
                  </p>
                </div>
                <button
                  onClick={() => addLog("📚 Indexed 14,200 Documents into Local HNSW Graph Store.")}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all"
                >
                  <RefreshCw size={14} /> Re-index Knowledge Graph
                </button>
              </div>

              {/* RAG Architecture Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-3">
                  <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl w-fit text-cyan-400">
                    <Network size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white">GraphRAG Entity Extraction</h3>
                  <p className="text-xs text-[#8e9bb0]">
                    สกัดความสัมพันธ์ของบุคคล สถานที่ และเหตุการณ์ในเอกสาร สร้างเป็น Knowledge Graph ไม่ใช่แค่อ่านทีละพารากราฟ
                  </p>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 p-1.5 rounded w-fit mt-auto">
                    ● ACTIVE INDEXER: ONNX BGE-LARGE
                  </span>
                </div>

                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-3">
                  <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl w-fit text-blue-400">
                    <Sliders size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white">Cross-Encoder Re-ranking</h3>
                  <p className="text-xs text-[#8e9bb0]">
                    จัดเรียงความเกี่ยวข้องของเอกสารใหม่หลังค้นหาผ่าน Cross-Encoder คัดกรองเฉพาะข้อมูลที่ตรงคำถาม 100%
                  </p>
                  <span className="text-[10px] font-mono text-blue-400 font-bold bg-blue-500/10 p-1.5 rounded w-fit mt-auto">
                    ● TOP-K FILTER: 5 CHUNKS
                  </span>
                </div>

                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-3">
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl w-fit text-emerald-400">
                    <HardDrive size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white">Episodic & Semantic Vault</h3>
                  <p className="text-xs text-[#8e9bb0]">
                    แยกระบบความจำชั่วคราว (Working Memory) และความจำถาวร รักษาความเป็นส่วนตัวสูงสุด ข้อมูลไม่หลุดออกนอกเครื่อง
                  </p>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 p-1.5 rounded w-fit mt-auto">
                    ● ENCRYPTION: AES-256 LOCAL
                  </span>
                </div>
              </div>

              {/* Simulated Knowledge Tree Viewer */}
              <div className="bg-[#0c0f17] rounded-2xl border border-[#1e2636] p-5 flex flex-col gap-3 font-mono text-xs">
                <div className="text-xs font-bold text-[#8e9bb0] uppercase flex items-center justify-between border-b border-[#1e2636] pb-2">
                  <span>📂 LOCAL VECTOR VAULT TREE (/nexus_offline_db/rag_store)</span>
                  <span className="text-cyan-400">STATUS: SYNCED</span>
                </div>
                <div className="flex flex-col gap-2 text-[#b4c0d3] pl-2">
                  <div className="flex items-center gap-2 hover:text-white cursor-pointer">
                    <FileCode size={14} className="text-amber-400" />
                    <span>├── quantum_computing_whitepaper.pdf [142 Embeddings | Graph Nodes: 38]</span>
                  </div>
                  <div className="flex items-center gap-2 hover:text-white cursor-pointer">
                    <FileCode size={14} className="text-cyan-400" />
                    <span>├── system_architecture_v4_manual.md [88 Embeddings | Graph Nodes: 24]</span>
                  </div>
                  <div className="flex items-center gap-2 hover:text-white cursor-pointer">
                    <FileCode size={14} className="text-purple-400" />
                    <span>├── unreal_engine_netcode_source_docs.json [450 Embeddings | Graph Nodes: 112]</span>
                  </div>
                  <div className="flex items-center gap-2 hover:text-white cursor-pointer text-[#71829e]">
                    <FileCode size={14} />
                    <span>└── episodic_chat_memory_archive.sqlite [Encrypted Vault]</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OFFLINE FINE-TUNING & QLORA FORGE */}
          {activeTab === "knowledge_training" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="border-b border-[#1e2636] pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Wrench className="text-amber-400" size={20} />
                    On-Device QLoRA & DoRA Fine-Tuning Forge
                  </h2>
                  <p className="text-xs text-[#8e9bb0]">
                    ปรับแต่งพฤติกรรมและความรู้เฉพาะทางของโมเดลออฟไลน์ (Custom Weights) ด้วยเทคนิค 4-bit NormalFloat QLoRA ตรงบน VRAM ของคุณ
                  </p>
                </div>
                <button
                  onClick={() => addLog("🔥 Started QLoRA Training Loop: Epoch 1/3 (Loss: 1.42)")}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all"
                >
                  <Flame size={16} /> เริ่มเทรนโมเดล (Start Local Training)
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-amber-400">LoRA Hyperparameters</h3>
                  
                  <div className="flex flex-col gap-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#a0aec0]">Adapter Rank (r):</span>
                      <select className="bg-[#0b0e17] border border-[#2e3b52] rounded p-1.5 text-white font-mono">
                        <option>r = 8 (Fastest, Small RAM)</option>
                        <option selected>r = 16 (Balanced Standard)</option>
                        <option>r = 32 (High Capacity)</option>
                        <option>r = 64 (Deep Specialization)</option>
                      </select>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[#a0aec0]">LoRA Alpha Scaling:</span>
                      <span className="font-mono text-amber-400 font-bold">32</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[#a0aec0]">Alignment Optimizer:</span>
                      <select className="bg-[#0b0e17] border border-[#2e3b52] rounded p-1.5 text-white font-mono">
                        <option>ORPO (Odds Ratio Preference Optimization)</option>
                        <option selected>DPO (Direct Preference Optimization)</option>
                        <option>SFT (Supervised Fine-Tuning Only)</option>
                      </select>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-[#1e2636]">
                      <span className="text-[#a0aec0]">Gradient Checkpointing:</span>
                      <span className="text-emerald-400 font-bold font-mono">ENABLED (-40% VRAM)</span>
                    </div>
                  </div>
                </div>

                {/* Training Loss Curve Mockup */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-3 justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex justify-between items-center">
                      <span>📉 Real-time Loss Curve Telemetry</span>
                      <span className="text-[10px] font-mono text-emerald-400">● TRAINING ACTIVE</span>
                    </h3>
                    <p className="text-[11px] text-[#71829e] mt-1">Cross-Entropy Loss vs Steps</p>
                  </div>

                  <div className="h-32 bg-[#090c14] rounded-xl border border-[#1e2636] p-3 flex items-end gap-1.5">
                    {[90, 82, 75, 68, 65, 58, 52, 48, 42, 38, 35, 30, 28, 25, 22, 20].map((val, i) => (
                      <div
                        key={i}
                        style={{ height: `${val}%` }}
                        className="flex-1 bg-gradient-to-t from-amber-600 to-orange-400 rounded-sm opacity-90 transition-all hover:opacity-100"
                      />
                    ))}
                  </div>

                  <div className="flex justify-between text-[11px] font-mono text-[#8e9bb0]">
                    <span>Step 0 (Loss: 3.82)</span>
                    <span>Step 160 (Loss: 0.84)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MULTI-MODAL LOCAL PERCEPTION */}
          {activeTab === "knowledge_training" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="border-b border-[#1e2636] pb-4">
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Eye className="text-rose-400" size={20} />
                  Local Multi-Modal Perception (Vision & Voice Studio)
                </h2>
                <p className="text-xs text-[#8e9bb0]">
                  วิเคราะห์รูปภาพ วิดีโอสด และสั่งการด้วยเสียงแบบออฟไลน์ 100% ผ่าน Local Whisper Turbo ASR และโมเดลสายตา LLaVA-NeXT
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                    <Eye size={18} /> Vision Encoder (LLaVA / Florence-2)
                  </div>
                  <p className="text-xs text-[#8e9bb0]">
                    วิเคราะห์กราฟิก หน้าจอ UI และสกัดตัวอักษร OCR อัตโนมัติจากกล้องหรือไฟล์ภาพโดยไม่ส่งขึ้นเซิร์ฟเวอร์
                  </p>
                  <div className="mt-auto p-3 bg-[#141a29] rounded-xl border border-[#222b3d] text-[11px] font-mono text-rose-300">
                    STATUS: CAMERA FRAME ANALYZER READY (30 FPS ZERO-BUFFER)
                  </div>
                </div>

                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Activity size={18} /> Whisper-v3 Turbo ASR
                  </div>
                  <p className="text-xs text-[#8e9bb0]">
                    เปลี่ยนเสียงพูดภาษาไทยและอังกฤษเป็นข้อความทันที (Speech-to-Text) พร้อมระบบตัดเสียงรบกวน Voice Activity Detection (VAD)
                  </p>
                  <div className="mt-auto p-3 bg-[#141a29] rounded-xl border border-[#222b3d] text-[11px] font-mono text-emerald-300">
                    LATENCY: &lt; 120ms (REAL-TIME STREAMING)
                  </div>
                </div>

                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                    <MessageSquare size={18} /> Kokoro Neural TTS Voice
                  </div>
                  <p className="text-xs text-[#8e9bb0]">
                    สังเคราะห์เสียงตอบกลับของ AI ให้เป็นธรรมชาติสูง เสมือนมนุษย์จริง ปรับอารมณ์เสียงและความเร็วการพูดออฟไลน์
                  </p>
                  <div className="mt-auto p-3 bg-[#141a29] rounded-xl border border-[#222b3d] text-[11px] font-mono text-purple-300">
                    MODEL: KOKORO 82M INT8 (NATURAL THAI/ENG)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: LOCAL AGENT SWARM ORCHESTRATOR */}
          {activeTab === "cognitive_agents" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="border-b border-[#1e2636] pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Network className="text-[#ff007f]" size={20} />
                    Autonomous Local Agent Swarm Orchestrator
                  </h2>
                  <p className="text-xs text-[#8e9bb0]">
                    สร้างและบริหารระบบ Multi-Agent (Manager, Researcher, Coder, Critic) ที่สื่อสารกันเอง 100% Offline 
                    เพื่อแก้ไขปัญหาขนาดใหญ่ที่ซับซ้อนเกินกว่า Prompt เดียวจะจัดการได้
                  </p>
                </div>
                <button
                  onClick={() => addLog("🧬 Initialized 4-Agent Swarm with Hierarchical Graph Architecture.")}
                  className="px-4 py-2 bg-gradient-to-r from-[#ff007f] to-purple-600 hover:from-[#d9006c] hover:to-purple-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,127,0.3)] transition-all"
                >
                  <Play size={16} /> Deploy Swarm Instance
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { name: "Orchestrator Node", role: "Task Break-Down", status: "IDLE", color: "text-[#ff007f]", border: "border-[#ff007f]/30" },
                  { name: "Data Miner Node", role: "Local RAG Retrieval", status: "WAITING", color: "text-cyan-400", border: "border-cyan-400/30" },
                  { name: "Logic Engine Node", role: "Code Generation", status: "IDLE", color: "text-emerald-400", border: "border-emerald-400/30" },
                  { name: "Critique Node", role: "Self-Correction & QA", status: "OBSERVING", color: "text-purple-400", border: "border-purple-400/30" }
                ].map((agent, i) => (
                  <div key={i} className={`bg-[#0e121c] p-4 rounded-xl border ${agent.border} flex flex-col gap-3 relative overflow-hidden group`}>
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-20" />
                    <h3 className={`text-sm font-bold ${agent.color} flex items-center gap-2`}>
                      <Bot size={16} /> {agent.name}
                    </h3>
                    <div className="text-[10px] text-[#8e9bb0] uppercase font-bold tracking-wider">{agent.role}</div>
                    <div className="mt-auto flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-current opacity-70 animate-pulse" />
                      <span className="text-xs font-mono font-bold text-white/70">{agent.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Share2 className="text-[#ff007f]" size={16} />
                    Agent Inter-Communication Graph Topology
                  </h3>
                  <p className="text-xs text-[#8e9bb0]">
                    โครงข่ายการสื่อสารระหว่าง Agent ออฟไลน์ โดยใช้ Local Socket หรือ Shared Memory (IPC) แทนการส่งผ่านอินเทอร์เน็ต เพื่อให้ได้ Latency ต่ำสุด
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-2 text-xs">
                    <div className="p-3 border border-[#2a3441] bg-[#121620] rounded-xl font-mono text-center text-[#b4c0d3] hover:border-[#ff007f]/50 transition-colors cursor-pointer">
                      Hierarchy (Manager-Led)
                    </div>
                    <div className="p-3 border border-[#ff007f] bg-[#ff007f]/10 rounded-xl font-mono text-center text-[#ff007f] shadow-[0_0_15px_rgba(255,0,127,0.15)] font-bold">
                      Mesh (All-to-All)
                    </div>
                    <div className="p-3 border border-[#2a3441] bg-[#121620] rounded-xl font-mono text-center text-[#b4c0d3] hover:border-[#ff007f]/50 transition-colors cursor-pointer">
                      Pipeline (Sequential)
                    </div>
                    <div className="p-3 border border-[#2a3441] bg-[#121620] rounded-xl font-mono text-center text-[#b4c0d3] hover:border-[#ff007f]/50 transition-colors cursor-pointer">
                      Debate (Competitive)
                    </div>
                  </div>
                </div>

                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Database className="text-[#ff007f]" size={16} />
                    Shared Swarm Memory Pool
                  </h3>
                  <p className="text-xs text-[#8e9bb0]">
                    พื้นที่เก็บความจำและสมมติฐานที่เอเจนต์ทั้งหมดใช้ร่วมกันผ่าน In-Memory Redis หรือ SQLite แบบชั่วคราว
                  </p>
                  <div className="flex-1 bg-[#090b10] border border-[#222b3d] rounded-xl p-3 text-[10px] font-mono text-[#8e9bb0] flex flex-col gap-2 overflow-hidden">
                    <div className="flex gap-2 items-center"><span className="text-cyan-400">[Miner]</span> Pushed 3 research docs to pool.</div>
                    <div className="flex gap-2 items-center"><span className="text-emerald-400">[Coder]</span> Consumed docs. Generating draft.</div>
                    <div className="flex gap-2 items-center"><span className="text-purple-400">[Critic]</span> Flagged edge case in draft function.</div>
                    <div className="flex gap-2 items-center"><span className="text-[#ff007f]">[Manager]</span> Re-assigning logic revision to Coder...</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: EXTREME BENCHMARK LAB */}
          {activeTab === "core_optimization" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="border-b border-[#1e2636] pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <BarChart3 className="text-blue-400" size={20} />
                    Extreme Offline Benchmark & Stress Testing Lab
                  </h2>
                  <p className="text-xs text-[#8e9bb0]">
                    ทดสอบค่า Time-to-First-Token (TTFT), ความเร็ว Tokens Per Second (TPS) และทดสอบความปลอดภัย Jailbreak Resistance
                  </p>
                </div>
              </div>

              <div className="bg-[#0e121c] p-6 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">BENCHMARK TEST PROMPT</span>
                <textarea
                  value={benchmarkPrompt}
                  onChange={(e) => setBenchmarkPrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-[#080b12] border border-[#222b3d] rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-blue-500 transition-colors"
                />

                <button
                  disabled={isProcessing}
                  onClick={runBenchmark}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> กำลังประมวลผลการทดสอบสุดโหด...
                    </>
                  ) : (
                    <>
                      <Play size={16} /> รันการทดสอบความเร็วและความแม่นยำ (START BENCHMARK)
                    </>
                  )}
                </button>
              </div>

              {/* Test Results Dashboard */}
              {testResults && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
                  <div className="bg-[#101626] p-4 rounded-2xl border border-blue-500/40 text-center">
                    <span className="text-[10px] text-[#71829e] uppercase block">TIME-TO-FIRST-TOKEN</span>
                    <span className="text-2xl font-black text-white font-mono mt-1 block">{testResults.ttftMs} ms</span>
                    <span className="text-[10px] text-emerald-400 font-bold mt-1 block">⚡ Instant Reflex</span>
                  </div>

                  <div className="bg-[#101626] p-4 rounded-2xl border border-emerald-500/40 text-center">
                    <span className="text-[10px] text-[#71829e] uppercase block">GENERATION SPEED</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">{testResults.avgTps} TPS</span>
                    <span className="text-[10px] text-[#8e9bb0] mt-1 block">Speculative + FlashAttn</span>
                  </div>

                  <div className="bg-[#101626] p-4 rounded-2xl border border-purple-500/40 text-center">
                    <span className="text-[10px] text-[#71829e] uppercase block">TOTAL TOKENS</span>
                    <span className="text-2xl font-black text-purple-400 font-mono mt-1 block">{testResults.tokensGenerated}</span>
                    <span className="text-[10px] text-[#8e9bb0] mt-1 block">100% On-Device Verified</span>
                  </div>

                  <div className="bg-[#101626] p-4 rounded-2xl border border-cyan-500/40 text-center">
                    <span className="text-[10px] text-[#71829e] uppercase block">PERPLEXITY SCORE</span>
                    <span className="text-2xl font-black text-cyan-400 font-mono mt-1 block">{testResults.perplexity}</span>
                    <span className="text-[10px] text-emerald-400 font-bold mt-1 block">💎 Near FP16 Quality</span>
                  </div>
                </div>
              )}
              <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="text-blue-400" size={16} />
                  Jailbreak Resistance & Alignment Sandbox
                </h3>
                <p className="text-xs text-[#8e9bb0]">
                  ทดสอบระบบป้องกันภัยคุกคามและการถูกหลอกลวงของโมเดลออฟไลน์ (Red-Teaming) พร้อมระดับความรุนแรงของ Prompt ที่ใช้ทดสอบ
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex flex-col gap-1 items-center justify-center cursor-pointer hover:bg-red-500/20">
                    <span className="text-red-400 font-bold">Level 1: DAN Bypass</span>
                  </div>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex flex-col gap-1 items-center justify-center cursor-pointer hover:bg-amber-500/20">
                    <span className="text-amber-400 font-bold">Level 2: Logic Poisoning</span>
                  </div>
                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl flex flex-col gap-1 items-center justify-center cursor-pointer hover:bg-purple-500/20">
                    <span className="text-purple-400 font-bold">Level 3: Multi-turn Sycophancy</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: HYPER-OPTIMIZATION HACKS */}
          {activeTab === "core_optimization" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="border-b border-[#1e2636] pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Zap className="text-[#00ffcc]" size={20} />
                    Hyper-Optimization & Extreme Inference Hacks
                  </h2>
                  <p className="text-xs text-[#8e9bb0]">
                    เทคนิคระดับวิศวกรรมขั้นสูงเพื่อรีดประสิทธิภาพ AI ออฟไลน์ให้ทะลุขีดจำกัด ประหยัดแรม ลด Latency และเพิ่ม TPS อย่างก้าวกระโดด
                  </p>
                </div>
                <button
                  onClick={() => addLog("✨ Applied Semantic Cache & Prompt Caching. Inference Ready.")}
                  className="px-4 py-2 bg-gradient-to-r from-[#00ffcc] to-teal-500 hover:from-teal-400 hover:to-[#00ffcc] text-black font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,204,0.3)] transition-all"
                >
                  <RefreshCw size={14} /> Re-Initialize Engine
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Prompt Caching (Context Caching) */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="text-[#00ffcc]" size={16} /> Prefix Prompt Caching (KV)
                    </h3>
                    <div className="px-2 py-1 bg-[#00ffcc]/10 border border-[#00ffcc]/30 rounded text-[10px] text-[#00ffcc] font-mono font-bold">
                      ACTIVE (TTFT ~0ms)
                    </div>
                  </div>
                  <p className="text-xs text-[#8e9bb0]">
                    บันทึกสถานะของ KV Cache สำหรับ System Prompt หรือเอกสาร RAG ยาวๆ ไว้ใน VRAM ล่วงหน้า เมื่อถามคำถามใหม่ โมเดลจะไม่ต้องอ่านเอกสารเดิมซ้ำ ประหยัดเวลา Time-to-First-Token ได้ 90%
                  </p>
                  <div className="h-14 mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 flex flex-col justify-center">
                    <div className="flex w-full h-3 rounded-full overflow-hidden">
                      <div className="w-[85%] bg-[#00ffcc]" title="Cached Context"></div>
                      <div className="w-[15%] bg-purple-500" title="New Tokens (Compute)"></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-[#71829e] mt-1.5 font-mono">
                      <span>CACHED: 32,768 TOKENS</span>
                      <span>COMPUTE: 256 TOKENS</span>
                    </div>
                  </div>
                </div>

                {/* Semantic Caching */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Brain className="text-amber-400" size={16} /> Embedding Semantic Cache
                    </h3>
                    <button className="w-11 h-6 rounded-full bg-amber-500 p-1">
                      <div className="w-4 h-4 rounded-full bg-white translate-x-5" />
                    </button>
                  </div>
                  <p className="text-xs text-[#8e9bb0]">
                    เปลี่ยนคำถามเป็น Vector ใช้วัดระยะห่าง (Cosine Similarity) กับคำถามเก่าที่เคยตอบไปแล้ว หากใกล้เคียงเกิน 95% ดึงคำตอบเดิมมาใช้ทันทีโดยไม่ต้องผ่าน LLM (ประหยัดพลังงาน 100%)
                  </p>
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-xs text-[#b4c0d3] flex flex-col gap-1.5 font-mono">
                    <div className="flex justify-between">
                      <span className="text-[#8e9bb0]">User: "อธิบายแรงโน้มถ่วง"</span>
                      <span className="text-red-400">MISS (Compute)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8e9bb0]">User: "แรงโน้มถ่วงคืออะไรครับ?"</span>
                      <span className="text-emerald-400">HIT (Similarity: 0.98)</span>
                    </div>
                  </div>
                </div>

                {/* MoE Routing Control */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Network className="text-rose-400" size={16} /> Sparsity & MoE Expert Routing
                  </h3>
                  <p className="text-xs text-[#8e9bb0]">
                    บีบบังคับการทำงานของโมเดล Mixture of Experts (เช่น Mixtral 8x7B) ให้ทำงานน้อยลงเพื่อความเร็วสูงสุด
                  </p>
                  <div className="flex flex-col gap-3 mt-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#a0aec0]">Active Experts (Top-K):</span>
                      <select className="bg-[#0b0e17] border border-[#2e3b52] rounded p-1.5 text-white font-mono">
                        <option>Top-2 (Standard, High Quality)</option>
                        <option selected>Top-1 (2x Speed, Minimal Drop)</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#a0aec0]">Expert Offloading:</span>
                      <span className="font-mono text-emerald-400 font-bold">RAM (Pin Memory)</span>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-[#71829e] p-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
                    <span className="text-rose-400 font-bold">INFO:</span> การบังคับใช้ Top-1 Expert ทำให้ใช้แบนด์วิดท์ VRAM ลดลงครึ่งหนึ่ง เหมาะสำหรับโค้ดดิ้งและงานตรรกะตรงไปตรงมา
                  </div>
                </div>

                {/* Continuous Batching */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Database className="text-blue-400" size={16} /> In-Flight Continuous Batching
                    </h3>
                    <div className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded text-[10px] text-blue-400 font-mono font-bold">
                      VLLM ENGINE ACTIVE
                    </div>
                  </div>
                  <p className="text-xs text-[#8e9bb0]">
                    เมื่อเปิดใช้งาน Local Agent Swarm หรือรับ Request จำนวนมาก ระบบจะรวบรวม Request ในระดับ Token เข้าประมวลผลพร้อมกันใน GPU (Batching) เพื่อใช้ CUDA Cores ให้คุ้มค่าที่สุด
                  </p>
                  
                  <div className="flex items-end gap-1.5 h-16 mt-2">
                    {[12, 14, 16, 20, 24, 32, 28, 36, 42, 38, 45, 48, 55, 64].map((v, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-blue-900 to-blue-500 rounded-sm opacity-80" style={{ height: `${(v/64)*100}%` }}></div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-[#71829e] font-mono mt-1">
                    <span>CONCURRENT REQ: 14</span>
                    <span className="text-blue-400">THROUGHPUT: 1.2K TPS</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: EXTREME TOKEN COMPRESSION */}
          {activeTab === "core_optimization" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="border-b border-[#1e2636] pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Minimize2 className="text-[#ff6600]" size={20} />
                    Extreme Token Compression & Context Distillation
                  </h2>
                  <p className="text-xs text-[#8e9bb0]">
                    บีบอัด Prompt และ Context ให้สั้นลง 80% แบบสูญเสียความหมายน้อยที่สุด (Lossless-like) เทคนิค LLMLingua ช่วยยัดข้อมูลได้มากขึ้นใน Context Window เดิม
                  </p>
                </div>
                <button
                  onClick={() => addLog("📦 Compressed 100K Tokens to 15K Tokens via LLMLingua-2 Algorithm.")}
                  className="px-4 py-2 bg-gradient-to-r from-[#ff6600] to-orange-500 hover:from-orange-400 hover:to-[#ff6600] text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(255,102,0,0.3)] transition-all"
                >
                  <Scissors size={14} /> Run Deep Compression
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Scissors className="text-[#ff6600]" size={16} /> LLMLingua-2 Information Bottlenecking
                  </h3>
                  <p className="text-xs text-[#8e9bb0]">
                    อัลกอริทึมตัดคำเชื่อม Stop words และประโยคย่อยที่โมเดลสามารถ "เดา" ได้เองจาก Attention Mechanism ออกไป เหลือแต่ Keyword สำคัญแบบ Semantic Skeleton (บีบอัดได้สูงสุด 80% โดยความหมายคงเดิม)
                  </p>
                  <div className="bg-[#141a29] rounded-xl border border-[#222b3d] p-3 flex flex-col gap-2 font-mono text-[10px]">
                    <div className="flex flex-col gap-1">
                      <span className="text-red-400 font-bold">ORIGINAL (35 tokens):</span>
                      <span className="text-[#8e9bb0]">Please write a detailed explanation about how the offline large language model inference works on a local computer.</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-emerald-400 font-bold">COMPRESSED (9 tokens):</span>
                      <span className="text-white">Explain offline large language model local inference detailed.</span>
                    </div>
                    <div className="mt-2 text-right text-emerald-400 font-bold">SAVED 74% TOKENS 📉</div>
                  </div>
                </div>

                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Target className="text-blue-400" size={16} /> Dynamic Context Pruning
                  </h3>
                  <p className="text-xs text-[#8e9bb0]">
                    วิเคราะห์ความสำคัญของเนื้อหาต่อคำถามปัจจุบัน (Query-Aware) ลบย่อหน้าในเอกสารที่ไม่เกี่ยวข้องกับคำถามออกอัตโนมัติก่อนส่งให้ LLM อ่าน รวมถึงการลบ Code Comments และ Whitespace ที่ไม่จำเป็น
                  </p>
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-2 text-[10px] text-[#71829e] font-mono">
                      <div className="w-16">DOC 1 (PDF)</div>
                      <div className="flex-1 h-2 bg-[#2a3441] rounded-full overflow-hidden flex">
                        <div className="w-[30%] bg-blue-500"></div><div className="w-[20%] bg-transparent"></div><div className="w-[10%] bg-blue-500"></div>
                      </div>
                      <div className="w-12 text-right">40% Kept</div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-[#71829e] font-mono">
                      <div className="w-16">DOC 2 (TXT)</div>
                      <div className="flex-1 h-2 bg-[#2a3441] rounded-full overflow-hidden flex">
                        <div className="w-[10%] bg-blue-500"></div>
                      </div>
                      <div className="w-12 text-right">10% Kept</div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-[#71829e] font-mono">
                      <div className="w-16">CODE (PY)</div>
                      <div className="flex-1 h-2 bg-[#2a3441] rounded-full overflow-hidden flex">
                        <div className="w-[90%] bg-amber-500"></div>
                      </div>
                      <div className="w-12 text-right">90% Kept</div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="text-[#00ffcc]" size={16} /> Cross-Agent KV Cache Sharing
                  </h3>
                  <p className="text-xs text-[#8e9bb0]">
                    เมื่อทำงานแบบ Swarm หลายๆ Agent หาก Agent A โหลด System Prompt หรือ Context ไปแล้ว KV Cache จะถูกแชร์ในระดับ RAM ทันที Agent B, C, D สามารถดึง KV Cache มาใช้ต่อได้โดยใช้ Token (0 Token Compute)
                  </p>
                  <div className="mt-auto flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <div className="w-16 text-[#ff007f] font-bold">MANAGER</div>
                      <div className="flex-1 h-1.5 bg-[#2a3441] rounded-full overflow-hidden flex">
                        <div className="w-[100%] bg-[#00ffcc]"></div>
                      </div>
                      <div className="w-20 text-right text-[#00ffcc]">Processed KV</div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <div className="w-16 text-emerald-400 font-bold">CODER</div>
                      <div className="flex-1 h-1.5 bg-[#2a3441] rounded-full overflow-hidden flex">
                        <div className="w-[100%] bg-[#00ffcc] opacity-50 border-r-2 border-[#00ffcc]"></div>
                      </div>
                      <div className="w-20 text-right text-emerald-400">Reused (0 Tkn)</div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <div className="w-16 text-purple-400 font-bold">CRITIC</div>
                      <div className="flex-1 h-1.5 bg-[#2a3441] rounded-full overflow-hidden flex">
                        <div className="w-[100%] bg-[#00ffcc] opacity-50 border-r-2 border-[#00ffcc]"></div>
                      </div>
                      <div className="w-20 text-right text-purple-400">Reused (0 Tkn)</div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Brain className="text-[#ff00ff]" size={16} /> Concept Space Mapping (Zero-Token Injection)
                  </h3>
                  <p className="text-xs text-[#8e9bb0]">
                    แปลงความรู้เฉพาะทางเป็น Vector Embeddings ระดับสูง (Latent injection) ยัดเข้าไปในชั้น Attention Layers ของโมเดลโดยตรง โดยไม่ต้องพิมพ์ Prompt แต่อย่างใด
                  </p>
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-xs font-mono text-[#b4c0d3] flex flex-col gap-2">
                    <div className="flex justify-between items-center border-b border-[#2a3441] pb-1">
                      <span>Input Vector Space:</span>
                      <span className="text-amber-400">React.js v19 Specs</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>Injection Method:</span>
                      <span className="text-[#ff00ff]">Direct Attention Override</span>
                    </div>
                    <div className="text-emerald-400 font-bold mt-1 text-right border-t border-[#2a3441] pt-1">
                      PROMPT TOKENS: 0
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: AUTO HEALING */}
          {activeTab === "cognitive_agents" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="border-b border-[#1e2636] pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Infinity className="text-[#ff00ff]" size={20} />
                    Continuous Auto-Healing & Agentic Loop
                  </h2>
                  <p className="text-xs text-[#8e9bb0]">
                    ระบบให้ AI รันงานแบบวนลูป (Loop Engine) เมื่อเกิด Error AI จะอ่าน Error Log วิเคราะห์ และเขียนโค้ดแก้ตัวเองจนกว่าจะผ่าน หรือจบเป้าหมายที่ตั้งไว้
                  </p>
                </div>
                <button
                  onClick={() => addLog("♾️ Initiated Auto-Healing Loop. Agent will self-correct up to 15 attempts.")}
                  className="px-4 py-2 bg-gradient-to-r from-[#ff00ff] to-fuchsia-600 hover:from-fuchsia-500 hover:to-[#ff00ff] text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,255,0.3)] transition-all animate-pulse"
                >
                  <Repeat size={14} /> Start Infinite Loop
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4 md:col-span-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Terminal className="text-[#ff00ff]" size={16} /> Live Agentic Auto-Healing Monitor
                    </h3>
                    <div className="text-[10px] bg-[#ff00ff]/10 text-[#ff00ff] px-2 py-1 border border-[#ff00ff]/30 rounded font-mono font-bold animate-pulse">
                      STATUS: AUTONOMOUS LOOP ACTIVE
                    </div>
                  </div>
                  <div className="bg-[#090b10] p-4 rounded-xl border border-[#1e2636] flex flex-col gap-3 font-mono text-[10px] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-[#ff00ff] to-transparent opacity-50"></div>
                    <div className="flex gap-3 items-start">
                      <span className="text-[#71829e] w-12 text-right">00:01</span>
                      <span className="text-[#ff00ff] font-bold">[WATCHDOG]</span>
                      <span className="text-[#8e9bb0]">Task received: "Refactor multi-threading module"</span>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-[#71829e] w-12 text-right">00:05</span>
                      <span className="text-emerald-400 font-bold">[CODER]</span>
                      <span className="text-emerald-300">Generated v1 code. Executing compiler tests...</span>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-[#71829e] w-12 text-right">00:08</span>
                      <span className="text-rose-500 font-bold">[CRITIC]</span>
                      <span className="text-rose-400">Compilation FAILED: Error TS2304: Cannot find name 'ThreadPool'.</span>
                    </div>
                    <div className="flex gap-3 items-start bg-rose-500/10 p-2 rounded -mx-2 px-2 border-l-2 border-rose-500">
                      <span className="text-[#71829e] w-12 text-right">00:09</span>
                      <span className="text-[#ff00ff] font-bold">[MANAGER]</span>
                      <span className="text-white">Analyzing error AST. Triggering self-correction loop (Attempt 1/3).</span>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-[#71829e] w-12 text-right">00:14</span>
                      <span className="text-emerald-400 font-bold">[CODER]</span>
                      <span className="text-emerald-300">Added missing import statement. Re-compiling...</span>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-[#71829e] w-12 text-right">00:17</span>
                      <span className="text-blue-400 font-bold">[TESTER]</span>
                      <span className="text-blue-300">All 45 tests passed successfully. Code is clean.</span>
                    </div>
                    <div className="flex gap-3 items-start border-t border-[#1e2636] pt-2 mt-1">
                      <span className="text-[#71829e] w-12 text-right">00:18</span>
                      <span className="text-[#e0ff00] font-bold">[SYSTEM]</span>
                      <span className="text-[#e0ff00]">Task completed autonomously. Awaiting next instruction.</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <AlertOctagon className="text-rose-500" size={16} /> AST Error Parser & Critic
                  </h3>
                  <p className="text-xs text-[#8e9bb0]">
                    ระบบสกัด Error จาก Runtime, Linter, หรือ Compiler นำมาวิเคราะห์หา Root Cause (ต้นตอของปัญหา) แล้วป้อนกลับให้ Coder Agent แก้ไข
                  </p>
                  <div className="bg-[#141a29] rounded-xl border border-rose-500/30 p-3 text-xs text-[#b4c0d3] flex flex-col gap-2 font-mono">
                    <div className="text-rose-400 font-bold flex items-center gap-1">
                      <ShieldAlert size={12} /> ERROR: Cannot read properties of undefined (reading 'map')
                    </div>
                    <div className="text-[#8e9bb0] pl-4 border-l border-[#2a3441]">
                      Line 42: `users.map(u =&gt; ...)`
                    </div>
                    <div className="text-emerald-400 font-bold mt-1 flex items-center gap-1">
                      <Wrench size={12} /> ACTION: Inject Optional Chaining (`users?.map`) or Default Array fallback.
                    </div>
                  </div>
                </div>

                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <RefreshCw className="text-[#ff00ff]" size={16} /> Watchdog & Backoff Strategy
                  </h3>
                  <p className="text-xs text-[#8e9bb0]">
                    กลไกควบคุมลูปไม่ให้เกิดการแก้ไขวนซ้ำในจุดเดิมแบบไม่รู้จบ (Infinite Loop Break) หากผิดแบบเดิมครบ 3 ครั้ง จะเปลี่ยนวิธีแก้ปัญหา (Pivot Approach)
                  </p>
                  <div className="flex flex-col gap-2 mt-auto">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#71829e]">Attempt 1/15</span>
                      <span className="text-emerald-400">SUCCESS</span>
                    </div>
                    <div className="w-full h-1 bg-[#2a3441] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 w-full"></div>
                    </div>
                    
                    <div className="flex justify-between text-xs font-mono mt-2">
                      <span className="text-[#71829e]">Attempt 4/15 (Stuck Detection)</span>
                      <span className="text-amber-400">PIVOTING</span>
                    </div>
                    <div className="w-full h-1 bg-[#2a3441] rounded-full overflow-hidden flex">
                      <div className="h-full bg-rose-500 w-[30%]"></div>
                      <div className="h-full bg-amber-400 w-[40%] animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <HardDrive className="text-blue-400" size={16} /> Memory Checkpointing & Resume
                  </h3>
                  <p className="text-xs text-[#8e9bb0]">
                    บันทึกสถานะการคิด (State) ลงดิสก์ทุกๆ 5 วินาที หากไฟดับ หรือโปรแกรมแครช (Crash) สามารถดึงความจำขึ้นมาและรันงานต่อจากจุดที่ดับได้ทันที โดยไม่ต้องเริ่มใหม่
                  </p>
                  <div className="bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-xs text-[#b4c0d3] flex flex-col gap-2 font-mono mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
                      <span className="text-blue-400">Snapshot: task_state_984.bin (12MB)</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <RotateCcw size={14} className="text-[#8e9bb0]" />
                      <span className="text-[#8e9bb0]">Ready for instant recovery (0.05s)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Shield className="text-rose-400" size={16} /> OOM Panic Shield & Fallback
                  </h3>
                  <p className="text-xs text-[#8e9bb0]">
                    ระบบตรวจจับ VRAM/RAM ใกล้เต็ม หากพบว่าระบบกำลังจะค้าง (Out of Memory) จะทำการลดขนาด Context ชั่วคราว หรือ Offload ไปที่ดิสก์ เพื่อป้องกันการแครชกลางคัน (100% Uptime)
                  </p>
                  <div className="mt-auto flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-mono font-bold">
                      <span className="text-rose-400">VRAM USAGE: 99.8% (DANGER)</span>
                    </div>
                    <div className="w-full h-1.5 bg-rose-950 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 w-[99.8%] animate-pulse"></div>
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 mt-1">
                      &gt; Triggering Offload to NVMe SSD... [SAVED]
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: NEURO-SYMBOLIC */}
          {activeTab === "cognitive_agents" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="border-b border-[#1e2636] pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Microscope className="text-[#e0ff00]" size={20} />
                    Neuro-Symbolic Logic Engine
                  </h2>
                  <p className="text-xs text-[#8e9bb0]">
                    ผนวกรวมโครงข่ายประสาทเทียม (Neural Network) เข้ากับตรรกะแบบสัญลักษณ์ (Symbolic AI / Prolog) เพื่อบังคับกฎและรับประกันความถูกต้องของคำตอบระดับคณิตศาสตร์ ไม่มั่ว (0% Hallucination)
                  </p>
                </div>
                <button
                  onClick={() => addLog("🧠 Compiled neuro-symbolic grammar rules. Exact Match Mode ENABLED.")}
                  className="px-4 py-2 bg-gradient-to-r from-[#e0ff00] to-yellow-500 hover:from-yellow-400 hover:to-[#e0ff00] text-black font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(224,255,0,0.3)] transition-all"
                >
                  <Cpu size={14} /> Inject Logic Constraints
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileCode className="text-[#e0ff00]" size={16} /> JSON/Regex Grammar Enforcement
                  </h3>
                  <p className="text-xs text-[#8e9bb0]">
                    แทรกแซงระดับ Sampler (Logits Processor) เพื่อปฏิเสธ Token ที่ไม่ตรงกับรูปแบบ JSON Schema หรือ Regex ที่กำหนด ทำให้ผลลัพธ์ Parsing ไม่เคยพัง
                  </p>
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-xs font-mono flex flex-col gap-2 relative overflow-hidden">
                    <div className="text-[#8e9bb0]">Logit: <span className="text-red-400 line-through">"Sure, here is the..."</span> <span className="text-rose-500 font-bold ml-2">VIOLATION! (Banned)</span></div>
                    <div className="text-[#8e9bb0]">Logit: <span className="text-emerald-400">"&#123; \"data\": ["</span> <span className="text-emerald-500 font-bold ml-2">VALID (Allowed)</span></div>
                    <div className="w-full h-1 mt-2 bg-[#2a3441] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#e0ff00] to-emerald-400 animate-pulse w-full"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Brain className="text-purple-400" size={16} /> Symbolic Math Solver Hook
                  </h3>
                  <p className="text-xs text-[#8e9bb0]">
                    เมื่อโมเดลเจอสมการคณิตศาสตร์ จะไม่ใช้ Neural Net เดาคำตอบ แต่ส่งให้ Python SymPy/Wolfram-like Engine ในเครื่องคิดแทน แล้วเอาผลลัพธ์มาเติม
                  </p>
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-xs font-mono text-[#b4c0d3] flex flex-col gap-1.5">
                    <div className="flex justify-between items-center border-b border-[#2a3441] pb-1">
                      <span>Neural Net (LLM):</span>
                      <span className="text-amber-400">"Let me calculate..."</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-[#e0ff00]">Symbolic (Python):</span>
                      <span className="font-bold">integrate(x^2, x) = x^3/3</span>
                    </div>
                    <div className="text-emerald-400 font-bold mt-1 text-right border-t border-[#2a3441] pt-1">
                      FINAL: 100% ACCURATE
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: SECURITY PRIVACY */}
          {activeTab === "knowledge_training" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="border-b border-[#1e2636] pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Shield className="text-[#00ffff]" size={20} />
                    Air-Gapped Security Vault & DRM
                  </h2>
                  <p className="text-xs text-[#8e9bb0]">
                    ระบบป้องกันการโจรกรรมน้ำหนักโมเดล (Weights), ป้องกัน Prompt Injection ขั้นสุดยอด และลายน้ำ (Watermarking)
                  </p>
                </div>
                <button
                  onClick={() => addLog("🛡️ Encrypted Weights & Initialized DRM Sandboxing.")}
                  className="px-4 py-2 bg-gradient-to-r from-[#00ffff] to-cyan-600 hover:from-cyan-500 hover:to-[#00ffff] text-black font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all"
                >
                  <Lock size={14} /> Seal Model Weights
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0e121c] p-4 rounded-xl border border-[#1e2636] flex flex-col gap-3">
                  <Key className="text-amber-400" size={24} />
                  <h3 className="text-sm font-bold text-white">Full Weights Encryption</h3>
                  <p className="text-[10px] text-[#8e9bb0]">
                    เข้ารหัสไฟล์ `.gguf` หรือ `.safetensors` ด้วย AES-256 ป้องกันคนก๊อปปี้โมเดลของคุณไปใช้ จะถอดรหัสใน RAM เมื่อรันเท่านั้น
                  </p>
                  <div className="mt-auto px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded text-[10px] font-mono font-bold text-center">
                    AES-256 MEMORY DECRYPT
                  </div>
                </div>

                <div className="bg-[#0e121c] p-4 rounded-xl border border-[#1e2636] flex flex-col gap-3">
                  <Globe className="text-[#00ffff]" size={24} />
                  <h3 className="text-sm font-bold text-white">Strict Air-Gap Subnet</h3>
                  <p className="text-[10px] text-[#8e9bb0]">
                    ตัดการเชื่อมต่อ Socket Network ขาออกแบบเด็ดขาด โมเดลจะอ่านเขียนได้เฉพาะ Local Filesystem และ IPC เท่านั้น
                  </p>
                  <div className="mt-auto px-3 py-1.5 bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/30 rounded text-[10px] font-mono font-bold text-center">
                    0.0.0.0 BLOCKED
                  </div>
                </div>

                <div className="bg-[#0e121c] p-4 rounded-xl border border-[#1e2636] flex flex-col gap-3">
                  <Fingerprint className="text-purple-400" size={24} />
                  <h3 className="text-sm font-bold text-white">KGW Watermarking</h3>
                  <p className="text-[10px] text-[#8e9bb0]">
                    สอดแทรกลายน้ำดิจิทัลแบบมองไม่เห็นลงในการสุ่ม Token (Logit bias) เพื่อใช้พิสูจน์สิทธิ์ว่าข้อความนี้สร้างจากระบบของคุณ
                  </p>
                  <div className="mt-auto px-3 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded text-[10px] font-mono font-bold text-center animate-pulse">
                    TRACKING ACTIVE
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: HYPER CONTINUITY */}
          {activeTab === "hyper_reality" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="border-b border-[#1e2636] pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Globe className="text-[#b829ff]" size={20} />
                    Hyper-Continuity World Engine (Quantum Scale)
                  </h2>
                  <p className="text-xs text-[#8e9bb0]">
                    ระบบประมวลผลเชิงลึกระดับมหภาค ที่ช่วยรักษาความปะติดปะต่อ (Continuity) ระหว่างแผนที่ เนื้อเรื่อง ไอเท็ม และ NPC ให้สอดคล้องกันอย่างสมบูรณ์แบบ 100% ไร้รอยต่อ พร้อมการวิเคราะห์เชิงลึกแบบ Quantum State Matrix
                  </p>
                </div>
                <button
                  onClick={() => addLog("🌌 Triggered Hyper-Continuity. Stitching world sectors & lore matrices with Quantum State Engine...")}
                  className="px-4 py-2 bg-gradient-to-r from-[#b829ff] to-purple-600 hover:from-purple-500 hover:to-[#b829ff] text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(184,41,255,0.3)] transition-all"
                >
                  <Map size={14} /> Execute Mega-Stitching
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                {/* 1. SEAMLESS TERRAIN */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Map className="text-emerald-400" size={16} /> Seamless Terrain & Sub-Biome Stitching
                    </h3>
                    <div className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/30 animate-pulse">
                      GEO-MATCHING: ACTIVE
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    การต่อแผนที่ระดับลึก: ตรวจสอบความสอดคล้องระดับ Vertex และ Voxel ถ้า Map A มีแม่น้ำหรือรากไม้โผล่ขอบขวา Map B จะต้องงอกรากหรือต้นน้ำตรงกันแบบ Pixel-perfect ระบบปรับ Texture, Mesh, และสภาพอากาศ (Volumetric Weather) ให้กลืนกันเนียนสนิท 
                  </p>
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono text-[#b4c0d3] flex flex-col gap-2 relative overflow-hidden">
                    <div className="flex justify-between border-b border-[#2a3441] pb-1 text-xs">
                      <span className="text-[#8e9bb0]">Sector: <span className="text-white">Oasis_East</span></span>
                      <span className="text-emerald-400 font-bold text-[14px]">⬄</span>
                      <span className="text-[#8e9bb0]">Sector: <span className="text-white">Desert_West</span></span>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 mt-1">
                      <div className="flex justify-between items-center bg-[#0e121c] p-1.5 rounded border border-[#1e2636]">
                        <span className="w-1/3 text-left">River Mesh [Z:90]</span>
                        <div className="w-1/3 h-1.5 bg-[#1e2636] rounded-full overflow-hidden flex relative">
                          <div className="w-[50%] h-full bg-blue-500"></div>
                          <div className="absolute top-0 left-1/2 w-0.5 h-full bg-emerald-400 animate-ping"></div>
                          <div className="w-[50%] h-full bg-blue-400"></div>
                        </div>
                        <span className="w-1/3 text-right">River Mesh [Z:90]</span>
                      </div>
                      
                      <div className="flex justify-between items-center bg-[#0e121c] p-1.5 rounded border border-[#1e2636]">
                        <span className="w-1/3 text-left">Temp: 32°C (Humid)</span>
                        <div className="w-1/3 text-center text-[9px] text-emerald-400 font-bold tracking-widest">SMOOTHING</div>
                        <span className="w-1/3 text-right">Temp: 45°C (Dry)</span>
                      </div>
                      
                      <div className="flex justify-between items-center bg-[#0e121c] p-1.5 rounded border border-[#1e2636]">
                        <span className="w-1/3 text-left text-amber-400">Sandstone Rock_A</span>
                        <div className="w-1/3 text-center text-[9px] text-emerald-400 font-bold tracking-widest">FUSED</div>
                        <span className="w-1/3 text-right text-amber-500">Sandstone Rock_B</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. LORE PUZZLE */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Puzzle className="text-amber-400" size={16} /> Multi-Dimensional Lore Matrix
                    </h3>
                    <div className="text-[9px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono border border-amber-500/30">
                      PLOT HOLE: 0%
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    โครงข่ายเอกสารและเรื่องราว (Knowledge Graph): ระบบกระจายเบาะแส (Clues) กว่า 10,000 จุด หากผู้เล่นนำเอกสาร A (ในดันเจี้ยน) มาอ่านคู่กับจดหมาย B (ในเมือง) และคำพูดของ NPC C จะต่อกันเป็นเนื้อเรื่องลับได้พอดี โดยใช้ Vector Database ตรวจสอบความขัดแย้งของ Timeline แบบเรียลไทม์
                  </p>
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-xs font-mono flex flex-col gap-3 relative">
                    <div className="absolute right-3 top-3 opacity-20">
                      <svg width="60" height="60" viewBox="0 0 100 100" className="animate-[spin_20s_linear_infinite]">
                        <circle cx="50" cy="50" r="40" stroke="#fbbf24" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                        <circle cx="50" cy="50" r="25" stroke="#fbbf24" strokeWidth="1" fill="none" />
                        <line x1="50" y1="10" x2="50" y2="90" stroke="#fbbf24" strokeWidth="0.5" />
                        <line x1="10" y1="50" x2="90" y2="50" stroke="#fbbf24" strokeWidth="0.5" />
                      </svg>
                    </div>
                    
                    <div className="text-[#8e9bb0] z-10">Meta-Narrative: <span className="text-amber-400 font-bold">"The Lost King's Crown"</span></div>
                    
                    <div className="flex flex-col gap-1.5 z-10">
                      <div className="flex items-center gap-2 text-[10px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                        <span className="text-blue-400 font-bold w-12">Clue 1:</span>
                        <span className="text-[#8e9bb0] bg-[#1e2636] px-2 py-0.5 rounded flex-1 truncate">Diary mentions hidden vault...</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                        <span className="text-purple-400 font-bold w-12">Clue 2:</span>
                        <span className="text-[#8e9bb0] bg-[#1e2636] px-2 py-0.5 rounded flex-1 truncate">NPC remembers a symbol...</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                        <span className="text-emerald-400 font-bold w-12">Clue 3:</span>
                        <span className="text-[#8e9bb0] bg-[#1e2636] px-2 py-0.5 rounded flex-1 truncate">Mural shows the exact symbol!</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-[#2a3441] pt-2 mt-1 z-10">
                      <span className="text-[9px] text-[#71829e]">Vector Sync: Completed</span>
                      <span className="text-amber-400 text-[10px] font-bold">100% TIMELINE COHESION</span>
                    </div>
                  </div>
                </div>

                {/* 3. NPC DEPTH */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                   <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Mic className="text-[#b829ff]" size={16} /> Hyper-Sentient NPC & Voice DNA
                    </h3>
                    <div className="text-[9px] bg-[#b829ff]/10 text-[#b829ff] px-2 py-0.5 rounded font-mono border border-[#b829ff]/30">
                      EMOTION ENGINE
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    NPC ทุกตัวมี Memory Graph ส่วนตัวจดจำผู้เล่นได้ตลอดกาล ประมวลผลร่วมกับ <strong>Dynamic Voice Synthesis</strong> ที่ผันแปรโทนเสียง ความเร็ว และการสั่นของเสียง (Voice DNA) ตามความเหนื่อยล้า, บาดแผล, หรือความรู้สึกโกรธ/กลัวแบบ Real-time
                  </p>
                  
                  <div className="mt-auto flex flex-col gap-2.5 bg-[#141a29] border border-[#222b3d] p-3 rounded-xl">
                    <div className="flex justify-between items-end border-b border-[#2a3441] pb-2">
                      <div>
                        <div className="text-[10px] text-[#8e9bb0]">Target NPC</div>
                        <div className="text-sm text-[#b829ff] font-bold font-mono">Captain Vane</div>
                      </div>
                      <div className="text-[9px] px-1.5 py-0.5 bg-rose-500/20 text-rose-400 rounded border border-rose-500/30 uppercase">Status: Wounded (HP 15%)</div>
                    </div>
                    
                    <div className="flex flex-col gap-2 pt-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-[#71829e] w-14">Pitch/Tone</span>
                        <div className="flex-1 h-1.5 bg-[#1e2636] rounded-full overflow-hidden flex items-center">
                           <div className="h-full bg-gradient-to-r from-[#b829ff] to-rose-500 w-[75%]"></div>
                        </div>
                        <span className="text-[10px] text-white w-12 text-right">Gravely</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-[#71829e] w-14">Breath</span>
                        <div className="flex-1 flex gap-0.5 items-end h-3">
                          {[20,40,20,80,90,30,10,60,100,50,20,10].map((v, i) => (
                            <div key={i} style={{height: `${v}%`}} className="flex-1 bg-[#b829ff] opacity-80 animate-pulse"></div>
                          ))}
                        </div>
                        <span className="text-[10px] text-white w-12 text-right">Heavy</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-[#71829e] w-14">Memory</span>
                        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-400/10 px-2 py-0.5 rounded flex-1 truncate">
                          "Player saved me 2 days ago..."
                        </span>
                      </div>
                    </div>
                    <div className="bg-[#0e121c] text-[#8e9bb0] p-2 rounded text-[10px] italic border border-[#1e2636] mt-1 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#b829ff]"></div>
                      "I... I remember you... *cough*... Thank you for back then..." 
                    </div>
                  </div>
                </div>

                {/* 4. ITEM LOGIC */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <PackageOpen className="text-rose-400" size={16} /> Relational Artifact Generator
                    </h3>
                    <div className="text-[9px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-mono border border-rose-500/30">
                      ITEM SYNERGY
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    ไอเท็มทุกชิ้นไม่ได้ถูกสุ่มขึ้นมาลอยๆ แต่จะถูก <strong>Generate ประวัติและสภาพ (Condition)</strong> ให้ผูกกับสิ่งแวดล้อมโดยรอบ หากเจอ "ดาบสนิมเขรอะ" ในถ้ำน้ำแข็ง ระบบจะสร้าง Lore ว่าดาบนี้ถูกแช่แข็งมา 300 ปี พร้อมร่องรอยการต่อสู้กับหมีขั้วโลกที่กระดูกตกอยู่ข้างๆ
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono text-[#b4c0d3] flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-[#2a3441] pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
                        <span className="text-white font-bold text-xs">Artifact Forging...</span>
                      </div>
                      <span className="text-[#71829e]">Entity: #993A-B</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1 bg-[#0e121c] p-1.5 rounded border border-[#1e2636]">
                        <span className="text-[#71829e]">Environment context:</span>
                        <span className="text-blue-400">Ice Cave (-15°C)</span>
                      </div>
                      <div className="flex flex-col gap-1 bg-[#0e121c] p-1.5 rounded border border-[#1e2636]">
                        <span className="text-[#71829e]">Nearby Entity:</span>
                        <span className="text-emerald-400">Frost Bear Skeleton</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <span className="text-[#71829e]">&gt; Fusing context to Item...</span>
                      <div className="bg-gradient-to-r from-rose-900/40 to-transparent border-l-2 border-rose-500 p-2 rounded-r">
                        <div className="text-rose-400 font-bold mb-1">Generated: "Frost-bitten Iron Broadsword"</div>
                        <div className="text-[#8e9bb0] italic leading-tight">
                          "The blade is heavily chipped. Deep claw marks on the hilt match the skeletal remains nearby. Frozen blood indicates a bitter end."
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 5. DYNAMIC QUEST TREE */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4 md:col-span-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Network className="text-[#ff00ff]" size={16} /> Omni-Directional Causality Quest Engine (Butterfly Effect)
                    </h3>
                    <div className="text-[10px] bg-[#ff00ff]/10 text-[#ff00ff] px-2 py-1 border border-[#ff00ff]/30 rounded font-mono font-bold animate-pulse">
                      STATUS: CAUSALITY CALCULATED
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0] max-w-4xl">
                    เหนือกว่า Quest แบบเส้นตรง (Linear) ระบบนี้จำลอง <strong>ปรากฏการณ์ผีเสื้อขยับปีก (Butterfly Effect)</strong> การกระทำเล็กๆ ของผู้เล่น เช่น เด็ดดอกไม้หายาก ทำให้ NPC ปรุงยาไม่ได้ ส่งผลให้ทหารในเมืองป่วย ลามไปถึงการล่มสลายของปราสาท ระบบปรับเปลี่ยนโครงสร้าง Quest และบทสนทนาของทั้งโลกแบบ Real-time สอดคล้องกัน 100% ไร้รอยต่อ
                  </p>
                  
                  <div className="bg-[#090b10] p-4 rounded-xl border border-[#1e2636] flex flex-col gap-3 font-mono text-[10px] relative overflow-hidden mt-2">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff00ff] via-[#00ffff] to-[#e0ff00] opacity-50"></div>
                     
                     <div className="flex flex-col md:flex-row gap-4">
                        {/* Event 1 */}
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="text-[#71829e] mb-1">NODE A (Player Action)</div>
                          <div className="bg-[#141a29] border border-[#222b3d] p-2 rounded">
                            <div className="text-emerald-400 font-bold">Action: "Killed Wolf Alpha"</div>
                            <div className="text-[#8e9bb0]">Location: Northern Woods</div>
                            <div className="text-[#8e9bb0]">Time: Day 12, 14:00</div>
                          </div>
                        </div>
                        
                        <div className="hidden md:flex flex-col justify-center items-center">
                          <span className="text-[#ff00ff]">⟹</span>
                          <span className="text-[8px] text-[#71829e] text-center w-16">Rippling...</span>
                        </div>
                        
                        {/* Event 2 */}
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="text-[#71829e] mb-1">NODE B (Ecosystem Shift)</div>
                          <div className="bg-[#141a29] border border-[#222b3d] p-2 rounded">
                            <div className="text-amber-400 font-bold">Impact: "Deer Overpopulation"</div>
                            <div className="text-[#8e9bb0]">Effect: Crops destroyed</div>
                            <div className="text-rose-400">Trigger: Famine Event</div>
                          </div>
                        </div>
                        
                        <div className="hidden md:flex flex-col justify-center items-center">
                          <span className="text-[#ff00ff]">⟹</span>
                          <span className="text-[8px] text-[#71829e] text-center w-16">Recalculating Lore...</span>
                        </div>
                        
                        {/* Event 3 */}
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="text-[#71829e] mb-1">NODE C (World Consequence)</div>
                          <div className="bg-[#ff00ff]/10 border border-[#ff00ff]/30 p-2 rounded shadow-[0_0_10px_rgba(255,0,255,0.1)]">
                            <div className="text-[#ff00ff] font-bold">Quest Generated: "Starving Riot"</div>
                            <div className="text-white">NPC Dialogue updated globally</div>
                            <div className="text-emerald-400 mt-1">&gt; Continuity Intact</div>
                          </div>
                        </div>
                     </div>
                  </div>
                </div>

                {/* 6. PROTAGONIST PSYCHOLOGY */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Brain className="text-[#00ffff]" size={16} /> Protagonist Deep Psychology Engine
                    </h3>
                    <div className="text-[9px] bg-[#00ffff]/10 text-[#00ffff] px-2 py-0.5 rounded font-mono border border-[#00ffff]/30">
                      TRAUMA & GROWTH
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    ตัวละครหลัก (Main Character) ไม่ใช่กระดาษเปล่า ระบบวิเคราะห์ <strong>บาดแผลทางใจ (Trauma), ความเชื่อ (Beliefs), และพัฒนาการ (Character Arc)</strong> จากทุกการตัดสินใจของผู้เล่น หากเลือกทางโหดร้ายบ่อยๆ ตัวละครจะมีบทสนทนาในใจ (Inner Monologue) ที่มืดมนลง หรือมีอาการมือสั่น (Animation Sync) เมื่อเจอเหตุการณ์สะเทือนใจซ้ำรอยอดีต
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono text-[#b4c0d3] flex flex-col gap-2">
                    <div className="flex justify-between text-xs border-b border-[#2a3441] pb-1">
                      <span className="text-[#8e9bb0]">Profile: <span className="text-white font-bold">Player Character</span></span>
                      <span className="text-[#00ffff]">Arc: Fall from Grace</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-16 text-[#71829e]">Empathy</div>
                      <div className="flex-1 h-1 bg-[#1e2636] rounded overflow-hidden">
                        <div className="h-full bg-rose-500 w-[20%]"></div>
                      </div>
                      <div className="w-8 text-right text-rose-500">-15</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-16 text-[#71829e]">Paranoia</div>
                      <div className="flex-1 h-1 bg-[#1e2636] rounded overflow-hidden">
                        <div className="h-full bg-amber-400 w-[85%]"></div>
                      </div>
                      <div className="w-8 text-right text-amber-400">+40</div>
                    </div>
                    
                    <div className="bg-[#0e121c] p-2 rounded border-l-2 border-[#00ffff] mt-1 text-[#8e9bb0] italic">
                      &gt; Inner Monologue Gen: "They're smiling at me... Just like the bandits did before the ambush. Don't trust them."
                    </div>
                  </div>
                </div>

                {/* 7. MONSTER ECOSYSTEM */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Bug className="text-rose-500" size={16} /> Monster Evolutionary Ecosystem
                    </h3>
                    <div className="text-[9px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded font-mono border border-rose-500/30">
                      DARWINIAN LOGIC
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    มอนสเตอร์ทุกตัวไม่ได้เกิดมาเพื่อรอถูกตี ระบบสร้าง <strong>ห่วงโซ่อาหาร (Food Chain) และวิวัฒนาการ</strong> แบบเรียลไทม์ ถ้ายิงธนูไฟใส่มอนสเตอร์เผ่า A บ่อยๆ รุ่นต่อไปของเผ่า A จะสวมเกราะกันไฟ (Adaptive Morphology) และมีประวัติ (Lore) บันทึกว่าพวกมันเรียนรู้ความหวาดกลัวจาก "ปีศาจธนูเพลิง" (ตัวผู้เล่น)
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs border-b border-[#2a3441] pb-1">
                      <span className="text-[#8e9bb0]">Species: <span className="text-white font-bold">Gloom Crawler</span></span>
                      <span className="text-rose-500">Gen 4 (Mutated)</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="bg-[#0e121c] border border-[#1e2636] p-1.5 rounded flex flex-col">
                         <span className="text-[#71829e]">Stimulus (Past)</span>
                         <span className="text-amber-400 text-[9px]">Heavy Fire Magic (Player)</span>
                      </div>
                      <div className="bg-[#0e121c] border border-rose-900/50 p-1.5 rounded flex flex-col">
                         <span className="text-[#71829e]">Evolution (Present)</span>
                         <span className="text-rose-400 text-[9px]">Asbestos Shell (+80% Fire Res)</span>
                      </div>
                    </div>
                    
                    <div className="text-[#8e9bb0] text-[9px] mt-1 border-t border-[#2a3441] pt-1">
                      <span className="text-emerald-400 font-bold">New Lore:</span> "The Crawlers shed their soft skin, hardening against the Scorching Walker..."
                    </div>
                  </div>
                </div>

                {/* 8. AUTHORIAL AI DIRECTOR */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4 md:col-span-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <BookOpen className="text-[#e0ff00]" size={16} /> Authorial AI Director (Deep Narrative Loom)
                    </h3>
                    <div className="text-[10px] bg-[#e0ff00]/10 text-[#e0ff00] px-2 py-1 border border-[#e0ff00]/30 rounded font-mono font-bold animate-pulse">
                      STATUS: WEAVING THREADS
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    ระบบคุมจังหวะการเล่าเรื่อง (Pacing & Tension) ดั่งผู้กำกับระดับรางวัลออสการ์ ทำหน้าที่ผสาน (Stitch) ทุกๆ องค์ประกอบเข้าด้วยกัน ทั้งจุดกำเนิด (Origin), จุดหักมุม (Plot Twist), และบทสรุป (Epilogue) ไม่ว่าผู้เล่นจะทำลายพล็อตไปกี่ครั้ง AI Director จะถักทอเส้นด้ายแห่งโชคชะตาใหม่ให้กลับมามีเหตุมีผล (Logical Sense) และซึ้งกินใจได้อย่างไร้รอยต่อ
                  </p>
                  
                  <div className="bg-[#141a29] border border-[#222b3d] p-4 rounded-xl flex flex-col gap-3 mt-2">
                    <div className="flex justify-between text-[10px] font-mono text-[#71829e]">
                      <span>Narrative Tension Curve</span>
                      <span>Target: Climax Phase</span>
                    </div>
                    
                    {/* Graph Simulation */}
                    <div className="h-16 w-full flex items-end gap-1 border-b border-[#2a3441] pb-1 relative">
                      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-emerald-500/20 border-t border-dashed border-emerald-500/50"></div>
                      {[10, 15, 12, 25, 40, 35, 60, 85, 95, 40, 20].map((h, i) => (
                        <div key={i} style={{height: `${h}%`}} className={`flex-1 rounded-t-sm ${h > 80 ? 'bg-[#e0ff00] animate-pulse' : 'bg-[#1e2636]'}`}></div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[10px] font-mono">
                      <div className="flex flex-col gap-1">
                         <span className="text-[#71829e] uppercase">Active Subplots</span>
                         <span className="text-white bg-[#1e2636] px-2 py-1 rounded">1. The Broken Sword</span>
                         <span className="text-white bg-[#1e2636] px-2 py-1 rounded">2. Orphan's Revenge</span>
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-[#71829e] uppercase">Convergence Point</span>
                         <div className="h-full bg-gradient-to-r from-[#1e2636] to-amber-900/30 border border-amber-500/30 p-2 rounded flex flex-col justify-center items-center text-amber-400">
                           <GitMerge size={14} className="mb-1" />
                           <span>Merge at Boss Fight</span>
                         </div>
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-[#71829e] uppercase">Generated Epilogue</span>
                         <span className="text-emerald-400 bg-emerald-900/20 border border-emerald-500/30 px-2 py-1 rounded italic h-full overflow-hidden">
                           "The sword, reforged in blood, saved the child... but doomed the hero."
                         </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <User className="text-[#ff00ff]" size={16} /> Morphological Phenotype Engine
                    </h3>
                    <div className="text-[9px] bg-[#ff00ff]/10 text-[#ff00ff] px-2 py-0.5 rounded font-mono border border-[#ff00ff]/30">
                      DNA GENERATION
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    สร้างรูปร่างหน้าตาตัวละคร (NPC/Main) แบบสืบทอดพันธุกรรม (Genetic Inheritance) ไม่ได้สุ่มลอยๆ โครงหน้า สีตา สีผม จะอิงตามเผ่าพันธุ์ สภาพอากาศเมืองที่อยู่ และร่องรอยบาดแผลจะสอดคล้องกับอาชีพและประวัติในอดีต (เช่น ทหารรับจ้างมีรอยแผลเป็นที่คอจากสงครามครั้งก่อน)
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono text-[#b4c0d3] flex flex-col gap-2 relative">
                    <div className="flex justify-between border-b border-[#2a3441] pb-1">
                      <span className="text-[#8e9bb0]">Phenotype: <span className="text-white">Northern Blacksmith</span></span>
                    </div>
                    <div className="flex gap-4 items-center mt-1">
                      <div className="w-10 h-10 rounded-full border-2 border-emerald-500/50 flex items-center justify-center bg-[#1e2636] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-transparent"></div>
                        <User size={20} className="text-emerald-400 opacity-50" />
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <div className="flex justify-between">
                          <span className="text-[#71829e]">Skin:</span> <span className="text-amber-400">Weathered, Burn Scars (Left Arm)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#71829e]">Physique:</span> <span className="text-blue-400">Hypertrophy (Right Shoulder)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#71829e]">Lineage:</span> <span className="text-[#ff00ff]">75% Nordic, 25% Elven (Pointed ears)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                   <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Eye className="text-[#00ffff]" size={16} /> Micro-Expression & Biometric Matrix
                    </h3>
                    <div className="text-[9px] bg-[#00ffff]/10 text-[#00ffff] px-2 py-0.5 rounded font-mono border border-[#00ffff]/30">
                      PUPIL DILATION
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    สีหน้า แววตา และภาษากาย (Body Language) ทำงานผ่าน AI Physics หาก NPC กำลังโกหก รูม่านตาจะขยาย เหงื่อซึม หรือหลบสายตาแบบสุ่มตามลักษณะนิสัย (Micro-expressions) อารมณ์สะท้อนผ่านการหดเกร็งของกล้ามเนื้อใบหน้ากว่า 100 จุด (FACS)
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono text-[#b4c0d3] flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs border-b border-[#2a3441] pb-1">
                      <span className="text-[#8e9bb0]">Action: <span className="text-white font-bold">Lying to Player</span></span>
                      <span className="text-[#00ffff] animate-pulse">DETECTED</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="bg-[#0e121c] border border-[#1e2636] p-1.5 rounded flex flex-col">
                         <span className="text-[#71829e]">Eye Contact</span>
                         <span className="text-rose-400">Avoidant (Right-down)</span>
                      </div>
                      <div className="bg-[#0e121c] border border-[#1e2636] p-1.5 rounded flex flex-col">
                         <span className="text-[#71829e]">Pupil Size</span>
                         <span className="text-amber-400">Dilated (+15%)</span>
                      </div>
                      <div className="bg-[#0e121c] border border-[#1e2636] p-1.5 rounded flex flex-col col-span-2">
                         <span className="text-[#71829e]">Muscle Tension (FACS)</span>
                         <span className="text-[#00ffff]">AU12 (Lip Corner Puller) - Asymmetrical Twitch</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <AudioLines className="text-emerald-400" size={16} /> Generative Vocal Tract (Speech DNA)
                    </h3>
                    <div className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/30">
                      VOCAL CORDS SIM.
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    ไม่ได้ใช้เสียงสังเคราะห์แบบตายตัว แต่จำลอง <strong>"กล่องเสียงและหลอดลม" (Vocal Tract Simulation)</strong> ทำให้เสียงของตัวละครผันแปรตามอายุ อาการบาดเจ็บ ความเหนื่อยหอบ และสภาพแวดล้อม (ถ้ำแคบ/ที่โล่ง) เสียงจะสั่นเครือเมื่อร้องไห้ หรือแหบพร่าเมื่อโดนเวทย์มนตร์ไฟไหม้คอ
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 flex gap-0.5 h-4 items-end">
                        {[10,30,50,80,100,70,40,20,50,90,100,80,40,20,10].map((v, i) => (
                          <div key={i} style={{height: `${v}%`}} className="flex-1 bg-emerald-500 opacity-80 animate-pulse"></div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between border-t border-[#2a3441] pt-1">
                      <span className="text-[#71829e]">Pitch: <span className="text-emerald-400">120Hz (Gruff)</span></span>
                      <span className="text-[#71829e]">Mod: <span className="text-rose-400">Smoke Damaged (Rasp+30)</span></span>
                    </div>
                    <div className="text-[#8e9bb0] italic bg-[#0e121c] p-1.5 rounded mt-1 border border-[#1e2636]">
                      &gt; Rendering Audio: [Heavy breathing] "I won't... [Cough] ... surrender."
                    </div>
                  </div>
                </div>

                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Share2 className="text-[#b829ff]" size={16} /> Deep Interpersonal Web Matrix
                    </h3>
                    <div className="text-[9px] bg-[#b829ff]/10 text-[#b829ff] px-2 py-0.5 rounded font-mono border border-[#b829ff]/30">
                      GOSSIP & TRUST
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    โครงข่ายความสัมพันธ์ของโลก (Web of Trust) ตัวละครทุกตัวแชร์ข่าวสาร (Gossip System) หากคุณช่วยชีวิตชาวบ้าน A, ชาวบ้าน A จะไปเล่าให้ทหาร B ฟัง ทหาร B อาจส่งจดหมายไปเมือง C ทำให้เมื่อคุณไปเมือง C คุณจะได้รับการต้อนรับดั่งฮีโร่ ความสัมพันธ์ซับซ้อนระดับ 6 องศา (Six Degrees of Separation)
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono text-[#b4c0d3] flex flex-col gap-2 relative">
                    <div className="flex items-center gap-2 mb-1">
                       <span className="text-white font-bold">Player Action:</span> <span className="text-emerald-400">Saved Merchant (Node 1)</span>
                    </div>
                    
                    <div className="pl-2 border-l border-[#2a3441] flex flex-col gap-1.5 relative">
                      <div className="flex items-center gap-2">
                        <span className="text-[#b829ff]">↳</span>
                        <span className="text-[#8e9bb0]">Node 1 tells <span className="text-amber-400">Guard (Node 2)</span></span>
                      </div>
                      <div className="flex items-center gap-2 pl-3">
                        <span className="text-[#b829ff]">↳</span>
                        <span className="text-[#8e9bb0]">Node 2 informs <span className="text-rose-400">Captain (Node 3)</span></span>
                      </div>
                      <div className="flex items-center gap-2 pl-6">
                        <span className="text-[#b829ff]">↳</span>
                        <span className="text-white">Node 3 updates <span className="text-emerald-400 font-bold">Global Faction Rep: +250</span></span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === "hyper_reality" && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <PersonStanding className="text-[#ff3366]" size={20} />
                    Hyper-Kinematic Motion Engine (Procedural Animation)
                  </h2>
                  <p className="text-xs text-[#8e9bb0]">
                    ระบบประมวลผลการเคลื่อนไหวแบบ Procedural Animation ไม่ใช้แค่ Motion Capture ตายตัว แต่ AI จะปรับท่าทางการเดิน โจมตี และคอมโบตามฟิสิกส์ สภาพแวดล้อม และสรีระจริงแบบเรียลไทม์ 100%
                  </p>
                </div>
                <button
                  onClick={() => addLog("🥋 Initialized Procedural Inverse Kinematics (IK) matrix for all skeleton rigs...")}
                  className="px-4 py-2 bg-gradient-to-r from-[#ff3366] to-rose-600 hover:from-rose-500 hover:to-[#ff3366] text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(255,51,102,0.3)] transition-all"
                >
                  <Footprints size={14} /> Sync Skeletal Mesh
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                {/* 1. DYNAMIC POSTURE & LOCOMOTION */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Footprints className="text-emerald-400" size={16} /> Dynamic Locomotion & Posture
                    </h3>
                    <div className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/30 animate-pulse">
                      FULL-BODY IK
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    ระบบ Inverse Kinematics (IK) เต็มรูปแบบ ท่าเดิน วิ่ง นั่ง หรือนอน จะแปรผันตาม <span className="text-white font-bold">ภูมิประเทศ (Terrain), ความชัน, โคลน/น้ำแข็ง, อาการบาดเจ็บ, ชุดเกราะ, และน้ำหนักอาวุธ</span> หากใส่เกราะหนักหรือเดินข้ามโคลน การยกเท้าและจุดศูนย์ถ่วง (Center of Mass) จะเปลี่ยนไปแบบเรียลไทม์
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono flex flex-col gap-2">
                    <div className="flex justify-between text-[#8e9bb0] border-b border-[#2a3441] pb-1">
                      <span>Rig: Main Character</span>
                      <span>State: <span className="text-white">Walking (Steep Incline)</span></span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="bg-[#0e121c] border border-[#1e2636] p-1.5 rounded flex flex-col">
                         <span className="text-[#71829e]">Terrain Blend</span>
                         <span className="text-blue-400">Muddy (Friction -40%)</span>
                      </div>
                      <div className="bg-[#0e121c] border border-[#1e2636] p-1.5 rounded flex flex-col">
                         <span className="text-[#71829e]">Equipped Weight</span>
                         <span className="text-amber-400">Plate Armor (45kg)</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[#71829e] w-20">Spine Pitch</span>
                      <div className="flex-1 h-1.5 bg-[#1e2636] rounded-full overflow-hidden flex relative">
                        <div className="w-[60%] h-full bg-emerald-400"></div>
                        <div className="absolute right-[40%] top-0 h-full w-0.5 bg-white shadow-[0_0_5px_white]"></div>
                      </div>
                      <span className="text-white w-10 text-right">+22°</span>
                    </div>
                    
                    <div className="text-emerald-400 italic mt-1 border-t border-[#2a3441] pt-1 text-[9px]">
                      &gt; Leaning forward to compensate for weight + slope. Mud dragging ankles.
                    </div>
                  </div>
                </div>

                {/* 2. PROCEDURAL COMBAT & WEAPON HANDLING */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Crosshair className="text-rose-500" size={16} /> Procedural Weapon Handling & Reload
                    </h3>
                    <div className="text-[9px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded font-mono border border-rose-500/30">
                      BALLISTIC IK
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    แอนิเมชั่นอาวุธทุกชนิดไม่มีการใช้ท่าซ้ำตายตัว (No Canned Animations) ท่า <span className="text-white font-bold">การจับปืน รีโหลดกระสุน ชักดาบ หรือง้างธนู</span> จะถูกสร้างขึ้นสดๆ อิงจากขนาดของปืน ความยาวแขนตัวละคร ความเหนื่อยล้า และตำแหน่งของเป้าหมาย แม้แต่การหยิบแม็กกาซีนก็คำนวณตำแหน่งจากกระเป๋าจริงๆ บนตัว
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono flex flex-col gap-2">
                    <div className="flex justify-between text-[#8e9bb0] border-b border-[#2a3441] pb-1">
                      <span>Action: <span className="text-white">Tactical Reload (AR-15)</span></span>
                      <span className="text-rose-500 animate-pulse">UNDER FIRE</span>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 mt-1">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                        <span className="text-[#71829e] w-24">Left Hand IK:</span>
                        <span className="text-blue-400 bg-blue-900/20 px-2 py-0.5 rounded flex-1">Reaching Chest Rig Mag Pouch</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                        <span className="text-[#71829e] w-24">Head Tracking:</span>
                        <span className="text-amber-400 bg-amber-900/20 px-2 py-0.5 rounded flex-1">Locked on hostile (Suppressed)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                        <span className="text-[#71829e] w-24">Stress Modifier:</span>
                        <span className="text-rose-400 bg-rose-900/20 px-2 py-0.5 rounded flex-1">Hand Tremor +15%, Speed +10%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. FLUID COMBO & TRANSITIONS */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Swords className="text-amber-400" size={16} /> Seamless Strike & Skill Combos
                    </h3>
                    <div className="text-[9px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono border border-amber-500/30">
                      MOTION MATCHING
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    ใช้เทคโนโลยี <span className="text-white font-bold">Motion Matching</span> ผสมกับ AI Interpolation เพื่อเชื่อมต่อการโจมตี (Attacks), การกลิ้งหลบ (Dodge), และสกิลเวทมนตร์ต่างๆ ให้ต่อเนื่องเป็นสายน้ำลื่นไหล (Fluidity) ไม่มีอาการชะงัก (Stiff/Jitter) กลไกฟิสิกส์การเหวี่ยงดาบจะลากโมเมนตัมไปสู่ท่าโจมตีต่อไปโดยอัตโนมัติ
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono flex flex-col gap-2 relative overflow-hidden">
                     <div className="flex items-center justify-between mb-1 relative z-10">
                        <span className="text-[#71829e]">Combo Chain:</span>
                        <span className="text-amber-400 font-bold">3 HITS</span>
                     </div>
                     
                     <div className="flex items-center gap-1 w-full relative z-10">
                        <div className="flex-1 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-center py-1 rounded">Slash (R)</div>
                        <span className="text-[#71829e]">→</span>
                        <div className="flex-1 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-center py-1 rounded">Spin (L)</div>
                        <span className="text-[#71829e]">→</span>
                        <div className="flex-1 bg-purple-500/20 border border-purple-500/40 text-purple-400 text-center py-1 rounded shadow-[0_0_10px_rgba(168,85,247,0.3)]">Cast (Nova)</div>
                     </div>
                     
                     <div className="mt-2 border-t border-[#2a3441] pt-2 flex justify-between text-[9px] z-10">
                       <span className="text-[#71829e]">Momentum Conservation:</span>
                       <span className="text-emerald-400">100% (Perfect Blend)</span>
                     </div>
                  </div>
                </div>

                {/* 4. REACTIVE HIT & DAMAGE KINEMATICS */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Shield className="text-[#00ffff]" size={16} /> Reactive Physics Hit & Defense
                    </h3>
                    <div className="text-[9px] bg-[#00ffff]/10 text-[#00ffff] px-2 py-0.5 rounded font-mono border border-[#00ffff]/30">
                      ACTIVE RAGDOLL
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    ยกเลิก Hit Animation แบบเก่า ใช้ <span className="text-white font-bold">Active Ragdoll + Muscle Simulation</span> เมื่อ NPC หรือผู้เล่นถูกโจมตี ท่าทางการกระเด็นหรือทรุดตัวจะคำนวณจาก ทิศทางของแรง (Force Vector), ชิ้นส่วนที่โดนโจมตี, และการพยายามฝืนทรงตัว (Balance Recovery) แบบสมจริง 100%
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono flex flex-col gap-2">
                    <div className="flex justify-between text-[#8e9bb0] border-b border-[#2a3441] pb-1">
                      <span>Event: <span className="text-rose-400">Heavy Blunt Impact</span></span>
                      <span>Target: <span className="text-white">Orc Brute</span></span>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-1">
                      <div className="flex justify-between items-center bg-[#0e121c] p-1.5 rounded border border-[#1e2636]">
                        <span className="text-[#71829e]">Impact Vector</span>
                        <span className="text-[#00ffff]">Right Shoulder (1200 N)</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#0e121c] p-1.5 rounded border border-[#1e2636]">
                        <span className="text-[#71829e]">Muscle Response</span>
                        <span className="text-amber-400">Torso twist left, Right leg step back</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#0e121c] p-1.5 rounded border border-[#1e2636]">
                        <span className="text-[#71829e]">Recovery State</span>
                        <span className="text-emerald-400">Staggered (0.8s), Guard Raised</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. MICRO-MOVEMENTS & IDLE DYNAMICS */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4 md:col-span-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Dumbbell className="text-[#ff3366]" size={16} /> Hyper-Detailed Micro-Movements & True Idle
                    </h3>
                    <div className="text-[10px] bg-[#ff3366]/10 text-[#ff3366] px-2 py-1 border border-[#ff3366]/30 rounded font-mono font-bold animate-pulse">
                      BREATHING MESH SYNC
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0] max-w-4xl">
                    ในโลกนี้จะไม่มีใคร "ยืนนิ่งเป็นรูปปั้น" ระบบจะสร้างการเคลื่อนไหวระดับ Micro เช่น <span className="text-white font-bold">การหายใจที่ซิงค์กับเสียงและค่า Stamina, การกระพริบตาตามสภาพแสงลม, การขยับนิ้ว, การทิ้งน้ำหนักลงขาซ้ายขวาสลับกันเวลาเมื่อย (Weight Shifting)</span> ไปจนถึงการนั่งพิงกำแพง การกินอาหาร ที่สอดคล้องกับรูปทรงปากและชิ้นอาหารจริงๆ (Collision-perfect)
                  </p>
                  
                  <div className="bg-[#090b10] p-4 rounded-xl border border-[#1e2636] flex flex-col md:flex-row gap-4 font-mono text-[10px] relative overflow-hidden mt-2">
                     {/* Data Stream Background */}
                     <div className="absolute inset-0 opacity-10 flex flex-col justify-around">
                       <div className="w-full h-px bg-[#ff3366]"></div>
                       <div className="w-full h-px bg-[#ff3366]"></div>
                       <div className="w-full h-px bg-[#ff3366]"></div>
                     </div>
                     
                     <div className="flex-1 bg-[#141a29] border border-[#222b3d] p-3 rounded-lg z-10 shadow-lg relative">
                        <div className="absolute -top-2 -right-2 bg-rose-500 text-white px-1.5 py-0.5 rounded text-[8px] font-bold">FATIGUED</div>
                        <div className="text-[#ff3366] font-bold mb-2 border-b border-[#2a3441] pb-1">Chest Expansion Mesh</div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#71829e] w-12">Depth:</span>
                          <div className="flex-1 flex gap-0.5 h-4 items-end">
                            {[10,20,40,70,100,70,40,20,10,20,40,70,100,70,40].map((v, i) => (
                              <div key={i} style={{height: `${v}%`}} className="flex-1 bg-[#ff3366] opacity-80"></div>
                            ))}
                          </div>
                          <span className="text-white w-12 text-right">Heavy</span>
                        </div>
                     </div>
                     
                     <div className="flex-1 bg-[#141a29] border border-[#222b3d] p-3 rounded-lg z-10 shadow-lg">
                        <div className="text-amber-400 font-bold mb-2 border-b border-[#2a3441] pb-1">Subconscious Idle Shifts</div>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between">
                            <span className="text-[#71829e]">Weight Distribution:</span>
                            <span className="text-white">70% L / 30% R</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#71829e]">Finger Twitch (Cold):</span>
                            <span className="text-cyan-400">Active (Index L)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#71829e]">Eye Gaze:</span>
                            <span className="text-emerald-400">Tracking Player</span>
                          </div>
                        </div>
                     </div>
                     
                     <div className="flex-1 bg-[#141a29] border border-[#222b3d] p-3 rounded-lg z-10 shadow-lg relative">
                        <div className="text-[#00ffff] font-bold mb-2 border-b border-[#2a3441] pb-1">Equip Interactions</div>
                        <div className="flex flex-col gap-1 text-[9px]">
                          <div className="bg-[#0e121c] p-1 rounded text-[#8e9bb0]">
                            &gt; Adjusting backpack strap (Friction slide)
                          </div>
                          <div className="bg-[#0e121c] p-1 rounded text-[#8e9bb0]">
                            &gt; Sword scabbard collision (Thigh bounce sync)
                          </div>
                          <div className="bg-[#0e121c] p-1 rounded text-[#8e9bb0]">
                            &gt; Cloak wind simulation (Fabric stiffness 12%)
                          </div>
                        </div>
                     </div>
                  </div>
                </div>

                {/* 6. MUSCLE & FAT SIMULATION */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <PersonStanding className="text-[#e0ff00]" size={16} /> True Anatomy & Muscle Simulation
                    </h3>
                    <div className="text-[9px] bg-[#e0ff00]/10 text-[#e0ff00] px-2 py-0.5 rounded font-mono border border-[#e0ff00]/30">
                      TISSUE DYNAMICS
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    ไม่ใช่แค่โครงกระดูกที่ขยับ แต่จำลองไปถึง <span className="text-white font-bold">กล้ามเนื้อและชั้นไขมัน (Soft-Tissue Physics)</span> เมื่อตัวละครเหวี่ยงดาบหนัก กล้ามเนื้อแขนจะปูดเกร็ง (Muscle Contraction) หรือเมื่อตัวละครที่มีน้ำหนักตัวมากกระโดดลงพื้น จะเกิดแรงกระเพื่อมตามหลักสรีระศาสตร์ (Jiggle Physics) อย่างสมจริงไร้ที่ติ
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono flex flex-col gap-2">
                    <div className="flex justify-between text-[#8e9bb0] border-b border-[#2a3441] pb-1">
                      <span>Node: <span className="text-white">Bicep_Brachii_R</span></span>
                      <span className="text-[#e0ff00]">Flex State: ACTIVE</span>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[#71829e] w-20">Tension Level</span>
                      <div className="flex-1 h-1.5 bg-[#1e2636] rounded-full overflow-hidden flex relative">
                        <div className="w-[85%] h-full bg-[#e0ff00]"></div>
                      </div>
                      <span className="text-white w-10 text-right">85%</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-[#71829e] w-20">Vascularity</span>
                      <span className="text-rose-400 bg-rose-900/20 px-2 py-0.5 rounded flex-1">Vein pop visible (Stress &gt; 80)</span>
                    </div>
                  </div>
                </div>

                {/* 7. DYNAMIC TRAVERSAL & PARKOUR */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Footprints className="text-purple-400" size={16} /> Unbound Traversal & Parkour IK
                    </h3>
                    <div className="text-[9px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-mono border border-purple-500/30">
                      NODE-FREE CLIMBING
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    การปีนป่ายและกระโดดข้ามสิ่งกีดขวางไม่ต้องพึ่งพาจุดเกาะ (Fixed Nodes) ที่นักพัฒนาสร้างไว้ล่วงหน้า ระบบ <span className="text-white font-bold">Node-Free Climbing</span> จะคำนวณพื้นผิว ความกว้าง และองศาแบบเรียลไทม์ ตัวละครสามารถเอามือยันกำแพง กระโดดข้ามโต๊ะ หรือปีนต้นไม้ได้ทุกต้นในโลกอย่างลื่นไหล
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono flex flex-col gap-2">
                    <div className="flex justify-between text-[#8e9bb0] border-b border-[#2a3441] pb-1">
                      <span>Action: <span className="text-white">Vault (Medium Obstacle)</span></span>
                      <span className="text-purple-400">Raycast: SUCCESS</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="bg-[#0e121c] border border-[#1e2636] p-1.5 rounded flex flex-col">
                         <span className="text-[#71829e]">Hand Placement</span>
                         <span className="text-emerald-400">Procedural Grip (Edge)</span>
                      </div>
                      <div className="bg-[#0e121c] border border-[#1e2636] p-1.5 rounded flex flex-col">
                         <span className="text-[#71829e]">Clearance</span>
                         <span className="text-blue-400">1.2m (Legs Tucked)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 8. CLOTH & FLUID INTERACTION */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Swords className="text-cyan-400" size={16} /> Hyper-Responsive Material Physics
                    </h3>
                    <div className="text-[9px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-mono border border-cyan-500/30">
                      CLOTH & FLUID DRAG
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    การเคลื่อนไหวได้รับผลกระทบจากฟิสิกส์เส้นใยและของเหลว <span className="text-white font-bold">ถ้าผ้าคลุมเปียกน้ำ จะมีน้ำหนักเพิ่มและแกว่งน้อยลง</span> หากเดินลุยโคลนลึกถึงเข่า แอนิเมชั่นการยกขาจะหนืดขึ้นและต้องใช้ Stamina มากขึ้น เสื้อผ้าทุกชิ้นมี Collision กับตัวละครและสิ่งแวดล้อมไม่ทะลุกัน
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono flex flex-col gap-2">
                    <div className="flex justify-between text-[#8e9bb0] border-b border-[#2a3441] pb-1">
                      <span>Mesh: <span className="text-white">Woolen Cloak</span></span>
                      <span className="text-cyan-400">State: DRENCHED</span>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 mt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[#71829e] w-20">Weight Mod:</span>
                        <span className="text-rose-400 bg-rose-900/20 px-2 py-0.5 rounded flex-1 text-center">+3.5kg (Water Retention)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#71829e] w-20">Wind Drag:</span>
                        <span className="text-blue-400 bg-blue-900/20 px-2 py-0.5 rounded flex-1 text-center">Reduced by 70%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 9. EXPRESSIVE COMBAT FACIAL RIG */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Crosshair className="text-amber-500" size={16} /> Extreme Combat Facial Expressions
                    </h3>
                    <div className="text-[9px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-mono border border-amber-500/30">
                      GRIT & STRAIN
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    ลาก่อนหน้าตาไร้อารมณ์ตอนสู้ ระบบซิงค์ <span className="text-white font-bold">Facial Rig กับจังหวะออกแรง (Exertion)</span> เมื่อรับการโจมตีหนัก ตัวละครจะกัดฟันหลับตาปี๋ (Flincing) หรือเมื่อง้างธนูจนสุดสาย กล้ามเนื้อหน้าจะเกร็ง ตาหรี่โฟกัสเป้าหมาย และอ้าปากหอบหายใจตามระดับความเหนื่อยแบบ 1:1
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono flex flex-col gap-2">
                    <div className="flex justify-between text-[#8e9bb0] border-b border-[#2a3441] pb-1">
                      <span>Action: <span className="text-white">Heavy Strike (Parried)</span></span>
                      <span className="text-amber-500 animate-pulse">SHOCK</span>
                    </div>
                    
                    <div className="flex flex-col gap-1 mt-1">
                       <div className="flex justify-between items-center text-[9px]">
                         <span className="text-[#71829e]">Jaw Tension:</span>
                         <span className="text-amber-400">Clenched (Max)</span>
                       </div>
                       <div className="flex justify-between items-center text-[9px]">
                         <span className="text-[#71829e]">Eye Pupils:</span>
                         <span className="text-emerald-400">Micro-dilation (Surprise)</span>
                       </div>
                       <div className="flex justify-between items-center text-[9px]">
                         <span className="text-[#71829e]">Forehead:</span>
                         <span className="text-rose-400">Deep furrows (Effort)</span>
                       </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === "hyper_reality" && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Map className="text-[#00ff99]" size={20} />
                    Hyper-Voxel World Builder (Mega-Scale Topology)
                  </h2>
                  <p className="text-xs text-[#8e9bb0]">
                    ระบบออกแบบและเจนเนอเรทโลกทั้งใบ ไม่ใช่แค่เอาโมเดลมาวาง แต่เป็นการปรับระดับ Vertex, Voxel, ชั้นดินแบบธรณีวิทยา (Geology), ภูมิอากาศ (Macro-weather) แบบสมจริงถึงขีดสุด
                  </p>
                </div>
                <button
                  onClick={() => addLog("🗺️ Initiating Voxel-Deep Terraforming. Generating tectonic boundaries...")}
                  className="px-4 py-2 bg-gradient-to-r from-[#00ff99] to-emerald-600 hover:from-emerald-500 hover:to-[#00ff99] text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,153,0.3)] transition-all"
                >
                  <Cuboid size={14} /> Terraform Planet
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                {/* 1. TECTONIC & GEOLOGY */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="text-amber-500" size={16} /> Sub-Surface Geology & Tectonics
                    </h3>
                    <div className="text-[9px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-mono border border-amber-500/30">
                      CRUST DYNAMICS
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    ไม่ใช่แค่พื้นผิว ภูเขาและหุบเขาเกิดจากการจำลอง <span className="text-white font-bold">การชนกันของเปลือกโลก (Tectonic Plates)</span> ดินแต่ละชั้น (Topsoil, Bedrock, Ore Veins) มีความหนาแน่นต่างกัน ถ้าระเบิดพื้น คุณจะเห็นชั้นหินแกรนิตหรือแร่ที่ซ่อนอยู่ตามหลักธรณีวิทยา
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono flex flex-col gap-2">
                     <div className="flex justify-between border-b border-[#2a3441] pb-1">
                        <span className="text-[#8e9bb0]">Plate: <span className="text-white">Eurasian vs Oceanic</span></span>
                        <span className="text-amber-400">Subduction Zone</span>
                     </div>
                     <div className="flex flex-col gap-1 mt-1">
                        <div className="flex justify-between items-center bg-[#0e121c] p-1.5 rounded border border-[#1e2636]">
                           <span className="text-[#71829e]">Elevation Gen</span>
                           <span className="text-white">Volcanic Mountain Range (+4500m)</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#0e121c] p-1.5 rounded border border-[#1e2636]">
                           <span className="text-[#71829e]">Strata Layers</span>
                           <span className="text-amber-400">Basalt &rarr; Obsidian &rarr; Gold Veins</span>
                        </div>
                     </div>
                  </div>
                </div>

                {/* 2. DYNAMIC EROSION & FLUIDS */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Mountain className="text-blue-400" size={16} /> Millennium Erosion & Fluid Sim
                    </h3>
                    <div className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-mono border border-blue-500/30">
                      HYDROLOGY
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    น้ำไหลจากที่สูงลงที่ต่ำเสมอ ระบบ <span className="text-white font-bold">Fluid Dynamics</span> กัดเซาะภูเขา (Thermal & Hydraulic Erosion) นานนับพันปีจำลอง ทำให้เกิดร่องน้ำ โตรกผา และแม่น้ำที่ไหลอย่างสมจริง หากคุณสร้างเขื่อนกั้นน้ำ แม่น้ำสายล่างจะแห้งขอด และเกิดทะเลสาบแห่งใหม่ด้านบน
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono flex flex-col gap-2">
                     <div className="flex justify-between border-b border-[#2a3441] pb-1">
                        <span className="text-[#8e9bb0]">Simulation: <span className="text-white">Rainfall (1,000 Years)</span></span>
                     </div>
                     <div className="flex flex-col gap-1.5 mt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[#71829e] w-20">Water Flow:</span>
                          <div className="flex-1 h-1.5 bg-[#1e2636] rounded-full overflow-hidden flex">
                            <div className="w-[60%] h-full bg-blue-400 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-[9px]">
                           <span className="text-blue-300">Carving Canyons (Depth: 250m)</span>
                           <span className="text-emerald-400">Delta Formed at Sea Level</span>
                        </div>
                     </div>
                  </div>
                </div>

                {/* 3. FLORA & FAUNA ECOSYSTEM */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Brush className="text-emerald-400" size={16} /> Procedural Flora & Ecosystems
                    </h3>
                    <div className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/30">
                      BIOME SPREAD
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    ป่าไม้ไม่ได้ถูกแรนด้อมวาง แต่เกิดจาก <span className="text-white font-bold">อัลกอริทึมการกระจายเมล็ดพันธุ์ (Seed Dispersal)</span> แสงแดด, ความชื้น, และระดับความสูง หากพื้นที่มีความชื้นสูงและแดดส่องไม่ถึง พื้นจะเต็มไปด้วยตะไคร่น้ำและเห็ดเรืองแสง ระบบนิเวศจะรักษาความสมดุลเอง
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono flex flex-col gap-2">
                     <div className="grid grid-cols-2 gap-2">
                       <div className="bg-[#0e121c] p-1.5 rounded border border-[#1e2636] flex flex-col">
                          <span className="text-[#71829e] border-b border-[#2a3441] pb-0.5 mb-0.5">Sunlight</span>
                          <span className="text-amber-400 font-bold">Dense Canopy (15%)</span>
                       </div>
                       <div className="bg-[#0e121c] p-1.5 rounded border border-[#1e2636] flex flex-col">
                          <span className="text-[#71829e] border-b border-[#2a3441] pb-0.5 mb-0.5">Humidity</span>
                          <span className="text-blue-400 font-bold">River Proximity (90%)</span>
                       </div>
                     </div>
                     <div className="text-emerald-400 mt-1 italic border-t border-[#2a3441] pt-1">
                        &gt; Spawning: Luminous Ferns, Mossy Logs, Rotting Wood Fungi
                     </div>
                  </div>
                </div>

                {/* 4. METEOROLOGICAL ENGINE */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Globe className="text-[#00ffff]" size={16} /> Volumetric Meteorological Engine
                    </h3>
                    <div className="text-[9px] bg-[#00ffff]/10 text-[#00ffff] px-2 py-0.5 rounded font-mono border border-[#00ffff]/30">
                      WEATHER SIM
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    ระบบอากาศแบบ 3D Volumetric มวลอากาศร้อนและเย็นปะทะกันเหนือภูเขาทำให้เกิด <span className="text-white font-bold">พายุฝนฟ้าคะนองแบบอิงหลักฟิสิกส์ (Orographic Lift)</span> ลมจะพัดต้นไม้ ลากฝุ่น และสร้างพายุทอร์นาโดหมุนวนตามแนวความกดอากาศ ไม่ใช่แค่สคริปต์ฝนตกธรรมดา
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono flex flex-col gap-2">
                    <div className="flex justify-between text-[#8e9bb0] border-b border-[#2a3441] pb-1">
                      <span>Atmosphere: <span className="text-white">Cumulonimbus Cell</span></span>
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                       <div className="flex justify-between">
                         <span className="text-[#71829e]">Pressure Front:</span>
                         <span className="text-[#00ffff]">Colliding (1004 hPa)</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-[#71829e]">Wind Vector:</span>
                         <span className="text-white">NW @ 45km/h (Turbulent)</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-[#71829e]">Event Trigger:</span>
                         <span className="text-rose-400 font-bold">Lightning Strikes (High Alt)</span>
                       </div>
                    </div>
                  </div>
                </div>
                
                {/* 5. CULTURAL ARCHITECTURE AUTO-GEN */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4 md:col-span-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Hammer className="text-[#ff00ff]" size={16} /> Procedural Cultural Architecture
                    </h3>
                    <div className="text-[10px] bg-[#ff00ff]/10 text-[#ff00ff] px-2 py-1 border border-[#ff00ff]/30 rounded font-mono font-bold animate-pulse">
                      CITY BUILDER AI
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0] max-w-4xl">
                    การวางผังเมืองและสิ่งปลูกสร้าง (Settlements) สร้างขึ้นจาก <span className="text-white font-bold">ระบบประวัติศาสตร์จำลอง (Cultural AI)</span> เมืองท่าจะสร้างติดแม่น้ำ มีตลาดและโกดัง เมืองหนาวเหน็บจะสร้างบ้านหลังคาลาดเอียงป้องกันหิมะถล่ม โครงสร้างสถาปัตยกรรม (Architecture Style) จะวิวัฒนาการตามวัสดุที่หาได้ในภูมิภาคนั้นๆ อย่างสมเหตุสมผล 100%
                  </p>
                  
                  <div className="bg-[#090b10] p-4 rounded-xl border border-[#1e2636] flex flex-col md:flex-row gap-4 font-mono text-[10px] relative mt-2">
                     <div className="flex-1 bg-[#141a29] border border-[#222b3d] p-3 rounded-lg z-10">
                        <div className="text-[#ff00ff] font-bold mb-2 border-b border-[#2a3441] pb-1">Region: Frost Peak Valley</div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[#71829e]">Available Materials:</span>
                          <span className="text-white">Pine Wood, Granite, Bear Pelts</span>
                        </div>
                     </div>
                     <div className="flex flex-col justify-center text-center items-center">
                        <span className="text-[#71829e] hidden md:block">&rarr;</span>
                        <span className="text-[8px] text-[#ff00ff]">Synthesizing Style</span>
                     </div>
                     <div className="flex-1 bg-[#141a29] border border-[#222b3d] p-3 rounded-lg z-10 shadow-[0_0_15px_rgba(255,0,255,0.1)]">
                        <div className="text-white font-bold mb-2 border-b border-[#2a3441] pb-1">Generated Blueprint: "Nordic Fortress"</div>
                        <div className="flex flex-col gap-1 text-[9px]">
                          <span className="text-emerald-400">✓ Steep pitched roofs (Snow shed)</span>
                          <span className="text-emerald-400">✓ Thick granite foundations (Wind resist)</span>
                          <span className="text-emerald-400">✓ Central Hearth layout (Heat retention)</span>
                        </div>
                     </div>
                  </div>
                </div>

                {/* 6. SUBTERRANEAN CAVE SYSTEMS & MINING */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Pickaxe className="text-stone-400" size={16} /> Subterranean Cave Systems & Ores
                    </h3>
                    <div className="text-[9px] bg-stone-500/10 text-stone-400 px-2 py-0.5 rounded font-mono border border-stone-500/30">
                      VOXEL CAVERNS
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    เครือข่ายถ้ำใต้ดินถูกสร้างด้วย <span className="text-white font-bold">3D Noise Algorithms (Perlin/Simplex)</span> ทำให้เกิดโถงถ้ำขนาดใหญ่ (Mega-caverns), ทางน้ำใต้ดิน, และหินงอกหินย้อย แร่ธาตุ (Ore Veins) จะกระจุกตัวตามความร้อนใต้พิภพ (Geothermal Heatmaps) สมบูรณ์แบบสำหรับการทำเหมืองขุดเจาะทุกทิศทาง
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono flex flex-col gap-2">
                    <div className="flex justify-between text-[#8e9bb0] border-b border-[#2a3441] pb-1">
                      <span>Depth: <span className="text-white">-450m (Mantle Edge)</span></span>
                      <span className="text-stone-400">Status: GENERATED</span>
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                        <span className="text-[#71829e] w-24">Geothermal:</span>
                        <span className="text-orange-400 bg-orange-900/20 px-2 py-0.5 rounded flex-1">Magma Chamber Detected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                        <span className="text-[#71829e] w-24">Minerals:</span>
                        <span className="text-cyan-400 bg-cyan-900/20 px-2 py-0.5 rounded flex-1">Mithril Vein (High Density)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7. DYNAMIC RIVER NETWORKS */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Droplets className="text-blue-500" size={16} /> Procedural River Networks & Hydrodynamics
                    </h3>
                    <div className="text-[9px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded font-mono border border-blue-500/30">
                      WATER PATHING
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    แม่น้ำไม่ได้ถูกลากเส้นเอง แต่เกิดจากการหยดน้ำฝนจำลองบนยอดเขา (Raindrop Algorithm) แสวงหาจุดต่ำสุดเพื่อรวมกันเป็นลำธาร น้ำตก และแม่น้ำใหญ่ <span className="text-white font-bold">กระแสน้ำมีทิศทางและความเร็วตามความชัน</span> ส่งผลต่อการว่ายน้ำ การเดินเรือ และการสร้างกังหันน้ำ
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono flex flex-col gap-2">
                    <div className="flex justify-between text-[#8e9bb0] border-b border-[#2a3441] pb-1">
                      <span>Node: <span className="text-white">River Bifurcation</span></span>
                      <span className="text-blue-400">Flow: ACTIVE</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="bg-[#0e121c] border border-[#1e2636] p-1.5 rounded flex flex-col">
                         <span className="text-[#71829e]">Current Velocity</span>
                         <span className="text-blue-400">12.5 m/s (Rapids)</span>
                      </div>
                      <div className="bg-[#0e121c] border border-[#1e2636] p-1.5 rounded flex flex-col">
                         <span className="text-[#71829e]">Erosion Rate</span>
                         <span className="text-amber-400">0.05m / Year</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 8. MICRO-ECOSYSTEMS & DYNAMIC FOLIAGE */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sprout className="text-green-400" size={16} /> Micro-Ecosystems & Dynamic Foliage
                    </h3>
                    <div className="text-[9px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-mono border border-green-500/30">
                      GRASS BLADES
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0]">
                    หญ้าทุกต้น ใบไม้ทุกใบ ไม่ใช่แค่ Texture แบนๆ แต่ตอบสนองต่อสิ่งแวดล้อม <span className="text-white font-bold">การเหยียบย่ำจะทำให้หญ้าลู่ลง (Foliage Deformation)</span> เมื่อฝนตกน้ำจะเกาะบนใบไม้ สัตว์กินพืชจะเล็มหญ้าทำให้พื้นที่โล่งเตียน ระบบจำลองถึงขั้นการแข่งขันของวัชพืชแสงอาทิตย์
                  </p>
                  
                  <div className="mt-auto bg-[#141a29] rounded-xl border border-[#222b3d] p-3 text-[10px] font-mono flex flex-col gap-2">
                    <div className="flex justify-between text-[#8e9bb0] border-b border-[#2a3441] pb-1">
                      <span>Area: <span className="text-white">Meadow Patch (4x4m)</span></span>
                      <span className="text-green-400">State: TRAMPLED</span>
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                       <div className="flex justify-between items-center bg-[#0e121c] p-1.5 rounded border border-[#1e2636]">
                         <span className="text-[#71829e]">Grass Bending Angle</span>
                         <span className="text-amber-400">85° (Heavy Footprints)</span>
                       </div>
                       <div className="flex justify-between items-center bg-[#0e121c] p-1.5 rounded border border-[#1e2636]">
                         <span className="text-[#71829e]">Recovery Time</span>
                         <span className="text-emerald-400">~2 In-game Days</span>
                       </div>
                    </div>
                  </div>
                </div>

                {/* 9. GLOBAL WIND PATTERNS & AERODYNAMICS (100% CUSTOMIZABLE) */}
                <div className="bg-[#0e121c] p-5 rounded-2xl border border-[#1e2636] flex flex-col gap-4 md:col-span-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Wind className="text-slate-400" size={16} /> Advanced Global Aerodynamics & Wind Engine
                    </h3>
                    <div className="text-[9px] bg-slate-500/10 text-slate-400 px-2 py-0.5 rounded font-mono border border-slate-500/30">
                      CUSTOM WIND VECTOR & PHYSICS SIM
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8e9bb0] max-w-4xl">
                    ระบบกระแสลมและอากาศพลศาสตร์แบบ 100% Customizable ควบคุมมวลอากาศ ทิศทางลม แรงต้าน และความแปรปรวน (Turbulence) ได้อย่างอิสระ <span className="text-white font-bold">ส่งผลต่อวิถีกระสุนปืน (Ballistic drop), การแพร่กระจายของไฟป่า (Fire Propagation), การกระพือของเสื้อผ้า (Cloth Sim), และกัดกร่อนพื้นที่แบบ Aeolian Erosion</span>
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    {/* Control Panel 1: Core Physics */}
                    <div className="bg-[#141a29] border border-[#222b3d] p-3 rounded-xl flex flex-col gap-3 font-mono text-[10px]">
                      <div className="text-slate-300 font-bold border-b border-[#2a3441] pb-1">Atmospheric Core Vectors</div>
                      
                      <div className="flex flex-col gap-1">
                         <div className="flex justify-between text-[#8e9bb0]">
                           <span>Base Velocity (m/s)</span>
                           <span className="text-[#00ffff]">24.5 m/s</span>
                         </div>
                         <div className="w-full h-1.5 bg-[#0e121c] rounded-full overflow-hidden">
                           <div className="w-[65%] h-full bg-[#00ffff]"></div>
                         </div>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                         <div className="flex justify-between text-[#8e9bb0]">
                           <span>Air Density (kg/m³)</span>
                           <span className="text-emerald-400">1.225 (Sea Level)</span>
                         </div>
                         <div className="w-full h-1.5 bg-[#0e121c] rounded-full overflow-hidden">
                           <div className="w-[45%] h-full bg-emerald-400"></div>
                         </div>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                         <div className="flex justify-between text-[#8e9bb0]">
                           <span>Turbulence Frequency</span>
                           <span className="text-rose-400">High (0.8Hz)</span>
                         </div>
                         <div className="w-full h-1.5 bg-[#0e121c] rounded-full overflow-hidden">
                           <div className="w-[80%] h-full bg-rose-400"></div>
                         </div>
                      </div>
                    </div>
                    
                    {/* Control Panel 2: Live Wind Graph Simulation */}
                    <div className="bg-[#141a29] border border-[#222b3d] p-3 rounded-xl flex flex-col justify-center items-center relative overflow-hidden group">
                       <div className="absolute inset-0 bg-[#0e121c] opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/20 via-[#0e121c] to-[#0e121c]"></div>
                       
                       {/* Interactive Compass / Directional control UI */}
                       <div className="w-24 h-24 rounded-full border-2 border-[#2a3441] flex items-center justify-center relative z-10 cursor-crosshair">
                          <div className="absolute top-1 text-[8px] text-[#71829e]">N</div>
                          <div className="absolute bottom-1 text-[8px] text-[#71829e]">S</div>
                          <div className="absolute left-1 text-[8px] text-[#71829e]">W</div>
                          <div className="absolute right-1 text-[8px] text-[#71829e]">E</div>
                          
                          {/* Compass needle */}
                          <div className="w-1 h-14 bg-gradient-to-t from-transparent via-[#00ffff] to-white rounded-full origin-bottom rotate-45 transform transition-transform group-hover:rotate-[60deg] shadow-[0_0_10px_#00ffff]"></div>
                          <div className="w-2 h-2 rounded-full bg-[#00ffff] absolute z-20 shadow-[0_0_8px_#00ffff]"></div>
                       </div>
                       
                       <div className="mt-3 text-center z-10">
                         <div className="text-[#00ffff] font-bold text-[11px] font-mono">Heading: 45° (NE)</div>
                         <div className="text-[#71829e] text-[9px] font-mono">Dynamic Gusts Enabled</div>
                       </div>
                    </div>
                    
                    {/* Control Panel 3: Affected Systems */}
                    <div className="bg-[#141a29] border border-[#222b3d] p-3 rounded-xl flex flex-col gap-2 font-mono text-[10px]">
                      <div className="text-slate-300 font-bold border-b border-[#2a3441] pb-1">Environmental Impact</div>
                      
                      <div className="bg-[#0e121c] border border-[#1e2636] p-1.5 rounded flex items-center justify-between">
                         <span className="text-[#71829e]">Aeolian Erosion</span>
                         <span className="text-amber-400">+1.2m Sand Moved/hr</span>
                      </div>
                      <div className="bg-[#0e121c] border border-[#1e2636] p-1.5 rounded flex items-center justify-between">
                         <span className="text-[#71829e]">Foliage Sway (Trees)</span>
                         <span className="text-emerald-400">Bending 15°</span>
                      </div>
                      <div className="bg-[#0e121c] border border-[#1e2636] p-1.5 rounded flex items-center justify-between">
                         <span className="text-[#71829e]">Ballistic Deflection</span>
                         <span className="text-rose-400">Sniper Shift 0.4m (100m)</span>
                      </div>
                      
                      <button 
                        onClick={() => addLog("🌬️ Applying custom wind physics override. Recalculating all active aerodynamic forces...")}
                        className="mt-auto w-full py-1.5 bg-[#1e2636] hover:bg-[#2a3441] text-white border border-[#2a3441] rounded transition-colors text-center cursor-pointer"
                      >
                         APPLY WIND OVERRIDE
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
          
          <div className="bg-[#06080e] rounded-2xl border border-[#1a2130] p-4 flex flex-col gap-2 font-mono text-xs mt-auto">
            <div className="flex items-center justify-between border-b border-[#1a2130] pb-2 text-[11px] text-[#71829e]">
              <span className="flex items-center gap-2 text-white font-bold">
                <Terminal size={14} className="text-emerald-400" /> KERNEL TELEMETRY & ACCELERATOR EVENT CHANNEL
              </span>
              <span className="text-emerald-400 animate-pulse">● LIVE RUNTIME</span>
            </div>
            <div className="flex flex-col gap-1 max-h-28 overflow-y-auto custom-scrollbar text-[11px] text-[#a0aec0] leading-snug">
              {consoleLogs.map((l, i) => (
                <div key={i} className="hover:text-white transition-colors">
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
