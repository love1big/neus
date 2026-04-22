/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import AIChat from './components/AIChat';
import Viewport3D from './components/Viewport3D';
import GitPanel from './components/GitPanel';
import { Bot, Play, Pause, Square, FolderTree, FileCode2, MessageSquare, Sparkles, Box, Mountain, Workflow, PersonStanding, Clapperboard, UserSquare, Waypoints, Palette, Music, GitBranch, Terminal, Server, GitPullRequest, Download, Globe, Map, Users, Ghost, BookOpen, Image, Layers, Eye, Cpu, MonitorPlay, Activity, Cloud, ShieldCheck, Blocks, Orbit, AudioWaveform } from 'lucide-react';
import MaterialEditor from './components/MaterialEditor';
import SettingsModal from './components/SettingsModal';
import PipelineEditor from './components/PipelineEditor';
import GamePreview from './components/GamePreview';
import ModulePanel from './components/ModulePanel';
import BlueprintEditor from './components/BlueprintEditor';
import { IDEFile, TEMPLATES, DEFAULT_FOLDERS } from './lib/project';
import { Settings } from 'lucide-react';

// -----------------------------------------------------------------------------
// Component: App
// -----------------------------------------------------------------------------
/**
 * Main Application layout for OmniCode Pro.
 * Responsive design with a robust mobile-first experience and desktop multi-panel view.
 */
export default function App() {
  // --- State Management ---
  const [showSettingsModal, setShowSettingsModal] = useState(false);
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
    { id: '3', name: 'README.md', language: 'markdown', folder: '', content: '# Project Docs\n\n- Powered by local AI Cluster.' }
  ]);
  const [activeFileId, setActiveFileId] = useState('1');
  const [mobileView, setMobileView] = useState<'explorer' | 'editor' | 'chat'>('editor');
  const [activeTool, setActiveTool] = useState('Select');
  const [aiAgentMode, setAiAgentMode] = useState('copilot');
  const [leftPanel, setLeftPanel] = useState<'explorer' | 'git' | 'outliner'>('explorer');
  const [isSimulating, setIsSimulating] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showWindowMenu, setShowWindowMenu] = useState(false);
  const [bottomTab, setBottomTab] = useState<'log' | 'messages' | 'cmd' | 'content'>('log');

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

  const AGENTS = {
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
    <nav className="h-[48px] md:h-[50px] bg-[#000000] border-b border-[#222] flex items-center px-4 justify-between shrink-0 select-none shadow-md">
      <div className="flex gap-4 items-center flex-1">
        <span className="font-black text-[#ffffff] flex items-center gap-2 text-[15px] cursor-help tracking-tight" title="AI Turbo Engine (Batchx8, FP16 Cache, CUDA)">
          <span className="bg-gradient-to-r from-[#58a6ff] to-[#bc8cff] text-transparent bg-clip-text">Nexus</span>Engine 
          <span className="text-[#000] bg-[#fff] px-1 py-0.5 rounded-sm text-[8px] ml-0.5 font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(255,255,255,0.4)]">PRO</span>
        </span>
        <div className="w-[1px] h-[16px] bg-[#333] mx-2 hidden md:block"></div>
        <div className="hidden md:flex gap-4 text-[12px] text-[#aaa] font-medium cursor-pointer ml-2 items-center">
          <span className="hover:text-[#fff] transition-colors relative group py-2" onMouseEnter={() => setShowWindowMenu(true)} onMouseLeave={() => setShowWindowMenu(false)}>
            File
            {showWindowMenu && (
              <div className="absolute left-0 top-full mt-0 w-[240px] bg-[#1a1a1a] border border-[#333] rounded shadow-2xl z-[100] py-1 text-[12px]">
                 <button className="w-full text-left px-4 py-1.5 hover:bg-[#58a6ff] hover:text-white text-[#ccc] flex justify-between">New Level <span className="text-[#666] group-hover:text-[#fff]/70">Ctrl+N</span></button>
                 <button className="w-full text-left px-4 py-1.5 hover:bg-[#58a6ff] hover:text-white text-[#ccc] flex justify-between">Open Asset... <span className="text-[#666]">Ctrl+O</span></button>
                 <button className="w-full text-left px-4 py-1.5 hover:bg-[#58a6ff] hover:text-white text-[#ccc] flex justify-between">Save All <span className="text-[#666]">Ctrl+Shift+S</span></button>
                 <div className="border-t border-[#333] my-1"></div>
                 <button onClick={() => { setShowConsole(true); setBottomTab('content'); }} className="w-full text-left px-4 py-1.5 hover:bg-[#58a6ff] hover:text-white text-[#ccc] flex justify-between">Content Browser <span className="text-[#666]">Ctrl+Space</span></button>
                 <button onClick={() => { setLeftPanel('outliner'); }} className="w-full text-left px-4 py-1.5 hover:bg-[#58a6ff] hover:text-white text-[#ccc] flex justify-between">World Outliner <span className="text-[#666]">Ctrl+W</span></button>
                 <button onClick={() => { setShowConsole(true); setBottomTab('log'); }} className="w-full text-left px-4 py-1.5 hover:bg-[#58a6ff] hover:text-white text-[#ccc] flex justify-between">Output Log <span className="text-[#666]">`</span></button>
                 <div className="border-t border-[#333] my-1"></div>
                 <button className="w-full text-left px-4 py-1.5 hover:bg-[#58a6ff] hover:text-white text-[#ccc] flex justify-between">Exit</button>
              </div>
            )}
          </span>
          <span className="hover:text-[#fff] transition-colors py-2">Edit</span>
          <span className="hover:text-[#fff] transition-colors py-2 text-[#58a6ff]">Window</span>
          <span className="hover:text-[#fff] transition-colors py-2 text-[#bc8cff]">Tools</span>
          <span className="hover:text-[#fff] transition-colors py-2 text-[#ff7b72]">Build</span>
          
          <div className="flex gap-2 ml-4">
             <span className="flex items-center gap-1 bg-[#222] border border-[#d29922]/50 text-[#d29922] px-2 py-0.5 rounded-sm text-[10px] font-bold" title="Houdini / Gaea / World Creator">
               WORLD
             </span>
             <span className="flex items-center gap-1 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] hover:border-[#58a6ff] text-[#888] hover:text-[#fff] transition-colors px-2 py-0.5 rounded-sm text-[10px] font-bold" title="Blender / Maya / ZBrush">
               MODEL
             </span>
             <span className="flex items-center gap-1 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] hover:border-[#58a6ff] text-[#888] hover:text-[#fff] transition-colors px-2 py-0.5 rounded-sm text-[10px] font-bold" title="Substance Painter">
               TEXTURE
             </span>
             <span className="flex items-center gap-1 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] hover:border-[#58a6ff] text-[#888] hover:text-[#fff] transition-colors px-2 py-0.5 rounded-sm text-[10px] font-bold" title="Maya / Mixamo">
               RIG/ANIM
             </span>
             <span className="flex items-center gap-1 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] hover:border-[#58a6ff] text-[#888] hover:text-[#fff] transition-colors px-2 py-0.5 rounded-sm text-[10px] font-bold" title="Unreal Blueprints">
               BLUEPRINT
             </span>
             <span className="flex items-center gap-1 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] hover:border-[#bc8cff] text-[#888] hover:text-[#bc8cff] transition-colors px-2 py-0.5 rounded-sm text-[10px] font-bold shadow-[0_0_8px_rgba(188,140,255,0.1)]" title="AI Offline Tools">
               ✨ AI OFFLINE
             </span>
          </div>
        </div>
      </div>
      
      {/* Simulation Controls - Center */}
      <div className="hidden lg:flex items-center gap-1 bg-[#111] border border-[#333] rounded-md p-1 mx-4 shadow-inner">
        <button 
          onClick={() => setIsSimulating(!isSimulating)}
          className={`px-4 py-1.5 rounded-sm flex items-center gap-2 text-[11px] font-bold transition-all ${isSimulating ? 'bg-[#2ea043] text-white shadow-[0_0_15px_rgba(46,160,67,0.4)]' : 'text-[#aaa] hover:bg-[#222] hover:text-[#fff]'}`}
        >
           <Play size={14} fill={isSimulating ? 'white' : 'currentColor'}/> {isSimulating ? 'SIMULATING' : 'PLAY'}
        </button>
        <button className="px-3 py-1.5 rounded-sm text-[#aaa] hover:bg-[#222] hover:text-[#fff] transition-colors">
           <Pause size={14} fill="currentColor"/>
        </button>
        <div className="w-[1px] h-[16px] bg-[#333] mx-1"></div>
        <button 
          onClick={() => setIsSimulating(false)}
          className="px-3 py-1.5 rounded-sm text-[#aaa] hover:bg-[#222] hover:text-[#f85149] transition-colors"
        >
           <Square size={14} fill="currentColor"/>
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

      <div className="flex gap-3 items-center flex-1 justify-end">
        <button 
          className="hidden md:flex items-center gap-2 text-[11px] font-semibold text-[#aaa] hover:text-[#58a6ff] transition-colors border border-[#333] px-3 py-1.5 rounded-sm hover:border-[#58a6ff] bg-[#111] shadow-sm"
          title="Submit to Cloud Render Farm"
        >
          <div className="flex gap-0.5 relative">
             <div className="w-1 h-3 bg-[#58a6ff] animate-pulse"></div>
             <div className="w-1 h-3 bg-[#58a6ff] animate-pulse" style={{ animationDelay: '0.1s' }}></div>
             <div className="w-1 h-3 bg-[#58a6ff] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <Server size={14} /> Swarm Compute
        </button>
        <div className="w-[1px] h-[20px] bg-[#333] mx-1 hidden md:block"></div>
        <button 
          onClick={() => setShowConsole(!showConsole)}
          className={`flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1.5 rounded transition-colors ${showConsole ? 'bg-[#222] text-[#fff]' : 'text-[#aaa] hover:text-[#fff]'}`}
          title="Toggle Output Console"
        >
           <Terminal size={14} /> Log
        </button>
        <div className="relative">
          <div 
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex bg-gradient-to-b from-[#2ea043] to-[#238636] hover:from-[#3fb950] hover:to-[#2ea043] border border-[#111] rounded-sm cursor-pointer transition-colors text-white text-[12px] px-4 py-1.5 md:py-1.5 font-bold tracking-wide shadow-[0_2px_5px_rgba(0,0,0,0.5)] items-center gap-2 h-[32px] select-none uppercase"
          >
              <Download size={14}/> <span className="hidden sm:inline">Package Project</span>
          </div>
          {showExportMenu && (
             <div className="absolute right-0 top-full mt-1 w-[240px] bg-[#1a1a1a] border border-[#333] rounded shadow-2xl z-[100] py-1 font-['Helvetica_Neue',Arial,sans-serif]">
                <div className="px-3 py-2 text-[10px] text-[#888] uppercase font-bold tracking-wider border-b border-[#333] mb-1">Cook & Package For</div>
                <button className="w-full text-left px-3 py-2 hover:bg-[#58a6ff] hover:text-white text-[12px] text-[#ccc] flex justify-between items-center group">
                   <span>🖥️ Windows (64-bit)</span>
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-[#58a6ff] hover:text-white text-[12px] text-[#ccc] flex justify-between items-center group">
                   <span>🐧 Linux (Cross-Compile)</span>
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-[#21262d] text-[12px] text-[#c9d1d9] flex justify-between items-center group">
                   <span>📱 Android (.apk)</span> <span className="text-[10px] text-[#8b949e] group-hover:text-[#58a6ff]">ARM64</span>
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-[#21262d] text-[12px] text-[#c9d1d9] flex justify-between items-center group">
                   <span>🍏 iOS (.ipa)</span> <span className="text-[10px] text-[#8b949e] group-hover:text-[#58a6ff]">Metal</span>
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-[#21262d] text-[12px] text-[#c9d1d9] flex justify-between items-center group">
                   <span>🍎 Mac OS (.app)</span> <span className="text-[10px] text-[#8b949e] group-hover:text-[#58a6ff]">Universal</span>
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-[#21262d] text-[12px] text-[#c9d1d9] flex justify-between items-center group">
                   <span>🌐 WebGL HTML5</span> <span className="text-[10px] text-[#8b949e] group-hover:text-[#58a6ff]">WASM</span>
                </button>
                <div className="border-t border-[#30363d] my-1"></div>
                <button className="w-full text-left px-3 py-2 hover:bg-[#21262d] text-[12px] text-[#c9d1d9] flex justify-between items-center group">
                   <span>🐳 Docker Image</span> <span className="text-[10px] text-[#3fb950] font-bold">100% CI/CD</span>
                </button>
             </div>
          )}
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
      { id: 'AnimationAudio', title: 'Skeletal Anim, MoCap & Audio', icon: <Activity size={20} />, activeColor: 'text-[#e3b341]' },
      { id: 'BackendCloud', title: 'Server, Cloud, Sync & Economy', icon: <Cloud size={20} />, activeColor: 'text-[#bc8cff]' },
      { id: 'AITestingQA', title: 'AI Offline QA, Perf Metric & Debug', icon: <ShieldCheck size={20} />, activeColor: 'text-[#2ea043]' },
      { id: 'WorldBible', title: 'World Bible (Lore & Setup)', icon: <BookOpen size={20} />, activeColor: 'text-[#d2a8ff]' },
      { id: 'GameSystems', title: 'AAA Game Systems Architecture', icon: <Blocks size={20} />, activeColor: 'text-[#58a6ff]' },
      { id: 'MapEdit', title: 'Map & 2D/3D Environment Editor', icon: <Map size={20} />, activeColor: 'text-[#58a6ff]' },
      { id: 'NPCEdit', title: 'Deep NPC Builder', icon: <Users size={20} />, activeColor: 'text-[#ff7b72]' },
      { id: 'MonsterEdit', title: 'Monster & Entities Builder', icon: <Ghost size={20} />, activeColor: 'text-[#e3b341]' },
      { id: 'Modeling', title: 'Meshy AI 3D Generator', icon: <Box size={20} />, activeColor: 'text-[#e3b341]' },
      { id: 'Landscape', title: 'Gaea Procedural Terrain AI', icon: <Mountain size={20} />, activeColor: 'text-[#3fb950]' },
      { id: 'PCG', title: 'Procedural Content Generation', icon: <Workflow size={20} />, activeColor: 'text-[#ff7b72]' },
      { id: 'ControlRig', title: 'Control Rig & MoCap', icon: <PersonStanding size={20} />, activeColor: 'text-[#ff7b72]' },
      { id: 'Sequencer', title: 'Cinematic Sequencer', icon: <Clapperboard size={20} />, activeColor: 'text-[#bc8cff]' },
      { id: 'MetaHuman', title: 'MetaHuman System', icon: <UserSquare size={20} />, activeColor: 'text-[#58a6ff]' },
      { id: 'Blueprint', title: 'Visual Scripting (Kismet)', icon: <Waypoints size={20} />, activeColor: 'text-[#3fb950]' },
      { id: 'Material', title: 'Node Material Editor', icon: <Palette size={20} />, activeColor: 'text-[#e3b341]' },
      { id: 'Niagara', title: 'Niagara Particle FX', icon: <Sparkles size={20} />, activeColor: 'text-[#bc8cff]' },
      { id: 'MetaSound', title: 'Audio Mixer', icon: <Music size={20} />, activeColor: 'text-[#e3b341]' },
      { id: 'ImageEdit', title: 'Image & Texture Editor', icon: <Image size={20} />, activeColor: 'text-[#bc8cff]' },
      { id: 'AudioEdit', title: 'Audio Studio & SFX', icon: <AudioWaveform size={20} />, activeColor: 'text-[#3fb950]' },
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

  const renderSidebar = () => (
    <aside className={`w-full md:w-[260px] bg-[#161616] border-r border-[#222] flex-col shrink-0 ${mobileView === 'explorer' ? 'flex' : 'hidden'} md:flex h-full`}>
      <div className="flex bg-[#0a0a0a] border-b border-[#222] shrink-0">
        <button 
          onClick={() => setLeftPanel('explorer')}
          className={`flex-1 p-3 text-[10px] uppercase tracking-[1px] font-bold border-b-[3px] flex flex-col items-center justify-center gap-1 transition-colors ${leftPanel === 'explorer' ? 'text-[#fff] border-[#58a6ff]' : 'text-[#888] border-transparent hover:text-[#fff]'}`}
        >
          <FolderTree size={14} /> EXPLORER
        </button>
        <button 
          onClick={() => setLeftPanel('outliner')}
          className={`flex-1 p-3 text-[10px] uppercase tracking-[1px] font-bold border-b-[3px] flex flex-col items-center justify-center gap-1 transition-colors ${leftPanel === 'outliner' ? 'text-[#fff] border-[#58a6ff]' : 'text-[#888] border-transparent hover:text-[#fff]'}`}
        >
          <Box size={14} /> OUTLINER
        </button>
        <button 
          onClick={() => setLeftPanel('git')}
          className={`flex-1 p-3 text-[10px] uppercase tracking-[1px] font-bold border-b-[3px] flex flex-col items-center justify-center gap-1 transition-colors ${leftPanel === 'git' ? 'text-[#fff] border-[#58a6ff]' : 'text-[#888] border-transparent hover:text-[#fff]'}`}
        >
          <GitBranch size={14} /> SOURCE
        </button>
      </div>
      
      {leftPanel === 'explorer' ? (
        <div className="flex-1 overflow-y-auto flex flex-col custom-scrollbar">
          <div className="flex-1 overflow-y-auto pt-2 pb-4 md:pb-0 px-2">
            {DEFAULT_FOLDERS.map(folder => (
              <div key={folder} className="px-2 py-1.5 md:py-1 text-[14px] md:text-[12px] text-[#888] flex flex-col group">
                <div className="flex items-center gap-2 font-bold">
                  <FolderTree size={12} className="text-[#e3b341]" />
                  <span className="group-hover:text-[#fff] transition-colors">{folder.split('/').pop()}</span>
                </div>
                {files.filter(f => f.folder?.startsWith(folder)).map(f => (
                  <div 
                    key={f.id}
                    onClick={() => { setActiveFileId(f.id); setMobileView('editor'); }}
                    className={`ml-3 pl-2 py-2 md:py-1 text-[13px] md:text-[12px] cursor-pointer flex items-center mt-0.5 truncate transition-colors border-l border-[#333]
                      ${f.id === activeFileId ? 'text-[#fff] bg-[#222] rounded-r-sm shadow-[inset_2px_0_0_#58a6ff]' : 'text-[#888] hover:text-[#fff] hover:bg-[#1a1a1a]'}
                    `}
                  >
                      {f.name}
                  </div>
                ))}
              </div>
            ))}
            
            <div className="mt-4 md:mt-2 text-[12px] md:text-[11px] uppercase tracking-[1px] text-[#888] px-2 py-2 border-t border-[#222] font-semibold">Base Content</div>
            {files.filter(f => !f.folder || f.folder === '').map(f => (
              <div 
                key={f.id}
                onClick={() => { setActiveFileId(f.id); setMobileView('editor'); }}
                className={`px-2 py-2.5 md:py-1.5 text-[14px] md:text-[12px] cursor-pointer flex items-center transition-colors rounded-sm ${
                  f.id === activeFileId 
                    ? 'bg-[#222] text-[#fff] shadow-[inset_2px_0_0_#58a6ff]' 
                    : 'text-[#888] hover:text-[#fff] hover:bg-[#1a1a1a]'
                }`}
              >
                {f.name}
              </div>
            ))}
          </div>

          <div className="p-3 px-4 text-[11px] uppercase tracking-[1px] text-[#888] border-t border-[#222] font-semibold hidden md:block shrink-0 bg-[#0a0a0a]">Engine Modules Status</div>
          <div className="p-4 text-[11px] text-[#888] flex-col gap-2 pb-4 hidden md:flex shrink-0 bg-[#111]">
            <div className="flex justify-between items-center group">
              <span className="group-hover:text-[#fff] transition-colors">Nanite Geometry:</span>
              <span className="text-[#3fb950] font-mono">Hardware Raytraced</span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="group-hover:text-[#fff] transition-colors">Lumen GI:</span>
              <span className="text-[#e3b341] font-mono">Realtime Dynamic</span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="group-hover:text-[#fff] transition-colors">Niagara FX:</span>
              <span className="text-[#bc8cff] font-mono">Hardware Sync</span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="group-hover:text-[#fff] transition-colors">Chaos Physics:</span>
              <span className="text-[#ff7b72] font-mono">Destruction Active</span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="group-hover:text-[#fff] transition-colors">World Partition:</span>
              <span className="text-[#58a6ff] font-mono">Grid Loaded</span>
            </div>
            <div className="flex justify-between items-center group pt-2 border-t border-[#333] mt-1">
              <span className="group-hover:text-[#fff] transition-colors">Mobile Cluster:</span>
              <span className="text-[#3fb950] font-mono">3 Nodes Linked</span>
            </div>
          </div>
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
      ) : (
        <div className="flex-1 min-h-0 overflow-hidden">
           <GitPanel files={files} />
        </div>
      )}
    </aside>
  );

  const renderTabs = () => (
    <div className="min-h-[44px] md:min-h-[35px] bg-[#161b22] flex border-b border-[#30363d] shrink-0 overflow-x-auto custom-scrollbar relative z-10 w-full">
      {files.map(f => (
        <div 
          key={f.id}
          onClick={() => setActiveFileId(f.id)}
          className={`px-5 flex items-center text-[13px] md:text-[12px] border-r border-[#30363d] cursor-pointer whitespace-nowrap transition-colors select-none ${
            f.id === activeFileId
              ? 'bg-[#0d1117] text-[#c9d1d9] font-medium border-t-[2px] border-t-[#58a6ff]'
              : 'text-[#8b949e] hover:bg-[#21262d] border-t-[2px] border-t-transparent'
          }`}
        >
          {f.name}
        </div>
      ))}
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
          />
      </div>
    </aside>
  );

  const renderStatusBar = () => (
    <footer className="h-[28px] bg-[#58a6ff] text-black items-center px-3 text-[11px] font-semibold tracking-wide shrink-0 justify-between hidden md:flex">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1"><Sparkles size={12}/> READY</span>
        <span className="font-mono">LN 1, COL 1</span>
        <span className="uppercase tracking-widest">{activeFile?.language || 'PLAINTEXT'}</span>
        <span>OFFLINE MODE (100% SECURE)</span>
        <span className="font-mono">UTF-8</span>
        <span className="bg-[#0d1117] text-[#58a6ff] px-2 py-0.5 rounded-sm hidden lg:flex items-center shadow-inner">
          🚀 Turbo Mode (CUDA/Metal) Active
        </span>
      </div>
      <div className="tracking-wider">
        OMNICODE v2.5.0
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
             <div className="text-[#c9d1d9] font-medium border-b border-[#30363d] pb-1">Shader Properties</div>
             <div className="flex justify-between items-center"><span className="text-[#8b949e]">Blend Mode:</span> <select className="bg-[#0d1117] border border-[#30363d] rounded px-1 text-right text-[#c9d1d9]"><option>Opaque</option><option>Masked</option><option>Translucent</option></select></div>
             <div className="flex justify-between items-center"><span className="text-[#8b949e]">Shading Model:</span> <select className="bg-[#0d1117] border border-[#30363d] rounded px-1 text-right text-[#c9d1d9]"><option>Default Lit</option><option>Unlit</option><option>Clear Coat</option></select></div>
             <div className="flex justify-between items-center"><span className="text-[#8b949e]">Two Sided:</span> <input type="checkbox" className="w-3 h-3 border-[#30363d]" /></div>
             <div className="flex justify-between items-center"><span className="text-[#8b949e]">Is Wireframe:</span> <input type="checkbox" className="w-3 h-3 border-[#30363d]" /></div>
             <div className="mt-4 text-[#c9d1d9] font-medium border-b border-[#30363d] pb-1">Graph Stats</div>
             <div className="flex justify-between text-[10px]"><span className="text-[#8b949e]">Instructions:</span> <span className="text-[#c9d1d9]">142 ALU, 3 Tex</span></div>
             <div className="flex justify-between text-[10px]"><span className="text-[#8b949e]">Samplers:</span> <span className="text-[#3fb950]">3/16</span></div>
           </div>
         ) : (
           <div className="flex flex-col gap-3">
             <div className="text-[#fff] font-bold border-b border-[#333] pb-1 uppercase tracking-wider text-[11px] mb-1">Context Inspector</div>
             <div className="flex justify-between items-center"><span className="text-[#888]">Target:</span> <span className="text-[#3fb950] font-mono uppercase bg-[#3fb950]/10 px-1 py-0.5 rounded border border-[#3fb950]/20 text-[10px] truncate max-w-[120px] text-right">{activeTool}</span></div>
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
           </div>
         )}
      </div>
    </aside>
  );

  const renderBottomPanel = () => (
    <div className={`h-[250px] bg-[#0a0a0a] border-t border-[#222] shrink-0 font-mono text-[11px] flex flex-col z-20 ${showConsole ? 'flex' : 'hidden'} shadow-[0_-5px_20px_rgba(0,0,0,0.5)]`}>
      <div className="flex bg-[#111] border-b border-[#222] text-[#888]">
        <button onClick={() => setBottomTab('content')} className={`px-4 py-1.5 border-b-[3px] transition-colors flex items-center gap-1.5 font-bold uppercase tracking-[1px] text-[10px] ${bottomTab === 'content' ? 'border-[#58a6ff] text-[#fff]' : 'border-transparent hover:text-[#fff]'}`}><FolderTree size={12}/> Content Drawer</button>
        <button onClick={() => setBottomTab('log')} className={`px-4 py-1.5 border-b-[3px] transition-colors flex items-center gap-1.5 font-bold uppercase tracking-[1px] text-[10px] ${bottomTab === 'log' ? 'border-[#58a6ff] text-[#fff]' : 'border-transparent hover:text-[#fff]'}`}><Terminal size={12}/> Output Log</button>
        <button onClick={() => setBottomTab('cmd')} className={`px-4 py-1.5 border-b-[3px] transition-colors flex items-center gap-1.5 font-bold uppercase tracking-[1px] text-[10px] ${bottomTab === 'cmd' ? 'border-[#58a6ff] text-[#fff]' : 'border-transparent hover:text-[#fff]'}`}><Server size={12}/> Cmd</button>
        <button className="px-4 py-1.5 ml-auto border-transparent hover:text-[#fff] transition-colors" onClick={() => setShowConsole(false)}>X</button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar flex">
        {bottomTab === 'content' ? (
          <div className="flex flex-1 text-sans font-sans">
            <div className="w-[200px] border-r border-[#222] p-2 flex flex-col gap-1 text-[#888]">
               <div className="px-2 py-1 hover:bg-[#222] cursor-pointer rounded-sm flex items-center gap-2"><FolderTree size={14}/> CoreAssets</div>
               <div className="px-2 py-1 hover:bg-[#222] cursor-pointer rounded-sm flex items-center gap-2 pl-6"><Mountain size={14}/> Environments</div>
               <div className="px-2 py-1 hover:bg-[#222] cursor-pointer rounded-sm flex items-center gap-2 pl-6"><PersonStanding size={14}/> Characters</div>
               <div className="px-2 py-1 hover:bg-[#222] cursor-pointer rounded-sm flex items-center gap-2 bg-[#222] text-[#fff]"><Palette size={14} className="text-[#58a6ff]"/> Materials</div>
            </div>
            <div className="flex-1 p-4 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 content-start">
               {/* Asset Mocks */}
               <div className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div className="w-16 h-16 bg-[#161616] border border-[#333] group-hover:border-[#58a6ff] rounded flex items-center justify-center p-1 relative overflow-hidden drop-shadow-md">
                     <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#f85149] to-[#ff7b72] shadow-inner border border-white/10"></div>
                     <div className="absolute top-0 right-0 bg-[#f85149] text-white text-[8px] font-bold px-1 rounded-bl">MAT</div>
                  </div>
                  <span className="text-[10px] text-[#ccc] group-hover:text-[#fff] transition-colors text-center w-full truncate">M_Ruby_PBR</span>
               </div>
               <div className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div className="w-16 h-16 bg-[#161616] border border-[#333] group-hover:border-[#58a6ff] rounded flex items-center justify-center p-1 relative overflow-hidden drop-shadow-md">
                     <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#333] to-[#888] shadow-inner border border-white/10"></div>
                     <div className="absolute top-0 right-0 bg-[#f85149] text-white text-[8px] font-bold px-1 rounded-bl">MAT</div>
                  </div>
                  <span className="text-[10px] text-[#ccc] group-hover:text-[#fff] transition-colors text-center w-full truncate">M_ChromeBase</span>
               </div>
               <div className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div className="w-16 h-16 bg-[#161616] border border-[#333] group-hover:border-[#58a6ff] rounded flex items-center justify-center p-1 relative overflow-hidden drop-shadow-md">
                     <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#888] to-[#fff] shadow-inner border border-white/10"></div>
                     <div className="absolute top-0 right-0 bg-[#f85149] text-white text-[8px] font-bold px-1 rounded-bl">MAT</div>
                  </div>
                  <span className="text-[10px] text-[#ccc] group-hover:text-[#fff] transition-colors text-center w-full truncate">M_PlasticWhite</span>
               </div>
               <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => setActiveTool('Blueprint')}>
                  <div className="w-16 h-16 bg-[#161616] border border-[#333] group-hover:border-[#58a6ff] hover:bg-[#58a6ff]/10 rounded flex items-center justify-center relative overflow-hidden drop-shadow-md">
                     <Waypoints size={32} className="text-[#3fb950]"/>
                     <div className="absolute top-0 right-0 bg-[#3fb950] text-[#0a0a0a] text-[8px] font-bold px-1 rounded-bl">BP</div>
                  </div>
                  <span className="text-[10px] text-[#ccc] group-hover:text-[#fff] transition-colors text-center w-full truncate">BP_PlayerCharacter</span>
               </div>
               <div className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div className="w-16 h-16 bg-[#161616] border border-[#333] group-hover:border-[#58a6ff] rounded flex items-center justify-center relative overflow-hidden drop-shadow-md">
                     <Image size={24} className="text-[#888]"/>
                     <div className="absolute top-0 right-0 bg-[#bc8cff] text-[#0a0a0a] text-[8px] font-bold px-1 rounded-bl">TEX</div>
                  </div>
                  <span className="text-[10px] text-[#ccc] group-hover:text-[#fff] transition-colors text-center w-full truncate">T_Noise_01</span>
               </div>
               <div className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div className="w-16 h-16 bg-[#161616] border border-[#333] group-hover:border-[#58a6ff] rounded flex items-center justify-center relative overflow-hidden drop-shadow-md">
                     <PersonStanding size={32} className="text-[#58a6ff]"/>
                     <div className="absolute top-0 right-0 bg-[#58a6ff] text-[#0a0a0a] text-[8px] font-bold px-1 rounded-bl">SKM</div>
                  </div>
                  <span className="text-[10px] text-[#ccc] group-hover:text-[#fff] transition-colors text-center w-full truncate">SKM_HeroMesh</span>
               </div>
               <div className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div className="w-16 h-16 bg-[#161616] border border-[#333] group-hover:border-[#58a6ff] rounded flex items-center justify-center relative overflow-hidden drop-shadow-md">
                     <Music size={24} className="text-[#3fb950]"/>
                     <div className="absolute top-0 right-0 bg-[#3fb950] text-[#0a0a0a] text-[8px] font-bold px-1 rounded-bl">WAV</div>
                  </div>
                  <span className="text-[10px] text-[#ccc] group-hover:text-[#fff] transition-colors text-center w-full truncate">S_Jump_01</span>
               </div>
               <div className="flex flex-col items-center gap-2 cursor-pointer group border border-dashed border-[#58a6ff]/50 rounded-sm hover:bg-[#58a6ff]/10">
                  <div className="w-16 h-16 flex items-center justify-center relative overflow-hidden text-[#58a6ff]">
                     Add/Import
                  </div>
                  <span className="text-[10px] text-[#58a6ff] text-center w-full truncate">&nbsp;</span>
               </div>
            </div>
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
             {bottomTab === 'cmd' ? <div className="mt-2 text-[#58a6ff] flex gap-2 items-center">&gt; <input type="text" className="bg-transparent border-none outline-none flex-1 font-mono text-[#fff]" placeholder="engine.help()" /></div> : <div className="text-[#888]">Waiting for commands...</div>}
          </div>
        )}
      </div>
    </div>
  );

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
                 <CodeEditor 
                   code={activeFile?.content || ''} 
                   setCode={setCode} 
                   language={activeFile?.language || 'plaintext'} 
                   setLanguage={setLanguage} 
                 />
               )}
               {activeTool === 'Material' && (
                 <MaterialEditor />
               )}
               {activeTool === 'Pipeline' && (
                 <PipelineEditor />
               )}
               {activeTool === 'Blueprint' && (
                 <BlueprintEditor />
               )}
               {['Modeling', 'Landscape', 'WorldBible', 'NPCEdit', 'MonsterEdit', 'MapEdit', 'PhysicsEngine', 'GameSystems', 'EngineCore', 'GraphicsRender', 'AnimationAudio', 'BackendCloud', 'AITestingQA', 'Niagara', 'ControlRig', 'Sequencer', 'MetaSound', 'PCG', 'MetaHuman', 'ImageEdit', 'AudioEdit'].includes(activeTool) && (
                 <ModulePanel moduleType={activeTool} />
               )}
               {!['Select', 'Material', 'Pipeline', 'Blueprint', 'Modeling', 'Landscape', 'WorldBible', 'NPCEdit', 'MonsterEdit', 'MapEdit', 'PhysicsEngine', 'GameSystems', 'EngineCore', 'GraphicsRender', 'AnimationAudio', 'BackendCloud', 'AITestingQA', 'Niagara', 'ControlRig', 'Sequencer', 'MetaSound', 'PCG', 'MetaHuman', 'ImageEdit', 'AudioEdit'].includes(activeTool) && (
                 <Viewport3D activeTool={activeTool} activeFile={activeFile} />
               )}

               {/* Global Offline AI Command Bar for Active Editor */}
               {activeTool !== 'Material' && activeTool !== 'Pipeline' && activeTool !== 'Blueprint' && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%] max-w-[800px] z-[60] pointer-events-auto">
                     <div className="bg-[#161b22]/95 backdrop-blur-xl border border-[#bc8cff]/30 rounded-2xl shadow-[0_10px_40px_-10px_rgba(188,140,255,0.2)] p-3 flex flex-col gap-3">
                        <div className="flex items-center justify-between px-2">
                           <div className="flex items-center gap-2 text-[#bc8cff]">
                              <Bot size={16} />
                              <span className="text-[12px] font-bold tracking-wide">AUTONOMOUS ENGINE AI</span>
                              <span className="bg-[#bc8cff]/20 text-[#bc8cff] text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">Offline Mode / Local TPU</span>
                           </div>
                           <span className="text-[11px] text-[#8b949e]">Accessing Blender, Maya, Substance, Unity, Unreal toolsets.</span>
                        </div>
                        <div className="flex gap-2">
                           <input 
                              type="text" 
                              placeholder={`Tell me what to make in [${activeTool}]... e.g. "Generate a complete SpeedTree forest template"`}
                              className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-xl text-[14px] text-white px-4 py-3 outline-none focus:border-[#bc8cff] transition-colors shadow-inner"
                              onKeyDown={(e) => {
                                 if (e.key === 'Enter') {
                                    e.currentTarget.value = '';
                                    alert('AI Copilot is processing your offline request using Local Cluster...');
                                 }
                              }}
                           />
                           <button className="bg-gradient-to-r from-[#bc8cff] to-[#58a6ff] hover:opacity-90 text-white rounded-xl p-3 transition-opacity flex items-center justify-center font-bold px-6 shadow-lg gap-2">
                              <Sparkles size={18} fill="white" /> Execute Node
                           </button>
                        </div>
                        <div className="flex gap-2 px-1 justify-center flex-wrap">
                           <button className="text-[11px] bg-[#21262d] hover:bg-[#30363d] hover:text-white text-[#c9d1d9] px-3 py-1.5 rounded-full transition-colors border border-[#30363d] font-semibold">🏔️ Generate Gaea Landscape</button>
                           <button className="text-[11px] bg-[#21262d] hover:bg-[#30363d] hover:text-white text-[#c9d1d9] px-3 py-1.5 rounded-full transition-colors border border-[#30363d] font-semibold">💀 Rig with Mixamo IK</button>
                           <button className="text-[11px] bg-[#21262d] hover:bg-[#30363d] hover:text-white text-[#c9d1d9] px-3 py-1.5 rounded-full transition-colors border border-[#30363d] font-semibold">🎨 Unwrap & Apply Substance Material</button>
                           <button className="text-[11px] bg-[#21262d] hover:bg-[#30363d] hover:text-white text-[#c9d1d9] px-3 py-1.5 rounded-full transition-colors border border-[#30363d] font-semibold">📐 Sculpt Mode (ZBrush Style)</button>
                        </div>
                     </div>
                  </div>
               )}
            </div>
            {renderBottomPanel()}
          </div>
        </section>

        {renderDetailsPanel()}
        {renderAIChat()}
      </div>

      {renderStatusBar()}
      {renderMobileNavigation()}
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </div>
  );
}
