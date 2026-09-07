/**
 * @file OmniWorkflowNavigatorModal.tsx
 * @description
 * ============================================================================
 * [THAI]
 * โมดอลผังงานและศูนย์รวมระบบอัจฉริยะ (Omni Master Workflow & Studio Navigator)
 * ทำหน้าที่รวมกลุ่มเครื่องมือทั้งหมดที่ "ทำงานเหมือนกัน", "ทำงานคล้ายกัน" และ "ต้องทำงานร่วมกันใน Pipeline"
 * ออกมาเป็น 12 สตูดิโอหลักที่ชัดเจน ไม่ซับซ้อน ลดความสับสน พร้อมตัวค้นหาตามเจตนาการทำงาน (Task-Oriented Search)
 * 
 * [ENGLISH]
 * Enterprise Omni Workflow & Studio Navigator Modal.
 * Consolidates all engine modules into 12 structured Master Studios categorized by:
 *   1. Identical Purpose (ทำงานเหมือนกัน)
 *   2. Similar Functionality (ทำงานคล้ายกัน)
 *   3. Pipeline Interoperability (ต้องทำงานร่วมกัน)
 * Features task-oriented intent search, workflow stage visualization, and 1-click launch.
 * ============================================================================
 * 
 * 1. MODULE RESPONSIBILITY & PURPOSE:
 *    - Provides a crystal-clear, non-confusing map of all 12 consolidated engine studios.
 *    - Allows instant switching and search across all pipeline stages.
 *    - Eliminates navigation cognitive overload.
 * 
 * 2. ARCHITECTURE & SYSTEM INTEGRATION:
 *    - Integrates with: App.tsx tools array, CommandPalette.tsx, OmniEngineIDE.tsx.
 * 
 * 3. DATA CONTRACTS:
 *    - Props:
 *        - isOpen: boolean
 *        - onClose: () => void
 *        - onSelectTool: (toolId: string) => void
 *        - tools: any[]
 * 
 * 4. USAGE EXAMPLE:
 *    ```tsx
 *    <OmniWorkflowNavigatorModal
 *      isOpen={isNavigatorOpen}
 *      onClose={() => setIsNavigatorOpen(false)}
 *      onSelectTool={(id) => setActiveTool(id)}
 *      tools={tools}
 *    />
 *    ```
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Sparkles,
  Command,
  Code2,
  BrainCircuit,
  Globe,
  Box,
  Palette,
  Clapperboard,
  Mic2,
  Gamepad2,
  Flame,
  LayoutDashboard,
  ArrowRight,
  Zap,
  CheckCircle2,
  FolderTree,
  Sliders,
  Layers,
  ChevronRight,
  Workflow
} from 'lucide-react';

interface OmniWorkflowNavigatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
  tools: any[];
}

export default function OmniWorkflowNavigatorModal({
  isOpen,
  onClose,
  onSelectTool,
  tools
}: OmniWorkflowNavigatorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkflowStage, setSelectedWorkflowStage] = useState<string>('all');

  const workflowStages = [
    { id: 'all', label: 'ทั้งหมด (All Studios)', count: 12 },
    { id: 'flagship', label: '🚀 Flagship 8-in-1', count: 1 },
    { id: 'dev', label: '💻 โค้ด & AI พัฒนาเกม', count: 2 },
    { id: 'world', label: '🌍 สร้างโลก & 3D/CAD', count: 2 },
    { id: 'art', label: '🎨 เท็กเจอร์, อนิเมชัน & เสียง', count: 3 },
    { id: 'gameplay', label: '🎮 เกมเพลย์, ฟิสิกส์ & เรนเดอร์', count: 2 },
    { id: 'publish', label: '⚙️ UI/UX & บิ้วด์เผยแพร่', count: 2 },
  ];

  const filteredHubs = useMemo(() => {
    return tools.filter((hub) => {
      const matchesSearch =
        searchQuery === '' ||
        hub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hub.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hub.subTools?.some((st: any) =>
          st.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          st.id.toLowerCase().includes(searchQuery.toLowerCase())
        );

      if (!matchesSearch) return false;

      if (selectedWorkflowStage === 'all') return true;
      if (selectedWorkflowStage === 'flagship' && hub.id === 'OmniMasterCreatorSuite') return true;
      if (selectedWorkflowStage === 'dev' && ['ProjectHub', 'CodeIDEHub', 'AIHubMaster'].includes(hub.id)) return true;
      if (selectedWorkflowStage === 'world' && ['WorldHub', 'ArtStudioHub'].includes(hub.id)) return true;
      if (selectedWorkflowStage === 'art' && ['TextureHub', 'AnimationHub', 'AudioHub'].includes(hub.id)) return true;
      if (selectedWorkflowStage === 'gameplay' && ['GameDesignHub', 'PhysicsHub'].includes(hub.id)) return true;
      if (selectedWorkflowStage === 'publish' && ['DevOpsHub'].includes(hub.id)) return true;

      return true;
    });
  }, [tools, searchQuery, selectedWorkflowStage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[88vh] bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-white">
        {/* Modal Header */}
        <div className="p-5 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-blue-500/20 border border-[#388bfd]/30 flex items-center justify-center text-amber-400">
              <Workflow size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-wide text-white">
                  ผังรวมระบบสตูดิโอ & แผนที่เครื่องมือ (Master Studio Navigator)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  Consolidated 12 Master Hubs
                </span>
              </div>
              <p className="text-xs text-[#8b949e] mt-0.5">
                จัดกลุ่มเครื่องมือที่ทำงานเหมือนกัน, คล้ายกัน และทำงานร่วมกัน เพื่อความสะดวกสูงสุดในการสร้างเกมและโปรแกรม
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#21262d] text-[#8b949e] hover:text-white hover:bg-[#30363d] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-[#161b22]/70 border-b border-[#30363d] flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3 top-3 text-[#8b949e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาสตูดิโอ, ระบบย่อย, หรือหน้าที่งาน..."
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#8b949e] outline-none focus:border-[#58a6ff] transition-colors"
            />
          </div>

          {/* Workflow Stage Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto custom-scrollbar pb-1 sm:pb-0">
            {workflowStages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setSelectedWorkflowStage(stage.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  selectedWorkflowStage === stage.id
                    ? 'bg-[#1f6feb] border-[#58a6ff] text-white shadow-sm'
                    : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-white hover:bg-[#21262d]'
                }`}
              >
                {stage.label}
              </button>
            ))}
          </div>
        </div>

        {/* Studio Cards Grid */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-[#0a0a0f]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHubs.map((hub) => (
              <div
                key={hub.id}
                className="bg-[#161b22]/60 hover:bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff]/50 rounded-xl p-4 flex flex-col justify-between transition-all duration-200 group hover:shadow-lg"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] ${hub.activeColor}`}>
                        {hub.icon}
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e]">
                          {hub.category}
                        </div>
                        <h3 className="font-bold text-sm text-white group-hover:text-[#58a6ff] transition-colors">
                          {hub.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* SubTools Included List */}
                  <div className="bg-[#0d1117]/80 rounded-lg p-2.5 border border-[#21262d] mb-3 space-y-1.5">
                    <div className="text-[11px] font-bold text-[#8b949e] flex items-center justify-between pb-1 border-b border-[#21262d]">
                      <span>เครื่องมือที่รวมไว้ ({hub.subTools?.length || 0})</span>
                      <span className="text-[10px] text-emerald-400">Integrated Suite</span>
                    </div>
                    <div className="space-y-1 max-h-36 overflow-y-auto custom-scrollbar pr-1">
                      {hub.subTools?.map((sub: any) => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            onSelectTool(sub.id);
                            onClose();
                          }}
                          className="w-full text-left p-1 rounded hover:bg-[#1f6feb]/20 hover:text-white text-[#c9d1d9] text-xs flex items-center justify-between group/sub transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-[#8b949e] group-hover/sub:text-[#58a6ff]">
                              {sub.icon}
                            </span>
                            <span className="truncate">{sub.title}</span>
                          </div>
                          <ChevronRight size={11} className="text-[#8b949e] group-hover/sub:text-white shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Open Suite Button */}
                <button
                  onClick={() => {
                    onSelectTool(hub.id);
                    onClose();
                  }}
                  className="w-full py-2 bg-[#21262d] hover:bg-[#1f6feb] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#30363d] hover:border-[#58a6ff]"
                >
                  <span>เปิดสตูดิโอนี้ (Open Suite)</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#161b22] border-t border-[#30363d] flex items-center justify-between text-xs text-[#8b949e] font-mono px-5">
          <span>รวมศูนย์แล้ว 12 Master Super Studios พร้อมระบบย่อยครบ 100%</span>
          <span>Tip: กดปุ่มไอคอนบนแถบเครื่องมือเพื่อสลับหน้าได้ทันที</span>
        </div>
      </div>
    </div>
  );
}
