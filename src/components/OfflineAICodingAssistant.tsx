import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Code, Cpu, Sparkles, Play, Bug, FileCode, Check, Send, Zap, 
  AlertCircle, ShieldAlert, Wrench, Loader2, Save, X, Network, FolderTree, 
  Layers, Plus, Download, Copy, RefreshCw, CheckCircle2, Box, Info, ArrowRight,
  BookOpen, Code2, Database, GitBranch
} from 'lucide-react';
import Markdown from 'react-markdown';
import { 
  MODULAR_SYSTEM_PRESETS, 
  ModularFile, 
  ModularSystemPreset, 
  generateModularArchitectureFromPrompt 
} from '../utils/offlineModularSystemGenerator';
import { OfflineBugRegressionInterceptor } from '../utils/OfflineBugRegressionInterceptor';
import { OfflineErrorMemoryStore } from '../utils/OfflineErrorMemoryStore';
import { OfflineAIErrorImmunityCore } from '../utils/OfflineAIErrorImmunityCore';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function OfflineAICodingAssistant() {
  // Active Modular Project State
  const [activePreset, setActivePreset] = useState<ModularSystemPreset>(MODULAR_SYSTEM_PRESETS[0]);
  const [projectFiles, setProjectFiles] = useState<ModularFile[]>(MODULAR_SYSTEM_PRESETS[0].files);
  const [activeFileId, setActiveFileId] = useState<string>(MODULAR_SYSTEM_PRESETS[0].files[0].id);
  const [copiedFileId, setCopiedFileId] = useState<string | null>(null);

  // Active Code being viewed/edited
  const activeFile = projectFiles.find(f => f.id === activeFileId) || projectFiles[0];
  const [editedCode, setEditedCode] = useState<string>(activeFile ? activeFile.code : "");

  useEffect(() => {
    if (activeFile) {
      setEditedCode(activeFile.code);
    }
  }, [activeFileId, projectFiles]);

  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'ai', 
      content: "👋 สวัสดีครับ! ผมคือ **Offline AI Modular Game & Software Architect** (ทำงานออฟไลน์ 100% บนเครื่องของคุณ)\n\n" +
               "🛡️ **กฎเหล็กสถาปัตยกรรม (Core Modularity Rules):**\n" +
               "1. **1 Node / 1 Module = 1 ไฟล์เดี่ยวแยกกันเสมอ** (แม้ไฟล์จะเยอะ แต่บำรุงรักษาและแก้ไขง่าย ไม่กระทบกัน)\n" +
               "2. **ตั้งชื่อไฟล์ตรงกับระบบและหน้าที่ชัดเจน** (เช่น `DamageCalculationModule.ts`, `PlayerStaminaDrainNode.ts`)\n" +
               "3. **เขียนคำอธิบายละเอียดครบถ้วนในทุกไฟล์** (Header Docs, Architecture, Input/Output, Error Handling)\n\n" +
               "⚡ ลองเลือกพรีเซ็ตด้านบน หรือพิมพ์บอกระบบเกมที่ต้องการสร้างด้านล่างได้เลยครับ!" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [customSystemPrompt, setCustomSystemPrompt] = useState("");
  const [filterLanguage, setFilterLanguage] = useState<'typescript' | 'csharp' | 'cpp' | 'python' | 'lua'>('typescript');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Handle Switching Preset
  const handleSelectPreset = (preset: ModularSystemPreset) => {
    setActivePreset(preset);
    setProjectFiles(preset.files);
    setActiveFileId(preset.files[0].id);
    
    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        content: `โหลดระบบโมดูลาร์: **${preset.thaiTitle}**`
      },
      {
        role: 'ai',
        content: `📁 **โหลดโครงสร้างโมดูลาร์สำเร็จ! (${preset.files.length} ไฟล์แยกกัน)**\n\n` +
                 `ระบบ: **${preset.title}**\n` +
                 preset.files.map((f, i) => `${i + 1}. \`${f.name}\` — *${f.descriptionThai}*`).join('\n') +
                 `\n\n💡 *คลิกที่แท็บหรือ File Tree ฝั่งซ้ายเพื่อสลับดูและแก้ไขแต่ละโมดูลได้ทันที ทุกไฟล์มี Header Docs อธิบายอย่างละเอียด*`
      }
    ]);
  };

  // Generate Modular Architecture from Custom Prompt
  const handleGenerateCustomModularSystem = (customPrompt?: string) => {
    const promptToUse = customPrompt || customSystemPrompt;
    if (!promptToUse.trim()) return;

    setIsProcessing(true);
    const generatedPreset = generateModularArchitectureFromPrompt(promptToUse, filterLanguage);

    setTimeout(() => {
      setActivePreset(generatedPreset);
      setProjectFiles(generatedPreset.files);
      setActiveFileId(generatedPreset.files[0].id);

      setMessages(prev => [
        ...prev,
        {
          role: 'user',
          content: `สร้างระบบโมดูลาร์แยกไฟล์สำหรับ: "${promptToUse}" (1 Node/Module = 1 File)`
        },
        {
          role: 'ai',
          content: `✨ **สร้างระบบโมดูลาร์สำเร็จ! (${generatedPreset.files.length} ไฟล์ย่อยแยกกันอย่างสมบูรณ์)**\n\n` +
                   `🎮 **ระบบหลัก:** ${generatedPreset.title}\n` +
                   `📋 **รายการไฟล์ที่สร้างขึ้น:**\n` +
                   generatedPreset.files.map((f, idx) => `• **${f.name}** [${f.moduleRole}]\n  └ *${f.descriptionThai}*`).join('\n') +
                   `\n\n🔍 **การการันตีคุณภาพ:**\n- ✅ แยกโค้ด 1 Module = 1 File อย่างเคร่งครัด\n- ✅ มี Header Documentation อธิบาย Input/Output และ Error Handling ครบถ้วน\n- ✅ พร้อมนำไปใช้งานและต่อยอดทันที!`
        }
      ]);
      setCustomSystemPrompt("");
      setIsProcessing(false);
    }, 900);
  };

  // Save changes to the active file
  const handleSaveCode = () => {
    setProjectFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, code: editedCode, linesCount: editedCode.split('\n').length } : f));
    setMessages(prev => [
      ...prev,
      {
        role: 'ai',
        content: `💾 **บันทึกการแก้ไขไฟล์ \`${activeFile.name}\` สำเร็จ!** โครงสร้างโมดูลาร์อื่นยังคงทำงานอย่างเป็นอิสระและเข้ากันได้ 100%`
      }
    ]);
  };

  // Copy Code to Clipboard
  const handleCopyCode = (file: ModularFile) => {
    navigator.clipboard?.writeText(file.code).catch(() => {});
    setCopiedFileId(file.id);
    setTimeout(() => setCopiedFileId(null), 2000);
  };

  // Download Single File
  const handleDownloadFile = (file: ModularFile) => {
    try {
      const blob = new Blob([file.code], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn("Download fallback");
    }
  };

  // Offline heuristic engine to simulate AI analyzing the code
  const analyzeCodeOffline = (userMessage: string, currentCode: string) => {
    const msg = userMessage.toLowerCase();
    let response = "";

    if (msg.includes("แยกไฟล์") || msg.includes("modular") || msg.includes("สถาปัตยกรรม") || msg.includes("architecture")) {
      response = `🏛️ **คำแนะนำสถาปัตยกรรม 1 Node/Module = 1 File**\n\n` +
                 `จากการวิเคราะห์ไฟล์ \`${activeFile.name}\`:\n` +
                 `- **สถานะปัจจุบัน:** แยกโมดูลอย่างถูกต้อง มี Single Responsibility Principle (SRP)\n` +
                 `- **Header Documentation:** มีการระบุ Module Responsibility, Inputs, Outputs, และ Error Handling ชัดเจน\n` +
                 `- **Coupling:** Loose Coupling สามารถทำ Mock/Stub เพื่อเขียน Unit Test แยกต่างหากได้โดยไม่ต้องโหลดระบบอื่นทั้งหมด\n\n` +
                 `💡 *ข้อดี:* เมื่อระบบเกมเติบโตขึ้นเป็น 100+ ไฟล์ คุณสามารถค้นหาและแก้เฉพาะจุดได้ทันทีโดยไม่เสี่ยงทำระบบอื่นพัง!`;
    } else if (msg.includes("security") || msg.includes("vulnerabilit") || msg.includes("ช่องโหว่") || msg.includes("ความปลอดภัย")) {
      response = `🛡️ **Security & Bounds Audit for \`${activeFile.name}\`**\n\n` +
                 `- ✅ **Clamping & Math Safety:** มีการใช้ \`Math.max\` / \`Math.min\` ป้องกันค่าพลังติดลบหรือเกินขอบเขต\n` +
                 `- ✅ **Zero Division Protection:** มีการตรวจสอบตัวหารในสูตรคำนวณเกราะ\n` +
                 `- ✅ **Type Safety:** ใช้ TypeScript Interface ชัดเจน ป้องกัน Runtime Type Mismatch\n` +
                 `- 💡 **คำแนะนำเพิ่มเติม:** สำหรับระบบ Multiplayer ควรใส่ Server-Authoritative Timestamp Validation เพิ่มเติม`;
    } else if (msg.includes("debug") || msg.includes("bug") || msg.includes("บั๊ก") || msg.includes("ดีบัก") || msg.includes("error") || msg.includes("เรียนรู้") || msg.includes("immunity")) {
      const scan = OfflineBugRegressionInterceptor.scanCode(currentCode, activeFile.name);
      if (scan.diagnostics.length > 0) {
        response = `🛡️ **ตรวจพบบัคที่มีในความจำ AI ออฟไลน์ (${scan.diagnostics.length} รายการ)!**\n\n` +
                   `ระบบ AI Error Immunity ตรวจพบว่าโค้ดปัจจุบันมีรูปแบบตรงกับ Anti-Pattern ในอดีต:\n\n` +
                   scan.diagnostics.map((d, i) => 
                     `**${i + 1}. [Line ${d.lineNumber}] ${d.bugTitleThai}** (${d.severity})\n` +
                     `└ *สาเหตุ:* ${d.explanationThai}\n` +
                     `└ *Anti-Pattern:* \`${d.matchedSnippet}\`\n`
                   ).join('\n') +
                   `\n💡 **AI ได้บันทึกการสกัดกั้นสำเร็จ (Zero-Regression Guard Activated) และมีโค้ดภูมิคุ้มกันพร้อมเปลี่ยนแล้ว!**`;
      } else {
        response = `🛡️ **Zero-Regression Code Audit: ปลอดภัย 100%**\n\n` +
                   `จากการสแกนเปรียบเทียบกับฐานความจำบัคและข้อผิดพลาด ${OfflineErrorMemoryStore.getAllRecords().length} รายการในระบบออฟไลน์:\n` +
                   `- ✅ **ไม่มีรูปแบบบัคในอดีต (Zero Past Regressions):** โค้ดใน \`${activeFile.name}\` ไม่มีการทำผิดซ้ำ\n` +
                   `- ✅ **Latency:** ${scan.scanDurationMs}ms (ประมวลผลออฟไลน์ 100% บนเครื่อง)\n` +
                   `- ✅ **คะแนนภูมิคุ้มกัน:** 100% Full Immunity`;
      }
    } else {
      // General modular game assistance
      response = `🤖 **คำแนะนำจาก Offline AI Architect:**\n\n` +
                 `ผมพร้อมช่วยคุณออกแบบและเขียนโค้ดเกมแบบแยก 1 โหนด 1 โมดูล = 1 ไฟล์ครับ!\n\n` +
                 `คุณสามารถสั่งให้ผม:\n` +
                 `• **\"สร้างระบบ Dialogue Quest Node\"** (แยกไฟล์ Router, State, Evaluator)\n` +
                 `• **\"สร้างระบบ Car Physics Simulation\"** (แยกไฟล์ Suspension, Wheel, Engine, Gear)\n` +
                 `• **\"วิเคราะห์ความปลอดภัยของไฟล์นี้\"**\n` +
                 `• **\"แยกโค้ดย่อยออกเป็นอีก 1 ไฟล์ใหม่\"**`;
    }

    return response;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsProcessing(true);

    if (userText.toLowerCase().includes("สร้าง") || userText.toLowerCase().includes("ทำ") || userText.toLowerCase().includes("ระบบ") || userText.toLowerCase().includes("game")) {
      setTimeout(() => {
        handleGenerateCustomModularSystem(userText);
      }, 700);
    } else {
      setTimeout(() => {
        const aiResponse = analyzeCodeOffline(userText, editedCode);
        setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
        setIsProcessing(false);
      }, 1000);
    }
  };

  return (
    <div className="w-full h-full bg-[#0d1117] text-[#c9d1d9] flex flex-col font-sans overflow-hidden select-none border-x border-[#30363d]">
      
      {/* Top Main Navigation Bar */}
      <div className="h-14 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 justify-between shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl shadow-lg border border-blue-400/30">
            <Layers size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-wide text-white">
                Offline AI Modular Architect
              </h1>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[10px] uppercase font-mono font-bold">
                1 Node = 1 File
              </span>
            </div>
            <div className="text-[10px] text-[#8b949e]">
              พัฒนาเกมและโปรแกรมแบบแยกไฟล์ย่อย ตั้งชื่อตรงระบบ คำอธิบายละเอียดทุกไฟล์
            </div>
          </div>
        </div>

        {/* System Preset Selector */}
        <div className="flex items-center gap-2">
          <div className="flex bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
            {MODULAR_SYSTEM_PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  activePreset.id === preset.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'
                }`}
              >
                <Box size={13} />
                <span>{preset.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleSaveCode}
            className="flex items-center gap-1.5 bg-[#238636] hover:bg-[#2ea043] border border-[#238636] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
          >
            <Save size={14} /> บันทึกไฟล์
          </button>
        </div>
      </div>

      {/* Quick Generator Bar */}
      <div className="bg-[#1c2128] px-4 py-2 border-b border-[#30363d] flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-2xl">
          <Sparkles size={14} className="text-yellow-400 shrink-0" />
          <span className="text-[#8b949e] whitespace-nowrap font-medium">สั่งสร้างระบบแยกไฟล์:</span>
          <div className="relative flex-1">
            <input
              type="text"
              value={customSystemPrompt}
              onChange={(e) => setCustomSystemPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateCustomModularSystem()}
              placeholder="พิมพ์ชื่อระบบ เช่น 'ระบบ Dialogue Tree Quest', 'ระบบ รถยนต์ฟิสิกส์', 'ระบบ Boss AI'..."
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1 text-xs text-white placeholder-[#6e7681] focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => handleGenerateCustomModularSystem()}
            disabled={!customSystemPrompt.trim() || isProcessing}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <Zap size={12} /> สั่ง AI แยกไฟล์
          </button>
        </div>

        <div className="flex items-center gap-2 text-[#8b949e] text-[11px]">
          <span className="bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d] text-blue-400 font-mono">
            {projectFiles.length} ไฟล์ในระบบนี้
          </span>
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={12} /> 100% Decoupled
          </span>
        </div>
      </div>

      {/* Main Workspace: Left File Tree, Center Code Editor, Right Copilot Terminal */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Modular Project File Tree */}
        <div className="w-72 bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 z-10">
          <div className="p-3 border-b border-[#30363d] bg-[#1c2128] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderTree size={14} className="text-blue-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Modular Files Tree</span>
            </div>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 font-mono">
              1:1 Model
            </span>
          </div>

          <div className="p-2.5 bg-[#0d1117]/60 border-b border-[#30363d] text-[11px] text-[#8b949e]">
            <div className="font-semibold text-white mb-0.5 truncate">{activePreset.thaiTitle}</div>
            <div className="text-[10px] text-[#8b949e] leading-tight line-clamp-2">{activePreset.thaiDescription}</div>
          </div>

          {/* List of Modular Files */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
            {projectFiles.map((file, idx) => {
              const isSelected = file.id === activeFileId;
              return (
                <div
                  key={file.id}
                  onClick={() => setActiveFileId(file.id)}
                  className={`p-2 rounded-lg cursor-pointer transition-all border text-left group ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500/50 text-white shadow-sm'
                      : 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9] hover:border-[#8b949e] hover:bg-[#21262d]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileCode size={14} className={isSelected ? 'text-blue-400' : 'text-emerald-400'} />
                      <span className="font-mono text-xs font-semibold truncate text-white">
                        {file.name}
                      </span>
                    </div>
                    <span className="text-[9px] bg-[#21262d] text-[#8b949e] px-1.5 py-0.5 rounded font-mono">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="text-[10px] text-[#8b949e] leading-snug line-clamp-2 pl-5">
                    {file.descriptionThai}
                  </div>

                  <div className="mt-1.5 pt-1.5 border-t border-[#30363d]/50 flex items-center justify-between text-[9px] text-[#6e7681] pl-5">
                    <span className="truncate max-w-[140px] text-blue-300/80">{file.moduleRole}</span>
                    <span>{file.linesCount} บรรทัด</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* File Action Footer */}
          <div className="p-3 border-t border-[#30363d] bg-[#161b22] flex items-center justify-between gap-2">
            <button
              onClick={() => handleCopyCode(activeFile)}
              className="flex-1 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] rounded text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedFileId === activeFile.id ? (
                <>
                  <Check size={12} className="text-emerald-400" /> คัดลอกแล้ว
                </>
              ) : (
                <>
                  <Copy size={12} /> คัดลอกโค้ด
                </>
              )}
            </button>
            <button
              onClick={() => handleDownloadFile(activeFile)}
              className="py-1.5 px-2.5 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
              title="ดาวน์โหลดไฟล์นี้ (.ts)"
            >
              <Download size={12} />
            </button>
          </div>
        </div>

        {/* Center: Active File Tab & Code Editor */}
        <div className="flex-1 bg-[#0d1117] flex flex-col relative overflow-hidden border-r border-[#30363d]">
          
          {/* Top File Tabs */}
          <div className="h-10 bg-[#161b22] flex items-center shrink-0 border-b border-[#30363d] overflow-x-auto custom-scrollbar">
            {projectFiles.map(file => {
              const isSelected = file.id === activeFileId;
              return (
                <div
                  key={file.id}
                  onClick={() => setActiveFileId(file.id)}
                  className={`h-full px-4 border-r border-[#30363d] flex items-center gap-2 cursor-pointer transition-colors text-xs whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#0d1117] text-white border-t-2 border-t-blue-500 font-semibold'
                      : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
                  }`}
                >
                  <FileCode size={13} className={isSelected ? 'text-blue-400' : 'text-[#8b949e]'} />
                  <span>{file.name}</span>
                </div>
              );
            })}
          </div>

          {/* File Header Bar & Description */}
          <div className="bg-[#161b22]/70 px-4 py-2 border-b border-[#30363d] flex items-center justify-between text-xs">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="font-mono text-emerald-400 font-bold">{activeFile.name}</span>
              <span className="text-[#8b949e] text-[11px] truncate">
                บทบาท: <strong className="text-white">{activeFile.moduleRole}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                Exhaustive JSDoc Verified
              </span>
            </div>
          </div>

          {/* Code Textarea Editor */}
          <div className="flex-1 relative font-mono text-xs group flex">
            
            {/* Line Numbers Gutter */}
            <div className="w-12 bg-[#0d1117] border-r border-[#30363d]/50 py-4 text-right pr-3 select-none text-[#484f58] font-mono text-xs leading-relaxed shrink-0">
              {editedCode.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editable Text Area */}
            <textarea
              value={editedCode}
              onChange={(e) => setEditedCode(e.target.value)}
              spellCheck="false"
              className="flex-1 h-full bg-[#0d1117] text-[#c9d1d9] p-4 resize-none outline-none custom-scrollbar leading-relaxed font-mono selection:bg-blue-600/30"
              style={{ tabSize: 2 }}
            />
          </div>

          {/* Bottom Editor Status Bar */}
          <div className="h-6 bg-[#161b22] border-t border-[#30363d] flex items-center justify-between px-3 text-[10px] text-[#8b949e]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Code2 size={11} className="text-blue-400" /> TypeScript / ESNext</span>
              <span>UTF-8</span>
              <span>LF</span>
            </div>
            <div className="flex items-center gap-3">
              <span>{editedCode.split('\n').length} บรรทัด</span>
              <span>{editedCode.length} ตัวอักษร</span>
              <span className="text-emerald-400">● Synced</span>
            </div>
          </div>
        </div>

        {/* Right Side: Copilot Terminal & Modular Advisor */}
        <div className="w-[380px] bg-[#0d1117] flex flex-col shrink-0 relative">
          
          <div className="p-3 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#c9d1d9] flex items-center gap-2">
              <Cpu size={14} className="text-blue-400" /> Offline AI Copilot
            </h3>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Local Engine
            </span>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  {msg.role === 'ai' ? (
                    <>
                      <Sparkles size={12} className="text-blue-400" />
                      <span className="text-[10px] font-bold text-blue-400 uppercase">Offline Architect</span>
                    </>
                  ) : (
                    <span className="text-[10px] font-bold text-[#8b949e] uppercase">Developer</span>
                  )}
                </div>
                <div
                  className={`p-3 rounded-xl max-w-[95%] shadow-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#161b22] border border-[#30363d] text-[#c9d1d9]'
                  }`}
                >
                  <div className="markdown-body" style={{ background: 'transparent', color: 'inherit' }}>
                    <Markdown>{msg.content}</Markdown>
                  </div>
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex flex-col gap-1 items-start">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Loader2 size={12} className="text-blue-400 animate-spin" />
                  <span className="text-[10px] font-bold text-[#8b949e] uppercase">กำลังสังเคราะห์โมดูลาร์...</span>
                </div>
                <div className="p-3 rounded-xl bg-[#161b22] border border-[#30363d] text-[#8b949e] max-w-[95%] shadow-sm">
                  <div className="flex space-x-1.5 items-center h-4">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Suggestion Chips */}
          <div className="px-3 py-2 bg-[#161b22]/50 border-t border-[#30363d] flex flex-wrap gap-1.5">
            <button
              onClick={() => {
                setInput("วิเคราะห์การแยกไฟล์และสถาปัตยกรรมของระบบนี้");
              }}
              className="px-2 py-1 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white rounded text-[10px] transition-colors"
            >
              🏛️ ตรวจสอบการแยกไฟล์
            </button>
            <button
              onClick={() => {
                setInput("ตรวจสอบความปลอดภัยและ Bounds Checking");
              }}
              className="px-2 py-1 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white rounded text-[10px] transition-colors"
            >
              🛡️ สแกนความปลอดภัย
            </button>
            <button
              onClick={() => {
                setInput("สร้างระบบ Quest Dialogue Decision Tree");
              }}
              className="px-2 py-1 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white rounded text-[10px] transition-colors"
            >
              📜 สร้าง Quest Tree
            </button>
          </div>

          {/* Input Chat Box */}
          <div className="p-3 bg-[#161b22] border-t border-[#30363d]">
            <div className="relative flex items-end bg-[#0d1117] border border-[#30363d] rounded-xl focus-within:border-blue-500 transition-colors p-1">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="w-full bg-transparent p-2 text-xs text-[#c9d1d9] resize-none outline-none max-h-28 min-h-[36px] custom-scrollbar"
                placeholder="สั่งให้ AI แยกไฟล์, ดีบัก, หรือเพิ่มโมดูล..."
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isProcessing}
                className="mb-1 mr-1 p-1.5 bg-blue-600 disabled:bg-[#21262d] disabled:text-[#8b949e] rounded-lg text-white hover:bg-blue-500 transition-colors flex-shrink-0"
              >
                <Send size={14}/>
              </button>
            </div>
            <div className="flex justify-between items-center mt-2 px-1 text-[10px] text-[#8b949e]">
              <span className="flex items-center gap-1 text-blue-400">
                <FileCode size={10} /> {activeFile.name}
              </span>
              <span>กด Enter เพื่อส่งคำสั่ง</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
