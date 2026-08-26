/**
 * @file UnifiedHubWorkspace.tsx
 * @description
 * ============================================================================
 * [THAI]
 * คอมโพเนนต์พื้นที่ทำงานรวมศูนย์ (Unified Hub Workspace) พร้อมแถบด้านข้าง (Sidebar)
 * มีแท็บ 'Sub-Tools' และแท็บ 'Recent' สำหรับเข้าถึงไฟล์, เครื่องมือ, และแอสเซทที่เปิดล่าสุด (10 รายการ)
 * พร้อมระบบติดตามประวัติอัตโนมัติ (RecentFilesTracker) และบันทึกลงใน localStorage
 * 
 * [ENGLISH]
 * Enterprise Unified Hub Workspace for OmniEngine IDE with Integrated Sidebar.
 * Features dual sidebar navigation tabs:
 *   1. 'Sub-Tools' — Sub-modules for the currently active Hub.
 *   2. 'Recent' — Live Recent Files & Assets panel displaying the last 10 touched items.
 * Integrates automatic tracking into RecentFilesTracker and localStorage.
 * ============================================================================
 * 
 * 1. MODULE RESPONSIBILITY & PURPOSE:
 *    - Hosts and coordinates sub-tools belonging to a specific engine category/hub.
 *    - Provides a dedicated 'Recent' tab in the workspace sidebar to browse and launch recent files.
 *    - Automatically registers visited modules and assets into persistent recent history.
 * 
 * 2. ARCHITECTURE & SYSTEM INTEGRATION:
 *    - Integrates with: RecentFilesTracker.ts, RecentFilesSidebarPanel.tsx, App.tsx.
 *    - Listens for tool-switch and asset-open events.
 * 
 * 3. DATA CONTRACTS:
 *    - Props:
 *        - hub: Hub configuration object containing id, title, icon, activeColor, subTools[]
 *        - renderSubTool: (subToolId: string) => React.ReactNode
 * 
 * 4. ERROR HANDLING & FALLBACKS:
 *    - Handles null/undefined hubs gracefully.
 *    - Fallback default activeTab to first subtool or omni default.
 * 
 * 5. USAGE EXAMPLE:
 *    ```tsx
 *    <UnifiedHubWorkspace hub={currentHub} renderSubTool={renderSubTool} />
 *    ```
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  Settings,
  PlayCircle,
  ChevronRight,
  Activity,
  Layers,
  Cloud,
  Terminal,
  Move3d,
  Maximize2,
  Clock,
  LayoutGrid,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sparkles,
  Zap,
  FolderTree,
  X
} from "lucide-react";
import RecentFilesSidebarPanel from "./RecentFilesSidebarPanel";
import { RecentFilesTracker } from "../utils/RecentFilesTracker";

interface UnifiedHubWorkspaceProps {
  hub: any;
  renderSubTool: (subToolId: string) => React.ReactNode;
}

export default function UnifiedHubWorkspace({ hub, renderSubTool }: UnifiedHubWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<string>(hub?.subTools?.[0]?.id || "");
  const [sidebarTab, setSidebarTab] = useState<'subtools' | 'recent'>('subtools');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem("omni_hub_sidebar_open");
    return saved !== null ? saved === "true" : true;
  });
  const [subToolFilter, setSubToolFilter] = useState<string>("");
  const [recentCount, setRecentCount] = useState<number>(0);

  // Subscribe to recent files count badge
  useEffect(() => {
    const unsubscribe = RecentFilesTracker.subscribe((items) => {
      setRecentCount(items.length);
    });
    return () => unsubscribe();
  }, []);

  // Save sidebar open state
  useEffect(() => {
    localStorage.setItem("omni_hub_sidebar_open", String(isSidebarOpen));
  }, [isSidebarOpen]);

  // When hub changes, reset the active tab to the first subtool of the new hub
  useEffect(() => {
    if (hub?.subTools?.length > 0) {
      const firstId = hub.subTools[0].id;
      setActiveTab(firstId);
      trackSubTool(hub.subTools[0]);
    }
  }, [hub]);

  // Helper to record subtool access into RecentFilesTracker
  const trackSubTool = (subTool: any) => {
    if (!subTool) return;
    RecentFilesTracker.trackOpenedItem({
      id: subTool.id,
      name: subTool.title || subTool.id,
      type: 'subtool',
      category: hub?.category || hub?.title || '🌟 CORE',
      hubId: hub?.id,
      path: `/${hub?.id || 'Hub'}/${subTool.id}`,
      description: `${hub?.title || 'Hub'} • ${subTool.title || subTool.id}`
    });
  };

  const handleSelectSubTool = (subId: string) => {
    setActiveTab(subId);
    const subObj = hub?.subTools?.find((s: any) => s.id === subId);
    if (subObj) {
      trackSubTool(subObj);
    } else {
      // If it came from recent panel and belongs to another module
      RecentFilesTracker.trackOpenedItem({
        id: subId,
        name: subId,
        type: 'component',
        category: '🌟 CORE'
      });
    }
  };

  // Filtered subtools for sidebar
  const filteredSubTools = useMemo(() => {
    if (!hub?.subTools) return [];
    if (!subToolFilter.trim()) return hub.subTools;
    const query = subToolFilter.toLowerCase();
    return hub.subTools.filter((s: any) =>
      s.title?.toLowerCase().includes(query) || s.id?.toLowerCase().includes(query)
    );
  }, [hub?.subTools, subToolFilter]);

  if (!hub || !hub.subTools) return null;

  return (
    <div className="w-full h-full bg-[#0a0a0f] flex flex-col font-sans text-white overflow-hidden">
      {/* Top Header / Tab Bar */}
      <div className="h-12 bg-[#11111b] border-b border-[#2a2b3d] flex items-center px-3 justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          {/* Sidebar toggle button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar (Sub-Tools & Recent Files)"}
          >
            {isSidebarOpen ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
          </button>

          <div className="flex items-center gap-2 text-sm font-bold">
            <span className={hub.activeColor}>{hub.icon}</span>
            <span className="tracking-wide text-gray-200">{hub.title}</span>
          </div>
        </div>

        {/* Horizontal Quick-Tabs */}
        <div className="flex gap-1 overflow-x-auto custom-scrollbar max-w-[65vw]">
          {hub.subTools.map((sub: any) => (
            <button
              key={sub.id}
              onClick={() => handleSelectSubTool(sub.id)}
              className={`px-3 py-1.5 flex items-center gap-2 text-xs font-bold rounded-t-md transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === sub.id
                  ? "border-[#58a6ff] bg-[#1a1b2e] text-[#58a6ff]"
                  : "border-transparent text-gray-400 hover:text-white hover:bg-[#2a2b3d]/50"
              }`}
            >
              {sub.icon}
              <span>{sub.title}</span>
            </button>
          ))}
        </div>

        {/* Right Sidebar Quick Switcher Pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setIsSidebarOpen(true);
              setSidebarTab('recent');
            }}
            className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1.5 transition-colors border ${
              isSidebarOpen && sidebarTab === 'recent'
                ? "bg-[#1f6feb] border-[#58a6ff] text-white shadow-sm"
                : "bg-[#161b22] border-[#30363d] text-[#8b949e] hover:text-white hover:bg-[#21262d]"
            }`}
            title="Open Recent Files & Assets Drawer"
          >
            <Clock size={13} className="text-[#e3b341]" />
            <span>Recent</span>
            {recentCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#21262d] text-[#58a6ff] rounded-full text-[10px] font-mono">
                {recentCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace Layout (Sidebar + Tool Canvas) */}
      <div className="flex-1 flex overflow-hidden bg-[#101015] relative">
        {/* Workspace Sidebar (Sub-Tools + Recent Tab) */}
        {isSidebarOpen && (
          <div className="w-80 bg-[#0d1117] border-r border-[#2a2b3d] flex flex-col shrink-0 overflow-hidden select-none transition-all duration-200">
            {/* Sidebar Tab Header */}
            <div className="flex items-center border-b border-[#30363d] bg-[#161b22] px-2 pt-2">
              <button
                onClick={() => setSidebarTab('subtools')}
                className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                  sidebarTab === 'subtools'
                    ? "border-[#58a6ff] text-white"
                    : "border-transparent text-[#8b949e] hover:text-[#c9d1d9]"
                }`}
              >
                <LayoutGrid size={13} />
                <span>Sub-Tools ({hub.subTools.length})</span>
              </button>

              <button
                onClick={() => setSidebarTab('recent')}
                className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                  sidebarTab === 'recent'
                    ? "border-[#58a6ff] text-white"
                    : "border-transparent text-[#8b949e] hover:text-[#c9d1d9]"
                }`}
              >
                <Clock size={13} className="text-[#e3b341]" />
                <span>Recent ({recentCount})</span>
              </button>
            </div>

            {/* Tab 1: Sub-Tools Explorer */}
            {sidebarTab === 'subtools' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search Filter */}
                <div className="p-2.5 border-b border-[#30363d] bg-[#161b22]">
                  <div className="relative">
                    <Search size={12} className="absolute left-2.5 top-2.5 text-[#8b949e]" />
                    <input
                      type="text"
                      value={subToolFilter}
                      onChange={(e) => setSubToolFilter(e.target.value)}
                      placeholder={`Search ${hub.title} subtools...`}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded text-xs pl-8 pr-7 py-1.5 text-white placeholder-[#8b949e] outline-none focus:border-[#58a6ff] transition-colors"
                    />
                    {subToolFilter && (
                      <button
                        onClick={() => setSubToolFilter('')}
                        className="absolute right-2 top-2 text-[#8b949e] hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {/* SubTools List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                  {filteredSubTools.length === 0 ? (
                    <div className="text-center text-xs text-[#8b949e] py-8">
                      No matching tools found
                    </div>
                  ) : (
                    filteredSubTools.map((sub: any) => {
                      const isActive = activeTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleSelectSubTool(sub.id)}
                          className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#1f6feb]/20 border-[#58a6ff] text-white shadow-sm"
                              : "bg-[#161b22]/50 border-transparent text-[#c9d1d9] hover:bg-[#161b22] hover:border-[#30363d]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={isActive ? "text-[#58a6ff]" : "text-[#8b949e]"}>
                              {sub.icon}
                            </span>
                            <div className="truncate">
                              <div className="font-bold text-xs truncate">{sub.title}</div>
                              <div className="text-[10px] text-[#8b949e] font-mono truncate">
                                ID: {sub.id}
                              </div>
                            </div>
                          </div>
                          {isActive && (
                            <div className="w-2 h-2 rounded-full bg-[#58a6ff] shrink-0"></div>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Hub Meta Info */}
                <div className="p-2.5 border-t border-[#30363d] bg-[#161b22] text-[11px] text-[#8b949e] flex items-center justify-between font-mono">
                  <span>Category: {hub.category || 'Core'}</span>
                  <span>{hub.subTools.length} modules</span>
                </div>
              </div>
            )}

            {/* Tab 2: Recent Files & Assets (Persistent localStorage Tracker) */}
            {sidebarTab === 'recent' && (
              <RecentFilesSidebarPanel
                currentActiveId={activeTab}
                onSelectTool={handleSelectSubTool}
              />
            )}
          </div>
        )}

        {/* Main Tool Render Surface */}
        <div className="flex-1 bg-[#101015] relative overflow-hidden flex flex-col">
          {renderSubTool(activeTab)}
        </div>
      </div>
    </div>
  );
}
