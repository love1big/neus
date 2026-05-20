const fs = require('fs');
let code = fs.readFileSync('src/components/MaterialEditor.tsx', 'utf-8');

// Add AI nodes
const newNodes = `
// AI Node: Generate PBR Material
const AIGeneratePBRNode = ({ data, id }: { data: any, id: string }) => {
  return (
    <div style={{...nodeStyle, borderColor: '#bc8cff', minWidth: '220px'}}>
      <Header title="AI Gen PBR Material" color="#bc8cff" />
      <div className="p-3 flex flex-col gap-2">
        <div className="text-[10px] text-[#8b949e]">Prompt (Material specs):</div>
        <textarea className="bg-[#0d1117] border border-[#30363d] rounded p-1 text-[10px] text-white w-full h-12 outline-none resize-none" defaultValue={data.prompt} placeholder="e.g. Rusted iron with dripping oil, grimy" onChange={(e) => data.onChange && data.onChange(e, id)}/>
        <button className="w-full bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 rounded py-1 text-[10px] my-1"> Generate Maps</button>
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-[#8b949e]">Base Color</span>
          <Handle type="source" position={Position.Right} id="baseColor" style={{ top: 120, background: '#58a6ff' }} />
        </div>
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-[#8b949e]">Normal</span>
          <Handle type="source" position={Position.Right} id="normal" style={{ top: 140, background: '#bc8cff' }} />
        </div>
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-[#8b949e]">Roughness</span>
          <Handle type="source" position={Position.Right} id="roughness" style={{ top: 160, background: '#a5d6ff' }} />
        </div>
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-[#8b949e]">Metallic</span>
          <Handle type="source" position={Position.Right} id="metallic" style={{ top: 180, background: '#e3b341' }} />
        </div>
      </div>
    </div>
  );
};

// AI Node: Create Material Instance
const AICreateMaterialInstanceNode = ({ data, id }: { data: any, id: string }) => {
  return (
    <div style={{...nodeStyle, borderColor: '#bc8cff', minWidth: '220px'}}>
      <Header title="AI Material Instance" color="#bc8cff" />
      <div className="p-3 flex flex-col gap-2">
        <div className="flex justify-between items-center text-[10px]">
          <Handle type="target" position={Position.Left} id="parent" style={{ top: 40, background: '#3fb950' }} />
          <span className="text-[#8b949e]">Parent Material</span>
        </div>
        <div className="text-[10px] text-[#8b949e]">Override Prompt:</div>
        <textarea className="bg-[#0d1117] border border-[#30363d] rounded p-1 text-[10px] text-white w-full h-12 outline-none resize-none" defaultValue={data.prompt} placeholder="e.g. Make it red and extremely shiny" onChange={(e) => data.onChange && data.onChange(e, id)}/>
        <button className="w-full bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 rounded py-1 text-[10px] my-1"> Apply Overrides</button>
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-[#8b949e]">Instance Output</span>
          <Handle type="source" position={Position.Right} id="out" style={{ top: 150, background: '#c9d1d9' }} />
        </div>
      </div>
    </div>
  );
};

// Node: Post Process Effects
const PostProcessNode = ({ data, id }: { data: any, id: string }) => {
  return (
    <div style={{...nodeStyle, minWidth: '220px'}}>
      <Header title="Post Process Adj." color="#ff7b72" />
      <div className="p-3 flex flex-col gap-2">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-[#8b949e]">Bloom Intensity</span>
          <input type="number" defaultValue="1.5" step="0.1" min="0" className="w-12 bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded px-1 py-1 text-right outline-none" />
        </div>
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-[#8b949e]">Tonemapper</span>
          <select className="w-20 bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded p-1 outline-none">
             <option>ACES</option>
             <option>Reinhard</option>
             <option>Cineon</option>
          </select>
        </div>
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-[#8b949e]">Color Grading</span>
          <input type="color" defaultValue="#ffffff" className="w-12 h-4 p-0 bg-[#0d1117] border border-[#30363d] rounded cursor-pointer" />
        </div>
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-[#8b949e]">Output PP</span>
          <Handle type="source" position={Position.Right} id="out" style={{ top: 115, background: '#ff7b72' }} />
        </div>
      </div>
    </div>
  );
};
`;

const nodeTypesIndex = code.indexOf('const nodeTypes = {');
code = code.slice(0, nodeTypesIndex) + newNodes + '\n' + code.slice(nodeTypesIndex);

const nodeTypesEndIndex = code.indexOf('};', nodeTypesIndex);
const addition = `
  aiGeneratePBR: AIGeneratePBRNode,
  aiMaterialInstance: AICreateMaterialInstanceNode,
  postProcess: PostProcessNode,
`;
const openingBraceIndex = code.indexOf('{', nodeTypesIndex);
code = code.slice(0, openingBraceIndex + 1) + addition + code.slice(openingBraceIndex + 1);

const topPanelIndex = code.indexOf('<button className="p-2 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] rounded border border-[#30363d]" title="Save"><Save size={14}/></button>');
if (topPanelIndex !== -1) {
   const applyBtn = `<button className="px-3 py-1 bg-[#238636] hover:bg-[#2ea043] text-white rounded font-bold text-[12px] flex items-center gap-1">Compile Shader</button>`;
   code = code.slice(0, topPanelIndex) + applyBtn + '\n' + code.slice(topPanelIndex);
}

const reqIndex = code.indexOf('export default function MaterialEditor(');
const onNodeClickIndex = code.indexOf('const onEdgesChange', reqIndex);
const inspectorState = `
  const [selectedNodeData, setSelectedNodeData] = useState<any>(null);
  const onNodeClick = useCallback((event: any, node: any) => setSelectedNodeData(node), []);
  const onPaneClick = useCallback(() => setSelectedNodeData(null), []);
`;
code = code.slice(0, onNodeClickIndex) + inspectorState + '\n' + code.slice(onNodeClickIndex);

const reactFlowIndex = code.indexOf('<ReactFlow');
if(reactFlowIndex !== -1) {
  code = code.replace('<ReactFlow', '<ReactFlow onNodeClick={onNodeClick} onPaneClick={onPaneClick}');
}

const InspectorJSX = `
      {/* Inspector Panel */}
      {selectedNodeData && (
         <Panel position="top-right" className="mt-12 w-64 bg-[#161b22] border border-[#30363d] rounded-lg shadow-2xl flex flex-col pointer-events-auto z-50">
            <div className="p-3 border-b border-[#30363d] bg-[#0d1117] rounded-t-lg font-bold text-white text-[12px] flex items-center gap-2">
               <Settings size={14} className="text-[#8b949e]" /> Inspector: {selectedNodeData.type}
            </div>
            <div className="p-3 flex flex-col gap-3 overflow-y-auto max-h-[300px] text-[11px] text-[#c9d1d9]">
               <div className="flex justify-between items-center border-b border-[#30363d] pb-1">
                 <span className="text-[#8b949e]">Name/ID</span>
                 <span className="text-white font-mono break-all w-32 text-right">{selectedNodeData.id}</span>
               </div>
               
               {selectedNodeData.type === 'texture' && (
                 <div className="flex flex-col gap-1">
                   <span className="text-[#8b949e]">File Name</span>
                   <input type="text" className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-white" defaultValue={selectedNodeData.data.fileName || 'texture.png'} />
                   <span className="text-[#8b949e] mt-1">Wrap Mode</span>
                   <select className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-white">
                     <option>Repeat</option>
                     <option>Clamp</option>
                   </select>
                 </div>
               )}

               {selectedNodeData.type === 'constant' && (
                 <div className="flex justify-between items-center">
                   <span className="text-[#8b949e]">Value</span>
                   <input type="number" className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-white w-16 text-right" defaultValue={selectedNodeData.data.value} />
                 </div>
               )}

               {selectedNodeData.type === 'pbrMaster' && (
                  <div className="text-[#8b949e] text-[10px]">
                    Master output node. Properties can be overridden here.
                  </div>
               )}
            </div>
         </Panel>
      )}
`;

const backgroundIndex = code.indexOf('<Background color="#30363d" />');
if(backgroundIndex !== -1) {
  code = code.slice(0, backgroundIndex) + '\n' + InspectorJSX + '\n' + code.slice(backgroundIndex);
}

fs.writeFileSync('src/components/MaterialEditor.tsx', code);
console.log('MaterialEditor updated successfully');
