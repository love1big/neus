import React, { useState, Suspense } from "react";
import UnifiedHubWorkspace from "./components/UnifiedHubWorkspace";
import { Link2, Activity, Zap, Command, Droplet, Droplets, Paintbrush, Boxes, Camera, Gauge, Flame, Server, Share2, Microchip, TerminalSquare, Network, Crosshair, LayoutDashboard, Brain, Rocket, Bot, Map, GitPullRequest, GitFork, Globe, PersonStanding, Cpu, MonitorPlay, Orbit, Gamepad2, Gamepad, Compass, ShieldCheck, Blocks, FolderTree, Globe2, Users, Ghost, Box, Clapperboard, UserSquare, Waypoints, Database, Palette, Image, Swords, FlaskConical, Bug, Video, Layers, BrainCircuit, Glasses, Terminal, HardDrive, Mic2, GitMerge, Binary, Wrench, SearchCode, SplitSquareHorizontal, AlignLeft, Search, Eye, Cloud, BookOpen, GitBranch, X, Grip, Download, Wifi, Puzzle, CircuitBoard, Sparkles, MessageCircle, Ear, Mountain, Volume2, Code2, Dna, FileText, FileCode, MessageSquare, CloudRain, Scissors, Car, Bone, Smile, Archive, ShoppingBag, GitCommit, Grid, Award, Trophy, DollarSign, Building, Shield, Sun, Lightbulb, Sticker, Route, Bird, PenTool, MapPin, Flag, TrendingUp, Gift, Hammer, Table, DatabaseBackup, Monitor, CheckCircle, Store, Minimize, Music, PlayCircle, AlertTriangle, Sliders, Save, ListTree, Vibrate, Mic, Wand2, Bomb, Film, Home, Calculator, Disc, Languages, Scale, Radio, Trees, History } from 'lucide-react';
import { LanguageCode } from "./contexts/LanguageContext";
import ErrorBoundary from "./components/ErrorBoundary";
import AIChatWidget from "./components/AIChatWidget";
import OmniEngineIDE from "./components/OmniEngineIDE";
import CommandPalette from "./components/CommandPalette";
import NotificationSystem from "./components/NotificationSystem";
const VisualScriptEditor = React.lazy(() => import("./components/VisualScriptEditor"));
import OptimizationHelperTooltip from "./components/OptimizationHelperTooltip";
import PerformanceHUD from "./components/PerformanceHUD";
import StudioRecoveryModal from "./components/StudioRecoveryModal";
import { useGlobalShortcuts } from "./hooks/useGlobalShortcuts";
import { useStudioAutoSave } from "./hooks/useStudioAutoSave";
import { RecentFilesTracker } from "./utils/RecentFilesTracker";
import DetachableWindowPortal from "./components/DetachableWindowPortal";
import DetachedModulePlaceholder from "./components/DetachedModulePlaceholder";
import { omniDetachablePanelManager } from "./utils/OmniDetachablePanelManager";
import { DetachedModuleMetadata } from "./types/detachablePanelTypes";

const TextureEditor = React.lazy(() => import('./components/TextureEditor'));

export const componentImports: Record<string, () => Promise<any>> = {
  OmniForensicLegalVerificationStudio: () => import('./components/OmniForensicLegalVerificationStudio'),
  AssetDependencyGraphStudio: () => import('./components/AssetDependencyGraphStudio'),
  OmniMasterCreatorSuite: () => import('./components/OmniMasterCreatorSuite'),
  OmniGameCreationStudio: () => import('./components/OmniGameCreationStudio'),
  OmniSoftwareIDEStudio: () => import('./components/OmniSoftwareIDEStudio'),
  Omni3D2DVRModelStudio: () => import('./components/Omni3D2DVRModelStudio'),
  OmniWorldMapStudio: () => import('./components/OmniWorldMapStudio'),
  OmniTextureCinematicStudio: () => import('./components/OmniTextureCinematicStudio'),
  OmniMusicVocalDAWStudio: () => import('./components/OmniMusicVocalDAWStudio'),
  GlobalOfflineAITranslationStudio: () => import('./components/GlobalOfflineAITranslationStudio'),
  GlobalPhonetics30Studio: () => import('./components/GlobalPhonetics30Studio'),
  ThaiRoyalSpeechAndSingingStudio: () => import('./components/ThaiRoyalSpeechAndSingingStudio'),
  OmniLocalizationStudio: () => import('./components/OmniLocalizationStudio'),
  OmniPCBDesignStudio: () => import('./components/OmniPCBDesignStudio'),
  AdvancedWorldGenStudio: () => import('./components/AdvancedWorldGenStudio'),
  Procedural3DMeshSynthesisStudio: () => import('./components/Procedural3DMeshSynthesisStudio'),
  AdvancedLocomotionMotionStudio: () => import('./components/AdvancedLocomotionMotionStudio'),
  HighPerformanceNetcodeStudio: () => import('./components/HighPerformanceNetcodeStudio'),
  CinematicCutsceneTextureStudio: () => import('./components/CinematicCutsceneTextureStudio'),
  OfflineAIContinuousErrorLearningStudio: () => import('./components/OfflineAIContinuousErrorLearningStudio'),
  UniversalInFlightWatchdogView: () => import('./components/UniversalInFlightWatchdogView'),
  MultiModalArtifactHealerView: () => import('./components/MultiModalArtifactHealerView'),
  ArchitectureHeatmap: () => import('./components/ArchitectureHeatmap'),
  ModuleDependencyVisualizerStudio: () => import('./components/ModuleDependencyVisualizerStudio'),
  InteractiveDebuggerStudio: () => import('./components/InteractiveDebuggerStudio'),
  AIAssetAutoTagOrganizer: () => import('./components/AIAssetAutoTagOrganizer'),
  BatchAIProcessingDashboard: () => import('./components/BatchAIProcessingDashboard'),
  MegaAudioDSPStudio: () => import('./components/MegaAudioDSPStudio'),
  MegaCutsceneCinematicStudio: () => import('./components/MegaCutsceneCinematicStudio'),
  OmniMegaEngine300Studio: () => import('./components/OmniMegaEngine300Studio'),
  TexturePCBMasterStudio: () => import('./components/TexturePCBMasterStudio'),
  MapMegaToolsExtension: () => import('./components/MapMegaToolsExtension'),
  Mega3DModelStudio: () => import('./components/Mega3DModelStudio'),
  MegaCodeIDEMaster: () => import('./components/MegaCodeIDEMaster'),
  MegaUIUXMasterStudio: () => import('./components/MegaUIUXMasterStudio'),
  DeterministicEngineeringSuite: () => import('./components/DeterministicEngineeringSuite'),
  OfflineAITokenGuardDashboard: () => import('./components/OfflineAITokenGuardDashboard'),
  OfflineAIEngineSuite: () => import('./components/OfflineAIEngineSuite'),
  SystemResourceMonitor: () => import('./components/SystemResourceMonitor'),
  ProjectProgressDashboard: () => import('./components/ProjectProgressDashboard'),
  KeyboardShortcutMapper: () => import('./components/KeyboardShortcutMapper'),
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
  OfflineGameAudioStudio: () => import("./components/OfflineGameAudioStudio"),
  VoiceMusicStudio: () => import("./components/VoiceMusicStudio"),
  GPUComputeCluster: () => import("./components/GPUComputeCluster"),
  HeterogeneousMultiComputeStudio: () => import("./components/HeterogeneousMultiComputeStudio"),
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
  ThaiVoiceDubbingStudio: () => import("./components/ThaiVoiceDubbingStudio"),
  VoiceQualityAssuranceStudio: () => import("./components/VoiceQualityAssuranceStudio"),
  NaturalVocalVoiceStudio: () => import("./components/NaturalVocalVoiceStudio"),
  AIOfflineVocalMusicWorkstation: () => import("./components/AIOfflineVocalMusicWorkstation"),
  VoiceActorAI: () => import("./components/VoiceActorAI"),
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
  RealTimeHouse3DPrintStudio: () => import("./components/RealTimeHouse3DPrintStudio"),
  UXUISimulatorTestbed: () => import("./components/UXUISimulatorTestbed"),
  GameProjectStarterCore: () => import("./components/GameProjectStarterCore"),
  PBRTextureQualityAuditor: () => import("./components/PBRTextureQualityAuditor"),
  ElectronicCircuitPCBStudio: () => import("./components/ElectronicCircuitPCBStudio"),
  RuntimeGraphicsStreamingOptimizer: () => import("./components/RuntimeGraphicsStreamingOptimizer"),
  HardwareResourceOptimizer: () => import("./components/HardwareResourceOptimizer"),
  OfflineAIDataEngineManager: () => import("./components/OfflineAIDataEngineManager"),
  BuildPublishAudit: () => import("./components/BuildPublishAudit"),
  WorldPartitionStreamingStudio: () => import("./components/WorldPartitionStreamingStudio"),
  QuadRetopologyUVStudio: () => import("./components/QuadRetopologyUVStudio"),
  PhysicsClothHairSimulationLab: () => import("./components/PhysicsClothHairSimulationLab"),
  SubsurfaceScatteringSkinShaderStudio: () => import("./components/SubsurfaceScatteringSkinShaderStudio"),
  CombatHitboxFrameDataStudio: () => import("./components/CombatHitboxFrameDataStudio"),
  DynamicInteractiveMusicStateMachine: () => import("./components/DynamicInteractiveMusicStateMachine"),
  GamepadConsoleFocusNavigationStudio: () => import("./components/GamepadConsoleFocusNavigationStudio"),
  AIDiffusionConceptTextureGenerator: () => import("./components/AIDiffusionConceptTextureGenerator"),
  ContinuousIntegrationBuildMatrixStudio: () => import("./components/ContinuousIntegrationBuildMatrixStudio"),
  NetworkReplicationLagCompensationStudio: () => import("./components/NetworkReplicationLagCompensationStudio"),
  LocalizationPolyglotAudioDubbingStudio: () => import("./components/LocalizationPolyglotAudioDubbingStudio"),
  ProceduralDungeonLayoutGenerator: () => import("./components/ProceduralDungeonLayoutGenerator"),
  GPUPipelineShaderCompilerStudio: () => import("./components/GPUPipelineShaderCompilerStudio"),
  HTNUtilityAIBrainStudio: () => import("./components/HTNUtilityAIBrainStudio"),
  VolumetricAtmosphereScatterStudio: () => import("./components/VolumetricAtmosphereScatterStudio"),
  AudioRaytracingAcousticStudio: () => import("./components/AudioRaytracingAcousticStudio"),
  AutomatedPlaytestBotSwarmStudio: () => import("./components/AutomatedPlaytestBotSwarmStudio"),
  DynamicMeshSlicingDestructionStudio: () => import("./components/DynamicMeshSlicingDestructionStudio"),
  EnhancedInputMappingContextStudio: () => import("./components/EnhancedInputMappingContextStudio"),
  MotionMatchingPoseSearchStudio: () => import("./components/MotionMatchingPoseSearchStudio"),
  MetaSoundsModularDSPStudio: () => import("./components/MetaSoundsModularDSPStudio"),
  CinemachineVirtualCameraRigStudio: () => import("./components/CinemachineVirtualCameraRigStudio"),
  ProceduralContentGenerationPCGStudio: () => import("./components/ProceduralContentGenerationPCGStudio"),
  StateTreeHierarchicalDecisionStudio: () => import("./components/StateTreeHierarchicalDecisionStudio"),
  NaniteMicroPolygonVirtualGeometryStudio: () => import("./components/NaniteMicroPolygonVirtualGeometryStudio"),
  MotionWarpingParkourVaultStudio: () => import("./components/MotionWarpingParkourVaultStudio"),
  ChaosFleshMuscleDeformationStudio: () => import("./components/ChaosFleshMuscleDeformationStudio"),
  BurstCompilerSIMDInspectorStudio: () => import("./components/BurstCompilerSIMDInspectorStudio"),
  LumenSurfaceCacheGlobalIlluminationStudio: () => import("./components/LumenSurfaceCacheGlobalIlluminationStudio"),
  ConcurrencyThreadVisualizerStudio: () => import("./components/ConcurrencyThreadVisualizerStudio"),
  NetcodePredictionReconciliationStudio: () => import("./components/NetcodePredictionReconciliationStudio"),
  MassEntityCrowdSimulationStudio: () => import("./components/MassEntityCrowdSimulationStudio"),
  BlenderGeometryNodesProceduralStudio: () => import("./components/BlenderGeometryNodesProceduralStudio"),
  Fusion360GenerativeDesignCADStudio: () => import("./components/Fusion360GenerativeDesignCADStudio"),
  SketchUpPushPullBIMStudio: () => import("./components/SketchUpPushPullBIMStudio"),
  VSHotReloadMemoryLeakProfilerStudio: () => import("./components/VSHotReloadMemoryLeakProfilerStudio"),
  UE5LiveLinkVirtualProductionStudio: () => import("./components/UE5LiveLinkVirtualProductionStudio"),
  BlenderGreasePencilStudio: () => import("./components/BlenderGreasePencilStudio"),
  Fusion360CAMToolpathStudio: () => import("./components/Fusion360CAMToolpathStudio"),
  SketchUpLayOutDocStudio: () => import("./components/SketchUpLayOutDocStudio"),
  VSIntelliTraceTimeTravelDebuggerStudio: () => import("./components/VSIntelliTraceTimeTravelDebuggerStudio"),
  UE5MetaHumanFacialStudio: () => import("./components/UE5MetaHumanFacialStudio"),
  UnityShaderGraphSubGraphStudio: () => import("./components/UnityShaderGraphSubGraphStudio"),
  BlenderEEVEENextStudio: () => import("./components/BlenderEEVEENextStudio"),
  Fusion360FEASimulationStudio: () => import("./components/Fusion360FEASimulationStudio"),
  VSRoslynAnalyzerCodeFixStudio: () => import("./components/VSRoslynAnalyzerCodeFixStudio"),
  UE5GameplayAbilitySystemStudio: () => import("./components/UE5GameplayAbilitySystemStudio"),
  UnityAddressablesMemoryStudio: () => import("./components/UnityAddressablesMemoryStudio"),
  VSTestImpactAnalyzerStudio: () => import("./components/VSTestImpactAnalyzerStudio"),
  UE5StateTreeAIStudio: () => import("./components/UE5StateTreeAIStudio"),
  UnityDOTSArchetypeChunkStudio: () => import("./components/UnityDOTSArchetypeChunkStudio"),
  BlenderMantaflowFluidStudio: () => import("./components/BlenderMantaflowFluidStudio"),
  Fusion360SheetMetalStudio: () => import("./components/Fusion360SheetMetalStudio"),
  SketchUpDynamicComponentsStudio: () => import("./components/SketchUpDynamicComponentsStudio"),
};

export const preloadComponent = (id: string) => { if(componentImports[id]) componentImports[id]().catch(console.error); };



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
const ElectronicCircuitPCBStudio = React.lazy(componentImports.ElectronicCircuitPCBStudio);
const RuntimeGraphicsStreamingOptimizer = React.lazy(componentImports.RuntimeGraphicsStreamingOptimizer);
const HardwareResourceOptimizer = React.lazy(componentImports.HardwareResourceOptimizer);
const OfflineAIDataEngineManager = React.lazy(componentImports.OfflineAIDataEngineManager);
const ModuleDependencyVisualizerStudio = React.lazy(componentImports.ModuleDependencyVisualizerStudio);
const OfflineAIContinuousErrorLearningStudio = React.lazy(componentImports.OfflineAIContinuousErrorLearningStudio);

export const tools = [
    // 1. 🚀 OMNI MASTER CREATOR SUITE (8-IN-1 ECOSYSTEM)
    {
      id: "OmniMasterCreatorSuite",
      title: "🚀 Omni 8-in-1 Creator Suite",
      icon: <Sparkles size={20} />,
      activeColor: "text-amber-400",
      category: "🚀 FLAGSHIP CREATOR SUITE",
      subTools: [
        { id: "OmniMasterCreatorSuite", title: "⭐ Master 8-in-1 Hub", icon: <Sparkles size={16} /> },
        { id: "OmniGameCreationStudio", title: "1. โปรแกรมสร้างเกม เขียนเกม (Game Studio)", icon: <Gamepad2 size={16} /> },
        { id: "OmniSoftwareIDEStudio", title: "2. โปรแกรมสร้างโปรแกรม เขียนโค้ด (IDE Studio)", icon: <Code2 size={16} /> },
        { id: "Omni3D2DVRModelStudio", title: "3. โปรแกรมสร้างโมเดล 3D/2D/VR (Model Studio)", icon: <Box size={16} /> },
        { id: "OmniWorldMapStudio", title: "4. โปรแกรมสร้างแผนที่ 3D/2D/VR (World Map)", icon: <Globe size={16} /> },
        { id: "OmniTextureCinematicStudio", title: "5. เท็กเจอร์ รูปภาพ คัทซีนเกม (Cinematics)", icon: <Film size={16} /> },
        { id: "OmniMusicVocalDAWStudio", title: "6. เสียงดนตรี เสียงพากย์ เพลง (Music DAW)", icon: <Disc size={16} /> },
        { id: "OmniLocalizationStudio", title: "7. โปรแกรมแปลภาษาสำหรับเกม (Localization)", icon: <Languages size={16} /> },
        { id: "GlobalOfflineAITranslationStudio", title: "⭐ สตูดิโอแปลภาษา AI ออฟไลน์ 70+ ภาษา (70+ AI Translation & 8D Audit)", icon: <Globe size={16} /> },
        { id: "OmniPCBDesignStudio", title: "8. โปรแกรมจัดการ PCB มืออาชีพ (PCB CAD)", icon: <CircuitBoard size={16} /> }
      ]
    },

    // 2. 🌟 DASHBOARD & PROJECT MANAGEMENT
    {
      id: "ProjectHub",
      title: "Project & Pipeline Hub",
      icon: <Command size={20} />,
      activeColor: "text-[#f85149]",
      category: "🌟 PROJECT & PIPELINE",
      subTools: [
        { id: "OmniCreatorMaster", title: "Global Omniverse Dashboard", icon: <Command size={16} /> },
        { id: "QuickStart", title: "Project Hub & Quick Start", icon: <Rocket size={16} /> },
        { id: "ProjectManagementSystem", title: "Agile Kanban & Sprint Board", icon: <FolderTree size={16} /> },
        { id: "ProjectProgressDashboard", title: "Dev Progress & Milestones Tracker", icon: <Trophy size={16} /> },
        { id: "LiveOpsManager", title: "LiveOps, Remote Config & A/B Testing", icon: <Globe size={16} /> }
      ]
    },

    // 3. 💻 UNIFIED AI & CODE DEVELOPMENT
    {
      id: "CodeIDEHub",
      title: "AI & Code IDE Studio",
      icon: <Code2 size={20} />,
      activeColor: "text-[#ff7b72]",
      category: "💻 AI & CODE IDE",
      subTools: [
        { id: "OmniSoftwareIDEStudio", title: "Master Multi-File IDE & VM Runner", icon: <Code2 size={16} /> },
        { id: "AICodeAgentStudio", title: "AI Code Copilot & Agent Studio", icon: <Bot size={16} /> },
        { id: "OmniForensicLegalVerificationStudio", title: "⚖️ ระบบตรวจสอบหลักฐานดิจิทัล & ลิขสิทธิ์ OMNI Engine STUDIO (Forensic Legal Hub)", icon: <Scale size={16} /> },
        { id: "OfflineAIContinuousErrorLearningStudio", title: "🛡️ AI Error-Learning & Immunity Studio", icon: <ShieldCheck size={16} /> },
        { id: "UniversalInFlightWatchdogView", title: "⚡ Live In-Flight Watchdog Radar", icon: <Zap size={16} /> },
        { id: "InteractiveDebuggerStudio", title: "⚡ Interactive Step Debugger", icon: <Bug size={16} /> },
        { id: "VisualScripting", title: "Visual Node Blueprint & Logic", icon: <Network size={16} /> },
        { id: "BurstCompilerSIMDInspectorStudio", title: "Burst Compiler & SIMD Vectorization Inspector", icon: <Cpu size={16} /> },
        { id: "ConcurrencyThreadVisualizerStudio", title: "Concurrency & Multi-Core Thread Visualizer", icon: <Layers size={16} /> },
        { id: "VSHotReloadMemoryLeakProfilerStudio", title: "VS Hot Reload & Memory Snapshot Leak Profiler", icon: <Flame size={16} /> },
        { id: "VSIntelliTraceTimeTravelDebuggerStudio", title: "VS IntelliTrace & Time-Travel Historical Debugger", icon: <History size={16} /> },
        { id: "VSRoslynAnalyzerCodeFixStudio", title: "VS Roslyn Diagnostic Analyzer & Quick CodeFix", icon: <Wrench size={16} /> },
        { id: "VSTestImpactAnalyzerStudio", title: "VS Test Impact Analysis (TIA) & Dynamic Code Coverage", icon: <FileCode size={16} /> },
        { id: "UnityDOTSArchetypeChunkStudio", title: "Unity DOTS ECS Archetype Chunk Memory & SIMD", icon: <Boxes size={16} /> },
        { id: "CodeProfilerTracer", title: "Code Profiler & Function Call Tracer", icon: <Activity size={16} /> },
        { id: "ModuleDependencyVisualizerStudio", title: "Module & Node Dependency Tree", icon: <Network size={16} /> }
      ]
    },

    // 4. 🧠 OFFLINE AI INTELLIGENCE & NEURAL HUB
    {
      id: "AIHubMaster",
      title: "Offline AI & Neural Models",
      icon: <BrainCircuit size={20} />,
      activeColor: "text-[#8a2be2]",
      category: "🤖 NEURAL & MACHINE LEARNING",
      subTools: [
        { id: "OfflineAITokenGuardDashboard", title: "🛡️ ⚡ 100% Offline AI & Token Conservation Shield", icon: <ShieldCheck size={16} /> },
        { id: "GlobalOfflineAITranslationStudio", title: "🌟 🌐 AI แปลภาษาออฟไลน์ 70++ ภาษาทั่วโลก", icon: <Languages size={16} /> },
        { id: "HTNUtilityAIBrainStudio", title: "Hierarchical Task Network (HTN) & Utility AI Studio", icon: <Brain size={16} /> },
        { id: "StateTreeHierarchicalDecisionStudio", title: "StateTree Hierarchical Decision & Logic Graph Studio", icon: <GitBranch size={16} /> },
        { id: "HeterogeneousMultiComputeStudio", title: "⚡ 🖥️ คลัสเตอร์ CPU/GPU/NPU หลากยี่ห้อ (Multi-Vendor Grid)", icon: <Microchip size={16} /> },
        { id: "OmniMegaEngine300Studio", title: "⚡ 335+ Mega Engine & AI Suite", icon: <Cpu size={16} /> },
        { id: "OfflineAIEngineSuite", title: "50x Offline AI Model Farm", icon: <Brain size={16} /> },
        { id: "OfflineAIDataEngineManager", title: "High-Speed Offline Vector Engine", icon: <Zap size={16} /> },
        { id: "AIOfflineDownloader", title: "Local Model & Weights Downloader", icon: <Download size={16} /> },
        { id: "AICodeQualityAuditor", title: "Code Standards & Security Auditor", icon: <ShieldCheck size={16} /> },
        { id: "AIDiffusionConceptTextureGenerator", title: "AI Concept Art & Seamless Texture Studio", icon: <Wand2 size={16} /> }
      ]
    },

    // 5. 🌍 WORLD, MAP & LEVEL ARCHITECTURE
    {
      id: "WorldHub",
      title: "World & Level Studio",
      icon: <Globe size={20} />,
      activeColor: "text-[#58a6ff]",
      category: "🌍 LEVEL & ENVIRONMENT",
      subTools: [
        { id: "AdvancedWorldGenStudio", title: "🌟 AAA Procedural World & Map Studio", icon: <Globe size={16} /> },
        { id: "VolumetricAtmosphereScatterStudio", title: "Volumetric Fog & Rayleigh/Mie Atmosphere Studio", icon: <Sun size={16} /> },
        { id: "WorldPartitionStreamingStudio", title: "Open-World Partition & HLOD Streaming Studio", icon: <Layers size={16} /> },
        { id: "ProceduralDungeonLayoutGenerator", title: "Procedural Dungeon & BSP Maze Generator", icon: <Compass size={16} /> },
        { id: "OmniWorldMapStudio", title: "Fractal Biome & 3D/2D World Map", icon: <Globe size={16} /> },
        { id: "OmniWorldBuilder", title: "MegaWorld Landscape & Foliage", icon: <Mountain size={16} /> },
        { id: "MapEdit", title: "Tilemap & Level Editor", icon: <Map size={16} /> },
        { id: "AdvancedPCGEngine", title: "Procedural Cities, Terrain & Dungeons", icon: <Building size={16} /> },
        { id: "ProceduralContentGenerationPCGStudio", title: "Procedural Content Generation (PCG) & Spline Studio", icon: <Trees size={16} /> },
        { id: "NaniteMicroPolygonVirtualGeometryStudio", title: "Nanite Micro-Polygon Virtual Geometry Studio", icon: <Box size={16} /> },
        { id: "LumenSurfaceCacheGlobalIlluminationStudio", title: "Lumen Surface Cache & Global Illumination Studio", icon: <Sun size={16} /> },
        { id: "WeatherAtmosphereEditor", title: "Dynamic Weather & Volumetric Sky", icon: <CloudRain size={16} /> },
        { id: "NavMeshBakingStudio", title: "NavMesh Baker & A* Path Debugger", icon: <Route size={16} /> }
      ]
    },

    // 6. 🎨 3D MODELING, SCULPTING & HARDWARE CAD
    {
      id: "ArtStudioHub",
      title: "3D Modeling & Hardware CAD",
      icon: <Box size={20} />,
      activeColor: "text-[#e3b341]",
      category: "🎨 3D & HARDWARE DESIGN",
      subTools: [
        { id: "AssetDependencyGraphStudio", title: "🕸️ Asset Dependency Graph (Force Topology)", icon: <Network size={16} /> },
        { id: "BlenderGeometryNodesProceduralStudio", title: "Blender Geometry Nodes & Procedural Studio", icon: <Boxes size={16} /> },
        { id: "Fusion360GenerativeDesignCADStudio", title: "Fusion 360 Parametric CAD & Generative Design", icon: <Compass size={16} /> },
        { id: "Fusion360CAMToolpathStudio", title: "Fusion 360 CAM & Multi-Axis CNC Toolpath", icon: <Wrench size={16} /> },
        { id: "Fusion360FEASimulationStudio", title: "Fusion 360 Non-Linear FEA Stress & Thermal Simulation", icon: <Activity size={16} /> },
        { id: "Fusion360SheetMetalStudio", title: "Fusion 360 Sheet Metal Flange Bending & Flat Pattern", icon: <Compass size={16} /> },
        { id: "SketchUpPushPullBIMStudio", title: "SketchUp Push/Pull & BIM Architectural Studio", icon: <Home size={16} /> },
        { id: "SketchUpLayOutDocStudio", title: "SketchUp LayOut Construction Docs & Scaled Sheets", icon: <FileText size={16} /> },
        { id: "SketchUpDynamicComponentsStudio", title: "SketchUp Dynamic Components & Formula Math", icon: <Sliders size={16} /> },
        { id: "Procedural3DMeshSynthesisStudio", title: "🌟 AAA Procedural 3D Mesh Synthesis Studio", icon: <Box size={16} /> },
        { id: "QuadRetopologyUVStudio", title: "Automated Quad Retopology & UV Unwrap Studio", icon: <Grid size={16} /> },
        { id: "Omni3D2DVRModelStudio", title: "3D/2D/VR Parametric Mesh Studio", icon: <Box size={16} /> },
        { id: "ZBrushStyleSculptingStudio", title: "Multi-Res Sculpting Studio", icon: <Palette size={16} /> },
        { id: "RealTimeHouse3DPrintStudio", title: "3D Architectural CAD & Slicer", icon: <Home size={16} /> },
        { id: "OmniPCBDesignStudio", title: "Professional Multi-Layer PCB CAD", icon: <CircuitBoard size={16} /> },
        { id: "PhotogrammetryMeshBuilder", title: "3D Photogrammetry Scanner", icon: <Camera size={16} /> },
        { id: "DestructibleMeshEditor", title: "Mesh Destruction & Voronoi Fracture", icon: <Scissors size={16} /> },
        { id: "ModelOptimizer", title: "LOD Generator & Mesh Optimizer", icon: <Minimize size={16} /> }
      ]
    },

    // 7. 🖌️ TEXTURES, SHADERS & PBR MATERIALS
    {
      id: "TextureHub",
      title: "Textures, Shaders & PBR",
      icon: <Palette size={20} />,
      activeColor: "text-[#ff9800]",
      category: "🎨 TEXTURES & SHADERS",
      subTools: [
        { id: "CinematicCutsceneTextureStudio", title: "🌟 AAA Procedural Texture & PBR Baker", icon: <Layers size={16} /> },
        { id: "GPUPipelineShaderCompilerStudio", title: "GPU Pipeline State Object (PSO) & Shader Compiler", icon: <Cpu size={16} /> },
        { id: "SubsurfaceScatteringSkinShaderStudio", title: "Subsurface Scattering (SSS) & Skin Shader Studio", icon: <Palette size={16} /> },
        { id: "OmniTextureCinematicStudio", title: "4-Channel PBR Texture Synthesis", icon: <Layers size={16} /> },
        { id: "BatchAIProcessingDashboard", title: "🤖 Multi-Agent Batch AI PBR Synthesis", icon: <Cpu size={16} /> },
        { id: "VisualShaderGraphEditor", title: "Visual Node Shader Graph", icon: <Network size={16} /> },
        { id: "UnityShaderGraphSubGraphStudio", title: "Unity Shader Graph & Sub-Graph Node Studio", icon: <Network size={16} /> },
        { id: "MaterialInstanceEditor", title: "Dynamic Material Instances", icon: <Layers size={16} /> },
        { id: "PBRTextureQualityAuditor", title: "PBR & Normal Map Quality Auditor", icon: <ShieldCheck size={16} /> },
        { id: "ImageEdit", title: "2D Texture Painter & Layers", icon: <Palette size={16} /> },
        { id: "DecalProjectorManager", title: "Surface Decals & Stickers Projector", icon: <Sticker size={16} /> }
      ]
    },

    // 8. 🎬 ANIMATION & CINEMATIC SEQUENCING
    {
      id: "AnimationHub",
      title: "Cinematics & Animation",
      icon: <Clapperboard size={20} />,
      activeColor: "text-[#bc8cff]",
      category: "🎬 ANIMATION & CINEMATICS",
      subTools: [
        { id: "AdvancedLocomotionMotionStudio", title: "🌟 AAA Locomotion & Kinematics Studio", icon: <PersonStanding size={16} /> },
        { id: "MotionMatchingPoseSearchStudio", title: "Motion Matching & Pose Search Database Studio", icon: <PersonStanding size={16} /> },
        { id: "MotionWarpingParkourVaultStudio", title: "Motion Warping & Dynamic Parkour Vault Studio", icon: <PersonStanding size={16} /> },
        { id: "CinemachineVirtualCameraRigStudio", title: "Cinemachine Virtual Camera & Cine Camera Studio", icon: <Video size={16} /> },
        { id: "CinematicCutsceneTextureStudio", title: "🌟 AAA Cinematic Cutscene Sequencer", icon: <Clapperboard size={16} /> },
        { id: "Sequencer", title: "Cinematic Timeline Sequencer", icon: <Clapperboard size={16} /> },
        { id: "OmniAnimationStudio", title: "MoCap, IK Rigging & Skeleton Retargeting", icon: <PersonStanding size={16} /> },
        { id: "FacialAnimationMocap", title: "Facial Blendshapes & Lip-Sync", icon: <Smile size={16} /> },
        { id: "UE5MetaHumanFacialStudio", title: "UE5 MetaHuman Facial Rigging & Performance Capture", icon: <Smile size={16} /> },
        { id: "SpriteAnimationEditor", title: "2D Pixel & Sprite Sheet Animator", icon: <Image size={16} /> },
        { id: "BlenderGreasePencilStudio", title: "Blender Grease Pencil 3.0 & 2D/3D Hybrid Studio", icon: <Paintbrush size={16} /> },
        { id: "VirtualProductionStudio", title: "Virtual Camera & Multi-Cam Rig", icon: <Video size={16} /> },
        { id: "UE5LiveLinkVirtualProductionStudio", title: "UE5 LiveLink & nDisplay Virtual Production", icon: <Video size={16} /> }
      ]
    },

    // 9. 🎵 ULTRA-NATURAL AUDIO, DAW & DUBBING
    {
      id: "AudioHub",
      title: "Audio, DAW & Voice Studio",
      icon: <Mic2 size={20} />,
      activeColor: "text-[#e3b341]",
      category: "🎵 SOUND & VOICE STUDIO",
      subTools: [
        { id: "GlobalOfflineAITranslationStudio", title: "🌟 🌐 AI แปลภาษาออฟไลน์ 70++ ภาษาทั่วโลก", icon: <Languages size={16} /> },
        { id: "GlobalPhonetics30Studio", title: "🌟 🌐 สัทศาสตร์ 30++ ภาษา & สตรีมมิ่ง AI ออฟไลน์", icon: <Globe size={16} /> },
        { id: "ThaiRoyalSpeechAndSingingStudio", title: "🌟 🇹🇭 ระบบอ่านออกเสียง & ร้องเพลงราชบัณฑิตยสถาน", icon: <Mic2 size={16} /> },
        { id: "MetaSoundsModularDSPStudio", title: "MetaSounds & Modular DSP Node Graph Studio", icon: <Radio size={16} /> },
        { id: "AudioRaytracingAcousticStudio", title: "Geometric Audio Raytracing & Acoustic Reverb Studio", icon: <Ear size={16} /> },
        { id: "DynamicInteractiveMusicStateMachine", title: "Dynamic Interactive Music State Machine", icon: <Disc size={16} /> },
        { id: "OmniMusicVocalDAWStudio", title: "16-Step Polyphonic DAW & SFX Lab", icon: <Disc size={16} /> },
        { id: "ThaiVoiceDubbingStudio", title: "🇹🇭 Thai Phonetics & Neural Dubbing", icon: <Mic size={16} /> },
        { id: "NaturalVocalVoiceStudio", title: "Ultra-Natural Vocal & Singing Synthesis", icon: <Mic2 size={16} /> },
        { id: "VoiceActorAI", title: "Character Emotion & Dialogue Dubbing", icon: <Wand2 size={16} /> },
        { id: "OmniAudioStudio", title: "Professional DSP, 8-Band EQ & Mastering", icon: <Sliders size={16} /> },
        { id: "SpatialAudioFoley", title: "3D Binaural Spatial Audio & Foley Studio", icon: <Ear size={16} /> },
        { id: "VoiceQualityAssuranceStudio", title: "Voice QC/QA & Acoustic Validator", icon: <ShieldCheck size={16} /> }
      ]
    },

    // 10. 🎮 GAME SYSTEMS, CHARACTERS & QUESTS
    {
      id: "GameDesignHub",
      title: "Game Systems & Narrative",
      icon: <Gamepad2 size={20} />,
      activeColor: "text-[#58a6ff]",
      category: "🎮 GAME SYSTEMS & STORY",
      subTools: [
        { id: "OmniGameCreationStudio", title: "Core ECS Engine & Gameplay Sandbox", icon: <Gamepad2 size={16} /> },
        { id: "MassEntityCrowdSimulationStudio", title: "Mass Entity ECS & Crowd Processor Studio", icon: <Users size={16} /> },
        { id: "EnhancedInputMappingContextStudio", title: "Enhanced Input System & Mapping Context (IMC) Studio", icon: <Gamepad2 size={16} /> },
        { id: "CombatHitboxFrameDataStudio", title: "Combat Hitbox & 60 FPS Frame Data Studio", icon: <Swords size={16} /> },
        { id: "UE5GameplayAbilitySystemStudio", title: "UE5 Gameplay Ability System (GAS) & Attribute Sets", icon: <Zap size={16} /> },
        { id: "UE5StateTreeAIStudio", title: "UE5 StateTree AI & Hierarchical State Machine (HSM)", icon: <GitFork size={16} /> },
        { id: "GameSystems", title: "Gameplay Ability System (GAS) & Stats", icon: <Blocks size={16} /> },
        { id: "EconomicBalancer", title: "Economy, Loot Tables & Crafting", icon: <Database size={16} /> },
        { id: "NPCEdit", title: "NPCs, MetaHuman & AI Behavior Trees", icon: <Users size={16} /> },
        { id: "MonsterEdit", title: "Monster & Boss AI Stat Configurator", icon: <Ghost size={16} /> },
        { id: "WorldLore", title: "World Lore, Quests & Dialogue Graphs", icon: <BookOpen size={16} /> },
        { id: "LocalizationPolyglotAudioDubbingStudio", title: "Global Localization & Voice Dubbing Matrix", icon: <Globe2 size={16} /> },
        { id: "OmniLocalizationStudio", title: "Multilingual Game Translation & i18n", icon: <Languages size={16} /> },
        { id: "GlobalOfflineAITranslationStudio", title: "Global 70+ Offline AI Translation & Phonetics", icon: <Globe size={16} /> }
      ]
    },

    // 11. ⚛️ PHYSICS, SIMULATION & RENDERING
    {
      id: "PhysicsHub",
      title: "Physics, VFX & Rendering",
      icon: <Flame size={20} />,
      activeColor: "text-[#ff5722]",
      category: "⚛️ SIMULATION & RENDERING",
      subTools: [
        { id: "DeterministicEngineeringSuite", title: "Deterministic Physics & Math Engine", icon: <Calculator size={16} /> },
        { id: "DynamicMeshSlicingDestructionStudio", title: "Real-Time Mesh Slicing & Cap Destruction Studio", icon: <Scissors size={16} /> },
        { id: "PhysicsClothHairSimulationLab", title: "Verlet/XPBD Cloth & Hair Simulation Lab", icon: <Flame size={16} /> },
        { id: "ChaosPhysicsFluidEngine", title: "Chaos Destruction & Fluid Dynamics", icon: <Flame size={16} /> },
        { id: "OmniVFXStudio", title: "Ultimate GPU Particle Designer & VFX", icon: <Wand2 size={16} /> },
        { id: "VehicleDynamicsTuner", title: "Vehicle Suspension & Aerodynamics", icon: <Car size={16} /> },
        { id: "ActiveRagdollEuphoriaEngine", title: "Euphoria Active Ragdoll & Muscles", icon: <Activity size={16} /> },
        { id: "ChaosFleshMuscleDeformationStudio", title: "Chaos Flesh Muscle & Soft-Body Deformation Studio", icon: <Flame size={16} /> },
        { id: "CinematicLightingEditor", title: "Cinematic Lighting, GI & Raytracing", icon: <Sun size={16} /> },
        { id: "BlenderEEVEENextStudio", title: "Blender EEVEE-Next Real-Time Raytracing & GI", icon: <Sun size={16} /> },
        { id: "BlenderMantaflowFluidStudio", title: "Blender Mantaflow Navier-Stokes Fluid & FLIP Particles", icon: <Droplets size={16} /> },
        { id: "RuntimeGraphicsStreamingOptimizer", title: "4K Texture & Mesh Streaming Optimizer", icon: <Zap size={16} /> },
        { id: "RenderFarmManager", title: "Distributed Render Farm Manager", icon: <Server size={16} /> }
      ]
    },

    // 12. 📐 UI/UX DESIGN & DEVOPS PUBLISHING
    {
      id: "DevOpsHub",
      title: "UI/UX & DevOps Operations",
      icon: <LayoutDashboard size={20} />,
      activeColor: "text-[#03a9f4]",
      category: "⚙️ INTERFACE & DEVOPS",
      subTools: [
        { id: "MegaUIUXMasterStudio", title: "UI/UX Component Design System", icon: <LayoutDashboard size={16} /> },
        { id: "GamepadConsoleFocusNavigationStudio", title: "Gamepad & Console Spatial Focus Navigation", icon: <Gamepad size={16} /> },
        { id: "UIUXEdit", title: "Visual UI Layout & Canvas Builder", icon: <LayoutDashboard size={16} /> },
        { id: "UXUISimulatorTestbed", title: "Multi-Device Simulator & Safe Zones", icon: <Monitor size={16} /> },
        { id: "DataTableJSONEditor", title: "Game Data Tables & Serialization", icon: <Table size={16} /> },
        { id: "StateSerializationManager", title: "Save/Load Binary & JSON Serializer", icon: <Save size={16} /> },
        { id: "ContinuousIntegrationBuildMatrixStudio", title: "Continuous Integration Multi-Platform Build Matrix", icon: <Cpu size={16} /> },
        { id: "UnityAddressablesMemoryStudio", title: "Unity Addressables Asset & Memory Profiler", icon: <Layers size={16} /> },
        { id: "AutomatedPlaytestBotSwarmStudio", title: "Automated Multi-Agent Playtest Bot Swarm Matrix", icon: <Users size={16} /> },
        { id: "BuildPublishAudit", title: "Pre-Flight Build Safety Audit", icon: <ShieldCheck size={16} /> },
        { id: "BuildPublish", title: "Cross-Platform Build & Deploy Targets", icon: <Cloud size={16} /> },
        { id: "VersionControlUI", title: "Git Branching & Version Control", icon: <GitCommit size={16} /> },
        { id: "PerformanceDashboard", title: "System Resource Telemetry & Profiler", icon: <Gauge size={16} /> },
        { id: "NetworkReplicationLagCompensationStudio", title: "Multiplayer Replication & Lag Compensation Lab", icon: <Wifi size={16} /> },
        { id: "HighPerformanceNetcodeStudio", title: "🌟 AAA High-Performance Netcode & Prediction Studio", icon: <Wifi size={16} /> },
        { id: "NetcodePredictionReconciliationStudio", title: "Netcode Client Prediction & Reconciliation Studio", icon: <Radio size={16} /> },
        { id: "MultiplayerServerOrchestrator", title: "Dedicated Server Orchestrator", icon: <Server size={16} /> },
        { id: "AntiCheatSecurityHub", title: "Anti-Cheat & Memory Integrity Shield", icon: <Shield size={16} /> },
        { id: "PluginMarketplace", title: "🔌 Community Plugin Marketplace & Extensions", icon: <Puzzle size={16} /> }
      ]
    }
];

export default function App() {
  const [activeTool, setActiveTool] = React.useState(() => {
    return localStorage.getItem("omni_activeTool") || "OmniCreatorMaster";
  });
  const [detachedList, setDetachedList] = React.useState<DetachedModuleMetadata[]>(() =>
    omniDetachablePanelManager.getAllDetached()
  );

  React.useEffect(() => {
    return omniDetachablePanelManager.subscribe((list) => {
      setDetachedList(list);
    });
  }, []);

  // Global Studio Auto-Save & Recovery Hook
  const autoSave = useStudioAutoSave(activeTool);

  useGlobalShortcuts(setActiveTool);

  React.useEffect(() => {
    localStorage.setItem("omni_activeTool", activeTool);

    // Track active tool in Recent Files
    let toolTitle = activeTool;
    let toolCategory = "🌟 CORE";
    let toolHubId = undefined;

    // Search in tools hierarchy
    const directTool = tools.find(t => t.id === activeTool);
    if (directTool) {
      toolTitle = directTool.title;
      toolCategory = directTool.category || "🌟 CORE";
    } else {
      // Check in subtools
      for (const hub of tools) {
        const foundSub = hub.subTools?.find((st: any) => st.id === activeTool);
        if (foundSub) {
          toolTitle = foundSub.title;
          toolCategory = hub.category || hub.title || "🌟 CORE";
          toolHubId = hub.id;
          break;
        }
      }
    }

    RecentFilesTracker.trackOpenedItem({
      id: activeTool,
      name: toolTitle,
      type: 'component',
      category: toolCategory,
      hubId: toolHubId,
      path: `/src/components/${activeTool}.tsx`,
      description: `${toolCategory} • ${toolTitle}`
    });
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
  const Component: any = getLazyComponent(subToolId);
  if (Component) {
    return (
      <ErrorBoundary key={subToolId}>
        <Suspense fallback={
          <div className="w-full h-full flex flex-col items-center justify-center text-[#8b949e] bg-[#0d1117]">
            <div className="w-8 h-8 border-2 border-[#58a6ff] border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-sm font-medium tracking-wide">Loading Module...</div>
          </div>
        }>
          <Component onSelectTool={setActiveTool} />
        </Suspense>
      </ErrorBoundary>
    );
  }
  return (
    <Suspense fallback={
      <div className="w-full h-full flex flex-col items-center justify-center text-[#8b949e] bg-[#0d1117]">
        <div className="w-8 h-8 border-2 border-[#58a6ff] border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-sm font-medium tracking-wide">Loading Visual Script Editor...</div>
      </div>
    }>
      <VisualScriptEditor toolId={subToolId} tools={tools} />
    </Suspense>
  );
};

  const renderActiveTool = () => {
    const hub = tools.find(t => t.id === activeTool);
    if (hub && hub.subTools && hub.subTools.length > 0) {
      return <UnifiedHubWorkspace hub={hub} renderSubTool={renderSubTool} />;
    }
    if (omniDetachablePanelManager.isDetached(activeTool)) {
      const activeObj = tools.find(t => t.id === activeTool);
      return (
        <DetachedModulePlaceholder
          moduleId={activeTool}
          title={activeObj?.title || activeTool}
          onReattach={() => omniDetachablePanelManager.reattachModule(activeTool)}
        />
      );
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
      
      {/* Global Notification Manager */}
      <NotificationSystem />

      {/* Global AI Chat Widget (Offline Copilot) */}
      <AIChatWidget activeTool={activeTool} tools={tools} />

      {/* Context-Sensitive Optimization Encyclopedia Tooltip Helper */}
      <OptimizationHelperTooltip
        activeTool={activeTool}
        tools={tools}
        onSelectTool={setActiveTool}
      />

      {/* Persistent Engine Performance HUD Overlay (CPU, GPU, RAM, Thermals, Sparklines) */}
      <PerformanceHUD
        onOpenFullMonitor={() => setActiveTool('SystemResourceMonitor')}
        onSelectTool={setActiveTool}
      />

      {/* Emergency Crash & Session Recovery Modal */}
      <StudioRecoveryModal
        isOpen={autoSave.hasCrashRecovery}
        crashInfo={autoSave.crashInfo}
        onRestore={() => {
          if (autoSave.crashInfo?.lastState?.activeTool) {
            setActiveTool(autoSave.crashInfo.lastState.activeTool);
          }
          autoSave.dismissCrashRecovery();
        }}
        onDismiss={autoSave.dismissCrashRecovery}
      />

      {/* Multi-Monitor Detached Windows Portals (Rendered into external windows via React Portal) */}
      {detachedList.map((panel) => (
        <DetachableWindowPortal
          key={panel.id}
          moduleId={panel.id}
          title={panel.title}
          onClose={() => omniDetachablePanelManager.reattachModule(panel.id)}
        >
          {renderSubTool(panel.id)}
        </DetachableWindowPortal>
      ))}
    </div>
  );
}
