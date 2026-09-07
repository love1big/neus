import React, { useState, useEffect } from "react";
import {
  Settings, Play, Bot, Menu, ChevronRight, Search, Plus, PlayCircle, Box, Layers, MousePointer2, Move, RotateCw, Scaling, Grid, Camera, Pipette, Mountain, Sun, Film, Mic, Flame, Sparkles, Cuboid, Hexagon, Component, RefreshCw, FolderTree, Database, Code2, Waypoints, LayoutDashboard, Puzzle, AlertTriangle, XCircle, X, Maximize2, Move3d, Cloud, Image, Ghost, ChevronDown, UserSquare, Users, AudioWaveform as ObjectIcon, Waves, BookOpen, Map, Gamepad2, Terminal, TerminalSquare, Filter, Globe, Zap, MonitorPlay, Network, Server, Wifi, Activity, AlignLeft, Wrench, GitMerge, HardDrive, Microchip, Eye, BoxSelect, Paintbrush, Cpu, Workflow, } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CommandPalette from "./CommandPalette";
import GenericToolPanel from "./GenericToolPanel";
import Viewport3D from "./Viewport3D";
import OmniCreatorMaster from "./OmniCreatorMaster";
import PerformanceHUD from "./PerformanceHUD";
import SystemHealthDashboard from "./SystemHealthDashboard";
import SystemResourceMonitor from "./SystemResourceMonitor";
import FullEngineSemanticSearchModal from "./FullEngineSemanticSearchModal";
import OmniWorkflowNavigatorModal from "./OmniWorkflowNavigatorModal";
import GlobalAutoSaveStatusWidget from "./GlobalAutoSaveStatusWidget";
import { GlobalStudioAutoSaveManager } from "../utils/GlobalStudioAutoSaveManager";
import { triggerNotification } from "./NotificationSystem";

interface OmniEngineIDEProps {
  tools?: any[];
  activeTool?: string;
  setActiveTool?: (id: string) => void;
  renderActiveTool?: () => React.ReactNode;
}

export default function OmniEngineIDE({
  tools = [],
  activeTool,
  setActiveTool = () => {},
  renderActiveTool = () => null,
}: OmniEngineIDEProps) {
  const [consoleSearch, setConsoleSearch] = useState("");
  const [showFloatingViewport, setShowFloatingViewport] = useState(false);
  const [showResourceOverlay, setShowResourceOverlay] = useState(false);
  const [isSemanticSearchOpen, setIsSemanticSearchOpen] = useState(false);
  const [semanticSearchInitialQuery, setSemanticSearchInitialQuery] = useState("");
  const [isWorkflowNavigatorOpen, setIsWorkflowNavigatorOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K, Cmd+K, or Slash '/' (when not focused in inputs)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSemanticSearchInitialQuery("");
        setIsSemanticSearchOpen(true);
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setSemanticSearchInitialQuery("");
        setIsSemanticSearchOpen(true);
      }
    };

    const handleOpenSearch = (e: any) => {
      const q = e?.detail?.query || '';
      setSemanticSearchInitialQuery(q);
      setIsSemanticSearchOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-engine-search', handleOpenSearch);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-engine-search', handleOpenSearch);
    };
  }, []);

  const [sideTools, setSideTools] = useState(() => {
    const initialTools = tools.length > 0
      ? tools.map((t) => ({
          id: t.id,
          label: t.title,
          iconName: "",
          iconNode: t.icon,
          subTools: t.subTools,
        }))
      : [
          {
            id: "OmniCreatorMaster",
            label: "หน้าหลัก",
            iconName: "LayoutDashboard",
            iconNode: null,
            subTools: undefined,
          },
        ];

    const savedOrder = localStorage.getItem("omni_sideToolsOrder");
    if (savedOrder) {
      try {
        const orderIds = JSON.parse(savedOrder);
        initialTools.sort((a, b) => {
          const indexA = orderIds.indexOf(a.id);
          const indexB = orderIds.indexOf(b.id);
          if (indexA === -1 && indexB === -1) return 0;
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });
      } catch (e) {
        console.error("Failed to parse saved side tools order", e);
      }
    }
    return initialTools;
  });

  useEffect(() => {
    localStorage.setItem("omni_sideToolsOrder", JSON.stringify(sideTools.map(t => t.id)));
  }, [sideTools]);

  // Sync tools if they change
  useEffect(() => {
    if (tools && tools.length > 0 && tools.length !== sideTools.length) {
      const newTools = tools.map((t) => ({
          id: t.id,
          label:
            t.title.length > 18 ? t.title.substring(0, 18) + "..." : t.title,
          iconName: "",
          iconNode: t.icon,
          subTools: t.subTools,
        }));
        
      const savedOrder = localStorage.getItem("omni_sideToolsOrder");
      if (savedOrder) {
        try {
          const orderIds = JSON.parse(savedOrder);
          newTools.sort((a, b) => {
            const indexA = orderIds.indexOf(a.id);
            const indexB = orderIds.indexOf(b.id);
            if (indexA === -1 && indexB === -1) return 0;
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
          });
        } catch (e) {}
      }
      setSideTools(newTools);
    }
  }, [tools, sideTools.length]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const handleSidebarDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSideTools((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const getIconForTool = (iconName: string) => {
    switch (iconName) {
      case "LayoutDashboard":
        return <LayoutDashboard size={22} className="text-pink-500" />;
      case "FolderTree":
        return <FolderTree size={22} className="text-[#58a6ff]" />;
      case "Globe":
        return <Globe size={22} className="text-[#3fb950]" />;
      case "Map":
        return <Map size={22} className="text-[#e3b341]" />;
      case "BookOpen":
        return <BookOpen size={22} className="text-[#bc8cff]" />;
      case "Users":
        return <Users size={22} className="text-[#ff7b72]" />;
      case "Ghost":
        return <Ghost size={22} className="text-[#e3b341]" />;
      case "Box":
        return <Box size={22} className="text-purple-400" />;
      case "BoxSelect":
        return <BoxSelect size={22} className="text-[#58a6ff]" />;
      case "Mountain":
        return <Mountain size={22} className="text-[#3fb950]" />;
      case "Image":
        return <Image size={22} className="text-[#ff7b72]" />;
      case "Paintbrush":
        return <Paintbrush size={22} className="text-[#bc8cff]" />;
      case "Database":
        return <Database size={22} className="text-purple-400" />;
      case "Code2":
        return <Code2 size={22} className="text-[#e3b341]" />;
      case "GitMerge":
        return <GitMerge size={22} className="text-[#3fb950]" />;
      case "TerminalSquare":
        return <TerminalSquare size={22} className="text-[#58a6ff]" />;
      case "Network":
        return <Network size={22} className="text-[#ff7b72]" />;
      case "Server":
        return <Server size={22} className="text-[#3fb950]" />;
      case "Bot":
        return <Bot size={22} className="text-cyan-400" />;
      case "Cloud":
        return <Cloud size={22} className="text-[#3fb950]" />;
      case "Cpu":
        return <Cpu size={22} className="text-orange-400" />;
      case "Zap":
        return <Zap size={22} className="text-yellow-400" />;
      case "Waypoints":
        return <Waypoints size={22} className="text-[#58a6ff]" />;
      case "Gamepad2":
        return <Gamepad2 size={22} className="text-[#f85149]" />;
      case "Layers":
        return <Layers size={22} className="text-orange-400" />;
      case "Puzzle":
        return <Puzzle size={22} className="text-[#bc8cff]" />;
      default:
        return <Box size={22} className="text-gray-400" />;
    }
  };

  const [topRowPanels, setTopRowPanels] = useState([
    "SCENE_TREE",
    "VIEWPORT",
    "INSPECTOR",
  ]);
  const [viewportPos, setViewportPos] = useState({
    x: window.innerWidth - 640,
    y: 80,
  });
  const [isDraggingViewport, setIsDraggingViewport] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeMenuDropdown, setActiveMenuDropdown] = useState<string | null>(
    null,
  );
  const [activeSecondaryTool, setActiveSecondaryTool] =
    useState<string>("select");

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDraggingViewport(true);
    setDragOffset({
      x: e.clientX - viewportPos.x,
      y: e.clientY - viewportPos.y,
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDraggingViewport) {
      setViewportPos({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDraggingViewport(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const showSceneTree = [
    "OmniCreatorMaster",
    "OmniWorldBuilder",
    "ScriptEditor",
  ].includes(activeTool || "");
  const showViewport = [
    "OmniCreatorMaster",
    "OmniWorldBuilder",
    "Modeling",
  ].includes(activeTool || "");
  const showInspector = [
    "OmniCreatorMaster",
    "AssetPipeline",
    "OmniWorldBuilder",
    "Modeling",
    "ScriptEditor",
    "FigmaStyleCanvas",
    "HardwareConfig",
  ].includes(activeTool || "");
  const showAssetBrowser = [
    "OmniCreatorMaster",
    "AssetPipeline",
    "Modeling",
    "FigmaStyleCanvas",
    "NexusPluginArchitect",
    "ModdingWorkshopPublisher",
  ].includes(activeTool || "");
  const showRPGDatabase = ["OmniCreatorMaster", "GameSystems"].includes(
    activeTool || "",
  );

  const showVisualScript = [
    "OmniCreatorMaster",
    "OmniVisualScripting",
    "GameSystems",
  ].includes(activeTool || "");
  const showEventSheet = ["OmniCreatorMaster", "OmniVisualScripting"].includes(
    activeTool || "",
  );
  const showNodeGraph = ["OmniCreatorMaster", "OmniVisualScripting"].includes(
    activeTool || "",
  );
  const showCodeEditor = [
    "OmniCreatorMaster",
    "ScriptEditor",
    "TerminalSvr",
    "NexusPluginArchitect",
    "ModdingWorkshopPublisher",
  ].includes(activeTool || "");
  const showUIDesigner = ["OmniCreatorMaster", "FigmaStyleCanvas"].includes(
    activeTool || "",
  );

  const showConsole = [
    "OmniCreatorMaster",
    "AssetPipeline",
    "OmniWorldBuilder",
    "ScriptEditor",
    "TerminalSvr",
    "OmniVisualScripting",
    "GameSystems",
    "NexusPluginArchitect",
    "ModdingWorkshopPublisher",
    "HardwareConfig",
  ].includes(activeTool || "");
  const showAnimationTimeline = ["OmniCreatorMaster", "Modeling"].includes(
    activeTool || "",
  );
  const showAssetsPreview = [
    "OmniCreatorMaster",
    "Modeling",
    "AssetPipeline",
  ].includes(activeTool || "");
  const showExport = [
    "OmniCreatorMaster",
    "NexusPluginArchitect",
    "ModdingWorkshopPublisher",
    "AssetPipeline",
  ].includes(activeTool || "");

  const showTopRow =
    showSceneTree ||
    showViewport ||
    showInspector ||
    showAssetBrowser ||
    showRPGDatabase;
  const showRightStacked = showAssetBrowser || showRPGDatabase;
  const showBottomRow =
    showVisualScript ||
    showEventSheet ||
    showNodeGraph ||
    showCodeEditor ||
    showUIDesigner;
  const showExtremelyBottomRow =
    showConsole || showAnimationTimeline || showAssetsPreview || showExport;

  const isMainMode = showTopRow || showBottomRow || showExtremelyBottomRow;

  return (
    <div className="w-full h-full bg-[#0a0a0f] text-white flex flex-col font-sans overflow-hidden">
      <PerformanceHUD />
      <CommandPalette tools={tools} onSelect={setActiveTool} />
      
      {/* Full-Engine Semantic Search Modal */}
      <FullEngineSemanticSearchModal
        isOpen={isSemanticSearchOpen}
        onClose={() => setIsSemanticSearchOpen(false)}
        onSelectTool={setActiveTool}
        initialQuery={semanticSearchInitialQuery}
      />

      {/* Top Bar */}
      <div className="h-[36px] bg-[#11111b] border-b border-[#2a2b3d] flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white font-black tracking-widest text-[14px]">
            <Hexagon className="text-blue-500" fill="currentColor" size={20} />
            OMNI ENGINE STUDIO
          </div>
          <div className="flex items-center gap-4 text-[12px] text-gray-300 ml-4 font-bold">
            <MenuDropdown
              label="ไฟล์"
              active={activeMenuDropdown === "file"}
              onOpen={() => setActiveMenuDropdown("file")}
              onClose={() => setActiveMenuDropdown(null)}
              items={[
                {
                  label: "โปรเจกต์ใหม่",
                  shortcut: "Ctrl+N",
                  onClick: () => {
                    if (window.confirm("คุณต้องการสร้างโปรเจกต์ใหม่และรีเซ็ตสถานะใช่หรือไม่?")) {
                      setActiveTool("OmniCreatorMaster");
                      triggerNotification("info", "สร้างโปรเจกต์ใหม่", "เปิดหน้าหลัก Omni Creator Master แล้ว", false);
                    }
                  },
                },
                {
                  label: "เปิดโปรเจกต์...",
                  shortcut: "Ctrl+O",
                  onClick: () => setActiveTool("OmniCreatorMaster"),
                },
                {
                  label: "จัดการโปรเจกต์โค้ด (Code Projects Workspace)...",
                  shortcut: "Ctrl+Shift+P",
                  onClick: () => {
                    setActiveTool("ScriptEditor");
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('open-code-project-modal', { detail: { tab: 'list' } }));
                    }, 100);
                  },
                },
                {
                  label: "บันทึกสถานะสตูดิโอ (Save Studio)",
                  shortcut: "Ctrl+S",
                  onClick: () => {
                    GlobalStudioAutoSaveManager.saveNow({ trigger: 'manual' }).then((state) => {
                      triggerNotification("success", "บันทึกสถานะสตูดิโอสำเร็จ", `บันทึกข้อมูลเครื่องมือ "${state.activeTool}" และการตั้งค่าแล้ว`, false);
                    });
                  },
                },
                {
                  label: "บันทึกจุดกู้คืน (Named Bookmark)...",
                  shortcut: "Ctrl+Shift+S",
                  onClick: () => {
                    const name = window.prompt("ตั้งชื่อจุดกู้คืน (Snapshot Bookmark):", `Checkpoint_${new Date().toLocaleTimeString()}`);
                    if (name) {
                      GlobalStudioAutoSaveManager.createNamedBookmark(name);
                      triggerNotification("success", "สร้างจุดกู้คืนแล้ว", `บันทึก "${name}" ลงในประวัติย้อนหลังเรียบร้อย`, false);
                    }
                  },
                },
                { label: "", divider: true },
                {
                  label: "ส่งออกไฟล์สำรอง (Export JSON Backup)",
                  shortcut: "Ctrl+E",
                  onClick: () => {
                    try {
                      const json = GlobalStudioAutoSaveManager.exportStateAsJSON();
                      const blob = new Blob([json], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `OmniStudio_Backup_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '_')}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      triggerNotification("success", "ส่งออกไฟล์สำรองสำเร็จ", "ดาวน์โหลดไฟล์สำรองข้อมูลสตูดิโอเรียบร้อย", false);
                    } catch (err) {
                      console.error("Export backup error:", err);
                    }
                  },
                },
                {
                  label: "นำเข้าแอสเซ็ต...",
                  shortcut: "Ctrl+I",
                  onClick: () => setActiveTool("AssetPipeline"),
                },
                { label: "", divider: true },
                {
                  label: "ออกจากโปรแกรม",
                  shortcut: "Alt+F4",
                  onClick: () => {
                    GlobalStudioAutoSaveManager.saveNowSync({ trigger: 'beforeunload' });
                    triggerNotification("info", "บันทึกก่อนออก", "บันทึกสถานะปัจจุบันของคุณเรียบร้อยแล้ว", false);
                  },
                },
              ]}
            />
            <MenuDropdown
              label="แก้ไข"
              active={activeMenuDropdown === "edit"}
              onOpen={() => setActiveMenuDropdown("edit")}
              onClose={() => setActiveMenuDropdown(null)}
              items={[
                {
                  label: "ค้นหาทั้งเอนจิน (Semantic Search)",
                  shortcut: "Ctrl+K",
                  icon: <Search size={14} className="text-[#58a6ff]" />,
                  onClick: () => setIsSemanticSearchOpen(true),
                },
                { label: "", divider: true },
                { label: "เลิกทำ", shortcut: "Ctrl+Z" },
                { label: "ทำซ้ำ", shortcut: "Ctrl+Y" },
                { label: "", divider: true },
                { label: "ตัด", shortcut: "Ctrl+X" },
                { label: "คัดลอก", shortcut: "Ctrl+C" },
                { label: "วาง", shortcut: "Ctrl+V" },
                { label: "ลบ", shortcut: "Del" },
                { label: "", divider: true },
                { label: "เลือกทั้งหมด", shortcut: "Ctrl+A" },
                { label: "", divider: true },
                {
                  label: "การตั้งค่าโปรเจกต์",
                  onClick: () => setActiveTool("ProjectSettings"),
                },
              ]}
            />
            <MenuDropdown
              label="สร้าง"
              active={activeMenuDropdown === "create"}
              onOpen={() => setActiveMenuDropdown("create")}
              onClose={() => setActiveMenuDropdown(null)}
              items={[
                { label: "วัตถุ 3 มิติว่างเปล่า", icon: <Box size={14} /> },
                { label: "", divider: true },
                { label: "ลูกบาศก์", icon: <Cuboid size={14} /> },
                { label: "ทรงกลม", icon: <Globe size={14} /> },
                { label: "ทรงกระบอก", icon: <Database size={14} /> },
                { label: "ระนาบ", icon: <Layers size={14} /> },
                { label: "", divider: true },
                { label: "กล้อง", icon: <Camera size={14} /> },
                { label: "", divider: true },
                { label: "แสงสว่าง", icon: <Sun size={14} /> },
                { label: "", divider: true },
                {
                  label: "เสียง",
                  icon: <Mic size={14} />,
                  onClick: () => setActiveTool("OmniAudioStudio"),
                },
                { label: "", divider: true },
                {
                  label: "UI Canvas",
                  icon: <LayoutDashboard size={14} />,
                  onClick: () => setActiveTool("UIUXEdit"),
                },
                { label: "", divider: true },
                {
                  label: "พาร์ติเคิล",
                  icon: <Sparkles size={14} />,
                  onClick: () => setActiveTool("OmniVFXStudio"),
                },
              ]}
            />
            <MenuDropdown
              label="เครื่องมือ"
              active={activeMenuDropdown === "tools"}
              onOpen={() => setActiveMenuDropdown("tools")}
              onClose={() => setActiveMenuDropdown(null)}
              items={[
                {
                  label: "AI Offline Chat & Copilot 🧠",
                  icon: <Bot size={14} />,
                  onClick: () => {
                    setActiveTool("OmniAIAssistantStudio");
                  },
                },
                {
                  label: "Map Editor (สร้างโลก)",
                  icon: <Map size={14} />,
                  onClick: () => setActiveTool("OmniWorldBuilder"),
                },
                {
                  label: "Apex 3D/2D Modeling Studio",
                  icon: <Box size={14} />,
                  onClick: () => setActiveTool("Modeling"),
                },
                {
                  label: "Native Manual IDE & Server Terminal",
                  icon: <TerminalSquare size={14} />,
                  onClick: () => setActiveTool("TerminalSvr"),
                },
                {
                  label: "ตัวจำลองประสิทธิภาพ",
                  icon: <MonitorPlay size={14} />,
                  onClick: () => setActiveTool("PerformanceProfile"),
                },
                {
                  label: "จัดการปลั๊กอิน (C++/JS)",
                  icon: <Puzzle size={14} />,
                  onClick: () => setActiveTool("NexusPluginArchitect"),
                },
              ]}
            />
            <MenuDropdown
              label="เครือข่าย & เซิร์ฟเวอร์"
              active={activeMenuDropdown === "network"}
              onOpen={() => setActiveMenuDropdown("network")}
              onClose={() => setActiveMenuDropdown(null)}
              items={[
                {
                  label: "Network Simulator (จำลองเครือข่าย)",
                  icon: <Network size={14} />,
                  onClick: () => setActiveTool("NetworkSim"),
                },
                {
                  label: "Render Farm (ประมวลผลร่วม)",
                  icon: <Server size={14} />,
                  onClick: () => setActiveTool("RenderFarmManager"),
                },
                {
                  label: "Netcode & RPC Editor",
                  icon: <Wifi size={14} />,
                  onClick: () => setActiveTool("NetcodeEditor"),
                },
                {
                  label: "Entity Replication Simulator",
                  icon: <Globe size={14} />,
                  onClick: () => setActiveTool("NetworkReplicationSim"),
                },
                {
                  label: "LiveOps Dashboard",
                  icon: <Activity size={14} />,
                  onClick: () => setActiveTool("LiveOpsDashboard"),
                },
                {
                  label: "LiveOps Event Scheduler",
                  icon: <AlignLeft size={14} />,
                  onClick: () => setActiveTool("LiveOpsScheduler"),
                },
              ]}
            />
            <MenuDropdown
              label="DevOps & บิ้วด์"
              active={activeMenuDropdown === "devops"}
              onOpen={() => setActiveMenuDropdown("devops")}
              onClose={() => setActiveMenuDropdown(null)}
              items={[
                {
                  label: "Docker & Image Builder",
                  icon: <Box size={14} />,
                  onClick: () => setActiveTool("DockerManager"),
                },
                {
                  label: "Cloud Build / CI Farm",
                  icon: <Cloud size={14} />,
                  onClick: () => setActiveTool("CloudBuildPipeline"),
                },
                {
                  label: "Jenkins & CI Monitor",
                  icon: <Activity size={14} />,
                  onClick: () => setActiveTool("BuildMonitor"),
                },
                {
                  label: "Hardware & I/O Config",
                  icon: <Wrench size={14} />,
                  onClick: () => setActiveTool("HardwareConfig"),
                },
                {
                  label: "Git Conflict Resolver",
                  icon: <GitMerge size={14} />,
                  onClick: () => setActiveTool("VCSConflict"),
                },
              ]}
            />
            <MenuDropdown
              label="QA & โปรไฟล์ลิ่ง"
              active={activeMenuDropdown === "qa_profiling"}
              onOpen={() => setActiveMenuDropdown("qa_profiling")}
              onClose={() => setActiveMenuDropdown(null)}
              items={[
                {
                  label: "Optimization Overview",
                  icon: <Activity size={14} />,
                  onClick: () => setActiveTool("OptimizationOverview"),
                },
                {
                  label: "Memory & Heap Profiler",
                  icon: <HardDrive size={14} />,
                  onClick: () => setActiveTool("MemoryProfiler"),
                },
                {
                  label: "Kernel Panic Analyzer",
                  icon: <Microchip size={14} />,
                  onClick: () => setActiveTool("KernelDebugger"),
                },
                {
                  label: "SystemTap & DTrace",
                  icon: <Activity size={14} />,
                  onClick: () => setActiveTool("SystemTap"),
                },
                {
                  label: "App Strace Profiler",
                  icon: <Search size={14} />,
                  onClick: () => setActiveTool("AppProfiler"),
                },
                {
                  label: "Massive System Log Viewer",
                  icon: <AlignLeft size={14} />,
                  onClick: () => setActiveTool("LogViewer"),
                },
                {
                  label: "Eye-Tracking Health Heatmap",
                  icon: <Eye size={14} />,
                  onClick: () => setActiveTool("EyeTrackingHeatmap"),
                },
                {
                  label: "UX Accessibility/Colorblind QA",
                  icon: <Eye size={14} />,
                  onClick: () => setActiveTool("AccessibilityTester"),
                },
              ]}
            />
            <MenuDropdown
              label="หน้าต่าง"
              active={activeMenuDropdown === "window"}
              onOpen={() => setActiveMenuDropdown("window")}
              onClose={() => setActiveMenuDropdown(null)}
              items={[
                {
                  label: "รีเซ็ตเลย์เอาต์",
                  onClick: () => setActiveTool("OmniCreatorMaster"),
                },
                { label: "โหมดเต็มหน้าจอ", shortcut: "F11" },
                { label: "", divider: true },
                {
                  label: "ค้นหาทั้งเอนจิน (Semantic Search)",
                  shortcut: "Ctrl+K / /",
                  icon: <Search size={14} className="text-[#58a6ff]" />,
                  onClick: () => setIsSemanticSearchOpen(true),
                },
                {
                  label: "เปิด Command Palette",
                  shortcut: "Ctrl+Shift+K",
                  onClick: () =>
                    window.dispatchEvent(
                      new KeyboardEvent("keydown", {
                        key: "K",
                        ctrlKey: true,
                        shiftKey: true,
                      }),
                    ),
                },
                { label: "", divider: true },
                { label: "ซีนทรี" },
                { label: "ตัวตรวจดู" },
                { label: "เบราว์เซอร์แอสเซ็ต" },
                { label: "คอนโซล" },
              ]}
            />
            <MenuDropdown
              label="ปลั๊กอิน"
              active={activeMenuDropdown === "plugins"}
              onOpen={() => setActiveMenuDropdown("plugins")}
              onClose={() => setActiveMenuDropdown(null)}
              items={[
                {
                  label: "Omni Visual Scripting",
                  icon: <Code2 size={14} />,
                  onClick: () => setActiveTool("OmniVisualScripting"),
                },
                {
                  label: "Node Graph Builder",
                  icon: <Waypoints size={14} />,
                  onClick: () => setActiveTool("HoudiniStyleProceduralNode"),
                },
                {
                  label: "Native Plugin Architect (WASM)",
                  icon: <Terminal size={14} />,
                  onClick: () => setActiveTool("NexusPluginArchitect"),
                },
                {
                  label: "Figma Style UI/UX",
                  icon: <LayoutDashboard size={14} />,
                  onClick: () => setActiveTool("FigmaClone"),
                },
                { label: "", divider: true },
                {
                  label: "ค้นหาปลั๊กอินเพิ่มเติม...",
                  icon: <Search size={14} />,
                  onClick: () => setActiveTool("AssetStore"),
                },
              ]}
            />
            <MenuDropdown
              label="ช่วยเหลือ"
              active={activeMenuDropdown === "help"}
              onOpen={() => setActiveMenuDropdown("help")}
              onClose={() => setActiveMenuDropdown(null)}
              items={[
                { label: "คู่มือการใช้งานแบบเต็ม (Docs)" },
                { label: "วิดีโอสอนการใช้งาน" },
                { label: "บทช่วยสอน (Tutorials)" },
                { label: "", divider: true },
                { label: "รายงานปัญหา" },
                { label: "ตรวจสอบการอัปเดต..." },
                { label: "", divider: true },
                { label: "เกี่ยวกับ Omni Engine Studio" },
              ]}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <GlobalAutoSaveStatusWidget activeTool={activeTool} onSelectTool={setActiveTool} />
          <SystemHealthDashboard />
          <button
            onClick={() => setIsWorkflowNavigatorOpen(true)}
            className="px-3 py-1 text-[11px] font-bold rounded flex items-center gap-1.5 transition-colors border bg-gradient-to-r from-amber-600/20 to-blue-600/20 text-amber-300 hover:text-white border-amber-500/40 hover:border-amber-400 shadow-sm cursor-pointer"
            title="ผังรวม 12 สตูดิโอหลัก (Master Studio Navigator)"
          >
            <Workflow size={13} className="text-amber-400" /> แผนผังสตูดิโอ
          </button>
          <button
            onClick={() => setShowResourceOverlay(!showResourceOverlay)}
            className={`px-3 py-1 text-[11px] font-bold rounded flex items-center gap-1.5 transition-colors border ${showResourceOverlay ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]" : "bg-[#1a1b2e] hover:bg-[#2a2b3d] text-gray-300 border-[#2a2b3d]"}`}
          >
            <Activity size={14} className={showResourceOverlay ? "text-emerald-400 animate-pulse" : "text-gray-400"} /> Resource Monitor
          </button>
          <button
            onClick={() => setShowFloatingViewport(!showFloatingViewport)}
            className={`px-3 py-1 text-[11px] font-bold rounded flex items-center gap-1.5 transition-colors border ${showFloatingViewport ? "bg-blue-600/20 text-blue-400 border-blue-500/50" : "bg-[#1a1b2e] hover:bg-[#2a2b3d] text-gray-300 border-[#2a2b3d]"}`}
          >
            <Box size={14} /> Viewport 3D
          </button>

          <div className="flex bg-[#1a1b2e] rounded border border-[#2a2b3d] p-0.5">
            <button className="px-3 py-1 text-[11px] font-bold rounded hover:bg-[#2a2b3d] transition-colors">
              2D
            </button>
            <button className="px-3 py-1 text-[11px] font-bold rounded bg-[#2c2d46] text-white shadow">
              3D
            </button>
            <button className="px-3 py-1 text-[11px] font-bold rounded hover:bg-[#2a2b3d] transition-colors">
              RPG
            </button>
            <button className="px-3 py-1 text-[11px] font-bold rounded hover:bg-[#2a2b3d] transition-colors">
              UI/UX
            </button>
            <button className="px-3 py-1 text-[11px] font-bold rounded hover:bg-[#2a2b3d] transition-colors">
              MULTIPLAYER
            </button>
          </div>

          <button className="bg-gradient-to-r from-[#bc8cff] to-[#58a6ff] hover:opacity-90 px-3 py-1 rounded text-[11px] font-bold tracking-wide flex items-center gap-1.5 border border-purple-400/30">
            AI ASSISTANT{" "}
            <span className="bg-purple-900 text-[8px] px-1 rounded-full border border-purple-400">
              BETA
            </span>
          </button>

          <button className="bg-green-600 hover:bg-green-500 px-4 py-1 rounded text-[11px] font-bold tracking-wide flex items-center gap-1.5 border border-green-400/30 shadow-[0_0_10px_rgba(63,185,80,0.3)]">
            <Play size={12} fill="currentColor" /> เล่น (F5)
          </button>

          <div className="w-[1px] h-5 bg-[#2a2b3d] mx-1"></div>

          {/* Dedicated Full-Engine Semantic Search Bar */}
          <button
            onClick={() => {
              setSemanticSearchInitialQuery("");
              setIsSemanticSearchOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-1 bg-[#1a1b2e] hover:bg-[#25273d] text-gray-300 hover:text-white rounded-md border border-[#2a2b3d] hover:border-[#58a6ff]/50 text-[11px] font-medium transition-all shadow-inner group cursor-pointer max-w-[240px]"
            title="ค้นหาทั้งเอนจิน (Full-Engine Semantic Search - Ctrl+K / /)"
          >
            <Search size={13} className="text-[#58a6ff] group-hover:scale-110 transition-transform shrink-0" />
            <span className="text-gray-400 group-hover:text-gray-200 truncate">ค้นหาทุกเครื่องมือ & แอสเซ็ต...</span>
            <kbd className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#0d1117] text-gray-400 border border-[#2a2b3d] shrink-0 ml-1">
              ⌘K
            </kbd>
          </button>

          <div
            onClick={() => {
              setSemanticSearchInitialQuery("");
              setIsSemanticSearchOpen(true);
            }}
            className="flex items-center justify-center w-7 h-7 hover:bg-[#2a2b3d] rounded cursor-pointer transition-colors"
            title="Full Engine Search (Ctrl+K)"
          >
            <Search size={14} className="text-gray-400 hover:text-[#58a6ff]" />
          </div>
          <div className="flex items-center justify-center w-7 h-7 hover:bg-[#2a2b3d] rounded cursor-pointer transition-colors">
            <Settings size={14} className="text-gray-400 hover:text-white" />
          </div>
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold overflow-hidden border border-[#2a2b3d] ml-1">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=OmniUser"
              alt="User"
            />
          </div>
          <span className="text-[11px] font-bold">OmniUser</span>
          <ChevronDown size={12} className="text-gray-400" />
        </div>
      </div>

      {/* Sub Top Bar (Tools) */}
      <div className="h-14 bg-[#161726] border-b border-[#2a2b3d] flex items-center px-4 gap-2 shrink-0 overflow-x-auto hide-scrollbar">
        <ToolBtn
          icon={
            <MousePointer2
              size={18}
              className={
                activeSecondaryTool === "select" ? "text-blue-400" : ""
              }
            />
          }
          label="เลือก"
          active={activeSecondaryTool === "select"}
          onClick={() => setActiveSecondaryTool("select")}
        />
        <ToolBtn
          icon={
            <Move
              size={18}
              className={activeSecondaryTool === "move" ? "text-blue-400" : ""}
            />
          }
          label="ย้าย"
          active={activeSecondaryTool === "move"}
          onClick={() => setActiveSecondaryTool("move")}
        />
        <ToolBtn
          icon={
            <RotateCw
              size={18}
              className={
                activeSecondaryTool === "rotate" ? "text-blue-400" : ""
              }
            />
          }
          label="หมุน"
          active={activeSecondaryTool === "rotate"}
          onClick={() => setActiveSecondaryTool("rotate")}
        />
        <ToolBtn
          icon={
            <Scaling
              size={18}
              className={activeSecondaryTool === "scale" ? "text-blue-400" : ""}
            />
          }
          label="สเกล"
          active={activeSecondaryTool === "scale"}
          onClick={() => setActiveSecondaryTool("scale")}
        />
        <div className="w-[1px] h-8 bg-[#2a2b3d] mx-2"></div>
        <ToolBtn
          icon={<Plus size={18} className="text-[#bc8cff]" />}
          label="สแน็บ"
          active={activeSecondaryTool === "snap"}
          onClick={() => setActiveSecondaryTool("snap")}
        />
        <ToolBtn
          icon={<Grid size={18} className="text-cyan-400" />}
          label="กริด"
          active={activeSecondaryTool === "grid"}
          onClick={() => setActiveSecondaryTool("grid")}
        />
        <ToolBtn
          icon={<Camera size={18} className="text-pink-400" />}
          label="กล้อง"
          active={activeSecondaryTool === "camera"}
          onClick={() => setActiveSecondaryTool("camera")}
        />
        <div className="w-[1px] h-8 bg-[#2a2b3d] mx-2"></div>
        <ToolBtn
          icon={<Pipette size={18} className="text-[#58a6ff]" />}
          label="พู่กัน"
          active={activeSecondaryTool === "paint"}
          onClick={() => {
            setActiveSecondaryTool("paint");
            setActiveTool("SubstanceStyleTexturePainter");
          }}
        />
        <ToolBtn
          icon={<Mountain size={18} className="text-[#3fb950]" />}
          label="เทอร์เรน"
          active={activeSecondaryTool === "terrain"}
          onClick={() => {
            setActiveSecondaryTool("terrain");
            setActiveTool("OmniWorldBuilder");
          }}
        />
        <ToolBtn
          icon={<Sun size={18} className="text-[#e3b341]" />}
          label="แสง"
          active={activeSecondaryTool === "light"}
          onClick={() => {
            setActiveSecondaryTool("light");
            setActiveTool("CinematicLightingEditor");
          }}
        />
        <ToolBtn
          icon={<Film size={18} className="text-orange-400" />}
          label="อนิเมชัน"
          active={activeSecondaryTool === "anim"}
          onClick={() => {
            setActiveSecondaryTool("anim");
            setActiveTool("OmniAnimationStudio");
          }}
        />
        <ToolBtn
          icon={<Mic size={18} className="text-[#bc8cff]" />}
          label="เสียง"
          active={activeSecondaryTool === "audio"}
          onClick={() => {
            setActiveSecondaryTool("audio");
            setActiveTool("OmniAudioStudio");
          }}
        />
        <ToolBtn
          icon={<Flame size={18} className="text-[#f85149]" />}
          label="เอฟเฟกต์"
          active={activeSecondaryTool === "vfx"}
          onClick={() => {
            setActiveSecondaryTool("vfx");
            setActiveTool("OmniVFXStudio");
          }}
        />
        <ToolBtn
          icon={<Sparkles size={18} className="text-pink-400" />}
          label="พาร์ติเคิล"
          active={activeSecondaryTool === "particle"}
          onClick={() => {
            setActiveSecondaryTool("particle");
            setActiveTool("OmniVFXStudio");
          }}
        />
        <ToolBtn
          icon={<Cuboid size={18} className="text-[#e3b341]" />}
          label="วัสดุ"
          active={activeSecondaryTool === "material"}
          onClick={() => {
            setActiveSecondaryTool("material");
            setActiveTool("Material");
          }}
        />
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Icon Sidebar */}
        <div className="w-[64px] bg-[#141525] border-r border-[#2a2b3d] flex flex-col shrink-0 z-50 h-full">
          <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col items-center py-4 gap-2 w-full">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleSidebarDragEnd}
            >
              <SortableContext
                items={sideTools}
                strategy={verticalListSortingStrategy}
              >
                {sideTools.map((tool: any) => {
                  const hasActiveSubTool = tool.subTools?.some((s: any) => s.id === activeTool);
                  return (
                    <SortableSideBtn
                      key={tool.id}
                      id={tool.id}
                      icon={tool.iconNode || getIconForTool(tool.iconName)}
                      label={tool.label}
                      active={activeTool === tool.id || hasActiveSubTool}
                      onClick={() => setActiveTool(tool.id)}
                      
                      subTools={tool.subTools}
                      onSubSelect={setActiveTool}
                      activeTool={activeTool}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
          </div>
          <div className="w-full flex flex-col items-center py-4 gap-2 border-t border-[#2a2b3d] bg-[#141525]">
            <SideBtn
              icon={<Settings size={22} className="text-gray-400" />}
              label="ตั้งค่า"
              active={activeTool === "HardwareConfig"}
              onClick={() => setActiveTool("HardwareConfig")}
            />
          </div>
        </div>

        {/* Dynamic Panels Area */}
        <div className="flex-1 flex flex-col p-1.5 gap-1.5 bg-[#101015] overflow-hidden">
          {isMainMode ? (
            <div className="flex-1 flex flex-col gap-1.5 min-h-0 overflow-hidden">
              {showTopRow && (
                <div className="flex-1 flex gap-1.5 min-h-0">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(e) => {
                      const { active, over } = e;
                      if (over && active.id !== over.id) {
                        setTopRowPanels((items: string[]) => {
                          const oldIndex = items.indexOf(active.id as string);
                          const newIndex = items.indexOf(over.id as string);
                          return arrayMove(items, oldIndex, newIndex);
                        });
                      }
                    }}
                  >
                    <SortableContext
                      items={topRowPanels}
                      strategy={verticalListSortingStrategy}
                    >
                      {topRowPanels.map((pId) => (
                        <React.Fragment key={pId}>
                          {pId === "SCENE_TREE" && showSceneTree && (
                            <SortablePanelWrapper id={pId}>
                              <Panel
                                show={true}
                                title="SCENE TREE"
                                className="w-[260px] h-full"
                              >
                                <div className="p-2 space-y-1 text-[11px] overflow-y-auto w-full h-full custom-scrollbar">
                                  <TreeItem
                                    label="Main Scene"
                                    icon={<Box size={14} />}
                                    defaultOpen
                                  >
                                    <TreeItem
                                      label="World"
                                      icon={
                                        <Globe
                                          size={14}
                                          className="text-[#e3b341]"
                                        />
                                      }
                                      defaultOpen
                                    >
                                      <TreeItem
                                        label="Lighting"
                                        icon={
                                          <Sun
                                            size={14}
                                            className="text-[#e3b341]"
                                          />
                                        }
                                        defaultOpen
                                      >
                                        <TreeItem
                                          label="Directional Light"
                                          icon={<Sun size={14} />}
                                        />
                                        <TreeItem
                                          label="Point Light"
                                          icon={<Flame size={14} />}
                                        />
                                        <TreeItem
                                          label="Sky Light"
                                          icon={<Cloud size={14} />}
                                        />
                                      </TreeItem>
                                      <TreeItem
                                        label="Environment"
                                        icon={
                                          <Mountain
                                            size={14}
                                            className="text-[#3fb950]"
                                          />
                                        }
                                        defaultOpen
                                      >
                                        <TreeItem
                                          label="Terrain"
                                          icon={<Mountain size={14} />}
                                        />
                                        <TreeItem
                                          label="Trees"
                                          icon={<FolderTree size={14} />}
                                        />
                                        <TreeItem
                                          label="Rocks"
                                          icon={<Cuboid size={14} />}
                                        />
                                        <TreeItem
                                          label="Waterfall"
                                          icon={<Waves size={14} />}
                                        />
                                      </TreeItem>
                                      <TreeItem
                                        label="Player"
                                        icon={
                                          <UserSquare
                                            size={14}
                                            className="text-[#58a6ff]"
                                          />
                                        }
                                        active
                                      />
                                      <TreeItem
                                        label="NPC"
                                        icon={
                                          <Users
                                            size={14}
                                            className="text-[#e3b341]"
                                          />
                                        }
                                      />
                                      <TreeItem
                                        label="Enemy"
                                        icon={
                                          <Ghost
                                            size={14}
                                            className="text-[#f85149]"
                                          />
                                        }
                                      />
                                      <TreeItem
                                        label="Items"
                                        icon={
                                          <Database
                                            size={14}
                                            className="text-[#bc8cff]"
                                          />
                                        }
                                      />
                                      <TreeItem
                                        label="UI Canvas"
                                        icon={
                                          <LayoutDashboard
                                            size={14}
                                            className="text-pink-400"
                                          />
                                        }
                                      />
                                      <TreeItem
                                        label="Audio Listener"
                                        icon={
                                          <Mic
                                            size={14}
                                            className="text-[#bc8cff]"
                                          />
                                        }
                                      />
                                      <TreeItem
                                        label="Camera"
                                        icon={
                                          <Camera
                                            size={14}
                                            className="text-gray-400"
                                          />
                                        }
                                      />
                                    </TreeItem>
                                  </TreeItem>
                                </div>
                              </Panel>
                            </SortablePanelWrapper>
                          )}

                          {pId === "VIEWPORT" && showViewport && (
                            <SortablePanelWrapper id={pId}>
                              <Panel
                                show={true}
                                title="VIEWPORT"
                                hideHeader
                                className="flex-1 min-w-[500px] h-full relative border border-[#2a2b3d] overflow-hidden rounded-[4px] shadow-lg"
                              >
                                <div className="w-full h-full relative">
                                  {renderActiveTool && renderActiveTool() ? (
                                    <div className="absolute inset-0">
                                      {renderActiveTool()}
                                    </div>
                                  ) : (
                                    <Viewport3D
                                      activeTool={activeTool || ""}
                                      activeFile={undefined}
                                      globalActiveTransformTool={
                                        activeSecondaryTool
                                      }
                                    />
                                  )}
                                </div>
                              </Panel>
                            </SortablePanelWrapper>
                          )}

                          {pId === "INSPECTOR" && showInspector && (
                            <SortablePanelWrapper id={pId}>
                              <Panel
                                show={true}
                                title="INSPECTOR"
                                className="w-[300px] h-full"
                              >
                                <div className="p-3 text-[11px] space-y-3 overflow-y-auto h-full custom-scrollbar">
                                  <div className="flex items-center gap-2 border-b border-[#2a2b3d] pb-2">
                                    <UserSquare
                                      size={18}
                                      className="text-blue-400 shrink-0"
                                    />
                                    <input
                                      type="text"
                                      className="bg-[#0a0a0f] border border-[#2a2b3d] focus:border-[#58a6ff] rounded px-2 py-1.5 flex-1 text-white text-[12px] font-bold outline-none"
                                      defaultValue="Player"
                                    />
                                    <div className="flex flex-col text-[9px] text-gray-400 shrink-0">
                                      <span className="mb-[2px]">Layer</span>
                                      <span className="text-white bg-[#22222a] px-1 py-0.5 rounded flex items-center gap-1 cursor-pointer hover:bg-[#333]">
                                        Default <ChevronDown size={10} />
                                      </span>
                                    </div>
                                  </div>

                                  <InspectorCategory
                                    title="Transform"
                                    defaultOpen
                                    iconColor="text-yellow-500"
                                  >
                                    <div className="grid grid-cols-[36px_1fr_1fr_1fr] gap-1.5 items-center mb-1.5">
                                      <span className="text-gray-400">
                                        ตำแหน่ง
                                      </span>
                                      <PropInput
                                        label="X"
                                        val="125.0"
                                        color="bg-red-500/20 text-red-500 border-red-500/30"
                                      />
                                      <PropInput
                                        label="Y"
                                        val="32.0"
                                        color="bg-green-500/20 text-green-500 border-green-500/30"
                                      />
                                      <PropInput
                                        label="Z"
                                        val="-45.0"
                                        color="bg-blue-500/20 text-blue-500 border-blue-500/30"
                                      />
                                    </div>
                                    <div className="grid grid-cols-[36px_1fr_1fr_1fr] gap-1.5 items-center mb-1.5">
                                      <span className="text-gray-400">
                                        หมุน
                                      </span>
                                      <PropInput
                                        label="X"
                                        val="0.0"
                                        color="bg-red-500/20 text-red-500 border-red-500/30"
                                      />
                                      <PropInput
                                        label="Y"
                                        val="180.0"
                                        color="bg-green-500/20 text-green-500 border-green-500/30"
                                      />
                                      <PropInput
                                        label="Z"
                                        val="0.0"
                                        color="bg-blue-500/20 text-blue-500 border-blue-500/30"
                                      />
                                    </div>
                                    <div className="grid grid-cols-[36px_1fr_1fr_1fr] gap-1.5 items-center mb-1.5">
                                      <span className="text-gray-400">
                                        สเกล
                                      </span>
                                      <PropInput
                                        label="X"
                                        val="1.0"
                                        color="bg-red-500/20 text-red-500 border-red-500/30"
                                      />
                                      <PropInput
                                        label="Y"
                                        val="1.0"
                                        color="bg-green-500/20 text-green-500 border-green-500/30"
                                      />
                                      <PropInput
                                        label="Z"
                                        val="1.0"
                                        color="bg-blue-500/20 text-blue-500 border-blue-500/30"
                                      />
                                    </div>
                                  </InspectorCategory>

                                  <InspectorCategory title="Mesh">
                                    <div className="flex justify-between items-center text-gray-300">
                                      <span>Mesh</span>
                                      <span className="bg-[#111116] border border-[#333] px-2 py-1 text-[10px] rounded text-white flex gap-2 items-center hover:border-gray-500 cursor-pointer">
                                        Hero_Mesh <ChevronDown size={10} />
                                      </span>
                                    </div>
                                  </InspectorCategory>
                                  <InspectorCategory title="Animation">
                                    <div className="flex justify-between items-center text-gray-300">
                                      <span>Animation</span>
                                      <span className="bg-[#111116] border border-[#333] px-2 py-1 text-[10px] rounded text-white flex gap-2 items-center hover:border-gray-500 cursor-pointer">
                                        Hero_Anim <ChevronDown size={10} />
                                      </span>
                                    </div>
                                  </InspectorCategory>
                                  <InspectorCategory title="Character Controller"></InspectorCategory>
                                  <InspectorCategory title="Rigidbody"></InspectorCategory>
                                  <InspectorCategory
                                    title="Health (Script)"
                                    defaultOpen
                                    iconColor="text-[#3fb950]"
                                  >
                                    <div className="flex justify-between items-center mb-1.5">
                                      <span className="text-gray-400">
                                        Max Health
                                      </span>
                                      <input
                                        type="text"
                                        className="w-20 bg-[#0a0a0f] border border-green-500/50 rounded px-1.5 py-1 text-right text-green-400 outline-none focus:border-green-400 font-mono text-[10px]"
                                        defaultValue="100"
                                      />
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-400">
                                        Current Health
                                      </span>
                                      <input
                                        type="text"
                                        className="w-20 bg-[#0a0a0f] border border-green-500/50 rounded px-1.5 py-1 text-right text-green-400 outline-none focus:border-green-400 font-mono text-[10px]"
                                        defaultValue="100"
                                      />
                                    </div>
                                  </InspectorCategory>

                                  <button className="w-full py-1.5 bg-[#2c2d46] hover:bg-[#3d3f5e] border border-[#4a4c6e] rounded text-white font-bold mt-4 flex items-center justify-center gap-1.5 transition-colors shadow-lg text-[12px]">
                                    <Plus size={14} /> เพิ่ม Component
                                  </button>
                                </div>
                              </Panel>
                            </SortablePanelWrapper>
                          )}
                        </React.Fragment>
                      ))}
                    </SortableContext>
                  </DndContext>

                  {/* Stacked Right Panel */}
                  {showRightStacked && (
                    <div className="w-[300px] flex flex-col gap-1.5 box-border h-full">
                      {/* ASSET BROWSER */}
                      <Panel
                        show={showAssetBrowser}
                        title="ASSET BROWSER"
                        className="flex-1"
                      >
                        <div className="p-2 h-full flex flex-col">
                          <div className="relative mb-2">
                            <Search
                              size={14}
                              className="absolute left-2.5 top-1.5 text-gray-400"
                            />
                            <input
                              type="text"
                              className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded pl-8 py-1.5 text-[11px] text-white outline-none focus:border-[#58a6ff]"
                              placeholder="ค้นหา..."
                            />
                          </div>
                          <div className="flex gap-2 text-[10px] text-gray-400 justify-around mb-3 px-1">
                            <div className="flex flex-col items-center hover:text-white cursor-pointer gap-1">
                              <Box size={16} className="text-white" /> All
                            </div>
                            <div className="flex flex-col items-center hover:text-white cursor-pointer gap-1">
                              <Image size={16} className="text-[#3fb950]" /> 2D
                            </div>
                            <div className="flex flex-col items-center hover:text-white cursor-pointer gap-1">
                              <Cuboid size={16} className="text-[#e3b341]" /> 3D
                            </div>
                            <div className="flex flex-col items-center hover:text-white cursor-pointer gap-1">
                              <Mic size={16} className="text-[#bc8cff]" /> Audio
                            </div>
                            <div className="flex flex-col items-center hover:text-white cursor-pointer gap-1">
                              <Grid size={16} className="text-orange-400" />{" "}
                              Material
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-2 flex-1 content-start mt-1 overflow-y-auto custom-scrollbar pr-1">
                            <AssetCard
                              img="https://api.dicebear.com/7.x/adventurer/svg?seed=1"
                              name="Hero.fbx"
                            />
                            <AssetCard
                              img="https://api.dicebear.com/7.x/shapes/svg?seed=2"
                              name="Tree_01.fbx"
                            />
                            <AssetCard
                              img="https://api.dicebear.com/7.x/shapes/svg?seed=3"
                              name="Sword.fbx"
                            />
                            <AssetCard
                              img="https://api.dicebear.com/7.x/shapes/svg?seed=4"
                              name="House.fbx"
                            />
                            <AssetCard
                              img="https://api.dicebear.com/7.x/identicon/svg?seed=5"
                              name="Grass.png"
                            />
                            <AssetCard
                              img="https://api.dicebear.com/7.x/identicon/svg?seed=6"
                              name="Rock.png"
                            />
                            <AssetCard
                              img="https://api.dicebear.com/7.x/identicon/svg?seed=7"
                              name="Water.png"
                            />
                            <AssetCard
                              img="https://api.dicebear.com/7.x/identicon/svg?seed=8"
                              name="BGM.mp3"
                            />
                          </div>
                        </div>
                      </Panel>

                      {/* RPG DATABASE */}
                      <Panel
                        show={showRPGDatabase}
                        title="RPG DATABASE"
                        className="flex-1"
                      >
                        <div className="p-2 text-[11px] h-full overflow-y-auto custom-scrollbar flex flex-col">
                          <div className="flex-1 overflow-y-auto relative z-10 w-full rounded">
                            <div className="bg-[#11111b] border border-[#2a2b3d] rounded p-2 z-10">
                              <TreeItem
                                label="Characters"
                                icon={
                                  <UserSquare
                                    size={14}
                                    className="text-orange-500"
                                  />
                                }
                                defaultOpen
                              >
                                <TreeItem
                                  label="Classes"
                                  icon={<Code2 size={14} />}
                                />
                                <TreeItem
                                  label="Skills"
                                  icon={<Zap size={14} />}
                                />
                              </TreeItem>
                              <TreeItem
                                label="Items"
                                icon={
                                  <Database
                                    size={14}
                                    className="text-[#58a6ff]"
                                  />
                                }
                              />
                              <TreeItem
                                label="Enemies"
                                icon={
                                  <Ghost size={14} className="text-[#f85149]" />
                                }
                              />
                              <TreeItem
                                label="Quests"
                                icon={
                                  <BookOpen
                                    size={14}
                                    className="text-[#bc8cff]"
                                  />
                                }
                              />
                              <TreeItem
                                label="Maps"
                                icon={
                                  <Map size={14} className="text-[#3fb950]" />
                                }
                                defaultOpen
                              >
                                <TreeItem
                                  label="Events"
                                  icon={<Layers size={14} />}
                                />
                                <TreeItem
                                  label="Common Events"
                                  icon={<Layers size={14} />}
                                />
                              </TreeItem>
                              <TreeItem
                                label="System"
                                icon={
                                  <Settings
                                    size={14}
                                    className="text-gray-400"
                                  />
                                }
                              />
                              <TreeItem
                                label="Troops"
                                icon={
                                  <Users
                                    size={14}
                                    className="text-yellow-500"
                                  />
                                }
                              />
                              <TreeItem
                                label="States"
                                icon={
                                  <AlertTriangle
                                    size={14}
                                    className="text-red-400"
                                  />
                                }
                              />
                              <TreeItem
                                label="Animations"
                                icon={
                                  <Film size={14} className="text-blue-300" />
                                }
                              />
                              <TreeItem
                                label="Tilesets"
                                icon={
                                  <Grid size={14} className="text-green-300" />
                                }
                              />
                              <TreeItem
                                label="Database Settings"
                                icon={
                                  <Settings
                                    size={14}
                                    className="text-gray-500"
                                  />
                                }
                              />
                            </div>
                          </div>

                          <div className="mt-3 border-t border-[#2a2b3d] pt-2 shrink-0">
                            <div className="text-gray-300 font-bold mb-2">
                              ข้อมูล Map
                            </div>
                            <div className="grid grid-cols-[80px_1fr] gap-1 mb-1.5 items-center">
                              <span className="text-gray-500">
                                ชื่อบนแผนที่
                              </span>
                              <span className="text-white bg-[#0a0a0f] px-2 py-0.5 rounded border border-[#2a2b3d]">
                                Town
                              </span>
                            </div>
                            <div className="grid grid-cols-[80px_1fr] gap-1 mb-1.5 items-center">
                              <span className="text-gray-500">ขนาด</span>
                              <span className="text-white bg-[#0a0a0f] px-2 py-0.5 rounded border border-[#2a2b3d]">
                                40 x 30
                              </span>
                            </div>
                            <div className="grid grid-cols-[80px_1fr] gap-1 mb-1.5 items-center">
                              <span className="text-gray-500">ซีน</span>
                              <span className="text-white bg-[#0a0a0f] px-2 py-0.5 rounded border border-[#2a2b3d]">
                                Overworld
                              </span>
                            </div>
                            <div className="grid grid-cols-[80px_1fr] gap-1 mb-1.5 items-center">
                              <span className="text-gray-500">BGM</span>
                              <span className="text-white bg-[#0a0a0f] px-2 py-0.5 rounded border border-[#2a2b3d]">
                                Town Theme
                              </span>
                            </div>
                            <div className="grid grid-cols-[80px_1fr] gap-1 items-center">
                              <span className="text-gray-500">Save Point</span>
                              <input
                                type="checkbox"
                                checked
                                readOnly
                                className="w-3.5 h-3.5 rounded bg-blue-500 outline-none border-none"
                              />
                            </div>
                          </div>
                        </div>
                      </Panel>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Content Row */}
              {showBottomRow && (
                <div className="h-[260px] flex gap-1.5 shrink-0">
                  {/* VISUAL SCRIPT */}
                  <Panel
                    show={showVisualScript}
                    title="VISUAL SCRIPT (Blueprint)"
                    className="flex-1 min-w-[280px] overflow-hidden"
                    tab={
                      <div className="flex gap-2 items-center bg-[#11111b] px-2 py-0.5 text-[10px] text-gray-300 font-bold max-w-[max-content] rounded-t-[4px] min-w-[120px] justify-between border-t border-x border-[#2a2b3d]">
                        <LayoutDashboard size={12} className="text-[#58a6ff]" />{" "}
                        PlayerController{" "}
                        <X
                          size={10}
                          className="ml-2 hover:text-white cursor-pointer"
                        />
                      </div>
                    }
                  >
                    <div className="w-full h-full p-2 bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center">
                      {/* Grid Background */}
                      <div
                        className="absolute opacity-5"
                        style={{
                          backgroundImage:
                            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                          backgroundSize: "20px 20px",
                          width: "100%",
                          height: "100%",
                        }}
                      ></div>

                      <div className="relative w-full h-full max-w-[300px] max-h-[200px]">
                        <NodeMock
                          color="bg-blue-600 border-blue-500"
                          title="Input"
                          x={10}
                          y={20}
                          content={
                            <div className="text-[10px] my-1">
                              On Key Press W{" "}
                              <span className="bg-white rounded-full w-2 h-2 inline-block ml-2 absolute -right-1 top-1/2 -translate-y-1/2"></span>
                            </div>
                          }
                        />
                        <NodeMock
                          color="bg-blue-600 border-blue-500"
                          title="Move Forward"
                          x={160}
                          y={20}
                          content={
                            <div className="text-[10px] my-1">
                              <span className="bg-white rounded-full w-2 h-2 inline-block mr-2 absolute -left-1 top-3"></span>{" "}
                              Speed{" "}
                              <span className="bg-black/50 border border-[#333] px-2 py-[1px] ml-1 rounded">
                                5
                              </span>
                              <ChevronDown size={10} className="inline" />
                            </div>
                          }
                        />

                        <NodeMock
                          color="bg-purple-600 border-purple-500"
                          title="Jump"
                          x={10}
                          y={110}
                          content={
                            <div className="text-[10px] my-1">
                              On Key Press Space{" "}
                              <span className="bg-white rounded-full w-2 h-2 inline-block ml-2 absolute -right-1 top-1/2 -translate-y-1/2"></span>
                            </div>
                          }
                        />
                        <NodeMock
                          color="bg-red-600 border-red-500"
                          title="Play Animation"
                          x={160}
                          y={110}
                          content={
                            <div className="text-[10px] my-1">
                              <span className="bg-white rounded-full w-2 h-2 inline-block mr-2 absolute -left-1 top-3"></span>{" "}
                              <span className="bg-[#111] border border-[#333] px-2 py-0.5 rounded">
                                Jump_Anim{" "}
                                <ChevronDown size={8} className="inline ml-1" />
                              </span>
                            </div>
                          }
                        />

                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none"
                          style={{ zIndex: 0 }}
                        >
                          <path
                            d="M 105 35 C 130 35, 130 35, 155 35"
                            stroke="#58a6ff"
                            strokeWidth="2"
                            fill="none"
                          />
                          <path
                            d="M 125 125 C 145 125, 140 125, 155 125"
                            stroke="#bc8cff"
                            strokeWidth="2"
                            fill="none"
                          />
                        </svg>
                      </div>
                    </div>
                  </Panel>

                  {/* EVENT SHEET */}
                  <Panel
                    show={showEventSheet}
                    title="EVENT SHEET (Construct Style)"
                    className="w-[340px]"
                  >
                    <div className="w-full h-full bg-[#11111b] overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-1.5">
                      <div className="bg-[#161726] border border-[#2a2b3d] rounded-[4px] overflow-hidden flex flex-col shadow-md">
                        <EventRow
                          num={1}
                          cond="System"
                          condColor="text-blue-400"
                          condText="On start of layout"
                          act="Set Camera position (0,0)"
                        />
                        <EventRow
                          num={2}
                          cond="Player"
                          condColor="text-green-400"
                          condText="Is moving"
                          act="Set animation to 'Run'"
                        />
                        <EventRow
                          num={3}
                          cond="Keyboard"
                          condColor="text-purple-400"
                          condText="Is Key Down Space"
                          act="Jump"
                        />
                        <EventRow
                          num={4}
                          cond="Player"
                          condColor="text-green-400"
                          condText="Health <= 0"
                          act="Game Over"
                        />
                        <EventRow
                          num={5}
                          cond="Enemy"
                          condColor="text-red-400"
                          condText="On collision Player"
                          act="Damage Player 10"
                        />
                      </div>
                      <button className="text-[11px] bg-[#1e1e2d] border border-[#3a3b50] hover:bg-[#2c2d46] text-white px-3 py-1.5 rounded-[4px] transition flex items-center justify-center gap-1.5 font-bold shadow">
                        <Plus size={14} /> เพิ่ม Event
                      </button>
                    </div>
                  </Panel>

                  {/* NODE GRAPH */}
                  <Panel
                    show={showNodeGraph}
                    title="NODE GRAPH (Godot Style)"
                    className="w-[280px]"
                  >
                    <div className="w-full h-full p-2 bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center">
                      <div
                        className="absolute opacity-5"
                        style={{
                          backgroundImage:
                            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                          backgroundSize: "10px 10px",
                          width: "100%",
                          height: "100%",
                        }}
                      ></div>

                      <div className="relative w-full h-full max-w-[240px] max-h-[200px]">
                        <NodeMock
                          color="bg-[#161726]"
                          border="border-t-[3px] border-t-purple-500 border-x border-b border-[#2a2b3d]"
                          title="State Machine"
                          x={10}
                          y={15}
                          content={
                            <div className="text-[10px] flex flex-col gap-1.5 text-gray-300 w-full mb-1">
                              <div className="flex justify-between items-center bg-[#2a2b3d] rounded px-1 -mx-1 py-0.5">
                                <span>Idle</span>
                                <span className="bg-red-500 w-2 h-2 rounded-full border border-white"></span>
                              </div>
                              <div className="flex justify-between items-center px-1">
                                <span>Run</span>
                                <span className="bg-red-500 w-2 h-2 rounded-full border border-white"></span>
                              </div>
                              <div className="flex justify-between items-center px-1">
                                <span>Jump</span>
                                <span className="bg-red-500 w-2 h-2 rounded-full border border-white"></span>
                              </div>
                              <div className="flex justify-between items-center px-1">
                                <span>Attack</span>
                                <span className="bg-red-500 w-2 h-2 rounded-full border border-white"></span>
                              </div>
                            </div>
                          }
                        />
                        <NodeMock
                          color="bg-green-600/20"
                          border="border border-green-500"
                          title="Blend Tree"
                          x={140}
                          y={40}
                          content={
                            <div className="text-[10px] flex flex-col gap-1 text-gray-300 mt-1 mb-1">
                              <div className="flex items-center gap-2 relative">
                                <span className="bg-white w-2 h-2 rounded-full absolute -left-3"></span>{" "}
                                <span>Speed</span>{" "}
                                <span className="bg-green-500 w-2 h-2 rounded-full absolute -right-3 border border-white"></span>
                              </div>
                              <div className="flex items-center gap-2 relative">
                                <span className="bg-white w-2 h-2 rounded-full absolute -left-3"></span>{" "}
                                <span>Direction</span>
                              </div>
                            </div>
                          }
                        />
                        <NodeMock
                          color="bg-pink-600"
                          title="Play Animation"
                          x={10}
                          y={150}
                          content={
                            <div className="text-[10px] flex flex-col gap-1 mt-1 mb-1">
                              <div className="flex justify-between items-center">
                                <span>
                                  Animation{" "}
                                  <ChevronDown
                                    size={8}
                                    className="inline ml-1"
                                  />
                                </span>
                                <span className="bg-white w-2 h-2 rounded-full"></span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Speed</span>
                                <span>1.0</span>
                              </div>
                            </div>
                          }
                        />

                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none"
                          style={{ zIndex: 0 }}
                        >
                          <path
                            d="M 100 45 C 120 45, 120 60, 135 60"
                            stroke="#fff"
                            strokeWidth="2"
                            fill="none"
                          />
                          <path
                            d="M 100 165 C 120 165, 110 75, 135 75"
                            stroke="#bc8cff"
                            strokeWidth="2"
                            fill="none"
                          />
                        </svg>
                      </div>
                    </div>
                  </Panel>

                  {/* CODE EDITOR */}
                  <Panel
                    show={showCodeEditor}
                    title="CODE EDITOR"
                    className="flex-1 min-w-[280px]"
                  >
                    {(activeTool === "ScriptEditor" ||
                      activeTool === "NexusPluginArchitect" ||
                      activeTool === "TerminalSvr" ||
                      activeTool === "ModdingWorkshopPublisher") &&
                    renderActiveTool ? (
                      <div className="w-full h-full relative z-0">
                        {renderActiveTool()}
                      </div>
                    ) : (
                      <>
                        <div className="flex bg-[#11111b] border-b border-[#2a2b3d] text-[10px] text-gray-400 pt-1">
                          <div className="px-3 py-1.5 border-b-2 border-blue-500 text-white font-bold cursor-pointer bg-[#1e1e2d] mx-1">
                            C#
                          </div>
                          <div className="px-3 py-1.5 cursor-pointer hover:text-white mx-1">
                            GDScript
                          </div>
                          <div className="px-3 py-1.5 cursor-pointer hover:text-white mx-1">
                            C++
                          </div>
                          <div className="px-3 py-1.5 cursor-pointer hover:text-white mx-1">
                            Lua
                          </div>
                          <div className="flex-1"></div>
                          <div className="px-3 py-1.5 text-gray-500">
                            <Settings size={12} />
                          </div>
                        </div>
                        <div className="w-full h-full bg-[#0a0a0f] p-3 overflow-auto custom-scrollbar font-mono text-[12px] leading-6">
                          <pre className="text-gray-300 pointer-events-none">
                            <span className="text-[#58a6ff]">void</span>{" "}
                            <span className="text-[#e3b341]">_process</span>(
                            <span className="text-[#58a6ff]">float</span> delta){" "}
                            {"{\n"}
                            {"  "}
                            <span className="text-[#bc8cff]">if</span> (Input.
                            <span className="text-[#e3b341]">GetKey</span>
                            (KeyCode.W)) {"{\n"}
                            {"    "}
                            <span className="text-[#e3b341]">MoveForward</span>
                            ();{"\n"}
                            {"  }\n"}
                            {"  "}
                            <span className="text-[#bc8cff]">if</span> (Input.
                            <span className="text-[#e3b341]">GetKeyDown</span>
                            (KeyCode.Space)) {"{\n"}
                            {"    "}
                            <span className="text-[#e3b341]">Jump</span>();
                            {"\n"}
                            {"  }\n"}
                            {"}\n"}
                            {"\n"}
                            <span className="text-[#58a6ff]">void</span>{" "}
                            <span className="text-[#e3b341]">MoveForward</span>
                            () {"{\n"}
                            {"  "}transform.
                            <span className="text-[#e3b341]">Translate</span>
                            (Vector3.forward * \n moveSpeed * delta);{"\n"}
                            {"}\n"}
                          </pre>
                        </div>
                      </>
                    )}
                  </Panel>

                  {/* UI DESIGNER */}
                  <Panel
                    show={showUIDesigner}
                    title="UI DESIGNER"
                    className="flex-1 min-w-[340px]"
                  >
                    <div className="flex w-full h-full">
                      <div className="w-[140px] border-r border-[#2a2b3d] p-2 text-[11px] overflow-y-auto shrink-0 bg-[#161726] custom-scrollbar">
                        <TreeItem
                          label="Canvas"
                          icon={
                            <LayoutDashboard
                              size={12}
                              className="text-[#bc8cff]"
                            />
                          }
                          defaultOpen
                        >
                          <TreeItem label="Panel" defaultOpen>
                            <TreeItem
                              label="Health Bar"
                              icon={
                                <LayoutDashboard
                                  size={12}
                                  className="text-[#f85149]"
                                />
                              }
                            />
                            <TreeItem
                              label="Stamina Bar"
                              icon={
                                <LayoutDashboard
                                  size={12}
                                  className="text-[#3fb950]"
                                />
                              }
                            />
                          </TreeItem>
                          <TreeItem
                            label="Inventory"
                            icon={
                              <Database size={12} className="text-[#58a6ff]" />
                            }
                            defaultOpen
                          >
                            <TreeItem label="Slot 1" icon={<Box size={12} />} />
                            <TreeItem label="Slot 2" icon={<Box size={12} />} />
                            <TreeItem label="Slot 3" icon={<Box size={12} />} />
                            <TreeItem
                              label="..."
                              icon={<Box size={12} className="opacity-0" />}
                            />
                          </TreeItem>
                          <TreeItem
                            label="Minimap"
                            icon={<Map size={12} className="text-[#e3b341]" />}
                          />
                          <TreeItem
                            label="Button (Quest)"
                            icon={
                              <LayoutDashboard
                                size={12}
                                className="text-gray-400"
                              />
                            }
                          />
                        </TreeItem>
                      </div>
                      <div className="flex-1 bg-[#101015] relative p-4 overflow-hidden flex items-center justify-center">
                        <div className="relative outline outline-[3px] outline-purple-500/80 shadow-[0_0_20px_rgba(188,140,255,0.4)] w-full max-w-[280px] aspect-video bg-[url('https://images.unsplash.com/photo-1627856013091-fed6e4e043c5?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center rounded-[4px] overflow-hidden">
                          {/* Mock UI Overlay */}
                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            <img
                              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Hero2"
                              className="w-10 h-10 rounded-full border-2 border-[#e3b341] bg-[#1a1b2e] shadow-md"
                              alt="Avatar"
                            />
                            <div className="flex flex-col gap-0.5 w-[120px]">
                              <div className="flex items-center gap-1">
                                <span className="text-[7px] font-black text-white drop-shadow-md">
                                  HP
                                </span>
                                <div className="h-2.5 w-full bg-[#f85149]/80 border border-black/80 relative shadow-sm">
                                  <span className="absolute inset-0 flex items-center justify-center text-[6px] font-black text-white drop-shadow-sm tracking-wider">
                                    100/100
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-[7px] font-black text-white drop-shadow-md">
                                  MP
                                </span>
                                <div className="h-2.5 w-full bg-[#58a6ff]/80 border border-black/80 shadow-sm overflow-hidden">
                                  <div className="w-[70%] h-full bg-[#58a6ff]"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 w-14 h-14 rounded-full border-[3px] border-[#e3b341]/80 bg-black/50 overflow-hidden flex items-center justify-center shadow-lg">
                            <div className="w-full h-full bg-grid-yellow opacity-30"></div>
                            {/* Mini dots for map */}
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full absolute animate-pulse shadow-[0_0_5px_green]"></div>
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full absolute top-2 right-3"></div>
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full absolute bottom-4 left-2"></div>
                          </div>

                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                            <SkillBox icon="0" keyBind="1" />
                            <SkillBox icon="1" keyBind="2" />
                            <SkillBox icon="2" keyBind="3" />
                            <SkillBox icon="5" keyBind="4" />
                            <SkillBox
                              icon="6"
                              keyBind="E"
                              effect="bg-yellow-500"
                              effectPulse
                            />
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button className="bg-[#11111b] text-white rounded-[4px] p-1.5 hover:bg-[#2a2b3d] border border-[#2a2b3d] transition-colors">
                            <Maximize2 size={12} />
                          </button>
                          <button className="bg-[#11111b] text-white rounded-[4px] p-1.5 hover:bg-[#2a2b3d] border border-[#2a2b3d] transition-colors">
                            <Settings size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Panel>
                </div>
              )}

              {/* Extremely Bottom Row */}
              {showExtremelyBottomRow && (
                <div className="h-[140px] flex gap-1.5 shrink-0">
                  <Panel
                    show={showConsole}
                    title={
                      <div className="flex items-center w-full justify-between pr-2">
                        <div className="flex items-center">
                          <Terminal
                            size={12}
                            className="inline mr-1 text-white"
                          />
                          CONSOLE
                          <span className="bg-[#f85149] text-white rounded-[4px] px-1.5 ml-2 font-mono text-[9px] font-bold">
                            0 Error
                          </span>
                          <span className="bg-[#e3b341] text-white rounded-[4px] px-1.5 ml-1 font-mono text-[9px] font-bold">
                            2 Warning
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 pointer-events-auto">
                          <div className="relative flex items-center">
                            <Search
                              size={10}
                              className="absolute left-1.5 text-gray-500"
                            />
                            <input
                              type="text"
                              className="bg-[#0a0a0f] border border-[#2a2b3d] focus:border-[#58a6ff] rounded-[3px] py-0.5 pl-5 pr-2 w-[120px] text-[10px] text-white outline-none placeholder-gray-600 transition-colors"
                              placeholder="Filter logs by keyword... (Ctrl+F)"
                              value={consoleSearch}
                              onChange={(e) => setConsoleSearch(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <button
                            className="text-gray-400 hover:text-white p-0.5 border border-transparent hover:border-[#2a2b3d] rounded-[2px]"
                            title="Level Filter"
                          >
                            <Filter size={10} />
                          </button>
                        </div>
                      </div>
                    }
                    className="w-[300px]"
                  >
                    <div className="w-full h-full bg-[#0a0a0f] p-3 font-mono text-[11px] overflow-auto custom-scrollbar leading-5">
                      <div className="flex gap-3 text-gray-300">
                        <span className="text-gray-500 w-[55px] shrink-0">
                          12:45:01
                        </span>
                        <span className="text-[#f85149]">
                          Project loaded successfully.
                        </span>
                      </div>
                      <div className="flex gap-3 text-gray-300">
                        <span className="text-gray-500 w-[55px] shrink-0">
                          12:45:02
                        </span>
                        <span>
                          Compiling scripts...{" "}
                          <span className="text-[#3fb950]">Done.</span>
                        </span>
                      </div>
                      <div className="flex gap-3 text-gray-300">
                        <span className="text-gray-500 w-[55px] shrink-0">
                          12:45:03
                        </span>
                        <span className="text-[#58a6ff]">Build succeeded.</span>
                      </div>
                    </div>
                  </Panel>

                  <Panel
                    show={showAnimationTimeline}
                    title="ANIMATION TIMELINE"
                    className="flex-1 min-w-[300px]"
                  >
                    <div className="w-full h-full bg-[#161726] flex flex-col overflow-hidden">
                      <div className="flex bg-[#11111b] border-b border-[#2a2b3d] px-2 py-1 items-center gap-3 text-[10px] text-gray-400 shrink-0 select-none">
                        <div className="flex gap-1 border-r border-[#2a2b3d] pr-2">
                          <PlayCircle
                            size={14}
                            className="text-[#58a6ff] hover:text-white cursor-pointer"
                          />
                          <Box
                            size={14}
                            className="hover:text-white cursor-pointer"
                          />
                          <Move
                            size={14}
                            className="hover:text-white cursor-pointer"
                          />
                        </div>
                        <div className="flex gap-1 ml-2 text-[9px] font-mono tracking-widest text-gray-500 w-full relative h-[14px]">
                          <span className="absolute left-[0%]">0:00</span>
                          <span className="absolute left-[20%] text-green-400 font-bold">
                            0:10
                          </span>
                          <span className="absolute left-[40%]">0:20</span>
                          <span className="absolute left-[60%]">0:30</span>
                          <span className="absolute left-[80%]">0:40</span>
                          <span className="absolute left-[100%] pr-4 text-right">
                            1:00
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 relative overflow-hidden flex bg-[#1e1e2d]">
                        {/* Left Label area */}
                        <div className="w-[120px] border-r border-[#2a2b3d] bg-[#11111b] text-[10px] text-gray-300 font-mono py-1 overflow-y-auto hide-scrollbar z-10 shrink-0">
                          <div className="px-2 py-0.5 cursor-pointer flex items-center gap-1.5 bg-[#2a2b3d]/50 font-bold">
                            <Film size={12} className="text-[#bc8cff]" />{" "}
                            Hero_Anim
                          </div>
                          <div className="px-2 py-0.5 ml-4 cursor-pointer flex items-center gap-1.5 hover:text-white">
                            <Film size={12} className="text-[#3fb950]" /> Walk
                          </div>
                          <div className="px-2 py-0.5 ml-4 cursor-pointer flex items-center gap-1.5 hover:text-white">
                            <Film size={12} className="text-[#bc8cff]" /> Run
                          </div>
                          <div className="px-2 py-0.5 ml-4 cursor-pointer flex items-center gap-1.5 hover:text-white">
                            <Film size={12} className="text-[#58a6ff]" /> Jump
                          </div>
                          <div className="px-2 py-0.5 ml-4 cursor-pointer flex items-center gap-1.5 hover:text-white">
                            <Film size={12} className="text-[#e3b341]" /> Attack
                          </div>
                        </div>

                        {/* Timeline Area */}
                        <div className="flex-1 relative overflow-hidden bg-[#1e1e2d]">
                          {/* Grid lines */}
                          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49px,#ffffff05_50px)] bg-[length:50px_100%] pointer-events-none"></div>
                          <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_19px,#ffffff05_20px)] bg-[length:100%_20px] pointer-events-none mt-[2px]"></div>

                          {/* Mock Keyframes Tracks */}
                          <div className="absolute top-[26px] left-0 w-full h-[10px]">
                            <div className="absolute left-[10%] w-2.5 h-2.5 bg-[#3fb950] rotate-45 top-0 outline outline-[1.5px] outline-[#1e1e2d] z-10 box-border"></div>
                            <div className="absolute left-[30%] w-2.5 h-2.5 bg-[#3fb950] rotate-45 top-0 outline outline-[1.5px] outline-[#1e1e2d] z-10 box-border"></div>
                            <div className="absolute left-[10%] w-[20%] h-1.5 bg-[#3fb950]/40 top-[2px]"></div>
                          </div>
                          <div className="absolute top-[46px] left-0 w-full h-[10px]">
                            <div className="absolute left-[40%] w-2.5 h-2.5 bg-[#bc8cff] rotate-45 top-0 outline outline-[1.5px] outline-[#1e1e2d] z-10 box-border"></div>
                            <div className="absolute left-[60%] w-2.5 h-2.5 bg-[#bc8cff] rotate-45 top-0 outline outline-[1.5px] outline-[#1e1e2d] z-10 box-border"></div>
                            <div className="absolute left-[40%] w-[20%] h-1.5 bg-[#bc8cff]/40 top-[2px]"></div>
                          </div>
                          <div className="absolute top-[66px] left-0 w-full h-[10px]">
                            <div className="absolute left-[20%] w-2.5 h-2.5 bg-[#58a6ff] rotate-45 top-0 outline outline-[1.5px] outline-[#1e1e2d] z-10 box-border"></div>
                            <div className="absolute left-[50%] w-2.5 h-2.5 bg-[#58a6ff] rotate-45 top-0 outline outline-[1.5px] outline-[#1e1e2d] z-10 box-border"></div>
                            <div className="absolute left-[20%] w-[30%] h-1.5 bg-[#58a6ff]/40 top-[2px]"></div>
                          </div>
                          <div className="absolute top-[86px] left-0 w-full h-[10px]">
                            <div className="absolute left-[70%] w-2.5 h-2.5 bg-[#e3b341] rotate-45 top-0 outline outline-[1.5px] outline-[#1e1e2d] z-10 box-border"></div>
                            <div className="absolute left-[85%] w-2.5 h-2.5 bg-[#e3b341] rotate-45 top-0 outline outline-[1.5px] outline-[#1e1e2d] z-10 box-border"></div>
                            <div className="absolute left-[70%] w-[15%] h-1.5 bg-[#e3b341]/40 top-[2px]"></div>
                          </div>

                          {/* Playhead */}
                          <div className="absolute top-0 bottom-0 left-[20%] w-[1px] bg-green-400 shadow-[0_0_8px_#3fb950] z-20">
                            <div className="w-2.5 h-2.5 bg-green-400 absolute -top-1.5 -left-[4.5px] rounded-sm"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Panel>

                  <Panel
                    show={showAssetsPreview}
                    title="ASSETS PREVIEW"
                    className="w-[300px]"
                  >
                    <div className="w-full h-full p-2 bg-[#1e1e2d] flex items-center justify-around overflow-auto hide-scrollbar">
                      <AssetPreviewCard
                        img="https://api.dicebear.com/7.x/adventurer/svg?seed=1"
                        name="Hero Walk"
                      />
                      <AssetPreviewCard
                        img="https://api.dicebear.com/7.x/adventurer/svg?seed=2"
                        name="Hero Run"
                      />
                      <AssetPreviewCard
                        img="https://api.dicebear.com/7.x/adventurer/svg?seed=3"
                        name="Hero Jump"
                      />
                      <AssetPreviewCard
                        img="https://api.dicebear.com/7.x/adventurer/svg?seed=4"
                        name="Attack"
                      />
                      <AssetPreviewCard
                        img="https://api.dicebear.com/7.x/shapes/svg?seed=5&backgroundColor=000000"
                        name="Magic Effect"
                      />
                    </div>
                  </Panel>

                  <Panel
                    show={showExport}
                    title="EXPORT / PUBLISH"
                    className="w-[260px]"
                  >
                    <div className="w-full h-full bg-[#161726] p-3 flex flex-col justify-between">
                      <div className="flex gap-4 px-2 justify-center flex-wrap mt-2">
                        <PlatformIcon
                          icon={
                            <MonitorPlay size={18} className="text-[#58a6ff]" />
                          }
                          label="Windows"
                        />
                        <PlatformIcon
                          icon={<Bot size={18} className="text-[#3fb950]" />}
                          label="Android"
                        />
                        <PlatformIcon
                          icon={<Layers size={18} className="text-gray-300" />}
                          label="iOS"
                        />
                        <PlatformIcon
                          icon={<Globe size={18} className="text-white" />}
                          label="Web"
                        />
                        <PlatformIcon
                          icon={
                            <Terminal size={18} className="text-gray-300" />
                          }
                          label="Linux"
                        />
                        <PlatformIcon
                          icon={<Hexagon size={18} className="text-gray-300" />}
                          label="Steam"
                        />
                        <PlatformIcon
                          icon={<Database size={18} className="text-white" />}
                          label="PlayStation"
                        />
                        <PlatformIcon
                          icon={
                            <XCircle size={18} className="text-[#3fb950]" />
                          }
                          label="Xbox"
                        />
                        <PlatformIcon
                          icon={
                            <Gamepad2 size={18} className="text-[#f85149]" />
                          }
                          label="Nintendo Switch"
                        />
                      </div>
                      <button className="bg-gradient-to-r from-purple-600 to-blue-600 w-full rounded-[4px] py-1.5 text-[12px] font-black tracking-widest shadow-lg opacity-90 hover:opacity-100 flex items-center justify-center gap-2 mt-2 border border-purple-500/50">
                        <PlayCircle size={14} /> EXPORT PROJECT
                      </button>
                    </div>
                  </Panel>
                </div>
              )}
            </div>
          ) : (
            renderActiveTool() || (
              <GenericToolPanel toolId={activeTool || ""} tools={tools} />
            )
          )}
        </div>
      </div>

      {/* Floating 3D Viewport Overlay */}
      {showFloatingViewport && (
        <div
          style={{ left: viewportPos.x, top: viewportPos.y }}
          className="absolute min-w-[300px] min-h-[200px] w-[600px] h-[400px] bg-[#161726] border border-[#2a2b3d] rounded-lg shadow-2xl flex flex-col z-[100] resize overflow-hidden"
        >
          <div
            className="h-8 bg-[#11111b] border-b border-[#2a2b3d] flex items-center px-3 justify-between shrink-0 cursor-move rounded-t-lg select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className="flex items-center gap-2 text-white text-[11px] font-bold">
              <Box size={14} className="text-[#58a6ff]" /> 3D Viewport
            </div>
            <div className="flex gap-2">
              <X
                size={14}
                className="text-gray-400 hover:text-white cursor-pointer"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setShowFloatingViewport(false)}
              />
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <Viewport3D
              activeTool={activeTool || ""}
              activeFile={undefined}
              globalActiveTransformTool={activeSecondaryTool}
            />
          </div>
        </div>
      )}

      {showResourceOverlay && (
        <SystemResourceMonitor
          mode="overlay"
          onClose={() => setShowResourceOverlay(false)}
        />
      )}

      <OmniWorkflowNavigatorModal
        isOpen={isWorkflowNavigatorOpen}
        onClose={() => setIsWorkflowNavigatorOpen(false)}
        onSelectTool={(id) => {
          setActiveTool(id);
          setIsWorkflowNavigatorOpen(false);
        }}
        tools={tools}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3a3b50; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #58a6ff; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .bg-grid-yellow { background-image: radial-gradient(#e3b341 1px, transparent 1px); background-size: 8px 8px; }
        .left-line::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 1px; background: #2a2b3d; }
      `,
        }}
      />
    </div>
  );
}

// -------------------------------------------------------------------------------------------------
// Helper Sub-Components
// -------------------------------------------------------------------------------------------------

function Panel({
  title,
  children,
  hideHeader,
  className = "",
  tab,
  show = true,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  hideHeader?: boolean;
  className?: string;
  tab?: React.ReactNode;
  show?: boolean;
}) {
  if (!show) return null;
  return (
    <div
      className={`bg-[#1e1e2d] border border-[#2a2b3d] flex flex-col rounded-[4px] overflow-hidden shadow-sm ${className}`}
    >
      {!hideHeader && !tab && (
        <div className="h-[28px] bg-[#11111b] flex justify-between items-center px-3 shrink-0 text-[10px] font-bold tracking-widest text-gray-300 select-none border-b border-[#2a2b3d]">
          <span className="uppercase flex items-center">{title}</span>
          <div className="flex gap-2 opacity-50">
            <button className="hover:text-[#58a6ff] transition-colors">
              <Settings size={12} />
            </button>
            <button className="hover:text-[#58a6ff] transition-colors">
              <Maximize2 size={12} />
            </button>
            <button className="hover:text-[#f85149] transition-colors">
              <X size={12} />
            </button>
          </div>
        </div>
      )}
      {tab && (
        <div className="bg-[#1e1e2d] flex items-end pt-1 px-1 border-b border-[#2a2b3d]">
          {tab}
          <div className="flex-1"></div>
          <div className="flex gap-1.5 opacity-50 pb-1 pr-2">
            <button className="hover:text-white transition-colors">
              <Settings size={12} />
            </button>
            <button className="hover:text-white transition-colors">
              <Maximize2 size={12} />
            </button>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-hidden relative">{children}</div>
    </div>
  );
}

function ToolBtn({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;

}) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center justify-center px-3 py-1 rounded-[4px] cursor-pointer min-w-[50px] transition-all hover:bg-[#2a2b3d]/50 ${active ? "bg-[#2a2b3d] text-white shadow-inner border border-[#3a3b50]" : "text-gray-400 hover:text-white border border-transparent"}`}
    >
      {icon}
      <span className="text-[10px] mt-1 tracking-wide font-medium">
        {label}
      </span>
    </div>
  );
}

function MenuDropdown({
  label,
  items,
  active,
  onOpen,
  onClose,
}: {
  label: string;
  items: {
    label: string;
    shortcut?: string;
    icon?: React.ReactNode;
    divider?: boolean;
    onClick?: () => void;
  }[];
  active: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (active) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [active, onClose]);

  return (
    <div className="relative inline-block" ref={ref}>
      <span
        onClick={() => (active ? onClose() : onOpen())}
        className={`px-2 py-1 rounded cursor-pointer select-none transition-colors break-keep whitespace-nowrap ${active ? "bg-[#2a2b3d] text-white" : "hover:bg-[#2a2b3d]/50 hover:text-white"}`}
      >
        {label}
      </span>
      {active && (
        <div className="absolute top-[120%] left-0 min-w-[200px] bg-[#1a1b2e] border border-[#2a2b3d] rounded-md shadow-2xl py-1 z-[1000] font-normal tracking-normal text-gray-300">
          {items.map((item, i) =>
            item.divider ? (
              <div key={i} className="h-[1px] bg-[#2a2b3d] my-1 w-full" />
            ) : (
              <div
                key={i}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  onClose();
                }}
                className="flex items-center justify-between px-3 py-1.5 hover:bg-[#2a2b3d] cursor-pointer group whitespace-nowrap"
              >
                <div className="flex items-center gap-2 text-white">
                  {item.icon && (
                    <span className="text-gray-400 group-hover:text-white">
                      {item.icon}
                    </span>
                  )}
                  <span className="text-[12px]">{item.label}</span>
                </div>
                {item.shortcut && (
                  <span className="text-[10px] text-gray-500 font-mono ml-4">
                    {item.shortcut}
                  </span>
                )}
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}

function SideBtn({
  icon,
  label,
  active,
  onClick,
  onMouseEnter,
  subTools,
  onSubSelect,
  activeTool,
}: {

  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  onMouseEnter?: (e?: React.MouseEvent) => void;
  subTools?: any[];
  onSubSelect?: (id: string) => void;
  activeTool?: string;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      className={`relative flex flex-col items-center justify-center w-full py-2 cursor-pointer transition-all border-l-[3px] group ${active ? "border-blue-500 bg-[#2a2b3d] shadow-inner text-white" : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#2a2b3d]/50 hover:border-gray-600"}`}
    >
      <div
        onClick={onClick}
        className="flex flex-col items-center justify-center w-full h-full"
      >
        <div
          className={`group-hover:scale-110 transition-transform ${active ? "" : "opacity-80"}`}
        >
          {icon}
        </div>
        <span className="text-[9px] mt-1 tracking-wide font-medium text-center leading-tight px-1">{label}</span>
      </div>

    </div>
  );
}

function SortableSideBtn(props: {
  id: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  subTools?: any[];
  onSubSelect?: (id: string) => void;
  activeTool?: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : "auto",
    position: isDragging ? ("relative" as const) : ("static" as const),
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="w-full">
      <SideBtn {...props} />
    </div>
  );
}

function SortablePanelWrapper({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : "auto",
    cursor: "move",
    display: "flex",
    flexDirection: "column" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="h-full flex-shrink-0 flex items-stretch"
    >
      {children}
    </div>
  );
}

function TreeItem({
  label,
  icon,
  children,
  defaultOpen,
  active,
}: {
  label: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  active?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen || false);
  return (
    <div className="flex flex-col">
      <div
        className={`flex items-center gap-1.5 py-1 px-1.5 rounded-[4px] cursor-pointer select-none ${active ? "bg-blue-600/30 text-[#58a6ff] font-bold" : "text-gray-300 hover:bg-[#2a2b3d]"}`}
        onClick={() => setOpen(!open)}
      >
        {children ? (
          <ChevronDown
            size={12}
            className={`text-gray-500 transition-transform ${open ? "" : "-rotate-90"}`}
          />
        ) : (
          <span className="w-[12px] inline-block" />
        )}
        {icon || <Box size={12} className="text-gray-600" />}
        <span className="truncate flex-1 text-[11px] font-medium tracking-wide">
          {label}
        </span>
      </div>
      {open && children && (
        <div className="ml-[14px] pl-2 flex flex-col relative left-line">
          {children}
        </div>
      )}
    </div>
  );
}

function InspectorCategory({
  title,
  children,
  defaultOpen,
  iconColor = "text-yellow-500",
}: {
  title: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  iconColor?: string;
}) {
  const [open, setOpen] = useState(defaultOpen || false);
  return (
    <div className="mb-1.5 rounded-[4px] overflow-hidden border border-[#2a2b3d]">
      <div
        className={`flex items-center gap-2 bg-[#161726] hover:bg-[#2a2b3d] px-2 py-1.5 cursor-pointer text-gray-300 font-bold text-[11px] select-none transition-colors border-b border-[#2a2b3d]`}
        onClick={() => setOpen(!open)}
      >
        <ChevronDown
          size={14}
          className={`transition-transform flex-shrink-0 ${open ? "" : "-rotate-90"}`}
        />
        <LayoutDashboard size={14} className={`${iconColor} flex-shrink-0`} />
        <span className="tracking-wide">{title}</span>
      </div>
      {open && children && <div className="p-2 bg-[#101015]">{children}</div>}
    </div>
  );
}

function PropInput({
  label,
  val,
  color,
}: {
  label: string;
  val: string;
  color: string;
}) {
  return (
    <div className="flex items-center bg-[#1e1e2d] border border-[#2a2b3d] rounded-[4px] px-1.5 py-0.5 overflow-hidden focus-within:border-gray-500 transition-colors">
      <span
        className={`${color} text-[10px] font-black mr-1.5 w-3 text-center`}
      >
        {label}
      </span>
      <input
        type="text"
        className="bg-transparent border-none outline-none w-full text-[11px] text-white font-mono"
        defaultValue={val}
      />
    </div>
  );
}

function AssetCard({ img, name }: { img: string; name: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 cursor-pointer group p-1 rounded-[4px] hover:bg-[#2a2b3d]/50 transition-colors border border-transparent hover:border-[#3a3b50]">
      <div className="w-[52px] h-[52px] bg-black border-[2px] border-[#2a2b3d] rounded-[4px] group-hover:border-[#58a6ff] overflow-hidden relative shadow-sm transition-colors">
        <img
          src={img}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          alt={name}
        />
      </div>
      <span className="text-[9px] text-gray-400 group-hover:text-white truncate w-full text-center font-medium tracking-wide">
        {name}
      </span>
    </div>
  );
}

function NodeMock({
  title,
  color,
  content,
  x,
  y,
  border,
}: {
  title: string;
  color: string;
  content: React.ReactNode;
  x: number;
  y: number;
  border?: string;
}) {
  return (
    <div
      className={`absolute min-w-[130px] bg-[#1e1e2d] rounded-[6px] shadow-xl overflow-visible flex flex-col z-10 ${border || "border border-[#2a2b3d]"}`}
      style={{ left: x, top: y }}
    >
      <div
        className={`h-[22px] ${color} w-full flex items-center px-2 text-white text-[9px] font-bold shrink-0 rounded-t-[5px] justify-between shadow-sm tracking-widest`}
      >
        <span>{title}</span>
        <X size={10} className="opacity-50 hover:opacity-100 cursor-pointer" />
      </div>
      <div className="p-1 px-1.5 min-h-[20px] text-gray-300 relative font-medium w-full">
        {content}
      </div>
    </div>
  );
}

function EventRow({
  num,
  cond,
  condColor,
  condText,
  act,
}: {
  num: number;
  cond: string;
  condColor?: string;
  condText: string;
  act: string;
}) {
  return (
    <div className="grid grid-cols-[24px_auto_1fr_1fr] items-stretch text-[10px] border-b border-[#2a2b3d] last:border-none group shadow-sm hover:bg-[#2a2b3d]/30 transition-colors">
      <div className="bg-[#2a2b3d] text-center w-full flex items-center justify-center font-bold text-gray-400 shrink-0 border-r border-[#2a2b3d]">
        {num}
      </div>
      <div
        className={`px-2 py-1.5 flex items-center gap-1.5 font-bold border-r border-[#2a2b3d] whitespace-nowrap min-w-[80px] ${condColor || "text-white"}`}
      >
        <img
          src={`https://api.dicebear.com/7.x/icons/svg?seed=${num}`}
          className="w-[14px] h-[14px] opacity-80"
          alt=""
        />
        {cond}
      </div>
      <div className="px-2 py-1.5 text-white flex items-center border-r border-[#2a2b3d] tracking-wide bg-[#11111b]/50 group-hover:bg-transparent">
        {condText}
      </div>
      <div className="px-2 py-1.5 text-gray-300 flex items-center gap-1.5 tracking-wide">
        <div className="w-[12px] h-[12px] rounded-sm inline-flex items-center justify-center shrink-0 border border-[#444] bg-[#222]">
          →
        </div>{" "}
        {act}
      </div>
    </div>
  );
}

function AssetPreviewCard({ img, name }: { img: string; name: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 cursor-pointer outline outline-[2px] outline-transparent hover:outline-[#58a6ff] hover:bg-[#2a2b3d]/50 p-2 rounded-[6px] transition-all">
      <div className="w-[60px] h-[60px] bg-black border-[2px] border-[#2a2b3d] rounded-[4px] overflow-hidden shadow-md relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
        <img src={img} className="w-full h-full object-cover" alt={name} />
      </div>
      <span className="text-[9px] text-gray-300 text-center font-bold tracking-widest leading-tight">
        {name}
      </span>
    </div>
  );
}

function PlatformIcon({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
      <div className="text-white drop-shadow-md">{icon}</div>
      <span className="text-[8px] text-gray-400 tracking-widest font-bold uppercase">
        {label}
      </span>
    </div>
  );
}

function SkillBox({
  icon,
  keyBind,
  effect,
  effectPulse,
}: {
  icon: string;
  keyBind: string;
  effect?: string;
  effectPulse?: boolean;
}) {
  return (
    <div className="relative w-[34px] h-[34px]">
      {effect && (
        <div
          className={`absolute inset-0 ${effect} ${effectPulse ? "animate-pulse" : ""} blur-sm rounded-[4px] shadow-[0_0_10px_currentColor] scale-110`}
        ></div>
      )}
      <div className="w-full h-full bg-gradient-to-b from-[#333] to-[#111] border-2 border-[#444] hover:border-[#58a6ff] rounded-[4px] flex items-center justify-center relative z-10 shadow-inner cursor-pointer transition-colors overflow-hidden">
        <img
          src={`https://api.dicebear.com/7.x/icons/svg?seed=skill${icon}`}
          className="w-6 h-6 opacity-90 drop-shadow-md"
          alt=""
        />
      </div>
      <div className="absolute -bottom-1.5 right-1 text-[6px] bg-black px-1 rounded text-white font-black border border-[#555] z-20 shadow-md min-w-[14px] text-center">
        {keyBind}
      </div>
    </div>
  );
}
