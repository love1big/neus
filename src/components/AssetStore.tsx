import React, { useState } from 'react';
import { ShoppingCart, Search, Star, Download, Filter, Package, Code, Server, Heart } from 'lucide-react';

export default function AssetStore() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  
  const categories = ['All', '3D Models', '2D Assets', 'Audio', 'Plugins', 'Blueprints', 'VFX', 'AI Models'];
  
  const assets = [
    { id: 1, name: 'Cyberpunk City Kit', author: 'NeonStudios', rating: 4.8, price: 'Free', category: '3D Models', img: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=400&q=80', downloads: '12k' },
    { id: 2, name: 'Advanced AI NavMesh Pro', author: 'EpicLogic', rating: 5.0, price: '$24.99', category: 'Plugins', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80', downloads: '3.4k' },
    { id: 3, name: 'AAA Gun SFX Pack', author: 'SoundMaster', rating: 4.7, price: '$9.99', category: 'Audio', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80', downloads: '8.1k' },
    { id: 4, name: 'Ultimate Fantasy RPG UI', author: 'UIUXGod', rating: 4.9, price: 'Free', category: '2D Assets', img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&q=80', downloads: '45k' },
    { id: 5, name: 'Weather System Pro', author: 'CloudMakers', rating: 4.6, price: '$14.99', category: 'Blueprints', img: 'https://images.unsplash.com/photo-1558231415-4fa2e17637db?w=400&q=80', downloads: '2.1k' },
    { id: 6, name: 'Magic Spells VFX Pack', author: 'SparkleInc', rating: 4.8, price: 'Free', category: 'VFX', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80', downloads: '15k' },
    { id: 7, name: 'LLM NPC Brain Plugin', author: 'NexusAI', rating: 4.9, price: 'Free', category: 'AI Models', img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=80', downloads: '32k' },
    { id: 8, name: 'Stylized Nature Pack', author: 'PolyArt', rating: 4.5, price: '$19.99', category: '3D Models', img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80', downloads: '5.6k' },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-[#30363d] p-3 items-center justify-between bg-[#161b22] shrink-0">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-[#bc8cff]/10 rounded text-[#bc8cff]"><ShoppingCart size={20}/></div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Marketplace & Plugins</h2>
              <p className="text-[10px] text-[#8b949e]">Discover assets, tools, and AI models to accelerate your project.</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="relative">
                <Search size={14} className="absolute left-3 top-2 text-[#8b949e]" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search marketplace..." 
                  className="bg-[#0d1117] border border-[#30363d] rounded-full pl-9 pr-4 py-1.5 text-[11px] outline-none text-white w-64 focus:border-[#bc8cff] transition-colors"
                />
            </div>
            <button className="flex items-center gap-2 text-[#8b949e] hover:text-white transition-colors text-[11px] font-bold">
               <Package size={14}/> My Library
            </button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 border-r border-[#30363d] bg-[#0d1117] flex flex-col shrink-0">
           <div className="p-3 border-b border-[#30363d] flex items-center gap-2 text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">
              <Filter size={12}/> Categories
           </div>
           <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
             {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded text-[11px] font-bold transition-colors ${activeCategory === cat ? 'bg-[#bc8cff]/20 text-[#bc8cff]' : 'text-[#8b949e] hover:bg-[#161b22] hover:text-[#c9d1d9]'}`}
                >
                  {cat}
                </button>
             ))}
           </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {assets.filter(a => (activeCategory === 'All' || a.category === activeCategory) && a.name.toLowerCase().includes(search.toLowerCase())).map(asset => (
                 <div key={asset.id} className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden hover:border-[#bc8cff]/50 hover:shadow-[0_0_15px_rgba(188,140,255,0.15)] transition-all group flex flex-col">
                    {/* Image */}
                    <div className="h-40 w-full relative overflow-hidden bg-[#0d1117]">
                       <img src={asset.img} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                       <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider">
                          {asset.category}
                       </div>
                    </div>
                    
                    {/* Details */}
                    <div className="p-4 flex flex-col flex-1">
                       <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-white text-sm line-clamp-1" title={asset.name}>{asset.name}</h3>
                          <button className="text-[#8b949e] hover:text-red-400"><Heart size={14}/></button>
                       </div>
                       <p className="text-[10px] text-[#8b949e] mb-2">{asset.author}</p>
                       
                       <div className="flex items-center gap-3 text-[10px] text-[#8b949e] mb-4">
                          <span className="flex items-center gap-1 text-[#e3b341] font-bold"><Star size={10} fill="currentColor"/> {asset.rating}</span>
                          <span className="flex items-center gap-1"><Download size={10}/> {asset.downloads}</span>
                       </div>
                       
                       <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#30363d]">
                          <span className={`font-bold text-lg ${asset.price === 'Free' ? 'text-[#3fb950]' : 'text-white'}`}>{asset.price}</span>
                          <button className="bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 border border-[#bc8cff]/30 text-[#bc8cff] px-4 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors">
                             {asset.price === 'Free' ? <><Download size={12}/> Get</> : <><ShoppingCart size={12}/> Buy</>}
                          </button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
