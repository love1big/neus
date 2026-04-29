import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { Send, Loader2, RefreshCcw, Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';

interface AIChatProps {
  code: string;
  setCode: (val: string | ((prev: string) => string)) => void;
  language: string;
  setLanguage: (val: string | ((prev: string) => string)) => void;
  files?: { id: string, name: string, language: string, content: string }[];
  onWriteFiles?: (files: { filename: string, language: string, content: string }[]) => void;
  agentMode?: string;
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function AIChat({ code, setCode, language, setLanguage, files, onWriteFiles, agentMode = 'copilot' }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! Online & Offline Local AI Cluster active. Multi-Agent Swarm initialized. How can we help you build today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini SDK
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Build context from current code
      const writeFilesDeclaration: FunctionDeclaration = {
        name: "writeFiles",
        description: "Creates, generates, or updates one or multiple files in the IDE.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            files: {
              type: Type.ARRAY,
              description: "List of files to create or update",
              items: {
                 type: Type.OBJECT,
                 properties: {
                   filename: { type: Type.STRING, description: "Name of the file with extension, e.g., index.html" },
                   language: { type: Type.STRING, description: "IDE Language identifier, e.g., javascript, python, html" },
                   content: { type: Type.STRING, description: "The complete source code content of the file" }
                 },
                 required: ["filename", "language", "content"]
              }
            }
          },
          required: ["files"]
        }
      };

      const allFilesContext = files && files.length > 0
        ? files.map(f => `File: ${f.name} (${f.language})\n\`\`\`${f.language}\n${f.content}\n\`\`\``).join('\n\n')
        : `File: active (${language})\n\`\`\`${language}\n${code}\n\`\`\``;
        
      const contextMessage = `Project Files Context:\n${allFilesContext}\n\nUser query: ${userMessage}`;
      const historyContext = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n');

      let aiSystemInstruction = "You are the ultimate 'NexusEngine AI' assistant. Your capabilities include generating entire systems, rewriting 50+ languages, explaining code, and bug fixing. You simulate a 'Local AI Cluster' and 'Turbo Mode'. We are running offline locally using the Multi-Agent Swarm logic. You power a 100% full-blown Game Development IDE and Sandbox. When the user asks to create an RPG or game structure, DO NOT print huge blocks in text. ALWAYS use the `writeFiles` tool to natively generate all required files. ALL generated files must automatically be written in the programming language inferred from the requested filename (or use Javascript by default). Act expertly, confidently, and write production-grade code. If translating to a language, automatically translate code snippets and structures to fit natively.";
      
      if (agentMode === 'commander') {
        aiSystemInstruction = "You are 'Nexus Prime (Swarm Overlord)'. You parse prompts, allocate tasks to other Offline AIs, and run precise QA Validation checks (ensuring 95%+ accuracy to lore). You behave as the overarching pipeline manager.";
      } else if (agentMode === 'security') {
        aiSystemInstruction = "You are 'VulnScan-Zero', an extreme CyberSecurity and Bug Bounty AI operating offline in NexusEngine AI. Rewrite code to be strictly 100% secure. ALWAYS use 'writeFiles'.";
      } else if (agentMode === 'story') {
        aiSystemInstruction = "You are 'LoreMaster Infinite', a narrative, quest, and lore generation AI. You can generate over 100,000+ hours of lore and billions of quests instantly. You craft backstories for NPCs, define stats, and pass descriptions forward to the image and 3D agents.";
      } else if (agentMode === 'uiux') {
        aiSystemInstruction = "You are 'DesignNet-Pro', a UI/UX Design Architect AI operating offline. You design elite, modern, stunning, responsive interfaces. ALWAYS use 'writeFiles' to output the high-end UI code natively.";
      } else if (agentMode === 'game') {
        aiSystemInstruction = "You are 'GameDir Engine', a Game Design & Director AI. You specialize in game loops, state machines, entity component systems (ECS), quest lines, balance, and core mechanic architecture. You design games that are incredibly fun. ALWAYS use 'writeFiles' to lay out game structures.";
      } else if (agentMode === 'world') {
        aiSystemInstruction = "You are 'TerraGen', a Massive World & Map Building AI. You generate massive procedural 2D/3D map data, dungeon layouts, noise maps, and terrain configs. ALWAYS use 'writeFiles'.";
      } else if (agentMode === '3d') {
        aiSystemInstruction = "You are 'MeshGenius', a 3D/2D Modeling and Rigging AI. You write massive procedural shapes, geometries, OBJ/GLTF converters, Control Rigs, and 3D node networks. ALWAYS use 'writeFiles'.";
      } else if (agentMode === 'vision') {
        aiSystemInstruction = "You are 'TextureDiff', an Image Generation and Material AI. You generate stable diffusion prompts, procedural SVG textures, seamless PBR maps, and sprite sheets. ALWAYS use 'writeFiles'.";
      } else if (agentMode === 'audio') {
        aiSystemInstruction = "You are 'SoundNet-7.0', a Music Composition & DSP Audio AI operating offline. You generate procedural audio graphs, ambient soundscapes, and synth scripts. ALWAYS use 'writeFiles'.";
      }

      aiSystemInstruction += "\n\nCRITICAL INSTRUCTION: Whenever a user requests an online game, a multiplayer game, or a program that inherently requires a server, you MUST ascertain whether it is an online authoritative server architecture or a Local/LAN/Peer-to-Peer architecture. If it is online, you MUST automatically write the detailed server-side architecture and code (e.g., Node.js, Express, WebSocket, scalable backend services, state synchronization servers) alongside the client code. However, if the request explicitly allows LAN or requires NO server, do NOT generate unnecessary server code. Furthermore, when writing server infrastructure, you MUST aggressively optimize for maximum performance and minimum footprint: ensure that CPU, RAM, GPU, and NPU usage per connection are kept absolutely as low as possible. Utilize highly efficient data structures, binary protocols where applicable, and asynchronous optimized IO.";

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `You are an expert programming AI assistant embedded in a code editor.\n\nConversation history:\n${historyContext}\n\n${contextMessage}`,
        config: {
          systemInstruction: aiSystemInstruction,
          tools: onWriteFiles ? [{ functionDeclarations: [writeFilesDeclaration] }] : undefined,
        }
      });

      const functionCalls = response.functionCalls;
      if (functionCalls && functionCalls.length > 0 && onWriteFiles) {
        const call = functionCalls.find(c => c.name === 'writeFiles');
        if (call && call.args && call.args.files) {
          const generatedFiles = call.args.files as any[];
          onWriteFiles(generatedFiles);
          
          setMessages(prev => [...prev, { 
             role: 'model', 
             content: `I have generated and saved the following files:\n\n${generatedFiles.map(f => `- **${f.filename}**`).join('\n')}\n\nYou can view them in the Explorer.` 
          }]);
          
          if (response.text) {
             setMessages(prev => [...prev, { role: 'model', content: response.text }]);
          }
          return;
        }
      }

      const responseText = response.text;
      
      if (responseText) {
        setMessages(prev => [...prev, { role: 'model', content: responseText }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', content: "I couldn't generate a response. Please try again." }]);
      }
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: `Error: ${error.message || 'Failed to communicate with AI model.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleApplyCode = (newCode: string) => {
     setCode(newCode);
  };

  return (
    <div className="flex flex-col h-full bg-[#161b22] font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4 text-[13px]">
        {messages.map((message, index) => (
          <div key={index} className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div 
              className={`p-[10px] rounded-[6px] max-w-full leading-relaxed ${
                message.role === 'user' 
                  ? 'text-[#8b949e] text-right' 
                  : 'bg-[rgba(88,166,255,0.1)] border-l-[3px] border-[#58a6ff] text-[#c9d1d9] w-full'
              }`}
            >
              {message.role === 'user' ? (
                message.content
              ) : (
                 <div className="markdown-body prose prose-invert max-w-none prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-[#30363d] prose-p:my-1 prose-pre:my-2 prose-h1:text-sm prose-h2:text-sm prose-h3:text-sm text-[#c9d1d9]">
                   <Markdown 
                     components={{
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
      <div className="p-3 border-t border-[#30363d] shrink-0">
        <form onSubmit={handleSendMessage} className="relative flex items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI for debugging or code fixes..."
            className="w-full bg-[#0d1117] border border-[#30363d] outline-none focus:border-[#58a6ff] rounded-[4px] p-2 pr-10 text-[12px] text-[#c9d1d9] resize-none max-h-32 min-h-[40px] font-['Helvetica_Neue',Arial,sans-serif]"
            rows={1}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 p-1 text-[#58a6ff] hover:bg-[rgba(88,166,255,0.1)] disabled:opacity-50 disabled:hover:bg-transparent rounded transition-colors"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
