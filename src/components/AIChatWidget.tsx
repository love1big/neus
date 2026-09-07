/**
 * @file AIChatWidget.tsx
 * @description
 * ============================================================================
 * [THAI]
 * วิดเจ็ตผู้ช่วย AI ออฟไลน์แบบลอยตัว (Floating AI Offline Copilot Widget)
 * รองรับการลากปรับขนาด (Resize NW), ปิด/เปิดด้วยปุ่มลัด, และคุยโต้ตอบกับ AI
 * โดยทำงานร่วมกับเครื่องมือที่กำลังเปิดใช้งานอยู่ในปัจจุบัน
 * 
 * [ENGLISH]
 * Floating Offline AI Copilot Assistant Widget.
 * Features draggable NW resize handles, persistence to localStorage, and
 * deep context linking to the currently active Studio workspace.
 * ============================================================================
 */

import React, { useState, useEffect } from "react";
import { MessageCircle, Bot, X, Grip, Sparkles, MoveDiagonal } from "lucide-react";
import AIChat from "./AIChat";
import { LanguageCode } from "../contexts/LanguageContext";

interface AIChatWidgetProps {
  activeTool: string;
  tools: any[];
}

export default function AIChatWidget({ activeTool, tools }: AIChatWidgetProps) {
  const [showGlobalChat, setShowGlobalChat] = useState(false);
  const [globalCode, setGlobalCode] = useState("");
  const [globalLanguage, setGlobalLanguage] = useState<LanguageCode>("cpp" as any);
  const [chatSize, setChatSize] = useState(() => {
    const saved = localStorage.getItem("omni_chatSize");
    return saved ? JSON.parse(saved) : { width: 400, height: 560 };
  });
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    localStorage.setItem("omni_showGlobalChat", showGlobalChat.toString());
  }, [showGlobalChat]);

  useEffect(() => {
    localStorage.setItem("omni_chatSize", JSON.stringify(chatSize));
  }, [chatSize]);

  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      let newWidth = window.innerWidth - e.clientX - 24;
      let newHeight = window.innerHeight - e.clientY - 80;
      newWidth = Math.max(320, Math.min(newWidth, window.innerWidth * 0.9));
      newHeight = Math.max(340, Math.min(newHeight, window.innerHeight * 0.85));
      setChatSize({ width: newWidth, height: newHeight });
    };
    const handleMouseUp = () => setIsResizing(false);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const activeToolObj = tools.find((t) => t.id === activeTool);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setShowGlobalChat(!showGlobalChat)}
        className="fixed bottom-6 right-6 z-50 w-13 h-13 rounded-2xl bg-gradient-to-br from-[#38bdf8] to-[#6366f1] hover:from-[#7dd3fc] hover:to-[#818cf8] shadow-[0_0_25px_rgba(56,189,248,0.45)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/20 group cursor-pointer"
        title="Toggle AI Offline Copilot"
      >
        <div className="relative">
          <Bot size={24} className="text-black" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-black animate-pulse" />
        </div>
      </button>

      {/* Floating Chat Modal Window */}
      {showGlobalChat && (
        <div
          style={{
            width: `${chatSize.width}px`,
            height: `${chatSize.height}px`,
          }}
          className={`fixed bottom-22 right-6 z-50 bg-[#0d1117] border ${
            isResizing ? "border-[#38bdf8] shadow-[0_0_30px_rgba(56,189,248,0.3)]" : "border-[#30363d]"
          } rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden max-w-[90vw] max-h-[85vh] transition-none`}
        >
          {/* Top-Left Resize Grip Handle */}
          <div
            className="absolute top-0 left-0 w-8 h-8 cursor-nwse-resize z-50 flex items-start justify-start p-1.5 opacity-60 hover:opacity-100 bg-gradient-to-br from-[#38bdf8]/30 to-transparent rounded-tl-2xl"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizing(true);
            }}
            onDoubleClick={() => setChatSize({ width: 400, height: 560 })}
            title="Drag to resize NW, double-click to reset"
          >
            <MoveDiagonal size={12} className="text-[#38bdf8] -rotate-45" />
          </div>

          {/* Window Header */}
          <div className="bg-[#161b22] border-b border-[#21262d] py-2.5 px-3 flex items-center justify-between pl-8 relative z-40 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center">
                <Bot size={14} className="text-[#38bdf8]" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  AI Offline Copilot
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    Qwen 2.5 Free
                  </span>
                </div>
                {activeToolObj && (
                  <div className="text-[10px] text-[#8b949e] font-mono truncate max-w-[200px]">
                    Target: {activeToolObj.title || activeToolObj.id}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowGlobalChat(false)}
              className="text-[#8b949e] hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-[#21262d]"
              title="Close Copilot"
            >
              <X size={15} />
            </button>
          </div>

          {/* Resize Live Indicator Overlay */}
          {isResizing && (
            <div className="absolute inset-0 z-50 cursor-nwse-resize bg-black/10 backdrop-blur-[1px] pointer-events-none flex items-center justify-center">
              <div className="bg-[#161b22]/90 backdrop-blur-md border border-[#38bdf8] px-3 py-1.5 rounded-xl text-white font-mono text-xs shadow-2xl">
                {Math.round(chatSize.width)} x {Math.round(chatSize.height)} px
              </div>
            </div>
          )}

          {/* Chat Body */}
          <div className="flex-1 overflow-hidden relative bg-[#07090e]">
            <AIChat
              code={globalCode}
              setCode={setGlobalCode}
              language={globalLanguage}
              setLanguage={setGlobalLanguage}
              activeToolId={activeTool}
              activeToolName={activeToolObj?.title}
              activeToolCategory={activeToolObj?.category}
            />
          </div>
        </div>
      )}
    </>
  );
}
