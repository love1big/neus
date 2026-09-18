/**
 * ============================================================================
 * MODULE: OfflineCommandPromptTerminal.tsx
 * ============================================================================
 * 
 * [THAI - ภาษาไทย]
 * 1. วัตถุประสงค์และหน้าที่ของคอมโพเนนต์ (Component Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * หน้าต่างเทอร์มินัลและ Command Prompt สำหรับ AI Offline (Offline Command Prompt Terminal):
 *   - ให้สภาพแวดล้อม Command Line Interface (CLI) ที่รันคำสั่งได้จริง 100% ภายในเบราว์เซอร์
 *   - ปรับแต่งหน้าตาให้เหมือนระบบเทอร์มินัลระดับมืออาชีพ (Cyberpunk / Matrix / Unix Terminal)
 *   - มี Prompt `omni@offline-ai:~$ ` พร้อมรองรับการพิมพ์คำสั่ง, ประวัติคำสั่ง (Arrow Up/Down),
 *     และคำแนะนำอัตโนมัติ (Autocompletion suggestions)
 *   - มี Quick Command Action Bar ด้านบน ให้กดคลิกเดียวรันคำสั่งยอดฮิตได้ทันที
 *     (เช่น /sysinfo, /throttle eco, /perf, /nav MapEdit, /sound laser, /test, /clear)
 *   - เรนเดอร์การ์ดผลลัพธ์ Tool Calling (OfflineAIToolCallCard) เมื่อคำสั่งกระตุ้นการทำงานของระบบ
 * 
 * 2. สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - นำเข้าใน:
 *     - `src/components/AIChat.tsx`
 *     - `src/components/AIChatWidget.tsx`
 * - ใช้งาน Engine: `src/utils/OfflineCommandPromptEngine.ts`
 * 
 * 3. พารามิเตอร์ Input / Output ที่รับส่ง (Inputs & Outputs):
 * ----------------------------------------------------------------------------
 * - Props:
 *     - `activeToolId?: string`
 *     - `activeToolName?: string`
 *     - `onClose?: () => void`
 *     - `className?: string`
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  Copy,
  Check,
  Zap,
  Sliders,
  Maximize2,
  Minimize2,
  Trash2,
  HelpCircle,
  Cpu,
  Volume2,
  Compass,
  Download,
  Flame,
  Search
} from 'lucide-react';
import {
  OfflineCommandPromptEngine,
  CommandExecutionResult,
  CommandDefinition
} from '../utils/OfflineCommandPromptEngine';
import OfflineAIToolCallCard from './OfflineAIToolCallCard';

interface OfflineCommandPromptTerminalProps {
  activeToolId?: string;
  activeToolName?: string;
  onClose?: () => void;
  className?: string;
}

interface TerminalLogEntry {
  id: string;
  command: string;
  result: CommandExecutionResult;
}

export default function OfflineCommandPromptTerminal({
  activeToolId,
  activeToolName,
  onClose,
  className = ''
}: OfflineCommandPromptTerminalProps) {
  const engine = OfflineCommandPromptEngine.getInstance();
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<TerminalLogEntry[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<CommandDefinition[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome banner
  useEffect(() => {
    if (logs.length === 0) {
      const welcomeResult: CommandExecutionResult = {
        command: 'system-init',
        stdout: `⚡ ======================================================================
   OMNI MEGA ENGINE - OFFLINE AI COMMAND PROMPT & TERMINAL
   100% Real Hardware & Runtime Execution • Zero Latency • On-Device
======================================================================
• Operating System  : Offline Browser Sandbox Environment
• Active Tool Target: ${activeToolName || activeToolId || 'General Studio'}
• Engine Status     : ALL 150+ SUBSYSTEMS ARMED & READY

Type 'help' to view the full command catalog, or try these quick commands:
  $ sysinfo         -> Inspect CPU, GPU, RAM, VRAM and thermals
  $ throttle eco    -> Force-cap CPU/GPU to prevent browser lockup
  $ perf            -> Inspect real-time FPS, frametime & draw calls
  $ nav MapEdit     -> Switch workspace to 3D Map Editor
  $ sound laser     -> Synthesize and play audio sfx
  $ test            -> Run autonomous diagnostic test suite`,
        exitCode: 0,
        timestamp: new Date().toLocaleTimeString(),
        executionTimeMs: 0
      };
      setLogs([{ id: 'welcome', command: 'system-init', result: welcomeResult }]);
    }
  }, [activeToolId, activeToolName]);

  // Auto-scroll to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Update suggestions on input change
  useEffect(() => {
    const trimmed = input.trim();
    if (trimmed.length > 0) {
      const clean = trimmed.replace(/^[/\\$]\s*/, '').toLowerCase();
      const allCmds = engine.getAllCommands();
      const matched = allCmds.filter(
        c => c.name.toLowerCase().startsWith(clean) || (c.aliases && c.aliases.some(a => a.startsWith(clean)))
      );
      setSuggestions(matched);
      setShowSuggestions(matched.length > 0 && !matched.some(m => m.name.toLowerCase() === clean));
      setSelectedSuggestionIndex(0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [input, engine]);

  const runCommand = async (cmdString: string) => {
    const trimmed = cmdString.trim();
    if (!trimmed) return;

    setIsExecuting(true);
    setInput('');
    setShowSuggestions(false);

    // Update history
    setHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const result = await engine.execute(trimmed);

    // Handle clear screen
    if (result.stdout === '__CLEAR_TERMINAL_SCREEN__') {
      setLogs([]);
      setIsExecuting(false);
      return;
    }

    const newEntry: TerminalLogEntry = {
      id: `cmd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      command: trimmed,
      result
    };

    setLogs(prev => [...prev, newEntry]);
    setIsExecuting(false);

    // Re-focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Autocomplete Tab
    if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setInput(suggestions[selectedSuggestionIndex].name + ' ');
        setShowSuggestions(false);
      }
      return;
    }

    // Suggestion navigation with ArrowDown/ArrowUp
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Escape') {
        setShowSuggestions(false);
        return;
      }
    }

    // Command History Navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIndex = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (history.length > 0 && historyIndex >= 0) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < history.length) {
          setHistoryIndex(nextIndex);
          setInput(history[nextIndex]);
        } else {
          setHistoryIndex(-1);
          setInput('');
        }
      }
      return;
    }

    // Execute Enter
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        const selected = suggestions[selectedSuggestionIndex].name;
        // If user pressed enter on an exact suggestion, execute or complete
        runCommand(selected);
      } else {
        runCommand(input);
      }
    }
  };

  const handleCopyLog = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const QUICK_COMMANDS = [
    { label: '/sysinfo', cmd: 'sysinfo', icon: <Cpu size={11} className="text-cyan-400" /> },
    { label: '/perf', cmd: 'perf', icon: <Zap size={11} className="text-amber-400" /> },
    { label: '/throttle eco', cmd: 'throttle eco', icon: <Sliders size={11} className="text-emerald-400" /> },
    { label: '/nav MapEdit', cmd: 'nav MapEdit', icon: <Compass size={11} className="text-purple-400" /> },
    { label: '/sound laser', cmd: 'sound laser', icon: <Volume2 size={11} className="text-pink-400" /> },
    { label: '/test', cmd: 'test all', icon: <Play size={11} className="text-blue-400" /> },
    { label: '/mem gc', cmd: 'mem gc', icon: <Flame size={11} className="text-orange-400" /> },
    { label: '/help', cmd: 'help', icon: <HelpCircle size={11} className="text-cyan-300" /> }
  ];

  return (
    <div
      className={`flex flex-col h-full bg-[#07090e] text-gray-200 font-mono text-xs border border-[#30363d] rounded-xl overflow-hidden shadow-2xl ${className}`}
    >
      {/* Terminal Titlebar */}
      <div className="bg-[#12161f] px-3 py-2 border-b border-[#21262d] flex items-center justify-between select-none">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-[#30363d] min-w-0">
            <Terminal size={14} className="text-cyan-400 shrink-0" />
            <span className="font-bold text-white text-[11px] truncate tracking-wide">
              OMNI OFFLINE AI COMMAND PROMPT
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 whitespace-nowrap">
              100% REAL EXECUTION
            </span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setLogs([])}
            className="p-1 rounded text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors cursor-pointer"
            title="Clear Terminal Screen (clear)"
          >
            <Trash2 size={13} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-2 py-0.5 rounded text-[10px] text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors cursor-pointer"
            >
              Exit CLI
            </button>
          )}
        </div>
      </div>

      {/* Quick Action Command Chips Bar */}
      <div className="bg-[#0b0e14] px-2.5 py-1.5 border-b border-[#21262d] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] uppercase font-bold text-[#8b949e] tracking-wider shrink-0 mr-1">
          Fast Run:
        </span>
        {QUICK_COMMANDS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => runCommand(chip.cmd)}
            className="px-2 py-0.5 rounded-md bg-[#161b22] hover:bg-[#21262d] text-[#c9d1d9] hover:text-white border border-[#30363d] text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap active:scale-95 shrink-0"
          >
            {chip.icon}
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Terminal Log Stream Area */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 font-mono text-[11px] leading-relaxed">
        {logs.map(entry => (
          <div key={entry.id} className="space-y-1.5 animate-in fade-in duration-100">
            {/* Command Header Line */}
            {entry.command !== 'system-init' && (
              <div className="flex items-center justify-between text-[#8b949e] border-b border-[#21262d]/50 pb-0.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-cyan-400 font-bold">omni@offline-ai:~$</span>
                  <span className="text-white font-bold truncate">{entry.command}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] shrink-0 font-sans">
                  <span>{entry.result.timestamp}</span>
                  <span
                    className={`px-1 rounded text-[9px] font-mono ${
                      entry.result.exitCode === 0
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    code:{entry.result.exitCode}
                  </span>
                  <button
                    onClick={() =>
                      handleCopyLog(entry.id, entry.result.stdout || entry.result.stderr || '')
                    }
                    className="hover:text-white cursor-pointer ml-1"
                    title="Copy command output"
                  >
                    {copiedId === entry.id ? (
                      <Check size={11} className="text-emerald-400" />
                    ) : (
                      <Copy size={11} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Render Tool Call Card if present */}
            {entry.result.toolCall && (
              <OfflineAIToolCallCard
                toolCall={entry.result.toolCall}
                onRerun={() => runCommand(entry.command)}
                defaultExpanded={false}
              />
            )}

            {/* Standard Output (stdout) */}
            {entry.result.stdout && (
              <div className="text-[#38bdf8]/90 whitespace-pre-wrap font-mono break-all pl-2 border-l-2 border-[#38bdf8]/40 bg-[#0c1017]/60 p-2 rounded-r-md">
                {entry.result.stdout}
              </div>
            )}

            {/* Error Output (stderr) */}
            {entry.result.stderr && (
              <div className="text-rose-400 whitespace-pre-wrap font-mono break-all pl-2 border-l-2 border-rose-500/50 bg-rose-950/20 p-2 rounded-r-md">
                {entry.result.stderr}
              </div>
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Autocomplete Suggestions Box */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="bg-[#161b22] border-t border-x border-[#30363d] px-2 py-1.5 shadow-2xl max-h-36 overflow-y-auto">
          <div className="text-[9px] uppercase font-bold text-[#8b949e] px-1 pb-1 flex items-center justify-between">
            <span>Command Suggestions (Press Tab to Complete):</span>
            <span>{suggestions.length} matches</span>
          </div>
          <div className="space-y-0.5">
            {suggestions.map((cmd, idx) => {
              const isSelected = idx === selectedSuggestionIndex;
              return (
                <div
                  key={cmd.name}
                  onClick={() => {
                    setInput(cmd.name + ' ');
                    setShowSuggestions(false);
                    inputRef.current?.focus();
                  }}
                  className={`px-2 py-1 rounded cursor-pointer flex items-center justify-between text-[10.5px] transition-colors ${
                    isSelected ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'hover:bg-[#21262d] text-[#8b949e]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono">{cmd.name}</span>
                    <span className="text-[9.5px] text-[#8b949e]">{cmd.thaiDescription}</span>
                  </div>
                  <span className="text-[9px] text-[#8b949e] font-mono">{cmd.usage}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Command Input Line */}
      <div className="bg-[#10141d] p-2.5 border-t border-[#21262d] flex items-center gap-2">
        <span className="text-cyan-400 font-bold font-mono text-[11px] shrink-0">
          omni@offline-ai:~$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command (e.g. sysinfo, throttle 45, perf, nav MapEdit, help)..."
          disabled={isExecuting}
          className="flex-1 bg-transparent border-none outline-none text-white font-mono text-[11.5px] placeholder-[#484f58]"
          autoComplete="off"
          spellCheck="false"
        />
        <button
          onClick={() => runCommand(input)}
          disabled={!input.trim() || isExecuting}
          className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 disabled:opacity-40 disabled:pointer-events-none border border-cyan-500/40 font-mono text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-all"
        >
          <Play size={10} /> Run
        </button>
      </div>
    </div>
  );
}
