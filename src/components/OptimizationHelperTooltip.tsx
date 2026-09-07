/**
 * @file OptimizationHelperTooltip.tsx
 * @description
 * ============================================================================
 * [THAI - ภาษาไทย]
 * คอมโพเนนต์ Tooltip ผู้ช่วยแนะนำการปรับแต่งประสิทธิภาพตามบริบทของเครื่องมือที่กำลังใช้งาน
 * (Context-Sensitive Optimization Encyclopedia Tooltip Helper)
 * 
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 *    - ตรวจจับ Tool ID ปัจจุบัน และดึงข้อมูลคำแนะนำเชิงลึก (Optimization Advice) จาก
 *      `OptimizationEncyclopediaAdvisor.ts`
 *    - แสดงผลในรูปแบบ Floating Badge / Smart Tooltip Popover ที่ไม่บดบังพื้นที่ทำงานหลัก
 *    - แสดงกฎเกณฑ์ทองคำ (Golden Rules), ตัวชี้วัดประสิทธิภาพ (Metrics เช่น CPU -45%, VRAM -65%),
 *      และโค้ดตัวอย่าง (Code Snippets / Formulas)
 *    - มีปุ่มทางลัดในการเปิดหน้าต่างสารานุกรมตัวเต็ม (Deep Jump to OptimizationEncyclopedia)
 *      ตรงตาม Tab ที่สอดคล้องกับเครื่องมือปัจจุบัน
 *    - รองรับการค้นหาด่วน (Quick Search) หัวข้อเทคนิคภายในตัว Tooltip
 * 
 * 2. สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 *    - ดึงข้อมูลจาก: `src/utils/OptimizationEncyclopediaAdvisor.ts`
 *    - ควบคุมการสลับเครื่องมือผ่าน: `onSelectTool` หรือ `window.dispatchEvent(new CustomEvent('switch-tool'))`
 *    - ควบคุมการเปิด Tab ในสารานุกรมผ่าน: `window.dispatchEvent(new CustomEvent('open-optimization-tab', { detail: tabId }))`
 * 
 * 3. พารามิเตอร์ Input / Output ที่รับส่ง (Inputs, Outputs & Data Contracts):
 *    - Props:
 *      - `activeTool: string`: ID ของเครื่องมือที่กำลังเปิดใช้งาน
 *      - `tools?: any[]`: รายการเครื่องมือทั้งหมดในระบบ (สำหรับดึง Title/Category)
 *      - `onSelectTool?: (toolId: string) => void`: ฟังก์ชันเปลี่ยนหน้าเครื่องมือ
 * 
 * 4. การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 *    - หากไม่มี `activeTool` ส่งเข้ามา จะใช้ Default Context ของ Flagship Architecture
 *    - รองรับการปิด/เปิดหน้าต่างด้วยปุ่มลัด `Alt + O` หรือคลิกที่ปุ่มลอย
 *    - มีระบบบันทึกสถานะการตรึง (Pinned) และสถานะย่อ/ขยายใน `localStorage`
 * 
 * 5. ตัวอย่างการเรียกใช้งาน (Usage Example):
 *    ```tsx
 *    <OptimizationHelperTooltip
 *      activeTool={activeTool}
 *      tools={tools}
 *      onSelectTool={setActiveTool}
 *    />
 *    ```
 * ============================================================================
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Zap,
  BookOpen,
  Sparkles,
  ChevronRight,
  ChevronDown,
  X,
  Pin,
  Search,
  ExternalLink,
  Code2,
  CheckCircle2,
  ShieldAlert,
  Info,
  Maximize2,
  Layers,
  Activity,
  Cpu,
  Flame,
  Volume2,
  Globe,
  Network,
  HardDrive,
  Glasses
} from 'lucide-react';
import {
  getOptimizationAdviceForTool,
  searchOptimizationEncyclopedia,
  ToolOptimizationContext,
  OptimizationSuggestion
} from '../utils/OptimizationEncyclopediaAdvisor';

interface OptimizationHelperTooltipProps {
  activeTool: string;
  tools?: any[];
  onSelectTool?: (toolId: string) => void;
}

export default function OptimizationHelperTooltip({
  activeTool,
  tools = [],
  onSelectTool
}: OptimizationHelperTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(() => {
    return localStorage.getItem('omni_opt_tooltip_pinned') === 'true';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSnippetId, setExpandedSnippetId] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'advice' | 'rules' | 'search'>('advice');
  const panelRef = useRef<HTMLDivElement>(null);

  // ดึงข้อมูลคำแนะนำตาม activeTool
  const adviceContext: ToolOptimizationContext = useMemo(() => {
    return getOptimizationAdviceForTool(activeTool, tools);
  }, [activeTool, tools]);

  // ผลการค้นหาด่วน
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchOptimizationEncyclopedia(searchQuery);
  }, [searchQuery]);

  // บันทึกสถานะ Pin
  useEffect(() => {
    localStorage.setItem('omni_opt_tooltip_pinned', isPinned.toString());
  }, [isPinned]);

  // คีย์ลัด Alt+O เพื่อเปิด/ปิด Tooltip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ฟังก์ชันกระโดดไปยังหน้า OptimizationEncyclopedia เต็มรูปแบบ
  const handleOpenFullEncyclopedia = (tabId?: string) => {
    const targetTab = tabId || adviceContext.primaryTabId;
    localStorage.setItem('omni_opt_active_tab', targetTab);
    
    // ส่ง Custom Event ให้ Encyclopedia เปลี่ยน Tab ทันที
    window.dispatchEvent(new CustomEvent('open-optimization-tab', { detail: targetTab }));

    if (onSelectTool) {
      onSelectTool('OptimizationEncyclopedia');
    } else {
      window.dispatchEvent(new CustomEvent('switch-tool', { detail: 'OptimizationEncyclopedia' }));
    }

    if (!isPinned) {
      setIsOpen(false);
    }
  };

  // ไอคอนหมวดหมู่
  const getTabIcon = (tabId: string) => {
    switch (tabId) {
      case 'audio': return <Volume2 size={14} className="text-[#e3b341]" />;
      case 'graphics': return <Layers size={14} className="text-[#a371f7]" />;
      case 'world': return <Globe size={14} className="text-[#3fb950]" />;
      case 'physics': return <Flame size={14} className="text-[#ff7b72]" />;
      case 'network': return <Network size={14} className="text-[#58a6ff]" />;
      case 'offline_ai': return <Sparkles size={14} className="text-[#bc8cff]" />;
      case 'data': return <HardDrive size={14} className="text-[#39c5bb]" />;
      case 'vr': return <Glasses size={14} className="text-[#79c0ff]" />;
      default: return <Cpu size={14} className="text-[#58a6ff]" />;
    }
  };

  return (
    <>
      {/* Floating Trigger Button / Header Pill Badge */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2 select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl backdrop-blur-md transition-all duration-200 border cursor-pointer shadow-lg ${
            isOpen
              ? 'bg-[#1f242c] border-[#58a6ff] text-white shadow-[#58a6ff]/20'
              : 'bg-[#161b22]/90 hover:bg-[#21262d] border-[#30363d] text-[#c9d1d9] hover:border-[#8b949e]/50'
          }`}
          title="Optimization Advisor (Alt + O)"
        >
          <div className="relative flex items-center justify-center">
            <Zap size={16} className="text-[#e3b341] animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#3fb950]" />
          </div>
          
          <div className="flex flex-col items-start text-left">
            <span className="text-[11px] font-semibold tracking-wide flex items-center gap-1.5 text-white">
              Optimization Advice
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#58a6ff]/15 text-[#58a6ff] border border-[#58a6ff]/30">
                {adviceContext.tabName}
              </span>
            </span>
            <span className="text-[9px] text-[#8b949e] font-mono flex items-center gap-1">
              <span className="text-[#3fb950] font-bold">{adviceContext.primaryMetricHighlight}</span>
              <span>• Alt+O</span>
            </span>
          </div>

          <ChevronRight
            size={14}
            className={`text-[#8b949e] transition-transform duration-200 ${isOpen ? 'rotate-90 text-[#58a6ff]' : ''}`}
          />
        </button>
      </div>

      {/* Floating Popover Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed bottom-20 left-6 z-40 w-[440px] max-w-[calc(100vw-48px)] max-h-[580px] bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#c9d1d9] animate-in fade-in slide-in-from-bottom-3 duration-200 backdrop-blur-xl"
        >
          {/* Header Bar */}
          <div className="p-3.5 bg-[#0d1117] border-b border-[#30363d] flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-[#58a6ff]/10 border border-[#58a6ff]/25 text-[#58a6ff] shrink-0">
                {getTabIcon(adviceContext.primaryTabId)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-white text-[13px] font-bold truncate">
                    Optimization Matrix
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40 font-semibold">
                    {adviceContext.primaryMetricHighlight}
                  </span>
                </div>
                <p className="text-[10px] text-[#8b949e] truncate">
                  Context: <span className="text-[#c9d1d9] font-medium">{adviceContext.toolName}</span>
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsPinned(!isPinned)}
                className={`p-1.5 rounded-md transition-colors ${
                  isPinned ? 'bg-[#58a6ff]/20 text-[#58a6ff]' : 'text-[#8b949e] hover:bg-[#21262d] hover:text-white'
                }`}
                title={isPinned ? 'Unpin Panel' : 'Pin Panel'}
              >
                <Pin size={13} className={isPinned ? 'fill-current' : ''} />
              </button>

              <button
                onClick={() => handleOpenFullEncyclopedia()}
                className="p-1.5 rounded-md text-[#8b949e] hover:bg-[#21262d] hover:text-[#58a6ff] transition-colors"
                title="Open Full Encyclopedia"
              >
                <ExternalLink size={13} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-md text-[#8b949e] hover:bg-[#f85149]/20 hover:text-[#f85149] transition-colors"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Sub Navigation Bar */}
          <div className="flex items-center border-b border-[#30363d] bg-[#161b22] px-3 pt-1 gap-1 shrink-0">
            <button
              onClick={() => setActiveSubTab('advice')}
              className={`px-3 py-1.5 text-[11px] font-medium rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
                activeSubTab === 'advice'
                  ? 'border-[#58a6ff] text-[#58a6ff] bg-[#0d1117]/60'
                  : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              <Sparkles size={12} />
              Suggested Techniques ({adviceContext.suggestions.length})
            </button>

            <button
              onClick={() => setActiveSubTab('rules')}
              className={`px-3 py-1.5 text-[11px] font-medium rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
                activeSubTab === 'rules'
                  ? 'border-[#58a6ff] text-[#58a6ff] bg-[#0d1117]/60'
                  : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              <CheckCircle2 size={12} />
              Golden Rules ({adviceContext.goldenRules.length})
            </button>

            <button
              onClick={() => setActiveSubTab('search')}
              className={`px-3 py-1.5 text-[11px] font-medium rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ml-auto ${
                activeSubTab === 'search'
                  ? 'border-[#58a6ff] text-[#58a6ff] bg-[#0d1117]/60'
                  : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              <Search size={12} />
              Search
            </button>
          </div>

          {/* Core Philosophy Banner */}
          <div className="px-3.5 py-2 bg-[#0d1117]/50 border-b border-[#30363d]/60 text-[10.5px] text-[#8b949e] flex items-start gap-2 shrink-0">
            <Info size={13} className="text-[#58a6ff] shrink-0 mt-0.5" />
            <p className="line-clamp-2 leading-relaxed">
              <strong className="text-white">Core Principle:</strong> {adviceContext.corePhilosophy}
            </p>
          </div>

          {/* Main Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar">
            {activeSubTab === 'advice' && (
              <div className="space-y-3">
                {adviceContext.suggestions.map((suggestion) => {
                  const isSnippetOpen = expandedSnippetId === suggestion.id;
                  return (
                    <div
                      key={suggestion.id}
                      className="p-3 bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff]/40 rounded-xl transition-all group shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="min-w-0">
                          <span className="text-[9px] font-mono text-[#8b949e] uppercase tracking-wider block">
                            {suggestion.category}
                          </span>
                          <h4 className="text-[12px] font-bold text-white group-hover:text-[#58a6ff] transition-colors leading-snug">
                            {suggestion.title}
                          </h4>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#a371f7]/15 text-[#a371f7] border border-[#a371f7]/30 shrink-0">
                          {suggestion.badge}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#8b949e] leading-relaxed mb-2">
                        {suggestion.summary}
                      </p>

                      <div className="p-2 rounded-lg bg-[#161b22] border border-[#30363d]/80 text-[10.5px] text-[#c9d1d9] mb-2 flex items-start gap-1.5">
                        <CheckCircle2 size={12} className="text-[#3fb950] shrink-0 mt-0.5" />
                        <span className="leading-normal">
                          <strong className="text-white">Action:</strong> {suggestion.practicalAction}
                        </span>
                      </div>

                      {/* Code Snippet Toggle */}
                      {suggestion.codeSnippet && (
                        <div className="mt-2">
                          <button
                            onClick={() => setExpandedSnippetId(isSnippetOpen ? null : suggestion.id)}
                            className="flex items-center gap-1.5 text-[10px] text-[#58a6ff] hover:text-[#79c0ff] font-medium py-1"
                          >
                            <Code2 size={12} />
                            <span>{isSnippetOpen ? 'Hide Architecture Snippet' : 'View Code / Formula Snippet'}</span>
                            <ChevronDown
                              size={11}
                              className={`transition-transform ${isSnippetOpen ? 'rotate-180' : ''}`}
                            />
                          </button>

                          {isSnippetOpen && (
                            <div className="mt-1.5 p-2.5 rounded-lg bg-[#010409] border border-[#30363d] overflow-x-auto text-[10px] font-mono text-[#79c0ff] leading-relaxed">
                              <pre>{suggestion.codeSnippet}</pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Jump to this topic */}
                      <div className="mt-2.5 pt-2 border-t border-[#21262d] flex items-center justify-between text-[10px]">
                        <span className="text-[#8b949e]">
                          Impact: <strong className="text-[#3fb950]">{suggestion.metricBenefit}</strong>
                        </span>
                        <button
                          onClick={() => handleOpenFullEncyclopedia(suggestion.tabId)}
                          className="text-[#58a6ff] hover:text-[#79c0ff] font-semibold flex items-center gap-1 group/btn"
                        >
                          Deep Read <ChevronRight size={10} className="group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeSubTab === 'rules' && (
              <div className="space-y-2.5">
                {adviceContext.goldenRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-3 bg-[#0d1117] border border-[#30363d] rounded-xl flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-[12px] font-bold text-white flex items-center gap-1.5">
                        <ShieldAlert
                          size={13}
                          className={
                            rule.impactLevel === 'CRITICAL'
                              ? 'text-[#f85149]'
                              : rule.impactLevel === 'HIGH'
                              ? 'text-[#e3b341]'
                              : 'text-[#58a6ff]'
                          }
                        />
                        {rule.ruleTitle}
                      </h4>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase font-bold ${
                          rule.impactLevel === 'CRITICAL'
                            ? 'bg-[#f85149]/20 text-[#f85149] border border-[#f85149]/40'
                            : rule.impactLevel === 'HIGH'
                            ? 'bg-[#e3b341]/20 text-[#e3b341] border border-[#e3b341]/40'
                            : 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/40'
                        }`}
                      >
                        {rule.impactLevel}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#8b949e] leading-relaxed">
                      {rule.explanation}
                    </p>

                    <div className="text-[10px] text-[#3fb950] font-mono font-medium flex items-center gap-1 mt-0.5">
                      <CheckCircle2 size={11} />
                      Benefit: {rule.benefit}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSubTab === 'search' && (
              <div className="space-y-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-[#8b949e]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search optimization topics (e.g. HRTF, Chunking, VAT, Prediction)..."
                    className="w-full pl-9 pr-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-[11px] text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff]"
                    autoFocus
                  />
                </div>

                {searchQuery.trim() === '' ? (
                  <div className="text-center py-6 text-[#8b949e] text-[11px]">
                    <Search size={24} className="mx-auto mb-2 opacity-40 text-[#58a6ff]" />
                    <p>Enter any keyword to search across the entire Optimization Encyclopedia database.</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-6 text-[#8b949e] text-[11px]">
                    <p>No optimization techniques found matching "{searchQuery}".</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleOpenFullEncyclopedia(item.tabId)}
                        className="p-2.5 bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded-xl transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="text-[11.5px] font-bold text-white group-hover:text-[#58a6ff]">
                            {item.title}
                          </h5>
                          <span className="text-[9px] font-mono text-[#a371f7]">{item.badge}</span>
                        </div>
                        <p className="text-[10.5px] text-[#8b949e] line-clamp-2">{item.summary}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Action Bar */}
          <div className="p-3 bg-[#0d1117] border-t border-[#30363d] flex items-center justify-between shrink-0">
            <div className="text-[10px] text-[#8b949e] flex items-center gap-1">
              <BookOpen size={12} className="text-[#a371f7]" />
              <span>Deep Matrix: <strong>{adviceContext.tabName}</strong></span>
            </div>

            <button
              onClick={() => handleOpenFullEncyclopedia()}
              className="px-3 py-1.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <BookOpen size={12} />
              Open Encyclopedia Tab
            </button>
          </div>
        </div>
      )}
    </>
  );
}
