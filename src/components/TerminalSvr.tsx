import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Settings2, Play, Minus, Square, X } from 'lucide-react';

export default function TerminalSvr() {
  const [history, setHistory] = useState<string[]>(['Microsoft Windows [Version 10.0.22631.3296]', '(c) Microsoft Corporation. All rights reserved.', '']);
  const [inputVal, setInputVal] = useState('');
  const [cwd, setCwd] = useState('C:\\Users\\Developer');
  const [textColor, setTextColor] = useState('text-[#CCCCCC]');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleCommand = (cmdStr: string) => {
    const trimmedCmd = cmdStr.trim();
    const newHistory = [...history, `${cwd}>${trimmedCmd}`];
    
    if (!trimmedCmd) {
      setHistory(newHistory);
      return;
    }

    const args = trimmedCmd.split(' ');
    const cmd = args[0].toLowerCase();

    switch (cmd) {
      case 'cls':
      case 'clear':
        setHistory([]);
        return;
      case 'help':
        newHistory.push('For more information on a specific command, type HELP command-name');
        newHistory.push('CD             Displays the name of or changes the current directory.');
        newHistory.push('CLS            Clears the screen.');
        newHistory.push('COLOR          Sets the default console foreground and background colors.');
        newHistory.push('DATE           Displays or sets the date.');
        newHistory.push('DIR            Displays a list of files and subdirectories in a directory.');
        newHistory.push('ECHO           Displays messages, or turns command echoing on or off.');
        newHistory.push('EXIT           Quits the CMD.EXE program (command interpreter).');
        newHistory.push('HELP           Provides Help information for Windows commands.');
        newHistory.push('PING           Sends ICMP ECHO_REQUEST to network hosts.');
        newHistory.push('SYSTEMINFO     Displays machine specific properties and configuration.');
        newHistory.push('TIME           Displays or sets the system time.');
        break;
      case 'dir':
      case 'ls':
        newHistory.push(' Volume in drive C is OS');
        newHistory.push(' Volume Serial Number is 1F2B-A8C9');
        newHistory.push('');
        newHistory.push(` Directory of ${cwd}`);
        newHistory.push('');
        newHistory.push('06/21/2026  10:14 AM    <DIR>          .');
        newHistory.push('06/21/2026  10:14 AM    <DIR>          ..');
        newHistory.push('05/12/2026  08:22 AM    <DIR>          Contacts');
        newHistory.push('06/20/2026  11:34 AM    <DIR>          Desktop');
        newHistory.push('06/21/2026  09:05 AM    <DIR>          Documents');
        newHistory.push('06/18/2026  03:12 PM    <DIR>          Downloads');
        newHistory.push('05/12/2026  08:22 AM    <DIR>          Favorites');
        newHistory.push('05/12/2026  08:22 AM    <DIR>          Links');
        newHistory.push('05/12/2026  08:22 AM    <DIR>          Music');
        newHistory.push('05/12/2026  08:22 AM    <DIR>          Pictures');
        newHistory.push('05/12/2026  08:22 AM    <DIR>          Saved Games');
        newHistory.push('05/12/2026  08:22 AM    <DIR>          Videos');
        newHistory.push('06/21/2026  10:00 AM               408 app.log');
        newHistory.push('               1 File(s)            408 bytes');
        newHistory.push('              12 Dir(s)  240,512,142,336 bytes free');
        break;
      case 'cd':
        if (args.length > 1) {
          if (args[1] === '..') {
            const parts = cwd.split('\\');
            if (parts.length > 1) {
              parts.pop();
              setCwd(parts.join('\\') + (parts.length === 1 ? '\\' : ''));
            }
          } else if (args[1] === '\\' || args[1] === '/') {
            setCwd('C:\\');
          } else {
            const nextPath = args[1].replace(/\//g, '\\');
            setCwd(cwd.endsWith('\\') ? `${cwd}${nextPath}` : `${cwd}\\${nextPath}`);
          }
        } else {
          newHistory.push(cwd);
        }
        break;
      case 'echo':
        newHistory.push(args.slice(1).join(' '));
        break;
      case 'date':
        newHistory.push(`The current date is: ${new Date().toLocaleDateString()}`);
        break;
      case 'time':
        newHistory.push(`The current time is: ${new Date().toLocaleTimeString()}`);
        break;
      case 'ping':
        const host = args[1] || '127.0.0.1';
        newHistory.push(`Pinging ${host} with 32 bytes of data:`);
        newHistory.push(`Reply from ${host}: bytes=32 time<1ms TTL=128`);
        newHistory.push(`Reply from ${host}: bytes=32 time<1ms TTL=128`);
        newHistory.push(`Reply from ${host}: bytes=32 time<1ms TTL=128`);
        newHistory.push(`Reply from ${host}: bytes=32 time<1ms TTL=128`);
        newHistory.push('');
        newHistory.push(`Ping statistics for ${host}:`);
        newHistory.push(`    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),`);
        break;
      case 'systeminfo':
        newHistory.push('Host Name:                 OMNI-ENGINE-DEV');
        newHistory.push('OS Name:                   Microsoft Windows 11 Pro');
        newHistory.push('OS Version:                10.0.22631 N/A Build 22631');
        newHistory.push('System Manufacturer:       OmniCorp');
        newHistory.push('System Model:              OmniStation Pro');
        newHistory.push('System Type:               x64-based PC');
        newHistory.push('Processor(s):              1 Processor(s) Installed.');
        newHistory.push('                           [01]: AMD Ryzen 9 7950X3D 16-Core Processor');
        newHistory.push('Total Physical Memory:     65,445 MB');
        break;
      case 'color':
        if (args.length > 1) {
           const code = args[1].toLowerCase();
           if (code.includes('a')) setTextColor('text-[#00FF00]');
           else if (code.includes('b')) setTextColor('text-[#00FFFF]');
           else if (code.includes('c')) setTextColor('text-[#FF0000]');
           else if (code.includes('d')) setTextColor('text-[#FF00FF]');
           else if (code.includes('e')) setTextColor('text-[#FFFF00]');
           else if (code.includes('f')) setTextColor('text-[#FFFFFF]');
           else if (code.includes('2')) setTextColor('text-[#008000]');
           else if (code.includes('3')) setTextColor('text-[#008080]');
           else if (code.includes('4')) setTextColor('text-[#800000]');
           else if (code.includes('7')) setTextColor('text-[#CCCCCC]');
           else newHistory.push('Sets the default console foreground and background colors.');
        } else {
           setTextColor('text-[#CCCCCC]');
        }
        break;
      case 'exit':
        newHistory.push('Exiting command processor... (Simulated)');
        break;
      default:
        newHistory.push(`'${cmd}' is not recognized as an internal or external command,`);
        newHistory.push('operable program or batch file.');
    }
    
    newHistory.push(''); // Add blank line after command execution
    setHistory(newHistory);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
      setInputVal('');
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#000] text-[#c9d1d9] font-sans overflow-hidden p-6 gap-6 relative">
      
      {/* Fake Windows CMD Window */}
      <div className="flex-1 border border-[#333] flex flex-col shadow-2xl relative overflow-hidden max-w-5xl mx-auto w-full">
         {/* Windows Title Bar */}
         <div className="h-8 bg-[#ffffff] flex justify-between items-center px-3 shrink-0 select-none">
            <div className="flex items-center gap-2 text-black font-semibold text-xs">
               <div className="w-4 h-4 bg-black flex items-center justify-center font-mono text-[9px] text-white">C:\</div>
               Command Prompt
            </div>
            <div className="flex items-center gap-4 text-black">
               <Minus size={14} className="hover:text-gray-600 cursor-pointer"/>
               <Square size={13} className="hover:text-gray-600 cursor-pointer"/>
               <X size={16} className="hover:text-red-600 cursor-pointer"/>
            </div>
         </div>

         {/* CMD Body */}
         <div 
           className={`flex-1 bg-[#0c0c0c] ${textColor} font-mono text-[14px] p-2 overflow-y-auto cursor-text`} 
           onClick={() => inputRef.current?.focus()}
         >
            <div className="whitespace-pre-wrap select-text leading-relaxed">
               {history.map((line, i) => (
                  <div key={i} className="min-h-[20px]">{line}</div>
               ))}
            </div>
            
            <div className="flex items-start mt-1 relative">
               <span className="shrink-0 mr-2">{cwd}&gt;</span>
               <input 
                 ref={inputRef}
                 type="text" 
                 value={inputVal}
                 onChange={e => setInputVal(e.target.value)}
                 onKeyDown={handleKeyDown}
                 className="flex-1 bg-transparent border-none outline-none caret-transparent"
                 spellCheck="false"
                 autoFocus
               />
               {/* Cursor blinker */}
               <div 
                 className={`absolute w-2 h-4 bg-current animate-pulse pointer-events-none mt-0.5`}
                 style={{ left: `calc(${cwd.length + 1}ch + ${inputVal.length}ch + 8px)` }}
               ></div>
            </div>
            
            <div ref={terminalEndRef} className="h-8" />
         </div>
         
         <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, #000 2px, #000 4px)' }}></div>
      </div>
      
    </div>
  );
}
