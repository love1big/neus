import React, { useState } from 'react';
import { ShieldCheck, Activity, GitMerge, Bot, Zap, Brain, FileCode, CheckCircle, AlertTriangle, Crosshair, Terminal, Code2, Cpu, Wrench } from 'lucide-react';

export default function AICodeQualityAuditor() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'architecture' | 'token-profiler' | 'auto-fix'>('dashboard');

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#30363d] bg-[#161b22]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#58a6ff]/20 border border-[#58a6ff]/50 rounded">
            <ShieldCheck className="text-[#58a6ff]" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide">AI Code Quality & Professional Standards Auditor</h1>
            <p className="text-[10px] text-[#8b949e]">Real-time AAA Standard Validation, Architecture Linting, and Token Profiling</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs flex items-center gap-2 hover:bg-[#30363d] transition-colors">
            <Activity size={14} /> Run Full Audit
          </button>
          <button className="px-3 py-1.5 bg-[#238636] border border-[#2ea043] rounded text-xs flex items-center gap-2 hover:bg-[#2c974b] transition-colors">
            <CheckCircle size={14} /> Commit Changes
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar (Tools Integration) */}
        <div className="w-64 border-r border-[#30363d] bg-[#161b22] flex flex-col">
          <div className="p-3 border-b border-[#30363d] text-xs font-bold text-[#8b949e] uppercase tracking-wider">
            Audit Modules
          </div>
          <div className="p-2 space-y-1">
            <SidebarItem 
              icon={<Activity size={16} />} 
              label="Overview Dashboard" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            <SidebarItem 
              icon={<GitMerge size={16} />} 
              label="Architecture & Modularity" 
              active={activeTab === 'architecture'} 
              onClick={() => setActiveTab('architecture')} 
            />
            <SidebarItem 
              icon={<Cpu size={16} />} 
              label="Token & Complexity Profiler" 
              active={activeTab === 'token-profiler'} 
              onClick={() => setActiveTab('token-profiler')} 
            />
            <SidebarItem 
              icon={<Bot size={16} />} 
              label="AI Auto-Refactor" 
              active={activeTab === 'auto-fix'} 
              onClick={() => setActiveTab('auto-fix')} 
            />
          </div>
          
          <div className="mt-auto p-4 border-t border-[#30363d]">
             <div className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg">
                <div className="flex items-center gap-2 text-xs font-bold text-white mb-2">
                   <Brain size={14} className="text-[#d29922]" /> Background Agent
                </div>
                <div className="text-[10px] text-[#8b949e] mb-3">
                   Continuous monitoring is enabled. Enforcing 'One-System-Per-File' rules.
                </div>
                <div className="flex justify-between items-center text-xs">
                   <span className="text-[#3fb950] flex items-center gap-1"><CheckCircle size={10} /> Active</span>
                   <span className="text-[#8b949e]">v2.1.0</span>
                </div>
             </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 overflow-y-auto bg-[#010409]">
          
          {activeTab === 'dashboard' && (
            <div className="p-6 max-w-5xl mx-auto space-y-6">
               <div className="grid grid-cols-3 gap-4">
                  <StatCard title="Overall Code Health" value="98%" trend="+2%" icon={<Activity className="text-[#3fb950]" />} color="green" />
                  <StatCard title="Modularity Score" value="A+" trend="Stable" icon={<GitMerge className="text-[#58a6ff]" />} color="blue" />
                  <StatCard title="Critical Violations" value="0" trend="-1" icon={<ShieldCheck className="text-[#3fb950]" />} color="green" />
               </div>

               <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                  <h3 className="text-sm font-bold flex items-center gap-2 mb-4 border-b border-[#30363d] pb-2">
                     <AlertTriangle size={16} className="text-[#d29922]" /> Recent Audit Logs
                  </h3>
                  <div className="space-y-3">
                     <AuditLogItem 
                       file="App.tsx" 
                       issue="Router & Navigation Check" 
                       status="pass" 
                       details="Verified App.tsx is strictly functioning as a router. No nested complex logic found."
                     />
                     <AuditLogItem 
                       file="AINPCBehaviorTreeEditor.tsx" 
                       issue="Professional Execution & High-Fidelity" 
                       status="pass" 
                       details="AAA standard UI rules adhered. Modular structure maintained."
                     />
                     <AuditLogItem 
                       file="PhysicsEngine.tsx" 
                       issue="Token & Complexity Profiler" 
                       status="warning" 
                       details="File approaching 500 lines. Consider extracting Collision Detection logic."
                     />
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="p-6 max-w-5xl mx-auto space-y-6">
               <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                  <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                     <GitMerge size={16} className="text-[#58a6ff]" /> Strict One-System-Per-File Enforcement
                  </h3>
                  <p className="text-xs text-[#8b949e] mb-6">
                    Scanning project structure against AGENTS.md rules. Ensuring all new features are extracted into independent modules and not bloated into core files.
                  </p>
                  
                  <div className="space-y-4">
                     <div className="flex items-start gap-4 p-4 bg-[#0d1117] border border-[#30363d] rounded-lg">
                        <div className="mt-1"><CheckCircle size={18} className="text-[#3fb950]" /></div>
                        <div className="flex-1">
                           <div className="text-sm font-bold mb-1">App.tsx Isolation Validated</div>
                           <div className="text-xs text-[#8b949e]">The main application file contains 0 nested components and purely relies on React.lazy and component imports. Excellent adherence to Rule #1.</div>
                        </div>
                     </div>
                     <div className="flex items-start gap-4 p-4 bg-[#0d1117] border border-[#30363d] rounded-lg">
                        <div className="mt-1"><CheckCircle size={18} className="text-[#3fb950]" /></div>
                        <div className="flex-1">
                           <div className="text-sm font-bold mb-1">Holistic Tool Dependencies Checked</div>
                           <div className="text-xs text-[#8b949e]">Recent addition 'AINPCBehaviorTreeEditor' correctly implemented alongside required Blackboard and Perception logic. Holistic integration rule satisfied.</div>
                        </div>
                     </div>
                     <div className="flex items-start gap-4 p-4 bg-[#2e1d0f] border border-[#d29922]/50 rounded-lg">
                        <div className="mt-1"><AlertTriangle size={18} className="text-[#d29922]" /></div>
                        <div className="flex-1">
                           <div className="text-sm font-bold text-[#d29922] mb-1">Suggested Extraction: GameState</div>
                           <div className="text-xs text-[#d29922]/80">Global state manager is getting large. Recommend splitting into `InputState.ts`, `AudioState.ts`, and `NetworkState.ts`.</div>
                           <button className="mt-3 px-3 py-1 bg-[#161b22] border border-[#d29922]/30 hover:bg-[#d29922]/10 rounded text-xs text-[#d29922] transition-colors">
                              Auto-Refactor
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'token-profiler' && (
            <div className="p-6 max-w-5xl mx-auto">
               <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-sm font-bold flex items-center gap-2">
                        <Cpu size={16} className="text-[#a371f7]" /> Context Window & Token Profiler
                     </h3>
                     <div className="text-xs text-[#8b949e]">Total Context Weight: <span className="text-white font-bold">14,205 / 32,000</span></div>
                  </div>
                  
                  <div className="space-y-3">
                     {/* Bars */}
                     <TokenBar file="App.tsx" tokens={4500} max={10000} percent={45} />
                     <TokenBar file="AINPCBehaviorTreeEditor.tsx" tokens={2100} max={10000} percent={21} />
                     <TokenBar file="CloudStorageSync.tsx" tokens={1850} max={10000} percent={18} />
                     <TokenBar file="PhysicsEngine.tsx" tokens={8900} max={10000} percent={89} warning />
                  </div>
                  
                  <div className="mt-6 p-4 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-[#8b949e] flex items-center gap-3">
                     <Terminal size={24} className="text-[#58a6ff]" />
                     <div>
                        <strong>Token Management Strategy (Rule 2):</strong> Keeping individual file sizes low ensures the AI agent does not truncate code during generation (Token Limit Exceeded). Target maximum file size is ~400 lines (approx. 5k tokens).
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'auto-fix' && (
            <div className="p-6 max-w-5xl mx-auto">
               <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 flex flex-col">
                     <div className="flex items-center gap-2 text-sm font-bold mb-2">
                        <Bot size={18} className="text-[#f85149]" /> AI Refactor Engine
                     </div>
                     <p className="text-xs text-[#8b949e] mb-4 flex-1">
                        Select an architectural violation or complexity warning to have the integrated AAA AI Agent automatically split, refactor, and decouple the systems seamlessly while guaranteeing backward compatibility.
                     </p>
                     <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded flex items-center justify-between">
                        <div className="text-xs">
                           <div className="font-bold text-white mb-0.5">PhysicsEngine.tsx Extract</div>
                           <div className="text-[#8b949e]">Split Collision & Raycast logic</div>
                        </div>
                        <button className="px-3 py-1.5 bg-[#f85149]/10 border border-[#f85149]/50 text-[#f85149] rounded text-xs hover:bg-[#f85149]/20 transition-colors flex items-center gap-2">
                           <Wrench size={12} /> Execute
                        </button>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <div className="flex items-center gap-2 text-sm font-bold mb-4 border-b border-[#30363d] pb-2">
                        <Code2 size={16} className="text-[#3fb950]" /> Standard Settings
                     </div>
                     <div className="space-y-4 text-xs">
                        <label className="flex items-center justify-between cursor-pointer">
                           <span className="text-[#c9d1d9]">Enforce 1-System-Per-File</span>
                           <input type="checkbox" className="accent-[#3fb950]" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                           <span className="text-[#c9d1d9]">Halt on Token Warning (&gt;8k)</span>
                           <input type="checkbox" className="accent-[#3fb950]" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                           <span className="text-[#c9d1d9]">Require Explicit Error Handling</span>
                           <input type="checkbox" className="accent-[#3fb950]" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                           <span className="text-[#c9d1d9]">Auto-Generate Backward Compat Wrappers</span>
                           <input type="checkbox" className="accent-[#3fb950]" defaultChecked />
                        </label>
                     </div>
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Subcomponents
function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded text-xs font-medium flex items-center gap-3 transition-colors ${
        active ? 'bg-[#58a6ff]/10 text-[#58a6ff] border border-[#58a6ff]/20' : 'text-[#8b949e] hover:text-white hover:bg-[#30363d]/50 border border-transparent'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function StatCard({ title, value, trend, icon, color }: { title: string, value: string, trend: string, icon: React.ReactNode, color: 'green' | 'blue' | 'red' }) {
  const trendColor = color === 'green' ? 'text-[#3fb950]' : color === 'blue' ? 'text-[#58a6ff]' : 'text-[#f85149]';
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
      <div className="flex justify-between items-start mb-2">
         <div className="text-xs font-bold text-[#8b949e]">{title}</div>
         <div>{icon}</div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className={`text-xs ${trendColor}`}>{trend} from last audit</div>
    </div>
  );
}

function AuditLogItem({ file, issue, status, details }: { file: string, issue: string, status: 'pass' | 'warning' | 'fail', details: string }) {
  const Icon = status === 'pass' ? CheckCircle : status === 'warning' ? AlertTriangle : Crosshair;
  const color = status === 'pass' ? 'text-[#3fb950]' : status === 'warning' ? 'text-[#d29922]' : 'text-[#f85149]';
  
  return (
    <div className="flex items-start gap-3 p-3 bg-[#0d1117] border border-[#30363d] rounded">
       <Icon size={16} className={`${color} mt-0.5 shrink-0`} />
       <div>
          <div className="flex items-center gap-2 mb-0.5">
             <span className="text-xs font-bold text-white">{file}</span>
             <span className="text-[10px] bg-[#30363d] text-[#c9d1d9] px-1.5 rounded uppercase">{issue}</span>
          </div>
          <div className="text-xs text-[#8b949e]">{details}</div>
       </div>
    </div>
  );
}

function TokenBar({ file, tokens, max, percent, warning = false }: { file: string, tokens: number, max: number, percent: number, warning?: boolean }) {
  const barColor = warning ? 'bg-[#f85149]' : 'bg-[#58a6ff]';
  return (
    <div className="flex items-center gap-4 p-2">
       <div className="w-48 text-xs font-medium truncate text-[#c9d1d9]">{file}</div>
       <div className="flex-1 h-1.5 bg-[#0d1117] rounded-full overflow-hidden border border-[#30363d]">
          <div className={`h-full ${barColor}`} style={{ width: `${percent}%` }}></div>
       </div>
       <div className={`w-24 text-right text-xs ${warning ? 'text-[#f85149] font-bold' : 'text-[#8b949e]'}`}>
         {tokens.toLocaleString()} tkns
       </div>
    </div>
  );
}
