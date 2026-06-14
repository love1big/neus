import React, { useState } from 'react';
import { Command, Droplet, Paintbrush, Boxes, Camera, Gauge, Flame, Server, Share2, Microchip, TerminalSquare, Network, Crosshair, LayoutDashboard, Brain, Rocket, Bot, Map, GitPullRequest, Globe, AudioWaveform, PersonStanding, Cpu, MonitorPlay, Orbit, Gamepad2, ShieldCheck, Blocks, FolderTree, Globe2, Users, Ghost, Box, Clapperboard, UserSquare, Waypoints, Database, Palette, Image, Swords, FlaskConical, Bug, Video, Activity, Layers, BrainCircuit, Glasses, Terminal, MemoryStick, Mic2, GitMerge, Binary, Wrench, SearchCode, SplitSquareHorizontal, AlignLeft, Search, Eye, Cloud, BookOpen, GitBranch } from 'lucide-react';
import ArchitectureDevOpsEditor from './components/ArchitectureDevOpsEditor';
import AssetStore from './components/AssetStore';
import BasicSkeletonModel from './components/BasicSkeletonModel';
import BlueprintEditor from './components/BlueprintEditor';
import BuildPublishEditor from './components/BuildPublishEditor';
import ChronoDebugger from './components/ChronoDebugger';
import CinematicDirector from './components/CinematicDirector';
import CinematicLightingEditor from './components/CinematicLightingEditor';
import CinematicSequencerEditor from './components/CinematicSequencerEditor';
import CodeEditor from './components/CodeEditor';
import CodeProfilerTracer from './components/CodeProfilerTracer';
import ContentBrowser from './components/ContentBrowser';
import CutsceneEditor from './components/CutsceneEditor';
import DataTableEditor from './components/DataTableEditor';
import DeviceDriverConfigPanel from './components/DeviceDriverConfigPanel';
import EconomicBalancer from './components/EconomicBalancer';
import EngineCoreEditor from './components/EngineCoreEditor';
import FigmaStyleCanvas from './components/FigmaStyleCanvas';
import GameEconomyBalancer from './components/GameEconomyBalancer';
import GameEngineProfiler from './components/GameEngineProfiler';
import GamePreview from './components/GamePreview';
import GameSystemsEditor from './components/GameSystemsEditor';
import GitPanel from './components/GitPanel';
import GlobalSearchPanel from './components/GlobalSearchPanel';
import GlobalUniversalDetailsPanel from './components/GlobalUniversalDetailsPanel';
import GraphicsRenderEditor from './components/GraphicsRenderEditor';
import HardwareProfilerOverlay from './components/HardwareProfilerOverlay';
import HoudiniStyleProceduralNode from './components/HoudiniStyleProceduralNode';
import IDECompilerCore from './components/IDECompilerCore';
import ImageEditor from './components/ImageEditor';
import LiveOpsDashboard from './components/LiveOpsDashboard';
import LiveOpsEventScheduler from './components/LiveOpsEventScheduler';
import LogViewer from './components/LogViewer';
import MLAgentsEditor from './components/MLAgentsEditor';
import MapEdit from './components/MapEdit';
import ManualSequenceRecorder from './components/ManualSequenceRecorder';
import MaterialEditor from './components/MaterialEditor';
import MetaHumanEditor from './components/MetaHumanEditor';
import ModdingWorkshopPublisher from './components/ModdingWorkshopPublisher';
import ModelingEditor from './components/ModelingEditor';
import NPCEditor from './components/NPCEditor';
import NavMeshRouter from './components/NavMeshRouter';
import NetcodeEditor from './components/NetcodeEditor';
import NetworkReplicationSim from './components/NetworkReplicationSim';
import NetworkSim from './components/NetworkSim';
import NodeGraphMockup from './components/NodeGraphMockup';
import Offline3DModeler from './components/Offline3DModeler';
import OmniAIAssistantStudio from './components/OmniAIAssistantStudio';
import OmniAnimationStudio from './components/OmniAnimationStudio';
import OmniAudioDSPStudio from './components/OmniAudioDSPStudio';
import OmniBackendNetworkingStudio from './components/OmniBackendNetworkingStudio';
import OmniCreatorMaster from './components/OmniCreatorMaster';
import OmniEngineIDE from './components/OmniEngineIDE';
import OmniMegaWorldBuilder from './components/OmniMegaWorldBuilder';
import OmniNarrativeQuestStudio from './components/OmniNarrativeQuestStudio';
import OmniVFXCompositorStudio from './components/OmniVFXCompositorStudio';
import OmniVFXParticleStudio from './components/OmniVFXParticleStudio';
import OmniVisualScriptingEngine from './components/OmniVisualScriptingEngine';
import OptimizationEncyclopedia from './components/OptimizationEncyclopedia';
import OptimizationOverview from './components/OptimizationOverview';
import PerformanceProfiler from './components/PerformanceProfiler';
import Photogrammetry3DScanner from './components/Photogrammetry3DScanner';
import PhotogrammetryMeshBuilder from './components/PhotogrammetryMeshBuilder';
import PipelineEditor from './components/PipelineEditor';
import PopOutPanel from './components/PopOutPanel';
import ProceduralAssetStudio from './components/ProceduralAssetStudio';
import ProjectSettingsEditor from './components/ProjectSettingsEditor';
import QuickStartDashboard from './components/QuickStartDashboard';
import RenderFarmManager from './components/RenderFarmManager';
import ResourceUsageTab from './components/ResourceUsageTab';
import ScriptEditor from './components/ScriptEditor';
import SettingsModal from './components/SettingsModal';
import SkillForgeEditor from './components/SkillForgeEditor';
import SubstanceStyleTexturePainter from './components/SubstanceStyleTexturePainter';
import TaskPanel from './components/TaskPanel';
import TerrainGenerator from './components/TerrainGenerator';
import ThaiPhoneticsEngine from './components/ThaiPhoneticsEngine';
import TopologyUVPro from './components/TopologyUVPro';
import UIUXEditor from './components/UIUXEditor';
import UXCognitiveLoadSim from './components/UXCognitiveLoadSim';
import VRXREngineEditor from './components/VRXREngineEditor';
import VehicleDynamicsEditor from './components/VehicleDynamicsEditor';
import VehicleDynamicsTuner from './components/VehicleDynamicsTuner';
import Viewport3D from './components/Viewport3D';
import WorldLoreEditor from './components/WorldLoreEditor';
import ZBrushStyleSculptingStudio from './components/ZBrushStyleSculptingStudio';
import CommandPalette from './components/CommandPalette';
import GenericToolPanel from './components/GenericToolPanel';


import AIChat from './components/AIChat';
import { MessageCircle } from 'lucide-react';

export default function App() {
  const [activeTool, setActiveTool] = useState('OmniCreatorMaster');
  const [showGlobalChat, setShowGlobalChat] = useState(false);
  const [globalCode, setGlobalCode] = useState('');
  const [globalLanguage, setGlobalLanguage] = useState('cpp');

  const tools = [
    { id: 'OmniCreatorMaster', title: '100% Omni Creator Master Dashboard', icon: <Command size={20} />, activeColor: 'text-[#f85149]', category: '🌟 ASCENSION STUDIO' },
    { id: 'ZBrushStyleSculptingStudio', title: 'Digital HD Sculpting', icon: <Droplet size={20} />, activeColor: 'text-[#e3b341]', category: '🎨 ART & ASSETS' },
    { id: 'SubstanceStyleTexturePainter', title: 'Procedural Texture Canvas', icon: <Paintbrush size={20} />, activeColor: 'text-[#bc8cff]', category: '🎨 ART & ASSETS' },
    { id: 'HoudiniStyleProceduralNode', title: 'VEX Procedural Geo Node', icon: <Boxes size={20} />, activeColor: 'text-[#58a6ff]', category: '🎨 ART & ASSETS' },
    { id: 'PhotogrammetryMeshBuilder', title: '3D Photogrammetry Scanner', icon: <Camera size={20} />, activeColor: 'text-[#f85149]', category: '🎨 ART & ASSETS' },
    { id: 'VehicleDynamicsTuner', title: 'Vehicle Dynamics & Physics', icon: <Gauge size={20} />, activeColor: 'text-[#58a6ff]', category: '🌍 WORLD BUILDING' },
    { id: 'CinematicLightingEditor', title: 'Atmosphere & Volumetric Lighting', icon: <Flame size={20} />, activeColor: 'text-[#e3b341]', category: '🎬 CINEMATICS' },
    { id: 'RenderFarmManager', title: 'Distributed Render Farm', icon: <Server size={20} />, activeColor: 'text-[#58a6ff]', category: '⚙️ DEVOPS' },
    { id: 'ModdingWorkshopPublisher', title: 'Modding Workshop Publisher', icon: <Share2 size={20} />, activeColor: 'text-[#bc8cff]', category: '⚙️ DEVOPS' },
    { id: 'CodeProfilerTracer', title: 'C++/C# System Deep Profiler', icon: <Microchip size={20} />, activeColor: 'text-[#58a6ff]', category: '🤖 IDE & CODE' },
    { id: 'IDECompilerCore', title: 'Native Manual IDE & Compiler', icon: <TerminalSquare size={20} />, activeColor: 'text-[#3fb950]', category: '🤖 IDE & CODE' },
    { id: 'NavMeshRouter', title: 'Manual NavMesh Pathfinder', icon: <Network size={20} />, activeColor: 'text-[#bc8cff]', category: '🌍 WORLD BUILDING' },
    { id: 'TopologyUVPro', title: 'Manual Retopology & UV Unwrap Pro', icon: <Crosshair size={20} />, activeColor: 'text-[#bc8cff]', category: '🎨 ART & ASSETS' },
    { id: 'FigmaStyleCanvas', title: 'UI/UX State Visual Builder', icon: <LayoutDashboard size={20} />, activeColor: 'text-[#58a6ff]', category: '📐 UI & UX' },
    { id: 'UXCognitiveLoadSim', title: 'UX Cognitive Load Simulator', icon: <Brain size={20} />, activeColor: 'text-[#bc8cff]', category: '📐 UI & UX' },
    { id: 'QuickStart', title: 'Quick Start Dashboard', icon: <Rocket size={20} />, activeColor: 'text-[#58a6ff]', category: '🌟 ASCENSION STUDIO' },
    { id: 'Select', title: 'Code Editor', icon: <Bot size={20} />, activeColor: 'text-[#58a6ff]', category: '🤖 IDE & CODE' },
    { id: 'EconomicBalancer', title: 'Combat & Economy Balancer', icon: <Map size={20} />, activeColor: 'text-[#e3b341]', category: '🎮 GAME DESIGN' },
    { id: 'Pipeline', title: 'AI Swarm Pipeline', icon: <GitPullRequest size={20} />, activeColor: 'text-[#3fb950]', category: '🤖 IDE & CODE' },
    { id: 'MapEdit', title: 'Ultimate Grid Map Editor', icon: <Map size={20} />, activeColor: 'text-[#3fb950]', category: '🌍 WORLD BUILDING' },
    { id: 'OmniWorldBuilder', title: 'Omni MegaWorld Builder (Ultimate)', icon: <Globe size={20} />, activeColor: 'text-[#3fb950]', category: '🌍 WORLD BUILDING' },
    { id: 'OmniAudioStudio', title: 'Omni Audio DSP Studio (Ultimate)', icon: <AudioWaveform size={20} />, activeColor: 'text-[#e3b341]', category: '🎵 AUDIO & SOUND' },
    { id: 'OmniVFXStudio', title: 'Omni VFX & Particle Node Studio', icon: <Flame size={20} />, activeColor: 'text-[#f85149]', category: '✨ VFX & PARTICLES' },
    { id: 'OmniAnimationStudio', title: 'Omni Animation & MoCap Studio', icon: <PersonStanding size={20} />, activeColor: 'text-[#3fb950]', category: '🏃 ANIMATION' },
    { id: 'OmniVisualScripting', title: 'Omni Visual Node Engine', icon: <Network size={20} />, activeColor: 'text-[#bc8cff]', category: '🤖 IDE & CODE' },
    { id: 'OmniBackendNetworkingStudio', title: 'Omni Backend, Netcode & LiveOps Studio', icon: <Server size={20} />, activeColor: 'text-[#58a6ff]', category: '☁️ BACKEND & NETWORKING' },
    { id: 'OmniNarrativeQuestStudio', title: 'Omni Narrative, Quest & Cinematic Studio', icon: <BookOpen size={20} />, activeColor: 'text-[#bc8cff]', category: '🎮 GAME DESIGN' },
    { id: 'OmniAIAssistantStudio', title: 'Omni AI GenAgent Editor', icon: <Bot size={20} />, activeColor: 'text-[#bc8cff]', category: '🤖 IDE & CODE' },
    { id: 'EngineCore', title: 'Game Engine Architecture (GameObject, Core)', icon: <Cpu size={20} />, activeColor: 'text-[#58a6ff]', category: '⚙️ ENGINE CORE' },
    { id: 'GraphicsRender', title: 'Graphics & Rendering Tech (Nanite, Lumen, DLSS)', icon: <MonitorPlay size={20} />, activeColor: 'text-[#ff7b72]', category: '⚙️ ENGINE CORE' },
    { id: 'PhysicsEngine', title: 'Universal Physics Dynamics', icon: <Orbit size={20} />, activeColor: 'text-[#f85149]', category: '⚙️ ENGINE CORE' },
    { id: 'InputMapping', title: 'Input & Controller Mapping', icon: <Gamepad2 size={20} />, activeColor: 'text-[#58a6ff]', category: '⚙️ ENGINE CORE' },
    { id: 'AITestingQA', title: 'AI Offline QA, Perf Metric & Debug', icon: <ShieldCheck size={20} />, activeColor: 'text-[#2ea043]', category: '🐛 QA & DEBUGGING' },
    { id: 'GameSystems', title: 'AAA Game Systems Architecture', icon: <Blocks size={20} />, activeColor: 'text-[#58a6ff]', category: '⚙️ ENGINE CORE' },
    { id: 'ScriptEditor', title: 'IDE & Script Editor', icon: <TerminalSquare size={20} />, activeColor: 'text-[#ff7b72]', category: '🤖 IDE & CODE' },
    { id: 'AssetPipeline', title: 'Asset Pipeline & Source Control', icon: <FolderTree size={20} />, activeColor: 'text-[#3fb950]', category: '☁️ BACKEND & NETWORKING' },
    { id: 'BuildPublish', title: 'One-Click Build & Pipeline', icon: <Globe2 size={20} />, activeColor: 'text-[#3fb950]', category: '⚙️ DEVOPS' },
    { id: 'NPCEdit', title: 'Deep NPC Builder', icon: <Users size={20} />, activeColor: 'text-[#ff7b72]', category: '🎮 GAME DESIGN' },
    { id: 'MonsterEdit', title: 'Monster & Entities Builder', icon: <Ghost size={20} />, activeColor: 'text-[#e3b341]', category: '🎮 GAME DESIGN' },
    { id: 'Modeling', title: 'Apex 3D/2D Modeling Studio', icon: <Box size={20} />, activeColor: 'text-[#e3b341]', category: '🎨 ART & ASSETS' },
    { id: 'Sequencer', title: 'Apex Timeline Sequencer', icon: <Clapperboard size={20} />, activeColor: 'text-[#bc8cff]', category: '🎬 CINEMATICS' },
    { id: 'MetaHuman', title: 'MetaHuman System', icon: <UserSquare size={20} />, activeColor: 'text-[#58a6ff]', category: '🎨 ART & ASSETS' },
    { id: 'Blueprint', title: 'Visual Scripting (Kismet)', icon: <Waypoints size={20} />, activeColor: 'text-[#3fb950]', category: '🤖 IDE & CODE' },
    { id: 'DataTable', title: 'Data Table & Spreadsheets', icon: <Database size={20} />, activeColor: 'text-[#3fb950]', category: '🎮 GAME DESIGN' },
    { id: 'Material', title: 'Node Material Editor', icon: <Palette size={20} />, activeColor: 'text-[#e3b341]', category: '🎨 ART & ASSETS' },
    { id: 'ImageEdit', title: 'Image & Texture Editor', icon: <Image size={20} />, activeColor: 'text-[#bc8cff]', category: '🎨 ART & ASSETS' },
    { id: 'UIUXEdit', title: 'Apex UI/UX Builder', icon: <LayoutDashboard size={20} />, activeColor: 'text-[#58a6ff]', category: '📐 UI & UX' },
    { id: 'SkillForge', title: 'Ultimate Skill Forge', icon: <Swords size={20} />, activeColor: 'text-[#ff7b72]', category: '🎮 GAME DESIGN' },
    { id: 'ProceduralAsset', title: '🎬 Procedural Asset Studio', icon: <FlaskConical size={20} />, activeColor: 'text-[#bc8cff]', category: '🎨 ART & ASSETS' },
    { id: 'PerformanceProfile', title: 'AAA Perf Profiler & Deep Bug Hunter', icon: <Bug size={20} />, activeColor: 'text-[#f85149]', category: '🐛 QA & DEBUGGING' },
    { id: 'CinematicSequencer', title: 'Timeline & Cinematic Sequencer', icon: <Clapperboard size={20} />, activeColor: 'text-[#58a6ff]', category: '🎬 CINEMATICS' },
    { id: 'ActionRecorder', title: 'Manual Action & Sequence Recorder', icon: <Video size={20} />, activeColor: 'text-[#e3b341]', category: '🎬 CINEMATICS' },
    { id: 'AdvancedNavMesh', title: 'NavMesh & Crowd AI', icon: <Users size={20} />, activeColor: 'text-[#e3b341]', category: '🤖 IDE & CODE' },
    { id: 'Photogrammetry', title: '3D Photogrammetry Scanner', icon: <Camera size={20} />, activeColor: 'text-[#3fb950]', category: '🎨 ART & ASSETS' },
    { id: 'HardwareDriver', title: 'Device Driver & HW Config', icon: <Activity size={20} />, activeColor: 'text-[#58a6ff]', category: '⚙️ DEVOPS' },
    { id: 'Offline3DModeler', title: 'Offline 3D Modeler & Sculptor', icon: <Box size={20} />, activeColor: 'text-[#bc8cff]', category: '🎨 ART & ASSETS' },
    { id: 'AdvancedImage', title: 'Advanced Image / Raster Forge', icon: <Image size={20} />, activeColor: 'text-[#0070d2]', category: '🎨 ART & ASSETS' },
    { id: 'CinematicDirector', title: 'Cinematic Master Sequencer', icon: <Video size={20} />, activeColor: 'text-[#bc8cff]', category: '🎬 CINEMATICS' },
    { id: 'EngineProfiler', title: 'Engine Performance Profiler', icon: <Activity size={20} />, activeColor: 'text-red-500', category: '🐛 QA & DEBUGGING' },
    { id: 'HD2DHybridEditor', title: '2.5D / HD-2D Hybrid Engine', icon: <Layers size={20} />, activeColor: 'text-[#3fb950]', category: '⚙️ ENGINE CORE' },
    { id: 'VehiclePhysics', title: 'Vehicle Dynamics Configurator', icon: <Activity size={20} />, activeColor: 'text-[#e3b341]', category: '⚙️ ENGINE CORE' },
    { id: 'MLAgents', title: 'Machine Learning Training Room', icon: <BrainCircuit size={20} />, activeColor: 'text-[#3fb950]', category: '🤖 IDE & CODE' },
    { id: 'VRXREngine', title: 'OpenXR VR/MR Development Hub', icon: <Glasses size={20} />, activeColor: 'text-[#bc8cff]', category: '⚙️ ENGINE CORE' },
    { id: 'DevOpsBuilder', title: 'Cross-Platform Matrix & DevOps Config', icon: <Terminal size={20} />, activeColor: 'text-[#58a6ff]', category: '⚙️ DEVOPS' },
    { id: 'ASTNodeWeaver', title: 'AST Logic Weaver (Nodes)', icon: <Network size={20} />, activeColor: 'text-[#ff7b72]', category: '🤖 IDE & CODE' },
    { id: 'OptimizationOverview', title: 'Optimization Overview', icon: <Activity size={20} />, activeColor: 'text-[#3fb950]', category: '🐛 QA & DEBUGGING' },
    { id: 'KernelDebugger', title: 'Kernel Panic Analyzer', icon: <Microchip size={20} />, activeColor: 'text-[#f85149]', category: '🐛 QA & DEBUGGING' },
    { id: 'MemoryProfiler', title: 'Heap & Memory Profiler', icon: <MemoryStick size={20} />, activeColor: 'text-[#bc8cff]', category: '🐛 QA & DEBUGGING' },
    { id: 'AudioDSP', title: 'Digital Signal Processing (Audio)', icon: <Mic2 size={20} />, activeColor: 'text-[#3fb950]', category: '🎵 AUDIO & SOUND' },
    { id: 'VideoEncoder', title: 'FFmpeg Video Pipeline', icon: <Video size={20} />, activeColor: 'text-[#e3b341]', category: '🎬 CINEMATICS' },
    { id: 'VCSConflict', title: 'Git Conflict Resolver', icon: <GitMerge size={20} />, activeColor: 'text-[#f85149]', category: '⚙️ DEVOPS' },
    { id: 'HexEditor', title: 'Raw Hex/Binary Editor', icon: <Binary size={20} />, activeColor: 'text-[#bc8cff]', category: '🤖 IDE & CODE' },
    { id: 'HardwareConfig', title: 'Hardware I/O Configurator', icon: <Wrench size={20} />, activeColor: 'text-[#3fb950]', category: '⚙️ DEVOPS' },
    { id: 'TerminalSvr', title: 'Secure Shell (SSH) Client', icon: <Terminal size={20} />, activeColor: 'text-[#58a6ff]', category: '⚙️ DEVOPS' },
    { id: 'RegexTester', title: 'Advanced Regex Engine', icon: <SearchCode size={20} />, activeColor: 'text-[#bc8cff]', category: '🤖 IDE & CODE' },
    { id: 'DiffTool', title: 'Advanced File Diffs', icon: <SplitSquareHorizontal size={20} />, activeColor: 'text-[#f85149]', category: '🤖 IDE & CODE' },
    { id: 'SystemTap', title: 'SystemTap & DTrace', icon: <Activity size={20} />, activeColor: 'text-[#e3b341]', category: '🐛 QA & DEBUGGING' },
    { id: 'HexInjector', title: 'Hex Injector / Patch Tool', icon: <Cpu size={20} />, activeColor: 'text-[#ff7b72]', category: '🐛 QA & DEBUGGING' },
    { id: 'FontEditor', title: 'TrueType/OpenType Editor', icon: <AlignLeft size={20} />, activeColor: 'text-[#bc8cff]', category: '📐 UI & UX' },
    { id: 'DockerManager', title: 'Container & Image Builder', icon: <Box size={20} />, activeColor: 'text-[#58a6ff]', category: '⚙️ DEVOPS' },
    { id: 'BuildMonitor', title: 'Jenkins / CI Monitor', icon: <Activity size={20} />, activeColor: 'text-[#f85149]', category: '⚙️ DEVOPS' },
    { id: 'AppProfiler', title: 'Strace & Ltrace Viewer', icon: <Search size={20} />, activeColor: 'text-[#e3b341]', category: '🐛 QA & DEBUGGING' },
    { id: 'CompilerTool', title: 'GCC/LLVM Flag Optimizer', icon: <Wrench size={20} />, activeColor: 'text-[#bc8cff]', category: '⚙️ DEVOPS' },
    { id: 'LogViewer', title: 'Massive System Log Viewer', icon: <AlignLeft size={20} />, activeColor: 'text-[#3fb950]', category: '🐛 QA & DEBUGGING' },
    { id: 'SculptMaster', title: 'Topological Sculpting (ZBrush Eq)', icon: <Box size={20} />, activeColor: 'text-[#58a6ff]', category: '🎨 ART & ASSETS' },
    { id: 'UVRetopology', title: 'Auto-UV Unwrapper & Retopology', icon: <Crosshair size={20} />, activeColor: 'text-[#e3b341]', category: '🎨 ART & ASSETS' },
    { id: 'TextureBaker', title: 'PBR Material Node & Texture Baker', icon: <Layers size={20} />, activeColor: 'text-[#bc8cff]', category: '🎨 ART & ASSETS' },
    { id: 'VectorHybrid', title: 'Raster/Vector Hybrid Graph', icon: <Image size={20} />, activeColor: 'text-[#3fb950]', category: '🎨 ART & ASSETS' },
    { id: 'SpriteSheetGen', title: '2D SpriteSheet AI Interpolation', icon: <MonitorPlay size={20} />, activeColor: 'text-[#ff7b72]', category: '🎨 ART & ASSETS' },
    { id: 'EyeTrackingHeatmap', title: 'Eye-Tracking & Heatmap QA', icon: <Eye size={20} />, activeColor: 'text-[#3fb950]', category: '📐 UI & UX' },
    { id: 'RenderPipeline', title: 'Scriptable Render Pipeline Architect', icon: <MonitorPlay size={20} />, activeColor: 'text-[#3fb950]', category: '⚙️ ENGINE CORE' },
    { id: 'FigmaClone', title: 'Ultimate UI/UX Figma-like Canvas', icon: <LayoutDashboard size={20} />, activeColor: 'text-[#bc8cff]', category: '📐 UI & UX' },
    { id: 'InteractionPrototyper', title: 'UI Animations & State Keyframer', icon: <Layers size={20} />, activeColor: 'text-[#ff7b72]', category: '📐 UI & UX' },
    { id: 'AccessibilityTester', title: 'UX Contrast & Colorblindness QA', icon: <Eye size={20} />, activeColor: 'text-[#e3b341]', category: '📐 UI & UX' },
    { id: 'CloudBuildPipeline', title: 'Cross-form CI/CD Build Farm', icon: <Cloud size={20} />, activeColor: 'text-[#58a6ff]', category: '⚙️ DEVOPS' },
  ];

  
  const renderActiveTool = () => {
    switch(activeTool) {
      case 'OmniCreatorMaster': return null; // Controlled by layout directly
      case 'ZBrushStyleSculptingStudio': return <ZBrushStyleSculptingStudio />;
      case 'SubstanceStyleTexturePainter': return <SubstanceStyleTexturePainter />;
      case 'HoudiniStyleProceduralNode': return <HoudiniStyleProceduralNode />;
      case 'PhotogrammetryMeshBuilder': return <PhotogrammetryMeshBuilder />;
      case 'VehicleDynamicsTuner': return <VehicleDynamicsTuner />;
      case 'CinematicLightingEditor': return <CinematicLightingEditor />;
      case 'RenderFarmManager': return <RenderFarmManager />;
      case 'ModdingWorkshopPublisher': return <ModdingWorkshopPublisher />;
      case 'CodeProfilerTracer': return <CodeProfilerTracer />;
      case 'IDECompilerCore': return <IDECompilerCore />;
      case 'NavMeshRouter': return <NavMeshRouter />;
      case 'TopologyUVPro': return <TopologyUVPro />;
      case 'FigmaStyleCanvas': return <FigmaStyleCanvas />;
      case 'UXCognitiveLoadSim': return <UXCognitiveLoadSim />;
      case 'QuickStart': return <QuickStartDashboard />;
      case 'Select': return <CodeEditor />;
      case 'EconomicBalancer': return <EconomicBalancer />;
      case 'Pipeline': return <PipelineEditor />;
      case 'MapEdit': return <MapEdit />;
      case 'OmniWorldBuilder': return <OmniMegaWorldBuilder />;
      case 'OmniAudioStudio': return <OmniAudioDSPStudio />;
      case 'OmniVFXStudio': return <OmniVFXParticleStudio />;
      case 'OmniAnimationStudio': return <OmniAnimationStudio />;
      case 'OmniVisualScripting': return <OmniVisualScriptingEngine />;
      case 'OmniBackendNetworkingStudio': return <OmniBackendNetworkingStudio />;
      case 'OmniNarrativeQuestStudio': return <OmniNarrativeQuestStudio />;
      case 'OmniAIAssistantStudio': return <OmniAIAssistantStudio />;
      case 'EngineCore': return <EngineCoreEditor />;
      case 'GraphicsRender': return <GraphicsRenderEditor />;
      case 'PhysicsEngine': return <EngineCoreEditor />;
      case 'InputMapping': return <GenericToolPanel toolId='InputMapping' tools={tools} />;
      case 'AITestingQA': return <PerformanceProfiler />;
      case 'GameSystems': return <GameSystemsEditor />;
      case 'ScriptEditor': return <ScriptEditor />;
      case 'AssetPipeline': return <ContentBrowser />;
      case 'BuildPublish': return <BuildPublishEditor />;
      case 'NPCEdit': return <NPCEditor />;
      case 'MonsterEdit': return <GenericToolPanel toolId='MonsterEdit' tools={tools} />;
      case 'Modeling': return <ModelingEditor />;
      case 'Sequencer': return <CinematicSequencerEditor />;
      case 'MetaHuman': return <MetaHumanEditor />;
      case 'Blueprint': return <BlueprintEditor />;
      case 'DataTable': return <DataTableEditor />;
      case 'Material': return <MaterialEditor />;
      case 'ImageEdit': return <ImageEditor />;
      case 'UIUXEdit': return <UIUXEditor />;
      case 'SkillForge': return <SkillForgeEditor />;
      case 'ProceduralAsset': return <ProceduralAssetStudio />;
      case 'PerformanceProfile': return <PerformanceProfiler />;
      case 'CinematicSequencer': return <CinematicSequencerEditor />;
      case 'ActionRecorder': return <ManualSequenceRecorder />;
      case 'AdvancedNavMesh': return <NavMeshRouter />;
      case 'Photogrammetry': return <Photogrammetry3DScanner />;
      case 'HardwareDriver': return <DeviceDriverConfigPanel />;
      case 'Offline3DModeler': return <Offline3DModeler />;
      case 'AdvancedImage': return <ImageEditor />;
      case 'CinematicDirector': return <CinematicDirector />;
      case 'EngineProfiler': return <GameEngineProfiler />;
      case 'HD2DHybridEditor': return <EngineCoreEditor />;
      case 'VehiclePhysics': return <VehicleDynamicsEditor />;
      case 'MLAgents': return <MLAgentsEditor />;
      case 'VRXREngine': return <VRXREngineEditor />;
      case 'DevOpsBuilder': return <ArchitectureDevOpsEditor />;
      case 'ASTNodeWeaver': return <GenericToolPanel toolId='ASTNodeWeaver' tools={tools} />;
      case 'OptimizationOverview': return <OptimizationOverview />;
      case 'KernelDebugger': return <ChronoDebugger />;
      case 'MemoryProfiler': return <PerformanceProfiler />;
      case 'AudioDSP': return <OmniAudioDSPStudio />;
      case 'VideoEncoder': return <GenericToolPanel toolId='VideoEncoder' tools={tools} />;
      case 'VCSConflict': return <GitPanel />;
      case 'HexEditor': return <GenericToolPanel toolId='HexEditor' tools={tools} />;
      case 'HardwareConfig': return <HardwareProfilerOverlay />;
      case 'TerminalSvr': return <LogViewer />;
      case 'RegexTester': return <GenericToolPanel toolId='RegexTester' tools={tools} />;
      case 'DiffTool': return <GitPanel />;
      case 'SystemTap': return <ResourceUsageTab />;
      case 'HexInjector': return <GenericToolPanel toolId='HexInjector' tools={tools} />;
      case 'FontEditor': return <GenericToolPanel toolId='FontEditor' tools={tools} />;
      case 'DockerManager': return <ArchitectureDevOpsEditor />;
      case 'BuildMonitor': return <BuildPublishEditor />;
      case 'AppProfiler': return <PerformanceProfiler />;
      case 'CompilerTool': return <IDECompilerCore />;
      case 'LogViewer': return <LogViewer />;
      case 'SculptMaster': return <ZBrushStyleSculptingStudio />;
      case 'UVRetopology': return <TopologyUVPro />;
      case 'TextureBaker': return <SubstanceStyleTexturePainter />;
      case 'VectorHybrid': return <ImageEditor />;
      case 'SpriteSheetGen': return <ImageEditor />;
      case 'EyeTrackingHeatmap': return <GenericToolPanel toolId='EyeTrackingHeatmap' tools={tools} />;
      case 'RenderPipeline': return <GraphicsRenderEditor />;
      case 'FigmaClone': return <FigmaStyleCanvas />;
      case 'InteractionPrototyper': return <UIUXEditor />;
      case 'AccessibilityTester': return <GenericToolPanel toolId='AccessibilityTester' tools={tools} />;
      case 'CloudBuildPipeline': return <ArchitectureDevOpsEditor />;
      default: return <GenericToolPanel toolId={activeTool} tools={tools} />;
    }
  };

  return (
    <div className="w-full h-full bg-[#0a0a0f] text-white flex flex-col font-sans overflow-hidden">
      <CommandPalette tools={tools} onSelect={setActiveTool} />
      <OmniEngineIDE tools={tools} activeTool={activeTool} setActiveTool={setActiveTool} renderActiveTool={renderActiveTool} />
      
      {/* Global AI Offline Chat Toggle */}
      <button 
        onClick={() => setShowGlobalChat(!showGlobalChat)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.5)] flex items-center justify-center transition-transform hover:scale-110 border border-blue-400"
      >
        <MessageCircle size={24} className="text-white" />
      </button>

      {/* Global AI Chat Panel */}
      {showGlobalChat && (
        <div className="fixed bottom-20 right-6 z-50 w-[450px] h-[600px] bg-[#0a0a0f] border border-[#2a2b3d] rounded-lg shadow-2xl flex flex-col overflow-hidden">
           <div className="bg-[#11111b] border-b border-[#2a2b3d] p-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[13px] font-bold">
                 <Bot size={16} className="text-blue-400"/>
                 AI Offline Copilot
              </div>
              <button onClick={() => setShowGlobalChat(false)} className="text-gray-400 hover:text-white"><X size={14} /></button>
           </div>
           <div className="flex-1 overflow-hidden relative">
              <AIChat code={globalCode} setCode={setGlobalCode} language={globalLanguage} setLanguage={setGlobalLanguage} />
           </div>
        </div>
      )}
    </div>
  )
}
