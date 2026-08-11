import React, { useState, useEffect } from "react";
import { MessageCircle, Bot, X, Grip } from "lucide-react";
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
    return saved ? JSON.parse(saved) : { width: 380, height: 540 };
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
      newWidth = Math.max(300, Math.min(newWidth, window.innerWidth * 0.9));
      newHeight = Math.max(300, Math.min(newHeight, window.innerHeight * 0.8));
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

  return (
    <>
      <button
        onClick={() => setShowGlobalChat(!showGlobalChat)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.5)] flex items-center justify-center transition-transform hover:scale-110 border border-blue-400"
      >
        <MessageCircle size={24} className="text-white" />
      </button>

      {showGlobalChat && (
        <div
          style={{
            width: `${chatSize.width}px`,
            height: `${chatSize.height}px`,
          }}
          className={`fixed bottom-20 right-6 z-50 bg-[#0a0a0f] border ${
            isResizing ? "border-[#58a6ff] shadow-[0_0_20px_rgba(88,166,255,0.2)]" : "border-[#2a2b3d]"
          } rounded-lg shadow-2xl flex flex-col overflow-hidden max-w-[90vw] max-h-[85vh] transition-none`}
        >
          <div
            className="absolute top-0 left-0 w-8 h-8 cursor-nwse-resize z-50 flex items-start justify-start p-1 opacity-50 hover:opacity-100 bg-gradient-to-br from-[#58a6ff]/20 to-transparent rounded-tl-lg"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizing(true);
            }}
            onDoubleClick={() => setChatSize({ width: 380, height: 540 })}
            title="Drag to resize, double-click to reset"
          >
            <Grip size={14} className="text-[#58a6ff] -rotate-45" />
          </div>

          <div className="bg-[#11111b] border-b border-[#2a2b3d] p-2 flex items-center justify-between pl-8 relative z-40 select-none">
            <div className="flex items-center gap-2 text-[13px] font-bold select-none pointer-events-none">
              <Bot size={16} className={`${isResizing ? "text-blue-300" : "text-blue-400"}`} />
              AI Offline Copilot
            </div>
            <button
              onClick={() => setShowGlobalChat(false)}
              className="text-gray-400 hover:text-[#f85149] transition-colors p-1 rounded hover:bg-[#f85149]/10"
              title="Close AI Chat"
            >
              <X size={14} />
            </button>
          </div>

          {isResizing && (
            <div className="absolute inset-0 z-50 cursor-nwse-resize bg-black/5 backdrop-blur-[1px]">
              <div className="absolute bottom-2 left-2 bg-[#0d1117]/80 backdrop-blur-md border border-[#30363d] px-2 py-1 rounded text-[#8b949e] font-mono text-[10px] pointer-events-none shadow-lg">
                {Math.round(chatSize.width)} x {Math.round(chatSize.height)} px
              </div>
            </div>
          )}

          <div className="flex-1 overflow-hidden relative">
            <AIChat
              code={globalCode}
              setCode={setGlobalCode}
              language={globalLanguage}
              setLanguage={setGlobalLanguage}
              activeToolId={activeTool}
              activeToolName={tools.find((t) => t.id === activeTool)?.title}
              activeToolCategory={tools.find((t) => t.id === activeTool)?.category}
            />
          </div>
        </div>
      )}
    </>
  );
}
