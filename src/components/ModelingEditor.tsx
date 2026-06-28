import React, { useState } from 'react';
import { Box, RotateCcw, ZoomIn, ZoomOut, Target, Hammer, Save } from 'lucide-react';
import Viewport3D from './Viewport3D';

export default function ModelingEditor() {
  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans overflow-hidden">
      <div className="p-4 bg-[#11111b] border-b border-[#2a2b3d] flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-[14px] font-extrabold text-[#e6edf3] mb-1 flex items-center gap-2">
            <Box className="text-[#ff7b72]"/> 3D Asset Modeler
          </h1>
          <p className="text-[#8b949e] text-[10px]">Real-time hardware-accelerated viewport with Rapier physics engine.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-3 py-1.5 text-xs font-bold bg-[#238636] hover:bg-[#2ea043] text-white rounded flex items-center gap-2"><Save size={14}/> Save Asset</button>
        </div>
      </div>
      
      <div className="flex-1 flex w-full relative">
         <Viewport3D activeTool="Modeling" activeFile={undefined} />
      </div>
    </div>
  );
}