import React, { useState } from 'react';
import { TerminalSquare, Play, Square, Settings2, FileCode2, Search, Bug, ChevronRight, X, Maximize, AlertCircle, CheckCircle2, ChevronDown, Rocket} from 'lucide-react';

export default function IDECompilerCore() {
  const [activeTab, setActiveTab] = useState('build');
  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-sans">
      
      {/* Top Protocol Bar: Engine Compiler */}
      <div className="px-4 py-2 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-[#238636] text-white">
            <TerminalSquare size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-widest uppercase text-white flex items-center gap-2">
              Native Build & Compiler Engine <span className="px-1.5 py-[1px] bg-[#238636] text-white text-[9px] rounded font-bold">C++ 20</span>
            </h2>
            <p className="text-[#8b949e] text-[9px] font-mono">MSVC / CLANG • INCREMENTAL BUILDS • LINKER VERIFICATION</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <select className="bg-[#0d1117] border border-[#30363d] text-white text-xs px-2 py-1.5 rounded outline-none font-bold">
              <option>Development Editor</option>
              <option>Debug Game</option>
              <option>Shipping / Release</option>
           </select>
           <select className="bg-[#0d1117] border border-[#30363d] text-white text-xs px-2 py-1.5 rounded outline-none font-bold">
              <option>Win64</option>
              <option>Linux_x64</option>
              <option>PlayStation 5</option>
           </select>
           <div className="w-4"></div>
           <button className="bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] text-white px-3 py-1.5 flex items-center gap-2 text-xs font-bold rounded transition"><Bug size={14}/> Debug</button>
           <button className="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-1.5 flex items-center gap-2 text-xs font-bold rounded shadow-lg shadow-[#238636]/20 transition"><Rocket size={14}/> Build All</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Left Project Explorer */}
         <div className="w-[260px] bg-[#0d1117] border-r border-[#30363d] flex flex-col shrink-0 text-[11px] font-mono">
            <div className="p-3 border-b border-[#30363d] bg-[#161b22] font-bold text-[#8b949e] uppercase tracking-widest flex items-center gap-2">
               <FileCode2 size={12}/> Solution Explorer
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                
                <div className="flex items-center gap-1 cursor-pointer hover:bg-[#21262d] p-1 rounded font-bold text-white">
                   <ChevronDown size={12}/> GameEngine (Project)
                </div>
                <div className="pl-4 space-y-1">
                   <div className="flex items-center gap-1 cursor-pointer hover:bg-[#21262d] p-1 rounded text-[#8b949e]">
                      <ChevronRight size={12}/> Source
                   </div>
                   <div className="flex items-center gap-1 cursor-pointer hover:bg-[#21262d] p-1 rounded text-[#8b949e]">
                      <ChevronRight size={12}/> Config
                   </div>
                </div>

                <div className="flex items-center gap-1 cursor-pointer hover:bg-[#21262d] p-1 rounded font-bold text-white mt-2">
                   <ChevronRight size={12}/> GameplayModules (Plugins)
                </div>

            </div>
         </div>

         {/* Center Terminal & Code Output */}
         <div className="flex-1 flex flex-col bg-[#0a0a0c] overflow-hidden">
            {/* Split top text area */}
            <div className="flex-1 border-b border-[#30363d] p-4 overflow-y-auto custom-scrollbar">
               <div className="font-mono text-[12px] space-y-1.5">
                   <div className="text-[#8b949e]">1&gt;------ Build started: Project: GameEngine, Configuration: Development Editor Win64 ------</div>
                   <div className="text-white">1&gt;Building 4 actions with 16 processes...</div>
                   <div className="text-white">1&gt;[1/4] Compile [x64] <span className="text-[#58a6ff]">PhysicsSolver.cpp</span></div>
                   <div className="text-white">1&gt;[2/4] Compile [x64] <span className="text-[#58a6ff]">GameMode.cpp</span></div>
                   
                   <div className="text-yellow-400 bg-yellow-900/20 p-1 border-l-2 border-yellow-400 flex items-start gap-2">
                     <AlertCircle size={14} className="mt-0.5 shrink-0"/> 
                     <div>
                       1&gt;C:\Engine\Source\GameMode.cpp(142): warning C4018: '&lt;': signed/unsigned mismatch
                     </div>
                   </div>

                   <div className="text-white">1&gt;[3/4] Link [x64] <span className="text-[#3fb950]">GameEngine-Win64-Development.lib</span></div>
                   <div className="text-white">1&gt;[4/4] Link [x64] <span className="text-[#3fb950]">GameEngine-Win64-Development.exe</span></div>

                   <div className="pt-4 text-[#3fb950] font-bold flex items-center gap-2">
                      <CheckCircle2 size={14}/> 1&gt;Build succeeded.
                   </div>
                   <div className="text-[#8b949e]">1&gt;    0 Warning(s)</div>
                   <div className="text-[#8b949e]">1&gt;    0 Error(s)</div>
                   <div className="text-[#8b949e]">1&gt;    Time Elapsed 00:00:04.12</div>
               </div>
            </div>

            {/* Bottom Errors / Warnings panel */}
            <div className="h-[250px] bg-[#161b22] flex flex-col shrink-0">
               <div className="flex bg-[#0d1117] border-b border-[#30363d] text-[11px] font-bold">
                  <button onClick={() => setActiveTab('build')} className={`px-4 py-2 border-r border-[#30363d] ${activeTab === 'build' ? 'text-white border-b-2 border-b-[#58a6ff]' : 'text-[#8b949e] hover:text-white'}`}>Build Output</button>
                  <button onClick={() => setActiveTab('errors')} className={`px-4 py-2 border-r border-[#30363d] flex items-center gap-1 ${activeTab === 'errors' ? 'text-white border-b-2 border-b-red-500' : 'text-[#8b949e] hover:text-white'}`}>
                     <X size={12} className="text-red-500"/> Errors <span className="bg-[#30363d] px-1.5 rounded-full text-[9px] text-[#c9d1d9]">0</span>
                  </button>
                  <button onClick={() => setActiveTab('warnings')} className={`px-4 py-2 border-r border-[#30363d] flex items-center gap-1 ${activeTab === 'warnings' ? 'text-white border-b-2 border-b-yellow-400' : 'text-[#8b949e] hover:text-white'}`}>
                     <AlertCircle size={12} className="text-yellow-400"/> Warnings <span className="bg-[#30363d] px-1.5 rounded-full text-[9px] text-[#c9d1d9]">1</span>
                  </button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-2 custom-scrollbar text-[11px] font-mono">
                  {activeTab === 'warnings' && (
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="border-b border-[#30363d] text-[#8b949e]">
                              <th className="p-1 font-normal w-6"></th>
                              <th className="p-1 font-normal w-20">Code</th>
                              <th className="p-1 font-normal">Description</th>
                              <th className="p-1 font-normal w-[150px]">Project</th>
                              <th className="p-1 font-normal w-[200px]">File</th>
                              <th className="p-1 font-normal w-12">Line</th>
                           </tr>
                        </thead>
                        <tbody className="text-[#c9d1d9]">
                           <tr className="hover:bg-[#21262d] cursor-pointer border-b border-[#30363d]">
                              <td className="p-1 text-center"><AlertCircle size={12} className="text-yellow-400 inline"/></td>
                              <td className="p-1">C4018</td>
                              <td className="p-1 text-white">signed/unsigned mismatch</td>
                              <td className="p-1 text-[#8b949e]">GameEngine</td>
                              <td className="p-1 text-[#58a6ff]">GameMode.cpp</td>
                              <td className="p-1">142</td>
                           </tr>
                        </tbody>
                     </table>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
