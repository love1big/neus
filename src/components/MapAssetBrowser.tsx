import React, { useState, useMemo } from 'react';
import { Search, Trees, Home, Shield, Swords, Box, LayoutGrid, List, Filter, DownloadCloud, Plus, Zap, Car, User, Sparkles } from 'lucide-react';

export default function MapAssetBrowser() {
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = [
    { id: 'all', name: 'All Assets', icon: <LayoutGrid size={14} /> },
    { id: 'nature', name: 'Nature & Foliage', icon: <Trees size={14} /> },
    { id: 'architecture', name: 'Architecture', icon: <Home size={14} /> },
    { id: 'fantasy', name: 'Fantasy & Castles', icon: <Shield size={14} /> },
    { id: 'props', name: 'Props & Clutter', icon: <Box size={14} /> },
    { id: 'combat', name: 'Combat & Traps', icon: <Swords size={14} /> },
    { id: 'scifi', name: 'Sci-Fi & Cyberpunk', icon: <Zap size={14} /> },
    { id: 'vehicles', name: 'Vehicles', icon: <Car size={14} /> },
    { id: 'characters', name: 'Characters & NPCs', icon: <User size={14} /> },
    { id: 'vfx', name: 'Lights & VFX', icon: <Sparkles size={14} /> },
  ];

  const assets = [
    { id: 1, name: 'Oak Tree', cat: 'nature', rarity: 'common' },
    { id: 2, name: 'Pine Tree', cat: 'nature', rarity: 'common' },
    { id: 3, name: 'Bushes Pack', cat: 'nature', rarity: 'common' },
    { id: 4, name: 'Stone Castle Wall', cat: 'fantasy', rarity: 'uncommon' },
    { id: 5, name: 'Castle Gatehouse', cat: 'fantasy', rarity: 'rare' },
    { id: 6, name: 'Wooden Cabin', cat: 'architecture', rarity: 'common' },
    { id: 7, name: 'Tavern Building', cat: 'architecture', rarity: 'uncommon' },
    { id: 8, name: 'Market Stall', cat: 'props', rarity: 'common' },
    { id: 9, name: 'Wooden Barrels', cat: 'props', rarity: 'common' },
    { id: 10, name: 'Spike Trap', cat: 'combat', rarity: 'uncommon' },
    { id: 11, name: 'Guard Tower', cat: 'fantasy', rarity: 'rare' },
    { id: 12, name: 'Dungeon Entrance', cat: 'fantasy', rarity: 'epic' },
    { id: 13, name: 'Birch Tree', cat: 'nature', rarity: 'common' },
    { id: 14, name: 'Giant Mushroom', cat: 'nature', rarity: 'uncommon' },
    { id: 15, name: 'Mossy Rock', cat: 'nature', rarity: 'common' },
    { id: 16, name: 'Fern Patch', cat: 'nature', rarity: 'common' },
    { id: 17, name: 'Modern House', cat: 'architecture', rarity: 'uncommon' },
    { id: 18, name: 'Skyscraper Base', cat: 'architecture', rarity: 'rare' },
    { id: 19, name: 'City Streetlight', cat: 'architecture', rarity: 'common' },
    { id: 20, name: 'Stone Bridge', cat: 'architecture', rarity: 'uncommon' },
    { id: 21, name: 'Dragon Statue', cat: 'fantasy', rarity: 'epic' },
    { id: 22, name: 'Magic Portal', cat: 'fantasy', rarity: 'legendary' },
    { id: 23, name: 'Wooden Cart', cat: 'props', rarity: 'common' },
    { id: 24, name: 'Treasure Chest', cat: 'props', rarity: 'uncommon' },
    { id: 25, name: 'Campfire', cat: 'props', rarity: 'common' },
    { id: 26, name: 'Anvil', cat: 'props', rarity: 'common' },
    { id: 27, name: 'Ballista', cat: 'combat', rarity: 'rare' },
    { id: 28, name: 'Cannon', cat: 'combat', rarity: 'rare' },
    { id: 29, name: 'Bear Trap', cat: 'combat', rarity: 'uncommon' },
    { id: 30, name: 'Neon Sign', cat: 'scifi', rarity: 'uncommon' },
    { id: 31, name: 'Cyberpunk Vendor', cat: 'scifi', rarity: 'rare' },
    { id: 32, name: 'Holo-Terminal', cat: 'scifi', rarity: 'epic' },
    { id: 33, name: 'Sci-Fi Crate', cat: 'scifi', rarity: 'common' },
    { id: 34, name: 'Space Fighter', cat: 'vehicles', rarity: 'epic' },
    { id: 35, name: 'Hover Bike', cat: 'vehicles', rarity: 'rare' },
    { id: 36, name: 'Horse Carriage', cat: 'vehicles', rarity: 'uncommon' },
    { id: 37, name: 'Armored Truck', cat: 'vehicles', rarity: 'rare' },
    { id: 38, name: 'Town Guard', cat: 'characters', rarity: 'common' },
    { id: 39, name: 'Merchant NPC', cat: 'characters', rarity: 'uncommon' },
    { id: 40, name: 'Dark Knight', cat: 'characters', rarity: 'epic' },
    { id: 41, name: 'Cyber-Ninja', cat: 'characters', rarity: 'rare' },
    { id: 42, name: 'Ambient Sparks', cat: 'vfx', rarity: 'uncommon' },
    { id: 43, name: 'God Rays', cat: 'vfx', rarity: 'epic' },
    { id: 44, name: 'Fire Particles', cat: 'vfx', rarity: 'rare' },
    { id: 45, name: 'Smoke Plume', cat: 'vfx', rarity: 'common' },
    { id: 46, name: 'Ancient Ruins', cat: 'fantasy', rarity: 'epic' },
    { id: 47, name: 'Crystal Cluster', cat: 'nature', rarity: 'rare' },
    { id: 48, name: 'Abandoned Car', cat: 'props', rarity: 'uncommon' },
    { id: 49, name: 'Street Bench', cat: 'props', rarity: 'common' },
    { id: 50, name: 'Gatling Turret', cat: 'combat', rarity: 'epic' },
  ];

  const filteredAssets = useMemo(() => {
    let result = category === 'all' ? assets : assets.filter(a => a.cat === category);
    if (searchQuery.trim() !== '') {
      result = result.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return result;
  }, [category, searchQuery, assets]);

  const renderIcon = (cat: string) => {
    switch(cat) {
      case 'nature': return <Trees size={48} className="text-[#3fb950] relative z-10 drop-shadow-lg" />;
      case 'architecture': return <Home size={48} className="text-[#a5d6ff] relative z-10 drop-shadow-lg" />;
      case 'fantasy': return <Shield size={48} className="text-[#e3b341] relative z-10 drop-shadow-lg" />;
      case 'props': return <Box size={48} className="text-[#ff7b72] relative z-10 drop-shadow-lg" />;
      case 'combat': return <Swords size={48} className="text-[#ff7b72] relative z-10 drop-shadow-lg" />;
      case 'scifi': return <Zap size={48} className="text-[#0ff] relative z-10 drop-shadow-lg" />;
      case 'vehicles': return <Car size={48} className="text-[#f97316] relative z-10 drop-shadow-lg" />;
      case 'characters': return <User size={48} className="text-[#d946ef] relative z-10 drop-shadow-lg" />;
      case 'vfx': return <Sparkles size={48} className="text-[#facc15] relative z-10 drop-shadow-lg" />;
      default: return <Box size={48} className="text-gray-500 relative z-10 drop-shadow-lg" />;
    }
  };

  return (
    <div className="absolute inset-x-0 inset-y-0 z-30 pointer-events-auto bg-[#0a0a0f] flex">
      {/* Sidebar */}
      <div className="w-[280px] border-r border-[#2a2b3d] bg-[#11111b] flex flex-col shadow-xl z-20 relative">
        <div className="p-4 border-b border-[#2a2b3d]">
          <h2 className="text-sm font-bold text-[#3fb950] flex items-center gap-2 mb-2">
             <DownloadCloud size={16} /> Asset Library & Store
          </h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search models, trees, castles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded text-xs text-white pl-8 pr-3 py-2 focus:outline-none focus:border-[#3fb950]" 
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          <h3 className="text-[10px] font-bold text-[#8b949e] uppercase px-2 mb-2">Categories</h3>
          <div className="flex flex-col gap-1">
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-xs transition-colors ${category === cat.id ? 'bg-[#3fb950]/20 text-[#3fb950]' : 'text-gray-400 hover:bg-[#2a2b3d] hover:text-white'}`}
              >
                {cat.icon}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
          
          <h3 className="text-[10px] font-bold text-[#8b949e] uppercase px-2 mt-4 mb-2">Marketplace</h3>
          <button className="w-full flex items-center justify-between px-3 py-2 rounded text-xs text-[#d2a8ff] hover:bg-[#d2a8ff]/10 border border-transparent hover:border-[#d2a8ff]/30 transition-all">
            <span className="flex items-center gap-2"><DownloadCloud size={14} /> Browse Asset Store</span>
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#0f111a] flex flex-col">
        <div className="p-4 border-b border-[#2a2b3d] flex justify-between items-center bg-[#11111b]">
           <div className="flex items-center gap-4">
              <h2 className="text-sm font-bold text-white">Drag & Drop Models to Map</h2>
              <span className="text-xs text-gray-400">{filteredAssets.length} items found</span>
           </div>
           <div className="flex gap-2">
              <button className="bg-[#1a1a24] text-white border border-[#2a2b3d] p-1.5 rounded hover:bg-[#2a2b3d]"><Filter size={14}/></button>
              <button className="bg-[#1a1a24] text-white border border-[#2a2b3d] p-1.5 rounded hover:bg-[#2a2b3d]"><LayoutGrid size={14}/></button>
              <button className="bg-[#1a1a24] text-white border border-[#2a2b3d] p-1.5 rounded hover:bg-[#2a2b3d]"><List size={14}/></button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredAssets.map(asset => (
                 <div key={asset.id} className="bg-[#11111b] border border-[#2a2b3d] rounded-lg overflow-hidden group hover:border-[#3fb950] transition-colors cursor-grab active:cursor-grabbing">
                    <div className="h-32 bg-[#1a1a24] relative flex items-center justify-center p-4">
                       <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#8b949e 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                       {renderIcon(asset.cat)}
                       
                       <div className="absolute top-2 right-2 bg-[#0a0a0f]/80 backdrop-blur px-1.5 py-0.5 rounded border border-[#2a2b3d] text-[8px] font-mono text-gray-400 uppercase">
                          {asset.rarity}
                       </div>
                    </div>
                    <div className="p-3">
                       <h3 className="text-xs font-bold text-white mb-1 truncate" title={asset.name}>{asset.name}</h3>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-500 capitalize">{asset.cat}</span>
                          <span className="text-[10px] text-[#3fb950]">Ready</span>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
           
           {filteredAssets.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-sm">No models found matching your criteria.</p>
              </div>
           )}

           <div className="mt-8 border-t border-[#2a2b3d] pt-8 text-center">
              <div className="inline-block p-4 border border-dashed border-[#2a2b3d] rounded-lg bg-[#11111b]/50 cursor-pointer hover:bg-[#1a1a24] transition-colors">
                 <DownloadCloud size={32} className="text-gray-500 mx-auto mb-2" />
                 <h3 className="text-sm font-bold text-white mb-1">Import Custom Models</h3>
                 <p className="text-xs text-gray-400">Drag FBX, OBJ, or GLTF files here</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
