import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Eye, 
  ShieldCheck, 
  AlertTriangle, 
  Sliders, 
  CheckCircle2, 
  Palette, 
  Maximize2, 
  RotateCw, 
  Download,
  Flame,
  Grid,
  Zap,
  Activity,
  HardDrive
} from 'lucide-react';

interface TextureMap {
  id: string;
  name: string;
  channel: 'albedo' | 'normal' | 'roughness' | 'metallic' | 'ambient_occlusion' | 'orm_packed' | 'emissive';
  resolution: number;
  texelDensityPxPerMeter: number;
  compressionFormat: 'BC7' | 'BC5' | 'ASTC_6x6' | 'ETC2' | 'PNG_Uncompressed';
  vramKb: number;
  hasInvertedNormalY: boolean;
  status: 'optimal' | 'warning' | 'invalid';
  issue?: string;
}

export default function PBRTextureQualityAuditor() {
  const [activeChannel, setActiveChannel] = useState<string>('orm_packed');
  const [targetTexelDensity, setTargetTexelDensity] = useState<number>(512); // px/m
  const [filterNormalY, setFilterNormalY] = useState<'directx' | 'opengl'>('directx');
  const [activeTab, setActiveTab] = useState<'maps' | 'packer' | 'profiler'>('maps');

  const [textures, setTextures] = useState<TextureMap[]>([
    { id: 'tex_albedo', name: 'T_SciFi_Armor_Albedo.png', channel: 'albedo', resolution: 2048, texelDensityPxPerMeter: 512, compressionFormat: 'BC7', vramKb: 2730, hasInvertedNormalY: false, status: 'optimal' },
    { id: 'tex_normal', name: 'T_SciFi_Armor_Normal.png', channel: 'normal', resolution: 2048, texelDensityPxPerMeter: 512, compressionFormat: 'BC5', vramKb: 2730, hasInvertedNormalY: false, status: 'optimal' },
    { id: 'tex_orm', name: 'T_SciFi_Armor_ORM_Packed.png', channel: 'orm_packed', resolution: 2048, texelDensityPxPerMeter: 512, compressionFormat: 'BC7', vramKb: 2730, hasInvertedNormalY: false, status: 'optimal' },
    { id: 'tex_roughness_raw', name: 'T_Old_Roughness_Standalone.png', channel: 'roughness', resolution: 4096, texelDensityPxPerMeter: 1024, compressionFormat: 'PNG_Uncompressed', vramKb: 16384, hasInvertedNormalY: false, status: 'warning', issue: 'Texel density exceeds budget & uncompressed standalone map (Waste 16MB VRAM)' },
    { id: 'tex_normal_gl', name: 'T_Weapon_Normal_OpenGL.png', channel: 'normal', resolution: 2048, texelDensityPxPerMeter: 512, compressionFormat: 'BC5', vramKb: 2730, hasInvertedNormalY: true, status: 'warning', issue: 'Green channel (Y) inverted for DirectX / Unreal pipeline' },
  ]);

  const totalVramMb = (textures.reduce((acc, t) => acc + t.vramKb, 0) / 1024).toFixed(2);
  const packedVramSavingsMb = 12.4;

  const fixInvertedNormal = (id: string) => {
    setTextures(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, hasInvertedNormalY: false, status: 'optimal', issue: undefined };
      }
      return t;
    }));
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans overflow-hidden">
      {/* Top Header */}
      <div className="h-14 border-b border-[#30363d] bg-[#161b22] px-4 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <Palette className="text-[#ec4899]" size={20} />
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              PBR & Texture Quality Auditor Pro
              <span className="text-[10px] bg-[#ec4899]/20 text-[#f472b6] border border-[#ec4899]/40 px-2 py-0.5 rounded font-mono font-bold">
                ORM PACKING & TEXEL ENGINE
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
            <button
              onClick={() => setActiveTab('maps')}
              className={`px-3 py-1 text-xs font-bold rounded ${activeTab === 'maps' ? 'bg-[#ec4899] text-white shadow' : 'text-[#8b949e]'}`}
            >
              Texture Registry & Diagnostics
            </button>
            <button
              onClick={() => setActiveTab('packer')}
              className={`px-3 py-1 text-xs font-bold rounded ${activeTab === 'packer' ? 'bg-[#3fb950] text-white shadow' : 'text-[#8b949e]'}`}
            >
              Channel Packing (ORM)
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Settings */}
        <div className="w-80 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0 p-4 space-y-5 overflow-y-auto">
          <div>
            <span className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider block mb-2">Target Texel Density Standard</span>
            <select 
              value={targetTexelDensity} 
              onChange={e => setTargetTexelDensity(parseInt(e.target.value))}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-xs text-white"
            >
              <option value={256}>256 px/m (Mobile / Low Spec)</option>
              <option value={512}>512 px/m (Standard PC/Console AAA)</option>
              <option value={1024}>1024 px/m (Hero Character / First Person)</option>
              <option value={2048}>2048 px/m (Cinematic / Cutscene Close-Up)</option>
            </select>
          </div>

          <div className="border-t border-[#30363d] pt-4">
            <span className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider block mb-2">Normal Map Tangent Standard</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterNormalY('directx')}
                className={`flex-1 py-1.5 rounded text-xs font-bold border transition ${
                  filterNormalY === 'directx' ? 'bg-[#58a6ff]/20 border-[#58a6ff] text-[#58a6ff]' : 'bg-[#21262d] border-[#30363d] text-[#8b949e]'
                }`}
              >
                DirectX (+Y Down)
              </button>
              <button
                onClick={() => setFilterNormalY('opengl')}
                className={`flex-1 py-1.5 rounded text-xs font-bold border transition ${
                  filterNormalY === 'opengl' ? 'bg-[#58a6ff]/20 border-[#58a6ff] text-[#58a6ff]' : 'bg-[#21262d] border-[#30363d] text-[#8b949e]'
                }`}
              >
                OpenGL (+Y Up)
              </button>
            </div>
          </div>

          <div className="border-t border-[#30363d] pt-4 bg-[#0d1117] p-3 rounded-lg border border-[#30363d] space-y-2">
            <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider block">VRAM Consumption Stats</span>
            <div className="flex justify-between text-xs">
              <span className="text-[#8b949e]">Total Texture VRAM:</span>
              <span className="text-white font-mono font-bold">{totalVramMb} MB</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#8b949e]">Packed Savings:</span>
              <span className="text-[#3fb950] font-mono font-bold">-{packedVramSavingsMb} MB (45% saved)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#8b949e]">Compression Standard:</span>
              <span className="text-[#58a6ff] font-bold">BC7 / BC5 Block</span>
            </div>
          </div>
        </div>

        {/* Center Canvas / Table */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'maps' && (
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">Active Material Textures & Auditing Matrix</h2>
                <span className="text-xs text-[#8b949e]">{textures.length} Maps Inspected</span>
              </div>

              <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0d1117] text-[#8b949e] uppercase font-bold border-b border-[#30363d]">
                    <tr>
                      <th className="p-3">Texture Name</th>
                      <th className="p-3">Channel / Slot</th>
                      <th className="p-3">Resolution & Density</th>
                      <th className="p-3">Format & Size</th>
                      <th className="p-3">Health Status</th>
                      <th className="p-3 text-right">Fix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#30363d]">
                    {textures.map(tex => (
                      <tr key={tex.id} className="hover:bg-[#1f2937]">
                        <td className="p-3">
                          <div className="font-bold text-white">{tex.name}</div>
                          {tex.issue && <div className="text-[10px] text-[#f85149] mt-0.5">{tex.issue}</div>}
                        </td>
                        <td className="p-3 font-mono uppercase text-[#ec4899] font-bold">{tex.channel}</td>
                        <td className="p-3 font-mono">
                          <div>{tex.resolution} x {tex.resolution}</div>
                          <div className="text-[10px] text-[#8b949e]">{tex.texelDensityPxPerMeter} px/m</div>
                        </td>
                        <td className="p-3 font-mono">
                          <div className="text-[#58a6ff]">{tex.compressionFormat}</div>
                          <div className="text-[10px] text-[#8b949e]">{(tex.vramKb / 1024).toFixed(1)} MB</div>
                        </td>
                        <td className="p-3">
                          {tex.status === 'optimal' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#238636]/20 text-[#3fb950] flex items-center gap-1 w-fit">
                              <CheckCircle2 size={11} /> Optimal
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#d29922]/20 text-[#d29922] flex items-center gap-1 w-fit">
                              <AlertTriangle size={11} /> Incompatible
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {tex.hasInvertedNormalY && (
                            <button
                              onClick={() => fixInvertedNormal(tex.id)}
                              className="px-2 py-1 bg-[#58a6ff] hover:bg-[#1f6feb] text-white text-[11px] font-bold rounded"
                            >
                              Invert Y (Fix)
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'packer' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h2 className="text-base font-bold text-white mb-1">ORM Texture Channel Packing Matrix</h2>
                <p className="text-xs text-[#8b949e]">
                  Combine Occlusion (Red), Roughness (Green), and Metallic (Blue) into a single 4-channel texture to reduce texture sample fetch overhead by 66%.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-[#161b22] border border-[#f85149]/40 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-[#f85149] uppercase">Red Channel (R)</div>
                  <div className="font-bold text-white text-sm">Ambient Occlusion (AO)</div>
                  <div className="text-[11px] text-[#8b949e]">Bakes contact shadow depth details</div>
                </div>

                <div className="p-4 bg-[#161b22] border border-[#3fb950]/40 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-[#3fb950] uppercase">Green Channel (G)</div>
                  <div className="font-bold text-white text-sm">Roughness / Smoothness</div>
                  <div className="text-[11px] text-[#8b949e]">Controls microfacet blur & specular highlights</div>
                </div>

                <div className="p-4 bg-[#161b22] border border-[#58a6ff]/40 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-[#58a6ff] uppercase">Blue Channel (B)</div>
                  <div className="font-bold text-white text-sm">Metallic Conductor</div>
                  <div className="text-[11px] text-[#8b949e]">Distinguishes dielectric vs metallic conductors</div>
                </div>
              </div>

              <button className="w-full py-3 bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2">
                <Sparkles size={14} /> Batch Pack ORM Channels & Compress with BC7
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
