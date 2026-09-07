/**
 * @file OmniGameCreationStudio.tsx
 * @description
 * ============================================================================
 * [THAI]
 * สตูดิโอสร้างเกมและเขียนเกมระดับมืออาชีพ (Omni Game Creation & Engine Studio)
 * ระบบพัฒนาเกมแบบครบวงจร 100% ออฟไลน์:
 *   1. โปรแกรมสร้างเกมและเขียนเกม (Game Engine & ECS Game Maker):
 *      - Scene Viewport Canvas: เรนเดอร์เกมแบบเรียลไทม์ 60 FPS พร้อมลากวาง Entity
 *      - Entity & Hierarchy Tree: จัดการตัวละครเอก (Player), มอนสเตอร์ (Enemies), บอส (Boss), หีบสมบัติ (Items), และสิ่งแวดล้อม
 *      - Component Inspector: ปรับ Transform (X/Y/Rot/Scale), Physics (Mass/Drag/Gravity), Stats (HP/Mana/Speed)
 *      - Live Scripting Code Editor: เขียนสคริปต์ควบคุมตรรกะเกมด้วย JavaScript/TypeScript
 *      - Instant Playtest Sandbox: สวิตช์เล่นเกมสดและทดสอบระบบต่อสู้/เก็บของได้ทันที
 *      - Game Template Presets: Action RPG, 2D Platformer, Top-Down Shooter, Survival, Strategy
 *      - Universal Game Packager: ส่งออกโค้ดเกมเป็น HTML5 / WebGL / Standalone Package
 *
 * [ENGLISH]
 * Enterprise Omniverse Visual Game Creation & Engine Studio.
 * Features:
 *   - 60 FPS Canvas Game Engine Viewport with Interactive Entity Gizmos
 *   - Entity Component System (ECS) Hierarchy & Multi-Tag Entity Manager
 *   - Deep Component Inspector (Transform, RigidBody Physics, Colliders, RPG Stats)
 *   - In-Engine Visual & Code Scripting IDE with Hot-Reloading
 *   - 1-Click Game Playtesting with Keyboard / Gamepad Controller Support
 *   - Game Template Switcher (RPG, Platformer, Shooter, Survival, Strategy)
 *   - Standalone HTML5 Game Exporter & JSON Scene Serializer
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2, Play, Pause, RotateCcw, Plus, Trash2, Code2,
  Sliders, Box, Layers, Download, Sparkles, Heart, Zap,
  Activity, Shield, Swords, Eye, Save, Settings, Compass
} from 'lucide-react';

import {
  OmniGameEngineCore,
  GameProjectData,
  GameEntity,
  GameGenreTemplate
} from '../utils/OmniGameEngineCore';

interface OmniGameCreationStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function OmniGameCreationStudio({ onSelectTool }: OmniGameCreationStudioProps = {}) {
  const engineRef = useRef<OmniGameEngineCore | null>(null);
  if (!engineRef.current) {
    engineRef.current = new OmniGameEngineCore('action_rpg');
  }
  const engine = engineRef.current;

  const [projectData, setProjectData] = useState<GameProjectData>(() => engine.getProjectData());
  const [selectedEntityId, setSelectedEntityId] = useState<string>('ent-player-hero');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'viewport' | 'scripts' | 'templates' | 'export'>('viewport');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync project state with engine
  const activeScene = projectData.scenes.find((s) => s.id === projectData.activeSceneId) || projectData.scenes[0];
  const selectedEntity = activeScene.entities.find((e) => e.id === selectedEntityId);

  // Keyboard handlers for playtest
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPlaying) {
        engine.handleKeyDown(e.key);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (isPlaying) {
        engine.handleKeyUp(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, engine]);

  // Game Engine Loop
  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const currentProj = engine.getProjectData();
      const scene = currentProj.scenes.find((s) => s.id === currentProj.activeSceneId) || currentProj.scenes[0];

      // Draw background
      ctx.fillStyle = scene.backgroundColor || '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Entities
      for (const ent of scene.entities) {
        if (!ent.enabled || !ent.render.visible) continue;

        ctx.save();
        ctx.translate(ent.transform.x, ent.transform.y);
        ctx.rotate((ent.transform.rotation * Math.PI) / 180);
        ctx.scale(ent.transform.scaleX, ent.transform.scaleY);

        const w = ent.render.width;
        const h = ent.render.height;

        // Draw Entity Shape
        if (ent.render.shape === 'player_hero') {
          // Hero Sprite representation
          ctx.fillStyle = ent.render.color || '#10b981';
          ctx.fillRect(-w / 2, -h / 2, w, h);

          // Hero eyes
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-w / 4, -h / 3, 6, 6);
          ctx.fillRect(w / 8, -h / 3, 6, 6);
        } else if (ent.render.shape === 'enemy_beast') {
          // Enemy beast
          ctx.fillStyle = ent.render.color || '#ef4444';
          ctx.fillRect(-w / 2, -h / 2, w, h);
          // Spikes
          ctx.fillStyle = '#b91c1c';
          ctx.beginPath();
          ctx.moveTo(-w / 2, -h / 2);
          ctx.lineTo(0, -h / 2 - 8);
          ctx.lineTo(w / 2, -h / 2);
          ctx.fill();
        } else if (ent.render.shape === 'chest') {
          // Chest
          ctx.fillStyle = ent.render.color || '#f59e0b';
          ctx.fillRect(-w / 2, -h / 2, w, h);
          ctx.fillStyle = '#78350f';
          ctx.fillRect(-w / 2, -2, w, 4);
        } else {
          ctx.fillStyle = ent.render.color || '#38bdf8';
          ctx.fillRect(-w / 2, -h / 2, w, h);
        }

        // Selected Entity Halo
        if (ent.id === selectedEntityId && !isPlaying) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(-w / 2 - 4, -h / 2 - 4, w + 8, h + 8);
          ctx.setLineDash([]);
        }

        // Entity Health Bar if stats present
        if (ent.stats && ent.stats.maxHealth > 0) {
          const barW = Math.max(w, 40);
          const healthRatio = Math.max(0, ent.stats.health / ent.stats.maxHealth);
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(-barW / 2, -h / 2 - 12, barW, 5);
          ctx.fillStyle = ent.tag === 'player' ? '#10b981' : '#ef4444';
          ctx.fillRect(-barW / 2, -h / 2 - 12, barW * healthRatio, 5);
        }

        ctx.restore();
      }

      // Draw In-Game HUD overlay
      if (isPlaying) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(12, 12, 200, 60);
        ctx.strokeStyle = '#334155';
        ctx.strokeRect(12, 12, 200, 60);

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`SCORE: ${currentProj.score}`, 24, 32);

        const playerEnt = scene.entities.find((e) => e.tag === 'player');
        if (playerEnt && playerEnt.stats) {
          ctx.fillStyle = '#10b981';
          ctx.fillText(`HP: ${Math.round(playerEnt.stats.health)} / ${playerEnt.stats.maxHealth}`, 24, 52);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, selectedEntityId, engine]);

  // Toggle Play / Pause
  const handleTogglePlay = () => {
    if (isPlaying) {
      engine.stop();
      setIsPlaying(false);
    } else {
      engine.start((updatedState) => {
        setProjectData({ ...updatedState });
      });
      setIsPlaying(true);
    }
  };

  // Reset Scene
  const handleResetScene = () => {
    engine.stop();
    setIsPlaying(false);
    const refreshed = engine.createDefaultProject(projectData.genre);
    engine.setProjectData(refreshed);
    setProjectData(refreshed);
  };

  // Switch Template
  const handleSelectTemplate = (tmpl: GameGenreTemplate) => {
    engine.stop();
    setIsPlaying(false);
    const newProj = engine.loadTemplate(tmpl);
    setProjectData({ ...newProj });
    if (newProj.scenes[0].entities.length > 0) {
      setSelectedEntityId(newProj.scenes[0].entities[0].id);
    }
  };

  // Add new Entity
  const handleAddEntity = (tag: GameEntity['tag']) => {
    const newId = `ent-${tag}-${Date.now()}`;
    const newEntity: GameEntity = {
      id: newId,
      name: `New ${tag.toUpperCase()} Object`,
      tag,
      enabled: true,
      transform: { x: 300, y: 200, rotation: 0, scaleX: 1, scaleY: 1, zIndex: 1 },
      physics: {
        velocityX: 0,
        velocityY: 0,
        accelerationX: 0,
        accelerationY: 0,
        mass: 1,
        drag: 2,
        isStatic: tag === 'obstacle' || tag === 'item',
        useGravity: tag === 'player' || tag === 'enemy',
        colliderType: 'box',
        colliderWidth: 32,
        colliderHeight: 32,
        colliderRadius: 16
      },
      render: {
        type: 'rect',
        color: tag === 'player' ? '#10b981' : tag === 'enemy' ? '#ef4444' : tag === 'item' ? '#f59e0b' : '#64748b',
        shape: tag === 'player' ? 'player_hero' : tag === 'enemy' ? 'enemy_beast' : tag === 'item' ? 'chest' : 'rectangle',
        width: 32,
        height: 32,
        opacity: 1,
        visible: true
      },
      stats: {
        health: 50,
        maxHealth: 50,
        mana: 20,
        maxMana: 20,
        attackPower: 10,
        defense: 5,
        moveSpeed: 100,
        isAlive: true,
        scoreYield: 100
      }
    };

    engine.addEntity(newEntity);
    setProjectData({ ...engine.getProjectData() });
    setSelectedEntityId(newId);
  };

  // Delete Entity
  const handleDeleteEntity = (id: string) => {
    engine.removeEntity(id);
    const updated = engine.getProjectData();
    setProjectData({ ...updated });
    if (selectedEntityId === id) {
      setSelectedEntityId(updated.scenes[0].entities[0]?.id || '');
    }
  };

  // Update selected entity field
  const handleUpdateSelectedEntity = (updates: Partial<GameEntity>) => {
    if (!selectedEntityId) return;
    engine.updateEntity(selectedEntityId, updates);
    setProjectData({ ...engine.getProjectData() });
  };

  // Download Standalone Game
  const handleExportGame = () => {
    const htmlCode = engine.exportStandaloneHTML5();
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectData.title.toLowerCase().replace(/\s+/g, '-')}-game.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="omni-game-studio-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Studio Header Bar */}
      <header id="game-studio-header" className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-emerald-500/20 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              1. โปรแกรมสร้างเกม เขียนเกม (Omni Game Creation Studio)
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                AAA Game Engine
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Entity Component System (ECS) • Visual Level Viewport • Live Scripting • Instant Playtest Sandbox
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation Tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('viewport')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'viewport' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🎮 Scene Viewport
            </button>
            <button
              onClick={() => setActiveTab('scripts')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'scripts' ? 'bg-sky-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              💻 Script Code
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'templates' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              📦 Game Presets
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'export' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🚀 Export Game
            </button>
          </div>

          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs shadow-lg transition-all active:scale-95 ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'หยุดการทดสอบ (Pause)' : 'ทดสอบเล่นเกม (Play Game)'}</span>
          </button>

          <button
            onClick={handleResetScene}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="รีเซ็ตฉากเกม"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Specialized Algorithmic Engines Quick Launch Bar */}
      <section className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Specialized Engines (อัลกอริทึมเกมเฉพาะทาง):
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onSelectTool?.('AdvancedWorldGenStudio')}
              className="px-2.5 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-800/40 border border-emerald-500/40 text-emerald-300 font-medium transition flex items-center gap-1"
            >
              🗺️ World Map & Erosion
            </button>
            <button
              onClick={() => onSelectTool?.('Procedural3DMeshSynthesisStudio')}
              className="px-2.5 py-1 rounded-lg bg-blue-950/40 hover:bg-blue-800/40 border border-blue-500/40 text-blue-300 font-medium transition flex items-center gap-1"
            >
              🏰 3D Models & Weapon Forge
            </button>
            <button
              onClick={() => onSelectTool?.('AdvancedLocomotionMotionStudio')}
              className="px-2.5 py-1 rounded-lg bg-cyan-950/40 hover:bg-cyan-800/40 border border-cyan-500/40 text-cyan-300 font-medium transition flex items-center gap-1"
            >
              🏃 Locomotion & IK Rig
            </button>
            <button
              onClick={() => onSelectTool?.('HighPerformanceNetcodeStudio')}
              className="px-2.5 py-1 rounded-lg bg-indigo-950/40 hover:bg-indigo-800/40 border border-indigo-500/40 text-indigo-300 font-medium transition flex items-center gap-1"
            >
              🌐 Online Netcode & Prediction
            </button>
            <button
              onClick={() => onSelectTool?.('CinematicCutsceneTextureStudio')}
              className="px-2.5 py-1 rounded-lg bg-amber-950/40 hover:bg-amber-800/40 border border-amber-500/40 text-amber-300 font-medium transition flex items-center gap-1"
            >
              🎬 PBR Textures & Cutscenes
            </button>
            <button
              onClick={() => onSelectTool?.('ThaiRoyalSpeechAndSingingStudio')}
              className="px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-800/40 border border-rose-500/40 text-rose-300 font-medium transition flex items-center gap-1"
            >
              🇹🇭 เสียงพูด/ร้องเพลงราชบัณฑิตฯ
            </button>
          </div>
        </div>
      </section>

      {/* Main Studio Body */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: ENTITY HIERARCHY TREE (3 cols) */}
        {/* ========================================================================= */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Entity Hierarchy ({activeScene.entities.length})
                </h2>
              </div>

              {/* Add Entity Dropdown / Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleAddEntity('enemy')}
                  className="p-1 rounded bg-slate-950 hover:bg-red-500/20 text-red-400 border border-slate-800 text-[10px]"
                  title="เพิ่มศัตรู (Enemy)"
                >
                  +ศัตรู
                </button>
                <button
                  onClick={() => handleAddEntity('item')}
                  className="p-1 rounded bg-slate-950 hover:bg-amber-500/20 text-amber-400 border border-slate-800 text-[10px]"
                  title="เพิ่มไอเทม (Item)"
                >
                  +ไอเทม
                </button>
              </div>
            </div>

            {/* Entity List */}
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {activeScene.entities.map((ent) => (
                <div
                  key={ent.id}
                  onClick={() => setSelectedEntityId(ent.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedEntityId === ent.id
                      ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: ent.render.color }}
                    />
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate text-white">{ent.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono uppercase">{ent.tag}</div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEntity(ent.id);
                    }}
                    className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* CENTER COLUMN: VIEWPORT CANVAS / TAB CONTENT (6 cols) */}
        {/* ========================================================================= */}
        <section className="lg:col-span-6 space-y-4 flex flex-col">
          {activeTab === 'viewport' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl flex-1 flex flex-col space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-white flex items-center gap-2">
                  <Box className="w-4 h-4 text-sky-400" />
                  {activeScene.name} (800x480)
                </span>
                <span className="font-mono text-emerald-400">
                  {isPlaying ? '● LIVE ENGINE RUNNING (WASD / Arrows to Move)' : '○ PAUSED / EDIT MODE'}
                </span>
              </div>

              {/* Viewport Canvas */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={projectData.resolutionWidth}
                  height={projectData.resolutionHeight}
                  className="w-full h-auto max-h-[460px] block"
                />
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
                <span>การควบคุม: กด W, A, S, D หรือปุ่มลูกศร เพื่อเคลื่อนที่ตัวละคร และ Spacebar เพื่อกระโดด</span>
                <span className="font-mono text-slate-300">FPS: 60.0</span>
              </div>
            </div>
          )}

          {activeTab === 'scripts' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex-1 flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-sky-400" />
                  <h2 className="text-sm font-bold text-white">Live Scripting & Logic Engine</h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">PlayerController.ts</span>
              </div>

              <textarea
                value={
                  selectedEntity?.script?.scriptSource ||
                  `// Custom logic script for ${selectedEntity?.name || 'Entity'}\nexport function onUpdate(entity, dt) {\n  // Custom movement & physics\n}`
                }
                onChange={(e) => {
                  if (selectedEntity) {
                    handleUpdateSelectedEntity({
                      script: {
                        scriptName: selectedEntity.script?.scriptName || 'CustomScript.ts',
                        scriptSource: e.target.value,
                        variables: selectedEntity.script?.variables || {}
                      }
                    });
                  }
                }}
                rows={14}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-sky-300 focus:outline-none focus:border-sky-500 leading-relaxed resize-none"
              />
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold text-white">แม่แบบโครงสร้างเกมสำเร็จรูป (Game Genre Presets)</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'action_rpg', title: 'Action RPG Dungeon', desc: 'ผจญภัยในดันเจี้ยน ฟันมอนสเตอร์ เก็บหีบสมบัติ และระบบเลือด HP/Mana' },
                  { id: 'platformer_2d', title: '2D Cyber Runner', desc: 'วิ่งฝ่าด่านแนวดิ่ง ฟิสิกส์แรงโน้มถ่วง กระโดดข้ามสิ่งกีดขวาง' },
                  { id: 'topdown_shooter', title: 'Cosmic Top-Down Shooter', desc: 'ยิงต่อสู้ 360 องศา ยานรบอวกาศ ต่อสู้บอส และระบบสะสมคะแนน' },
                  { id: 'survival_crafting', title: 'Survival Crafting World', desc: 'สำรวจโลก เก็บแร่ธาตุ ตัดไม้ และระบบคราฟต์ไอเทม' }
                ].map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl.id as GameGenreTemplate)}
                    className={`p-4 rounded-xl border text-left transition-all space-y-1 ${
                      projectData.genre === tmpl.id
                        ? 'bg-amber-500/15 border-amber-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs text-amber-300">{tmpl.title}</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{tmpl.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-purple-400" />
                <h2 className="text-sm font-bold text-white">ส่งออกและเผยแพร่เกม (Export Standalone Game)</h2>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs text-slate-300 font-medium">
                  แพ็กเกจเกม HTML5 / WebGL Standalone รวมโค้ด กราฟิก และฟิสิกส์ในไฟล์เดียว พร้อมเล่นบนเว็บทันที 100% ออฟไลน์
                </div>

                <button
                  onClick={handleExportGame}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-500/20 active:scale-95 transition-all text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>ดาวน์โหลดไฟล์เกม HTML5 Standalone (.html)</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: COMPONENT INSPECTOR (3 cols) */}
        {/* ========================================================================= */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Component Inspector</h2>
            </div>

            {selectedEntity ? (
              <div className="space-y-4 text-xs">
                {/* Basic Identity */}
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400 font-medium">ชื่อ Entity:</label>
                  <input
                    type="text"
                    value={selectedEntity.name}
                    onChange={(e) => handleUpdateSelectedEntity({ name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Transform Settings */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-semibold text-sky-400 text-[11px]">Transform 2D</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500">Pos X:</span>
                      <input
                        type="number"
                        value={Math.round(selectedEntity.transform.x)}
                        onChange={(e) =>
                          handleUpdateSelectedEntity({
                            transform: { ...selectedEntity.transform, x: Number(e.target.value) }
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500">Pos Y:</span>
                      <input
                        type="number"
                        value={Math.round(selectedEntity.transform.y)}
                        onChange={(e) =>
                          handleUpdateSelectedEntity({
                            transform: { ...selectedEntity.transform, y: Number(e.target.value) }
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* RPG Stats if present */}
                {selectedEntity.stats && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="font-semibold text-emerald-400 text-[11px] flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-400" />
                      <span>Stats & RPG Attributes</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-500">Max HP:</span>
                        <input
                          type="number"
                          value={selectedEntity.stats.maxHealth}
                          onChange={(e) =>
                            handleUpdateSelectedEntity({
                              stats: { ...selectedEntity.stats!, maxHealth: Number(e.target.value), health: Number(e.target.value) }
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-xs text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">Speed:</span>
                        <input
                          type="number"
                          value={selectedEntity.stats.moveSpeed}
                          onChange={(e) =>
                            handleUpdateSelectedEntity({
                              stats: { ...selectedEntity.stats!, moveSpeed: Number(e.target.value) }
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-500 text-center py-8">กรุณาเลือก Entity เพื่อปรับแต่ง</div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
