import React, { useState, useEffect } from 'react';
import { Settings2, Globe, Cpu, Server, Volume2, Network, Eye, Wand2, Database, Info, MonitorPlay, Workflow, Layers, CheckCircle2, Zap, Layers3, Move, HardDrive, Map, Gamepad2, Glasses, Sparkles, Bot, ShieldAlert, Bug, Code, Braces, Brush, Aperture, Activity, Binary, Target, Ear, Flame, Fingerprint, BookOpen, Scissors, Cpu as CpuIcon, Microchip, Filter, FunctionSquare, Brain, GitBranch, Terminal, Infinity, Scale, Archive, Link2, MessageSquare, Users, Share2, Gavel, Clock, Palette, Lightbulb, Dna, Waves, Flower2, Ghost, Skull, PenTool, EyeOff} from 'lucide-react';

export default function OptimizationEncyclopedia() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('omni_opt_active_tab') || 'archetypes';
  });

  useEffect(() => {
    localStorage.setItem('omni_opt_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleOpenTab = (e: any) => {
      if (e?.detail && typeof e.detail === 'string') {
        setActiveTab(e.detail);
      }
    };
    window.addEventListener('open-optimization-tab', handleOpenTab);
    return () => window.removeEventListener('open-optimization-tab', handleOpenTab);
  }, []);

  const tabs = [
    { id: 'archetypes', name: 'Game Archetypes', icon: <Gamepad2 size={16}/> },
    { id: 'world', name: 'World & Memory', icon: <Globe size={16}/> },
    { id: 'graphics', name: 'Next-Gen Graphics', icon: <Layers3 size={16}/> },
    { id: 'physics', name: 'Physics & Animation', icon: <Wand2 size={16}/> },
    { id: 'dynamic', name: 'Gameplay Dynamics', icon: <Zap size={16}/> },
    { id: 'vr', name: 'VR / XR Architecture', icon: <Glasses size={16}/> },
    { id: 'audio', name: 'Audio Architecture', icon: <Volume2 size={16}/> },
    { id: 'network', name: 'Netcode & Server', icon: <Network size={16}/> },
    { id: 'offline_ai', name: 'Offline AI Toolchains', icon: <Bot size={16}/> },
    { id: 'visual', name: 'Level Design & Vision', icon: <Eye size={16}/> },
    { id: 'data', name: 'Data & Storage', icon: <HardDrive size={16}/> },
    { id: 'postprocess', name: 'Post-Processing', icon: <MonitorPlay size={16}/> },
    { id: 'advanced', name: 'Advanced AI & ECS', icon: <Database size={16}/> },
    { id: 'backend', name: 'MMO Backend & Cloud', icon: <Server size={16}/> },
  ];

  return (
    <div className="flex h-full bg-[#0a0a0a] text-[#c9d1d9] overflow-hidden rounded-lg border border-[#30363d] animate-in fade-in duration-300">
      
      {/* Sidebar Navigation */}
      <div className="w-64 bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0">
         <div className="p-4 border-b border-[#30363d]">
            <h3 className="text-white font-bold text-[13px] flex items-center gap-2">
               <Layers size={16} className="text-[#a371f7]" />
               Deep Optimization Matrix
            </h3>
            <p className="text-[10px] text-[#8b949e] mt-1">Advanced architectural techniques for maximum engine efficiency.</p>
         </div>
         <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
            {tabs.map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-2.5 flex items-center gap-3 text-[12px] font-medium transition-colors ${activeTab === tab.id ? 'bg-[#a371f7]/10 text-[#a371f7] border-l-2 border-[#a371f7]' : 'text-[#8b949e] hover:bg-[#30363d]/50 hover:text-[#c9d1d9] border-l-2 border-transparent'}`}
               >
                  {tab.icon}
                  {tab.name}
               </button>
            ))}
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#0d1117]">
         <div className="max-w-4xl mx-auto space-y-6">

            {activeTab === 'world' && (
               <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="border-b border-[#30363d] pb-3">
                     <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Globe className="text-[#3fb950]"/> World & Memory Management</h2>
                     <p className="text-[#8b949e] text-[12px] mt-1">Strategies for handling massive open worlds without exceeding RAM limits.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#58a6ff]">World Partitioning / Chunking</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Dividing a massive seamless map into a grid of distinct cells. The engine only loads the chunk the player is currently occupying, plus a 1-chunk radius predicting movement. Distant chunks are aggressively purged from physical memory (RAM).</p>
                     <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d]">
                        <div className="flex items-center gap-2 mb-2">
                           <CheckCircle2 size={14} className="text-[#3fb950]"/>
                           <span className="text-[12px] text-white">Active Grid Configuration</span>
                        </div>
                        <input type="range" className="w-full accent-[#58a6ff]" min="1" max="5" defaultValue="2"/>
                        <div className="flex justify-between text-[10px] text-[#8b949e] mt-1">
                           <span>Aggressive (1 Chunk)</span>
                           <span>Standard (2-3 Chunks)</span>
                           <span>Wide (5 Chunks - High RAM)</span>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#58a6ff]">Asynchronous Level Streaming</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Eradicating loading screens. By employing background worker threads, the engine streams incoming asset data directly from the NVMe SSD into GPU memory asynchronously while the player traverses transition zones (like long tunnels or elevators).</p>
                     <div className="flex gap-4">
                        <label className="flex items-start gap-2 bg-[#0a0a0a] p-3 rounded border border-[#30363d] flex-1">
                           <input type="checkbox" defaultChecked className="accent-[#3fb950] mt-0.5"/>
                           <div>
                              <div className="text-[11px] font-bold text-white">Pre-cache Adjacent Maps</div>
                              <div className="text-[10px] text-[#8b949e]">Utilize reserved RAM to secretly load doors the player is approaching.</div>
                           </div>
                        </label>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#58a6ff]">Imposters / Billboarding Algorithms</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3">Distal dense geometry (like a distant forest) is baked offline into high-resolution 2D texture atlases. At run-time, these 3D objects are replaced by flat 2D quads that constantly rotate to face the camera. They cost virtually zero GPU polygons.</p>
                     <div className="flex items-center justify-between bg-[#0a0a0a] p-3 rounded border border-[#30363d]">
                        <span className="text-[12px] font-medium text-[#c9d1d9]">Billboard Transition Distance</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[11px] text-[#8b949e]">Far</span>
                           <input type="range" className="w-24 accent-[#a371f7]" defaultValue="70"/>
                           <span className="text-[11px] text-[#3fb950]">Aggressive</span>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#58a6ff]">Procedural Generation</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3">Using mathematical noise algorithms (like Perlin or Simplex) to dynamically orchestrate endless terrain, loot tables, or entire solar systems implicitly at runtime. This saves human design labor and dramatically collapses hard-disk installation footprints, as the universe is stored purely as math instead of distinct vertex files.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#58a6ff]">Occlusion & Frustum Culling</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3"><strong>Frustum Culling:</strong> Slicing away any object outside the camera's viewport angle. <strong>Occlusion Culling:</strong> Erasing objects hidden behind other large objects (like a building). If the player can't see it, the GPU never receives the draw call.</p>
                  </div>
               </div>
            )}

            {activeTab === 'graphics' && (
               <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="border-b border-[#30363d] pb-3">
                     <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Layers3 className="text-[#a371f7]"/> Next-Gen Graphics Rendering</h2>
                     <p className="text-[#8b949e] text-[12px] mt-1">Harnessing AI and hardware architecture to push photorealism without melting the GPU.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#a371f7]">Variable Rate Shading (VRS)</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3">Instead of calculating every pixel equally, the GPU allocates maximum processing payload only to the center of the screen or high-contrast edges. Flat areas (like shadows or sky) or fast-moving sections are shaded at 2x2 or 4x4 pixel blocks, saving massive GPU cycles.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#a371f7]">AI Upscaling (DLSS / FSR / XeSS) & Ray Reconstruction</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3"><strong>Upscaling:</strong> Rendering the game internally at 720p or 1080p, then utilizing dedicated Tensor/AI cores to computationally reconstruct the image to 4K resolution. This bypasses rasterization limits and doubles FPS. <strong>Ray Reconstruction:</strong> Using AI to intelligently denoise ray-traced pixels instead of blurry manual filters.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#a371f7]">Mesh Shading</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3">Replaces the decades-old vertex/geometry pipeline. Mesh shaders allow the GPU itself to decide dynamically how many triangles a complex model needs based on distance, without constantly asking the CPU for permission. Allows rendering environments with millions of micro-triangles.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#a371f7]">Skinned Mesh Instancing & Vertex Animation (VAT)</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3"><strong>GPU Instancing:</strong> To render an army of 10,000 soldiers, issuing 10,000 draw calls would instantly crash the CPU. The engine packages the model and 10,000 coordinates into a single dispatch command. <strong>Vertex Animation Textures (VAT):</strong> To animate that massive crowd, calculating skeletal bone physics is skipped. The animation movement is "baked" into a texture file, allowing the GPU to physically push the vertices up and down based purely on pixel colors.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#a371f7]">Character Level of Detail (LOD) & Animation Culling</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3">LOD isn't just for geometry. When a player is standing 200 meters away, the engine stealthily degrades their character model to 500 polygons, un-equips unreadable micro-accessories, and aggressively throttles their animation update cycle (playing at roughly 10fps instead of 60fps) to drastically cut CPU bone-transformation costs.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#a371f7]">Screen Space Reflection (SSR) & Ambient Occlusion (AO)</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3"><strong>SSR:</strong> Calculating water/puddle reflections using only pixel data currently visible on the screen, skipping expensive off-screen raycasts. <strong>AO:</strong> Artificially darkening tight corners and crevices where ambient light struggles to reach, anchoring models into the world so they don't look like they are floating.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#a371f7]">Tessellation</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3">Dynamically subdividing flat geometry into thousands of micro-polygons only as the camera gets close. It physically pushes out the vertices based on a heightmap (displacement map), turning a flat 2D brick wall texture into actual 3D bricks that catch real shadows, without holding those polygons in memory at a distance.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#a371f7]">Anti-Aliasing (TAA / MSAA / FXAA)</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3">Techniques to erase "jaggies" (stair-stepping) on polygon edges. <strong>TAA (Temporal AA):</strong> Uses past frames to smooth the current image (can cause ghosting). <strong>FXAA:</strong> A fast post-process blur. <strong>MSAA:</strong> High-quality hardware multisampling (extremely heavy on performance).</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <div className="flex gap-4">
                        <div className="flex-1">
                           <h3 className="text-white font-bold text-[13px] mb-1 text-[#a371f7]">Baked Lighting</h3>
                           <p className="text-[#8b949e] text-[11px]">Hardcoding light and shadow bounce data directly into textures for static environments.</p>
                        </div>
                        <div className="flex-1">
                           <h3 className="text-white font-bold text-[13px] mb-1 text-[#a371f7]">Mipmapping</h3>
                           <p className="text-[#8b949e] text-[11px]">Pre-generating multiple lower-resolution versions of a texture. When an object is distant, the renderer swaps to the blurry version. This halts GPU cache-misses, stops aliasing glitter artifacts, and saves massive VRAM bandwidth.</p>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'physics' && (
               <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="border-b border-[#30363d] pb-3">
                     <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Wand2 className="text-[#ff7b72]"/> Physics & Interaction Optimization</h2>
                     <p className="text-[#8b949e] text-[12px] mt-1">Reducing CPU bottlenecks caused by rigidbodies and collision detection.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#ff7b72]">Physics Culling & Sleep State</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Physics engines perform costly floating-point math every single tick. To optimize, any object whose velocity falls below a micro-threshold is put to "Sleep" (bypassing the solver loop entirely) until a new kinetic force wakes it. Distant simulated objects are culled outright.</p>
                     <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center justify-between text-[11px] bg-[#0a0a0a] p-2 rounded border border-[#30363d]">
                           <span className="text-[#c9d1d9]">Auto-Sleep Threshold</span>
                           <input type="number" className="w-16 bg-[#161b22] border border-[#58a6ff] rounded text-white text-center" defaultValue="0.01"/>
                        </label>
                        <label className="flex items-center justify-between text-[11px] bg-[#0a0a0a] p-2 rounded border border-[#30363d]">
                           <span className="text-[#c9d1d9]">Distance Culling (m)</span>
                           <input type="number" className="w-16 bg-[#161b22] border border-[#f85149] rounded text-white text-center" defaultValue="150"/>
                        </label>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#ff7b72]">Hitbox Optimization & Primitives</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3">Never use per-polygon (MeshCollider) collision for dynamic physical simulation. We encapsulate complex skeletal meshes inside simplified geometric primitives (Capsules, Spheres, Boxes). Raycasting against a sphere requires 1 mathematical operation; a mesh requires thousands.</p>
                     <div className="p-3 bg-[#ff7b72]/10 border border-[#ff7b72]/20 rounded text-[11px] text-[#ff7b72] flex gap-2 items-start mt-2">
                        <Info size={14} className="shrink-0 mt-0.5"/>
                        <p><strong>Bone-Driven Hitboxes Active:</strong> Player characters are optimized using 14 distinct box/capsule primitives parented to the skeletal rig, eradicating the need for continuous volumetric mesh updates during animations.</p>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#ff7b72]">Ragdoll Physics</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3">Surrendering animation control over to the physics engine the millisecond a character dies. Procedural joints restrict the elbow/knee bending angles so the corpse collapses realistically down stairs or over cliffs, reacting dynamically to the environment instead of playing a flat "death animation."</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#ff7b72]">Vertex Animation & Blend Trees</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3"><strong>Vertex Animation:</strong> Simulating waving flags or flowing water directly on the GPU by offsetting vertex coordinates mathematically via shaders, entirely bypassing the CPU's animation system. <strong>Blend Trees:</strong> Seamlessly mixing math-driven transitional states (like interpolating a walk cycle into a sprint cycle) based on joystick analog pressure, preventing jarring animation snapping.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#ff7b72]">Inverse Kinematics (IK)</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3">Procedurally adjusting bone rotations in real-time so foot placements perfectly align with uneven terrain (like stairs or rocks). Removes the need for hundreds of bespoke "slanted-ground" walking animations, heavily reducing memory.</p>
                  </div>
               </div>
            )}

            {activeTab === 'dynamic' && (
               <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="border-b border-[#30363d] pb-3">
                     <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Zap className="text-[#e3b341]"/> Gameplay Dynamics</h2>
                     <p className="text-[#8b949e] text-[12px] mt-1">Hidden psychological rules that make player controls feel incredibly responsive and fair.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#e3b341]">Coyote Time & Ghost Jumps</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3"><strong>Coyote Time:</strong> If the player walks off a ledge, the game secretly allows them to press 'Jump' for a few milliseconds while hovering in mid-air. <strong>Ghost Jumps:</strong> Invisible collision boxes jutting slightly past the edge of platforms. These forgive human reaction time and eradicate "cheap" deaths.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#e3b341]">Input Buffering</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3">If a player presses 'Dodge' while still stuck in an attack animation, the game "buffers" or memorizes that button press. The exact millisecond the attack ends, the dodge executes automatically. Makes combat feel relentlessly fluid rather than clunky.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#e3b341]">Dynamic Difficulty Adjustment (DDA)</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3">An invisible director AI that modulates enemy health, damage, and drop rates based on the player's performance. If they die 5 times to a boss, the boss might secretly attack 10% slower. Keeps the player directly in the psychological "Flow State".</p>
                  </div>
               </div>
            )}

            {activeTab === 'vr' && (
               <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="border-b border-[#30363d] pb-3 mb-4">
                     <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Glasses className="text-[#a5d6ff]"/> VR / XR Extreme Architecture</h2>
                     <p className="text-[#8b949e] text-[12px] mt-1">Deep-dive into Virtual Reality spatial computing, rendering pipelines, tactile physics, and Offline AI NPC integration for absolute immersion.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[16px] mb-2 flex items-center gap-2 text-[#a5d6ff]">I. Stereoscopic Rendering Optimizations</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Rendering two distinct high-resolution viewports simultaneously at solid 90Hz-120Hz without inducing motion sickness.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Single Pass Instanced Rendering</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Legacy VR rendered the scene twice (Left eye, then Right eye), doubling draw calls. Single Pass Instancing shares culling and shadows, submitting geometry to the GPU once and using instance IDs to separate left/right eye coordinate offsets.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Dynamic Foveated Rendering (Eye-Tracking)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Using headset IR cameras (e.g., PSVR2, Quest Pro) to track the pupil. The GPU renders only the exact 15-degree cone of the user's focal point at Native 4K, while severely degrading the peripheral resolution. Yields +40% GPU performance headroom.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Asynchronous SpaceWarp (ASW) & Motion Smoothing</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">If rendering dips to 45 FPS, the headset automatically extrapolates previous frames and synthesizes a fake intermediate frame using motion vectors. The display still receives 90Hz to prevent nausea, though minor visual artifacts occur.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Hidden Area Mesh Culling</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">VR lenses distort the image (Barrel Distortion) and hide the corners of the screens. The engine applies a physical black UI mesh over those unseen pixels early in the pipeline to prevent the Fragment Shader from rendering pixels no human eye will ever see (Saves ~17% fillrate).</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[16px] mb-2 flex items-center gap-2 text-[#a5d6ff]">II. Tactile VR Physics & Interaction</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Disconnecting the 1:1 real-world wrist tracking from the in-game heavy objects to give a psychological illusion of weight and momentum.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Physics-driven Hands (PID Controllers)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Your real hand swings instantly, but holding a 20kg virtual sledgehammer feels wrong if it moves just as fast. The in-game hand is an invisible <em>Rigidbody</em> that chases your real hand using PID formulas (Spring/Damper math), simulating mass, drag, and collision feedback.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Full-Body VRIK (Inverse Kinematics)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Calculating the position of elbows, spine, and knees securely just by knowing where the Head and Two Hands are. Advanced algorithms (like FinalIK) estimate bone chain rotations to project a biologically accurate full-body avatar without needing foot trackers.</p>
                        </div>
                     </div>
                  </div>

                  {/* Machine Learning / Offline AI in VR */}
                  <div className="bg-[#161b22] border border-[#8957e5] rounded-lg p-5 relative overflow-hidden shadow-[0_0_15px_rgba(137,87,229,0.1)]">
                     <div className="absolute top-0 right-0 bg-[#8957e5] text-[10px] font-bold text-white px-3 py-1 rounded-bl-lg">OFFLINE AI-ENGINES</div>
                     <h3 className="text-white font-bold text-[16px] mb-2 flex items-center gap-2"><Sparkles className="text-[#8957e5] size-4"/> III. Offline AI & Machine Learning Integrations</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Next-generation features utilizing Local LLMs and Neural Networks processed entirely locally (NPU/GPU) for responsive, organic entities without internet dependency.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Local LLMs for NPC Conversations</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Embedding heavily quantized 4-bit AI models (e.g., LLaMA-3-8B / Mistral via llama.cpp or ONNX) directly into the game payload. The headset's microphone uses local Speech-to-Text (Whisper), parses it to the LLM, and triggers an emotional animation response + TTS all within 300ms. True sandbox social VR, entirely offline.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Motion Matching & Neural Animation</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Scrapping traditional animation state machines. Deep Learning models trained on hundreds of hours of mo-cap data intelligently select the perfect frame sequence in real-time based on the NPC's trajectory and uneven terrain, creating indistinguishably life-like movement reacting to your VR presence.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">AI-Driven Inverse Kinematics (Neural IK)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Traditional IK breaks down during extreme contortions. Neural Models predict bodily pose probabilities based on massive datasets, ensuring that when you crouch awkwardly or reach behind your back, your VR avatar's spine and elbows bend naturally just as a real human skeleton would, reducing social VR visual jank.</p>
                        </div>
                     </div>
                  </div>

                  {/* Professional SDKs & Tools */}
                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[16px] mb-2 flex items-center gap-2 text-[#a5d6ff]">IV. Professional VR Toolchains (Industry Standard)</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">The exact SDKs and frameworks utilized by leading studios to bypass writing low-level matrix translations.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 border-l-2 border-l-[#a5d6ff] pl-2">OpenXR / Unity XR Interaction Toolkit (XRIT)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">The absolute standard. "Write once, run everywhere." OpenXR translates commands natively to Meta Quest, Valve Index, and PSVR2 without refactoring code. Features out-of-the-box Locomotion, Snap-turning, and Direct/Ray interactors.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 border-l-2 border-l-[#a5d6ff] pl-2">Hurricane VR / VRTK</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Advanced physics-based interaction frameworks. Provides pre-built weapon handling, 2-handed shotgun pumping, robust climbing mechanics, and inventory slots. Bypasses thousands of hours of rewriting complex physics interaction logic.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 border-l-2 border-l-[#a5d6ff] pl-2">Meta Presence Platform (SDK)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Cutting-edge Mixed Reality tools. Contains <strong>Passthrough API</strong> for blending the real room with game lighting, <strong>Scene Understanding</strong> (AI scans room walls/desks for physical collision), and <strong>Movement SDK</strong> for eye and face tracking.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 border-l-2 border-l-[#a5d6ff] pl-2">RenderDoc & OVR Metrics Tool</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Profiling tools. VR cannot drop below 72/90 FPS or players get physically ill. These tools intercept GPU draw calls frame-by-frame, pinpointing exactly which exact texture or overdraw is costing the precious 11.1ms render budget.</p>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'audio' && (
               <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  <div className="border-b border-[#30363d] pb-3 mb-4">
                     <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Volume2 className="text-[#e3b341]"/> Deep Audio Architecture</h2>
                     <p className="text-[#8b949e] text-[12px] mt-1">Preserving audio thread fidelity, spatial soundscape rendering, and DSP logic to maximize immersive acoustics in both Offline and Online realms.</p>
                  </div>

                  {/* Offline / Local Acoustic Simulation */}
                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[16px] mb-2 flex items-center gap-2 text-[#e3b341]">I. Offline & Local Acoustic Simulation</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Computational techniques executed locally to trick the human brain into perceiving realistic 3D spaces, reflections, and organic variations.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">HRTF & 360° Spatial Panning</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Head-Related Transfer Functions modify soundwave frequencies to mimic how human ears and skull shapes filter sound, providing true Above/Below and Front/Back perception through stereo headphones.</p>
                           <ul className="list-disc list-inside text-[11px] text-[#8b949e] mt-2 space-y-1 ml-1 leading-relaxed">
                              <li><strong>Distance Attenuation:</strong> Applying Logarithmic roll-off curves so sounds decay naturally over distance.</li>
                           </ul>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Ray-Traced Audio & Propagation</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Similar to light, audio rays are cast into the scene. They bounce off metallic surfaces, get absorbed by carpets, and diffract (bend) around pillars. <span className="text-[#e3b341]">Occlusion</span> filters out highs through walls, <span className="text-[#e3b341]">Obstruction</span> wraps sound around corners.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Dynamic Environmental Layers</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Cross-fading ambient layers dynamically. Moving from an open field to a dense forest systematically fades out the "High Wind" layer and fades in the "Leaf Rustle" and "Bird" layers based on player coordinates.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Organic Variance (Pitch/Volume Randomization)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">To prevent the "machine gun" robotic repetition effect, every single footstep or gunshot randomly modulates its Pitch and Volume by <code className="text-[#a5d6ff]">+/- 5%</code>, ensuring no two sounds are perfectly identical.</p>
                        </div>
                     </div>
                  </div>

                  {/* Online Networked Audio */}
                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[16px] mb-2 flex items-center gap-2 text-[#e3b341]">II. Online & Networked Audio Synchronization</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Handling devastating latency spikes and ensuring all connected clients hear the exact same unified battlefield without saturating UDP bandwidth.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">RPC Audio Execution (Bandwidth Saver)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Never send audio over the network. The server merely broadcasts tiny integer packets: <code className="text-[#a5d6ff]">PlaySound(ID: 45, Pos: X,Y,Z)</code>. Each client then plays the local <code className="text-[#a5d6ff]">ak47.wav</code> file from their own hard drive.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Client-Side Sound Intercept (Lag Comp)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">If an enemy shoots with 500ms ping, simply playing the sound when the packet arrives creates extreme auditory desync. The client mathematically reconstructs the event in the past and snaps the audio emission to the locally interpolated position.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Spatial Voice Chat & Opus Codec</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">In-game Team VOIP applies heavy <em>Opus</em> compression for ultra-low latency. Their voice stream is then hooked into a 3D Audio Source attached to the teammate's physical avatar, panning left/right as they run around you.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Network Cull Distance</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">The server strictly filters audio RPCs. If an explosion happens 500 meters away, the server drops the packet for your client completely, saving bandwidth and preventing your CPU from calculating irrelevant audio vectors.</p>
                        </div>
                     </div>
                  </div>

                  {/* Engine Architecture & Mixing Operations */}
                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[16px] mb-2 flex items-center gap-2 text-[#e3b341]">III. Engine Mixing & Performance Limits</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Protecting the CPU from Mixer Buffer Overloads and ensuring critical gameplay cues cut through the chaos.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Audio Master Mixers & Ducking</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Routing sounds into isolated buses (Master, BGM, SFX_Player, SFX_Enemy, Voice). When the Voice bus activates, a compressor "Ducks" (lowers) the SFX and BGM channels by 10dB so teammates can be heard over explosions.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Voice Stealing & Virtual Channels</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Engines cap physical voices (e.g., max 64). If a 65th sound plays, the engine <em>steals</em> the quietest channel. Far-away swarms are relegated to "Virtual Channels", operating purely on silent math until the player gets close enough to warrant decoding.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Pre-Allocated Audio Pooling</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Instead of freezing the game to load a gunshot .wav from the SSD in the middle of combat, 200 gunshot audio sources are pre-loaded into RAM during the loading screen, ready to fire instantly.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Concurrency Limits</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">If 20 players fire the identical AR-15 sound frame-perfectly, the waves multiply and cause digital clipping (distortion). A cap is enforced: "Max 3 instances of sound_ID_X simultaneously", discarding the rest.</p>
                        </div>
                     </div>
                  </div>

                  {/* Professional Middleware & Plugins */}
                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[16px] mb-2 flex items-center gap-2 text-[#e3b341]">IV. Professional Middleware & Plugins</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">The technological infrastructure utilized by AAA studios to implement dynamic, reactive audio logic without altering C++ engine source code.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Industry Standard Middleware (FMOD / Wwise)</span>
                           <p className="text-[#8b949e] text-[11px] mb-2">Decoupling audio design from code. <strong>Wwise (Audiokinetic)</strong> dominates AAA massive open worlds with incredible compression and memory streaming optimizations. <strong>FMOD Studio</strong> empowers Indie teams with intuitive DAW-like node editors to link game parameters (e.g., BossHealth=15%) to music BPM dynamically.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">3D Spatial Plugins</span>
                           <ul className="list-disc list-inside text-[10px] text-[#8b949e] space-y-1.5 ml-1 leading-relaxed">
                              <li><strong>SteamAudio (Valve):</strong> Unrivaled geometrical Sound Propagation. Scans the environments and accurately bounces/diffracts rays through doorways and around pillars.</li>
                              <li><strong>Oculus / Meta Audio SDK:</strong> Flawless HRTF mapping. Injects hyper-accurate Above/Below axis emulation for standard desktop headphones.</li>
                              <li><strong>Dolby Atmos:</strong> Cinematic verticality encoding for Console/PC surround arrays.</li>
                           </ul>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Native Engine Solutions</span>
                           <ul className="list-disc list-inside text-[10px] text-[#8b949e] space-y-1.5 ml-1 leading-relaxed">
                              <li><strong>Unreal MetaSounds:</strong> A node-based DSP synthesizer built directly into UE5. Generates procedural audio mathematically without needing .wav files.</li>
                              <li><strong>Unity Audio Mixer:</strong> A built-in DJ mixing board granting immediate access to Audio Ducking and Reverb Zones for instant soundscape manipulation.</li>
                           </ul>
                        </div>
                     </div>
                  </div>

               </div>
            )}

            {activeTab === 'network' && (
               <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="border-b border-[#30363d] pb-3">
                     <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Network className="text-[#58a6ff]"/> Network & Server (Netcode)</h2>
                     <p className="text-[#8b949e] text-[12px] mt-1">Mitigating latency constraints and server payload saturation.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#58a6ff]">Client-Side Prediction & Server Reconciliation</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3"><strong>Client-Side Prediction:</strong> Faking zero latency by letting the player's local machine execute inputs immediately without waiting for server permission. <strong>Server Reconciliation:</strong> The "reality check". If the server determines the client was wrong (e.g., player got shot while jumping), it silently snaps the local player back to the correct physical location, avoiding horrible rubber-banding where possible by re-simulating dropped inputs.</p>
                     <div className="p-3 bg-[#58a6ff]/10 border border-[#58a6ff]/20 rounded text-[11px] text-[#58a6ff] flex gap-2 items-start">
                        <Info size={14} className="shrink-0 mt-0.5"/>
                        <p>Requires rigid deterministic physics loops (FixedUpdate locking) to ensure the client and server calculate exact identical trajectories.</p>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#58a6ff]">Rollback Netcode & Lag Compensation</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4"><strong>Rollback Netcode (Fighting Games):</strong> The opposite of delay-based netcode. The game predicts what the opponent will do. If wrong, it invisibly rewinds the simulation frame-by-frame, corrects the action, and fast-forwards back to present. <strong>Lag Compensation (Shooters):</strong> Using historical hitboxes to check if a lagging player *actually* aimed at the head on their screen 100ms ago, rewarding the hit retroactively.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <div className="flex gap-4">
                        <div className="flex-1">
                           <h3 className="text-white font-bold text-[13px] mb-1 text-[#58a6ff]">Interpolation (Dead Reckoning)</h3>
                           <p className="text-[#8b949e] text-[11px]">Since server packets only arrive every 50ms, a remote player would look like they are teleporting. The engine smoothly interpolates (blends) the visual coordinate between Packet A and Packet B, making laggy movement appear buttery smooth.</p>
                        </div>
                        <div className="flex-1">
                           <h3 className="text-white font-bold text-[13px] mb-1 text-[#58a6ff]">Low Tick-Rate Simulation</h3>
                           <p className="text-[#8b949e] text-[11px]">MMOs drop their internal server update frequency (Tick Rate) down to 10-20Hz to salvage CPU overhead when 5,000 players are online, relying heavily on client-side Interpolation to mask the slow updates.</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#58a6ff]">Authoritative Servers & Anti-Speedhack Validation</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">The golden rule: <strong>"Never trust the client."</strong> The player's PC is merely a dumb terminal requesting permission to move. If a hacker edits their local memory to walk 50 meters in 1 second, the Authoritative Server mathematically measures the delta-time, rejects the illegal speedhack, and rubber-bands them back to their origin point.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#58a6ff]">MMO Scalability: Layering & Seamless Zoning</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3"><strong>Phasing/Layering:</strong> When 2,000 players flood a starting city, the server physically can't render them. It silently splits them into 20 invisible dimensions (Layers) of 100 players each, overlapping the exact same GPS coordinates. <strong>Seamless Zoning:</strong> Transparently handing over player data from Server Blade A (The Forest) to Server Blade B (The Desert) as they cross an invisible border, avoiding loading screens.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#58a6ff]">Network Interest Management (Relevancy & AOI)</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">The server absolutely cannot broadcast data for 10,000 entities to 100 players every 16ms (Tickrate drop). The architecture restricts payload broadcasting strictly to objects within the local player's "Area of Interest" (AOI) or line-of-sight.</p>
                     
                     <div className="space-y-2 text-[11px]">
                        <label className="flex items-center justify-between bg-[#0a0a0a] p-2 rounded border border-[#30363d]">
                           <span className="text-[#c9d1d9]">Spatial Grid Interest Sync</span>
                           <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-4 h-4"/>
                        </label>
                        <label className="flex items-center justify-between bg-[#0a0a0a] p-2 rounded border border-[#30363d]">
                           <span className="text-[#c9d1d9]">Prioritize Delta-Compression</span>
                           <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-4 h-4"/>
                        </label>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <div className="flex gap-4">
                        <div className="flex-1">
                           <h3 className="text-white font-bold text-[13px] mb-1 text-[#58a6ff]">Reliable UDP (RUDP)</h3>
                           <p className="text-[#8b949e] text-[11px]">Standard TCP is too slow for games because it waits to confirm delivery. RUDP uses ultra-fast UDP for movement, but attaches custom acknowledgement logic only for critical data (like loot drops), maximizing velocity without dropping items.</p>
                        </div>
                        <div className="flex-1">
                           <h3 className="text-white font-bold text-[13px] mb-1 text-[#58a6ff]">Delta Compression</h3>
                           <p className="text-[#8b949e] text-[11px]">Instead of sending an entity's entire physical state (X, Y, Z, Rotation, Health) 60 times a second, the server only transmits the exact variables that mutated since the last tick, collapsing bandwidth requirements by 90%.</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <div className="flex gap-4">
                        <div className="flex-1">
                           <h3 className="text-white font-bold text-[13px] mb-1 text-[#58a6ff]">Protocol Buffers (Binary Serialization)</h3>
                           <p className="text-[#8b949e] text-[11px]">JSON/XML strings are unacceptably bloated for game networking. Engine architecture heavily serializes payloads into microscopic level raw binary bitstreams (Protocol Buffers, FlatBuffers) before transport.</p>
                        </div>
                        <div className="flex-1">
                           <h3 className="text-white font-bold text-[13px] mb-1 text-[#58a6ff]">Packet Throttling</h3>
                           <p className="text-[#8b949e] text-[11px]">Dynamically crushing variable bitrates in chaotic scenarios. If you enter a crowded city, the engine aggressively culls all non-crucial cosmetics and pet metadata packets entirely to preserve bandwidth integrity.</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#58a6ff]">Large-Scale Raid Engine (Tick Scaling & Time Dilation)</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3"><strong>Dynamic Tick Rate Scaling:</strong> During an immense 300v300 Guild War, the server automatically degrades the processing frequency of non-essential loops (like passive HP regen) to hoard CPU payload exclusively for critical damage calculations. <strong>Time Dilation (EVE Online Tech):</strong> When a battle hits 3,000+ localized players and the CPU risks failing, the server universally slows down internal time within that sector (like bullet-time), guaranteeing every single damage calculation completes flawlessly without crashing.</p>
                  </div>
               </div>
            )}

            {activeTab === 'offline_ai' && (
               <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="border-b border-[#30363d] pb-3 mb-4">
                     <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Bot className="text-[#3fb950]"/> Offline AI Toolchains & Engineering</h2>
                     <p className="text-[#8b949e] text-[12px] mt-1">Accelerating the development pipeline by embedding ultra-fast, entirely localized AI tools into the engine to generate code, catch vulnerabilities, and synthesize creative assets offline.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[16px] mb-2 flex items-center gap-2 text-[#3fb950]">I. Local AI Code Generation & Auditing</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Replacing cloud API reliance with local offline LLMs to generate C++, C#, evaluate bugs, and enforce engine-specific memory safety.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Code className="size-3 text-[#3fb950]"/> LLM Co-Pilot (Llama.cpp / TensorRT-LLM)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Running a quantized 8B-14B model (e.g. CodeLlama or DeepSeek-Coder) offline. The model reads the active class file via LSP plugin and pre-calculates complex matrices or writes boilerplate multithreading logic instantaneously (under 20ms latency) without sending IP to external servers.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Bug className="size-3 text-[#ff7b72]"/> Automated Bug Trapper</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">A background task model that recursively scans project commits for "Memory Leaks", "Deadlocks", or "Race Conditions". The moment a developer types <code className="text-[#a5d6ff]">while(true)</code> without thread suspension, the local AI flags the exact line and proposes the semantic correction structurally.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><ShieldAlert className="size-3 text-[#f0883e]"/> Security Vulnerability Scanner</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Crucial for multiplayer endpoints. The local model acts as an Offline White-Hat Hacker, continuously reviewing Netcode architecture (RPC calls) trying to find packet spoofing flaws, unvalidated client vectors, or SQL injection risks before the commit is pushed.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Braces className="size-3 text-[#79c0ff]"/> AST Context & System Auto-Refactor</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Unlike simple autocomplete, offline AI builds a massive local database mapping out the game's entire Abstract Syntax Tree (AST). It can perfectly rename 1,000 interacting variables across 50 files while guaranteeing the compiler states remain flawlessly intact.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Database size={14} className="text-[#bc8cff]"/> Offline Vector DB (RAG) for API Docs</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Storing massive 10,000-page C++ Engine Documentation (Unreal/Unity SDKs) inside a local ChromaDB vector store. The offline LLM queries this exact database before writing code, entirely eliminating the "hallucination" of fake API endpoints.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Move size={14} className="text-[#e3b341]"/> Semantic Scene-Graph Query</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Engineers can query the literal game world using Natural Language. Typing <code className="text-[#a5d6ff]">"Select all trees without collision bounds near the Boss Room"</code> translates instantly into Python editor scripts, selecting the precise GameObjects in the active scene.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Code size={14} className="text-[#ff7b72]"/> AI-Driven HLSL/GLSL Shader Compile</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Writing raw graphics shader math is notoriously difficult. Developers can type <code className="text-[#a5d6ff]">"Water caustic distortion with chromatic aberration"</code>, and the local AI outputs perfectly optimized, mathematically accurate Compute Shader syntax ready for the render pipeline.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Flame size={14} className="text-[#f0883e]"/> Automated Flamegraph &amp; Profiler Analysis</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Dumping 5GB of CPU thread telemetry (e.g. Unreal Insights / RenderDoc) directly into an offline LLM context window. The AI automatically parses the hexadecimal stalls and highlights exactly which obscure C++ pointer dereference is burning 4ms of the rendering frame.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Filter size={14} className="text-[#3fb950]"/> AI-Driven Physics Parameter Tuning</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Tuning vehicle suspension or cloth wind-drag manually takes hours of guessing. A local Genetic AI algorithm runs 500 physics simulations headless, evolving the precise spring-damper variables mathematically until the car drifts "exactly like an Arcade Racer."</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><FunctionSquare size={14} className="text-[#bc8cff]"/> Node-Math to C++ JIT Compiler</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Artists love visual node graphs (like Unreal Blueprints or Shader Graph). An offline AI transpiler ingests this spaghetti node logic and instantly aggressively optimizes it down into raw, pointer-efficient C++ code, stripping visual overhead.</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[16px] mb-2 flex items-center gap-2 text-[#3fb950]">II. 2D / 3D Asset & Animation Pipelines</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Leveraging GPU-powered Stable Diffusion and Neural Models offline to instantly bypass days of tedious pixel manipulation.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Layers size={14} className="text-[#bc8cff]"/> Map Gen & Environment Textures</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Generating seamless PBR materials (Albedo, Normal, Roughness, Metallic) mathematically using localized models. Designing a "Mossy Cobblestone" texture generator offline and directly baking it into Unreal/Unity at 4K resolution dynamically via Editor scripts.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Brush size={14} className="text-[#ff7b72]"/> 2D Sprite & Concept Extrapolator</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Running ComfyUI / Stable Diffusion locally. A dedicated artist sketches a rough stick-figure layout of a character, the offline AI processes it through ControlNet constraints, and spits out a fully shaded, pixel-perfect 2D Boss Sprite Sheet separated by layers.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Wand2 size={14} className="text-[#e3b341]"/> 3D Topology & Auto-Retopology</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Sculpts of monsters reaching 15 million polygons are unusable in real-time. Offline Neural Models automatically map the topological flow and shrink it down into a game-ready 10,000 polygon cage while baking the high-poly details flawlessly into Normal maps.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Move size={14} className="text-[#58a6ff]"/> AI MoCap (Motion Capture Extraction)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Zero need for a $100k MoCap studio suit. Feed offline AI an MP4 video of a person holding a broomstick acting out a spear attack. A local Pose-Estimation model tracks joint axis coordinates and natively retargets it perfectly onto the game's 3D skeleton Rig.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Layers3 size={14} className="text-[#ff7b72]"/> Neural PBR Texture Upscaling (ESRGAN)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Taking old, compressed 256x256 diffuse textures or concept art and running them through local ESRGAN upscale pipelines. Instantly mathematically reconstructing 4K resolutions and synthesizing missing Normal/Displacement mapping metadata offline.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Wand2 size={14} className="text-[#3fb950]"/> Procedural 3D Mesh Generation</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Typing <code className="text-[#a5d6ff]">"Gnarled wooden staff with a glowing blue crystal"</code> generates a base 3D .OBJ file offline within 10 seconds. It's not final AAA quality, but it provides the critical 3D block-out mesh for Artists to immediately start sculpting over, bypassing hours of primitive modeling.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Aperture size={14} className="text-[#bc8cff]"/> Offline NeRF &amp; Gaussian Splatting</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Artists take 50 standard iPhone photos of a real-world rock. A local Neural Radiance Field (NeRF) pipeline trains on the images offline for 10 minutes and bakes it into a flawless 3D game asset with perfect volumetric lighting baked into the cloud points, far surpassing traditional photogrammetry.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Layers size={14} className="text-[#58a6ff]"/> Neural Silhouette-Preserving LODs</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Traditional polygon decimation destroys the outline of the mesh. AI models intelligently strip polygons while mathematically calculating the exact visual silhouette, allowing a 1-million polygon Boss to shrink to 5,000 polygons at a distance without looking any different.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Map size={14} className="text-[#e3b341]"/> AI Heightmap Erosion &amp; Splatting</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Waiting 20 minutes for a fluid simulation to erode a mountain is obsolete. A localized Neural Network predicts realistic hydraulic and thermal erosion on the heightmap instantly, and automatically paints the Splatmap (Grass, Snow, Rock) based on neural slope inference.</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[16px] mb-2 flex items-center gap-2 text-[#3fb950]">III. Offline Audio Synthesis & Acting</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Mathematical sound generation and neural voice acting bypassing hours of Foley recording and studio booth times.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Volume2 size={14} className="text-[#e3b341]"/> Local Text-to-Speech (VITS / XTTS)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Generating thousands of lines of dialogue for ambient town NPCs. The developer feeds the script into an offline XTTS script pipeline. It clones specific emotional voices (Angry, Whispering) and natively maps lip-sync (phoneme) animations to the 3D face mesh simultaneously.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Zap size={14} className="text-[#e3b341]"/> Foley &amp; Sound Effect Synthesis</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Instead of buying sound libraries. The dev types 'Laser Rifle, Heavy Base, Echoing', and the Offline AudioGen model chemically processes the frequencies and formants to yield original 24-bit .WAV sound bites strictly meant for rapid integration.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Ear size={14} className="text-[#79c0ff]"/> AI Acoustic Reverb Baking</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Manually placing audio Reverb Zones in a 100km open-world is brutal. An offline AI tool scans the 3D map topology, identifies "cave", "hallway", and "open field" volumetric bounds, and automatically bakes precise Impulse Responses (IR) for perfect spatial sound bouncing.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Binary size={14} className="text-[#3fb950]"/> Vocal Stem Demixing &amp; Isolation</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Running local Spleeter or Demucs to strip voice acting cleanly from noisy background audio or licensed music tracks. It mathematically phase-inverts the noise floor to isolate raw dialogue stems offline so they can be processed dynamically in-game.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><MonitorPlay size={14} className="text-[#f0883e]"/> Real-Time Neural Lip-Sync (Audio2Face)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Stripping away rigid animation timelines. An offline Audio2Face model listens to the raw generated .WAV file and outputs runtime float curves directly into the 3D character's blendshapes, moving the jaw, tongue, and cheeks perfectly to the audio waveforms.</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[16px] mb-2 flex items-center gap-2 text-[#3fb950]">IV. QA Automation & Systems Testing</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">No longer paying 100 humans to playtest maps endlessly to find softlocks or collision gaps.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Bot size={14} className="text-[#3fb950]"/> 1000x Speed Playtesting (RL Agents)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Training Reinforcement Learning (RL) agents offline on your own machine. Running the engine headless at 50,000 FPS so the AI can literally playtest the map 10 million times overnight. Uncovering impossible jump shortcuts, map exploits, and balancing boss DPS stats mathematically.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Eye size={14} className="text-[#3fb950]"/> Computer Vision Collision Sweeping</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Running a Camera-Bot locally. It patrols the vast Open-World looking at the meshes visually. If the model identifies terrible texture seams or holes in the ground where players could fall through the earth, it pins a coordinate directly into Jira or the engine's Task List.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><CheckCircle2 size={14} className="text-[#e3b341]"/> Automated UI/UX Validation</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">An offline Vision-Language Model acts as a virtual player observing the UI on a simulated 4K screen vs a simulated Mobile screen. It automatically flags text overlap, unreadable contrasts, or UI elements rendering outside the safe-zone boundaries before humans ever see it.</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 relative overflow-hidden shadow-[0_0_15px_rgba(227,179,65,0.05)]">
                     <h3 className="text-white font-bold text-[16px] mb-2 flex items-center gap-2 text-[#e3b341]">V. Deep Player Simulation &amp; Behavioral AI</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Pushing beyond classic 'if-then' State Machines. Training actual Neural Networks offline to deploy into the game as unstoppable runtime adversaries.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Fingerprint size={14} className="text-[#e3b341]"/> Imitation Learning (Behavioral Cloning)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Feeding the offline AI over 10,000 hours of top-tier player packet telemetry (mouse movements, jumping habits). The Neural Network learns the exact human "playstyle". The resulting Bots don't cheat by reading the map; they literally play, peek-shoot, and panic exactly like human esports champions do.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Target size={14} className="text-[#f0883e]"/> Local Deep Q-Networks (DQN) Pathfinding</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Traditional A* NavMeshes fail when bridges collapse or geometry changes dynamically. Using offline trained DQNs, NPCs don't rely on pre-baked paths. They mathematically evaluate real-time pixel depth and spatial arrays to parkour over debris or flank the player using fluid, unscripted pathing.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><BookOpen size={14} className="text-[#bc8cff]"/> Offline Dynamic Narrative &amp; Lore Weaving</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Traditional games use strict conversation trees. A small local 8B LLM creates the illusion of infinite dialogue by weaving dynamically generated dialogue based on current World State constraints, previous actions, and the NPC's strict psychological profile tags.</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[16px] mb-2 flex items-center gap-2 text-[#3fb950]">VI. Local AI Orchestration &amp; Hardware Frameworks</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">The technological backbone required to run these massive AI operations natively inside Game Engines without melting the GPU.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Cpu size={14} className="text-[#58a6ff]"/> Llama.cpp &amp; GGML / GGUF</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">A 70B parameter model requires ~140GB of VRAM in uncompressed fp16. GGUF format mathematically quantizes weights down to 4-bit precision, allowing colossal AI logic to squeeze entirely onto a single 24GB RTX 4090 or run blazing fast purely on Mac Apple Silicon Unified Memory.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Workflow size={14} className="text-[#58a6ff]"/> NVIDIA TensorRT-LLM</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">NVIDIA's proprietary compiler. By converting an ONNX model into an optimized TensorRT engine, inference speeds skyrocket by 400%. This is critical for achieving the strict &lt;20ms latency required when asking a Local Boss NPC a conversational question in VR.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Settings2 size={14} className="text-[#58a6ff]"/> ONNX Runtime (DirectML)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">The open standard for machine learning. Allows developers to export a PyTorch model into an .ONNX file and run it natively within Unity or Unreal Engine using the player's local AMD or Nvidia GPU, bypassing the need for Python installations.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Activity size={14} className="text-[#bc8cff]"/> NPU (Neural Processing Unit) Offloading</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Modern CPUs contain dedicated Neural hardware. The game engine intentionally reroutes all background AI logic (like the Combat Director) strictly to the NPU. This keeps the GPU and CPU 100% liberated purely for rendering graphics and physics, avoiding framerate stutters.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Binary size={14} className="text-[#f0883e]"/> DirectCompute / Vulkan Compute</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">To skip the colossal latency of moving data back and forth between the CPU (RAM) and GPU (VRAM), AI inference is executed directly inside the GPU Render Pipeline using Vulkan Compute Shaders. The AI outputs data securely within the same VRAM sector that rendering needs it.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Server size={14} className="text-[#58a6ff]"/> LM Studio / Ollama Local Server</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Spinning up a localized fake-OpenAI server strictly on <code className="text-[#a5d6ff]">localhost:11434</code>. The engine editor makes standard HTTP REST API calls to this local port, but zero bytes ever leave the router. Total corporate IP security while wielding AI.</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 relative overflow-hidden shadow-[0_0_15px_rgba(88,166,255,0.05)] mt-6">
                     <h3 className="text-white font-bold text-[16px] mb-2 flex items-center gap-2 text-[#58a6ff]">VII. Local AI Acceleration &amp; Engine Squeezing</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">How engineers force these ultra-heavy Neural Networks to run at 60 FPS on low-end consumer hardware without causing thermal throttling.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Scissors size={14} className="text-[#ff7b72]"/> Knowledge Distillation (Teacher-Student)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Training a massive 500-Billion parameter cloud model (The Teacher) to perfect combat logic. Then, developers construct a tiny 1-Billion parameter offline model (The Student) entirely trained on the Teacher's outputs. It retains 95% of the intelligence but runs on roughly 2GB of RAM.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Layers3 size={14} className="text-[#a5d6ff]"/> LoRA (Low-Rank Adaptation) Hot-Swapping</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Instead of duplicating a 10GB Base LLM for every single NPC. Developers load the Base AI into RAM once, and when addressing a Bar Keep, they instantly hot-swap a tiny 25MB 'LoRA' weight file into the model, mutating the AI's entire personality and knowledge strictly into 'Cyberpunk Bartender' mode dynamically.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Zap size={14} className="text-[#e3b341]"/> Speculative Decoding (Draft Models)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">A tiny, extremely fast draft model guesses the next 5 words of dialogue instantly. The heavier main logic model then quickly evaluates those 5 words in parallel. If correct, all 5 words are approved at the speed of 1, effectively tripling generation speed on weak CPUs.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Target size={14} className="text-[#3fb950]"/> Structural Pruning &amp; Sparsity</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">If an AI model trained generically knows French language syntax, but the game is only in English, Structural Pruning practically deletes those neural pathways from the mathematical matrices. This creates mathematical <em>Sparsity</em>, skipping entire layers of computation yielding massive speedups.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><CpuIcon size={14} className="text-[#bc8cff]"/> Dynamic KV Cache (PagedAttention)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">During long generated dialogues, the AI's memory (KV Cache) fragments and overloads PC RAM. PagedAttention acts like an OS Virtual Memory manager, dividing the AI's conversation memory into small non-contiguous memory blocks, completely eliminating Out-Of-Memory crashes on lower-end cards.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Microchip size={14} className="text-[#f0883e]"/> FlashAttention-2 &amp; Fused Kernels</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">The bottleneck of AI isn't math, it's Moving Data from GPU VRAM to the GPU L1 Cache limit. FlashAttention fuses the calculation directly inside the ultra-fast SRAM cache, avoiding the slow read/write trip to main VRAM entirely, leading to massive AI framerate unblocking.</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 relative overflow-hidden shadow-[0_0_15px_rgba(255,123,114,0.05)] mt-6">
                     <h3 className="text-white font-bold text-[16px] mb-2 flex items-center gap-2 text-[#ff7b72]">VIII. Offline Multi-Agent Development Swarms</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Moving past 'copilots' to fully autonomous local AI agent groups that argue, test, and write the game for you.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Brain size={14} className="text-[#ff7b72]"/> Agentic Design Committees (AutoGen)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Spinning up 4 distinct LLMs locally: a 'Technical Director', 'Lead Writer', 'Balancer', and 'Critic'. You give them a prompt ("Design a water temple"). They debate each other mathematically in the background and output a flawless 30-page JSON blueprint detailing puzzles, enemy stats, and lore, having self-corrected logical flaws autonomously.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><GitBranch size={14} className="text-[#a5d6ff]"/> Autonomous CI/CD Repo Agents</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">An offline Background Agent watches the local Git repository. Every time you save a C++ file, it runs the headless game client. If the game crashes, the agent reads the call stack, hallucinates a patch, recompiles, verifies the fix, and automatically commits the hotfix to your branch while you are getting coffee.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Terminal size={14} className="text-[#3fb950]"/> Self-Reflective Terminal Loop</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Standard AI stops after outputting code. Agentic AI loops. It writes a Python editor tool to procedurally place trees. Then it executes the tool. It reads the Unity console for errors. It fixes its own Python script. It repeats this 50 times until the trees are placed flawlessly, completely bypassing human intervention.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Link2 size={14} className="text-[#e3b341]"/> Deep RAG Lore Bibles &amp; State Chaining</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">For massive RPGs, thousands of game variables (IsKingDead, HasSword) interact. The AI stores the entire game state in an offline Vector Database. When generating a side-quest script locally, it retrieves only the relevant state metadata to ensure NPCs don't reference events mathematically impossible in the player's timeline.</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 relative overflow-hidden shadow-[0_0_15px_rgba(188,140,255,0.05)] mt-6">
                     <h3 className="text-white font-bold text-[16px] mb-2 flex items-center gap-2 text-[#bc8cff]">IX. Deep Engine Integration &amp; Mathematical Compression</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">The extreme math used to fit 100-Gigabyte Neural Networks into 2-Gigabyte consumer graphics cards for real-time play without cloud latency.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Infinity size={14} className="text-[#bc8cff]"/> RoPE (Rotary Position Embedding) Scaling</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">A model trained to remember 4,000 words cannot suddenly read a 100,000-word game script (Context Window limits). Engineers mathematically extrapolate the RoPE frequencies, stretching the model's spatial attention grid. This allows offline AI to process the entire encyclopedia of your game's code context securely.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Scale size={14} className="text-[#3fb950]"/> 1.58-Bit Weights (BitNet Math)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Pushing past 4-bit INT4 quantization. Modern architectures constrain Neural Network weights to strictly (-1, 0, 1). This entirely eliminates floating point multiplication (FP16) from the GPU, forcing the hardware to use solely Addition. Generating AI dialogue becomes practically free on any decade-old CPU.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Archive size={14} className="text-[#f0883e]"/> KV Cache Quantization (KVC)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">As an NPC speaks for multiple hours, its memory (KV array) scales to fill 100% of RAM. KVC aggressively quantizes this specific runtime memory block from 16-bit to 4-bit, dropping the RAM usage of an infinitely interacting virtual companion down to megabytes without inducing amnesia.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Layers3 size={14} className="text-[#e3b341]"/> Continuous Batching (vLLM Architecture)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">If 50 NPCs in a virtual town are generating dialogue simultaneously, traditional AI queues them sequentially (causing 50x lag). Continuous Batching pauses and resumes requests per-token at the millisecond level, saturating the GPU matrix completely. 50 NPCs generating is as fast as 1 NPC.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Brain size={14} className="text-[#ff7b72]"/> Semantic Caching / KV Proxying</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">If player A asks a shopkeeper "What's for sale?" and Player B asks "What do you sell?", predicting the AI response takes 1,000ms. A Semantic Cache vector-matches the intent mathematically and instantly injects the previously generated response in 2ms, bypassing the Neural inference completely.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Code size={14} className="text-[#58a6ff]"/> AI-Driven Data Oriented Design (DOP) Refactor</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Object Oriented Programming (OOP) causes CPU cache misses. Developers task a local AI agent to trace the memory allocations and rewrite massive Arrays of Structures (AoS) into Structures of Arrays (SoA) mathematically. This creates perfect contiguous CPU pipeline cache-hits, granting 500% raw framerate spikes off the exact same calculations.</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 relative overflow-hidden shadow-[0_0_15px_rgba(240,136,62,0.05)] mt-6">
                     <h3 className="text-white font-bold text-[16px] mb-2 flex items-center gap-2 text-[#f0883e]">X. Intra-Agent Collaboration & Task Assignment Protocols</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">How offline AI swarms communicate, debate, assign roles mathematically, and divide complex game development tasks purely among themselves.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Users size={14} className="text-[#f0883e]"/> Role-Based System Prompts (RBSP)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">When a task begins, a 'Manager' AI spins up smaller local instances and enforces rigid System Prompts. One instance is strictly told "You are the QA Tester. You must find flaws." Another is "You are the C++ Optimization Lead." This creates isolated, highly specialized cognitive boundaries avoiding generic 'average' answers.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><MessageSquare size={14} className="text-[#58a6ff]"/> Deterministic Debate Parsing & Voting</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">When writing difficult Netcode, the 'Dev' AI suggests an architecture. The 'QA' AI immediately critiques it for packet loss vulnerabilities. They iterate locally via background JSON message-passing. A third 'Judge' AI evaluates both arguments logically and enforces the final mathematically optimal solution before any code is ever compiled.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Share2 size={14} className="text-[#3fb950]"/> Abstract Task Decomposition Trees (ATDT)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">A human types: "Make a working inventory system." The Manager AI breaks this atomic prompt into a JSON tree: `[Data Schema, UI Layout, Save/Load, Input Bindings]`. It assigns `Data Schema` to the Backend AI and `UI` to the Frontend AI. They work in parallel, merging their context arrays only when endpoints are mapped.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Clock size={14} className="text-[#e3b341]"/> Synchronous Dependency Blocking</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">A swarm operates asynchronously but respects engine constraints. The 'Art' AI won't generate the JSON layout for an ammo counter until the 'Logic' AI has solidified the C++ struct for `WeaponData`. The agents utilize a local Redis or SQLite memory bus to await pinged state changes before executing dependent sub-tasks.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Gavel size={14} className="text-[#ff7b72]"/> Compiler-Enforced Truth (Self-Correction)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Internal debates end instantly when the 'DevOps' AI attempts a background headless compile. If MSVC or Clang throws an error, the 'DevOps' AI immediately routes the exact hex error code and line number back to the original 'Dev' AI, forcing an immediate semantic rewrite without human hand-holding.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Workflow size={14} className="text-[#bc8cff]"/> Memory & Context Hand-offs</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Instead of sending 50,000 lines of code to every AI agent (which would melt VRAM), the 'Manager' AI passes strictly compressed localized context. The 'Sound' AI only receives knowledge about `AudioSource` nodes and surface tags, completely blind to the rest of the game's network logic, keeping inference lightning fast.</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 relative overflow-hidden shadow-[0_0_15px_rgba(255,123,255,0.05)] mt-6">
                     <h3 className="text-white font-bold text-[16px] mb-2 flex items-center gap-2 text-[#ff7bff]">XI. Thematic Hyper-Creativity & Focused Neural Imagination</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Unleashing maximum extreme creativity and limitless imagination, but strictly concentrating 100% of that power into the exact themes, moods, and boundaries set by the human developer.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Ghost size={14} className="text-[#ff7bff]"/> Laser-Guided Imagination (Thematic Amplification)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">If the human director sets the genre to 'Psychological Horror', the AI is given absolute maximum creative freedom but computationally locked inside that specific genre. It won't accidentally drift into sci-fi or comedy; instead, it pours all its extreme imagination solely into inventing the most terrifying, deeply unsettling mechanics and lore possible within the horror constraints.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Dna size={14} className="text-[#a5d6ff]"/> Subconscious World-Building (Fractal Drilling)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">You tell the AI: "This city is obsessed with mirrors." The offline swarm drills this singular concept down to the atomic level. It dynamically writes shader codes where rain puddles reflect the player's past mistakes instead of the sky, invents a religious cult where blinking is a sin, and generates C++ logic where enemies shatter into glass shards that permanently distort the player's screen space.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Flower2 size={14} className="text-[#3fb950]"/> Metaphorical Mechanic Orchestration</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">If the game’s core theme is 'Grief', the AI doesn't just change the sky color. It invents profound mechanical metaphors. It rewrites the audio engine so that every time the player fails, the ambient music permanently loses one instrument track, mathematically symbolizing loss, until the final boss is fought in deafening, oppressive silence.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Palette size={14} className="text-[#e3b341]"/> Architectural Synesthesia (Mood-to-Geometry)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Translating abstract human emotions into literal non-Euclidean map architecture. If the human anchor is 'Paranoia', the offline agent generates labyrinthine corridors that subtly expand in width when the player looks at them, and physically shrink when the player looks away, creating a mathematically perfect sensation of being trapped and watched.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Waves size={14} className="text-[#ff7b72]"/> Lore-Binding Systemic Feedback Loops</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">The human writes a law: "The world is powered by memories." The AI accepts this absolute law and hallucinates an entire ecosystem around it. It designs a local memory economy, coding weapons that inflict 'amnesia' instead of HP damage, and procedurally degrades NPC 3D models dynamically as their 'memory currency' is spent throughout the playthrough.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Lightbulb size={14} className="text-[#bc8cff]"/> Micro-Mechanic Thematic Resonance</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">The human demands the game feel 'Oppressive'. Taking this directive, the AI doesn't just add fog. It invents a micro-mechanic where the UI Health Bar itself physically gets 'heavier', applying a fractional drag modifier to the player's mouse/joystick look speed depending on how close they are to death, amplifying the theme directly into the physical peripheral controls.</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 relative overflow-hidden shadow-[0_0_15px_rgba(255,140,114,0.05)] mt-6">
                     <h3 className="text-white font-bold text-[16px] mb-2 flex items-center gap-2 text-[#ff8c72]">XII. Deep Lore Synthesis & Boundary-Bound Narrative Hallucination</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Leveraging isolated local LLMs to author hyper-detailed, psychologically devastating game narratives and system mechanics, rigorously tethered to the dimensional rules set by the human developer (e.g. strict FPS Horror constraints).</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><PenTool size={14} className="text-[#ff8c72]"/> Confined Narrative Extrapolation</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Constrained solely to an 'FPS Horror' concept, the offline AI refuses to produce a generic ghost story. Instead, it hallucinates a dense, terrifying mythos—such as a Soviet auditory-weaponization lab—producing 50 pages of chilling employee logs, autopsy reports, and environmental storytelling cues, all tailored specifically around forcing the player to stare into dark corridors.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Skull size={14} className="text-[#a5d6ff]"/> Paranoia Engine (Biometric Mechanization)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">The offline agent imagines systems to amplify its story. It invents a 'Sanity Microphone' mechanic, writing a C++ script that listens to the player’s actual microphone. If it detects heavy breathing or a sudden gasp, it mathematically links the player’s real-world fear to the AI antagonist's aggression array, completely shattering the boundary between the lore and the room the player sits in.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><EyeOff size={14} className="text-[#3fb950]"/> Fractal Environmental Terror</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Moving past dialogue, the AI hallucinates geometric instructions for horror. It tells the engine's level generator: 'Place a scratched mirror here. When the player turns exactly 90-degrees away, keep the reflection staring forward for exactly 0.4 seconds.' It layers hundreds of these micro-interactions to create suffocating, paranoid environmental storytelling.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Ghost size={14} className="text-[#e3b341]"/> Semantic Weaponization Lore</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">In an FPS, guns are standard. Driven by the horror constraint, the offline AI hallucinates bizarre mechanical inversions. It suggests a 'Bone-Conduction Shotgun' that uses recorded human screams as ammo. To reload, the player must stand perfectly still in the dark to 'record' the ambient crying of ghosts, forcing extreme systemic vulnerability as part of the core gameplay loop.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Infinity size={14} className="text-[#ff7b72]"/> Dynamic Trauma Variable Injection</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">The narrative agent spins up a background 'Trauma Graph'. By analyzing erratic mouse jerks, it learns exactly what frightens the individual playing—is it sudden noises? total darkness? whispering? The Offline AI then dynamically rewrites upcoming lore documents, hallucinatory visions, and enemy logic to relentlessly exploit that specific psychological weakness in real-time.</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><ShieldAlert size={14} className="text-[#bc8cff]"/> Unreliable Narrative Rendering (UNR)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">The AI authors a mechanic where the game's code itself gaslights the player. It writes a background logic loop so that turning left four times in a corridor seamlessly unloads the immediate map data. Player UI elements, like the ammo counter, subtlety mutate into countdown timers for jump scares. The engine's source code is weaponized to serve the horror narrative.</p>
                        </div>
                     </div>
                  </div>

               </div>
            )}

            {activeTab === 'visual' && (
               <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="border-b border-[#30363d] pb-3">
                     <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Eye className="text-[#bc8cff]"/> Visual Deception Tricks</h2>
                     <p className="text-[#8b949e] text-[12px] mt-1">Illusions and smoke-and-mirrors that replace astronomically expensive calculations.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#bc8cff]">Skybox & Skydomes</h3>
                     <p className="text-[#8b949e] text-[12px] mb-2">Simulating galaxies or sprawling mountain ranges as 3D terrain costs millions of vertices. A Skybox wraps a pre-rendered 360-degree high-dynamic-range panoramic texture (HDRI) onto a massive cube or sphere enclosing the map. Since it moves relative to the camera, it appears infinitely far away.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#bc8cff]">Forced Perspective</h3>
                     <p className="text-[#8b949e] text-[12px] mb-2">A cinematic technique. Rendering a massive sci-fi dreadnought taking up the sky might exceed frustum bounds. Instead, engineers render a tiny, highly-detailed dreadnought model extremely close to the camera, stripped of depth-buffer checks, to forge the illusion of colossal scale.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#bc8cff]">Hidden Loading Screens</h3>
                     <p className="text-[#8b949e] text-[12px] mb-2">Masking physical I/O disk bottlenecks through game design. When a user forces a character to squeeze through a claustrophobic rock crevice, ride a long elevator, or open a heavy vault door, the CPU is buying precious seconds to quietly dump old memory and spin up new textures in the background.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#bc8cff]">Level Design: Weaving Paths</h3>
                     <p className="text-[#8b949e] text-[12px] mb-2">Architecting winding hallways or frequent right-angle turns blocks the player's line of sight early. This ensures the <strong>Occlusion Culler</strong> instantly destroys geometry directly behind the wall, saving rendering power in dense cities or dungeons.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#bc8cff]">Rubber Banding (Racing / AI)</h3>
                     <p className="text-[#8b949e] text-[12px] mb-2">An illusion logic where AI opponents secretly accelerate if they fall too far behind, or decelerate if they pull too far ahead. Ensures the player always has an on-screen rival and maximum dramatic tension without heavy simulation costs elsewhere.</p>
                  </div>
               </div>
            )}

            {activeTab === 'data' && (
               <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="border-b border-[#30363d] pb-3">
                     <h2 className="text-2xl font-bold text-white flex items-center gap-2"><HardDrive className="text-[#d2a8ff]"/> Data & Storage Tech</h2>
                     <p className="text-[#8b949e] text-[12px] mt-1">Shrinking install footprints and maximizing SSD read velocities.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#d2a8ff]">Asset Deduplication</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3">In the HDD era, developers copied the exact same prop (like a street lamp) 500 times across a drive cluster so the slow spinning disk head could read it sequentially. With modern NVMe SSDs, asset deduplication stores exactly 1 file for that lamp, vastly reducing the 100GB+ file size to a fraction without penalty.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#d2a8ff]">Oodle / Kraken Compression</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3">Hardware-accelerated mathematical compression algorithms directly baked into console and PC I/O controllers. They halve the size of 4K textures on-disk and decompress them directly into VRAM on the fly, entirely skipping the CPU decompression bottleneck.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#d2a8ff]">Eventual Consistency (In-Memory DB)</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3">Hard-writing player inventory data directly to a physical SQL database every time they pick up a coin would instantly crash an MMO server. Instead, servers write to blazing-fast In-Memory databases (RAM), then quietly batch-sync that data to the permanent hard-drive database every few minutes or upon logical logout events.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <div className="flex gap-4">
                        <div className="flex-1">
                           <h3 className="text-white font-bold text-[13px] mb-1 text-[#d2a8ff]">Distributed DB & Sharding</h3>
                           <p className="text-[#8b949e] text-[11px]">Decoupling the game world from the player inventory database. The database itself is horizontally sharded (e.g., Player IDs 1-10,000 on DB cluster A, 10,001+ on DB cluster B) to prevent horrific Database Locks during peak trading hours.</p>
                        </div>
                        <div className="flex-1">
                           <h3 className="text-white font-bold text-[13px] mb-1 text-[#d2a8ff]">Two-Phase Commit (2PC) & DLQ</h3>
                           <p className="text-[#8b949e] text-[11px]">When players trade, 2PC locks both inventories, verifies validity, and synchronously commits both. If one drops, the transaction rolls back, preventing item duplication. Dead-Letter Queues (DLQ) act as a safety net, securely holding corrupted loot drops so devs can restore lost items later.</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <div className="flex gap-4">
                        <div className="flex-1">
                           <h3 className="text-white font-bold text-[13px] mb-1 text-[#d2a8ff]">Texture Streaming</h3>
                           <p className="text-[#8b949e] text-[11px]">Gradually loading map data and textures only into areas you're walking towards, silently dropping what is behind you.</p>
                        </div>
                        <div className="flex-1">
                           <h3 className="text-white font-bold text-[13px] mb-1 text-[#d2a8ff]">Texture Compression (BC/ASTC)</h3>
                           <p className="text-[#8b949e] text-[11px]">Crunching 3D surface materials natively for GPUs so they occupy vastly less VRAM while retaining quality.</p>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'postprocess' && (
               <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="border-b border-[#30363d] pb-3">
                     <h2 className="text-2xl font-bold text-white flex items-center gap-2"><MonitorPlay className="text-[#f85149]"/> Post-Processing Effects</h2>
                     <p className="text-[#8b949e] text-[12px] mt-1">Applying aesthetic filters atop the final rendered frame to mask graphical imperfections.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-bold text-[15px] text-[#f85149]">Depth of Field (DOF)</h3>
                        <input type="checkbox" defaultChecked className="accent-[#f85149] w-4 h-4"/>
                     </div>
                     <p className="text-[#8b949e] text-[12px]">Simulates physical camera aperture limits. Blurs the background violently. This isn't just cinematic—it actively allows the engine to utilize aggressive low-resolution LODs in the blurred background without the player noticing the ugly geometry.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-bold text-[15px] text-[#f85149]">Motion Blur (Camera & Per-Object)</h3>
                        <input type="checkbox" defaultChecked className="accent-[#f85149] w-4 h-4"/>
                     </div>
                     <p className="text-[#8b949e] text-[12px] mb-3">Accumulates screen-space pixel velocity vectors. By horizontally blurring the frame during fast camera pans, players are visually tricked into perceiving ultra-fluid motion, heavily masking horrific frametime spikes or 30 FPS console locks.</p>
                     <div className="bg-[#0a0a0a] p-3 rounded border border-[#30363d]">
                        <span className="text-[11px] font-bold text-white mb-2 block">Shutter Angle (Intensity)</span>
                        <input type="range" className="w-full accent-[#f85149]" min="0" max="360" defaultValue="180"/>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-bold text-[15px] text-[#f85149]">Vignette & Chromatic Aberration</h3>
                        <input type="checkbox" defaultChecked className="accent-[#f85149] w-4 h-4"/>
                     </div>
                     <p className="text-[#8b949e] text-[12px]">Darkening the screen borders (Vignette) and scattering color channels at the edges (Chromatic Aberration). This directs the player's eye directly to the center reticle, artificially lowering focus on the low-quality assets residing at the periphery of their screen.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-bold text-[15px] text-[#f85149]">Bloom & Color Grading (LUT)</h3>
                        <input type="checkbox" defaultChecked className="accent-[#f85149] w-4 h-4"/>
                     </div>
                     <p className="text-[#8b949e] text-[12px]"><strong>Bloom:</strong> Bleeding light outwards from bright pixels to mimic a physical camera lens reacting to overwhelming luminance. <strong>Color Grading:</strong> Remapping the entire screen's colors via a Look-Up Table (LUT) to instantly apply a cinematic tint (gritty horror green vs vibrant fantasy saturation) costing less than 1ms.</p>
                  </div>
               </div>
            )}

            {activeTab === 'advanced' && (
               <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="border-b border-[#30363d] pb-3">
                     <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Database className="text-[#3fb950]"/> Advanced Data Management</h2>
                     <p className="text-[#8b949e] text-[12px] mt-1">Re-architecting software patterns to accommodate modern CPU cache hierarchies.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#3fb950]">Object Pooling Strategy</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Creating and destroying Memory instances (Instantiate/Destroy) mid-game causes critical Garbage Collection (GC) pauses and frame drops (Lag Spikes). Object Pooling provisions a massive hidden array of objects (like 500 bullets) during the loading screen. When a gun fires, it merely teleports an invisible bullet from the pool, makes it visible, and resets it when done. Zero memory allocation.</p>
                     <div className="flex gap-4 p-4 bg-[#0a0a0a] border border-[#30363d] rounded-lg font-mono text-[11px] text-[#58a6ff]">
                        <div className="flex-1 text-center border-r border-[#30363d]">
                           <div className="text-[#8b949e] mb-1">Heap Allocations</div>
                           <div className="text-[14px] font-bold text-[#3fb950]">0 Bytes</div>
                        </div>
                        <div className="flex-1 text-center">
                           <div className="text-[#8b949e] mb-1">GC Stutter Delay</div>
                           <div className="text-[14px] font-bold text-[#3fb950]">0.0 ms</div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <div className="flex justify-between items-start">
                        <h3 className="text-white font-bold text-[15px] mb-2 text-[#3fb950] flex items-center gap-2">Data-Oriented Tech Stack (ECS/DOTS)</h3>
                        <span className="bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/30 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest animate-pulse">Extreme Logic</span>
                     </div>
                     <p className="text-[#8b949e] text-[12px] mb-4">Traditional Object-Oriented Programming (OOP) scatters object data across random memory addresses, destroying L1/L2 CPU Cache efficiency (Cache Misses). ECS (Entity Component System) rips memory apart, packing identical raw data types directly side-by-side in sequential memory arrays.</p>
                     
                     <div className="space-y-4">
                        <div className="bg-[#0a0a0a] p-3 rounded border border-[#30363d]">
                           <span className="text-[#f85149] font-bold text-[11px] block mb-1">OOP (Slow Cache Thrashing):</span>
                           <code className="text-[#8b949e] text-[10px] break-all block">[{'{'}Enemy1: Health, Pos, AI{'}'}] ...[MEM GAP]... [{'{'}Enemy2: Health, Pos, AI{'}'}]</code>
                        </div>
                        <div className="bg-[#0a0a0a] p-3 rounded border border-[#30363d]">
                           <span className="text-[#3fb950] font-bold text-[11px] block mb-1">ECS (Fast Vectorized SIMD Array):</span>
                           <code className="text-[#8b949e] text-[10px] break-all block">HealthArray: [100, 50, 20...]<br/>PositionArray: [(x,y), (x,y), (x,y)...]</code>
                        </div>
                     </div>
                     <p className="text-[#c9d1d9] text-[12px] font-medium mt-4 border-l-2 border-[#3fb950] pl-3 italic">This architecture enables a standard CPU to easily simulate 100,000+ flocking entities simultaneously by effortlessly streaming the contiguous arrays right through raw matrix math operations at light-speed.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#3fb950]">Flocking Algorithms / Boids</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Simulating dense crowds of zombies or swarms of birds without giving each entity an expensive pathfinding brain. Driven by three extremely cheap mathematical rules: <strong>Separation</strong> (don't collide), <strong>Alignment</strong> (match velocity of neighbors), and <strong>Cohesion</strong> (steer toward the center of the flock).</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <div className="flex gap-4">
                        <div className="flex-1">
                           <h3 className="text-white font-bold text-[13px] mb-1 text-[#3fb950]">Behavior Trees</h3>
                           <p className="text-[#8b949e] text-[11px]">Hierarchical nodes defining AI logic (Sequence, Selector). Enemies systematically traverse branches (e.g., "See Player" -&gt; "Is In Cover?" -&gt; "Shoot") avoiding complex spaghetti code while dynamically responding to scenarios.</p>
                        </div>
                        <div className="flex-1">
                           <h3 className="text-white font-bold text-[13px] mb-1 text-[#3fb950]">Finite State Machine (FSM)</h3>
                           <p className="text-[#8b949e] text-[11px]">Locking an entity into exactly one distinct mode at a time (Idle, Patrol, Attack). An enemy physically cannot execute "Attack" logic if it is hard-locked in the "Fleeing" state.</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#3fb950]">Spatial Partitioning (Quadtree / Octree)</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Brute-forcing distance checks between 10,000 objects requires 100,000,000 equations per frame [O(n²)]. Spatial trees chop physical space into recursively smaller sub-boxes. If a bullet enters Box A, the engine mathematically ignores checking collision against any single object resting inside Box B, collapsing computation times.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#3fb950]">NavMesh (Navigation Mesh) Pathfinding</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3">Rather than forcing AI to constantly cast physical collision rays to detect walls or avoid pitfalls, the environment is overlaid with an invisible, simplified polygonal "walkable" topology. NPCs execute rapid A* or Dijkstra traversal algorithms mathematically across this 2D plane, unlocking highly intelligent flocking routines at virtually zero physical CPU cost.</p>
                  </div>
               </div>
            )}

            {activeTab === 'backend' && (
               <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="border-b border-[#30363d] pb-3">
                     <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Server className="text-[#a371f7]"/> MMO Backend & Cloud Infrastructure</h2>
                     <p className="text-[#8b949e] text-[12px] mt-1">Elastically scaling game logic and maintaining high availability across millions of concurrent connections.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <div className="flex gap-4">
                        <div className="flex-1">
                           <h3 className="text-white font-bold text-[13px] mb-1 text-[#a371f7]">Microservices Architecture</h3>
                           <p className="text-[#8b949e] text-[11px]">Decoupling monolithic logic. The Chat Server, Login Server, Auction House, and Game World are strictly separated. If the Auction House crashes due to heavy loads, players can still log in and farm monsters independently without dropping.</p>
                        </div>
                        <div className="flex-1">
                           <h3 className="text-white font-bold text-[13px] mb-1 text-[#a371f7]">Auto-Scaling & Containers (K8s)</h3>
                           <p className="text-[#8b949e] text-[11px]">Cloud orchestrators monitor player loads. During prime-time or holiday events, Kubernetes automatically spins up hundreds of fresh compute containers to absorb the sheer influx, then intelligently kills them at 3 AM to save real-world server costs.</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#a371f7]">State Machine Replication (SMR/High Availability)</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3">Maintaining live "Mirror" servers running parallel math. If the primary world server unexpectedly suffers a catastrophic hardware failure, the hot-standby mirror instantly adopts the connections in a fraction of a millisecond. Players experience a tiny lag spike, but nobody drops out.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[15px] mb-2 text-[#a371f7]">Message Queuing (Kafka / RabbitMQ)</h3>
                     <p className="text-[#8b949e] text-[12px] mb-3">An MMO generates hundreds of thousands of events a second (looting, whispering, swinging swords). If the DB halts for a second, it risks corrupting data. High-throughput queuing platforms buffer those commands into rigorous sequential pipelines, ensuring every database transaction behaves reliably and securely under infinite stress.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <div className="flex gap-4">
                        <div className="flex-1">
                           <h3 className="text-white font-bold text-[13px] mb-1 text-[#a371f7]">Zero-Downtime Deployment</h3>
                           <p className="text-[#8b949e] text-[11px]">Deploying Version 2 alongside Version 1 (Blue-Green Deployment). New players silently join V2, while V1 players finish their sessions. This eliminates the antiquated concept of weekly "Server Maintenance Downs."</p>
                        </div>
                        <div className="flex-1">
                           <h3 className="text-white font-bold text-[13px] mb-1 text-[#a371f7]">Fraud Detection & Economy Sinks</h3>
                           <p className="text-[#8b949e] text-[11px]">Tracking Real Money Trading (RMT) vectors using heuristics. To combat hyper-inflation, economies aggressively engineer "Sinks" (repair fees, marketplace taxes) to permanently destroy raw gold from the economy, perfectly balancing the "Sources" (quests, loot).</p>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'archetypes' && (
               <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="border-b border-[#30363d] pb-3">
                     <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Gamepad2 className="text-[#ff7b72]"/> Tactical Architecture by Genre</h2>
                     <p className="text-[#8b949e] text-[12px] mt-1">A high-level matrix for offline AI agents to query the optimal algorithms based on the target game design.</p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[16px] mb-2 text-[#ff7b72]">I. Offline Single-Player & Story-Driven Architecture</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Games free from network determinism constraints, allowing 100% of the CPU/GPU payload to be weaponized for photorealism, deep AI, and immersive physics.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Rigid Body Physics: Semi-Implicit Euler vs Verlet</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Standard Unity/Unreal integration. To prevent explosive ragdolls, Verlet integration calculates velocity purely from current and previous positions, eliminating accumulated float errors.</p>
                           <div className="bg-[#010409] p-2 rounded border border-[#30363d] font-mono text-[9px] text-[#8b949e] overflow-x-auto">
                              <span className="text-[#ff7b72]">Vector3</span> <span className="text-[#d2a8ff]">VerletIntegrate</span>(<span className="text-[#ff7b72]">Vector3</span> pos, <span className="text-[#ff7b72]">Vector3</span> prevPos, <span className="text-[#ff7b72]">float</span> dt) {'{\n'}
                              {'  '}<span className="text-[#8b949e]">// p(t+dt) = 2p(t) - p(t-dt) + a(t) * dt^2</span>{'\n'}
                              {'  '}<span className="text-[#ff7b72]">Vector3</span> velocity = pos - prevPos;{'\n'}
                              {'  '}<span className="text-[#ff7b72]">Vector3</span> nextPos = pos + velocity + (<span className="text-[#79c0ff]">gravity</span> * dt * dt);{'\n'}
                              {'  '}<span className="text-[#ff7b72]">return</span> nextPos;{'\n'}
                              {'}'}
                           </div>
                           <ul className="list-disc list-inside text-[11px] text-[#8b949e] mt-2 space-y-1 ml-1 leading-relaxed">
                              <li><strong>IK Blending:</strong> <code className="text-[#a5d6ff]">EndEffector_pos = Target_pos - (BoneLength * Jacobian_Inverse)</code></li>
                              <li><strong>CCD (Continuous Collision):</strong> Raycasting from <code className="text-[#a5d6ff]">pos</code> to <code className="text-[#a5d6ff]">nextPos</code> before moving the object to ensure bullets don't quantum-tunnel through walls.</li>
                           </ul>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Advanced AI: Goal-Oriented Action Planning (GOAP)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Rather than FSMs (State Machines), offline NPCs solve puzzles mathematically using A* pathfinding conceptually applied to state graphs (Preconditions and Effects).</p>
                           <div className="bg-[#010409] p-2 rounded border border-[#30363d] font-mono text-[9px] text-[#8b949e] overflow-x-auto">
                              <span className="text-[#ff7b72]">struct</span> <span className="text-[#d2a8ff]">Action</span> {'{\n'}
                              {'  '}<span className="text-[#ff7b72]">int</span> cost = <span className="text-[#a5d6ff]">10</span>;{'\n'}
                              {'  '}<span className="text-[#ff7b72]">BitMask</span> Preconditions; <span className="text-[#8b949e]">// [HasAxe=True, TreeNear=True]</span>{'\n'}
                              {'  '}<span className="text-[#ff7b72]">BitMask</span> Effects;       <span className="text-[#8b949e]">// [HasWood=True]</span>{'\n'}
                              {'}'};{'\n'}
                              <span className="text-[#8b949e]">// Graph dynamically builds: WalkToTree(5) -&gt; Chop(10)</span>
                           </div>
                           <ul className="list-disc list-inside text-[11px] text-[#8b949e] mt-2 space-y-1 ml-1 leading-relaxed">
                              <li><strong>Utility AI Scoring:</strong> Action priority is mathematically weighted: <code className="text-[#a5d6ff]">Score = (Desire^2) * (1.0 - Distance/MaxDist)</code></li>
                              <li><strong>Sight Cones:</strong> <code className="text-[#a5d6ff]">DotProduct(NpcForward, VectorToPlayer) &gt; cos(FOV/2)</code></li>
                           </ul>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[16px] mb-2 text-[#ff7b72]">II. Massive Open World (Sandbox) Engine Blueprint</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Architectures designed for games like GTA or Skyrim where loading screens are strictly forbidden, requiring aggressive asynchronous streaming and localized simulations.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Math & Vision: Frustum Culling Matrix</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Before sending 100,000 meshes to the GPU, we mathematically calculate if their Bounding Sphere is inside the Camera's 6 planes (Left, Right, Top, Bottom, Near, Far).</p>
                           <div className="bg-[#010409] p-2 rounded border border-[#30363d] font-mono text-[9px] text-[#8b949e] overflow-x-auto">
                              <span className="text-[#ff7b72]">bool</span> <span className="text-[#d2a8ff]">IsSphereInFrustum</span>(<span className="text-[#ff7b72]">Vector3</span> center, <span className="text-[#ff7b72]">float</span> radius, <span className="text-[#ff7b72]">Plane</span>[] planes) {'{\n'}
                              {'  '}<span className="text-[#ff7b72]">for</span>(<span className="text-[#ff7b72]">int</span> i=<span className="text-[#a5d6ff]">0</span>; i&lt;<span className="text-[#a5d6ff]">6</span>; i++) {'{\n'}
                              {'    '}<span className="text-[#8b949e]">// Dot(Plane.Normal, Center) + Plane.Distance</span>{'\n'}
                              {'    '}<span className="text-[#ff7b72]">float</span> distance = Dot(planes[i].n, center) + planes[i].d;{'\n'}
                              {'    '}<span className="text-[#ff7b72]">if</span> (distance &lt; -radius) <span className="text-[#ff7b72]">return false</span>; <span className="text-[#8b949e]">// Behind plane</span>{'\n'}
                              {'  }'}{'\n'}
                              {'  '}<span className="text-[#ff7b72]">return true</span>;{'\n'}
                              {'}'}
                           </div>
                           <ul className="list-disc list-inside text-[11px] text-[#8b949e] mt-2 space-y-1 ml-1 leading-relaxed">
                              <li><strong>Hierarchical LODs:</strong> Evaluating distance: <code className="text-[#a5d6ff]">Dist = |CameraPos - ObjectPos|</code>. If <code className="text-[#a5d6ff]">Dist &gt; 500m</code>, swap 3D tree mesh for a 2D Bilboard texture.</li>
                           </ul>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Asynchronous Grid Streaming (Chunking)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">The 100km² world is divided into a mathematical grid. The engine loads sectors residing inside a radius, throwing out memory behind the player.</p>
                           <div className="bg-[#010409] p-2 rounded border border-[#30363d] font-mono text-[9px] text-[#8b949e] overflow-x-auto">
                              <span className="text-[#ff7b72]">void</span> <span className="text-[#d2a8ff]">UpdateWorldStreaming</span>(<span className="text-[#ff7b72]">Vector3</span> playerPos) {'{\n'}
                              {'  '}<span className="text-[#ff7b72]">int</span> cellX = floor(playerPos.x / <span className="text-[#a5d6ff]">CHUNK_SIZE</span>);{'\n'}
                              {'  '}<span className="text-[#ff7b72]">int</span> cellY = floor(playerPos.z / <span className="text-[#a5d6ff]">CHUNK_SIZE</span>);{'\n'}
                              {'  '}{'\n'}
                              {'  '}<span className="text-[#ff7b72]">foreach</span>(Chunk c <span className="text-[#ff7b72]">in</span> ActiveChunks) {'{\n'}
                              {'    '}<span className="text-[#ff7b72]">if</span> (Distance(c.x, c.y, cellX, cellY) &gt; <span className="text-[#a5d6ff]">LOAD_RADIUS</span>) {'{\n'}
                              {'      '}UnloadAsync(c); <span className="text-[#8b949e]">// Free RAM</span>{'\n'}
                              {'    }'}{'\n'}
                              {'  }'}{'\n'}
                              {'}'}
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[16px] mb-2 text-[#ff7b72]">III. Competitive Multiplayer (E-Sports FPS / Fighting)</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Sub-millisecond latency requirements where every frame determines the tournament winner. Extreme CPU priority is placed on deterministic input locking, anti-cheat, and lag mitigation.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Netcode: Rollback & Lag Compensation (GGPO)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">When a player shoots, the server receives the packet 50ms later. The server temporarily "rewinds" the game's physics state back 50ms, checks if the raycast hits the enemy in the past, and applies damage.</p>
                           <div className="bg-[#010409] p-2 rounded border border-[#30363d] font-mono text-[9px] text-[#8b949e] overflow-x-auto">
                              <span className="text-[#ff7b72]">void</span> <span className="text-[#d2a8ff]">ProcessShootPacket</span>(Player p, <span className="text-[#ff7b72]">long</span> clientTimestamp) {'{\n'}
                              {'  '}<span className="text-[#8b949e]">// Calculate exact ping (e.g., 50ms)</span>{'\n'}
                              {'  '}<span className="text-[#ff7b72]">long</span> pingOffset = CurrentServerTime - clientTimestamp;{'\n'}
                              {'  '}{'\n'}
                              {'  '}<span className="text-[#8b949e]">// Restore all enemy hitboxes to where they were 50ms ago</span>{'\n'}
                              {'  '}PhysicsWorld.RestoreHistoricalState(CurrentServerTime - pingOffset);{'\n'}
                              {'  '}{'\n'}
                              {'  '}<span className="text-[#ff7b72]">bool</span> hit = Physics.Raycast(p.EyePosition, p.ForwardVector);{'\n'}
                              {'  '}PhysicsWorld.RestoreCurrentState(); <span className="text-[#8b949e]">// Snap back to present</span>{'\n'}
                              {'}'}
                           </div>
                           <ul className="list-disc list-inside text-[11px] text-[#8b949e] mt-2 space-y-1 ml-1 leading-relaxed">
                              <li><strong>Client-Side Prediction:</strong> Local client assumes <code className="text-[#a5d6ff]">velocity = input * speed</code> instantly, rendering movement immediately before server validates it.</li>
                           </ul>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Determinism & Fixed Fixed Math</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Floating point math (<code className="text-[#a5d6ff]">0.1 + 0.2 != 0.3</code>) causes desync across different CPUs. Servers use Fixed Update loops and Fixed-Point Integer math to ensure identical trajectories globally.</p>
                           <div className="bg-[#010409] p-2 rounded border border-[#30363d] font-mono text-[9px] text-[#8b949e] overflow-x-auto">
                              <span className="text-[#ff7b72]">void</span> <span className="text-[#d2a8ff]">FixedUpdateLoop</span>() {'{\n'}
                              {'  '}<span className="text-[#ff7b72]">double</span> t = <span className="text-[#a5d6ff]">0.0</span>;{'\n'}
                              {'  '}<span className="text-[#ff7b72]">double</span> dt = <span className="text-[#a5d6ff]">1.0</span> / <span className="text-[#a5d6ff]">64.0</span>; <span className="text-[#8b949e]">// 64 TICK RATE</span>{'\n'}
                              {'  '}{'\n'}
                              {'  '}<span className="text-[#ff7b72]">while</span> (currentTime &gt; accumulator) {'{\n'}
                              {'    '}Physics.Step(dt); <span className="text-[#8b949e]">// Strict, identical math intervals</span>{'\n'}
                              {'    '}accumulator += dt;{'\n'}
                              {'    '}t += dt;{'\n'}
                              {'  }'}{'\n'}
                              {'}'}
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[16px] mb-2 text-[#ff7b72]">IV. MMORPG & Persistent Cloud Realms</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Orchestrating absolute chaos. Routing massive bandwidth streams for 10,000+ concurrent players flawlessly while fighting database transaction locks and rendering death-balls.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Network AOI (Area of Interest) Spatial Hashing</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Sending 10,000 player positions to 10,000 players is 100M packets/sec (O(n²)). The server groups players into a grid and only broadcasts packets to adjacent grid arrays.</p>
                           <div className="bg-[#010409] p-2 rounded border border-[#30363d] font-mono text-[9px] text-[#8b949e] overflow-x-auto">
                              <span className="text-[#ff7b72]">struct</span> <span className="text-[#d2a8ff]">GridCell</span> {'{\n'}
                              {'  '}<span className="text-[#ff7b72]">int</span> x = floor(player.x / <span className="text-[#a5d6ff]">50m</span>);{'\n'}
                              {'  '}<span className="text-[#ff7b72]">int</span> y = floor(player.y / <span className="text-[#a5d6ff]">50m</span>);{'\n'}
                              {'}'};{'\n'}
                              {'\n'}
                              <span className="text-[#ff7b72]">void</span> <span className="text-[#d2a8ff]">BroadcastMovement</span>(Player p) {'{\n'}
                              {'  '}<span className="text-[#ff7b72]">var</span> neighbors = GetAdjacentCells(p.GridCell);{'\n'}
                              {'  '}<span className="text-[#ff7b72]">foreach</span>(Cell c <span className="text-[#ff7b72]">in</span> neighbors) {'{\n'}
                              {'    '}<span className="text-[#ff7b72]">foreach</span>(Player observer <span className="text-[#ff7b72]">in</span> c.Players) {'{\n'}
                              {'      '}observer.Send(p.PositionPacket);{'\n'}
                              {'    }'}{'\n'}
                              {'  }'}{'\n'}
                              {'}'}
                           </div>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Economy Security: 2-Phase Commit (2PC)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Trades across distributed database shards must be Atomic. If a server crashes during a gold transfer, it must perfectly rollback to prevent duplication exploits.</p>
                           <div className="bg-[#010409] p-2 rounded border border-[#30363d] font-mono text-[9px] text-[#8b949e] overflow-x-auto">
                              <span className="text-[#8b949e]">// PHASE 1: PREPARE (Lock records)</span>{'\n'}
                              <span className="text-[#ff7b72]">bool</span> p1 = DB.Execute(<span className="text-[#a5d6ff]">"UPDATE Gold SET Locked=1 WHERE User=A AND Bal&gt;=100"</span>);{'\n'}
                              <span className="text-[#ff7b72]">bool</span> p2 = DB.Execute(<span className="text-[#a5d6ff]">"UPDATE Inventory SET Locked=1 WHERE User=B AND HasItem=1"</span>);{'\n'}
                              {'\n'}
                              <span className="text-[#ff7b72]">if</span> (!p1 || !p2) {'{\n'}
                              {'  '}DB.Rollback(); <span className="text-[#8b949e]">// Abort entire transaction</span>{'\n'}
                              {'  '}<span className="text-[#ff7b72]">return</span> <span className="text-[#a5d6ff]">"Trade Failed"</span>;{'\n'}
                              {'}'}{'\n'}
                              <span className="text-[#8b949e]">// PHASE 2: COMMIT (Swap and Unlock)</span>{'\n'}
                              DB.Execute(<span className="text-[#a5d6ff]">"UPDATE ... Commit swap..."</span>);{'\n'}
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                     <h3 className="text-white font-bold text-[16px] mb-2 text-[#ff7b72]">V. Real-Time Strategy (RTS) & Simulation Swarms</h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Games like StarCraft or Total War where a single player commands 1,000+ individual units simultaneously, pushing object caching and CPU logic strictly to their absolute breaking point.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Data-Oriented Tech Stack (ECS) Data Mapping</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Standard OOP fragments memory, ruining CPU Cache hit rates. ECS converts arrays of objects (AoS) into native Structures of Arrays (SoA), allowing SIMD Vector processing at identical addresses.</p>
                           <div className="bg-[#010409] p-2 rounded border border-[#30363d] font-mono text-[9px] text-[#8b949e] overflow-x-auto">
                              <span className="text-[#f85149]">// SLOW (Object Oriented - Array of Structs)</span>{'\n'}
                              <span className="text-[#ff7b72]">class</span> <span className="text-[#d2a8ff]">Unit</span> {'{'} <span className="text-[#ff7b72]">float</span> hp; <span className="text-[#ff7b72]">float</span> x; <span className="text-[#ff7b72]">float</span> y; <span className="text-[#ff7b72]">object</span> AI; {'}'}{'\n'}
                              Unit horde[<span className="text-[#a5d6ff]">100000</span>]; <span className="text-[#8b949e]">// CPU cache misses constantly</span>{'\n'}
                              {'\n'}
                              <span className="text-[#3fb950]">// FAST (ECS - Struct of Arrays)</span>{'\n'}
                              <span className="text-[#ff7b72]">struct</span> <span className="text-[#d2a8ff]">Components</span> {'{\n'}
                              {'  '}<span className="text-[#ff7b72]">float</span> HP[<span className="text-[#a5d6ff]">100000</span>];   <span className="text-[#8b949e]">// Packed tightly in L1 Cache</span>{'\n'}
                              {'  '}<span className="text-[#ff7b72]">float</span> posX[<span className="text-[#a5d6ff]">100000</span>];{'\n'}
                              {'  '}<span className="text-[#ff7b72]">float</span> posY[<span className="text-[#a5d6ff]">100000</span>];{'\n'}
                              {'}'}{'\n'}
                              <span className="text-[#8b949e]">// Math is applied serially in a single tight loop</span>
                           </div>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Boids Swarm Simulation Equations</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Simulating thousands of dynamic entities using 3 highly-optimizable macroscopic rules instead of giving each insect or bird an expensive A* brain.</p>
                           <div className="bg-[#010409] p-2 rounded border border-[#30363d] font-mono text-[9px] text-[#8b949e] overflow-x-auto">
                              <span className="text-[#ff7b72]">Vector3</span> <span className="text-[#d2a8ff]">CalculateFlocking</span>(<span className="text-[#ff7b72]">int</span> i) {'{\n'}
                              {'  '}<span className="text-[#ff7b72]">Vector3</span> separation = <span className="text-[#a5d6ff]">0</span>; <span className="text-[#8b949e]">// Steer away from crowd</span>{'\n'}
                              {'  '}<span className="text-[#ff7b72]">Vector3</span> alignment = <span className="text-[#a5d6ff]">0</span>;  <span className="text-[#8b949e]">// Match velocity of neighbors</span>{'\n'}
                              {'  '}<span className="text-[#ff7b72]">Vector3</span> cohesion = <span className="text-[#a5d6ff]">0</span>;   <span className="text-[#8b949e]">// Steer towards center of mass</span>{'\n'}
                              {'  '}{'\n'}
                              {'  '}<span className="text-[#ff7b72]">foreach</span> (neighbor <span className="text-[#ff7b72]">in</span> Radius) {'{\n'}
                              {'    '}separation += (pos[i] - pos[j]) / dist(pos[i], pos[j]);{'\n'}
                              {'    '}alignment += velocity[j];{'\n'}
                              {'    '}cohesion += pos[j];{'\n'}
                              {'  }'}{'\n'}
                              {'  '}<span className="text-[#ff7b72]">return</span> (separation*<span className="text-[#a5d6ff]">1.5</span>) + (alignment*<span className="text-[#a5d6ff]">1.0</span>) + (cohesion*<span className="text-[#a5d6ff]">1.0</span>);{'\n'}
                              {'}'}
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#ff7b72] rounded-lg p-5 shadow-[0_0_15px_rgba(255,123,114,0.1)] relative overflow-hidden">
                     <div className="absolute top-0 right-0 bg-[#ff7b72] text-[10px] font-bold text-black px-3 py-1 rounded-bl-lg">GOD TIER</div>
                     <h3 className="text-white font-bold text-[18px] mb-2 flex items-center gap-2"><span className="text-[#ff7b72]">VI. The System Convergence Matrix</span> <span className="text-[12px] font-normal text-[#8b949e] bg-[#21262d] px-2 py-0.5 rounded border border-[#30363d]">(Hybrid Architectures)</span></h3>
                     <p className="text-[#8b949e] text-[12px] mb-4">Merging isolated systems. e.g., A native Offline Single-Player game that mathematically transforms into a P2P Co-Op simulation on-the-fly, backed by Neural-Network AI and extreme spatial computing optimizations.</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1 relative hover:border-[#ff7b72] transition-colors duration-300">
                           <div className="absolute -top-1 -right-1 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff7b72] opacity-20"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff7b72] opacity-50 border border-[#ff7b72]"></span>
                           </div>
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Seamless Drop-In Co-Op (Authority Handoff)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">When Player B joins an offline Player A, Player A's local engine instantly spin-ups a background Listen Server, granting "Local Authority" but transferring specific Actor authority to B.</p>
                           <div className="bg-[#010409] p-2 rounded border border-[#30363d] font-mono text-[9px] text-[#8b949e] overflow-x-auto">
                              <span className="text-[#ff7b72]">void</span> <span className="text-[#d2a8ff]">OnPlayerJoinRequest</span>(Client B) {'{\n'}
                              {'  '}<span className="text-[#8b949e]">// 1. Freeze Time / Suspend Physics Thread</span>{'\n'}
                              {'  '}Physics.Pause();{'\n'}
                              {'  '}{'\n'}
                              {'  '}<span className="text-[#8b949e]">// 2. Elevate local game to Listen Server</span>{'\n'}
                              {'  '}NetworkManager.StartHost(port: <span className="text-[#a5d6ff]">7777</span>);{'\n'}
                              {'  '}{'\n'}
                              {'  '}<span className="text-[#8b949e]">// 3. Serialize instantaneous World State (Diffs) to B</span>{'\n'}
                              {'  '}Snapshot s = World.SerializeEntities();{'\n'}
                              {'  '}B.SendReliable(s);{'\n'}
                              {'  '}{'\n'}
                              {'  '}<span className="text-[#8b949e]">// 4. Grant B Authority over their spawned Avatar</span>{'\n'}
                              {'  '}Entity avatar = World.Spawn(B.Profile);{'\n'}
                              {'  '}avatar.SetNetworkAuthority(B.Guid);{'\n'}
                              {'  '}{'\n'}
                              {'  '}Physics.Resume();{'\n'}
                              {'}'}
                           </div>
                           <ul className="list-disc list-inside text-[11px] text-[#8b949e] mt-2 space-y-1 ml-1 leading-relaxed">
                              <li><strong>State Separation:</strong> NPCs remain strictly owned by Player A (Host), meaning Player B uses <em>Client-Side Prediction</em> and <em>Interpolation</em> just like a competitive game, while A experiences true 0-ping logic.</li>
                           </ul>
                        </div>
                        
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1 relative hover:border-[#a5d6ff] transition-colors duration-300">
                           <div className="absolute -top-1 -right-1 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a5d6ff] opacity-20"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#a5d6ff] opacity-50 border border-[#a5d6ff]"></span>
                           </div>
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">AI: Neural Network Tensor Inferencing</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Replacing rigid GOAP/Behavior Trees with actual Tensor weights. Training bots via millions of iterations in the cloud, then sending the compiled 2MB ONNX model to the local GPU via DirectML.</p>
                           <div className="bg-[#010409] p-2 rounded border border-[#30363d] font-mono text-[9px] text-[#8b949e] overflow-x-auto">
                              <span className="text-[#ff7b72]">struct</span> <span className="text-[#d2a8ff]">NeuralObservation</span> {'{\n'}
                              {'  '}<span className="text-[#ff7b72]">float</span>[] Raycasts;  <span className="text-[#8b949e]">// 3D lidar vision</span>{'\n'}
                              {'  '}<span className="text-[#ff7b72]">float</span>[] Distances; <span className="text-[#8b949e]">// To all enemies</span>{'\n'}
                              {'  '}<span className="text-[#ff7b72]">float</span>   HealthPct;{'\n'}
                              {'}'};{'\n'}
                              {'\n'}
                              <span className="text-[#8b949e]">// Executed via GPU Tensor Cores, bypassing CPU entirely</span>{'\n'}
                              <span className="text-[#ff7b72]">float</span>[] actions = <span className="text-[#79c0ff]">ONNX_Inference</span>(ModelWeights, <span className="text-[#79c0ff]">Normalize</span>(Observation));{'\n'}
                              {'\n'}
                              <span className="text-[#ff7b72]">if</span> (actions[<span className="text-[#a5d6ff]">0</span>] &gt; <span className="text-[#a5d6ff]">0.8f</span>) <span className="text-[#79c0ff]">Jump</span>();{'\n'}
                              <span className="text-[#ff7b72]">if</span> (actions[<span className="text-[#a5d6ff]">1</span>] &gt; <span className="text-[#a5d6ff]">0.5f</span>) <span className="text-[#79c0ff]">ShootTarget</span>(actions[<span className="text-[#a5d6ff]">2</span>], actions[<span className="text-[#a5d6ff]">3</span>]);
                           </div>
                           <ul className="list-disc list-inside text-[11px] text-[#8b949e] mt-2 space-y-1 ml-1 leading-relaxed">
                              <li><strong>Stochastic Variance:</strong> <code className="text-[#a5d6ff]">actions += noise(temperature)</code> prevents bots from acting mechanically rigid every loop. Allows emergent, frighteningly human "mistakes".</li>
                           </ul>
                        </div>

                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1 relative hover:border-[#8957e5] transition-colors duration-300">
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Graphics: Neural Radiance Fields (NeRF) / Gaussian Splats</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Photogrammetry 2.0. Instead of 3D polygons overlaid with PBR textures, storing objects as a cloud of billions of mathematical colored ellipses that react dynamically to viewing angles.</p>
                           <div className="bg-[#010409] p-2 rounded border border-[#30363d] font-mono text-[9px] text-[#8b949e] overflow-x-auto">
                              <span className="text-[#ff7b72]">struct</span> <span className="text-[#d2a8ff]">GaussianSplat</span> {'{\n'}
                              {'  '}<span className="text-[#ff7b72]">Vector3</span> center;{'\n'}
                              {'  '}<span className="text-[#ff7b72]">Vector3</span> sphericalHarmonics; <span className="text-[#8b949e]">// View-dependent color</span>{'\n'}
                              {'  '}<span className="text-[#ff7b72]">float</span>   opacity;{'\n'}
                              {'  '}<span className="text-[#ff7b72]">Matrix3</span> covariance;         <span className="text-[#8b949e]">// 3D shape/stretch</span>{'\n'}
                              {'}'};{'\n'}
                              {'\n'}
                              <span className="text-[#8b949e]">// Splatting process (Rasterization equivalent)</span>{'\n'}
                              <span className="text-[#ff7b72]">float2</span> screenPos = <span className="text-[#79c0ff]">ProjectToScreen</span>(splat.center, Camera);{'\n'}
                              <span className="text-[#ff7b72]">float</span> alpha = <span className="text-[#79c0ff]">ComputeOpacity</span>(splat, viewDir);{'\n'}
                              <span className="text-[#79c0ff]">AccumulateAlphaBlendedPixel</span>(screenPos, splat.color, alpha);
                           </div>
                           <ul className="list-disc list-inside text-[11px] text-[#8b949e] mt-2 space-y-1 ml-1 leading-relaxed">
                              <li><strong>Bypassing Topology:</strong> Completely removes the need for retopology, UV unwrapping, and texture baking. True 1:1 reality capture.</li>
                           </ul>
                        </div>

                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#30363d] col-span-2 md:col-span-1 relative hover:border-[#f0883e] transition-colors duration-300">
                           <div className="absolute -top-1 -right-1 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f0883e] opacity-20"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f0883e] opacity-50 border border-[#f0883e]"></span>
                           </div>
                           <span className="text-[#c9d1d9] font-bold text-[12px] block mb-2 border-b border-[#30363d] pb-1">Networking: Hybrid Lockstep + Rollback (The Holy Grail)</span>
                           <p className="text-[#8b949e] text-[10px] mb-2">Used in massive physical brawlers. Deterministic Lockstep uses ~0% bandwidth but stutters. GGPO Rollback uses heavy CPU but feels instant. Hybridizing them solves both.</p>
                           <div className="bg-[#010409] p-2 rounded border border-[#30363d] font-mono text-[9px] text-[#8b949e] overflow-x-auto">
                              <span className="text-[#8b949e]">// 1. Simulate forward using Lockstep Input History</span>{'\n'}
                              World.Simulate(CurrentTick, PredictLocalInput());{'\n'}
                              {'\n'}
                              <span className="text-[#8b949e]">// 2. If a delayed packet arrives from Remote Player:</span>{'\n'}
                              <span className="text-[#ff7b72]">void</span> <span className="text-[#d2a8ff]">OnLatePacketRx</span>(<span className="text-[#ff7b72]">int</span> tick, Input i) {'{\n'}
                              {'  '}<span className="text-[#ff7b72]">if</span> (i != PredictedInputs[tick]) {'{\n'}
                              {'    '}<span className="text-[#8b949e]">// Branch misprediction! Rollback to that specific tick.</span>{'\n'}
                              {'    '}State = SnapshotBuffer[tick];{'\n'}
                              {'    '}{'\n'}
                              {'    '}<span className="text-[#8b949e]">// Re-simulate the last 10 frames instantly using the correct input</span>{'\n'}
                              {'    '}<span className="text-[#ff7b72]">for</span>(<span className="text-[#ff7b72]">int</span> t=tick; t&lt;CurrentTick; t++) {'{\n'}
                              {'      '}World.Simulate(t, CorrectedInputs[t]);{'\n'}
                              {'    }'}{'\n'}
                              {'  }'}{'\n'}
                              {'}'}
                           </div>
                           <ul className="list-disc list-inside text-[11px] text-[#8b949e] mt-2 space-y-1 ml-1 leading-relaxed">
                              <li><strong>Cost:</strong> Insane CPU requirement. Engine must be capable of processing the main physics tick loop 10-20 times within a single 16ms render frame.</li>
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>
            )}

         </div>
      </div>
    </div>
  );
}
