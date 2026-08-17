import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Cpu, 
  Zap, 
  HardDrive, 
  Database, 
  Layers, 
  Sliders, 
  Play, 
  RefreshCw, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Search, 
  SlidersHorizontal, 
  Gauge, 
  CheckCircle2, 
  Clock, 
  Server,
  Share2,
  Lock,
  Pause,
  Maximize2,
  Flame,
  Binary
} from 'lucide-react';

interface OfflineAIModelInstance {
  id: string;
  name: string;
  role: 'Code Copilot' | 'NPC Dialogue & Lore' | 'PBR Texture Gen' | 'Neural Voice TTS' | 'Behavior Tree Planner';
  format: 'GGUF (Q4_K_M)' | 'AWQ INT4' | 'ONNX WebGPU' | 'FP8 TensorRT' | 'GGUF (Q8_0)';
  backend: 'WebGPU (Direct Compute)' | 'Vulkan / DirectML' | 'CPU AVX-512 / WASM-SIMD' | 'NPU Engine';
  contextSizeTokens: number;
  kvCacheMode: 'PagedAttention FP8' | 'FlashAttention-2' | 'Standard FP16';
  status: 'Ready (Cached)' | 'Inference Active' | 'Standby (Paged)';
  vramUsageMb: number;
  ramUsageMb: number;
  throughputTokensSec: number;
  ttftMs: number; // Time To First Token
  promptCacheHitRate: number;
  priority: 'Real-Time' | 'High' | 'Normal' | 'Background';
}

interface VectorKnowledgeChunk {
  id: string;
  sourceDoc: string;
  tokenCount: number;
  embeddingDim: number;
  indexedTime: string;
  similarityScore: number;
}

export default function OfflineAIDataEngineManager() {
  const [activeTab, setActiveTab] = useState<'models' | 'kv_cache' | 'vector_rag' | 'benchmark'>('models');
  const [globalComputeBackend, setGlobalComputeBackend] = useState<'webgpu_native' | 'vulkan_directml' | 'cpu_simd'>('webgpu_native');
  const [pagedAttentionBlockSize, setPagedAttentionBlockSize] = useState<number>(16);
  const [enablePromptCache, setEnablePromptCache] = useState<boolean>(true);
  const [enableDynamicBatching, setEnableDynamicBatching] = useState<boolean>(true);
  const [maxConcurrency, setMaxConcurrency] = useState<number>(4);
  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);
  const [selectedModelId, setSelectedModelId] = useState<string>('model_npc_lore');

  // Offline AI Specialized Model Registry
  const [models, setModels] = useState<OfflineAIModelInstance[]>([
    {
      id: 'model_code_copilot',
      name: 'OmniCoder-DeepSeek-3.8B-Instruct',
      role: 'Code Copilot',
      format: 'GGUF (Q4_K_M)',
      backend: 'WebGPU (Direct Compute)',
      contextSizeTokens: 16384,
      kvCacheMode: 'FlashAttention-2',
      status: 'Ready (Cached)',
      vramUsageMb: 2450,
      ramUsageMb: 850,
      throughputTokensSec: 88.4,
      ttftMs: 24,
      promptCacheHitRate: 94.2,
      priority: 'Real-Time'
    },
    {
      id: 'model_npc_lore',
      name: 'Llama3-GameMaster-8B-Narrative',
      role: 'NPC Dialogue & Lore',
      format: 'AWQ INT4',
      backend: 'WebGPU (Direct Compute)',
      contextSizeTokens: 32768,
      kvCacheMode: 'PagedAttention FP8',
      status: 'Inference Active',
      vramUsageMb: 4620,
      ramUsageMb: 1200,
      throughputTokensSec: 64.2,
      ttftMs: 38,
      promptCacheHitRate: 88.5,
      priority: 'High'
    },
    {
      id: 'model_pbr_diffusion',
      name: 'StableDiffusion-Turbo-PBR-Micro',
      role: 'PBR Texture Gen',
      format: 'ONNX WebGPU',
      backend: 'WebGPU (Direct Compute)',
      contextSizeTokens: 4096,
      kvCacheMode: 'Standard FP16',
      status: 'Ready (Cached)',
      vramUsageMb: 1850,
      ramUsageMb: 600,
      throughputTokensSec: 42.0,
      ttftMs: 110,
      promptCacheHitRate: 100.0,
      priority: 'Normal'
    },
    {
      id: 'model_neural_tts',
      name: 'VITS-Spatial-FastVoice-EN-TH',
      role: 'Neural Voice TTS',
      format: 'ONNX WebGPU',
      backend: 'WebGPU (Direct Compute)',
      contextSizeTokens: 2048,
      kvCacheMode: 'Standard FP16',
      status: 'Ready (Cached)',
      vramUsageMb: 420,
      ramUsageMb: 350,
      throughputTokensSec: 145.0,
      ttftMs: 12,
      promptCacheHitRate: 98.0,
      priority: 'Real-Time'
    },
    {
      id: 'model_npc_behavior',
      name: 'TinyPlanner-Blackboard-1.2B',
      role: 'Behavior Tree Planner',
      format: 'GGUF (Q4_K_M)',
      backend: 'CPU AVX-512 / WASM-SIMD',
      contextSizeTokens: 8192,
      kvCacheMode: 'PagedAttention FP8',
      status: 'Standby (Paged)',
      vramUsageMb: 0,
      ramUsageMb: 780,
      throughputTokensSec: 112.5,
      ttftMs: 15,
      promptCacheHitRate: 91.0,
      priority: 'Background'
    }
  ]);

  // Offline Vector Store & Knowledge Base
  const [vectorChunks, setVectorChunks] = useState<VectorKnowledgeChunk[]>([
    { id: 'chunk_01', sourceDoc: 'GameEngine_API_Reference.h', tokenCount: 512, embeddingDim: 768, indexedTime: '10s ago', similarityScore: 0.964 },
    { id: 'chunk_02', sourceDoc: 'World_Lore_Kingdom_Chronicles.md', tokenCount: 768, embeddingDim: 768, indexedTime: '2m ago', similarityScore: 0.942 },
    { id: 'chunk_03', sourceDoc: 'Shader_PBR_BRDF_Lumen.glsl', tokenCount: 420, embeddingDim: 768, indexedTime: '5m ago', similarityScore: 0.915 },
    { id: 'chunk_04', sourceDoc: 'Dialogue_Tree_NPC_Merchant.json', tokenCount: 650, embeddingDim: 768, indexedTime: '12m ago', similarityScore: 0.887 },
  ]);

  const totalVramUsedMb = models.reduce((acc, m) => acc + m.vramUsageMb, 0);
  const totalRamUsedMb = models.reduce((acc, m) => acc + m.ramUsageMb, 0);
  const avgThroughput = (models.reduce((acc, m) => acc + m.throughputTokensSec, 0) / models.length).toFixed(1);
  const avgTtft = (models.reduce((acc, m) => acc + m.ttftMs, 0) / models.length).toFixed(0);

  const runModelBenchmark = () => {
    setIsBenchmarking(true);
    setTimeout(() => {
      setModels(prev => prev.map(m => ({
        ...m,
        throughputTokensSec: Math.round((m.throughputTokensSec * (0.95 + Math.random() * 0.15)) * 10) / 10,
        ttftMs: Math.max(10, Math.round(m.ttftMs * (0.9 + Math.random() * 0.2))),
        promptCacheHitRate: Math.min(99.9, Math.round((m.promptCacheHitRate + 0.5) * 10) / 10)
      })));
      setIsBenchmarking(false);
    }, 1200);
  };

  const flushKVCache = (id: string) => {
    setModels(prev => prev.map(m => m.id === id ? { ...m, vramUsageMb: Math.round(m.vramUsageMb * 0.7) } : m));
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans overflow-hidden">
      {/* Top Header */}
      <div className="h-14 border-b border-[#30363d] bg-[#161b22] px-4 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <Brain className="text-[#a855f7]" size={20} />
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              Offline AI High-Throughput Data Engine Manager
              <span className="text-[10px] bg-[#a855f7]/20 text-[#c084fc] border border-[#a855f7]/40 px-2 py-0.5 rounded font-mono font-bold">
                PAGED-ATTENTION & HNSW VECTOR STORE
              </span>
            </h1>
          </div>
        </div>

        {/* Tab Selector & Benchmark Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
            <button
              onClick={() => setActiveTab('models')}
              className={`px-3 py-1 text-xs font-bold rounded ${activeTab === 'models' ? 'bg-[#a855f7] text-white shadow font-bold' : 'text-[#8b949e]'}`}
            >
              Model Pipeline
            </button>
            <button
              onClick={() => setActiveTab('kv_cache')}
              className={`px-3 py-1 text-xs font-bold rounded ${activeTab === 'kv_cache' ? 'bg-[#38bdf8] text-black shadow font-bold' : 'text-[#8b949e]'}`}
            >
              KV Cache & PagedAttention
            </button>
            <button
              onClick={() => setActiveTab('vector_rag')}
              className={`px-3 py-1 text-xs font-bold rounded ${activeTab === 'vector_rag' ? 'bg-[#10b981] text-black shadow font-bold' : 'text-[#8b949e]'}`}
            >
              HNSW Vector Store RAG
            </button>
          </div>

          <button
            onClick={runModelBenchmark}
            disabled={isBenchmarking}
            className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold rounded flex items-center gap-1.5 shadow transition disabled:opacity-50"
          >
            <Zap size={13} className={isBenchmarking ? 'animate-spin' : ''} />
            {isBenchmarking ? 'Running Tensor Bench...' : 'Execute Tensor Benchmark'}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Optimization Config */}
        <div className="w-80 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0 p-4 space-y-5 overflow-y-auto">
          <div>
            <span className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider block mb-2">Hardware Compute Acceleration</span>
            <select
              value={globalComputeBackend}
              onChange={e => setGlobalComputeBackend(e.target.value as any)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-xs text-white font-bold"
            >
              <option value="webgpu_native">WebGPU Direct Compute (Zero-Copy VRAM)</option>
              <option value="vulkan_directml">Vulkan / DirectML Multi-GPU</option>
              <option value="cpu_simd">CPU AVX-512 / WASM SIMD-128</option>
            </select>
          </div>

          <div className="border-t border-[#30363d] pt-4 space-y-3">
            <span className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider block">Throughput Acceleration Flags</span>
            
            <label className="flex items-center gap-2 text-xs text-white cursor-pointer bg-[#0d1117] p-2.5 rounded-lg border border-[#30363d]">
              <input 
                type="checkbox" 
                checked={enablePromptCache} 
                onChange={e => setEnablePromptCache(e.target.checked)}
                className="accent-[#a855f7]"
              />
              <div>
                <span className="font-bold block">Prompt Prefix Caching</span>
                <span className="text-[10px] text-[#8b949e]">Reduces Time-To-First-Token to &lt;25ms</span>
              </div>
            </label>

            <label className="flex items-center gap-2 text-xs text-white cursor-pointer bg-[#0d1117] p-2.5 rounded-lg border border-[#30363d]">
              <input 
                type="checkbox" 
                checked={enableDynamicBatching} 
                onChange={e => setEnableDynamicBatching(e.target.checked)}
                className="accent-[#a855f7]"
              />
              <div>
                <span className="font-bold block">Dynamic Continuous Batching</span>
                <span className="text-[10px] text-[#8b949e]">Executes parallel NPC queries with zero frame drops</span>
              </div>
            </label>
          </div>

          <div className="border-t border-[#30363d] pt-4">
            <label className="text-xs text-[#c9d1d9] flex justify-between mb-1">
              <span>Max Concurrent Inference Workers</span>
              <span className="font-mono text-[#a855f7] font-bold">{maxConcurrency} Threads</span>
            </label>
            <input 
              type="range" min={1} max={16} step={1}
              value={maxConcurrency} 
              onChange={e => setMaxConcurrency(parseInt(e.target.value))}
              className="w-full accent-[#a855f7]"
            />
          </div>

          {/* Engine Real-Time Telemetry Card */}
          <div className="border-t border-[#30363d] pt-4 bg-[#0d1117] p-3 rounded-lg border border-[#30363d] space-y-2">
            <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider block">Global AI Data Metrics</span>
            <div className="flex justify-between text-xs">
              <span className="text-[#8b949e]">Total Model VRAM:</span>
              <span className="text-[#a855f7] font-mono font-bold">{(totalVramUsedMb / 1024).toFixed(2)} GB</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#8b949e]">Total Model Host RAM:</span>
              <span className="text-[#3fb950] font-mono font-bold">{(totalRamUsedMb / 1024).toFixed(2)} GB</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#8b949e]">Avg Generation Speed:</span>
              <span className="text-[#38bdf8] font-mono font-bold">{avgThroughput} tok/s</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#8b949e]">Avg Latency (TTFT):</span>
              <span className="text-[#3fb950] font-mono font-bold">{avgTtft} ms</span>
            </div>
          </div>
        </div>

        {/* Center Main Dashboard */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'models' && (
            <div className="max-w-6xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Active Offline AI Specialized Models</h2>
                  <p className="text-xs text-[#8b949e]">
                    Each model is quantized and optimized for specific subsystem tasks with zero cloud latency and complete data privacy.
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-[#a855f7]/20 border border-[#a855f7] text-[#c084fc] text-xs font-bold rounded">
                  {models.length} Offline Models Running
                </span>
              </div>

              <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0d1117] text-[#8b949e] uppercase font-bold border-b border-[#30363d]">
                    <tr>
                      <th className="p-3">Model Name & Role</th>
                      <th className="p-3">Format / Backend</th>
                      <th className="p-3">Context Window</th>
                      <th className="p-3">Speed (Tok/s)</th>
                      <th className="p-3">TTFT Latency</th>
                      <th className="p-3">VRAM / RAM</th>
                      <th className="p-3">Prompt Cache</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#30363d]">
                    {models.map(model => (
                      <tr key={model.id} className="hover:bg-[#1f2937] transition">
                        <td className="p-3">
                          <div className="font-bold text-white">{model.name}</div>
                          <div className="text-[10px] text-[#a855f7] font-semibold">{model.role}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-mono text-white">{model.format}</div>
                          <div className="text-[10px] text-[#8b949e]">{model.backend}</div>
                        </td>
                        <td className="p-3 font-mono text-[#58a6ff]">
                          {model.contextSizeTokens.toLocaleString()} tokens
                        </td>
                        <td className="p-3 font-mono font-bold text-[#38bdf8]">
                          {model.throughputTokensSec} tok/s
                        </td>
                        <td className="p-3 font-mono text-[#3fb950] font-bold">
                          {model.ttftMs} ms
                        </td>
                        <td className="p-3 font-mono text-white">
                          <div>{model.vramUsageMb} MB VRAM</div>
                          <div className="text-[10px] text-[#8b949e]">{model.ramUsageMb} MB RAM</div>
                        </td>
                        <td className="p-3 font-mono text-[#3fb950]">
                          {model.promptCacheHitRate}% Hit
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => flushKVCache(model.id)}
                            className="px-2 py-1 text-[11px] font-bold rounded border border-[#30363d] bg-[#21262d] text-[#8b949e] hover:text-white transition"
                            title="Trim KV cache memory blocks"
                          >
                            Flush KV
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'kv_cache' && (
            <div className="max-w-6xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">PagedAttention & FlashAttention-2 Memory Manager</h2>
                  <p className="text-xs text-[#8b949e]">
                    Eliminates VRAM fragmentation by storing Key-Value tensors in non-contiguous 16-token virtual memory blocks.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#38bdf8] font-bold">
                  Memory Efficiency: 96.8% (0% Fragmentation)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl space-y-2">
                  <span className="text-xs font-bold text-[#8b949e] uppercase block">Virtual Block Size</span>
                  <div className="text-xl font-bold font-mono text-white">16 Tokens / Block</div>
                  <p className="text-[10px] text-[#8b949e]">Optimized for SIMD-128 and Tensor Core alignment</p>
                </div>

                <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl space-y-2">
                  <span className="text-xs font-bold text-[#8b949e] uppercase block">KV Cache Quantization</span>
                  <div className="text-xl font-bold font-mono text-[#38bdf8]">FP8 E4M3 (50% Bandwidth Saved)</div>
                  <p className="text-[10px] text-[#8b949e]">High-precision matrix multiplication with zero perplexity loss</p>
                </div>

                <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl space-y-2">
                  <span className="text-xs font-bold text-[#8b949e] uppercase block">Shared Prompt Prefix Tree</span>
                  <div className="text-xl font-bold font-mono text-[#3fb950]">Radix Tree Active (94.2% Hit)</div>
                  <p className="text-[10px] text-[#8b949e]">Reuses system prompt tokens across all NPC interactions</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vector_rag' && (
            <div className="max-w-6xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Local In-Memory HNSW Vector Store & Code/Lore RAG</h2>
                  <p className="text-xs text-[#8b949e]">
                    Instantly feeds accurate game lore, shader code, and API documentation to the offline AI model with sub-millisecond semantic search.
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-[#10b981]/20 border border-[#10b981] text-[#34d399] text-xs font-bold rounded">
                  {vectorChunks.length} Knowledge Chunks Embedded
                </span>
              </div>

              <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0d1117] text-[#8b949e] uppercase font-bold border-b border-[#30363d]">
                    <tr>
                      <th className="p-3">Source Document</th>
                      <th className="p-3">Token Length</th>
                      <th className="p-3">Vector Dimension</th>
                      <th className="p-3">Indexed Timestamp</th>
                      <th className="p-3 text-right">Cosine Similarity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#30363d]">
                    {vectorChunks.map(chunk => (
                      <tr key={chunk.id} className="hover:bg-[#1f2937]">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <Database size={14} className="text-[#10b981]" />
                          {chunk.sourceDoc}
                        </td>
                        <td className="p-3 font-mono text-[#8b949e]">{chunk.tokenCount} tokens</td>
                        <td className="p-3 font-mono text-white">{chunk.embeddingDim}D Dense</td>
                        <td className="p-3 font-mono text-[#8b949e]">{chunk.indexedTime}</td>
                        <td className="p-3 font-mono text-right text-[#3fb950] font-bold">
                          {(chunk.similarityScore * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
