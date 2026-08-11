import React, { useState } from 'react';
import { Code2, Terminal, FolderTree, Cpu, Play, Settings, Wand2, FileCode, Search, Sparkles, MessageSquare, AlertCircle , Check } from 'lucide-react';

export default function AICodeAgentStudio() {
  const [chat, setChat] = useState([
    { role: 'ai', msg: "I've analyzed the AST. The current movement script uses Unity's old input system. Should I refactor it to the new Input System package and apply kinematics?" }
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if(!input) return;
    setChat([...chat, { role: 'user', msg: input }]);
    setInput('');
    setTimeout(() => {
      setChat(prev => [...prev, { role: 'ai', msg: "Generating refactored PlayerController.cs..." }]);
    }, 500);
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      
      {/* Header */}
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-700 p-1.5 rounded-lg shadow-lg">
            <Cpu size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">AI Code <span className="text-blue-400">Agent</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Autonomous Context-Aware IDE</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Context Explorer */}
        <div className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0 z-10">
          <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c] flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><FolderTree size={14}/> Context</h3>
            <span className="text-[9px] bg-blue-900/50 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/50">842 Tokens</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 text-sm text-gray-300 font-mono custom-scrollbar">
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#333] rounded cursor-pointer"><FolderTree size={12} className="text-blue-400"/> src</div>
              <div className="pl-4 space-y-1">
                <div className="flex items-center gap-2 px-2 py-1 bg-blue-900/30 text-blue-300 rounded cursor-pointer border border-blue-500/30"><FileCode size={12}/> PlayerController.cs</div>
                <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#333] rounded cursor-pointer text-gray-400"><FileCode size={12}/> CameraRig.cs</div>
                <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#333] rounded cursor-pointer text-gray-400"><FileCode size={12}/> InputConfig.json</div>
              </div>
            </div>
            
            <div className="mt-6 space-y-2 px-2">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase font-sans">Agent Memory (AST)</h4>
              <div className="text-[10px] text-gray-400 bg-[#1a1a1c] p-2 rounded border border-[#3e3e42]">
                Dependencies: <br/>
                - UnityEngine.InputSystem<br/>
                - Cinemachine<br/>
                Methods identified: 4<br/>
                Code Smells: 2 (Update loop allocations)
              </div>
            </div>
          </div>
        </div>

        {/* Center: Editor / Diff View */}
        <div className="flex-1 bg-[#1e1e1e] flex flex-col relative">
           <div className="h-10 bg-[#2d2d2d] border-b border-[#3e3e42] flex items-center px-2 gap-1">
             <div className="px-4 py-1.5 bg-[#1e1e1e] text-blue-400 text-xs font-mono border-t-2 border-blue-500 flex items-center gap-2">
               PlayerController.cs <span className="text-[10px] bg-gray-700 text-white px-1 rounded">DIFF</span>
             </div>
           </div>
           
           <div className="flex-1 overflow-y-auto font-mono text-[13px] leading-6 p-4 custom-scrollbar bg-[#1e1e1e] text-gray-300">
             <div className="flex"><span className="w-8 text-gray-600 text-right pr-4 select-none">1</span><span className="text-purple-400">using</span> UnityEngine;</div>
             <div className="flex bg-green-900/20"><span className="w-8 text-green-600 text-right pr-4 select-none">2</span><span className="text-purple-400">using</span> UnityEngine.InputSystem;</div>
             <div className="flex"><span className="w-8 text-gray-600 text-right pr-4 select-none">3</span></div>
             <div className="flex"><span className="w-8 text-gray-600 text-right pr-4 select-none">4</span><span className="text-blue-400">public class</span> <span className="text-yellow-400">PlayerController</span> : <span className="text-green-400">MonoBehaviour</span> {'{'}</div>
             <div className="flex"><span className="w-8 text-gray-600 text-right pr-4 select-none">5</span>  <span className="text-purple-400">private</span> <span className="text-green-400">Vector2</span> movementInput;</div>
             <div className="flex bg-red-900/20 opacity-60"><span className="w-8 text-red-600 text-right pr-4 select-none">6</span><del>  <span className="text-purple-400">void</span> Update() {'{'}</del></div>
             <div className="flex bg-red-900/20 opacity-60"><span className="w-8 text-red-600 text-right pr-4 select-none">7</span><del>    float h = Input.GetAxis("Horizontal");</del></div>
             <div className="flex bg-red-900/20 opacity-60"><span className="w-8 text-red-600 text-right pr-4 select-none">8</span><del>    float v = Input.GetAxis("Vertical");</del></div>
             <div className="flex bg-red-900/20 opacity-60"><span className="w-8 text-red-600 text-right pr-4 select-none">9</span><del>  {'}'}</del></div>
             <div className="flex bg-green-900/20"><span className="w-8 text-green-600 text-right pr-4 select-none">10</span>  <span className="text-purple-400">public void</span> OnMove(<span className="text-green-400">InputAction.CallbackContext</span> context) {'{'}</div>
             <div className="flex bg-green-900/20"><span className="w-8 text-green-600 text-right pr-4 select-none">11</span>    movementInput = context.ReadValue&lt;<span className="text-green-400">Vector2</span>&gt;();</div>
             <div className="flex bg-green-900/20"><span className="w-8 text-green-600 text-right pr-4 select-none">12</span>  {'}'}</div>
             <div className="flex"><span className="w-8 text-gray-600 text-right pr-4 select-none">13</span>{'}'}</div>
           </div>
           
           <div className="absolute bottom-4 right-4 flex gap-2">
             <button className="bg-[#333] hover:bg-[#444] px-4 py-2 rounded text-xs font-bold text-gray-200 shadow-lg">REJECT</button>
             <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-xs font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center gap-2">
               <Check size={14}/> ACCEPT FIX
             </button>
           </div>
        </div>

        {/* Right: Agent Chat */}
        <div className="w-[350px] bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0 z-10">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c] flex items-center justify-between">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Sparkles size={14} className="text-blue-400"/> Copilot Chat</h3>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
             {chat.map((c, i) => (
               <div key={i} className={`flex gap-3 ${c.role === 'ai' ? '' : 'flex-row-reverse'}`}>
                 <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${c.role === 'ai' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'}`}>
                   {c.role === 'ai' ? <Cpu size={12}/> : <UserIcon size={12}/>}
                 </div>
                 <div className={`p-3 rounded-lg text-sm max-w-[85%] ${c.role === 'ai' ? 'bg-[#1a1a1c] border border-[#3e3e42] text-gray-300' : 'bg-blue-900/40 border border-blue-500/30 text-blue-100'}`}>
                   {c.msg}
                 </div>
               </div>
             ))}
           </div>
           
           <div className="p-3 border-t border-[#3e3e42] bg-[#1a1a1c]">
             <div className="relative">
               <textarea 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                 className="w-full bg-[#252526] border border-[#3e3e42] rounded-lg pl-3 pr-10 py-3 text-sm text-gray-200 resize-none focus:outline-none focus:border-blue-500 custom-scrollbar h-20"
                 placeholder="Instruct the agent..."
               />
               <button onClick={send} className="absolute right-2 bottom-2 p-1.5 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors">
                 <ArrowUpRight size={14} />
               </button>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}

const UserIcon = ({size}:any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const ArrowUpRight = ({size}:any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>;
