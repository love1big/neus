import React, { useState } from 'react';
import { Terminal, Play, Save } from 'lucide-react';

export default function ScriptEditor() {
  const [code, setCode] = useState('// JavaScript Runner\nfunction calculateGameScore(kills, timeSec) {\n  return (kills * 100) - (timeSec * 2);\n}\n\nconsole.log("Score:", calculateGameScore(15, 120));');
  const [output, setOutput] = useState('');

  const runCode = () => {
    try {
      let logs: string[] = [];
      const originalConsoleLog = console.log;
      console.log = (...args) => {
        logs.push(args.join(' '));
      };
      
      const func = new Function(code);
      func();
      
      console.log = originalConsoleLog;
      setOutput(logs.join('\n') || 'Execution complete (No output)');
    } catch (err: any) {
      setOutput('Error: ' + err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans p-6 overflow-hidden">
      <div className="mb-6 flex justify-between items-center border-b border-[#30363d] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#e6edf3] mb-1 flex items-center gap-2">
            <Terminal className="text-[#3fb950]"/> Functional Code Runner
          </h1>
          <p className="text-[#8b949e] text-sm">Write and execute real generic JavaScript logic for your games.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={runCode} className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded flex items-center gap-2 font-bold text-sm transition"><Play size={16}/> Execute Logic</button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col gap-4">
        <textarea 
          className="flex-1 bg-[#0d1117] border border-[#30363d] rounded p-4 text-[#e6edf3] font-mono text-sm outline-none resize-none"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck="false"
        />
        <div className="h-48 bg-[#161b22] border border-[#30363d] rounded flex flex-col overflow-hidden">
           <div className="bg-[#050505] px-3 py-1.5 border-b border-[#30363d] text-xs font-bold text-[#8b949e] uppercase">Execution Output</div>
           <pre className="p-3 text-[#3fb950] font-mono text-sm overflow-y-auto">{output}</pre>
        </div>
      </div>
    </div>
  );
}