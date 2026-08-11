import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Code, Cpu, Sparkles, Play, Bug, FileCode, Check, Send, Zap, AlertCircle, ShieldAlert, Wrench, Loader2, Save, X, Network } from 'lucide-react';
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function OfflineAICodingAssistant() {
  const [code, setCode] = useState(`// Paste your code here to begin analysis
function authenticateUser(username, password) {
  // TODO: Implement authentication
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  db.execute(query);
  
  if (password == "admin123") {
    return true;
  }
  return false;
}
`);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Hello! I am your **Offline Local AI Code Assistant**. I run entirely on your device.\n\nI can help you with:\n- 🐛 **Debugging** code\n- 🛡️ Finding **Security Vulnerabilities**\n- ⚡ Recommending **Code Improvements**\n\nPaste your code on the left and ask me anything!" }
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Offline heuristic engine to simulate AI analyzing the code
  const analyzeCodeOffline = (userMessage: string, currentCode: string) => {
    const msg = userMessage.toLowerCase();
    let response = "";

    const hasSQLi = currentCode.includes("SELECT * FROM") && currentCode.includes("+ username +") || currentCode.includes("${username}");
    const hasHardcoded = currentCode.includes('password == "') || currentCode.includes("password === '");
    const hasEval = currentCode.includes("eval(");
    const hasVar = currentCode.includes("var ");

    if (msg.includes("security") || msg.includes("vulnerabilit") || msg.includes("ช่องโหว่") || msg.includes("ความปลอดภัย")) {
      response += "🛡️ **Security Audit Complete (Offline Mode)**\n\nI have analyzed your code. Here are the findings:\n\n";
      let secure = true;
      if (hasSQLi) {
        response += "- ❌ **CRITICAL: SQL Injection Vulnerability.** You are concatenating raw variables into a SQL string. Use parameterized queries or prepared statements instead.\n";
        secure = false;
      }
      if (hasHardcoded) {
        response += "- ❌ **HIGH: Hardcoded Credentials.** Hardcoding passwords like `\"admin123\"` is extremely dangerous. Use environment variables and hashed passwords.\n";
        secure = false;
      }
      if (hasEval) {
        response += "- ❌ **CRITICAL: Arbitrary Code Execution.** Usage of `eval()` can lead to code injection. Avoid using it at all costs.\n";
        secure = false;
      }
      if (secure) {
        response += "- ✅ **Passed:** No obvious security vulnerabilities found in the current snippet based on my local signatures.";
      }
    } else if (msg.includes("debug") || msg.includes("bug") || msg.includes("บั๊ก") || msg.includes("ดีบัก") || msg.includes("error")) {
      response += "🐛 **Debugging Analysis**\n\n";
      if (currentCode.includes("==") && !currentCode.includes("===")) {
        response += "- ⚠️ **Warning:** Using `==` instead of `===` can lead to unexpected type coercion bugs. E.g., `password == \"admin123\"`.\n";
      }
      if (!currentCode.includes("try {") && (currentCode.includes("db.execute") || currentCode.includes("fetch("))) {
        response += "- ⚠️ **Error Handling:** You are performing I/O operations (like `db.execute`) without a `try/catch` block. This could crash your application if the database is unreachable.\n";
      }
      response += "- 💡 **Tip:** Console log your variables before the execution to trace the exact state.";
    } else if (msg.includes("improve") || msg.includes("refactor") || msg.includes("ปรับปรุง") || msg.includes("แนะนำ")) {
      response += "⚡ **Code Improvement Suggestions**\n\n";
      if (hasVar) {
        response += "- 🔄 **Modernize:** Replace `var` with `let` or `const` for block scoping.\n";
      }
      response += "- 🔄 **Refactor:** Extracted the database logic into a separate repository layer to follow the Single Responsibility Principle.\n";
      response += "- 🔄 **Async/Await:** If `db.execute` is asynchronous, you should make your function `async` and `await` the query.\n\n";
      
      response += "**Refactored Example:**\n```javascript\nasync function authenticateUser(username, password) {\n  try {\n    // Using parameterized query (assuming modern DB client)\n    const query = \"SELECT * FROM users WHERE username = ?\";\n    const user = await db.execute(query, [username]);\n    \n    if (!user) return false;\n    \n    // Use bcrypt.compare in a real app\n    return verifyPasswordHash(password, user.passwordHash);\n  } catch (error) {\n    console.error(\"Auth Error:\", error);\n    return false;\n  }\n}\n```";
    } else if (msg.includes('เลือกภาษา') || msg.includes('ใช้ภาษาอะไร') || msg.includes('ภาษาในการเขียน') || msg.includes('what language') || msg.includes('programming language') || msg.includes('ภาษาอะไรดี')) {
      response += "📚 **Programming Language Guide**\n\nHere is a highly accurate mapping of programming languages to their best use cases:\n\n";
      response += "🐍 **Python**: ใช้ทำปัญญาประดิษฐ์ (AI), วิเคราะห์ข้อมูล, และสร้างเว็บแอป (เหมาะกับมือใหม่)\n";
      response += "🌐 **JavaScript**: ใช้ทำหน้าเว็บไซต์ฝั่งผู้ใช้งาน (Frontend) และระบบโต้ตอบแบบเรียลไทม์\n";
      response += "☕ **Java**: ใช้สร้างแอปพลิเคชันบนมือถือ Android และระบบหลังบ้านของธนาคาร\n";
      response += "⚙️ **C / C++**: ใช้พัฒนาเกม, ระบบปฏิบัติการ, และโปรแกรมที่ต้องการความเร็วสูง\n";
      response += "🎮 **C#**: ใช้สร้างเกมด้วยโปรแกรม Unity และแอปบน Windows\n";
      response += "🐘 **PHP**: ใช้ทำระบบหลังบ้านของเว็บไซต์ เช่น WordPress\n";
      response += "🍎 **Swift**: ใช้พัฒนาแอปบน iPhone และอุปกรณ์ของ Apple\n";
      response += "🐹 **Go (Golang)**: ใช้ทำระบบ Cloud และเซิร์ฟเวอร์ที่รองรับคนจำนวนมาก\n\n";
      response += "💡 **Tip**: If you are starting a new project, just tell me what you want to build and I'll generate the boilerplate code in the right language!";
    } else {
      response = "I am operating in 100% Offline Mode. I have read your code.\n\nTry asking me to:\n- **\"Find security vulnerabilities\"**\n- **\"Debug this code\"**\n- **\"Suggest improvements\"**";
    }

    return response;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsProcessing(true);

    // Simulate offline AI processing time
    setTimeout(() => {
      const aiResponse = analyzeCodeOffline(userText, code);
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
      setIsProcessing(false);
    }, 1200);
  };

  const insertFix = () => {
    const fixedCode = `// AI Refactored & Secured
async function authenticateUser(username, password) {
  try {
    const query = "SELECT * FROM users WHERE username = ?";
    const user = await db.execute(query, [username]);
    
    if (!user) return false;
    return await bcrypt.compare(password, user.passwordHash);
  } catch (err) {
    console.error(err);
    return false;
  }
}`;
    setCode(fixedCode);
  };

  return (
    <div className="w-full h-full bg-[#0d1117] text-[#c9d1d9] flex flex-col font-sans overflow-hidden select-none border-x border-[#30363d]">
      
      {/* Top Header */}
      <div className="h-14 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-lg shadow-lg border border-blue-400/30">
            <Network size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-white flex items-center gap-2">
              Offline AI Code Copilot <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[10px] uppercase font-mono">100% Local</span>
            </h1>
            <div className="text-[10px] text-[#8b949e]">Privacy-first AI assistant for debugging and security.</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => {
               setMessages(prev => [...prev, { role: 'user', content: 'Analyze performance & security' }]);
               setIsProcessing(true);
               setTimeout(() => {
                 setMessages(prev => [...prev, { role: 'ai', content: analyzeCodeOffline('security', code) }]);
                 setIsProcessing(false);
               }, 1000);
             }}
             className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-3 py-1.5 rounded text-[11px] font-bold text-[#c9d1d9] transition-colors flex items-center gap-2">
             <ShieldAlert size={14} className="text-yellow-400"/> SCAN CODE
           </button>
           <button 
             onClick={insertFix}
             className="flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] border border-[#238636] text-white px-3 py-1.5 rounded text-[11px] font-bold transition-colors">
             <Check size={14}/> APPLY SECURE FIX
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Code Editor */}
        <div className="flex-1 bg-[#0d1117] flex flex-col relative overflow-hidden border-r border-[#30363d]">
           {/* Editor Tabs */}
           <div className="h-10 bg-[#161b22] flex items-center shrink-0 border-b border-[#30363d]">
              <div className="h-full px-4 bg-[#0d1117] border-r border-[#30363d] flex items-center gap-2 border-t-2 border-t-[#58a6ff] cursor-pointer">
                 <FileCode size={14} className="text-[#58a6ff]"/>
                 <span className="text-xs text-[#c9d1d9]">auth_service.js</span>
              </div>
           </div>

           {/* Code Textarea */}
           <div className="flex-1 relative font-mono text-sm group">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
                className="w-full h-full bg-[#0d1117] text-[#c9d1d9] p-4 resize-none outline-none custom-scrollbar leading-relaxed"
                style={{ tabSize: 2 }}
              />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => {
                    setMessages(prev => [...prev, { role: 'user', content: 'Debug this code' }]);
                    setIsProcessing(true);
                    setTimeout(() => {
                      setMessages(prev => [...prev, { role: 'ai', content: analyzeCodeOffline('debug', code) }]);
                      setIsProcessing(false);
                    }, 800);
                  }}
                  className="bg-[#21262d] border border-[#30363d] p-1.5 rounded text-[#8b949e] hover:text-white flex items-center gap-2 text-xs shadow-lg">
                  <Bug size={14} className="text-red-400"/> Auto-Debug
                </button>
              </div>
           </div>
        </div>

        {/* Right Side: AI Chat */}
        <div className="w-[400px] bg-[#0d1117] flex flex-col shrink-0 relative">
          
          <div className="p-3 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between">
             <h3 className="text-xs font-bold text-[#c9d1d9] flex items-center gap-2"><Cpu size={14} className="text-[#58a6ff]"/> AI Terminal</h3>
             <span className="text-[10px] text-[#8b949e] flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Engine Active</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar text-sm">
             
             {messages.map((msg, i) => (
               <div key={i} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                 <div className="flex items-center gap-2 mb-1">
                    {msg.role === 'ai' ? (
                      <><Sparkles size={12} className="text-[#58a6ff]"/> <span className="text-[10px] font-bold text-[#8b949e] uppercase">Offline Copilot</span></>
                    ) : (
                      <><span className="text-[10px] font-bold text-[#8b949e] uppercase">You</span></>
                    )}
                 </div>
                 <div className={`p-3 rounded-xl max-w-[95%] shadow-sm ${msg.role === 'user' ? 'bg-[#21262d] border border-[#30363d] text-[#c9d1d9]' : 'bg-[#161b22] border border-[#30363d] text-[#c9d1d9]'}`}>
                   <div className="markdown-body" style={{background: 'transparent', color: 'inherit'}}>
                     <Markdown>{msg.content}</Markdown>
                   </div>
                 </div>
               </div>
             ))}

             {isProcessing && (
               <div className="flex flex-col gap-1 items-start">
                 <div className="flex items-center gap-2 mb-1">
                    <Loader2 size={12} className="text-[#58a6ff] animate-spin"/> <span className="text-[10px] font-bold text-[#8b949e] uppercase">Analyzing Context...</span>
                 </div>
                 <div className="p-3 rounded-xl bg-[#161b22] border border-[#30363d] text-[#8b949e] max-w-[95%] shadow-sm">
                   <div className="flex space-x-1.5 items-center h-4">
                     <div className="w-1.5 h-1.5 bg-[#58a6ff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                     <div className="w-1.5 h-1.5 bg-[#58a6ff] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                     <div className="w-1.5 h-1.5 bg-[#58a6ff] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                   </div>
                 </div>
               </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-4 bg-[#161b22] border-t border-[#30363d]">
             <div className="relative flex items-end bg-[#0d1117] border border-[#30363d] rounded-xl focus-within:border-[#58a6ff] transition-colors p-1">
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="w-full bg-transparent p-2 text-sm text-[#c9d1d9] resize-none outline-none max-h-32 min-h-[40px] custom-scrollbar"
                  placeholder="Ask to debug, find vulnerabilities..."
                  rows={1}
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isProcessing}
                  className="mb-1 mr-1 p-2 bg-[#238636] disabled:bg-[#21262d] disabled:text-[#8b949e] rounded-lg text-white hover:bg-[#2ea043] transition-colors flex-shrink-0">
                  <Send size={16}/>
                </button>
             </div>
             <div className="flex justify-between items-center mt-2 px-1 text-[10px] text-[#8b949e]">
                <span className="flex items-center gap-1.5"><ShieldAlert size={10}/> Context: auth_service.js</span>
                <span>Press Enter to send</span>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
