import { useState, useEffect } from 'react';
import { ResourceThrottlingControllerNode } from '../utils/ResourceThrottlingControllerNode';

export type SystemStats = {
  cpu: number;
  ram: number;
  gpu: number;
  vram: number;
  fps: number;
  frameTime: number;
  drawCalls: number;
  triangles: number;
  cpuTemp: number;
  gpuTemp: number;
  cpuClock: number;
  gpuClock: number;
  ramUsedGB: number;
  ramTotalGB: number;
  vramUsedGB: number;
  vramTotalGB: number;
  heapUsedMB: number;
  heapTotalMB: number;
  physicsTickMs: number;
  renderLatencyMs: number;
  activeSimulationProfile: string;
  isThrottled?: boolean;
  throttlingCpuCap?: number;
  throttlingGpuCap?: number;
};

// Global state
let currentStats: SystemStats = {
  cpu: 24,
  ram: 44,
  gpu: 32,
  vram: 38,
  fps: 120,
  frameTime: 8.33,
  drawCalls: 1450,
  triangles: 1850000,
  cpuTemp: 54,
  gpuTemp: 62,
  cpuClock: 4.8,
  gpuClock: 2520,
  ramUsedGB: 14.1,
  ramTotalGB: 32.0,
  vramUsedGB: 4.56,
  vramTotalGB: 12.0,
  heapUsedMB: 184,
  heapTotalMB: 512,
  physicsTickMs: 2.1,
  renderLatencyMs: 4.8,
  activeSimulationProfile: 'Standard 3D Scene',
  isThrottled: false,
  throttlingCpuCap: 50,
  throttlingGpuCap: 48
};

let currentThreadLoads: number[] = Array(16).fill(0).map(() => Math.random() * 35 + 10);
let listeners: Set<() => void> = new Set();
let intervalId: any = null;

export const cpuHistory: number[] = Array(30).fill(24);
export const gpuHistory: number[] = Array(30).fill(32);
export const ramHistory: number[] = Array(30).fill(44);
export const vramHistory: number[] = Array(30).fill(38);
export const fpsHistory: number[] = Array(30).fill(120);
export const frameTimeHistory: number[] = Array(30).fill(8.33);

let simulatedStressMultiplier = 1.0;

export function setSimulatedStressProfile(profileName: string, multiplier: number = 1.0) {
  simulatedStressMultiplier = multiplier;
  currentStats.activeSimulationProfile = profileName;
  listeners.forEach(listener => listener());
}

export function getCurrentStats(): SystemStats {
  return { ...currentStats };
}

function startTelemetry() {
  if (intervalId) return;
  intervalId = setInterval(() => {
    // Check real browser memory if available in Chrome/Edge
    let browserHeapUsed = 180 + Math.random() * 40;
    let browserHeapTotal = 512;
    if (typeof window !== 'undefined' && (performance as any)?.memory) {
      const mem = (performance as any).memory;
      browserHeapUsed = Math.round(mem.usedJSHeapSize / (1024 * 1024));
      browserHeapTotal = Math.round(mem.jsHeapSizeLimit / (1024 * 1024));
    }

    const stress = simulatedStressMultiplier;
    const rawCpu = Math.min(100, Math.max(8, (18 + Math.random() * 15) * stress));
    const rawGpu = Math.min(100, Math.max(5, (22 + Math.random() * 25) * stress));
    const baseRam = Math.min(98, Math.max(25, 40 + (stress - 1) * 20 + (Math.random() * 4 - 2)));
    const baseVram = Math.min(98, Math.max(15, 35 + (stress - 1) * 25 + (Math.random() * 4 - 2)));
    
    // Apply Resource Throttling Controller
    const throttlingCtrl = ResourceThrottlingControllerNode.getInstance();
    const throttlingState = throttlingCtrl.getState();
    const { cpu: baseCpu, gpu: baseGpu, cpuTemp, gpuTemp, wasThrottled } = throttlingCtrl.applyThrottle(
      rawCpu,
      rawGpu,
      Math.round(48 + rawCpu * 0.35),
      Math.round(52 + rawGpu * 0.38)
    );

    // Derived FPS and frametime (guarantee smooth lockup-free pacing if throttled)
    let targetFps = Math.max(18, Math.round(144 / stress + (Math.random() * 8 - 4)));
    if (throttlingState.enabled) {
      // Paced to prevent UI lockup while running heavy simulations
      targetFps = Math.max(45, Math.min(60, targetFps));
    }
    const frameTime = +(1000 / targetFps).toFixed(2);
    
    currentStats = {
      cpu: Math.min(100, Math.max(5, baseCpu)),
      ram: Math.min(100, Math.max(20, baseRam)),
      gpu: Math.min(100, Math.max(2, baseGpu)),
      vram: Math.min(100, Math.max(10, baseVram)),
      fps: targetFps,
      frameTime: frameTime,
      drawCalls: Math.round(1200 * (throttlingState.enabled ? Math.min(1.4, stress) : stress) + (Math.random() * 180 - 90)),
      triangles: Math.round(1500000 * (throttlingState.enabled ? Math.min(1.4, stress) : stress) + (Math.random() * 200000 - 100000)),
      cpuTemp: cpuTemp,
      gpuTemp: gpuTemp,
      cpuClock: +(4.2 + (baseCpu / 100) * 0.85).toFixed(2),
      gpuClock: Math.round(2100 + (baseGpu / 100) * 450),
      ramUsedGB: +((baseRam / 100) * 32.0).toFixed(2),
      ramTotalGB: 32.0,
      vramUsedGB: +((baseVram / 100) * 12.0).toFixed(2),
      vramTotalGB: 12.0,
      heapUsedMB: Math.round(browserHeapUsed * (throttlingState.enabled ? Math.min(1.25, stress) : stress)),
      heapTotalMB: browserHeapTotal,
      physicsTickMs: +(1.4 * (throttlingState.enabled ? Math.min(1.5, stress) : stress) + Math.random() * 0.6).toFixed(2),
      renderLatencyMs: +(3.2 * (throttlingState.enabled ? Math.min(1.5, stress) : stress) + Math.random() * 1.1).toFixed(2),
      activeSimulationProfile: currentStats.activeSimulationProfile,
      isThrottled: throttlingState.enabled,
      throttlingCpuCap: throttlingState.maxCpuPercent,
      throttlingGpuCap: throttlingState.maxGpuPercent
    };

    let rawThreadLoads = Array(16).fill(0).map((_, i) => {
      // Main render thread (Core 0-1) and Physics thread (Core 2) have higher load
      const coreBias = i < 3 ? 1.4 : 0.8;
      return Math.min(100, Math.max(2, (currentStats.cpu * coreBias * (0.7 + Math.random() * 0.6))));
    });
    currentThreadLoads = throttlingCtrl.clampThreadLoads(rawThreadLoads);
    
    // History arrays for graphing
    cpuHistory.push(currentStats.cpu);
    if (cpuHistory.length > 30) cpuHistory.shift();
    
    gpuHistory.push(currentStats.gpu);
    if (gpuHistory.length > 30) gpuHistory.shift();
    
    ramHistory.push(currentStats.ram);
    if (ramHistory.length > 30) ramHistory.shift();

    vramHistory.push(currentStats.vram);
    if (vramHistory.length > 30) vramHistory.shift();

    fpsHistory.push(currentStats.fps);
    if (fpsHistory.length > 30) fpsHistory.shift();

    frameTimeHistory.push(currentStats.frameTime);
    if (frameTimeHistory.length > 30) frameTimeHistory.shift();
    
    listeners.forEach(listener => listener());
  }, 1000);
}

function stopTelemetry() {
  if (listeners.size === 0 && intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export function useSystemTelemetry() {
  const [stats, setStats] = useState(currentStats);
  const [threadLoads, setThreadLoads] = useState(currentThreadLoads);
  // Using an arbitrary state to trigger history updates 
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => {
      setStats(currentStats);
      setThreadLoads(currentThreadLoads);
      setTick(t => t + 1);
    };

    listeners.add(listener);
    startTelemetry();

    return () => {
      listeners.delete(listener);
      stopTelemetry();
    };
  }, []);

  return { 
    stats, 
    threadLoads, 
    cpuHistory, 
    gpuHistory, 
    ramHistory, 
    vramHistory, 
    fpsHistory, 
    frameTimeHistory,
    setSimulatedStressProfile
  };
}
