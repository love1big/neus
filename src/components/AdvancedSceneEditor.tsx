import React, { useState } from "react";
import { Folder, File, Layers, Plus, Search, Eye, EyeOff, Lock, Unlock, Settings2, Move, Maximize, Copy, Trash2, Box, Image, Orbit } from "lucide-react";

export default function AdvancedSceneEditor() {
  const [search, setSearch] = useState("");
  const [nodes, setNodes] = useState([
    { id: "root", name: "Main Scene", type: "scene", open: true, visible: true, locked: false, children: [
      { id: "env", name: "Environment", type: "folder", open: true, visible: true, locked: false, children: [
        { id: "terrain", name: "Terrain_01", type: "mesh", visible: true, locked: true },
        { id: "skybox", name: "Skybox_Day", type: "material", visible: true, locked: false },
        { id: "water", name: "Ocean_Plane", type: "mesh", visible: true, locked: false },
      ]},
      { id: "lights", name: "Lighting", type: "folder", open: true, visible: true, locked: false, children: [
        { id: "dir_light", name: "Directional Light", type: "light", visible: true, locked: false },
        { id: "point_light", name: "Point Light (Fire)", type: "light", visible: true, locked: false },
      ]},
      { id: "entities", name: "Entities", type: "folder", open: true, visible: true, locked: false, children: [
        { id: "player", name: "Player_Character", type: "prefab", visible: true, locked: false },
        { id: "npc_1", name: "NPC_Merchant", type: "prefab", visible: true, locked: false },
        { id: "enemy_spawn", name: "EnemySpawner", type: "script", visible: false, locked: false },
      ]},
      { id: "particles", name: "VFX", type: "folder", open: true, visible: true, locked: false, children: [
        { id: "fire", name: "Campfire_FX", type: "particle", visible: true, locked: false },
        { id: "dust", name: "Ambient_Dust", type: "particle", visible: true, locked: false },
      ]}
    ]}
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case "scene": return <Layers size={14} className="text-purple-400" />;
      case "folder": return <Folder size={14} className="text-blue-400" />;
      case "mesh": return <Box size={14} className="text-gray-300" />;
      case "material": return <Image size={14} className="text-pink-400" />;
      case "light": return <Settings2 size={14} className="text-yellow-400" />;
      case "prefab": return <Box size={14} className="text-green-400" />;
      case "script": return <File size={14} className="text-red-400" />;
      case "particle": return <Orbit size={14} className="text-orange-400" />;
      default: return <File size={14} className="text-gray-400" />;
    }
  };

  const renderNode = (node: any, depth = 0) => {
    return (
      <div key={node.id} className="flex flex-col">
        <div className={`flex items-center group px-2 py-1 hover:bg-[#2a2b3d] cursor-pointer ${depth === 0 ? 'bg-[#1a1b26]' : ''}`}>
          <div style={{ width: depth * 12 }} className="shrink-0" />
          
          <div className="flex-1 flex items-center gap-2 overflow-hidden">
            {node.children ? (
              <div className="text-gray-500 hover:text-white shrink-0" onClick={() => {
                // Toggle logic mock
              }}>
                {node.open ? "▼" : "▶"}
              </div>
            ) : (
              <div className="w-3 shrink-0" />
            )}
            
            {getIcon(node.type)}
            
            <span className="text-[13px] text-gray-200 truncate">{node.name}</span>
          </div>

          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
            <button className="text-gray-500 hover:text-white" title="Toggle Visibility">
              {node.visible ? <Eye size={14} /> : <EyeOff size={14} className="text-gray-600" />}
            </button>
            <button className="text-gray-500 hover:text-white" title="Toggle Lock">
              {node.locked ? <Lock size={14} className="text-red-400" /> : <Unlock size={14} />}
            </button>
            <div className="w-px h-3 bg-gray-700 mx-1" />
            <button className="text-gray-500 hover:text-green-400"><Plus size={14} /></button>
            <button className="text-gray-500 hover:text-red-400"><Trash2 size={14} /></button>
          </div>
        </div>
        
        {node.children && node.open && (
          <div className="flex flex-col">
            {node.children.map((child: any) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex w-full h-full bg-[#0a0a0f] text-gray-200">
      {/* Scene Hierarchy */}
      <div className="w-[320px] border-r border-[#2a2b3d] flex flex-col bg-[#141525]">
        <div className="p-3 border-b border-[#2a2b3d] flex flex-col gap-3 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
              <Layers size={16} className="text-purple-400" />
              Advanced Scene Editor
            </h2>
            <button className="p-1 bg-blue-600 hover:bg-blue-500 text-white rounded shadow text-xs flex items-center gap-1">
              <Plus size={12} /> Add
            </button>
          </div>
          
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search scene nodes..." 
              className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded pl-8 pr-3 py-1.5 text-xs text-white focus:border-purple-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2 hide-scrollbar">
          {nodes.map(node => renderNode(node))}
        </div>
      </div>

      {/* Main Viewport & Inspector */}
      <div className="flex-1 flex flex-col">
        {/* Viewport Toolbar */}
        <div className="h-10 border-b border-[#2a2b3d] bg-[#141525] flex items-center px-3 justify-between shrink-0">
          <div className="flex items-center gap-1 bg-[#0a0a0f] p-1 rounded border border-[#2a2b3d]">
            <button className="p-1 rounded bg-[#2a2b3d] text-white" title="Translate"><Move size={14} /></button>
            <button className="p-1 rounded hover:bg-[#2a2b3d] text-gray-400 hover:text-white" title="Rotate"><Settings2 size={14} /></button>
            <button className="p-1 rounded hover:bg-[#2a2b3d] text-gray-400 hover:text-white" title="Scale"><Maximize size={14} /></button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Grid:</span>
              <select className="bg-[#0a0a0f] border border-[#2a2b3d] rounded px-2 py-0.5 outline-none">
                <option>1m</option>
                <option>5m</option>
                <option>10m</option>
              </select>
            </div>
            <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-xs">Play Scene</button>
          </div>
        </div>
        
        {/* Viewport Area */}
        <div className="flex-1 relative bg-gradient-to-b from-[#1a1b26] to-[#0a0a0f] flex items-center justify-center overflow-hidden">
           {/* Grid Pattern Background */}
           <div className="absolute inset-0" style={{ 
              backgroundImage: 'linear-gradient(#2a2b3d 1px, transparent 1px), linear-gradient(90deg, #2a2b3d 1px, transparent 1px)', 
              backgroundSize: '40px 40px',
              opacity: 0.2
            }} />
            
            <div className="z-10 text-center flex flex-col items-center">
               <Layers size={48} className="text-purple-500/20 mb-4" />
               <p className="text-gray-400 font-mono text-sm">3D Viewport Simulation</p>
               <p className="text-gray-600 text-xs mt-2">Select a node from the hierarchy to view details</p>
            </div>
            
            {/* Viewport overlay stats */}
            <div className="absolute top-2 left-2 text-[10px] font-mono text-gray-500 bg-black/50 p-2 rounded backdrop-blur">
              FPS: 120 <br/>
              Draw Calls: 45 <br/>
              Tris: 142k
            </div>
        </div>
      </div>
    </div>
  );
}
