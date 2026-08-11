import React, { useState, useEffect } from "react";
import { Settings, PlayCircle, ChevronRight, Activity, Layers, Cloud, Terminal, Move3d, Maximize2 } from "lucide-react";

interface UnifiedHubWorkspaceProps {
  hub: any;
  renderSubTool: (subToolId: string) => React.ReactNode;
}

export default function UnifiedHubWorkspace({ hub, renderSubTool }: UnifiedHubWorkspaceProps) {
  const [activeTab, setActiveTab] = useState(hub?.subTools?.[0]?.id);

  // When hub changes, reset the active tab to the first subtool of the new hub
  useEffect(() => {
    if (hub?.subTools?.length > 0) {
      setActiveTab(hub.subTools[0].id);
    }
  }, [hub]);

  if (!hub || !hub.subTools) return null;

  return (
    <div className="w-full h-full bg-[#0a0a0f] flex flex-col font-sans text-white overflow-hidden">
      {/* Top Header / Tab Bar */}
      <div className="h-12 bg-[#11111b] border-b border-[#2a2b3d] flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-3 text-lg font-bold">
          <span className={hub.activeColor}>{hub.icon}</span>
          <span className="tracking-wide text-gray-200">{hub.title}</span>
        </div>
        <div className="flex gap-1 overflow-x-auto custom-scrollbar">
          {hub.subTools.map((sub: any) => (
            <button
              key={sub.id}
              onClick={() => setActiveTab(sub.id)}
              className={`px-4 py-2 flex items-center gap-2 text-[12px] font-bold rounded-t-lg transition-colors border-b-2 ${
                activeTab === sub.id
                  ? "border-[#58a6ff] bg-[#1a1b2e] text-[#58a6ff]"
                  : "border-transparent text-gray-400 hover:text-white hover:bg-[#2a2b3d]/50"
              }`}
            >
              {sub.icon}
              {sub.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#101015] relative overflow-hidden">
         {renderSubTool(activeTab)}
      </div>
    </div>
  );
}
