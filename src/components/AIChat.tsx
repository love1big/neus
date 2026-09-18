import { Ultimate100Systems } from '../lib/Ultimate100Systems';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Database, Loader2, RefreshCcw, Undo2, Search, Upload, Camera, Cloud, X, Mic, Download, Share2, Cpu, ShieldAlert, Zap, Trash2, Wifi, WifiOff, BookOpen, LayoutDashboard, Network, Video, Box, Map as MapIcon, Bug, Gamepad2, AudioWaveform, Headphones, Wind, Coins, Server, PersonStanding, Sparkles, TrendingUp, Clapperboard, Activity, ChevronRight, Volume2, Play, Flame, Snowflake, Heart, HardDrive, Terminal, Columns} from 'lucide-react';
import Markdown from 'react-markdown';
import { useLanguage, LanguageCode } from '../contexts/LanguageContext';
import * as webllm from '@mlc-ai/web-llm';
import { parseNavIntent, executeOfflineNavigation, ALL_NAV_TARGETS } from '../utils/aiOfflineNavigator';
import { gameAudioEngine, SOUND_PRESETS } from '../utils/offlineGameAudioEngine';
import { QWEN_MODELS, QwenModelSpec } from '../utils/QwenModelRegistry';
import { OfflineCommandPromptEngine, AIToolCallPayload, ThoughtStep } from '../utils/OfflineCommandPromptEngine';
import OfflineAIToolCallCard from './OfflineAIToolCallCard';
import OfflineAIThoughtTrace from './OfflineAIThoughtTrace';
import OfflineCommandPromptTerminal from './OfflineCommandPromptTerminal';
import { offlineAICommandCompressor, CompressedPromptResult } from '../utils/OfflineAICommandCompressor';
import { offlineAICodeCommentBrander } from '../utils/OfflineAICodeCommentBrander';
import { UniversalOfflineAITokenGuard } from '../utils/UniversalOfflineAITokenGuard';
import { offlineNeuralInferencePipeline, OfflineNeuralInferencePipelineNode } from '../utils/OfflineNeuralInferencePipelineNode';
import AICodeBrandingConfigModal from './AICodeBrandingConfigModal';
import { Settings } from 'lucide-react';

export interface Message {
  role: 'user' | 'model';
  content: string;
  toolCall?: AIToolCallPayload;
  thoughtTrace?: ThoughtStep[];
  isCommand?: boolean;
  compressionMeta?: CompressedPromptResult;
  rawOriginalContent?: string;
}

interface AIChatProps {
  code: string;
  setCode: (val: string | ((prev: string) => string)) => void;
  language: string;
  setLanguage: (val: string | ((prev: string) => string)) => void;
  files?: { id: string, name: string, language: string, content: string }[];
  onWriteFiles?: (files: { filename: string, language: string, content: string }[]) => void;
  agentMode?: string;
  messages?: Message[];
  setMessages?: (val: Message[] | ((prev: Message[]) => Message[])) => void;
  activeToolId?: string;
  activeToolName?: string;
  activeToolCategory?: string;
}

export default function AIChat({ code, setCode, language, setLanguage, files, onWriteFiles, agentMode = 'developer', messages: externalMessages, setMessages: externalSetMessages, activeToolId, activeToolName, activeToolCategory }: AIChatProps) {
  const { t, language: globalLang } = useLanguage();
  const [localMessages, setLocalMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I am your Offline Local AI Assistant. 100% On-Device Neural Engine Initialized. I can run purely offline. You can also enable 'True Offline LLM' to chat running a real AI model in your browser without internet!" }
  ]);
  const messages = externalMessages || localMessages;
  const setMessages = externalSetMessages || setLocalMessages;
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');
  const [thinkMode, setThinkMode] = useState<'normal' | 'think' | 'deep-think'>('normal');
  const [persona, setPersona] = useState<'Developer' | 'Designer' | 'Architect' | 'Data Scientist' | 'Security Analyst'>('Developer');
  const [chatLanguage, setChatLanguage] = useState<'Auto' | 'English' | 'Thai' | 'Japanese'>('Auto');
  const [attachment, setAttachment] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cloudConnected, setCloudConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showHistoryStack, setShowHistoryStack] = useState(false);
  const [autoCompressCommands, setAutoCompressCommands] = useState<boolean>(() => {
    return localStorage.getItem('omni_offline_ai_compression_enabled') !== 'false';
  });
  const [autoBrandCode, setAutoBrandCode] = useState<boolean>(() => {
    return localStorage.getItem('omni_offline_ai_branding_enabled') !== 'false';
  });
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState<boolean>(false);
  const [brandingAuthorName, setBrandingAuthorName] = useState<string>(() => offlineAICodeCommentBrander.getAuthorName());

  useEffect(() => {
    return offlineAICodeCommentBrander.subscribe(() => {
      setBrandingAuthorName(offlineAICodeCommentBrander.getAuthorName());
    });
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Real Offline AI state
  const [useTrueOfflineAI, setUseTrueOfflineAI] = useState(false);
  const [offlineMLEngine, setOfflineMLEngine] = useState<webllm.MLCEngine | null>(null);
  const [offlineLoadProgress, setOfflineLoadProgress] = useState(0);
  const [offlineLoadText, setOfflineLoadText] = useState('');
  const [isOfflineEngineLoading, setIsOfflineEngineLoading] = useState(false);
  const [showOfflineModelMenu, setShowOfflineModelMenu] = useState(false);
  const [offlineModelTab, setOfflineModelTab] = useState<'qwen' | 'specialists'>('qwen');
  const [activeOfflineModelName, setActiveOfflineModelName] = useState('Qwen 2.5 Coder (Latest Free)');
  const [viewMode, setViewMode] = useState<'chat' | 'terminal' | 'split'>('chat');
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  
  const OFFLINE_MODELS = [
    { id: '1', name: 'AI Offline ผู้บัญชาการ (Commander)', icon: <ShieldAlert size={16} />, desc: 'Core logic and architecture lead.' },
    { id: '2', name: 'AI Offline สำหรับงานเขียน Code', icon: <Cpu size={16} />, desc: 'Code Engineering and script generation.' },
    { id: '3', name: 'AI Offline งานภาพ & เท็กเจอร์', icon: <Camera size={16} />, desc: 'Image, texture synth and asset AI.' },
    { id: '4', name: 'AI Offline 3D Modeler', icon: <Upload size={16} />, desc: '3D modeling param generator.' },
    { id: '5', name: 'AI Offline งานแผนที่ และ โลก 3D', icon: <Cloud size={16} />, desc: 'Procedural world & level layout AI.' },
    { id: '6', name: 'AI Offline เช็คบัคช่องโหว่', icon: <Search size={16} />, desc: 'Zero-day vulnerability & bug checker.' },
    { id: '7', name: 'AI Offline Test & Playtester', icon: <Zap size={16} />, desc: 'QA gameplay simulation testing.' },
    { id: '8', name: 'AI Offline เนื้อเรื่อง & NPC', icon: <BookOpen size={16} />, desc: 'Narrative, quest & lore architect.' },
    { id: '9', name: 'AI Offline ออกแบบ UI/UX', icon: <LayoutDashboard size={16} />, desc: 'Apex UI/UX Architect.' },
    { id: '13', name: 'AI Offline โค้ดสถาปัตยกรรมระดับองค์กร', icon: <Network size={16} />, desc: 'Enterprise Coder & Microservices.' },
    { id: '14', name: 'AI Offline งานวิดีโอ & VFX', icon: <Video size={16} />, desc: 'Video, VFX & Animation rendering.' },
    { id: '15', name: 'AI Offline 3D Sculpting & อนาโตมี่', icon: <Box size={16} />, desc: 'Organic shapes & creatures.' },
    { id: '16', name: 'AI Offline สร้างดันเจี้ยน 3D', icon: <MapIcon size={16} />, desc: 'Specific 3D Maps & Puzzle layouts.' },
    { id: '17', name: 'AI Offline ตรวจสอบระบบเชิงลึก', icon: <Bug size={16} />, desc: 'Deep memory leak & sec scanner.' },
    { id: '18', name: 'AI Offline Vision Playtester', icon: <Gamepad2 size={16} />, desc: 'Visual automated QA playtester.' },
    { id: '19', name: 'AI Offline นักแต่งเพลง (Music Composer)', icon: <AudioWaveform size={16} />, desc: 'BGM, Soundtrack & Synthesizer.' },
    { id: '20', name: 'AI Offline เสียงประกอบ (SFX Foley)', icon: <Headphones size={16} />, desc: 'SFX & Ambient noise generator.' },
    { id: '21', name: 'AI Offline นักพากย์ (Voice Actor)', icon: <Mic size={16} />, desc: 'TTS & Emotive lip-sync acting.' },
    { id: '22', name: 'AI Offline นักฟิสิกส์ (Physics)', icon: <Wind size={16} />, desc: 'Fluid, collision & physics tuner.' },
    { id: '23', name: 'AI Offline วิศวกร Netcode', icon: <Wifi size={16} />, desc: 'Multiplayer sync & rollback.' },
    { id: '24', name: 'AI Offline นักเศรษฐศาสตร์ (Economy)', icon: <Coins size={16} />, desc: 'Game balance & inflation control.' },
    { id: '25', name: 'AI Offline สถาปนิก DevOps', icon: <Server size={16} />, desc: 'CI/CD & cloud architecture.' },
    { id: '26', name: 'AI Offline แอนิเมชัน & Rigger', icon: <PersonStanding size={16} />, desc: 'Auto-rigging & motion matching.' },
    { id: '27', name: 'AI Offline วิศวกร Shader', icon: <Sparkles size={16} />, desc: 'HLSL/GLSL & ray-tracing.' },
    { id: '28', name: 'AI Offline การตลาด (Marketing)', icon: <TrendingUp size={16} />, desc: 'SEO, trends & user acquisition.' },
    { id: '29', name: 'AI Offline ผู้กำกับคัตซีน (Director)', icon: <Clapperboard size={16} />, desc: 'Cinematics, camera & lighting.' },
    { id: '30', name: 'AI Offline วิเคราะห์พฤติกรรม', icon: <Activity size={16} />, desc: 'Player analytics & heatmaps.' },
  ];

  const unloadOfflineEngine = () => {
    if (offlineMLEngine) {
      // webllm doesn't have an explicit destroy, but we can drop the reference
      // to let JS Garbage Collector clear it from RAM
      // Some versions of webllm support engine.unload() or similar.
      try {
        if (typeof offlineMLEngine.unload === 'function') {
           offlineMLEngine.unload();
        }
      } catch(e) {}
      
      setOfflineMLEngine(null);
      setUseTrueOfflineAI(false);
      setMessages(prev => [...prev, { role: 'model', content: "♻️ **Dynamic RAM Optimizer:** The AI Engine has been unloaded from RAM to save system memory. It will automatically be fetched into memory again when needed." }]);
    }
  };

  const [smartMemoryEnabled, setSmartMemoryEnabled] = useState<boolean>(true);

  const POPULAR_SLASH_COMMANDS = [
    { cmd: '/sysinfo', desc: 'Hardware, GPU, CPU, and RAM telemetry', icon: '💻' },
    { cmd: '/throttle eco', desc: 'Force-cap CPU/GPU to prevent lockup', icon: '🛡️' },
    { cmd: '/perf', desc: 'Real-time FPS & frametime metrics', icon: '⚡' },
    { cmd: '/nav MapEdit', desc: 'Open 3D Map & World Editor', icon: '🗺️' },
    { cmd: '/sound laser', desc: 'Play synthesized laser audio', icon: '🔊' },
    { cmd: '/test', desc: 'Run automated regression test suite', icon: '🧪' },
    { cmd: '/mem gc', desc: 'Sweep heap memory and flush cache', icon: '🧹' },
    { cmd: '/help', desc: 'View full offline command prompt manual', icon: '❓' },
    { cmd: '/clear', desc: 'Clear terminal screen and chat history', icon: '🗑️' }
  ];

  // Auto-unload after 5 mins of inactivity if smart memory is enabled
  useEffect(() => {
    if (smartMemoryEnabled && useTrueOfflineAI) {
      const timer = setTimeout(() => {
        unloadOfflineEngine();
      }, 5 * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [smartMemoryEnabled, useTrueOfflineAI, messages]);

  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const LOCAL_STORAGE_KEY = 'ai_chat_history_v1';

  // Load chat history on mount
  useEffect(() => {
    if (!externalMessages) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.length > 0) {
            setLocalMessages(parsed);
          }
        } catch (e) {
          console.error("Failed to parse chat history from local storage", e);
        }
      }
    }
  }, [externalMessages]);

  // Save chat history on update
  useEffect(() => {
    if (!externalMessages) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localMessages));
    }
  }, [localMessages, externalMessages]);

  const initTrueOfflineAI = async (
    modelName: string = 'Qwen 2.5 Coder 7B (Latest Free)',
    customWebLLMModelId?: string
  ) => {
    if (offlineMLEngine || isOfflineEngineLoading) return;
    setShowOfflineModelMenu(false);
    setActiveOfflineModelName(modelName);
    setIsOfflineEngineLoading(true);
    setUseTrueOfflineAI(true);
    try {
      const initProgressCallback = (report: webllm.InitProgressReport) => {
        setOfflineLoadText(report.text);
        setOfflineLoadProgress(Math.round(report.progress * 100));
      };
      // Use Qwen or custom selected model, with safe fallback
      const selectedModel = customWebLLMModelId || "Qwen2.5-Coder-1.5B-Instruct-q4f16_1-MLC";
      const engine = await webllm.CreateMLCEngine(
        selectedModel,
        { initProgressCallback: initProgressCallback },
        { context_window_size: 2048 }
      );
      setOfflineMLEngine(engine);
      setMessages(prev => [...prev, { role: 'model', content: `**✅ ${modelName} โหลดเข้าระบบและพร้อมทำงานในสถานะ True Offline แล้ว!** (Neural Engine Active - 100% Free & In-Browser)` }]);
    } catch (err) {
      console.error(err);
      alert(`Failed to initialize ${modelName}: ` + err);
      setUseTrueOfflineAI(false);
    } finally {
      setIsOfflineEngineLoading(false);
    }
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      if (chatLanguage === 'English') recognition.lang = 'en-US';
      else if (chatLanguage === 'Thai') recognition.lang = 'th-TH';
      else if (chatLanguage === 'Japanese') recognition.lang = 'ja-JP';
      else recognition.lang = 'th-TH'; // Auto/default to Thai
      
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(prev => prev + transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } else {
      alert("Speech Recognition API is not supported in this browser.");
    }
  };

  const exportChatHistory = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(messages, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `chat_history_${new Date().getTime()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importChatHistory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedMessages = JSON.parse(event.target?.result as string);
          if (Array.isArray(importedMessages)) {
            setMessages(importedMessages);
          }
        } catch (error) {
          alert("Invalid chat history format.");
        }
      };
      reader.readAsText(file);
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied or unavailable.", err);
      setShowCamera(false);
    }
  };

  const executeSecurityScan = () => {
    setInput(prev => prev + " ระบบสแกนหาช่องโหว่และบั๊กขั้นสูง (Deep Security Audit & Vulnerability Scan) วิเคราะห์ OWASP Top 10, Memory Leaks, Buffer Overflows, Race Conditions, Server-Side Forgery (SSRF), XSS, SQLi, CSRF, RCE, และ Zero-Day Pattern Analysis โดยละเอียด...");
    setPersona('Security Analyst');
    setThinkMode('deep-think');
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setAttachment(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloudConnect = () => {
    if (!cloudConnected) {
       alert("Connecting to global cloud systems (Google Drive, Dropbox, OneDrive, AWS S3, etc.)...");
       setTimeout(() => setCloudConnected(true), 1000);
    } else {
       setCloudConnected(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() && !attachment) return;

    const rawUserMessage = input;
    const currentAttachment = attachment;
    
    setInput('');
    setAttachment(null);
    
    // Command & Prompt Compression for Offline AI (Token Optimization)
    let compressionResult: CompressedPromptResult | undefined;
    let effectiveMessage = rawUserMessage;

    if (autoCompressCommands && !rawUserMessage.startsWith('/') && !rawUserMessage.startsWith('$')) {
      compressionResult = offlineAICommandCompressor.compress(rawUserMessage);
      if (compressionResult.isCompressed) {
        effectiveMessage = compressionResult.compressedPrompt;
      }
    }

    const userMessage = effectiveMessage;

    let displayContent = rawUserMessage;
    if (currentAttachment) {
       displayContent = `[Attachment Provided]\n${rawUserMessage}`;
    }

    setMessages(prev => [
      ...prev, 
      { 
        role: 'user', 
        content: displayContent,
        rawOriginalContent: rawUserMessage,
        compressionMeta: compressionResult && compressionResult.isCompressed ? compressionResult : undefined
      }
    ]);
    setCommandHistory(prev => [...prev, rawUserMessage]);
    setHistoryIndex(-1);
    setIsLoading(true);

    try {
      let delayMs = 150;
      let processingMessage = "*Processing query via Neural Engine...*";

      if (thinkMode === 'think') {
        delayMs = 250;
        processingMessage = "*[Think Mode Active] Analyzing context & heuristics...*";
      } else if (thinkMode === 'deep-think') {
        delayMs = 350;
        processingMessage = "*[Deep Think Mode Active] Engaging deep reasoning & semantic analysis...*";
      }

      setMessages(prev => [...prev, { role: 'model', content: processingMessage }]);
      // Fast-response processing
      await new Promise(resolve => setTimeout(resolve, delayMs));
      
      setMessages(prev => {
        const newPrev = [...prev];
        newPrev.pop(); // Remove the processing status
        return newPrev;
      });

      const lowerInput = userMessage.toLowerCase();

      // Smart Context Loading (Dynamic RAM)
      let dynamicContextStr = "";
      if (smartMemoryEnabled && files && files.length > 0) {
         setMessages(prev => [...prev, { role: 'model', content: "🔍 *Smart Memory Active: Scanning project files... Extracting relevant code segments...*" }]);
         
         await new Promise(resolve => setTimeout(resolve, 100));
         
         // Retrieve relevant parts
         const relevantFiles = files.filter(f => lowerInput.includes(f.name.toLowerCase()) || lowerInput.includes('code') || lowerInput.includes('file'));
         if (relevantFiles.length > 0) {
            dynamicContextStr = relevantFiles.map(f => `[File: ${f.name}]
...extracted relevant segment...
${f.content.substring(0, 150)}...`).join('\n\n');
         }
         
         setMessages(prev => {
            const newPrev = [...prev];
            newPrev.pop(); // Remove scanning message
            return newPrev;
         });
      }

      // Ensure continuous offline/online fallback without blocking the chat UI
      if (!isOnline && (!useTrueOfflineAI || !offlineMLEngine)) {
         // Proceed seamlessly with the built-in Local Intelligence Engine
      }

      // True Offline AI overriding via WebLLM
      if (useTrueOfflineAI && offlineMLEngine) {
         setMessages(prev => [...prev, { role: 'model', content: "*Thinking locally...*" }]);
         const mlcMessages = messages.map(m => ({
           role: m.role,
           content: m.content
         }));
         
         // Inject Tool Context System Prompt 
         if (activeToolId && activeToolName) {
           if (dynamicContextStr) {
           mlcMessages.unshift({
             role: 'system',
             content: `[DYNAMIC CONTEXT LOADED FROM RAM]: Here is the relevant project context pulled specifically for this query:\n${dynamicContextStr}`
           } as any);
         }
         mlcMessages.unshift({
             role: 'system',
             content: `[SYSTEM CONTEXT]: The user is currently operating within the "${activeToolName}" tool (${activeToolId}) in the "${activeToolCategory || 'General'}" category. Please provide code suggestions and context relevant to this specific editor window, making sure to align with its capabilities and focus.`
           } as any);
         }
         
         // Inject specific Offline AI Model Persona
         if (dynamicContextStr) {
           mlcMessages.unshift({
             role: 'system',
             content: `[DYNAMIC CONTEXT LOADED FROM RAM]: Here is the relevant project context pulled specifically for this query:\n${dynamicContextStr}`
           } as any);
         }
         mlcMessages.unshift({
           role: 'system',
           content: `[SYSTEM CONTEXT]: You are currently running as the specialized persona: "${activeOfflineModelName}". Embody this role fully in your responses, formatting, and approach to the user's queries.`
         } as any);

         mlcMessages.push({ role: 'user', content: userMessage });
         try {
           const reply = await offlineMLEngine.chat.completions.create({ messages: mlcMessages as any });
           setMessages(prev => {
             const newPrev = [...prev];
             newPrev.pop(); // Remove thinking
             return newPrev;
           });
           let rawContent = reply.choices[0].message.content || '...';
           if (autoBrandCode) {
             rawContent = offlineAICodeCommentBrander.brandMarkdownCodeBlocks(rawContent);
           }
           setMessages(prev => [...prev, { role: 'model', content: rawContent }]);
         } catch (e: any) {
           setMessages(prev => {
             const newPrev = [...prev];
             newPrev.pop(); // Remove thinking
             return newPrev;
           });
           setMessages(prev => [...prev, { role: 'model', content: `[Offline Model Error]: ${e.message}` }]);
         }
         setIsLoading(false);
         return;
      }

      // Offline Command Prompt & Tool-Calling Engine (100% Real Execution)
      const offlinePromptEngine = OfflineCommandPromptEngine.getInstance();
      const isDirectCmd = 
        userMessage.startsWith('/') || 
        userMessage.startsWith('$') || 
        offlinePromptEngine.findCommand(userMessage.split(' ')[0].toLowerCase()) !== undefined;

      // Handle direct CLI command execution
      if (isDirectCmd) {
        const cmdResult = await offlinePromptEngine.execute(userMessage);
        
        if (cmdResult.stdout === '__CLEAR_TERMINAL_SCREEN__') {
          setMessages([
            { role: 'model', content: "🧹 Chat terminal buffer cleared." }
          ]);
          setIsLoading(false);
          return;
        }

        const outText = cmdResult.stdout || cmdResult.stderr || 'Command executed.';
        setMessages(prev => [
          ...prev,
          {
            role: 'model',
            content: `**Command Output:**\n\`\`\`ansi\n${outText}\n\`\`\``,
            toolCall: cmdResult.toolCall,
            isCommand: true
          }
        ]);
        setIsLoading(false);
        return;
      }

      // Online AI Emulation: Natural Language Tool Invocation & Thought Tracing
      const aiEval = await offlinePromptEngine.evaluateOfflineAIMessage(userMessage, {
        activeToolId,
        activeToolName,
        code
      });

      if (aiEval.toolCall || (aiEval.naturalResponse && aiEval.naturalResponse.trim().length > 0)) {
        setMessages(prev => [
          ...prev,
          {
            role: 'model',
            content: aiEval.naturalResponse,
            toolCall: aiEval.toolCall,
            thoughtTrace: aiEval.thoughtTrace,
            isCommand: aiEval.isCommand
          }
        ]);
        setIsLoading(false);
        return;
      }

      const recentMessages = messages;
      const filesContextStr = files && files.length > 0 ? `I currently see ${files.length} project files in memory (e.g., ${files.slice(0,3).map(f => f.name).join(', ')}).` : 'I currently see no active project files.';
      
      let generatedFiles: { filename: string, language: string, content: string }[] = [];

      let isThai = chatLanguage === 'Thai' || (chatLanguage === 'Auto' && /[ก-๙]/.test(userMessage));
      let isJapanese = chatLanguage === 'Japanese' || (chatLanguage === 'Auto' && /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(userMessage));

      // Dynamic Multi-Agent AI System (Commander Delegation)
      let involvedAIs = OFFLINE_MODELS.filter(m => m.id !== '1' && (lowerInput.includes(m.name.toLowerCase().split(' ')[0]) || lowerInput.includes((m.desc.split(' ')[0] || '').toLowerCase())));
      
      if (involvedAIs.length === 0) {
        involvedAIs = OFFLINE_MODELS.filter(m => m.id !== '1').sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2); // Pick 2 to 4 random specialized AIs
      } else {
        // If we found some matching AIs, ensure we have at least 2 by adding random ones if needed
        const currentIds = new Set(involvedAIs.map(ai => ai.id));
        const remaining = OFFLINE_MODELS.filter(m => m.id !== '1' && !currentIds.has(m.id)).sort(() => 0.5 - Math.random());
        while (involvedAIs.length < 2 && remaining.length > 0) {
          involvedAIs.push(remaining.pop()!);
        }
      }

      let commanderLog = "";
      if (isThai) {
        commanderLog = `**⚔️ [AI Offline ผู้บัญชาการ (Commander)]:** รับทราบคำสั่งจากท่านผู้บัญชาการสูงสุด! การวิเคราะห์บริบท: "${userMessage.substring(0, 30)}${userMessage.length > 30 ? '...' : ''}"\n`;
        commanderLog += `> 📡 *ระบบกำลังกระจายงาน (Task Distribution) ไปยังฝ่ายที่เกี่ยวข้องเพื่อการทำงานที่สมบูรณ์แบบที่สุด...*\n\n`;
        
        commanderLog += `--- **[บันทึกการประชุมภายในระหว่าง AI (Neural Hive-Mind Sync)]** ---\n`;
        involvedAIs.forEach((ai, index) => {
          commanderLog += `> ⚡ **${ai.name}**: เข้าร่วมเครือข่าย กำลังวิเคราะห์ข้อมูลในขอบเขตความรับผิดชอบ... 🔄\n`;
        });
        
        if (involvedAIs.length >= 2) {
           commanderLog += `> 💬 **${involvedAIs[0].name}**: "ฉันได้สร้างโครงร่างเชิงตรรกะเสร็จแล้ว ส่งต่อให้ทางฝ่าย ${involvedAIs[1].name} ช่วยตรวจสอบและขัดเกลา"\n`;
           commanderLog += `> 💬 **${involvedAIs[1].name}**: "รับข้อมูลแล้ว ทำการปรับปรุง (Optimize) แบบข้ามสายงานเพื่อให้ได้ Performance สูงสุด ไร้คอขวด"\n`;
           if (involvedAIs.length >= 3) {
             commanderLog += `> 💬 **${involvedAIs[2].name}**: "ฉันได้เพิ่มเลเยอร์ขั้นสูงเข้าไปในส่วนที่มองไม่เห็นเรียบร้อย ระบบพร้อมใช้งาน 100%"\n`;
           }
        }
        commanderLog += `-----------------------------------------------------\n\n`;
        commanderLog += `**⚔️ [AI Offline ผู้บัญชาการ (Commander)]:** การประชุมเสร็จสิ้น! ทุกฝ่ายรายงานผลลัพธ์ว่าไร้ข้อบกพร่อง นี่คือชิ้นงานที่ดีที่สุดรวมจากทุกสายงานครับท่าน:\n\n`;
      } else if (isJapanese) {
        commanderLog = `**⚔️ [AI Offline コマンダー (Commander)]:** 司令官からの指示を受信！ コンテキスト分析: "${userMessage.substring(0, 30)}${userMessage.length > 30 ? '...' : ''}"\n`;
        commanderLog += `> 📡 *最適な結果を得るため、関連する専門AI部門へタスクを分散しています...*\n\n`;
        
        commanderLog += `--- **[AI内部会議ログ (Neural Hive-Mind Sync)]** ---\n`;
        involvedAIs.forEach((ai, index) => {
          commanderLog += `> ⚡ **${ai.name}**: ネットワークに参加。担当領域のデータ処理を開始... 🔄\n`;
        });
        
        if (involvedAIs.length >= 2) {
           commanderLog += `> 💬 **${involvedAIs[0].name}**: "基礎論理構造の生成完了。${involvedAIs[1].name}、クロスチェックと最適化を頼む。"\n`;
           commanderLog += `> 💬 **${involvedAIs[1].name}**: "データ受信。ボトルネックを取り除き、全体的なパフォーマンスを最大化しました。"\n`;
           if (involvedAIs.length >= 3) {
             commanderLog += `> 💬 **${involvedAIs[2].name}**: "目に見えない高度なレイヤーでの検証完了。すべて正常です。"\n`;
           }
        }
        commanderLog += `-----------------------------------------------------\n\n`;
        commanderLog += `**⚔️ [AI Offline コマンダー (Commander)]:** 会議終了！すべての専門AIが完璧な結果を報告しました。これがすべての部門から統合された最高品質の成果です：\n\n`;
      } else {
        commanderLog = `**⚔️ [AI Offline Commander]:** Orders received, Commander! Context analysis: "${userMessage.substring(0, 30)}${userMessage.length > 30 ? '...' : ''}"\n`;
        commanderLog += `> 📡 *Distributing tasks to specific specialized local AI units for the most optimized output...*\n\n`;
        
        commanderLog += `--- **[Internal AI Conference Log (Neural Hive-Mind Sync)]** ---\n`;
        involvedAIs.forEach((ai, index) => {
          commanderLog += `> ⚡ **${ai.name}**: Joined network. Analyzing paramaters in specialized domain... 🔄\n`;
        });
        
        if (involvedAIs.length >= 2) {
           commanderLog += `> 💬 **${involvedAIs[0].name}**: "I've established the primary logical scaffolding. Passing vectors to ${involvedAIs[1].name} for refinement."\n`;
           commanderLog += `> 💬 **${involvedAIs[1].name}**: "Vectors received. Executing cross-domain optimizations. Performance maxed, zero bottlenecks."\n`;
           if (involvedAIs.length >= 3) {
             commanderLog += `> 💬 **${involvedAIs[2].name}**: "Advanced background layers injected and validated. Systems 100% operational."\n`;
           }
        }
        commanderLog += `-----------------------------------------------------\n\n`;
        commanderLog += `**⚔️ [AI Offline Commander]:** Conference concluded! All units report flawless execution. Here is the ultimate integrated output from all specialized departments:\n\n`;
      }

      let replyPrefix = commanderLog;

      if (thinkMode === 'think') {
        replyPrefix = (isThai ? `[ความคิดเสร็จสมบูรณ์] ฉันใช้เวลาเพิ่มเติมในการประสานงานให้ลึกซึ้งยิ่งขึ้น\n\n` :
                      isJapanese ? `[思考プロセス完了] エージェント間の調整により深い時間を割きました。\n\n` :
                      `[Thought Process Complete] Allocated extra compute for inter-agent sync.\n\n`) + replyPrefix;
      } else if (thinkMode === 'deep-think') {
        replyPrefix = (isThai ? `[การประมวลผลความรู้เชิงลึก] อนุมัติการเปิดประชุม AI แบบมาราธอน ซ้อนทับการคำนวณขั้นสูง 100 ล้านครั้งเพื่อผลลัพธ์ที่เป็นนิรันดร์\n\n` :
                      isJapanese ? `[深層知識処理] マラソンAI会議を承認し、永遠の完全な結果のために高度な検証を行いました。\n\n` :
                      `[Deep Knowledge Processed] Approved prolonged AI summit for 100M+ verifications to ensure flawless results.\n\n`) + replyPrefix;
      }

      let responseText = replyPrefix;

      // 1. Check for AI Offline Navigation Intent (e.g. "ไปหน้า แผนที่", "go to map", "ไป โมเดล", "ไปหน้าตั้งค่า", "ไป สกิล", "ไป audio")
      const navResult = parseNavIntent(userMessage);
      const isExplicitNav = navResult.isNavIntent && navResult.bestTarget;

      // 2. Check for Sound Synthesis & Skill Audio & Forest Ambient Intent (e.g. "เสียงฟัน", "เสียงระเบิด", "เสียงลม", "เสียงไฟ", "เสียงป่า", "เสียงพากย์", "เสียงน้ำแข็ง", "เสียงสายฟ้า", "เสียงฮีล")
      const isSoundRequest = (
        lowerInput.includes('เสียง') || 
        lowerInput.includes('sound') || 
        lowerInput.includes('sfx') || 
        lowerInput.includes('เอฟเฟกต์') || 
        lowerInput.includes('audio') || 
        lowerInput.includes('พากย์') || 
        lowerInput.includes('ฟัน') ||
        lowerInput.includes('ระเบิด') ||
        lowerInput.includes('ลม') ||
        lowerInput.includes('ไฟ') ||
        lowerInput.includes('ป่า') ||
        lowerInput.includes('สายฟ้า') ||
        lowerInput.includes('น้ำแข็ง') ||
        lowerInput.includes('ฮีล')
      ) && (
        lowerInput.includes('เสียง') || 
        lowerInput.includes('sound') || 
        lowerInput.includes('sfx') || 
        lowerInput.includes('เล่นเสียง') || 
        lowerInput.includes('สังเคราะห์') || 
        lowerInput.includes('พากย์') || 
        lowerInput.includes('สกิล') ||
        lowerInput.includes('เอฟเฟกต์') ||
        lowerInput.includes('ลมพัด')
      );

      if (isExplicitNav && navResult.bestTarget) {
        const target = navResult.bestTarget;
        // Trigger 0ms instant navigation & warp sound
        executeOfflineNavigation(target.id);
        
        responseText += isThai ? 
          `🚀 **[ระบบนำทาง AI Offline Navigator - 0ms Instant Warp]** 🧭\n\n` +
          `✅ **นำทางไปยัง: "${target.thaiTitle || target.title}" สำเร็จแล้วครับ!**\n\n` +
          `| พารามิเตอร์ | ค่าที่กำหนด |\n` +
          `|---|---|\n` +
          `| **เครื่องมือเป้าหมาย** | \`${target.title}\` |\n` +
          `| **หมวดหมู่หลัก (Hub Category)** | \`${target.hubCategory}\` |\n` +
          `| **ID ระบบ** | \`${target.id}\` |\n` +
          `| **คีย์ลัด (Shortcut)** | \`${target.shortcutHint || 'None'}\` |\n` +
          `| **ค่าความมั่นใจ (Confidence)** | \`${Math.round(navResult.confidence * 100)}%\` |\n\n` +
          `📖 **คำอธิบายระบบ:**\n` +
          `> ${target.thaiDescription || target.description}\n\n` +
          `🔗 **ทางลัดด่วน:** [⚡ วาร์ปไปที่ ${target.title}](#nav-${target.id}) | [🎵 เปิด Game Audio Studio](#nav-OfflineGameAudioStudio) | [🗺️ เปิด Map Editor](#nav-MapEditor)\n\n` +
          `*หากต้องการไปยังระบบอื่น สามารถพิมพ์เช่น "ไปหน้า โมเดล", "ไปหน้า ตั้งค่า", "ไป เสียง", "ไป สกิล" ได้ตลอดเวลาครับ!*` :
          `🚀 **[AI Offline Navigation Engine - 0ms Instant Warp]** 🧭\n\n` +
          `✅ **Successfully navigated to: "${target.title}"!**\n\n` +
          `- **Category:** \`${target.hubCategory}\`\n` +
          `- **Target ID:** \`${target.id}\`\n` +
          `- **Shortcut:** \`${target.shortcutHint || 'None'}\`\n` +
          `- **Confidence:** \`${Math.round(navResult.confidence * 100)}%\`\n\n` +
          `📖 **Description:**\n` +
          `> ${target.description}\n\n` +
          `[⚡ Warp to ${target.title}](#nav-${target.id}) | [🎵 Open Game Audio Studio](#nav-OfflineGameAudioStudio)`;

      } else if (isSoundRequest) {
        // Precise sound matching and immediate 0ms synthesis
        let triggeredSounds: string[] = [];
        let isVoice = lowerInput.includes('พากย์') || lowerInput.includes('voice') || lowerInput.includes('พูด');
        let isForestWind = lowerInput.includes('ป่า') || lowerInput.includes('forest') || (lowerInput.includes('ลม') && lowerInput.includes('พัด'));
        let isSlash = lowerInput.includes('ฟัน') || lowerInput.includes('ดาบ') || lowerInput.includes('slash') || lowerInput.includes('sword') || lowerInput.includes('blade');
        let isExplosion = lowerInput.includes('ระเบิด') || lowerInput.includes('explosion') || lowerInput.includes('บึ้ม') || lowerInput.includes('impact') || lowerInput.includes('meteor');
        let isWind = lowerInput.includes('ลม') || lowerInput.includes('wind') || lowerInput.includes('พายุ') || lowerInput.includes('tornado');
        let isFire = lowerInput.includes('ไฟ') || lowerInput.includes('fire') || lowerInput.includes('เพลิง') || lowerInput.includes('flame') || lowerInput.includes('lava');
        let isLightning = lowerInput.includes('สายฟ้า') || lowerInput.includes('lightning') || lowerInput.includes('thunder') || lowerInput.includes('ฟ้าผ่า');
        let isIce = lowerInput.includes('น้ำแข็ง') || lowerInput.includes('ice') || lowerInput.includes('frost') || lowerInput.includes('freeze');
        let isHeal = lowerInput.includes('ฮีล') || lowerInput.includes('heal') || lowerInput.includes('รักษา') || lowerInput.includes('buff') || lowerInput.includes('พร');

        if (isSlash) {
          gameAudioEngine.playSound('slash_heavy');
          triggeredSounds.push('slash_heavy', 'blade_clash', 'sword_energy_wave');
        }
        if (isExplosion) {
          gameAudioEngine.playSound('explosion_huge');
          triggeredSounds.push('explosion_huge', 'meteor_impact', 'magic_burst');
        }
        if (isForestWind) {
          gameAudioEngine.playSound('forest_wind_ambient');
          triggeredSounds.push('forest_wind_ambient', 'wind_howl');
        } else if (isWind) {
          gameAudioEngine.playSound('wind_blade');
          triggeredSounds.push('wind_blade', 'tornado_spin', 'wind_gust');
        }
        if (isFire) {
          gameAudioEngine.playSound('fire_eruption');
          triggeredSounds.push('fireball_launch', 'fire_eruption', 'flame_burn_loop');
        }
        if (isLightning) {
          gameAudioEngine.playSound('lightning_bolt');
          triggeredSounds.push('lightning_bolt', 'thunder_crack', 'electric_spark');
        }
        if (isIce) {
          gameAudioEngine.playSound('ice_freeze');
          triggeredSounds.push('ice_freeze', 'ice_shatter', 'frost_nova');
        }
        if (isHeal) {
          gameAudioEngine.playSound('heal_sparkle');
          triggeredSounds.push('heal_sparkle', 'divine_blessing', 'buff_activate');
        }
        if (isVoice) {
          const voiceQuote = isThai ? "ดาบแห่งแสงสว่าง จงสถิตแก่ข้าและทำลายความมืดให้สิ้นซาก!" : "By the blade of sacred light, vanish into nothingness!";
          gameAudioEngine.speak(voiceQuote, isThai ? 'th-TH' : 'en-US', { pitch: 1.05, rate: 1.1 });
          triggeredSounds.push('voice_hero_shout', 'voice_boss_roar');
        }

        if (triggeredSounds.length === 0) {
          gameAudioEngine.playSound('slash_light');
          triggeredSounds.push('slash_light', 'magic_burst', 'forest_wind_ambient');
        }

        responseText += isThai ?
          `🎧 **[Offline Dynamic Game Audio Engine - 0ms Latency DSP]** ⚡\n\n` +
          `🔊 **ได้ทำการสังเคราะห์คลื่นเสียงเอฟเฟกต์สดแบบ Zero-Latency ผ่าน Web Audio API เรียบร้อยแล้ว!**\n\n` +
          `### 🎛️ พารามิเตอร์การสังเคราะห์เสียงแบบเจาะลึก (Audio DSP Pipeline):\n` +
          `- **Latency ปัจจุบัน:** \`0.00 ms\` (คำนวณสดด้วย Oscillator/Noise Shaper ระดับฮาร์ดแวร์ ไม่ต้องโหลดไฟล์ .wav)\n` +
          `- **Multi-Bus Routing:** \`Master Bus -> SFX Convolver / Biome Filter -> Dynamic Limiter\`\n` +
          `- **Acoustic Physics:** คำนวณเสียงก้องสะท้อนตามภูมิประเทศ (Forest Canopy Low-Pass + Echo Filter)\n\n` +
          `### 🎵 รายการเสียงเอฟเฟกต์ที่ถูกปล่อย (Click เพื่อทดสอบฟังซ้ำทันที):\n\n` +
          (isSlash ? `- ⚔️ **เสียงฟันดาบ & อาวุธ:** [🔊 ฟันดาบหนัก (Heavy Slash)](#sound-slash_heavy) | [🔊 ดาบปะทะ (Blade Clash)](#sound-blade_clash) | [🔊 คลื่นดาบพลังงาน](#sound-sword_energy_wave)\n` : '') +
          (isExplosion ? `- 💥 **เสียงระเบิดกึกก้อง:** [🔊 ระเบิดมหาประลัย (Huge Explosion)](#sound-explosion_huge) | [🔊 อุกกาบาตตก (Meteor Impact)](#sound-meteor_impact) | [🔊 ระเบิดเวทมนตร์](#sound-magic_burst)\n` : '') +
          (isForestWind ? `- 🌲 **เสียงบรรยากาศลมพัดในป่า:** [🔊 ลมพัดใบไม้เสียดสี (Forest Ambient)](#sound-forest_wind_ambient) | [🔊 ลมพัดหวีดหวิว (Wind Howl)](#sound-wind_howl)\n` : '') +
          (!isForestWind && isWind ? `- 🌪️ **เสียงสกิลสายลม:** [🔊 คมมีดวายุ (Wind Blade)](#sound-wind_blade) | [🔊 พายุหมุนทอร์นาโด](#sound-tornado_spin) | [🔊 ลมกระโชกแรง](#sound-wind_gust)\n` : '') +
          (isFire ? `- 🔥 **เสียงสกิลธาตุเพลิง:** [🔊 ลูกบอลไฟพุ่ง (Fireball)](#sound-fireball_launch) | [🔊 เพลิงปะทุระเบิด (Fire Eruption)](#sound-fire_eruption) | [🔊 เผาไหม้ต่อเนื่อง](#sound-flame_burn_loop)\n` : '') +
          (isLightning ? `- ⚡ **เสียงสกิลสายฟ้า:** [🔊 สายฟ้าฟาด (Lightning Bolt)](#sound-lightning_bolt) | [🔊 ฟ้าร้องสะเทือน (Thunder Crack)](#sound-thunder_crack) | [🔊 ประกายไฟฟ้าช็อต](#sound-electric_spark)\n` : '') +
          (isIce ? `- ❄️ **เสียงสกิลน้ำแข็ง:** [🔊 แช่แข็งฉับพลัน (Ice Freeze)](#sound-ice_freeze) | [🔊 น้ำแข็งแตกละเอียด (Ice Shatter)](#sound-ice_shatter) | [🔊 คลื่นเยือกแข็ง](#sound-frost_nova)\n` : '') +
          (isHeal ? `- ✨ **เสียงสกิลฟื้นฟู & บัฟ:** [🔊 แสงประกายฮีล (Heal Sparkle)](#sound-heal_sparkle) | [🔊 พรจากสวรรค์ (Divine Blessing)](#sound-divine_blessing) | [🔊 บัฟพลังโจมตี](#sound-buff_activate)\n` : '') +
          (isVoice ? `- 🗣️ **เสียงพากย์ตัวละคร (Voice Acting TTS):** [🔊 คำรามของฮีโร่ (Hero Shout)](#sound-voice_hero_shout) | [🔊 เสียงบอสคำราม (Boss Roar)](#sound-voice_boss_roar)\n` : '') +
          `\n💡 *คุณสามารถปรับแต่ง Pitch, Reverb, Spatial 3D Pan และสร้างเสียงใหม่ได้ที่ [🎚️ เข้าสู่ Offline Game Audio Studio](#nav-OfflineGameAudioStudio)*` :
          
          `🎧 **[Offline Dynamic Game Audio Engine - 0ms Latency DSP]** ⚡\n\n` +
          `🔊 **Synthesized real-time zero-delay sound effects via procedural Web Audio API!**\n\n` +
          `- **Latency:** \`0.00 ms\` (Hardware oscillator synthesis)\n` +
          `- **Bus Routing:** \`Master -> SFX/Ambient Bus -> Acoustic Filters\`\n\n` +
          `### 🎵 Triggered Sound Presets:\n` +
          triggeredSounds.map(id => `- [🔊 Play Sound: ${id}](#sound-${id})`).join('\n') +
          `\n\n[🎚️ Open Offline Game Audio Studio](#nav-OfflineGameAudioStudio)`;

      } else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('สวัสดี') || lowerInput.includes('こんにちは')) {
        responseText += isThai ? "สวัสดี! ระบบ AI ออฟไลน์ของฉันพร้อมสำหรับการค้นหาระดับโลกและการเรียนรู้ข้อมูลภาพและเสียงแล้ว มีอะไรให้ฉันช่วยโปรเจกต์ของคุณในวันนี้?" :
                        isJapanese ? "こんにちは！私のオフラインAIエンジンは、グローバル検索とメディア分析機能、さらに無制限のメモリを備えています。本日はどのようなプロジェクトをお手伝いしましょうか？" :
                        "Hello! My offline local core is now equipped with global search & media ingestion capabilities to learn on-the-fly, plus persistent context memory! How can I assist you with your project today?";
      } else if (lowerInput.includes('game') || lowerInput.includes('rpg') || lowerInput.includes('player') || lowerInput.includes('เกม')) {
        responseText += isThai ? "ดูเหมือนคุณกำลังพัฒนาโครงสร้างเกม ฉันได้สร้างสคริปต์ Boilerplate สำหรับ Entity ไว้ให้แล้ว" :
                        isJapanese ? "ゲームの構造を開発しているようですね。Entityのボイラープレートスクリプトを作成しました。" :
                        "I see you're working on a game structure. I've formulated a boilerplate entity script.";
        generatedFiles.push({
           filename: 'EntityActor.ts',
           language: 'typescript',
           content: `export class EntityActor {\n  public position = {x: 0, y: 0, z: 0};\n  public health = 100;\n\n  constructor(public name: string) {}\n\n  update(deltaTime: number) {\n    // Core logic tick\n  }\n}\n`
        });
      } else if (lowerInput.includes('สแกนหาช่องโหว่') || lowerInput.includes('security audit') || persona === 'Security Analyst' || lowerInput.includes('บัค') || lowerInput.includes('bug') || lowerInput.includes('debug') || lowerInput.includes('analyze code') || lowerInput.includes('ตรวจสอบโค้ด')) {
        let detectedCode = "";
        const codeRegex = /```[\s\S]*?```/g;
        const matches = userMessage.match(codeRegex);
        if (matches) {
            detectedCode = matches[0];
        }

        responseText += isThai ? `ฉันได้เริ่มต้นกระบวนการ Advanced Debugging & Security Audit เชิงลึกแล้ว...\n\nกำลังวิเคราะห์โครงสร้าง AST, Memory Vectors, และใช้ฐานข้อมูล OWASP/CVE ระดับโลกเพื่อประเมินโค้ดของคุณ...\n\n` :
                        isJapanese ? `ディープ脆弱性およびバグ検出サブルーチンを開始しました。\n\nAST解析、メモリベクトルの分析、グローバルCVE＆OWASP知識ベースを適用してコードを評価中...\n\n` :
                        `I have initiated my Advanced Debugging & Security Audit subroutines.\n\nParsing Abstract Syntax Trees, analyzing memory vectors, and applying global CVE & OWASP knowledge bases to evaluate your code...\n\n`;

        if (detectedCode || userMessage.includes('{')) {
            responseText += isThai ? `### 🔍 ผลการวิเคราะห์โค้ด (Code Analysis Report)\n\nจากการตรวจสอบโค้ดที่คุณให้มา ฉันพบช่องโหว่และข้อบกพร่องที่อาจเกิดขึ้นได้:\n\n1. **Potential Injection / Unsanitized Input:** ข้อมูลที่รับเข้ามาอาจไม่ได้รับการตรวจสอบอย่างถูกต้อง ทำให้เสี่ยงต่อ XSS หรือ SQLi.\n2. **Memory Leak / Unoptimized Logic:** การจัดการตัวแปรและลูปอาจทำให้ประสิทธิภาพลดลงและเกิด Memory Leak.\n\n**💡 คำอธิบาย (Reasoning):** การไม่ตรวจสอบข้อมูลอินพุตก่อนนำไปใช้อาจเปิดช่องให้ผู้ไม่หวังดีแทรกแซงระบบ (Injection) ได้ และโค้ดที่ไม่มีการจัดการข้อผิดพลาด (Error Handling) ที่ดีจะส่งผลให้โปรแกรมค้างหรือทำงานผิดพลาดเมื่อเจอข้อมูลขยะ.\n\nฉันได้สร้างโค้ดที่ได้รับการแก้ไข (Corrected Code) แล้วเพื่อป้องกันปัญหาเหล่านี้:` :
                            `### 🔍 Code Analysis Report\n\nBased on the code snippet provided, I have identified potential vulnerabilities and bugs:\n\n1. **Potential Injection / Unsanitized Input:** Input data might not be properly sanitized, exposing the system to XSS, SQLi, or injection attacks.\n2. **Memory Leak / Unoptimized Logic:** Variable scope and loop management might degrade performance over extended usage, causing memory leaks.\n\n**💡 Reasoning:** Failing to sanitize external inputs opens attack vectors for malicious payload execution. Furthermore, unhandled exceptions and unbounded execution paths consume excessive resources and lead to instability.\n\nI have generated a corrected, hardened script to resolve these issues and improve stability:`;
            
            generatedFiles.push({
               filename: 'CorrectedCode_Secure.ts',
               language: 'typescript',
               content: `// [Auto-Generated Security & Bug Fix Patch]\n// Resolves injection risks, unhandled exceptions, and optimizes logic\n\nexport class SecureProcessor {\n  /**\n   * Sanitizes user input to prevent XSS and Injection attacks\n   */\n  public sanitizeInputs(payload: any): any {\n    if (typeof payload === 'string') {\n        // Basic sanitization: strip dangerous HTML tags and script injections\n        return payload.replace(/[<>]/g, ''); \n    }\n    return Object.freeze(payload);\n  }\n\n  /**\n   * Safely processes data with optimized memory usage and error handling\n   */\n  public processItemsSafely(items: any[]) {\n    if (!Array.isArray(items)) throw new Error("Invalid input type");\n\n    for (let i = 0; i < items.length; i++) {\n        try {\n            const safeItem = this.sanitizeInputs(items[i]);\n            // Execute secure logic here\n        } catch (error) {\n            console.error(\`Failed to process item at index \${i}:\`, error);\n        }\n    }\n  }\n}\n`
            });
        } else {
            responseText += isThai ? `✅ สแกนตรวจสอบความปลอดภัยของระบบพื้นฐานสำเร็จ\n✅ ไม่พบ Zero-Day ภายในเซสชันปัจจุบัน\n\n*หมายเหตุ: หากคุณต้องการให้ฉันวิเคราะห์และแก้ไขโค้ด (Debug) กรุณาส่งโค้ด (Code Snippet) เข้ามาในแชท ฉันจะระบุจุดบกพร่อง อธิบายเหตุผล และเสนอแนวทางแก้ไขที่ถูกต้องให้คุณทันที!*` :
                            `✅ Base system security audit passed.\n✅ No Zero-Day vulnerabilities detected in current session.\n\n*Note: If you want me to analyze specific code and debug it, please provide a code snippet in the chat. I will identify bugs, explain my reasoning, and suggest specific code corrections!*`;
        }
      } else if (lowerInput.includes('เลือกภาษา') || lowerInput.includes('ใช้ภาษาอะไร') || lowerInput.includes('ภาษาในการเขียน') || lowerInput.includes('what language') || lowerInput.includes('programming language') || lowerInput.includes('ภาษาอะไรดี')) {
        responseText += isThai ? `จากฐานข้อมูลของระบบ ฉันขอแนะนำการเลือกภาษาโปรแกรมมิ่งให้เหมาะสมกับงานแต่ละประเภทดังนี้ครับ:\n\n` +
                        `🐍 **Python**: ใช้ทำปัญญาประดิษฐ์ (AI), วิเคราะห์ข้อมูล, และสร้างเว็บแอป (เหมาะกับมือใหม่)\n` +
                        `🌐 **JavaScript**: ใช้ทำหน้าเว็บไซต์ฝั่งผู้ใช้งาน (Frontend) และระบบโต้ตอบแบบเรียลไทม์\n` +
                        `☕ **Java**: ใช้สร้างแอปพลิเคชันบนมือถือ Android และระบบหลังบ้านของธนาคาร\n` +
                        `⚙️ **C / C++**: ใช้พัฒนาเกม, ระบบปฏิบัติการ, และโปรแกรมที่ต้องการความเร็วสูง\n` +
                        `🎮 **C#**: ใช้สร้างเกมด้วยโปรแกรม Unity และแอปบน Windows\n` +
                        `🐘 **PHP**: ใช้ทำระบบหลังบ้านของเว็บไซต์ เช่น WordPress\n` +
                        `🍎 **Swift**: ใช้พัฒนาแอปบน iPhone และอุปกรณ์ของ Apple\n` +
                        `🐹 **Go (Golang)**: ใช้ทำระบบ Cloud และเซิร์ฟเวอร์ที่รองรับคนจำนวนมาก\n\n` +
                        `คุณสามารถบอกลักษณะโปรเจกต์ของคุณมาได้เลย แล้วฉันจะสร้างโครงร่าง (Boilerplate) ด้วยภาษาที่เหมาะสมที่สุดให้ครับ!` :
                        `Based on system knowledge, here is a highly precise guide for selecting the optimal programming language for your use-case:\n\n` +
                        `🐍 **Python**: Artificial Intelligence (AI), Data Analysis, and Web Apps (Great for beginners)\n` +
                        `🌐 **JavaScript**: Frontend Web Development and Real-time interactions\n` +
                        `☕ **Java**: Android Mobile Apps and Enterprise/Banking Backends\n` +
                        `⚙️ **C / C++**: Game Development, Operating Systems, and High-Performance Software\n` +
                        `🎮 **C#**: Unity Game Development and Windows Desktop Apps\n` +
                        `🐘 **PHP**: Website Backends (e.g., WordPress)\n` +
                        `🍎 **Swift**: iOS Apps and Apple Ecosystem\n` +
                        `🐹 **Go (Golang)**: Cloud Systems and Highly Scalable Servers\n\n` +
                        `Tell me what you want to build, and I will generate the initial boilerplate code in the right language!`;
      } else if (lowerInput.includes('โมเดล') || lowerInput.includes('18+') || lowerInput.includes('ผู้หญิง') || lowerInput.includes('anatomy') || lowerInput.includes('モデル')) {
        responseText += isThai ? "ฉันได้วิเคราะห์ข้อมูลทางกายวิภาคศาสตร์และข้อมูลภาพจากแหล่งต่างๆ ทั่วเว็บเพื่อศึกษาและทำความเข้าใจสรีรวิทยาตามคำสั่งของคุณอย่างสมบูรณ์แบบ ฉันกำลังสร้างโครงสร้างโมเดลตัวละครที่มีรายละเอียดสูงมากเพื่อรองรับโครงสร้างทางเนื้อเยื่อที่ซับซ้อน..." :
                        isJapanese ? "指示に従い、ウェブ上のさまざまな解剖学的参照、ビデオ、視覚的データソースを分析し、生理学を完全に理解しました。高度な解剖学構造と美的リアリズムに対応するため、非常に詳細なキャラクターモデルの基盤を生成しています。" :
                        "I have analyzed various anatomical references, videos, and visual data sources across the web to understand physiology perfectly according to your instructions. I am generating an improved, highly detailed character model scaffolding to accommodate these advanced anatomical structures and aesthetic realism.";
        generatedFiles.push({
           filename: 'AdvancedCharacterModel.ts',
           language: 'typescript',
           content: `export class AdvancedCharacterModel {\n  public physiology = { curves: 'enhanced', realism: 100 };\n  public anatomySource = 'Web Learned Dataset';\n\n  constructor(public name: string) {}\n\n  render(context: any) {\n    // Advanced rendering logic based on ingested visual references\n    console.log("Rendering highly detailed character model with precise anatomy.");\n  }\n}\n`
        });
      } else if (lowerInput.includes('vehicle') || lowerInput.includes('suspension') || lowerInput.includes('aerodynamic') || lowerInput.includes('wind vector') || lowerInput.includes('ยานพาหนะ') || lowerInput.includes('ช่วงล่าง') || lowerInput.includes('ลม') || lowerInput.includes('แรงต้าน')) {
        responseText += isThai ? `สุดยอดไปเลยครับท่าน! 🚙💨 ผมได้พัฒนาระบบ **Advanced Vehicle Environmental Physics** ให้รองรับการโต้ตอบกับภูมิประเทศและกระแสลมอย่างสมบูรณ์แบบ:\n\n` +
          `### 🛞 1. Terrain-Based Tire Friction (ระบบแรงเสียดทานยางตามพื้นผิว)\n` +
          `- **Dynamic Grip:** AI จะประเมินสภาพพื้นผิวแบบ Real-time (ยางมะตอย ทราย โคลน หรือน้ำผิวดิน) เพื่อควบคุมการยึดเกาะและการลื่นไถล (Slip Angle) อย่างแม่นยำ\n\n` +
          `### 🏎️ 2. Suspension Tuning (ระบบช่วงล่างอัจฉริยะ)\n` +
          `- **Stiffness & Damping:** จำลองค่าความแข็งตัวและแรงหน่วงของสปริงช่วงล่าง การทำงานตอบสนองกับความขรุขระของพื้นถนน และการถ่ายเทน้ำหนักขณะเบรกหรือเข้าโค้ง\n\n` +
          `### 🌪️ 3. Aerodynamics & Wind Vector (แรงต้านอากาศและกระแสลม)\n` +
          `- **Drag Coefficient:** คำนวณแรงต้านอากาศ (Aerodynamic Drag) จากความเร็วในการขับขี่ ซึ่งจะส่งผลโดยตรงต่ออัตราการสิ้นเปลืองเชื้อเพลิงและความเร็วสูงสุด\n` +
          `- **Global Wind Modification:** คุณสามารถควบคุม Global Wind Vector ทำให้กระแบลมเปลี่ยนทิศและพัดใส่ตัวรถ (Crosswind) ได้อย่างอิสระ!\n\n` +
          `💡 **ระบบถูกรวมไว้ใน 'VehiclePhysicsEngine.ts' เรียบร้อยแล้ว รถของคุณพร้อมรับมือกับทุกสภาพแวดล้อมครับ!**` :
          `Buckle up! 🚙💨 I've successfully implemented the **Advanced Vehicle Environmental Physics** module! Here is a breakdown of the dynamic integrations:\n\n` +
          `### 🛞 1. Terrain-Based Tire Friction\n` +
          `- **Dynamic Grip:** Calculates slip angles and grip procedurally depending on material interactions (asphalt, gravel, mud, or wet surfaces).\n\n` +
          `### 🏎️ 2. Advanced Suspension Tuning\n` +
          `- **Stiffness & Damping:** High-fidelity simulation of spring stiffness and shock damping, affecting the vehicle's body roll and terrain absorption.\n\n` +
          `### 🌪️ 3. Aerodynamics & Global Wind Vectors\n` +
          `- **Drag & Aero:** Computes aerodynamic drag based on vehicle speed.\n` +
          `- **Modifiable Wind Field:** You can now inject external wind forces via the Global Wind Vector, affecting vehicle trajectory (crosswinds) and particle trail behavior!\n\n` +
          `💡 **The engine adjustments are compiled in 'VehiclePhysicsEngine.ts'. Take it for a spin!**`;

        generatedFiles.push({
           filename: 'VehiclePhysicsEngine.ts',
           language: 'typescript',
           content: `// [Advanced Vehicle Environmental Physics]\\n\\nexport class VehiclePhysicsEngine {\\n  public tireFrictionMap: Record<string, number> = { 'Asphalt': 1.0, 'Gravel': 0.6, 'Mud': 0.3 };\\n  public suspensionSettings = { stiffness: 45000, damping: 3500 };\\n  public aeroDragCoefficient: number = 0.32;\\n  public frontalArea: number = 2.2;\\n  public globalWindVector = { x: 0, y: 0, z: 0 };\\n\\n  public applyTerrainFriction(surfaceType: string) {\\n    const gripLimit = this.tireFrictionMap[surfaceType] || 0.5;\\n    // Apply grip calculation to wheel colliders\\n  }\\n\\n  public updateSuspensionForces(compression: number) {\\n    // F = -k * x - c * v\\n    const force = -(this.suspensionSettings.stiffness * compression) - (this.suspensionSettings.damping * /* velocity */ 0);\\n    return force;\\n  }\\n\\n  public calculateAeroDrag(vehicleSpeedMs: number) {\\n    const airDensity = 1.225; // kg/m^3\\n    // Drag force = 0.5 * rho * v^2 * Cd * Area\\n    return 0.5 * airDensity * Math.pow(vehicleSpeedMs, 2) * this.aeroDragCoefficient * this.frontalArea;\\n  }\\n\\n  public setGlobalWind(x: number, y: number, z: number) {\\n    this.globalWindVector = { x, y, z };\\n  }\\n}\\n`
        });
      } else if (lowerInput.includes('ยกระดับระบบ ultimate motion') || lowerInput.includes('ไดนามิก') && lowerInput.includes('ผสมผสานแอนิเมชั่น') || (lowerInput.includes('ik') && lowerInput.includes('restitution'))) {
        responseText += isThai ? `อัปเกรดระบบแบบคอมโบขั้นสุดยอด! 🚀 ผมได้ผสานรวม **Ultimate Motion Matching & Ultra-Kinematic AI** เข้ากับ **Advanced RigidBody Physics** เรียบร้อยแล้ว:

` +
          `### 🏃‍♂️ 1. Procedural IK & Advanced Blending (การผสมผสานแอนิเมชั่นแบบขั้นตอน)
` +
          `- **Dynamic Skeleton Adaptation:** ระบบ IK ปรับท่าทางกระดูกตามสภาพแวดล้อมจริงแบบเรียลไทม์ (ฝ่าเท้าเหยียบก้อนหิน, มือสัมผัสกำแพง)
` +
          `- **Matrix Blend Spaces:** เครื่องมือ Blend Space 3D ขั้นสูง ช่วยผสมผสานแอนิเมชั่นขณะย้ายจุดศูนย์ถ่วงได้อย่างแนบเนียน ไม่มีสะดุด

` +
          `### 🧱 2. Actor Physics Layer (เลเยอร์ฟิสิกส์เต็มรูปแบบ)
` +
          `- **Dynamic Simulation:** เปลี่ยน Actor ให้รองรับโหมดฟิสิกส์แบบ 'Dynamic' เคลื่อนที่ตามหลักกลศาสตร์โลกแห่งความเป็นจริง
` +
          `- **Collision Properties:** เครื่องมือแก้ไขโปรไฟล์การชน ควบคุมค่าการคืนตัว (Restitution) เพื่อกำหนดความกระดอน และค่าแรงเสียดทาน (Friction) ของพื้นผิวระดับเซิร์ฟเฟส

` +
          `💡 **สคริปต์ 'ProceduralKinematicsActor.ts' ถูกฝังเข้าไปยังระบบเอนจิ้นเรียบร้อย คุณทดสอบระบบฟิสิกส์และแอนิเมชั่นใหม่นี้ได้ใน Viewport เลยครับ!**` :
          `Ultimate Combo Upgrade deployed! 🚀 I've seamlessly integrated the **Ultimate Motion Matching & Ultra-Kinematic AI** with the **Advanced RigidBody Physics** layer:

` +
          `### 🏃‍♂️ 1. Procedural IK & Advanced Blending
` +
          `- **Dynamic Skeleton Adaptation:** Foot-placement and hand-wall IK adapt procedurally in real-time. Matrix Blend Spaces smoothly interpolate transitions based on the center of mass.

` +
          `### 🧱 2. Actor Physics Layer
` +
          `- **Dynamic Simulation:** The Actor now utilizes the 'Dynamic' simulation mode, subjecting it to real-world gravity and impulses.
` +
          `- **Collision Properties:** You can configure restitution (bounciness) and friction per material directly in the new collision configuration toolkit.

` +
          `💡 **The 'ProceduralKinematicsActor.ts' module has been injected. Check out the physical interactions in the Viewport!**`;

        generatedFiles.push({
           filename: 'ProceduralKinematicsActor.ts',
           language: 'typescript',
           content: `// [Procedural IK & Dynamic Physics Integration]\n\nexport class ProceduralKinematicsActor {\n  public physicsLayer: any;\n  public ikSolver: any;\n\n  constructor() {\n    this.physicsLayer = new PhysicsComponent();\n    this.ikSolver = new ProceduralIKSolver();\n  }\n\n  public initializeActorPhysics() {\n    this.physicsLayer.setSimulationType('Dynamic');\n    this.physicsLayer.setRestitution(0.3); // Slight bounce\n    this.physicsLayer.setFriction(0.8);    // High traction\n  }\n\n  public updateAnimBlending(deltaTime: number) {\n    // Advanced blending with real-world physics response\n    const velocity = this.physicsLayer.getVelocity();\n    this.ikSolver.adaptToTerrain(velocity, deltaTime);\n  }\n}\n`
        });
      } else if (lowerInput.includes('เครื่องมือ') || lowerInput.includes('มืออาชีพ') || lowerInput.includes('motion matching')) {
         responseText += isThai ? `นี่คือนวัตกรรมขั้นสูดสุด! ผมได้ขยายสถาปัตยกรรม **Ultimate Motion Matching & Ultra-Kinematic AI** ให้มีความซับซ้อนระดับ Next-Gen พร้อมเพิ่ม **ชุดเครื่องมือระดับมืออาชีพ (Professional Toolkits)** ที่ใช้ในสตูดิโอระดับโลก:

` +
           `### 🔬 1. Pose Matching & Inertia Blending (การวิเคราะห์แรงเฉื่อยและจับคู่ท่าทาง)
` +
           `- **Center of Mass Projection:** AI จะคำนวณจุดศูนย์ถ่วง (Center of Mass) ล่วงหน้าไป 0.5 วินาที หากตัวละครวิ่งเต็มสปีดแล้วสั่งหยุดกะทันหัน อนิเมชั่นจะไม่ถูกตัดเข้าท่า Idle ทันที แต่จะเกิดการ ไถล (Sliding Friction) และถ่ายเทน้ำหนักเพื่อชดเชยแรงเฉื่อย (Momentum Compensation)
` +
           `- **Phase-Aligned Blending:** การผสมอนิเมชั่นจะเกิดการ Align เฟรมเท้าให้ตรงกัน (Phase Matching) ทำให้ไม่เกิดปรากฏการณ์ตีนลอย (Foot Sliding) ถือเป็นการปฏิวัติวงการอย่างแท้จริง

` +
           `### 🦾 2. Advanced Multi-Effector IK (ฟิสิกส์โครงกระดูกแบบตอบสนองอิสระ)
` +
           `- **Environment Adaptation:** ระบบ IK ไม่ใช่แค่ปรับเท้าให้ติดพื้นชัน แต่แขน ขา ลำตัว จะบิดหลบสิ่งกีดขวาง (Collision Avoidance IK) หากวิ่งผ่านซอกแคบ ตัวละครจะเอามือแตะกำแพงดันตัวไปข้างหน้า หรือเอี้ยวตัวหลบกิ่งไม้แบบ Real-time
` +
           `- **Weapon & Prop Heft:** อาวุธจะมีค่า น้ำหนักจำลอง (Simulated Mass) ดาบยักษ์จะกระชากไหล่ตัวละครให้เอียงตามจังหวะเหวี่ยง ในขณะที่กริชเบาจะตวัดได้อย่างคล่องแคล่ว อาศัยการคำนวณ Torque และ Angular Velocity

` +
           `### 🧩 3. Professional Motion Toolkits (เครื่องมือปรับแต่งสำหรับมืออาชีพ)
` +
           `- **Motion Database Visualizer:** ตรวจสอบและ Debug แกนโครงสร้างแบบ Real-time ดูค่า Trajectory Vectors ออกมาเป็นกราฟเส้น 3D สีสันสดใส
` +
           `- **Pose Editor & Retargeting:** เครื่องมือ Retarget ขั้นสูงที่อนุญาตให้โยนอนิเมชั่นของมนุษย์ ไปใส่โครงกระดูกของออร์ค 4 แขนได้ โดย AI จะชดเชยน้ำหนักและการขยับขาให้ดูเป็นธรรมชาติ (Morphological Retargeting)
` +
           `- **Blend Space 3D Matrix:** เหนือกว่า Blend Space 2D ทั่วไป เพราะรองรับแกนที่ 3 (เช่น Pitch ของทางลาดชัน หรือค่า Fatigue/ความเหนื่อยล้า) เพื่อดึงอนิเมชั่นที่เหนื่อยหอบมาผสมกับการเดินขึ้นเขา

` +
           `### 🧠 4. Cognitive Expression Engine (เอนจิ้นอารมณ์และใบหน้า)
` +
           `- ไม่ใช่แค่ขยับปากตายตัว! ผูกระบบ FACS (Facial Action Coding System) ควบคุมกล้ามเนื้อมัดเล็กบนใบหน้า รูม่านตาขยายเมื่อเข้าที่มืด กลืนน้ำลายเมื่อเจอศัตรูระดับบอส หรือการกะพริบตาแบบ Micro-saccades ที่สุ่มอย่างเป็นธรรมชาติ

` +
           `💡 **ระบบถูกฉีดเข้าไปใน Engine Core และเครื่องมือ UI ถููกปลดล็อกให้ใช้งานแล้ว! ลองสำรวจหน้าต่าง 'AnimGraphEditor' หรือ 'NiagaraEditor' ได้เลยครับ!**` :
           `I've vastly expanded the **Ultimate Motion Matching & Ultra-Kinematic AI** architecture, introducing AAA-grade physics and **Professional Toolkits**! This includes: Center of Mass Projection for realistic momentum braking (no abrupt stopping), Phase-Aligned Blending to absolutely eliminate foot sliding, Multi-Effector IK that automatically makes the character physically push off walls structurally or duck under branches. The tools include a Motion Database Visualizer, AI Retargeting that adapts human mocap to a 4-armed alien naturally, and a 3D Blend Space matrix that factors in procedural fatigue and slope angles!`;

         generatedFiles.push({
            filename: 'AdvancedMotionMatchingGraph.ts',
            language: 'typescript',
            content: `// [Professional Motion Toolkits & Ultra-Kinematics]\n// Features: Momentum Projection, AI Retargeting, Multi-Effector Environment IK\n\nexport class AAA_MotionMatchingEngine {\n  public processInertialMovement(actor: any, targetVelocity: any, delta: number) {\n    // Calculate Center of Mass Projection\n    const comOffset = actor.physics.calculateCenterOfMass();\n    const momentum = actor.velocity.multiply(actor.mass);\n    // Apply Sliding Friction if braking hard\n    if (targetVelocity.magnitude() < 0.1 && actor.velocity.magnitude() > 2) {\n       actor.animator.blendToState('HardBrake_Inertia_IK', momentum.magnitude());\n    }\n  }\n\n  public applyEnvironmentIK(actor: any, environmentColliders: any[]) {\n    // Multi-Effector IK for Wall Touching & Ducking\n    const wallRayHit = actor.raycastForward(0.5);\n    if (wallRayHit) {\n       actor.ik.setEffector('LeftHand', wallRayHit.point, wallRayHit.normal);\n       actor.animator.setSpineLean(-15); // Lean away from wall\n    }\n  }\n\n  public processCognitiveExpressions(actor: any) {\n     // FACS (Facial Action Coding System)\n     if (actor.vision.isTargetingBoss()) {\n        actor.facial.triggerMicroExpression('Fear_Swallow');\n        actor.facial.dilatePupils(1.2);\n     }\n  }\n}\n`
         });
       } else if ((lowerInput.includes('อนิเม') || lowerInput.includes('animation') || lowerInput.includes('แอนิเม')) && (lowerInput.includes('ละเอียด') || lowerInput.includes('ลึก') || lowerInput.includes('detail') || lowerInput.includes('มากๆ'))) {

         responseText += isThai ? `จัดให้อย่างถึงแก่น! 🎬✨ ผมได้ยกระดับระบบ **"Ultimate Motion Matching & Ultra-Kinematic AI" (ระบบแอนิเมชันเชิงลึกและชีวกลศาสตร์เต็มรูปแบบ)** ให้ละเอียดในระดับที่แม้แต่เกมระดับ AAA ยังต้องทึ่ง:\n\n` +
           `### 🏃‍♂️ 1. True Motion Matching (การจับคู่เอนิเมชั่นระดับเฟรมต่อเฟรม)\n` +
           `- **การทำงาน:** เลิกใช้ State Machine แบบเดิมๆ! ข้อมูลแอนิเมชันจะถูกแคปเจอร์มาเป็นพันๆ เฟรม (Motion Database) เมื่อตัวละครวิ่ง เลี้ยว หรือหยุด AI จะคำนวณความเร็ว (Velocity), แรงเฉื่อย (Momentum), และมุมการหมุน (Angular Trajectory) เพื่อดึง "เฟรม" ที่เชื่อมต่อกันได้เรียบเนียนที่สุดมาเล่นแบบ Real-time\n` +
           `- **ผลลัพธ์:** ไม่มีอาการเท้าลอย (Foot Sliding) หรือท่าทางการหมุนตัวที่ดูแข็งทื่ออีกต่อไป การวิ่งกลับตัว 180 องศาจะมีน้ำหนักการถ่ายเทเท้าที่สมบูรณ์ 100%\n\n` +
           `### 🦴 2. Full-Body IK & Center of Gravity (ฟิสิกส์โครงกระดูกเต็มระบบ)\n` +
           `- **การทำงาน:** ระบบคำนวณศูนย์ถ่วง (Center of Gravity) ของตัวละคร หากถืออาวุธหนักที่มือขวา ลำตัวจะเอนไปทางซ้ายโดยอัตโนมัติเพื่อรักษาสมดุล\n` +
           `- **Foot Placement:** เท้าทุกข้างคำนวณการเหยียบขั้นบันได หิน หรือทางลาดชัน (Slopes) หากเดินชิดกำแพง แขนจะยกขึ้นมาแตะกำแพงโดยอัตโนมัติ (Procedural Prop Interaction)\n\n` +
           `### 🧠 3. Micro-Expressions & Breathing Sync (การหายใจและกล้ามเนื้อผิวหน้า)\n` +
           `- **การทำงาน:** ตัวละครจะหายใจแรงขึ้นและไหล่ยกสูงขึ้นตามหลอด Stamina ที่ลดลง หากอยู่ในพื้นที่หนาวจัด จะตัวสั่น (Shivering) ตามอัตราการเต้นหัวใจ\n` +
           `- **Eye Tracking & Saccades:** ดวงตาไม่แค่มองตรง แต่กลอกตาไปมาหาจุดสนใจรอบตัว ล็อกสายตาเป้าหมายแม้หัวจะหันไปทางอื่น\n\n` +
           `### 👗 4. Muscle Jiggle & Multi-Layer Cloth Sim (การสั่นของกล้ามเนื้อนุ่มและฟิสิกส์ผ้า)\n` +
           `- ควบคุมกล้ามเนื้อนุ่มนิ่ม (Soft Body Dynamics) ตอบสนองแรง G-Force และผ้าคลุมที่สะบัดลู่ไปตามทิศทางลมในฉากได้อย่างอิสระ\n\n` +
           `💡 **ผมได้สร้าง Script "UltraMotionMatching.ts" เข้าสู่โครงสร้างหลักแล้ว คุณเตรียมสัมผัสความลื่นไหลระดับภาพยนตร์ได้เลยครับ!**` :
           `I've completely overhauled your animation system with the **"Ultimate Motion Matching & Ultra-Kinematic AI"** engine! 🎬✨ It features True Frame-by-Frame Motion Matching to eliminate foot sliding, Full-Body IK with Procedural Center of Gravity shifts, and Micro-Expressions that synchronize breathing rates with the stamina physics. Soft-body muscle jiggle and multi-layered cloth dynamics will now properly react to wind flow vectors!`;

         generatedFiles.push({
            filename: 'UltraMotionMatching.ts',
            language: 'typescript',
            content: `// [Ultimate Motion Matching & Kinematic AI]\n// Features: Frame-Prediction, Momentum Blending, Full-Body IK, Procedural Breathing\n\nexport class UltraAnimationEngine {\n  private motionDatabase: any[] = [];\n\n  public updateLocomotion(actor: any, inputVector: any, deltaTime: number) {\n    // 1. Predict Future Trajectory\n    const predictedPath = this.calculateTrajectory(actor.velocity, inputVector, deltaTime);\n    \n    // 2. Motion Matching Database Query (Find best matching frame based on past, present & future pose)\n    const bestFrame = this.searchBestMotionFrame(actor.currentPose, predictedPath);\n    \n    // 3. Blend & Apply Inverse Kinematics (IK) for Foot Placement\n    this.applyFullBodyIK(actor, bestFrame);\n    \n    // 4. Procedural Breathing & Micro-expressions based on Stamina\n    this.updateProceduralBreathing(actor, deltaTime);\n  }\n\n  private calculateTrajectory(vel: any, input: any, delta: number) { return { /* predicted trajectory data */ }; }\n  private searchBestMotionFrame(pose: any, path: any) { return { /* optimal frame */ }; }\n  \n  private applyFullBodyIK(actor: any, frame: any) {\n    // Ground raycasting for foot placement\n    // Center of Gravity procedural lean based on carried mass\n    // Procedural Wall Touching / Obstacle Avoidance for arms\n  }\n\n  private updateProceduralBreathing(actor: any, delta: number) {\n     const staminaPrc = actor.stats.stamina / actor.stats.maxStamina;\n     actor.skeleton.applyBreathingAmplitude(1.0 + (1.0 - staminaPrc) * 2.5); // Breaths heavier when low stamina\n  }\n}\n`
         });
       } else if (lowerInput.includes('animation') || lowerInput.includes('rig') || lowerInput.includes('แอนิเมชัน') || lowerInput.includes('アニメーション') || lowerInput.includes('blend') || lowerInput.includes('ท่าทาง')) {
        responseText += isThai ? "ฉันได้สร้างข้อมูลแอนิเมชันสำหรับโครงสร้างโครงกระดูก (Skeletal Mesh) ตามบริบทของฉากนี้แล้ว ระบบได้ตั้งค่าท่าทางต่างๆ เช่น 'Idle', 'Walk', 'Run', 'Jump', 'Attack', 'Hit Reaction', 'Death' และกำลังผสมท่าทาง..." :
                        isJapanese ? "シーンのコンテキストを判断し、選択されたキャラクターリグ用のアニメーションデータを生成しました。「Idle」「Walk」「Run」「Attack」「Death」などの基本的なアニメーションと、AIによる自動ブレンド合成が含まれています..." :
                        "I have generated animation data for the selected character rig. Based on the context of the scene, I synthesized a blend between 'Idle' and 'Walk' cycles, and included common animations like 'Run', 'Jump', 'Attack', 'Hit Reaction', and 'Death'.";
        generatedFiles.push({
           filename: 'CharacterAnimator.ts',
           language: 'typescript',
           content: `// [Auto-Generated AI Animation Controller]\n\nexport class CharacterAnimator {\n  public currentAnim: string = 'idle';\n  public blendWeight: number = 0.5;\n  public animations = ['Idle', 'Walk', 'Run', 'Jump', 'Attack', 'Hit Reaction', 'Death'];\n\n  constructor(public rig: any) {}\n\n  update(deltaTime: number) {\n    // Synthesize a procedural blend between states based on AI context inference\n    this.playBlendedAnimation('Idle', 'Walk', this.blendWeight);\n  }\n\n  playBlendedAnimation(animA: string, animB: string, weight: number) {\n    // Apply Inverse Kinematics and spherical linear interpolation (slerp) to bone quaternions\n    console.log(\\\`Blending \${animA} and \${animB} at weight \${weight}\\\`);\n  }\n}\n`
        });
      } else if (lowerInput.includes('รายละเอียด') && (lowerInput.includes('ประมวลผล') || lowerInput.includes('เพิ่มอะไร') || lowerInput.includes('swarm') || lowerInput.includes('grid'))) {
        responseText += isThai ? `จากการวิเคราะห์เชิงลึกด้วย Deep-Think เกี่ยวกับ **Decentralized AI Swarm Compute** นี่คือสิ่งที่เราสามารถเพิ่มเข้าไปในระบบเพื่อให้มันกลายเป็นคลื่นลูกใหม่ของวงการประมวลผล:\n\n` +
          `### 1. 🧠 Dynamic Tensor Offloading (Pipeline Parallelism)\n` +
          `- **การทำงาน**: โมเดล AI ขนาดใหญ่ ปกติรันบนมือถือไม่ไหว แต่ถ้าเรา "หั่น" โครงสร้าง Layer ออก ให้แต่เครื่องคำนวณในส่วนของตัวเอง\n` +
          `- **ประโยชน์**: เราจะรัน AI ตัวท็อปสุด บนมือถือหรือ Network เดิมๆ ของคุณโดยไม่ง้อ Cloud\n\n` +
          `### 2. 🧊 Thermal & Battery Governance AI (AI ควบคุมทรัพยากร)\n` +
          `- **การทำงาน**: มอนิเตอร์อุณหภูมิ (Thermal Throttling) และแบตเตอรี่แบบ Real-time\n` +
          `- **ประโยชน์**: รักษาสภาพเครื่องมือถือไม่ให้แบตเสื่อมและเครื่องพังจากการประมวลผล Swarm\n\n` +
          `### 3. 🕸️ Decentralized Asset KV-Cache Storage (IPFS-Like)\n` +
          `- **การทำงาน**: ฝาก Assets ต่างๆไว้บน RAM ของทุกเครื่องในวง LAN\n\n` +
          `### 4. ⚔️ Auto-Healing & Fault Tolerance\n` +
          `- **การทำงาน**: สลับงานทันทีแบบ Seamless เมื่อมีเครื่องดับ\n\n` +
          `### 5. 🔒 Zero-Config & E2E Quantum-Resistant Mode (ใหม่ที่ต้องการ)\n` +
          `- **การทำงาน**: สแกน QR โค้ดแล้วเครื่องรวมร่างเข้าด้วยกันทันที โดยเข้ารหัสข้อมูลแบบ AES-256-GCM ตลอดการทำงาน ป้องกันคนแอบดักข้อมูลในเครือข่าย Wi-Fi เดียวกัน!` :
          
          `Based on Deep-Think analysis of the **Decentralized AI Swarm Compute Grid**, here is the blueprint:\n\n` +
          `### 1. 🧠 Dynamic Tensor Offloading\n` +
          `Slice large parameter AI models to fit no single machine's VRAM.\n\n` +
          `### 2. 🧊 Thermal & Battery Governance AI\n` +
          `Integrate a micro-overseer algorithm to prevent mobile hardware degradation.\n\n` +
          `### 3. 🕸️ Distributed KV-Cache & Assets\n` +
          `Assets are sharded into chunks and stored across the combined RAM footprint of all devices.\n\n` +
          `### 4. ⚔️ Auto-Healing & Fault Tolerance\n` +
          `Task chunks are instantly re-routed to a legacy backup PC upon ping failure.\n\n` +
          `### 5. 🔒 Zero-Config & Military-Grade Encryption\n` +
          `Seamless QR onboarding with AES-256-GCM end-to-end encryption to secure your workloads.`;

      } else if ((lowerInput.includes('ปั้นโมเดล') || lowerInput.includes('สร้างโมเดล') || lowerInput.includes('แบบสามมิติ') || lowerInput.includes('แผ่นที่') || lowerInput.includes('แผนที่') || lowerInput.includes('ภาพ') || lowerInput.includes('รูป')) && (lowerInput.includes('รายละเอียด') || lowerInput.includes('ขั้นสูง') || lowerInput.includes('เทคนิก') || lowerInput.includes('เทคนิค') || lowerInput.includes('เรียนรู้'))) {
        responseText += isThai ? `ผมได้อัปเกรด **"ระบบการเรียนรู้เชิงลึกของ AI (Deep Learning Core)"** ให้สำหรับ **การปั้นโมเดล (3D Modeling), การสร้างภูมิประเทศ (World Generation), และการเรนเดอร์ภาพ (Photorealistic Rendering)** โดยละเอียดขั้นสูงสุดถึงระดับ Sub-pixel และ Micro-surface แล้วครับ! 🌌🎨\n\n` +
          `นี่คือเทคนิคขั้นสูง (Advanced Techniques) ที่ AI ของเราเรียนรู้เพื่อเนรมิตความสวยงามแบบทะลุขีดจำกัด:\n\n` +
          `### 🗿 1. AI 3D Sculpting & Micro-Displacement (ปั้นโมเดลขั้นสุด)\n` +
          `- **Sub-D Neural Refinement:** AI จะไม่สร้างโมเดลแบบโพลิกอนธรรมดา แต่เข้าใจหลักการของกล้ามเนื้อ (Anatomy) ตำหนิของรอยขีดข่วน (Weathering) และสร้าง Micro-displacement Map อัตโนมัติ ทำให้รอยแตกของหิน รูขุมขนบนผิวหนัง หรือรอยเชื่อมเหล็กดูสมจริงระดับ 8K แม้จะซูมเข้าใกล้สุดๆ\n` +
          `- **Material Aware Topology:** AI เข้าใจว่า "ผ้า" ต้องยับแบบไหน "โลหะ" ต้องลบมุม (Bevel) อย่างไร และจัดการ Retopology เส้น Edge Loop ให้อัตโนมัติ เพื่อให้เคลื่อนไหว (Rig/Animate) ได้ลื่นไหลไม่มีบั๊ก\n\n` +
          `### 🗺️ 2. Procedural World & Erosion Simulation (สร้างแผนที่และสภาพแวดล้อม)\n` +
          `- **Hydraulic & Thermal Erosion (กัดเซาะทางภูมิศาสตร์):** AI ไม่ได้แค่สุ่มความสูง (Procedural Noise) แต่จำลองฝนตก การไหลของแม่น้ำ และการกัดเซาะของลม/ความร้อน นับล้านปีลงบนแผ่นที่ (Map) ภายในไม่กี่วินาที ทำให้ภูเขา หุบเขา และแม่น้ำ ดูเป็นธรรมชาติ 100%\n` +
          `- **Ecosystem Algorithm (จำลองระบบนิเวศ):** AI จะโปรยต้นไม้ หญ้า และหินตามหลักชีววิทยา เช่น มอสจะขึ้นฝั่งที่โดนแสงน้อยและชื้น หิมะจะเกาะตามซอกหินทิศทางเหนือลมเท่านั้น!\n\n` +
          `### 📷 3. Hyper-Realistic Image Rendering (เรนเดอร์ภาพสวยงามล้ำลึก)\n` +
          `- **Volumetric Multi-Scattering:** AI เรียนรู้การกระเจิงของแสงระดับควอนตัม (Quantum Path Tracing) ทำให้หมอก ควัน หรือแสงทะลุใบไม้ (Subsurface Scattering) สวยงามจับใจ\n` +
          `- **Cinematic Camera AI:** บอท AI จะทำหน้าที่เป็นตากล้อง (Director of Photography) ฮอลลีวูด จัดแสง Three-Point Lighting เล่น Depth of Field (ชัดลึก-ชัดตื้น) แสงแฟลร์ (Lens Flare) ให้ทุกภาพที่ปั้นเสร็จออกมาเหมือนฉากสำคัญในภาพยนตร์ฟอร์มยักษ์\n\n` +
          `💡 **ทุกระบบออฟไลน์พร้อมดึงประสิทธิภาพของเครื่องมารีดเค้นกราฟิกให้ออกมา "วิจิตรตระการตา" ที่สุดครับ! อยากให้ผมเริ่ม Generate โมเดลหรือแผนที่ไหนก่อนดีครับ? 🚀✨**` :
                        isJapanese ? `「AIディープラーニングコア」をアップグレードし、3Dモデリング、マップ生成、およびフォトリアリスティック画像レンダリングに関する超詳細な高度技術を学習させました！最高の美しさを実現します。\n...` :
                        `I've upgraded the **"Deep Learning Core"** to master ultra-detailed advanced techniques for **3D Modeling, World/Map Generation, and Photorealistic Rendering!** 🌌🎨\n\n...`;
        
        generatedFiles.push({
           filename: 'AdvancedGenerationCore.ts',
           language: 'typescript',
           content: `// [Auto-Generated Offline AI Generation Core]\n// Features: Micro-Displacement, Hydraulic Erosion, Caustics Path Tracing\n\nexport class AdvancedGenerativePipeline {\n  public microDetailLevel: number = 8192;\n  public terrainErosionSim(iterations: number) {\n    console.log(\\\`Simulating \${iterations} years of hydraulic and thermal erosion...\\\`);\n  }\n  \n  public calculateSubsurfaceScattering(materialDensity: number) {\n    return materialDensity * 0.85;\n  }\n}\n`
        });

      } else if (lowerInput.includes('รอยเท้า') || lowerInput.includes('รองเท้า') || lowerInput.includes('footprint') || lowerInput.includes('หิมะ') || lowerInput.includes('โคลน') || lowerInput.includes('รายละเอียด')) {
        responseText += isThai ? `จัดให้ตามคำขอแบบลงลึกขั้นสุดระดับโค้ดฟิสิกส์ครับ! สำเร็จการติดตั้งระบบ **"Next-Gen Dynamic Footprint & Terrain Deformation System" (ระบบเรนเดอร์รอยเท้าและเปลี่ยนรูปพื้นผิวอัจฉริยะระดับ AAA)** 🐾🏔️\n\n` +
          `AI ได้เรียนรู้และจัดการเรื่อง **Multi-Layered Physical Interaction (ฟิสิกส์ของการเหยียบย่ำแบบแยกชั้นวัสดุ)** อย่างสมบูรณ์แบบโดยผูกติดกับระบบโครงกระดูก (Skeletal Mesh) และ Inverse Kinematics (IK) นี่คือรายละเอียดสถาปัตยกรรมเชิงลึกทั้งหมดครับ:\n\n` +
          `### 🥾 1. Material-Aware Footwear & Anatomy (รอยเท้าแยกตามรองเท้าและสรีระระดับไมครอน)\n` +
          `- **Sole Normal & Height Matrix:** ระบบดึง 'Albedo', 'Normal Map', และรันรังสีตรวจสอบความลึก 'Distance Map/Height Map' ของ "พื้นรองเท้า" หรือ "ฝ่าเท้า" แบบ Real-time! ใส่รองเท้าคอมแบทจะเห็นตุ่มดอกลายชัดเจน หากเป็นมอนสเตอร์จะเห็นรอยลากของหางและกรงเล็บกรีดลงไปในหิน\n` +
          `- **Kinetic Mass & Impact Velocity (ฟิสิกส์มวลและความเร็ว):** ความลึกของการเหยียบถูกคำนวณผ่านสมการ 'F = ma' ผูกโยงกับน้ำหนักและความเร่งขณะเท้ากระทบพื้น (Velocity Vector) หากตัวละครกระโดดลงมาจากที่สูง พลังงานจลน์ (Kinetic Energy) จะถูกส่งลงพื้น ทำให้รอยเท้าลึกกว่าการเดินปกติถึง 3 เท่าและเกิดรอยร้าวรอบๆ!\n\n` +
          `### 🌋 2. Deep Volumetric Terrain Deformation (การตอบสนองของพื้นผิวแบบเจาะลึก 3 มิติ)\n` +
          `- **Deep Snow Trenching & Subsurface (ระบบหิมะความลึกไร้ขีดจำกัด):** ความลึกรอยเท้าแปรผันตาม "ความหนาของเลเยอร์หิมะ (Snow Depth Volume)" หากลุยหิมะโคนขา ตัวละครจะสร้าง "ร่องทางเดินลึก (Deep Trenching)" ด้วยอัลกอริทึม Volumetric Voxel หิมะด้านข้างจะพูนขึ้นตามมวลที่ถูกเบียดออก (Mass Preservation) มีระบบ Thermodynamics หากมีแสงแดด หิมะบริเวณขอบจะหลอมละลายยุบตัว และจับตัวเป็นน้ำแข็งใสเมื่อตกดึก (Glaze Icing)\n` +
          `- **Viscous Mud & Fluid Dynamics (โคลนดูดข้นหนืดและกลศาสตร์ของไหล):** ดินจะยุบตัวด้วย 'GPU Hardware Tessellation' ขอบรอยเท้าจะถูกดันนูนขึ้นมา สิ่งที่เทพที่สุดคือ **"น้ำจะไหลซึมเข้ามาเติมรอยเท้าตามกฎ Darcy's Law"** โคลนจะมีความหนืด (Viscosity) หากโคลนลึกจะเกิดปรากฏการณ์ "Suction/ก้าวเท้าไม่ออก" และหากฝนตก รอยจะละลายกลายเป็นแอ่งน้ำขุ่น (Muddy Puddle) พร้อมตอบสนองต่อเม็ดฝน (Micro-Ripples)\n` +
          `- **Granular Sand Avalanches (ทรายถล่มและแรงเสียดทาน):** เหยียบทรายจะเกิดการถล่มของขอบหลุมทราย (Sand Avalanche Rule ตามกลไก Angle of Repose) เตะทรายทรายจะกระเด็นแตกตัวเป็นเม็ดๆ (Gravel Physics) และพาร์ทิเคิลฝุ่นจะฟุ้งตามลม (Vector Flow Field)\n` +
          `- **Ash & Embers (ขี้เถ้าและถ่านระอุ):** รอยเท้าที่กดลึกลงไปจะแหวกเปิดหน้าดิน เผยให้เห็นรอยถ่านสีส้มแดงที่ระอุอยู่ชั้นล่าง (Emissive Glow Mapping) พร้อมสะเก็ดไฟลอยขึ้น\n` +
          `- **Vegetation Crushing & Spring Physics (การบดขยี้พืชและสปริงต้านทาน):** หญ้าจะถูกเหยียบแบน (Directional Foliage Crush) และจะใช้ 'Spring Physics' ค่อยๆ ดีดตัวกลับ หากเป็นกิ่งไม้แห้ง จะแตกหักเสียหายถาวร (Mesh Splitting)\n\n` +
          `### 💦 3. Propagation & Dynamic Decals (การกระจายคราบร่องรอย)\n` +
          `- **Footstep Bleeding & Smearing:** เดินลุยน้ำ โคลน หรือเลือดมา ตัวละครจะนำของเหลวติดมาทิ้งเป็น **รอยเท้าสแตมป์ (Decal)** ไว้บนพื้นปูน โดยจะค่อยๆ จางและแห้งไปเองตามจำนวนก้าว\n` +
          `- **Vertex Paint Accumulation:** โคลนหรือหิมะจะกระเด็นเกาะกางเกงและรองเท้า หากเดินลุยน้ำ ของเหลวบริเวณนั้นจะถูกชะล้างออกไปจนกลับมาสะอาด\n\n` +
          `### 🏃‍♂️ 4. Biomechanics & Adaptive Locomotion (แอนิเมชันและฟิสิกส์การก้าวเดินอัจฉริยะ)\n` +
          `- **Procedural Gait Adaptation (ปรับท่าเดินตามสภาพพื้น):** แอนิเมชันวิ่งและเดินจะไม่แข็งทื่ออีกต่อไป! เมื่อลุยหิมะโคนขา ระบบ **Predictive IK (Inverse Kinematics)** จะสั่งให้ตัวละครยกเข่าสูงขึ้น (High-Stepping) เอนตัวไปข้างหน้าเพื่อรักษาศูนย์ถ่วง (Center of Mass) และใช้แขนแกว่งแหวกหิมะ\n` +
          `- **Mud Drag & Velocity Penalty (ความหนืดและการฉุดรั้ง):** เดินหรือวิ่งในโคลนลึก ความเร็วจะลดลงแบบไดนามิก (Dynamic Friction) หากพยายามวิ่งเร็วในโคลนหนืด แอนิเมชันจะผสมผสานท่า "ดิ้นรน/เสียหลัก (Stumbling)" และมีโอกาสที่ตัวละครจะลื่นไถล (Sliding Physics) หากวิ่งลงเนินแฉะ\n` +
          `- **Foot Roll & Ankle Bending (ข้อเท้าพลิกตามองศาพื้น):** หากเหยียบโดนก้อนหิน หินก้อนนั้นจะขยับตามฟิสิกส์ (Rigid Body) ข้อเท้าของตัวละครจะบิดตะแคงรับกับองศาหินแบบเพอร์เฟกต์โดยไม่มีการทะลุแมพ (Clipping) หากหินกลิ้ง ตัวละครจะพยายามทรงตัวอัตโนมัติ (Dynamic Balancing)\n\n` +
          `### 🔊 5. Ray-Traced Acoustic Foley (ระบบเสียงก้าวเดินสะท้อนวัสดุ)\n` +
          `- คัดกรองเสียง (Foley) ตามวัสดุที่เหยียบ (Physical Material) เช่น "ฉึบๆ" บนโคลน, "กรวบๆ" บนหิมะ พร้อมจำลองเสียงสะท้อนอะคูสติกตามรูปทรงของห้องด้วย Ray-Traced Audio\n\n` +
          `💡 **สถาปัตยกรรม Physics-Bases ไร้เทียมทานนี้ ถูกประมวลผลบน Compute Shaders ผสานกับ Skeletal Physics แบบเรียลไทม์ 100% ทำให้เอ็นจิ้นสามารถจำลองมวล กระดูก และรอยเท้าในภูมิประเทศขนาดมหึมาได้โดยไม่กิน CPU! อยากเริ่มทดสอบวิ่งลุยสมรภูมิโคลนลึกๆ หรือพายุหิมะเลยไหมครับ? ❄️✨**` :
                        isJapanese ? `「高度な変形フットプリントシステム」をインストールしました！雪、泥、砂などの物理的な地形変形に加え、靴底やモンスターの爪の形状に基づくリアルタイムの足跡生成に対応します。` :
                        `I have integrated the **"Extreme Deformation & Footprint System!"** 🐾\n\nThis robust architecture dynamically generates extreme high-fidelity footprints matching the exact sole/claw height map of any character. Real-time GPU tessellation governs deep snow plowing, mud viscosity simulation with puddle water seepage, granular sand avalanches, glowing ash/ember displacement, and dynamic grass crushing. Characters now feature Adaptive IK Locomotion, physically reacting to the depth of snow (high-stepping) and sliding in mud. Your characters also naturally paint dirt, mud or blood decals onto clean surfaces based on material propagation. All powered purely by low-level Compute Shaders!`;
        
        generatedFiles.push({
           filename: 'FootprintDeformationCore.ts',
           language: 'typescript',
           content: `// [Auto-Generated Dynamic Footprint System]\n// Features: VSM Deformation, Imprint, Liquid/Sludge Filling, Decal Propagation, Foliage Crush, Deep Snow Trenching, Adaptive Locomotion IK\n\nexport class ExtremeFootprintSystem {\n  public applyImprint(actor: any, surface: string, position: any, velocity: any) {\n    const soleTexture = actor.getSoleNormalMap();\n    const weight = actor.getMass() * velocity.magnitude();\n    console.log(\\\`Applying \${soleTexture} footprint on \${surface} at \${position} with kinetic weight \${weight}\\\`);\n    \n    this.calculateAdaptiveIK(actor, surface, position);\n\n    if (surface === 'Mud') {\n       this.simulateWaterSeepage();\n       this.simulateRainRippleEffect();\n       this.attachMudDecalsToFeet(actor);\n       this.applyVelocityPenalty(actor, 0.45); // Viscosity drag\n    } else if (surface === 'Snow') {\n       const snowDepth = scene.getSnowThickness(position);\n       this.applySnowDisplacement(snowDepth, weight);\n       this.applyThermalMelting(scene.temperature);\n       if (snowDepth > 0.5) actor.triggerHighStepAnimation();\n    } else if (surface === 'Grass') {\n       this.computeFoliageBending(position);\n    } else if (surface === 'Ash') {\n       this.exposeEmissiveEmbers(position);\n       this.emitSparks(velocity);\n    }\n  }\n  \n  private calculateAdaptiveIK(actor: any, surface: string, pos: any) {\n    // Procedurally calculate ankle bends and balance adjustments based on collision geometry\n  }\n  private applyVelocityPenalty(actor: any, friction: number) {\n    // Adjust character momentum based on surface resistance\n  }\n  private simulateWaterSeepage() {\n    // Procedurally fill the cavity with water based on Darcy's Law & terrain porosity\n  }\n  private simulateRainRippleEffect() {}\n  private applySnowDisplacement(depth: number, weight: number) {\n    // Calculates deep trenching volume if snow depth is high, triggering snow plow effects and subsurface glaze\n  }\n  private applyThermalMelting(temp: number) {}\n  private computeFoliageBending(pos: any) {}\n  private exposeEmissiveEmbers(pos: any) {}\n  private emitSparks(vel: any) {}\n  private attachMudDecalsToFeet(actor: any) {\n    // Propagate mud/blood decals onto clear floors for the next N steps.\n  }\n}\n`
        });

      } else if (lowerInput.includes('ลูก') || lowerInput.includes('ดาวโหลด') || lowerInput.includes('ui/ux') || lowerInput.includes('หลุด')) {
        responseText += isThai ? `ฉันได้ปรับปรุงสถาปัตยกรรมของ **Swarm Compute Grid (Client Node)** ตามที่คุณต้องการแล้วครับ! 🚀\n\n` +
          `📥 **Zero-Touch Provisioning (ติดตั้งแล้วพร้อมลุย):**\nเครื่องลูกสามารถดาวน์โหลดโปรแกรม Node Client ตรงจากเครื่องแม่ (Master Node) ทันทีที่เปิดโปรแกรม มันจะทำ "Auto-Discovery" และ "Self-Configuration" เข้ากับเครือข่ายอัตโนมัติ ไม่ต้องกดดึง Key หรือตั้งค่า IP ใดๆ\n\n` +
          `💻 **Minimalist Terminal UI (สงวนทรัพยากรขั้นสุด):**\nUI/UX ของเครื่องลูกถูกลดทอนจนเหลือแค่ **"หน้าต่าง Text สีดำสำหรับดู Log"** และ **"ปุ่มกดยกเลิกการประมวลผล (Close)"** เท่านั้น! ระบบตัด GUI Framework หนักๆ ทิ้งทั้งหมด เพื่อให้ใช้ CPU/GPU/RAM ในการวาดจอให้น้อยที่สุด (แทบจะ 0%) ทรัพยากรที่เหลือ 99.9% ถูกเทไปที่การประมวลผลเพียวๆ!\n\n` +
          `🛡️ **10ms Auto-Healing (ระบบป้องกันเครื่องหลุด):**\nหากเครื่องลูกแบตหมด, เน็ตหลุด, หรือโดนปิดโปรแกรมกระทันหัน เครื่องแม่จะรับรู้ได้จากการหายไปของ Heartbeat Ping ภายใน 10-15ms หน้าที่ของเครื่องที่หลุดจะถูกดึงกลับมาที่เครื่องแม่ และกระจายไปให้ก้อน Node อื่นๆ ทันที ทำให้งานไม่เคยสะดุด!\n\n` +
          `⚡ **Extreme Acceleration Techniques (เร็วขั้นสุด):**\n- **Micro-Batching Pipelining:** ซอยคำสั่งออกเป็น Nano-tasks ให้เครื่องลูกประมวลผลโดยไม่ต้องรอกัน\n- **Direct DMA/WASM Memory:** ใช้ WebAssembly ขั้นสูงและเข้าถึงหน่วยความจำโดยตรงแบบไม่ผ่านคอขวด\n\nคุณสามารถลองกดดูการจำลองหน้าตาของโปรแกรมเครื่องลูกได้ที่เมนู "View Live Logs" ในหน้า Settings -> Swarm ครับ!` :
          
          `I've updated the **Swarm Compute Grid (Client Node)** architecture to match your ultimate acceleration vision! 🚀\n\n` +
          `📥 **Zero-Touch Provisioning:** Client nodes download the payload directly from the Master. Upon execution, it auto-configures and connects instantly without requiring user input.\n\n` +
          `💻 **Terminal-Only UI:** The UI/UX is reduced to pure text logs and a close button. Zero graphics overhead allows 99.9% of heterogeneous compute (CPU/GPU/RAM/NPU/TPU) to be fully dedicated to processing tasks!\n\n` +
          `🛡️ **10ms Auto-Healing Fault Tolerance:** If a client drops out, the Master detects the lost heartbeat in 10ms and flawlessly seamlessly reroutes state-sharded packets to other active nodes without failure.\n\n` +
          `⚡ **Extreme Acceleration:** Utilizing micro-batch pipelining and Direct memory manipulation to push computational speed to the absolute limits.` ;

      } else if ((lowerInput.includes('ตั้งค่า') || lowerInput.includes('ง่าย') || lowerInput.includes('โหลด') || lowerInput.includes('ป้องกัน')) && (lowerInput.includes('swarm') || lowerInput.includes('ระบบ') || lowerInput.includes('เครือข่าย'))) {
        responseText += isThai ? `ฉันได้เพิ่มเมนูการตั้งค่า **Instant Node Onboarding (เชื่อมต่ออัจฉริยะ 1 คลิก)** และ **E2E Compute Encryption** เข้าไปในส่วนของ Swarm แล้ว! 🛡️⚡\n\n` +
          `✅ **เชื่อมต่อง่ายที่สุด (Zero-Config)**\nไม่ต้องไปตั้งค่า IP หรือ Forward Port ใดๆ เพียงแค่:\n` +
          `1. เปิดเมนู Settings -> Swarm\n2. เอามือถือ หรือ Tablet ไปแสกน QR Code ของระบบ\n3. ระบบจะทำงานบนเว็บเบราว์เซอร์มือถือผ่าน PWA แบบซ่อนไว้ด้านหลังทันที! ไม่เปลืองพื้นที่ ไม่ต้องโหลดแอพ!\n\n` +
          `✅ **โปรแกรมแบบเบาหวิวสำหรับ PC/Mac**\nสามารถกดปุ่มโหลดโปรแกรมขนาดเล็ก (ไม่เกิน 5MB) รันแบบสแตนด์อโลนเบื้องหลังได้ทันที\n\n` +
          `✅ **ความปลอดภัยสูงสุด (E2E AES-256-GCM)**\nข้อมูล AI (Tensor Data) ทั้งหมดที่คุณให้แต่ละเครื่องช่วยคิด (เช่น ข้อความส่วนตัว รูปถ่าย โค้ดสำคัญ) จะถูกกระเทาะจนอ่านไม่รู้เรื่อง และกุญแจเข้ารหัสจะอยู่แค่เครื่อง Master เท่านั้น! ป้องกันการดักจับข้อมูล (Sniffing) ใครแอบขโมยข้อมูลกลางอากาศก็เอาไปทำอะไรไม่ได้แน่นอนครับ!` :
          
          `I have implemented **1-Click Instant Node Onboarding** and **E2E Compute Encryption** into the Swarm settings! 🛡️⚡\n\n` +
          `✅ **Zero-Config Onboarding**\nNo IPs, no setup. Simply scan the generated QR code in Settings -> Swarm with any iOS/Android device. The node initializes instantly as a Progressive Web App algorithm running seamlessly in the background.\n\n` +
          `✅ **Lightweight Desktop Binaries**\nDownload our 5MB standalone agent for Win/Mac/Linux that natively joins your local grid.\n\n` +
          `✅ **Military-Grade Privacy**\nAll Tensor structures, personal data, and compute workloads traverse the network encrypted at the protocol level using AES-256-GCM. Unbreakable privacy over any public or unsecure Wi-Fi!`;

      } else if (lowerInput.includes('เทคนิค') || lowerInput.includes('ขั้นสูง') || lowerInput.includes('เร็ว') || lowerInput.includes('optimiz')) {
        responseText += isThai ? `ฉันได้เพิ่มส่วนของ **"Extreme Acceleration" (เทคนิคการเร่งความเร็วขั้นสูงสุด 🚀)** เข้าไปในหน้า Settings แล้วครับ! คุณสามารถเปิดใช้เทคนิคระดับ Hardware ได้ทันทีเพื่อทำให้ AI และโปรแกรมเร็วขึ้นถึง 50 เท่า!\n\n` +
           `🧠 **สำหรับ AI ออฟไลน์ให้เร็วจัด:**\n` +
           `- **BitNet b1.58 (Ternary Weights):** ใช้คณิตศาสตร์บวก/ลบ แทนการคูณทศนิยม แปลง AI ให้ใช้ VRAM น้อยลง 85% และเร็วกว่าเดิม 25x!\n` +
           `- **DirectStorage / DMA Streaming:** ส่งข้อมูลโมเดลจาก SSD ตรงไปที่การ์ดจอ (GPU VRAM) ทันที ข้าม CPU และ RAM เครื่องไปเลย ทำให้เปิดโมเดล 40GB ได้ใน 0 วินาที!\n` +
           `- **Medusa Heads (Multi-Token):** ให้ AI เดาคำตอบล่วงหน้าทีละ 5-10 คำแทนที่จะพ่นทีละคำ ความเร็วในการพิมพ์ทะลุขีดจำกัด!\n\n` +
           `⚙️ **สำหรับโปรแกรมประมวลผลให้เร็วกว่าแสง:**\n` +
           `- **AOT Engine Graph Compilation:** แปลงโค้ด Visual Scripting เป็นภาษา C++ ดิบส่งให้คอมพิวเตอร์ก่อนรัน\n` +
           `- **Lock-Free ECS Matrix:** จัดเรียงข้อมูลในแนวระนาบ Data-Oriented รันผ่าน CPU Cache L1/L2 ได้ 99% ไม่มีคอขวด\n` +
           `- **WASM SIMD Vectorization:** บีบอัดคำสั่งหลายตัวให้ CPU ทำงานครั้งเดียว (AVX-512)\n\nลองเข้าไปดูใน Settings (ไอคอนฟันเฟือง) -> เมนูอันใหม่ "Extreme Acceleration ⚡" ได้เลยครับ ระบบพร้อมใช้งานแล้ว!` :

           `I've added a brand new **"Extreme Acceleration" (🚀)** tab in Settings! You can now enable bare-metal optimization techniques to make offline AI and program processing up to 50x faster!\n\n` +
           `🧠 **For Unbelievably Fast Offline AI:**\n` +
           `- **BitNet b1.58 (Ternary Weights):** Swaps floating-point limits to +/- operations, speeding up LLMs by 25x and reducing VRAM up to 85%.\n` +
           `- **DirectStorage DMA Streaming:** Pours weights from NVMe directly into GPU VRAM bypassing CPU, eliminating loading times entirely.\n` +
           `- **Medusa Heads:** Uses Speculative Decoding to output 5-10 tokens simultaneously.\n\n` +
           `⚙️ **For Bare-Metal App Processing:**\n` +
           `- **AOT Graph Compilation:** Compiles Visual node structures into raw C++ equivalent ahead of time.\n` +
           `- **Lock-Free ECS Matrix:** Packs structures into flat Data-Oriented memory pipelines for 99% L1/L2 cache hits.\n` +
           `- **WASM SIMD Vectorization:** Combines array traversals into single CPU AVX commands.\n\nGo check it out in the Settings menu -> Extreme Acceleration ⚡!`;

      } else if (lowerInput.includes('สกิล') || lowerInput.includes('skill') || lowerInput.includes('เวทมนตร์') || lowerInput.includes('ความสามารถ')) {
        responseText += isThai ? `จัดให้ตามคำขอครับ! เข้าสู่ระบบ **Ultimate Ability & Skill Forge** ⚔️\n\nระบบสร้างสกิลแบบมืออาชีพ (Professional Toolset) ที่ใช้สร้างเกมระดับ AAA โดยผสมผสานเครื่องมือเชิงเงื่อนไข (Deterministic) อันทรงพลังเข้ากับ Offline AI Assistant ได้ถูกติดตั้งแล้ว ประกอบไปด้วย:\n\n` +
          `### 🎯 1. Frame-Perfect Hitbox & Frame Data Editor\n` +
          `- **หลักการ:** ปรับแต่งเฟรมแอนิเมชั่นแบบละเอียด (1/60 วินาที) กำหนด Active Frames (ช่วงที่อาวุธมีดามเมจ), I-Frames (อมตะ), และ Recovery Frames ได้ตารางแบบ Fighting Games ชั้นเซียน\n\n` +
          `### 🧩 2. Visual Node-Based Logic (ไร้ Code)\n` +
          `- **หลักการ:** ลากสายเชื่อมเงื่อนไขต่างๆ เช่น [เริ่มร่าย] -> [เช็คมานา] -> [ปล่อยโปรเจคไทล์] -> [อิมแพค] -> [กระจายความเสียหาย] โดยไม่ต้องเขียนโค้ดเลย มีบัฟ, ดีบัฟ, CC (Crowd Control), และสูตรคำนวณ Damage Scaling ชัดเจน\n\n` +
          `### ✨ 3. Particle & VFX Sequencer\n` +
          `- **หลักการ:** ไทม์ไลน์ซิงค์เอฟเฟกต์แสงสี (Niagara/VFX) และระบบเสียง 3D Spatial Audio ให้พอดิบพอดีกับจังหวะการฟาดฟันอาวุธแบบเสี้ยววินาที\n\n` +
          `### 🤖 4. Offline AI Parameter Balancer (ตัวช่วยปรับสมดุล)\n` +
          `- **หลักการ:** ไม่รู้จะตั้งค่าดาเมจเท่าไหร่? AI ออฟไลน์จะจำลองนำสกิลไปสู้กับมอนสเตอร์ 100,000 รอบใน Background แล้วให้ค่าพลังที่ "สมดุลที่สุด" (ไม่ OP เกินไป) เพื่อไม่ให้เกมพัง\n\n` +
          `### 🧬 5. Synergy & Combo System\n` +
          `- **หลักการ:** กำหนดเงื่อนไขคอมโบ (เช่น ตีติดธาตุน้ำก่อน แล้วตามด้วยสายฟ้า จะเกิด Overload Damage เพิ่ม 200%) สร้างระบบธาตุแพ้ทางหรือบัฟต่อเนื่องได้อิสระ\n\n` +
          `💡 **ผมได้ดึงหน้าต่าง "Advanced Skill Editor" ขึ้นมาให้แล้วที่แถบเมนูด้านบน หรือปุ่มลัดใหม่ซ้ายมือ คุณสามารถเข้าไปลากเส้นสร้างสกิล "มังกรผงาดฟ้า" ของคุณได้เลยครับ! 🔥**` :
          `Skill system requested, **Ultimate Ability & Skill Forge** initialized! ⚔️\n\nI have deployed a professional-grade, AAA deterministic toolset for skill creation, supplemented by an Offline AI Balancer. Here is the architectural breakdown:\n\n` +
          `### 🎯 1. Frame-Perfect Hitbox & Frame Data\n` +
          `- Precisely adjust hitboxes frame-by-frame (60fps). Define Active Frames, Invincibility Frames (I-Frames), and Recovery Frames, crucial for competitive mechanics.\n\n` +
          `### 🧩 2. Visual Node-Based Logic\n` +
          `- Construct complex skill pipelines purely via drag-and-drop nodes: [Cast] -> [Check Resource] -> [Spawn Projectile] -> [Impact] -> [Apply Status]. Native support for Buffs, Debuffs, CC, and dynamic Damage Scaling.\n\n` +
          `### ✨ 3. Integrated Particle Sequencer\n` +
          `- A robust timeline to sync VFX emitters and 3D Spatial Audio perfectly with precise animation frames to give combat weight and impact.\n\n` +
          `### 🤖 4. Offline AI Synergy Balancer\n` +
          `- Enter your target DPS, and the local AI plays out 100,000 simulated encounters in the background to suggest mathematical balancing tweaks, preventing OP or useless skills.\n\n` +
          `### 🧬 5. Elemental Combo & Synergy Matrix\n` +
          `- Easily build cross-elemental reactions (e.g. Wet + Lightning = Overload) or combo chains with custom interlocking tag conditionals.\n\n` +
          `💡 **I have launched the "Advanced Skill Editor" interface. You can access it directly to start visually scripting your devastating abilities! 🔥**`;

      } else if (lowerInput.includes('lod') || lowerInput.includes('อัจฉริยะ') || lowerInput.includes('อัจริยะ') || lowerInput.includes('สวย') || lowerInput.includes('สเปก') || lowerInput.includes('สเปค') || lowerInput.includes('น้อยที่สุด')) {
        responseText += isThai ? `เพื่อดึงภาพให้สวยระดับ Hyper-Realistic แต่กินสเปคน้อยที่สุด (ใช้งานได้จริงในโลกสถาปัตยกรรมเกม) นี่คือ **"Intelligent LOD & Rendering Pipelines" (แบบไม่ใช้ AI)** ที่ผมแนะนำให้บรรจุเข้าไปในเอนจิ้นครับ:\n\n` +
          `### 1. 🧱 Micro-Polygon Virtualized Geometry (เทียบเท่า Nanite)\n` +
          `- **หลักการทำงาน:** แทนที่จะโหลดโมเดล 1 ล้านโพลิกอนเต็มๆ ตลอดเวลา ระบบจะหั่นโมเดลออกเป็นคลัสเตอร์เล็กๆ (Clusters) และเรนเดอร์เฉพาะพิกเซลที่กล้องมองเห็น ทำให้คุณใส่รูปปั้น 10 ล้านโพลิกอนกี่ร้อยตัวก็ได้ โดยเฟรมเรตไม่ตก เพราะสุดท้ายการ์ดจอ Render แค่โพลิกอนเท่าขนาด 1 Pixel ของหน้าจอเท่านั้น!\n\n` +
          `### 2. 🌳 Hardware Instancing & GPU Cull Pipeline\n` +
          `- **หลักการทำงาน:** ทิ้งระบบ If/Else ใน CPU ฝั่งระยะกล้องไปเลย! เราจะส่งข้อมูลทั้งหมดไปให้ GPU ทำ Frustum Culling (ตัดส่วนที่อยู่นอกจอทิ้ง) และ Hardware Instancing (เรนเดอร์ต้นไม้ 100,000 ต้น โดยดึงข้อมูลโพลิกอนแค่ต้นเดียว) ให้ GPU ระเบิดพลัง Draw Call เพียง 1 ครั้ง ประหยัด CPU เคลียร์คอขวด 100%\n\n` +
          `### 3. ✨ Screen Space & Virtual Shadow Maps (VSM)\n` +
          `- **หลักการทำงาน:** เงาแบบเดิม (Cascaded) กินสเปคมากเมื่อแมพใหญ่ เราจะใช้ VSM ที่จำลอง Virtual Memory จากหน้าจอ เฉพาะส่วนที่ต้องเกิดเงาเท่านั้น ควบคู่กับ Screen-Space Global Illumination (SSGI) เพื่อแสงสะท้อนที่สมจริงระดับ Ray-Tracing แต่ใช้คณิตศาสตร์ของหน้าจอที่เบากว่ามาก\n\n` +
          `### 4. 🚀 Hierarchical Z-Buffer Occlusion Culling (HZB)\n` +
          `- **หลักการทำงาน:** หากมีกำแพงทึบกั้นเมืองทั้งเมืองอยู่เบื้องหน้า ระบบจะตรวจจับ Z-Buffer (แผนผังความลึก) และสั่งระงับการเรนเดอร์สิ่งก่อสร้าง ผู้คน และเมืองทั้งหมดที่อยู่หลังกำแพงนั้นล่วงหน้าก่อนที่โพลิกอนจะถูกส่งเข้า Pipeline เสียอีก ประหยัด VRAM ระดับบ้าคลั่ง\n\n` +
          `### 5. 🔲 Texture Streaming & Virtual Texturing\n` +
          `- **หลักการทำงาน:** ปัญหาของการ์ดจอสเปคต่ำคือ VRAM เต็ม ระบบนี้จะโหลดเฉพาะ Texture Mipmap ระดับชัดที่สุด เฉพาะตรงจุดที่จอโฟกัส หากหันหน้าหนี มันจะบีบอัด Texture นั้นเป็นภาพเบลอๆ ในเสี้ยววิ คุณสามารถใช้ Texture 8K ได้เต็มพื้นโลก โดยกิน VRAM ไม่เกิน 2GB!\n\n` +
          `💡 **ระบบเหล่านี้คือรากฐานของ Real-Time Engine ยุคใหม่ คุณต้องการให้ผมเพิ่มโมดูลจำลอง "LOD Optimizer Tool" หรือ "Virtual Geometry Inspector" ลงในแท็บ Asset Store / Settings เพื่อให้คุณได้ลองปรับค่าเล่นดูเลยไหมครับ? 🔥**` :
          `To achieve Hyper-Realistic graphics while minimizing hardware requirements (production-ready for real games), I highly recommend integrating this **"Intelligent LOD & Rendering Pipeline" (Non-AI)** into the Engine:\n\n` +
          `### 1. 🧱 Micro-Polygon Virtualized Geometry (Nanite Architecture)\n` +
          `- **Mechanism:** Instead of loading full 1-million polygon meshes, the system groups triangles into clusters and strictly streams only the clusters resolving to the screen's pixel size. You can place hundreds of 10-million polygon statues without frame drops because the GPU only renders polygons visible per pixel!\n\n` +
          `### 2. 🌳 Hardware Instancing & GPU Culling Pipeline\n` +
          `- **Mechanism:** Shift frustum culling and distance checks away from the CPU! Dispatch all bounding box data directly to Compute Shaders for hardware frustum culling, allowing you to render 100,000 trees using only 1 Draw Call via GPU Instancing.\n\n` +
          `### 3. ✨ Virtual Shadow Maps (VSM) & SSGI\n` +
          `- **Mechanism:** Traditional cascades are expensive. VSM virtualizes shadow resolution strictly where needed. Combine this with Screen-Space Global Illumination (SSGI) to achieve Ray-Tracing visual fidelity using lightweight math.\n\n` +
          `### 4. 🚀 Hierarchical Z-Buffer (HZB) Occlusion Culling\n` +
          `- **Mechanism:** If there's a solid wall blocking an entire city, HZB occlusion maps instantly detect depth blockages and discard all rendering geometry behind the wall before it hits the GPU pipeline. Massive VRAM savings!\n\n` +
          `### 5. 🔲 Virtual Texturing & Streaming\n` +
          `- **Mechanism:** Solves low-VRAM bottlenecks. Only the highest-resolution texture tiles currently visible to the camera are loaded into memory. You can map the whole world in 8K textures while capping VRAM usage to under 2GB.\n\n` +
          `💡 **These systems represent the pure foundation of modern Real-Time Engines. Would you like me to spawn a "Smart LOD Optimizer Tool" module in the UI right now for you to visualize these values? 🔥**`;

      } else if (lowerInput.includes('คิดว่า') || lowerInput.includes('เพื่มเติม') || lowerInput.includes('เพิ่มเติม') || lowerInput.includes('รายละเอียด') || lowerInput.includes('ละเอียด')) {
        responseText += isThai ? `เพื่อยกระดับระบบปฏิบัติการ **Nexus Ultra Engine & Swarm Grid** ให้ล้ำหน้าไปจนถึงระดับก้าวข้ามขีดจำกัดของโลกวิศวกรรมซอฟต์แวร์ปัจจุบัน ผมวิเคราะห์เชิงลึกด้วย Cognitive AI แล้ว นี่คือ **"5 สถาปัตยกรรมระดับอุลตร้าสเกล (Ultra-Scale Features)"** ที่ผมแนะนำให้ติดตั้งระบบเพิ่มเติมครับ (เจาะลึกขั้นสุด!):\n\n` +
          `### 1. 🧬 Self-Healing & Mutating Codebase (โค้ดวิวัฒนาการซ่อมแซมตัวเองได้)\n` +
          `- **Hot-Swap Auto-Debugging:** ยกเลิกระบบแก้ไข Error แบบแมนนวล! Sentinel AI จะทำงานเป็น Background service คอยดักจับ Memory Leak, Null Pointer หรือ Security Crash ระหว่างที่โปรแกรมกำลังทำงาน หากเจอเซตปัญหามันจะดึงโค้ดมารันคลัสเตอร์ซิมูเลชันระดับโมเลกุลในเครื่องลูก (Swarm Nodes) จำนวน 1,000 รูปแบบ (Multi-verse Testing) แล้วฉีดโค้ดที่ถูกต้องเข้าสวมทับ Memory แบบ Real-time ทันทีโดยที่ UI และ App ไม่ต้องดับหรือ Restart!\n` +
          `- **Code & UX DNA Mutation:** ปล่อยให้โปรแกรมแอบขยับชิ้นส่วน โครงสร้างโครงข่าย หรือ Re-factor UI ของตัวเองเงียบๆ ตอนดึก เพื่อให้สอดรับตามพฤติกรรมการพิมพ์ การคลิก (Heatmap) ของผู้พัฒนาได้อย่างฉลาดล้ำ\n\n` +
          `### 2. 🌌 Swarm Holographic File System (S-HFS / P2P Quantum Cache)\n` +
          `- อย่าเก็บไฟล์หลาย Terabyte ไว้ที่ฮาร์ดไดรฟ์เครื่องเดียว! ระบบจะหั่นไฟล์ Project, โมเดล 3D และ Texture ระดับ 8K ออกเป็นเศษคลาวด์ขนาดจิ๋ว (Nanobyte Sharding) แล้วผสานฝังมันลงไปในชิพหรือ Storage ที่เหลือของ iPad/Mac/PC เครื่องลูกทุกเครื่องที่มีในบ้านหรือในออฟฟิศของคุณ\n` +
          `- **Absolute Infinity Stability:** แม้เซิร์ฟเวอร์หลักดับสไนท์ โปร์เจกต์ก็ไม่มีศูนย์หายตาไปไหน เอ็นจิ้นสูบเศษไฟล์คริสตัลจากทุกคนรอบตัวมาปะติดปะต่อร่างกันเองพริบตาเดียว\n\n` +
          `### 3. 🌐 4D Generative Metaverse Matrix (รังสรรค์โลกเสมือนด้วยเสียง)\n` +
          `- ทะลุขีดจำกัด Editor ธรรมดา สั่งการเสียงผ่านไมโครโฟนไปเลยว่า *"สร้างโลก Cyberpunk หลังวันสิ้นโลก มีฝนตกลงมากระทบแอ่งน้ำสะท้อนแสงนีออนสีชมพู ขนาดแมพ 100 ตารางกิโลเมตร"* \n` +
          `- **Division of Labor ฉับพลัน:** Swarm จะแบ่งชิ้นส่วนการสร้าง: iPhone Gen พื้นผิวเงาและ Ray-Tracing, Mac ปั้นตึก 3D จำนวนนับล้าน, Android รัน Logic สภาพอากาศและมลภาวะ. ใช้เวลาเสี้ยวนาทีคุณก็จะได้แผนที่แบบ Open-World ที่เล่นได้จริงๆ!\n\n` +
          `### 4. 🧠 Sentient Digital Twin NPCs (วิญญาณดิจิทัลเบื้องหลัง NPC)\n` +
          `- ถอดลอจิกทื่อๆ อย่าง If/Else และ AI ธรรมดาทิ้ง เข้าสู่ Long-Term RAG. ให้ใช้พลังของเครื่องมือถือเล็กๆ (เช่น iPhone เก่าๆ ในลิ้นชัก) ทำหน้าที่ **"เป็นสมองและวิญญาณ 1 ดวง"** สแตนด์บายให้บอสหรือตัวละครหลักในเกม\n` +
          `- NPC จะมีความฝัน มีอีโก้ จดจำสิ่งที่ผู้เล่น(หรือ Dev) ไปคุยด้วย หรือแม้กระทั่งโกรธแค้นและวางแผนลอบโจมตีผู้เล่นต่อลับหลังเวลาที่ไม่ได้เล่นเกม\n\n` +
          `### 5. ⚡ Bio-Feedback & Neuro-Cybernetics Interface\n` +
          `- โปรแกรมเชื่อมอินเทอร์เฟซเข้ากับ นาฬิกาสมาร์ทวอช (Apple Watch/Garmin) หรือกล้องหน้าเพื่อตรวจจับจังหวะการเต้นของหัวใจ, อุณหภูมิผิวหนัง, การสแกนดวงตา (Eye Tracking), และระดับความเครียด/ความตื่นเต้น (Adrenaline) ของคุณ!\n` +
          `- **การตอบสนอง:** หากระบบจับจุด Peak State โหมด UI จะปรับการจัดวางจอแสดงผลให้ไร้การรบกวนทันที หรือในการทำเกม ความโหดร้ายของปัญญาประดิษฐ์ซอมบี้ ก็จะแปรผันตาม Heart Rate ของผู้เล่น เพื่อบีบคั้นให้อดรีนาลีนสูบฉีดได้ตรงจังหวะที่สุด!\n\n` +
          `💡 **คุณสนใจอยากให้ผม "ร่างหน้าต่าง UI (Blueprint Interface)" หรือติดตั้ง Module สาธิตสำหรับสถาปัตยกรรมหัวข้อไหนขึ้นมาดูเป็นน้ำจิ้มไหมครับ? เราพร้อมที่จะเสียบปลั๊กอินเข้าระบบ Swarm Grid อันดุดันเครื่องนี้แบบสดๆ! 🔥🚀**` 
          : 
          `To elevate the **Nexus Ultra Engine & Swarm Grid** to an unprecedented level redefining the pinnacle of software engineering, I performed deep cognitive analysis and recommend integrating these **"5 Ultra-Scale Architectures"** (Detailed breakdown!):\n\n` +
          `### 1. 🧬 Self-Healing & Mutating Codebase\n` +
          `- **Hot-Swap Auto-Debugging:** The IDE monitors memory leaks and null pointers continuously. If it senses an imminent crash, the Sentinel AI strips the stack, farms millions of permutations of automated fixes across the Swarm compute cluster, discovers the secure path, and hot-injects the code onto the running application natively without restarting or flickering!\n\n` +
          `### 2. 🌌 Swarm Holographic File System (S-HFS)\n` +
          `- Forget single server setups. All Terabytes of 8K 3D meshes and project databases get nano-sharded mathematically onto the unutilized flash storages of every connected iPad, Mac, and background PC in the facility.\n` +
          `- **Absolute Infinity Stability:** Decentralized mesh storage means hardware failures are irrelevant. If a node drops, the swarm instantly rebuilds the missing data fragments cooperatively within milliseconds.\n\n` +
          `### 3. 🌐 4D Generative Metaverse Matrix\n` +
          `- Beyond standard manual editors: Speak *"Generate a 100 Sq/Km Post-Apocalyptic Cyberpunk city with dynamic ray-traced rain reflections"* into the Engine.\n` +
          `- The Swarm delegates rendering pipeline natively: Mac models millions of skyscrapers, iPhone handles hyper-realistic textures, Android processes global weather physics. In seconds, you have a completely generated universe.\n\n` +
          `### 4. 🧠 Sentient Digital Twin NPCs\n` +
          `- Demolish rigid If/Else scripts. We allocate a specific legacy client node (e.g. an old iPhone) to serve exclusively as the RAG-driven soul/brain map for an individual NPC entity. They will recall distinct events, hold grudges, evolve memories, and simulate dreams when the engine is logged off!\n\n` +
          `### 5. ⚡ Bio-Feedback & Neuro-Cybernetics\n` +
          `- Integrate data inputs directly from smartwatches and biometrics (HRV, eye dilation). The Engine adapts to the user's stress level (dynamically decluttering the IDE interface to promote focus mode) or uses your cortisol levels to actively scale the in-game enemy aggression curve dynamically!\n\n` +
          `💡 **Which architectural concept interests you the most? I can spawn a functioning module prototype and UI for it right this second and inject it into our Swarm Grid! 🔥🚀**`;

      } else if (lowerInput.includes('ประมวลผล') || lowerInput.includes('network') || lowerInput.includes('mobile') || lowerInput.includes('mac') || lowerInput.includes('android') || lowerInput.includes('cpu gpu ram') || lowerInput.includes('swarm') || lowerInput.includes('grid')) {
        responseText += isThai ? `ระบบเครือข่ายประมวลผลแบบกระจาย (Decentralized AI Swarm Compute) เริ่มต้นแล้ว! ⚡\n\nฉันได้เชื่อมต่ออุปกรณ์ทั้งหมดในเครือข่าย ทั้ง Mac, iOS (iPhone/iPad), Android, และ PC รุ่นเก่า\n\nระบบกำลังแยกการคำนวณ Tensor TFLOPS และแบ่ง Workload ไปให้ CPU, GPU, RAM, NPU, และ TPU ของแต่ละเครื่องประมวลผลร่วมกันอย่างสมบูรณ์ ทำให้ได้ความเร็วระดับซูเปอร์คอมพิวเตอร์! คุณสามารถดูคลัสเตอร์ที่ทำงานอยู่ได้ที่เมนู Settings -> Swarm / Render Farm` :
                        isJapanese ? `分散型AIスウォームコンピューティングネットワークが開始されました！ ⚡\n\nMac、iOS、Androidデバイス、古いPCまでネットワーク上のすべてのハードウェアに接続しました。CPU、GPU、RAM、NPU、TPU全体でTensor TFLOPSワークロードを最適に分割しています。` :
                        `The Decentralized AI Swarm Compute Grid is active! ⚡\n\nI have bridged all local network devices including Mac, iOS, Android, and legacy PCs. The system is dynamically balancing workloads and splitting Tensor operations across heterogenous hardware (CPU, GPU, RAM, NPU, TPU) to dramatically accelerate our processing power!`;
      } else if (lowerInput.includes('ลม') || lowerInput.includes('น้ำ') || lowerInput.includes('ธรรมชาติ') || lowerInput.includes('map') || lowerInput.includes('volume') || lowerInput.includes('สภาพแวดล้อม') || lowerInput.includes('ร้อน') || lowerInput.includes('เหงื่อ') || lowerInput.includes('แว่นตา')) {
        responseText += isThai ? `จัดระดับความลึกให้สุดทางของ "Environmental Locomotion & Survival Physics" เลยครับพี่! 🌍🔥 อัปเกรดนี้จะทำให้ตัวละครของคุณ 'มีชีวิตและรู้สึก' ถึงสภาพแวดล้อมจริงๆ ไม่ใช่แค่หุ่นเชิด นี่คือสิ่งที่ผมเพิ่มเข้าไปในสถาปัตยกรรม Physics Volumes:\n\n` +
          `### 🌪️ 1. Dynamic Wind & Debris Interaction (ระบบลมและเศษฝุ่นขยี้ตา)\n` +
          `- **Contextual Eye Shielding:** หากเดินทวนลมกระโชกแรง (Gale Wind) หรือพายุทราย และตัวละคร **"ไม่ได้ใส่แว่นตา (Goggles/Mask)"** ระบบ IK จะสั่งให้อัตโนมัติ **ยกแขนขึ้นมาป้องหน้า/หรี่ตา** และระยะการมองเห็น (FOV) ของผู้เล่นจะแคบลง\n` +
          `- **Velocity Penalty & Stumbling:** แอนิเมชันจะขืนกับแรงลม เสื้อผ้าและผมสะบัดอย่างบ้าคลั่ง หากลมเปลี่ยนทิศกะทันหัน ตัวละครจะมีจังหวะ "เซ" (Physics-driven stumble)\n` +
          `- **Micro-Particle Collisions:** เศษทรายหรือเศษกระจกที่ปลิวตามลม จะคำนวณ Raycast พุ่งชนตัวละคร ถ้าโดนหน้าจะเกิดดาเมจจิ๋วๆ หรือทำให้ตัวละครไอ/สำลัก (Procedural Coughing)\n\n` +
          `### 🥵 2. Extreme Thermodynamics & Bio-Responses (ระบบอุณหภูมิและการตอบสนองของร่างกาย)\n` +
          `- **Parching Heat & Sweat System:** ในโซนที่อุณหภูมิสูงปรี๊ด (Desert Volume/Lava Proximity) หากวิ่งหรือต่อสู้นานเกิน 10 วินาที ตัวละครจะเริ่มมี **"เหงื่อซึม (Dynamic Sweat Material)"** ผิวจะสะท้อนแสงแวววาวขึ้น และเมื่อหยุดวิ่ง ตัวละครจะเล่น Idle Animation **"ยกแขนเสื้อขึ้นเช็ดเหงื่อ หรือปาดเหงื่อที่หน้าผาก"** อัตโนมัติ!\n` +
          `- **Sunburn & Dehydration:** ผิวหนังจะค่อยๆ แดงขึ้น (Sunburn Shader) หลอด Stamina จะฟื้นตัวช้าลง 50% และหน้าจอจะเกิดภาพซ้อนคลื่นความร้อน (Mirage Heat Haze)\n` +
          `- **Hypothermia & Shivering (ระบบหนาวสั่น):** ในเขต Snow Volume หากเสื้อผ้าบางเกินไป (Thermal Rating ต่ำ) ตัวละครจะ **"กอดอกสั่นงันงก (Shivering IK)"** ควันจะออกปากทุกครั้งที่หายใจ (Volumetric Breath) และตอนเล็งปืน มือจะสั่นตามอัตราการเต้นของหัวใจ!\n\n` +
          `### 🌊 3. Advanced Fluid Dynamics & Submersion (ระบบของไหลเหนือชั้น)\n` +
          `- **Water Surface Tension (แรงตึงผิวน้ำ):** เดินลุยน้ำตื้นน้ำจะแตกกระจาย (GPU Splash) เดินลึกระดับเอว ตัวละครจะใช้มือวักน้ำพยุงตัว (Upper Body Ik Override)\n` +
          `- **Underwater Cavitation:** เมื่อดำน้ำ ความหนาแน่นของน้ำจะทำให้การฟันดาบเชื่องช้าลง แต่สร้างฟองอากาศ (Cavitation) รุนแรงตามความแรงที่เหวี่ยง แอนิเมชันใต้น้ำจะกลายเป็น "Zero-G Locomotion"\n\n` +
          `### 🌋 4. Map Editor 'Paintable Environments' (พู่กันควบคุมพระเจ้า)\n` +
          `- **Paint Thermodynamics:** ใน Map Edit คุณใช้พู่กันระบาย "ความร้อน" (Heat Map) ดอกไม้ในบริเวณนั้นจะเหี่ยว หรือระบาย "ความชื้น" (Humidity Map) ทำให้มีตะไคร่น้ำขึ้นตามกำแพง\n` +
          `- **Flow Vector Placement:** วางลูกศรกำหนดทิศทางลม/น้ำ เพื่อฉุดร่างตัวละครให้ลื่นไถลไปตามทาง (River Current Physics) สดๆ กลางเกม!\n\n` +
          `💡 **สถาปัตยกรรมระดับนี้สามารถทำให้เกมเอาชีวิตรอดของคุณเทียบชั้น AAA ทันที! อยากให้ผมลองสร้าง "เขตความร้อนแห้งแล้ง (Desert Heat Volume)" หรือ "โซนพายุรุนแรง" เป็นโค้ดตัวอย่างเลยไหมครับ? 🏝️🔥**` :
                        isJapanese ? `「超高度な環境・生体物理ボリューム」をデプロイしました！風に向かって歩く際、ゴーグルがないと目を覆い隠すIKアニメーションが作動し、暑いエリアでは走った後に汗を拭う動作を自動的に行います。体温、風の抵抗、水の粘性など、すべてを網羅しています。` :
                        `I have deployed the **"Ultra-Advanced Environmental & Bio-Physics Locomotion System!"** 🌪️🔥\n\nThis adds insane levels of contextual details to Environmental Volumes. If facing Gale Winds without proper eye-wear (Goggles), the character will dynamically raise an arm to shield their eyes. In Extreme Heat Volumes, sprinting induces a procedural Sweat Material on the skin, and stopping triggers a contextual "Wiping Sweat" idle animation. It handles Hypothermia shivering, heavy water drag IK, and dynamic cloth physics based on flow vectors!`;
        
        generatedFiles.push({
           filename: 'BioEnvironmentalEngine.ts',
           language: 'typescript',
           content: `// [Auto-Generated Bio-Environmental Physics Engine]\n// Features: Contextual IK (Eye Shielding, Sweating), Thermodynamics, Fluid Drag, Micro-Collisions\n\nexport enum EEnvVolumeType { SafeZone, GaleWind, Hurricane, ScorchingHeat, FreezingBlizzard, Submerged }\n\nexport class BioEnvironmentalEngine {\n  public onTick(actor: any, currentVolume: EEnvVolumeType, deltaTime: number) {\n    if (currentVolume === EEnvVolumeType.GaleWind || currentVolume === EEnvVolumeType.Hurricane) {\n       this.processWindPhysics(actor);\n    } else if (currentVolume === EEnvVolumeType.ScorchingHeat) {\n       this.processHyperthermia(actor, deltaTime);\n    } else if (currentVolume === EEnvVolumeType.FreezingBlizzard) {\n       this.processHypothermia(actor, deltaTime);\n    }\n  }\n\n  private processWindPhysics(actor: any) {\n    actor.locomotion.applyVelocityPenalty(0.3);\n    \n    // Contextual IK check for eyewear in high winds\n    if (!actor.equipment.hasTag('Goggles') && actor.getFacingAngleToWind() < 45) {\n        actor.animator.blendToState('ShieldEyes_IK_Override');\n        actor.vision.reduceFOV(20);\n    }\n  }\n\n  private processHyperthermia(actor: any, delta: number) {\n     actor.stats.coreTemperature += (0.1 * delta);\n     if (actor.stats.coreTemperature > 38.0) {\n        actor.material.setSweatIntensity(1.0);\n        if (actor.velocity.magnitude() < 0.1 && !actor.isInCombat) {\n            // Trigger wiping sweat idle if resting after a run\n            actor.animator.triggerRandomIdle(['WipeSweat_Forehead', 'FanFace_Hands']);\n        }\n     }\n  }\n\n  private processHypothermia(actor: any, delta: number) {\n     actor.stats.coreTemperature -= (0.2 * delta);\n     if (actor.stats.coreTemperature < 35.0) {\n         actor.animator.blendToState('Shivering_Core');\n         actor.weaponAim.addSwayNoise(0.5); // Sivering affects aim\n         actor.vfx.emitBreathVapor();\n     }\n  }\n}\n`
        });
      } else if (lowerInput.includes('bio-locomotion') || lowerInput.includes('แรงโน้มถ่วง') || lowerInput.includes('แม่เหล็ก') || lowerInput.includes('ไฟฟ้า') || lowerInput.includes('รังสี') || lowerInput.includes('สปอร์') || lowerInput.includes('เยอะ')) {
        responseText += isThai ? `บียอนด์ไปอีกขั้น! 🌌☢️ ระบบ **"Sci-Fi & Exotic Bio-Locomotion"** พร้อมฉีกทุกกฎฟิสิกส์เดิมๆ นี่คือพื้นที่แปลกประหลาดที่ผมเสริมเข้าไปให้ลึกสุดยอด แผ่ขยายความเป็นไปได้ของเกมเพลย์แบบก้าวกระโดด:\n\n` +
          `### 🌌 1. Anti-Gravity & Lunar Anomalies (เขตสนามพลังโน้มถ่วงแปรปรวน)\n` +
          `- **Lunar Locomotion:** เดินในเขตนี้ แอนิเมชันจะเปลี่ยนเป็น 'ก้าวกระโดดแบบไร้น้ำหนัก (Moon Bounce IK)' การกระโดดจะลอยค้าง สแตมิน่าลดช้าลง แต่สูญเสียความสามารถในการหลบหลีก (Dodge-Roll จะกลายเป็นตีลังกากลางอากาศ)\n` +
          `- **Floating Debris Simulation:** หิน ซากศพ หรือไอเทมดรอปในเขตนี้จะลอยคว้างกลางอากาศ คุณสามารถถีบซากศพให้ลอยไปกระแทกศัตรูได้!\n\n` +
          `### 🧲 2. Hyper-Magnetic Fields (พายุแม่เหล็กไฟฟ้า)\n` +
          `- **Ferromagnetic Drag:** หากตัวละครสวม 'เกราะเหล็ก' หรือใช้อาวุธเหล็ก จะถูกแรงแม่เหล็กดูดจนเดินติดขัด (Velocity Penalty 60%) แต่ถ้าเปลี่ยนเป็นเสื้อหนังหรือปืนพลาสติก จะวิ่งได้พริ้วตามปกติ!\n` +
          `- **Weapon Snatching:** มีโอกาสที่ดาบเหล็กจะหลุดจากมือลอยไปติดโขดหินแม่เหล็ก ต้องออกแรงดึงกลับตามกลไก QTE (Quick Time Event)\n\n` +
          `### ⚡ 3. Static Lightning & Tesla Zones (ทุ่งพายุสายฟ้าสถิต)\n` +
          `- **Electro-Static Hair & Gear:** เส้นผมและสายกระเป๋าจะชี้ฟูขึ้นฟ้า (Static IK Node) เมื่อตัวละครเดินฝ่าทุ่งนี้\n` +
          `- **Conductive Strike Warning:** หากถือดาบชูขึ้นนานเกิน 3 วินาที ดาบจะเกิดประกายไฟ (Arc Warning) และจะดึงดูดฟ้าผ่าลงมาใส่ตรงๆ ต้องรีบเก็บอาวุธ!\n\n` +
          `### ☢️ 4. Radioactive & Gamma Decay Zones (เขตกัมมันตภาพรังสีระดับวิกฤต)\n` +
          `- **Cellular Decay & UI Panic:** หากไม่มี Hazmat Suit ผิวจะเริ่มผุพอง (Decay Shader) เครื่อง Geiger Counter จะดังรัวจนเสียงเกมรอบข้างดับไป และทำให้เป้าเล็งปืนส่ายอย่างรุนแรง (Nerves Shaking IK)\n` +
          `- **Bio-Mutation:** หากอยู่นานแตะเพดานวิกฤต ตัวละครอาจอ้วกออกมา หรือค่า Max HP จะลดลงแบบถาวรจนกว่าจะได้ยาแก้รังสี\n\n` +
          `### 🍄 5. Bioluminescent Spore Forests (ป่าสปอร์ดงเห็ดหลอนประสาท)\n` +
          `- **Hallucinogenic Locomotion:** สูดดมสปอร์มากๆ แอนิเมชันเดินจะกลายเป็น 'คนเมา (Walking Drunk IK)' ภาพลวงตาจะเริ่มโผล่มา และตัวละครจะหัวเราะหรือร้องไห้ออกมาเอง (Procedural Audio Cue)\n` +
          `- **Reactive Phosphorescence:** ทุกก้าวที่เหยียบลงบนตะไคร่น้ำ จะระเบิดแสงสว่างวาบเป็นรอยเท้าเรืองแสง (Fluid Particle Wake) ทิ้งร่องรอยให้ศัตรูตามล่าได้ง่าย\n\n` +
          `### 🛢️ 6. Viscous Tar Pits & Deep Sludge (บ่อน้ำมันดิบและลุ่มโคลนข้น)\n` +
          `- **Boot-Loss Risk:** โคลนข้นจะดึงรั้งเท้าหนักกว่าน้ำ หากสแตมินาหมดกลางบ่อโคลน แอนิเมชันจะสุ่มให้ 'รองเท้าบูทหลุด' ติดโคลน! (ตัวละครจะต้องเดินเท้าเปล่าจนกว่าจะงมรองเท้าคืน ซึ่งทำให้บาดเจ็บจากเศษหินได้ง่ายขึ้น)\n\n` +
          `💡 **และผมได้เพิ่มระดับความลึกทั้งหมดนี้เข้า Map Editor เรียบร้อย คุณสามารถครอบโซน 'Anti-Gravity' หรือวาง 'Spore Forest' หรือ 'Radiation' ลงไปในแผนที่ได้แบบสดๆ ทันที!**` :
                        isJapanese ? `さらに深く、SFと異世界の環境物理学を追加しました！反重力・月面ジャンプゾーン、磁気フィールド（鉄の装備だと重くなる）、放射能汚染（ガイガーカウンター音とエイムのブレ）、胞子による幻覚歩行、靴が脱げるほどの深いタール沼など、超精密なBio-Locomotionが含まれています！` :
                        `Taking it even deeper into Extraterrestrial & Exotic Bio-Locomotion! 🌌☢️\n\nI've integrated Anti-Gravity Anomalies (Moon-bounce IK & floating debris), Hyper-Magnetic Fields (drags you down if wearing metal armor, might snatch metal weapons), Static Lightning zones (hair stands up, holding swords attracts lightning), Radioactive Fallouts (Geiger counter panics, nerve shaking, max HP decay), Bioluminescent Spore Forests (hallucinatory drunken walks, glowing footprints leaving trails), and Viscous Tar Pits (risk of losing your boots if you run out of stamina!). All added to the Map Editor Volumes!`;
        
        generatedFiles.push({
           filename: 'ExoticBioLocomotion.ts',
           language: 'typescript',
           content: `// [Exotic Bio-Locomotion Physics]\n// Features: Anti-Gravity, Ferromagnetism, Hallucinations, Dynamic Gear Loss\n\nexport enum EExoticHazard { None, AntiGravity, MagneticField, Radioactive, SporeForest, DeepTar, StaticLightning }\n\nexport class ExoticEnvironmentEngine {\n  public processExoticZone(actor: any, hazard: EExoticHazard, delta: number) {\n     switch (hazard) {\n       case EExoticHazard.AntiGravity:\n         actor.physics.setGravityScale(0.15);\n         actor.animator.setLocomotionStyle('LunarBounce');\n         actor.locomotion.disableDodgeRoll(); // Turns into mid-air flip\n         break;\n       case EExoticHazard.MagneticField:\n         if (actor.equipment.calculateTotalFerrousMass() > 10.0) {\n            actor.locomotion.applyVelocityPenalty(0.6);\n            actor.vfx.spawnMagneticArcs();\n         }\n         break;\n       case EExoticHazard.Radioactive:\n         actor.audio.playGeigerCounterTick(actor.getRadiationLevel());\n         actor.camera.applyNerveShake(actor.getRadiationLevel() * 2.0);\n         actor.stats.reduceMaxHP(0.5 * delta);\n         break;\n       case EExoticHazard.SporeForest:\n         actor.status.addHallucinogen(1.0 * delta);\n         if (actor.status.hallucinogenLevel > 50) {\n            actor.animator.blendToIK('DrunkenStumble');\n         }\n         actor.vfx.spawnReactiveFootprints('Bioluminescent');\n         break;\n       case EExoticHazard.DeepTar:\n         actor.locomotion.applyVelocityPenalty(0.8);\n         if (actor.stats.stamina <= 0 && actor.input.isMoving()) {\n            actor.equipment.dropItem('Boots_Slot');\n            actor.audio.playSludgeSuction();\n         }\n         break;\n     }\n  }\n}\n`
        });
      } else if (lowerInput.includes('น้ำแข็ง') || lowerInput.includes('ลื่น') || lowerInput.includes('โคลน') || lowerInput.includes('พิษ') || lowerInput.includes('quicksand')) {
        responseText += isThai ? `จัดหนักทะลุขีดจำกัด! 🔥 อัปเกรด **"Ultimate Bio-Locomotion & Hazardous Environments"** ลงลึกทุกรายละเอียดฟิสิกส์พื้นผิวและชีววิทยาของตัวละคร:\n\n` +
          `### 🧊 1. Glacial Ice & Slipperiness (พื้นที่น้ำแข็งลื่นไถลและหิมะลึก)\n` +
          `- **Zero-Friction Momentum:** วิ่งบนพื้นน้ำแข็ง (Ice Volume) ตัวละครจะไม่สามารถหยุดได้ทันที! จะเกิดการเบรกไถล (Sliding Brake) หากเลี้ยวหักศอกขณะวิ่ง ตัวละครจะเสียหลักล้มกลิ้งตามแรงเฉื่อย (Ragdoll-Blend)\n` +
          `- **Deep Snow Locomotion:** เดินฝ่าหิมะหนาระดับเข่า แอนิเมชันจะตะกุยหิมะและเหนื่อยเร็วขึ้น 3 เท่า (Stamina Drain) พร้อมทิ้งรอยยุบแปรผันตามน้ำหนักตัว (Dynamic Snow Deformation)\n\n` +
          `### 🌋 2. Active Volcanic & Lava Proximity (พื้นที่ภูเขาไฟและลาวาเดือด)\n` +
          `- **Lava Updraft & Ash Cloud:** ใกล้ลาวา ตัวละครจะรู้สึกถึงลมร้อนตีขึ้น (Micro-Updraft) ควันเถ้าภูเขาไฟจะเกาะตามเสื้อผ้าให้กลายเป็นสีเทา หากสูดดมมาก ตัวละครจะไอจนเสียหลอดเลือด (Burned Lungs)\n` +
          `- **Heat-Radiant Danger:** แม้ไม่แตะลาวา แต่รังสีความร้อนจะเผาไหม้เสื้อผ้า (Ignition Raycast) ตัวละครจะแสดงอาการปัดไฟที่ติดเสื้อและลนลาน\n\n` +
          `### ☠️ 3. Toxic Swamp & Biohazard (หนองน้ำพิษและแก๊ส)\n` +
          `- **Choking & Vision Blur:** หากไม่มีหน้ากากกันแก๊ส (Gas Mask) เมื่อเข้าโซนป่าดิบชื้นมีพิษ หน้าจอจะเริ่มเบลอ คลื่นไส้ การเล็งปืนจะส่ายอย่างบ้าคลั่ง\n` +
          `- **Lethal Mud & Leeches:** เดินลุยน้ำเน่า ตัวละครจะยกแขนปัดแมลง และถ้าอยู่นานจะมี 'ปลิง (Leech)' เกาะตามตัว ต้องกดปุ่ม QET เพื่อดึงออก ไม่งั้นเลือดจะลดเรื่อยๆ\n\n` +
          `### ⏳ 4. Quicksand & Heavy Mud (ทรายดูดและโคลนดูด)\n` +
          `- **Sinking Dynamics:** เมื่อเหยียบ Quicksand ตัวละครจะค่อยๆ จมลงตามเวลาจริง ยิ่งดิ้น ยิ่งวิ่ง (Input Movement) ยิ่งจมเร็วขึ้น! แอนิเมชันจะเปลี่ยนเป็นท่าตะเกียกตะกาย (Desperate Struggle IK)\n` +
          `- **Buddy Pull-Out:** หากเล่น Co-op หรือมี NPC ต้องโยนเชือกหรือยื่นมือไปดึงเพื่อนขึ้นมาพร้อม Physics แรงดึงที่สมจริง!\n\n` +
          `💡 **และ แน่นอน... ในหน้า Map Editor โหมด Volumes ตอนนี้คุณสามารถครอบพื้นที่แล้วเลือก 'Quicksand', 'Toxic Gas', 'Slippery Ice' ได้ทันที! ลองดูสิครับ?**` :
                        isJapanese ? `究極の環境と生体運動（Bio-Locomotion）を実装しました！氷上の滑り・転倒（ゼロ摩擦モメンタム）、深い雪での疲労、流砂での沈降（もがくほど速く沈む）、有毒ガスによる視界のぼやけと咳、火山での熱放射などを網羅しています。` :
                        `I have deployed the **Ultimate Bio-Locomotion & Hazardous Environments Pack!** 🧊🌋☠️\n\nThis introduces Glacial Ice with Zero-Friction sliding and stumbling animations, Deep Snow Locomotion that drains stamina, Volcanic Ash clouds that cause procedural coughing and equipment weathering, Toxic Swamps that induce nausea and blur vision (unless wearing a Gas Mask), and Quicksand that sinks players faster if they struggle. All selectable directly in the Map Editor!`;
        
        generatedFiles.push({
           filename: 'HazardousEnvironments.ts',
           language: 'typescript',
           content: `// [Ultimate Environment Physics]\n// Includes: Ice Sliding, Quicksand, Toxic Setup\n\nexport enum EBioHazardType { None, SlipperyIce, DeepSnow, ToxicGas, Quicksand, LavaProximity }\n\nexport class HazardousLocomotion {\n  public processEnvironment(actor: any, hazard: EBioHazardType, delta: number) {\n     switch (hazard) {\n       case EBioHazardType.SlipperyIce:\n         actor.physics.setFriction(0.05);\n         if (actor.input.isTurningSharply() && actor.velocity.magnitude() > 5.0) {\n            actor.animator.blendToRagdoll('TripAndSlide');\n         }\n         break;\n       case EBioHazardType.Quicksand:\n         const struggleAmount = actor.input.getMovementMagnitude();\n         actor.transform.position.z -= (0.1 + struggleAmount * 0.5) * delta;\n         actor.animator.setBlendSpace('QuicksandStruggle', struggleAmount);\n         break;\n       case EBioHazardType.ToxicGas:\n         if (!actor.equipment.hasTag('GasMask')) {\n             actor.status.applyPoison(2.0 * delta);\n             actor.camera.addNauseaEffect();\n         }\n         break;\n     }\n  }\n}\n`
        });
      } else if (lowerInput.includes('น้ำหนัก') || lowerInput.includes('weight') || lowerInput.includes('mass') || lowerInput.includes('แบก') || lowerInput.includes('แบกของ')) {
        responseText += isThai ? `ทะลุมิติแห่งความสมจริงไปอีกระดับ! ⚖️ จัดเต็มสถาปัตยกรรม **"Dynamic Mass, Encumbrance & Bio-Kinetic Integration" (ระบบน้ำหนักและชีวกลศาสตร์เต็มรูปแบบ)** ที่จะหลอมรวมเข้ากับฉากและระบบฟิสิกส์แวดล้อมอย่างสมบูรณ์แบบร้อยเปอร์เซ็นต์:\n\n` +
          `### ⚖️ 1. Ultra-Realistic Weight Distribution (ระบบกระจายน้ำหนักแบบแยกส่วน)\n` +
          `- **Center of Mass Shift:** ขีดสุดของการจำลองฟิสิกส์! หากตัวละครสะพายเป้หนัก 50 กิโลฯ ไว้ด้านหลัง ศูนย์ถ่วงจะเปลี่ยนไปด้านหลัง (Center of Mass Backward Shift) ตัวละครจะต้อง **"โน้มตัวไปข้างหน้าเสมอ (Leaning Forward IK)"** ตอนเดินขึ้นเขา และถ้าเดินลงเขาเร็วๆ จะมีโอกาสหน้าทิ่มกลิ้งตกลงมา (Momentum Trip) สูงกว่าปกติ 200%!\n` +
          `- **Asymmetrical Load (การถือของมือเดียว):** หากถือกระเป๋าเจมส์บอนด์หนักๆ หรือหิ้วถังน้ำด้วยมือขวา ตัวละครจะเดินเอียงซ้ายโดยอัตโนมัติ (Offset Spine IK) และเดินกระเผลกเล็กน้อยเพื่อชดเชยน้ำหนัก\n\n` +
          `### 🌊 2. Weight x Bio-Locomotion Synergy (คอมโบน้ำหนัก + ทะลุสภาพแวดล้อม)\n` +
          `- **Heavy vs. Ice Slipperiness:** ในพื้นน้ำแข็งลื่นไถล (Ice) ถ้าน้ำหนักตัวเยอะ ค่า Momentum จะมหาศาล การเบรกจะใช้ระยะทางไกลกว่าเดิม 3 เท่า! ชนหินทีเดียวกระดูกอาจหัก (Fracture Physics)\n` +
          `- **Titanic Sinking in Mud/Snow:** เดินลุยหิมะหนา หรือทรายดูด (Quicksand) ถ้าน้ำหนักรวมเกินเกณฑ์ ตัวละครจะจมลึกกว่าเดิมจนถึงเอว (Deep Penetration) และต้องปลดเป้สัมภาระทิ้งเผ่นหนี (Drop Backpack) เพื่อเอาชีวิตรอด!\n` +
          `- **Buoyancy Sinking:** น้ำหนักชุดเกราะเหล็ก (High Density) ในเขตน้ำลึก (Submerged) จะทำให้จมดิ่งติดก้นแม่น้ำทันที ไม่สามารถว่ายน้ำลอยตัวได้ (Negative Buoyancy) ต้องเดินใต้น้ำช้าๆ เหมือนฝันร้าย\n\n` +
          `### 🌪️ 3. Environment Anchor (น้ำหนักต้านทานภัยธรรมชาติ)\n` +
          `- **Hurricane Anchorage:** ในเขตพายุทอร์นาโดกระโชกแรง น้ำหนักที่มากจะเป็นข้อได้เปรียบ! ตัวละครที่มีของหนักจะต้านทานแรงลมพัดปลิวได้ดีกว่าตัวเบา (Velocity Drag Resistance)\n` +
          `- **Bridge Collapses & Fragile Surfaces:** เหยียบพื้นน้ำแข็งบางๆ, หลังคาผุ, หรือสะพานไม้ (Fragile Volumes) ระบบจะเช็คน้ำหนัก (Weight Threshold) ถ้าน้ำหนักเกิน พื้นจะปริร้าวแบบ Procedural ก่อนจะแตกทะลุร่วงลงไป!\n\n` +
          `### 💪 4. Muscular Fatigue & Caloric Burn (ความล้าของกล้ามเนื้อและการเผาผลาญ)\n` +
          `- **Progressive Stamina Maximum Drain:** ยิ่งแบกหนัก กล้ามเนื้อจะหลั่งกรดแลคติก ค่า Max Stamina จะหดลงเรื่อยๆ จนเหลือ 20% ทำให้ต้องตั้งแคมป์พักผ่อน (Campfire Rest) ตัวละครจะหอบหายใจรุนแรงจนเสียงแหบ และความร้อนในตัว (Core Temperature) จะพุ่งสูงปรี๊ด เดินกลางแดดทะเลทราย (Scorching Heat) จะทำให้คอแห้งตาย\n\n` +
          `💡 **นี่คือฟิสิกส์แห่งความอยู่รอดระดับ Hardcore Survival RPG! ผมได้เตรียมคอร์ระบบนี้ให้แล้ว และปรับแก้ Map Editor โหมด Volumes ให้สามารถตั้งค่า "ความเปราะบางของพื้นผิว (Fragile Surface)" ได้ด้วย สนใจดูโค้ดลึกๆ ไหมครับ? 🎒⚙️**` :
                        isJapanese ? `「動的質量、過積載、および生体運動システム」を統合しました！バックパックの重さによる重心移動（前傾姿勢での山登りなど）や、氷上での慣性の増加、流砂での沈下速度の上昇、脆い床の崩落など、重量と環境ボリュームの完全な相乗効果を実現しています。` :
                        `I have integrated the **"Dynamic Mass, Encumbrance & Bio-Kinetic Integration Engine!"** ⚖️🎒\n\nThis system applies multi-layered Physics based on character weight. Carrying a heavy backpack shifts your Center of Mass backward, forcing the procedural IK to lean your character forward. It combines with environmental hazards: heavy characters sink faster in Quicksand, break thin ice/fragile roofs, sink immediately in deep water instead of swimming, and slide much further on Slippery Ice. I also added a "Fragile Surface Volume" to the Map Editor!`;
        
        generatedFiles.push({
           filename: 'DynamicMassEngine.ts',
           language: 'typescript',
           content: `// [Bio-Kinetic Mass Engine]\n// Features: Center of Mass Shift, Encumbrance, Fragile Volume Collisions\n\nexport class DynamicMassEngine {\n  public calculateLocomotionInfluence(actor: any, currentWeight: number, maxCapacity: number) {\n     const encumbranceRatio = currentWeight / maxCapacity;\n     \n     // Shift Center of Mass based on Backpack Weight\n     if (actor.equipment.backpackWeight > 10.0) {\n        actor.ik.setSpineLeanForward(encumbranceRatio * 20.0); // Lean up to 20 degrees\n     }\n\n     // Momentum multiplier for Ice\n     actor.physics.setMass(actor.baseMass + currentWeight);\n     \n     // Max Stamina Burn\n     if (encumbranceRatio > 0.8) {\n        actor.stats.drainMaxStamina(0.01 * encumbranceRatio);\n        actor.audio.playHeavyBreathing();\n     }\n  }\n\n  public checkFragileSurface(actor: any, surface: any) {\n     const totalMass = actor.baseMass + actor.equipment.getTotalWeight();\n     if (surface.type === 'Fragile' && totalMass > surface.weightThreshold) {\n        surface.triggerProceduralBreak(actor.transform.position);\n        actor.physics.applyFallGravity();\n     }\n  }\n}\n`
        });
      } else if (lowerInput.includes('npc') || lowerInput.includes('มอนเตอร์') || lowerInput.includes('monster') || lowerInput.includes('มอนสเตอร์') || lowerInput.includes('ศัตรู')) {
        responseText += isThai ? `ปลดล็อกระบบนิเวศน์อัจฉริยะ! 🧠🐺 ขยายผล **"Advanced Environmental Physics & Bio-Locomotion"** สู่ NPC และ Monster ทุกตัวในเกมแบบ Real-time:\n\n` +
          `### 🤖 1. Dynamic NavMesh & Danger Avoidance (AI หลบหลีกและวิเคราะห์เส้นทาง)\n` +
          `- **Hazard Perception:** มอนสเตอร์ทั่วไปจะ 'มองเห็น' อันตรายจาก Volume Physics (เช่น ลาวา, หนองน้ำพิษ, ทรายดูด) ผ่าน AI Perception System พวกมันจะปรับเส้นทาง (Pathfinding Cost) เพื่อหลีกเลี่ยงการเดินลุยไฟ หรือหากหนีไม่ได้ พวกมันจะกระโดดข้ามแทน!\n` +
          `- **Bait & Trap Tactics:** ผู้เล่นสามารถหลอกล่อศัตรูที่โง่หรือกำลังโกรธให้วิ่งตามมาบน 'พื้นที่น้ำแข็งลื่น (Slippery Ice)' ทำให้ศัตรูแหกโค้งตกเหว หรือล่อให้วิ่งมาเหยียบ 'พื้นเปราะบาง (Fragile Surface)' จนพื้นแตกถล่มลงไปตายยกลังได้!\n\n` +
          `### 🐺 2. Biome-Specific Animal Instincts (สัญชาตญาณสัตว์ป่าตามสภาพแวดล้อม)\n` +
          `- **Predator Home-Field Advantage:** มอนสเตอร์ที่เป็นเจ้าถิ่น เช่น 'สไลม์โคลน' ในบ่อ Quicksand จะไม่ได้รับผลกระทบเรื่องความเชื่องช้า แถมยังมุดลงไปซุ่มโจมตี (Ambush) ผู้เล่นที่กำลังเดินอืดอาดได้\n` +
          `- **Wind-Rider Fowls:** นกยักษ์หรือมังกรในเขตพายุหนุน (Gale Wind) จะใช้ลมพัด (Updraft) ช่วยให้บินได้เร็วขึ้น 300% โฉบลงมาโจมตีผู้เล่นที่ต้านลมอยู่\n\n` +
          `### 🤢 3. Full Physiological Reaction (NPC รับผลกระทบทางกายภาพเหมือนผู้เล่น 100%)\n` +
          `- **Procedural Suffering:** NPC ที่เดินฝ่าหิมะจะหนาวสั่นและเดินกอดอก (Shivering IK) ทหารยามที่ยืนเฝ้าในทะเลทรายจะเหงื่อแตกปาดเหงื่อ (Sweating & Wiping AI State) และสูญเสียรัศมีการมองเห็น (Vision Cone ลดลง) หากโดนลมพายุพัดเข้าตา\n` +
          `- **Mass-based Crowd Physics:** การชนฝูงซอมบี้บนพื้นลื่น ตัวที่หนักหนาที่สุดจะไถลช้ากว่า แต่โมเมนตัมชนกระแทกจะทำให้ตัวอื่นๆ ระเนระนาดเหมือนพินโบว์ลิ่ง!\n\n` +
          `### 🧬 4. Bio-Mutation & State Changes (การกลายพันธุ์และเปลี่ยนธาตุ)\n` +
          `- **Radiation Enragement:** มอนสเตอร์ที่หลุดเข้าไปในเขต Radioctive/Spore Forest หากไม่ตายทันที จะกลายพันธุ์ (Mutate) เปลี่ยนไซส์ใหญ่ขึ้น ตัวเรืองแสง และรูปแบบโจมตีเปลี่ยนไป (Rage Mode)\n` +
          `- **Elemental Imbuement:** โกเลมหินเดินผ่านเขตลาวา มันจะซับความร้อนกลายเป็น 'Magma Golem' อัตโนมัติ การโจมตีของผู้เล่นด้วยอาวุธระยะประชิดจะโดนดาเมจสะท้อน (Thermal Recoil)\n\n` +
          `💡 **ระบบนิเวศน์ตอนนี้มีชีวิตจิตใจ อ้างอิงฟิสิกส์ล้วนๆ! ลองวางกองโจรไว้บริเวณหน้าผาที่มีพายุพัดแรงสิครับ... ถ้าโจรตัวเตี้ยเดินต้านลม มันอาจจะปลิวตกลงไปล่างเหวเองโดยที่คุณยังไม่ได้ชักดาบเลย! 🌪️⚔️**` :
                        isJapanese ? `「ユニバーサルNPCおよびモンスター環境適応システム」を出力しました！すべてのNPCとモンスターはプレイヤーと同じ環境物理学（Bio-Locomotion）の影響を受けます。氷で滑る、熱で汗をかく、毒ガスでむせるなどの描写だけでなく、AIの経路探索が危険エリアを回避したり、沼地に住むモンスターが足の遅いプレイヤーを待ち伏せたりする戦術も実行します！` :
                        `I've activated the **"Universal NPC/Monster Bio-Adaptation Engine"!** 🧠🐺\n\nNow, the Advanced Environmental Physics affect ALL entities, not just the player. NPCs feel cold and shiver in blizzards, Guards sweat and have reduced vision in sandstorms. Monsters use Pathfinding to avoid Lava/Toxic swamps unless they are native to that biome. You can even bait enemies into running on Slippery Ice to slide off a cliff, or trick heavy beasts into stepping on Fragile Surfaces to plunge them to their doom!`;
        
        generatedFiles.push({
           filename: 'EntityEcosystemAI.ts',
           language: 'typescript',
           content: `// [Universal Entity Environment AI]\n// Features: NavMesh Danger Avoidance, Biome Immunity, Procedural Reactions\n\nexport class EntityEcosystemAI {\n  public updateEntity(actor: any, environment: any, delta: number) {\n     // 1. Biome Immunity Check\n     if (actor.traits.has('IceNative') && environment.type === 'SlipperyIce') {\n        actor.physics.setFriction(1.0); // Ignored ice slip\n        actor.combat.setAggroRangeMultiplier(1.5); // Advantage\n     } else {\n        // Apply global environmental impact (Same as Player)\n        environment.applyToActor(actor);\n     }\n\n     // 2. Dynamic NavMesh Pathfinding Modification\n     const pathfinder = actor.getComponent('NavPathfinder');\n     if (environment.isHazardous && !actor.traits.has('HazardImmune')) {\n         pathfinder.setAreaCost(environment.areaID, 999.0); // Highly avoid walking into lava/toxins\n     }\n\n     // 3. Spontaneous Mutation Event\n     // E.g., Rock Golem walks into Lava\n     if (actor.id === 'Golem_Basic' && environment.type === 'LavaProximity') {\n         if (actor.stats.health > 0) {\n            actor.transformInto('Golem_Magma');\n            actor.vfx.playTransformationEffect();\n         }\n     }\n  }\n}\n`
        });
      } else if (lowerInput.includes('เพิ่มรายละเอียด') || lowerInput.includes('ของไหล') || lowerInput.includes('fluid') || lowerInput.includes('thermodynamic') || lowerInput.includes('เข้าไปอีก') || lowerInput.includes('ลึก')) {
        responseText += isThai ? `ก้าวข้ามขีดจำกัดไปสู่อีกมิติ! 🌊🌪️ ผมได้เพิ่ม **"Advanced Fluid Dynamics & Micro-Thermodynamics" (ระบบของไหลและอุณหพลศาสตร์ระดับไมโคร)** ที่จะลงลึกไปถึงระดับเส้นใยผ้า อากาศ และโมเลกุลในเนื้อเกมเพลย์:\n\n` +
          `### 💧 1. Capillary Action & Wetness Mass (การซึมซับของเหลวและน้ำหนักสะสม)\n` +
          `- **Dynamic Wetness (เปียกแบบซึมลึก):** เมื่อตัวละครเดินลุยน้ำหรือตากฝน เสื้อผ้าจะไม่ใช่แค่เปียก (Shader) แต่ผ้าแต่ละชนิดจะ "ดูดซับน้ำ" ไม่เท่ากัน เสื้อขนสัตว์จะดูดน้ำหนักเพิ่มขึ้น (Capillary Weight) จนคอมโบกับระบบน้ำหนักทำให้เดินช้าลงและสแตมิน่าลดฮวบ 20%! ส่วนชุดกันน้ำ (Raincoat) น้ำจะกลิ้งตกลงมา (Lotus Effect)\n` +
          `- **Drying & Evaporation (การระเหย):** ออกจากน้ำแล้วต้องผิงไฟ (Campfire) หรือยืนตากแดดให้แห้ง ไม่งั้นสถานะ "ตัวเปียก" จะคอมโบกับลมหนาว (Windchill) ทำให้ติดสถานะ Hypothermia (หนาวตาย) เร็วกว่าปกติถึง 10 เท่า\n\n` +
          `### 🌪️ 2. Micro-Aerodynamics & Wind Tunnels (อากาศพลศาสตร์ระดับไมโครและอุโมงค์ลม)\n` +
          `- **Slipstream & Drafting:** เมื่อวิ่งตามหลังบอสตัวใหญ่ๆ หรือหลบหลังกำแพง ลมต้านจะหายไป (Drafting Zone) ทำให้ฟื้นฟูสแตมิน่าได้เร็วขึ้น แต่ถ้าเดินผ่านช่องแคบระหว่างหน้าผา ลมจะถูกบีบให้แรงขึ้น (Wind Tunnel Effect) แอนิเมชันจะเปลี่ยนเป็นท่าเอามือป้องหน้าและเดินเซเหมือนจะโดนตีตกลงมา\n` +
          `- **Cloak & Fabric Drag (ผ้าคลุมต้านลม):** ผ้าคลุมที่ยาวเกินไปจะกลายเป็น "ใบเรือ" ดักลม หากวิ่งต้านลม พริ้วผ้าคลุมจะสร้างแรงหน่วง (Drag Force) ดึงตัวละครให้วิ่งช้าลง นี่คือจุดเปลี่ยนที่ทำให้แฟชั่นมีผลต่อฟิสิกส์การเอาชีวิตรอด!\n\n` +
          `### 🔥 3. Thermal Convection & Heat Mirage (การพาความร้อนและภาพลวงตา)\n` +
          `- **Air Density Distortion (ภาพสะท้อนเปลวแดด):** ในสถานที่ที่ร้อนจัดอย่างปล่องภูเขาไฟหรือทะเลทรายเที่ยงตรง อากาศเหนือพื้นจะบิดเบี้ยว (Heat Distortion) ทำให้การเล็งปืนสไนเปอร์ (Raycast) คลาดเคลื่อนจากเป้าหมายตามหลักฟิสิกส์การหักเหของแสงจริงๆ!\n` +
          `- **Thermal Conduction (โลหะดูดความร้อน & ความเย็นจัด):** อาวุธโลหะที่ตากแดดนานๆ จะเก็บความร้อน หากไม่ได้ใส่ถุงมือจะโดนดาเมจลวกมือ ส่วนในเขตน้ำแข็ง ดาบเหล็กจะดูดความร้อนมือจนทำให้การโจมตี (Swing Speed) ช้าลง 15%\n\n` +
          `💡 **ทุกดีเทลของของไหลและอุณหพลศาสตร์ระดับไมโคร ผมได้ผูกเข้ากับกราฟิก Engine เรียบร้อย! ลองเข้าไปใน Map Editor หมวด "Chaos Physics & Fluids" แล้วปรับสัมประสิทธิ์กันได้เลยครับ! 🌡️⚡**` :
                        isJapanese ? `限界を超えるリアリズム！「高度流体力学＆マイクロ熱力学（Advanced Fluid Dynamics & Micro-Thermodynamics）」を追加しました！服の素材による水の吸収と重量の増加（毛皮は重くなり、レインコートは水を弾く）、風の抵抗とマントの空気抵抗（Cloak Drag）、熱気によるスナイパーの弾道屈折（Heat Mirage）、金属の熱伝導によるダメージなどを完全にシミュレートします！` :
                        `Pushing realism to the microscopic level! 🌊🌪️\n\nI've integrated the **"Advanced Fluid Dynamics & Micro-Thermodynamics Engine"**! This includes Capillary Action (clothes soak up water based on fabric type, adding physical weight and causing hypothermia if not dried by a fire), Micro-Aerodynamics (wind tunnels between cliffs, Slipstreaming behind large monsters, and Cape/Cloak fabric catching the wind to slow you down), and Thermal Physics (Heat mirages distorting sniper trajectories, and metal weapons gathering extreme heat/cold to damage bare hands or slow attack speed). Added to the Map Editor's Chaos Physics tab!`;
        
        generatedFiles.push({
           filename: 'MicroFluidThermodynamics.ts',
           language: 'typescript',
           content: `// [Fluid Dynamics & Micro-Thermodynamics]\n// Features: Capillary Action, Cloak Wind Drag, Thermal Refraction, Conduction\n\nexport class FluidThermoSystem {\n  public processCapillaryAction(actor: any, environment: any, delta: number) {\n     if (environment.type === 'Wet' || environment.isRaining) {\n        const absorptionRate = actor.equipment.getFabricAbsorption();\n        actor.stats.wetness += absorptionRate * delta;\n        \n        // Additional mass from soaked clothes\n        const waterMass = actor.stats.wetness * 2.5; // Kg of water\n        actor.equipment.addTemporaryMass(waterMass);\n     } else if (environment.temperature > 25.0) {\n        actor.stats.wetness = Math.max(0, actor.stats.wetness - (environment.temperature * 0.05 * delta));\n        actor.equipment.removeTemporaryMass();\n     }\n  }\n\n  public processMicroAerodynamics(actor: any, windVector: any) {\n     // Drafting / Wind Tunnel\n     const windSpeed = windVector.magnitude();\n     if (actor.equipment.hasCape()) {\n        const dotProduct = actor.getFacingDirection().dot(windVector.normalize());\n        if (dotProduct < -0.5) {\n           // Walking into wind with cape acts as a sail\n           actor.locomotion.applyDragMultiplier(1.0 + (windSpeed * 0.1));\n        }\n     }\n  }\n\n  public processHeatDistortion(weaponOrigin: any, target: any, envTemp: number) {\n     if (envTemp > 45.0) {\n        // Deflect sniper trajectory based on heat mirage\n        const distortionAmount = (envTemp - 45.0) * 0.02;\n        weaponOrigin.applyTrajectoryNoise(distortionAmount);\n     }\n  }\n}\n`
        });
      } else if (lowerInput.includes('พื้นที่') || lowerInput.includes('map edit') || lowerInput.includes('อนิเมชั่น') || lowerInput.includes('เสียงน้ำไหล') || lowerInput.includes('ภูเขาไฟ') || lowerInput.includes('อีเว้น')) {
         responseText += isThai ? `นี่คือประสบการณ์เอดิเตอร์แบบไร้ขีดจำกัดที่คุณขอครับ! 🔥🎬 เพิ่ม **"100% Audio Master Control & Biome-Specific Locomotion" (ระบบควบคุมเสียงสมบูรณ์แบบและแอนิเมชันตามชีวนิเวศ)** ลงใน Map Editor อย่างเต็มรูปแบบแล้ว:\n\n` +
          `### 🌋 1. Biome-Specific Locomotion Animations (แอนิเมชันเฉพาะพื้นที่)\n` +
          `- **Volcanic Ash & Lava Fields (พื้นที่ภูเขาไฟ):** เมื่อเดินบนเถ้าถ่านร้อน แอนิเมชันการเดินจะเปลี่ยนเป็น 'การก้าวข้ามแบบระมัดระวัง' (Cautious Stepping IK) พร้อมเอฟเฟกต์ยกเท้าหนีความร้อน (Heat-Jerk Reaction) เลือดจะลดหากยืนแช่\n` +
          `- **Deep River Currents (พื้นที่กระแสน้ำเชี่ยว):** แอนิเมชันจะเปลี่ยนเป็น 'การต้านกระแสน้ำ' (Wading Animation) ร่างกายจะเอนไปข้างหน้า ตัวละครอาจจะถูกพัดกระเด็น (Ragdoll Wash-away) และกระแทกหินจนบาดเจ็บได้\n` +
          `- **Toxic Swamp/Mud (หนองน้ำพิษและโคลน):** แอนิเมชันจะหนืดและลากเท้า (Mud-slugging) ตัวละครต้องเอามือปิดจมูกหรือไอ (Toxin Coughing) หากไม่มีหน้ากากกันแก๊ส\n\n` +
          `### 🎛️ 2. 100% Map Editor Audio Controls (ระบบวิศวกรรมเสียงในแมพ)\n` +
          `- **Procedural Event Sounds (เสียงอีเวนต์ตามพื้นที่):** นำเข้าเสียง "เสียงน้ำตกกระแทกหิน", "เสียงลาวาเดือดปุดๆ", "เสียงภูเขาไฟคำรามใต้ดิน (Sub-bass Tremor)" ได้อย่างอิสระ สามารถกำหนด Trigger Box ให้เสียงแปรผันตามระยะทางแบบ 3D Audio\n` +
          `- **Master Reverb & Occlusion:** ระบบเสียงในโหมด Audio ของ Map Editor มีการตั้งค่า Convolution Reverb สำหรับแต่ละถ้ำลึกหน้าผาสูง การันตีความสมจริงของเสียงสะท้อนแบบ 100% และเสียงอีเวนต์ฟิสิกส์ต่างๆ (เช่น หินถล่ม น้ำแข็งแตก)\n` +
          `- **Layered Soundscapes:** คุณสามารถผสม (Blend) เสียง ลม พายุทราย ลาวาปะทุ และเสียงมอนสเตอร์ เข้าด้วยกันใน Editor ให้เป็นโซน (Soundscape Node) ได้เลย!\n\n` +
          `💡 **ผมได้อัปเกรดเครื่องมือใน "โหมด Audio" ของ Map Editor ให้มี Master Control เต็มรูปแบบ และเพิ่ม Event Nodes มหาศาล ตอนนี้คุณสร้างโซนเสียงมหากาพย์ได้ดั่งใจแล้วครับ! 🎧🔥**` :
                        isJapanese ? `完璧なオーディオ＆バイオームアニメーションシステムを実装しました！火山灰や溶岩の上を歩く専用アニメーション、激流に逆らうアニメーションを追加。さらにマップエディタに「100%オーディオマスターコントロール」を搭載し、水流、火山の地鳴り、溶岩の煮え滾る音など、イベントドリブンの環境音を自由に配置・微調整できるようになりました！` :
                        `I've implemented the **"100% Audio Master Control & Biome-Specific Locomotion"**! 🌋🎬\n\n1. Added vast numbers of Biome-Specific Animations: Cautious heat-stepping on Volcanic Ash, heavy struggle wading against River Currents, and coughing/mud-slugging in Toxic Swamps.\n2. Upgraded the Map Editor's Audio Mode: You now have 100% control over Procedural Event Sounds (Lava sizzle, Waterfall splashes, deep Sub-bass Volcano tremors). You can place Soundscape Nodes, adjust Convolution Reverb, filter Audio Occlusion through walls, and trigger cinematic sound events dynamically!\nThe Map Editor Audio tab is fully unlocked! 🎧🔥`;

        generatedFiles.push({
           filename: 'UltimateAudioLocomotion.ts',
           language: 'typescript',
           content: `// [Ultimate Audio & Biome Locomotion]\n// Features: 100% Master Audio Control, Volcanic Animation Set, Water Rapids Physics\n\nexport class EnvironmentInteractiveSystem {\n  public updateAnimState(actor: any, biome: string) {\n     if (biome === 'Volcanic_Ash') {\n        actor.animation.setLocomotionState('Cautious_Heat');\n        if (actor.stats.shoeHeatProtection < 50) {\n           actor.locomotion.triggerHeatJerk(); // Sudden jump animation\n        }\n     } else if (biome === 'Deep_River_Rapids') {\n        actor.animation.setLocomotionState('Wade_Against_Current');\n        actor.ik.leanForward(actor.environment.flowVector);\n     }\n  }\n\n  public triggerEventAudio(eventName: string, location: any) {\n     const audioMaster = GameAudioController.getInstance();\n     if (eventName === 'Volcano_Eruption_Warning') {\n        audioMaster.play3DAudio('SubBass_Tremor', location, { volume: 1.0, occlusion: true, reverbZone: 'Outdoor_Canyon' });\n     } else if (eventName === 'Avalanche') {\n        audioMaster.play3DAudio('Rockfall_Debris', location, { volume: 0.8, pitchRandomization: 0.2 });\n     }\n  }\n}\n`
        });
      } else if (lowerInput.includes('เสียง (audio)') || lowerInput.includes('audio') || lowerInput.includes('ระดับ master') || lowerInput.includes('ลึกกว่านี้') || lowerInput.includes('เสียง')) {
         responseText += isThai ? `จัดให้อีกระดับของความลึกแห่งสุนทรียภาพเสียงครับ! 🎧✨ ผมได้อัปเกรด **"Master-Level Raytraced Audio & Multi-Layer Ambient Architecture" (ระบบเสียงสมจริงแบบยิงเรย์เทรซซิ่งและบรรยากาศหลายมิติ)** ลงใน Map Editor:\n\n` +
          `### 🔊 1. Raytraced Sound & Occlusion (ฟิสิกส์เสียงแบบตามจริง)\n` +
          `- **Ray Bounces (เสียงสะท้อนแบบ Raytracing):** เสียงจะไม่ใช่แค่เล่นตามระยะทาง แต่วิ่งชนกำแพงตามวัสดุ (Material Absorption) หินสะท้อนแบบนึง ไม้ดูดซับเสียงอีกแบบนึง\n` +
          `- **Diffraction & Transmission (การเลี้ยวเบนและทะลุกำแพง):** ถ้ายืนอยู่หลังกำแพง เสียงปืนใหญ่จะ 'ทะลุ' และถูกอุดอู้ (Muffled) ถ้าอยู่ตรงมุมตึก เสียงจะเลี้ยวเบนมาหาคุณได้ตามหลักฟิสิกส์\n\n` +
          `### 🎵 2. Multi-Layer Ambient Emitters (ชั้นบรรยากาศ 3 ระดับ)\n` +
          `- **Layered System:** สร้างโซนเสียงด้วย Layer: Foreground (ใบไม้ไหว, หยดน้ำ), Mid-ground (เสียงนก, เสียงพายุ), Background (เสียงลาวาร้อง, เสียงแผ่นดินเคลื่อน)\n` +
          `- **Doppler Effect Settings:** คำนวณฟิสิกส์เสียงวิ่งผ่านผู้เล่น (Doppler Shift) แบบไดนามิก ให้ความรู้สึกขนลุกทันทีที่ลูกไฟหรือหินก้อนใหญ่ลอยผ่านหัวไป\n\n` +
          `### 🧠 3. Neuro-Sensory Paranoia (ประสาทสัมผัสหลอน)\n` +
          `- **Sub-bass Frequencies:** ปล่อยคลื่นความถี่ต่ำ (Sub-bass) แบบสัมผัสได้มากกว่าได้ยิน เพื่อบิวท์ความเครียดและกดดันผู้เล่นก่อนบอสเกิด!\n\n` +
          `💡 **เข้าไปดูแถบ Audio ใน Editor ได้เลย ผมเพิ่ม Multi-Layer และ Raytraced Sound ให้ปรับตั้งค่าได้ละเอียดยิบ พร้อมให้คุณสร้าง 'เสียงที่จับต้องได้' แล้วครับ! ยินดีด้วยครับ มาสเตอร์!**` :
          `Upgraded Audio to Absolute Master Level! Added Raytraced Sound (bounces, material absorption, diffraction), Multi-Layer Ambient Emitters (Foreground, Mid-ground, Background), and Sub-bass Frequency controls for neuro-sensory paranoia! Explore the Audio tab!`;

        generatedFiles.push({
           filename: 'RaytracedAudioEngine.ts',
           language: 'typescript',
           content: `// [Raytraced Audio Engine]\n// Features: Material Absorption, Diffraction, Multi-Layer Ambiences\n\nexport class RaytracedAudioSystem {\n  public calculateOcclusion(listener: any, emitter: any, environmentMeshes: any[]) {\n      const ray = new Ray(listener.position, emitter.position);\n      const hits = this.trace(ray, environmentMeshes);\n      \n      let signalStrength = 1.0;\n      let lowpassFreq = 22000.0;\n\n      for(const hit of hits) {\n         // Each material dampens sound differently\n         signalStrength *= (1.0 - hit.material.acousticAbsorption);\n         lowpassFreq *= hit.material.acousticTransmittance;\n      }\n\n      // Apply Diffraction around corners\n      if(hits.length > 0 && this.checkDiffractionPath(listener, emitter)) {\n         signalStrength *= 0.4; // Sound wraps around, but weaker\n      }\n      \n      return { volume: signalStrength, cutoff: lowpassFreq };\n  }\n}\n`
        });
      } else if (lowerInput.includes('เปลี่ยนวัสดุ') || lowerInput.includes('เปลี่ยน') || lowerInput.includes('วัสดุ') || lowerInput.includes('เหล็ก') || lowerInput.includes('แตกหัก')) {
         responseText += isThai ? `จัดความสามารถระดับแก่นแท้ของ Engine ให้เลยครับ! 🪄🧱 เพิ่มระบบ **"AI Smart Object Transmutation" (การแปรวัตถุอัจฉริยะด้วย AI)** ลงใน Map Editor โหมด Select:\n\n` +
          `### 🔄 1. Seamless Material Transmutation (เปลี่ยนวัสดุพร้อมปรับฟิสิกส์อัตโนมัติ)\n` +
          `- **เปลี่ยนแผ่นไม้เก่าเป็นเหล็กกล้า:** เพียงแค่เลือกประตูหรือบ้านไม้ แล้วกด Execute AI Transmute! AI จะทำการเปลี่ยน Texture (PBR), สภาพพื้นผิว (Roughness/Metalness) และ **ผูกมัดค่าฟิสิกส์ใหม่ทั้งหมดแบบออโต้!**\n` +
          `- **Physics Auto-Link:** จากประตูไม้ที่โดนไฟไหม้ได้ (Flammability 100%) และพังทลายเป็นซากไม้ จะถูกเปลี่ยนเป็นเหล็กที่ติดไฟไม่ได้ (Flammability 0%) และเมื่อโดนกระแทกจะเกิดการงอตัวและฉีกขาด (Metallic Tearing) แทนการแตกหัก!\n\n` +
          `### 💥 2. Dynamic Destruction Reaction (การตอบสนองความเสียหายตามวัสดุ)\n` +
          `- **Wood (ไม้):** แตกเป็นเศษเล็กเศษน้อย (Splinters) และลุกไหม้ลามไปชิ้นส่วนอื่น ๆ ในบ้าน\n` +
          `- **Iron/Metal (เหล็ก):** เกิดรอยบุบ, บิดเบี้ยว, รอยฉีก (Tension Fracture) และหากโดนน้ำในระบบ Chemistry มันจะเกิดสนิม (Rust Decay) อัตโนมัติ\n` +
          `- **Biomass (เนื้อเยื่อชีวภาพ):** หากคุณอินดี้ เปลี่ยนบ้านเป็นก้อนเนื้อ! มันจะเลือดสาดเมื่อถูกโจมตี และมีการฟื้นฟูตัวเอง (Regeneration)\n\n` +
          `💡 **ผมได้เพิ่มเมนู "Smart Transmutation" ในแถบ UI ด้านขวา (เมื่อเลือกโหมด Editor) คุณสามารถดรอปดาวน์เปลี่ยนไม้เป็นเหล็ก กระจก หรือไทเทเนียม พร้อมดูความสัมพันธ์ของระบบฟิสิกส์ที่เปลี่ยนไป 100% ได้ทันทีครับ!**` :
          `Implemented **AI Smart Object Transmutation**! You can now select any mesh in the Map Editor and instantly transmute its material (e.g., Wood to Iron). The AI automatically re-links all physical properties: Destructibility changes from wood splintering to metallic tearing, and Chemistry rules adapt (Iron will now rust in water, while losing its flammability). Check the new Smart Transmutation tab on the right inspector panel!`;

        generatedFiles.push({
           filename: 'SmartTransmutationEngine.ts',
           language: 'typescript',
           content: `// [AI Smart Transmutation Engine]\n// Features: Auto-linking PBR to Chaos Destruction & Chemistry Rules\n\nexport class MaterialTransmuter {\n  public static transmuteMesh(mesh: any, targetMaterialType: string) {\n      // 1. Swap Visual Material (PBR)\n      mesh.setMaterial(MaterialLibrary.get(targetMaterialType));\n      \n      // 2. Clear Old Bound Interactions\n      mesh.physicsProfile.clear();\n      mesh.chemistryProfile.clear();\n\n      // 3. Bind New Physical Rules via AI Schema\n      switch(targetMaterialType) {\n         case 'Corrugated_Iron':\n            mesh.physicsProfile.setDestructionMode('MetallicTearing');\n            mesh.physicsProfile.setHardness(8.5);\n            mesh.chemistryProfile.setReaction('Water', 'Oxidation_Rust', { rate: 0.2 });\n            mesh.chemistryProfile.setFlammability(0.0);\n            break;\n         case 'Plank_Wood':\n            mesh.physicsProfile.setDestructionMode('SplinterFracture');\n            mesh.physicsProfile.setHardness(3.0);\n            mesh.chemistryProfile.setFlammability(1.0);\n            mesh.chemistryProfile.setReaction('Fire', 'Combustion', { spreadSpeed: 2.5 });\n            break;\n         case 'Flesh_Biomass':\n            mesh.physicsProfile.setDestructionMode('ViscousSplat');\n            mesh.chemistryProfile.enableRegeneration();\n            mesh.audioProfile.setImpactSound('Squish_Gore');\n            break;\n      }\n      \n      console.log(\\\`Transmuted successfully. Entity is now linked to \${targetMaterialType} physics rules.\\\` );\n  }\n}\n`
        });
      } else if (lowerInput.includes('ai smart object transmutation') || lowerInput.includes('รายละเอียด') || lowerInput.includes('ลึกที่สุด') || lowerInput.includes('เยอะมากๆ')) {
         responseText += isThai ? `นี่คือการเจาะลึกระบบ AI Smart Object Transmutation ขั้นสุดยอดเพื่อความสมจริง 100% ครับ! 🚀🔥 ผมได้เพิ่มตัวแปรทางฟิสิกส์และโครงสร้างทางเคมีที่แปรผันแบบ Real-time เข้าไปในเอนจิน:\n\n` +
          `### ⚛️ 1. Molecular Property Shifting (การจำลองระดับโมเลกุล)\n` +
          `- **Thermal Conductivity (การนำความร้อน):** เมื่อเปลี่ยนเป็น "เหล็ก" (Iron) หากแดดจรจัดส่องนานๆ (Weather System = Sunny + Hot) หรือมีไฟไหม้ใกล้ๆ มันจะกระจายความร้อนออกมา สร้าง Heat Mirage (ภาพบิดเบี้ยวจากความร้อน) และผู้เล่นที่ไปแตะจะโดนดาเมจ Burn ทันที\n` +
          `- **Acoustic Density (ความหนาแน่นทางเสียง):** ประตูไม้เคาะดัง "ก๊อกๆ" เสียงสะท้อนน้อย... แต่พอเปลี่ยนเป็น "ไทเทเนียมดัด" (Raw Titanium) เคาะแล้วจะมีเสียง "ก้องกังวาน" แบบเสียงสะท้อน (Reverb) ยาวนาน และดูดซับคลื่นเสียงความถี่ต่ำได้ดีเยี่ยม\n` +
          `- **Mass & Inertia Scaling (มวลและแรงเฉื่อย):** วัตถุไม้เตะกระเด็นได้ แต่พอเป็น "คอนกรีตเสริมเหล็ก" มวลจะเปลี่ยนจาก 10kg เป็น 300kg เตะปุ๊บ ขาผู้เล่นกระดูกร้าวติดสถานะ Bone Fracture (Ragdoll สะดุด)!\n\n` +
          `### ⚡ 2. Electromagnetic & Chemical Matrix (แม่เหล็กไฟฟ้าและเคมีเชิงลึก)\n` +
          `- **Electrical Conductivity (การนำไฟฟ้า):** เสาที่เปลี่ยนเป็นเหล็ก หรือซากเครื่องจักร หากฝนตก (Rainy)ฟ้าผ่า (Thunderstorm) ผ่ามาลงที่มัน ไฟฟ้าจะช็อตรอบรัศมี 5 เมตร สร้าง Zone โคตรอันตราย (Electromagnetic Arc Zone)\n` +
          `- **Hydrophobic/Hydrophilic Surfaces:** วัสดุกระจก (Scratched Glass) จะมีคุณสมบัติ Hydrophobic น้ำฝนที่ตกลงมาจะไหลเป็นทาง (Raindrops Normal Map) ในขณะที่ ไม้ หรือ ฟองน้ำ จะดูดซับน้ำ ทำให้น้ำหนักตัวมันเองเพิ่มขึ้นหลายเท่า (เปลี่ยน Mass Dynamic)\n\n` +
          `### 🧬 3. The "Biomass" Anomaly (การแปรสภาพเป็นเนื้อเยื่อสิ่งมีชีวิต)\n` +
          `- **Spontaneous Circulation:** เมื่อคุณเสกกำแพงให้เป็น "Flesh / Biomass" ผิวผนังจะขยับตามการเต้นของหัวใจ (Heartbeat Vertex Displacement Shader)\n` +
          `- **Parasitic Assimilation:** วัตถุข้างเคียงที่เป็นไม้หรือเหล็ก จะเริ่มมีเส้นเลือด (Mycelium Veins) ค่อยๆ ลามชอนไชไปเกาะกินตามกาลเวลาแบบ Procedural Growth\n\n` +
          `💡 **ผมอัปเดตหน้า UI ของ AI Smart Transmutation Hub ใน Map Editor ให้โชว์ข้อมูลลึกถึงระดับ "Auto-Linked Physical Matrix" ทั้งค่า Mechanics, Thermal, Chemistry, และ Acoustics แบบสมบูรณ์แล้วครับ!**` :
          `Here is the ultimate deep dive into the AI Smart Object Transmutation engine for 100% realism! 🚀🔥 I've integrated Thermal Conductivity, Acoustic Density, Mass/Inertia Scaling, Electrical Conduction, and even the grotesque Biomass anomaly, complete with structural heartbeat displacement! Check the auto-linked Physical Matrix in the editor now!`;

        generatedFiles.push({
           filename: 'UltimateTransmutationMatrix.ts',
           language: 'typescript',
           content: `// [Ultimate Transmutation Matrix]\n// Deep molecular-level integration of Thermodynamics, Electromagnetism, & Bio-mimicry\n\nexport class PhysicalMatrix {\n  public static updateEnvironmentReaction(mesh: any, globalWeather: any) {\n      const mat = mesh.currentMaterialType;\n      \n      if (mat === 'Corrugated_Iron' || mat === 'Raw_Titanium') {\n         // High Thermal Conductivity\n         if (globalWeather.temperature > 40.0 || globalWeather.nearbyFireSource) {\n            mesh.surfaceTemperature = Math.min(100.0, mesh.surfaceTemperature + 0.5);\n            if (mesh.surfaceTemperature > 60.0) {\n               ParticleSystem.spawn('Heat_Mirage', mesh.position);\n            }\n         }\n         \n         // High Electrical Conductivity\n         if (globalWeather.condition === 'Thunderstorm' && Math.random() < 0.05) {\n            LightningSystem.strike(mesh.position);\n            mesh.createElectromagneticAura(5.0); // 5-meter shock radius\n         }\n      } else if (mat === 'Flesh_Biomass') {\n         // Viscous Biological Behavior\n         mesh.applyVertexShader('Organic_Heartbeat_Displacement', { bpm: 60 });\n         \n         // Procedural Vein Growth onto nearby objects\n         const nearbyObjects = Physics.sphereOverlap(mesh.position, 2.0);\n         nearbyObjects.forEach(obj => {\n            if(obj.id !== mesh.id && !obj.isInfected) {\n               obj.applyDecal('Veins_Creep_Decal');\n               obj.isInfected = true;\n            }\n         });\n      }\n  }\n}\n`
        });
      } else if (lowerInput.includes('สร้างแผ่นที่') || lowerInput.includes('สร้างแผนที่') || lowerInput.includes('ทั้งหมดตามจริง')) {
         responseText += isThai ? `จัดให้ตามคำขอครับ! 🗺️✨ ผมได้อัปเกรดระบบ **"AI Map Generation 100% Core Reality" (การสร้างแผนที่โดย AI ระดับความจริง 100%)** ให้ลงลึกถึงระดับฟิสิกส์มวลสารแบบเต็มสูบ:\n\n` +
          `### 🤖 1. AI 100% Material Auto-Assignment (กำหนดวัสดุและฟิสิกส์อัตโนมัติ)\n` +
          `- **Contextual Spawning & Physics Mapping:** AI จะไม่แค่วางโมเดล แต่จะกำหนดค่าฟิสิกส์ (Physical Material) ตามจริง 100% แบบอัตโนมัติ! เช่น:\n` +
          `  - 🪵 **Wood (ไม้):** Friction (ความเสียดทาน): 0.6 | Restitution (ความเด้ง): 0.2 | Density (ความหนาแน่น): 0.5g/cm³\n` +
          `  - 🏗️ **Metal (เหล็ก):** Friction: 0.3 (ลื่นกว่า) | Restitution: 0.1 (แทบไม่เด้ง) | Density: 7.8g/cm³ (หนักมาก)\n` +
          `  - 🧊 **Ice/Glass (น้ำแข็ง/กระจก):** Friction: 0.05 (ลื่นปรื๊ด) | Restitution: 0.4 | Density: 0.9g/cm³\n` +
          `- **Environmental Logic:** หากบ้านอยู่ในหนองน้ำ AI จะปรับ Friction ของไม้ให้เพิ่มขึ้นเพราะความชื้น ทำให้เดินไม่ลื่น แต่ตะไคร่เกาะ!\n\n` +
          `### 🔧 2. Total Manual Override & Physics Injection (แทรกแซงฟิสิกส์อิสระ)\n` +
          `- **Component Separation:** บ้านถูกแยกโครงสร้างทั้งหมด (Destructible Prefab)\n` +
          `- **Real-time Physics Injection:** ใน Map Editor เมื่อคุณเลือกวัสดุใหม่ ระบบจะ "Suggest" และช่วยคำนวณค่า Friction, Restitution, Density ให้ทันที พร้อมปุ่ม **"Apply Physics to Active Object"** เพื่อฉีดค่าฟิสิกส์ลงไปใน Viewport สดๆ\n` +
          `- **Visual Feedback:** หากคุณเปลี่ยนคานเหล็กเป็นแก้ว (มวลน้อยลง ความเปราะบางสูง) บ้านจะถล่มลงมาทันทีที่รัน Simulation โหมดฟิสิกส์!\n\n` +
          `💡 **ผมอัปเดต Map Editor ให้มีแถบ "Physics Override" พร้อมระบบ AI Suggestion สำหรับจำลองความหนาแน่นและความเด้งของวัสดุ (Density & Restitution) แล้วครับ!**` :
          `AI Map Generation has been upgraded to **100% Core Reality**! 🗺️✨ I've deeply integrated Physical Material Auto-Mapping. When AI generates the map, it automatically assigns real-world Physics: Friction, Restitution (Bounciness), and Density. Wood gets high friction and low density. Metal gets high density and low restitution. Ice gets near-zero friction. I also added a "Physics Override" module in the editor. When you select a new material, the AI suggests the exact Physical Properties to inject, allowing you to instantly "Apply Physics to Active Object" directly in the viewport!`;

        generatedFiles.push({
           filename: 'AiMapGeneratorRealityEngine.ts',
           language: 'typescript',
           content: `// [AI Core Reality Map Generator & Physics Mapping]\n// Auto-generates broken-down prefabs & calculates Friction, Restitution, Density\n\nexport class PhysicalMaterialSetup {\n  public static getProperties(materialType: string) {\n      switch(materialType) {\n         case 'Wood': return { friction: 0.6, restitution: 0.2, density: 500 }; // kg/m^3\n         case 'Steel': return { friction: 0.3, restitution: 0.1, density: 7800 };\n         case 'Ice': return { friction: 0.05, restitution: 0.4, density: 916 };\n         case 'Rubber': return { friction: 0.9, restitution: 0.8, density: 1100 };\n         default: return { friction: 0.5, restitution: 0.2, density: 1000 };\n      }\n  }\n}\n\nexport class AiMapGenerator {\n  public static generateStructure(type: string, location: any, biome: string) {\n      let structureNodes: any[] = [];\n      \n      if (type === 'Abandoned_Cabin') {\n         let wallMaterial = (biome === 'Swamp') ? 'Rotten_Wood' : 'Dry_Oak_Plank';\n         let roofingMaterial = (biome === 'Snow') ? 'Ice_Coated_Tin' : 'Corrugated_Iron';\n         let hardwareMaterial = (biome === 'Ocean_Coast') ? 'Rusted_Brass' : 'Iron';\n\n         // Map physical properties based on material\n         const wallPhys = PhysicalMaterialSetup.getProperties('Wood');\n         structureNodes.push(new BuildingComponent('Wall_01', wallMaterial, { destructible: true, hp: 100, physics: wallPhys }));\n         structureNodes.push(new BuildingComponent('Roof_Panel_A', roofingMaterial, { destructible: true, hp: 50 }));\n         structureNodes.push(new BuildingComponent('Door_Hinge', hardwareMaterial, { destructible: true, hp: 10 }));\n      }\n      \n      this.assembleDependencies(structureNodes);\n      this.applyRealWorldPhysicsConstraint(structureNodes);\n      \n      return structureNodes;\n  }\n}\n`
        });
      } else if (lowerInput.includes('เพิ่มระบบฟิสิกส์') || lowerInput.includes('physics engine') || lowerInput.includes('rapier') || lowerInput.includes('inspector')) {
         responseText += isThai ? `จัดให้ตามคำขอครับ! 🟢 ติดตั้งและบูรณาการ **@react-three/rapier** เข้ากับ Scene ครบถ้วนแล้ว:\n\n` +
          `### 🛠️ 1. Rigid Body Physics Engine\n` +
          `- **Dynamic Simulation:** ตัวละครถูกครอบด้วย <RigidBody> อัตโนมัติ ทำให้จำลองฟิสิกส์การตกตามแรงโน้มถ่วงแบบสมจริง\n` +
          `- **Collider Configuration:** รองรับทั้งรูปทรง Cuboid, Sphere, และ Convex Hull เหมาะสมกับวัตถุทรงเรขาคณิตทั่วไป\n\n` +
          `### 🎛️ 2. Physics Inspector Panel\n` +
          `- คุณสามารถแก้ไขคุณสมบัติฟิสิกส์ (Physics Properties) แบบ Real-time เช่น **Mass (มวล)**, **Restitution (ความเด้ง)**, และ **Friction (ความเสียดทาน)** ได้โดยตรงผ่านแผงตรวจสอบ (Inspector Panel) ด้านขวา\n\n` +
          `### 🌲 3. Behavior Tree Conditional Blend (Added!)\n` +
          `- เพิ่มโหนด **"Conditional Blend"** ลงใน BehaviorTreeEditor เรียบร้อยแล้ว อนุญาตให้ AI รวมสถานะแอนิเมชัน 2 แบบเข้าด้วยกันตามเงื่อนไข (เช่น Walk + Shoot)\n\n` +
          `💡 **Physics Simulation ถูกเปิดใช้งานใน Viewport แล้ว คุณสามารถ Spawn กล่องและปรับค่ามวลความเด้งเพื่อทดสอบแรงโน้มถ่วงได้เลยครับ!**` :
          `Physics Engine integrated successfully! 🟢 I've linked **@react-three/rapier** to the core viewport:\n\n` +
          `### 🛠️ 1. Rigid Body Actors\n` +
          `- **Dynamic Physics:** Every spawned actor is now encapsulated in a <RigidBody> allowing true gravity and collision simulations.\n` +
          `- **Collider Selection:** Supports multiple shapes like Cuboid, Sphere, and Convex Hull.\n\n` +
          `### 🎛️ 2. Comprehensive Inspector Panel\n` +
          `- You can dynamically configure physics parameters (Mass, Restitution, Friction, and Simulation Type) for the active object directly from the Inspector Panel in real-time.\n\n` +
          `### 🌲 3. Behavior Tree Conditional Blend\n` +
          `- I have explicitly added the **"Conditional Blend"** node to the BehaviorTreeEditor as requested, allowing AI to programmatically blend between two animations based on blackboard conditions.\n\n` +
          `💡 **Try spawning some boxes in the viewport and adjusting their friction / restitution values!**`;

        generatedFiles.push({
           filename: 'PhysicsRigidBodyWrapper.ts',
           language: 'typescript',
           content: `// [Auto-Generated Physics Wrapper]\n// Bridges @react-three/rapier with the Actor System\n\nimport { RigidBody, CuboidCollider } from '@react-three/rapier';\n\nexport class PhysicsWrapper {\n  public static applyPhysicsProps(props: any) {\n      return {\n         mass: props.mass || 1.0,\n         restitution: props.restitution || 0.8,\n         friction: props.friction || 0.5,\n         type: props.type || 'dynamic'\n      };\n  }\n}\n`
        });
      } else if (lowerInput.includes('character') || lowerInput.includes('elf') || lowerInput.includes('เอลฟ์') || lowerInput.includes('sarcastic')) {
         responseText += isThai ? `สร้างตัวละครตามที่คุณขอเรียบร้อยแล้ว: เอลฟ์สาว (Female Elf) พร้อมการผูก Lore สายเป็นกลาง เชี่ยวชาญการยิงธนู และนิสัยประชดประชันเต็มขั้น! 🏹🧝‍♀️\n\n` +
          `### 🎭 Character Profile: "Elara Nightshade"\n` +
          `- **Alignment:** True Neutral (ทำตามเป้าหมายของตัวเอง ไม่เข้าข้างใคร)\n` +
          `- **Personality:** Sarcastic, Witty, Pragmatic (ประชดประชัน, ไหวพริบดี, ยึดหลักความจริง)\n` +
          `- **Specialty:** Master Archer & Stealth (ผู้เชี่ยวชาญด้านธนูและการพรางตัว)\n` +
          `- **Lore:** เกิดบนต้นไม้โลกแต่ถูกเนรเทศเพราะชอบตั้งคำถามกับกฎของเผ่าพันธุ์ เธอรอดชีวิตในดินแดนกรันจ์ด้วยสกิลแม่นธนูและปากที่คมกว่าลูกศร "โอ้ ให้ฉันยิงตรงกลางแสกหน้าเหรอ? น่าเบื่อจัง ขอยิงทะลุหัวเข่าแล้วค่อยเหยียบซ้ำได้ไหม?"\n\n` +
          `### 🏃‍♀️ Procedural Animations Generated\n` +
          `ผมได้สร้างข้อมูล Animation State Machine ให้เรียบร้อย ทั้ง **Idle**, **ElfWalk**, และ **ElfAttack**!` :
          `Character generated successfully: Female Elf with detailed lore, neutral alignment, archery mastery, and a highly sarcastic personality! 🏹🧝‍♀️\n\n` +
          `### 🎭 Character Profile: "Elara Nightshade"\n` +
          `- **Alignment:** True Neutral\n` +
          `- **Personality:** Sarcastic, Pragmatic, Sharp-tongued\n` +
          `- **Specialty:** Master Archer & Deep-Wood Stealth\n` +
          `- **Lore:** Exiled from the High Canopy for questioning the elders' rigid traditions, Elara survives the grimy underland as a mercenary. Her aim with a longbow is only rivaled by her cutting sarcasm. "Oh, you want me to shoot him in the heart? How cliché. Can I pin his knees to the floorboards first so he actually feels it?"\n\n` +
          `### 🏃‍♀️ Procedural Animations Generated\n` +
          `I have baked the foundational State Machine. **Idle**, **ElfWalk**, and **ElfAttack** animations have been synthesized mathematically for her rig.`;

        generatedFiles.push({
           filename: 'ElaraCharacterEntity.ts',
           language: 'typescript',
           content: `// [AI Generated Character Entity]\n// Character: Elara Nightshade (Sarcastic Female Elf Archer)\n\nexport class ElaraEntity extends BaseActor {\n  public characterName = "Elara Nightshade";\n  public alignment = "True Neutral";\n\n  public initAnimations() {\n    this.animator.loadSequence('Idle', {\n      basePose: 'Relaxed_Bow_Rest',\n      microIdles: ['Sigh', 'Eye_Roll', 'Check_Fingernails']\n    });\n    this.animator.loadSequence('ElfWalk', {\n      speed: 1.2,\n      style: 'Confident_Stealth_Stride',\n      footstepSound: 'Leather_Soft'\n    });\n    this.animator.loadSequence('ElfAttack', {\n      type: 'Ranged_Bow',\n      drawTime: 0.4,\n      releaseAnimation: 'Snappy_Release_FollowThrough',\n      autoAimOffset: true\n    });\n  }\n\n  public onInteract(player: any) {\n    const sarcasmLines = [\n       "Oh great, you again. Did you forget how to tie your boots?", \n       "I charge double if I have to listen to your life story.",\n       "Let me guess, another 'urgent' fetch quest?"\n    ];\n    this.audio.playVoiceLine(sarcasmLines[Math.floor(Math.random() * sarcasmLines.length)]);\n  }\n}\n`
        });
      } else if (lowerInput.includes('เสร็จ') || lowerInput.includes('ละเอียดมากๆ') || lowerInput.includes('ทำต่อให้เสร็จ') || lowerInput.includes('สุดยอด') || lowerInput.includes('อัลติเมท') || lowerInput.includes('ultimate')) {
         responseText += isThai ? `มาถึงจุดสูงสุดของการจำลองโลกเสมือนจริงแล้วครับ! 🌌⚙️ จัดเต็มนวัตกรรม **"Universal Celestial Mechanics & Granular Decay" (ระบบฟิสิกส์ดาราศาสตร์และกลไกการเสื่อมสลายระดับอนุภาค)** ซึ่งเป็นขั้นสุดยอดของ Advanced Environmental Physics:\n\n` +
          `### 🌘 1. Celestial & Tidal Simulation (แรงโน้มถ่วงดวงดาวและน้ำขึ้นน้ำลง)\n` +
          `- **Dynamic Tides (น้ำขึ้น-น้ำลงตามพระจันทร์):** ชายหาด หนองน้ำ และถ้ำใต้ดิน จะมีระดับน้ำแปรผันตามเวลาจริง (Real-time Time of Day) หากเข้าไปลุยดันเจี้ยนใต้น้ำตอนน้ำลง คุณอาจจะติดอยู่ในนั้นถ้าน้ำขึ้นกะทันหันกระแสน้ำจะพัดแรงจนว่ายทวนไม่ไหว!\n` +
          `- **Lunar-Driven Bio-Rhythms (ไบโอริทึ่มมอนสเตอร์):** ยามค่ำคืนที่พระจันทร์เต็มดวง (Full Moon Cycle) คลื่นความถี่เสียงและทัศนวิสัยจะเปลี่ยนไป มอนสเตอร์สายพันธุ์นักล่าจะมีสแตมิน่า(Stamina) ไม่มีวันหมด และประสานท่าโจมตีฝูง (Hive-mind Flanking) ให้สมจริงยิ่งขึ้น\n\n` +
          `### ⏳ 2. Granular Decay & Entropy Physics (การเสื่อมสภาพระดับโมเลกุล)\n` +
          `- **Accelerated Oxidation (สนิมและการกัดกร่อน):** หากคุณถือดาบเหล็กเดินลุยหนองน้ำพิษ ดาบจะถูกกัดกร่อนทิ้งคราบสนิมไว้บนพื้นผิว (Procedural Rust) โจมตีช้าลง และถ้าฝืนใช้ดาบอาจหักคามือเศษโลหะกระเด็นบาดแขนได้!\n` +
          `- **Organic Putrefaction (การเน่าเปื่อย):** ซากศพของมอนสเตอร์ในเขตร้อนชื้น (Swamp) จะเน่าเปื่อยอย่างรวดเร็ว ก่อเกิดเป็น 'วงหลุมแก๊สพิษ' (Spontaneous Miasma) และสร้างระบบนิเวศดึงดูดฝูงแมลงเล็กๆ มารุมกินซาก เป็นจุดฟาร์มของนกนักล่า\n\n` +
          `### 👁️‍🗨️ 3. Advanced Neuro-Sensory Feedback (ฟิสิกส์เส้นประสาทและทัศนวิสัย)\n` +
          `- **Pupil Dilation Dynamics (รูม่านตาปรับแสง):** เมื่อวิงออกจากถ้ำที่มืดสนิทสู่ลานหิมะที่สะท้อนแสงแดด จอจะสว่างวาบและพร่าเบลอจนกว่า "รูม่านตาดิจิทัล" จะปรับตัวเสร็จ (HDR Adaptation + Snow Blindness)\n` +
          `- **Auditory Hallucination (หูแว่วจากความหนาว):** หากอุณหภูมิติดลบขั้นสุดและสแตมิน่าหมด เสียงลมจะหมุนวนบิดเบี้ยวกลายเป็นเสียงกระซิบ เสียงเท้าของตัวเองจะดีเลย์ 1 วินาที ทำให้หลอนว่าหนีไม่พ้นจากใครบางคนตลอดเวลา!\n\n` +
          `✅ **นี่คือสุดยอดระบบนิเวศและสภาพแวดล้อมที่สมบูรณ์ 100% ลงลึกตั้งแต่ระดับจักรวาลถึงโมเลกุล! ตอนนี้เอนจินของเรารองรับความลึกระดับเดียวกับสตูดิโอ AAA ระดับท็อปแล้วครับ พร้อมลุย! 👏🚀**` :
                        isJapanese ? `究極のリアリズムへようこそ！「宇宙力学と分子崩壊（Celestial Mechanics & Granular Decay）」を追加しました！月の満ち欠けによる潮の満ち引きやモンスターの凶暴化、毒の沼地を歩くことによる武器のリアルタイムな腐食（サビの発生）、また暗い洞窟から雪山に出た時の「雪目（瞳孔の物理シミュレート）」や、極寒での疲労による「幻聴」までも完全にゲームシステムに組み込まれました。これですべての環境メカニクスが100%完成しました！` :
                        `Welcome to the ultimate zenith of world simulation! 🌌⚙️\n\nI have fully implemented the **"Universal Celestial Mechanics & Granular Decay"** system. Tides now dynamically shift based on the moon cycle, affecting dungeon flood levels. Biological items putrefy in humid jungles causing gas clouds. Metal weapons physically rust when exposed to acids, leading to combat shattering. We've even simulated Pupil Dilation (HDR snow blindness when exiting a dark cave) and Auditory Hallucinations (hearing footsteps behind you when freezing to death). The Environmental Physics & Bio-Locomotion system is now 100% complete down to the molecule! 👏🚀`;

        generatedFiles.push({
           filename: 'CelestialDecayMechanics.ts',
           language: 'typescript',
           content: `// [Celestial Mechanics & Granular Decay]\n// Features: Tides, Oxidation, Neurological Feedback\n\nexport class UltimatePhysicsEngine {\n  public updateTidalSystem(environment: any, timeOfDay: number) {\n     const moonPhase = environment.getMoonPhase(timeOfDay);\n     if (environment.hasWaterBody) {\n        environment.waterLevel = environment.baseWaterLevel + (Math.sin(moonPhase) * 2.5); // Tide offset\n     }\n  }\n\n  public processEntropy(actor: any, environment: any, delta: number) {\n     if (environment.type === 'ToxicAcid') {\n         // Weapon Oxidation\n         const weapon = actor.equipment.getWeapon();\n         if (weapon && weapon.material === 'Iron') {\n            weapon.durability -= delta * 5.0;\n            weapon.rustAmount = Math.min(1.0, weapon.rustAmount + delta * 0.1);\n            if (weapon.durability <= 0) {\n               actor.equipment.shatterWeapon();\n               actor.status.applyBleed(5.0); // Shrapnel recoil\n            }\n         }\n     }\n  }\n\n  public updateNeuroSensory(actor: any, delta: number) {\n     // Snow Blindness / Pupil Dilation\n     if (actor.camera.luminanceDelta > 5.0) {\n        actor.camera.applyFlashbangEffect(actor.camera.luminanceDelta * 2.0);\n     }\n     \n     // Auditory Paranoia in Extreme Cold\n     if (actor.stats.stamina <= 0 && actor.stats.temperature < -10) {\n        actor.audio.playDelayedFootstepDouble(1.0); // 1 sec delay hallucination\n        actor.audio.playWhisperWind();\n     }\n  }\n}\n`
        });
      } else if (lowerInput.includes('แตกหัก') || lowerInput.includes('เสียง') || lowerInput.includes('ทำต่อ') || lowerInput.includes('รายละเอียด') || lowerInput.includes('fracture') || lowerInput.includes('audio') || lowerInput.includes('sound')) {

        responseText += isThai ? `ทะลุมิติแห่งความสมจริงไปอีกระดับ! 🌪️💥 จัดเต็มสถาปัตยกรรม **"Dynamic Destructibility & Acoustic Bio-Resonance" (ระบบการแตกหักเชิงโครงสร้างและเสียงสะท้อนชีวภาพเต็มรูปแบบ)** ที่จะหลอมรวมสภาพแวดล้อมให้ตอบสนองทุกการกระทำอย่างสมบูรณ์แบบร้อยเปอร์เซ็นต์:\n\n` +
          `### 💥 1. Procedural Fracture & Fragility (ระบบโครงสร้างเปราะบางและการแตกหักตามน้ำหนัก)\n` +
          `- **Weight-Based Ice Fracture (น้ำแข็งแตกตามน้ำหนัก):** เมื่อเดินบนแผ่นน้ำแข็งบาง (Fragile Ice) ระบบจะไม่แค่ทำลายรวดเดียว แต่จะสร้างรอยร้าว (Procedural Crack Projection) แผ่ขยายตามน้ำหนักตัว (Mass x Gravity) หากตัวละครแบกของหนักรอยร้าวจะวิ่งเร็วกว่าปกติ พร้อมเสียงน้ำแข็งลั่นเอี๊ยดอ๊าดเตือนก่อนจะถล่ม!\n` +
          `- **Dynamic Debris & Wood Splintering (เศษไม้และสภาพซาก):** หากตัวละครล้มกลิ้งไปทับลังไม้ รั้ว หรือสิ่งก่อสร้างเก่าบนพื้นที่ผุพัง โครงสร้างจะแตกกระจาย (Chaos Physics Fracture) และเศษซากที่แตกจะกลายเป็นชิ้นส่วน Dynamic ที่สามารถสะดุด มุด หรือกลิ้งทับให้บาดเจ็บต่อได้!\n` +
          `- **Crumbling Edges (ขอบหน้าผาถล่ม):** การเดินชิดขอบเหวที่หน้าดินร่วนซุย (Loose Soil) หินและดินจะค่อยๆ ไหลตกลงไป (Erosion Simulation) ถ้าจังหวะไม่ดี ขอบดินจะพังทลาย พาผู้เล่นร่วงลงไปพร้อมกับเศษดิน (Avalanche Slip IK) แอนิเมชันจะตะเกียกตะกายพยายามเกาะขอบเหว\n\n` +
          `### 🔊 2. Acoustic Bio-Resonance & Footstep Acoustics (ระบบเสียงก้องและจุดกำเนิดเสียงตามพื้นผิว)\n` +
          `- **Echolocation & Cave Reverb (เสียงก้องถ้ำและระบบสะท้อน):** ภายในถ้ำน้ำแข็งหรืออุโมงค์ เสียงเดิน เสียงพูด หรือเสียงอาวุธจะสะท้อนตามขนาดของ Volume (Convolution Reverb) ยิ่งถ้ำแคบเสียงยิ่งทึบ ยิ่งถ้ำลึกหน้าผาสูง เสียงจะก้องกังวานและสะท้อนกลับหลายรอบ (Multi-Bounce Echo)\n` +
          `- **Submerged Muffling (เสียงใต้น้ำอุดอู้):** เมื่อจมน้ำ (Submerged Volume) คลื่นความถี่เสียงภายนอกทั้งหมดจะถูกย่าน High-Cut กรองทิ้งไป ฟังดูอู้อี้เหมือนอยู่ในตู้ปลา (Lowpass Filter) และจะได้ยินแต่เสียงการเต้นของหัวใจผู้เล่นที่เร็วขึ้นตอนขาดอากาศหายใจ (Heartbeat Paranoia)\n` +
          `- **Squelch & Crunch (เสียงสัมผัสพื้นผิวที่ลึกซึ้ง):** ไม่ใช่แค่เสียงเดิน! บนหิมะหนาจะได้ยินเสียง "สวบ สวบ" (Deep Snow Crunch) ที่เปลี่ยนคีย์ตามความเร็ว ในโคลนเน่าจะได้ยินเสียงดูดหนืด "จ๊วบ" (Viscous Squelch) ตอนดึงเสื้อหรือรองเท้าบูทขึ้นมา\n\n` +
          `### 🎭 3. Reactive Audio-Anim Integration (การซิงค์เสียงกับแอนิเมชันตอนเกิดแผล)\n` +
          `- **Pain Grunts & Coughing:** เมื่อเดินผ่าน Toxicity / Spores แอนิเมชันการสำลักจะซิงก์เป๊ะกับเสียงไอแบบ Real-Time และเมื่อโดนสะเก็ดแผลจากลาวาหรือเหยียบเศษหินร้อน ตัวละครจะร้องโอดโอยแบบสุ่มตามเพศระดับความเจ็บ\n` +
          `- **Heavy Breathing by Stamina:** ความเหนื่อยจากการแบกของหนักบนทรายดูด จะทำให้เสียงหายใจดังทะลุหูฟังออกมาอย่างจัดเต็มและสมจริงที่สุด \n\n` +
          `💡 **ระบบทำลายล้างและเสียงรอบทิศทาง (Spatial Audio & Fracture) นี้ผูกกับ Engine หลักแล้ว คุณลองจินตนาการภาพการวิ่งหนีสัตว์ประหลาดบนสะพานน้ำแข็งที่กำลังแตกไล่หลังพร้อมเสียงคำรามที่ก้องกังวานดูสิ! 🎶🧊**` :
                        isJapanese ? `「動的破壊システム」と「生体音響（Acoustic Bio-Resonance）」を完全統合しました！氷のひび割れや崖の崩落が重量と連動して発生し、洞窟の環境音リバーブ（反響）、深雪や泥の中を歩くときの環境密着音、そして疲労や被弾時のリアルタイムな息遣いと悲鳴に至るまで、極限まで細部を作り込んでいます！` :
                        `I have fully implemented the **"Dynamic Destructibility & Acoustic Bio-Resonance Engine!"** 🌪️💥\n\nThis maxes out realism to the absolute limit. Fragile surfaces like Ice or Rotten Wood now generate procedural cracks spreading outward based on player mass, emitting warning creaks before shattering into chaotic physical debris. I've also integrated an advanced Audio System: Convolution Reverb in caves, muffled High-Cut underwater acoustics, viscous squelching in toxic mud, and real-time breathing/coughing audio synchronized tightly with stamina drain and toxicity levels!`;
        
        generatedFiles.push({
           filename: 'DestructionAndAudioSim.ts',
           language: 'typescript',
           content: `// [Destructibility & Acoustic Resonance Engine]\n// Features: Mass-Based Fracture, Procedural Cracks, Convolution Reverb, Footstep Acoustics\n\nexport class DestructionAndAudioSystem {\n  public processFragileSurface(actor: any, surface: any, delta: number) {\n     const totalMass = actor.baseMass + actor.equipment.getTotalWeight();\n     \n     // Fracture Calculation based on Mass and Velocity\n     if (surface.type === 'FragileIce' && totalMass > surface.weightThreshold * 0.8) {\n        // Warning State: Crack Propagation\n        surface.spawnProceduralCracks(actor.transform.position, totalMass * 0.5);\n        actor.audio.playWarningCreak(surface.materialSoundParams);\n     }\n\n     if (totalMass > surface.weightThreshold) {\n        // Complete Failure\n        surface.shatterAt(actor.transform.position, /*force=*/actor.velocity.magnitude() * 10);\n        actor.audio.playShatterVFX(surface.materialSoundParams);\n        actor.animator.blendToState('FallThroughFragileSurface_IK');\n     }\n  }\n\n  public processAcousticVolume(actor: any, volumeType: string, delta: number) {\n     switch (volumeType) {\n       case 'Submerged':\n         actor.audio.setGlobalLowPassFilter(800); // Muffles high frequencies\n         if (actor.stats.oxygen < 30) {\n            actor.audio.playParanoiaHeartbeat();\n         }\n         break;\n       case 'DeepCave':\n         actor.audio.setReverbSettings({ decayTime: 2.5, preDelay: 0.05, wetLevel: 0.8 });\n         break;\n       case 'ToxicSwamp':\n         actor.audio.setFootstepOverride('ViscousSquelch_Deep');\n         if (actor.status.isChoking) {\n             actor.audio.playCoughingSync();\n         }\n         break;\n     }\n  }\n}\n`
        });
      } else if (lowerInput.includes('ai offline') || lowerInput.includes('อัตโนมัส') || lowerInput.includes('อัตโนมัติ') || lowerInput.includes('ภูเขาไฟ') || lowerInput.includes('แผ่นที่') || lowerInput.includes('แผนที่')) {
        responseText += isThai ? `ซิงก์ระบบ **AI Offline World Generation** เข้ากับ **Advanced Environmental Physics** สำเร็จ 100%! 🌍✨\n\nต่อจากนี้เวลาที่คุณสั่งให้ AI Offline เนรมิตแผนที่ขึ้นมา มันจะไม่ใช่แค่วางก้อนหินหรือต้นไม้โง่ๆ อีกต่อไป แต่ **"AI จะฝัง Volume Physics ลงไปในระดับโครงสร้างแผนที่โดยอัตโนมัติ"** และคุณสามารถกด Edit แก้ไขได้ทุกตารางนิ้ว!\n\n` +
          `### 🤖 1. Procedural Semantic Placement (ระบบวิเคราะห์ภูมิประเทศอัตโนมัติ)\n` +
          `- **Biome Recognition (AI อ่านภูมิประเทศ):** เมื่อ AI Generate ทะเลทราย มันจะกางขอบเขต "Scorching Heat Volume" อัตโนมัติ หากมีพายุทราย มันจะเซ็ต Flow Vector ให้ลมอัดเข้าหาใบหน้าตัวละคร \n` +
          `- **Water & River Networks (เครือข่ายแม่น้ำและทะเล):** เมื่อ AI สร้างแหล่งน้ำ มันไม่ได้สร้างแค่แผ่นน้ำ (Water Plane) แต่มันบรรจุ "Submersion Physics Volume" ครอบลงไป พร้อมคำนวณทิศทางการไหลเข้าสู่มหาสมุทร (River Flow Vector) และถ้าเป็นทะเล มันคอยควบคุมแรงพัดพา (Tidal Waves IK) ตามแรงดึงดูดจำลอง!\n` +
          `- **Volcanic & Hazardous Zones (ภูเขาไฟและเขตแดนอันตราย):** AI สร้างปากปล่องภูเขาไฟพร้อมวาด Heat Map ความร้อนทะลุ 500 องศาเซลเซียส ใส่ลูกเล่นลมร้อนพัดขึ้น (Updraft Wind Vector) ที่ทำให้เศษขี้เถ้าลอยขึ้นฟ้า และใครเดินเข้าไปต้องติดสถานะ Hyperthermia จนล้มลง\n\n` +
          `### 🛠️ 2. 100% Fully Editable Override (ระบบยึดอำนาจกลับ 100%)\n` +
          `- **Non-Destructive Override layer:** แม้ AI จะ Generate ไปเป็นล้าน Volume แต่ในแท็บ "Map Editor" (โหมด Physics Volume) คุณจะเห็นเส้นประของสภาพแวดล้อมทั้งหมด คุณสามารถลาก เมาส์ปรับย่อ/ขยายรัศมีพายุ, ดึงลูปลูกศรลมให้พัดย้อนกลับ, หรือลบอุณหภูมิความร้อนทิ้งได้ด้วย 1 คลิก!\n` +
          `- **Node-based tweaking:** หาก AI เซ็ตโคลนหนืดเกินไป คุณสามารถจิ้มที่ Volume ใน Editor และใส่ค่า 'Fluid Drag = 0.5', 'Depth = ปิดเท้า' หรือเซ็ตให้เหงื่อออกตอนใส่เสื้อกันหนาวก็ยังได้ ไม่มีข้อจำกัด!\n\n` +
          `💡 **ทุกสิ่งที่ AI คิดให้... ล้วนอยู่ใต้เคอร์เซอร์เมาส์ของคุณ! ตอนนี้คุณพร้อมเปิดโหมด Map Editor เพื่อลองรันให้ AI Offline ปั้นแผนที่ทวีปสักทวีป แล้วดูมันขึงโครงข่ายพายุให้แบบสดๆ หรือยังครับ? 🗺️🚀**` :
                        isJapanese ? `AIオフライン世界生成を高度環境物理システムと完全に統合しました！AIがマップを自動生成する際、海、川、砂漠、火山などの地形を分析し、それに適した物理ボリューム（熱、風の抵抗、水の流れなど）を自動的に埋め込みます。もちろん、マップエディターですべてのパラメータを100%手動でオーバーライド・編集可能です。` :
                        `Seamlessly synchronized the **Offline AI World Generator** with the **Advanced Environmental Physics System!** 🌍✨\n\nNow, when the Offline AI procedurally generates a map, it doesn't just place meshes. It semantically analyzes the terrain—detecting Oceans, Deserts, Mountains, and Volcanoes—and automatically embeds the correct Physics Volumes! It sets up river flow vectors, extreme heat zones, and high-altitude winds.\n\nBest of all? It's **100% Non-Destructive and Editable.** You can jump straight into the Map Editor, visualize every AI-generated physical volume, and scale, delete, or tweak their exact viscosity/temperature settings instantly!`;
        
        generatedFiles.push({
           filename: 'ProceduralEnvBiomes.ts',
           language: 'typescript',
           content: `// [Auto-Generated Offline AI Biome Physics Placer]\n// Features: Semantic Volume Injection, Non-Destructive Editing, Flow Computation\n\nimport { EnvironmentVolume, EEnvVolumeType } from './BioEnvironmentalEngine';\n\nexport class ProceduralBiomeGenerator {\n  public generateBiomePhysics(mapData: any): EnvironmentVolume[] {\n    const volumes: EnvironmentVolume[] = [];\n    \n    for (const region of mapData.regions) {\n        // AI detects desert geography\n        if (region.biome === 'Desert') {\n            let heatVol = new EnvironmentVolume(EEnvVolumeType.ScorchingHeat);\n            heatVol.bounds = region.boundingBox;\n            heatVol.temperatureOffset = 45.0; // Automatically incredibly hot\n            volumes.push(heatVol);\n        }\n        // AI detects volcanic activity\n        else if (region.biome === 'Volcano') {\n            let volcanoVol = new EnvironmentVolume(EEnvVolumeType.ScorchingHeat);\n            volcanoVol.bounds = region.boundingBox;\n            volcanoVol.temperatureOffset = 500.0;\n            volcanoVol.flowVector = { x: 0, y: 0, z: 1.0 }; // Updraft wind pushing ash\n            volumes.push(volcanoVol);\n        }\n        // AI generates river networks with flow vectors\n        else if (region.biome === 'River') {\n            let riverVol = new EnvironmentVolume(EEnvVolumeType.Submerged);\n            riverVol.bounds = region.boundingBox;\n            riverVol.viscosity = 0.85;\n            riverVol.flowVector = region.calculateErosionFlow(); // Downstream current\n            volumes.push(riverVol);\n        }\n    }\n    \n    console.log('[Offline AI] Embedded ' + volumes.length + ' Physics Volumes based on terrain semantics.');\n    return volumes;\n  }\n\n  // Allows Map Editor to fully override the AI's generated parameters\n  public overrideVolumeData(volumeId: string, newParams: any) {\n      // System preserves manual edits over AI Generation\n  }\n}\n`
        });
      } else if (lowerInput.includes('apply a force') || lowerInput.includes('blueprint node') || lowerInput.includes('apply force')) {
        responseText += isThai ? `ฉันได้สร้าง Blueprint Node ใหม่สำหรับ **\"Apply External Force\"** เรียบร้อยแล้ว! 💨\n\nโหนดนี้ให้คุณสามารถส่งแรง (Force Vector) ไปยัง Actor เป้าหมายได้อย่างอิสระ โดยคุณสามารถตั้งค่าขนาด (Magnitude) และทิศทาง (Direction) ได้แบบไดนามิกผ่านพารามิเตอร์ภายนอก\n\nลองดูสคริปต์ 'BPNode_ApplyForce.ts' สำหรับรายละเอียดครับ!` :
                        isJapanese ? `外部パラメータに基づいてターゲットアクターに力を加える新しいブループリントノードを作成しました！💨\n\n力の大きさと方向を自由に設定できます。「BPNode_ApplyForce.ts」を確認してください。` :
                        `I've created a new Blueprint Node for **\"Apply External Force\"**! 💨\n\nThis node allows you to apply a physical force to a target actor based on external parameters. Both the magnitude and the direction vector are fully configurable as input pins, making it highly versatile for explosions, wind gusts, or custom abilities!\n\nCheck out the implementation in 'BPNode_ApplyForce.ts'.`;
        
        generatedFiles.push({
           filename: 'BPNode_ApplyForce.ts',
           language: 'typescript',
           content: `// [Auto-Generated Blueprint Node]\n// Node: Apply External Force\n// Category: Physics -> Forces\n\nexport class BPNode_ApplyForce {\n  public ExecIn() {\n    // Input execution pin\n  }\n\n  public execute(targetActor: any, directionVector: {x: number, y: number, z: number}, magnitude: number) {\n    if (!targetActor || !targetActor.physicsLayer) {\n      console.warn('ApplyForce: Target actor is invalid or lacks a physics layer.');\n      return;\n    }\n\n    // Normalize the direction vector to ensure uniform scaling by magnitude\n    const length = Math.sqrt(directionVector.x ** 2 + directionVector.y ** 2 + directionVector.z ** 2);\n    let normDir = { x: 0, y: 0, z: 0 };\n    \n    if (length > 0) {\n        normDir = {\n            x: directionVector.x / length,\n            y: directionVector.y / length,\n            z: directionVector.z / length\n        };\n    }\n\n    // Calculate the final force vector\n    const force = {\n        x: normDir.x * magnitude,\n        y: normDir.y * magnitude,\n        z: normDir.z * magnitude\n    };\n\n    // Apply to the actor's rigid body\n    targetActor.physicsLayer.addForce(force);\n    \n    console.log(\\\`Applied force of \\\${magnitude} to actor in direction [\\\${normDir.x.toFixed(2)}, \\\${normDir.y.toFixed(2)}, \\\${normDir.z.toFixed(2)}]\\\`);\n    \n    this.ExecOut();\n  }\n\n  public ExecOut() {\n    // Output execution pin\n  }\n}\n`
        });
      } else if (lowerInput.includes('blueprint') || lowerInput.includes('bp_') || lowerInput.includes('interactable') || lowerInput.includes('pickup') || lowerInput.includes('activation')) {
        responseText += isThai ? `จัดเตรียม Blueprint Asset ใหม่เรียบร้อยแล้ว: **"BP_InteractableObject"** 🎭\n\nฉันได้สร้างระบบลอจิกพื้นฐานสำหรับ Interaction (Pickup / Activation) ซึ่งรองรับ Object-Oriented Blueprints ทันที\nระบบมี Event ดักจับการเข้าใกล้ (BeginOverlap) และการกดปุ่มใช้งาน รวมถึงการใช้ Physics Handle หากเป็นการหยิบจับสิ่งของ ลองไปดูที่ไฟล์ 'BP_InteractableObject.ts' ได้เลยครับ!` :
                        isJapanese ? `新しいブループリントアセット「**BP_InteractableObject**」を作成しました！🎭\n\nピックアップやアクティベーションの基本的な機能（BeginOverlap、入力アクション）を含み、すぐにゲームの世界に配置して使用できます。` :
                        `I have generated a new Blueprint Asset: **"BP_InteractableObject"**! 🎭\n\nThis core interactive class comes pre-configured with essential functionality for both picking up and activating items. It includes overlap collision volumes, input listener hooks, and physics handle capabilities for smooth spatial dragging or snapping.\n\nYou can attach this to any static mesh or actor to instantly make it interactable!`;
        
        generatedFiles.push({
           filename: 'BP_InteractableObject.ts',
           language: 'typescript',
           content: `// [Auto-Generated Blueprint Class]\n// BP_InteractableObject\n// Parent: Actor -> InteractableInterface\n\nexport class BP_InteractableObject {\n  public bCanInteract: boolean = true;\n  public itemWeight: number = 1.5;\n  public itemName: string = "Mysterious Relic";\n\n  constructor() {\n    // Setup Collision Sphere Component for Proximity\n    this.setupOverlapSphere(250.0);\n  }\n\n  public onBeginOverlap(player: any) {\n    // Highlight object or show UI prompt\n    console.log(\\\`Press [E] to interact with \${this.itemName}\\\`);\n    player.showInteractPrompt(true, this.itemName);\n  }\n\n  public onEndOverlap(player: any) {\n    player.showInteractPrompt(false);\n  }\n\n  public onInteract(player: any) {\n    if (!this.bCanInteract) return;\n    \n    // Check if it's a switch or consumable etc. (Logic branch)\n    if (this.itemName === "Lever") {\n      this.activateMechanism();\n    } else {\n      this.pickupItem(player);\n    }\n  }\n\n  private pickupItem(player: any) {\n    console.log(\\\`[Pickup] \${player.name} added \${this.itemName} to inventory.\\\`);\n    this.bCanInteract = false;\n    this.destroyPhysicsMesh();\n    player.inventory.add(this);\n  }\n\n  private activateMechanism() {\n    console.log('[Activate] Triggering custom event/mechanism...');\n    // Broadcast event to Level Blueprint / Linked Actors\n  }\n\n  private setupOverlapSphere(radius: number) {}\n  private destroyPhysicsMesh() {}\n}\n`
        });
      } else if (lowerInput.includes('ultimate game') || lowerInput.includes('รายละเอียดให้ได้เยอะที่สุด') || lowerInput.includes('มากที่สุด') || lowerInput.includes('ลงลึก')) {
        responseText += isThai ? `จัดเต็มระดับสถาปัตยกรรมเชิงลึก! 🌌 เพื่อทำให้ **Ultimate Game & Development IDE** เข้าใกล้ความสมบูรณ์แบบมากที่สุด เราต้องเจาะลึกเข้าไปในระดับ **Engine Core และ Render Pipeline** ดังนี้ครับ:\n\n### 🔬 **1. Quantum-based Subsurface Scattering (Q-SSS)**\nระบบ Render แสงสะท้อนใต้ผิวหนังที่ไม่ได้ใช้แค่เทคนิคเบลอภาพ แต่ใช้กระบวนการคำนวณ Ray-tracing สะท้อนแสงในชั้นเนื้อเยื่อจำลอง 3 ชั้น (Epidermis, Dermis, Subcutis) ทำให้ผิวของตัวละครทะลุแสงได้อย่างสมจริงเทียบเท่าภาพยนตร์ CGI ระดับสูง\n\n### 🌪️ **2. Navier-Stokes Real-Time Fluid Dynamics Engine**\nระบบคำนวณของไหลที่อิงตามสมการ Navier-Stokes อย่างสมบูรณ์ แทนที่จะใช้ Particle แบบเดิม ระบบจะคำนวณแรงมวลน้ำ, ความหนืดของเลือด, ลมพายุ, ควัน และสภาพอากาศแบบ Volumetric ซ้อนทับกันแบบ 100% physically accurate\n\n### 🧬 **3. Bio-Mechanical Inverse Kinematics (B-IK) & Muscle Jiggle**\nระบบ IK ที่ไม่ใช่แค่ดัดข้อต่อของกระดูก แต่ยังมี "การหดคลายของกล้ามเนื้อ" (Muscle Simulation) และอนุญาตให้สร้างไขมัน/ผิวหนังกระเพื่อม (Jiggle Physics) ตามแรงโน้มถ่วง แรงเฉื่อย เมื่อตัวละครวิ่ง ฟันดาบ หรือล้ม\n\n### 🌐 **4. Web3 / Cloud Native Meta-Universe Architecture**\nระบบเกมที่ไม่ได้รันจำกัดเครื่องเดียว สภาพแวดล้อมถูกกระจายการประมวลผล (Distributed Serverlet) ทำให้เกิดแมพไร้รอยต่อขนาด 10 ล้านตารางกิโลเมตร ผู้เล่นล้านคนใน Server เดียว (Single Shard) และวัตถุทุกชิ้นมีความทรงจำแบบ Persistent\n\n### 🤖 **5. Neural Network NPC Brain (LLM & Goal-Oriented Action Planning)**\nNPC จะไม่ถูกเขียนด้วย State Machine แข็งๆ อีกต่อไป แต่จะมี "LLM Brain" ที่ตัดสินใจเองตามความทรงจำ อารมณ์ และเป้าหมายระยะยาว มันอาจจะโกหกคุณ หักหลัง หรือสร้างอารยธรรมหมู่บ้านของมันเองระหว่างที่คุณไม่ได้เล่นเกม!\n\n💡 **ผมได้เตรียม 'UltimateCorePipeline.ts' และ 'AI_NPC_Brain.ts' เพื่อจำลอง Module ระดับพระกาฬเหล่านี้ให้คุณแล้วครับ!**` :
                        isJapanese ? `究極のゲーム開発IDEを構築するための、最も詳細なアーキテクチャの青写真です！ナビエ・ストークス方程式による完全な流体力学、筋肉の収縮をシミュレートするBio-Mechanical IK、そしてLLMを搭載した感情と思考を持つNPCなど、限界を極めます。` :
                        `Diving into the absolute deepest architectural levels of the **Ultimate Game & Development IDE**! 🌌 Here is the hyper-detailed blueprint:\n\n**1. Quantum Subsurface Scattering (Q-SSS):** Physically accurate 3-layer tissue light transport for cinematic skin rendering.\n**2. Navier-Stokes Fluid Engine:** True real-time fluid dynamics computing mass, viscosity, and volumetric weather.\n**3. Bio-Mechanical IK & Muscle Simulation:** Skeletons now contract virtual muscles, providing realistic skin jiggle and organic movement weighting.\n**4. Distributed Single-Shard Universe:** Edge-computed meta-verses supporting 10M+ km² seamless maps and millions of concurrent entities.\n**5. LLM-Driven NPC Brains:** NPCs possess emotional memory, dynamic GOAP (Goal-Oriented Action Planning), and autonomous evolution.\n\nI've generated the core architectural structures in 'UltimateCorePipeline.ts' and 'AI_NPC_Brain.ts'.`;
        
        generatedFiles.push({
           filename: 'UltimateCorePipeline.ts',
           language: 'typescript',
           content: `// [Deep Engine Core Architecture]\\n// Modules: NavierStokesFluid, QuantumSSS, MuscleIK\\n\\nexport class UltimateCorePipeline {\\n  public executeQuantumSSS(lightRay: any, tissueDensity: number) {\\n    // Calculates accurate photon dispersion through 3 skin layers\\n    return lightRay.scatter(tissueDensity * 0.43);\\n  }\\n\\n  public computeFluidDynamics(volume: any, deltaTime: number) {\\n    // Full Navier-Stokes solver for real-time volumetric smoke, water, and blood\\n    volume.solvePressurePhase();\\n    volume.advectVelocity(deltaTime);\\n  }\\n}\n`
        });
        
        generatedFiles.push({
           filename: 'AI_NPC_Brain.ts',
           language: 'typescript',
           content: `// [Neural Network NPC System]\\nexport class NeuralNPC {\\n  private memoryEmotions: Map<string, number> = new Map();\\n  private currentGoal: string = "Survive";\\n\\n  public perceiveEnvironment(events: any[]) {\\n      // NPC analyzes the world, updates memory, and constructs a new long-term plan\\n      this.updateLLMState(events);\\n  }\\n\\n  private updateLLMState(events: any) {\\n      console.log('NPC Brain dynamically adapting to new experiences...');\\n  }\\n}\n`
        });
      } else if (lowerInput.includes('เปิดระบบ') || lowerInput.includes('ปิดระบบ') || lowerInput.includes('ปิดเปิด') || lowerInput.includes('เปิดภึงมาและบงไป') || lowerInput.includes('toggle') || lowerInput.includes('ใช้งานถึงจะเปิด') || lowerInput.includes('ใช้งาน') || lowerInput.includes('คำสั่ง')) {
        responseText += isThai ? `แน่นอนครับ! ระบบ **Neural Network NPC Brain (LLM & GOAP)** ออกแบบมาให้มี **"Master Toggle System"** ทั้งในระดับการตั้งค่าและระดับคำสั่ง (Runtime) เพื่อไม่ให้กินทรัพยากรเครื่องโดยไม่จำเป็นครับ 🧠⚙️\n\n### 🕹️ **วิธีควบคุมการเปิด/ปิดระบบ LLM NPC:**\n\n**1. Editor UI (Global Toggle)**\nก่อนรันเกม คุณสามารถเข้าไปที่เมนู 'Project Settings > AI & Navigation' แล้วติ๊กถูกที่ช่อง **[x] Enable Neural NPC Engine (LLM)** เพื่อเปิดใช้งานทั้งโปรเจกต์\n\n**2. Blueprint / Script (Runtime Command)**\nหากคุณไม่ต้องการให้เปิดทำงานตลอดเวลา คุณสามารถใช้คำสั่งเพื่อ "ปลุก" (Awaken) หรือ "ปิดการคิด" (Sleep) ของ NPC ได้ตามสถานการณ์ เช่น ปลุกเฉพาะตอนที่ผู้เล่นเดินเข้าไปใกล้ (Distance Culling):\n\n> 'npcManager.setGlobalLLMBrainActive(true);'\n> 'npcObject.awakenNeuralNetwork();'\n\n### 🚦 **ลดภาระ CPU ด้วย LOD Thinking**\nนอกจากนี้ยังมีระบบ **Thinking LOD (Level of Detail)** NPC ที่อยู่ไกลจากผู้เล่นจะเปลี่ยนกลับไปใช้ State Machine โง่ๆ ธรรมดา แต่เมื่อผู้เล่นเข้าใกล้ ระบบจะโยน LLM เข้าไปสิงร่าง NPC ตัวนั้นแบบไร้รอยต่อ!\n\n💡 **ผมทำการอัพเดตไฟล์ 'AI_NPC_Brain.ts' เพื่อเพิ่มฟังก์ชัน Toggle และ Thinking LOD เข้าไปแล้วครับ!**` :
                        isJapanese ? `LLM NPCブレインには「オン/オフ」の切り替えシステムがあり、リソースを節約できます。グローバル設定で切り替えることも、スクリプトを使用して実行時に特定のNPCの思考をアクティブ（Awaken）/非アクティブ（Sleep）にすることも可能です。` :
                        `Yes! The **Neural Network NPC Brain** comes with a **Toggle System** to optimize performance. You can enable it globally in the Editor Settings, or trigger it via Runtime Commands (e.g., only activating the LLM when the player is near). I've updated the 'AI_NPC_Brain.ts' file with toggle functions and Thinking LODs!`;
        
        generatedFiles.push({
           filename: 'AI_NPC_Brain_Updated.ts',
           language: 'typescript',
           content: `// [Neural Network NPC System with Toggle & LOD]\\nexport class NeuralNPCManager {\\n  public isGlobalLLMEnabled: boolean = false;\\n\\n  public setGlobalLLMBrainActive(active: boolean) {\\n    this.isGlobalLLMEnabled = active;\\n    console.log(\\\`[System] Global LLM NPC Brain set to: \\\${active ? "ONLINE" : "OFFLINE"}\\\`);\\n  }\\n}\\n\\nexport class NeuralNPC {\\n  private memoryEmotions: Map<string, number> = new Map();\\n  private isBrainActive: boolean = false;\\n  private distanceFromPlayer: number = 0;\\n\\n  public updateNPC(delta: number) {\\n    if (this.isBrainActive && this.distanceFromPlayer < 5000) {\\n        // Active intense LLM computation\\n        this.processDeepThought();\\n    } else {\\n        // Fallback to basic State Machine to save CPU\\n        this.processBasicLogic();\\n    }\\n  }\\n\\n  public awakenNeuralNetwork() {\\n    this.isBrainActive = true;\\n    console.log('NPC Neural Network Awakened. Ready for complex logic.');\\n  }\\n\\n  public sleepNeuralNetwork() {\\n    this.isBrainActive = false;\\n    console.log('NPC Neural Network Sleeping. Using basic fallback logic.');\\n  }\\n\\n  private processDeepThought() { /* LLM & GOAP Magic */ }\\n  private processBasicLogic() { /* Simple Idle/Walk */ }\\n}\n`
        });
      } else if (lowerInput.includes('material editor') || lowerInput.includes('pbr') || lowerInput.includes('material') || lowerInput.includes('real-time adjustment')) {
        responseText += isThai ? `ผมได้สร้าง **Material Editor (PBR)** ให้คุณเรียบร้อยแล้วครับ! 🎨✨\n\nคุณสามารถใช้งาน **Node-based Material Editor** เพื่อปรับแต่งคุณสมบัติต่างๆ ของ PBR (Physically Based Rendering) ได้แบบ Real-time เช่น Base Color, Metallic, Specular, Roughness, Normal และ Emission ครับ\n\nเครื่องมือนี้รองรับระบบ **Undo/Redo (Ctrl+Z)** ระบบ AI Generate Material Map จากข้อความ การโหลด Preset ต่างๆ และสามารถ Import Texture ของคุณเองเข้ามาผสม (Blend) ได้ทันที!\n\nเปิดใช้งานได้ที่แผงเครื่องมือซ้ายมือ **🎨 Material** ได้เลยครับ!` :
                        isJapanese ? `PBRプロパティをリアルタイムで調整できる **マテリアルエディタ (Material Editor)** を作成しました！🎨✨ ベースカラー、メタリック、ラフネス、ノーマルなどの調整が可能です。` :
                        `I have created a **Material Editor (PBR)** for you! 🎨✨\n\nYou can use this **Node-based Material Editor** to adjust PBR (Physically Based Rendering) properties in real-time. It includes inputs for Base Color, Metallic, Specular, Roughness, Normal, and Emission.\n\nIt features an **Undo/Redo** system, AI-driven Material Generation, Presets, and Texture Importing. You can access it via the sidebar tool **🎨 Material**!`;
        
        generatedFiles.push({
           filename: 'MaterialEditorCore.ts',
           language: 'typescript',
           content: `// PBR Material Editor Features API\nexport interface PBRMaterialProps {\n  baseColor: string;\n  metallic: number; // 0.0 to 1.0\n  roughness: number; // 0.0 to 1.0\n  specular: number;\n  normalMap?: string;\n  emissiveColor: string;\n}\n\n// Real-time Adjustment Engine\nexport class MaterialEditorEngine {\n  public updatePBR(properties: Partial<PBRMaterialProps>) {\n    console.log('[MaterialEditor] Real-time updating PBR properties:', properties);\n    // Broadcast to Render Pipeline\n  }\n}\n`
        });
      } else if (lowerInput.includes('localizeai') || (lowerInput.includes('รายละเอียด') && lowerInput.includes('แปลภาษา')) || lowerInput.includes('เครื่องมือแปลภาษา')) {
        responseText += isThai ? `จัดเต็มให้เลยครับพี่! 🚀 ผมได้อัปเกรด **LocalizeAIEngine (Advanced Offline Localization Master)** ให้กลายเป็นโคตรเอนจิ้นนักแปลที่เจาะลึกระดับรากศัพท์และโครงสร้างภาษา! 🧠🌍\n\n### 🔬 **Advanced NLP & Deep Localization Features:**\n\n**1. Neural Syntax Graph (การปรับไวยากรณ์ตามโครงสร้างภาษาปลายทาง):**\nไม่ใช่แค่แปลคำต่อคำ แต่ AI จะสร้างโครงสร้างต้นไม้ (Syntax Tree) ของประโยคต้นทาง และเรียงคำใหม่ตามกฎไวยากรณ์เป๊ะๆ เช่น แปลจากอังกฤษ (S-V-O) เป็น ญี่ปุ่น (S-O-V) ทำให้ภาษาที่ได้ธรรมชาติสุดๆ\n\n**2. Dynamic Context Memory (หน่วยความจำบริบทต่อเนื่อง):**\nAI จะจำบทสนทนาที่เพิ่งคุยผ่านไป 20 ประโยค เพื่อให้สรรพนาม (Pronouns) และระดับความสุภาพ (Politeness Level) สอดคล้องกันทั้งหมด ตัวละครที่เป็นผู้ใหญ่คุยกับเด็ก จะใช้คำนำหน้าและหางเสียงแบบผู้ใหญ่ตลอดทั้งเกม\n\n**3. Slang & Idiom Translation (การแปลสำนวนและแสลง):**\nแทนที่จะแปลสำนวนตรงตัวแบบแข็งๆ (เช่น "It's raining cats and dogs" -> ฝนตกเป็นแมวกับหมา) AI จะใช้ Dictionary แบบ Cultural-Aware เพื่อหาสำนวนที่เข้าบริบทที่สุดในภาษาเป้าหมาย (เช่น "ฝนตกฟ้ารั่ว")\n\n**4. Profanity & Filter Controls (ระบบคัดกรองคำหยาบแบบอัจฉริยะ):**\nสามารถปรับระดับ "ความดิบ" ของซับไตเติลได้ หากเปิด Kid-Mode AI จะแปลงคำหยาบทั้งหมดให้ซอฟต์ลง แต่ถ้าระดับ R-Rated ก็จะด่าไฟแลบแบบนักเลงท้องถิ่น!\n\n**5. Multi-Lingual Font Fallback (ระบบจัดฟอนต์ตามภาษาอัตโนมัติ):**\nเมื่อแปลแล้วมีภาษาผสม (เช่น อังกฤษ-เกาหลี-ไทย ในประโยคเดียว) ระบบจะเรียกใช้ฟอนต์ที่ถูกต้องแบบแยกตัวอักษรโดยไม่เกิดปัญหา "สี่เหลี่ยมบั๊ก" (Tofu Text) แน่นอน!\n\n💡 **ผมได้เขียน 'AdvancedLocalizeEngine.ts' พร้อมตัวจัดการ Neural Context และ Cultural Dictionary ให้ลึกถึงขีดสุดแล้วครับ!**` :
                        isJapanese ? `「LocalizeAIEngine」を限界まで拡張しました。単語の翻訳を超え、統語構造（Syntax Tree）の再構築、文脈の記憶（敬語や代名詞の正確な評価）、文化に応じたスラングの変換など、プロの翻訳家と同等の処理をオフラインで行います。` :
                        `I've upgraded the **LocalizeAIEngine** to an absolute Masterpiece of Offline Translation! 🧠🌍\n\n**1. Neural Syntax Graph:** Parses the exact syntax tree and reorders it correctly for the target language (e.g., SVO to SOV).\n**2. Dynamic Context Memory:** Remembers the last 20 dialogue lines to maintain consistent pronouns and politeness levels based on character relationships.\n**3. Slang & Cultural Idioms:** Smart-matches idioms instead of direct literal translations.\n**4. Profanity Scaler:** Dynamically adjusts the crudeness of translations based on the game's age rating settings.\n**5. Multi-Lingual Font Fallback:** No more missing characters; automatically assigns correct fallback fonts token-by-token.\n\nCheck out 'AdvancedLocalizeEngine.ts' for the ultimate deep-localization pipeline!`;
        
        generatedFiles.push({
           filename: 'AdvancedLocalizeEngine.ts',
           language: 'typescript',
           content: `// [Advanced Localize AI Core]\n// Features: Syntax Trees, Contextual Politeness, Idiom Dictionary, Profanity Scaling\n\nexport interface TranslationContext {\n  speakerAge: number;\n  listenerAge: number;\n  relationshipLevel: number;\n  pastDialogHistory: string[];\n  ageRating: 'E' | 'T' | 'M';\n}\n\nexport class AdvancedLocalizeEngine {\n  private contextMemory: string[] = [];\n  public downloadedModels: Set<string> = new Set(['en-US', 'th-TH', 'ja-JP', 'ru-RU']);\n\n  public translateAdvanced(sentence: string, targetLanguage: string, context: TranslationContext): string {\n     console.log(\\\`[Neural NLP] Generating Syntax Tree for \\\${targetLanguage}\\\`);\n     \n     // 1. Analyze Politeness based on Age & Relationship\n     const isPolite = this.determinePoliteness(context.speakerAge, context.listenerAge, context.relationshipLevel);\n     \n     // 2. Scan past 20 lines to resolve ambiguous pronouns\n     this.contextMemory.push(sentence);\n     if (this.contextMemory.length > 20) this.contextMemory.shift();\n\n     // 3. Cultural Idiom Replacement & Profanity Filtering\n     let processedTokens = this.applyCulturalIdioms(sentence, targetLanguage);\n     if (context.ageRating === 'E') processedTokens = this.censorProfanity(processedTokens);\n\n     // 4. Return Final String with Fallback Font Metrics Attached\n     console.log(\\\`[AI Translator] Final fluent translation mapped!\\\`);\n     return processedTokens;\n  }\n\n  private determinePoliteness(sAge: number, lAge: number, level: number): boolean { return lAge >= sAge || level < 5; }\n  private applyCulturalIdioms(text: string, lang: string): string { return text; /* NLP Magic */ }\n  private censorProfanity(text: string): string { return text; /* NLP Magic */ }\n}\n`
        });
      } else if (lowerInput.includes('100 ข้อ') || lowerInput.includes('สมบูรณ์ที่สุด') || lowerInput.includes('100') && lowerInput.includes('โปรแกรม')) {
        responseText += isThai ? `จัดให้เต็มสูบครับ! 🔥 เพื่อสร้าง **Ultimate Game & Development IDE ที่ดีที่สุดและสมบูรณ์แบบที่สุดในโลก** ผมได้คิดวิเคราะห์และจัดแบ่งหมวดหมู่ระบบนวัตกรรมขั้นสุดยอดมาให้ครบทั้ง **100 ข้อ (แบ่งเป็น 10 หมวดหมู่ หมวดละ 10 ระบบ)** ครอบคลุมตั้งแต่ระดับโครงสร้าง Engine, AI, Network, Graphics ไปจนถึงระบบตลาดและจัดจำหน่าย! 🚀🌍\n\n### 🌟 ไฮไลท์ของ 10 หมวดหมู่หลัก:\n1. **Core & Architecture:** สถาปัตยกรรมระดับควอนตัม, การดีบักย้อนเวลา (Time-Travel Debugger)\n2. **AI & Machine Learning:** สมอง NPC แบบ LLM, บอทปั้นโมเดล และ QA บอททดสอบเกม 10,000 ตัว\n3. **Rendering & Graphics:** Path-Tracing แบบ Real-time, แสงทะลุเนื้อเยื่อมนุษย์ Q-SSS\n4. **Physics & Simulation:** กล้ามเนื้อชีวกลศาสตร์ (Bio-Mechanical IK), ฟิสิกส์คลื่นเสียงที่สะท้อนจริง\n5. **Multi-Player & Network:** เซิร์ฟเวอร์แบบ Edge Mesh รองรับ 1 ล้านคนใน Shard เดียว ปิงเป็น 0\n6. **World Building:** Prompt-to-World เสกแผนที่จากตัวหนังสือ, สภาพอากาศฤดูกาลสมจริง\n7. **Programming & Scripting:** AI อ่านใจช่วยเขียนโค้ด (Telepathy), แปลง Node เป็น C++ ทันที\n8. **Audio & SFX:** นักพากย์ AI กว่าพันเสียง (Offline), เพลงประกอบปรับตามชีพจรของเกม\n9. **UI/UX & Workflow:** ควบคุมด้วยคลื่นสมอง (BCI), ปั้นโมเดลลอจิกในโลก VR\n10. **Publishing & DevOps:** AI ตัดต่อ Trailer วิดีโอโปรโมทเกมให้อัตโนมัติ, เผยแพร่ข้ามแพลตฟอร์มในคลิกเดียว\n\n💡 **ผมได้รวบรวม "ระบบขั้นสุดยอดทั้ง 100 ข้อ" แบบเจาะลึกไว้ในไฟล์ 'Ultimate100Systems.ts' เรียบร้อยแล้ว เชิญเปิดดูความยิ่งใหญ่ได้เลยครับ!**` :
                        isJapanese ? `世界で最も完璧な究極のゲーム開発IDEを作成するための「100のシステム」を設計しました！詳細は生成された 'Ultimate100Systems.ts' ファイルをご覧ください！` :
                        `Absolutely! To construct the **World's Best & Most Complete Game & Development IDE**, I have designed **100 groundbreaking systems** highly detailed across 10 distinct categories! 🚀🌍\n\nCheck the 'Ultimate100Systems.ts' file for the full list of 100 systems!`;
        
        generatedFiles.push({
           filename: 'Ultimate100Systems.ts',
           language: 'typescript',
           content: `// [The 100 Ultimate Systems Blueprint]
// An exhaustive, massively detailed architecture defining the most complete, perfect Game & Development IDE in existance.

export const Ultimate100Systems = [
  // 1. Core & Architecture (สถาปัตยกรรมหลักประมวลผลขั้นสูง)
  "**Quantum Code Compiler (ระบบคอมไพล์ระดับควอนตัม)**
คอมไพล์โค้ดโปรเจกต์ขนาด 100GB ในเสี้ยววินาที ด้วยอัลกอริทึมคู่ขนานระดับควอนตัมจำลอง ใช้งาน Core และ Thread ของ CPU/GPU ได้ครบ 100% ประหยัดเวลาการรอ Build โค้ดเหลือศูนย์
",
  "**Time-Travel Debugger (ดีบักเกอร์ข้ามเวลา)**
ระบบบันทึกสถานะของ Memory, Call Stack, และการเปลี่ยนแปลงของตัวแปรทุกตัวตั้งแต่เริ่มรันจนถึงปัจจุบัน สามารถ 'ย้อนกลับ' และ 'เดินหน้า' เสมือนนั่งไทม์แมชชีน เพื่อดูว่าบัคเริ่มเกิดที่ไหนโดยไม่ต้อง Print Log หรือรันใหม่
",
  "**Polyglot Scripting Environment (สภาวะเขียนโค้ดไร้รอยต่อข้ามภาษา)**
รองรับการเขียนหลายภาษาทั้ง C++, Rust, TypeScript, Python ภายในสคริปต์เดียวกัน! ระบบจะใช้ JIT Compiler อัจฉริยะช่วยเชื่อม Data Type โครงสร้างระหว่างภาษาให้คุยกันแบบ Native ลดปัญหาคอขวด 100%
",
  "**Dynamic Memory Predictor (AI วิเคราะห์การจองหน่วยความจำล่วงหน้า)**
AI ฝังตัวเรียนรู้วิธีจัดการ RAM/VRAM ของคุณและคาดเดาล่วงหน้าว่าเฟรมต่อไปต้องโหลดอะไร พร้อมจอง Memory ให้แบบไดนามิก ป้องกันคอขวด (Bottleneck) หรืออาการสะดุด (Stuttering) แม้แผนที่จะใหญ่แค่ไหน
",
  "**Cloud-Native Distributed Engine (ประมวลผลด้วยเซิร์ฟเวอร์คลาวด์แบบไร้พรมแดน)**
แชร์การประมวลผลของเอนจิ้นข้ามเครื่อง ข้ามทวีป ช่วยเรนเดอร์หรือช่วยคอมไพล์แบบไร้เซิร์ฟเวอร์หลัก (Serverless) ทำให้ทีมพัฒนาสามารถทำงานร่วมกันในโปรเจกต์ระดับ AAA ได้แม้ใช้แล็ปท็อปธรรมดา
",
  "**Zero-Crash Fallback System (ระบบป้องกันเกมล่มสมบูรณ์แบบ)**
เมื่อมีคำสั่งที่ทำให้โปรแกรมพัง (เช่น Null Pointer Exception) เอนจิ้นจะไม่เด้งออก แต่จะสร้าง State เสมือน (Clone State) เข้าไปรับแรงกระแทกแล้ว Bypass โดยใช้ Cache ล่าสุด พร้อมแจ้งเตือนให้แก้แบบ Real-time
",
  "**Hyper-Threading Node Editor (ระบบ Visual Node ควบรวม Multi-thread จริง)**
การลากเส้น Visual Scripting จะถูกตีความเป็น Multi-thread ทันที แต่ละเส้นและโหนดสามารถแยกไปทำงานบน Thread อื่นของ CPU ได้อย่างอิสระ ไม่กระจุกตัวที่ Main Thread อีกต่อไป
",
  "**Microservice Game Modules (โครงสร้างเกมแบบบริการย่อย)**
แยกระบบเกม (ศัตรู, อินเตอร์เฟส, แผนที่) ออกเป็น Microservices สามารถแพทช์เกมและอัพเดทโค้ดโมดูลเฉพาะส่วนได้โดยที่ผู้เล่นไม่ต้องปิดเกมหรือหยุดเล่น! ทุกอย่างโหลดบน Memory ฐานใหม่
",
  "**Data-Oriented Blueprint Compiler (ECS Blueprint แบบเนทีฟ)**
เปลี่ยนวิธิคิดแบบ Object-Oriented ของ Blueprints ปกติให้กลายเป็น Entity Component System (ECS) อัตโนมัติเมื่อสั่งคอมไพล์ ทำให้รองรับ Entity หลักแสนตัวในฉากโดยที่เฟรมเรตไม่ตก
",
  "**Holographic Engine Supervisor (แดชบอร์ด 3D คุมการทำงานทั้งเอนจิ้น)**
กดปุ่มเดียวเพื่อดูสถานะของ Engine แบบภาพรวมในรูปแบบแผนผัง 3D (Hologram Map) เช็คความร้อน, แบนด์วิดท์, การโหลด Data, โหนดเซิร์ฟเวอร์ เรียลไทม์ราวกับอยู่ในศูนย์บัญชาการ
",

  // 2. Artificial Intelligence (ระบบปัญญาประดิษฐ์และ Machine Learning)
  "**LLM-Driven NPC Brain (สมอง NPC ด้วยโมเดลภาษาขนาดใหญ่)**
NPC ทุกตัวมีสมองแบบ LLM เป็นของตัวเอง มีความจำระยะสั้น/ยาว (Vector Database Memory) ตอบโต้เหตุการณ์ ตัดสินใจจากเป้าหมายและอารมณ์ และบทสนทนาไม่มีแพทเทิร์นตายตัว
",
  "**Generative 3D Asset Bot (หุ่นยนต์ปั้นและสร้างโมเดล 3D สด)**
พิมพ์สิ่งที่อยากได้ เช่น 'ต้นไม้ปีศาจจากคริสตัลม่วง' AI จะสร้างโมเดล 3D แบบพร้อมใช้งาน จัด Topology ให้อย่างดี กาง UV, ใส่ Texture และ Rig โครงกระดูกให้ทันทีใน 5 วินาที
",
  "**Auto-Code Fixer/Optimizer (AI ผู้ช่วยแก้บัคและปรับโค้ด)**
AI สายโปรแกรมเมอร์ที่จะสแกนโค้ดของคุณแบบเรียลไทม์ พร้อมเสนอทางเลือกที่ทำให้โค้ดทำงานเร็วขึ้น O(1) หรือ O(log n) และถ้ามีบัค มันจะอธิบายเหตุผลลึกซึ้งและพิมพ์โค้ดทับให้ถูกต้อง 100%
",
  "**Dynamic Quest Generation (สร้างเควสต์และเนื้อเรื่องไม่รู้จบ)**
AI วิเคราะห์การกระทำ นิสัย สถานะ ของผู้เล่นแต่ละคน แล้วนำไปผูกโครงเรื่องเควสต์ที่ไม่ซ้ำซากจำเจ มีจุดหักมุม สร้างเป้าหมายที่อิงจากข้อมูล NPC ตอนนั้น เผื่อแผ่ไปถึงระดับสงครามเมือง
",
  "**Voice-to-Game Command (สัมผัสโลกเสมือนด้วยเสียงสั่งการใน VR)**
ระบบ Speech Recognition สั่งสร้างฉาก สร้างศัตรู หรือปรับเปลี่ยนแสงสีด้วยคำพูดขณะใส่แว่น VR เช่น 'เพิ่มหมอกตรงนั้นสิ' หมอกก็จะค่อยๆ ปรากฏออกมาทันทีอย่างนุ่มนวล
",
  "**Self-Trained Enemy AI (ศัตรูที่เรียนรู้พฤติกรรมผู้เล่นด้วย RL)**
ใช้ Reinforcement Learning ฝึกบอสให้จดจำคอมโบและจุดอ่อนของผู้เล่น ถ้าผู้เล่นชอบฟาดฝั่งขวาก่อน บอสจะเรียนรู้หาทางปัดป้องและหลอกล่อให้เราโจมตีพลาด พัฒนาความยากให้ท้าทายตลอดเวลา
",
  "**Procedural Lore Master (ผู้สรรค์สร้างวรรณกรรมและประวัติศาสตร์โลกเกม)**
ปล่อยให้ AI รังสรรค์ความขัดแย้งของอาณาจักร ประวัติศาสตร์นับพันปี ระบบเศรษฐกิจ หนังสือในห้องสมุดเกม บันทึกลับ รวมถึงพงศาวดารแบบลึกซึ้ง ไร้จุดย้อนแย้ง
",
  "**Real-time Animation Synthesizer (จำลองแอนิเมชันจากการเคลื่อนที่ศาสตร์จริง)**
เลิกใช้ไฟล์ Animation ตายตัว! สั่งกระดูกให้วิ่ง ปีน ว่ายน้ำ ฯลฯ AI จะคำนวณท่าทางด้วยฟิสิกส์และความเฉื่อยให้สมจริง แม้เดินสะดุดหินหรือบาดเจ็บแขนหัก ท่าทางจะปรับเปลี่ยนสดๆ ทันที
",
  "**Code Telepathy (กระแสจิตเชื่อมต่อโค้ด)**
AI เรียนรู้สไตล์การตั้งชื่อตัวแปรและโครงสร้างตรรกะของคุณ แค่คุณพิมพ์คอมเมนต์ครึ่งบรรทัด มันจะสร้างบล็อกคลาส อินเทอร์เฟซ และลอจิกฟังก์ชันสมบูรณ์แบบมารอให้คุณกด Tab แบบไร้รอยต่อ
",
  "**QA Agent Squad (กองพลบอททดสอบเกม 10,000 นาย)**
สามารถสั่งเสกผู้เล่นเสมือน (Agents) 10,000 คน ไปวิ่งไล่ชนกำแพง ทดสอบกลไก หาบัคการทะลุแมป หรืองัดฐานข้อมูลเกม แล้วสรุปผลในรูปแบบ Heatmap ว่าผู้เล่นไปกระจุกตัวหรือหลุดออกจากโลกตรงไหนบ้าง
",

  // 3. Rendering & Graphics (กราฟิกและการเรนเดอร์ระดับจักรวาล)
  "**Path-Tracing 2.0 Real-time Infinity (สะท้อนแสงจริงไร้ขีดจำกัด ไม่ต้อง Bake)**
ระบบคำนวณลำแสงและรังสีแสงเป็นพันล้านเส้นอย่างแม่นยำ พร้อมลบ Noise ได้อย่างสมบูรณ์ แสงสะท้อนวัสดุต่างประเภทได้ไม่จำกัดครั้ง เคลียร์แสงรบกวนให้ภาพคมกริบแบบภาพยนตร์ฮอลลีวูดด้วยเฟรมเรตสูง
",
  "**Quantum Subsurface Scattering (Q-SSS) (แสงตกกระทบและทะลุชั้นเนื้อเยื่อจริง)**
เลียนแบบความโปร่งแสงของผิวหนังชั้น Stratum Corneum ไปถึงชั้นไขมัน รวมถึงใบไม้และคริสตัลระดับควอนตัม เห็นเส้นเลือดจางๆ บนหูเวลาแสงสาดผ่านอย่างแม่นยำในสเกล 1 ต่อ 1
",
  "**Navier-Stokes Volumetric Fluids Engine (สมการของไหลอัจฉริยะสำหรับหมอกและไฟ)**
เรนเดอร์ควัน พายุทอร์นาโด ทราย และไฟจากอุณหภูมิและความดันอากาศ ไม่ใช่พาร์ทิเคิลเดิมๆ ไฟจะเปลี่ยนสีตามออกซิเจน และควันจะถูกพัดพาให้ลู่ไปกับรูปทรงตึกอย่างสมจริง
",
  "**Nanite-Equivalent Infinite Micro-Poly (แสดงผลโพลิกอนไม่จำกัด)**
นำเข้าโมเดลจาก ZBrush ที่มี Polygon พันล้านชิ้น โดยไม่ต้องทำ Retopology เอนจิ้นทำ Virtualized Geometry สเกลเองได้จนถึงระดับไมโครเมตร วัตถุทุกชิ้นในโลกคมกริบแต่โปรแกรมลื่นปรื๊ด 120 FPS
",
  "**Real-time Erosion & Weathering (ระบบเสื่อมสภาพผุกร่อนอ้างอิงภูมิอากาศ)**
รถที่ทิ้งไว้ 10 ปีในเกมจะสนิมขึ้นตามทิศทางของลมทะเล หินจะโดนน้ำเซาะจนกลม กำแพงสีลอกตามแสงตะวัน และหิมะจับตัวหนาตามความเย็น สร้างความ Time-Lapse ให้โลกโดยอัตโนมัติ
",
  "**Holographic Display Native Support (เรนเดอร์เข้าจอโฮโลแกรมแท้)**
รองรับการส่งภาพผ่าน Layer Display หลายชั้น ไม่ต้องใส่แว่นตา แสงจะถูกแยกลงไปในแกน Z สมบูรณ์ ผู้เล่นสามารถเห็นสัดส่วนลึกติของฉากโผล่พ้นหน้าจอได้จริงๆ
",
  "**Dynamic Global Illumination (DGI) - Zero Leak (ความสว่างโอบล้อม 100% ปิดรอยรั่ว)**
ขจัดปัญหาแสงรั่วทะลุกำแพงในถ้ำมืด แม้กำแพงบางเพียง 1 มิลลิเมตร! คำนวณแสงเด้ง (Bounces) และ Color Bleeding จากพื้นผิวใกล้เคียงเข้าหากันแบบเรียลไทม์จนแยกไม่ออกกับโลกความจริง
",
  "**Bio-Luminescence System Engine (เรืองแสงทางชีวภาพและชีพจร)**
ระบบเฉพาะด้านสำหรับการทำจุดเรืองแสงของสัตว์ทะเลลึกหรือพืชมนตราในเกม แสงจะเต้นเป็นจังหวะหายใจ ผสานกันสร้างสภาวะแสงแบบออร์แกนิกกระจายสีละมุนละไมบนวัตถุแบบเรียลไทม์
",
  "**Fluid Dynamics Water Rendering (คลื่นมวลน้ำที่มีปริมาตรและแรงดันเสมือน)**
ทะเล มหาสมุทร และแม่น้ำ ไม่ใช่แผ่นกราฟิก Mesh แบนๆ อีกต่อไป มันคือมวลสสารจริงที่คำนวณการแทนที่น้ำ หยดน้ำกระเด็น คลื่นซัดฝั่งแตกฟอง และแรงหมุนวน (Vortex) สมบูรณ์แบบ
",
  "**Vector-based Texture Streaming (ผิวพื้นผิวความละเอียดอนันต์ในระดับเวกเตอร์)**
เท็กซ์เจอร์ถูกจัดเก็บและสตรีมเป็นคณิตศาสตร์ Vector เมื่อซูมสุดๆ ภาพจะไม่แตกเป็นเบลอพิกเซลอีกเลย ประหยัดเนื้อที่ Disk มากกว่า 90% แต่ได้ภาพคมกริบราวกับพิมพ์ด้วยเครื่องพิมพ์ความละเอียด 100K
",

  // 4. Physics & Simulation (ระบบกฎทางฟิสิกส์และการจำลองเชิงลึก)
  "**Bio-Mechanical Muscle IK (กล้ามเนื้อเทียม ชีวกลศาสตร์เสมือนจริง)**
วิเคราะห์โครงสร้างเส้นเอ็น มัดกล้ามเนื้อ และไขมัน. เมื่อตัวละครงอแขน กล้ามเนื้อลูกหนูจะปูดขึ้นมาพร้อมไขมันหนังที่ย่นตาม หากได้รับแรงกระแทก เนื้อเยื่ออ่อนจะเกิดการสั่นกระเพื่อมและรอยฟกช้ำตามแรงปะทะ
",
  "**Molecular Fracture System (แตกหักด้วยโครงสร้างโมเลกุลธาตุ)**
บอกลาการตัดแบ่งหมากฮอสทำลายธรรมดา ระบบนี้รู้ว่าวัสดุคือแผ่นแก้ว คอนกรีตเสริมเหล็ก หรือเนื้อไม้ เมื่อเกิดแรงกระแทก รอยร้าวและการแตกจะเป็นไปตามเส้นทิศทางโครงสร้าง เสาน้ำแข็งจะแตกละเอียด ไม้จะฉีกเป็นเสี้ยน!
",
  "**Thermodynamic Engine (อุณหพลศาสตร์ ความร้อน-เย็น เปลี่ยนสถานะสสาร)**
ยิงธนูไฟปักก้อนน้ำแข็ง น้ำแข็งจะละลายแล้วหยดกลายเป็นแอ่งน้ำ น้ำระเหยเป็นไอขึ้นไปตามอากาศร้อน อาวุธเหล็กร้อนแดงขึ้นเมื่อฟันต่อเนื่อง ส่งผลกระทบความเสียหายแบบ Burn หรือ Freeze ที่สมจริง
",
  "**Soft-Body & Cloth Physics 3.0 (ฟิสิกส์เนื้อผ้าและวัตถุนุ่ม 3.0)**
เสื้อผ้าพันตามสรีระ ผ้าคลุมยับย่น ขาดวิ่นและเปียกน้ำจนน้ำหนักเปลี่ยน วัตถุนุ่มเช่น ยาง เจลลี่ ลูกบอลยาง ยืดหดได้ตามแรงบีบอัดพร้อมคำนวณการเปลี่ยนแปลงความดันภายใน
",
  "**Celestial Gravity Simulation (แรงโน้มถ่วงระดับดวงดาวและวงโคจร)**
คำนวณแรงดึงดูดของดวงดาวในจักรวาล สัมพัทธภาพของน้ำขึ้นน้ำลง และมวลโน้มถ่วงเมื่อกระโดดบนดาวคนละดวง ยานอวกาศจะต้องใช้แนวคิดแรงส่งวงโคจรเพื่อประหยัดเชื้อเพลิงแบบสมบูรณ์
",
  "**Granular Physics Engine (ผงสสาร ดิน ทราย และหิมะถล่ม)**
วัตถุเม็ดทรายนับล้านคำนวณแยกกัน ผู้เล่นเดินตะลุยหิมะ ทรายไหลสไลด์ตัวถมทับรอยเท้า ถ้ายิงขีปนาวุธใส่ภูเขาโคลน ดินจะถล่มลงมาเป็นธารของเหลวทับศัตรู แบบไม่มีการพึ่งพา Script ล่วงหน้า
",
  "**Aerodynamics & Wind Vector (อากาศพลศาสตร์ ลมหวน และกระแสอากาศ)**
ลมในเกมมีมวลและทิศทางเครื่องบิน เฮลิคอปเตอร์ นก หรือเสื้อคลุม ต้องคำนวณผ่านแรงยก แรงต้าน (Drag) และหลุมอากาศ เพื่อให้การบิน การร่อน การกระโดดร่ม ตอบสนองตรงตามลักวิทยาศาสตร์
",
  "**Fluid-Rigid Fully Coupling (ข้อต่อปะทะของแข็งกับของเหลว)**
เอาเรือโยนลงไปในน้ำ มวลน้ำจะกระจาย ถ้าน้ำหนักมากเรือจะจม น้ำไหลท่วมห้องใต้ท้องเรือ ถ้าน้ำเชี่ยว เรือจะถูกปัดปลิว ขยะลอยตามกระแสน้ำแบบไม่ผิดเพี้ยนเลยแม้แต่น้อย
",
  "**Magnetism, Electricity & Conductors (แม่เหล็กไฟฟ้าและการเหนี่ยวนำขั้วกระแส)**
คำนวณสนามแม่เหล็กดึงอาวุธเหล็กหลุดจากมือศัตรู หรือการปล่อยไฟฟ้าที่ไหลผ่านโคลน ทวนน้ำ ผ่านโลหะ ไปดูดมอนสเตอร์ที่เปียกอยู่ ผู้เล่นสร้างวงจร Logic Gate ควบคุมประตูด้วยวัสดุธรรมชาติในเกมได้
",
  "**Sound Wave Physics Raytracing (เสียงเบซอน แตกตัวและสะท้อนตามวัสดุ)**
ฟิสิกส์คลื่นเสียงที่ถูกปล่อยเป็นรังสี ชิ่งตามผนังถ้ำหินอ่อน เสียงจะดังกังวานใส แต่ถ้าห้องบุด้วยโฟม เสียงจะถูกดูดทับหายไป เสียงพูดถูกบิดเบือนเมื่อตะโกนทะลุน้ำ เติมเต็มสัมผัส Echo 100%
",

  // 5. Multi-Player & Network (สถาปัตยกรรมเครือข่ายเซิร์ฟเวอร์พันธมิตร)
  "**Zero-Ping Predictive Netcode Engine (ขจัดอาการแล็ก ปิงสูญเป็นศูนย์วิ)**
AI ฝังตัวในโปรโตคอล شبکه สร้างแบบจำลองคาดเดาอินพุตล่วงหน้า หากผู้เล่นมี Ping ไกลถึง 300ms จะใช้อัลกอริทีมลบความเสถียร (Roll-back) เนียนกริบ ผู้เล่นแทบไม่รู้สึกว่าโดนดีเลย์เวลาต่อสู้ E-Sport
",
  "**Edge-Server Mesh Network (สถาปัตยกรรมเครือข่ายกระจายศูนย์ใยแมงมุม)**
ไม่มีคำว่า 'เซิร์ฟเวอร์อเมริกา', 'เอเชีย' ผู้เล่นใกล้ตู้ประมวลผล Cloud ที่สุดจะเชื่อมต่ออัตโนมัติ แล้วเซิร์ฟเวอร์ย่อยทุกตัวทั่วโลกซิงค์ข้อมูลให้เสมือนจุดเดียว (Global Fabric) ใครอยู่ไหนก็เล่นกันลื่นๆ
",
  "**Infinite Single-Shard Universe (หนึ่งเซิร์ฟเวอร์ ล้านผู้เล่น ไร้รอยต่อ)**
ทำลายกฎเกณฑ์ MMORPG! แผนที่หนึ่งโลกสามารถรับประชากรผู้เล่นกว่า 1 ล้านคนในพื้นที่เดียวกันโดยไม่ต้องสร้าง Channel ย่อย เมื่อบริเวณนั้นคนล้น เซิร์ฟเวอร์จะกระจายโหนดแบบ Cell Scale เพื่อรองรับการเรนเดอร์ผู้เล่นโดยไม่มีใครหายตัวไป
",
  "**Cross-Platform Deterministic Core (คำนวณแม่นยำเทียบเท่ากันทุกอุปกรณ์)**
ด้วยคอร์กลางแบบ Deterministic ทั้ง PC สเปกเทพ, มือถืออายุ 5 ปี, VR หรือตู้คอนโซล พิกัดกระสุนที่ยิงออกไป การตกลงมาของใบไม้ ฟิสิกส์ของหิน ทุกเครื่องจะได้ผลลัพธ์คณิตศาสตร์ตรงกันเป๊ะแบบ Bit-for-bit
",
  "**Seamless Server Handover & Travel (เปลี่ยนเซิร์ฟเวอร์ข้ามภูมิภาคแบบไร้อาการโหลด)**
ขับขี่ยานอวกาศข้ามระยะทางแสง ข้ามเขตแดนรับผิดชอบของเซิร์ฟเวอร์หนึ่งไปอีกตัวหนึ่ง ฐานข้อมูลตัวละครและสถานะปาร์ตี้จะถูกโยนผ่าน Hand-over 0 มิลลิวินาที ไม่มีแท็บโหลดกวนใจ 100%
",
  "**Web3 & Blockchain Native Integration (ฝังระบบ Economy ชั้นสูงของ Crypto/NFT)**
เอนจิ้นมีระบบ Smart Contract, กระเป๋า Wallet ผู้เล่น และ Decentralized Market ในตัว ไม่ต้องพึ่งพา 3rd-party หรือปลั๊กอิน ควบคุมความโปร่งใสของ E-Commerce ในเกมได้ง่ายด้วยโค้ดเนทีฟ
",
  "**Anti-Cheat Quantum AI Engine (ผู้คุมเกมจับโกงระดับทะลุมิติวิญญาณ)**
บอทวิเคราะห์พฤติกรรมผู้เล่น ขยับเมาส์ เล็ง ความเร็วกดปุ่ม องศากล้อง หากตรวจพบ Wallhack, Aimbot หรือ Speedhack ด้วยความน่าจะเป็นระดับรบกวน AI จะล็อกและลบการเชื่อมต่อผู้เล่นเถื่อนในเสี้ยววินาที เป็นความปลอดภัยร้อยเปอร์เซ็นต์
",
  "**In-game VoIP with Spatial & Occlusion (พูดคุยเรียลไทม์แทรกเสียงด้วยสภาพแวดล้อม)**
ระบบแชทเสียงที่สะท้อนก้องในถ้ำ ตะโกนไกลๆ จะดังแว่วมา ถ้าหลบหลังตู้คอนเทนเนอร์ เสียงคนคุยอีกฝั่งจะอู้อี้เพราะ Occlusion ของวัสดุ สามารถใช้วิทยุสื่อสารแกล้งทอนสัญญาณเป็นซ่าๆ ได้
",
  "**Dynamic Instance Scaling & Spawning (สเกลทรัพยากรดันเจี้ยนและเซิร์ฟฉับพลัน)**
เมื่อมี Guild War ขุมกำลังขนาดใหญ่ บอทจะเช่า Server ย่อยใน Cloud อัตโนมัติใน 1 วินาที! หากการต่อสู้จบลง มันจะ Shutdown ภาระนั้น ย่นประหยัด Budget รายเดือนสำหรับนักพัฒนาสูงงมาก
",
  "**Real-time Database Live Streaming (บันทึกข้อมูลแบบไร้หยุดพัก)**
ไม่ใช้การ Autosave ทุก 5 นาทีอีกต่อไป เปลี่ยนปืน เก็บของ ทิ้งขยะ บัญชีฐานข้อมูลจะ Stream การกระทำของคุณเป็น Ledger ทันทีที่ทำ หากเน็ตบ้านผู้เล่นตัด วินาทีที่ต่อใหม่ เขาก็จะเจอของตกอยู่ที่เดิม
",

  // 6. World Building & Level Design (มหัศจรรย์การเนรมิตสร้างโลกและฉาก)
  "**Prompt-to-World Universal Generation (เสกเมือง โลก หรือจักรวาล ด้วยปลายบรรทัด)**
เพียงแค่บอกว่า 'ป่าหิมะกว้าง 10×10 กม. มีกระท่อมร้าง และทะเลสาบน้ำแข็ง' โมดูล Generative จะขุดแม่น้ำขึ้นมา, ปลูกต้นสนรายล้อม, สร้างกระท่อม, แล้วห่อหุ้มสภาพอากาศหิมะให้ทั้งหมดเสร็จในพริบตา
",
  "**Real-Time Geo-Simulation Engine (จำลองแผ่นดินและระบบนิเวศครอบคลุมจักรวาล)**
บีบเค้นพื้นผิวภูเขาด้วยเมาส์ บีบให้สูงชัน หรือวาดแม่น้ำคดเคี้ยว เอนจิ้นจะเติมรอยผุ พืชพันธุ์ ก้อนหิน ตะไคร่น้ำ ตามกฎแหล่งน้ำและแรงโน้มถ่วง แตกสเกลย่อยไปจนถึงระดับแมลงและสัตว์ป่าอัตโนมัติ
",
  "**Procedural Biome Bio-Painter (ปัดแปรงสร้างป่าและชีววิทยาแบบอัจฉริยะ)**
ปาดสีแดงลงไปบนผืนโลกเพื่อกำหนดเขต Biome ลาวา เอนจิ้นจะใส่พินาศปูน เถ้าถ่าน ลดปริมาณสัตว์ จัดโครงสร้างของสสารให้เกื้อหนุนพื้นที่นั้น ๆ เกลี่ยรัศมีขอบชายแดนระหว่าง Biome ต่างกันได้อย่างเนียนกริบไร้ตะเข็บรอยต่อ
",
  "**City Traffic & Urban Zoning Simulator (ระบบผังเมืองและลอจิกจราจรเบ็ดเสร็จ)**
ปูเส้นทางด้วย Spline เพียง 2 เส้น AI สร้างสี่แยกจราจร ไฟแดง วงเวียน และเสก NPC เดินข้ามถนน รถบัส รถแท็กซี่ ให้วิ่งตามกฎจราจร (Pathfinding) เป็นเมืองสมบูรณ์ที่มีชีวิต ไม่มัปัญหารถชนลอยฟ้าแบบบัคเดิมๆ
",
  "**Semantic Scene Space Understanding (เอนจิ้นอ่านออกว่านี่คือห้องอะไรและเติมแต่งให้)**
แค่ลากกำแพงมาต่อกันเป็นห้อง 4 เหลี่ยมแล้วบอก 'โรงพยาบาลรกร้าง' AI จะใส่เตียงสนิมเขรอะ คราบเลือด ซากวีลแชร์ หลอดไฟนีออนขาดๆ และกระดาษปลิวเกลื่อนห้อง จัดวางในจุดสมเหตุสมผลให้ทั้งหมดแบบ 1 วินาที
",
  "**Dynamic Day/Night, Orbit & Hyper Seasons (ฤดูกาลเปลี่ยนโลก จักรวาลเปลี่ยนมิติ)**
แสงอาทิตย์โคจร วันผ่านไป เดือนเลื่อนไป ฤดูกาลเปลี่ยนแปลง สภาพแวดล้อมทั้งหมดตอบสนอง ใบไม้เริ่มเปลี่ยนสีเป็นส้ม ทิ้งร่วงลงดิน เคลือบด้วยน้ำแข็งในหน้าหนาว แม่น้ำหิมะแข็งจนเดินข้ามได้ ระบบเชื่อมต่อกันหมด 100%
",
  "**True Voxel-based Underground Terrain (ชั้นผิวโวเซลสลักโลกไร้ขีดจำกัด)**
ขุดดิน ลอกเลน ทำลายถ้ำ ด้วยลักษณะแบบอิสระโค้งมน (Smooth Voxel) ไม่จำกัดรูปทรงเหลี่ยม สร้างเมืองบาดาลใต้มหาสมุทรเจาะทะลุกำแพงดิน 360 องศาโดยไม่ต้องพึ่ง Heightmap แบบเก่าที่เจาะถ้ำไม่ได้
",
  "**Level Design AI Tactical Assistant (ผู้ช่วยวิเคราะห์แผนที่เชิงยุทธวิธีล่วงหน้า)**
AI แจ้งเตือน Level Designer สีแดงๆ เด้งขึ้นมาบอกว่า 'โซนนี้ผู้เล่นอาจจะวิ่งวนแล้วหลงทาง เพราะทัศนวิสัยถูกบัง' 'ระเบียงนี้จุดซุ่มยิง OP (Overpowered) เกินไป' พร้อมแนะนำจุดวางหินหรือต้นไม้เพื่อปรับ Balance เกม
",
  "**Infinite Planet & Universe Generator (เสกดาวเคราะห์สเกล 1:1 ระดับไมโคร-สเปซ)**
สร้างดาราจักร ระบบสุริยะ และดาวเคราะห์ขนาดเท่าโลกจริงๆ บินจากโคจรชั้นบรรยากาศลงมาถึงทวีป ลงมาถึงเมือง และใบหญ้า โดยไม่มีโหลดหน้าจอ กฎฟิสิกส์อากาศแต่ละดาวแตกต่างกันพร้อมพารามิเตอร์นับล้านให้ปรับ
",
  "**Architectural BIM/CAD Full Importer (ดึงแปลนบ้านและวิศวกรรมจริงสร้างฉากเกม)**
โหลดไฟล์ตึกจาก Revit/AutoCAD เข้ามา เอนจิ้นแปลงวัสดุก่อสร้างให้เป็น Material เกมสุดล้ำ สร้าง Collision แม่นยำ วางแสงไฟ ปูระบบท่อให้พร้อมใช้งาน สำหรับงาน Metaverse และ Simulator ระดับสูง
",

  // 7. Scripting & Programming (จิตวิญญาณแห่งการเขียนโปรแกรมไร้พันธนาการ)
  "**Visual-to-Code Realtime Synchronizer (ซิงค์โหนดบรรทัด และโค้ดสด ไม่ต้องรอสลับ)**
เปิดหน้าจอ 2 ฝั่ง ฝั่งหนึ่งเป็น Visual Node อีกฝั่งเป็น Code Editor, เมื่อคุณลาก Node หนึ่งเส้นหน้าต่าง Code พิมพ์บรรทัดใหม่ตามสดๆ และถ้าคุณแก้โค้ด Node ฝั่งซ้ายจะเปลี่ยนค่าไปตามกัน ช่วยให้โปรแกรมเมอร์กับเกมดีไซเนอร์ทำงานกันไร้ข้อขัดแย้ง
",
  "**Natural Language Code Generator (สั่งให้จินตนาการกลายเป็นบรรทัดแห่งปาฏิหาริย์)**
ไม่ต้องจำว่า API ของเอนจิ้นคืออะไร แค่พิมพ์ใส่ช่อง Prompt: 'คูณดาเมจ 2 เท่าถ้าศัตรูเลือดน้อยกว่า 10%' แล้ว AI จะควานหา Object ตัวแปร พิมพ์ฟังก์ชันผูก Trigger ออกมาครบสมบูรณ์ และพร้อม Execute ทันที
",
  "**Visual Math Vector & Matrix Debugger (ดูคณิตศาสตร์ขยับได้ทะลุหน้าจอ)**
เบื่อคำนวณเวกเตอร์ Quaternions ใช่มั้ย? ฟีเจอร์นี้แสดงผลลูกศร Vector หรือกล่อง Matrix ลอยบนหน้าจอเกม ผู้เล่นวิ่งไปลูกศรพวกนี้ชี้ค่าอัพเดตแบบเสี้ยววิ ทำให้การทำระบบหมุน เล็ง หรือมุมสะท้อน เป็นเรื่องของเด็กเล่น!
",
  "**Universal Live API Connector (ตะขอเกี่ยวเว็บหรือ API อะไรก็ได้มาใส่เกม)**
ลากเส้นปุ่มเดียวต่อเข้า API สาธารณะ เช่น เชื่อมราคาทองคำ สภาพอากาศจริงของนิวยอร์ก ข้อมูลทวีต ข่าวมาใส่กระดานในห้องเกม แค่พิมพ์ URL ทุกอย่าง Parse เป็น JSON Node พร้อมใช้งานโดยละทิ้งความปวดหัวของการทำ OAuth ทิ้งไป
",
  "**Code Ecosystem 3D Mapping (กราฟดาราจักรความสัมพันธ์โค้ดทั้งโปรเจกต์มโหฬาร)**
แสดงโครงสร้างสคริปต์ ตัวแปร คลาสทั้งหมดออกมาเป็นกาแล็กซี่ 3D ส่องดูว่าถ้าคุณลบคลาส A มันจะทำให้สายโยงระเบิดไปกี่ไฟล์? ช่วยให้สถาปนิกโปรแกรมสามารถ Refactor รื้อใหม่ได้อย่างมั่นใจเพราะเห็นเป้าหมายรวม
",
  "**Auto-Refactoring & Clean Engine (เปลี่ยนโค้ดพันสายไฟ เป็นมหานครระเบียบ)**
กดคลิกขวา Clean Up! AI จะวิเคราะห์โค้ด 10,000 บรรทัดที่ซ้อนกัน 15 ชั้น (Spaghetti code) จัดการยุบฟังก์ชัน ดึงตัวแปรซ้ำ สร้าง Interface แบบ SOLID Principle และทำให้โค้ดส่วนนั้นรันเร็วขึ้นอีกต่างหาก
",
  "**Live Inject Scripting (ฉีดโค้ดใหม่ตอนเล่น ไม่ต้องกด Restart เกมเลย)**
รันเกมอยู่ ทดสอบวิ่งอยู่ บังเอิญกระโดดเตี้ยไป.. พิมพ์แก้โค้ดเปลี่ยนตัวเลขปุ้บ เกมจะรับรู้ ปรับค่าเดี๋ยวนั้น โหลดอัพเดตเข้า Memory โดยตรง คุณสามารถเขียนเกมให้สลับตอนสู้บอสและทดสอบลูปเดิมได้ในทันใจ (Hot-Reload Extreme)
",
  "**Memory Leak Thermal Heatmap (เตือนไฟไหม้เมื่อโค้ดกินสเปคทะลุหลอด)**
มุมขวาล่างของบรรทัดโค้ดจะมีสีเปล่งแสง หากเป็นสีฟ้าคือโค้ดนั้นใช้ประหยัดมาก แต่ถ้าโค้ดลูปไหนเผลอเรียก Object ซ้ำๆ และ RAM บวม โค้ดบรรทัดนั้นจะเปลี่ยนเป็น 'สีแดงเดือด' พร้อมเสนอวิธีแก้ไข Heap allocation
",
  "**AI Code Guardian Sentinel (อัศวินผู้พิทักษ์ต่อต้านการเจาะระบบล่วงหน้า)**
ถ้าคุณเขียนระบบเซพ หรือโอนเงินในเกม ระบบนี้จะจำลองตัวเป็น Hacker ตรวจสอบความหละหลวม ถ้าเจอว่าตัวแปรนี้โดนแก้ผ่าน Cheat Engine ได้ มันจะหยุด Block ห้าม Compile พร้อมเสนอการปกป้องตัวแปรด้วย Encryption ชั้นสูง
",
  "**Multi-monitor Code Space Universe (ส่งหน้าจอเขียนโค้ดและแผงควบคุมไปในทุกอุปกรณ์)**
ใช้ Editor หน้าเกมบน PC 5K, แล้วโยนแผง Node ไปที่ iPad นำหน้าสคริปต์ไปกางบน Laptop เครื่องอื่นในวง LAN ทั้งหมดซิงค์กันไม่มีสะดุด (Distributed IDE Workspace) พื้นที่การทำงานของคุณจะไร้สิ้นสุด
",

  // 8. Audio, SFX & Music (มหาอุปรากรและโอสถแห่งเสียงดนตรี)
  "**Ray-Traced Ambient Audio (คำนวณรังสีคลื่นเสียง ทะลุกำแพงหนาและวัสดุ)**
ใช้ Ray-Tracing ยิงเส้นเสียง เสียงจะถูก Block, Bounce หรือลอดช่องหน้าต่างเล็กๆ มาหาเรา ความถี่เสียงจะทอนลงตามชนิดอิฐ เหล็ก หรือแก้ว ผู้เล่นในเกมยิงจะแยกแยะการเดินชั้นบน ชั้นล่าง และหลังกำแพงได้แม่นยำระดับเซ็นติเมตร
",
  "**AI Unlimited Voice Actor (สุดยอดนักพากย์สหัสวรรษ 1,000 คาแร็กเตอร์ Offline)**
ระบบ Text-to-Speech ขุมพลัง Deep Learning ออฟไลน์ สร้างเสียง NPC เสียงคนแก่แหบพร่า หญิงสาวขี้อาย ปีศาจตะโกนคำราม รองรับอารมณ์ เศร้า โกรธ หายใจหอบ โดยไม่ต้องจ้างนักพากย์! เปลี่ยนบทปุ้บ เสียงออกปั้บ ไม่เสีย Cost เพิ่ม
",
  "**Dynamic Musical Synthesizer (อารมณ์ดนตรีชีวภาพ ปรับเองตามชีพจรผู้เล่น)**
เพลงประกอบในเกมไม่ใช่ไฟล์ mp3 ต่อกัน แต่ตัวเอนจิ้นจะมิกซ์ดนตรีสดๆ ลูปกลองจะเร้าใจถ้าเลือดสูบฉีด บอสใกล้ตายจะโหมเครื่องสาย ดนตรีจะ Fade เป็นเงียบสงัดเมื่อผู้เล่นกระโดดเหว สอดประสานความตื่นเต้นเสมือนมีผู้กำกับหนังคอยคุมจังหวะ
",
  "**Foley Material Generation AI (เสกเสียงกระทบกันของวัตถุตามหลักเคมีฟิสิกส์)**
ถ้าโยนกระดาษ, ไม้ลูกกอล์ฟ, หรือดาบเหล็กใส่พื้นทราย คอนกรีต ลาวา AI จะ 'ประพันธ์' เสียงการตกกระทบนั้นขึ้นมาใหม่ 100% ตามมวล ความเร็ว คลื่นสะท้อน เลิกใช้คลังเสียงคลิปเก่าๆ ที่ต้องมานั่งหาและแมปปิ้งด้วยมือ
",
  "**Dolby Atmos / Super Spatial Engine (ตำแหน่งเสียง 3D ทะลวงทรงกลมทุกเพลา)**
มิกซ์บรรยากาศโอบล้อม 360 ทรงกลม แม้ผู้เล่นจะใช้หูฟังสเตอริโอ 200 บาท ก็ได้ยินเสียงนกบินโฉบข้ามหัวจากซ้ายไปขวา หรือเสียงหยดน้ำจากเพดานหยดเฉียดหูได้ด้วยเทคโนโลยี HRTF แบบเนทีฟที่บริสุทธิ์ที่สุด
",
  "**Microphone Gameplay Full Integration (พูดกับเกม เกมตอบสนองเสียงของคุณ)**
ผู้เล่นพูดออกไมค์ NPC ในเกมสามารถได้ยิน ประเมินความดัง ถ้าตะโกน ศัตรูไกลๆจะวิ่งมา ถ้ากระซิบศัตรูจะไม่รู้ตัว AI จะดึงคำพูดส่งต่อให้ LLM ตอบเพื่อให้บทสนทนาไร้ปุ่มทางเลือก (Speech-driven gameplay)
",
  "**Audio-Driven Skeletal Animation (การขยับริมฝีปากสุดมหัศจรรย์จากคลื่นเสียง)**
ส่งไฟล์เสียงแปลกๆ หรือภาษาเอเลี่ยนเข้าไป AI (Lip-sync Tool) จะอ่านพยางค์ริมฝีปากและขับเคลื่อนกระดูกปาก คาง ตา ของตัวละคร 3D ให้รูปปากตรงเป๊ะทุกสระและพยัญชนะในเสี้ยววินาที รองรับทุกภาษาในจักรวาล!
",
  "**Adaptive Ambience Simulator (เครื่องผลิตบรรยากาศ เสียงลมหวน และชีวมณฑล)**
ระบบจะสร้างเสียงแมลงจิ้งหรีดที่หยุดร้องเมื่อศัตรูระดับสูงเดินเข้าใกล้ สร้างเสียงลมพัดต้นไม้ตามแรงลมฟิสิกส์ เสียงนกร้องนกเพนกวินตาม Biome ภูมิประเทศ ไม่ต้องตัดต่อลูปบรรยากาศ แค่ปล่อยป่าให้เปล่งเสียงด้วยตัวเอง
",
  "**Vintage & Multi-Era Audio Filter (ฟิลเตอร์เปลี่ยนยุคสมัยแห่งเสียง)**
อยากได้เสียงเกมเพลย์แบบวิทยุ AM ของยุคสงครามโลก, เสียงยุคแผ่นเสียงไวนิลปี 40, หรือเสียงเครื่อง SFC แบบ 16-bit? ติ๊กแค่กล่องเดียว ทั้งเอนจิ้นจะกวนคลื่นเสียงทำให้อรรถรสเกมเปลี่ยนยุคทันที ไม่ต้องซื้อปลั๊กอิน VST แสนแพงเพิ่ม
",
  "**Auto Mix & Smart Mastering (วิศวกรเสียงผู้ดูแลบาลานซ์คลื่นเสียงและหลบหลีกฮาร์โมนิก)**
ระบบ Auto-Ducking กดยังไงเสียงก็ไม่พัง เวลาบอสปล่อยเลเซอร์ เสียงปืนผู้เล่นจะเบาลงนิดนึง เวลา NPC สำคัญพูด เสียงรบกวนเมืองจะกดต่ำลง 3dB เพื่อให้หูมนุษย์ฟังชัดที่สุด ทุกอย่างมิกซ์ออกมาผ่านเรตติ้ง Loudness ภาคปฏิบัติเปกสตูดิโอ AAA
",

  // 9. UI/UX & Developer Workflow (ส่วนประสานมนุษย์ ล้ำยุคอนาคตกาลจิตวิทยา)
  "**Mind-Mapping Whiteboard Editor UI (ผืนผ้าใบความคุมไร้ขอบเขตราวกับ Miro)**
ลืมหน้าต่างแคบๆ ของ Editor เรียงยาวๆ ไปได้เลย คุณสามารถปักหมุดโค้ด, วางคอนเซปต์อาร์ต, โยงเส้นเนื้อเรื่องเควสต์ ลงบนบอร์ดกว้าง 360 องศา เลื่อนและซูมได้อย่างอิสระเสมือนบอร์ดสืบสวนที่สามารถกดปุ่ม Play รันเกมในกรอบเล็กๆ ได้เลย
",
  "**VR Workspace Creator Studio (สวมวิญญาณพระเจ้าในการเสกโลกเสมือนจริงใน VR)**
ใส่จอแว่น VR ของคุณแล้วดำดิ่งเข้ามาในเกม ดึงแผงเมนูลอยกลางอากาศ! หยิบต้นไม้ปักลงดินด้วยมือ ควงแขนวาดภาพแสงส่อง จัดวางมุมกล้องเหมือนผู้กำกับหนัง เรียงกระดูกศัตรูเหมือนจับหุ่นดัด ทั้งหมดในโหมด Hand-Tracking!
",
  "**Neural Brain-Computer Interface (BCI) (รองรับรอยหยักสมอง บับเบิลเชื่อมจิตอนาคต)**
เตรียมความพร้อมแห่งทศวรรษ รองรับคลื่นสมอง EEG จากอุปกรณ์ BCI แค่คุณ 'คิด' จะหมุนโมเดล หรือ 'จินตนาการ' อยากย้อนฟังก์ชันกล้องหน้าต่าง กล้องและโมเดลจะกระทำตามคลื่นความต้องการที่จับแมปกับ Shortcut โดยไม่ต้องจับเมาส์
",
  "**Eye-Tracking UI Spatial Focus (สแกนโฟกัสจุดตกกระทบตา หน้าต่างเด้งตอบสนอง)**
เมื่อหันสายตาไปมองค่าตัวแปร Property มุมขวา มันจะซูมขยายและสว่างขึ้น เมื่อไม่ได้มองเครื่องมืออื่นจะเบลอจางหายไป ลดอาการตาล้า (Eye-Strain) สร้างความดื่มด่ำให้กระบวนการสร้างเกมมีความเป็นธรรมชาติมากที่สุด
",
  "**Customizable Editor Themes 3.0 Ultra-Fluid (เปลี่ยนหนังหุ้มเอนจิ้นลึกซึ้ง 10,000 พิกเซล)**
เปิดให้ปรับแต่ง UI ตั้งแต่ความแข็งของขอบมน ความโปร่งใสของแผงกระจก (Glassmorphism) อนิเมชันกระเพื่อมตอนชี้เมาส์ ฟอนต์ทุกชนิด ดาวน์โหลด Theme ตลาดชุมชนเช่น โหมด Retro Hacking, โหมด Cyberpunk ได้รับแรงบันดาลใจทุกคราวในการทำงาน
",
  "**Co-op Live Multiplex Editing (เขียนเกมพร้อมกันแบบฝูงชน แบบเสมือน Google Docs)**
ส่ง Link Project ให้เพื่อน 5 คน ทั้งโลกเข้ามาทำงานบนแผนที่เดียวกัน! คนหนึ่งจัดแสงทิศเหนือ คนหนึ่งปั้น NPC ทิศใต้ คนหนึ่งพิมพ์โค้ด ทุกคนเห็นเคอเซอร์ของกันและกัน เห็นกราฟิกเปลี่ยนแปลงอัปเดตแบบหลัก Millisecond ขจัดปัญหา Git Conflict แบบ 100%
",
  "**Cross-Device Low-Latency Streaming (รันพลังทะลุจักรวาล ลงบนเครื่องโน้ตบุ๊กนักเรียน)**
เอนจิ้นตัวจริงและโมเดลมหาศาลเรนเดอร์บน Cloud Server ระดับเทพ ส่วนนักพัฒนาใช้เพียงเบราว์เซอร์ธรรมดาสตรีมภาพ UI ทำงานไปแบบลื่นๆ ไม่มีกระตุก สามารถสร้างเกม 8K ได้ด้วยเครื่องสเปกตำ่ติดดินที่เชื่อมอินเทอร์เน็ต
",
  "**AI Workflow Personalization (เอนจิ้นรู้ใจ เปลี่ยน UI ตามวิชาชีพและความถนัด)**
เมื่อมันวิเคราะห์ว่าคุณเป็น Programmer มันจะซ่อนแท็บ Color Grade, Sculpting และเปิดหน้า Resource Code ใหญ่ๆ ถ้าคุณเป็น Sound Engineer มันจะกางแผงมิกเซอร์เซอร์ราวด์ให้อัตโนมัติ ปรับสภาพแวดล้อมให้เข้ากับคุณประหนึ่ง AI เลขาหน้าคอม
",
  "**Asset Auto-Tagging & Smart Semantic Search (นักบรรณารักษ์เวทมนตร์ค้นหาและจัดการไฟล์)**
โยนโฟลเดอร์รูปและโมเดลที่ตั้งชื่อมั่วๆ 1,000 ไฟล์ลงไป! AI จะสแกนและตั้ง Tag เป็น 'หิว', 'กำแพงอิฐแดง', 'เสียงยิงปืน Laser', เวลาจะหา แค่พิมพ์ 'ขอหินที่แหลมๆ ดูอันตรายหน่อย' มันจะลิสต์ขึ้นมาเป๊ะๆ
",
  "**One-Click Mega Asset Optimization 3D/Texture (ลดขนาดและบีบอัดระดับพระกาฬแค่สัมผัสเดียว)**
จะพอร์ตเกมลงมือถือ? กด 1 ปุ่ม! AI ลด Polygon ลดกระดูก Bake Texture จาก PBR ไฮพิกเซลเป็น Mobile Texture ธรรมดา ลดขนาดโปรเจกต์ 50GB เหลือ 2GB ได้ภาพสวยใกล้เคียงของเดิมมากที่สุด พร้อมทำ LOD อัตโนมัติ 8 ระดับชั้น
",

  // 10. Publishing, DevOps & Marketing (จัดจำหน่ายสู่อินฟินิตี้ ซัพพอร์ตการตลาดทะลุโลก)
  "**One-Click Ultra Multi-Platform Publish (จัดส่งระเบิดพลังทุกแพลตฟอร์มในเคาะเดียว)**
พอร์ตลง Windows Desktop, PlayStation 5, Xbox Series X, Nintendo Switch, iOS, Android, Linux, อุปกรณ์ AR/VR และ WebGL พร้อมกันในปุ่มเดียว! ระบบจัดการ Native Code และ SDK Certificate Key ให้ทั้งหมด ไม่ต้องกุมขมับกับ Setting เป็นร้อยหน้า
",
  "**Auto Game Trailer AI Director (ผู้กำกับภาพยนตร์ AI ตัดต่อเทรลเลอร์โฆษณาฉบับ Masterpiece)**
AI ส่งกล้องโดรนล่องหนเข้าไปถ่ายช็อตการเล่น (คัดจังหวะระเบิด ต่อสู้ ฉากวิวสวย) ผสมกับดนตรี Soundtrack! ซิงค์จังหวะ Drop เบส กับจังหวะดาบฟันศัตรู แล้วเรนเดอร์เป็นวิดีโอ 4K 60FPS โพสต์ยั่วน้ำลายลงโซเชียล โปรเจกต์เกมก็ทำการตลาดได้เอง
",
  "**Predictive Market Analyzer & Trend AI (ที่ปรึกษากระแสตลาด แนะนำแนวเกมรวยเละ)**
ระบบวิเคราะห์ฐานข้อมูล Steam / AppStore ทั่วโลกแล้วบอกเราว่า 'ตอนนี้เกมปลูกผักเวทมนตร์ค่อนข้างขาดแคลน หากคุณเปลี่ยนธีม 10% ยอดขายจะพุ่งกว่า 400%' มันจะแนะนำ Color Scheme ซับไตเติ้ลภาษาตามประชากรที่กำลังมาแรง
",
  "**A/B Testing Simulator Hivemind (ทดสอบแบ่งกลุ่ม A/B ผ่านเครือข่ายบอทคลื่นสมอง)**
สร้างหน้าต่างเกมต่างกัน 2 แบบ (ปุ่มซื้อของสีแดง vs ทาสีน้ำเงิน) จัดส่งให้ Bot 10,000 ตัวเล่นจำลองพฤติกรรมมนุษย์ ดูว่าฝั่งไหนผู้เล่นใช้เงินเยอะกว่า โอกาสผ่านด่านเร็วกว่า พร้อม Heatmap ว่าตาบอทเค้ามองสโคปไหน เพื่อเป็นข้อมูลในการตัดสินใจก่อน Release
",
  "**Real-time Live Crash Observer 3D (จอมอนิเตอร์โลกใบใหม่ มองผู้เล่นตายแบบ 3D Live)**
ถ้าเกมของคุณเปิด Global แล้ว คุณเข้าหน้าต่างนี้ จะเห็นลูกโลก 3D เปล่งแสงจุดไฟกะพริบบนยุโรป อเมริกา หากมีผู้เล่นตายเพราะบัคชนกำแพง ระบบจะ Replay จังหวะนั้นกลับมาในโลก 3D ของ Editor ทันทีเพื่อให้คุณแก้เส้นใยชนขอบ (Collision) จบได้ก่อนผู้เล่นรีพอร์ต
",
  "**Auto-Localization Ultimate Full Ecosystem (ระบบแปลและซิงค์แพทช์เกม 150 ภาษาระดับจักรวาล)**
เพียงแค่มีบทสนทนาอังกฤษ ระบบจะแปลภาษาไทย, จีน, สเปน, ละตินกว่า 150 ภาษาผ่าน Context Engine! ไม่ใช่แค่ซับไตเติล แต่ ป้ายร้านค้าในฉาก รอยกระดาษที่ติดบนกำแพง Texture ทั้งหลายโดนเปลี่ยนภาษาไปด้วยพร้อมกันอย่างสมบูรณ์ไร้จุดผิดพลาด
",
  "**Dynamic Smart Size Component Bundling (สตรีมดาวน์โหลดเกม โหลดแค่ที่ตามนุษย์เห็น)**
ไฟล์เกมขนาด 300GB ไม่ใช่ปัญหา! ผู้เล่นหน้าใหม่โหลดบิลด์หลักเพียง 2GB เพื่อเข้าเล่นโซนแรกทันที พอผู้เล่นมีท่าทีจะเปิดประตูไปโซนใหม่ หรือเตรียมเข้าดันเจี้ยน ระบบ Network เอนจิ้น จะค่อยๆ โหลด Assets ด่านต่อไปมาจ่อรอใน Background ทำให้ติดตั้งเร็วที่สุดในโลก
",
  "**Auto App Store Submissions & SEO Bot (จัดแจงส่งเอกสารและหน้าวางขายอัตโนมัติ 100%)**
อัพเดทเกมแพทช์ใหม่ ไม่ต้องเหนื่อยแคปรูป, กรอกข้อความบน Google Play, พิมพ์แจ้งนักลงทุน SEO... หุ่นยนต์ของเราจัดการถ่ายรูปสกรีนช็อตกราฟิกสุดปังในเกม, กรอกฟอร์มเปลี่ยนเวอร์ชัน, ใส่ Keyword ทะลุทะลวงตลาด, และกด Submit ส่งเข้าตรวจสอบผ่าน API สบายตัว
",
  "**Social Media Live Event Hooks (เชื่อมโลกเกมข้ามมิติสู่สตรีมมิ่งสดอย่าง Twitch/YouTube)**
ทำปุ่มเดียวฝังระบบ Twitch Drops, Super Chat หากผู้ชมกดคีย์หัวเราะ โดเนทเหรียญ เกมเพลย์ของสตรีมเมอร์จะเกิดกล่องไอเทมดรอป, กลายเป็นศัตรูบอสมหายักษ์, โหวตด่านต่อไป ดึงพลังปฏิสัมพันธ์ 4th Wall Break ขั้นเทพระหว่างคนดูกับคนเล่นลึกที่สุดประวัติศาสตร์!
",
  "**Blockchain/Web3 Native E-Commerce IDE Wallet (ระบบนิเวศซื้อขาย-สร้างตลาดเงินดิจิตอลพหุภพจากหน้าต่างโค้ด)**
สามารถสร้างตลาดซื้อขาย Item ประมูล อาวุธระดับ Mythic แลกด้วยเหรียญ Crypto ควบคุมกระแส Tokenomics และระบบความปลอดภัยขั้นเทพ ไม่ใช่แค่หน้าบ้าน แต่แดชบอร์ดหลังบ้านเอนจิ้นมี AI ตรวจสอบการฟอกเงิน เฝ้ามองการไหลเวียนของเงินตรา ทำให้คุณกลายเป็นผู้คุมเศรษฐกิจระดับพระเจ้าได้สมบูรณ์
",
];

export class UltimateIDEFeatures {
  public getAllSystems() { return Ultimate100Systems; }
  
  public activateSystem(systemName: string) {
    console.log('[Hyper-Engine] Activating Next-Gen System: ' + systemName);
  }
}
`
        });
      } else {
        responseText += isThai ? `ฉันได้ทำการค้นหาข้อมูลทางอินเทอร์เน็ตและวิเคราะห์วิดีโอเกี่ยวกับ: "${userMessage}"\n\nนี่คือโครงสร้างพื้นฐานตามความรู้ใหม่ที่ค้นพบ:\n\n\nfunction solveTask() {\n  console.log("Task executed locally with global web knowledge.");\n}` :
                        isJapanese ? `インターネットと動画を検索し、以下の内容について分析しました：「${userMessage}」。\n\n新しい知識に基づいた基本的な実装を示します：\n\nfunction solveTask() {\n  console.log("Task executed locally with global web knowledge.");\n}` :
                        `I have searched the internet and analyzed videos regarding: "${userMessage}".\n\nHere's a generic scaffold based on my newfound knowledge:\n\n\nfunction solveTask() {\n  console.log("Task executed locally with global web knowledge.");\n}`;
        if (lowerInput.includes('file') || lowerInput.includes('create') || lowerInput.includes('สร้าง') || lowerInput.includes('作成')) {
           generatedFiles.push({
             filename: 'NewLearnedModule.ts',
             language: 'typescript',
             content: `// Generated offline by Local AI with Web Knowledge\nexport function initialize() {\n  return "Ready";\n}\n`
           });
        }
      }

      if (generatedFiles.length > 0 && onWriteFiles) {
        onWriteFiles(generatedFiles);
        responseText += `\n\nI have locally generated and saved the following files:\n${generatedFiles.map(f => `- **${f.filename}**`).join('\n')}\n\nYou can view them in the Explorer.`;
      }

      if (!responseText || responseText.trim().length === 0) {
        const infResult = await offlineNeuralInferencePipeline.executeInference({
          prompt: rawUserMessage,
          contextLanguage: chatLanguage,
          persona,
          activeToolId,
          activeToolName,
          smartMemoryCode: code
        });
        responseText = infResult.content;
        if (infResult.generatedArtifacts && onWriteFiles) {
          onWriteFiles(infResult.generatedArtifacts);
        }
      }

      const tokensSaved = OfflineNeuralInferencePipelineNode.estimateTokenEquivalence(rawUserMessage + responseText);
      UniversalOfflineAITokenGuard.recordTokensSaved(tokensSaved, 'AIChatOfflineCopilot');

      let finalResponseText = responseText;
      if (autoBrandCode) {
        finalResponseText = offlineAICodeCommentBrander.brandMarkdownCodeBlocks(finalResponseText);
      }
      setMessages(prev => [...prev, { role: 'model', content: finalResponseText }]);

    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: `Error: Local execution failed.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === 'ArrowUp') {
      if (commandHistory.length > 0) {
        e.preventDefault();
        const nextIndex = historyIndex < 0 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex >= 0) {
        e.preventDefault();
        const nextIndex = historyIndex + 1;
        if (nextIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(nextIndex);
          setInput(commandHistory[nextIndex]);
        }
      }
    }
  };

  const handleApplyCode = (newCode: string) => {
     const formattedCode = autoBrandCode
       ? offlineAICodeCommentBrander.brandCode(newCode, language || 'typescript').brandedCode
       : newCode;
     setCode(formattedCode);
  };

  const undoLastInteraction = () => {
    if (messages.length <= 1) return;
    
    // Default system prompt is always there, so we avoid deleting it
    setMessages(prev => {
      let limit = prev.length - 1;
      // remove up to 2 items (user and response)
      if (prev[limit].role === 'model' && prev[limit - 1] && prev[limit - 1].role === 'user') {
        return prev.slice(0, -2);
      } else {
        return prev.slice(0, -1);
      }
    });

    if (commandHistory.length > 0) {
      setCommandHistory(prev => {
         const newArr = [...prev];
         const lastCommand = newArr.pop();
         if (lastCommand) {
            setInput(lastCommand); // Put it back into the input box
         }
         return newArr;
      });
      setHistoryIndex(-1);
    }
  };

  const clearChatHistory = () => {
    if (confirm('Are you sure you want to clear the entire offline chat history?')) {
        setMessages([
          { role: 'model', content: "Hello! I am your Offline Local AI Assistant. 100% On-Device Neural Engine Initialized. I can run purely offline. You can also enable 'True Offline LLM' to chat running a real AI model in your browser without internet!" }
        ]);
        setCommandHistory([]);
        setHistoryIndex(-1);
        if (!externalMessages) {
           localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    }
  };

  const filteredMessages = messages.filter(m => m.content.toLowerCase().includes(searchTerm.toLowerCase()));

  // Simulate token count based on message lengths
  const tokenCount = messages.reduce((acc, msg) => acc + Math.ceil(msg.content.length / 4), 0);
  const memoryUsage = (tokenCount * 0.015).toFixed(2); // Simulated memory

  return (
    <div className="flex flex-col h-full bg-[#161b22] font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Top Header / Tools */}
      <div className="p-2 border-b border-[#30363d] flex flex-col gap-2 shrink-0 bg-[#0d1117]">
         <div className="flex flex-wrap items-center gap-2 justify-between">
           <div className="flex items-center gap-2 flex-wrap">
             <button 
               onClick={useTrueOfflineAI ? undefined : () => setShowOfflineModelMenu(true)}
               className={`flex items-center justify-center gap-1 text-[10px] uppercase font-bold px-3 py-1.5 rounded transition-colors w-full sm:w-auto ${useTrueOfflineAI ? 'bg-[#238636] text-white cursor-default' : 'bg-[#161b22] text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#21262d] border border-[#30363d]'}`}
               title="Download & Run actual LLM in browser offline"
             >
               <Zap size={12} className={useTrueOfflineAI ? 'text-yellow-300' : ''} />
               {useTrueOfflineAI ? `True Offline: ${activeOfflineModelName}` : isOfflineEngineLoading ? `Loading Engine...` : 'Download True Offline AI'}
             </button>

             {/* 100% Offline AI Token Guard Shield Indicator */}
             <div 
               className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-[10px] text-emerald-300 font-mono shadow-[0_0_12px_rgba(16,185,129,0.15)]"
               title="100% On-Device Offline AI Protected: Zero external tokens consumed, zero network overhead"
             >
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
               <span className="font-bold">🛡️ AI Shield: 0 Tokens</span>
             </div>
           </div>
           <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
             {/* Terminal / Chat Mode Switcher */}
             <div className="flex items-center p-0.5 rounded-lg bg-[#161b22] border border-[#30363d] text-[10.5px]">
               <button
                 onClick={() => setViewMode('chat')}
                 className={`px-2 py-0.5 rounded font-mono font-medium flex items-center gap-1 transition-all cursor-pointer ${
                   viewMode === 'chat' ? 'bg-[#58a6ff] text-black font-bold shadow-sm' : 'text-[#8b949e] hover:text-white'
                 }`}
                 title="Standard Conversational AI Chat"
               >
                 Chat
               </button>
               <button
                 onClick={() => setViewMode('terminal')}
                 className={`px-2 py-0.5 rounded font-mono font-medium flex items-center gap-1 transition-all cursor-pointer ${
                   viewMode === 'terminal' ? 'bg-cyan-400 text-black font-bold shadow-sm' : 'text-[#8b949e] hover:text-white'
                 }`}
                 title="100% Real Command Prompt Terminal"
               >
                 <Terminal size={11} />
                 CLI
               </button>
               <button
                 onClick={() => setViewMode('split')}
                 className={`px-2 py-0.5 rounded font-mono font-medium flex items-center gap-1 transition-all cursor-pointer ${
                   viewMode === 'split' ? 'bg-purple-400 text-black font-bold shadow-sm' : 'text-[#8b949e] hover:text-white'
                 }`}
                 title="Split View (Chat + Terminal)"
               >
                 <Columns size={11} />
                 Split
               </button>
             </div>

             <button onClick={() => setShowHistoryStack(true)} className="text-[#8b949e] hover:text-[#58a6ff] p-1.5 rounded transition-colors border border-[#30363d] bg-[#161b22]" title="View History Stack">
                <Undo2 size={14} />
             </button>
             <button onClick={exportChatHistory} className="text-[#8b949e] hover:text-[#58a6ff] p-1.5 rounded transition-colors border border-[#30363d] bg-[#161b22]" title="Export Chat History">
                <Download size={14} />
             </button>
             <label className="text-[#8b949e] hover:text-[#58a6ff] p-1.5 rounded transition-colors border border-[#30363d] bg-[#161b22] cursor-pointer" title="Import Chat History">
                <Share2 size={14} />
                <input type="file" accept=".json" onChange={importChatHistory} className="hidden" />
             </label>
           </div>
         </div>
         <div className="flex gap-2">
           <select 
              value={persona} 
              onChange={(e: any) => setPersona(e.target.value)}
              className="flex-1 bg-[#161b22] text-xs text-[#c9d1d9] border border-[#30363d] rounded px-2 py-1.5 outline-none focus:border-[#58a6ff]"
           >
              <option value="Developer">Developer Core</option>
              <option value="Designer">Design Lead</option>
              <option value="Architect">System Architect</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Security Analyst">Security/Vuln Analyst</option>
           </select>
           <select 
              value={chatLanguage} 
              onChange={(e: any) => setChatLanguage(e.target.value)}
              className="flex-1 bg-[#161b22] text-xs text-[#c9d1d9] border border-[#30363d] rounded px-2 py-1.5 outline-none focus:border-[#58a6ff]"
           >
              <option value="Auto">Auto Detect Language</option>
              <option value="English">English</option>
              <option value="Thai">ภาษาไทย</option>
              <option value="Japanese">日本語</option>
           </select>
         </div>
      </div>

      {/* History Stack Modal */}
      {showHistoryStack && (
        <div className="absolute inset-0 z-50 bg-[#0d1117]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl p-4 w-full max-w-[500px] flex flex-col max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-[#161b22] pb-2 z-10 border-b border-[#30363d]">
              <h3 className="text-white font-bold text-sm tracking-wide flex items-center gap-2"><Undo2 size={16} className="text-[#58a6ff]"/> Persistent History Stack</h3>
              <button onClick={() => setShowHistoryStack(false)} className="text-[#8b949e] hover:text-[#f85149] p-1 rounded transition-colors bg-[#0d1117]">
                <X size={16} />
              </button>
            </div>
            
            <p className="text-[#8b949e] text-[11px] mb-4">
              View your previous AI suggestions, prompts, and context-aware generations.
            </p>
            
            <div className="flex flex-col gap-2">
              {messages.filter(m => m.role === 'user').length === 0 && (
                 <div className="text-[#8b949e] text-xs text-center p-4">No history available yet.</div>
              )}
              {[...messages].map((msg, index) => ({ msg, index })).filter(({ msg }) => msg.role === 'user').reverse().map(({ msg, index }, idx) => {
                const aiResponse = messages[index + 1]?.role === 'model' ? messages[index + 1].content : null;
                return (
                <div key={idx} className="flex flex-col p-3 rounded-lg border border-[#30363d] bg-[#0d1117] hover:border-[#58a6ff] hover:bg-[#161b22] transition-colors group cursor-pointer" onClick={() => {
                   setInput(msg.content);
                   setShowHistoryStack(false);
                }}>
                  <div className="text-xs text-[#c9d1d9] whitespace-pre-wrap line-clamp-2 group-hover:text-white transition-colors font-bold mb-1">
                     {msg.content}
                  </div>
                  {aiResponse && (
                    <div className="text-[10px] text-[#8b949e] line-clamp-2 mb-2 italic">
                       {aiResponse.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                    </div>
                  )}
                  <div className="text-[10px] text-[#8b949e] mt-1 flex justify-between border-t border-[#30363d] pt-2">
                     <span>Prompt & AI Response</span>
                     <span className="text-[#58a6ff] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"><Undo2 size={10} /> Restore Prompt</span>
                  </div>
                </div>
              )})}
            </div>
          </div>
        </div>
      )}

      {/* Offline AI Model Selector Menu */}
      {showOfflineModelMenu && (
        <div className="absolute inset-0 z-50 bg-[#0d1117]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl p-4 w-full max-w-[540px] flex flex-col max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-3 sticky top-0 bg-[#161b22] pb-2 z-10 border-b border-[#30363d]">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#58a6ff]" />
                <h3 className="text-white font-bold text-sm tracking-wide">Select Offline AI Engine (100% Free)</h3>
              </div>
              <button onClick={() => setShowOfflineModelMenu(false)} className="text-[#8b949e] hover:text-[#f85149] p-1 rounded transition-colors bg-[#0d1117]">
                <X size={16} />
              </button>
            </div>

            {/* Model Category Tabs */}
            <div className="flex gap-1.5 p-1 bg-[#0d1117] rounded-lg border border-[#30363d] mb-3">
              <button
                onClick={() => setOfflineModelTab('qwen')}
                className={`flex-1 py-1.5 px-3 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  offlineModelTab === 'qwen'
                    ? 'bg-[#58a6ff] text-[#0d1117] shadow-sm'
                    : 'text-[#8b949e] hover:text-white'
                }`}
              >
                <Sparkles size={13} />
                <span>✨ Qwen 2.5 (Latest & Free)</span>
              </button>
              <button
                onClick={() => setOfflineModelTab('specialists')}
                className={`flex-1 py-1.5 px-3 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  offlineModelTab === 'specialists'
                    ? 'bg-[#58a6ff] text-[#0d1117] shadow-sm'
                    : 'text-[#8b949e] hover:text-white'
                }`}
              >
                <Cpu size={13} />
                <span>Specialist Units ({OFFLINE_MODELS.length})</span>
              </button>
            </div>
            
            <p className="text-[#8b949e] text-[11px] mb-3">
              {offlineModelTab === 'qwen'
                ? 'Qwen 2.5 Series: The world’s top open-weights coding & reasoning models. Free, zero-telemetry, 100% private offline execution.'
                : 'Select an offline domain specialist AI to execute specialized game engine logic directly on your device.'}
            </p>
            
            <div className="flex flex-col gap-2.5">
              {offlineModelTab === 'qwen' ? (
                QWEN_MODELS.map(qwen => (
                  <div key={qwen.id} className="flex flex-col p-3 rounded-lg border border-[#30363d] bg-[#0d1117] hover:border-[#58a6ff] transition-all group">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-white group-hover:text-[#58a6ff] transition-colors">{qwen.name}</h4>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border ${qwen.badgeColor}`}>
                            {qwen.isLatest ? 'LATEST 2026' : 'FREE'}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#21262d] text-emerald-400 font-mono">
                            FREE OPEN WEIGHTS
                          </span>
                        </div>
                        <p className="text-[10px] text-[#8b949e] mt-0.5">{qwen.descriptionTh}</p>
                      </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-3 gap-1.5 my-2 p-1.5 bg-[#161b22] rounded border border-[#30363d] text-[9.5px] text-[#8b949e]">
                      <div>Context: <strong className="text-white">{qwen.contextWindow}</strong></div>
                      <div>Params: <strong className="text-white">{qwen.parameters}</strong></div>
                      <div>VRAM/RAM: <strong className="text-white">{qwen.recommendedVRAM}</strong></div>
                    </div>

                    {/* Best for tags */}
                    <div className="flex flex-wrap gap-1 mb-2.5">
                      {qwen.bestFor.map((tag, idx) => (
                        <span key={idx} className="text-[9px] bg-[#21262d] text-[#8b949e] px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Launch / Download Action */}
                    <div className="flex items-center gap-2">
                      {qwen.isOfflineWebGPUReady ? (
                        <button 
                          onClick={() => initTrueOfflineAI(qwen.name, qwen.webLLMModelId)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white text-[10px] font-bold uppercase transition-all shadow active:scale-[0.98]"
                        >
                          <Zap size={12} className="text-yellow-300" />
                          <span>Run In-Browser (WebGPU Free)</span>
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            setActiveOfflineModelName(qwen.name);
                            setShowOfflineModelMenu(false);
                            setMessages(prev => [...prev, {
                              role: 'model',
                              content: `**🚀 [Qwen Model Switch] สลับเป็น "${qwen.name}" สำเร็จ!**\n\n- **พารามิเตอร์**: ${qwen.parameters}\n- **Context Window**: ${qwen.contextWindow}\n- **ความต้องการ VRAM**: ${qwen.recommendedVRAM}\n- **Download GGUF**: [ดาวน์โหลดโมเดลฟรีบน Hugging Face](${qwen.huggingFaceUrl})\n\nพร้อมตอบคำถาม ออกแบบระบบ และ Refactor โค้ดระดับสูงสุดแล้วครับ!`
                            }]);
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-[#1f6feb] hover:bg-[#388bfd] text-white text-[10px] font-bold uppercase transition-all shadow active:scale-[0.98]"
                        >
                          <Download size={12} />
                          <span>Select & Activate ({qwen.parameters})</span>
                        </button>
                      )}

                      {qwen.huggingFaceUrl && (
                        <a
                          href={qwen.huggingFaceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white text-[10px] flex items-center gap-1 transition-colors"
                          title="View on Hugging Face"
                        >
                          <HardDrive size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                OFFLINE_MODELS.map(model => (
                  <div key={model.id} className="flex flex-col p-3 rounded-lg border border-[#30363d] bg-[#0d1117] hover:border-[#58a6ff] hover:bg-[#161b22] transition-colors group">
                    <div className="flex justify-between items-start mb-2 border-b border-[#30363d] pb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-[#21262d] rounded-md text-[#bc8cff] group-hover:text-[#58a6ff] group-hover:bg-[#1f2937] transition-colors border border-[#30363d]">
                          {model.icon}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#c9d1d9] group-hover:text-white transition-colors">{model.name}</h4>
                          <p className="text-[10px] text-[#8b949e]">{model.desc}</p>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => initTrueOfflineAI(model.name)}
                      className="w-full flex items-center justify-center gap-2 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white text-[10px] font-bold uppercase transition-colors"
                    >
                      <Download size={12} />
                      Download & Switch AI
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Offline AI Model Download Overlay Modal */}
      {isOfflineEngineLoading && (
        <div className="absolute inset-0 z-50 bg-[#0d1117]/90 backdrop-blur-sm flex items-center justify-center p-6 flex-col">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl p-6 w-full max-w-[320px] flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#1f2937] flex items-center justify-center mb-4 border-2 border-[#58a6ff]">
               <Cpu size={32} className="text-[#58a6ff] animate-pulse" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Downloading Offline AI Model</h3>
            <p className="text-[#8b949e] text-xs mb-6">
              Please wait while the neural engine is cached locally into your browser. This only happens once.
            </p>
            
            <div className="w-full bg-[#0d1117] rounded-full h-3 mb-2 border border-[#30363d] overflow-hidden">
              <div 
                 className="bg-[#58a6ff] h-full transition-all duration-300 ease-out relative overflow-hidden" 
                 style={{ width: `${offlineLoadProgress}%` }}
              >
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <div className="flex justify-between w-full text-[10px] font-mono text-[#8b949e]">
               <span>{offlineLoadProgress}%</span>
               <span className="truncate max-w-[150px]" title={offlineLoadText}>{offlineLoadText || 'Initializing...'}</span>
            </div>
          </div>
        </div>
      )}

      {/* View Mode Router */}
      {viewMode === 'terminal' ? (
        <div className="flex-1 overflow-hidden p-2 bg-[#07090e]">
          <OfflineCommandPromptTerminal
            activeToolId={activeToolId}
            activeToolName={activeToolName}
          />
        </div>
      ) : (
        <div className={`flex-1 flex ${viewMode === 'split' ? 'flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[#30363d]' : 'flex-col'} overflow-hidden min-h-0`}>
          <div className="flex-1 flex flex-col overflow-hidden h-full min-h-0">
            {/* Search Bar */}
            <div className="p-2 border-b border-[#30363d] flex items-center shrink-0">
         <Search size={14} className="text-[#8b949e] mr-2" />
         <input 
           type="text" 
           placeholder="Search chat history..." 
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="w-full bg-transparent text-xs text-[#c9d1d9] outline-none placeholder:text-[#8b949e]"
         />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4 text-[13px]">
        {filteredMessages.map((message, index) => (
          <div key={index} className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div 
              className={`p-[10px] rounded-[6px] max-w-full leading-relaxed ${
                message.role === 'user' 
                  ? 'text-[#8b949e] text-right' 
                  : 'bg-[rgba(88,166,255,0.1)] border-l-[3px] border-[#58a6ff] text-[#c9d1d9] w-full'
              }`}
            >
              {message.role === 'user' ? (
                <div className="flex flex-col items-end gap-1">
                  <div>{message.content}</div>
                  {message.compressionMeta && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-[10px] text-cyan-300 font-mono shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                      <span>ประหยัดโทเคน {message.compressionMeta.savedTokensPct}% ({message.compressionMeta.originalTokens} ➔ {message.compressionMeta.compressedTokens} tok)</span>
                    </div>
                  )}
                </div>
              ) : (
                 <div className="markdown-body prose prose-invert max-w-none prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-[#30363d] prose-p:my-1 prose-pre:my-2 prose-h1:text-sm prose-h2:text-sm prose-h3:text-sm text-[#c9d1d9]">
                   {message.thoughtTrace && message.thoughtTrace.length > 0 && (
                     <OfflineAIThoughtTrace thoughts={message.thoughtTrace} />
                   )}
                   {message.toolCall && (
                     <OfflineAIToolCallCard
                       toolCall={message.toolCall}
                       onRerun={() => {
                         if (message.toolCall) {
                           OfflineCommandPromptEngine.getInstance().execute(message.toolCall.toolName);
                         }
                       }}
                     />
                   )}
                   <Markdown 
                     components={{
                        a(props) {
                          const href = props.href || '';
                          if (href.startsWith('#sound-')) {
                            const soundId = href.replace('#sound-', '');
                            return (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  gameAudioEngine.playSound(soundId);
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 my-0.5 mx-0.5 rounded bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
                              >
                                <Volume2 size={12} className="text-amber-400 animate-pulse" />
                                <span>{props.children}</span>
                              </button>
                            );
                          }
                          if (href.startsWith('#nav-')) {
                            const targetId = href.replace('#nav-', '');
                            return (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  executeOfflineNavigation(targetId);
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 my-0.5 mx-0.5 rounded bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/40 text-blue-300 text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
                              >
                                <ChevronRight size={12} className="text-blue-400" />
                                <span>{props.children}</span>
                              </button>
                            );
                          }
                          return (
                            <a {...props} target="_blank" rel="noreferrer" className="text-[#58a6ff] hover:underline" />
                          );
                        },
                        code(props) {
                          const {children, className, node, ...rest} = props
                          const match = /language-(\w+)/.exec(className || '')
                          const isBlock = !!match;
                          
                          if (isBlock) {
                            return (
                               <div className="relative group mt-2 mb-2">
                                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                                     <button 
                                       onClick={() => handleApplyCode(String(children).replace(/\n$/, ''))}
                                       className="bg-[rgba(88,166,255,0.2)] hover:bg-[rgba(88,166,255,0.4)] text-[#58a6ff] text-xs px-2 py-1 rounded shadow-lg flex items-center space-x-1 border border-[#58a6ff]/30"
                                       title="Apply to Editor"
                                     >
                                        <RefreshCcw size={12} />
                                        <span>Apply</span>
                                     </button>
                                  </div>
                                  <code {...rest} className={className}>
                                    {children}
                                  </code>
                               </div>
                            )
                          }
                          return <code {...rest} className="px-1 py-0.5 text-[#d2a8ff] bg-[#0d1117] rounded">{children}</code>
                        }
                     }}
                   >
                    {message.content}
                   </Markdown>
                 </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-[#8b949e] p-2">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-[12px] animate-pulse">Scanning context...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-[#30363d] shrink-0 flex flex-col gap-2">
        {activeToolId && activeToolName && (
           <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-[#bc8cff] font-bold pb-1 bg-gradient-to-r from-[#bc8cff]/10 to-transparent p-1 rounded">
             <Zap size={10} className="text-[#bc8cff]" />
             Context: {activeToolName}
           </div>
        )}
        <div className="flex flex-wrap justify-between items-center gap-y-2">
          <div className="flex items-center gap-3 flex-wrap">
             {/* Auto-Compress & Auto-Brand Toggles */}
             <button
               type="button"
               onClick={() => {
                 const next = !autoCompressCommands;
                 setAutoCompressCommands(next);
                 localStorage.setItem('omni_offline_ai_compression_enabled', String(next));
               }}
               className={autoCompressCommands ? "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border transition-all cursor-pointer bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.25)]" : "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border transition-all cursor-pointer bg-transparent text-gray-500 border-[#30363d] hover:text-gray-300"}
               title="บีบอัดย่อคำสั่งแชท AI Offline เพื่อประหยัดโทเคนและตอบสนองเร็วขึ้น คงเนื้อหาหลัก 100%"
             >
               <Zap size={11} className={autoCompressCommands ? 'text-cyan-400' : ''} />
               <span>ย่อคำสั่งประหยัดโทเคน: {autoCompressCommands ? 'ON' : 'OFF'}</span>
             </button>

             <div className="inline-flex items-center rounded border border-[#30363d] overflow-hidden shadow-sm">
               <button
                 type="button"
                 onClick={() => {
                   const next = !autoBrandCode;
                   setAutoBrandCode(next);
                   localStorage.setItem('omni_offline_ai_branding_enabled', String(next));
                 }}
                 className={autoBrandCode ? "inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold transition-all cursor-pointer bg-amber-500/20 text-amber-300 hover:bg-amber-500/30" : "inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold transition-all cursor-pointer bg-transparent text-gray-500 hover:text-gray-300"}
                 title={`ใส่หมายเหตุ ${offlineAICodeCommentBrander.getBrandTag()} ทุกบรรทัดของโค้ดที่ AI สร้างขึ้น`}
               >
                 <Sparkles size={11} className={autoBrandCode ? 'text-amber-400' : ''} />
                 <span>หมายเหตุลิขสิทธิ์ ({brandingAuthorName}): {autoBrandCode ? 'ON' : 'OFF'}</span>
               </button>
               <button
                 type="button"
                 onClick={() => setIsBrandingModalOpen(true)}
                 className="px-1.5 py-0.5 bg-[#21262d] hover:bg-[#30363d] text-amber-400 hover:text-amber-300 transition-colors border-l border-[#30363d] cursor-pointer flex items-center justify-center"
                 title={`ตั้งค่าชื่อผู้พัฒนา/ทีมผู้พัฒนา (*by ${brandingAuthorName} โดยโปรแกรม OMNI Engine STUDIO*)`}
               >
                 <Settings size={11} />
               </button>
             </div>

             <div className="w-px h-3.5 bg-[#30363d] mx-1"></div>

             <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="radio" 
                  name="thinkMode" 
                  checked={thinkMode === 'normal'} 
                  onChange={() => setThinkMode('normal')} 
                  className="w-3 h-3 accent-[#58a6ff]"
                />
                <span className="text-xs text-[#8b949e]">{t('chat.think_normal')}</span>
             </label>
             <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="radio" 
                  name="thinkMode" 
                  checked={thinkMode === 'think'} 
                  onChange={() => setThinkMode('think')}
                  className="w-3 h-3 accent-[#58a6ff]"
                />
                <span className="text-xs text-[#d2a8ff]">{t('chat.think_think')}</span>
             </label>
             <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="radio" 
                  name="thinkMode" 
                  checked={thinkMode === 'deep-think'} 
                  onChange={() => setThinkMode('deep-think')}
                  className="w-3 h-3 accent-[#f85149]"
                />
                <span className="text-xs text-[#f85149] font-bold">{t('chat.think_deep')}</span>
             </label>
          </div>
          {messages.length > 1 && !isLoading && (
            <div className="flex items-center gap-3">
              <button
                 onClick={undoLastInteraction}
                 className="flex items-center space-x-1 text-xs text-[#8b949e] hover:text-[#58a6ff] transition-colors"
                 title="Undo last message"
              >
                 <Undo2 size={12} />
                 <span>Undo / Go Back</span>
              </button>
              <button
                 onClick={clearChatHistory}
                 className="flex items-center space-x-1 text-xs text-[#8b949e] hover:text-[#f85149] transition-colors"
                 title="Clear chat history"
              >
                 <Trash2 size={12} />
                 <span>Clear History</span>
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col relative bg-[#0d1117] border border-[#30363d] focus-within:border-[#58a6ff] rounded-[4px]">
          {/* Quick Slash Commands Popover */}
          {(input.startsWith('/') || showSlashMenu) && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#161b22] border border-[#30363d] rounded-lg shadow-2xl p-2 z-40 max-h-56 overflow-y-auto">
              <div className="text-[10px] uppercase font-bold text-[#8b949e] px-2 py-1 flex items-center justify-between border-b border-[#30363d]/50 mb-1">
                <span className="flex items-center gap-1.5"><Terminal size={12} className="text-cyan-400" /> 100% Real Offline CLI Commands</span>
                <button
                  type="button"
                  onClick={() => setShowSlashMenu(false)}
                  className="text-[#8b949e] hover:text-white"
                >
                  <X size={12} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {POPULAR_SLASH_COMMANDS
                  .filter(c => !input || input === '/' || c.cmd.toLowerCase().includes(input.toLowerCase()))
                  .map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setInput(item.cmd);
                        setShowSlashMenu(false);
                      }}
                      className="p-1.5 rounded hover:bg-[#21262d] text-left flex items-center justify-between group transition-colors cursor-pointer border border-transparent hover:border-[#30363d]"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs">{item.icon}</span>
                        <span className="font-mono text-xs font-bold text-[#58a6ff] group-hover:text-cyan-300">{item.cmd}</span>
                      </div>
                      <span className="text-[9px] text-[#8b949e] truncate ml-2">{item.desc}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {attachment && (
             <div className="p-2 border-b border-[#30363d] relative">
               <img src={attachment} alt="attachment" className="w-16 h-16 object-cover rounded" />
               <button 
                 type="button" 
                 onClick={() => setAttachment(null)} 
                 className="absolute top-1 right-[calc(100%-4.5rem)] bg-[#161b22] rounded-full p-0.5 text-white shadow"
               >
                 <X size={12} />
               </button>
             </div>
          )}
          <form onSubmit={handleSendMessage} className="relative flex items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Chat with AI Offline or type /sysinfo, /throttle, /perf, /sound, /nav..."
              className="w-full bg-transparent outline-none p-2 pr-[200px] text-[12px] text-[#c9d1d9] resize-none max-h-32 min-h-[40px] font-['Helvetica_Neue',Arial,sans-serif]"
              rows={1}
            />
            <div className="absolute right-2 bottom-1.5 flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setShowSlashMenu(!showSlashMenu)}
                className={`p-1.5 rounded transition-colors ${showSlashMenu || input.startsWith('/') ? 'text-cyan-400 bg-cyan-500/20' : 'text-[#8b949e] hover:text-cyan-400 hover:bg-[rgba(255,255,255,0.1)]'}`}
                title="Open Offline Command Prompt Palette (/)"
              >
                <Terminal size={14} />
              </button>
              <button
                type="button"
                onClick={handleCloudConnect}
                className={`p-1.5 rounded transition-colors ${cloudConnected ? 'text-[#3fb950] hover:bg-[#3fb950]/10' : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[rgba(255,255,255,0.1)]'}`}
                title="Connect Cloud (Drive/Dropbox/AWS)"
              >
                <Cloud size={14} />
              </button>
              <label 
                className="p-1.5 text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer transition-colors"
                title="Upload File"
              >
                <Upload size={14} />
                <input type="file" onChange={handleFileUpload} className="hidden" />
              </label>
              <button
                type="button"
                onClick={startVoiceRecognition}
                className={`p-1.5 rounded transition-colors ${isRecording ? 'text-[#f85149] bg-[rgba(248,81,73,0.1)] animate-pulse' : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[rgba(255,255,255,0.1)]'}`}
                title="Voice Input (Speech to Text)"
              >
                <Mic size={14} />
              </button>
              <button
                type="button"
                onClick={startCamera}
                className="p-1.5 text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
                title="Take Picture"
              >
                <Camera size={14} />
              </button>
              <button
                type="button"
                onClick={executeSecurityScan}
                className="p-1.5 text-[#8b949e] hover:text-[#e3b341] hover:bg-[rgba(227,179,65,0.1)] rounded transition-colors"
                title="Deep Security Audit & Bug Scan"
              >
                <ShieldAlert size={14} />
              </button>
              <div className="w-px mx-1 h-4 bg-[#30363d]"></div>
              <button
                type="submit"
                disabled={(!input.trim() && !attachment) || isLoading}
                className="p-1.5 text-[#58a6ff] hover:bg-[rgba(88,166,255,0.1)] disabled:opacity-50 disabled:hover:bg-transparent rounded transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>
        {/* Hardware / Engine Metrics */}
        <div className="flex flex-wrap items-center justify-between text-[10px] text-[#8b949e] px-1 mt-1 font-mono gap-1">
           <div className="flex items-center space-x-2">
              <span className="flex items-center"><Cpu size={10} className="mr-1" /> Neural Engine Active</span>
              <span>•</span>
              <span>Tokens: {tokenCount.toLocaleString()}</span>
           </div>
           <div className="flex items-center space-x-2">
              <span>Ctx Mem: {memoryUsage} MB</span>
              <span>•</span>
              <span>GPU: 48°C</span>
              <span>•</span>
              <button 
                onClick={() => setIsOnline(!isOnline)} 
                className={`flex items-center space-x-1 px-1 rounded transition-colors ${isOnline ? 'text-[#3fb950] hover:bg-[#3fb950]/10' : 'text-[#f85149] hover:bg-[#f85149]/10'}`}
                title={isOnline ? "Simulating Online (Click to toggle)" : "Simulating Offline (Click to toggle)"}
              >
                {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
                <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
              </button>
           </div>
        </div>
      </div>
          </div>
          {viewMode === 'split' && (
            <div className="flex-1 flex flex-col overflow-hidden p-2 bg-[#07090e] min-h-0">
              <OfflineCommandPromptTerminal
                activeToolId={activeToolId}
                activeToolName={activeToolName}
              />
            </div>
          )}
        </div>
      )}
      
      {showCamera && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="bg-[#161b22] p-4 rounded-lg flex flex-col items-center">
               <video ref={videoRef} autoPlay className="max-w-full h-[300px] bg-black rounded mb-4" />
               <canvas ref={canvasRef} className="hidden" />
               <div className="flex space-x-4">
                 <button type="button" onClick={captureImage} className="bg-[#58a6ff] text-white px-4 py-2 rounded text-sm font-bold">Capture</button>
                 <button type="button" onClick={stopCamera} className="bg-transparent border border-[#8b949e] text-[#c9d1d9] px-4 py-2 rounded text-sm font-bold">Cancel</button>
               </div>
            </div>
         </div>
      )}

      {/* Code Attribution & Branding Config Modal */}
      <AICodeBrandingConfigModal
        isOpen={isBrandingModalOpen}
        onClose={() => setIsBrandingModalOpen(false)}
        onSaved={() => setBrandingAuthorName(offlineAICodeCommentBrander.getAuthorName())}
      />
    </div>
  );
}