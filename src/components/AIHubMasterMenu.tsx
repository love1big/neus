/**
 * @file AIHubMasterMenu.tsx
 * @description
 * ============================================================================
 * [THAI]
 * ฮับควบคุม AI และระบบปัญญาประดิษฐ์ออฟไลน์รวมศูนย์ (Nexus AI Hub Master Studio)
 * รองรับการค้นหาและเข้าถึง 16 โมดูล AI ออฟไลน์ระดับลึก เช่น Error-Immunity Continuous Memory,
 * Omni 335+ Mega Engine, 50x Offline AI Suite, Deterministic Non-AI Engineering,
 * AI Swarm Command Center, และ Local GGUF LLM Manager
 * 
 * [ENGLISH]
 * Enterprise Offline AI Hub Master Workstation.
 * Direct search & navigation across 16 deep offline AI architectures, LLM models,
 * continuous error learning neural memory, and deterministic engineering toolchains.
 * ============================================================================
 */

import React, { useState, useMemo } from "react";
import { 
  Bot, Cpu, Brain, Waypoints, Cloud, Network, TerminalSquare, Sparkles, Zap, 
  Activity, Layers, Server, HardDrive, Search, ShieldCheck, CheckCircle2, ChevronRight, X
} from "lucide-react";

import AIOfflineDownloader from "./AIOfflineDownloader";
import AIOfflineMapGenerator from "./AIOfflineMapGenerator";
import AIOfflineModelGenerator from "./AIOfflineModelGenerator";
import AIOfflineUIUXGenerator from "./AIOfflineUIUXGenerator";
import AIOfflineImageGenerator from "./AIOfflineImageGenerator";
import AICommandCenter from "./AICommandCenter";
import LocalAIStudio from "./LocalAIStudio";
import OmniAIAssistantStudio from "./OmniAIAssistantStudio";
import AIWorkflowEditor from "./AIWorkflowEditor";
import BatchAIImporter from "./BatchAIImporter";
import OmniVisualScriptingEngine from "./OmniVisualScriptingEngine";
import UltimateOfflineAIStudio from "./UltimateOfflineAIStudio";
import OfflineAIEngineSuite from "./OfflineAIEngineSuite";
import DeterministicEngineeringSuite from "./DeterministicEngineeringSuite";
import OmniMegaEngine300Studio from "./OmniMegaEngine300Studio";
import OfflineAIContinuousErrorLearningStudio from "./OfflineAIContinuousErrorLearningStudio";

export default function AIHubMasterMenu({ initialTab }: { initialTab?: string } = {}) {
  const [activeSubTab, setActiveSubTab] = useState<string>(
    initialTab && initialTab !== "AIHubMaster" ? initialTab : "OmniMegaEngine300Studio"
  );
  const [searchFilter, setSearchFilter] = useState<string>("");

  React.useEffect(() => {
    if (initialTab && initialTab !== "AIHubMaster") {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);

  const aiSubMenus = [
    {
      id: "OfflineAIContinuousErrorLearningStudio",
      title: "AI Error-Immunity & Neural Memory",
      desc: "ระบบ AI ออฟไลน์เรียนรู้ จดจำ และสร้างภูมิคุ้มกันป้องกันการทำข้อผิดพลาด/บัคซ้ำ 100% ตลอดชีพ",
      icon: <Brain size={18} className="text-[#34d399]" />,
      badge: "ZERO-REPEAT",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
    },
    {
      id: "OmniMegaEngine300Studio",
      title: "Omni 335+ Mega Engine & AI Suite",
      desc: "สุดยอดคลังวิศวกรรมเกมและ AI ออฟไลน์ 335 ระบบ แยกตาม 12 หมวดหมู่วิศวกรรมระดับ AAA",
      icon: <Cpu size={18} className="text-[#38bdf8]" />,
      badge: "335 AAA TOOLS",
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/30"
    },
    {
      id: "OfflineAIEngineSuite",
      title: "50x Offline AI & Neural Intelligence",
      desc: "ชุดเครื่องมือ AI ออฟไลน์ 50 ชนิด: Local LLM, WebGPU Shaders, Vision AI, GOAP, Vector RAG",
      icon: <Brain size={18} className="text-[#c084fc]" />,
      badge: "50 OFFLINE AI",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30"
    },
    {
      id: "DeterministicEngineeringSuite",
      title: "50x Deterministic Non-AI Engineering",
      desc: "ชุดเครื่องมือวิศวกรรม 100% Non-AI 50 ชนิด: ฟิสิกส์ เรขาคณิต ออปติก DSP และ Byte Math",
      icon: <Cpu size={18} className="text-[#60a5fa]" />,
      badge: "50 NON-AI",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30"
    },
    {
      id: "AICommandCenter",
      title: "AI Swarm Command Center",
      desc: "สั่งการคัสเตอร์ประมวลผลเครือข่าย AI Swarm แบบกระจายศูนย์",
      icon: <Bot size={18} className="text-[#f87171]" />,
      badge: "ACTIVE SWARM",
      badgeColor: "bg-red-500/10 text-red-400 border-red-500/30"
    },
    {
      id: "UltimateOfflineAIStudio",
      title: "Ultimate Offline AI & Synthetic Imagination",
      desc: "เครื่องยนต์จำลองโลกเสมือนจริงและปัญญาประดิษฐ์ออฟไลน์ระดับลึก",
      icon: <Bot size={18} className="text-[#e879f9]" />,
      badge: "ULTRA ENGINE",
      badgeColor: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30"
    },
    {
      id: "AIOfflineDownloader",
      title: "Offline AI Hub (100% On-Device)",
      desc: "ดาวน์โหลดและจัดการโมเดล LLM รันบนอุปกรณ์ไม่ง้ออินเทอร์เน็ต",
      icon: <Cpu size={18} className="text-[#34d399]" />,
      badge: "LOCAL GGUF",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
    },
    {
      id: "LocalAIStudio",
      title: "Neural Engine & TFLOPS Manager",
      desc: "จัดสรรพลังประมวลผล Tensor Core, NPU และ GPU Acceleration",
      icon: <Brain size={18} className="text-[#c084fc]" />,
      badge: "ACCELERATED",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30"
    },
    {
      id: "OmniAIAssistantStudio",
      title: "AI Copilot & Code Generator",
      desc: "ผู้ช่วยเขียนโค้ดอัตโนมัติ วิเคราะห์บั๊ก และสร้างระบบตามคำสั่ง",
      icon: <Sparkles size={18} className="text-[#fbbf24]" />,
      badge: "DEEP THINK",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30"
    },
    {
      id: "Workflow",
      title: "AI Node Graph Pipelines",
      desc: "ออกแบบเวิร์กโฟลว์ AI แบบลากวาง เชื่อมต่อโมเดลหลายตัวเข้าด้วยกัน",
      icon: <Waypoints size={18} className="text-[#38bdf8]" />,
      badge: "PIPELINE",
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/30"
    },
    {
      id: "BatchAIImporter",
      title: "Batch AI Asset & RAG Knowledge",
      desc: "นำเข้าคลังความรู้ คลังข้อมูล และเวกเตอร์ฐานข้อมูลปริมาณมหาศาล",
      icon: <Cloud size={18} className="text-[#34d399]" />,
      badge: "MASSIVE RAG",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
    },
    {
      id: "OmniVisualScripting",
      title: "Visual AI Behavior Workflow",
      desc: "สร้างพฤติกรรม AI ในเกมด้วย Visual Scripting ไม่ต้องเขียนโค้ด",
      icon: <Network size={18} className="text-[#f87171]" />,
      badge: "BEHAVIOR TREE",
      badgeColor: "bg-red-500/10 text-red-400 border-red-500/30"
    },
    {
      id: "AIOfflineMapGenerator",
      title: "Offline AI Map Generator",
      desc: "สร้างแผนที่ ระดับเมือง และภูมิประเทศ 3 มิติแบบออฟไลน์",
      icon: <Network size={18} className="text-[#34d399]" />,
      badge: "MAP GEN",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
    },
    {
      id: "AIOfflineModelGenerator",
      title: "Offline AI 3D Model Generator",
      desc: "สร้างโมเดล 3 มิติจากข้อความโดยไม่ใช้อินเทอร์เน็ต",
      icon: <Cpu size={18} className="text-[#fbbf24]" />,
      badge: "3D ASSETS",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30"
    },
    {
      id: "AIOfflineUIUXGenerator",
      title: "Offline AI UI/UX Studio",
      desc: "ออกแบบ UI/UX สำหรับเกมหรือเว็บ และเจนโค้ด Frontend อัตโนมัติ",
      icon: <TerminalSquare size={18} className="text-[#38bdf8]" />,
      badge: "UI/UX",
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/30"
    },
    {
      id: "AIOfflineImageGenerator",
      title: "Offline AI Concept Art & Diffusion",
      desc: "เจนรูปภาพ คอนเซปต์อาร์ต หรือเทกซ์เจอร์ด้วย Local Diffusion",
      icon: <Sparkles size={18} className="text-[#c084fc]" />,
      badge: "IMAGE GEN",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30"
    }
  ];

  const filteredMenus = useMemo(() => {
    if (!searchFilter.trim()) return aiSubMenus;
    const q = searchFilter.toLowerCase();
    return aiSubMenus.filter(m => 
      m.title.toLowerCase().includes(q) || 
      m.desc.toLowerCase().includes(q) ||
      m.badge.toLowerCase().includes(q)
    );
  }, [searchFilter]);

  const renderActiveSubContent = () => {
    switch (activeSubTab) {
      case "OfflineAIContinuousErrorLearningStudio":
        return <OfflineAIContinuousErrorLearningStudio />;
      case "OmniMegaEngine300Studio":
        return <OmniMegaEngine300Studio />;
      case "OfflineAIEngineSuite":
        return <OfflineAIEngineSuite />;
      case "DeterministicEngineeringSuite":
        return <DeterministicEngineeringSuite />;
      case "AICommandCenter":
        return <AICommandCenter />;
      case "UltimateOfflineAIStudio":
        return <UltimateOfflineAIStudio />;
      case "AIOfflineDownloader":
        return <AIOfflineDownloader />;
      case "LocalAIStudio":
        return <LocalAIStudio />;
      case "OmniAIAssistantStudio":
        return <OmniAIAssistantStudio />;
      case "Workflow":
        return <AIWorkflowEditor />;
      case "BatchAIImporter":
        return <BatchAIImporter />;
      case "OmniVisualScripting":
        return <OmniVisualScriptingEngine />;
      case "AIOfflineMapGenerator":
        return <AIOfflineMapGenerator />;
      case "AIOfflineModelGenerator":
        return <AIOfflineModelGenerator />;
      case "AIOfflineUIUXGenerator":
        return <AIOfflineUIUXGenerator />;
      case "AIOfflineImageGenerator":
        return <AIOfflineImageGenerator />;
      default:
        return <AICommandCenter />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#07090e] text-white overflow-hidden font-sans">
      {/* Top Bar Header */}
      <div className="h-14 bg-[#0d1117] border-b border-[#21262d] px-5 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.35)]">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wide text-white flex items-center gap-2">
              NEXUS AI HUB MASTER STUDIO
              <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/40 text-[#c084fc] text-[9px] rounded font-mono font-bold">
                SWARM v5.4 ULTRA
              </span>
            </h1>
            <p className="text-[10px] text-[#8b949e]">ศูนย์รวมระบบปัญญาประดิษฐ์ โมเดลออฟไลน์ และเครือข่ายประมวลผลกระจายศูนย์ทั้งหมด</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#161b22] border border-[#21262d] rounded-lg text-[#34d399]">
            <Activity size={13} className="animate-pulse" />
            <span className="text-[11px] font-bold">SWARM CLUSTER: 100% ONLINE</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#161b22] border border-[#21262d] rounded-lg text-[#38bdf8]">
            <Zap size={13} />
            <span className="text-[11px] font-bold">ON-DEVICE NPU: READY</span>
          </div>
        </div>
      </div>

      {/* Main Container with Sub-navigation Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left AI Menu Sidebar */}
        <div className="w-[310px] bg-[#0d1117] border-r border-[#21262d] flex flex-col p-3 gap-2 overflow-hidden shrink-0">
          
          {/* Search Filter */}
          <div className="relative mb-1">
            <Search size={13} className="absolute left-3 top-2.5 text-[#8b949e]" />
            <input 
              type="text"
              placeholder="Filter AI modules..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-[#161b22] border border-[#21262d] rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-[#8b949e] outline-none focus:border-[#38bdf8] transition-colors"
            />
            {searchFilter && (
              <button 
                onClick={() => setSearchFilter("")}
                className="absolute right-2.5 top-2.5 text-[#8b949e] hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-[#8b949e] uppercase flex items-center justify-between">
            <span className="flex items-center gap-1.5"><Layers size={11} /> AI & NEURAL MODULES</span>
            <span className="font-mono text-[#38bdf8]">{filteredMenus.length} / {aiSubMenus.length}</span>
          </div>

          {/* Submenu List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1.5 pr-1">
            {filteredMenus.map((menu) => {
              const isActive = activeSubTab === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => setActiveSubTab(menu.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1.5 relative overflow-hidden group ${
                    isActive
                      ? "bg-[#161b22] border-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.12)]"
                      : "bg-[#131722]/80 border-[#21262d] hover:bg-[#161b22] hover:border-[#30363d]"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#38bdf8] to-[#a855f7]" />
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`p-1.5 rounded-lg bg-[#0d1117] border border-[#21262d] shrink-0 ${isActive ? "scale-105" : "opacity-85"} transition-transform`}>
                        {menu.icon}
                      </div>
                      <span className={`text-xs font-bold truncate ${isActive ? "text-white" : "text-[#c9d1d9] group-hover:text-white"}`}>
                        {menu.title}
                      </span>
                    </div>

                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md font-bold border shrink-0 ${menu.badgeColor}`}>
                      {menu.badge}
                    </span>
                  </div>

                  <p className="text-[10px] text-[#8b949e] leading-snug pl-7 line-clamp-2">
                    {menu.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Bottom Mesh Status */}
          <div className="mt-auto p-3 bg-[#131722] rounded-xl border border-[#21262d] flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#8b949e] flex items-center gap-1.5">
                <Server size={11} className="text-[#34d399]" /> LOCAL MESH
              </span>
              <span className="text-[#34d399] font-bold">CONNECTED (0ms)</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#8b949e] flex items-center gap-1.5">
                <HardDrive size={11} className="text-[#38bdf8]" /> GGUF STORAGE
              </span>
              <span className="text-white font-bold">128.4 GB FREE</span>
            </div>
          </div>
        </div>

        {/* Right Active AI Component Render Viewport */}
        <div className="flex-1 min-w-0 bg-[#07090e] overflow-hidden flex flex-col relative">
          {renderActiveSubContent()}
        </div>
      </div>
    </div>
  );
}
