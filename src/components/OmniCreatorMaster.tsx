import React, { useState } from 'react';
import { Network, Cpu, Settings, Infinity, Layers, Brain, Gamepad2, Database, Wifi, Shield, Box, Zap, Clapperboard, Globe, Cloud, LayoutDashboard, Activity, Terminal, Code2, Orbit, Aperture, Fingerprint, Radar, Target, Focus, Hexagon, Component, Workflow, Atom, Combine, Waves, Mic2, Music, Smile, Map} from 'lucide-react';

function SystemResourcesWidget() {
  const [cpuUsage, setCpuUsage] = useState(82);
  const [ramUsage, setRamUsage] = useState(24.5);
  const [gpuUsage, setGpuUsage] = useState(11.2);
  const [threadLoad, setThreadLoad] = useState<number[]>(Array.from({length: 64}, () => Math.random()));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.max(10, Math.min(100, prev + (Math.random() * 10 - 5))));
      setRamUsage(prev => Math.max(10, Math.min(64, prev + (Math.random() * 2 - 1))));
      setGpuUsage(prev => Math.max(5, Math.min(24, prev + (Math.random() * 1 - 0.5))));
      setThreadLoad(Array.from({length: 64}, () => Math.random()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="bg-[#0a0a0c] border border-white/5 rounded p-3">
         <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] uppercase text-[#666] font-bold">Memory Pool Allocation (RAM)</span>
            <span className="text-[9px] text-[#58a6ff] font-mono">{ramUsage.toFixed(1)} GB / 64 GB</span>
         </div>
         <div className="w-full bg-black h-1.5 rounded-full overflow-hidden flex">
            <div className="bg-[#58a6ff] h-full shadow-[0_0_10px_#58a6ff] transition-all duration-1000 outline-none" style={{width: `${(ramUsage/64)*100}%`}}></div>
            <div className="bg-[#e3b341] h-full transition-all duration-1000" style={{width: `${(ramUsage/64)*15}%`}}></div>
            <div className="bg-[#f85149] h-full transition-all duration-1000" style={{width: `${(ramUsage/64)*5}%`}}></div>
         </div>
         <div className="flex justify-between mt-1 text-[8px] text-[#555] font-mono">
           <span>GC: 1.2ms</span>
           <span>Page Faults: 0</span>
         </div>
      </div>
      
      <div className="bg-[#0a0a0c] border border-white/5 rounded p-3">
         <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] uppercase text-[#666] font-bold">GPU VRAM Streaming</span>
            <span className="text-[9px] text-[#bc8cff] font-mono">{gpuUsage.toFixed(1)} GB / 24 GB</span>
         </div>
         <div className="w-full bg-black h-1.5 rounded-full overflow-hidden flex">
            <div className="bg-[#bc8cff] h-full shadow-[0_0_10px_#bc8cff] transition-all duration-1000" style={{width: `${(gpuUsage/24)*100}%`}}></div>
            <div className="bg-purple-900 h-full transition-all duration-1000" style={{width: `${(gpuUsage/24)*10}%`}}></div>
         </div>
         <div className="flex justify-between mt-1 text-[8px] text-[#555] font-mono">
           <span>Tex Streaming: Active</span>
           <span>Buffer: 128MB</span>
         </div>
      </div>

      <div className="bg-[#0a0a0c] border border-white/5 rounded p-3">
         <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] uppercase text-[#666] font-bold">Thread Utilization (CPU)</span>
            <span className="text-[9px] text-[#3fb950] font-mono">{cpuUsage.toFixed(0)}%</span>
         </div>
         <div className="grid grid-cols-8 gap-[1px]">
            {threadLoad.map((load, i) => {
               let color = 'bg-[#1a3d24]';
               if (load > 0.8) color = 'bg-[#f85149]';
               else if (load > 0.4) color = 'bg-[#3fb950]';
               return <div key={i} className={`h-1.5 rounded-[1px] transition-colors duration-500 ${color}`}></div>;
            })}
         </div>
      </div>
    </>
  );
}

export default function OmniCreatorMaster({ onSelectTool }: { onSelectTool?: (tool: string) => void }) {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const pillars = [
    { 
      id: 'engine', title: 'Core Game Engine & Architecture', icon: <Cpu />, color: 'text-blue-500', 
      desc: 'Absolute control over memory allocation, thread pools, pointer math, and entity-component-system (ECS) topology.', 
      tools: ['DeterministicEngineeringSuite', 'IDECompilerCore', 'CodeProfilerTracer', 'EngineCore', 'PhysicsEngine', 'GraphicsRender', 'VoxelEngine', 'MemoryProfiler', 'KernelDebugger', 'CacheOptimizer', 'ThreadSyncMatrix', 'GarbageCollectionTuning', 'SIMD_Vectorize', 'JobSystemArch', 'RingBufferAllocator', 'BitfieldPacker', 'FixedPointMathVM', 'SpatialHashGrid', 'MortonBVH', 'SpinLockSynchronizer', 'FiberCoroutineScheduler', 'LockFreeQueue'] 
    },
    { 
      id: 'rendering', title: 'Advanced Rendering & Photorealism', icon: <Aperture />, color: 'text-cyan-400', 
      desc: 'Micro-polygon rendering, hardware raytracing, path tracing, BRDF materials, and volumetric atmospheric scattering.', 
      tools: ['NaniteRasterizer', 'LumenGlobalIllum', 'PathTracerCore', 'VolumetricClouds', 'ScreenSpaceReflections', 'RaytracedAO', 'SubsurfaceScattering', 'HDAO_Plus', 'DeferredRenderer', 'ForwardPlusRender', 'CookTorranceBRDF', 'SphericalHarmonics', 'CascadeShadowSplits', 'ACESToneMapper', 'FresnelOptics', 'BokehFFTConvolution', 'ParallaxOcclusion', 'AtmosphericScattering', 'FilmGrainSimplex'] 
    },
    { 
      id: 'art', title: '3D Sculpting & Asset Forge', icon: <Box />, color: 'text-orange-400', 
      desc: 'Vertex-level manipulation, ZBrush-level 200M+ polygon sculpting, auto-retopology, boolean cutting, and hard surface CAD.', 
      tools: ['CSG3DBooleanEngine', 'TopologyUVPro', 'SculptMaster', 'Photogrammetry', 'UVRetopology', 'MeshDecimation', 'CatmullClarkSubdiv', 'Voronoi3DFracture', 'HarmonicQuadRetopo', 'MikkTSpaceTangents', 'MarchingCubesSDF', 'QEMDecimator', 'QuickHullConvex', 'SplineRoadSweeper', 'GeodesicDistanceMesh', 'VertexColorWeaver', 'BlendShapeEditor', 'NURBS_Modeling', 'SDF_Renderer', 'HardSurfaceCAD'] 
    },
    { 
      id: 'materials', title: 'Material & Texture Node Graphs', icon: <Combine />, color: 'text-amber-500', 
      desc: 'Procedural PBR texture generation, Substance-like node networks, baking (Normals, Curvature, AO), and decals.', 
      tools: ['AITextureSynthesizer', 'TextureBaker', 'Material', 'ProceduralNoiseGen', 'DecalProjector', 'SubstanceGraph', 'AlbedoSynthesizer', 'RoughnessMapper', 'DisplacementBake', 'NormalMapPredictor', 'NeuralSuperResolution', 'PBRHeightParallax', 'CurvatureBakePass', 'AmbientOcclusionBake', 'ThicknessMapDiffusion', 'TriplanarMappingNode'] 
    },
    { 
      id: 'animation', title: 'Animation & Biomechanics', icon: <Layers />, color: 'text-pink-400', 
      desc: 'Muscle-based deformation, dual-quaternion skinning, inverse kinematics (IK), physics-driven hit reactions, and skeletal retargeting.', 
      tools: ['MotionCapture', 'RiggingAnim', 'CharacterAnimator', 'AnimGraph', 'MuscleSim', 'PoseBlendTree', 'RootMotionExtr', 'FacialARKit', 'ClothSimulation', 'FABRIK_InverseKinematics', 'DualQuaternionSkinning', 'BlazePose3DMoCap', 'VisemeLipSyncEngine', 'SpringBoneDynamics', 'RagdollActiveBlend', 'MotionMatchingSearch', 'TrajectoryPredictor'] 
    },
    { 
      id: 'world', title: 'World Architecture & Level Design', icon: <Map />, color: 'text-green-500', 
      desc: 'Manual BSP brush blockouts, grid mapping, hydraulic erosion, and infinite voxel terrain streaming.', 
      tools: ['MapEdit', 'BSPBrushArchitect', 'NavMeshRouter', 'MegaWorldArchitect', 'UltimateMapBuilder', 'AdvancedTerrain', 'PCG', 'HydraulicErosion', 'FoliageScatter', 'BiomePainter', 'CityGenerator', 'RoadSplineSystem', 'RiverMeshGen', 'VoxelTerrainMarcher', 'OctreeLevelOfDetail', 'ThermalErosionSim', 'DungeonGrammarGen', 'WindCurrentField'] 
    },
    { 
      id: 'vfx', title: 'VFX & Fluid Dynamics Simulation', icon: <Atom />, color: 'text-[#fb8500]', 
      desc: 'GPU-accelerated particle systems, Navier-Stokes fluid dynamics, rigid body destruction, soft-body tearing, and volumetrics.', 
      tools: ['VFXGraph', 'Niagara', 'OfflineVFX', 'FluidSimEularian', 'ChaosDestruction', 'SoftBodyJelly', 'HairFurSimulator', 'PyroSmokeFire', 'VectorFieldGen', 'SPHFluidDynamics', 'VerletClothSolver', 'ContinuousCollisionCCD', 'ConvexDecomposition', 'ParticleVortexTurbulence', 'VolumetricShockwave', 'RibbonTrailEmitter'] 
    },
    { 
      id: 'audio', title: 'Acoustics & DSP Audio Engine', icon: <Waves />, color: 'text-blue-300', 
      desc: 'Professional multi-track VST hosting, convolution reverb, manual foley mixing, and HRTF 3D spatialization.', 
      tools: ['AudioEditor', 'VstMixerRack', 'AudioDAW', 'MetaSound', 'AudioDSP', 'WwiseIntegrator', 'AmbisonicsMix', 'DopplerShiftNode', 'AcousticRaytracer', 'SynthesizerFM', 'FFTSpectrumAnalyzer', 'ParametricBiquadEQ', 'ConvolutionReverbIR', 'ADSREnvelopeShaper', 'HRTF3DSpatializer', 'LookaheadLimiter', 'PhysicsImpactFoley', 'PhaseVocoder'] 
    },
    { 
      id: 'voice_music', title: 'AI & Manual Voice/Music Studio', icon: <Mic2 />, color: 'text-[#bc8cff]', 
      desc: 'Manual MIDI piano roll orchestration, lip-sync extractors, and neural voice dubbing.', 
      tools: ['VoiceMusicStudio', 'MidiPianoRoll', 'VoiceDubbingStudio', 'DynamicOSTComposer', 'LipSyncAutomator', 'VocalSynthCore', 'FoleyGeneratorAI', 'MidiOrchestrator', 'SheetMusicExporter', 'WhisperOfflineSTT', 'PiperOfflineTTS', 'VisemeAcousticAligner', 'YINPitchTracker', 'RNNoiseDenoiser', 'SpectralFluxBPMTracker', 'AudioEventClassifier'] 
    },
    { 
      id: 'ai', title: 'Sentient AI & Neural Behavior', icon: <Brain />, color: 'text-purple-500', 
      desc: 'Reinforcement learning environments, GOAP (Goal-Oriented Action Planning), behavior trees, and LLM-driven NPC diplomacy.', 
      tools: ['OfflineAIEngineSuite', 'AIOfflineDownloader', 'AICommandCenter', 'LocalAIStudio', 'Workflow', 'BatchAIImporter', 'OmniAIAssistantStudio', 'SentientAI', 'MLAgents', 'BehaviorTree', 'AIBrowser', 'GOAP_Planner', 'NavMeshCrowd', 'LLM_Conversations', 'SteeringBehaviors', 'SensoryPerception', 'MCTSStrategyEngine', 'HierarchicalTaskNetwork', 'FuzzyLogicEmotion', 'ReynoldsBoids100k', 'DDASkillTracker', 'HNSWVectorSearch', 'AllMiniLMEmbedder', 'BM25LexicalSearch', 'SemanticChunker', 'ReRankerCrossEncoder'] 
    },
    { 
      id: 'uiux', title: 'UI/UX Prototypes & QA', icon: <LayoutDashboard />, color: 'text-teal-400', 
      desc: 'Absolute manual UI layout construction using Figma-style anchors, state machines, and UX cognitive analyzers.', 
      tools: ['FigmaStyleCanvas', 'FigmaClone', 'InteractionPrototyper', 'AccessibilityTester', 'UIUXEdit', 'FontEditor', 'VectorHybrid', 'UXCognitiveLoadSim', 'EyeTrackingHeatmap', 'StyleGraphNode', 'MobileSAMSegmenter', 'KMeansPaletteExtractor', 'MediaPipeHandGesture', 'BNFGrammarJSONValidator', 'DesignTokenCompiler', 'ResponsiveSimulator'] 
    },
    { 
      id: 'backend', title: 'Netcode & Multiplayer Topology', icon: <Wifi />, color: 'text-yellow-400', 
      desc: 'Deterministic lockstep, GGPO-style rollback netcode, UDP packet optimization, spatial partitioning, and dedicated servers.', 
      tools: ['Netcode', 'RelayServer', 'NetworkDebugger', 'ServerSim', 'RollbackCore', 'PacketSniffer', 'InterpolationSync', 'MatchmakingRank', 'VOIP_Server', 'DeterministicFixedPointVM', 'BitfieldStructPacker', 'LZ4ByteStreamCompressor', 'ZstdDictionaryCompressor', 'DeltaCompressionSync', 'LagCompensationHistorian', 'P2PRelayHolePuncher'] 
    },
    { 
      id: 'systems', title: 'Core Game Systems & Logic', icon: <Component />, color: 'text-indigo-400', 
      desc: 'Global state variable registries, complex branching dialogue weavers, and quest architecture logic.', 
      tools: ['BranchingDialogueWeaver', 'GameStateFlagTree', 'GameSystems', 'EconomicBalancer', 'EconomySimulator', 'StoryGraph', 'LootTableGen', 'SkillTreeBuilder', 'FactionReputation', 'CraftingRecipeDB', 'DamageFormulaCalc', 'ProceduralQuestGrammar', 'UtilityAIEvaluator', 'InMemSQLiteRegistry', 'KnowledgeGraphTriplets', 'SaveGameHMACShield', 'DialogueStatePersistence'] 
    },
    { 
      id: 'security', title: 'Kernel Security & Anti-Cheat', icon: <Shield />, color: 'text-red-500', 
      desc: 'Ring-0 kernel memory protection, heuristic aimbot detection, binary obfuscation, encryption, and payload delivery.', 
      tools: ['AntiCheat', 'EncryptionTool', 'HexInjector', 'HexEditor', 'MemoryScanner', 'ObfuscatorPass', 'HardwareBanDB', 'PayloadSigner', 'DRM_Wrapper', 'SaveGameHMACShield', 'DeterministicReplayVerifier', 'MemoryHookDetector', 'CodeIntegrityHasher', 'PointerEncryptionPass'] 
    },
    { 
      id: 'devops', title: 'Compile, CI/CD & Cloud Build', icon: <Cloud />, color: 'text-[#58a6ff]', 
      desc: 'Jenkins-style build pipelines, LLVM compiler flag tuning, cross-platform matrix export, version control, and CDN deployment.', 
      tools: ['CloudBuildPipeline', 'DevOpsBuilder', 'CompilerTool', 'DockerManager', 'BuildPublish', 'AssetStore', 'GitConflictMerge', 'CDN_Distributor', 'AutomatedTesting', 'GGUFQuantizerEngine', 'WebGPUKernelDispatcher', 'ONNXRuntimeWebEngine', 'AssetDeduplicationPass', 'CrossPlatformPackagePacker'] 
    },
    { 
      id: 'analytics', title: 'LiveOps & Telemetry Analytics', icon: <Radar />, color: 'text-emerald-400', 
      desc: 'Real-time player heatmaps, churn rate prediction models, granular A/B testing configurations, and massive crash log aggregators.', 
      tools: ['TelemetryAnalytics', 'LiveOps', 'LogViewer', 'SystemTap', 'PlayerHeatmap', 'MonetizationMetrics', 'AB_TestDeploy', 'CrashDumpAnalyzer', 'SystemResourceMonitor', 'HardwareResourceOptimizer', 'AttentionHeatmapTracker', 'CrashPatternTextRank', 'CohortRetentionEvaluator'] 
    },
    { 
      id: 'cinematics', title: 'Narrative & Cinematic Timeline', icon: <Clapperboard />, color: 'text-rose-400', 
      desc: 'Fully manual Non-Linear Editing (NLE), dope-sheet keyframing, multi-camera director tracking, and story continuity logic.', 
      tools: ['MasterNarrativeCinematicEditor', 'CinematicDirector', 'Sequencer', 'ActionRecorder', 'VideoEncoder', 'CameraRigRail', 'ColorGradingLUT', 'TimelineKeyframer', 'SubtitleSync', 'VirtualScouting', 'ACESccColorPipeline', 'FourierLensBokeh', 'SimplexFilmGrain', 'DopeSheetSplineInterpolation'] 
    }
  ];

  const filteredPillars = activeCategory === 'all' ? pillars : pillars.filter(p => p.id === activeCategory);

  return (
    <div className="w-full h-full bg-[#050505] text-white overflow-hidden relative flex flex-col font-sans">
      
      {/* Deep Background Matrix Graphic */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] -rotate-12 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]"></div>
         <div className="w-[1200px] h-[1200px] rounded-full border border-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_120s_linear_infinite] mix-blend-overlay"></div>
         <div className="w-[800px] h-[800px] rounded-full border-[2px] border-dashed border-[#58a6ff]/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_60s_linear_infinite_reverse]"></div>
      </div>

      {/* Main Content Area */}
      <div className="z-10 w-full h-full flex flex-col">
        
        {/* Header / Top Nav */}
        <div className="flex-shrink-0 border-b border-white/10 bg-black/60 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 shadow-2xl">
           <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-black border border-white/20 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#58a6ff] via-[#bc8cff] to-[#f85149] opacity-20 group-hover:opacity-50 transition-opacity"></div>
                  <Infinity size={28} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
               </div>
               <div>
                  <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                     OMNI CREATOR <span className="text-[#58a6ff]">MASTER</span> <span className="text-[10px] bg-[#f85149] text-white px-1.5 py-0.5 rounded uppercase tracking-widest font-bold ml-2">V 9.9.0</span>
                  </h1>
                  <p className="text-[#888] text-xs font-mono tracking-widest uppercase mt-1">Universal AAA Studio Architecture • 16 Core Subsystems • 140+ Micro-Modules</p>
               </div>
           </div>
           
           {/* Global Action Bar */}
           <div className="flex gap-3">
              <button className="bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 text-white px-4 py-2 rounded font-bold text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2">
                 <Terminal size={14}/> Engine Console
              </button>
              <button className="bg-[#58a6ff]/10 hover:bg-[#58a6ff]/20 border border-[#58a6ff]/50 text-[#58a6ff] px-4 py-2 rounded font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(88,166,255,0.2)] flex items-center gap-2">
                 <Activity size={14}/> Global Profiler
              </button>
              <button className="bg-gradient-to-r from-[#bc8cff] to-[#58a6ff] hover:opacity-90 text-white px-6 py-2 rounded font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(188,140,255,0.4)] flex items-center gap-2">
                 <Code2 size={14}/> Compile All
              </button>
           </div>
        </div>

        {/* Workspace Layout */}
        <div className="flex-1 overflow-hidden flex">
           
           {/* Left Sidebar - Domain Filters */}
           <div className="w-[260px] border-r border-white/10 bg-black/40 backdrop-blur-md shrink-0 flex flex-col p-4 overflow-y-auto custom-scrollbar">
              <div className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-3 px-2">Engineering Domains</div>
              
              <button 
                 onClick={() => setActiveCategory('all')}
                 className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-2 ${activeCategory === 'all' ? 'bg-white/10 text-white shadow-inner border border-white/10' : 'text-[#888] hover:bg-white/5 hover:text-white'}`}
              >
                 <LayoutDashboard size={16} className={activeCategory === 'all' ? 'text-white' : 'text-[#888]'}/>
                 All Domains Overview
              </button>

              <div className="space-y-1">
                 {pillars.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => setActiveCategory(p.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === p.id ? `bg-white/10 text-white shadow-inner border border-white/10` : 'text-[#888] hover:bg-white/5 hover:text-white'}`}
                    >
                       <div className={`${activeCategory === p.id ? p.color : 'text-[#555] group-hover:text-white'}`}>
                          {React.cloneElement(p.icon, { size: 16 })}
                       </div>
                       <span className="truncate text-left">{p.title}</span>
                    </button>
                 ))}
              </div>

              {/* Status Modules & Deep Telemetry */}
              <div className="mt-8 border-t border-white/5 pt-4 space-y-4">
                 
                 <div className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-1 px-2 border-b border-white/5 pb-2 flex items-center gap-2">
                    <Activity size={12}/> Live Micro-Telemetry
                 </div>

                 <SystemResourcesWidget />

                 {/* System Log Stream */}
                 <div className="bg-[#050505] border border-white/5 rounded p-2 h-32 overflow-hidden flex flex-col pt-1 relative">
                    <div className="absolute top-0 right-0 p-1 bg-black/80 z-10 text-[8px] text-[#3fb950] font-mono mix-blend-screen">LIVE LOG</div>
                    <div className="flex-1 font-mono text-[8px] leading-tight text-[#444] space-y-0.5 overflow-hidden flex flex-col justify-end pb-1">
                       <div className="text-[#555]">[SYS_TICK] Kernel heartbeat acknowledged.</div>
                       <div className="text-[#e3b341]">[WARN] NavMesh bounds recalculation delayed (0.4ms)</div>
                       <div className="text-[#3fb950]">[ASSET] Hot-reloaded compiled shader: MAT_Hero_Skin_SSS</div>
                       <div className="text-[#58a6ff]">[NET] UDP Socket established to relay cluster eu-west-3a</div>
                       <div className="text-[#bc8cff]">[RENDER] Ray-tracing BVH structure rebuilt successfully.</div>
                       <div className="text-[#f85149]">[ERR_NONFATAL] Missing audio bank mapping for event 'Footstep_Gravel_Heavy'</div>
                       <div className="text-[#555]">[AI_OPS] Behaviour Tree 'Sentient_Aggro' evaluated 420 nodes</div>
                       <div className="text-[#58a6ff] hover:text-white cursor-pointer bg-white/5">... Tail (Monitoring 4,129 events/sec) ...</div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right Content - Grid of Modules */}
           <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
              
              <div className={`grid gap-6 ${activeCategory === 'all' ? 'grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2'}`}>
                {filteredPillars.map(pillar => (
                  <div 
                    key={pillar.id}
                    className={`bg-[#0d0d11]/80 backdrop-blur-md border ${activeNode === pillar.id ? `border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.5)]` : 'border-white/5'} rounded-2xl p-6 transition-all duration-300 relative group overflow-hidden`}
                    onMouseEnter={() => setActiveNode(pillar.id)}
                    onMouseLeave={() => setActiveNode(null)}
                  >
                     {/* Hover Glow Background */}
                     <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}></div>
                     
                     <div className="flex gap-4 mb-4 relative z-10">
                        <div className={`w-14 h-14 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner ${pillar.color}`}>
                           {React.cloneElement(pillar.icon, { size: 28 })}
                        </div>
                        <div>
                           <h3 className="font-black text-xl tracking-tight text-white/90">{pillar.title}</h3>
                           <p className="text-[#777] text-xs leading-relaxed mt-1 line-clamp-2">
                             {pillar.desc}
                           </p>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mt-6 relative z-10">
                       {pillar.tools.map((t, idx) => (
                         <button 
                           key={t}
                           onClick={(e) => { e.stopPropagation(); onSelectTool?.(t); }}
                           className={`bg-black/40 hover:bg-[#1a1a24] border border-white/5 hover:border-white/20 text-[#aaa] hover:text-white px-3 py-2.5 rounded-lg transition-all flex flex-col items-start gap-1 group/btn w-full`}
                         >
                           <div className="flex items-center gap-2 w-full">
                              <Zap size={10} className={`${pillar.color} opacity-50 group-hover/btn:opacity-100`} /> 
                              <span className="text-[11px] font-bold truncate tracking-wide">{t.replace(/([A-Z])/g, ' $1').trim()}</span>
                           </div>
                           <div className="text-[8px] text-[#555] font-mono opacity-0 group-hover/btn:opacity-100 transition-opacity pl-4 truncate w-fulltext-left">Launch Module Context...</div>
                         </button>
                       ))}
                     </div>
                  </div>
                ))}
              </div>
              
              {/* Massive Empty Space for scrolling */}
              <div className="h-32"></div>
           </div>

        </div>
      </div>
    </div>
  );
}

