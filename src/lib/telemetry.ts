import { useState, useEffect } from 'react';

type SystemStats = {
  cpu: number;
  ram: number;
  gpu: number;
  vram: number;
};

// Global state
let currentStats: SystemStats = {
  cpu: 18,
  ram: 42,
  gpu: 12,
  vram: 28,
};

let currentThreadLoads: number[] = Array(16).fill(0).map(() => Math.random() * 30);
let listeners: Set<() => void> = new Set();
let intervalId: any = null;

function startTelemetry() {
  if (intervalId) return;
  intervalId = setInterval(() => {
    currentStats = {
      cpu: Math.min(100, Math.max(5, currentStats.cpu + (Math.random() * 14 - 7))),
      ram: Math.min(100, Math.max(20, currentStats.ram + (Math.random() * 2 - 1))),
      gpu: Math.min(100, Math.max(2, currentStats.gpu + (Math.random() * 20 - 10))),
      vram: Math.min(100, Math.max(10, currentStats.vram + (Math.random() * 4 - 2)))
    };
    currentThreadLoads = Array(16).fill(0).map(() => Math.random() * 100);
    
    // History arrays for graphing
    cpuHistory.push(currentStats.cpu);
    if (cpuHistory.length > 30) cpuHistory.shift();
    
    gpuHistory.push(currentStats.gpu);
    if (gpuHistory.length > 30) gpuHistory.shift();
    
    ramHistory.push(currentStats.ram);
    if (ramHistory.length > 30) ramHistory.shift();
    
    listeners.forEach(listener => listener());
  }, 1000);
}

const cpuHistory: number[] = Array(30).fill(18);
const gpuHistory: number[] = Array(30).fill(12);
const ramHistory: number[] = Array(30).fill(42);

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

  return { stats, threadLoads, cpuHistory, gpuHistory, ramHistory };
}
