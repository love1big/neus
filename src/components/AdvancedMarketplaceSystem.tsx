import React from 'react';
import { ShoppingCart, PackageSearch, Tag, Star, Download, Search, Filter } from 'lucide-react';

export default function AdvancedMarketplaceSystem() {
  return (
    <div className="flex flex-col w-full h-full bg-[#0a0a0f] text-gray-200 font-sans">
      {/* Top Header */}
      <div className="h-16 border-b border-[#2a2b3d] bg-[#141525] flex items-center justify-between px-6 shrink-0 sticky top-0 z-20">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
               <ShoppingCart size={20} />
            </div>
            <h1 className="font-bold text-white text-lg">Asset Store & Marketplace</h1>
         </div>
         <div className="flex items-center gap-4">
            <div className="relative w-72">
               <Search size={16} className="absolute left-3 top-2 text-gray-500" />
               <input type="text" placeholder="Search assets, plugins, materials..." className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded-full pl-9 pr-4 py-1.5 text-sm text-white focus:border-purple-500 outline-none transition-colors" />
            </div>
            <div className="flex items-center gap-2 bg-[#2a2b3d] px-3 py-1.5 rounded-full text-xs font-bold text-white cursor-pointer hover:bg-[#30363d]">
               <PackageSearch size={14}/> Library (42)
            </div>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Categories Sidebar */}
         <div className="w-56 border-r border-[#2a2b3d] bg-[#141525] p-4 flex flex-col gap-6 overflow-y-auto shrink-0">
            <div className="flex flex-col gap-2">
               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categories</h3>
               {['3D Models', 'Materials & FX', 'Audio', 'Scripts & Systems', 'UI Templates', 'Full Projects'].map((cat, i) => (
                  <div key={i} className={`text-sm py-1.5 px-2 rounded cursor-pointer ${i === 0 ? 'bg-purple-600 text-white font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1b26]'}`}>
                     {cat}
                  </div>
               ))}
            </div>
            <div className="h-px w-full bg-[#2a2b3d]"></div>
            <div className="flex flex-col gap-2">
               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Filter size={12}/> Filters</h3>
               <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                  <input type="checkbox" className="rounded bg-[#0a0a0f] border-[#2a2b3d] text-purple-500 focus:ring-purple-500" /> Free Only
               </label>
               <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                  <input type="checkbox" className="rounded bg-[#0a0a0f] border-[#2a2b3d] text-purple-500 focus:ring-purple-500" /> On Sale
               </label>
            </div>
         </div>

         {/* Main Storefront Grid */}
         <div className="flex-1 bg-[#0d1117] p-6 overflow-y-auto">
            <div className="flex justify-between items-end mb-6">
               <div>
                  <h2 className="text-xl font-bold text-white mb-1">Trending 3D Models</h2>
                  <p className="text-sm text-gray-400">High-quality assets to accelerate your development.</p>
               </div>
               <select className="bg-[#141525] border border-[#2a2b3d] rounded px-3 py-1.5 text-xs text-white outline-none">
                  <option>Sort: Popular</option>
                  <option>Sort: Newest</option>
                  <option>Sort: Price (Low to High)</option>
               </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {/* Asset Card 1 */}
               <div className="bg-[#141525] border border-[#2a2b3d] rounded-xl overflow-hidden hover:border-purple-500/50 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] group flex flex-col">
                  <div className="h-40 bg-gray-800 relative overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Asset" />
                     <div className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase shadow">Featured</div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                     <h3 className="font-bold text-white text-sm mb-1 truncate">Sci-Fi Modular Environment Kit</h3>
                     <p className="text-xs text-gray-400 mb-3 line-clamp-2">Over 200 high-quality modular pieces to build stunning sci-fi interiors.</p>
                     
                     <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                           <Star size={12} fill="currentColor"/> 4.9 <span className="text-gray-500 font-normal">(128)</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-xs text-gray-500 line-through">$49.99</span>
                           <span className="font-bold text-white text-sm">$29.99</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Asset Card 2 */}
               <div className="bg-[#141525] border border-[#2a2b3d] rounded-xl overflow-hidden hover:border-purple-500/50 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] group flex flex-col">
                  <div className="h-40 bg-gray-800 relative overflow-hidden">
                     <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-900 to-black text-gray-500"><Tag size={40}/></div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                     <h3 className="font-bold text-white text-sm mb-1 truncate">Fantasy Stylized Trees Vol 1</h3>
                     <p className="text-xs text-gray-400 mb-3 line-clamp-2">Optimized foliage for mobile and PC stylized games.</p>
                     <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                           <Star size={12} fill="currentColor"/> 4.7 <span className="text-gray-500 font-normal">(42)</span>
                        </div>
                        <span className="font-bold text-green-400 text-sm uppercase">Free</span>
                     </div>
                  </div>
               </div>

               {/* Asset Card 3 (Purchased) */}
               <div className="bg-[#1a1b26] border border-blue-500/30 rounded-xl overflow-hidden group flex flex-col ring-1 ring-blue-500/10">
                  <div className="h-40 bg-gray-800 relative overflow-hidden opacity-80">
                     <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover grayscale mix-blend-luminosity" alt="Asset" />
                     <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"><Check size={14}/> Owned</div>
                     </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                     <h3 className="font-bold text-white text-sm mb-1 truncate">Low Poly Vehicles Pack</h3>
                     <p className="text-xs text-gray-400 mb-4 line-clamp-1">30+ rigged low poly cars.</p>
                     <button className="w-full mt-auto py-1.5 bg-[#2a2b3d] hover:bg-[#30363d] text-white text-xs font-medium rounded flex items-center justify-center gap-2"><Download size={14}/> Import to Project</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
