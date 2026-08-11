import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Activity, Cpu, MonitorPlay, Zap, ArrowRight, Settings2, BarChart2, X, Code, BookOpen} from 'lucide-react';
import OptimizationEncyclopedia from './OptimizationEncyclopedia';

export default function OptimizationOverview() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [activeMainTab, setActiveMainTab] = useState<'profiler' | 'database'>('database');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);
  const [cppModalNode, setCppModalNode] = useState<string | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    
    // Clear previous
    d3.select(chartRef.current).selectAll('*').remove();

    const width = chartRef.current.clientWidth;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background', '#0a0a0a')
      .style('border-radius', '8px')
      .style('border', '1px solid #222');

    // Mock data for CPU and GPU node bottlenecks
    const data = [
      { nodeName: 'Physics.Raycast', cpuCost: 4.2, gpuCost: 0.1, calls: 420 },
      { nodeName: 'Physics.KinematicSolve', cpuCost: 6.5, gpuCost: 0.4, calls: 12500 },
      { nodeName: 'Memory.TieredStoragePool', cpuCost: 14.8, gpuCost: 0.2, calls: 850 },
      { nodeName: 'Render.ShadowMaps', cpuCost: 1.2, gpuCost: 18.5, calls: 6 },
      { nodeName: 'NavMesh.FindPath', cpuCost: 3.8, gpuCost: 0.0, calls: 12 },
      { nodeName: 'PostProcess.Bloom', cpuCost: 0.3, gpuCost: 5.6, calls: 1 },
      { nodeName: 'UpdateAnimation', cpuCost: 2.1, gpuCost: 0.8, calls: 54 },
      { nodeName: 'VolumetricClouds', cpuCost: 0.5, gpuCost: 4.2, calls: 1 },
      { nodeName: 'PipelineEditor.GraphSync', cpuCost: 17.8, gpuCost: 2.1, calls: 1 },
      { nodeName: 'ComputeShader', cpuCost: 0.1, gpuCost: 3.5, calls: 8 },
      { nodeName: 'Script.Tick', cpuCost: 2.5, gpuCost: 0.0, calls: 128 },
    ];

    // Sort by total cost
    data.sort((a, b) => (b.cpuCost + b.gpuCost) - (a.cpuCost + a.gpuCost));

    const x = d3.scaleBand()
      .domain(data.map(d => d.nodeName))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const maxCost = d3.max(data, d => d.cpuCost + d.gpuCost) || 10;
    const maxY = Math.max(maxCost * 1.1, 20); // Ensure 16.6 fits
    
    const y = d3.scaleLinear()
      .domain([0, maxY])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Grid lines
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right).tickFormat(() => ""))
      .style('stroke-dasharray', '3 3')
      .style('stroke', '#222')
      .style('opacity', 0.5);

    // X Axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-30)')
      .style('text-anchor', 'end')
      .style('fill', '#888')
      .style('font-size', '11px')
      .style('font-family', 'monospace');

    // Y Axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + 'ms'))
      .selectAll('text')
      .style('fill', '#888')
      .style('font-size', '11px')
      .style('font-family', 'monospace');

    // Remove domain lines
    svg.selectAll('.domain').remove();

    // Threshold Line
    if (auditComplete) {
      svg.append('line')
        .attr('x1', margin.left)
        .attr('y1', y(16.6))
        .attr('x2', width - margin.right)
        .attr('y2', y(16.6))
        .style('stroke', '#f85149')
        .style('stroke-width', 2)
        .style('stroke-dasharray', '4 4')
        .style('opacity', 0)
        .transition()
        .duration(500)
        .style('opacity', 1);
        
      svg.append('text')
        .attr('x', width - margin.right - 5)
        .attr('y', y(16.6) - 5)
        .attr('text-anchor', 'end')
        .style('fill', '#f85149')
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .text('16.6ms THRESHOLD');
    }

    // CPU Rectangles
    svg.append('g')
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.nodeName) || 0)
      .attr('y', d => y(d.cpuCost))
      .attr('width', x.bandwidth())
      .attr('height', d => y(0) - y(d.cpuCost))
      .attr('fill', d => (auditComplete && d.cpuCost > 16.6) ? '#f85149' : '#58a6ff')
      .attr('rx', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', function(e, d) {
        d3.select(this).style('filter', 'brightness(1.5)');
        setSelectedNode(d.nodeName);
      })
      .on('mouseleave', function() {
        d3.select(this).style('filter', 'none');
        setSelectedNode(null);
      });

    // GPU Rectangles (stacked on top of CPU)
    svg.append('g')
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.nodeName) || 0)
      .attr('y', d => y(d.cpuCost + d.gpuCost))
      .attr('width', x.bandwidth())
      .attr('height', d => y(d.cpuCost) - y(d.cpuCost + d.gpuCost))
      .attr('fill', d => (auditComplete && (d.cpuCost + d.gpuCost) > 16.6 && d.cpuCost <= 16.6) ? '#f85149' : '#3fb950')
      .attr('rx', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', function(e, d) {
        d3.select(this).style('filter', 'brightness(1.5)');
        setSelectedNode(d.nodeName);
      })
      .on('mouseleave', function() {
        d3.select(this).style('filter', 'none');
        setSelectedNode(null);
      });
      
    // Value labels
    svg.append('g')
      .selectAll('text.val-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'val-label')
      .attr('x', d => (x(d.nodeName) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.cpuCost + d.gpuCost) - 8)
      .attr('text-anchor', 'middle')
      .style('fill', d => (auditComplete && (d.cpuCost + d.gpuCost) > 16.6) ? '#f85149' : '#ccc')
      .style('font-size', '10px')
      .style('font-family', 'monospace')
      .style('font-weight', d => (auditComplete && (d.cpuCost + d.gpuCost) > 16.6) ? 'bold' : 'normal')
      .text(d => (d.cpuCost + d.gpuCost).toFixed(1) + 'ms');

  }, [auditComplete]);

  const runAudit = () => {
    setIsAuditing(true);
    setAuditComplete(false);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditComplete(true);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-sans">
      <div className="flex items-center px-6 py-4 border-b border-[#30363d] bg-[#161b22] shrink-0 justify-between">
        <div className="flex items-center">
          <Activity className="text-[#3fb950] mr-3" size={24} />
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-[#f0f6fc]">Optimization Overview</h2>
            <div className="text-[12px] text-[#8b949e]">Frame Time & Node Bottleneck Profiler</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[#21262d] p-1 rounded-lg border border-[#30363d] shadow-inner">
             <button onClick={() => setActiveMainTab('profiler')} className={`px-3 py-1.5 text-[12px] font-bold rounded flex items-center gap-2 transition-colors ${activeMainTab === 'profiler' ? 'bg-[#3fb950]/20 text-[#3fb950]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}><Activity size={14}/> Frame Profiler</button>
             <button onClick={() => setActiveMainTab('database')} className={`px-3 py-1.5 text-[12px] font-bold rounded flex items-center gap-2 transition-colors ${activeMainTab === 'database' ? 'bg-[#a371f7]/20 text-[#a371f7]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}><BookOpen size={14}/> Optimization Matrix</button>
          </div>
          {activeMainTab === 'profiler' && (
            <button 
              onClick={runAudit}
              disabled={isAuditing}
              className="flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] disabled:opacity-50 text-[#c9d1d9] px-4 py-2 rounded-md font-semibold text-[13px] transition-colors"
            >
              {isAuditing ? <Zap size={16} className="text-[#e3b341] animate-pulse" /> : <Zap size={16} className="text-[#3fb950]" />}
              {isAuditing ? 'Auditing...' : 'Run Performance Audit'}
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
        {activeMainTab === 'database' && (
           <OptimizationEncyclopedia />
        )}

        {activeMainTab === 'profiler' && (
          <>
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[#8b949e] text-[11px] uppercase tracking-wider mb-1 font-bold">Total Frame Time</div>
              <div className="text-2xl font-mono font-bold text-[#f0f6fc]">13.8<span className="text-[14px] text-[#8b949e] ml-1">ms</span></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#1a2332] border border-[#58a6ff]/30 flex items-center justify-center">
              <Zap className="text-[#58a6ff]" size={20} />
            </div>
          </div>
          
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[#8b949e] text-[11px] uppercase tracking-wider mb-1 font-bold">CPU Main Thread</div>
              <div className="text-2xl font-mono font-bold text-[#58a6ff]">8.5<span className="text-[14px] text-[#8b949e] ml-1">ms</span></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#1a2332] border border-[#58a6ff]/30 flex items-center justify-center">
              <Cpu className="text-[#58a6ff]" size={20} />
            </div>
          </div>
          
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[#8b949e] text-[11px] uppercase tracking-wider mb-1 font-bold">GPU Render Thread</div>
              <div className="text-2xl font-mono font-bold text-[#3fb950]">5.3<span className="text-[14px] text-[#8b949e] ml-1">ms</span></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#1e2a22] border border-[#3fb950]/30 flex items-center justify-center">
              <MonitorPlay className="text-[#3fb950]" size={20} />
            </div>
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <div className="flex items-center justify-between bg-[#161b22] px-4 py-2 rounded-t-lg border border-[#30363d] border-b-0">
              <div className="flex items-center gap-2">
                <BarChart2 size={16} className="text-[#8b949e]" />
                <span className="text-[14px] font-medium text-[#c9d1d9]">Expensive Nodes Breakdown</span>
              </div>
              <div className="flex items-center gap-4 text-[12px]">
                <div className="flex items-center gap-1.5 justify-center">
                  <div className="w-3 h-3 rounded-sm bg-[#58a6ff]"></div>
                  <span className="text-[#8b949e]">CPU</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center">
                  <div className="w-3 h-3 rounded-sm bg-[#3fb950]"></div>
                  <span className="text-[#8b949e]">GPU</span>
                </div>
              </div>
            </div>
            <div className="w-full h-[400px] rounded-lg relative bg-[#0a0a0a] border border-[#30363d] shadow-inner flex shrink-0" style={{borderTopLeftRadius: 0, borderTopRightRadius: 0, marginTop: '-16px'}} ref={chartRef}>
              {/* D3 chart will be injected here */}
            </div>
          </div>

          {/* Node Inspector Side Panel */}
          <div className="w-full xl:w-[320px] bg-[#161b22] border border-[#30363d] rounded-lg flex flex-col shrink-0 shadow-sm">
            <div className="px-4 py-3 border-b border-[#30363d] bg-[#1a1f26] rounded-t-lg flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#f0f6fc]">Node Inspector</span>
              <Settings2 size={14} className="text-[#8b949e]" />
            </div>
            
            <div className="p-4 flex-1">
              {!selectedNode ? (
                <div className="h-full flex flex-col items-center justify-center text-[#8b949e] border-2 border-dashed border-[#30363d] rounded-lg p-6 text-center">
                   <Activity size={32} className="mb-3 opacity-50"/>
                   <span className="text-[13px]">Hover over a node in the graph to view execution details.</span>
                </div>
              ) : (
                <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                  <div className="bg-[#0a0a0a] p-3 rounded border border-[#30363d]">
                     <div className="text-[10px] text-[#8b949e] uppercase tracking-wider font-bold mb-1">Target Node</div>
                     <div className="text-[14px] text-[#f0f6fc] font-mono break-all font-semibold">{selectedNode}</div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="text-[#8b949e]">Execution Frequency</span>
                      <span className="text-[#c9d1d9] font-mono bg-[#222] px-2 py-0.5 rounded">Per Tick</span>
                    </div>
                    {auditComplete && selectedNode === 'PipelineEditor.GraphSync' && (
                      <div className="flex justify-between items-center text-[12px]">
                        <span className="text-[#8b949e]">Audit Status</span>
                        <span className="text-[#f85149] font-mono font-bold bg-[#f85149]/10 px-2 py-0.5 rounded border border-[#f85149]/20">FAILED (EXCEEDS 16.6ms)</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="text-[#8b949e]">Cache Misses</span>
                      <span className="text-[#f85149] font-mono font-bold">14.2%</span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="text-[11px] text-[#8b949e] uppercase tracking-widest font-bold mb-2">Optimization Tips</div>
                    <div className="bg-[#1a2332] border border-[#58a6ff]/30 p-3 rounded-lg flex gap-3 items-start">
                       <ArrowRight size={14} className="text-[#58a6ff] shrink-0 mt-0.5" />
                       <div className="text-[12px] text-[#c9d1d9] leading-relaxed">
                          {selectedNode.includes('KinematicSolve') ? 'CRITICAL: Iterative integration is choking the CPU/NPU pipelines. Suggest refactoring to closed-form Analytic Mathematical Equations.' :
                           selectedNode.includes('Physics') ? 'Consider switching to simplified collision hulls or reducing tick rate.' :
                           selectedNode.includes('Memory') ? 'CRITICAL: RAM is exhausted, causing OS-level thrashing and Page Faults. Please implement a Custom Virtual Memory Manager (DirectStorage / NVMe streaming) to stabilize data usage.' :
                           selectedNode.includes('ShadowMaps') ? 'CRITICAL: Standard cascaded shadow maps are consuming massive VRAM and memory bandwidth. Enable Virtual Shadow Maps (VSM) to cache and page high-res shadows dynamically.' :
                           selectedNode.includes('PipelineEditor') ? 'CRITICAL: This node is severely blocking the main thread. It exceeds the 16.6ms frame budget. Please move this graph synchronization to a worker thread or chunk the updates.' :
                           selectedNode.includes('GPU') || selectedNode.includes('PostProcess') ? 'PostProcess pipeline is heavy. You can disable Bloom passes on lower settings.' :
                           'This node is CPU bound. Suggest caching output values or converting logic to C++.'}
                       </div>
                    </div>
                  </div>
                  
                  {selectedNode.includes('PipelineEditor') || selectedNode.includes('Physics') || selectedNode.includes('Memory') || selectedNode.includes('ShadowMaps') ? (
                    <button 
                      onClick={() => setCppModalNode(selectedNode)}
                      className="mt-4 w-full bg-[#f85149]/20 hover:bg-[#f85149]/30 border border-[#f85149]/30 transition-colors text-[#f85149] py-1.5 rounded text-[12px] font-bold shadow-sm flex items-center justify-center gap-2"
                    >
                      <Code size={14} /> View C++ Refactor
                    </button>
                  ) : (
                    <button className="mt-4 w-full bg-[#238636] hover:bg-[#2ea043] transition-colors text-white py-1.5 rounded text-[12px] font-bold shadow-sm">
                      Open in Node Editor
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

      {/* C++ Refactor Modal */}
      {cppModalNode && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
           <div className="bg-[#0d1117] border border-[#30363d] rounded-xl shadow-2xl w-[1000px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
               <div className="flex justify-between items-center px-4 py-3 border-b border-[#30363d] bg-[#161b22]">
                  <div className="flex items-center gap-2">
                     <Code size={18} className="text-[#58a6ff]"/>
                     <span className="font-bold text-[#c9d1d9]">Optimized C++ Implementation: {cppModalNode}</span>
                  </div>
                  <button onClick={() => setCppModalNode(null)} className="text-[#8b949e] hover:text-white">
                     <X size={18} />
                  </button>
               </div>
               <div className="p-4 flex gap-4 overflow-hidden h-[500px]">
                  {/* Before */}
                  <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a] border border-[#30363d] rounded-lg">
                     <div className="p-2 border-b border-[#30363d] text-[11px] font-bold text-[#f85149] uppercase flex items-center justify-between bg-[#161b22]">
                        <span>Before ({cppModalNode.includes('KinematicSolve') ? 'Iterative Integration (High NPU/CPU Load)' : cppModalNode.includes('Raycast') ? 'O(N) Bruteforce' : cppModalNode.includes('Memory') ? 'OS Pagefile Thrashing (Blind Swap)' : cppModalNode.includes('ShadowMaps') ? 'Cascaded Shadow Maps (High VRAM)' : 'Main Thread Blocking'})</span>
                        <span className="bg-[#f85149]/10 px-2 py-0.5 rounded">Cost: {cppModalNode.includes('KinematicSolve') ? '~6.5ms' : cppModalNode.includes('Raycast') ? '~4.2ms' : cppModalNode.includes('Memory') ? '~14.8ms' : cppModalNode.includes('ShadowMaps') ? '~18.5ms' : '~17.8ms'}</span>
                     </div>
                     <pre className="p-4 overflow-auto text-[11px] font-mono text-[#c9d1d9] custom-scrollbar">
{cppModalNode.includes('ShadowMaps') ? `void URenderer::RenderShadows()
{
    // CASCADED SHADOW MAPS (CSM) - Extremely heavy memory bandwidth.
    // Constantly redrawing the entire scene from the light's perspective.
    TRACE_CPUPROFILER_EVENT_SCOPE(Render_ShadowMaps_CSM);
    
    for (int32 CascadeIndex = 0; CascadeIndex < 4; ++CascadeIndex)
    {
        // 1. Clear the massive high-res shadow texture in VRAM
        ClearRenderTarget(ShadowMap[CascadeIndex]);
        
        // 2. Render EVERY dynamic and static object into the shadow map
        // This causes extreme GPU draw call overhead and memory bus saturation
        for (const UMeshRenderer* Mesh : VisibleMeshes)
        {
            DrawShadowPass(Mesh, LightCamera[CascadeIndex]);
        }
    }
}` : cppModalNode.includes('Memory') ? `void* FMemoryManager::AllocateAsset(size_t BlockSize)
{
    // OS-LEVEL VIRTUAL MEMORY ALLOCATION
    // Extremely dangerous when RAM is full. Thrashing occurs.
    TRACE_CPUPROFILER_EVENT_SCOPE(Memory_OS_Pagefile_Thrash);
    
    // Engine blindly requests memory from the OS
    void* Ptr = malloc(BlockSize);
    
    if (!Ptr)
    {
        // Out of Memory Error! Application crash.
        // Or if the OS has a pagefile, it halts the CPU thread 
        // to blindly swap data to the slow HDD in 4KB chunks.
        // This causes catastrophic 14.8ms+ frame drops.
        FatalError("Out of video/system RAM!"); 
    }
    
    return Ptr;
}` : cppModalNode.includes('KinematicSolve') ? `void UPhysicsEngine::UpdateProjectiles(float DeltaTime)
{
    // NUMERICAL EULER INTEGRATION (Iterative)
    // EXTREMELY heavy for 12,500+ active objects. 
    // Causes bottleneck because it fetches memory sequentially per-frame.
    TRACE_CPUPROFILER_EVENT_SCOPE(Physics_KinematicSolve_Iterative);
    
    for (int32 i = 0; i < ActiveProjectiles.Num(); ++i)
    {
        // 1. Memory stall (Cache Miss) on every iteration
        FProjectile& Proj = ActiveProjectiles[i];
        
        // 2. Requires simulating every frame step-by-step
        // If FPS drops, the integration loses accuracy (tunneling effect)
        FVector DragForce = -Proj.Velocity * Proj.DragCoefficient;
        FVector Acceleration = GravityVector + DragForce;
        
        Proj.Velocity += Acceleration * DeltaTime;
        Proj.Position += Proj.Velocity * DeltaTime;
        
        // 3. Collision tree polled continuously even in empty space
        CheckCollisions(Proj);
    }
}` : cppModalNode.includes('Raycast') ? `bool UPhysicsEngine::Raycast(FVector Start, FVector End, FHitResult& OutHit)
{
    // O(N) Search - BLOCKING GAMETHREAD 4.2ms+
    TRACE_CPUPROFILER_EVENT_SCOPE(Physics_Raycast_O_N);
    
    float ClosestDist = MAX_FLT;
    bool bHit = false;

    // Checks EVERY collider in the entire game world
    for (const UCollider* Collider : AllCollidersInWorld)
    {
        FHitResult TempHit;
        if (Collider->LineTrace(Start, End, TempHit))
        {
            if (TempHit.Distance < ClosestDist)
            {
                ClosestDist = TempHit.Distance;
                OutHit = TempHit;
                bHit = true;
            }
        }
    }
    
    return bHit;
}` : `void UPipelineEditor::GraphSync()
{
    // BLOACKS GAME THREAD 17.8ms+
    TRACE_CPUPROFILER_EVENT_SCOPE(PipelineEditor_GraphSync);

    for (const UNode* Node : AllGraphNodes)
    {
        // 1. Synchronous I/O or Heavy State Parsing
        FGraphState State = ParseNodeState(Node);
        
        // 2. Allocating complex textures inline on GameThread
        GenerateNodeThumbnail(Node);
        
        // 3. Compile Shaders / Resolves Pointers
        Node->RecompileDependencies();
    }
    
    UpdateUI();
}`}
                     </pre>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center text-[#8b949e]">
                     <ArrowRight size={24} />
                  </div>

                  {/* After */}
                  <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a] border border-[#30363d] rounded-lg relative overflow-hidden">
                     <div className="p-2 border-b border-[#30363d] text-[11px] font-bold text-[#3fb950] uppercase flex items-center justify-between bg-[#161b22]">
                        <span>After ({cppModalNode.includes('KinematicSolve') ? 'Continuous Analytic Equation (SIMD / NPU Tensor)' : cppModalNode.includes('Raycast') ? 'O(log N) BVH / Spatial Hash' : cppModalNode.includes('Memory') ? 'NVMe DirectStorage Tiering' : cppModalNode.includes('ShadowMaps') ? 'Virtual Shadow Maps (VSM)' : 'Async Worker Thread'})</span>
                        <span className="bg-[#3fb950]/10 px-2 py-0.5 rounded">Cost: {cppModalNode.includes('KinematicSolve') ? '~0.02ms' : cppModalNode.includes('Raycast') ? '~0.05ms' : cppModalNode.includes('Memory') ? '~0.2ms' : cppModalNode.includes('ShadowMaps') ? '~1.2ms' : '~0.1ms'} (Main)</span>
                     </div>
                     <pre className="p-4 overflow-auto text-[11px] font-mono text-[#c9d1d9] custom-scrollbar">
{cppModalNode.includes('ShadowMaps') ? `void URenderer::RenderShadowsOptimized()
{
    // VIRTUAL SHADOW MAPS (VSM) - Constant memory footprint, extreme resolution
    // Only caches high-res shadows in one massive 16k x 16k virtual texture, 
    // paging the 128x128 pixel tiles to physical memory ONLY if visible on-screen.
    TRACE_CPUPROFILER_EVENT_SCOPE(Render_VirtualShadowMaps);
    
    // 1. Evaluate camera frustum and identify which virtual shadow pages are visible
    TArray<FVirtualPage> NeededPages = RequestVisibleShadowPages(MainCamera);
    
    for (const FVirtualPage& Page : NeededPages)
    {
        // 2. Only strictly render tiles that are new or invalidated by movement
        if (Page.IsInvalidated() || !Page.IsCachedInVRAM())
        {
            // Paging allocation takes ~0.1ms per tile
            AllocatePhysicalTile(Page);
            
            // Render only intersecting geometry into this specific 128x128 tile
            DrawTileShadowPass(Page);
        }
    }
    
    // Static objects' shadows are never redrawn. They just persist in VRAM.
}` : cppModalNode.includes('Memory') ? `void* FMemoryManager::AllocateTiered(size_t BlockSize, EAssetPriority Priority)
{
    // CUSTOM VIRTUAL MEMORY MANAGER WITH NVMe TIERING
    // Seamlessly handles RAM overflows without crashing or OS thrashing.
    TRACE_CPUPROFILER_EVENT_SCOPE(Memory_NVMe_Tiered_Allocation);
    
    // 1. Check if Fast LPDDR/VRAM is full
    if (RamPool->GetFreeSpace() < BlockSize)
    {
        // 2. Identify the lowest-priority, least-recently-used asset
        // (e.g., textures behind the camera, audio clips not playing)
        FMemoryBlock* LRUBlock = RamPool->FindEvictionCandidates(BlockSize);
        
        // 3. ASYNCHRONOUS PAGING TO SSD/HDD
        // Instruct NVMe DMA controller to offload the cold block to SSD.
        // This takes 0 CPU cycles because it uses PCI-e DirectStorage.
        AsyncStoragePool->Evict(LRUBlock, EDiskTier::NVMe_Gen5);
        
        // Mark the block table so the engine knows it's on disk,
        // and return the immediately freed RAM to the requester.
        return LRUBlock->MemoryAddress; 
    }
    
    // Plenty of RAM, instant allocation
    return RamPool->Allocate(BlockSize);
}` : cppModalNode.includes('KinematicSolve') ? `void UPhysicsEngine::UpdateProjectilesOptimized(float CurrentTime)
{
    // CLOSED-FORM ANALYTIC RESOLUTION WITH SIMD (AVX-512)
    // O(1) processing per object, completely bypassing iterative integration.
    // Zero dependencies on DeltaTime. Solved continuously.
    TRACE_CPUPROFILER_EVENT_SCOPE(Physics_KinematicSolve_Analytic_SIMD);
    
    // We only evaluate physics EXACTLY when rendered or upon intersection.
    // 8x Vectorization: Process 8 projectiles simultaneously using CPU AVX registers
    // Assumes Data Oriented Design (Structure of Arrays - SoA mapping)
    int32 VectorizedNum = ActiveProjectiles.Num() / 8;
    
    for (int32 i = 0; i < VectorizedNum; ++i)
    {
        // 1. Load 8 objects into 512-bit registers directly from packed arrays
        __m512 t = _mm512_sub_ps(_mm512_set1_ps(CurrentTime), _mm512_load_ps(&SpawnTime_AVX[i*8]));
        __m512 k = _mm512_load_ps(&DragCoefficient_AVX[i*8]);
        
        // Exact Mathematical Formula mapping terminal velocity and exponential decay:
        // Position(t) = P0 + (V0/k + g/k^2) * (1 - e^(-k*t)) - (g/k) * t
        
        // 2. Calculate exponential decay curve natively in SIMD math hardware
        __m512 minus_kt = _mm512_mul_ps(_mm512_sub_ps(_mm512_setzero_ps(), k), t);
        __m512 exp_kt = _mm512_exp_ps(minus_kt); // Fused hardware exponential
        __m512 inv_exp = _mm512_sub_ps(_mm512_set1_ps(1.0f), exp_kt);
        
        // 3. Fused Multiply-Add (FMA) for trajectory resolution in 1 hardware cycle
        __m512 terminal_v = _mm512_fmadd_ps(Gravity_AVX, _mm512_rcp_ps(_mm512_mul_ps(k,k)), _mm512_div_ps(InitialV_AVX[i*8], k));
        
        // 4. Store pure geometric path directly to GPU mapped buffer (zero-copy)
        // No memory stalls. Physics engine writes directly to VRAM renderer.
        _mm512_store_ps(&ProjectedPaths[i*8], ...);
    }
}` : cppModalNode.includes('Raycast') ? `bool UPhysicsEngine::RaycastOptimized(FVector Start, FVector End, FHitResult& OutHit)
{
    // O(log N) Bounding Volume Hierarchy (BVH) Traversal
    TRACE_CPUPROFILER_EVENT_SCOPE(Physics_Raycast_BVH);
    
    float ClosestDist = MAX_FLT;
    bool bHit = false;

    // 1. Fast early-out using the broadphase AABB tree
    TArray<const UCollider*> PotentialColliders;
    PhysicsBVHTree->QueryRay(Start, End, PotentialColliders);
    
    // 2. Exact narrowphase ONLY on colliders within the ray's bounding volume
    for (const UCollider* Collider : PotentialColliders)
    {
        FHitResult TempHit;
        if (Collider->LineTrace(Start, End, TempHit))
        {
            if (TempHit.Distance < ClosestDist)
            {
                ClosestDist = TempHit.Distance;
                OutHit = TempHit;
                bHit = true;
            }
        }
    }
    
    return bHit;
}` : `void UPipelineEditor::GraphSyncOptimized()
{
    // Dispatch to Background Pool - O(1) on GameThread
    AsyncTask(ENamedThreads::AnyBackgroundThreadNormalTask, [this]()
    {
        TArray<FGraphState> CompiledStates;
        
        // Compute computationally heavy tasks asynchronously
        for (const UNode* Node : AllGraphNodes)
        {
            CompiledStates.Add(ParseNodeState(Node));
            Node->RecompileDependenciesOffThread();
        }

        // Return back to GameThread ONLY for UI/Visual updates 
        // that require Main Thread context.
        AsyncTask(ENamedThreads::GameThread, [this, CompiledStates]()
        {
            for (const FGraphState& State : CompiledStates)
            {
                ApplyStateToUI(State);
            }
        });
    });
}`}
                     </pre>
                  </div>
               </div>
               <div className="p-4 bg-[#161b22] border-t border-[#30363d] text-[12px] text-[#8b949e]">
                 {cppModalNode.includes('KinematicSolve') ? 
                   <><strong className="text-white">Analysis:</strong> By converting standard numerical frame-by-frame integration (Euler/Verlet) into a deterministic <code className="text-[#3fb950]">Continuous Closed-Form Analytic Equation</code> packed via Structure-of-Arrays (SoA), we completely bypass iterative DeltaTime accumulation. Utilizing AVX-512 SIMD vectorization and NPU Tensor cores for fused exponential decay limits, we evaluate massive sets of objects perfectly in continuous time. This eradicates CPU cache-miss stalls and drastically shrinks physical computing overhead from <span className="text-[#f85149]">6.5ms</span> down to <span className="text-[#3fb950]">0.02ms</span>, ensuring pixel-perfect trajectories and flawless collisions regardless of FPS drops.</>
                 : cppModalNode.includes('Memory') ? 
                   <><strong className="text-white">Analysis:</strong> By implementing an asynchronous <code className="text-[#3fb950]">Tiered DirectStorage Pool</code>, the engine monitors RAM limits pre-emptively. When memory gets tight, it ejects cold assets to tiered storage (HDD or NVMe SSDs) via hardware DMA over the PCI-e bus. This prevents the OS from brutally thrashing the CPU with page-faults (saving <span className="text-[#f85149]">14.8ms</span>), ensuring absolute framerate stability and unbroken gameplay even on highly constrained hardware configurations.</>
                 : cppModalNode.includes('ShadowMaps') ? 
                   <><strong className="text-white">Analysis:</strong> By converting standard Cascaded Shadow Maps into a <code className="text-[#3fb950]">Sparse Virtual Shadow Map</code>, we completely decouple shadow resolution from memory usage. The renderer treats an entire 16k x 16k shadow texture as virtual pages, only mapping the exact 128x128 pixel tiles that intersect the camera's viewport into physical VRAM. Because static objects cache their pages permanently, the GPU only redraws tiles containing moving objects. This eradicates GPU draw-call bottlenecks and slices VRAM usage exponentially, dropping frame cost from <span className="text-[#f85149]">18.5ms</span> down to <span className="text-[#3fb950]">1.2ms</span>.</>
                 : cppModalNode.includes('Raycast') ? 
                   <><strong className="text-white">Analysis:</strong> Transitioning from O(N) array iteration to an O(log N) <code className="text-[#58a6ff]">PhysicsBVHTree</code> (Bounding Volume Hierarchy) ensures we only perform expensive ray-triangle intersection math on objects that actually lie within the ray's path. This reduces Raycast overhead from <span className="text-[#f85149]">4.2ms</span> down to <span className="text-[#3fb950]">0.05ms</span>.</>
                 : 
                   <><strong className="text-white">Analysis:</strong> By offloading the monolithic loop to <code className="text-[#58a6ff]">FAsyncTask</code>, we free up to 17.8ms on the Game Thread, preventing the hitch entirely. We then marshal only the final UI updates back to <code className="text-[#3fb950]">ENamedThreads::GameThread</code> safely.</>
                 }
               </div>
           </div>
        </div>
      )}
      </>
        )}
      </div>
    </div>
  );
}
