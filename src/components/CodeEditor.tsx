import React, { useState, useRef, useEffect, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { LANGUAGES } from '../lib/constants';
import { 
  ChevronUp, ChevronDown, X, Search, Replace as ReplaceIcon, Undo, Redo, 
  BrainCircuit, Activity, Cpu, ShieldCheck, Zap, Server, Code2, Sparkles, 
  TerminalSquare, AlertTriangle, FileCode2, Package, GitBranch, LayoutGrid, 
  Terminal as TerminalIcon, Bug, AlignLeft, Settings, Bell, ChevronRight, 
  FileJson, Play, Copy, SplitSquareHorizontal, ExternalLink, Upload, Check, 
  Sliders, FileCheck, RefreshCw, FolderOpen
} from 'lucide-react';
import PopOutPanel from './PopOutPanel';
import { 
  LanguageDetectorEngine, 
  DetectedLanguageResult, 
  SUPPORTED_LANGUAGES 
} from '../utils/LanguageDetectorEngine';
import { 
  LanguageEditorConfigurator, 
  EditorConfigurationProfile 
} from '../utils/LanguageEditorConfigurator';

interface CodeEditorProps {
  code?: string;
  setCode?: React.Dispatch<React.SetStateAction<string>>;
  language?: string;
  setLanguage?: React.Dispatch<React.SetStateAction<string>>;
  filename?: string;
  onSelectTool?: (toolId: string) => void;
}

// Built-in workspace multi-file tabs for instant testing of language auto-detection
const DEFAULT_FILES = [
  {
    name: 'PlayerCombatController.ts',
    lang: 'typescript',
    code: `import { Component, Vector3, EventDispatcher } from '@nexus/engine';

export interface CombatStats {
  health: number;
  attackPower: number;
  criticalChance: number;
}

export class PlayerCombatController extends Component {
  private stats: CombatStats = { health: 100, attackPower: 25, criticalChance: 0.15 };

  public executeAttack(target: Entity): void {
    const isCrit = Math.random() < this.stats.criticalChance;
    const damage = isCrit ? this.stats.attackPower * 2.0 : this.stats.attackPower;
    target.applyDamage(damage);
    EventDispatcher.dispatch('COMBAT_HIT', { damage, isCrit });
  }
}`
  },
  {
    name: 'neural_behavior_agent.py',
    lang: 'python',
    code: `#!/usr/bin/env python3
import torch
import torch.nn as nn
from typing import Tuple, List

class NeuralBehaviorAgent(nn.Module):
    def __init__(self, state_dim: int = 128, action_dim: int = 16):
        super(NeuralBehaviorAgent, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(state_dim, 256),
            nn.ReLU(),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Linear(128, action_dim),
            nn.Softmax(dim=-1)
        )

    def forward(self, state: torch.Tensor) -> torch.Tensor:
        return self.network(state)

if __name__ == '__main__':
    agent = NeuralBehaviorAgent()
    print("Neural Agent loaded with 256 hidden neurons.")`
  },
  {
    name: 'octree_spatial_indexer.rs',
    lang: 'rust',
    code: `pub struct OctreeSpatialIndexer<T> {
    pub root_bounds: BoundingBox,
    pub entities: Vec<T>,
    pub max_depth: usize,
}

impl<T: SpatialObject> OctreeSpatialIndexer<T> {
    pub fn new(bounds: BoundingBox, max_depth: usize) -> Self {
        OctreeSpatialIndexer {
            root_bounds: bounds,
            entities: Vec::with_capacity(512),
            max_depth,
        }
    }

    pub fn query_sphere(&self, center: Vector3, radius: f32) -> Vec<&T> {
        self.entities
            .iter()
            .filter(|e| e.get_position().distance_to(center) <= radius)
            .collect()
    }
}`
  },
  {
    name: 'volumetric_atmosphere.frag',
    lang: 'glsl',
    code: `#version 330 core
precision highp float;

in vec2 vUV;
out vec4 FragColor;

uniform mat4 uInvProjection;
uniform vec3 uSunPosition;
uniform sampler2D uDepthMap;

void main() {
    vec3 rayDir = normalize(vec3(vUV * 2.0 - 1.0, 1.0));
    float density = 0.0;
    
    for (int step = 0; step < 16; ++step) {
        density += 0.0625 * exp(-float(step) * 0.15);
    }
    
    FragColor = vec4(vec3(0.3, 0.6, 1.0) * density, 1.0);
}`
  },
  {
    name: 'create_game_tables.sql',
    lang: 'sql',
    code: `-- Relational Game Save & Character State Schema
CREATE TABLE IF NOT EXISTS game_save_states (
    save_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id VARCHAR(64) NOT NULL,
    current_scene VARCHAR(128) NOT NULL,
    playtime_seconds INTEGER NOT NULL DEFAULT 0,
    save_payload JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_game_saves_player ON game_save_states(player_id);

SELECT player_id, current_scene, playtime_seconds 
FROM game_save_states 
WHERE playtime_seconds > 3600 
ORDER BY updated_at DESC;`
  }
];

export default function CodeEditor({ 
  code: externalCode, 
  setCode: externalSetCode, 
  language: externalLanguage, 
  setLanguage: externalSetLanguage, 
  filename: externalFilename,
  onSelectTool
}: CodeEditorProps) {
  const [internalCode, setInternalCode] = useState<string>(externalCode || DEFAULT_FILES[0].code);
  const [activeFilename, setActiveFilename] = useState<string>(externalFilename || DEFAULT_FILES[0].name);
  const [manualLangOverride, setManualLangOverride] = useState<string>('auto');
  const [isAutoDetectActive, setIsAutoDetectActive] = useState<boolean>(true);
  const [openFiles, setOpenFiles] = useState(DEFAULT_FILES);
  const [detectionNotice, setDetectionNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editorRef = useRef<any>(null);
  const activeSuggestionRef = useRef<string | null>(null);

  const activeCode = externalCode !== undefined ? externalCode : internalCode;
  const updateCode = (newVal: string) => {
    if (externalSetCode) externalSetCode(newVal);
    setInternalCode(newVal);
  };

  // 1. Perform Automatic Language Detection
  const detectedResult: DetectedLanguageResult = useMemo(() => {
    if (!isAutoDetectActive && manualLangOverride !== 'auto') {
      const def = SUPPORTED_LANGUAGES[manualLangOverride];
      if (def) {
        return {
          id: def.id,
          name: def.name,
          monacoId: def.monacoId,
          confidence: 100,
          method: 'fallback',
          category: def.category,
          color: def.color,
          details: 'Manually locked by user',
          sampleKeywordsFound: [],
          lineCount: activeCode.split('\n').length,
          byteSize: new Blob([activeCode]).size
        };
      }
    }
    return LanguageDetectorEngine.detect(activeFilename, activeCode, externalLanguage);
  }, [activeFilename, activeCode, isAutoDetectActive, manualLangOverride, externalLanguage]);

  // 2. Derive Optimized Editor Configuration from Detected Language
  const editorConfig: EditorConfigurationProfile = useMemo(() => {
    return LanguageEditorConfigurator.getConfiguration(detectedResult);
  }, [detectedResult]);

  // 3. Sync language back to parent if provided
  useEffect(() => {
    if (externalSetLanguage && detectedResult.monacoId) {
      externalSetLanguage(detectedResult.monacoId);
    }
  }, [detectedResult.monacoId, externalSetLanguage]);

  // Show notice on detection change
  useEffect(() => {
    setDetectionNotice(`Auto-Detected: ${detectedResult.name} (${detectedResult.confidence}% confidence)`);
    const timer = setTimeout(() => setDetectionNotice(null), 3000);
    return () => clearTimeout(timer);
  }, [detectedResult.name, activeFilename]);
  
  const [showSearch, setShowSearch] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matches, setMatches] = useState<any[]>([]);
  const [currentMatch, setCurrentMatch] = useState(0);

  // IDE Layout State
  const [bottomPanelOpen, setBottomPanelOpen] = useState(true);
  const [isPoppedOut, setIsPoppedOut] = useState(false);

  // AI Suggestion State
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [cursorPos, setCursorPos] = useState({ top: 0, left: 0 });
  const [enterPresses, setEnterPresses] = useState(0);

  // Update matches whenever code or findText changes
  useEffect(() => {
    if (!editorRef.current || !findText) {
      setMatches([]);
      setCurrentMatch(0);
      return;
    }
    const model = editorRef.current.getModel();
    if (!model) return;

    const foundMatches = model.findMatches(findText, false, false, false, null, true);
    setMatches(foundMatches);
    
    if (foundMatches.length > 0) {
      if (currentMatch === 0 || currentMatch > foundMatches.length) {
        setCurrentMatch(1);
        highlightMatch(foundMatches[0]);
      } else {
        highlightMatch(foundMatches[currentMatch - 1]);
      }
    } else {
      setCurrentMatch(0);
    }
  }, [findText, activeCode]);

  const highlightMatch = (match: any) => {
    if (editorRef.current && match) {
      editorRef.current.revealRangeInCenterIfOutsideViewport(match.range);
      editorRef.current.setSelection(match.range);
    }
  };

  const handleNext = () => {
    if (matches.length === 0) return;
    const nextIdx = currentMatch >= matches.length ? 1 : currentMatch + 1;
    setCurrentMatch(nextIdx);
    highlightMatch(matches[nextIdx - 1]);
  };

  const handlePrev = () => {
    if (matches.length === 0) return;
    const prevIdx = currentMatch <= 1 ? matches.length : currentMatch - 1;
    setCurrentMatch(prevIdx);
    highlightMatch(matches[prevIdx - 1]);
  };

  const replaceCurrent = () => {
    if (matches.length === 0 || currentMatch === 0 || !editorRef.current) return;
    const editor = editorRef.current;
    const matchToReplace = matches[currentMatch - 1];

    editor.executeEdits('custom-replace', [{
      range: matchToReplace.range,
      text: replaceText,
      forceMoveMarkers: true
    }]);
  };

  const replaceAll = () => {
    if (matches.length === 0 || !editorRef.current) return;
    const editor = editorRef.current;
    
    const edits = matches.map(m => ({
      range: m.range,
      text: replaceText,
      forceMoveMarkers: true
    }));
    
    editor.executeEdits('custom-replace-all', edits);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateCode(value);
    }
  };

  const handleSwitchFile = (file: typeof DEFAULT_FILES[0]) => {
    setActiveFilename(file.name);
    updateCode(file.code);
    setIsAutoDetectActive(true);
    setManualLangOverride('auto');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (content !== undefined) {
        setActiveFilename(file.name);
        updateCode(content);
        setIsAutoDetectActive(true);
        setManualLangOverride('auto');

        // Add to open tabs if not already present
        if (!openFiles.some(f => f.name === file.name)) {
          setOpenFiles(prev => [...prev, { name: file.name, lang: 'auto', code: content }]);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleEditorDidMount = (editor: any, monacoInstance: any) => {
    editorRef.current = editor;

    // Search Override
    editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyF, () => {
      setShowSearch(true);
      const selection = editor.getSelection();
      const model = editor.getModel();
      if (selection && !selection.isEmpty() && model) {
         setFindText(model.getValueInRange(selection));
      }
    });
    editor.addCommand(monacoInstance.KeyCode.Escape, () => setShowSearch(false));

    // 3x Enter Logic for AI Suggestion
    let enterCount = 0;
    let lastEnterTime = 0;

    editor.onKeyDown((e: any) => {
      if (e.keyCode === monacoInstance.KeyCode.Enter) {
        const now = Date.now();
        if (now - lastEnterTime < 800) {
          enterCount++;
        } else {
          enterCount = 1;
        }
        lastEnterTime = now;
        setEnterPresses(enterCount);

        if (enterCount >= 3) {
           e.preventDefault();
           e.stopPropagation();
           enterCount = 0;
           setEnterPresses(0);

           if (activeSuggestionRef.current) {
              const pos = editor.getPosition();
              const targetRange = new monacoInstance.Range(pos.lineNumber - 2 > 0 ? pos.lineNumber - 2 : pos.lineNumber, pos.column, pos.lineNumber, pos.column);
              
              editor.executeEdits('ai-suggestion', [{
                 range: targetRange,
                 text: activeSuggestionRef.current,
                 forceMoveMarkers: true
              }]);
              
              setShowSuggestion(false);
              setSuggestion(null);
              activeSuggestionRef.current = null;
           }
        }
      } else {
        enterCount = 0;
        setEnterPresses(0);
      }
    });

    // Tracking Cursor for Suggestion Overlay
    editor.onDidChangeCursorPosition((e: any) => {
      const position = e.position;
      const coords = editor.getScrolledVisiblePosition(position);
      if (coords) {
        setCursorPos({ top: coords.top, left: coords.left });
      }
    });

    let debounceTimer: any;
    editor.onDidChangeModelContent(() => {
      clearTimeout(debounceTimer);
      setShowSuggestion(false);
      
      debounceTimer = setTimeout(() => {
         const suggestionsList = [
            "// Auto-generated error handling\ntry {\n    processExecution();\n} catch (e) {\n    logger.error('Failure:', e);\n}",
            "const quantumState = useMemo(() => computeMatrix(state), [state]);",
            "await NexusEngine.initialize({\n    mode: 'production',\n    threads: 16\n});\nconsole.log('Sync Complete');",
            "if (!context.isValid()) return null;\n// Execute primary routine\nreturn context.execute();",
            "export const optimizedRender = React.memo((props) => {\n  return <div>{props.data}</div>;\n});"
         ];
         const text = suggestionsList[Math.floor(Math.random() * suggestionsList.length)];
         setSuggestion(text);
         activeSuggestionRef.current = text;
         setShowSuggestion(true);
      }, 1200);
    });
  };

  const handleUndo = () => editorRef.current?.trigger('keyboard', 'undo', null);
  const handleRedo = () => editorRef.current?.trigger('keyboard', 'redo', null);

  const beforeMount = (monaco: any) => {
    monaco.editor.defineTheme('nxs-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '58a6ff' },
        { token: 'string', foreground: 'a5d6ff' },
        { token: 'comment', foreground: '888888' },
        { token: 'type', foreground: '7ee787' },
        { token: 'function', foreground: 'd2a8ff' }
      ],
      colors: {
        'editor.background': '#151515',
        'editor.lineHighlightBackground': '#222222',
        'editorLineNumber.foreground': '#666666',
        'editorIndentGuide.background': '#333333',
      }
    });
  };

  const content = (
    <div className="flex-1 flex flex-col w-full h-full bg-[#151515] font-sans text-[#b0b5bd] overflow-hidden">
      {/* File Tabs Switcher & Auto-Detection Status Bar */}
      <div className="bg-[#0e1014] border-b border-[#222] flex items-center justify-between px-2 shrink-0 h-9 overflow-x-auto select-none">
        {/* File Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {openFiles.map((file) => {
            const isActive = activeFilename === file.name;
            const ext = file.name.split('.').pop() || '';
            return (
              <button
                key={file.name}
                onClick={() => handleSwitchFile(file)}
                className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-all border shrink-0 ${
                  isActive
                    ? 'bg-[#1e232b] text-white border-[#3b434f] font-semibold shadow-sm'
                    : 'bg-transparent hover:bg-[#161a20] text-[#8b949e] hover:text-[#c9d1d9] border-transparent'
                }`}
              >
                <FileCode2 size={12} className={isActive ? 'text-[#58a6ff]' : 'text-[#6e7681]'} />
                <span>{file.name}</span>
                <span className="text-[9px] uppercase font-mono px-1 py-0.2 bg-[#2d333b] text-[#8b949e] rounded">
                  {ext}
                </span>
              </button>
            );
          })}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2 py-1 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-white rounded text-[11px] flex items-center gap-1 ml-1 transition-colors"
            title="Open an external file from your disk"
          >
            <FolderOpen size={11} className="text-[#58a6ff]" />
            <span>Open File...</span>
          </button>
        </div>

        {/* Right Tab Controls: Detach / Studio Link */}
        <div className="flex items-center gap-2 pl-2 shrink-0">
          <button
            onClick={() => {
              if (onSelectTool) onSelectTool('LanguageDetectorStudio');
              else {
                window.dispatchEvent(new CustomEvent('switch-tool', { detail: 'LanguageDetectorStudio' }));
              }
            }}
            className="px-2 py-0.5 bg-[#1f6feb]/20 hover:bg-[#1f6feb]/30 border border-[#1f6feb]/40 text-[#58a6ff] rounded text-[10px] font-bold flex items-center gap-1 transition-colors"
            title="Open Language Auto-Detection Studio"
          >
            <Sparkles size={10} /> Auto-Detect Studio
          </button>

          <button
            onClick={() => setIsPoppedOut(!isPoppedOut)}
            className={`cursor-pointer select-none transition-colors flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] ${
              isPoppedOut
                ? 'bg-[#58a6ff]/20 border-[#58a6ff]/50 text-[#58a6ff]'
                : 'bg-[#21262d] border-[#30363d] text-[#8b949e] hover:text-white'
            }`}
            title={isPoppedOut ? 'Restore Code Editor' : 'Pop out Code Editor'}
          >
            <ExternalLink size={10} /> {isPoppedOut ? 'Restore' : 'Pop Out'}
          </button>
        </div>
      </div>

      {/* Breadcrumbs & Dynamic Language Settings Bar */}
      <div className="bg-[#101012] border-b border-[#222] flex items-center px-4 shrink-0 text-[10px] text-[#888] gap-2 shadow-sm relative z-10 hidden md:flex flex-wrap h-10">
         <span>src</span> <ChevronRight size={10} className="opacity-50" /> 
         <span>components</span> <ChevronRight size={10} className="opacity-50" /> 
         <span className="text-[#fff] font-mono">{activeFilename}</span>
         
         <div className="w-[1px] h-[14px] bg-[#333] mx-1"></div>
         
         {/* Live Language Detection Badge */}
         <div className="flex items-center gap-2 bg-[#161b22] border border-[#30363d] px-2 py-0.5 rounded">
            <span 
              className="w-2 h-2 rounded-full inline-block" 
              style={{ backgroundColor: detectedResult.color }} 
            />
            <span className="text-white font-bold">{detectedResult.name}</span>
            <span className="text-[#3fb950] font-mono font-semibold">({detectedResult.confidence}%)</span>
            <span className="text-[9px] uppercase px-1 bg-[#21262d] text-[#8b949e] rounded font-mono">
              {detectedResult.method}
            </span>
         </div>

         {/* Override Dropdown */}
         <select
            value={manualLangOverride}
            onChange={(e) => {
              const val = e.target.value;
              setManualLangOverride(val);
              setIsAutoDetectActive(val === 'auto');
            }}
            className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[10px] px-1.5 py-0.5 rounded outline-none focus:border-[#58a6ff]"
         >
            <option value="auto">✨ Auto-Detect (Active)</option>
            {Object.values(SUPPORTED_LANGUAGES).map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
         </select>

         {/* Code Tools */}
         <div className="flex items-center gap-1 font-sans font-bold uppercase tracking-wider ml-1">
             <button 
                 onClick={() => {
                   if (editorRef.current) {
                     editorRef.current.getAction('editor.action.formatDocument')?.run();
                     alert(`Code formatted using ${editorConfig.formatterName}`);
                   }
                 }}
                 className="bg-[#1a1b1f] border border-[#30363d] hover:border-[#58a6ff] hover:text-[#58a6ff] text-[#8b949e] px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
             >
                 <TerminalSquare size={10}/> Format ({editorConfig.formatterName})
             </button>
             <button 
                 onClick={() => alert(`AST Syntax Tree Analysis for ${detectedResult.name}:\n\n- Lines of Code: ${detectedResult.lineCount}\n- Buffer Size: ${detectedResult.byteSize} bytes\n- Monaco Tokenizer: ${editorConfig.monacoLanguage}\n- Indentation: ${editorConfig.tabSize} spaces\n- Linter Target: ${editorConfig.linterName}\n\nStatus: AST and Syntax Highlighting fully synchronized.`)}
                 className="bg-[#1a1b1f] border border-[#30363d] hover:border-[#3fb950] hover:text-[#3fb950] text-[#8b949e] px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
             >
                 <Copy size={10}/> AST Details
             </button>
         </div>

         {/* Status items */}
         <span className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#21262d] border border-[#30363d] text-[#c9d1d9] px-1.5 py-0.5 rounded font-mono text-[9px]">
                 Syntax: <span className="text-[#58a6ff] font-bold">{editorConfig.monacoLanguage}</span> | Tab: {editorConfig.tabSize} spaces | {editorConfig.encoding}
            </div>
            <span className="flex items-center gap-1 text-[#3fb950]"><ShieldCheck size={10} /> 0 Errors</span>
            <span className="flex items-center gap-1 bg-[#0078d7]/20 border border-[#0078d7]/50 text-[#0078d7] px-1.5 py-0.5 rounded"><Zap size={10} /> Copilot</span>
         </span>
      </div>

      {/* Transient Detection Toast */}
      {detectionNotice && (
        <div className="bg-[#1f6feb]/90 text-white text-[11px] px-4 py-1 flex items-center justify-between shadow-md transition-all">
          <div className="flex items-center gap-2">
            <FileCheck size={13} />
            <span>{detectionNotice}</span>
            <span className="opacity-75 font-mono">| Tab Size: {editorConfig.tabSize} spaces | Syntax: {editorConfig.monacoLanguage}</span>
          </div>
          <button onClick={() => setDetectionNotice(null)} className="text-white hover:opacity-75">
            <X size={12} />
          </button>
        </div>
      )}

      {/* Main Monaco Engine */}
      <div className="flex-1 relative bg-[#151515]">
         <Editor
            height="100%"
            language={editorConfig.monacoLanguage}
            value={activeCode}
            theme="nxs-dark"
            beforeMount={beforeMount}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={LanguageEditorConfigurator.getMonacoOptions(editorConfig)}
         />

         {/* AI Suggestion Inline Overlay */}
         {showSuggestion && suggestion && (
            <div 
              className="absolute pointer-events-none z-10 font-mono text-[14px] leading-relaxed flex"
              style={{ 
                 top: `${cursorPos.top + 16}px`, 
                 left: `${cursorPos.left + 64}px`,
              }}
            >
              <div className="flex flex-col relative">
                 <pre className="text-[#888]/60 m-0">
                    {suggestion}
                 </pre>
                 <div className="absolute -left-3 -top-2 w-px h-full bg-[#bc8cff]/40"></div>
                 <div className="absolute top-full left-0 mt-2 bg-[#bc8cff]/10 border border-[#bc8cff]/30 text-[#bc8cff] text-[10px] uppercase font-bold tracking-wider px-2 py-1 flex items-center gap-2 shadow-lg rounded-[2px] backdrop-blur-md">
                    <Sparkles size={12} />
                    AI Suggestion
                    <span className={`bg-[#bc8cff] text-black px-1.5 py-0.5 rounded-[2px] transition-transform ${enterPresses > 0 ? 'scale-110' : ''}`}>
                      Action: press [ENTER] 3 times to accept ({enterPresses}/3)
                    </span>
                 </div>
              </div>
            </div>
         )}

         {/* Custom Find & Replace Bar Overlay */}
         {showSearch && (
            <div className="absolute top-0 right-4 z-20 bg-[#151515] border border-[#222] border-t-0 shadow-lg p-2 w-[320px] flex flex-col gap-2 transition-all animate-in fade-in slide-in-from-top-2 rounded-b-[2px]">
               {/* Find Row */}
               <div className="flex items-center gap-2">
                  <Search size={12} className="text-[#888] shrink-0" />
                  <div className="relative flex-1">
                     <input
                     type="text"
                     autoFocus
                     placeholder="Find"
                     value={findText}
                     onChange={(e) => setFindText(e.target.value)}
                     onKeyDown={(e) => { if (e.key === 'Enter') handleNext(); }}
                     className="w-full bg-[#101012] border border-[#222] text-[#fff] text-[11px] pl-2 pr-12 py-1 rounded-[2px] outline-none focus:border-[#58a6ff] transition-colors"
                     />
                     <span className="absolute right-2 top-[3px] text-[9px] text-[#888]">
                     {findText ? (matches.length > 0 ? `${currentMatch} / ${matches.length}` : 'No results') : ''}
                     </span>
                  </div>
                  <div className="flex bg-[#101012] border border-[#222] rounded-[2px] shrink-0 overflow-hidden">
                     <button onClick={handlePrev} className="p-1 hover:bg-[#202022] text-[#888] hover:text-[#fff] border-r border-[#222] transition-colors"><ChevronUp size={12}/></button>
                     <button onClick={handleNext} className="p-1 hover:bg-[#202022] text-[#888] hover:text-[#fff] transition-colors"><ChevronDown size={12}/></button>
                  </div>
                  <button onClick={() => setShowSearch(false)} className="p-1 text-[#888] hover:text-[#f85149] rounded-[2px] hover:bg-[#202022] transition-colors shrink-0"><X size={12}/></button>
               </div>
               
               {/* Replace Row */}
               <div className="flex items-center gap-2">
                  <ReplaceIcon size={12} className="text-[#888] shrink-0" />
                  <div className="relative flex-1">
                     <input
                     type="text"
                     placeholder="Replace"
                     value={replaceText}
                     onChange={(e) => setReplaceText(e.target.value)}
                     onKeyDown={(e) => { if (e.key === 'Enter') replaceCurrent(); }}
                     className="w-full bg-[#101012] border border-[#222] text-[#fff] text-[11px] pl-2 pr-2 py-1 rounded-[2px] outline-none focus:border-[#58a6ff] transition-colors"
                     />
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                     <button onClick={replaceCurrent} className="px-2 py-1 bg-[#202022] border border-[#222] hover:border-[#888] text-[#fff] rounded-[2px] text-[9px] font-bold uppercase transition-colors uppercase tracking-wider">Replace</button>
                     <button onClick={replaceAll} className="px-2 py-1 bg-[#202022] border border-[#222] hover:border-[#888] text-[#fff] rounded-[2px] text-[9px] font-bold uppercase transition-colors uppercase tracking-wider">All</button>
                  </div>
               </div>
            </div>
         )}

         {/* Floating Editor Controls */}
         <div className="absolute top-4 right-6 z-10 flex items-center gap-3">
            <div className="bg-[#151515]/90 backdrop-blur-md border border-[#222] rounded-[2px] flex shadow-md overflow-hidden text-[#888]">
               <button onClick={handleUndo} className="p-1.5 hover:bg-[#202022] hover:text-[#fff] border-r border-[#222] transition-colors" title="Undo (Cmd+Z)"><Undo size={12} /></button>
               <button onClick={handleRedo} className="p-1.5 hover:bg-[#202022] hover:text-[#fff] border-r border-[#222] transition-colors" title="Redo (Cmd+Shift+Z)"><Redo size={12} /></button>
               <button onClick={() => setShowSearch(!showSearch)} className="p-1.5 hover:bg-[#202022] hover:text-[#fff] transition-colors" title="Find and Replace (Cmd+F)"><Search size={12} /></button>
            </div>
         </div>
      </div>

      {/* Editor Status Bar */}
      <div className="bg-[#0e1014] border-t border-[#222] px-3 py-1 flex items-center justify-between text-[11px] text-[#8b949e] shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: detectedResult.color }} />
            <strong className="text-white">{detectedResult.name}</strong>
            <span className="text-[10px] text-[#3fb950] font-semibold font-mono">({detectedResult.confidence}%)</span>
          </span>
          <span>•</span>
          <span>Monaco: <strong className="text-[#58a6ff]">{editorConfig.monacoLanguage}</strong></span>
          <span>•</span>
          <span>Indent: {editorConfig.tabSize} spaces</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span>Linter: {editorConfig.linterName}</span>
          <span>•</span>
          <span>{editorConfig.encoding}</span>
          <span>•</span>
          <span>{editorConfig.lineEnding}</span>
        </div>
      </div>
    </div>
  );

  if (isPoppedOut) {
    return (
      <>
        <div className="flex-1 w-full h-full flex flex-col items-center justify-center bg-[#0d1117] text-[#8b949e]">
           <FileCode2 size={48} className="mb-4 text-[#30363d]" />
           <p className="text-xl text-white font-bold tracking-widest uppercase mb-2">Code Editor Detached</p>
           <p className="text-[11px] mb-6">This panel is currently running in a separate window.</p>
           <button onClick={() => setIsPoppedOut(false)} className="px-4 py-2 bg-[#1f6feb] text-white rounded text-xs font-bold hover:bg-[#388bfd] transition-colors shadow-lg">
             Restore to Main Window
           </button>
        </div>
        <PopOutPanel title={activeFilename || 'Code Editor'} onClose={() => setIsPoppedOut(false)}>
          {content}
        </PopOutPanel>
      </>
    );
  }

  return content;
}


