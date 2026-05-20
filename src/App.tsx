/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import CodeEditor from './components/CodeEditor';
import AIChat from './components/AIChat';
import Viewport3D from './components/Viewport3D';
import GitPanel from './components/GitPanel';
import { Brain, ShoppingCart, Database, Bot, Play, Pause, Square, FolderTree, FileCode2, MessageSquare, Sparkles, Box, Mountain, Workflow, PersonStanding, Clapperboard, UserSquare, Waypoints, Palette, Music, GitBranch, Terminal, Server, GitPullRequest, Download, Globe, Map, Users, Ghost, BookOpen, Image, Layers, Eye, Gamepad2, Cpu, MonitorPlay, Activity, Cloud, ShieldCheck, Blocks, Orbit, AudioWaveform, Search, Bug, FlaskConical, Blocks as Puzzle, LayoutDashboard, RotateCw, XCircle, ChevronDown, CheckCircle, AlertTriangle, Plus, X, Flame, Network, TrendingUp, BrainCircuit, Glasses, Zap, Swords } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import MaterialEditor from './components/MaterialEditor';
import CutsceneEditor from './components/CutsceneEditor';
import SettingsModal from './components/SettingsModal';
import TaskPanel from './components/TaskPanel';
import PipelineEditor from './components/PipelineEditor';
import GamePreview from './components/GamePreview';
import ModulePanel, { PhysicsCollisionMatrix } from './components/ModulePanel';
import PCGEditor from './components/PCGEditor';
import NiagaraEditor from './components/NiagaraEditor';
import MetaHumanEditor from './components/MetaHumanEditor';
import LogicVisualEditor from './components/LogicVisualEditor';
import UIUXEditor from './components/UIUXEditor';
import LocalAIStudio from './components/LocalAIStudio';
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
import BlueprintEditor from './components/BlueprintEditor';
import ContentBrowser from './components/ContentBrowser';
import DataTableEditor from './components/DataTableEditor';
import AssetStore from './components/AssetStore';
import StoryGraphEditor from './components/StoryGraphEditor';
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
import { IDEFile, TEMPLATES, DEFAULT_FOLDERS } from './lib/project';
import { Settings, TerminalSquare, Globe2, History } from 'lucide-react';

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

export default function App() {
  const { t } = useLanguage();
  // --- State Management ---
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Hello! I am your Offline Local AI Assistant. 100% On-Device Neural Engine Initialized. I am equipped with Deep Offline Learning capabilities allowing me to ingest knowledge from Search Engines and Video Platforms. My context memory has been upgraded to INFINITE capacity, meaning I will remember every single line of our chat forever. You can also search through our chat history using the search bar above. How can I help you today?" }
  ]);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
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
  const [activeTool, setActiveTool] = useState('Select');
  const [showEditorViewport, setShowEditorViewport] = useState(true);
  const [aiAgentMode, setAiAgentMode] = useState('developer');
  const [leftPanel, setLeftPanel] = useState<'explorer' | 'git' | 'outliner' | 'debug' | 'extensions' | 'test' | 'tasks'>('explorer');
  const [isSimulating, setIsSimulating] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showWindowMenu, setShowWindowMenu] = useState(false);
  const [bottomTab, setBottomTab] = useState<'log' | 'messages' | 'cmd' | 'content' | 'terminal' | 'problems' | 'output' | 'debugConsole' | 'chrono'>('log');

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
    developer: { name: 'Developer Assistant', icon: '🤖', color: 'bg-[#58a6ff]', context: '32K CONTEXT', model: 'OmniCode Expert' },
    copilot: { name: 'Code Copilot', icon: '💻', color: 'bg-[#3fb950]', context: '16K CONTEXT', model: 'NexusCode Core' },
    commander: { name: 'Swarm Overlord', icon: '👑', color: 'bg-[#f85149]', context: 'PIPELINE', model: 'Nexus Prime' },
    game: { name: 'Game Director', icon: '🎮', color: 'bg-[#58a6ff]', context: 'SYSTEMS', model: 'GameDir Engine' },
    story: { name: 'Lore Storyteller', icon: '📜', color: 'bg-[#e3b341]', context: 'INFINITE', model: 'LoreMaster Infinite' },
    uiux: { name: 'UX Designer', icon: '✨', color: 'bg-[#bc8cff]', context: 'V-VISION', model: 'DesignNet-Pro' },
    world: { name: 'World Builder', icon: '🌍', color: 'bg-[#3fb950]', context: 'PCG GEN', model: 'TerraGen' },
    '3d': { name: '3D Studio AI', icon: '🧊', color: 'bg-[#58a6ff]', context: 'GPU RENDER', model: 'MeshGenius' },
    vision: { name: 'Texture Gen', icon: '🎨', color: 'bg-[#e3b341]', context: 'DIFFUSION', model: 'TextureDiff' },
    audio: { name: 'AudioFX Synth', icon: '🎵', color: 'bg-[#e3b341]', context: 'DSP ENGINE', model: 'SoundNet-7.0' },
    security: { name: 'CyberSec AI', icon: '🛡️', color: 'bg-[#f85149]', context: '32K CONTEXT', model: 'VulnScan-Zero' }
  };
  const currentAgent = AGENTS[aiAgentMode as keyof typeof AGENTS];

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

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
    <nav className="h-[44px] bg-[#111] border-b border-[#000] flex items-center px-4 justify-between shrink-0 select-none text-[#ccc]">
      <div className="flex gap-4 items-center flex-1">
        <span className="font-bold text-[#fff] flex items-center gap-2 text-[13px] tracking-wide">
          <Box size={16} className="text-[#a476ed] animate-pulse"/> {t('app.title')} <span className="font-medium opacity-80 text-[#a476ed]"></span>
        </span>
        <div className="w-[1px] h-[16px] bg-[#333] mx-2 hidden md:block"></div>
        <div className="hidden md:flex gap-1 text-[11px] text-[#ccc] font-medium cursor-pointer ml-2 items-center">
          <button className="px-2 py-1 hover:bg-[#333] rounded transition-colors flex items-center gap-1"><FileCode2 size={12}/> File</button>
          <button className="px-2 py-1 hover:bg-[#333] rounded transition-colors">Edit</button>
          <button className="px-2 py-1 hover:bg-[#333] rounded transition-colors">Window</button>
          <button className="px-2 py-1 hover:bg-[#333] rounded transition-colors">Tools</button>
          <button className="px-2 py-1 hover:bg-[#333] rounded transition-colors">Build</button>
          <button className="px-2 py-1 hover:bg-[#333] rounded transition-colors">Help</button>
        </div>
      </div>
      
      {/* Simulation Controls - Center */}
      <div className="hidden lg:flex items-center gap-1 bg-[#1a1a1a] border border-[#30363d] rounded-md p-1 mx-4 shadow-inner">
        <button 
          onClick={() => setIsSimulating(!isSimulating)}
          className={`px-3 py-1.5 rounded-sm flex items-center gap-2 text-[11px] font-bold transition-all ${isSimulating ? 'text-[#3fb950]' : 'text-[#3fb950] hover:bg-[#222]'}`}
        >
           <Play size={14} fill={isSimulating ? 'currentColor' : 'currentColor'}/>
        </button>
        <button className="px-3 py-1.5 rounded-sm text-[#888] hover:bg-[#222] hover:text-[#fff] transition-colors">
           <Pause size={14} fill="currentColor"/>
        </button>
        <button 
          onClick={() => setIsSimulating(false)}
          className="px-3 py-1.5 rounded-sm text-[#888] hover:bg-[#222] hover:text-[#fff] transition-colors"
        >
           <Square size={14} fill="currentColor"/>
        </button>
        <div className="w-[1px] h-[16px] bg-[#333] mx-1"></div>
        <button className="px-3 py-1.5 rounded-sm text-[#888] hover:bg-[#222] hover:text-[#fff] transition-colors">
           <MessageSquare size={14} />
        </button>
      </div>
      
      <div className="hidden xl:flex items-center gap-3 px-3 py-1 bg-[#0a0a0a] border border-[#222] rounded shadow-inner text-[9px] font-mono whitespace-nowrap">
          <div className="flex flex-col">
            <span className="text-[#888]">FPS</span>
            <span className="text-[#3fb950] font-bold">59.9</span>
          </div>
          <div className="w-[1px] h-[16px] bg-[#333]"></div>
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

      <div className="flex gap-4 items-center flex-1 justify-end mr-4">
        <button className="hidden xl:flex items-center gap-1.5 text-[11px] text-[#ccc] hover:text-[#fff] px-2 py-1">
          <Play size={12} fill="currentColor"/> Play ▼
        </button>
        <button className="hidden xl:flex items-center gap-1.5 text-[11px] text-[#ccc] hover:text-[#fff] px-2 py-1">
          <Layers size={12}/> Platforms ▼
        </button>
        <div className="w-[1px] h-[16px] bg-[#333] mx-2 hidden xl:block"></div>
        <div className="text-[11px] text-[#888] mr-4 hidden xl:block tracking-wide">
          Project: <span className="text-[#ccc] ml-1">FantasyWorld</span>
        </div>
        <div className="flex gap-4 text-[#888] ml-2">
          <span className="hover:text-[#fff] cursor-pointer">—</span>
          <span className="hover:text-[#fff] cursor-pointer drop-shadow">□</span>
          <span className="hover:text-[#fff] cursor-pointer font-bold">✕</span>
        </div>
      </div>
    </nav>
  );

  const renderVerticalToolbar = () => {
    const tools = [
      { id: 'Select', title: 'Code Editor', icon: <Bot size={20} />, activeColor: 'text-[#58a6ff]' },
      { id: 'Pipeline', title: 'AI Swarm Pipeline', icon: <GitPullRequest size={20} />, activeColor: 'text-[#3fb950]' },
      { id: 'EngineCore', title: 'Game Engine Architecture (GameObject, Core)', icon: <Cpu size={20} />, activeColor: 'text-[#58a6ff]' },
      { id: 'GraphicsRender', title: 'Graphics & Rendering Tech (Nanite, Lumen, DLSS)', icon: <MonitorPlay size={20} />, activeColor: 'text-[#ff7b72]' },
      { id: 'PhysicsEngine', title: 'Universal Physics Dynamics', icon: <Orbit size={20} />, activeColor: 'text-[#f85149]' },
      { id: 'InputMapping', title: 'Input & Controller Mapping', icon: <Gamepad2 size={20} />, activeColor: 'text-[#58a6ff]' },
      { id: 'AnimationAudio', title: 'Skeletal Anim, MoCap & Audio', icon: <Activity size={20} />, activeColor: 'text-[#e3b341]' },
      { id: 'BackendCloud', title: 'Server, Cloud, Sync & Economy', icon: <Cloud size={20} />, activeColor: 'text-[#bc8cff]' },
      { id: 'ServerSim', title: 'Multiplayer Backend & Server Simulation', icon: <Server size={20} />, activeColor: 'text-[#3fb950]' },
      { id: 'AITestingQA', title: 'AI Offline QA, Perf Metric & Debug', icon: <ShieldCheck size={20} />, activeColor: 'text-[#2ea043]' },
      { id: 'WorldBible', title: 'World Bible (Lore & Setup)', icon: <BookOpen size={20} />, activeColor: 'text-[#d2a8ff]' },
      { id: 'GameSystems', title: 'AAA Game Systems Architecture', icon: <Blocks size={20} />, activeColor: 'text-[#58a6ff]' },
      { id: 'ScriptEditor', title: 'IDE & Script Editor', icon: <TerminalSquare size={20} />, activeColor: 'text-[#ff7b72]' },
      { id: 'AssetPipeline', title: 'Asset Pipeline & Source Control', icon: <FolderTree size={20} />, activeColor: 'text-[#3fb950]' },
      { id: 'BuildPublish', title: 'One-Click Build & Pipeline', icon: <Globe2 size={20} />, activeColor: 'text-[#3fb950]' },
      { id: 'MapEdit', title: 'Apex Map Builder', icon: <Map size={20} />, activeColor: 'text-[#58a6ff]' },
      { id: 'NPCEdit', title: 'Deep NPC Builder', icon: <Users size={20} />, activeColor: 'text-[#ff7b72]' },
      { id: 'MonsterEdit', title: 'Monster & Entities Builder', icon: <Ghost size={20} />, activeColor: 'text-[#e3b341]' },
      { id: 'Modeling', title: 'Apex 3D/2D Modeling Studio', icon: <Box size={20} />, activeColor: 'text-[#e3b341]' },
      { id: 'Landscape', title: 'Apex Terrain Editor', icon: <Mountain size={20} />, activeColor: 'text-[#3fb950]' },
      { id: 'PCG', title: 'Procedural Content Generation', icon: <Workflow size={20} />, activeColor: 'text-[#ff7b72]' },
      { id: 'ControlRig', title: 'Control Rig & MoCap', icon: <PersonStanding size={20} />, activeColor: 'text-[#ff7b72]' },
      { id: 'Sequencer', title: 'Apex Timeline Sequencer', icon: <Clapperboard size={20} />, activeColor: 'text-[#bc8cff]' },
      { id: 'MetaHuman', title: 'MetaHuman System', icon: <UserSquare size={20} />, activeColor: 'text-[#58a6ff]' },
      { id: 'Blueprint', title: 'Visual Scripting (Kismet)', icon: <Waypoints size={20} />, activeColor: 'text-[#3fb950]' },
      { id: 'BlueprintGen', title: 'Blueprint AI Generator', icon: <Network size={20} />, activeColor: 'text-[#bc8cff]' },
      { id: 'LogicVisual', title: 'Event Sheet Logic (GDevelop/Code.org)', icon: <Puzzle size={20} />, activeColor: 'text-[#3fb950]' },
      { id: 'BehaviorTree', title: 'AI Behavior Tree Editor', icon: <Network size={20} />, activeColor: 'text-[#e3b341]' },
      { id: 'DataTable', title: 'Data Table & Spreadsheets', icon: <Database size={20} />, activeColor: 'text-[#3fb950]' },
      { id: 'AssetStore', title: 'Marketplace & Asset Store', icon: <ShoppingCart size={20} />, activeColor: 'text-[#bc8cff]' },
      { id: 'StoryGraph', title: 'Story & Narrative Graph', icon: <MessageSquare size={20} />, activeColor: 'text-[#ff7b72]' },
      { id: 'Material', title: 'Node Material Editor', icon: <Palette size={20} />, activeColor: 'text-[#e3b341]' },
      { id: 'Niagara', title: 'Niagara Particle FX', icon: <Sparkles size={20} />, activeColor: 'text-[#bc8cff]' },
      { id: 'MetaSound', title: 'Audio Mixer', icon: <Music size={20} />, activeColor: 'text-[#e3b341]' },
      { id: 'ImageEdit', title: 'Image & Texture Editor', icon: <Image size={20} />, activeColor: 'text-[#bc8cff]' },
      { id: 'AudioEdit', title: 'Audio Studio & SFX', icon: <AudioWaveform size={20} />, activeColor: 'text-[#3fb950]' },
      { id: 'EffectEdit', title: 'VFX & Hitbox Studio', icon: <Flame size={20} />, activeColor: 'text-[#ff7b72]' },
      { id: 'UIUXEdit', title: 'Apex UI/UX Builder', icon: <LayoutDashboard size={20} />, activeColor: 'text-[#58a6ff]' },
      { id: 'SkillForge', title: 'Ultimate Skill Forge', icon: <Swords size={20} />, activeColor: 'text-[#ff7b72]' },
      
      { id: 'LocalAI', title: 'Local AI Compute Studio', icon: <BrainCircuit size={20} />, activeColor: 'text-[#e3b341]' },
      { id: 'WorldBuilder', title: '🌍 Nano-to-Macro World Builder', icon: <Globe size={20} />, activeColor: 'text-[#3fb950]' },
      { id: 'SentientAI', title: '🧠 Sentient AI & NPCDirector', icon: <Brain size={20} />, activeColor: 'text-[#f85149]' },
      { id: 'ProceduralAsset', title: '🎬 Procedural Asset Studio', icon: <FlaskConical size={20} />, activeColor: 'text-[#bc8cff]' },
      { id: 'DevOpsManager', title: '🛡️ System Architecture & DevOps Manager', icon: <Server size={20} />, activeColor: 'text-[#58a6ff]' },
      { id: 'LevelDesign', title: 'Level Assembly (Blockout & ProBuilder)', icon: <Mountain size={20} />, activeColor: 'text-[#e3b341]' },
      { id: 'DialogueQuest', title: 'RPG Maker Quest & Dialogue Systems', icon: <BookOpen size={20} />, activeColor: 'text-[#bc8cff]' },
      { id: 'PerformanceProfile', title: 'AAA Perf Profiler & Deep Bug Hunter', icon: <Bug size={20} />, activeColor: 'text-[#f85149]' },
      { id: 'AnimGraph', title: 'Cascadeur Animation & Deep IK', icon: <PersonStanding size={20} />, activeColor: 'text-[#e3b341]' },
      { id: 'CharacterAnimator', title: 'AI Character Animator', icon: <PersonStanding size={20} />, activeColor: 'text-[#3fb950]' },
      { id: 'ProceduralGen', title: 'Houdini-Style PCG World Gen', icon: <Layers size={20} />, activeColor: 'text-[#3fb950]' },
      { id: 'Netcode', title: 'Rollback Multiplayer & Servers', icon: <Globe size={20} />, activeColor: 'text-[#58a6ff]' },
      { id: 'LiveOps', title: 'LiveOps, Analytics & Economy', icon: <TrendingUp size={20} />, activeColor: 'text-[#bc8cff]' },
      { id: 'CinematicSequencer', title: 'Timeline & Cinematic Sequencer', icon: <Clapperboard size={20} />, activeColor: 'text-[#58a6ff]' },
      { id: 'AdvancedNavMesh', title: 'NavMesh & Crowd AI', icon: <Users size={20} />, activeColor: 'text-[#e3b341]' },
      { id: 'HD2DHybridEditor', title: '2.5D / HD-2D Hybrid Engine', icon: <Layers size={20} />, activeColor: 'text-[#3fb950]' },
      { id: 'VoxelEngine', title: 'Voxel & Destruction Engine', icon: <Box size={20} />, activeColor: 'text-[#f85149]' },
      { id: 'VehiclePhysics', title: 'Vehicle Dynamics Configurator', icon: <Activity size={20} />, activeColor: 'text-[#e3b341]' },
      { id: 'MLAgents', title: 'Machine Learning Training Room', icon: <BrainCircuit size={20} />, activeColor: 'text-[#3fb950]' },
      { id: 'VRXREngine', title: 'OpenXR VR/MR Development Hub', icon: <Glasses size={20} />, activeColor: 'text-[#bc8cff]' },
      { id: 'BatchAI', title: 'Batch AI Asset Generator', icon: <Cloud size={20} />, activeColor: 'text-[#e3b341]' },
      { id: 'DevOpsBuilder', title: 'Cross-Platform Matrix & DevOps Config', icon: <Terminal size={20} />, activeColor: 'text-[#58a6ff]' },
      { id: 'ASTNodeWeaver', title: 'AST Logic Weaver (Nodes)', icon: <Workflow size={20} />, activeColor: 'text-[#ff7b72]' },
    ];

    return (
      <div className="w-[48px] bg-[#111] border-r border-[#222] hidden md:flex flex-col items-center py-2 shrink-0 justify-between overflow-y-auto custom-scrollbar drop-shadow-lg">
        <div className="flex flex-col gap-3 items-center w-full">
          {tools.map(t => (
            <button 
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              title={t.title}
              className={`p-2 rounded-lg transition-colors ${activeTool === t.id ? `bg-[#222] ${t.activeColor} shadow-inner border border-[#333]` : 'text-[#888] hover:text-[#fff] hover:bg-[#1a1a1a]'}`}
            >
              {t.icon}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3 items-center w-full mb-2">
           <button 
             onClick={() => setShowSettingsModal(true)}
             title="Engine Preferences & AI Cluster"
             className="p-2 rounded-lg text-[#888] hover:text-[#fff] hover:bg-[#1a1a1a] transition-colors"
           >
             <Settings size={20} />
           </button>
        </div>
      </div>
    );
  };

  const renderSidebar = () => {
    // Determine the title of the sidebar depending on the global active tool
    const isCodeIDE = activeTool === 'Select';
    
    return (
      <aside className={`w-full md:w-[260px] bg-[#1a1a1a] border-r border-[#000] flex-col shrink-0 ${mobileView === 'explorer' ? 'flex' : 'hidden'} md:flex h-full`}>
        {isCodeIDE ? (
          <div className="flex bg-[#111] shrink-0 h-[36px] items-center px-1 overflow-x-auto custom-scrollbar">
            <button 
              onClick={() => setLeftPanel('explorer')}
              className={`px-3 py-1 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors rounded shrink-0 ${leftPanel === 'explorer' ? 'text-[#fff] bg-[#222]' : 'text-[#888] hover:text-[#fff]'}`}
            >
              <FolderTree size={14} /> {t('sidebar.explorer')}
            </button>
            <button 
              onClick={() => setLeftPanel('debug')}
              className={`px-3 py-1 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors rounded shrink-0 ${leftPanel === 'debug' ? 'text-[#fff] bg-[#222]' : 'text-[#888] hover:text-[#fff]'}`}
            >
              <Bug size={14} /> DEBUG
            </button>
            <button 
              onClick={() => setLeftPanel('git')}
              className={`px-3 py-1 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors rounded shrink-0 ${leftPanel === 'git' ? 'text-[#fff] bg-[#222]' : 'text-[#888] hover:text-[#fff]'}`}
            >
              <GitBranch size={14} /> SOURCE
            </button>
            <button 
              onClick={() => setLeftPanel('test')}
              className={`px-3 py-1 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors rounded shrink-0 ${leftPanel === 'test' ? 'text-[#fff] bg-[#222]' : 'text-[#888] hover:text-[#fff]'}`}
            >
              <FlaskConical size={14} /> TEST
            </button>
            <button 
              onClick={() => setLeftPanel('extensions')}
              className={`px-3 py-1 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors rounded shrink-0 ${leftPanel === 'extensions' ? 'text-[#fff] bg-[#222]' : 'text-[#888] hover:text-[#fff]'}`}
            >
              <Puzzle size={14} /> EXTENSIONS
            </button>
            <button 
              onClick={() => setLeftPanel('tasks')}
              className={`px-3 py-1 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors rounded shrink-0 ${leftPanel === 'tasks' ? 'text-[#fff] bg-[#222]' : 'text-[#888] hover:text-[#fff]'}`}
            >
              <CheckCircle size={14} /> TASKS
            </button>
          </div>
        ) : (
          <div className="flex bg-[#111] shrink-0 h-[36px] items-center px-1">
            <button 
              onClick={() => setLeftPanel('explorer')}
              className={`px-3 py-1 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors rounded ${leftPanel === 'explorer' ? 'text-[#fff] bg-[#222]' : 'text-[#888] hover:text-[#fff]'}`}
            >
              <UserSquare size={14} /> ACTORS
            </button>
            <button 
              onClick={() => setLeftPanel('outliner')}
              className={`px-3 py-1 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors rounded ${leftPanel === 'outliner' ? 'text-[#fff] bg-[#222]' : 'text-[#888] hover:text-[#fff]'}`}
            >
              <Box size={14} /> WORLD
            </button>
            <button 
              onClick={() => setLeftPanel('git')}
              className={`px-3 py-1 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors rounded ${leftPanel === 'git' ? 'text-[#fff] bg-[#222]' : 'text-[#888] hover:text-[#fff]'}`}
            >
              <FolderTree size={14} /> EXPLORER
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
    <div className="min-h-[44px] md:min-h-[35px] bg-[#161b22] flex border-b border-[#30363d] shrink-0 custom-scrollbar relative z-10 w-full justify-between overflow-visible">
      <div className="flex overflow-x-auto hide-scrollbar flex-1">
        {files.map(f => (
          <div 
            key={f.id}
            onClick={() => { setActiveFileId(f.id); setActiveTool('Select'); }}
            className={`px-5 flex items-center text-[13px] md:text-[12px] border-r border-[#30363d] cursor-pointer whitespace-nowrap transition-colors select-none ${
              f.id === activeFileId && activeTool === 'Select'
                ? 'bg-[#0d1117] text-[#c9d1d9] font-medium border-t-[2px] border-t-[#58a6ff]'
                : 'text-[#8b949e] hover:bg-[#21262d] border-t-[2px] border-t-transparent'
            }`}
          >
            {f.name}
          </div>
        ))}
        <div 
          onClick={() => setActiveTool('AssetStore')}
          className={`px-5 flex items-center gap-1.5 text-[13px] md:text-[12px] border-r border-[#30363d] cursor-pointer whitespace-nowrap transition-colors select-none ${
            activeTool === 'AssetStore'
              ? 'bg-[#0d1117] text-[#bc8cff] font-medium border-t-[2px] border-t-[#bc8cff]'
              : 'text-[#8b949e] hover:bg-[#21262d] border-t-[2px] border-t-transparent'
          }`}
        >
          <ShoppingCart size={14} /> Asset Store
        </div>
      </div>
      {activeTool === 'Select' && (
        <div className="flex items-center px-3 border-l border-[#30363d] shrink-0 bg-[#161b22]">
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
    <aside className={`w-full md:w-[320px] lg:w-[380px] flex-col bg-[#161b22] border-l border-[#30363d] shrink-0 z-10 h-full ${mobileView === 'chat' ? 'flex' : 'hidden'} md:flex`}>
      <div className="p-4 md:p-3 bg-[#0d1117] md:bg-transparent border-b border-[#30363d] flex flex-col gap-1 shrink-0 relative">
        <div className="absolute right-4 top-3 flex gap-1">
          <span className="text-[#3fb950] font-mono text-[9px] bg-[#3fb950]/10 border border-[#3fb950]/20 px-1 py-0.5 rounded" title="Memory Core: Keeping last 50 messages + project context">
             50/50 MEMORY
          </span>
          <span className="text-[#58a6ff] font-mono text-[9px] bg-[#58a6ff]/10 border border-[#58a6ff]/20 px-1 py-0.5 rounded" title="Context Space: 16 Million Tokens">
             16M CONTEXT
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 ${currentAgent.color} rounded-full animate-pulse`}></div>
            <select 
              value={aiAgentMode}
              onChange={(e) => setAiAgentMode(e.target.value)}
              className="bg-transparent text-[14px] md:text-[13px] font-semibold text-[#c9d1d9] outline-none cursor-pointer hover:text-[#58a6ff] transition-colors"
            >
              {Object.entries(AGENTS).map(([key, agent]) => (
                <option key={key} value={key} className="bg-[#161b22] text-[#c9d1d9]">
                  {agent.icon} {agent.name}
                </option>
              ))}
            </select>
          </div>
          <span className={`text-[10px] ${currentAgent.color} text-[#fff] px-1.5 py-0.5 rounded font-mono shadow-sm`}>{currentAgent.context}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] md:text-[10px] text-[#8b949e] mt-1">
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
    <footer className="h-[28px] bg-[#58a6ff] text-black items-center px-3 text-[11px] font-semibold tracking-wide shrink-0 justify-between hidden md:flex">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1"><Sparkles size={12}/> ENGINE READY</span>
        <span className="font-mono hidden xl:block">LN 1, COL 1</span>
        <span className="uppercase tracking-widest hidden xl:block">{activeFile?.language || 'CORE'}</span>
        <span className="bg-[#0d1117] text-[#58a6ff] px-2 py-0.5 rounded-sm flex items-center shadow-inner gap-1">
          <MonitorPlay size={10}/> NEXT-GEN TARGET: <span className="text-[#3fb950] font-bold">144FPS / LOW SPEC</span>
        </span>
        <span className="bg-[#000] text-[#e3b341] px-2 py-0.5 rounded-sm flex items-center shadow-inner gap-1">
          <Zap size={10}/> AI AUTO-OPTIMIZATION: <span className="font-bold text-white">ACTIVE</span>
        </span>
      </div>
      <div className="flex items-center gap-4 cursor-pointer hover:underline">
        <span className="flex items-center gap-1 font-bold text-black"><Play size={12} fill="currentColor"/> 1-CLICK RAPID BUILD (WINDOWS / MOBILE)</span>
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
    <aside className="w-[280px] bg-[#161616] border-l border-[#222] hidden xl:flex flex-col shrink-0 z-10 h-full">
      <div className="p-3 text-[11px] uppercase tracking-[1px] text-[#fff] font-bold bg-[#0a0a0a] border-b border-[#222]">Details (Inspector)</div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 text-[12px] text-[#888]">
         {activeTool === 'Select' ? (
           <div className="flex flex-col gap-3">
             <div className="text-[#fff] font-bold border-b border-[#333] pb-1 tracking-wider uppercase text-[11px] mb-1">File Properties</div>
             <div className="flex justify-between"><span className="text-[#888]">Name:</span> <span className="text-[#ccc] truncate">{activeFile?.name}</span></div>
             <div className="flex justify-between"><span className="text-[#888]">Type:</span> <span className="text-[#ccc] uppercase">{activeFile?.language}</span></div>
             <div className="flex justify-between"><span className="text-[#888]">Size:</span> <span className="text-[#ccc]">{(activeFile?.content.length || 0)} bytes</span></div>
           </div>
         ) : activeTool === 'Material' ? (
           <div className="flex flex-col gap-3">
             <div className="text-[#fff] font-bold border-b border-[#333] pb-1 uppercase tracking-wider text-[11px] mb-1">Shader Properties</div>
             <div className="flex justify-between items-center"><span className="text-[#888]">Blend Mode:</span> <select className="bg-[#111] border border-[#333] rounded px-1 text-right text-[#ccc] outline-none focus:border-[#58a6ff]"><option>Opaque</option><option>Masked</option><option>Translucent</option></select></div>
             <div className="flex justify-between items-center"><span className="text-[#888]">Shading Model:</span> <select className="bg-[#111] border border-[#333] rounded px-1 text-right text-[#ccc] outline-none focus:border-[#58a6ff]"><option>Default Lit</option><option>Unlit</option><option>Clear Coat</option></select></div>
             <div className="flex justify-between items-center"><span className="text-[#888]">Two Sided:</span> <input type="checkbox" className="w-3 h-3 border-[#333] accent-[#58a6ff]" /></div>
             <div className="flex justify-between items-center"><span className="text-[#888]">Is Wireframe:</span> <input type="checkbox" className="w-3 h-3 border-[#333] accent-[#58a6ff]" /></div>
             <div className="mt-4 text-[#fff] font-bold border-b border-[#333] pb-1 uppercase tracking-wider text-[11px] mb-1">Graph Stats</div>
             <div className="flex justify-between text-[10px]"><span className="text-[#888]">Instructions:</span> <span className="text-[#ccc]">142 ALU, 3 Tex</span></div>
             <div className="flex justify-between text-[10px]"><span className="text-[#888]">Samplers:</span> <span className="text-[#3fb950] font-bold">3/16</span></div>
           </div>
         ) : (
           <div className="flex flex-col gap-3">
             <div className="text-[#fff] font-bold border-b border-[#333] pb-1 uppercase tracking-wider text-[11px] mb-1">Context Inspector</div>
             <div className="flex justify-between items-center"><span className="text-[#888]">Target:</span> <span className="text-[#3fb950] font-mono uppercase bg-[#3fb950]/10 px-1 py-0.5 rounded border border-[#3fb950]/20 text-[10px] truncate max-w-[120px] text-right">{activeTool}</span></div>
             
             <div className="mt-2 text-[#fff] font-bold border-b border-[#333] pb-1 uppercase tracking-wider text-[11px] mb-1 text-[#bc8cff] flex items-center gap-1"><Sparkles size={12}/> AI Copilot Actions</div>
             <div className="flex flex-col gap-1.5">
               <button className="bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 py-1.5 rounded transition-colors text-[10px] font-bold tracking-wide uppercase flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(188,140,255,0.1)]">Auto-Optimize Scene</button>
               <button className="bg-[#58a6ff]/10 hover:bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/30 py-1.5 rounded transition-colors text-[10px] font-bold tracking-wide uppercase flex items-center justify-center gap-2">Generate Blueprints</button>
               <button className="bg-[#e3b341]/10 hover:bg-[#e3b341]/20 text-[#e3b341] border border-[#e3b341]/30 py-1.5 rounded transition-colors text-[10px] font-bold tracking-wide uppercase flex items-center justify-center gap-2">Audit Performance</button>
             </div>

             <div className="mt-2 text-[#fff] font-bold border-b border-[#333] pb-1 uppercase tracking-wider text-[11px] mb-1">Global Rendering</div>
             <div className="flex justify-between items-center"><span className="text-[#888]">Target FPS:</span> <select className="bg-[#111] border border-[#333] rounded px-1 text-right text-[#ccc] outline-none focus:border-[#58a6ff] text-[10px]"><option>60 FPS</option><option selected>144 FPS</option></select></div>
             <div className="flex justify-between items-center"><span className="text-[#888]">Nanite Instancing:</span> <span className="text-[#3fb950] font-bold text-[10px]">Active</span></div>
             <div className="flex justify-between items-center"><span className="text-[#888]">Virtual Shadow Maps:</span> <span className="text-[#3fb950] font-bold text-[10px]">Active</span></div>
             <div className="flex justify-between items-center"><span className="text-[#888]">DLSS / FSR:</span> <span className="text-[#3fb950] font-bold text-[10px]">FSR 3.0</span></div>

             <div className="mt-2 text-[#fff] font-bold border-b border-[#333] pb-1 uppercase tracking-wider text-[11px] mb-1">Transform</div>
             <div className="flex justify-between items-center"><span className="text-[#888]">Pos X:</span> <input type="number" className="w-16 bg-[#111] border border-[#333] rounded px-1 text-right text-[#f85149] font-mono outline-none focus:border-[#58a6ff]" defaultValue="0.0" /></div>
             <div className="flex justify-between items-center"><span className="text-[#888]">Pos Y:</span> <input type="number" className="w-16 bg-[#111] border border-[#333] rounded px-1 text-right text-[#3fb950] font-mono outline-none focus:border-[#58a6ff]" defaultValue="0.0" /></div>
             <div className="flex justify-between items-center"><span className="text-[#888]">Pos Z:</span> <input type="number" className="w-16 bg-[#111] border border-[#333] rounded px-1 text-right text-[#58a6ff] font-mono outline-none focus:border-[#58a6ff]" defaultValue="0.0" /></div>
             
             <div className="flex justify-between items-center mt-1"><span className="text-[#888]">Rot X:</span> <input type="number" className="w-16 bg-[#111] border border-[#333] rounded px-1 text-right text-[#f85149] font-mono outline-none focus:border-[#58a6ff]" defaultValue="0.0" /></div>
             <div className="flex justify-between items-center"><span className="text-[#888]">Rot Y:</span> <input type="number" className="w-16 bg-[#111] border border-[#333] rounded px-1 text-right text-[#3fb950] font-mono outline-none focus:border-[#58a6ff]" defaultValue="0.0" /></div>
             <div className="flex justify-between items-center"><span className="text-[#888]">Rot Z:</span> <input type="number" className="w-16 bg-[#111] border border-[#333] rounded px-1 text-right text-[#58a6ff] font-mono outline-none focus:border-[#58a6ff]" defaultValue="0.0" /></div>
             
             <div className="flex justify-between items-center mt-1"><span className="text-[#888]">Scale Uni:</span> <input type="number" className="w-16 bg-[#111] border border-[#333] rounded px-1 text-right text-[#e3b341] font-mono outline-none focus:border-[#58a6ff]" defaultValue="1.0" /></div>

             <div className="mt-4 text-[#fff] font-bold border-b border-[#333] pb-1 flex justify-between items-center uppercase tracking-wider text-[11px] mb-1">
                <span>Material Slots</span>
                <button className="text-[#58a6ff] hover:text-[#fff] text-[16px] leading-[0] mb-0.5">+</button>
             </div>
             <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-6 h-6 bg-[#111] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,1)] border border-[#333] shrink-0 pointer-events-none"></div>
                <button className="flex-1 bg-[#111] p-1.5 rounded-sm text-left border border-[#333] group-hover:border-[#58a6ff] transition-colors truncate text-[11px] text-[#ccc]">M_BaseDefault</button>
             </div>

             <div className="mt-4 text-[#fff] font-bold border-b border-[#333] pb-1 uppercase tracking-wider text-[11px] mb-2">
                 Physics Collision Matrix
             </div>
             <PhysicsCollisionMatrix />
           </div>
         )}
      </div>
    </aside>
  );

  const renderBottomPanel = () => {
    const isCodeIDE = activeTool === 'Select';
    return (
      <div className={`h-[250px] bg-[#0a0a0a] border-t border-[#222] shrink-0 font-mono text-[11px] flex flex-col z-20 ${showConsole || isCodeIDE ? 'flex' : 'hidden'} shadow-[0_-5px_20px_rgba(0,0,0,0.5)]`}>
        <div className="flex bg-[#111] border-b border-[#222] text-[#888] overflow-x-auto hide-scrollbar shrink-0">
          {isCodeIDE ? (
            <>
              <button onClick={() => setBottomTab('problems')} className={`px-4 py-1.5 border-b-[3px] transition-colors flex items-center gap-1.5 font-bold uppercase tracking-[1px] text-[10px] shrink-0 ${bottomTab === 'problems' ? 'border-[#58a6ff] text-[#fff]' : 'border-transparent hover:text-[#fff]'}`}><Bug size={12}/> Problems <span className="bg-[#161b22] px-1 rounded-full text-[9px] text-[#f85149]">3</span></button>
              <button onClick={() => setBottomTab('output')} className={`px-4 py-1.5 border-b-[3px] transition-colors flex items-center gap-1.5 font-bold uppercase tracking-[1px] text-[10px] shrink-0 ${bottomTab === 'output' ? 'border-[#58a6ff] text-[#fff]' : 'border-transparent hover:text-[#fff]'}`}><Activity size={12}/> Output</button>
              <button onClick={() => setBottomTab('chrono')} className={`px-4 py-1.5 border-b-[3px] transition-colors flex items-center gap-1.5 font-bold uppercase tracking-[1px] text-[10px] shrink-0 ${bottomTab === 'chrono' ? 'border-[#a371f7] text-[#fff]' : 'border-transparent hover:text-[#a371f7]'}`}><History size={12}/> Chrono-State Debugger</button>
              <button onClick={() => setBottomTab('debugConsole')} className={`px-4 py-1.5 border-b-[3px] transition-colors flex items-center gap-1.5 font-bold uppercase tracking-[1px] text-[10px] shrink-0 ${bottomTab === 'debugConsole' ? 'border-[#58a6ff] text-[#fff]' : 'border-transparent hover:text-[#fff]'}`}><Server size={12}/> Debug Console</button>
              <button onClick={() => setBottomTab('terminal')} className={`px-4 py-1.5 border-b-[3px] transition-colors flex items-center gap-1.5 font-bold uppercase tracking-[1px] text-[10px] shrink-0 ${bottomTab === 'terminal' || !['problems', 'output', 'debugConsole', 'chrono'].includes(bottomTab) ? 'border-[#58a6ff] text-[#fff]' : 'border-transparent hover:text-[#fff]'}`}><Terminal size={12}/> Terminal</button>
            </>
          ) : (
            <>
              <button onClick={() => setBottomTab('content')} className={`px-4 py-1.5 border-b-[3px] transition-colors flex items-center gap-1.5 font-bold uppercase tracking-[1px] text-[10px] shrink-0 ${bottomTab === 'content' ? 'border-[#58a6ff] text-[#fff]' : 'border-transparent hover:text-[#fff]'}`}><FolderTree size={12}/> Content Drawer</button>
              <button onClick={() => setBottomTab('log')} className={`px-4 py-1.5 border-b-[3px] transition-colors flex items-center gap-1.5 font-bold uppercase tracking-[1px] text-[10px] shrink-0 ${bottomTab === 'log' ? 'border-[#58a6ff] text-[#fff]' : 'border-transparent hover:text-[#fff]'}`}><Terminal size={12}/> Output Log</button>
              <button onClick={() => setBottomTab('cmd')} className={`px-4 py-1.5 border-b-[3px] transition-colors flex items-center gap-1.5 font-bold uppercase tracking-[1px] text-[10px] shrink-0 ${bottomTab === 'cmd' ? 'border-[#58a6ff] text-[#fff]' : 'border-transparent hover:text-[#fff]'}`}><Server size={12}/> Cmd</button>
            </>
          )}
          {!isCodeIDE && <button className="px-4 py-1.5 ml-auto border-transparent hover:text-[#fff] transition-colors shrink-0" onClick={() => setShowConsole(false)}>X</button>}
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar flex">
          {!isCodeIDE && bottomTab === 'content' ? (
            <ContentBrowser onOpenBlueprint={() => setActiveTool('Blueprint')} />
          ) : isCodeIDE ? (
            <div className="flex-1 p-4 flex flex-col gap-1 text-[#ccc] font-mono text-[12px]">
              {bottomTab === 'terminal' || !['problems', 'output', 'debugConsole', 'chrono'].includes(bottomTab) ? (
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
  };

  // ---------------------------------------------------------------------------
  // Main Render
  // ---------------------------------------------------------------------------
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#0a0a0a] text-[#ccc] font-['Helvetica_Neue',Arial,sans-serif] overflow-hidden">
      {renderTopNavigation()}

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden w-full relative">
        {renderVerticalToolbar()}
        {renderSidebar()}

        {/* Editor Area */}
        <section className={`flex-1 flex-col min-w-0 bg-[#0a0a0a] ${mobileView === 'editor' ? 'flex' : 'hidden'} md:flex h-full`}>
          {renderTabs()}
          
          <div className="flex-1 flex flex-col min-h-0 relative h-full">
            {isSimulating && <GamePreview files={files} />}
            <div className={`flex-1 min-h-0 relative ${isSimulating ? 'hidden' : 'block'}`}>
               {activeTool === 'Select' && (
                 <div className="flex w-full h-full">
                   <div className="flex-1 min-w-0 border-r border-[#30363d] relative">
                     <CodeEditor 
                       code={activeFile?.content || ''} 
                       setCode={setCode} 
                       language={activeFile?.language || 'plaintext'} 
                       setLanguage={setLanguage} 
                     />
                   </div>
                   {showEditorViewport && (
                     <div className="flex-1 min-w-0 relative">
                       <Viewport3D activeTool={activeTool} activeFile={activeFile} />
                     </div>
                   )}
                 </div>
               )}
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
               {['NPCEdit', 'MonsterEdit'].includes(activeTool) && <NPCEditor initialTab={activeTool === 'MonsterEdit' ? 'Monsters' : 'NPCs'} />}
               {['ControlRig', 'Modeling'].includes(activeTool) && <ModelingEditor />}
               {activeTool === 'ScriptEditor' && <ScriptEditor />}
               {['AITestingQA', 'PerformanceProfile'].includes(activeTool) && <PerformanceProfiler />}
               {['Sequencer', 'CinematicSequencer'].includes(activeTool) && (
                 <CutsceneEditor />
               )}
               {activeTool === 'DataTable' && <DataTableEditor />}
               {activeTool === 'AssetStore' && <AssetStore />}
               {activeTool === 'StoryGraph' && <StoryGraphEditor />}
               {activeTool === 'BehaviorTree' && <BehaviorTreeEditor />}
               {activeTool === 'LogicVisual' && <LogicVisualEditor />}
               {activeTool === 'MetaHuman' && <MetaHumanEditor />}
               {activeTool === 'Niagara' && <NiagaraEditor />}
               {['PCG', 'ProceduralGen'].includes(activeTool) && <PCGEditor />}
               {activeTool === 'UIUXEdit' && <UIUXEditor />}
               {activeTool === 'SkillForge' && <SkillForgeEditor setActiveTool={setActiveTool} />}
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
               {!['Select', 'BatchAI', 'Material', 'Pipeline', 'Blueprint', 'ServerSim', 'DataTable', 'AssetStore', 'StoryGraph', 'BehaviorTree', 'LogicVisual', 'MetaHuman', 'Niagara', 'PCG', 'UIUXEdit', 'SkillForge', 'LocalAI', 'LiveOps', 'PerformanceProfile', 'AnimGraph', 'CharacterAnimator', 'Landscape', 'MapEdit', 'Netcode', 'EngineCore', 'LevelDesign', 'QuestDirector', 'Modeling', 'WorldBible', 'NPCEdit', 'MonsterEdit', 'PhysicsEngine', 'GameSystems', 'GraphicsRender', 'AnimationAudio', 'BackendCloud', 'AITestingQA', 'ControlRig', 'Sequencer', 'CinematicSequencer', 'MetaSound', 'ImageEdit', 'AudioEdit', 'EffectEdit', 'ScriptEditor', 'BuildPublish', 'AssetPipeline', 'DialogueQuest', 'ProceduralGen', 'AdvancedNavMesh', 'VoxelEngine', 'VehiclePhysics', 'MLAgents', 'VRXREngine', 'DevOpsBuilder', 'WorldBuilder', 'SentientAI', 'ProceduralAsset', 'DevOpsManager', 'InputMapping'].includes(activeTool) && (
                 <Viewport3D activeTool={activeTool} activeFile={activeFile} />
               )}

               {/* Global Offline AI Command Bar for Active Editor */}
               {activeTool !== 'Material' && activeTool !== 'BatchAI' && activeTool !== 'Pipeline' && activeTool !== 'Blueprint' && activeTool !== 'ServerSim' && (
                  <AICommandCenter activeTool={activeTool} onNavigateToMapEdit={() => setActiveTool('MapEdit')} onNavigateToMonsterEdit={() => setActiveTool('MonsterEdit')} />
               )}

               <HardwareProfilerOverlay />
            </div>
            {renderBottomPanel()}
          </div>
        </section>

        {renderDetailsPanel()}
        {renderAIChat()}
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
