/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: AAA Enhanced Input & Action Mapping Context Studio component (equivalent
 *          to Unreal Engine 5 Enhanced Input and Unity New Input System).
 *          Empowers designers to configure Input Actions, Input Mapping Contexts (IMC)
 *          with priority layering, deadzone curves, axis swizzling, stateful triggers
 *          (Hold, Tap, Pulse, Chord), and provides a real-time interactive gamepad
 *          and keyboard testing laboratory with live input telemetry.
 *    - TH: สตูดิโอระบบ Enhanced Input และ Input Mapping Context ระดับ AAA
 *          (เทียบเท่า Unreal Engine 5 Enhanced Input และ Unity New Input System)
 *          ช่วยให้นักพัฒนาและ Game Designer ตั้งค่า Input Actions, จัดลำดับความสำคัญ
 *          ของ Mapping Contexts (IMC), ปรับแต่ง Deadzone Curve และ Modifiers,
 *          กำหนดเงื่อนไข Triggers (กดค้าง, เคาะสั้น, รัวกระสุน, Combo)
 *          พร้อมห้องทดลองจำลองจอยเกม (Gamepad) และคีย์บอร์ดแบบโต้ตอบได้จริง
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Backed by `EnhancedInputManagerNode.ts` and `enhancedInputTypes.ts`
 *    - Dispatches live gameplay tags and normalized input axes
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Safe deadzone rendering preventing NaN values.
 *    - Auto-recovers gracefully if local storage contains outdated schema.
 * 
 * 5. Usage Example (ตัวอย่างการเรียกใช้งาน):
 *    ```tsx
 *    <EnhancedInputMappingContextStudio onSelectTool={handleSelect} />
 *    ```
 * ============================================================================
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Gamepad2, 
  Layers, 
  Sliders, 
  Plus, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Activity, 
  ChevronRight, 
  Settings2, 
  Keyboard, 
  MousePointer, 
  Zap, 
  ShieldCheck, 
  Download, 
  Upload, 
  Sparkles, 
  Crosshair, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { 
  InputAction, 
  InputMappingContext, 
  InputActionValueType, 
  InputModifierType, 
  InputTriggerType,
  InputDeviceBinding
} from '../types/enhancedInputTypes';
import { enhancedInputManager } from '../utils/EnhancedInputManagerNode';

interface EnhancedInputStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function EnhancedInputMappingContextStudio({ onSelectTool }: EnhancedInputStudioProps) {
  const [actions, setActions] = useState<InputAction[]>(() => enhancedInputManager.getActions());
  const [contexts, setContexts] = useState<InputMappingContext[]>(() => enhancedInputManager.getContexts());
  const [selectedContextId, setSelectedContextId] = useState<string>('IMC_Default_Exploration');
  const [selectedActionId, setSelectedActionId] = useState<string>('IA_Move');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Live tester state
  const [analogX, setAnalogX] = useState<number>(0);
  const [analogY, setAnalogY] = useState<number>(0);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [liveEvaluations, setLiveEvaluations] = useState(() => enhancedInputManager.getAllActionEvaluations());

  // Subscribe to manager updates
  useEffect(() => {
    return enhancedInputManager.subscribe(() => {
      setActions(enhancedInputManager.getActions());
      setContexts(enhancedInputManager.getContexts());
      setLiveEvaluations(enhancedInputManager.getAllActionEvaluations());
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const selectedContext = useMemo(() => {
    return contexts.find(c => c.id === selectedContextId) || contexts[0];
  }, [contexts, selectedContextId]);

  const selectedAction = useMemo(() => {
    return actions.find(a => a.id === selectedActionId) || actions[0];
  }, [actions, selectedActionId]);

  const handleToggleContext = (ctxId: string, currentEnabled: boolean) => {
    enhancedInputManager.toggleContextActive(ctxId, !currentEnabled);
    showToast(`Context '${ctxId}' ${!currentEnabled ? 'Enabled' : 'Disabled'}`);
  };

  const handleSimulateKey = (key: string, pressed: boolean) => {
    enhancedInputManager.setSimulatedKey(key, pressed);
    setActiveKeys(enhancedInputManager.getSimulatedRawKeys());
  };

  const handleAnalogChange = (x: number, y: number) => {
    setAnalogX(x);
    setAnalogY(y);
    enhancedInputManager.setSimulatedAnalogAxis('Gamepad_LeftStick_X', x);
    enhancedInputManager.setSimulatedAnalogAxis('Gamepad_LeftStick_Y', y);
  };

  // Export mappings bundle
  const handleExportJson = () => {
    const data = JSON.stringify({ actions, contexts }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enhanced-input-contexts-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported Enhanced Input Contexts bundle!');
  };

  return (
    <div className="flex flex-col h-full bg-[#090d14] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Toast */}
      {toastMsg && (
        <div className="absolute top-4 right-6 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-xl border border-blue-400 animate-in slide-in-from-top duration-200">
          <Sparkles size={14} /> {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-[#1c2438] bg-[#0d1320] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600/30 to-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-lg">
            <Gamepad2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Enhanced Input & Action Mapping Context Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-400 text-[10px] font-bold border border-blue-500/40 font-mono">
                UE5 & Unity Input Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Priority-based Input Mapping Contexts (IMC), Modifiers, Deadzone Curves, and Stateful Triggers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 rounded-lg bg-[#161f33] hover:bg-[#202c48] text-white text-xs font-semibold border border-[#2a3857] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download size={13} /> Export IMC JSON
          </button>
        </div>
      </div>

      {/* Main 3-Column Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* COLUMN 1: Input Mapping Contexts & Priority Stack (3 cols) */}
        <div className="lg:col-span-3 border-r border-[#1c2438] bg-[#0c111c] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1624] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={13} className="text-blue-400" /> Mapping Contexts (IMC)
            </span>
            <span className="text-[10px] font-mono text-[#64748b]">Priority Stack</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {contexts
              .sort((a, b) => b.priority - a.priority)
              .map(ctx => {
                const isSelected = ctx.id === selectedContextId;
                return (
                  <div
                    key={ctx.id}
                    onClick={() => setSelectedContextId(ctx.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-950/40 border-blue-500/60 shadow-md shadow-blue-950/30' 
                        : 'bg-[#121826] border-[#1f293d] hover:border-[#334155]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs font-mono">{ctx.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleContext(ctx.id, ctx.enabled);
                        }}
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-colors flex items-center gap-1 ${
                          ctx.enabled 
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {ctx.enabled ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        {ctx.enabled ? 'Active' : 'Off'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2 text-[11px] text-[#64748b]">
                      <span>Priority: <strong className="text-blue-400 font-mono">{ctx.priority}</strong></span>
                      <span>{ctx.mappings.length} Bindings</span>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Input Actions List */}
          <div className="p-3 border-t border-[#1c2438] bg-[#0f1624]">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Zap size={13} className="text-amber-400" /> Declared Actions ({actions.length})
            </span>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {actions.map(act => (
                <button
                  key={act.id}
                  onClick={() => setSelectedActionId(act.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    act.id === selectedActionId
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-[#94a3b8] hover:bg-[#161f30] hover:text-white'
                  }`}
                >
                  <span className="font-mono">{act.id}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 text-[#cbd5e1]">
                    {act.valueType}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: Selected Context Mappings & Modifiers Config (5 cols) */}
        <div className="lg:col-span-5 border-r border-[#1c2438] bg-[#0a0e17] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1624] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 size={14} className="text-blue-400" />
              <span className="text-xs font-bold text-white">Mappings in {selectedContext.name}</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-[#161f33] text-blue-300 font-mono">
              Priority {selectedContext.priority}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {selectedContext.mappings.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center text-[#64748b] text-xs">
                <Sliders size={28} className="mb-2 text-[#475569]" />
                <span>No hardware bindings configured in this context yet.</span>
              </div>
            ) : (
              selectedContext.mappings.map(mapping => {
                const action = actions.find(a => a.id === mapping.actionId);
                return (
                  <div key={mapping.id} className="p-3.5 rounded-xl bg-[#0f1626] border border-[#1e293d] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs font-mono">{mapping.actionId}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 font-mono border border-blue-500/30">
                          {action?.valueType}
                        </span>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded bg-[#162035] text-white font-mono font-bold border border-[#243352]">
                        {mapping.rawKeyOrAxis}
                      </span>
                    </div>

                    {/* Gameplay Tag badge */}
                    {action?.gameplayTag && (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                        <Tag size={10} /> {action.gameplayTag}
                      </div>
                    )}

                    {/* Modifiers Pill Strip */}
                    <div className="pt-2 border-t border-[#1a2336] flex flex-wrap gap-1.5 items-center text-[10px]">
                      <span className="text-[#64748b] font-semibold">Modifiers:</span>
                      {mapping.modifiers.length === 0 ? (
                        <span className="text-[#64748b] italic">None</span>
                      ) : (
                        mapping.modifiers.map(m => (
                          <span key={m.id} className="px-2 py-0.5 rounded bg-[#182338] text-[#7dd3fc] font-mono border border-[#243555]">
                            {m.type} {m.type === 'DEADZONE' ? `[${m.lowerThreshold}-${m.upperThreshold}]` : ''}
                          </span>
                        ))
                      )}

                      <span className="text-[#64748b] font-semibold ml-2">Triggers:</span>
                      {mapping.triggers.map(t => (
                        <span key={t.id} className="px-2 py-0.5 rounded bg-[#1e293b] text-amber-300 font-mono border border-[#334155]">
                          {t.type} {t.holdDurationSec ? `${t.holdDurationSec}s` : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Action Inspector Panel */}
          <div className="p-3.5 border-t border-[#1c2438] bg-[#0c121e]">
            <div className="text-xs font-bold text-white mb-2 flex items-center justify-between">
              <span>Action Inspector: <strong className="text-blue-400 font-mono">{selectedAction.id}</strong></span>
              <span className="text-[10px] text-[#64748b]">Consume Input: {selectedAction.consumeInput ? 'Yes' : 'No'}</span>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">{selectedAction.description}</p>
          </div>
        </div>

        {/* COLUMN 3: Live Hardware Testbed & Visualizer (4 cols) */}
        <div className="lg:col-span-4 bg-[#0c111c] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1624] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Crosshair size={13} className="text-emerald-400" /> Interactive Testbed & Radar
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Dispatch
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            
            {/* Virtual Analog Thumbstick with Deadzone Circle */}
            <div className="p-4 rounded-xl bg-[#0f1626] border border-[#1e293d] flex flex-col items-center">
              <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">
                Left Thumbstick Locomotion (IA_Move)
              </span>

              {/* Joystick Radar Circle */}
              <div className="relative w-40 h-40 rounded-full border-2 border-[#22314d] bg-[#070a12] flex items-center justify-center shadow-inner">
                {/* Deadzone ring (18%) */}
                <div className="absolute w-[28%] h-[28%] rounded-full border border-dashed border-rose-500/50 bg-rose-950/20"></div>

                {/* Crosshairs */}
                <div className="absolute w-full h-[1px] bg-[#1e293b]"></div>
                <div className="absolute h-full w-[1px] bg-[#1e293b]"></div>

                {/* Stick Nub */}
                <div 
                  className="w-7 h-7 rounded-full bg-blue-500 border-2 border-white shadow-lg shadow-blue-500/50 absolute transition-all duration-75"
                  style={{
                    transform: `translate(${analogX * 55}px, ${analogY * 55}px)`
                  }}
                ></div>
              </div>

              {/* Quick Preset Buttons for Testing */}
              <div className="grid grid-cols-3 gap-1.5 w-full mt-3">
                <button
                  onMouseDown={() => handleAnalogChange(0, -1)}
                  onMouseUp={() => handleAnalogChange(0, 0)}
                  className="py-1.5 rounded bg-[#162035] hover:bg-blue-600 text-white text-[11px] font-bold font-mono transition-colors"
                >
                  Forward (W)
                </button>
                <button
                  onMouseDown={() => handleAnalogChange(0, 1)}
                  onMouseUp={() => handleAnalogChange(0, 0)}
                  className="py-1.5 rounded bg-[#162035] hover:bg-blue-600 text-white text-[11px] font-bold font-mono transition-colors"
                >
                  Backward (S)
                </button>
                <button
                  onMouseDown={() => handleAnalogChange(1, 0)}
                  onMouseUp={() => handleAnalogChange(0, 0)}
                  className="py-1.5 rounded bg-[#162035] hover:bg-blue-600 text-white text-[11px] font-bold font-mono transition-colors"
                >
                  Right (D)
                </button>
              </div>

              <div className="flex items-center justify-between w-full mt-2 text-[11px] font-mono text-[#64748b]">
                <span>X: <strong className="text-white">{analogX.toFixed(2)}</strong></span>
                <span>Y: <strong className="text-white">{analogY.toFixed(2)}</strong></span>
                <span>Mag: <strong className="text-blue-400">{Math.hypot(analogX, analogY).toFixed(2)}</strong></span>
              </div>
            </div>

            {/* Simulated Keyboard Key Clicker */}
            <div className="p-3.5 rounded-xl bg-[#0f1626] border border-[#1e293d]">
              <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider block mb-2.5">
                Keyboard Test Keys (Press to Trigger)
              </span>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: 'KeyW', label: 'W (Fwd)' },
                  { key: 'KeyS', label: 'S (Back)' },
                  { key: 'KeyA', label: 'A (Left)' },
                  { key: 'KeyD', label: 'D (Right)' },
                  { key: 'Space', label: 'Space (Jump)' },
                  { key: 'KeyE', label: 'E (Interact)' },
                  { key: 'Mouse_LeftButton', label: 'M1 (Attack)' },
                  { key: 'ShiftLeft', label: 'Shift (Sprint)' }
                ].map(item => {
                  const isDown = activeKeys.includes(item.key);
                  return (
                    <button
                      key={item.key}
                      onMouseDown={() => handleSimulateKey(item.key, true)}
                      onMouseUp={() => handleSimulateKey(item.key, false)}
                      className={`p-2 rounded-lg text-[10px] font-bold font-mono border transition-all cursor-pointer ${
                        isDown
                          ? 'bg-blue-600 text-white border-blue-400 scale-95 shadow-md shadow-blue-600/40'
                          : 'bg-[#121824] text-[#94a3b8] border-[#1e293b] hover:border-[#334155]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Evaluated Actions Stream */}
            <div className="p-3.5 rounded-xl bg-[#0f1626] border border-[#1e293d]">
              <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider block mb-2">
                Live Evaluated Actions (Frame Telemetry)
              </span>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {liveEvaluations.map(res => (
                  <div key={res.actionId} className="p-2 rounded bg-[#090d14] border border-[#1a2336] flex items-center justify-between text-xs font-mono">
                    <span className="text-white font-bold">{res.actionId}</span>
                    <div className="flex items-center gap-2">
                      {res.valueType === 'AXIS2D' && (
                        <span className="text-blue-400 text-[11px]">
                          ({res.axis2DValue.x.toFixed(2)}, {res.axis2DValue.y.toFixed(2)})
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        res.triggeredThisFrame 
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40' 
                          : 'bg-zinc-800/40 text-zinc-500'
                      }`}>
                        {res.triggeredThisFrame ? 'TRIGGERED' : 'IDLE'}
                      </span>
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
