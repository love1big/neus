const fs = require('fs');
let code = fs.readFileSync('src/components/ModulePanel.tsx', 'utf-8');

const defaultIdx = code.indexOf('default:');
if(defaultIdx !== -1) {
  const insertion = `
      // =========================================================
      // Voxel & Destructible Engine (Teardown/Minecraft style)
      // =========================================================
      case 'VoxelEngine':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Voxel & Destruction Engine', 'Volumetric worlds, Marching Cubes, and real-time rigid body destruction.', <Box size={28} />)}
             <div className="flex-1 flex overflow-hidden">
               <div className="w-[300px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 p-4">
                  <h3 className="text-[#c9d1d9] font-bold text-[14px] mb-4">Voxel Chunk Settings</h3>
                  <div className="space-y-4 text-[11px]">
                     <div className="border border-[#30363d] bg-[#0d1117] p-3 rounded">
                        <label className="text-[#8b949e] font-bold block mb-2">Generation Algorithm</label>
                        <select className="w-full bg-[#161b22] border border-[#30363d] text-[#c9d1d9] p-1 rounded outline-none">
                           <option>3D Perlin + Octaves</option>
                           <option>FastNoise Lite</option>
                           <option>Marching Cubes (Smooth)</option>
                           <option>Dual Contouring</option>
                        </select>
                     </div>
                     <div className="border border-[#30363d] bg-[#0d1117] p-3 rounded space-y-2">
                        <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#f85149]"/> Real-time Destruction</label>
                        <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#58a6ff]"/> Asynchronous Chunk Meshing</label>
                        <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" className="accent-[#e3b341]"/> GPU Compute Shaders</label>
                     </div>
                  </div>

                  {/* AI Voxel Sculptor */}
                  <div className="mt-8 bg-[#0d1117] border border-[#f85149]/30 border-l-4 border-l-[#f85149] p-4 rounded shadow-lg">
                    <h3 className="text-[#f85149] font-bold text-[13px] flex items-center gap-2 mb-2"><Bot size={14}/> AI Volumetric Architect</h3>
                    <p className="text-[10px] text-[#8b949e] mb-3">Instruct the offline AI to generate complex volumetric structures or voxel art instantly.</p>
                    <textarea className="w-full bg-[#0a0a0a] border border-[#30363d] rounded p-2 text-[#c9d1d9] text-[11px] h-20 outline-none resize-none mb-2" placeholder="e.g. Generate a massive Gothic cathedral made entirely of 1x1m destructible stone voxels."></textarea>
                    <button className="w-full bg-[#f85149]/10 hover:bg-[#f85149]/20 text-[#f85149] border border-[#f85149]/30 font-bold py-2 rounded text-[11px] flex justify-center items-center gap-2">
                       <Orbit size={14}/> Generate Voxel Blueprint
                    </button>
                 </div>
               </div>

               <div className="flex-1 bg-[#111] relative flex items-center justify-center p-8 overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(#30363d 1px, transparent 1px), linear-gradient(90deg, #30363d 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
                  
                  {/* Fake Voxel Render View */}
                  <div className="relative w-[500px] h-[400px] flex items-center justify-center perspective-[800px]">
                     {/* Floating chunks chunk */}
                     <div className="absolute w-64 h-64 border-2 border-[#58a6ff]/50 bg-[#30363d]/50" style={{ transform: 'rotateX(60deg) rotateZ(45deg)', transformStyle: 'preserve-3d' }}>
                        {/* Voxels */}
                        {[...Array(9)].map((_, i) => (
                           <div key={i} className="absolute w-8 h-8 bg-[#3fb950] border border-[#238636] shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{
                              left: \`\${(i % 3) * 32 + 80}px\`,
                              top: \`\${Math.floor(i / 3) * 32 + 80}px\`,
                              transform: \`translateZ(\${Math.random() * 32}px)\`
                           }}></div>
                        ))}
                     </div>

                     {/* Explosion / Destruction effect */}
                     <div className="absolute w-12 h-12 bg-orange-500 rounded-full blur-[10px] animate-pulse" style={{ transform: 'translateZ(100px) translateX(-50px)' }}></div>
                     {[...Array(12)].map((_, i) => (
                         <div key={'debris'+i} className="absolute w-2 h-2 bg-[#8b949e] border border-[#30363d]" style={{
                           transform: \`translate(\${(Math.random() - 0.5) * 150}px, \${(Math.random() - 0.5) * 150}px) rotate(\${Math.random() * 360}deg)\`
                         }}></div>
                     ))}
                  </div>
               </div>
             </div>
           </div>
         );

      // =========================================================
      // Advanced Vehicle Physics Engine
      // =========================================================
      case 'VehiclePhysics':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Vehicle Dynamics Configurator', 'Tire friction curves (Pacejka), suspension telemetry, aerodynamic drag, and engine torque curves.', <Activity size={28} />)}
             <div className="flex-1 flex overflow-hidden">
               <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
                  
                  <div className="flex gap-6">
                     <div className="w-[400px] bg-[#161b22] border border-[#30363d] rounded p-4 shadow-lg shrink-0">
                        <h3 className="text-[#c9d1d9] font-bold text-[14px] border-b border-[#30363d] pb-2 mb-4">Engine Torque Curve</h3>
                        <div className="h-[200px] w-full bg-[#0d1117] relative border-l border-b border-[#30363d]">
                           {/* Torque Curve SVG Fake */}
                           <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                              <path d="M 0 180 Q 150 20, 200 50 T 400 150" fill="none" stroke="#e3b341" strokeWidth="3" />
                           </svg>
                           <div className="absolute bottom-2 right-2 text-[9px] text-[#8b949e]">RPM</div>
                           <div className="absolute top-2 left-2 text-[9px] text-[#8b949e] tracking-widest" style={{ writingMode: 'vertical-rl' }}>TORQUE (Nm)</div>
                        </div>
                     </div>

                     <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded p-4 shadow-lg flex flex-col gap-4">
                        <h3 className="text-[#c9d1d9] font-bold text-[14px] border-b border-[#30363d] pb-2">Suspension & Tire Model</h3>
                        <div className="grid grid-cols-2 gap-4 text-[11px]">
                           <div>
                              <label className="text-[#8b949e] font-bold block mb-1">Spring Stiffness</label>
                              <input type="range" className="w-full accent-[#58a6ff]" min="0" max="100" defaultValue="45" />
                           </div>
                           <div>
                              <label className="text-[#8b949e] font-bold block mb-1">Damping Compression</label>
                              <input type="range" className="w-full accent-[#58a6ff]" min="0" max="100" defaultValue="70" />
                           </div>
                           <div>
                              <label className="text-[#8b949e] font-bold block mb-1">Pacejka Friction B (Stiffness)</label>
                              <input type="range" className="w-full accent-[#3fb950]" min="0" max="100" defaultValue="80" />
                           </div>
                           <div>
                              <label className="text-[#8b949e] font-bold block mb-1">Pacejka Friction C (Shape)</label>
                              <input type="range" className="w-full accent-[#3fb950]" min="0" max="100" defaultValue="30" />
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Telemetry Viewport */}
                  <div className="w-full h-[300px] bg-[#111] border border-[#30363d] rounded relative flex items-center justify-center overflow-hidden">
                     {/* Fake Car */}
                     <div className="w-[150px] h-[300px] border-4 border-[#30363d] rounded-[30px] flex items-center justify-center relative bg-gradient-to-t from-[#222] to-[#111]">
                        {/* Wheels */}
                        <div className="absolute -left-6 top-8 w-6 h-16 bg-[#f85149] rounded flex items-center justify-center"><div className="w-full h-0.5 bg-black"></div></div>
                        <div className="absolute -right-6 top-8 w-6 h-16 bg-[#f85149] rounded flex items-center justify-center"><div className="w-full h-0.5 bg-black"></div></div>
                        <div className="absolute -left-6 bottom-8 w-6 h-16 bg-[#3fb950] rounded flex items-center justify-center"><div className="w-full h-0.5 bg-black"></div></div>
                        <div className="absolute -right-6 bottom-8 w-6 h-16 bg-[#3fb950] rounded flex items-center justify-center"><div className="w-full h-0.5 bg-black"></div></div>
                        
                        {/* Forces Overlay */}
                        <div className="absolute left-1/2 top-1/2 w-0.5 h-32 bg-[#e3b341] origin-bottom transform translate-y-[-100%] rotate-12">
                           <div className="w-3 h-3 bg-[#e3b341] rounded-full absolute -top-1.5 -left-1"></div>
                        </div>
                        <span className="absolute top-1/2 left-1/2 ml-4 -mt-16 text-[#e3b341] font-mono text-[10px] font-bold">1.2G</span>
                     </div>

                     <div className="absolute right-4 top-4 bg-black/80 px-4 py-2 border border-[#30363d] rounded text-[10px] font-mono font-bold text-[#c9d1d9] space-y-1">
                        <div>Speed: <span className="text-[#3fb950]">142 km/h</span></div>
                        <div>Gear: <span className="text-[#58a6ff]">4th</span></div>
                        <div>Steer: <span className="text-[#e3b341]">-12.4 deg</span></div>
                        <div>Slip_RR: <span className="text-[#f85149]">1.04 !</span></div>
                     </div>
                  </div>

                  {/* Offline AI Vehicle Tuner */}
                   <div className="w-full bg-[#0d1117] border border-[#bc8cff]/30 border-l-4 border-l-[#bc8cff] p-4 flex gap-6 items-center shadow-lg rounded">
                     <div className="flex-1">
                        <h3 className="text-[#bc8cff] font-bold text-[14px] flex items-center gap-2 mb-2"><Bot size={16}/> AI Handling Engineer (Reinforcement Learning)</h3>
                        <p className="text-[11px] text-[#8b949e]">The AI drives your vehicle 10,000 times around a virtual track, tweaking the suspension and downforce until it matches your desired handling profile.</p>
                     </div>
                     <select className="bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] p-2 text-[11px] outline-none">
                        <option>Target: Arcade Drift (Mario Kart style)</option>
                        <option>Target: Simcade (Forza style)</option>
                        <option>Target: Hardcore Sim (Assetto Corsa style)</option>
                     </select>
                     <button className="bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 py-2 px-6 rounded text-[11px] font-bold shadow">
                        Let AI Tune Car (2 mins)
                     </button>
                  </div>

               </div>
             </div>
           </div>
         );

      // =========================================================
      // Machine Learning Training Room (Unity ML-Agents style)
      // =========================================================
      case 'MLAgents':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Machine Learning Training Room', 'Deep Reinforcement Learning (PPO/SAC). Train NPCs to walk, balance, fight, or drive entirely via neural networks.', <BrainCircuit size={28} />)}
             <div className="flex-1 flex overflow-hidden">
               {/* Left Controls */}
               <div className="w-[350px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 p-4 overflow-y-auto">
                  <h3 className="text-[#c9d1d9] font-bold text-[14px] mb-4">RL Hyperparameters</h3>
                  
                  <div className="space-y-3 mb-6 border-b border-[#30363d] pb-6 text-[11px]">
                     <div className="flex justify-between items-center text-[#c9d1d9]"><span>Learning Rate</span><input type="text" className="w-20 bg-[#0a0a0a] border border-[#30363d] p-1 text-right rounded font-mono" defaultValue="3.0e-4"/></div>
                     <div className="flex justify-between items-center text-[#c9d1d9]"><span>Batch Size</span><input type="text" className="w-20 bg-[#0a0a0a] border border-[#30363d] p-1 text-right rounded font-mono" defaultValue="1024"/></div>
                     <div className="flex justify-between items-center text-[#c9d1d9]"><span>Epochs</span><input type="text" className="w-20 bg-[#0a0a0a] border border-[#30363d] p-1 text-right rounded font-mono" defaultValue="3"/></div>
                     <div className="flex justify-between items-center text-[#c9d1d9]"><span>Algorithm</span>
                        <select className="bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] p-1 rounded">
                           <option>PPO (Proximal Policy)</option>
                           <option>SAC (Soft Actor-Critic)</option>
                           <option>DQN</option>
                        </select>
                     </div>
                  </div>

                  <h3 className="text-[#c9d1d9] font-bold text-[14px] mb-4 text-[#e3b341]">Reward Signals</h3>
                  <div className="space-y-2 mb-6">
                     <div className="bg-[#21262d] border border-[#30363d] p-2 rounded flex justify-between items-center">
                        <span className="text-[11px] text-[#3fb950] font-bold">Distance Traveled</span><span className="text-[#8b949e] text-[11px] font-mono">+1.0 / m</span>
                     </div>
                     <div className="bg-[#21262d] border border-[#30363d] p-2 rounded flex justify-between items-center">
                        <span className="text-[11px] text-[#f85149] font-bold">Fall Over</span><span className="text-[#8b949e] text-[11px] font-mono">-100.0</span>
                     </div>
                     <button className="text-[#58a6ff] hover:text-white text-[11px] font-bold flex items-center gap-1">+ Add Reward Logic</button>
                  </div>

                  <button className="w-full bg-[#3fb950] hover:bg-[#2ea043] text-white font-bold py-3 rounded-lg text-[14px] shadow-[0_0_15px_rgba(63,185,80,0.4)] flex justify-center items-center gap-2">
                     <Network size={18}/> START TRAINING LOOP
                  </button>
               </div>

               {/* Right Viewport (Grid of bots) */}
               <div className="flex-1 bg-[#111] relative p-8 flex flex-col">
                  {/* Grid of environments */}
                  <div className="flex-1 grid grid-cols-3 gap-6 relative z-10">
                     {[...Array(6)].map((_,i) => (
                        <div key={i} className="bg-[#161b22] border border-[#30363d] shadow-lg rounded-xl flex items-center justify-center relative overflow-hidden">
                           <div className="absolute bottom-4 w-3/4 h-2 bg-[#30363d] rounded"></div>
                           {/* Ragdoll / Bot mock */}
                           <div className="absolute w-8 h-12 flex flex-col items-center gap-1" style={{ transform: \`rotate(\${(Math.random()-0.5)*40}deg) translateY(\${(Math.random() - 0.5)*20}px)\` }}>
                              <div className="w-4 h-4 bg-[#58a6ff] rounded-full"></div>
                              <div className="w-6 h-8 bg-[#58a6ff] rounded-sm"></div>
                           </div>
                           <div className="absolute top-2 right-2 text-[9px] font-mono text-[#8b949e]">Env_{i}</div>
                           <div className="absolute bottom-2 left-2 text-[9px] font-mono font-bold text-[#e3b341]">Reward: {(Math.random() * 50).toFixed(1)}</div>
                        </div>
                     ))}
                  </div>
                  
                  {/* TensorBoard style graphs */}
                  <div className="h-[200px] w-full mt-6 bg-[#161b22] border border-[#30363d] rounded shadow-lg p-4 flex gap-6 z-10">
                     <div className="flex-1 flex flex-col">
                        <span className="text-[11px] text-[#c9d1d9] font-bold mb-2">Cumulative Reward</span>
                        <div className="flex-1 bg-[#0a0a0a] border-l border-b border-[#30363d] relative">
                           <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                              <path d="M 0 100 Q 100 80, 200 40 T 400 10" fill="none" stroke="#58a6ff" strokeWidth="2" />
                           </svg>
                        </div>
                     </div>
                     <div className="flex-1 flex flex-col">
                        <span className="text-[11px] text-[#c9d1d9] font-bold mb-2">Policy Loss</span>
                        <div className="flex-1 bg-[#0a0a0a] border-l border-b border-[#30363d] relative">
                           <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                              <path d="M 0 10 Q 50 80, 150 90 T 400 95" fill="none" stroke="#f85149" strokeWidth="2" />
                           </svg>
                        </div>
                     </div>
                  </div>
               </div>
             </div>
           </div>
         );

      // =========================================================
      // XR / VR Development Hub (OpenXR)
      // =========================================================
      case 'VRXREngine':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('OpenXR VR/MR Development Hub', 'Foveated rendering, Passthrough config, Hand-tracking simulators, and spatial anchors.', <Glasses size={28} />)}
             <div className="flex-1 flex overflow-hidden">
               <div className="w-[300px] bg-[#161b22] border-r border-[#30363d] flex flex-col p-4">
                  <h3 className="text-[#c9d1d9] font-bold text-[14px] flex items-center gap-2 mb-4"><MonitorPlay size={16}/> Target Hardware</h3>
                  <select className="bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] p-2 text-[12px] rounded outline-none w-full mb-6">
                     <option>Meta Quest 3 (Android OpenXR)</option>
                     <option>Apple Vision Pro (visionOS)</option>
                     <option>PC VR (SteamVR / Oculus PC)</option>
                     <option>PS VR2</option>
                  </select>

                  <h3 className="text-[#c9d1d9] font-bold text-[14px] flex items-center gap-2 mb-4">Rendering Pipeline</h3>
                  <div className="space-y-2 text-[11px] mb-6">
                     <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#bc8cff]"/> Stereo Instancing (Single Pass)</label>
                     <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#bc8cff]"/> Fixed Foveated Rendering</label>
                     <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" className="accent-[#bc8cff]"/> Application SpaceWarp</label>
                  </div>

                  <h3 className="text-[#c9d1d9] font-bold text-[14px] flex items-center gap-2 mb-4">Mixed Reality</h3>
                  <div className="space-y-2 text-[11px]">
                     <label className="flex items-center gap-2 text-[#e3b341]"><input type="checkbox" className="accent-[#e3b341]"/> Enable Passthrough</label>
                     <label className="flex items-center gap-2 text-[#e3b341]"><input type="checkbox" className="accent-[#e3b341]"/> Spatial Anchors</label>
                     <label className="flex items-center gap-2 text-[#e3b341]"><input type="checkbox" className="accent-[#e3b341]"/> Scene Understanding (Plane gen)</label>
                  </div>
               </div>

               <div className="flex-1 bg-[#111] relative flex items-center justify-center border-l border-[#30363d]">
                  
                  {/* VR Simulator View */}
                  <div className="relative w-full h-full flex flex-col p-8">
                     <div className="text-[#8b949e] font-bold text-xl flex items-center gap-3 drop-shadow mb-4"><Eye size={24}/> Binocular Rendering Preview</div>
                     <div className="flex gap-4 h-[300px] w-full justify-center items-center">
                        {/* Left Eye */}
                        <div className="w-[300px] h-[300px] bg-black rounded-full overflow-hidden border-4 border-[#30363d] relative flex items-center justify-center shadow-2xl">
                           <div className="absolute inset-x-0 h-px bg-red-500/30"></div>
                           <div className="absolute inset-y-0 w-px bg-green-500/30"></div>
                           <Box size={100} className="text-[#c9d1d9] transform -translate-x-2"/>
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50" style={{ mixBlendMode: 'multiply' }}></div>
                        </div>
                        {/* Right Eye */}
                        <div className="w-[300px] h-[300px] bg-black rounded-full overflow-hidden border-4 border-[#30363d] relative flex items-center justify-center shadow-2xl">
                           <div className="absolute inset-x-0 h-px bg-red-500/30"></div>
                           <div className="absolute inset-y-0 w-px bg-green-500/30"></div>
                           <Box size={100} className="text-[#c9d1d9] transform translate-x-2"/>
                           <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/50" style={{ mixBlendMode: 'multiply' }}></div>
                        </div>
                     </div>

                     {/* Hand Tracking Simulator UI */}
                     <div className="mt-auto bg-[#161b22] border border-[#30363d] p-6 rounded-lg flex items-center gap-8 shadow-lg">
                        <div className="flex flex-col gap-2 flex-1">
                           <span className="text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2"><Activity size={14} className="text-[#3fb950]"/> Hand Tracking Emulator (Mouse inputs)</span>
                           <span className="text-[10px] text-[#8b949e]">Hold Space + Move Mouse to translate hands. Hold Shift to rotate. Click to pinch.</span>
                        </div>
                        <div className="flex gap-4">
                           <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-[#f85149] animate-pulse"></span>
                              <span className="text-[11px] text-[#f85149] font-bold">Left Hand: Lost</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-[#3fb950]"></span>
                              <span className="text-[11px] text-[#3fb950] font-bold">Right Hand: Tracking</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
             </div>
           </div>
         );

      // =========================================================
      // DevOps & CI/CD Cross-Platform Builder
      // =========================================================
      case 'DevOpsBuilder':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Cross-Platform Matrix & DevOps Config', 'Configure IL2CPP, Shader Compilation, Code Signing, and one-click publish pipelines.', <Terminal size={28} />)}
             <div className="flex-1 flex overflow-hidden">
               <div className="flex-1 flex flex-col p-6 overflow-y-auto w-full custom-scrollbar">
                  
                  <h2 className="text-xl font-bold text-[#c9d1d9] mb-6 flex items-center gap-2"><Server size={20}/> Build Targets & Pipeline</h2>
                  
                  <div className="grid grid-cols-4 gap-4 mb-8">
                     <div className="bg-[#21262d] border border-[#58a6ff] rounded p-4 shadow-lg cursor-pointer hover:bg-[#30363d]">
                        <div className="flex justify-between items-center mb-3">
                           <Activity size={24} className="text-[#58a6ff]"/>
                           <span className="bg-[#3fb950]/20 text-[#3fb950] text-[9px] font-bold px-2 py-0.5 rounded border border-[#3fb950]/30">ACTIVE</span>
                        </div>
                        <h3 className="text-[#c9d1d9] font-bold text-[14px]">Windows 64-bit</h3>
                        <div className="text-[10px] text-[#8b949e] mt-1">DirectX 12 / Vulkan</div>
                     </div>
                     <div className="bg-[#161b22] border border-[#30363d] rounded p-4 shadow cursor-pointer hover:bg-[#21262d]">
                        <div className="flex justify-between items-center mb-3">
                           <Gamepad2 size={24} className="text-[#8b949e]"/>
                        </div>
                        <h3 className="text-[#c9d1d9] font-bold text-[14px]">PlayStation 5</h3>
                        <div className="text-[10px] text-[#8b949e] mt-1">Require DevKit SDK</div>
                     </div>
                     <div className="bg-[#161b22] border border-[#30363d] rounded p-4 shadow cursor-pointer hover:bg-[#21262d]">
                        <div className="flex justify-between items-center mb-3">
                           <BoxSelect size={24} className="text-[#8b949e]"/>
                        </div>
                        <h3 className="text-[#c9d1d9] font-bold text-[14px]">Xbox Series X|S</h3>
                        <div className="text-[10px] text-[#8b949e] mt-1">GDK Installed</div>
                     </div>
                     <div className="bg-[#161b22] border border-[#30363d] rounded p-4 shadow cursor-pointer hover:bg-[#21262d]">
                        <div className="flex justify-between items-center mb-3">
                           <Ghost size={24} className="text-[#8b949e]"/>
                        </div>
                        <h3 className="text-[#c9d1d9] font-bold text-[14px]">Nintendo Switch™</h3>
                        <div className="text-[10px] text-[#f85149] mt-1 font-bold">SDK Missing</div>
                     </div>
                  </div>

                  <div className="flex gap-6">
                     <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded shadow p-6">
                        <h3 className="text-[#c9d1d9] font-bold text-[14px] border-b border-[#30363d] pb-2 mb-4">Windows Build Settings</h3>
                        
                        <div className="grid grid-cols-2 gap-6 text-[12px]">
                           <div>
                              <p className="text-[#8b949e] font-bold mb-2">Scripting Backend</p>
                              <select className="bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] rounded p-2 w-full outline-none">
                                 <option>IL2CPP (AOT Compilation)</option>
                                 <option>Mono (JIT)</option>
                              </select>
                           </div>
                           <div>
                              <p className="text-[#8b949e] font-bold mb-2">C++ Compiler Config</p>
                              <select className="bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] rounded p-2 w-full outline-none">
                                 <option>Release (O3, LTO enabled)</option>
                                 <option>Development</option>
                                 <option>Debug</option>
                              </select>
                           </div>
                        </div>

                        <div className="mt-6 border-t border-[#30363d] pt-4 flex items-center justify-between">
                           <label className="flex items-center gap-2 text-[#c9d1d9] text-[12px]"><input type="checkbox" defaultChecked className="accent-[#3fb950]"/> Compress Pak/Asset Bundles (LZ4HC)</label>
                           <button className="bg-[#3fb950] hover:bg-[#2ea043] text-white font-bold py-2 px-8 rounded shadow text-[14px] flex items-center gap-2"><ArrowUpSquare size={16}/> Build Now</button>
                        </div>
                     </div>

                     <div className="w-[350px] bg-[#0d1117] border border-[#bc8cff]/30 border-l-4 border-l-[#bc8cff] p-4 rounded shadow-lg shrink-0 flex flex-col gap-3">
                        <h3 className="text-[#bc8cff] font-bold text-[13px] flex items-center gap-2 mb-2"><Bot size={14}/> AI Cloud Compiler Agent</h3>
                        <p className="text-[11px] text-[#8b949e]">Why wait 3 hours for shaders to compile? The AI Agent offloads massive C++ compilation and Shader variant caching to our massively scalable cloud GPUs.</p>
                        
                        <div className="bg-[#0a0a0a] border border-[#30363d] p-2 rounded flex justify-between items-center">
                           <div className="text-[10px] text-[#c9d1d9]">Local Build Est.</div>
                           <div className="text-[12px] text-[#f85149] font-mono font-bold">~ 2h 15m</div>
                        </div>
                        <div className="bg-[#21262d] border border-[#bc8cff]/50 p-2 rounded flex justify-between items-center shadow-[0_0_10px_rgba(188,140,255,0.1)]">
                           <div className="text-[10px] text-[#c9d1d9] flex gap-1"><Cloud size={12} className="text-[#bc8cff]"/> AI Cloud Burst Est.</div>
                           <div className="text-[12px] text-[#3fb950] font-mono font-bold">~ 4m 30s</div>
                        </div>

                        <button className="w-full mt-auto bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 py-2 rounded text-[11px] font-bold flex justify-center items-center gap-2">
                           <Zap size={14}/> Initiate AI Turbo Build
                        </button>
                     </div>
                  </div>
               </div>
             </div>
           </div>
         );
  `;
  
  code = code.slice(0, defaultIdx) + insertion + code.slice(defaultIdx);
  fs.writeFileSync('src/components/ModulePanel.tsx', code);
  console.log('Successfully injected ultimate pro modules in ModulePanel.tsx');
} else {
  console.log('Error: default case not found!');
}
