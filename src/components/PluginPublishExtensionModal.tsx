/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Developer authoring and packaging modal for creating, testing, and publishing
 *          custom community-made engine extensions and scripts. Provides live manifest
 *          generation, permission scoping, syntax validation, and instant registration
 *          into the local engine registry and downloadable .omni-plugin bundle.
 *    - TH: หน้าต่างสร้างและแพ็กเกจส่วนขยาย/สคริปต์ใหม่ (Publish Custom Extension Modal)
 *          ช่วยให้นักพัฒนาเขียนส่วนขยาย กำหนดสิทธิ์การเข้าถึง (Permissions)
 *          ทดสอบความปลอดภัยเบื้องต้น และติดตั้งลงสู่เครื่องหรือส่งออกไฟล์ .omni-plugin
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Calls `PluginMarketplaceRegistryNode.registerCustomPlugin()`
 *    - Validates AST safety with `PluginSecuritySandboxEvaluatorNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onClose: () => void`, `onPublished?: (plugin: EnginePlugin) => void`
 * ============================================================================
 */

import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Upload, 
  Check, 
  AlertCircle, 
  Code2, 
  ShieldCheck, 
  Sliders, 
  Sparkles,
  Download
} from 'lucide-react';
import { EnginePlugin, PluginCategory, PluginPermission } from '../types/pluginMarketplaceTypes';
import { PluginMarketplaceRegistryNode } from '../utils/PluginMarketplaceRegistryNode';
import { PluginSecuritySandboxEvaluatorNode } from '../utils/PluginSecuritySandboxEvaluatorNode';

interface PluginPublishExtensionModalProps {
  onClose: () => void;
  onPublished?: (plugin: EnginePlugin) => void;
}

const ALL_PERMISSIONS: { id: PluginPermission; label: string; desc: string }[] = [
  { id: 'GPU_COMPUTE', label: 'GPU Compute Passes', desc: 'Execute WebGPU/WebGL compute shader kernels' },
  { id: 'MEMORY_PROFILER', label: 'Memory Heap Inspector', desc: 'Inspect entity component memory allocations' },
  { id: 'RAW_SOCKET', label: 'Raw Network Sockets', desc: 'Direct UDP/TCP netcode synchronization' },
  { id: 'FILE_SYSTEM', label: 'Virtual File Workspace', desc: 'Read/write assets in the local project workspace' },
  { id: 'WEB_WORKER', label: 'Background Worker Threads', desc: 'Multi-threaded algorithmic calculations' },
  { id: 'AUDIO_THREAD', label: 'Real-Time Audio DSP', desc: 'Direct AudioWorklet sample buffer processing' }
];

const CATEGORIES: PluginCategory[] = [
  'PHYSICS',
  'GRAPHICS_SHADERS',
  'AI_BEHAVIOR',
  'NETCODE',
  'DEVOPS_CI',
  'AUDIO_DSP',
  'PROCEDURAL_PCG',
  'TOOLS_UI'
];

export default function PluginPublishExtensionModal({ onClose, onPublished }: PluginPublishExtensionModalProps) {
  const [name, setName] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<PluginCategory>('TOOLS_UI');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [tagsStr, setTagsStr] = useState('extension, script, engine');
  const [language, setLanguage] = useState<'typescript' | 'glsl' | 'wasm' | 'cpp' | 'lua'>('typescript');
  const [entryPoint, setEntryPoint] = useState('ExtensionEntry.ts');
  const [selectedPermissions, setSelectedPermissions] = useState<PluginPermission[]>([]);
  const [sourceCode, setSourceCode] = useState(`/**
 * Community Extension Entry Point
 */
export class CommunityExtension {
  public initialize(engine: any): void {
    console.log("Extension initialized!");
  }

  public onUpdate(deltaTime: number): void {
    // Per-frame logic
  }
}`);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const togglePermission = (perm: PluginPermission) => {
    if (selectedPermissions.includes(perm)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== perm));
    } else {
      setSelectedPermissions([...selectedPermissions, perm]);
    }
  };

  const handlePublish = (downloadBundle = false) => {
    if (!name.trim()) {
      setErrorMsg('Extension name is required.');
      return;
    }
    if (!author.trim()) {
      setErrorMsg('Author name is required.');
      return;
    }

    const pluginId = `custom_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString(36)}`;
    const tags = tagsStr.split(',').map(s => s.trim()).filter(Boolean);

    const newPlugin: EnginePlugin = {
      id: pluginId,
      name: name.trim(),
      version: version.trim() || '1.0.0',
      author: author.trim(),
      category,
      tagline: tagline.trim() || description.slice(0, 80),
      description: description.trim() || 'User-authored custom engine extension.',
      detailedReadmeMarkdown: `# ${name}\n\n${description}\n\n### Authors\nCreated by **${author}** for NexusEngine.`,
      rating: 5.0,
      ratingCount: 1,
      downloadCount: 1,
      sizeKb: Math.max(12, Math.round(sourceCode.length / 1024)),
      minEngineVersion: 'v3.8.0',
      tags,
      permissions: selectedPermissions,
      securityTier: 'EXPERIMENTAL_SANDBOX',
      securityAuditScore: 90,
      entryPointFilename: entryPoint.trim() || 'index.ts',
      language,
      sourceCodePreview: sourceCode,
      dependencies: [],
      changelog: [
        { version: version.trim() || '1.0.0', releaseDate: new Date().toISOString().split('T')[0], highlights: ['Initial community release'] }
      ],
      runtimeMemoryFootprintKb: 1200,
      estimatedLatencyMs: 0.35,
      updatedAt: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      license: 'MIT'
    };

    // Evaluate security
    const audit = PluginSecuritySandboxEvaluatorNode.evaluate(newPlugin);
    newPlugin.securityAuditScore = audit.score;
    newPlugin.securityTier = audit.tier;

    // Register into registry
    PluginMarketplaceRegistryNode.getInstance().registerCustomPlugin(newPlugin, true);

    if (downloadBundle) {
      const blob = new Blob([JSON.stringify(newPlugin, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${newPlugin.id}.omni-plugin.json`;
      a.click();
      URL.revokeObjectURL(url);
    }

    if (onPublished) {
      onPublished(newPlugin);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f141c] border border-[#2a3447] rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-[#222b3d] bg-[#141b26] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Package size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Package & Publish Community Extension</h2>
              <p className="text-xs text-[#94a3b8]">Create, scope permissions, and register a new engine extension.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-white p-1 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-[#cbd5e1]">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-center gap-2">
              <AlertCircle size={14} /> {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#94a3b8] uppercase mb-1">Extension Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dynamic Weather Simulator"
                className="w-full bg-[#090d14] border border-[#334155] rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#94a3b8] uppercase mb-1">Author / Studio *</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. IndieForge Developer"
                className="w-full bg-[#090d14] border border-[#334155] rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#94a3b8] uppercase mb-1">Version</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0.0"
                className="w-full bg-[#090d14] border border-[#334155] rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#94a3b8] uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PluginCategory)}
                className="w-full bg-[#090d14] border border-[#334155] rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 text-xs"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#94a3b8] uppercase mb-1">Script Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full bg-[#090d14] border border-[#334155] rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 text-xs"
              >
                <option value="typescript">TypeScript</option>
                <option value="glsl">GLSL Shader</option>
                <option value="wasm">WebAssembly</option>
                <option value="cpp">C++ Bindings</option>
                <option value="lua">Lua Script</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#94a3b8] uppercase mb-1">Tagline / Short Summary</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="One-line summary shown in marketplace cards"
              className="w-full bg-[#090d14] border border-[#334155] rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#94a3b8] uppercase mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of features and usage..."
              className="w-full bg-[#090d14] border border-[#334155] rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 text-xs resize-none"
            />
          </div>

          {/* Permissions Selection */}
          <div>
            <label className="block text-[11px] font-bold text-[#94a3b8] uppercase mb-2">
              Subsystem Permissions Requested ({selectedPermissions.length})
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ALL_PERMISSIONS.map(perm => {
                const active = selectedPermissions.includes(perm.id);
                return (
                  <button
                    type="button"
                    key={perm.id}
                    onClick={() => togglePermission(perm.id)}
                    className={`p-2.5 rounded-lg border text-left flex items-start justify-between transition-colors cursor-pointer ${
                      active 
                        ? 'bg-blue-950/40 border-blue-500/60 text-white' 
                        : 'bg-[#090d14] border-[#1e293b] text-[#94a3b8] hover:border-[#334155]'
                    }`}
                  >
                    <div>
                      <div className="font-mono font-bold text-xs">{perm.label}</div>
                      <div className="text-[10px] text-[#64748b]">{perm.desc}</div>
                    </div>
                    {active && <Check size={14} className="text-blue-400 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Source Code */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-[#94a3b8] uppercase">Entry Point Source Code</label>
              <input
                type="text"
                value={entryPoint}
                onChange={(e) => setEntryPoint(e.target.value)}
                placeholder="Filename (e.g. WeatherRig.ts)"
                className="bg-[#090d14] border border-[#334155] rounded px-2 py-0.5 text-[11px] text-white font-mono"
              />
            </div>
            <textarea
              rows={8}
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              className="w-full bg-[#06080d] border border-[#1e293b] rounded-lg p-3 text-xs font-mono text-[#38bdf8] outline-none focus:border-blue-500 leading-relaxed resize-none"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#222b3d] bg-[#141b26] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-white font-medium text-xs transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePublish(true)}
              className="px-3.5 py-2 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#334155]"
            >
              <Download size={13} /> Export .omni-plugin
            </button>
            <button
              onClick={() => handlePublish(false)}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-900/30"
            >
              <Upload size={13} /> Install & Register
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
