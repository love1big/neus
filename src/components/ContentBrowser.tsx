import React, { useState, useRef } from 'react';
import { FolderTree, Mountain, PersonStanding, Palette, Image, Music, Box, File as FileIcon, Search, UploadCloud, Trash2, ShieldCheck, FolderPlus, FilePlus, Network } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: 'mat' | 'tex' | 'skm' | 'wav' | 'bp' | 'fbx' | 'obj' | 'any';
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
    { id: 'a5', name: 'T_Noise_01', type: 'tex', folderId: '6' },
    { id: 'a6', name: 'SKM_HeroMesh', type: 'skm', folderId: '3' },
    { id: 'a7', name: 'S_Jump_01', type: 'wav', folderId: '1' },
    { id: 'a8', name: 'SM_Barrel', type: 'obj', folderId: '5' },
    { id: 'a9', name: 'SK_Dragon', type: 'fbx', folderId: '3' },
  ]);

  const [activeFolderId, setActiveFolderId] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newAssets: Asset[] = [];
      Array.from(e.target.files).forEach(file => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        let type: Asset['type'] = 'any';
        if (ext === 'obj' || ext === 'fbx') type = ext as 'obj'|'fbx';
        else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'tga') type = 'tex';
        else if (ext === 'mat') type = 'mat';
        else if (ext === 'wav' || ext === 'mp3') type = 'wav';

        newAssets.push({
          id: Math.random().toString(36).substring(2, 9),
          name: file.name.split('.')[0] || file.name,
          type,
          folderId: activeFolderId
        });
      });
      setAssets([...assets, ...newAssets]);
    }
  };

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
    <div className="flex flex-1 text-sans font-sans h-full overflow-hidden bg-[#0a0a0a]">
      {/* Sidebar - Folders */}
      <div className="w-[200px] border-r border-[#222] p-2 flex flex-col gap-1 text-[#888] overflow-y-auto custom-scrollbar shrink-0">
         <div className="flex justify-between items-center px-1 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Asset Folders</span>
            <button onClick={createFolder} className="hover:text-[#fff]"><FolderPlus size={14} /></button>
         </div>
         {renderFolderHierarchy(null)}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="h-[40px] bg-[#111] border-b border-[#222] flex items-center justify-between px-4 shrink-0">
           <div className="flex items-center gap-2">
             <button onClick={() => fileInputRef.current?.click()} className="bg-[#2ea043] hover:bg-[#3fb950] text-white px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-colors">
                <UploadCloud size={14} /> Import Assets
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
           
           <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleImport} accept=".fbx,.obj,.png,.jpg,.jpeg,.tga,.mat,.wav,.mp3" />
        </div>

        {/* Assets Grid */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
           <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 content-start">
             {filteredAssets.length === 0 && (
                <div className="col-span-full h-[150px] flex items-center justify-center text-[#888] text-[12px]">
                   No assets found. Import some or create a new folder.
                </div>
             )}
             {filteredAssets.map(asset => (
                <div key={asset.id} className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => asset.type === 'bp' && onOpenBlueprint && onOpenBlueprint()}>
                   <div className="w-16 h-16 bg-[#161616] border border-[#333] group-hover:border-[#58a6ff] rounded flex items-center justify-center p-1 relative overflow-hidden drop-shadow-md pb-[-1px]">
                      {renderAssetPreview(asset)}
                      {renderTypeBadge(asset.type)}
                      <button onClick={(e) => deleteAsset(e, asset.id)} className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 bg-[#f85149] text-white p-0.5 rounded transition-opacity">
                        <Trash2 size={10} />
                      </button>
                   </div>
                   <span className="text-[10px] text-[#ccc] group-hover:text-[#fff] transition-colors text-center w-full truncate px-1" title={asset.name}>{asset.name}</span>
                </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
