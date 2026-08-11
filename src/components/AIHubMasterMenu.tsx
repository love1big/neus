import React, { useState } from "react";
import { 
  Bot, Cpu, Brain, Waypoints, Cloud, Network, TerminalSquare, Sparkles, Zap, Activity, Layers, Server, HardDrive} from "lucide-react";

import AIOfflineDownloader from "./AIOfflineDownloader";
import AICommandCenter from "./AICommandCenter";
import LocalAIStudio from "./LocalAIStudio";
import OmniAIAssistantStudio from "./OmniAIAssistantStudio";
import AIWorkflowEditor from "./AIWorkflowEditor";
import BatchAIImporter from "./BatchAIImporter";
import OmniVisualScriptingEngine from "./OmniVisualScriptingEngine";
import UltimateOfflineAIStudio from "./UltimateOfflineAIStudio";

export default function AIHubMasterMenu({ initialTab }: { initialTab?: string } = {}) {
  const [activeSubTab, setActiveSubTab] = useState<string>(
    initialTab && initialTab !== "AIHubMaster" ? initialTab : "AICommandCenter"
  );

  React.useEffect(() => {
    if (initialTab && initialTab !== "AIHubMaster") {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);

  const aiSubMenus = [
    {
      id: "AICommandCenter",
      title: "AI Swarm Command Center",
      desc: "สั่งการคัสเตอร์ประมวลผลเครือข่าย AI Swarm แบบกระจายศูนย์",
      icon: <Bot size={18} className="text-[#f85149]" />,
      badge: "ACTIVE SWARM"
    },
    {
      id: "UltimateOfflineAIStudio",
      title: "Ultimate Offline AI & Synthetic Imagination",
      desc: "เครื่องยนต์จำลองโลกเสมือนจริงและปัญญาประดิษฐ์ออฟไลน์ระดับลึก",
      icon: <Bot size={18} className="text-[#d2a8ff]" />,
      badge: "ULTRA ENGINE"
    },
    {
      id: "AIOfflineDownloader",
      title: "Offline AI Hub (100% On-Device)",
      desc: "ดาวน์โหลดและจัดการโมเดล LLM รันบนอุปกรณ์ไม่ง้ออินเทอร์เน็ต",
      icon: <Cpu size={18} className="text-[#3fb950]" />,
      badge: "LOCAL GGUF"
    },
    {
      id: "LocalAIStudio",
      title: "Neural Engine & TFLOPS Manager",
      desc: "จัดสรรพลังประมวลผล Tensor Core, NPU และ GPU Acceleration",
      icon: <Brain size={18} className="text-[#bc8cff]" />,
      badge: "ACCELERATED"
    },
    {
      id: "OmniAIAssistantStudio",
      title: "AI Copilot & Code Generator",
      desc: "ผู้ช่วยเขียนโค้ดอัตโนมัติ วิเคราะห์บั๊ก และสร้างระบบตามคำสั่ง",
      icon: <Sparkles size={18} className="text-[#e3b341]" />,
      badge: "DEEP THINK"
    },
    {
      id: "Workflow",
      title: "AI Node Graph Pipelines",
      desc: "ออกแบบเวิร์กโฟลว์ AI แบบลากวาง เชื่อมต่อโมเดลหลายตัวเข้าด้วยกัน",
      icon: <Waypoints size={18} className="text-[#58a6ff]" />,
      badge: "PIPELINE"
    },
    {
      id: "BatchAIImporter",
      title: "Batch AI Asset & RAG Knowledge",
      desc: "นำเข้าคลังความรู้ คลังข้อมูล และเวกเตอร์ฐานข้อมูลปริมาณมหาศาล",
      icon: <Cloud size={18} className="text-[#3fb950]" />,
      badge: "MASSIVE RAG"
    },
    {
      id: "OmniVisualScripting",
      title: "Visual AI Behavior Workflow",
      desc: "สร้างพฤติกรรม AI ในเกมด้วย Visual Scripting ไม่ต้องเขียนโค้ด",
      icon: <Network size={18} className="text-[#ff7b72]" />,
      badge: "BEHAVIOR TREE"
    }
  ];

  const renderActiveSubContent = () => {
    switch (activeSubTab) {
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
      default:
        return <AICommandCenter />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white overflow-hidden">
      {/* Top Bar Header */}
      <div className="h-14 bg-[#161b22] border-b border-[#30363d] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-600/30 to-red-600/30 border border-purple-500/50 rounded-lg">
            <Bot className="text-[#bc8cff]" size={22} />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wide text-white flex items-center gap-2">
              NEXUS AI HUB MASTER STUDIO
              <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/40 text-[#bc8cff] text-[10px] rounded font-mono font-bold">
                SWARM v4.8 ULTRA
              </span>
            </h1>
            <p className="text-[11px] text-[#8b949e]">ศูนย์รวมระบบปัญญาประดิษฐ์ โมเดลออฟไลน์ และเครือข่ายประมวลผลกระจายศูนย์ทั้งหมด</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0d1117] border border-[#30363d] rounded-md text-[#3fb950]">
            <Activity size={14} className="animate-pulse" />
            <span>SWARM CLUSTER: 100% ONLINE</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0d1117] border border-[#30363d] rounded-md text-[#bc8cff]">
            <Zap size={14} />
            <span>ON-DEVICE TFLOPS: READY</span>
          </div>
        </div>
      </div>

      {/* Main Container with Sub-navigation Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left AI Menu Sidebar */}
        <div className="w-[300px] bg-[#161b22]/70 border-r border-[#30363d] flex flex-col p-3 gap-2 overflow-y-auto custom-scrollbar shrink-0">
          <div className="px-2 py-1 text-[11px] font-bold tracking-wider text-[#8b949e] uppercase flex items-center gap-2">
            <Layers size={12} /> AI & NEURAL MODULES ({aiSubMenus.length})
          </div>

          <div className="flex flex-col gap-1.5 mt-1">
            {aiSubMenus.map((menu) => {
              const isActive = activeSubTab === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => setActiveSubTab(menu.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex flex-col gap-1.5 relative overflow-hidden group ${
                    isActive
                      ? "bg-[#21262d] border-[#bc8cff] shadow-[0_0_15px_rgba(188,140,255,0.15)]"
                      : "bg-[#0d1117]/60 border-[#30363d]/80 hover:bg-[#161b22] hover:border-[#8b949e]/50"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-red-500" />
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded bg-[#0d1117] border border-[#30363d] ${isActive ? "scale-110" : "opacity-80"} transition-transform`}>
                        {menu.icon}
                      </div>
                      <span className={`text-[13px] font-bold ${isActive ? "text-white" : "text-[#c9d1d9] group-hover:text-white"}`}>
                        {menu.title}
                      </span>
                    </div>

                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isActive 
                        ? "bg-purple-500/20 text-[#bc8cff] border border-purple-500/40" 
                        : "bg-[#21262d] text-[#8b949e]"
                    }`}>
                      {menu.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#8b949e] leading-relaxed pl-8 line-clamp-2">
                    {menu.desc}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-auto p-3 bg-[#0d1117] rounded-lg border border-[#30363d]/60 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#8b949e] flex items-center gap-1.5">
                <Server size={12} className="text-[#3fb950]" /> LOCAL MESH
              </span>
              <span className="text-[#3fb950] font-bold">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#8b949e] flex items-center gap-1.5">
                <HardDrive size={12} className="text-[#58a6ff]" /> GGUF STORAGE
              </span>
              <span className="text-white font-bold">128.4 GB</span>
            </div>
          </div>
        </div>

        {/* Right Active AI Component Render Viewport */}
        <div className="flex-1 min-w-0 bg-[#0a0c10] overflow-hidden flex flex-col relative">
          {renderActiveSubContent()}
        </div>
      </div>
    </div>
  );
}
