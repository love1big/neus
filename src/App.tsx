/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import CodeEditor from './components/CodeEditor';
import AIChat from './components/AIChat';
import Viewport3D from './components/Viewport3D';
import PopOutPanel from './components/PopOutPanel';
import GitPanel from './components/GitPanel';
import { Brain, ShoppingCart, Database, Bot, Play, Pause, Square, FolderTree, FileCode2, MessageSquare, Sparkles, Box, Mountain, Workflow, PersonStanding, Clapperboard, UserSquare, Waypoints, Palette, Music, GitBranch, Terminal, Server, GitPullRequest, Download, Globe, Map, Users, Ghost, BookOpen, Image, Layers, Eye, Gamepad2, Cpu, MonitorPlay, Activity, Cloud, ShieldCheck, Blocks, Orbit, AudioWaveform, Search, Bug, FlaskConical, Blocks as Puzzle, LayoutDashboard, RotateCw, XCircle, ChevronDown, CheckCircle, AlertTriangle, Plus, X, Flame, Network, TrendingUp, BrainCircuit, Glasses, Zap, Swords, Camera, Wand2, Wifi, Microchip, MemoryStick, Mic2, Mic, Video, GitMerge, Hash, Binary, Crosshair, Wrench, Shield, Key, Fingerprint, Anchor, Zap as Flash, Combine, Command, SearchCode, ExternalLink, Film, Sliders, Smile } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import MaterialEditor from './components/MaterialEditor';
import CutsceneEditor from './components/CutsceneEditor';
import SettingsModal from './components/SettingsModal';
import TaskPanel from './components/TaskPanel';
import PipelineEditor from './components/PipelineEditor';
import GamePreview from './components/GamePreview';
import ModulePanel from './components/ModulePanel';
import PCGEditor from './components/PCGEditor';
import NiagaraEditor from './components/NiagaraEditor';
import MetaHumanEditor from './components/MetaHumanEditor';
import LogicVisualEditor from './components/LogicVisualEditor';
import UIUXEditor from './components/UIUXEditor';
import LocalAIStudio from './components/LocalAIStudio';
import AIBrowser from './components/AIBrowser';
import SkillForgeEditor from './components/SkillForgeEditor';

import WorldBuilderEditor from './components/WorldBuilderEditor';
import SentientAIEditor from './components/SentientAIEditor';
import ProceduralAssetStudio from './components/ProceduralAssetStudio';
import ArchitectureDevOpsEditor from './components/ArchitectureDevOpsEditor';
import VehicleDynamicsEditor from './components/VehicleDynamicsEditor';
import VRXREngineEditor from './components/VRXREngineEditor';
import MLAgentsEditor from './components/MLAgentsEditor';
import CinematicSequencerEditor from './components/CinematicSequencerEditor';
import VFXHitboxStudio from './components/VFXHitboxStudio';
import OfflineAIVFXStudio from './components/OfflineAIVFXStudio';


import LiveOpsDashboard from './components/LiveOpsDashboard';
import PerformanceProfiler from './components/PerformanceProfiler';
import AnimGraphEditor from './components/AnimGraphEditor';
import CharacterAnimator from './components/CharacterAnimator';
import LandscapeEditor from './components/LandscapeEditor';
import MapEditor from './components/MapEditor';
import NetcodeEditor from './components/NetcodeEditor';
import EngineCoreEditor from './components/EngineCoreEditor';
import LevelDesignEditor from './components/LevelDesignEditor';
import QuestDirectorEditor from './components/QuestDirectorEditor';
import AICommandCenter from './components/AICommandCenter';
import HardwareProfilerOverlay from './components/HardwareProfilerOverlay';
import OptimizationOverview from './components/OptimizationOverview';
import BlueprintEditor from './components/BlueprintEditor';
import ContentBrowser from './components/ContentBrowser';
import DataTableEditor from './components/DataTableEditor';
import AssetStore from './components/AssetStore';
import StoryGraphEditor from './components/StoryGraphEditor';
import Offline3DModeler from './components/Offline3DModeler';
import AdvancedTerrainEditor from './components/AdvancedTerrainEditor';
import AudioDAW from './components/AudioDAW';
import AdvancedMapBuilder from './components/AdvancedMapBuilder';
import UltimateMapGameBuilder from './components/UltimateMapGameBuilder';
import BlueprintExecutionVisualizer from './components/BlueprintExecutionVisualizer';
import MegaWorldArchitect from './components/MegaWorldArchitect';
import RiggingAndAnimation from './components/RiggingAndAnimation';
import AdvancedImageEditor from './components/AdvancedImageEditor';
import VFXGraphEditor from './components/VFXGraphEditor';
import CinematicDirector from './components/CinematicDirector';
import GameEngineProfiler from './components/GameEngineProfiler';
import BehaviorTreeEditor from './components/BehaviorTreeEditor';
import BatchAIImporter from './components/BatchAIImporter';
import ProjectSettingsEditor from './components/ProjectSettingsEditor';
import WorldLoreEditor from './components/WorldLoreEditor';
import BuildPublishEditor from './components/BuildPublishEditor';
import GameSystemsEditor from './components/GameSystemsEditor';
import AudioEditor from './components/AudioEditor';
import ImageEditor from './components/ImageEditor';
import ModelingEditor from './components/ModelingEditor';
import NPCEditor from './components/NPCEditor';
import ScriptEditor from './components/ScriptEditor';
import GraphicsRenderEditor from './components/GraphicsRenderEditor';
import NetworkSim from './components/NetworkSim';
import Photogrammetry3DScanner from './components/Photogrammetry3DScanner';
import DeviceDriverConfigPanel from './components/DeviceDriverConfigPanel';
import ResourceUsageTab from './components/ResourceUsageTab';
import WorldBibleEditor from './components/WorldBibleEditor';
import EconomicBalancer from './components/EconomicBalancer';
import NodeGraphEditor from './components/NodeGraphEditor';
import QuickStartDashboard from './components/QuickStartDashboard';
import PhysicsSimulationStudio from './components/PhysicsSimulationStudio';
import ManualSequenceRecorder from './components/ManualSequenceRecorder';
import ActionGraphEditor from './components/ActionGraphEditor';
import WorkflowDAGEditor from './components/WorkflowDAGEditor';
import { IDEFile, TEMPLATES, DEFAULT_FOLDERS } from './lib/project';
import { Settings, TerminalSquare, Globe2, History, List, Rocket, SplitSquareHorizontal, AlignLeft } from 'lucide-react';


import GlobalSearchPanel from './components/GlobalSearchPanel';

import { Message as ChatMessage } from './components/AIChat';
// -----------------------------------------------------------------------------
// Component: App
// -----------------------------------------------------------------------------
/**
 * Main Application layout for OmniCode Pro.
 * Responsive design with a robust mobile-first experience and desktop multi-panel view.
 */
import ChronoDebugger from './components/ChronoDebugger';
import NodeGraphMockup from './components/NodeGraphMockup';
import GlobalUniversalDetailsPanel from './components/GlobalUniversalDetailsPanel';
import OmniCreatorMaster from './components/OmniCreatorMaster';
import AITextureSynthesizer from './components/AITextureSynthesizer';
import VoiceMusicStudio from './components/VoiceMusicStudio';

import MasterNarrativeCinematicEditor from './components/MasterNarrativeCinematicEditor';

export default function App() {
  const { t } = useLanguage();
  // --- State Management ---
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Hello! I am your Offline Local AI Assistant. 100% On-Device Neural Engine Initialized. I am equipped with Deep Offline Learning capabilities allowing me to ingest knowledge from Search Engines and Video Platforms. My context memory has been upgraded to INFINITE capacity, meaning I will remember every single line of our chat forever. You can also search through our chat history using the search bar above. How can I help you today?" }
  ]);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [detachedWindows, setDetachedWindows] = useState({
    viewport: false,
    console: false,
    codeEditor: false,
  });
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'sys', text: 'Virtual Environment Activated: (nexus-env) python 3.10.12' },
    { type: 'cmd', text: 'npm run dev' },
    { type: 'sys', text: 'VITE v5.0.0 ready in 420 ms' },
    { type: 'success', text: '➜  Local:   http://localhost:3000/' },
    { type: 'success', text: '➜  Network: use --host to expose' }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [serverLogs, setServerLogs] = useState<{time: string, msg: string, type: 'info'|'warn'|'error'|'success'}[]>([]);
  const [files, setFiles] = useState<IDEFile[]>([
    { 
      id: '1', 
      name: 'index.html', 
      language: 'html', 
      folder: 'Root', 
      content: `<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { margin: 0; background: #000; overflow: hidden; display: flex; align-items: center; justify-content: center; height: 100vh; }\n    canvas { border: 2px solid #30363d; border-radius: 8px; box-shadow: 0 0 40px rgba(88,166,255,0.15); }\n  </style>\n</head>\n<body>\n  <canvas id="gameCanvas" width="800" height="600"></canvas>\n</body>\n</html>`
    },
    { 
      id: '2', 
      name: 'main.js', 
      language: 'javascript', 
      folder: 'Scripts', 
      content: `// ----------------------------------------\n// NexusEngine - Simple Physics Demo\n// ----------------------------------------\nwindow.onload = () => {\n  console.log('NexusEngine Runtime Initialized...');\n  const canvas = document.getElementById('gameCanvas');\n  if(!canvas) return console.error('Canvas not found');\n  const ctx = canvas.getContext('2d');\n  \n  let x = 400, y = 300, vx = 8, vy = 6;\n  \n  function loop() {\n    // Clear trail\n    ctx.fillStyle = 'rgba(13, 17, 23, 0.3)';\n    ctx.fillRect(0, 0, 800, 600);\n    \n    // Update\n    x += vx;\n    y += vy;\n    \n    if(x < 20 || x > 780) vx *= -1;\n    if(y < 20 || y > 580) vy *= -1;\n    \n    // Draw glowing particle\n    ctx.beginPath();\n    ctx.arc(x, y, 20, 0, Math.PI*2);\n    ctx.fillStyle = '#58a6ff';\n    ctx.fill();\n    ctx.shadowBlur = 30;\n    ctx.shadowColor = '#58a6ff';\n    \n    requestAnimationFrame(loop);\n  }\n  \n  console.log('Starting Engine Loop');\n  loop();\n};\n` 
    },
    { id: '3', name: 'README.md', language: 'markdown', folder: '', content: '# Project Docs\n\n- Powered by local AI Cluster.' },
    { id: '4', name: 'AI_Agent.h', language: 'cpp', folder: 'Source/Public', content: '#pragma once\n\n#include "CoreMinimal.h"\n#include "GameFramework/Pawn.h"\n#include "AI_Agent.generated.h"\n\nUCLASS(Blueprintable)\nclass AIA_API AAI_Agent : public APawn\n{\n    GENERATED_BODY()\n\npublic:\n    AAI_Agent();\n\nprotected:\n    virtual void BeginPlay() override;\n\npublic:\n    virtual void Tick(float DeltaTime) override;\n    virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;\n};\n' },
    { id: '5', name: 'AI_Agent.cpp', language: 'cpp', folder: 'Source/Private', content: '#include "AI_Agent.h"\n\nAAI_Agent::AAI_Agent()\n{\n    PrimaryActorTick.bCanEverTick = true;\n}\n\nvoid AAI_Agent::BeginPlay()\n{\n    Super::BeginPlay();\n}\n\nvoid AAI_Agent::Tick(float DeltaTime)\n{\n    Super::Tick(DeltaTime);\n}\n\nvoid AAI_Agent::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)\n{\n    Super::SetupPlayerInputComponent(PlayerInputComponent);\n}\n' }
  ]);
  const [activeFileId, setActiveFileId] = useState('1');
  const [mobileView, setMobileView] = useState<'explorer' | 'editor' | 'chat'>('editor');
  const [activeTool, setActiveTool] = useState('QuickStart');
  const [showEditorViewport, setShowEditorViewport] = useState(true);
  const [aiAgentMode, setAiAgentMode] = useState('developer');
  const [leftPanel, setLeftPanel] = useState<'explorer' | 'git' | 'outliner' | 'debug' | 'extensions' | 'test' | 'tasks'>('explorer');
  const [isSimulating, setIsSimulating] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showWindowMenu, setShowWindowMenu] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [isXL, setIsXL] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1280 : true);
  const [bottomTab, setBottomTab] = useState<'log' | 'messages' | 'cmd' | 'content' | 'terminal' | 'problems' | 'output' | 'debugConsole' | 'chrono' | 'resource'>('log');

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
      setIsXL(window.innerWidth >= 1280);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    setFiles(currentFiles => {
      if (!currentFiles.some(f => f.name === 'MyMathLibrary.js')) {
        return [...currentFiles, {
          id: Math.random().toString(36).substring(2, 9),
          name: 'MyMathLibrary.js',
          language: 'javascript',
          folder: 'Blueprints/FunctionLibrary',
          content: '// Custom Math Utility Functions\n\nexport function calculateDamage(base, multiplier) {\n  return base * multiplier;\n}\n\nexport function normalizeVector(x, y, z) {\n  const len = Math.sqrt(x*x + y*y + z*z);\n  return [x/len, y/len, z/len];\n}'
        }];
      }
      return currentFiles;
    });
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        e.stopPropagation();
        setShowGlobalSearch(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, []);

  const AGENTS = {
    // ---- PROGRAMMING & ENGINEERING ----
    developer: { name: 'Developer Assistant', icon: '🤖', color: 'bg-[#58a6ff]', context: '32K CONTEXT', model: 'OmniCode Expert' },
    copilot: { name: 'Code Copilot', icon: '💻', color: 'bg-[#3fb950]', context: '16K CONTEXT', model: 'NexusCode Core' },
    commander: { name: 'Swarm Overlord', icon: '👑', color: 'bg-[#f85149]', context: 'PIPELINE', model: 'Nexus Prime' },
    cpp_expert: { name: 'C++ Systems Engineer', icon: '⚙️', color: 'bg-[#e3b341]', context: 'BARE-METAL', model: 'CppNatives Engine' },
    csharp_architect: { name: 'C# Gameplay Architect', icon: '🧩', color: 'bg-[#bc8cff]', context: 'OOP LOGIC', model: 'MonoLogic Core' },
    python_ml: { name: 'Python ML Scientist', icon: '🐍', color: 'bg-[#58a6ff]', context: 'TENSORS', model: 'PyTensor AI' },
    rust_safety: { name: 'Rust Netcode Dev', icon: '🦀', color: 'bg-[#ff7b72]', context: 'MEMORY-SAFE', model: 'CargoNet Engine' },
    shader_dev: { name: 'Shader/GPU Dev', icon: '🎇', color: 'bg-[#2ea043]', context: 'GLSL/HLSL', model: 'PixelMath Pro' },

    // ---- GAME DESIGN & MECHANICS ----
    game: { name: 'Game Director', icon: '🎮', color: 'bg-[#58a6ff]', context: 'SYSTEMS', model: 'GameDir Engine' },
    level_designer: { name: 'Level Designer', icon: '🏰', color: 'bg-[#e3b341]', context: 'SPATIAL', model: 'LevelFlow AI' },
    combat_balancer: { name: 'Combat Balancer', icon: '⚔️', color: 'bg-[#f85149]', context: 'MATH MATRIX', model: 'EconBalance C-3' },
    puzzle_maker: { name: 'Puzzle Architect', icon: '🧩', color: 'bg-[#bc8cff]', context: 'LOGIC GATES', model: 'RiddleGenius' },

    // ---- 3D / ANIMATION / FX ----
    '3d': { name: '3D Studio AI', icon: '🧊', color: 'bg-[#58a6ff]', context: 'GPU RENDER', model: 'MeshGenius' },
    rigger: { name: 'Skeletal Rigger', icon: '🦴', color: 'bg-[#e3b341]', context: 'KINEMATICS', model: 'RigBone Auto' },
    animator: { name: 'MoCap Animator', icon: '🏃', color: 'bg-[#3fb950]', context: 'KEYFRAMES', model: 'MotionFlow-9' },
    vfx_artist: { name: 'VFX Particle Artist', icon: '✨', color: 'bg-[#bc8cff]', context: 'EMITTERS', model: 'NiagaraSim Pro' },
    lighting: { name: 'Lighting Cinematographer', icon: '💡', color: 'bg-[#e3b341]', context: 'RAYTRACING', model: 'LumenCast-X' },

    // ---- 2D / UI / VISION ----
    vision: { name: 'Texture Gen', icon: '🎨', color: 'bg-[#e3b341]', context: 'DIFFUSION', model: 'TextureDiff' },
    uiux: { name: 'UX Designer', icon: '📐', color: 'bg-[#bc8cff]', context: 'V-VISION', model: 'DesignNet-Pro' },
    pixel_artist: { name: 'Pixel Art Gen', icon: '👾', color: 'bg-[#58a6ff]', context: 'RETRO 8-BIT', model: 'SpriteGen' },
    concept_artist: { name: 'Concept Illustrator', icon: '🖼️', color: 'bg-[#ff7b72]', context: 'CANVAS', model: 'MidCanvas v6' },

    // ---- AUDIO & MUSIC ----
    audio: { name: 'AudioFX Synth', icon: '🎵', color: 'bg-[#e3b341]', context: 'DSP ENGINE', model: 'SoundNet-7.0' },
    composer: { name: 'Orchestral Composer', icon: '🎼', color: 'bg-[#bc8cff]', context: 'MIDI GEN', model: 'Symphony-AI' },
    voice_actor: { name: 'Voice Actor Synth', icon: '🎙️', color: 'bg-[#58a6ff]', context: 'PHONETICS', model: 'TTS-Persona' },

    // ---- STORY & LORE ----
    story: { name: 'Lore Storyteller', icon: '📜', color: 'bg-[#e3b341]', context: 'INFINITE', model: 'LoreMaster Infinite' },
    world: { name: 'World Builder', icon: '🌍', color: 'bg-[#3fb950]', context: 'PCG GEN', model: 'TerraGen' },
    dialogue: { name: 'Dialogue Writer', icon: '💬', color: 'bg-[#bc8cff]', context: 'BRANCHING', model: 'ChatterTree Script' },
    quest: { name: 'Quest Architect', icon: '🧭', color: 'bg-[#ff7b72]', context: 'STATE MACHINES', model: 'QuestFlow Node' },
    lore_police: { name: 'Lore Consistency Checker', icon: '🔍', color: 'bg-[#58a6ff]', context: 'DATABASE', model: 'CanonGuard 9' },

    // ---- SPECIALTY ----
    security: { name: 'CyberSec AI', icon: '🛡️', color: 'bg-[#f85149]', context: '32K CONTEXT', model: 'VulnScan-Zero' },
    devops: { name: 'DevOps & Build Engineer', icon: '🏗️', color: 'bg-[#3fb950]', context: 'CI/CD CLOUD', model: 'JenkinsBot CI' }
  };
  const currentAgent = AGENTS[aiAgentMode as keyof typeof AGENTS];

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  const exportProjectToNAE = async () => {
    try {
      const zip = new JSZip();

      // System files (DLLs, configs to make it work 100% on another machine)
      const systemFolder = zip.folder("system");
      systemFolder?.file("EngineCore.dll", "mock_core_engine_binary_data");
      systemFolder?.file("Physics.dll", "mock_physics_binary_data");
      systemFolder?.file("NexusConfig.ini", "[Engine]\nVersion=1.0.0\nRenderer=Vulkan\n[Paths]\nModels=../models\nMaps=../maps\n");

      // Shared models
      const modelsFolder = zip.folder("models");
      modelsFolder?.file("readme.txt", "Drop your .obj, .fbx, and .gltf files here.");

      // Maps / Level data
      const mapsFolder = zip.folder("maps");
      mapsFolder?.file("DefaultMap.map", "mock_map_data");

      // Assets (audio, textures)
      const assetsFolder = zip.folder("assets");
      assetsFolder?.file("readme.txt", "Drop textures (.png, .jpg) and sounds (.wav, .ogg) here.");

      // AI Offline Data (chats, offline knowledge, generated files)
      const aiFolder = zip.folder("ai_offline");
      aiFolder?.file("chat_history.json", JSON.stringify(chatMessages, null, 2));
      aiFolder?.file("knowledge_base.txt", "Local embeddings and vector DB contents placeholder.");

      // Source Code files
      const srcFolder = zip.folder("src");
      files.forEach(f => {
        const path = f.folder ? `${f.folder}/${f.name}` : f.name;
        srcFolder?.file(path, f.content);
      });

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NexusProject.nae`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export project: ", err);
    }
  };

  const setCode = (val: string | ((prev: string) => string)) => {
    if (!activeFile) return;
    const newContent = typeof val === 'function' ? val(activeFile.content) : val;
    setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: newContent } : f));
  };

  const setLanguage = (val: string | ((prev: string) => string)) => {
    if (!activeFile) return;
    const newLang = typeof val === 'function' ? val(activeFile.language) : val;
    setFiles(prev => prev.map(f => {
      if (f.id === activeFileId) {
         let newName = f.name;
         
         // Auto detect language mapping extension
         const languageToExt: Record<string, string> = {
            'python': 'py', 'rust': 'rs', 'cpp': 'cpp', 'javascript': 'js', 'typescript': 'ts',
            'html': 'html', 'css': 'css', 'json': 'json', 'swift': 'swift', 'java': 'java', 'ruby': 'rb',
            'go': 'go', 'php': 'php', 'csharp': 'cs', 'kotlin': 'kt', 'markdown': 'md', 'xml': 'xml', 'yaml': 'yml',
            'sql': 'sql', 'shell': 'sh', 'dart': 'dart', 'lua': 'lua', 'objective-c': 'm', 'scala': 'scala',
            'haskell': 'hs', 'r': 'R', 'solidity': 'sol'
         };

         if (f.name.startsWith('main.')) {
           const ext = languageToExt[newLang] || 'txt';
           newName = `main.${ext}`;
         } else {
           // Allow updating extension on standard files if they change language
           const parts = newName.split('.');
           const baseName = parts.length > 1 ? parts.slice(0, -1).join('.') : parts[0];
           const ext = languageToExt[newLang] || (parts.length > 1 ? parts[parts.length-1] : 'txt');
           newName = `${baseName}.${ext}`;
         }
         
         return { ...f, language: newLang, name: newName };
      }
      return f;
    }));
  };

  const handleWriteFiles = (generatedFiles: any[]) => {
    setFiles(prev => {
      const updated = [...prev];
      let lastId = activeFileId;
      generatedFiles.forEach(gf => {
        const langInfer = gf.language.toLowerCase();
        
        const idx = updated.findIndex(f => f.name === gf.filename);
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], content: gf.content, language: langInfer };
          lastId = updated[idx].id;
        } else {
          const newId = Math.random().toString(36).substring(2, 9);
          updated.push({ id: newId, name: gf.filename, language: langInfer, content: gf.content });
          lastId = newId;
        }
      });
      setActiveFileId(lastId); 
      return updated;
    });
    setMobileView('editor'); // Auto redirect to editor on mobile
  };

  const handleCreateTemplate = (type: keyof typeof TEMPLATES) => {
    const templateFiles = TEMPLATES[type].map(f => ({
      id: Math.random().toString(36).substring(2, 9),
      ...f
    }));
    setFiles(templateFiles);
    setActiveFileId(templateFiles[0].id);
    setMobileView('editor');
  };

  // ---------------------------------------------------------------------------
  // UI Renderers
  // ---------------------------------------------------------------------------

  const renderTopNavigation = () => (
    <nav className="h-[36px] bg-[#0E0E0F] border-b border-[#000] flex items-center px-4 justify-between shrink-0 select-none text-[#b0b5bd]">
      <div className="flex gap-4 items-center flex-1">
        <span className="font-bold text-[#fff] flex items-center gap-2 text-[12px] tracking-wide">
          <Box size={14} className="text-[#58a6ff]"/> {t('app.title')}
        </span>
        <div className="w-[1px] h-[14px] bg-[#333] mx-1 hidden md:block"></div>
        <div className="hidden md:flex gap-0.5 text-[11px] text-[#b0b5bd] font-medium cursor-pointer ml-1 items-center relative">
          <button 
             className="px-2 py-1 hover:bg-[#202020] hover:text-white rounded-[2px] transition-colors flex items-center gap-1.5"
             onClick={() => setShowExportMenu(!showExportMenu)}
          >
            <FileCode2 size={12}/> File
          </button>
          
          {showExportMenu && (
             <div className="absolute top-full left-0 mt-1 w-48 bg-[#151515] border border-[#333] rounded-[4px] shadow-xl py-1 z-50 flex flex-col pointer-events-auto">
                <button 
                  className="px-3 py-1.5 text-left hover:bg-[#0078d7] hover:text-white text-[#ccc] transition-colors text-[11px] flex gap-2 items-center"
                  onClick={() => {
                    exportProjectToNAE();
                    setShowExportMenu(false);
                  }}
                >
                  <Download size={14} /> Export Project (.NAE)
                </button>
             </div>
          )}
          
          <button className="px-2 py-1 hover:bg-[#202020] hover:text-white rounded-[2px] transition-colors">Edit</button>
          <button className="px-2 py-1 hover:bg-[#202020] hover:text-white rounded-[2px] transition-colors">Window</button>
          <button className="px-2 py-1 hover:bg-[#202020] hover:text-white rounded-[2px] transition-colors">Tools</button>
          <button className="px-2 py-1 hover:bg-[#202020] hover:text-white rounded-[2px] transition-colors">Build</button>
          <button className="px-2 py-1 hover:bg-[#202020] hover:text-white rounded-[2px] transition-colors">Help</button>
        </div>
      </div>
      
      {/* Simulation Controls - Center */}
      <div className="hidden lg:flex items-center gap-0.5 bg-[#17171A] border border-[#232328] rounded-[2px] px-1 py-0.5 mx-4 shadow-inner">
        <button 
          onClick={() => setIsSimulating(!isSimulating)}
          className={`px-2 py-1 rounded-[2px] flex items-center gap-2 text-[11px] font-bold transition-all ${isSimulating ? 'text-[#3fb950] bg-[#3fb950]/10' : 'text-[#3fb950] hover:bg-[#202020]'}`}
        >
           <Play size={12} fill={isSimulating ? 'currentColor' : 'currentColor'}/>
        </button>
        <button className="px-2 py-1 rounded-[2px] text-[#888] hover:bg-[#202020] hover:text-[#fff] transition-colors">
           <Pause size={12} fill="currentColor"/>
        </button>
        <button 
          onClick={() => setIsSimulating(false)}
          className="px-2 py-1 rounded-[2px] text-[#888] hover:bg-[#202020] hover:text-[#fff] transition-colors"
        >
           <Square size={12} fill="currentColor"/>
        </button>
        <div className="w-[1px] h-[14px] bg-[#333] mx-1"></div>
        <button className="px-2 py-1 rounded-[2px] text-[#888] hover:bg-[#202020] hover:text-[#fff] transition-colors">
           <MessageSquare size={12} />
        </button>
      </div>
      
      <div className="hidden xl:flex items-center gap-3 px-3 py-1 bg-[#101012] border border-[#232328] rounded-[2px] shadow-inner text-[10px] font-mono whitespace-nowrap">
          <div className="flex flex-col">
            <span className="text-[#888]">FPS</span>
            <span className="text-[#3fb950] font-bold">59.9</span>
          </div>
          <div className="w-[1px] h-[14px] bg-[#333]"></div>
          <div className="flex flex-col">
            <span className="text-[#888]">Logic</span>
            <span className="text-[#58a6ff]">2.1ms</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#888]">Physics</span>
            <span className="text-[#e3b341]">4.5ms</span>
          </div>
           <div className="flex flex-col">
            <span className="text-[#888]">Render</span>
            <span className="text-[#bc8cff]">8.2ms</span>
          </div>
      </div>

      <div className="flex gap-4 items-center flex-1 justify-end mr-2">
        <button className="hidden xl:flex items-center gap-1.5 text-[11px] text-[#b0b5bd] hover:text-[#fff] hover:bg-[#202020] px-2 py-1 rounded-[2px] transition-colors">
          <Play size={12} fill="currentColor"/> Play ▼
        </button>
        <button className="hidden xl:flex items-center gap-1.5 text-[11px] text-[#b0b5bd] hover:text-[#fff] hover:bg-[#202020] px-2 py-1 rounded-[2px] transition-colors">
          <Layers size={12}/> Platforms ▼
        </button>
        <div className="w-[1px] h-[14px] bg-[#333] mx-1 hidden xl:block"></div>
        <div className="text-[11px] text-[#888] mr-2 hidden xl:block tracking-wide">
          Project: <span className="text-[#b0b5bd] ml-1">FantasyWorld</span>
        </div>
        <div className="flex gap-2 text-[#888] ml-2 items-center">
          <button className="hover:text-[#fff] hover:bg-[#ff0000] p-1 transition-colors w-[36px] h-[36px] flex items-center justify-center -mr-2">✕</button>
        </div>
      </div>
    </nav>
  );

  const [toolSearch, setToolSearch] = useState('');
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const renderVerticalToolbar = () => {
    const tools = [
      { id: 'OmniCreatorMaster', title: '100% Omni Creator Master Dashboard', icon: <Command size={20} />, activeColor: 'text-[#f85149]', category: '🌟 ASCENSION STUDIO' },
      
      // ====== START: TRADITIONAL / NON-AI / PROFESSIONAL EXPERT TOOLS ====== //
      { id: 'MasterNarrativeCinematicEditor', title: 'Narrative & Cinematic Timeline (NLE)', icon: <Film size={20} />, activeColor: 'text-[#f85149]', category: '🎬 CINEMATICS' },
      { id: 'CodeProfilerTracer', title: 'C++/C# System Deep Profiler', icon: <Microchip size={20} />, activeColor: 'text-[#58a6ff]', category: '🤖 IDE & CODE' },
      { id: 'IDECompilerCore', title: 'Native Manual IDE & Compiler', icon: <TerminalSquare size={20} />, activeColor: 'text-[#3fb950]', category: '🤖 IDE & CODE' },
      { id: 'BSPBrushArchitect', title: 'BSP Blockout & Grid Mappers', icon: <Box size={20} />, activeColor: 'text-[#e3b341]', category: '🌍 WORLD BUILDING' },
      { id: 'NavMeshRouter', title: 'Manual NavMesh Pathfinder', icon: <Network size={20} />, activeColor: 'text-[#bc8cff]', category: '🌍 WORLD BUILDING' },
      { id: 'TopologyUVPro', title: 'Manual Retopology & UV Unwrap Pro', icon: <Crosshair size={20} />, activeColor: 'text-[#bc8cff]', category: '🎨 ART & ASSETS' },
      { id: 'FigmaStyleCanvas', title: 'UI/UX State Visual Builder', icon: <LayoutDashboard size={20} />, activeColor: 'text-[#58a6ff]', category: '📐 UI & UX' },
      { id: 'UXCognitiveLoadSim', title: 'UX Cognitive Load Simulator', icon: <Brain size={20} />, activeColor: 'text-[#bc8cff]', category: '📐 UI & UX' },
      { id: 'VstMixerRack', title: 'VST / DSP Mixer Rack', icon: <Sliders size={20} />, activeColor: 'text-[#e3b341]', category: '🎵 AUDIO & SOUND' },
      { id: 'MidiPianoRoll', title: 'Studio MIDI Piano Roll', icon: <Music size={20} />, activeColor: 'text-[#bc8cff]', category: '🎵 AUDIO & SOUND' },
      { id: 'BranchingDialogueWeaver', title: 'Story Branch Node Graph', icon: <GitBranch size={20} />, activeColor: 'text-[#ff7b72]', category: '🎮 GAME DESIGN' },
      { id: 'GameStateFlagTree', title: 'Game State Variable Regedit', icon: <Database size={20} />, activeColor: 'text-[#3fb950]', category: '🎮 GAME DESIGN' },
      // ====== END: TRADITIONAL TOOLS ====== //
      
      { id: 'QuickStart', title: 'Quick Start Dashboard', icon: <Rocket size={20} />, activeColor: 'text-[#58a6ff]', category: '🌟 ASCENSION STUDIO' },
      { id: 'Select', title: 'Code Editor', icon: <Bot size={20} />, activeColor: 'text-[#58a6ff]', category: '🤖 IDE & CODE' },
      { id: 'EconomicBalancer', title: 'Combat & Economy Balancer', icon: <Map size={20} />, activeColor: 'text-[#e3b341]', category: '🎮 GAME DESIGN' },
      { id: 'NodeGraphEditor', title: 'Logic & Dialogue Graph (No-AI)', icon: <Users size={20} />, activeColor: 'text-[#bc8cff]', category: '🤖 IDE & CODE' },
      { id: 'Pipeline', title: 'AI Swarm Pipeline', icon: <GitPullRequest size={20} />, activeColor: 'text-[#3fb950]', category: '🤖 IDE & CODE' },

      { id: 'EngineCore', title: 'Game Engine Architecture (GameObject, Core)', icon: <Cpu size={20} />, activeColor: 'text-[#58a6ff]', category: '⚙️ ENGINE CORE' },
      { id: 'GraphicsRender', title: 'Graphics & Rendering Tech (Nanite, Lumen, DLSS)', icon: <MonitorPlay size={20} />, activeColor: 'text-[#ff7b72]', category: '⚙️ ENGINE CORE' },
      { id: 'PhysicsEngine', title: 'Universal Physics Dynamics', icon: <Orbit size={20} />, activeColor: 'text-[#f85149]', category: '⚙️ ENGINE CORE' },
      { id: 'InputMapping', title: 'Input & Controller Mapping', icon: <Gamepad2 size={20} />, activeColor: 'text-[#58a6ff]', category: '⚙️ ENGINE CORE' },
      { id: 'AnimationAudio', title: 'Skeletal Anim, MoCap & Audio', icon: <Activity size={20} />, activeColor: 'text-[#e3b341]', category: '🏃 ANIMATION' },
      { id: 'BackendCloud', title: 'Server, Cloud, Sync & Economy', icon: <Cloud size={20} />, activeColor: 'text-[#bc8cff]', category: '☁️ BACKEND & NETWORKING' },
      { id: 'ServerSim', title: 'Multiplayer Backend & Server Simulation', icon: <Server size={20} />, activeColor: 'text-[#3fb950]', category: '☁️ BACKEND & NETWORKING' },
      { id: 'AITestingQA', title: 'AI Offline QA, Perf Metric & Debug', icon: <ShieldCheck size={20} />, activeColor: 'text-[#2ea043]', category: '🐛 QA & DEBUGGING' },
      { id: 'WorldBible', title: 'World Bible (Lore & Setup)', icon: <BookOpen size={20} />, activeColor: 'text-[#d2a8ff]', category: '🎮 GAME DESIGN' },
      { id: 'GameSystems', title: 'AAA Game Systems Architecture', icon: <Blocks size={20} />, activeColor: 'text-[#58a6ff]', category: '⚙️ ENGINE CORE' },
      { id: 'ScriptEditor', title: 'IDE & Script Editor', icon: <TerminalSquare size={20} />, activeColor: 'text-[#ff7b72]', category: '🤖 IDE & CODE' },
      { id: 'AssetPipeline', title: 'Asset Pipeline & Source Control', icon: <FolderTree size={20} />, activeColor: 'text-[#3fb950]', category: '☁️ BACKEND & NETWORKING' },
      { id: 'BuildPublish', title: 'One-Click Build & Pipeline', icon: <Globe2 size={20} />, activeColor: 'text-[#3fb950]', category: '⚙️ DEVOPS' },
      { id: 'MapEdit', title: 'Apex Map Builder', icon: <Map size={20} />, activeColor: 'text-[#58a6ff]', category: '🌍 WORLD BUILDING' },
      { id: 'NPCEdit', title: 'Deep NPC Builder', icon: <Users size={20} />, activeColor: 'text-[#ff7b72]', category: '🎮 GAME DESIGN' },
      { id: 'MonsterEdit', title: 'Monster & Entities Builder', icon: <Ghost size={20} />, activeColor: 'text-[#e3b341]', category: '🎮 GAME DESIGN' },
      { id: 'Modeling', title: 'Apex 3D/2D Modeling Studio', icon: <Box size={20} />, activeColor: 'text-[#e3b341]', category: '🎨 ART & ASSETS' },
      { id: 'Landscape', title: 'Apex Terrain Editor', icon: <Mountain size={20} />, activeColor: 'text-[#3fb950]', category: '🌍 WORLD BUILDING' },
      { id: 'PCG', title: 'Procedural Content Generation', icon: <Workflow size={20} />, activeColor: 'text-[#ff7b72]', category: '🌍 WORLD BUILDING' },
      { id: 'ControlRig', title: 'Control Rig & MoCap', icon: <PersonStanding size={20} />, activeColor: 'text-[#ff7b72]', category: '🏃 ANIMATION' },
      { id: 'Sequencer', title: 'Apex Timeline Sequencer', icon: <Clapperboard size={20} />, activeColor: 'text-[#bc8cff]', category: '🎬 CINEMATICS' },
      { id: 'MetaHuman', title: 'MetaHuman System', icon: <UserSquare size={20} />, activeColor: 'text-[#58a6ff]', category: '🎨 ART & ASSETS' },
      { id: 'Blueprint', title: 'Visual Scripting (Kismet)', icon: <Waypoints size={20} />, activeColor: 'text-[#3fb950]', category: '🤖 IDE & CODE' },
      { id: 'BlueprintGen', title: 'Blueprint AI Generator', icon: <Network size={20} />, activeColor: 'text-[#bc8cff]', category: '🤖 IDE & CODE' },
      { id: 'LogicVisual', title: 'Event Sheet Logic (GDevelop/Code.org)', icon: <Puzzle size={20} />, activeColor: 'text-[#3fb950]', category: '🤖 IDE & CODE' },
      { id: 'BehaviorTree', title: 'AI Behavior Tree Editor', icon: <Network size={20} />, activeColor: 'text-[#e3b341]', category: '🤖 IDE & CODE' },
      { id: 'DataTable', title: 'Data Table & Spreadsheets', icon: <Database size={20} />, activeColor: 'text-[#3fb950]', category: '🎮 GAME DESIGN' },
      { id: 'AssetStore', title: 'Marketplace & Asset Store', icon: <ShoppingCart size={20} />, activeColor: 'text-[#bc8cff]', category: '☁️ BACKEND & NETWORKING' },
      { id: 'StoryGraph', title: 'Story & Narrative Graph', icon: <MessageSquare size={20} />, activeColor: 'text-[#ff7b72]', category: '🎮 GAME DESIGN' },
      { id: 'Material', title: 'Node Material Editor', icon: <Palette size={20} />, activeColor: 'text-[#e3b341]', category: '🎨 ART & ASSETS' },
      { id: 'Niagara', title: 'Niagara Particle FX', icon: <Sparkles size={20} />, activeColor: 'text-[#bc8cff]', category: '✨ VFX & PARTICLES' },
      { id: 'MetaSound', title: 'Audio Mixer', icon: <Music size={20} />, activeColor: 'text-[#e3b341]', category: '🎵 AUDIO & SOUND' },
      { id: 'ImageEdit', title: 'Image & Texture Editor', icon: <Image size={20} />, activeColor: 'text-[#bc8cff]', category: '🎨 ART & ASSETS' },
      { id: 'AudioEdit', title: 'Audio Studio & SFX', icon: <AudioWaveform size={20} />, activeColor: 'text-[#3fb950]', category: '🎵 AUDIO & SOUND' },
      { id: 'EffectEdit', title: 'VFX & Hitbox Studio', icon: <Flame size={20} />, activeColor: 'text-[#ff7b72]', category: '✨ VFX & PARTICLES' },
      { id: 'OfflineVFX', title: 'Offline AI VFX Gen & Editor', icon: <Wand2 size={20} />, activeColor: 'text-[#e3b341]', category: '✨ VFX & PARTICLES' },
      { id: 'UIUXEdit', title: 'Apex UI/UX Builder', icon: <LayoutDashboard size={20} />, activeColor: 'text-[#58a6ff]', category: '📐 UI & UX' },
      { id: 'PhysicsSimulation', title: 'Chaos Physics & Simulation Studio', icon: <Activity size={20} />, activeColor: 'text-[#e3b341]', category: '⚙️ ENGINE CORE' },
      { id: 'SkillForge', title: 'Ultimate Skill Forge', icon: <Swords size={20} />, activeColor: 'text-[#ff7b72]', category: '🎮 GAME DESIGN' },
      
      { id: 'AIBrowser', title: 'AI Sandbox Browser Node', icon: <Globe size={20} />, activeColor: 'text-[#f85149]', category: '🤖 IDE & CODE' },
      { id: 'LocalAI', title: 'Local AI Compute Studio', icon: <BrainCircuit size={20} />, activeColor: 'text-[#e3b341]', category: '🤖 IDE & CODE' },
      { id: 'WorldBuilder', title: '🌍 Nano-to-Macro World Builder', icon: <Globe size={20} />, activeColor: 'text-[#3fb950]', category: '🌍 WORLD BUILDING' },
      { id: 'SentientAI', title: '🧠 Sentient AI & NPCDirector', icon: <Brain size={20} />, activeColor: 'text-[#f85149]', category: '🤖 IDE & CODE' },
      { id: 'ProceduralAsset', title: '🎬 Procedural Asset Studio', icon: <FlaskConical size={20} />, activeColor: 'text-[#bc8cff]', category: '🎨 ART & ASSETS' },
      { id: 'DevOpsManager', title: '🛡️ System Architecture & DevOps Manager', icon: <Server size={20} />, activeColor: 'text-[#58a6ff]', category: '⚙️ DEVOPS' },
      { id: 'LevelDesign', title: 'Level Assembly (Blockout & ProBuilder)', icon: <Mountain size={20} />, activeColor: 'text-[#e3b341]', category: '🌍 WORLD BUILDING' },
      { id: 'DialogueQuest', title: 'RPG Maker Quest & Dialogue Systems', icon: <BookOpen size={20} />, activeColor: 'text-[#bc8cff]', category: '🎮 GAME DESIGN' },
      { id: 'PerformanceProfile', title: 'AAA Perf Profiler & Deep Bug Hunter', icon: <Bug size={20} />, activeColor: 'text-[#f85149]', category: '🐛 QA & DEBUGGING' },
      { id: 'AnimGraph', title: 'Cascadeur Animation & Deep IK', icon: <PersonStanding size={20} />, activeColor: 'text-[#e3b341]', category: '🏃 ANIMATION' },
      { id: 'CharacterAnimator', title: 'AI Character Animator', icon: <PersonStanding size={20} />, activeColor: 'text-[#3fb950]', category: '🏃 ANIMATION' },
      { id: 'ProceduralGen', title: 'Houdini-Style PCG World Gen', icon: <Layers size={20} />, activeColor: 'text-[#3fb950]', category: '🌍 WORLD BUILDING' },
      { id: 'Netcode', title: 'Rollback Multiplayer & Servers', icon: <Globe size={20} />, activeColor: 'text-[#58a6ff]', category: '☁️ BACKEND & NETWORKING' },
      { id: 'LiveOps', title: 'LiveOps, Analytics & Economy', icon: <TrendingUp size={20} />, activeColor: 'text-[#bc8cff]', category: '☁️ BACKEND & NETWORKING' },
      { id: 'CinematicSequencer', title: 'Timeline & Cinematic Sequencer', icon: <Clapperboard size={20} />, activeColor: 'text-[#58a6ff]', category: '🎬 CINEMATICS' },
      { id: 'ActionRecorder', title: 'Manual Action & Sequence Recorder', icon: <Video size={20} />, activeColor: 'text-[#e3b341]', category: '🎬 CINEMATICS' },
      { id: 'ActionGraph', title: 'Action Graph Editor', icon: <GitBranch size={20} />, activeColor: 'text-[#bc8cff]', category: '🤖 IDE & CODE' },
      { id: 'WorkflowDAG', title: 'Workflow DAG Editor', icon: <Network size={20} />, activeColor: 'text-[#58a6ff]', category: '🤖 IDE & CODE' },
      { id: 'AdvancedNavMesh', title: 'NavMesh & Crowd AI', icon: <Users size={20} />, activeColor: 'text-[#e3b341]', category: '🤖 IDE & CODE' },
      { id: 'Photogrammetry', title: '3D Photogrammetry Scanner', icon: <Camera size={20} />, activeColor: 'text-[#3fb950]', category: '🎨 ART & ASSETS' },
      { id: 'HardwareDriver', title: 'Device Driver & HW Config', icon: <Activity size={20} />, activeColor: 'text-[#58a6ff]', category: '⚙️ DEVOPS' },
      { id: 'Offline3DModeler', title: 'Offline 3D Modeler & Sculptor', icon: <Box size={20} />, activeColor: 'text-[#bc8cff]', category: '🎨 ART & ASSETS' },
      { id: 'AdvancedTerrain', title: 'Advanced Terrain & Biomes', icon: <Mountain size={20} />, activeColor: 'text-[#3fb950]', category: '🌍 WORLD BUILDING' },
      { id: 'AudioDAW', title: 'Digital Audio Workstation', icon: <AudioWaveform size={20} />, activeColor: 'text-[#ff7b72]', category: '🎵 AUDIO & SOUND' },
      { id: 'AdvancedImage', title: 'Advanced Image / Raster Forge', icon: <Image size={20} />, activeColor: 'text-[#0070d2]', category: '🎨 ART & ASSETS' },
      { id: 'AdvancedMap', title: 'Tiled World Engineer', icon: <Map size={20} />, activeColor: 'text-[#8b5a2b]', category: '🌍 WORLD BUILDING' },
      { id: 'UltimateMapBuilder', title: 'Ultimate Map Game Builder', icon: <Globe size={20} />, activeColor: 'text-[#3fb950]', category: '🌍 WORLD BUILDING' },
      { id: 'MegaWorldArchitect', title: 'Mega World Architect Studio', icon: <Layers size={20} />, activeColor: 'text-[#3fb950]', category: '🌍 WORLD BUILDING' },
      { id: 'RiggingAnim', title: 'Kinematics & Skeletal Animation', icon: <PersonStanding size={20} />, activeColor: 'text-[#fb8500]', category: '🏃 ANIMATION' },
      { id: 'VFXGraph', title: 'HyperVFX Particle Graph', icon: <Flame size={20} />, activeColor: 'text-[#fb8500]', category: '✨ VFX & PARTICLES' },
      { id: 'BlueprintExecution', title: 'Blueprint Execution Visualizer', icon: <Activity size={20} />, activeColor: 'text-[#bc8cff]', category: '🐛 QA & DEBUGGING' },
      { id: 'CinematicDirector', title: 'Cinematic Master Sequencer', icon: <Film size={20} />, activeColor: 'text-[#bc8cff]', category: '🎬 CINEMATICS' },
      { id: 'EngineProfiler', title: 'Engine Performance Profiler', icon: <Activity size={20} />, activeColor: 'text-red-500', category: '🐛 QA & DEBUGGING' },
      { id: 'HD2DHybridEditor', title: '2.5D / HD-2D Hybrid Engine', icon: <Layers size={20} />, activeColor: 'text-[#3fb950]', category: '⚙️ ENGINE CORE' },
      { id: 'VoxelEngine', title: 'Voxel & Destruction Engine', icon: <Box size={20} />, activeColor: 'text-[#f85149]', category: '⚙️ ENGINE CORE' },
      { id: 'VehiclePhysics', title: 'Vehicle Dynamics Configurator', icon: <Activity size={20} />, activeColor: 'text-[#e3b341]', category: '⚙️ ENGINE CORE' },
      { id: 'MLAgents', title: 'Machine Learning Training Room', icon: <BrainCircuit size={20} />, activeColor: 'text-[#3fb950]', category: '🤖 IDE & CODE' },
      { id: 'VRXREngine', title: 'OpenXR VR/MR Development Hub', icon: <Glasses size={20} />, activeColor: 'text-[#bc8cff]', category: '⚙️ ENGINE CORE' },
      { id: 'BatchAI', title: 'Batch AI Asset Generator', icon: <Cloud size={20} />, activeColor: 'text-[#e3b341]', category: '🎨 ART & ASSETS' },
      { id: 'DevOpsBuilder', title: 'Cross-Platform Matrix & DevOps Config', icon: <Terminal size={20} />, activeColor: 'text-[#58a6ff]', category: '⚙️ DEVOPS' },
      { id: 'ASTNodeWeaver', title: 'AST Logic Weaver (Nodes)', icon: <Workflow size={20} />, activeColor: 'text-[#ff7b72]', category: '🤖 IDE & CODE' },
      { id: 'OptimizationOverview', title: 'Optimization Overview', icon: <Activity size={20} />, activeColor: 'text-[#3fb950]', category: '🐛 QA & DEBUGGING' },
      
      // Massive Non-AI tool additions
      { id: 'NetworkDebugger', title: 'Network Packet Sniffer', icon: <Wifi size={20} />, activeColor: 'text-[#e3b341]', category: '☁️ BACKEND & NETWORKING' },
      { id: 'DatabaseExplorer', title: 'SQL & NoSQL Explorer', icon: <Database size={20} />, activeColor: 'text-[#58a6ff]', category: '☁️ BACKEND & NETWORKING' },
      { id: 'KernelDebugger', title: 'Kernel Panic Analyzer', icon: <Microchip size={20} />, activeColor: 'text-[#f85149]', category: '🐛 QA & DEBUGGING' },
      { id: 'MemoryProfiler', title: 'Heap & Memory Profiler', icon: <MemoryStick size={20} />, activeColor: 'text-[#bc8cff]', category: '🐛 QA & DEBUGGING' },
      { id: 'AudioDSP', title: 'Digital Signal Processing (Audio)', icon: <Mic2 size={20} />, activeColor: 'text-[#3fb950]', category: '🎵 AUDIO & SOUND' },
      { id: 'VideoEncoder', title: 'FFmpeg Video Pipeline', icon: <Video size={20} />, activeColor: 'text-[#e3b341]', category: '🎬 CINEMATICS' },
      { id: 'VCSConflict', title: 'Git Conflict Resolver', icon: <GitMerge size={20} />, activeColor: 'text-[#f85149]', category: '⚙️ DEVOPS' },
      { id: 'HexEditor', title: 'Raw Hex/Binary Editor', icon: <Binary size={20} />, activeColor: 'text-[#bc8cff]', category: '🤖 IDE & CODE' },
      { id: 'EncryptionTool', title: 'Encryption & Crypto Suite', icon: <Shield size={20} />, activeColor: 'text-[#58a6ff]', category: '☁️ BACKEND & NETWORKING' },
      { id: 'CertManager', title: 'Key & Certificate Manager', icon: <Key size={20} />, activeColor: 'text-[#e3b341]', category: '☁️ BACKEND & NETWORKING' },
      { id: 'HardwareConfig', title: 'Hardware I/O Configurator', icon: <Wrench size={20} />, activeColor: 'text-[#3fb950]', category: '⚙️ DEVOPS' },
      { id: 'TerminalSvr', title: 'Secure Shell (SSH) Client', icon: <Terminal size={20} />, activeColor: 'text-[#58a6ff]', category: '⚙️ DEVOPS' },
      { id: 'RegexTester', title: 'Advanced Regex Engine', icon: <SearchCode size={20} />, activeColor: 'text-[#bc8cff]', category: '🤖 IDE & CODE' },
      { id: 'DiffTool', title: 'Advanced File Diffs', icon: <SplitSquareHorizontal size={20} />, activeColor: 'text-[#f85149]', category: '🤖 IDE & CODE' },
      { id: 'ApiTester', title: 'REST & GraphQL API Tester', icon: <Globe size={20} />, activeColor: 'text-[#58a6ff]', category: '☁️ BACKEND & NETWORKING' },
      { id: 'SystemTap', title: 'SystemTap & DTrace', icon: <Activity size={20} />, activeColor: 'text-[#e3b341]', category: '🐛 QA & DEBUGGING' },
      { id: 'HexInjector', title: 'Hex Injector / Patch Tool', icon: <Cpu size={20} />, activeColor: 'text-[#ff7b72]', category: '🐛 QA & DEBUGGING' },
      { id: 'FontEditor', title: 'TrueType/OpenType Editor', icon: <AlignLeft size={20} />, activeColor: 'text-[#bc8cff]', category: '📐 UI & UX' },
      { id: 'LocalDB', title: 'SQLite / IndexedDB Studio', icon: <Database size={20} />, activeColor: 'text-[#3fb950]', category: '☁️ BACKEND & NETWORKING' },
      { id: 'DockerManager', title: 'Container & Image Builder', icon: <Box size={20} />, activeColor: 'text-[#58a6ff]', category: '⚙️ DEVOPS' },
      { id: 'BuildMonitor', title: 'Jenkins / CI Monitor', icon: <Activity size={20} />, activeColor: 'text-[#f85149]', category: '⚙️ DEVOPS' },
      { id: 'AppProfiler', title: 'Strace & Ltrace Viewer', icon: <Search size={20} />, activeColor: 'text-[#e3b341]', category: '🐛 QA & DEBUGGING' },
      { id: 'CompilerTool', title: 'GCC/LLVM Flag Optimizer', icon: <Wrench size={20} />, activeColor: 'text-[#bc8cff]', category: '⚙️ DEVOPS' },
      { id: 'LogViewer', title: 'Massive System Log Viewer', icon: <AlignLeft size={20} />, activeColor: 'text-[#3fb950]', category: '🐛 QA & DEBUGGING' },
      
      // The Ultimate Complete Game Studio Additions (100% Comprehensive Request)
      { id: 'MotionCapture', title: 'Real-time Facial & Body MoCap Studio', icon: <Camera size={20} />, activeColor: 'text-[#ff7b72]', category: '🏃 ANIMATION' },
      { id: 'SculptMaster', title: 'Topological Sculpting (ZBrush Eq)', icon: <Box size={20} />, activeColor: 'text-[#58a6ff]', category: '🎨 ART & ASSETS' },
      { id: 'UVRetopology', title: 'Auto-UV Unwrapper & Retopology', icon: <Crosshair size={20} />, activeColor: 'text-[#e3b341]', category: '🎨 ART & ASSETS' },
      { id: 'AITextureSynthesizer', title: 'AI PBR Texture Synthesizer', icon: <Image size={20} />, activeColor: 'text-[#bc8cff]', category: '🎨 ART & ASSETS' },
      { id: 'TextureBaker', title: 'PBR Material Node & Texture Baker', icon: <Combine size={20} />, activeColor: 'text-[#bc8cff]', category: '🎨 ART & ASSETS' },
      { id: 'VectorHybrid', title: 'Raster/Vector Hybrid Graph', icon: <Image size={20} />, activeColor: 'text-[#3fb950]', category: '🎨 ART & ASSETS' },
      { id: 'SpriteSheetGen', title: '2D SpriteSheet AI Interpolation', icon: <MonitorPlay size={20} />, activeColor: 'text-[#ff7b72]', category: '🎨 ART & ASSETS' },
      { id: 'VoiceDubbingStudio', title: 'AI Voice Actor & Lip-Sync Automator', icon: <Mic size={20} />, activeColor: 'text-[#ff7b72]', category: '🎵 AUDIO & SOUND' },
      { id: 'DynamicOSTComposer', title: 'Procedural Midi Orchestrator', icon: <Music size={20} />, activeColor: 'text-[#bc8cff]', category: '🎵 AUDIO & SOUND' },
      { id: 'LipSyncAutomator', title: 'Phoneme Blendshape Extractor', icon: <Smile size={20} />, activeColor: 'text-[#58a6ff]', category: '🏃 ANIMATION' },
      { id: 'EyeTrackingHeatmap', title: 'Eye-Tracking & Heatmap QA', icon: <Eye size={20} />, activeColor: 'text-[#3fb950]', category: '📐 UI & UX' },
      { id: 'UXCognitiveLoadSim', title: 'UX Cognitive Load Simulator', icon: <Brain size={20} />, activeColor: 'text-[#bc8cff]', category: '📐 UI & UX' },
      { id: 'TelemetryAnalytics', title: 'Player Telemetry & Heatmap Analytics', icon: <Activity size={20} />, activeColor: 'text-[#e3b341]', category: '☁️ BACKEND & NETWORKING' },
      { id: 'LocDB', title: 'I18n Localization & Subtitles DB', icon: <BookOpen size={20} />, activeColor: 'text-[#58a6ff]', category: '🎮 GAME DESIGN' },
      { id: 'RelayServer', title: 'Matchmaking & Relay Server Arch', icon: <Server size={20} />, activeColor: 'text-[#bc8cff]', category: '☁️ BACKEND & NETWORKING' },
      { id: 'AntiCheat', title: 'Kernel Anti-Cheat Secure Gateway', icon: <Shield size={20} />, activeColor: 'text-[#f85149]', category: '☁️ BACKEND & NETWORKING' },
      { id: 'EconomySimulator', title: 'Monetization & Auction House Sim', icon: <TrendingUp size={20} />, activeColor: 'text-[#e3b341]', category: '🎮 GAME DESIGN' },
      { id: 'RenderPipeline', title: 'Scriptable Render Pipeline Architect', icon: <MonitorPlay size={20} />, activeColor: 'text-[#3fb950]', category: '⚙️ ENGINE CORE' },
      { id: 'FigmaClone', title: 'Ultimate UI/UX Figma-like Canvas', icon: <LayoutDashboard size={20} />, activeColor: 'text-[#bc8cff]', category: '📐 UI & UX' },
      { id: 'InteractionPrototyper', title: 'UI Animations & State Keyframer', icon: <Layers size={20} />, activeColor: 'text-[#ff7b72]', category: '📐 UI & UX' },
      { id: 'AccessibilityTester', title: 'UX Contrast & Colorblindness QA', icon: <Eye size={20} />, activeColor: 'text-[#e3b341]', category: '📐 UI & UX' },
      { id: 'CloudBuildPipeline', title: 'Cross-form CI/CD Build Farm', icon: <Cloud size={20} />, activeColor: 'text-[#58a6ff]', category: '⚙️ DEVOPS' },
      { id: 'ModdingPublisher', title: 'Modding API & Workshop Publisher', icon: <Globe size={20} />, activeColor: 'text-[#bc8cff]', category: '☁️ BACKEND & NETWORKING' },
    ];

    const filteredTools = toolSearch 
      ? tools.filter(t => t.title.toLowerCase().includes(toolSearch.toLowerCase()) || t.id.toLowerCase().includes(toolSearch.toLowerCase()) || t.category.toLowerCase().includes(toolSearch.toLowerCase())) 
      : tools;

    // Grouping tools by category
    const groupedTools = filteredTools.reduce((acc, tool) => {
        if (!acc[tool.category]) {
            acc[tool.category] = [];
        }
        acc[tool.category].push(tool);
        return acc;
    }, {} as Record<string, typeof tools>);

    return (
      <div 
         className={`bg-[#101012] border-r border-[#000] hidden md:flex flex-col items-center py-2 shrink-0 justify-between overflow-y-auto custom-scrollbar shadow-[2px_0_10px_rgba(0,0,0,0.5)] z-10 relative transition-all duration-300 ease-out ${isSidebarHovered || toolSearch ? 'w-[280px] px-2 items-stretch' : 'w-[42px]'}`}
         onMouseEnter={() => setIsSidebarHovered(true)}
         onMouseLeave={() => { setIsSidebarHovered(false); if (!toolSearch) setToolSearch(''); }}
      >
        <div className={`flex flex-col gap-1 w-full ${isSidebarHovered || toolSearch ? 'items-stretch' : 'items-center'}`}>
          
          {/* Real-time Search Filter */}
          <div className={`w-full overflow-hidden transition-all duration-300 ease-out ${isSidebarHovered || toolSearch ? 'h-[30px] opacity-100 mb-2' : 'h-0 opacity-0 mb-0'}`}>
             <div className="relative h-full text-[#888]">
                 <Search size={12} className="absolute left-2 top-1/2 -translate-y-[50%]" />
                 <input 
                    type="text" 
                    value={toolSearch}
                    onChange={(e) => setToolSearch(e.target.value)}
                    placeholder="Filter Tools, Domains, Modules..."
                    className="w-full h-full bg-[#1c1c1f] rounded border border-[#333] pl-6 pr-2 text-[#eee] font-medium text-[11px] outline-none focus:border-[#58a6ff] transition-colors"
                 />
                 {toolSearch && (
                    <button className="absolute right-2 top-1/2 -translate-y-[50%] hover:text-[#fff]" onClick={() => setToolSearch('')}><X size={10} /></button>
                 )}
             </div>
          </div>

          <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar pb-10">
             {(() => {
                // If not hovered, display the flat vertical list of icons (first 15 icons to prevent massive scroll without tooltips visible)
                if (!isSidebarHovered && !toolSearch) {
                  return tools.slice(0, 18).map(t => (
                    <button 
                      key={t.id}
                      onClick={() => setActiveTool(t.id)}
                      className={`p-1.5 rounded-[2px] transition-all relative group flex items-center justify-center h-[34px] w-[34px] ${activeTool === t.id ? `bg-[#242428] ${t.activeColor}` : 'text-[#888] hover:bg-[#202022] hover:text-[#fff]'}`}
                    >
                      {activeTool === t.id && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-[20px] bg-[#58a6ff] rounded-r-[1px]"></div>
                      )}
                      {React.cloneElement(t.icon, { size: 18, className: "shrink-0" })}
                      <div className="absolute left-10 opacity-0 group-hover:opacity-100 bg-[#0a0a0a] text-white text-[10px] whitespace-nowrap px-2 py-1 rounded-[2px] pointer-events-none transition-opacity ml-2 z-50 shadow-md border border-[#222]">
                        {t.title}
                      </div>
                    </button>
                  ));
                }

                // Hovered: Show beautifully categorized groups
                return Object.entries(groupedTools).map(([category, catTools]) => {
                  if (catTools.length === 0) return null;
                  return (
                     <div key={category} className="mb-3">
                        <div className="text-[10px] font-black tracking-widest text-[#555] uppercase mb-1 px-2 pb-1 border-b border-[#222]">{category}</div>
                        <div className="flex flex-col">
                           {catTools.map(t => (
                             <button 
                               key={t.id}
                               onClick={() => setActiveTool(t.id)}
                               className={`px-2 py-1.5 rounded-[2px] transition-all relative flex items-center justify-start gap-2 h-[34px] w-full
                                 ${activeTool === t.id ? `bg-[#202022] ${t.activeColor} shadow-[inset_2px_0_0_currentColor]` : 'text-[#888] hover:bg-[#1a1a1c] hover:text-[#ccc]'}`}
                             >
                               {React.cloneElement(t.icon, { size: 16, className: "shrink-0 opacity-80" })}
                               <span className="text-[11px] truncate whitespace-nowrap opacity-100 transition-opacity font-medium">
                                  {t.title}
                               </span>
                             </button>
                           ))}
                        </div>
                     </div>
                  );
                });
             })()}
             {filteredTools.length === 0 && (
                 <div className="text-[#888] text-[10px] text-center p-2 mt-4 italic bg-[#111] rounded border border-[#222]">No highly-specialized module found. Omni Creator handles 5,000+ domains. Search again.</div>
             )}
          </div>
        </div>
        <div className="flex flex-col gap-1 items-center w-full mb-2 shrink-0 bg-[#101012] pt-2 z-20">
           <button 
             onClick={() => setShowSettingsModal(true)}
             title="Engine Preferences & AI Cluster"
             className={`p-1.5 h-[34px] flex items-center rounded-[2px] text-[#888] hover:text-[#fff] hover:bg-[#202022] transition-colors
                ${isSidebarHovered || toolSearch ? 'w-full justify-start px-2 gap-2' : 'justify-center w-[34px]'}`}
           >
             <Settings size={18} className="shrink-0" />
             {(isSidebarHovered || toolSearch) && <span className="text-[11px]">Preferences & AI Cluster</span>}
           </button>
        </div>
      </div>
    );
  };

  const renderSidebar = () => {
    // Determine the title of the sidebar depending on the global active tool
    const isCodeIDE = activeTool === 'Select';
    
    return (
      <aside className={`w-full h-full bg-[#151515] border-r border-[#000] flex-col shrink-0 ${mobileView === 'explorer' ? 'flex' : 'hidden'} md:flex`}>
        {isCodeIDE ? (
          <div className="flex bg-[#101012] shrink-0 h-[28px] items-center px-1 overflow-x-auto custom-scrollbar border-b border-[#222]">
            <button 
              onClick={() => setLeftPanel('explorer')}
              className={`px-3 h-full text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors rounded-none shrink-0 ${leftPanel === 'explorer' ? 'text-[#fff] bg-[#222] border-t-2 border-[#58a6ff]' : 'text-[#b0b5bd] hover:text-[#fff]'}`}
            >
              <FolderTree size={12} /> {t('sidebar.explorer')}
            </button>
            <button 
              onClick={() => setLeftPanel('debug')}
              className={`px-3 h-full text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors rounded-none shrink-0 ${leftPanel === 'debug' ? 'text-[#fff] bg-[#222] border-t-2 border-[#58a6ff]' : 'text-[#b0b5bd] hover:text-[#fff]'}`}
            >
              <Bug size={12} /> DEBUG
            </button>
            <button 
              onClick={() => setLeftPanel('git')}
              className={`px-3 h-full text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors rounded-none shrink-0 ${leftPanel === 'git' ? 'text-[#fff] bg-[#222] border-t-2 border-[#58a6ff]' : 'text-[#b0b5bd] hover:text-[#fff]'}`}
            >
              <GitBranch size={12} /> SOURCE
            </button>
            <button 
              onClick={() => setLeftPanel('test')}
              className={`px-3 h-full text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors rounded-none shrink-0 ${leftPanel === 'test' ? 'text-[#fff] bg-[#222] border-t-2 border-[#58a6ff]' : 'text-[#b0b5bd] hover:text-[#fff]'}`}
            >
              <FlaskConical size={12} /> TEST
            </button>
            <button 
              onClick={() => setLeftPanel('extensions')}
              className={`px-3 h-full text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors rounded-none shrink-0 ${leftPanel === 'extensions' ? 'text-[#fff] bg-[#222] border-t-2 border-[#58a6ff]' : 'text-[#b0b5bd] hover:text-[#fff]'}`}
            >
              <Puzzle size={12} /> EXT
            </button>
          </div>
        ) : (
          <div className="flex bg-[#101012] shrink-0 h-[28px] items-center px-1 border-b border-[#222]">
            <button 
              onClick={() => setLeftPanel('explorer')}
              className={`px-3 h-full text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors rounded-none ${leftPanel === 'explorer' ? 'text-[#fff] bg-[#222] border-t-2 border-[#58a6ff]' : 'text-[#b0b5bd] hover:text-[#fff]'}`}
            >
              <UserSquare size={12} /> ACTORS
            </button>
            <button 
              onClick={() => setLeftPanel('outliner')}
              className={`px-3 h-full text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors rounded-none ${leftPanel === 'outliner' ? 'text-[#fff] bg-[#222] border-t-2 border-[#58a6ff]' : 'text-[#b0b5bd] hover:text-[#fff]'}`}
            >
              <Box size={12} /> WORLD
            </button>
            <button 
              onClick={() => setLeftPanel('git')}
              className={`px-3 h-full text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors rounded-none ${leftPanel === 'git' ? 'text-[#fff] bg-[#222] border-t-2 border-[#58a6ff]' : 'text-[#b0b5bd] hover:text-[#fff]'}`}
            >
              <FolderTree size={12} /> PROJECT
            </button>
          </div>
        )}
        
        {leftPanel === 'explorer' ? (
          <div className="flex-1 overflow-y-auto flex flex-col custom-scrollbar">
            {isCodeIDE ? (
              <div className="flex-1 overflow-y-auto pt-2 pb-4 md:pb-0 px-2">
                <div className="uppercase text-[10px] text-[#888] font-bold tracking-wider px-2 mb-2 flex items-center justify-between">
                  PROJECT FILES
                  <div className="flex gap-1">
                    <FileCode2 size={12} className="cursor-pointer hover:text-[#fff]" />
                    <FolderTree size={12} className="cursor-pointer hover:text-[#fff]" />
                  </div>
                </div>
                {DEFAULT_FOLDERS.map(folder => (
                  <div key={folder} className="px-2 py-1.5 md:py-1 text-[14px] md:text-[12px] text-[#888] flex flex-col group">
                    <div className="flex items-center gap-2 font-bold cursor-pointer hover:bg-[#222] py-0.5 px-1 rounded transition-colors">
                      <ChevronDown size={12} className="text-[#888]" />
                      <FolderTree size={12} className="text-[#e3b341]" />
                      <span className="group-hover:text-[#fff] transition-colors flex-1">{folder.split('/').pop()}</span>
                    </div>
                    {files.filter(f => f.folder?.startsWith(folder)).map(f => (
                      <div 
                        key={f.id}
                        onClick={() => { setActiveFileId(f.id); setMobileView('editor'); }}
                        className={`ml-5 pl-2 py-1.5 md:py-1 text-[13px] md:text-[12px] cursor-pointer flex items-center mt-0.5 truncate transition-colors border-l border-[#333]
                          ${f.id === activeFileId ? 'text-[#fff] bg-[#222] rounded-r-sm shadow-[inset_2px_0_0_#58a6ff]' : 'text-[#888] hover:text-[#fff] hover:bg-[#1a1a1a]'}
                        `}
                      >
                          <FileCode2 size={12} className="mr-1.5 text-[#58a6ff]" /> {f.name}
                      </div>
                    ))}
                  </div>
                ))}
                
                <div className="mt-4 md:mt-2 text-[12px] md:text-[11px] uppercase tracking-[1px] text-[#888] px-2 py-2 border-t border-[#222] font-semibold">Base Content</div>
                {files.filter(f => !f.folder || f.folder === '').map(f => (
                  <div 
                    key={f.id}
                    onClick={() => { setActiveFileId(f.id); setMobileView('editor'); }}
                    className={`px-3 py-1.5 md:py-1 text-[14px] md:text-[12px] cursor-pointer flex items-center transition-colors rounded-sm ${
                      f.id === activeFileId 
                        ? 'bg-[#222] text-[#fff] shadow-[inset_2px_0_0_#58a6ff]' 
                        : 'text-[#888] hover:text-[#fff] hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <FileCode2 size={12} className="mr-1.5 text-[#58a6ff]" /> {f.name}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="flex bg-[#0a0a0a] px-2 py-1.5 border-b border-[#222]">
                  <div className="flex items-center bg-[#111] border border-[#333] w-full rounded px-2">
                     <Search size={12} className="text-[#888]"/>
                     <input type="text" placeholder="Search Actors" className="bg-transparent border-none outline-none text-[#ccc] text-[11px] px-2 py-1 w-full" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto pt-2 pb-4 md:pb-0">
                   <div className="text-[10px] uppercase font-bold text-[#888] px-3 pb-1">Basic</div>
                   <div className="px-3 py-1 text-[11px] text-[#ccc] flex items-center gap-2 hover:bg-[#222] cursor-pointer"><Box size={14} className="text-[#888]"/> Empty Actor</div>
                   <div className="px-3 py-1 text-[11px] text-[#ccc] flex items-center gap-2 hover:bg-[#222] cursor-pointer"><PersonStanding size={14} className="text-[#888]"/> Empty Character</div>
                   <div className="px-3 py-1 text-[11px] text-[#ccc] flex items-center gap-2 hover:bg-[#222] cursor-pointer"><PersonStanding size={14} className="text-[#888]"/> Empty Pawn</div>
                   <div className="px-3 py-1 text-[11px] text-[#ccc] flex items-center gap-2 hover:bg-[#222] cursor-pointer"><div className="w-3 h-3 rounded-full bg-[#f85149] blur-[2px]"></div> Point Light</div>
                   <div className="px-3 py-1 text-[11px] text-[#ccc] flex items-center gap-2 hover:bg-[#222] cursor-pointer"><div className="w-3 h-3 rounded-full bg-[#58a6ff] blur-[2px]"></div> Player Start</div>
                   <div className="px-3 py-1 text-[11px] text-[#ccc] flex items-center gap-2 hover:bg-[#222] cursor-pointer"><Box size={14} className="text-[#888]"/> Cube</div>
                   <div className="px-3 py-1 text-[11px] text-[#ccc] flex items-center gap-2 hover:bg-[#222] cursor-pointer"><div className="w-3 h-3 rounded-full bg-white opacity-40"></div> Sphere</div>
                   <div className="px-3 py-1 text-[11px] text-[#ccc] flex items-center gap-2 hover:bg-[#222] cursor-pointer"><div className="w-3 h-3 rounded bg-white opacity-40"></div> Cylinder</div>
                   <div className="px-3 py-1 text-[11px] text-[#ccc] flex items-center gap-2 hover:bg-[#222] cursor-pointer"><div className="w-3 h-3 clip-path-triangle bg-white opacity-40"></div> Cone</div>
                   <div className="px-3 py-1 text-[11px] text-[#ccc] flex items-center gap-2 hover:bg-[#222] cursor-pointer"><div className="w-3 h-1 bg-white opacity-40"></div> Plane</div>
                   <div className="px-3 py-1 text-[11px] text-[#ccc] flex items-center gap-2 hover:bg-[#222] cursor-pointer"><Box size={14} className="text-[#3fb950]"/> Box Trigger</div>
                </div>
              </>
            )}
          </div>
        ) : leftPanel === 'outliner' ? (
          <div className="flex-1 overflow-y-auto flex flex-col custom-scrollbar px-4 py-2">
             <div className="text-[12px] md:text-[11px] uppercase tracking-[1px] text-[#888] pb-2 border-b border-[#222] font-semibold mb-2">Scene Hierarchy</div>
             <div className="text-[12px] text-[#ccc] flex flex-col gap-1">
               <div className="pl-0 cursor-pointer hover:bg-[#222] py-1 flex items-center gap-1.5 rounded-sm px-1"><FolderTree size={12} className="text-[#e3b341]" /> <span>World.Map</span></div>
               
               <div className="pl-3 cursor-pointer hover:bg-[#222] py-1 flex items-center gap-1.5 rounded-sm px-1"><Box size={12} className="text-[#888]" /> <span>Directional Light</span></div>
               <div className="pl-3 cursor-pointer hover:bg-[#222] py-1 flex items-center gap-1.5 rounded-sm px-1"><Mountain size={12} className="text-[#888]" /> <span>Terrain Generation</span></div>
               
               <div className="pl-3 cursor-pointer hover:bg-[#222] py-1 flex items-center gap-1.5 rounded-sm px-1"><FolderTree size={12} className="text-[#e3b341]" /> <span>Player Start</span></div>
               <div className="pl-6 cursor-pointer bg-[#222] border border-[#333] text-[#58a6ff] py-1 flex items-center gap-1.5 rounded-sm px-1 shadow-[inset_0_0_10px_rgba(88,166,255,0.1)]"><PersonStanding size={12} className="text-[#58a6ff]" /> <span className="font-bold">ThirdPersonCharacter_BP</span></div>
               
               <div className="pl-3 cursor-pointer hover:bg-[#222] py-1 text-[#666] italic flex items-center gap-1.5 rounded-sm px-1"><Eye size={12} /> PostProcessVolume</div>
             </div>
          </div>
        ) : leftPanel === 'debug' ? (
          <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            <div className="px-3 py-2 border-b border-[#222] text-[#ccc] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                 <span className="font-bold text-[11px] uppercase tracking-wide">Run and Debug</span>
                 <div className="flex bg-[#222] rounded overflow-hidden">
                    <button className="px-2 py-1 hover:bg-[#333] text-[#3fb950]"><Play size={12} /></button>
                    <button className="px-2 py-1 hover:bg-[#333] text-[#888]"><Pause size={12} /></button>
                    <button className="px-2 py-1 hover:bg-[#333] text-[#58a6ff]"><RotateCw size={12} /></button>
                    <button className="px-2 py-1 hover:bg-[#333] text-[#f85149]"><Square size={12} /></button>
                 </div>
              </div>
              <div className="flex gap-1">
                 <button className="flex-1 bg-[#222] hover:bg-[#333] text-[10px] text-[#ccc] py-1 rounded border border-[#333]">Step Over (F10)</button>
                 <button className="flex-1 bg-[#222] hover:bg-[#333] text-[10px] text-[#ccc] py-1 rounded border border-[#333]">Step Into (F11)</button>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 p-2">
              {/* Context / Threads */}
              <div className="bg-[#111] border border-[#333] rounded overflow-hidden">
                <div className="bg-[#222] px-2 py-1 text-[10px] font-bold text-[#ccc] uppercase tracking-wider flex justify-between cursor-pointer border-b border-[#333]">
                  <span>THREADS</span> <ChevronDown size={12} />
                </div>
                <div className="p-2 text-[11px] flex flex-col gap-1 text-[#888]">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-white px-1">
                     <Play size={10} className="text-[#3fb950]"/> <span className="text-[#fff]">Main Thread (GameLoop)</span>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer hover:text-white px-1">
                     <Pause size={10} className="text-[#e3b341]"/> <span>Worker 1 (PhysicsWorker)</span>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer hover:text-white px-1">
                     <Pause size={10} className="text-[#e3b341]"/> <span>Worker 2 (AudioProcessor)</span>
                  </div>
                </div>
              </div>

              {/* Memory Profiler */}
              <div className="bg-[#111] border border-[#333] rounded overflow-hidden">
                <div className="bg-[#222] px-2 py-1 text-[10px] font-bold text-[#ccc] uppercase tracking-wider flex justify-between cursor-pointer border-b border-[#333]">
                  <span>MEMORY PROFILER</span> <ChevronDown size={12} />
                </div>
                <div className="p-2 text-[10px] flex flex-col gap-2 text-[#888]">
                   <div className="flex justify-between items-center text-[#ccc]">
                      <span>Heap Size</span>
                      <span className="text-[#e3b341]">245 MB / 1024 MB</span>
                   </div>
                   <div className="w-full h-2 bg-[#222] rounded overflow-hidden flex">
                      <div className="h-full bg-[#f85149]" style={{ width: '4%' }}></div>
                      <div className="h-full bg-[#3fb950]" style={{ width: '15%' }}></div>
                      <div className="h-full bg-[#58a6ff]" style={{ width: '5%' }}></div>
                   </div>
                   <div className="flex gap-2 text-[9px]">
                      <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-[#f85149]"></div> GC Roots</span>
                      <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-[#3fb950]"></div> Objects</span>
                      <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-[#58a6ff]"></div> Strings</span>
                   </div>
                   <button className="w-full bg-[#222] hover:bg-[#333] text-[#ccc] py-1 mt-1 border border-[#444] rounded text-center">Capture Snapshot</button>
                </div>
              </div>

              <div className="bg-[#111] border border-[#333] rounded overflow-hidden">
                <div className="bg-[#222] px-2 py-1 text-[10px] font-bold text-[#ccc] uppercase tracking-wider flex justify-between cursor-pointer">
                  <span>WATCHES</span> <Plus size={12} className="hover:text-white cursor-pointer" />
                </div>
                <div className="p-2 text-[11px] font-mono flex flex-col gap-1">
                  <div className="flex justify-between items-center group cursor-text">
                     <span className="text-[#58a6ff]">player.position</span>
                     <span className="text-[#ccc]">&#123; x: 120, y: 0, z: -45.5 &#125;</span>
                     <X size={10} className="hidden group-hover:block ml-1 cursor-pointer hover:text-white" />
                  </div>
                  <div className="flex justify-between items-center group cursor-text">
                     <span className="text-[#58a6ff]">EnemyManager.count</span>
                     <span className="text-[#fff]">14</span>
                     <X size={10} className="hidden group-hover:block ml-1 cursor-pointer hover:text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-[#111] border border-[#333] rounded overflow-hidden">
                <div className="bg-[#222] px-2 py-1 text-[10px] font-bold text-[#ccc] uppercase tracking-wider flex justify-between cursor-pointer">
                  <span>CALL STACK</span> <ChevronDown size={12} />
                </div>
                <div className="p-2 text-[11px] font-mono flex flex-col gap-1">
                  <div className="text-[#e3b341] truncate bg-[#222] px-1 rounded flex justify-between">
                    <span>PhysicsSystem.update()</span> <span className="text-[#888]">Physics.ts:142</span>
                  </div>
                  <div className="text-[#888] truncate hover:bg-[#222] px-1 rounded cursor-pointer flex justify-between">
                    <span>GameLoop.tick()</span> <span className="text-[#444]">Core.ts:89</span>
                  </div>
                  <div className="text-[#888] truncate hover:bg-[#222] px-1 rounded cursor-pointer flex justify-between">
                    <span>requestAnimationFrame</span> <span className="text-[#444]">anonymous</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#111] border border-[#333] rounded overflow-hidden">
                <div className="bg-[#222] px-2 py-1 text-[10px] font-bold text-[#ccc] uppercase tracking-wider flex justify-between cursor-pointer">
                  <span>BREAKPOINTS</span> <Plus size={12} className="hover:text-white cursor-pointer" />
                </div>
                <div className="p-2 text-[11px] font-mono flex flex-col gap-1">
                  <div className="flex items-center gap-2 hover:bg-[#222] px-1 py-0.5 rounded cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#f85149]" />
                    <div className="w-2 h-2 rounded-full bg-[#f85149]"></div>
                    <span className="text-[#ccc] truncate flex-1">PlayerControl.ts <span className="text-[#888] ml-2">16:4</span></span>
                  </div>
                  <div className="flex items-center gap-2 hover:bg-[#222] px-1 py-0.5 rounded cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#f85149]" />
                    <div className="w-2 h-2 rounded-full bg-[#f85149] rounded-sm transform rotate-45 border-none" title="Conditional Breakpoint"></div>
                    <span className="text-[#ccc] truncate flex-1">EnemyAStar.ts <span className="text-[#888] ml-2 text-[9px] italic">if (hp &lt; 0)</span></span>
                  </div>
                </div>
              </div>

               {/* Network / Profiling */}
              <div className="bg-[#111] border border-[#333] rounded overflow-hidden">
                <div className="bg-[#222] px-2 py-1 text-[10px] font-bold text-[#ccc] uppercase tracking-wider flex justify-between cursor-pointer border-b border-[#333]">
                  <span>NETWORK CALLS</span> <ChevronDown size={12} />
                </div>
                <div className="p-1 text-[10px] flex flex-col gap-0.5 text-[#888] font-mono">
                  <div className="flex justify-between items-center hover:bg-[#222] px-1 cursor-pointer text-[#3fb950]">
                     <span>GET /api/save</span> <span>200 OK</span> <span>12ms</span>
                  </div>
                  <div className="flex justify-between items-center hover:bg-[#222] px-1 cursor-pointer text-[#f85149]">
                     <span>POST /api/telemetry</span> <span>500 ERR</span> <span>45ms</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : leftPanel === 'test' ? (
          <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            <div className="px-4 py-3 border-b border-[#222] text-[#ccc] flex items-center justify-between">
              <span className="font-bold text-[11px] uppercase tracking-wide flex items-center gap-2"><FlaskConical size={14}/> Test Explorer</span>
              <div className="flex gap-2">
                <Play size={12} className="text-[#3fb950] cursor-pointer" />
                <RotateCw size={12} className="text-[#888] cursor-pointer hover:text-[#fff]" />
              </div>
            </div>
            <div className="p-2 text-[11px] flex flex-col gap-2">
              <div className="flex items-center gap-2 cursor-pointer hover:bg-[#222] p-1 border border-transparent hover:border-[#333] rounded">
                <ShieldCheck size={12} className="text-[#3fb950]" /> <span className="text-[#ccc]">MathUtils.test.js</span>
              </div>
              <div className="flex flex-col gap-1 pl-5 text-[#888]">
                <div className="flex items-center gap-2 hover:text-[#ccc] cursor-pointer"><ShieldCheck size={10} className="text-[#3fb950]" /> Should calculate damage</div>
                <div className="flex items-center gap-2 hover:text-[#ccc] cursor-pointer"><XCircle size={10} className="text-[#f85149]" /> Should normalize zero vector</div>
              </div>
            </div>
          </div>
        ) : leftPanel === 'extensions' ? (
          <div className="flex-1 flex flex-col custom-scrollbar">
            <div className="px-4 py-3 border-b border-[#222] text-[#ccc]">
              <span className="font-bold text-[11px] uppercase tracking-wide">Extensions</span>
            </div>
            <div className="p-2 pb-0">
               <input type="text" placeholder="Search Extensions in Marketplace" className="w-full bg-[#111] border border-[#333] rounded px-2 py-1.5 text-[11px] outline-none text-[#fff]" />
            </div>
            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
              <div className="bg-[#111] border border-[#222] p-2 flex gap-3 rounded cursor-pointer hover:border-[#58a6ff]/50 transition-colors">
                <div className="w-8 h-8 shrink-0 bg-[#bc8cff]/20 rounded flex items-center justify-center"><Sparkles size={16} className="text-[#bc8cff]" /></div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[#fff]">Nexus AI Companion</span>
                  <span className="text-[9px] text-[#888]">AI-native refactor, debug, predict</span>
                </div>
              </div>
              <div className="bg-[#111] border border-[#222] p-2 flex gap-3 rounded cursor-pointer hover:border-[#58a6ff]/50 transition-colors">
                <div className="w-8 h-8 shrink-0 bg-[#f85149]/20 rounded flex items-center justify-center"><Activity size={16} className="text-[#f85149]" /></div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[#fff]">ESLint</span>
                  <span className="text-[9px] text-[#888]">Integrates ESLint JavaScript</span>
                </div>
              </div>
              <div className="bg-[#111] border border-[#222] p-2 flex gap-3 rounded cursor-pointer hover:border-[#58a6ff]/50 transition-colors">
                <div className="w-8 h-8 shrink-0 bg-[#e3b341]/20 rounded flex items-center justify-center"><Cpu size={16} className="text-[#e3b341]" /></div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[#fff]">C/C++ Build Tools</span>
                  <span className="text-[9px] text-[#888]">C++ intellisense and debugging</span>
                </div>
              </div>
            </div>
          </div>
        ) : leftPanel === 'tasks' ? (
          <TaskPanel />
        ) : (
          <div className="flex-1 min-h-0 overflow-hidden">
             <GitPanel files={files} />
          </div>
        )}
      </aside>
    );
  };

  const renderTabs = () => (
    <div className="min-h-[35px] bg-[#101012] flex border-b border-[#000] shrink-0 custom-scrollbar relative z-10 w-full justify-between overflow-visible">
      <div className="flex overflow-x-auto hide-scrollbar flex-1">
        {files.map(f => (
          <div 
            key={f.id}
            onClick={() => { setActiveFileId(f.id); setActiveTool('Select'); }}
            className={`px-4 flex items-center text-[10px] border-r border-[#222] cursor-pointer whitespace-nowrap transition-colors select-none ${
              f.id === activeFileId && activeTool === 'Select'
                ? 'bg-[#151515] text-[#fff] font-bold border-t-[2px] border-t-[#0078d7]'
                : 'text-[#b0b5bd] hover:bg-[#202022] border-t-[2px] border-t-transparent'
            }`}
          >
            {f.name}
          </div>
        ))}
        <div 
          onClick={() => setActiveTool('AssetStore')}
          className={`px-4 flex items-center gap-1.5 text-[10px] border-r border-[#222] cursor-pointer whitespace-nowrap transition-colors select-none ${
            activeTool === 'AssetStore'
              ? 'bg-[#151515] text-[#bc8cff] font-bold border-t-[2px] border-t-[#bc8cff]'
              : 'text-[#b0b5bd] hover:bg-[#202022] border-t-[2px] border-t-transparent'
          }`}
        >
          <ShoppingCart size={12} /> Asset Store
        </div>
      </div>
      {activeTool === 'Select' && (
        <div className="flex items-center px-3 border-l border-[#222] shrink-0 bg-[#101012]">
          <button 
            onClick={() => setShowEditorViewport(!showEditorViewport)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-bold transition-colors ${showEditorViewport ? 'bg-[#58a6ff]/20 text-[#58a6ff]' : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'}`}
            title="Toggle Engine Viewport"
          >
            <MonitorPlay size={14} />
            {showEditorViewport ? 'Viewport: ON' : 'Viewport: OFF'}
          </button>
        </div>
      )}
    </div>
  );

  const renderAIChat = () => (
    <aside className={`w-full h-full flex-col bg-[#151515] border-l border-[#000] shrink-0 z-10 ${mobileView === 'chat' ? 'flex' : 'hidden'} md:flex`}>
      <div className="p-3 bg-[#101012] border-b border-[#222] flex flex-col gap-1 shrink-0 relative">
        <div className="absolute right-4 top-3 flex gap-1">
          <span className="text-[#3fb950] font-mono text-[9px] bg-[#3fb950]/10 border border-[#3fb950]/20 px-1 py-0.5 rounded-[2px]" title="Memory Core: Keeping last 50 messages + project context">
             50/50 MEMORY
          </span>
          <span className="text-[#58a6ff] font-mono text-[9px] bg-[#58a6ff]/10 border border-[#58a6ff]/20 px-1 py-0.5 rounded-[2px]" title="Context Space: 16 Million Tokens">
             16M CONTEXT
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 ${currentAgent.color} rounded-full animate-pulse`}></div>
            <select 
              value={aiAgentMode}
              onChange={(e) => setAiAgentMode(e.target.value)}
              className="bg-transparent text-[11px] font-bold uppercase tracking-[1px] text-[#b0b5bd] outline-none cursor-pointer hover:text-[#fff] transition-colors"
            >
              {Object.entries(AGENTS).map(([key, agent]) => (
                <option key={key} value={key} className="bg-[#151515] text-[#b0b5bd]">
                  {agent.icon} {agent.name}
                </option>
              ))}
            </select>
          </div>
          <span className={`text-[9px] ${currentAgent.color} text-[#fff] px-1.5 py-0.5 rounded-[2px] font-mono shadow-sm`}>{currentAgent.context}</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-[#888] mt-1">
            <span className="font-mono">Model: {currentAgent.model}</span>
            <span className="font-mono flex items-center gap-1">
              <span className={`w-1 h-1 rounded-full ${currentAgent.color}`}></span>
              Offline
            </span>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden relative">
          <AIChat 
            code={activeFile?.content || ''} 
            setCode={setCode} 
            language={activeFile?.language || 'plaintext'} 
            setLanguage={setLanguage} 
            files={files}
            onWriteFiles={handleWriteFiles}
            agentMode={aiAgentMode}
            messages={chatMessages}
            setMessages={setChatMessages}
          />
      </div>
    </aside>
  );

  const renderStatusBar = () => (
    <footer className="h-[24px] bg-[#0E0E0F] text-[#888] border-t border-[#000] items-center px-3 text-[10px] font-medium tracking-wide shrink-0 justify-between hidden md:flex z-50">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1 text-[#3fb950]"><Sparkles size={10}/> READY</span>
        <span className="font-mono hidden xl:block">LN 1, COL 1</span>
        <span className="uppercase tracking-widest hidden xl:block text-[#b0b5bd]">{activeFile?.language || 'CORE'}</span>
        <span className="flex items-center gap-1">
          <MonitorPlay size={10}/> TARGET: <span className="text-[#3fb950] font-bold">144FPS</span>
        </span>
        <span className="flex items-center gap-1">
          <Zap size={10}/> AI OPTIMIZATION: <span className="font-bold text-[#b0b5bd]">ACTIVE</span>
        </span>
      </div>
      <div className="flex items-center gap-4 cursor-pointer hover:text-white transition-colors text-[10px]">
        <span className="flex items-center gap-1"><Play size={10} fill="currentColor"/> START DEBUGGING (F5)</span>
      </div>
    </footer>
  );

  const renderMobileNavigation = () => (
    <div className="md:hidden flex h-[60px] bg-[#161b22] border-t border-[#30363d] shrink-0 w-full z-20 pb-1">
      <button 
        onClick={() => setMobileView('explorer')}
        className={`flex-1 flex flex-col items-center justify-center gap-1.5 transition-colors ${mobileView === 'explorer' ? 'text-[#58a6ff]' : 'text-[#8b949e]'}`}
      >
         <FolderTree size={20} strokeWidth={mobileView === 'explorer' ? 2.5 : 2} />
         <span className="text-[10px] font-medium tracking-wide">Files</span>
      </button>
      <button 
        onClick={() => setMobileView('editor')}
        className={`flex-1 flex flex-col items-center justify-center gap-1.5 transition-colors border-x border-[#30363d] ${mobileView === 'editor' ? 'text-[#58a6ff]' : 'text-[#8b949e]'}`}
      >
         <FileCode2 size={20} strokeWidth={mobileView === 'editor' ? 2.5 : 2} />
         <span className="text-[10px] font-medium tracking-wide">Editor</span>
      </button>
      <button 
        onClick={() => setMobileView('chat')}
        className={`flex-1 flex flex-col items-center justify-center gap-1.5 transition-colors ${mobileView === 'chat' ? 'text-[#3fb950]' : 'text-[#8b949e]'}`}
      >
         <MessageSquare size={20} strokeWidth={mobileView === 'chat' ? 2.5 : 2} />
         <span className="text-[10px] font-medium tracking-wide">Copilot</span>
      </button>
    </div>
  );

  const renderDetailsPanel = () => (
    <aside className="w-full h-full bg-[#151515] border-l border-[#000] hidden xl:flex flex-col shrink-0 z-10 custom-scrollbar overflow-x-hidden">
      <GlobalUniversalDetailsPanel activeTool={activeTool} />
    </aside>
  );

  const renderBottomPanel = () => {
    const isCodeIDE = activeTool === 'Select';
    const content = (
      <div className={`w-full h-full bg-[#151515] border-t border-[#000] shrink-0 font-mono text-[10px] flex flex-col z-20 ${showConsole || isCodeIDE ? 'flex' : 'hidden'}`}>
        <div className="flex bg-[#101012] border-b border-[#222] text-[#888] overflow-x-auto hide-scrollbar shrink-0 min-h-[26px]">
          {isCodeIDE ? (
            <>
              <button onClick={() => setBottomTab('problems')} className={`px-4 py-1.5 transition-colors flex items-center gap-1.5 uppercase font-bold text-[10px] shrink-0 ${bottomTab === 'problems' ? 'text-[#fff] bg-[#222] border-t-2 border-[#f85149]' : 'border-t-2 border-transparent hover:text-[#fff]'}`}><Bug size={10}/> Problems <span className="bg-[#161b22] px-1 rounded-full text-[9px] text-[#f85149]">3</span></button>
              <button onClick={() => setBottomTab('output')} className={`px-4 py-1.5 transition-colors flex items-center gap-1.5 uppercase font-bold text-[10px] shrink-0 ${bottomTab === 'output' ? 'text-[#fff] bg-[#222] border-t-2 border-[#58a6ff]' : 'border-t-2 border-transparent hover:text-[#fff]'}`}><Activity size={10}/> Output</button>
              <button onClick={() => setBottomTab('chrono')} className={`px-4 py-1.5 transition-colors flex items-center gap-1.5 uppercase font-bold text-[10px] shrink-0 ${bottomTab === 'chrono' ? 'text-[#fff] bg-[#222] border-t-2 border-[#a371f7]' : 'border-t-2 border-transparent hover:text-[#a371f7]'}`}><History size={10}/> History</button>
              <button onClick={() => setBottomTab('debugConsole')} className={`px-4 py-1.5 transition-colors flex items-center gap-1.5 uppercase font-bold text-[10px] shrink-0 ${bottomTab === 'debugConsole' ? 'text-[#fff] bg-[#222] border-t-2 border-[#58a6ff]' : 'border-t-2 border-transparent hover:text-[#fff]'}`}><Server size={10}/> Debug Console</button>
              <button onClick={() => setBottomTab('terminal')} className={`px-4 py-1.5 transition-colors flex items-center gap-1.5 uppercase font-bold text-[10px] shrink-0 ${bottomTab === 'terminal' || !['problems', 'output', 'debugConsole', 'chrono', 'resource'].includes(bottomTab) ? 'text-[#fff] bg-[#222] border-t-2 border-[#58a6ff]' : 'border-t-2 border-transparent hover:text-[#fff]'}`}><Terminal size={10}/> Terminal</button>
              <button onClick={() => setBottomTab('resource')} className={`px-4 py-1.5 transition-colors flex items-center gap-1.5 uppercase font-bold text-[10px] shrink-0 ${bottomTab === 'resource' ? 'text-[#fff] bg-[#222] border-t-2 border-[#58a6ff]' : 'border-t-2 border-transparent hover:text-[#fff]'}`}><Activity size={10}/> Resource Usage</button>
            </>
          ) : (
            <>
              <button onClick={() => setBottomTab('content')} className={`px-4 py-1.5 transition-colors flex items-center gap-1.5 uppercase font-bold text-[10px] shrink-0 ${bottomTab === 'content' ? 'text-[#fff] bg-[#222] border-t-2 border-[#58a6ff]' : 'border-t-2 border-transparent hover:text-[#fff]'}`}><FolderTree size={10}/> Content Drawer</button>
              <button onClick={() => setBottomTab('log')} className={`px-4 py-1.5 transition-colors flex items-center gap-1.5 uppercase font-bold text-[10px] shrink-0 ${bottomTab === 'log' ? 'text-[#fff] bg-[#222] border-t-2 border-[#58a6ff]' : 'border-t-2 border-transparent hover:text-[#fff]'}`}><Terminal size={10}/> Output Log</button>
              <button onClick={() => setBottomTab('cmd')} className={`px-4 py-1.5 transition-colors flex items-center gap-1.5 uppercase font-bold text-[10px] shrink-0 ${bottomTab === 'cmd' ? 'text-[#fff] bg-[#222] border-t-2 border-[#58a6ff]' : 'border-t-2 border-transparent hover:text-[#fff]'}`}><Server size={10}/> Cmd</button>
            </>
          )}
          <div className="ml-auto flex items-center">
             <button onClick={() => setDetachedWindows(prev => ({...prev, console: !prev.console}))} className="px-2 py-1.5 hover:text-[#fff] transition-colors shrink-0 flex items-center gap-1" title="Pop out Terminal">
                <ExternalLink size={10} />
             </button>
             {!isCodeIDE && <button className="px-4 py-1.5 border-transparent hover:text-[#fff] transition-colors shrink-0" onClick={() => setShowConsole(false)}>X</button>}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar flex min-h-0">
          {!isCodeIDE && bottomTab === 'content' ? (
            <ContentBrowser onOpenBlueprint={() => setActiveTool('Blueprint')} />
          ) : isCodeIDE ? (
            bottomTab === 'resource' ? (
              <ResourceUsageTab />
            ) : (
            <div className="flex-1 p-4 flex flex-col gap-1 text-[#ccc] font-mono text-[12px]">
              {bottomTab === 'terminal' || !['problems', 'output', 'debugConsole', 'chrono', 'resource'].includes(bottomTab) ? (
                <>
                  {terminalHistory.map((item, index) => (
                    <div key={index} className={
                      item.type === 'sys' ? 'text-[#888]' :
                      item.type === 'cmd' ? 'text-[#ccc] flex gap-2 items-center' :
                      item.type === 'success' ? 'text-[#3fb950]' :
                      item.type === 'error' ? 'text-[#f85149]' : 'text-[#ccc]'
                    }>
                      {item.type === 'cmd' ? (
                        <>
                          <span className="text-[#3fb950]">➜</span>
                          <span className="text-[#58a6ff]">nexus-engine</span>
                          <span className="text-[#888]">git:(</span><span className="text-[#f85149]">main</span><span className="text-[#888]">)</span>
                          <span>{item.text}</span>
                        </>
                      ) : (
                        item.text
                      )}
                    </div>
                  ))}
                  <div className="mt-2 text-[#ccc] flex gap-2 items-center">
                    <span className="text-[#3fb950]">➜</span>
                    <span className="text-[#58a6ff]">nexus-engine</span>
                    <span className="text-[#888]">git:(</span><span className="text-[#f85149]">main</span><span className="text-[#888]">)</span>
                    <input 
                      type="text" 
                      className="bg-transparent border-none outline-none flex-1 font-mono text-[#fff] caret-white" 
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (terminalInput.trim()) {
                            setTerminalHistory(prev => [...prev, { type: 'cmd', text: terminalInput }]);
                            
                            // Mocking different commands
                            if (terminalInput === 'ls') {
                              setTerminalHistory(prev => [...prev, { type: 'normal', text: 'src  public  package.json  vite.config.ts  README.md' }]);
                            } else if (terminalInput === 'clear') {
                              setTerminalHistory([]);
                            } else if (terminalInput.startsWith('echo ')) {
                               setTerminalHistory(prev => [...prev, { type: 'normal', text: terminalInput.substring(5) }]);
                            } else {
                              setTerminalHistory(prev => [...prev, { type: 'error', text: `command not found: ${terminalInput}` }]);
                            }
                            setTerminalInput('');
                          }
                        }
                      }}
                      autoFocus
                    />
                  </div>
                </>
              ) : bottomTab === 'problems' ? (
                <div className="flex flex-col gap-2 relative">
                  <div className="absolute right-0 top-0 text-[10px] bg-[#161b22] px-2 py-1 rounded border border-[#3fb950]/30 text-[#3fb950] font-bold flex items-center gap-1"><CheckCircle size={10} /> Universal Linter Active</div>
                  <h4 className="text-[#c9d1d9] font-bold text-[12px] mb-1">Syntax Validation & Spell Check (All Languages Supported)</h4>
                  <div className="text-[11px] text-[#ccc] bg-[#161b22] border-l-2 border-[#f85149] p-2 flex gap-4 items-start hover:bg-[#21262d] cursor-pointer">
                     <span className="text-[#f85149]"><AlertTriangle size={14}/></span>
                     <div className="flex flex-col gap-0.5">
                       <span className="text-[#c9d1d9] font-bold">src/core/math/Transform.cpp <span className="text-[#8b949e] font-normal">[Line 42, Col 8]</span></span>
                       <span className="text-[#8b949e]">Typo in variable name: 'quatrrnion'. Did you mean 'quaternion'? (AI Word Correction)</span>
                       <span className="text-[#58a6ff] hover:underline hover:text-white mt-1 cursor-pointer w-max">Auto-Fix with AI</span>
                     </div>
                  </div>
                  <div className="text-[11px] text-[#ccc] bg-[#161b22] border-l-2 border-[#f85149] p-2 flex gap-4 items-start hover:bg-[#21262d] cursor-pointer">
                     <span className="text-[#f85149]"><AlertTriangle size={14}/></span>
                     <div className="flex flex-col gap-0.5">
                       <span className="text-[#c9d1d9] font-bold">src/scripts/NPCBehavior.lua <span className="text-[#8b949e] font-normal">[Line 128, Col 2]</span></span>
                       <span className="text-[#8b949e]">Syntax Error: Missing 'end' statement for 'if' block.</span>
                       <span className="text-[#58a6ff] hover:underline hover:text-white mt-1 cursor-pointer w-max">Auto-Fix with AI</span>
                     </div>
                  </div>
                  <div className="text-[11px] text-[#ccc] bg-[#161b22] border-l-2 border-[#e3b341] p-2 flex gap-4 items-start hover:bg-[#21262d] cursor-pointer">
                     <span className="text-[#e3b341]"><AlertTriangle size={14}/></span>
                     <div className="flex flex-col gap-0.5">
                       <span className="text-[#c9d1d9] font-bold">src/ui/MainMenu.tsx <span className="text-[#8b949e] font-normal">[Line 15, Col 12]</span></span>
                       <span className="text-[#8b949e]">Warning: Possible grammar error in string literal "You has been defeated". Suggestion: "You have been defeated".</span>
                       <span className="text-[#58a6ff] hover:underline hover:text-white mt-1 cursor-pointer w-max">Apply AI Correction</span>
                     </div>
                  </div>
                </div>
              ) : bottomTab === 'chrono' ? (
                <div className="flex-1 w-full h-full relative p-0 overflow-hidden">
                  <ChronoDebugger isSimulating={isSimulating} setIsSimulating={setIsSimulating} />
                </div>
              ) : bottomTab === 'output' ? (
                 <div className="flex flex-col gap-1">
                   <div className="text-[#888]">[Info  - 12:45:01 PM] ESLint server initialized.</div>
                   <div className="text-[#888]">[Info  - 12:45:03 PM] TypeScript language server started.</div>
                   <div className="text-[#888]">[Info  - 12:45:05 PM] AI Context synchronized with workspace.</div>
                 </div>
              ) : (
                <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-3 font-mono h-full overflow-y-auto w-full pr-2 pb-6">
                  <div className="flex justify-between items-center bg-[#222]/50 p-2 rounded border border-[#333]">
                    <div className="flex items-center gap-3">
                       <span className="text-[#f85149] font-bold flex items-center gap-1"><XCircle size={14} /> Exceptions Caught</span>
                       <span className="text-[#888] text-[10px]">main.js (Engine Thread)</span>
                    </div>
                    <button className="text-[#58a6ff] hover:bg-[#58a6ff]/10 px-2 py-1 flex items-center gap-1 rounded text-xs transition duration-200 border border-transparent hover:border-[#58a6ff]/30"><Sparkles size={12}/> AI Deep Analysis</button>
                  </div>
                  
                  <div className="flex flex-col border border-[#f85149]/30 rounded bg-[#111] shadow-[0_4px_20px_rgba(248,81,73,0.05)] overflow-hidden">
                    <div className="bg-[#f85149]/20 px-3 py-2 border-b border-[#f85149]/30 flex items-center gap-2">
                       <Bug size={14} className="text-[#f85149]"/>
                       <span className="text-[#fff] font-bold text-sm">TypeError: Cannot read properties of undefined (reading 'x')</span>
                    </div>
                    
                    <div className="p-3 bg-[#0d1117] flex flex-col gap-2 relative">
                        <div className="text-[#888] text-xs">At <span className="text-[#58a6ff]">PhysicsWorker.updatePhysics</span> <span className="text-[#888]">(physics/solver.js:401:12)</span></div>
                        <div className="text-[#888] text-xs">At <span className="text-[#58a6ff]">Engine.tick</span> <span className="text-[#888]">(core/engine.js:899:4)</span></div>
                        <div className="text-[#888] text-xs">At <span className="text-[#58a6ff]">requestAnimationFrame</span> <span className="text-[#888]">(Window)</span></div>
                        
                        <div className="mt-3 bg-[#1e2329] border border-[#30363d] rounded p-4 ml-6 relative">
                            <div className="absolute -left-[24px] top-4 w-[24px] border-b border-[#30363d]"></div>
                            <span className="text-[#e3b341] text-[10px] font-bold mb-3 flex items-center gap-1 uppercase tracking-wider"><Bot size={12}/> AI Root Cause Diagnostics</span>
                            <p className="text-[#ccc] text-xs leading-relaxed max-w-[95%] mb-2">
                                <span className="text-[#f85149] font-bold">What happened:</span> The engine tried to access the position <code className="text-[#ff7b72] bg-[#f85149]/10 px-1 rounded">['x']</code> of an active rigid body, but the rigid body reference is currently <code className="text-[#ff7b72] bg-[#f85149]/10 px-1 rounded">undefined</code>.
                            </p>
                            <p className="text-[#ccc] text-xs leading-relaxed max-w-[95%]">
                                <span className="text-[#e3b341] font-bold">Why it happened:</span> Engine pool allocation bug. The multiplayer state replication system received a partial entity sync from the server but did not pre-allocate <code className="text-[#888] bg-[#222] px-1 rounded">Transform</code> data.
                            </p>
                            
                            <div className="mt-4 bg-[#0d1117] border border-[#30363d] rounded overflow-hidden text-[11px]">
                               <div className="flex bg-[#161b22] px-3 py-1.5 items-center justify-between border-b border-[#30363d]">
                                  <span className="text-[#888] flex items-center gap-1"><FileCode2 size={12}/> Suggested Fix (physics/solver.js)</span>
                                  <button className="text-[#3fb950] font-bold cursor-pointer hover:bg-[#3fb950]/10 px-2 rounded-sm border border-[#3fb950] transition">Apply Patch</button>
                               </div>
                               <pre className="text-[#ccc] p-3 overflow-x-auto whitespace-pre">
<span className="text-[#888]">400 |   const entity = EntityManager.get(id);</span>
<div className="bg-[#f85149]/20 w-full inline-block px-1 -ml-1"><span className="text-[#f85149]">- 401 |   if (entity.transform) {'{'}</span></div>
<div className="bg-[#3fb950]/20 w-full inline-block px-1 -ml-1"><span className="text-[#3fb950]">+ 401 |   if (entity && entity.transform && entity.transform.position) {'{'}</span></div>
<span className="text-[#888]">402 |      updatePosition(entity.transform);</span>
<span className="text-[#888]">403 |   {'}'}</span>
                               </pre>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
                </div>
              )}
            </div>
            )
          ) : (
            <div className="flex-1 p-4 flex flex-col gap-1 text-[#ccc]">
               <div className="text-[#888]">NexusEngine AI initialized. (Local Cluster Offline)</div>
               <div><span className="text-[#e3b341]">[LogEngine]</span> Found 2 physical CPU cores, 8 thread(s).</div>
               <div><span className="text-[#e3b341]">[LogRenderer]</span> Initialized WebGL2 Rendering Context / WebGPU Support: OK.</div>
               <div><span className="text-[#e3b341]">[LogRenderer]</span> Loading RHI pipeline... compiling shaders (142 nodes).</div>
               <div><span className="text-[#e3b341]">[LogPhysics]</span> Rapier/Ammo.js Collision Solver Instantiated. 0 RigidBodies.</div>
               <div><span className="text-[#e3b341]">[LogAnimation]</span> BlendTree / IK Solver initialized successfully.</div>
               <div><span className="text-[#e3b341]">[LogAudio]</span> 3D Spatial Audio ready (Wwise/FMOD simulated bridge).</div>
               <div><span className="text-[#e3b341]">[LogWorld]</span> Scene graph loaded. Streaming cell grid 0,0.</div>
               <div className="text-[#58a6ff]">[LogCore] Frame budget target: 16.6ms (60 FPS). Asynchronous workers standing by.</div>
               {isSimulating && <div className="text-[#3fb950] font-bold">[PlayMode] PIE (Play In Editor) session started. Game Loop Active.</div>}
               {bottomTab === 'cmd' ? <div className="mt-2 text-[#58a6ff] flex gap-2 items-center">&gt; <input type="text" className="bg-transparent border-none outline-none flex-1 font-mono text-[#fff]" placeholder="engine.help()" /></div> : bottomTab === 'log' ? <div className="text-[#888]">Waiting for commands...</div> : null}
            </div>
          )}
        </div>
      </div>
    );

    if (detachedWindows.console) {
      return (
        <div className={`w-full h-full bg-[#151515] border-t border-[#000] flex flex-col items-center justify-center font-mono text-[10px] text-[#8b949e] ${showConsole || isCodeIDE ? 'flex' : 'hidden'}`}>
           <Terminal size={32} className="mb-2 text-[#30363d]" />
           <div className="text-[12px] uppercase font-bold text-white tracking-widest mb-1">{isCodeIDE ? 'Terminal & Output Detached' : 'Console Detached'}</div>
           <div className="mb-4 text-[11px]">This panel is currently running in a separate window.</div>
           <button onClick={() => setDetachedWindows(prev => ({...prev, console: false}))} className="px-3 py-1.5 bg-[#1f6feb] text-white rounded hover:bg-[#388bfd] transition-colors rounded text-xs font-bold">
             Restore to Main Window
           </button>
           <PopOutPanel title="Terminal & Console" onClose={() => setDetachedWindows(prev => ({...prev, console: false}))}>
              {content}
           </PopOutPanel>
        </div>
      );
    }

    return content;
  };

  // ---------------------------------------------------------------------------
  // Main Render
  // ---------------------------------------------------------------------------
  
  const renderMainEditorContent = () => (
    <div className={`flex-1 min-h-0 relative ${isSimulating ? 'hidden' : 'block'} w-full h-full`}>
       {activeTool === 'Select' && (
         <PanelGroup orientation="horizontal">
           <Panel defaultSize={showEditorViewport ? 50 : 100} minSize={20}>
             <div className="flex-1 min-w-0 border-r border-[#30363d] relative h-full">
               <CodeEditor 
                 code={activeFile?.content || ''} 
                 setCode={setCode} 
                 language={activeFile?.language || 'plaintext'} 
                 setLanguage={setLanguage} 
                 filename={activeFile?.name}
               />
             </div>
           </Panel>
           
           {showEditorViewport && (
             <>
               <PanelResizeHandle className="w-[1px] bg-[#222] hover:bg-[#58a6ff] transition-colors cursor-col-resize z-50 relative after:content-[''] after:absolute after:inset-y-0 after:-left-[2px] after:w-[5px]" />
               <Panel defaultSize={50} minSize={20}>
                 <div className="flex-1 min-w-0 relative h-full">
                   <Viewport3D activeTool={activeTool} activeFile={activeFile} />
                 </div>
               </Panel>
             </>
           )}
         </PanelGroup>
       )}
       {activeTool === 'QuickStart' && <QuickStartDashboard onSelectTool={setActiveTool} />}
       {activeTool === 'EconomicBalancer' && <EconomicBalancer />}
       {activeTool === 'NodeGraphEditor' && <NodeGraphEditor />}
       {activeTool === 'WorldBible' && <WorldBibleEditor />}
       {activeTool === 'ASTNodeWeaver' && (
         <NodeGraphMockup onClose={() => setActiveTool('Select')} />
       )}
       {activeTool === 'Material' && (
         <MaterialEditor />
       )}
       {activeTool === 'Pipeline' && (
         <PipelineEditor />
       )}
       {activeTool === 'Blueprint' && (
         <BlueprintEditor 
            onCodeGenerated={(code) => {
              setFiles(prev => {
                const existing = prev.find(f => f.name === 'BlueprintCompiled.js');
                if (existing) {
                   if (existing.content === code) return prev;
                   return prev.map(f => f.id === existing.id ? { ...f, content: code } : f);
                } else {
                   return [...prev, { id: 'bp_compiled_' + Date.now(), name: 'BlueprintCompiled.js', language: 'javascript', folder: 'Compiled', content: code }];
                }
              });
            }}
         />
       )}
       {activeTool === 'ServerSim' && (
         <NetworkSim />
       )}
       {['AITestingQA', 'ControlRig', 'ProceduralGen'].includes(activeTool) && (
         <ModulePanel moduleType={activeTool} />
       )}
       {['GameSystems', 'AdvancedNavMesh', 'VoxelEngine'].includes(activeTool) && (
         <GameSystemsEditor />
       )}
       {activeTool === 'VehiclePhysics' && <VehicleDynamicsEditor />}
       {activeTool === 'MLAgents' && <MLAgentsEditor />}
       {activeTool === 'VRXREngine' && <VRXREngineEditor />}
       {activeTool === 'OptimizationOverview' && <OptimizationOverview />}
       {activeTool === 'CinematicSequencer' && <CinematicSequencerEditor />}
       {['WorldBible', 'DialogueQuest'].includes(activeTool) && (
         <WorldLoreEditor />
       )}
       {['BuildPublish', 'AssetPipeline', 'BackendCloud', 'DevOpsBuilder'].includes(activeTool) && (
         <BuildPublishEditor />
       )}
       {['PhysicsEngine', 'InputMapping'].includes(activeTool) && (
         <ProjectSettingsEditor />
       )}
       {activeTool === 'GraphicsRender' &&  (
         <GraphicsRenderEditor />
       )}
       {['MetaSound', 'AudioEdit', 'AnimationAudio'].includes(activeTool) && (
         <AudioEditor />
       )}
       {activeTool === 'ImageEdit' && <ImageEditor setActiveTool={setActiveTool} />}
       {activeTool === 'EffectEdit' && <VFXHitboxStudio setActiveTool={setActiveTool} />}
       {activeTool === 'OfflineVFX' && <OfflineAIVFXStudio />}
       {['NPCEdit', 'MonsterEdit'].includes(activeTool) && <NPCEditor initialTab={activeTool === 'MonsterEdit' ? 'Monsters' : 'NPCs'} />}
       {['ControlRig', 'Modeling'].includes(activeTool) && <ModelingEditor />}
       {activeTool === 'ScriptEditor' && <ScriptEditor />}
       {['AITestingQA', 'PerformanceProfile'].includes(activeTool) && <PerformanceProfiler />}
       {['Sequencer', 'CinematicSequencer'].includes(activeTool) && (
         <CutsceneEditor />
       )}
       {activeTool === 'DataTable' && <DataTableEditor />}
       {activeTool === 'AssetStore' && <AssetStore />}
       {activeTool === 'Offline3DModeler' && <Offline3DModeler />}
       {activeTool === 'AdvancedTerrain' && <AdvancedTerrainEditor />}
       {activeTool === 'AudioDAW' && <AudioDAW />}
       {activeTool === 'AdvancedImage' && <AdvancedImageEditor />}
       {activeTool === 'AdvancedMap' && <AdvancedMapBuilder />}
       {activeTool === 'UltimateMapBuilder' && <UltimateMapGameBuilder />}
       {activeTool === 'MegaWorldArchitect' && <MegaWorldArchitect />}
       {activeTool === 'RiggingAnim' && <RiggingAndAnimation />}
       {activeTool === 'VFXGraph' && <VFXGraphEditor />}
       {activeTool === 'BlueprintExecution' && <BlueprintExecutionVisualizer />}
       {activeTool === 'CinematicDirector' && <CinematicDirector />}
       {activeTool === 'EngineProfiler' && <GameEngineProfiler />}
       {activeTool === 'StoryGraph' && <StoryGraphEditor />}
       {activeTool === 'BehaviorTree' && <BehaviorTreeEditor />}
       {activeTool === 'LogicVisual' && <LogicVisualEditor />}
       {activeTool === 'MetaHuman' && <MetaHumanEditor />}
       {activeTool === 'Niagara' && <NiagaraEditor />}
       {['PCG', 'ProceduralGen'].includes(activeTool) && <PCGEditor />}
       {activeTool === 'UIUXEdit' && <UIUXEditor />}
       {activeTool === 'ActionRecorder' && <ManualSequenceRecorder />}
       {activeTool === 'ActionGraph' && <ActionGraphEditor />}
       {activeTool === 'WorkflowDAG' && <WorkflowDAGEditor />}
       {activeTool === 'PhysicsSimulation' && <PhysicsSimulationStudio />}
       {activeTool === 'SkillForge' && <SkillForgeEditor setActiveTool={setActiveTool} />}
       {activeTool === 'AIBrowser' && <AIBrowser />}
       {activeTool === 'LocalAI' && <LocalAIStudio setActiveTool={setActiveTool} />}
       {activeTool === 'WorldBuilder' && <WorldBuilderEditor />}
       {activeTool === 'SentientAI' && <SentientAIEditor />}
       {activeTool === 'ProceduralAsset' && <ProceduralAssetStudio />}
       {activeTool === 'DevOpsManager' && <ArchitectureDevOpsEditor />}
       {activeTool === 'LiveOps' && <LiveOpsDashboard />}
       {activeTool === 'AnimGraph' && <AnimGraphEditor />}
       {activeTool === 'CharacterAnimator' && <CharacterAnimator />}
       {activeTool === 'Landscape' && <LandscapeEditor />}
       {activeTool === 'MapEdit' && <MapEditor setActiveTool={setActiveTool} />}
       {activeTool === 'Netcode' && <NetcodeEditor />}
       {activeTool === 'EngineCore' && <EngineCoreEditor />}
       {activeTool === 'LevelDesign' && <LevelDesignEditor />}
       {activeTool === 'QuestDirector' && <QuestDirectorEditor />}
       {activeTool === 'BatchAI' && <BatchAIImporter onNavigateToMapEdit={() => setActiveTool('MapEdit')} onNavigateToMonsterEdit={() => setActiveTool('MonsterEdit')} />}
       {activeTool === 'Photogrammetry' && <Photogrammetry3DScanner />}
       {activeTool === 'HardwareDriver' && <DeviceDriverConfigPanel />}
       {activeTool === 'OmniCreatorMaster' && <OmniCreatorMaster onSelectTool={setActiveTool} />}
       {activeTool === 'AITextureSynthesizer' && <AITextureSynthesizer />}
       {activeTool === 'MasterNarrativeCinematicEditor' && <MasterNarrativeCinematicEditor />}
       {['VoiceDubbingStudio', 'DynamicOSTComposer', 'LipSyncAutomator'].includes(activeTool) && <VoiceMusicStudio />}
       {!['Select', 'BatchAI', 'Material', 'Pipeline', 'Blueprint', 'ServerSim', 'DataTable', 'AssetStore', 'StoryGraph', 'BehaviorTree', 'LogicVisual', 'MetaHuman', 'Niagara', 'PCG', 'UIUXEdit', 'ActionRecorder', 'ActionGraph', 'WorkflowDAG', 'PhysicsSimulation', 'SkillForge', 'AIBrowser', 'LocalAI', 'LiveOps', 'PerformanceProfile', 'AnimGraph', 'CharacterAnimator', 'Landscape', 'MapEdit', 'Netcode', 'EngineCore', 'LevelDesign', 'QuestDirector', 'Modeling', 'WorldBible', 'NPCEdit', 'MonsterEdit', 'PhysicsEngine', 'GameSystems', 'GraphicsRender', 'AnimationAudio', 'BackendCloud', 'AITestingQA', 'ControlRig', 'Sequencer', 'CinematicSequencer', 'MetaSound', 'ImageEdit', 'AudioEdit', 'EffectEdit', 'OfflineVFX', 'QuickStart', 'EconomicBalancer', 'NodeGraphEditor', 'ScriptEditor', 'BuildPublish', 'AssetPipeline', 'DialogueQuest', 'ProceduralGen', 'AdvancedNavMesh', 'VoxelEngine', 'VehiclePhysics', 'MLAgents', 'VRXREngine', 'DevOpsBuilder', 'WorldBuilder', 'SentientAI', 'ProceduralAsset', 'DevOpsManager', 'InputMapping', 'OptimizationOverview', 'Photogrammetry', 'HardwareDriver', 'Offline3DModeler', 'AdvancedTerrain', 'AudioDAW', 'AdvancedImage', 'AdvancedMap', 'UltimateMapBuilder', 'MegaWorldArchitect', 'RiggingAnim', 'VFXGraph', 'BlueprintExecution', 'CinematicDirector', 'EngineProfiler', 'OmniCreatorMaster', 'AITextureSynthesizer', 'VoiceDubbingStudio', 'DynamicOSTComposer', 'LipSyncAutomator', 'EyeTrackingHeatmap', 'UXCognitiveLoadSim', 'LocDB', 'MasterNarrativeCinematicEditor', 'CodeProfilerTracer', 'IDECompilerCore', 'BSPBrushArchitect', 'NavMeshRouter', 'TopologyUVPro', 'FigmaStyleCanvas', 'VstMixerRack', 'MidiPianoRoll', 'BranchingDialogueWeaver', 'GameStateFlagTree'].includes(activeTool) && (
         <Viewport3D activeTool={activeTool} activeFile={activeFile} />
       )}

       {/* Global Offline AI Command Bar for Active Editor */}
       {activeTool !== 'Material' && activeTool !== 'BatchAI' && activeTool !== 'Pipeline' && activeTool !== 'Blueprint' && activeTool !== 'ServerSim' && (
          <AICommandCenter activeTool={activeTool} onNavigateToMapEdit={() => setActiveTool('MapEdit')} onNavigateToMonsterEdit={() => setActiveTool('MonsterEdit')} />
       )}

       <HardwareProfilerOverlay />
    </div>
  );

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#0a0a0a] text-[#ccc] font-['Helvetica_Neue',Arial,sans-serif] overflow-hidden">
      {renderTopNavigation()}

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden w-full relative">
        {renderVerticalToolbar()}
        
        {isDesktop ? (
          <PanelGroup orientation="horizontal" className="flex-1 h-full w-full">
            <Panel defaultSize={20} minSize={5}>
              {renderSidebar()}
            </Panel>
            
            <PanelResizeHandle className="w-[1px] bg-[#222] hover:bg-[#58a6ff] transition-colors cursor-col-resize z-50 relative after:content-[''] after:absolute after:inset-y-0 after:-left-[2px] after:w-[5px]" />
            
            <Panel defaultSize={isXL ? 50 : 60} minSize={20}>
              <section className="flex-1 flex-col min-w-0 bg-[#0a0a0a] flex h-full w-full overflow-hidden">
                {renderTabs()}
                
                <PanelGroup orientation="vertical" className="flex-1 h-full">
                  <Panel defaultSize={75} minSize={20} className="relative !overflow-hidden">
                    <div className="flex-1 flex flex-col w-full h-full relative">
                      {isSimulating && <GamePreview files={files} />}
                      {renderMainEditorContent()}
                    </div>
                  </Panel>
                  
                  { (showConsole || activeTool === 'Select') && (
                     <>
                        <PanelResizeHandle className="h-[1px] bg-[#222] hover:bg-[#58a6ff] transition-colors cursor-row-resize z-50 relative after:content-[''] after:absolute after:inset-x-0 after:-top-[2px] after:h-[5px]" />
                        <Panel defaultSize={25} minSize={5} className="relative !overflow-hidden">
                           {renderBottomPanel()}
                        </Panel>
                     </>
                  )}
                </PanelGroup>
              </section>
            </Panel>
            
            {isXL && (
              <>
                <PanelResizeHandle className="w-[1px] bg-[#222] hover:bg-[#58a6ff] transition-colors cursor-col-resize z-50 relative after:content-[''] after:absolute after:inset-y-0 after:-left-[2px] after:w-[5px]" />
                <Panel defaultSize={15} minSize={5}>
                  {renderDetailsPanel()}
                </Panel>
              </>
            )}
            
            <PanelResizeHandle className="w-[1px] bg-[#222] hover:bg-[#58a6ff] transition-colors cursor-col-resize z-50 relative after:content-[''] after:absolute after:inset-y-0 after:-left-[2px] after:w-[5px]" />
            
            <Panel defaultSize={isXL ? 15 : 20} minSize={10}>
              {renderAIChat()}
            </Panel>
          </PanelGroup>
        ) : (
          <div className="flex-1 flex flex-col w-full h-full relative">
            {renderSidebar()}
            <section className={`flex-1 flex-col min-w-0 bg-[#0a0a0a] ${mobileView === 'editor' ? 'flex' : 'hidden'} h-full w-full`}>
               {renderTabs()}
               <div className="flex-1 flex flex-col w-full h-full relative overflow-hidden">
                 {isSimulating && <GamePreview files={files} />}
                 {renderMainEditorContent()}
                 {(showConsole || activeTool === 'Select') && renderBottomPanel()}
               </div>
            </section>
            {renderDetailsPanel()}
            {renderAIChat()}
          </div>
        )}
      </div>

      {renderStatusBar()}
      {renderMobileNavigation()}
      <GlobalSearchPanel 
        files={files} 
        messages={chatMessages}
        graphNodes={[
            { id: 'n1', label: 'Event Tick', category: 'Events', file: 'SystemGraph' },
            { id: 'n2', label: 'Spawn Actor From Class', category: 'Gameplay', file: 'LevelBP' },
            { id: 'n3', label: 'Apply Damage', category: 'Combat', file: 'CharacterBP' },
            { id: 'n4', label: 'Play Anim Montage', category: 'Animation', file: 'AnimGraph' },
            { id: 'n5', label: 'Branch', category: 'Logic', file: 'MathBP' },
        ]}
        isOpen={showGlobalSearch} 
        onClose={() => setShowGlobalSearch(false)} 
        onSelectFile={(fileId) => {
          setActiveFileId(fileId);
          setActiveTool('Select'); // Ensure we are on code editor
        }} 
        onSelectNode={(nodeId) => {
          setActiveTool('Blueprint');
          // would navigate tracking ID here
        }}
        onSelectMessage={(index) => {
          setMobileView('chat');
        }}
      />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </div>
  );
}
