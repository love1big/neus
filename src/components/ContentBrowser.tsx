import React, { useState, useRef, useCallback } from 'react';
import { FolderTree, Mountain, PersonStanding, Palette, Image, Music, Box, File as FileIcon, Search, UploadCloud, Trash2, ShieldCheck, FolderPlus, FilePlus, Network, Sparkles, Loader2, Database, Cog, X, Save, Settings2, Sliders} from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: 'mat' | 'tex' | 'skm' | 'wav' | 'bp' | 'fbx' | 'obj' | 'any' | 'meta';
  folderId: string;
}

interface AssetFolder {
  id: string;
  name: string;
  parentId: string | null;
  icon?: any;
}

export default function ContentBrowser({ onOpenBlueprint }: { onOpenBlueprint?: () => void }) {
  const [folders, setFolders] = useState<AssetFolder[]>([
    { id: '1', name: 'CoreAssets', parentId: null, icon: FolderTree },
    { id: '2', name: 'Environments', parentId: '1', icon: Mountain },
    { id: '3', name: 'Characters', parentId: '1', icon: PersonStanding },
    { id: '4', name: 'Materials', parentId: '1', icon: Palette },
    { id: '5', name: 'Meshes', parentId: '1', icon: Box },
    { id: '6', name: 'Textures', parentId: '1', icon: Image },
  ]);

  const [assets, setAssets] = useState<Asset[]>([
    { id: 'a1', name: 'M_Ruby_PBR', type: 'mat', folderId: '4' },
    { id: 'a2', name: 'M_ChromeBase', type: 'mat', folderId: '4' },
    { id: 'a3', name: 'M_PlasticWhite', type: 'mat', folderId: '4' },
    { id: 'a4', name: 'BP_PlayerCharacter', type: 'bp', folderId: '3' },
    { id: 'bp_agent', name: 'BP_AI_Agent', type: 'bp', folderId: '3' },
    { id: 'a5', name: 'T_Noise_01', type: 'tex', folderId: '6' },
    { id: 'a6', name: 'SKM_HeroMesh', type: 'skm', folderId: '3' },
    { id: 'a7', name: 'S_Jump_01', type: 'wav', folderId: '1' },
    { id: 'a8', name: 'SM_Barrel', type: 'obj', folderId: '5' },
    { id: 'a9', name: 'SK_Dragon', type: 'fbx', folderId: '3' },
  ]);

  const [activeFolderId, setActiveFolderId] = useState<string>('1');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [aiProcessingLogs, setAiProcessingLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  
  React.useEffect(() => {
    const handleOpenAsset = (e: any) => {
      const assetId = e.detail;
      const asset = assets.find(a => a.id === assetId);
      if (asset) {
        setActiveFolderId(asset.folderId);
        setSelectedAssetId(asset.id);
      }
    };
    window.addEventListener('open-asset', handleOpenAsset);
    return () => window.removeEventListener('open-asset', handleOpenAsset);
  }, [assets]);

  const processImportedFiles = async (files: File[]) => {
    setIsProcessing(true);
    setAiProcessingLogs([]);
    const newAssets: Asset[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const baseName = file.name.split('.')[0] || file.name;
      
      let type: Asset['type'] = 'any';
      let aiAction = '';
      
      setAiProcessingLogs(prev => [...prev, `[AI-Ingest] Analyzing "${file.name}"...`]);
      await new Promise(r => setTimeout(r, 400));
      
      if (ext === 'obj' || ext === 'fbx') {
        type = ext as 'obj'|'fbx';
        aiAction = 'Optimizing topology, generating LoDs...';
      } else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'tga') {
        type = 'tex';
        aiAction = 'Generating PBR maps (Normal, Roughness), compressing to BC7...';
      } else if (ext === 'mat') {
        type = 'mat';
        aiAction = 'Compiling shader bindings...';
      } else if (ext === 'wav' || ext === 'mp3') {
        type = 'wav';
        aiAction = 'Normalizing audio, encoding to OGG...';
      } else {
        aiAction = 'Categorizing generic asset...';
      }
      
      setAiProcessingLogs(prev => [...prev, `[AI-Process] ${aiAction}`]);
      await new Promise(r => setTimeout(r, 600));
      
      const fileId = Math.random().toString(36).substring(2, 9);
      
      newAssets.push({
        id: fileId,
        name: baseName,
        type,
        folderId: activeFolderId
      });
      
      setAiProcessingLogs(prev => [...prev, `[AI-Meta] Generating associated .meta data for ${baseName}...`]);
      await new Promise(r => setTimeout(r, 300));
      
      newAssets.push({
        id: fileId + '_meta',
        name: `${baseName}.meta`,
        type: 'meta',
        folderId: activeFolderId
      });
    }
    
    setAiProcessingLogs(prev => [...prev, `✔ AI Import complete. ${files.length * 2} assets added.`]);
    await new Promise(r => setTimeout(r, 1000));
    
    setAssets(prev => [...prev, ...newAssets]);
    setIsProcessing(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImportedFiles(Array.from(e.target.files));
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImportedFiles(Array.from(e.dataTransfer.files));
    }
  }, [activeFolderId]);

  const createFolder = () => {
    const name = prompt('New Folder Name:');
    if (name) {
      setFolders([...folders, { id: Math.random().toString(36).substring(2, 9), name, parentId: activeFolderId, icon: FolderTree }]);
    }
  };

  const deleteAsset = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(confirm('Delete this asset?')) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  const renderIconForType = (type: string) => {
    switch (type) {
      case 'mat': return <Palette size={24} className="text-[#f85149]" />;
      case 'tex': return <Image size={24} className="text-[#bc8cff]" />;
      case 'skm': 
      case 'fbx': 
      case 'obj': return <Box size={28} className="text-[#58a6ff]" />;
      case 'wav': return <Music size={24} className="text-[#3fb950]" />;
      case 'bp': return <Network size={28} className="text-[#3fb950]" />;
      case 'meta': return <Database size={24} className="text-[#888]" />;
      default: return <FileIcon size={24} className="text-[#888]" />;
    }
  };

  const renderTypeBadge = (type: string) => {
    const map: Record<string, { bg: string, text: string }> = {
      mat: { bg: '#f85149', text: 'MAT' },
      tex: { bg: '#bc8cff', text: 'TEX' },
      skm: { bg: '#58a6ff', text: 'SKM' },
      fbx: { bg: '#58a6ff', text: 'FBX' },
      obj: { bg: '#58a6ff', text: 'OBJ' },
      wav: { bg: '#3fb950', text: 'WAV' },
      bp: { bg: '#3fb950', text: 'BP' },
      meta: { bg: '#333', text: 'META' },
    };
    const style = map[type] || { bg: '#888', text: type.toUpperCase() };
    return (
      <div className="absolute top-0 right-0 text-[#0a0a0a] text-[8px] font-bold px-1 rounded-bl" style={{ backgroundColor: style.bg }}>
        {style.text}
      </div>
    );
  };

  const renderAssetPreview = (asset: Asset) => {
    if (asset.type === 'mat') {
      const g1 = ['#f85149', '#333', '#888'][Math.floor(Math.random()*3)];
      const g2 = ['#ff7b72', '#888', '#fff'][Math.floor(Math.random()*3)];
      return (
        <div className="w-full h-full rounded-full shadow-inner border border-white/10" style={{ background: `linear-gradient(to top right, ${g1}, ${g2})` }}></div>
      );
    }
    return renderIconForType(asset.type);
  };

  const filteredAssets = assets.filter(a => a.folderId === activeFolderId && a.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const selectedAsset = selectedAssetId ? assets.find(a => a.id === selectedAssetId) : null;

  // A very simple recursive folder tree
  const renderFolderHierarchy = (parentId: string | null, depth = 0) => {
    const children = folders.filter(f => f.parentId === parentId);
    return children.map(folder => {
      const Icon = folder.icon || FolderTree;
      const isActive = activeFolderId === folder.id;
      return (
         <div key={folder.id}>
           <div 
             className={`px-2 py-1 cursor-pointer rounded-sm flex items-center gap-2 ${isActive ? 'bg-[#222] text-[#fff]' : 'hover:bg-[#222]'}`}
             style={{ paddingLeft: `${depth * 12 + 8}px` }}
             onClick={() => setActiveFolderId(folder.id)}
           >
             <Icon size={14} className={isActive ? 'text-[#e3b341]' : 'text-[#888]'}/> {folder.name}
           </div>
           {renderFolderHierarchy(folder.id, depth + 1)}
         </div>
      );
    });
  };

  return (
    <div className="flex flex-1 text-sans font-sans h-full overflow-hidden bg-[#0a0a0a] relative">
      {/* Sidebar - Folders */}
      <div className="w-[200px] border-r border-[#222] p-2 flex flex-col gap-1 text-[#888] overflow-y-auto custom-scrollbar shrink-0">
         <div className="flex justify-between items-center px-1 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Asset Folders</span>
            <button onClick={createFolder} className="hover:text-[#fff]"><FolderPlus size={14} /></button>
         </div>
         {renderFolderHierarchy(null)}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
        {/* Toolbar */}
        <div className="h-[40px] bg-[#111] border-b border-[#222] flex items-center justify-between px-4 shrink-0">
           <div className="flex items-center gap-2">
             <button onClick={() => fileInputRef.current?.click()} className="bg-[#58a6ff] hover:bg-[#3b8eed] text-white px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-colors">
                <Sparkles size={14} /> AI Smart Import
             </button>
             <button onClick={() => {
                const name = prompt('Blueprint Name:');
                if (name) {
                  setAssets([...assets, { id: Math.random().toString(36).substring(2, 9), name, type: 'bp', folderId: activeFolderId }]);
                }
             }} className="bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-[#ccc] px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-colors">
                <FilePlus size={14} /> Create Blueprint
             </button>
           </div>
           
           <div className="flex items-center bg-[#1a1a1a] border border-[#333] rounded px-2 w-[240px]">
             <Search size={12} className="text-[#888]" />
             <input type="text" placeholder="Search assets..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-[#ccc] text-[11px] px-2 py-1.5 w-full" />
           </div>
           
           <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleImport} />
        </div>

        {/* Drag Overlay */}
        {isDragOver && !isProcessing && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#58a6ff]/10 backdrop-blur-sm border-2 border-dashed border-[#58a6ff] m-4 rounded-xl pointer-events-none">
             <div className="bg-[#0a0a0a] border border-[#333] p-6 rounded-lg text-center shadow-2xl flex flex-col items-center">
               <UploadCloud size={48} className="text-[#58a6ff] mb-4 animate-bounce" />
               <h3 className="text-xl font-bold text-white mb-2">Drop files for AI-driven Import</h3>
               <p className="text-[#888] text-sm">Will auto-categorize, optimize logic, and generate .meta automatically.</p>
             </div>
          </div>
        )}

        {/* AI Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-sm">
             <div className="bg-[#161b22] border border-[#30363d] w-[400px] rounded-lg shadow-2xl flex flex-col overflow-hidden">
               <div className="p-4 border-b border-[#30363d] flex items-center justify-between">
                 <h3 className="text-[#58a6ff] font-bold flex items-center gap-2"><Sparkles size={16} /> AI Asset Processing</h3>
                 <Loader2 size={16} className="text-[#58a6ff] animate-spin" />
               </div>
               <div className="p-4 flex flex-col gap-2 max-h-[200px] overflow-y-auto bg-[#0d1117] font-mono text-[10px]">
                 {aiProcessingLogs.map((log, i) => (
                   <div key={i} className="text-[#c9d1d9] flex justify-start items-center gap-2">
                     <span className="text-[#3fb950]">›</span> {log}
                   </div>
                 ))}
               </div>
               <div className="p-3 bg-[#111] border-t border-[#30363d] text-[10px] text-[#888] flex items-center gap-2">
                 <Cog size={12} className="animate-spin" /> Analyzing geometry and calculating LODs...
               </div>
             </div>
          </div>
        )}

        {/* Assets Grid */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
           <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 content-start">
             {filteredAssets.length === 0 && (
                <div className="col-span-full h-[150px] flex items-center justify-center text-[#888] text-[12px]">
                   No assets found. Import some or create a new folder.
                </div>
             )}
             {filteredAssets.map(asset => (
                <div key={asset.id} 
                     className={`flex flex-col items-center gap-2 cursor-pointer group p-2 rounded transition-colors ${selectedAssetId === asset.id ? 'bg-[#222]' : 'hover:bg-[#1a1a1a]'}`} 
                     onClick={() => setSelectedAssetId(asset.id)} 
                     onDoubleClick={() => asset.type === 'bp' && onOpenBlueprint && onOpenBlueprint()}>
                   <div className={`w-16 h-16 bg-[#161616] border ${selectedAssetId === asset.id ? 'border-[#58a6ff]' : 'border-[#333] group-hover:border-[#888]'} rounded flex items-center justify-center p-1 relative overflow-hidden drop-shadow-md pb-[-1px]`}>
                      {renderAssetPreview(asset)}
                      {renderTypeBadge(asset.type)}
                      <button onClick={(e) => deleteAsset(e, asset.id)} className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 bg-[#f85149] text-white p-0.5 rounded transition-opacity z-10">
                        <Trash2 size={10} />
                      </button>
                   </div>
                   <span className={`text-[10px] transition-colors text-center w-full truncate px-1 ${selectedAssetId === asset.id ? 'text-[#58a6ff] font-bold' : 'text-[#ccc] group-hover:text-[#fff]'}`} title={asset.name}>{asset.name}</span>
                </div>
             ))}
           </div>
        </div>
      </div>

      {/* Asset Inspector Panel */}
      {selectedAsset && (
        <div className="w-[300px] border-l border-[#222] bg-[#0d1117] flex flex-col shrink-0 overflow-hidden shadow-xl z-10 transition-transform">
           <div className="h-[40px] border-b border-[#222] bg-[#111] flex items-center justify-between px-3 shrink-0">
              <span className="text-[12px] font-bold text-[#e3b341] flex items-center gap-2">
                 <Settings2 size={14} /> Asset Inspector
              </span>
              <button onClick={() => setSelectedAssetId(null)} className="text-[#888] hover:text-[#fff]"><X size={14} /></button>
           </div>
           
           <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1">
              {/* Header Info */}
              <div className="flex gap-3 items-start border-b border-[#30363d] pb-4">
                 <div className="w-16 h-16 bg-[#161616] border border-[#30363d] rounded flex shadow-inner relative items-center justify-center shrink-0 p-1 overflow-hidden">
                    {renderAssetPreview(selectedAsset)}
                    {renderTypeBadge(selectedAsset.type)}
                 </div>
                 <div className="flex flex-col gap-1 overflow-hidden">
                    <span className="text-[#c9d1d9] text-[12px] font-bold truncate" title={selectedAsset.name}>{selectedAsset.name}</span>
                    <span className="text-[#8b949e] text-[10px] font-mono">ID: {selectedAsset.id}</span>
                    <span className="text-[#8b949e] text-[10px] uppercase">{selectedAsset.type.toUpperCase()} File • {(Math.random() * 50 + 1).toFixed(2)} MB</span>
                 </div>
              </div>

              {/* Editable Meta Parameters */}
              <div className="flex flex-col gap-3">
                 <div className="text-[11px] font-bold text-[#58a6ff] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Sliders size={12} /> Optimization Settings
                 </div>
                 
                 {(selectedAsset.name.toLowerCase().includes('tex') || selectedAsset.type === 'tex' || selectedAsset.name.includes('T_')) ? (
                   <>
                     <div className="flex flex-col gap-1">
                       <label className="text-[10px] text-[#8b949e] font-bold">Compression Format</label>
                       <select className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[11px] rounded px-2 py-1.5 outline-none focus:border-[#58a6ff]">
                         <option>BC7 (High Quality, PC/Console)</option>
                         <option>ASTC (Mobile PBR)</option>
                         <option>DXT5 (Legacy)</option>
                         <option>Uncompressed (Raw UI)</option>
                       </select>
                     </div>
                     <div className="flex flex-col gap-1 mt-1">
                       <label className="text-[10px] text-[#8b949e] font-bold">Max Resolution</label>
                       <select className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[11px] rounded px-2 py-1.5 outline-none focus:border-[#58a6ff]">
                         <option>4096 (Cinematic)</option>
                         <option>2048 (Default Hero)</option>
                         <option>1024 (Prop)</option>
                         <option>512 (Background)</option>
                       </select>
                     </div>
                     <div className="flex items-center justify-between border border-[#30363d] p-2 bg-[#161b22] rounded mt-2 hover:border-[#58a6ff] transition-colors">
                        <span className="text-[10px] text-[#c9d1d9]">Generate MipMaps</span>
                        <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-3 h-3 cursor-pointer" />
                     </div>
                     <div className="flex items-center justify-between border border-[#30363d] p-2 bg-[#161b22] rounded mt-1 hover:border-[#58a6ff] transition-colors">
                        <span className="text-[10px] text-[#c9d1d9]">sRGB Display (Color)</span>
                        <input type="checkbox" defaultChecked={!selectedAsset.name.toLowerCase().includes('normal')} className="accent-[#58a6ff] w-3 h-3 cursor-pointer" />
                     </div>
                   </>
                 ) : (selectedAsset.type === 'obj' || selectedAsset.type === 'fbx' || selectedAsset.type === 'skm' || selectedAsset.name.toLowerCase().includes('skm') || selectedAsset.name.toLowerCase().includes('sm_') || selectedAsset.name.toLowerCase().includes('bp_') || selectedAsset.type === 'bp') ? (
                   <>
                     <div className="flex flex-col gap-1">
                       <label className="text-[10px] text-[#8b949e] font-bold">LOD Generation</label>
                       <select className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[11px] rounded px-2 py-1.5 outline-none focus:border-[#58a6ff]">
                         <option>Auto (4 Levels)</option>
                         <option>Aggressive (6 Levels)</option>
                         <option>Hero Only (Base + LOD1)</option>
                         <option>Disabled</option>
                       </select>
                     </div>
                     <div className="flex flex-col gap-1 mt-2">
                       <div className="flex justify-between text-[10px]">
                         <span className="text-[#8b949e] font-bold">Target Tri Count (LOD0)</span>
                         <span className="text-[#c9d1d9] font-mono">15k</span>
                       </div>
                       <input type="range" min="1000" max="50000" defaultValue="15000" className="accent-[#58a6ff] w-full mt-1 cursor-pointer" />
                     </div>
                     <div className="flex items-center justify-between border border-[#30363d] p-2 bg-[#161b22] rounded mt-3 hover:border-[#58a6ff] transition-colors">
                        <span className="text-[10px] text-[#c9d1d9]">Generate Lightmap UVs</span>
                        <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-3 h-3 cursor-pointer" />
                     </div>
                     <div className="flex items-center justify-between border border-[#30363d] p-2 bg-[#161b22] rounded mt-1 hover:border-[#58a6ff] transition-colors">
                        <span className="text-[10px] text-[#c9d1d9]">Keep Quads (No Triangulate)</span>
                        <input type="checkbox" className="accent-[#58a6ff] w-3 h-3 cursor-pointer" />
                     </div>
                   </>
                 ) : (
                   <div className="text-[10px] text-[#8b949e] bg-[#161b22] p-3 rounded border border-[#30363d] text-center italic mt-2">
                     No optimization parameters available for this asset type. Uses standard engine defaults.
                   </div>
                 )}
                 
              </div>
           </div>

           <div className="p-4 border-t border-[#30363d] bg-[#0d1117] mt-auto">
              <button 
                 className="w-full bg-[#2ea043] hover:bg-[#3fb950] text-[#0d1117] py-2 rounded text-[11px] font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
                 onClick={() => {
                    alert('Meta attributes saved successfully!');
                 }}
              >
                 <Save size={14} /> Save Metadata Fixes
              </button>
           </div>
        </div>
      )}
    </div>
  );
}

