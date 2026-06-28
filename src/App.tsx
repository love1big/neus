import React, { useState } from "react";
import {
  Zap,
  Command,
  Droplet,
  Paintbrush,
  Boxes,
  Camera,
  Gauge,
  Flame,
  Server,
  Share2,
  Microchip,
  TerminalSquare,
  Network,
  Crosshair,
  LayoutDashboard,
  Brain,
  Rocket,
  Bot,
  Map,
  GitPullRequest,
  Globe,
  AudioWaveform,
  PersonStanding,
  Cpu,
  MonitorPlay,
  Orbit,
  Gamepad2,
  ShieldCheck,
  Blocks,
  FolderTree,
  Globe2,
  Users,
  Ghost,
  Box,
  Clapperboard,
  UserSquare,
  Waypoints,
  Database,
  Palette,
  Image,
  Swords,
  FlaskConical,
  Bug,
  Video,
  Activity,
  Layers,
  BrainCircuit,
  Glasses,
  Terminal,
  MemoryStick,
  Mic2,
  GitMerge,
  Binary,
  Wrench,
  SearchCode,
  SplitSquareHorizontal,
  AlignLeft,
  Search,
  Eye,
  Cloud,
  BookOpen,
  GitBranch,
  X,
  Grip,
  Download,
  Wifi,
  Puzzle,
  CircuitBoard,
} from "lucide-react";
import { LanguageCode } from "./contexts/LanguageContext";
import ArchitectureDevOpsEditor from "./components/ArchitectureDevOpsEditor";
import AssetStore from "./components/AssetStore";
import BasicSkeletonModel from "./components/BasicSkeletonModel";
import BlueprintEditor from "./components/BlueprintEditor";
import BuildPublishEditor from "./components/BuildPublishEditor";
import ChronoDebugger from "./components/ChronoDebugger";
import CinematicDirector from "./components/CinematicDirector";
import CinematicLightingEditor from "./components/CinematicLightingEditor";
import CinematicSequencerEditor from "./components/CinematicSequencerEditor";
import CodeEditor from "./components/CodeEditor";
import CodeProfilerTracer from "./components/CodeProfilerTracer";
import ContentBrowser from "./components/ContentBrowser";
import CutsceneEditor from "./components/CutsceneEditor";
import DataTableEditor from "./components/DataTableEditor";
import DeviceDriverConfigPanel from "./components/DeviceDriverConfigPanel";
import EconomicBalancer from "./components/EconomicBalancer";
import EngineCoreEditor from "./components/EngineCoreEditor";
import FigmaStyleCanvas from "./components/FigmaStyleCanvas";
import GameEconomyBalancer from "./components/GameEconomyBalancer";
import GameEngineProfiler from "./components/GameEngineProfiler";
import GamePreview from "./components/GamePreview";
import GameSystemsEditor from "./components/GameSystemsEditor";
import PCGEditor from "./components/PCGEditor";
import LocalAIStudio from "./components/LocalAIStudio";
import BatchAIImporter from "./components/BatchAIImporter";
import VoiceMusicStudio from "./components/VoiceMusicStudio";
import GPUComputeCluster from "./components/GPUComputeCluster";
import AIOfflinePCBStudio from "./components/AIOfflinePCBStudio";
import AICommandCenter from "./components/AICommandCenter";
import AudioEditor from "./components/AudioEditor";
import GitPanel from "./components/GitPanel";
import GlobalSearchPanel from "./components/GlobalSearchPanel";
import GlobalUniversalDetailsPanel from "./components/GlobalUniversalDetailsPanel";
import GraphicsRenderEditor from "./components/GraphicsRenderEditor";
import HardwareProfilerOverlay from "./components/HardwareProfilerOverlay";
import HoudiniStyleProceduralNode from "./components/HoudiniStyleProceduralNode";
import IDECompilerCore from "./components/IDECompilerCore";
import ImageEditor from "./components/ImageEditor";
import LiveOpsDashboard from "./components/LiveOpsDashboard";
import LiveOpsEventScheduler from "./components/LiveOpsEventScheduler";
import LogViewer from "./components/LogViewer";
import MLAgentsEditor from "./components/MLAgentsEditor";
import MapEdit from "./components/MapEdit";
import ManualSequenceRecorder from "./components/ManualSequenceRecorder";
import MaterialEditor from "./components/MaterialEditor";
import MetaHumanEditor from "./components/MetaHumanEditor";
import ModdingWorkshopPublisher from "./components/ModdingWorkshopPublisher";
import ModelingEditor from "./components/ModelingEditor";
import NPCEditor from "./components/NPCEditor";
import NavMeshRouter from "./components/NavMeshRouter";
import NetcodeEditor from "./components/NetcodeEditor";
import NetworkReplicationSim from "./components/NetworkReplicationSim";
import NetworkSim from "./components/NetworkSim";
import AIWorkflowEditor from "./components/AIWorkflowEditor";
import Offline3DModeler from "./components/Offline3DModeler";
import AIOfflineDownloader from "./components/AIOfflineDownloader";
import OmniAIAssistantStudio from "./components/OmniAIAssistantStudio";
import OmniAnimationStudio from "./components/OmniAnimationStudio";
import OmniAudioDSPStudio from "./components/OmniAudioDSPStudio";
import OmniBackendNetworkingStudio from "./components/OmniBackendNetworkingStudio";
import OmniCreatorMaster from "./components/OmniCreatorMaster";
import OmniEngineIDE from "./components/OmniEngineIDE";
import OmniMegaWorldBuilder from "./components/OmniMegaWorldBuilder";
import OmniNarrativeQuestStudio from "./components/OmniNarrativeQuestStudio";
import OmniVFXCompositorStudio from "./components/OmniVFXCompositorStudio";
import OmniVFXParticleStudio from "./components/OmniVFXParticleStudio";
import OmniVisualScriptingEngine from "./components/OmniVisualScriptingEngine";
import OptimizationEncyclopedia from "./components/OptimizationEncyclopedia";
import OptimizationOverview from "./components/OptimizationOverview";
import PerformanceProfiler from "./components/PerformanceProfiler";
import Photogrammetry3DScanner from "./components/Photogrammetry3DScanner";
import PhotogrammetryMeshBuilder from "./components/PhotogrammetryMeshBuilder";
import PipelineEditor from "./components/PipelineEditor";
import PopOutPanel from "./components/PopOutPanel";
import ProceduralAssetStudio from "./components/ProceduralAssetStudio";
import ProjectSettingsEditor from "./components/ProjectSettingsEditor";
import QuickStartDashboard from "./components/QuickStartDashboard";
import RenderFarmManager from "./components/RenderFarmManager";
import ResourceUsageTab from "./components/ResourceUsageTab";
import ScriptEditor from "./components/ScriptEditor";
import SettingsModal from "./components/SettingsModal";
import SkillForgeEditor from "./components/SkillForgeEditor";
import SubstanceStyleTexturePainter from "./components/SubstanceStyleTexturePainter";
import TaskPanel from "./components/TaskPanel";
import TerrainGenerator from "./components/TerrainGenerator";
import ThaiPhoneticsEngine from "./components/ThaiPhoneticsEngine";
import NexusPluginArchitect from "./components/NexusPluginArchitect";
import TopologyUVPro from "./components/TopologyUVPro";
import UIUXEditor from "./components/UIUXEditor";
import UXCognitiveLoadSim from "./components/UXCognitiveLoadSim";
import VRXREngineEditor from "./components/VRXREngineEditor";
import VehicleDynamicsEditor from "./components/VehicleDynamicsEditor";
import VehicleDynamicsTuner from "./components/VehicleDynamicsTuner";
import Viewport3D from "./components/Viewport3D";
import WorldLoreEditor from "./components/WorldLoreEditor";
import ZBrushStyleSculptingStudio from "./components/ZBrushStyleSculptingStudio";
import CommandPalette from "./components/CommandPalette";
import RegexTesterPanel from "./components/RegexTesterPanel";
import FontEditor from "./components/FontEditor";
import EyeTrackingHeatmap from "./components/EyeTrackingHeatmap";
import MonsterEditor from "./components/MonsterEditor";
import InputMapping from "./components/InputMappingEditor";
import AccessibilityTester from "./components/AccessibilityTester";
import VideoEncoderStudio from "./components/VideoEncoderStudio";
import HexEditorPanel from "./components/HexEditorPanel";
import ASTNodeWeaver from "./components/ASTNodeWeaver";
import GenericToolPanel from "./components/GenericToolPanel";
import KernelDebugger from "./components/KernelDebugger";
import MemoryProfiler from "./components/MemoryProfiler";
import SystemTap from "./components/SystemTap";
import AppProfiler from "./components/AppProfiler";
import VCSConflict from "./components/VCSConflict";
import HardwareConfig from "./components/HardwareConfig";
import TerminalSvr from "./components/TerminalSvr";
import DockerManager from "./components/DockerManager";
import BuildMonitor from "./components/BuildMonitor";
import CompilerTool from "./components/CompilerTool";
import CloudBuildPipeline from "./components/CloudBuildPipeline";
import VectorHybrid from "./components/VectorHybrid";
import SpriteSheetGen from "./components/SpriteSheetGen";
import InteractionPrototyper from "./components/InteractionPrototyper";

import AIChat from "./components/AIChat";
import { MessageCircle } from "lucide-react";

export default function App() {
  const [activeTool, setActiveTool] = useState("OmniCreatorMaster");
  const [showGlobalChat, setShowGlobalChat] = useState(false);
  const [globalCode, setGlobalCode] = useState("");
  const [globalLanguage, setGlobalLanguage] = useState<LanguageCode>(
    "cpp" as any,
  );

  const [chatSize, setChatSize] = useState({ width: 315, height: 420 });
  const [isResizing, setIsResizing] = useState(false);

  React.useEffect(() => {
    const handleSwitchTool = (e: any) => {
      if (e.detail && typeof e.detail === "string") {
        setActiveTool(e.detail);
      }
    };
    window.addEventListener("switch-tool", handleSwitchTool);
    return () => window.removeEventListener("switch-tool", handleSwitchTool);
  }, []);

  React.useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      // Chat is fixed at bottom-20 (80px), right-6 (24px)
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

  const tools = [
    // 🌟 ASCENSION & DASHBOARD
    {
      id: "OmniCreatorMaster",
      title: "Global Omniverse Dashboard",
      icon: <Command size={20} />,
      activeColor: "text-[#f85149]",
      category: "🌟 ASCENSION STUDIO",
    },
    {
      id: "QuickStart",
      title: "Home / Project Hub",
      icon: <Rocket size={20} />,
      activeColor: "text-[#e3b341]",
      category: "🌟 ASCENSION STUDIO",
    },
    {
      id: "TaskPanel",
      title: "Agile Task Sprint Board",
      icon: <SearchCode size={20} />,
      activeColor: "text-[#3fb950]",
      category: "🌟 ASCENSION STUDIO",
    },

    // 🤖 AI & LOGIC
    {
      id: "AIOfflineDownloader",
      title: "Ultimate Offline AI Hub (100% On-Device Models)",
      icon: <Cpu size={20} />,
      activeColor: "text-[#3fb950]",
      category: "🤖 AI & LOGIC",
    },
    {
      id: "AICommandCenter",
      title: "AI Swarm Command Center & Orchestrator",
      icon: <Bot size={20} />,
      activeColor: "text-[#f85149]",
      category: "🤖 AI & LOGIC",
    },
    {
      id: "LocalAIStudio",
      title: "Local AI Studio & Neural Engine Manager",
      icon: <Brain size={20} />,
      activeColor: "text-[#bc8cff]",
      category: "🤖 AI & LOGIC",
    },
    {
      id: "OmniAIAssistantStudio",
      title: "AI Swarm & Offline Models Assistant",
      icon: <Bot size={20} />,
      activeColor: "text-[#bc8cff]",
      category: "🤖 AI & LOGIC",
    },
    {
      id: "Workflow",
      title: "AI Workflow & Node Graph Pipelines",
      icon: <Waypoints size={20} />,
      activeColor: "text-[#58a6ff]",
      category: "🤖 AI & LOGIC",
    },
    {
      id: "BatchAIImporter",
      title: "Batch AI Asset & Knowledge Importer",
      icon: <Cloud size={20} />,
      activeColor: "text-[#e3b341]",
      category: "🤖 AI & LOGIC",
    },
    {
      id: "OmniVisualScripting",
      title: "Visual Node Workflow",
      icon: <Network size={20} />,
      activeColor: "text-[#58a6ff]",
      category: "🤖 AI & LOGIC",
    },
    {
      id: "Select",
      title: "Code Editor & IDE",
      icon: <TerminalSquare size={20} />,
      activeColor: "text-[#ff7b72]",
      category: "🤖 AI & LOGIC",
    },

    // 🌍 WORLD & MAPS
    {
      id: "OmniWorldBuilder",
      title: "Omni MegaWorld Builder (2D/3D/Terrain)",
      icon: <Globe size={20} />,
      activeColor: "text-[#58a6ff]",
      category: "🌍 WORLD BUILDING",
    },
    {
      id: "MapEdit",
      title: "Map Edit (Level & Instance Editor)",
      icon: <Map size={20} />,
      activeColor: "text-[#3fb950]",
      category: "🌍 WORLD BUILDING",
    },

    // 🎮 GAME DESIGN & LORE
    {
      id: "GameSystems",
      title: "Game Systems Editor",
      icon: <Blocks size={20} />,
      activeColor: "text-[#58a6ff]",
      category: "🎮 GAME DESIGN",
    },
    {
      id: "NPCEdit",
      title: "Entity & NPC Editor",
      icon: <Users size={20} />,
      activeColor: "text-[#ff7b72]",
      category: "🎮 GAME DESIGN",
    },
    {
      id: "WorldLore",
      title: "World Lore & Story",
      icon: <BookOpen size={20} />,
      activeColor: "text-[#bc8cff]",
      category: "🎮 GAME DESIGN",
    },
    {
      id: "EconomicBalancer",
      title: "Combat & Economy Balance",
      icon: <Database size={20} />,
      activeColor: "text-[#e3b341]",
      category: "🎮 GAME DESIGN",
    },

    // 🎨 ART, 3D & TEXTURES
    {
      id: "Modeling",
      title: "3D/2D Modeling Studio",
      icon: <Box size={20} />,
      activeColor: "text-[#e3b341]",
      category: "🎨 ART STUDIO",
    },
    {
      id: "PhotogrammetryMeshBuilder",
      title: "Photogrammetry Scanner",
      icon: <Camera size={20} />,
      activeColor: "text-[#bc8cff]",
      category: "🎨 ART STUDIO",
    },
    {
      id: "ImageEdit",
      title: "Texture & Material Editor",
      icon: <Palette size={20} />,
      activeColor: "text-[#ff7b72]",
      category: "🎨 ART STUDIO",
    },
    {
      id: "OmniVFXStudio",
      title: "VFX & Particle Studio",
      icon: <Flame size={20} />,
      activeColor: "text-[#f85149]",
      category: "🎨 ART STUDIO",
    },

    // 📐 UI & UX
    {
      id: "UIUXEdit",
      title: "UI/UX State Visual Builder",
      icon: <LayoutDashboard size={20} />,
      activeColor: "text-[#58a6ff]",
      category: "📐 UI & UX",
    },

    // 🎵 AUDIO & VOICE
    {
      id: "VoiceMusicStudio",
      title: "Voice & Procedural Audio Studio",
      icon: <Mic2 size={20} />,
      activeColor: "text-[#58a6ff]",
      category: "🎵 AUDIO & SOUND",
    },

    // 🎬 CINEMATICS & ANIMATION
    {
      id: "Sequencer",
      title: "Timeline & Cinematic Sequencer",
      icon: <Clapperboard size={20} />,
      activeColor: "text-[#bc8cff]",
      category: "🎬 ANIMATION",
    },
    {
      id: "OmniAnimationStudio",
      title: "MoCap & Rigging Studio",
      icon: <PersonStanding size={20} />,
      activeColor: "text-[#58a6ff]",
      category: "🎬 ANIMATION",
    },

    // ⚙️ ENGINE & DEVOPS
    {
      id: "GPUComputeCluster",
      title: "Multi-GPU Compute Cluster",
      icon: <Zap size={20} />,
      activeColor: "text-[#bc8cff]",
      category: "⚙️ CORE ENGINE",
    },
    {
      id: "AIOfflinePCBStudio",
      title: "AI Offline PCB Studio & Embedded OS",
      icon: <CircuitBoard size={20} />,
      activeColor: "text-[#3fb950]",
      category: "⚙️ CORE ENGINE",
    },
    {
      id: "ProjectSettings",
      title: "Project Core Settings",
      icon: <Wrench size={20} />,
      activeColor: "text-[#bc8cff]",
      category: "⚙️ CORE ENGINE",
    },
    {
      id: "NetcodeEditor",
      title: "Netcode & LiveOps Studio",
      icon: <Server size={20} />,
      activeColor: "text-[#58a6ff]",
      category: "⚙️ CORE ENGINE",
    },
    {
      id: "PerformanceProfile",
      title: "System Profiler & Debugger",
      icon: <Bug size={20} />,
      activeColor: "text-[#f85149]",
      category: "⚙️ CORE ENGINE",
    },
    {
      id: "BuildPublish",
      title: "One-Click Build & DEPLOY Pipeline",
      icon: <Cloud size={20} />,
      activeColor: "text-[#e3b341]",
      category: "⚙️ CORE ENGINE",
    },
  ];

  const renderActiveTool = () => {
    switch (activeTool) {
      case "OmniCreatorMaster":
        return null; // Controlled by layout directly
      case "ZBrushStyleSculptingStudio":
        return <ZBrushStyleSculptingStudio />;
      case "SubstanceStyleTexturePainter":
        return <SubstanceStyleTexturePainter />;
      case "HoudiniStyleProceduralNode":
        return <HoudiniStyleProceduralNode />;
      case "PhotogrammetryMeshBuilder":
        return <PhotogrammetryMeshBuilder />;
      case "VehicleDynamicsTuner":
        return <VehicleDynamicsTuner />;
      case "CinematicLightingEditor":
        return <CinematicLightingEditor />;
      case "RenderFarmManager":
        return <RenderFarmManager />;
      case "ModdingWorkshopPublisher":
        return <ModdingWorkshopPublisher />;
      case "CodeProfilerTracer":
        return <CodeProfilerTracer />;
      case "IDECompilerCore":
        return <IDECompilerCore />;
      case "NavMeshRouter":
        return <NavMeshRouter />;
      case "TopologyUVPro":
        return <TopologyUVPro />;
      case "FigmaStyleCanvas":
        return <FigmaStyleCanvas />;
      case "UXCognitiveLoadSim":
        return <UXCognitiveLoadSim />;
      case "QuickStart":
        return <QuickStartDashboard />;
      case "Select":
        return (
          <CodeEditor
            code={globalCode}
            setCode={setGlobalCode}
            language={globalLanguage}
            setLanguage={setGlobalLanguage}
          />
        );
      case "EconomicBalancer":
        return <EconomicBalancer />;
      case "Pipeline":
        return <PipelineEditor />;
      case "MapEdit":
        return <MapEdit />;
      case "OmniWorldBuilder":
        return <OmniMegaWorldBuilder />;
      case "OmniAudioStudio":
        return <OmniAudioDSPStudio />;
      case "OmniVFXStudio":
        return <OmniVFXParticleStudio />;
      case "OmniAnimationStudio":
        return <OmniAnimationStudio />;
      case "OmniVisualScripting":
        return <OmniVisualScriptingEngine />;
      case "OmniBackendNetworkingStudio":
        return <OmniBackendNetworkingStudio />;
      case "OmniNarrativeQuestStudio":
        return <OmniNarrativeQuestStudio />;
      case "AIOfflineDownloader":
        return <AIOfflineDownloader />;
      case "OmniAIAssistantStudio":
        return <OmniAIAssistantStudio />;
      case "EngineCore":
        return <EngineCoreEditor />;
      case "GraphicsRender":
        return <GraphicsRenderEditor />;
      case "PhysicsEngine":
        return <EngineCoreEditor />;
      case "InputMapping":
        return <InputMapping />;
      case "AITestingQA":
        return <PerformanceProfiler />;
      case "GameSystems":
        return <GameSystemsEditor />;
      case "ScriptEditor":
        return <ScriptEditor />;
      case "AssetPipeline":
        return <ContentBrowser />;
      case "BuildPublish":
        return <BuildPublishEditor />;
      case "NPCEdit":
        return <NPCEditor />;
      case "WorldLore":
        return <WorldLoreEditor />;
      case "MonsterEdit":
        return <MonsterEditor />;
      case "Modeling":
        return <ModelingEditor />;
      case "Sequencer":
        return <CinematicSequencerEditor />;
      case "MetaHuman":
        return <MetaHumanEditor />;
      case "Blueprint":
        return <BlueprintEditor />;
      case "DataTable":
        return <DataTableEditor />;
      case "Material":
        return <MaterialEditor />;
      case "ImageEdit":
        return <ImageEditor />;
      case "UIUXEdit":
        return <UIUXEditor />;
      case "SkillForge":
        return <SkillForgeEditor />;
      case "ProceduralAsset":
        return <ProceduralAssetStudio />;
      case "PerformanceProfile":
        return <PerformanceProfiler />;
      case "CinematicSequencer":
        return <CinematicSequencerEditor />;
      case "ActionRecorder":
        return <ManualSequenceRecorder />;
      case "AdvancedNavMesh":
        return <NavMeshRouter />;
      case "Photogrammetry":
        return <Photogrammetry3DScanner />;
      case "HardwareDriver":
        return <DeviceDriverConfigPanel />;
      case "Offline3DModeler":
        return <Offline3DModeler />;
      case "AdvancedImage":
        return <ImageEditor />;
      case "CinematicDirector":
        return <CinematicDirector />;
      case "EngineProfiler":
        return <GameEngineProfiler />;
      case "HD2DHybridEditor":
        return <EngineCoreEditor />;
      case "VehiclePhysics":
        return <VehicleDynamicsEditor />;
      case "MLAgents":
        return <MLAgentsEditor />;
      case "VRXREngine":
        return <VRXREngineEditor />;
      case "DevOpsBuilder":
        return <ArchitectureDevOpsEditor />;
      case "ASTNodeWeaver":
        return <ASTNodeWeaver />;
      case "VideoEncoder":
        return <VideoEncoderStudio />;
      case "HexEditor":
        return <HexEditorPanel />;
      case "RegexTester":
        return <RegexTesterPanel />;
      case "DiffTool":
        return <GitPanel files={[]} />;
      case "HexInjector":
        return <HexEditorPanel />;
      case "FontEditor":
        return <FontEditor />;
      case "EyeTrackingHeatmap":
        return <EyeTrackingHeatmap />;
      case "AccessibilityTester":
        return <AccessibilityTester />;
      case "PCGEditor":
        return <PCGEditor />;
      case "LocalAIStudio":
        return <LocalAIStudio />;
      case "BatchAIImporter":
        return <BatchAIImporter />;
      case "VoiceMusicStudio":
        return <VoiceMusicStudio />;
      case "AICommandCenter":
        return <AICommandCenter />;
      case "AudioEditor":
        return <AudioEditor />;
      case "Workflow":
        return <AIWorkflowEditor />;
      case "OptimizationOverview":
        return <OptimizationOverview />;
      case "KernelDebugger":
        return <KernelDebugger />;
      case "MemoryProfiler":
        return <MemoryProfiler />;
      case "SystemTap":
        return <SystemTap />;
      case "AppProfiler":
        return <AppProfiler />;
      case "LogViewer":
        return <LogViewer logs={[]} />;
      case "AudioDSP":
        return <OmniAudioDSPStudio />;
      case "ThaiPhonetics":
        return <ThaiPhoneticsEngine />;
      case "VCSConflict":
        return <VCSConflict />;
      case "HardwareConfig":
        return <HardwareConfig />;
      case "TerminalSvr":
        return <TerminalSvr />;
      case "DockerManager":
        return <DockerManager />;
      case "BuildMonitor":
        return <BuildMonitor />;
      case "CompilerTool":
        return <CompilerTool />;
      case "CloudBuildPipeline":
        return <CloudBuildPipeline />;
      case "SculptMaster":
        return <ZBrushStyleSculptingStudio />;
      case "UVRetopology":
        return <TopologyUVPro />;
      case "TextureBaker":
        return <SubstanceStyleTexturePainter />;
      case "VectorHybrid":
        return <VectorHybrid />;
      case "SpriteSheetGen":
        return <SpriteSheetGen />;
      case "FigmaClone":
        return <FigmaStyleCanvas />;
      case "InteractionPrototyper":
        return <InteractionPrototyper />;
      case "RenderPipeline":
        return <GraphicsRenderEditor />;
      case "GamePreview":
        return <GamePreview files={[]} />;
      case "AssetStore":
        return <AssetStore />;
      case "ProjectSettings":
        return <ProjectSettingsEditor />;
      case "NetcodeEditor":
        return <NetcodeEditor />;
      case "NetworkSim":
        return <NetworkSim />;
      case "NetworkReplicationSim":
        return <NetworkReplicationSim />;
      case "LiveOpsDashboard":
        return <LiveOpsDashboard />;
      case "LiveOpsScheduler":
        return <LiveOpsEventScheduler />;
      case "TerrainGenerator":
        return <TerrainGenerator />;
      case "GameEconomyBalancer":
        return <GameEconomyBalancer />;
      case "CutsceneEditor":
        return <CutsceneEditor />;
      case "TaskPanel":
        return <TaskPanel />;
      case "NexusPluginArchitect":
        return <NexusPluginArchitect />;
      case "GPUComputeCluster":
        return <GPUComputeCluster />;
      case "AIOfflinePCBStudio":
        return <AIOfflinePCBStudio />;
      default:
        return <GenericToolPanel toolId={activeTool} tools={tools} />;
    }
  };

  return (
    <div className="w-full h-full bg-[#0a0a0f] text-white flex flex-col font-sans overflow-hidden">
      <CommandPalette tools={tools} onSelect={setActiveTool} />
      <OmniEngineIDE
        tools={tools}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        renderActiveTool={renderActiveTool}
      />

      {/* Global AI Offline Chat Toggle */}
      <button
        onClick={() => setShowGlobalChat(!showGlobalChat)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.5)] flex items-center justify-center transition-transform hover:scale-110 border border-blue-400"
      >
        <MessageCircle size={24} className="text-white" />
      </button>

      {/* Global AI Chat Panel */}
      {showGlobalChat && (
        <div
          style={{
            width: `${chatSize.width}px`,
            height: `${chatSize.height}px`,
          }}
          className={`fixed bottom-20 right-6 z-50 bg-[#0a0a0f] border ${isResizing ? "border-[#58a6ff] shadow-[0_0_20px_rgba(88,166,255,0.2)]" : "border-[#2a2b3d]"} rounded-lg shadow-2xl flex flex-col overflow-hidden max-w-[90vw] max-h-[85vh] transition-none`}
        >
          {/* Top-Left Resize Handle */}
          <div
            className="absolute top-0 left-0 w-8 h-8 cursor-nwse-resize z-50 flex items-start justify-start p-1 opacity-50 hover:opacity-100 bg-gradient-to-br from-[#58a6ff]/20 to-transparent rounded-tl-lg"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizing(true);
            }}
            onDoubleClick={() => setChatSize({ width: 315, height: 420 })}
            title="Drag to resize, double-click to reset"
          >
            <Grip size={14} className="text-[#58a6ff] -rotate-45" />
          </div>

          <div className="bg-[#11111b] border-b border-[#2a2b3d] p-2 flex items-center justify-between pl-8 relative z-40 select-none">
            <div className="flex items-center gap-2 text-[13px] font-bold select-none pointer-events-none">
              <Bot
                size={16}
                className={`${isResizing ? "text-blue-300" : "text-blue-400"}`}
              />
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

          {/* Resizing Overlay Cover & Dimensions indicator */}
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
              activeToolCategory={
                tools.find((t) => t.id === activeTool)?.category
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
