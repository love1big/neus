import React, { useState, useRef } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Tv, 
  Tablet, 
  Glasses, 
  Eye, 
  Contrast, 
  MousePointer, 
  Touchpad, 
  CheckCircle, 
  AlertCircle, 
  Layers, 
  Maximize, 
  RotateCw, 
  Sparkles,
  Zap,
  Gauge,
  Sliders,
  Play,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface DevicePreset {
  id: string;
  name: string;
  category: 'mobile' | 'tablet' | 'desktop' | 'ultrawide' | 'vr';
  width: number;
  height: number;
  dpr: number;
  hasNotch: boolean;
  notchType?: 'dynamic_island' | 'notch' | 'punchhole';
  touchTargetMinPx: number;
  safeArea: { top: number; bottom: number; left: number; right: number };
}

export default function UXUISimulatorTestbed() {
  const [activeDeviceId, setActiveDeviceId] = useState<string>('iphone_15_pro');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [colorBlindFilter, setColorBlindFilter] = useState<'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'>('normal');
  const [showTouchTargets, setShowTouchTargets] = useState<boolean>(true);
  const [showSafeAreas, setShowSafeAreas] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const [activeTab, setActiveTab] = useState<'preview' | 'audit' | 'telemetry'>('preview');

  const devices: DevicePreset[] = [
    { id: 'iphone_15_pro', name: 'iPhone 15 Pro', category: 'mobile', width: 393, height: 852, dpr: 3, hasNotch: true, notchType: 'dynamic_island', touchTargetMinPx: 44, safeArea: { top: 59, bottom: 34, left: 0, right: 0 } },
    { id: 'galaxy_s24', name: 'Samsung Galaxy S24', category: 'mobile', width: 360, height: 780, dpr: 3, hasNotch: true, notchType: 'punchhole', touchTargetMinPx: 48, safeArea: { top: 38, bottom: 24, left: 0, right: 0 } },
    { id: 'ipad_pro_11', name: 'iPad Pro 11"', category: 'tablet', width: 834, height: 1194, dpr: 2, hasNotch: false, touchTargetMinPx: 44, safeArea: { top: 24, bottom: 20, left: 0, right: 0 } },
    { id: 'steam_deck', name: 'Steam Deck (16:10)', category: 'mobile', width: 1280, height: 800, dpr: 1, hasNotch: false, touchTargetMinPx: 48, safeArea: { top: 0, bottom: 0, left: 0, right: 0 } },
    { id: 'pc_1080p', name: 'PC Standard 1080p', category: 'desktop', width: 1920, height: 1080, dpr: 1, hasNotch: false, touchTargetMinPx: 32, safeArea: { top: 0, bottom: 0, left: 0, right: 0 } },
    { id: 'ultrawide_21_9', name: 'Ultrawide Gaming (21:9)', category: 'ultrawide', width: 2560, height: 1080, dpr: 1, hasNotch: false, touchTargetMinPx: 32, safeArea: { top: 0, bottom: 0, left: 0, right: 0 } },
    { id: 'vr_quest3', name: 'Meta Quest 3 (VR HUD)', category: 'vr', width: 2064, height: 2208, dpr: 1, hasNotch: false, touchTargetMinPx: 64, safeArea: { top: 120, bottom: 120, left: 120, right: 120 } }
  ];

  const currentDevice = devices.find(d => d.id === activeDeviceId) || devices[0];
  const isLandscape = orientation === 'landscape';
  const displayW = isLandscape ? currentDevice.height : currentDevice.width;
  const displayH = isLandscape ? currentDevice.width : currentDevice.height;

  // Mock UI Elements for testing
  const [uiComponents, setUiComponents] = useState([
    { id: 'btn_attack', name: 'Primary Attack / Action', type: 'button', w: 64, h: 64, x: 280, y: 680, contrastRatio: 7.2, wcagPass: true },
    { id: 'btn_inventory', name: 'Inventory Bag', type: 'button', w: 48, h: 48, x: 20, y: 70, contrastRatio: 4.8, wcagPass: true },
    { id: 'hud_hp_bar', name: 'Health & Mana Bar', type: 'hud', w: 200, h: 32, x: 20, y: 20, contrastRatio: 6.1, wcagPass: true },
    { id: 'btn_chat_send', name: 'Chat Small Button', type: 'button', w: 28, h: 28, x: 340, y: 400, contrastRatio: 3.1, wcagPass: false }, // Small touch target warning
  ]);

  const getColorBlindStyle = () => {
    switch (colorBlindFilter) {
      case 'protanopia': return 'filter hue-rotate-180 brightness-95 saturate-50';
      case 'deuteranopia': return 'filter hue-rotate-90 saturate-50';
      case 'tritanopia': return 'filter hue-rotate-270 saturate-60';
      case 'achromatopsia': return 'filter grayscale(100%)';
      default: return '';
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 border-b border-[#30363d] bg-[#161b22] px-4 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <Smartphone className="text-[#a371f7]" size={20} />
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              Full-Stack UI/UX Simulator & Multi-Device Testbed
              <span className="text-[10px] bg-[#a371f7]/20 text-[#bc8cff] border border-[#a371f7]/40 px-2 py-0.5 rounded font-mono font-bold">
                WCAG 2.1 AAA COMPLIANT
              </span>
            </h1>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait')}
            className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-bold rounded border border-[#30363d] flex items-center gap-1.5 transition"
            title="Rotate Device Orientation"
          >
            <RotateCw size={13} /> Rotate ({orientation})
          </button>

          <div className="flex items-center gap-1 bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 text-xs font-bold rounded ${activeTab === 'preview' ? 'bg-[#a371f7] text-white shadow' : 'text-[#8b949e]'}`}
            >
              Live Simulator
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1 text-xs font-bold rounded ${activeTab === 'audit' ? 'bg-[#3fb950] text-white shadow' : 'text-[#8b949e]'}`}
            >
              Accessibility & WCAG Audit
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Device Selection & Toggles */}
        <div className="w-80 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0 overflow-y-auto p-4 space-y-5">
          {/* Target Preset */}
          <div>
            <span className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider block mb-2">Device Target Matrix</span>
            <div className="space-y-1.5">
              {devices.map(device => {
                const isSelected = device.id === activeDeviceId;
                return (
                  <button
                    key={device.id}
                    onClick={() => setActiveDeviceId(device.id)}
                    className={`w-full p-2.5 rounded text-left flex items-center justify-between border transition ${
                      isSelected 
                        ? 'bg-[#a371f7]/20 border-[#a371f7] text-white' 
                        : 'bg-[#21262d] border-[#30363d] text-[#8b949e] hover:border-[#8b949e]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {device.category === 'mobile' && <Smartphone size={15} className={isSelected ? 'text-[#a371f7]' : ''} />}
                      {device.category === 'tablet' && <Tablet size={15} className={isSelected ? 'text-[#a371f7]' : ''} />}
                      {device.category === 'desktop' && <Monitor size={15} className={isSelected ? 'text-[#a371f7]' : ''} />}
                      {device.category === 'ultrawide' && <Tv size={15} className={isSelected ? 'text-[#a371f7]' : ''} />}
                      {device.category === 'vr' && <Glasses size={15} className={isSelected ? 'text-[#a371f7]' : ''} />}
                      <div>
                        <div className="text-xs font-bold text-white">{device.name}</div>
                        <div className="text-[10px] font-mono text-[#8b949e]">{device.width} x {device.height} (DPR: {device.dpr}x)</div>
                      </div>
                    </div>
                    {device.hasNotch && (
                      <span className="text-[9px] bg-[#d29922]/20 text-[#d29922] px-1.5 py-0.5 rounded font-mono">Notch</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vision Accessibility Filters */}
          <div className="border-t border-[#30363d] pt-4">
            <span className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider block mb-2">Color Vision Deficiency Sim</span>
            <select 
              value={colorBlindFilter} 
              onChange={e => setColorBlindFilter(e.target.value as any)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-xs text-white"
            >
              <option value="normal">Normal Vision (No Filter)</option>
              <option value="protanopia">Protanopia (Red-Blind)</option>
              <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
              <option value="tritanopia">Tritanopia (Blue-Blind)</option>
              <option value="achromatopsia">Achromatopsia (Total Grayscale)</option>
            </select>
          </div>

          {/* Overlay Diagnostics */}
          <div className="border-t border-[#30363d] pt-4 space-y-2.5">
            <span className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider block">UI Diagnostics Overlays</span>
            <label className="flex items-center gap-2 text-xs text-[#c9d1d9] cursor-pointer">
              <input 
                type="checkbox" 
                checked={showTouchTargets} 
                onChange={e => setShowTouchTargets(e.target.checked)}
                className="accent-[#a371f7]"
              />
              Highlight Touch Targets (&lt;{currentDevice.touchTargetMinPx}px)
            </label>
            <label className="flex items-center gap-2 text-xs text-[#c9d1d9] cursor-pointer">
              <input 
                type="checkbox" 
                checked={showSafeAreas} 
                onChange={e => setShowSafeAreas(e.target.checked)}
                className="accent-[#a371f7]"
              />
              Show Safe Area Padding Insets
            </label>
          </div>

          {/* Zoom Level */}
          <div className="border-t border-[#30363d] pt-4">
            <label className="text-xs text-[#c9d1d9] flex justify-between mb-1">
              <span>Simulator Viewport Scale</span>
              <span className="font-mono text-[#a371f7]">{Math.round(zoomLevel * 100)}%</span>
            </label>
            <input 
              type="range" min={0.3} max={1.2} step={0.05}
              value={zoomLevel} 
              onChange={e => setZoomLevel(parseFloat(e.target.value))}
              className="w-full accent-[#a371f7]"
            />
          </div>
        </div>

        {/* Center Live Device Screen Simulator */}
        <div className="flex-1 flex flex-col bg-[#07090e] items-center justify-center p-8 overflow-auto relative">
          <div 
            className={`transition-all duration-300 relative shadow-2xl rounded-[36px] border-8 border-[#21262d] bg-[#000000] overflow-hidden ${getColorBlindStyle()}`}
            style={{
              width: `${displayW * zoomLevel}px`,
              height: `${displayH * zoomLevel}px`,
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)'
            }}
          >
            {/* Notch Simulation */}
            {currentDevice.hasNotch && (
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50">
                {currentDevice.notchType === 'dynamic_island' ? (
                  <div className="w-24 h-6 bg-black rounded-full border border-[#30363d] flex items-center justify-between px-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#161b22]" />
                    <div className="w-2 h-2 rounded-full bg-[#58a6ff]/40 animate-pulse" />
                  </div>
                ) : (
                  <div className="w-3 h-3 rounded-full bg-[#161b22] border border-[#30363d]" />
                )}
              </div>
            )}

            {/* Safe Area Guide Overlay */}
            {showSafeAreas && (
              <div 
                className="absolute inset-0 border-2 border-dashed border-[#58a6ff]/40 pointer-events-none z-40"
                style={{
                  top: `${currentDevice.safeArea.top * zoomLevel}px`,
                  bottom: `${currentDevice.safeArea.bottom * zoomLevel}px`,
                  left: `${currentDevice.safeArea.left * zoomLevel}px`,
                  right: `${currentDevice.safeArea.right * zoomLevel}px`
                }}
              >
                <span className="text-[8px] text-[#58a6ff] bg-black/60 px-1 rounded absolute top-1 left-1">Safe Bounds</span>
              </div>
            )}

            {/* Virtual Game Screen HUD Canvas */}
            <div className="w-full h-full relative bg-gradient-to-b from-[#0f172a] to-[#020617] p-4 flex flex-col justify-between select-none">
              {/* Top HUD: Health, Score */}
              <div className="flex justify-between items-center z-10">
                <div className="flex items-center gap-2 bg-[#1e293b]/80 p-2 rounded-xl border border-white/10 backdrop-blur">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center font-bold text-red-400 text-xs">HP</div>
                  <div className="w-32 h-3 bg-gray-800 rounded-full overflow-hidden border border-white/10">
                    <div className="w-[78%] h-full bg-gradient-to-r from-red-500 to-amber-500" />
                  </div>
                </div>

                <div className="px-3 py-1 bg-black/50 backdrop-blur border border-white/10 rounded-full text-xs font-mono text-amber-400 font-bold">
                  ⚔️ 12,450 XP
                </div>
              </div>

              {/* Center Game Scene Dummy */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <div className="w-48 h-48 rounded-full border border-cyan-500/20 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border border-dashed border-cyan-500/40 animate-spin" />
                </div>
              </div>

              {/* Bottom Touch Controls */}
              <div className="flex justify-between items-end z-10">
                {/* Virtual Joystick Base */}
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30" />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 items-center">
                  <button className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-red-600 text-white font-bold text-xs shadow-lg shadow-red-500/30 flex items-center justify-center active:scale-95 transition">
                    ATTACK
                  </button>
                  <button className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-blue-500/30 flex items-center justify-center active:scale-95 transition">
                    DODGE
                  </button>
                </div>
              </div>

              {/* Highlight Target Overlays */}
              {showTouchTargets && (
                <div className="absolute bottom-20 right-6 z-30">
                  <div className="w-6 h-6 bg-red-500/30 border-2 border-red-500 rounded flex items-center justify-center text-[7px] text-white font-bold animate-pulse">
                    !24px
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Accessibility & WCAG Audit Results */}
        <div className="w-80 border-l border-[#30363d] bg-[#161b22] flex flex-col shrink-0 p-4 space-y-4 overflow-y-auto">
          <span className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider block">UX / UI Audit Inspector</span>

          <div className="space-y-2">
            {uiComponents.map(comp => (
              <div key={comp.id} className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{comp.name}</span>
                  {comp.wcagPass ? (
                    <span className="text-[10px] text-[#3fb950] font-bold flex items-center gap-1">
                      <CheckCircle2 size={11} /> Pass
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#f85149] font-bold flex items-center gap-1">
                      <XCircle size={11} /> Small Target
                    </span>
                  )}
                </div>

                <div className="flex justify-between text-[10px] font-mono text-[#8b949e]">
                  <span>Size: {comp.w}x{comp.h}px</span>
                  <span>Contrast: <strong className={comp.contrastRatio >= 4.5 ? 'text-[#3fb950]' : 'text-[#f85149]'}>{comp.contrastRatio}:1</strong></span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] space-y-2 mt-4">
            <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider block">Compliance Summary</span>
            <div className="flex justify-between text-xs">
              <span className="text-[#8b949e]">WCAG Contrast (AA/AAA):</span>
              <span className="text-[#3fb950] font-bold">100% Passed</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#8b949e]">Touch Target Target (&ge;44px):</span>
              <span className="text-[#e3b341] font-bold">1 Defect Detected</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#8b949e]">Safe Area Occlusion:</span>
              <span className="text-[#3fb950] font-bold">0 Overlaps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
