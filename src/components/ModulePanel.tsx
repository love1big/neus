import React from 'react';
import { Database, Bot, FileText, Settings, Ghost, Map as MapIcon, Users, Settings2, Globe, Mountain, HardDrive, Gamepad2, Orbit, Droplets, Flame, Wind, Zap, Blocks, Cpu, MonitorPlay, Activity, Cloud, ShieldCheck, BoxSelect, Layers, Code2, Network, AudioWaveform, Videotape, Fingerprint, CloudCog, ShieldAlert, ActivitySquare, CheckCircle, Bug, TrendingUp, DownloadCloud, UserSquare, Workflow, Image as ImageIcon, Music, Play, Pause, FastForward, Rewind, Mic, Sliders, Wand2, Plus, Sparkles, Clapperboard, PersonStanding, FolderTree } from 'lucide-react';

interface ModulePanelProps {
  moduleType: string;
}

export default function ModulePanel({ moduleType }: ModulePanelProps) {
  
  const renderHeader = (title: string, desc: string, icon: React.ReactNode) => (
    <div className="border-b border-[#30363d] p-6 bg-[#0d1117] flex items-center gap-4 shrink-0">
      <div className="p-3 bg-[#161b22] border border-[#30363d] rounded-lg text-[#58a6ff]">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-bold text-[#c9d1d9] tracking-wide uppercase">{title}</h2>
        <p className="text-[#8b949e] text-[13px] mt-1">{desc}</p>
      </div>
    </div>
  );

  const renderToolButton = (label: string) => (
    <button className="bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff] hover:bg-[#21262d] text-[#c9d1d9] px-3 py-2 rounded text-[12px] flex items-center justify-between transition-colors">
      <span>{label}</span>
      <span className="text-[#3fb950] bg-[#3fb950]/10 px-1 rounded text-[10px]">AI</span>
    </button>
  );

  const getModuleContent = () => {
    switch (moduleType) {
      case 'WorldBible':
         return (
           <>
             {renderHeader('World Bible & Universe Lore', 'Auto-generated expansive lore, countries, cultures, and religions by offline AI.', <Globe size={28} />)}
             <div className="p-6 flex flex-col gap-6 overflow-y-auto">
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg">
                     <h3 className="font-bold text-[#58a6ff] mb-2 uppercase text-[12px] tracking-wider">Universe Timeline</h3>
                     <ul className="text-[12px] space-y-3 text-[#8b949e]">
                       <li><strong className="text-[#c9d1d9]">Year 0:</strong> The Great Cataclysm. The AI dictates this split the modern world.</li>
                       <li><strong className="text-[#c9d1d9]">Year 400:</strong> The First Age of Magic & Technology integration.</li>
                       <li><strong className="text-[#c9d1d9]">Year 1250:</strong> Foundation of the 5 Nations.</li>
                     </ul>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg">
                     <h3 className="font-bold text-[#58a6ff] mb-2 uppercase text-[12px] tracking-wider">World Cultures & Religions</h3>
                     <ul className="text-[12px] space-y-3 text-[#8b949e]">
                       <li><strong className="text-[#c9d1d9]">Aethelgard:</strong> Monotheistic, values steel and honor. AI generated 50 tenets.</li>
                       <li><strong className="text-[#c9d1d9]">Zenshia:</strong> Nature worshipping, advanced bio-tech. Outfits auto-generated for Southern and Northern tribes.</li>
                     </ul>
                  </div>
               </div>
               <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-lg flex flex-col gap-2">
                 <h3 className="text-[#c9d1d9] text-[14px] font-bold">LoreMaster Infinite Node Status</h3>
                 <p className="text-[12px] text-[#8b949e]">Agent is silently running in the background, validating all quests and NPC dialogue against this Bible to ensure 100% consistency.</p>
               </div>
             </div>
           </>
         );
      case 'Modeling':
         return (
           <>
             {renderHeader('3D Modeling Gen (Meshy AI Local)', 'Offline generative 3D modeling, UV unwrapping, and instant topology generation.', <BoxSelect size={28} />)}
             <div className="p-6 flex flex-col gap-4 overflow-y-auto">
               <div className="bg-[#161b22] border border-[#30363d] rounded p-4 text-[#c9d1d9] text-[13px] flex items-start gap-4">
                 <div className="bg-[#bc8cff]/20 text-[#bc8cff] p-2 rounded shrink-0">
                    <BoxSelect size={24} />
                 </div>
                 <div>
                    <h3 className="font-bold text-[#bc8cff] mb-1">Text-to-3D Offline Generation</h3>
                    <p className="text-[#8b949e]">Generate game-ready assets instantly using the Local Meshy.AI instance. Supports export to FBX, GLTF with PBR maps.</p>
                 </div>
               </div>
               <div className="grid grid-cols-1 gap-4">
                  <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-lg flex flex-col gap-3">
                     <p className="text-[12px] text-[#8b949e] font-bold uppercase tracking-wider">Prompt 3D Generation</p>
                     <textarea className="w-full bg-[#161b22] border border-[#30363d] rounded p-3 text-[13px] text-[#c9d1d9] outline-none focus:border-[#58a6ff] h-[100px] custom-scrollbar" placeholder="e.g. 'A rusted medieval knight helmet with glowing green runes...'"></textarea>
                     <div className="flex justify-end gap-2">
                        <button className="px-4 py-2 bg-[#58a6ff] hover:bg-[#79b8ff] text-[#0d1117] font-bold rounded text-[12px] transition-colors">Generate 3D Model</button>
                     </div>
                  </div>
               </div>
               <div className="grid grid-cols-3 gap-4">
                 {renderToolButton('UV Auto-Unwrap')}
                 {renderToolButton('Decimate / LOD Gen')}
                 {renderToolButton('Rigging Auto-Bone')}
               </div>
             </div>
           </>
         );
      case 'Landscape':
         return (
           <>
             {renderHeader('Gaea/Houdini AI Terrain', 'Procedural landscape creation, erosion simulation, and biome auto-painting.', <Mountain size={28} />)}
             <div className="p-6 flex flex-col gap-4 overflow-y-auto">
               <div className="bg-[#161b22] border border-[#30363d] rounded p-4 text-[#c9d1d9] text-[13px] flex items-start gap-4">
                 <div className="bg-[#3fb950]/20 text-[#3fb950] p-2 rounded shrink-0">
                    <Mountain size={24} />
                 </div>
                 <div>
                    <h3 className="font-bold text-[#3fb950] mb-1">Procedural Erosion & Heightmaps</h3>
                    <p className="text-[#8b949e]">Utilize AI-driven fractal noise and real-world hydraulic erosion data to formulate massive 8K terrain heightmaps instantly.</p>
                 </div>
               </div>
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-2 bg-[#0d1117] border border-[#30363d] p-3 rounded">
                     <span className="text-[11px] text-[#8b949e] font-bold">Hydraulic Erosion</span>
                     <input type="range" className="w-full" />
                  </div>
                  <div className="flex flex-col gap-2 bg-[#0d1117] border border-[#30363d] p-3 rounded">
                     <span className="text-[11px] text-[#8b949e] font-bold">Thermal Weathering</span>
                     <input type="range" className="w-full" />
                  </div>
                  <div className="flex flex-col gap-2 bg-[#0d1117] border border-[#30363d] p-3 rounded">
                     <span className="text-[11px] text-[#8b949e] font-bold">Mountain Folding</span>
                     <input type="range" className="w-full" />
                  </div>
                  <div className="flex flex-col gap-2 bg-[#0d1117] border border-[#30363d] p-3 rounded">
                     <span className="text-[11px] text-[#8b949e] font-bold">Biome Seed</span>
                     <input type="number" className="bg-[#161b22] text-[#c9d1d9] border border-[#30363d] px-2 py-1 rounded" defaultValue="492812" />
                  </div>
               </div>
               <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-lg flex items-center justify-center h-[200px] text-[#8b949e] text-[12px]">
                   [ Heightmap Generation Preview Viewport ]
               </div>
               <div className="flex justify-end gap-2">
                   <button className="px-4 py-2 bg-[#3fb950] hover:bg-[#2ea043] text-white font-bold rounded text-[12px] transition-colors">Apply to World Partition Map</button>
               </div>
             </div>
           </>
         );
      case 'ImageEdit':
         return (
           <>
             {renderHeader('Image & Texture AI Editor', 'Offline Diffusion text-to-image, texture upscaling, and concept art generation.', <ImageIcon size={28} />)}
             <div className="p-6 flex flex-col gap-4 overflow-y-auto">
               <div className="bg-[#161b22] border border-[#30363d] rounded p-4 text-[#c9d1d9] text-[13px] flex items-start gap-4">
                 <div className="bg-[#bc8cff]/20 text-[#bc8cff] p-2 rounded shrink-0">
                    <Wand2 size={24} />
                 </div>
                 <div>
                    <h3 className="font-bold text-[#bc8cff] mb-1">Local AI Diffusion Active</h3>
                    <p className="text-[#8b949e]">Generate seamless textures, PBR maps, or iterate on concept art using a local Stable Diffusion backbone. Safe and offline.</p>
                 </div>
               </div>
               
               <div className="flex gap-4 h-[300px]">
                  <div className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden flex flex-col relative group">
                     {/* Preview Canvas */}
                     <div className="absolute inset-0 bg-[#161b22] flex items-center justify-center relative bg-[url('https://picsum.photos/seed/cyberpunk_art/800/600')] bg-cover bg-center">
                        <div className="absolute inset-0 bg-black/40 opactiy-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                           <span className="text-white font-bold drop-shadow-md flex items-center gap-2"><ImageIcon size={16}/> Generated_Concept_001.png</span>
                        </div>
                     </div>
                  </div>
                  <div className="w-[300px] flex flex-col gap-4">
                     <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-lg flex flex-col gap-3 h-full">
                        <p className="text-[12px] text-[#8b949e] font-bold uppercase tracking-wider">Prompt</p>
                        <textarea className="w-full bg-[#161b22] border border-[#30363d] rounded p-3 text-[13px] text-[#c9d1d9] outline-none focus:border-[#58a6ff] flex-1 custom-scrollbar" placeholder="A futuristic cyberpunk alleyway with neon signs..."></textarea>
                        
                        <div className="flex flex-col gap-2 mt-2">
                           <div className="flex justify-between text-[11px] text-[#8b949e]">
                              <span>Guidance Scale</span><span>7.5</span>
                           </div>
                           <input type="range" className="w-full" min="1" max="20" defaultValue="7.5"/>
                           <button className="mt-2 w-full px-4 py-2 bg-[#bc8cff] hover:bg-[#d2a8ff] text-[#0d1117] font-bold rounded text-[12px] transition-colors flex items-center justify-center gap-2">
                              <Wand2 size={14}/> Generate Image
                           </button>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-4 gap-4 mt-2">
                 {renderToolButton('Generate PBR Maps')}
                 {renderToolButton('Upscale 4x (ESRGAN)')}
                 {renderToolButton('Make Seamless')}
                 {renderToolButton('Remove Background')}
               </div>
             </div>
           </>
         );
      case 'AudioEdit':
         return (
           <>
             {renderHeader('Audio & SFX Studio', 'Local Audiocraft generation, TTS synthesis, and waveform editing.', <AudioWaveform size={28} />)}
             <div className="p-6 flex flex-col gap-4 overflow-y-auto w-full">
               <div className="bg-[#161b22] border border-[#30363d] rounded p-4 text-[#c9d1d9] text-[13px] flex items-start gap-4">
                 <div className="bg-[#3fb950]/20 text-[#3fb950] p-2 rounded shrink-0">
                    <Music size={24} />
                 </div>
                 <div>
                    <h3 className="font-bold text-[#3fb950] mb-1">AI Sound Synthesis</h3>
                    <p className="text-[#8b949e]">Utilize local models to generate sound effects, ambient music, and high-fidelity text-to-speech for characters.</p>
                 </div>
               </div>

               {/* Editor Interface */}
               <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 flex flex-col gap-4">
                  {/* Waveform Mock */}
                  <div className="w-full h-[120px] bg-[#161b22] border border-[#3fb950]/20 rounded relative flex items-center justify-center overflow-hidden">
                     <div className="absolute left-1/3 top-0 bottom-0 w-[2px] bg-[#ff7b72] z-20 pointer-events-none shadow-[0_0_10px_rgba(255,123,114,0.8)]"></div>
                     {/* Faking a waveform with CSS for demo purposes */}
                     <div className="w-full h-full flex items-center justify-between px-1 opacity-70">
                       {Array.from({ length: 60 }).map((_, i) => (
                         <div key={i} className="w-2 bg-[#3fb950]" style={{ height: (Math.random() * 80 + 10) + '%', borderRadius: '2px' }}></div>
                       ))}
                     </div>
                     <div className="absolute bottom-2 left-2 text-[#3fb950] text-[10px] font-mono bg-black/50 px-1 rounded">01:14:02 / 03:00:00</div>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex justify-between items-center bg-[#161b22] p-2 rounded border border-[#30363d]">
                     <div className="flex gap-2">
                        <button className="p-2 text-[#c9d1d9] hover:text-[#58a6ff] hover:bg-[#21262d] rounded transition-colors"><Rewind size={16} /></button>
                        <button className="p-2 text-[#0d1117] bg-[#58a6ff] hover:bg-[#79b8ff] rounded transition-colors"><Play size={16} fill="currentColor" /></button>
                        <button className="p-2 text-[#c9d1d9] hover:text-[#58a6ff] hover:bg-[#21262d] rounded transition-colors"><Pause size={16} fill="currentColor"/></button>
                        <button className="p-2 text-[#c9d1d9] hover:text-[#58a6ff] hover:bg-[#21262d] rounded transition-colors"><FastForward size={16} /></button>
                     </div>
                     <div className="flex items-center gap-3 w-[200px]">
                        <Sliders size={14} className="text-[#8b949e]" />
                        <input type="range" className="w-full h-1 bg-[#30363d] rounded-lg appearance-none cursor-pointer" />
                     </div>
                  </div>
               </div>

               {/* Generation Tools */}
               <div className="grid grid-cols-2 gap-4 mt-2">
                 <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-lg flex flex-col gap-3">
                   <h4 className="text-[#c9d1d9] text-[13px] font-bold flex items-center gap-2"><Mic size={16} className="text-[#58a6ff]"/> Offline Text-to-Speech</h4>
                   <textarea className="w-full bg-[#161b22] border border-[#30363d] rounded p-3 text-[12px] text-[#8b949e] h-[80px]" placeholder="Type dialogue here for the NPC..."></textarea>
                   <select className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[12px] p-2 rounded">
                      <option>Voice: Gruff Orc Warrior</option>
                      <option>Voice: Elven Mage</option>
                      <option>Voice: Cyberpunk Mercenary</option>
                   </select>
                   <button className="mt-1 w-full px-4 py-2 bg-[#58a6ff] hover:bg-[#79b8ff] text-[#0d1117] font-bold rounded text-[12px] transition-colors">Synthesize Voice</button>
                 </div>
                 
                 <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-lg flex flex-col gap-3">
                   <h4 className="text-[#c9d1d9] text-[13px] font-bold flex items-center gap-2"><AudioWaveform size={16} className="text-[#3fb950]"/> SFX / Music Generator</h4>
                   <textarea className="w-full bg-[#161b22] border border-[#30363d] rounded p-3 text-[12px] text-[#8b949e] h-[80px]" placeholder="e.g. A heavy metallic footstep echoing in a vast cave..."></textarea>
                   <div className="flex justify-between items-center text-[12px] text-[#8b949e] mt-2">
                      <span>Length</span><span>5s</span>
                   </div>
                   <input type="range" className="w-full h-1 bg-[#30363d] rounded-lg appearance-none cursor-pointer" />
                   <button className="mt-1 w-full px-4 py-2 bg-[#3fb950] hover:bg-[#2ea043] text-[#0d1117] font-bold rounded text-[12px] transition-colors">Generate Audio</button>
                 </div>
               </div>
               
             </div>
           </>
         );
      case 'NPCEdit':
         return (
           <>
             {renderHeader('Deep NPC Builder', 'Control every granular detail of your Non-Playable Characters with AI assistance.', <Users size={28} />)}
             <div className="p-6 flex flex-col gap-4 overflow-y-auto">
               <div className="bg-[#161b22] border border-[#58a6ff]/30 p-4 rounded text-[#c9d1d9] text-[13px] flex items-start gap-4">
                 <div className="bg-[#58a6ff]/20 text-[#58a6ff] p-2 rounded shrink-0">
                    <UserSquare size={24} />
                 </div>
                 <div>
                    <h3 className="font-bold text-[#58a6ff] mb-1">MetaHuman & Dialogue AI Integrated</h3>
                    <p className="text-[#8b949e]">Auto-rigged MetaHuman-level fidelity. Fully powered by Dialogue AI for infinite branching conversations that respond to real-time events dynamically. <span className="text-[#3fb950]">AI Linked</span></p>
                 </div>
               </div>
               <div className="grid grid-cols-3 gap-4">
                 {renderToolButton('Generate Bio & Backstory')}
                 {renderToolButton('Auto-Rig Facial Animation')}
                 {renderToolButton('Design Regional Outfit')}
                 {renderToolButton('Voice Synth (Local)')}
                 {renderToolButton('Behavior Tree Init')}
                 {renderToolButton('Dialogue Branching AI')}
               </div>
               <div className="bg-[#161b22] border border-[#30363d] rounded p-4 h-[250px] flex items-center justify-center text-[#8b949e] text-[12px]">
                  [ 3D Viewport - Select an NPC from the Explorer to visualize ]
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-[#8b949e]">
                  <div className="bg-[#0d1117] p-2 rounded border border-[#30363d]">Name: <span className="text-[#c9d1d9]">Unknown</span></div>
                  <div className="bg-[#0d1117] p-2 rounded border border-[#30363d]">Faction: <span className="text-[#c9d1d9]">None</span></div>
                  <div className="bg-[#0d1117] p-2 rounded border border-[#30363d]">Morality: <span className="text-[#c9d1d9]">Neutral</span></div>
                  <div className="bg-[#0d1117] p-2 rounded border border-[#30363d]">Dialogue Model: <span className="text-[#3fb950]">Infinite-Branch</span></div>
               </div>
             </div>
           </>
         );
      case 'MapEdit':
         return (
           <>
             {renderHeader('Environment & Map Editor', 'Massive 2D/3D map editing with automated Grid, BSP & PCG placement.', <MapIcon size={28} />)}
             <div className="p-6 flex flex-col gap-4 overflow-y-auto">
                <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="text-[#c9d1d9] text-[14px] font-bold">World Streaming & Open World Tech</h3>
                    <p className="text-[12px] text-[#8b949e]">Seamless World Partition loading, BSP Geometry (blockouts), and Procedural Generation (PCG).</p>
                  </div>
                  <div className="px-3 py-1 bg-[#2ea043]/10 border border-[#3fb950]/30 text-[#3fb950] rounded text-[12px] font-bold">Active</div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                   <div className="bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff] transition-colors rounded p-4 h-[120px] flex items-center justify-center text-[#8b949e] text-[12px] flex-col gap-2 cursor-pointer relative overflow-hidden group">
                     <GridIcon size={24} className="text-[#58a6ff] relative z-10"/>
                     <span className="relative z-10 text-center">Top-Down Grid / BSP</span>
                     <div className="absolute inset-0 bg-[#58a6ff]/5 hidden group-hover:block transition-all"></div>
                   </div>
                   <div className="bg-[#161b22] border border-[#30363d] hover:border-[#3fb950] transition-colors rounded p-4 h-[120px] flex items-center justify-center text-[#8b949e] text-[12px] flex-col gap-2 cursor-pointer relative overflow-hidden group">
                     <span className="absolute top-2 right-2 text-[8px] font-bold bg-[#3fb950]/20 text-[#3fb950] px-1 rounded">AI Gaea/Houdini</span>
                     <Mountain size={24} className="text-[#3fb950] relative z-10"/>
                     <span className="relative z-10 text-center">Pro Terrain System</span>
                     <div className="absolute inset-0 bg-[#3fb950]/5 hidden group-hover:block transition-all"></div>
                   </div>
                   <div className="bg-[#161b22] border border-[#30363d] hover:border-[#bc8cff] transition-colors rounded p-4 h-[120px] flex items-center justify-center text-[#8b949e] text-[12px] flex-col gap-2 cursor-pointer relative overflow-hidden group">
                     <span className="absolute top-2 right-2 text-[8px] font-bold bg-[#bc8cff]/20 text-[#bc8cff] px-1 rounded">Meshy.AI Local</span>
                     <BoxSelect size={24} className="text-[#bc8cff] relative z-10"/>
                     <span className="relative z-10 text-center">3D Model Generation</span>
                     <div className="absolute inset-0 bg-[#bc8cff]/5 hidden group-hover:block transition-all"></div>
                   </div>
                   <div className="bg-[#161b22] border border-[#30363d] hover:border-[#ff7b72] transition-colors rounded p-4 h-[120px] flex items-center justify-center text-[#8b949e] text-[12px] flex-col gap-2 cursor-pointer relative overflow-hidden group">
                     <Workflow size={24} className="text-[#ff7b72] relative z-10"/>
                     <span className="relative z-10 text-center">Procedural PCG Nodes</span>
                     <div className="absolute inset-0 bg-[#ff7b72]/5 hidden group-hover:block transition-all"></div>
                   </div>
                   <div className="bg-[#161b22] border border-[#30363d] hover:border-[#e3b341] transition-colors rounded p-4 h-[120px] flex items-center justify-center text-[#8b949e] text-[12px] flex-col gap-2 cursor-pointer col-span-2 lg:col-span-4 relative overflow-hidden group">
                     <Database size={24} className="text-[#e3b341] relative z-10"/>
                     <span className="relative z-10 text-center">Prefabs & Modular Sys</span>
                     <div className="absolute inset-0 bg-[#e3b341]/5 hidden group-hover:block transition-all"></div>
                   </div>
                </div>
             </div>
           </>
         );
      case 'MonsterEdit':
         return (
           <>
             {renderHeader('Entity & Monster Builder', 'Stat generation, complex Rigging, and behavior mechanics for enemies.', <Ghost size={28} />)}
             <div className="p-6 flex flex-col gap-4 overflow-y-auto">
               <div className="bg-[#161b22] border border-[#30363d] rounded p-4 text-[#c9d1d9] text-[13px] flex items-start gap-4">
                 <div className="bg-[#3fb950]/20 text-[#3fb950] p-2 rounded shrink-0">
                    <Ghost size={24} />
                 </div>
                 <div>
                    <h3 className="font-bold text-[#58a6ff] mb-1">AI Entity Kinematics Engine (Offline)</h3>
                    <p className="text-[#8b949e]">Generates realistic control systems and physical constraints for biological, demon, and special monster frameworks. <span className="text-[#c9d1d9] font-mono">Status: &gt; 5,000,000,000 Real-world reference parameters loaded.</span></p>
                 </div>
               </div>
               <div className="grid grid-cols-3 gap-4">
                 {renderToolButton('Generate Bestiary Entry')}
                 {renderToolButton('AI Physics Locomotion Rig')}
                 {renderToolButton('Combat AI Weights')}
               </div>
               <div className="flex gap-4">
                 <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded p-4 h-[200px] flex items-center justify-center text-[#8b949e] text-[12px]">
                    [ Mesh & Physics Viewer ]
                 </div>
                 <div className="w-[300px] bg-[#161b22] border border-[#30363d] rounded flex flex-col">
                   <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#c9d1d9]">Stats & Mechanics</div>
                   <div className="p-3 custom-scrollbar overflow-y-auto space-y-2 text-[11px]">
                     <div className="flex justify-between"><span className="text-[#8b949e]">HP</span><span className="text-[#ff7b72] font-mono">15,000</span></div>
                     <div className="flex justify-between"><span className="text-[#8b949e]">Damage: Phys</span><span className="text-[#c9d1d9] font-mono">250</span></div>
                     <div className="flex justify-between"><span className="text-[#8b949e]">Damage: Magic</span><span className="text-[#c9d1d9] font-mono">80</span></div>
                     <div className="flex justify-between"><span className="text-[#8b949e]">Behavior Tree</span><span className="text-[#3fb950]">AI Linked</span></div>
                     <div className="flex justify-between"><span className="text-[#8b949e]">NavMesh Agent</span><span className="text-[#58a6ff]">Bound</span></div>
                     <div className="flex justify-between"><span className="text-[#8b949e]">Soft-body Physics</span><span className="text-[#3fb950]">Enabled</span></div>
                   </div>
                 </div>
               </div>
             </div>
           </>
         );
      case 'PhysicsEngine':
         return (
           <>
             {renderHeader('Universal Physics Dynamics', 'Hyper-realistic offline AI physics system generation.', <Orbit size={28} />)}
             <div className="p-6 flex flex-col gap-6 overflow-y-auto">
               <div className="bg-[#0d1117] border border-[#f85149]/30 p-4 rounded-lg flex flex-col gap-2">
                 <div className="flex justify-between items-center">
                    <h3 className="text-[#c9d1d9] text-[14px] font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#f85149] animate-pulse"></div> Quantum-Scale Simulation Engine</h3>
                    <div className="px-3 py-1 bg-[#2ea043]/10 border border-[#3fb950]/30 text-[#3fb950] rounded text-[12px] font-bold font-mono">&gt; 10e18 Particles/Sec</div>
                 </div>
                 <p className="text-[12px] text-[#8b949e]">AI handles over a trillion sub-system variations including Water (Fluid), Fire (Thermodynamics), Wind (Aerodynamics), Cloth, Dirt, Electricity, Light Waves, and Air Resistance kinematics.</p>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg flex flex-col items-center justify-center text-center gap-2 hover:border-[#58a6ff] cursor-pointer">
                     <Droplets size={24} className="text-[#58a6ff]" />
                     <span className="text-[12px] font-bold text-[#c9d1d9]">Fluid Dynamics</span>
                     <span className="text-[10px] text-[#8b949e]">(Water, Lava, Blood)</span>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg flex flex-col items-center justify-center text-center gap-2 hover:border-[#ff7b72] cursor-pointer">
                     <Flame size={24} className="text-[#ff7b72]" />
                     <span className="text-[12px] font-bold text-[#c9d1d9]">Thermodynamics</span>
                     <span className="text-[10px] text-[#8b949e]">(Fire, Heat Distortion)</span>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg flex flex-col items-center justify-center text-center gap-2 hover:border-[#c9d1d9] cursor-pointer">
                     <Wind size={24} className="text-[#c9d1d9]" />
                     <span className="text-[12px] font-bold text-[#c9d1d9]">Aerodynamics</span>
                     <span className="text-[10px] text-[#8b949e]">(Wind, Air Resistance)</span>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg flex flex-col items-center justify-center text-center gap-2 hover:border-[#e3b341] cursor-pointer">
                     <Zap size={24} className="text-[#e3b341]" />
                     <span className="text-[12px] font-bold text-[#c9d1d9]">Electromagnetics</span>
                     <span className="text-[10px] text-[#8b949e]">(Electricity, Light)</span>
                  </div>
               </div>
               
               <div className="bg-[#161b22] border border-[#30363d] rounded p-4 flex gap-4">
                 <div className="flex-1 bg-[#0d1117] border border-[#30363d] rounded p-4 max-h-[150px] overflow-y-auto font-mono text-[10px] text-[#8b949e]">
                    [AI.Dynamics] Initializing PhysX & Chaos backend bridge... OK<br/>
                    [AI.Dynamics] Loading soft-body cloth tear index & hair sim... OK (4.2M vertices)<br/>
                    [AI.Dynamics] Synthesizing dirt/mud particle cohesion... OK<br/>
                    [AI.Dynamics] Raytraced photon physics mapped.<br/>
                    [AI.Dynamics] Volumetric Destruction System (Mesh Slicing)... OK<br/>
                    [AI.Dynamics] Advanced Ragdoll & Inverse Kinematics mapping... OK<br/>
                    [AI.Dynamics] Validating all physical constraints... SUCCESS.
                 </div>
                 <div className="w-[150px] flex flex-col gap-2 justify-center">
                   <button className="bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/40 rounded py-2 text-[12px] font-bold hover:bg-[#3fb950]/30 transition-colors">Inject to Global</button>
                 </div>
               </div>
             </div>
           </>
         );
      case 'GameSystems':
         return (
           <>
             {renderHeader('AAA Game Systems Architecture', 'Instantly embed complex logic systems (FPS, RPG, MMO).', <Blocks size={28} />)}
             <div className="p-6 flex flex-col gap-6 overflow-y-auto">
               <div className="bg-[#161b22] border border-[#58a6ff]/30 p-4 rounded-lg">
                 <h3 className="text-[#c9d1d9] text-[14px] font-bold mb-2">Automated Architecture Registry</h3>
                 <p className="text-[12px] text-[#8b949e]">AI Core has integrated over 1,000,000,000,000,000,000 permutations of game logic systems for instant deployment in AAA quality.</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 <div className="bg-[#0d1117] border border-[#30363d] rounded overflow-hidden">
                    <div className="bg-[#161b22] px-3 py-2 border-b border-[#30363d] text-[12px] font-bold text-[#c9d1d9] flex justify-between">
                      <span>Combat & Action</span>
                      <span className="text-[#3fb950]">Ready</span>
                    </div>
                    <div className="p-3 text-[11px] text-[#8b949e] flex flex-col gap-2">
                       <label className="flex items-center gap-2 cursor-pointer hover:text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#58a6ff]"/> Advanced Collision Matrices</label>
                       <label className="flex items-center gap-2 cursor-pointer hover:text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#58a6ff]"/> Weapon Recoil & Ballistics</label>
                       <label className="flex items-center gap-2 cursor-pointer hover:text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#58a6ff]"/> 3D/2D Hitbox Profiling</label>
                       <label className="flex items-center gap-2 cursor-pointer hover:text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#58a6ff]"/> Full RPG/MMO Hotkey & Input Pipeline</label>
                    </div>
                 </div>

                 <div className="bg-[#0d1117] border border-[#30363d] rounded overflow-hidden">
                    <div className="bg-[#161b22] px-3 py-2 border-b border-[#30363d] text-[12px] font-bold text-[#c9d1d9] flex justify-between">
                      <span>Game Mechanics</span>
                      <span className="text-[#3fb950]">Ready</span>
                    </div>
                    <div className="p-3 text-[11px] text-[#8b949e] flex flex-col gap-2">
                       <label className="flex items-center gap-2 cursor-pointer hover:text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#58a6ff]"/> Level Design Validation</label>
                       <label className="flex items-center gap-2 cursor-pointer hover:text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#58a6ff]"/> Dynamic Difficulty Curve</label>
                       <label className="flex items-center gap-2 cursor-pointer hover:text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#58a6ff]"/> Automated Reward Systems</label>
                       <label className="flex items-center gap-2 cursor-pointer hover:text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#58a6ff]"/> Deep Save/Load state sync</label>
                    </div>
                 </div>
                 
                 <div className="bg-[#0d1117] border border-[#30363d] rounded overflow-hidden lg:col-span-1 md:col-span-2">
                    <div className="bg-[#161b22] px-3 py-2 border-b border-[#30363d] text-[12px] font-bold text-[#c9d1d9] flex justify-between">
                      <span>Vitality & Status</span>
                      <span className="text-[#3fb950]">Ready</span>
                    </div>
                    <div className="p-3 text-[11px] text-[#8b949e] flex flex-col gap-2">
                       <div className="flex justify-between items-center"><span className="text-[#c9d1d9]">Health & Resource Models</span> <span className="font-mono text-[#58a6ff]">&gt; 2,000,000 instances</span></div>
                       <p className="mt-2 text-[10px]">AI has verified all edge cases for debuffs, buffs, elemental resistance, and overshield mechanics based on AAA engine data mapping.</p>
                       <button className="mt-2 bg-[#21262d] border border-[#30363d] hover:border-[#58a6ff] py-1 text-center rounded transition-colors text-[#c9d1d9]">Deploy Architecture Node</button>
                    </div>
                 </div>
               </div>
             </div>
           </>
         );
      case 'EngineCore':
         return (
           <>
             {renderHeader('Core Engine Setup & Code', 'GameObject entity components, Unity/Unreal scripting paradigms, and Plugin mapping.', <Cpu size={28} />)}
             <div className="p-6 flex flex-col gap-4 overflow-y-auto">
               <div className="bg-[#161b22] border border-[#30363d] p-4 rounded text-[#c9d1d9] text-[12px] flex flex-col gap-2">
                 <div className="flex justify-between items-center text-[14px] font-bold text-[#58a6ff]">
                    <span>GameObject Component Architecture Map</span>
                    <span className="text-[#3fb950] font-mono text-[10px] px-2 py-1 rounded bg-[#2ea043]/10 border border-[#3fb950]/30">Live Sync</span>
                 </div>
                 <p className="text-[#8b949e]">Every entity leverages a unified Start(), Update() lifecycle compatible visually and across C#, UnrealScript, and Blueprints/Kismet.</p>
                 <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-[#21262d] px-2 py-1 rounded border border-[#30363d]">Transform (Position/Rot/Scale)</span>
                    <span className="bg-[#21262d] px-2 py-1 rounded border border-[#30363d]">MeshRenderer</span>
                    <span className="bg-[#21262d] px-2 py-1 rounded border border-[#30363d]">Rigidbody (Mass, Gravity)</span>
                    <span className="bg-[#21262d] px-2 py-1 rounded border border-[#30363d]">Colliders / Joints</span>
                    <span className="bg-[#21262d] px-2 py-1 rounded border border-[#30363d]">C# / UnrealScript Embeds</span>
                    <span className="bg-[#21262d] px-2 py-1 rounded border border-[#30363d] text-[#bc8cff]">Visual Node Graph (Blueprints)</span>
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded text-[11px] text-[#8b949e]">
                     <h3 className="font-bold text-[#c9d1d9] mb-2 uppercase tracking-wide flex justify-between">Package & Asset Store <BoxSelect size={14} className="text-[#3fb950]"/></h3>
                     <p>Connect to the global Asset Store or inject local packages seamlessly. Plugin ecosystem includes Unity Store clones and Unreal Marketplace bridging.</p>
                     <button className="mt-3 bg-[#161b22] hover:bg-[#21262d] text-[#c9d1d9] border border-[#30363d] rounded px-3 py-1.5 w-full transition-colors flex justify-between items-center">
                        Launch Package Manager <DownloadCloud size={14}/>
                     </button>
                  </div>
                  <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded text-[11px] text-[#8b949e]">
                     <h3 className="font-bold text-[#c9d1d9] mb-2 uppercase tracking-wide flex justify-between">UI & HUD Systems <Layers size={14} className="text-[#bc8cff]"/></h3>
                     <p>Generate responsive Canvases with AI mapping for Buttons, Text, Health Bars, Mini-maps, and immersive diegetic interfaces.</p>
                     <button className="mt-3 bg-[#161b22] hover:bg-[#21262d] text-[#c9d1d9] border border-[#30363d] rounded px-3 py-1.5 w-full transition-colors flex justify-between items-center">
                        Generate HUD Template <Code2 size={14}/>
                     </button>
                  </div>
               </div>
             </div>
           </>
         );
      case 'GraphicsRender':
         return (
           <>
             {renderHeader('Rendering Tech & Graphics', 'Advanced lighting, PBR, Nanite, Lumen, Upscalers.', <MonitorPlay size={28} />)}
             <div className="p-6 flex flex-col gap-4 overflow-y-auto">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#161b22] border border-[#30363d] p-4 rounded text-[12px]">
                     <h3 className="font-bold text-[#ff7b72] mb-3 border-b border-[#30363d] pb-2">Global Rendering Pipeline</h3>
                     <div className="flex flex-col gap-2 text-[#c9d1d9]">
                        <label className="flex items-center gap-2"><input type="radio" name="pipeline" className="accent-[#ff7b72]"/> Built-in Render Pipeline (Legacy)</label>
                        <label className="flex items-center gap-2"><input type="radio" name="pipeline" className="accent-[#ff7b72]"/> URP (Universal / Mobile Optimized)</label>
                        <label className="flex items-center gap-2"><input type="radio" name="pipeline" defaultChecked className="accent-[#ff7b72]"/> HDRP (AAA Graphics, High-End)</label>
                     </div>
                     <div className="mt-4 flex flex-col gap-2">
                        <div className="flex justify-between items-center"><span className="text-[#8b949e]">Nanite Virtual Geometry</span><span className="text-[#3fb950] font-mono">ON</span></div>
                        <div className="flex justify-between items-center"><span className="text-[#8b949e]">Lumen Global Illum.</span><span className="text-[#3fb950] font-mono">ON</span></div>
                        <div className="flex justify-between items-center"><span className="text-[#8b949e]">Ray Tracing (RTX)</span><span className="text-[#3fb950] font-mono">READY</span></div>
                        <div className="flex justify-between items-center"><span className="text-[#8b949e]">Virtual Shadow Maps</span><span className="text-[#3fb950] font-mono">ON</span></div>
                     </div>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] p-4 rounded text-[12px]">
                     <h3 className="font-bold text-[#58a6ff] mb-3 border-b border-[#30363d] pb-2">Upscaling & Post Processing</h3>
                     <div className="grid grid-cols-2 text-[11px] gap-2 mb-4">
                        <span className="bg-[#0d1117] p-2 rounded border border-[#30363d] text-center text-[#c9d1d9]">DLSS 1-5 (NVIDIA)</span>
                        <span className="bg-[#0d1117] p-2 rounded border border-[#30363d] text-center text-[#c9d1d9]">FSR 1-3.1 (AMD)</span>
                        <span className="bg-[#0d1117] p-2 rounded border border-[#30363d] text-center text-[#c9d1d9]">XeSS (Intel)</span>
                        <span className="bg-[#0d1117] p-2 rounded border border-[#30363d] text-center text-[#c9d1d9]">AI Frame Gen</span>
                     </div>
                     <div className="space-y-1 mt-2 text-[10px] text-[#8b949e]">
                       <div className="flex justify-between"><span>Physical Based Render (PBR)</span> <span className="text-white">Active</span></div>
                       <div className="flex justify-between"><span>HDR & Bloom Limits</span> <span className="text-white">Film-Curve</span></div>
                     </div>
                  </div>
               </div>
             </div>
           </>
         );
      case 'AnimationAudio':
         return (
           <>
             {renderHeader('Animation & Spatial Audio', 'Blend trees, Rigging, MoCap mapping, IK, and 3D acoustics.', <Activity size={28} />)}
             <div className="p-6 flex flex-col gap-4 overflow-y-auto">
               <div className="p-4 bg-[#0d1117] border border-[#d2a8ff]/30 rounded-lg flex gap-4 items-center">
                  <AudioWaveform size={32} className="text-[#d2a8ff]" />
                  <div className="flex-1 text-[12px] text-[#8b949e]">
                     <h3 className="font-bold text-[#c9d1d9] text-[14px]">Advanced Spatial Audio (Source/Listener)</h3>
                     <p>Full 3D Positional Audio, Audio Mixers with ducking, filtering, and dynamic room reverb configurations mapped via AI acoustic models.</p>
                  </div>
               </div>
               <div className="grid grid-cols-3 gap-3">
                 <div className="bg-[#161b22] border border-[#30363d] rounded p-4 text-center hover:border-[#58a6ff] transition-colors cursor-pointer text-[#8b949e] flex flex-col items-center gap-2">
                    <Videotape size={24} className="text-[#58a6ff]"/>
                    <span className="text-[12px] font-bold text-[#c9d1d9]">Skeletal Anim & Rigging</span>
                 </div>
                 <div className="bg-[#161b22] border border-[#30363d] rounded p-4 text-center hover:border-[#58a6ff] transition-colors cursor-pointer text-[#8b949e] flex flex-col items-center gap-2">
                    <ActivitySquare size={24} className="text-[#3fb950]"/>
                    <span className="text-[12px] font-bold text-[#c9d1d9]">Animator Blend Trees</span>
                 </div>
                 <div className="bg-[#161b22] border border-[#30363d] rounded p-4 text-center hover:border-[#58a6ff] transition-colors cursor-pointer text-[#8b949e] flex flex-col items-center gap-2">
                    <Fingerprint size={24} className="text-[#bc8cff]"/>
                    <span className="text-[12px] font-bold text-[#c9d1d9]">Inverse Kinematics (IK)</span>
                 </div>
               </div>
               <div className="text-[11px] text-[#3fb950] font-mono bg-[#161b22] p-3 border border-[#3fb950]/30 rounded">
                 [MoCap Engine Validated] Ready to retarget raw Motion Capture data onto MetaHuman or custom skeletons.
               </div>
             </div>
           </>
         );
      case 'BackendCloud':
         return (
           <>
             {renderHeader('Network, Cloud & Multiplayer', 'Matchmaking, DB, Leaderboards, Sync, and Export handling.', <Cloud size={28} />)}
             <div className="p-6 flex flex-col gap-4 overflow-y-auto">
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 <div className="bg-[#161b22] border border-[#30363d] p-3 rounded">
                    <div className="text-[#c9d1d9] text-[12px] font-bold border-b border-[#30363d] pb-1 mb-2 flex justify-between items-center">Multiplayer <Network size={14}/></div>
                    <ul className="text-[11px] text-[#8b949e] space-y-1">
                      <li>• Server / Client Architect</li>
                      <li>• Player Tick Data Sync</li>
                      <li>• Matchmaking Lobbies</li>
                      <li>• Cross-platform / Crossplay</li>
                    </ul>
                 </div>
                 <div className="bg-[#161b22] border border-[#30363d] p-3 rounded">
                    <div className="text-[#c9d1d9] text-[12px] font-bold border-b border-[#30363d] pb-1 mb-2 flex justify-between items-center">Database & Services <Database size={14}/></div>
                    <ul className="text-[11px] text-[#8b949e] space-y-1">
                      <li>• JWT Login / Accounts</li>
                      <li>• Cloud Save & Progression</li>
                      <li>• Game Economy Systems</li>
                      <li>• Global Leaderboards</li>
                    </ul>
                 </div>
                 <div className="bg-[#161b22] border border-[#30363d] p-3 rounded">
                    <div className="text-[#c9d1d9] text-[12px] font-bold border-b border-[#30363d] pb-1 mb-2 flex justify-between items-center">Deployment <CloudCog size={14}/></div>
                    <ul className="text-[11px] text-[#8b949e] space-y-1">
                      <li>• Export to PC/Mobile/Console</li>
                      <li>• Auto Upload to Steam/Play</li>
                      <li>• Cloud Gaming Ready Stream</li>
                      <li>• Update Patch Gen & Sync</li>
                    </ul>
                 </div>
               </div>
               <div className="bg-[#0d1117] border border-[#58a6ff]/30 p-4 rounded text-[12px] flex flex-col gap-1">
                 <span className="font-bold text-[#58a6ff] flex items-center gap-2"><TrendingUp size={16}/> LiveOps Analytics Platform</span>
                 <span className="text-[#8b949e] text-[11px]">Track player behavior, retention rates, drop-offs, and dynamically adjust game balance via AI over-the-air patches without full redeploys.</span>
               </div>
             </div>
           </>
         );
      case 'AITestingQA':
         return (
           <>
             {renderHeader('AI Quality Assurance & Testing', 'Automated Bug finding, Performance metrics, and Behavior Trees.', <ShieldCheck size={28} />)}
             <div className="p-6 flex flex-col gap-4 overflow-y-auto">
               <div className="flex gap-4">
                  <div className="flex-[2] bg-[#161b22] border border-[#30363d] p-4 rounded flex flex-col text-[12px]">
                    <h3 className="font-bold text-[#c9d1d9] mb-3">Offline AI QA Agents</h3>
                    <div className="space-y-2">
                      <div className="bg-[#0d1117] border border-[#3fb950]/30 p-2 rounded flex justify-between items-center">
                         <span className="text-[#8b949e] flex items-center gap-2"><Bug size={14} className="text-[#ff7b72]"/> Static Bug Hunting</span>
                         <span className="text-[#3fb950] font-mono">Running</span>
                      </div>
                      <div className="bg-[#0d1117] border border-[#3fb950]/30 p-2 rounded flex justify-between items-center">
                         <span className="text-[#8b949e] flex items-center gap-2"><ActivitySquare size={14} className="text-[#e3b341]"/> FPS & Lag Profiling</span>
                         <span className="text-[#3fb950] font-mono">Active Monitoring</span>
                      </div>
                      <div className="bg-[#0d1117] border border-[#3fb950]/30 p-2 rounded flex justify-between items-center">
                         <span className="text-[#8b949e] flex items-center gap-2"><ShieldAlert size={14} className="text-[#c9d1d9]"/> Playtest Automation</span>
                         <span className="text-[#3fb950] font-mono">1M Sessions Simulated</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-[1] bg-[#161b22] border border-[#30363d] border-b-4 border-b-[#bc8cff] p-4 rounded flex flex-col text-[12px] text-center justify-center gap-2">
                     <CheckCircle size={32} className="text-[#bc8cff] mx-auto" />
                     <span className="font-bold text-[#c9d1d9]">Behavior & Dialogue</span>
                     <span className="text-[#8b949e] text-[10px]">AI validates NavMesh, Behavior Trees, and Dialogue logic flows.</span>
                  </div>
               </div>
             </div>
           </>
         );
      case 'Niagara':
         return (
           <>
             {renderHeader('Niagara Particle FX', 'Next-gen node-based VFX system. Create fire, smoke, magic, and fluid simulations.', <Sparkles size={28} />)}
             <div className="p-6 flex flex-col gap-4 overflow-y-auto">
               <div className="flex gap-4 h-[350px]">
                 <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg relative overflow-hidden flex items-center justify-center">
                    {/* Simulated Particle Sparkles */}
                    <div className="absolute inset-0 bg-[#0d1117] flex items-center justify-center">
                       <div className="relative w-32 h-32 flex justify-center items-center">
                         <div className="absolute w-2 h-2 bg-orange-400 rounded-full shadow-[0_0_20px_10px_rgba(251,146,60,0.8)] animate-ping"></div>
                         <div className="absolute w-1 h-1 bg-yellow-300 rounded-full shadow-[0_0_15px_5px_rgba(253,224,71,0.9)] animate-pulse" style={{ transform: 'translate(20px, -30px)' }}></div>
                         <div className="absolute w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_25px_8px_rgba(239,68,68,0.8)] animate-bounce" style={{ transform: 'translate(-30px, 10px)' }}></div>
                         <div className="absolute w-3 h-3 bg-orange-500/50 rounded-full blur-md" style={{ transform: 'translate(10px, 20px)' }}></div>
                       </div>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/60 px-2 py-1 rounded text-[10px] font-mono text-[#3fb950]">Sprite Render: 12,504 Particles</div>
                 </div>
                 <div className="w-[300px] bg-[#0d1117] border border-[#30363d] rounded-lg p-4 flex flex-col gap-4">
                    <h3 className="text-[#c9d1d9] text-[13px] font-bold uppercase tracking-wider border-b border-[#30363d] pb-2">Emitter Settings</h3>
                    <div className="flex flex-col gap-2">
                       <span className="text-[11px] text-[#8b949e]">Spawn Rate</span>
                       <input type="range" className="w-full" defaultValue="80" />
                    </div>
                    <div className="flex flex-col gap-2">
                       <span className="text-[11px] text-[#8b949e]">Wind Velocity</span>
                       <div className="flex gap-2">
                         <input type="number" className="w-1/3 bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[11px] rounded px-1" defaultValue="0" />
                         <input type="number" className="w-1/3 bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[11px] rounded px-1" defaultValue="0" />
                         <input type="number" className="w-1/3 bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[11px] rounded px-1" defaultValue="150" />
                       </div>
                    </div>
                    <div className="flex flex-col gap-2">
                       <span className="text-[11px] text-[#8b949e]">Gravity Modifier</span>
                       <input type="range" min="-1" max="1" step="0.1" className="w-full" defaultValue="-0.2" />
                    </div>
                    <div className="mt-auto">
                       <button className="w-full mt-2 bg-[#58a6ff] hover:bg-[#79b8ff] text-[#0d1117] py-1.5 rounded font-bold text-[12px] transition-colors">Compile Emitter</button>
                    </div>
                 </div>
               </div>
             </div>
           </>
         );
      case 'Sequencer':
         return (
           <>
             {renderHeader('Cinematic Sequencer', 'Multi-track timeline for rendering cutscenes, audio syncing, and camera paths.', <Clapperboard size={28} />)}
             <div className="p-6 flex flex-col gap-4 overflow-y-auto">
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg h-[400px] flex flex-col overflow-hidden">
                   <div className="h-10 bg-[#0d1117] border-b border-[#30363d] flex items-center px-4 gap-4">
                      <button className="text-[#3fb950] hover:text-[#2ea043]"><Play size={16} fill="currentColor"/></button>
                      <button className="text-[#c9d1d9] hover:text-white"><Pause size={16} fill="currentColor"/></button>
                      <span className="text-[#8b949e] font-mono text-[11px] ml-4">00:00:14:23 / 00:02:00:00</span>
                      <span className="text-[#d2a8ff] font-mono text-[11px] ml-auto">Sequence: Opening_Cutscene_01</span>
                   </div>
                   <div className="flex-1 flex overflow-hidden">
                      {/* Tracks Left Panel */}
                      <div className="w-[200px] bg-[#0d1117] border-r border-[#30363d] flex flex-col pt-6 font-mono text-[10px] text-[#8b949e]">
                         <div className="px-2 py-2 border-b border-[#30363d] text-[#c9d1d9] bg-[#21262d]">CameraCuts</div>
                         <div className="px-2 py-2 border-b border-[#30363d] flex items-center gap-2"><Videotape size={12} className="text-[#ff7b72]"/> CineCameraActor</div>
                         <div className="px-2 py-2 border-b border-[#30363d] flex items-center gap-2 pl-4">Transform</div>
                         <div className="px-2 py-2 border-b border-[#30363d] flex items-center gap-2"><Music size={12} className="text-[#3fb950]"/> Master Audio</div>
                      </div>
                      {/* Timeline Area (Mock) */}
                      <div className="flex-1 bg-[#161b22] relative overflow-x-auto">
                         <div className="absolute top-0 bottom-0 left-32 w-[1px] bg-[#f85149] z-10"></div>
                         
                         {/* Ruler */}
                         <div className="h-6 border-b border-[#30363d] flex items-end px-2 text-[9px] text-[#8b949e] gap-12 bg-[#0d1117]">
                           <span>0000</span><span>0030</span><span>0060</span><span>0090</span><span>0120</span>
                         </div>
                         
                         {/* Tracks */}
                         <div className="h-[33px] border-b border-[#30363d] relative">
                            <div className="absolute top-1 bottom-1 left-2 w-48 bg-[#21262d] border border-[#8b949e] rounded flex items-center px-2 text-[9px] text-white">Shot 1</div>
                            <div className="absolute top-1 bottom-1 left-52 w-64 bg-[#21262d] border border-[#8b949e] rounded flex items-center px-2 text-[9px] text-white">Shot 2 (Close Up)</div>
                         </div>
                         <div className="h-[33px] border-b border-[#30363d] relative flex items-center">
                            <div className="absolute left-12 w-2 h-2 rounded-full border-2 border-[#ff7b72]"></div>
                            <div className="absolute left-40 w-2 h-2 rounded-full border-2 border-[#ff7b72]"></div>
                            <div className="absolute left-64 w-2 h-2 rounded-full border-2 border-[#ff7b72] bg-[#ff7b72]"></div>
                         </div>
                         <div className="h-[33px] border-b border-[#30363d] relative"></div>
                         <div className="h-[33px] border-b border-[#30363d] relative">
                            <div className="absolute top-1 bottom-1 left-0 w-80 bg-[#3fb950]/20 border border-[#3fb950]/50 rounded text-[9px] px-2 flex items-center text-[#3fb950]">Epic_BGM_Loop.wav</div>
                         </div>
                      </div>
                   </div>
                </div>
                <div className="flex justify-end mt-2">
                   <button className="px-4 py-2 bg-[#bc8cff] hover:bg-[#d2a8ff] text-[#0d1117] font-bold rounded text-[12px] transition-colors"><Clapperboard size={14} className="inline mr-2"/>Render Movie</button>
                </div>
             </div>
           </>
         );
      case 'PCG':
         return (
           <>
             {renderHeader('Procedural Content Generation (PCG)', 'Rule-based node graphs for assembling cities, forests, and scattering objects.', <Workflow size={28} />)}
             <div className="p-6 flex flex-col gap-4 overflow-y-auto">
               <div className="bg-[#161b22] border border-[#3fb950]/50 p-4 rounded-lg flex flex-col gap-3">
                  <h3 className="text-[#3fb950] font-bold uppercase tracking-wider text-[12px]">PCG Graph Active</h3>
                  <p className="text-[#8b949e] text-[12px]">Use AI to define splines and scattering rules. The AI will output a ReactFlow structure for you to wire mesh variations, density filters, and surface sampling.</p>
                  
                  <div className="bg-[#0d1117] border border-[#30363d] rounded p-4 h-[200px] mt-4 flex items-center justify-center flex-col gap-2 relative overflow-hidden group">
                     {/* Mock node setup */}
                     <div className="flex items-center gap-10 opacity-70">
                       <div className="border border-[#e3b341] bg-[#e3b341]/10 px-3 py-1 rounded text-[#e3b341] text-[11px]">Surface Sampler</div>
                       <div className="w-16 h-[2px] bg-[#8b949e]"></div>
                       <div className="border border-[#58a6ff] bg-[#58a6ff]/10 px-3 py-1 rounded text-[#58a6ff] text-[11px]">Density Filter</div>
                       <div className="w-16 h-[2px] bg-[#8b949e]"></div>
                       <div className="border border-[#79c0ff] bg-[#79c0ff]/10 px-3 py-1 rounded text-[#79c0ff] text-[11px]">Static Mesh Spawner [Trees]</div>
                     </div>
                  </div>
               </div>
               <div className="flex justify-end gap-2">
                   <button className="px-4 py-2 bg-[#58a6ff] hover:bg-[#79b8ff] text-[#0d1117] font-bold rounded text-[12px] transition-colors">Edit PCG Blueprint</button>
               </div>
             </div>
           </>
         );
      case 'ControlRig':
      case 'MetaHuman':
         return (
           <>
             {renderHeader('Character & Rigging (Control Rig)', 'Forward/Inverse Kinematics setup, bone assignments, and facial blendshapes.', <PersonStanding size={28} />)}
             <div className="p-6 flex flex-col gap-4 overflow-y-auto">
               <div className="grid grid-cols-3 gap-4">
                 <div className="bg-[#161b22] border border-[#30363d] rounded p-4 flex flex-col gap-2">
                    <h3 className="text-[#c9d1d9] font-bold text-[13px] border-b border-[#30363d] pb-1">Hierarchy</h3>
                    <div className="text-[11px] font-mono text-[#8b949e] space-y-1">
                      <div><FolderTree size={10} className="inline mr-1"/> root</div>
                      <div className="ml-4"><FolderTree size={10} className="inline mr-1"/> pelvis</div>
                      <div className="ml-8"><FolderTree size={10} className="inline mr-1"/> spine_01</div>
                      <div className="ml-12"><FolderTree size={10} className="inline mr-1"/> spine_02</div>
                      <div className="ml-16 text-[#58a6ff]"><FolderTree size={10} className="inline mr-1"/> neck_01</div>
                      <div className="ml-20"><FolderTree size={10} className="inline mr-1"/> head</div>
                    </div>
                 </div>
                 <div className="col-span-2 bg-[#0d1117] border border-[#30363d] rounded relative flex items-center justify-center overflow-hidden h-[300px]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] to-transparent"></div>
                    <PersonStanding size={150} className="text-[#e3b341] opacity-50 relative z-10" />
                    
                    {/* Mock bones overlay */}
                    <div className="absolute top-[80px] w-4 h-4 rounded-full border-2 border-[#f85149] z-20 shadow-[0_0_10px_2px_rgba(248,81,73,0.5)]"></div>
                    <div className="absolute top-[130px] right-[100px] w-3 h-3 rounded-sm border-2 border-[#58a6ff] z-20"></div>
                 </div>
               </div>
               <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded flex items-center justify-between text-[12px] text-[#8b949e]">
                 <span>Current Solver: <strong className="text-[#c9d1d9]">Full Body IK (FBIK)</strong></span>
                 <button className="bg-[#238636] text-white px-3 py-1 rounded">Bake to Animation</button>
               </div>
             </div>
           </>
         );
      case 'MetaSound':
      case 'Blueprint':
         return (
           <div className="flex items-center justify-center h-full text-[#8b949e] flex-col gap-4">
             <Settings2 size={48} className="opacity-20" />
             <div className="text-[14px]">Advanced Integration for {moduleType}</div>
             <div className="text-[12px] opacity-70">Powered by Local AI Swarm (Full Modules loading...)</div>
           </div>
         );
      default:
         return (
           <div className="flex items-center justify-center h-full text-[#8b949e] flex-col gap-4">
             <Settings2 size={48} className="opacity-20" />
             <div className="text-[14px]">Advanced Integration for {moduleType}</div>
             <div className="text-[12px] opacity-70">Powered by Local AI Swarm</div>
           </div>
         );
    }
  };

  return (
    <div className="w-full h-full bg-[#0d1117] flex flex-col font-['Helvetica_Neue',Arial,sans-serif]">
       {getModuleContent()}
    </div>
  );
}

// simple inline icon
function GridIcon({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="3" y1="15" x2="21" y2="15"></line>
      <line x1="9" y1="3" x2="9" y2="21"></line>
      <line x1="15" y1="3" x2="15" y2="21"></line>
    </svg>
  );
}
