import React, { useState, useEffect, useCallback } from 'react';
import { Cpu, ServerCrash, CheckCircle2, Loader2, ArrowRightLeft, Globe, Zap, Network, Activity, Undo2 } from 'lucide-react';

export type AINetwork = 'ChatGPT' | 'DeepSeek' | 'Gemini' | 'Kimi' | 'Grok' | 'Claude' | 'Meta AI' | 'Copilot' | 'Perplexity' | 'HuggingChat' | 'Mistral' | 'Poe';

export interface AIProvider {
  id: AINetwork;
  name: string;
  status: 'available' | 'rate_limited' | 'offline' | 'connecting';
  latency: number;
}

export const INITIAL_AI_PROVIDERS: AIProvider[] = [
  { id: 'ChatGPT', name: 'ChatGPT Free', status: 'available', latency: 45 },
  { id: 'DeepSeek', name: 'DeepSeek Chat', status: 'available', latency: 120 },
  { id: 'Gemini', name: 'Gemini Free', status: 'available', latency: 60 },
  { id: 'Claude', name: 'Claude Free', status: 'available', latency: 85 },
  { id: 'Kimi', name: 'Kimi Moonshot', status: 'available', latency: 95 },
  { id: 'Grok', name: 'Grok X', status: 'available', latency: 110 },
  { id: 'Meta AI', name: 'Meta AI Free', status: 'available', latency: 130 },
  { id: 'Copilot', name: 'Copilot (Bing)', status: 'available', latency: 150 },
  { id: 'Perplexity', name: 'Perplexity Free', status: 'available', latency: 90 },
  { id: 'HuggingChat', name: 'HuggingChat', status: 'available', latency: 180 },
  { id: 'Mistral', name: 'Le Chat (Mistral)', status: 'available', latency: 70 },
  { id: 'Poe', name: 'Poe Free Models', status: 'available', latency: 140 },
];

export function useUnifiedRouter() {
  const [providers, setProviders] = useState<AIProvider[]>(INITIAL_AI_PROVIDERS);
  const [activeProviderIndex, setActiveProviderIndex] = useState(0);
  const [routingLog, setRoutingLog] = useState<string[]>([]);

  const activeProvider = providers[activeProviderIndex];

  const logRoute = useCallback((msg: string) => {
    setRoutingLog(prev => [...prev.slice(-3), msg]);
  }, []);

  const fallbackToNext = useCallback(() => {
    logRoute(`[${providers[activeProviderIndex].name}] Rate limit exceeded. Modifying nodes...`);
    
    setProviders(prev => {
      const next = [...prev];
      if (next[activeProviderIndex]) {
        next[activeProviderIndex].status = 'rate_limited';
      }
      return next;
    });

    logRoute(`Rerouting to next available priority node...`);

    // Find next available
    setTimeout(() => {
        setProviders(prev => {
            let nextIndex = (activeProviderIndex + 1) % prev.length;
            let attempts = 0;
            while (prev[nextIndex].status !== 'available' && attempts < prev.length) {
              nextIndex = (nextIndex + 1) % prev.length;
              attempts++;
            }
            if (attempts < prev.length) {
              setActiveProviderIndex(nextIndex);
              logRoute(`Established connection with [${prev[nextIndex].name}]`);
            } else {
               logRoute(`CRITICAL: All free AI providers exhausted!`);
            }
            return prev;
        });
    }, 1500);

  }, [activeProviderIndex, providers, logRoute]);

  const resetLimits = useCallback(() => {
      setProviders(INITIAL_AI_PROVIDERS);
      setActiveProviderIndex(0);
      logRoute(`Systems normalized. Rate limits cleared.`);
  }, [logRoute]);

  const selectProviderManual = useCallback((id: AINetwork) => {
      const idx = providers.findIndex(p => p.id === id);
      if (idx !== -1) {
          setActiveProviderIndex(idx);
          logRoute(`Manually switched to [${providers[idx].name}]`);
      }
  }, [providers, logRoute]);

  return {
    providers,
    activeProvider,
    fallbackToNext,
    routingLog,
    resetLimits,
    selectProviderManual
  };
}

interface UnifiedAIControllerProps {
  router: ReturnType<typeof useUnifiedRouter>;
  isProcessing: boolean;
}

export function UnifiedAIController({ router, isProcessing }: UnifiedAIControllerProps) {
  const { providers, activeProvider, fallbackToNext, routingLog, resetLimits, selectProviderManual } = router;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`flex flex-col border-b border-[#30363d] bg-[#0d1117] transition-all duration-300 ${expanded ? 'h-48' : 'h-10'} overflow-hidden shrink-0`}>
        {/* Header - Always visible */}
        <div 
          className="h-10 flex items-center justify-between px-3 cursor-pointer hover:bg-[#161b22] transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
            <div className="flex items-center gap-2">
                <Network size={14} className="text-[#58a6ff]" />
                <span className="text-[12px] font-bold text-[#c9d1d9]">Unified AI Routing</span>
                
                {/* Status Badge */}
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider border ml-2 ${isProcessing ? 'bg-[#58a6ff]/20 text-[#58a6ff] border-[#58a6ff] animate-pulse' : 'bg-[#2ea043]/20 text-[#3fb950] border-[#2ea043]'}`}>
                    {isProcessing ? <Loader2 size={10} className="animate-spin" /> : <Activity size={10} />}
                    <span>ACTIVE: {activeProvider?.name || 'NONE'}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#8b949e] font-mono hidden sm:inline">
                    {providers.filter(p => p.status === 'available').length}/{providers.length} Nodes Online
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); fallbackToNext(); }}
                  className="px-2 py-1 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-[10px] font-bold text-[#c9d1d9] flex items-center gap-1 transition-colors"
                  title="Simulate Rate Limit Failure on current node"
                >
                    <ServerCrash size={10} className="text-[#f85149]" /> Sim Fail
                </button>
            </div>
        </div>

        {/* Expanded Details */}
        {expanded && (
            <div className="flex-1 flex custom-scrollbar border-t border-[#30363d] bg-[#040506]">
               {/* Provider Grid */}
               <div className="flex-1 p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 overflow-y-auto">
                  {providers.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => { if(p.status === 'available') selectProviderManual(p.id) }}
                        disabled={p.status === 'rate_limited'}
                        className={`flex flex-col gap-1 p-2 border rounded text-left transition-all relative ${
                            activeProvider?.id === p.id 
                                ? 'bg-[#58a6ff]/10 border-[#58a6ff]' 
                                : p.status === 'rate_limited'
                                    ? 'bg-[#f85149]/5 border-[#f85149]/30 opacity-50 cursor-not-allowed'
                                    : 'bg-[#161b22] border-[#30363d] hover:border-[#8b949e]'
                        }`}
                      >
                         {activeProvider?.id === p.id && (
                             <div className="absolute top-0 right-0 w-2 h-2 rounded-bl-sm rounded-tr-sm bg-[#58a6ff] animate-pulse" />
                         )}
                         <div className="flex items-center justify-between w-full">
                            <span className={`text-[11px] font-bold ${activeProvider?.id === p.id ? 'text-[#58a6ff]' : p.status === 'rate_limited' ? 'text-[#f85149]' : 'text-[#c9d1d9]'}`}>
                                {p.name}
                            </span>
                            {p.status === 'rate_limited' ? (
                                <ServerCrash size={12} className="text-[#f85149]" />
                            ) : p.status === 'available' ? (
                                <CheckCircle2 size={12} className="text-[#3fb950]" />
                            ) : (
                                <Loader2 size={12} className="text-[#e3b341] animate-spin" />
                            )}
                         </div>
                         <div className="flex items-center justify-between text-[9px] font-mono mt-1">
                             <span className="text-[#8b949e]">{p.latency}ms latency</span>
                             {p.status === 'rate_limited' && <span className="text-[#f85149]">Limit Reached</span>}
                         </div>
                      </button>
                  ))}
               </div>

               {/* Router Logs */}
               <div className="w-1/3 min-w-[200px] border-l border-[#30363d] bg-[#0d1117] p-2 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">Router Logs</span>
                     <button onClick={resetLimits} className="text-[#58a6ff] hover:text-[#79c0ff] text-[10px] flex items-center gap-1">
                         <Undo2 size={10} /> Reset All
                     </button>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1 font-mono text-[9px]">
                      {routingLog.length === 0 ? (
                          <div className="text-[#8b949e] text-center mt-4">No routing events yet.</div>
                      ) : (
                          routingLog.map((log, i) => (
                              <div key={i} className="text-[#c9d1d9] border-l-[2px] border-[#58a6ff] pl-1.5 py-0.5">
                                  {log}
                              </div>
                          ))
                      )}
                  </div>
               </div>
            </div>
        )}
    </div>
  );
}
