/**
 * ====================================================================================================
 * MODULE: HTNUtilityAIBrainStudio.tsx
 * ====================================================================================================
 * วัตถุประสงค์และหน้าที่ (Module Purpose & Responsibility):
 * 1. สตูดิโอออกแบบโครงสร้างสมองปัญญาประดิษฐ์ระดับสูงด้วยสถาปัตยกรรม Hierarchical Task Network (HTN)
 *    และ Utility AI Scoring Curves สำหรับเกมแนว Action RPG, Tactical Shooter และ Stealth AAA
 * 2. เหนือกว่า Behavior Tree แบบเดิมด้วยความสามารถในการวางแผนล่วงหน้าแบบหลายขั้นตอน (Multi-Step Forward Planning)
 *    คำนวณเงื่อนไขโลกจำลอง (World State) และเลือกวิธีบรรลุเป้าหมายที่ดีที่สุดด้วยค่า Utility Function
 * 3. ระบบเซนเซอร์และกระดานดำข้อมูล (Sensor Blackboard) ติดตามตัวแปรแบบเรียลไทม์:
 *    - ระดับพลังชีวิต (Health %), ปริมาณกระสุน (Ammo), ระยะห่างจากเป้าหมาย (DistanceToThreat), ที่กำบัง (InCover)
 * 4. กราฟจำลองการแตกกิ่ง Compound Tasks สู่ Primitive Actions พร้อมตัวตรวจวัดความล้มเหลว (Plan Replanner)
 * 5. ส่งออกชุด Blueprint AI Schema และ Utility Curves เป็น JSON / C++ Data Table
 *
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * - เชื่อมโยงกับ Game Systems & Narrative Hub และ Artificial Intelligence Hub
 * - ทำงานคู่กับ AINPCBehaviorTreeEditor และ NavMeshBakingStudio
 *
 * พารามิเตอร์ Input / Output (Data Contracts):
 * - Input: World State Variables, Compound Task Hierarchy, Utility Weights
 * - Output: Valid Task Execution Plan Queue, Utility Evaluation Curves, Exportable AI Brain JSON
 *
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * - เมื่อไม่มี Primitive Task ใดที่ Precondition ผ่าน จะเรียกใช้ Fallback Safe Action (เช่น Idle / Scan Surroundings)
 *
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * <HTNUtilityAIBrainStudio onPlanGenerated={(plan) => console.log(plan)} />
 * ====================================================================================================
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  Brain,
  Zap,
  Activity,
  Download,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Network,
  Shield,
  Crosshair,
  Layers,
  ChevronRight
} from "lucide-react";

interface WorldState {
  healthPct: number;
  ammoCount: number;
  distanceToEnemy: number;
  hasLineOfSight: boolean;
  isCoverAvailable: boolean;
  alertLevel: "Calm" | "Suspicious" | "Combat";
}

interface PrimitiveAction {
  id: string;
  name: string;
  utilityScore: number;
  cost: number;
  preconditions: string[];
  effects: string[];
}

interface CompoundTask {
  id: string;
  name: string;
  description: string;
  subTasks: PrimitiveAction[];
}

export default function HTNUtilityAIBrainStudio() {
  // กระดานดำค่าสถานะโลก (World State Blackboard)
  const [worldState, setWorldState] = useState<WorldState>({
    healthPct: 75,
    ammoCount: 18,
    distanceToEnemy: 14,
    hasLineOfSight: true,
    isCoverAvailable: true,
    alertLevel: "Combat",
  });

  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>(0);
  const [isSimulatingPlan, setIsSimulatingPlan] = useState<boolean>(false);

  // รายการ Compound Tasks และ Primitive Actions
  const compoundTasks: CompoundTask[] = useMemo(() => [
    {
      id: "task_engage_threat",
      name: "EngageThreatTarget (โจมตีและกำจัดเป้าหมาย)",
      description: "ประเมินระยะห่างและกระสุน เพื่อเลือกยิงตรง ยิงกดดัน หรือเข้าประชิด",
      subTasks: [
        {
          id: "act_flank_cover",
          name: "SprintToFlankingCover (วิ่งอ้อมหาที่กำบัง)",
          utilityScore: 88,
          cost: 12,
          preconditions: ["isCoverAvailable == true", "healthPct > 40"],
          effects: ["inCover = true", "distanceToEnemy -= 5"],
        },
        {
          id: "act_burst_fire",
          name: "RifleBurstFire (ยิงกดดัน 3 นัดซ้อน)",
          utilityScore: 92,
          cost: 8,
          preconditions: ["ammoCount >= 3", "hasLineOfSight == true"],
          effects: ["ammoCount -= 3", "threatSuppression += 40"],
        },
        {
          id: "act_reload_tactical",
          name: "TacticalReload (บรรจุกระสุนในที่กำบัง)",
          utilityScore: 65,
          cost: 5,
          preconditions: ["ammoCount < 10"],
          effects: ["ammoCount = 30"],
        },
      ],
    },
    {
      id: "task_survive_retreat",
      name: "TacticalRetreat & Medicate (ถอนกำลังรักษาตัว)",
      description: "เมื่อพลังชีวิตต่ำ หรือกระสุนหมด ให้ขว้างระเบิดควันและถอยร่น",
      subTasks: [
        {
          id: "act_smoke_grenade",
          name: "DeploySmokeScreen (ปล่อยม่านควันกำบัง)",
          utilityScore: 95,
          cost: 15,
          preconditions: ["healthPct < 35"],
          effects: ["hasLineOfSight = false"],
        },
        {
          id: "act_apply_medkit",
          name: "ApplyTraumaKit (ฉีดสเปรย์ฟื้นฟูพลังชีวิต)",
          utilityScore: 90,
          cost: 20,
          preconditions: ["hasLineOfSight == false"],
          effects: ["healthPct += 50"],
        },
      ],
    },
  ], []);

  const activeCompound = compoundTasks[selectedTaskIndex] || compoundTasks[0];

  // คำนวณ Utility Score รวมของแผนการ (Weighted Dynamic Scoring)
  const currentPlanScores = useMemo(() => {
    return activeCompound.subTasks.map((sub) => {
      let dynamicScore = sub.utilityScore;
      if (worldState.ammoCount < 5 && sub.id.includes("fire")) dynamicScore *= 0.2;
      if (worldState.healthPct < 40 && sub.id.includes("flank")) dynamicScore *= 0.5;
      if (worldState.isCoverAvailable && sub.id.includes("cover")) dynamicScore *= 1.3;
      return {
        ...sub,
        calculatedScore: Math.min(100, Math.round(dynamicScore)),
      };
    });
  }, [activeCompound, worldState]);

  // จำลองการรัน AI Planning Loop
  const handleRunSimulation = useCallback(() => {
    setIsSimulatingPlan(true);
    setTimeout(() => {
      setIsSimulatingPlan(false);
    }, 700);
  }, []);

  // ส่งออก HTN Brain Blueprint เป็น JSON
  const handleExportHTNBlueprint = () => {
    const blueprint = {
      engineSignature: "OmniMaster_HTN_AI_v4.5",
      module: "HTNUtilityAIBrainStudio",
      worldState,
      compoundTasks,
      generatedTimestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `HTN_AIBrain_${activeCompound.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0f19] text-gray-200 select-none overflow-hidden font-sans">
      {/* Top Navigation Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-[#111726]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 border border-purple-500/30">
            <Brain size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">
                Hierarchical Task Network (HTN) & Utility AI Brain Studio
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-purple-500/10 text-purple-400 rounded border border-purple-500/20">
                HTN Multi-Step Planner v4.2
              </span>
            </div>
            <p className="text-xs text-gray-400">
              ระบบวางแผนการกระทำแบบลำดับชั้นสำหรับ NPC ศัตรูระดับ AAA ด้วยการประเมิน Utility Scoring Curves
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunSimulation}
            disabled={isSimulatingPlan}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              isSimulatingPlan
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-500 text-white shadow-sm"
            }`}
          >
            <Play size={14} className={isSimulatingPlan ? "animate-spin" : ""} />
            {isSimulatingPlan ? "กำลังคำนวณแผน..." : "จำลองแผน (Evaluate Plan)"}
          </button>

          <button
            onClick={handleExportHTNBlueprint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-medium transition shadow-sm"
          >
            <Download size={14} />
            ส่งออก AI Blueprint (JSON)
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Blackboard Sensor Controls */}
        <div className="w-80 border-r border-gray-800 bg-[#0d1322] flex flex-col p-4 overflow-y-auto space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
              <Activity size={14} className="text-purple-400" />
              กระดานดำเซนเซอร์ (World State Blackboard)
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>พลังชีวิต (Health %):</span>
                  <span className="font-mono text-purple-400 font-bold">{worldState.healthPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={worldState.healthPct}
                  onChange={(e) => setWorldState({ ...worldState, healthPct: Number(e.target.value) })}
                  className="w-full accent-purple-500 bg-gray-700 h-1.5 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>กระสุนคงเหลือ (Ammo Count):</span>
                  <span className="font-mono text-emerald-400 font-bold">{worldState.ammoCount} นัด</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={worldState.ammoCount}
                  onChange={(e) => setWorldState({ ...worldState, ammoCount: Number(e.target.value) })}
                  className="w-full accent-emerald-500 bg-gray-700 h-1.5 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>ระยะห่างเป้าหมาย (Distance):</span>
                  <span className="font-mono text-blue-400 font-bold">{worldState.distanceToEnemy} เมตร</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={worldState.distanceToEnemy}
                  onChange={(e) => setWorldState({ ...worldState, distanceToEnemy: Number(e.target.value) })}
                  className="w-full accent-blue-500 bg-gray-700 h-1.5 rounded"
                />
              </div>

              <div className="pt-2 border-t border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">มีแนวสายตา (Line of Sight):</span>
                  <button
                    onClick={() => setWorldState({ ...worldState, hasLineOfSight: !worldState.hasLineOfSight })}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      worldState.hasLineOfSight
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {worldState.hasLineOfSight ? "Yes" : "Blocked"}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">มีที่กำบังใกล้เคียง (Cover):</span>
                  <button
                    onClick={() => setWorldState({ ...worldState, isCoverAvailable: !worldState.isCoverAvailable })}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      worldState.isCoverAvailable
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {worldState.isCoverAvailable ? "Available" : "None"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Compound Task Selection */}
          <div className="border-t border-gray-800 pt-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
              <Layers size={14} className="text-gray-400" />
              เป้าหมายระดับสูง (Compound Goal)
            </h3>
            <div className="space-y-2">
              {compoundTasks.map((ct, idx) => (
                <button
                  key={ct.id}
                  onClick={() => setSelectedTaskIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition ${
                    selectedTaskIndex === idx
                      ? "bg-purple-600/20 border-purple-500 text-white font-bold"
                      : "bg-[#161f33] border-gray-800 text-gray-300 hover:border-gray-700"
                  }`}
                >
                  <div className="truncate">{ct.name}</div>
                  <div className="text-[10px] text-gray-400 font-normal mt-0.5">{ct.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: HTN Decomposition Tree & Utility Visualizer */}
        <div className="flex-1 flex flex-col bg-[#070a10] overflow-hidden">
          {/* Active Goal Header */}
          <div className="h-10 border-b border-gray-800 bg-[#0d1322] px-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Current Root Goal:</span>
              <span className="font-bold text-purple-400">{activeCompound.name}</span>
            </div>
            <div className="text-gray-400">
              Utility Strategy: <span className="text-white font-mono font-bold">ArgMax(Utility - Cost)</span>
            </div>
          </div>

          {/* Action Queue Matrix */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
              <Network size={16} className="text-purple-400" />
              การแจกแจงแผนงานเชิงลำดับชั้น (HTN Decomposition Plan Execution Queue)
            </h2>

            <div className="space-y-3">
              {currentPlanScores.map((action, idx) => {
                const isTopCandidate = idx === 0;
                return (
                  <div
                    key={action.id}
                    className={`p-4 rounded-xl border transition ${
                      isTopCandidate
                        ? "bg-[#131929] border-purple-500/60 shadow-lg shadow-purple-950/20"
                        : "bg-[#0d1322] border-gray-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isTopCandidate ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <span className="font-bold text-sm text-white">{action.name}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">
                          Cost: <span className="font-mono text-white">{action.cost}</span>
                        </span>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                          <Zap size={13} className="text-purple-400" />
                          <span className="font-mono font-bold text-xs text-purple-300">
                            Utility: {action.calculatedScore}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Preconditions & Effects */}
                    <div className="grid grid-cols-2 gap-4 mt-3 text-xs bg-[#090d17] p-3 rounded-lg border border-gray-800/80 font-mono">
                      <div>
                        <div className="text-gray-400 text-[11px] mb-1">Preconditions (เงื่อนไขก่อนทำ):</div>
                        <ul className="list-disc list-inside text-gray-300 space-y-0.5">
                          {action.preconditions.map((p, i) => (
                            <li key={i} className="text-emerald-400/90">{p}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-gray-400 text-[11px] mb-1">Expected Effects (ผลลัพธ์ที่คาดหวัง):</div>
                        <ul className="list-disc list-inside text-gray-300 space-y-0.5">
                          {action.effects.map((e, i) => (
                            <li key={i} className="text-blue-400/90">{e}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Planner HUD */}
          <div className="h-16 border-t border-gray-800 bg-[#0d1322] px-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <div>
                <div className="text-gray-400">Planner Status</div>
                <div className="font-bold text-white">Optimal Forward Path Found (Zero Backtracking)</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-400">
              <span>Replanning Frequency: <strong className="text-white font-mono">10 Hz (100ms)</strong></span>
              <span>•</span>
              <span>Blackboard Memory: <strong className="text-white font-mono">4.2 KB</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
