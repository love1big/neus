import React, { createContext, useContext, useEffect, useState, useRef, ReactNode, Component, ErrorInfo } from 'react';
import { AlertTriangle, Activity, RefreshCw, HardDrive, Cpu, TerminalSquare, ShieldAlert, Wifi} from 'lucide-react';

export type ThreatLevel = 'NORMAL' | 'ELEVATED' | 'CRITICAL';

// --- WATCHDOG CONTEXT ---
interface SystemHealth {
  isThrottled: boolean;
  eventLoopLag: number;
  fps: number;
  memoryUsage: number;
  threatLevel: ThreatLevel;
  activeWarnings: string[];
  registerWorker: (id: string, startCb: () => void, stopCb: () => void) => void;
  unregisterWorker: (id: string) => void;
  triggerPanic: (reason: string) => void;
}

const SystemHealthContext = createContext<SystemHealth>({
  isThrottled: false,
  eventLoopLag: 0,
  fps: 60,
  memoryUsage: 0,
  threatLevel: 'NORMAL',
  activeWarnings: [],
  registerWorker: () => {},
  unregisterWorker: () => {},
  triggerPanic: () => {}
});

export const useSystemHealth = () => useContext(SystemHealthContext);

// --- ERROR BOUNDARY ---
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  panicReason: string | null;
}

class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, panicReason: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null, panicReason: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Critical System Crash Detected:", error, errorInfo);
    this.setState({ errorInfo });
  }

  triggerManualPanic = (reason: string) => {
    this.setState({ hasError: true, error: new Error(reason), panicReason: reason });
  }

  resetSystem = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, panicReason: null });
    // In a real app, you might want to clear local storage or reset Redux state here
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-[#c9d1d9] font-mono flex items-center justify-center p-8 z-[999999] relative">
          <div className="max-w-3xl w-full bg-[#161b22] border border-[#f85149] rounded-lg shadow-[0_0_50px_rgba(248,81,73,0.2)] overflow-hidden">
            <div className="bg-[#f85149] text-black px-4 py-3 flex items-center gap-3 font-bold uppercase tracking-widest text-[14px]">
              <AlertTriangle size={20} /> Kernel Panic / Critical System Failure
            </div>
            <div className="p-6">
              <p className="text-[14px] mb-4 text-[#8b949e]">
                {this.state.panicReason 
                  ? `System Watchdog manually triggered a panic state to prevent memory corruption or hard crash: ${this.state.panicReason}` 
                  : 'The OmniEngine encountered an unrecoverable exception in the main thread.'}
              </p>
              
              <div className="bg-[#0a0a0a] border border-[#30363d] rounded p-4 overflow-x-auto mb-6 max-h-[300px] overflow-y-auto">
                <div className="text-[#f85149] font-bold mb-2">{this.state.error?.toString()}</div>
                {this.state.errorInfo && (
                  <div className="text-[11px] text-[#8b949e] whitespace-pre-wrap">{this.state.errorInfo.componentStack}</div>
                )}
                {this.state.error?.stack && (
                  <div className="text-[11px] text-[#8b949e] whitespace-pre-wrap mt-2">{this.state.error.stack}</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-[11px]">
                 <div className="bg-[#0a0a0a] p-3 rounded border border-[#30363d]">
                    <div className="text-[#8b949e] mb-1 font-bold">Diagnostic Info</div>
                    <div>User Agent: {navigator.userAgent.substring(0, 50)}...</div>
                    <div>Time: {new Date().toISOString()}</div>
                    <div>Memory: {'memory' in performance ? `${Math.round((performance as any).memory.usedJSHeapSize / 1048576)} MB` : 'Unknown'}</div>
                 </div>
                 <div className="bg-[#0a0a0a] p-3 rounded border border-[#30363d]">
                    <div className="text-[#8b949e] mb-1 font-bold">Recovery Options</div>
                    <div>• Soft Recovery clears React state and remounts.</div>
                    <div>• Hard Reboot forces a full page reload.</div>
                 </div>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-[12px] font-bold transition flex items-center gap-2">
                  <HardDrive size={16} /> Hard Reboot (Reload)
                </button>
                <button onClick={this.resetSystem} className="px-5 py-2.5 bg-[#f85149] hover:bg-[#ff7b72] text-black rounded text-[12px] font-bold transition flex items-center gap-2 shadow-[0_0_15px_rgba(248,81,73,0.4)]">
                  <RefreshCw size={16} /> Attempt Soft Recovery
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- WATCHDOG PROVIDER ---
export function SystemWatchdogProvider({ children }: { children: ReactNode }) {
  const [isThrottled, setIsThrottled] = useState(false);
  const [eventLoopLag, setEventLoopLag] = useState(0);
  const [fps, setFps] = useState(60);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>('NORMAL');
  const [activeWarnings, setActiveWarnings] = useState<string[]>([]);
  
  const workersRef = useRef<Map<string, { start: () => void, stop: () => void }>>(new Map());
  const errorBoundaryRef = useRef<GlobalErrorBoundary>(null);
  
  // Metrics references
  const frameRef = useRef<number | undefined>(undefined);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const framesCountRef = useRef<number>(0);
  
  // Memory Leak Tracker
  const memoryHistoryRef = useRef<number[]>([]);

  const addWarning = (msg: string) => {
    setActiveWarnings(prev => {
       if (prev.includes(msg)) return prev;
       const next = [...prev, msg];
       if (next.length > 5) next.shift(); // keep max 5
       return next;
    });
  };

  const removeWarning = (msg: string) => {
    setActiveWarnings(prev => prev.filter(w => !w.includes(msg)));
  };

  const triggerPanic = (reason: string) => {
    if (errorBoundaryRef.current) {
      errorBoundaryRef.current.triggerManualPanic(reason);
    }
  };

  // Register background workers that can be paused when system is overloaded
  const registerWorker = (id: string, startCb: () => void, stopCb: () => void) => {
    workersRef.current.set(id, { start: startCb, stop: stopCb });
  };

  const unregisterWorker = (id: string) => {
    workersRef.current.delete(id);
  };

  // 0. Global Exception & Promise Handlers
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
       if (event.message && event.message.includes('ResizeObserver loop')) {
         return;
       }
       console.error("[Watchdog] Caught global exception:", event.error || event.message);
       addWarning(`Unhandled Exception: ${event.message || 'Script error'}`);
       setThreatLevel('ELEVATED');
    };
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
       if (event && typeof event.preventDefault === 'function') {
         event.preventDefault();
       }

       const reason = event?.reason;
       const reasonStr = typeof reason === 'string' 
         ? reason 
         : reason?.message || reason?.name || (reason && typeof reason === 'object' && Object.keys(reason).length > 0 ? JSON.stringify(reason) : '');

       // Filter out empty or benign background rejections common in sandboxed iframe previews
       if (
         !reason ||
         !reasonStr ||
         reasonStr === '{}' ||
         reasonStr === '[object Object]' ||
         reasonStr.trim() === '' ||
         reasonStr.includes('The play() request was interrupted') ||
         reasonStr.includes('AudioContext') ||
         reasonStr.includes('audio') ||
         reasonStr.includes('resume') ||
         reasonStr.includes('user gesture') ||
         reasonStr.includes('AbortError') ||
         reasonStr.includes('clipboard') ||
         reasonStr.includes('Permission denied') ||
         reasonStr.includes('ResizeObserver') ||
         reasonStr.includes('canceled') ||
         reasonStr.includes('cancelled') ||
         reasonStr.includes('Loading chunk') ||
         reasonStr.includes('Failed to fetch dynamically imported module') ||
         reasonStr.includes('NetworkError')
       ) {
         console.debug('[Watchdog] Suppressed background rejection:', reasonStr);
         return;
       }

       console.warn("[Watchdog] Handled promise rejection:", reasonStr);
       addWarning(`Promise Rejection: ${reasonStr.substring(0, 80)}`);
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
       window.removeEventListener('error', handleGlobalError);
       window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // 1. Monitor FPS
  useEffect(() => {
    const measureFPS = () => {
      framesCountRef.current++;
      const now = performance.now();
      if (now - lastFrameTimeRef.current >= 1000) {
        const currentFps = framesCountRef.current;
        setFps((prev) => {
           if (Math.abs(prev - currentFps) > 2) return currentFps; // avoid 1fps noise updates
           return prev;
        });
        framesCountRef.current = 0;
        lastFrameTimeRef.current = now;

        // Auto-Throttle Logic based on FPS
        if (currentFps < 15 && !isThrottled) {
          console.warn(`[Watchdog] Severe frame drop detected (${currentFps} FPS). Initiating thermal throttle...`);
          setIsThrottled(true);
          addWarning('Critical FPS Drop - Throttling');
          setThreatLevel(prev => prev === 'NORMAL' ? 'ELEVATED' : 'CRITICAL');
        } else if (currentFps >= 45 && isThrottled) {
          console.log(`[Watchdog] System stabilized (${currentFps} FPS). Releasing thermal throttle...`);
          setIsThrottled(false);
          removeWarning('Critical FPS Drop - Throttling');
          if (threatLevel !== 'CRITICAL') setThreatLevel('NORMAL');
        }
      }
      frameRef.current = requestAnimationFrame(measureFPS);
    };
    frameRef.current = requestAnimationFrame(measureFPS);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isThrottled, threatLevel]);

  // 2. Monitor Event Loop Lag (CPU Saturation)
  useEffect(() => {
    let timeoutId: any;
    const checkLag = () => {
      const start = performance.now();
      timeoutId = setTimeout(() => {
        const end = performance.now();
        // We asked for a 200ms timeout. If it took much longer, the main thread is blocked.
        const lag = Math.max(0, end - start - 200); 
        
        // ONLY update state if lag is significant or changed significantly, to prevent 20fps re-renders!
        setEventLoopLag((prev) => {
           if (Math.abs(prev - lag) > 15 || lag > 50) return lag;
           return prev;
        });

        // If event loop lag > 150ms, force throttle regardless of FPS
        if (lag > 150) {
            if (!isThrottled) setIsThrottled(true);
            addWarning('Main Thread CPU Blocked (>150ms)');
            setThreatLevel('CRITICAL');
        } else if (lag < 50 && threatLevel === 'CRITICAL' && fps > 30) {
            removeWarning('Main Thread CPU Blocked (>150ms)');
            setThreatLevel('ELEVATED');
        }

        checkLag();
      }, 200);
    };
    checkLag();
    return () => clearTimeout(timeoutId);
  }, [isThrottled, threatLevel, fps]);

  // 3. Monitor Memory & Detect Leaks
  useEffect(() => {
    const memInterval = setInterval(() => {
      if ('memory' in performance) {
        const mem = (performance as any).memory;
        const currentUsageMB = mem.usedJSHeapSize / (1024 * 1024);
        
        setMemoryUsage((prev) => {
           if (Math.abs(prev - currentUsageMB) > 15) return currentUsageMB; // only trigger re-render if memory changed by > 15MB
           return prev;
        });
        
        // Memory Leak Heuristic (continuously growing over 10 checks)
        memoryHistoryRef.current.push(currentUsageMB);
        if (memoryHistoryRef.current.length > 10) {
           memoryHistoryRef.current.shift();
           
           let isGrowing = true;
           for(let i=1; i<memoryHistoryRef.current.length; i++) {
              if (memoryHistoryRef.current[i] <= memoryHistoryRef.current[i-1]) {
                 isGrowing = false;
                 break;
              }
           }
           
           if (isGrowing && currentUsageMB > 500) { // Only warn if growing AND usage is high (>500MB)
              console.warn("[Watchdog] Possible Memory Leak detected. Heap continuously growing.");
              addWarning('Possible Memory Leak Detected');
              setThreatLevel('CRITICAL');
           }
           
           // Hard panic if we hit arbitrary high limit (e.g., 2GB JS heap) to prevent browser crash
           if (currentUsageMB > 2000) {
              triggerPanic(`OOM Prevention: JS Heap exceeded 2000MB (${currentUsageMB.toFixed(0)}MB). System halted to prevent browser crash.`);
           }
        }
      }
    }, 2000);
    return () => clearInterval(memInterval);
  }, []);

  // 4. Network Request Profiler (Monkey patch fetch for excessive calls)
  useEffect(() => {
    const originalFetch = window.fetch;
    let requestCount = 0;
    
    // Reset counter every 5 seconds
    const requestInterval = setInterval(() => {
       if (requestCount > 50) {
          console.warn(`[Watchdog] Network storm detected: ${requestCount} requests in 5s.`);
          addWarning('Network Storm / Rate Limit Warning');
          setThreatLevel('ELEVATED');
       } else {
          removeWarning('Network Storm / Rate Limit Warning');
       }
       requestCount = 0;
    }, 5000);

    try {
      window.fetch = (...args) => {
         requestCount++;
         return originalFetch(...args);
      };
    } catch (e) {
      // window.fetch is getter-only in certain iframe sandboxes
    }

    return () => {
       try {
         window.fetch = originalFetch;
       } catch (e) {
         // ignore
       }
       clearInterval(requestInterval);
    };
  }, []);

  // 5. Execute Throttle Policy
  useEffect(() => {
    if (isThrottled) {
      // Pause all registered background workers
      workersRef.current.forEach(worker => worker.stop());
    } else {
      // Resume all registered background workers
      workersRef.current.forEach(worker => worker.start());
    }
  }, [isThrottled]);

  return (
    <SystemHealthContext.Provider value={{ isThrottled, eventLoopLag, fps, memoryUsage, threatLevel, activeWarnings, registerWorker, unregisterWorker, triggerPanic }}>
      <GlobalErrorBoundary ref={errorBoundaryRef}>
        
        {/* Active Threat / Warnings UI */}
        {activeWarnings.length > 0 && (
          <div className="fixed bottom-4 right-4 z-[99998] flex flex-col gap-2 pointer-events-none">
             {activeWarnings.map((warn, i) => (
                <div key={i} className="bg-[#161b22] border-l-4 border-[#e3b341] text-[#c9d1d9] text-[10px] px-3 py-2 rounded shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
                   <ShieldAlert size={14} className="text-[#e3b341]" />
                   {warn}
                </div>
             ))}
          </div>
        )}

        {/* Throttling Overlay UI */}
        {isThrottled && (
          <div className="fixed top-0 left-0 w-full z-[99999] pointer-events-none animate-in fade-in">
             <div className="bg-[#f85149] text-black text-[10px] font-bold uppercase tracking-widest text-center py-1.5 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(248,81,73,0.5)]">
                 <Cpu size={14} className="animate-pulse" />
                 CRITICAL LOAD: Background tasks suspended. (FPS: {fps} | Lag: {eventLoopLag.toFixed(0)}ms | Threat: {threatLevel})
             </div>
          </div>
        )}

        <div className={`w-full h-full ${threatLevel === 'CRITICAL' ? 'opacity-90 saturate-50' : isThrottled ? 'opacity-95' : ''} transition-all duration-700`}>
          {children}
        </div>
      </GlobalErrorBoundary>
    </SystemHealthContext.Provider>
  );
}

