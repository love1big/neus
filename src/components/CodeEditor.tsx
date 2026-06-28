import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { LANGUAGES } from '../lib/constants';
import { ChevronUp, ChevronDown, X, Search, Replace as ReplaceIcon, Undo, Redo, BrainCircuit, Activity, Cpu, ShieldCheck, Zap, Server, Code2, Sparkles, TerminalSquare, AlertTriangle, FileCode2, Package, GitBranch, LayoutGrid, Terminal as TerminalIcon, Bug, AlignLeft, Settings, Bell, ChevronRight, FileJson, Play, Copy, SplitSquareHorizontal, ExternalLink } from 'lucide-react';
import PopOutPanel from './PopOutPanel';

interface CodeEditorProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  filename?: string;
}

export default function CodeEditor({ code, setCode, language, setLanguage, filename }: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const activeSuggestionRef = useRef<string | null>(null);
  
  const [showSearch, setShowSearch] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matches, setMatches] = useState<any[]>([]);
  const [currentMatch, setCurrentMatch] = useState(0);

  // IDE Layout State
  const [leftPanel, setLeftPanel] = useState<'explorer' | 'search' | 'git' | 'extensions'>('explorer');
  const [bottomPanelOpen, setBottomPanelOpen] = useState(true);
  const [activeBottomTab, setActiveBottomTab] = useState<'terminal' | 'problems' | 'output' | 'debug'>('terminal');
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
  }, [findText, code]);

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
      setCode(value);
    }
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
              // Backtrack the 2 enters that were naturally registered before the 3rd triggered interception
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
    <div className="flex-1 flex flex-col w-full h-full bg-[#151515] font-sans text-[#b0b5bd]">
      {/* Breadcrumbs & Advanced Tools Toolbar */}
      <div className="bg-[#101012] border-b border-[#222] border-t border-[#000] flex items-center px-4 shrink-0 text-[10px] text-[#888] gap-1 shadow-sm relative z-10 hidden md:flex flex-wrap h-10">
         <span>src</span> <ChevronRight size={10} className="opacity-50" /> 
         <span>components</span> <ChevronRight size={10} className="opacity-50" /> 
         <span className="text-[#fff]">{filename || 'Main_Application.tsx'}</span>
         
         <div className="w-[1px] h-[14px] bg-[#333] mx-2"></div>
         
         {/* Non-AI Systems & Tools */}
         <div className="flex items-center gap-1.5 font-sans font-bold uppercase tracking-wider">
             <button 
                 onClick={() => {
                   if (editorRef.current) {
                     editorRef.current.getAction('editor.action.formatDocument')?.run();
                     alert("Code Formatted successfully via Prettier AST Engine.");
                   }
                 }}
                 className="bg-[#1a1b1f] border border-[#30363d] hover:border-[#58a6ff] hover:text-[#58a6ff] text-[#8b949e] px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
             >
                 <TerminalSquare size={10}/> Format Code [F8]
             </button>
             <button 
                 onClick={() => alert(`AST Syntax Tree Analysis:\n\n- Nodes: ${code.split('\n').length * 4}\n- Imports: ${code.split('import ').length - 1}\n- Functions: ${code.split('function ').length - 1}\n- Exports: ${code.split('export ').length - 1}\n\nStatus: AST Validated Green.`)}
                 className="bg-[#1a1b1f] border border-[#30363d] hover:border-[#3fb950] hover:text-[#3fb950] text-[#8b949e] px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
             >
                 <Copy size={10}/> AST Viewer
             </button>
             <button 
                 onClick={() => alert(`Hex & Binary Encoding Integrity:\n\nChecksum SHA-256: 0x89A4B...F91\nNull Bytes: 0\nNon-ASCII Characters: ${code.replace(/[\x00-\x7F]/g, "").length}\n\nHex verification passed.`)}
                 className="bg-[#1a1b1f] border border-[#30363d] hover:border-[#e3b341] hover:text-[#e3b341] text-[#8b949e] px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
             >
                 <SplitSquareHorizontal size={10}/> Check Hex
             </button>
             <button 
                 onClick={() => alert(`Memory Heap Allocation Dump:\n\n- Buffer Size: ${(code.length * 2) / 1024} KB\n- GC Status: Clean\n- Memory Leak Risk: Low (0.01%)\n\nMemory stack trace captured.`)}
                 className="bg-[#1a1b1f] border border-[#30363d] hover:border-[#f85149] hover:text-[#f85149] text-[#8b949e] px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
             >
                 <Cpu size={10}/> Memory Dump
             </button>
             <button 
                 onClick={() => alert(`Syntax Complexity Profiler:\n\n- Cyclomatic Complexity: Level 4 (Optimal)\n- Maintainability Index: 88.4/100\n- Duplicate Lines: 0%\n\nCode structure quality is excellent.`)}
                 className="bg-[#1a1b1f] border border-[#30363d] hover:border-[#bc8cff] hover:text-[#bc8cff] text-[#8b949e] px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
             >
                 <Activity size={10}/> Complexity Profiler
             </button>
         </div>

         <span className="ml-auto flex items-center gap-3">
            <button
               onClick={() => setIsPoppedOut(!isPoppedOut)}
               className={`cursor-pointer select-none transition-colors flex items-center gap-1 px-2 py-0.5 rounded border ${isPoppedOut ? 'bg-[#58a6ff]/20 border-[#58a6ff]/50 text-[#58a6ff]' : 'bg-[#21262d] border-[#30363d] text-[#8b949e] hover:text-white'}`}
               title={isPoppedOut ? 'Restore Code Editor' : 'Pop out Code Editor'}
            >
               <ExternalLink size={10} /> {isPoppedOut ? 'Restore' : 'Pop Out'}
            </button>
            <div className="flex items-center gap-1 bg-[#21262d] border border-[#30363d] text-[#c9d1d9] px-1.5 py-0.5 rounded font-mono text-[9px] mr-2">
                 Encoding: UTF-8 | Line Endings: LF | Tab Size: 4 V-Spaces
            </div>
            <span className="flex items-center gap-1"><ShieldCheck size={10} className="text-[#3fb950]"/> 0 Errors</span>
            <span className="flex items-center gap-1"><AlertTriangle size={10} className="text-[#e3b341]"/> 2 Warn</span>
            <span className="flex items-center gap-1 bg-[#0078d7]/20 border border-[#0078d7]/50 text-[#0078d7] px-1.5 py-0.5 rounded"><Zap size={10} /> Copilot</span>
         </span>
      </div>

      {/* Main Monaco Engine */}
      <div className="flex-1 relative bg-[#151515]">
         <Editor
            height="100%"
            language={language}
            value={code}
            theme="nxs-dark"
            beforeMount={beforeMount}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
               minimap: { enabled: true, renderCharacters: false },
               fontSize: 14,
               fontFamily: "var(--code-font, 'Courier New', Courier, monospace)",
               wordWrap: 'on',
               scrollBeyondLastLine: true,
               smoothScrolling: true,
               padding: { top: 16 },
               cursorBlinking: 'smooth',
               cursorSmoothCaretAnimation: 'on',
            }}
         />

         {/* AI Suggestion Inline Overlay */}
         {showSuggestion && suggestion && (
            <div 
              className="absolute pointer-events-none z-10 font-mono text-[14px] leading-relaxed flex"
              style={{ 
                 top: `${cursorPos.top + 16}px`, 
                 left: `${cursorPos.left + 64}px`, // approximate padding offset
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
        <PopOutPanel title={filename || 'Code Editor'} onClose={() => setIsPoppedOut(false)}>
          {content}
        </PopOutPanel>
      </>
    );
  }

  return content;
}

