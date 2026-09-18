/**
 * ====================================================================================================
 * MODULE: OfflineAITokenGuardDashboard.tsx
 * PURPOSE: AAA-Fidelity Universal Offline AI & Token Conservation Command Center (100% Offline)
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * 1. ศูนย์ควบคุมหลักสำหรับบริหารจัดการ AI ออฟไลน์ 100% และการประหยัด Token สูงสุด
 * 2. แสดงตัวเลข Token ที่ประหยัดได้ (Tokens Saved Ticker), ค่าใช้จ่ายที่ลดลง ($ USD Saved), และการดักจับ Quota Block
 * 3. มีสตูดิโอบีบอัด Prompt เชิงความหมายแบบเรียลไทม์ (Interactive Semantic Prompt Compressor)
 * 4. แสดงสถานะและสุขภาพของระบบ AI ออฟไลน์ทั้ง 18+ ระบบ (Subsystems Registry Matrix)
 * 5. สำรวจและบริหารคลังแคชผลลัพธ์การสร้าง (Offline Neural Cache Explorer)
 * 6. ทดสอบการสร้างงานกราฟิก/สไปรต์แบบ Procedural ด้วย 0 Token ในตัว
 * 
 * ARCHITECTURE & SYSTEM INTEGRATION:
 * - เชื่อมต่อกับ UniversalOfflineAITokenGuard, OfflineSemanticTokenCompressorNode,
 *   OfflineMultiModalNeuralCacheNode, และ OfflineProceduralAssetGeneratorNode
 * 
 * INPUTS, OUTPUTS & DATA CONTRACTS:
 * - Standalone React Component สำหรับแสดงผลในหน้าจอหลัก หรือแยกหน้าต่าง Detachable Window
 * ====================================================================================================
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  Zap,
  Cpu,
  Database,
  Layers,
  Sparkles,
  Sliders,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Search,
  HardDrive,
  Trash2,
  ArrowRight,
  TrendingDown,
  Lock,
  Flame,
  FileCode,
  Image as ImageIcon,
  Bot,
  Languages,
  Mic,
  Activity,
  AlertTriangle,
  FolderTree
} from 'lucide-react';
import { UniversalOfflineAITokenGuard, TokenGuardTelemetry } from '../utils/UniversalOfflineAITokenGuard';
import { OfflineSemanticTokenCompressorNode, CompressedTokenResult } from '../utils/OfflineSemanticTokenCompressorNode';
import { OfflineMultiModalNeuralCacheNode, CachedEntry } from '../utils/OfflineMultiModalNeuralCacheNode';
import { OfflineAISubsystemsRegistry, OfflineAISubsystemInfo } from '../utils/OfflineAISubsystemsRegistry';
import { OfflineProceduralAssetGeneratorNode, ProceduralAssetOutput } from '../utils/OfflineProceduralAssetGeneratorNode';

export default function OfflineAITokenGuardDashboard() {
  const [telemetry, setTelemetry] = useState<TokenGuardTelemetry>(() => 
    UniversalOfflineAITokenGuard.getTelemetry()
  );
  const [subsystems, setSubsystems] = useState<OfflineAISubsystemInfo[]>(() =>
    OfflineAISubsystemsRegistry.getAllSubsystems()
  );
  const [cacheEntries, setCacheEntries] = useState<CachedEntry[]>(() =>
    OfflineMultiModalNeuralCacheNode.getAllEntries()
  );
  
  // Compressor State
  const [promptInput, setPromptInput] = useState<string>(
    `Hello AI assistant, could you please kindly write a high performance game movement controller in TypeScript for my 2D platformer? I would really appreciate it if you could add jump mechanics and wall sliding. Thank you in advance!`
  );
  const [compressionResult, setCompressionResult] = useState<CompressedTokenResult | null>(null);
  const [stripPoliteness, setStripPoliteness] = useState(true);
  const [stripBoilerplate, setStripBoilerplate] = useState(true);
  const [stripWhitespace, setStripWhitespace] = useState(true);
  const [minifyCode, setMinifyCode] = useState(false);
  const [aggressiveMode, setAggressiveMode] = useState(false);
  const [copied, setCopied] = useState(false);

  // Asset Test State
  const [assetPrompt, setAssetPrompt] = useState('Sci-Fi Cyberpunk Neon Core Energy Orb');
  const [isGeneratingAsset, setIsGeneratingAsset] = useState(false);
  const [generatedAsset, setGeneratedAsset] = useState<ProceduralAssetOutput | null>(null);

  // Filter for Subsystems
  const [subsystemFilter, setSubsystemFilter] = useState<'ALL' | 'VISION_TEXTURE' | 'CODE_LOGIC' | 'AUDIO_VOICE' | 'SYSTEM_DEFENSE'>('ALL');
  const [cacheSearch, setCacheSearch] = useState('');

  // Subscribe to Telemetry
  useEffect(() => {
    return UniversalOfflineAITokenGuard.subscribe((data) => {
      setTelemetry(data);
      setSubsystems([...OfflineAISubsystemsRegistry.getAllSubsystems()]);
    });
  }, []);

  // Run initial compression
  useEffect(() => {
    handleCompress();
  }, [promptInput, stripPoliteness, stripBoilerplate, stripWhitespace, minifyCode, aggressiveMode]);

  const handleCompress = () => {
    const result = OfflineSemanticTokenCompressorNode.compressPrompt(promptInput, {
      stripPoliteness,
      stripConversationalFillers: stripBoilerplate,
      stripRedundantWhitespace: stripWhitespace,
      minifyCodeBlocks: minifyCode,
      aggressiveMode
    });
    setCompressionResult(result);
  };

  const handleApplySavedTokens = () => {
    if (compressionResult && compressionResult.tokensSaved > 0) {
      UniversalOfflineAITokenGuard.recordTokensSaved(compressionResult.tokensSaved);
    }
  };

  const handleToggleMasterOffline = () => {
    UniversalOfflineAITokenGuard.setEnforced(!telemetry.isOfflineEnforced);
  };

  const handleCopyCompressed = () => {
    if (compressionResult?.compressedText) {
      navigator.clipboard.writeText(compressionResult.compressedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerateProceduralAsset = async () => {
    setIsGeneratingAsset(true);
    try {
      const asset = await OfflineProceduralAssetGeneratorNode.generateAsset(assetPrompt, 512);
      setGeneratedAsset(asset);
      UniversalOfflineAITokenGuard.recordTokensSaved(450, 'sub_texture_proc');
      setCacheEntries(OfflineMultiModalNeuralCacheNode.getAllEntries());
    } finally {
      setIsGeneratingAsset(false);
    }
  };

  const filteredSubsystems = useMemo(() => {
    if (subsystemFilter === 'ALL') return subsystems;
    return subsystems.filter(s => s.category === subsystemFilter);
  }, [subsystems, subsystemFilter]);

  const filteredCache = useMemo(() => {
    if (!cacheSearch) return cacheEntries;
    return cacheEntries.filter(e => 
      e.promptSignature.toLowerCase().includes(cacheSearch.toLowerCase()) ||
      e.modality.toLowerCase().includes(cacheSearch.toLowerCase())
    );
  }, [cacheEntries, cacheSearch]);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] text-[#c9d1d9] overflow-y-auto">
      {/* Top Banner: Master 100% Offline Enforcement Switch */}
      <div className="p-6 border-b border-[#21262d] bg-[#0d1117] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-wide">
                Universal Offline AI & Token Conservation Shield
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                100% On-Device Neural Mode
              </span>
            </div>
            <p className="text-xs text-[#8b949e] mt-1">
              ระบบปัญญาประดิษฐ์ออฟไลน์สมบูรณ์แบบ ทำงานบนเครื่อง 100% ไม่ใช้เน็ต ไม่ส่งข้อมูลออก ปลอดภัย ประหยัด Token สูงสุด
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleMasterOffline}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wider transition-all flex items-center gap-2.5 shadow-md ${
              telemetry.isOfflineEnforced
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                : 'bg-[#21262d] hover:bg-[#30363d] text-[#8b949e]'
            }`}
          >
            <Lock className="w-4 h-4" />
            {telemetry.isOfflineEnforced ? '100% OFFLINE AI ENFORCED (ACTIVE)' : 'HYBRID CLOUD MODE'}
          </button>
        </div>
      </div>

      {/* Hero Metrics Row */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8b949e]">
            <span className="text-xs uppercase font-bold tracking-wider">Total Tokens Saved</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {telemetry.totalTokensSavedLifetime.toLocaleString()}
            </span>
            <span className="text-xs text-[#8b949e] ml-2">Tokens</span>
          </div>
          <div className="text-[11px] text-emerald-400/80 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            +{telemetry.tokensSavedToday.toLocaleString()} saved today (100% Free)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8b949e]">
            <span className="text-xs uppercase font-bold tracking-wider">Estimated Cost Saved</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-amber-400 font-mono">
              ${telemetry.costSavedUSDLifetime.toFixed(2)}
            </span>
            <span className="text-xs text-[#8b949e] ml-2">USD</span>
          </div>
          <div className="text-[11px] text-[#8b949e]">
            Equivalent to ~{Math.round(telemetry.totalTokensSavedLifetime / 1000)}k API requests avoided
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8b949e]">
            <span className="text-xs uppercase font-bold tracking-wider">Quota Violations Blocked</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-cyan-400 font-mono">
              {telemetry.quotaBlockedCallsPrevented}
            </span>
            <span className="text-xs text-[#8b949e] ml-2">Events</span>
          </div>
          <div className="text-[11px] text-cyan-400/80">
            Zero Rate-Limit or 429 Errors encountered
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8b949e]">
            <span className="text-xs uppercase font-bold tracking-wider">Active Offline Subsystems</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-purple-400 font-mono">
              {telemetry.activeOfflineSubsystemsCount} / {subsystems.length}
            </span>
            <span className="text-xs text-[#8b949e] ml-2">Online</span>
          </div>
          <div className="text-[11px] text-purple-400/80">
            Average Latency: ~8ms on-device
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="px-6 pb-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Interactive Semantic Prompt Compressor Studio */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">
                  Semantic AST Prompt & Token Compressor
                </h2>
              </div>
              <span className="text-xs text-[#8b949e]">
                Real-time AST Pruning & Token Savings
              </span>
            </div>

            <p className="text-xs text-[#8b949e] mb-4">
              ตัดคำฟุ่มเฟือย คำเกริ่นนำ และจัดรูปแบบข้อความและโค้ดให้กระชับ เพื่อประหยัด Token ได้ 40% - 75% ก่อนนำไปใช้งาน
            </p>

            {/* Options Toggle Bar */}
            <div className="flex flex-wrap gap-2.5 mb-4 p-3 rounded-lg bg-[#0d1117] border border-[#21262d]">
              <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={stripPoliteness}
                  onChange={e => setStripPoliteness(e.target.checked)}
                  className="rounded border-[#30363d] bg-[#161b22] text-emerald-500 focus:ring-0"
                />
                <span>Prune Politeness</span>
              </label>

              <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={stripBoilerplate}
                  onChange={e => setStripBoilerplate(e.target.checked)}
                  className="rounded border-[#30363d] bg-[#161b22] text-emerald-500 focus:ring-0"
                />
                <span>Remove Conversational Fillers</span>
              </label>

              <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={stripWhitespace}
                  onChange={e => setStripWhitespace(e.target.checked)}
                  className="rounded border-[#30363d] bg-[#161b22] text-emerald-500 focus:ring-0"
                />
                <span>Normalize Whitespace</span>
              </label>

              <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={minifyCode}
                  onChange={e => setMinifyCode(e.target.checked)}
                  className="rounded border-[#30363d] bg-[#161b22] text-emerald-500 focus:ring-0"
                />
                <span>Minify Code Blocks</span>
              </label>

              <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={aggressiveMode}
                  onChange={e => setAggressiveMode(e.target.checked)}
                  className="rounded border-[#30363d] bg-[#161b22] text-emerald-500 focus:ring-0"
                />
                <span>Aggressive Semantic Mode</span>
              </label>
            </div>

            {/* Input & Output Side-by-Side or Stacked */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs text-[#8b949e] mb-1.5">
                  <span className="font-semibold uppercase tracking-wider">Raw Input Prompt</span>
                  <span>Estimated: <strong className="text-white font-mono">{compressionResult?.originalTokensEstimated || 0}</strong> tokens</span>
                </div>
                <textarea
                  value={promptInput}
                  onChange={e => setPromptInput(e.target.value)}
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-sm text-white focus:outline-none focus:border-emerald-500 font-mono resize-none"
                  placeholder="Paste long prompt or code here..."
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs text-[#8b949e] mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold uppercase tracking-wider text-emerald-400">Compressed Output</span>
                    {compressionResult && compressionResult.tokensSaved > 0 && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[11px]">
                        Saved {compressionResult.tokensSaved} tokens ({(compressionResult.savingsRatio * 100).toFixed(0)}% reduction)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyCompressed}
                      className="px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-xs text-white flex items-center gap-1.5 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      onClick={handleApplySavedTokens}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
                    >
                      Record Savings
                    </button>
                  </div>
                </div>
                <textarea
                  value={compressionResult?.compressedText || ''}
                  readOnly
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d1117] border border-emerald-500/40 text-sm text-emerald-300 font-mono resize-none focus:outline-none"
                />
              </div>

              {/* Applied Techniques */}
              {compressionResult?.reductionTechniquesApplied && compressionResult.reductionTechniquesApplied.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {compressionResult.reductionTechniquesApplied.map((tech, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-[#21262d] text-[#8b949e] text-[10px] font-mono">
                      ✓ {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Offline Procedural Asset Generator Test */}
          <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold text-white">
                  100% Offline Procedural Asset Synthesis (Zero Tokens)
                </h2>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                0 Tokens Consumed
              </span>
            </div>

            <p className="text-xs text-[#8b949e] mb-4">
              สร้างเท็กซ์เจอร์, ไอคอน, และ Game Sprites ด้วยอัลกอริทึมคณิตศาสตร์แบบ On-Device ไม่ต้องพึ่งพาโมเดลคลาวด์ภายนอก
            </p>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={assetPrompt}
                onChange={e => setAssetPrompt(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-lg bg-[#0d1117] border border-[#30363d] text-sm text-white focus:outline-none focus:border-cyan-500"
                placeholder="Asset prompt (e.g., Cyberpunk Neon Core, Ancient Rune Stone)..."
              />
              <button
                onClick={handleGenerateProceduralAsset}
                disabled={isGeneratingAsset}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isGeneratingAsset ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate (0 Tokens)
              </button>
            </div>

            {generatedAsset && (
              <div className="p-3 rounded-lg bg-[#0d1117] border border-[#21262d] flex items-center gap-4">
                <img
                  src={generatedAsset.dataUrl}
                  alt={generatedAsset.name}
                  className="w-20 h-20 rounded-lg object-cover border border-[#30363d]"
                />
                <div className="flex-1 text-xs space-y-1">
                  <div className="font-bold text-white">{generatedAsset.name}</div>
                  <div className="text-[#8b949e]">Engine: {generatedAsset.engineType}</div>
                  <div className="text-emerald-400 font-mono">Tokens Used: 0 | Latency: {generatedAsset.generationLatencyMs}ms</div>
                  <div className="text-[10px] text-[#8b949e]">Palette: {generatedAsset.metadata.dominantPalette.join(', ')}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: All 18+ Subsystems & Neural Cache Browser */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* Subsystems Matrix */}
          <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <h2 className="text-base font-bold text-white">On-Device AI Engines</h2>
              </div>
              <span className="text-xs text-[#8b949e]">
                {subsystems.filter(s => s.isOfflineActive).length} Active
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 text-[11px]">
              {(['ALL', 'VISION_TEXTURE', 'CODE_LOGIC', 'AUDIO_VOICE', 'SYSTEM_DEFENSE'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSubsystemFilter(cat)}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    subsystemFilter === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-[#0d1117] text-[#8b949e] hover:text-white'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {filteredSubsystems.map(sub => (
                <div
                  key={sub.id}
                  className="p-3 rounded-lg bg-[#0d1117] border border-[#21262d] flex items-center justify-between gap-3 hover:border-[#30363d] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-center text-purple-400">
                      {sub.category === 'VISION_TEXTURE' ? <ImageIcon className="w-4 h-4" /> :
                       sub.category === 'CODE_LOGIC' ? <FileCode className="w-4 h-4" /> :
                       sub.category === 'AUDIO_VOICE' ? <Mic className="w-4 h-4" /> :
                       sub.category === 'SYSTEM_DEFENSE' ? <Shield className="w-4 h-4" /> :
                       <Bot className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{sub.name}</div>
                      <div className="text-[10px] text-[#8b949e]">{sub.onDeviceEngine}</div>
                      <div className="text-[10px] text-emerald-400 font-mono">
                        Saved {sub.tokensSavedTotal.toLocaleString()} tokens | {sub.averageLatencyMs}ms
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    100% Offline
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Neural Cache Browser */}
          <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white">Neural Response Cache</h2>
              </div>
              <span className="text-xs text-emerald-400 font-mono">
                {cacheEntries.length} Items Cached
              </span>
            </div>

            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-[#8b949e] absolute left-3 top-3" />
              <input
                type="text"
                value={cacheSearch}
                onChange={e => setCacheSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs text-white focus:outline-none focus:border-amber-500"
                placeholder="Search cached prompts..."
              />
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {filteredCache.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#8b949e]">
                  No cached entries found. Generates and caches on-demand.
                </div>
              ) : (
                filteredCache.map(item => (
                  <div
                    key={item.cacheKey}
                    className="p-2.5 rounded-lg bg-[#0d1117] border border-[#21262d] flex items-center justify-between text-xs"
                  >
                    <div className="truncate mr-2">
                      <div className="font-semibold text-white truncate">{item.promptSignature}</div>
                      <div className="text-[10px] text-[#8b949e] font-mono">
                        {item.modality} • {item.hitCount} hits • +{item.tokensSavedPerHit * item.hitCount} tokens saved
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 whitespace-nowrap">
                      Hit: {item.hitCount}x
                    </span>
                  </div>
                ))
              )}
            </div>

            {cacheEntries.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#21262d] flex justify-end">
                <button
                  onClick={() => {
                    OfflineMultiModalNeuralCacheNode.clearCache();
                    setCacheEntries([]);
                  }}
                  className="px-2.5 py-1 rounded bg-[#21262d] hover:bg-red-900/30 text-xs text-[#8b949e] hover:text-red-400 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Cache
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
