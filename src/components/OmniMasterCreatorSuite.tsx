/**
 * @file OmniMasterCreatorSuite.tsx
 * @description
 * ============================================================================
 * [THAI]
 * ศูนย์รวมโปรแกรมและสตูดิโอสร้างสรรค์ 8 ระบบหลักแบบครบวงจร (Omni 8-in-1 Master Creator Suite)
 * รวม 8 สตูดิโอระดับมืออาชีพในแพลตฟอร์มเดียว:
 *   1. โปรแกรมสร้างเกม เขียนเกม (Omni Game Creation Studio)
 *   2. โปรแกรมสร้างโปรแกรม เขียนโปรแกรม (Omni Software IDE Studio)
 *   3. โปรแกรมสร้างโมเดล 3D 2D VR สำหรับเกม และแผนที่ (Omni 3D/2D/VR Model Studio)
 *   4. โปรแกรมสร้างแผนที่ 3D 2D VR (Omni World Map Studio)
 *   5. โปรแกรมสร้าง เขียน ตกแต่ง จัดการ ตัดต่อ รูปภาพ เท็กเจอร์ คัทซีนเกม (Omni Texture & Cinematic Studio)
 *   6. โปรแกรมสร้าง เขียน ตกแต่ง จัดการ เสียงดนตรี คำพากย์ เสียงพากย์ เพลง ร้องเพลง (Omni Music & Vocal DAW)
 *   7. โปรแกรมแปลภาษาสำหรับเกม และโปรแกรม (Omni Localization Studio)
 *   8. โปรแกรมจัดการ PCB แบบมืออาชีพ (Omni Professional PCB CAD Studio)
 *
 * [ENGLISH]
 * Enterprise 8-in-1 Master Creator Suite & Omniverse Studio Platform.
 * Seamlessly integrates all 8 creation ecosystems with instant switching and pipeline integration.
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  Gamepad2, Code2, Box, Globe, Film, Disc,
  Languages, CircuitBoard, Sparkles, Layers, ArrowRight
} from 'lucide-react';

import OmniGameCreationStudio from './OmniGameCreationStudio';
import OmniSoftwareIDEStudio from './OmniSoftwareIDEStudio';
import Omni3D2DVRModelStudio from './Omni3D2DVRModelStudio';
import OmniWorldMapStudio from './OmniWorldMapStudio';
import OmniTextureCinematicStudio from './OmniTextureCinematicStudio';
import OmniMusicVocalDAWStudio from './OmniMusicVocalDAWStudio';
import OmniLocalizationStudio from './OmniLocalizationStudio';
import OmniPCBDesignStudio from './OmniPCBDesignStudio';

interface OmniMasterCreatorSuiteProps {
  onSelectTool?: (toolId: string) => void;
}

export default function OmniMasterCreatorSuite({ onSelectTool }: OmniMasterCreatorSuiteProps = {}) {
  const [activeSystem, setActiveSystem] = useState<number>(1);

  const systems = [
    {
      id: 1,
      name: '1. โปรแกรมสร้างเกม เขียนเกม',
      enName: 'Omni Game Creation Studio',
      icon: <Gamepad2 className="w-5 h-5 text-emerald-400" />,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-300',
      activeBadge: 'bg-emerald-500 text-slate-950',
      desc: 'ECS Game Engine, Scene Viewport 60fps, Live Scripting, Playtest Sandbox & Standalone Exporter'
    },
    {
      id: 2,
      name: '2. โปรแกรมสร้างโปรแกรม เขียนโปรแกรม',
      enName: 'Omni Software IDE Studio',
      icon: <Code2 className="w-5 h-5 text-sky-400" />,
      color: 'from-sky-500/20 to-indigo-500/10 border-sky-500/40 text-sky-300',
      activeBadge: 'bg-sky-500 text-white',
      desc: 'Multi-Framework IDE (React, Python, Node, Rust), Component Tree, VM Sandbox & Code Exporter'
    },
    {
      id: 3,
      name: '3. โปรแกรมสร้างโมเดล 3D 2D VR',
      enName: 'Omni 3D/2D/VR Model Studio',
      icon: <Box className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-300',
      activeBadge: 'bg-amber-500 text-slate-950',
      desc: 'Parametric 3D Geometry, 2D Pixel Extruder, Realtime Sculpting & Wavefront .OBJ Exporter'
    },
    {
      id: 4,
      name: '4. โปรแกรมสร้างแผนที่ 3D 2D VR',
      enName: 'Omni World Map Studio',
      icon: <Globe className="w-5 h-5 text-teal-400" />,
      color: 'from-teal-500/20 to-emerald-500/10 border-teal-500/40 text-teal-300',
      activeBadge: 'bg-teal-500 text-slate-950',
      desc: 'Procedural Heightmap, Biome Classification, 2D/3D Isometric Viewports & NavMesh Waypoints'
    },
    {
      id: 5,
      name: '5. เท็กเจอร์ รูปภาพ และคัทซีนเกม',
      enName: 'Omni Texture & Cinematic Studio',
      icon: <Film className="w-5 h-5 text-purple-400" />,
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/40 text-purple-300',
      activeBadge: 'bg-purple-500 text-white',
      desc: 'PBR 4-Channel Synthesis (Albedo, Normal, Roughness, AO) & Non-Linear Timeline Director'
    },
    {
      id: 6,
      name: '6. เสียงดนตรี เสียงพากย์ และเพลงร้อง',
      enName: 'Omni Music & Vocal DAW',
      icon: <Disc className="w-5 h-5 text-yellow-400" />,
      color: 'from-yellow-500/20 to-amber-500/10 border-yellow-500/40 text-yellow-300',
      activeBadge: 'bg-yellow-500 text-slate-950',
      desc: '16-Step Polyphonic DAW Sequencer, Formant Vocal Singing, Dubbing Matrix & Game SFX Lab'
    },
    {
      id: 7,
      name: '7. โปรแกรมแปลภาษาสำหรับเกม/โปรแกรม',
      enName: 'Omni Localization Studio',
      icon: <Languages className="w-5 h-5 text-cyan-400" />,
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-300',
      activeBadge: 'bg-cyan-500 text-slate-950',
      desc: '8-Language Translation Matrix, Terminology Glossary Lock, UI Overflow Safety & i18n JSON'
    },
    {
      id: 8,
      name: '8. โปรแกรมจัดการ PCB แบบมืออาชีพ',
      enName: 'Omni PCB Design Studio',
      icon: <CircuitBoard className="w-5 h-5 text-emerald-400" />,
      color: 'from-emerald-600/20 to-green-500/10 border-emerald-600/40 text-emerald-300',
      activeBadge: 'bg-emerald-600 text-white',
      desc: 'Multi-Layer CAD Routing, Component Footprints, Realtime DRC, BOM Estimator & Gerber RS-274X'
    }
  ];

  return (
    <div id="omni-master-suite-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Global Master Navigation Banner */}
      <section className="bg-slate-900/90 border-b border-slate-800 px-6 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Omni 8-in-1 Master Creator Suite & Engine Hub
            </h1>
            <p className="text-xs text-slate-400">
              ศูนย์รวม 8 โปรแกรมและอัลกอริทึมสำหรับสร้างเกม ซอฟต์แวร์ โมเดล แผนที่ อาร์ต ดนตรี แปลภาษา และ PCB ครบวงจร
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {systems.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSystem(s.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                  activeSystem === s.id
                    ? s.activeBadge + ' shadow-lg scale-105'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                {s.icon}
                <span className="hidden sm:inline">{s.name.split(' ')[0]} {s.name.split(' ')[1]}</span>
                <span className="sm:hidden">{s.id}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Render Active Studio Subsystem */}
      <div className="flex-1">
        {activeSystem === 1 && <OmniGameCreationStudio />}
        {activeSystem === 2 && <OmniSoftwareIDEStudio />}
        {activeSystem === 3 && <Omni3D2DVRModelStudio />}
        {activeSystem === 4 && <OmniWorldMapStudio />}
        {activeSystem === 5 && <OmniTextureCinematicStudio />}
        {activeSystem === 6 && <OmniMusicVocalDAWStudio />}
        {activeSystem === 7 && <OmniLocalizationStudio />}
        {activeSystem === 8 && <OmniPCBDesignStudio />}
      </div>
    </div>
  );
}
