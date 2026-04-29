import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { LANGUAGES } from '../lib/constants';
import { ChevronUp, ChevronDown, X, Search, Replace as ReplaceIcon, Undo, Redo } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
}

export default function CodeEditor({ code, setCode, language, setLanguage }: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  
  const [showSearch, setShowSearch] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matches, setMatches] = useState<any[]>([]);
  const [currentMatch, setCurrentMatch] = useState(0);

  // Update matches whenever code or findText changes
  useEffect(() => {
    if (!editorRef.current || !findText) {
      setMatches([]);
      setCurrentMatch(0);
      return;
    }
    const model = editorRef.current.getModel();
    if (!model) return;

    // Use Monaco's findMatches API
    const foundMatches = model.findMatches(findText, false, false, false, null, true);
    setMatches(foundMatches);
    
    if (foundMatches.length > 0) {
      // Keep current index valid
      if (currentMatch === 0 || currentMatch > foundMatches.length) {
        setCurrentMatch(1);
        highlightMatch(foundMatches[0]);
      } else {
        highlightMatch(foundMatches[currentMatch - 1]);
      }
    } else {
      setCurrentMatch(0);
    }
  }, [findText, code]); // Re-run when code changes

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

    // Override default Cmd+F to open custom search
    editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyF, () => {
      setShowSearch(true);
      // Auto-populate with selected text if any
      const selection = editor.getSelection();
      const model = editor.getModel();
      if (selection && !selection.isEmpty() && model) {
         setFindText(model.getValueInRange(selection));
      }
    });

    // Provide an escape mechanism to close search
    editor.addCommand(monacoInstance.KeyCode.Escape, () => {
      setShowSearch(false);
    });

    // Add AI Actions to right click menu
    editor.addAction({
      id: 'ai-refactor',
      label: '✨ AI Refactor / Optimize...',
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run: function (ed: any) {
        alert("NEXUS AI: Refactoring selection to improve performance and readability...");
      }
    });

    editor.addAction({
      id: 'ai-explain',
      label: '💭 AI Explain Code...',
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.6,
      run: function (ed: any) {
        alert("NEXUS AI: Analyzing code logic and generating documentation...");
      }
    });

    editor.addAction({
      id: 'ai-fix-bugs',
      label: '🐛 AI Debug & Fix...',
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.7,
      run: function (ed: any) {
        alert("NEXUS AI: Running static analysis and memory leak detection...");
      }
    });
  };

  const handleUndo = () => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'undo', null);
    }
  };

  const handleRedo = () => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'redo', null);
    }
  };

  const beforeMount = (monaco: any) => {
    monaco.editor.defineTheme('clean-minimalism', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'ff7b72' },
        { token: 'string', foreground: 'a5d6ff' },
        { token: 'comment', foreground: '8b949e' },
      ],
      colors: {
        'editor.background': '#0d1117',
        'editor.lineHighlightBackground': '#161b22',
        'editorLineNumber.foreground': '#484f58',
        'editorIndentGuide.background': '#30363d',
      }
    });
  };

  return (
    <div className="h-full flex flex-col relative w-full bg-[#0d1117]">
      {/* Custom Find & Replace Bar Overlay */}
      {showSearch && (
        <div className="absolute top-0 right-8 z-20 bg-[#161b22] border border-[#30363d] rounded-b-[6px] shadow-2xl p-3 w-[360px] flex flex-col gap-3 transition-all animate-in fade-in slide-in-from-top-2">
          {/* Find Row */}
          <div className="flex items-center gap-2">
            <Search size={14} className="text-[#8b949e] shrink-0" />
            <div className="relative flex-1">
              <input
                type="text"
                autoFocus
                placeholder="Find"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleNext(); }}
                className="w-full bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] text-[12px] pl-2 pr-16 py-1.5 rounded outline-none focus:border-[#58a6ff] transition-colors"
               />
               <span className="absolute right-2 top-[7px] text-[10px] text-[#8b949e]">
                 {findText ? (matches.length > 0 ? `${currentMatch} of ${matches.length}` : 'No results') : ''}
               </span>
            </div>
            <div className="flex bg-[#0d1117] border border-[#30363d] rounded shrink-0 overflow-hidden">
               <button onClick={handlePrev} className="p-1.5 hover:bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9] border-r border-[#30363d] transition-colors"><ChevronUp size={14}/></button>
               <button onClick={handleNext} className="p-1.5 hover:bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9] transition-colors"><ChevronDown size={14}/></button>
            </div>
            <button onClick={() => setShowSearch(false)} className="p-1.5 text-[#8b949e] hover:text-[#ff7b72] rounded hover:bg-[#21262d] transition-colors shrink-0"><X size={14}/></button>
          </div>
          
          {/* Replace Row */}
          <div className="flex items-center gap-2">
            <ReplaceIcon size={14} className="text-[#8b949e] shrink-0" />
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Replace"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') replaceCurrent(); }}
                className="w-full bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] text-[12px] px-2 py-1.5 rounded outline-none focus:border-[#58a6ff] transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
               <button onClick={replaceCurrent} className="px-3 py-1 bg-[#21262d] border border-[#30363d] hover:border-[#8b949e] text-[#c9d1d9] rounded text-[11px] transition-colors font-medium">Replace</button>
               <button onClick={replaceAll} className="px-3 py-1 bg-[#21262d] border border-[#30363d] hover:border-[#8b949e] text-[#c9d1d9] rounded text-[11px] transition-colors font-medium">All</button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Overlay Controls */}
      <div className="absolute bottom-4 right-6 z-10 flex items-center gap-3">
        {/* Undo/Redo Buttons */}
        <div className="bg-[#161b22] border border-[#30363d] rounded flex shadow-lg overflow-hidden">
          <button 
            onClick={handleUndo}
            className="p-2 hover:bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9] border-r border-[#30363d] transition-colors"
            title="Undo (Cmd+Z)"
          >
            <Undo size={16} />
          </button>
          <button 
            onClick={handleRedo}
            className="p-2 hover:bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
            title="Redo (Cmd+Shift+Z)"
          >
            <Redo size={16} />
          </button>
        </div>

        {/* Toggle Search Button */}
        <button 
          onClick={() => setShowSearch(!showSearch)}
          className="bg-[#161b22] border border-[#30363d] hover:border-[#8b949e] rounded p-2 shadow-lg text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
          title="Find and Replace (Cmd+F)"
        >
          <Search size={16} />
        </button>

        {/* Language Selector Overlay */}
        <div className="bg-[#161b22] border border-[#30363d] rounded p-2 shadow-lg flex items-center space-x-2">
          <label htmlFor="language-select" className="text-[11px] text-[#8b949e] uppercase tracking-[1px]">Language:</label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-[12px] w-auto focus:outline-none text-[#58a6ff] cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang} className="bg-[#161b22] text-[#c9d1d9] text-[12px]">
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <Editor
        height="100%"
        language={language}
        value={code}
        theme="clean-minimalism"
        beforeMount={beforeMount}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          fontFamily: "var(--code-font, 'Courier New', Courier, monospace)",
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          padding: { top: 16 },
        }}
      />
    </div>
  );
}
