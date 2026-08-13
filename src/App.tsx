import React, { useState, Suspense } from "react";
import UnifiedHubWorkspace from "./components/UnifiedHubWorkspace";
import { Link2, Activity, Zap, Command, Droplet, Paintbrush, Boxes, Camera, Gauge, Flame, Server, Share2, Microchip, TerminalSquare, Network, Crosshair, LayoutDashboard, Brain, Rocket, Bot, Map, GitPullRequest, Globe, PersonStanding, Cpu, MonitorPlay, Orbit, Gamepad2, ShieldCheck, Blocks, FolderTree, Globe2, Users, Ghost, Box, Clapperboard, UserSquare, Waypoints, Database, Palette, Image, Swords, FlaskConical, Bug, Video, Layers, BrainCircuit, Glasses, Terminal, HardDrive, Mic2, GitMerge, Binary, Wrench, SearchCode, SplitSquareHorizontal, AlignLeft, Search, Eye, Cloud, BookOpen, GitBranch, X, Grip, Download, Wifi, Puzzle, CircuitBoard, Sparkles, MessageCircle, Ear, Mountain, Volume2, Code2, Dna, FileText, MessageSquare, CloudRain, Scissors, Car, Bone, Smile, Archive, ShoppingBag, GitCommit, Grid, Award, Trophy, DollarSign, Building, Shield, Sun, Lightbulb, Sticker, Route, Bird, PenTool, MapPin, Flag, TrendingUp, Gift, Hammer, Table, DatabaseBackup, Monitor, CheckCircle, Store, Minimize, Music, PlayCircle, AlertTriangle, Sliders, Save, ListTree, Vibrate, Mic, Wand2, Bomb, Film } from 'lucide-react';
import { LanguageCode } from "./contexts/LanguageContext";
import ErrorBoundary from "./components/ErrorBoundary";
import AIChatWidget from "./components/AIChatWidget";

const TextureEditor = React.lazy(() => import('./components/TextureEditor'));

export const componentImports: Record<string, () => Promise<any>> = {
  TextureEditor: () => import('./components/TextureEditor'),
  ProjectManagementSystem: () => import("./components/ProjectManagementSystem"),
  AdvancedPhysicsEngine: () => import("./components/AdvancedPhysicsEngine"),
  AdvancedEvolutionSystem: () => import("./components/AdvancedEvolutionSystem"),
  ArchitectureDevOpsEditor: () => import("./components/ArchitectureDevOpsEditor"),
  AssetStore: () => import("./components/AssetStore"),
  BasicSkeletonModel: () => import("./components/BasicSkeletonModel"),
  BlueprintEditor: () => import("./components/BlueprintEditor"),
  BuildPublishEditor: () => import("./components/BuildPublishEditor"),
  ChronoDebugger: () => import("./components/ChronoDebugger"),
  CinematicDirector: () => import("./components/CinematicDirector"),
  CinematicLightingEditor: () => import("./components/CinematicLightingEditor"),
  CinematicSequencerEditor: () => import("./components/CinematicSequencerEditor"),
  CodeEditor: () => import("./components/CodeEditor"),
  CodeProfilerTracer: () => import("./components/CodeProfilerTracer"),
  ContentBrowser: () => import("./components/ContentBrowser"),
  CutsceneEditor: () => import("./components/CutsceneEditor"),
  DataTableEditor: () => import("./components/DataTableEditor"),
  DeviceDriverConfigPanel: () => import("./components/DeviceDriverConfigPanel"),
  EconomicBalancer: () => import("./components/EconomicBalancer"),
  EngineCoreEditor: () => import("./components/EngineCoreEditor"),
  FigmaStyleCanvas: () => import("./components/FigmaStyleCanvas"),
  GameEconomyBalancer: () => import("./components/GameEconomyBalancer"),
  GameEngineProfiler: () => import("./components/GameEngineProfiler"),
  GamePreview: () => import("./components/GamePreview"),
  GameSystemsEditor: () => import("./components/GameSystemsEditor"),
  PCGEditor: () => import("./components/PCGEditor"),
  LocalAIStudio: () => import("./components/LocalAIStudio"),
  BatchAIImporter: () => import("./components/BatchAIImporter"),
  VoiceMusicStudio: () => import("./components/VoiceMusicStudio"),
  GPUComputeCluster: () => import("./components/GPUComputeCluster"),
  AIOfflineOCREngine: () => import("./components/AIOfflineOCREngine"),
  AIOfflinePCBStudio: () => import("./components/AIOfflinePCBStudio"),
  AICommandCenter: () => import("./components/AICommandCenter"),
  AudioEditor: () => import("./components/AudioEditor"),
  GitPanel: () => import("./components/GitPanel"),
  GlobalSearchPanel: () => import("./components/GlobalSearchPanel"),
  PerformanceDashboard: () => import("./components/PerformanceDashboard"),
  GlobalUniversalDetailsPanel: () => import("./components/GlobalUniversalDetailsPanel"),
  GraphicsRenderEditor: () => import("./components/GraphicsRenderEditor"),
  HardwareProfilerOverlay: () => import("./components/HardwareProfilerOverlay"),
  HoudiniStyleProceduralNode: () => import("./components/HoudiniStyleProceduralNode"),
  IDECompilerCore: () => import("./components/IDECompilerCore"),
  ImageEditor: () => import("./components/ImageEditor"),
  LiveOpsDashboard: () => import("./components/LiveOpsDashboard"),
  LiveOpsEventScheduler: () => import("./components/LiveOpsEventScheduler"),
  LogViewer: () => import("./components/LogViewer"),
  MLAgentsEditor: () => import("./components/MLAgentsEditor"),
  MapEdit: () => import("./components/MapEdit"),
  ManualSequenceRecorder: () => import("./components/ManualSequenceRecorder"),
  MaterialEditor: () => import("./components/MaterialEditor"),
  MetaHumanEditor: () => import("./components/MetaHumanEditor"),
  ModdingWorkshopPublisher: () => import("./components/ModdingWorkshopPublisher"),
  ModelingEditor: () => import("./components/ModelingEditor"),
  NPCEditor: () => import("./components/NPCEditor"),
  NavMeshRouter: () => import("./components/NavMeshRouter"),
  NetcodeEditor: () => import("./components/NetcodeEditor"),
  NetworkReplicationSim: () => import("./components/NetworkReplicationSim"),
  NetworkSim: () => import("./components/NetworkSim"),
  AIWorkflowEditor: () => import("./components/AIWorkflowEditor"),
  Offline3DModeler: () => import("./components/Offline3DModeler"),
  AIOfflineDownloader: () => import("./components/AIOfflineDownloader"),
  OmniAIAssistantStudio: () => import("./components/OmniAIAssistantStudio"),
  OmniAnimationStudio: () => import("./components/OmniAnimationStudio"),
  OmniAudioDSPStudio: () => import("./components/OmniAudioDSPStudio"),
  OmniBackendNetworkingStudio: () => import("./components/OmniBackendNetworkingStudio"),
  OmniCreatorMaster: () => import("./components/OmniCreatorMaster"),
  OmniEngineIDE: () => import("./components/OmniEngineIDE"),
  OmniMegaWorldBuilder: () => import("./components/OmniMegaWorldBuilder"),
  NextGenEngineHub: () => import("./components/NextGenEngineHub"),
  OmniNarrativeQuestStudio: () => import("./components/OmniNarrativeQuestStudio"),
  OmniVFXCompositorStudio: () => import("./components/OmniVFXCompositorStudio"),
  OmniVFXParticleStudio: () => import("./components/OmniVFXParticleStudio"),
  OmniVisualScriptingEngine: () => import("./components/OmniVisualScriptingEngine"),
  OptimizationEncyclopedia: () => import("./components/OptimizationEncyclopedia"),
  OptimizationOverview: () => import("./components/OptimizationOverview"),
  PerformanceProfiler: () => import("./components/PerformanceProfiler"),
  Photogrammetry3DScanner: () => import("./components/Photogrammetry3DScanner"),
  PhotogrammetryMeshBuilder: () => import("./components/PhotogrammetryMeshBuilder"),
  PipelineEditor: () => import("./components/PipelineEditor"),
  PopOutPanel: () => import("./components/PopOutPanel"),
  ProceduralAssetStudio: () => import("./components/ProceduralAssetStudio"),
  ProjectSettingsEditor: () => import("./components/ProjectSettingsEditor"),
  QuickStartDashboard: () => import("./components/QuickStartDashboard"),
  RenderFarmManager: () => import("./components/RenderFarmManager"),
  ResourceUsageTab: () => import("./components/ResourceUsageTab"),
  ScriptEditor: () => import("./components/ScriptEditor"),
  SettingsModal: () => import("./components/SettingsModal"),
  SkillForgeEditor: () => import("./components/SkillForgeEditor"),
  SubstanceStyleTexturePainter: () => import("./components/SubstanceStyleTexturePainter"),
  TaskPanel: () => import("./components/TaskPanel"),
  TerrainImportUtility: () => import("./components/TerrainImportUtility"),
  TerrainGenerator: () => import("./components/TerrainGenerator"),
  ThaiPhoneticsEngine: () => import("./components/ThaiPhoneticsEngine"),
  NexusPluginArchitect: () => import("./components/NexusPluginArchitect"),
  TopologyUVPro: () => import("./components/TopologyUVPro"),
  AIOfflineMapGenerator: () => import("./components/AIOfflineMapGenerator"),
  AIOfflineModelGenerator: () => import("./components/AIOfflineModelGenerator"),
  AIOfflineUIUXGenerator: () => import("./components/AIOfflineUIUXGenerator"),
  AICodeQualityAuditor: () => import("./components/AICodeQualityAuditor"),
  AIOfflineImageGenerator: () => import("./components/AIOfflineImageGenerator"),
  AIHubMasterMenu: () => import("./components/AIHubMasterMenu"),
  UIUXEditor: () => import("./components/UIUXEditor"),
  UXCognitiveLoadSim: () => import("./components/UXCognitiveLoadSim"),
  VRXREngineEditor: () => import("./components/VRXREngineEditor"),
  VehicleDynamicsEditor: () => import("./components/VehicleDynamicsEditor"),
  VehicleDynamicsTuner: () => import("./components/VehicleDynamicsTuner"),
  ActiveRagdollEuphoriaEngine: () => import("./components/ActiveRagdollEuphoriaEngine"),
  Viewport3D: () => import("./components/Viewport3D"),
  WorldLoreEditor: () => import("./components/WorldLoreEditor"),
  ZBrushStyleSculptingStudio: () => import("./components/ZBrushStyleSculptingStudio"),
  CommandPalette: () => import("./components/CommandPalette"),
  RegexTesterPanel: () => import("./components/RegexTesterPanel"),
  FontEditor: () => import("./components/FontEditor"),
  EyeTrackingHeatmap: () => import("./components/EyeTrackingHeatmap"),
  MonsterEditor: () => import("./components/MonsterEditor"),
  InputMapping: () => import("./components/InputMappingEditor"),
  AccessibilityTester: () => import("./components/AccessibilityTester"),
  VideoEncoderStudio: () => import("./components/VideoEncoderStudio"),
  HexEditorPanel: () => import("./components/HexEditorPanel"),
  ASTNodeWeaver: () => import("./components/ASTNodeWeaver"),
  ProceduralGalaxyBuilder: () => import("./components/ProceduralGalaxyBuilder"),
  VisualShaderGraphEditor: () => import("./components/VisualShaderGraphEditor"),
  AIBehaviorGraphEngine: () => import("./components/AIBehaviorGraphEngine"),
  VisualScriptEditor: () => import("./components/VisualScriptEditor"),
  KernelDebugger: () => import("./components/KernelDebugger"),
  MemoryProfiler: () => import("./components/MemoryProfiler"),
  SystemTap: () => import("./components/SystemTap"),
  AppProfiler: () => import("./components/AppProfiler"),
  VCSConflict: () => import("./components/VCSConflict"),
  HardwareConfig: () => import("./components/HardwareConfig"),
  TerminalSvr: () => import("./components/TerminalSvr"),
  DockerManager: () => import("./components/DockerManager"),
  BuildMonitor: () => import("./components/BuildMonitor"),
  CompilerTool: () => import("./components/CompilerTool"),
  CloudBuildPipeline: () => import("./components/CloudBuildPipeline"),
  VectorHybrid: () => import("./components/VectorHybrid"),
  SpriteSheetGen: () => import("./components/SpriteSheetGen"),
  InteractionPrototyper: () => import("./components/InteractionPrototyper"),
  UltimateOfflineAIStudio: () => import("./components/UltimateOfflineAIStudio"),
  AIChat: () => import("./components/AIChat"),
  AdvancedPCGEngine: () => import("./components/AdvancedPCGEngine"),
  ChaosPhysicsFluidEngine: () => import("./components/ChaosPhysicsFluidEngine"),
  SpatialAudioFoleyStudio: () => import("./components/SpatialAudioFoleyStudio"),
  VisualFlowDebugger: () => import("./components/VisualFlowDebugger"),
  AdvancedSceneEditor: () => import("./components/AdvancedSceneEditor"),
  ParticleEffectEditor: () => import("./components/ParticleEffectEditor"),
  UltimateEffectVFXStudio: () => import("./components/UltimateEffectVFXStudio"),
  AdvancedTimelineEditor: () => import("./components/AdvancedTimelineEditor"),
  UniversalCelestialMechanics: () => import("./components/UniversalCelestialMechanics"),
  TerrainEditor: () => import("./components/TerrainEditor"),
  AdvancedDialogueSystem: () => import("./components/AdvancedDialogueSystem"),
  QuestDesigner: () => import("./components/QuestDesigner"),
  AdvancedAudioEditor: () => import("./components/AdvancedAudioEditor"),
  AdvancedAnimationBlender: () => import("./components/AdvancedAnimationBlender"),
  AdvancedShaderEditor: () => import("./components/AdvancedShaderEditor"),
  AdvancedDebuggingTools: () => import("./components/AdvancedDebuggingTools"),
  MachineLearningIntegration: () => import("./components/MachineLearningIntegration"),
  AdvancedSecuritySystem: () => import("./components/AdvancedSecuritySystem"),
  AdvancedLocalizationSystem: () => import("./components/AdvancedLocalizationSystem"),
  AdvancedAnalyticsTelemetry: () => import("./components/AdvancedAnalyticsTelemetry"),
  AdvancedMarketplaceSystem: () => import("./components/AdvancedMarketplaceSystem"),
  StateLogicGraph: () => import("./components/StateLogicGraph"),
  BehaviorTreeEditor: () => import("./components/BehaviorTreeEditor"),
  GameplayAbilitySystem: () => import("./components/GameplayAbilitySystem"),
  DialogueLocalizationStudio: () => import("./components/DialogueLocalizationStudio"),
  CinematicCameraRig: () => import("./components/CinematicCameraRig"),
  PostProcessingStack: () => import("./components/PostProcessingStack"),
  WeatherAtmosphereEditor: () => import("./components/WeatherAtmosphereEditor"),
  VolumetricCloudEditor: () => import("./components/VolumetricCloudEditor"),
  DestructionFractureEditor: () => import("./components/DestructionFractureEditor"),
  FluidDynamicsSimulator: () => import("./components/FluidDynamicsSimulator"),
  SoftBodyPhysicsTuner: () => import("./components/SoftBodyPhysicsTuner"),
  VehicleRiggingEditor: () => import("./components/VehicleRiggingEditor"),
  CharacterRiggingIK: () => import("./components/CharacterRiggingIK"),
  FacialAnimationMocap: () => import("./components/FacialAnimationMocap"),
  AssetBundleManager: () => import("./components/AssetBundleManager"),
  PluginMarketplace: () => import("./components/PluginMarketplace"),
  VersionControlUI: () => import("./components/VersionControlUI"),
  SpriteAnimationEditor: () => import("./components/SpriteAnimationEditor"),
  TilemapEditor: () => import("./components/TilemapEditor"),
  AchievementSystemEditor: () => import("./components/AchievementSystemEditor"),
  LeaderboardMatchmaking: () => import("./components/LeaderboardMatchmaking"),
  EconomyMonetization: () => import("./components/EconomyMonetization"),
  CrashAnalyticsDashboard: () => import("./components/CrashAnalyticsDashboard"),
  ProceduralCityGenerator: () => import("./components/ProceduralCityGenerator"),
  LODManager: () => import("./components/LODManager"),
  NavMeshBakingStudio: () => import("./components/NavMeshBakingStudio"),
  VirtualProductionStudio: () => import("./components/VirtualProductionStudio"),
  DedicatedServerConfig: () => import("./components/DedicatedServerConfig"),
  AntiCheatSecurityHub: () => import("./components/AntiCheatSecurityHub"),
  ModdingWorkshopTool: () => import("./components/ModdingWorkshopTool"),
  MaterialInstanceEditor: () => import("./components/MaterialInstanceEditor"),
  ReflectionProbeManager: () => import("./components/ReflectionProbeManager"),
  LightmapBakerStudio: () => import("./components/LightmapBakerStudio"),
  DecalProjectorManager: () => import("./components/DecalProjectorManager"),
  PathfindingDebugger: () => import("./components/PathfindingDebugger"),
  CrowdSimulationTool: () => import("./components/CrowdSimulationTool"),
  FlockingBoidsConfig: () => import("./components/FlockingBoidsConfig"),
  SplinePathEditor: () => import("./components/SplinePathEditor"),
  InventoryItemDatabase: () => import("./components/InventoryItemDatabase"),
  QuestMissionBuilder: () => import("./components/QuestMissionBuilder"),
  FactionReputationSystem: () => import("./components/FactionReputationSystem"),
  SkillTreeLevelingConfig: () => import("./components/SkillTreeLevelingConfig"),
  LootTableEditor: () => import("./components/LootTableEditor"),
  CraftingRecipeManager: () => import("./components/CraftingRecipeManager"),
  DamageCalculationConfig: () => import("./components/DamageCalculationConfig"),
  DataTableJSONEditor: () => import("./components/DataTableJSONEditor"),
  StateSerializationManager: () => import("./components/StateSerializationManager"),
  CSVXMLImporter: () => import("./components/CSVXMLImporter"),
  DatabaseMigrationTool: () => import("./components/DatabaseMigrationTool"),
  RemoteConfigABTesting: () => import("./components/RemoteConfigABTesting"),
  CrossPlatformBuildTargeter: () => import("./components/CrossPlatformBuildTargeter"),
  ConsoleCertChecker: () => import("./components/ConsoleCertChecker"),
  AppStoreMetadataEditor: () => import("./components/AppStoreMetadataEditor"),
  ScreenshotTrailerCapture: () => import("./components/ScreenshotTrailerCapture"),
  ModelOptimizer: () => import("./components/ModelOptimizer"),
  TextureCompressor: () => import("./components/TextureCompressor"),
  AudioCompressor: () => import("./components/AudioCompressor"),
  LocalizationQATool: () => import("./components/LocalizationQATool"),
  AccessibilityAuditor: () => import("./components/AccessibilityAuditor"),
  InputRecordingPlayback: () => import("./components/InputRecordingPlayback"),
  ChaosTestingTool: () => import("./components/ChaosTestingTool"),
  GameplayHeatmapViewer: () => import("./components/GameplayHeatmapViewer"),
  BugReportManager: () => import("./components/BugReportManager"),
  NetworkPacketAnalyzer: () => import("./components/NetworkPacketAnalyzer"),
  AudioMixingConsole: () => import("./components/AudioMixingConsole"),
  InputMappingEditor: () => import("./components/InputMappingEditor"),
  GameSaveManager: () => import("./components/GameSaveManager"),
  SceneHierarchyGraph: () => import("./components/SceneHierarchyGraph"),
  RaytracingConfigurator: () => import("./components/RaytracingConfigurator"),
  GlobalIlluminationTuner: () => import("./components/GlobalIlluminationTuner"),
  HapticsRumbleEditor: () => import("./components/HapticsRumbleEditor"),
  ProceduralAudioGen: () => import("./components/ProceduralAudioGen"),
  LipSyncAutomator: () => import("./components/LipSyncAutomator"),
  MotionMatchingStudio: () => import("./components/MotionMatchingStudio"),
  InverseKinematicsDebugger: () => import("./components/InverseKinematicsDebugger"),
  ServerNetworkProfiler: () => import("./components/ServerNetworkProfiler"),
  PostProcessVFXChain: () => import("./components/PostProcessVFXChain"),
  AnimationRiggingStudio: () => import("./components/AnimationRiggingStudio"),
  AdvancedPhysicsLab: () => import("./components/AdvancedPhysicsLab"),
  AIQuestDialogueGraph: () => import("./components/AIQuestDialogueGraph"),
  BiomeFoliageGenerator: () => import("./components/BiomeFoliageGenerator"),
  AdvancedMaterialGraph: () => import("./components/AdvancedMaterialGraph"),
  LiveOpsManager: () => import("./components/LiveOpsManager"),
  GenerativeAudioStudio: () => import("./components/GenerativeAudioStudio"),
  AICodeAgentStudio: () => import("./components/AICodeAgentStudio"),
  ChaosDestructionLab: () => import("./components/ChaosDestructionLab"),
  VersionControlStudio: () => import("./components/VersionControlStudio"),
  VisualScriptingBlueprint: () => import("./components/VisualScriptingBlueprint"),
  MultiplayerServerOrchestrator: () => import("./components/MultiplayerServerOrchestrator"),
  AINPCBehaviorTreeEditor: () => import("./components/AINPCBehaviorTreeEditor"),
  SpatialAudioMixer: () => import("./components/SpatialAudioMixer"),
  VolumetricCloudAtmosphere: () => import("./components/VolumetricCloudAtmosphere"),
  ProceduralDungeonGenerator: () => import("./components/ProceduralDungeonGenerator"),
  MotionCaptureStudio: () => import("./components/MotionCaptureStudio"),
  PhotorealisticRenderSettings: () => import("./components/PhotorealisticRenderSettings"),
  AITextureGenerator: () => import("./components/AITextureGenerator"),
  GameMonetizationStorefront: () => import("./components/GameMonetizationStorefront"),
  CinematicTimelineSequencer: () => import("./components/CinematicTimelineSequencer"),
  ProceduralTerrainErosionSimulator: () => import("./components/ProceduralTerrainErosionSimulator"),
  AdvancedNodeGraphEditor: () => import("./components/AdvancedNodeGraphEditor"),
  PhysicsAssetEditor: () => import("./components/PhysicsAssetEditor"),
  MultiplayerRelevancyGraph: () => import("./components/MultiplayerRelevancyGraph"),
  EconomyLiveOpsEditor: () => import("./components/EconomyLiveOpsEditor"),
  DestructibleMeshEditor: () => import("./components/DestructibleMeshEditor"),
  OfflineAICodingAssistant: () => import("./components/OfflineAICodingAssistant"),
};

export const preloadComponent = (id: string) => { if(componentImports[id]) componentImports[id](); };



const AdvancedPhysicsEngine = React.lazy(componentImports.AdvancedPhysicsEngine);
const AdvancedEvolutionSystem = React.lazy(componentImports.AdvancedEvolutionSystem);
const ArchitectureDevOpsEditor = React.lazy(componentImports.ArchitectureDevOpsEditor);
const AssetStore = React.lazy(componentImports.AssetStore);
const BasicSkeletonModel = React.lazy(componentImports.BasicSkeletonModel);
const BlueprintEditor = React.lazy(componentImports.BlueprintEditor);
const BuildPublishEditor = React.lazy(componentImports.BuildPublishEditor);
const ChronoDebugger = React.lazy(componentImports.ChronoDebugger);
const CinematicDirector = React.lazy(componentImports.CinematicDirector);
const CinematicLightingEditor = React.lazy(componentImports.CinematicLightingEditor);
const CinematicSequencerEditor = React.lazy(componentImports.CinematicSequencerEditor);
const CodeEditor = React.lazy(componentImports.CodeEditor);
const CodeProfilerTracer = React.lazy(componentImports.CodeProfilerTracer);
const ContentBrowser = React.lazy(componentImports.ContentBrowser);
const CutsceneEditor = React.lazy(componentImports.CutsceneEditor);
const DataTableEditor = React.lazy(componentImports.DataTableEditor);
const DeviceDriverConfigPanel = React.lazy(componentImports.DeviceDriverConfigPanel);
const EconomicBalancer = React.lazy(componentImports.EconomicBalancer);
const EngineCoreEditor = React.lazy(componentImports.EngineCoreEditor);
const FigmaStyleCanvas = React.lazy(componentImports.FigmaStyleCanvas);
const GameEconomyBalancer = React.lazy(componentImports.GameEconomyBalancer);
const GameEngineProfiler = React.lazy(componentImports.GameEngineProfiler);
const GamePreview = React.lazy(componentImports.GamePreview);
const GameSystemsEditor = React.lazy(componentImports.GameSystemsEditor);
const PCGEditor = React.lazy(componentImports.PCGEditor);
const LocalAIStudio = React.lazy(componentImports.LocalAIStudio);
const BatchAIImporter = React.lazy(componentImports.BatchAIImporter);
const VoiceMusicStudio = React.lazy(componentImports.VoiceMusicStudio);
const GPUComputeCluster = React.lazy(componentImports.GPUComputeCluster);

const AIOfflineOCREngine = React.lazy(componentImports.AIOfflineOCREngine);
const AIOfflinePCBStudio = React.lazy(componentImports.AIOfflinePCBStudio);
const AICommandCenter = React.lazy(componentImports.AICommandCenter);
const AudioEditor = React.lazy(componentImports.AudioEditor);
const GitPanel = React.lazy(componentImports.GitPanel);
const GlobalSearchPanel = React.lazy(componentImports.GlobalSearchPanel);
const PerformanceDashboard = React.lazy(componentImports.PerformanceDashboard);
const GlobalUniversalDetailsPanel = React.lazy(componentImports.GlobalUniversalDetailsPanel);
const GraphicsRenderEditor = React.lazy(componentImports.GraphicsRenderEditor);
const HardwareProfilerOverlay = React.lazy(componentImports.HardwareProfilerOverlay);
const HoudiniStyleProceduralNode = React.lazy(componentImports.HoudiniStyleProceduralNode);
const IDECompilerCore = React.lazy(componentImports.IDECompilerCore);
const ImageEditor = React.lazy(componentImports.ImageEditor);
const LiveOpsDashboard = React.lazy(componentImports.LiveOpsDashboard);
const LiveOpsEventScheduler = React.lazy(componentImports.LiveOpsEventScheduler);
const LogViewer = React.lazy(componentImports.LogViewer);
const MLAgentsEditor = React.lazy(componentImports.MLAgentsEditor);
const MapEdit = React.lazy(componentImports.MapEdit);
const ManualSequenceRecorder = React.lazy(componentImports.ManualSequenceRecorder);
const MaterialEditor = React.lazy(componentImports.MaterialEditor);
const MetaHumanEditor = React.lazy(componentImports.MetaHumanEditor);
const ModdingWorkshopPublisher = React.lazy(componentImports.ModdingWorkshopPublisher);
const ModelingEditor = React.lazy(componentImports.ModelingEditor);
const NPCEditor = React.lazy(componentImports.NPCEditor);
const NavMeshRouter = React.lazy(componentImports.NavMeshRouter);
const NetcodeEditor = React.lazy(componentImports.NetcodeEditor);
const NetworkReplicationSim = React.lazy(componentImports.NetworkReplicationSim);
const NetworkSim = React.lazy(componentImports.NetworkSim);
const AIWorkflowEditor = React.lazy(componentImports.AIWorkflowEditor);
const Offline3DModeler = React.lazy(componentImports.Offline3DModeler);
const AIOfflineDownloader = React.lazy(componentImports.AIOfflineDownloader);
const OmniAIAssistantStudio = React.lazy(componentImports.OmniAIAssistantStudio);
const OmniAnimationStudio = React.lazy(componentImports.OmniAnimationStudio);
const OmniAudioDSPStudio = React.lazy(componentImports.OmniAudioDSPStudio);
const OmniBackendNetworkingStudio = React.lazy(componentImports.OmniBackendNetworkingStudio);
const OmniCreatorMaster = React.lazy(componentImports.OmniCreatorMaster);
const OmniEngineIDE = React.lazy(componentImports.OmniEngineIDE);
const OmniMegaWorldBuilder = React.lazy(componentImports.OmniMegaWorldBuilder);
const NextGenEngineHub = React.lazy(componentImports.NextGenEngineHub);
const OmniNarrativeQuestStudio = React.lazy(componentImports.OmniNarrativeQuestStudio);
const OmniVFXCompositorStudio = React.lazy(componentImports.OmniVFXCompositorStudio);
const OmniVFXParticleStudio = React.lazy(componentImports.OmniVFXParticleStudio);
const OmniVisualScriptingEngine = React.lazy(componentImports.OmniVisualScriptingEngine);
const OptimizationEncyclopedia = React.lazy(componentImports.OptimizationEncyclopedia);
const OptimizationOverview = React.lazy(componentImports.OptimizationOverview);
const PerformanceProfiler = React.lazy(componentImports.PerformanceProfiler);
const Photogrammetry3DScanner = React.lazy(componentImports.Photogrammetry3DScanner);
const PhotogrammetryMeshBuilder = React.lazy(componentImports.PhotogrammetryMeshBuilder);
const PipelineEditor = React.lazy(componentImports.PipelineEditor);
const PopOutPanel = React.lazy(componentImports.PopOutPanel);
const ProceduralAssetStudio = React.lazy(componentImports.ProceduralAssetStudio);
const ProjectSettingsEditor = React.lazy(componentImports.ProjectSettingsEditor);
const QuickStartDashboard = React.lazy(componentImports.QuickStartDashboard);
const RenderFarmManager = React.lazy(componentImports.RenderFarmManager);
const ResourceUsageTab = React.lazy(componentImports.ResourceUsageTab);
const ScriptEditor = React.lazy(componentImports.ScriptEditor);
const SettingsModal = React.lazy(componentImports.SettingsModal);
const SkillForgeEditor = React.lazy(componentImports.SkillForgeEditor);
const SubstanceStyleTexturePainter = React.lazy(componentImports.SubstanceStyleTexturePainter);
const TaskPanel = React.lazy(componentImports.TaskPanel);

const TerrainImportUtility = React.lazy(componentImports.TerrainImportUtility);
const TerrainGenerator = React.lazy(componentImports.TerrainGenerator);
const ThaiPhoneticsEngine = React.lazy(componentImports.ThaiPhoneticsEngine);
const NexusPluginArchitect = React.lazy(componentImports.NexusPluginArchitect);
const TopologyUVPro = React.lazy(componentImports.TopologyUVPro);
const AIOfflineMapGenerator = React.lazy(componentImports.AIOfflineMapGenerator);
const AIOfflineModelGenerator = React.lazy(componentImports.AIOfflineModelGenerator);
const AIOfflineUIUXGenerator = React.lazy(componentImports.AIOfflineUIUXGenerator);
const AICodeQualityAuditor = React.lazy(componentImports.AICodeQualityAuditor);
const AIOfflineImageGenerator = React.lazy(componentImports.AIOfflineImageGenerator);
const ActiveRagdollEuphoriaEngine = React.lazy(componentImports.ActiveRagdollEuphoriaEngine);
const AIHubMasterMenu = React.lazy(componentImports.AIHubMasterMenu);
const UIUXEditor = React.lazy(componentImports.UIUXEditor);
const UXCognitiveLoadSim = React.lazy(componentImports.UXCognitiveLoadSim);
const VRXREngineEditor = React.lazy(componentImports.VRXREngineEditor);
const VehicleDynamicsEditor = React.lazy(componentImports.VehicleDynamicsEditor);
const VehicleDynamicsTuner = React.lazy(componentImports.VehicleDynamicsTuner);
const Viewport3D = React.lazy(componentImports.Viewport3D);
const WorldLoreEditor = React.lazy(componentImports.WorldLoreEditor);
const ZBrushStyleSculptingStudio = React.lazy(componentImports.ZBrushStyleSculptingStudio);
const CommandPalette = React.lazy(componentImports.CommandPalette);
const RegexTesterPanel = React.lazy(componentImports.RegexTesterPanel);
const FontEditor = React.lazy(componentImports.FontEditor);
const EyeTrackingHeatmap = React.lazy(componentImports.EyeTrackingHeatmap);
const MonsterEditor = React.lazy(componentImports.MonsterEditor);
const InputMapping = React.lazy(componentImports.InputMapping);
const AccessibilityTester = React.lazy(componentImports.AccessibilityTester);
const VideoEncoderStudio = React.lazy(componentImports.VideoEncoderStudio);
const HexEditorPanel = React.lazy(componentImports.HexEditorPanel);
const ASTNodeWeaver = React.lazy(componentImports.ASTNodeWeaver);
const ProceduralGalaxyBuilder = React.lazy(componentImports.ProceduralGalaxyBuilder);
const VisualShaderGraphEditor = React.lazy(componentImports.VisualShaderGraphEditor);
const AIBehaviorGraphEngine = React.lazy(componentImports.AIBehaviorGraphEngine);
const VisualScriptEditor = React.lazy(componentImports.VisualScriptEditor);
const KernelDebugger = React.lazy(componentImports.KernelDebugger);
const MemoryProfiler = React.lazy(componentImports.MemoryProfiler);

const SystemTap = React.lazy(componentImports.SystemTap);
const AppProfiler = React.lazy(componentImports.AppProfiler);
const VCSConflict = React.lazy(componentImports.VCSConflict);
const HardwareConfig = React.lazy(componentImports.HardwareConfig);
const TerminalSvr = React.lazy(componentImports.TerminalSvr);
const DockerManager = React.lazy(componentImports.DockerManager);
const BuildMonitor = React.lazy(componentImports.BuildMonitor);
const CompilerTool = React.lazy(componentImports.CompilerTool);
const CloudBuildPipeline = React.lazy(componentImports.CloudBuildPipeline);
const VectorHybrid = React.lazy(componentImports.VectorHybrid);
const SpriteSheetGen = React.lazy(componentImports.SpriteSheetGen);
const InteractionPrototyper = React.lazy(componentImports.InteractionPrototyper);

const UltimateOfflineAIStudio = React.lazy(componentImports.UltimateOfflineAIStudio);

const AIChat = React.lazy(componentImports.AIChat);

const AdvancedPCGEngine = React.lazy(componentImports.AdvancedPCGEngine);
const ChaosPhysicsFluidEngine = React.lazy(componentImports.ChaosPhysicsFluidEngine);
const SpatialAudioFoleyStudio = React.lazy(componentImports.SpatialAudioFoleyStudio);
const VisualFlowDebugger = React.lazy(componentImports.VisualFlowDebugger);
const AdvancedSceneEditor = React.lazy(componentImports.AdvancedSceneEditor);
const UltimateEffectVFXStudio = React.lazy(componentImports.UltimateEffectVFXStudio);


const AdvancedTimelineEditor = React.lazy(componentImports.AdvancedTimelineEditor);
const UniversalCelestialMechanics = React.lazy(componentImports.UniversalCelestialMechanics);
const TerrainEditor = React.lazy(componentImports.TerrainEditor);
const AdvancedDialogueSystem = React.lazy(componentImports.AdvancedDialogueSystem);
const QuestDesigner = React.lazy(componentImports.QuestDesigner);
const AdvancedAudioEditor = React.lazy(componentImports.AdvancedAudioEditor);
const AdvancedAnimationBlender = React.lazy(componentImports.AdvancedAnimationBlender);
const AdvancedShaderEditor = React.lazy(componentImports.AdvancedShaderEditor);
const AdvancedDebuggingTools = React.lazy(componentImports.AdvancedDebuggingTools);
const MachineLearningIntegration = React.lazy(componentImports.MachineLearningIntegration);
const AdvancedSecuritySystem = React.lazy(componentImports.AdvancedSecuritySystem);
const AdvancedLocalizationSystem = React.lazy(componentImports.AdvancedLocalizationSystem);
const AdvancedAnalyticsTelemetry = React.lazy(componentImports.AdvancedAnalyticsTelemetry);
const AdvancedMarketplaceSystem = React.lazy(componentImports.AdvancedMarketplaceSystem);
const StateLogicGraph = React.lazy(componentImports.StateLogicGraph);
const BehaviorTreeEditor = React.lazy(componentImports.BehaviorTreeEditor);
const GameplayAbilitySystem = React.lazy(componentImports.GameplayAbilitySystem);
const DialogueLocalizationStudio = React.lazy(componentImports.DialogueLocalizationStudio);
const CinematicCameraRig = React.lazy(componentImports.CinematicCameraRig);
const PostProcessingStack = React.lazy(componentImports.PostProcessingStack);
const WeatherAtmosphereEditor = React.lazy(componentImports.WeatherAtmosphereEditor);
const VolumetricCloudEditor = React.lazy(componentImports.VolumetricCloudEditor);
const DestructionFractureEditor = React.lazy(componentImports.DestructionFractureEditor);
const FluidDynamicsSimulator = React.lazy(componentImports.FluidDynamicsSimulator);
const SoftBodyPhysicsTuner = React.lazy(componentImports.SoftBodyPhysicsTuner);
const VehicleRiggingEditor = React.lazy(componentImports.VehicleRiggingEditor);
const CharacterRiggingIK = React.lazy(componentImports.CharacterRiggingIK);
const FacialAnimationMocap = React.lazy(componentImports.FacialAnimationMocap);
const AssetBundleManager = React.lazy(componentImports.AssetBundleManager);
const PluginMarketplace = React.lazy(componentImports.PluginMarketplace);
const VersionControlUI = React.lazy(componentImports.VersionControlUI);
const SpriteAnimationEditor = React.lazy(componentImports.SpriteAnimationEditor);
const TilemapEditor = React.lazy(componentImports.TilemapEditor);
const AchievementSystemEditor = React.lazy(componentImports.AchievementSystemEditor);
const LeaderboardMatchmaking = React.lazy(componentImports.LeaderboardMatchmaking);
const EconomyMonetization = React.lazy(componentImports.EconomyMonetization);
const CrashAnalyticsDashboard = React.lazy(componentImports.CrashAnalyticsDashboard);
const ProceduralCityGenerator = React.lazy(componentImports.ProceduralCityGenerator);
const LODManager = React.lazy(componentImports.LODManager);
const NavMeshBakingStudio = React.lazy(componentImports.NavMeshBakingStudio);
const VirtualProductionStudio = React.lazy(componentImports.VirtualProductionStudio);
const DedicatedServerConfig = React.lazy(componentImports.DedicatedServerConfig);
const AntiCheatSecurityHub = React.lazy(componentImports.AntiCheatSecurityHub);
const ModdingWorkshopTool = React.lazy(componentImports.ModdingWorkshopTool);
const MaterialInstanceEditor = React.lazy(componentImports.MaterialInstanceEditor);
const ReflectionProbeManager = React.lazy(componentImports.ReflectionProbeManager);
const LightmapBakerStudio = React.lazy(componentImports.LightmapBakerStudio);
const DecalProjectorManager = React.lazy(componentImports.DecalProjectorManager);
const PathfindingDebugger = React.lazy(componentImports.PathfindingDebugger);
const CrowdSimulationTool = React.lazy(componentImports.CrowdSimulationTool);
const FlockingBoidsConfig = React.lazy(componentImports.FlockingBoidsConfig);
const SplinePathEditor = React.lazy(componentImports.SplinePathEditor);
const InventoryItemDatabase = React.lazy(componentImports.InventoryItemDatabase);
const QuestMissionBuilder = React.lazy(componentImports.QuestMissionBuilder);
const FactionReputationSystem = React.lazy(componentImports.FactionReputationSystem);
const SkillTreeLevelingConfig = React.lazy(componentImports.SkillTreeLevelingConfig);
const LootTableEditor = React.lazy(componentImports.LootTableEditor);
const CraftingRecipeManager = React.lazy(componentImports.CraftingRecipeManager);
const DamageCalculationConfig = React.lazy(componentImports.DamageCalculationConfig);
const DataTableJSONEditor = React.lazy(componentImports.DataTableJSONEditor);
const StateSerializationManager = React.lazy(componentImports.StateSerializationManager);
const CSVXMLImporter = React.lazy(componentImports.CSVXMLImporter);
const DatabaseMigrationTool = React.lazy(componentImports.DatabaseMigrationTool);
const RemoteConfigABTesting = React.lazy(componentImports.RemoteConfigABTesting);
const CrossPlatformBuildTargeter = React.lazy(componentImports.CrossPlatformBuildTargeter);
const ConsoleCertChecker = React.lazy(componentImports.ConsoleCertChecker);
const AppStoreMetadataEditor = React.lazy(componentImports.AppStoreMetadataEditor);
const ScreenshotTrailerCapture = React.lazy(componentImports.ScreenshotTrailerCapture);
const ModelOptimizer = React.lazy(componentImports.ModelOptimizer);
const TextureCompressor = React.lazy(componentImports.TextureCompressor);
const AudioCompressor = React.lazy(componentImports.AudioCompressor);
const LocalizationQATool = React.lazy(componentImports.LocalizationQATool);
const AccessibilityAuditor = React.lazy(componentImports.AccessibilityAuditor);
const InputRecordingPlayback = React.lazy(componentImports.InputRecordingPlayback);
const ChaosTestingTool = React.lazy(componentImports.ChaosTestingTool);
const GameplayHeatmapViewer = React.lazy(componentImports.GameplayHeatmapViewer);
const BugReportManager = React.lazy(componentImports.BugReportManager);
const NetworkPacketAnalyzer = React.lazy(componentImports.NetworkPacketAnalyzer);
const AudioMixingConsole = React.lazy(componentImports.AudioMixingConsole);
const InputMappingEditor = React.lazy(componentImports.InputMappingEditor);
const GameSaveManager = React.lazy(componentImports.GameSaveManager);
const SceneHierarchyGraph = React.lazy(componentImports.SceneHierarchyGraph);
const RaytracingConfigurator = React.lazy(componentImports.RaytracingConfigurator);
const GlobalIlluminationTuner = React.lazy(componentImports.GlobalIlluminationTuner);
const HapticsRumbleEditor = React.lazy(componentImports.HapticsRumbleEditor);
const ProceduralAudioGen = React.lazy(componentImports.ProceduralAudioGen);
const LipSyncAutomator = React.lazy(componentImports.LipSyncAutomator);
const MotionMatchingStudio = React.lazy(componentImports.MotionMatchingStudio);
const InverseKinematicsDebugger = React.lazy(componentImports.InverseKinematicsDebugger);
const ServerNetworkProfiler = React.lazy(componentImports.ServerNetworkProfiler);
const PostProcessVFXChain = React.lazy(componentImports.PostProcessVFXChain);
const AnimationRiggingStudio = React.lazy(componentImports.AnimationRiggingStudio);
const AdvancedPhysicsLab = React.lazy(componentImports.AdvancedPhysicsLab);
const AIQuestDialogueGraph = React.lazy(componentImports.AIQuestDialogueGraph);
const BiomeFoliageGenerator = React.lazy(componentImports.BiomeFoliageGenerator);
const AdvancedMaterialGraph = React.lazy(componentImports.AdvancedMaterialGraph);
const LiveOpsManager = React.lazy(componentImports.LiveOpsManager);
const GenerativeAudioStudio = React.lazy(componentImports.GenerativeAudioStudio);
const AICodeAgentStudio = React.lazy(componentImports.AICodeAgentStudio);
const ChaosDestructionLab = React.lazy(componentImports.ChaosDestructionLab);
const VersionControlStudio = React.lazy(componentImports.VersionControlStudio);
const VisualScriptingBlueprint = React.lazy(componentImports.VisualScriptingBlueprint);
const MultiplayerServerOrchestrator = React.lazy(componentImports.MultiplayerServerOrchestrator);
const AINPCBehaviorTreeEditor = React.lazy(componentImports.AINPCBehaviorTreeEditor);
const SpatialAudioMixer = React.lazy(componentImports.SpatialAudioMixer);
const VolumetricCloudAtmosphere = React.lazy(componentImports.VolumetricCloudAtmosphere);
const ProceduralDungeonGenerator = React.lazy(componentImports.ProceduralDungeonGenerator);

const MotionCaptureStudio = React.lazy(componentImports.MotionCaptureStudio);
const PhotorealisticRenderSettings = React.lazy(componentImports.PhotorealisticRenderSettings);
const AITextureGenerator = React.lazy(componentImports.AITextureGenerator);
const GameMonetizationStorefront = React.lazy(componentImports.GameMonetizationStorefront);

const CinematicTimelineSequencer = React.lazy(componentImports.CinematicTimelineSequencer);
const ProceduralTerrainErosionSimulator = React.lazy(componentImports.ProceduralTerrainErosionSimulator);
const AdvancedNodeGraphEditor = React.lazy(componentImports.AdvancedNodeGraphEditor);
const PhysicsAssetEditor = React.lazy(componentImports.PhysicsAssetEditor);
const MultiplayerRelevancyGraph = React.lazy(componentImports.MultiplayerRelevancyGraph);
const EconomyLiveOpsEditor = React.lazy(componentImports.EconomyLiveOpsEditor);
const DestructibleMeshEditor = React.lazy(componentImports.DestructibleMeshEditor);
const OfflineAICodingAssistant = React.lazy(componentImports.OfflineAICodingAssistant);
const ProjectManagementSystem = React.lazy(componentImports.ProjectManagementSystem);

export const tools = [
    // 1. 🌟 DASHBOARD & PROJECT
    {
      id: "ProjectHub",
      title: "Dashboard & Project Hub",
      icon: <Command size={20} />,
      activeColor: "text-[#f85149]",
      category: "🌟 CORE",
      subTools: [
        { id: "OmniCreatorMaster", title: "Global Omniverse", icon: <Command size={16} /> },
        { id: "QuickStart", title: "Home / Project Hub", icon: <Rocket size={16} /> },
        { id: "ProjectManagementSystem", title: "Agile & Task Board", icon: <FolderTree size={16} /> },
        { id: "LiveOpsManager", title: "LiveOps & A/B Testing", icon: <Globe size={16} /> }
      ]
    },

    // 2. 🤖 AI & CODE IDE
    {
      id: "CodeIDEHub",
      title: "AI & Code IDE",
      icon: <TerminalSquare size={20} />,
      activeColor: "text-[#ff7b72]",
      category: "🤖 AI & CODE",
      subTools: [
        { id: "AICodeAgentStudio", title: "AI Code Agent Studio", icon: <Cpu size={16} /> },
        { id: "OfflineAICodingAssistant", title: "Offline AI Assistant", icon: <Bot size={16} /> },
        { id: "Select", title: "Text Code Editor", icon: <Code2 size={16} /> },
        { id: "VisualScripting", title: "Visual Script Editor", icon: <Network size={16} /> },
        { id: "VisualFlowDebugger", title: "Flow Debugger", icon: <Bug size={16} /> },
        { id: "CodeProfilerTracer", title: "Profiler & Tracer", icon: <Activity size={16} /> }
      ]
    },

    // 2.5 🧠 AI HUB & OFFLINE MODELS
    {
      id: "AIHubMaster",
      title: "AI Hub & Offline Models",
      icon: <BrainCircuit size={20} />,
      activeColor: "text-[#8a2be2]",
      category: "🤖 AI & CODE",
      subTools: [
        { id: "AIHubMasterMenu", title: "AI Master Hub", icon: <Brain size={16} /> },
        { id: "UltimateOfflineAIStudio", title: "Ultimate Offline AI", icon: <Cpu size={16} /> },
        { id: "LocalAIStudio", title: "Local AI Models", icon: <HardDrive size={16} /> },
        { id: "AIOfflineDownloader", title: "Offline Downloader", icon: <Download size={16} /> },
        { id: "AIOfflineMapGenerator", title: "Offline AI Map", icon: <Map size={16} /> },
        { id: "AIOfflineModelGenerator", title: "Offline AI 3D Model", icon: <Box size={16} /> },
        { id: "AIOfflineUIUXGenerator", title: "Offline AI UI/UX", icon: <LayoutDashboard size={16} /> },
        { id: "AICodeQualityAuditor", title: "Code Auditor and Standards", icon: <ShieldCheck size={16} /> },
        { id: "AIOfflineImageGenerator", title: "Offline AI Image", icon: <Image size={16} /> }
      ]
    },

    // 3. 🌍 WORLD & ENVIRONMENT
    {
      id: "WorldHub",
      title: "World & Environment",
      icon: <Globe size={20} />,
      activeColor: "text-[#58a6ff]",
      category: "🌍 WORLD BUILDING",
      subTools: [
        { id: "OmniWorldBuilder", title: "MegaWorld Builder", icon: <Globe size={16} /> },
        { id: "MapEdit", title: "Map & Level Editor", icon: <Map size={16} /> },
        { id: "AdvancedPCGEngine", title: "Procedural City & Terrain", icon: <Mountain size={16} /> },
        { id: "WeatherAtmosphereEditor", title: "Weather & Sky", icon: <CloudRain size={16} /> },
        { id: "NavMeshBakingStudio", title: "NavMesh Baker", icon: <Route size={16} /> }
      ]
    },

    // 4. 🎨 3D MODELING & ART
    {
      id: "ArtStudioHub",
      title: "3D Modeling & Art",
      icon: <Box size={20} />,
      activeColor: "text-[#e3b341]",
      category: "🎨 ART STUDIO",
      subTools: [
        { id: "Modeling", title: "3D Modeling Studio", icon: <Box size={16} /> },
        { id: "ZBrushStyleSculptingStudio", title: "Sculpting Studio", icon: <Palette size={16} /> },
        { id: "PhotogrammetryMeshBuilder", title: "Photogrammetry", icon: <Camera size={16} /> },
        { id: "ModelOptimizer", title: "Model Optimizer", icon: <Minimize size={16} /> },
        { id: "DestructibleMeshEditor", title: "Destruction Editor", icon: <Scissors size={16} /> }
      ]
    },

    // 5. 🖌️ TEXTURE & MATERIALS
    {
      id: "TextureHub",
      title: "Texture & Materials",
      icon: <Palette size={20} />,
      activeColor: "text-[#ff9800]",
      category: "🎨 ART STUDIO",
      subTools: [
        { id: "TextureEdit", title: "Texture Manager", icon: <Image size={16} /> },
        { id: "ImageEdit", title: "Texture Painter", icon: <Palette size={16} /> },
        { id: "VisualShaderGraphEditor", title: "Visual Shader Graph", icon: <Layers size={16} /> },
        { id: "MaterialInstanceEditor", title: "Material Instances", icon: <Layers size={16} /> },
        { id: "AITextureGenerator", title: "AI Texture Gen", icon: <Sparkles size={16} /> }
      ]
    },

    // 6. 🎬 CINEMATICS & ANIMATION
    {
      id: "AnimationHub",
      title: "Cinematics & Animation",
      icon: <Clapperboard size={20} />,
      activeColor: "text-[#bc8cff]",
      category: "🎬 ANIMATION",
      subTools: [
        { id: "Sequencer", title: "Cinematic Sequencer", icon: <Clapperboard size={16} /> },
        { id: "OmniAnimationStudio", title: "MoCap & Rigging", icon: <PersonStanding size={16} /> },
        { id: "FacialAnimationMocap", title: "Facial Animation", icon: <Smile size={16} /> },
        { id: "SpriteAnimationEditor", title: "2D Sprite Animator", icon: <Image size={16} /> },
        { id: "VirtualProductionStudio", title: "Virtual Production", icon: <Video size={16} /> }
      ]
    },

    // 7. ✨ VFX & PARTICLES
    {
      id: "VFXHub",
      title: "VFX & Particles",
      icon: <Wand2 size={20} />,
      activeColor: "text-[#4caf50]",
      category: "✨ EFFECTS",
      subTools: [
        { id: "OmniVFXStudio", title: "Ultimate VFX Studio", icon: <Wand2 size={16} /> },
        { id: "ParticleEffectEditor", title: "Particle Designer", icon: <Sparkles size={16} /> },
        { id: "PostProcessingStack", title: "Post-Processing", icon: <Camera size={16} /> },
        { id: "DecalProjectorManager", title: "Decal Manager", icon: <Sticker size={16} /> }
      ]
    },

    // 8. 🎵 AUDIO & SOUND
    {
      id: "AudioHub",
      title: "Audio & Sound",
      icon: <Mic2 size={20} />,
      activeColor: "text-[#e3b341]",
      category: "🎵 AUDIO",
      subTools: [
        { id: "OmniAudioStudio", title: "DSP Audio Studio", icon: <Mic2 size={16} /> },
        { id: "SpatialAudioFoley", title: "Spatial & Foley", icon: <Ear size={16} /> },
        { id: "GenerativeAudioStudio", title: "AI Audio Gen", icon: <Music size={16} /> },
        { id: "AudioMixingConsole", title: "Mixing Console", icon: <Sliders size={16} /> }
      ]
    },

    // 9. 🎮 GAME SYSTEMS & ECONOMY
    {
      id: "GameDesignHub",
      title: "Game Systems & Economy",
      icon: <Blocks size={20} />,
      activeColor: "text-[#58a6ff]",
      category: "🎮 GAME DESIGN",
      subTools: [
        { id: "GameSystems", title: "Core Systems Editor", icon: <Blocks size={16} /> },
        { id: "EconomicBalancer", title: "Economy & Combat", icon: <Database size={16} /> },
        { id: "LootTableEditor", title: "Loot & Crafting", icon: <Gift size={16} /> },
        { id: "SkillTreeLevelingConfig", title: "Skill Trees & Levels", icon: <TrendingUp size={16} /> },
        { id: "GameplayAbilitySystem", title: "Ability System", icon: <Zap size={16} /> }
      ]
    },

    // 10. 👤 CHARACTERS & AI
    {
      id: "CharacterAIHub",
      title: "Characters & AI NPC",
      icon: <Users size={20} />,
      activeColor: "text-[#e91e63]",
      category: "🎮 GAME DESIGN",
      subTools: [
        { id: "NPCEdit", title: "NPC & MetaHuman", icon: <Users size={16} /> },
        { id: "MonsterEdit", title: "Monster Editor", icon: <Ghost size={16} /> },
        { id: "AINPCBehaviorTreeEditor", title: "AI Behavior Trees", icon: <BrainCircuit size={16} /> },
        { id: "CrowdSimulationTool", title: "Crowd Simulation", icon: <Activity size={16} /> }
      ]
    },

    // 11. 📖 STORY & QUESTS
    {
      id: "StoryQuestHub",
      title: "Story & Quests",
      icon: <BookOpen size={20} />,
      activeColor: "text-[#9c27b0]",
      category: "🎮 GAME DESIGN",
      subTools: [
        { id: "WorldLore", title: "World Lore", icon: <BookOpen size={16} /> },
        { id: "QuestDesigner", title: "Quest Designer", icon: <MapPin size={16} /> },
        { id: "AdvancedDialogueSystem", title: "Dialogue System", icon: <MessageCircle size={16} /> },
        { id: "FactionReputationSystem", title: "Factions & Rep", icon: <Flag size={16} /> }
      ]
    },

    // 12. ⚛️ PHYSICS & SIMULATION
    {
      id: "PhysicsHub",
      title: "Physics & Simulation",
      icon: <Activity size={20} />,
      activeColor: "text-[#ff5722]",
      category: "⚛️ SIMULATION",
      subTools: [
        { id: "ChaosPhysicsFluidEngine", title: "Chaos & Fluids", icon: <Flame size={16} /> },
        { id: "VehicleDynamicsTuner", title: "Vehicle Dynamics", icon: <Car size={16} /> },
        { id: "ActiveRagdollEuphoriaEngine", title: "Euphoria Active Ragdoll", icon: <Activity size={16} /> },
        { id: "SoftBodyPhysicsTuner", title: "Soft Body Physics", icon: <Box size={16} /> },
        { id: "ChaosDestructionLab", title: "Destruction Lab", icon: <Bomb size={16} /> }
      ]
    },

    // 13. 💡 LIGHTING & RENDER
    {
      id: "RenderHub",
      title: "Lighting & Render",
      icon: <Sun size={20} />,
      activeColor: "text-[#ffc107]",
      category: "💡 RENDERING",
      subTools: [
        { id: "CinematicLightingEditor", title: "Cinematic Lighting", icon: <Sun size={16} /> },
        { id: "GraphicsRender", title: "Graphics Render", icon: <Orbit size={16} /> },
        { id: "RaytracingConfigurator", title: "Raytracing & GI", icon: <Sun size={16} /> },
        { id: "RenderFarmManager", title: "Render Farm", icon: <Server size={16} /> }
      ]
    },

    // 14. 📐 UI/UX & DATA
    {
      id: "UIUXDataHub",
      title: "UI/UX & Data",
      icon: <LayoutDashboard size={20} />,
      activeColor: "text-[#03a9f4]",
      category: "📐 INTERFACE",
      subTools: [
        { id: "UIUXEdit", title: "UI Visual Builder", icon: <LayoutDashboard size={16} /> },
        { id: "UIUXDataBindingEditor", title: "MVVM Data Binding", icon: <Link2 size={16} /> },
        { id: "DataTableJSONEditor", title: "Data Tables", icon: <Table size={16} /> },
        { id: "StateSerializationManager", title: "Save/Load State Serializer", icon: <Save size={16} /> },
        { id: "UXCognitiveLoadSim", title: "UX Sim", icon: <Brain size={16} /> },
        { id: "Blueprint", title: "Blueprints", icon: <Network size={16} /> }
      ]
    },

    // 15. ⚙️ DEVOPS & PUBLISH
    {
      id: "DevOpsHub",
      title: "DevOps & Publishing",
      icon: <Zap size={20} />,
      activeColor: "text-[#f85149]",
      category: "⚙️ DEVOPS",
      subTools: [
        { id: "BuildPublish", title: "Build & Deploy", icon: <Cloud size={16} /> },
        { id: "VersionControlUI", title: "Version Control", icon: <GitCommit size={16} /> },
        { id: "CrashAnalyticsDashboard", title: "Analytics", icon: <Activity size={16} /> },
        { id: "PerformanceDashboard", title: "Performance Telemetry", icon: <Gauge size={16} /> },
        { id: "MultiplayerServerOrchestrator", title: "Server Orchestrator", icon: <Server size={16} /> },
        { id: "AntiCheatSecurityHub", title: "Security Hub", icon: <Shield size={16} /> }
      ]
    }
];

export default function App() {
  const [activeTool, setActiveTool] = React.useState(() => {
    return localStorage.getItem("omni_activeTool") || "OmniCreatorMaster";
  });


  React.useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName || '')) return;

      const key = e.key.toLowerCase();
      
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (key === 'c') {
          e.preventDefault();
          setActiveTool('CodeEditor');
        } else if (key === 'm') {
          e.preventDefault();
          setActiveTool('MapEdit');
        } else if (key === 'u') {
          e.preventDefault();
          setActiveTool('UIUXEditor');
        } else if (key === 'a') {
          e.preventDefault();
          setActiveTool('AudioMixingConsole');
        } else if (key === 'v') {
          e.preventDefault();
          setActiveTool('VisualScriptEditor');
        } else if (key === 't') {
          e.preventDefault();
          setActiveTool('TextureEditor');
        } else if (key === '3') {
          e.preventDefault();
          setActiveTool('ModelingEditor');
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        let toolToSelect = null;
        switch (key) {
          case '1': toolToSelect = 'CodeEditor'; break;
          case '2': toolToSelect = 'ModelingEditor'; break;
          case '3': toolToSelect = 'CinematicSequencerEditor'; break;
          case '4': toolToSelect = 'AudioMixingConsole'; break;
          case '5': toolToSelect = 'UIUXEditor'; break;
          case '6': toolToSelect = 'TextureEditor'; break;
        }
        if (toolToSelect) {
          e.preventDefault();
          setActiveTool(toolToSelect);
        }
      }
    };
    window.addEventListener("keydown", handleGlobalShortcuts);
    return () => window.removeEventListener("keydown", handleGlobalShortcuts);
  }, []);

  React.useEffect(() => {
    localStorage.setItem("omni_activeTool", activeTool);
  }, [activeTool]);

  React.useEffect(() => {
    const handleSwitchTool = (e: any) => {
      if (e.detail && typeof e.detail === "string") {
        setActiveTool(e.detail);
      }
    };
    window.addEventListener("switch-tool", handleSwitchTool);

    const handlePreload = (e: any) => {
      if (e.detail && typeof e.detail === "string") {
        preloadComponent(e.detail);
      }
    };
    window.addEventListener("preload-tool", handlePreload);

    return () => {
      window.removeEventListener("switch-tool", handleSwitchTool);
      window.removeEventListener("preload-tool", handlePreload);
    };
  }, []);

const ID_MAP: Record<string, string> = {
  "Blueprint": "BlueprintEditor",
  "BuildPublish": "BuildPublishEditor",
  "GameSystems": "GameSystemsEditor",
  "GraphicsRender": "GraphicsRenderEditor",
  "ImageEdit": "ImageEditor",
  "Modeling": "ModelingEditor",
  "MonsterEdit": "MonsterEditor",
  "NPCEdit": "NPCEditor",
  "OmniAudioStudio": "OmniAudioDSPStudio",
  "OmniVFXStudio": "UltimateEffectVFXStudio",
  "OmniWorldBuilder": "OmniMegaWorldBuilder",
  "QuickStart": "QuickStartDashboard",
  "Select": "CodeEditor",
  "Sequencer": "CinematicSequencerEditor",
  "SpatialAudioFoley": "SpatialAudioFoleyStudio",
  "WorldLore": "WorldLoreEditor",
  "TextureEdit": "TextureEditor",
  "UIUXEdit": "UIUXEditor",
  "VisualScripting": "VisualScriptEditor"
};

const lazyComponents: Record<string, React.LazyExoticComponent<any>> = {};

const getLazyComponent = (id: string) => {
  const mappedId = ID_MAP[id] || id;
  if (!lazyComponents[mappedId] && componentImports[mappedId]) {
    lazyComponents[mappedId] = React.lazy(componentImports[mappedId]);
  }
  return lazyComponents[mappedId];
};

const renderSubTool = (subToolId: string) => {
  if (subToolId === "OmniCreatorMaster") return null;
  const Component = getLazyComponent(subToolId);
  if (Component) {
    return (
      <ErrorBoundary key={subToolId}>
        <Suspense fallback={
          <div className="w-full h-full flex flex-col items-center justify-center text-[#8b949e] bg-[#0d1117]">
            <div className="w-8 h-8 border-2 border-[#58a6ff] border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-sm font-medium tracking-wide">Loading Module...</div>
          </div>
        }>
          <Component />
        </Suspense>
      </ErrorBoundary>
    );
  }
  return <VisualScriptEditor toolId={subToolId} tools={tools} />;
};

  const renderActiveTool = () => {
    if (activeTool === "OmniCreatorMaster") return null;
    const hub = tools.find(t => t.id === activeTool);
    if (hub && hub.subTools && hub.subTools.length > 0) {
      return <UnifiedHubWorkspace hub={hub} renderSubTool={renderSubTool} />;
    }
    return renderSubTool(activeTool);
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
      {/* Global AI Chat Widget (Offline Copilot) */}
      <AIChatWidget activeTool={activeTool} tools={tools} />
    </div>
  );
}
