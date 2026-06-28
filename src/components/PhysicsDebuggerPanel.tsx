import React, { useState } from 'react';
import { Box, Eye, Grid3X3, Zap, Activity } from 'lucide-react';

interface PhysicsDebuggerPanelProps {
  physicsConfig: any;
  setPhysicsConfig: (config: any) => void;
}

export default function PhysicsDebuggerPanel({ physicsConfig, setPhysicsConfig }: PhysicsDebuggerPanelProps) {
  const [minimized, setMinimized] = useState(false);

  return (
    <div className="absolute top-4 right-4 w-64 bg-[#11111b]/95 backdrop-blur border border-[#2a2b3d] shadow-xl rounded-lg overflow-hidden z-50 animate-in fade-in slide-in-from-right-4">
       <div className="bg-[#161621] border-b border-[#2a2b3d] px-3 py-2 flex items-center justify-between cursor-pointer" onClick={() => setMinimized(!minimized)}>
         <h3 className="text-xs font-bold text-[#e3b341] flex items-center gap-1.5"><Activity size={14}/> Physics Debugger</h3>
         <button className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points={minimized ? "6 9 12 15 18 9" : "18 15 12 9 6 15"}></polyline></svg>
         </button>
       </div>

       {!minimized && (
         <div className="p-3 space-y-3">
           <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
             <input type="checkbox" checked={physicsConfig.debugVisible} onChange={(e) => setPhysicsConfig({...physicsConfig, debugVisible: e.target.checked})} className="accent-[#e3b341]"/>
             <Box size={14} className="text-[#58a6ff]"/> Show Collision Bounds
           </label>
           
           <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
             <input type="checkbox" checked={physicsConfig.wireframe} onChange={(e) => setPhysicsConfig({...physicsConfig, wireframe: e.target.checked})} className="accent-[#e3b341]"/>
             <Grid3X3 size={14} className="text-[#3fb950]"/> Wireframe Mode
           </label>

           <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
             <input type="checkbox" checked={physicsConfig.gravityVectors} onChange={(e) => setPhysicsConfig({...physicsConfig, gravityVectors: e.target.checked})} className="accent-[#e3b341]"/>
             <Zap size={14} className="text-[#e3b341]"/> Gravity Vectors
           </label>
           
           <div className="pt-2 border-t border-[#2a2b3d]">
             <div className="text-[10px] text-gray-500 mb-1">Gravity Scale</div>
             <input type="range" min="0" max="2" step="0.1" value={physicsConfig.gravityScale} onChange={(e) => setPhysicsConfig({...physicsConfig, gravityScale: parseFloat(e.target.value)})} className="w-full accent-[#e3b341] h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
             <div className="flex justify-between text-[10px] text-gray-400 mt-1">
               <span>0</span>
               <span>{physicsConfig.gravityScale}x</span>
               <span>2</span>
             </div>
           </div>
         </div>
       )}
    </div>
  );
}
