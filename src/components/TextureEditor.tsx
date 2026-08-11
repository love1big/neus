import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Image as ImageIcon, Trash2, Sliders, Save, FileDown } from 'lucide-react';

interface Texture {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  type: string;
}

export default function TextureEditor() {
  const [textures, setTextures] = useState<Texture[]>([
    { id: '1', name: 'grass_albedo.png', url: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&q=80&w=256&h=256', width: 256, height: 256, type: 'Albedo' },
    { id: '2', name: 'brick_normal.png', url: 'https://images.unsplash.com/photo-1587155823708-3ab94d0c9f1a?auto=format&fit=crop&q=80&w=256&h=256', width: 256, height: 256, type: 'Normal' },
  ]);
  const [selectedTextureId, setSelectedTextureId] = useState<string | null>('1');

  const selectedTexture = textures.find(t => t.id === selectedTextureId);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Mock upload for demonstration
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newTexture: Texture = {
        id: Date.now().toString(),
        name: file.name,
        url: URL.createObjectURL(file), // create temporary local url
        width: 512,
        height: 512,
        type: 'Albedo',
      };
      setTextures([...textures, newTexture]);
      setSelectedTextureId(newTexture.id);
    }
  };

  const handleDelete = (id: string) => {
    setTextures(textures.filter(t => t.id !== id));
    if (selectedTextureId === id) setSelectedTextureId(null);
  };

  return (
    <div className="flex h-full bg-slate-900 text-slate-200">
      {/* Left Sidebar - Texture Library */}
      <div className="w-64 border-r border-slate-700 bg-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900">
          <h2 className="font-semibold text-slate-100 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            Texture Library
          </h2>
        </div>
        <div className="p-2 border-b border-slate-700">
          <label className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md cursor-pointer transition-colors text-sm font-medium">
            <Upload className="w-4 h-4" />
            Upload Texture
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
          </label>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {textures.map(texture => (
            <div
              key={texture.id}
              onClick={() => setSelectedTextureId(texture.id)}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors group ${
                selectedTextureId === texture.id ? 'bg-indigo-600' : 'hover:bg-slate-700'
              }`}
            >
              <div className="w-10 h-10 rounded overflow-hidden bg-slate-950 shrink-0">
                <img src={texture.url} alt={texture.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{texture.name}</p>
                <p className="text-xs text-slate-400 truncate">{texture.type} • {texture.width}x{texture.height}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(texture.id); }}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Workspace - Texture Viewer & Settings */}
      <div className="flex-1 flex flex-col">
        {selectedTexture ? (
          <>
            {/* Top Toolbar */}
            <div className="h-12 border-b border-slate-700 bg-slate-800 flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm text-slate-300">{selectedTexture.name}</span>
                <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-400">
                  {selectedTexture.width} x {selectedTexture.height} px
                </span>
              </div>
              <div className="flex items-center gap-2">
                 <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors">
                   <FileDown className="w-4 h-4" /> Export
                 </button>
                 <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-sm transition-colors">
                   <Save className="w-4 h-4" /> Save
                 </button>
              </div>
            </div>

            {/* Viewer Area */}
            <div className="flex-1 flex bg-slate-950 relative overflow-hidden">
              {/* Pattern Background for Transparency */}
              <div 
                className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />
              
              <div className="flex-1 flex items-center justify-center p-8 z-10 relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative group shadow-2xl rounded-lg overflow-hidden border border-slate-800"
                >
                  <img
                    src={selectedTexture.url}
                    alt={selectedTexture.name}
                    className="max-w-full max-h-[70vh] object-contain"
                    style={{ imageRendering: 'pixelated' }} // Great for pixel art or sharp textures
                  />
                </motion.div>
              </div>

              {/* Right Settings Panel */}
              <div className="w-72 border-l border-slate-700 bg-slate-800 p-4 overflow-y-auto z-20 shadow-xl">
                <div className="flex items-center gap-2 mb-6 text-slate-100 font-semibold">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  Texture Properties
                </div>

                <div className="space-y-6">
                  {/* Map Type */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Map Type</label>
                    <select 
                      className="w-full bg-slate-900 border border-slate-700 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:border-indigo-500"
                      value={selectedTexture.type}
                      onChange={() => {}} // Mock
                    >
                      <option value="Albedo">Albedo (Color)</option>
                      <option value="Normal">Normal Map</option>
                      <option value="Roughness">Roughness</option>
                      <option value="Metallic">Metallic</option>
                      <option value="Emissive">Emissive</option>
                      <option value="AmbientOcclusion">Ambient Occlusion</option>
                    </select>
                  </div>

                  {/* Filtering */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Filtering</label>
                    <select className="w-full bg-slate-900 border border-slate-700 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:border-indigo-500">
                      <option>Bilinear</option>
                      <option>Trilinear</option>
                      <option>Point (No Filter)</option>
                    </select>
                  </div>

                  {/* Wrap Mode */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Wrap Mode</label>
                    <select className="w-full bg-slate-900 border border-slate-700 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:border-indigo-500">
                      <option>Repeat</option>
                      <option>Clamp</option>
                      <option>Mirror</option>
                    </select>
                  </div>

                  {/* Adjustments (Mock Sliders) */}
                  <div className="space-y-4 pt-4 border-t border-slate-700">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Adjustments</label>
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Brightness</span>
                        <span>0</span>
                      </div>
                      <input type="range" min="-100" max="100" defaultValue="0" className="w-full accent-indigo-500" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Contrast</span>
                        <span>0</span>
                      </div>
                      <input type="range" min="-100" max="100" defaultValue="0" className="w-full accent-indigo-500" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Saturation</span>
                        <span>0</span>
                      </div>
                      <input type="range" min="-100" max="100" defaultValue="0" className="w-full accent-indigo-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-slate-950">
            <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
            <p>Select a texture from the library or upload a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
