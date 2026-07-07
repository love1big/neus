import React, { useState, Suspense } from "react";
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
  Sparkles,
  MessageCircle,
  Ear,
  Mountain,
  Volume2,
  Code2,
Dna, FileText} from "lucide-react";
import { LanguageCode } from "./contexts/LanguageContext";
import ErrorBoundary from "./components/ErrorBoundary";

const AdvancedPhysicsEngine = React.lazy(() => import("./components/AdvancedPhysicsEngine"));
const AdvancedEvolutionSystem = React.lazy(() => import("./components/AdvancedEvolutionSystem"));
const ArchitectureDevOpsEditor = React.lazy(() => import("./components/ArchitectureDevOpsEditor"));
const AssetStore = React.lazy(() => import("./components/AssetStore"));
const BasicSkeletonModel = React.lazy(() => import("./components/BasicSkeletonModel"));
const BlueprintEditor = React.lazy(() => import("./components/BlueprintEditor"));
const BuildPublishEditor = React.lazy(() => import("./components/BuildPublishEditor"));
const ChronoDebugger = React.lazy(() => import("./components/ChronoDebugger"));
const CinematicDirector = React.lazy(() => import("./components/CinematicDirector"));
const CinematicLightingEditor = React.lazy(() => import("./components/CinematicLightingEditor"));
const CinematicSequencerEditor = React.lazy(() => import("./components/CinematicSequencerEditor"));
const CodeEditor = React.lazy(() => import("./components/CodeEditor"));
const CodeProfilerTracer = React.lazy(() => import("./components/CodeProfilerTracer"));
const ContentBrowser = React.lazy(() => import("./components/ContentBrowser"));
const CutsceneEditor = React.lazy(() => import("./components/CutsceneEditor"));
const DataTableEditor = React.lazy(() => import("./components/DataTableEditor"));
const DeviceDriverConfigPanel = React.lazy(() => import("./components/DeviceDriverConfigPanel"));
const EconomicBalancer = React.lazy(() => import("./components/EconomicBalancer"));
const EngineCoreEditor = React.lazy(() => import("./components/EngineCoreEditor"));
const FigmaStyleCanvas = React.lazy(() => import("./components/FigmaStyleCanvas"));
const GameEconomyBalancer = React.lazy(() => import("./components/GameEconomyBalancer"));
const GameEngineProfiler = React.lazy(() => import("./components/GameEngineProfiler"));
const GamePreview = React.lazy(() => import("./components/GamePreview"));
const GameSystemsEditor = React.lazy(() => import("./components/GameSystemsEditor"));
const PCGEditor = React.lazy(() => import("./components/PCGEditor"));
const LocalAIStudio = React.lazy(() => import("./components/LocalAIStudio"));
const BatchAIImporter = React.lazy(() => import("./components/BatchAIImporter"));
const VoiceMusicStudio = React.lazy(() => import("./components/VoiceMusicStudio"));
const GPUComputeCluster = React.lazy(() => import("./components/GPUComputeCluster"));

const AIOfflineOCREngine = React.lazy(() => import("./components/AIOfflineOCREngine"));
const AIOfflinePCBStudio = React.lazy(() => import("./components/AIOfflinePCBStudio"));
const AICommandCenter = React.lazy(() => import("./components/AICommandCenter"));
const AudioEditor = React.lazy(() => import("./components/AudioEditor"));
const GitPanel = React.lazy(() => import("./components/GitPanel"));
const GlobalSearchPanel = React.lazy(() => import("./components/GlobalSearchPanel"));
const PerformanceDashboard = React.lazy(() => import("./components/PerformanceDashboard"));
const GlobalUniversalDetailsPanel = React.lazy(() => import("./components/GlobalUniversalDetailsPanel"));
const GraphicsRenderEditor = React.lazy(() => import("./components/GraphicsRenderEditor"));
const HardwareProfilerOverlay = React.lazy(() => import("./components/HardwareProfilerOverlay"));
const HoudiniStyleProceduralNode = React.lazy(() => import("./components/HoudiniStyleProceduralNode"));
const IDECompilerCore = React.lazy(() => import("./components/IDECompilerCore"));
const ImageEditor = React.lazy(() => import("./components/ImageEditor"));
const LiveOpsDashboard = React.lazy(() => import("./components/LiveOpsDashboard"));
const LiveOpsEventScheduler = React.lazy(() => import("./components/LiveOpsEventScheduler"));
const LogViewer = React.lazy(() => import("./components/LogViewer"));
const MLAgentsEditor = React.lazy(() => import("./components/MLAgentsEditor"));
const MapEdit = React.lazy(() => import("./components/MapEdit"));
const ManualSequenceRecorder = React.lazy(() => import("./components/ManualSequenceRecorder"));
const MaterialEditor = React.lazy(() => import("./components/MaterialEditor"));
const MetaHumanEditor = React.lazy(() => import("./components/MetaHumanEditor"));
const ModdingWorkshopPublisher = React.lazy(() => import("./components/ModdingWorkshopPublisher"));
const ModelingEditor = React.lazy(() => import("./components/ModelingEditor"));
const NPCEditor = React.lazy(() => import("./components/NPCEditor"));
const NavMeshRouter = React.lazy(() => import("./components/NavMeshRouter"));
const NetcodeEditor = React.lazy(() => import("./components/NetcodeEditor"));
const NetworkReplicationSim = React.lazy(() => import("./components/NetworkReplicationSim"));
const NetworkSim = React.lazy(() => import("./components/NetworkSim"));
const AIWorkflowEditor = React.lazy(() => import("./components/AIWorkflowEditor"));
const Offline3DModeler = React.lazy(() => import("./components/Offline3DModeler"));
const AIOfflineDownloader = React.lazy(() => import("./components/AIOfflineDownloader"));
const OmniAIAssistantStudio = React.lazy(() => import("./components/OmniAIAssistantStudio"));
const OmniAnimationStudio = React.lazy(() => import("./components/OmniAnimationStudio"));
const OmniAudioDSPStudio = React.lazy(() => import("./components/OmniAudioDSPStudio"));
const OmniBackendNetworkingStudio = React.lazy(() => import("./components/OmniBackendNetworkingStudio"));
const OmniCreatorMaster = React.lazy(() => import("./components/OmniCreatorMaster"));
const OmniEngineIDE = React.lazy(() => import("./components/OmniEngineIDE"));
const OmniMegaWorldBuilder = React.lazy(() => import("./components/OmniMegaWorldBuilder"));
const OmniNarrativeQuestStudio = React.lazy(() => import("./components/OmniNarrativeQuestStudio"));
const OmniVFXCompositorStudio = React.lazy(() => import("./components/OmniVFXCompositorStudio"));
const OmniVFXParticleStudio = React.lazy(() => import("./components/OmniVFXParticleStudio"));
const OmniVisualScriptingEngine = React.lazy(() => import("./components/OmniVisualScriptingEngine"));
const OptimizationEncyclopedia = React.lazy(() => import("./components/OptimizationEncyclopedia"));
const OptimizationOverview = React.lazy(() => import("./components/OptimizationOverview"));
const PerformanceProfiler = React.lazy(() => import("./components/PerformanceProfiler"));
const Photogrammetry3DScanner = React.lazy(() => import("./components/Photogrammetry3DScanner"));
const PhotogrammetryMeshBuilder = React.lazy(() => import("./components/PhotogrammetryMeshBuilder"));
const PipelineEditor = React.lazy(() => import("./components/PipelineEditor"));
const PopOutPanel = React.lazy(() => import("./components/PopOutPanel"));
const ProceduralAssetStudio = React.lazy(() => import("./components/ProceduralAssetStudio"));
const ProjectSettingsEditor = React.lazy(() => import("./components/ProjectSettingsEditor"));
const QuickStartDashboard = React.lazy(() => import("./components/QuickStartDashboard"));
const RenderFarmManager = React.lazy(() => import("./components/RenderFarmManager"));
const ResourceUsageTab = React.lazy(() => import("./components/ResourceUsageTab"));
const ScriptEditor = React.lazy(() => import("./components/ScriptEditor"));
const SettingsModal = React.lazy(() => import("./components/SettingsModal"));
const SkillForgeEditor = React.lazy(() => import("./components/SkillForgeEditor"));
const SubstanceStyleTexturePainter = React.lazy(() => import("./components/SubstanceStyleTexturePainter"));
const TaskPanel = React.lazy(() => import("./components/TaskPanel"));

const TerrainImportUtility = React.lazy(() => import("./components/TerrainImportUtility"));
const TerrainGenerator = React.lazy(() => import("./components/TerrainGenerator"));
const ThaiPhoneticsEngine = React.lazy(() => import("./components/ThaiPhoneticsEngine"));
const NexusPluginArchitect = React.lazy(() => import("./components/NexusPluginArchitect"));
const TopologyUVPro = React.lazy(() => import("./components/TopologyUVPro"));
const AIHubMasterMenu = React.lazy(() => import("./components/AIHubMasterMenu"));
const UIUXEditor = React.lazy(() => import("./components/UIUXEditor"));
const UXCognitiveLoadSim = React.lazy(() => import("./components/UXCognitiveLoadSim"));
const VRXREngineEditor = React.lazy(() => import("./components/VRXREngineEditor"));
const VehicleDynamicsEditor = React.lazy(() => import("./components/VehicleDynamicsEditor"));
const VehicleDynamicsTuner = React.lazy(() => import("./components/VehicleDynamicsTuner"));
const Viewport3D = React.lazy(() => import("./components/Viewport3D"));
const WorldLoreEditor = React.lazy(() => import("./components/WorldLoreEditor"));
const ZBrushStyleSculptingStudio = React.lazy(() => import("./components/ZBrushStyleSculptingStudio"));
const CommandPalette = React.lazy(() => import("./components/CommandPalette"));
const RegexTesterPanel = React.lazy(() => import("./components/RegexTesterPanel"));
const FontEditor = React.lazy(() => import("./components/FontEditor"));
const EyeTrackingHeatmap = React.lazy(() => import("./components/EyeTrackingHeatmap"));
const MonsterEditor = React.lazy(() => import("./components/MonsterEditor"));
const InputMapping = React.lazy(() => import("./components/InputMappingEditor"));
const AccessibilityTester = React.lazy(() => import("./components/AccessibilityTester"));
const VideoEncoderStudio = React.lazy(() => import("./components/VideoEncoderStudio"));
const HexEditorPanel = React.lazy(() => import("./components/HexEditorPanel"));
const ASTNodeWeaver = React.lazy(() => import("./components/ASTNodeWeaver"));
const GenericToolPanel = React.lazy(() => import("./components/GenericToolPanel"));
const KernelDebugger = React.lazy(() => import("./components/KernelDebugger"));
const MemoryProfiler = React.lazy(() => import("./components/MemoryProfiler"));
const SystemTap = React.lazy(() => import("./components/SystemTap"));
const AppProfiler = React.lazy(() => import("./components/AppProfiler"));
const VCSConflict = React.lazy(() => import("./components/VCSConflict"));
const HardwareConfig = React.lazy(() => import("./components/HardwareConfig"));
const TerminalSvr = React.lazy(() => import("./components/TerminalSvr"));
const DockerManager = React.lazy(() => import("./components/DockerManager"));
const BuildMonitor = React.lazy(() => import("./components/BuildMonitor"));
const CompilerTool = React.lazy(() => import("./components/CompilerTool"));
const CloudBuildPipeline = React.lazy(() => import("./components/CloudBuildPipeline"));
const VectorHybrid = React.lazy(() => import("./components/VectorHybrid"));
const SpriteSheetGen = React.lazy(() => import("./components/SpriteSheetGen"));
const InteractionPrototyper = React.lazy(() => import("./components/InteractionPrototyper"));

const UltimateOfflineAIStudio = React.lazy(() => import("./components/UltimateOfflineAIStudio"));

const AIChat = React.lazy(() => import("./components/AIChat"));

const AdvancedPCGEngine = React.lazy(() => import("./components/AdvancedPCGEngine"));
const ChaosPhysicsFluidEngine = React.lazy(() => import("./components/ChaosPhysicsFluidEngine"));
const SpatialAudioFoleyStudio = React.lazy(() => import("./components/SpatialAudioFoleyStudio"));
const VisualFlowDebugger = React.lazy(() => import("./components/VisualFlowDebugger"));
const AdvancedSceneEditor = React.lazy(() => import("./components/AdvancedSceneEditor"));
const VisualScriptEditor = React.lazy(() => import("./components/VisualScriptEditor"));
const ParticleEffectEditor = React.lazy(() => import("./components/ParticleEffectEditor"));


const AdvancedTimelineEditor = React.lazy(() => import("./components/AdvancedTimelineEditor"));
const TerrainEditor = React.lazy(() => import("./components/TerrainEditor"));
const AdvancedDialogueSystem = React.lazy(() => import("./components/AdvancedDialogueSystem"));
const QuestDesigner = React.lazy(() => import("./components/QuestDesigner"));
const AdvancedAudioEditor = React.lazy(() => import("./components/AdvancedAudioEditor"));
const AdvancedAnimationBlender = React.lazy(() => import("./components/AdvancedAnimationBlender"));
const AdvancedShaderEditor = React.lazy(() => import("./components/AdvancedShaderEditor"));
const AdvancedDebuggingTools = React.lazy(() => import("./components/AdvancedDebuggingTools"));
const MachineLearningIntegration = React.lazy(() => import("./components/MachineLearningIntegration"));
const AdvancedSecuritySystem = React.lazy(() => import("./components/AdvancedSecuritySystem"));
const AdvancedLocalizationSystem = React.lazy(() => import("./components/AdvancedLocalizationSystem"));
const AdvancedAnalyticsTelemetry = React.lazy(() => import("./components/AdvancedAnalyticsTelemetry"));
const AdvancedMarketplaceSystem = React.lazy(() => import("./components/AdvancedMarketplaceSystem"));

export default function App() {
  const [activeTool, setActiveTool] = useState(() => {
    return localStorage.getItem("omni_activeTool") || "OmniCreatorMaster";
  });
  const [showGlobalChat, setShowGlobalChat] = useState(() => {
    return localStorage.getItem("omni_showGlobalChat") === "true";
  });
  const [globalCode, setGlobalCode] = useState("");
  const [globalLanguage, setGlobalLanguage] = useState<LanguageCode>("cpp" as any);

  const [chatSize, setChatSize] = useState(() => {
    const saved = localStorage.getItem("omni_chatSize");
    return saved ? JSON.parse(saved) : { width: 315, height: 420 };
  });
  const [isResizing, setIsResizing] = useState(false);

  React.useEffect(() => {
    localStorage.setItem("omni_activeTool", activeTool);
  }, [activeTool]);

  React.useEffect(() => {
    localStorage.setItem("omni_showGlobalChat", showGlobalChat.toString());
  }, [showGlobalChat]);

  React.useEffect(() => {
    localStorage.setItem("omni_chatSize", JSON.stringify(chatSize));
  }, [chatSize]);

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

    { id: "TerrainImportUtility", title: "Terrain Importer", icon: <Map size={16} /> },


    { id: "AdvancedPhysicsEngine", title: "Physics & Simulation", icon: <Box size={16} /> },
    { id: "AdvancedEvolutionSystem", title: "Evolution System", icon: <Dna size={16} /> },

    // 🌟 ASCENSION & DASHBOARD
    {
      id: "OmniCreatorMaster",
      title: "Global Omniverse Dashboard",
      icon: <Command size={20} />,
      activeColor: "text-[#f85149]",
      category: "🌟 ASCENSION STUDIO",
    },
    {
      id: "ProjectHub",
      title: "Project & Task Hub",
      icon: <Rocket size={20} />,
      activeColor: "text-[#e3b341]",
      category: "🌟 ASCENSION STUDIO",
      subTools: [
        { id: "QuickStart", title: "Home / Project Hub", icon: <Rocket size={16} /> },
        { id: "TaskPanel", title: "Agile Task Sprint Board", icon: <SearchCode size={16} /> }
      ]
    },

    // 🤖 AI & LOGIC
    {
      id: "AIHubMaster",
      title: "AI Swarm & Neural Hub",
      icon: <Bot size={20} />,
      activeColor: "text-[#bc8cff]",
      category: "🤖 AI & LOGIC",
    },
    {
      id: "CodeIDEHub",
      title: "Code Editor & IDE",
      icon: <TerminalSquare size={20} />,
      activeColor: "text-[#ff7b72]",
      category: "🤖 AI & LOGIC",
      subTools: [
        { id: "Select", title: "Text Code Editor", icon: <Code2 size={16} /> },
        { id: "VisualScripting", title: "Visual Script Editor", icon: <Network size={16} /> },
        { id: "VisualFlowDebugger", title: "Visual Flow Debugger", icon: <Bug size={16} /> }
      ]
    },

    // 🌍 WORLD & MAPS
    {
      id: "WorldHub",
      title: "World & Level Hub",
      icon: <Globe size={20} />,
      activeColor: "text-[#58a6ff]",
      category: "🌍 WORLD BUILDING",
      subTools: [
        { id: "OmniWorldBuilder", title: "Omni MegaWorld Builder (2D/3D)", icon: <Globe size={16} /> },
        { id: "AdvancedSceneEditor", title: "Advanced Scene Editor", icon: <Layers size={16} /> },
        { id: "AdvancedPCGEngine", title: "Advanced PCG Gen", icon: <Mountain size={16} /> },
        { id: "MapEdit", title: "Map Edit (Level Editor)", icon: <Map size={16} /> }
      ]
    },

    // 🎮 GAME DESIGN & LORE
    {
      id: "GameDesignHub",
      title: "Game Design & Logic Hub",
      icon: <Blocks size={20} />,
      activeColor: "text-[#58a6ff]",
      category: "🎮 GAME DESIGN",
      subTools: [
        { id: "GameSystems", title: "Game Systems Editor", icon: <Blocks size={16} /> },
        { id: "ChaosPhysicsFluidEngine", title: "Chaos & Fluid Physics", icon: <Flame size={16} /> },
        { id: "NPCEdit", title: "Entity & NPC Editor", icon: <Users size={16} /> },
        { id: "WorldLore", title: "World Lore & Story", icon: <BookOpen size={16} /> },
        { id: "EconomicBalancer", title: "Combat & Economy", icon: <Database size={16} /> }
      ]
    },

    // 🎨 ART, 3D & TEXTURES
    {
      id: "ArtStudioHub",
      title: "Art & Modeling Studio",
      icon: <Box size={20} />,
      activeColor: "text-[#e3b341]",
      category: "🎨 ART STUDIO",
      subTools: [
        { id: "Modeling", title: "3D/2D Modeling Studio", icon: <Box size={16} /> },
        { id: "PhotogrammetryMeshBuilder", title: "Photogrammetry Scanner", icon: <Camera size={16} /> },
        { id: "ImageEdit", title: "Texture & Material Editor", icon: <Palette size={16} /> },
        { id: "OmniVFXStudio", title: "VFX & Particle Studio", icon: <Flame size={16} /> },
        { id: "ParticleEffectEditor", title: "Particle Effect Designer", icon: <Sparkles size={16} /> }
      ]
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
      id: "AudioStudioHub",
      title: "Audio & Music Studio Hub",
      icon: <Volume2 size={20} />,
      activeColor: "text-[#a371f7]",
      category: "🎵 AUDIO & SOUND",
      subTools: [
        { id: "VoiceMusicStudio", title: "Voice & Procedural Audio", icon: <Mic2 size={16} /> },
        { id: "SpatialAudioFoley", title: "Spatial Audio & Foley", icon: <Ear size={16} /> }
      ]
    },

    // 🎬 CINEMATICS & ANIMATION
    {
      id: "AnimationHub",
      title: "Cinematics & Animation",
      icon: <Clapperboard size={20} />,
      activeColor: "text-[#bc8cff]",
      category: "🎬 ANIMATION",
      subTools: [
        { id: "Sequencer", title: "Timeline & Cinematic Sequencer", icon: <Clapperboard size={16} /> },
        { id: "OmniAnimationStudio", title: "MoCap & Rigging Studio", icon: <PersonStanding size={16} /> }
      ]
    },

    // ⚙️ ENGINE & DEVOPS
    {
      id: "EngineDevOpsHub",
      title: "Core Engine & DevOps",
      icon: <Zap size={20} />,
      activeColor: "text-[#f85149]",
      category: "⚙️ CORE ENGINE",
      subTools: [
        { id: "GPUComputeCluster", title: "Multi-GPU Compute Cluster", icon: <Zap size={16} /> },
        { id: "VisualFlowDebugger", title: "AI Visual Flow Debugger", icon: <SearchCode size={16} /> },
        
    { id: "AIOfflineOCREngine", title: "AI Offline OCR Engine", icon: <FileText size={16} /> },
    { id: "AIOfflinePCBStudio", title: "AI Offline PCB Studio", icon: <CircuitBoard size={16} /> },
        { id: "ProjectSettings", title: "Project Core Settings", icon: <Wrench size={16} /> },
        { id: "NetcodeEditor", title: "Netcode & LiveOps Studio", icon: <Server size={16} /> },
        { id: "PerformanceDashboard", title: "Real-time Performance Dashboard", icon: <Activity size={16} /> },
        { id: "PerformanceProfile", title: "System Profiler & Debugger", icon: <Bug size={16} /> },
        { id: "BuildPublish", title: "One-Click Build & DEPLOY", icon: <Cloud size={16} /> }
      ]
    },

    // 🔮 ADVANCED SYSTEMS (PHASE 51-65)
    {
      id: "AdvancedSystemsHub",
      title: "Advanced Systems Hub",
      icon: <BrainCircuit size={20} />,
      activeColor: "text-[#bc8cff]",
      category: "🔮 ADVANCED SYSTEMS",
      subTools: [
        { id: "AdvancedTimelineEditor", title: "Advanced Timeline Editor", icon: <Orbit size={16} /> },
        { id: "TerrainEditor", title: "Terrain Editor", icon: <Mountain size={16} /> },
        { id: "AdvancedDialogueSystem", title: "Advanced Dialogue System", icon: <MessageCircle size={16} /> },
        { id: "QuestDesigner", title: "Quest Designer", icon: <AlignLeft size={16} /> },
        { id: "AdvancedAudioEditor", title: "Advanced Audio Editor", icon: <Activity size={16} /> },
        { id: "AdvancedAnimationBlender", title: "Advanced Animation Blender", icon: <Activity size={16} /> },
        { id: "AdvancedShaderEditor", title: "Advanced Shader Editor", icon: <Flame size={16} /> },
        { id: "AdvancedDebuggingTools", title: "Advanced Debugging Tools", icon: <Bug size={16} /> },
        { id: "MachineLearningIntegration", title: "Machine Learning Integration", icon: <Brain size={16} /> },
        { id: "AdvancedSecuritySystem", title: "Advanced Security System", icon: <ShieldCheck size={16} /> },
        { id: "AdvancedLocalizationSystem", title: "Advanced Localization System", icon: <Globe size={16} /> },
        { id: "AdvancedAnalyticsTelemetry", title: "Advanced Analytics", icon: <Activity size={16} /> },
        { id: "AdvancedMarketplaceSystem", title: "Advanced Marketplace", icon: <Box size={16} /> }
      ]
    },

  ];

  const renderActiveTool = () => {
    let content = null;
    switch (activeTool) {
      case "OmniCreatorMaster":
        content = null; // Controlled by layout directly
        break;
      case "ZBrushStyleSculptingStudio":
        content = <ZBrushStyleSculptingStudio />;
        break;
      case "SubstanceStyleTexturePainter":
        content = <SubstanceStyleTexturePainter />;
        break;
      case "AdvancedPCGEngine":
        content = <AdvancedPCGEngine />;
        break;
      case "ChaosPhysicsFluidEngine":
        content = <ChaosPhysicsFluidEngine />;
        break;
      case "SpatialAudioFoley":
        content = <SpatialAudioFoleyStudio />;
        break;
      case "VisualFlowDebugger":
        content = <VisualFlowDebugger />;
        break;
      case "HoudiniStyleProceduralNode":
        content = <HoudiniStyleProceduralNode />;
        break;
      case "PhotogrammetryMeshBuilder":
        content = <PhotogrammetryMeshBuilder />;
        break;
      case "VehicleDynamicsTuner":
        content = <VehicleDynamicsTuner />;
        break;
      case "CinematicLightingEditor":
        content = <CinematicLightingEditor />;
        break;
      case "RenderFarmManager":
        content = <RenderFarmManager />;
        break;
      case "ModdingWorkshopPublisher":
        content = <ModdingWorkshopPublisher />;
        break;
      case "CodeProfilerTracer":
        content = <CodeProfilerTracer />;
        break;
      case "IDECompilerCore":
        content = <IDECompilerCore />;
        break;
      case "NavMeshRouter":
        content = <NavMeshRouter />;
        break;
      case "TopologyUVPro":
        content = <TopologyUVPro />;
        break;
      case "FigmaStyleCanvas":
        content = <FigmaStyleCanvas />;
        break;
      case "UXCognitiveLoadSim":
        content = <UXCognitiveLoadSim />;
        break;
      case "QuickStart":
        content = <QuickStartDashboard />;
        break;
      case "Select":
        content = (
          <CodeEditor
            code={globalCode}
            setCode={setGlobalCode}
            language={globalLanguage}
            setLanguage={setGlobalLanguage}
          />
        );
        break;
      case "VisualScripting":
        content = <VisualScriptEditor />;
        break;
      case "AdvancedSceneEditor":
        content = <AdvancedSceneEditor />;
        break;
      case "ParticleEffectEditor":
        content = <ParticleEffectEditor />;
        break;
      case "EconomicBalancer":
        content = <EconomicBalancer />;
        break;
      case "Pipeline":
        content = <PipelineEditor />;
        break;
      case "MapEdit":
        content = <MapEdit />;
        break;
      case "OmniWorldBuilder":
        content = <OmniMegaWorldBuilder />;
        break;
      case "OmniAudioStudio":
        content = <OmniAudioDSPStudio />;
        break;
      case "OmniVFXStudio":
        content = <OmniVFXParticleStudio />;
        break;
      case "OmniAnimationStudio":
        content = <OmniAnimationStudio />;
        break;
      case "AIHubMaster":
      case "UltimateOfflineAIStudio":
      case "OmniVisualScripting":
      case "AIOfflineDownloader":
      case "OmniAIAssistantStudio":
      case "LocalAIStudio":
      case "BatchAIImporter":
      case "AICommandCenter":
      case "Workflow":
        content = <AIHubMasterMenu initialTab={activeTool} />;
        break;
      case "OmniBackendNetworkingStudio":
        content = <OmniBackendNetworkingStudio />;
        break;
      case "OmniNarrativeQuestStudio":
        content = <OmniNarrativeQuestStudio />;
        break;
      case "EngineCore":
        content = <EngineCoreEditor />;
        break;
      case "GraphicsRender":
        content = <GraphicsRenderEditor />;
        break;
      case "PhysicsEngine":
        content = <EngineCoreEditor />;
        break;
      case "InputMapping":
        content = <InputMapping />;
        break;
      case "AITestingQA":
        content = <PerformanceProfiler />;
        break;
      case "GameSystems":
        content = <GameSystemsEditor />;
        break;
      case "ScriptEditor":
        content = <ScriptEditor />;
        break;
      case "AssetPipeline":
        content = <ContentBrowser />;
        break;
      case "BuildPublish":
        content = <BuildPublishEditor />;
        break;
      case "NPCEdit":
        content = <NPCEditor />;
        break;
      case "WorldLore":
        content = <WorldLoreEditor />;
        break;
      case "MonsterEdit":
        content = <MonsterEditor />;
        break;
      case "Modeling":
        content = <ModelingEditor />;
        break;
      case "Sequencer":
        content = <CinematicSequencerEditor />;
        break;
      case "MetaHuman":
        content = <MetaHumanEditor />;
        break;
      case "Blueprint":
        content = <BlueprintEditor />;
        break;
      case "DataTable":
        content = <DataTableEditor />;
        break;
      case "Material":
        content = <MaterialEditor />;
        break;
      case "ImageEdit":
        content = <ImageEditor />;
        break;
      case "UIUXEdit":
        content = <UIUXEditor />;
        break;
      case "SkillForge":
        content = <SkillForgeEditor />;
        break;
      case "ProceduralAsset":
        content = <ProceduralAssetStudio />;
        break;
      case "PerformanceProfile":
        content = <PerformanceProfiler />;
        break;
      case "PerformanceDashboard":
        content = <PerformanceDashboard />;
        break;
      case "CinematicSequencer":
        content = <CinematicSequencerEditor />;
        break;
      case "ActionRecorder":
        content = <ManualSequenceRecorder />;
        break;
      case "AdvancedNavMesh":
        content = <NavMeshRouter />;
        break;
      case "Photogrammetry":
        content = <Photogrammetry3DScanner />;
        break;
      case "HardwareDriver":
        content = <DeviceDriverConfigPanel />;
        break;
      case "Offline3DModeler":
        content = <Offline3DModeler />;
        break;
      case "AdvancedImage":
        content = <ImageEditor />;
        break;
      case "CinematicDirector":
        content = <CinematicDirector />;
        break;
      case "EngineProfiler":
        content = <GameEngineProfiler />;
        break;
      case "HD2DHybridEditor":
        content = <EngineCoreEditor />;
        break;
      case "VehiclePhysics":
        content = <VehicleDynamicsEditor />;
        break;
      case "MLAgents":
        content = <MLAgentsEditor />;
        break;
      case "VRXREngine":
        content = <VRXREngineEditor />;
        break;
      case "DevOpsBuilder":
        content = <ArchitectureDevOpsEditor />;
        break;
      case "ASTNodeWeaver":
        content = <ASTNodeWeaver />;
        break;
      case "VideoEncoder":
        content = <VideoEncoderStudio />;
        break;
      case "HexEditor":
        content = <HexEditorPanel />;
        break;
      case "RegexTester":
        content = <RegexTesterPanel />;
        break;
      case "DiffTool":
        content = <GitPanel files={[]} />;
        break;
      case "HexInjector":
        content = <HexEditorPanel />;
        break;
      case "FontEditor":
        content = <FontEditor />;
        break;
      case "EyeTrackingHeatmap":
        content = <EyeTrackingHeatmap />;
        break;
      case "AccessibilityTester":
        content = <AccessibilityTester />;
        break;
      case "PCGEditor":
        content = <PCGEditor />;
        break;
      case "VoiceMusicStudio":
        content = <VoiceMusicStudio />;
        break;
      case "AudioEditor":
        content = <AudioEditor />;
        break;
      case "OptimizationOverview":
        content = <OptimizationOverview />;
        break;
      case "KernelDebugger":
        content = <KernelDebugger />;
        break;
      case "MemoryProfiler":
        content = <MemoryProfiler />;
        break;
      case "SystemTap":
        content = <SystemTap />;
        break;
      case "AppProfiler":
        content = <AppProfiler />;
        break;
      case "LogViewer":
        content = <LogViewer logs={[]} />;
        break;
      case "AudioDSP":
        content = <OmniAudioDSPStudio />;
        break;
      case "ThaiPhonetics":
        content = <ThaiPhoneticsEngine />;
        break;
      case "VCSConflict":
        content = <VCSConflict />;
        break;
      case "HardwareConfig":
        content = <HardwareConfig />;
        break;
      case "TerminalSvr":
        content = <TerminalSvr />;
        break;
      case "DockerManager":
        content = <DockerManager />;
        break;
      case "BuildMonitor":
        content = <BuildMonitor />;
        break;
      case "CompilerTool":
        content = <CompilerTool />;
        break;
      case "CloudBuildPipeline":
        content = <CloudBuildPipeline />;
        break;
      case "SculptMaster":
        content = <ZBrushStyleSculptingStudio />;
        break;
      case "UVRetopology":
        content = <TopologyUVPro />;
        break;
      case "TextureBaker":
        content = <SubstanceStyleTexturePainter />;
        break;
      case "VectorHybrid":
        content = <VectorHybrid />;
        break;
      case "SpriteSheetGen":
        content = <SpriteSheetGen />;
        break;
      case "FigmaClone":
        content = <FigmaStyleCanvas />;
        break;
      case "InteractionPrototyper":
        content = <InteractionPrototyper />;
        break;
      case "RenderPipeline":
        content = <GraphicsRenderEditor />;
        break;
      case "GamePreview":
        content = <GamePreview files={[]} />;
        break;
      case "AssetStore":
        content = <AssetStore />;
        break;
      case "ProjectSettings":
        content = <ProjectSettingsEditor />;
        break;
      case "NetcodeEditor":
        content = <NetcodeEditor />;
        break;
      case "NetworkSim":
        content = <NetworkSim />;
        break;
      case "NetworkReplicationSim":
        content = <NetworkReplicationSim />;
        break;
      case "LiveOpsDashboard":
        content = <LiveOpsDashboard />;
        break;
      case "LiveOpsScheduler":
        content = <LiveOpsEventScheduler />;
        break;
      
      case "TerrainImportUtility":
        content = <TerrainImportUtility />;
        break;
      case "TerrainGenerator":
        content = <TerrainGenerator />;
        break;
      case "GameEconomyBalancer":
        content = <GameEconomyBalancer />;
        break;
      case "CutsceneEditor":
        content = <CutsceneEditor />;
        break;
      case "TaskPanel":
        content = <TaskPanel />;
        break;
      case "NexusPluginArchitect":
        content = <NexusPluginArchitect />;
        break;
      case "GPUComputeCluster":
        content = <GPUComputeCluster />;
        break;
      
      case "AIOfflineOCREngine":
        content = <AIOfflineOCREngine />;
        break;
      case "AIOfflinePCBStudio":
        content = <AIOfflinePCBStudio />;
        break;
      
      case "AdvancedTimelineEditor": content = <AdvancedTimelineEditor />; break;
      case "TerrainEditor": content = <TerrainEditor />; break;
      case "AdvancedDialogueSystem": content = <AdvancedDialogueSystem />; break;
      case "QuestDesigner": content = <QuestDesigner />; break;
      case "AdvancedAudioEditor": content = <AdvancedAudioEditor />; break;
      case "AdvancedAnimationBlender": content = <AdvancedAnimationBlender />; break;
      case "AdvancedShaderEditor": content = <AdvancedShaderEditor />; break;
      case "AdvancedDebuggingTools": content = <AdvancedDebuggingTools />; break;
      case "MachineLearningIntegration": content = <MachineLearningIntegration />; break;
      case "AdvancedSecuritySystem": content = <AdvancedSecuritySystem />; break;
      case "AdvancedLocalizationSystem": content = <AdvancedLocalizationSystem />; break;
      case "AdvancedAnalyticsTelemetry": content = <AdvancedAnalyticsTelemetry />; break;
      case "AdvancedMarketplaceSystem": content = <AdvancedMarketplaceSystem />; break;

      default:
        content = <GenericToolPanel toolId={activeTool} tools={tools} />;
    }
    
    if (content === null) return null;
    
    return (
      <ErrorBoundary key={activeTool}>
        <Suspense fallback={
          <div className="w-full h-full flex flex-col items-center justify-center text-[#8b949e] bg-[#0d1117]">
            <div className="w-8 h-8 border-2 border-[#58a6ff] border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-sm font-medium tracking-wide">Loading Module...</div>
          </div>
        }>
          {content}
        </Suspense>
      </ErrorBoundary>
    );
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
