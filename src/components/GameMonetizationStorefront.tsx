import React, { useState } from 'react';
import { ShoppingBag, DollarSign, Gift, TrendingUp, Settings, Plus, LayoutDashboard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const salesData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

export default function GameMonetizationStorefront() {
  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-green-500 to-emerald-700 p-1.5 rounded-lg shadow-lg">
            <ShoppingBag size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Monetization <span className="text-green-400">Storefront</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">IAP, Battle Pass & Live Economy</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 bg-[#333] hover:bg-[#444] text-gray-300 px-3 py-1.5 rounded text-xs font-bold transition-colors">
             <Settings size={14} /> ECONOMY SETTINGS
           </button>
           <button className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-[0_0_10px_rgba(34,197,94,0.4)]">
             <Plus size={14} /> NEW BUNDLE
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Navigation */}
        <div className="w-48 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0">
          <div className="p-2 space-y-1 mt-2">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-green-400 bg-[#1a1a1c] border-l-2 border-green-500 uppercase tracking-widest rounded-r">
              <LayoutDashboard size={14}/> Dashboard
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest rounded">
              <ShoppingBag size={14}/> Store Items
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest rounded">
              <Gift size={14}/> Battle Pass
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest rounded">
              <DollarSign size={14}/> Virtual Currency
            </button>
          </div>
        </div>

        {/* Center: Dashboard */}
        <div className="flex-1 bg-[#121212] p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
           
           {/* Top Stats */}
           <div className="grid grid-cols-4 gap-4 shrink-0">
             <div className="bg-[#1a1a1c] border border-[#3e3e42] p-4 rounded-lg flex flex-col justify-center relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10"><DollarSign size={80} /></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Gross Revenue (7D)</span>
                <span className="text-2xl font-bold text-green-400">$19,560.00</span>
                <span className="text-[9px] text-green-500 flex items-center gap-1 mt-1"><TrendingUp size={10}/> +12.4% vs last week</span>
             </div>
             <div className="bg-[#1a1a1c] border border-[#3e3e42] p-4 rounded-lg flex flex-col justify-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">ARPU</span>
                <span className="text-2xl font-bold text-white">$4.20</span>
             </div>
             <div className="bg-[#1a1a1c] border border-[#3e3e42] p-4 rounded-lg flex flex-col justify-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Active Battle Passes</span>
                <span className="text-2xl font-bold text-white">45,291</span>
             </div>
             <div className="bg-[#1a1a1c] border border-[#3e3e42] p-4 rounded-lg flex flex-col justify-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Conversion Rate</span>
                <span className="text-2xl font-bold text-white">3.8%</span>
             </div>
           </div>

           {/* Charts & Top Items */}
           <div className="flex gap-6 h-64 shrink-0">
              
              {/* Revenue Chart */}
              <div className="flex-2 bg-[#1a1a1c] border border-[#3e3e42] rounded-lg p-4 flex flex-col min-w-[50%]">
                 <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Revenue Overview</h3>
                 <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3e3e42" vertical={false} />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={10} />
                        <YAxis stroke="#6b7280" fontSize={10} tickFormatter={(val) => `$${val/1000}k`} />
                        <Tooltip cursor={{fill: '#252526'}} contentStyle={{ backgroundColor: '#1a1a1c', borderColor: '#3e3e42', fontSize: '10px' }} />
                        <Bar dataKey="revenue" fill="#22c55e" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* Top Selling */}
              <div className="flex-1 bg-[#1a1a1c] border border-[#3e3e42] rounded-lg p-4 flex flex-col">
                 <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Top Performing Offers</h3>
                 <div className="flex-1 space-y-3">
                    {[
                      { name: "Starter Bundle", type: "Bundle", price: "$4.99", sales: 1240 },
                      { name: "Neon Katana Skin", type: "Cosmetic", price: "$9.99", sales: 890 },
                      { name: "1000 Gems", type: "Currency", price: "$9.99", sales: 650 },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-[#252526] rounded border border-[#3e3e42]">
                        <div>
                          <div className="text-[10px] font-bold text-gray-200">{item.name}</div>
                          <div className="text-[9px] text-gray-500">{item.type}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-green-400">{item.price}</div>
                          <div className="text-[9px] text-gray-500">{item.sales} sold</div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

           </div>

        </div>

      </div>
    </div>
  );
}
