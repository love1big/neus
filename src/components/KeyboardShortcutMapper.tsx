import React, { useState, useEffect } from 'react';
import { Command, Save, AlertTriangle, X, Keyboard, RotateCcw, Search, CheckCircle, PlaySquare, Plus, Trash2, ListTree, ArrowRight, GripHorizontal } from 'lucide-react';
import { ShortcutDef, defaultShortcuts } from '../hooks/useGlobalShortcuts';

export default function KeyboardShortcutMapper() {
  const [shortcuts, setShortcuts] = useState<ShortcutDef[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempShortcut, setTempShortcut] = useState<ShortcutDef | null>(null);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Macro Recorder State
  const [isMacroMode, setIsMacroMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [macroSequence, setMacroSequence] = useState<{id: string, name: string}[]>([]);
  const [newMacroName, setNewMacroName] = useState('');
  const [macroKey, setMacroKey] = useState<Partial<ShortcutDef> | null>(null);

  // Drag and Drop State
  const [draggedNodeIndex, setDraggedNodeIndex] = useState<number | null>(null);
  const [dragOverNodeIndex, setDragOverNodeIndex] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('omni_shortcuts');
    if (saved) {
      try {
        setShortcuts(JSON.parse(saved));
      } catch (e) {
        setShortcuts([...defaultShortcuts]);
      }
    } else {
      setShortcuts([...defaultShortcuts]);
    }
  }, []);

  const handleSave = () => {
    setSaveStatus('saving');
    localStorage.setItem('omni_shortcuts', JSON.stringify(shortcuts));
    window.dispatchEvent(new Event('shortcuts_updated'));
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all shortcuts to defaults? Macros will be preserved.")) {
      const existingMacros = shortcuts.filter(s => s.isMacro);
      setShortcuts([...defaultShortcuts, ...existingMacros]);
      setEditingId(null);
      setConflictError(null);
    }
  };

  // Regular Editing
  const startEditing = (def: ShortcutDef) => {
    if (isRecording) return; // Prevent normal editing while recording a macro
    setEditingId(def.id);
    setTempShortcut({ ...def });
    setConflictError(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setTempShortcut(null);
    setConflictError(null);
  };

  const checkConflict = (def: Partial<ShortcutDef>, ignoreId?: string) => {
    return shortcuts.find(s => 
      s.id !== ignoreId && 
      s.key.toLowerCase() === def.key?.toLowerCase() &&
      s.ctrl === def.ctrl &&
      s.shift === def.shift &&
      s.alt === def.alt &&
      s.meta === def.meta
    );
  };

  const saveEditing = () => {
    if (!tempShortcut) return;
    
    const conflict = checkConflict(tempShortcut, tempShortcut.id);
    if (conflict) {
      setConflictError(`Conflict with "${conflict.actionName}"`);
      return;
    }

    setShortcuts(prev => prev.map(s => s.id === tempShortcut.id ? tempShortcut : s));
    setEditingId(null);
    setTempShortcut(null);
    setConflictError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!editingId || !tempShortcut) return;
    e.preventDefault();
    e.stopPropagation();

    if (e.key === 'Escape') {
      cancelEditing();
      return;
    }
    if (e.key === 'Enter') {
      saveEditing();
      return;
    }

    if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return;

    setTempShortcut({
      ...tempShortcut,
      key: e.key.toLowerCase(),
      ctrl: e.ctrlKey,
      shift: e.shiftKey,
      alt: e.altKey,
      meta: e.metaKey
    });
    setConflictError(null);
  };

  // Macro Recording Logic
  const handleMacroKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return;

    setMacroKey({
      key: e.key.toLowerCase(),
      ctrl: e.ctrlKey,
      shift: e.shiftKey,
      alt: e.altKey,
      meta: e.metaKey
    });
    setConflictError(null);
  };

  const addMacroStep = (def: ShortcutDef) => {
    if (!isRecording) return;
    if (def.isMacro) return; // Don't allow nested macros to prevent infinite loops
    setMacroSequence(prev => [...prev, { id: def.id, name: def.actionName }]);
  };

  const removeMacroStep = (index: number) => {
    setMacroSequence(prev => prev.filter((_, i) => i !== index));
  };

  const startRecordingMacro = () => {
    setIsRecording(true);
    setMacroSequence([]);
    setNewMacroName('');
    setMacroKey(null);
    setConflictError(null);
  };

  const cancelMacro = () => {
    setIsRecording(false);
    setMacroSequence([]);
    setNewMacroName('');
    setMacroKey(null);
    setConflictError(null);
  };

  const saveMacro = () => {
    if (!macroKey || !macroKey.key) {
      setConflictError("Keybinding required for macro.");
      return;
    }
    if (!newMacroName.trim()) {
      setConflictError("Macro name required.");
      return;
    }
    if (macroSequence.length === 0) {
      setConflictError("Macro sequence cannot be empty.");
      return;
    }

    const conflict = checkConflict(macroKey);
    if (conflict) {
      setConflictError(`Conflict with "${conflict.actionName}"`);
      return;
    }

    const newMacroDef: ShortcutDef = {
      id: `macro_${Date.now()}`,
      actionName: `[Macro] ${newMacroName}`,
      key: macroKey.key,
      ctrl: !!macroKey.ctrl,
      shift: !!macroKey.shift,
      alt: !!macroKey.alt,
      meta: !!macroKey.meta,
      isMacro: true,
      macroSequence: macroSequence.map(step => step.id)
    };

    setShortcuts(prev => [...prev, newMacroDef]);
    cancelMacro();
  };

  const deleteMacro = (id: string) => {
    if (confirm("Delete this macro?")) {
      setShortcuts(prev => prev.filter(s => s.id !== id));
    }
  };

  const filteredShortcuts = shortcuts.filter(s => 
    s.actionName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatKeyDisplay = (s: Partial<ShortcutDef>) => {
    if (!s.key) return '';
    const parts = [];
    if (s.ctrl) parts.push('Ctrl');
    if (s.meta) parts.push('Cmd');
    if (s.alt) parts.push('Alt');
    if (s.shift) parts.push('Shift');
    parts.push(s.key.toUpperCase());
    return parts.join(' + ');
  };

  return (
    <div className="w-full h-full bg-[#0d1117] text-[#c9d1d9] flex flex-col font-mono overflow-hidden relative">
      {/* Header */}
      <div className="h-14 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Command size={18} className="text-[#58a6ff]" />
          <h1 className="text-[14px] font-bold tracking-wide uppercase text-white shadow-[#58a6ff]">Keyboard Shortcut Mapper</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMacroMode(!isMacroMode)}
            className={`px-3 py-1.5 border rounded text-[11px] font-bold transition flex items-center gap-2 
              ${isMacroMode ? 'bg-[#1f6feb] border-[#1f6feb] text-white' : 'bg-[#21262d] border-[#30363d] text-[#c9d1d9] hover:bg-[#30363d]'}`}
          >
            <PlaySquare size={14} /> Macro Recorder
          </button>
          <div className="w-px h-6 bg-[#30363d]" />
          <button 
             onClick={handleReset}
             className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-[11px] font-bold transition flex items-center gap-2 text-[#8b949e]"
           >
             <RotateCcw size={12} /> Reset Defaults
           </button>
           <button 
             onClick={handleSave}
             disabled={saveStatus === 'saving'}
             className={`px-4 py-1.5 rounded text-[11px] font-bold transition flex items-center gap-2 
              ${saveStatus === 'saved' ? 'bg-[#238636] text-white' : 'bg-[#58a6ff] hover:bg-[#318bf8] text-[#0d1117]'}`}
           >
             {saveStatus === 'saving' ? <RotateCcw size={14} className="animate-spin" /> : 
              saveStatus === 'saved' ? <CheckCircle size={14} /> : <Save size={14} />}
             {saveStatus === 'saving' ? 'SAVING...' : saveStatus === 'saved' ? 'SAVED' : 'SAVE CHANGES'}
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col gap-6 relative">
        
        {/* Macro Recorder Panel */}
        {isMacroMode && (
          <div className="bg-[#161b22] border border-[#58a6ff] rounded-lg p-5 flex flex-col gap-4 shrink-0 shadow-[0_0_15px_rgba(88,166,255,0.1)] transition-all">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                <ListTree size={16} className="text-[#58a6ff]" /> 
                Macro Builder
              </h2>
              {!isRecording && (
                <button 
                  onClick={startRecordingMacro}
                  className="px-3 py-1.5 bg-[#238636] text-white hover:bg-[#2ea043] rounded text-[11px] font-bold flex items-center gap-2 transition"
                >
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" /> Create New Macro
                </button>
              )}
            </div>

            {isRecording ? (
              <div className="flex flex-col gap-4 border border-[#30363d] bg-[#0d1117] p-4 rounded-md">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] text-[#8b949e] font-bold uppercase mb-1 block">Macro Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Quick Setup Sequence" 
                      value={newMacroName}
                      onChange={(e) => setNewMacroName(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded-md px-3 py-2 text-[12px] text-white focus:outline-none focus:border-[#58a6ff]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8b949e] font-bold uppercase mb-1 block">Trigger Keybinding</label>
                    <div 
                      autoFocus
                      tabIndex={0}
                      onKeyDown={handleMacroKeyDown}
                      className={`inline-block px-3 py-2 rounded border-2 outline-none text-[12px] font-bold text-center cursor-pointer min-w-[150px] bg-[#161b22] 
                        ${conflictError ? 'border-[#f85149] text-[#f85149]' : 'border-[#58a6ff] text-[#58a6ff]'}`}
                    >
                      {formatKeyDisplay(macroKey || {}) || "Click & Press Key..."}
                    </div>
                  </div>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4 flex flex-col gap-3 overflow-hidden">
                  <div className="text-[11px] text-[#8b949e] font-bold uppercase flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f85149] animate-pulse" /> 
                    Sequence Flow Graph (Drag to Reorder)
                  </div>
                  <div className="flex items-center overflow-x-auto pb-4 pt-2 gap-3 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
                    {macroSequence.length === 0 ? (
                      <div className="w-full flex flex-col items-center justify-center py-6 border-2 border-dashed border-[#30363d] rounded-lg text-[#8b949e]">
                        <ListTree size={24} className="mb-2 opacity-50" />
                        <span className="text-[11px] uppercase tracking-wide">Flow Sequence is empty</span>
                        <span className="text-[10px] opacity-70">Click actions from the list below to append nodes</span>
                      </div>
                    ) : (
                      macroSequence.map((step, i) => (
                        <React.Fragment key={`${step.id}-${i}`}>
                          <div 
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.effectAllowed = 'move';
                              e.dataTransfer.setData('text/plain', i.toString());
                              setDraggedNodeIndex(i);
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = 'move';
                              setDragOverNodeIndex(i);
                            }}
                            onDragLeave={() => setDragOverNodeIndex(null)}
                            onDrop={(e) => {
                              e.preventDefault();
                              const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
                              if (fromIndex !== i && !isNaN(fromIndex)) {
                                const newSeq = [...macroSequence];
                                const [moved] = newSeq.splice(fromIndex, 1);
                                newSeq.splice(i, 0, moved);
                                setMacroSequence(newSeq);
                              }
                              setDraggedNodeIndex(null);
                              setDragOverNodeIndex(null);
                            }}
                            onDragEnd={() => {
                              setDraggedNodeIndex(null);
                              setDragOverNodeIndex(null);
                            }}
                            className={`flex flex-col min-w-[140px] max-w-[160px] shrink-0 bg-[#0d1117] border-2 rounded-lg cursor-grab active:cursor-grabbing snap-center transition-all
                              ${dragOverNodeIndex === i ? 'border-[#58a6ff] shadow-[0_0_15px_rgba(88,166,255,0.3)] scale-105' : 'border-[#30363d] hover:border-[#8b949e]'}
                              ${draggedNodeIndex === i ? 'opacity-50' : 'opacity-100'}`}
                          >
                            <div className="bg-[#21262d] px-2 py-1.5 border-b border-[#30363d] flex items-center justify-between rounded-t-md">
                              <div className="flex items-center gap-1.5 text-[#8b949e]">
                                <GripHorizontal size={12} className="cursor-grab" />
                                <span className="text-[10px] font-bold">Node {i + 1}</span>
                              </div>
                              <button onClick={() => removeMacroStep(i)} className="text-[#8b949e] hover:text-[#f85149] transition">
                                <X size={12} />
                              </button>
                            </div>
                            <div className="p-3 flex items-center justify-center text-center">
                              <span className="text-[11px] font-bold text-white leading-tight break-words">{step.name}</span>
                            </div>
                          </div>
                          {i < macroSequence.length - 1 && (
                            <div className="flex items-center justify-center text-[#58a6ff] shrink-0 animate-pulse">
                              <ArrowRight size={16} />
                            </div>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </div>
                </div>
                
                {conflictError && (
                  <div className="text-[#f85149] text-[11px] font-bold flex items-center gap-2 bg-[#f85149]/10 p-2 rounded">
                    <AlertTriangle size={14} /> {conflictError}
                  </div>
                )}

                <div className="flex items-center gap-3 justify-end mt-2">
                  <button onClick={cancelMacro} className="px-4 py-1.5 bg-[#21262d] text-[#8b949e] border border-[#30363d] hover:bg-[#30363d] hover:text-white rounded text-[11px] font-bold transition">
                    Cancel
                  </button>
                  <button onClick={saveMacro} className="px-4 py-1.5 bg-[#58a6ff] text-[#0d1117] hover:bg-[#318bf8] rounded text-[11px] font-bold transition">
                    Save Macro
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-[#8b949e]">
                Create multi-action sequences bound to a single hotkey. They execute consecutively with a slight 400ms visual delay.
              </div>
            )}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center gap-4 mt-2">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b949e]" />
            <input 
              type="text" 
              placeholder="Search actions or macros..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161b22] border border-[#30363d] rounded-md pl-9 pr-4 py-2 text-[12px] text-white focus:outline-none focus:border-[#58a6ff]"
            />
          </div>
          <div className="text-[11px] text-[#8b949e] flex items-center gap-2">
            <Keyboard size={14} />
            <span>
              {isRecording 
                ? <span className="text-[#f85149] font-bold animate-pulse">🔴 SELECT ACTIONS BELOW TO BUILD MACRO</span> 
                : "Click any binding to remap. Press ESC to cancel."}
            </span>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#21262d] sticky top-0 z-10 border-b border-[#30363d]">
              <tr>
                <th className="py-3 px-4 text-[11px] font-bold text-[#8b949e] uppercase tracking-wider w-1/2">Action</th>
                <th className="py-3 px-4 text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">Keybinding</th>
                <th className="py-3 px-4 text-[11px] font-bold text-[#8b949e] uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredShortcuts.map((shortcut) => {
                const isEditing = editingId === shortcut.id;
                const currentDef = isEditing && tempShortcut ? tempShortcut : shortcut;
                
                // Dim rows while recording macros if they are macros themselves
                const isDisabledForMacro = isRecording && shortcut.isMacro;

                return (
                  <tr 
                    key={shortcut.id} 
                    className={`border-b border-[#30363d]/50 transition-colors group
                      ${isRecording ? (isDisabledForMacro ? 'opacity-30' : 'hover:bg-[#1f6feb]/20 cursor-pointer') : 'hover:bg-[#21262d]/50'}`}
                    onClick={() => {
                      if (isRecording && !shortcut.isMacro) addMacroStep(shortcut);
                    }}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {shortcut.isMacro && <ListTree size={14} className="text-[#d29922]" />}
                        <div className={`text-[13px] font-medium ${shortcut.isMacro ? 'text-[#d29922]' : 'text-white'}`}>
                          {shortcut.actionName}
                        </div>
                      </div>
                      <div className="text-[10px] text-[#8b949e] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {shortcut.isMacro && shortcut.macroSequence ? `Sequence: ${shortcut.macroSequence.length} steps` : `ID: ${shortcut.id}`}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {isEditing && !isRecording ? (
                        <div className="flex flex-col gap-2">
                          <div 
                            autoFocus
                            tabIndex={0}
                            onKeyDown={handleKeyDown}
                            className={`inline-block px-3 py-1.5 rounded border-2 outline-none text-[12px] font-bold text-center cursor-pointer min-w-[120px] bg-[#0d1117] 
                              ${conflictError ? 'border-[#f85149] text-[#f85149] shadow-[0_0_8px_rgba(248,81,73,0.4)]' : 'border-[#58a6ff] text-[#58a6ff] shadow-[0_0_8px_rgba(88,166,255,0.4)]'}`}
                          >
                            {formatKeyDisplay(currentDef) || "Press keys..."}
                          </div>
                          {conflictError && (
                            <div className="flex items-center gap-1 text-[#f85149] text-[10px]">
                              <AlertTriangle size={10} /> {conflictError}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <button onClick={saveEditing} className="px-2 py-1 bg-[#238636] text-white text-[10px] rounded hover:bg-[#2ea043]">Apply</button>
                            <button onClick={cancelEditing} className="px-2 py-1 bg-[#21262d] text-[#8b949e] text-[10px] rounded border border-[#30363d] hover:text-white">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(shortcut);
                            }}
                            disabled={isRecording}
                            className={`px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-[12px] font-bold transition-colors
                              ${isRecording ? 'text-[#8b949e] cursor-not-allowed' : 'text-[#c9d1d9] hover:border-[#58a6ff] hover:text-[#58a6ff]'}`}
                          >
                            {formatKeyDisplay(currentDef)}
                          </button>
                          {isRecording && !shortcut.isMacro && (
                            <div className="text-[10px] font-bold text-[#58a6ff] bg-[#58a6ff]/10 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                              <Plus size={10} /> ADD
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {shortcut.isMacro && !isRecording && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteMacro(shortcut.id); }}
                            className="text-[#8b949e] hover:text-[#f85149] transition-colors p-1"
                            title="Delete Macro"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                        {shortcut.isMacro ? (
                          <span className="text-[10px] px-2 py-1 rounded-full bg-[#1f6feb]/10 text-[#58a6ff] border border-[#1f6feb]/30">Macro</span>
                        ) : shortcut.key !== defaultShortcuts.find(d => d.id === shortcut.id)?.key ||
                         shortcut.ctrl !== defaultShortcuts.find(d => d.id === shortcut.id)?.ctrl ||
                         shortcut.shift !== defaultShortcuts.find(d => d.id === shortcut.id)?.shift ||
                         shortcut.alt !== defaultShortcuts.find(d => d.id === shortcut.id)?.alt ? (
                          <span className="text-[10px] px-2 py-1 rounded-full bg-[#d29922]/10 text-[#d29922] border border-[#d29922]/30">Modified</span>
                        ) : (
                          <span className="text-[10px] px-2 py-1 rounded-full bg-[#30363d] text-[#8b949e]">Default</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredShortcuts.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-[#8b949e] text-[12px] italic">
                    No shortcuts found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
